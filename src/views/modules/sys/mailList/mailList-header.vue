<template>
  <div>
    <grade-dropDown
      :plat-show="true"
      style="float:left;padding-top:0;margin-right: 10px;"
      :merge-node="true"
      @operationChange="operationChange"
    />
    <el-input
      v-model="state"
      style="width:300px;float: left;"
      placeholder="请输入姓名、联系方式搜索"
      clearable
      size="small"
      @keyup.enter.native="searchcontacts(state)"
    />

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

    <el-button
      slot="append"
      style="margin-left:15px;background-color：rgb(64, 158, 255);width:inherit;"
      type="primary"
      size="small"
      @click="searchcontacts(state)"
    >
      查询
    </el-button>
    <div style="display: inline-block;float: right;">
      <el-form
        :inline="true"
        @keyup.enter.native="getDataList()"
      >
        <!-- <el-button
          v-if="!$parent.$parent.sharedPlatform.noticeBarVisible"
          style="width:initial;"
          type="primary"
          size="small"
          @click="batchHandler"
        >
          批量授权
        </el-button> -->
        <!-- <el-button
          v-if="!$parent.$parent.sharedPlatform.noticeBarVisible"
          style="width:initial;"
          type="primary"
          size="small"
          @click="watchLeaderDialog"
        >
          查看负责人
        </el-button> -->

        <el-button
          v-if="!$parent.$parent.sharedPlatform.noticeBarVisible"
          style="width:initial;"
          type="primary"
          size="small"
          @click="peopleSortDialog()"
        >
          人员排序
        </el-button>

        <!-- <el-button
            style="width:initial;"
            size="medium"
            @click="peopleMenuDialog()"
          >分配权限</el-button> -->

        <!-- <el-button
          style="width:initial;"
          size="medium"
          type="primary"
          @click="getSharedPlatform()"
        >
          选择平台
        </el-button> -->

        <el-button
          v-if="
            isAuth('mail:mailcontactor:save') &&
              !$parent.$parent.sharedPlatform.noticeBarVisible
          "
          type="primary"
          size="small"
          @click="newcontactsHandle()"
        >
          新增
        </el-button>
        <!-- <el-button

            icon="el-icon-plus"
            style="background: rgba(255, 255, 255, 1);
                  border: 1px solid rgba(211, 215, 219, 1);
                  border-radius: 2px;
                  font-size: 12px;
                  font-family: MicrosoftYaHei;
                  font-weight: 400;
                  color: rgba(163, 163, 163, 1);"
            @click="invitedToJoin()"
            v-if="!$parent.$parent.sharedPlatform.noticeBarVisible"
          >邀请加入</el-button> -->

        <el-upload
          v-show="isPlatformRoot"
          ref="importData"
          :with-credentials="true"
          :show-file-list="false"
          :on-progress="beforeUploadFile"
          :on-error="handleError"
          :data="{
            file: filename,
            url: 'http://localhost:8200/108ee3f1-9df4-4998-9112-17ee0b9f08db'
          }"
          :on-success="handleAvatarSuccess"
          :action="documenttoken"
          :headers="{ token: $cookie.get('token') }"
          style="display: inline-flex; margin: 0 10px;"
        >
          <el-tooltip
            placement="top"
            effect="light"
          >
            <div slot="content">
              请填写我们提供<br>的模板进行导入
            </div>
            <el-button
              v-if="
                (isAuth('mail:mailgroup:xlsInput') &&
                  !$parent.$parent.sharedPlatform.noticeBarVisible)
              "
              v-loading.fullscreen.lock="fullscreenLoading"
              element-loading-text="正在导入通讯录，可能需要几分钟时间，请耐心等待.."
              type="primary"
              size="small"
            >
              导入
            </el-button>
          </el-tooltip>
        </el-upload>
        <el-button
          v-if="!$parent.$parent.sharedPlatform.noticeBarVisible"
          type="primary"
          size="small"
          @click="downloadtemplate()"
        >
          导出模板
        </el-button>
        <el-dropdown style="margin-left: 10px;">
          <el-button
            v-if="
              isAuth('mail:mailgroup:xlsOutput')
            "
            type="primary"
            size="small"
          >
            导出数据
          </el-button>
          <el-dropdown-menu
            slot="dropdown"
            split-button="true"
          >
            <el-dropdown-item
              @click.native="exportExcel()"
            >
              导出已选择数据
            </el-dropdown-item>
            <el-dropdown-item
              @click.native="exportExcelAll()"
            >
              导出所有数据
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import GradeDropDown from '../../../common/GradeDropDown.vue';

