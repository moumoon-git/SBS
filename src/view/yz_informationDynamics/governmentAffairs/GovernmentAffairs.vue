<template>
  <div>
    <div class="navsBar">
      <el-row style="padding:10px 10px 0 20px;">
        <el-col :span="7">
          <div style="display: flex;">
            <el-input placeholder="请输入标题" v-model="searchText" class="input-with-select" @keyup.enter.native="handleSearch">
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="handleSearch"
                class="searchButton"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="17">
          <!-- <table-button-group ref="TableButtonGroup" style="float: right;margin-right: 16px" @handleAdd="handleAdd"
          @handleEdit="handleEdit" @handleDelete="handleDelete"></table-button-group>-->
          <div style="float: right;">
            <el-button type="primary" @click="zeroReport">新增零报告</el-button>
            <el-button type="primary" @click="typeMangerHandle">类型管理</el-button>
            <el-button type="primary" @click="handleAdd">新增</el-button>
            <el-button type="primary" @click="handleEdit">修改</el-button>
            <el-button type="primary" @click="handleDelete">删除</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-row>
      <el-col :span="15">
        <div class="contentStyle">
          <el-main>
            <div class="tableContainer">
              <el-table
                ref="singleTable"
                :data="tableData"
                highlight-current-row
                height="694px"
                :header-cell-style="{background:'rgba(249,251,255,1)',color:'#333'}"
                @row-click="handleClick"
              >
                <el-table-column
                  prop="id"
                  width="60"
                  :resizable="false"
                  label="序号"
                  style="padding-left: 15px;"
                ></el-table-column>
                <el-table-column
                  v-for="(item,key) in tableColumn"
                  :key="key"
                  :label="item.label"
                  :prop="item.prop"
                  :min-width="item.minWidth"
                  :resizable="false"
                  :show-overflow-tooltip="item.showTip"
                ></el-table-column>
                <el-table-column
                  width="100"
                  :resizable="false"
                  label="状态"
                  style="padding-left: 15px;"
                >
                  <template slot-scope="scope">
                    <span
                      :style="{color:scope.row.send==0?'#FF977A':'#0091FF'}"
                    >{{scope.row.send==0?"未下发":scope.row.send==1?"已下发":"未知"}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  width="70"
                  :resizable="false"
                  label="操作"
                  style="padding-left: 15px;"
                >
                  <template slot-scope="scope">
                    <i
                      class="icon-issue"
                      v-if="scope.row.send==0"
                      size="mini"
                      @click.stop="issueHandle(scope.row.id)"
                      style="cursor:pointer;height:15px"
                    ></i>
                    <i
                      class="icon-see"
                      v-else-if="scope.row.send==1"
                      size="mini"
                      style="cursor:pointer;height:15px;"
                      @click.stop="seeHandle(scope.row.id)"
                    ></i>
                    <span v-else>-</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                background
                class="pagination"
                :page-size="pageSize"
                :page-sizes="[10,20,30,40]"
                :total="total"
                :current-page="currentPage"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                layout="prev, pager, next, sizes"
                width="100"
              ></el-pagination>
            </div>
          </el-main>
        </div>
      </el-col>
      <!--详情信息框-->
      <el-col :span="9">
        <work-details ref="workDetails" @handleAddAtt="handleAddAtt"></work-details>
      </el-col>
    </el-row>

    <!--响应情况弹窗-->
    <response
      ref="response"
      :responseId="responseId"
      v-if="responseVisiable"
      @closeDialog="responseVisiable = false"
    ></response>

    <!--工作安排弹窗-->
    <report-or-work
      ref="reportOrWork"
      @getTableData="getTableData"
      v-if="reportOrWorkVisiable"
      :title="title"
      @closeDialog="reportOrWorkVisiable = false"
    ></report-or-work>

    <!--类型管理-->
    <type-manger ref="typeManger"></type-manger>
  </div>
</template>

<script>
import TableButtonGroup from "@/yz_components/button/tableButtonGroup";
import SearchBar from "@/yz_components/menu/searchBar";
import WorkDetails from "@/view/yz_informationDynamics/governmentAffairs/WorkDetails";
import ReportOrWork from "@/view/yz_informationDynamics/governmentAffairs/ReportOrWork";
import response from "@/view/yz_informationDynamics/governmentAffairs/Response";
import typeManger from "@/view/yz_informationDynamics/governmentAffairs/TypeManger";

export default {
  name: "workingArrangement",
  components: {
    WorkDetails,
    SearchBar,
    TableButtonGroup,
    ReportOrWork,
    response,
    typeManger
  },
  data() {
    return {
      placeholder: "输入标题/内容/责任单位/负责人", //搜索框提示
      searchText: "", //搜索内容
      tableData: [], //表格数据
      tableColumn: [
        {
          label: "标题",
          prop: "title",
          minWidth: "150",
          showTip: true
        },
        {
          label: "更新时间",
          prop: "updateTime",
          minWidth: "150",
          showTip: false
        },
        {
          label: "是否零报告",
          prop: "zeroReportStatus",
          minWidth: "60",
          showTip: false
        }
      ], //表头
      total: 0, //数据总数
      pageSize: 10, //每页条数
      currentPage: 1, //当前页
      rowData: null, //当前选中行
      responseVisiable: false, // 响应情况视图
      reportOrWorkVisiable: false, // 新增零报告，新增/修改工作安排，试图
      title: "" // 新增零报告，新增/修改工作安排，标题
    };
  },
  created() {
    // this.$nextTick(() => {
    //   this.$refs.TableButtonGroup.refreshIsShow = false;
    //   this.$refs.TableButtonGroup.sortIsShow = false;
    //   this.$refs.TableButtonGroup.batchJoinIsShow = false;
    // });
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    //表格数据
    getTableData() {
      let params = {
        key: this.searchText,
        page: this.currentPage-1,
        size: this.pageSize
      };

      this.$api.seeAffairs(params).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.tableData = res.data.appSjsAffairs;
        this.total = res.data.countAll;
        // 扬州需求 时间精确到分钟
        if(window.g.IsYangZhouProject){
          console.log(res.data.appSjsAffairs)
          for(var i in res.data.appSjsAffairs){
            this.tableData[i].updateTime = res.data.appSjsAffairs[i].updateTime.substring(0,res.data.appSjsAffairs[i].updateTime.lastIndexOf(':'))
          }
        }
        // 判断是否零报告
        for(var i in res.data.appSjsAffairs){
          console.log(this.tableData[i].affairsTypeId)
          if(this.tableData[i].affairsTypeId == null){
            this.tableData[i].zeroReportStatus = '是'
          }else{
            this.tableData[i].zeroReportStatus = '否'
          }
        }
        //默认显示第一条数据
        this.$nextTick(() => {
          if (this.tableData.length !== 0) {
            this.$refs.workDetails.showData(res.data.appSjsAffairs[0]);
            this.rowData = res.data.appSjsAffairs[0];
            // 默认选中第一行，第一行高亮
            document.getElementsByTagName('tbody')[0].rows[0].classList.add('current-row')
          } else {
            this.$refs.workDetails.showData(null);
          }
        });
      });
    },
    //页数改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableData();
    },
    //每页条数改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTableData();
    },
    //表格点击事件
    handleClick(row, column, event) {
      this.tableData.forEach((item, index) => {
        if (row.id === item.id) {
          document.getElementsByTagName('tbody')[0].rows[index].classList.add('current-row')
        } else {
          document.getElementsByTagName('tbody')[0].rows[index].classList.remove('current-row')
        }
      })
      this.$nextTick(() => {
        this.$refs.workDetails.showData(row);
        this.rowData = row;
      });
    },
    //新增零报告
    zeroReport() {
      this.$nextTick(() => {
        this.reportOrWorkVisiable = true;
        this.$nextTick(() => {
          this.$refs.reportOrWork.isDialogVisible = true;
          this.title = "新增零报告";
          this.$refs.reportOrWork.typeId = 373;
        });
        // this.$refs.ContactDetailsPopup.treeData = this.treeData;
      });
    },
    //新增工作安排
    handleAdd() {
      this.$nextTick(() => {
        this.reportOrWorkVisiable = true;
        this.$nextTick(() => {
          this.$refs.reportOrWork.isDialogVisible = true;
          this.title = "新增工作安排";
          this.$refs.reportOrWork.typeId = 373;
        });
        // this.$refs.ContactDetailsPopup.treeData = this.treeData;
      });
    },
    // 类型管理
    typeMangerHandle() {
      this.$nextTick(() => {
        this.$refs.typeManger.isDialogVisible = true;
      });
    },
    //修改工作安排
    handleEdit() {
      if (!this.rowData) {
        this.$message({
          message: "请选中表格中任意行进行修改!",
          type: "warning"
        });
        return;
      }else if (this.rowData.send == 1) {
        this.$message.error("工作安排已下发，不能修改");
        return;
      }
      this.reportOrWorkVisiable = true;
      this.$nextTick(() => {
        this.$refs.reportOrWork.isDialogVisible = true;
        this.title = "修改工作安排";
        this.$refs.reportOrWork.showData(this.rowData);
      });
    },
    //删除工作安排
    handleDelete() {
      if (!this.rowData) {
        this.$message({
          message: "请选中表格中任意行进行删除!",
          type: "warning"
        });
        return;
      }else if (this.rowData.send == 1) {
        this.$message.error("工作安排已下发，无法删除");
        return;
      } 
      else {
        let data = {
          id: this.rowData.id
        };
        this.$confirm("删除当前信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$api.delAffairs({ data }).then(res => {
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
                return;
              }
              this.$message({
                message: "删除成功!",
                type: "success"
              });
              this.getTableData();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除!"
            });
          });
      }
    },
    //模糊搜索
    handleSearch() {
      this.currentPage = 1;
      this.getTableData();
    },
    handleAddAtt() {
      this.reportOrWorkVisiable = true;
      this.$nextTick(() => {
        this.$refs.reportOrWork.isDialogVisible = true;
        this.title = "添加附件";
        this.$refs.reportOrWork.showData(this.rowData);
      });
    },
    // 下发
    issueHandle(id) {
      let data = {
        id,
      };
      this.$api.issue({data}).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.$message({
          message: "下发成功!",
          type: "success"
        });
        this.getTableData();
      });
    },
    // 查看
    seeHandle(id) {
      // let data = {
      //   id: id,
      // }
      // this.$api.response(data).then(res => {
      //   if (res.errorcode != 0) {
      //     this.$message({
      //       message: res.msg,
      //       type: "error"
      //     });
      //     return;
      //   }

      // });
      this.responseVisiable = true;
      this.responseId = id;
      this.$nextTick(() => {
        this.$refs.response.dialogVisible = true;
      }, 1000);
    }
  }
};
</script>

