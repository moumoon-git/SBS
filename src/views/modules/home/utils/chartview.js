import echarts from "echarts";
import {countNumber} from './index';
//import './liquidFill.js'; //在这里引入

var linchartResize = [],
    piechartResize = [],
    barchartResize = [],
    sheetToolResize = [],
    totalRingResize = [],
    totalPanelResize = [];

//线性图
const lineChart = params => {
    return new line(params);
};

function line(params) {
    // console.log("拆线图数据",params)
    this.init(params);
}
line.prototype = {
    init: function(params) {
        var options = [];
        this.lineChartArr = params;
        for (var i = 0; i < params.length; i++) {
            options.push({
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    //top: '20%',
                    top: '5%',
                    //bottom: '15%'
                    bottom: '20%'
                },
                xAxis: {
                    type: "category",
                    data: params[i].xData,
                    axisTick: {
                        show: false
                    }
                },
                yAxis: {
                    type: "value",
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    }
                },
                series: (function() {
                    var series = [];
                    for (var j = 0; j < params[i].seriesData.length; j++) {
                        if (params[i].chartDetailType === "singleLine") {
                            let da;
                            if(params[i].seriesData[j].data){
                              da = params[i].seriesData[j].data
                            }else{
                              da = params[i].seriesData[j]
                            }
                            var item = {
                                //data: params[i].seriesData[j].data,
                                data: da,
                                type: "line",
                                itemStyle: {
                                  normal: {   //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1,[{
                                        offset: 0, color: params[i].chartColor[0] // 0% 处的颜色
                                      }, {
                                        offset: 0.5, color: params[i].chartColor[0] // 100% 处的颜色
                                      }, {
                                        offset: 1, color: '#fff' // 100% 处的颜色
                                      }]
                                    ),  //背景渐变色
                                    lineStyle: {        // 系列级个性化折线样式
                                      width: 3,
                                      type: 'solid',
                                      color: params[i].chartColor[0]
                                    }
                                  },
                                  emphasis: {
                                    color: '#4fd6d2',
                                    lineStyle: {        // 系列级个性化折线样式
                                      width:2,
                                      type: 'dotted',
                                      color: params[i].chartColor[0] //折线的颜色
                                    }
                                  }
                                },//线条样式
                                // itemStyle: {
                                //     color: params[i].chartColor[0]
                                // },
                                // areaStyle: {
                                //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                //             offset: 0,
                                //             color: params[i].chartColor[0]
                                //         },
                                //         {
                                //             offset: 0.5,
                                //             color: params[i].chartColor[1]
                                //         },
                                //         {
                                //             offset: 1,
                                //             color: "#fff"
                                //         }
                                //     ])
                                // },
                                symbolSize:5, //折线点的大小
                                areaStyle: {normal: {}},
                                symbol: null,
                                //symbolSize: 0
                            };
                            series.push(item);
                        }
                        if (params[i].chartDetailType === "doubleLine") {
                            var item = {
                                data: params[i].seriesData[j].data,
                                type: "line",
                                itemStyle: {
                                    color: params[i].seriesData[j].color
                                },
                                symbol: null,
                                symbolSize: 0
                            };
                            series.push(item);
                        }
                    }
                    return series;
                })()
            });
        }
        this.setLinechart(options);
    },
    setLinechart: function(options) {
        linchartResize = [];
        for (var i = 0; i < this.lineChartArr.length; i++) {
            for (var j = 0; j < options.length; j++) {
                if (i === j) {
                    this.lineChart = echarts.init(
                        document.querySelector(
                            this.lineChartArr[i].chartMainClass + " .charShow"
                        )
                    );
                    linchartResize.push(this.lineChart);
                    this.lineChart.setOption(options[j]);
                }
            }
        }
        window.addEventListener(
            "resize",
            function() {
                for (var x = 0; x < linchartResize.length; x++) {
                    linchartResize[x].resize();
                }
            }.bind(this)
        );
    }
};

//饼状图
const pieChart = params => {
    return new pie(params);
};

