<template>
  <div class="appReportIndex">
    <div class="appReport__top">
      <div class="report__search">
        <el-cascader
          ref="incidenType"
          v-model.trim="incidenType"
          :options="eventTypeData"
          :props="props"
          clearable
          :show-all-levels="false"
          placeholder="事件类型"
          @change="incidenTypeChange(incidenType)"
        />
        <el-select
          v-model="appStatus"
          placeholder="处置状态"
          clearable
        >
          <el-option
            v-for="item in appStatusOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <div class="report__search__input">
          <el-input
            v-model="reportSearch"
            placeholder="请输入事件名称关键字"
            class="input-with-select"
            style="width:100%;"
            clearable
            @keyup.enter.native="getReportSearch"
          >
            <el-button
              slot="append"
              class="search_btn"
              icon="el-icon-search"
              @click="getReportSearch"
            />
          </el-input>
        </div>
      </div>
      <div class="report__total">
        事件总数：{{ total }}
      </div>
    </div>
    <el-scrollbar
      ref="appReportScroll"
      style="height: 725px"
    >
      <div
        v-infinite-scroll="scrollEvent"
        class="appReport__content"
      >
        <template v-if="reportData">
          <div
            v-for="item in reportData"
            :key="item.id"
            class="app_report_box"
            @click="showReportDetail(item)"
          >
            <el-card>
              <div class="report__title">
                <div class="report__title__left">
                  <div class="report__title__left__item">
                    <el-select
                      v-model="item.processStatus"
                      placeholder="处置状态"
                      clearable
                      size="small"
                      @change="itemStatusChange(item, item.processStatus)"
                    >
                      <el-option
                        v-for="item in itemStatusOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                    <div class="title">
                      {{ item.title }}
                    </div>
                  </div>
                  <div class="time">
                    {{ item.reportTime }}
                  </div>
                </div>
                <div class="report__title__right">
                  {{ item.caseClassName }}
                </div>
              </div>
              <div class="report__content">
                <div class="report__detail">
                  <div
                    :class="item.appAttachments.length === 0
                      || (item.appAttachments.length === 1 && item.appAttachments[0].dictionaryType.code === 'audio')
                      ? 'report__content__detail__fill'
                      : 'report__content__detail'"
                  >
                    {{ item.content }}
                  </div>
                  <div
                    class="report__content__img"
                  >
                  <!-- 过滤录音文件的数据 -->
                    <div
                      v-for="(file, ind) in item.appAttachments.filter((ele) => { return ele.dictionaryType && ele.dictionaryType.code !== 'audio'})"
                      :key="file.url+'_'+ind"
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
                  </div>
                </div>
                <div
                  class="report__content__audio"
                  @click.stop="getAudio()"
                >
                  <div :id="`app_content_audio${item.id}`">
                    <audio
                      style="display: none"
                      controls
                      :src="item.appAttachments | audioFilters"
                    />
                  </div>
                </div>
                <div class="report__content__people">
                  <div v-if="item.contactor">
                    <!-- 职位、单位都存在时需要用 / 分开 -->
                    <div v-if="item.contactor.workUnit && item.contactor.position">
                      上报人：
                      {{ item.contactor.name }}
                      ({{ item.contactor.workUnit }}/
                      {{ item.contactor.position }})
                      <img
                        src="/static/img/Communihistory/cell.png"
                        @click.stop="callOut(item.contactor)"
                      >
                    </div>
                    <div v-else>
                      上报人：
                      {{ item.contactor.name }}
                      ({{ item.contactor.workUnit }}
                      {{ item.contactor.position }})
                      <img
                        src="/static/img/Communihistory/cell.png"
                        @click.stop="callOut(item.contactor)"
                      >
                    </div>
                  </div>
                  <div v-else>
                    上报人：
                  </div>
                </div>
                <div class="report__content__location">
                  <div>
                    <img src="/static/img/buttonIcon/location.png">
                    {{ item.address }}
                  </div>
                  <sv-button
                    style="float: right;"
                    type="primary"
                    @click="$emit('edit', item)"
                  >
                    事件登记
                  </sv-button>
                </div>
              </div>
            </el-card>
          </div>
        </template>
      </div>
    </el-scrollbar>
    <app-report-dialog
      ref="appReportDialog"
    />
  </div>
