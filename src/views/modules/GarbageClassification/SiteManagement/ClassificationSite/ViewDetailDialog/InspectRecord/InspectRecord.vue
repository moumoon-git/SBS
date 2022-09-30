<template>
  <div
    class="inspect-record"
    v-if="visible"
    v-loading="loading"
    element-loading-spinner="sv-loading"
  >
    <div class="inspect-record__header">
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
      <sv-button @click="xlsInvestigationOutputCondition()"
        ><span class="export-button"></span>导出</sv-button
      >
    </div>
    <div class="inspect-record__statistics">
      <span class="inspect-record__statistics__item">
        <div>{{ statistics.investigationAll }}</div>
        <div>巡查总数(次)</div>
      </span>
      <span class="inspect-record__statistics__item">
        <div>{{ statistics.peopleAll }}</div>
        <div>巡查人数(人)</div>
      </span>
      <span class="inspect-record__statistics__item">
        <div>{{ statistics.investigationUnusual }}</div>
        <div>异常数</div>
      </span>
      <span class="inspect-record__statistics__item">
        <div>{{ statistics.workEnd }}</div>
        <div>工单办结数</div>
      </span>
    </div>
    <div
      class="inspect-record__table"
      v-for="(record, index) in tableList"
      :key="`inspect_record_${index}`"
    >
      <!-- header -->
      <div class="inspect-record__table__header">
        <span>{{ record.investigationTime }}</span>
        <span class="inspect-record__table__header__item">
          <span>巡查人员：</span>
          {{
            record.memberEntity && record.memberEntity.name
              ? record.memberEntity.name
              : ""
          }}
          {{
            record.memberEntity && record.memberEntity.roleIdString
              ? `(${record.memberEntity.roleIdString})`
              : ""
          }}
        </span>
        <span class="inspect-record__table__header__item">
          <span>巡查情况：</span>
          {{ record.unusual ? "发现异常" : "未发现异常" }}
        </span>
        <span class="inspect-record__table__header__item">
          <span>巡查结果：</span>
          <span style="color: #0bd295"
            >正常{{ record.usual ? record.usual : 0 }}</span
          >
          <span style="color: #f66e6e"
            >异常{{ record.unusual ? record.unusual : 0 }}</span
          >
        </span>
      </div>
      <!-- content -->
      <div class="inspect-record__table__content">
        <div class="inspect-record__table__content__tabs">
          <span
            class="tab"
            :class="{
              active: itemIndex == currentIndexSet[index],
              usual: item.status && item.status == 1,
              unusual: item.status != 1
            }"
            v-for="(item, itemIndex) in record.instanceInforList"
            :key="`inspect_record_itemname_${itemIndex}`"
            @click="switchTab(index, itemIndex)"
            >{{ item.inforName }}</span
          >
        </div>
        <div class="inspect-record__table__content__item">
          <span>巡查结果：</span>
          <span
            v-if="
              record.instanceInforList[currentIndexSet[index]].status &&
                record.instanceInforList[currentIndexSet[index]].status == 1
            "
            style="color: #0bd295"
            >正常</span
          >
          <span style="color: #f66e6e" v-else>异常</span>
        </div>
        <div class="inspect-record__table__content__item">
          <span>情况说明：</span>
          {{
            record.instanceInforList[currentIndexSet[index]].remark
              ? record.instanceInforList[currentIndexSet[index]].remark
              : ""
          }}
        </div>
        <div class="inspect-record__table__content__item">
          <viewer
            :images="
              record.instanceInforList[currentIndexSet[index]] &&
              record.instanceInforList[currentIndexSet[index]].imgList &&
              record.instanceInforList[currentIndexSet[index]].imgList.length
                ? record.instanceInforList[currentIndexSet[index]].imgList.map(
                    e => e.allUrl
                  )
                : []
            "
          >
            <img
              v-for="(img, imgIndex) in record.instanceInforList[
                currentIndexSet[index]
              ].imgList"
              :key="`img_${index}_${imgIndex}`"
              height="50"
              :src="img.allUrl"
              :alt="img.name"
              style="margin: 0 10px 10px 0"
            />
          </viewer>
        </div>
        <!-- footer -->
        <div class="inspect-record__table__footer">
          {{
            record.instanceInforList[currentIndexSet[index]].place
              ? record.instanceInforList[currentIndexSet[index]].place
              : ""
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "InspectRecord",
  data() {
    return {
      visible: false,
      loading: false,
      currentId: "",
      status: "",
      // 撤桶状态选择器选项
      statusOptions: [
        {
          label: "正常",
          value: "1"
        },
        {
          label: "异常",
          value: "2"
        }
      ],
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
      statistics: {
        investigationAll: "",
        peopleAll: "",
        investigationUnusual: "",
        workEnd: ""
      },
      // 每条数据的当前激活tab的下标
      currentIndexSet: [],
      // 当前登录用户的token
      token: this.$cookie.get("token")
    };
  },
  methods: {
    /**
     * @method
     * @desc 初始化页面
     */
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
        url: "garbage/garbageInvestigationInstance/history",
        baseURL: window.SITE_CONFIG.baseUrl,
        headers: {
          token: this.$cookie.get("token")
        },
        data: {
          startTime,
          endTime,
          pointId: this.currentId,
          resultStatus: this.status
        }
      };
      this.$http(request)
        .then(response => {
          if (response.data.code == 0) {
            this.tableList = response.data.page;
            this.currentIndexSet = new Array(response.data.page.length).fill(0);
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
      request.url = "/garbage/garbageInvestigationInstance/historyCount";
      this.$http(request)
        .then(response => {
          if (response.data.code == 0) {
            this.statistics = response.data.data;
          } else {
            console.log(
              "获取守桶记录统计失败！错误信息：【\n",
              response,
              "\n】"
            );
          }
        })
        .catch(error => {
          console.log("获取守桶记录统计失败！错误信息：【\n", error, "\n】");
        });
    },
    /**
     * @method
     * @desc 导出查询数据
     */
    xlsInvestigationOutputCondition() {
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
        url: "/garbage/garbageSortPoint/xlsInvestigationOutputCondition",
        baseURL: window.SITE_CONFIG.baseUrl,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          token: this.token
        },
        data: {
          startTime,
          endTime,
          pointId: this.currentId,
          resultStatus: this.status
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
     * @desc 点击切换
     * @param {Number} recordIndex record下标
     * @param {Number} itemIndex item下标
     */
    switchTab(recordIndex, itemIndex) {
      this.currentIndexSet[recordIndex] = itemIndex;
      this.$forceUpdate();
    }
  }
};
</script>

<style scoped lang="scss">
.inspect-record {
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
  &__table {
    margin: 10px auto 20px;
    border: 1px solid #dae7f8;
    width: 800px;
    img {
      cursor: zoom-in;
    }
    &__header {
      background: #f0f5ff;
      padding: 10px;
      & > span:nth-child(1) {
        color: #333333;
        font-weight: bold;
      }
      &__item {
        color: #666666;
        font-weight: bold;
        line-height: 14px;
        padding: 0 20px;
        &:not(:last-child) {
          border-right: 1px solid #dae7f8;
        }
        & > span {
          color: #999999;
        }
      }
    }
    &__content {
      &__tabs {
        display: inline-block;
        cursor: pointer;
        border: 1px solid #cccccc;
        border-radius: 3px;
        margin: 10px 0 0 15px;
        .tab {
          display: inline-block;
          padding: 5px 10px;
          color: #666666;
          user-select: none;
          &:not(:last-child) {
            border-right: 1px solid #cccccc;
          }
          &.active {
            color: white;
            background: #3f92fe;
            border: none;
          }
          // 绿点
          &.usual::before {
            content: "";
            margin: 0 5px 2px 0;
            display: inline-block;
            width: 6px;
            height: 6px;
            background: #0bd295;
            border-radius: 50%;
          }
          // 红点
          &.unusual::before {
            content: "";
            margin: 0 5px 2px 0;
            display: inline-block;
            width: 6px;
            height: 6px;
            background: #f66e6e;
            border-radius: 50%;
          }
        }
      }
      &__item {
        margin: 10px 20px 0;
        & > span:first-child {
          color: #999999;
        }
        // 图片和viewer
        * {
          display: inline-block;
        }
      }
    }
    &__footer {
      border-top: 1px solid #f0f5ff;
      color: #666666;
      padding: 10px 35px;
      position: relative;
      margin-top: 10px;
      &:before {
        content: "";
        display: block;
        height: 20px;
        width: 20px;
        position: absolute;
        left: 10px;
        background: no-repeat center/100% 100%
          url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTNweCIgaGVpZ2h0PSIxN3B4IiB2aWV3Qm94PSIwIDAgMTMgMTciIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+5b2i54q2PC90aXRsZT4KICAgIDxnIGlkPSLlnoPlnL7liIbnsbvnrqHnkIYiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSLlnoPlnL7liIbnsbvngrnor6bmg4Ut5beh5p+l6K6w5b2VIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzQyLjAwMDAwMCwgLTQ3Ny4wMDAwMDApIiBmaWxsPSIjREREREREIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8ZyBpZD0i5by55qGGIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyODIuMDAwMDAwLCAzOC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSLnu4TlpIfku70tMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDAuMDAwMDAwLCAyMDcuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC0xMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAuMDAwMDAwLCAyMzIuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik02LjQ1NDU0NTUsNC41NDc0NzM1MWUtMTMgQzEwLjAxOTE3NTgsNC41NDc0NzM1MWUtMTMgMTIuOTA5MDkxLDIuOTE2NTkzOTUgMTIuOTA5MDkxLDYuNTEzOTI3MzMgQzEyLjkwOTA5MSw4Ljg1NTYzNjQ0IDEwLjg1NzgzNjQsMTIuMDM3Mjk3MSA2Ljc1NTc1NzYyLDE2LjA1ODA0ODYgQzYuNTg4NDM3MDgsMTYuMjIyMDU1NiA2LjMyMDY1MzkyLDE2LjIyMjA1NTYgNi4xNTMzMzMzOCwxNi4wNTgwNDg2IEw1Ljk1OTY5NzAyLDE1Ljg2NzQyNDQgQzEuOTg2NzA5MTEsMTEuOTM2NjA2MiAwLDguODE5MDYwNjggMCw2LjUxMzkyNzMzIEMwLDIuOTE2NTkzOTcgMi44ODk5MTUxNyw0LjU0NzQ3MzUxZS0xMyA2LjQ1NDU0NTUsNC41NDc0NzM1MWUtMTMgWiBNNi40NTQ1NDU1LDMuODYxOTY5NzQgQzUuMjY2Mjk2NDksMy44NjE5Njk3NCA0LjMwMzAzMDM0LDQuODI1MjM1ODkgNC4zMDMwMzAzNCw2LjAxMzQ4NDkgQzQuMzAzMDMwMzQsNy4yMDE3MzM5MSA1LjI2NjI5NjQ5LDguMTY1MDAwMDYgNi40NTQ1NDU1LDguMTY1MDAwMDYgQzcuNjQyNzk0NTEsOC4xNjUwMDAwNiA4LjYwNjA2MDY2LDcuMjAxNzMzOTEgOC42MDYwNjA2Niw2LjAxMzQ4NDkgQzguNjA2MDYwNjYsNC44MjUyMzU4OSA3LjY0Mjc5NDUxLDMuODYxOTY5NzQgNi40NTQ1NDU1LDMuODYxOTY5NzQgTDYuNDU0NTQ1NSwzLjg2MTk2OTc0IFoiIGlkPSLlvaLnirYiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==");
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