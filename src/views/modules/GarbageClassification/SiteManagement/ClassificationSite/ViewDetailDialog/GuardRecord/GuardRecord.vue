<template>
  <div
    class="guard-record"
    v-if="visible"
    v-loading="loading"
    element-loading-spinner="sv-loading"
  >
    <div class="guard-record__header">
      <span v-if="dateRange">
        <span @click="prev" class="button el-icon-arrow-left"></span>
        <span style="margin: 0 10px">
          {{ currentYear }}
          {{ dateRange == "1" ? `${currentMonth}月` : null }}
          {{
            dateRange == "2"
              ? currentQuarterly == "1"
                ? "第一季度"
                : currentQuarterly == "2"
                ? "第二季度"
                : currentQuarterly == "3"
                ? "第三季度"
                : currentQuarterly == "4"
                ? "第四季度"
                : ""
              : ""
          }}
        </span>
        <span class="button el-icon-arrow-right" @click="next"></span>
      </span>
      <span v-else>
        <span class="button inactive el-icon-arrow-left"></span>
        <span style="margin: 0 10px">全部</span>
        <span class="button inactive el-icon-arrow-right"></span>
      </span>
      <sv-select
        placeholder="全部"
        :options="dateRangeOptions"
        v-model="dateRange"
        @change="handleDateRangeChange"
        width="120px"
      />
      <sv-button @click="xlsPunchclockOutputCondition()"
        ><span class="export-button"></span>导出</sv-button
      >
    </div>
    <div class="guard-record__statistics">
      <span class="guard-record__statistics__item">
        <div>{{ Number(totalTime).toFixed(2) }}</div>
        <div>守桶总时长</div>
      </span>
      <span class="guard-record__statistics__item">
        <div>{{ memberCount }}</div>
        <div>守桶人次</div>
      </span>
    </div>
    <div
      class="guard-record__item"
      v-for="(record, index) in tableList"
      :key="`guard_record_${index}`"
    >
      <div
        class="guard-record__item__banner"
        @click="record.expand = !record.expand"
      >
        <span>{{ record.date }}</span>
        <span>
          考勤班次：
          <span
            v-for="(time, timeIndex) in record.garbageShiftList"
            :key="`time_${index}_${timeIndex}`"
          >
            {{ `${time.startTime}-${time.endTime}` }}
          </span>
        </span>
        <span>
          考勤人次：
          <span>{{ record.memberCount ? record.memberCount : "-" }}</span>
        </span>
        <span>
          打卡次数：
          <span>{{
            record.punchclockCount ? record.punchclockCount : "-"
          }}</span>
        </span>
        <span>
          平均时长：
          <span>{{
            record.punchclockCount
              ? `${parseFloat(record.punchclockTimeAvg).toFixed(1)}小时`
              : "-"
          }}</span>
        </span>
        <!-- 箭头 -->
        <span
          class="el-icon-arrow-down"
          :class="{ expand: record.expand }"
        ></span>
      </div>
      <div
        class="guard-record__item__detail"
        :class="{ expand: record.expand }"
        v-for="(detail, detailIndex) in record.detail"
        :key="`guard_record_item_detail_${index}_${detailIndex}`"
      >
        <div class="guard-record__item__detail__header">
          <span>
            <span>考勤班次：</span>
            {{ detail.punchClockDay ? detail.punchClockDay : "-" }}
          </span>
          <span>
            <span>打卡次数：</span>
            {{
              detail.garbagePunchClockList
                ? calculatePunchCount(detail.garbagePunchClockList)
                : "-"
            }}
          </span>
          <span>
            <span>考勤人次：</span>
            {{
              detail.garbagePunchClockList &&
              detail.garbagePunchClockList.length
                ? detail.garbagePunchClockList.length
                : "-"
            }}
          </span>
        </div>
        <!-- 每个人员的详情 -->
        <div
          class="guard-record__item__detail__each"
          v-for="(man, manIndex) in detail.garbagePunchClockList"
          :key="
            `guard_record_item_detail_each_${index}_${detailIndex}_${manIndex}`
          "
        >
          <div class="guard-record__item__detail__each__title">
            <span>
              <span>打卡人员：</span>
              {{
                man.memberEntity && man.memberEntity.name
                  ? man.memberEntity.name
                  : "-"
              }}
            </span>
            <span>
              <span>打卡次数：</span>
              {{ man.punchclockCount ? man.punchclockCount : "-" }}
            </span>
            <span>
              <span>考勤时长：</span>
              {{
                man.memberEntity && man.memberEntity.punchClockTotalTime
                  ? `${parseFloat(man.memberEntity.punchClockTotalTime).toFixed(
                      1
                    )}小时`
                  : "-"
              }}
            </span>
          </div>
          <!-- 打卡标签 -->
          <div class="guard-record__item__detail__each__tag">
            <span
              :class="{
                sign: tag.shiftType == 1,
                leave: tag.shiftType == 2,
                update: tag.shiftType == 3 || tag.shiftType == 4
              }"
              v-for="(tag, tagIndex) in man.punchClockList"
              :key="
                `guard_record_item_detail_each_${index}_${detailIndex}_${manIndex}_${tagIndex}`
              "
            >
              <span style="color: #666666">打卡时间：</span>
              <span v-if="tag.shiftTime" style="color: #333333">{{
                tag.shiftTime.split(" ")[1]
              }}</span>
              <span v-else style="color: #f66e6e">未打卡</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "GuardRecord",
  data() {
    return {
      visible: false,
      loading: false,
      currentId: "",
      // 日期范围选择器取值
      dateRange: "",
      // 日期范围选择器选项
      dateRangeOptions: [
        {
          label: "每月",
          value: "1"
        },
        {
          label: "每季度",
          value: "2"
        },
        {
          label: "每年",
          value: "3"
        }
      ],
      currentYear: "",
      currentMonth: "",
      currentQuarterly: "",
      // 请求的数据列表
      tableList: [],
      // 守桶总时长
      totalTime: 0,
      // 守桶人次
      memberCount: 0,
      // 当前登录用户的token
      token: this.$cookie.get("token")
    };
  },
  methods: {
    init(id) {
      this.currentId = id;
      this.visible = true;
      this.getData();
    },
    /**
     * @method
     * @desc 请求数据
     */
    getData() {
      this.loading = true;
      let startTime = "";
      let endTime = "";
      switch (this.dateRange) {
        case "1":
          startTime = `${this.currentYear}-${this.currentMonth}-1`;
          endTime = `${this.currentYear}-${this.currentMonth}-31`;
          break;
        case "2":
          this.quarterlyToMonth();
          startTime = `${this.currentYear}-${this.currentMonth}-1`;
          endTime = `${this.currentYear}-${this.currentMonth + 2}-31`;
          break;
        case "3":
          startTime = `${this.currentYear}-1-1`;
          endTime = `${this.currentYear}-12-31`;
          break;
      }
      let request = {
        method: "post",
        url: "/garbage/garbagePunchClock/record",
        baseURL: window.SITE_CONFIG.baseUrl,
        headers: {
          token: this.$cookie.get("token")
        },
        data: {
          startTime,
          endTime,
          id: this.currentId
        }
      };
      this.$http(request)
        .then(response => {
          if (response.data.code == 0) {
            this.tableList = response.data.data;
            this.tableList.forEach((element, index) => {
              this.getDetail(element.date, index);
              this.$set(element, "expand", false);
            });
          } else {
            console.log("获取守桶记录失败！错误信息：【\n", response, "\n】");
          }
          this.loading = false;
        })
        .catch(error => {
          console.log("获取守桶记录失败！错误信息：【\n", error, "\n】");
          this.loading = false;
        });
      // 获取统计数据
      request.url = "/garbage/garbagePunchClock/count";
      this.$http(request).then(response => {
        if (response.data.code == 0) {
          this.totalTime = response.data.data.totalTime;
          this.memberCount = response.data.data.memberCount;
        }
      });
    },
    /**
     * @method
     * @desc 导出查询数据
     */
    xlsPunchclockOutputCondition() {
      let startTime = "";
      let endTime = "";
      switch (this.dateRange) {
        case "1":
          startTime = `${this.currentYear}-${this.currentMonth}-1`;
          endTime = `${this.currentYear}-${this.currentMonth}-31`;
          break;
        case "2":
          this.quarterlyToMonth();
          startTime = `${this.currentYear}-${this.currentMonth}-1`;
          endTime = `${this.currentYear}-${this.currentMonth + 2}-31`;
          break;
        case "3":
          startTime = `${this.currentYear}-1-1`;
          endTime = `${this.currentYear}-12-31`;
          break;
      }
      const request = {
        method: "post",
        url: "/garbage/garbageSortPoint/xlsPunchclockOutputCondition",
        baseURL: window.SITE_CONFIG.baseUrl,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          token: this.token
        },
        data: {
          startTime,
          endTime,
          id: this.currentId
        },
        responseType: "arraybuffer"
      };
      axios(request).then(response => {
        if (navigator.msSaveOrOpenBlob) {
          // 兼容ie
          navigator.msSaveOrOpenBlob(
            new Blob([response.data], { type: "application/vnd.ms-excel" }),
            "导出数据.xls"
          );
        } else {
          const fileName = decodeURI(
            escape(response.headers["content-disposition"])
          ).split("fileName%3D")[1];
          let a = document.createElement("a");
          a.href = window.URL.createObjectURL(
            new Blob([response.data], { type: "application/vnd.ms-excel" })
          );
          a.download = fileName || "导出数据.xls";
          document.body.appendChild(a); // 兼容Firefox浏览器
          a.click();
          a.remove();
        }
      });
    },
    /**
     * @method
     * @desc 获取记录的详情
     * @param {String} day 日期
     * @param {Number} index tableList的下标
     */
    getDetail(day, index) {
      const request = {
        method: "get",
        url: "/garbage/garbagePunchClock/recordInfo",
        baseURL: window.SITE_CONFIG.baseUrl,
        params: {
          token: this.$cookie.get("token"),
          id: this.currentId,
          day
        }
      };
      this.$http(request)
        .then(response => {
          if (response.data.code == 0) {
            this.$set(this.tableList[index], "detail", response.data.data);
          } else {
            console.log(
              "获取日期",
              day,
              "详情失败，错误信息：【\n",
              response,
              "\n】"
            );
          }
        })
        .catch(error => {
          console.log(
            "获取日期",
            day,
            "详情失败，错误信息：【\n",
            error,
            "\n】"
          );
        });
    },
    /**
     * @method
     * @desc 切换日期范围跨度，重置日期为今日
     */
    handleDateRangeChange() {
      const date = new Date();
      this.currentYear = date.getFullYear();
      this.currentMonth = date.getMonth() + 1;
      this.monthToQuarterly();
      this.getData();
    },
    /**
     * @method
     * @desc 根据当前月份，计算当前季度
     */
    monthToQuarterly() {
      const month = this.currentMonth;
      switch (true) {
        case 0 < month && month <= 3:
          this.currentQuarterly = 1;
          break;
        case 3 < month && month <= 6:
          this.currentQuarterly = 2;
          break;
        case 6 < month && month <= 9:
          this.currentQuarterly = 3;
          break;
        case 9 < month && month <= 12:
          this.currentQuarterly = 4;
          break;
      }
    },
    /**
     * @method
     * @desc 根据季度，计算当前季度的第一个月
     */
    quarterlyToMonth() {
      switch (this.currentQuarterly) {
        case 1:
          this.currentMonth = 1;
          break;
        case 2:
          this.currentMonth = 4;
          break;
        case 3:
          this.currentMonth = 7;
          break;
        case 4:
          this.currentMonth = 10;
          break;
      }
    },
    /**
     * @method
     * @desc 前一时间段
     */
    prev() {
      switch (this.dateRange) {
        case "1":
          this.currentMonth -= 1;
          if (this.currentMonth == 0) {
            this.currentYear -= 1;
            this.currentMonth = 12;
          }
          this.monthToQuarterly();
          break;
        case "2":
          this.currentQuarterly -= 1;
          if (this.currentQuarterly == 0) {
            this.currentYear -= 1;
            this.currentQuarterly = 4;
          }
          this.quarterlyToMonth();
          break;
        case "3":
          this.currentYear -= 1;
          this.currentMonth = 1;
          this.currentQuarterly = 1;
          break;
      }
      this.getData();
    },
    /**
     * @method
     * @desc 后一时间段
     */
    next() {
      switch (this.dateRange) {
        case "1":
          this.currentMonth += 1;
          if (this.currentMonth == 13) {
            this.currentYear += 1;
            this.currentMonth = 1;
          }
          this.monthToQuarterly();
          break;
        case "2":
          this.currentQuarterly += 1;
          if (this.currentQuarterly == 5) {
            this.currentYear += 1;
            this.currentQuarterly = 1;
          }
          this.quarterlyToMonth();
          break;
        case "3":
          this.currentYear += 1;
          this.currentMonth = 1;
          this.currentQuarterly = 1;
          break;
      }
      this.getData();
    },
    /**
     * @method
     * @desc 计算打卡次数
     * @param {Array} data 数据
     * @return {Number} 次数
     */
    calculatePunchCount(data) {
      let count = 0;
      data.forEach(element => {
        count += element.punchClockList.length;
      });
      return count;
    }
  }
};
</script>

