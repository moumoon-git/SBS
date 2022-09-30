<template>
  <div class="AddressGroup">
    <p class="title">通讯录分组</p>

    <div style="display:inline-block;position: relative;" class="searchMargin">
      <img class="searchIcon" src="data:image/png;base64,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" alt />
      <el-input v-model="filterText" placeholder="请输入分组" clearable style="width:100%;padding:8px 0 8px 8px;"></el-input>
    </div>
    
    <el-scrollbar
          wrap-class="list"
          wrap-style="color: red;max-height:340px;"
          view-class="view-box"
          :native="false"
        >
          <el-tree
            class="treeGroup"
            draggable
            :default-expand-all="false"
            :data="list"
            :props="listProps"
            :default-checked-keys="checkedIds"
            node-key="id"
            current-node-key
            highlight-current
            @node-click="handleNodeClick"
            ref="tree"
            ></el-tree>
        </el-scrollbar>
  </div>
</template>

<script>
import bus from "@/views/common/js/eventBus";

export default {
  props:{
      list:{
          type: Array,
      },
      listProps:{
          type: Object,
      },
      
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  data() {
    return {
      checkedIds: [],
      filterText: '',
    };
  },
  mounted(){
    
  },
  methods: {
    //点击树形更新表格
    handleNodeClick(obj) {
      this.$emit("handleNodeClick", obj,this.groupCheckData);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  }
};
</script>

<style lang="scss" scoped>
p{
  margin: 0;
}
.AddressGroup{
    border: 1px solid #ddd;
    height: 340px;
    // 标题样式
    .title{
      border-bottom: 1px solid #ddd;
      font-size: 12px;
      height: 32px;
      line-height: 32px;
      background:rgba(251,252,255,1);
      padding-left: 14px;
    }
    // 搜索图标样式
    .searchIcon {
      width: 13px;
      position: absolute;
      top: 15px;
      right: 6px;
      z-index: 1;
    }
    // 输入框样式
    /deep/ .el-input--medium .el-input__inner{
      height: 26px;
      line-height: 26px;
      padding-left: 7px;
      &::-webkit-input-placeholder{
        color: #CCCCCC;
        font-size: 12px;
      }
    }
    /deep/ .el-input__inner{
      border: 1px solid #ddd;
    }
    // 树形样式
    .el-tree{
        overflow-x: none; 
        height: 260px;
    }
    // 树形文字大小
    .el-tree-node__label{
      font-size: 12px;
    }
    // 树形图标样式
    .el-tree-node__expand-icon{
      font-size: 8px;
    }
    .el-tree-node__content>.el-tree-node__expand-icon{
      padding: 6px 11px 6px 5px;
      background-color: initial;
    }
}


</style>