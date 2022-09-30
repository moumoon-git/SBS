<!--
 * @Author: yaoweixin
 * @Date: 2020-09-03 17:39:19
 * @LastEditors: yaoweixin
 * @LastEditTime: 2020-12-17 17:58:04
 * @Description: 选择模板分组弹框
 * @FilePath: \SBSNEW\src\views\modules\specialTopic\specialTopicTemplate\components\ChooseTemplateGroupDialog.vue
-->
<template>
    <div class="chooseTemplateGroupDialog">
        <el-dialog
            title="请选择模板分组"
            :visible.sync="dialogVisible"
            width="30%"
            :close-on-click-modal="false"
            >
        <div class="content">
            <div class="custom-tree-container">
                <div class="block">
                  <!-- 模板分组树 -->
                    <el-tree
                    :data="data"
                    node-key="id"
                    default-expand-all
                    :expand-on-click-node="false"
                    :props="treeProps"
                    @node-click="handleClick">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                    </span>
                    </el-tree>
                </div>
        </div>
    </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'ChooseTemplateGroupDialog',
    data() {
        const data = [];
        return {
            data: JSON.parse(JSON.stringify(data)),
            treeProps: {
              label: (data, node)=>{
                console.log(data, node)
                return data.name
                },
          },
          dialogVisible: false
        }
    },
    created() {
        this.init()
    },
    methods: {
        /**
         * @description: 初始化模板分组
         * @param {type} 无
         * @return {type} 无
         */
        init() {
            this.$http({
            url: this.$http.adornUrl('/fk/fkTemplateGroup/list'),
            method: 'get',
            params: this.$http.adornParams({})
                }).then(({data}) => {
                console.log('树形列表为，',data)
                this.data = data.data 
            })
            },
        /**
         * @description: 监听节点的点击事件
         * @param {object} node: 节点对象
         * @return {type} 
         */
        handleClick(node,data) {
            this.$emit("chooseTemplate",node)
        }
    }

}
</script>
<style lang="less" scoped>

</style>