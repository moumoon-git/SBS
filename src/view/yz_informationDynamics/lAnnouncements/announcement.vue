<template>
  <div>
    <div class="navsBar">
      <el-row style="margin-top:10px">
        <el-col :span="8" style="margin-left: 32px">
          <el-input
            :placeholder="placeholder"
            prefix-icon="el-icon-search"
            class="searchInput"
            v-model="searchText"
            clearable
          ></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-col>
        <el-col :span="13">
          <table-button-group ref="TableButtonGroup" style="float: right;margin-right: 16px" @handleAdd="handleAdd"
                              @handleEdit="handleEdit" @handleDelete="handleDelete"></table-button-group>
        </el-col>
      </el-row>
    </div>


    <el-row>
      <el-col :span="10">
        <div class="contentStyle">
          <el-main style="margin-top:16px;margin-left:16px;">
            <div class="tableContainer">
              <el-table ref="singleTable" :data="tableData" highlight-current-row
                        :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                        height="694px"
                        @row-click="handleClick"
              >
                <el-table-column type="index" min-width="50" :resizable="false"></el-table-column>
                <el-table-column min-width="160" v-for="(item,key) in tableColumn" :key="key" :label="item.label"
                                 :prop="item.prop"
                                 :width="item.width" :resizable="false"></el-table-column>
              </el-table>
              <el-pagination class="pagination" :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"
                             :current-page="currentPage"
                             @current-change="handleCurrentChange"
                             @size-change="handleSizeChange"
                             layout="total, prev, pager, next, sizes, jumper"></el-pagination>
            </div>
          </el-main>
        </div>
      </el-col>
      <!--详情信息框-->
      <el-col :span="14">
        <table-details ref="TableDetails" @handleAddAtt="handleAddAtt"></table-details>
      </el-col>
    </el-row>
    <!--工作安排弹窗-->
    <work-popup ref="WorkPopup" @getTableData="getTableData"></work-popup>
  </div>
</template>

<script>
  import TableButtonGroup from "@/yz_components/button/tableButtonGroup";
  import SearchBar from "@/yz_components/menu/searchBar";
  import TableDetails from "@/view/yz_informationDynamics/tableDetails";
  import workPopup from "@/view/yz_informationDynamics/workPopup";

  export default {
    name: "announcement",
    components: {TableDetails,SearchBar, TableButtonGroup, workPopup},
    data() {
      return {
        placeholder: "输入标题/内容",//搜索框提示
        searchText: "",//搜索的值
        tableData: [],//表格数据
        tableColumn: [{
          label: "标题",
          prop: "title",
        }, {
          label: "更新时间",
          prop: "lastUpdate",
        }],//表头
        total: 0,//数据总数
        pageSize: 10,//每页条数
        currentPage: 1,//当前页
      }
    },
    created() {
      this.$nextTick(() => {
        this.$refs.TableButtonGroup.refreshIsShow = false;
        this.$refs.TableButtonGroup.sortIsShow = false;
        this.$refs.TableButtonGroup.batchJoinIsShow = false;
      })
    },
    mounted() {
      this.getTableData();
    },
    methods: {
      //获取表格数据
      getTableData() {
        let data = {
          iType: 370,
          page: this.currentPage,
          size: this.pageSize,
        };
        if (this.searchText != "") {
          data.searchText = this.searchText
        }
        this.$api.InformationReleas(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          this.tableData = res.data.data;
          this.total = res.data.totalElements;
          // 扬州需求 时间精确到分钟
          if(window.g.IsYangZhouProject){
            for(var i in res.data.data){
              this.tableData[i].lastUpdate = res.data.data[i].lastUpdate.substring(0,res.data.data[i].lastUpdate.lastIndexOf(':'))
            }
          }
          //默认显示第一条数据
          this.$nextTick(()=>{
            if (this.tableData.length !== 0) {
              this.$refs.TableDetails.showData(res.data.data[0]);
              this.rowData = res.data.data[0]
            }else{
              this.$refs.TableDetails.showData(null);
            }
          });
        })
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
      handleClick(row) {
        this.$nextTick(() => {
          this.$refs.TableDetails.showData(row);
          this.rowData = row;
        });
      },
      //新增工作安排
      handleAdd() {
        this.$nextTick(() => {
          this.$refs.WorkPopup.isDialogVisible = true;
          this.$refs.WorkPopup.title = "新增文档";
          this.$refs.WorkPopup.workForm.type = 370;
          // this.$refs.ContactDetailsPopup.treeData = this.treeData;
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
        }
        this.$refs.WorkPopup.isDialogVisible = true;
        this.$refs.WorkPopup.title = "修改文档";
        this.$refs.WorkPopup.showData(this.rowData)
      },
      //删除工作安排
      handleDelete() {
        if (!this.rowData) {
          this.$message({
            message: "请选中表格中任意行进行删除!",
            type: "warning"
          });
          return;
        } else {
          let data = {
            id: this.rowData.id
          };
          this.$confirm('删除当前信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.appDutyInformationReleasDelete(data).then(res => {
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
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除!'
            });
          });
        }
      },
      //模糊搜索
      handleSearch() {
        this.currentPage = 1
        this.getTableData()
      },
      handleAddAtt(){
        this.$refs.WorkPopup.isDialogVisible = true;
        this.$refs.WorkPopup.title = "添加附件";
        this.$refs.WorkPopup.showData(this.rowData)
      }
    }

  }
</script>

<style scoped>
  .navsBar {
    margin: 20px 30px;
    height: 56px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
  }

  .contentStyle {
    margin-left: 30px;
    margin-top: 16px;
    height: 790px;
    background-color: white;
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

  .tableContainer {
    height: 744px;
    padding: 6px;
    margin-right: 16px;
    border: 1px solid rgba(211, 215, 219, 1);
  }

  .tree {
    margin-right: 16px;
    margin-bottom: 24px
  }

  >>> .el-table::before {
    height: 0;
  }

  .pagination {
    margin-top: 16px;
    padding: 0;
  }

  >>> .el-pagination__jump {
    margin-left: 0;
  }

</style>
