<template>
  <sv-dialog
    ref="dialog"
    :title="type === 'save' ? '新增报告单位' : '编辑报告单位'"
    @confirm="handleConfirm"
    @cancel="handleClose"
    @modal="handleClose"
  >
    <div :class="$style.container">
      <div>
        <label :class="$style.required">报告单位名称</label>
        <sv-input-search
          v-model="vcName"
          placeholder="请输入报告单位名称"
          :suffix="false"
          width="300px"
        />
      </div>
      <div>
        <label :class="$style.required">上级分类</label>
        <el-cascader
          v-model="parent"
          :props="{
            value: 'id',
            label: 'vcName',
            children: 'children',
            checkStrictly: true,
            emitPath: false,
          }"
          :options="[{ id: -1, vcName: '顶级分类' }, ...parentTree]"
          :show-all-levels="false"
        />
      </div>
      <div style="display: inline-block; margin-top: 5px;">
        <label style="float: left;">备注信息</label>
        <sv-textarea
          v-model="remark"
          placeholder="请输入备注信息"
          :rows="3"
          width="300px"
        />
      </div>
      <div style="display: flex; height: 65px;">
        <label>报告单位负责人</label>
        <sv-select-contact
          v-model="contact"
          style="display: inline-block;"
          title="负责人"
          :detail="contactDetail"
        />
      </div>
    </div>
    <sv-dialog-hint
      ref="fail"
      type="fail"
      :text="errorText"
    />
  </sv-dialog>
</template>

<script>
export default {
  name: 'ReportingUnitAddOrEditDialog',
  props: {
    parentTree: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      id: null,
      type: 'add',
      errorText: '',
      vcName: '',
      parent: -1,
      contact: null,
      contactDetail: {},
      remark: '',
    };
  },
  methods: {
    open(type, data) {
      this.type = type;
      if (data) {
        this.id = data.id;
        this.vcName = data.vcName;
        this.parent = data.parentId > 0 ? data.parentId : -1;
        this.contactDetail = (
          data.contactors && data.contactors.length && data.contactors[0]
        ) || {};
        this.contact = (data.contactors && data.contactors.length && data.contactors[0].id) || null;
        this.remark = data.remark;
      }
      this.$refs.dialog.visible = true;
    },
    handleClose() {
      this.$refs.dialog.visible = false;
      this.resetForm();
    },
    handleConfirm() {
      if (!this.vcName) {
        this.errorText = '请填写报告单位名称！';
        this.$refs.fail.visible = true;
        return;
      }
      const request = {
        method: 'post',
        url: `${window.g.ApiUrl}/eos/system/unit/${this.type}`,
        data: {
          id: this.id ? this.id : undefined,
          vcName: this.vcName,
          parentId: this.parent > 0 ? this.parent : 0,
          remark: this.remark,
          contactorIds: this.contact ? [this.contact] : [],
        },
      };
      this.$http(request).then((response) => {
        if (response.data.errorcode === 0) {
          this.$emit('refresh');
          this.handleClose();
        } else {
          this.$message.error(`操作失败，错误代码${response.data.errorcode}，错误信息：${response.data.msg}`);
        }
      }).catch((error) => {
        this.$message.error(`操作失败，错误信息：${error}`);
      });
    },
    resetForm() {
      this.id = null;
      this.vcName = '';
      this.parent = -1;
      this.contact = null;
      this.remark = '';
    },
  },
};
</script>

<style lang="scss" module>
.container {
  padding: 30px 70px;
  & > div {
    height: 40px;
    line-height: 40px;
    & > label {
      margin-right: 20px;
      display: inline-block;
      width: 100px;
      &.required {
        position: relative;
        &::before {
          content: '*';
          position: absolute;
          left: -8px;
          color: red;
        }
      }
    }
  }
  :global(.el-cascader) {
    width: 300px;
    :global(.el-input__inner) {
      height: 30px;
      padding-left: 10px;
      color: #000;
    }
  }
}
</style>
