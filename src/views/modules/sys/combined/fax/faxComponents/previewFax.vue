<template>
  <div class="faxPreview">
    <el-image
      v-if="
        document.url.indexOf('png') > -1 ||
          document.url.indexOf('jpg') > -1 ||
          document.url.indexOf('jpeg') > -1
      "
      :src="document.url"
      alt=""
    ></el-image>
    <template v-else>
      <iframe
        :src="
          'https://view.officeapps.live.com/op/view.aspx?src=' + document.url
        "
        width="100%"
        height="750px"
        frameborder="1"
      ></iframe>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    document: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      baseUrl: window.SITE_CONFIG["cloudUrl"]
    };
  },
  created() {},
  mounted() {}
};
</script>

<style lang="less" scoped>
.faxPreview {
  width: 100%;
}
</style>