<style scoped lang="scss">
.guard-record {
  display: flex;
  flex-direction: column;
  align-items: center;
  &__header {
    width: 100%;
    border-bottom: 1px solid #dddddd;
    padding: 10px 0;
    text-align: center;
    position: relative;
    line-height: 30px;
    color: #333333;
    & > .sv-button,
    & > .sv-select {
      position: absolute;
    }
    & > .sv-button {
      right: 30px;
    }
    & > .sv-select {
      right: 95px;
    }
  }
  &__statistics {
    width: 100%;
    margin: 10px 0;
    text-align: center;
    font-size: 0;
    &__item {
      display: inline-block;
      width: 100px;
      position: relative;
      & > div:nth-child(1) {
        font-size: bold;
        font-size: 20px;
        color: #333333;
      }
      & > div:nth-child(2) {
        font-size: 14px;
        color: #999999;
      }
      &:not(:last-child):after {
        content: "";
        position: absolute;
        right: -1px;
        top: 8px;
        display: inline-block;
        height: 30px;
        width: 1px;
        border-right: 1px solid #f0f0f0;
      }
    }
  }
  &__item {
    border: 1px solid #dae7f8;
    margin: 5px auto;
    width: 850px;
    &:last-child {
      margin-bottom: 20px;
    }
    // 横幅
    &__banner {
      background: #f0f5ff;
      width: 100%;
      padding: 10px;
      cursor: pointer;
      user-select: none;
      & > span {
        color: #999999;
        font-weight: bold;
        margin-right: 15px;
        flex-shrink: 0;
        // label
        & > span {
          color: #666666;
        }
        // 日期
        &:first-child {
          color: #333333;
        }
        // 箭头
        &:last-child {
          color: #c0c0c0;
          float: right;
          font-size: 22px;
          margin-right: 0;
          transition: transform 0.5s;
          &.expand {
            transform: rotate(-180deg);
          }
        }
      }
    }
    // 展开的详情
    &__detail {
      height: 0;
      overflow: hidden;
      &.expand {
        height: unset;
      }
      // 顶部统计
      &__header {
        text-align: center;
        margin: 20px 0;
        font-weight: bold;
        & > span {
          padding: 0 20px;
          color: #333333;
          position: relative;
          & > span {
            color: #999999;
          }
          &:not(:last-child) {
            border-right: 1px solid #dae7f8;
          }
          // 两端icon
          &:first-child::before,
          &:last-child::after {
            content: "";
            position: absolute;
            display: inline-block;
            width: 20px;
            height: 20px;
            background: no-repeat center/100% 100%
              url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgMTQgMTgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+5bemPC90aXRsZT4KICAgIDxnIGlkPSLlnoPlnL7liIbnsbvnrqHnkIYiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLlnoPlnL7liIbnsbvngrnor6bmg4Ut5a6I5qG26K6w5b2VIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNTI2LjAwMDAwMCwgLTMzNC4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9IuW8ueahhiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjc1LjAwMDAwMCwgNzEuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i57uE5aSH5Lu9LTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM5LjAwMDAwMCwgMjA2LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMTAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIxMi4wMDAwMDAsIDU2LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uELTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCAxLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTExLjU3MjM1NTQsMC43ODk2MzA0NzcgQzEyLjM3MjU1NDUsMS4wMDQwNDMxOSAxMi44NDc0MjgzLDEuODI2NTQ4NjMgMTIuNjMzMDE1NSwyLjYyNjc0Nzc4IEw5LjAwOTU0ODkxLDE2LjE0OTcwOTQgQzguNzk1MTM2MTksMTYuOTQ5OTA4NSA3Ljk3MjYzMDc2LDE3LjQyNDc4MjIgNy4xNzI0MzE2LDE3LjIxMDM2OTUgQzYuMzcyMjMyNDUsMTYuOTk1OTU2OCA1Ljg5NzM1ODcxLDE2LjE3MzQ1MTQgNi4xMTE3NzE0MywxNS4zNzMyNTIyIEw5LjczNTIzODA2LDEuODUwMjkwNjUgQzkuOTQ5NjUwNzgsMS4wNTAwOTE0OSAxMC43NzIxNTYyLDAuNTc1MjE3NzU5IDExLjU3MjM1NTQsMC43ODk2MzA0NzcgWiIgaWQ9IuefqeW9oiIgZmlsbD0iIzg5REVGRiIgb3BhY2l0eT0iMC44MDAwMDAwMTIiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik00LjI5NTg5ODI0LDMuNjg3NDA3OTYgQzUuMDk2MDk3MzksMy45MDE4MjA2NyA1LjU3MDk3MTEyLDQuNzI0MzI2MTEgNS4zNTY1NTg0MSw1LjUyNDUyNTI2IEwzLjI4NjAwNjA1LDEzLjI1MTkzMTkgQzMuMDcxNTkzMzMsMTQuMDUyMTMxIDIuMjQ5MDg3ODksMTQuNTI3MDA0OCAxLjQ0ODg4ODc0LDE0LjMxMjU5MiBDMC42NDg2ODk1ODQsMTQuMDk4MTc5MyAwLjE3MzgxNTg1LDEzLjI3NTY3MzkgMC4zODgyMjg1NjgsMTIuNDc1NDc0NyBMMi40NTg3ODA5Myw0Ljc0ODA2ODEzIEMyLjY3MzE5MzY1LDMuOTQ3ODY4OTcgMy40OTU2OTkwOCwzLjQ3Mjk5NTI0IDQuMjk1ODk4MjQsMy42ODc0MDc5NiBaIiBpZD0i55+p5b2i5aSH5Lu9IiBmaWxsPSIjODlERkZGIiBvcGFjaXR5PSIwLjUiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+");
          }
          &:first-child::before {
            left: -5px;
          }
          &:last-child::after {
            right: -5px;
            transform: rotate(180deg);
          }
        }
      }
      // 每个人员的详情
      &__each {
        margin: 0 20px 10px;
        // 统计
        &__title {
          margin-bottom: 10px;
          & > span {
            color: #666666;
            font-weight: bold;
            margin: 0 20px 0 0;
            & > span {
              color: #999999;
            }
          }
        }
        // 打卡标签
        &__tag {
          & > span {
            display: inline-block;
            width: 245px;
            height: 80px;
            line-height: 80px;
            text-align: center;
            border: 1px solid #e4e7ed;
            border-radius: 8px;
            margin: 0 20px 10px 0;
            position: relative;
            font-weight: bold;
            background: no-repeat right top
              url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iODZweCIgaGVpZ2h0PSI2OXB4IiB2aWV3Qm94PSIwIDAgODYgNjkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDExPC90aXRsZT4KICAgIDxkZWZzPgogICAgICAgIDxsaW5lYXJHcmFkaWVudCB4MT0iNjIuODkwNjI1JSIgeTE9IjEwNy4wMzcwOCUiIHgyPSIxNS44MzE5NzI5JSIgeTI9IjEzLjkwMjE2ODglIiBpZD0ibGluZWFyR3JhZGllbnQtMSI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNGMUY2RkMiIG9mZnNldD0iMCUiPjwvc3RvcD4KICAgICAgICAgICAgPHN0b3Agc3RvcC1jb2xvcj0iI0Y4RkJGRiIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+CiAgICAgICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDwvZGVmcz4KICAgIDxnIGlkPSLlnoPlnL7liIbnsbvnrqHnkIYiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG9wYWNpdHk9IjAuODk4MjI4MjM3Ij4KICAgICAgICA8ZyBpZD0i5Z6D5Zy+5YiG57G754K56K+m5oOFLeWuiOahtuiusOW9lSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQ4OS4wMDAwMDAsIC00MDcuMDAwMDAwKSIgZmlsbD0idXJsKCNsaW5lYXJHcmFkaWVudC0xKSI+CiAgICAgICAgICAgIDxnIGlkPSLlvLnmoYYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI3NS4wMDAwMDAsIDcxLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Iue7hOWkh+S7vS0zIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzOS4wMDAwMDAsIDIwNi4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uELTEy5aSH5Lu9LTYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE4LjAwMDAwMCwgMTI4LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uELTExIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyLjAwMDAwMCwgMi4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE1NS4wMDAwMDAsIC02My4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Y2lyY2xlIGlkPSLmpK3lnIblvaIiIGN4PSI2MC41IiBjeT0iNjAuNSIgcj0iNjAuNSI+PC9jaXJjbGU+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==");
            &:before {
              content: "";
              display: block;
              width: 60px;
              height: 60px;
              position: absolute;
              left: -5px;
              top: -5px;
              background: no-repeat center/100% 100% transparent;
            }
            &.sign:before {
              background-image: url("data:image/png;base64,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");
            }
            &.leave:before {
              background-image: url("data:image/png;base64,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");
            }
            &.update:before {
              background-image: url("data:image/png;base64,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");
            }
          }
        }
      }
    }
  }
  .export-button {
    height: 20px;
    width: 20px;
    position: relative;
    top: 6px;
    display: inline-block;
    background: no-repeat center/100% 100%
      url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNXB4IiB2aWV3Qm94PSIwIDAgMTQgMTUiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+aWNvbl/lr7zlhaVf55S75p2/IDE8L3RpdGxlPgogICAgPGcgaWQ9IuWeg+WcvuWIhuexu+euoeeQhiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuWeg+WcvuWIhuexu+eCueivpuaDhS3mkqTmobborrDlvZUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMTAwLjAwMDAwMCwgLTEzNi4wMDAwMDApIiBmaWxsPSIjM0Y5MkZFIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8ZyBpZD0i5by55qGGIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyODUuMDAwMDAwLCAzOS4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJidG4iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDgwMi4wMDAwMDAsIDg5LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJpY29uX+WvvOWFpV/nlLvmnb8tMSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMDAwMDAwLCAxNS4wMDE5NTMpIHNjYWxlKDEsIC0xKSB0cmFuc2xhdGUoLTIwLjAwMDAwMCwgLTE1LjAwMTk1MykgdHJhbnNsYXRlKDEzLjAwMDAwMCwgOC4wMDE5NTMpIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTEyLjE0Mjg1NzEsNy44NTkwOTU5OCBDMTIuMzcwMTg1Niw3Ljg1OTA5NTk4IDEyLjU4ODIwMzIsNy45NDk0MDE4NCAxMi43NDg5NDg3LDguMTEwMTQ3MzEgQzEyLjkwOTY5NDEsOC4yNzA4OTI3OCAxMyw4LjQ4ODkxMDQyIDEzLDguNzE2MjM4ODQgTDEzLDguNzE2MjM4ODQgTDEzLDEyLjE0NDgxMDMgQzEzLDEyLjYxODE5NzIgMTIuNjE2MjQ0MSwxMy4wMDE5NTMxIDEyLjE0Mjg1NzEsMTMuMDAxOTUzMSBMMTIuMTQyODU3MSwxMy4wMDE5NTMxIEwxLjg1NzE0Mjg2LDEzLjAwMTk1MzEgQzEuMzgzNzU1OTMsMTMuMDAxOTUzMSAxLDEyLjYxODE5NzIgMSwxMi4xNDQ4MTAzIEwxLDEyLjE0NDgxMDMgTDEsOC43MTYyMzg4NCBDMSw4LjI0Mjg1MTkxIDEuMzgzNzU1OTMsNy44NTkwOTU5OCAxLjg1NzE0Mjg2LDcuODU5MDk1OTggQzIuMzMwNTI5NzgsNy44NTkwOTU5OCAyLjcxNDI4NTcxLDguMjQyODUxOTEgMi43MTQyODU3MSw4LjcxNjIzODg0IEwyLjcxNDI4NTcxLDguNzE2MjM4ODQgTDIuNzE0Mjg1NzEsMTEuMjg3NjY3NCBMMTEuMjg1NzE0MywxMS4yODc2Njc0IEwxMS4yODU3MTQzLDguNzE2MjM4ODQgQzExLjI4NTcxNDMsOC4yNDI4NTE5MSAxMS42Njk0NzAyLDcuODU5MDk1OTggMTIuMTQyODU3MSw3Ljg1OTA5NTk4IFogTTcuMDMsMS44NTkwOTYwMSBDNy4xNTg3Mzc1NiwxLjg1OTA5NjAxIDcuMjgwMzY0MjgsMS45MTgxMzc0NCA3LjM2LDIuMDE5Mjg4MzggTDkuODg4NTcxNDMsNS4xNTY0MzEyNCBDOS45ODg1Mzk3Miw1LjI4MjYyMTQ0IDEwLjAwOTM1NjUsNS40NTQxOTEyMiA5Ljk0MjQ2NjI4LDUuNjAwNjI2NiBDOS44NzU1NzYwNSw1Ljc0NzA2MTk4IDkuNzMyMjYzMjksNS44NDM2NTkgOS41NzE0Mjg1Nyw1Ljg1MDcxNjk1IEw3Ljg1NzE0Mjg2LDUuODUwNzE2OTUgTDcuODU3MTQyODYsOS4yNzkyODgzOCBDNy44NTcxNDI4NCw5Ljc1MjY3NTMgNy40NzMzODY5MiwxMC4xMzY0MzEyIDcsMTAuMTM2NDMxMiBDNi41MjY2MTMwOCwxMC4xMzY0MzEyIDYuMTQyODU3MTYsOS43NTI2NzUzIDYuMTQyODU3MTQsOS4yNzkyODgzOCBMNi4xNDI4NTcxNCw1Ljg1MDcxNjk1IEw0LjUwNTcxNDI5LDUuODUwNzE2OTUgQzQuMzQxNzg5MDQsNS44NDk5NjM5NiA0LjE5MjY1MzQ0LDUuNzU1NzY5NTEgNC4xMjE1MzkzNSw1LjYwODA3MTAzIEM0LjA1MDQyNTI2LDUuNDYwMzcyNTQgNC4wNjk3OTIxMSw1LjI4NTA0NzI4IDQuMTcxNDI4NTcsNS4xNTY0MzEyNCBMNi43LDIuMDE5Mjg4MzggQzYuNzc5NjM1NzIsMS45MTgxMzc0NCA2LjkwMTI2MjQ0LDEuODU5MDk2MDEgNy4wMywxLjg1OTA5NjAxIFoiIGlkPSLlkIjlubblvaLnirYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDcuMDAwMDAwLCA3LjQzMDUyNSkgc2NhbGUoMSwgLTEpIHRyYW5zbGF0ZSgtNy4wMDAwMDAsIC03LjQzMDUyNSkgIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=");
  }
  .button {
    color: #495060;
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0px 3px 9px 0px rgba(66, 132, 236, 0.09);
    border: 1px solid #dbe3e9;
    cursor: pointer;
    &:hover {
      color: #0091ff;
    }
    &.inactive {
      color: #dbe3e9;
      cursor: not-allowed;
    }
  }
}
</style>