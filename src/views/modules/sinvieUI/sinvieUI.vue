<template>
    <sv-template
        ref="template"
        :treeSetting="treeSetting"
        @tree-click="handleTreeClick"
        @tree-node-delete="handleNodeOperation"
        @tree-node-edit="handleNodeOperation"
        @tree-node-add="handleNodeOperation"
        title="隐患预警"
        :exportSelectConfig="{
            api:'/investigation/instanceInfor/xlsOutputCondition',
            params: {status: 1, period: 1, resultStatus: 1}
        }"
        :exportQueryConfig="{
            api:'/investigation/instanceInfor/xlsOutputCondition',
            params: {status: 1, period: 1, resultStatus: 1}
        }"
        :exportQrcodeConfig="{api: '/garbage/garbageSortPoint/getAllqrCode'}"
        :importDataConfig="{api:'/approve/approveMemberEntity/xlsInput'}"
        :downloadTemplateConfig="{api: '/approve/approveMemberEntity/gettemplate'}"
        :deleteSelectedConfig="{api: '/investigation/investigationTask/delete'}"
        :tableRequest="tableRequest"
    >
        <!-- 中间栏-头部-选择器 -->
        <template #middle__operation__select>
            <sv-select></sv-select>
            <sv-select :options="options" placeholder="测试占位符"></sv-select>
        </template>
        <!-- 中间栏-头部-按钮 -->
        <template #middle__operation__button>
            <sv-dialog-hint :modal="true" ref="hintDialog" type="normal" supplement="很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的补充说明"></sv-dialog-hint>
            <sv-button type="primary" @click="$refs.hintDialog.visible = true">新增检查项目</sv-button>
        </template>
        <!-- 中间栏-表格内容 -->
        <template #middle__table>

            <el-table-column prop="inforName" header-align="center" align="center" label="检查项目"></el-table-column>
            
            <el-table-column header-align="center" align="center" label="情况说明" width="50px">
                <template slot-scope="scope">
                    <!-- 内容可能很长的项，放入sv-table-tooltip标签中 -->
                    <sv-table-tooltip :content="scope.row.remark"></sv-table-tooltip>
                </template>
            </el-table-column>
            
            <el-table-column prop="period" header-align="center" align="center" label="检查周期">
                <template slot-scope="scope">
                    <span v-if="scope.row.period == '1'">每天</span>
                    <span v-if="scope.row.period == '2'">每周</span>
                    <span v-if="scope.row.period == '3'">每月</span>
                    <span v-if="scope.row.period == '4'">每年</span>
                </template>
            </el-table-column>
            
            <el-table-column
                prop="patrolContactorString"
                header-align="center"
                align="center"
                label="巡查人"
            ></el-table-column>
            
            <el-table-column
                prop="gmtModified"
                header-align="center"
                align="center"
                label="巡查时间"
                width="200px"
            ></el-table-column>

            <el-table-column prop="isNotice" header-align="center" align="center" label="是否通知处置人">
                <template slot-scope="scope">
                    <span v-if="scope.row.isNotice == '0'">通知</span>
                    <span v-if="scope.row.isNotice == '1'">不通知</span>
                </template>
            </el-table-column>

            <el-table-column
                header-align="center"
                align="center"
                width="150"
                label="操作"
            >
                <template slot-scope="scope">
                    <sv-table-operation
                        :display="['view', 'edit_disable', 'delete', 'qrcode']"
                        @view="handleClick(scope.row.id)"
                        @edit="handleClick(scope.row.id)"
                        @delete="handleClick(scope.row.id)"
                        @qrcode="handleClick(scope.row.id)"
                    ></sv-table-operation>
                </template>
            </el-table-column>

        </template>
    </sv-template>
</template>

<script>
export default {
    methods: {
        handleClick(val) {
            console.log('click and get', val)
        },
        handleTreeClick(data, tabIndex) {
            this.tableRequest.params.taskGroups = []
            this.tableRequest.params.inforGroups = []
            switch(tabIndex) {
                case 0:
                    this.tableRequest.params.taskGroups = data == null ? [] : [data.id]
                    break
                case 1:
                    this.tableRequest.params.inforGroups = data == null ? [] : [data.id]
                    break
            }
            this.$refs.template.getTableList(this.tableRequest);
        },
        handleNodeOperation(data) {
            console.log('tree node operation clicked', data)
        }
    },
    data() {
        return {
            treeSetting: {
                tab: [
                    '巡查区域',
                    '项目分组'
                ],
                api: [
                    '/investigation/investigationTaskGroup/listTree',
                    '/investigation/investigationGroup/listTree'
                ],
                edit: true
            },
            tableRequest: {
                api: '/investigation/instanceInfor/instanceList',
                params: {
                    taskGroups: [],
                    inforGroups: [],
                    isNotice: '',
                    period: '',
                }
            },
            options: [{
                label: '选项1',
                value: 1
            }, {
                label: '选项2很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
                value: 2
            }, {
                label: '选项3不可选',
                value: 3,
                active: false
            }, {
                label: '选项4',
                value: 4
            }]
        }
    }
}
</script>
