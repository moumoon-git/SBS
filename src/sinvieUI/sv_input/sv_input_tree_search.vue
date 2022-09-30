<template>
  <div
    ref="container"
    class="sv-input-tree-search"
  >
    <div class="sv-input-tree-search__icon" />
    <input
      v-model="inputValue"
      class="sv-input-tree-search__inner"
      :placeholder="placeholder"
      @change="$emit('change', inputValue)"
    >
    <div
      v-if="inputValue && clearable"
      class="sv-input-tree-search__icon sv-input-tree-search__clear"
      @click="
        inputValue = '';
        $emit('change', inputValue);
      "
    />
  </div>
</template>

<script>
export default {
  name: 'SvInputTreeSearch',

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    value: {
      type: String,
      default: '',
    },

    placeholder: {
      type: String,
      default: '按enter搜索',
    },

    width: {
      type: String,
      default: '200px',
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
    // 监听父组件传入的值
    value(val) {
      this.inputValue = val;
    },
  },

  mounted() {
    this.$refs.container.style.width = this.width;
    this.inputValue = this.value;
  },
};
</script>

<style lang="less">
input::-ms-clear,
input::-ms-reveal {
  display: none!important;
}

.sv-input-tree-search {
  display: inline-flex;
  position: relative;
  align-items: center;
  width: 100%;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  border: 1px solid #DDDDDD;
  border-radius: 21px;
  color: #666666;
  background: #ffffff;
  font-size: 14px;
  flex: 1;

  .sv-input-tree-search__inner {
    width: 100%;
    height: calc(100% - 2px);
    flex: 1;
    padding: 0;
    margin: 0;
    outline: none;
    border: none;

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

  .sv-input-tree-search__icon {
    margin: 0 5px 0 0;
    padding: 0;
    display: inline-block;
    width: 16px;
    height: 16px;
    background: no-repeat url('../img/search.svg') center/100% 100%;
  }

  .sv-input-tree-search__clear {
    margin: 0 0 0 5px;
    background-image: url('../img/clear.svg');
    cursor: pointer;

    &:hover {
      background-image: url('../img/clear_hover.svg');
    }
  }

  &:hover {
    border-color: #b4b4b4;
  }

  &:focus-within {
    border-color: #0091ff;
  }
}
</style>
