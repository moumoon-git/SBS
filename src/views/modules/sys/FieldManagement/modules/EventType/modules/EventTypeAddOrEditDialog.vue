<template>
  <sv-dialog
    ref="dialog"
    :title="type === 'add' ? '新增事件类型' : '编辑事件类型'"
    @confirm="handleConfirm"
    @cancel="handleClose"
    @modal="handleClose"
  >
    <div :class="$style.container">
      <div>
        <label :class="$style.required">分类名称</label>
        <sv-input-search
          v-model="name"
          placeholder="请输入分类名称"
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
            label: 'name',
            children: 'children',
            checkStrictly: true,
            emitPath: false,
          }"
          :options="[{ id: -1, name: '顶级分类' }, ...parentTree]"
          :show-all-levels="false"
        />
      </div>
      <div>
        <label>分类编码</label>
        <sv-input-search
          v-model="encode"
          placeholder="请输入分类编码"
          :suffix="false"
          width="300px"
        />
      </div>
      <div>
        <label>所属领域</label>
        <sv-input-search
          v-model="domain"
          placeholder="请输入所属领域"
          :suffix="false"
          width="300px"
        />
      </div>
      <div style="display: inline-block; margin-top: 5px;">
        <label style="float: left; margin-right: 24px;">备注信息</label>
        <sv-textarea
          v-model="remark"
          placeholder="请输入备注信息"
          :rows="3"
          width="300px"
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
  name: 'EventTypeAddOrEditDialog',
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
      name: '',
      parent: -1,
      domain: '',
      encode: '',
      remark: '',
    };
  },
  methods: {
    open(type, data) {
      this.type = type;
      if (data) {
        this.id = data.id;
        this.name = data.name;
        this.parent = data.pid;
        this.domain = data.domain;
        this.encode = data.code;
        this.remark = data.remark;
      }
      this.$refs.dialog.visible = true;
    },
    handleClose() {
      this.$refs.dialog.visible = false;
      this.resetForm();
    },
    handleConfirm() {
      if (!this.name) {
        this.errorText = '请填写分类名称！';
        this.$refs.fail.visible = true;
        return;
      }
      const request = {
        method: 'post',
        url: `${window.SITE_CONFIG.event}/eos/caseClass/${this.type}`,
        data: {
          data: {
            id: this.id ? this.id : undefined,
            name: this.name,
            pid: this.parent > 0 ? this.parent : 0,
            domain: this.domain,
            code: this.encode,
            remark: this.remark,
          },
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
      this.name = '';
      this.parent = -1;
      this.domain = '';
      this.encode = '';
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
