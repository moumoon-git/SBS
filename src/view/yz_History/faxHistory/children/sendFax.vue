<template>
  <!--发送记录-->
  <div class="sendFax">
    <div class="left_top_box">
      <div class="mgr14 font_style">发送类型</div>
      <el-select
        class="mgr14"
        clearable
        style="width: 112px"
        v-model="searchData.type"
        placeholder="请选择"
      >
        <el-option
          v-for="item in sendTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-date-picker
        class="mgr14 datePicker"
        v-model="timeVal"
        type="daterange"
        range-separator=" "
        start-placeholder="请选择日期范围"
        @change="handleTimeChange"
      ></el-date-picker>
      <el-input
        v-model="searchData.searchText"
        placeholder="请输入关键字"
        style="
          width: 253px;
          border-bottom-right-radius: 0px;
          border-top-right-radius: 0px;
        "
      >
        <el-button
          @click="search"
          slot="append"
          style="
            font-size: 16px;
            height: 40px;
            background: #3f92fe;
            color: white;
            border-bottom-left-radius: 0px;
            border-top-left-radius: 0px;
          "
          icon="el-icon-search"
        ></el-button>
      </el-input>

      <el-button
        style="
          width: 124px;
          background: #0091ff;
          font-size: 14px;
          color: white;
          border: none;
        "
        @click="onbatchEvents"
        >{{ tableConfig.selection ? "完成关联" : "批量关联事件" }}</el-button
      >

      <el-popover
        placement="bottom"
        v-model="tablePopoverVisible"
        popper-class="eventOptions"
        v-if="tableConfig.selection"
      >
        <div class="eventSearch">
          <el-input
            v-model="searchText"
            placeholder="请输入关键字"
            size="small"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="searchEvent"
            ></i>
          </el-input>
        </div>
        <template v-if="faxAllCaseId.length > 0">
          <ul class="eventList">
            <li
              v-for="item in faxAllCaseId"
              :key="item.id"
              class="evenyEvent"
              @click="selectLeftTableEvent(item)"
              :style="selectEventStyle(item.id)"
            >
              {{ item.title }}
            </li>
            <div class="loadMore">
              <el-button
                round
                icon="iconfont icon-loadMore"
                size="mini"
                @click="loadMoreHandle"
                v-if="loadMore"
                >加载更多</el-button
              >
              <div v-else>暂无更多数据</div>
            </div>
          </ul>
        </template>
        <template v-else>
          <div style="text-align: center; margin-top: 10px">暂无数据</div>
        </template>

        <el-input
          slot="reference"
          v-model="left_form.eventTitle"
          readonly
          placeholder="请选择关联事件"
        ></el-input>
      </el-popover>
    </div>
    <el-row>
      <el-col
        :span="15"
        style="padding-right: 14px; border-right: 1px solid #e3e6e7"
      >
        <div class="table_box mgb14">
          <myTable
            :tableColumn="tableColumn"
            :tableData="tableData"
            :tableConfig="tableConfig"
            @rowClick="rowClick"
            @selectrow="selectrow(arguments)"
            @selectallrow="selectallrow"
            ref="refTable"
          >
            <!--呼叫时间-->
            <template slot="sendTime" slot-scope="data">
              <div
                v-html="
                  isYangZhouProject
                    ? data.slotData.sendTime.substring(
                        0,
                        data.slotData.sendTime.lastIndexOf(':')
                      )
                    : data.slotData.sendTime
                "
              ></div>
            </template>
            <!--成功-->
            <template slot="success" slot-scope="data">
              <div style="color: #0bd295">{{ data.slotData.success }}</div>
            </template>
            <!--失败-->
            <template slot="failedResend" slot-scope="data">
              <div style="color: #f46666">
                {{ data.slotData.failed + data.slotData.resend }}
              </div>
            </template>
          </myTable>
        </div>
        <div class="my_pagination mgb14">
          <myPagination
            :pageConfig="pageConfig"
            @sizeChange="sizeChange"
            @currentChange="currentChange"
          ></myPagination>
        </div>
      </el-col>
      <el-col :span="9" style="padding: 0 14px">
        <el-card class="send_el-card mgb14">
          <div slot="header" class="clearfix">
            <el-tooltip
              class="item"
              effect="dark"
              :content="rowTableData.title"
              placement="top"
            >
              <span>{{ rowTableData.title }}</span>
            </el-tooltip>
          </div>
          <div class="bottom">
            <div>
              <span>发送类型:</span>
              <span style="color: #323232; font-weight: 700">{{
                rowTableData.type
              }}</span>
            </div>
            <div>
              <span>数量:</span>
              <span style="color: #323232; font-weight: 700"
                >{{ rowTableData.total }}份</span
              >
            </div>
          </div>
        </el-card>
        <div class="fax_queue">
          <h5 class="common_h5 mgb14">传真队列</h5>
          <div class="myRadioGroup mgb14">
            <el-radio-group v-model="radioBtn" @change="handleRadioGroup">
              <el-radio-button label="发送成功"
                >发送成功({{ tableFaxSuccessData.length }})</el-radio-button
              >
              <el-radio-button label="发送失败"
                >发送失败({{ tableFaxLoserData.length }})</el-radio-button
              >
            </el-radio-group>
          </div>
          <div class="fax_queue_table mgb14">
            <myTable
              :tableColumn="tableFaxColumn"
              :tableData="tableFaxData"
              :tableConfig="tableFaxConfig"
              @rowClick="rowRightClick"
            >
              <template slot="operateLoser" slot-scope="data">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="重发"
                  placement="top"
                >
                  <i
                    class="el-icon-s-promotion followerIcon"
                    @click.stop="handleFollower(data.slotData.id)"
                  />
                </el-tooltip>
              </template>
            </myTable>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import myTable from "../../components/myTable";
