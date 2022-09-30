<template>
  <div class="shgl-all-container">
    <!-- 页面切换标签 -->
    <el-tabs v-model="activeTab" type="card" @tab-click="handleClick">
      <el-tab-pane label="集体奖励激励申请" name="3"></el-tab-pane>
      <el-tab-pane label="个人奖励激励申请" name="2"></el-tab-pane>
      <el-tab-pane label="其他奖励和慰问申请" name="1"></el-tab-pane>
      <el-tab-pane label="巡查车辆登记审核" name="4"></el-tab-pane>
      <el-tab-pane label="群防岗亭登记审核" name="5"></el-tab-pane>
      <el-tab-pane label="成员入职审核" name="6"></el-tab-pane>
    </el-tabs>
    <!-- 前面3个标签的内容，只是查询条件不同 -->
    <div
      style="height: 100%"
      v-show="activeTab == '1' || activeTab == '2' || activeTab == '3'"
    >
      <!-- 第一行统计数据 -->
      <div class="header-stats">
        <!-- 审核状态统计值 -->
        <div>
          总人数：
          <span style="color: #333333">{{ auditStatusStat.stat1 }}</span>
        </div>
        <div>
          待审核：
          <span style="color: #f2b626">{{ auditStatusStat.stat2 }}</span>
        </div>
        <div>
          已审核：
          <span style="color: #0bd295">{{ auditStatusStat.stat3 }}</span>
        </div>
        <div>
          已驳回：
          <span style="color: #f66e6e">{{ auditStatusStat.stat4 }}</span>
        </div>
        <div>
          待提交：
          <span style="color: #666666">{{ auditStatusStat.stat5 }}</span>
        </div>

        <div>预览&下载政策文件</div>
      </div>
      <!-- 第二行筛选 -->
      <div class="header-operation">
        <!-- 奖励类型选择框 -->
        <el-select
          @change="conditionalList"
          clearable
          class="input-select"
          v-model="awardType"
          placeholder="选择奖励类型"
        >
          <el-option
            v-for="item in awardTypeOptions"
            :key="item.id"
            :label="item.registerName"
            :value="item.id"
          ></el-option>
        </el-select>
        <!-- 审核状态选择框 -->
        <el-select
          @change="conditionalList"
          clearable
          class="input-select"
          v-model="auditStatus"
          placeholder="审核状态"
        >
          <el-option
            v-for="item in auditStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- 日期范围选择框 -->
        <!-- <div class="date-block">
          <el-date-picker
            v-model="dateTime"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </div>-->
        <div class="date-block">
          <el-date-picker
            class="date-range"
            v-model="dateTime"
            type="daterange"
            align="right"
            value-format="yyyy-MM-dd"
            clearable
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="conditionalList"
          ></el-date-picker>
        </div>
        <!-- 表单输入框和按钮 -->
        <div class="search-container">
          <input
            placeholder="请输入关键字"
            v-model="tableInput"
            @change="conditionalList"
          />
          <div
            v-if="tableInput"
            class="search-icon el-icon-close"
            @click="
              tableInput = '';
              conditionalList();
            "
          ></div>
          <div v-else class="search-icon el-icon-search"></div>
        </div>

        <div
          class="more-button-container"
          :class="moreBtnIsFocus ? 'more-button-focus' : 'more-button-unfocus'"
        >
          <div @click="moreBtnIsFocus = !moreBtnIsFocus">
            <span>更多</span>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <div class="more-button-content">
            <div class="more-button-content-item-header">导出</div>
            <div class="more-button-content-item" @click="exportSelectAll()">
              导出已选择数据
            </div>
            <div class="more-button-content-item" @click="conditionExport()">
              导出所有查询数据
            </div>
          </div>
        </div>

        <!-- <el-button>导入</el-button>
        <el-dropdown style="margin-right: 10px;">
          <el-button plain>
            <img src="../../../../assets/img/download.svg" />导出
          </el-button>
          <el-dropdown-menu slot="dropdown" split-button="true">
            <el-dropdown-item @click.native="conditionExport">条件导出</el-dropdown-item>
            <el-dropdown-item @click.native="exportSelectAll()">无条件导出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>-->
      </div>

      <!-- 列表的内容 -->
      <div class="shgl-content-table">
        <el-table
          height="100%"
          border
          @selection-change="rewardDataChange"
          :data="tableData"
          v-loading="loading"
        >
          <el-table-column
            v-if="moreBtnIsFocus"
            type="selection"
            header-align="left"
            align="center"
            width="55"
          ></el-table-column>
          <el-table-column
            prop="id"
            label="文档编号"
            width="100"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="tikuIdString"
            label="奖励类型"
            width="300"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="reportIdString"
            label="申报对象"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="rewardAmount"
            label="申领奖励金额"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="platformName"
            label="填报单位"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="reportTime"
            label="申报时间"
            align="center"
          ></el-table-column>
          <el-table-column prop="statusString" label="状态" align="center">
            <template slot-scope="scope">
              <span
                v-if="scope.row.statusString === '待提交'"
                style="color: #000000"
                >待提交</span
              >
              <span
                v-if="scope.row.statusString === '待审核'"
                style="color: #f59a23"
                >待审核</span
              >
              <span
                v-if="scope.row.statusString === '已审核'"
                style="color: #70b603"
                >已审核</span
              >
              <span
                v-if="scope.row.statusString === '已驳回'"
                style="color: #d9001b"
                >已驳回</span
              >
            </template>
          </el-table-column>
          <el-table-column prop label="操作" width="100" align="center">
            <template slot-scope="scope">
              <!-- <el-button
                v-if="scope.row.statusString==='待审核'&&nowPlatForm==scope.row.nextPlatformId"
                type="primary"
                @click="showAudit(scope.row)"
              >审核</el-button>
              <el-button
                v-if="scope.row.statusString==='已审核'||scope.row.statusString==='已驳回'||scope.row.nextPlatformId!=nowPlatForm"
                type="text"
                @click="showCheck(scope.row)"
              >查看</el-button>-->

              <el-tooltip
                class="item"
                content="审核"
                v-if="
                  scope.row.statusString === '待审核' &&
                  nowPlatForm == scope.row.nextPlatformId
                "
                effect="dark"
                placement="top"
              >
                <div
                  class="button-view button-baoshen"
                  @click="showAudit(scope.row)"
                ></div>
              </el-tooltip>
              <el-tooltip
                class="item"
                content="查看"
                v-if="
                  scope.row.statusString === '已审核' ||
                  scope.row.statusString === '已驳回' ||
                  scope.row.nextPlatformId != nowPlatForm
                "
                effect="dark"
                placement="top"
              >
                <div class="button-view" @click="showCheck(scope.row)"></div>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 底部分页按钮 -->
      <!-- <div>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length"
          style="text-align: center;justify-content: center;"
        ></el-pagination>
      </div>-->
      <div class="shgl-content-footer">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
        ></el-pagination>
      </div>
      <!-- 查看弹窗，import checkDialog.vue -->
      <checkDialog
        ref="checkDialog"
        :TikuType="activeTab"
        @getDataList="unconditionalList()"
      ></checkDialog>
      <!-- 审核弹窗，import auditDialog.vue -->
      <auditDialog ref="auditDialog" :tiku="activeTab"></auditDialog>
    </div>
    <!-- 标签4：巡查车辆登记审核 -->
    <div v-show="activeTab == '4'" class="resource-manage-container">
      <resourceManage
        :tktk="activeTab"
        class="resource-manage"
        ref="patrolCar"
        :shgl="4"
      ></resourceManage>
    </div>
    <!-- 标签5：群防岗亭登记审核 -->
    <div v-show="activeTab == '5'" class="resource-manage-container">
      <resourceManage
        :tktk="activeTab"
        class="resource-manage"
        ref="resource"
        :shgl="5"
      ></resourceManage>
    </div>
    <!-- 标签6：成员入职审核 -->
    <div v-show="activeTab == '6'">
      <cygl ref="memberInduction" :shgl="6"></cygl>
    </div>
  </div>
