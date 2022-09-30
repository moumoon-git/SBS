<template>
  <el-tabs class="narBar" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="bar in navBarList" :key="bar.id" :label="bar.name" :name="bar.name"></el-tab-pane>
  </el-tabs>
</template>

<script>
import $ from 'jquery'
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
        this.$emit('changTab',tab.name)
      },
      // 切换Tab
      activeTabHandle(){
        let activeTab = [] // 当前选中项
        let activeTabWidth = 0 // tab选项下边框过渡距离
        let allTab = document.getElementsByClassName('el-tabs__item')
        for (let i in allTab) {
          let tabId = allTab[i].id
          if ( this.selectedName == tabId.substring(tabId.lastIndexOf('-')+1,tabId.length)) {
            break
          }
          activeTabWidth += allTab[i].offsetWidth
        }
        activeTab = document.getElementsByClassName('el-tabs__active-bar')[0]
        if (!activeTabWidth) {
          document.getElementById(`tab-${this.selectedName}`).style.color = "#0091ff"
          activeTab.style.transform = 'translateX(0px)'
          $('.el-tabs__item.is-active').css('color','#A2A2A2')
        }
      }
    }
  }
</script>

<style scoped>
  /*
    /deep/ 与 >>>为穿透
   详情见 https://blog.csdn.net/Alex81320/article/details/86234369
  */
  .narBar {
    /* margin: 10px 30px; */
    margin-bottom: 15px;
    height: 56px;
    background: rgba(255, 255, 255, 1);
    /*border: 1px solid rgba(219, 219, 219, 1);*/
    /*border-radius: 3px;*/
  }

 >>>.el-tabs__header.is-top{
    margin: 0;
    height: 58px;
  }

  >>>.el-tabs__nav-wrap.is-top {
    color: #A2A2A2 !important;
    height: 58px;
  }

  >>>.el-tabs__nav-scroll{
    margin-left:10px;
  }

  >>>.el-tabs__item{
    /* font-size:16px; */
    /* color: #A2A2A2; */
    color: #999999;
    font-size: 18px;
    font-weight: 500;
    height: 58px;
    line-height: 58px;
    padding: 0 20px !important;
    box-sizing: inherit;
  }

  >>>.el-tabs__item.is-active {
    /* color: #409EFF; */
    font-weight: bold;
    font-size: 18px;
    color: #333333;
    height: 58px;
    line-height: 58px;
    padding: 0 20px;
    box-sizing: inherit;
  }

  >>>.el-tabs__item:hover {
    color: #6B7280;
  }
  >>>.el-tabs__nav-next,>>>.el-tabs__nav-prev{
    line-height: 58px;
    font-size: 20px;
  }

</style>
