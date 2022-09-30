<!--
 * @Author: yaoweixin
 * @Date: 2020-11-04 17:13:36
 * @LastEditors: yaoweixin
 * @LastEditTime: 2020-11-23 20:05:13
 * @Description: 备注弹框
 * @FilePath: \SBSNEW\src\views\modules\sys\combined\history\MeetingRecord\remarkDialog.vue
-->
<template>
    <div class="remarkDialog">
        <sv-dialog
        ref="dialog"
        title="备注"
        @cancel="quitDialog"
        @confirm="confirmAddRemark"
        >
        <!-- 备注 -->
        <div class="remarkContainer">
            <div class="remarkTitle">备注：</div>
            <textarea name="" id="" cols="30" rows="10" class="remarkContent" v-model="remarkContent"></textarea>
        </div>
        </sv-dialog>
    </div>
</template>
<script>
export default {
    name: 'remarkDialog',
    data() {
        return {
            currentId: '',
            remarkContent: ''
        }
    },
    methods: {
         init(id) {
            this.currentId = id
            // 显示弹窗
            this.$refs.dialog.visible = true
        },
        /**
         * @description: 关闭弹框
         * @param {*}
         * @return {*}
         */
        quitDialog() {
            this.$refs.dialog.visible = false
        },
        /**
         * @description: 确认添加备注
         * @param {*}
         * @return {*}
         */
        confirmAddRemark() {
            var that = this
            if(this.remarkContent) {
             this.$http({
              url: this.$http.adornUrl('/meeting/meetingRecord/update'),
              method: 'post',
              data: this.$http.adornData({
                id: this.currentId,
                remark: this.remarkContent
              })
            }).then(({data}) => {
                if(data && data.code === 0) {
                    that.$refs.dialog.visible = false
                     that.$emit('confirmAddRemark')
                }
            })
            }else {
                alert('备注不能为空')
            }
           
        }
    }
}
</script>
<style lang="less" scoped>
.remarkDialog {
    /* 弹框样式 */
  /deep/ .sv-dialog {
       width: 500px;
    .remarkContainer {
        display: flex;
        margin-top: 20px;
        margin-left: 30px;
    .remarkTitle {

    }

    textarea.remarkContent {
        height: 74px;
        width: 300px;
    }
    }
   }
}
</style>