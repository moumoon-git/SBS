<template>
  <div>
    <el-form :inline="true" @keyup.enter.native="searchcontacts(state)">
      <el-form-item style="margin-bottom:0">
        <!--    <el-autocomplete-->
        <!--      v-model="state"-->
        <!--      :fetch-suggestions="querySearchAsync"-->
        <!--      placeholder="搜索联系人"-->
        <!--      @select="handleSelect"-->
        <!--    >-->
        <!--      <template slot-scope="{ item  }">-->
        <!--        <div class="name">{{ item .name}}</div>-->
        <!--      </template>-->
        <!--    </el-autocomplete>-->

        <el-select
          v-model="humanTypeValue"
          clearable
          placeholder="请选择人员类型"
          style="margin: 5px 0;"
          class="searchMargin"
        >
          <el-option
            v-for="item in humanTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <el-select
          v-model="attentionValue"
          clearable
          placeholder="请选择关注类型"
          style="margin: 5px 0"
          class="searchMargin"
        >
          <el-option
            v-for="item in attentionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <el-date-picker
          v-model="timeRange"
          value-format="yyyy-MM-dd"
          clearable
          style="margin: 5px 0"
          class="searchMargin"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>

        <el-input
          size="medium"
          v-model="state"
          style="width:300px;margin: 5px 0"
          class="searchMargin"
          placeholder="请输入名称、类型、描述搜索"
        ></el-input>
        <el-button
          slot="append"
          style="background-color：rgb(64, 158, 255);margin: 5px 0"
          class="buttonStyle searchMargin"
          @click="searchcontacts(state)"
        >查询</el-button>

        <!-- <div style="display: inline-block;margin-top: 10px;"> -->

        <!-- <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addNewTable()"
            v-if="isAuth('resoure:resourearticle:buttonStyle')" style="margin: 5px 0px;"
        >新增</el-button>-->

        <!-- <el-button
            type="danger"
            size="medium"
            icon="el-icon-close"
            @click="batchDelete()"
            v-if="isAuth('resoure:resourearticle:delete')" style="margin: 5px 0px;"
            >批量删除</el-button
        >-->
        <el-upload
          :with-credentials="true"
          :on-progress="beforeUploadFile"
          :show-file-list="false"
          :on-error="handleError"
          :data="{
              file: filename,
              url: 'http://localhost:8200/108ee3f1-9df4-4998-9112-17ee0b9f08db'
            }"
          :on-success="handleAvatarSuccess"
          :action="documenttoken"
          style="display: inline-flex;margin: 5px 0"
        >
          <el-tooltip placement="top" effect="light">
            <div slot="content">
              请填写我们提供
              <br />的模板进行导入
            </div>
            <el-button
              v-loading.fullscreen.lock="fullscreenLoading"
              element-loading-text="正在导入物资列表，可能需要几分钟时间，请耐心等待.."
              v-if="isAuth('resoure:resourearticle:xlsInput')"
              class="buttonStyle searchMargin"
            >导入</el-button>
          </el-tooltip>
        </el-upload>
        <el-button
          @click="downloadtemplate()"
          style="margin: 5px 0"
          class="buttonStyle searchMargin"
        >导出模板</el-button>
        <el-dropdown style="margin: 5px 0;">
          <el-button
            v-if="isAuth('resoure:resourearticle:xlsOutput')"
            style="margin: 5px 0"
            class="buttonStyle searchMargin"
          >导出数据</el-button>
          <el-dropdown-menu slot="dropdown" split-button="true">
            <!-- <el-dropdown-item @click.native="exportExcel()">导出已选择数据</el-dropdown-item> -->
            <el-dropdown-item @click.native="exportExcelAll()">导出所有数据</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>
    <!-- </div> -->
  </div>
</template>

<script>
import Cookies from "js-cookie";
export default {
  props: ["documenttoken", "uploadfilesname", "fileList", "filename"],
  data() {
    return {
      //联系人搜索
      contactsearch: "",
      fullscreenLoading: false,
      restaurants: [],
      state: "",
      timeout: null,
      timeRange: "",
      humanTypeOptions: [
        {
          value: "1",
          label: "本地常驻"
        },
        {
          value: "2",
          label: "外地返回"
        }
      ],
      attentionOptions: [
        {
          value: "1",
          label: "普通关注对象"
        },
        {
          value: "2",
          label: "重点关注对象"
        }
      ],
      humanTypeValue: "",
      attentionValue: ""
    };
  },
  methods: {
    // openFullScreen() {
    //   this.fullscreenLoading = true;
    // },
    querySearchAsync(queryString, cb) {
      // console.log(queryString);
      if (queryString != "") {
        this.$http({
          url: this.$http.adornUrl(`/mail/mailcontactor/listOld`),
          method: "POST",
          params: this.$http.adornParams({
            search: queryString
          })
        }).then(({ data }) => {
          if (data && data.code == 0) {
            // console.log(data.data);
            this.restaurants = data.data.list;

            // console.log(this.restaurants)
            // console.log(this.state)

            cb(this.restaurants);
          } else {
            this.$message.error(data.msg);
          }
        });
      } else {
        cb(null);
      }
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    //搜索事件回调
    searchcontacts() {
      // console.log("this.humanTypeValue,this.attentionValue,this.timeRange,this.state",this.humanTypeValue,this.attentionValue,this.timeRange,this.state)
      this.$emit(
        "searchcontacts",
        this.humanTypeValue,
        this.attentionValue,
        this.timeRange,
        this.state
      );
    },
    handleSelect(item) {
      this.state = item.name;
      this.searchcontacts();
      // console.log(item);
    },
    //上传时的钩子
    beforeUploadFile(event, file, fileList) {
      this.fullscreenLoading = true;
      this.$emit("beforeUploadFile", event, file, fileList);
    },
    //上传成功的回调
    handleAvatarSuccess(response, file, fileList) {
      this.fullscreenLoading = false;
      this.$emit("handleAvatarSuccess", response, file, fileList);
    },
    //上传失败的回调
    handleError() {
      this.$emit("handleError");
    },
    //新增
    addNewTable() {
      this.$emit("addNewTable");
    },
    //导出模板
    downloadtemplate() {
      this.$emit("downloadtemplate");
    },
    //导出数据
    exportExcel() {
      this.$emit("exportExcel");
    },
    exportExcelAll() {
      let httpaddress = window.SITE_CONFIG.baseUrl;
      let token = document.cookie;
      window.location.href = `${httpaddress}//epi/epiRegister/output-excel?humanType=${
        this.humanTypeValue
      }&concernType=${this.attentionValue}&search=${this.state}&startTime=${
        this.timeRange[0]
      }&endTime=${this.timeRange[1]}&page=${"1"}&limit=${"1000"}&platformId=${
        this.$store.state.user.platformId
      }&token=${Cookies.get("token")}`;
    },
    //批量删除
    batchDelete() {
      this.$emit("batchDelete");
    }
  }
};
</script>

<style lang="scss" scoped>
// .headerboxright{
//   position: absolute;
//   right: -35%;
// }
.el-button--primary {
  width: 88px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(211, 215, 219, 1);
  border-radius: 5px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(163, 163, 163, 1);
  text-align: center;
}
.el-button--danger {
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(211, 215, 219, 1);
  border-radius: 5px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(163, 163, 163, 1);
}
.el-button--success {
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(211, 215, 219, 1);
  border-radius: 5px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(163, 163, 163, 1);
}
</style>
