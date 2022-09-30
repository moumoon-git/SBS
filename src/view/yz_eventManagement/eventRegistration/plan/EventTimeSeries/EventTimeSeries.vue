<!--事件时序信息管理-->
<template>
  <div class="event-time-series">
    <ul class="event-information-list">
      <li v-for="(item, index) in dataList" :key="index" class="event-information-item">
        <!-- 用来隐藏左边多余的时间线 -->
        <div v-if="index === 0" class="hide-line__top" />
        <div v-if="index === dataList.length - 1" class="hide-line__bottom" />

        <!-- 三角形 -->
        <div class="triggle"></div>
        <img
          v-if="item.type === 'fax'"
          src="./assets/fax.svg"
          alt=""
          class="type-image"
        />
        <img
          v-if="item.type === 'sms'"
          src="./assets/sms.svg"
          alt=""
          class="type-image"
        />
        <img
          v-if="item.type === 'phone'"
          src="./assets/phone.svg"
          alt=""
          class="type-image"
        />

        <!-- 头部 -->
        <div class="event-information-item__row flex-style1">
          <div class="event-information-item__row__left">
            {{ item.time }}
          </div>
          <div class="event-information-item__row__right">
            <el-button type="text" @click="cardDetail(item)">详情</el-button>
            <button class="button" @click="deleteEvents(item, index)">
              <i class="el-icon-close" />
            </button>
          </div>
        </div>

        <!-- 电话 -->
        <template v-if="item.type === 'phone'">
          <div class="event-information-item__row">
            <div class="event-information-item__row__left">
              {{ '联系人：' + (item.contact ? (item.contact || item.contact.name) : item.mobile) }}
            </div>
          </div>

          <div class="event-information-item__row">
            <div class="event-information-item__row__left">
              {{ '通话时长：' + item.conversationTime }}
            </div>
          </div>

          <div class="event-information-item__row">
            <div class="event-information-item__row__left">
              {{ '备注信息：' + (item.remark ? item.remark : '') }}
            </div>
          </div>

          <div class="event-information-item__row">
            <div class="event-information-item__row__left flex-style2">
              <span>电话录音：</span>
              <div :id="'content_del' + index" style="position: relative">
                <audio style="display: none" controls :src="item.url" />
              </div>
            </div>
          </div>
        </template>

        <!-- 短信 -->
        <template v-if="item.type === 'sms'">
          <div class="event-information-item__row">
            <div class="event-information-item__row__left">
              {{ '收信人：' + item.nameList }}
            </div>
          </div>

          <div class="event-information-item__row">
            <div class="event-information-item__row__left">
              {{ '短信内容：' + (item.content ? item.content : '') }}
            </div>
          </div>
        </template>

        <!-- 传真 -->
        <template v-if="item.type === 'fax'">
          <div class="event-information-item__row">
            <div class="event-information-item__row__left">
              {{ '收件人：' + item.nameList }}
            </div>
          </div>

          <div class="event-information-item__row">
            <div
              class="event-information-item__row__left"
              @click="itemClick(item)"
            >
              传真文件：
              <span class="blue">{{ item.name }}</span>
            </div>
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import AudioControls from '@/../static/audioControls/audioPlugin';

export default {
  name: 'EventTimeSeries',
  data() {
    return {
      dataList: [],
    };
  },
  methods: {
    cardDetail(item) {
      this.$emit('seeDetail', item);
    },
    deleteEvents(item) {
      this.$emit('delete', item);
    },
    itemClick(item) {
      this.$emit('clickItem', item);
    },
    /**
     * @description 数据格式化
     */
    formatterData(data) {
      this.dataList = data;
      setTimeout(() => {
        this.dataList.forEach((item, index) => {
          if (item.nameList && item.nameList.length > 0) {
            item.nameList = item.nameList.join(',');
          }
          if (item.type === 'phone') {
            this.setAudioAttribute(`#content_del${index} audio`, item.url);
          }
          console.log(item.nameList);
        });
      }, 100);
    },
    /**
     * @description 设置语音的属性
     */
    setAudioAttribute(selector, url) {
      const audioDom = document.querySelectorAll(selector)[0];
      audioDom.setAttribute('src', `${window.SITE_CONFIG.cloudUrl}${url}`);
      const _that = this;
      // 设置图片路径 用require()转换成base64
      const play = require('../../../../../../static/audioControls/play.png');
      const stop = require('../../../../../../static/audioControls/stop.png');
      const TurnTheText = require('../../../../../../static/audioControls/TurnTheText.png');
      const tailor = require('../../../../../../static/audioControls/tailor.png');
      const dow = require('../../../../../../static/audioControls/dow.png');
      const obj = {
        play,
        stop,
        TurnTheText,
        tailor,
        dow,
      };
      const type = 'yangZhouEventRegistration';
      const audio = new AudioControls(
        audioDom.parentNode,
        audioDom.src,
        obj,
        false,
        _that.TurnTheText,
        _that.tailor,
        this.RowData,
        // _that,
        type,
      );
      //   _that.audioEventList[index] = audio;
      audio.addIncident('这个用来判断是否显示下载控件');
    },
  },
};
</script>

<style lang="scss">
@import './assets/css/EventTimeSeries.scss';
</style>
