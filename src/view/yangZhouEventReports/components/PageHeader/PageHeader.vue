<template>
  <div class="page-header-container">
    <div class="page-header-container__left">
      <img src="/static/img/loveRecord.png" alt class="image-card"/>
      <span class="page-name">
        <slot name="name">
        </slot>
      </span>
    </div>
    <div class="page-header-container__right">
      <slot />
    </div>
  </div>
</template>
<script>
export default {
  name: 'PageHeader',
}
</script>
<style lang="scss">
.page-header-container {
  width: 100%;
  height: 74px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 1);
  padding: 0 28px;

  // 左边
  .page-header-container__left {
    display: flex;
    align-items: center;

    .page-name {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: bold;
      color: #333333;
      font-family: PingFangSC-Medium;
    }

    .image-card {
      width: 28px;
      height: 22px;
      margin-right: 14px;
    }
  }

  // 右边
  .page-header-container__right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
