<!--
 * @Author: yaoweixin
 * @Date: 2020-11-04 18:05:43
 * @LastEditors: yaoweixin
 * @LastEditTime: 2020-11-24 18:59:12
 * @Description: 修改会议弹框
 * @FilePath: \SBSNEW\src\views\modules\sys\combined\history\MeetingRecord\updateMeetingDialog.vue
-->
<template>
     <div class="remarkDialog">
        <sv-dialog
        ref="dialog"
        title="修改会议名称"
        @cancel="quitDialog"
        @confirm="confirmUpdateMeeting"
        >
        <div class="meetingNameContainer">
            <div class="meetingNameTitle">会议名称：</div>
            <input type="text" class="meetingNameContent" v-model="meetingNameContent">
        </div>
        </sv-dialog>
    </div>
</template>
<script>
export default {
    name: 'updateMeetingDialog',
    data() {
        return {
             currentId: '',//会议的id
            meetingNameContent: ''//会议名称
        }
    },
    methods: {
        /**
          * @description: 初始化弹框
          * @param {*} id:会议的id
          * @return {*}
          */
         init(id) {
            this.currentId = id
            // 显示弹窗
            this.$refs.dialog.visible = true
        },
        quitDialog() {
            this.$refs.dialog.visible = false
        },
        /**
         * @description: 确认修改会议
         * @param {*}
         * @return {*}
         */
        confirmUpdateMeeting() {
            var that = this
            if(this.meetingNameContent) {
             this.$http({
              url: this.$http.adornUrl('/meeting/meetingRecord/update'),
              method: 'post',
              data: this.$http.adornData({
                id: this.currentId,
                title: this.meetingNameContent
              })
            }).then(({data}) => {
                if(data && data.code === 0) {
                    that.$refs.dialog.visible = false
                     that.$emit('confirmUpdateMeetingName')
                }
            })
            }else {
                alert('会议名称不能为空')
            }
           
        }
    
    }
}
</script>
<style lang="less" scoped>
.remarkDialog {
 /deep/  .sv-dialog {
     width: 500px;
.meetingNameContainer {
    display: flex;
    margin-top: 30px;
    margin-left: 30px;
  .meetingNameTitle {

  }
/* 会议名称修改框 */
  input.meetingNameContent {
      width: 200px;
  }
}
}
}
</style>