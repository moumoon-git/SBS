<template>
  <sv-dialog
    ref="dialog"
    :title="fileName || '文件预览'"
    @cancel="$refs.dialog.visible = false;"
    @modal="$refs.dialog.visible = false;"
  >
    <div class="sv-preview">
      <header
        v-if="!fullURL.match(/\.(pdf)$/i)"
        class="sv-preview__header"
      >
        <sv-button @click="handleDownload">
          下载
        </sv-button>
        <sv-button
          v-if="fullURL.match(/\.(png|jpe?g|svg|bmp|gif|webp|txt)$/i)"
          @click="handlePrint"
        >
          打印
        </sv-button>
      </header>
      <main
        ref="printedContent"
        class="sv-preview__main"
      >
        <iframe
          v-if="fullURL.match(/\.(doc|docx|xls|xlsx|ppt|pptx)$/i)"
          class="sv-preview__main__content"
          :src="`https://view.officeapps.live.com/op/view.aspx?src=${fullURL}`"
        />
        <img
          v-else-if="
            fullURL.match(/\.(a?png|avif|jpe?g|jfif|pjpeg|pjp|svg|bmp|gif|webp|ico|cur|tiff?)$/i)
          "
          :key="fullURL"
          class="sv-preview__main__content"
          :src="fullURL"
        >
        <iframe
          v-else-if="fullURL.match(/\.(pdf|txt)$/i)"
          :key="fullURL"
          class="sv-preview__main__content"
          :src="fullURL"
        />
        <video
          v-else-if="fullURL.match(/\.(mp4|mov|webm|ogg)$/i)"
          class="sv-preview__main__content"
          controls
          :src="fullURL"
        >
          抱歉，您的浏览器不支持视频预览
        </video>
        <div
          v-else
          class="sv-preview__main__content"
        >
          抱歉，该文件类型不支持预览
        </div>
      </main>
    </div>
    <template #footer>
      <footer />
    </template>
  </sv-dialog>
</template>

<script>
export default {
  name: 'SvPreview',
  data() {
    return {
      // 完整的文件地址
      fullURL: '',
      fileName: '文件预览',
    };
  },
  methods: {
    /**
     * @description 初始化预览弹窗
     * @param {String} url 文件地址
     * @param {String} name 文件名称
     */
    init({
      url,
      name,
    }) {
      this.fullURL = url.match(/^http/i) ? url : `${window.SITE_CONFIG.cloudUrl}/${url}`;
      this.fileName = name;
      this.$refs.dialog.visible = true;
    },
    handleDownload() {
      const a = window.document.createElement('a');
      a.href = this.fullURL;
      a.target = '_blank';
      a.download = this.fileName || true;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
    },
    /**
     * @description 打印功能
     */
    handlePrint() {
      const printedContent = this.$refs.printedContent.innerHTML;
      const newWindow = window.open();
      newWindow.document.write(printedContent);
      newWindow.document.close();
      newWindow.focus();
      newWindow.print();
      newWindow.close();
    },
  },
};
</script>

<style lang="scss">
.sv-preview {
  width: calc(100vw - 400px);
  max-height: 80vh;
  overflow-y: auto;
  &::-webkit-scrollbar {
    background: transparent;
    width: 5px;
    height: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d5d5d5;
    border-radius: 5px;
  }
  &__header {
    height: 40px;
    line-height: 40px;
    text-align: right;
    padding-right: 10px;
  }
  &__main {
    width: 100%;
    margin-bottom: 10px;
    &__content {
      width: 100%;
      border: 0;
      outline: 0;
      margin: 0;
      padding: 0;
      text-align: center;
    }
    iframe {
      height: calc(80vh - 60px);
    }
  }
}
</style>