function pie(params) {
    this.init(params);
}
pie.prototype = {
    init: function(params) {
        var options = [];
        this.pieChartArr = params;
        for (var i = 0; i < params.length; i++) {
            options.push({
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                grid: {
                  //top: '20%',
                  top: '5%',
                  //bottom: '15%'
                  bottom: '20%'
                },
                legend: {
                    orient: "vertical",
                    x: "right",
                    y: "center",
                    data: params[i].seriesData
                },
                series: function() {
                    var series = [];
                    if (params[i].chartDetailType === "circlePie") {
                       var circlePieColor = params[i].chartColor
                        var item = {
                            type: "pie",
                            radius: ["50%", "70%"],
                            center: ["50%", "40%"],
                            //center: ["25%", "60%"],
                            avoidLabelOverlap: false,
                            label: {
                                // normal: {
                                //   show: false,
                                //   position: "center"
                                // },
                                normal: {
                                    show: true,
                                    position: 'inner',
                                    formatter: '{c}'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: "18",
                                        fontWeight: "bold"
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: params[i].seriesData,
                            itemStyle: {
                              normal: {
                                color: new echarts.graphic.LinearGradient(
                                  0, 0, 0, 1, [
                                    { offset: 0, color: params[i].chartColor[1] },
                                    { offset: 0.5, color: params[i].chartColor[2] },
                                    { offset: 1, color: params[i].chartColor[3] }
                                  ]
                                )
                              },
                              emphasis: {
                                color: new echarts.graphic.LinearGradient(
                                  0, 0, 0, 1, [
                                    { offset: 0, color: params[i].chartColor[3] },
                                    { offset: 0.7, color: params[i].chartColor[2] },
                                    { offset: 1, color: params[i].chartColor[1] }
                                  ]
                                )
                              }
                            }
                            // itemStyle: {
                            //     color: function(param) {
                            //         return circlePieColor[param.dataIndex]
                            //     }
                            // }
                        };
                        series.push(item);
                    }
                    if (params[i].chartDetailType === "areaPie") {
                        var areaPieColor = params[i].chartColor
                        var item = {
                            type: "pie",
                            radius: ["10%", "60%"],
                            //center: ["50%", "40%"],
                            center: ["50%", "40%"],
                            roseType: "radius",
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            lableLine: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data: params[i].seriesData,
                            // itemStyle: {
                            //     color: function(param) {
                            //         return areaPieColor[param.dataIndex]
                            //     }
                            // }
                            itemStyle: {
                              normal: {
                                color: new echarts.graphic.LinearGradient(
                                  0, 0, 0, 1, [
                                    { offset: 0, color: params[i].chartColor[1] },
                                    { offset: 0.5, color: params[i].chartColor[2] },
                                    { offset: 1, color: params[i].chartColor[3] }
                                  ]
                                )
                              },
                              emphasis: {
                                color: new echarts.graphic.LinearGradient(
                                  0, 0, 0, 1, [
                                    { offset: 0, color: params[i].chartColor[3] },
                                    { offset: 0.7, color: params[i].chartColor[2] },
                                    { offset: 1, color: params[i].chartColor[1] }
                                  ]
                                )
                              }
                            }
                        };
                        series.push(item);
                    }
                    return series;
                }.bind(this)()
            });
        }
        this.setPieChart(options);
    },
    setPieChart: function(options) {
        piechartResize = [];
        for (var i = 0; i < this.pieChartArr.length; i++) {
            for (var j = 0; j < options.length; j++) {
                if (i === j) {
                    this.lineChart = echarts.init(
                        document.querySelector(
                            this.pieChartArr[i].chartMainClass + " .charShow"
                        )
                    );
                    piechartResize.push(this.lineChart);
                    this.lineChart.setOption(options[j]);
                }
            }
        }
        window.addEventListener(
            "resize",
            function() {
                for (var x = 0; x < piechartResize.length; x++) {
                    piechartResize[x].resize();
                }
            });
    }
};

//柱状图
const barChart = params => {
    return new bar(params);
};

function bar(params) {
    this.init(params);
}
bar.prototype = {
    init: function(params) {
        var options = []
        this.barChartArr = params
        for (var i = 0; i < params.length; i++) {
            if (params[i].chartDetailType === "rowBar") {
                options.push({
                    xAxis: {
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                type: 'solid',
                                color: '#e7e7e7',
                                width: '2'
                            }
                        },
                        splitLine: { show: false },
                        type: 'value',
                        boundaryGap: [0, 0],
                        axisLabel: { interval: 0 }
                    },
                    grid: {
                        left: '23%',
                        //top: '20%',
                        top: '5%',
                        //bottom: '3%'
                        bottom: '20%'
                    },
                    yAxis: {
                        type: 'category',
                        data: params[i].xData,
                        axisTick: [{
                            show: false
                        }],
                        axisLine: {
                            show: true,
                            lineStyle: {
                                type: 'solid',
                                color: '#e7e7e7',
                                width: '2'
                            }
                        },
                        axisLabel: {
                            textStyle: {
                                fontSize: '14',
                                fontFamily: 'PingFang SC Medium',
                                color: '#666'
                            }
                        }
                    },
                    series: function() {
                        var rowBarColor = params[i].chartColor
                        var series = [];
                        for (var j = 0; j < params[i].seriesData.length; j++) {

                            let da;
                            if(params[i].seriesData[j].data){
                              da = params[i].seriesData[j].data
                            }else{
                              da = params[i].seriesData[j]
                            }

                            var item = {
                                type: 'bar',
                                tooltip: { show: false },
                                barWidth: 16,
                                //data: params[i].seriesData[j].data,
                                data: da,
                                itemStyle: {
                                    normal: {
                                        color: (params) => {
                                            return rowBarColor[params.dataIndex]
                                        }
                                    }
                                }
                            };
                            series.push(item);
                        }
                        return series;
                    }()
                })
            }
            if (params[i].chartDetailType === "columnBar") {
                options.push({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    xAxis: {
                        data: params[i].xData,
                        axisLabel: {
                            textStyle: {
                                color: '#AAAAAA'
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        z: 10
                    },
                    grid: {
                        left: '15%',
                        //top: '20%',
                        top: '5%',
                        //bottom: '15%'
                        bottom: '20%'
                    },
                    yAxis: {
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#AAAAAA'
                            }
                        }
                    },
                    dataZoom: [{
                        type: 'inside'
                    }],
                    series: function() {
                        var series = []
                        for (var j = 0; j < params[i].seriesData.length; j++) {
                            this.dataShadow = []
                            this.yMax = Math.max.apply(null, params[i].seriesData[j].data)
                            var countNum = countNumber(this.yMax)
                            for (var m = 0; m < params[i].seriesData[j].data.length; m++) {
                                this.dataShadow.push(countNum);
                            }
                            var item = {
                                type: 'bar',
                                itemStyle: {
                                    normal: { color: params[i].chartColor[0] }
                                },
                                barGap: '-100%',
                                barCategoryGap: '40%',
                                data: this.dataShadow,
                                animation: false
                            }
                            var item1 = {
                                type: 'bar',
                                itemStyle: {
                                    normal: {
                                        color: new echarts.graphic.LinearGradient(
                                            0, 0, 0, 1, [
                                                { offset: 0, color: params[i].chartColor[1] },
                                                { offset: 0.5, color: params[i].chartColor[2] },
                                                { offset: 1, color: params[i].chartColor[3] }
                                            ]
                                        )
                                    },
                                    emphasis: {
                                        color: new echarts.graphic.LinearGradient(
                                            0, 0, 0, 1, [
                                                { offset: 0, color: params[i].chartColor[3] },
                                                { offset: 0.7, color: params[i].chartColor[2] },
                                                { offset: 1, color: params[i].chartColor[1] }
                                            ]
                                        )
                                    }
                                },
                                data: params[i].seriesData[j].data
                            }
                            series.push(item, item1)
                        }
                        return series;
                    }.bind(this)()
                })
            }
            this.setBarChart(options)
        }
    },
    setBarChart: function(options) {
        barchartResize = [];
        for (var i = 0; i < this.barChartArr.length; i++) {
            for (var j = 0; j < options.length; j++) {
                if (i === j) {
                    this.lineChart = echarts.init(
                        document.querySelector(
                            this.barChartArr[i].chartMainClass + " .charShow" //h20 w32 chartMain1
                        )
                    );
                    barchartResize.push(this.lineChart);
                    this.lineChart.setOption(options[j]);
                }
            }
        }
        window.addEventListener(
            "resize",
            function() {
                for (var x = 0; x < barchartResize.length; x++) {
                    barchartResize[x].resize();
                }
            });
    }
};

