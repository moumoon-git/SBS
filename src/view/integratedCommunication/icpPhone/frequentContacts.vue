<!--@author：llp-->
<template>
  <div>
    <el-row>
      <div class="navsBar" style="height: 80px">
        <search-bar ref="search" :placeholder="placeholder"
                    @handleSearch="handleSearch" :searchText="searchText"
        ></search-bar>
      </div>
    </el-row>
    <el-row>
      <el-col :span="18">
        <div class="contentStyle">
          <el-row>
            <el-header style="height: 72px;padding: 0">
              <table-button-group ref="TableButtonGroup" class="buttonGroup"
                                  @handleDelete="handleDelete"
                                  @handleEdit="handleEdit"></table-button-group>
            </el-header>
          </el-row>
          <el-row>
            <el-main style="margin-top:16px;margin-left:32px">
              <div class="tableContainer">
                <telephone-table class="table" :tableColumn="tableColumn"
                                 :tableData="tableData"
                                 @handleDial="handleDial"
                                 @handleRowClick="handleRowClick"
                                 @handleRowDbClick="handleRowDbClick"
                >
                </telephone-table>
                <el-pagination class="pagination" :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"
                               :current-page="currentPage"
                               @current-change="handCurrentChange"
                               @size-change="handSizeChange"
                               layout="total, prev, pager, next, sizes, jumper"></el-pagination>
              </div>
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
    <contact-details-popup ref="ContactDetailsPopup"
                           @getContactorList="getCommonContactorListData"></contact-details-popup>

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


  export default {
    name: "frequentContacts",
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
        seatNumber:"",//座席号
        agent_id:"",//坐席ID
        HWICP_Version: window.g.HWICP_Version,//icp版本
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
        rowData: [],//行表格数据
        detailsIsShow: true,//是否显示详细信息
        searchText: '',//请输入搜索内容
      }
    },
    created() {
      this.$nextTick(() => {
        this.$refs.search.groupingIsShow = false;
        this.$refs.TableButtonGroup.refreshIsShow = false;
        this.$refs.TableButtonGroup.sortIsShow = false;
        this.$refs.TableButtonGroup.addIsShow = false;
        this.$refs.TableButtonGroup.batchJoinIsShow = false;
        this.$refs.TableButtonGroup.exportTemplateIsShow = false;
      })
    },
    mounted() {
      this.getCommonContactorListData();
      this.seatNumber =sessionStorage.getItem("seat");
      this.agent_id =sessionStorage.getItem("agent_id");
    },
    methods: {
      //获取常用联系人数据
      getCommonContactorListData() {
        let data = {
          searchText: this.searchText,
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
      //修改方法
      handleEdit() {
        if (this.rowData == "") {
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
            this.getCommonContactorListData();
            break;
        }
      },
      //呼叫方法
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
            let data = {number:mobile};
            this.$api.validateNumber(data).then(res=>{
              let self=this
              if(this.HWICP_Version=='HWICP-19.0'){
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
    padding: 6px;
    margin-right: 32px;
    border: 1px solid rgba(211, 215, 219, 1);
  }

  .tree {
    float: left;
    margin-right: 16px;
    margin-bottom: 24px
  }

  >>> .el-table::before {
    height: 0;
  }


  >>> .el-pagination__jump {
    margin-left: 0;
  }


</style>