export default {
  components: {
    GradeDropDown,
  },
  props: ['documenttoken', 'uploadfilesname', 'fileList', 'filename'],
  data() {
    return {
      isPlatformRoot: true,
      // 联系人搜索
      contactsearch: '',
      fullscreenLoading: false,
      restaurants: [],
      state: '',
      timeout: null,
      platformId: '', // 平台id
    };
  },
  watch: {
    isPlatformRoot(newval) {
      console.log('%c [ newval ]', 'font-size:13px; background:pink; color:#bf2c9f;', newval);
    },
  },
  mounted() {
    // console.log("header $parent",this.$parent)
  },
  methods: {
    // 导入数据
    importData() {
      this.$refs.importData.$children[0].$refs.input.click();
    },
    // 是否选择的是本平台
    operationChange(isPlatformRoot, platformId) {
      this.platformId = platformId;
      this.$emit('platformChange', isPlatformRoot, platformId);
    },
    // 人员排序
    peopleSortDialog() {
      this.$emit('peopleSort');
    },
    // 分配权限
    peopleMenuDialog() {
      this.$emit('peopleMenuDialog');
    },
    querySearchAsync(queryString, cb) {
      // console.log(queryString)
      if (queryString != '') {
        this.$http({
          url: this.$http.adornUrl('/mail/mailcontactor/listOld'),
          method: 'POST',
          params: this.$http.adornParams({
            search: queryString,
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            // console.log(data.data)
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
      return (state) => (
        state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      );
    },
    // 搜索事件回调
    searchcontacts() {
      // console.log('======state======' + this.state)
      this.$emit('searchcontacts', this.state);
    },
    handleSelect(item) {
      this.state = item.name;
      this.searchcontacts();
      // console.log(item)
    },
    // 上传时的钩子
    beforeUploadFile(event, file, fileList) {
      this.fullscreenLoading = true;
      this.$emit('beforeUploadFile', event, file, fileList);
    },
    // 上传成功的回调
    handleAvatarSuccess(response, file, fileList) {
      this.fullscreenLoading = false;
      this.$emit('handleAvatarSuccess', response, file, fileList);
    },
    // 上传失败的回调
    handleError() {
      this.$emit('handleError');
    },
    // 批量处理授权
    batchHandler() {
      console.log(2222);
      this.$emit('batchHandler');
    },
    // 查看负责人窗口
    watchLeaderDialog() {
      this.$emit('watchLeaderDialog');
    },
    // 新增
    newcontactsHandle() {
      this.$emit('newcontactsHandle');
    },
    // 导出模板
    downloadtemplate() {
      this.$emit('downloadtemplate');
    },
    // 邀请加入
    invitedToJoin() {
      this.$emit('invitedToJoin', true);
    },
    // 获取共享平台
    getSharedPlatform() {
      this.$emit('getSharedPlatform', true);
    },
    // 导出模板
    downloadtemplate() {
      this.$emit('downloadtemplate');
    },
    // 导出数据
    exportExcel() {
      this.$emit('exportExcel', this.platformId);
    },
    exportExcelAll() {
      let flag;
      if (this.platformId === -1) {
        flag = true;
      } else {
        flag = false;
      }
      const request = {
        method: 'get',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: '/mail/mailgroup/xlsOutput',
        headers: {
          token: this.$cookie.get('token'),
        },
        params: {
          checkedIds: '',
          flag,
          platformId: this.platformId === -1 ? '' : this.platformId,
        },
        responseType: 'arraybuffer',
      };
      this.$http(request).then((response) => {
        if (response.data) {
          const a = document.createElement('a');
          a.target = '_blank';
          a.download = '导出通讯录所有数据.xls';
          a.href = window.URL.createObjectURL(new Blob([response.data]));
          a.click();
        }
      });
    },
    // 批量删除
    batchDelete() {
      this.$emit('batchDelete');
    },
  },
  createStateFilter(queryString) {
    return (state) => state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
  },
  // 搜索事件回调
  searchcontacts() {
    console.log(`======state======${this.state}`);
    this.$emit('searchcontacts', this.state);
  },
  handleSelect(item) {
    this.state = item.name;
    this.searchcontacts();
    console.log(item);
  },
  // 上传时的钩子
  beforeUploadFile(event, file, fileList) {
    this.fullscreenLoading = true;
    this.$emit('beforeUploadFile', event, file, fileList);
  },
  // 上传成功的回调
  handleAvatarSuccess(response, file, fileList) {
    this.fullscreenLoading = false;
    this.$emit('handleAvatarSuccess', response, file, fileList);
  },
  // 上传失败的回调
  handleError() {
    this.$emit('handleError');
  },
  // 新增
  newcontactsHandle() {
    this.$emit('newcontactsHandle');
  },
  // 导出模板
  downloadtemplate() {
    this.$emit('downloadtemplate');
  },
  // 邀请加入
  invitedToJoin() {
    this.$emit('invitedToJoin', true);
  },
  // 导出模板
  downloadtemplate() {
    this.$emit('downloadtemplate');
  },

  // 批量删除
  batchDelete() {
    this.$emit('batchDelete');
  },
};
</script>

<style lang="scss" scoped>
// .headerboxright{
//   position: absolute;
//   right: -35%;
// }
.buttonStyle {
  color: white !important;
  background-color: #0091ff !important;
  border-color: #0091ff !important;
}
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
