<template>
  <div class="sv-tree-tab">
    <div
      v-for="(tabName, index) in tabList"
      :key="`sv-tree-tab__${index}`"
      :class="[
        'sv-tree-tab__item',
        { 'sv-tree-tab__item__active': isActive === index }
      ]"
      @click="
        isActive = index;
        $emit('switch', index);
      "
    >
      {{ tabName }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SvTreeTab',

  props: {
    tabList: {
      type: Array,
      default: () => ['标签A', '标签B', '标签C'],
    },
  },

  data() {
    return {
      isActive: 0,
    };
  },
};
</script>

<style lang="less">
.sv-tree-tab {
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #DDDDDD;
  padding: 5px 5px 10px 5px;
  margin: 10px 0 0 0;
  height: 40px;

  .sv-tree-tab__item {
    font-size: 16px;
    color: #999999;
    cursor: pointer;
    position: relative;

    &.sv-tree-tab__item__active {
      color: #333333;
      font-weight: bold;

      &::after {
        content: '';
        position: absolute;
        left: calc(50% - 7px);
        top: 27px;
        display: block;
        background: white;
        width: 15px;
        height: 15px;
        transform: rotate(45deg);
        border: 1px solid #DDDDDD;
        border-bottom: none;
        border-right: none;
      }
    }
  }
}
</style>
