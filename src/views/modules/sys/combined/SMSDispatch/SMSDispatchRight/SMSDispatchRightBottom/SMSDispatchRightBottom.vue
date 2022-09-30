<template>
  <div
    v-loading="isSending"
    element-loading-spinner="sv-loading"
    :class="$style.wrapper"
  >
    <div>
      <el-select
        v-model="relatedEvents"
        size="small"
        filterable
        :filter-method="selectEvent"
        placeholder="请选择关联事件"
      >
        <el-option
          v-for="item in eventData"
          :key="item.id"
          :label="item.title"
          :value="item.id"
        />
      </el-select>
      <MessagesSettingDialog
        ref="MessagesSettingDialog"
        :messages-setting.sync="messagesSetting"
      />
      <sv-button @click="chooseMessagesTemplate">
        选择短信模板
      </sv-button>
      <sv-button @click="saveAsMessagesTemplate">
        另存为模板
      </sv-button>
      <sv-button @click="selectSmsCard">
        短信名片
      </sv-button>
      <sv-button
        :class="$style.empty"
        @click="emptyContent"
      >
        清空内容
      </sv-button>
    </div>
    <sv-textarea
      v-model="messagesContent"
      :rows="7"
      placeholder="请输入短信内容"
      :maxlength="500"
      :scroll="true"
    />
    <div>
      <!-- bug13221 去掉短信签名 -->
      <!-- <span>
        签名：
        <span style="font-weight: bold;">【{{ signature }}】</span>
      </span> -->
      <span
        :style="{
          'color': messagesContent.length === 500 ? '#F66E6E' : '#666666',
          'float': 'right'
        }"
      >{{ messagesContent.length }}/500字</span>
    </div>
    <div>
      <span>本次发送{{ sendWay === 0 ? '短信' : '微信' }}总量{{ recieverList.length }}条</span>
      <span v-if="showRestMsgNum">剩余短信数量：{{ messagesCount }}</span>
    </div>
    <div style="text-align: right;">
      <!--      <el-radio-->
      <!--        v-model="sendWay"-->
      <!--        :label="0"-->
      <!--      >-->
      <!--        短信发送-->
      <!--      </el-radio>-->
      <!--      <el-radio-->
      <!--        v-model="sendWay"-->
      <!--        :label="1"-->
      <!--      >-->
      <!--        微信发送-->
      <!--      </el-radio>-->
      <sv-button
        type="primary"
        @click="sendMessages"
      >
        发送
      </sv-button>
    </div>
    <!-- 另存为模板弹窗 -->
    <SaveTemplateDialog
      ref="SaveTemplateDialog"
      :messages-content="messagesContent"
    />
    <!-- 短信模板弹窗 -->
    <MessagesTemplateDialog
      ref="MessagesTemplateDialog"
      @choose-template="handleChooseTemplate"
    />
    <!-- 选择人员弹窗 -->
    <selectMansDialog
      ref="selectDialog"
      selectTitle="选择联系人"
      :selectData="selectCardVisible"
      @close="smsCardClose"
      @closeDialog="smsCardClose"
      @addMans="cardSelect"
    />
  </div>
</template>

<script>
import selectMansDialog from "@/view/yz_eventManagement/eventReports/dialog/selectMansDialog";
import SMSDispatchRightBottomMessagesSettingDialog from './SMSDispatchRightBottomMessagesSettingDialog/SMSDispatchRightBottomMessagesSettingDialog.vue';
import SMSDispatchRightBottomSaveTemplateDialog from './SMSDispatchRightBottomSaveTemplateDialog/SMSDispatchRightBottomSaveTemplateDialog.vue';
import SMSDispatchRightBottomMessagesTemplateDialog from './SMSDispatchRightBottomMessagesTemplateDialog/SMSDispatchRightBottomMessagesTemplateDialog.vue';
import bus from '@/views/common/js/eventBus';

