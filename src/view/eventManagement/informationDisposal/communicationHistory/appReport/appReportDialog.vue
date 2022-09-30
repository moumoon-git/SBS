<template>
  <el-dialog
    :title="reportDataDetail.title"
    :visible.sync="showDetailDialog"
    class="report_data_detail"
  >
    <div
      v-if="showDetailDialog"
      class="report__item__content"
    >
      <div v-if="reportDataDetail.contactor">
        <div
          v-if="reportDataDetail.contactor.workUnit && reportDataDetail.contactor.position"
          class="report__item repot__people"
        >
          <div class="report_label">
            上报人：
          </div>
          {{ reportDataDetail.contactor.name }}
          ({{ reportDataDetail.contactor.workUnit }}
          / {{ reportDataDetail.contactor.position }})
          <img
            src="/static/img/Communihistory/cell.png"
            style="margin-left: 10px"
            @click.stop="callOut(reportDataDetail.contactor)"
          >
        </div>
        <div
          v-else
          class="report__item repot__people"
        >
          <div class="report_label">
            上报人：
          </div>
          {{ reportDataDetail.contactor.name }}
          ({{ reportDataDetail.contactor.workUnit }}
          {{ reportDataDetail.contactor.position }})
          <img
            src="/static/img/Communihistory/cell.png"
            style="margin-left: 10px"
            @click.stop="callOut(reportDataDetail.contactor)"
          >
        </div>
      </div>
      <div
        v-else
        class="report__item"
      >
        <div class="report_label">
          上报人：
        </div>
      </div>
      <div class="report__item">
        <div class="report_label">
          上报时间：
        </div>
        {{ reportDataDetail.reportTime }}
      </div>
      <div class="report__item">
        <div class="report_label">
          事件标题：
        </div>
        {{ reportDataDetail.title }}
      </div>
      <div class="report__item">
        <div class="report_label">
          事件类型：
        </div>
        {{ reportDataDetail.caseClassName }}
      </div>
      <div class="report__item">
        <div class="report_label">
          事发地点：
        </div>
        <div class="report_description">
          {{ reportDataDetail.address }}
        </div>
      </div>
      <div class="report__item">
        <div class="report_label">
          事件描述：
        </div>
        <div class="report_description">
          {{ reportDataDetail.content }}
        </div>
      </div>
      <div class="report__item">
        <div class="report_label">
          语音上报：
        </div>
        <div
          class="report__dialog__audio"
        >
          <div :id="`dialog_content_audio${reportDataDetail.id}`">
            <audio
              style="display: none"
              controls
              :src="reportDataDetail.appAttachments | audioFilters"
            />
          </div>
        </div>
      </div>
      <div class="report__item">
        <div class="report_label">
          现场情况：
        </div>
        <div class="content__image">
          <viewer :images="[reportDataDetail.appAttachments]">
            <div
              v-for="file in reportDataDetail.appAttachments.filter((ele) => { return ele.dictionaryType && ele.dictionaryType.code !== 'audio'})"
              :key="file.url"
              class="item__image"
            >
              <img
                v-if="file.dictionaryType && file.dictionaryType.code === 'image'"
                :src="$window.SITE_CONFIG.cloudUrl + file.url"
                :title="file.title"
                :alt="file.title"
              >
              <video
                v-else-if="file.dictionaryType && file.dictionaryType.code === 'video'"
                controls
                :src="$window.SITE_CONFIG.cloudUrl + file.url"
              />
              <a
                v-else-if="file.dictionaryType"
                :download="file.title"
                target="_blank"
                :href="$window.SITE_CONFIG.cloudUrl + file.url"
              >{{ file.title }}</a>
            </div>
          </viewer>
        </div>
      </div>
      <div class="report__item">
        <div class="report_label">
          续报：
        </div>
        <div class="renewall__item">
          <div
            v-for="(item,ind) in reportDataDetail.reportSupplements"
            :key="ind"
            class="renewall__detail"
          >
            <div>
              <div>{{ item.reportTime }}</div>
              <div>{{ item.content }}</div>
              <viewer :images="[item.appAttachments]">
                <div class="content__image">
                  <div
                    v-for="file in item.appAttachments"
                    :key="file.url"
                    class="item__image"
                  >
                    <img
                      v-if="file.dictionaryType && file.dictionaryType.code === 'image'"
                      :src="$window.SITE_CONFIG.cloudUrl + file.url"
                      :title="file.title"
                      :alt="file.title"
                    >
                    <video
                      v-else-if="file.dictionaryType && file.dictionaryType.code === 'video'"
                      controls
                      :src="$window.SITE_CONFIG.cloudUrl + file.url"
                    />
                    <a
                      v-else-if="file.dictionaryType && file.dictionaryType.code !== 'audio'"
                      :download="file.title"
                      target="_blank"
                      :href="$window.SITE_CONFIG.cloudUrl + file.url"
                    >{{ file.title }}</a>
                  </div>
                </div>
              </viewer>
              <div class="report__content__location">
                <img src="/static/img/buttonIcon/location.png">
                {{ item.address }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import mixin2 from '@/view/yangZhouEventReports/assets/js/mixin/mixin.js';
import mixin from '../../../../integratedCommunication/icpPhone/icpPhonePage/mixin';
import AudioControls from '../../../../../../static/audioControls/audioPlugin.js';
// 设置图片路径 用require()转换成base64
const play = require('../../../../../../static/audioControls/play.png');
const stop = require('../../../../../../static/audioControls/stop.png');

export default {
  name: 'AppReportDialog',
  filters: {
    audioFilters(appAttachments) {
      let isUrl = '';
      appAttachments.filter((items) => {
        if (items.dictionaryType && items.dictionaryType.code !== 'audio') {
          return;
        }
        if (items.dictionaryType && items.dictionaryType.code === 'audio') {
          isUrl = window.SITE_CONFIG.cloudUrl + items.url;
        }
      });
      return isUrl;
    },
  },
  mixins: [mixin, mixin2],
  data() {
    return {
      showDetailDialog: false,
      reportDataDetail: [],
      fileUrl: window.g.FileUrl, // 文件服务器地址
    };
  },
  methods: {
    showDetail(ids) {
      this.showDetailDialog = true;
      this.$http({
        url: `${window.SITE_CONFIG.event}/event/info/getDetail`,
        method: 'post',
        data: this.$http.adornData({
          id: ids,
        }),
      }).then((res) => {
        this.reportDataDetail = res.data.data;
        // 测试语音数据
        // this.reportDataDetail.appAttachments.filter((item) => {
        //   console.log(item)
        //   if (item.id === 33051) {
        //     item.dictionaryType.code = 'audio';
        //     item.url = 'https://gu-sycdn.kuwo.cn/a2cf6026294437c2cb6ca924dd089915/61275e5d/resource/n2/80/47/1685411067.mp3';
        //   }
        // });
        setTimeout(() => {
          this.getAudio(this.reportDataDetail);
        }, 100);
      });
    },
    getAudio(item) {
      const getAllAudio = document.querySelectorAll(`#dialog_content_audio${item.id} audio`);
      const obj = {
        play,
        stop,
      };
      Array.from(getAllAudio).forEach((ele, index) => {
        console.log(ele);
        const audio = new AudioControls(
          ele.parentNode,
          ele.src,
          obj,
          true,
          item,
        );
        audio.addIncident(true); // 隐藏下载、裁剪图标
      });
    },
    callOut(item) {
      this.makePhoneCall(item.mobile1 || item.mobile2, item.id, item.name, null);
    },
  },
};
</script>
<style lang="less" scoped>
  .report_data_detail {
    /deep/ .el-dialog {
      width: 675px;
      height: 843px;
      background: #FFFFFF;
      box-shadow: 0px 0px 21px 3px rgba(0,0,0,0.27);
      border-radius: 7px;
      border: 18px 28px;
      .el-dialog__header {
        height: 56px;
        background: #F1F4F6;
        border-radius: 7px 7px 0px 0px;
      }
      .el-dialog__body {
        padding: 0;
        height: 750px;
        overflow: auto;
      }
    }
  }
  .report__item__content{
    .repot__people {
      align-items: center;
    }
    .report__item {
      margin: 5px;
      font-size: 14px;
      display: flex;
      font-weight: 400;
      color: #333333;
      line-height: 45px;
      img {
        width: 18px;
        height: 19px;
        // margin: 0 5px;
        cursor: pointer;
      }
      .report_label {
        width: 100px;
        text-align: right;
      }
      .report__content__location {
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        margin-top: 5px;
        img {
          width: 13px;
          height: 15px;
        }
      }
      .renewall__item {
        display: flex;
        flex-direction: column;
        line-height: 28px;
        .renewall__detail {
          margin: 9px 0;
        }
      }
      .content__image {
        width: 550px;
        margin-top: 10px;
        .item__image {
          width: 169px;
          height: 94px;
          display: inline-block;
          overflow: hidden;
          margin-top: 2px;
          margin-right: 7px;
          img,
          video {
            width: 100%;
            height: 100%;
          }
          a {
            margin: 10px;
            word-break: break-all;
          }
        }
      }
      .report_description {
        width: 550px;
      }
      /deep/ .report__dialog__audio {
        display: flex;
        width: 550px;
        .playImg {
          margin-right: 10px;
        }
        .schedule {
          width: 357px;
          display: flex;
          align-items: center;
          position: relative;
          input {
            width: 357px;
          }
        }
        .timeDis {
          width: 80px;
          margin-left: 14px;
        }
        width: 490px;
      }
    }
  }
</style>
