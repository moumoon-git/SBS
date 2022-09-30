<template>
  <div
    class="demo-app-fullcalendar"
    style="padding-bottom: 30px; position: relative"
  >
    <div
      style="
        width: 95%;
        margin: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        box-sizing: border-box;
      "
    >
      <el-button
        type="primary"
        style="position: absolute; left: 1%"
        @click="getScheduleStatistics"
        size="small"
        >值班统计</el-button
      >
      <img
        src="../../../../../../assets/img/previousMonth.png"
        style="width: 1.7vw; height: 1.7vw"
        @click="previousMonth"
      />
      <div style="display: inline-block; margin-left: 1.7vw">
        <div
          style="
            font-size: 19px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 600;
            color: rgba(51, 51, 51, 1);
          "
        >
          {{ calendarTitle }}
        </div>
        <div
          style="
            font-size: 17px;
            font-family: PingFangSC-Light, PingFang SC;
            font-weight: 300;
            color: rgba(51, 51, 51, 1);
            text-align: center;
          "
        >
          {{ calendarSubtitle }}
        </div>
      </div>
      <img
        src="../../../../../../assets/img/nextMonth.png"
        style="width: 1.7vw; height: 1.7vw; margin-left: 1.7vw"
        @click="nextMonth"
      />
      <i
        class="el-icon-date"
        style="
          margin-left: 1.5vw;
          color: rgb(63, 146, 254);
          width: vw;
          font-size: 1.5vw;
        "
        @click="$emit('openCalendar')"
      ></i>
      <el-button
        size="mini"
        type="primary"
        @click="exportData"
        style="margin-left: 30px"
        >导出</el-button
      >
      <!-- <el-upload
    class="upload-demo"
    action=""
    :auto-upload="false"
  :on-change="importData">
      <el-button
        size="mini"
        type="primary"
        style="margin-left: 30px"
        >导入数据</el-button
      >
  </el-upload> -->
      <el-upload
        class="upload-demo"
        action
        :http-request="uploadSectionFile"
        :show-file-list="false"
      >
        <el-button size="mini" type="primary" style="margin-left: 30px"
          >导入数据</el-button
        >
      </el-upload>
      <el-button
        size="mini"
        type="primary"
        @click="exportTemplate"
        style="margin-left: 30px"
        >导出模板</el-button
      >
      <el-switch
        v-model="switchStatus"
        active-text="开启值班短信提醒"
        @change="changeSwitchStatus"  
        class="switch__status"
      />
      <span
        @click="today"
        style="
          display: inline-block;
          padding: 0.26vh 0.87vw;
          position: absolute;
          right: 1%;
          background: rgba(255, 255, 255, 1);
          border-radius: 1.2vw;
          border: 1px solid rgba(240, 240, 240, 1);
          font-size: 19px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        "
        >今天</span
      >
    </div>
    <calendar
      ref="calendar"
      style="width: 95% !important; max-width: initial; margin: auto"
      @change="onChange"
    >
      <div
        class="events"
        slot="dateCellRender"
        slot-scope="value"
        style="height: inherit; position: relative"
        @mouseenter="calendarHoverIndex = dateFormatter(value._d).split(' ')[0]"
        @mouseleave="calendarHoverIndex = -1"
      >
        <el-dropdown
          trigger="click"
          style="position: absolute; right: 0vw"
          v-if="
            settingSchedulingsList[dateFormatter(value._d).split(' ')[0]] &&
            settingSchedulingsList[dateFormatter(value._d).split(' ')[0]][0]
          "
        >
          <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-if="!historicalScheduling"
              icon="el-icon-plus"
              @click.native="
                editSettingScheduling(
                  settingSchedulingsList[dateFormatter(value._d).split(' ')[0]],
                  dateFormatter(value._d).split(' ')[0]
                )
              "
              >编辑</el-dropdown-item
            >
            <el-dropdown-item
              v-if="historicalScheduling"
              icon="el-icon-view"
              @click.native="
                editSettingScheduling(
                  settingSchedulingsList[dateFormatter(value._d).split(' ')[0]],
                  dateFormatter(value._d).split(' ')[0]
                )
              "
              >查看</el-dropdown-item
            >
            <el-dropdown-item
              v-if="!historicalScheduling"
              icon="el-icon-circle-plus"
              @click.native="
                deleteSettingScheduling(
                  settingSchedulingsList[
                    dateFormatter(value._d).split(' ')[0]
                  ].map(function (elem) {
                    return elem.id;
                  })
                )
              "
              >删除</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <div
          v-for="(item, index) in settingSchedulingsList[
            dateFormatter(value._d).split(' ')[0]
          ]
            ? settingSchedulingsList[dateFormatter(value._d).split(' ')[0]]
            : []"
          :key="index"
          style="margin: 0.5vh 0px"
        >
          <div
            v-if="
              item.contactorList.filter(function (elem) {
                return elem.isLeader != 1;
              }).length != 0
            "
          >
            <!--<span :style="{padding: '0vw 0.2vw',display:'inline-block',border:'1px solid rgba(219,227,233,1)',color:item.endTime.split(' ')[1].substr(0,2)<=12?'rgba(0,145,255,1)':( (item.endTime.split(' ')[1].substr(0,2)>12 && item.endTime.split(' ')[1].substr(0,2)<=18)?'rgba(11,210,149,1)':'rgba(242,182,38,1)' )}">{{ item.endTime.split(' ')[1].substr(0,2)&lt;=12?'早':( (item.endTime.split(' ')[1].substr(0,2)>12 && item.endTime.split(' ')[1].substr(0,2)&lt;=18)?'午':'晚' ) }}</span>-->
            <!--
              @author tanjinfeng
              @date 2020-11-27
              @description 颜色样式修改
            -->
            <!-- *** 原来的代码 *** -->
            <!-- <span
              :style="{
                padding: '0vw 0.2vw',
                display: 'inline-block',
                border: '1px solid rgba(219,227,233,1)',
                color:
                  item.endTime.split(' ')[1].substr(0, 2) <= 12
                    ? 'rgba(0,145,255,1)'
                    : item.endTime.split(' ')[1].substr(0, 2) > 12 &&
                      item.endTime.split(' ')[1].substr(0, 2) <= 18
                    ? 'rgba(11,210,149,1)'
                    : 'rgba(242,182,38,1)'
              }"
              >{{ item.name.slice(0, 1) }}</span
            > -->
            <!-- *** 修改后的代码 *** -->
            <span
              :style="{
                padding: '0vw 0.2vw',
                display: 'inline-block',
                border: '1px solid rgba(219,227,233,1)',
                color: item.icon,
              }"
            >
              {{ item.name.slice(0, 1) }}
            </span>
            <!-- *** 结束 *** -->

            <div
              v-for="(contactorItem, contactorIndex) in item.contactorList"
              :key="contactorIndex"
              style="display: inline-block"
            >
              <div v-if="contactorItem.isLeader != 1">
                {{ (contactorIndex != 0 ? "、" : "") + contactorItem.manName }}
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="
            (settingSchedulingsList[dateFormatter(value._d).split(' ')[0]]
              ? settingSchedulingsList[dateFormatter(value._d).split(' ')[0]]
              : []
            ).length == 0 &&
            calendarHoverIndex == dateFormatter(value._d).split(' ')[0]
            && new Date(calendarHoverIndex) >= new Date(dateToday)
          "
          @click="addSettingScheduling(dateFormatter(value._d).split(' ')[0])"
          :style="{
            padding: '0.4vh 0px 0.4vh 0.5vw',
            width: '100%',
            background: 'rgba(0,145,255,1)',
            'font-size': '16px',
            'font-family': 'PingFangSC-Semibold,PingFang SC',
            'font-weight': '600',
            color: 'rgba(255,255,255,1)',
          }"
        >
          新增值班
        </div>
      </div>
    </calendar>
    <settingSchedulingDialog
      v-if="settingSchedulingDialogVisible"
      ref="settingSchedulingDialog"
      @getSettingScheduling="getSettingScheduling"
      :historicalScheduling="historicalScheduling"
    ></settingSchedulingDialog>
    <scheduleStatisticsDialog
      v-if="scheduleStatisticsDialogVisible"
      ref="scheduleStatisticsDialog"
    ></scheduleStatisticsDialog>
  </div>
