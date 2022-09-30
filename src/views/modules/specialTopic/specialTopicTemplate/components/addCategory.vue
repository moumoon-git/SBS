<!--
 * @Author: yaoweixin
 * @Date: 2020-09-01 14:51:49
 * @LastEditors: yaoweixin
 * @LastEditTime: 2020-12-17 17:57:44
 * @Description: 新增类目弹框
 * @FilePath: \SBSNEW\src\views\modules\specialTopic\specialTopicTemplate\components\addCategory.vue
-->
<template>
    <div class="addCategory">
        <!-- 新增类目弹框 --> 
        <div class="addCategoryDialogWrapper">
            <el-dialog
                title="新增类目"
                :visible.sync="dialogVisible"
                width="30%"
                :close-on-click-modal="false"
                >
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="类目名称">
                        <el-input v-model="form.categoryName"></el-input>
                    </el-form-item>
                    <el-form-item label="类目描述">
                        <el-input v-model="form.categoryDesc"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="confirmCategory">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
export default {
    name: 'addCategory',
    data() {
        return {
            form: {
                categoryName: '',//类目名称
                categoryDesc: ''//类目描述
            },
            dialogVisible: false//控制弹框的显示与隐藏
        }
    },
    methods: {
        /**
         * @description: 确认添加类目
         * @param {type} 无
         * @return {type} 无 
         */
        confirmCategory() {
            this.$emit("addCategory",this.form)
            this.form.categoryDesc = ''
            this.form.categoryName = ''
        }
    }
}
</script>
<style lang="less" scoped>

</style>