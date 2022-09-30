<template>
  <div class="mod-home">

    <!--头部组件-->
    <el-header
      style="height: initial;padding: 0 0 0 0; clear: both; margin-top: 6px"
      class="left">
      <!--<statistical-header ref="header" ></statistical-header>-->
      <statistical-header ref="header" @searchHandle="searchHandle"></statistical-header>
    </el-header>

    <div style="padding: 10px;margin-right:10px;width: 100%;display: flex;justify-content: center;">

      <div style="width: 20%;margin-left: 10px">
        <el-card :body-style="{padding: '0px'}">

          <div style="display: flex;justify-content: center;margin-top: 20px">
            <span style="font-size: 18px;font-weight: bold;color: #81d481;" v-text="security">798</span>
          </div>

          <div class="bottom" style="display: flex;justify-content: center;margin-top:10px; margin-bottom: 0px">
            <el-button type="text" class="button"
                       @click="clickPopup('security')"
                       style="width: 100%;background-color: #81d481;font-size: 16px;font-weight: bold;color: white;">治安隐患</el-button>
          </div>

        </el-card>
      </div>

      <div style="width: 20%;margin-left: 10px">
        <el-card :body-style="{padding: '0px'}">

          <div style="display: flex;justify-content: center;margin-top: 20px">
            <span style="font-size: 18px;font-weight: bold;color: #4eb6d4;" v-text="fire">0</span>
          </div>

          <div class="bottom" style="display: flex;justify-content: center;margin-top:10px; margin-bottom: 0px">
            <el-button type="text" class="button"
                       @click="clickPopup('fire')"
                       style="width: 100%;background-color: #4eb6d4;font-size: 16px;font-weight: bold;color: white;">消防隐患</el-button>
          </div>

        </el-card>
      </div>

      <div style="width: 20%;margin-left: 10px">
        <el-card :body-style="{padding: '0px'}">

          <div style="display: flex;justify-content: center;margin-top: 20px">
            <span style="font-size: 18px;font-weight: bold;color: #a74534;" v-text="trafficSafety">0</span>
          </div>

          <div class="bottom" style="display: flex;justify-content: center;margin-top:10px; margin-bottom: 0px">
            <el-button type="text" class="button"
                       @click="clickPopup('trafficSafety')"
                       style="width: 100%;background-color: #a74534;font-size: 16px;font-weight: bold;color: white;">交通隐患</el-button>
          </div>

        </el-card>
      </div>

      <div style="width: 20%;margin-left: 10px">
        <el-card :body-style="{padding: '0px'}">

          <div style="display: flex;justify-content: center;margin-top: 20px">
            <span style="font-size: 18px;font-weight: bold;color: #dcaf12;" v-text="manager">798</span>
          </div>

          <div class="bottom" style="display: flex;justify-content: center;margin-top:10px; margin-bottom: 0px">
            <el-button type="text" class="button"
                       @click="clickPopup('manager')"
                       style="width: 100%;background-color: #dcaf12;font-size: 16px;font-weight: bold;color: white;">管理隐患</el-button>
          </div>

        </el-card>
      </div>

      <div style="width: 20%;margin-left: 10px">
        <el-card :body-style="{padding: '0px'}">

          <div style="display: flex;justify-content: center;margin-top: 20px">
            <span style="font-size: 18px;font-weight: bold;color: #4a87e2;" v-text="other">798</span>
          </div>

          <div class="bottom" style="display: flex;justify-content: center;margin-top:10px; margin-bottom: 0px">
            <el-button type="text" class="button"
                       @click="clickPopup('other')"
                       style="width: 100%;background-color: #4a87e2;font-size: 16px;font-weight: bold;color: white;">矛盾纠纷</el-button>
          </div>

        </el-card>
      </div>

    </div>

    <div style="margin-top: 20px">
      <div ref="Street" class="chart" style="height:300px;width:100%;"></div>
    </div>

    <div style="">
      <div ref="TimePeriod" class="chart" style="height:300px;width:100%;"></div>
    </div>

    <!--弹窗-->
    <school-risk-card-view v-if="schoolRiskCardView" ref="schoolRiskCardView"></school-risk-card-view>


  </div>
</template>

<script>

import statisticalHeader from "./statistical-header";
import echarts from "echarts";
import schoolRiskCardView from "./schoolRiskCard-view";

