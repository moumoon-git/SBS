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
              <table-button-group ref="TableButtonGroup" class="buttonGroup" @handleAdd="handleAdd"  @handleEdit="handleEdit"  @handleDelete="handleDelete"></table-button-group>
            </el-header>
          </el-row>
          <el-row style="margin-top:16px;margin-left:16px">
            <el-main>
              <el-col :span="5">
                <tree class="tree" ref="Tree" :treeData="treeData" @handleNodeClick="handleNodeClick" @refreshData="getEmergencyAddressBookTree"></tree>
              </el-col>
              <el-col :span="19">
                <div class="tableContainer">
                  <telephone-table class="table" :tableColumn="tableColumn"
                                   @handleRowClick="handleRowClick"
                                   @handleRowDbClick="handleRowDbClick"
                                   @handleDial="handleDial"
                                   :tableData="tableData">
                  </telephone-table>
                  <el-pagination class="pagination" :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"
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
      <!--详情信息框-->
      <el-col :span="6">
        <details-and-dialing v-show="detailsIsShow" ref="DetailsAndDialing"></details-and-dialing>
      </el-col>
    </el-row>
    <!--来电弹窗-->
    <call-window ref="CallWindow"></call-window>
     <!--联系人弹窗-->
    <contact-details-popup ref="ContactDetailsPopup" @getContactorList="getContactorList"></contact-details-popup>
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
  export default {
    name: "emergencyAddressBook",
    components: {
      CallWindow,
      TelephoneTable,
      DetailsAndDialing,
      "tree": Tree,
      "table-button-group": TableButtonGroup,
      "searchBar": SearchBar,
      ContactDetailsPopup
    },
    data() {
      return {
        rowData:null,
        seatNumber:"",//座席号
        agent_id:"",//坐席ID
        HWICP_Version: window.g.HWICP_Version,//icp版本
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
        placeholder: '请输入姓名/单位/职位/号码',
        groupId: 0,//分组id
        detailsIsShow: true,//是否显示详细信息
        searchText: ""//搜索关键字
      }
    },
    created() {
      this.$nextTick(() => {
        this.$refs.SearchBar.groupingIsShow = false;
        // this.$refs.TableButtonGroup.sortIsShow = false;
        // this.$refs.TableButtonGroup.addIsShow = false;
        // this.$refs.TableButtonGroup.editIsShow = true;
        // this.$refs.TableButtonGroup.deleteIsShow = false;
        // this.$refs.TableButtonGroup.batchJoinIsShow = false;
         this.$refs.Tree.buttonIsShow = true;
        this.$refs.Tree.groupType = "phone";
      })
    },
    mounted() {
      this.getEmergencyAddressBookTree();
      this.seatNumber =sessionStorage.getItem("seat");
      this.agent_id =sessionStorage.getItem("agent_id");
    },
    methods: {
        //表格行双击方法
        handleRowDbClick(row) {
          this.$nextTick(() => {
            this.$refs.ContactDetailsPopup.isDialogVisible = true;
            this.$refs.ContactDetailsPopup.title = "修改联系人";
            this.$refs.ContactDetailsPopup.getTree();
            this.$refs.ContactDetailsPopup.showData(row);
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
      //获取应急通讯录联系人
      getEmergencyAddressData() {

        let data = {
          id: this.groupId,
          page: this.currentPage,
          size: this.pageSize
        };
        this.$api.emergencyAddressBook(data).then(res => {
          if (res.errorcode != 0) {
            this.message({
              message: res.msg,
              type: "error"
            });
            return;
          }
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
        this.rowData = null;
        if (data.type && data.type === 2) {
          this.searchText = "";
          this.$refs.SearchBar.searchText = '';
          this.getEmergencyAddressData();
        } else {
          this.tableData = []
        }
      },
      //行点击方法
      handleRowClick(row) {
        this.detailsIsShow = true;
         this.rowData = row;
        this.$nextTick(() => {
          this.$refs.DetailsAndDialing.showEmergencyAddressBookData(row);
        })
      },
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
      //搜索方法
      handleSearch(type, text) {
        switch (type) {
          case "关键字查询":
            this.searchText = text;
            this.currentPage = 1;
            if (this.searchText != "") {
              this.getContactorList();
            } else {
              this.getEmergencyAddressBookTree();
            }
            break;
        }
      },
      //分页方法
      handCurrentChange(val) {
        this.currentPage = val;
        if (this.searchText == "" || this.searchText == null) {
          this.getEmergencyAddressData();
        }else {
          this.getContactorList();
        }
      },
      //改变每页条数方法
      handSizeChange(val) {
        this.pageSize = val;
        this.currentPage = 1;
        if (this.searchText == "" || this.searchText == null) {
          this.getEmergencyAddressData();
        }else {
          this.getContactorList();
        }
      },
      handleDial(row){
        let mobile=row.mobile;
        this.$nextTick(()=>{
          if (mobile==''||mobile==null){
            this.$message({
                message:"联系号码不能为空",
                type:"warning"
              }
            );
            return;
          }
          this.$confirm('确认呼叫当前号码?',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let data = {number:mobile,agentId:sessionStorage.getItem("agent_id")||''};
            this.$api.validateNumber(data).then(res=>{
              let self=this
              if(self.HWICP_Version=='HWICP-19.0'){
                this.$store.commit("setCallee", mobile);
                this.$refs.CallWindow.findContactorByMobile();
                this.$icp19.MakeCall(Number(self.agent_id),mobile,self.seatNumber.toString());
              }
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消呼叫'
            });
          });
        })
      }
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

