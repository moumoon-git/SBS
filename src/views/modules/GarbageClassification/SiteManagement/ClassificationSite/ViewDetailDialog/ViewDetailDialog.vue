<template>
    <sv-dialog
        ref="dialog"
        title="垃圾分类点详情"
        @cancel="handleDialogClose"
        @modal="handleDialogClose"
    >
        <div class="vd" >
            <div class="vd__navigator">
                <span
                    class="vd__navigator__item"
                    :class="{'vd__navigator__item-active': activeTabIndex === 1}"
                    @click="activeTabIndex = 1"
                >基本信息</span>
                <span
                    class="vd__navigator__item"
                    :class="{'vd__navigator__item-active': activeTabIndex === 2}"
                    @click="activeTabIndex = 2"
                >撤桶记录</span>
                <span
                    class="vd__navigator__item"
                    :class="{'vd__navigator__item-active': activeTabIndex === 3}"
                    @click="activeTabIndex = 3"
                >守桶记录</span>
                <span
                    class="vd__navigator__item"
                    :class="{'vd__navigator__item-active': activeTabIndex === 4}"
                    @click="activeTabIndex = 4"
                >巡查记录</span>
                <span
                    class="vd__navigator__item"
                    :class="{'vd__navigator__item-active': activeTabIndex === 5}"
                    @click="activeTabIndex = 5"
                >保洁记录</span>
            </div>
            <div class="vd__content">
                <BasicInformation ref="BasicInformation"/>
                <WithdrawRecord ref="WithdrawRecord"/>
                <GuardRecord ref="GuardRecord"/>
                <InspectRecord ref="InspectRecord"/>
                <CleaningRecord ref="CleaningRecord"/>
            </div>
        </div>
        <!-- 去掉底部 -->
        <template #footer><span></span></template>
    </sv-dialog>
</template>

<script>
// 基本信息页面
import BasicInformation from './BasicInformation/BasicInformation.vue'
// 撤桶记录页面
import WithdrawRecord from './WithdrawRecord/WithdrawRecord.vue'
// 守桶记录页面
import GuardRecord from './GuardRecord/GuardRecord.vue'
// 巡查记录页面
import InspectRecord from './InspectRecord/InspectRecord.vue'
// 保洁记录页面
import CleaningRecord from './CleaningRecord/CleaningRecord.vue'

export default {
    name: 'ViewDetailDialog',
    components: {
        BasicInformation,
        WithdrawRecord,
        GuardRecord,
        InspectRecord,
        CleaningRecord
    },
    props: {
        // 小区列表选项
        communityList: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            currentId: '',
            token: this.$cookie.get('token'),
            activeTabIndex: 1,
            loading: false,
            basicInformationData: {
                // 图片列表
                imgList: [],
                // 分类点名称
                name: '',
                // 所属分组
                groupId: '',
                groupIdName: '',
                // 所属社区
                townId: '',
                // 城中村/小区
                village: '',
                // 小区性质
                villageType: '',
                // 投放点位置、经纬度
                place: '',
                longitude: '',
                latitude: '',
                // 投放点模式
                launchType: '',
                // 投放时间段
                launchTimeList: [],
                // 巡检项目
                investigationInforList: [],
                // 守桶人员委托方
                delegating: '',
                // 投放点位置描述
                remark: '',
                // 状态，默认为1表示正常
                status: ''
            }
        }
    },
    methods: {
        /**
         * @method
         * @desc 初始化弹窗
         * @param {Number, String} id 数据的id
         */
        init(id) {
            this.currentId = id
            setTimeout(_ => {
                this.$nextTick(_ => {
                    this.$refs.BasicInformation.init(this.currentId, this.communityList)
                })
            }, 1)
            // 显示弹窗
            this.$refs.dialog.visible = true
        },
        /**
         * @method
         * @desc 关闭所有标签
         */
        closeAllTab() {
            this.$refs.BasicInformation.visible = false
            this.$refs.WithdrawRecord.visible = false
            this.$refs.GuardRecord.visible = false
            this.$refs.InspectRecord.visible = false
            this.$refs.CleaningRecord.visible = false
        },
        /**
         * @method
         * @desc 弹窗关闭
         */
        handleDialogClose() {
            this.$refs.dialog.visible = false
            // 标签切换到第一页【基本信息】
            this.activeTabIndex = 1
        },
    },
    watch: {
        activeTabIndex(index) {
            this.closeAllTab()
            switch(index) {
                case 1:
                    this.$refs.BasicInformation.init(this.currentId, this.communityList)
                    break
                case 2:
                    this.$refs.WithdrawRecord.init(this.currentId)
                    break
                case 3:
                    this.$refs.GuardRecord.init(this.currentId)
                    break
                case 4:
                    this.$refs.InspectRecord.init(this.currentId)
                    break
                case 5:
                    this.$refs.CleaningRecord.init(this.currentId)
                    break
            }
        }
    }
}
</script>

<style src="./ViewDetailDialog.scss" lang="scss" scoped>