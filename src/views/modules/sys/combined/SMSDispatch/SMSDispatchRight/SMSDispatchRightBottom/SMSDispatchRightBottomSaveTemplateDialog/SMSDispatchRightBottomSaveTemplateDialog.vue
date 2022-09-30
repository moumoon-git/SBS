<template>
  <sv-dialog
    ref="dialog"
    title="另存为短信模板"
    @cancel="close"
    @confirm="submit"
    @modal="close"
  >
    <div
      v-loading="isSubmitting"
      element-loading-spinner="sv-loading"
      :class="$style.container"
    >
      <div :class="$style.item">
        <label>模板名称：</label>
        <div>
          <sv-input-search
            v-model="templateName"
            placeholder="请输入模板名称"
            :suffix="false"
            width="100%"
          />
        </div>
      </div>
      <div :class="$style.item">
        <label>所属分组：</label>
        <div>
          <SelectGroup
            v-model="parentId"
            :name="parentName"
          />
        </div>
      </div>
      <div :class="$style.item">
        <label>模板内容：</label>
        <div>
          <sv-textarea
            v-model="templateContent"
            :rows="7"
            placeholder="请输入短信内容"
            :maxlength="500"
            :scroll="true"
          />
          <p
            :class="$style.textCount"
            :style="{
              'color': templateContent.length === 500 ? '#F66E6E' : '#666666',
            }"
          >
            {{ templateContent.length }}/500字
          </p>
        </div>
      </div>
    </div>
  </sv-dialog>
</template>

<script>
import SMSDispatchSelectTemplateGroup from '../SMSDispatchSelectTemplateGroup/SMSDispatchSelectTemplateGroup.vue';

export default {
  name: 'SMSDispatchRightBottomSaveTemplateDialog',

  components: {
    SelectGroup: SMSDispatchSelectTemplateGroup,
  },

  props: {
    // 短信内容
    messagesContent: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      // 模板名称
      templateName: '',
      // 父节点id
      parentId: 0,
      // 父节点名称
      parentName: '顶级分组',
      // 模板内容
      templateContent: '',
      // 正在提交
      isSubmitting: false,
    };
  },

  methods: {
    /**
     * @description 打开弹窗
     */
    init() {
      this.templateContent = this.messagesContent;
      this.$refs.dialog.visible = true;
    },

    /**
     * @description 关闭弹窗
     */
    close() {
      this.$refs.dialog.visible = false;
      this.templateName = '';
      this.parentId = 0;
    },

    /**
     * @description 提交
     */
    submit() {
      // 提交数据验证
      if (this.templateName.length === 0) {
        this.$message.error('请输入模板名称');
        return;
      }
      if (this.templateContent.length === 0) {
        this.$message.error('请输入模板内容');
        return;
      }
      // 开启动画
      this.isSubmitting = true;
      // 提交数据
      const request = {
        method: 'post',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: '/message/messagetemple/savetemple',
        data: {
          content: this.templateContent,
          parentId: this.parentId,
          name: this.templateName,
        },
      };
      this.$http(request)
        .then(({ data: response }) => {
          if (response.code === 0) {
            this.$message.success('新增短信模板成功');
            this.close();
          } else {
            this.$message.error(`保存失败，错误信息：${response.msg}`);
          }
        })
        .catch((error) => { this.$message.error(`保存失败，错误信息：${error}`); })
        .finally(() => { this.isSubmitting = false; });
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
  }

  & > div {
    flex-grow: 1;
  }
}

.textCount {
  text-align: right;
  margin: 0;
}
</style>
