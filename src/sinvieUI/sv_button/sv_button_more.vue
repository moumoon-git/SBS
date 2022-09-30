<template>
  <div
    class="sv-button-more"
    :class="isFocus ? 'sv-button-more__focus' : 'sv-button-more__unfocus'"
  >
    <div
      @click="
        $emit('click');
        isFocus = !isFocus;
        showConfirm = false;
      "
    >
      <span>更多</span>
      <span class="sv-icon-triangle" />
    </div>
    <div
      v-if="
        exportSelect
          || exportQuery
          || importData
          || downloadTemplate
          || importData
          || exportQrcode
          || exportAll
      "
      class="sv-button-more__content"
    >
      <!-- <div
        v-if="exportSelect || exportQuery || exportQrcode"
        class="sv-button-more__content__item-header"
      >
        导出
      </div> -->
      <div
        v-if="exportSelect"
        :class="[
          'sv-button-more__content__item',
          { 'handling': exportingSelect },
        ]"
        @click="handleClick('exportSelect')"
      >
        选择表格数据导出
      </div>
      <div
        v-if="exportQuery"
        :class="[
          'sv-button-more__content__item',
          { 'handling': exportingQuery },
        ]"
        @click="handleClick('exportQuery')"
      >
        查询分组导出
      </div>
      <div
        v-if="exportAll"
        :class="[
          'sv-button-more__content__item',
          { 'handling': exportingAll },
        ]"
        @click="handleClick('exportAll')"
      >
        全部导出
      </div>
      <div
        v-if="exportQrcode"
        :class="[
          'sv-button-more__content__item',
          { 'handling': exportingQrcode },
        ]"
        @click="handleClick('exportQrcode')"
      >
        二维码导出
      </div>
      <div
        v-if="
          (exportSelect || exportQuery || exportQrcode || exportAll)
            && (importData || downloadTemplate || importData || deleteSelected)
        "
        class="sv-button-more__content__line"
      />
      <div
        v-if="importData"
        :class="[
          'sv-button-more__content__item',
          { 'handling': importingData },
        ]"
        @click="handleClick('importData')"
      >
        导入
      </div>
      <div
        v-if="downloadTemplate"
        :class="[
          'sv-button-more__content__item',
          { 'handling': downloadingTemplate },
        ]"
        @click="handleClick('downloadTemplate')"
      >
        下载模板
      </div>
      <div
        v-if="deleteSelected"
        :class="[
          'sv-button-more__content__item',
          { 'handling': deletingSelected },
        ]"
        @click="handleClick('deleteSelected')"
      >
        批量删除
      </div>
    </div>
    <div
      :class="[
        'sv-button-more__confirm',
        { 'sv-button-more__confirm__show': showConfirm }
      ]"
    >
      <p class="context">
        {{ confirmHint }}
      </p>
      <span
        class="button confirm"
        @click="handleConfirm"
      >确认</span>
      <span
        class="button cancel"
        @click="handleCancel"
      >取消</span>
    </div>
    <!-- 导入按钮 -->
    <input
      v-show="false"
      ref="upload"
      type="file"
      accept=".xls, .xlsx, application/msexcel"
      :multiple="false"
      @change="uploadFile()"
    >
  </div>
</template>

<script>
export default {
  name: 'SvButtonMore',

  props: {
    // 是否显示“全部导出”按钮
    exportSelect: {
      type: Boolean,
      default: true,
    },
    // 是否显示“全部导出”按钮
    exportAll: {
      type: Boolean,
      default: true,
    },
    // 是否显示“部分导出”按钮
    exportQuery: {
      type: Boolean,
      default: true,
    },
    // 是否显示“二维码导出”按钮
    exportQrcode: {
      type: Boolean,
      default: true,
    },
    // 是否显示“导入”按钮
    importData: {
      type: Boolean,
      default: true,
    },
    // 是否显示“下载模板”按钮
    downloadTemplate: {
      type: Boolean,
      default: true,
    },
    // 是否显示“批量删除”按钮
    deleteSelected: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      // 更多按钮是否展开
      isFocus: false,
      // 正在导出已选分组数据
      exportingSelect: false,
      // 正在导出所有查询数据
      exportingQuery: false,
      // 正在导出所有查询数据
      exportingAll: false,
      // 正在导出二维码
      exportingQrcode: false,
      // 正在导入数据
      importingData: false,
      // 正在下载模板
      downloadingTemplate: false,
      // 正在批量删除
      deletingSelected: false,
      // 确认弹窗是否显示
      showConfirm: false,
      // 当前点击的按钮
      currenButton: '',
    };
  },

  computed: {
    confirmHint() {
      let text = '';
      switch (this.currenButton) {
        case 'exportSelect': {
          text = '是否导出选中数据？';
          break;
        }
        case 'exportQuery': {
          text = '是否导出选中分组查询数据？';
          break;
        }
        case 'exportAll': {
          text = '是否导出所有数据？';
          break;
        }
        case 'exportQrcode': {
          text = '是否导出二维码？';
          break;
        }
        case 'importData': {
          text = '是否导入数据？';
          break;
        }
        case 'downloadTemplate': {
          text = '是否下载模板？';
          break;
        }
        case 'deleteSelected': {
          text = '是否删除选中表格数据？';
          break;
        }
        default:
      }
      return text;
    },
  },

  methods: {
    /**
     * @method
     * @desc 点击按钮，显示确认框
     * @param {String} buttonName 点击的按钮名称
     */
    handleClick(buttonName) {
      this.showConfirm = true;
      this.isFocus = false;
      this.currenButton = buttonName;
    },

    /**
     * @method
     * @desc 点击取消按钮，返回显示确认框
     */
    handleCancel() {
      this.isFocus = true;
      this.showConfirm = false;
    },

    /**
     * @method
     * @desc 点击确认按钮，向父组件传递事件，显示处理中图标
     */
    handleConfirm() {
      this.$emit('click');
      this.showConfirm = false;
      switch (this.currenButton) {
        case 'exportSelect': {
          this.$emit('export-select');
          this.exportingSelect = true;
          break;
        }
        case 'exportQuery': {
          this.$emit('export-query');
          this.exportingQuery = true;
          break;
        }
        case 'exportAll': {
          this.$emit('export-all');
          this.exportingAll = true;
          break;
        }
        case 'exportQrcode': {
          this.$emit('export-qrcode');
          this.exportingQrcode = true;
          break;
        }
        case 'importData': {
          this.$refs.upload.click();
          break;
        }
        case 'downloadTemplate': {
          this.$emit('download-template');
          this.downloadingTemplate = true;
          break;
        }
        case 'deleteSelected': {
          this.$emit('delete-selected');
          this.deletingSelected = true;
          break;
        }
        default:
      }
    },

    /**
     * @method
     * @desc 上传文件
     * @emit {Object} formData 文件数据表单
     */
    uploadFile() {
      this.importingData = true;
      const fileList = this.$refs.upload.files;
      const formData = new FormData();
      for (let i = 0; i < fileList.length; i += 1) {
        const data = fileList[i];
        formData.append('file', data);
      }
      this.$emit('import-data', formData);
      // 清空上传的文件
      this.$refs.upload.value = '';
    },
    /**
     * 直接调用上传文件
     */
    reUpload() {
      this.$refs.upload.click();
    },
  },
};
</script>

