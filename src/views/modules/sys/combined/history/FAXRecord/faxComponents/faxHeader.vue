<template>
  <div class="faxHeader">
    <select v-model="status" @change="changeFaxType">
      <option
        v-for="(item, index) in selectData"
        :key="index"
        :value="item.value"
        :label="item.label"
        size="small"
      ></option>
    </select>

    <div style="display: flex;align-items: center;">
      <div style="white-space: nowrap;margin-right: 15px;">传真时间:</div>
      <el-date-picker
        v-model="faxTime"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        size="small"
      >
      </el-date-picker>
    </div>
    <el-input
      class="faxHeader__inp"
      v-model="search"
      placeholder="输入联系人/传真号码"
      size="small"
      suffix-icon="el-icon-search"
    ></el-input>
    <el-button
      style="margin-right: 10px;"
      @click="cx"
      type="primary"
      size="small"
      >搜索</el-button
    >
    <!--<el-button
      style="margin-right: 10px;"
      @click="exportExel"
      plain
      size="small"
      >导出</el-button
    >-->
    <!--          <button @click="blackList" class="blackLists" >电话黑名单</button>-->
  </div>
</template>
<script>
import bus from "@/utils/bus.js";
export default {
  data() {
    return {
      status: 0, // 传真类型（发送/接收）
      selectData: [
        {
          label: "接收",
          value: 0
        },
        {
          label: "发送",
          value: 1
        }
      ],

      faxTime: "", // 查询时间范围
      startTime: "", // 起始日期
      endTime: "", // 结束日期
      search: "" // 关键词检索
    };
  },

  watch: {
    faxTime: function(newValue, oldValue) {
      if (newValue) {
        this.startTime =
          newValue[0].toLocaleDateString().replace(/\//gi, "-") + " 00:00:00";
        this.endTime =
          newValue[1].toLocaleDateString().replace(/\//gi, "-") + " 23:59:59";
      } else {
        this.startTime = "";
        this.endTime = "";
      }
    }
  },

  methods: {
    changeFaxType() {
      console.log("什么钱你赶快");
      this.$emit("changeFaxType", this.status);
    },
    cx() {
      let searchParams = {
        search: this.search,
        status: this.status,
        startTime: this.startTime,
        endTime: this.endTime
      };

      bus.$emit("getSearchParams", searchParams);

      //   this.$emit("getSearchParams", searchParams);
    }
  }
};
</script>

<style lang="less">
.faxHeader {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  select {
    outline: none;
    width: 110px;
    height: 30px;
    border: 1px solid #ccc;
    background-color: #ffffff;
    border-radius: 5px;
    box-sizing: border-box;
    text-align: center;
    margin-right: 20px;
    display: block;
  }
  .faxHeader__inp {
    width: 220px;
    margin-left: 33px;
    margin-right: 10px;
  }
}
</style>
