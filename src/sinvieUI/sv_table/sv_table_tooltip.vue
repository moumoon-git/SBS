<template>
  <el-tooltip
    class="sv-table-tooltip"
    placement="top"
    :disabled="!isOverflow"
  >
    <div
      slot="content"
      class="sv-table-tooltip__hover"
    >
      {{ content }}
    </div>
    <div
      ref="container"
      class="sv-table-tooltip__content__container"
    >
      {{ content }}
    </div>
  </el-tooltip>
</template>

<script>
export default {
  name: 'SvTableTooltip',
  props: {
    content: {
      type: String,
      default: '',
    },
    maxHeight: {
      type: Number,
      default: 46,
    },
  },
  data() {
    return {
      isOverflow: false,
    };
  },
  watch: {
    content() {
      this.overHeight();
    },
  },
  mounted() {
    this.overHeight();
  },
  methods: {
    overHeight() {
      this.$nextTick(
        () => {
          const containerHeight = this.$refs.container.offsetHeight;
          this.isOverflow = containerHeight > this.maxHeight;
        },
      );
    },
  },
};
</script>

<style lang="less">
.sv-table-tooltip__hover {
    max-width: 300px;
    word-break: break-all;
    font-size: 14px;
}
.sv-table-tooltip__content__container {
    display: -webkit-box;
    /*! autoprefixer: off */
    -webkit-box-orient: vertical;
    /* autoprefixer: on */
    -webkit-line-clamp: 3;
    overflow: hidden;
}
</style>
