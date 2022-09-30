<template>
  <div :class="$style.container">
    <div>
      <div>
        <p :class="$style.title">响应率</p>
        <div>94</div>
        退单情况：94单<br>
        联系反馈：1383单
      </div>
      <div>
        <p :class="$style.title">解决率</p>
        <div>78.6</div>
      </div>
      <div>
        <p :class="$style.title">满意率</p>
        <div>80.5</div>
      </div>
      <div>
        <p :class="$style.title">综合得分</p>
        <div :class="$style.total">84.3</div>
      </div>
    </div>
    <div>
      <p :class="$style.title">今日新增事项</p>
      <div :class="$style.new">
        <span>合计</span>
        <span>23单</span>
      </div>
      <div :class="$style.new">
        <span>待办事项</span>
        <span>5单</span>
      </div>
      <div :class="$style.new">
        <span>办理中事项</span>
        <span>10单</span>
      </div>
      <div :class="$style.new">
        <span>已办结事项</span>
        <span>8单</span>
      </div>
    </div>
    <div>
      <div>
        <p :class="$style.title">事件高发地点排名前十位</p>
      </div>
      <div
        ref="location"
        style="width: 100%; height: 100%;"
      />
    </div>
    <div>
      <div>
        <p :class="$style.title">事件高发类型排名前十位</p>
      </div>
      <div
        ref="type"
        style="width: 100%; height: 100%;"
      />
    </div>
    <div>
      <div>
        <p :class="$style.title">工单分类情况</p>
      </div>
      <div
        ref="classification"
        style="width: 100%; height: 100%;"
      />
    </div>
  </div>
</template>

<script>
import echarts from 'echarts';

export default {
  name: 'Emergency12345',
  data() {
    return {
      location: [
        {
          name: '八仙庄村',
          value: 286,
        },
        {
          name: '名佳花园',
          value: 120,
        },
        {
          name: '冠华苑小区',
          value: 93,
        },
        {
          name: '燕丹村',
          value: 49,
        },
        {
          name: '东三旗村',
          value: 49,
        },
        {
          name: '蓬莱公寓',
          value: 48,
        },
        {
          name: '温泉花园',
          value: 44,
        },
        {
          name: '名流花园',
          value: 41,
        },
        {
          name: '宏福苑南',
          value: 40,
        },
        {
          name: '燕城苑',
          value: 37,
        },
      ],
      type: [
        {
          name: '住房',
          value: 30,
        },
        {
          name: '物业管理',
          value: 29,
        },
        {
          name: '市容环卫',
          value: 25,
        },
        {
          name: '公共服务',
          value: 24,
        },
        {
          name: '市场管理',
          value: 19,
        },
        {
          name: '交通管理',
          value: 19,
        },
        {
          name: '农村管理',
          value: 18,
        },
        {
          name: '城乡建设',
          value: 16,
        },
        {
          name: '环境保护',
          value: 14,
        },
        {
          name: '市政',
          value: 11,
        },
      ],
      classification: [
        {
          name: '城市绿化',
          value: 6,
        },
        {
          name: '城乡建设',
          value: 16,
        },
        {
          name: '工作处罚执法',
          value: 1,
        },
        {
          name: '公共安全',
          value: 8,
        },
        {
          name: '公共服务',
          value: 24,
        },
        {
          name: '公园管理',
          value: 2,
        },
        {
          name: '环境保护',
          value: 14,
        },
        {
          name: '交通管理',
          value: 19,
        },
        {
          name: '教育',
          value: 3,
        },
        {
          name: '金融财税',
          value: 1,
        },
        {
          name: '科技文宣',
          value: 2,
        },
        {
          name: '垃圾分类',
          value: 3,
        },
        {
          name: '劳动和社会保障',
          value: 1,
        },
        {
          name: '民政事务',
          value: 2,
        },
        {
          name: '农村管理',
          value: 18,
        },
        {
          name: '其它问题',
          value: 1,
        },
        {
          name: '企业服务',
          value: 1,
        },
        {
          name: '社会秩序',
          value: 6,
        },
        {
          name: '市场管理',
          value: 19,
        },
        {
          name: '市容环卫',
          value: 25,
        },
        {
          name: '市政',
          value: 11,
        },
        {
          name: '水文气象',
          value: 1,
        },
        {
          name: '违纪举报',
          value: 3,
        },
        {
          name: '卫生健康',
          value: 2,
        },
        {
          name: '物价',
          value: 1,
        },
        {
          name: '物业管理',
          value: 29,
        },
        {
          name: '新闻热线',
          value: 1,
        },
        {
          name: '政风投诉',
          value: 1,
        },
        {
          name: '知识产权',
          value: 1,
        },
        {
          name: '住房',
          value: 30,
        },
        {
          name: '咨询',
          value: 7,
        },
      ],
      colorList: ['#54A0FF', '#44CC75', '#FBC958', '#FB7293', '#9D96F5', '#049DFF', '#83D9FF', '#A3E547', '#FCD75C', '#4481EB', '#46D0ED', '#E4998B', '#D143C9', '#FEB00A', '#FE660A'],
      // 饼图高亮块下标
      currentActive: 0,
      // 饼图实例
      PieGraph: '',
    };
  },
  mounted() {
    setTimeout(() => {
      this.initLocation();
      this.initType();
      this.initClassification();
    }, 1);
  },
  methods: {
    initLocation() {
      const graph = echarts.init(this.$refs.location);
      const options = {
        color: this.colorList,
        grid: {
          top: 20,
          bottom: 20,
          right: 10,
          left: '20%',
          show: true,
          backgroundColor: 'rgba(80, 159, 248, .06)',
          borderColor: 'transparent',
        },
        xAxis: {
          max: 'dataMax',
        },
        yAxis: {
          type: 'category',
          data: this.location.map((item) => item.name),
          inverse: true,
        },
        series: [
          {
            realtimeSort: true,
            name: 'X',
            type: 'bar',
            data: this.location.map((item) => item.value),
            label: {
              show: true,
              position: 'right',
              valueAnimation: true,
            },
          },
        ],
        legend: {
          show: true,
        },
      };
      graph.setOption(options);
    },
    initType() {
      const graph = echarts.init(this.$refs.type);
      const options = {
        color: this.colorList,
        grid: {
          top: 20,
          bottom: 20,
          right: 10,
          left: '20%',
          show: true,
          backgroundColor: 'rgba(80, 159, 248, .06)',
          borderColor: 'transparent',
        },
        xAxis: {
          max: 'dataMax',
        },
        yAxis: {
          type: 'category',
          data: this.type.map((item) => item.name),
          inverse: true,
        },
        series: [
          {
            realtimeSort: true,
            name: 'X',
            type: 'bar',
            data: this.type.map((item) => item.value),
            label: {
              show: true,
              position: 'right',
              valueAnimation: true,
            },
          },
        ],
        legend: {
          show: true,
        },
      };
      graph.setOption(options);
    },
    initClassification() {
      const graph = echarts.init(this.$refs.classification);
      const options = {
        color: [...this.colorList, ...this.colorList, ...this.colorList, ...this.colorList, ...this.colorList],
        series: [{
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['50%', '80%'],
          avoidLabelOverlap: false,
          data: this.classification,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: true,
              formatter: '{top|{c}}{unit|类}\n{btm|{b}}',
              rich: {
                top: {
                  color: '#333333',
                  fontSize: '36',
                  fontWeight: 'bold',
                },
                unit: {
                  color: '#333333',
                  fontSize: '26',
                  fontWeight: 'bold',
                },
                btm: {
                  color: '#666666',
                  fontSize: '26',
                },
              },
            },
          },
          labelLine: {
            show: false,
          },
        }],
      };
      graph.setOption(options);
      // 高亮处理
      this.currentActive = 0;
      graph.dispatchAction({ type: 'downplay', seriesIndex: 0 });
      graph.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: 0 });
      graph.on('mouseover', (v) => {
        if (v.dataIndex !== this.currentActive) {
          graph.dispatchAction({ type: 'downplay', seriesIndex: 0, dataIndex: this.currentActive });
        }
        this.currentActive = v.dataIndex;
      });
      graph.on('mouseout', () => {
        graph.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: this.currentActive });
      });
      this.PieGraph = graph;
    },
  },
};
</script>

