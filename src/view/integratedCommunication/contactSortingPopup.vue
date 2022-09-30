<!--@author：llp-->
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
            <el-scrollbar style="height: 100%">
              <el-tree
                :data="treeData"
                highlight-current
                ref="tree"
                @node-click="handleNodeClick"
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
                  <draggable
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
                      :dataSetId="element.id"
                    >{{element.name}}</el-tag>
                    <el-tag style="display: none"></el-tag>
                  </draggable>
                </el-scrollbar>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="right">
                <el-scrollbar style="height: 100%;text-align: left;">
                  <draggable
                    class="dragArea list-groups"
                    @end="rightEnd"
                    :list="copyTableData"
                    :move="move"
                    group="people"
                    style="height: 520px;width: 100%;"
                  >
                    <el-tag
                      v-for="element in copyTableData"
                      :key="element.id"
                      style="margin-left: 10px;margin-top:10px"
                      :dataSetId="element.id"
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
        return {
            title: '联系人排序',
            isDialogVisible: false,
            treeData: [], //树形数据
            defaultProps: {
                children: 'children',
                label: 'name',
                plusIcon: true,
            },
            groupId: -1, //分组id
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
        };
    },
    methods: {
        clone({ name, id }) {
            return { name, id: id };
        },
        move(){
            if(this.tableData.length==10){
                this.$message({
                    message: '该页已满，请拖到其它页 (*^__^*)',
                    type: 'error',
                });
                return false;
            }
            
        },
        pullFunction() {
            return this.controlOnStart ? 'clone' : true;
        },
        start({ originalEvent }) {
            this.controlOnStart = originalEvent.ctrlKey;
        },
        rightEnd(evt) {
            //右侧拖动
            console.log('rightEnd evt evt evt', evt);
            if (evt.to.className == 'dragArea list-group') {
                this.sortData(evt.item.getAttribute('datasetid'));
            } else {
            }
        },
        leftEnd(evt) {
            //左侧拖动结束后
            // console.log("leftEnd evt evt.item",evt,evt.item.getAttribute("datasetid"))

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

                this.$api.contactorOrder(data).then(res => {
                    if (res.errorcode != 0) {
                        this.$message.error('排序失败!');
                    } else {
                        this.$message.success('排序成功!');
                        this.$emit('getContactorList');
                    }
                });
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

                self.$api.contactorOrder(data).then(res => {
                    if (res.errorcode != 0) {
                        self.$message.error('排序失败!');
                    } else {
                        self.$message.success('排序成功!');
                        self.$emit('getContactorList');
                    }
                });
            }
        },
        //关闭排序窗口
        closeDialog() {
            this.isDialogVisible = false;
            this.tableData = [];
            this.treeData = [];
        },
        //获取分组数据
        getTree() {
            let data = {};
            this.copyTableData = [];
            this.$api.groupCollection(data).then(res => {
                this.treeData = res.data;
            });
        },
        /**
         * @lastEditor hexinting
         * @lastDate 2020-11-2
         * @description 树点击查询的方法
         */
        handleNodeClick(data, node) {
            this.groupId = data.id;
            this.findAllContactor();
            this.copyTableData = [];
            this.currentPage = 1;

            // bug 7851 author：hexinting date:2020-11-2
            let params = {
                groupId: this.groupId
            }
            this.$api.autoSort(params).then(res => {
                console.log(res)
            })
        },
        /**
         * @lastAuthor hexinting
         * @lastDate 2020-11-2
         * @description 查询联系人
         */
        findAllContactor() {
            // let data = {
            //   groupId: this.groupId,
            //   page: this.currentPage,
            //   size: this.pageSize,
            //   thisGroupOnly: true
            // };
            // bug 7851 date:2020-11-2 author:hexinting 将请求接口进行token验证
            let data = {
                groupId: this.groupId
                // page: this.currentPage, // 去掉分页，查全部数据 author:hexinting date:2020-9-27
                // size: this.pageSize,
            }
            this.$api.contactorOrderList(data).then(res => {
                console.log('res: ', res);
                if (res.errorcode === 0) {
                    let data = res.data.contactors;
                    for (let i in this.copyTableData) {
                        for (let j in data) {
                            if (this.copyTableData[i].id == data[j].id) {
                                data.splice(j, 1);
                            }
                        }
                    }
                    this.tableData = data;
                    console.log(data);
                    this.total = res.data.total;
                }
            })

            // this.$api.contactorList(data).then(res => {
            //   if (res.errorcode != 0) {
            //     this.$message({
            //       message: res.msg,
            //       type: "error"
            //     });
            //     return;
            //   }
            //   let data=res.data.list;
            //   for(let i in this.copyTableData){
            //     for(let j in data){
            //       if(this.copyTableData[i].id==data[j].id){
            //         data.splice(j,1)
            //       }
            //     }
            //   }
            //   this.tableData = data;
            //   console.log(data)
            //   this.total = res.data.totalCount;
            // })
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
