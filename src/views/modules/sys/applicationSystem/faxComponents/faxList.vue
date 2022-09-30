<template>
  <div class="faxLists">
    <div class="faxLists__item" v-for="(item, idx) in faxList" :key="idx">
      <div class="faxLists__body">
        <div class="faxItem__unit">{{ label }}：{{ faxUnit }}</div>
        <div class="faxItem__right">
          <div class="faxItem__success" v-if="listType == 'success'"></div>
          <div class="faxItem__fail" v-if="listType == 'fail'"></div>
          <div class="faxItem__sending" v-if="listType == 'sending'"></div>
        </div>
      </div>
      <el-progress
        v-if="listType == 'sending'"
        :stroke-width="2"
        :percentage="100"
      ></el-progress>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    label: {
      type: String,
      default: "收件单位"
    },
    faxUnit: {
      type: String
    },
    listType: {
      type: String,
      default: "all"
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="less">
.faxLists {
  .faxLists__item {
    width: 100%;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;

    .faxItem__unit {
      font-size: 12px;
      color: #333333;
    }

    .faxItem__right {
    }
  }
}
</style>
