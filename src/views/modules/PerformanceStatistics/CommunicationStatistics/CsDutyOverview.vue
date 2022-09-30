<template>
  <div
    v-loading="staticsLoading"
    element-loading-spinner="sv-loading"
    class="statics_detail"
  >
    <div class="left_detail">
      <div>
        <canvas id="phoneCanvas" />
      </div>
      <div class="left_bottom">
        <div class="bottom_span">
          <span class="span_td">呼入总数</span>
          <span>{{ phoneData.incomingCount }}</span>
        </div>
        <span class="span_line" />
        <div class="bottom_span">
          <span class="span_td">呼出总数</span>
          <span />{{ phoneData.exhaleCount }}
        </div>
      </div>
    </div>
    <div class="table_height">
      <table
        class="table_css"
        cellpadding="8"
      >
        <tr class="table_tr">
          <th class="th_left">
            已接听
          </th>
          <th class="th_right">
            {{ phoneData.answeredCount }}
          </th>
        </tr>
        <tr class="table_tr">
          <th class="th_left">
            未接听
          </th>
          <th class="th_right">
            {{ phoneData.missedCount }}
          </th>
        </tr>
        <tr class="table_tr">
          <th class="th_left">
            接听率
          </th>
          <th class="th_right">
            {{ parseFloat(phoneData.answeredPercent).toFixed(2) * 100 }}%
          </th>
        </tr>
        <tr class="table_tr">
          <th class="th_left">
            平均响应时间
          </th>
          <th class="th_right">
            {{ parseFloat(phoneData.avgTimeCount).toFixed(2) }}s
          </th>
        </tr>
        <tr class="table_tr">
          <th class="th_left">
            -
          </th>
          <th class="th_right">
            -
          </th>
        </tr>
        <tr class="table_tr">
          <th class="th_left">
            -
          </th>
          <th class="th_right">
            -
          </th>
        </tr>
      </table>
    </div>
    <span class="span_line" />
    <div class="right_detail">
      <div>
        <canvas id="smsCanvas" />
      </div>
      <div class="right_bottom">
        <div class="bottom_span">
          <span class="span_td">发送人数</span>
          <span>{{ smsData.sendersCount }}</span>
        </div>
        <span class="span_line" />
        <div class="bottom_span">
          <span class="span_td">回复次数</span>
          <span />{{ smsData.replyCount }}
        </div>
      </div>
    </div>
    <div class="table_height">
      <table
        class="table_css"
        cellpadding="8"
      >
        <tr
          v-for="(item,index) in smsData.list"
          :key="index"
          class="table_tr"
        >
          <th class="th_left">
            {{ item.typeString }}/占比
          </th>
          <th class="th_right">
            {{ item.typeCount }} /
            {{ parseFloat(item.typeCountPercent * 100).toFixed(2) }}%
          </th>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import circleUrl from './Image/circle.svg';
import mainUrl from './Image/main.svg';
import mainRightUrl from './Image/main-right.svg';

