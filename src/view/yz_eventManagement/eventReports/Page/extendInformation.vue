<!--@author：yf-->
<template>
    <div class="formContent">
      <el-form label-width="100px" :model="ruleForm" :rules="rules" ref="ruleForm" @submit.native.prevent  label-position="left">
        <el-row :gutter="gutter">
          <el-col :span="24">
            <el-form-item label="事发原因:">
              <el-input  type="textarea" :maxlength=1000   resize="none" clearable :autosize="{ minRows:5, maxRows: 10}"   v-model="ruleForm.matterCause" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="gutter">
          <el-col :span="24">
            <el-form-item label="已造成后果:">
              <el-input type="textarea" :maxlength=1000 resize="none" clearable :autosize="{ minRows:5, maxRows: 10}" v-model="ruleForm.matterConsequence " show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="gutter">
          <el-col :span="24">
            <el-form-item label="事件发展趋势:">
              <el-input type="textarea" :maxlength=1000 resize="none" clearable  :autosize="{ minRows:5, maxRows: 10}" v-model="ruleForm.matterTendency " show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="gutter">
          <el-col :span="24">
            <el-form-item label="已采取措施:">
              <el-input type="textarea" :maxlength=1000 resize="none" clearable  :autosize="{ minRows:5, maxRows: 10}" v-model="ruleForm.step " show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="gutter">
          <el-col :span="24">
            <el-form-item label="转办人:">
              <el-input type="text"  v-model.trim="ruleForm.matterTrun" clearable show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="gutter">
          <el-col :span="24">
            <el-form-item label="转办时间:" style="text-align: left">
              <el-date-picker
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model.trim="ruleForm.matterTime"
                type="datetime"
                placeholder="选择日期时间"
                default-time="12:00:00">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="gutter">
          <el-col :span="24">
            <el-form-item label="转办部门:">
              <el-input type="text" clearable  v-model.trim="ruleForm.matterBranch" show-word-limit>
                <template slot="append"><el-button  @click="toHold">选择</el-button></template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="gutter" >
          <el-col :span="24">
           <el-form-item label="附件:">
            <el-col :span="4">

              <div class="addKkp" >
                <!-- <el-upload
                  class="upload-demo"
                  ref="upload"
                  :action="extendString"
                  :headers="{Authorization: $window.localStorage.getItem('token') ? $window.localStorage.getItem('token') : ''}"
                  accept=".jpg,.jpeg,.png,.pdf,.ppt,.pptx,.doc,.docx,.txt,.xlsx,.xls"
                  :on-preview="handlePreview"
                  :file-list="fileList"
                  :on-success="onSuccess"
                  :on-error="onError"
                  :before-upload="beforeUpload"
                  :data="withParameters"
                  auto-upload
                  with-credentials
                  :show-file-list="false"
                  :on-exceed="onExceed"
                >
                  <el-button type="primary" slot="trigger" size="mini">新增</el-button>
                </el-upload> -->
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  action=""
                  :headers="{Authorization: $window.localStorage.getItem('token') ? $window.localStorage.getItem('token') : ''}"
                  accept=".jpg,.jpeg,.png,.pdf,.ppt,.pptx,.doc,.docx,.txt,.xlsx,.xls"
                  :on-preview="handlePreview"
                  :file-list="fileList"
                  :on-success="onSuccess"
                  :on-error="onError"
                  :before-upload="beforeUpload"
                  :data="withParameters"
                  auto-upload
                  with-credentials
                  :show-file-list="false"
                  :on-exceed="onExceed"
                  :http-request="httpRequest"
                >
                  <el-button type="primary" slot="trigger" size="mini">新增</el-button>
                </el-upload>
              </div>
              <div class="addKkp">
                <el-button type="primary" size="mini" @click="delectResData">删除</el-button>
              </div>
            </el-col>
            <el-col :span="20" >
              <div style="border: 1px solid #ddd;height: 150px;">

                <div class="uiLi">
                  <el-scrollbar>
                    <div class="divClassName" v-for="(item,index) in resDataList"
                         @click="missPlanIndex(item,index)"
                         :key="index"
                         :class="{ red:changeRed == index}">
                      <div style="flex: 8">{{item.filename}}</div>
                      <!--                    <div style="flex: 2" v-if="item.extension=='jpg'||item.extension=='pdf'"><el-button type="success" size="mini" @click="downloadList(item,index)">查看</el-button></div>-->
                      <div style="flex: 2" ><el-button type="primary" size="mini" @click="downloadList(item,index)">下载</el-button></div>
                    </div>
                  </el-scrollbar>
                </div>

              </div>
            </el-col>
          </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div class="addButton">
        <el-button type="primary" size="small" @click="saveEvent">保存信息</el-button>
      <!-- <el-button type="primary" size="small" >发送事发地点</el-button>-->
      </div>

      <add-dialog
        @closeDialog="closeDialog"
        @confirm="confirm"
        @close="close"
        ref="eventDialog"
        :title="title"
        :addEventDialog="addEventDialog"
        @handleNodeClick="handleNodeClick"
      ></add-dialog>
    </div>
