<template>
  <sv-dialog
    ref="dialog"
    title="事项完成"
    :close-on-click-modal="false"
    @cancel="handleCancel"
    @confirm="handleSubmit"
  >
    <div :class="$style.matter_done">
      <div :class="$style.matter_item">
        <div :class="[$style.matter_name, $style.matter_necess]">完成人：</div>
        <sv-input-search
          v-model="finishPerson"
          :suffix="false"
          placeholder="请输入完成人"
          width="100%"
        />
      </div>
      <div :class="$style.matter_item">
        <div :class="$style.matter_name">备注:</div>
        <sv-textarea
          v-model="finishRemark"
          :rows="2"
          placeholder="请输入备注"
        />
      </div>
    </div>
  </sv-dialog>
</template>
<script>
export default {
  data() {
    return {
      id: '',
      finishPerson: '', // 完成人
      finishRemark: '', // 备注
    };
  },
  methods: {
    init(id) {
      this.finishPerson = '';
      this.finishRemark = '';
      this.$refs.dialog.visible = true;
      this.id = id;
    },
    handleCancel() {
      this.$refs.dialog.visible = false;
    },
    handleSubmit() {
      if (!this.finishPerson) {
        this.$message.warning('请填写完成人');
        return;
      }
      const datas = {
        url: this.$http.adornUrl(`/duty/dutyLogItem/${this.id}/finish`),
        method: 'PUT',
        data: this.$http.adornParams({
          finishPerson: this.finishPerson, // 完成人
          finishRemark: this.finishRemark, // 备注
        }),
      };
      this.$http(datas).then((res) => {
        // console.log(res.data)
        if (res.data && res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '状态更新成功!',
          });
          this.handleCancel();
          this.$emit('matterDoneBack');
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch((err) => {
        console.log(err);
      });
    },
  },
};
</script>
<style lang="scss" module>
.matter_done {
  width: 350px;
  padding: 10px;
  & > .matter_item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    & > div {
      &:nth-child(2) {
        color: pink;
        & > div {
          &:last-child{
            display: none;
          }
        }
      }
    }
    & > .matter_name {
      min-width: 65px;
    }
    & > .matter_necess {
      &::before {
        content: '*';
        color: red;
      }
    }
  }
}
</style>
