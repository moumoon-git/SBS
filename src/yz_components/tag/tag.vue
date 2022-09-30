<!--
 * @Author: your name
 * @Date: 2020-12-02 16:55:44
 * @LastEditTime: 2020-12-18 19:25:36
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \GGECSd:\xuchuangxing\YJJEOS\src\components\tag\tag.vue
-->
<!--@author：yf-->
<template>
  <div>
    <el-tag
      :key="item.id"
      v-for="(item, i) in dataName"
      closable
      @click="addman(item, i)"
      :disable-transitions="false"
      :class="{ red: changeRed == i }"
      @close="handleClose(item, i)"
    >
      {{ item.name || item.value }}
    </el-tag>
  </div>
</template>

<script>
export default {
  name: "tag",
  props: ["dataName", "idx"],
  data() {
    return {
      changeRed: -1, //切换按钮颜色
    };
  },
  methods: {
    handleClose(item, i) {
      this.$emit("handleClose", item, i, this.idx);
    },
    addman(item, i) {
      this.$emit("addman", item, i, this.dataName);
    },
  },
};
</script>

<style scoped>
>>> .el-tag {
  min-width: 90px;
  margin: 10px 10px;
  cursor: pointer;
}
.red {
  background-color: green;
  color: white !important;
  border: 1px solid #2d8cf0;
}
.input-new-tag {
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
