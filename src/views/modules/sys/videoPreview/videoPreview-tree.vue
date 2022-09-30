<template>
  <div class="treebox">
    <div class="treeClass">
      <el-scrollbar
        wrap-class="list"
        wrap-style="color: red;max-height:679px;"
        view-class="view-box"
        :native="false"
      >
        
        <el-tree
          class="treeboxbotten"
          :default-expand-all="false"
          @node-click="handleNodeClick"
          :data="list"
          :props="listProps"
          :default-checked-keys="checkedIds"
          node-key="id"
          style="padding-top: 10px;"
          current-node-key
          highlight-current
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
  props: ['list', 'listProps', 'Treeexpansion'],
  data () {
    return {
      groupingcheckbox: [],
      currentTreeId: '',
      checkedIds: [] // 当前选中的id数组
    }
  },
  methods: {
    // 点击树形显示视频
    handleNodeClick (obj) {
      // if(obj.longitude){
      // console.log(obj)
        // bus.$emit('getSign',obj)
      // }
      this.$emit('handleNodeClick',obj)
    }
  }
}
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
