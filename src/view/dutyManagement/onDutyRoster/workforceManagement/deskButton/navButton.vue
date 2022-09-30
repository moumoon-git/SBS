<template>
  <div class="navsBar">
    <div class="dateSelect">
      <el-date-picker
        v-model="month"
        type="month"
        placeholder="选择月"
        @change="changeMonth"
        :clearable="false"
      />
      <!-- <grade-dropDown
        style="float:left;padding-top:0;margin-right: 10px;"
        @operationChange="operationChange"
      /> -->
    </div>
    <!-- <div class="buttonGroup"> -->
    <el-button
      type="primary"
      @click="autoScheduling"
    >
      月自动排班
    </el-button>
    <!-- <el-button type="primary" @click="weekDuling">周自动排班</el-button> -->
    <el-button
      type="primary"
      @click="Reset"
    >
      重置排班
    </el-button>
    <!-- <el-button type="primary" @click="setup">设置人员</el-button> -->
    <!-- <el-button type="primary" @click='lastMonth'>沿用上月排班</el-button> -->
    <!-- <el-button type="primary" @click='saveScheduling'>保存排班</el-button>
    <el-button type="primary" @click='notification'>短信通知</el-button> -->
    <!-- </div> -->
  </div>
</template>

<script>
import dateSelect from "@/view/dutyManagement/logBook/dutyLog/monthDateSelect/monthDateSelect";
// import monthAutoScheduling from "@/view/dutyManagement/onDutyRoster/workforceManagement/deskButton"
// import GradeDropDown from '@/views/common/GradeDropDown.vue';

export default {
  name: "navButton",
  components: {
    dateSelect,
    // GradeDropDown,
  },
  data() {
    return {
      month: '',
      // isPlatformRoot: '',
    };
  },
  mounted() {
    this.month = new Date();
  },
  methods: {
    // 是否选择的是本平台
    // operationChange(isPlatformRoot, platformId) {
    //   this.isPlatformRoot = isPlatformRoot;
    //   this.$emit('platformChange', isPlatformRoot, platformId);
    // },
    Reset() {
      const date = new Date().formatDate('yyyy-MM');
      const currentMonth = new Date(date);
      const month = this.month.formatDate('yyyy-MM');
      const checkMonth = new Date(month);
      if (currentMonth <= checkMonth) {
        this.$emit('Reset');
      } else {
        this.$message.error('历史排班不可修改');
      }
    },
    saveScheduling() {
      this.$emit("saveScheduling");
    },
    notification() {
      this.$emit("notification");
    },
    autoScheduling() {
      let date = new Date().formatDate("yyyy-MM");
      let currentMonth = new Date(date);
      // console.log('currentMonth: ', currentMonth);
      let month = this.month.formatDate("yyyy-MM");
      // console.log('this.month: ', this.month);
      let checkMonth = new Date(month);
      // console.log('checkMonth: ', checkMonth);
      if (currentMonth <= checkMonth) {
        this.$emit("autoScheduling");
      } else {
        this.$message.error("请选择当前或之后的月份进行排班");
      }
    },
    weekDuling() {
      this.$emit("weekDuling");
    },
    setup() {
      this.$emit("setup");
    },
    changeMonth() {
      this.$emit("changeMonth", this.month);
    },
    lastMonth() {
      this.$emit("lastMonth");
    },
  },
};
</script>

<style scoped>
.navsBar {
  width: 100%;
  background-color: white;
  border: 1px solid rgba(219, 219, 219, 1);
  border-radius: 3px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px;
}

.dateSelect {
  flex: 3;
  display: flex;
  justify-content: flex-start;
  text-indent: 10px;
}

.buttonGroup {
  flex: 7;
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;
}

.buttonGroup >>> .el-button {
  padding: 10px 20px;
}

>>> .el-date-editor {
  width: 160px;
}

>>> .el-input__inner {
  line-height: 36px;
  height: 36px;
  padding-left: 55px;
}
</style>
