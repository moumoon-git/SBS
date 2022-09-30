<!--@author：qcx-->
<template>
  <div>
    <el-main style="padding: 0 0px">
      <div class="contentStyle">
        <div width="100%" height="700" scrolling="auto" frameborder="0">
          <el-row
            :gutter="gutter"
            style="
              display: flex;
              align-items: center;
              justify-content: center;
              height: 80px;
              margin: 0;
              margin-right: 0;
            "
          >
            <el-col
              :span="17"
              style="justify-content: center; display: flex; padding: atuo 0"
            >
              <!-- 按选择分组方式显示日期选择组件-->
              <!-- 日-->
              <div style="position: relative">
                <el-date-picker
                  :picker-options="pickerOptions"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  v-if="showValue"
                  v-model="value"
                  @change="onDate"
                  :clearable="false"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </div>
              <div style="margin-left: 10px">
                <el-button type="primary" size="medium" @click="getData">统计</el-button>
              </div>
            </el-col>
          </el-row>
          <div style="text-align:center; margin-top: -20px;">
            <font class="alarm">时间跨度不得大于15天</font>
          </div>
          <!-- echarts图表 -->
          <div
            id="main"
            v-loading="onload"
            style="
              width: 100%;
              height: 600px;
              background-color:#F5F5F5;
            "
          >
          </div>
        </div>
      </div>
    </el-main>
  </div>
</template>

