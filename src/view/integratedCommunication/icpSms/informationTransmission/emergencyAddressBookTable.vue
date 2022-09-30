<!--@author：llp-->
<template>
  <div>
    <el-row>
      <!--树-->
      <el-col :span="5">
        <tree class="tree" :treeData="treeData" @handleNodeClick="handleNodeClick"></tree>
      </el-col>
      <!--表格-->
      <el-col :span="19">
        <div class="tableContainer">
          <el-row>
            <el-table ref="singleTable" :data="tableData" highlight-current-row
                      :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                      style="height: 614px;">
              <el-table-column type="index" min-width="50" :resizable="false"></el-table-column>
              <el-table-column min-width="160" v-for="(item,key) in tableColumn" :key="key" :label="item.label"
                               :prop="item.prop"
                               :width="item.width" :resizable="false"></el-table-column>
              <el-table-column label="操作" :resizable="false">
                <template slot-scope="scope" >
                  <el-button type="info" size="mini" @click="addMsgPhone(scope.row)">添加</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <!--分页-->
          <el-row>
            <el-pagination class="pagination" :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"
                           :current-page="currentPage"
                           @current-change="handCurrentChange"
                           @size-change="handSizeChange"
                           layout="total, prev, pager, next, sizes, jumper"></el-pagination>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import TelephoneTable from "@/components/table/telePhoneTable";
  import Tree from "@/components/tree/tree";

  export default {
    name: "emergencyAddressBookTable",
    components: {
      Tree,
      TelephoneTable
    },
    data() {
      return {
        treeData: [],//树节点数据
        tableColumn: [
          {
            prop: "name",
            label: "姓名"
          }, {
            prop: "workUnit",
            label: "单位"
          }, {
            prop: "position",
            label: "职位"
          }, {
            prop: "mobile",
            label: "联系号码"
          }],//表头
        tableData: [],//表格数据
        total: 0,//数据总数
        pageSize: 10,//总页数
        currentPage: 1,//当前页数
        searchText:""//搜索
      }
    }, mounted() {
      this.getEmergencyAddressBookTree();
    },
    methods: {
      //获取联系人数据
      getContactorList() {
        this.rowData = null;
        let data = {
          page: this.currentPage,
          size: this.pageSize,
          searchText: this.searchText,
        };
        this.$api.contactorList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.tableData = res.data.list;
          this.total = res.data.totalCount;
        })
      },
      //获取应急通讯录联系人
      getEmergencyAddressData() {
        let data;
        if (this.searchText == "") {
          data = {
            id: this.groupId,
            page: this.currentPage,
            size: this.pageSize,
          };
        } else {
          data = {
            page: this.currentPage,
            size: this.pageSize,
          };
        }
        this.$api.emergencyAddressBook(data).then(res => {
          if (res.errorcode != 0) {
            this.message({
              message: res.msg,
              type: "error"
            });
            return;
          };
          this.tableData = res.data.data;
          this.total = res.data.totalElements;
        })
      },
      //应急通讯录架构树
      getEmergencyAddressBookTree() {
        let data = {
          id: 0,
        };
        let CallbackReload = this;
        this.$api.getBriefsByClassId(data, CallbackReload).then(result => {
          if (result) {
            this.treeData = [];
            for (let n in result.data) {
              this.treeData.push({
                id: result.data[n].id,
                name: result.data[n].name + '通讯录',
                versionId: result.data[n].versionId,
                children: []
              });
              let data = {
                id: result.data[n].versionId,
              };
              this.$api.getStructTree(data, this).then(res => {
                this.treeData[n].children = res.data;
              })
            }
          }
        })
      },
      //树点击方法
      handleNodeClick(data, node) {
        this.currentPage = 1;//跳转到第一页
        this.groupId = data.id;
        if (data.type && data.type === 2) {
          this.searchText = "";
          this.$emit('clearSearchText');
          this.getEmergencyAddressData();
        } else {
          this.tableData = []
        }
      },
      addMsgPhone(row){
        if (row.mobile ==''|| row.mobile ==null){
          this.$message.warning("当前联系人号码为空");
          return;
        }
        this.$emit("handleSelectionChange",row)
      },
      //分页方法
      handCurrentChange(val) {
        this.currentPage = val;
        if (this.searchText != "" || this.searchText != null) {
          this.getContactorList();
        }else {
          this.getEmergencyAddressData();
        }
      },
      //改变每页条数方法
      handSizeChange(val) {
        this.pageSize = val;
        if (this.searchText != "" || this.searchText != null) {
          this.getContactorList();
        }else {
          this.getEmergencyAddressData();
        }
      },
    }
  }
</script>

<style scoped>
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

  .tableContainer {
    height: 664px;
    margin-right: 16px;
    padding: 6px;
    border: 1px solid rgba(211, 215, 219, 1);
  }


</style>