</template>

<script>
    import addDialog from "@/view/yz_eventManagement/eventReports/dialog/eventDialog"
    import {Url} from "@/assets/js/common"
    import axios from "axios";
    export default {
        name: "extendInformation",
        components:{
          addDialog
        },
        data(){
          return{
            gutter:20,
            ruleForm:{
              matterCause:'',
              matterConsequence:'',
              matterTendency:'',
              step:'',
              matterMeasure:'',
              matterTrun:'',
              matterTime:'',
              matterBranch:''
            },
            rules:{

            },
            changeRed:-1,
            titleType:'保存',
            eventId:'',//事件ID
            title:'',//弹窗标题
            addEventDialog:false,//是否弹窗
            eventTree:[],//事发区域选择树存储内容
            iComplaintOprid:'',

            fileList:[],//选中数据的数组
            uploadForm:[],
            extendString:`${Url}/eos/event/addAttach`,//扩展信息默认上传的路径
            withParameters:{
              eventId:sessionStorage.getItem('newID')
            },//上传时携带的参数
            resDataList:[],//渲染的list

            itemId:'',//当前删除文件ID
          }
        },
         mounted(){
           this.getEventData();
           this.getResDataAll()
         },
         methods:{
            /**
             * @param {Object} file 获取到文件的一些信息
             * @author hexinting
             * @date 2021-02-24 
             * @description 自定义上传方法 上传到文件服务器
             */
            httpRequest(file) {
                let params = new FormData();
                params.append('filename', file.file.name) // 文件名
                params.append('functionPoint', 'EVENTATTACH') // 后端定义要上传
                params.append('time', new Date().formatDate("yyyyMMddhhmmss")) // 时间戳
                params.append('file', file.file) // 文件
                axios({
                    url: window.g.FileUrl + '/eos/event/sum/report/upload',
                    method: 'post',
                    data: params,
                    header: {
                        Authorization: window.localStorage.getItem('token') ? window.localStorage.getItem('token') : '' // token
                    }
                }).then(res => {
                    console.log(res)
                    if (res.data.errorcode === 0) {
                        this.onSuccess(); // 上传成功
                        let fileData = {
                          filePath: res.data.data.filePath,
                          fileName: res.data.data.fileName,
                          fileSize: res.data.data.size
                        }
                        this.addAttachWithoutFile(fileData); // 事件扩展信息的附件信息保存到eos
                    } else if (res.data.errorcode === 10002) {
                        this.$router.push({
                            path: '/login'
                        }) // 登录失效，调转到登录页
                    } else {
                        this.$message({
                            type: 'warn',
                            message: res.data.msg
                        })
                    }
                })
            },
           missPlanIndex(item,index){//list点击
             this.changeRed=index
             this.itemId=item.id
           },
           /**
            * @lastEditor hexinting
            * @lastEditorTime 2021年2月24日22:35:56
            * @description 下载文件
            */
           downloadList(item){//下载文件
             if(this.eventId==''||this.eventId==null||this.eventID=='newID'){
               this.$message({
                 message: '请先保存事件',
                 type: 'warning'
               });
               return
             }
             // window.open(`${Url}${item.path}`,'_blank')
             // window.open(`${Url}${item.path}`,'_blank')
             // window.open(`${Url}${item.path}`)
             let name =  item.title;
             //  let url = `${Url}/eos/file/getStream?id=${item.id}`; // 从eos后端下载
             let url = `${window.g.FileUrl}/eos/event/sum/downloadFile?fileName=${item.filename}&filePath=${item.path}`; // 从文件服务器下载
             let eleLink = document.createElement('a')
             eleLink.download = name
             eleLink.href = url
             eleLink.click()
           },
           handlePreview(file) {
             console.log(file);
           },
           delectResData(){//删除文件
             if(this.eventId==''||this.eventId==null||this.eventID=='newID'){
               this.$message({
                 message: '请先保存事件',
                 type: 'warning'
               });
               return
             }
             if(this.itemId==''||this.itemId==null){
               this.$message({
                 message: '请选中文件再进行删除',
                 type: 'warning'
               });
               return
             }
             this.$confirm('即将删除该文件, 是否继续?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
             }).then(() => {
               let delatFileArr={
                 id:this.itemId
               };
               this.$api.delAttachWithoutFile(delatFileArr).then((res) => {
                 if(res.errorcode=='0'){
                   this.itemId=''
                   this.changeRed=-1
                   this.getResDataAll()
                 }
               })
             }).catch(() => {
               this.$message({
                 type: 'info',
                 message: '已取消删除'
               });
             });

           },
           beforeUpload(file) {//利用假上传获取文件判断格式
             this.uploadForm.push(file)
             console.log(file)
             let testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
             const extension = testmsg === 'jpg'
             const extension2 = testmsg === 'jpeg'
             const extension3 = testmsg === 'png'
             const extension4 = testmsg === 'pdf'
             const extension5 = testmsg === 'ppt'
             const extension6 = testmsg === 'pptx'
             const extension7 = testmsg === 'doc'
             const extension8 = testmsg === 'docx'
             const extension9 = testmsg === 'txt'
             const extension10 = testmsg === 'xlsx'
             const extension11 = testmsg === 'xls'
             // const isLt2M = file.size / 1024 / 1024 < 10
             if(!extension && !extension2 && !extension3 && !extension4 && !extension5 && !extension6
               && !extension7 && !extension8 && !extension9 && !extension10 && !extension11) {
               this.$message({
                 message: '请上传正确的文件格式',
                 type: 'warning'
               });
             }
             // if(!isLt2M) {
             //     this.$message({
             //         message: '上传文件大小不能超过 10MB!',
             //         type: 'warning'
             //     });
             // }
             // return extension || extension2 && isLt2M
             return extension || extension2 || extension3|| extension4|| extension5|| extension6|| extension7|| extension8|| extension9|| extension10|| extension11
           },
           onSuccess(){//上传成功
             this.changeRed=-1
             this.itemId=''
           },
           onError(err){//文件提前上传失败
             console.log(err);
             this.$message({
               message: '请重新选择文件',
               type: 'warning'
             });
           },
           onExceed(){//文件超出限制
             this.$message({
               message: '请先删除已选择的文件再进行上传!',
               type: 'warning'
             });
           },
            getEventData(){
              this.eventId=sessionStorage.getItem('newID');
              if(this.eventId==''||this.eventId==null||this.eventId=='newID'){
                return
              }
              let data={
                id:this.eventId
              };
              this.$api.findById(data).then((res) => {
                if(res.errorcode=='0'){
                  this.ruleForm.matterCause=res.data.event.reason;
                  this.ruleForm.matterConsequence=res.data.event.result;
                  this.ruleForm.matterTendency=res.data.event.growing;
                  this.ruleForm.step=res.data.event.messure;

                  if(res.data.event.complaintOprid!==''&&res.data.event.complaintOprid!==0){
                    let data={
                      id:res.data.event.complaintOprid
                    }
                    this.$api.findOperator(data).then((res) => {
                      if(res.errorcode=='0'){
                        this.ruleForm.matterTrun=res.data.displayname;
                      }else {
                        //this.$message.error(res.msg)
                      }
                    })
                  }
                  this.ruleForm.matterTime=res.data.event.complaint;
                  this.ruleForm.matterBranch=res.data.event.complaintDepartment;
                  this.iComplaintOprid=res.data.event.complaintOprid
                }
              })
            },
            /**
             * @author hexinting
             * @date 2021-02-24
             * @description 事件扩展信息的附件信息保存到eos
             * @param{Object} file 文件信息 包含filePath 文件路径 | fileName 文件名 | fileSize 文件大小
             */
            addAttachWithoutFile(file) {
              console.log(file)
              let data = {
                filepath: file.filePath,  // 文件路径
                filename: file.fileName,  // 文件名
                fileSize: file.fileSize,  // 文件大小
                eventId: this.eventId  // 事件id
              }
              this.$api.addAttachWithoutFile(data).then(res => {
                if (res.errorcode === 0) {
                  this.getResDataAll();
                }
              })
            },
            getResDataAll(){
             if(this.eventId==''||this.eventId==null||this.eventId=='newID'){
               return
             }
             let dataFileArr={
               eventId:this.eventId
             };
             this.$api.extendGetAttach(dataFileArr).then((res) => {
               if(res.errorcode=='0'){
                 // this.fileList=res.data
                 this.resDataList=res.data
               }else {
                 //this.$message.error(res.msg)
               }
             })
           },
            saveEvent(){
              if(this.eventId==''||this.eventId==null||this.eventId=='newID'){
                this.$message({
                  message: '请先保存事件',
                  type: 'warning'
                });
                return
              }
             let data={
               eventId:this.eventId,
               txtReason:this.ruleForm.matterCause,
               txtResult:this.ruleForm.matterConsequence,
               txtGrowing:this.ruleForm.matterTendency,
               txtMessure:this.ruleForm.step,
               iComplaintOprid:this.iComplaintOprid,
               dtComplaint:this.ruleForm.matterTime,
               vcComplaintDepartment:this.ruleForm.matterBranch
             };
             this.$api.saveEventReceive(data).then((res) => {
               if(res.errorcode=='0'){
                 this.$message({
                   message: '已保存至事件【'+res.data.title+'】',
                   type: 'success'
                 });
               }else{
                 this.$message.error(res.msg);
               }
             })
           },
            toHold(){//通讯录
             this.title='选择部门';
             this.addEventDialog=true;
             let data={};
             this.$api.phoneGroupList(data).then((res) => {
               if(res.errorcode=='0'){
                 this.$refs.eventDialog.lol(res.data);
               }
             })
           },
           closeDialog(){//colse关闭窗口
             this.addEventDialog = false;
           },
           confirm(){//弹出确定
             let type=this.title;
             switch (type) {
               case '选择部门':
                 this.ruleForm.matterBranch=this.eventTree[0].name;
                 break;
               default:
                 break;
             }
             this.addEventDialog=false;
           },
           handleNodeClick(data){ //树点击事件
             let type=this.title;
             switch (type) {
               case '选择部门':
                 this.eventTree=[];
                 this.eventTree.push({name:data.name,id:data.id});
                 break;
               default:
                 break;
             }
           },
           close(){ //弹出取消
             this.addEventDialog=false;
           },
         }
    }
</script>

<style scoped>
  .formContent{
    padding: 20px 20px;
  }
  .addButton {
    width: 100%;
    height: 70px;
    line-height: 70px;
    text-align: left;
    text-indent: 20px;
  }
  .addKkp{
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .uiLi{
    height: 150px;
    overflow: hidden;
  }
  .uiLi .divClassName{
    display: flex;
    text-align: left;
    text-indent: 10px;
  }
  >>>.el-scrollbar {
    height: 100%;
  }
  >>>.el-scrollbar__wrap {
    overflow: scroll;
    overflow-x:auto
  }
  .red{
    background-color: darkgrey !important;
    color: white !important;
  }
</style>
