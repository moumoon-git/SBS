<!--@author：yf-->
<template>
  <el-container>
    <el-main style="padding: 0 30px 0 30px">
      <el-header class="navsBar" style="height: 80px">
        <el-col :span="24">
          <el-col :span="12" style="text-align: left">
            <el-date-picker
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="value"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </el-col>
          <el-col :span="12">
            <el-col :span="24">
              <div style="display: flex">
                <div style="flex: 1">
                  <el-input
                    clearable
                    placeholder="输入标题"
                    prefix-icon="el-icon-search"
                    v-model="searchInput"
                  >
                  </el-input>
                </div>
                <div style="flex: 1; text-align: left; text-indent: 10px">
                  <el-button type="primary" size="medium" @click="searchData"
                    >查找</el-button
                  >
                </div>
              </div>
            </el-col>
          </el-col>
        </el-col>
      </el-header>
      <el-row
        :style="styleBulletin"
        class="contentStyle"
        style="min-height: 600px"
      >
        <el-col :span="12">
          <div class="tableContainer">
            <my-table
              style="max-height: 650px; overflow-y: auto"
              :tableColumn="tableColumn"
              :tableData="tableData"
              @handleCurrentChange="handleCurrentChange"
            ></my-table>
            <el-pagination
              :small="pagingSize"
              :page-size="pageSize"
              :page-sizes="[10, 20, 30, 40]"
              :total="total"
              :current-page="currentPage"
              @size-change="handleSizeChange"
              @current-change="pageMode"
              layout="total,prev,pager,next,sizes,jumper"
            ></el-pagination>
          </div>
        </el-col>

        <el-col :span="12">
          <incident-report
            ref="incidentReport"
            :event-id="eventId"
            :is-linkage="false"
          ></incident-report>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import navBar from "@/view/eventManagement/eventReports/Page/criminalHistory/navbar";
import historicalDetails from "@/view/eventManagement/eventBulletin/Page/historicalDetails";
import expressTheDetails from "@/view/eventManagement/eventBulletin/Page/expressTheDetails";
import incidentReport from "@/view/eventManagement/eventBulletin/Page/incidentReport";
import myTable from "@/components/tables/tables";

