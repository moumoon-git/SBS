<template>
	<div class="sv-template__container">
		<slot name="left__container">
			<div
				:class="[
				'left__container',
				{ left__collapse: leftCollaspe }
				]"
			>
				<div
					class="left__collapse__button"
					@click="
						leftCollaspe = !leftCollaspe;
						$emit('collapse', leftCollaspe);
					"
				/>
				<slot name="left__content">
					<!-- 树形控件 -->
					<div
						v-loading="treeLoading"
						class="left__tree sv-tree"
						element-loading-spinner="sv-loading"
					>
						<el-tree
						ref="tree"
						node-key="id"
						:data="leftTreeList"
						:props="treeProps"
						:highlight-current="true"
						:current-node-key="0"
						@node-click="handleLeftNode"
						>
						<div
							slot-scope="{ node, data }"
							class="sv-tree-node"
						>
							<div class="label">{{ node.label }}</div>
						</div>
						</el-tree>
					</div>
				</slot>
			</div>
		</slot>
		<div class="middle__all">
			<!-- 【插槽】整个中间栏 -->
			<slot name="middle__container">
				<div class="middle__container">
					<div class="middle__header">
						<!-- 页面标题 -->
						<slot name="middle__title">
							<span class="middle__header__title">接入系统</span>
						</slot>
						<!-- 【插槽】头部所有操作框和按钮 -->
						<slot name="middle__operation">
							<slot name="middle__operation__button">
								<sv-button
								type="primary"
								@click="addNewSystem"
								>新增</sv-button>
							</slot>
						</slot>
					</div>
					<div class="middle__table sv-table">
						<el-table
							ref="table"
							v-loading="tableLoading"
							:data="tableData"
							:tree-props="tableTreeProps"
							:row-key="tableTreeProps.id || 'id'"
							border
							element-loading-spinner="sv-loading"
							height="100%"
							@row-click="handleRowClick"
						>
						<template slot="empty">
							<img
								class="sv-table__empty"
								alt="暂无数据"
								src="../../../../sinvieUI/img/table_empty.svg"
							>
							<p>暂无数据</p>
						</template>
						<el-table-column
							label="序号"
							type="index"
							header-align="center"
							align="center"
							width="55px"
						/>
							<el-table-column
								align="center"
								prop="name"
								show-overflow-tooltip
								:resizable="false"
								label="系统名称"
								sortable
							></el-table-column>
							<el-table-column
								align="center"
								prop="chargeUnit"
								show-overflow-tooltip
								:resizable="false"
								label="主管单位"
							></el-table-column>
							<el-table-column
								align="center"
								prop="netType"
								show-overflow-tooltip
								:resizable="false"
								label="网络类型"
							></el-table-column>
							<el-table-column
								align="center"
								prop="loginType"
								show-overflow-tooltip
								:resizable="false"
								label="登录方式"
							></el-table-column>
							<el-table-column
								align="center"
								prop="remark"
								show-overflow-tooltip
								:resizable="false"
								label="备注"
							></el-table-column>
							<el-table-column
								align="center"
								prop="name"
								show-overflow-tooltip
								:resizable="false"
								label="操作"
							>
								<template slot-scope="scope">
									<span>
										<!-- 编辑 -->
										<img
											style="width: 20px; height: 20px;cursor:pointer;"
											src="./assets/edit.svg"
											@click.stop="editSystem(scope.row)"
										>
									</span>
									<span>
										<!-- 删除 -->
										<img
											style="width: 20px; height: 20px;cursor:pointer;"
											src="./assets/delete.svg"
											@click.stop="deleteSystem(scope.row)"
										>
									</span>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<div class="middle__footer sv-pagination">
						<el-pagination
							:total="total"
							:current-page="currentPage"
							:page-size="pageSize"
							:page-sizes="pageSizes"
							layout="total, prev, pager, next, sizes, jumper"
							@size-change="handleSizeChange"
							@current-change="handleCurrentChange"
						/>
					</div>
				</div>
			</slot>
		</div>

		<!-- 弹窗 -->
		<el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="700px" center style="min-height: 6000px;" :close-on-click-modal="false">
			<div style="height: 400px;">
				<el-form
					:model="dataForm"
					ref="dataForm"
					label-width="100px"
					:rules="rules"
				>
					<el-form-item label="系统名称" prop="name">
						<el-input v-model="dataForm.name" placeholder="请输入系统名称"></el-input>
					</el-form-item>
					<el-form-item label="所属领域" prop="parentId">
						<el-select
							v-model="dataForm.parentId"
							placeholder="请选择领域"
							size="mini"
							width="50"
						>
							<el-option
								v-for="item in areaOptions"
								:key="item.id"
								:label="item.name"
								:value="item.id"
								style="padding-left:14px;"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="主管单位" prop="unit">
						<el-input v-model="dataForm.unit" placeholder="请输入主管单位"></el-input>
					</el-form-item>
					<el-form-item label="网络类型" prop="net">
						<el-input v-model="dataForm.net" placeholder="请输入网络类型"></el-input>
					</el-form-item>
					<el-form-item label="登录方式" prop="login">
						<el-input v-model="dataForm.login" placeholder="请输入登录方式"></el-input>
					</el-form-item>
					<el-form-item label="备注" prop="remark">
						<el-input v-model="dataForm.remark" placeholder="备注信息"></el-input>
					</el-form-item>
				</el-form>
				<div style="position:absolute; right:10px; bottom:10px;">
					<el-button type="plain" @click="dialogVisible=false">取消</el-button>
					<el-button type="primary" @click="submit">确定</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'thirdParty',
	props: {
		// 左边栏-树形数据结构配置
		treeProps: {
		type: Object,
		default: () => ({
			children: 'children',
			label: 'name',
			value: 'id',
			disabled: (data) => data.id === 0 || data.id === '0',
		}),
		},
		tableTreeProps: {
		type: Object,
		default: () => ({
			children: 'children',
			hasChildren: 'hasChildren',
			id: 'id',
		}),
		},
	},
	data() {
		return {
			dialogTitle: '',
			dialogVisible: false,
			leftTreeList: [],
			currArea: null, // 当前左侧的领域
			tableData: [],
			areaOptions: [], // 所属领域数组
			isEdit: false,
			dataForm: {
			id: 0,
			parentId: 0,
			name: '',
			unit: '',
			net: '',
			login: '',
			remark: '',
			},
			// 单位信息判断
			rules: {
				name: [
					{ required: true, message: '不能为空', trigger: 'blur' },
				],
			},
			currentPage: 1, // 当前页数
			pageSize: 10, // 每页条数
			pageSizes: [10], // 可选条数
			total: 0,
			// 树形数据请求中
			treeLoading: false,
			// 左边栏折叠
			leftCollaspe: false,
			// 表格数据请求中
			tableLoading: false,
		};
	},
	mounted() {
		// 获取树形数据
		this.init();
	},
	methods: {
		handleLeftNode(data) {
			this.currArea = data;
			this.currentPage = 1; // 回到第一页
			this.$http({
				method: 'post',
				url: window.SITE_CONFIG['baseUrl'] + '/third/thirdSystem/listPage',
				data: {
					page: this.currentPage,
					limit: this.pageSize,
					groupId: data.id,
				}
			}).then(res => {
				if(res.data.errorcode === 0 || res.data.code === 0) {
					this.tableData = res.data.page.list;
					this.total = res.data.page.totalCount;
				}
			});
		},
		handleSizeChange(val) {
			this.pageSize = val;
		},
		handleCurrentChange(val) {
			this.currentPage = val;
			this.$http({
				method: 'post',
				url: window.SITE_CONFIG['baseUrl'] + '/third/thirdSystem/listPage',
				data: {
					page: this.currentPage,
					limit: this.pageSize,
					groupId: this.currArea.id,
				}
			}).then(res => {
				if(res.data.errorcode === 0 || res.data.code === 0) {
					this.tableData = res.data.page.list;
					this.total = res.data.page.totalCount;
				}
			});
		},
		handleRowClick(row) {
			if (row.loginType === '') {
				this.$message({
					type: "warning",
					message: "当前选中项没有登录方式，不能跳转"
				});
				return;
			}
			const a = document.createElement('a');
			a.href = row.loginType;
			a.target = '_blank';
			a.click();
		},
		addNewSystem() {
			this.dialogVisible = true;
			this.isEdit = false;
			this.dialogTitle = '新增接入系统';
			this.dataForm.id = 0;
			this.dataForm.parentId = this.currArea.id;
			this.dataForm.name = '';
			this.dataForm.unit = '';
			this.dataForm.net = '';
			this.dataForm.login = '';
			this.dataForm.remark = '';
		},
		editSystem(row) {
			this.dialogVisible = true;
			this.isEdit = true;
			this.dialogTitle = '修改接入系统';
			this.$http({
				method: 'get',
				url: window.SITE_CONFIG['baseUrl'] + '/third/thirdSystem/info',
				params: {
					id: row.id,
				}
			}).then(res => {
				if(res.data.errorcode === 0 || res.data.code === 0) {
					this.dataForm.id = res.data.data.id;
					this.dataForm.parentId = res.data.data.groupId;
					this.dataForm.name = res.data.data.name;
					this.dataForm.unit = res.data.data.chargeUnit;
					this.dataForm.net = res.data.data.netType;
					this.dataForm.login = res.data.data.loginType;
					this.dataForm.remark = res.data.data.remark;
				}
			});
		},
		deleteSystem(row) {
			this.$confirm("是否删除选中该条数据?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			}).then(() => {
				this.$http({
					method: 'post',
					url: window.SITE_CONFIG['baseUrl'] + '/third/thirdSystem/delete',
					data: [row.id],
				}).then(res => {
					if(res.data.errorcode === 0 || res.data.code === 0) {
						this.$message({
							type: "success",
							message: "删除成功"
						});
						this.handleLeftNode(this.currArea);
					}
				});
			}).catch(() => {
				this.$message({
					type: "info",
					message: "已取消删除"
				});
			});
		},
		init() {
			this.treeLoading = true;
			this.$http({
				method: 'get',
				url: window.SITE_CONFIG['baseUrl'] + '/third/thirdSystemGroup/list',
			}).then(res => {
				if(res.data.errorcode === 0 || res.data.code === 0) {
					this.treeLoading = false;
					this.leftTreeList = res.data.data;
					this.areaOptions = res.data.data;
					if (this.currArea) this.handleLeftNode(this.currArea);
					else this.handleLeftNode(res.data.data[0]);
				}
			});
		},
		submit() {
			this.$refs["dataForm"].validate((valid) => {
				if (valid) {
					if (this.isEdit) {
						this.$http({
							method: 'post',
							url: window.SITE_CONFIG['baseUrl'] + '/third/thirdSystem/update',
							data: {
								id: this.dataForm.id,
								name: this.dataForm.name,
								chargeUnit: this.dataForm.unit,
								groupId: this.dataForm.parentId,
								netType: this.dataForm.net,
								loginType: this.dataForm.login,
								remark: this.dataForm.remark,
							}
						}).then(res => {
							if(res.data.errorcode === 0 || res.data.code === 0) {
								this.$message({
									type: "success",
									message: "保存成功"
								});
								this.dialogVisible = false;
								this.handleLeftNode(this.currArea);
							}
						});					
					} else {
						this.$http({
							method: 'post',
							url: window.SITE_CONFIG['baseUrl'] + '/third/thirdSystem/save',
							data: {
								groupId: this.dataForm.parentId,
								name: this.dataForm.name,
								chargeUnit: this.dataForm.unit,
								netType: this.dataForm.net,
								loginType: this.dataForm.login,
								remark: this.dataForm.remark,
							}
						}).then(res => {
							if(res.data.errorcode === 0 || res.data.code === 0) {
								this.$message({
									type: "success",
									message: "新增成功"
								});
								this.dialogVisible = false;
								this.handleLeftNode(this.currArea);
							}
						});
					}						
				}
			});
		},
	},
};
</script>

<style src='../../../../sinvieUI/sv_template/sv_template.scss' lang="scss" />