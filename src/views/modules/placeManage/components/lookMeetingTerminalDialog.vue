<template>
    <div class="lookMeetingTerminalDialog">
        <sv-dialog
        ref="dialog"
        title="会场终端详情"
        @cancel="handleCancel"
        >
         <div class="basic-information__left">
             <div class="formItemWrapper">
                 <div class="formItemText">
                     <span class="star">*</span>
                     终端名称：
                 </div>
                 <div class="formItemContent">xxxx</div>
             </div>
             <div class="formItemWrapper">
                 <div class="formItemText">
                     <span class="star">*</span>
                     终端号码：
                 </div>
                 <div class="formItemContent">xxx</div>
             </div>
             <div class="formItemWrapper">
                 <div class="formItemText">
                     <span class="star">*</span>
                     所属分组：
                 </div>
                 <div class="formItemContent">xxx</div>
             </div>
             <div class="formItemWrapper">
                 <div class="formItemText">
                     <span class="star">*</span>
                     地点位置：
                 </div>
                 <div class="formItemContent">xxx</div>
             </div>
             <div class="formItemWrapper" style="margin-left: 10px;">
                 <div class="formItemText">
                     备注信息：
                 </div>
                 <div class="formItemContent">xxx</div>
             </div>
         </div>
         <div class="basic-information__right">
            <Location
                :address="formData.place"
                :lngLat="[formData.longitude, formData.latitude]"
                :displayOnly="true"
            />
        </div>
         <!-- 去掉底部 -->
        <template #footer><span></span></template>
        </sv-dialog>
    </div>
</template>
<script>
import Location from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/Location.vue'
export default {
    name: 'lookMeetingTerminalDialog',
    data() {
        return {
            formData: {
                place: '',//地点
                longitude: 0,//经度
                latitude: 0,//纬度
                
            },
            deviceId: '',//设备的id
        }
    },
    methods: {
        /**
         * @description: 初始化弹框
         * @param {*} id
         * @return {*}
         */
        init(id) {
            this.deviceId = id
            this.$refs.dialog.visible = true
        },
        /**
         * @description: 点击关闭按钮
         * @param {*}
         * @return {*}
         */
        handleCancel() {
            this.$refs.dialog.visible = false
        }
    },
    components: {
        Location
    }
}
</script>
<style lang="less" scoped>
.lookMeetingTerminalDialog {
   /deep/ .sv-dialog {
     width: 1000px;
     .basic-information__left {
         width: 400px;
        .formItemWrapper {
            display: flex;
            height: 40px;
            margin-top: 15px;
            .formItemText {
            span.star {
              color: #ff0000;
            }
            }

            .formItemContent {

            }
        }
        }

        .basic-information__right {
          width: 600px;
        }
   }
}
</style>