export default {
  name: "eventLetters",
  components: {
    navBar,
    myTable,
    historicalDetails,
    expressTheDetails,
    incidentReport,
  },
  data() {
    return {
      gutter: 20,
      value: "", //时间
      searchInput: "", //搜索
      //导航条模块
      // tableColumn: [
      //   {
      //     prop: "eventCode",
      //     label: "事件编号",
      //   },
      //   {
      //     prop: "title",
      //     label: "事件标题",
      //   },
      //   {
      //     prop: "caseClass",
      //     label: "事件类型",
      //   },
      //   {
      //     prop: "occurTime",
      //     label: "事发时间",
      //   },
      //   {
      //     prop: "status",
      //     label: "事件状态",
      //   },
      //   {
      //     prop: "reportTime",
      //     label: "接报时间",
      //   },
      //   {
      //     prop: "dutyPeople",
      //     label: "接报人",
      //   },
      // ], //表头
      tableData: [], //表格数据
      tableColumn: [
        {
          prop: "eventCode",
          label: "事件编号",
        },
        {
          prop: "title",
          label: "事件标题",
        },
        {
          prop: "caseClass",
          label: "事件类型",
        },
        {
          prop: "occurTime",
          label: "事发时间",
        },
      ],
      total: 0, //数据总数
      pageSize: 10, //总页数
      currentPage: 1, //当前页数
      pagingSize: true, //分页大小

      rowData: [],

      searchJt: "", //解决分页bug

      forceRefresh: true, //强制刷新
      styleBulletin: {
        height: "",
      },
      rightStyle: {
        height: "",
      },
      eventId: " ", // 事件续保Id
      eventList: [], // 右边所有事件续保数据
    };
  },
  watch: {
    searchJt: {
      handler(newV, oldV) {
        if (newV !== oldV) {
          this.currentPage = 1;
        }
      },
    },
  },
  created() {
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
  },
  mounted() {
    this.getEventHistorical();
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  methods: {
    getEventHistorical() {
      //获取事件历史
      let data = {
        size: this.pageSize,
        page: this.currentPage,
      };
      this.$api.eventInformationHistory(data).then((res) => {
        if (res.errorcode == 0) {
          this.tableData = res.data.data;
          this.total = res.data.totalElements;
        }
      });
    },
    searchData() {
      //查找数据
      this.currentPage = 1;
      this.searchJt = this.searchInput;
      let timeValue = [];
      if (this.value == "" || this.value == null) {
        timeValue.push({ sta: null, end: null });
      } else {
        timeValue.push({
          sta: this.value[0],
          end: this.value[1],
        });
      }
      let data = {
        size: this.pageSize,
        page: this.currentPage,
        name: this.searchJt,
        beginTime: timeValue[0].sta,
        endTime: timeValue[0].end,
      };
      this.$api.eventInformationHistory(data).then((res) => {
        if (res.errorcode == 0) {
          this.tableData = res.data.data;
          this.total = res.data.totalElements;
          // 扬州需求 时间精确到分钟
          for (var i in res.data.data) {
            this.tableData[i].occurTime = res.data.data[i].occurTime.substring(
              0,
              res.data.data[i].occurTime.lastIndexOf(":")
            );
          }
        }
      });
    },
    handleSizeChange(val) {
      //监听每页数量
      this.currentPage = 1;
      this.rowData = [];
      this.forceRefresh = false;
      this.$nextTick(() => {
        this.forceRefresh = true;
      });
      this.pageSize = val;
      if (
        this.searchInput !== "" ||
        this.searchInput != null ||
        this.value !== "" ||
        this.value != null
      ) {
        console.log(this.searchJt);
        let timeValue = [];
        if (this.value == "" || this.value == null) {
          timeValue.push({ sta: null, end: null });
        } else {
          timeValue.push({
            sta: this.value[0],
            end: this.value[1],
          });
        }
        let data = {
          size: this.pageSize,
          page: this.currentPage,
          name: this.searchJt,
          beginTime: timeValue[0].sta,
          endTime: timeValue[0].end,
        };
        this.$api.eventInformationHistory(data).then((res) => {
          if (res.errorcode == 0) {
            this.tableData = res.data.data;
            this.total = res.data.totalElements;
            // 扬州需求 时间精确到分钟
            for (var i in res.data.data) {
              this.tableData[i].occurTime = res.data.data[
                i
              ].occurTime.substring(
                0,
                res.data.data[i].occurTime.lastIndexOf(":")
              );
            }
          }
        });
      } else {
        this.getEventHistorical();
      }
    },
    pageMode(val) {
      //监听是第几页
      this.rowData = [];
      this.forceRefresh = false;
      this.$nextTick(() => {
        this.forceRefresh = true;
      });
      console.log(val);
      this.currentPage = val;
      if (
        (this.searchInput !== "" && this.searchInput != null) ||
        (this.value !== "" && this.value != null)
      ) {
        console.log(this.searchJt);
        let timeValue = [];
        if (this.value == "" || this.value == null) {
          timeValue.push({ sta: null, end: null });
        } else {
          timeValue.push({
            sta: this.value[0],
            end: this.value[1],
          });
        }
        let data = {
          size: this.pageSize,
          page: this.currentPage,
          name: this.searchJt,
          beginTime: timeValue[0].sta,
          endTime: timeValue[0].end,
        };
        this.$api.eventInformationHistory(data).then((res) => {
          if (res.errorcode == 0) {
            this.tableData = res.data.data;
            this.total = res.data.totalElements;
            // 扬州需求 时间精确到分钟
            for (var i in res.data.data) {
              this.tableData[i].occurTime = res.data.data[
                i
              ].occurTime.substring(
                0,
                res.data.data[i].occurTime.lastIndexOf(":")
              );
            }
          }
        });
      } else {
        this.getEventHistorical();
      }
    },
    handleCurrentChange(row) {
      this.eventId = row.id;
      //表格行点击
      // 加 nextTick 页面重新渲染在执行 避免点击表格拿详情接口还是上次点击表格保持的Id
      this.$nextTick(() => {
        this.$refs.incidentReport.getIncidentReportList();
      });
    },
    getHeight() {
      let h =
        document.documentElement.clientHeight || document.body.clientHeight;
      this.styleBulletin.height = h - (68 + 220) + "px";
      this.rightStyle.height = h - (68 + 300) + "px";
    },
  },
};
</script>

<style scoped>
.navsBar {
  background-color: white;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid rgba(219, 219, 219, 1);
  border-radius: 3px;
}
.contentStyle {
  background-color: white;
  box-sizing: border-box;
  border: 1px solid rgba(219, 219, 219, 1);
  border-radius: 3px;
}
.tableContainer {
  padding: 6px;
  box-sizing: border-box;
  border: 1px solid rgba(211, 215, 219, 1);
}
>>> .el-pagination {
  padding: 40px 5px;
}
</style>
