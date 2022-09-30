<template>
  <div class="treebox">
    <div class="treeClass">
      <el-header
        style="height: 48px;padding: 5px;border: 1px solid rgb(229, 229, 229);text-align: center;padding: 5px;display:flex"
        class="operation-btn"
        v-if="buttonVisible"
      >
        <el-tooltip effect="dark" content="查看" placement="top">
          <el-button type="primary" size="small" @click="showTree()">查看</el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="添加" placement="top">
          <el-button type="primary" size="small" @click="addTree()">新增</el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="删除" placement="top">
          <el-button type="primary" size="small" @click="deleteTree()">删除</el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="修改" placement="top">
          <el-button type="primary" size="small" @click="updateTree()">修改</el-button>
        </el-tooltip>
      </el-header>
      <el-scrollbar
        wrap-class="list"
        wrap-style="color: red;max-height:679px;"
        view-class="view-box"
        :native="false"
      >
        <el-tree
          class="treeboxbotten"
          accordion
          :show-checkbox="buttonVisible"
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
          :check-strictly="!buttonVisible"
        ></el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import bus from "../../../common/js/eventBus";
export default {
  props: ["list", "listProps", "Treeexpansion", "buttonVisible"],
  data() {
    return {
      groupingcheckbox: [],
      currentTreeId: "",
      checkedIds: [] // 当前选中的id数组
    };
  },
  methods: {
    // 点击树形显示视频
    handleNodeClick(obj) {
      // if(obj.longitude){
      // console.log(obj)
      // bus.$emit('getSign',obj)
      // }
      this.$emit("handleNodeClick", obj);
      this.currentTreeId = obj.id;
    },
    //查看Tree
    showTree(){
      if(!this.currentTreeId){
        this.$message.error("请选择一个分组!");
        return;
      }
      this.$emit("showTree");
    },
    //添加Tree
    addTree() {
      this.$emit("addTree");
    },
    //修改Tree
    updateTree() {
      if (!this.currentTreeId) {
        this.$message.error("请选择一个分组!");
        return;
      }
      this.$emit("updateTree");
    },
    //删除Tree
    deleteTree() {
      if (this.groupingcheckbox.length == 0) {
        this.$message({
          message: "请选择要删除的分组!",
          type: "error",
          offset: 100
        });
        return;
      }
      this.$emit("deleteTree");
    },
    //监听树形复选框的勾选id
    checkGroupNode(id, arr) {
      this.groupingcheckbox = arr.checkedKeys;
      // console.log("监听树形复选框的勾选id",this.groupingcheckbox,arr,id);
      this.$emit("setCheckedIds", arr.checkedKeys, arr.checkedNodes);
    }
  }
};
</script>

<style scoped>
.treeClass {
  height: 679px;
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
