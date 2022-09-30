<template>
  <div class="contair">
    <!-- <el-input
      size="medium"
      v-model="state"
      style="width:300px;float: left;"
      placeholder="请输入摄像头名称搜索"
      @input="searchcontacts(state)"
      @keyup.delete.native="showSearch"
    >
    </el-input>-->
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
      style="min-width:1350px;"
    >
      <el-form-item>
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          unlink-panels
          v-model="dataForm.startEndAt"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-input
          class="search"
          v-model="dataForm.cameraName"
          placeholder="请输入摄像头名称或摄像头编码搜索"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.typeId" placeholder="请选择摄像头类型" clearable>
          <el-option
            v-for="item in cameraTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-select v-model="dataForm.statusId" placeholder="请选择摄像头状态" clearable>
          <el-option
            v-for="item in cameraStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          @click="getDataList()"
          style="background: #409eff;color: #fff;margin-left: initial;"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <ul class="searchList" v-if="searchState">
      <li
        v-for="(item,index) in searchData"
        :key="item.id"
        @click="playVideo(searchData,index)"
      >{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
import bus from "../../../common/js/eventBus";
export default {
  props: [
    "documenttoken",
    "uploadfilesname",
    "fileList",
    "filename",
    "modifiedUserList"
  ],
  data() {
    return {
      state: "",
      searchData: [],
      searchState: false,
      dataForm: {
        startEndAt: "",
        cameraName: "",
        typeId: "",
        statusId: ""
      },
      cameraTypeOptions: [
        {
          value: 0,
          label: "人的摄像头"
        },
        {
          value: 1,
          label: "车的摄像头"
        },
        {
          value: 2,
          label: "预览的摄像头"
        }
      ],
      cameraStatusOptions: [
        { value: 0, label: "可用" },
        { value: 1, label: "不可用" }
      ]
    };
  },
  methods: {
    // 搜索事件回调
    searchcontacts() {
      this.searchState = true;
      this.$http({
        url: this.$http.adornUrl(
          "/risk/riskcamera/getList?platfirmId=27&token=7396d88fee58f41f658fd8a1aab577db&key=" +
            this.state
        ),
        method: "get"
      }).then(({ data }) => {
        // console.log(data)
        if (data && data.code === 0) {
          if (data.data.records.length == 0) {
            this.searchData = [{ name: "暂无数据" }];
          } else {
            this.searchData = data.data.records;
          }
          // console.log(this.searchData)
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 点击列表显示视频
    playVideo(searchData, idx) {
      // alert(this.modifiedUserList)
      this.modifiedUserList[0].children.map((v, i) => {
        this.modifiedUserList[0].children[i].children.map((item, j) => {
          // console.log(item)
          if (item.children[j].townName == searchData[idx].name) {
            bus.$emit("getSign", item.children[j]);
          }
        });
      });
      // console.log(item[idx].name)
      if (item.length != 1) {
      }
    },
    // 搜索
    getDataList() {
      this.$emit("initData", this.dataForm);
    }
  }
};
</script>

<style lang="scss" scoped>
.searchList {
  width: 300px;
  position: absolute;
  top: 8%;
  left: 3%;
  list-style: none;
  line-height: 22px;
  z-index: 1;
  height: 210px;
  overflow: auto;
  background-color: #ffffff;
  border: 1px solid #ccc;
  padding: 0.5vh 0.5vw;
  border-radius: 5px;
  &::-webkit-scrollbar {
    width: 0 !important;
  }
}
</style>
