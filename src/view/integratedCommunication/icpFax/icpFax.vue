<!--@author：llp-->
<template>
  <div>
    <nav-bar :selectedName="toName" :navBarList="toNameData" @changTab="changToTab"></nav-bar>
    <nav-bar :selectedName="selectedName" :navBarList="navBarList" class="narBar" @changTab="changTab"></nav-bar>
    <send-fax v-if="selectedName=='发送传真'"></send-fax>
    <pending-fax v-if="selectedName=='待发传真'"></pending-fax>
  </div>
</template>

<script>
  import NavBar from "../../../components/menu/navBar";
  import SendFax from "@/view/integratedCommunication/icpFax/sendFax/sendFax";
  import PendingFax from "@/view/integratedCommunication/icpFax/pendingFax/pendingFax";

  export default {
    name: "icpFax",
    components: {
      PendingFax,
      SendFax,
      "nav-bar": NavBar
    },
    data() {
      return {
        selectedName: "发送传真",//默认选中导航条
        navBarList: [
          {
            name: "发送传真"
          }, {
            name: "待发传真"
          }
          ],//导航条模块
        toName: '传真',
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
      //改变导航栏的tab值
      changTab(tabName) {
        return this.selectedName = tabName;
      },
    }
  }
</script>

<style scoped>

</style>
