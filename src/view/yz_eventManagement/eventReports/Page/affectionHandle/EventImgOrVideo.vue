<template>
  <div style="height:50%;position: relative;">
    <div class="eventImgOrVideo">
      <div class="eventType">
        <template v-if="imgOrVideoData.length > 0">
          <div v-for="item in imgOrVideoData" :key="item.id" class="allImg">
            <div class="hover">
              <img
                v-if="resourcesType == '图片'"
                :src="fileUrl + item"
                :onerror="baseUrl + item"
                alt
                class="oneImgOrVideo"
              />
              <video
                v-if="resourcesType == '视频'"
                :src="fileUrl + item"
                :onerror="baseUrl + item"
                controls
                class="oneImgOrVideo"
              ></video>
              <div class="hoverStyle" @click="preview(item)">
                <div class="preview"></div>
              </div>
            </div>
            <i class="iconfont icon-guanbi close" @click="delImg(item)"></i>
          </div>
        </template>
        <div v-else class="noImg">
          <i class="iconfont icon-Smile icon"></i>暂无{{
            resourcesType
          }}，请添加
        </div>
      </div>
    </div>
    <div class="addImg" @click="showPicture"></div>
  </div>
</template>

<script>
export default {
  props: {
    imgOrVideoData: {
      type: Array,
    },
    resourcesType: {
      type: String,
    },
  },
  data() {
    return {
      baseUrl: window.g.ApiUrl,
      fileUrl: window.g.FileUrl,
    };
  },
  methods: {
    preview(item) {
      this.$emit("preview", item, this.resourcesType);
    },
    delImg(item) {
      this.$emit("delImg", this.resourcesType, item);
    },
    showPicture() {
      this.$emit("showPicture", this.resourcesType);
    },
  },
};
</script>

<style lang="scss" scoped>
.eventImgOrVideo {
  height: 100%;
  border-bottom: 1px solid #ddd;
  border-left: none;
  overflow: scroll;
  padding: 10px 25px;
  box-sizing: border-box;
}
.eventImgOrVideo .eventType {
  height: 100%;
  position: relative;
}
.eventImgOrVideo .noImg {
  font-size: 13px;
  color: #666;
  position: absolute;
  /* 总高度减去自身高度的一半 */
  top: calc((100% - 18.98px) / 2);
}
.eventImgOrVideo .allImg {
  padding: 15px 10px 0 0;
  position: relative;
}
.eventImgOrVideo .allImg .hover {
  position: relative;
}
.eventImgOrVideo .allImg .hover:hover .hoverStyle {
  display: block;
  background-color: rgba(5, 5, 5, 0.32);
}
.eventImgOrVideo .allImg .hover .oneImgOrVideo {
  width: 100%;
  height: 85px;
}
.eventImgOrVideo .allImg .close {
  color: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  position: absolute;
  top: 7px;
  right: 3px;
}
/* 鼠标悬停样式 */
.eventImgOrVideo .allImg .hoverStyle {
  display: none;
  position: absolute;
  width: 100%;
  height: 85px;
  line-height: 85px;
  top: 0;
  cursor: pointer;
}
.preview {
  width: 30px;
  height: 21.5px;
  background: url("../../../../../../static/img/preview.png");
  background-size: 100% 100%;
  position: absolute;
  left: calc(50% - 15px);
  top: calc(50% - 10.75px);
}
.eventImgOrVideo .noImg .icon {
  vertical-align: middle;
  margin-right: 3px;
}
.addImg {
  width: 25px;
  height: 25px;
  background: url("../../../../../../static/img/ConvergedCommunication/add.png");
  background-size: 100% 100%;
  position: absolute;
  right: 0;
  bottom: 0;
  cursor: pointer;
}
</style>