<template>
    <div
        class="basic-information"
        v-if="visible"
        v-loading="loading"
        element-loading-spinner="sv-loading"
    >
        <div class="basic-information__left">
            <div class="basic-information__left__item">
                <div class="basic-information__left__item__label">中转站照片</div>
                <div class="basic-information__left__item__content">
                    <viewer :images="formData.imgList && formData.imgList.length ? formData.imgList.map(e=>e.allUrl) : []">
                        <img
                            height="80"
                            v-for="(img, index) in formData.imgList"
                            :key="`img_${index}`"
                            :src="img.allUrl"
                            :alt="img.name"
                        >
                    </viewer>
                </div>
            </div>
            <div class="basic-information__left__item">
                <div class="basic-information__left__item__label">中转站名称</div>
                <div class="basic-information__left__item__content">
                    {{formData.name ? formData.name : ''}}
                </div>
            </div>
            <div class="basic-information__left__item">
                <div class="basic-information__left__item__label">中转站位置</div>
                <div class="basic-information__left__item__content">
                    {{formData.place ? formData.place : ''}}
                </div>
            </div>
            <div class="basic-information__left__item">
                <div class="basic-information__left__item__label">关联收运点</div>
                <div class="basic-information__left__item__content">
                    <span
                        class="basic-information__left__item__tag"
                        v-for="(site, index) in formData.garbageCollectionPointEntityList"
                        :key="`classification_site_${index}`"
                    >
                        {{site.name}}
                    </span>
                </div>
            </div>
            <div class="basic-information__left__item">
                <div class="basic-information__left__item__label">负责人</div>
                <div class="basic-information__left__item__content">
                    <span class="basic-information__left__item__tag">
                        {{formData.mailContactor && formData.mailContactor.name ? formData.mailContactor.name : ''}}
                        {{formData.mailContactor && formData.mailContactor.mobile1 ? `（${formData.mailContactor.mobile1}）` : ''}}
                    </span>
                </div>
            </div>
            <div class="basic-information__left__item">
                <div class="basic-information__left__item__label">联系人</div>
                <div class="basic-information__left__item__content">
                    <span class="basic-information__left__item__tag">
                        {{formData.mailContactorEntity && formData.mailContactorEntity.name ? formData.mailContactorEntity.name : ''}}
                        {{formData.mailContactorEntity && formData.mailContactorEntity.mobile1 ? `（${formData.mailContactorEntity.mobile1}）` : ''}}
                    </span>
                </div>
            </div>
            <div class="basic-information__left__item">
                <div class="basic-information__left__item__label">工作人员</div>
                <div class="basic-information__left__item__content">
                    <span
                        class="basic-information__left__item__tag"
                        v-for="(participant, index) in formData.garbageMemberEntityList"
                        :key="`participant_${index}`"
                    >
                        {{participant.name}}
                        {{participant.phone ? `（${participant.phone}）` : ''}}
                    </span>
                </div>
            </div>
            <div class="basic-information__left__item">
                <div class="basic-information__left__item__label">中转站位置描述</div>
                <div class="basic-information__left__item__content">
                    {{formData.remark ? formData.remark : ''}}
                </div>
            </div>
            
        </div>
        <div class="basic-information__right">
            <Location
                :address="formData.place"
                :lngLat="[formData.longitude, formData.latitude]"
                :displayOnly="true"
            />
        </div>
    </div>
</template>

<script>
// 地图定位
import Location from '../../../ClassificationSite/Location/Location.vue'

export default {
    name: 'BasicInformation',
    components: {
        Location
    },
    props: {
    },
    data() {
        return {
            visible: false,
            loading: false,
            formData: {},
            communityList: []
        }
    },
    methods: {
        init(id, communityList) {
            this.visible = true
            this.getData(id)
            this.communityList = communityList
        },
        /**
         * @method
         * @desc 获取基本信息页面的信息
         * @param {String} id 数据的id
         */
        getData(id) {
            this.loading = true
            const request = {
                method: 'get',
                url:  '/garbage/garbageTransferPoint/info',
                baseURL: window.SITE_CONFIG.baseUrl,
                params: {
                    id,
                    token: this.token
                }
            }
            this.$http(request)
            .then(response => {
                if(response.data.code == 0) {
                    Object.assign(this.formData, response.data.data)
                    
                } else {
                    console.log('获取id =', id, '的详情失败！错误信息：【\n', response, '\n】')
                }
                this.loading = false
            })
            .catch(error => {
                console.log('获取id =', id, '的详情失败！错误信息：【\n', error, '\n】')
                this.loading = false
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.basic-information {
    display: flex;
    justify-content: center;
    align-items: stretch;
    &__left {
        * {line-height: 1.5;}
        width: 440px;
        min-height: 700px;
        padding: 10px 0;
        &__item {
            margin: 15px 0;
            display: flex;
            align-items: flex-start;
            &__label {
                flex-shrink: 0;
                width: 120px;
                margin-right: 20px;
                color: #999999;
                text-align: right;
            }
            &__content {
                flex-grow: 1;
                color: #333333;
            }
            &__tag {
                border: 1px solid #E0E0E0;
                border-radius: 3px;
                padding: 0 10px;
                background: #FAFAFA;
                margin: 0 5px 5px 0;
                display: inline-block;
                // word-break: keep-all;
            }
            img {
                margin: 0 10px 10px 0;
                cursor: zoom-in;
            }
        }
    }
    &__right {
        flex: 1;
        padding: 20px;
    }
}
</style>