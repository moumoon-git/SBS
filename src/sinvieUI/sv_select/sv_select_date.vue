<template>
  <div class="sv-select-date">
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
      @change="emitDate()"
    />
  </div>
</template>

<script>
export default {
  name: 'SvSelectDate',

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    value: {
      type: Array,
      default: () => ['', ''],
    },
  },

  data() {
    return {
      dateRange: ['', ''],
    };
  },

  watch: {
    value(val) {
      this.dateRange = ['', ''];
      this.dateRange[0] = val[0] ? val[0] : '';
      this.dateRange[1] = val[1] ? val[1] : '';
    },
  },

  mounted() {
    this.dateRange[0] = this.value[0] ? this.value[0] : '';
    this.dateRange[1] = this.value[1] ? this.value[1] : '';
  },

  methods: {
    emitDate() {
      if (this.dateRange === null) {
        this.dateRange = ['', ''];
      }
      this.$emit('change', this.dateRange);
    },
  },
};
</script>

<style lang="scss">
.sv-select-date {
  display: inline-block;
  flex-shrink: 0;
  .el-date-editor {
    width: 250px !important;
    height: 30px !important;
    padding: 0 5px 0 10px !important;
    border: 1px solid #DDDDDD !important;
    position: relative;

    .el-range-input {
      margin: 0 !important;
      width: 90px;
      color: #666666 !important;
      &::-webkit-input-placeholder {
        color: #B4B4B4;
      }
      &:-moz-placeholder {
        color: #B4B4B4;
      }
      &::-moz-placeholder {
        color: #B4B4B4;
      }
      &:-ms-input-placeholder {
        color: #B4B4B4;
      }
    }

    .el-range-separator {
      width: 30px;
      margin: 0 !important;
      padding: 0 !important;
      color: #666666 !important;
    }

    .el-range__icon {
      position: static !important;
      float: none !important;
    }

    .el-range__close-icon {
      font-size: 18px;
      color: #999999;
      transition: none;

      &:hover{
        color: #dbdbdb;
      }
    }

    &:hover {
      border-color: #b4b4b4 !important;
    }

    &:focus-within {
      border-color: #0091ff !important;
    }
  }
}
</style>
