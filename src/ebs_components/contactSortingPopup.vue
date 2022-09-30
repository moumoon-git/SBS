<template>
    <div>
        <el-dialog
            center
            top="5vh"
            :title="title"
            :visible.sync="isDialogVisible"
            :close-on-click-modal="false"
            width="1200px"
            @close="closeDialog"
            >
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="tree">
                        <el-scrollbar v-if="type=='machinery'" style="height: 100%">
                            <el-tree 
                                :data="machineryTreeData"
                                highlight-current
                                ref="tree"
                                @node-click="handleNodeClick"
                                default-expand-all
                                node-key="id"
                                :props="defaultProps"
                            ></el-tree>
					    </el-scrollbar>
                        <el-scrollbar v-else style="height: 100%">
                            <el-tree
                                :data="treeData"
                                highlight-current
                                ref="tree"
                                @node-click="handleNodeClick"
                                default-expand-all
                                node-key="id"
                                :props="defaultProps"
                            ></el-tree>
                        </el-scrollbar>
                    </div>
                </el-col>
                <el-col :span="16">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <div class="right">
                                <el-scrollbar style="height: 100%">
                                    <draggable v-if="tableData.length!=0"
                                        style="height: 520px;width: 100%;text-align: left;"
                                        class="dragArea list-group"
                                        :list="tableData"
                                        :clone="clone"
                                        :group="{ name: 'people', pull: pullFunction }"
                                        @start="start"
                                        @end="leftEnd"
                                    >
                                        <el-tag
                                            v-for="element in tableData"
                                            :key="element.id"
                                            style="margin-left: 10px;margin-top:10px;"
                                        >{{element.name}}</el-tag>
                                        <el-tag style="display: none"></el-tag>
                                    </draggable>
                                    <div v-else style="text-align:center;height: 10vh;line-height: 10vh;">
                                        暂无数据
                                    </div>
                                </el-scrollbar>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="right">
                                <el-scrollbar style="height: 100%;text-align: left;">
                                    <draggable
                                        class="dragArea list-groups"
                                        @end="rightEnd"
                                        :move="move"
                                        :list="copyTableData"
                                        group="people"
                                        style="height: 520px;width: 100%;"
                                    >
                                        <el-tag
                                            v-for="element in copyTableData"
                                            :key="element.id"
                                            style="margin-left: 10px;margin-top:10px"
                                        >{{element.name}}</el-tag>
                                    </draggable>
                                </el-scrollbar>
                            </div>
                        </el-col>
                    </el-row>
                <!-- 去除分页,保留总数显示，差全部联系人 author:hexinting date:2020-9-27 -->
                <!-- <el-pagination
                    :page-size="pageSize"
                    :total="total"
                    @current-change="pageChange"
                    :current-page.sync="currentPage"
                    layout="total, prev, pager, next, jumper"
                ></el-pagination> -->
                </el-col>
            </el-row>
            <p style="text-align:center;margin:0;padding:0;">{{'共' + total + '条' }}</p>
        </el-dialog>
    </div>
</template>

