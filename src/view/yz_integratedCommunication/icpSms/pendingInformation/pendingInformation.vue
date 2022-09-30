<!--@author：llp-->
<template>
  <div>
    <el-row style="margin:0 20px">
      <div class="searchBar">
        <table-button-group ref="tableButtonGroup" style="float: left" @handleEdit="handleEdit" @handleDelete="handleDelete"></table-button-group>
      </div>
    </el-row>
    <el-row>
      <el-col :span="14">
        <div class="contentStyle">
          <el-main>
            <div class="tableContainer">
              <el-table ref="singleTable" :data="tableData" highlight-current-row
                        :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                        max-height="586px"
                        @row-click="handleRowClick"
                        style="height: 614px;">
                <el-table-column type="index" min-width="50" :resizable="false"></el-table-column>
                <el-table-column min-width="160" v-for="(item,key) in tableColumn" :key="key" :label="item.label"
                                 :prop="item.prop"
                                 :width="item.width" :resizable="false"></el-table-column>
                <!--<el-table-column-->
                  <!--type="selection"-->
                  <!--width="55">-->
                <!--</el-table-column>-->
              </el-table>
            </div>
          </el-main>
        </div>
      </el-col>
      <el-col :span="10">
        <sms-details ref="SmsDetails"></sms-details>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import TableButtonGroup from "@/yz_components/button/tableButtonGroup";
  import SmsDetails from "@/view/yz_integratedCommunication/icpSms/pendingInformation/smsDetails";

  export default {
    name: "pendingInformation",
    components: {SmsDetails, TableButtonGroup},
    data() {
      return {
        tableColumn: [
          {
            prop: "sendTime",
            label: "发送时间"
          }, {
            prop: "content",
            label: "内容"
          }],//表头
        tableData: [],//表格数据
        total: 0,//数据总数
        pageSize: 10,//总页数
        currentPage: 1,//当前页数
        smsQueueId:'',//待发信息id
        rowData:''//单行数据
      }
    },
    created() {
      this.$nextTick(() => {
        this.$refs.tableButtonGroup.sortIsShow = false;
        this.$refs.tableButtonGroup.addIsShow = false;
        this.$refs.tableButtonGroup.batchJoinIsShow = false;
      })
    },
    mounted() {
      this.getSmsQueueData();
    },
    methods: {
      getSmsQueueData() {
        let data = {};
        this.$api.smsQueue(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.tableData = res.data;
        })
      },
      handleRowClick(row) {
        this.smsQueueId = row.id;
        this.rowData = row;
        let postData = {
          id:row.id,
          reEdit:false
        };
        this.$api.smsQueue(postData).then(res=>{
          this.$nextTick(()=>{
            this.$refs.SmsDetails.showData(res.data);
          });
        });
      },
      //修改方法
      handleEdit(){
        if(this.smsQueueId==''  || this.smsQueueId==null){
          this.$message({
            message:'请选中表格任意行进行修改',
            type:'warning'
          });
          return;
        }
        this.$emit('editMsg',this.rowData);
      },
      handleDelete(){
        if(this.smsQueueId=='' ||this.smsQueueId==null){
          this.$message({
            message:'请选中表格任意行进行删除',
            type:'warning'
          });
          return
        }
        this.$confirm('确认删除当前信息?',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data ={id:this.smsQueueId};
          this.$api.removeSmsQueue(data).then(res=>{
            if (res.errorcode!=0){
              this.$message({
                message:res.msg,
                type:"error"
              });
              return;
            }
            this.$message({
              message:"删除成功",
              type:"success"
            });
            this.getSmsQueueData();
            this.smsQueueId=null;
            // this.$nextTick(()=>{
            //   this.$refs.SmsDetails.showData(null);
            //   this.$refs.SmsDetails.tableData=null;
            // })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
</script>

<style scoped>
  .searchBar {
    height: 40px;
    line-height: 40px;
    margin: 10px 0;
    background: rgba(255, 255, 255, 1);
    border-radius: 3px;
  }

  .contentStyle {
    margin-left: 20px;
    height: 790px;
    background-color: white;
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
  }

  .tableContainer {
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

  .msgDetail {
    height: 19px;
    font-size: 20px;
    font-family: Microsoft YaHei, sans-serif;
    font-weight: 400;
    color: rgba(50, 50, 50, 1);
  }


</style>
