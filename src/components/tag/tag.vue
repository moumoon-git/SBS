<!--
 * @Author: your name
 * @Date: 2020-12-04 15:08:05
 * @LastEditTime: 2020-12-18 19:19:37
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \GGECSd:\xuchuangxing\SJSEOS\src\components\tag\tag.vue
-->
<!--@author：yf-->
<template>
  <div>
    <el-tag
      v-for="(item, i) in dataName"
      :closable="isPlatformRoot ? true:false"
      :key="item.id || item.contactId"
      :disable-transitions="false"
      :class="`${isSelected(item.name)}`"
      @click="addman(item, i)"
      @close="handleClose(item, i)"
    >
      {{ item.name || item.value || item.mobile }}
    </el-tag>
  </div>
</template>

<script>
export default {
  name: 'Tag',
  props: ['dataName', 'idx', 'isPlatformRoot', 'selectIds'],
  data() {
    return {
      changeRed: -1, // 切换按钮颜色
    };
  },
  methods: {
    handleClose(item, i) {
      this.$emit('handleClose', item, i, this.idx);
    },
    addman(item, i) {
      this.$emit('addman', item, i, this.dataName);
    },
    isSelected(id) {
      if (this.selectIds.includes(id)) {
        return 'selected';
      }
      return '';
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
  .selected{
      border:1px solid #0091ff !important;
      background:#ecf4ff !important;
      color:#0091ff !important;
  }
</style>
