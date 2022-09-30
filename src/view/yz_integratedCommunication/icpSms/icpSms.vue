<!--@author：llp-->
<template>
  <div>
    <nav-bar :selectedName="toName" :navBarList="toNameData" @changTab="changToTab"></nav-bar>
    <nav-bar ref="NavBar" :selectedName="selectedName" :navBarList="navBarList" class="narBar"
             @changTab="changTab"></nav-bar>
    <information-transmission ref="InformationTransmission" v-if="selectedName=='信息发送'"></information-transmission>
    <pending-information v-if="selectedName=='待发信息'" @editMsg="editMsg"></pending-information>
    <urgent-information v-if="selectedName=='催报信息'" @editUrgentMsg="editUrgentMsg"></urgent-information>
  </div>
</template>
<script>
  import NavBar from '@/yz_components/menu/navBar';
  import InformationTransmission
    from '@/view/yz_integratedCommunication/icpSms/informationTransmission/informationTransmission';
  import PendingInformation from '@/view/yz_integratedCommunication/icpSms/pendingInformation/pendingInformation';
  import UrgentInformation from '@/view/yz_integratedCommunication/icpSms/urgentInformation/urgentInformation';

  export default {
    name: 'icpSms',
    components: {
      UrgentInformation,
      PendingInformation,
      InformationTransmission,
      'nav-bar': NavBar
    },
    data() {
      return {
        selectedName: '信息发送',//默认选中导航条
        navBarList: [
          {
            name: '信息发送'
          }, {
            name: '待发信息'
          }, {
            name: '催报信息'
          }],//导航条模块
        toName: '短信',
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
    watch: {
      selectedName() {
        return this.selectedName;
      }
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
      },
      //短信修改方法
      editMsg(row) {
        this.$nextTick(() => {
          this.selectedName = '信息发送';
          this.$refs.NavBar.activeName = '信息发送';
          setTimeout(() => {
            this.$refs.InformationTransmission.editMsg(row);
          }, 1000);
        });
      },
      editUrgentMsg(row) {
        this.$nextTick(() => {
          this.selectedName = '信息发送';
          this.$refs.NavBar.activeName = '信息发送';
          setTimeout(() => {
            this.$refs.InformationTransmission.editUrgentMsg(row);
          }, 1000);
        });
      }
    }
  };
</script>

<style scoped>

</style>
