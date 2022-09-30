<!--@author：yf-->
<template>
  <div>
    <div>
      <el-input
        @keyup.enter.native="filterTexts"
        clearable
        placeholder="输入关键字回车搜索"
        v-model="filterText">
      </el-input>
    </div>
    <el-scrollbar>
      <el-tree
        style="height: 300px;"
        class="filter-tree"
        :data="treeData"
        :accordion="true"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :default-expand-all="isExpand"
        @node-click="handleNodeClick"
        ref="tree">
      </el-tree>
    </el-scrollbar>
    <div slot="footer" style="text-align: center">
      <el-button size="mini" @click="cancelDialog">取消</el-button>
      <el-button size="mini" type="primary" @click="affirmDialog">确认</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "treeSearch",
    data() {
      return {
        filterText: '',
        filterId: '',
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        typeData: '',
        isExpand: false,
        isSelect:false
      }
    },
    watch: {
      filterText(val) {
        if (val == '' || val == null || val == undefined) {
          this.filterTexts();
        }
      },
      filterId(val) {
        if (val == '' || val == null || val == undefined) {
          this.filterTexts();
          this.filterId == ''
        }
      }
    },
    methods: {
      filterTexts(val) {
        // this.filterText='';
        this.isSelect = false;
        this.filterId = val;
        this.$refs.tree.filter(this.filterText);
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      dataUpdating(treeData, typeData) {
        this.treeData = JSON.parse(JSON.stringify(treeData));
        this.typeData = typeData;
      },
      handleNodeClick(data, node) {
        this.filterText = data.name;
        this.filterId = data.id;
        this.isSelect = true;
        this.$emit('handleNodeClick', data, node);
      },
      cancelDialog() {
        this.$emit('cancelDialog')
      },
      affirmDialog() {
        console.log(this.isSelect);
        if(this.isSelect){
          this.$emit('affirmDialog', this.filterText, this.filterId, this.typeData);
          this.isSelect = false ;
        }else {
          this.$message({
            message: '请先选择节点!',
            type: 'warning'
          });
        }
      }
    },
  }
</script>

<style scoped>

</style>
