<!--@author：wzm-->
<template>
  <div>
    <!--兰州项目没有电话点名-->
    <div v-if="MapProjectUrl">
      <nav-bar
        :selectedName="LZselectedName"
        :navBarList="LZnavBarList"
        class="narBar"
        @changTab="changLZTab"
      ></nav-bar>
      <video-call v-if="LZselectedName == '视频点名'"></video-call>
      <guard-statistics v-if="LZselectedName == '在岗统计'"></guard-statistics>
      <applet-call v-if="LZselectedName == '小程序点名'"></applet-call>
    </div>
    <!-- 石景山没有视频点名和小程序点名 -->
    <div v-if="!MapProjectUrl">
      <nav-bar
        :selectedName="selectedName"
        :navBarList="navBarList"
        class="narBar"
        @changTab="changTab"
      ></nav-bar>
      <phone-call v-if="selectedName == '电话点名'"></phone-call>
      <video-call v-if="selectedName == '视频点名'"></video-call>
      <guard-statistics v-if="selectedName == '在岗统计'"></guard-statistics>
      <applet-call v-if="selectedName == '小程序点名'"></applet-call>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/menu/navBar";
import PhoneCall from "@/view/dutyManagement/rollOnDuty/phoneCall/phoneCall";
import AppletCall from "@/view/dutyManagement/rollOnDuty/appletCall/appletCall";
import GuardStatistics from "@/view/dutyManagement/rollOnDuty/guardStatistics/guardStatistics";
import VideoCall from "@/view/dutyManagement/rollOnDuty/videoCall/videoCall";

export default {
  name: "rollOnDuty",
  components: {
    NavBar,
    PhoneCall,
    VideoCall,
    GuardStatistics,
    AppletCall,
  },
  data() {
    return {
      selectedName: "电话点名", //默认选中导航条
      LZselectedName: "视频点名", //兰州默认选中导航条
      LZnavBarList: [
        {
          name: "视频点名",
        },
        {
          name: "小程序点名",
        },
        {
          name: "在岗统计",
        },
      ], //兰州导航条模块
      navBarList: [
        {
          name: "电话点名",
        },
        // {
        //   name: "视频点名"
        // },
        // {
        //   name: "小程序点名"
        // },
        {
          name: "在岗统计",
        },
      ], //导航条模块
      MapProjectUrl: window.g.IsLanZhouProject, //是否为兰州项目
    };
  },
  methods: {
    //兰州Tab的改变方法
    changLZTab(tabName) {
      return (this.LZselectedName = tabName);
    },
    changTab(tabName) {
      return (this.selectedName = tabName);
    },
    test() {},
  },
};
</script>

<style scoped>
</style>
