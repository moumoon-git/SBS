<template>
	<el-table ref="table" :data="tableData"   highlight-current-row @selection-change="handleSelectionChange" border @row-dblclick="handleRowDblclick" :row-class-name="tableRowClassName">
		<!--<el-table-column v-for="(item, key) in tableKey" :key="key" :label="item.label" :prop="item.prop" :width="item.width" :resizable="true"></el-table-column>-->
		<el-table-column prop="title" label="备案名称"></el-table-column>
		<el-table-column prop="versionNo" label="版本号"></el-table-column>
		<el-table-column prop="publishDate" label="发布时间"></el-table-column>
		<el-table-column prop="dept.name" label="上报单位"></el-table-column>
		<el-table-column prop="reportStatus" label="状态">
			<template slot-scope="scope">
                <span v-if="scope.row.reportStatus==1">{{'通过'}}</span>
				<span v-else-if="scope.row.reportStatus==2">{{'驳回'}}</span>
				<span v-else>{{'待审核'}}</span>
            </template>
		</el-table-column>
		<el-table-column label="操作" width="300" :resizable="false" min-width="300" fixed="right">
			<template slot-scope="scope">
				<el-button :disabled="scope.row.reportStatus == '1' || scope.row.reportStatus == '2' ? true : false" type="warning" size="mini" @click="handleUpdate(scope.row.id)">审核</el-button>
				<el-button type="info" size="mini" @click="handleDetail(scope.row.id)">查看</el-button>
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