import myPagination from "../../components/myPagination";

import { confirmDelete } from "@/assets/js/yz_common.js";
export default {
  name: "sendFax",
  components: {
    myTable,
    myPagination,
  },
  data() {
    return {
      selectionrows: [],
      loadMore: true, // 是否有更多事件数据
      currentPage: 1,
      faxAllCaseId: [],
      searchText: "",
      tablePopoverVisible: false,
      left_form: {
        eventTitle: "",
        eventId: "",
      },
      radioBtn: "发送成功", //发送成功/失败的tabs
      sendTypeList: [
        { label: "即时发送", value: "1" },
        { label: "定时发送", value: "2" },
      ],
      timeVal: "",
      // 筛选数据
      searchData: {
        type: "",
        startTime: "",
        endTime: "",
        searchText: "",
        page: 1,
        size: 10,
      },

      rowTableData: {}, //点击发送表格存放单行数据,防止多次点击同一行而重复请求
      rowData: {}, //点击发送表格存放单行数据,防止多次点击同一行而重复请求

      event_val: "", // 事件关联下拉选择框
      // 表格配置数据
      tableColumn: [
        { label: "发送类型", prop: "type", width: 120 },
        { label: "发送时间", prop: "sendTime", slot: true },
        { label: "收信人数", width: 100, prop: "total" },
        { label: "成功", prop: "success", width: 70, slot: true },
        { label: "失败", prop: "failedResend", width: 70, slot: true },
        { label: "事件标题", prop: "eventTitle", width: 150 },
      ],
      tableData: [],
      tableConfig: {
        height: "610px",
        loading: false,
        selection: false,
      },

      // 传真表格数据配置
      tableFaxColumn: [
        { label: "单位", prop: "unit" },
        { label: "时间", prop: "time", width: 190 },
      ],
      // 传真成功头部
      tableFaxSuccessColumn: [
        { label: "单位", prop: "unit" },
        { label: "时间", prop: "time", width: 190 },
      ],
      // 传真失败头部
      tableFaxLoserColumn: [
        { label: "单位", prop: "unit" },
        {
          label: "操作",
          prop: "operateLoser",
          width: 70,
          slot: true,
          center: "center",
        },
      ],
      tableFaxData: [],
      // 传真成功数据
      tableFaxSuccessData: [],
      // 传真失败数据
      tableFaxLoserData: [],

      tableFaxConfig: {
        height: "435px",
        loading: false,
        selection: false,
      },

      // 分页器配置
      pageConfig: {
        total: 0,
        currentPage: 1,
        totalPages: 0,
        small: false,
        background: true,
      },
      isYangZhouProject: window.g.IsYangZhouProject,
    };
  },
  computed: {
    selectEventStyle() {
      return function (eventId) {
        if(this.left_form.eventId == eventId){
          return "color:#0091ff;background-color:rgba(0, 145, 255, .1);";
        }else{
          return "";
        }
        // return "background-color:rgba(0, 145, 255, .1);";
      };
    },
  },
  created() {
    this.getSendfaxGroupList(); //获取发送记录
    this.getAllEventlist();// 获取关联事件
  },
  methods: {
    /**
     * @param {Array} data [rows, row] rows:表格勾选行 row:当前选中行当前选中或取消选中的一行
     * @lastAuthor hexinting
     * @lastDate 2021-01-28
     * @description 表格点击单选
     */
    selectrow(data) {
      console.log("selectrow接收到了", data[0]);
      this.selectionrows = data[0];
    },
    selectallrow(data) {
      console.log("selectallrow接收到了", data);
      this.selectionrows = data;
    },
    loadMoreHandle() {
      this.currentPage++;
      this.getAllEventlist();
    },
    selectLeftTableEvent(obj) {
      this.tablePopoverVisible = false;
      this.left_form.eventTitle = obj.title;
      this.left_form.eventId = obj.id;
    },
    getAllEventlist() {
      let ipData = {
        dtStart: "",
        dtEnd: "",
        searchText: this.searchText,
        page: this.currentPage,
        size: 10,
      };
      this.$api.todolist(ipData).then((res) => {
        if (res.errorcode == 0) {
          this.faxAllCaseId.push(...res.data.data);
          this.loadMore = res.data.data.length == 0 ? false : true;
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    searchEvent() {
      this.currentPage = 1;
      this.faxAllCaseId = [];
      this.getAllEventlist();
    },
    onbatchEvents() {
      if (this.tableConfig.selection) {
        if (!this.left_form.eventId) {
          this.$message({
            type: "warning",
            message: "请选择关联事件",
          });
          this.tableConfig.selection = !this.tableConfig.selection;
          return false;
        }
        if (this.selectionrows.length == 0) {
          this.$message({
            type: "warning",
            message: "请勾选列表",
          });
          this.tableConfig.selection = !this.tableConfig.selection;
          return false;
        }
        
        var selectionrows = [];
        this.selectionrows.forEach((item) => {
          console.log(selectionrows)
          selectionrows.push({
            iCaseId: this.left_form.eventId,
            id: item.id,
            type: item.type,
            unit: item.unit,
            title: item.title,
            status: item.processing,
            processingResult: item.processingResult,
          });
        });
        this.$http({
          method: "post",
          headers: {
            // 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          url: window.g.ApiUrl + "/eos/history/updatefaxAll",
          data: {
            data: selectionrows,
          },
        }).then(({ data }) => {
          console.log("/eos/history/updatefaxAll", data);
          if (data.errorcode == 0) {
            this.$message({
              type: "success",
              message: "批量关联成功",
            });
            this.getSendfaxGroupList();
            this.selectionrows = [];
          } else {
            this.$message({
              type: "error",
              message: data.msg,
            });
          }
        });
      }
      this.tableConfig.selection = !this.tableConfig.selection;
    },
    // 发送成功/发送失败切换
    handleRadioGroup(val) {
      if (val === "发送成功") {
        this.tableFaxColumn = [...this.tableFaxSuccessColumn];
        this.tableFaxData = [...this.tableFaxSuccessData];
      } else if (val === "发送失败") {
        this.tableFaxColumn = [...this.tableFaxLoserColumn];
        this.tableFaxData = [...this.tableFaxLoserData];
      }
      if (this.tableFaxData.length !== 0) {
        // 表单更新默认显示第一条
        this.rowData = { ...this.tableFaxData[0] };
        this.$emit("clickRowData", this.rowData, "right");
      } else {
        this.$emit("clickRowData", {}, "right");
      }
    },
    // 筛选时间
    handleTimeChange(val) {
      if (val) {
        this.searchData.startTime = this.timeFormat(val[0]) + " 00:00:00"; // 后端统计需要加上时间 author:hexinting date:2020-10-27
        this.searchData.endTime = this.timeFormat(val[1]) + " 23:59:59"; // 后端统计需要加上时间 author:hexinting date:2020-10-27
      } else {
        this.searchData.startTime = "";
        this.searchData.endTime = "";
      }
    },
    // 搜索筛选数据
    search() {
      this.searchData.page = 1;
      this.pageConfig.currentPage = 1;
      this.getSendfaxGroupList();
    },
    // 获取发送记录
    getSendfaxGroupList() {
      this.tableConfig.loading = true;
      this.$api
        .sendfaxGroupList(this.searchData)
        .then((res) => {
          if (!res.data.data) {
            this.tableData = [];
            return;
          }
          // 收/发时间数据格式化
          res.data.data.forEach((e, i) => {
            if (e.sendTime) {
              res.data.data[i].sendTime = e.sendTime
                .trim()
                .replace(" ", "<br />");
            }
          });
          // 返回的数据赋值给table
          this.tableData = res.data.data;
          this.pageConfig.total = res.data.totalElements;
          this.pageConfig.totalPages = res.data.totalPages;

          if (this.tableData.length !== 0) {
            // 表单更新默认显示第一条
            this.rowData = { ...this.tableData[0] };
            this.$emit("clickRowData", this.rowData, "left");
          }

          // 表单更新默认显示第一条
          this.rowTableData = { ...res.data.data[0] };
          // 存在联系人记录再获取联系人收发记录
          if (res.data.totalElements > 0) {
            // 获取发送记录联系人详情记录
            this.getFindFaxGroup(res.data.data[0].groupNum);
          }
          // 表格结束loading
          this.tableConfig.loading = false;
        })
        .catch(() => {
          this.tableConfig.loading = false;
        });
    },
    // 获取发送记录联系人详情记录
    getFindFaxGroup(groupNum) {
      this.tableFaxConfig.loading = true;
      this.tableFaxSuccessData = [];
      this.tableFaxLoserData = [];
      this.$api
        .findFaxGroup({ groupNum })
        .then((res) => {
          if (!res.data) {
            this.tableFaxData = [];
            return;
          }
          res.data.forEach((e) => {
            if (e.status === 1) {
              // 成功
              this.tableFaxSuccessData.push(e);
            } else {
              //失败/失败后重发
              this.tableFaxLoserData.push(e);
            }
          });
          this.tableFaxData = [...this.tableFaxSuccessData];
          this.rowRightClick(this.tableFaxData[0]);
          this.tableFaxConfig.loading = false;
        })
        .catch((err) => {
          this.tableFaxConfig.loading = false;
        });
    },
    // 重发传真
    handleFollower(id) {
      confirmDelete("重新发送", "是否重新发送传真给该单位?")
        .then(() => {
          this.$api
            .faxReSendFax({ id })
            .then((res) => {
              this.$message({
                type: "success",
                message: "重新发送成功",
              });
            })
            .catch((err) => {
              this.$message({
                type: "error",
                message: err.msg,
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 点击表格当行
    rowClick(row) {
      // 防止点击同一条发送重复请求
      if (this.rowTableData.groupNum != row.groupNum) {
        this.initRowClickData(); //初始化数据
        this.getFindFaxGroup(row.groupNum);
        this.rowData = { ...row };
        this.rowTableData = { ...row };
        this.$emit(
          "clickRowData",
          this.rowData ? this.rowData : { ...this.tableData[0] },
          "left"
        );
      }
    },
    // 点击右表格当行
    rowRightClick(row) {
      this.$emit("clickRowData", { ...this.rowData, ...row }, "right");
    },
    // 点击表格当行初始化数据
    initRowClickData() {
      this.radioBtn = "发送成功";
      this.tableFaxColumn = [...this.tableFaxSuccessColumn];
    },
    // 10条/页改变
    sizeChange(val) {
      this.searchData.size = val;
      this.getSendfaxGroupList();
    },
    // 页码改变
    currentChange(val) {
      this.searchData.page = val;
      this.getSendfaxGroupList();
      this.$refs.refTable.changePage();
    },
    // 时间格式化
    timeFormat(val) {
      let date = new Date(val);
      let y = date.getFullYear();
      let m =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return y + "-" + m + "-" + d;
    },
  },
};
</script>

<style scoped>
.mgr14 {
  margin-right: 14px;
}
.mgb14 {
  margin-bottom: 14px !important;
}

.sendFax {
  border-radius: 4px;
  box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
}

.sendFax .left_top_box {
  padding: 20px 30px 15px;
  display: flex;
  align-items: center;
}

.font_style {
  min-width: 40px;
  font-size: 16px;
  color: #555555;
  line-height: 40px;
}

.sendFax .left_box,
.rigth_box {
  min-height: 82vh;
}

.sendFax .rigth_inner_box {
  background: white;
  margin-bottom: 15px;
  padding: 20px 14px 14px;
  box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
  border-radius: 4px;
  position: relative;
}

.send_el-card {
  padding: 20px 14px 38px;
}

.send_el-card >>> .el-card__header {
  text-align: left;
  padding: 0;
  font-size: 17px;
  font-weight: 600;
  color: #323232;
  border: none;
  margin-bottom: 14px;
}
.send_el-card >>> .el-card__body {
  padding: 0;
}

.send_el-card >>> .el-card__body .bottom {
  display: flex;
  justify-content: space-between;
}

.common_h5 {
  font-size: 18px;
  font-weight: 600;
  color: #323232;
  padding: 0 0 0 14px;
  margin: 0;
  text-align: left;
  position: relative;
}
.common_h5:after {
  content: "";
  width: 3px;
  height: 18px;
  background: #0091ff;
  position: absolute;
  top: 5px;
  left: 0;
}

.followerIcon {
  cursor: pointer;
  font-size: 18px;
  color: #9fc8fe;
}
.followerIcon:hover {
  color: #0091ff;
}

.table_box {
  min-height: 610px;
}
.fax_queue_table {
  min-height: 435px;
}
.datePicker {
  position: relative;
}
.datePicker >>> .el-icon-date {
  position: absolute;
  right: 6px;
}
.sendFax .clearfix > span {
  display: block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
