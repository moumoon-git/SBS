<template>
	<el-dialog :visible.sync="visible" width="1000px" center append-to-body :close-on-click-modal="false">
		<div slot="title">{{title}}</div>
		<el-row :gutter="20">
			<el-col :span="12">
				<el-card class="candidate">
					<div slot="header" style="text-align: left;">
						<span >应急类别</span>
					</div>
					<el-scrollbar style="height: 320px;">
						<el-tree :data="caseClass" ref="tree" :render-content="renderContent" :default-expanded-keys="[indexkey]"
						  :highlight-current="highlight" :props="props" @node-click="caseClassNodeClick" node-key="id"></el-tree>
					</el-scrollbar>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card class="candidate">
					<div slot="header">
						<el-input v-model="key" placeholder="输入姓名搜索" @keyup.enter.native="onSearch">
							<el-button slot="append" icon="el-icon-search" @click="onSearch" style="padding: 12px 12px;"></el-button>
						</el-input>
					</div>
					<el-scrollbar style="height: 300px;">
						<el-tree :data="preplans" :highlight-current="highlight" :props="props" @node-click="preplanNodeClick"></el-tree>
					</el-scrollbar>
				</el-card>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<div class="submit-btn">
				<el-button size="small" type="primary" @click="handleCommit">确定</el-button>
			</div>
		</el-row>
	</el-dialog>
</template>

<script>
	export default {
		name: "PreplanSelectForm",
		inject:['reload'],
		data() {
			const data = [{
				id: 0,
				name: '应急类型',
				children: null
			}];
			return {
				visible: false,
				title: "选择应急预案",
				indexkey: 0,
				highlight: true, //树形控件是否高亮
				props: {
					label: 'name',
					children: 'children'
				},
				caseClass: JSON.parse(JSON.stringify(data)),
				preplans: [],
				caseClassId: 0,
				preplanId: null,
				preplanName: "",
				classId: 0,
				key: '',
			}
		},
		methods: {
			onSearch() {
				this.getPreplanList();
			},
			//点击应急类别节点事件
			caseClassNodeClick(data) {
				this.classId = data.id;
				this.key = '';
				this.getPreplanList();
			},
			//选择预案
			preplanNodeClick(data) {
				this.preplanId = data.id;
				this.preplanName = data.name;			
			},
			getCaseClassList() {
				this.$http('/emergency/preparation/caseClass/getTree', null).then(res => {
					if (res) {
						this.caseClass[0].children = res.data;
						this.getPreplanList()
						this.chooseTree()
					}
				})
			},
			chooseTree() {//默认选中树形
				this.$nextTick(function() {
					this.$refs.tree.setCurrentKey(0);
				})
			},
			getPreplanList() {
				let data = {
					id: this.classId,
					key: this.key
				};
				let CallbackReload=this;
				this.$http('/emergency/preparation/preplan/getPreplansByClassId', data,CallbackReload).then(res => {
					if (res) {
						this.preplans = res.data;
					}
				})
			},
			resetData() {
				this.preplans = [];
				this.caseClassId = 0;
				this.classId=0;
				this.preplanId = null;
				this.preplanName = "";
				this.key = '';
				this.getCaseClassList();
			},
			handleCommit() {
				if (this.preplanId != null && this.preplanId > 0) {
					let data = {
						id: this.preplanId,
						name: this.preplanName
					};
					this.$emit("submit", data);
					this.visible = false;
				} else {
					this.$message({
						type: 'warning',
						message: '请选择一个预案'
					})
				}
			},
			renderContent(h, { //树形控件title提示
				node,
				data,
				store
			}) {
				return ( <
					span class = "custom-tree-node" >
					<
					span title = {
						node.data.name
					}
					class = "el-tree-node__label" > {
						node.data.name
					} < /span> <
					/span>);
				},
			}
		}
</script>

<style scoped>
	.candidate {
		margin-top: 10px;
		height: 400px;
	}

	.el-tree--highlight-current>>>.el-tree-node.is-current>.el-tree-node__content .el-tree-node__label {
		background-color: #ccc;
	}

	/*.el-tree--highlight-current>>>.el-tree-node.is-current>.el-tree-node__content {
		background-color: #c0c0c054;
	}*/
	.el-scrollbar>>>.el-scrollbar__wrap {
		overflow-x: hidden;
	}

	.submit-btn {
		margin-top: 20px;
		text-align: center;
	}
</style>
