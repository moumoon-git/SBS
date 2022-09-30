
<template>
  <div class="list">
    <ul class="detailData">
      <li v-for="(item, index) in communicateData" :key="index">
        <div class="num">
          <div v-if="item.name == '待处置电话'" class="msg">
            <img src="../assets/dutyRoster/footer/mobile.png" alt="" />
            <div class="missedCall">{{ item.count }}</div>
          </div>
          <div v-else-if="item.name == '待处置短信'" class="msg">
            <img src="../assets/dutyRoster/footer/message.png" alt="" />
            <div class="missedMsg">{{ item.count }}</div>
          </div>
          <div v-else class="msg">
            <img src="../assets/dutyRoster/footer/fax.png" alt="" />
            <div class="missedFax">{{ item.count }}</div>
          </div>
          <div class="detailMessage">{{ item.name }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>


<script>
export default {
  name: "message",
  props: ["communicateData"],
  data() {
    return {};
  },

  mounted() {
    this.$forceUpdate();
  },
};
</script>

<style scoped>
.list {
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 350px;
}
.detailData {
  display: flex;
}

.detailData > li:first-child > div {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: -290px;
  margin-left: 240px;
}
.detailData > li:first-child .detailMessage {
  width: 144px;
  margin-left: -16px;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 158px;
  margin-left: -48px;
}
.detailData > li:first-child > div .msg > img {
  width: 144px;
  height: 144px;
  position: absolute;
  top: 0;
  left: 0;
  margin-left:-220px;
  margin-top: 65px;
}
.detailData > li:nth-child(2) > div {
  position: absolute;
  top: 0;
  left: 0;
  margin-top: -290px;
  margin-left: 570px;
}
.detailData > li:nth-child(2) .detailMessage {
  width: 144px;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 158px;
  margin-left: -15px;
}
.detailData > li:nth-child(2) > div .msg > img {
  width: 144px;
  height: 144px;
  position: absolute;
  top: 0;
  left: 0;
  margin-left: -190px;
  margin-top:60px;
}

.detailData > li:nth-child(3) > div {
  position: absolute;
  top: 0;
  left: 0;
  margin-top: -290px;
  margin-left: 917px;
}
.detailData > li:nth-child(3) > div .msg > img {
  width: 144px;
  height: 144px;
  position: absolute;
  top: 0;
  left: 0;
  margin-left: -180px;
  margin-top:60px;
}
.dutyData > ul {
  position: relative;
}
.detailData > li:nth-child(3) .detailMessage {
  width: 144px;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 158px;
  margin-left: -25px;
}
.missedCall {
  font-size: 70px;
  font-family: DIN-Bold, DIN;
  font-weight: bold;
  color: #333333;
  line-height: 97px;
  position: absolute;
  top: 0;
  left: 0;
  margin-top:60px;
  margin-left: -50px;
}
.missedMsg {
  font-size: 70px;
  font-family: DIN-Bold, DIN;
  font-weight: bold;
  color: #333333;
  line-height: 97px;
  position: absolute;
  top: 0;
  left: 0;
  margin-top:60px;
  margin-left: -18px;
}
.missedFax {
  font-size: 70px;
  font-family: DIN-Bold, DIN;
  font-weight: bold;
  color: #333333;
  line-height: 97px;
  position: absolute;
  top: 0;
  left: 0;
  margin-top:60px;
  margin-left: -14px;
}
.detailMessage {
  font-size: 28px;
  font-family: siYuanHeiTi;
  font-weight: 400;
  color: #999999;
  line-height: 50px;
}
</style>