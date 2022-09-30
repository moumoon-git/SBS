<template>
  <div :class="$style.wrapper">
    <sv-button @click="visible = !visible;">
      短信设置
    </sv-button>
    <!-- 弹窗内容 -->
    <div
      v-show="visible"
      :class="$style.dialog"
    >
      <!-- 1. 短信类型 -->
      <div :class="$style.item">
        <label>短信类型：</label>
        <div>
          <el-radio
            v-for="(item, index) in typeList"
            :key="`type_${index}`"
            v-model="setting.type"
            :label="Number(item.value)"
          >
            {{ item.name }}
          </el-radio>
        </div>
      </div>
      <!-- 2. 发送方式 -->
      <div :class="$style.item">
        <label>发送方式：</label>
        <div>
          <!-- 2.A 即时发送 -->
          <div>
            <el-radio
              v-model="setting.method"
              :label="0"
            >
              即时发送
            </el-radio>
          </div>
          <!-- 2.B 定时发送 -->
          <div>
            <el-radio
              v-model="setting.method"
              :label="1"
            >
              定时发送
            </el-radio>
            <el-date-picker
              v-show="setting.method === 1"
              v-model="setting.dateTime"
              :class="$style.date"
              :clearable="false"
              type="datetime"
              placeholder="选择日期时间"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </div>
          <!-- 2.C 催报短信 -->
          <div>
            <el-radio
              v-model="setting.method"
              :label="2"
            >
              催报短信
            </el-radio>
            <span v-show="setting.method === 2">
              次数：
              <sv-select
                v-model="setting.reminderCount"
                :options="countSelectOptions"
                :clearable="false"
                width="75px"
              />
              间隔：
              <sv-select
                v-model="setting.reminderInterval"
                :options="intervalSelectOptions"
                :clearable="false"
                width="85px"
              />
            </span>
          </div>
        </div>
      </div>
      <!-- 关闭按钮 -->
      <i
        :class="'el-icon-close ' + $style['close']"
        @click="visible = false"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SMSDispatchRightBottomMessagesSettingDialog',

  props: {
    messagesSetting: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      // 弹窗是否可见
      visible: false,
      // 短信类型列表
      typeList: [],
      // 短信设置
      setting: {
        /**
         * @property
         * @type { Number }
         * @description 短信类型，选项从后台获取，值从1开始。
         */
        type: 1,
        // 发送方式: 0-即时 1-定时 2-催报
        method: 0,
        // 定时发送的时间
        dateTime: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
        // 催报次数
        reminderCount: 1,
        // 催报间隔
        reminderInterval: 1,
      },
      // 催报短信选择器选项设置
      countSelectOptions: [
        { label: '1次', value: 1 },
        { label: '2次', value: 2 },
      ],
      intervalSelectOptions: [
        { label: '1分钟', value: 1 },
        { label: '2分钟', value: 2 },
      ],
    };
  },

  watch: {
    setting: {
      deep: true,
      immediate: true,
      handler(val) {
        this.$emit('update:messagesSetting', val);
      },
    },
  },

  mounted() {
    this.getMessageType();
  },

  methods: {
    /**
     * @description 设置短信类型
     * @param val 类型名称
     */
    setSmsType(val) {
      if (val) {
        this.setting.type = this.typeList.filter((el) => el.name === val)[0].id;
      } else {
        this.setting.type = '';
      }
    },
    /**
     * @description 获取短信类型
     */
    getMessageType() {
      const request = {
        method: 'get',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: `${window.SITE_CONFIG.cloudUrl}/event/eos/communication/sms/smsType`,
      };
      this.$http(request).then(({ data: response }) => {
        if (response.errorcode === 0) {
          this.typeList = [...response.data];
          if (this.typeList.length > 0) {
            this.setting.type = Number(this.typeList[0].code);
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" module>
.wrapper {
  display: inline;
  position: relative;
}

.dialog {
  position: absolute;
  right: 5px;
  bottom: 32px;
  background: #ffffff;
  border-radius: 5px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
  width: 570px;
  padding: 10px;
  z-index: 100;

  .item {
    display: flex;
    margin: 10px;

    & > label {
      font-weight: bold;
      color: #333333;
      width: 80px;
      flex-shrink: 0;
      line-height: 30px;
    }

    & > div {
      flex-grow: 1;
      line-height: 30px;
    }
  }

  .date {
    :global(.el-input__inner),
    :global(.el-input__icon) {
      height: 30px;
      line-height: 30px;
    }
    :global(.el-input__inner) {
      width: 185px;
      padding-right: 0;
    }
  }
}

.close {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
  font-size: 18px;
}
</style>
