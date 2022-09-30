<!--@author：llp-->
<template>
  <div>
    <el-row>
      <div class="navsBar" style="height: 80px">
        <search-bar ref="searchBar" :placeholder="placeholder"
                    @handleSearch="handleSearch" :searchText="searchText"
                    @submittedSelect="submittedSelect"></search-bar>
      </div>
    </el-row>
    <el-row>
      <el-col :span="18">
        <div class="contentStyle">
          <!--按钮组件-->
          <el-row>
            <el-header style="height: 72px;padding: 0">
              <table-button-group ref="tableButtonGroup" class="buttonGroup" @handleAdd="handleAdd"
                                  @handleExportContactor="handleExportContactor"
                                  @refreshData="getPhoneGroupingTree"
                                  @refreshTableData="getContactorList"
                                  @handleEdit="handleEdit"
                                  @handleSort="handleSort"
                                  @handleDelete="handleDelete"
              ></table-button-group>
            </el-header>
          </el-row>
          <el-row style="margin-top:16px;margin-left:16px">
            <el-main>
              <!--树形组件-->
              <el-col :span="5">
                <tree ref="Tree" class="tree" :treeData="treeData" @refreshData="getPhoneGroupingTree"
                      @handleNodeClick="handleNodeClick"></tree>
              </el-col>
              <!--表格组件-->
              <el-col :span="19">
                <div class="tableContainer">
                  <el-row>
                    <telephone-table ref="TelephoneTable"
                                     class="table" :tableColumn="tableColumn"
                                     :tableData="tableData"
                                     @handleRowClick="handleRowClick"
                                     @handleRowDbClick="handleRowDbClick"
                                     @handleDial="handleDial"
                    >
                      <el-table-column type="index" min-width="50" :resizable="false"></el-table-column>
                      <el-table-column min-width="160" v-for="(item,key) in tableColumn" :key="key" :label="item.label"
                                       :prop="item.prop"
                                       :width="item.width" :resizable="false"></el-table-column>
                    </telephone-table>
                  </el-row>
                  <el-row>
                    <el-pagination class="pagination" :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"
                                   :current-page="currentPage"
                                   @current-change="handCurrentChange"
                                   @size-change="handSizeChange"
                                   layout="total, prev, pager, next, sizes, jumper"></el-pagination>
                  </el-row>
                </div>
              </el-col>
            </el-main>
          </el-row>
        </div>
      </el-col>
      <!--详情信息框-->
      <el-col :span="6">
        <details-and-dialing v-show="detailsIsShow==true" ref="DetailsAndDialing"></details-and-dialing>
      </el-col>
    </el-row>
    <!--联系人弹窗-->
    <contact-details-popup ref="ContactDetailsPopup" @getContactorList="getContactorList"></contact-details-popup>

    <!--联系人排序窗口-->
    <contact-sorting-popup ref="ContactSortingPopup" @getContactorList="getContactorList"></contact-sorting-popup>

    <!--来电弹窗-->
    <call-window ref="CallWindow"></call-window>
  </div>
</template>