export default {
  name: 'SMSDispatchRightBottom',

  components: {
    MessagesSettingDialog: SMSDispatchRightBottomMessagesSettingDialog,
    SaveTemplateDialog: SMSDispatchRightBottomSaveTemplateDialog,
    MessagesTemplateDialog: SMSDispatchRightBottomMessagesTemplateDialog,
    selectMansDialog,
  },

  props: {
    // 收信人列表
    recieverList: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      // 关联事件选择器取值
      relatedEvents: '',
      // 关联事件选择器选项
      centerDialogVisible: false,
      currentPageSelect: 1, // 当前页数
      totalPages: 0,
      totalCount: 0,
      eventData: [],
      eventSearchKey: '',
      relatedEventsOptions: [],
      // 短信内容
      messagesContent: '',
      // 短信设置
      messagesSetting: {},
      // 发送方式：0-短信 1-微信
      sendWay: 0,
      // 签名
      signature: '',
      // 短信数量
      messagesCount: 0,
      // 正在发送
      isSending: false,
      showRestMsgNum: false,
      // 短信名片显示
      selectCardVisible: false,
      // 是否第一次点击短信名片
      smsOnceFlag: 0,
      // 回复短信类型
      historyType: '',
      // 回复短信id
      historyId: '',
    };
  },

  mounted() {
    this.getMessagesCountAndSignature();
    this.getEventList();

    // 获取短信模板
    bus.$on("getContent", val => {
      this.messagesContent = val;
      this.$refs.MessagesSettingDialog.setSmsType('转发');
    });
    // 获取通讯历史-回复内容中回复id
    bus.$on('replyPhoneItem', (val) => {
      const [replyId, type] = val;
      this.historyId = replyId;
      this.historyType = type;
    });
  },

  methods: {

    /**
     * @description 获取短信数量和签名
     */
    getMessagesCountAndSignature() {
      const request = {
        method: 'get',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: '/message/messageinfor/getSurplusMessageSum',
      };
      this.$http(request).then(({ data: response }) => {
        if (response.code === 0) {
          this.signature = response.signcode || '';
          this.messagesCount = response.messageSum || 0;
          this.showRestMsgNum = this.messagesCount !== '-1';
        }
      });
    },

    /**
     * @description 发送
     */
    sendMessages() {
      // 提交数据验证
      if (this.recieverList.length === 0) {
        this.$message.error('请添加收信人');
        return;
      }
      if (this.messagesContent.length === 0) {
        this.$message.error('请填写短信内容');
        return;
      }
      if (this.messagesContent.length > 500) {
        this.$message.error('短信内容字数不能超过500个');
        return;
      }
      if (this.sendWay === 0) {
        if (this.messagesCount !== '-1') {
          if (this.messagesCount - this.recieverList.length < 0) {
            this.$message.error('短信余量不足，无法发送短信，请充值或移除部分收信人');
            return;
          }
        }
      }

      this.isSending = true;

      // 收信人列表数据从JSON格式转换成对象
      const recieverListFormatted = this.recieverList.map((reciever) => JSON.parse(reciever));
      // 收信人的电话列表
      const phoneList = recieverListFormatted.map(
        (reciever) => (reciever.phone || reciever.mobile1),
      );
      // 收信人的id列表
      const userIdList = recieverListFormatted.map((reciever) => reciever.id);
      const userIds = userIdList.filter((item) => item !== -1);
      const urlPath = this.messagesSetting.method === 2
        ? `${window.SITE_CONFIG.cloudUrl}/event/eos/communication/sms/addPromptSmsQueue`
        : `${window.SITE_CONFIG.cloudUrl}/event/eos/communication/sms/addSmsQueue`;
      // 发送请求
      const requestData = {
        content: this.messagesContent,
        phoneNum: phoneList.join(','),
        doWay: this.messagesSetting.method,
        contactorIds: userIds.length > 0 ? userIds.join(',') : '0',
        smstypeId: this.messagesSetting.type,
        sendWay: this.sendWay,
        signature: this.signature,
        eventId: this.relatedEvents,
        mailGroup: [],
        messageGroup: [],
        historyType: this.historyType || null,
        historyId: this.historyId || null,
      };
      const params = this.messagesSetting.method === 2
        ? {
          data: {
            ...requestData,
            count: this.messagesSetting.reminderCount,
            interval: this.messagesSetting.reminderInterval,
          },
        }
        : {
          ...requestData,
          doTime: this.messagesSetting.reminderCount,
          doSpace: this.messagesSetting.reminderInterval,
          sendTime: new Date(this.messagesSetting.dateTime).getTime(),
        };
      const request = {
        method: 'post',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: urlPath,
        data: params,
      };
      this.$http(request)
        .then(({ data: response }) => {
          if (response.errorcode === 0) {
            this.$message.success('发送成功');
            this.emptyContent(); // 清空短信内容
            this.getMessagesCountAndSignature();
            this.$refs.MessagesSettingDialog.setSmsType();
          } else {
            this.$message.error(`发送失败，错误信息：${response.msg}`);
          }
        })
        .catch((error) => {
          this.$message.error(`发送失败，错误信息：${error}`);
        })
        .finally(() => { this.isSending = false; });
    },

    /**
     * @description 添加为模板
     */
    saveAsMessagesTemplate() {
      this.$refs.SaveTemplateDialog.init();
    },
    /**
     * @description 短信名片
     */
    selectSmsCard() {
      this.selectCardVisible = true;
    },

    chooseEvent() {
      this.centerDialogVisible = true;
      this.getEventList();
    },
    changeSelectPage(v) {
      this.currentPageSelect = v === 1
        ? this.currentPageSelect -= 1
        : this.currentPageSelect += 1;
      this.currentPageSelect = this.currentPageSelect < 1
        ? 1
        : this.currentPageSelect;
      this.getEventList();
    },
    selectEvent(val) {
      this.currentPageSelect = 1;
      this.eventSearchKey = val;
      this.getEventList();
    },
    // 获取关联事件
    getEventList() {
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/event/eos/event/listBy`,
        method: 'get',
        params: this.$http.adornParams({
          size: 1000,
          page: this.currentPageSelect,
          reportType: 0,
          name: this.eventSearchKey,
        }),
      }).then((data) => {
        // console.log(data)
        if (data.data.errorcode === 0) {
          this.eventData = data.data.data.data;
          this.totalCount = data.data.data.totalElements;
          this.totalPages = data.data.data.totalPages;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    submit() {
      this.relatedEvents = this.form.event;
      this.centerDialogVisible = false;
    },
    /**
     * @description 选择短信模板弹窗
     */
    chooseMessagesTemplate() {
      this.$refs.MessagesTemplateDialog.init();
    },

    /**
     * @description 更新编辑值为模板值
     */
    handleChooseTemplate(templateContent) {
      if (templateContent.length > 0) {
        this.messagesContent = templateContent;
      }
    },
    /**
     * @description 选择短信名片
     */
    cardSelect(checkItemIds, checkItem) {
      let smsCard = '';
      console.log('!!!!', checkItemIds, checkItem);
      if (!this.smsOnceFlag) {
        this.messagesContent += '\n【短信名片】\n';
        this.smsOnceFlag = 1;
      }
      checkItem.forEach((item) => {
        const phone = item.phone || item.mobile || item.mobile1 || item.mobile2;
        // 区分是否有职位、部门的展示方式
        if (item.workUnit && item.position) {
          smsCard += `${item.name}(${item.workUnit}/${item.position}) ${phone} \n`;
        } else if (item.workUnit || item.position) {
          smsCard += `${item.name}(${item.workUnit || item.position}) ${phone} \n`;
        } else {
          smsCard += `${item.name} ${phone} \n`;
        }
      });
      console.log('!!!!smsCard', smsCard);
      this.messagesContent += smsCard;
      this.selectCardVisible = false;
      this.$refs.selectDialog.cardEmpty(); // 清空勾选
    },
    /**
     * @description 关闭短信名片弹窗
     */
    smsCardClose() {
      this.selectCardVisible = false;
      this.$refs.selectDialog.cardEmpty(); // 清空勾选
    },
    /**
     * @description 清空短信内容
     */
    emptyContent() {
      this.messagesContent = '';
      this.smsOnceFlag = 0;
      this.$refs.selectDialog.cardEmpty(); // 清空勾选
    },
  },
};
</script>

<style lang="scss" module>
.wrapper {
  flex-shrink: 0;
  padding: 0 10px 10px 10px;

  & > div:first-child {
    margin-bottom: 10px;

    .empty {
      float: right;
    }
  }
}
</style>
<style lang="scss" scoped>
.iconstyle {
  display: block;
  font-weight: bold;
}
.op_button /deep/ .el-button:disabled {
  color: #c0c4cc!important;
  background-color: #fff;
  cursor: not-allowed;
}
.op_button /deep/ .el-button:hover {
  color: #0091FF!important;
  background: transparent;
}
.search_btn /deep/ .el-button:hover {
  background-color: transparent;
}
.radio_style {
  width: 350px;
  white-space: nowrap;
  margin-bottom: 5px;
}
.radio_div {
  /deep/ .el-radio__input {
    padding-bottom: 4px;
  }
  .title_div {
    display: inline-block;
    width: 340px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
/deep/ .el-input--small .el-input__inner {
  height: 30px;
  line-height: 30px;
}
</style>
