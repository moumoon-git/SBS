import singleLine from "../../../../assets/home/singleLine.png";
import doubleLine from "../../../../assets/home/doubleLine.png";
import areaPie from "../../../../assets/home/areaPie.png";
import circlePie from "../../../../assets/home/circlePie.png";
import rowBar from "../../../../assets/home/rowBar.png";
import columnBar from "../../../../assets/home/columnBar.png";
import sheet from "../../../../assets/home/abc.png";
import totalRing from "../../../../assets/home/ab.png";
import totalPanel from "../../../../assets/home/cc.png";

export default {
    choseCharts: [{
            id: 117,
            value: "line",
            label: "单线折线图",
            chartType: [{
                    imgSrc: singleLine,
                    type: "singleLine"
                }
            ]
        },
        {
          id: 118,
          value: "line",
          label: "双线折线图",
          chartType: [
            {
              imgSrc: doubleLine,
              type: "doubleLine"
            }
          ]
        },
        {
            id: 114,
            value: "pie",
            label: "面积饼状图",
            chartType: [{
                    imgSrc: areaPie,
                    type: "areaPie"
                }
            ]
        },
        {
          id: 115,
          value: "pie",
          label: "圆形饼状图",
          chartType: [
            {
              imgSrc: circlePie,
              type: "circlePie"
            }
          ]
        },
        {
            id: 118,
            value: "bar",
            label: "横向柱状图",
            chartType: [{
                    imgSrc: rowBar,
                    type: "rowBar"
                }
            ]
        },
        {
          id: 119,
          value: "bar",
          label: "坚向柱状图",
          chartType: [
            {
              imgSrc: columnBar,
              type: "columnBar"
            }
          ]
        },
        {
          id:120,
          value: "sheet",
          label: "表格",
          chartType: [
            {
              imgSrc: sheet,
              type: "sheet"
            }
          ]
        },
        {
          id:121,
          value: "totalRing",
          label: "总数圆圈",
          chartType: [
            {
              imgSrc: totalRing,
              type: "totalRing"
            }
          ]
        },
        {
          id:122,
          value: "totalPanel",
          label: "总数面板",
          chartType: [
            {
              imgSrc: totalPanel,
              type: "totalPanel"
            }
          ]
        },

    ],
    chartChoseW: [{
            value: "w12",
            label: "12vw"
        },{
            value: "w24",
            label: "24vw"
        },
        {
            value: "w32",
            label: "32vw"
        },
        {
            value: "w49",
            label: "49vw"
        },
    ],
    chartChoseH: [{
          value: "h12",
          label: "12vh"
        },{
            value: "h15",
            label: "15vh"
        },
        {
            value: "h20",
            label: "20vh"
        },
        {
            value: "h30",
            label: "30vh"
        },
        {
          value: "h49",
          label: "49vh"
        }
    ],
    echartText: 0
};
