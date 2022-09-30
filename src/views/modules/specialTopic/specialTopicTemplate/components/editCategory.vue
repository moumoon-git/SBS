<!--
 * @Author: yaoweixin
 * @Date: 2020-12-14 16:50:31
 * @LastEditors: yaoweixin
 * @LastEditTime: 2020-12-17 17:58:15
 * @Description: 编辑类目
 * @FilePath: \SBSNEW\src\views\modules\specialTopic\specialTopicTemplate\components\editCategory.vue
-->
<template>
    <div class="addCategory">
        <!-- 编辑类目弹框 --> 
        <div class="addCategoryDialogWrapper">
            <el-dialog
                title="编辑类目"
                :visible.sync="dialogVisible"
                width="30%"
                :close-on-click-modal="false"
                >
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="类目名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="类目描述">
                        <el-input v-model="form.remark"></el-input>
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
                name: '',//类目名称
                remark: ''//类目描述
            },
            index: -1,//类目索引
            dialogVisible: false//控制弹框的显示与隐藏
        }
    },
    methods: {
        /**
         * @description: 初始化弹框
         * @param {*}
         * @return {*}
         */
        init(obj,index) {
            // this.form.categoryName = obj.name
            // this.form.categoryDesc = obj.remark
            this.form = Object.assign({},obj)
            this.index = index
            this.dialogVisible = true
            
        },
        /**
         * @description: 确认添加类目
         * @param {type} 无
         * @return {type} 无 
         */
        confirmCategory() {
            this.$emit("editCategorySubmit",this.form,this.index)
        }
    }
}
</script>
<style lang="less" scoped>