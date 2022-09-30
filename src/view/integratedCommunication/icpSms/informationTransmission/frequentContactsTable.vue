<!--@author：llp-->
<template>
  <div>
    <el-row>
      <!--表格-->
      <el-col>
        <div class="tableContainer">
          <el-row>
            <el-table ref="singleTable" :data="tableData" highlight-current-row
                      :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                      max-height="586px"
                      style="height: 614px;"
                      @row-click="handleRowClick"
                      @row-dblclick="handleRowDbClick"
            >
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
    <!--联系人弹窗-->
    <contact-details-popup ref="ContactDetailsPopup"
                           @getContactorList="getCommonContactorListData"></contact-details-popup>
  </div>
</template>

<script>
  import ContactDetailsPopup from "@/view/integratedCommunication/contactDetailsPopup";

  export default {
    name: "frequentContactsTable",
    components: {
      ContactDetailsPopup
    },
    data() {
      return {
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
        searchText:'',//搜索内容
        rowData:[],
      }
    },
    mounted() {
      this.getCommonContactorListData();
    },
    methods: {
      //获取常用联系人数据
      getCommonContactorListData() {
        let data = {
          searchText:this.searchText,
          page: this.currentPage,
          size: this.pageSize
        };
        this.$api.commonContactorList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              error: "error"
            });
            return;
          }
          this.tableData = res.data.data;
          this.total = res.data.totalElements;
        })
      },
      //改变页数查询
      handCurrentChange(val) {
        this.currentPage = val;
        this.getCommonContactorListData();
      },
      //改变每页条数查询
      handSizeChange(val) {
        this.currentPage = 1;//跳转到第一页
        this.pageSize = val;
        this.getCommonContactorListData();
      },
      addMsgPhone(row){
        if (row.mobile ==''|| row.mobile ==null){
          this.$message.warning("当前联系人号码为空");
          return;
        }
        this.$emit("handleSelectionChange",row)
      },
      //修改方法
      handleEdit() {
        if (this.rowData == "" || this.rowData == undefined) {
          this.$message({
            message: "请选中表格中任意行或双击任意行进行修改!",
            type: "warning"
          });
          return;
        } else {
          this.handleRowDbClick(this.rowData);
        }
      },
      handleRowClick(row){
        this.rowData = row;
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
      //删除方法
      handleDelete() {
        if (this.rowData == "") {
          this.$message({
            message: "请选中表格中任意行进行删除!",
            type: "warning"
          });
          return;
        } else {
          let data = {
            contactorId: this.rowData.id,
          };
          this.$confirm('删除当前信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.removeCommonContactor(data).then(res => {
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
              this.getCommonContactorListData();
              this.rowData=null;
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除!'
            });
          });
        }
      },
    }
  }
</script>

<style scoped>
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
