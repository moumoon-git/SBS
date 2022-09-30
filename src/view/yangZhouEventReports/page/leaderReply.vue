<template>
  <div class="leaderReply">
    <div>
      <div class="reply-header">
        <div class="record-title">回复记录</div>
        <el-button class="record-add" type="primary" @click="addReplyBtn">新增回复</el-button>
      </div>
      <el-scrollbar class="reply-content">
        <div v-if="generalLeadershipList.length > 0">
          <div v-for="(item,index) in generalLeadershipList" :key="index">
            <el-collapse v-model="activeNames">
              <el-collapse-item :name="index">
                <template slot="title">
                  <div class="reply-detail-title">
                    <div class="reply-title">{{item.name}}</div>
                    <div class="reply-date">{{item.replyTime.substr(0, item.replyTime.length - 3)}}</div>
                  </div>
                </template>
                <div class="reply-detail-content">
                  <div>{{item.replyContent}}</div>
                  <div class="reply-detail-operation">
                    <el-tooltip class="item" effect="dark" content="复制" placement="top">
                      <div
                        class="reply-detail-copy"
                        v-clipboard:copy="item.replyContent"
                        v-clipboard:success="copyTextSuccess"
                        v-clipboard:error="copyTextError"
                      ></div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                      <div class="reply-detail-delete" @click="replyDeleteTips(item)"></div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                      <div
                        class="reply-detail-edit"
                        @change="handleChange"
                        @click="editReplyBtn(item)"
                      ></div>
                    </el-tooltip>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
        <div class="nullList" v-else>
          <el-collapse>
            <img src="/static/img/nullList.png" alt />
            <p>暂无数据</p>
          </el-collapse>
        </div>
      </el-scrollbar>
    </div>
    <el-dialog
      customClass="leaderCustomSize"
      :title="title"
      :visible.sync="addReplyDialog"
      :close-on-click-modal="false"
      @close="closeButton"
    >
      <el-form :model="addReplyDialogForm" :rules="addReplyRules" ref="addReplyDialogForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addReplyDialogForm.name" autocomplete="off" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="addTime">
          <el-date-picker
            v-model="addReplyDialogForm.addTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="内容" prop="desc">
          <el-input type="textarea" v-model="addReplyDialogForm.desc" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addReplyDialog = false">取 消</el-button>
        <el-button type="primary" @click="addReply('addReplyDialogForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 提示弹窗 -->
    <prompt-dialog-box
      v-if="promptConfig.visible"
      :prompt-dialog-config="promptConfig"
      @confirm="promptConfirm"
      @cancel="promptCanCel"
    ></prompt-dialog-box>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import promptDialogBox from "@/yz_components/promptDialogBox/promptDialogBox";
