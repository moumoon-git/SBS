<template>
  <el-table ref="singleTable" :data="tableData" highlight-current-row
            :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
            @current-change="handleCurrentChange"
            @row-click="handleRowClick"
            max-height="586px"
            >
    <el-table-column type="index" width="50" :resizable="false"></el-table-column>
    <el-table-column min-width="160" v-for="(item,key) in tableColumn" :key="key" :label="item.label" :prop="item.prop"
                     :formatter="item.formatter"
                     :width="item.width" :resizable="false"></el-table-column>
    <el-table-column label="操作" :resizable="false">
      <template slot-scope="scope">
        <el-button type="info" size="mini" @click="handleConnection(scope.row)">连线</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    name: "videoGroupingTable",
    props: ["tableColumn", "tableData"],
    methods: {
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      //表格行点击方法
      handleRowClick(row){
        this.$emit('handleRowClick',row);
      },
      handleConnection() {

      }
    }
  }
</script>

<style scoped>
  >>> .el-table__body tr.current-row > td {
    color: #479DFF;
  }

  >>>.el-table--enable-row-hover .el-table__body tr.hover>td{
    background-color: #E3F0FF !important;
  }


</style>
