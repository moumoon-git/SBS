<template>
<el-dialog :visible.sync="visible" width="1100px" center append-to-body :close-on-click-modal="false">
    <div slot="title">{{title}}</div>
    <el-row :gutter="20">
        <el-col :span="8">

            <el-tabs v-model="activePart" type="card">
                <el-tab-pane label="通讯联络网" name="first">
                    <el-scrollbar style="height: 500px;">
                        <el-tree v-if="visible" :data="treeData" :props="props" @node-click="nodeClick" ref="tree" node-key="id" :render-content="renderContent" highlight-current  :default-expanded-keys="[indexKey]"></el-tree>
                    </el-scrollbar>
                </el-tab-pane>
            </el-tabs>

            <div class="submit-btn">
                <el-button size="small" type="primary" @click="groupAppend">新增分组</el-button>
            </div>
        </el-col>
        <el-col :span="9">
            <el-input v-model="search" placeholder="请输入姓名或手机号码搜索" @keyup.enter.native="onSearch">
                <el-button slot="append" icon="el-icon-search" @click="onSearch" style="padding: 12px 12px;"></el-button>
            </el-input>
            <div class="candidate">
                <el-scrollbar style="height: 440px;">
                    <el-checkbox-group v-model="nameList">
                        <el-checkbox v-for="person in personList" :label="person.id" :key="person.id" @change="nameChanged(person.id)" style="text-align: left;">
                            <span v-if="person.mobile!=null">{{ person.name+'<'+person.mobile+'>' }}</span>
                            <span v-else>{{ person.name }}</span>
                        </el-checkbox>
                    </el-checkbox-group>

                </el-scrollbar>
                <el-pagination small @current-change="handleCurrentChange" :page-size="pageSize" :current-page="currentPage" layout="total, prev, pager, next" :total="total">
                </el-pagination>
            </div>
            <div class="submit-btn">
                <el-button size="small" type="primary" @click="handleAppend">新增联系人</el-button>
            </div>
        </el-col>
        <el-col :span="7">
            <div class="candidate" style="height: 540px;">
                <div class="header">
                    <span>选择结果</span>
                </div>
                <div style="padding-left: 10px;margin-top: 10px;text-align: left;">
                    <el-scrollbar style="height: 468px;">
                        <el-tag v-for="choose in chooseList" :key="choose.id" closable @close="chooseChanged(choose)" style="text-align: left;">
                            <span v-if="choose.mobile!=null">{{ choose.name+'<'+ choose.mobile+'>'}}</span>
                            <span v-else>{{ choose.name }}</span>
                        </el-tag>

                    </el-scrollbar>
                </div>
            </div>
            <div class="submit-btn">
                <el-button size="small" type="primary" @click="handleCommit">确定</el-button>
                <el-button size="small" type="info" @click="visible = false">取消</el-button>
            </div>

        </el-col>
    </el-row>

    <my-form ref="mychild" @fatherMethod="getList" :treeData='treeData'></my-form>
    <Liaison-netSide ref="child" @childMethod="childMethod"></Liaison-netSide>
</el-dialog>
</template>

