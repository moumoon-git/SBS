<template>
   <div>
    <el-row>
      <el-col :span="6" style="border-right: 1px solid #ddd;padding-right: 10px">
        <el-scrollbar style="height: 444px">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="eventTreeSearch">
          </el-input>
          <el-tree
            ref="tree"
            :data="treedata"
            node-key="id"
            highlight-current
            :default-expanded-keys="[0]"
            @node-click="handleNodeClick"
            :props="defaultProps"
            :filter-node-method="searchTreeData"
          >
            <span class="span-ellipsis" slot-scope="{ node}">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </el-tree>
        </el-scrollbar>

      </el-col>
      <el-col :span="18">
        <div class="bottomSetting">
          <el-tabs type="border-card"  >
            <el-tab-pane label="信息报送">
              <div style="width:100%" >
                <el-col :span="5" style="border-right: 1px solid #ddd">
                  <div style="width: 100%;height:395px">
                    <div style="width: 100%;text-indent: 10px;text-align: left;height: 40px;line-height: 40px">事件等级:</div>
                    <div @click="indexList(item,index)" :class="{ red:changeRed == index}"  style="width: 100%;height: 50px;cursor: pointer;" v-for="(item,index) in rankData" :key="index">
                      <div style="height: 50px;line-height: 50px">{{item.name}}</div>
                    </div>
                  </div>
                </el-col>

                <el-col :span="5" style="border-right: 1px solid #ddd">
                  <div style="width: 100%;text-align: left;text-indent: 10px;height: 30px;line-height: 30px;margin: 10px 0">
                    <el-button size="mini" type="primary" @click="msgDialog" icon="el-icon-plus">新增</el-button>
                  </div>
                  <msg-table style="height: 345px"  ref="msgTable"
                             :tableColumn="flowTableColumn"
                             @handleCurrentChange="flowdleCurrentChange"
                             @handleUpdate="flowdleUpdate"
                             @delete="flowdleDelete"
                             :tableData="flowTableData"
                  >

                  </msg-table>
                </el-col>

                <el-col :span="5" style="border-right: 1px solid #ddd">
                  <div style="width: 100%;text-align: left;text-indent: 10px;height: 30px;line-height: 30px;margin: 10px 0">
                    <el-button size="mini" type="primary" @click="msgSendSelect"  icon="el-icon-folder-opened">选择</el-button>
                  </div>
                  <msg-table   style="height: 320px" ref="msgTable"
                               :tableColumn="msgTableColumn"
                               @delete="handleDelete"
                               :tableData="msgTableData"></msg-table>
                  <el-pagination small :page-size="pageFoleSize"  :total="totalFolw"
                                 :current-page="currentFolwPage"
                                 @current-change="pageFolwChange"
                                 layout="prev, pager, next">
                  </el-pagination>
                </el-col>

                <el-col :span="9">
                  <div style="width: 100%;text-indent: 10px;text-align: left;height: 40px;line-height: 40px">流程说明:</div>
                  <el-input
                    type="textarea"
                    :autosize="{minRows:14,maxRows:14}"  resize="none"
                    v-model="flowConener"
                    placeholder="请输入内容"
                  >
                  </el-input>
                  <div style="width: 100%;text-align: right">
                    <el-button style="margin:10px 30px 10px 0" type="success" size="mini"  @click="saveMsgSend" >保存</el-button>
                  </div>

                </el-col>

                <!--弹窗-->
                <el-dialog   width="600px"   :visible.sync="msgSendDialog" :title="msgSendTitle"
                             center :before-close="msgCloseDialog" :close-on-click-modal="false"
                             append-to-body
                >
                  <el-form :hide-required-asterisk="false" label-width="90px" :model="msgSendForm" :rules="msgSendRules" ref="msgSendForm"  label-position="content"   @submit.native.prevent>
                    <el-form-item label="流程名称:">
                      <el-input  type="text"  v-model.trim="msgSendForm.name"></el-input>
                    </el-form-item>

                    <el-form-item label="流程说明:">
                      <el-input  type="textarea"  :autosize="{minRows:7,maxRows:12}"  resize="none"
                                 v-model.trim="msgSendForm.state" show-word-limit></el-input>
                    </el-form-item>
                    <!-- 此选项在3.0业务上不需要了，先隐藏 20210624 -->
                    <!-- <el-form-item>
                      <el-checkbox v-model="msgSendForm.checked">可动态设置流程人员</el-checkbox>
                    </el-form-item> -->
                  </el-form>
                  <div slot="footer" class="dialog-footer">
                    <el-button @click="msgSendClose" size="small">取 消</el-button>
                    <el-button type="primary" size="small" @click="msgSendConfirm('msgSendForm')">确 定</el-button>
                  </div>
                </el-dialog>

                <msg-select-dialog ref="selectDialog"
                                   :selectTitle="myMsgSendTitleDialog" :selectData="myMsgSendDataDialog"
                                   @closeDialog="closeMsgsendMyDialog"
                                   @confirm="confirmMyMsgsend"
                                   @close="closeMyMsgsend" v-if="hackReset"
                ></msg-select-dialog>
              </div>
            </el-tab-pane>

          </el-tabs>
        </div>
      </el-col>
    </el-row>
    <div style="width: 100%;text-align: right;padding: 20px 0">
      <el-button size="mini" type="primary" @click="confirmDialog">确定</el-button>
    </div>

     <msg-select-dialog ref="selectDialog"
                        :selectTitle="myMsgSendTitleDialog" :selectData="myMsgSendDataDialog"
                        @closeDialog="closeMsgsendMyDialog"
                        @confirm="confirmMyMsgsend"
                        @close="closeMyMsgsend" v-if="hackReset"
     ></msg-select-dialog>
  </div>
