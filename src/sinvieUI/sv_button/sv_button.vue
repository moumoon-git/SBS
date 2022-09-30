<template>
  <div
    ref="container"
    :class="[
      'sv-button',
      {
        'sv-button-primary': type === 'primary',
        'sv-button-secondary': type === 'secondary',
        'sv-button-text': type === 'text',
      },
    ]"
    @click.stop="$emit('click')"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SvButton',

  props: {
    type: {
      type: String,
      default: '',
    },

    width: {
      type: String,
      default: 'auto',
    },
  },

  mounted() {
    this.$refs.container.style.width = this.width;
  },
};
</script>

<style lang="scss">
.sv-button {
  border: 1px solid #dddddd;
  border-radius: 4px;
  background: #ffffff;
  color: #999999 !important;
  display: inline-block;
  height: 30px;
  line-height: 28px;
  font-size: 14px;
  padding: 0 5px;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
  text-align: center;

  &:hover {
    border-color: #0091ff;
    color: #0091ff !important;
  }

  &:active {
    border-color: #2476e0;
    color: #2476e0;
  }
}
.sv-button-primary {
  border: none;
  background: #0091ff;
  color: #ffffff !important;
  line-height: 30px;
  font-size: 14px;

  &:hover {
    background: #5eadff;
    color: #ffffff !important;
  }

  &:active {
    background: #2476e0;
    color: #ffffff !important;
  }
}

.sv-button-secondary {
  border: 1px solid #c5defe;
  background: #e9f7ff;
  color: #0091ff !important;
  font-size: 14px;

  &:hover,
  &:active {
    border: 1px solid #0091ff;
  }
}

.sv-button-text {
  color: #0091ff !important;
  font-size: 14px;

  &:hover,
  &:active {
    filter: brightness(1.1);
  }
}

</style>
