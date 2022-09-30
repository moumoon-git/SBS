<!--
 * @Author: yaoweixin
 * @Date: 2020-08-14 18:00:40
 * @LastEditors: yaoweixin
 * @LastEditTime: 2020-12-11 14:01:01
 * @Description: 专题模板
 * @FilePath: \SBSNEW\src\views\modules\specialTopic\specialTopicTemplate\specialTopicTemplate.vue
-->
<template>
    <div class="specialTopicTemplate">
        <div class="mainContainer">
            <!-- 侧边部分 -->
            <div class="aside">
                <div class="buttonWrapper">
                    <div class="searchButton">搜索</div>
                    <div class="increaseGroup">新增分组</div>
                </div>
                <div class="allGroupContainer">
                    <div class="headerTitle">
                        全部专题模板
                    </div>
                    <div class="content">
                        <div class="custom-tree-container">
                            <div class="block">
                            <!-- 专题分组树 -->
                                <el-tree
                                :data="data"
                                node-key="id"
                                default-expand-all
                                :expand-on-click-node="false"
                                :props="treeProps"
                                @node-click="handleClick">
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                    <i class="el-icon-folder-opened"></i>
                                    <span>{{ node.label }}</span>
                                    <span>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        icon="el-icon-edit"
                                        >
                                    </el-button>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        icon="el-icon-delete"
                                        >
                                    </el-button>
                                    </span>
                                </span>
                                </el-tree>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 主体部分 -->
            <div class="main">
                <div class="topHeader">
                    <el-button type="primary" class="addButton" @click="addTemplate">新增模板</el-button>
                </div>
                <!-- 专题模板表格 -->
                <div class="bottomContent">
                    <el-table
                    :data="tableData"
                    style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="专题模板名称"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="remark"
                        label="专题模板描述"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="groupIdString"
                        label="所属分组">
                    </el-table-column>
                    <el-table-column
                        prop="gmtCreate"
                        label="创建时间">
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="状态">
                        <template slot-scope="scope">
                            <el-button
                            v-if="scope.row.status == 1"
                            size="mini"
                            @click="handleChangeState(scope.$index, scope.row)">已发布</el-button>
                            <el-button
                            v-else
                            size="mini"
                            @click="handleChangeState(scope.$index, scope.row)">已停用</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                            <el-button
                            v-if="scope.row.status == 1"
                            size="mini"
                            @click="handleChangeState(scope.$index, scope.row)">停用</el-button>
                            <el-button
                            v-else
                            size="mini"
                            @click="handleChangeState(scope.$index, scope.row)">发布</el-button>
                            <el-button
                            size="mini"
                            @click="handleLook(scope.$index, scope.row)">查看</el-button>
                            <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <!-- 编辑专题弹框 -->
        <editSpecialTopicDialog  ref="specialTopicDialog"></editSpecialTopicDialog>
        <!-- 新增专题弹框 -->
        <addSpecialTopicDialog ref="addSpecialTopicDialog"></addSpecialTopicDialog>
        <!-- 查看专题弹框 -->
        <LookSpecialTopicDialog ref="lookSpecialTopicDialog"></LookSpecialTopicDialog>
    </div>
