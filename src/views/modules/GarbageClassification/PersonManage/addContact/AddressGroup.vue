<template>
  <div class="AddressGroup">
    <p class="title">通讯录分组</p>
    <div class="outLine">
      <img class="searchIcon" src="data:image/svg+xml;base64,PHN2ZyB0PSIxNTczMDE4OTAxNTE3IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM1MDgiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNODQ1LjMxNjgxIDgwNC4yNzkwMzMgNjY5LjgwNjExNiA2MjguNzY4MzM5YzM5LjI5ODAyMS00Ny43OTIxMjUgNjAuNjg2Nzg4LTEwNy4yNTA4NDkgNjAuNjg2Nzg4LTE2OS45ODQ0MDkgMC03MS42MzcwMTgtMjcuOTM4NDM3LTEzOC45NzU4MTUtNzguNDkzNzA0LTE4OS42MzM0Mi01MC42NTc2MDUtNTAuNjU3NjA1LTExNy45OTY0MDItNzguNDkzNzA0LTE4OS42MzM0Mi03OC40OTM3MDRzLTEzOC45NzU4MTUgMjcuOTM4NDM3LTE4OS42MzM0MiA3OC40OTM3MDRjLTUwLjY1NzYwNSA1MC42NTc2MDUtNzguNDkzNzA0IDExNy45OTY0MDItNzguNDkzNzA0IDE4OS42MzM0MnMyNy45Mzg0MzcgMTM4Ljk3NTgxNSA3OC40OTM3MDQgMTg5LjYzMzQyYzUwLjY1NzYwNSA1MC42NTc2MDUgMTE3Ljk5NjQwMiA3OC40OTM3MDQgMTg5LjYzMzQyIDc4LjQ5MzcwNCA2NS4zOTQzNjMgMCAxMjcuMjA2ODc2LTIzLjIzMDg2MSAxNzYuMDIyMzg3LTY1LjkwNjA1NmwxNzQuOTk5MDAxIDE3NC45OTkwMDFjNC40MDA1NiA0LjQwMDU2IDEwLjEzMTUyMSA2LjU0OTY3IDE1Ljk2NDgyMSA2LjU0OTY3czExLjU2NDI2MS0yLjE0OTExMSAxNS45NjQ4MjEtNi41NDk2N0M4NTQuMTE3OTI5IDgyNy4zMDUyMTcgODU0LjExNzkyOSA4MTMuMDgwMTUyIDg0NS4zMTY4MSA4MDQuMjc5MDMzek0yMzkuMjY3NjM5IDQ1OC43ODM5M2MwLTEyMy4wMTA5OTMgMTAwLjA4NzE0OC0yMjMuMDk4MTQxIDIyMy4wOTgxNDEtMjIzLjA5ODE0MXMyMjMuMDk4MTQxIDEwMC4wODcxNDggMjIzLjA5ODE0MSAyMjMuMDk4MTQxLTEwMC4wODcxNDggMjIzLjA5ODE0MS0yMjMuMDk4MTQxIDIyMy4wOTgxNDFTMjM5LjI2NzYzOSA1ODEuNzk0OTIzIDIzOS4yNjc2MzkgNDU4Ljc4MzkzeiIgcC1pZD0iMzUwOSIgZmlsbD0iIzhhOGE4YSI+PC9wYXRoPjwvc3ZnPg==" alt />
      <input class="search" placeholder="请输入分组" v-model="filterText" />
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
            style="padding-top: 10px;"
            current-node-key
            highlight-current
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
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
      filterText: '',
  },
  data() {
    return {
      checkedIds: [],
    };
  },
  mounted(){
    
  },
   watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
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

.AddressGroup{
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 5px;
    height: 440px;
    .title{
        border-bottom: 1px solid #ddd;
        text-align: center;
        padding: 6px 0;
    }
    .outLine {
    padding: 5px 10px;
    position: relative;
    .searchIcon {
      width: 22px;
      position: absolute;
      top: 15px;
      right: 20px;
      z-index: 1;
    }
    .search {
      width: 100%;
      padding-left: 15px;
      outline: none;
      height: 40px;
      border: 1px solid #ddd;
      border-radius:4px;
      &::-webkit-input-placeholder {
        color: #ccc;
      }
      &::-moz-input-placeholder {
        color: #ccc;
      }
      &::-ms-input-placeholder {
        color: #ccc;
      }
    }
  }
    .el-tree{
        overflow-x: none; 
        height: 340px;
        /deep/ .el-tree-node__content{
            border-bottom: 1px dashed #ddd;
        }
    }
}


</style>