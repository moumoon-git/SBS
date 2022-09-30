<!--@author：yf-->
<template>
  <div class="tree">
    <div v-if="buttonIsShow" class="icpVIdeo-btn-box">
      <el-button size="small" @click="addGroup">新增</el-button>
      <el-button size="small" @click="updateGroup">修改</el-button>
      <el-button size="small" @click="deleteGroup">删除</el-button>
    </div>
    <div v-if="buttonIsShow" style="height: 632px">
      <el-scrollbar style="height: 100%">
        <el-tree
          :data="treeData"
          :show-checkbox="showCheckbox"
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps"
          @node-click="handleNodeClick"
          draggable
          :allow-drop="allowDrop"
          @node-drop="handleDrop"
          accordion
        >
          <!--       <span class="treeDiv" slot-scope="{ node, data }">-->
          <!--          <span class="leftTree">-->
          <!--             {{ node.label }}-->
          <!--          </span>-->
          <!--         <span class="rightTree">-->
          <!--           <i class="el-icon-arrow-right"> </i>-->
          <!--           &lt;!&ndash;           <i :class="[rotate?'el-icon-arrow-right':'el-icon-arrow-down']" > </i>&ndash;&gt;-->
          <!--         </span>-->
          <!--      </span>-->
        </el-tree>
      </el-scrollbar>
    </div>
    <el-scrollbar v-else="buttonIsShow" style="height: 100%">
      <el-tree
        :data="treeData"
        :show-checkbox="showCheckbox"
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
        @node-click="handleNodeClick"
        accordion
      >
        <!--       <span class="treeDiv" slot-scope="{ node, data }">-->
        <!--          <span class="leftTree">-->
        <!--             {{ node.label }}-->
        <!--          </span>-->
        <!--         <span class="rightTree">-->
        <!--           <i class="el-icon-arrow-right"> </i>-->
        <!--           &lt;!&ndash;           <i :class="[rotate?'el-icon-arrow-right':'el-icon-arrow-down']" > </i>&ndash;&gt;-->
        <!--         </span>-->
        <!--      </span>-->
      </el-tree>
    </el-scrollbar>
    <!--分组信息-->
    <el-dialog :visible.sync="dialogVisible" :title="title" width="25%" @close="groupClose"
               :close-on-click-modal="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="100px">
        <el-form-item v-if="title=='修改分组'" label="所选分组:">
          <el-col :span="12">
            <el-input v-model="currentGroupName" disabled></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="分组名称:" prop="groupName">
          <el-col :span="12">
            <el-input v-model="ruleForm.groupName" show-word-limit maxlength="10"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item v-if="!checked && title=='新增分组'" prop="parentName" label="上级分组:">
          <el-col :span="12">
            <el-input v-model="ruleForm.parentName" disabled></el-input>
          </el-col>
          <el-col :span="6">
            <el-button size="mini" type="primary" @click="chooseGroup">选择</el-button>
          </el-col>
        </el-form-item>
      </el-form>
      <el-checkbox v-if="title=='新增分组'" v-model="checked">是否添加为上级分组</el-checkbox>
      <el-button @click="submitForm()">保存</el-button>
    </el-dialog>

    <!--内层弹窗-->
    <el-dialog width="400px" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false">
      <tree-search ref="treeSearch" @affirmDialog="affirmDialog" @cancelDialog="cancelDialog"></tree-search>
    </el-dialog>
  </div>
</template>

