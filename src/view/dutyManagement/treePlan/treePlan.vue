<template>
  <div class="tree">
    <el-scrollbar style="height: 100%">
      <el-tree
        :data="treeData"
        show-checkbox
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
      >
       <span class="treeDiv" slot-scope="{ node, data }">
          <span class="leftTree">
             {{ node.label }}
          </span>
         <span class="rightTree">
           <i class="el-icon-arrow-right"> </i>
           <!--           <i :class="[rotate?'el-icon-arrow-right':'el-icon-arrow-down']" > </i>-->
         </span>
      </span>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
  export default {
    name: "treePlan",
    props: ['treeData'],
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'label',
          plusIcon: true,
        },
        rotate: false
      }
    },
    methods: {
      // start(node){
      //   console.log(node)
      //   this.rotate=!this.rotate;
      // }
    }
  }
</script>

<style scoped>
  .tree {
    height: 676px;
    min-width: 180px;
    overflow: auto;
    background-color: white;
    border: 1px solid #EBEEF5;
  }

  >>> .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  >>> .el-tree-node__content {
    margin-top: 28px;
  }

  /*>>>.el-tree-node>.el-tree-node__children{*/
  /*overflow: visible !important;*/
  /*}*/
  >>> .treeDiv {
    width: 100%;
  }

  >>> .leftTree {
    display: inline-block;
    width: 70%;
    text-align: left;
  }

  >>> .rightTree {
    display: inline-block;
    width: 30%;

  }
</style>
