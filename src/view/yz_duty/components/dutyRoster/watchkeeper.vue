<!--
 * @Author: your name
 * @Date: 2021-05-28 09:35:28
 * @LastEditTime: 2021-08-19 16:38:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \YZSchedule\vuexTest\src\view\components\dutyRoster\watchkeeper.vue
-->
<template>
  <div class="out">
    <div class="interval">{{ start }}——{{ end }}</div>
    <!-- 小于6人 -->
    <div class="list" v-if="temArr.length<6">
      <div class="leader" v-for="(item, i) in firstArr" :key="i">
        <div class="cardTop">
          <div class="leaderPost">{{ item.post }}</div>
          <div class="leaderName">{{ item.name }}</div>
          <div class="leaderMobileNum">{{ item.mobile }}</div>
          <div class="leaderOfficeNum">{{ item.officeTel }}</div>
        </div>
      </div>
      <ul class="card" v-if="lastArr.length>3">
        <li v-for="(item, index) in lastArr" :key="index">
          <div class="post">{{ item.post }}</div>
          <div class="name">{{ item.name }}</div>
          <div class="mobileNum">{{ item.mobile }}</div>
          <div class="officeNum">{{ item.officeTel }}</div>
        </li>
      </ul>
      <ul class="cardList" v-else>
        <li v-for="(item, index) in lastArr" :key="index">
          <div class="cardPost">{{ item.post }}</div>
          <div class="cardName">{{ item.name }}</div>
          <div class="cardMobileNum">{{ item.mobile }}</div>
          <div class="cardOfficeNum">{{ item.officeTel }}</div>
        </li>
      </ul>
    </div>
    <!-- 等于6人 -->
     <div class="six" v-else-if="temArr.length<7&&temArr.length>5">
      <ul class="card" >
        <li v-for="(item, index) in temArr" :key="index">
          <div class="cardPost">{{ item.post }}</div>
          <div class="cardName">{{ item.name }}</div>
          <div class="cardMobileNum">{{ item.mobile }}</div>
          <div class="cardOfficeNum">{{ item.officeTel }}</div>
        </li>
      </ul>
    </div>
    <!-- 等于7人 -->
    <div class="multi" v-else>
      <ul class="card" >
        <li v-for="(item, index) in temArr" :key="index">
          <div class="post">{{ item.post }}</div>
          <div class="name">{{ item.name }}</div>
          <div class="mobileNum">{{ item.mobile }}</div>
          <div class="officeNum">{{ item.officeTel }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "watchkeeper",
  props: {
    dutyNum: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      temData: {},
      start: "",
      end: "",
      temArr:[],
      firstArr:[],//
      lastArr:[]//除了第一条数据以外的数据
    };
  },
  watch: {
    dutyNum(n, v) {
      if(n){
        this.temData = n;
        this.temArr=this.temData.data;
        console.log(this.temArr.length)
        this.firstArr=this.temArr.slice(0,1)
        this.lastArr=this.temArr.slice(1)
        if( JSON.stringify(this.temData.time) !== '{}'){
          this.start = this.temData.time.start.slice(0, 16);
          this.end = this.temData.time.end.slice(0, 16);
        }
      }
    },
  },
};
</script>

<style scoped>
.interval {
  position: absolute;
  font-size: 28px;
  font-family: YuanHeiTi-Bold, siYuanHeiTi;
  font-weight: 600;
  color: #333333;
  line-height: 66px;
  width: 623px;
  height: 66px;
  background: #f7f7f8;
  border-radius: 33px;
  text-align: center;
  margin: 21px 0px 26px 150px;
  letter-spacing: 3px;
}
.out{
  position: relative;
}
.list{
  position: absolute;
   margin-top: 80px;
}
/* 四个值班员的情况样式 */
.card {
  display: flex;
  margin: 0;
  width: 100%;
  flex-wrap: wrap;
}
.card li {
  background: url(../assets/dutyRoster/section/card.png) no-repeat;
  background-size: 100%;
  width: 308px;
  height: 232px;
  margin: 0 10px 10px 10px;
  position: relative;
}
.card li:nth-child(1) {
  margin-left: 20px;
}

