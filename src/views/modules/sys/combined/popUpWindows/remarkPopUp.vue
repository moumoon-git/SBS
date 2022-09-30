<template>
  <sv-dialog
    ref="dialog"
    title="备注"
    @modal="closeDialog"
    @cancel="closeDialog"
    @confirm="requerRemark"
  >
    <div>
      <h5 v-if="hintFlag">
        <span>已选电话:{{ hintLength }}</span>
      </h5>
      <div :class="$style.content">
        <div>备注信息：</div>
        <sv-textarea
          v-model="remark"
          :rows="7"
          placeholder="请输入备注"
        />
      </div>
    </div>
  </sv-dialog>
</template>

<script>
import Bus from '@/views/common/js/eventBus';

export default {
  name: 'RemarkPopUp',
  data() {
    return {
      hintFlag: false,
      hintLength: '',
      idsx: [],
      remark: '',
    };
  },
  mounted() {

  },
  methods: {
    closeDialog() {
      this.$refs.dialog.visible = false;
      this.remark = '';
    },
    init(data) {
      this.idsx = [];
      this.$refs.dialog.visible = true;
      this.remark = '';
      if (data.length > 1) {
        this.hintFlag = true;
        this.hintLength = data.length;
        const arr = [];
        data.forEach((ele, index) => {
          arr.push(ele.id);
        });
        this.idsx = arr;
      } else {
        this.hintFlag = false;
        this.idsx = [data.id];
        this.remark = data.remark;
      }
    },
    requerRemark() {
      // console.log(this.idsx.join(','))
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/event/eos/history/phone/updateCdrs`,
        method: 'post',
        data: this.$http.adornParams({
          ids: this.idsx,
          voiceTxt: this.remark,
        }),
      }).then((res) => {
        if (res.data.errorcode === 0) {
          // console.log(res)
          this.$message.success('备注成功');
          Bus.$emit('refsh', '');
          this.remark = '';
          this.closeDialog();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
  },
};
</script>

<style lang="scss" module>
.content {
  display: flex;
  width: 500px;
  padding: 10px 50px;
  & > div:first-child {
    width: 80px;
    flex-shrink: 0;
  }
}
</style>
