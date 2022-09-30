<template>
  <div
    ref="container"
    class="sv-select"
    :class="isExpanded?'sv-select-focus':''"
    @click="expandOption($event)"
  >
    <div class="sv-select__reference">
      <input
        v-model="inputValue.label"
        class="sv-select__inner"
        :style="align === 'left' ? 'text-align: left' : ''"
        type="text"
        readonly
        :placeholder="placeholder"
      >
      <!-- 后缀图标 -->
      <div
        v-if="inputValue.label && clearable"
        class="sv-select__icon sv-select__clear"
        @click.stop="
          inputValue = {
            label: '',
            value: ''
          }
        "
      />
      <div
        v-if="!inputValue.label || !clearable"
        class="sv-select__icon"
      />
      <!-- 选项框 -->
      <div
        class="sv-select__option"
      >
        <div
          v-for="(optionItem, index) in options"
          :key="index"
          class="sv-select__option__item"
          :class="optionItem.active == false ? 'sv-select__option__item__inactive': ''"
          @click="optionItem.active != false? inputValue = optionItem: null"
        >
          {{ optionItem.label }}
        </div>
        <div
          v-if="options.length === 0"
          class="sv-select__option__item sv-select__option__item__inactive"
        >
          暂无数据
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SvSelect',
  model: {
    prop: 'value',
    event: 'change',
  },
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
    width: {
      type: String,
      default: '150px',
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    align: {
      type: String,
      default: 'center',
    },
  },
  data() {
    return {
      isExpanded: false,
      inputValue: {
        label: '',
        value: '',
      },
    };
  },

  watch: {
    // 监听父组件传入的值
    value(val) {
      this.inputValue = this.options.find((option) => option.value === val);
      if (!this.inputValue) {
        this.inputValue = { label: '', value: '' };
      }
    },

    // 监听选中的值
    inputValue: {
      handler(newVal, oldVal) {
        if (newVal.label !== oldVal.label) {
          this.handleChange();
        }
      },
      deep: true,
    },
  },

  mounted() {
    this.$refs.container.style.width = this.width;
    this.inputValue = this.options.find((option) => option.value === this.value);
    if (!this.inputValue) {
      this.inputValue = { label: '', value: '' };
    }
  },

  methods: {
    /**
     * @method
     * @desc 向父组件传递事件，表示选择数值变化
     */
    handleChange() {
      this.$emit('change', this.inputValue.value);
    },
    /**
     * @method
     * @desc 点击选择器展开选项框，展开时添加一个全局点击事件监听，再次点击折叠选项框
     * @param {object} event 点击事件
     */
    expandOption(event) {
      this.isExpanded = !this.isExpanded;
      // 选项框展开后，鼠标再次点击时，折叠选项框
      const collapseOption = (event2) => {
        if (
          // 当选项框展开时
          this.isExpanded === true
          // 当不是第一次点击时
          && this.target !== event2.target
        ) {
          this.isExpanded = false;
          document.removeEventListener('click', this.collapseOption, false);
        }
      };
      this.collapseOption = collapseOption;
      this.target = event.target;
      // 全局添加点击事件监听，用于折叠选项框
      document.addEventListener('click', collapseOption, false);
    },
  },
};
</script>

<style lang="less">
.sv-select {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    border: 1px solid #DDDDDD;
    border-radius: 4px;
    color: #666666;
    font-size: 14px;
    position: relative;
    cursor: pointer;
    user-select: none;
    background: #ffffff;
    .sv-select__reference {
        position: relative;
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 0 10px;
        .sv-select__inner {
            border: none;
            height: 100%;
            flex: 1;
            outline: none;
            text-align: center;
            cursor: pointer;
            overflow: hidden;
            word-wrap: break-all;
            text-overflow: ellipsis;
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
        .sv-select__icon {
            margin: 0 0 0 5px;
            padding: 0;
            display: inline-block;
            width: 16px;
            height: 16px;
            background: no-repeat url('../img/select_arrow.svg') center/100% 100%;
            transition: transform 0.5s ease;
        }
        .sv-select__clear {
            width: 16px;
            height: 16px;
            background: no-repeat url('../img/clear.svg') center/100% 100%;
            cursor: pointer;
            transition: none;
            &:hover {
                background-image: url('../img/clear_hover.svg');
            }
        }
        .sv-select__option {
            width: calc(100% + 2px);
            max-height: 200px;
            overflow-y: auto;
            overflow-x: hidden;
            position: absolute;
            top: 30px;
            left: -1px;
            background: #ffffff;
            box-shadow: 0px 3px 11px 0px rgba(0, 0, 0, 0.1);
            border-radius: 0 0 6px 6px;
            transform: scaleY(0);
            transform-origin: center top;
            transition: all 0.5s ease;
            z-index: 2002;
            text-align: left;
            &::-webkit-scrollbar {
                background: transparent;
                width: 5px;
            }
            &::-webkit-scrollbar-thumb {
                background: #d5d5d5;
                border-radius: 5px;
            }
            .sv-select__option__item {
                width: 100%;
                padding: 5px 0 5px 5px;
                word-wrap: break-word;
                &:hover {
                    background: #F0F5FF;
                    color: #0091FF;
                }
                &.sv-select__option__item__inactive {
                    color: #B4B4B4;
                    cursor: auto;
                    &:hover {
                        background: #ffffff;
                    }
                }
            }
        }
    }
    &:hover {
        border-color: #b4b4b4;
    }
    &.sv-select-focus {
        border-color: #0091ff;
        .sv-select__icon {
            transform: rotate(-180deg);
        }
        .sv-select__option {
            transform: scaleY(1);
        }
    }
}
</style>
