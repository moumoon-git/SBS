<!--@author：llp-->
<template>
  <div>
    <el-row>
      <el-col :span="18">
        <div class="contentStyle">
          <el-main style="margin-top:16px;margin-left:32px">
            <div class="tableContainer">
              <telephone-table class="table" :tableColumn="tableColumn"
                               :tableData="tableData"
                               @handleRowClick="handleRowClick"
                               @handleDial="handleDial"
              >
              </telephone-table>
              <el-pagination class="pagination" :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"
                             :current-page="currentPage"
                             @current-change="handCurrentChange"
                             layout="total, prev, pager,next,jumper"></el-pagination>
            </div>
          </el-main>
        </div>
      </el-col>
      <!--详情信息框-->
      <el-col :span="6">
        <details-and-dialing v-show="detailsIsShow==true"  ref="DetailsAndDialing"></details-and-dialing>
      </el-col>
    </el-row>
    <!--来电弹窗-->
    <call-window ref="CallWindow"></call-window>
  </div>
</template>

<script>
  import CallWindow from "@/yz_components/CallWindow";
  import SearchBar from '@/yz_components/menu/searchBar'
  import TableButtonGroup from "@/yz_components/button/tableButtonGroup";
  import Tree from "@/yz_components/tree/tree";
  import TelephoneTable from "@/yz_components/table/telePhoneTable";
  import DetailsAndDialing from "./detailsAndDialing";

  export default {
    name: "recentContacts",
    components: {
      CallWindow,
      TelephoneTable,
      DetailsAndDialing,
      "tree": Tree,
      "table-button-group": TableButtonGroup,
      "searchBar": SearchBar,
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
          },
          {
            prop: "direct",
            label: "状态"
          }, {
            prop: "startTime",
            label: "通话时间"
          }, {
            prop: "mobile",
            label: "联系号码"
          }],//表头
        tableData: [],//表格数据
        total: 20,//数据总数
        pageSize: 20,//每页条数
        currentPage: 1,//当前页数
        detailsIsShow: true,//是否显示详细信息
        IsZengChengProject: window.g.IsZengChengProject // 增城项目
      }
    },
    mounted() {
      this.getRecentContactorData();
      this.seatNumber =sessionStorage.getItem("seat");
      this.agent_id =sessionStorage.getItem("agent_id");
    },
    methods: {
      //获取最近联系人数据
      getRecentContactorData() {
        this.$api.getRecentContactorList().then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              error: "error"
            });
            return;
          }
          this.tableData = res.data.data;
        })
      },
      //改变页数查询
      handCurrentChange(val) {
        this.currentPage = val;
        this.getRecentContactorData();
      },
      //表格行点击方法
      handleRowClick(row){
        this.detailsIsShow = true;
        this.$nextTick(()=>{
          this.$refs.DetailsAndDialing.showRowData(row);
        });
      },
      /**
       * @param {mobile: String} 呼出号码
       * @author hexinting
       * @date 2020-12-25
       * @description 呼出电话
       */
      makeCall(mobile) {
        let data = {number:mobile};
        this.$api.validateNumber(data).then(res=>{
          let self = this;
          if(this.HWICP_Version=='HWICP-19.0'){
            this.$store.commit("setCallee", mobile);
            this.$refs.CallWindow.findContactorByMobile();
            this.$icp19.MakeCall(Number(self.agent_id),mobile,self.seatNumber.toString());
          }
        });
      },
      /**
        * @lastEditor hexinting
        * @lastDate 2020-12-25
        * @description 拨打电话方法
        */
      handleDial(row){
        let mobile=row.call;
        this.$nextTick(()=>{
          if (mobile==''||mobile==null){
            this.$message({
                message:"联系号码不能为空",
                type:"warning"
              }
            );
            return;
          }
          // bug9749 增城项目不需要呼叫确认框 author:hexinting date:2020-12-25
          if(this.IsZengChengProject) {
            this.makeCall(mobile);
          } else {
            this.$confirm('确认呼叫当前号码?',{
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.makeCall(mobile);
              // let data = {number:mobile};
              // this.$api.validateNumber(data).then(res=>{
              //   let self=this
              //   if(this.HWICP_Version=='HWICP-19.0'){
              //     this.$store.commit("setCallee", mobile);
              //     this.$refs.CallWindow.findContactorByMobile();
              //     this.$icp19.MakeCall(Number(self.agent_id),mobile,self.seatNumber.toString());
              //   }
              // });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消呼叫'
              });
            });

          }
        })
      }
    }
  }
</script>

<style scoped>
  .contentStyle {
    margin-left: 36px;
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
    margin-top: 24px;
    margin-right: 32px;
    padding: 6px;
    border: 1px solid rgba(211, 215, 219, 1);
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

