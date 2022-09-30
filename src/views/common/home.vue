<template>
  <div class="mod-home">
    <div>
      <div style="margin-left:10px;margin-top:20px;">请选择时间范围</div>
      <div style="display:flex;justify-content:center;margin-top:10px;">
        <el-date-picker
          unlink-panels
          v-model="startTimeHazard"
          type="date"
          placeholder="开始日期"
          style="width:35%;height:30px;"
          value-format="yyyy-MM-dd"
          clearable
          :picker-options="startPickerOptionsHazard"
        ></el-date-picker>
        <span style="line-height:35px;margin-left:5px;">至</span>
        <el-date-picker
          unlink-panels
          v-model="endTimeHazard"
          type="date"
          placeholder="结束日期"
          style="width:35%;height:30px;margin-left:5px;"
          value-format="yyyy-MM-dd"
          clearable
          :picker-options="endPickerOptionsHazard"
        ></el-date-picker>
        <div
          style="border-radius:5px;margin-left:10px;border:1px solid #d3d7db;line-height:30px;padding:0 10px;color:gray;"
          @click="searchHazard"
        >搜索</div>
      </div>

      <div ref="Hazard" class="chart" style="height:600px;width:100%;"></div>
    </div>

    <div>
      <div style="margin-left:10px;margin-top:20px;">请选择时间范围</div>
      <div style="display:flex;justify-content:center;margin-top:10px;">
        <el-date-picker
          unlink-panels
          v-model="startTimeStreet"
          type="date"
          placeholder="开始日期"
          style="width:35%;height:30px;"
          value-format="yyyy-MM-dd"
          clearable
          :picker-options="startPickerOptionsStreet"
        ></el-date-picker>
        <span style="line-height:35px;margin-left:5px;">至</span>
        <el-date-picker
          unlink-panels
          v-model="endTimeStreet"
          type="date"
          placeholder="结束日期"
          style="width:35%;height:30px;margin-left:5px;"
          value-format="yyyy-MM-dd"
          clearable
          :picker-options="endPickerOptionsStreet"
        ></el-date-picker>
        <div
          style="border-radius:5px;margin-left:10px;border:1px solid #d3d7db;line-height:30px;padding:0 10px;color:gray;"
          @click="searchStreet"
        >搜索</div>
      </div>

      <div ref="Street" class="chart" style="height:600px;width:100%;"></div>
    </div>

    <!-- <div ref="Street" style="height:600px;width:100%" /> -->

    <div>
      <div style="margin-left:10px;margin-top:20px;">请选择时间范围</div>
      <div style="display:flex;justify-content:center;margin-top:10px;">
        <el-date-picker
          unlink-panels
          v-model="startTimeCommunity"
          type="date"
          placeholder="开始日期"
          style="width:35%;height:30px;"
          value-format="yyyy-MM-dd"
          clearable
          :picker-options="startPickerOptionsCommunity"
        ></el-date-picker>
        <span style="line-height:35px;margin-left:5px;">至</span>
        <el-date-picker
          unlink-panels
          v-model="endTimeCommunity"
          type="date"
          placeholder="结束日期"
          style="width:35%;height:30px;margin-left:5px;"
          value-format="yyyy-MM-dd"
          clearable
          :picker-options="endPickerOptionsCommunity"
        ></el-date-picker>
        <div
          style="border-radius:5px;margin-left:10px;border:1px solid #d3d7db;line-height:30px;padding:0 10px;color:gray;"
          @click="searchCommunity"
        >搜索</div>
      </div>

      <div ref="Community" class="chart" style="height:600px;width:100%;"></div>
    </div>

    <!-- <div ref="PropertyCompany" style="height:600px;width:100%" />  -->

    <div>
      <div style="margin-left:10px;margin-top:20px;">请选择时间范围</div>
      <div style="display:flex;justify-content:center;margin-top:10px;">
        <el-date-picker
          unlink-panels
          v-model="startTimeEndOfWork"
          type="date"
          placeholder="开始日期"
          style="width:35%;height:30px;"
          value-format="yyyy-MM-dd"
          clearable
          :picker-options="startPickerOptionsEndOfWork"
        ></el-date-picker>
        <span style="line-height:35px;margin-left:5px;">至</span>
        <el-date-picker
          unlink-panels
          v-model="endTimeEndOfWork"
          type="date"
          placeholder="结束日期"
          style="width:35%;height:30px;margin-left:5px;"
          value-format="yyyy-MM-dd"
          clearable
          :picker-options="endPickerOptionsEndOfWork"
        ></el-date-picker>
        <div
          style="border-radius:5px;margin-left:10px;border:1px solid #d3d7db;line-height:30px;padding:0 10px;color:gray;"
          @click="searchEndOfWork"
        >搜索</div>
      </div>

      <div ref="EndOfWork" class="chart" style="height:600px;width:100%;"></div>
    </div>

    <div>
      <div style="margin-left:10px;margin-top:20px;">请选择时间范围</div>
      <div style="display:flex;justify-content:center;margin-top:10px;">
        <el-date-picker
          unlink-panels
          v-model="year"
          type="year"
          placeholder="选择年"
          style="height:30px;"
          value-format="yyyy"
        ></el-date-picker>
        <div
          style="border-radius:5px;margin-left:5px;border:1px solid #d3d7db;line-height:30px;padding:0 5px;color:gray;"
          @click="searchTimePeriod"
        >搜索</div>
      </div>

      <div ref="TimePeriod" class="chart" style="height:600px;width:100%;"></div>
    </div>

    <div>
      <div style="margin-left:10px;margin-top:20px;">请选择时间范围</div>
      <div style="display:flex;justify-content:center;margin-top:10px;">
        <el-date-picker
          unlink-panels
          v-model="startTimeOrderRatio"
          type="date"
          placeholder="开始日期"
          size="mini"
          style="width:35%;height:30px;"
          value-format="yyyy-MM-dd"
          clearable
          :picker-options="startPickerOptionsOrderRatio"
        ></el-date-picker>
        <span style="line-height:30px;margin-left:5px;">至</span>
        <el-date-picker
          unlink-panels
          v-model="endTimeOrderRatio"
          type="date"
          placeholder="结束日期"
          size="mini"
          style="width:35%;height:30px;margin-left:5px;"
          value-format="yyyy-MM-dd"
          clearable
          :picker-options="endPickerOptionsOrderRatio"
        ></el-date-picker>
        <div
          style="border-radius:5px;margin-left:5px;border:1px solid #d3d7db;line-height:30px;padding:0 5px;color:gray;"
          @click="searchOrderRatio"
        >搜索</div>
      </div>

      <div ref="OrderRatio" class="chart" style="height:600px;width:100%;"></div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import Cookies from "js-cookie";