.card li:nth-child(4) {
  margin-left: 20px;
}
.card li:nth-child(5) {
  margin-top: 10px;
}
.card li:nth-child(6) {
  margin-top: 10px;
}
.mobileNum::before {
  content: "";
  display: block;
  background: url(../assets/dutyRoster/section/mobileNum.png) no-repeat;
  background-size: 100%;
  width: 12px;
  height: 24px;
  margin-left:29px;
  margin-right: 12px;
  margin-top: 5px;
}
.mobileNum {
  font-size: 20px;
  font-family: siYuanHeiTi;
  font-weight: 400;
  color: #999999;
  display: flex;
  margin-bottom: 5px;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 108px;
}
.officeNum::before {
  content: "";
  display: block;
  background: url(../assets/dutyRoster/section/officeNum.png) no-repeat;
  background-size: 100%;
  width: 19px;
  height: 16px;
  display: flex;
  margin-left: 25px;
  margin-right: 12px;
  margin-top: 10px;
}
.officeNum {
  display: flex;
  font-size: 20px;
  font-family: siYuanHeiTi;
  font-weight: 400;
  color: #999999;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 140px;
}
.post {
  font-size: 30px;
  font-family: YuanHeiTi-Bold, siYuanHeiTi;
  font-weight: 600;
  color: #333333;
  line-height: 56px;
  text-align: center;
  padding-top: 16px;
}
.name {
  font-size: 25px;
  font-family: siYuanHeiTi;
  font-weight: 400;
  color: #666666;
  text-align: center;
}

.cardTop{
  background: url(../assets/dutyRoster/section/card.png) no-repeat;
  background-size: 100%;
  width: 418px;
  height: 232px;
  margin: 30px 10px 30px 450px;
  position: relative;
}
.leaderMobileNum::before {
  content: "";
  display: block;
  background: url(../assets/dutyRoster/section/mobileNum.png) no-repeat;
  background-size: 100%;
  width: 12px;
  height: 24px;
  margin-left:29px;
  margin-right: 12px;
  margin-top: 5px;
}
.leaderMobileNum {
  font-size: 25px;
  font-family: siYuanHeiTi;
  font-weight: 400;
  color: #999999;
  display: flex;
  margin-bottom: 5px;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 138px;
}
.leaderPost{
  font-size: 40px;
  font-family: YuanHeiTi-Bold, siYuanHeiTi;
  font-weight: 600;
  color: #333333;
  line-height: 56px;
  text-align: center;
  padding-top: 16px;
}
.leaderName {
  font-size: 35px;
  font-family: siYuanHeiTi;
  font-weight: 400;
  color: #666666;
  text-align: center;
}
.leaderOfficeNum::before {
  content: "";
  display: block;
  background: url(../assets/dutyRoster/section/officeNum.png) no-repeat;
  background-size: 100%;
  width: 19px;
  height: 16px;
  display: flex;
  margin-left: 25px;
  margin-right: 12px;
  margin-top: 10px;
}
.leaderOfficeNum{
  display: flex;
  font-size: 25px;
  font-family: siYuanHeiTi;
  font-weight: 400;
  color: #999999;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 190px;
}

/* 三个的情况下 */
.cardList {
  display: flex;
  margin: 0;
  width: 100%;
  flex-wrap: wrap;
}
.cardList li {
  background: url(../assets/dutyRoster/section/card.png) no-repeat;
  background-size: 100%;
  width: 418px;
  height: 232px;
  margin: 0 10px 10px 10px;
  position: relative;
}
.cardList li:nth-child(1) {
  margin-left: 20px;
}

.cardList li:nth-child(4) {
  margin-left: 20px;
  margin-top: 10px;
}
.cardList li:nth-child(5) {
  margin-top: 10px;
}
.cardList li:nth-child(6) {
  margin-top: 10px;
}

.cardPost {
  font-size: 40px;
  font-family: YuanHeiTi-Bold, siYuanHeiTi;
  font-weight: 600;
  color: #333333;
  line-height: 56px;
  text-align: center;
  padding-top: 16px;
}
.cardName {
  font-size: 35px;
  font-family: siYuanHeiTi;
  font-weight: 400;
  color: #666666;
  text-align: center;
} 
.cardMobileNum::before {
  content: "";
  display: block;
  background: url(../assets/dutyRoster/section/mobileNum.png) no-repeat;
  background-size: 100%;
  width: 12px;
  height: 24px;
  margin-left:29px;
  margin-right: 12px;
  margin-top: 5px;
}
.cardMobileNum {
  font-size: 25px;
  font-family: siYuanHeiTi;
  font-weight: 400;
  color: #999999;
  display: flex;
  margin-bottom: 5px;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 138px;
}
.cardOfficeNum::before {
  content: "";
  display: block;
  background: url(../assets/dutyRoster/section/officeNum.png) no-repeat;
  background-size: 100%;
  width: 19px;
  height: 16px;
  display: flex;
  margin-left: 25px;
  margin-right: 12px;
  margin-top: 10px;
}
.cardOfficeNum {
  display: flex;
  font-size: 25px;
  font-family: siYuanHeiTi;
  font-weight: 400;
  color: #999999;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 190px;
}
/* 六人 */
.six{
  position: absolute;
  margin-top: 1.13rem;
}
.six .card {
  display: flex;
  margin: 0;
  width: 100%;
  flex-wrap: wrap;
}
.six .card li {
  background: url(../assets/dutyRoster/section/card.png) no-repeat;
  background-size: 100%;
  width: 418px;
  height: 232px;
  margin: 0 10px 10px 10px;
  position: relative;
}
.six .card li:nth-child(1) {
  margin-left: 20px;
}

