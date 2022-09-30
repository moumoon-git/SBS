<!--
 * @Author: your name
 * @Date: 2021-04-09 14:50:00
 * @LastEditTime: 2021-04-26 16:44:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \xuchuangxing\SJSEOS\src\view\dutyManagement\RollCallOnDuty\rollCallMonthStatistics.vue
-->
<template>
  <div class="rollcallmonthstatistics">
    <div class="selectTime">
      <div class="lastMon" @click="getPreMonth(nowMonth)"></div>
      <div class="selectMon">{{ toYear }}年{{ toMonth }}月</div>
      <div class="nextMon" @click="getNextMonth(nowMonth)"></div>
      <div class="block">
        <el-date-picker
          :clearable="false"
          v-model="value2"
          type="month"
          @change="changemonth"
          placeholder="选择月"
        ></el-date-picker>
      </div>
    </div>

    <div style="text-align:center">
      <el-radio-group
        v-model="statisticalMethods"
        @change="changeStatisticalMethods"
      >
        <el-radio-button
          v-for="(item, index) in statisticalMethodsArr"
          :disabled="statisticalMethods != index ? noChange : undefined"
          :label="item.id"
          :key="index"
          >{{ item.name }}
        </el-radio-button>
      </el-radio-group>
    </div>
    <el-table
      :data="monthStatisticsData"
      style="width: 100%;margin-top:10px;"
      :span-method="arraySpanMethod"
      v-loading="noChange"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-table-column
        :prop="!statisticalMethods ? 'dept' : 'model'"
        :label="!statisticalMethods ? '单位' : '模板'"
        align="center"
      >
      </el-table-column>
      <el-table-column
        :prop="!statisticalMethods ? 'model' : 'dept'"
        :label="!statisticalMethods ? '模板' : '单位'"
        align="center"
      >
      </el-table-column>
      <el-table-column label="响应情况" align="center">
        <el-table-column prop="normal" label="在岗" align="center">
        </el-table-column>
        <el-table-column label="请假" align="center">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            align="center"
            v-for="item in tableColumn"
            :key="item.props"
          >
          </el-table-column>
        </el-table-column>
        <el-table-column prop="demobilize" label="离岗" align="center">
        </el-table-column>
      </el-table-column>
      <el-table-column prop="total" label="总计" align="center">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Rollcallmonthstatistics",
  props: ["date"],
  data() {
    return {
      toYear: "", // 年份
      toMonth: "", // 月份
      nowMonth: "", // 年月
      value2: "",
      statisticalMethods: 1,
      statisticalMethodsArr: [
        { id: 0, name: "按点名方式统计" },
        { id: 1, name: "按模板统计" }
      ],
      tableColumn: [
        { prop: "occupingMeeting", label: "会议室占用" },
        { prop: "equipment", label: "设备故障" },
        { prop: "other", label: "其他" }
      ],
      monthStatisticsData: [],
      idArr1: [],
      idPos1: 0,
      idArr2: [],
      idPos2: 0,
      noChange: false // 除了当前选中统计项以外选项 默认可选
    };
  },
  mounted() {
    // console.log("date: ", this.date);
    this.changemonth(this.date); // 获取年月
  },
  methods: {
    /**
     * @description: 获取年月
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/9
     * @param {*}
     * @return {*}
     */
    changemonth(data) {
      let newDate = new Date(data);
      let nowMonth = newDate.getMonth() + 1;
      // 添加分隔符“-”
      let seperator = "-";
      // 对月份进行处理，1-9月在前面添加一个“0”
      if (nowMonth >= 1 && nowMonth <= 9) {
        nowMonth = "0" + nowMonth;
      }
      this.toYear = newDate.getFullYear();
      this.toMonth = nowMonth;
      // 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
      let nowDate = newDate.getFullYear() + seperator + nowMonth;
      this.nowMonth = nowDate;
      //   console.log("this.nowMonth: ", this.nowMonth);
      // 默认加载按按名方式统计数据
      this.statisticalMethods = 0;
      this.changeStatisticalMethods();
    },
    /**
     * @description: 获取上一个月
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/9
     * @param {*}
     * @return {*}
     */
    getPreMonth(date) {
      var arr = date.split("-");
      var year = arr[0]; //获取当前日期的年份
      var month = arr[1]; //获取当前日期的月份
      var day = arr[2]; //获取当前日期的日
      var days = new Date(year, month, 0);
      days = days.getDate(); //获取当前日期中月的天数
      var year2 = year;
      var month2 = parseInt(month) - 1;
      if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
      }
      var day2 = day;
      var days2 = new Date(year2, month2, 0);
      days2 = days2.getDate();
      if (day2 > days2) {
        day2 = days2;
      }
      if (month2 < 10) {
        month2 = "0" + month2;
      }
      var t2 = year2 + "-" + month2;
      this.toYear = year2;
      this.toMonth = month2;
      this.nowMonth = t2;
      // 默认加载按按名方式统计数据
      this.statisticalMethods = 0;
      this.changeStatisticalMethods();
    },
    /**
     * @description: 获取下一个月
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/9
     * @param {*}
     * @return {*}
     */
    getNextMonth(date) {
      //   console.log(date);
      var arr = date.split("-");
      var year = arr[0]; //获取当前日期的年份
      var month = arr[1]; //获取当前日期的月份
      var day = arr[2]; //获取当前日期的日
      var days = new Date(year, month, 0);
      days = days.getDate(); //获取当前日期中的月的天数
      var year2 = year;
      var month2 = parseInt(month) + 1;
      if (month2 == 13) {
        year2 = parseInt(year2) + 1;
        month2 = 1;
      }
      var day2 = day;
      var days2 = new Date(year2, month2, 0);
      days2 = days2.getDate();
      if (day2 > days2) {
        day2 = days2;
      }
      if (month2 < 10) {
        month2 = "0" + month2;
      }
      var t2 = year2 + "-" + month2;
      this.toYear = year2;
      this.toMonth = month2;
      this.nowMonth = t2;
      // 默认加载按按名方式统计数据
      this.statisticalMethods = 0;
      this.changeStatisticalMethods();
    },
    /**
     * @description: 需要合并索引值存起来
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/9
     * @param {*}
     * @return {*}
     */
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const row1 = this.idArr1[rowIndex];
        const col1 = row1 > 0 ? 1 : 0;
        return {
          rowspan: row1,
          colspan: col1
        };
      }
      if (columnIndex === 1) {
        const row1 = this.idArr2[rowIndex];
        const col1 = row1 > 0 ? 1 : 0;
        return {
          rowspan: row1,
          colspan: col1
        };
      }
    },
    /**
     * @description: 根据模板或者方式合并
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/9
     * @param {*}
     * @return {*}
     */
    merage() {
      this.idArr1 = [];
      this.idPos1 = 0;
      this.idArr2 = [];
      this.idPos2 = 0;
      for (let i = 0; i < this.monthStatisticsData.length; i++) {
        console.log("this.monthStatisticsData: ", this.monthStatisticsData);
        if (i === 0) {
          this.idArr1.push(1);
          this.idArr2.push(1);
          this.idPos1 = 0;
          this.idPos2 = 0;
        } else {
          if (
            this.monthStatisticsData[i][
              this.statisticalMethods ? "model" : "dept"
            ] ===
            this.monthStatisticsData[i - 1][
              this.statisticalMethods ? "model" : "dept"
            ]
          ) {
            this.idArr1[this.idPos1] += 1;
            this.idArr1.push(0);
          } else {
            this.idArr1.push(1);
            this.idPos1 = i;
          }

          if (
            this.monthStatisticsData[i][
              this.statisticalMethods ? "model" : "dept"
            ] ===
              this.monthStatisticsData[i - 1][
                this.statisticalMethods ? "model" : "dept"
              ] &&
            this.monthStatisticsData[i][
              this.statisticalMethods ? "dept" : "model"
            ] ===
              this.monthStatisticsData[i - 1][
                this.statisticalMethods ? "dept" : "model"
              ]
          ) {
            this.idArr2[this.idPos2] += 1;
            this.idArr2.push(0);
          } else {
            this.idArr2.push(1);
            this.idPos2 = i;
          }
        }
      }
      //   console.log("this.monthStatisticsData: ", this.monthStatisticsData);
    },
    /**
     * @description: 切换统计方式加载不同表格数据
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/9
     * @param {*}
     * @return {*}
     */
    async changeStatisticalMethods(val) {
      this.noChange = true;
      //   console.log("val: ", val);
      //   console.log("this.nowMonth: ", this.nowMonth);
      let data = {
        code: this.statisticalMethods ? "model" : "dept",
        date: this.nowMonth
      };
      //   console.log('data: ', data);
      this.monthStatisticsData = [];
      let res = await this.$api.getMonthAllDepartment(data);
      if (!res.errorcode == "0") {
        this.$message.error(res.msg);
        return;
      }
      if (!res.data) {
        this.monthStatisticsData = [];
        return;
      }
      // this.monthStatisticsData = res.data;
      let type1 = [this.statisticalMethods ? "model" : "dept"];
      let type2 = [this.statisticalMethods ? "dept" : "model"];
      // 第一列名字相同 合并第二列相同名字之后 累加值统计
      function mergeTables() {
        for (let index = 0; index < res.data.length; index++) {
          let currentData = res.data[index]; // 当前索引数据
          let nextData = res.data[index + 1]; //下一个索引数据
          if (index == res.data.length - 1) {
            return;
          }
          if (
            currentData[type1] == nextData[type1] &&
            currentData[type2] == nextData[type2]
          ) {
            // 将下一个索引数据的值和当前索引数据的值的相加作为当前索引最新的数据
            currentData.normal += nextData.normal;
            currentData.leave += nextData.leave;
            currentData.other += nextData.other;
            currentData.total += nextData.total;
            currentData.demobilize += nextData.demobilize;
            currentData.occupingMeeting += nextData.occupingMeeting;
            currentData.equipment += nextData.equipment;
            res.data.splice(index + 1, 1); // 删除下一条数据
            mergeTables(res.data);
            break;
          }
        }
      }
      // console.log('res.data: ', res.data);
      mergeTables();
      this.monthStatisticsData = res.data;
      this.merage(); // 表格合并
      this.noChange = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.rollcallmonthstatistics {
  padding: 0 10px;
  height: calc(100vh - 175px);
  background-color: white;
  .selectTime {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    .lastMon {
      width: 33px;
      height: 33px;
      border-radius: 50%;
      background: url(../../../assets/rollCallOnDutyIcon/left.png) no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
    }

    .nextMon {
      width: 33px;
      height: 33px;
      border-radius: 50%;
      background: url(../../../assets/rollCallOnDutyIcon/right.png) no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
    }

    .selectMon {
      margin: 0 20px;
      font-size: 20px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }
  }
}
</style>
