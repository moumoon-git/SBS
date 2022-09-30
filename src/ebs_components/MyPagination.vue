<!--
 * @Author: your name
 * @Date: 2021-03-16 11:27:52
 * @LastEditTime: 2021-03-17 19:54:28
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \EBS_V2.6d:\SBS\src\ebs_components\MyPagination.vue
-->
<!--
 * @author: author
 * @date: date
 * @version: version
 * @lastEditors: lastEditors
 * @lastEditTime: lastEditTime
 * @descripttion: descripttion
-->
<template>
  <div class="pagination-style">
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      @current-change="handleCurrentChange"
      background
      layout="total, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props: ['total', 'current-page', 'page-size'],
  data () {
    return {
    }
  },
  methods: {
    handleCurrentChange: function (val) {
      this.$emit('handle-current-change', val);
    }
  }
}
</script>

<style scoped>
.pagination-style {
    text-align: center;
    margin: 10px;
    position: relative;
}
</style>
