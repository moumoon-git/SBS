<template>
    <sv-dialog
        ref="dialog"
        :title="type === 'add' ? '新增收运点' : '编辑收运点'"
        @cancel="handleCancel"
        @confirm="$refs.submitConfirm.visible = true"
    >
        <div
            class="aoe"
            :class="{'aoe-fullscreen': isFullscreen}"
            v-loading="loading"
            element-loading-spinner="sv-loading"
        >
            <!-- A. 左边栏 -->
            <div class="aoe__left">
                <div class="aoe__left__item aoe__left__item-required">
                    <div class="aoe__left__item__label">收运点照片</div>
                    <div class="aoe__left__item__content">
                        <sv-upload-img v-model="formData.imgList"/>
                    </div>
                </div>
                <div class="aoe__left__item aoe__left__item-required">
                    <div class="aoe__left__item__label">收运点名称</div>
                    <div class="aoe__left__item__content">
                        <sv-input-search
                            v-model="formData.name"
                            :suffix="false"
                            placeholder="请输入分类点名称"
                            width="100%"
                        />
                    </div>
                </div>
                <div class="aoe__left__item aoe__left__item-required">
                    <div class="aoe__left__item__label">所属分组</div>
                    <div class="aoe__left__item__content">
                        <sv-select-group
                            api="/garbage/garbageCollectionpointGroup/list"
                            v-model="formData.groupId"
                            :name="formData.groupIdName"
                        />
                    </div>
                </div>
                <div class="aoe__left__item aoe__left__item-required">
                    <div class="aoe__left__item__label">所属社区</div>
                    <div class="aoe__left__item__content">
                        <sv-select
                            v-model="formData.townId"
                            width="100%"
                            align="left"
                            placeholder="请选择所属社区"
                            :options="communityListOptions"
                        />
                    </div>
                </div>
                <div class="aoe__left__item aoe__left__item-required">
                    <div class="aoe__left__item__label">城中村/小区名</div>
                    <div class="aoe__left__item__content">
                        <sv-input-search
                            v-model="formData.village"
                            :suffix="false"
                            placeholder="请输入城中村或小区名"
                            width="100%"
                        />
                    </div>
                </div>
                <div class="aoe__left__item aoe__left__item-required">
                    <div class="aoe__left__item__label">小区性质</div>
                    <div class="aoe__left__item__content">
                        <sv-select
                            v-model="formData.villageType"
                            width="100%"
                            align="left"
                            placeholder="请选择小区性质"
                            :options="communityPropertyOptions"
                        />
                    </div>
                </div>
                <div class="aoe__left__item aoe__left__item-required">
                    <div class="aoe__left__item__label">收运点位置</div>
                    <div class="aoe__left__item__content">
                        <sv-input-search
                            :suffix="false"
                            placeholder="请从右侧地图确认位置"
                            width="100%"
                            :disabled="true"
                            v-model="formData.place"
                            :clearable="false"
                        />
                    </div>
                </div>
                <div class="aoe__left__item aoe__left__item-required">
                    <div class="aoe__left__item__label">关联分类点</div>
                    <div class="aoe__left__item__content">
                        <sv-select-item
                            v-model="formData.garbageSortPointList"
                            :api="[
                                '/garbage/garbageSortpointGroup/list',
                                '/garbage/garbageSortPoint/list'
                            ]"
                            title="分类点"
                        />
                    </div>
                </div>
                <div class="aoe__left__item aoe__left__item-required">
                    <div class="aoe__left__item__label">负责人</div>
                    <div class="aoe__left__item__content">
                        <sv-select-contact
                            title="负责人"
                            v-model="formData.chargeId"
                            :detail="formData.mailContactor"
                        />
                    </div>
                </div>
                <div class="aoe__left__item aoe__left__item-required">
                    <div class="aoe__left__item__label">站点管理方</div>
                    <div class="aoe__left__item__content">
                        <label class="aoe__left__radio">
                            <input
                                v-model="formData.delegating"
                                type="radio"
                                value="1"
                            >
                            物业
                        </label>
                        <label class="aoe__left__radio">
                            <input
                                v-model="formData.delegating"
                                type="radio"
                                value="2"
                            >
                            环卫
                        </label>
                    </div>
                </div>
                <div class="aoe__left__item">
                    <div class="aoe__left__item__label">联系人</div>
                    <div class="aoe__left__item__content">
                        <sv-select-contact
                            title="联系人"
                            v-model="formData.contactorId"
                            :detail="formData.mailContactorEntity"
                        />
                    </div>
                </div>
                <div class="aoe__left__item aoe__left__item-required">
                    <div class="aoe__left__item__label">工作人员</div>
                    <div class="aoe__left__item__content">
                        <sv-select-contact
                            title="工作人员"
                            v-model="formData.garbageMemberList"
                            :multiple="true"
                            :api="['/garbage/garbageMemberGroup/list', '/garbage/garbageMember/list']"
                        />
                    </div>
                </div>
                <div class="aoe__left__item">
                    <div class="aoe__left__item__label">收运点位置描述</div>
                    <div
                        class="aoe__left__item__content"
                        style="font-size:0"
                    >
                        <sv-textarea
                            v-model="formData.remark"
                            :rows="2"
                            placeholder="请输入描述"
                        />
                    </div>
                </div>
            </div>
            <!-- B. 右边栏 -->
            <div class="aoe__right">
                <div class="aoe__right__title">投放点位置</div>
                <div
                    class="aoe__right__fullscreen"
                    @click="isFullscreen = !isFullscreen"
                ></div>
                <Location
                    :address="formData.place"
                    :lngLat="[formData.longitude, formData.latitude]"
                    :cgcsLngLatInit="[formData.cgcsLongitude, formData.cgcsLatitude]"
                    @confirm="handleLocationConfirm"
                />
            </div>
        </div>
        <sv-dialog-hint
            ref="submitConfirm"
            type="submit"
            @confirm="handleSubmit"
        />
        <sv-dialog-hint
            ref="submitFail"
            type="fail"
        />
    </sv-dialog>