<script>
import { UrlMap } from "@/assets/js/common";
import echarts from 'echarts'
export default {
  name: "rollOnDuty",
  components: {},
  data() {
    return {
      onload: false,
      gutter: 20,
      /*
        * @lastAuthor qinchunxiang 
        * @lastDate 2020-10-16
        * @description  分组方式数据
        */
      options: [
        {
          value: "0",
          label: "按日",
        },
        {
          value: "1",
          label: "按周",
        },
        {
          value: "2",
          label: "按月",
        },
        {
          value: "3",
          label: "按年",
        },
      ], 
      /*
      下面是element时间控件
      */
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.pickerMinDate = minDate.getTime();
          if (maxDate) {
            this.pickerMinDate = "";
          }
        },
        disabledDate: (time) => {
          if (this.pickerMinDate !== "") {
            let one = 30 * 24 * 3600 * 1000;
            let minTime = this.pickerMinDate - one;
            let maxTime = this.pickerMinDate + one;
            if (maxTime > new Date()) {
              maxTime = new Date();
            }
            return time.getTime() < minTime || time.getTime() > maxTime;
          }
          return time.getTime() > Date.now();
        },
      },
      showValue: true, //日日期是否显示
      value: [], //日日期
      monthData: "", //月日期查询
      myChart: null,
      // 指定图表的配置项
      option: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },

        /*
        * @lastAuthor qinchunxiang 
        * @lastDate 2020-10-16
        * @description  显示在岗率信息框
        */
        formatter: function (params) {
          var res = "<div><p>" + params[0].name + "</p></div>";
          for (var i = 0; i < params.length; i++) {
            res += "<p>" + params[i].seriesName + "：" + params[i].data;
            if (params[i].seriesName == "在岗率") {
              res += "%</p>";
            } else {
              res += "</p>";
            }
          }
          return res;
        },

         /*
        * @lastAuthor qinchunxiang 
        * @lastDate 2020-10-16
        * @description  echats图表坐标轴及内容
        */
        xAxis: {
          type: 'category',
          name: "日期",
          axisLine: {
            lineStyle: {
              color: "#191970",
            },
          },
          data: [],
        },
        yAxis: [
          {
            name: "在岗人数",
            axisLine: {
              lineStyle: {
                color: "#191970",
              },
            },
            interval: 10,
          },
          {
            name: "在岗率",
            axisLine: {
              lineStyle: {
                color: "#191970",
              },
              formatter: "{value} %",
            },
            min: 0,
            max: 100,
            interval: 10,
          },
        ],
        series: [
          {
            name: "在岗人数",
            data: [],
            type: "bar",
            barWidth: 60, //柱图宽度
          },
          {
            name: "在岗率",
            type: "line",
            data: [],
            barWidth: 60,
            yAxisIndex: 1,
          },
        ],
      },
    };
  },
  mounted() {
    this.myChart =echarts.init(document.getElementById("main"));
  },
  created() {
    this.getTime();
    this.value[0] = this.formatDate(
      new Date().getTime() - 1000 * 60 * 60 * 24 * 15
    );
    this.value[1] = this.formatDate(new Date().getTime());
    this.getData();
  },
  methods: {
    getTime() {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let s = date.getMonth();
      let time = y + "-" + m;
      let time2 = y + "-" + s;
      console.log(time);
      let test = [];
      test.push(time2);
      test.push(time);
      this.monthData = test;
    },

     /*
     * @lastAuthor qinchunxiang 
     * @lastDate 2020-10-16
     * @description  获取图表数据,调用echarts的showLoading方法.
     */
    getData(time) {
      if (this.onload) {
        return;
      }
      this.onload = true;
      this.$api
        .getConferenceDutyStatistics({
          startDate: this.formatDate(this.value[0]),
          endDate: this.formatDate(this.value[1]),
        })
        .then((res) => {
          this.onload = false;
          console.log(res);
          if (res.errorcode === 0) {
            this.myChart.showLoading({
              text: "loading", //加载时候的文本
              color: "#BF2A2A", //加载时候小圆圈的颜色
              textColor: "black", //加载时候文本颜色
              maskColor: "white", //加载时候的背景颜色
            });
            // this.answerList = res.data || [];
            this.option.xAxis.data = res.data.category;
            this.option.series[0].data = res.data.countData;
            this.option.series[1].data = res.data.rateData;
            setTimeout(()=>{
               this.myChart.hideLoading();
            },2000)
            this.myChart.setOption(this.option);
          }
          // console.log(res.data.category)
        });
    },
    
    /*
     * @lastAuthor qinchunxiang 
     * @lastDate 2020-10-16
     * @description 获取当前时间
     */
    formatDate(date) {
      date || (date = 0);
      date = new Date(date);
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString();
      var day = date.getDate().toString();
      if (month.length == 1) {
        month = "0" + month;
      }
      if (day.length == 1) {
        day = "0" + day;
      }
      var dateTime = year + "-" + month + "-" + day;
      return dateTime;
    },
    /**
     * @lastAuthor qinchunxiang 
     * @lastDate 2020-10-16
     * @description 当时间跨度大于十五天时,则出现提示
     */
    onDate(value) {
      if (!value || !value.length) {
        return;
      }
      var startTime = new Date(value[0]).getTime() / 1000 / 60 / 60 / 24;
      var endTime = new Date(value[1]).getTime() / 1000 / 60 / 60 / 24;
      if(endTime-startTime>15){
        this.value = []
        return this.$message.error("时间不得大于15天")
      }
    },
  },
};
</script>


<style scoped>
.navsBar {
  margin: 0 30px;
  background-color: white;
  box-sizing: border-box;
  border: 1px solid rgba(219, 219, 219, 1);
  border-radius: 3px;
}
.export {
  background-color: #f5f7fa;
  color: #909399;
  vertical-align: middle;
  height: 40px;
  line-height: 40px;
  display: inline-block;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 10px;
  white-space: nowrap;
  font-size: 14px;
}
.area {
  text-align: left;
}
.type {
  text-align: right;
}
.areaName {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(162, 162, 162, 1);
}
.contentStyle {
  height: 700px;
  /* margin: 0 10px 0 10px; */
  background-color:#F5F5F5;
  box-sizing: border-box;
  border: 1px solid rgba(219, 219, 219, 1);
  border-radius: 3px;
}
/* 
@lastAuthor qinchunxiang 
* @lastDate 2020-10-16
* @description 当时间跨度大于十五天时,则出现提示
*/
.alarm {
  color: red;
}
</style>
