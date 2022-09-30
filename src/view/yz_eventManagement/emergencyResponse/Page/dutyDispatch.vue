<template>
  <div class="block">
        <div class="container">
          <div class="messageBox">
            <el-form ref="workForm" :model="messageForm" :rules="rules" label-position="right" label-width="100px">
              <el-form-item prop="eventId" hidden>
                <el-col :span="24">
                  <el-input type="textarea" v-model="messageForm.eventId"></el-input>
                </el-col>
              </el-form-item>
              <el-row>
                <el-form-item prop="eventDesc" label="事件内容:">
                  <el-col :span="24">
                    <el-input type="textarea" v-model="messageForm.eventDesc" resize="none" :rows="4"></el-input>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item prop="dutyDesc" label="职责内容:">
                  <el-col :span="24">
                    <el-input type="textarea" v-model="personInfo.remark" resize="none" :rows="4"></el-input>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item prop="customContent" label="自定义内容:">
                  <el-col :span="24">
                    <el-input type="textarea" v-model="messageForm.customContent" resize="none" :rows="4"></el-input>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item prop="customContent" label="短信预览:">
                  <el-col :span="24">
                    <el-input type="textarea" :value="messageContent" readonly resize="none" :rows="8"></el-input>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row style="padding-left:100px;display: flex;align-items: center;">
                <el-col :span="4" style="text-align: left;">
                  <el-button type="primary" @click="handleDispatch">发送短信</el-button>
                </el-col>
                <el-col :span="3" style="text-align: left;">
                  合成选项:
                </el-col>
                <el-col :span="13" style="text-align: left;">
                  <el-checkbox-group v-model="checkList">
                    <el-checkbox label="事件内容"></el-checkbox>
                    <el-checkbox label="职责内容"></el-checkbox>
                    <el-checkbox label="自定义内容"></el-checkbox>
                  </el-checkbox-group>
                </el-col>
                <el-col :span="4" style="color:blue">
                  (请勾选至少一项)
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
  </div>
</template>

<script>
  // import emergencyDepartments from "@/view/eventManagement/emergencyResponse/Page/emergencyDepartments"
  export default {
    name: "duty",
    // components: {emergencyDepartments},
    props:['personInfo','checkedList','checkedFlow'],
    data() {
      return {
        rules: {
          eventDesc: [
            {required: true, message: '事件内容不能为空', trigger: 'blur'},
          ]
        },//验证规则
        messageForm: {
          eventDesc: "",
          customContent: "请各单位立即按预案要求组织力量前往救援"
        },
        checkList:["事件内容","职责内容","自定义内容"],
      }
    },
    methods:{
      handleDispatch() {
        console.log(this.checkedList)
        if (this.checkedList.length === 0){
          this.$message({
            message: '至少选中一个人员',
            type: 'warn'
          })
          return
        }
        let eventId=sessionStorage.getItem('newID');
        var contacts = []
          this.checkedList.forEach(t => {
            contacts.push({id:t.contactId,content:this.composeMessage(this.personInfo.remark),positionId:t.id})
          })
        let data = {
          eventId,
          contacts,
        }
        if(this.checkedFlow){
          data.processId = this.checkedFlow.id
        }
        console.log(data)
        this.$api.responseDispatch(data).then(res => {
          console.log(res)
          if (res.errorcode !== 0){
            this.$message({
              message: res.msg,
              type: 'error'
            })
            return
          }
          this.$message({
            message: '发送成功',
            type: 'success'
          })
        })
      },
      getEventDesc(){//获取默认事件或最新事件
        let eventId=sessionStorage.getItem('newID');
        if(eventId==''||eventId==null||eventId==undefined ||eventId=='newID') return
          let data={
            id:eventId
          };
          this.$api.findById(data).then((res) => {
            if(res.errorcode=='0'){
              this.messageForm.eventDesc= '各单位请注意：' + res.data.event.reportDescription.replace(/\n/g,'')
            }
          })
      },
      composeMessage(remark) {
        let str = ""
        if (this.checkList.includes("事件内容") && this.messageForm.eventDesc.length>0) {
          str += this.messageForm.eventDesc + '。\n'
        }
        if (this.checkList.includes("职责内容") && remark &&remark.length>0) {
          str += "根据《预案》，您的应急职责是" + remark + '。\n'
        }
        if (this.checkList.includes("自定义内容") && this.messageForm.customContent.length>0) {
          str += this.messageForm.customContent + '。'
        }
        return str
      }
    },
    computed:{
      messageContent:{
        get() {
          return this.composeMessage(this.personInfo.remark)
        }
      }
    },
    created(){
      this.getEventDesc()
    }
  }
</script>

<style scoped>
  .block{
    height: 100%;
  }
  .container{
    height:700px;
    width:100%;
    padding: 20px;
    box-sizing: border-box
  }
  .messageBox{
    padding: 10px;
    border:1px solid #ccc;
    height:100%;
    box-sizing: border-box
  }
</style>
