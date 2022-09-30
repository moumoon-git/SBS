<!--
 * @Author: your name
 * @Date: 2021-08-19 13:48:02
 * @LastEditTime: 2021-08-20 11:24:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-nanhai\src\view\yz_duty\dutyRoster.vue
-->
<template>
  <el-container>
    <div class="content">
      <el-header>
        <el-col :span="12">
          <div class="navsBar">
            <div class="title">{{ currentDate }}{{platformTitle}}</div>
          </div>
        </el-col>
      </el-header>

      <el-main class="main">
        <div class="contentStyle">
          <el-row class="row">
            <el-col :span="15" class="colCalss">
              <el-card class="section">
                <watchkeeper :dutyNum="dutyNum"></watchkeeper>
              </el-card>
              <!-- 待处理信息 -->
              <el-card class="footer">
                <div class="tips">{{ pendingMessage }}</div>
                <information :communicateData="communicateData"></information>
              </el-card>
            </el-col>

            <el-col :span="9" class="colCalss">
              <el-card class="box-card cardCalss cards" shadow="hover">
                <div style="width: 100%">
                  <!-- 今日时间 -->
                  <div class="forecastTime">
                    <p class="forecastBlock">{{ currentTime }}</p>
                    <div class="forecastMonthly">
                      <div class="forecastWrap">{{ currentDate }}</div>
                      <div class="forecastItem">{{ day }}</div>
                    </div>
                    <shortRangeForecast :nowWe="nowWe"></shortRangeForecast>
                  </div>
                  <!-- 今日天气 -->

                  <!-- 七天天气 -->
                  <div class="weatherDetails">
                    <weatherDetails
                      :forecastData="forecastData"
                    ></weatherDetails>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-main>
    </div>
  </el-container>
</template>