export default {
  props: {
    phoneData: {
      type: Object,
      required: true,
    },
    smsData: {
      type: Object,
      required: true,
    },
    staticsLoading: {
      type: Boolean,
      default: false,
    },

  },
  mounted() {
    this.drawSms();
    this.drawPhone();
  },
  methods: {
    /**
     * @description: 电话总量的统计图,使用canvas逐帧渲染，并通过控制透明度来达到呼吸灯的效果
     * @param {*}
     * @return {*}
     */
    drawPhone() {
      const that = this;
      const canvas = document.getElementById('phoneCanvas');
      const ctx = canvas.getContext('2d');

      const canvasWidth = 200;
      const canvasHeight = 200;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const circleImg = new Image();
      circleImg.src = circleUrl;
      const mainImg = new Image();
      mainImg.src = mainUrl;
      let alp = 1;
      let lighter = false;
      const render = () => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(circleImg, 0, 0, canvasWidth, canvasHeight);
        ctx.globalAlpha = alp;
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.rotate(Math.PI / 180);
        ctx.drawImage(
          mainImg,
          -canvasWidth / 2 + 20,
          -canvasHeight / 2 + 15,
          160,
          160,
        );
        ctx.restore();
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.rotate((180 * Math.PI) / 180);
        ctx.drawImage(
          mainImg,
          -canvasWidth / 2 + 20,
          -canvasHeight / 2 + 10,
          160,
          160,
        );
        ctx.restore();
        ctx.globalAlpha = 1;
        ctx.font = '500 50px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(that.phoneData.phoneCount, 100, 100);
        ctx.font = '500 16px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText('电话总量', 100, 130);
        if (alp <= 1 && alp >= 0) {
          requestAnimationFrame(render);
          if (lighter) {
            if (alp + 0.005 > 1) {
              lighter = !lighter;
            } else {
              (alp += 0.005);
            }
          }
          if (!lighter) {
            if (alp - 0.005 < 0.2) {
              lighter = !lighter;
            } else {
              alp -= 0.005;
            }
          }
        }
      };
      mainImg.onload = () => {
        requestAnimationFrame(render);
      };
    },
    /**
     * @description: 短信总量的统计图
     * @param {*}
     * @return {*}
     */
    drawSms() {
      const that = this;
      const canvas = document.getElementById('smsCanvas');
      const ctx = canvas.getContext('2d');
      const canvasWidth = 200;
      const canvasHeight = 200;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const circleImg = new Image();
      circleImg.src = circleUrl;
      const mainImg = new Image();
      mainImg.src = mainRightUrl;
      let alp = 1;
      let lighter = false;
      const render = () => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(circleImg, 0, 0, canvasWidth, canvasHeight);
        ctx.globalAlpha = alp;
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.rotate(Math.PI / 180);
        ctx.drawImage(
          mainImg,
          -canvasWidth / 2 + 20,
          -canvasHeight / 2 + 15,
          160,
          160,
        );
        ctx.restore();
        ctx.save();
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.rotate((180 * Math.PI) / 180);
        ctx.drawImage(
          mainImg,
          -canvasWidth / 2 + 20,
          -canvasHeight / 2 + 10,
          160,
          160,
        );
        ctx.restore();
        ctx.globalAlpha = 1;
        ctx.font = '500 50px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(that.smsData.messageCount, 100, 100);
        ctx.font = '500 16px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText('短信总量', 100, 130);
        if (alp <= 1 && alp >= 0) {
          requestAnimationFrame(render);
          if (lighter) {
            if (alp + 0.005 > 1) {
              lighter = !lighter;
            } else {
              (alp += 0.005);
            }
          }
          if (!lighter) {
            if (alp - 0.005 < 0.2) {
              lighter = !lighter;
            } else {
              alp -= 0.005;
            }
          }
        }
      };
      mainImg.onload = () => {
        requestAnimationFrame(render);
      };
    },
  },
};

</script>
<style lang="scss" scoped>
 .statics_detail {
        display: flex;
        justify-content: space-around;
        padding: 5px;
        .left_detail{
          display: flex;
          flex-direction: column;
          .left_bottom{
             padding:10px;
             display: flex;
             .bottom_span{
               white-space: nowrap;
               color:#555555;
               .span_td{
                 color:#999999;
                 margin-right:5px;
               }
             }
            .span_line {
              display: block;
              width: 2px;
              height: 25px;
              margin: 0px 8px;
              background-color: rgba(0, 0, 0, 0.05);
            }
          }
        }
        .span_line {
          display: block;
          width: 2px;
          height: 150px;
          margin: 40px 50px;
          background-color: rgba(0, 0, 0, 0.05);
        }
        .right_detail{
          display: flex;
          flex-direction: column;
          .right_bottom{
             padding:10px;
             display: flex;
             .bottom_span{
               white-space: nowrap;
               color:#555555;
               .span_td{
                 color:#999999;
                 margin-right:5px;
               }
             }
            .span_line {
              display: block;
              width: 2px;
              height: 25px;
              margin: 0px 8px;
              background-color: rgba(0, 0, 0, 0.05);
            }
          }
        }
        .table_height{
          height:230px;
          display: block;
          overflow-y: auto;
          &::-webkit-scrollbar {
            background: transparent;
            width: 5px;
            height:5px;
          }
          &::-webkit-scrollbar-thumb {
            background: #d5d5d5;
            border-radius: 5px;
          }
        .table_css{
          border:1px solid #f2f2f2;
          .table_tr{
            border-bottom:1px solid #f2f2f2;
            color:#333333;
            .th_left{
              font-weight: 400;
            border-right:1px solid #f2f2f2;
            color:#666666;
            background-color: #F9FBFF;
            }
            .th_right{
              min-width:90px;
              font-weight: 400;
            }
          }
        }
        }
      }
</style>
