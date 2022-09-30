<template>
	<el-container>
		<el-aside width="250px" style="background: #cccccc47;">
			<!-- author: qinjiaqi -->
            <!-- description: 把按钮整体往左移 -->
			<el-header style="height: 48px;margin-top: 20px;margin-left: -7px;" class="operation-btn">
				<el-tooltip effect="dark" content="查看分组" placement="top">
					<el-button type="success" size="small" icon="el-icon-view" circle @click="groupDetail"></el-button>
				</el-tooltip>
				<el-tooltip effect="dark" content="新增分组" placement="top">
					<el-button type="primary" size="small" icon="el-icon-plus" circle @click="groupAppend"></el-button>
				</el-tooltip>
				<el-tooltip effect="dark" content="修改分组" placement="top">
					<el-button type="warning" size="small" icon="el-icon-edit" circle @click="groupUpdate"></el-button>
				</el-tooltip>
				<el-tooltip effect="dark" content="删除分组" placement="top">
					<el-button type="danger" size="small" icon="el-icon-delete" circle @click="groupDelete"></el-button>
				</el-tooltip>
		    	<!-- author: qinjiaqi -->
                <!-- description: 新增按钮 -->
				<el-tooltip effect="dark" content="导出联系人分组" placement="top">
					<el-button type="primary" size="small" icon="el-icon-download" circle @click="exportGroup"></el-button>
				</el-tooltip>
			</el-header>
			<div class="tree">
				<el-input placeholder="请输入分组名称" clearable v-model="AddressText" style="margin-bottom: 6px;">
				</el-input>
				<!-- author: qinjiaqi -->
                <!-- description: 新增复选框和复选操作 -->
				<el-scrollbar style="height: calc(100vh - 290px)">
					<el-tree class="filter-tree" :filter-node-method="filterNode" :data="treeData" highlight-current :props="defaultProps"
					 @node-click="handleNodeClick" ref="tree"  :default-expanded-keys="[indexKey]" node-key="id"
					 :render-content="renderContent" draggable @node-drop="handleDrop" :allow-drop="allowDrop" :allow-drag="allowDrag" 
					 :show-checkbox="true" @check-change="handleCheckChange" @check="handleCheck">
                    </el-tree>
				</el-scrollbar>
				<el-alert title="温馨提示" type="info" description="可拖动修改同级分组排序" show-icon>
				</el-alert>
			</div>
		</el-aside>
		<el-main>
			<el-header style="width: 100%;">
				<search-bar ref="search" :placeholder="placeholder" @on-search="onSearch" style="float: left;"></search-bar>
				<div class="nav" style="margin-top: 10px;margin-right: 10px;float: left;">
					<el-button type="primary" size="medium" icon="el-icon-plus" @click="handleAppend">新增</el-button>
					<!-- author: qinjiaqi -->
                    <!-- description: 新增按钮 -->
					<el-button type="primary" size="medium" icon="el-icon-sort" @click="handleSort">排序</el-button>
					<el-button type="danger" size="medium" icon="el-icon-delete" @click="batchDelete">批量删除</el-button>
				</div>
				<!--导入-->
				<el-excel style="float: left;margin-top: 11px;display: block;" @fatherMethod="refresh" :excelType='excelType' :ids="arrayID.map(item=>item.id)"
				 :eltreeId='treeID'></el-excel>
				<!-- 上报 -->
				<el-report style="float: left;margin-top: 11px;display: block;margin-left: 14px;" :LinkacontactorListype='LinkageType'
				 :arrayID='arrayID' :reportType="reportType"></el-report>
				<!--下发-->
				<lower-hair style="float: left;margin-top: 11px;display: block;margin-left: 14px;" :arrayID='arrayID' :LinkageType='LinkageType'
				 :reportType="reportType"></lower-hair>
			</el-header>
			<div class="right">
				<my-table ref="message" :table-data="tableData" :table-key="tableKey" :relGroup="relGroup" @getRelGroup="getRelGroupForChild" @selection-change="handleSelectionChange"
				 @detail="handleDetail" @update="handleUpdate" @delete="handleDelete" @row-dblclick="handleDetail"></my-table>
				<el-pagination background layout="total, prev, pager, next, jumper" :total="total" :current-page="currentPage"
				 @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pageSize" style="margin-top: 10px;text-align: center;">
				</el-pagination>
			</div>
		</el-main>
		<!-- 新增/修改/查看表格弹出框 -->
		<my-form ref="mychild" @fatherMethod="fatherMethod" :treeData='treeData'></my-form>
		<!-- author: qinjiaqi -->	    
		<!-- description: 联系人排序弹出框 -->
		<contact-sorting-popup ref="ContactSortingPopup"></contact-sorting-popup>
		<Liaison-netSide ref="child" @childMethod="childMethod"></Liaison-netSide>
    <edit-group-details v-if="editGroupDetailsVisible" :visibleProp.sync="editGroupDetailsVisible"
                        :data="editGroupDetailsData" :title="editGroupDetailsTitle" @childmethod="childMethod"
    ></edit-group-details>
	    <!-- editor: qinjiaqi -->
		<!-- description: 联系人删除逻辑改变 -->
	    <el-dialog
			title="联系人删除提示"
			:visible.sync="deleteBtnFlag"
			width="25%"
			center>
			<span>该联系人在系统中存在分组、预案等关联数据,删除数据将不可恢复，请您确认相关操作!</span>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="deleteGroupOne">从分组中删除</el-button>
				<el-button type="danger" @click="deleteGroupAll">彻底删除</el-button>
			</span>
		</el-dialog>
	</el-container>
