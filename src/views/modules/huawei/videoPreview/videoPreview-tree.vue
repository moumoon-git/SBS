<template>
  <div class="treebox">
    <div class="treeClass">
      <el-scrollbar
        wrap-class="list"
        wrap-style="color: red;max-height:679px;"
        view-class="view-box"
        :native="false"
      >
        <div
          class="videoTreeAll"
          style="
            padding-left: 25px;
            margin-top: 8px;
            color: black;
            cursor: pointer !important;
          "
          @click="getAll"
          :class="selectAll ? 'selectAllColor' : 'selectAllTreeColor'"
        >
          全部
        </div>
        <el-tree
          class="treeboxbotten"
          :default-expand-all="false"
          @node-click="handleNodeClick"
          :data="list"
          :props="listProps"
          :default-checked-keys="checkedIds"
          node-key="id"
          style="padding-top: 10px"
          current-node-key
          :highlight-current="!selectAll"
          ref="tree"
        >
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import bus from "../../../common/js/eventBus";
export default {
  props: ["list", "listProps", "Treeexpansion"],
  data() {
    return {
      groupingcheckbox: [],
      currentTreeId: "",
      checkedIds: [], // 当前选中的id数组
      selectAll: false,
    };
  },
  methods: {
    // 点击树形显示视频
    handleNodeClick(obj) {
      // if(obj.longitude){
      // console.log(obj)
      // bus.$emit('getSign',obj)
      // }
      this.selectAll = false;
      this.$emit("handleNodeClick", obj);
    },
    getAll() {
      this.selectAll = true;
      this.$emit("handleNodeClickAll");
    },
  },
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
.selectAllColor {
  background-color: #ebf6ff;
  /* border-left: 2px solid #0091ff; */
  color: #0091ff;
}
.selectAllTreeColor {
  background-color: #ffffff;
  border-left: none;
}
.videoTreeAll:hover {
  background-color: #f9fcff;
}
</style>