export default {
  name: 'leaderReply',
  components: {
    promptDialogBox
  },
  data(){
    return{
      index:0,
      activeNames:[0],
      addReplyDialog: false,
      addReplyDialogForm: { //添加领导表格数据
        name: '',
        addTime: '',
        desc: ''
      },
      addReplyRules:{
        name:[{ required: true, message: '名字不能为空', trigger: 'blur' }],
        addTime:[{ required: true, message: '请选择日期', trigger: 'blur' }],
        desc:[{ required: true, message: '回复内容不能为空', trigger: 'blur' }]
      },
      formLabelWidth: '120px',
      replyTime:'',
      generalLeadershipList: [], //领导回复数据列表
      eventGeneralDealId:'',// 事件id
      title:'',
      promptConfig: { // 提示弹窗的配置
        visible: false, // 是否显示弹窗
        promptType: 'delete', // 弹窗类型：delete:删除提示弹窗,warn：警告提示弹窗,success：成功提示弹窗,error：错误提示弹窗,info：常规类信息提示弹窗,default：不包含icon提示弹窗
        promptTitle: '是否确认要删除？', // 弹窗标题
        promptText: '删除后，数据将不可恢复', // 弹窗文本
        cancelButtonText: '取消', // 取消操作按钮文本
        confirmButtonText: '确定', // 确认操作按钮文本
        isNeedIcon: true  // 是否需要显示左边的图标
      },
      deleteId:'' //删除数据的id
    }
  },
  mounted(){
    this.index = 0;
  },
  computed: {
    ...mapGetters ({
      commonInformationReport: 'getCommonInformationReport'
    })
  },
  watch: {
    'commonInformationReport': {
      handler: function(newVal, oldVal) {
        this. activeNames = [0]
        this.generalLeadershipList = []
        if(newVal.generalDeal){
          this.eventGeneralDealId = newVal.generalDeal.id
        }else{
          this.eventGeneralDealId = ''
        }
        
        for(let key in newVal.generalLeadershipList){
          this.generalLeadershipList.push(newVal.generalLeadershipList[key])
        }
        console.log(newVal)
        console.log(oldVal)
      },
      deep: true,
      immediate: true
    },
  },
  methods:{
    /**
     * @author hexinting
     * @date 2020-11-26
     * @description 提醒是否要删除领导回复
     */
    replyDeleteTips(item) {
      console.log(item)
      this.deleteId = item.id
      this.promptConfig.visible = true; // 显示弹窗
      this.promptConfig.promptTitle = '提醒';
      this.promptConfig.promptText = '是否要删除该回复';
      this.promptConfig.subPomptText = '删除后，数据将不可恢复'
      this.promptConfig.cancelButtonText = '取消删除';  // 取消操作按钮文本
      this.promptConfig.confirmButtonText = '确定删除'; // 确认操作按钮文本
    },
    /**
     * @author hexinting
     * @date 2020-11-26
     * @lastEditor hexinting
     * @lastDate 2020-11-26
     * @description 弹窗确认按钮
     */
    promptConfirm() {
      this.replyDelete()
    },
    /**
     * @author hexinting
     * @date 2020-11-26
     * @lastEditor hexinting
     * @lastDate 2020-11-26
     * @description 弹窗取消按钮
     */
    promptCanCel() {
      this.promptConfig.visible = false; // 隐藏弹窗
    },
    /**
    *description 复制领导回复,copyTextSuccess复制成功/copyTextError复制失败
    *@author husiyue
    *@date 2020/11/27
    */
    copyTextSuccess(e){
      this.$message.success('复制成功');
    },
    copyTextError(){
      this.$message.error('复制失败')
    },
    /**
    *description 删除领导回复
    *@author husiyue
    *@date 2020/11/28
    */
    replyDelete(item){
      let data = {
        generalLeadershipId: this.deleteId
      }
      this.$api.deleteGeneralLeadership(data).then(res=>{
        if (res.errorcode === 0) {
          this.$message.success('删除成功')
          this.promptConfig.visible = false; // 隐藏弹窗
          // 重新请求获得列表
          let data = {
            generalDealId: this.eventGeneralDealId // 事件id
          }
          this.$api.getEventGeneralDealId(data).then(res => {
            if (res.errorcode === 0) {
              this.$store.commit('setCommonInformationReport', res.data) // 存数据给领导回复和信息报送使用
            }
          })
      } else {
        this.$message.error(res.msg)
      }
      })
    },
    handleChange(val) {
      console.log(val);
    },
    /**
    *description 领导回复添加按钮
    *@author husiyue
    *@date 2020/11/28
    */
    addReplyBtn(){
      console.log(this.eventGeneralDealId)
      if(this.eventGeneralDealId == ''){
        this.$message({
          message: '请新增事件',
          type: 'warning',
        });
      }else{
        this.addReplyDialog = true
        this.title = '新增回复'
        this.addReplyDialogForm.id = ''
        this.addReplyDialogForm.name = ''
        this.addReplyDialogForm.addTime = ''
        this.addReplyDialogForm.desc = ''
      }
    },
    /**
      *description 领导回复修改按钮
      *@author husiyue
      *@date 2020/11/28
      */
    editReplyBtn(item){
      console.log(item)
      this.title = '修改回复'
      this.addReplyDialogForm.id = item.id
      this.addReplyDialogForm.name = item.name
      this.addReplyDialogForm.addTime = item.replyTime
      this.addReplyDialogForm.desc = item.replyContent
      this.addReplyDialog = true;
    },
    /**
    *description 添加/修改领导回复弹窗
    *@author husiyue
    *@date 2020/11/28
    */
    addReply(addReplyDialogForm){
      this.$refs[addReplyDialogForm].validate((valid)=>{
        if(valid){
          this.addReplyDialog = false
          if(this.title == '新增回复'){
            let data = {
              generalLeadershipJson:{
                id:'',
                eventGeneralDealId:this.eventGeneralDealId,
                name: this.addReplyDialogForm.name,
                replyTime: this.addReplyDialogForm.addTime,
                replyContent: this.addReplyDialogForm.desc
              }
            }
            this.$api.saveGeneralLeadership(data).then(res =>{
                if (res.errorcode === 0){
                  this.$message({
                      message: '新增成功！',
                      type: 'success',
                  });
                  this.addReplyDialogForm.name = ''
                  this.addReplyDialogForm.addTime = ''
                  this.addReplyDialogForm.desc = ''
                  // 重新请求获得列表
                  let data = {
                    generalDealId: this.eventGeneralDealId // 事件id
                  }
                  this.$api.getEventGeneralDealId(data).then(res => {
                    if (res.errorcode === 0) {
                      this.$store.commit('setCommonInformationReport', res.data) // 存数据给领导回复和信息报送使用
                    }
                  })
                }else{
                  this.$message({
                    message: res.msg,
                    type: 'error',
                  });
                }
            })
          }else{
            this.addReplyDialog = false
            let data = {
              generalLeadershipJson:{
                id: this.addReplyDialogForm.id,
                eventGeneralDealId: this.eventGeneralDealId,
                name: this.addReplyDialogForm.name,
                replyTime: this.addReplyDialogForm.addTime,
                replyContent: this.addReplyDialogForm.desc
              }
            }
            this.$api.saveGeneralLeadership(data).then(res =>{
                if (res.errorcode === 0){
                  this.$message({
                      message: '修改成功！',
                      type: 'success',
                  });
                  // 重新请求获得列表
                  let data = {
                    generalDealId: this.eventGeneralDealId // 事件id
                  }
                  this.$api.getEventGeneralDealId(data).then(res => {
                    if (res.errorcode === 0) {
                      this.$store.commit('setCommonInformationReport', res.data) // 存数据给领导回复和信息报送使用
                    }
                  })
                }else{
                  this.$message({
                    message: res.msg,
                    type: 'error',
                  });
                }
            })
          }
        }else{
          return false;
        }
      })
    },
    /**
    *description 关闭领导回复弹窗
    *@author husiyue
    *@date 2020/11/28
    */
    closeButton(){
      this.$refs.addReplyDialogForm.resetFields();
      this.addReplyDialogForm.id = ''
      this.addReplyDialogForm.name = ''
      this.addReplyDialogForm.addTime = ''
      this.addReplyDialogForm.desc = ''
      this.addReplyDialog = false
    }
  }
}
</script>

