<!--@author：yf-->
<template>
  <el-tabs class="narBar" v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane v-for="(bar,index) in navBarList" :key="index" :label="bar.name" :name="bar.name"></el-tab-pane>
  </el-tabs>
</template>

<script>
  export default {
    name: "navBar",
    props: ['selectedName', 'navBarList'],
    data() {
      return {
        activeName: this.selectedName
      }
    },
    methods: {
      handleClick(tab) {
        this.$emit("changTab", tab.name);
      }
    }
  }
</script>

<style scoped>
  /*
    /deep/ 与 >>>为穿透
   详情见 https://blog.csdn.net/Alex81320/article/details/86234369
  */
  /*.narBar {*/
    /*margin: 20px 30px;*/
    /*height: 56px;*/
    /*background: rgba(255, 255, 255, 1);*/
    /*border: 1px solid rgba(219, 219, 219, 1);*/
    /*border-radius: 3px;*/
  /*}*/

  /*>>>.el-tabs__header.is-top{*/
    /*margin: 0;*/
    /*height: 58px;*/
  /*}*/

  /*>>>.el-tabs__nav-wrap.is-top {*/
    /*color: #A2A2A2 !important;*/
    /*height: 58px;*/
  /*}*/

  /*>>>.el-tabs__nav-scroll{*/
    /*margin:10px 32px;*/
  /*}*/

  /*>>>.el-tabs__item{*/
    /*font-size:16px;*/
    /*color: #A2A2A2;*/
  /*}*/

  /*>>>.el-tabs__item.is-active {*/
    /*color: #409EFF;*/
  /*}*/

  /*>>>.el-tabs__item:hover {*/
    /*color: #6B7280;*/
  /*}*/
  /*>>>.el-tabs__nav-next,>>>.el-tabs__nav-prev{*/
    /*line-height: 58px;*/
  /*}*/
>>>.el-tabs--card>.el-tabs__header .el-tabs__nav{
  border-radius: 0;
}
  >>>.el-tabs__nav-wrap{
    border-top: 1px solid #ddd;
  }

</style>
