<template>
	<el-table ref="table" :data="tableData" highlight-current-row @selection-change="handleSelectionChange" border @row-dblclick="handleRowDblclick" :row-class-name="tableRowClassName">
		<el-table-column prop="title" label="备案名称" />
		<el-table-column prop="versionNo" label="版本号" />
		<el-table-column prop="publishDate" label="发布时间" />
		<el-table-column v-if="!isHighest" prop="reportStatus" label="审批状态">
			<template slot-scope="scope">
                <span v-if="scope.row.reportStatus==1">
					<div>已通过</div>
					<div>备注:{{ scope.row.reportRemark }}</div>
				</span>
				<span v-else-if="scope.row.reportStatus==2">
					<div>已驳回</div>
					<div>备注:{{ scope.row.reportRemark }}</div>
				</span>
				<span v-else>待审批</span>
            </template>
		</el-table-column>
		<el-table-column label="操作" width="240" :resizable="false" min-width="240" fixed="right">
			<template slot-scope="scope">
				<el-button type="info" size="mini" @click="handleDetail(scope.row.id)">查看</el-button>
				<el-button v-if="!isMyself && scope.row.reportStatus == 0" type="primary" size="mini" @click="handleReport(scope.row.id)" style="height: 28px !important;">审批</el-button>
				<el-button v-if="isMyself" type="primary" size="mini" @click="handleUpdate(scope.row.id)" style="height: 28px !important;">修改</el-button>
				<el-button v-if="isMyself" type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>
</template>

<script>
	export default {
		props: ['table-data', 'table-key', 'is-myself'],
		data() {
			return {
				isHighest: false,
			}
		},
		created() {
			this.$http({
				method: 'post',
				url:  '/emergency/preparation/preplanSubordinateunits/judgeTopLevelDept',
				baseURL: window.g.ApiUrl
			}).then(res => {
				if(res.data.data) {
					this.isHighest = true;
				} else {
					this.isHighest = false;
				}
			});
		},
		methods: {
			handleSelectionChange(val) {
				this.$emit('selection-change', val);
			},
			handleRowDblclick(row, column, event){
				this.$emit('row-dblclick', row.id);
			},
			handleReport(id) {
				this.$emit('handleReport', id);
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