<style scoped>
.navsBar {
  margin: 20px 10px 0;
  height: 56px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 3px;
}
.searchButton {
  padding: 10px 11px;
  background-color: #3f92fe !important;
  border-color: #3f92fe !important;
  border-radius: 0 3px 3px 0;
  color: white !important;
  font-size: 18px;
}
/* 功能按钮间距 */
>>> .el-button + .el-button {
  margin-left: 3px;
}

.contentStyle {
  margin-left: 10px;
  margin-top: 10px;
  height: 790px;
  background-color: white;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border: 1px solid rgba(219, 219, 219, 1);
  border-radius: 3px;
}

>>> .el-main {
  padding: 0;
}

.buttonGroup {
  float: left;
  margin-top: 24px;
  margin-left: 32px;
}
>>> .el-table .cell,
.el-table th div,
.el-table--border td:first-child .cell,
.el-table--border th:first-child .cell {
  padding-left: 20px;
}

.tableContainer {
  height: 744px;
  /* padding: 6px;
    margin-right: 16px;
    border: 1px solid rgba(211, 215, 219, 1); */
}

.tree {
  margin-right: 16px;
  margin-bottom: 24px;
}

>>> .el-table::before {
  height: 0;
}

.pagination {
  margin-top: 16px;
  padding: 0;
  text-align: right;
}

/* 鼠标悬停分页背景色 */
>>> .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #0091ff;
}

/* 分页宽度样式 */
>>> .el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  min-width: 32px;
}

/* 分页高度样式 */
>>> .el-pager li {
  height: 32px;
  line-height: 32px;
}

/* 上一页样式 */
>>> .el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(221, 222, 225, 1);
}

/* 下一页样式 */
>>> .el-pagination.is-background .btn-prev {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(221, 222, 225, 1);
}
/* 每页样式 */
>>> .el-pagination.is-background .el-pager li {
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  border: 1px solid rgba(221, 222, 225, 1);
}

/* 每页条数样式 */
>>> .el-input--mini .el-input__inner {
  height: 32px;
  line-height: 32px;
}

/* >>> .el-pagination__jump {
  margin-left: 0;
} */

/* 全局主要按钮未悬停样式 */
>>> .el-button--primary {
  background: #0091ff;
  border-color: #0091ff;
}

/* 全局主要按钮悬停样式 */
>>> .el-button--primary:hover {
  background: #5eadff !important;
  border-color: #5eadff !important;
}

/* 全局主要按钮聚焦样式 */
>>> .el-button--primary:focus {
  background: #2776e0 !important;
  border-color: #2776e0 !important;
}
</style>
