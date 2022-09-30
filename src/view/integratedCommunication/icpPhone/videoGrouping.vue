<!--@author：llp-->
<template>
  <div>
    <el-row>
      <div class="navBar" style="height: 80px">
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
                  <video-grouping-table class="table" :tableColumn="tableColumn"
                                        @handleRowClick="handleRowClick"
                                        :tableData="tableData">
                  </video-grouping-table>
                  <el-pagination class="pagination" :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"
                                 :current-page="currentPage"
                                 @current-change="handleCurrentChange"
                                 @size-change="handleSizeChange"
                                 layout="total, prev, pager, next, sizes, jumper"></el-pagination>
                </div>
              </el-col>
            </el-main>
          </el-row>
        </div>
      </el-col>
      <el-col :span="6">
        <video-grouping-Details ref="VideoGroupingDetails"></video-grouping-Details>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import SearchBar from '../../../components/menu/searchBar'
  import TableButtonGroup from "../../../components/button/tableButtonGroup";
  import Tree from "../../../components/tree/tree";
  import VideoGroupingTable from "@/components/table/videoGroupingTable";
  import VideoGroupingDetails from "../icpPhone/videoGroupingDetails";

  export default {
    name: "videoGrouping",
    components: {
      VideoGroupingTable,
      VideoGroupingDetails,
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
            prop: "indexCode",
            label: "号码",
          }],//表头
        tableData: [],//表格数据
        total: 0,//数据总数
        pageSize: 10,//总页数
        currentPage: 1,//当前页数
        placeholder: '请输入姓名/单位/职位/号码',
        groupId: -1 ,//默认分组id
        searchText:''//搜索内容
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
      this.getVideoGroupTree();
      this.getVideoList();
    },
    methods: {
      //获取视频分组树
      getVideoGroupTree() {
        let data = {
          displayDefault: true
        };
        this.$api.videoGroupList(data).then(res => {
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
      //获取设备信息
      getVideoList() {
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
        this.$api.getVideoList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.tableData = res.data.data;
          this.total = res.data.totalElements;
        });
      },
      //改变查询页数
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getVideoList();
      },
      //改变每页查询条数
      handleSizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.getVideoList();
      },
      //树点击方法
      handleNodeClick(data) {
        this.currentPage = 1;
        this.groupId = data.id;
        this.getVideoList();
      },
      //表格行点击方法
      handleRowClick(row) {
        this.$nextTick(()=>{
          this.$refs.VideoGroupingDetails.showData(row);
        })
      },
      //搜索方法
      handleSearch(type, text) {
        switch (type) {
          case "关键字查询":
            this.searchText = text;
            this.currentPage = 1;
            this.getVideoList();
            break;
        }
      },
    }
  }
</script>

<style scoped>
  .navBar {
    margin: 0 30px;
    padding-left: 30px;
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
    margin-right: 16px;
    padding: 6px;
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


</style>


