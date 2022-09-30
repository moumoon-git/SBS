<!--
 * @Author: xuchuangxing
 * @Date: 2020-08-11 17:43:39
 * @LastEditTime: 2021-03-16 15:14:07
 * @LastEditors: Please set LastEditors
 * @Description: 政务排班模块
 * @FilePath: \SZEos2.7.1.ucse:\xuchuangxing\SJSEos2.7.1.ucs\src\view\dutyManagement\onDutyRoster\AdministrativeDuty\AdministrativeDuty.vue
-->
<!--@author：wzm-->
<template>
  <div>
    <div class="contentStyle">
      <el-header class="header">
        <div class="search-bar">
          <el-date-picker
            v-model="month"
            type="month"
            placeholder="选择月份"
            :clearable="false"
          ></el-date-picker>
          <!-- <el-input class="search-bar-input" placeholder="请输入内容" v-model="searchValue">
            <el-button slot="append" icon="el-icon-search" @click="getDustList"></el-button>
          </el-input>-->
        </div>
        <div class="navs-bar">
          <el-button @click="addUnit" type="primary">采集单位管理</el-button>
          <el-button @click="unitScheduling" type="primary">单位排班</el-button>
          <el-button @click="handleAdd" type="primary">政务值班定义</el-button>
          <!-- <el-button @click="issueHandle" type="primary">排班任务下发</el-button> -->
          <el-button @click="exportAffairs" type="primary"
            >上报市局导出</el-button
          >
        </div>
      </el-header>
      <el-main class="allDuty" v-if="dustList.length > 0">
        <div v-for="(x, index) in dustList" :key="x.date" class="dutyToday">
          <div
            class="allDete"
            :style="{
              color: x.type ? '#333' : '#FF3333',
              'background-color': getBackgroundColor(x.date),
            }"
          >
            <div class="date">{{ x.date }}</div>
            <div class="week">{{ `（${x.week}）` }}</div>
            <div class="closeDuty" v-if="deptExist(x.data)">
              <i class="el-icon-close" @click.stop="dutyDelete(x.date)"></i>
            </div>
          </div>
          <!-- 选择分组弹窗 -->
          <select-group-dialog
            ref="selectDialog"
            selectTitle="选择分组"
            :selectData="outerVisible"
            @close="
              outerVisible = false;
              groupDialog = false;
            "
            @closeDialog="
              outerVisible = false;
              groupDialog = false;
            "
            @addMans="change"
            v-if="groupDialog && currentDate == x.date"
            :currentDate="currentDate"
          ></select-group-dialog>

          <div
            class="displayDuty"
            @scroll="scrollEvent(index)"
            :id="`displayDuty${index}`"
            @click="settingHandle(x.date, x.data)"
          >
            <div
              v-for="(y, i) in x.data"
              :key="y.id"
              :style="{
                height: 130 / x.data.length + 'px',
                'line-height': 130 / x.data.length - 10 + 'px',
              }"
              style="text-align: center; display: flex; box-sizing: border-box"
            >
              <div
                style="
                  border-right: 1px solid #e9f0fc;
                  overflow-x: scroll;
                  box-sizing: border-box;
                  width: 30%;
                "
                :style="{
                  'border-bottom':
                    i != x.data.length - 1 ? '1px solid #E9F0FC' : 'none',
                }"
              >
                {{ y.name }}
              </div>
              <div
                v-if="y.contactorGroupId"
                class="contactorGroup"
                style=""
                :style="{
                  width: y.appSjsDutyContactorVos.length > 0 ? '30%' : '70%',
                  'border-bottom':
                    i != x.data.length - 1 ? '1px solid #E9F0FC' : 'none',
                }"
              >
                {{ y.contactorGroupName }}
                <!-- <i
                  v-if="y.contactorGroupName"
                  class="el-icon-close closeDuty"
                  @click.stop="dutyDelete(x.date, y.contactorGroupId)"
                ></i> -->
              </div>
              <!-- {{y.name + '（'+y.contactorGroupName + '）'}}： -->
              <div
                style="width: 40%; overflow-x: scroll"
                v-if="y.appSjsDutyContactorVos.length > 0"
                :style="{
                  'border-bottom':
                    i != x.data.length - 1 ? '1px solid #E9F0FC' : 'none',
                }"
              >
                <span
                  v-for="(v, index) in y.appSjsDutyContactorVos"
                  :key="v.id"
                  >{{
                    v.name +
                    (index != y.appSjsDutyContactorVos.length - 1 ? "，" : "")
                  }}</span
                >
              </div>

              <div
                style="width: 70%; color: #333; cursor: pointer"
                :style="{
                  'border-bottom':
                    i != x.data.length - 1 ? '1px solid #E9F0FC' : 'none',
                }"
                v-if="!y.contactorGroupId"
              >
                设置
              </div>
            </div>
          </div>
          <!-- <div>
            <div v-for="x in departmentList" :key="x.date">
              <div class="displayDepart" v-if="x.date == item.date">
                <div v-for="v in x.data" :key="v.id" :style="{'height': 130/x.data.length + 'px','line-height':130/x.data.length-10 + 'px','border':'1px solid #E9F0FC','text-align':'center','display':'flex'}">
                    <div style="width:50%;border-right:1px solid #E9F0FC">
                        {{v.className}}
                    </div>d
                    <div style="width:50%;color:#333" v-if="v.contactorGroupId">
                        {{v.contactorGroupName}}
                    </div>
                    <div style="width:50%;color:#333;cursor: pointer;" v-else @click="settingHandle(item.date,x.data)">
                        设置
                    </div>
                    
                    <i class="el-icon-close closeDepart" v-if="v.contactorGroupName"  @click.stop="departDelete(x.date)"></i>
                </div>
              </div>
            </div>
          </div> -->
          <!-- <div
            class="displaySet"
            v-if="!(departmentList.length>0?departmentList.find(v=> v.date == item.date ):false) && !(dustList.length>0?dustList.find(v=> v.date == item.date ):false)"
            @click="settingHandle(item.date)"
          >
            <span>设置</span>
          </div> -->
        </div>
      </el-main>

      <!-- 政务值班定义 -->
      <el-dialog
        title="政务管理"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
      >
        <add-edit
          ref="addEdit"
          v-if="dialogVisible"
          :formData="dutyArr"
          @saveSuccess="handleSaveSuccess"
        ></add-edit>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSave">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 排班任务下发 -->
      <scheduling-tasks
        ref="schedulingTasks"
        selectTitle="选择联系人"
        :selectData="schedulingTasksVisible"
        @close="
          schedulingTasksVisible = false;
          schedulingTasks = false;
        "
        @closeDialog="
          schedulingTasksVisible = false;
          schedulingTasks = false;
        "
        :month="month"
        @issueHandle="issue"
        v-if="schedulingTasks"
      ></scheduling-tasks>

      <!-- 采集单位管理 -->
      <unit-Management
        ref="unitManagement"
        selectTitle="采集单位管理"
        :selectData="unitManagementVisible"
        @close="unitManagementVisible = false"
        @closeDialog="unitManagementVisible = false"
        @initList="initList"
        v-if="unitManagement"
        @saveUnitHandle="saveUnitHandle"
      ></unit-Management>
    </div>
  </div>
