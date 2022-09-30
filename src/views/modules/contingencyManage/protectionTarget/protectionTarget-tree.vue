<template>
  <div class="treebox">
    <el-header
      style="height: 48px;padding: 5px;border: 1px solid rgb(229, 229, 229);text-align: center;padding: 5px;display:flex;"
      class="operation-btn"
    >
      <el-tooltip effect="dark" content="查看" placement="top">
        <el-button
          type="success"
          size="small"
          @click="showTree()"
          v-if="isAuth('mail:mailgroup:info')"
          >查看</el-button
        >
      </el-tooltip>
      <el-tooltip effect="dark" content="添加" placement="top">
        <el-button
          type="primary"
          size="small"
          @click="addTree()"
          v-if="isAuth('mail:mailgroup:save')"
          >添加</el-button
        >
      </el-tooltip>
      <el-tooltip effect="dark" content="修改" placement="top">
        <el-button
          type="warning"
          size="small"
          @click="updateTree()"
          v-if="isAuth('mail:mailgroup:update')"
          >修改</el-button
        >
      </el-tooltip>
      <el-tooltip effect="dark" content="删除" placement="top">
        <el-button
          type="danger"
          size="small"
          @click="deleteTree()"
          v-if="isAuth('mail:mailgroup:delete')"
          >删除</el-button
        >
      </el-tooltip>
    </el-header>
    <div class="treeClass">
      <el-scrollbar
        wrap-class="list"
        wrap-style="color: red;max-height:596px;"
        view-class="view-box"
        :native="false"
      >
        <el-tree
          class="treeboxbotten"
          show-checkbox
          @node-drop="modifythename"
          :default-expand-all="Treeexpansion"
          @node-click="handleNodeClick"
          :data="list"
          :props="listProps"
          :default-checked-keys="checkedIds"
          node-key="id"
          style="padding-top: 10px;"
          current-node-key
          highlight-current
          @check="checkGroupNode"
          ref="tree"
          
        >
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  props: ['list', 'listProps', 'Treeexpansion'],
  data () {
    return {
      groupingcheckbox: [],
      currentTreeId: '',
      checkedIds: [] // 当前选中的id数组
    }
  },
  methods: {
    modifythename (before, after, inner, event) {
      this.$emit('modifythename', before, after, inner, event)
    },
    // 查看Tree
    showTree () {
      if (!this.currentTreeId) {
        this.$message.error('请选择一个分组!')
        return;
      }
      this.$emit('showTree')
    },
    // 添加Tree
    addTree () {
      this.$emit('addTree')
    },
    // 修改Tree
    updateTree () {
      if (!this.currentTreeId) {
        this.$message.error('请选择一个分组!')
        return;
      }
      this.$emit('updateTree', this.currentTreeId)
    },
    // 删除Tree
    deleteTree () {
      if (this.currentTreeId === '' && this.groupingcheckbox.length == 0) {
        this.$message({
          message: '请选择要删除的分组!',
          type: 'error',
          offset:100
        });
        return;
      }
      this.$emit('deleteTree')
    },
    // 监听树形复选框的勾选id
    checkGroupNode (currentNode, arr) {
      var that = this
      this.groupingcheckbox = currentNode.id
      // console.log(this.groupingcheckbox, arr, currentNode)
      if (currentNode.parentId === arr.checkedKeys[0]) {
        arr.checkedKeys.splice(arr.checkedKeys.indexOf(currentNode.parentId), 1)
      }

      this.$emit('setCheckedIds', arr.checkedKeys, arr.checkedNodes)
      
    },
    // 点击树形更新表格
    handleNodeClick (obj) {
      this.$emit('handleNodeClick', obj)
      this.currentTreeId = obj.id
      // console.log(this.currentTreeId)
      /*let groupId = obj.id
        //请求表格数据
        this.$http({
          url: this.$http.adornUrl(`/mail/mailcontactor/list`),
          method: 'POST',
          params: this.$http.adornParams({
            groupId: groupId
          })
        }).then(({data}) => {
          this.platShareMenuList = data.data
        })*/
    }
  }
}
</script>

<style scoped>
.treeClass {
  height: 596px;
  margin-top: 8px;
  border: 1px solid rgba(229, 229, 229, 1);
  background-color: #fff;
}
.treebox > .treeboxtop {
  line-height: 60px;
}
.treebox .el-tree-node__content {
  height: 35px;
  margin-left: 10px;
}
</style>
