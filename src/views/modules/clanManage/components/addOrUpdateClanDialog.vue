<!--
 * @Author: yaoweixin
 * @Date: 2020-11-05 20:16:11
 * @LastEditors: yaoweixin
 * @LastEditTime: 2020-11-06 11:28:04
 * @Description: 新增编辑集群终端弹框
 * @FilePath: \SBSNEW\src\views\modules\clanManage\components\addOrUpdateClanDialog.vue
-->
<template>
    <div class="addOrUpdateClanDialog">
        <sv-dialog
        ref="dialog"
        :title="title"
        @cancel="quitDialog"
        @confirm="confirmClan"
        >
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="集群名称" prop="clanName">
                    <el-input v-model="ruleForm.clanName"></el-input>
                </el-form-item>
                <el-form-item label="集群类型" prop="clanType">
                    <el-select v-model="ruleForm.clanType" placeholder="请选择集群类型">
                        <el-option
                            v-for="item in ruleForm.clanTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>

                    </el-select>
                </el-form-item>
                 <el-form-item label="集群号码" prop="clanPhone">
                    <el-input v-model="ruleForm.clanPhone"></el-input>
                </el-form-item>
                <el-form-item label="所属分组" prop="clanGroup">
                    <el-select v-model="ruleForm.clanGroup" placeholder="请选择所属分组">
                        <el-option
                            v-for="item2 in ruleForm.clanGroupList"
                            :key="item2.value"
                            :label="item2.label"
                            :value="item2.value">
                        </el-option>

                    </el-select>
                </el-form-item>
                <el-form-item label="备注信息">
                    <el-input type="textarea" v-model="ruleForm.remark"></el-input>
                </el-form-item>
            </el-form>
         </sv-dialog>
    </div>
</template>
<script>
export default {
    name: 'addOrUpdateClanDialog',
    data() {
        return {
            title : '',
             ruleForm: {
               clanName: '',//集群名称
               clanType: '',//集群类型
               clanTypeList: [],//集群类型列表
               clanPhone: '',//集群号码
               clanGroup: '',//所属分组
               clanGroupList: [],//所属分组列表
               remark: '',//备注信息
               
            },
            rules: {
                 clanName: [
                    { required: true, message: '请输入集群名称', trigger: 'blur' },
                ],
                clanType: [
                    { required: true, message: '请选择集群类型', trigger: 'change' }
                ],
                  clanPhone: [
                    { required: true, message: '请输入集群号码', trigger: 'blur' },
                ],
                clanGroup: [
                    { required: true, message: '请选择所属分组', trigger: 'change' }
                ],
               
            }
        }
    },
    methods: {
        /**
         * @description: 弹框初始化
         * @param {int} id:设备id
         * @return {*}
         */
        init(id) {
            
        },
       /**
        * @description: 点击取消
        * @param {*}
        * @return {*}
        */ 
       quitDialog() {

       },
       /**
        * @description: 新增或修改集群终端
        * @param {*}
        * @return {*}
        */
       confirmClan() {
           
       }
    }
}
</script>
<style lang="less" scoped>

</style>