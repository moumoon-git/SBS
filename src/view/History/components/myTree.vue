<template>
  <el-tree
    :data="treeData"
    :props="defaultProps"
    :show-checkbox="treeConfig.checkbox"
    :check-strictly="true"
    :filter-node-method="filterNode"
    node-key="id"
    :default-expanded-keys="[-1]"
    highlight-current
    ref="tree"
    class="tree"
    @node-click="nodeClick">
  </el-tree>
</template>

<script>
  export default {
    name: "myTree",
    props:{
      treeData:{
        type: Array,
        default: []
      },
      defaultProps:{
        type: Object,
        default: null
      },
      treeConfig: {
        type: Object,
        default: null
      }
    },
    watch: {
      'treeConfig.filterText'(val){
        this.$refs.tree.filter(val);
      }
    },
    data(){
      return{

      }
    },
    methods: {
      // 筛选数据
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      // 节点被点击时
      nodeClick(nodeData,node){
        this.$emit('nodeClick',nodeData,node)
      }
    }
  }
</script>

<style scoped>
.el-tree>>>.is-checked>.el-tree-node__content{
  background: #e5f4ff;
  color: #0693ff;
}
</style>
