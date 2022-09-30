<template>
  <sv-dialog
    ref="dialog"
    :title="type === 'add' ? '新增短信分组' : '编辑短信分组'"
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
      <!-- <div :class="$style.item">
        <label>所属分组：</label>
        <div>
          <SelectGroup
            v-model="parentId"
            :name="parentName"
          />
        </div>
      </div> -->
      <div :class="$style.item">
        <label>所属人员：</label>
        <div :class="$style.contactsList">
          <sv-select-contact
            v-model="selectedContactsList"
            title="联系人"
            :multiple="true"
            :api="['/mail/mailgroup/list', '/mail/mailcontactor/list']"
          />
        </div>
      </div>
    </div>
  </sv-dialog>
</template>

<script>
import SMSDispatchSelectMessagesGroup from '../../SMSDiapatchSelectMessagesGroup/SMSDiapatchSelectMessagesGroup.vue';

export default {
  name: 'SMSDispatchLeftAddOrEditDialog',

  components: {
    SelectGroup: SMSDispatchSelectMessagesGroup,
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
      parentId: 0,
      parentName: '顶级分组',
      // 选中的联系人列表
      selectedContactsList: [],
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
    ) {
      this.type = type;
      if (type === 'add') {
        this.id = -1;
        this.groupName = '';
        this.parentName = node.name || '顶级分组';
        this.parentId = node.id || 0;
        this.selectedContactsList = [];
      } else {
        this.id = node.id;
        this.groupName = node.name;
        this.parentName = node.parentName || '顶级分组';
        this.parentId = node.parentId || 0;
        this.getSelectedContactsList();
      }
      this.$refs.dialog.visible = true;
    },

    /**
     * @description 获取当前分组的联系人
     */
    getSelectedContactsList() {
      this.isLoading = true;

      const request = {
        method: 'post',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: '/message/messageGroup/selectById',
        data: {
          limit: 1000,
          page: 1,
          id: [this.id],
          search: '',
        },
      };
      this.$http(request)
        .then(({ data: response }) => {
          if (response.code === 0) {
            this.selectedContactsList = [...response.page.list];
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
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
        if (this.selectedContactsList.length === 0) {
          this.$message.error('请选择联系人');
          return;
        }
        this.isLoading = true;
        const phoneList = this.selectedContactsList.map(
          (contact) => (contact.phone || contact.mobile1),
        );
        const userIdList = this.selectedContactsList.map((contact) => contact.id);
        const request = {
          method: 'post',
          baseURL: window.SITE_CONFIG.baseUrl,
          url: '/message/messageGroup/saveMessageContactorGroup',
          data: {
            name: this.groupName,
            parentId: this.parentId,
            phone: phoneList.join(','),
            userIds: userIdList.join(','),
            id: this.id,
            messageGroup: [],
            mailGroup: [],
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
          request.url = '/message/messageGroup/updateGroup';
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

.contactsList {
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    background: transparent;
    width: 0px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d5d5d5;
    border-radius: 5px;
  }

  &:hover::-webkit-scrollbar {
    width: 5px;
  }
}
</style>
