<template>
  <div
    style="width:100%;display:flex;justify-content: center;position:relative;min-width:1363px;margin:auto auto;"
    class="dutyScheduling"
  >
    <section
      id="left-content"
      :class="isHide?'leftContentIsHide':''"
      style="width:20vw;height:100%;display:inline-block;position:relative;left:0px;transition: 0.5s;"
    >
      <!-- <div style=" width:20vw;height:34vh;border: 1px solid #ebeef5;border-radius: 4px;box-shadow:0 2px 12px 0 rgba(0,0,0,.1); "> -->
      <!-- <calendar :fullscreen="false" @panelChange="onPanelChange" @select="selectCalendar" mode="year" style=" width:20vw;border: 1px solid #ebeef5;border-radius: 0.4vw;box-shadow:0 2px 12px 0 rgba(0,0,0,.1);background:white;"/> -->
      <!-- </div> -->
      <el-dialog
        title="我的日历"
        :visible.sync="calendarDialogVisible"
        width="30%"
        class="myCalendar"
        :before-close="()=>{calendarDialogVisible=false}"
      >
        <calendar
          :fullscreen="false"
          @panelChange="onPanelChange"
          @select="selectCalendar"
          mode="year"
          style=" width:20vw;border: 1px solid #ebeef5;border-radius: 0.4vw;box-shadow:0 2px 12px 0 rgba(0,0,0,.1);background:white;"
        />
      </el-dialog>

      <div
        style="width:20vw;background:rgba(255,255,255,1);box-shadow:0px 3px 10px 2px rgba(54,121,225,0.09);border-radius:0.4vw;padding-bottom: 3.55vh;max-height: 51.5vh;overflow-y: auto;"
      >
        <div style="width:100%;display: flex;align-items: center;padding: 1.3vh 0px;">
          <span
            style="background:rgba(0,145,255,1);width:0.14vw;height:1.7vh;display:inline-block;border-radius:3px;margin-left: 0.58vw;"
          ></span>
          <span
            style="font-size:17px;font-family:PingFangSC-Medium,PingFang SC;font-weight:600;color:rgba(51,51,51,1);margin-left: 0.58vw;"
          >班次管理</span>
          <div style="display:inline-block;margin-left: 9.4vw;">
            <i class="el-icon-plus" style="color:rgba(63,146,254,1);"></i>
            <span
              style="font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:600;color:rgba(63,146,254,1);"
              @click="addSchedule"
            >新增班次</span>
          </div>
        </div>

        <div style="width:100%;">
          <div style="display: flex;justify-content: center;align-items: center;">
            <img src="../../../../../assets/img/dailyScheduleTip.png" style="width:1vw;height:1vw;" />
            <span
              style="font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin-left: 1vh;"
            >日常值班</span>
          </div>
          <div style="text-align:center;width:100%;">
            <div v-if="dailySchedulesList.length!=0">
              <div
                v-for="(item,index) in dailySchedulesList"
                :key="index"
                :style="{width:'100%',display: 'flex','align-items': 'center',background:dailyHoverIndex==index?'rgba(239,240,241,1)':'initial',padding: '0.3vh 0px',margin: '1vh 0px',position: 'relative'}"
                @mouseover="dailyHoverIndex=index"
                @mouseout="dailyHoverIndex=-1"
              >
                <div
                  :style="{display:'inline-block',width:'1vw',height:'1vw',background:item.icon,'border-radius':'50%','margin-left': '1.1vw','text-align':'center','line-height':'1vw'}"
                  @click="item.showBoolean=!item.showBoolean"
                >
                  <i class="el-icon-check" style="color:white;" v-show="item.showBoolean"></i>
                </div>
                <span
                  style="font-size:16px;font-family:PingFangSC-Regular,PingFang SC;font-weight:600;color:rgba(51,51,51,1);margin-left: 0.43vw;"
                >{{item.name}}</span>
                <span
                  style="font-size:16px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin-left: 0.73vw;"
                >{{item.startTime.substr(0,5)+'-'+item.endTime.substr(0,5)}}</span>
                <el-dropdown
                  trigger="click"
                  style="position: absolute;right: 1.1vw;"
                  v-show="dailyHoverIndex==index"
                >
                  <span class="el-dropdown-link">
                    <i class="el-icon-more"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-plus" @click.native="editSchedules(item)">编辑</el-dropdown-item>
                    <el-dropdown-item
                      icon="el-icon-circle-plus"
                      @click.native="deleteSchedules(item.id)"
                    >删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>

            <div v-else>
              <div style="text-align:center;">
                <img
                  src="../../../../../assets/img/calendarNodatas.png"
                  style="width:7.3vw;height:7.3vw;"
                />
                <div
                  style="font-size:16px;font-family:PingFangSC-Medium,PingFang SC;font-weight:500;color:rgba(202,213,232,1);"
                >暂无班次</div>
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top: 2vh;">
          <div style="display: flex;justify-content: center;align-items: center;">
            <img
              src="../../../../../assets/img/holidayScheduleTip.png"
              style="width:1vw;height:1vw;"
            />
            <span
              style="font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin-left: 1vh;"
            >节假日值班</span>
          </div>

          <div v-if="holidaySchedulesList.length!=0">
            <div
              v-for="(item,index) in holidaySchedulesList"
              :key="index"
              :style="{width:'100%',display: 'flex','align-items': 'center',background:holidayHoverIndex==index?'rgba(239,240,241,1)':'initial',padding: '0.3vh 0px',margin: '1vh 0px',position: 'relative'}"
              @mouseover="holidayHoverIndex=index"
              @mouseout="holidayHoverIndex=-1"
            >
              <div
                :style="{display:'inline-block',width:'1vw',height:'1vw',background:item.icon,'border-radius':'50%','margin-left': '1.1vw','text-align':'center','line-height':'1vw'}"
                @click="item.showBoolean=!item.showBoolean"
              >
                <i class="el-icon-check" style="color:white;" v-show="item.showBoolean"></i>
              </div>
              <span
                style="font-size:16px;font-family:PingFangSC-Regular,PingFang SC;font-weight:600;color:rgba(51,51,51,1);margin-left: 0.43vw;"
              >{{item.name}}</span>
              <span
                style="font-size:16px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin-left: 0.73vw;"
              >{{item.startTime.substr(0,5)+'-'+item.endTime.substr(0,5)}}</span>
              <el-dropdown
                trigger="click"
                style="position: absolute;right: 1.1vw;"
                v-show="holidayHoverIndex==index"
              >
                <span class="el-dropdown-link">
                  <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-plus" @click.native="editSchedules(item)">编辑</el-dropdown-item>
                  <el-dropdown-item
                    icon="el-icon-circle-plus"
                    @click.native="deleteSchedules(item.id)"
                  >删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div v-else>
            <div style="text-align:center;">
              <img
                src="../../../../../assets/img/calendarNodatas.png"
                style="width:7.3vw;height:7.3vw;"
              />
              <div
                style="font-size:16px;font-family:PingFangSC-Medium,PingFang SC;font-weight:500;color:rgba(202,213,232,1);"
              >暂无班次</div>
            </div>
          </div>
        </div>
      </div>

      <div
        style="width:20vw;background:rgba(255,255,255,1);box-shadow:0px 3px 10px 2px rgba(54,121,225,0.09);border-radius:0.4vw;margin-top: 1.3vh;padding-bottom: 3.55vh;max-height: 51.5vh;overflow-y: auto;"
      >
        <div style="width:100%;display: flex;align-items: center;padding: 1.3vh 0px;">
          <span
            style="background:rgba(0,145,255,1);width:0.14vw;height:1.7vh;display:inline-block;border-radius:3px;margin-left: 0.58vw;"
          ></span>
          <span
            style="font-size:17px;font-family:PingFangSC-Medium,PingFang SC;font-weight:600;color:rgba(51,51,51,1);margin-left: 0.58vw;"
          >值班成员</span>

          <el-dropdown trigger="click" style="display:inline-block;margin-left: 9.4vw;">
            <span class="el-dropdown-link">
              <i class="el-icon-plus" style="color:rgba(63,146,254,1);"></i>
              <span
                style="font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:600;color:rgba(63,146,254,1);"
              >新增成员</span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-plus" @click.native="addMember(1)">值班领导</el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-plus" @click.native="addMember(0)">普通成员</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <div style="width:100%;">
          <div style="display: flex;justify-content: center;align-items: center;">
            <img src="../../../../../assets/img/leaderMember.png" style="width:1vw;height:1vw;" />
            <span
              style="font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin-left: 1vh;"
            >值班领导</span>
          </div>
          <div style="width:100%;display: flex;flex-wrap: wrap;justify-content: center;">
            <div
              v-if="leaderMembersList.length!=0"
              style="width:100%;display: flex;flex-wrap: wrap;"
            >
              <div
                v-for="(item,index) in leaderMembersList"
                :key="index"
                @mouseover="leaderHoverIndex=index"
                @mouseout="leaderHoverIndex=-1"
                :style="{width:'33.3%',display: 'flex','align-items': 'center','justify-content': 'center',margin: '1vh 0px',background: leaderHoverIndex==index?'rgba(244,250,255,1)':'initial','border-radius':leaderHoverIndex==index? '2vw':'initial',border: leaderHoverIndex==index?'1px solid rgba(180,228,255,1)':'initial',padding: '1vh 0px','box-sizing': 'border-box'}"
              >
                <div
                  style="display:inline-block;width:0.8vw;height:0.8vw;background:rgba(0,145,255,1);border-radius:50%;text-align: center;line-height:0.8vw;"
                  @click="item.showBoolean=!item.showBoolean"
                >
                  <i class="el-icon-check" style="color:white;" v-show="item.showBoolean"></i>
                </div>
                <span
                  style="font-size:14px;font-family:PingFangSC-Regular,PingFang SC;font-weight:600;color:rgba(51,51,51,1);margin-left: 0.3vw;line-height:1vw;"
                >{{item.name}}</span>
                <i
                  class="el-icon-error"
                  style="margin-left: 0.3vw;"
                  v-show="leaderHoverIndex==index"
                  @click="deleteMembers(item.id)"
                ></i>
              </div>
            </div>
            <div v-else>
              <div style="text-align:center;">
                <img
                  src="../../../../../assets/img/calendarNodatas.png"
                  style="width:7.3vw;height:7.3vw;"
                />
                <div
                  style="font-size:16px;font-family:PingFangSC-Medium,PingFang SC;font-weight:500;color:rgba(202,213,232,1);"
                >暂无值班成员</div>
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top:2vh;">
          <div style="display: flex;justify-content: center;align-items: center;">
            <img src="../../../../../assets/img/ordinaryMember.png" style="width:1vw;height:1vw;" />
            <span
              style="font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin-left: 1vh;"
            >普通成员</span>
          </div>
          <div style="width:100%;display: flex;flex-wrap: wrap;justify-content: center;">
            <div
              v-if="ordinaryMembersList.length!=0"
              style="width:100%;display: flex;flex-wrap: wrap;"
            >
              <div
                v-for="(item,index) in ordinaryMembersList"
                :key="index"
                @mouseover="ordinaryHoverIndex=index"
                @mouseout="ordinaryHoverIndex=-1"
                :style="{width:'33.3%',display: 'flex','align-items': 'center','justify-content': 'center',margin: '1vh 0px',background: ordinaryHoverIndex==index?'rgba(244,250,255,1)':'initial','border-radius':ordinaryHoverIndex==index? '2vw':'initial',border: ordinaryHoverIndex==index?'1px solid rgba(180,228,255,1)':'initial',padding: '1vh 0px','box-sizing': 'border-box'}"
              >
                <div
                  style="display:inline-block;width:0.8vw;height:0.8vw;background:rgba(0,145,255,1);border-radius:50%;text-align: center;line-height:0.8vw;"
                  @click="item.showBoolean=!item.showBoolean"
                >
                  <i class="el-icon-check" style="color:white;" v-show="item.showBoolean"></i>
                </div>
                <span
                  style="font-size:14px;font-family:PingFangSC-Regular,PingFang SC;font-weight:600;color:rgba(51,51,51,1);margin-left: 0.3vw;line-height:1vw;"
                >{{item.name}}</span>
                <i
                  class="el-icon-error"
                  style="margin-left: 0.3vw;"
                  v-show="ordinaryHoverIndex==index"
                  @click="deleteMembers(item.id)"
                ></i>
              </div>
            </div>
            <div v-else>
              <div style="text-align:center;">
                <img
                  src="../../../../../assets/img/calendarNodatas.png"
                  style="width:7.3vw;height:7.3vw;"
                />
                <div
                  style="font-size:16px;font-family:PingFangSC-Medium,PingFang SC;font-weight:500;color:rgba(202,213,232,1);"
                >暂无值班成员</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      id="right-content"
      :class="isHide?'rightContentIsHide':'rightContentIsNotHide'"
      style="min-width: 995px;width:80vw;height:initial!important;display:inline-block;display: flex;justify-content: center;background:white;transition: 0.5s;position:relative;border-radius: 0.4vw;"
    >
      <i
        @click="iconClick"
        class="iconfont icon-jiantou"
        :id="isHide?'iconIsHide':'iconIsNotHide'"
        style="color:#409EFF;font-size: 30px;position: absolute;height: 30px;width:30px;top:40vh;transition:left 0.5s;"
      ></i>

      <fullcalendar
        ref="fullcalendar"
        style="margin-top:20px;width:100%!important;"
        @openCalendar="calendarDialogVisible=true"
        @refreshCalendarData = "refreshCalendarData"
      ></fullcalendar>
    </section>

    <scheduleDialogAddOrUpdate
      v-if="scheduleDialogAddOrUpdateVisible"
      ref="scheduleDialogAddOrUpdate"
      @getSchedules="getSchedules"
    ></scheduleDialogAddOrUpdate>

    <linkmanDraggable ref="commonLink" v-show="showcommonLink" @getMembers="getMembers"></linkmanDraggable>
  </div>