</template>


<script>
import checkDialog from "./checkDialog";
import auditDialog from "./auditDialog";
import Cookies from "js-cookie";
// 成员入职申请模块
import cygl from "../../groupControl/cygl";
import resourceManage from "../resourceManage/resourceManage";
export default {
  components: {
    checkDialog,
    auditDialog,
    cygl,
    resourceManage,
  },
  data() {
    return {
      loading: false,
      nowPlatForm: "",
      //分页数据
      totalPage: 0,
      pageIndex: 1,
      pageSize: 10,
      currentPage: 1,
      // 当前激活的标签页，取值：'1', '2', '3'...
      activeTab: "3",
      // 奖励类型取值与可选值
      awardType: "",
      awardTypeOptions: [],
      // 审核状态取值与可选值
      auditStatus: "",
      auditStatusOptions: [
        {
          value: "0",
          label: "待提交",
        },
        {
          value: "1",
          label: "待审核",
        },
        {
          value: "2",
          label: "已审核",
        },
        {
          value: "3",
          label: "已驳回",
        },
      ],
      // 时间范围取值
      dateTime: "",
      // 表单输入框取值
      tableInput: "",
      // 申报弹窗左边表单内容
      reportForm: {
        agent: "",
        count: "",
        num: "",
        flow: "",
        lastyear: "",
        total: "",
        type: [false, false, false],
        basic: "",
        amount: "",
      },
      // 审核状态统计值
      auditStatusStat: {
        stat1: "",
        stat2: "",
        stat3: "",
        stat4: "",
      },
      // 列表数据数组
      tableData: [],
      rewardDataSelection: [],
      // “更多”按钮触发
      moreBtnIsFocus: false,
    };
  },
  methods: {
    // 点击切换标签页，待实现
    handleClick(tab, event) {
      console.log("切换标签页的tab、event===》", tab, event);
      if (tab.name == "1" || tab.name == "2" || tab.name == "3") {
        this.activeTab = tab.$options.propsData.name;
        this.unconditionalList(); //每次切换tab都要重新渲染列表
      }
      if (tab.name == "5") {
        // 切换到资源管理的第二个tab
        this.$refs.resource.tabt();
      }
      // 巡查车辆登记审核
      if (tab.name == "4") {
        this.$refs.patrolCar.inspectionVehicle();
      }
      // 成员入职审核
      if (tab.name == "6") {
        this.$refs.memberInduction.search();
      }
    },
    // 弹窗关闭提示
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    // 点击查看按钮弹窗
    showCheck(man) {
      this.$refs.checkDialog.checkDialogVisible = true;
      this.$refs.checkDialog.currentId = man.id;
      this.$nextTick(() => {
        this.$refs.checkDialog.init(man.id, "show");
      });
    },
    // 点击审核按钮弹窗
    showAudit(row) {
      console.log("tikuType-----------", this.activeTab);
      this.$refs.checkDialog.init(row.id, "shenhe");
    },
    // 每页数
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.conditionalList();
    },
    // 当前页
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.conditionalList();
    },
    //tab切换查询
    unconditionalList() {
      this.loading = true;
      this.pageIndex = 1;
      this.$http({
        url: this.$http.adornUrl(`/approve/approveApprove/list`),
        method: "post",
        data: this.$http.adornData({
          page: 1,
          limit: this.pageSize,
          tikuType: this.activeTab,
          tikuId: "",
          search: "",
          startTime: "",
          endTime: "",
          status: "",
        }),
      }).then((data) => {
        console.log("tab切换查询data===》", data);
        this.tableData = data.data.page.list;
        this.totalPage = data.data.page.totalCount;
        this.$data.awardType = this.$options.data().awardType;
        this.getTikuListByType(); //获取到相对应的奖励类型列表
        this.getCount();
        this.loading = false;
      });
    },
    getCount() {
      // 总人数
      this.auditStatusStat.stat1 = this.tableData.length;
      let stat2Count = 0;
      let stat3Count = 0;
      let stat4Count = 0;
      let stat5Count = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        // 待审核：1
        if (this.tableData[i].status == "1") {
          stat2Count++;
        }
        // 已审核：2
        if (this.tableData[i].status == "2") {
          stat3Count++;
        }
        // 已驳回：3
        if (this.tableData[i].status == "3") {
          stat4Count++;
        }
        // 待提交：0
        if (this.tableData[i].status == "0") {
          stat5Count++;
        }
      }
      this.auditStatusStat.stat2 = stat2Count;
      this.auditStatusStat.stat3 = stat3Count;
      this.auditStatusStat.stat4 = stat4Count;
      this.auditStatusStat.stat5 = stat5Count;
    },
    //列表带条件查询
    conditionalList() {
      this.loading = true;
      console.log("tikuType-----------", this.tikuType, this.activeTab);
      this.$http({
        url: this.$http.adornUrl(`/approve/approveApprove/list`),
        method: "post",
        data: this.$http.adornData({
          page: this.pageIndex,
          limit: this.pageSize,
          tikuType: this.activeTab,
          tikuId: this.awardType,
          search: this.tableInput,
          startTime: this.dateTime == null ? "" : this.dateTime[0],
          endTime: this.dateTime == null ? "" : this.dateTime[1],
          status: this.auditStatus,
        }),
      }).then((data) => {
        console.log("列表带条件查询data===》", data);
        this.tableData = data.data.page.list;
        this.totalPage = data.data.page.totalCount;
        this.loading = false;
      });
    },
    //根据表单类型id获取奖励类型列表
    getTikuListByType() {
      this.$http({
        url: this.$http.adornUrl(
          `/approve/approveTikuType/getTikuListByType?type=${this.activeTab}`
        ),
        method: "get",
      }).then((data) => {
        console.log("根据表单类型id获取奖励类型列表===>", data);
        this.awardTypeOptions = data.data.data;
      });
    },
    rewardDataChange(selection) {
      this.rewardDataSelection = selection;
      console.log("奖励列表选的数据", this.rewardDataSelection);
    },
    conditionExport() {
      const url = `/approve/approveReward/xlsOutputCondition?tikuId=${
        this.awardType
      }&status=${this.auditStatus}
      &startTime=${this.dateTime == "" ? "" : this.dateTime[0]}&endTime=${
        this.dateTime == "" ? "" : this.dateTime[1]
      }&page=${this.pageIndex}&limit=${this.pageSize}&search=${
        this.tableInput
      }&tikuType=${this.activeTab}&token=${this.$cookie.get("token")}`;
      const request = {
        method: 'get',
        baseURL: window.SITE_CONFIG.baseUrl,
        url,
        headers: {
          token: this.$cookie.get('token'),
        },
        responseType: 'arraybuffer',
      };
      this.$http(request).then((response) => {
        if (response.data) {
          const a = document.createElement('a');
          a.target = '_blank';
          a.download = '全部导出.xls';
          a.href = window.URL.createObjectURL(new Blob([response.data]));
          a.click();
        }
      });
    },
    exportSelectAll() {
      let httpaddress = window.SITE_CONFIG.baseUrl;
      let checkedIds = [];
      if (this.rewardDataSelection.length < 1) {
        this.$message({
          message: "请选择数据进行导出",
          type: "warning",
        });
        return;
      }
      this.rewardDataSelection.forEach((item) => checkedIds.push(item.id));
      const request = {
        method: 'get',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: '/approve/approveReward/xlsOutputSelect',
        headers: {
          token: this.$cookie.get('token'),
        },
        params: {
          checkedIds: String(checkedIds),
        },
        responseType: 'arraybuffer',
      };
      this.$http(request).then((response) => {
        if (response.data) {
          const a = document.createElement('a');
          a.target = '_blank';
          a.download = '选择导出.xls';
          a.href = window.URL.createObjectURL(new Blob([response.data]));
          a.click();
        }
      });
    },
  },
  created() {
    this.nowPlatForm = this.$cookie.get("platformId");
    //初始化列表渲染
    this.unconditionalList();
  },
};
</script>