<style lang="scss">
@keyframes rotate {
  from {transform: rotate(0)}
  to {transform: rotate(360deg)}
}

.sv-button-more {
  display: inline-block;
  position: relative;
  width: 60px;
  height: 30px;
  line-height: 30px;
  border: 1px solid #dddee1;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
  color: #666666;
  user-select: none;
  cursor: pointer;
  background: #ffffff;
  flex-shrink: 0;

  .sv-button-more__content {
    position: absolute;
    top: 30px;
    right: -1px;
    width: 160px;
    z-index: 2002;
    transform: scaleY(0);
    transform-origin: center top;
    transition: transform 0.5s;
    background: #ffffff;
    box-shadow: 0px 3px 11px 0px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    padding: 5px 0;

    .sv-button-more__content__item-header {
      color: #474545;
      text-align: left;
      padding: 21px 0 15px 20px;
      line-height: 14px;
      cursor: auto;
    }

    .sv-button-more__content__item {
      text-align: left;
      padding: 13px 10px 15px 20px;
      line-height: 14px;
      position: relative;

      &:hover {
        background: rgba(0, 145, 255, 0.1);
      }

      &.handling::after {
        content: '';
        display: block;
        width: 14px;
        height: 14px;
        position: absolute;
        right: 10px;
        top: calc(50% - 8px);
        background: no-repeat url('../img/loading.svg') center/100% 100%;
        animation: 2s rotate infinite linear;
      }
    }

    .sv-button-more__content__line {
      border-bottom: 1px solid #e6e6e6;
      width: 142px;
      height: 4px;
      margin: 0 auto;
      margin-bottom: 5px;
      cursor: auto;
    }
  }

  .sv-button-more__confirm {
    width: 300px;
    height: 150px;
    position: absolute;
    top: 30px;
    right: -1px;
    background: #ffffff;
    box-shadow: 0px 3px 11px 0px rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    z-index: 2002;
    transform: scaleY(0);
    transform-origin: center top;
    transition: transform 0.5s;
    overflow: hidden;
    cursor: auto;

    &.sv-button-more__confirm__show {
      transform: scaleY(1);
    }

    .context {
      font-size: 16px;
      color: #666666;
      margin: 0;
      margin-bottom: 10px;

      &::before {
        content: '提示';
        display: block;
        height: 40px;
        line-height: 40px;
        background: #F1F4F6;
        padding-left: 10px;
        text-align: left;
        font-size: 14px;
        color: #666666;
        margin-bottom: 30px;
      }
    }

    .button {
      cursor: pointer;
      user-select: none;
      float: right;

      &.cancel {
        margin-right: 10px;
        color: #999999;

        &:hover {
          color: #DDDDDD;
        }

        &:active {
          color: #666666;
        }
      }

      &.confirm {
        margin-right: 15px;
        color: #0091FF;

        &:hover {
          color: #5eadff;
        }

        &:active {
          color: #0083e6;
        }
      }
    }
  }

  .sv-icon-triangle {
    position: relative;
    bottom: 3px;
    display: inline-block;
    width: 1px;
    height: 1px;
    border: 4px solid #b4b4b4;
    border-top-color: transparent;
    border-left-color: transparent;
    transform: rotate(45deg);
    transition: all 0.5s ease;
  }

  &.sv-button-more__unfocus:hover {
    border-color: #b4b4b4;
  }

  &.sv-button-more__focus {
    border-color: #0091ff;

    .sv-icon-triangle {
      bottom: -1px;
      transform: rotate(-135deg);
    }

    .sv-button-more__content {
      transform: scaleY(1);
    }
  }
}
</style>
