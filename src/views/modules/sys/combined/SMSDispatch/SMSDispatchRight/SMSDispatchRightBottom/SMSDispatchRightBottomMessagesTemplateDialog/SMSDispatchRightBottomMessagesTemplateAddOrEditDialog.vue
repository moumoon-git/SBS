<template>
  <sv-dialog
    ref="dialog"
    :title="type === 'add' ? '新增短信模板' : '编辑短信模板'"
    @cancel="close"
    @confirm="submit"
    @modal="close"
  >
    <div
      v-loading="isLoading"
      element-loading-spinner="sv-loading"
      :class="$style.container"
    >
      <div :class="$style.item">
        <label>分组名称：</label>
        <div>
          <sv-input-search
            v-model="groupName"
            placeholder="请输入短信分组名称"
            :suffix="false"
            width="100%"
          />
        </div>
      </div>
      <div :class="$style.item">
        <label>所属分组：</label>
        <div>
          <SelectGroup
            v-model="pid"
            :name="parentName"
            :check="false"
          />
        </div>
      </div>
    </div>
  </sv-dialog>
</template>

<script>
import SMSDispatchSelectTemplateGroup from '../SMSDispatchSelectTemplateGroup/SMSDispatchSelectTemplateGroup.vue';

export default {
  name: 'SMSDispatchLeftAddOrEditDialog',

  components: {
    SelectGroup: SMSDispatchSelectTemplateGroup,
  },

  data() {
    return {
      // 弹窗类型：新增/编辑
      type: 'add',
      // 当前编辑的分组id
      id: -1,
      // 分组名称
      groupName: '',
      // 所属分组id和名称
      pid: 0,
      parentName: '顶级分组',
      // 加载中
      isLoading: false,
    };
  },

  methods: {
    /**
     * @description 打开弹窗
     * @param { String } type 弹窗类型，新增或编辑
     * @param { Object } node 节点数据
     */
    init(
      type,
      node,
      parentName,
    ) {
      this.type = type;
      if (type === 'add') {
        this.id = -1;
        this.groupName = '';
        this.parentName = '顶级分组';
        this.pid = 0;
      } else {
        this.id = node.id;
        this.groupName = node.name;
        this.parentName = parentName || '顶级分组';
        this.pid = node.pid || 0;
      }
      this.$refs.dialog.visible = true;
    },

    /**
     * @description 关闭弹窗
     */
    close() {
      this.$refs.dialog.visible = false;
    },

    submit() {
      if (!this.isLoading) {
        if (this.groupName.length === 0) {
          this.$message.error('请填写分组名称');
          return;
        }
        this.isLoading = true;
        const request = {
          method: 'post',
          baseURL: window.SITE_CONFIG.event,
          url: '/smsTemplateType/add',
          data: {
            data: {
              name: this.groupName,
              pid: this.pid,
              id: this.id,
            },
          },
        };
        if (this.type === 'add') {
          this.$http(request)
            .then(({ data: response }) => {
              if (response.code === 0) {
                this.$message.success('新增短信分组成功');
                this.close();
                this.$emit('refresh-messages-group');
              } else {
                this.$message.error(`新增失败，错误信息：${response.msg}`);
              }
            })
            .catch((error) => { this.$message.error(`新增失败，错误信息：${error}`); })
            .finally(() => { this.isLoading = false; });
        } else {
          request.url = '/smsTemplateType/update';
          this.$http(request)
            .then(({ data: response }) => {
              if (response.code === 0) {
                this.$message.success('更新短信分组成功');
                this.close();
                this.$emit('refresh-messages-group');
              } else {
                this.$message.error(`更新失败，错误信息：${response.msg}`);
              }
            })
            .catch((error) => { this.$message.error(`更新失败，错误信息：${error}`); })
            .finally(() => { this.isLoading = false; });
        }
      } else {
        this.$message.info('后台数据正在处理中，请稍等');
      }
    },
  },
};
</script>

<style lang="scss" module>
.container {
  width: 400px;
}

.item {
  display: flex;
  margin: 10px;

  & > label {
    position: relative;
    top: 5px;
    font-weight: bold;
    color: #333333;
    flex-shrink: 0;
  }

  & > div {
    flex-grow: 1;
  }
}
</style>
