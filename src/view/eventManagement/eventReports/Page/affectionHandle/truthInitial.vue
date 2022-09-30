<template>
  <div style="width: 100%; text-align: left; font-size: 12px">
    <div style="padding: 10px 0; display: flex; align-items: center">
      <div
        style="
          flex: 1;
          display: flex;
          justify-content: flex-start;
          align-items: center;
        "
      >
        <label style="display: inline-block; margin-right: 20px"
          >初判预案:</label
        >
        <el-select
          size="mini"
          v-model="initialPlan"
          placeholder="请选择"
          @change="cutPlan($event)"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div
        style="
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        "
      >
        <label style="display: inline-block; margin-right: 20px"
          >事件等级:</label
        >
        <el-select
          size="mini"
          v-model="Level"
          placeholder="请选择"
          @change="Steimlevel($event)"
        >
          <el-option
            v-for="item in LevelArr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div style="display: flex; align-items: center; padding: 15px 0">
      <div style="flex: 2">
        <label v-if="(cpShow = false)"
          >初判等级:<span style="margin-left: 30px">{{
            tentative
          }}</span></label
        >
        <el-radio-group v-model="elSwitchValue" @change="changeSwitch">
          <el-radio :label="1">预案等级分级标准</el-radio>
          <el-radio :label="2">事件等级分级标准</el-radio>
        </el-radio-group>

        <!--          <el-switch-->
        <!--            v-model="elSwitchValue"-->
        <!--            @change="watchData"-->
        <!--            active-color="#13ce66"-->
        <!--            active-text="事件等级分级标准"-->
        <!--            inactive-text="预案等级分级标准"-->
        <!--            inactive-color="#ff4949">-->
        <!--          </el-switch>-->
      </div>

      <div style="flex: 2; display: flex; justify-content: flex-end">
        <!--          <ul id="planBackg">-->
        <!--            <li  v-for="(list,index) in plan" :key="index"  >-->
        <!--              <span class="spanStrat" :style="{'backgroundColor':list.styleObj}"></span>-->
        <!--              <span class="spanEnd">{{list.name}}</span>-->
        <!--            </li>-->
        <!--          </ul>-->
      </div>
    </div>
    <div>
      <div style="position: relative">
        <!--          <div  id="xiesi" @click="missPlan" >-->
        <!--            <div>-->
        <!--              <div :class="{red:changeRed == -1}" class="planRelative">-->
        <!--                <span class="titlePlan" style="color: white;background-color: #6B7280">未达级别</span>-->
        <!--                <span class="contentPlan"></span>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </div>-->
        <div v-for="(list, index) in plan" :key="index" class="planStyle">
          <div
            id="aLink"
            class="planRelative"
            :class="{ red: changeRed == index }"
            @click="setClick(list, index)"
          >
            <div class="titlePlan" style="position: relative">
              <div
                style="
                  width: 65px;
                  height: 65px;
                  position: absolute;
                  z-index: 999;
                  border-radius: 50%;
                  justify-content: center;

                  align-items: center;
                  opacity: 0.5;
                  z-index: 1;
                "
                :style="{ backgroundColor: list.styleObj }"
              ></div>
              <div
                style="
                  width: 55px;
                  height: 55px;
                  margin: 5px auto;
                  text-align: center;
                  line-height: 55px;
                  border-radius: 50%;
                  position: absolute;
                  z-index: 2;
                  top: 2px;
                "
                :style="{ backgroundColor: list.styleObj }"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="list.name"
                  placement="left"
                >
                  <span
                    style="
                      display: block;
                      width: 100%;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    "
                  >
                    {{ list.name }}
                  </span>
                </el-tooltip>
              </div>
            </div>
            <div class="contentPlan">{{ list.remark }}</div>
          </div>
        </div>
      </div>
    </div>

    <div
      style="
        padding: 10px 5px;
        font-size: 14px;
        background-color: #f9fbff;
        text-indent: 20px;
      "
      v-if="decision"
    >
      <div>智能初判的结果为:</div>
      <div>
        经初步研判,该事件判定为【{{ decisionPlan }}】 /【{{
          decisionEvent
        }}】事件,建议启动【{{ decisionRank }}】/【{{ decisionLevel }}】预案
      </div>
    </div>

    <div class="missVerdict">
      <div class="missLeft">初判结论:</div>
      <div class="missRight" style="position: relative">
        <el-input type="textarea" placeholder="请输入内容" v-model="textarea">
        </el-input>
        <span
          style="padding: 5px 15px; position: absolute; right: 0; bottom: 25px"
        >
          <el-link type="primary" @click="entering">一键录入</el-link>
        </span>
      </div>
    </div>

    <div class="missVerdict" style="margin: 20px 0" v-if="showLevel">
      <!--        <div class="missLeft">事件等级:</div>-->
      <!--        <div class="missRight">-->
      <!--          <el-select v-model="Level"  placeholder="请选择" @change="Steimlevel">-->
      <!--            <el-option-->
      <!--              v-for="item in LevelArr"-->
      <!--              :key="item.id"-->
      <!--              :label="item.name"-->
      <!--              :value="item.id">-->
      <!--            </el-option>-->
      <!--          </el-select>-->
      <!--        </div>-->
    </div>
    <div style="width: 100%; text-align: left; text-indent: 25px">
      <el-button type="primary" size="small" @click="savePlan">保存</el-button>
    </div>

    <div class="missVerdict" v-if="failedLevel">
      <div class="timeByTelephone" v-if="showPhone">
        <span style="color: red" v-if="showPhoneRed"
          ><span
            class="el-icon-timer"
            style="color: black; font-size: 18px; cursor: pointer"
            @click="closePhone"
            >超时:</span
          >电话报送计时:{{ phoneTime }}</span
        >
        <span style="color: green" v-if="showPhoneGreen"
          ><span
            class="el-icon-timer"
            style="color: black; font-size: 18px; cursor: pointer"
            @click="closePhone"
            >剩余:</span
          >电话报送计时:{{ phoneTime }}</span
        >
      </div>
      <div class="timeByMsg" v-if="showNote">
        <span style="color: red" v-if="showNoteRed"
          ><span
            class="el-icon-timer"
            style="color: black; font-size: 18px; cursor: pointer"
            @click="closeSms"
            >超时:</span
          >短信报送计:{{ smsTime }}</span
        >
        <span style="color: green" v-if="showNoteGreen"
          ><span
            class="el-icon-timer"
            style="color: black; font-size: 18px; cursor: pointer"
            @click="closeSms"
            >剩余:</span
          >短信报送计:{{ smsTime }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "truthInitial",
  data() {
    return {
      eventTypeId: sessionStorage.getItem("incidenType"),
      options: [], //初判预案
      initialPlan: "", //选中预案
      caseID: "", //事件类型ID
      changeRed: -1, //切换按钮颜色
      plan: [], //预案等级
      tentative: "", //初步判断
      textarea: "", //初判结论
      Level: "", //事件等级
      LevelId: "", //事件等级ID
      LevelArr: [], //等级数组
      eventId: "", //事件ID
      preplanId: "", //预案ID
      gradeId: 0, //等级ID
      showLevel: true,

      showPhone: false,
      showNote: false,

      phoneTime: null, //电话时间
      smsTime: null, //短信时间

      showPhoneRed: false,
      showPhoneGreen: false,

      showNoteRed: false,
      showNoteGreen: false,

      SteimlevelLevelId: "", //监听下拉变化请求是否超时接口

      timer: null, // 定时器名称

      failedLevel: true,
      elSwitchValue: 1, //1为预案等级  2为事件等级

      caseDataName: "", //预案等级
      decisionLevel: "", //事件判定级别
      decisionEvent: "", //事件类型
      decisionRank: "", //建议启动
      decisionPlan: "", //预案
      decision: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getPlanData();
      this.getEventRank();
    });
  },
  watch: {
    Level: {
      handler(newV) {
        //此处为等级
        console.log(newV);
        let obj = {};
        obj = this.LevelArr.find((item) => {
          //这里的userList就是上面遍历的数据源
          return item.id === newV; //筛选出匹配数据
        });
        console.log(obj);
        this.decisionPlan = obj.name;
      },
      deep: true,
    },

    initialPlan: {
      //此处为预案
      handler(newV) {
        let obj = {};
        obj = this.options.find((item) => {
          //这里的userList就是上面遍历的数据源
          return item.id === newV; //筛选出匹配数据
        });
        this.decisionLevel = obj.name;
      },
      deep: true,
    },

    LevelId: {
      handler(newV, oldV) {
        if (newV !== oldV) {
          this.SteimlevelLevelId = newV;
          clearInterval(this.timer);
          this.timer = null;
          this.setIme();
        }
      },
      deep: true,
    },
    dieNumber(newV, oldV) {
      console.log(newV, oldV);
      if (newV != undefined && oldV !== undefined) {
        if (newV !== oldV) {
          this.intelligence();
        }
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  },
  computed: {
    dieNumber() {
      return this.$store.getters.getDieNumber;
    },
  },
  methods: {
    intelligence() {
      //智能初判接口
      let data = {
        preplanId: this.initialPlan,
        peopleNum: this.$store.getters.getDieNumber,
      };
      console.log(data);
      this.$api.getAiDefault(data).then((res) => {
        if (res.errorcode == "0") {
          console.log(res.data);

          if (res.data.index === "") {
            this.changeRed = -1;
            console.log(this.changeRed);
            this.decision = false;
            this.initialPlan = "";
            this.gradeId = "";
            return;
          }
          this.Level = res.data.eventLevel.id;
          this.changeRed = res.data.index;
          this.gradeId = res.data.LevelId;
        } else {
          //this.$message.error(res.msg);
        }
      });
    },
    closePhone() {
      //关闭电话计时
      this.$confirm("确认结束当前电话计时?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let stopTimeData = {
            eventId: this.eventId,
            type: 1,
          };
          this.$api.stopTime(stopTimeData).then((res) => {
            if (res.errorcode == "0") {
              this.$message({
                type: "success",
                message: "已结束电话计时!",
              });
              this.showPhone = false;
            } else {
              //this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消结束电话计时",
          });
        });
    },
    closeSms() {
      //关闭短信计时
      this.$confirm("确认结束当前短信计时?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let stopTimeData = {
            eventId: this.eventId,
            type: 2,
          };
          this.$api.stopTime(stopTimeData).then((res) => {
            if (res.errorcode == "0") {
              this.$message({
                type: "success",
                message: "已结束短信计时!",
              });
              this.showNote = false;
            } else {
              //this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消结束短信计时",
          });
        });
    },
    getDefaultResDta() {
      // 获取默认的初判预案
      this.eventId = sessionStorage.getItem("newID");
      this.caseId = sessionStorage.getItem("caseID");
      console.log(this.caseId);
      if (this.eventId == "" || this.eventId == null) {
        return;
      }
      if (this.caseId == "" || this.caseId == null) {
        return;
      }
      let data = {
        eventId: this.eventId,
        caseId: this.caseId,
        type: 0,
      };
      this.$api.getDefault(data).then((res) => {
        if (res.errorcode == "0") {
          if (this.initialPlan != "") {
            this.changeRed = res.data.preplanLevelIndex;
            let planParameters = {
              preplanId: this.initialPlan,
            };
            this.$api.getLevelByPreplanId(planParameters).then((res) => {
              if (res.errorcode == "0") {
                this.plan = res.data;
                this.changeRed = this.changeRed == -1 ? -1 : this.changeRed;
              } else {
                //this.$message.error(res.msg);
              }
            });
            return;
          }
          if (res.data == "" && this.initialPlan != "") {
            let planParameters = {
              preplanId: this.initialPlan,
            };

            this.$api.getLevelByPreplanId(planParameters).then((res) => {
              if (res.errorcode == "0") {
                this.plan = res.data;

                // if(res.data!=''){
                //   this.intelligence()//调用智能初判接口
                // }
              } else {
                //this.$message.error(res.msg);
              }
            });
            return;
          }
          // if(res.data==[]||res.data==''){
          //
          //   return
          // }
          if (
            res.data.preplans == "" ||
            res.data.preplans == null ||
            res.data.preplans == []
          ) {
            if (res.data.level != "" && res.data.level != null) {
              console.log(res.data);
              this.Level = res.data.level.id; //赋值默认选中
              this.decisionPlan = res.data.level.name; //智能初判加的功能

              // decisionPlan
            }
          } else {
            this.decision = true;
            this.decisionEvent = sessionStorage.getItem("caseName"); //智能初判加的功能
            this.caseDataName = res.data.preplans.name; //智能初判加的功能
            this.decisionLevel = res.data.caseName; //智能初判加的功能
            this.decisionRank = res.data.preplans.name; //智能初判加的功能
            this.initialPlan = res.data.preplans.id; //赋值默认选中
            this.preplanId = res.data.preplans.id; //因为修改需求，加上前面代码遗留问题，导致又设了一个存储ID，所以再存一次
            this.changeRed = res.data.preplanLevelIndex;
            this.showLevel = true;
            if (res.data.level != null) {
              this.Level = res.data.level.id; //赋值默认选中
              this.decisionPlan = res.data.level.name; //智能初判加的功能
            }
            if (res.data.content != null) {
              this.textarea = res.data.content;
            }
            let index = res.data.preplanLevelIndex;
            let planParameters = {
              preplanId: this.initialPlan,
            };
            this.$api.getLevelByPreplanId(planParameters).then((res) => {
              if (res.errorcode == "0") {
                this.plan = res.data;
                this.tentative = this.plan[index].name;
                this.gradeId = this.plan[index].id;
                for (let i = 0; i < this.LevelArr.length; i++) {
                  if (this.LevelArr[i].id == this.plan[index].eventLevelId) {
                    // this.Level=this.LevelArr[i].name;
                    if (!this.LevelArr[i].id) {
                      return;
                    }
                    this.showLevel = true;
                    // this.Level=this.LevelArr[i].id;
                    if (this.LevelId == 0) {
                      this.showLevel = true;
                      // this.failedLevel=false
                    }
                  }
                }
              } else {
                //this.$message.error(res.msg);
              }
            });
          }
          // if(res.data.preplans==''||res.data.preplans==null&&res.data.preplanLevelIndex==''||res.data.preplanLevelIndex==null&&res.data.level!==null){
          //   this.Level=res.data.level.id;//赋值默认选中
          //   return;
          // }
          this.setIme();
        } else {
          //this.$message.error(res.msg)
        }
      });
    },
    Steimlevel(e) {
      let obj = {};
      obj = this.LevelArr.find((item) => {
        //这里的userList就是上面遍历的数据源
        return item.id === e; //筛选出匹配数据
      });
      this.decisionPlan = obj.name;
      // console.log(obj.name);//获取的 name
      // console.log(e);//获取的 id
      this.SteimlevelLevelId = e;
      this.$nextTick(() => {
        clearInterval(this.timer);
        this.timer = null;
        this.setIme();
      });
    },
    setIme() {
      this.failedLevel = true;
      let phoneTime = sessionStorage.getItem("phoneExtend1");
      let smsTime = sessionStorage.getItem("smsExtend2");
      if (this.eventId == "" || this.eventId == null) {
        return;
      }
      if (phoneTime == 0 || phoneTime == "") {
        //判断电话是否开始计时 0||空?已开始:未开始
        let data = {
          eventId: this.eventId,
          levelId: this.Level,
        };
        console.log(this.Level);
        this.$api.LiveGetTime(data).then((res) => {
          if (res.errorcode == "0") {
            if (res.data.hasPhone) {
              //判断有不有电话计时
              this.showPhone = true;
              if (res.data.phoneTimeout) {
                //判断电话有没有超时
                this.showPhoneRed = true;
                this.showPhoneGreen = false;
                let overtime = res.data.phoneTime; //超时
                this.phoneTime = overtime;
              } else {
                this.showPhoneGreen = true;
                this.showPhoneRed = false;
                let noOvertime = res.data.phoneTime;
                this.phoneTime = noOvertime;
              }
            } else {
              this.showPhone = false;
            }
            if (res.data.hasSms) {
              //判断有不有短信计时
              this.showNote = true;
              if (res.data.smsTimeout) {
                //判断短信有不有超时
                this.showNoteRed = true;
                this.showNoteGreen = false;
                let overNotetime = res.data.smsTime; //超时
                this.smsTime = overNotetime;
              } else {
                this.showNoteGreen = true;
                this.showNoteRed = false;
                let overNotetime = res.data.smsTime;
                this.smsTime = overNotetime;
              }
            } else {
              this.showNote = false;
            }
            let day = parseInt(this.phoneTime / 60 / 24);
            let hour = parseInt((this.phoneTime / 60) % 24);
            let min = parseInt(this.phoneTime % 60);
            let smsDay = parseInt(this.smsTime / 60 / 24);
            let smaHour = parseInt((this.smsTime / 60) % 24);
            let smsMin = parseInt(this.smsTime % 60);
            this.phoneTime = `${day}天${hour}时${min}分`;
            this.smsTime = `${smsDay}天${smaHour}时${smsMin}分`;
            clearInterval(this.timer);
            this.timer = null;
            this.timer = setInterval(() => {
              this.setIme();
            }, 60000);
          }
        });
      }
      if (smsTime == 0 || smsTime == "") {
        //判断短信是否开始计时 0||空?已开始:未开始
        let data = {
          eventId: this.eventId,
          levelId: this.Level,
        };
        this.$api.LiveGetTime(data).then((res) => {
          if (res.errorcode == "0") {
            if (res.data.hasPhone) {
              //判断有不有电话计时
              this.showPhone = true;
              if (res.data.phoneTimeout) {
                //判断电话有没有超时
                this.showPhoneRed = true;
                this.showPhoneGreen = false;
                let overtime = res.data.phoneTime; //超时
                this.phoneTime = overtime;
              } else {
                this.showPhoneGreen = true;
                this.showPhoneRed = false;
                let noOvertime = res.data.phoneTime;
                this.phoneTime = noOvertime;
              }
            }
            if (res.data.hasSms) {
              //判断有不有短信计时
              this.showNote = true;
              if (res.data.smsTimeout) {
                //判断短信有不有超时
                this.showNoteRed = true;
                this.showNoteGreen = false;
                let overNotetime = res.data.smsTime; //超时
                this.smsTime = overNotetime;
              } else {
                this.showNoteGreen = true;
                this.showNoteRed = false;
                let overNotetime = res.data.smsTime;
                this.smsTime = overNotetime;
              }
            }
            let day = parseInt(this.phoneTime / 60 / 24);
            let hour = parseInt((this.phoneTime / 60) % 24);
            let min = parseInt(this.phoneTime % 60);
            let smsDay = parseInt(this.smsTime / 60 / 24);
            let smaHour = parseInt((this.smsTime / 60) % 24);
            let smsMin = parseInt(this.smsTime % 60);
            this.phoneTime =
              smsDay == 0 ? `${hour}时${min}分` : `${day}天${hour}时${min}分`;
            this.smsTime =
              smsDay == 0
                ? `${smaHour}时${smsMin}分`
                : `${smsDay}天${smaHour}时${smsMin}分`;

            clearInterval(this.timer);
            this.timer = null;
            this.timer = setInterval(() => {
              this.setIme();
            }, 60000);
          }
        });
      }
    },
    getEventRank() {
      //获取事件级别
      let data = {
        pcode: "emtlevel",
      };
      this.$api.eventLevel(data).then((res) => {
        if (res.errorcode == "0") {
          this.LevelArr = res.data;
          console.log(this.LevelArr);
        }
      });
    },
    missPlan() {
      this.tentative = "未达级别";
      this.changeRed = -1;
      this.gradeId = 0;
      this.showLevel = true;
      this.failedLevel = false;
    },
    setClick(list, index) {
      //设置点击按钮
      if (this.elSwitchValue == 2) {
        //依据事件等级赋值等级数据
        this.changeRed = index;
        this.Level = list.levelId;
        console.log(list);
        this.tentative = list.levelName;
        this.decisionPlan = list.levelName;
        this.decisionEvent = sessionStorage.getItem("caseName");
        this.decision = true;
      }
      if (this.elSwitchValue == 1) {
        this.decisionLevel = this.plan[index].name;
        this.decisionEvent = sessionStorage.getItem("caseName");
        // this.decisionRank=this.plan[index].name
        this.decision = true;
        // this.decisionPlan=this.initialPlan

        this.changeRed = index;
        this.gradeId = list.id;
        // this.Level='';
        // this.LevelId='';
        this.tentative = this.plan[index].name;
        for (let i = 0; i < this.LevelArr.length; i++) {
          if (this.LevelArr[i].id == this.plan[index].eventLevelId) {
            // this.Level=this.LevelArr[i].id;
            if (!this.LevelArr[i].id) {
              return;
            }
            this.showLevel = true;
            // this.LevelId=this.LevelArr[i].id;
          }
        }
      }
    },
    getPlanData() {
      this.caseID = sessionStorage.getItem("caseID");
      this.eventId = sessionStorage.getItem("newID");
      console.log(this.caseID);
      if (this.caseID == "" || this.caseID == null) {
        return;
      }
      if (this.eventId == "newID") {
        return;
      }
      let data = {
        caseId: this.caseID,
      };
      this.$api.getPreplanByCaseId(data).then((res) => {
        if (res.errorcode == "0") {
          this.options = res.data;
          this.getDefaultResDta();
          console.log(res.data);
        } else {
          //this.$message.error(res.msg);
        }
      });
    },
    /**
     * @param {e(obj):初判预案选中的event}
     * @return {underfine}
     * @descripttion: 选择初判预案，自动匹配预案等级
     */
    cutPlan(e) {
      let obj = {};
      obj = this.options.find((item) => {
        return item.id === e; //筛选出匹配数据
      });
      console.log(obj.name);
      this.decisionRank = obj.name;
      this.initialPlan = e;
      this.getplanLevel();

      if (this.eventTypeId.length == 0) {
        this.$message({
          message: "请选择左边事件类型",
          type: "error",
        });
        return;
      }
      this.$http({
        url: `${
          this.$window.g.ApiUrl
        }/eos/event/param/judgeEventLevel?eventId=${String(
          sessionStorage.getItem("newID")
        )}&caseId=${String(
          this.eventTypeId[this.eventTypeId.length - 1]
        )}&preplanId=${String(e)}`,
        method: "get",
      }).then((res) => {
        console.log("/eos/event/param/judgeEventLevel res", res);
        if (res.data.errorcode == 0) {
          this.gradeId = res.data.data;
          if (this.elSwitchValue == 1) {
            for (let index in this.plan) {
              if (this.plan[index].id == res.data.data) {
                this.changeRed = index;
                this.decisionLevel = this.plan[index].name;
                this.decisionEvent = sessionStorage.getItem("caseName");
                this.decision = true;
                this.changeRed = index;
                this.gradeId = this.plan[index].id;
                this.tentative = this.plan[index].name;
                for (let i = 0; i < this.LevelArr.length; i++) {
                  if (this.LevelArr[i].id == this.plan[index].eventLevelId) {
                    if (!this.LevelArr[i].id) {
                      return;
                    }
                    this.showLevel = true;
                  }
                }
                break;
              }
            }
          }

          if (this.elSwitchValue == 2) {
            //依据事件等级赋值等级数据
            for (let index in this.plan) {
              this.changeRed = index;
              this.Level = this.plan[index].levelId;

              this.tentative = this.plan[index].levelName;
              this.decisionPlan = this.plan[index].levelName;
              this.decisionEvent = sessionStorage.getItem("caseName");
              this.decision = true;
            }
          }
        }
      });
    },
    getplanLevel() {
      let data = {
        preplanId: this.initialPlan,
      };
      this.$api.getLevelByPreplanId(data).then((res) => {
        if (res.errorcode == "0") {
          this.plan = res.data;
          console.log(this.plan);
        } else {
          //this.$message.error(res.msg);
        }
      });
    },
    savePlan() {
      if (this.eventId == "" || this.eventId == null) {
        this.$message({
          message: "暂无“事件”可以进行操作",
          type: "warning",
        });
        return;
      }
      if (this.eventId == "newID") {
        this.$message({
          message: "请选择保存事件!",
          type: "warning",
        });
        return;
      }
      // if(this.preplanId==''||this.preplanId==null){
      //   this.$message({
      //     message: '请选择“初判预案”再进行操作',
      //     type: 'warning'
      //   });
      //   return;
      // }
      // if(this.LevelId==''||this.LevelId==null){
      //   this.$message({
      //     message: '请选择“初判等级”再进行操作',
      //     type: 'warning'
      //   });
      //   return;
      // }
      let data = {
        eventId: this.eventId,
        preplanId: this.initialPlan,
        levelId: this.gradeId,
        content: this.textarea,
        eventLevelId: this.Level == "" ? null : this.Level,
      };
      console.log(data);
      this.$api.saveJudge(data).then((res) => {
        if (res.errorcode == "0") {
          this.$message({
            message: "保存成功!",
            type: "success",
          });
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    entering() {
      //一键录入
      this.textarea = `经初步研判,该事件判定为【${this.decisionPlan}】/【${this.decisionEvent}】事件,建议启动【${this.decisionRank}】/【${this.decisionLevel}】预案`;
    },
    watchData() {
      //判断是否为true
    },
    changeSwitch(val) {
      //切换预案等级或事件等级
      if (val == 2) {
        let data = {
          caseId: sessionStorage.getItem("caseID"),
        };
        this.$api.divideList(data).then((res) => {
          if (res.errorcode == "0") {
            this.plan = res.data;
            let userData = {
              eventId: sessionStorage.getItem("newID"),
              caseId: sessionStorage.getItem("caseID"),
            };
            this.$api.getDefaultEventLevel(userData).then((res) => {
              if (res.errorcode == "0") {
                this.changeRed = res.data;
              } else {
                //this.$message.error(res.msg);
              }
            });
          } else {
            //this.$message.error(res.msg);
          }
        });
      }
      if (val == 1) {
        if (this.initialPlan == "") {
          this.plan = "";
          this.changeRed = -1;
        } else {
          this.getPlanData();
          this.getEventRank();
        }
      }
    },
  },
};
</script>

<style scoped>
#planBackg {
  display: flex;
  min-width: 350px;
}
#planBackg li {
  width: 100%;
  height: 30px;
  list-style: none;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
#planBackg li .spanStrat {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}
#planBackg li .spanEnd {
  padding-left: 10px;
  display: inline-block;
}
.planRelative {
  width: 100%;
  height: 80px;
  overflow: auto;
  box-sizing: border-box;
  display: flex;
  font-size: 12px;
}
#aLink,
#xiesi {
  cursor: pointer;
  color: #7e7f83;
  min-width: 80px;
  /*border: 1px solid #E3F0FF;*/
  font-size: 12px;
}
.red {
  box-sizing: border-box;
  border: 2px solid #47afff !important;
}
.titlePlan {
  width: 100%;
  height: 70px;
  display: flex;
  color: white;
  margin: auto 0;
  align-items: center;
  justify-content: center;
  overflow: auto;
  flex: 1;
  border-right: 1px solid #ddd;
}
.contentPlan {
  width: 100%;
  height: 100%;
  padding-left: 20px;
  text-align: left;
  text-indent: 20px;
  overflow: auto;
  flex: 5;
}
.missVerdict {
  display: flex;
  /*width: 100%;*/
  margin: 10px 0;
}
.timeByTelephone {
  text-align: center;
  width: 50%;
}
.timeByMsg {
  text-align: center;
  width: 50%;
}
.missLeft {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.missRight {
  flex: 9;
}
.planStyle {
  margin: 10px 0;
  background-color: #f9fbff;
  border-radius: 3px;
  height: 80px;
}
.missRight >>> .el-textarea__inner {
  background-color: #f9f9f9;
}
.missRight >>> .el-textarea__inner {
  padding: 5px 85px 5px 15px;
}
</style>
