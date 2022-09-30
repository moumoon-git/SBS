<!--
 * @Author: yanghaohao
 * @Date: 2020-12-01 14:28:12
 * @LastEditors: liukanglin
 * @FilePath: \product_SBS\src\views\modules\PerformanceStatistics\CommunicationStatistics\CommunicationStatistics.vue
 * \CommunicationStatistics\CommunicationStatistics.vue
-->
<template>
  <div class="communication">
    <div class="left">
      <div class="communication_header">
        <div class="header_firstRow">
          <div class="header_title">
            <span class="title_span">值班总览</span>
          </div>
          <div class="header_select">
            <sv-select
              v-model="manType"
              :options="manOptions"
              placeholder="值班人员"
              @change="getDataByManOrFreedate()"
            />
            <sv-select
              v-model="dateRange"
              :options="dateOptions"
              placeholder="请选择时间周期"
              @change="getDataByDate()"
            />
            <!-- <sv-button @click="getDataByDate(0)">
              全部
            </sv-button>
            <sv-button @click="getDataByDate(7)">
              近七天
            </sv-button>
            <sv-button @click="getDataByDate(30)">
              近30天
            </sv-button> -->
            <sv-select-date
              v-model="freeDate"
              @change="getDataByManOrFreedate()"
            />
          </div>
        </div>
        <CsDutyOverview
          :phone-data="phoneData"
          :sms-data="smsData"
          :statics-loading="staticsLoading"
        />
      </div>
      <div class="communication_phone">
        <div class="phone_statics">
          <div class="statics_header">
            <div class="phone__header">
              <span class="phone_title">电话总量分析</span>
              <!-- <sv-button
                class="phone_button"
                @click="changePhoneZx(1)"
              >
                电话总量
              </sv-button>
              <sv-button @click="changePhoneZx(2)"> 接听率 </sv-button>
              <sv-button @click="changePhoneZx(3)"> 平均响应时间 </sv-button> -->
              <div
                :class="['phone__all',
                         {'phone-active':selectedPhoneEchart === 1}]"
                @click="changePhoneZx(1)"
              >
                电话总量
              </div>
              <div
                :class="['phone__call',
                         {'phone__call-none': selectedPhoneEchart === 1},
                         {'phone-active': selectedPhoneEchart === 2}]"
                @click="changePhoneZx(2)"
              >
                接听率
              </div>
              <div
                :class="['phone__time',
                         {'phone__time-none': selectedPhoneEchart === 2},
                         {'phone-active': selectedPhoneEchart === 3}]"
                @click="changePhoneZx(3)"
              >
                平均响应时间
              </div>
            </div>
            <span>
              <sv-select
                v-model="phoneManType"
                :options="manOptions"
                placeholder="值班人员"
                @change="getPhoneLineByManOrDate()"
              />
              <sv-select
                v-model="phoneLineDate"
                :options="lineDateOptions"
                placeholder="请选择时间周期"
                @change="getPhoneLineByManOrDate()"
              />
            </span>
          </div>
          <div
            id="phoneEchart"
            class="phone_echart"
          />
        </div>
      </div>
      <CsSmsEcharts
        :man-options="manOptions"
      />
    </div>
    <CsPhoneRanking
      :statics-loading="staticsLoading"
      :phone-data="phoneData"
    />
  </div>
</template>

<script>
import echarts from 'echarts';
import moment from 'moment';
import CsDutyOverview from './CsDutyOverview.vue';
import CsPhoneRanking from './CsPhoneRanking.vue';
import CsSmsEcharts from './CsSmsEcharts.vue';

