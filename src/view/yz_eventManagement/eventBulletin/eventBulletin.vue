<!--
 * @Author: your name
 * @Date: 2020-12-02 16:55:43
 * @LastEditTime: 2020-12-11 18:19:17
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \GGECSd:\xuchuangxing\YJJEOS\src\view\eventManagement\eventBulletin\eventBulletin.vue
-->
<!--@author：yf-->
<template>
  <div>
    <nav-bar
      ref="navBar"
      :selectedName="selectedName"
      :navBarList="navBarList"
      class="narBar"
      @changTab="changTab"
    ></nav-bar>
    <event-letters
      v-if="selectedName == '事件快报' && !isYangZhou"
    ></event-letters>
    <yz-event-letters
      v-if="selectedName == '事件快报' && !!isYangZhou"
    ></yz-event-letters>
    <event-day v-if="selectedName == '每日一报'"></event-day>
    <affection-weekly v-if="selectedName == '要情周报'"></affection-weekly>
    <monthly v-if="selectedName == '月报'"></monthly>
    <bottom-report v-if="selectedName == '下级报告'"></bottom-report>
  </div>
</template>

<script>
import navBar from "@/yz_components/menu/navBar";
import eventLetters from "@/view/yz_eventManagement/eventBulletin/Page/eventLetters";
import yzEventLetters from "@/view/yz_eventManagement/eventBulletin/Page/yzEventLetters";
import eventDay from "@/view/yz_eventManagement/eventBulletin/Page/eventDay";
import affectionWeekly from "@/view/yz_eventManagement/eventBulletin/Page/affectionWeekly";
import monthly from "@/view/yz_eventManagement/eventBulletin/Page/monthly";
import bottomReport from "@/view/yz_eventManagement/eventBulletin/Page/bottomReport";
export default {
  name: "eventBulletin",
  components: {
    navBar,
    eventLetters,
    yzEventLetters,
    eventDay,
    affectionWeekly,
    monthly,
    bottomReport,
  },
  data() {
    return {
      selectedName: "事件快报", //默认选中导航条
      isYangZhou: window.g.IsYangZhouProject,
      navBarList: window.g.IsYangZhouProject
        ? [
            {
              name: "事件快报",
            },
            {
              name: "每日一报",
            },
            {
              name: "要情周报",
            },
            {
              name: "月报",
            },
          ]
        : [
            {
              name: "事件快报",
            },
            {
              name: "每日一报",
            },
            {
              name: "要情周报",
            },
            {
              name: "月报",
            },
            // 需求：下级报告隐藏
            // {
            //   name: "下级报告",
            // },
          ], //导航条模块
    };
  },

  methods: {
    changTab(tabName) {
      return (this.selectedName = tabName);
    },
  },
};
</script>

<style scoped>
</style>
