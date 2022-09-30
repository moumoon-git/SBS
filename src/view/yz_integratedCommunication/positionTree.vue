<!--@author：yf-->
<template>
  <div>
    <el-dialog width="300px" :title="title" :visible.sync="isShow" :close-on-click-modal="false">
      <div class="tree">
        <el-scrollbar style="height: 100%">
          <el-tree
            ref="tree"
            style="max-height: 400px"
            :data='treeData'
            node-key="id"
            highlight-current
            :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "positionTree",
    data() {
      return {
        defaultProps: {
          label: 'name',
        },
        title: "请选择职务",//标题
        isShow: false,// 是否显示
        treeData: [],//树数据
      }
    },
    mounted() {
      this.getTreeData();
    },
    methods: {
      //获取职务数据
      getTreeData() {
        let data = {};
        let tree = [];
        this.$api.contactorPosition(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          for (let i = 0; i < res.data.length; i++) {
            tree.push({
              id: i,
              name: res.data[i],
            });
          }
          this.treeData = tree;
        })
      },
      //将职务名称返回
      handleNodeClick(data, node) {
        this.$emit('handleNodeClick', data.name);
        this.isShow = false;
      },
    }
  }
</script>

<style scoped>
  .tree {
    background-color: white;
    border: 1px solid rgba(211, 215, 219, 1);
  }

  >>> .el-dialog__body {
    padding: 10px 5px;
  }
</style>
