<template>
  <div class="sv-select-time-range">
    <div class="sv-select-time-range__header">
      <span class="sv-select-time-range__header__title">
        {{ `${name}时间` }}
      </span>
      <span
        v-if="!limit || timeList.length < limit"
        class="sv-select-time-range__header__add"
        @click="addRange"
      >
        {{ `添加${name}时间` }}
      </span>
    </div>
    <div
      v-for="(item, index) in timeList"
      :key="`time_range_item_${index}`"
      class="sv-select-time-range__item"
    >
      <el-time-picker
        v-model="item.timeRange[0]"
        placeholder="开始时间"
        :clearable="false"
        format="HH:mm"
        value-format="HH:mm"
        :picker-options="{
          format: 'HH:mm',
          selectableRange: calculateValidTime('startTime', index),
        }"
        @change="updateData"
      />
      <span class="sv-select-time-range__item__separate">至</span>
      <el-time-picker
        v-model="item.timeRange[1]"
        placeholder="结束时间"
        :clearable="false"
        format="HH:mm"
        value-format="HH:mm"
        :picker-options="{
          format: 'HH:mm',
          selectableRange: calculateValidTime('endTime', index),
        }"
        @change="updateData"
      />
      <sv-table-operation
        :display="['delete']"
        @delete="deleteRange(index)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SvSelectTimeRange',
  model: {
    prop: 'range',
    event: 'change',
  },
  props: {
    name: {
      type: String,
      default: '',
    },
    range: {
      type: Array,
      default: () => [
        {
          startTime: '09:00',
          endTime: '12:00',
        },
      ],
    },
    limit: {
      type: [Number, String, Boolean],
      default: 2,
    },
  },
  data() {
    return {
      timeList: [
        {
          timeRange: '',
        },
      ],
    };
  },

  watch: {
    // 将传入的值转换成el-time-picker的数据结构
    // range: {
    //   deep: true,
    //   handler(newVal) {
    //     this.timeList = [];
    //     newVal.forEach((element) => {
    //       this.timeList.push({
    //         timeRange: [element.startTime, element.endTime],
    //       });
    //     });
    //   },
    // },
  },

  mounted() {
    // 将传入的值转换成el-time-picker的数据结构
    this.timeList = [];
    this.range.forEach((element) => {
      this.timeList.push({
        timeRange: [element.startTime, element.endTime],
      });
    });
  },

  methods: {
    /**
     * @method
     * @desc 增加一个范围
     */
    addRange() {
      this.timeList.push({
        timeRange: ['', ''],
      });
    },

    /**
     * @method
     * @desc 删除对应下标的一条范围
     */
    deleteRange(index) {
      this.timeList.splice(index, 1);
      this.updateData();
    },

    /**
     * @method
     * @desc 将el-time-picker的数据转换成需要的数据结构，emit到父组件
     */
    updateData() {
      const result = [];
      this.timeList.forEach((element) => {
        if (element.timeRange[0] && element.timeRange[1]) {
          result.push({
            startTime: element.timeRange[0],
            endTime: element.timeRange[1],
          });
        }
      });
      this.$emit('change', result);
    },

    /**
     * @method
     * @description 计算剩余的可用时间
     * @param { String } type 开始时间还是结束时间
     * @param { Number } index 时间段的下标
     * @return { Array } 可用时间段字符串的数组
     */
    calculateValidTime(type, index) {
      // 格式转换函数
      const dateToNum = (date) => Number(date.split(':')[0]) * 60 + Number(date.split(':')[1]);
      const numToDate = (num) => {
        const hour = `0${String(Math.floor(num / 60))}`.slice(-2);
        const minute = `0${String(num % 60)}`.slice(-2);
        return `${hour}:${minute}:00`;
      };

      // 可用时间轴
      const timeArr = Array(60 * 24).fill(1);

      // 先处理不同index下的时间
      this.timeList.forEach((range, i) => {
        if (i !== index) {
          // 开始和结束时间都有值才限制
          if (range.timeRange[0] && range.timeRange[1]) {
            timeArr.splice(
              dateToNum(range.timeRange[0]),
              dateToNum(range.timeRange[1]) - dateToNum(range.timeRange[0]) + 1,
              ...Array(dateToNum(range.timeRange[1]) - dateToNum(range.timeRange[0]) + 1).fill(0),
            );
          }
        }
      });

      // 处理同index下的开始时间或结束时间
      if (type === 'startTime') {
        if (this.timeList[index].timeRange && this.timeList[index].timeRange[1]) {
          const endTimeIndex = dateToNum(this.timeList[index].timeRange[1]) - 1;
          timeArr.splice(
            endTimeIndex + 1,
            24 * 60 - endTimeIndex,
            ...Array(24 * 60 - endTimeIndex).fill(0),
          );
          // 找到可用的开始时间
          let startTimeIndex = 0;
          for (let j = endTimeIndex - 1; j >= 0; j -= 1) {
            if (timeArr[j] === 0) {
              startTimeIndex = j;
              break;
            }
          }
          timeArr.splice(0, startTimeIndex + 1, ...Array(startTimeIndex + 1).fill(0));
        }
      } else if (type === 'endTime') {
        if (this.timeList[index].timeRange && this.timeList[index].timeRange[0]) {
          const startTimeIndex = dateToNum(this.timeList[index].timeRange[0]);
          timeArr.splice(
            0,
            startTimeIndex,
            ...Array(startTimeIndex).fill(0),
          );
          // 找到可用的结束时间
          let endTimeIndex = 1440 - 1;
          for (let j = startTimeIndex; j < 1440; j += 1) {
            if (timeArr[j] === 0) {
              endTimeIndex = j;
              break;
            }
          }
          timeArr.splice(
            endTimeIndex,
            24 * 60 - endTimeIndex,
            ...Array(24 * 60 - endTimeIndex).fill(0),
          );
        }
      }

      // 处理后的时间段结果
      const result = [];
      let startTime = '';
      timeArr.forEach((bit, i) => {
        if (startTime) {
          if (bit === 0) {
            result.push(`${startTime} - ${numToDate(i - 1)}`);
            startTime = '';
          }
        } else {
          if (bit === 1) {
            startTime = numToDate(i);
          }
        }
      });
      // 处理最后一段时间
      if (startTime) {
        result.push(`${startTime} - 23:59:00`);
      }
      return result;
    },
  },
};
</script>

<style lang="scss">
.sv-select-time-range {
  * {
    font-size: 14px;
  }
  width: 100%;
  border-radius: 3px;
  background: #f1f6ff;
  padding: 5px 10px;
  &__header {
    display: flex;
    &__title {
      flex: 1;
      color: #000000;
    }
    &__add {
      cursor: pointer;
      color: #0091ff;
      &::before {
        content: "";
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-right: 5px;
        background: no-repeat center/100% 100%
          url("../img/icon/cross_hover.svg");
      }
      &:hover {
        color: #5eadff;
      }
      &:active {
        color: #0083e6;
      }
    }
  }
  &__item {
    margin: 5px 0;
    display: flex;
    align-items: center;
    .el-date-editor {
      width: 120px;
      .el-input__inner {
        flex: 1;
        width: 120px;
        height: 30px;
        line-height: 30px;
      }
      .el-icon-time {
        line-height: 30px;
      }
    }
    &__separate {
      margin: 0 8px;
    }
    .sv-table-operation {
      margin-left: 5px;
      width: 50px;
    }
  }
}
</style>
