/**
 * @author tanjinfeng
 * @date 2020-10-19
 * @desc 街道中转站管理页面
 */
<template>
    <div>
        <sv-template
            ref="template"
            title="街道中转站管理"
            :dateSelect="false"
            :searchSetting="{
                width: '200px',
                placeholder: '请输入中转站名称关键字'
            }"
            :tableRequest="tableRequest"
            :exportQrcodeConfig="{api: '/garbage/garbageTransferPoint/getAllUrCode'}"
            :deleteSelectedConfig="{api: '/garbage/garbageTransferPoint/delete'}"
            :exportSelectConfig="{
                api: '/garbage/garbageTransferPoint/xlsOutputSelect',
                params: {}
            }"
            :exportAllConfig="{
                api: '/garbage/garbageTransferPoint/xlsOutputCondition',
                params: {}
            }"
            :importDataConfig="{api:'/garbage/garbageTransferPoint/xlsInput'}"
            :downloadTemplateConfig="{api: '/garbage/garbageTransferPoint/getTemplate'}"
        >
            <template #left__container>
                <span></span>
            </template>
            
            <template #middle__operation__button>
                <sv-button
                    type="primary"
                    @click="openAddOrEditDialog('add')"
                >新增中转站</sv-button>
            </template>
            <template #middle__table>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="中转站名称"
                >
                    <template slot-scope="scope">
                        <sv-table-tooltip :content="scope.row.name"/>
                    </template>
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="中转站负责人"
                    prop="mailContactor.name"
                ></el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="联系方式"
                    prop="mailContactor.mobile1"
                ></el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="收运点数量"
                    prop="collectionCount"
                ></el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="操作"
                    width="170px"
                >
                    <template slot-scope="scope">
                        <sv-table-operation
                            :display="['qrcode', 'view', 'edit', 'delete']"
                            @qrcode="openQrcodeDialog(scope.row)"
                            @view="openViewDetailDialog(scope.row)"
                            @edit="openAddOrEditDialog('edit', scope.row.id)"
                            @delete="
                                deleteIds = [scope.row.id]
                                $refs.delete_hint.visible = true
                            "
                        ></sv-table-operation>
                    </template>
                </el-table-column>
            </template>
        </sv-template>
        <!-- 新增/编辑弹窗 -->
        <AddOrEditDialog
            ref="AddOrEditDialog"
            :communityListOptions="communityListOptions"
            :communityPropertyOptions="communityPropertyOptions"
            @refresh="$refs.template.getTableList(tableRequest)"
        />
        <!-- 二维码弹窗 -->
        <QrcodeDialog
            ref="QrcodeDialog"
            :api="['/garbage/garbageTransferPoint/info', '/garbage/garbageTransferPoint/output-UrCode']"
        />
        <!-- 查看详情弹窗 -->
        <ViewDetailDialog
            ref="ViewDetailDialog"
            :communityList="communityListOptions"
        />
        <!-- 删除提示弹窗 -->
        <sv-dialog-hint ref="delete_hint" type="delete" @confirm="handleDelete(deleteIds)"/>
        <sv-dialog-hint ref="delete_fail" type="fail" text="抱歉！删除失败"/>
    </div>
</template>

<script>
// 新增、编辑弹窗
import AddOrEditDialog from './AddOrEditDialog/AddOrEditDialog.vue'
// 查看详情弹窗
import ViewDetailDialog from './ViewDetailDialog/ViewDetailDialog.vue'
// 二维码弹窗
import QrcodeDialog from '../ClassificationSite/QrcodeDialog/QrcodeDialog.vue'

export default {
    components: {
        AddOrEditDialog,
        ViewDetailDialog,
        QrcodeDialog
    },
    data() {
        return {
            // 表格数据接口
            tableRequest: {
                api: '/garbage/garbageTransferPoint/list',
                params: {}
            },
            // 小区列表选项
            communityListOptions: [],
            // 选择小区性质选项
            communityPropertyOptions: [{
                label: '物业小区',
                value: '1'
            }, {
                label: '非物业小区',
                value: '2'
            }, {
                label: '商城投放点',
                value: '3'
            }],
            // 准备删除的数据的id数组
            deleteIds: []
        }
    },
    methods: {
        /**
         * @method
         * @desc 获取小区列表
         */
        getCommunityList() {
            this.$http.get(`${window.SITE_CONFIG.baseUrl}/sys/systown/list`)
            .then(response => {
                if(response.data.code === 0) {
                    let options = []
                    response.data.list.forEach(item => {
                        options.push({
                            label: item.townName,
                            value: item.id
                        })
                    })
                    this.communityListOptions = options
                } else {
                    console.log('获取小区列表数据失败！错误信息：【\n', response, '\n】')
                }
            })
            .catch(error => {
                console.log('获取小区列表数据失败！错误信息：【\n', error, '\n】')
            })
        },
        /**
         * @method
         * @desc 获取表格数据
         */
        getTableList() {
            this.$refs.template.getTableList(this.tableRequest)
        },
        /**
         * @method
         * @desc 点击树形，获取表格数据
         */
        handleTreeClick(data, tabIndex) {
            this.tableRequest.params.groupIds = data ? [data.id] : []
            this.getTableList()
        },
        /**
         * @method
         * @desc 将后台获取的社区id转换成社区名
         * @param {Number, String} id 社区id
         * @return {String} 社区名
         */
        translateCommunityIdToName(id) {
            const communityName = this.communityListOptions.find(item => item.value == id)
            if(communityName && communityName.label !== undefined && communityName.label !== null) {
                return communityName.label
            }
        },
        /**
         * @method
         * @desc 打开新增/编辑分类点弹窗
         * @param {String} type 弹窗类型：add新增、edit编辑
         * @param {Object} id 编辑时该行的数据的id
         */
        openAddOrEditDialog(type, id) {
            this.$refs.AddOrEditDialog.init(type, id)
        },
        /**
         * @method
         * @desc 打开二维码弹窗
         * @param {Object} row 该行数据
         */
        openQrcodeDialog(row) {
            this.$refs.QrcodeDialog.init(row)
        },
        /**
         * @method
         * @desc 打开查看详情弹窗
         * @param {Object} row 表格该行的数据
         */
        openViewDetailDialog(row) {
            this.$refs.ViewDetailDialog.init(row.id)
        },
        /**
         * @method
         * @desc 删除数据
         * @param 需要删除的数据的id数组
         */
        handleDelete(ids) {
            const request = {
                method: 'post',
                url:  '/garbage/garbageTransferPoint/delete',
                baseURL: window.SITE_CONFIG.baseUrl,
                data: {
                    ids
                }
            }
            this.$http(request)
            .then(response => {
                if(response.data.code == 0) {
                    // 提交成功后，刷新表格
                    this.$refs.template.getTableList(this.tableRequest)
                } else {
                    console.log('删除失败！错误信息：【\n', response, '\n】')
                    this.$refs.delete_fail.visible = true
                    this.$refs.delete_fail.supplementText = `错误代码：${response.data.code}`
                }
            })
            .catch(error => {
                console.log('删除失败！错误信息：【\n', error, '\n】')
                this.$refs.delete_fail.visible = true
                this.$refs.delete_fail.supplementText = error
            })
        }
    },
    mounted() {
        this.getCommunityList()
    }
}
</script>