export default {
  components:
  {
    CsDutyOverview,
    CsPhoneRanking,
    CsSmsEcharts,
  },
  data() {
    return {
      // 存储通讯人员列表
      manOptions: [],
      // 勾选的人
      manType: '',
      // 电话调度的数据
      phoneData: {},
      // 短信调度的数据
      smsData: {},
      // 电话数据加载提示
      staticsLoading: false,
      // 记录今天的时间
      nowDate: +new Date(),
      // 记录获取统计数据的起始日期
      staticsStartTime: '',
      staticsEndTime: '',
      // 自定义时间范围
      freeDate: [],
      // 电话折线图的时间周期
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
      // 总览的时间周期选择
      dateRange: '',
      dateOptions:
      [
        {
          value: 7,
          label: '近七天',
        },
        {
          value: 30,
          label: '近30天',
        },
      ],
      // 电话折线图的人员类型和时间周期
      phoneManType: '',
      phoneLineDate: '',
      // 记录当前选择的电话折线图，默认为电话总量统计折线图
      selectedPhoneEchart: 1,
      // 记录电话折线图的坐标数据
      phoneLineList: [],
      phoneCount: [],
      phoneResponseTime: [],
      phoneAnsweredPercent: [],
      phoneX: [],
      sumPhoneCountY: 0,
      sumPhoneResponseY: 0,
      sumPhoneAnsweredY: 0,
    };
  },

  mounted() {
    this.getPhoneLineByManOrDate();
    this.getPhoneEchart1();
    this.getWorkManList();
    this.getPhoneStatics();
    this.getSmsStatics();
  },
  methods: {

    /**
     * @description: 根据选择的人员和时间周期展示不同的电话折线图
     * @param {*}
     * @return {*}
     */
    getPhoneLineByManOrDate() {
      this.$http({
        url: this.$http.adornUrl('/phone/phoneDispatch/dispatchBytime'),
        method: 'post',
        data: this.$http.adornData({
          userId: this.phoneManType,
          dateType: this.phoneLineDate,
        }),
      }).then(({ data }) => {
        if (data.code === 0) {
          // 时间周期为近七天或近30天则将横坐标数据倒叙
          if (this.phoneLineDate === 3) {
            this.phoneLineList = data.data.list;
          } else {
            this.phoneLineList = data.data.list.reverse();
          }
          this.phoneCount = this.phoneLineList.map((item) => item.phoneCount);
          this.phoneResponseTime = this.phoneLineList.map(
            (item) => item.responseTime,
          );
          this.phoneAnsweredPercent = this.phoneLineList.map(
            (item) => item.answeredPercent,
          );
          const tempPhoneX = [];
          let tempSumPhoneCountY = 0;
          let tempSumPhoneResponseY = 0;
          let tempSumPhoneAnsweredY = 0;
          this.phoneLineList.forEach((item) => {
            tempSumPhoneCountY += item.phoneCount;
            tempSumPhoneResponseY += item.responseTime;
            tempSumPhoneAnsweredY += item.answeredPercent;
            tempPhoneX.push(item.createDate);
          });
          if (this.phoneLineDate === 3) {
            this.phoneX = tempPhoneX.slice(1);
          } else {
            this.phoneX = tempPhoneX;
          }
          this.sumPhoneCountY = tempSumPhoneCountY;
          this.sumPhoneResponseY = tempSumPhoneResponseY;
          this.sumPhoneAnsweredY = tempSumPhoneAnsweredY;
          this.$nextTick(() => {
            if (this.selectedPhoneEchart === 1) this.getPhoneEchart1();
            else if (this.selectedPhoneEchart === 2) this.getPhoneEchart2();
            else if (this.selectedPhoneEchart === 3) this.getPhoneEchart3();
          });
        } else {
          this.message.error(data.msg);
        }
      });
    },
    /**
     * @description: 根据选择的人员或者自定义事件来获取统计数据和排行榜数据
     * @param {*}
     * @return {*}
     */
    getDataByManOrFreedate() {
      if (this.freeDate.length) {
        this.dateRange = '';
        [this.staticsStartTime, this.staticsEndTime] = this.freeDate;
      }
      this.getSmsStatics();
      this.getPhoneStatics();
    },
    /**
     * @description: 根据日期范围来获取统计数据及排行榜数据
     * @param {*}dateRange 是指传进的天数，为0时不限日期范围
     * @return {*}
     */
    getDataByDate() {
      if (this.dateRange === '') {
        this.staticsStartTime = '';
        this.staticsEndTime = '';
      } else {
        this.nowDate = moment(this.nowDate).format('YYYY-MM-DD');
        const tempDate = moment(this.nowDate).subtract(this.dateRange, 'd');
        this.staticsStartTime = moment(tempDate._d).format('YYYY-MM-DD');
        this.staticsEndTime = this.nowDate;
      }
      this.getSmsStatics();
      this.getPhoneStatics();
    },
    /**
     * @description: 获取短信调度的相关数据
     * @param {*}
     * @return {*}
     */
    getSmsStatics() {
      this.$http({
        url: this.$http.adornUrl('/message/messageDispatch/dispatchList'),
        method: 'post',
        data: this.$http.adornData({
          userId: this.manType,
          startTime: this.staticsStartTime,
          endTime: this.staticsEndTime,
        }),
      }).then(({ data }) => {
        if (data.code === 0) {
          this.smsData = data.data;
        } else {
          this.message.error(data.msg);
        }
      });
    },

    /**
     * @description: 获取电话调度的排行榜数据等相关数据
     * @param {*}
     * @return {*}
     */
    getPhoneStatics() {
      this.staticsLoading = true;
      this.$http({
        url: this.$http.adornUrl('/phone/phoneDispatch/dispatchList'),
        method: 'post',
        data: this.$http.adornData({
          userId: this.manType,
          startTime: this.staticsStartTime,
          endTime: this.staticsEndTime,
        }),
      }).then(({ data }) => {
        if (data.code === 0) {
          this.phoneData = data.data;
          this.staticsLoading = false;
        } else {
          this.message.error(data.msg);
        }
      });
    },
    /**
     * @description: 获取通讯调度值班人员下拉框数据列表
     * @param {*}
     * @return {*}
     */
    getWorkManList() {
      this.$http({
        url: this.$http.adornUrl('/phone/phoneDispatch/onDutyList'),
        method: 'post',
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.data.forEach((item) => {
            this.manOptions.push({ value: item.userId, label: item.name });
          });
        } else {
          this.message.error(data.msg);
        }
      });
    },

    /**
     * @description: 切换电话通讯折线图
     * @param {*} value 为1是电话总量折线图，为2是接听率折线图，为3是平均响应时间折线图
     * @return {*}
     */
    changePhoneZx(value) {
      this.selectedPhoneEchart = value;
      if (value === 1) {
        this.$nextTick(() => this.getPhoneEchart1());
      } else if (value === 2) {
        this.$nextTick(() => this.getPhoneEchart2());
      } else if (value === 3) {
        this.$nextTick(() => this.getPhoneEchart3());
      }
    },
    /**
     * @description: 电话总量折线图
     * @param {*}
     * @return {*}
     */
    getPhoneEchart1() {
      const that = this;
      const phoneChart = echarts.init(document.getElementById('phoneEchart'));
      window.addEventListener('resize', () => {
        phoneChart.resize();
      });
      phoneChart.setOption({
        // 控制线条颜色
        // color:['blue','red','yellow'],
        color: ['#23B2FF'],
        grid: {
          left: '8%',
          right: 40,
          top: 20,
          bottom: 30,
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
            data: that.phoneX,
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
            scale: true,
            name: '',
            // max: that.sumPhoneCountY,
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
            name: '电话总量',
            type: 'line',
            smooth: true,
            data: that.phoneCount,
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
                    color: 'rgb(35,178,255)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(35,178,255,0.6)',
                  },
                ]),
              },
            },
          },
        ],
      });
    },
    /**
     * @description: 接听率折线图
     * @param {*}
     * @return {*}
     */
    getPhoneEchart2() {
      const that = this;
      const phoneChart = echarts.init(document.getElementById('phoneEchart'));
      window.addEventListener('resize', () => {
        phoneChart.resize();
      });
      phoneChart.setOption({
        color: ['#23B2FF'],
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
            data: that.phoneX,
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
            // max: 100,
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
            name: '接听率',
            type: 'line',
            smooth: true,
            data: that.phoneResponseTime,
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
                    color: 'rgb(35,178,255)',
                  },
                  {
                    offset: 1,
                    color: 'rgb(35,178,255,0.6)',
                  },
                ]),
              },
            },
          },
        ],
      });
    },
    /**
     * @description: 平均响应时间折线图
     * @param {*}
     * @return {*}
     */
    getPhoneEchart3() {
      const that = this;
      const phoneChart = echarts.init(document.getElementById('phoneEchart'));
      window.addEventListener('resize', () => {
        phoneChart.resize();
      });
      phoneChart.setOption({
        color: ['#23B2FF'],
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
            data: that.phoneX,
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
            scale: true,
            name: '',
            // max: that.sumPhoneAnsweredY,
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
            name: '平均响应时间',
            type: 'line',
            smooth: true,
            data: that.phoneAnsweredPercent,
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
                    color: 'rgb(35,178,255)',
                  },
                  {
                    offset: 1,
                    color: 'rgba(35,178,255,0.6)',
                  },
                ]),
              },
            },
          },
        ],
      });
    },
  },
};
</script>
<style lang="scss" src="./CommunicationStatistics.scss" />