<style lang="less">
/* * {
  .row1 .input-select {
    width: 174px;
    margin-right: 10px;
  }
  .row1 .date-block {
    display: inline-block;
    margin-left: 30px;
  }
  .row1 .date-block .el-date-editor {
    width: 238px;
    padding: 6px 8px;
  }
  .row1 .input-text {
    width: 298px;
    margin: 0 15px;
  }
  .row2 span {
    margin-left: 15px;
  }
  .row3 button {
    width: 66px;
    height: 25px;
    display: inline-block;
    padding: 0;
    margin: 0;
  }
  .el-dialog__header {
    background: rgba(241, 244, 246, 1);
  }
  .report-process {
    margin: 20px;
    width: 300px;
    border: 1px solid rgba(215, 215, 215, 1);
    border-radius: 3px;
    background-color: rgba(249, 251, 255, 1);
    padding: 10px;
  }
  .report-table {
    flex: 1;
    margin: 20px;
  }
  .report-wrapper {
    display: flex;
    flex-flow: row;
  }
  .el-dialog__footer {
    text-align: center;
  }
  .process-wrapper {
    margin: 20px auto;
    text-align: center;
    margin-bottom: -30px;
  }
  .process-head-1 {
    border: 1px dashed #0091ff;
    border-radius: 3px;
    color: white;
    background-color: lightskyblue;
    padding: 5px 15px;
    display: inline-block;
  }
  .process-content-1 {
    border: 1px dashed #0091ff;
    border-left: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 5px 15px;
    display: inline-block;
    width: 200px;
  }
  .process-head-2 {
    border: 1px dashed #d7d7d7;
    border-radius: 3px;
    color: white;
    background-color: #d7d7d7;
    padding: 5px 15px;
    display: inline-block;
  }
  .process-content-2 {
    border: 1px dashed #d7d7d7;
    border-left: none;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 5px 15px;
    display: inline-block;
    width: 200px;
    color: #d7d7d7;
  }
  svg {
    height: 60px;
  }
  .resource-manage-container {
    overflow: hidden;
  }
  .resource-manage {
    position: relative;
    top: -55px;
  }
} */

/**
 * @author tanjinfeng
 * @date 2020.08.18
 */
