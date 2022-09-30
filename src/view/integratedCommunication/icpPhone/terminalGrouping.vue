<!--@author：llp-->
<template>
  <div>
    <el-row>
      <div class="navsBar" style="height: 80px">
        <search-bar ref="SearchBar" :placeholder="placeholder" @handleSearch="handleSearch"></search-bar>
      </div>
    </el-row>
    <el-row>
      <el-col :span="18">
        <div class="contentStyle">
          <el-row>
            <el-header style="height: 72px;padding: 0">
              <table-button-group ref="TableButtonGroup" class="buttonGroup"></table-button-group>
            </el-header>
          </el-row>
          <el-row>
            <el-main style="margin-top:16px;margin-left:16px">
              <el-col :span="5">
                <tree class="tree" :treeData="treeData" @handleNodeClick="handleNodeClick"></tree>
              </el-col>
              <el-col :span="19">
                <div class="tableContainer">
                  <telephone-table class="table" :tableColumn="tableColumn"
                                   @handleRowClick="handleRowClick"
                                   :tableData="tableData">
                  </telephone-table>
                  <el-pagination class="pagination" :page-size="pageSize"  :total="total"
                                 :current-page="currentPage"
                                 @current-change="handCurrentChange"
                                 @size-change="handSizeChange"
                                 layout="total, prev, pager, next, sizes, jumper"></el-pagination>
                </div>
              </el-col>
            </el-main>
          </el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <terminal-details ref="TerminalDetails"></terminal-details>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import SearchBar from '../../../components/menu/searchBar'
  import TableButtonGroup from "../../../components/button/tableButtonGroup";
  import Tree from "../../../components/tree/tree";
  import TelephoneTable from "../../../components/table/telePhoneTable";
  import TerminalDetails from "@/view/integratedCommunication/icpPhone/terminalDetails";

  export default {
    name: "terminalGrouping",
    components: {
      TerminalDetails,
      TelephoneTable,
      "tree": Tree,
      "table-button-group": TableButtonGroup,
      "searchBar": SearchBar,
    },
    data() {
      return {
        treeData: [],//树节点数据
        tableColumn: [
          {
            prop: "name",
            label: "设备名称"
          }, {
            prop: "uri",
            label: "号码"
          }],//表头
        tableData: [],//表格数据
        total: 0,//数据总数
        pageSize: 10,//总页数
        currentPage: 1,//当前页数
        placeholder: '请输入姓名/单位/职位/号码',
        groupId: '',//分组id,
        searchText: ''//搜索内容
      }
    },
    created() {
      this.$nextTick(() => {
        this.$refs.SearchBar.groupingIsShow = false;
        this.$refs.SearchBar.advancedSearchIsShow = false;
        this.$refs.TableButtonGroup.sortIsShow = false;
        this.$refs.TableButtonGroup.batchJoinIsShow = false;
      })
    },
    mounted() {
      this.getTerminalGroupListData();
      this.getTerminalListData();
    },
    methods: {
      //获取终端分组
      getTerminalGroupListData() {
        let data = {
          displayDefault: true
        };
        this.$api.terminalGroupList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.treeData = res.data;
        })
      },
      //获取终端分组详细信息
      getTerminalListData() {
        let data={};
        if (this.searchText == "") {
          data = {
            groupId: this.groupId,
            page: this.currentPage,
            size: this.pageSize,
            searchText: this.searchText,
          };
        } else {
          data = {
            page: this.currentPage,
            size: this.pageSize,
            searchText: this.searchText,
          };
        }
        this.$api.terminalList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.tableData = res.data.data;
          this.total = res.data.totalElements;
        })
      },
      //点击树方法
      handleNodeClick(data, node) {
        this.groupId = data.id;
        this.currentPage = 1;
        this.getTerminalListData();
      },
      //改变页数查询
      handCurrentChange(val) {
        this.currentPage = val;
        this.getTerminalListData();
      },
      //改变每页条数查询
      handSizeChange(val) {
        this.currentPage = 1;//跳转到第一页
        this.pageSize = val;
        this.getTerminalListData();
      },
      //表格行点击方法
      handleRowClick(row) {
        this.$nextTick(() => {
          this.$refs.TerminalDetails.showData(row);
        })
      },
      //搜索方法
      handleSearch(type, text) {
        switch (type) {
          case "关键字查询":
            this.searchText = text;
            this.currentPage = 1;
            this.getTerminalListData();
            break;
        }
      },
    }
  }
</script>

<style scoped>
  .navsBar {
    margin: 0 30px;
    padding: 0 30px;
    background-color: white;
    display: flex;
    align-items: center;
    border: 1px solid rgba(219, 219, 219, 1);
    box-sizing: border-box;
    border-radius: 3px;
  }

  .contentStyle {
    margin-left: 30px;
    margin-top: 16px;
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
    height: 664px;
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