.six .card li:nth-child(4) {
  margin-left: 20px;
  margin-top: 10px;
}
.six .card li:nth-child(5) {
  margin-top: 10px;
}
.six .card li:nth-child(6) {
  margin-top: 10px;
}

.six .cardPost {
  font-size: 40px;
  font-family: YuanHeiTi-Bold, siYuanHeiTi;
  font-weight: 600;
  color: #333333;
  line-height: 56px;
  text-align: center;
  padding-top: 16px;
}
.six .cardName {
  font-size: 35px;
  font-family: siYuanHeiTi;
  font-weight: 400;
  color: #666666;
  text-align: center;
} 
.six .cardMobileNum::before {
  content: "";
  display: block;
  background: url(../assets/dutyRoster/section/mobileNum.png) no-repeat;
  background-size: 100%;
  width: 12px;
  height: 24px;
  margin-left:29px;
  margin-right: 12px;
  margin-top: 5px;
}
.six .cardMobileNum {
  font-size: 25px;
  font-family: siYuanHeiTi;
  font-weight: 400;
  color: #999999;
  display: flex;
  margin-bottom: 5px;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 138px;
}
.six .cardOfficeNum::before {
  content: "";
  display: block;
  background: url(../assets/dutyRoster/section/officeNum.png) no-repeat;
  background-size: 100%;
  width: 19px;
  height: 16px;
  display: flex;
  margin-left: 25px;
  margin-right: 12px;
  margin-top: 10px;
}
.six .cardOfficeNum {
  display: flex;
  font-size: 25px;
  font-family: siYuanHeiTi;
  font-weight: 400;
  color: #999999;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 190px;
}
/* 七人 */
.multi{
  position: absolute;
   margin-top:150px;
}
.multi .card {
  display: flex;
  margin: 0;
  width: 100%;
  flex-wrap: wrap;
}
.multi .card li {
  background: url(../assets/dutyRoster/section/card.png) no-repeat;
  background-size: 100%;
  width: 308px;
  height: 232px;
  margin: 0 10px 10px 10px;
  position: relative;
}
.multi .card li:nth-child(1) {
  margin-left: 20px;
}

.multi .card li:nth-child(4) {
  margin-left: 20px;
}
.multi .card li:nth-child(5) {
  margin-top: 10px;
}
.multi .card li:nth-child(6) {
  margin-top: 10px;
}
.multi .card li:nth-child(7) {
  margin-top: 10px;
}
.multi .mobileNum::before {
  content: "";
  display: block;
  background: url(../assets/dutyRoster/section/mobileNum.png) no-repeat;
  background-size: 100%;
  width: 12px;
  height: 24px;
  margin-left:29px;
  margin-right: 12px;
  margin-top: 5px;
}
.multi .mobileNum {
  font-size: 20px;
  font-family: siYuanHeiTi;
  font-weight: 400;
  color: #999999;
  display: flex;
  margin-bottom: 5px;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 108px;
}
.multi .officeNum::before {
  content: "";
  display: block;
  background: url(../assets/dutyRoster/section/officeNum.png) no-repeat;
  background-size: 100%;
  width: 19px;
  height: 16px;
  display: flex;
  margin-left: 25px;
  margin-right: 12px;
  margin-top: 10px;
}
.multi .officeNum {
  display: flex;
  font-size: 20px;
  font-family: siYuanHeiTi;
  font-weight: 400;
  color: #999999;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 140px;
}
.multi .post {
  font-size: 30px;
  font-family: YuanHeiTi-Bold, siYuanHeiTi;
  font-weight: 600;
  color: #333333;
  line-height: 56px;
  text-align: center;
  padding-top: 16px;
}
.multi .name {
  font-size: 25px;
  font-family: siYuanHeiTi;
  font-weight: 400;
  color: #666666;
  text-align: center;
}
</style>