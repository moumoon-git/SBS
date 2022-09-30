<template>
  <div class="seats-management-sv-select">
    <el-select
      v-model="inputValue"
      :placeholder="placeholder"
      :clearable="clearable"
      size="small"
      @change="handleChange"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.seatNumber"
        :value="item.id"
        :disabled="item.disabled"
      >
        <el-tooltip
          v-if="item.disabled"
          class="item"
          effect="dark"
          placement="top"
          :content="item.remark"
        >
          <span style="display: block">{{ item.seatNumber }}</span>
        </el-tooltip>
        <span v-else>{{ item.seatNumber }}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'SvSelect',
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    clearable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      inputValue: '',
    };
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        this.inputValue = newVal;
      },
      immediate: true,
    },
  },
  methods: {
    /**
     * @description 当值改变时触发
     */
    handleChange() {
      this.$emit("change", this.inputValue);
    },
  },
};
</script>
<style lang="scss">
.seats-management-sv-select {
  .el-select {
    input {
      width: 280px;
    }
  }
}
.el-select-dropdown {
  width: 280px;
  .el-select-dropdown__item.is-disabled:hover,
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background: rgba(0, 145, 255, 0.1);
  }
}
</style>
