<template>
  <div>
    <el-tabs v-model="type" type="card" @tab-click="handleTabsClick">
      <el-tab-pane label="当天情况" name="0"></el-tab-pane>
      <el-tab-pane label="最近三天" name="1"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: "Tabs",
    data(){
      return{
        type: '0'
      }
    },
    methods:{
      handleTabsClick(){
        this.$emit('handleTabsClick',this.type)
      }
    }
  }
</script>

<style scoped>
  >>>.el-tabs__item{
    height: 42px;
    line-height: 42px;
    font-size:17px;
    color:#999;
    padding: 0px 30px !important;
    background: #FBFCFF;
    border:1px solid #DDDEE1 !important;
  }
  >>>.el-tabs__header{
    background: white;
    margin-bottom: 0px;
  }
  >>>.el-tabs__nav .is-active{
    color: #333;
    background: white;
    border-bottom:1px solid white !important;
  }
  >>>.el-tabs__nav .el-tabs__item:first-child{
    border-radius: 4px 0 0 0;
  }
  >>>.el-tabs__nav .el-tabs__item:last-child{
    border-radius: 0 4px 0 0;
  }
</style>
