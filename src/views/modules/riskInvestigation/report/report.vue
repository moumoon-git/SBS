<template>
  <div>
    <div class="report">
      <div class="reportTree">
        <div class="reportTree-top">
          <div
            class="reportTree-top-tab"
            :class="buttonType == '0' ? 'reportTree-top-tab-active' : ''"
            @click="showAreaTree()"
          >
            <span>巡查区域</span>
          </div>

          <div
            class="reportTree-top-tab"
            :class="buttonType == '1' ? 'reportTree-top-tab-active' : ''"
            @click="showGroupTree()"
          >
            <span>项目分组</span>
          </div>
        </div>

        <div class="reportTree-search">
          <div
            class="el-icon-search reportTree-search-icon"
            @click="searchTree"
          />
          <input
            v-model="search.searchTreeName"
            class="reportTree-search-inner"
            placeholder="按enter搜索"
            @keyup.enter="searchTree"
          >
          <div
            v-if="search.searchTreeName"
            class="reportTree-search-cancel el-icon-close"
            @click="
              search.searchTreeName = '';
              searchTree();
            "
          />
        </div>

        <div class="reportTree-scroll">
          <el-tree
            :data="treeList"
            :props="treeProps"
            node-key="id"
            :default-expanded-keys="[0]"
            :current-node-key="0"
            @node-click="handleNodeClick"
          />
        </div>
      </div>
      <div class="report-content-warpper">
        <div class="report-content-one">
          <table class="report-content-table">
            <div class="table_first">
              <span class="table_span">
                <td class="span_td1">
                  {{ investigation }}
                </td>
                <tr class="span_tr">
                  巡查任务数
                </tr>
              </span>
              <span class="span_line" />
              <span class="table_span">
                <td class="span_td2">
                  {{ investigationEnd }}
                </td>
                <tr class="span_tr">
                  已巡查任务数
                </tr>
              </span>
              <span class="span_line" />
              <span class="table_span">
                <td class="span_td3">
                  {{ investigationIng }}
                </td>
                <tr class="span_tr">
                  待巡查任务数
                </tr>
              </span>
              <span class="span_line" />
              <span class="table_span">
                <td class="span_td4">
                  {{ investigationNo }}
                </td>
                <tr class="span_tr">
                  未巡查任务数
                </tr>
              </span>
            </div>
            <div class="table_first">
              <span class="table_span">
                <td class="span_td1">
                  {{ inforAll }}
                </td>
                <tr class="span_tr">
                  检查项目数
                </tr>
              </span>
              <span class="span_line" />
              <span class="table_span">
                <td class="span_td2">
                  {{ inforUsual }}
                </td>
                <tr class="span_tr">
                  正常项目数目
                </tr>
              </span>
              <span class="span_line" />
              <span class="table_span">
                <td class="span_td3">
                  {{ inforUnusual }}
                </td>
                <tr class="span_tr">
                  异常项目数目
                </tr>
              </span>
              <span class="span_line" />
              <span class="table_span">
                <td class="span_td4">
                  {{ inforNo }}
                </td>
                <tr class="span_tr">
                  未检查项目数
                </tr>
              </span>
            </div>
          </table>
          <span class="span_line" />
          <!-- <img
            style="display: none"
            id="background"
            src="../../../../assets/img/background.png"
          />
          <img
            style="display: none"
            id="gau"
            src="../../../../assets/img/gauge.png"
          />
          <img
            style="display: none"
            id="point"
            src="../../../../assets/img/point.png"
          /> -->
          <div>
            <canvas id="myCanvas">
              Your brower does not support the HTML5 canvas tag.
            </canvas>
          </div>
          <span class="span_per">
            <td class="span_per_td">
              {{ inforUnusualPer }}
            </td>
            <tr class="span_per_tr">
              异常项目占比
            </tr>
          </span>

          <div class="report-content-button">
            <sv-button
              class="report-content-one-button"
              @click="qqtang()"
            >
              今天
            </sv-button>
            <sv-button
              class="report-content-one-button"
              @click="qqtang2()"
            >
              近七天
            </sv-button>

            <el-popover
              v-model="popoverVisible"
              class="yh"
              placement="top"
              trigger="manual"
            >
              <div>
                <el-date-picker
                  v-model="value1"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                >
                  >
                </el-date-picker>
                <el-button @click="getDateValue()">
                  确认
                </el-button>
              </div>
              <el-button
                slot="reference"
                :class="
                  popoverVisible == true ? 'reportTree-top-tab-active' : ''
                "
                @click="zidingyiClick"
              >
                自定义
              </el-button>
            </el-popover>

            <el-select
              v-model="period"
              class="yh"
              placeholder="巡查周期"
              clearable
              @change="getPeriod"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>

        <div class="report-content-two">
          <div
            v-show="
              investigationEnd == 0 &&
                investigationIng == 0 &&
                investigationNo == 0
            "
            class="report-content-two-left"
          >
            <div class="report-title">
              巡查统计
            </div>
            <div class="image-no-data">
              <img
                style="width: 6vw"
                src="../../../../assets/img/tips.svg"
              >
              <div class="char-no-data">
                暂时没有数据
              </div>
            </div>
          </div>

          <div
            v-show="
              investigationEnd != 0 ||
                investigationIng != 0 ||
                investigationNo != 0
            "
            class="report-content-two-left"
          >
            <div class="report-title">
              巡查统计
            </div>
            <div style="display: -webkit-box">
              <div
                id="echarts1"
                class="echarts1"
              />
              <div class="report-content-ul">
                <ul style="list-style-size: 10px; margin-top: 4em">
                  <div>
                    <li
                      style="margin-top: 0px; color: #1add89; font-size: 21px"
                    >
                      <span
                        style="color: #999999; font-size: 14px"
                      >已巡查</span>
                      <span
                        style="
                          color: #333333;
                          font-size: 14px;
                          padding: 0px 10px;
                        "
                      >数量:</span>
                      <span
                        style="
                          color: #333333;
                          font-size: 14px;
                          width: 25px;
                          display: inline-block;
                        "
                      >{{ investigationEnd }}</span>
                      <span
                        style="
                          padding: 0px 10px;
                          color: #333333;
                          font-size: 14px;
                        "
                      >占比:</span>
                      <span style="color: #333333; font-size: 14px">{{
                        investigationEndPer
                      }}</span>
                    </li>
                    <li
                      style="margin-top: 10px; color: #56a6ff; font-size: 21px"
                    >
                      <span
                        style="color: #999999; font-size: 14px"
                      >待巡查</span>
                      <span
                        style="
                          color: #333333;
                          font-size: 14px;
                          padding: 0px 10px;
                        "
                      >数量:</span>
                      <span
                        style="
                          color: #333333;
                          font-size: 14px;
                          width: 25px;
                          display: inline-block;
                        "
                      >{{ investigationIng }}</span>
                      <span
                        style="
                          padding: 0px 10px;
                          color: #333333;
                          font-size: 14px;
                        "
                      >占比:</span>
                      <span style="color: #333333; font-size: 14px">{{
                        investigationIngPer
                      }}</span>
                    </li>
                    <li
                      style="margin-top: 10px; color: #ff6161; font-size: 21px"
                    >
                      <span
                        style="color: #999999; font-size: 14px"
                      >未巡查</span>
                      <span
                        style="
                          color: #333333;
                          font-size: 14px;
                          padding: 0px 10px;
                        "
                      >数量:</span>
                      <span
                        style="
                          color: #333333;
                          font-size: 14px;
                          width: 25px;
                          display: inline-block;
                        "
                      >{{ investigationNo }}</span>
                      <span
                        style="
                          padding: 0px 10px;
                          color: #333333;
                          font-size: 14px;
                        "
                      >占比:</span>
                      <span style="color: #333333; font-size: 14px">{{
                        investigationNoPer
                      }}</span>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
          </div>

          <div
            v-show="inforUsual == 0 && inforUnusual == 0"
            class="report-content-two-right"
          >
            <div class="report-title">
              隐患统计
            </div>
            <div class="image-no-data">
              <img
                style="width: 6vw"
                src="../../../../assets/img/tips.svg"
              >
              <div class="char-no-data">
                暂时没有数据
              </div>
            </div>
          </div>

          <div
            v-show="inforUsual != 0 || inforUnusual != 0"
            class="report-content-two-right"
          >
            <div class="report-title">
              隐患统计
            </div>
            <div style="display: flex">
              <div style="width: 13vw; height: 26vh">
                <div
                  id="echarts2"
                  class="echarts2"
                />
              </div>
              <div class="report-content-ul">
                <ul style="list-style-size: 10px; margin-top: 5.5em">
                  <div>
                    <li
                      style="margin-top: 0px; color: #1add89; font-size: 21px"
                    >
                      <span style="color: #999999; font-size: 14px">正常</span>
                      <span
                        style="
                          color: #333333;
                          font-size: 14px;
                          padding: 0px 10px;
                        "
                      >数量:</span>
                      <span
                        style="
                          color: #333333;
                          font-size: 14px;
                          width: 25px;
                          display: inline-block;
                        "
                      >{{ inforUsual }}</span>
                      <span
                        style="
                          padding: 0px 10px;
                          color: #333333;
                          font-size: 14px;
                        "
                      >占比:</span>
                      <span style="color: #333333; font-size: 14px">{{
                        inforUsualPer
                      }}</span>
                    </li>
                    <li
                      style="margin-top: 10px; color: #ff6161; font-size: 21px"
                    >
                      <span
                        style="
                          color: #999999;
                          padding: 200px 0px;
                          font-size: 14px;
                        "
                      >异常</span>
                      <span
                        style="
                          color: #333333;
                          font-size: 14px;
                          padding: 0px 10px;
                        "
                      >数量:</span>
                      <span
                        style="
                          color: #333333;
                          font-size: 14px;
                          width: 25px;
                          display: inline-block;
                        "
                      >{{ inforUnusual }}</span>
                      <span
                        style="
                          padding: 0px 10px;
                          color: #333333;
                          font-size: 14px;
                        "
                      >占比:</span>
                      <span style="color: #333333; font-size: 14px">{{
                        inforUnusualPer
                      }}</span>
                    </li>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="report-content-three">
          <div class="report-content-three-left">
            <span
              class="report-title"
            >隐患排行
              <!-- <el-button style="float: right;margin-left:5px" plain>异常率</el-button>-->
              <el-button
                class="report-content-three-leftbutton"
              >异常数</el-button></span>
            <span
              v-show="taskData != ''"
              id="echarts4"
              class="echarts4"
              style="width: 33vw; height: 25vh; top: 20px"
            />
            <div
              v-show="taskData == ''"
              class="image-no-data"
            >
              <img
                style="width: 6vw"
                src="../../../../assets/img/barTip.svg"
              >
              <div class="char-no-data">
                暂时没有数据
              </div>
            </div>
          </div>

          <div class="report-content-three-right">
            <span class="report-title">项目分组排行</span>
            <!-- <el-button size="small">异常率</el-button> -->
            <el-button
              class="report-content-three-rightbutton"
            >
              异常数
            </el-button>
            <span
              v-show="infoData != ''"
              id="echarts5"
              class="echarts5"
              style="width: 33vw; height: 25vh; top: 20px"
            />
            <div
              v-show="infoData == ''"
              class="image-no-data"
            >
              <img
                style="width: 6vw"
                src="../../../../assets/img/barTip.svg"
              >
              <div class="char-no-data">
                暂时没有数据
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// todo
import echarts from 'echarts';
import moment from 'moment';