</template>

<script>
	import SearchBar from '../../components/SearchBar'
	import MyTable from '../../components/tableWithNewDeleteFunction'
	import elexcel from '../../components/excel'
	import elReport from '../../components/Report'
	import lowerHair from '../../components/lowerHair'
	import {
		adjustCurrentPage
	} from '../../assets/js/common.js'
	import Form from './LiaisonNetForm'
	import LiaisonNetSide from './LiaisonNetSide'

    import editGroupDetails from "./editGroupDetails";
    import ContactSortingPopup from "../../components/contactSortingPopup"; // 联系人排序
	export default {
		name: "Index",
		components: {
			'my-table': MyTable,
			'my-form': Form,
			'search-bar': SearchBar,
			'Liaison-netSide': LiaisonNetSide,
			'el-excel': elexcel,
			'el-report': elReport,
			'lower-hair': lowerHair,
	        'edit-group-details': editGroupDetails,
	        ContactSortingPopup, // 联系人排序
		},
		inject: ['reload'],
		data() {
			return {
      			isOPB: window.g.isOPB,
				editGroupDetailsVisible: false,
				editGroupDetailsData: {},
				editGroupDetailsTitle: "",
				AddressText: "",
				// excelType: 'contactor', //导入表格类型
				excelType: 'phone', //导入表格类型
				LinkageType: 1301, //联动上报类型参数
				reportType: 'phone', //上报类型
				tableKey: [{
						prop: 'name',
						label: '姓名',
						width: ''
					},
					{
						prop: 'mobile',
						label: '手机号码',
						width: ''
					},
					{
						prop: 'workUnit',
						label: '工作单位',
            			width: ''
					},
					{
						prop: 'officeTel',
						label: '办公电话',
						width: ''
					},

					// {
					// 	prop: 'email',
					// 	label: '电子邮箱',
					// 	width: ''
					// }
					{
						prop: 'position',
						label: '职务',
					}
				],
				placeholder: '输入姓名或号码搜索',
				key: '',
				tableData: [], //表格数据
				treeData: [],
				indexKey: 0,
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				total: 0, //数据总条目数
				currentPage: 1, // 当前页
				pageSize: 10, // 每页数据条目数
				arrayID: [], //全选ID数组
				root: '',
				treeID: 0, //类别ID
				parentID: 0, //类别父级ID
				parentName: '', //类别父级名称
				treeName: '', //类别名称
				childrenlist: [], //拖动排序后的数组ID

				relGroup: "",
				checkedGroupIds:[], // 保存勾选的分组id，用于导出联系人
				treeMultipleSelection: [], //树状分组勾选的选项
				groupIds: '', // 复选框勾选的联系组
				
				deleteBtnFlag:false, // 控制删除对话框
				deleteMoreorOne:'',// 打开的是删除单个的还是删除多个的。more多个，one一个
				deleteId: '', // 彻底删除
				deleteCount: 0, // 批量删除计数器
			}
		},
		created() {
			this.root = window.g.ApiUrl;
			this.gettreeData();
		},
		watch: {
			AddressText(val) {
				this.$refs.tree.filter(val);
			}
		},
		methods: {
		    /** 
             * @author qinjiaqi
             * @param {Object, Boolean} 选择的分组（父组也会被选），检查当前是父组还是要选的子组（父组为false，子组为true）
             * @return {type} undefined
             * @description：选择分组
             */
			handleCheckChange(data, checked) {
				console.log("树状分组选中了什么", data, checked);
				if (checked) {
				    this.treeMultipleSelection.push(data); // 子组才打印
				} else {
				    this.treeMultipleSelection = this.treeMultipleSelection.filter(elem => elem.id !== data.id);
				}
			},
		    /** 
             * @author qinjiaqi
             * @param {Object, Object} 选择的分组的属性和内容，检查的内容
             * @return {type} undefined
             * @description：选中复选框
             */
			handleCheck(node, checked) {
				console.log('选中复选框', node, checked);
				this.checkedGroupIds = checked.checkedKeys;
				console.log('导出联系人的分组id：', this.checkedGroupIds);
				// 获取复选框分组id给子组件
				this.groupIds = this.checkedGroupIds
			},
		    /** 
             * @author qinjiaqi
             * @param {type} 没有
             * @return {type} undefined
             * @description：导出分组
             */
			exportGroup() {
				// 条件为是否勾选过和是否勾选后又取消勾选
				if (!this.groupIds || this.groupIds.length == 0) {
					this.$message.warning('请先勾选一个分组');
					return;
				}
				console.log(this.groupIds)
				let exportURL = `${window.g.ApiUrl}/emergency/preparation/contactor/exportExcelByGroups?groupIds=${this.groupIds}`
				var xhr = new XMLHttpRequest();
				xhr.open('GET', (exportURL), true);
				xhr.withCredentials = true
				xhr.responseType = "blob"; // 返回类型blob
				let token = localStorage.getItem("token")
				if(token == null) {
					token = ''
				}
				xhr.setRequestHeader('Authorization', token)
				// 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
				xhr.onload = function () {
				// 请求完成
				if (this.status === 200) {
					// 返回200
					var blob = this.response;
					var reader = new FileReader();
					reader.readAsDataURL(blob);    // 转换为base64，可以直接放入a标签href
					reader.onload = function (e) {
						// 转换完成，创建一个a标签用于下载
						var a = document.createElement('a');
						a.download = '导出表格.xlsx';
						a.setAttribute('target','_blank')
						a.setAttribute('target','_self')
						a.href = e.target.result;
						document.body.append(a);    // 修复firefox中无法触发click
						console.log(a);
						a.click();
						// document.body.remove(a);
						}
			    	}
				};
				xhr.send()
			},	
		    /** 
             * @author qinjiaqi
             * @param {type} 没有
             * @return {type} undefined
             * @description：联系人排序
             */
			handleSort() {
				//this.$nextTick(() => {
					this.$refs.ContactSortingPopup.type = "phone"
					this.$refs.ContactSortingPopup.isDialogVisible = true; // 弹出框可见
					this.$refs.ContactSortingPopup.getTree(this.treeID); // 获取通讯录树
				    // this.$refs.ContactSortingPopup.handleNodeClick(this.tableData, ""); //获取当前选择的id的联系人数据
				//});
			},
			filterNode(value, data) {
				if (!value) return true;
				return data.name.indexOf(value) !== -1;
			},
			childMethod(data) {
				this.treeID = data.treeID;
				this.indexKey = data.treeID;
				this.parentID = data.parentID;
				this.parentName = data.parentName;
				this.treeName = data.treeName;
				this.gettreeData()
			},
			// groupDetail() {
			// 	if (this.treeID == 0) {
			// 		this.$message({
			// 			type: 'warning',
			// 			message: '请选择一个分组进行查看'
			// 		})
			// 		return
			// 	}
			// 	let data = {
			// 		treeName: this.treeName,
			// 		treeID: this.treeID,
			// 		parentID: this.parentID,
			// 		parentName: this.parentName
			// 	};
			// 	this.$refs.child.openModal(data, 'detail');
			// },
			// groupAppend() {
			// 	if (this.treeID == 0) {
			// 		this.treeName = this.treeData[0].name;
			// 		this.parentID = '';
			// 		this.parentName = '';
			// 	}
			// 	let data = {
			// 		treeName: this.treeName,
			// 		treeID: this.treeID,
			// 		parentID: this.parentID,
			// 		parentName: this.parentName
			// 	};
			// 	this.$refs.child.openModal(data, 'add');
			// },
			// groupUpdate() {
			// 	if (this.treeID == 0) {
			// 		this.$message({
			// 			type: 'warning',
			// 			message: '请选择一个分组进行修改'
			// 		})
			// 		return
			// 	}
			// 	let data = {
			// 		treeName: this.treeName,
			// 		treeID: this.treeID,
			// 		parentID: this.parentID,
			// 		parentName: this.parentName
			// 	};
			// 	this.$refs.child.openModal(data, 'update');
			// },
      groupDetail() {
        if (this.treeID == 0) {
          this.$message({
            type: 'warning',
            message: '请选择一个分组进行查看'
          })
          return
        }
        let data = {
          treeName: this.treeName,
          treeID: this.treeID,
          parentID: this.parentID,
          parentName: this.parentName
        };
        this.editGroupDetailsData = data;
        this.editGroupDetailsVisible = true;
        this.editGroupDetailsTitle = "联系人分组查看"
			},
			/**
			 * @lastEditor hexinting
			 * @lastDate 2021-01-24
			 * @description 新增分组
			 */
      groupAppend(){
				// 未分组联系人分组不可修改
				if (this.treeID === -1) {
					this.$message({
						type: 'warning',
						message: '未分组联系人分组不可新增'
					})
					return;
				}
        if (this.treeID == 0) {
          this.treeName = this.treeData[0].name;
          this.parentID = '';
          this.parentName = '';
        }
        let data = {
          treeName: "",
          treeID: "",
          parentID: this.treeID,
          parentName: this.treeName
        };
        this.editGroupDetailsData = data;
        this.editGroupDetailsVisible = true;
        this.editGroupDetailsTitle = "联系人分组新增"
			},
			/**
			 * @lastEditor hexinting
			 * @lastDate 2021-01-24
			 * @description 修改分组
			 */
      groupUpdate(){
				console.log(this.treeID)
				// 未分组联系人分组不可修改
				if (this.treeID === -1) {
					this.$message({
            type: 'warning',
            message: '未分组联系人分组不可修改'
					})
					return;
				}
        if (this.treeID == 0) {
          this.$message({
            type: 'warning',
            message: '请选择一个分组进行修改'
          })
          return
        }
        let data = {
          treeName: this.treeName,
          treeID: this.treeID,
          parentID: this.parentID,
          parentName: this.parentName
        };
        this.editGroupDetailsData = data;
        this.editGroupDetailsVisible = true;
        this.editGroupDetailsTitle = "单位信息管理"
			},
			/**
			 * @lastEditor hexinting
			 * @lastDate 2021-01-24
			 * @description 删除分组
			 */
      groupDelete() {
				// 未分组联系人分组不可删除修改
				if (this.treeID === -1) {
					this.$message({
            type: 'warning',
            message: '未分组联系人分组不可删除'
					})
					return;
				}
        if (this.treeID == 0) {
          this.$message({
            type: 'warning',
            message: '请选择一个分组进行删除'
          })
          return
        }
        let data = {
          id: this.treeID
        };
        let CallbackReload = this;
        this.$http('/emergency/preparation/contactorGroup/getChildren', data, CallbackReload).then(res => {
          if (res.data.length == 0) {
            let data = {
                dictType: "governmentAffairs",
                groupId: this.treeID,
                page: this.currentPage,
                searchText: this.key,
                size: this.pageSize,
                type: "phone",
						};
						if (this.isOPB) {
							data.thisGroupOnly = false;
						} else {
							data.thisGroupOnly = true;
						}
            let CallbackReload = this;
            this.$http('/emergency/preparation/contactor/contactorList', data, CallbackReload).then(res => {
              // if (res.data.totalElements == 0) {
              //   this.$confirm('确定删除该分组信息？', '提示', {
              //     confirmButtonText: '确定',
              //     cancelButtonText: '取消',
              //     type: 'warning'
              //   }).then(() => {
              //     let data = {
              //       ids: [this.treeID]
              //     }
              //     let CallbackReload = this;
              //     this.$http('/emergency/preparation/contactorGroup/delete', data, CallbackReload).then(res => {
              //       this.treeID = 0;
              //       this.indexKey = 0;
              //       this.gettreeData()
              //       this.$message({
              //         message: '已删除',
              //         type: 'success'
              //       });
              //     })
              //   }).catch(() => {
              //     this.$message({
              //       type: 'info',
              //       message: '已取消删除'
              //     });
              //   });
              // } else {
              //   this.$message({
              //     type: 'warning',
              //     message: '无法删除包含子节点或数据的分组'
              //   })
              //   return
              // }
              
                this.$confirm('确定删除该分组信息？', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  let data = {
                    ids: [this.treeID]
                  }
                  let CallbackReload = this;
                  this.$http('/emergency/preparation/contactorGroup/delete', data, CallbackReload).then(res => {
                    this.treeID = 0;
                    this.indexKey = 0;
                    this.gettreeData()
                    this.$message({
                      message: '已删除',
                      type: 'success'
                    });
                  })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
                });

            })
          }
          else {
            this.$message({
              type: 'warning',
              message: '无法删除包含子节点或数据的分组'
            })
            return
          }
        })
      },
			onSearch(key) {
				this.key = key;
				this.currentPage = 1;
				this.getTable();
			},
			//刷新表格
			refresh() {
				this.treeID = 0;
				this.gettreeData();
			},
			renderContent(h, { //树形控件title提示
				node,
				data,
				store
			}) {
				return ( <span class="custom-tree-node">
					<span class = "el-tree-node__label" title={node.data.name}> {node.data.name} </span> </span> );
			},

			handleSelectionChange(val) { //全选
				this.arrayID = val;
			},
			handleNodeClick(data, node) { //点击树形菜单
				this.treeID = data.id; //当前选中Id
				this.parentID = node.parent.data.id; //父级ID
				this.parentName = node.parent.data.name; //父级名称
				this.treeName = data.name; //当前选中名称

				this.key = '';
				this.$refs.search.reset();
				this.currentPage = 1;
				this.getTable();
			},
			gettreeData() {
				let data = {
					type: 'phone',
					menuId: this.$store.state.menu.menuID
				};
				this.$http('/emergency/preparation/contactorGroup/topTree', data).then(res => {
					this.treeData = [res.data];
					this.getTable()
					this.chooseTree()

				})
			},
			chooseTree() { //默认选中树形
				this.$nextTick(function() {
					this.$refs.tree.setCurrentKey(this.treeID);
				})
			},
			getTable() { //表格数据
				let id = this.treeID;
				let key = this.key;
				
				let data = {
                    dictType: "governmentAffairs",
                    groupId: id,
                    page: this.currentPage,
                    searchText: key,
                    size: this.pageSize,
					type: "phone",
				};
				if (this.isOPB) {
					data.thisGroupOnly = false;
				} else {
					data.thisGroupOnly = true;
				}
				this.$http('/emergency/preparation/contactor/contactorList', data).then(res => {
					let data = res.data;
					this.tableData = data.data;
					this.total = data.totalElements;
				})
			},
			handleAppend() { //新增
				if (this.treeID == 0) {
					this.$message({
						type: 'warning',
						message: '请选择一个分组进行新增联系人'
					})
					return
				}
				let data = {
					groups: [{
						id: this.treeID,
						name: this.treeName
					}]
				};
				this.$refs.search.reset();
				this.$refs.mychild.openModal(data, 'add');
			},
			handleDetail(row) { //查看
				let data = row;
				this.$refs.mychild.openModal(data, 'detail');
			},
			handleUpdate(row) { //修改
				let data = row;
				this.$refs.mychild.openModal(data, 'update');
			},
			/** 
			 * @author qinjiaqi
			 * @lastEditor hexinting
			 * @lastDate 2021-01-22
			 * @param {type} 没有
			 * @return {type} undefined
			 * @description：在当前分组里批量删除联系人
			 */
			deleteGroupOne() {
				if(this.deleteMoreorOne == 'more'){
					let data = {
						ids: this.deleteId,
						groupId: this.treeID
					};
					let CallbackReload = this;
					if (this.isOPB) {  // openLab项目从分组删除联系人，需要把当前分组以下分组的同个联系人删除
						this.$http('/emergency/preparation/contactor/deleteContactorGroupRelLower', data, CallbackReload).then(res => {
							this.currentPage = adjustCurrentPage(this.currentPage, this.pageSize, this.total, this.deleteCount);
							this.getTable();
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.deleteBtnFlag = false;
						})
					} else {
						this.$http('/emergency/preparation/contactor/deleteContactorGroupRel', data, CallbackReload).then(res => {
							this.currentPage = adjustCurrentPage(this.currentPage, this.pageSize, this.total, this.deleteCount);
							this.getTable();
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.deleteBtnFlag = false;
						})
					}
				}
			},
			/** 
			 * @author qinjiaqi
			 * @param {type} 没有
			 * @lastEditor hexinting
			 * @lastDate 2021-01-22
			 * @return {type} undefined
			 * @description：在所有分组里批量删除这群id对应的联系人
			 */
			deleteGroupAll() {
				if(this.deleteMoreorOne == 'more'){
                    let data = {
						ids: this.deleteId,
						groupId: this.treeID
					};
					let CallbackReload = this;
					this.$http('/emergency/preparation/contactor/delete', data, CallbackReload).then(res => {
						this.currentPage = adjustCurrentPage(this.currentPage, this.pageSize, this.total, this.deleteCount);
						this.getTable();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.deleteBtnFlag = false;
					})
				}
			},
			/** 
			 * @author qinjiaqi
			 * @lastEditor hexinting
			 * @lastDate 2021-01-22
			 * @param {Int} 当前选择的单个联系人
			 * @return {type} undefined
			 * @description：删除单个联系人，id从table.vue传到父组件里
			 */
			handleDelete(id, type) { //删除
				if(this.treeID == 0) {
					this.$message({
						message: '在默认展示页面不能进行分组内删除',
						type: 'warning'
					});
					return;
				}
				console.log(type)
				// 分组里删除
				if(type == 'one') {
                    let data = {
						ids: [id],
						groupId: this.treeID
					};
					let CallbackReload = this;
					if (this.isOPB) { // openLab项目从分组删除联系人，需要把当前分组以下分组的同个联系人删除
						this.$http('/emergency/preparation/contactor/deleteContactorGroupRelLower', data, CallbackReload).then(res => {
							this.currentPage = adjustCurrentPage(this.currentPage, this.pageSize, this.total, this.deleteCount);
							this.getTable();
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.deleteBtnFlag = false;
						})
					} else {
						this.$http('/emergency/preparation/contactor/deleteContactorGroupRel', data, CallbackReload).then(res => {
							this.currentPage = adjustCurrentPage(this.currentPage, this.pageSize, this.total, this.deleteCount);
							this.getTable();
							this.$message({
								message: '删除成功',
								type: 'success'
							});
							this.deleteBtnFlag = false;
						}) 
					}
				} else { // 全部删除
					let data = {
						ids: [id],
						groupId: this.treeID
					};
					let CallbackReload = this;
					this.$http('/emergency/preparation/contactor/delete', data, CallbackReload).then(res => {
						this.currentPage = adjustCurrentPage(this.currentPage, this.pageSize, this.total, 1);
						this.getTable();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
					})					
				}
			},
		    /** 
             * @author qinjiaqi
             * @param {type} 没有
             * @return {type} undefined
             * @description：批量删除联系人，id组传给全局存储
             */
			batchDelete() { //批量删除
				if (this.arrayID.length == 0) {
					this.$message({
						message: '请选择数据',
						type: 'warning'
					});
					return;
				}
			    if(this.treeID == 0) {
					this.$message({
						message: '在默认展示页面不能进行批量删除',
						type: 'warning'
					});
					return;
				}
				let ids = []; //全选ID数组
				this.deleteCount = 0;
				for (let i in this.arrayID) {
					ids.push(this.arrayID[i].id);
					this.deleteCount++;
				}
				this.deleteId = ids
                this.deleteBtnFlag = true
				this.deleteMoreorOne = 'more'
				/* this.$confirm('确认删除该数据？', '提示', {
					type: 'warning',
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(() => {
					let data = {
						ids: ids,
						groupId: this.treeID
					};
					let CallbackReload = this;
					this.$http('/emergency/preparation/contactor/delete', data, CallbackReload).then(res => {
						this.currentPage = adjustCurrentPage(this.currentPage, this.pageSize, this.total, this.deleteCount);
						this.getTable();
						this.$message({
							message: '删除成功',
							type: 'success'
						});

					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})*/
			},
			fatherMethod() {
				this.getTable()
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getTable()
			},
			handleSizeChange(val) {
				this.currentPage = val;
				this.getTable()
			},
			handleDrop(draggingNode, dropNode, dropType, ev) {
				if(window.g.IsShiJingShanProject) {
					if(draggingNode.data.id <= 0 || dropNode.data.id <= 0 ) {
					this.$message({
						type: 'warning',
						message: '不能操作未分组联系人'
					})
					this.gettreeData();
					return;
					}
					let arrays = [];
					let flag = false // 同级还是拖进里面
					if (this.childrenlist) {
					this.childrenlist.forEach(function(data) {
						if(data.id >= 0) // -1是未分组联系人
						arrays.push(data.id);
						if(data.id == draggingNode.data.id)
						flag = true
					});
					} else {
					this.$message({
						type: 'warning',
						message: '拖动不合规范'
					})
					this.gettreeData();
					return;
					}
					if(arrays.length == 0 ) {
					this.$message({
						type: 'warning',
						message: '拖动不合规范'
					})
					this.gettreeData();
					return;
					}
					let data = {
					id: draggingNode.data.id, // 当前拖动的节点
					ids: (flag == true ? arrays : [draggingNode.data.id]), // 移动后数组ID
					parentId: (flag == true ? dropNode.data.pid : dropNode.data.id) // 被拖进的新组的id
					};
					this.$http('/emergency/preparation/contactorGroup/updateOrderReplenish', data).then((res) => {
					this.gettreeData();
					});
				} else {
					if (this.childrenlist) {
						let arrays = [];
						this.childrenlist.forEach(function(data) {
							arrays.push(data.id);
						});
						let data = {
							ids: arrays //移动后数组ID
						};

						let CallbackReload = this;
						this.$http('/emergency/preparation/contactorGroup/updateOrder', data, CallbackReload).then(res => {
							this.gettreeData()
						})
					}
				}
			},
			allowDrop(draggingNode, dropNode, type) { //拖拽时判定目标节点能否被放置
				this.treeID = draggingNode.data.id;
				this.treeName = draggingNode.data.name; //当前选中名称
				this.parentID = draggingNode.parent.data.id;
				this.parentName = draggingNode.parent.data.name; //父级名称
				this.indexKey = dropNode.data.id;
				if(window.g.IsShiJingShanProject)
					this.childrenlist = dropNode.parent.data.children;
				else
					this.childrenlist = draggingNode.parent.data.children;
				if (draggingNode.parent.data.id == dropNode.data.id) {
					return;
				}
				if (draggingNode.parent.data.id == dropNode.parent.data.id) {
					return type !== 'inner';
				} else {
					if(window.g.IsShiJingShanProject)
						return type === 'prev' || type === 'next' || type === 'inner'
					else 
						return;
				}
			},
			allowDrag(draggingNode) { //判断节点能否被拖拽
				let groupName = this.treeData[0].name;
				return draggingNode.data.name.indexOf(groupName) === -1;
			},
			getRelGroupForChild(key, callback){
				this.relGroup =  this.getRelGroup(this.treeData[0], key)
				callback(this.relGroup)
			},

			getRelGroup(data, key) {
				if (data.name == key) {
					return data.name;
				}

				for (let i = 0; i < data.children.length; i++) {
					let tmp = this.getRelGroup(data.children[i], key);
					if (tmp) {
						return `${data.name}/${tmp}`;
					}
				}
				return null;
			},			
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

	.el-tree--highlight-current>>>.el-tree-node.is-current>.el-tree-node__content {
		background-color: #C0C0C0;
	}

	.el-tree {
		background: #c0c0c003;
	}

	.dialog-footer {
		text-align: center;
		padding-top: 30px;
	}

	.operation-btn {
		width: 260px;
		text-align: left;
		/*margin-left: 5px;
		margin-right: 5px;
		padding-bottom: 5px;
		border-bottom: #ebeef5 1px solid;*/
	}
</style>
