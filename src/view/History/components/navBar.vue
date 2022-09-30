<template>
  <el-tabs class="narBar" v-model="activeName" @tab-click="handleClick" >
      <el-tab-pane :disabled="barDisabled" v-for="(bar,index) in navBarList" :key="index" :label="bar.name" :name="bar.name"></el-tab-pane>
  </el-tabs>
</template>

<script>
  export default {
    name: "navBar",
    props: {
      selectedName:{
        type: String,
        default: ''
      },
      navBarList:{
        type: Array,
        default: null
      },
      barDisabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        activeName: this.selectedName
      }
    },
    watch:{
      selectedName(val){
        this.activeName = val
      }
    },
    methods: {
      handleClick(tab) {
        this.$emit("changTab", tab.name);
      },
    }
  }
</script>

<style scoped>
  /*
    /deep/ 与 >>>为穿透
   详情见 https://blog.csdn.net/Alex81320/article/details/86234369
  */
  .narBar {
    margin: 10px;
    padding-left: 33px;
    box-shadow:0px 3px 10px 2px rgba(54,121,225,0.09);
    border-radius:3px;
  }

 >>>.el-tabs__header{
   margin: 0;
 }

  >>>.el-tabs__nav-wrap::after{
    width: 0px;
  }

  >>>.el-tabs__item{
    font-size: 16px;
    color: #999999;
    height: 48px;
    line-height: 48px;
  }

  >>>.is-active{
    color: #0091FF !important;
  }


</style>
