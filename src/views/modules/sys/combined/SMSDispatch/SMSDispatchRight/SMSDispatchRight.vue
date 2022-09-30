<template>
  <div :class="$style.wrapper">
    <!-- 1. 添加收信人 -->
    <div>
      <sv-input-search
        v-model.trim="searchKeyword"
        placeholder="请输入手机号码添加收信人（多个号码用空格分隔开）"
      />
      <sv-button @click="addReciever">
        添加
      </sv-button>
    </div>
    <!-- 2. 已添加的收信人 -->
    <div :class="$style.recieverList">
      <div :class="$style.recieverHeader">
        <span>已添加收信人：</span>
        <span>{{ recieverList.length }}</span>
        <span @click="clearReciever">
          全部清空
        </span>
      </div>
      <div :class="$style.recieverScroll">
        <span
          v-for="(reciever, index) in recieverList"
          :key="`reciever_${index}`"
          :class="[
            $style.reciever,
            {[$style['reciever--selected']]: selectedRecieverList.includes(reciever)},
          ]"
          @click="toggleSelectReciever(reciever)"
        >
          {{
            JSON.parse(reciever).name && JSON.parse(reciever).name !== '未知'
              ? JSON.parse(reciever).name
              : JSON.parse(reciever).phone
          }}
          <span @click.stop="deleteReciever(reciever)">×</span>
        </span>
      </div>
      <div :class="$style.recieverFooter">
        已选择{{ selectedRecieverList.length }}位收信人
        <sv-button @click="saveAsMessagesGroup">
          存为短信分组
        </sv-button>
      </div>
    </div>
    <!-- 3. 短信内容编辑 -->
    <SMSDispatchRightBottom
      :reciever-list="recieverList"
    />
    <SaveMessagesGroupDialog
      ref="SaveMessagesGroupDialog"
      :selected-reciever-list="selectedRecieverList"
      @refresh-messages-group="$emit('refresh-messages-group');"
    />
  </div>
</template>

<script>
import SMSDispatchRightSaveMessagesGroupDialog from './SMSDispatchRightSaveMessagesGroupDialog/SMSDispatchRightSaveMessagesGroupDialog.vue';
import SMSDispatchRightBottom from './SMSDispatchRightBottom/SMSDispatchRightBottom.vue';
import bus from '@/views/common/js/eventBus';

