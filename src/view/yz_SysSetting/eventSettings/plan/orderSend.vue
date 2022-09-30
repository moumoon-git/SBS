<template>
  <div style="width:100%" >
    <el-col :span="7" style="border-right: 1px solid #ddd">
      <div style="width: 100%;text-align: left;text-indent: 10px;height: 30px;line-height: 30px;margin: 10px 0">
        <el-button size="mini" type="primary" @click="orderSelect"  icon="el-icon-folder-opened">选择</el-button>
      </div>
      <order-table   style="height: 320px" ref="msgTable"
                   :tableColumn="orderTableColumn"
                   @delete="ordereDelete"
                   :tableData="orderTableData"></order-table>
      <el-pagination small :page-size="orderSize"  :total="totalOrder"
                     :current-page="orderPage"
                     @current-change="pageOrderChange"
                     layout="prev, pager, next">
      </el-pagination>
    </el-col>

    <el-col :span="17">
      <div style="width: 100%;text-indent: 10px;text-align: left;height: 40px;line-height: 40px">流程说明:</div>
      <el-input
        type="textarea"
        :autosize="{minRows:14,maxRows:14}"  resize="none"
        v-model="orderConener"
        placeholder="请输入内容"
      >
      </el-input>
    </el-col>
    <order-dialog ref="selectDialog"
                       :selectTitle="orderTitleDialog" :selectData="orderDataDialog"
                       @closeDialog="closeOrderMyDialog"
                       @confirm="confirmOrder"
                       @close="closeMyOrder"
                  v-if="orderHackReset"
    ></order-dialog>
    <div style="width: 100%;text-align: right">
      <el-button style="margin:10px 30px 10px 0" type="success" size="mini" @click="saveOrderSendData">保存</el-button>
    </div>
  </div>
</template>

<script>
  import orderDialog from "@/view/yz_eventManagement/eventReports/dialog/selectDialog"
  import orderTable from '@/view/yz_SysSetting/eventSettings/msgTable'
    export default {
        name: "orderSend",
        components:{
          orderDialog,orderTable
        },
        data(){
          return{
            orderTableColumn:[
              {
                prop: "name",
                label: "人员姓名"
              }
            ],//表头
            orderTableData:[],//表格数据
            caseId:'',//事件类型ID

            orderSize:10,
            totalOrder:0,
            orderPage:1,
            orderConener:'',//指令传达内容

            orderTitleDialog:'',
            orderDataDialog:false,//选择弹窗

            orderHackReset:true
          }
        },
        mounted(){
          this.$nextTick(() =>{
            this.evaluationID()
          })
        },
        methods:{
          saveOrderSendData(){//保存说明
            if(this.caseId==''||this.caseId==null){
              this.$message({
                message: '请先选择事件类型!',
                type: 'warning'
              });
              return;
            }
            let data={
              caseId:this.caseId,
              code:'RelayInstruction',
              content:this.orderConener
            };
            this.$api.addFlowContent(data).then((res) => {
              if(res.errorcode==0){
                this.$message({
                  message: '流程说明保存成功!',
                  type: 'success'
                });
              }else {
                this.$message.error(res.msg)
              }
            })
          },
          evaluationID(){
            this.caseId=sessionStorage.getItem('parameterTreeId')
            this.getorderTableDatas();
            this.getRelayInstructionContent()
          },
          getRelayInstructionContent(){
            let data={
              code:'RelayInstruction',
              caseId:this.caseId
            };
            this.$api.getFlow(data).then((res) => {
              if(res.errorcode==0){
                if(res.data[0]==''||res.data[0]==undefined||res.data[0]==null){
                  this.$message({
                    message: '暂无流程!',
                    type: 'warning'
                  });
                  this.orderConener='';
                }else {
                  this.orderConener=res.data[0].content;
                }

              }
            })
          },
          getorderTableDatas(){
            let data={
              code:'RelayInstruction',
              caseId:this.caseId,
              size:this.orderSize,
              page:this.orderPage
            };
            this.$api.structList(data).then((res) => {
              if(res.errorcode==0){
                this.orderTableData=res.data.data;
                this.totalOrder=res.data.totalElements;
                this.$refs.msgTable.updateButton=false;
              }
            })
          },
          orderSelect(){//选择弹窗方法
            if(this.caseId==''||this.caseId==null){
              this.$message({
                message: '请先选择事件类型!',
                type: 'warning'
              });
              return;
            }
            this.orderDataDialog=true;
            this.orderTitleDialog='选择联系人';
          },
          ordereDelete(id){//表格删除人员
            let idArr=[];
            idArr.push(id);
            let data={
              ids:idArr
            };
            this.$api.structDelete(data).then((res) => {
              if(res.errorcode==0){
                this.getorderTableDatas();
              }else {
                this.$message.error(res.msg)
              }
            })
          },
          pageOrderChange(val){//分页
            this.orderPage=val
            this.getorderTableDatas()
          },
          closeOrderMyDialog(){//叉叉
            this.orderHackReset=false;
            this.$nextTick(()=>{
              this.orderHackReset=true
            })
            this.orderDataDialog=false;
          },
          confirmOrder(checkedCities){//选择确认
            this.orderHackReset=false;
            this.$nextTick(()=>{
              this.orderHackReset=true
            })
            let data={
              code:'RelayInstruction',
              caseId:this.caseId,
              contacts:checkedCities
            };
            this.$api.personAdd(data).then((res) => {
              if(res.errorcode==0){
                this.orderDataDialog=false;
                this.getorderTableDatas();
              }else {
                this.$message.error(res.msg)
              }
            })
          },
          closeMyOrder(){//取消
            this.orderHackReset=false;
            this.$nextTick(()=>{
              this.orderHackReset=true
            })
            this.orderDataDialog=false;
          },
        }
    }
</script>

<style scoped>

</style>