export default {
  components: {},
  data() {
    return {
      sum: 0,
      sum2: 0,
      tp: [],
      trr: true,
      // 按钮类型
      buttonType: '0',
      // 树形数据
      treeList: [],
      treeProps: {
        children: 'children',
        label: 'name',
      },
      // 搜索树
      search: {
        searchTreeName: '',
      },
      // 区域树节点
      areaTreeIds: [],
      // 项目树节点
      groupTreeIds: [],
      // 日期范围
      dateRange: '0',
      // 开始时间
      startTime: '',
      // 结束时间
      endTime: '',
      // 自定义时间
      value1: '',
      popoverVisible: false,
      // 巡查周期
      period: '',
      options: [
        {
          value: '1',
          label: '周期：天',
        },
        {
          value: '2',
          label: '周期：周',
        },
        {
          value: '3',
          label: '周期：月',
        },
        {
          value: '4',
          label: '周期：年',
        },
      ],
      date: +new Date(),
      //
      temp: '',
      // 渲染数据
      // 已巡查任务数
      investigationEnd: '',
      investigationEndPer: '',
      // 待巡查任务数
      investigationIng: '',
      investigationIngPer: '',
      // 未巡查任务数
      investigationNo: '',
      investigationNoPer: '',
      // 巡查总任务数
      investigation: '',
      // 隐患项目总数
      inforAll: '',
      // 正常项目数
      inforUsual: '',
      inforUsualPer: '',
      // 异常项目数
      inforUnusual: '',
      inforUnusualPer: '',
      // 未巡检数
      inforNo: '',
      // 区域隐患排行榜数据
      taskData: [],
      taskGroupId: '',
      taskGroupName: '',
      taskCountNum: '',
      // 项目分组排行榜数据
      infoData: [],
      infoGroupId: '',
      infoGroupName: '',
      infoCountNum: '',
      // 巡查统计图表
      taskChart: [],
      // 隐患统计图表
      infoChart: [],
      inforRankName: [],
      inforRankNum: [],
      taskRankName: [],
      taskRankNum: [],
    };
  },
  mounted() {
    // this.getPlatformDataList();
    // this.getDataList();
    this.getAreaTree();
    this.start();

    // 这里getDataList要放在getRanking前面，否则startTime和endTime还没赋值就被$http发送请求
    this.getDataList();
    this.canvans(
      this.inforAll == 0
        ? 0
        : Number((this.inforUnusual / this.inforAll) * 100).toFixed(1),
    );
    this.getRanking();
  },

  methods: {
    /**
     * @description: 使用canvas逐帧绘制仪表盘
     * @param {*} angle：指针旋转的角度
     * @return {*}
     */
    canvans(angle) {
      const canvas = document.getElementById('myCanvas');
      const ctx = canvas.getContext('2d');

      const canvasWidth = 200;
      const canvasHeight = 200;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const zhiboard = new Image();
      zhiboard.src = require('./img/pan.jpg');

      let currentAngle = 0;

      const render = () => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        // 加载刻度尺
        ctx.drawImage(zhiboard, 8, 47, 185, 120);
        // 绘制背景圆图层
        ctx.beginPath();
        ctx.arc(100, 120, 65, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = '#f4f4f4';
        ctx.fill();
        // 绘制背景条图层
        ctx.strokeStyle = '#DFE8F1';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(100, 120, 55, (150 * Math.PI) / 180, (385 * Math.PI) / 180);
        ctx.stroke();
        ctx.closePath();
        // 绘制动态进度条
        if (currentAngle != 0) {
          const g2 = ctx.createRadialGradient(250, 250, 0, 250, 250, 300);
          g2.addColorStop(0.5, '#F65252');

          g2.addColorStop(1, '#faa0a0');
          ctx.strokeStyle = g2;
          ctx.lineWidth = 10;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.arc(
            100,
            120,
            55,
            (150 * Math.PI) / 180,
            ((150 + currentAngle * 2.35) * Math.PI) / 180,
          );
          ctx.stroke();
          ctx.closePath();
        }
        // ctx.save()
        // ctx.translate(100, 120)
        // ctx.rotate(currentAngle*Math.PI/180)
        // ctx.drawImage(point,0,0,40,20)
        // ctx.restore()
        // 绘制指针转动
        ctx.save();
        ctx.translate(100, 120);
        ctx.rotate((currentAngle * 2.45 * Math.PI) / 180); // 计算时针角度并绘制图形
        ctx.strokeStyle = '#F66E6E';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(1, -1);
        ctx.lineTo(-30, 20);
        ctx.stroke();
        ctx.restore();

        ctx.beginPath();
        ctx.arc(100, 120, 1, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = '#fff';
        ctx.fill();

        if (currentAngle < angle) {
          requestAnimationFrame(render);
          currentAngle + 2 > angle
            ? (currentAngle = angle)
            : (currentAngle += 2);
        }
      };
      zhiboard.onload = () => {
        requestAnimationFrame(render);
      };
    },

    start() {
      this.date = moment(this.date).format('YYYY-MM-DD');
    },
    //
    qqtang() {
      this.dateRange = 0;
      this.getDataList();
      this.getRanking();
    },
    qqtang2() {
      this.dateRange = 7;
      this.getDataList();
      this.getRanking();
    },

    // 获取图表
    getEcharts() {
      const myChart = echarts.init(document.getElementById('echarts1'));
      const myChart2 = echarts.init(document.getElementById('echarts2'));
      // var myChart3 = echarts.init(document.getElementById("echarts3"));
      const myChart4 = echarts.init(document.getElementById('echarts4'));
      const myChart5 = echarts.init(document.getElementById('echarts5'));
      //    window.addEventListener("resize",function () {
      //        if(myChart)
      //      myChart.resize();
      // })
      // const self = this;//因为箭头函数会改变this指向，指向windows。所以先把this保存

      window.addEventListener('resize', () => {
        if (myChart && myChart2 && myChart4 && myChart5) {
          myChart.resize();
          myChart2.resize();
          myChart4.resize();
          myChart5.resize();
        }
      });
      myChart.setOption({
        // color: ["#FF6161", "#1acd7e", "#84C1FF"],
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
        },
        series: [
          {
            name: '巡查统计',
            type: 'pie', // 设置图表类型为饼图
            // data: [{ value: this.inforUnusualPer, name: "ss" }],
            radius: [70, 90], // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
            itemStyle: {
              normal: {
                // 柱体的颜色
                // 右，下，左，上（1，0，0，0）表示从正右开始向左渐变
                color(params) {
                  const colorList = [
                    ['#FFADAD', '#FF6161'],
                    ['#87EC7D', '#1ADD89'],
                    ['#86D7FF', '#56A6FF'],
                    ['#87EC7D', '#1ADD89'],
                    ['#86D7FF', '#56A6FF'],
                    ['#87EC7D', '#1ADD89'],
                    ['#87EC7D', '#1ADD89'],
                  ];
                  const colorItem = colorList[params.dataIndex];
                  return new echarts.graphic.LinearGradient(
                    1,
                    0,
                    0,
                    0,
                    [
                      {
                        offset: 0,
                        color: colorItem[0],
                      },
                      {
                        offset: 1,
                        color: colorItem[1],
                      },
                    ],
                    false,
                  );
                },
              },
            },

            data: [
              // 数据数组，name 为数据项名称，value 为数据项值
              {
                value: this.investigationNo,
                name: '未巡查',
                // label: { position: "inner" },
              },

              {
                value: this.investigationEnd,
                name: '已巡查',
                // label: { position: "inner" },
              },
              {
                value: this.investigationIng,
                name: '待巡查',
                label: {
                  normal: {
                    formatter: [this.investigation, '{b|总计数量}'].join('\n'),

                    fontSize: '170%',
                    fontWeight: 500,
                    color: 'rgba(51,51,51,1)',
                    height: 56,
                    fontFamily: 'PingFangSC-Medium, PingFang SC',
                    position: 'center', // 让文字居中
                    show: true,
                    rich: {
                      left: 'center',
                      b: {
                        fontFamily: 'PingFangSC-Medium, PingFang SC',
                        fontSize: '150%',
                        fontWeight: 500,
                        color: 'rgba(102,102,102,1)',
                        // lineHeight:'26'
                        height: 80,
                      },
                    },
                  },
                },
              },
            ],
            label: {
              normal: {
                position: 'inner',
                show: false,
              },
            },
          },
        ],
      });

      myChart2.setOption({
        // color: ["#1acd7e", "#FF6161"],
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
        },
        series: [
          {
            name: '访问来源',
            type: 'pie', // 设置图表类型为饼图
            radius: [70, 90], // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
            itemStyle: {
              normal: {
                // 柱体的颜色
                // 右，下，左，上（1，0，0，0）表示从正右开始向左渐变
                color(params) {
                  const colorList = [
                    ['#87EC7D', '#1ADD89'],
                    ['#FFADAD', '#FF6161'],
                    ['#651180', '#D099FF'],
                    ['#4B8D10', '#83FFC0'],
                    ['#8D104B', '#FF83D8'],
                    ['#7F610F', '#FFE899'],
                    ['#108D89', '#83FFE9'],
                  ];
                  const colorItem = colorList[params.dataIndex];
                  return new echarts.graphic.LinearGradient(
                    1,
                    0,
                    0,
                    0,
                    [
                      {
                        offset: 0,
                        color: colorItem[0],
                      },
                      {
                        offset: 1,
                        color: colorItem[1],
                      },
                    ],
                    false,
                  );
                },
              },
            },

            data: [
              // 数据数组，name 为数据项名称，value 为数据项值
              {
                value: this.inforUsual,
                name: `正常${this.inforUsualPer}`,
                // label: { position: "inner" },
              },
              {
                value: this.inforUnusual,
                name: `异常${this.inforUnusualPer}`,
                label: {
                  normal: {
                    formatter: [this.inforAll, '{b|总计数量}'].join('\n'),

                    fontSize: '170%',
                    fontWeight: '500',
                    color: 'rgba(51,51,51,1)',
                    height: 56,
                    position: 'center', // 让文字居中
                    show: true,
                    rich: {
                      left: 'center',
                      b: {
                        fontSize: '150%',
                        height: 80,
                        // fontWeight: 'bold',
                        color: 'rgba(102,102,102,1)',
                        // lineHeight:'26'
                      },
                    },
                  },
                },
              },
            ],
            label: {
              normal: {
                position: 'inner',
                show: false,
              },
            },
          },
        ],
      });

      myChart4.setOption({
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.8)',
          extraCssText: 'box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#6a717b',
          },
        },
        grid: {
          left: '1%',
          right: '4%',
          top: '1%',
          bottom: '1%',
          containLabel: true,
        },
        yAxis: [
          {
            type: 'category',
            data: this.taskRankName,

            inverse: false,
            axisTick: {
              show: false, // 是否生成纵坐标
              alignWithLabel: false,
            },
            axisPointer: {
              type: 'none',
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 12,
                color: '#53a8fa',
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#2548ac',
              },
            },
          },
        ],
        xAxis: [
          {
            type: 'value',
            axisTick: {
              show: false,
              alignWithLabel: false,
            },
            axisLabel: {
              show: false,
              margin: 10,
              textStyle: {
                fontSize: 12,
                color: '#53a8fa',
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#192469',
              },
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#17367c',
              },
            },
          },
        ],
        backgroundColor: '#FFFFFF',
        series: [
          {
            name: '',
            type: 'bar',
            barWidth: 15,
            barGap: '-100%',

            data: this.infoData.map(() => this.sum2),
            itemStyle: {
              emphasis: {
                color: '#F2F5F8',
              },
              normal: {
                color: '#F2F5F8',
                barBorderRadius: [0, 15, 15, 0],
                shadowColor: 'rgba(0,0,0,0.1)',
                shadowBlur: 3,
                // shadowOffsetY: 3,
              },
            },
          },
          {
            name: '',
            type: 'bar',
            barWidth: 15,
            data: this.taskRankNum,
            label: {
              normal: {
                show: true,
                position: 'insideRight',
                textStyle: {
                  color: '#333333', // color of value
                },
              },
            },

            itemStyle: {
              normal: {
                emphasis: {
                  color: '#fff',
                },
                color(params) {
                  // 多个颜色就多个值
                  const colorList = [
                    ['#D6C8FF', '#5579FF'],
                    ['#FF9576', '#AD7AFF'],
                    ['#FFC680', '#FF5744'],
                    ['#FF9576', '#0F92FF'],
                    ['#FF9576', '#0F92FF'],
                    ['#FF9576', '#0F92FF'],
                    ['#FF9576', '#0F92FF'],
                    ['#FF9576', '#0F92FF'],
                  ];

                  let index = params.dataIndex;
                  if (params.dataIndex >= colorList.length) {
                    index = params.dataIndex - colorList.length;
                  }

                  return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: colorList[index][0] },
                    { offset: 1, color: colorList[index][1] },
                  ]);
                },
                barBorderRadius: [0, 15, 15, 0],
                shadowColor: 'rgba(0,0,0,0.1)',
                shadowBlur: 3,
                shadowOffsetY: 3,
              },
            },
          },
        ],
      });

      myChart5.setOption({
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.8)',
          extraCssText: 'box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);',
          textStyle: {
            color: '#6a717b',
          },
        },
        grid: {
          left: '1%',
          right: '4%',
          top: '1%',
          bottom: '1%',
          containLabel: true,
        },
        yAxis: [
          {
            type: 'category',
            data: this.inforRankName,

            inverse: false, // 排行榜排序
            axisTick: {
              show: false, // 是否生成纵坐标
              alignWithLabel: false,
            },
            axisPointer: {
              type: 'none',
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 12,
                color: '#53a8fa', // 字体颜色
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#2548ac',
              },
            },
          },
        ],
        xAxis: [
          {
            type: 'value',
            axisTick: {
              show: false,
              alignWithLabel: false,
            },
            axisLabel: {
              show: false,
              margin: 10,
              textStyle: {
                fontSize: 12,
                color: '#53a8fa',
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#192469',
              },
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#17367c',
              },
            },
          },
        ],
        backgroundColor: '#FFFFFF',
        series: [
       

          {
            name: '',
            type: 'bar',
            barWidth: 15,
            data: this.inforRankNum,
            label: {
              normal: {
                show: true,
                position: 'insideRight',
                textStyle: {
                  color: '#333333', // color of value
                },
              },
            },

            itemStyle: {
              normal: {
                emphasis: {
                  color: '#fff',
                },
                color(params) {
                  // 多个颜色就多个值
                  const colorList = [
                    ['#D6C8FF', '#5579FF'],
                    ['#FF9576', '#AD7AFF'],
                    ['#FFC680', '#FF5744'],
                    ['#FF9576', '#0F92FF'],
                    ['#FF9576', '#0F92FF'],
                    ['#FF9576', '#0F92FF'],
                    ['#FF9576', '#0F92FF'],
                    ['#FF9576', '#0F92FF'],
                  ];

                  let index = params.dataIndex;
                  if (params.dataIndex >= colorList.length) {
                    index = params.dataIndex % colorList.length;
                  }

                  return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: colorList[index][0] },
                    { offset: 1, color: colorList[index][1] },
                  ]);
                },
                barBorderRadius: [0, 15, 15, 0],
                shadowColor: 'rgba(0,0,0,0.1)',
                shadowBlur: 3,
                shadowOffsetY: 3,
              },
            },
          },
        ],
      });
    },

    // 周期更改
    getPeriod() {
      this.getDataList();
      this.getRanking();
    },
    // 获取巡查区域树
    getAreaTree() {
      this.$http({
        url: this.$http.adornUrl(
          '/investigation/investigationTaskGroup/listTree',
        ),
        method: 'get',
        params: this.$http.adornParams({
          name: this.search.searchTreeName,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.treeList = [
            {
              id: 0,
              name: '全部',
              children: null,
            },
            ...data.data,
          ];

          this.getDataList();
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 获取项目分组树
    getGroupTree() {
      this.$http({
        url: this.$http.adornUrl('/investigation/investigationGroup/listTree'),
        method: 'get',
        params: this.$http.adornParams({
          name: this.search.searchTreeName,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.treeList = [
            {
              id: 0,
              name: '全部',
              children: null,
            },
            ...data.data,
          ];

          this.getDataList();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 获取全部树
    //  getAll() {
    //   if (this.buttonType == "0") {
    //    this.areaTreeIds = [];
    //     this.getAreaTree();

    //   } else {
    //     this.groupTreeIds = [];
    //    this.getGroupTree();
    // }
    //  this.getDataList();
    //  },
    cleanData() {
      this.investigationEnd = '';
      this.investigationIng = '';
      this.investigationNo = '';
      this.investigationEndPer = '';
      this.investigationIngPer = '';
      this.investigationNoPer = '';
      this.investigation = '';
      this.inforAll = '';
      this.inforUsual = '';
      this.inforUnusual = '';
      this.inforUsualPer = '';
      this.inforUnusualPer = '';
      this.inforNo = '';
    },
    showAreaTree() {
      this.buttonType = '0';
      this.search.searchTreeName = '';
      this.areaTreeIds = [];
      // this.cleanData();
      this.getAreaTree();
      // this.getDataList();
    },
    showGroupTree() {
      this.buttonType = '1';
      // this.cleanData();
      this.search.searchTreeName = '';
      this.groupTreeIds = [];
      this.getGroupTree();
      // this.getDataList();
    },
    // 搜索树
    searchTree() {
      if (this.buttonType == '0') {
        this.getAreaTree();
      } else {
        this.getGroupTree();
      }
    },
    // 获取树的子孙节点
    getChildren(data) {
      if (data != null && data.length > 0) {
        data.forEach((d) => {
          if (this.buttonType == '0') {
            this.areaTreeIds.push(d.id);
          } else {
            this.groupTreeIds.push(d.id);
          }
          if (d.children != null && d.children.length > 0) {
            this.getChildren(d.children);
          }
        });
      }
    },
    handleNodeClick(obj) {
      console.log('obj', obj);
      this.areaTreeIds = [];
      this.groupTreeIds = [];
      if (this.buttonType == '0') {
        obj.id == 0 ? (this.areaTreeIds = []) : (this.areaTreeIds = [obj.id]);
      } else {
        obj.id == 0 ? (this.groupTreeIds = []) : (this.groupTreeIds = [obj.id]);
      }
      if (obj.children != null && obj.children.length > 0) {
        this.getChildren(obj.children);
      }
      // this.getDataList();
      this.getDataList();
    },
    // 自定义点击
    zidingyiClick() {
      this.popoverVisible = !this.popoverVisible;
      this.dateRange = '';
      this.value1 = '';
    },
    // 获取自定义时间
    getDateValue() {
      // this.trr=false;
      this.getDataList();
      this.getRanking();
    },
    getSum() {
      this.sum = 0;
      this.sum2 = 0;
      this.inforRankName = [];
      this.inforRankNum = [];
      this.taskRankName = [];
      this.taskRankNum = [];
      this.infoData.forEach((item) => {
        this.sum += item.countNum;
        this.inforRankName.push(item.groupName);
        this.inforRankNum.push(item.countNum);
      });
      this.taskData.forEach((item) => {
        this.sum += item.countNum;
        this.taskRankName.push(item.groupName);
        this.taskRankNum.push(item.countNum);
      });
    },
    getDataList() {
      // 点击周期与今天,近七天,近30天等都会触发隐患排行跟区域排行的接口

      this.getRanking();
      // this.popoverVisible = false;
      const s = moment(this.date).subtract(this.dateRange, 'd');
      this.startTime = moment(s._d).format('YYYY-MM-DD');
      this.endTime = this.date;
      if (this.value1) {
        [this.startTime, this.endTime] = this.value1;
      }

      if (this.buttonType == '0') {
        this.groupTreeIds = [];
        this.$http({
          url: this.$http.adornUrl(
            '/investigation/investigationReport/getInvestiagtionReportBytaskGid',
          ),
          method: 'post',
          data: this.$http.adornData({
            startTime: this.startTime,
            endTime: this.endTime,
            taskGroups: this.areaTreeIds,
            period: this.period,
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.investigationEnd = data.data.investigationEnd;
            this.investigationIng = data.data.investigationIng;
            this.investigationNo = data.data.investigationNo;
            this.investigation = data.data.investigation;
            this.inforAll = data.data.inforAll;
            this.inforUsual = data.data.inforUsual;
            this.inforUnusual = data.data.inforUnusual;
            this.inforNo = data.data.inforNo;

            if (this.investigation == 0) {
              this.investigationEndPer = Number(
                (this.investigationEnd / 1) * 100,
              ).toFixed(1);
              this.investigationEndPer += '%';
              this.investigationIngPer = Number(
                (this.investigationIng / 1) * 100,
              ).toFixed(1);
              this.investigationIngPer += '%';
              this.investigationNoPer = Number(
                (this.investigationNo / 1) * 100,
              ).toFixed(1);
              this.investigationNoPer += '%';
            } else {
              this.investigationEndPer = Number(
                (this.investigationEnd / this.investigation) * 100,
              ).toFixed(1);
              this.investigationEndPer += '%';
              this.investigationIngPer = Number(
                (this.investigationIng / this.investigation) * 100,
              ).toFixed(1);
              this.investigationIngPer += '%';
              this.investigationNoPer = Number(
                (this.investigationNo / this.investigation) * 100,
              ).toFixed(1);
              this.investigationNoPer += '%';
            }
            if (this.inforAll == 0) {
              this.inforUsualPer = Number((this.inforUsual / 1) * 100).toFixed(
                1,
              );
              this.inforUsualPer += '%';

              this.inforUnusualPer = Number(
                (this.inforUnusual / 1) * 100,
              ).toFixed(1);
              this.inforUnusualPer += '%';
            } else {
              this.inforUsualPer = Number(
                (this.inforUsual / this.inforAll) * 100,
              ).toFixed(1);
              this.inforUsualPer += '%';

              this.inforUnusualPer = Number(
                (this.inforUnusual / this.inforAll) * 100,
              ).toFixed(1);
              this.inforUnusualPer += '%';
            }
            this.getSum();
            this.getEcharts();
            this.canvans(
              this.inforAll == 0
                ? 0
                : Number((this.inforUnusual / this.inforAll) * 100).toFixed(1),
            );
            // this.value1 = "";
          } else {
            this.$message.error(data.msg);
          }
        });
      } else {
        this.areaTreeIds = [];
        this.$http({
          url: this.$http.adornUrl(
            '/investigation/investigationReport/getInvestiagtionReportByInforGid',
          ),
          method: 'post',
          data: this.$http.adornData({
            startTime: this.startTime,
            endTime: this.endTime,
            inforGroups: this.groupTreeIds,
            period: this.period,
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.investigationEnd = data.data.investigationEnd;
            this.investigationIng = data.data.investigationIng;
            this.investigationNo = data.data.investigationNo;
            this.investigation = data.data.investigation;
            this.inforAll = data.data.inforAll;
            this.inforUsual = data.data.inforUsual;
            this.inforUnusual = data.data.inforUnusual;
            this.inforNo = data.data.inforNo;
            this.investigationEndPer = Number(
              (this.investigationEnd / this.investigation) * 100,
            ).toFixed(1);
            this.investigationEndPer += '%';
            this.investigationIngPer = Number(
              (this.investigationIng / this.investigation) * 100,
            ).toFixed(1);
            this.investigationIngPer += '%';
            this.investigationNoPer = Number(
              (this.investigationNo / this.investigation) * 100,
            ).toFixed(1);
            this.investigationNoPer += '%';

            if (this.inforAll == 0) {
              this.inforUsualPer = Number((this.inforUsual / 1) * 100).toFixed(
                1,
              );
              this.inforUsualPer += '%';

              this.inforUnusualPer = Number(
                (this.inforUnusual / 1) * 100,
              ).toFixed(1);
              this.inforUnusualPer += '%';
            } else {
              this.inforUsualPer = Number(
                (this.inforUsual / this.inforAll) * 100,
              ).toFixed(1);
              this.inforUsualPer += '%';

              this.inforUnusualPer = Number(
                (this.inforUnusual / this.inforAll) * 100,
              ).toFixed(1);
              this.inforUnusualPer += '%';
            }

            this.getSum();
            this.getEcharts();
            this.canvans(
              this.inforAll == 0
                ? 0
                : Number((this.inforUnusual / this.inforAll) * 100).toFixed(1),
            );
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    getRanking() {
      this.$http({
        url: this.$http.adornUrl(
          '/investigation/investigationReport/getTopByTaskGid',
        ),
        method: 'post',
        data: this.$http.adornData({
          startTime: this.startTime,
          endTime: this.endTime,
          period: this.period,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.taskData = data.data;
          this.taskGroupId = data.data.groupId;
          this.taskGroupName = data.data.groupName;
          this.taskCountNum = data.data.countNum;
        } else {
          this.$message.error(data.msg);
        }
      });
      this.$http({
        url: this.$http.adornUrl(
          '/investigation/investigationReport/getTopByInforGid',
        ),
        method: 'post',
        data: this.$http.adornData({
          startTime: this.startTime,
          endTime: this.endTime,
          period: this.period,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.infoData = data.data;
          this.infoGroupId = data.data.groupId;
          this.infoGroupName = data.data.groupName;
          this.infoCountNum = data.data.countNum;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
* {
  font-family: PingFangSC-Regular, PingFang SC;
}
.report {
  overflow: hidden;
  height: calc(100vh - 112px);
  display: flex;
  .report-title {
    border-left: 3px solid rgba(0, 145, 255, 1);
    font-size: 16px;
    display: inline-block;
    height: 16px;
    line-height: 16px;
    padding-left: 14px;
    //position: absolute;
    margin: 15px 0px 0px 15px;
    color: #333333;
    font-weight: 500;
    font-family: PingFangSC-Medium;
  }
  .reportTree {
    background: white;
    width: 22%;
    min-width: 200px;
    //box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);

    border-radius: 4px;

    .reportTree-top {
      display: flex;
      justify-content: space-around;
      padding: 27px 0px 20px 0px;
      border-bottom: 2px solid rgba(234, 238, 242, 1);
      margin-bottom: 20px;
      .reportTree-top-tab {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(153, 153, 153, 1);
        cursor: pointer;
        position: relative;
      }
      .reportTree-top-tab-active {
        color: rgba(51, 51, 51, 1);
      }
      .reportTree-top-tab-active span::after {
        content: "";
        position: absolute;
        left: 27px;
        bottom: -30px;
        display: block;
        background: white;
        width: 20px;
        height: 20px;
        transform: rotate(45deg);
        border: 2px solid rgba(234, 238, 242, 1);
        border-bottom: none;
        border-right: none;
      }
    }
    .reportTree-search:focus-within {
      border-color: rgba(0, 145, 255, 1);
    }
    .reportTree-search {
      margin: 0 auto;
      height: 40px;
      width: calc(100% - 28px);
      border-radius: 21px;
      border: 1px solid rgba(232, 236, 240, 1);
      position: relative;
      margin-bottom: 20px;
      .reportTree-search-icon {
        font-size: 14px;
        font-weight: bold;
        width: 17px;
        height: 17px;
        color: rgba(153, 153, 153, 1);
        margin: 10px 0px 11px 18px;
        cursor: pointer;
      }
      .reportTree-search-inner {
        border: none;
        outline: none;
        width: calc(100% - 70px);
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
      .reportTree-search-cancel {
        width: 17px;
        height: 17px;
        line-height: 15px;
        font-size: 15px;
        text-align: center;
        border: 1px solid rgba(153, 153, 153, 1);
        color: rgba(153, 153, 153, 1);
        border-radius: 50%;
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 11px;
      }
      .reportTree-search-cancel:hover {
        color: rgba(153, 153, 153, 0.5);
        border-color: rgba(153, 153, 153, 0.5);
      }
    }

    .reportTree-scroll::-webkit-scrollbar {
      background: transparent;
      width: 5px;
    }
    .reportTree-scroll::-webkit-scrollbar-thumb {
      background: rgba(153, 153, 153, 1);
      border-radius: 20px;
    }
    .reportTree-scroll {
      overflow: auto;
      height: calc(100vh - 290px);
      /deep/.el-tree-node__content {
        height: 45px;
      }
      /deep/.el-tree-node__label {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
      /deep/.is-current > .el-tree-node__content {
        background: rgba(0, 145, 255, 0.1);
        border-left: 2px solid rgba(0, 145, 255, 1);
        color: rgba(0, 145, 255, 1);
      }
      /deep/.el-tree-node__content:hover {
        background: rgba(0, 145, 255, 0.1);
      }
    }
  }

  .report-content-warpper {
    //border-radius: 4px;
    //  box-shadow:0px 4px 14px 3px rgba(54, 121, 225,0.09);
    //  border: 1px solid transparent;
    //  background: transparent;
    margin-left: 10px;
    width: calc(78% - 10px);
    min-width: 1050px;
    height: 100%;
    position: relative;

    .image-no-data {
      text-align: center;
      margin-top: 6vh;
    }
    .char-no-data {
      font-weight: 500;
      text-align: center;
      color: #b8c3d9;
      font-size: 14px;
      margin-top: 1vh;
    }
    .report-content-one {
      position: relative;
      border-radius: 4px;
      // box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
      border: 1px solid transparent;
      background: white;
      height: calc(30% - 20px);
      min-height: 200px;
      display: flex;

      .report-content-table {
        width: 38vw;
        margin-top: 1vh;
        .table_first {
          padding: 20px;
          display: flex;
          justify-content: space-around;
          .table_span {
            font-size: 14px;
            color: #333333;
            padding-left: 20px;
            font-weight: bold;
            display: inline-block;
            height: 50px;
            width: 120px;
            .span_td1 {
              font-size: 28px;
              color: #333333;
              text-align: left;
              font-weight: 500;
            }
            .span_tr {
              font-size: 14px;
              color: #999999;
            }
            .span_td2 {
              font-size: 28px;
              color: #0bd295;
              text-align: left;
              font-weight: 500;
            }
            .span_td3 {
              font-size: 28px;
              color: #f66e6e;
              text-align: left;
            }
            .span_td4 {
              font-size: 28px;
              color: #0091ff;
              text-align: left;
            }
          }
          .span_line {
            display: block;
            width: 2px;
            height: 25px;
            margin: 20px 8px;
            background-color: rgba(0, 0, 0, 0.05);
          }
        }
        // display: inline-block;
      }
      .span_line {
        display: block;
        width: 2px;
        height: 100px;
        margin: 70px auto;
        background-color: rgba(0, 0, 0, 0.05);
      }
      .span_per {
        font-size: 14px;
        color: #333333;
        padding-left: 20px;
        font-weight: bold;
        display: inline-block;
        height: 50px;
        width: 180px;
        padding: 80px 0px 0px 20px;
        .span_per_td {
          font-size: 26px;
          color: #333333;
          text-align: left;
          font-weight: 500;
        }
        .span_per_tr {
          font-size: 14px;
          color: #999999;
        }
      }

      .report-content-button {
        display: flex;
        flex-direction: column;
        margin: 20px 20px 0px 0px;
        // /deep/span {
        //   font-size: 14px;
        //   font-family: PingFangSC-Regular, PingFang SC;
        //   font-weight: 400;
        // }

        .report-content-one-button {
          width: 110px;
          margin-top: 8px;
          margin-left: 0px;
          border-radius: 4px;
        }
        .report-content-one-button:focus {
          background: #0091ff;
          color: #fff;
          border-color: #0091ff;
        }
      }
    }
    .report-content-two {
      position: relative;
      margin-top: 10px;
      min-width: 1050px;
      height: 35%;
      display: flex;
      .report-content-two-left {
        //height:306px;
        width: calc(50% - 5px);
        border-radius: 4px;
        // box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
        border: 1px solid transparent;
        background: white;
        //overflow:auto;
        .echarts1 {
          width: 13vw;
          height: 24vh;
          margin-left: 30px;
        }
        .report-content-ul {
          width: 330px;
          margin-left: 30px;
        }
      }
      .report-content-two-right {
        // height:306px;
        width: calc(50% - 5px);
        border-radius: 4px;
        // box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
        border: 1px solid transparent;
        background: white;
        margin-left: 10px;
        //overflow:auto;
        .echarts2 {
          width: 13vw;
          height: 24vh;
          margin-left: 30px;
        }
        .report-content-ul {
          width: 330px;
          margin-left: 30px;
        }
      }
    }

    .report-content-three {
      margin-top: 10px;
      display: -webkit-box;
      height: 35%;
      min-width: 1050px;
      .report-content-three-left {
        //  height:290px;
        width: calc(50% - 5px);
        border-radius: 4px;
        //  box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
        border: 1px solid transparent;
        background: white;
        position: relative;
        overflow: auto;
        .report-content-three-leftbutton {
          //width:2vw;
          position: absolute;
          left: 27vw;
          top: 1vh;
          background: #fff;
          border-radius: 4px 0px 0px 4px;
          /deep/span {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
          }
        }
        .report-content-three-leftbutton:focus {
          background: #0091ff;
          color: #fff;
          border-color: #0091ff;
        }
      }
      .report-content-three-right {
        //height:306px;
        width: calc(50% - 5px);
        border-radius: 4px;
        //box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
        border: 1px solid transparent;
        background: white;
        margin-left: 10px;
        position: relative;
        overflow: auto;
        .report-content-three-rightbutton {
          //  width:65px;

          position: absolute;
          left: 27vw;
          top: 1vh;
          background: #fff;
          border-radius: 4px 0px 0px 4px;
          /deep/span {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
          }
        }
        .report-content-three-rightbutton:focus {
          background: #0091ff;
          color: #fff;
          border-color: #0091ff;
        }
      }
    }
  }

  .divjiange {
    margin-top: 10px;
  }

  .yh /deep/ .el-button,
  .yh /deep/ .el-input {
    width: 110px !important;
    // height:39px;
    margin-top: 8px;
    border-radius: 4px;
  }
}
</style>
