<template>
   <div style="width:100%" >
     <div style="width: 100%">
       <el-col :span="6" style="border-right: 1px solid #ddd">
<!--         <div style="height: 30px;line-height: 30px;width: 100%;text-align: left;text-indent: 10px">子流程</div>-->
         <div style="width: 100%;text-align: left;text-indent: 10px;height: 30px;line-height: 30px;margin: 10px 0">
           <el-button size="mini" type="primary" @click="addSetDialog" icon="el-icon-plus">新增</el-button>
         </div>
         <div style="padding: 0 10px">
           <my-table  ref="msgTable"
                      :tableColumn="tableColumn"
                      @handleCurrentChange="handleCurrentChange"
                      @handleUpdate="handleUpdate"
                      @delete="handleDelete"
                      :tableData="tableData"></my-table>
         </div>
       </el-col>

       <el-col :span="6" style="border-right: 1px solid #ddd">
         <div style="width: 100%;text-align: left;text-indent: 10px;height: 30px;line-height: 30px;margin: 10px 0">
           <el-button size="mini" type="primary" @click="staffSelect" icon="el-icon-folder-opened">选择</el-button>
         </div>
         <div style="padding: 0 10px">
           <my-table
             style="height: 280px"
             ref="msgTable"
             :tableColumn="staffColumn"
             @delete="staffDelete"
             :tableData="staffData">

           </my-table>
         </div>
         <div>
           <el-pagination small :page-size="pageSize"  :total="total"
                          :current-page="currentPage"
                          @current-change="pageChange"
                          layout="prev, pager, next">
           </el-pagination>
         </div>

       </el-col>

       <el-col :span="12">
         <div style="width: 100%;text-indent: 10px;text-align: left;height: 40px;line-height: 40px">流程说明:</div>
         <el-input
           type="textarea"
           :autosize="{minRows:13,maxRows:13}"  resize="none"
           placeholder="请输入内容"
           v-model="flowTextarea">
         </el-input>
         <div style="width: 100%;text-align: right">
           <el-button style="margin:10px 30px 10px 0" type="success" size="mini" @click="saveThat">保存</el-button>
         </div>

       </el-col>
     </div>
     <!--弹窗-->
     <el-dialog   width="600px"   :visible.sync="flowDialog" :title="flowTitle"
                 center :before-close="closeDialog" :close-on-click-modal="false"
                 append-to-body
     >
       <el-form :hide-required-asterisk="false" label-width="90px" :model="flowForm" :rules="flowRules" ref="flowForm"  label-position="content"   @submit.native.prevent>
           <el-form-item label="流程名称:">
             <el-input  type="text"  v-model.trim="flowForm.name"></el-input>
           </el-form-item>

           <el-form-item label="流程说明:">
             <el-input  type="textarea"  :autosize="{minRows:7,maxRows:12}"  resize="none"
                        v-model.trim="flowForm.state" show-word-limit></el-input>
           </el-form-item>

          <!-- 此选项在3.0业务上不需要了，先隐藏 20210624 -->
          <!-- <el-form-item>
            <el-checkbox v-model="flowForm.checked">可动态设置流程人员</el-checkbox>
          </el-form-item> -->
       </el-form>
         <div slot="footer" class="dialog-footer">
           <el-button @click="flowClose" size="small">取 消</el-button>
           <el-button type="primary" size="small" @click="flowConfirm">确 定</el-button>
         </div>
     </el-dialog>

     <my-dialog ref="selectDialog"
                    :selectTitle="myTitleDialog" :selectData="myDataDialog"
                    @closeDialog="closeMyDialog"
                    @confirm="confirmMy"
                    @close="closeMy"
                v-if="hackReset"
     ></my-dialog>
   </div>
</template>

