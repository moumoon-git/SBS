<!--
 * @Author: your name
 * @Date: 2020-12-17 20:18:26
 * @LastEditTime: 2020-12-28 10:47:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GGECSd:\xuchuangxing\SJSEOS\src\view\dutyManagement\onDutyRoster\operatorOnDuty\components\schedulingStatistics.vue
-->
<template>
  <div>
    <el-dialog
      title="排班统计"
      width="700px"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeClassId" type="card" @tab-click="handleClick">
        <el-tab-pane
          v-for="item in classList"
          :key="item.id"
          :label="item.name"
          :name="item.id"
          :lazy="lazy"
        >
          <el-row>
            <el-date-picker
              v-model="month"
              type="monthrange"
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              value-format="yyyy-MM"
              style="float: right; margin-bottom: 10px"
            >
            </el-date-picker>
          </el-row>
          <div
            v-if="onDutyMans && onDutyMans.length > 0"
            style="position: relative"
          >
            <el-table
              :data="onDutyMans"
              :span-method="objectSpanMethod"
              border=""
              stripe
              style="width: 100%; margin-top: 20px"
            >
              <el-table-column
                prop="name"
                label="值班员"
                width="180"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="time"
                label="年月"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="day"
                label="值班日期"
                align="center"
              ></el-table-column>
            </el-table>
          </div>
          <div class="noList" v-else>暂无值班人员</div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: true,
      activeClassId: "", // 当前选中班次id
      month: [],
      lazy: true, // 懒加载
      onDutyMans: [
        {
          id: "张三",
          name: "8",
          amount1: "09、11、23、25、26",
        },
        {
          id: "张三",
          name: "11",
          amount1: "12、20、21、25",
        },
        {
          id: "李四",
          name: "8",
          amount1: "03、10、23、24、26",
        },
        {
          id: "李四",
          name: "9",
          amount1: "01、11、23、24、28",
        },
        {
          id: "李四",
          name: "12",
          amount1: "12、20、21、25",
        },
        {
          id: "王五",
          name: "8",
          amount1: "01、11、23、24、28",
        },
        {
          id: "王五",
          name: "9",
          amount1: "09、11、23、25、26",
        },
        {
          id: "王五",
          name: "10",
          amount1: "12、20、21、25",
        },
        {
          id: "王五",
          name: "11",
          amount1: "23、25、26",
        },
      ],
    };
  },
  props: [
    "classList", // 班次列表
    "activeClass", // 当前选中班次id
  ],
  watch: {
    activeClass: {
      // 当前选中班次id
      handler: function (newVal, oldVal) {
        // console.log('监听->班次名字', newVal)
        this.activeClassId = newVal;
      },
      deep: true,
    },
    month() {
      this.initData();
    },
  },
  created() {},
  mounted() {
    this.activeClassId = this.activeClass;
    this.initData();
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    //切换标签页
    handleClick() {
      this.initData();
    },
    async initData() {
      this.onDutyMans = [];
      let startTime = "";
      let endTime = "";
      let currentMonth = new Date().formatDate("yyyy-MM");
      if (this.month.length > 0) {
        startTime = this.month[0];
        endTime = this.month[1];
      } else {
        startTime = currentMonth;
        endTime = currentMonth;
      }
      let data = {
        classId: this.activeClassId,
        startTime,
        endTime,
      };
      let response = await this.$api.getStatisticsList(data);
      if (response.errorcode === 0) {
        let responseData = response.data;
        if (!!responseData && responseData.length > 0) {
          responseData.map((item) => {
            item.msg.map((v) => {
              this.onDutyMans.push({
                day: v.day.join("，"),
                time: v.time,
                name: item.name,
              });
            });
          });
        }
      }
    },
    getTableData() {
      let spanOneArr = [],
        spanTwoArr = [],
        concatOne = 0,
        concatTwo = 0;
      this.onDutyMans.forEach((item, index) => {
        if (index === 0) {
          spanOneArr.push(1);
          spanTwoArr.push(1);
        } else {
          if (item.name === this.onDutyMans[index - 1].name) {
            //第一列需合并相同内容的判断条件
            spanOneArr[concatOne] += 1;
            spanOneArr.push(0);
          } else {
            spanOneArr.push(1);
            concatOne = index;
          }
        }
      });
      return {
        one: spanOneArr,
        two: spanTwoArr,
      };
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.getTableData().one[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
  },
};
</script>

<style scoped>
</style>