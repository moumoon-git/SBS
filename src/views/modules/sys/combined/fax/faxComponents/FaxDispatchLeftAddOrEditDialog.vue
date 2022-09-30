<template>
  <sv-dialog
    ref="dialog"
    :title="type === 'add' ? '新增传真分组' : '编辑传真分组'"
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
            placeholder="请输入传真分组名称"
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
        <label>包含单位：</label>
        <div :class="$style.contactsList">
          <faxSelectContact
            v-model="selectedContactsList"
            title="联系单位"
            :multiple="true"
            :api="['/mail/mailgroup/list', '/mail/mailcontactor/list']"
            @update:templateAddNodes="templateAddNodes.push($event)"
            @update:templateDeleteNodes="templateDeleteNodes.push($event)"
          />
        </div>
      </div>
    </div>
  </sv-dialog>
</template>

<script>
import FaxDiapatchSelectMessagesGroup from './FaxDiapatchSelectMessagesGroup.vue';
import faxSelectContact from './fax_select_contact.vue';

export default {
  name: 'FaxDispatchLeftAddOrEditDialog',

  components: {
    SelectGroup: FaxDiapatchSelectMessagesGroup,
    faxSelectContact,
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
      // 筛选出的新增的单位节点
      templateAddNodes: [],
      // 筛选出的删除的单位节点
      templateDeleteNodes: [],
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
        this.groupName = node.groupName;
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
        method: 'GET',
        baseURL: window.SITE_CONFIG.cloudUrl,
        url: '/event/cdrFaxGroupMemberMember/getCdrFaxGroupMemberList',
        params: {
          groupId: this.id,
        },
      };
      this.$http(request)
        .then(({ data: response }) => {
          console.log('/event/cdrFaxGroupMemberMember/getCdrFaxGroupMemberList', response);
          if (response.errorcode === 0) {
            this.selectedContactsList = [...response.data];
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
          this.$message.error('请选择联系单位');
          return;
        }
        this.isLoading = true;
        const phoneList = this.selectedContactsList.map(
          (contact) => (contact.phone || contact.mobile1),
        );
        const userIdList = this.selectedContactsList.map((contact) => contact.id);
        const request = {
          method: 'post',
          baseURL: window.SITE_CONFIG.cloudUrl,
          url: '/event/cdrFaxGroup/save',
          data: {
            // name: this.groupName,
            // parentId: this.parentId,
            // phone: phoneList.join(','),
            // userIds: userIdList.join(','),
            // id: this.id,
            // messageGroup: [],
            // mailGroup: [],
            groupName: this.groupName,
            parentId: this.parentId,
          },
        };
        let groupId;
        if (this.type === 'add') {
          this.$http(request)
            .then(({ data: response }) => {
              console.log('/event/cdrFaxGroup/save', response);
              if (response.errorcode === 0) {
                this.$message.success('新增传真分组成功');
                groupId = response.data.id;
              } else {
                this.$message.error(`新增失败，错误信息：${response.msg}`);
              }
            }).then(() => {
              this.$http({
                method: 'post',
                baseURL: window.SITE_CONFIG.cloudUrl,
                url: '/event/cdrFaxGroupMemberMember/addCdrFaxGroupMember',
                data: {
                  groupId,
                  faxGroupMemberList: this.selectedContactsList.map((contact) =>{ return { 'memberType': 2, 'memberId': contact.memberId, 'name':contact.name, fax:contact.fax, responsible:contact.responsible }; }),
                },
              }).then(({ data: response }) => {
                console.log('/event/cdrFaxGroupMemberMember/addCdrFaxGroupMember', response);
                if (response.errorcode === 0) {
                  this.$message.success('新增传真分组成员成功');
                  this.close();
                  this.$emit('refresh-messages-group');
                } else {
                  this.$message.error(`新增失败，错误信息：${response.msg}`);
                }
              });
            })
            .catch((error) => { this.$message.error(`新增失败，错误信息：${error}`); })
            .finally(() => { this.isLoading = false; });
        } else {
          request.url = '/event/cdrFaxGroup/update';
          request.data.id = this.id;
          this.$http(request)
            .then(({ data: response }) => {
              if (response.errorcode === 0) {
                this.$message.success('更新传真分组成功');
              } else {
                this.$message.error(`更新失败，错误信息：${response.msg}`);
              }
            }).then(() => {
              console.log('this.templateAddNodes, this.templateDeleteNodes', this.templateAddNodes, this.templateDeleteNodes);
              if (this.templateAddNodes.length !== 0) {
                this.$http({
                  method: 'post',
                  baseURL: window.SITE_CONFIG.cloudUrl,
                  url: '/event/cdrFaxGroupMemberMember/addCdrFaxGroupMember',
                  data: {
                    groupId: this.id,
                    faxGroupMemberList: this.selectedContactsList.map((contact) =>{ return { 'memberType': 2, 'memberId': contact.memberId, 'name':contact.name, fax:contact.fax, responsible:contact.responsible }; }),
                  },
                }).then(({ data: response }) => {
                  console.log('/event/cdrFaxGroupMemberMember/addCdrFaxGroupMember', response);
                  if (response.errorcode === 0) {
                    this.$message.success('新增传真分组成员成功');
                  } else {
                    this.$message.error(`新增失败，错误信息：${response.msg}`);
                  }
                });
              }
              // if (this.templateDeleteNodes.length !== 0) {
              //   this.$http({
              //     method: 'post',
              //     baseURL: window.SITE_CONFIG.cloudUrl,
              //     url: '/event/cdrFaxGroupMemberMember/batchDelete',
              //     data: this.templateDeleteNodes.map((item) => item.id),
              //   }).then(({ data: response }) => {
              //     console.log('/event/cdrFaxGroupMemberMember/batchDelete', response);
              //     if (response.errorcode === 0) {
              //       this.$message.success('删除传真分组成员成功');
              //     } else {
              //       this.$message.error(`删除失败，错误信息：${response.msg}`);
              //     }
              //   });
              // }
              this.close();
              this.$emit('refresh-messages-group');
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