</template>
<script>
import LookSpecialTopicDialog from './components/LookSpecialTopicDialog.vue'
import editSpecialTopicDialog from './components/editSpecialTopicDialog.vue'
import addSpecialTopicDialog from './components/addSpecialTopicDialog.vue'
export default {
    name: 'specialTopicTemplate',
    data() {
      const data = [];
      return {
        data: JSON.parse(JSON.stringify(data)),//专题分组数据
        tableData: [],//模板表格数据
        treeProps: {//分组树默认配置
            label: (data, node)=>{
            console.log(data, node)
            return data.name
            },
        },
        treeIdArr: [],
        dialogShow: false,
        rowId: 0
      }
    },
    methods: {
        /**
         * @description: 修改模板状态
         * @param {int,object}  index:模板索引，row: 模板对象
         * @return {type} 
         */
        handleChangeState(index,row) {
            let rowStatus = ''
            if(row.status == 1) {
                rowStatus = '2'
            }else {
                rowStatus = '1'
            }
            var that = this
            console.log('索引为',index,row)
            this.$http({
                url: this.$http.adornUrl('/fk/fkTemplate/updateStatus'),
                method: 'post',
                data: this.$http.adornData({
                id: row.id.toString(),
                status: rowStatus
                })
            }).then(({data}) => {
                if(data && data.code == 0) {
                        that.$http({
                            url: that.$http.adornUrl('/fk/fkTemplate/list'),
                            method: 'post',
                            data: that.$http.adornData({
                            groupIds: that.treeIdArr,
                            page: "1",
                            limit: "10",
                            search: ""
                            })
                        }).then(({data}) => {
                            console.log('表格数据为',data)
                            that.tableData = data.page.list
                        })
                }
            })
        },
        addTemplate() {
            // this.$refs.addSpecialTopicDialog.itemIndex = 0
            this.$refs.addSpecialTopicDialog.dialogVisible = true
        },
        /**
         * @description: 
         * @param {int,object} index:模板的索引,row: 模板的详细数据
         * @return {type} 
         */
        handleLook(index,row) {
            this.$refs.lookSpecialTopicDialog.init(row.id)
            this.$refs.lookSpecialTopicDialog.dialogVisible = true
        },
        /**
         * @description: 编辑模板
         * @param {int,object} index:模板的索引,row: 模板的详细数据
         * @return {type} 无
         */
        handleEdit(index,row) {
            console.log('点击编辑',index,row)
            this.$refs.specialTopicDialog.init(row)
            this.$refs.specialTopicDialog.dialogVisible = true
        },
        /**
         * @description: 删除模板
         * @param {int,object} index:模板的索引,object: 模板的详细数据
         * @return {type} 无
         */
        handleDelete(index,row) {
            var that = this
            var ids = []
            ids.push(row.id)
            this.$http({
                url: this.$http.adornUrl('/fk/fkTemplate/delete'),
                method: 'post',
                data: this.$http.adornData({
                ids: ids
                })
            }).then(({data}) => {
                console.log('删除后返回的数据为',data)
                if(data.code === 0) {
                    that.$http({
                            url: that.$http.adornUrl('/fk/fkTemplate/list'),
                            method: 'post',
                            data: that.$http.adornData({
                            groupIds: that.treeIdArr,
                            page: "1",
                            limit: "10",
                            search: ""
                            })
                        }).then(({data}) => {
                            console.log('表格数据为',data)
                            that.tableData = data.page.list
                        })
                }
            })
        },
        /**
         * @description: 点击专题节点获得相应的专题表格数据
         * @param {object} Node:节点对象
         * @return {type} 
         */
        handleClick(Node) {
            this.treeIdArr = []
            console.log('dianji',Node)
            this.addGroupIds(Node)
            console.log("点击获得得节点及子节点为",this.treeIdArr)
             this.$http({
                url: this.$http.adornUrl('/fk/fkTemplate/list'),
                method: 'post',
                data: this.$http.adornData({
                groupIds: this.treeIdArr,
                page: "1",
                limit: "10",
                search: ""
                })
            }).then(({data}) => {
                console.log('表格数据为',data)
                this.tableData = data.page.list
            })

        },
        /**
         * @description: 获得当前节点及其子节点的id
         * @param {object} node: 当前节点对象
         * @return {type} 
         */
        addGroupIds(node) {
            this.treeIdArr.push(node.id)
            if(node.children) {
            for(let i = 0; i < node.children.length; i++) {
                 this.addGroupIds(node.children[i])
                }
            }
            return 

        }
    },
    created() {
       
    },
    mounted() {
        this.$http({
        url: this.$http.adornUrl('/fk/fkTemplateGroup/list'),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({data}) => {
          console.log('树形列表为，',data)
          this.data = data.data
          this.$nextTick(() => {
               var is = document.querySelectorAll('.el-tree-node__children .el-tree-node .el-tree-node__content .is-leaf+.custom-tree-node .el-icon-folder-opened')
        for(var i = 0;i< is.length; i++) {
            
            is[i].parentNode.removeChild(is[i])
        }
          })
          
      })
       
    },
    components: {
        editSpecialTopicDialog,
        addSpecialTopicDialog,
        LookSpecialTopicDialog
    }
}
</script>
<style lang="less" scoped>
.specialTopicTemplate {
  //盒子模型
  .mainContainer {
      display: flex;
    //外观
    .aside {
        width: 380px;
        height: 1000px;
        background-color: #fff;
        //盒子模型
        .buttonWrapper {
            display: flex;
            padding: 15px 30px;
        //外观
        .searchButton {
            border: 1px solid #ccc;
            text-align: center;
            width: 150px;
            height: 30px;
            line-height: 30px;
        }
        //外观
        .increaseGroup {
            border: 1px solid #ccc;
            text-align: center;
            width: 150px;
            margin-left: 20px;
            height: 30px;
            line-height: 30px;
        }
        }

        .allGroupContainer {
        //外观
        .headerTitle {
            background-color: #00a9f2;
            color: #fff;
            width: 300px;
            height: 30px;
            line-height: 30px;
            text-align: left;
            margin-left: 30px;
        }

        .content {

        }
        }
    }

    .main {
        margin-left: 15px;
        width: 1500px;
        //盒子模型，外观
        .topHeader {
            height: 70px;
            background-color: #fff;
            padding-top: 15px;
            padding-right: 10px;
            display: flex;
            flex-direction: row-reverse;
            .addButton {
                
            }
        }
        .bottomContent {
            margin-top: 10px;
        }

    }
  }
}
</style>