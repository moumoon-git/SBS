<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-input class="search" v-model="value3" placeholder="请输入公告关键字" clearable size="small"></el-input>
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="value4"
          unlink-panels
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button @click="searchHandle()" type="primary" size="small">查询</el-button>
        <el-button @click="addOrUpdateHandle()" type="primary" size="small">新增</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: [],

  data() {
    return {
      //搜索数据
      value3: "",
      value4: ""
    };
  },

  methods: {
    addOrUpdateHandle() {
      this.$emit("addOrUpdateHandle");
    },
    searchHandle() {
      this.$emit("searchHandle", this.value3, this.value4);
    }
  }
};
</script>