<script>
import watchkeeper from "./components/dutyRoster/watchkeeper";
import shortRangeForecast from "./components/dutyRoster/shortRangeForecast.vue";
import weatherDetails from "./components/dutyRoster/weatherDetails.vue";
import information from "./components/dutyRoster/information.vue";
import connectWebsocket from "./components/utils/websocket/websocket";
import "./components/assets/fonts/font.css";
export default {
  name: "dutyRoster",
  data() {
    return {
      pendingMessage: "待处理信息",
      currentTime: "", //当前时间
      currentDate: "", //当前日期
      dutyData: [],
      //处理数据
      weatherData: [],
      rootUrl: "",
      day: "",
      nowWe: {},
      forecastData: [],
      communicateData: [],
      operatorData: [],
      dutyNum: {},
    };
  },
  components: {
    weatherDetails,
    shortRangeForecast,
    information,
    watchkeeper,
  },
  computed: {
    platformTitle() {
      return this.$store.state.user.platformTitle || this.$cookie.get('platformTitle');
    },
  },
  mounted() {
    this.currentTimes();
    this.getWeather();
    this.getCommunication();
    this.getDuty();
    connectWebsocket.connect((res) => {
      if (res && JSON.parse(res.body).cmd.SubCmd == "136") {
        this.getCommunication();
      }
    });
  },
  methods: {
    currentTimes() {
      setInterval(this.getCurrentTime, 500);
      setInterval(this.getDuty, 60000);
      setInterval(this.getCommunication,60000);
    },
    webSocketCallback(m) {
      console.log(m);
    },
    //获取当前时间
    getCurrentTime() {
      let tempDate = new Date(); // "Mon Sep 30 2019 20:51:28 GMT+0800 (中国标准时间)"
      let tempTimeStr24 = tempDate.toLocaleTimeString("chinese", {
        hour12: false,
      }); // "20:51:28"
      this.currentTime = tempTimeStr24.slice(0, tempTimeStr24.lastIndexOf(":"));
      this.currentDate =
        tempDate.getFullYear() +
        "年" +
        (tempDate.getMonth() + 1) +
        "月" +
        tempDate.getDate() +
        "日";
      let days = tempDate.getDay();
      switch (days) {
        case 1:
          this.day = "周一";
          break;

        case 2:
          this.day = "周二";
          break;

        case 3:
          this.day = "周三";
          break;

        case 4:
          this.day = "周四";
          break;

        case 5:
          this.day = "周五";
          break;

        case 6:
          this.day = "周六";
          break;

        case 0:
          this.day = "周日";
          break;
      }
    },
    /**
     * @description: 获取天气
     * @param {*}
     * @return {*}
     * @author: qcx
     * @Date: 2021-05-18 16:08:45
     */
    getWeather() {
      this.$api.getWeather("").then((res) => {
        this.nowWe = res.data;
        this.forecastData = this.nowWe.weather;
        //第六，七天为虚拟数据
        let arr = this.nowWe.weather;
        let str = {};
        let tempStr={};
        let dateInfo;
        for (let i = 0; i < arr.length; i++) {
          if (i > 2&&i<4) {
            dateInfo = this.getNextDay(arr[i].date);
            let temp=this.changeTemperature(arr[i].high,arr[i].low)
            str = {
              date: dateInfo,
              dayType: arr[i].dayType,
              high:temp.highTemp,
              low: temp.lowTmep,
              nightType: arr[i].nightType,
            };
          }
          if(i>3){
            dateInfo = this.getNextDay(arr[i].date);
            let highTem=this.changeTemperature(arr[i].high,arr[i].low)
            tempStr = {
              date: dateInfo,
              dayType: arr[i].dayType,
              high: highTem.highTemp,
              low: highTem.lowTmep,
              nightType: arr[i].nightType,
            };
          }
        }
        this.forecastData.push(str,tempStr);
      });
    },
    /**
     * @description: 获取给定时间的后一天
     * @param {*}nextDay:时间参数
     * @return {*}yyyy-MM-dd格式
     * @author: qcx
     * @Date: 2021-05-20 10:08:36
     */
    getNextDay(nextDay) {
      let str = new Date(parseInt(nextDay.slice(0, 3)));
      let newTime = new Date(
        new Date(
          new Date().formatDate("yyyy-MM") + "-" + str.getTime()
        ).getTime() +
          24 * 60 * 60 * 1000+24*60*60*1000
      ); //yyyy-MM-DD
      let getNewData = this.getNewWeek(newTime.formatDate("yyyy-MM-dd"));
      newTime = newTime.getDate();
      return newTime + "日" + getNewData;
    },
    /**
     * @description: 获取指定日期是周几
     * @param {*} dateString:星期数
     * @return {*}
     * @author: qcx
     * @Date: 2021-05-20 10:08:36
     */
    getNewWeek(dateString) {
      let dateArray = dateString.split("-");
      let str1 = new Date(
        dateArray[0],
        parseInt(dateArray[1] - 1),
        dateArray[2]
      );
      return "星期" + "日一二三四五六".charAt(str1.getDay());
    },

    /**
     * @description: 获取统计数据
     * @param {*}
     * @return {*}
     * @author: qcx
     * @Date: 2021-05-18 20:55:44
     */
    getCommunication() {
      this.$api.getCommunication("").then((res) => {
        this.communicateData = res.data;
        console.log( this.communicateData,"统计信息")
      });
    },
    /**
     * @description: 获取值班人员信息
     * @param {*}
     * @return {*}
     * @author: qcx
     * @Date: 2021-05-20 08:41:05
     */
    getDuty() {
      this.$api.getDuty('').then((res) => {
        let resTemp = res.data;
        console.log(resTemp,"值班人员信息")
        this.dutyNum = resTemp;
      });
    },
    /**
     * @description: 改变天气
     * @param {*}hight:高温天气，low:低温天气
     * @return {*}
     * @author: qcx
     * @Date: 2021-06-10 09:54:10
     */
    changeTemperature(hight,low){
     let highTemperature =`高温 ${Number(hight.slice(3, hight.lastIndexOf("℃")))+1}℃`;
     let lowTemperature =`低温 ${Number(low.slice(3, low.lastIndexOf("℃")))-1}℃`;
     return {highTemp:highTemperature,lowTmep:lowTemperature}
    },

    /**
     * @description:销毁定时器
     * @param {*}
     * @return {*}
     * @author: qcx
     * @Date: 2021-05-21 15:02:59
     */
    beforeDestroy() {
      if (this.getCurrentTime) {
        clearInterval(this.getCurrentTime); // 在Vue实例销毁前，清除时间定时器
      }else if(this.getDuty){
        clearInterval(this.getDuty); // 在Vue实例销毁前，清除时间定时器
      }else if(this.getCommunication){
        clearInterval(this.getCommunication); // 在Vue实例销毁前，清除时间定时器
      }
    },
  },
};
</script>

