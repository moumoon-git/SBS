<template>
  <el-table  ref="table" :data="tableData" border stripe @selection-change="handleSelectionChange">
    <el-table-column type="selection"  fixed="left" :resizable="false"></el-table-column>
    <el-table-column
      align="center"
      height="30"
      :fit="false"
      v-for="(item, key) in tableKey"
      :key="key" :label="item.label"
      :prop="item.prop" :width="item.width"
      :resizable="false"
      :min-width="item.width"
      show-overflow-tooltip
    >
    </el-table-column>
    <el-table-column v-if="showOperation" label="操作" width="240" :resizable="false" min-width="240" fixed="right">
      <template slot-scope="scope">
        <el-button type="info" size="mini" @click="handleDetail(scope.row)">查看</el-button>
        <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
        <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
    export default {
        name: "myTable",
        props: ['table-data', 'table-key','showOperation'],
        methods: {
        handleSelectionChange(val) {
          this.$emit('selection-change', val);
        },
        handleDetail(row) {
          this.$emit('detail', row);
        },
        handleUpdate(row) {
          this.$emit('update', row);
        },
        handleDelete(id) {
          this.$confirm('确认删除该数据？', '提示', {
            type: 'warning',
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.$emit('delete', id);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      }
    }
</script>

<style scoped>
  .el-table>>>.el-table__fixed-right {
    height: 100%;
  }
</style>
