<template>
  <div class="operation-container">
    <div class="input-group">
      <el-input
        placeholder="请输入姓名/电话号码/职务搜索"
        size="small"
        v-model.trim="searchTxt"
        clearable
        class="input-with-select search-input"
      >
        <el-button slot="append" icon="el-icon-search" @click="search">
        </el-button>
      </el-input>
      <el-button type="primary" size="mini" @click="showStatistics"
        >排班统计</el-button
      >
    </div>
    <div class="button-group">
      <!-- <template v-if="currentShiftIdx == 0">
        <el-date-picker
          v-model="month"
          size="small"
          type="month"
          placeholder="选择月"
          :clearable="false"
          value-format="yyyy-MM"
        >
        </el-date-picker>
        <el-button type="primary" size="mini" @click="exportShift"
          >导出</el-button
        >
      </template> -->
      <el-button type="primary" size="mini" @click="showSetting"
        >人员设置</el-button
      >
      <el-button type="primary" size="mini" @click="showScheduling"
        >排班挂起</el-button
      >
    </div>
  </div>
</template>
<script>
export default {
  name: "Operation",
  data() {
    return {
      month: "", // 年月
      searchTxt: "", // 搜索框值
    };
  },
  props: {
    currentShiftIdx: {
      type: Number,
    },
  },
  mounted() {
    // 获取当年当月
    this.getCurrentMonth();
  },
  methods: {
    // 获取当年当月
    getCurrentMonth() {
      var time = new Date();
      var year = time.getFullYear(); //得到年份
      var m = time.getMonth() + 1; //得到月份
      m = m < 10 ? "0" + m : m;
      this.month = year + "-" + m;
    },
    // 更改年月份
    changeMonth() {
      this.$emit("changeMonth", this.month);
    },
    // 搜索
    search() {
      this.$emit("search", this.searchTxt);
    },
    // 导出默认第一个班次
    exportShift() {
      this.$emit("exportShift", this.month);
    },
    // 显示人员设置弹窗
    showSetting() {
      this.$emit("showSetting");
    },
    // 显示排班挂起弹窗
    showScheduling() {
      this.$emit("showScheduling");
    },
    // 显示排班统计弹窗
    showStatistics() {
      this.$emit("showStatistics");
    },
    // 清空输入框的值
    clear() {
      this.$emit("search");
    },
  },
};
</script>
<style scoped>
.operation-container {
  background: #f9fbff;
  display: flex;
  justify-content: space-between;
}
.input-group {
  margin: 10px;
}
/deep/ .input-group .search-input .el-input-group__append {
  background-color: #3f92fe !important;
  color: #ffffff !important;
  border: none !important;
}
.search-input {
  width: 340px;
  margin-left: 10px;
}
.button-group {
  margin: 10px;
}
</style>