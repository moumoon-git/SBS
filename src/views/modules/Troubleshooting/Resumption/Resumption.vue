<template>
  <div class="Resumption">
    <div style="margin-bottom:10px;">
      <el-form :inline="true" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-select
            v-model="communityId"
            filterable
            default-first-option
            clearable
            @change="handleCommunity"
            placeholder="请选择所属社区"
            v-if="!limitView"
            style="min-width:120px;width:8vw;"
          >
            <el-option
              v-for="item in community"
              :key="item.id"
              :label="item.townName"
              :value="item.id"
            ></el-option>
          </el-select>

          <el-select
            v-model="marketId"
            filterable
            default-first-option
            clearable
            placeholder="请选择所属市场"
            v-if="!limitView"
            style="min-width:120px;width:8vw;"
          >
            <el-option
              v-for="item in market"
              :key="item.id"
              :label="item.platformName"
              :value="item.id"
            ></el-option>
          </el-select>

          <el-select
            v-model="auditStatusId"
            filterable
            default-first-option
            clearable
            placeholder="请选择状态"
            style="min-width:100px;width:6vw;"
          >
            <el-option
              v-for="item in auditStatus"
              :key="item.linkagePlatformId"
              :label="item.statusmName"
              :value="item.linkagePlatformId"
            ></el-option>
          </el-select>

          <el-select
            v-model="floorId"
            filterable
            default-first-option
            clearable
            placeholder="请选择楼层"
            style="min-width:100px;width:6vw;"
          >
            <el-option v-for="item in floor" :key="item.id" :label="item.name" :value="item.code"></el-option>
          </el-select>

          <el-select
            v-model="practitionersId"
            filterable
            default-first-option
            clearable
            placeholder="请选择从业状态"
            style="min-width:100px;width:8vw;"
          >
            <el-option v-for="item in practitioners" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>

          <div style="position:relative;display:inline-block;">
            <img
              class="searchIcon"
              src="data:image/svg+xml;base64,PHN2ZyB0PSIxNTczMDE4OTAxNTE3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM1MDgiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNODQ1LjMxNjgxIDgwNC4yNzkwMzMgNjY5LjgwNjExNiA2MjguNzY4MzM5YzM5LjI5ODAyMS00Ny43OTIxMjUgNjAuNjg2Nzg4LTEwNy4yNTA4NDkgNjAuNjg2Nzg4LTE2OS45ODQ0MDkgMC03MS42MzcwMTgtMjcuOTM4NDM3LTEzOC45NzU4MTUtNzguNDkzNzA0LTE4OS42MzM0Mi01MC42NTc2MDUtNTAuNjU3NjA1LTExNy45OTY0MDItNzguNDkzNzA0LTE4OS42MzM0Mi03OC40OTM3MDRzLTEzOC45NzU4MTUgMjcuOTM4NDM3LTE4OS42MzM0MiA3OC40OTM3MDRjLTUwLjY1NzYwNSA1MC42NTc2MDUtNzguNDkzNzA0IDExNy45OTY0MDItNzguNDkzNzA0IDE4OS42MzM0MnMyNy45Mzg0MzcgMTM4Ljk3NTgxNSA3OC40OTM3MDQgMTg5LjYzMzQyYzUwLjY1NzYwNSA1MC42NTc2MDUgMTE3Ljk5NjQwMiA3OC40OTM3MDQgMTg5LjYzMzQyIDc4LjQ5MzcwNCA2NS4zOTQzNjMgMCAxMjcuMjA2ODc2LTIzLjIzMDg2MSAxNzYuMDIyMzg3LTY1LjkwNjA1NmwxNzQuOTk5MDAxIDE3NC45OTkwMDFjNC40MDA1NiA0LjQwMDU2IDEwLjEzMTUyMSA2LjU0OTY3IDE1Ljk2NDgyMSA2LjU0OTY3czExLjU2NDI2MS0yLjE0OTExMSAxNS45NjQ4MjEtNi41NDk2N0M4NTQuMTE3OTI5IDgyNy4zMDUyMTcgODU0LjExNzkyOSA4MTMuMDgwMTUyIDg0NS4zMTY4MSA4MDQuMjc5MDMzek0yMzkuMjY3NjM5IDQ1OC43ODM5M2MwLTEyMy4wMTA5OTMgMTAwLjA4NzE0OC0yMjMuMDk4MTQxIDIyMy4wOTgxNDEtMjIzLjA5ODE0MXMyMjMuMDk4MTQxIDEwMC4wODcxNDggMjIzLjA5ODE0MSAyMjMuMDk4MTQxLTEwMC4wODcxNDggMjIzLjA5ODE0MS0yMjMuMDk4MTQxIDIyMy4wOTgxNDFTMjM5LjI2NzYzOSA1ODEuNzk0OTIzIDIzOS4yNjc2MzkgNDU4Ljc4MzkzeiIgcC1pZD0iMzUwOSIgZmlsbD0iIzhhOGE4YSI+PC9wYXRoPjwvc3ZnPg=="
              alt
            />
            <el-input
              style="width:230px;"
              v-model="dataForm.search"
              placeholder="请输入档主相关信息检索"
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
            style="min-width:300px;width:18vw;"
          ></el-date-picker>

          <el-button @click="getDataList()">查询</el-button>
          <!-- <el-button @click="AddOrUpdate('')" class="buttonStyle">新增</el-button> -->
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
            style="display: inline-flex;margin-left: 10px;"
          >
            <el-tooltip placement="top"  effect="light">
              <div slot="content">请填写我们提供<br/>的模板进行导入</div>
              <el-button
                v-loading.fullscreen.lock="fullscreenLoading"
                element-loading-text="正在导入电子通行证列表，可能需要几分钟时间，请耐心等待.."
                icon="el-icon-upload"
                type="success"
                class="buttonStyle"
              >导入
              </el-button>
            </el-tooltip>

          </el-upload>
          <el-button
            icon="el-icon-download "
            type="success"
            @click="downloadtemplate()"
            class="buttonStyle"
            style="margin-left: 10px;"
            >导出模板</el-button
          >-->
          <el-dropdown v-if="isAuth('buss:bussRegister:excel')">
            <el-button>导出档口数据</el-button>
            <el-dropdown-menu slot="dropdown" split-button="true">
              <el-dropdown-item @click.native="exportStalls()">导出勾选表格数据</el-dropdown-item>
              <el-dropdown-item @click.native="exportAllStalls()">导出条件查询数据</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown v-if="isAuth('buss:bussRegister:excel')">
            <el-button>导出员工数据</el-button>
            <el-dropdown-menu slot="dropdown" split-button="true">
              <el-dropdown-item @click.native="exportStaff()">导出勾选表格数据</el-dropdown-item>
              <el-dropdown-item @click.native="exportAllstaff()">导出条件查询数据</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            @click="openView('')"
            :disabled="dataListSelections.length <= 0"
            v-if="isAuth('buss:bussRegister:delete')"
          >批量删除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="gongneng" v-if="isAuth('buss:bussRegister:updateLockStatusPc')||isAuth('buss:bussMessage:sendBussMsg')">
      <div>
        <template v-if="isAuth('buss:bussRegister:updateLockStatusPc')">
          核验口令：{{checkCode}}&nbsp;&nbsp;
          <el-button @click="resetVerify()">重置</el-button>
          <el-button @click="addContactHandle">发送核验口令</el-button>
        </template>
        <!-- <el-button @click="SMSreport" v-if="isAuth('buss:bussMessage:sendBussMsg')">短信报告</el-button> -->
      </div>
      <div>
        <el-button @click="toTipHandle('驳回')" v-if="isAuth('buss:bussRegister:updateLockStatusPc')">批量驳回</el-button>
        <el-button @click="toTipHandle('撤销')" v-if="isAuth('buss:bussRegister:updateLockStatusPc')">批量撤销</el-button>
      </div>
    </div>
    <div style="width:100%;position:relative;">
      <div style="width: 100%;min-width: 540px;display:inline-block;">
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          @selection-change="selectionChangeHandle"
          height="650"
        >
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <!-- <el-table-column prop="id" header-align="center" align="center" label></el-table-column> -->

          <el-table-column
            prop="imName"
            header-align="center"
            align="center"
            label="档主姓名"
            width="80"
          ></el-table-column>
          <el-table-column
            prop="sexString"
            header-align="center"
            align="center"
            label="档主性别"
            width="80"
          ></el-table-column>
          <!-- <el-table-column prop="humanTypeString" header-align="center" align="center" label="人员类型"></el-table-column> -->
          <el-table-column
            prop="credentialsNum"
            header-align="center"
            align="center"
            label="档主身份证号码"
          ></el-table-column>
          <el-table-column
            prop="phone"
            header-align="center"
            align="center"
            label="档主手机号码"
            width="120"
          ></el-table-column>
          <el-table-column prop="townNameString" header-align="center" align="center" label="所属社区" width="120"></el-table-column>
          <el-table-column
            prop="platformNameString"
            header-align="center"
            align="center"
            label="所属市场"
            width="120"
          ></el-table-column>
          <el-table-column prop="floorString" header-align="center" align="center" label="所属楼层" width="100"></el-table-column>
          <el-table-column prop="bussCode" header-align="center" align="center" label="档口编号"></el-table-column>
          <el-table-column
            prop="empSize"
            header-align="center"
            align="center"
            label="从业人员数"
            width="100"
          ></el-table-column>
          <el-table-column
            prop="gmtCreate"
            header-align="center"
            align="center"
            label="登记时间"
          ></el-table-column>
          <el-table-column
            prop="lockStatusString"
            header-align="center"
            align="center"
            label="状态"
            width="80"
          >
            <template slot-scope="scope">
              <span
                :style="{color:scope.row.lockStatusString==='已审核'?'#0BD295':(scope.row.lockStatusString==='待审核'?'#F2B626':'#F85B47')}"
              >{{scope.row.lockStatusString}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="type" header-align="center" align="center" label></el-table-column> -->
          <el-table-column header-align="center" align="center" width="150" label="操作">
            <template slot-scope="scope">
              <div
                style="display: flex;"
                :style="{'justify-content': (isAuth('buss:bussRegister:updateLockStatusPc')||isAuth('buss:bussRegister:delete'))?'space-between':'space-around'}"
              >
                <el-tooltip class="item" effect="dark" content="查看" placement="top">
                  <span class="see" @click="seeHandle(scope.row.id,'查看')"></span>
                </el-tooltip>
                <!-- <el-tooltip v-if="limitView" class="item" effect="dark" content="修改" placement="top">
                <span class="edit"  @click="AddOrUpdate(scope.row.id)"></span>
                </el-tooltip>-->
                <el-tooltip
                  v-if="isAuth('buss:bussRegister:updateLockStatusPc') && (scope.row.lockStatusString==='待审核' || scope.row.lockStatusString==='重新提交')"
                  class="item"
                  effect="dark"
                  content="审核"
                  placement="top"
                >
                  <span class="examine" @click="seeHandle(scope.row.id,'审核')"></span>
                </el-tooltip>
                <el-tooltip
                  v-if="isAuth('buss:bussRegister:updateLockStatusPc') && (scope.row.lockStatusString==='已审核')"
                  class="item"
                  effect="dark"
                  content="撤销"
                  placement="top"
                >
                  <span class="reject" @click="seeHandle(scope.row.id,'撤销')"></span>
                </el-tooltip>
                <el-tooltip
                  v-if="isAuth('buss:bussRegister:delete')"
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
    <add-contact v-if="AddContactView" ref="AddContactView"></add-contact>

    <!-- 核验、锁定、解锁、删除 -->
    <change-status ref="changeStatusView" @deleteHandle="deleteHandle"></change-status>

    <!-- 提示语 -->
    <el-dialog
      title="重要通知"
      :visible.sync="centerDialogVisible"
      width="500px"
      :close-on-click-modal="false"
      :showClose="false"
      center
      custom-class="ImporStyle"
    >
      <span>{{inporInfo}}</span>
      <span slot="footer" class="dialog-footer">
        <span @click="centerDialogVisible=false" class="Iknow">我知道了</span>
      </span>
    </el-dialog>

    <!-- 短信报告 -->
    <SMS-report  ref="SMSreportView"></SMS-report>

    <!-- 重置口令 -->
    <reset ref="resetVerifyView" @udpateCode="getVerify"></reset>

    <!-- 批量撤销、驳回 -->
    <revoke-and-reject ref="RevokeAndRejectView" @udpateCode="getVerify" v-if="RevokeAndRejectView" @getDataList="getDataList"></revoke-and-reject>
  </div>
</template>

<script>
import AddContact from "../addContact/AddContact";
import bus from "../../../../views/common/js/eventBus";
import changeStatus from "./changeStatus";
import SMSReport from "./SMSReport";
import Cookies from "js-cookie";
import reset from "../reset";
import RevokeAndReject from "./RevokeAndReject";

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
        time: ""
      },
      typeData: [],
      statusData: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      checkCode: "1234", //校验口令
      mailContactorArray: [], //发送校验口令联系人
      title: "",
      currentId: "", //当前行ID
      remark: "", //核验描述

      documenttoken: `${httpaddress}/pass/passRegister/xlsInput?token=${this.$cookie.get(
        "token"
      )}`,
      filename: "",
      platformTypeId: 5,
      platformId: this.$store.state.user.platformId,
      community: [], //社区
      communityId: "",
      market: [], //市场
      marketId: "",
      auditStatus: [
        { statusmName: "待审核", linkagePlatformId: -1 },
        { statusmName: "已审核", linkagePlatformId: 0 },
        { statusmName: "已驳回", linkagePlatformId: -2 },
        { statusmName: "已撤销", linkagePlatformId: -3 },
        { statusmName: "重新提交", linkagePlatformId: -4 },
      ], //审核状态
      auditStatusId: "",
      floor: [], //楼层
      floorId: [], //楼层
      practitionersId: '',
      practitioners: [{name:'未添加',id:0},{name:'已添加',id:1}],
      AddContactView: false, //口令视图
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
      inporInfo: "", //重要通知内容
      SMSNum: 0 ,//短信数量
      RevokeAndRejectView: false, //批量驳回/删除
    };
  },
  created() {
    this.handleTaskType();
    this.handleStatusType();
    if(this.$route.query.page){
      // alert(this.$route.query.page)
      this.pageIndex = this.$route.query.page
    }

    this.getTownList();
    this.getLimit();
    this.getFloorList();
    this.getDataList();
    this.getInporInfo();
    if (this.$cookie.get("EnterpriseView")) {
      this.centerDialogVisible = true;
      this.$cookie.set("EnterpriseView", "");
    }
  },
  mounted() {
    // console.log('mounted-info',this.taskInfo)
    // 获取已选联系人人
    bus.$off("getCheckCharge");
    bus.$on("getCheckCharge", val => {
      this.AddContactView = false;
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
    getInporInfo() {
      this.$http({
        url: this.$http.adornUrl(`/sys/config/infoByKey?key=FG_TX_CONTENT`),
        method: "get"
      }).then(({ data }) => {
        console.log("data: ", data);

        if (data && data.code === 0) {
          this.inporInfo = data.config.paramValue;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 获取任务类型
    handleTaskType() {
      this.$http({
        url: this.$http.adornUrl(
          `/event/eventType/selectTypeByTypeFlagParentNoZero`
        ),
        method: "get",
        params: this.$http.adornParams({ typeFlag: 8 })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.typeData = data.list;
        } else {
          this.$message.error(data.msg);
        }
      });

      this.$http({
        url: this.$http.adornUrl(
          `/epi/epiRegisterTiku/getTiKuByType?platformId=0&type=3`
        ),
        method: "get"
      }).then(({ data }) => {
        console.log("/upload/platformImages", data);
        if (data && data.code === 0) {
          // this.detailData.tikuId = data.data.id;
          // this.registeinfor = [...data.data.epiQuestionEntityList];
          // this.registeinfor.map(v => {
          //   if (
          //     v.topicName === "单选题" ||
          //     v.topicName === "混答+单选" ||
          //     v.topicName === "混答+多选"
          //   ) {
          //     v.answer = [];
          //     v.remark = '';
          //   } else if (
          //     v.topicName === "简答-文本" ||
          //     v.topicName === "简答-输入"
          //   ) {
          //     v.answer = "";
          //     v.remark = "";
          //   }
          // });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 获取状态类型
    handleStatusType() {
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode`
        ),
        method: "get",
        params: this.$http.adornParams({ code: "task_status" })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.statusData = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 获取社区
    getTownList() {
      this.$http({
        url: this.$http.adornUrl("/buss/bussRegister/getTownByPlatformId"),
        method: "get"
      })
        .then(({ data }) => {
          // console.log('getTownList', data)

          // 说明有共享数据
          if (data.data.length > 0) {
            this.community = data.data;
          }
        })
        .then(() => {});
    },

    //社区决定市场
    handleCommunity() {
      if (this.communityId != null && this.communityId != "") {
        this.$http({
          url: this.$http.adornUrl("/buss/bussRegister/getPlatformIdByTown"),
          method: "post",
          params: this.$http.adornParams({
            townId: this.communityId
          })
        })
          .then(({ data }) => {
            // 说明有共享数据
            if (data.data.length > 0) {
              this.market = data.data;
            } else {
              this.marketId = "";
              this.market = [];
            }
          })
          .then(() => {});
      } else {
        this.marketId = "";
        this.market = [];
      }
    },
    // 获取楼层
    getFloorList() {
      this.$http({
        url: this.$http.adornUrl(
          "/sys/sysdictionary/getSysDictionaryListByCode?code=floor"
        ),
        method: "get"
      })
        .then(({ data }) => {
          // console.log('getTownList', data)

          // 说明有共享数据
          if (data.data.length > 0) {
            this.floor = data.data;
          }
        })
        .then(() => {});
    },
    //平台权限
    getLimit() {
      this.$http({
        url: this.$http.adornUrl(
          `/buss/bussRegister/hideCode?platformId=${this.platformId}`
        ),
        method: "get"
      }).then(({ data }) => {
        // console.log(data)
        if (data.msg === "success") {
          this.getVerify();
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
    resetVerify() {
      this.$refs.resetVerifyView.init();
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/buss/bussRegister/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          search: this.dataForm.search,
          platformId: this.marketId,
          townId: this.communityId,
          floor: this.floorId,
          lockStatus: this.auditStatusId,
          startTime: this.dataForm.time ? this.dataForm.time[0] : "",
          endTime: this.dataForm.time ? this.dataForm.time[1] : "",
          practitionersId: this.practitionersId,
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
        path: "/Resumption-see",
        name: "Resumption-see",
        query: {
          electronicId: id,
          title: title ? title : undefined,
          checkCode: this.checkCode,
          page: this.pageIndex
        }
      });
    },
    // 新增/修改
    AddOrUpdate(id) {
      this.$router.push({
        path: "/Resumption-AddOrEdit",
        name: "Resumption-AddOrEdit",
        query: {
          electronicId: id,
          currentId: this.currentId,
          checkCode: this.checkCode
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
        url: this.$http.adornUrl("/buss/bussRegister/delete"),
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
      // console.log(this.$refs);
      this.AddContactView = true;
      this.$nextTick(() => {
        this.$refs.AddContactView.getDataList([]);
      });
    },
    // 树形复选框勾选ID
    setCheckedIds(checkedIds, checkedNodes) {
      this.checkedIds = checkedIds;
      // console.log('this.checkedIds', this.checkedIds)
      this.checkedNodes = checkedNodes;
    },
    // 更新状态
    openView(id) {
      this.currentId = id;
      this.$refs.changeStatusView.init();
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
    // downloadtemplate () {
    //   window.location.href = `${httpaddress}/pass/passRegister/gettemplate?token=${Cookies.get('token')}`
    // },
    // 导出勾选列表档口数据
    exportStalls() {
      // console.log(multipleSelection)
      if (this.dataListSelections.length > 0) {
        let ids = this.dataListSelections.map(v => {
          return v.id;
        });
        window.location.href = `${httpaddress}/buss/bussRegister/output-bussRegister?ids=${ids}&token=${Cookies.get(
          "token"
        )}`;
      } else {
        this.$message.warning("请勾选表格");
      }
    },
    // 导出条件查询档口数据
    exportAllStalls() {
      window.location.href = `${httpaddress}/buss/bussRegister/output-bussRegisterByCondition?page=${
        this.pageIndex
      }&limit=${this.pageSize}&search=${this.dataForm.key}&platformId=${
        this.marketId
      }&lockStatus=${this.auditStatusId}&townId=${
        this.communityId
      }&token=${Cookies.get("token")}&reportType=3&startTime=${
        this.dataForm.time ? this.dataForm.time[0] : ""
      }&endTime=${this.dataForm.time ? this.dataForm.time[1] : ""}`;
    },
    // 导出勾选列表员工数据
    exportStaff() {
      // console.log(multipleSelection)
      if (this.dataListSelections.length > 0) {
        let ids = this.dataListSelections.map(v => {
          return v.id;
        });
        window.location.href = `${httpaddress}/buss/bussRegister/output-bussRegisterEmployee?ids=${ids}&token=${Cookies.get(
          "token"
        )}`;
      } else {
        this.$message.warning("请勾选表格");
      }
    },
    // 导出条件查询员工数据
    exportAllstaff() {
      window.location.href = `${httpaddress}/buss/bussRegister/output-bussRegisterEmployeeByCondition?page=${
        this.pageIndex
      }&limit=${this.pageSize}&search=${this.dataForm.key}&platformId=${
        this.marketId
      }&lockStatus=${this.auditStatusId}&townId=${
        this.communityId
      }&token=${Cookies.get("token")}&reportType=6&startTime=${
        this.dataForm.time ? this.dataForm.time[0] : ""
      }&endTime=${this.dataForm.time ? this.dataForm.time[1] : ""}`;
    },
    // 短信报告视图
    SMSreport() {
      this.getSMSNum();
      setTimeout(()=>{
        this.$refs.SMSreportView.init(this.SMSNum);
      },300)
    },
    // 获取剩余短信数量
    getSMSNum() {
      this.$http({
        url: this.$http.adornUrl("/message/messageinfor/getSurplusMessageSum"),
        method: "get",
        params: this.$http.adornParams({})
      }).then(data => {
        if (data.data.code === 0) {
          // console.log("data: ", data);
          this.SMSNum = data.data.messageSum;
        } else {
          this.$message.error(data.data.msg);
        }
      });
    },
    // 批量驳回/撤销
    toTipHandle(title){
      if (this.dataListSelections.length>0) {
        this.RevokeAndRejectView = true
        this.$nextTick(()=>{
          this.$refs.RevokeAndRejectView.init(title,this.dataListSelections,this.checkCode)
        })
      }else{
        this.$message.error('请勾选需要批量的数据')
      }
    },
    tosend(content){
      this.$http({
        url: this.$http.adornUrl("/buss/bussMessage/sendRegisterMsg"),
        method: "post",
        data: this.$http.adornData({
            ids: this.dataListSelections,
            content,
        })
      }).then(({ data }) => {
        // console.log(data);
        if (data.code == 0) {
          this.$message({
            type: "success",
            message:'发送成功',
          });
          this.SendSMSView = false
        } else {
          this.$message.error(data.msg)
        }
      });
    }
  },
  components: {
    AddContact,
    changeStatus,
    SMSReport,
    reset,
    RevokeAndReject,
  }
};
</script>
<style lang="scss" scoped>
// /deep/ .el-table .cell:nth-of-type(6){
//   display: flex;
//   justify-content: space-between;
// }

/deep/ .el-card .el-card__body {
  background-color: #f0f0f0;
}
.Resumption {
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
    align-items: center;
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
  .examine {
    width: 13.99px;
    height: 15.96px;
    cursor: pointer;
    background: url(../../../../assets/img/ElectronicPass/examine.png) no-repeat;
    background-size: 13.99px 15.96px;
  }
  .examine:hover {
    width: 13.99px;
    height: 15.96px;
    background: url(../../../../assets/img/ElectronicPass/examineHover.png)
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
  /deep/ .ImporStyle {
    border-radius: 10px;
    box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.27);
    .el-dialog__header {
      padding: 25px 0px 0px 20px;
      span {
        color: #333;
        font-size: 22px;
        font-weight: bold;
      }
    }
    .el-dialog__body {
      color: #aaa !important;
      line-height: 34px;
      font-size: 21px;
      padding: 10px 10px 20px 20px;
      border-bottom: 1px solid #f0f0f0;
    }
    .el-dialog__footer {
      padding: 20px;
      .Iknow {
        font-size: 21px;
        color: dodgerblue;
        font-weight: 600;
        cursor: pointer;
      }
    }
  }
  // 条件按钮
  // /deep/ .el-button--medium{
  //   padding: 10px;
  // }
}
</style>