<script>
import draggable from 'vuedraggable';
export default {
    name: 'contactSortingPopup',
    components: {
        //调用排序组件
        draggable,
    },
    data() {
        const machineryTree = [{
			id: 0,
			name: '应急机构分组',
			children: null
		}];
        return {
            expandId: '',
            title: '联系人排序',
            isDialogVisible: false,
            treeData: [], //树形数据
            machineryTreeData: JSON.parse(JSON.stringify(machineryTree)),
            defaultProps: {
                children: 'children',
                label: 'name',
                plusIcon: true,
            },
            groupId: -7, //分组id
            tableData: [], //联系人数据
            total: 0, //数据总数
            currentPage: 1, //当前页
            pageSize: 10, //每页条数
            contactIds: [], //联系人id
            orderIds: [], //排序后的contactorId
            groupType: 'contactor', //分组类型
            copyTableData: [], //复制联系人数组
            controlOnStart: true,
            temporaryEvtsArray: [],
		    treeID: 0, //类别ID
			parentID: 0, //类别父级ID
			parentName: '', //类别父级名称
            treeName: '', //类别名称key: ''
            type: '', //通讯录类型
            key: '', //搜索关键字
        };
    },
    watch: {
        treeData(newValue, oldValue) {
            /* console.log(
                "this.$parent['formData' + this.$parent.tabPosition].treeDataItem",
                this.$parent['formData' + this.$parent.tabPosition].treeDataItem
            );
            this.expandId = this.$parent[
                'formData' + this.$parent.tabPosition
            ].treeDataItem.groupId;*/
        },
    },
    mounted() {},
    methods: {
        clone({ name, id }) {
            return { name, id: id };
        },
        move(){
            /*if(this.tableData.length==10){
                this.$message({
                    message: '该页已满，请拖到其它页 (*^__^*)',
                    type: 'error',
                });
                return false;
            }*/
        },
        pullFunction() {
            return this.controlOnStart ? 'clone' : true;
        },
        start({ originalEvent }) {
            this.controlOnStart = originalEvent.ctrlKey;
        },
        rightEnd(evt) {
            //右侧拖动
            if(this.groupId == "" || this.groupId == null || this.groupId == undefined) {
                 this.$message({
                    message: '不能在默认展示页进行排序，请选择分组',
                    type: 'error'
                })
                return ;
            }
            if (evt.to.className == 'dragArea list-group') {
                this.sortData(evt.item.getAttribute('datasetid'));
            } else {
            }
        },
        leftEnd(evt) {
            //左侧拖动结束后
            if(this.groupId == "" || this.groupId == null || this.groupId == undefined) {
                 this.$message({
                    message: '不能在默认展示页进行排序，请选择分组',
                    type: 'error'
                })
                return ;
            }
            if (
                this.temporaryEvtsArray.filter(item => {
                    return item.id == evt.item.getAttribute('datasetid');
                }).length == 0
            ) {
                this.temporaryEvtsArray.push({
                    id: evt.item.getAttribute('datasetid'),
                    tableData: this.tableData,
                    groupId: this.groupId,
                    page: this.currentPage,
                    size: this.pageSize,
                });
            }

            if (evt.to.className == 'dragArea list-groups') {
            } else {
                this.contactorIds = [];
                this.orderIds = [];
                for (let i = 0; i < this.tableData.length; i++) {
                    this.contactorIds.push(this.tableData[i].id);
                    this.orderIds.push(i);
                }
                console.log(this.contactorIds);
                let data = {
                    order: this.orderIds,
                    contactorId: this.contactorIds,
                    groupId: this.groupId,
                    type: 'contactor',
                    page: this.currentPage,
                    size: this.pageSize,
                };
                this.$http('/emergency/preparation/contactor/contactorOrder', data).then(res => {
                    if (res.errorcode != 0) {
                        this.$message({
                            message: '排序失败',
                            type: 'error'
                        })
                    } else {
                        this.$message({
                            message: '排序成功',
                            type: 'success'
                        })
                    }
                })
            }
        },
        //排序时调用的方法
        sortData(id) {
            var self = this;
            var evt = this.temporaryEvtsArray.find(item => {
                return item.id == id;
            });
            inside(evt.tableData, evt.groupId, evt.page, evt.size);
            this.temporaryEvtsArray = this.temporaryEvtsArray.filter(item => {
                return item.id != id;
            });
            inside(
                this.tableData,
                this.groupId,
                this.currentPage,
                this.pageSize
            );

            function inside(tableData, groupId, currentPage, pageSize) {
                self.contactorIds = [];
                self.orderIds = [];
                for (let i = 0; i < tableData.length; i++) {
                    self.contactorIds.push(tableData[i].id);
                    self.orderIds.push(i);
                }
                console.log(self.contactorIds);
                let data = {
                    order: self.orderIds,
                    contactorId: self.contactorIds,
                    groupId: groupId,
                    type: 'contactor',
                    page: currentPage,
                    size: pageSize,
                };
                self.$http('/emergency/preparation/contactor/contactorOrder', data).then(res => {
                    if (res.errorcode != 0) {
                        self.$message({
                            message: '排序失败',
                            type: 'error'
                        })
                    } else {
                        self.$message({
                            message: '排序成功',
                            type: 'success'
                        })
                    }
                })
            }
        },
        //关闭排序窗口
        closeDialog() {
            this.isDialogVisible = false;
            this.tableData = [];
            this.treeData = [];
        },
		/** 
         * @author qinjiaqi
         * @param {type} 没有
         * @return {type} undefined
         * @description：获取分组数据
         */
        getTree(id) {
            this.copyTableData = [];
            this.tableData = [];
            this.treeData = [];
            this.machineryTreeData[0].children = [];
            if(this.type == 'machinery') {
                let data = {
					menuId:this.$store.state.menu.menuID
				};
				this.$http('/emergency/preparation/machinery/topTree', data).then(res => {
                    this.machineryTreeData[0].children = res.data; //直接赋给treedata不行
                    this.treeData = this.machineryTreeData[0].children
                    // this.groupId = -7
                    if(id){
                        this.groupId = id
                        this.treeID = id
                    }else{
                        this.groupId = -7
                    }
					this.findAllContactor()
					this.chooseTree()
				})
                return ;
            }
        	let data = {
				type: this.type,
				menuId: this.$store.state.menu.menuID
			};
			this.$http('/emergency/preparation/contactorGroup/topTree', data).then(res => {
				this.treeData = [res.data];
                // this.groupId = -7
                if(id){
                    this.groupId = id
                    this.treeID = id
                }else{
                    this.groupId = -7
                }

				this.findAllContactor()
				this.chooseTree()
			})
        },
		/** 
         * @author qinjiaqi
         * @param {type} 没有
         * @return {type} undefined
         * @description：点击树形菜单
         */
        handleNodeClick(data, node) {
            if(this.groupId == 0) this.groupId = -7;
            else this.groupId = data.id;
            this.copyTableData = [];
            this.currentPage = 1;
			this.treeID = data.id; //当前选中Id
			this.treeName = data.name; //当前选中名称
			this.key = '';
			this.findAllContactor();
        },
		chooseTree() { //默认选中树形
			this.$nextTick(function() {
				this.$refs.tree.setCurrentKey(this.treeID);
			})
        },
		/** 
         * @author qinjiaqi
         * @param {type} 没有
         * @return {type} undefined
         * @description：获取树节点对应的联系人
         */
        findAllContactor() {
            if(this.groupId == 0) this.groupId = -7;
            console.log("this.groupId",this.groupId)
            if(this.type == "phone"){
                let id = this.treeID;
                let key = this.key;
                let data = {
                   // dictType: "governmentAffairs",
                    groupId: this.groupId,
                   // page: this.currentPage,
                   // searchText: key,
                   // size: this.pageSize,
                   // type: "phone",
                };
                this.$http('/emergency/preparation/contactor/contactorOrderList', data).then(res => {
                    this.tableData = res.data.contactors;
                    this.total = res.data.total;
                    for (let i in this.copyTableData) {
                        for (let j in this.tableData) {
                            if (this.copyTableData[i].id == this.tableData[j].id) {
                                this.tableData.splice(j, 1);
                            }
                        }
                    }
                })
            } else if(this.type == "machinery") {
				let id = this.treeID;		
				let key = this.key;
				let data = {
                    //dictType: "machinery",
                    groupId: this.groupId,
                    //page: this.currentPage,
                    //searchText: key,
                    //size: this.pageSize,
                    //type: "phone",
				};
				this.$http('/emergency/preparation/contactor/contactorOrderList', data).then(res => {
					let data = res.data.contactors;
                    this.tableData = res.data.contactors;
                    this.total = res.data.total;
                    for (let i in this.copyTableData) {
                        for (let j in this.tableData) {
                            if (this.copyTableData[i].id == this.tableData[j].id) {
                                this.tableData.splice(j, 1);
                            }
                        }
                    }
				})
            } else if(this.type == "gliaison") {
                let id = this.treeID;  
                let key = this.key;
                let data = {
                    //dictType: "primaryLevel",
                    groupId: this.groupId,
                    //page: this.currentPage,
                    //searchText: key,
                    //size: this.pageSize,
                    //type: "phone",
                };
                this.$http("/emergency/preparation/contactor/contactorOrderList", data).then((res) => {
                    this.tableData = res.data.contactors;
                    this.total = res.data.total;
                    for (let i in this.copyTableData) {
                        for (let j in this.tableData) {
                            if (this.copyTableData[i].id == this.tableData[j].id) {
                                this.tableData.splice(j, 1);
                            }
                        }
                    }
                });
            }
        },
        //改变页数时调用的方法
        pageChange(val) {
            console.log(val);
            this.currentPage = val;
            this.findAllContactor();
        },
    },
};
</script>

<style scoped>
.tree {
    height: 540px;
    background-color: white;
    border: 1px solid rgba(211, 215, 219, 1);
}

.right {
    height: 540px;
    margin-bottom: 10px;
    border: 1px solid rgba(211, 215, 219, 1);
}
.el-tag {
    cursor: pointer;
}
.el-tree--highlight-current
    >>> .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #c0c0c0;
}
.el-scrollbar >>> .el-scrollbar__wrap {
    overflow-x: hidden;
}
</style>
