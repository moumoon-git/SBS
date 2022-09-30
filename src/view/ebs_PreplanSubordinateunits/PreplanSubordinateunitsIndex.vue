<template>
  <el-container>
    <el-container>
      <el-aside width="250px" style="background: #cccccc47;">
		<grade-dropDown
          @operationChange="operationChange"
        />
        <div class="tree">
          <el-input
            placeholder="请输入应急类型"
            clearable
            v-model="AddressText"
            style="margin-bottom: 6px;"
          ></el-input>
          <el-scrollbar style="height: calc(100vh - 165px)">
            <el-tree
              class="filter-tree"
              :data="datas"
              highlight-current
              :props="defaultProps"
              @node-click="handleNodeClick"
              ref="tree"
              :filter-node-method="filterNode"
              :default-expanded-keys="[indexKey]"
              node-key="id"
            ></el-tree>
          </el-scrollbar>
        </div>
      </el-aside>

      <el-main>
        <el-header class="header" style="width:100%;">
          <div class="left">
            <search-bar ref="search" :placeholder="placeholder" @on-search="onSearch"></search-bar>
          </div>
          <div class="right">
            <div class="nav">
              <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAppend"
			  :disabled="!isMyself">新增</el-button>
            </div>
          </div>
        </el-header>
        <div class="right">
          <my-table
		  	:is-myself="isMyself"
            :table-data="tableData"
            :table-key="tableKey"
            @selection-change="handleSelectionChange"
            @detail="handleDetail"
            @update="handleUpdate"
            @delete="handleDelete"
            @handleReport="handleReport"
            @row-dblclick="handleDetail"
          ></my-table>
          <my-pagination
            :total="total"
            :current-page="currentPage"
            :page-size="pageSize"
            @handle-current-change="handleCurrentChange"
          ></my-pagination>
        </div>
      </el-main>
    </el-container>

    <!-- 新增/修改/查看弹出框 -->
    <my-dialog
      ref="dialog"
      :title="dialogTitle"
      :width="dialogWidth"
      :top="dialogTop"
      @closeDialog="closeDialog"
    >
      <my-form
        slot="form"
        ref="dataForm"
        :id="subId"
        :type="type"
        :case-class-id="caseClassId"
        :case-class-name="caseClassName"
        @on-submit="onSubmit"
        @on-cancel="onCancel"
        :treeData="datas"
      ></my-form>
    </my-dialog>

    <el-dialog
      title="审批"
      :visible.sync="dialogVisible"
      width="300px"
      center
      style="min-height: 6000px"
      :close-on-click-modal="false"
    >
      <div style="height: 200px">
		审批:
		<el-radio v-model="radio" label="1">通过</el-radio>
        <el-radio v-model="radio" label="0">驳回</el-radio>
		<div>备注:
        	<el-input v-model="reportRemark" type="textarea" :rows="2"></el-input>
		</div>
		<el-button type="primary" size="medium" @click="changeRadio">确认</el-button>
      	<el-button type="info" size="medium" @click="cancelRadio">取消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
	import SearchBar from '../../ebs_components/SearchBar'
	import MyDialog from '../../ebs_components/MyDialog'
	import Form from './PreplanSubordinateunitsForm'
	import MyTable from '../../ebs_components/MyTableWithReportFunction'
	import MyPagination from '../../ebs_components/MyPagination'
	import GradeDropDown from '@/views/common/GradeDropDown.vue';
	import {
		adjustCurrentPage
	} from '../../assets/js/ebs_common'
	export default {
		name: "PreplanSubordinateunitsIndex",
		components: {
			'search-bar': SearchBar,
			'my-dialog': MyDialog,
			'my-form': Form,
			'my-table': MyTable,
			'my-pagination': MyPagination,
			 GradeDropDown,
		},
		inject:['reload'],
		data() {
			const data = [{
				id: 0,
				name: '应急类型',
				children: null
			}];
			return {
				AddressText:"",
				theme: '预案备案',
				placeholder: '输入名称搜索',
				key: '',
				indexKey: 0,
				tableKey: [{
						prop: 'title',
						label: '备案名称',
					},
					{
						prop: 'versionNo',
						label: '版本号',
					},
					{
						prop: 'publishDate',
						label: '发布时间',
					},
					{
						prop: 'status',
						label: '状态',
					},
				],
				datas: JSON.parse(JSON.stringify(data)),
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				caseClassId: '',
				caseClassIds: '',
				caseClassName: "",
				total: 0, //数据总条目数
				currentPage: 1, // 当前页
				pageSize: 10, // 每页数据条目数
				fields: [],
				type: 'create',
				dialogTitle: '', // 对话框标题
				dialogWidth: '900px',
				dialogTop: '5vh', // 对话框margin-top
				tableData: [],
				multipleSelection: [],
				subId: null, //备案ID
				dialogVisible: false, // 审核窗可见
				reportRemark: '', // 审核备注
				platformId: 0, // 当前平台id
				isMyself: true, // 是否是本平台
				radio: -1, // 默认都不给
			}
		},
		created() {
			this.operationChange();
			this.getTree();
		},
		watch: {
			AddressText(val) {
				this.$refs.tree.filter(val);
			}
		},
		methods: {
			filterNode(value, data) {
				if (!value) return true;
				return data.name.indexOf(value) !== -1;
			},
			closeDialog() {
				this.$refs.dataForm.closeDialog();
			},
			filterNode(value, data) { //筛选应急
				if (!value) return true;
				return data.name.indexOf(value) !== -1;
			},
			getTree() {
				let data = {};
				this.$http({
					method: 'post',
					url: '/eos/caseClass/getTree',
					baseURL: window.g.ApiUrl
					}).then(res => {
						console.log('/emergency/preparation/caseClass/getTree res',res)
					this.datas[0].children = res.data.data;
					this.caseClassIds = 0;
					this.getTable();
					this.chooseTree()
				})
			},
			chooseTree() { //默认选中树形
				this.$nextTick(function() {
					this.$refs.tree.setCurrentKey(0);
				})
			},
			//点击应急类别返回数据
			handleNodeClick(data) { //树形
				this.highlight = true;
				this.caseClassId = data.id;
				this.caseClassName = data.name;
				this.currentPage = 1;
				this.key = "";
				this.$refs.search.reset();
				this.getTable();
			},
			getTable() {
				if (this.caseClassId == '') {
					this.caseClassId = this.caseClassIds;
				}
				let data = {
					platformId: this.platformId,
					caseClassId: this.caseClassId,
					page: this.currentPage,
					size: this.pageSize,
					fields: this.fields,
					key: this.key,
					includeLowerLevel: 1,
          			menuId:this.$store.state.menuID
				};
				this.$http({
					method: 'post',
					url:  '/emergency/preparation/preplanSubordinateunits/getList',
					baseURL: window.g.ApiUrl,
					data
					}).then(res => {
						console.log('/emergency/preparation/preplanSubordinateunits/getList res',res)
					let result = res.data.data;
					this.tableData = result.data;
					this.total = result.totalElements;
					for (let i in this.tableData) {
						if (this.tableData[i].publishDate != null) {
							let publishDate = this.tableData[i].publishDate.replace(/-/g, '/');
							let time = new Date(publishDate);
							let y = time.getFullYear();
							let m = time.getMonth() + 1;
							let d = time.getDate();
							this.tableData[i].publishDate = y + '-' + this.transformationTime(m) + '-' + this.transformationTime(d);
						}
					}
				})
			},
			handleSizeChange(val) {
				this.currentPage = val;
				this.getTable();
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getTable();
			},
			// 新增按钮触发事件
			handleAppend() {
				if (this.caseClassId == null || this.caseClassId === 0) {
					this.$message({
						type: 'warning',
						message: '请选择一个应急类别新增预案备案'
					});
					return;
				}

				this.subId = 0;
				this.type = 'create';
				this.dialogTitle = this.theme + '新增';
				this.$refs.dialog.visible = true;
				this.$nextTick(function() {
					this.$refs.dataForm.getDetail();
				});
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//修改备案
			handleUpdate(id) {
				this.subId = id;
				this.type = 'update';
				this.dialogTitle = this.theme + '修改';
				this.$refs.dialog.visible = true;
				this.$nextTick(function() {
					this.$refs.dataForm.getDetail();
				});
			},
			//删除备案
			handleDelete(id) {
				let data = {
					"ids": [id]
				};
				this.$http({
					method: 'post',
					url:  '/emergency/preparation/preplanSubordinateunits/delete',
					baseURL: window.g.ApiUrl,
					data
				}).then(res => {
					this.currentPage = adjustCurrentPage(this.currentPage, this.pageSize, this.total, 1);
					this.getTable();
					this.$message({
						message: '删除成功',
						type: 'success'
					});
				})
			},
			handleReport(id) {
				this.subId = id;
				this.dialogVisible = true;
			},
			// 审批通过
			passPreplan(id, reportRemark) {
				let data = {
					id: id,
					status: 1,
					remark: reportRemark,
				};
				this.$http({
					method: 'post',
					url:  '/emergency/preparation/preplanSubordinateunits/examinePreplan',
					baseURL: window.g.ApiUrl,
					data
				}).then(res => {
					if(res.data.errorcode == 0) {
						this.$message({
							message: '审核成功！',
							type: 'success'
						});
						this.dialogVisible = false;
						this.getTable();
						this.radio = -1;
					} else {
						this.$message({
							message: '审核失败',
							type: 'error'
						});
						this.radio = -1;
					}
				})
			},
			// 驳回
			cancelPreplan(id, reportRemark) {
				let data = {
					id: id,
					status: 2,
					remark: reportRemark,
				};
				this.$http({
					method: 'post',
					url:  '/emergency/preparation/preplanSubordinateunits/examinePreplan',
					baseURL: window.g.ApiUrl,
					data
				}).then(res => {
					if(res.data.errorcode == 0) {
						this.$message({
							message: '驳回成功！',
							type: 'success'
						});
						this.dialogVisible = false;
						this.getTable();
						this.radio = -1;
					} else {
						this.$message({
							message: '驳回失败',
							type: 'error'
						});
						this.radio = -1;
					}
				})
			},
			// radio改变
			changeRadio() {
				console.log(this.radio);
				if (this.radio < 0) {
					this.$message({
						message: '请先选择审批还是驳回',
						type: 'error'
					});
					return;
				}
				if (this.radio == 1) this.passPreplan(this.subId, this.reportRemark);
				else this.cancelPreplan(this.subId, this.reportRemark);
			},
			// 取消
			cancelRadio() {
				this.dialogVisible = false;
				this.radio = -1;
				console.log(this.radio);
			},
			// 是否选择的是本平台
			operationChange(isPlatformRoot, platformId) {
				this.platformId = platformId;
				// 本平台的一些按钮显隐
				if(isPlatformRoot) {
					this.isMyself = true;
				} else {
					this.isMyself = false;
				}
				this.getTable();
			},
			//查看备案
			handleDetail(id) {
				this.subId = id;
				this.type = 'detail';
				this.dialogTitle = this.theme + '查看';
				this.$refs.dialog.visible = true;
				this.$nextTick(function() {
					this.$refs.dataForm.getDetail();
				});
			},
			// 新增/修改数据项成功后触发事件
			onSubmit(type) {
				this.$refs.dialog.visible = false;
				if (type === 'create') {
					this.currentPage = 1;
					this.getTable();
				} else if (type === 'update') {
					this.getTable();
				}
			},
			// 取消新增/修改操作
			onCancel() {
				this.$refs.dialog.visible = false;
			},

			onSearch(key) {
				this.key = key;
				this.currentPage = 1;
				this.getTable();
			},
			btns() {
				this.$nextTick(function() {
					this.$refs.tree.setCurrentKey(this.eltreeId)
				})
			}
		}
	}
</script>

<style scoped>
@import '../../assets/css/common.css';

span {
    width: 100%;
    height: 1px;
    color: #000;
    display: inline-block;
}

.nav li {
    float: left;
}

li {
    list-style: none;
}

.header .left {
    float: left;
}

.header .right {
    float: left;
    margin-top: 10px;
}

.el-button--small {
    padding: 11px 15px;
}

.container {
    clear: both;
}

.tree {
    overflow-y: auto;
    overflow-x: auto;
    width: 250px;
    /*height: 768px;*/
}

.el-tree {
    min-width: 100%;
    display: inline-block !important;
}

.eltable {
    overflow-x: auto;
}

.operation-btn {
    width: 240px;
    text-align: left;
    margin-left: 5px;
    margin-right: 5px;
    padding-bottom: 5px;
    border-bottom: #ebeef5 1px solid;
}

.el-tree--highlight-current
    >>> .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #c0c0c0;
}

.el-tree {
    background: #c0c0c003;
}

.el-dialog__wrapper >>> .el-dialog--center .el-dialog__body {
    text-align: left;
}
</style>
