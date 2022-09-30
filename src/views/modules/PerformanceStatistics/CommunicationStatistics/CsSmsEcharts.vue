<template>
  <div class="communication_sms">
    <div class="sms_statics">
      <div class="statics_header">
        <span class="sms_title">短信发送趋势</span>
        <span>
          <sv-select
            v-model="smsManType"
            :options="manOptions"
            placeholder="值班人员"
            @change="getSmsLineByManOrDate()"
          />
          <sv-select
            v-model="smsLineDate"
            :options="lineDateOptions"
            placeholder="请选择时间周期"
            @change="getSmsLineByManOrDate()"
          />
        </span>
      </div>
      <div
        id="smsEchart"
        class="sms_echart"
      />
    </div>
    <div class="smsPie_statics">
      <div class="statics_header">
        <span class="sms_title">短信发送占比</span>
        <span>
          <sv-select
            v-model="pieManType"
            :options="manOptions"
            placeholder="值班人员"
            @change="getSmsPieByDate(pieDateRange)"
          />
          <sv-select
            v-model="dateRange"
            :options="dateOptions"
            placeholder="请选择时间周期"
            @change="getSmsPieByDate()"
          />
          <!-- <sv-button @click="getSmsPieByDate(0)">全部</sv-button>
              <sv-button @click="getSmsPieByDate(7)">近七天</sv-button>
              <sv-button @click="getSmsPieByDate(30)">近30天</sv-button> -->
        </span>
      </div>
      <div
        ref="pie"
        class="sms_pie"
      />
      <div class="pie__right">
        <div class="pie__right__item_title">
          <span>短信类型</span>
          <span style="margin-left: 30px">数量</span>
          <span style="float: right">占比</span>
        </div>
        <div
          v-for="(pieItem, pieIndex) in stat.slice(
            piePageIndex * 5,
            piePageIndex * 5 + 5
          )"
          :key="`pie_item_${pieIndex}`"
          :class="`pie__right__item_${piePageIndex * 5 + pieIndex}`"
          @mouseover="mouseOverElist(pieIndex)"
        >
          {{ pieItem.name }}
          <span style="margin-left: 50px">{{ pieItem.num }}</span>
          <span style="float: right">{{ pieItem.percentage }}%</span>
        </div>
        <div class="pie__right__arrow">
          <div
            :class="{ 'pie__right__arrow-disabled': piePageIndex === 0 }"
            @click="piePageIndex !== 0 ? piePageIndex -= 1 : null"
          />
          <div
            :class="{
              'pie__right__arrow-disabled': piePageIndex === piePageTotal - 1,
            }"
            @click="piePageIndex !== piePageTotal - 1 ? piePageIndex += 1 : null"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts';
import moment from 'moment';