export default {
  data() {
    return {

      //点击卡片弹窗的条件
      schoolRiskCardView: false,

      //搜索条件
      townId: '',
      platformTypeId: 5,
      startTime: "",
      endTime: "",

      fire: 0,
      manager: 0,
      other: 0,
      security: 0,
      trafficSafety: 0

    };
  },


  components: {
    "statistical-header": statisticalHeader,
    "school-risk-card-view": schoolRiskCardView
  },

  mounted() {
    this.mountedType();
    this.mountedStreet();
    this.mountedTimePeriod();
  },
  methods: {
    //统计类型
    mountedType(){
      this.$http({
        url: this.$http.adornUrl("/event/eventShare/statisticsTypeCount"),
        method: "get",
        params: this.$http.adornParams({
          townId: this.townId,
          platformTypeId: 5,
          startTime: this.startTime,
          endTime: this.endTime
        })
      }).then(res => {
          // console.log("/event/eventShare/statisticsTypeCount",res);
          this.fire = res.data.map.fire;
          this.manager = res.data.map.manager;
          this.other = res.data.map.other;
          this.security = res.data.map.security;
          this.trafficSafety = res.data.map.trafficSafety;
      })
    },

    //按镇街,初始化echart
    initStreetChart(x, y) {
      this.chart = echarts.init(this.$refs.Street, "macarons");

      this.chart.setOption({
        color: ['#3398DB'],
        title: {
          //text: "镇街维度隐患统计",
          left: "left",
          top: 10,
          bottom: 10,
          textStyle: {
            color: "black",
            fontWeight: "bolder"
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "1%",
          right: "5%",
          top: "12%",

          containLabel: true
        },
        xAxis: {
          type: "category",
          name: "镇街",
          data: x
        },
        yAxis: {
          type: "value",
          //name: "隐患数量",
          nameGap: 5,
        },
        series: [
          {
            name: "隐患数量",
            type: "bar",
            barWidth: '40%',
            label: {
              normal: {
                show: true,
                textBorderColor: "#333",
                textBorderWidth: 2,
                lineStyle:{
                  color:'#1e5fb6'
                }
              }
            },

            data: y
          }
        ]
      });
    },

    //按镇街,初始化数据
    mountedStreet() {

      var x = [];
      var y = [];

      this.$http({
        url: this.$http.adornUrl("/event/eventShare/statisticsTownCount"),
        method: "get",
        params: this.$http.adornParams({
          townId: this.townId,
          platformTypeId: 5,
          startTime: this.startTime,
          endTime: this.endTime
        })
      }).then(res => {
        // console.log("/event/eventShare/statisticsTownCount", res);
        if (res.data.list.length != 0) {
          res.data.list.forEach(item => {
            x.push(item.townName);
            y.push(item.count);
          });
          this.$nextTick(() => {
            this.initStreetChart(x, y);
          });
        }
      });
    },

    //按月统计,初始化echart
    initTimePeriodChart(x,y) {

      this.chart = echarts.init(this.$refs.TimePeriod, "macarons");

      this.chart.setOption({
        color: ['#3398DB'],
        title: {
          //text: "时间周期维度隐患统计",
          left: "left",
          top: 10,
          bottom: 10,
          textStyle: {
            color: "black",
            fontWeight: "bolder"
          }
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        grid: {
          left: "1%",
          right: "5%",
          top: "18%",
          containLabel: true
        },
        xAxis: [
          {
            //name: "月份",
            type: "category",
            boundaryGap: false,
            data: x
          }
        ],
        yAxis: [
          {
            type: "value",
            //name: "隐患数量"
          }
        ],
        series: [
          {
            name: "隐患数量",
            type: "line",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            areaStyle: { normal: {} },
            data: y
          }
        ]
      });
    },

    //按年月日统计,初始化数据
    mountedTimePeriod() {
      var x = [];
      var y = [];

      this.$http({
        url: this.$http.adornUrl("/event/eventShare/statisticsByTime"),
        method: "get",
        params: this.$http.adornParams({
          townId: this.townId,
          platformTypeId: 5,
          startTime: this.startTime,
          endTime: this.endTime
        })
      }).then(res => {
        // console.log("/event/eventShare/statisticsByTime", res);

        if(res.data.data != null && res.data.data.length > 0){

          if( res.data.data[0].column <200 && res.data.data.length === 12){
            //月
            var i = 1;
            for (let j = 0; j < res.data.data.length; j++) {
              res.data.data.forEach(item => {
                if (item.column === i) {
                  x.push(item.column+"月")
                  y.push(item.count);
                  ++i;
                }
              });
            }

            this.$nextTick(() => {
              this.initTimePeriodChart(x,y);
            });

          }else if(res.data.data[0].column <200 && res.data.data.length === 30){
            //天
            var i = 1;
            for (let j = 0; j < res.data.data.length; j++) {
              res.data.data.forEach(item => {
                if (item.column === i) {
                  x.push(item.column+"号")
                  y.push(item.count);
                  ++i;
                }
              });
            }

            this.$nextTick(() => {
              this.initTimePeriodChart(x,y);
            });

          }else if(res.data.data[0].column > 300){
            //年
            for (let j = 0; j < res.data.data.length; j++) {
              x.push(res.data.data[j].column);
              y.push(res.data.data[j].count);

            }

            this.$nextTick(() => {
              this.initTimePeriodChart(x,y);
            });

          }
        }

      });
    },

    //搜索
    searchHandle (objTime, objContent, shareTownId){
      // console.log("shareTownIdshareTownIdshareTownId",shareTownId)

      var startTime;
      var endTime;
      if(objTime != null && objTime != ''){
        // 时间不为空
        startTime = objTime[0]
        endTime = objTime[1]
      }else{
        startTime = ''
        endTime = ''
      }

      this.startTime = startTime;
      this.endTime = endTime;
      this.townId = shareTownId;

      //刷新
      this.mountedType();
      this.mountedStreet();
      this.mountedTimePeriod();

    },

    //点击弹窗
    clickPopup(flag){
      this.schoolRiskCardView = true;
      this.$nextTick(() => {
        this.$refs.schoolRiskCardView.init(flag,this.townId,this.platformTypeId,this.startTime,this.endTime)
      })
    }

  }
};
</script>

<style>

</style>

