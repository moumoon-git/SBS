<template>
  <el-radio-group v-model="radioBtn" @change="handleRadioGroup">
    <el-radio-button label="发送成功">发送成功(20)</el-radio-button>
    <el-radio-button label="发送失败">发送失败(10)</el-radio-button>
  </el-radio-group>
</template>

<script>
    export default {
      name: "myRadioGroup",
      props:{
        radioBtn:{
          type:String,
          default:"发送队列"          //需要绑定发送队列、发送成功、发送失败其中一个值
        }
      },
      data(){
          return{

          }
      },
      methods:{
        handleRadioGroup(val){
          this.$emit('radioBtnChange',val)
        },
      }
    }
</script>

<style scoped>
  .el-radio-group >>>.el-radio-button__inner{
    padding: 10px 12px;
  }
</style>