</template>

<script>
import Location from '../../ClassificationSite/Location/Location.vue'
export default {
    name: 'AddOrEditDialog',
    components: {
        Location
    },
    props: {
        // 小区列表选项
        communityListOptions: {
            type: Array,
            default: () => []
        },
        // 小区性质选项
        communityPropertyOptions: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            // 弹窗类型：add or edit
            type: 'add',
            // 数据提交中
            loading: false,
            // 左边栏数据
            formData_empty: {
                // 图片列表
                imgList: [],
                // 分类点名称
                name: '',
                // 所属分组
                groupId: '',
                groupIdName: '',
                // 所属社区
                townId: '',
                // 城中村/小区名
                village: '',
                // 小区属性
                villageType: '',
                // 收运点位置、经纬度
                place: '',
                longitude: '',
                latitude: '',
                // 收运点位置描述
                remark: '',
                // 负责人id
                chargeId: '',
                // 负责人详情
                mailContactor: {
                    id: '',
                    name: '',
                    mobile1: ''
                },
                // 关联分类点id列表
                garbageSortPointList: [],
                // 工作人员id列表
                garbageMemberList: [],
                // 站点管理方
                delegating: '',
                // 联系人id
                contactorId: '',
                // 联系人详情
                mailContactorEntity: {
                    id: '',
                    name: '',
                    mobile1: ''
                },
                cgcsLongitude: '',
                cgcsLatitude: '',
            },
            formData: {},
            formData_add: {},
            // 地图是否全屏
            isFullscreen: false,
        }
    },
    methods: {
        /**
         * @method
         * @desc 初始化数据，打开弹窗
         * @param {String} type 弹窗类型，add新增、edit编辑
         * @param {Object} data 编辑的数据
         */
        init(type, id) {
            this.type = type
            if (type === 'add') {
                this.formData = {...this.formData_add}
                // 显示弹窗
                this.$refs.dialog.visible = true
            } else if (type === 'edit') {
                // 获取数据详情
                const request = {
                    method: 'get',
                    url:  'garbage/garbageCollectionPoint/info',
                    baseURL: window.SITE_CONFIG.baseUrl,
                    params: {
                        id,
                        token: this.$cookie.get('token')
                    }
                }
                this.$http(request)
                .then(response => {
                    if(response.data.code == 0) {
                        this.formData = response.data.data
                        // 显示弹窗
                        this.$refs.dialog.visible = true
                    } else {
                        console.log('获取id =', id, '的详情失败！错误信息：【\n', response, '\n】')
                    }
                })
                .catch(error => {
                    console.log('获取id =', id, '的详情失败！错误信息：【\n', error, '\n】')
                })
            }
        },
        /**
         * @method
         * @desc 地图定位确定位置，获取地址和坐标
         */
        handleLocationConfirm(...arg) {
            this.isFullscreen = false
            this.formData.place = arg[0]
            this.formData.longitude = arg[1][0]
            this.formData.latitude = arg[1][1]
            // 大地坐标系
            this.formData.cgcsLongitude = arg[3][0];
            this.formData.cgcsLatitude = arg[3][1];
            // 强制更新，防止深对象v-model不更新
            this.$forceUpdate()
        },
        /**
         * @method
         * @desc 关闭弹窗
         */
        handleCancel() {
            this.$refs.dialog.visible = false
            this.isFullscreen = false
            // 保存新增页面的编辑内容，清除编辑页面的内容
            this.type === 'add' ? this.formData_add = {...this.formData} : this.formData = {...this.formData_empty}
        },
        /**
         * @method
         * @desc 确认提交
         */
        handleSubmit() {
            // 表单必填项验证
            if(!this.submitValidate()) {
                return
            }
            this.loading = true
            // 新增
            if(this.type === 'add') {
                const request = {
                    method: 'post',
                    url:  '/garbage/garbageCollectionPoint/save',
                    baseURL: window.SITE_CONFIG.baseUrl,
                    data: this.formData
                }
                this.$http(request)
                .then(response => {
                    if(response.data.code == 0) {
                        this.$emit('refresh')
                        // 提交成功后，清空数据
                        this.$refs.dialog.visible = false
                        this.formData = {...this.formData_empty}
                        this.formData_add = {...this.formData_empty}
                        this.isFullscreen = false
                    } else {
                        console.log('新增失败！错误信息：【\n', response, '\n】')
                        this.$refs.submitFail.visible = true
                        this.$refs.submitFail.supplementText = `错误代码：${response.data.code}`
                    }
                    this.loading = false
                })
                .catch(error => {
                    this.loading = false
                    console.log('新增失败！错误信息：【\n', error, '\n】')
                    this.$refs.submitFail.visible = true
                    this.$refs.submitFail.supplementText = error
                })
            }
            // 编辑更新
            else if (this.type === 'edit') {
                const request = {
                    method: 'post',
                    url:  '/garbage/garbageCollectionPoint/update',
                    baseURL: window.SITE_CONFIG.baseUrl,
                    data: this.formData
                }
                this.$http(request)
                .then(response => {
                    if(response.data.code == 0) {
                        this.$emit('refresh')
                        // 提交成功后，清空数据
                        this.$refs.dialog.visible = false
                        this.formData = {...this.formData_empty}
                        this.isFullscreen = false
                    } else {
                        console.log('更新失败！错误信息：【\n', response, '\n】')
                        this.$refs.submitFail.visible = true
                        this.$refs.submitFail.supplementText = `错误代码：${response.data.code}`
                    }
                    this.loading = false
                })
                .catch(error => {
                    this.loading = false
                    console.log('更新失败！错误信息：【\n', error, '\n】')
                    this.$refs.submitFail.visible = true
                    this.$refs.submitFail.supplementText = error
                })
            }
        },
        /**
         * @method
         * @desc 提交数据验证
         * @return {Boolean} 提交数据是否通过验证
         */
        submitValidate() {
            let form = this.formData
            if (
                form.imgList.length == 0 ||
                form.garbageSortPointList.length == 0 ||
                form.garbageMemberList.length == 0 ||
                form.name == '' ||
                form.groupId == '' ||
                form.townId == '' ||
                form.village == '' ||
                form.villageType == '' ||
                form.place == '' ||
                form.chargeId == '' ||
                form.delegating == ''
            ) {
                this.$refs.submitFail.visible = true
                this.$refs.submitFail.supplementText = `带星号必填项不能为空！`
                return false
            } else {
                return true
            }
        },
    },
    mounted() {
        this.formData_add = {...this.formData_empty}
        this.formData = {...this.formData_empty}
    }
}
</script>

<style src="../../ClassificationSite/AddOrEditDialog/AddOrEditDialog.scss" lang="scss">