//require("_echarts@4.8.0@echarts/theme/macarons");
export default {
  data() {
    return {
      startPickerOptionsHazard: {
        disabledDate: time => {
          return time.getTime() > Date.now();
        }
      },
      endPickerOptionsHazard: {
        disabledDate: time => {
          return time.getTime() < this.startTimeHazard;
        }
      },
      startPickerOptionsStreet: {
        disabledDate: time => {
          return time.getTime() > Date.now();
        }
      },
      endPickerOptionsStreet: {
        disabledDate: time => {
          return time.getTime() < this.startTimeStreet;
        }
      },
      startPickerOptionsCommunity: {
        disabledDate: time => {
          return time.getTime() > Date.now();
        }
      },
      endPickerOptionsCommunity: {
        disabledDate: time => {
          return time.getTime() < this.startTimeCommunity;
        }
      },
      startPickerOptionsEndOfWork: {
        disabledDate: time => {
          return time.getTime() > Date.now();
        }
      },
      endPickerOptionsEndOfWork: {
        disabledDate: time => {
          return time.getTime() < this.startTimeEndOfWork;
        }
      },
      startPickerOptionsOrderRatio: {
        disabledDate: time => {
          return time.getTime() > Date.now();
        }
      },
      endPickerOptionsOrderRatio: {
        disabledDate: time => {
          return time.getTime() < this.startTimeOrderRatio;
        }
      },

      startTimeHazard: "",
      endTimeHazard: "",
      startTimeStreet: "",
      endTimeStreet: "",
      startTimeCommunity: "",
      endTimeCommunity: "",
      startTimeEndOfWork: "",
      endTimeEndOfWork: "",
      startTimeOrderRatio: "",
      endTimeOrderRatio: "",
      year: ""
    };
  },
  mounted() {
    var that = this;
    this.$nextTick(() => {
      that.mountedHazard();
      that.mountedStreet();
      that.mountedCommunity();
      // that.initPropertyCompanyChart()
      that.mountedEndOfWork();
      that.mountedTimePeriod();
      that.mountedOrderRatio();
    });
  },
  methods: {
    searchHazard() {
      var x = [],
        y = [];
      if (!this.startTimeHazard || !this.endTimeHazard) {
        this.$message.error("开始时间或结束时间不能为空");
      }
      this.$http({
        url: this.$http.adornUrl(
          "/event/eventShare/statisticalEventTypeNameCount"
        ),
        method: "get",
        params: this.$http.adornParams({
          // id:this.$store.state.user.platformId
          startTime: this.startTimeHazard,
          endTime: this.endTimeHazard,
          token: Cookies.get("token")
        })
      }).then(res => {
        this.$refs.Hazard.removeAttribute("_echarts_instance_");
        // console.log("/event/eventShare/statisticalEventTypeNameCount", res);
        if (res.data.list.length === 0) {
          this.$message({
            message: "该时间范围内隐患数量为空",
            type: "warning"
          });
          this.$refs.Hazard.innerHTML = "";
          this.$refs.Hazard.setAttribute(
            "style",
            `display: flex;justify-content: center;align-items: center;height:600px;width:100%;`
          );
          this.$refs.Hazard.innerHTML = "<div>隐患暂无数据</div>";
        } else {
          res.data.list.forEach(item => {
            if (!item.eventTypeName) {
              x.push({ value: "其他" });
            } else {
              x.push({ value: item.eventTypeName });
            }

            y.push({
              name: "",
              value: item.count,
              xAxis: 0,
              yAxis: item.count,
              symbolSize: 40
            });
          });
          // console.log("x,y", x, y);
          this.$refs.Hazard.innerHTML = "";
          this.$refs.Hazard.setAttribute("style", `height:600px;width:100%;`);
          this.$nextTick(() => {
            this.initHazardChart(x, y);
          });
        }
      });
    },
    initHazardChart(x, y) {
      // console.log("this.$refs.Hazard", this.$refs.Hazard);
      this.chart = echarts.init(this.$refs.Hazard, "macarons");

      this.chart.setOption({
        title: {
          text: "隐患种类维度统计",
          left: "center",
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
          },

          formatter: function(params) {
            var tar = params[0];
            return tar.name + "<br/>" + tar.seriesName + " : " + tar.value;
          }
        },
        grid: {
          left: "1%",
          right: "5%",
          top: "20%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          name: "隐患种类",
          //   nameGap:5,
          axisLine: {
            show: false
          },
          axisTick: {
            length: 0
          },
          // axisLabel:{
          //     interval: 0,
          //     textStyle: {
          //         color: '#00c5d7'
          //     },
          //     formatter: function(value) {
          //         return value.split("").join("\n");
          // }},
          data: x
        },
        yAxis: {
          type: "value",
          name: "隐患数量"
        },
        series: [
          {
            data: y,
            type: "bar",
            name: "隐患数量",
            label: {
              normal: {
                show: true,
                textBorderColor: "#333",
                textBorderWidth: 2
              }
            }
            //   markPoint : {
            //           symbol:'pin',
            //           data : [
            //               {name : '', value : 120, xAxis: 0, yAxis: 120,symbolSize:40},
            //               {name : '', value : 200, xAxis: 1, yAxis: 200,symbolSize:40},
            //               {name : '', value : 150, xAxis: 2, yAxis: 150,symbolSize:40},
            //               {name : '', value : 80, xAxis: 3, yAxis: 80,symbolSize:40},
            //               {name : '', value : 70, xAxis: 4, yAxis: 70,symbolSize:40},
            //               {name : '', value : 110, xAxis: 5, yAxis: 110,symbolSize:40},
            //               {name : '', value : 130, xAxis: 6, yAxis: 130,symbolSize:40}
            //           ]
            //       }
          }
        ]
      });
    },
    mountedHazard() {
      var x = [],
        y = [];
      this.$http({
        url: this.$http.adornUrl(
          "/event/eventShare/statisticalEventTypeNameCount"
        ),
        method: "get",
        params: this.$http.adornParams({
          // id:this.$store.state.user.platformId
          token: Cookies.get("token")
        })
      }).then(res => {
        // console.log("/event/eventShare/statisticalEventTypeNameCount", res);
        if (res.data.list.length != 0) {
          res.data.list.forEach(item => {
            if (!item.eventTypeName) {
              x.push({ value: "其他" });
            } else {
              x.push({ value: item.eventTypeName });
            }

            y.push({
              name: "",
              value: item.count,
              xAxis: 0,
              yAxis: item.count,
              symbolSize: 40
            });
          });
          // console.log("x,y", x, y);
          this.$nextTick(() => {
            this.initHazardChart(x, y);
          });
        } else {
          this.$refs.Hazard.setAttribute(
            "style",
            `display: flex;justify-content: center;align-items: center;height:600px;width:100%;`
          );
          this.$refs.Hazard.innerHTML = "<div>隐患暂无数据</div>";
        }
      });
    },
    searchStreet() {
      var x = [],
        y = [];
      if (!this.startTimeStreet || !this.endTimeStreet) {
        this.$message.error("开始时间或结束时间不能为空");
      }
      this.$http({
        url: this.$http.adornUrl("/event/eventShare/statisticsTown"),
        method: "get",
        params: this.$http.adornParams({
          // id:this.$store.state.user.platformId
          startTime: this.startTimeStreet,
          endTime: this.endTimeStreet,
          token: Cookies.get("token")
        })
      }).then(res => {
        this.$refs.Street.removeAttribute("_echarts_instance_");
        // console.log("/event/eventShare/statisticsTown", res);
        if (res.data.list.length === 0) {
          this.$message({
            message: "该时间范围内隐患数量为空",
            type: "warning"
          });
          this.$refs.Street.innerHTML = "";
          this.$refs.Street.setAttribute(
            "style",
            `display: flex;justify-content: center;align-items: center;height:600px;width:100%;`
          );
          this.$refs.Street.innerHTML = "<div>隐患暂无数据</div>";
        } else {
          res.data.list.forEach(item => {
            x.push(item.townName);
            y.push(item.count);
          });
          // console.log("x,y", x, y);
          this.$refs.Street.innerHTML = "";
          this.$refs.Street.setAttribute("style", `height:600px;width:100%;`);
          this.$nextTick(() => {
            this.initStreetChart(x, y);
          });
        }
      });
    },
    initStreetChart(x, y) {
      this.chart = echarts.init(this.$refs.Street, "macarons");

      this.chart.setOption({
        title: {
          text: "镇街维度隐患统计",
          left: "center",
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
        // legend: {
        //     data: ['2011年', '2012年']
        // },
        grid: {
          left: "1%",
          right: "5%",
          top: "12%",

          containLabel: true
        },
        xAxis: {
          type: "category",
          name: "镇街",
          //   nameGap:5
          data: x
        },
        yAxis: {
          type: "value",
          name: "隐患数量",
          nameGap: 5
        },
        series: [
          {
            name: "隐患数量",
            type: "bar",
            label: {
              normal: {
                show: true,
                textBorderColor: "#333",
                textBorderWidth: 2
              }
            },

            data: y
          }
        ]
      });
    },

    mountedStreet() {
      var x = [],
        y = [];
      this.$http({
        url: this.$http.adornUrl("/event/eventShare/statisticsTown"),
        method: "get",
        params: this.$http.adornParams({
          // id:this.$store.state.user.platformId
          token: Cookies.get("token")
        })
      }).then(res => {
        // console.log("/event/eventShare/statisticsTown", res);
        // if(res.data.list.length!=0){
        //     res.data.list.forEach(item=>{
        //     if(!item.eventTypeName){
        //     x.push({value:'其他'})
        //     } else {
        //     x.push({value:item.eventTypeName})
        //     }

        //     y.push({name : '', value : item.count, xAxis: 0, yAxis: item.count,symbolSize:40})
        //     })
        //     console.log('x,y',x,y)
        //     this.$nextTick(() => {
        //         this.initHazardChart(x,y)
        //     })
        // } else {
        //     this.$refs.Hazard.setAttribute('style',`display: flex;justify-content: center;align-items: center;height:600px;width:100%;`)
        //     this.$refs.Hazard.innerHTML='<div>隐患暂无数据</div>'
        // }
        if (res.data.list.length != 0) {
          res.data.list.forEach(item => {
            x.push(item.townName);
            y.push(item.count);
          });
          this.$nextTick(() => {
            this.initStreetChart(x, y);
          });
        } else {
          this.$refs.Street.setAttribute(
            "style",
            `display: flex;justify-content: center;align-items: center;height:600px;width:100%;`
          );
          this.$refs.Street.innerHTML = "<div>隐患暂无数据</div>";
        }
      });
    },

    searchCommunity() {
      var x = [],
        y = [];
      if (!this.startTimeCommunity || !this.endTimeCommunity) {
        this.$message.error("开始时间或结束时间不能为空");
      }
      this.$http({
        url: this.$http.adornUrl(
          "/event/eventShare/statisticalEventCommunityCount"
        ),
        method: "get",
        params: this.$http.adornParams({
          // id:this.$store.state.user.platformId
          startTime: this.startTimeCommunity,
          endTime: this.endTimeCommunity,
          token: Cookies.get("token")
        })
      }).then(res => {
        this.$refs.Community.removeAttribute("_echarts_instance_");
        // console.log("/event/eventShare/statisticalEventCommunityCount", res);
        if (res.data.list.length === 0) {
          this.$message({
            message: "该时间范围内隐患数量为空",
            type: "warning"
          });
          this.$refs.Community.innerHTML = "";
          this.$refs.Community.setAttribute(
            "style",
            `display: flex;justify-content: center;align-items: center;height:600px;width:100%;`
          );
          this.$refs.Community.innerHTML = "<div>小区暂无数据</div>";
        } else {
          res.data.list.forEach(item => {
            if (!item.platformName) {
              y.push("其他");
            } else {
              y.push(item.platformName);
            }

            x.push(item.count);
          });
          // console.log("x,y", x, y);
          this.$refs.Community.innerHTML = "";
          this.$refs.Community.setAttribute(
            "style",
            `height:600px;width:100%;`
          );
          this.$nextTick(() => {
            // setTimeout(() => {
            this.initCommunityChart(x, y);
            // }, 3000);
          });
        }
      });
    },
    initCommunityChart(x, y) {
      this.chart = echarts.init(this.$refs.Community, "macarons");

      this.chart.setOption({
        title: {
          text: "单位维度隐患统计",
          left: "center",
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
        // legend: {
        //     data: ['2011年', '2012年']
        // },
        grid: {
          left: "1%",
          right: "5%",
          top: "12%",

          containLabel: true
        },
        xAxis: {
          type: "value",
          name: "隐患数量"
          //   nameGap:5
        },
        yAxis: {
          type: "category",
          data: y,
          name: "单位"
          //   nameGap:5
        },
        series: [
          {
            name: "隐患数量",
            type: "bar",
            label: {
              normal: {
                show: true,
                textBorderColor: "#333",
                textBorderWidth: 2
              }
            },

            data: x
          }
        ]
      });
    },
    mountedCommunity() {
      var x = [],
        y = [];
      this.$http({
        url: this.$http.adornUrl(
          "/event/eventShare/statisticalEventCommunityCount"
        ),
        method: "get",
        params: this.$http.adornParams({
          // id:this.$store.state.user.platformId
          token: Cookies.get("token")
        })
      }).then(res => {
        // console.log("/event/eventShare/statisticalEventCommunityCount", res);
        if (res.data.list.length != 0) {
          res.data.list.forEach(item => {
            if (!item.platformName) {
              y.push("其他");
            } else {
              y.push(item.platformName);
            }

            x.push(item.count);
          });
          // console.log("x,y", x, y);
          this.$nextTick(() => {
            this.initCommunityChart(x, y);
          });
        } else {
          this.$refs.Community.setAttribute(
            "style",
            `display: flex;justify-content: center;align-items: center;height:600px;width:100%;`
          );
          this.$refs.Community.innerHTML = "<div>小区暂无数据</div>";
        }
      });
    },

    initPropertyCompanyChart() {
      this.chart = echarts.init(this.$refs.PropertyCompany, "macarons");

      this.chart.setOption({
        title: {
          text: "物业公司维度隐患统计",
          left: "center",
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
        // legend: {
        //     data: ['2011年', '2012年']
        // },
        grid: {
          left: "1%",
          right: "5%",
          top: "12%",

          containLabel: true
        },
        xAxis: {
          type: "value",
          name: "隐患数量"
          //   nameGap:5
        },
        yAxis: {
          type: "category",
          data: [
            "富丽花园",
            "锦绣江南",
            "御景豪庭",
            "裕丰名苑",
            "阳光海岸",
            "富丽花园",
            "锦绣江南",
            "御景豪庭",
            "裕丰名苑",
            "阳光海岸",
            "富丽花园",
            "锦绣江南",
            "御景豪庭",
            "裕丰名苑",
            "阳光海岸"
          ],
          name: "小区类型"
          //   nameGap:5
        },
        series: [
          {
            name: "隐患数量",
            type: "bar",
            label: {
              normal: {
                show: true,
                textBorderColor: "#333",
                textBorderWidth: 2
              }
            },

            data: [
              182,
              234,
              290,
              1049,
              1317,
              182,
              234,
              290,
              1049,
              1317,
              182,
              234,
              290,
              1049,
              1317
            ]
          }
        ]
      });
    },
    searchEndOfWork() {
      var data = [0];
      if (!this.startTimeEndOfWork || !this.endTimeEndOfWork) {
        this.$message.error("开始时间或结束时间不能为空");
      }
      this.$http({
        url: this.$http.adornUrl(
          "/event/eventShare/statisticalEventStatusCount"
        ),
        method: "get",
        params: this.$http.adornParams({
          // id:this.$store.state.user.platformId
          beginTime: this.startTimeEndOfWork,
          endTime: this.endTimeEndOfWork,
          token: Cookies.get("token")
        })
      }).then(res => {
        this.$refs.EndOfWork.removeAttribute("_echarts_instance_");
        // console.log("/event/eventShare/statisticalEventStatusCount", res);
        if (
          res.data.data.every(item => {
            return item.count === 0;
          })
        ) {
          this.$message({
            message: "该时间范围内隐患数量为空",
            type: "warning"
          });
          this.$refs.EndOfWork.innerHTML = "";
          this.$refs.EndOfWork.setAttribute(
            "style",
            `display: flex;justify-content: center;align-items: center;height:600px;width:100%;`
          );
          this.$refs.EndOfWork.innerHTML = "<div>工单状态暂无数据</div>";
        } else {
          res.data.data.forEach(item => {
            if (item.column != 6) {
              data[0] += item.count;
            }

            switch (item.column) {
              case 5:
                data[5] = item.count;
                break;
              case 1:
                data[1] = item.count;
                break;
              case 2:
                data[2] = item.count;
                break;
              case 3:
                data[3] = item.count;
                break;
              case 4:
                data[4] = item.count;
                break;
            }
          });
          // console.log("data", data);
          this.$refs.EndOfWork.innerHTML = "";
          this.$refs.EndOfWork.setAttribute(
            "style",
            `height:600px;width:100%;`
          );
          this.$nextTick(() => {
            this.initEndOfWorkChart(data);
          });
        }
      });
    },
    initEndOfWorkChart(data) {
      this.chart = echarts.init(this.$refs.EndOfWork, "macarons");

      this.chart.setOption({
        title: {
          text: "工单状态维度隐患统计",
          left: "center",
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
          top: "20%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          name: "工单状态",
          nameGap: 1,
          axisLine: {
            show: false
          },
          axisTick: {
            length: 0
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: "#00c5d7"
            }
            //     formatter: function(value) {
            //         return value.split("").join("\n");
            // }
          },
          data: [
            { value: "总数量" },
            { value: "已完结" },
            { value: "待核实" },
            { value: "核实中" },
            { value: "待处理" },
            { value: "处理中" }
          ]
        },
        yAxis: {
          type: "value",
          name: "隐患数量"
          // max:90
        },
        series: [
          {
            data: data,
            type: "bar",
            name: "隐患数量",
            label: {
              normal: {
                show: true,
                textBorderColor: "#333",
                textBorderWidth: 2
              }
            }
            // markPoint : {
            //         symbol:'pin',
            //         data : y
            //     }
          }
        ]
      });
    },
    mountedEndOfWork() {
      var data = [0];
      this.$http({
        url: this.$http.adornUrl(
          "/event/eventShare/statisticalEventStatusCount"
        ),
        method: "get",
        params: this.$http.adornParams({
          // id:this.$store.state.user.platformId
          token: Cookies.get("token")
        })
      }).then(res => {
        // console.log("/event/eventinfo/getCount", res);
        if (
          !res.data.data.every(item => {
            return item.count === 0;
          })
        ) {
          res.data.data.forEach(item => {
            if (item.column != 6) {
              data[0] += item.count;
            }

            switch (item.column) {
              case 5:
                data[5] = item.count;
                break;
              case 1:
                data[1] = item.count;
                break;
              case 2:
                data[2] = item.count;
                break;
              case 3:
                data[3] = item.count;
                break;
              case 4:
                data[4] = item.count;
                break;
            }
          });
          // console.log("123", data);
          // console.log("data", data);
          this.$nextTick(() => {
            this.initEndOfWorkChart(data);
          });
        } else {
          this.$refs.EndOfWork.setAttribute(
            "style",
            `display: flex;justify-content: center;align-items: center;height:600px;width:100%;`
          );
          this.$refs.EndOfWork.innerHTML = "<div>工单状态暂无数据</div>";
        }
      });
    },

    searchTimePeriod() {
      var x = [],
        y = [];

      this.$http({
        url: this.$http.adornUrl("/event/eventShare/statisticsMonth"),
        method: "get",
        params: this.$http.adornParams({
          // id:this.$store.state.user.platformId
          year: this.year,
          token: Cookies.get("token")
        })
      }).then(res => {
        this.$refs.TimePeriod.removeAttribute("_echarts_instance_");
        // console.log("/event/eventShare/statisticsMonth", res);
        if (
          res.data.data.every(item => {
            return item.count === 0;
          })
        ) {
          this.$message({
            message: "该时间范围内隐患数量为空",
            type: "warning"
          });
          this.$refs.TimePeriod.innerHTML = "";
          this.$refs.TimePeriod.setAttribute(
            "style",
            `display: flex;justify-content: center;align-items: center;height:600px;width:100%;`
          );
          this.$refs.TimePeriod.innerHTML = "<div>时间周期暂无数据</div>";
        } else {
          var i = 1;
          for (let j = 0; j < res.data.data.length; j++) {
            res.data.data.forEach(item => {
              if (item.column === i) {
                y.push(item.count);
                ++i;
              }
            });
          }
          // console.log("x,y", x, y);
          this.$refs.TimePeriod.innerHTML = "";
          this.$refs.TimePeriod.setAttribute(
            "style",
            `height:600px;width:100%;`
          );

          this.$nextTick(() => {
            this.initTimePeriodChart(y);
          });
        }
      });
    },
    initTimePeriodChart(y) {
      this.chart = echarts.init(this.$refs.TimePeriod, "macarons");

      this.chart.setOption({
        title: {
          text: "时间周期维度隐患统计",
          left: "center",
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
            name: "月份",
            type: "category",
            boundaryGap: false,
            data: [
              "一月",
              "二月",
              "三月",
              "四月",
              "五月",
              "六月",
              "七月",
              "八月",
              "九月",
              "十月",
              "十一月",
              "十二月"
            ]
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "隐患数量"
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
    mountedTimePeriod() {
      var x = [],
        y = [];
      this.$http({
        url: this.$http.adornUrl("/event/eventShare/statisticsMonth"),
        method: "get",
        params: this.$http.adornParams({
          // id:this.$store.state.user.platformId
          token: Cookies.get("token"),
          year: this.year
        })
      }).then(res => {
        // console.log("/event/eventShare/statisticsMonth", res);
        if (
          !res.data.data.every(item => {
            return item.count === 0;
          })
        ) {
          var i = 1;
          for (let j = 0; j < res.data.data.length; j++) {
            res.data.data.forEach(item => {
              if (item.column === i) {
                y.push(item.count);
                ++i;
              }
            });
          }
          // console.log("x,y", x, y);

          this.$nextTick(() => {
            this.initTimePeriodChart(y);
          });
        } else {
          this.$refs.TimePeriod.setAttribute(
            "style",
            `display: flex;justify-content: center;align-items: center;height:600px;width:100%;`
          );
          this.$refs.TimePeriod.innerHTML = "<div>时间周期暂无数据</div>";
        }
      });
    },

    searchOrderRatio() {
      var x = [],
        y1 = [],
        y2 = [];
      if (!this.startTimeOrderRatio || !this.endTimeOrderRatio) {
        this.$message.error("开始时间或结束时间不能为空");
      }
      this.$http({
        url: this.$http.adornUrl(
          "/event/eventShare/statisticalOrderRatioCount"
        ),
        method: "get",
        params: this.$http.adornParams({
          // id:this.$store.state.user.platformId
          beginTime: this.startTimeOrderRatio,
          endTime: this.endTimeOrderRatio,
          token: Cookies.get("token")
        })
      }).then(res => {
        this.$refs.OrderRatio.removeAttribute("_echarts_instance_");
        // console.log("/event/eventShare/statisticalOrderRatioCount", res);
        if (res.data.outRange.length === 0) {
          this.$message({
            message: "该时间范围内隐患数量为空",
            type: "warning"
          });
        } else {
          res.data.outRange.forEach(item => {
            if (!item.platformName) {
              x.push("其它");
            } else {
              x.push(item.platformName);
            }
            y2.push(item.count / res.data.total);
            y1.push(1 - item.count / res.data.total);
          });
          this.$refs.OrderRatio.innerHTML = "";
          this.$refs.OrderRatio.setAttribute(
            "style",
            `height:600px;width:100%;`
          );
          this.$nextTick(() => {
            this.initOrderRatioChart(x, y1, y2);
          });
        }
      });
    },
    initOrderRatioChart(x, y1, y2) {
      this.chart = echarts.init(this.$refs.OrderRatio, "macarons");

      this.chart.setOption({
        // backgroundColor: '#2c343c',
        grid: {
          left: 12,
          right: "6%",
          top: "100",
          containLabel: true
        },
        title: {
          text: "物业公司接单比例",
          left: "left",
          top: 20,
          textStyle: {
            color: "black",
            fontWeight: "bolder"
          }
        },

        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} "
        },
        legend: {
          data: ["已接受", "超出范围"]
        },
        xAxis: [
          {
            name: "镇街",
            type: "category",
            data: x
          }
        ],
        yAxis: [
          {
            name: "隐患比例",
            type: "value"
          }
        ],
        series: [
          {
            name: "已接受",
            stack: "总量",
            type: "bar",
            label: {
              normal: {
                show: true,
                position: "inside",
                formatter: "{c}%"
              }
            },
            data: y1
            // markPoint : {
            //     data : [
            //         {type : 'max', name: '最大值'},
            //         {type : 'min', name: '最小值'}
            //     ]
            // },
            // markLine : {
            //     data : [
            //         {type : 'average', name: '平均值'}
            //     ]
            // }
          },
          {
            name: "超出范围",
            stack: "总量",
            type: "bar",
            label: {
              normal: {
                show: true,
                position: "inside",
                formatter: "{c}%"
              }
            },
            data: y2
            // markPoint : {
            //     data : [
            //         {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183},
            //         {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
            //     ]
            // },
            // markLine : {
            //     data : [
            //         {type : 'average', name : '平均值'}
            //     ]
            // }
          }
        ]
      });
    },
    mountedOrderRatio() {
      var x = [],
        y1 = [],
        y2 = [];
      this.$http({
        url: this.$http.adornUrl(
          "/event/eventShare/statisticalOrderRatioCount"
        ),
        method: "get",
        params: this.$http.adornParams({
          // id:this.$store.state.user.platformId
          token: Cookies.get("token")
        })
      }).then(res => {
        // console.log("/event/eventShare/statisticalOrderRatioCount", res);
        if (res.data.outRange.length != 0) {
          res.data.outRange.forEach(item => {
            if (!item.platformName) {
              x.push("其它");
            } else {
              x.push(item.platformName);
            }
            y2.push(item.count / res.data.total);
            y1.push(1 - item.count / res.data.total);
          });
        } else {
          x.push("其它");
          y2.push(0);
          y1.push(100);
        }

        this.$nextTick(() => {
          this.initOrderRatioChart(x, y1, y2);
        });
      });
    }
  }
};
</script>

<style>
.mod-home {
  /* line-height: 1.5; */
}
</style>

