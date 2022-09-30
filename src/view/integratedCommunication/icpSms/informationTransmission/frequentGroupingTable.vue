<!--@author：llp-->
<template>
  <div>
    <el-row>
      <el-col :span="5">
        <tree ref="Tree" class="tree" :treeData="treeData" @refreshData="getSmsGroupListTree"  @handleNodeClick="handleNodeClick"></tree>
      </el-col>
      <!--表格-->
      <el-col :span="19">
        <div class="tableContainer">
          <el-row>
            <el-table ref="singleTable" :data="tableData" highlight-current-row
                      :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                      @row-dblclick="handleRowDbClick"
                      @row-click="handleRowClick"
                      style="height: 614px;">
              <el-table-column type="index" min-width="50" :resizable="false"></el-table-column>
              <el-table-column min-width="160" v-for="(item,key) in tableColumn" :key="key" :label="item.label"
                               :prop="item.prop"
                               :width="item.width" :resizable="false"></el-table-column>
              <el-table-column width="200" label="操作" :resizable="false">
                <template slot-scope="scope" >
                  <el-button type="info" size="mini" @click="addMsgPhone(scope.row)">添加</el-button>
                  <el-button type="info" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button>
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
    <!--联系人弹窗-->
    <contact-details-popup ref="ContactDetailsPopup" @getContactorList="getContactorList"></contact-details-popup>
  </div>
</template>

<script>
  import Tree from "@/components/tree/tree";
  import ContactDetailsPopup from "@/view/integratedCommunication/contactDetailsPopup";

  export default {
    name: "frequentGroupingTable",
    components: {
      ContactDetailsPopup,
      Tree
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
        groupId: 0,//分组id
        searchText: '',//搜索
        rowData:''//行数据
      }
    },
    mounted() {
      this.getSmsGroupListTree();
      this.getContactorList();
      this.$nextTick(() => {
        this.$refs.Tree.buttonIsShow = true;
        this.$refs.Tree.groupType = "sms";
      });
    },
    methods: {
      //获取联系人数据
      getContactorList() {
        this.rowData = null;
        let data;
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
      //获取短信分组
      getSmsGroupListTree() {
        let data = {
          displayDefault: true
        };
        this.$api.smsGroupList(data).then(res => {
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
      //树点击方法
      handleNodeClick(data, node) {
        this.currentPage = 1;//跳转到第一页
        this.groupId = data.id;
        this.searchText = "";
        this.$emit('clearSearchText');
        this.getContactorList();
      },
      //新增联系人方法
      handleAdd() {
        //新增分组方法

        //新增联系人方法
        this.$nextTick(() => {
          this.$refs.ContactDetailsPopup.isDialogVisible = true;
          this.$refs.ContactDetailsPopup.title = "新增联系人";
          this.$refs.ContactDetailsPopup.getTree();
        });
      },
      //修改方法
      handleEdit() {
        if (this.rowData == "" || this.rowData==undefined || this.rowData == null) {
          this.$message({
            message: "请选中表格中任意行或双击任意行进行修改!",
            type: "warning"
          });
          return;
        } else {
          this.handleRowDbClick(this.rowData);
        }
      },
      //表格行双击方法
      handleRowDbClick(row) {
        this.$nextTick(() => {
          this.$refs.ContactDetailsPopup.isDialogVisible = true;
          this.$refs.ContactDetailsPopup.title = "修改联系人";
          this.$refs.ContactDetailsPopup.getTree();
          this.$refs.ContactDetailsPopup.showData(row);
        });
      },
      //表格行点击方法
      handleRowClick(row) {
        this.rowData = row;
      },
      addMsgPhone(row){
        if (row.mobile ==''|| row.mobile ==null){
          this.$message.warning("当前联系人号码为空");
          return;
        }
        this.$emit("handleSelectionChange",row)
      },
      //删除方法
      handleDelete() {
        if (this.rowData == "" || this.rowData==null) {
          this.$message({
            message: "请选中表格中任意行进行删除!",
            type: "warning"
          });
          return;
        } else {
          let data = {
            data: {id: this.rowData.id},
            operate: 2,
          };
          this.$confirm('删除当前信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.updateConcator(data).then(res => {
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
              this.getContactorList();
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除!'
            });
          });
        }
      },
      //改变页数查询
      handCurrentChange(val) {
        this.currentPage = val;
        this.getContactorList();
        this.rowData = null;
      },
      //改变每页条数查询
      handSizeChange(val) {
        this.currentPage = 1;//跳转到第一页
        this.pageSize = val;
        this.getContactorList();
      },
      handSetToCommon(row){
        let data = {contactorId:row.id};
        this.$api.usedContactor(data).then(res=>{
          if (res.errorcode!=0){
            this.$message.error(res.msg);
            return;
          }
          this.$message.success("已设为常用联系人!");
        });
      },
      //根据分组导出联系人
      handleExportContactor(){
        if(this.groupId == -1){
          this.$message.warning("未分组联系人不能另存为excel文件");
          return;
        }
        if (this.groupId == null || this.groupId == "" ||
          this.groupId == undefined) {
          this.$message.warning("请先选择一个分组");
          return;
        }
        window.location.href = window.g.ApiUrl +"/eos/communication/contactor/export?groupId=" + this.groupId;
      }
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
