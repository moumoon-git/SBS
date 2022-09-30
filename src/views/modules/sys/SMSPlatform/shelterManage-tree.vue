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
          >查看</el-button
        >
      </el-tooltip>
      <el-tooltip effect="dark" content="添加" placement="top">
        <el-button
          type="primary"
          size="small"
          @click="addTree()"
          >添加</el-button>
      </el-tooltip>

      <el-tooltip effect="dark" content="修改" placement="top">
        <el-button
          type="warning"
          size="small"
          @click="updateTree()"
          >修改</el-button>
      </el-tooltip>

      <el-tooltip effect="dark" content="删除" placement="top">
        <el-button
          type="danger"
          size="small"
          @click="deleteTree()"
          >删除</el-button>
      </el-tooltip>

    </el-header>

    <div class="treeClass">
      <ul class="SMSPlatformList">
        <li v-for="(item,index) in list" :key="item.id" class="oneSMSPlatform" :class="{'bgc':idx == index}" @click="handleNodeClick(item,index)">
          {{item.name}}
        </li>
      </ul>
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
      checkedIds: [], // 当前选中的id数组
      idx: 0,
    }
  },
  created(){
    //this.handleNodeClick(this.list[0],0)
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
      this.$emit('showTree',this.currentTreeId)
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
      this.$emit('deleteTree', this.currentTreeId)
    },

    // 点击树形更新表格
    handleNodeClick (obj,index) {
      this.idx = index
      this.$emit('handleNodeClick', obj)
      this.currentTreeId = obj.id
    }
  }
}
</script>

<style lang="scss" scoped>
.bgc{
  background-color: #ccc;
}
.treeClass {
  height: 670px;
  margin-top: 8px;
  border: 1px solid rgba(229, 229, 229, 1);
  background-color: #fff;
  .SMSPlatformList{
    padding: 0 5px;
    list-style: none;
    .oneSMSPlatform{
      border: 1px solid #ccc;
      border-radius: 3px;
      padding: 5px;
      margin: 5px 0;
    }
  }
}
.treebox > .treeboxtop {
  line-height: 60px;
}
.treebox .el-tree-node__content {
  height: 35px;
  margin-left: 10px;
}
</style>