<style scoped>
.leaderReply {
    margin: 0 20px;
}
.reply-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    /* width: 97%; */
    margin: 11px 0px;
}
.reply-header .record-title {
    height: 20px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 20px;
    margin-left: 10px;
}
.reply-header .record-title:after {
    content: '';
    position: absolute;
    background: #0091ff;
    width: 3px;
    height: 18px;
    left: 0;
    top: 5px;
    margin-top: 13px;
    margin-left: 20px;
}
.reply-header .record-add {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 76px;
    height: 30px;
    font-size: 14px;
}
.reply-content {
    height: 645px;
    /* overflow: scroll; */
}
.reply-content .el-collapse {
    border: none;
}
.reply-content .el-collapse-item__header {
    background: #f0f6ff;
    height: 35px;
    font-size: 14px;
    font-weight: 500;
    color: #555555;
    line-height: 17px;
}
.reply-content .el-collapse-item {
    border: 1px solid #dae7f8;
    margin-bottom: 10px;
}
.reply-content .el-collapse > .is-active {
    border: 1px solid #0091ff;
}
.reply-content
    .el-collapse-item
    >>> .el-collapse-item__wrap
    .el-collapse-item__content {
    padding-bottom: 0;
}
.reply-detail-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
.reply-title {
    height: 17px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #555555;
    line-height: 17px;
    text-align: left;
    margin-left: 11px;
}
.reply-date {
    height: 17px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 17px;
    margin-right: 11px;
}
.reply-detail-content {
    margin: 2px 10px 0;
    font-size: 14px;
    text-align: left;
}
.reply-detail-operation {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
    background: rgb(240, 246, 255, 0.4);
    height: 28px;
}
.reply-detail-operation div {
    width: 24px;
    height: 24px;
    margin-right: 13px;
}
.reply-detail-copy {
    background: url('/static/img/leaderReply/copyText.png') no-repeat;
    background-size: 24px 24px;
}
.reply-detail-delete {
    background: url('/static/img/leaderReply/delete.png') no-repeat;
    background-size: 24px 24px;
}
.reply-detail-edit {
    background: url('/static/img/leaderReply/edit.png') no-repeat;
    background-size: 24px 24px;
}

