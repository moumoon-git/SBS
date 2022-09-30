<template>
  <div
    class="cleaning-record"
    v-if="visible"
    v-loading="loading"
    element-loading-spinner="sv-loading"
  >
    <div class="cleaning-record__header">
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
      <sv-button @click="xlsWithdrawOutputCondition()"
        ><span class="export-button"></span>导出</sv-button
      >
    </div>
    <div class="cleaning-record__statistics">
      <span class="cleaning-record__statistics__item">
        <div>{{ totalCount }}</div>
        <div>保洁总次数</div>
      </span>
      <span class="cleaning-record__statistics__item">
        <div>{{ memberCount }}</div>
        <div>保洁人数</div>
      </span>
    </div>
    <div class="clenaing-record__table">
      <div
        v-for="(record, index) in tableList"
        :key="`cleaning_record_${index}`"
      >
        <table class="static-table">
          <tr>
            <td colspan="4">
              <span>
                <span style="color: #999999">保洁日期：</span>
                <span style="font-weight: bold">{{ record.date }}</span>
              </span>
              <span style="margin-left: 20px">
                <span style="color: #999999">保洁次数：</span>
                <span style="font-weight: bold">{{ record.data.length }}</span>
              </span>
            </td>
          </tr>
          <tr>
            <th>保洁时间</th>
            <th>保洁员</th>
            <th>保洁情况</th>
            <th>保洁照片</th>
          </tr>
          <tr
            v-for="(item, index) in record.data"
            :key="`cleaning_record_table_${index}`"
          >
            <td>
              {{ item.withdrawTime ? item.withdrawTime.split(" ")[1] : "" }}
            </td>
            <td>{{ item.memberName ? item.memberName : "" }}</td>
            <td>{{ item.remark ? item.remark : "" }}</td>
            <td>
              <viewer
                :images="
                  item.imgList && item.imgList.length
                    ? item.imgList.map(e => e.allUrl)
                    : []
                "
              >
                <img
                  v-for="(img, imgIndex) in item.imgList"
                  :key="`img_${index}_${imgIndex}`"
                  :src="img.allUrl"
                  :alt="img.name"
                  height="50"
                />
              </viewer>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "CleaningRecord",
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
      // 保洁人数
      memberCount: 0,
      // 保洁总次数
      totalCount: 0,
      // 当前登录用户的token
      token: this.$cookie.get("token")
    };
  },
  methods: {
    init(id) {
      this.visible = true;
      this.currentId = id;
      this.getData();
    },
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
        url: "garbage/garbageWithdraw/showPcRecord",
        baseURL: window.SITE_CONFIG.baseUrl,
        headers: {
          token: this.$cookie.get("token")
        },
        data: {
          startTime,
          endTime,
          // 保洁
          type: "2",
          id: this.currentId
        }
      };
      this.$http(request)
        .then(response => {
          if (response.data.code == 0) {
            // 数据预处理，按天数分类
            this.tableList = [];
            response.data.data.forEach(element => {
              let date = element.withdrawTime.split(" ")[0];
              let index = this.tableList.findIndex(
                record => record.date == date
              );
              if (index == -1) {
                this.tableList.push({
                  date,
                  data: [element]
                });
              } else {
                this.tableList[index].data.push(element);
              }
            });
          } else {
            console.log("获取保洁记录失败！错误信息：【\n", response, "\n】");
          }
          this.loading = false;
        })
        .catch(error => {
          console.log("获取保洁记录失败！错误信息：【\n", error, "\n】");
          this.loading = false;
        });
      request.url = "/garbage/garbageWithdraw/count";
      this.$http(request).then(response => {
        if (response.data.code == 0) {
          this.totalCount = response.data.data.totalCount;
          this.memberCount = response.data.data.memberCount;
        }
      });
    },
    /**
     * @method
     * @desc 导出查询数据
     */
    xlsWithdrawOutputCondition() {
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
        url: "/garbage/garbageSortPoint/xlsWithdrawOutputCondition",
        baseURL: window.SITE_CONFIG.baseUrl,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          token: this.token
        },
        data: {
          startTime,
          endTime,
          status: this.status,
          // 保洁
          type: "2",
          id: this.currentId
        },
        responseType: "arraybuffer"
      };
      axios(request).then(response => {
        if (navigator.msSaveOrOpenBlob) {
          // 兼容ie
          navigator.msSaveOrOpenBlob(
            new Blob([response.data], { type: "application/vnd.ms-excel" }),
            "保洁记录导出.xls"
          );
        } else {
          const fileName = decodeURI(
            escape(response.headers["content-disposition"])
          ).split("fileName%3D")[1];
          let a = document.createElement("a");
          a.href = window.URL.createObjectURL(
            new Blob([response.data], { type: "application/vnd.ms-excel" })
          );
          a.download = fileName || "保洁记录导出.xls";
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
    }
  }
};
</script>

<style scoped lang="scss">
.cleaning-record {
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
  .static-table {
    margin: 10px auto 20px;
    max-height: 600px;
    display: block;
    overflow-y: auto;
    border: 1px solid #efeded;
    border-collapse: collapse;
    img {
      cursor: zoom-in;
    }
    td {
      color: #666666;
    }
    th,
    td {
      text-align: center;
      border: 1px solid #efeded;
      padding: 10px;
      width: 200px;
    }
    th {
      background: #f0f5ff;
      color: #333333;
      &:first-child {
        border-left: none;
      }
    }
    tr > td:first-child {
      border-left: none;
    }
    tr > td:last-child,
    tr > th:last-child {
      border-right: none;
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:first-child {
      background: #f0f5ff;
      td {
        text-align: left;
        padding-left: 10px;
        border: none;
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