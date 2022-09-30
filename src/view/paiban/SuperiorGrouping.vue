
<template>
  <el-dialog :visible.sync="Modal" width="500px" center append-to-body :close-on-click-modal="false">
    <div slot="title">{{title}}</div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="tree">
          <el-scrollbar style="height: 360px;">
            <el-tree :data="treeData"   :highlight-current='highlightCurrent' ref="tree" node-key="id" @node-click="handleNodeClick" :default-expanded-keys="[indexKey]"></el-tree>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <div class="submit-btn">
        <el-button type="primary" size="medium" @click="onSubmit">确认</el-button>
      </div>
    </el-row>
  </el-dialog>
</template>

<script>
  export default {
    name: "SuperiorGrouping",
    data() {
      return {
        highlightCurrent: false,
        title: '选择分组',
        treeData: [],
        indexKey:0,
        treeID:'',
        treeName:'',
        Modal: false, //模态框
      }
    },
    methods: {
      //获取选择树数据
      openModal(data,treeID,treeName) {
        this.Modal = true;
        this.treeData=data;
        this.treeID=treeID;
        this.treeName=treeName;
        this.chooseTree(this.treeID);
      },
      chooseTree(id) {//默认选中树形
        this.$nextTick(function() {
          this.highlightCurrent = true;
          this.$refs.tree.setCurrentKey(id);
        })
      },
      handleNodeClick(data){
        console.log(data);
        this.treeID = data.id; //当前选中Id
        this.treeName = data.label; //当前选中名称
      },
      onSubmit() {
        let data = {
          treeID: this.treeID,
          treeName: this.treeName
        }
        this.Modal = false;
        this.$emit("treeChild", data);
      }
    },
  }
</script>

<style scoped>
  .tree {
    /*height: 400px;*/
    width: 450px;
    /*overflow: auto;*/
    overflow-y: auto;
    overflow-x: auto;
  }

  .el-tree {
    min-width: 100%;
    display: inline-block !important;
    background: #c0c0c003;
  }

  .submit-btn {
    margin-top: 20px;
    text-align: center;

  }

  .el-tree--highlight-current>>>.el-tree-node.is-current>.el-tree-node__content .el-tree-node__label {
    background-color: #ccc;
  }

  .el-scrollbar>>>.el-scrollbar__wrap {
    overflow-x: hidden;
  }
</style>

