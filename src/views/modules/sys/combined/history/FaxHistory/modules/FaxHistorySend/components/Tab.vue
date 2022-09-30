<template>
  <div :class="$style.container">
    <div
      v-for="(tab, index) in data"
      :key="tab.name"
      :class="{
        [$style.active]: currentIndex === index
      }"
      @click="$emit('click', index)"
    >
      {{ tab.name }}
      （{{ tab.value }}）
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tab',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss" module>
.container {
  background: #F7F8FA;
  color: #999;
  height: 30px;
  line-height: 30px;
  display: flex;
  justify-content: space-around;
  cursor: pointer;
  .active {
    border-bottom: 2px solid #0091FF;
    font-weight: bold;
    color: #555;
  }
}
</style>
