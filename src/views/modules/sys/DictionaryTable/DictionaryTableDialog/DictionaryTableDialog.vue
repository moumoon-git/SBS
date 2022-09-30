<template>
  <sv-dialog
    ref="dialog"
    :title="type === 'add' ? '新增字典' : '编辑字典'"
    @cancel="handleClose"
    @modal="handleClose"
    @confirm="handleSubmit"
  >
    <div
      v-loading="isLoading"
      element-loading-spinner="sv-loading"
      :class="$style.container"
    >
      <div>
        <label>名称：</label>
        <sv-input-search
          v-model="name"
          :suffix="false"
        />
      </div>
      <div>
        <label>备注：</label>
        <sv-input-search
          v-model="remark"
          :suffix="false"
        />
      </div>
      <div>
        <label>排序：</label>
        <sv-input-search
          v-model.number="orderNum"
          :suffix="false"
        />
      </div>
    </div>
  </sv-dialog>
</template>

<script>
export default {
  name: 'DictionaryTableDialog',
  data() {
    return {
      // 弹窗类型
      type: 'add',
      // 字典名称
      name: '',
      // 字典备注
      remark: '',
      // 排序
      orderNum: 0,
      // id
      id: 0,
      // 父节点id
      parentId: 0,
      // 字典码
      code: '',
      // 正在提交
      isLoading: false,
    };
  },
  methods: {
    open(isEdit, row) {
      if (isEdit) {
        this.type = 'edit';
        this.code = row.code;
        this.parentId = row.parentId;
        this.name = row.name;
        this.remark = row.remark;
        this.orderNum = row.orderNum;
        this.id = row.id;
      } else {
        this.type = 'add';
        this.parentId = row.addNew || row.id;
        this.name = '新增字典';
        this.remark = '';
        this.orderNum = 0;
        this.id = 0;
      }
      this.$refs.dialog.visible = true;
    },
    /**
     * @description 关闭弹窗
     */
    handleClose() {
      this.$refs.dialog.visible = false;
    },
    /**
     * @description 提交
     */
    handleSubmit() {
      if (!this.name) {
        this.$message.error('请填写名称');
        return;
      }
      const request = {
        method: 'post',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: `/sys/sysdictionary/${this.type === 'add' ? 'save' : 'update'}`,
        data: {
          id: this.id || undefined,
          name: this.name,
          parentId: this.parentId,
          remark: this.remark,
          orderNum: this.orderNum || 0,
        },
      };
      if (this.type === 'edit') {
        request.data.code = this.code;
      }
      this.isLoading = true;
      this.$http(request)
        .then((response) => {
          if (response.data.code === 0) {
            this.$message.success(`${this.type === 'add' ? '新增' : '更新'}成功！`);
            this.$emit('refresh-data');
            this.handleClose();
          } else {
            this.$message.error(`${this.type === 'add' ? '新增' : '更新'}失败，错误代码${response.data.code}，错误信息：${response.data.msg}`);
          }
        })
        .catch((error) => {
          this.$message.error(`${this.type === 'add' ? '新增' : '更新'}失败，错误信息：${error}`);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<style lang="scss" module>
.container {
  padding: 10px;
  width: 300px;
  & > div {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    & > div:last-child {
      flex-grow: 1;
    }
  }
}
</style>
