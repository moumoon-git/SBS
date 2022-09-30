<!--
  * @author tanjinfeng
  * @date 2020-12-07
  * @description 通讯调度页面-短信调度模块（重构）
-->
<template>
  <div :class="$style.wrapper">
    <SMSDispatchLeft
      ref="SMSDispatchLeft"
      :selected-list.sync="selectedList"
    />
    <SMSDispatchRight
      :selected-list.sync="selectedList"
      @refresh-messages-group="refreshMessagesGroup"
    />
  </div>
</template>

<script>
import SMSDispatchLeft from './SMSDispatchLeft/SMSDispatchLeft.vue';
import SMSDispatchRight from './SMSDispatchRight/SMSDispatchRight.vue';

export default {
  name: 'SMSDispatch',

  components: {
    SMSDispatchLeft,
    SMSDispatchRight,
  },

  data() {
    return {
      selectedList: [],
    };
  },

  methods: {
    /**
     * @description 右边保存短信分组成功时，左边短信分组刷新
     */
    refreshMessagesGroup() {
      if (this.$refs.SMSDispatchLeft.groupType === 'messages') {
        this.$refs.SMSDispatchLeft.handleAllClick();
        this.$refs.SMSDispatchLeft.getGroupTree();
      }
    },
  },
};
</script>

<style lang="scss" module>
.wrapper {
  width: 100%;
  height: calc(100vh - 165px);
  min-height: 600px;
  display: flex;

  & > div {
    border-radius: 4px;
    box-shadow: 0px 4px 14px 3px rgba(54,121,225,0.09);
    background: #ffffff;

    &:first-child {
      margin-right: 10px;
    }
  }
}
</style>
