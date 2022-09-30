<template>
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"  class="demo-ruleForm" @submit.native.prevent>
    <el-form-item label="值班硬件设备状态" class="size">
      <el-radio v-model="ruleForm.radio" label="1" @change="change">正常</el-radio>
      <el-radio v-model="ruleForm.radio" label="0" @change="change">异常</el-radio>
    </el-form-item>
    <el-form-item label="故障描述:" >
      <el-input :disabled="forbidden" type="textarea" v-model="ruleForm.breakDown" resize="none" :autosize="{ minRows:4, maxRows: 6}"></el-input>
    </el-form-item>
    <el-form-item label="事件处理:" >
      <el-input type="textarea" v-model="ruleForm.eventDeal" resize="none"  :autosize="{ minRows:4, maxRows: 6}"></el-input>
    </el-form-item>
    <el-form-item label="领导交办:" >
      <el-input type="textarea" v-model="ruleForm.handover" resize="none"  :autosize="{ minRows:4, maxRows: 6}"></el-input>
    </el-form-item>
    <el-form-item>
      <el-checkbox ref="elCheckBox" v-model="ruleForm.remindConfirmDuty">
        提醒接班人员
      </el-checkbox>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"  @click="submitForm">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
    export default {
        name: "fromDate",
        props: ['ruleForm'],
        data(){
          return{
            rules:{

            },
            forbidden:true//禁用设备故障
          }
        },
      methods:{
         submitForm(ruleForm){
             let breakDown = '';
             if(!this.forbidden)  breakDown = this.ruleForm.breakDown; 
             this.$emit("submitForm",breakDown,this.ruleForm.eventDeal,this.ruleForm.handover)

          },
        // submitForm(ruleForm){
        //   console.log(this.ruleForm.malfunction)
        //   console.log(this.ruleForm.incident)
        //   console.log(this.ruleForm.assign)
        //
        //   // let data = {
        //   //         page: this.currentPage1,
        //   //         size: 10
        //   //       };
        //   //       console.log(data);
        //   //       this.$api.contactorList(data).then((res) => {
        //
        //   //       })
        // },
        change(val){
          if(val=='0'){
            this.forbidden=false
          }else {
            this.ruleForm.malfunction='';
            this.forbidden=true
          }
        }
      },
      mounted() {
            console.log(this.ruleForm.malfunction)
      }
    }
</script>

<style scoped>
  .size >>> .el-form-item__label{
    font-size: 16px;
    font-weight: bold;
    color: black;
  }
</style>
