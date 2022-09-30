<template>
  <textarea
    ref="container"
    v-model="inputValue"
    :class="[
      'sv-textarea',
      {
        'sv-textarea--scroll': scroll,
      },
    ]"
    :placeholder="placeholder"
    :rows="rows"
    :readonly="readonly"
    :maxlength="maxlength"
    @input="
      resize();
      $emit('change', inputValue);
    "
  />
</template>

<script>
export default {
  name: 'SvTextarea',

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
      default: '请输入关键字',
    },

    width: {
      type: String,
      default: '100%',
    },

    rows: {
      type: Number,
      default: 1,
    },

    readonly: {
      type: Boolean,
      default: false,
    },

    maxlength: {
      type: [Number, Boolean],
      default: false,
    },

    scroll: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      inputValue: '',
    };
  },

  watch: {
    value(val) {
      this.inputValue = val;
      this.resize();
    },
  },

  mounted() {
    this.inputValue = this.value;
    this.$refs.container.style.width = this.width;
    this.resize();
  },

  methods: {
    resize() {
      if (!this.scroll) {
        this.$nextTick(() => {
          this.$refs.container.style.height = 'auto';
          this.$refs.container.style.height = `${this.$refs.container.scrollHeight + 2}px`;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.sv-textarea {
  resize: none;
  font-size: 14px;
  width: 100%;
  overflow: hidden;
  line-height: 28px;
  border: 1px solid #DDDDDD;
  border-radius: 4px;
  outline: none;
  color: #666666;
  background: #ffffff;
  overflow: hidden;
  padding: 0 10px;

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

  &:hover {
    border-color: #b4b4b4;
  }

  &:focus {
    border-color: #0091ff;
  }

  &--scroll {
    overflow-y: auto;

    &::-webkit-scrollbar {
      background: transparent;
      width: 5px;
    }

    &::-webkit-scrollbar-thumb {
      background: #d5d5d5;
      border-radius: 5px;
    }
  }
}
</style>