</template>

<script>
import AddButton from "@/components/button/addButton";
import addEdit from "./addEdit";
import selectMansDialog from "./selectMansDialog";
import schedulingTasks from "./SchedulingTasks";
import selectGroupDialog from "./selectGroupDialog";
import unitManagement from "./UnitManagement";
import exportFile from '@/view/tool/exportFile' // 下载文件
import $ from "jquery";

export default {
  name: "flightManagement",
  components: {
    addEdit,
    selectMansDialog,
    schedulingTasks,
    selectGroupDialog,
    unitManagement,
  },
  data() {
    return {
      month: "",
      searchValue: "",
      showType: "",
      tableData: [],
      dialogVisible: false, // 添加值班弹窗
      daysOfMonth: [], // 当前月所有日期
      outerVisible: false, // 当前的值班弹窗
      groupDialog: false,
      schedulingTasksVisible: false, // 排班任务弹窗
      schedulingTasks: false,
      unitManagement: false, // 采集单位管理弹窗
      unitManagementVisible: false,
      currentDate: "",
      dutyArr: [], // 今日班次
      dustList: [], // 部门列表
      departmentList: [], // 值班列表
      baseUrl: window.g.ApiUrl,
      setShiftData: [], // 选择设置日期的所有班次
      occupancyData: [], // 占位数据
      occupancyHeight: [], // 日期占位高度
      lastMonthDays: [], // 上个月所有日期
      currentYear: [], // 当前年份
      currentMonth: [], // // 当前月份
    };
  },
  created() {
    this.month = new Date();
    this.currentYear = this.month.getFullYear();
    this.currentMonth = this.month.getMonth();
  },
  mounted() {
    this.initDuty();
    this.createMonthDay();
  },
  computed: {
    getBackgroundColor() {
      return function (date) {
        let getMonth = new Date(date).getMonth();
        return getMonth == this.currentMonth ? "#f0f5ff" : "#f0f0f0";
      };
    },
  },
  watch: {
    // 跟据所选的月份获取所有日期
    month() {
      this.currentYear = this.month.getFullYear();
      this.currentMonth = this.month.getMonth();
      this.getCurrentOrlastDate();
      this.getDustList();
    },
  },
  methods: {
    scrollEvent(idx) {
      let displayDutyArr = Array.from(
        document.getElementsByClassName("displayDuty")
      );
      displayDutyArr.forEach((element) => {
        if (element.id == "displayDuty" + idx) {
          element.lastElementChild.style.left = 291 + element.scrollLeft + "px";
          element.lastElementChild.style.top = 0 + element.scrollTop + "px";
        }
      });
    },
    getCurrentOrlastDate() {
      let fullYear = this.currentYear;
      let month = this.currentMonth;
      this.daysOfMonth = this.createMonthDay(fullYear, month + 1);
      this.lastMonthDays = this.createMonthDay(
        month ? fullYear : fullYear - 1,
        month ? month : 12
      );
    },
    // handleScroll () {
    //   let dudy = document.getElementsByClassName('displayDuty')
    //   var scrollLeft = dudy.pageYOffset || dudy.scrollLeft || dudy.scrollLeft
    //   console.log(scrollLeft)
    // },
    // 获取当前月所有日期
    createMonthDay(year, mon) {
      let daysOfMonth = [];
      let fullYear = year;
      let month = mon;
      let lastDayOfMonth = new Date(fullYear, month, 0).getDate();
      for (var i = 1; i <= lastDayOfMonth; i++) {
        let date =
          fullYear +
          "-" +
          (month > 9 ? month : "0" + month) +
          "-" +
          (i > 9 ? i : "0" + i);
        let week = "星期" + "日一二三四五六".charAt(new Date(date).getDay());
        daysOfMonth.push({ date, week });
      }
      return daysOfMonth;
    },
    // 获取所有值班班次列表数据
    async getDustList() {
      // 保存是关闭
      this.outerVisible = false;
      try {
        let params = {
          date: this.month.formatDate("yyyy-MM"),
        };
        let { data } = await this.$api.affairsGroup(params);
        console.log("data: ", data);
        if (data && data.length > 0) {
          let lastParams = {
            date:
              (this.currentMonth ? this.currentYear : this.currentYear - 1) +
              "-" +
              (this.currentMonth
                ? this.currentMonth > 9
                  ? this.currentMonth
                  : "0" + this.currentMonth
                : 12),
          };
          this.$api.affairsGroup(lastParams).then((res) => {
            let date = new Date(this.month);
            date.setDate(1);
            let occupancyNum = date.getDay() != 0 ? date.getDay() : 7;
            this.dustList = res.data
              .slice(res.data.length - (occupancyNum - 1))
              .concat(data);
            console.log("this.dustList: ", this.dustList);
            this.dustList.map((v) => {
              v.week =
                "星期" + "日一二三四五六".charAt(new Date(v.date).getDay());
              if (v.data.length > 0) {
                v.type = v.data[0].type;
              }
            });
          });

          // setTimeout(() => {
          //   this.occupancyHeight = document.getElementsByClassName(
          //     "dutyToday"
          //   )[0].clientHeight;
          //   console.log("occupancyNum: ", occupancyNum);
          //   this.occupancyData =
          //   console.log("this.lastMonthDays: ", this.lastMonthDays);
          //   console.log("this.occupancyData: ", this.occupancyData);
          // });
        }

        // this.getDepartmentList();
      } catch (e) {
        console.log(`getList: ${e}`);
      }
    },
    // 获取所有部门列表数据
    async getDepartmentList() {
      // 保存是关闭
      this.outerVisible = false;
      console.log("this.dustList: ", this.dustList);
      try {
        let params = {
          date: this.month.formatDate("yyyy-MM"),
        };
        let { data } = await this.$api.dateGroup(params);
        if (data) {
          this.departmentList = data;
        }

        // this.dustList.map(v=>{
        //   console.log(v.date)
        // })
        // this.departmentList.map(v=>{
        //   console.log(v.date)
        // })
        if (this.dustList.length > 0) {
          // alert(13213132)
          this.departmentList = this.departmentList.filter((x) =>
            this.dustList.every((y) => x.date != y.date)
          );
        }
      } catch (e) {
        console.log(`getList: ${e}`);
      }
    },
    // 获取所有值班数据
    initDuty(date) {
      this.getDuty(date).then((data) => {
        this.dutyArr = data;
        if (this.dutyArr.length > 0) {
          this.dutyArr.map((v) => {
            v.default = "默认";
            v.toTomorrowStatus ? true : false;
            if (this.currentDate) {
              v.date = this.currentDate;
            }
          });
        }
      });
    },

    getDuty(date) {
      return new Promise((reslove, reject) => {
        let data = {
          date,
        };
        this.$api.affairsClasses(data).then((res) => {
          if (res.errorcode == 0 && res.data) {
            reslove(res.data);
          }
        });
      });
    },
    // 点击新增按钮触发
    handleAdd() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.initDuty();
      });
    },
    // 点击addEdit组件确定按钮
    handleSave() {
      this.$refs.addEdit.handleSave();
    },
    // addEdit组件保存成功返回
    handleSaveSuccess() {
      this.dialogVisible = false;
      this.initDuty();
    },
    // 点击值班删除按钮触发
    dutyDelete(date, id) {
      let today = new Date();
      /*判断所选日期是否小于当前日期*/
      if (
        +new Date(date) <
        +new Date(today.getFullYear(), today.getMonth(), today.getDate())
      ) {
        this.$message.error("所选日期小于当前日期");
        return;
      }
      this.$confirm("确认删除该当天值班, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            let params = { date, id };
            let res = await this.$api.affairsGroupDelete(params);
            if (res.errorcode === 0) {
              await this.getDustList();
            }
          } catch (e) {
            console.log(`handleRemove: ${e}`);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 点击部门删除按钮触发
    departDelete(date) {
      this.$confirm("确认删除该当天值班, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            let params = { date };
            let res = await this.$api.affairsGroupDelete(params);
            if (res.errorcode === 0) {
              await this.getDustList();
            }
          } catch (e) {
            console.log(`handleRemove: ${e}`);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    /**
     * @description: 获取当天班次
     * @author xuchuangxing
     * @lastTime 20201018 17:01
     * @lastEditor xuchuangxing
     * @param {item} 点击的日期对象
     * @param {setShiftData} 当前日期下的数据-获取班次名，不在需要调用接口过滤班次
     * @return {type}
     */
    settingHandle(item, setShiftData) {
      this.currentDate = item;

      // this.setShiftData = [...setShiftData];
      let sameDay = new Date().formatDate("yyyy-MM-dd");
      let sameDayTimeStamp = new Date(sameDay).getTime();
      console.log("sameDayTimeStamp: ", sameDayTimeStamp);
      let clickDate = this.month.formatDate(item);
      let clickDateTimeStamp = new Date(clickDate).getTime();
      console.log("clickDateTimeStamp: ", clickDateTimeStamp);
      console.log(
        "clickDateTimeStamp>=sameDayTimeStamp: ",
        clickDateTimeStamp >= sameDayTimeStamp
      );
      if (clickDateTimeStamp >= sameDayTimeStamp) {
        this.groupDialog = true;

        this.$nextTick(() => {
          this.getDuty(item).then((res) => {
            if (res.length > 0) {
              this.dutyArr = res;
              this.outerVisible = true;
              this.$refs.selectDialog[0].initData(setShiftData);
            } else {
              this.$message.error("请添加当天类型班次");
            }
          });
        });
      } else {
        this.$message.error("请选择当天或之后的值班");
      }
    },
    // 获取当天值班
    getOneByDate(type) {
      return new Promise((reslove, reject) => {
        let data = {
          date: this.currentDate,
          type,
        };
        this.$api.getOneByDate(data).then((res) => {
          if (res.errorcode == 0) {
            reslove(res.data);
          }
        });
      });
    },
    // 排班任务下发
    issueHandle() {
      this.schedulingTasks = true;
      console.log("this.schedulingTasks: ", this.schedulingTasks);
      this.$nextTick(() => {
        this.schedulingTasksVisible = true;
        console.log(
          "this.schedulingTasksVisible: ",
          this.schedulingTasksVisible
        );
      });
    },
    // 给当天添加部门
    change(dutyData) {
      console.log("dutyData: ", dutyData);
      this.$api.dateGroupSave(dutyData).then((res) => {
        if (res.errorcode == 0) {
          this.$message.success("保存成功");
          this.outerVisible = false;
          this.getDustList();
        }
      });
    },
    // 下发
    issue(arr) {
      let issueData = [];
      arr.map((v) => {
        issueData.push({
          contactorId: v.contactorId,
          mobile: v.contactorMobile,
          groupId: v.groupId,
        });
      });
      let data = {
        date: this.month.formatDate("yyyy-MM"),
        data: issueData,
      };
      this.$api.sendSms(data).then((res) => {
        if (res.errorcode == 0) {
          this.$message.success("下发成功");
          this.schedulingTasks = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 添加单位
    addUnit() {
      this.unitManagement = true;
      this.$nextTick(() => {
        this.unitManagementVisible = true;
      });
    },
    // 单位排班
    unitScheduling() {
      this.$confirm('单位排班前会先删除该月值班, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          let params = {
            date: this.month.formatDate("yyyy-MM"),
          };
          this.$api.unitScheduling(params).then((res) => {
            if (res.errorcode == 0) {
              this.$message.success("排班成功");
              this.getDustList();
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 初始化单位排班
    initList() {
      this.getDustList();
    },
    // 保存单位采集
    saveUnitHandle(unitArr) {
      let data = {
        data: unitArr,
      };
      this.$api.saveUnit(data).then((res) => {
        console.log(res);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
        this.$message.success("保存成功");
        this.unitManagement = false;
      });
    },
    // 导出
    exportAffairs() {
      var url = '/app/sjs/duty/affairsGroup/listExcel'
      exportFile({
        url:window.g.ApiUrl + url,
        method:'get',
        params:{
          date:this.month.formatDate("yyyy-MM"),
          Authorization:localStorage.getItem("token")?localStorage.getItem("token") : ""
        },
        token: this.$cookie.get('token')
      })
    },
    /**
     * @description: 是否显示设置按钮
     * @author: xuchuangxing
     * @lastEditor :xuchuangxing
     * @updateTime :20201018 20:16
     * @param {}
     * @return {}
     */
    deptExist(data) {
      let num = 0;
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (!data[i].contactorGroupId) {
            num++;
          }
        }
        if (num == data.length) {
          return false;
        } else {
          return true;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.contentStyle {
  // margin: 16px 30px 0 30px;
  background-color: white;
  box-sizing: border-box;
  border: 1px solid rgba(219, 219, 219, 1);
  border-radius: 3px;

  .el-table {
    /deep/ .select-row {
      background: #4a9fff;
      color: #ffffff;
      &:hover {
        td {
          background: #4a9fff;
          color: #ffffff;
        }
      }
    }
  }

  .allDuty {
    padding: 0 20px 12px;
    display: flex;
    flex-flow: wrap;
    text-align: center;
    color: #666;
    font-size: 14px;
    .allDete {
      width: 100%;
      height: 57px;
      border-right: 1px solid #c9dcfe;
      border-left: 1px solid #c9dcfe;
      box-sizing: border-box;
      font-size: 14px;
      font-weight: bold;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      &:hover .closeDuty {
        display: inline-block;
      }
      .closeDuty {
        cursor: pointer;
        position: absolute;
        top: 10px;
        right: 10px;
        display: none;
      }
    }
    .displayDuty {
      width: 226px;
      height: 130px;
      border: 1px solid #c9dcfe;
      border-top: none;
      // background-color: #f0f0f0;
      box-sizing: border-box;
      white-space: nowrap;
      position: relative;
      text-align: left;
      cursor: pointer;
      .contactorGroup {
        border-right: 1px solid #e9f0fc;
        overflow-x: scroll;
        box-sizing: border-box;
        position: relative;
        &:hover .closeDuty {
          display: inline-block;
        }
        .closeDuty {
          position: absolute;
          top: 5px;
          right: 5px;
          display: none;
          cursor: pointer;
        }
      }
    }
    .displayDepart {
      width: 226px;
      height: 130px;
      line-height: 25px;
      border: 1px solid #c9dcfe;
      border-top: none;
      box-sizing: border-box;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      &:hover .closeDepart {
        display: inline-block;
      }
      .closeDepart {
        position: absolute;
        top: 10px;
        right: 10px;
        display: none;
        cursor: pointer;
      }
    }
    .displaySet {
      width: 226px;
      height: 130px;
      border: 1px solid #c9dcfe;
      border-top: none;
      cursor: pointer;
      padding: 10px;
      box-sizing: border-box;
      white-space: nowrap;
      overflow: scroll;
      line-height: 100px;
    }
  }

  .header {
    height: 72px !important;
    line-height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .search-bar {
      display: flex;
      align-items: center;

      .search-bar-input {
        margin-left: 10px;

        /deep/ .el-input-group__append {
          padding: 0 12px;
          background-color: #409eff;
          color: white;
          font-size: 16px;
        }
      }
    }

    .navs-bar {
      background-color: white;
      display: flex;
      align-items: center;
    }
  }
}

.tableContainer {
  padding: 6px;
  box-sizing: border-box;
  border: 1px solid rgba(211, 215, 219, 1);
}

.element.style {
  text-align: left;
}

.el-input-number {
  display: block;
  width: 220px;
}

.dialog-footer {
  text-align: center;
}
::-webkit-scrollbar {
  background-color: transparent;
}
::-webkit-scrollbar-button {
  background-color: transparent;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}
::-webkit-scrollbar-corner {
  background-color: transparent;
}
</style>
