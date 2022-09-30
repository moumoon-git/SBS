<template>
    <div>
        <sv-template
            ref="template"
            :treeSetting="treeSetting"
            @tree-click="handleTreeClick"
            title="集群终端管理"
            :dateSelect="false"
            :searchSetting="{
                width: '280px',
                placeholder: '请输入设备名称/号码'
            }"
            :tableRequest="tableRequest"
            :exportQrcodeConfig="{api: '/garbage/garbageCollectionPoint/getAllqrCode'}"
            :deleteSelectedConfig="{api: '/garbage/garbageCollectionPoint/delete'}"
            :exportSelectConfig="{
                api: '/garbage/garbageCollectionPoint/xlsOutputSelect',
                params: {}
            }"
            :exportQueryConfig="{
                api: '/garbage/garbageCollectionPoint/xlsOutputCondition',
                params: {
                    townId: tableRequest.params.townId,
                    villageType: tableRequest.params.villageType
                }
            }"
            :importDataConfig="{api:'/garbage/garbageCollectionPoint/xlsInput'}"
            :downloadTemplateConfig="{api: '/garbage/garbageCollectionPoint/getTemplate'}"
        >
            <template #middle__operation__select>
                <sv-select
                    v-model="tableRequest.params.townId"
                    placeholder="选择社区"
                    :options="communityListOptions"
                    @change="getTableList"
                />
                <sv-select
                    v-model="tableRequest.params.villageType"
                    placeholder="选择小区性质"
                    width="140px"
                    :options="communityPropertyOptions"
                    @change="getTableList"
                />
            </template>
            <template #middle__operation__button>
                <sv-button
                    type="primary"
                    @click="openAddOrEditDialog('add')"
                >新增收运点</sv-button>
            </template>
            <template #middle__table>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="收运点名称"
                >
                    <template slot-scope="scope">
                        <sv-table-tooltip :content="scope.row.name"/>
                    </template>
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="所属社区"
                >
                    <template slot-scope="scope">
                        {{translateCommunityIdToName(scope.row.townId)}}
                    </template>
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="城中村/小区名"
                >
                    <template slot-scope="scope">
                        <sv-table-tooltip :content="scope.row.village"/>
                    </template>
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="小区性质"
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.villageType == '1'">物业小区</span>
                        <span v-if="scope.row.villageType == '2'">非物业小区</span>
                        <span v-if="scope.row.villageType == '3'">商城投放点</span>
                    </template>
                </el-table-column>
                <el-table-column
                    header-align="center"
                    align="center"
                    label="收运点负责人"
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
                    label="操作"
                    width="140px"
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
       
        <!-- 删除提示弹窗 -->
        <sv-dialog-hint ref="delete_hint" type="delete" @confirm="handleDelete(deleteIds)"/>
        <sv-dialog-hint ref="delete_fail" type="fail" text="抱歉！删除失败"/>
    </div>
</template>

<script>
// 

export default {
    components: {
       
    },
    data() {
        return {
            // 树形接口
            treeSetting: {
                api: '/garbage/garbageCollectionpointGroup/list',
                edit: {
                    add: '/garbage/garbageCollectionpointGroup/save',
                    update: '/garbage/garbageCollectionpointGroup/update',
                    delete: '/garbage/garbageCollectionpointGroup/delete'
                }
            },
            // 表格数据接口
            tableRequest: {
                api: '/garbage/garbageCollectionPoint/list',
                params: {
                    groupIds: [],
                    townId: '',
                    villageType: ''
                }
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
         * @desc 打开查看详情弹窗
         * @param {Object} row 表格该行的数据
         */
        openViewDetailDialog(row) {
            this.$refs.ViewDetailDialog.init(row.id)
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
         * @desc 删除数据
         * @param 需要删除的数据的id数组
         */
        handleDelete(ids) {
            const request = {
                method: 'post',
                url:  '/garbage/garbageCollectionPoint/delete',
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