//表格
const sheetTool = params => {
    return new sheet(params)
}
function sheet(params) {
  this.init(params);
}
sheet.prototype = {
  init: function(params) {
    var options = []
    this.sheetToolArr = params
    for (var i = 0; i < params.length; i++) {
      //开始拼接
      var moveBox =  document.querySelector(
        this.sheetToolArr[i].chartMainClass + " .charShow" //h20 w32 chartMain1
      )
      //console.log("moveBox",moveBox)
      var _htmlSheetHead = '';
      var _htmlSheatBody = '';
      var headValue = '';

      //接拼表头
      _htmlSheetHead += '<ul class="th">'
      for(var x=0; x<params[i].xData.length; x++){

        headValue = params[i].xData[x];
        _htmlSheetHead += '<li>'+headValue+'</li>'
      }
      _htmlSheetHead += '</ul>'

      //拼接表体
      var headValue2 = params[i].xData;
      for (var k = 0; k < params[i].seriesData.length; k++) {
        var bodyValue = params[i].seriesData[k];
        //遍历属性与值
        _htmlSheatBody += '<ul>';
        for (var m=0; m<headValue2.length; m++) {
          // p 为属性名称，bodyValue[p]为对应属性的值
          //if(bodyValue[headValue2[m]] !=null && bodyValue[headValue2[m]].toString().length >10){
           //_htmlSheatBody += '<li>' + bodyValue[headValue2[m]].toString().substring(0,8) + '</li>';
          //}else{
            _htmlSheatBody += '<li>' + bodyValue[headValue2[m]] + '</li>';
          //}

        }
        _htmlSheatBody += '</ul>';

      }
      //console.log("拼接的表体的值",_htmlSheatBody)
      moveBox.innerHTML ="<div class='showSheet'>"+_htmlSheetHead + _htmlSheatBody+"</div>"

    }

  },
  setSheetTool: function(options) {
    sheetToolResize = [];
    window.addEventListener(
      "resize",
      function() {
        for (var x = 0; x < sheetToolResize.length; x++) {
          sheetToolResize[x].resize();
        }
      });
  }

};