<script>
  import treeSearch from "@/view/eventManagement/eventHistory/plan/treeSearch"

  export default {
    name: "tree",
    props: ['treeData'],
    components: {
      treeSearch
    },
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'name',
          plusIcon: true,
        },
        rotate: false,
        showCheckbox: false,
        buttonIsShow: false,
        innerVisible: false,
        groupId: '',//分组id
        dialogVisible: false,//弹窗信息是否显示
        title: '',//标题,
        checked: true,
        parenId: '',//父id
        parentName: '',//上级id
        chooseData: [],//选择分组树
        currentGroupName: '',//当前选择分组
        ruleForm: {
          groupName: '',//分组名称
          parentName: '',//上级分组
        },//表单变量
        rules: {
          groupName: [{
            required: true, trigger: 'blur', message: '分组名称不能为空'
          },
          ],
          parentName: [
            {
              required: true, trigger: 'blur', message: '上级分组不能为空'
            },
          ]
        },//表单验证
        operate: '',//0->新增 1-> 更新 2->删除
        sortlist: []//排序后的分组
      }
    },
    methods: {
      addGroup() {
        this.dialogVisible = true;
        this.title = '新增分组';
      },
      submitForm() {
        if (this.title == '新增分组') {
          this.addMethods('ruleForm');
        } else if (this.title == '修改分组') {
          this.updateMethods('ruleForm');
        }
      },
      updateMethods(ruleForm) {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            let data;
            data = {
              id: this.groupId,
              name: this.ruleForm.groupName,
              code: this.groupType,
              operate: 1,
            };
            this.$api.updateGroup(data).then(res => {
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
                return
              }
              this.$message({
                message: '修改成功',
                type: "success"
              });
              this.groupId = null;
              this.dialogVisible = false;
              this.$emit("refreshData");
            })
          }
        });
      },
      addMethods(ruleForm) {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            let data;
            if (this.checked) {
              data = {
                name: this.ruleForm.groupName,
                code: this.groupType,
                operate: 0,
                pid: 0
              };
            } else {
              data = {
                name: this.ruleForm.groupName,
                code: this.groupType,
                operate: 0,
                pid: this.parenId
              };
            }
            this.$api.updateGroup(data).then(res => {
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
                return
              }
              this.$message({
                message: '新增成功',
                type: "success"
              });
              this.$refs.ruleForm.resetFields();
              this.dialogVisible = false;
              this.$emit("refreshData");
            })
          }
        });
      },
      updateGroup() {
        if (this.groupId == null || this.groupId == '') {
          this.$message({
            message: "请选中需要修改的分组!",
            type: "warning"
          });
          return;
        }
        if (this.groupId == -1) {
          this.$message({
            message: "当前所选分组名称不能修改",
            type: "warning"
          });
          return;
        }
        this.dialogVisible = true;
        this.title = '修改分组';
      },
      deleteGroup() {
        if (this.groupId == null || this.groupId == '') {
          this.$message({
            message: "请选中需要删除的分组!",
            type: "warning"
          });
          return;
        }
        if (this.groupId == -1) {
          this.$message({
            message: "当前所选分组名称不能删除",
            type: "warning"
          });
          return;
        }
        this.$confirm('删除当前分组?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteMethods();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除!'
          });
        });
      },
      deleteMethods() {
        let data = {
          id: this.groupId,
          code: this.groupType,
          operate: 2
        };
        this.$api.updateGroup(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          this.$message({
            message: '删除成功',
            type: "success"
          });
          this.groupId = null;
          this.$emit("refreshData");
        })
      },
      handleNodeClick(data, node) {
        this.groupId = data.id;
        this.currentGroupName = data.name;
        this.$emit('handleNodeClick', data, node)//点击方法
      },
      getChecked() {
        let currentCheckedKeys = this.$refs.tree.getCheckedKeys();
        return currentCheckedKeys
      },
      //选择上级分组
      chooseGroup() {
        console.log(this.groupType)
        switch (this.groupType) {
          case "phone":
            this.getTelephoneGroupingTree();
            break;
          case "sms":
            this.getSmsGroupListTree();
            break;
          case "faxgroup":
            this.getFaxGroupingListTree();
            break;
          case "VideoGroup":
            this.getVideoGroupTree();
            break;
          case "VideoTerminalGroup":
            this.getTerminalGroupListData();
            break;
          case "GroupTalk":
            this.getTalkGroupListTree();
            break;
        }
        this.innerVisible = true;
        setTimeout(() => {
          this.$refs.treeSearch.dataUpdating(this.chooseData, this.groupType);
        }, 500);
      },
      affirmDialog(filterText, filterId, typeData) {//内层确认按钮
        this.ruleForm.parentName = filterText;
        this.parenId = filterId;
        this.innerVisible = false;
      },
      cancelDialog() {//内层取消按钮
        this.innerVisible = false;
      },
      getTelephoneGroupingTree() {
        let data = {
          displayDefault: false
        };
        this.$api.telephoneGroupingTree(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          this.chooseData = res.data;
        })
      },
      //获取短信分组
      getSmsGroupListTree() {
        let data = {
          displayDefault: false
        };
        this.$api.smsGroupList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          console.log(res)
          this.chooseData = res.data;
        })
      },
      //获取传真分组
      getFaxGroupingListTree() {
        let data = {
          displayDefault: false
        };
        this.$api.faxGroupList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.chooseData = res.data;
        })
      },
      //获取视频分组树
      getVideoGroupTree() {
        let data = {
          displayDefault: false
        };
        this.$api.videoGroupList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.chooseData = res.data;
        })
      },
      //获取终端分组
      getTerminalGroupListData() {
        let data = {
          displayDefault: false
        };
        this.$api.terminalGroupList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.chooseData = res.data;
        })
      },
      //获取集群分组
      getTalkGroupListTree() {
        let data = {
          displayDefault: false
        };
        this.$api.talkGroupListTree(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          this.chooseData = res.data;
        })
      },
      groupClose() {
        this.$refs.ruleForm.resetFields();
        this.innerVisible = false;
      },
      setCurrentKey(id) {
        this.$refs.tree.setCurrentKey(id);//调用setCurrentKey方法设置当前节点高亮
      },
      allowDrop(draggingNode, dropNode, type) {
        if (draggingNode.level === dropNode.level) {
          if (draggingNode.data.aboveId  === dropNode.data.aboveId) {
            return type === 'prev' || type === 'next'
          }else {
           return false
          }
        }
      },
      handleDrop(draggingNode, dropNode, dropType, ev) {
        let sortArray = [];
        let ids = [];
        for (let i = 0; i <this.treeData.length; i++) {
          sortArray.push(i);
          ids.push(this.treeData[i].id);
        }
        let data = {
          id: ids,
          order: sortArray
        };
        this.$api.groupOrder(data).then(res => {
          if (res.errorcode == 0) {
            this.$message.success("排序成功!");
          } else {
            this.$message.error(res.msg);
          }
        })
      }

    }
  }
</script>

<style scoped>
  .tree {
    height: 583px;
    background-color: white;
    border: 1px solid rgba(211, 215, 219, 1);
  }
.icpVIdeo-btn-box{
  margin-top: 6px;

  display: flex;
  justify-content:space-around;
}
>>> .el-button+.el-button {
    margin-left: 0;
}
  >>> .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  >>> .el-tree-node > .el-tree-node_children {
  }

  >>> .el-tree-node__content {
    margin-top: 5px;
    min-width: 232px;
  }

  /*>>>.el-tree-node>.el-tree-node__children{*/
  /*overflow: visible !important;*/
  /*}*/
  >>> .treeDiv {
    width: 100%;
  }

  >>> .leftTree {
    display: inline-block;
    width: 70%;
    text-align: left;
  }

  >>> .rightTree {
    display: inline-block;
    width: 30%;
  }
  .el-tree--highlight-current>>>.el-tree-node.is-current>.el-tree-node__content {
    background-color: #C0C0C0;
  }
</style>
