<!--@author：yf-->
<template>
  <div>
    <div style="padding: 20px 10px">
      <el-form label-width="90px" :model="ruleForm" :rules="rules" ref="ruleForm"  label-position="content"   @submit.native.prevent>
        <el-row>
          <el-col :span="12">
            <el-form-item label="事件类型:">
              <el-input type="text" :disabled="true" v-model.trim="ruleForm.type" show-word-limit ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="子流程:">
              <el-input  type="text"  :disabled="true"  v-model.trim="ruleForm.subProcess " show-word-limit ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="addButton">
        <el-button   type="primary" size="small" @click="selectReport">选择</el-button>
        <el-button   type="primary" size="small" @click="addFlow">新增</el-button>
        <el-button   type="primary" size="small" @click="addSpeaker">添加报告人</el-button>
        <el-button   type="primary" size="small" @click="updataReport">修改</el-button>
        <el-button   type="primary" size="small" @click="deleteReport">删除</el-button>
        <el-button   type="primary" size="small" @click="closeContact">关闭</el-button>
      </div>
      <div>
        <my-table
          @handleCurrentChange="handleCurrentChange"
          :tableColumn="tableColumn"
          :tableData="tableData">
        </my-table>
      </div>
      <div>
        <el-pagination :small="pagingSize"  :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"
                       :current-page="currentPage"
                       @size-change="handleSizeChange" @current-change="pageMode"
                       layout="total, prev, pager, next, sizes, jumper"></el-pagination>
      </div>
    </div>

    <!--弹窗-->
    <el-dialog width="600px" :title="title" :visible.sync="innerVisible" append-to-body center :close-on-click-modal="false" @close="closeButton">
      <el-form :hide-required-asterisk="false" label-width="90px" :model="addFlowForm" :rules="addFlowRules" ref="addFlowForm"  label-position="content"   @submit.native.prevent>
        <el-row>
          <el-col :span="12">
            <el-form-item label="姓名:" prop="name">
              <el-input type="text"  v-model.trim="addFlowForm.name" show-word-limit ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职责:" prop="duty">
              <el-select v-model.trim="addFlowForm.duty" filterable clearable placeholder="请选择" @blur="selectBlur">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="联系电话:"  prop="phone" >
              <el-input  type="text"  v-model.trim="addFlowForm.phone" show-word-limit ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="工作单位:"  prop="workUnit">
              <el-input type="text"  v-model.trim="addFlowForm.workUnit" show-word-limit ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="职务:"  prop="position">
              <el-input type="text"  v-model.trim="addFlowForm.position" show-word-limit ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注:" prop="remark">
              <el-input type="textarea" :autosize="{minRows:5,maxRows:7}"  resize="none" v-model.trim="addFlowForm.remark" show-word-limit ></el-input>
            </el-form-item>
          </el-col>
        </el-row>



      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <!--        <el-button @click="outerVisible = false">取消</el-button>-->
        <el-button size="small" type="primary" @click="lookForConfirmation('addFlowForm')">确认</el-button>
      </div>

    </el-dialog>
    <select-dialog ref="selectDialog"
                   :selectTitle="selectTitle" :selectData="selectData"
                   @closeDialog="closeDialog"
                   @confirm="confirm"
                   @close="close"
    ></select-dialog>
  </div>

</template>