//总数,totalTool
const totalRingTool = params => {
  return new totalRing(params)
}
function totalRing(params) {
  // console.log("总数圆圈totalTool",params)
  this.init(params);
}
totalRing.prototype = {
  init: function(params) {
    var options = []
    this.totalRingToolArr = params
    for (let i = 0; i < params.length; i++) {
      let moveBox =  document.querySelector(
        this.totalRingToolArr[i].chartMainClass + " .charShow" //h20 w32 chartMain1
      )

      let xName = '未知';
      let yValue = 0;

      if(params[i].xData != null && params[i].seriesData != null){
        //x轴
        for(let x=0; x<params[i].xData.length; x++){
            xName = params[i].xData[x];

        }
        //y轴
        for (let k = 0; k < params[i].seriesData.length; k++) {
          yValue = params[i].seriesData[0].data[k]
        }
      }

      let color = "#ff0000"
      if(params[i].chartColor != null){
        color = params[i].chartColor[0]
      }

      moveBox.innerHTML = "<div class='report2'>" +
        "<p style='color:"+color+" !important;' >"+xName+"</p>" +
        "<small>"+yValue+"条</small>" +
        "</div>"

    }

  },
  totalRingTool: function(options) {
    totalRingResize = [];
    window.addEventListener(
      "resize",
      function() {
        for (var x = 0; x < totalRingResize.length; x++) {
          totalRingResize[x].resize();
        }
      });
  }

};


//总数面板排行版
const totalPanelTool = params => {
  return new totalPanel(params)
}
function totalPanel(params) {
  // console.log("总数面板排行版",params)
  this.init(params);
}
totalPanel.prototype = {
  init: function(params) {
    var options = []
    this.totalPanelToolArr = params
    for (let i = 0; i < params.length; i++) {
      let moveBox =  document.querySelector(
        this.totalPanelToolArr[i].chartMainClass + " .charShow" //h20 w32 chartMain1
      )

      let xName = '未知';
      let yValue = 0;

      if(params[i].xData != null && params[i].seriesData != null){
        //x轴
        for(let x=0; x<params[i].xData.length; x++){
          xName = params[i].xData[x];

        }
        //y轴
        for (let k = 0; k < params[i].seriesData.length; k++) {
          yValue = params[i].seriesData[0].data[k]
        }
      }

      let color = "#13D0B2"
      if(params[i].chartColor != null){
        color = params[i].chartColor[0]
      }
      moveBox.innerHTML = "<div class='t_mbox t_rbox' style='background: "+color+" !important;padding-top: 15% !important;'>" +
        "<span>"+xName+"</span>" +
        "<h2>"+yValue+"</h2>" +
        "</div>"

      //var obj = document.getElementsByName("t_rbox");
      //obj.style.cssText = "background-color:black;";
    }

  },
  totalPanelTool: function(options) {
    totalPanelResize = [];
    window.addEventListener(
      "resize",
      function() {
        for (var x = 0; x < totalPanelResize.length; x++) {
          totalPanelResize[x].resize();
        }
      });
  }

};


export { lineChart, pieChart, barChart,sheetTool,totalRingTool,totalPanelTool};
