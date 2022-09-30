<template>
  <div :class="$style.container">
    <!-- 1. 总数 -->
    <span>共{{ total }}条</span>
    <!-- 2. 上一页 -->
    <button
      :class="[
        'el-icon-arrow-left',
        $style.button,
      ]"
      :style="{
        cursor: modelValue <= 1 ? 'not-allowed' : '',
      }"
      @click="prev"
    />
    <!-- 3. 页数 -->
    <input
      :class="$style.input"
      :value="modelValue"
      @change="handleIndexChange"
    >
    <span>/</span>
    <span>{{ pageTotal }}</span>
    <!-- 4. 下一页 -->
    <button
      :class="[
        'el-icon-arrow-right',
        $style.button,
      ]"
      :style="{
        cursor: modelValue >= pageTotal ? 'not-allowed' : '',
      }"
      @click="next"
    />
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    total: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    modelValue: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    pageTotal() {
      return Math.ceil(this.total / this.pageSize) || 1;
    },
  },
  methods: {
    handleIndexChange(evt) {
      const val = Math.floor(Number(evt.target.value));
      if (val !== this.modelValue) {
        if (val <= 0) {
          this.$emit('update:modelValue', 1);
          this.$emit('change', 1);
        } else if (val >= this.pageTotal) {
          this.$emit('update:modelValue', this.pageTotal);
          this.$emit('change', this.pageTotal);
        } else {
          this.$emit('update:modelValue', val);
          this.$emit('change', val);
        }
      }
    },
    prev() {
      if (this.modelValue > 1) {
        this.$emit('update:modelValue', this.modelValue - 1);
        this.$emit('change', this.modelValue - 1);
      }
    },
    next() {
      if (this.modelValue < this.pageTotal) {
        this.$emit('update:modelValue', this.modelValue + 1);
        this.$emit('change', this.modelValue + 1);
      }
    },
  },
};
</script>

<style lang="scss" module>
.container {
  height: 37px;
  line-height: 37px;
  border-top: 1px solid #F2F2F2;
  text-align: right;
  padding-right: 20px;
  .input {
    outline: none;
    border: 1px solid rgba(0, 0, 0, .15);
    border-radius: 2px;
    width: 60px;
    height: 24px;
    text-align: center;
    &:hover,
    &:active {
      border-color: #0091FF;
    }
  }
  .button {
    background: none;
    border: none;
    outline: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    &:hover {
      color: #0091FF;
    }
  }
}
</style>
