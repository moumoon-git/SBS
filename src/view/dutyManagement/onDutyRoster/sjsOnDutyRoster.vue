<!--@author：wzm-->
<template>
  <div>
    <nav-bar
      :selectedName.sync="selectedName"
      :navBarList="navBarList"
      class="narBar"
      @changTab="changTab"
      ref="navBar"
    ></nav-bar>
    <sjs-workforce-management
      v-if="selectedName == '排班管理'"
      :save="isNeedSave"
      @updateData="updateData"
    ></sjs-workforce-management>
    <history-and-scheduling
      v-if="selectedName == '历史排班'"
    ></history-and-scheduling>
    <sjs-flight-management
      v-if="selectedName == '班次管理'"
    ></sjs-flight-management>
    <sjs-operator-on-duty
      v-if="selectedName == '值班人员'"
    ></sjs-operator-on-duty>
    <sjs-holiday-management
      v-if="selectedName == '节假日管理'"
    ></sjs-holiday-management>
    <subordinateScheduling
      v-if="selectedName == '部门排班'"
    ></subordinateScheduling>
    <administrative-duty
      v-if="selectedName == '政务值班'"
    ></administrative-duty>
    <leave-reminder-dialog
      v-if="isShowReminderDialog"
      @noSave="noSave"
      @offSave="offSave"
      @yesSave="yesSave"
    ></leave-reminder-dialog>
  </div>
</template>

<script>
import NavBar from "@/components/menu/navBar";
import sjsWorkforceManagement from "@/view/dutyManagement/onDutyRoster/workforceManagement/sjsWorkforceManagement";
import historyAndScheduling from "@/view/dutyManagement/onDutyRoster/historyAndScheduling/historyAndScheduling";
import sjsFlightManagement from "@/view/dutyManagement/onDutyRoster/flightManagement/sjsFlightManagement";
import sjsOperatorOnDuty from "@/view/dutyManagement/onDutyRoster/operatorOnDuty/sjsOperatorOnDuty";
import sjsHolidayManagement from "@/view/dutyManagement/onDutyRoster/holidayManagement/sjsHolidayManagement";
import subordinateScheduling from "@/view/dutyManagement/onDutyRoster/subordinateScheduling/subordinateScheduling";
import leaveReminderDialog from "@/view/eventManagement/eventReports/dialog/leaveReminderDialog";
import administrativeDuty from "@/view/dutyManagement/onDutyRoster/AdministrativeDuty/AdministrativeDuty";

export default {
  name: "sjsOnDutyRoster",
  components: {
    NavBar,
    sjsWorkforceManagement,
    historyAndScheduling,
    sjsFlightManagement,
    sjsHolidayManagement,
    subordinateScheduling,
    sjsOperatorOnDuty,
    leaveReminderDialog,
    administrativeDuty,
  },
  data() {
    return {
      activeTabName: "", // 中间媒介 存放点击tab后的tabName
      isUpdateData: false, // 排班管理内容是否更改
      isNeedSave: false, // 排班管理内容是否需要保存
      isShowReminderDialog: false, // 用来判断数据是否修改，若修改了，退出，需要提醒
      selectedName: "排班管理", //默认选中导航条
      navBarList: [
        {
          name: "排班管理",
        },
        {
          name: "部门排班",
        },
        {
          name: "政务值班",
        },
        // {
        //   name: "历史排班",
        // },
        {
          name: "班次管理",
        },
        {
          name: "值班人员",
        },
        {
          name: "节假日管理",
        },
      ], //导航条模块
    };
  },
  methods: {
    /**
     * @param {String} tabName tab页名字
     * @description tab页面切换
     * @author hexinting
     * @lastEditors hexinting
     * @lastEditTime 2020-09-07
     */
    changTab(tabName) {
      this.activeTabName = tabName; // 中间媒介
      // var el = document.getElementById('tab-' + '排班管理')
      // el.classList.add('is-active')
      // console.log(el)
      // console.log(el.classList)
      if (this.isUpdateData) {
        this.isShowReminderDialog = true; // 显示弹窗
        this.selectedName = "排班管理"; // 当前选中页：排班管理
      } else {
        this.selectedName = tabName; // 当前选中页
      }
      console.log("this.isUpdateData", this.isUpdateData);
      console.log("当前tab", this.selectedName, this.activeTabName);
    },
    /**
     * @param
     * @description 不保存按钮(不保存排班管理的内容) 跳转到下一页
     * @author hexinting
     * @lastEditors hexinting
     * @lastEditTime 2020-09-07
     */
    noSave() {
      this.isShowReminderDialog = false; // 不保存 关闭弹窗
      this.selectedName = this.activeTabName; // 不保存 取中间媒介的值 跳转到下一页
      this.isUpdateData = false; // 不保存 初始化值
      this.isNeedSave = false; // 不保存
      console.log("不保存，关闭弹窗");
      console.log("当前tab", this.selectedName, this.activeTabName);
    },
    /**
     * @param
     * @description 取消按钮(取消保存排班管理的内容) 停留在排班管理页面
     * @author hexinting
     * @lastEditors hexinting
     * @lastEditTime 2020-09-07
     */
    offSave() {
      this.activeTabName = "排班管理"; // 取消按钮  停留在排班管理页面
      this.selectedName = "排班管理"; // 取消按钮  停留在排班管理页面
      this.isShowReminderDialog = false; // 取消保存，关闭弹窗
      this.$refs.navBar.activeTabHandle();
      console.log("当前tab", this.selectedName, this.activeTabName);
      console.log("取消保存，关闭弹窗");
    },
    /**
     * @param
     * @description 保存(取消保存排班管理的内容) 保存成功跳到下一页
     * @author hexinting
     * @lastEditors hexinting
     * @lastEditTime 2020-09-07
     */
    yesSave() {
      this.selectedName = this.activeTabName; // 赋值
      this.isNeedSave = true; // 保存成功
      this.isShowReminderDialog = false; // 保存成功关闭弹窗
      this.isUpdateData = false; // 保存成功，初始化
      console.log("当前tab", this.selectedName, this.activeTabName);
      console.log("确认保存，关闭弹窗");
    },
    /**
     * @param {Boolean} isNeedSave 排班管理内容改变 是否需要保存 true 要更新；false 不用更新
     * @description 判断数据是否保存更新，未保存就跳转页面，需要提醒
     * @author hexinting
     * @lastEditors hexinting
     * @lastEditTime 2020-09-07
     */
    updateData(isNeedSave) {
      this.isUpdateData = isNeedSave;
      if (!isNeedSave) {
        this.isNeedSave = false;
      }
      console.log("收到更新了");
      console.log("-------是否要保存：", isNeedSave);
    },
  },
};
</script>

<style>
</style>