</template>

<script>
    import msgTable from '@/view/SysSetting/eventSettings/msgTable'
    import msgSelectDialog from "@/view/eventManagement/eventReports/dialog/selectDialog"
    export default {
        name: "submittedDisopsition",
        components:{
          msgTable,msgSelectDialog
        },
        data(){
        return{
          defaultProps: {
            children: 'children',
            label: 'name',
          },
          tableColumn:[
            {
              prop: "name",
              label: "子流程名字"
            }
          ],
          treedata: [
            {
              name: '事件类型',
              id: 0,
              children: []
            }
          ],
          changeRed:-1,//切换按钮颜色
          flowTableColumn:[
            {
              prop: "name",
              label: "子流程名字"
            }
          ],
          flowTableData:[],//第一个表格

          msgTableColumn:[
            {
              prop: "name",
              label: "人员姓名"
            }
          ],
          msgTableData:[],//第二个表格

          rankData:[],//级别数据
          indexListId:'',//当前事件等级ID
          crewId:'',//子流程id
          pageFoleSize:10,
          totalFolw:0,
          currentFolwPage:1,
          flowConener:'',//流程说明

          msgSendDialog:false,//弹窗
          msgSendTitle:'',
          msgSendForm:{
            name:'',
            state:'',
            checked:null
          },
          msgSendRules:{

          },

          myMsgSendDataDialog:false,//选择人员弹窗
          myMsgSendTitleDialog:'',
          caseId:'',

          hackReset:true,//刷新子组件的方法
          eventTreeSearch:'',//树搜索
        }
      },
        mounted(){
          this.getTreeData();
          this.$nextTick(() =>{
            this.getRankData()
          })
        },
        watch:{
          eventTreeSearch(val) {
            this.$refs.tree.filter(val);
          },
          indexListId:{//监听事件等级
            handler(newV,oldV){
              if(newV!==oldV){
                this.msgTableData=[];
                this.flowConener='';
                this.crewId=''
              }
            },
            deep:true
          },
          caseId:{
            handler(newL,oldL){
              if(newL!==oldL){
                this.msgTableData=[];
                this.flowConener='';
                this.crewId=''
                this.indexListId=''
                this.changeRed=-1
                this.flowTableData=[]
              }
            },
            deep:true
          },
          treeId:{
            handler(newV,oldV){
              if(newV!==oldV){
                this.indexListId=''
              }
            },
            deep:true
          },
          flowTableData:{
            handler(newV,oldV){
              if(newV!==oldV){
                this.msgTableData=[];
              }
            },
            deep:true
          }

        },
        methods:{
          getTreeData() {
            let data = {};

            this.$api.getTree(data).then(res => {
              if (res.errorcode!=0){
                this.$message({
                  message:res.msg,
                  type:"error"
                });
                return
              }
              this.data=res.data
              let treeData = res.data;
              this.treedata[0].children = JSON.parse(JSON.stringify(treeData));
            })
          },
          searchTreeData(value, data){//tree节点搜索
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
          },
          handleNodeClick(data){//树点击
            this.treeId=data.id
            this.changeRed=-1
            // this.flowTableData=''
            // this.msgTableData=''
            // this.rankData=''
            // this.crewId=''
            // this.flowConener=''
          },
          confirmDialog(){
            this.$emit('confirmDialog')
          },
          saveMsgSend(){
            if(this.crewId==''||this.crewId==null){
              this.$message({
                message: '请先选择子流程!',
                type: 'warning'
              });
              return;
            }
            let data={
              id:this.crewId,
              content:this.flowConener
            };
            this.$api.addFlowContent(data).then((res) => {
              if(res.errorcode==0){
                this.$message({
                  message: '流程说明保存成功!',
                  type: 'success'
                });
                this.getMsgTableData()
              }else {
                //this.$message.error(res.msg)
              }
            })
          },
          closeMsgsendMyDialog(){//
            this.hackReset=false;
            this.$nextTick(()=>{
              this.hackReset=true
            })
            this.myMsgSendDataDialog=false
          },
          getReportContent(){
            let data={
              code:'Report',
              caseId:this.caseId
            };
            this.$api.getFlow(data).then((res) => {
              if(res.errorcode==0){
                if(res.data[0]==''||res.data[0]==undefined||res.data[0]==null){
                  this.$message({
                    message: '暂无流程说明!',
                    type: 'warning'
                  });
                  this.flowConener='';
                }else {
                  this.flowConener=res.data[0].content;
                }

              }
            })
          },
          confirmMyMsgsend(checkedCities){//选择人员确认
            this.hackReset=false;
            this.$nextTick(()=>{
              this.hackReset=true
            })
            let data={
              flowId:this.crewId,
              contacts:checkedCities
            };
            this.$api.personAdd(data).then((res) => {
              if(res.errorcode==0){
                this.currentFolwPage=1;
                this.myMsgSendDataDialog=false;
                this.getFlowStaetData();
              }else {
                //this.$message.error(res.msg)
              }
            })
          },
          closeMyMsgsend(){
            this.hackReset=false;
            this.$nextTick(()=>{
              this.hackReset=true
            })
            this.myMsgSendDataDialog=false
          },
          msgSendSelect(){//选择人员
            if(this.indexListId==''||this.indexListId==null||this.indexListId==undefined){
              this.$message({
                message: '请先选择事件等级!',
                type: 'warning'
              });
              return
            }
            if(this.crewId==''||this.crewId==null||this.crewId==undefined){
              this.$message({
                message: '请先选择子流程!',
                type: 'warning'
              });
              return
            }
            this.myMsgSendDataDialog=true;
            this.myMsgSendTitleDialog='选择联系人';
            this.$refs.selectDialog.getListTree();
          },
          indexList(item,index){
            this.changeRed = index;
            this.indexListId=item.id;
            if(this.treeId==''||this.treeId==null){
              this.$message({
                message: '请先选择事件类型',
                type: 'warning'
              })
              return
            }
            this.getMsgTableData();
          },
          getMsgTableData(){//获取子流程列表
            let data={
              code:'Report',
              caseId:this.treeId,
              levelId:this.indexListId
            }
            this.$api.getFlow(data).then((res) =>{
              if(res.errorcode==0){
                this.flowTableData=res.data
              }else {
                //this.$message.error(res.msg)
              }
            })
          },
          getRankData(){
            let data={
              pcode:'emtlevel'
            };
            this.$api.eventLevel(data).then((res) =>{
              if(res.errorcode==0){
                this.rankData=res.data;
              }else{
                //this.$message.error(res.msg)
              }
            })
          },
          handleDelete(id){
            let idArr=[];
            idArr.push(id);
            let data={
              ids:idArr
            };
            this.$api.structDelete(data).then((res) => {
              if(res.errorcode==0){
                // this.currentFolwPage=1;
                this.getFlowStaetData();
              }else {
                //this.$message.error(res.msg)
              }
            })
          },
          pageFolwChange(val){
            this.currentFolwPage=val;
            this.getFlowStaetData();
            console.log(val);
          },
          flowdleCurrentChange(row){
            console.log(row.id);
            this.crewId=row.id;
            this.flowConener=row.content;

            this.getFlowStaetData();
          },
          getFlowStaetData(){//获取子流程人员
            let data={
              flowId:this.crewId,
              size:this.pageFoleSize,
              page:this.currentFolwPage
            };
            console.log(this.currentFolwPage);
            this.$api.structList(data).then((res) => {
              if(res.errorcode==0){
                this.msgTableData=res.data.data;
                this.totalFolw=res.data.totalElements;
                this.$refs.msgTable.updateButton=false;
              }else {
                //this.$message.error(res.msg)
              }
            });
          },
          msgDialog(){//新增弹窗
            if(this.treeId==''||this.treeId==null){
              this.$message({
                message: '请先选择事件类型!',
                type: 'warning'
              });
              return
            }
            if(this.indexListId==''||this.indexListId==null){
              this.$message({
                message: '请先选择事件等级!',
                type: 'warning'
              });
              return
            }
            this.msgSendTitle='新增子流程';
            this.msgSendDialog=true;
            this.msgSendForm.name='';
            this.msgSendForm.state='';
            this.msgSendForm.checked=null;
          },
          flowdleUpdate(row){
            this.msgSendTitle='修改子流程';
            this.msgSendDialog=true;
            this.msgSendForm.name=row.name;
            this.msgSendForm.state=row.content;
            console.log(row);
            let conj=null;
            if(row.dynamicContactor.code==='yes'){
              conj=true
            }else {
              conj=false
            }
            this.msgSendForm.checked=conj
          },
          msgCloseDialog(){//弹窗擦掉
            this.msgSendDialog=false;
          },
          flowdleDelete(id){
            let data={
              id:id
            };
            this.$api.deleteFlow(data).then((res) => {
              if(res.errorcode==0){
                this.getMsgTableData();
                this.msgSendDialog=false;
                this.flowConener='';
              }else {
                //this.$message.error(res.msg)
              }
            })
          },
          msgSendClose(){//弹窗取消方法
            this.msgSendDialog=false;
          },
          msgSendConfirm(msgSendForm){//弹窗确认方法
            this.$refs[msgSendForm].validate((valid) => {
              if (valid) {
                let type=this.msgSendTitle;
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
                      caseId:this.treeId,
                      code:'Report',
                      name:this.msgSendForm.name,
                      content:this.msgSendForm.state,
                      dynamic:conj,
                      levelId:this.indexListId
                    };
                    this.$api.flowAdd(addData).then((res) => {
                      if(res.errorcode==0){
                        this.getMsgTableData();
                        this.msgSendDialog=false
                      }else {
                        //this.$message.error(res.msg)
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
                      id:this.crewId,
                      code:'Report',
                      name:this.msgSendForm.name,
                      content:this.msgSendForm.state,
                      dynamic:conjs
                    };
                    this.$api.flowUpdate(upData).then((res) => {
                      if(res.errorcode==0){
                        this.getMsgTableData();
                        this.msgSendDialog=false
                      }else {
                        //this.$message.error(res.msg)
                      }
                    });
                    break;
                }

              }//确认
            });
          },

        }
    }
</script>

<style scoped>
  .red{
    background-color: cornflowerblue;
    color: white !important;
    border: 1px solid #2d8cf0;

  }
  >>>.el-tabs--border-card>.el-tabs__content{
    padding: 0
  }
</style>
