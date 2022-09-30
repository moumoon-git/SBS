<template>
    <div class="chooseSpecialTopicTemplateDialog">
      <el-dialog
        title="选择专题模板"
        :visible.sync="dialogVisible"
        width="30%"
        >
      <div class="dialogWrapper">
        <div class="leftContent">
            <div class="contentList">
                <el-input
                placeholder="请输入专题名称关键字"
                v-model="filterText">
                </el-input>
                <el-tree
                class="filter-tree"
                :data="data"
                :props="defaultProps"
                default-expand-all
                :filter-node-method="filterNode"
                ref="tree">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <i class="el-icon-folder-opened"></i>
                    <span>{{ node.label }}</span>
                    <!-- <span>
                    <el-button
                        type="text"
                        size="mini"
                        icon="el-icon-edit"
                        >
                    </el-button>
                    <el-button
                        type="text"
                        size="mini"
                        icon="el-icon-delete"
                        >
                    </el-button>
                    </span> -->
                </span>
                </el-tree>
            </div>
        </div>
        <div class="rightContent">
            <div class="templateContainer">
                <div class="template">
                    查水表
                </div>
                <div class="template">
                    查水表
                </div>
                <div class="template">
                    查水表
                </div>
            </div>
        </div>
      </div>
      </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'chooseSpecialTopicTemplateDialog',
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },

    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      }
    },

    data() {
      return {
        filterText: '',
        dialogVisible: true,
        data: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    mounted() {
      this.$nextTick(() => {
        var is = document.querySelectorAll('.el-dialog .dialogWrapper .el-tree-node__children .el-tree-node .el-tree-node__content .is-leaf+.custom-tree-node .el-icon-folder-opened')
        console.log('is',is)
        for(var i = 0;i< is.length; i++) {
            
            is[i].parentNode.removeChild(is[i])
        }
      })
        
    }
  };
</script>
<style lang="less" scoped>
.chooseSpecialTopicTemplateDialog {
  .el-dialog {
  .dialogWrapper {
     display: flex;
  .leftContent {
      width: 200px;
      height: 500px;
      background-color: #fff;
    .contentList {
      el-input {

      }

      .el-tree.filter-tree {
        span.custom-tree-node {
          i.el-icon-folder-opened {

          }

          span {

          }

        }
      }
    }
  }

  .rightContent {
      width: 200px;
      height: 500px;
      background-color: #fff;
    .templateContainer {
      .template {

      }
    }
  }
    }
}
}
</style>