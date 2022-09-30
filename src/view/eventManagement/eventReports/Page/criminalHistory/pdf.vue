<template>
  <div></div>
</template>
<script>
  // import pdf from 'vue-pdf'
  export default {
    name: "pdf",
    data() {
      return {
        look: '',
        Url: '',
        documentUrl: '',
      };
    },
    methods: {
      test(extension,Url, path) {
        console.log(extension, Url, path);
        this.look = extension;
        this.Url = Url;
        this.documentUrl = path;
        if(extension=='pdf'){
          window.open(
            Url + this.documentUrl
          )
        }else {
          window.location.href = Url + this.documentUrl;
        }
      },

    }
  }
</script>

<style scoped>
  .tipe {
    font-family: "Helvetica Neue",
    Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑",
    Arial, sans-serif;
    color: #E6A23C;
  }

  .el-form-itemContent >>> .el-form-item__content {
    line-height: 40px;
  }
</style>
