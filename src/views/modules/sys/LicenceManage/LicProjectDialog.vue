<template>
  <div class="dialog-tree">
    <sv-dialog
      ref="dialog"
      :title="type === 'add' ? '新增项目' : type === 'edit' ? '编辑项目' : '查看项目'"
      @modal="$refs.dialog.visible = false"
      @cancel="$refs.dialog.visible = false"
    >
      <div class="dialog-tree__context">
        <div class="dialog-tree__item">
          <span class="dialog-tree__item__label">项目名称：</span>
          <div class="dialog-tree__item__input">
            <sv-input-search
              v-model="projectName"
              :suffix="false"
              placeholder="请输入名称"
              width="100%"
              :clearable="false"
              :readonly="type === 'view' ? true : false"
            />
          </div>
        </div>
        <div class="dialog-tree__item">
          <span
            class="dialog-tree__item__label"
            style="position: relative; bottom: 2px;"
          >备注说明：</span>
          <div class="dialog-tree__item__input">
            <el-input
              type="textarea"
              placeholder="请输入备注"
              v-model="remark"
              :disabled="type === 'view' ? true : false"
            >
            </el-input>
          </div>
        </div>
      </div>
      <template #footer>
        <div
          class="sv-dialog__footer"
          v-if="type !== 'view'"
        >
          <sv-button
            width="52px"
            @click="$refs.dialog.visible = false"
          >
            取消
          </sv-button>
          <sv-button
            width="52px"
            type="primary"
            @click="handleSubmit"
          >
            确定
          </sv-button>
        </div>
        <div v-else>
          <span/>
        </div>
      </template>
    </sv-dialog>
    <sv-dialog-hint
      ref="hint"
      type="normal"
      text="分组名称不能为空！"
    />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        type: 'add',
        projectName: '',
        remark: '',
        projectDate: {},
      }
    },
    methods: {
      init(type, date) {
        this.type = type;
        this.projectDate = date;
        if (type === 'edit' || type === 'view') {
          this.projectName = date.name;
          this.remark = date.detail;
          console.log(this.remark, date.detail)
        } else {
          this.projectName = '';
          this.remark = '';
        }
        this.$refs.dialog.visible = true;
      },
      handleSubmit() {
        if (this.projectName === '') {
          this.$message.warning('分组名称不能为空！');
          return;
        }
        let type = this.type === 'add' ? 'add' : 'modify' ;
        let data = new FormData();
        data.append('name', this.projectName);
        data.append('detail', this.remark); 
        if (this.type !== 'add') {
          data.append('id', this.projectDate.id);
        }
        this.$http({
          url: `${window.SITE_CONFIG.cloudUrl}/oauth/project/${type}`, 
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: data,
        }).then(({data}) => {
          if (data.errorcode === 0) {
            this.$message.success('新增项目成功');
            this.$refs.dialog.visible = false;
            this.$emit('refresh');
          } else {
            this.$message.error(data.message);
          }
        }).catch((error) => {
          this.$message.error(error);
        })
      },
    }
  }
</script>
<style lang="scss" scoped>
.dialog-tree {
  &__context {
    padding: 20px;
    width: 350px;
  }
  &__item {
    display: flex;
    width: 100%;
    align-items: center;

    &:not(:last-child) {
        margin-bottom: 10px;
    }

    &__label {
        display: inline-block;
        width: 75px;
    }

    &__input {
        flex-grow: 1;
    }
  }
}
</style>