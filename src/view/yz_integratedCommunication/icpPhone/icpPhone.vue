<!--@author：llp-->
<template>
  <div>
    <nav-bar :selectedName="toName" :navBarList="toNameData" @changTab="changToTab"></nav-bar>
    <nav-bar :selectedName="selectedName" :navBarList="navBarList" @changTab="changTab"></nav-bar>
    <!-- 注释原因：动态配置联系人大分组 date：2020-11-05 author：hexinting -->
    <!-- <telephone-grouping v-if="selectedName=='政务联络网' || selectedName=='政务通信录' "></telephone-grouping>
    <frequent-contacts v-if="selectedName=='常用联系人'"></frequent-contacts>
    <recent-contacts v-if="selectedName=='最近联系人'"></recent-contacts>
    <emergency-address-book v-show="selectedName=='预案联络网'"></emergency-address-book>
    <tel-new v-if="selectedName=='基层联络网'"></tel-new>
    <beiqin-phone v-if="selectedName=='备勤联络网'"></beiqin-phone> -->
    <!--<video-grouping v-if="selectedName=='视频分组'"></video-grouping>-->
    <!--<terminal-grouping v-if="selectedName=='终端分组'"></terminal-grouping>-->
    
    <telephone-grouping v-if="selectedCode=='phone'"></telephone-grouping>
    <frequent-contacts v-if="selectedCode=='commonlyused'"></frequent-contacts>
    <recent-contacts v-if="selectedCode=='recentcontact'"></recent-contacts>
    <emergency-address-book v-show="selectedCode=='emergency'"></emergency-address-book>
    <tel-new v-if="selectedCode=='gliaison'"></tel-new>
    <beiqin-phone v-if="selectedCode=='dutyGroup'"></beiqin-phone>
    <!--<video-grouping v-if="selectedCode=='VideoGroup'"></video-grouping>-->
    <!--<terminal-grouping v-if="selectedCode=='VideoTerminalGroup'"></terminal-grouping>-->
  </div>
</template>

<script>
  import NavBar from '@/yz_components/menu/navBar';
  import TelephoneGrouping from '@/view/yz_integratedCommunication/icpPhone/telephoneGrouping';
  import TableButtonGroup from '@/yz_components/button/tableButtonGroup';
  import FrequentContacts from '@/view/yz_integratedCommunication/icpPhone/frequentContacts';
  import RecentContacts from '@/view/yz_integratedCommunication/icpPhone/recentContacts';
  import EmergencyAddressBook from '@/view/yz_integratedCommunication/icpPhone/emergencyAddressBook';
  import VideoGrouping from '@/view/yz_integratedCommunication/icpPhone/videoGrouping';
  import TerminalGrouping from '@/view/yz_integratedCommunication/icpPhone/terminalGrouping';
  import telNew from '@/view/yz_integratedCommunication/icpPhone/teleGroupingNew';
  import beiqinPhone from '@/view/yz_integratedCommunication/icpPhone/beiqinPhone';
  import {replaceContactorGroupsConfig, filterGroupName} from '@/assets/js/yz_common.js'
  export default {
    name: 'icpPhone',
    components: {
      TerminalGrouping,
      VideoGrouping,
      EmergencyAddressBook,
      RecentContacts,
      FrequentContacts,
      TableButtonGroup,
      TelephoneGrouping,
      'nav-bar': NavBar,
      telNew,
      beiqinPhone
    },
    data() {
      return {
        IsYangZhouProject: window.g.IsYangZhouProject, // 扬州项目
        // selectedName: window.g.IsYangZhouProject ? '政务通信录' : '政务联络网',//导航默认选中
        selectedName: '政务联络网',//导航默认选中
        selectedCode: 'phone', //导航默认选中
        navBarList: [
          {
            name: '政务联络网',
            code: 'phone',
            enabled: true
          },
          {
            name: '常用联系人',
            code: 'phone',
            enabled: true
          },
          {
            name: '最近联系人',
            code: 'phone',
            enabled: true
          },
          {
            name: '预案联络网',
            code: 'phone',
            enabled: true
          },
          {
            name: "基层联络网",
            code: 'phone',
            enabled: true
          },
          {
            name: "备勤联络网",
            code: 'phone',
            enabled: true
          }
        ],//导航条模块
        // navBarList: window.g.IsYangZhouProject ? [
        //   {
        //     name: '政务通信录'
        //   }, {
        //     name: '常用联系人'
        //   }, {
        //     name: '最近联系人'
        //   }, {
        //     name: '预案联络网'
        //   },
        //   // {
        //   //   name: "基层联络网",
        //   // },{
        //   //   name: "备勤联络网",
        //   // }
        // ] : [
        //   {
        //     name: '政务联络网'
        //   }, {
        //     name: '常用联系人'
        //   }, {
        //     name: '最近联系人'
        //   }, {
        //     name: '预案联络网'
        //   },
        //   {
        //     name: "基层联络网",
        //   },{
        //     name: "备勤联络网",
        //   }
        // ],//导航条模块
        toName: '电话',
        toNameData: [
          {
            name: '电话'
          },
          {
            name: '短信'
          },
          {
            name: '传真'
          },
          {
            name: '会议'
          },
          {
            name: '对讲'
          }
        ]
      };
    },
    mounted() {
      // 3.0不要这个方法了
      // this.initContactorGroupsConfig(); // 初始化分组配置
    },
    methods: {
      /**
       * @author hexinting
       * @date 2020-11-05
       * @lastEditor hexinting
       * @lastDate 2020-11-05
       * @description 初始化分组配置
       */
      initContactorGroupsConfig() {
        let contactorGroups = JSON.parse(sessionStorage.getItem("contactorGroups")); // 后端返回的分组配置列表
        this.navBarList = replaceContactorGroupsConfig(this.navBarList); // 根据后端返回分组，替换联系人大分组名字配置
        let filterGroup = this.navBarList.filter(item => item && item.code === "phone"); // 查找是否配置政务联络网，selectedName和selectedCode更改默认值
        if (filterGroup.length === 0) { // 如果没有配置政务联络网
          this.selectedName = this.navBarList[0].name; // 默认选中第一个
          this.selectedCode = this.navBarList[0].code; // 默认选中第一个
        } else { // 有配置政务联络网
          this.selectedName = filterGroup[0].name;
          this.selectedCode = filterGroup[0].code;
        }
      },
      changToTab(tabName) {
        switch (tabName) {
          case '电话':
            this.$router.push({
              path: '/icpPhone'
            });
            break;
          case '短信':
            this.$router.push({
              path: '/icpSms'
            });
            break;
          case '传真':
            this.$router.push({
              path: '/icpFax'
            });
            break;
          case '会议':
            this.$router.push({
              path: '/icpVideo'
            });
            break;
          case '对讲':
            this.$router.push({
              path: '/icpGroupTalk'
            });
            break;
          default:
            break;
        }
      },
      /**
       * @lastEditor hexinting
       * @lastDate 2020-11-05
       * @description 切换分组
       */
      changTab(tabName) {
        let groupCode = filterGroupName(tabName); // 过滤分组名字,查找code
        this.selectedCode = groupCode;
        return this.selectedName = tabName;
      }
    }
  };
</script>

<style scoped>


</style>
