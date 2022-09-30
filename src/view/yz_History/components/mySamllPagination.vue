<template>
  <div class="mySamllPagination">
    <template v-if="samllPageConfig.totalPages > 0">
      <div class="total_box">
        / {{samllPageConfig.totalPages}}
      </div>
      <el-pagination
        :current-page.sync="samllPageConfig.currentPage"
        @current-change="handleSamllCurrentChange"
        :total="samllPageConfig.total"
        :page-size="samllPageConfig.pageSize"
        small
        layout="prev,jumper,next">
      </el-pagination>
    </template>
  </div>
</template>

<script>
  export default {
    name: "mySamllPagination",
    props:{
      samllPageConfig: {
        type: Object,
        default: null
      }
    },
    data(){
        return{

        }
    },
    methods:{
      // 页码改变
      handleSamllCurrentChange(val){
        this.$emit('samllCurrentChange',val)
      }
    }
  }
</script>

<style scoped>
  .mySamllPagination{
    width: 205px;
    position: relative;
    display: inline-block;
  }
  .total_box{
    font-size:14px;
    position: absolute;
    top: 3px;
    left: 117px;
  }

>>>.el-pagination__jump{
  color: transparent;
  font-size: 0!important;
  margin-right: 50px;
}
</style>