<script>
    import myTable from '@/view/yz_SysSetting/eventSettings/msgTable'
    import myDialog from "@/view/yz_eventManagement/eventReports/dialog/selectDialog"
    export default {
        name: "msgCheck",
        components:{ 
          myTable,myDialog
        },
        data(){
          return{
            tableColumn:[
              {
                prop: "name",
                label: "子流程名字"
              }
            ],
            tableData:[],
            flowDialog:false,
            flowTitle:'',
            caseId:'',
            flowForm:{
              name:'',
              state:'',
              checked:false
            },
            flowRules:{},

            staffColumn:[
              {
                prop: "name",
                label: "人员名字"
              }
            ],//人员表头
            staffData:[],//人员表格数据
            staffId:'',//流程行ID
            currentPage:1,
            pageSize:10,
            total:0,
            flowTextarea:'',//流程说明
            myTitleDialog:'',
            myDataDialog:false,
            hackReset:true,//刷新弹窗组件
          }
        },
        mounted(){
          this.$nextTick(() =>{
            // this.getCaseID();
            this.getTableDatas();
            this.evaluationID()
          })

        },
        watch:{
          caseId:{
            handler(newV,oldV){
              if(newV!=oldV){
                this.tableData=[];
                this.staffData=[];
                this.flowTextarea='';
              }
            },
            deep:true
          },
        },
        methods:{
          saveThat(){//保存说明
            console.log(this.staffId);
            if(this.staffId==''||this.staffId==null){
              this.$message({
                message: '请选择子流程!',
                type: 'warning'
              });
              return
            }
            let data={
              content:this.flowTextarea,
              id:this.staffId
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
          closeMyDialog(){
            this.hackReset = false
            this.$nextTick(() => {// this.$nextTick执行一轮循环后刷新dom。
              this.hackReset = true
            })
            this.myDataDialog=false
          },
          confirmMy(checkedCities){
            this.hackReset = false
            this.$nextTick(() => {// this.$nextTick执行一轮循环后刷新dom。
              this.hackReset = true
            })
            this.myDataDialog=false;
            let data={
              flowId:this.staffId,
              contacts:checkedCities
            };
            this.$api.personAdd(data).then((res) => {
              if(res.errorcode==0){
                this.currentPage=1;
                this.getStaetData();
              }else {
                this.$message.error(res.msg)
              }
            })
          },
          closeMy(){
            this.hackReset = false
            this.$nextTick(() => {// this.$nextTick执行一轮循环后刷新dom。
              this.hackReset = true
            })
            this.myDataDialog=false
          },
          staffSelect(){//人员选择
            if(this.staffId==''||this.staffId==null||this.staffId==undefined){
              this.$message({
                message: '请先选择子流程',
                type: 'warning'
              });
              return
            }
            this.myDataDialog=true;
            this.myTitleDialog='选择联系人'
          },
          staffDelete(id){//人员删除
            let idArr=[];
            idArr.push(id);
            let data={
              ids:idArr
            };
            this.$api.structDelete(data).then((res) => {
              if(res.errorcode==0){
                // this.currentPage=1;
                this.getStaetData();
              }else {
                this.$message.error(res.msg)
              }
            })
          },
          pageChange(val){//
            this.currentPage=val;
            this.getStaetData();
          },
          getStaetData(){
            let data={
              flowId:this.staffId,
              size:this.pageSize,
              page:this.currentPage
            };
            this.$api.structList(data).then((res) => {
              if(res.errorcode==0){
                this.$refs.msgTable.updateButton=false;
                this.staffData=res.data.data;
                this.total=res.data.totalElements
              }else {
                this.$message.error(res.msg)
              }
            });
          },
          handleCurrentChange(row){
            this.staffId=row.id;
            this.currentPage=1;
            let data={
              id:this.staffId
            };
            this.$api.getFlow(data).then((res) => {
              if(res.errorcode==0){
                this.flowTextarea=res.data.content
              }
            })
            this.getStaetData();
          },
          flowClose(){
            this.flowDialog=false;
            this.flowForm.name = "";
            this.flowForm.state = "";
            this.flowForm.checked = null;
          },
          flowConfirm(){
            let type=this.flowTitle;
            let conj,conjs
            let addData,upData
            switch (type) {
              case "新增子流程":
                conj=null;
                if(this.flowForm.checked){
                  conj='yes'
                }else {
                  conj='no'
                }
                addData={
                  caseId:this.caseId,
                  code:'Confirm',
                  name:this.flowForm.name,
                  content:this.flowForm.state,
                  dynamic:conj
                };
                this.$api.flowAdd(addData).then((res) => {
                  if(res.errorcode==0){
                    this.getTableDatas();
                    this.flowDialog=false;
                    this.flowForm.name = "";
                    this.flowForm.state = "";
                    this.flowForm.checked = null;
                  }else {
                    this.$message.error(res.msg)
                  }
                });
                break;

              case "修改子流程":
                conjs=null;
                if(this.flowForm.checked){
                  conjs='yes'
                }else {
                  conjs='no'
                }
                upData={
                  id:this.staffId,
                  code:'Confirm',
                  name:this.flowForm.name,
                  content:this.flowForm.state,
                  dynamic:conjs
                };
                this.$api.flowUpdate(upData).then((res) => {
                  if(res.errorcode==0){
                    this.getTableDatas();
                    this.flowDialog=false;
                    this.flowForm.name = "";
                    this.flowForm.state = "";
                    this.flowForm.checked = null;
                  }else {
                    this.$message.error(res.msg)
                  }
                });
                break;
            }
          },
          closeDialog(){
            this.flowDialog=false;
          },
          addSetDialog(){//新增子流程
            if(this.caseId==''||this.caseId==null||this.caseId==undefined){
              this.$message({
                message: '请先选择事件类型！',
                type: 'warning'
              });
              return
            }
            this.flowTitle='新增子流程';
            this.flowDialog=true;
          },
          evaluationID(){
            this.caseId=sessionStorage.getItem('parameterTreeId')
            console.log(this.caseId);
            this.getTableDatas();
          },
          getTableDatas(){
            let data={
              code:'Confirm',
              caseId:this.caseId
            };
            this.$api.getFlow(data).then((res) => {
              if(res.errorcode==0){
                this.tableData=res.data
              }
            })
          },
          handleUpdate(row){
            this.flowTitle='修改子流程';
            this.flowDialog=true;
            this.flowForm.name=row.name;
            this.flowForm.state=row.content;
            this.staffId=row.id;
            let flowTrue=null;
            if(row.dynamicContactor.code=='yes'){
              flowTrue=true
            } else {
              flowTrue=false
            }
            this.flowForm.checked=flowTrue;
          },
          handleDelete(id){
            let data={
              id:id
            };
            this.$api.deleteFlow(data).then((res) => {
              if(res.errorcode==0){
                this.getTableDatas();
                this.flowDialog=false
                this.flowTextarea = ''
              }else {
                this.$message.error(res.msg)
              }
            })

          }
        }
    }
</script>

<style scoped>

</style>