export default {
  props: {
    manOptions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // 短信折线图的人员类型和时间周期
      smsManType: '',
      smsLineDate: '',
      lineDateOptions: [
        {
          value: 1,
          label: '近七天',
        },
        {
          value: 2,
          label: '近30天',
        },
        {
          value: 3,
          label: '近一年',
        },
      ],
      // 记录短信折线图的坐标数据
      smsLineList: [],
      smsY: [],
      smsX: [],
      sumY: 0,
      // 记录饼状图的数据
      pieDataList: '',
      pieStartTime: '',
      pieEndTime: '',
      pieManType: '',
      pieDateRange: 0,
      stat: [],
      currentActive: 0,
      dateRange: '',
      dateOptions: [
        {
          value: 7,
          label: '近七天',
        },
        {
          value: 30,
          label: '近30天',
        },
      ],
      // 饼图右侧数据页码
      piePageIndex: 0,
      // 饼图右侧数据总页数
      piePageTotal: 0,
    };
  },
  mounted() {
    this.getSmsLineByManOrDate();
    this.getSmsPieByDate(0);
  },
  methods: {
    mouseOverElist(pieIndex) {
      this.PieGraph.dispatchAction({ type: 'downplay', seriesIndex: 0 });
      this.PieGraph.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: this.piePageIndex * 5 + pieIndex,
      });
      this.currentActive = this.piePageIndex * 5 + pieIndex;
    },
    /**
     * @description: 根据选择的人员和时间周期展示不同的短信折线图
     * @param {*}
     * @return {*}
     */
    getSmsLineByManOrDate() {
      this.$http({
        url: this.$http.adornUrl('/message/messageDispatch/dispatchBytime'),
        method: 'post',
        data: this.$http.adornData({
          userId: this.smsManType,
          dateType: this.smsLineDate,
        }),
      }).then(({ data }) => {
        if (data.code === 0) {
          // this.smsLineList = data.data.list;
          if (this.smsLineDate === 3) {
            this.smsLineList = data.data.list;
          } else {
            this.smsLineList = data.data.list.reverse();
          }
          this.smsY = this.smsLineList.map((item) => item.messageCount);
          const tempSmsX = [];
          let tempSumY = 0;
          this.smsLineList.forEach((item) => {
            tempSumY += item.messageCount;
            // let tempDate = moment(item.createDate).format('YYYY-MM-DD');
            tempSmsX.push(item.createDate);
          });
          if (this.smsLineDate === 3) {
            this.smsX = tempSmsX.slice(1);
          } else {
            this.smsX = tempSmsX;
          }
          this.sumY = tempSumY;
          this.$nextTick(() => {
            this.getSmsLineEchart();
          });
        } else {
          this.message.error(data.msg);
        }
      });
    },
    /**
     * @description: 短信通讯的折线图
     * @param {*}
     * @return {*}
     */
    getSmsLineEchart() {
      const that = this;
      const smsLineChart = echarts.init(document.getElementById('smsEchart'));
      window.addEventListener('resize', () => {
        smsLineChart.resize();
      });
      // 短信的折线图
      smsLineChart.setOption({
        color: ['#3F92FE'],
        grid: {
          left: '10%',
          right: 40,
          top: '5%',
          bottom: '15%',
        },
        tooltip: {
          trigger: 'axis',
          z: 2,
          axisPointer: {
            lineStyle: {
              color: 'rgba(204, 204, 204, 0.6)',
            },
            z: 1,
          },
          backgroundColor: '#ffffff',
          padding: [5, 15],
          textStyle: {
            color: '#505D6F',
            fontSize: 14,
          },
          extraCssText:
            'box-shadow: 0px 10px 24px 0px rgba(29, 42, 68, 0.12);text-align: center;',
        },
        dataZoom: {
          show: false,
        },
        xAxis: [
          {
            name: '',
            type: 'category',
            boundaryGap: false,
            data: that.smsX,
            axisLine: {
              lineStyle: {
                color: 'RGBA(85,85,85,0.8)',
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: '#666666',
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: '',
            // max: that.sumY,
            min: 0,
            boundaryGap: [0.2, 0.2],
            axisLine: {
              show: false,
              lineStyle: {
                color: 'RGBA(85,85,85,0.8)',
              },
            },

            axisLabel: {
              textStyle: {
                color: '#666666',
                fontSize: 14,
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: 'RGBA(85,85,85,0.2)',
                type: 'dashed',
              },
            },
          },
        ],
        series: [
          {
            name: '短信总量',
            type: 'line',
            smooth: true,
            data: that.smsY,
            itemStyle: {
              normal: {
                color: '#0091FF',
                borderWidth: 1,
              },
              emphasis: {
                borderWidth: 4,
                shadowBlur: 15,
                shadowColor: 'rgba(0, 145, 255, 0.3)',
              },
            },
            lineStyle: {
              normal: {
                color: '#0091FF',
                width: 3,
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgb(63,146,254,0.4)',
                  },
                  {
                    offset: 1,
                    color: 'rgb(63,146,254,0)',
                  },
                ]),
              },
            },
          },
        ],
      });
    },
    /**
     * @description: 根据时间周期获取饼状图的数据
     * @param {*}
     * @return {*}
     */
    getSmsPieByDate() {
      // this.pieDateRange = this.dateRange;
      if (this.dateRange === '') {
        this.pieStartTime = '';
        this.pieEndTime = '';
      } else {
        this.nowDate = moment(this.nowDate).format('YYYY-MM-DD');
        const tempDate = moment(this.nowDate).subtract(this.dateRange, 'd');
        this.pieStartTime = moment(tempDate._d).format('YYYY-MM-DD');
        this.pieEndTime = this.nowDate;
      }

      this.$http({
        url: this.$http.adornUrl('/message/messageDispatch/dispatchList'),
        method: 'post',
        data: this.$http.adornData({
          userId: this.pieManType,
          startTime: this.pieStartTime,
          endTime: this.pieEndTime,
        }),
      }).then(({ data }) => {
        if (data.code === 0) {
          this.stat = [];
          this.piePageIndex = 0;
          this.piePageTotal = Math.ceil(data.data.list.length / 5);
          this.pieDataList = data.data;
          this.pieDataList.list.forEach((item) => {
            this.stat.push({
              num: item.typeCount,
              name: item.typeString,
              percentage: item.typeCountPercent
                ? (100 * item.typeCountPercent).toFixed(2)
                : 0,
            });
          });

          this.$nextTick(() => {
            this.getPieChart();
          });
        } else {
          this.message.error(data.msg);
        }
      });
    },
    /**
     * @description: 短信统计的饼图
     * @param {*}
     * @return {*}
     */
    getPieChart() {
      const PieGraph = echarts.init(this.$refs.pie);
      const colorList = [
        '#54A0FF',
        '#44CC75',
        '#FBC958',
        '#FB7293',
        '#9D96F5',
        '#049DFF',
        '#83D9FF',
        '#A3E547',
        '#FCD75C',
        '#4481EB',
        '#46D0ED',
        '#E4998B',
        '#D143C9',
        '#FEB00A',
        '#FE660A',
      ];
      const seriesData = [];
      this.stat.forEach((item) => {
        seriesData.push({
          value: item.num,
          name: item.name,
        });
      });

      const option = {
        color: colorList,

        series: [
          {
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['60%', '80%'],
            avoidLabelOverlap: false,
            data: seriesData,
            label: {
              normal: {
                show: false,
                position: 'center',
              },
              emphasis: {
                show: true,
                formatter: '{top|{c}}{unit| }\n{btm|{b}}',
                rich: {
                  top: {
                    color: 'auto',
                    fontSize: '26',
                    fontWeight: 'bold',
                  },
                  unit: {
                    color: '#333333',
                    fontSize: '16',
                    fontWeight: 'bold',
                  },
                  btm: {
                    color: 'auto',
                    fontSize: '16',
                  },
                },
              },
            },
            labelLine: {
              show: false,
            },
          },
        ],
      };
      PieGraph.setOption(option);
      // 高亮处理
      this.currentActive = 0;
      PieGraph.dispatchAction({ type: 'downplay', seriesIndex: 0 });
      PieGraph.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: 0,
      });
      PieGraph.on('mouseover', (v) => {
        if (v.dataIndex !== this.currentActive) {
          PieGraph.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: this.currentActive,
          });
        }
        this.currentActive = v.dataIndex;
      });
      PieGraph.on('mouseout', () => {
        PieGraph.dispatchAction({
          type: 'highlight',
          seriesIndex: 0,
          dataIndex: this.currentActive,
        });
      });
      this.PieGraph = PieGraph;
    },
  },
};
</script>
<style lang="scss" scoped>
.communication_sms {
  display: flex;
  width: 100%;
  margin-top: 10px;
  height: 250px;
  border-radius: 4px;
  .sms_statics {
    border-radius: 4px;
    background-color: #fff;
    width: 50%;
    max-width: calc(100% - 555px);
    position: relative;
    box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
    .statics_header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 10px 5px 0px;
      .sms_title {
        border-left: 3px solid rgba(0, 145, 255, 1);
        font-size: 16px;
        display: inline-block;
        height: 16px;
        line-height: 16px;
        padding-left: 10px;
        //position: absolute;
        margin: 5px 0px 0px 5px;
        color: #333333;
        font-weight: 500;
      }
    }
    .sms_echart {
      position: absolute;
      top: 20%;
      left: 0%;
      width: 100%;
      height: 80%;
    }
  }
  .smsPie_statics {
    border-radius: 4px;
    background-color: #fff;
    width: 50%;
    min-width: 545px;
    position: relative;
    margin-left: 10px;
    box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
    .statics_header {
      display: flex;
      justify-content: space-between;
      padding: 10px 5px 0px;
      .sms_title {
        border-left: 3px solid rgba(0, 145, 255, 1);
        font-size: 16px;
        display: inline-block;
        height: 16px;
        line-height: 16px;
        padding-left: 10px;
        //position: absolute;
        margin: 5px 0px 0px 5px;
        color: #333333;
        font-weight: 500;
      }
    }
    .sms_pie {
      display: inline-block;
      position: absolute;
      top: 20%;
      left: 0px;
      width: 50%;
      height: 80%;
    }
    .pie__right {
      width: 200px;
      height: 180px;
      position: absolute;
      right: 70px;
      bottom: 10px;
      &__item_title {
        color: #333333;
        font-weight: bold;
      }
      $colorList: #54a0ff, #44cc75, #fbc958, #fb7293, #9d96f5, #83d9ff, #a3e547,
        #fcd75c, #4481eb, #46d0ed, #e4998b, #d143c9, #feb00a, #fe660a;
      @for $i from 0 through 13 {
        &__item_#{$i} {
          margin: 0 0 10px 15px;
          position: relative;
          font-size: 14px;
          color: #666666;
          cursor: pointer;
          &::before {
            content: "";
            background: nth($colorList, $i + 1);
            display: block;
            width: 10px;
            height: 10px;
            border-radius: 6px;
            position: absolute;
            left: -15px;
            top: 8px;
          }
        }
        // 箭头
        &__arrow {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          font-size: 0;
          & > div {
            display: inline-block;
            width: 15px;
            height: 15px;
            cursor: pointer;
            background: no-repeat
              center/100%
              100%
              url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjA0NDUzMzc0MDYxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMxNzEiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTkzLjM3MTkxIDU3LjE1NDU3MyA5MzAuNjI4MDkgNTQwLjYzNTYwOCA5My4zNzE5MSAxMDI0WiIgcC1pZD0iMzE3MiIgZmlsbD0iIzk5OTk5OSI+PC9wYXRoPjwvc3ZnPg==");
            &.pie__right__arrow-disabled {
              cursor: not-allowed;
              background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjA0NDUzMzc0MDYxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMxNzEiIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTkzLjM3MTkxIDU3LjE1NDU3MyA5MzAuNjI4MDkgNTQwLjYzNTYwOCA5My4zNzE5MSAxMDI0WiIgcC1pZD0iMzE3MiIgZmlsbD0iI0U2RTZFNiI+PC9wYXRoPjwvc3ZnPg==");
            }
            &:first-child {
              transform: rotate(180deg);
              margin-right: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
