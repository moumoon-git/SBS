// 通告详情
<template>
  <el-dialog
    title="通知公告详情"
    :visible.sync="dialogVisible"
    width="914px"
    :class="$style.message"
    :before-close="handleClose"
  >
    <div :class="$style.title">
      {{ title }}
    </div>
    <div :class="$style.time">
      {{ unit }} | {{ publishTime }}
    </div>
    <div
      :class="$style.content"
      v-html="content"
    />
    <div :class="$style.imgs">
      <viewer :images="pictureUrls">
        <img
          v-for="(item,index) in pictures"
          :key="index"
          :class="$style.img"
          :src="`${fileIp}${item.vcUrl}`"
          alt=""
        >
      </viewer>
    </div>
    <div :class="$style.files">
      <div
        v-for="(item,index) in files"
        :key="index"
        :class="$style.file"
      >
        <div :class="$style.name">
          {{ item.vcFilename }}（{{ item.isize }}k）
        </div>
        <a
          :class="$style.download"
          :href="`${fileIp}${item.vcUrl}`"
          :download="item.vcFilename"
        >
          下载
        </a>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      noticeId: 0,
      title: '', // 标题
      unit: '', // 单位
      publishTime: '', // 发布时间
      content: '', // 内容
      pictures: [], // 图片数组
      pictureUrls: [], // 图片地址数组
      files: [],
      fileIp: window.SITE_CONFIG.cloudUrl,
    };
  },
  mounted() {
    this.getNoticeContent();
  },
  methods: {
    // 关闭
    handleClose(done) {
      done();
    },
    // 获取详情
    getNoticeContent() {
      const data = {
        noticeId: this.noticeId,
        platFormId: this.$store.state.user.platformId
      };
      this.$api.getNoticeContent(data).then((res) => {
        this.title = res.data.title; // 标题
        this.unit = res.data.platformName;// 单位
        this.publishTime = res.data.publishTime; // 发布时间
        this.content = res.data.content; // 内容
        this.pictures = res.data.pictures || [];
        this.pictureUrls = [];
        this.pictures.forEach((item) => {
          this.pictureUrls.push(`${this.fileIp}${item.vcUrl}`);
        });
        this.files = res.data.files;
        this.$nextTick(() => {
          this.initImageTools();
        });
      });
    },
  },
};
</script>
  <style module lang="less">
.message {
    :global(.el-dialog__body) {
        height: 700px;
        overflow: auto;
        padding-top: 10px;
    }
    .time {
        font-size: 17px;
        font-weight: 400;
        color: #969799;
        line-height: 50px;
    }
    .title {
        font-size: 20px;
        font-weight: 500;
        color: #323233;
        text-align: center;
    }
    .content {
        font-weight: 500;
        color: #646566;
        line-height: 24px;
        font-size: 17px;
        letter-spacing: 3px;
        border-bottom: 1px solid #ebedf0;
        padding-bottom: 20px;
        border-top: 1px solid #ebedf0;
        padding-top: 14px;
    }
    .imgs {
        margin-top: 21px;
        margin-bottom: 14px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;

        .img {
            width: 210px;
            height: 127px;
            margin: 2px;
        }
    }
    .files {
        display: flex;
        .file {
            display: flex;
            font-weight: 400;
            .name {
                background: url(./assets/file.svg) no-repeat;
                padding-left: 17px;
                background-position: 0% 50%;
                color: #646566;
            }
            .download {
                color: #0091ff;
                margin-left: 28px;
                cursor: pointer;
            }
        }
    }
}
</style>