<script>
import Form from '../ebs_LiaisonNet/LiaisonNetForm'
import LiaisonNetSide from '../ebs_LiaisonNet/LiaisonNetSide'
export default {
    props: ['title', 'dynamicTag'],
    inject: ['reload'],
    components: {
        'my-form': Form,
        'Liaison-netSide': LiaisonNetSide
    },
    data() {
        return {
            visible: false,
            activePart: 'first',
            search: "", //搜索
            topTreeID: 0, //树ID
            TreeName: '',
            parentID: "",
            parentName: "",
            treeData: [],
            props: {
                label: 'name',
                children: 'children'
            },
            chooseList: [],
            personList: [], // 所有联系人对象数组
            nameList: [], // 选中联系人id数组
            total: 0, //总条数
            currentPage: 1, // 当前页
            pageSize: 20,
            indexKey: 0,
        }
    },
    methods: {
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getList()
        },
        /**
         * @lastEditor hexinting
         * @lastDate 2020-11-16
         * @description 联系人搜索
         */
        onSearch() {
            // bug8417 author:hexinting date:20201116
            this.currentPage = 1;
            this.pageSize = 20;
            this.getList();
            // this.searchGetList()
        },
        handleCommit() {
            this.$emit('childByValue', this.chooseList);
            this.visible = false;
        },
        nameChanged(id) {
            let index = this.nameList.indexOf(id) // 判断是复选框取消选项还是选中选项
            if (index == -1) { // 该名字从选中项中删除
                for (let i in this.chooseList) {
                    if (this.chooseList[i].id == id) {
                        this.chooseList.splice(i, 1)
                        break;
                    }
                }
            } else { // 该名字添加到选中项中
                for (let i in this.personList) {
                    if (this.personList[i].id == id) {
                        let data = JSON.parse(JSON.stringify(this.personList[i])); // 复制姓名列表中的对象保存在选中人对象数组中
                        this.chooseList.push(data);
                        return;
                    }
                }
            }
        },
        // 点击标签删除按钮时删除标签
        chooseChanged(tag) {
            this.chooseList.splice(this.chooseList.indexOf(tag), 1);
            let index = this.nameList.indexOf(tag.id);
            if (index !== -1) {
                this.nameList.splice(index, 1);
            }
        },
        /**
         * @lastEditor hexinting
         * @lastDate 2020-11-16
         * @description 点击树节点触发事件
         */
        nodeClick(data, node) {
            let id = data.id;
            this.topTreeID = id;
            this.TreeName = data.name;
            this.parentID = node.parent.data.id;
            this.parentName = node.parent.data.name;
            this.search = '';
            // bug8417 author:hexinting date:20201116
            this.currentPage = 1;
            this.pageSize = 20;
            this.getList()
        },
        searchGetList() {
            let id = this.topTreeID
            let data = {
                groupId: id,
                key: this.search,
                page: this.currentPage,
                size: this.pageSize,
                type: 'phone',
                menuId: this.$store.state.menu.menuID
            }
            let CallbackReload = this;
            this.$http('/emergency/preparation/contactor/getList', data, CallbackReload).then(res => {
                this.personList = res.data.data;
                this.total = res.data.totalElements;
            })
        },
        getList() {
            let id = this.topTreeID
            let data = {
                groupId: id,
                key: this.search,
                page: this.currentPage,
                size: this.pageSize,
                type: 'phone',
                menuId: this.$store.state.menu.menuID
            }
            let CallbackReload = this;
            this.$http('/emergency/preparation/contactor/getList', data, CallbackReload).then(res => {
                this.personList = res.data.data;
                this.total = res.data.totalElements;
            })
        },
        childFn() {
            this.topTreeID = 0;
            this.currentPage = 1;
            let data = {
                type: 'phone',
                menuId: this.$store.state.menu.menuID
            };
            let CallbackReload = this;
            this.$http('/emergency/preparation/contactorGroup/topTree', data, CallbackReload).then(res => {
                this.treeData = [res.data];
                this.getList()
                this.chooseTree()
                if (this.dynamicTag) {
                    this.chooseList = JSON.parse(JSON.stringify(this.dynamicTag));
                    let arrays = [];
                    this.dynamicTag.forEach(function (data) {
                        arrays.push(data.id);
                    });
                    this.nameList = arrays;
                }
            })
        },
        chooseTree() { //默认选中树形
            this.$nextTick(function () {
                this.$refs.tree.setCurrentKey(this.topTreeID);
            })
        },
        dynamicTags() {
            this.chooseList = [];
            this.personList = [];
            this.nameList = [];
        },
        renderContent(h, { //树形控件title提示
            node,
            data,
            store
        }) {
            return ( `< span class = "custom-tree-node" >
                <
                span title = {
                    ${node.data.name}
                }
                class = "el-tree-node__label" > {
                    ${node.data.name}
                } < /span> </span > `);
        },
        handleAppend() { //新增
            if (this.topTreeID == 0) {
                this.$message({
                    type: 'warning',
                    message: '请选择一个分组进行新增联系人'
                })
                return
            }
            let data = {
                groups: [{
                    id: this.topTreeID,
                    name: this.TreeName
                }]
            };
            this.$refs.mychild.openModal(data, 'add');
        },
        groupAppend() {
            if (this.topTreeID == 0) {
                this.TreeName = this.treeData[0].name;
                this.parentID = '';
                this.parentName = '';
            }
            let data = {
                treeName: this.TreeName,
                treeID: this.topTreeID,
                parentID: this.parentID,
                parentName: this.parentName
            };
            this.$refs.child.openModal(data, 'add');
        },
        childMethod(data) {
            this.childFn();
            this.topTreeID = data.treeID;
            this.indexKey = data.treeID;
            this.TreeName = data.treeName;
            this.parentName = data.parentName;
            this.treeName = data.treeName;
        }
    }
}
</script>

<style scoped>
.el-input>>>.el-input__inner {
    padding: 0 4px;
}

.candidate {
    height: 500px;
    border-radius: 5px;
    padding-top: 10px;
    border: 1px solid #ccc;
    background-color: #fff;
    color: #303133;
    margin-top: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
}

.selected {
    min-height: 380px;
}

.submit-btn {
    margin-top: 20px;
    text-align: center;
}

.create-btn {
    float: right;
    margin: 10px;
}

.el-checkbox-group>>>.el-checkbox {
    display: block;
    margin-top: 5px;
    margin-left: 10px;
}

.el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
}

.el-scrollbar>>>.el-scrollbar__wrap {
    overflow-x: hidden;
}

.el-tree {
    min-width: 100%;
    display: inline-block !important;
}

.el-tree--highlight-current>>>.el-tree-node.is-current>.el-tree-node__content {
    background-color: #C0C0C0;
}

.header {
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
    padding: 12px 18px;
    color: #303133;
    font-size: 14px;
}
</style>