<style lang="scss" module>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  & > div {
    background: #ffffff;
    border-radius: 4px;
    box-shadow: 0px 4px 14px 2px rgba(54, 121, 225, 0.09);
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    margin: 5px;
    padding: 10px;
    width: calc((100% - 40px) / 4);
    height: 650px;
    &:first-child {
      height: 200px;
      width: calc(100% - 10px);
      flex-direction: row;
      align-items: stretch;
      justify-content: center;
      & > div {
        border: 1px solid #D1DDF1;
        border-radius: 5px;
        flex-grow: 1;
        width: 100px;
        margin: 5px;
        padding: 10px;
        position: relative;
        & > div:nth-child(2) {
          font-size: 40px;
          font-weight: bold;
          &::after {
            content: '分';
            font-size: 30px;
          }
          background: -webkit-linear-gradient(-30deg, #337BFF 0.2685546875%, #14E1FF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
  }
}
.title {
  border-left: 3px solid #0091ff;
  font-size: 16px;
  line-height: 16px;
  font-weight: bold;
  padding: 0 0 0 14px;
  margin: 5px 0;
}
.new {
  background: no-repeat center bottom -10px/100% auto url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTk3cHgiIGhlaWdodD0iNTFweCIgdmlld0JveD0iMCAwIDE5NyA1MSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDx0aXRsZT7lvaLnirY8L3RpdGxlPgogICAgPGRlZnM+CiAgICAgICAgPHBhdGggZD0iTTUsMCBMMTk0LDAgQzE5Ni43NjE0MjQsLTUuMDcyNjUzMTNlLTE2IDE5OSwyLjIzODU3NjI1IDE5OSw1IEwxOTksMTgzIEMxOTksMTg1Ljc2MTQyNCAxOTYuNzYxNDI0LDE4OCAxOTQsMTg4IEw1LDE4OCBDMi4yMzg1NzYyNSwxODggMy4zODE3Njg3NmUtMTYsMTg1Ljc2MTQyNCAwLDE4MyBMMCw1IEMtMy4zODE3Njg3NmUtMTYsMi4yMzg1NzYyNSAyLjIzODU3NjI1LDUuMDcyNjUzMTNlLTE2IDUsMCBaIiBpZD0icGF0aC0xIj48L3BhdGg+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IHgxPSI1Ni44NjgyMDY1JSIgeTE9IjUwJSIgeDI9IjYxLjIzMTMxNzklIiB5Mj0iNTUuMjk0MTE1OSUiIGlkPSJsaW5lYXJHcmFkaWVudC0zIj4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzU0QTBGRiIgc3RvcC1vcGFjaXR5PSIwLjA5MjE2NTY0NjkiIG9mZnNldD0iMCUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iIzU0QTBGRiIgc3RvcC1vcGFjaXR5PSIwLjMzMzg4ODc2NyIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSLlgLznj63mgLvop4giIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLlt6XljZXmgLvop4giIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00NDcuMDAwMDAwLCAtMjk1LjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTXlpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE3MC4wMDAwMDAsIDk4LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9IuW9oueKtiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjc2LjAwMDAwMCwgNjAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPG1hc2sgaWQ9Im1hc2stMiIgZmlsbD0id2hpdGUiPgogICAgICAgICAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9IiNwYXRoLTEiPjwvdXNlPgogICAgICAgICAgICAgICAgICAgIDwvbWFzaz4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBzdHJva2U9IiNEMURERjEiIGQ9Ik0xOTQsMC41IEMxOTUuMjQyNjQxLDAuNSAxOTYuMzY3NjQxLDEuMDAzNjc5NjYgMTk3LjE4MTk4MSwxLjgxODAxOTQ4IEMxOTcuOTk2MzIsMi42MzIzNTkzMSAxOTguNSwzLjc1NzM1OTMxIDE5OC41LDUgTDE5OC41LDUgTDE5OC41LDE4MyBDMTk4LjUsMTg0LjI0MjY0MSAxOTcuOTk2MzIsMTg1LjM2NzY0MSAxOTcuMTgxOTgxLDE4Ni4xODE5ODEgQzE5Ni4zNjc2NDEsMTg2Ljk5NjMyIDE5NS4yNDI2NDEsMTg3LjUgMTk0LDE4Ny41IEwxOTQsMTg3LjUgTDUsMTg3LjUgQzMuNzU3MzU5MzEsMTg3LjUgMi42MzIzNTkzMSwxODYuOTk2MzIgMS44MTgwMTk0OCwxODYuMTgxOTgxIEMxLjAwMzY3OTY2LDE4NS4zNjc2NDEgMC41LDE4NC4yNDI2NDEgMC41LDE4MyBMMC41LDE4MyBMMC41LDUgQzAuNSwzLjc1NzM1OTMxIDEuMDAzNjc5NjYsMi42MzIzNTkzMSAxLjgxODAxOTQ4LDEuODE4MDE5NDggQzIuNjMyMzU5MzEsMS4wMDM2Nzk2NiAzLjc1NzM1OTMxLDAuNSA1LDAuNSBMNSwwLjUgWiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0tMTAsMTk4IEMxMSwxNzkuMTU2MDUyIDI4LjEsMTY5LjczNDA3OCA0MS4zLDE2OS43MzQwNzggQzYxLjEsMTY5LjczNDA3OCA3OC4yLDE3Ny4xMzEwMjkgOTguOSwxNjkuNzM0MDc4IEMxMTkuNiwxNjIuMzM3MTI3IDExOS4xOTM5NDUsMTQ3LjUwMDg4MSAxMzguOTkzOTQ1LDE0Mi4xNjk1ODQgQzE1OC43OTM5NDUsMTM2LjgzODI4OCAxODAuNjA3ODEyLDE1MS4zOTM3ODMgMjAwLDEzNSBDMjAwLDE0Ny42MTI3OCAyMDAsMTY2LjU0NTU1OCAyMDAsMTkxLjc5ODMzMyBMLTEwLDE5OCBaIiBpZD0i6Lev5b6ELTQiIGZpbGw9InVybCgjbGluZWFyR3JhZGllbnQtMykiIG9wYWNpdHk9IjAuNTE0MzQ2MTY4IiBtYXNrPSJ1cmwoI21hc2stMikiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+'); 
  margin: 5px 0;
  flex: 1;
  width: 100%;
  border: 1px solid #D1DDF1;
  border-radius: 5px;
  position: relative;
  & > span {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    &:first-child {
      left: 10%;
      font-weight: bold;
      font-size: 30px;
    }
    &:last-child {
      right: 10%;
      font-size: 40px;
    }
  }
}
.total {
  height: 120px;
  width: calc(100% - 20px);
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
  line-height: 120px;
  text-align: center;
  position: absolute;
  background: -webkit-linear-gradient(-45deg, #51AAE6 0.78125%, #77E6AF 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  font-size: 60px !important;
}
</style>
