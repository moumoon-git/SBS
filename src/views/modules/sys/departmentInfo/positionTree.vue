<!--
 * @Author: your name
 * @Date: 2021-11-06 18:04:55
 * @LastEditTime: 2021-11-06 22:17:09
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \project-yangzhou-caseInstitutions\src\views\modules\sys\departmentInfo\positionTree.vue
-->
<!--
 * @Author: yf
 * @Date: 2020-9-17 14:00:00
 * @LastEditTime: 2021-11-06 18:04:17
 * @Editors: qinjiaqi
 * @Description: 弹出职业选择框
-->
<template>
    <div>
        <!-- 
            @editorName: qinjiaqi
            @editorTime: 2020-10-19 9:52:41
            @description: 弹出框默认可点击区域外关闭，故将:close-on-click-modal设为"false"
        -->
        <el-dialog width="300px" :title="title" :visible.sync="isShow" @close="isShow=false" :append-to-body="true" :close-on-click-modal="false">
            <div class="tree">
                <el-scrollbar style="height: 100%">
                    <el-tree
                        ref="tree"
                        style="max-height: 400px"
                        :data='treeData'
                        node-key="id"
                        highlight-current
                        :props="defaultProps" 
                        @node-click="handleNodeClick">
                    </el-tree>
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
          /** 
           * @authorName：qinjiaqi
           * @param {type} 没有
           * @return {type} undefined
           * @description：获取职务数据
           */
          getTreeData() {
              let data = {};
              let tree = [];
              this.$http({
                  url: `${window.SITE_CONFIG['event']}/emergency/mechanism/contactor/contactorPosition`,
                  method: 'POST',
                  data:data
                  }).then(res => {
                  if (res.data.errorcode != 0) {
                      this.$message({
                          message: res.data.msg,
                          type: "error"
                      });
                      return;
                  }
                for (let i = 0; i < res.data.data.length; i++) {
                    tree.push({
                        id: i,
                        name: res.data.data[i],
                    });
                }
                this.treeData = tree;
              })
          },
          /** 
           * @authorName：qinjiaqi
           * @param {Object, Object} 点击获得的数据，点击树节点
           * @return {type} undefined
           * @description：将职务名称返回
           */
          handleNodeClick(data, node) {
              this.$emit('handleNodeClick', data.name);
              this.isShow = false;
          },
      }
    }
</script>

<style scoped>
    /** 
     * @authorName：qinjiaqi
     * @description：弹出框样式
     */    
    .tree {
        background-color: white;
        border: 1px solid rgba(211, 215, 219, 1);
    }

    >>> .el-dialog__body {
        padding: 10px 5px;
    }
</style>

<style>
    .tree {
        background-color: white;
        border: 1px solid rgba(211, 215, 219, 1);
    }

    >>> .el-dialog__body {
        padding: 10px 5px;
    }
</style>
