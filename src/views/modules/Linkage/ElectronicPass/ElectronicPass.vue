<template>
  <!-- 车辆黑名单信息 -->
  <div class="ElectronicPass">
     <div style="margin-bottom:10px;">
      <el-form :inline="true" @keyup.enter.native="getDataList()">
        <el-form-item>
      <el-select
        v-model="dataForm.enterprise"
        placeholder="请选择企业"
        style="min-width:100px;width:7vw;"
        clearable
        v-if="!limitView"
        class="searchMargin"
      >
        <el-option
          v-for="item in enterpriseData"
          :label="item.platformName"
          :value="item.id"
          :key="item.id"
        ></el-option>
      </el-select>

      <el-select
        v-model="dataForm.status"
        placeholder="请选择状态"
        style="min-width:100px;width:7vw;"
        class="searchMargin"
        clearable
      >
        <el-option label="待审核" value="-1"></el-option>
        <el-option label="已审核" value="0"></el-option>
        <el-option label="已驳回" value="-2"></el-option>
        <el-option label="已撤销" value="-3"></el-option>
        <el-option label="重新提交" value="-4"></el-option>
      </el-select>

      <div style="display:inline-block;position: relative;" class="searchMargin">
        <img
          class="searchIcon"
          src="data:image/svg+xml;base64,PHN2ZyB0PSIxNTczMDE4OTAxNTE3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM1MDgiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNODQ1LjMxNjgxIDgwNC4yNzkwMzMgNjY5LjgwNjExNiA2MjguNzY4MzM5YzM5LjI5ODAyMS00Ny43OTIxMjUgNjAuNjg2Nzg4LTEwNy4yNTA4NDkgNjAuNjg2Nzg4LTE2OS45ODQ0MDkgMC03MS42MzcwMTgtMjcuOTM4NDM3LTEzOC45NzU4MTUtNzguNDkzNzA0LTE4OS42MzM0Mi01MC42NTc2MDUtNTAuNjU3NjA1LTExNy45OTY0MDItNzguNDkzNzA0LTE4OS42MzM0Mi03OC40OTM3MDRzLTEzOC45NzU4MTUgMjcuOTM4NDM3LTE4OS42MzM0MiA3OC40OTM3MDRjLTUwLjY1NzYwNSA1MC42NTc2MDUtNzguNDkzNzA0IDExNy45OTY0MDItNzguNDkzNzA0IDE4OS42MzM0MnMyNy45Mzg0MzcgMTM4Ljk3NTgxNSA3OC40OTM3MDQgMTg5LjYzMzQyYzUwLjY1NzYwNSA1MC42NTc2MDUgMTE3Ljk5NjQwMiA3OC40OTM3MDQgMTg5LjYzMzQyIDc4LjQ5MzcwNCA2NS4zOTQzNjMgMCAxMjcuMjA2ODc2LTIzLjIzMDg2MSAxNzYuMDIyMzg3LTY1LjkwNjA1NmwxNzQuOTk5MDAxIDE3NC45OTkwMDFjNC40MDA1NiA0LjQwMDU2IDEwLjEzMTUyMSA2LjU0OTY3IDE1Ljk2NDgyMSA2LjU0OTY3czExLjU2NDI2MS0yLjE0OTExMSAxNS45NjQ4MjEtNi41NDk2N0M4NTQuMTE3OTI5IDgyNy4zMDUyMTcgODU0LjExNzkyOSA4MTMuMDgwMTUyIDg0NS4zMTY4MSA4MDQuMjc5MDMzek0yMzkuMjY3NjM5IDQ1OC43ODM5M2MwLTEyMy4wMTA5OTMgMTAwLjA4NzE0OC0yMjMuMDk4MTQxIDIyMy4wOTgxNDEtMjIzLjA5ODE0MXMyMjMuMDk4MTQxIDEwMC4wODcxNDggMjIzLjA5ODE0MSAyMjMuMDk4MTQxLTEwMC4wODcxNDggMjIzLjA5ODE0MS0yMjMuMDk4MTQxIDIyMy4wOTgxNDFTMjM5LjI2NzYzOSA1ODEuNzk0OTIzIDIzOS4yNjc2MzkgNDU4Ljc4MzkzeiIgcC1pZD0iMzUwOSIgZmlsbD0iIzhhOGE4YSI+PC9wYXRoPjwvc3ZnPg=="
          alt
        />
        <el-input
          style="min-width:200px;width:18vw;"
          v-model="dataForm.search"
          placeholder="请输入姓名、手机号码、身份证号码"
          clearable
        ></el-input>
      </div>
      <el-date-picker
        v-model="dataForm.time"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd"
        style="width:300px;"
        class="searchMargin"
      ></el-date-picker>

      <el-button @click="getDataList()" class="searchMargin">查询</el-button>
      <el-button
        @click="AddOrUpdate('','新增')"
        style="margin-left:0"
        class="searchMargin"
        v-if="isAuth('pass:passRegister:save')"
      >新增</el-button>
      <!-- <el-button>导入</el-button> -->
      <!-- <el-upload
        :with-credentials="true"
        :show-file-list="false"
        :data="{
              file: filename,
              url: 'http://localhost:8200/108ee3f1-9df4-4998-9112-17ee0b9f08db'
            }"
        :on-success="handleAvatarSuccess"
        :action="documenttoken"
        style="display: inline-flex;"
      >
        <el-tooltip placement="top" effect="light" v-if="isAuth('pass:passRegister:excel')">
          <div slot="content">
            请填写我们提供
            <br />的模板进行导入
          </div>
          <el-button
            element-loading-text="正在导入电子通行证列表，可能需要几分钟时间，请耐心等待.."
            class="buttonStyle searchMargin"
          >导入</el-button>
        </el-tooltip>
      </el-upload> -->
      <!-- <el-button
        @click="downloadtemplate()"
        class="buttonStyle searchMargin"
        v-if="isAuth('pass:passRegister:excel')"
      >导出模板</el-button> -->
      <el-button
        @click="openView('','删除')"
        :disabled="dataListSelections.length <= 0"
        style="margin-left:0"
        class="searchMargin"
        v-if="isAuth('pass:passRegister:deletePc')"
      >批量删除</el-button>
      <!-- <el-button>高级</el-button> -->
     </el-form-item>
      </el-form>
    </div>
    <div class="gongneng" v-if="isAuth('pass:passRegister:updateLockStatusPc')">
      <div>
        核验口令：{{checkCode}}&nbsp;&nbsp;
        <el-button @click="resetVerify()">重置</el-button>
        <el-button @click="addContactHandle">发送核验口令</el-button>
      </div>
      <div></div>
    </div>
    <div style="width:100%;position:relative;">
      <div style="width: 100%;min-width: 540px;display:inline-block;">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          @selection-change="selectionChangeHandle"
          max-height="650"
        >
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <!-- <el-table-column prop="id" header-align="center" align="center" label></el-table-column> -->
          <el-table-column prop="imName" header-align="center" align="center" label="姓名"></el-table-column>
          <el-table-column
            prop="platformNameString"
            header-align="center"
            align="center"
            label="所属企业"
          ></el-table-column>
          <!-- <el-table-column prop="humanTypeString" header-align="center" align="center" label="人员类型"></el-table-column> -->
          <el-table-column prop="phone" header-align="center" align="center" label="手机号码"></el-table-column>
          <el-table-column prop="credentialsNum" header-align="center" align="center" label="身份证号码"></el-table-column>
          <el-table-column prop="gmtCreate" header-align="center" align="center" label="登记时间"></el-table-column>
          <el-table-column
            prop="lockStatusString"
            header-align="center"
            align="center"
            label="通行证状态"
            width="120"
          >
            <template slot-scope="scope">
              <span
                :style="{color:scope.row.lockStatusString==='已审核'?'#0BD295':(scope.row.lockStatusString==='待审核'?'#F2B626':'#F85B47')}"
              >{{scope.row.lockStatusString}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="type" header-align="center" align="center" label></el-table-column> -->
          <el-table-column
            header-align="center"
            align="center"
            width="200"
            label="操作"
          >
            <template slot-scope="scope">
              <div
                style="display: flex;"
                :style="{'justify-content': (isAuth('pass:passRegister:update')||isAuth('pass:passRegister:updateLockStatusPc')||isAuth('pass:passRegister:deletePc'))?'space-between':'space-around'}"
              >
                <el-tooltip class="item" effect="dark" content="查看" placement="top">
                  <span class="see" @click="seeHandle(scope.row.id,'查看')"></span>
                </el-tooltip>
                <el-tooltip
                  v-if="isAuth('pass:passRegister:update')"
                  class="item"
                  effect="dark"
                  content="编辑"
                  placement="top"
                >
                  <span class="edit" @click="AddOrUpdate(scope.row.id,'编辑')"></span>
                </el-tooltip>
                <el-tooltip
                  v-if="isAuth('pass:passRegister:updateLockStatusPc') && (scope.row.lockStatusString==='待审核' || scope.row.lockStatusString==='重新提交')"
                  class="item"
                  effect="dark"
                  content="审核"
                  placement="top"
                >
                  <span class="examine" @click="seeHandle(scope.row.id,'审核')"></span>
                </el-tooltip>
                <el-tooltip
                  v-if="isAuth('pass:passRegister:updateLockStatusPc') && (scope.row.lockStatusString==='已审核')"
                  class="item"
                  effect="dark"
                  content="撤销"
                  placement="top"
                >
                  <span class="reject" @click="seeHandle(scope.row.id,'撤销')"></span>
                </el-tooltip>
                <el-tooltip
                  v-if="isAuth('pass:passRegister:deletePc')"
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top"
                >
                  <span class="delete" @click="openView(scope.row.id,'删除')"></span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          style="margin-left:50%;transform: translateX(-50%);width:100%;"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[20, 30, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
    <!-- 发送校验口令 -->
    <add-contact ref="AddContactView"></add-contact>

    <!-- 核验、锁定、解锁、删除 -->
    <change-status ref="changeStatusView" @deleteHandle="deleteHandle" @getDataList="getDataList"></change-status>

    <!-- 提示语 -->
    <el-dialog
      title="重要通知"
      :visible.sync="centerDialogVisible"
      width="500px"
      :close-on-click-modal='false'
      :showClose="false"
      center
      custom-class="ImporStyle">
      <span>
        {{inporInfo}}
      </span>
      <span slot="footer" class="dialog-footer">
        <span @click="centerDialogVisible=false" class="Iknow">我知道了</span>
      </span>
    </el-dialog>

    <!-- 重置口令 -->
    <reset ref="resetVerifyView" @udpateCode="getVerify"></reset>
  </div>
</template>

<script>
import AddContact from "../addContact/AddContact";
import bus from "../../../../views/common/js/eventBus";
import changeStatus from "./changeStatus";
import reset from "../../Troubleshooting/reset";
import Cookies from "js-cookie";
var httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  name: "Resumption",
  data() {
    return {
      dataForm: {
        key: "",
        status: "",
        taskType: "",
        search: "",
        enterprise: "",
        time: ""
      },
      enterpriseData: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      checkCode: "1234", //校验口令
      mailContactorArray: [], //发送校验口令联系人
      centerDialogVisible: false, //状态弹窗
      title: "",
      currentId: "", //当前行ID
      remark: "", //核验描述

      documenttoken: `${httpaddress}/pass/passRegister/xlsInput?token=${this.$cookie.get(
        "token"
      )}`,
      filename: "",
      platformId: this.$store.state.user.platformId,
      limitView: false, //权限视图
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      centerDialogVisible: false,
      inporInfo: '',//重要通知内容
    };
  },
  created() {
    this.handleTaskType();
    if(this.$route.query.page){
      // alert(this.$route.query.page)
      this.pageIndex = this.$route.query.page
    }
    this.getLimit();
    this.getDataList();
    this.getInporInfo()
    this.getVerify();
    // 重要通知弹窗一次
    if (this.$cookie.get("ElectronicPasseView")) {
      this.centerDialogVisible = true
      this.$cookie.set("ElectronicPasseView","")
    }
  },
  mounted() {
    // console.log('mounted-info',this.taskInfo)
    // 获取已选联系人人
    bus.$off("getCheckCharge");
    bus.$on("getCheckCharge", val => {
      if (val.length > 0) {
        this.$http({
          url: this.$http.adornUrl(`/pass/passCode/sendCodeToContactor`),
          method: "post",
          data: this.$http.adornData({ mailContactorArray: val.map(v => v.id) })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              type: "success",
              message: "发送成功"
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    });
  },
  methods: {
    // 获取重要通知信息
    getInporInfo(){
      this.$http({
        url: this.$http.adornUrl(
          `/sys/config/infoByKey?key=TXZ_TX_CONTENT`
        ),
        method: "get",
      }).then(({ data }) => {
        // console.log('data: ', data);

        if (data && data.code === 0) {
          this.inporInfo = data.config.paramValue;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 获取所有企业
    handleTaskType() {
      this.$http({
        url: this.$http.adornUrl(`/pass/passRegister/getsonPlatform`),
        method: "get"
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.enterpriseData = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //平台权限
    getLimit() {
      this.$http({
        url: this.$http.adornUrl(
          `/pass/passRegister/hideCode?platformId=${this.platformId}`
        ),
        method: "get"
      }).then(({ data }) => {
        // console.log(data)
        if (data.msg === "success") {
          if (data.code === "1") {
            this.limitView = true;
          } else {
            this.limitView = false;
          }
        } else {
          this.limitView = false;
          this.$message.error(data.msg);
        }
      });
    },
    // 获取校验口令
    getVerify() {
      this.$http({
        url: this.$http.adornUrl("/pass/passCode/getCode"),
        method: "post"
      }).then(({ data }) => {
        console.log(data);
        if (data.msg === "success") {
          this.checkCode = data.code;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 重置
    resetVerify(){
      this.$refs.resetVerifyView.init()
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/pass/passRegister/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          search: this.dataForm.search,
          lockStatus: this.dataForm.status,
          startTime: this.dataForm.time ? this.dataForm.time[0] : "",
          endTime: this.dataForm.time ? this.dataForm.time[1] : "",
          platformId: this.dataForm.enterprise
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data);
          this.dataList = data.data.list;
          if (this.dataList.length > 0) {
            this.dataList.map(v => {
              if (v.credentialsNum) {
                v.credentialsNum =
                  v.credentialsNum.substring(0, 6) +
                  "****" +
                  v.credentialsNum.substring(
                    v.credentialsNum.length - 6,
                    v.credentialsNum.length
                  );
              }
            });
          }
          this.totalPage = data.data.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
          this.$message.error(data.msg);
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 查看
    seeHandle(id, title) {
      this.$router.push({
        path: "/ElectronicPass-see",
        name: "ElectronicPass-see",
        query: {
          electronicId: id,
          title,
          checkCode: this.checkCode,
          page: this.pageIndex
        }
      });
    },
    // 新增/修改
    AddOrUpdate(id, title) {
      this.$router.push({
        path: "/ElectronicPass-AddOrEdit",
        name: "ElectronicPass-AddOrEdit",
        query: {
          electronicId: id,
          currentId: this.currentId,
          checkCode: this.checkCode,
          title,
          page: this.pageIndex
        }
      });
    },
    // 删除
    deleteHandle() {
      var ids = this.currentId
        ? [this.currentId]
        : this.dataListSelections.map(item => {
            return item.id;
          });
      this.$http({
        url: this.$http.adornUrl("/pass/passRegister/delete"),
        method: "post",
        data: this.$http.adornData({ ids })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.getDataList();
            }
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 发送校验口令
    addContactHandle() {
      console.log(this.$refs);
      this.$refs.AddContactView.getDataList([]);
    },
    // 树形复选框勾选ID
    setCheckedIds(checkedIds, checkedNodes) {
      this.checkedIds = checkedIds;
      // console.log('this.checkedIds', this.checkedIds)
      this.checkedNodes = checkedNodes;
    },
    // 更新状态
    openView(id, title) {
      this.currentId = id;
      this.$refs.changeStatusView.init(id, this.checkCode, title, 1);
    },
    // 上传成功的回调
    handleAvatarSuccess(response, file, fileList) {
      this.filename = file.name;
      // console.log('上传成功的回调', response)
      // console.log('上传成功的回调2', file)
      // console.log(fileList)
      if (file.response.errorData.length == 0) {
        this.$message({
          message: "导入成功!",
          type: "success"
        });
        this.getDataList();
      } else if (file.response.errorData.length > 0) {
        this.getDataList();
        this.errorDataVisible = true;
        this.$nextTick(() => {
          this.$refs.errorData.init(file.response.errorData); //
        });
      } else {
        this.$message.error({
          type: "error",
          message: `${file.response.msg}`
        });
      }
    },
    // 导出模板
    downloadtemplate() {
      window.location.href = `${httpaddress}/pass/passRegister/gettemplate?token=${Cookies.get(
        "token"
      )}`;
    }
  },
  components: {
    AddContact,
    changeStatus,
    reset,
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-card .el-card__body {
  background-color: #f0f0f0;
}
.ElectronicPass {
  .searchIcon {
    width: 22px;
    position: absolute;
    top: 10px;
    right: 20px;
    z-index: 1;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .gongneng {
    padding: 18px 0 18px 20px;
    background-color: white;
    display: flex;
    justify-content: space-between;
  }

  .see {
    width: 13.99px;
    height: 15.96px;
    cursor: pointer;
    background: url(../../../../assets/img/ElectronicPass/see.svg) no-repeat;
    background-size: 13.99px 15.96px;
  }
  .see:hover {
    width: 13.99px;
    height: 15.96px;
    background: url(../../../../assets/img/ElectronicPass/seeHover.png)
      no-repeat;
    background-size: 13.99px 15.96px;
  }
  .edit {
    width: 13.99px;
    height: 15.96px;
    cursor: pointer;
    background: url(../../../../assets/img/ElectronicPass/edit.svg) no-repeat;
    background-size: 13.99px 15.96px;
  }
  .edit:hover {
    width: 13.99px;
    height: 15.96px;
    background: url(../../../../assets/img/ElectronicPass/editHover.png)
      no-repeat;
    background-size: 13.99px 15.96px;
  }
  .locking {
    width: 13.99px;
    height: 15.96px;
    cursor: pointer;
    background: url(../../../../assets/img/ElectronicPass/locking.svg) no-repeat;
    background-size: 13.99px 15.96px;
  }
  .locking:hover {
    width: 13.99px;
    height: 15.96px;
    background: url(../../../../assets/img/ElectronicPass/lockingHover.png)
      no-repeat;
    background-size: 13.99px 15.96px;
  }
  .examine {
    width: 13.99px;
    height: 15.96px;
    cursor: pointer;
    background: url(../../../../assets/img/ElectronicPass/check.svg) no-repeat;
    background-size: 13.99px 15.96px;
  }
  .examine:hover {
    width: 13.99px;
    height: 15.96px;
    background: url(../../../../assets/img/ElectronicPass/checkHover.png)
      no-repeat;
    background-size: 13.99px 15.96px;
  }
  .unlock {
    width: 13.99px;
    height: 15.96px;
    cursor: pointer;
    background: url(../../../../assets/img/ElectronicPass/unlock.svg) no-repeat;
    background-size: 13.99px 15.96px;
  }
  .unlock:hover {
    width: 13.99px;
    height: 15.96px;
    background: url(../../../../assets/img/ElectronicPass/unlockHover.png)
      no-repeat;
    background-size: 13.99px 15.96px;
  }
  .reject {
    width: 13.99px;
    height: 15.96px;
    cursor: pointer;
    background: url(../../../../assets/img/ElectronicPass/reject.svg) no-repeat;
    background-size: 13.99px 15.96px;
  }
  .reject:hover {
    width: 13.99px;
    height: 15.96px;
    background: url(../../../../assets/img/ElectronicPass/rejectHover.png)
      no-repeat;
    background-size: 13.99px 15.96px;
  }
  .el-pagination {
    margin-top: 0;
    padding-top: 20px;
    background-color: white;
  }
  /deep/ .el-date-editor .el-range-separator {
    padding: 0;
    padding-right: 17px;
  }

  // 重要信息弹窗样式
  /deep/ .ImporStyle {
    border-radius: 10px;
    box-shadow: 0px 0px 15px 2px rgba(0,0,0,0.27);
    .el-dialog__header {
      padding: 25px 0px 0px 20px;
      span {
        color: #333;
        font-size: 22px;
        font-weight: bold;
      }
    }
    .el-dialog__body{
      color: #aaa;
      line-height: 34px;
      font-size: 21px;
      padding: 10px 10px 20px 20px;
      border-bottom:1px solid #f0f0f0;
    }
    .Iknow{
      font-size: 21px;
      color: dodgerblue;
      font-weight: 600;
      cursor: pointer;
    }
    .el-dialog__footer{
      padding: 20px;
    }
  }
}
</style>