<style scoped>
.content {
  height: 100vh;
  position: relative;
}
.content >>>.el-main{
  padding-top:15px!important ;
}
.content>>>.el-header{
}
/* 头部标题 */
.navsBar {
  background: url(./components/assets/dutyRoster/header/bg.png) no-repeat;
  background-size: 100%;
  width: 1680px;
  height: 80px;
}
.title {
  font-size: 42px;
  font-family: PangMenZhengDao;
  color: #ffffff;
  line-height: 48px;
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.16);
  text-align: center;
  padding-top: 15px;
  padding-bottom: 20px;
  display: flex;
  justify-content: center;
}
.title::before {
  content: "";
  display: block;
  background: url(./components/assets/dutyRoster/header/headerIcon.png)
    no-repeat;
  background-size: 100%;
  width: 34px;
  height:39px;
  margin-right:17px;
  margin-top: 4px;
}
/* 左侧 */
.row {
  display: flex;
}
.main {
  width: 100%;
}
.section {
  /* width: 1334px; */
  min-height: 623px;
  margin: 0 10px 0 0px;
  background-color: white;
  box-sizing: border-box;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 3px;
}

.tips {
  position: absolute;
  display: flex;
  font-size: 40px;
  font-family: YuanHeiTi-Bold, siYuanHeiTi;
  font-weight: 500;
  color: #333333;
  margin-top: 20px;
}
.tips::before {
  content: "";
  display: block;
  width: 9px;
  height: 42px;
  background: #00b0ff;
  margin-right: 39px;
  margin-top: 9px;
}
.footer {
  position: relative;
  /* width: 1334px; */
  min-height: 3.16rem;
  margin: 22px 10px 0 0px;
  background-color: white;
  box-sizing: border-box;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
  border-radius: 3px;
  height: 33.0%;
}

/* 待处理信息 */

/* 右侧 */
.cardCalss {
  margin: 0 0 0 10px;
  background-color: white;
  box-sizing: border-box;
  border-radius: 3px;
  /* width: 526px; */
  height: 960px;
  box-shadow: 0px 3px 10px 2px rgba(54, 121, 225, 0.09);
}
.cardCalss >>>.el-card__body{
    padding:0px;
}
/* 时间 */
.forecastBlock {
  font-size: 100px;
  font-family: DIN-Bold, DIN;
  font-weight: 600;
  color: #333333;
  line-height: 140px;
  z-index: 5;
  margin: 0;
  text-align: center;
}
.forecastMonthly {
  display: flex;
  margin-bottom: 36px;
  opacity: 0.8;
  justify-content: center;
}
.forecastWrap {
  height: 42px;
  font-size: 30px;
  font-family: YuanHeiTi-Bold, siYuanHeiTi;
  color: #999999;
  font-weight: 600;
  line-height: 42px;
  margin-left: 1.18rem;
}
.forecastItem {
  height: 42px;
  font-size: 30px;
  font-family: YuanHeiTi-Bold, siYuanHeiTi;
  color: #999999;
  font-weight: 600;
  line-height: 42px;
  margin-left: 25px;
}
.forecastTime::after {
  content: "";
  display: block;
  /* width: 524px; */
  height:1px;
  background: #2f61b1;
  opacity: 0.19;
}
.forecastTime {
  width: 100%;
  /* height: 3.41rem; */
  background: url(./components/assets/dutyRoster/section/weatherBg.png)
    no-repeat;
  background-size: 100% 100%;
}
</style>