</template>

<script>
import calendar from "ant-design-vue/lib/calendar";
import "ant-design-vue/dist/antd.css";
import scheduleDialogAddOrUpdate from "./scheduleDialogAddOrUpdate";
import fullcalendar from "./fullcalendar/fullcalendar";
import linkmanDraggable from "./dutyPeopleAddOrUpdate"; 
import $ from "jquery";
import moment from "moment";

// import DatePicker from 'vue-component'
export default {
  data() {
    return {
      calendarDialogVisible: false,
      dailySchedulesList: [],
      holidaySchedulesList: [],
      leaderMembersList: [],
      ordinaryMembersList: [],
      dailyHoverIndex: -1,
      holidayHoverIndex: -1,
      leaderHoverIndex: -1,
      ordinaryHoverIndex: -1,
      showcommonLink: false,
      scheduleDialogAddOrUpdateVisible: false,
      isHide: false
    };
  },
  components: {
    calendar,
    scheduleDialogAddOrUpdate,
    fullcalendar,
    linkmanDraggable
  },

  created() {},
  mounted() {
    this.getSchedules();
    this.getMembers();
    document.querySelectorAll(
      ".ant-radio-button-wrapper span:nth-child(2)"
    )[1].innerHTML = "日";
    document.querySelectorAll(
      ".ant-radio-button-wrapper span:nth-child(2)"
    )[3].innerHTML = "月";

    if (this.$route.path === "/sys/duty/dutyScheduling/dutyScheduling") {
      setTimeout(() => {
        document
          .querySelector(
            "div[aria-labelledby='tab-sys/duty/dutyScheduling/dutyScheduling'] .el-card__body"
          )
          .setAttribute("style", "padding: 0px 5px;margin-top: 10px;");
        document
          .querySelector(
            "div[aria-labelledby='tab-sys/duty/dutyScheduling/dutyScheduling'] .el-card.is-always-shadow"
          )
          .setAttribute(
            "style",
            "background: #f1f4f5!important;box-shadow: initial!important; webkit-box-shadow: initial!important;border: initial!important;overflow:initial!important;"
          );
      }, 1000);
    } else {
    }
  },
  beforeCreate() {},
  watch: {},
  methods: {
    refreshCalendarData() {//刷新日历数据
       this.getSchedules();
    },
    deleteSchedules(id) {
      this.$confirm("确认删除该值班吗？")
        .then(_ => {
          this.$http({
            url: this.$http.adornUrl("/duty/shift/setting/delete"),
            method: "post",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: this.$http.adornData(
              {
                id: id
              },
              true,
              "application/x-www-form-urlencoded"
            )
          }).then(({ data }) => {
            if (data && data.code === 0) {
              // 详细联系人列表
              // console.log("保存更新值班排班",data)
              this.$message({
                message: "删除成功!",
                type: "success"
              });
              this.getSchedules();
            } else {
              this.$message({
                message: `${data.msg}`,
                type: "error"
              });
            }
          });
        })
        .catch(_ => {});
    },
    deleteMembers(id) {
      this.$confirm("确认删除该值班成员吗？")
        .then(_ => {
          this.$http({
            url: this.$http.adornUrl("/duty/shift/contactor/setting/delete"),
            method: "post",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: this.$http.adornData(
              {
                id: id
              },
              true,
              "application/x-www-form-urlencoded"
            )
          }).then(({ data }) => {
            if (data && data.code === 0) {
              // 详细联系人列表
              // console.log("保存更新值班排班",data)
              this.$message({
                message: "删除成功!",
                type: "success"
              });
              this.getMembers();
            } else {
              this.$message({
                message: `${data.msg}`,
                type: "error"
              });
            }
          });
        })
        .catch(_ => {});
    },
    getMembers() {
      this.$http({
        url: this.$http.adornUrl("/duty/shift/contactor/setting/list"),
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: this.$http.adornData({})
      }).then(({ data }) => {
        console.log("/duty/shift/contactor/setting/list", data);
        if (data && data.code === 0) {
          this.leaderMembersList = [];
          this.ordinaryMembersList = [];
          data.data.forEach(element => {
            if (element.isLeader == 1) {
              element.showBoolean = true;
              this.leaderMembersList.push(element);
            } else {
              element.showBoolean = true;
              this.ordinaryMembersList.push(element);
            }
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error"
          });
        }
      });
    },
    getSchedules() {
      this.$http({
        url: this.$http.adornUrl("/duty/shift/setting/list"),
        method: "post",
        data: this.$http.adornData({})
      }).then(({ data }) => {
        console.log("/duty/shift/setting/list", data);
        if (data && data.code === 0) {
          this.dailySchedulesList = [];
          this.holidaySchedulesList = [];
          data.data.forEach(element => {
            if (element.isHoliday == 0) {
              element.showBoolean = true;
              this.dailySchedulesList.push(element);
            } else {
              element.showBoolean = true;
              this.holidaySchedulesList.push(element);
            }
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error"
          });
        }
      });
    },

    iconClick(e) {
      this.isHide = !this.isHide;
    },
    selectCalendar(temporaryMoment) {
      console.log("selectCalendar", temporaryMoment);
      if (
        temporaryMoment._d.getMonth() + 1 !=
        Number(this.$refs.fullcalendar.temporaryDate.split("-")[1])
      ) {
        console.log(
          "this.$refs.fullcalendar",
          this.$refs.fullcalendar,
          this.dateFormatter(temporaryMoment["_d"]).split(" ")[0]
        );
        this.$refs.fullcalendar.$refs.calendar.setState({
          sValue: moment(
            this.dateFormatter(temporaryMoment["_d"]).split(" ")[0]
          )
        });
        this.$refs.fullcalendar.temporaryDate = this.dateFormatter(
          temporaryMoment["_d"]
        ).split(" ")[0];
        this.$refs.fullcalendar.getSettingScheduling();
        var temporaryDate = this.dateFormatter(temporaryMoment["_d"])
          .split(" ")[0]
          .split("-");
        this.$refs.fullcalendar.calendarTitle =
          temporaryDate[0] +
          "年" +
          temporaryDate[1] +
          "月" +
          temporaryDate[2] +
          "日" +
          " " +
          "星期" +
          (new Date(temporaryDate.join("-")).getDay() == 0
            ? "日"
            : new Date(temporaryDate.join("-")).getDay() == 1
            ? "一"
            : new Date(temporaryDate.join("-")).getDay() == 2
            ? "二"
            : new Date(temporaryDate.join("-")).getDay() == 3
            ? "三"
            : new Date(temporaryDate.join("-")).getDay() == 4
            ? "四"
            : new Date(temporaryDate.join("-")).getDay() == 5
            ? "五"
            : new Date(temporaryDate.join("-")).getDay() == 6
            ? "六"
            : "");
        this.$refs.fullcalendar.calendarSubtitle = this.$refs.fullcalendar.$options.getLunarDay(
          temporaryDate[0],
          temporaryDate[1],
          temporaryDate[2]
        );
      }
      this.calendarDialogVisible = false;
    },

    addMember(isLeader) {
      this.showcommonLink = true;
      this.$refs.commonLink.dataForm.isLeader = isLeader;
      this.$refs.commonLink.handleAddContacts(
        "/mail/mailgroup/list",
        "请选择值班成员",
        "值班成员"
      );
    },
    addSchedule() {
      this.scheduleDialogAddOrUpdateVisible = true;

      setTimeout(() => {
        this.$refs.scheduleDialogAddOrUpdate.dialogVisible = true;
      });
    },
    editSchedules(item) {
      this.scheduleDialogAddOrUpdateVisible = true;

      setTimeout(() => {
        this.$refs.scheduleDialogAddOrUpdate.dialogVisible = true;
        this.$refs.scheduleDialogAddOrUpdate.init(item);
      });
    },
    onPanelChange(value, mode) {
      console.log("onPanelChange", value, mode);
    },
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
    }
  }
};
</script>
<style lang="less" >
.dutyScheduling {
  .myCalendar {
    .el-dialog {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      margin-top: initial !important;
    }
    .el-dialog__body {
      display: flex;
      justify-content: center;
      padding-bottom: 8vh;
    }
  }
  [role="gridcell"] {
    .ant-fullcalendar-value {
      font-family: PingFangSC-Medium, PingFang SC !important;
      font-weight: 800 !important;
      color: rgba(0, 0, 0, 0.65) !important;
    }
  }
  .left-bottom-content::-webkit-scrollbar {
    display: none;
  }

  #iconIsHide {
    left: -25px;

    transform: rotateY(180deg);
  }
  #iconIsNotHide {
    left: -25px;
  }
  .leftContentIsHide {
    left: -200px !important;
    width: 0% !important;
    overflow: hidden;
  }
  .rightContentIsNotHide {
    margin-left: 20px;
  }
  .rightContentIsHide {
    width: 100% !important;
    margin-left: 0px;
  }

  .el-radio__input.is-checked .el-radio__inner {
    border-color: #1890ff !important;
    background: #1890ff !important;
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: #1890ff !important;
  }
}
</style>
