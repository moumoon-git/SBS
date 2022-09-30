<template>
	<el-table ref="table" :data="tableData"   highlight-current-row @selection-change="handleSelectionChange" border @row-dblclick="handleRowDblclick" :row-class-name="tableRowClassName">
		<el-table-column type="selection" fixed="left" :resizable="false"></el-table-column>
		<el-table-column v-for="(item, key) in tableKey" :key="key" :label="item.label" :prop="item.prop" :width="item.width" :resizable="true"></el-table-column>
		<el-table-column label="操作" width="240" :resizable="false" min-width="240" fixed="right">
			<template slot-scope="scope">
				<el-button type="info" size="mini" @click="handleDetail(scope.row.id)">查看</el-button>
				<el-button type="primary" size="mini" @click="handleUpdate(scope.row.id)">修改</el-button>
				<el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>
</template>

<script>
	export default {
		props: ['table-data', 'table-key'],
		methods: {
			handleSelectionChange(val) {
				this.$emit('selection-change', val);
			},
			handleRowDblclick(row, column, event){
				this.$emit('row-dblclick', row.id);
			},
			handleDetail(id) {
				this.$emit('detail', id);
			},
			handleUpdate(id) {
				this.$emit('update', id);
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
			},
			tableRowClassName({row, rowIndex}){
				if (row.overhaulStatus == '过期未整顿') {
					return 'info-row';
				} 
			}
		}
	}
</script>

<style scoped>
	@import './../assets/css/common.css';
	.el-table>>>.el-table__fixed-right {
		height: 100%;
	}
	
	.el-table td, .el-table th {
		padding: 8px 0;
	}
	.el-table .info-row {
    background: #E6A23C;
  }
</style>
<style>
	.el-table .info-row {
    background: rgba(230,162,60,0.2);
  }
</style>
