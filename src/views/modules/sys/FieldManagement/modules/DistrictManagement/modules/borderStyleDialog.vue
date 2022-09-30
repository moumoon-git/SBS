<template>
  <el-dialog
    :visible.sync="showDialog"
    title="设置边界样式"
    width="650px"
    :before-close="handleClose"
    :modal="false"
    top="23vh"
  >
    <el-form
      class="sv-form"
      label-position="right"
      label-width="200px"
      style="margin-top: 10px;"
    >
      <el-form-item
        label="填充颜色"
      >
        <el-color-picker
          v-model="fillColor"
          class="sv-color-picker"
          popper-class="sv-color-picker-popper"
        />
      </el-form-item>
      <el-form-item
        label="填充透明度"
      >
        <el-slider
          v-model="fillOpacity"
          class="sv-slider"
          style="width: 346px;"
          show-input
          :min="15"
        />
      </el-form-item>
      <el-form-item
        label="边线颜色"
      >
        <el-color-picker
          v-model="strokeColor"
          class="sv-color-picker"
          popper-class="sv-color-picker-popper"
        />
      </el-form-item>
      <el-form-item
        label="边线宽度"
      >
        <el-select
          v-model="lineHeight"
          class="sv-select"
          popper-class="sv-select__popper"
          style="width: 188px;"
        >
          <el-option
            label="0px"
            :value="0"
          />
          <el-option
            label="2px"
            :value="2"
          />
          <el-option
            label="4px"
            :value="4"
          />
          <el-option
            label="6px"
            :value="6"
          />
          <el-option
            label="8px"
            :value="8"
          />
          <el-option
            label="10px"
            :value="10"
          />
          <el-option
            label="12px"
            :value="12"
          />
          <el-option
            label="14px"
            :value="14"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="preview">
      <span>样式预览</span>
      <div :style="stylePreview.stroke">
        <div :style="stylePreview.background" />
      </div>
    </div>
    <footer class="footer">
      <el-button
        class="sv-button"
        type="primary"
        @click="handleSave"
      >
        保存
      </el-button>
      <el-button
        class="sv-button"
        @click="handleClose"
      >
        取消
      </el-button>
    </footer>
  </el-dialog>
</template>

<script >

export default {
  name: 'borderStyleDialog',
  props: {
    activeTabIndex: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      showDialog: false,
      lineHeight: 4,
      fillColor: '#F66E6E',
      strokeColor: '#0091FF',
      fillOpacity: 70,
      id: '',
    };
  },
  computed: {
    stylePreview() {
      return {
        background: {
          background: this.fillColor,
          opacity: this.fillOpacity / 100,
        },
        stroke: {
          border: `${this.lineHeight}px solid ${this.strokeColor}`,
        },
      };
    },
  },
  methods: {
    // 关闭弹窗
    handleClose() {
      this.showDialog = false;
    },
    // 保存
    handleSave() {
      console.log(this.fillOpacity, this.fillColor,this.strokeColor, this.lineHeight,)
      this.$emit('save', {
        fillOpacity: this.fillOpacity,
        fillColor: this.fillColor,
        strokeColor: this.strokeColor,
        lineHeight: this.lineHeight,
        id: this.id,
      });
      this.handleClose();
    },
    // 打开弹窗
    open(style) {
      this.id = style.id;
      this.fillOpacity = style.opacity * 100;
      this.strokeColor = style.strokeColor;
      this.fillColor = style.background;
      this.lineHeight = style.lineHeight;
      this.showDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped >
.sv-color-picker /deep/.el-color-picker__trigger{
    width: 188px;
    border: none;
    padding: 0;
    height: 30px;
    vertical-align: middle;
    .el-color-picker__icon{
      display: none;
    }
}
// 预览
.preview {
  margin: 50px 20px 10px;
  display: flex;
  align-items: center;
  & > div {
    margin-left: 20px;
    width: 150px;
    box-sizing: border-box;
    height: 40px;
    & > div {
      width: auto;
      height: 100%;
    }
  }
}

// 底部按钮
.footer {
  text-align: right;
  padding-right: 20px;
  height: 60px;
  line-height: 60px;
  border-top: 1px solid #E9ECF1;
}
</style>
