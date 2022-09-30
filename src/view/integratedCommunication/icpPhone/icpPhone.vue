<!--@author：llp-->
<template>
  <div>
    <nav-bar :selectedName="toName" :navBarList="toNameData" @changTab="changToTab"></nav-bar>
    <nav-bar :selectedName="selectedName" :navBarList="navBarList" @changTab="changTab"></nav-bar>
    <telephone-grouping v-if="selectedName=='政务联络网'"></telephone-grouping>
    <frequent-contacts v-if="selectedName=='常用联系人'"></frequent-contacts>
    <recent-contacts v-if="selectedName=='最近联系人'"></recent-contacts>
    <emergency-address-book v-show="selectedName=='预案联络网'"></emergency-address-book>
    <tel-new v-if="selectedName=='基层联络网'"></tel-new>
    <beiqin-phone v-if="selectedName=='备勤联络网'"></beiqin-phone>
    <!--<video-grouping v-if="selectedName=='视频分组'"></video-grouping>-->
    <!--<terminal-grouping v-if="selectedName=='终端分组'"></terminal-grouping>-->
  </div>
</template>

<script>
  import NavBar from '../../../components/menu/navBar';
  import TelephoneGrouping from '@/view/integratedCommunication/icpPhone/telephoneGrouping';
  import TableButtonGroup from '@/components/button/tableButtonGroup';
  import FrequentContacts from '@/view/integratedCommunication/icpPhone/frequentContacts';
  import RecentContacts from '@/view/integratedCommunication/icpPhone/recentContacts';
  import EmergencyAddressBook from '@/view/integratedCommunication/icpPhone/emergencyAddressBook';
  import VideoGrouping from '@/view/integratedCommunication/icpPhone/videoGrouping';
  import TerminalGrouping from '@/view/integratedCommunication/icpPhone/terminalGrouping';
  import telNew from '@/view/integratedCommunication/icpPhone/teleGroupingNew';
  import beiqinPhone from '@/view/integratedCommunication/icpPhone/beiqinPhone';
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
        selectedName: '政务联络网',//导航默认选中
        navBarList: [
          {
            name: '政务联络网'
          }, {
            name: '常用联系人'
          }, {
            name: '最近联系人'
          }, {
            name: '预案联络网'
          },
          {
            name: "基层联络网",
          },{
            name: "备勤联络网",
          }
        ],//导航条模块
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
    methods: {
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
      changTab(tabName) {
        return this.selectedName = tabName;
      }
    }
  };
</script>

<style scoped>


</style>
