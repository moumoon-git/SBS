<template>
  <div>
    <el-pagination
      :background="pageConfig.background"
      :small="pageConfig.small"
      :current-page.sync="pageConfig.currentPage"
      :hide-on-single-page="pageConfig.totalPages < 1"
      :pager-count="5"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      :layout="layout"
      :total="pageConfig.total">
    </el-pagination>
  </div>

</template>

<script>
  export default {
    name: "myPagination",
    props:{
      pageConfig:{
        type: Object,
        default: null,
      },
      layout:{
        type: String,
        default: 'total, prev, pager, next, sizes, jumper'
      }
    },
    data(){
        return{

        }
    },
    methods:{
      // 100条/页改变
      handleSizeChange(val){
        this.$emit('sizeChange',val)
      },
      // 页码改变
      handleCurrentChange(val){
        this.$emit('currentChange',val)
      }
    }
  }
</script>

<style scoped>

</style>