<script>
  import CallWindow from "@/components/CallWindow";
  import SearchBar from '../../../components/menu/searchBar'
  import TableButtonGroup from "../../../components/button/tableButtonGroup";
  import Tree from "../../../components/tree/tree";
  import TelephoneTable from "../../../components/table/telePhoneTable";
  import DetailsAndDialing from "./detailsAndDialing";
  import ContactDetailsPopup from "@/view/integratedCommunication/contactDetailsPopup";
  import ContactSortingPopup from "@/view/integratedCommunication/contactSortingPopup";

  export default {
    components: {
      CallWindow,
      ContactDetailsPopup,
      DetailsAndDialing,
      TelephoneTable,
      ContactSortingPopup,
      "tree": Tree,
      "table-button-group": TableButtonGroup,
      "searchBar": SearchBar,
    },
    data() {
      return {
        seatNumber: "",//座席号
        agent_id: undefined,//坐席ID
        HWICP_Version: window.g.HWICP_Version,//icp版本
        treeData: [],//电话分组
        groupId: -1,//分组id
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
        placeholder: '请输入姓名/单位/职位/号码',
        detailsIsShow: true,//是否显示详细信息
        rowData: [],//行表格数据
        searchText: ""//搜索内容
      }
    },
    mounted() {
      this.seatNumber = sessionStorage.getItem("seat");
      this.agent_id = sessionStorage.getItem("agent_id");
      this.getPhoneGroupingTree();
      this.getContactorList();
      this.$nextTick(() => {
        this.$refs.TelephoneTable.setToCommonIsShow = true;
        this.$refs.tableButtonGroup.batchJoinIsShow = true;
        this.$refs.tableButtonGroup.exportTemplateIsShow = true;
        this.$refs.tableButtonGroup.exportContactorIsShow = true;
        this.$refs.tableButtonGroup.sortIsShow = true ;
        this.$refs.tableButtonGroup.groupType = "phone";
        this.$refs.Tree.buttonIsShow = true;
        this.$refs.Tree.groupType = "phone";
      });
    },
    methods: {
      //电话分组树
      getPhoneGroupingTree() {
        let data = {
          displayDefault: true //是否显示未分组联系人
        };
        this.$api.telephoneGroupingTree(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          this.treeData = res.data;
        })
      },
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
      //树点击方法
      handleNodeClick(data, node) {
        this.currentPage = 1;//跳转到第一页
        this.groupId = data.id;
        this.searchText = "";
        this.$nextTick(() => {
          this.$refs.searchBar.searchText = '';
          this.$refs.tableButtonGroup.pId = data.id;
        });
        this.getContactorList();
      },
      //改变页数查询
      handCurrentChange(val) {
        this.currentPage = val;
        this.getContactorList();
      },
      //改变每页条数查询
      handSizeChange(val) {
        this.currentPage = 1;//跳转到第一页
        this.pageSize = val;
        this.getContactorList();
      },
      //表格行点击方法
      handleRowClick(row) {
        this.detailsIsShow = true;
        this.rowData = row;
        this.$nextTick(() => {
          this.$refs.DetailsAndDialing.getRowData(row.id);
        });
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
        if (this.rowData == "" || this.rowData == null) {
          this.$message({
            message: "请选中表格中任意行或双击任意行进行修改!",
            type: "warning"
          });
          return;
        } else {
          this.handleRowDbClick(this.rowData);
        }
      },
      //删除方法
      handleDelete() {
        if (this.rowData == "" || this.rowData == null) {
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
      //搜索方法
      handleSearch(type, text) {
        switch (type) {
          case "关键字查询":
            this.searchText = text;
            this.currentPage = 1;
            this.getContactorList();
            break;
          case "分组查询":
            this.groupId = text;
            this.currentPage = 1;
            this.getContactorList();
            break
        }
      },
      //分组查询方法;
      submittedSelect() {
        this.$nextTick(() => {
          this.$refs.searchBar.innerVisible = true;
          let typeData = "政务联络网";
          this.$refs.searchBar.dataUpdating(this.treeData, typeData);
        });
      },
      //拨打电话方法
      handleDial(row) {
        let mobile = row.mobile;
        this.$nextTick(() => {
          if (mobile == '' || mobile == null) {
            this.$message({
                message: "联系号码不能为空",
                type: "warning"
              }
            );
            return;
          }
          this.$confirm('确认呼叫当前号码?', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let self = this
            let data = {number: mobile,agentId:sessionStorage.getItem("agent_id")||''};
            this.$api.validateNumber(data).then(res => {
               if (self.HWICP_Version == 'HWICP-19.0') {
                this.$store.commit("setCallee", mobile);
                this.$refs.CallWindow.findContactorByMobile();
                this.$icp19.MakeCall(Number(self.agent_id), mobile, self.seatNumber.toString());
              }
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消呼叫'
            });
          });
        })
      },
      //排序方法
      handleSort() {
        this.$nextTick(()=>{
          this.$refs.ContactSortingPopup.isDialogVisible = true;
          this.$refs.ContactSortingPopup.getTree();
        });
      },
      //根据分组导出联系人
      handleExportContactor() {
        if (this.groupId == -1) {
          this.$message.warning("未分组联系人不能另存为excel文件");
          return;
        }
        if (this.groupId == null || this.groupId == "" ||
          this.groupId == undefined) {
          this.$message.warning("请先选择一个分组");
          return;
        }
        console.log(this.groupId);
        window.location.href = window.g.ApiUrl + "/eos/communication/contactor/export?groupId=" + this.groupId;
      }
    }
  }
</script>

<style scoped>
  .navsBar {
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
    margin-left: 16px;
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

  >>> .el-pagination__jump {
    margin-left: 0;
  }


</style>