</template>

<script>
import calendar from "../../../../../../assets/components/calendar";
import getLunarDay from "../../../../../../utils/getLunarDay";
import settingSchedulingDialog from "../settingSchedulingDialog";
import scheduleStatisticsDialog from "../scheduleStatisticsDialog";

import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import $ from "jquery";
import Cookies from "js-cookie";
import moment from "moment";
import qs from "qs";
moment.locale("zh-cn");

export default {
  name: "fullcalendar_page",
  components: {
    calendar,
    settingSchedulingDialog,
    scheduleStatisticsDialog,
  },
  getLunarDay,
  data() {
    return {
      // 开关按钮
      switchStatus: false,
      fileList: [], //上传的文件列表
      settingSchedulingsList: {},
      settingSchedulingDialogVisible: false,
      scheduleStatisticsDialogVisible: false,
      calendarHoverIndex: -1,
      calendarTitle:
        new Date().getFullYear() +
        "年" +
        (String(new Date().getMonth() + 1).length == 1
          ? 0 + String(new Date().getMonth() + 1)
          : String(new Date().getMonth() + 1)) +
        "月" +
        (String(new Date().getDate()).length == 1
          ? 0 + String(new Date().getDate())
          : String(new Date().getDate())) +
        "日" +
        " " +
        "星期" +
        (new Date().getDay() == 0
          ? "日"
          : new Date().getDay() == 1
          ? "一"
          : new Date().getDay() == 2
          ? "二"
          : new Date().getDay() == 3
          ? "三"
          : new Date().getDay() == 4
          ? "四"
          : new Date().getDay() == 5
          ? "五"
          : new Date().getDay() == 6
          ? "六"
          : ""),
      calendarSubtitle: this.$options.getLunarDay(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate()
      ),
      temporaryDate: this.dateFormatter(new Date()).split(" ")[0],
      locale: zhCN,
      $window: {},
      checkedAcceptTime: "", //选中接收到的时间
      historicalScheduling: false, //是否为历史排班
      // 今天的日期 yyyy-M-d
      dateToday: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
    };
  },
  beforeCreate() {
    this.$nextTick(function () {
      setTimeout(() => {
        console.log("this.temporaryDate", this.temporaryDate);
        this.getSettingScheduling();
      }, 500);
    });
  },
  created() {
    this.$window = window;
    this.$window.Cookies = Cookies.get("token");
  },
  mounted() {
    // 获取开关状态
    this.getSwitchStatus();
  },
  watch: {
    settingSchedulingsList(newValue, oldValue) {
      console.log(
        "settingSchedulingsList变了",
        this.settingSchedulingsList,
        this.temporaryDate
      );
      setTimeout(() => {
        var dayCount = this.getFullDayCount(
          this.temporaryDate.substr(0, 7).split("-")[0],
          this.temporaryDate.substr(0, 7).split("-")[1]
        );
        var dateArray = this.temporaryDate.split("-");
        /**
         * @author tanjinfeng
         * @date 2020-11-09
         * @desc 修复bug
         */
        // *****原来的代码
        // for (var i = 1; i <= dayCount; i++) {
        //   if (
        //     $(
        //       `td[title=${dateArray[0] +
        //         "年" +
        //         (dateArray[1].length == 2
        //           ? Number(dateArray[1].substr(1)) - 1
        //           : Number(dateArray[1]) - 1) +
        //         "月" +
        //         i +
        //         "日"}] .ant-fullcalendar-value .leader`
        //     )
        //   ) {
        //     $(
        //       `td[title=${dateArray[0] +
        //         "年" +
        //         (dateArray[1].length == 2
        //           ? Number(dateArray[1].substr(1)) - 1
        //           : Number(dateArray[1]) - 1) +
        //         "月" +
        //         i +
        //         "日"}] .ant-fullcalendar-value .leader`
        //     ).remove();
        //   }
        //   if (
        //     $(
        //       `td[title=${dateArray[0] +
        //         "年" +
        //         (dateArray[1].length == 2
        //           ? Number(dateArray[1].substr(1)) + 1
        //           : Number(dateArray[1]) + 1) +
        //         "月" +
        //         i +
        //         "日"}] .ant-fullcalendar-value .leader`
        //     )
        //   ) {
        //     $(
        //       `td[title=${dateArray[0] +
        //         "年" +
        //         (dateArray[1].length == 2
        //           ? Number(dateArray[1].substr(1)) + 1
        //           : Number(dateArray[1]) + 1) +
        //         "月" +
        //         i +
        //         "日"}] .ant-fullcalendar-value .leader`
        //     ).remove();
        //   }

        //   console.log(
        //     "settingSchedulingsList变了",
        //     $(
        //       `td[title=${dateArray[0] +
        //         "年" +
        //         (dateArray[1].length == 2
        //           ? dateArray[1].substr(1)
        //           : dateArray[1]) +
        //         "月" +
        //         i +
        //         "日"}] .ant-fullcalendar-value`
        //     ),
        //     dayCount,
        //     i
        //   );
        //   $(
        //     `td[title=${dateArray[0] +
        //       "年" +
        //       (dateArray[1].length == 2
        //         ? dateArray[1].substr(1)
        //         : dateArray[1]) +
        //       "月" +
        //       i +
        //       "日"}] .ant-fullcalendar-value .leader`
        //   ).remove();
        //   $(
        //     `td[title=${dateArray[0] +
        //       "年" +
        //       (dateArray[1].length == 2
        //         ? dateArray[1].substr(1)
        //         : dateArray[1]) +
        //       "月" +
        //       i +
        //       "日"}] .ant-fullcalendar-value`
        //   ).attr("style", "position: relative;white-space: nowrap;");
        //   var temporaryLeaderList = this.settingSchedulingsList[
        //     this.temporaryDate.substr(0, 7) +
        //       "-" +
        //       (String(i).length == 1 ? 0 + String(i) : i)
        //   ][0];
        //   $(
        //     `td[title=${dateArray[0] +
        //       "年" +
        //       (dateArray[1].length == 2
        //         ? dateArray[1].substr(1)
        //         : dateArray[1]) +
        //       "月" +
        //       i +
        //       "日"}] .ant-fullcalendar-value`
        //   ).append(`
        //     <div class='leader' style='display:${
        //       this.settingSchedulingsList[
        //         this.temporaryDate.substr(0, 7) +
        //           "-" +
        //           (String(i).length == 1 ? 0 + String(i) : i)
        //       ][0]
        //         ? "inline-block;"
        //         : "none;"
        //     }position: absolute;left: 54%;top: 50%;transform: translateY(-50%);'>
        //       <img src='${require("../../../../../../assets/img/administrators.png")}' style="width: 0.8vw;height: 0.8vw;margin-top: -4%;">
        //       <span>${
        //         temporaryLeaderList
        //           ? temporaryLeaderList.contactorList.filter(function(elem) {
        //               return elem.isLeader == 1;
        //             })[0]
        //             ? temporaryLeaderList.contactorList.filter(function(elem) {
        //                 return elem.isLeader == 1;
        //               })[0].manName
        //             : ""
        //           : ""
        //       }</span>
        //     </div>
        //   `);
        // }
        // *****修改的代码
        const lastYM =
          Number(dateArray[0]) == 1
            ? `${Number(dateArray[0]) - 1}年12月`
            : `${Number(dateArray[0])}年${Number(dateArray[1] - 1)}月`;
        const nowYM = `${Number(dateArray[0])}年${Number(dateArray[1])}月`;
        const nextYM =
          Number(dateArray[0]) == 12
            ? `${Number(dateArray[0]) + 1}年1月`
            : `${Number(dateArray[0])}年${Number(dateArray[1] + 1)}月`;
        for (var i = 1; i <= dayCount; i++) {
          // 清空上个月、下个月、本月数据
          if (
            $(`td[title=${lastYM + i + "日"}] .ant-fullcalendar-value .leader`)
          ) {
            $(
              `td[title=${lastYM + i + "日"}] .ant-fullcalendar-value .leader`
            ).remove();
          }
          if (
            $(`td[title=${nextYM + i + "日"}] .ant-fullcalendar-value .leader`)
          ) {
            $(
              `td[title=${nextYM + i + "日"}] .ant-fullcalendar-value .leader`
            ).remove();
          }
          $(
            `td[title=${nowYM + i + "日"}] .ant-fullcalendar-value .leader`
          ).remove();
          // 渲染新数据
          $(`td[title=${nowYM + i + "日"}] .ant-fullcalendar-value`).attr(
            "style",
            "position: relative;white-space: nowrap;"
          );
          var temporaryLeaderList = this.settingSchedulingsList[
            this.temporaryDate.substr(0, 7) +
              "-" +
              (String(i).length == 1 ? 0 + String(i) : i)
          ][0];
          $(`td[title=${nowYM + i + "日"}] .ant-fullcalendar-value`).append(`
            <div class='leader' style='display:${
              this.settingSchedulingsList[
                this.temporaryDate.substr(0, 7) +
                  "-" +
                  (String(i).length == 1 ? 0 + String(i) : i)
              ][0]
                ? "inline-block;"
                : "none;"
            }position: absolute;left: 54%;top: 50%;transform: translateY(-50%);'>
              <img src='${require("../../../../../../assets/img/administrators.png")}' style="width: 0.8vw;height: 0.8vw;margin-top: -4%;">
              <span>${
                temporaryLeaderList
                  ? temporaryLeaderList.contactorList.filter(function (elem) {
                      return elem.isLeader == 1;
                    })[0]
                    ? temporaryLeaderList.contactorList.filter(function (elem) {
                        return elem.isLeader == 1;
                      })[0].manName
                    : ""
                  : ""
              }</span>
            </div>
          `);
        }
        // *****结束
      }, 500);
    },
  },
  computed: {},
  methods: {
    /**
     * @description: 获取开关状态
     */
    getSwitchStatus(){
      this.$http({
        url: this.$http.adornUrl('/duty/dutyPlatform/getOne'),
        method: 'post',
      }).then((response) => {
        if(response.data && response.data.code === 0){
          if(response.data.dutyPlatformEntity === null){
            this.switchStatus = false;
          }
          else if(response.data.dutyPlatformEntity && response.data.dutyPlatformEntity.flag === 1){
            this.switchStatus = false;
          }
          else if(response.data.dutyPlatformEntity && response.data.dutyPlatformEntity.flag === 0){
            this.switchStatus = true;
          }
        }else{
            this.$message.error('服务器异常，获取开关状态失败');
        }
      })
    },
    /**
     * @description: 更改开关状态
     * @param {Boolean} newValue 新状态的值
     */
    changeSwitchStatus(newValue){
      let msg = newValue?'已开启提醒':'已关闭提醒';
      this.$http({
        url: this.$http.adornUrl('/duty/dutyPlatform/save'),
        method: 'post',
        data: this.$http.adornData({
          flag: newValue? 0 : 1,
        })
      }).then((response) => {
        if(response.data && response.data.code === 0){
          this.$message({
            message: `${msg}`,
            type: 'success',
          });
        }
        else{
          // 开关状态更改失败，恢复为原来的状态值
          this.switchStatus = !this.switchStatus;
          this.$message.error('服务器异常，更改开关状态失败');
        }
      })
    },
    exportTemplate() {
      //导出模板
      //  this.$http({
      //       url: this.$http.adornUrl(
      //         `/duty/shift/gettemplate`
      //       ),
      //       method: 'get',
      //       params: this.$http.adornParams()
      //     }).then(({data}) => {
      //       console.log('导出模板返回的数据为',data)
      //     })
      window.open(
        `${
          window.SITE_CONFIG["baseUrl"]
        }/duty/shift/gettemplate?token=${Cookies.get("token")}`
      );
    },
    // importData(file,filelist) { //导入数据
    //   console.log('上传成功后的数据为',file,filelist)
    //   var formData = new FormData()
    //   formData.append("file",file.raw)
    //   let fileobj = file.raw
    //   console.log('raw',file.raw)
    // if(file) {
    //   this.$http({
    //         url: this.$http.adornUrl(
    //           `/duty/shift/dutyImput`
    //         ),
    //         headers: {
    //       "content-type": "multipart/form-data"
    //     },
    //         method: 'post',
    //         data: formData
    //       }).then(({data}) => {
    //         console.log('后端返回的数据为',data)
    //         if(data && data.code === 0) {
    //           this.$message({
    //          message: '导入数据成功',
    //          type: 'success'
    //          });
    //           this.$emit('refreshCalendarData')
    //         }else {
    //           this.$message.error('导入数据失败请重试')
    //         }
    //       })
    // }

    // },
    // 自定义文件上传行为
    uploadSectionFile(param) {
      let form = new FormData();
      form.append("file", param.file);
      this.$http({
        url: this.$http.adornUrl(`/duty/shift/dutyImput`),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: form,
      })
        .then(({ data }) => {
          if (!data.code && data.errorData.length == 0) {
            this.$message({
              message: `${data.msg}`,
              type: "success",
            });
            this.dataForm.enclosure = data.filePath;
            this.dataForm.fileName = data.fileName;
            // 上传成功重新请求数据渲染页面
            this.$emit("refreshCalendarData");
          } else if (!data.code && data.errorData.length != 0) {
            // this.$message.error(`${data.msg}`);
            let str = document.createElement("div");
            data.errorData.forEach((item) => {
              let cdiv = document.createElement("div");
              cdiv.innerHTML = item.errorMsg;
              cdiv.style.marginTop = "10px";
              str.appendChild(cdiv);
            });
            this.$message({
              dangerouslyUseHTMLString: true,
              message: `<div>${data.msg}</div>${str.innerHTML}`,
              type: "error",
            });
          } else {
            this.$message.error("导入失败,请检查文件格式");
          }
        })
        .catch((err) => {
          // alert(err)
        });
    },

    // 导出数据
    exportData() {
      this.$http({
        url: this.$http.adornUrl("/duty/shift/export"),
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },

        data: this.$http.adornData(
          {
            type: "month",
            date: this.temporaryDate,
          },
          true,
          "application/x-www-form-urlencoded"
        ),
        responseType: "blob",
      }).then(({ data }) => {
        // console.log("/duty/shift/list", data);
        console.log(data);
        if (data) {
          const content = data;
          const blob = new Blob([content], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          const newDate = moment(this.temporaryDate).format('YYYY-MM');
          const fileName = `${newDate}月值班编排`;
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = URL.createObjectURL(blob);
            document.body.appendChild(elink);
            elink.click();
            URL.revokeObjectURL(elink.href); // 释放URL 对象
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(blob, fileName);
          }
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });
    },
    getFullDayCount(year, month) {
      var dayCount;
      var temporaryDate = new Date(year, month, 0);
      dayCount = temporaryDate.getDate();
      return dayCount;
    },
    getSettingScheduling() {
      this.$http({
        url: this.$http.adornUrl("/duty/shift/list"),
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: this.$http.adornData(
          {
            type: "month",
            date: this.temporaryDate,
          },
          true,
          "application/x-www-form-urlencoded"
        ),
      }).then(({ data }) => {
        console.log("/duty/shift/list", data);
        if (data && data.code === 0) {
          this.settingSchedulingsList = {};
          var temporaryPromise = new Promise((resolve, reject) => {
            var dayCount = this.getFullDayCount(
              this.temporaryDate.substr(0, 7).split("-")[0],
              this.temporaryDate.substr(0, 7).split("-")[1]
            );
            console.log("this.temporaryDate", this.temporaryDate);
            for (var i = 1; i <= dayCount; i++) {
              this.$set(
                this.settingSchedulingsList,
                this.temporaryDate.substr(0, 7) +
                  "-" +
                  (String(i).length == 1 ? 0 + String(i) : i),
                []
              );
            }
            console.log(
              "this.settingSchedulingsList",
              this.settingSchedulingsList
            );
            setTimeout(() => {
              resolve();
            }, dayCount * 15);
          });

          temporaryPromise.then((result) => {
            data.data.forEach((item) => {
              if (item.contactorList && item.contactorList.length != 0) {
                this.settingSchedulingsList[item.date.split(" ")[0]].push(item);
              }
            });
          });
          console.log("1111111111111", this.settingSchedulingsList);
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });
    },
    getScheduleStatistics() {
      this.scheduleStatisticsDialogVisible = true;

      setTimeout(() => {
        this.$refs.scheduleStatisticsDialog.dialogVisible = true;
      });
    },
    addSettingScheduling(date) {
      this.settingSchedulingDialogVisible = true;

      setTimeout(() => {
        (this.$refs.settingSchedulingDialog.dialogVisible = true),
          (this.$refs.settingSchedulingDialog.dataForm.date = date);
      });
    },
    editSettingScheduling(item, date) {
      this.settingSchedulingDialogVisible = true;

      setTimeout(() => {
        (this.$refs.settingSchedulingDialog.dialogVisible = true),
          (this.$refs.settingSchedulingDialog.dataForm.date = date);
        this.$refs.settingSchedulingDialog.init(item);
      });
    },
    deleteSettingScheduling(ids) {
      var that = this;
      this.$confirm("确定是否删除该值班排班?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/duty/shift/delete"),
            method: "post",

            data: JSON.stringify(ids), //that.$http.adornData({ids:ids},false,'json')
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "删除成功!",
                type: "success",
              });
              this.getSettingScheduling();
            } else {
              this.$message({
                message: `${data.msg}`,
                type: "error",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    today() {
      this.$refs.calendar.setState({
        sValue: moment(
          new Date().getFullYear() +
            "-" +
            (new Date().getMonth() + 1) +
            "-" +
            new Date().getDate()
        ),
      });
      (this.calendarTitle =
        new Date().getFullYear() +
        "年" +
        (String(new Date().getMonth() + 1).length == 1
          ? 0 + String(new Date().getMonth() + 1)
          : String(new Date().getMonth() + 1)) +
        "月" +
        (String(new Date().getDate()).length == 1
          ? 0 + String(new Date().getDate())
          : String(new Date().getDate())) +
        "日" +
        " " +
        "星期" +
        (new Date().getDay() == 0
          ? "日"
          : new Date().getDay() == 1
          ? "一"
          : new Date().getDay() == 2
          ? "二"
          : new Date().getDay() == 3
          ? "三"
          : new Date().getDay() == 4
          ? "四"
          : new Date().getDay() == 5
          ? "五"
          : new Date().getDay() == 6
          ? "六"
          : "")),
        (this.calendarSubtitle = this.$options.getLunarDay(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          new Date().getDate()
        ));
      this.temporaryDate =
        new Date().getFullYear() +
        "-" +
        (String(new Date().getMonth() + 1).length == 1
          ? 0 + String(new Date().getMonth() + 1)
          : String(new Date().getMonth() + 1)) +
        "-" +
        (String(new Date().getDate()).length == 1
          ? 0 + String(new Date().getDate())
          : String(new Date().getDate()));
      console.log("today", this.temporaryDate);
      this.getSettingScheduling();
    },
    previousMonth() {
      var temporaryMonth;
      this.temporaryDate = this.temporaryDate.split("-");
      if (Number(this.temporaryDate[1]) == 1) {
        this.temporaryDate[0] = String(Number(this.temporaryDate[0]) - 1);
        temporaryMonth = String(12);
      } else {
        temporaryMonth =
          String(Number(this.temporaryDate[1]) - 1).length == 1
            ? 0 + String(Number(this.temporaryDate[1]) - 1)
            : String(Number(this.temporaryDate[1]) - 1);
      }
      this.temporaryDate[1] = temporaryMonth;
      this.temporaryDate[2] = '01';

      this.calendarTitle =
        this.temporaryDate[0] +
        "年" +
        this.temporaryDate[1] +
        "月" +
        this.temporaryDate[2] +
        "日" +
        " " +
        "星期" +
        (new Date(this.temporaryDate.join("-")).getDay() == 0
          ? "日"
          : new Date(this.temporaryDate.join("-")).getDay() == 1
          ? "一"
          : new Date(this.temporaryDate.join("-")).getDay() == 2
          ? "二"
          : new Date(this.temporaryDate.join("-")).getDay() == 3
          ? "三"
          : new Date(this.temporaryDate.join("-")).getDay() == 4
          ? "四"
          : new Date(this.temporaryDate.join("-")).getDay() == 5
          ? "五"
          : new Date(this.temporaryDate.join("-")).getDay() == 6
          ? "六"
          : "");
      this.calendarSubtitle = this.$options.getLunarDay(
        this.temporaryDate[0],
        this.temporaryDate[1],
        this.temporaryDate[2]
      );

      this.temporaryDate = this.temporaryDate.join("-");
      this.$refs.calendar.setState({ sValue: moment(this.temporaryDate) });
      this.getSettingScheduling();
    },
    nextMonth() {
      var temporaryMonth;
      this.temporaryDate = this.temporaryDate.split("-");
      if (Number(this.temporaryDate[1]) == 12) {
        this.temporaryDate[0] = String(Number(this.temporaryDate[0]) + 1);
        temporaryMonth = "01";
      } else {
        temporaryMonth =
          String(Number(this.temporaryDate[1]) + 1).length == 1
            ? 0 + String(Number(this.temporaryDate[1]) + 1)
            : String(Number(this.temporaryDate[1]) + 1);
      }
      this.temporaryDate[1] = temporaryMonth;
      this.temporaryDate[2] = '01';

      this.calendarTitle =
        this.temporaryDate[0] +
        "年" +
        this.temporaryDate[1] +
        "月" +
        this.temporaryDate[2] +
        "日" +
        " " +
        "星期" +
        (new Date(this.temporaryDate.join("-")).getDay() == 0
          ? "日"
          : new Date(this.temporaryDate.join("-")).getDay() == 1
          ? "一"
          : new Date(this.temporaryDate.join("-")).getDay() == 2
          ? "二"
          : new Date(this.temporaryDate.join("-")).getDay() == 3
          ? "三"
          : new Date(this.temporaryDate.join("-")).getDay() == 4
          ? "四"
          : new Date(this.temporaryDate.join("-")).getDay() == 5
          ? "五"
          : new Date(this.temporaryDate.join("-")).getDay() == 6
          ? "六"
          : "");
      this.calendarSubtitle = this.$options.getLunarDay(
        this.temporaryDate[0],
        this.temporaryDate[1],
        this.temporaryDate[2]
      );

      this.temporaryDate = this.temporaryDate.join("-");
      this.$refs.calendar.setState({ sValue: moment(this.temporaryDate) });
      this.getSettingScheduling();
    },
    onChange(date) {
      console.log(
        "date,this.temporaryDate",
        date,
        this.temporaryDate,
        this.dateFormatter(date._d).split(" ")[0]
      );
      this.checkedAcceptTime = this.dateFormatter(date._d).split(" ")[0];
      this.compareTime(this.checkedAcceptTime);
      if (
        this.dateFormatter(date._d).split(" ")[0].split("-")[1] !=
        this.temporaryDate.split("-")[1]
      ) {
        (this.calendarTitle =
          date._d.getFullYear() +
          "年" +
          (date._d.getMonth() + 1) +
          "月" +
          date._d.getDate() +
          "日" +
          " " +
          "星期" +
          (date._d.getDay() == 0
            ? "日"
            : date._d.getDay() == 1
            ? "一"
            : date._d.getDay() == 2
            ? "二"
            : date._d.getDay() == 3
            ? "三"
            : date._d.getDay() == 4
            ? "四"
            : date._d.getDay() == 5
            ? "五"
            : date._d.getDay() == 6
            ? "六"
            : "")),
          (this.calendarSubtitle = this.$options.getLunarDay(
            date._d.getFullYear(),
            date._d.getMonth() + 1,
            date._d.getDate()
          ));
        this.temporaryDate =
          this.dateFormatter(date._d).split(" ")[0].substr(0, 8) +
          this.temporaryDate.split("-")[2];

        this.getSettingScheduling();
      }
    },
    downloadExcelOutput() {},
    //格式化起始时间结束时间
    dateFormatter(str) {
      //默认返回yyyy-MM-dd HH-mm-ss
      var hasTime = arguments[1] != false ? true : false; //可传第二个参数false，返回yyyy-MM-dd
      var d = new Date(str);
      var year = d.getFullYear();
      var month =
        d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
      var day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
      var hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
      var minute = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
      var second = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
      if (hasTime) {
        return (
          [year, month, day].join("-") + " " + [hour, minute, second].join(":")
        );
      } else {
        return [year, month, day].join("-");
      }
    },
    /**
     * @description: 比较时间
     * @param {}
     * @return {}
     */
    compareTime(clickTime) {
      let checkTime = new Date(clickTime).getTime(); //获取被选中的日期的时间戳
      let currentDate = this.dateFormatter(new Date(), false); //获取当前日期
      let currentTime = new Date(currentDate).getTime(); //获取当前日期的时间戳
      console.log("当前时间", currentDate, checkTime, currentTime);
      if (currentTime > checkTime) {
        // 当前日期时间戳大于被选中日期的时间戳，为历史排班
        this.historicalScheduling = true;
      } else {
        // 当前日期时间戳小于或等于被选中日期的时间戳，为当前或未来排班
        this.historicalScheduling = false;
      }
    },
  },
};
</script>

<style lang="less">
// you must include each plugins' css
// paths prefixed with ~ signify node_modules
@import "./coreMain.css";
@import "./daygridMain.css";
@import "./timegridMain.css";

.demo-app-fullcalendar {
  .el-upload-list {
    display: none;
  }
  th {
    border: 2px solid rgba(240, 240, 240, 1);
  }
  td {
    border: 2px solid rgba(240, 240, 240, 1);
  }
  /deep/ .el-switch{
    margin: 0 50px;
  }
  .ant-fullcalendar-fullscreen {
    .ant-fullcalendar-header {
      display: none;
    }
    .ant-fullcalendar-month {
      border-top: initial;
    }
    .ant-fullcalendar-column-header .ant-fullcalendar-column-header-inner {
      font-size: 17px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }
    .ant-fullcalendar-column-header {
      height: 5vh;
      text-align: center;
      line-height: 5vh;
      padding: 0px;
    }
    .ant-fullcalendar-content {
      scrollbar-width: none;
      -ms-overflow-style: none;
      ul {
        list-style: none;
        padding: 0px;
      }
    }
    .ant-fullcalendar-content::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
    .Sunday,
    .Saturday {
      background: rgba(246, 247, 247, 1);
    }
    .ant-fullcalendar-last-month-cell,
    .ant-fullcalendar-next-month-btn-day,
    .passDate {
      .date {
        color: rgba(153, 153, 153, 1) !important;
      }
      .lunarDay {
        color: rgba(153, 153, 153, 1) !important;
      }
    }
    .ant-fullcalendar-date {
      border-top: initial;
      margin-left: 0px;
      margin-right: 0px;
      .ant-fullcalendar-value {
        text-align: initial;
        .date {
          font-size: 17px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: rgba(51, 51, 51, 1);
        }
        .lunarDay {
          font-size: 15px;
          font-family: PingFangSC-Light, PingFang SC;
          font-weight: 300;
          color: rgba(153, 153, 153, 1);
        }
      }
    }
  }

  .demo-app {
    font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
    font-size: 14px;
  }
  .demo-app-calendar {
    margin: 0 auto;
    max-width: 900px;
  }
  // .fc-ltr .fc-dayGrid-view .fc-day-top .fc-day-number{
  //   float:initial;
  //   margin-left: 70%;
  // }
  // .fc-bg tr td{
  //   overflow: auto;
  // }

  // .fc-bg{
  //   overflow-y: auto;
  //   height: 111px;
  // }

  // .fc-bg tr td:before
  // {
  //   content:"恭喜发财";
  //   opacity: 0;
  //   background-color:yellow;
  //   color:red;
  //   font-weight:bold;
  // }

  // .fc-bg::-webkit-scrollbar {display:none}
  // .fc-row.fc-week.fc-widget-content.fc-rigid{
  //   // border-left: 1px solid #ddd;
  //   // border-right: 1px solid #ddd;
  //   // border-bottom: 1px solid #ddd;
  //   // border: 0.1px solid transparent;
  //   border: 0px;
  // }

  // .fc-unthemed th, .fc-unthemed td, .fc-unthemed thead, .fc-unthemed tbody, .fc-unthemed .fc-divider, .fc-unthemed .fc-row, .fc-unthemed .fc-content, .fc-unthemed .fc-popover, .fc-unthemed .fc-list-view, .fc-unthemed .fc-list-heading td{
  //   // border: 1px;
  // }

  .fc-day.fc-widget-content {
    // overflow-y: auto!important;
    // height: 111px!important;
    // display: inline-block!important;
    // display: -webkit-box;
    // width: 133px!important;
    // box-sizing: border-box;
  }

  // .fc-bg{
  //   display: block!important;
  // }
  // .fc-bg table{
  //   display: block!important;
  // }
  // .fc-bg table tbody{
  //   display: block!important;
  // }
  // .fc-bg table tbody tr{
  //   display: block!important;
  // }
  // .fc-bg table tbody tr{
  //   display: block!important;
  // }

  .fc-day.fc-widget-content div::-webkit-scrollbar {
    display: none;
  }
  .el-table__row td {
    position: relative !important;
  }

  .el-table thead,
  .el-table {
    border-color: #bcbcbc;
  }
  .el-table__header-wrapper {
    // border-top: 1px solid #bcbcbc;
  }
  .el-table td,
  .el-table th.is-leaf,
  .el-table--border,
  .el-table--group {
    border-color: #bcbcbc;
  }
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    border-color: #bcbcbc;
  }
  .el-button--info {
    // background:red!important;
    color: initial;
    background: initial;
    border: initial;
  }
  .el-button--info {
    span {
      display: none;
    }
    i {
      font-size: 29px;
      color: #bcbcbc;
    }
  }
  .el-table__header-wrapper,
  .el-table__body-wrapper.is-scrolling-none {
    table {
      width: 100% !important;
    }
  }
}
</style>
