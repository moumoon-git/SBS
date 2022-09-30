<template>
  <div>
    <nav-bar style="background-color: #F9FBFF;"  ref="navBar" :selectedName="selectedName" :navBarList="navBarList" class="narBar"
             @changTab="changTab" ></nav-bar>
    <municipalWater ref="energySupply" v-if="selectedName=='城市用水'"></municipalWater>
    <energySupply ref="householdWaste" v-if="selectedName=='能源供应'"></energySupply>
    <householdWaste ref="municipalWater" v-if="selectedName=='生活垃圾'"></householdWaste>
    <sedimentTransport ref="sedimentTransport" v-if="selectedName=='渣土运输'"></sedimentTransport>
  </div>
</template>

<script>
  import navBar from "@/yz_History/components/navBar"
  import energySupply from './energySupply'
  import householdWaste from './householdWaste'
  import municipalWater from './municipalWater'
  import sedimentTransport from './sedimentTransport'
  export default {
    name: "cityOperation",
    components:{
      navBar,
      energySupply,   //能源供应
      householdWaste, //家庭垃圾
      municipalWater, //城市用水
      sedimentTransport //渣土运输
    },
    data(){
      return{
        selectedName: "城市用水",   //默认选中导航条
        navBarList: [
          {
            name: "城市用水"
          },{
            name: "能源供应"
          },{
            name: "生活垃圾"
          }, {
            name: "渣土运输"
          },
        ],//导航条模块
      }
    },
    methods:{
      changTab(tabName) {
        this.selectedName=tabName;
      },
    }
  }
</script>

<style scoped>
  >>>.el-tabs__nav-scroll{
    margin: 0;
  }
</style>
