<!--@author：yf-->
<template>
  <div style="padding: 0 20px">
    <div style="display: flex;height: 60px;line-height: 60px">
      <div style="flex: 4">
        <el-input placeholder="请输入内容" v-model="receptionUnit">
          <template slot="prepend">接报单位</template>
        </el-input>
      </div>
      <div style="flex: 6;display: flex;justify-content: flex-end">
        <div>
          <el-input placeholder="请输入内容" v-model="uploading">
          <template slot="prepend">附件信息</template>
        </el-input>
        </div>

        <div class="bottomStyel">
          <el-button type="primary" size="small ">选择文件</el-button>
          <el-button type="primary" size="small ">保存</el-button>
        </div>

      </div>
    </div>
    <div style="display: flex">
      <el-card class="box-card" v-for="o in 4" :key="o" style="width: 200px;margin-right: 10px">
        <div slot="header" class="clearfix" style="text-align: left">
          <span>传真名字</span>
          <el-button style="float: right; padding: 3px 0" type="text">链接</el-button>
        </div>
        <div  class="text item">
          内容
        </div>
      </el-card>

    </div>
  </div>
</template>

<script>
    export default {
        name: "annexInformation",
        data(){
          return{
            receptionUnit:'',
            uploading:''
          }
        }
    }
</script>

<style scoped>
  .bottomStyel >>>.el-button+.el-button{
    margin: 0;
  }
  .bottomStyel >>>.el-button--small, .el-button--small.is-round{
    padding: 10px 15px;
    margin-left: 10px;
  }
</style>
