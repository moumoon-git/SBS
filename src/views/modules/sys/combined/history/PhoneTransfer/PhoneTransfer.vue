<template>
  <div :class="$style['phone-transfer-container']">
    <el-button
      type="text"
      :icon="$style['transfer-icon']"
      :class="$style['transfer-button']"
    >
      电话转接
    </el-button>
  </div>
</template>

<style lang="scss" module>
.phone-transfer-container {
  position: relative;
  margin: 0 20px;

  &::before {
    width: 1px;
    height: 20px;
    background: #DCDEE0;
    display: block;
    content: '';
    position: absolute;
    left: -20px;
    top: calc(50% - 10px);
  }

  // 转接按钮
  .transfer-button {
    display: flex;
    align-items: center;
    color: #969799;
    font-size: 16px;
  }

  // 图标-默认样式
  .transfer-icon {
    width: 18px;
    height: 16px;
    background: url('@/assets/img/transfer/dial_grey.svg');
    background-size: 18px 16px;
    background-repeat: no-repeat;
    margin-right: 6px;
    display: inline-block;
  }

  // 图标-激活样式
  .transfer-icon-active {
    width: 18px;
    height: 16px;
    background: url('@/assets/img/transfer/dial_blue.svg');
    background-size: 18px 16px;
    background-repeat: no-repeat;
    margin-right: 6px;
    display: inline-block;
  }
}

</style>
