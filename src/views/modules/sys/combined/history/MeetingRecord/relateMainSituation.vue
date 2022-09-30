<!--
 * @Author: yaoweixin
 * @Date: 2020-11-05 09:43:57
 * @LastEditors: yaoweixin
 * @LastEditTime: 2020-11-23 20:17:24
 * @Description: 关联事件弹框
 * @FilePath: \SBSNEW\src\views\modules\sys\combined\history\MeetingRecord\relateMainSituation.vue
-->
<template>
  <div class="relateMainSituation">
    <sv-dialog
      ref="dialog"
      title="关联事件"
      @cancel="quitDialog"
      @confirm="confirmRelateMainSituation"
    >
      <div class="remarkContainer">
        <div class="remarkTitle">关联事件：</div>
        <el-select v-model="value" clearable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
    </sv-dialog>
  </div>
</template>
<script>
export default {
  name: "relateMainSituation",
  data() {
    return {
      meetingId: 1, //会议的id
      options: [], //关联事件列表
      value: "",
    };
  },
  created() {
    this.$http({
      url: this.$http.adornUrl("/emergency/emergencyinfo/list"),
      method: "get",
      params: this.$http.adornParams({
        page: 1,
        limit: 9999,
      }),
    }).then(({ data }) => {
      console.log("获得的会议列表为", data);
      if (data && data.code === 0) {
        let optionList = [];
        data.page.list.forEach((item, index) => {
          optionList.push({
            value: item.id,
            label: "(" + item.number + ")" + item.title,
          });
        });
        this.options = optionList;
      }
    });
  },
  methods: {
        /**
         * @description: 初始化弹框
         * @param {*} id：会议的id
         * @return {*}
         */
        init(id) {
            this.meetingId = id
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
         * @description: 关联事件确定
         * @param {*}
         * @return {*}
         */
        confirmRelateMainSituation() {
             var that = this
            if(this.value) {
             this.$http({
              url: this.$http.adornUrl('/meeting/meetingRecordEmergency/save'),
              method: 'post',
              data: this.$http.adornData({
               recordId: this.meetingId,
               emergencyId: this.value
              })
            }).then(({data}) => {
                if(data && data.code === 0) {
                    that.$refs.dialog.visible = false
                     that.$emit('confirmRelateMainSituation')
                }
            })
            }else {
                alert('必须选择要情')
            }
        },
    
    /**
     * @description: 关联事件确定
     * @param {*}
     * @return {*}
     */
    confirmRelateMainSituation() {
      var that = this;
      if (this.value) {
        this.$http({
          url: this.$http.adornUrl("/meeting/meetingRecordEmergency/save"),
          method: "post",
          data: this.$http.adornData({
            recordId: this.meetingId,
            emergencyId: this.value,
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            that.$refs.dialog.visible = false;
            that.$emit("confirmRelateMainSituation");
          }
        });
      } else {
        alert("必须选择要情");
      }
    },
  },
};
</script>
<style lang="less" scoped>
.relateMainSituation {
      /* 弹框样式 */
  /deep/ .sv-dialog {
    width: 500px;
    .remarkContainer {
      display: flex;
      margin: 30px;
      .remarkTitle {
      }

      .el-select {
        .el-option {
        }
      }
    }
  }
}
</style>