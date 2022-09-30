<!--
 * @Author: your name
 * @Date: 2021-04-11 14:55:58
 * @LastEditTime: 2021-08-18 15:04:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \xuchuangxing\SJSEOS\src\view\dutyManagement\RollCallOnDuty\rollCallNotice.vue
-->
<template>
  <div>
    <el-dialog
      :title="rollCallNoticeTitle"
      :visible.sync="noticeDialogVisible"
      width="890px"
      :before-close="noticeHandleClose"
      top="10vh"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="点名时间">
          <el-col :span="11">
            <el-date-picker
              placeholder="选择点名日期"
              v-model="rollCallDate"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              style="width: 100%;"
              type="date"
              :picker-options="datePickerOptions"
              @change="changeDate"
            ></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker
              placeholder="选择点名时间"
              v-model="rollCallTime"
              style="width: 100%;"
              value-format="HH:mm"
              format="HH:mm"
              :picker-options="timePickerOptions"
            ></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="通知对象">
          <el-col :span="24" style="max-height:130px;overflow:auto;">
            <!-- <el-checkbox
              :indeterminate="isPositionIndeterminate"
              v-model="checkAllPosition"
              @change="CheckAllPositionChange"
              >全选</el-checkbox
            > -->
            <el-checkbox-group
              v-model="noticePosition"
              @change="positionOrDuty"
            >
              <el-checkbox
                :label="item.id"
                name="type"
                v-for="item in notificePositionArr"
                :key="item.id"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-col>
          <el-col :span="24" style="max-height:130px;overflow:auto;">
            <el-checkbox v-model="beOnDutyState" @change="positionOrDuty"
              >值班员</el-checkbox
            >
          </el-col>
        </el-form-item>
        <el-form-item label="短信通知模板">
          <el-input
            type="textarea"
            v-model="form.smsTemplate"
            resize="none"
          ></el-input>

          <div style="margin-top:5px;">
            <el-checkbox v-model="needCall"></el-checkbox>
            <el-select
              v-model="form.callDuration"
              placeholder="请选择"
              :disable="!needCall"
              class="callDuration"
              style="height:20px;"
            >
              <el-option
                v-for="item in callDurationOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            未回复自动进行电话追呼
          </div>
        </el-form-item>
        <el-form-item label="通知名单预览">
          <el-table :data="noticeList" border style="width: 100%" height="306">
            <el-table-column prop="dept" label="单位" align="center">
            </el-table-column>
            <el-table-column label="人员名称" align="center">
              <template slot-scope="scope">
                <span
                  v-for="(item, index) in scope.row.contactors"
                  :key="item.contactorId"
                >
                  {{
                    item.contactor +
                      (index == scope.row.contactors.length - 1 ? "" : ",")
                  }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmNotice">下发通知</el-button>
      </span>
    </el-dialog>

    <!-- 选择职务弹窗 -->
    <position-tree
      ref="positionTree"
      v-if="positionVisible"
      @confirmPosition="confirmPosition"
      :positionData="positionData"
      @closePositionDialog="positionVisible = false"
    />
  </div>
</template>

<script>
import positionTree from "@/components/positionTree"; // 选择职务弹窗
export default {
  name: "Rollcallnotice",
  components: {
    positionTree
  },
  props: {
    date: {
      type: String
    },
    unitData: {
      type: Array
    },
    selectTemplate: {
      type: Object
    }
  },
  data() {
    return {
      noticeDialogVisible: true, // 弹窗显示
      rollCallNoticeTitle: "", // 弹窗标题
      form: {
        sendTime: "",
        contactRelList: [], // 要通知的职位或值班员
        smsTemplate: "", // 短信通知模板
        saveNeedCall: 0, // 追呼状态
        callDuration: "1" // 追呼时长
      },
      needCall: false,
      rollCallDate: new Date().formatDate("yyyy-MM-dd"), // 点名日期
      rollCallTime: new Date().formatDate("hh:mm"), // 点名时间
      noticePosition: [], // 通知对象-职位
      beOnDutyState: false, // 通知对象-值班员默认不选择
      notificePositionArr: [],
      noticeList: [],
      noticeListColumn: [
        { prop: "dept", label: "单位" },
        { prop: "contactors", label: "人员名称" }
      ],
      callDurationOptions: [
        {
          value: "1",
          label: "1分钟"
        },
        {
          value: "3",
          label: "3分钟"
        },
        {
          value: "5",
          label: "5分钟"
        },
        {
          value: "10",
          label: "10分钟"
        }
      ],
      datePickerOptions: {
        disabledDate(time) {
          let _now = Date.now();
          console.log("_now: ", _now);
          //   console.log("time: ", time);
          return time.getTime() < _now - 86400000; //小于当前日期的禁止
        }
      },
      timePickerOptions: {
        selectableRange: new Date().formatDate("hh:mm:ss") + " - 23:59:59"
      }, //小于当前时间的禁止
      positionVisible: false, // 是否显示职务弹窗
      positionData: [], // 所有职务数据
      groupIds: [], //所有单位组Id
      isPositionIndeterminate: false,
      checkAllPosition: false //默认岗位不全选
    };
  },
  watch: {
    rollCallDate(newVal, oldVal) {
      //   console.log("newVal: ", newVal);
      //   console.log("oldVal: ", oldVal);
      //   console.log("this.form.smsTemplate: ", this.form.smsTemplate);
      //   console.log(
      //     "this.form.SMSTemplate.replace(oldVal, newVal);: ",
      //     this.form.SMSTemplate.replace(oldVal, newVal)
      //   );
      this.form.smsTemplate = this.form.smsTemplate.replace(oldVal, newVal); // 短信通知模板中日期替换
    },
    rollCallTime(newVal, oldVal) {
      //   console.log("newVal: ", newVal);
      //   console.log("oldVal: ", oldVal);
      //   console.log("this.form.smsTemplate: ", this.form.smsTemplate);
      //   console.log(
      //     "this.form.smsTemplate.replace(oldVal, newVal);: ",
      //     this.form.smsTemplate.replace(oldVal, newVal)
      //   );
      this.form.smsTemplate = this.form.smsTemplate.replace(oldVal, newVal); // 短信通知模板中时间替换
    },
    unitData(newVal, oldVal) {
      let checkData = oldVal.filter(x =>
        newVal.some(y => y.deptId == x.deptId)
      ); // 判断之前的deptId集合是否和现在相等
      //   不是的话清除名单预览的数据 取消值班员勾选
      console.log("checkData: ", checkData);
      if (checkData.length != oldVal.length) {
        this.noticeList = [];
        this.beOnDutyState = false;
      }
      console.log("newVal: ", newVal);
      console.log("oldVal: ", oldVal);
    }
  },
  mounted() {
    // console.log("this.unitData: ", this.unitData);
    this.form.smsTemplate = `各单位负责人，大家好，${this.rollCallDate +
      " " +
      this.rollCallTime}将进行点名，请各单位人员准时参加`;

    this.postData(); // 获取所有岗位
  },
  methods: {
    /**
     * @description: 关闭点名通知
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/11
     * @param {*}
     * @return {*}
     */

    noticeHandleClose() {
      this.$emit("noticeHandleClose");
    },
    /**
     * @description: 确认下发通知
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/11
     * @param {*}
     * @return {*}
     */
    async confirmNotice() {
      if (!this.rollCallDate || !this.rollCallTime) {
        this.$message.warning("请输入完整日期");
        return;
      }
      this.form.sendTime = this.rollCallDate + " " + this.rollCallTime + ":00";
      //   console.log("this.form: ", this.form);
      if (!this.beOnDutyState && this.noticePosition.length == 0) {
        this.$message.warning("请选择岗位或者值班员");
        return;
      }
      //   console.log("this.noticeList: ", this.noticeList);
      if (this.noticeList.length == 0) {
        this.$message.warning("请选择有联系人的岗位或者值班员");
        return;
      }
      this.form.saveNeedCall = this.needCall ? 1 : 0;
      this.form.contactRelList = this.noticeList;
      this.$emit("confirmNotice", this.form);
    },
    /**
     * @description: 获取职务数据
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/12
     * @param {*}
     * @return {*}
     */
    async getTreeData() {
      let tree = [];
      let data = {};
      await this.$api.contactorPosition(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        for (let i = 0; i < res.data.length; i++) {
          tree.push({
            name: res.data[i]
          });
        }
        this.positionData = tree;
        // console.log("this.positionData: ", this.positionData);
      });
    },
    /**
     * @description: 打开职务弹窗 存在的数据勾选上
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/12
     * @param {*}
     * @return {*}
     */
    async selectPositionHandle() {
      await this.getTreeData();
      this.positionVisible = true;
      //   console.log("this.positionData: ", this.positionData);
      this.$nextTick(() => {
        let defaultChecked = this.notificePositionArr.map(v => {
          return v.name;
        });
        this.$refs.positionTree.defaultChecked = defaultChecked;
        this.$refs.positionTree.positionArr = this.notificePositionArr;
      });
    },
    /**
     * @description: 选完职务后 删除原始数据中和选中职务相同的数据
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/12
     * @param {*}
     * @return {*}
     */
    confirmPosition(data) {
      console.log("data: ", data);
      console.log("this.noticePosition: ", this.noticePosition);
      let checkData = this.noticePosition.filter(x =>
        data.some(y => y.name == x)
      ); // 之前选中判断是否被取消勾选
      //   是的话清除名单预览的数据 取消岗位全选 半选
      if (checkData.length < this.noticePosition.length) {
        this.noticeList = [];
        this.isPositionIndeterminate = false;
        this.checkAllPosition = false;
      }
      this.noticePosition.length;
      this.positionVisible = false;
      //   console.log("this.notificePositionArr: ", this.notificePositionArr);
      this.notificePositionArr = data;
    },
    /**
     * @description: 岗位和部门数据请求成功后赋值操作
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/23
     * @param {*}
     * @return {*}
     */
    async positionOrDuty() {
      let noticeDutyOfficer = [];
      let noticeDutyOfficerIds = [];

      // 岗位 全选的状态变化
      this.checkAllPosition =
        this.noticePosition.length === this.notificePositionArr.length;
      this.isPositionIndeterminate =
        this.noticePosition.length > 0 &&
        this.noticePosition.length < this.notificePositionArr.length;

      if (this.beOnDutyState) {
        noticeDutyOfficer = this.unitData.filter(v => v.deptId); // 获取所有部门Id存在的对象数组
        noticeDutyOfficerIds = noticeDutyOfficer.map(v => {
          return v.deptId;
        }); // 获取所有部门Id
      } else {
        noticeDutyOfficerIds = [];
      }
      if (!this.beOnDutyState && this.noticePosition.length == 0) {
        this.noticeList = [];
        return;
      }
      let data = {
        date: this.date,
        deptIdList: noticeDutyOfficerIds,
        posts: this.noticePosition,
        groupIds: this.groupIds,
        code: this.selectTemplate.code
      };
      let res = await this.$api.getDutyAndPosition(data);
      console.log("res: ", res);
      if (res.errorcode != 0) {
        this.$message({
          message: res.msg,
          type: "error"
        });
        return;
      }
      if (res.data) {
        this.noticeList = res.data;
      } else {
        this.noticeList = [];
      }
    },
    /**
     * @description: 岗位全选按钮
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/15
     * @param {*}
     * @return {*}
     */
    async CheckAllPositionChange(val) {
      this.checkAllPosition = val;
      let allPositionCheck = this.notificePositionArr.map(v => {
        return v.name;
      });
      this.noticePosition = val ? allPositionCheck : [];
      this.isPositionIndeterminate = false;
      await this.positionOrDuty();
    },
    changeDate(val) {
      console.log("val: ", val);
      this.timePickerOptions.selectableRange =
        val > new Date().formatDate("yyyy-MM-dd")
          ? "00:00:00 - 23:59:59"
          : new Date().formatDate("hh:mm:ss") + " - 23:59:59";
    },
    /**
     * @description: 获取所有岗位下拉数据
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/4/26
     * @param {*}
     * @return {*}
     */
    postData() {
      let data = {};
      this.$api.getPostData(data).then(res => {
        console.log(res);
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.notificePositionArr = res.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.line {
  text-align: center;
}
.callDuration {
  width: 90px;
  /deep/ .el-input__inner {
    width: 100%;
    height: 25px;
    padding: 0 15px;
  }
}
.dutyCheckbox /deep/ .el-checkbox:last-of-type {
  margin-right: 30px;
}
</style>