<script>
    import myTable from "@/components/tables/tables"
    import selectDialog from "@/view/eventManagement/eventReports/dialog/selectDialog"
    export default {
        name: "eventContact",
        components:{
          myTable,
          selectDialog
        },
        data(){
          let number=(rule,value,callback)  =>{
            let num= /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/;
            let n=value.match(num);
            if(n ==null){
              callback(new Error('请输入正确的电话号码!'));
            }
            callback();
          };
          let black=(rule,value,callback)  =>{
            let blk=  /^[^ ]+$/;
            let n=value.match(blk);
            if(n ==null){
              callback(new Error('不能为空或输入空格!'));
            }
            callback();
          };
          return{
            eventType:'',//事件类型
            subProcess:'',//子流程
            ruleForm:{
              type:'',
              subProcess:''
            },
            rules:{},
            tableColumn:[
              {
                prop: "duty",
                label: "职责"
              },
              {
                prop: "name",
                label: "姓名"
              },
              {
                prop: "mobile",
                label: "联系号码"
              },
              {
                prop: "workUnit",
                label: "工作单位"
              },
              {
                prop: "position",
                label: "职务"
              },
            ],
            tableData:[],
            pagingSize:true,
            total:0,
            pageSize:10, //每页多少条
            currentPage:1, //当前页
            processData:[],//流程数据
            eventId:'',//事件ID
            caseId:'',//事件类型ID
            flowId:'',//流程id
            id:'',//当前tableID
            innerVisible:false,//事件联系人弹窗
            title:'',//新增事件联系人弹窗标题
            addFlowForm:{//新增弹窗表单
              name:'',
              duty:'',
              phone:'',
              workUnit:'',
              position:'',
              remark:''
            },
            options:[
              {
              value: '现场联络员',
              label: '现场联络员'
              },
              {
              value: '第一现场联系人',
              label: '第一现场联系人'
              },
              {
              value: '第二现场联系人',
              label: '第二现场联系人'
              }, {
              value: '现场指挥官',
              label: '现场指挥官'
              },
              {
              value: '事件报告人',
              label: '事件报告人'
              }],//下拉框数据
            addFlowRules:{//新增弹窗表单验证
              /**
               * @lastEditor qinjiaqi
               * @lastDate 2020-10-27
               * @Description 多加一个不为空判断，保证修改联系人所有选项必填
               */    
              name: [
                { required: true, message: "不能为空", trigger: "blur" },
                { validator: black, trigger: 'blur' },
              ],
              duty: [
                { required: true, message: "不能为空", trigger: "blur" },
                { validator: black, trigger: 'blur' },
              ],
              phone: [
                { required: true, message: "不能为空", trigger: "blur" },
                { validator: number, trigger: 'blur' },
                { min: 11, max: 11,  message:'请输入11位数的电话号码!' },
              ],
              workUnit: [
                { required: true, message: "不能为空", trigger: "blur" },
                { validator: black, trigger: 'blur' },
              ],
              position: [
                { required: true, message: "不能为空", trigger: "blur" },
                { validator: black, trigger: 'blur' },
              ],
              remark: [
                { required: true, message: "不能为空", trigger: "blur" },
                { validator: black, trigger: 'blur' },
              ],
            },
            tableRowData:[],//存储表格点击的数据
            selectData:false,//选择弹出框
            selectTitle:'',//选择标题
          }
        },
        methods:{
          addSpeaker(){//添加报告人
            if(this.eventId==''||this.eventId==null||this.eventID=='newID'){
              this.$message({
                message: '请先保存事件',
                type: 'warning'
              });
              return
            }
            let data={
              eventId: this.eventId,
              flowId:this.flowId,
            };
            this.$api.addReport(data).then((res) => {
              if(res.errorcode==0){
                this.getTableData();
              } else {
                this.$message.error(res.msg)
              }
            })
          },
          selectBlur(e) {
            this.addFlowForm.duty = e.target.value
          },
          getData(index,buttons,caseName,caseId){
            console.log(index, buttons, caseName, caseId);
            this.ruleForm.type=caseName
            this.caseId=caseId
            this.processData=buttons;
            this.ruleForm.subProcess=this.processData[index].name;
            this.getID(index);
          },
          getID(index){
            this.flowId=this.processData[index].id;
            this.eventId=sessionStorage.getItem('newID');
            this.getTableData();
          },
          getTableData(){
            let data={
              eventId: this.eventId,
              flowId:this.flowId,
              size:this.pageSize,
              page:this.currentPage
            };
            this.$api.getFlowList(data).then((res) => {
              if(res.errorcode==0){
                this.tableData=res.data.data
                this.total=res.data.totalElements
              }
            })
          },
          addFlow(){//新增事件联系人
            if(this.eventId==''||this.eventId==null||this.eventID=='newID'){
              this.$message({
                message: '请先保存事件',
                type: 'warning'
              });
              return
            }
            if(this.flowId==''||this.flowId==null||this.flowId==[]){
              this.$message({
                message: '请选中右侧流程！',
                type: 'warning'
              });
              return;
            }
            this.innerVisible=true;
            this.title='新增事件联系人';
            this.addFlowForm.duty='';
            this.addFlowForm.name='';
            this.addFlowForm.phone='';
            this.addFlowForm.position='';
            this.addFlowForm.remark='';
            this.addFlowForm.workUnit=''
          },
          updataReport(){//修改
            if(this.eventId==''||this.eventId==null||this.eventID=='newID'){
              this.$message({
                message: '请先保存事件',
                type: 'warning'
              });
              return
            }
            if(this.tableRowData==''||this.tableRowData==null||this.tableRowData==[]){
              this.$message({
                message: '请点击表格选择事件进行修改！',
                type: 'warning'
              });
              return;
            }
            this.innerVisible=true;
            this.title='修改事件联系人';
            console.log(this.tableRowData);
            this.addFlowForm.duty=this.tableRowData.duty;
            this.addFlowForm.name=this.tableRowData.name;
            this.addFlowForm.phone=this.tableRowData.mobile;
            this.addFlowForm.position=this.tableRowData.position;
            this.addFlowForm.remark=this.tableRowData.remark;
            this.addFlowForm.workUnit=this.tableRowData.workUnit;
            this.id=this.tableRowData.id;
          },
          lookForConfirmation(addFlowForm){
            this.$refs[addFlowForm].validate((valid) => {
              if (valid) {
                let type=this.title;
                console.log(this.title);
                let upData,addData
                switch (type) {
                  case '新增事件联系人':
                    addData={
                      data:{
                        eventId:this.eventId,
                        subFlowId:this.flowId,
                        duty:this.addFlowForm.duty,
                        name:this.addFlowForm.name,
                        phone:this.addFlowForm.phone,
                        position:this.addFlowForm.position,
                        remark:this.addFlowForm.remark,
                        workUnit:this.addFlowForm.workUnit
                      }
                    };
                    this.$api.getFlowAdd(addData).then((res) => {
                      if(res.errorcode=='0'){
                        this.$message({
                          message: '新增成功！',
                          type: 'success'
                        });
                        this.getTableData();
                        this.tableRowData='';
                        this.innerVisible=false;
                      }else {
                        //this.$message.error(res.msg);
                      }
                    })
                    break;
                  case '修改事件联系人':
                    upData={
                      data:{
                        eventId:this.eventId,
                        subFlowId:this.flowId,
                        duty:this.addFlowForm.duty,
                        name:this.addFlowForm.name,
                        phone:this.addFlowForm.phone,
                        position:this.addFlowForm.position,
                        remark:this.addFlowForm.remark,
                        workUnit:this.addFlowForm.workUnit,
                        id:this.id,
                      }
                    };
                    this.$api.getFlowUpdate(upData).then((res) => {
                      if(res.errorcode=='0'){
                        this.$message({
                          message: '修改成功！',
                          type: 'success'
                        });
                        this.getTableData();
                        this.tableRowData='';
                        this.innerVisible=false;
                      }else {
                        this.$message.error(res.msg);
                      }
                    })
                    break;
                  default:
                    break;
                }
              }

            });
          },
          deleteReport(){//删除
            if(this.tableRowData==''||this.tableRowData==null||this.tableRowData==[]){
              this.$message({
                message: '请点击表格选择事件进行删除！',
                type: 'warning'
              });
              return;
            }
            this.$confirm('此操作将删除该条内容, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let data={
                id:this.tableRowData.id
              };
              this.$api.getFlowDelete(data).then((res) => {
                if(res.errorcode=='0'){
                  this.$message({
                    message: '已删除！',
                    type: 'success'
                  });
                  this.getTableData();
                  this.tableRowData='';
                  this.innerVisible=false;
                }else {
                  //this.$message.error(res.msg);
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
          },
          selectReport(){//选择按钮
            if(this.eventId==''||this.eventId==null||this.eventID=='newID'){
              this.$message({
                message: '请先保存事件',
                type: 'warning'
              });
              return
            }
            this.selectData=true;
            this.selectTitle='联系人选择';
            this.$refs.selectDialog.getListTree();
          },
          closeDialog(){//关闭选择弹窗
            this.selectData=false;
          },
          confirm(checkedCities){//选择确认按钮
            if(this.eventId==''||this.eventId==null){
              this.$message({
                message: '请优先选择事件',
                type: 'warning'
              });
              return;
            }
            else if(this.flowId==''||this.flowId==null){
              this.$message({
                message: '请优先选择流程',
                type: 'warning'
              });
              return;
            }
            let data={
              contacters:checkedCities,
              eventId:this.eventId,
              flowId:this.flowId
            };
            this.$api.choose(data).then((res) => {
              if(res.errorcode=='0'){
                this.$refs.selectDialog.checkedCities=[];
                this.$refs.selectDialog.total=0;
                this.$refs.selectDialog.pageSize=12;
                this.$refs.selectDialog.currentPage=1;
                this.$refs.selectDialog.cities=[];
                this.selectData=false;
                this.getTableData()
              }else {
                this.$message.error(res.msg);
              }
            })

          },
          close(){//取消按钮
            this.selectData=false;
          },
          handleCurrentChange(row){
            this.tableRowData=row;
          },
          handleSizeChange(val){
            this.pageSize=val;
            this.getTableData();
          },
          pageMode(val){
            this.currentPage=val;
            this.getTableData();
          },
          closeButton(){//清除表单验证结果
            this.$refs.addFlowForm.resetFields();
          },
          closeContact(){//关闭事件联系人
            this.$emit('closeContact');
          }
        }
    }
</script>

<style scoped>
  .addButton{
    width: 100%;
    text-align: left;
  }
</style>