.shgl-all-container {
  background: white;
  min-width: 1355px;
  border-radius: 4px;
  overflow: hidden;
  height: calc(100vh - 112px);
  position: relative;
  box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
  .el-tabs {
    .el-tabs__nav.is-top {
      padding-left: 35px;
      padding-top: 13px;
    }
    /deep/.el-tabs__header
      .el-tabs__nav-wrap
      .el-tabs__nav-scroll
      .el-tabs__nav {
      border: none;
      .el-tabs__item.is-top {
        color: #999999;
        font-size: 16px;
        font-weight: normal;
        padding: 0 !important;
        margin-right: 50px;
        height: 55px;
        line-height: 53px;
        border: none;
      }
      .el-tabs__item.is-top.is-active {
        color: #333333;
        font-weight: bold;
        border-bottom: 2px solid #3f92fe;
      }
    }
  }
  .header-stats {
    position: relative;
    padding: 9px 0 18px 0;
    * {
      color: #999999;
      font-size: 16px;
      font-weight: normal;
    }
    div {
      margin: 0 28px 0 0;
      display: inline-block;
      &:first-child {
        margin-left: 38px;
      }
      &:last-child {
        color: #0091ff;
        margin: 0;
        position: absolute;
        right: 14px;
        top: 5px;
        cursor: pointer;
      }
      span {
        font-weight: bold;
        font-size: 20px;
      }
    }
  }
  .header-operation {
    padding-left: 36px;
    position: relative;
    > * {
      margin: 0;
      margin-right: 4px;
    }
    .input-select {
      width: 328px;
      height: 42px;
      /deep/.el-icon-date {
        top: 2px;
      }
      /deep/.el-input__inner {
        height: 42px;
        line-height: 42px;
        padding-left: 10px;
        padding-right: 10px;
        font-size: 16px;
        font-weight: 400;
      }
      /deep/.el-icon-arrow-up::before {
        margin-top: 9px;
      }
      /deep/.el-input__suffix {
        right: 11px;
        top: 1px;
        background: white;
        height: 40px;
      }
      /deep/.el-icon-arrow-up::before {
        background: no-repeat
          url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAOCAYAAAA1+Nx+AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAADgAAAAANlRePAAABeklEQVQ4Eb1SsUrEQBC9TXEBwc5gL/gBFsKh5BIrK1sNglwh9lp4foMnqL9wCBJrsbAQk0tODiysUgn2EvsjFonvHVnY80xcLFwYZjIz772Z3TQa/33CMNxJkqT5V11iwbEt8YYM6AeDwUFRFH6apn14odZ0YmJK7A25iJkSMAzDF0K8IO+h4VyHVO0pMR45yMXazJSj0Wgxy7InTLOE+onruj2VpCoOgqCL2inI30zTXGu1Wu/snRFgEne4DDeELWCSjm3bV8xXnSiK9vI876P+AVt3HOdV9v4owCImWoV7xERN2Fa73b6XINXjWjax7S3sE/kNbPys1isF2PQbWGeIqUdWlRlzalzRPjaYg92VVzdpY8wca+yp2rB2AymITY5xxz2QTR4QhGI8Hg/5IyDugvxM9n73WgIEYeILEB5ChL9xA/EK4ks86BG/q462AAgFRK5B5JVkPsh3IVJUkTNf+wYqkESWZXXgH2hlXEuu4rXjOI7nabqAL81rpopzt9VwAAAAAElFTkSuQmCC);
        background-size: 20px 10px;
        background-position: center;
        transform: rotate(180deg);
      }
      /deep/.el-icon-circle-close {
        font-size: 16px;
      }
      &:nth-child(2) {
        width: 132px;
      }
    }
    .date-block {
      display: inline-block;
      .date-range {
        height: 42px;
        width: 290px;
        // margin-left: 1px;
        /deep/.el-icon-date {
          top: 2px;
        }
        /deep/.el-range-input,
        /deep/.el-range-separator {
          font-size: 16px;
        }
        /deep/.el-range-input {
          margin-left: 20px;
          width: 105px;
        }
        /deep/.el-range-separator {
          margin-top: 6px;
          margin-left: 5px;
          margin-right: -15px;
        }
        /deep/.el-range__icon {
          font-size: 17px;
        }
        /deep/.el-range__close-icon {
          font-size: 17px;
          position: relative;
          top: 1px;
        }
      }
    }
    .search-container {
      border: 1px solid #dddddd;
      border-radius: 4px;
      width: 328px;
      height: 42px;
      line-height: 40px;
      display: inline-block;
      margin: 0;
      &:hover {
        border-color: #c0c4cc;
      }
      &:focus-within {
        border-color: #0091ff;
      }
      input {
        width: calc(100% - 40px);
        height: 40px;
        border: none;
        outline: none;
        font-size: 16px;
        font-weight: 400;
        margin-left: 5px;
        color: rgb(96, 98, 102);
        &::-webkit-input-placeholder {
          color: #b4b4b4;
        }
      }
      .search-icon {
        font-size: 19px;
        font-weight: bold;
        color: #999999;
      }
      .search-icon.el-icon-close {
        border: 1px solid #999999;
        border-radius: 50%;
        font-size: 12px;
        padding: 2px 1px 1px 1px;
        text-align: center;
        position: relative;
        left: 2px;
        bottom: 2px;
        cursor: pointer;
        &:hover {
          color: #b4b4b4;
        }
      }
    }
    .declare-button {
      position: absolute;
      right: 10px;
      /deep/.el-button {
        width: 106px;
        height: 42px !important;
        padding: 11px 5px 11px 19px;
        span {
          font-size: 16px;
          font-weight: 400;
          color: #ffffff;
          i {
            font-size: 10px;
            position: relative;
            bottom: 2px;
            left: -3px;
          }
        }
      }
    }
    .import-container,
    .export-container {
      .el-button {
        width: 95px;
        height: 42px !important;
        line-height: 21px;
        img {
          width: 19px;
          height: 19px;
          margin-right: -4px;
        }
        span {
          font-size: 16px;
          color: #666666;
        }
      }
    }
    .import-container {
      display: inline-block;
      padding: 0;
      margin-left: 3px;
    }
    .export-template {
      height: 42px !important;
      span {
        font-size: 16px;
        color: #ffffff;
      }
    }
    .more-button-container {
      margin-left: 2px;
      display: inline-block;
      position: relative;
      width: 80px;
      height: 42px;
      line-height: 40px;
      border: 1px solid #dddee1;
      border-radius: 4px;
      font-size: 16px;
      text-align: center;
      color: #666666;
      user-select: none;
      cursor: pointer;
      .more-button-content {
        position: absolute;
        top: 50px;
        right: 0;
        width: 160px;
        z-index: 1;
        transform: scaleY(0);
        transform-origin: center top;
        transition: transform 0.5s;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 3px 11px 0px rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        .more-button-content-item-header {
          color: #999999;
          text-align: left;
          padding: 21px 0 15px 20px;
          line-height: 14px;
          cursor: auto;
        }
        .more-button-content-item {
          text-align: left;
          padding: 13px 0 15px 20px;
          line-height: 14px;
          &:hover {
            background: rgba(0, 145, 255, 0.1);
          }
        }
        .more-button-content-line {
          border-bottom: 1px solid #e6e6e6;
          width: 132px;
          height: 13px;
          margin: 0 auto;
          margin-bottom: 14px;
          cursor: auto;
        }
      }
      i {
        transition: transform 0.5s;
      }
      &.more-button-unfocus:hover {
        border-color: #b4b4b4;
      }
      &.more-button-focus {
        border-color: #0091ff;
        i {
          transform: rotate(-180deg);
        }
        .more-button-content {
          z-index: 1;
          transform: scaleY(1);
        }
      }
    }
  }
  .shgl-content-table {
    height: calc(100% - 285px);
    margin-top: 20px;
    overflow: hidden;
    .el-table {
      -webkit-box-shadow: none;
      box-shadow: none;
      border: none;
      max-width: none;
      overflow-y: auto;
      thead div {
        font-size: 14px;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        th {
          height: 56px;
        }
      }
      tbody {
        div {
          font-size: 14px;
          font-weight: normal;
          color: rgba(102, 102, 102, 1);
        }
        td {
          border-left: none;
          border-right: none;
          .item {
            display: inline-block;
          }
          .button-view {
            margin: 0 auto;
            width: 27px;
            height: 25px;
            cursor: pointer;
            background: no-repeat
              url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAkCAYAAADl9UilAAAEDElEQVRYR+2Wb2hVZRzHv9/nrOlWU5molcSiMoTaIne79zZ7Y0QUQkLLEZTb7k3qTc02rSCDDDKodEvrTWH3bloQswQDKyLyTa57592grUCyohFWOhzO1aZr53zjzhn7c+89z50Vvtjz7pzn+/38vvzO8zznIS7Twcs0F+aC5ftl5jr2v3QsntJKelgLodLzVE5yCYCFE8UHJfUbw14QXTI4FAnw2H8W7JPjmtc/gA2e0ACoPL9C7DXE7sFS7GtYwfM2Xqs1FktoHYlmSDfYQLNqyJ8kNEXDPOjHyRmsvUNFww52S9roB8pnnuSeYhcNNVUcyebLGqwtqcUe8DGkqnyKWmvJDgM8UBfi6UyejMHeTmlh4Ri+BLTKutCshOweLcDdTwQ4ON0+I1i75Awn8ZmgeyxrDQD8CELvuJ4oB1QNoNTGT/CL4hDuqyHdyfoZweJfazuo522goNpGHbPpt0oMXZfCirTnlwCOX9OFkkLX2wWxzoojvhK5k1uzBms7qqDnqgOA4wcUFI+GnWgsoUcJvAro2gse/irguWiY78USboxgxI8FwDUeq+qq2HlR+0/HJLEtiU5BAV+Q0O+5vJEOHiTVmkkvsV4uDhhHP4JIH8A5B8FUXQhBkrqwIiZGW0IPedB+P8C4SXqr7Jxp7CvCCUFLM+8qniobwfK++V6LyCdtuAZcXxfmh1OCxRNeAkDIBkBy45iLbseoO6fe8HYKlZL22HABJCNhE54erAuA1fEgMGqAHkGpXAUJBjygglDMMlh3JGwqpwRrTaha0Hgb/QbBnWcHsLVksX6HsCijnjgzdJpXLyjFdkGb/ZjpecewujbIA1OCpR/iCX0FaLUF5ASW8Sb243F52pVxjRlu0hK8g5P6AcByfyaPRMK866Juyjm296hudV2lP2mhL4hsjoS4OZZUI6WXAJRMeIZEvhgNsSWe1E5ITb4sYNRxWFl7B7/NGCz9MpbQFkKvW8BAaMfZAfPCvKVwCl2Mr41RB13nT8FdUIqXBW2x4Qh8Jhrmjsnamf9Kia2d+EBSjQ0UQh+g941jetJ6z/UqAD4CoszGT7K9PoiHMXF+Ze1YeqK5Q0WLjA4RWGMDn61GwOEzHtc2Zbj+ZL327P1GV3oj2C/o/tkWzuUj+Kkpwvra2/hnxs2Ty7ztsAqun++9JvLpyX+JSwwqSm/8fM48u20Nx7KxrK7WrQndK+hNADdfYqjvCT5VH+bnfhyrYGlI+3cqHB5CvaRGECv9wFPmhWMkW4pL0FpzC0dtvNbBJsP2pbTqrzFvHckghAoAyyZdldIXvpMgeiR1XlFgDm4IMPc/NUPSWQWbwZH47hFclX7/2Gr8MX3r23RouubfCTabyj6euWD5NnWuY/l27G9733k0ycG80wAAAABJRU5ErkJggg==);
            background-size: 100% 100%;
            &:hover {
              background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAkCAYAAADl9UilAAADdElEQVRYR+2XW4iMYRjHf4/ZzIp1WDlfKKdcWMUK4YYkUpRFCjkkbtb3rXUqlFUox9357A3JIZScihJJ3LCx2b3AhZzKhXPWYckOOz16v92tmd2Z+d4Zh1zsczff9///n/88877P84zwn4b8p75oN5bpL9NesX9TsQM6HGUmUIhSAPRC6OYnVz4D7xEeADUIl1ktj/6eMU/DKIsRnGYz9rmMScVDOIEjURui3RmL6GxgPzDIRjQN5jlQiisXg3TSG9uvncjBQ1kRJJTRe+EwjTiUyvdUvNTGKrUnMS4BEzJKag+uIsQsiuVDMkpyYwe1G1FuoIy2z5MFUqglzBRWibkwCdHW2BkN8YarKFMtU9UhnEf9WwhCAUoRkG/FF67Tl+nMl1g8vq0xT3egbLIShePk4vKaeroz1Od84gn9yKOBCLDESkfYiSObUxvzdCxKFRCyEDyKK8up0EUIu4D+zZxXKBspkZNE9AiwzEIrhjABR6pbsHEVU8GjGmWMhdB7GhhMLnOAYynwS2ngArk88xtwUAj3cBgLok0noiU8nYtyNojffI4qqWMN+bxE6Z2UI7yjjgHkU45SbKk7D0fOJRqL6B1gnJWA6WsdqEWpTYvPYRQ/KcT0Lbu4iyvjE41VqJlrtu1hOXAfuBeQzxyLkYA5a8FhvmiJFLY2VoTglzEwhH3AZpQ3QPcU+E8IfQFzy9cGaja5KcKRC4nGzCdPb6FMtBB5SVeGUM9K1G8LbUNwyeMQX3gKDAjUFG7jyKQWXGIfi+gI1F9VOgYKmaHuyloqdA2wDSHP5yj1wFZKpJyImsqWBmopPxAKceVhcmPmaUTXAXsCxZoAexG2ECZEFP9sEKaGKDGU7YDRson1uLI3HphkVqoQ4TQw30YReIFwCvEvg6nYSJSFwEBL/hlcFrT0r9QVM2/MuhPiMjDZUjxb2E1izEy2/qRee/ZoZ8KcRZmRbda0POEKUeaxXr4lvzvp2GWaQw92AyUJU+L3nJqRU8FHNlAmjamk7FZrT6ehHACG/Z4nHiOsxpFrQTp2xoxKmXakB0sB0x6GBwm3em/+JZXzkWOUyQ8brr2xeLVKHU0jsxGzDfgjp0/cqmQWvrf+yFKqyeEixZJ+piZxmp2xNkJqNrIu/uONfG199W0q1Brzh4xlkzo9p91YpjVtr1imFfsFaaXrJVm90+MAAAAASUVORK5CYII=);
            }
          }
          .button-baoshen {
            background: no-repeat
              url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAACsElEQVRYR+2XQUgVURSG//89fUXmNiSKIqqNFKXVm0gXEi1Cl2WBkG+kaFMbN0GLCFrUqlZCEva0okW1KVqJtCjIeU8JgoTKlRKEURBRKTrv/jHpQsl53pkxceFdn3P+7/zncO8MsUoPVykX1sCiTiaxY/feapOZxEURLZB2ADAQRgk91VSqy23i96hQQXwisL6iThmjOwCqFxMn+RVCW85hf1S42GD5IZ1GSQ+Xak6An07zePtBDkSBiwWWL6qGRqMCNtqJcaKqGjtba/nTLj7mKPOF0g2Il2xF/u4M2ZnL8pZtTizHegt6J6nWVmQ2ji9ch0dtc2KB5T0zCWC9rcgc2JjrcLttTjywgqYgrbMVmRvleC7LbbY58cA8Mw5gq63I7CQ55GZ5yDYnFlivp8eCTtiKzF6Y7Mo5vGCbEw9sUG2iHtiKBHESj3Uctr/LYoF1D6sy4+sjAMtl5hvXYX2URmKBBQJ9BbUIeCapfA2hBLLBdeitCFggkvdKtwGeLy/Ia67DK1GgZncyweke1oZKXx8IbAkpMzI2yX1Xm+hHlUkENudaD8COxYQJXc856ctRoRI7FhS465lXBBoWB8OTnJM6ueJg+YIaIb0MEw4+eVjBPe4Bvo8KZzXKRyPKzJRQNb+4P41q42MA0K5yogSLmQo0Gx/T8+My4/jV2spSWG5ZsPvDqvNLugmhEUAqatdLxM+Q7CfQ2Z5lcCcuOKFgfZ72GuI1pAVOLTNcUO5bJsP6tjqOza8dCpb3zHMAzf8B5J+SJHtyWZ61BfsR9pOx/LAcdR3utgULFnO59yqsp8+uk9psBzaoc2Syl8HWWQP87nC44GslfMeKqrEtnDQuPQNz5gi/2DnmmVU6Ss98Wrkd44TrcL+VY0nHkzTf6klKKhInfw0sqmtrjkV17A8Ttdwn8+HHVQAAAABJRU5ErkJggg==);
            background-size: 100% 100%;
            &:hover {
              background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAACZElEQVRYR+2XP2hTURTGfyf+qahdRURRRF1EUQtO7VQcpB0VhW6iOJjm1oIIDiI46KR5sUGLdBMH66I4FXGwIKLgpKB2ahGkUqGI1tgmOfLSDEb6knNfQpohd/7O/X73O4f77hNadEmLctEG8+1M/Ynd1S0sMYjSD+wGisAU8IQiWS7KvC9UqK8P7I6eosh9oDPCfA5hgJRM+MLFBxvR0xR4WPNwSp4Ex0nJcx+4eGBZ3Uq+1K7NRrNZ1rKHC/LTqI/ZyrTeRLhsNSnplGGG5La1Jl5iGX2Pst9qUtIJL0hJr7UmHligv4ENVpOybhonu6w1ccFyQIfVpKybwclOa008sLTOIOywmpR1b3Fy1FoTDyzQceCE1aSsy+Ikaa2JB5bRAZQHVpPy8B/zucvigY3qOnJ8BmzDLLwjJV0+B4kHFjqktZ8ET9Gad2EBoZuUvG4OWOiS0Xso52sYXsfJVR+o5WuvnjWqG8nxCdi+4jbKB+Y5xDXJ+9rUBxa6BToGnIkwvoGTK75Q9Se2DDYJdEeYP8bJyeaDZbQH5WUV4/DJc4BB+egLZ2vlI13PHJsqNl+kEyF8Y+2taiq8oYM+/rBYoZvkF+NSiKqtDjaiRyhwC+gBEr6nrqFfQpggwTBJCe/EihUNltaDCK/gv6QaTAd8Zw1dJGX6362jwQJ9BvQ1nmPFHcdwctYGltYfSORPRqN5p3CyzwYWaDiYjZ6rqAN9xck2G1hGzxm+g41JTllgSCpeK9EzFv4JNWstUOSSfLMl1rKtDPRLE2dsFieHbYk1q40RPrZP0ipAtsF8Q28n5pvYX5BCmCfkwuT5AAAAAElFTkSuQmCC);
            }
          }
          .button-edit {
            background: no-repeat
              url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAACgElEQVRYR+3VW0sUYRwG8OeZXTD6CH2LwHXGS2/CDhBhRRG5M4UYRQUhEiIoiIRYhHVTUc4UERFR0UG7s7udFT9DF0H0DYJVd57YVNKa2XlnT0j43s7zzv83//cwxC4d3KUu7MGyrkxHOxaEOiQoIPideQwUu/ktCdwxmL+sfkR6C2Dfbwz51cqhLwnXEdg/qK021cF1BlaKFkH0xy5bAq6tsHsL6rp2hJWHK9rftY6PgvricARXXIeF7c/aBvPLukPhYCWPY8Pd/JmC++E51oG2w4JQs4JGNgt9Wc3zaBJOwHo+x+ODBS60FRaUNSNpdGcRLiV0TiSHXJtP/l7ili6lH+oWoJsJ+ygGhyXP4VR8PuuVnJD3S5oGNVbvdcSfzm0djLZesEGoKUHjRt8ofPZ6rcNp2aaX0i9rEtJEWqHacwmVXJ4nigUupuWbgvnl6gTEybQiG78gVAgOuDY/meQbhs2XNE4qduPGFF6FeNLr5QcT1MZ3NDD8ssYgTRtOXWWOp9wC3xvmNxucJQ3AD2vXQe1aMBprIE97Nt8ZpbeFMnUsKGtU0oxhkTVYPOP18I1hfkfMGDYfaoTQrEmR2m8mB54tOnxtko/LGMH8km7Qwm1JqfkayrJ4zu3hq0ZRRpv/6bKuS7hrgiK4LuC85/BlM6hUmF/WVUhzRqdXqMLioGfzRbOourAg1BVB941QQNUC3aLD561A1YX5YRSZoVglccG1+axVqDSYDApFEC96vQwMspkiiafMD6M0WARwyHM4n6miYbgxGBlZwHDR5mPDOpljjcBE8JLr8FHmahkmZIUJ5GXP5oMMNRqKpt7kDb21BZP2YFmbuNex/6ZjvwBgQAc2QRV6PQAAAABJRU5ErkJggg==);
            background-size: 100% 100%;
            &:hover {
              background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAACN0lEQVRYR+3Wz2rUUBTH8e+JixYfwbdw4QN0I4qCSFUUUUQpFTVJEZFSCgqliKjYGzcqKkVERETF/7v6AD6DC0F8A3HsOEeuTrFMk8m5SWYoMneb353z4dybkxE26ZJN6mIECz2Z4XYs050oywhf6TDJjHwpAg8P5nQX8AIY72I+o0wU4YYD24haa1Qhbliw94DvWN7KxQ0WlukYibS4o1v5wRtgIpcmfCKRHeufDQ6W6Q2U7Yyzl2n5XoL7RirbBg9zeg248KeQ8JEx9vTBtdnCPs7Ju8HCnF4FLvYc2UpB55SIKWK533vEzR6l0yvAbMElz8OtkMpCXr45WKaLKHMlE/4fbu3FKNjQDCzTBZR542fnA6nsLsvWhzm9DFwqK9R93iJiP7H4udZ31YM59SAPs6wWwiSJvLWEq8MynUfJvbgbCis/iThAIq8tqL9Tpspa0jmEReNWjzpILK+M+e74C0n77JLOIvixYFmrRBwilpeW8PpMWMec+sHpB6hlrSIcJpHnlnBvxg5z6j8x/lNTvpQ2EUdI5Fl5OD9hgzk9j3AdNd3JNnCUVJ5WRdkuv9MU4WYA6hipPKmDKoc5jQFnfHt/AcdJ5XFdVH+Y07PALTNKOcGMPGoCVQbrmFHCSRJ52BSqDKaGQh2EUySybMgGRYrfSqdlMI+aIpEHQRWN4aowf8zTpHLPWCc4VgXmO3maVO4GVwvYEArz/9HPEMvtgBqVorbJX+mn620awUL7N+rYf9Ox3+DAtCc1NXF7AAAAAElFTkSuQmCC);
            }
          }
          .button-delete {
            background: no-repeat
              url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAABmklEQVRYR+2XO0sDQRSF70nii2CrNiJYphZ3YyEKdqm1dVMJ/gALC19gaynYmG3V2lIxhbgr1ukVm/gDRJHsEUkCJrLLzDiBFLPl5T6+PfcycwcypB+GlEscmG5njBQLY1ZInkBkniKFzKKQRBJ5zQl2Nsu4UAU0AqvFfBFyVrVI2w/Nqo8Z1RgjsDBmQlI79tlD/gBIVOAyk1+S+f4kjTvB3AS/VJL3+xQnMSYlafXbN4A/tlSwWsx7IZdMAHRjANwEHtZ+x6WChRFvKVzVLWLiD8Fj4MNTAjMpYDNGe4BtFs/KpQwWxqyTXLYCBtSrHlasgNWihFagOkmqfi5TFGXFHFhH0X8rVim1M103ehudZu96DbyVgdf+tzDuHcE0uwNziqWdVWnHhVPMKTboK8nNmO6MDe2VZLoKWbsrw4hNCqdMQXr3ebwFPqatLIrnEQ8h3LMClsNRsIh9K2BnTxwZbckxRLZJFg0B3yE4/SzI7tYCMt+myvtYF+TnBX71IOMmYOtl+QCgtKJrg5kAmcQ4MF3VnGK6in0D9pTfJ+EbO1oAAAAASUVORK5CYII=);
            background-size: 100% 100%;
            &:hover {
              background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAABcElEQVRYR+2Xv0oDQRCHvzGKASsbtbGx9AUUC1Gws88rCIJ32FhY+A9s1aQQfATzDgopBPEBfACxiU06UcSMSFQMl7vsDhu4Yrfcm5nfx++GuTmhpEdKykUE830zNscauolyBiwA40NEu8AzY+yxI9eugFawJ5R5V5GfuDapzLnmWMG6qKE/O1Q4km8Hh55isKZWMhUeEab5GFp5UECHSRb5zDyqSeYuH6yud8CKCcA/6YZUNv6nFYHdAuv+GoYM4YFEltzADPVDptiaPyRBTi13sLq2gNVATC1SWSuq5QOmgaB6ZVIp1I5gGbdH7dh9rSe53OyXzrv/ixo1mCY9KWn0g+XdR7DoWO6squvAORYdi47FOVa2AVvaT5J5FQrWYw1to8yYQfoX+hcSmQ2zKF7oMcJBILATEjkMA3alE7xzirINTBkBX4FLquyzJYX/pu4b7C+JqnBO1QS2yxsiTiu6P5iJyD8pgvl6Fh3zdewL5tObJ8EoArUAAAAASUVORK5CYII=);
            }
          }
        }
        tr {
          background: none;
        }
        tr:hover {
          box-shadow: 0px 0px 11px 3px rgba(67, 85, 114, 0.1);
          td:nth-child(1) {
            border-left: 3px solid #0091ff;
          }
          // .button-view {
          //   background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAkCAYAAADl9UilAAADdElEQVRYR+2XW4iMYRjHf4/ZzIp1WDlfKKdcWMUK4YYkUpRFCjkkbtb3rXUqlFUox9357A3JIZScihJJ3LCx2b3AhZzKhXPWYckOOz16v92tmd2Z+d4Zh1zsczff9///n/88877P84zwn4b8p75oN5bpL9NesX9TsQM6HGUmUIhSAPRC6OYnVz4D7xEeADUIl1ktj/6eMU/DKIsRnGYz9rmMScVDOIEjURui3RmL6GxgPzDIRjQN5jlQiisXg3TSG9uvncjBQ1kRJJTRe+EwjTiUyvdUvNTGKrUnMS4BEzJKag+uIsQsiuVDMkpyYwe1G1FuoIy2z5MFUqglzBRWibkwCdHW2BkN8YarKFMtU9UhnEf9WwhCAUoRkG/FF67Tl+nMl1g8vq0xT3egbLIShePk4vKaeroz1Od84gn9yKOBCLDESkfYiSObUxvzdCxKFRCyEDyKK8up0EUIu4D+zZxXKBspkZNE9AiwzEIrhjABR6pbsHEVU8GjGmWMhdB7GhhMLnOAYynwS2ngArk88xtwUAj3cBgLok0noiU8nYtyNojffI4qqWMN+bxE6Z2UI7yjjgHkU45SbKk7D0fOJRqL6B1gnJWA6WsdqEWpTYvPYRQ/KcT0Lbu4iyvjE41VqJlrtu1hOXAfuBeQzxyLkYA5a8FhvmiJFLY2VoTglzEwhH3AZpQ3QPcU+E8IfQFzy9cGaja5KcKRC4nGzCdPb6FMtBB5SVeGUM9K1G8LbUNwyeMQX3gKDAjUFG7jyKQWXGIfi+gI1F9VOgYKmaHuyloqdA2wDSHP5yj1wFZKpJyImsqWBmopPxAKceVhcmPmaUTXAXsCxZoAexG2ECZEFP9sEKaGKDGU7YDRson1uLI3HphkVqoQ4TQw30YReIFwCvEvg6nYSJSFwEBL/hlcFrT0r9QVM2/MuhPiMjDZUjxb2E1izEy2/qRee/ZoZ8KcRZmRbda0POEKUeaxXr4lvzvp2GWaQw92AyUJU+L3nJqRU8FHNlAmjamk7FZrT6ehHACG/Z4nHiOsxpFrQTp2xoxKmXakB0sB0x6GBwm3em/+JZXzkWOUyQ8brr2xeLVKHU0jsxGzDfgjp0/cqmQWvrf+yFKqyeEixZJ+piZxmp2xNkJqNrIu/uONfG199W0q1Brzh4xlkzo9p91YpjVtr1imFfsFaaXrJVm90+MAAAAASUVORK5CYII=);
          // }
        }
      }
    }
  }
  .shgl-content-footer {
    height: 83px;
    position: relative;
    .el-pagination {
      position: absolute;
      bottom: 15px;
      right: 30px;
      /deep/.el-pagination__total {
        font-size: 16px;
        color: rgba(96, 98, 102, 1);
        vertical-align: center;
        position: relative;
        top: 8px;
        right: 10px;
      }
      /deep/.number,
      /deep/.btn-prev,
      /deep/.btn-next,
      /deep/.more {
        border-radius: 3px;
        height: 42px;
        width: 42px;
        line-height: 42px;
        font-size: 16px;
        font-weight: normal;
        margin: 0 !important;
        margin-right: 14px !important;
      }
      /deep/.el-pagination__sizes {
        /deep/.el-input__inner {
          border-radius: 3px;
          height: 42px;
          width: 107px;
          line-height: 42px;
          font-size: 16px;
        }
      }
      /deep/.el-pagination__jump {
        height: 42px;
        line-height: 42px;
        font-size: 16px;
        margin-left: 5px;
        /deep/.el-input__inner {
          border-radius: 3px;
          height: 42px;
          width: 38px;
          line-height: 42px;
          font-size: 16px;
        }
      }
    }
  }
}
.resource-manage-container {
  position: absolute;
  top: 68px;
  left: 0;
  height: calc(100% - 68px);
  width: 100%;
  overflow: hidden;
  .resource-manage {
    position: relative;
    top: -68px;
  }
}
</style>