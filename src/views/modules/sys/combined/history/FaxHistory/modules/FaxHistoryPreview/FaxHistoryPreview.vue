<template>
  <div
    v-show="url"
    :class="$style.container"
  >
    <div :class="$style.main">
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
    </div>
    <!-- <div :class="$style.footer">
      <button
        :class="$style.download"
        @click="handleDownload"
      />
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'FaxHistoryPreview',
  props: {
    url: {
      type: String,
      default: '',
    },
  },
  computed: {
    fullURL() {
      if (this.url.startsWith('http')) {
        return this.url;
      }
      return `${window.SITE_CONFIG.cloudUrl}${this.url}`;
    },
  },
  methods: {
    /**
     * 下载文件
     */
    handleDownload() {
      const a = document.createElement('a');
      a.href = this.fullURL;
      a.target = '_blank';
      a.click();
    },
  },
};
</script>

<style lang="scss" module>
.container {
  height: 94%;
  display: flex;
  flex-direction: column;
  .main {
    display: flex;
    flex: 1;
    // margin: 10px 40px;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    & > * {
      width: 94%;
      border: none;
      outline: none;
    }
  }
  .footer {
    height: 40px;
    line-height: 40px;
    text-align: center;
    flex-shrink: 0;
    .download {
      width: 24px;
      height: 24px;
      border: none;
      outline: none;
      cursor: pointer;
      background: #9FC8FE;
      mask: no-repeat center/100% 100% url(./imgs/download.svg);
      &:hover {
        background: #0091FF;
      }
    }
  }
}
</style>
