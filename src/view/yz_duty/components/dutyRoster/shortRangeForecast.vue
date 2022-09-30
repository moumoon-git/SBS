
<template>
  <div class="forecastWeather">
    <div class="weatherWrap">
      <img :src="returnImgUrl(currentType)" alt="" />
      <div class="temperature">
        <p>{{ currentWeather.temperature }}°</p>
        <span class="temperatureItem">{{ currentWeather.dayType }}</span>
      </div>
    </div>
    <div
      :class="
        JSON.stringify(alarm) == '{}' ? 'temperatureMargin' : 'temperatureWrap'
      "
    >
      <div class="temperatureInterval">{{ temperature }}</div>
      <div class="windDirection">
        {{ currentWeather.windDirection }}{{ currentWeather.windPower }}
      </div>
    </div>
    <div
      v-show="JSON.stringify(alarm) !== '{}'"
      class="alarmPro"
      :style="activation(alarm.alarmText)"
    >
      {{alarm.alarmText}}
    </div>
  </div>
</template>

<script>
export default {
  name: "shortRangeForecast.vue",
  props: {
    nowWe: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      currentWeather: "", //当前天气
      alarm: "", //预警信息
      temperature: "", //今天温度区间
      currentType: "",
    };
  },
  watch: {
    nowWe(Val) {
      this.currentWeather = Val.today;
      let highTemperature = this.currentWeather.high;
      let lowTemperature = this.currentWeather.low;
      this.temperature =
        lowTemperature.slice(3, lowTemperature.lastIndexOf("℃")) +
        "~" +
        highTemperature.slice(3, highTemperature.lastIndexOf("℃")) +
        "°";
      this.currentType = this.currentWeather.dayType;
      this.alarm = Val.alarm;
    },
    // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法，如果设置了false，那么效果和上边例子一样
    immediate: true,
    deep: true,
  },
  computed: {
    activation() {
      return (icontent) => {
        // 使用JavaScript闭包，进行传值操作
       if(icontent){
          if (icontent.includes("黄色")) {
          return { backgroundColor: "#F2B626" };
        } else if (icontent.includes("红色")) {
          return { backgroundColor: "#F66E6E" };
        } else if (icontent.includes("橙色")) {
          return { backgroundColor: "#F18364" };
        } else if (icontent.includes("蓝色")) {
          return { backgroundColor: "#0091FF" };
        }else{
          return { backgroundColor: "#CCCCCC" };
        }
       }else{
         return
       }
       
      };
    },
  },
  methods: {
    // 根据天气类型，赋予图片绝对路径
    returnImgUrl(type) {
      let tempUrl = ``;
      switch (type) {
        case "晴":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/晴.png`);
          break;
        case "多云":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/多云.png`);
          break;
        case "大雨":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/大雨.png`);
          break;
        case "暴雪":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/暴雪.png`);
          break;

        case "暴雨":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/暴雨.png`);
          break;
        case "大暴雨":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/大暴雨.png`);
          break;
        case "大雪":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/大雪.png`);
          break;
        case "冻雨":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/冻雨.png`);
          break;

        case "浮尘":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/浮尘.png`);
          break;
        case "雷阵雨":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/雷阵雨.png`);
          break;
        case "雷阵雨及伴有冰雹":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/雷阵雨及伴有冰雹.png`);
          break;
        case "霾":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/霾.png`);
          break;
        case "强沙尘暴":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/强沙尘暴.png`);
          break;
        case "沙尘暴":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/沙尘暴.png`);
          break;
        case "特大暴雨":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/特大暴雨.png`);
          break;
        case "小雪":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/小雪.png`);
          break;

        case "小雨":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/小雨.png`);
          break;
        case "扬沙":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/扬沙.png`);
          break;
        case "阴":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/阴天.png`);
          break;
        case "雨夹雪":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/雨夹雪.png`);
          break;
        case "阵雪":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/阵雪.png`);
          break;
        case "阵雨":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/阵雨.png`);
          break;
        case "中雪":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/中雪.png`);
          break;
        case "中雨":
          tempUrl = require(`../assets/dutyRoster/weather/topImg/中雨.png`);
          break;
        case "雾":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/雾.png`);
          break;
        default:
          //  tempUrl =  require(`../assets/dutyRoster/weather/topImg/阴天.png`);
          break;
      }
      return tempUrl;
    },
  },
};
</script>

<style scoped>
.weatherWrap {
  display: flex;
  margin-top: -17px;
  margin-bottom: 13px;
  justify-content: center;
}
.weatherWrap > img {
  display: block;
  margin-left: 33px;
  width: 77px;
  height: 57px;
  margin-top: 43px;
  margin-right: 17px;
}
.temperature {
  display: flex;
  justify-content: center;
}
.temperature > p {
  font-size: 80px;
  font-family: DIN-Medium, DIN;
  font-weight: 500;
  color: #333333;
  line-height: 112px;
  margin: 0 auto;
  padding-top: 17px;
  margin-right: 3px;
}
.temperatureItem {
  font-size: 36px;
  font-family: siYuanHeiTi;
  font-weight: 400;
  color: #666666;
  line-height: 50px;
  display: inline-block;
  padding-top: 50px;
}
.temperatureWrap {
  font-size: 30px;
  font-family: YuanHeiTi-Bold, siYuanHeiTi;
  font-weight: 600;
  color: #ffffff;
  line-height: 42px;
  display: flex;
}
.temperatureMargin {
  font-size: 30px;
  font-family: YuanHeiTi-Bold, siYuanHeiTi;
  font-weight: 600;
  color: #ffffff;
  line-height: 42px;
  display: flex;
  margin-bottom:45px;
  justify-content: center;
}

.temperatureInterval {
  margin-left: 53px;
  margin-right:41px;
  opacity: 0.8;
  font-family: DIN;
  font-weight: 600;
  color: #999999;
}
.windDirection {
  opacity: 0.8;
  font-family: siYuanHeiTi;
  font-weight: 600;
  color: #999999;
}
.alarmPro {
  height: 50px;
  background: #ea7453;
  border-radius: 5px;
  font-size: 30px;
  font-family: siYuanHeiTi;
  font-weight: 400;
  color: #ffffff;
  line-height: 50px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  margin-bottom: 38px;
  width:fit-content;
  width:-webkit-fit-content;
  width:-moz-fit-content;
  padding: 0 10px;
}
.forecastWeather::before {
  content: "";
  display: block;
  /* width: 524px; */
  height: 1px;
  background: #2f61b1;
  opacity: 0.19;
}

.weatherDetails > ul {
  margin: 0 auto;
}
.futureTime {
  margin-left: 36px;
}
</style>