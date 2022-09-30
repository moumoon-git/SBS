<template>
  <sv-dialog
    ref="dialog"
    title="存为短信分组"
    @cancel="close"
    @modal="close"
    @confirm="saveMessageGroup"
  >
    <div
      v-loading="isSubmitting"
      element-loading-spinner="sv-loading"
      :class="$style.container"
    >
      <div :class="$style.recieverList">
        <div>将以下{{ selectedRecieverList.length }}位联系人存为短信分组：</div>
        <div :class="$style.scroll">
          <span
            v-for="(reciever, index) in selectedRecieverList"
            :key="`selected_reciever_${index}`"
            :class="$style.contactTag"
          >
            {{ JSON.parse(reciever).name }}
          </span>
        </div>
      </div>
      <div :class="$style.item">
        <label>分组名称：</label>
        <div>
          <sv-input-search
            v-model="name"
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
            v-model="parentId"
          />
        </div>
      </div>
    </div>
  </sv-dialog>
</template>

<script>
import SMSDiapatchSelectMessagesGroup from '../../SMSDiapatchSelectMessagesGroup/SMSDiapatchSelectMessagesGroup.vue';

export default {
  name: 'SMSDispatchRightSaveMessagesGroupDialog',

  components: {
    SelectGroup: SMSDiapatchSelectMessagesGroup,
  },

  props: {
    selectedRecieverList: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      // 短信分组名称
      name: '',
      // 所属分组
      parentId: 0,
      // 正在提交
      isSubmitting: false,
    };
  },

  methods: {
    /**
     * @description 打开弹窗
     */
    init() {
      this.$refs.dialog.visible = true;
    },

    /**
     * @description 关闭弹窗
     */
    close() {
      this.$refs.dialog.visible = false;
      this.name = '';
      this.parentId = 0;
    },

    /**
     * @description 保存短信分组
     */
    saveMessageGroup() {
      // 提交数据验证
      if (this.name.length === 0) {
        this.$message.error('短信分组名称不能为空');
        return;
      }
      this.isSubmitting = true;
      // 解析后的联系人数据
      const parsedSelectedRecieverList = this.selectedRecieverList.map(
        (selected) => JSON.parse(selected),
      );
      // 电话号码列表
      const phoneList = parsedSelectedRecieverList.map(
        (selected) => (selected.phone || selected.mobile1),
      );
      // 联系人id列表
      const userIdList = parsedSelectedRecieverList.map((selected) => selected.id);
      const request = {
        method: 'post',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: '/message/messageGroup/saveMessageContactorGroup',
        data: {
          name: this.name,
          parentId: this.parentId,
          phone: phoneList.join(','),
          userIds: userIdList.join(','),
          id: -1,
          messageGroup: [],
          mailGroup: [],
        },
      };
      this.$http(request)
        .then(({ data: response }) => {
          if (response.code === 0) {
            this.$message.success('保存成功');
            this.$emit('refresh-messages-group');
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
  width: 350px;
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

.recieverList {
  margin: 10px 10px 0 10px;

  .scroll {
    max-height: 300px;
    overflow-y: auto;
    &::-webkit-scrollbar {
        background: transparent;
        width: 5px;
    }
    &::-webkit-scrollbar-thumb {
        background: #d5d5d5;
        border-radius: 5px;
    }
  }

  .contactTag {
    display: inline-block;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
    color: #999999;
    background: #FAFAFA;
    padding: 1px 5px;
    margin: 5px 5px 0 0;
  }
}
</style>