export default {
  name: 'SMSDispatchRight',

  components: {
    SaveMessagesGroupDialog: SMSDispatchRightSaveMessagesGroupDialog,
    SMSDispatchRightBottom,
  },

  props: {
    // 联系人勾选列表
    selectedList: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      // 输入框
      searchKeyword: '',
      // 收信人列表
      recieverList: [],
      // 选中的收信人列表
      selectedRecieverList: [],
      // 正在添加
      isAdding: false,
    };
  },

  watch: {
    // 联系人勾选列表发生变化
    selectedList(selectedList) {
      this.recieverList = [...selectedList];

      // 保留还在收信人列表中的已选择的联系人
      const newRecieverList = [];
      this.selectedRecieverList.forEach((selected) => {
        if (this.recieverList.includes(selected)) {
          newRecieverList.push(selected);
        }
      });
      this.selectedRecieverList = [...newRecieverList];
    },
  },
  mounted() {
    // 获取通讯历史-回复内容中回复的联系人
    bus.$on('replyPhoneNumber', (val) => {
      this.searchKeyword = val;
      this.addReciever();
    });
  },
  methods: {
    /**
     * @description 添加收信人
     */
    addReciever() {
      const phoneList = ` ${this.searchKeyword} `.match(/(1\d{10})(?!\d)/g);
      if (phoneList !== null && !this.isAdding) {
        this.isAdding = true;
        const request = {
          method: 'post',
          baseURL: window.SITE_CONFIG.baseUrl,
          url: '/message/messageinfor/getContactorByPhone',
          data: {
            phone: phoneList.join(','),
          },
        };
        this.$http(request)
          .then(({ data: response }) => {
            if (response.code === 0) {
              response.data.forEach((reciever) => {
                if (
                  reciever.id === -1
                ) {
                  // 不存在通讯录中的联系人
                  if (!this.recieverList.includes(JSON.stringify(reciever))) {
                    // 未添加过的则添加
                    this.recieverList.push(JSON.stringify(reciever));
                  }
                } else {
                  const index = this.recieverList.findIndex(
                    (contact) => JSON.parse(contact).id === reciever.id,
                  );
                  if (index === -1) {
                    // 通讯录中存在的联系人，且未被勾选
                    this.recieverList.push(JSON.stringify(reciever));
                  }
                }
              });
              this.$emit('update:selectedList', this.recieverList);
              this.searchKeyword = '';
            }
          })
          .finally(() => {
            this.isAdding = false;
          });
      } else {
        this.$message.error('请填写正确的手机号码');
      }
    },

    /**
     * @description 删除特定收信人
     * @param { String } reciever 收信人
     */
    deleteReciever(reciever) {
      this.recieverList.splice(
        this.recieverList.indexOf(reciever),
        1,
      );

      // 已选择的联系人也要一并删除
      if (this.selectedRecieverList.includes(reciever)) {
        this.selectedRecieverList.splice(
          this.selectedRecieverList.indexOf(reciever),
          1,
        );
      }
      this.$emit('update:selectedList', this.recieverList);
    },

    /**
     * @description 清空收信人
     */
    clearReciever() {
      this.recieverList = [];
      this.$emit('update:selectedList', this.recieverList);
    },

    /**
     * @description 切换选中收信人
     * @param { String } reciever 收信人
     */
    toggleSelectReciever(reciever) {
      if (this.selectedRecieverList.includes(reciever)) {
        this.selectedRecieverList.splice(
          this.selectedRecieverList.indexOf(reciever),
          1,
        );
      } else {
        this.selectedRecieverList.push(reciever);
      }
    },

    /**
     * @description 保存为短信分组
     */
    saveAsMessagesGroup() {
      if (this.selectedRecieverList.length > 0) {
        this.$refs.SaveMessagesGroupDialog.init();
      } else {
        this.$message.info('请点击选择收信人');
      }
    },
  },
};
</script>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  width: calc(100% - 640px);
  height: 100%;
  flex: 1;

  // 添加收信人
  & > div:first-child {
    width: 100%;
    height: 50px;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    display: flex;
    flex-shrink: 0;

    :global(.sv-input-search) {
      flex-grow: 1;
      margin-right: 6px;
    }
  }
}

.recieverList {
  flex: 1;
  margin: 0 10px 10px 10px;
  border: 1px solid #EAE6E6;
  border-radius: 4px;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .recieverHeader {
    height: 50px;
    line-height: 50px;
    flex-shrink: 0;

    & > span {
      &:nth-child(2) {
        background: #F3F3F7;
        border-radius: 4px;
        color: #333333;
        padding: 5px 10px;
        font-weight: bold;
      }

      &:last-child {
        float: right;
        color: #0091FF;
        cursor: pointer;
        user-select: none;
        &:hover {
            color: #5eadff;
        }
        &:active {
            color: #2476E0;
        }
      }
    }
  }

  .recieverScroll {
    overflow-y: auto;
    flex: 1;

    &::-webkit-scrollbar {
        background: transparent;
        width: 5px;
    }

    &::-webkit-scrollbar-thumb {
        background: #d5d5d5;
        border-radius: 5px;
    }

    .reciever {
      white-space: nowrap;
      font-size: 14px;
      display: inline-block;
      height: 30px;
      line-height: 28px;
      border: 1px solid #E0E0E0;
      border-radius: 3px;
      background: #FAFAFA;
      padding: 0 5px;
      margin: 0 10px 10px 0;
      cursor: pointer;
      color: #999999;

      // 删除按钮
      span {
          cursor: pointer;
          font-size: 18px;
          &:hover {
              color: #b4b4b4;
          }
      }

      &:hover {
        border-color: #0091FF;
      }

      &--selected {
        border-color: #0091FF;
        color: #0091FF;
      }
    }
  }

  .recieverFooter {
    height: 50px;
    line-height: 50px;
    flex-shrink: 0;
  }
}
</style>
