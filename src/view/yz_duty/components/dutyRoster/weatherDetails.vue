
<template>
  <ul class="weatherNum">
    <li v-for="(item, index) in forecastData" :key="index">
      <div class="futureTime">{{ item.date | getData }}</div>
      <div class="weatherType">
        <img :src="returnImgUrl(item.dayType)" alt="" />
        <span class="futureIcon">{{ item.dayType }}</span>
      </div>
      <div class="futureTemperature">
        {{ item.high | getTemperature(item.low) }}
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: "weatherDeatails",
  props: ["forecastData"],
  data() {
    return {};
  },
  filters: {
    getData: function (value) {
      value = value.substr(-3, value.lenght);
      return value;
    },
    getTemperature: function (high, low) {
      let highTemperature = high.slice(3, high.lastIndexOf("℃"));
      let LowTemperature = low.slice(3, low.lastIndexOf("℃"));
      return LowTemperature + "/" + highTemperature + "°";
    },
  },

  mounted() {
    this.$forceUpdate();
  },
  methods: {
    // 根据天气类型，赋予图片绝对路径
    returnImgUrl(type) {
      let tempUrl = ``;
      switch (type) {
        case "晴":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/晴.png`);
          break;
        case "多云":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/多云.png`);
          break;
        case "大雨":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/大雨.png`);
          break;
        case "暴雪":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/暴雪.png`);
          break;

        case "暴雨":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/暴雨.png`);
          break;
        case "大暴雨":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/大暴雨.png`);
          break;
        case "大雪":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/大雪.png`);
          break;
        case "冻雨":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/冻雨.png`);
          break;

        case "浮尘":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/浮尘.png`);
          break;
        case "雷阵雨":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/雷阵雨.png`);
          break;
        case "雷阵雨及伴有冰雹":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/雷阵雨及伴有冰雹.png`);
          break;
        case "霾":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/霾.png`);
          break;
        case "强沙尘暴":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/强沙尘暴.png`);
          break;
        case "沙尘暴":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/沙尘暴.png`);
          break;
        case "特大暴雨":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/特大暴雨.png`);
          break;
        case "小雪":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/小雪.png`);
          break;

        case "小雨":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/小雨.png`);
          break;
        case "扬沙":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/扬沙.png`);
          break;
        case "阴":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/阴天.png`);
          break;
        case "雨夹雪":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/雨夹雪.png`);
          break;
        case "阵雪":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/阵雪.png`);
          break;
        case "阵雨":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/阵雨.png`);
          break;
        case "中雪":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/中雪.png`);
          break;
        case "中雨":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/中雨.png`);
          break;
        case "雾":
          tempUrl = require(`../assets/dutyRoster/weather/smallImg/雾.png`);
          break;
        default:
          break;
      }
      return tempUrl;
    },
  },
};
</script>

<style scoped>
.weatherNum {
  margin: 18px 0 0 0;
}
.weatherNum li {
  display: flex;
  font-size: 25px;
  font-family: YuanHeiTi-Bold, siYuanHeiTi;
  font-weight: 500;
  color: #ffffff;
  line-height: 67px;
  position: relative;
}
.futureTime {
  font-family: YuanHeiTi-Bold, siYuanHeiTi;
  margin-left: 36px;
  margin-right: 104px;
  font-weight: 500;
  color: #333333;
}
.futureTemperature {
  position: absolute;
  top: 0;
  right: 0;
  margin-right: 39px;
  font-family: YuanHeiTi-Bold, siYuanHeiTi;
  font-weight: 500;
  color: #666666;
}
.futureIcon {
  font-family: YuanHeiTi-Bold, siYuanHeiTi;
  display: inline-block;
  padding-left: 55px;
  font-weight: 500;
  color: #666666;
}
.weatherType > img {
  /* width: 0.45rem; */
  width: 45px;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 8px;
  margin-left: 212px;
}
</style>