.reply-detail-copy:hover {
    background: url('/static/img/leaderReply/copyTextActive.png');
    background-size: 24px 24px;
}
.reply-detail-delete:hover {
    background: url('/static/img/leaderReply/deleteActive.png');
    background-size: 24px 24px;
}
.reply-detail-edit:hover {
    background: url('/static/img/leaderReply/editActive.png');
    background-size: 24px 24px;
}

.leaderReply .el-form-item__content .el-input {
    width: 388px;
}
.leaderReply .el-form-item__content .el-date-editor {
    width: 388px;
}
.leaderReply .el-form-item__content .el-textarea {
    width: 388px;
}
.notDate {
    color: #909399;
    font-size: 14px;
    line-height: 400px;
}
</style>

<style>
.leaderCustomSize {
    width: 547px !important;
    height: 449px !important;
}
.leaderReply .el-dialog {
    border-radius: 7px;
    box-shadow: 0px 0px 21px 3px rgba(0, 0, 0, 0.27);
}
.leaderReply .el-dialog .el-dialog__header {
    display: flex;
    padding: 15px 10px;
    background: #f1f4f6;
    border-radius: 7px 7px 0px 0px;
}
.leaderReply .el-dialog .el-dialog__header .el-dialog__title {
    font-size: 16px;
}
.leaderReply .el-dialog .el-dialog__body {
    font-size: 16px;
    padding: 30px 40px 20px 40px;
}
.leaderReply .el-dialog .el-form .el-form-item {
    margin-bottom: 15px;
}
.leaderReply .el-dialog .el-form .el-form-item .el-form-item__error {
    padding-top: 0;
    margin-left: 75px;
}
.leaderReply .el-dialog .el-form-item__label {
    margin-right: 30px;
    padding: 0;
}
.leaderReply .el-dialog .el-form-item__content .el-input {
    width: 388px;
}
.leaderReply .el-dialog .el-form-item__content .el-textarea textarea {
    min-height: 135px !important;
}
.leaderReply .el-dialog .el-dialog__footer {
    border-top: 1px solid#E9ECF1;
    padding: 20px 20px 15px 20px;
    position: absolute;
    bottom: 15px;
    right: 0;
    width: 100%;
    position: absolute;
    bottom: 0px;
    right: 0;
}
.nullList {
    display: flex;
    flex-direction: column;
    padding-top: 100px;
    align-items: center;
    color: #cad5e8;
    border: 0;
    text-align: center;
}

.nullList > img {
    width: 120px;
    height: 120px;
}
</style>