</template>
<script>
import mixin2 from '@/view/yangZhouEventReports/assets/js/mixin/mixin.js';
import appReportDialog from './appReport/appReportDialog.vue';
import mixin from '../../../integratedCommunication/icpPhone/icpPhonePage/mixin';
import AudioControls from '../../../../../static/audioControls/audioPlugin.js';
// 设置图片路径 用require()转换成base64
const play = require('../../../../../static/audioControls/play.png');
const stop = require('../../../../../static/audioControls/stop.png');

export default {
  name: 'AppReportIndex',
  components: {
    appReportDialog,
  },
  filters: {
    audioFilters(appAttachments) {
      let isUrl = '';
      console.log(appAttachments);
      appAttachments.filter((items) => {
        if (items.dictionaryType && items.dictionaryType.code !== 'audio') {
          return;
        }
        if (items.dictionaryType && items.dictionaryType.code === 'audio') {
          isUrl = window.SITE_CONFIG.cloudUrl + items.url;
          console.log('audio!!!', items.url, isUrl);
        }
      });
      return isUrl;
    },
  },
  mixins: [mixin, mixin2],
  data() {
    return {
      reportData: [],
      props: {
        value: 'id',
        label: 'name',
        checkStrictly: true,
      },
      appStatus: '', // 处置状态
      itemStatus: '', // 当个事件处置状态
      incidenType: '', // 已选事件类型
      eventTypeData: [], // 事件类型数据
      selectType: [], // 选择的事件类型
      reportSearch: '', // 搜索
      total: 0, // 事件总数
      totalPages: 1, // 事件总页数
      page: 1, // 当前页数
      fileUrl: window.g.FileUrl, // 文件服务器地址
      appStatusOptions: [], // app上报状态
      itemStatusOptions: [], // 单个事件上报状态
    };
  },
  mounted() {
    // this.getReportData('normal'); // 获取APP上报数据
    // this.incidentType(); // 获取事件类型
    // this.getStateListData(); // 获取处置状态
    this.$refs.appReportScroll.wrap.addEventListener('scroll', this.scrollEvent); // 滑动底部自动加载
  },
  methods: {
    // 获取APP上报数据
    getReportData(type) {
      // 初次加载、搜索时清空数据
      if (type === 'search' || type === 'normal') {
        this.reportData = [];
        this.page = 1;
      }
      this.$http({
        url: `${window.SITE_CONFIG.event}/event/info/getEventInfoReportList`,
        method: 'post',
        data: this.$http.adornData({
          page: this.page, // 页数
          size: 6, // 每页数量
          keyWord: this.reportSearch, // 搜索关键字
          caseClassId: this.selectType[0] ? this.selectType[0].id : '', // 事件类型id
          status: this.appStatus, // 处置状态id
        }),
      }).then((res) => {
        if (res.data.code === 0) {
          const contentItem = res.data.data.data;
          contentItem.forEach((element) => {
            console.log('eleAtt', element.appAttachments);
            this.reportData.push(element);
            setTimeout(() => {
              this.getAudio(element);
            }, 200);
          });
          this.total = res.data.data.totalElements; // 总上报事件数量
          this.totalPages = res.data.data.totalPages; // 总页数
        }
      });
    },
    getAudio(item) {
      console.log(item);
      if (!item) {
        return;
      }
      const getAllAudio = document.querySelectorAll(`#app_content_audio${item.id} audio`);
      const obj = {
        play,
        stop,
      };
      Array.from(getAllAudio).forEach((ele, index) => {
        const audio = new AudioControls(
          ele.parentNode,
          ele.src,
          obj,
          true,
        );
        audio.addIncident(true); // 隐藏下载、裁剪图标
      });
    },
    // APP上报详细弹窗
    showReportDetail(item) {
      this.$refs.appReportDialog.showDetail(item.id);
    },
    // 搜索方法
    getReportSearch() {
      this.getReportData('search');
    },
    // 获取事件类型
    incidentType() {
      const data = {};
      this.$api.getTree(data).then((res) => {
        if (res.errorcode === 0) {
          this.eventTypeData = res.data;
          const gettree = function (treeData) {
            for (let i = 0; i < treeData.length; i += 1) {
              if (treeData[i].children.length === 0) {
                treeData[i].children = undefined;
              } else {
                gettree(treeData[i].children);
              }
            }
          };
          gettree(this.eventTypeData);
        }
      });
    },
    // 选择事件类型
    incidenTypeChange(arr) {
      this.selectType = [];
      const gettree = (data) => {
        for (let i = 0; i < data.length; i += 1) {
          if (data[i].id === arr[arr.length - 1]) {
            this.selectType = [];
            this.selectType.push({
              name: data[i].name,
              id: data[i].id,
            });
            return;
          } else {
            if (data[i].children) {
              gettree(data[i].children);
            }
          }
        }
      };
      gettree(this.eventTypeData);
    },
    // 滚动底部加载数据
    scrollEvent() {
      let scrollHeight = '';
      let scrollTop = '';
      let clientHeight = '';
      scrollHeight = this.$refs.appReportScroll.wrap.scrollHeight;
      scrollTop = this.$refs.appReportScroll.wrap.scrollTop;
      clientHeight = this.$refs.appReportScroll.wrap.clientHeight;
      if (scrollHeight - scrollTop === clientHeight) {
        if (this.page < this.totalPages) {
          this.page += 1;
          this.getReportData('load');
        }
      }
    },
    // 呼出电话
    callOut(item) {
      this.makePhoneCall(item.mobile1 || item.mobile2, item.id, item.name, null);
    },
    // 单个事件处置状态改变
    itemStatusChange(item, itemStatus) {
      console.log(item, itemStatus);
      this.$http({
        url: `${window.SITE_CONFIG.event}/event/info/setProcessStatus`,
        method: 'post',
        data: this.$http.adornData({
          id: item.id,
          status: itemStatus, // 处置状态id
        }),
      }).then((res) => {
        console.log(res);
        if (res.data.code === 0) {
          this.$message.success('处置状态修改成功');
        } else {
          this.$message.success(res.data.msg);
        }
      });
    },
    getStateListData() {
      const data = {
        pcode: 'information_processing_status',
      };
      this.$api.eventGetByPcodes(data).then(res => {
        if (res.errorcode === 0) {
          console.log(res.data);
          this.appStatusOptions = res.data;
          this.itemStatusOptions = res.data;
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
  .appReportIndex {
    overflow: auto;
    width: 100%;
  }
  .appReport__top {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    .report__search {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 14px;
      margin-left: 28px;
      .el-cascader,
      .el-select {
        margin-right: 14px;
        float: left;
      }
      .search_btn {
        background-color: #0091FF;
        color: #FFFFFF;
        border-radius: 0;
        border: 1px solid #0091FF;
      }
    }
    .report__total {
      margin-right: 28px;
      font-size: 16px;
    }
  }
  .appReport__content {
    // height: 725px;
    width: 100%;
    overflow: auto;
    display: flex;
    flex: 1;
    flex-wrap: wrap;
  }
  /deep/ .app_report_box {
    width: 530px;
    height: 310px;
    margin: 10px 0 10px 28px;
    .el-card {
      height: 100%;
    }
    .el-card__body {
      padding: 14px;
    }
    .report__title {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      border-bottom: 1px solid rgba(0, 0, 0, 0.04);;
      .report__title__left {
        display: flex;
        flex-direction: column;
        .report__title__left__item {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          .title {
            font-size: 16px;
            font-weight: 600;
            color: #555555;
            line-height: 27px;
          }
          .el-select {
            width: 110px;
            margin-right: 10px;
          }
        }
        .time {
          font-size: 14px;
          font-weight: 400;
          color: #999999;
          // line-height: 16px;
        }
      }

      .report__title__right {
        width: 117px;
        height: 27px;
        font-size: 16px;
        color: #0091FF;
        background: rgba(0, 145, 255, 0.15);
        border-radius: 13px;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 24px;
        padding: 1px 8px;
        margin-top: 8px;
      }
    }
    .report__content {
      display: flex;
      flex-direction: column;
      .report__detail {
        background: #F7F7F7;
      }
      .report__content__detail {
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        line-height: 22px;
        margin: 5px 0;
        height: 45px;
        word-wrap: break-word;
        word-break: normal;
        text-overflow: ellipsis;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .report__content__detail__fill {
        font-size: 14px;
        font-weight: 400;
        color: #666666;
        height: 120px;
        // line-height: 20px;
        margin: 5px 0;
      }
      .report__content__img {
        display: flex;
        flex-direction: row;
        margin: 5px 0;
        div {
          width: 129px;
          height: 75px;
          display: inline-block;
          overflow: hidden;
          margin-right: 14px;
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
      .report__content__audio {
        display: flex;
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
          margin-left: 14px;
        }
      }
      .report__content__people {
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        // line-height: 16px;
        margin: 5px 0;
        line-height: 22px;
        img {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
      }
      .report__content__location {
        font-size: 14px;
        font-weight: 400;
        color: #999999;
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
          width: 13px;
          height: 15px;
        }
      }
    }
  }
</style>
