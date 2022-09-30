<template>
  <div
    ref="container"
    :class="[
      'sv-input-search',
      {
        'sv-input-search-disabled': disabled,
        'sv-input-search-readonly': readonly,
        'sv-input-search-empty': isEmpty,
      },
    ]"
    @click="$emit('click')"
  >
    <input
      ref="inner"
      v-model="inputValue"
      class="sv-input-search__inner"
      :placeholder="placeholder"
      :readonly="readonly || disabled"
      @change="
        $emit('change', inputValue);
        isEmpty = false;
      "
      @focus="readonly ? $refs.inner.blur() : null"
    >
    <div
      v-if="inputValue && clearable"
      class="sv-input-search__icon sv-input-search__clear"
      @click="
        inputValue=''
        $emit('change', inputValue)
      "
    />
    <!-- v-if="!inputValue && suffix" -->
    <div
      class="sv-input-search__icon"
    />
  </div>
</template>

<script>
export default {
  name: 'SvInputSearch',

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    value: {
      type: [String, Number],
      default: '',
    },

    placeholder: {
      type: String,
      default: '请输入关键字',
    },

    width: {
      type: String,
      default: '150px',
    },

    suffix: {
      type: Boolean,
      default: true,
    },

    clearable: {
      type: Boolean,
      default: true,
    },

    readonly: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      inputValue: '',
      // 红框提示输入不能为空
      isEmpty: false,
    };
  },

  watch: {
    // 监听父组件传入的值
    value(val) {
      this.inputValue = val;
      if (val !== '' || val !== undefined || val !== null) {
        this.isEmpty = false;
      }
    },
  },

  mounted() {
    this.$refs.container.style.width = this.width;
    this.inputValue = this.value;
  },
};
</script>

<style lang="less">
// 隐藏ie默认清除按钮
input::-ms-clear,
input::-ms-reveal {
  display: none !important;
}

.sv-input-search {
  display: inline-flex;
  position: relative;
  align-items: center;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  border: 1px solid #DDDDDD;
  border-radius: 4px;
  color: #666666 !important;
  font-size: 14px;
  background: #ffffff;

  .sv-input-search__inner {
    width: 100%;
    height: calc(100% - 2px);
    flex: 1;
    padding: 0;
    margin: 0;
    outline: none;
    border: none;
    background: transparent;

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

  .sv-input-search__icon {
    margin: 0 0 0 5px;
    padding: 0;
    display: inline-block;
    width: 16px;
    height: 16px;
    background: no-repeat url('../img/search.svg') center/100% 100%;
  }

  .sv-input-search__clear {
    background-image: url('../img/clear.svg');
    cursor: pointer;

    &:hover {
        background-image: url('../img/clear_hover.svg');
    }
  }

  &:hover {
    border-color: #b4b4b4;
  }

  &:active,
  &:focus-within {
    border-color: #0091ff;
  }
}

.sv-input-search-disabled {
  background: #F8F8F8;
  cursor: not-allowed;

  .sv-input-search__inner {
    cursor: not-allowed;
  }

  &:hover {
    border-color: #DDDDDD;
  }

  &:focus-within {
    border-color: #DDDDDD;
  }
}

.sv-input-search-readonly {
  cursor: pointer;

  .sv-input-search__inner {
    cursor: pointer;
  }
}

.sv-input-search-empty,
.sv-input-search-empty:hover {
  border-color: #F66E6E;
}
</style>
