<!--
 * @Author: your name
 * @Date: 2020-12-08 17:58:36
 * @LastEditTime: 2020-12-22 11:26:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GGECSd:\xuchuangxing\SZEOS\src\view\eventManagement\eventBulletin\eventBulletin.vue
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
    <template v-if="isNewDevelopmentCode">
      <yz-event-letters v-if="selectedName == '事件快报'"></yz-event-letters>
    </template>
    <template v-else>
      <event-letters v-if="selectedName=='事件快报'"></event-letters>
    </template>
    <event-day v-if="selectedName == '每日一报'"></event-day>
    <template v-if="isNewDevelopmentCode">
      <yz-affection-weekly v-if="selectedName == '要情周报'"></yz-affection-weekly>
    </template>
    <template v-else>
      <affection-weekly v-if="selectedName == '要情周报'"></affection-weekly>
    </template>
    <monthly v-if="selectedName == '月报'"></monthly>
    <bottom-report v-if="selectedName == '下级报告'"></bottom-report>
  </div>
</template>

<script>
import navBar from "@/components/menu/navBar";
import eventLetters from "@/view/eventManagement/eventBulletin/Page/eventLetters";
import yzEventLetters from "@/view/eventManagement/eventBulletin/Page/yzEventLetters"; // 深圳新需求引用扬州事件快报 author: xuchuangxing lastUpdateTime: 2020-12-16
import yzAffectionWeekly from "@/view/eventManagement/eventBulletin/Page/yzAffectionWeekly"; // 深圳新需求事件周报 author: qinjiaqi lastUpdateTime: 2020-12-22
import eventDay from "@/view/eventManagement/eventBulletin/Page/eventDay";
import affectionWeekly from "@/view/eventManagement/eventBulletin/Page/affectionWeekly";
import monthly from "@/view/eventManagement/eventBulletin/Page/monthly";
import bottomReport from "@/view/eventManagement/eventBulletin/Page/bottomReport";
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
    yzAffectionWeekly
  },
  data() {
    return {
      isNewDevelopmentCode: window.g.isNewDevelopmentCode, // 是否使用深圳新需求
      selectedName: "事件快报", //默认选中导航条
      navBarList: [
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
        {
          name: "下级报告",
        },
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
