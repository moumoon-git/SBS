<template>
  <main
    class="site-content bestBigWrap"
    :class="{ 'site-content--tabs': $route.meta.isTab }"
  >
    <!--    <div class="backHome" >-->
    <!--        <img src="../assets/img/back.png"-->
    <!--             alt=""-->
    <!--             @click="back">-->
    <!--    </div>-->
    <!-- 主入口标签页 s -->
    <el-tabs
      v-if="true"
      class="main_tabs"
      v-model="mainTabsActiveName"
      :closable="true"
      style
      @tab-click="selectedTabHandle"
      @tab-remove="removeTabHandle"
    >
      <!-- <slot
        name="warn"
        v-if="licenceDate[0] !== 'normal'"
      >
        <div class="site-tabs__warn">
          <i class="el-icon-warning" />
            License将在{{ licenceDate[1] || '' }}到期，请及时更新
            <div
              class="updateLience"
              @click="updateLience"
            >
              更新
            </div>
        </div>
      </slot> -->
      <el-dropdown
        class="site-tabs__tools"
        :show-timeout="0"
      >
        <i class="el-icon-arrow-down el-icon--right" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="tabsCloseCurrentHandle">
            关闭当前标签页
          </el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseOtherHandle">
            关闭其它标签页
          </el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseAllHandle">
            关闭全部标签页
          </el-dropdown-item>
          <el-dropdown-item @click.native="refresh()">
            刷新当前标签页
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-tab-pane
        v-for="item in mainTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <!-- <el-card :body-style="siteContentViewHeight"> -->
        <el-card class="page-container">
          <iframe
            v-if="item.type === 'iframe'"
            :src="item.iframeUrl"
            width="100%"
            height="100%"
            frameborder="0"
            scrolling="yes"
          />
          <template v-else>
            <router-view
              v-if="item.name === mainTabsActiveName"
              style
            />
          </template>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 主入口标签页 e -->
    <!-- <el-card v-else :body-style="siteContentViewHeight"> -->
    <el-card
      v-else
      class="page-container"
    >
      <!-- <keep-alive>
        <router-view v-if="$route.query.status !== 1"/>
      </keep-alive>-->
      <router-view />
    </el-card>
    <!-- 抓拍人信息 -->
    <el-dialog
      title="抓拍信息"
      :visible.sync="dialogTableVisible"
      width="610px"
    >
      <div class>
        <div class="list">
          <!-- 一个卡片单位 -->
          <div class="colStaff">
            <div style="position: absolute;line-height:12px;">
              <span>{{ dataList.cameraName }}</span>
            </div>
            <div style="position: absolute;right: 4%;line-height:12px;">
              <span>{{ dataList.alarmTime }}</span>
            </div>
            <div
              class="left"
              style="margin-top:16px;"
            >
              <img
                style="width:162px;height:100%"
                :src="dataList.bkgPicUrl"
                alt
              >
            </div>
            <div
              class="left"
              style="margin-top:16px;"
            >
              <img
                style="width:162px;height:100%"
                :src="dataList.facePicUrl"
                alt
              >
            </div>

            <div class="right">
              <ul>
                <li>
                  <label>姓名:{{ dataList.humanName }}</label>
                  <span />
                </li>
                <li>
                  <label>
                    性别:{{
                      dataList.sex === 0
                        ? "未知"
                        : dataList.sex == 1
                          ? "男"
                          : "女"
                    }}
                  </label>
                  <span />
                </li>
                <li>
                  <label>证件号:{{ dataList.credentialsNum }}</label>
                  <span />
                </li>
                <li>
                  <label>名单库:{{ dataList.listLibName }}</label>
                  <span />
                </li>
                <li>
                  <el-button
                    type="text"
                    @click="handleCaptureInfo(dataList.id)"
                  >
                    抓拍信息
                  </el-button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 抓拍车信息 -->
    <el-dialog
      title="抓拍信息"
      :visible.sync="dialogVehicleVisible"
      width="600px"
    >
      <div class>
        <!-- 一个卡片单位 -->
        <div class="colStaff">
          <div style="position: absolute;">
            <span style="font-weight:bold">{{ vehicleList.cameraName }}</span>
          </div>
          <div style="position: absolute;right: 4%;">
            <span>{{ vehicleList.alarmTime }}</span>
          </div>

          <div>
            <div
              class="left"
              style="margin-top:25px;width: 238px;"
            >
              <img
                style="height:100%"
                :src="vehicleList.picAbbreviate"
                alt
              >
            </div>
            <div class="right">
              <ul>
                <li>
                  <label>车牌号:{{ vehicleList.plateInfo }}</label>
                  <span />
                </li>
                <li>
                  <label>车辆识别类型:{{ vehicleList.type }}</label>
                  <span />
                </li>
                <li>
                  <label>经过时刻:{{ vehicleList.alarmTime }}</label>
                  <span />
                </li>
                <li>
                  <el-button
                    type="text"
                    @click="handleCaptureVehicle(vehicleList.plateInfo)"
                  >
                    抓拍信息
                  </el-button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 抓拍人群信息 -->
    <el-dialog
      title="抓拍信息"
      :visible.sync="dialogCrowdAlarmVisible"
      width="600px"
    >
      <!-- 一个卡片单位 -->
      <div class="colStaff">
        <div style="position: absolute;font-size:0.9vw;font-weight:bold">
          <span>{{ riskCrowdAlarmList.cameraName }}</span>
        </div>
        <div style="position: absolute;right: 4%;top:4%">
          <span>{{ riskCrowdAlarmList.shootTime }}</span>
        </div>

        <div>
          <div
            class="left"
            style="margin-top:25px;"
          >
            <viewer
              v-if="riskCrowdAlarmList.imgName.indexOf('http') !== -1"
              :images="[
                riskCrowdAlarmList.imgName.length > 97
                  ? imageUrl
                  : riskCrowdAlarmList.imgName
              ]"
            >
              <img
                v-for="(item, index) in [
                  riskCrowdAlarmList.imgName.length > 97
                    ? imageUrl
                    : riskCrowdAlarmList.imgName
                ]"
                :key="index"
                :src="item"
                style="width:8vw;height:181px;min-width:120px"
              >
            </viewer>

            <viewer
              v-else
              :images="[
                riskCrowdAlarmList.imgName.length > 97
                  ? imageUrl
                  : riskCrowdAlarmList.imgName
              ]"
            >
              <img
                v-for="(item, index) in [
                  riskCrowdAlarmList.imgName.length > 97
                    ? imageUrl
                    : riskCrowdAlarmList.imgName
                ]"
                :key="index"
                :src="backgroundURL + item"
                style="width:8vw;height:181px;min-width:120px"
              >
            </viewer>
          </div>

          <div class="right">
            <ul>
              <li>
                <label>人群密集度：{{ riskCrowdAlarmList.crowdCount }}</label>
                <span />
              </li>
              <li>
                <label>报警阙值：{{ riskCrowdAlarmList.alarmThreshold }}</label>
                <span />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="短信记录"
      :visible.sync="dialogSMSVisible"
      width="500px"
    >
      <div class="content">
        <ul>
          <li
            v-for="(item, index) in oneList"
            :key="index"
          >
            <p>发送{{ item.createTime }}【{{ item.status }}】</p>
            <div>{{ item.content }}</div>
          </li>
        </ul>
      </div>
      <el-pagination
        :current-page="page"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-dialog>

    <capture-info
      v-if="captureInfoVisible"
      ref="captureInfo"
    />

    <capture-vehicle
      v-if="captureVehicleVisible"
      ref="captureVehicle"
    />
    <globalUploader />
    <MessageDetail ref="MessageDetailRef" />

    <AppEvent ref="AppEventRef" />
    <!-- licence过期弹窗 -->
    <licence-dialog
      @timeDiff="timeDiff"
      ref="licenceDialog"
    />
    <!-- 接起电话语音转文字弹窗 -->
    <voiceText 
      v-show="voiceTextFlag" 
      @closeVoiceText="closeVoiceText"
      @cellRemark="cellRemark"
      ref="voiceTextRef"
      >    
    </voiceText>      
  </main>
</template>

<script>
import { isURL } from '@/utils/validate';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import dropped from '@/views/modules/communication/mobile_common/dropped';
import dutylogoperations from '@/views/modules/sys/duty/dutylogoperations-add-or-update';
import Watermark from '@/utils/watermark';
import { getRelations } from '@/assets/js/yz_common.js';
import MessageDetail from '@/views/modules/announcement/components/MessageDetail.vue'; // 通告详情
import bus from './common/js/eventBus';
import bus2 from "@/yz_components/common/js/eventBus";
import globalUploader from '../yz_components/globalUploader.vue';
import licenceDialog from '@/views/common/SecondaryPage/licenceDialog.vue';
import noExist from '@/views/common/404';
import voiceText from '@/view/eventManagement/informationDisposal/communicationHistory/comonnTemplat/voiceText.vue';
import AppEvent from '@/view/eventManagement/informationDisposal/communicationHistory/appReport/appReportDialog.vue'; // app事件上报

export default {
  components: {
    AppEvent,
    dropped,
    dutylogoperations,
    globalUploader,
    MessageDetail,
    licenceDialog,
    noExist,
    voiceText
  },
  inject: ['refresh'],
  data() {
    return {
      voiceTextFlag: false,
      backgroundURL: window.SITE_CONFIG.cloudUrl,
      updateVisible: false,
      captureInfoVisible: false,
      captureVehicleVisible: false,
      platformId: this.$store.state.user.platformId,
      timer: '', // 存储定时器
      stompClient: '', // 存储订阅
      memoClient: '', // 备忘录提醒订阅
      socket: '',

      // 抓拍人
      dialogTableVisible: false,
      dataList: {},
      humanAlarmId: '',

      // 抓拍车
      dialogVehicleVisible: false,
      vehicleList: {},
      vehicleId: '',

      // 抓拍违规
      violationList: {},
      violationId: '',

      // 抓拍人群
      dialogCrowdAlarmVisible: false,
      riskCrowdAlarmList: {
        cameraName: '',
        shootTime: '',
        imgName: '',
        crowdCount: 0,
        alarmThreshold: 0,
      },

      // 短信记录
      oneList: [],
      dialogSMSVisible: false,
      page: 1,
      pageSize: 5,
      total: 0,

      // 物业小区title
      communityTitle: '',
      // 校园安全上报title
      campusTitle: '',
      // 跳转页面传递的id
      notifyId: '',
      noticeTimer: null, // 通知公告消息定时器
      taskTimer: null, // 任务管理消息定时器
      tasklist: [],
      tipNum: 5, // 通知公告计时
      licenceDate: JSON.parse(sessionStorage.getItem('licenceDate')) || [],// licence过期时间
    };
  },
  computed: {
    isCallIng() {
      return this.$store.state.isCallIng
    },
    documentClientHeight: {
      get() {
        return this.$store.state.common.documentClientHeight;
      },
    },
    menuActiveName: {
      get() {
        return this.$store.state.common.menuActiveName;
      },
      set(val) {
        this.$store.commit('common/updateMenuActiveName', val);
      },
    },
    mainTabs: {
      get() {
        return this.$store.state.common.mainTabs;
      },
      set(val) {
        this.$store.commit('common/updateMainTabs', val);
      },
    },
    mainTabsActiveName: {
      get() {
        console.log(this.$store.state.common.mainTabsActiveName);
        return this.$store.state.common.mainTabsActiveName;
      },
      set(val) {
        console.log(val);
        this.$store.commit('common/updateMainTabsActiveName', val);
      },
    },
    siteContentViewHeight() {
      let height = this.documentClientHeight - 50 - 30 - 2;
      if (this.$route.meta.isTab) {
        height -= 40;
        return isURL(this.$route.meta.iframeUrl)
          ? { height: `${height}px` }
          : { minHeight: `${height}px` };
      }
      return { minHeight: `${height}px` };
    },
  },
  watch: {
    isCallIng(){
      console.log('♥♥♥♥♥♥♥♥♥♥♥♥♥------------')
      this.$refs.voiceTextRef.autoOpen = true
      this.voiceTextFlag = true      
    },    
    $route(oldVal, newVal) {
      if (this.$route.path === '/sys/duty/dutyScheduling/dutyScheduling') {
        setTimeout(() => {
          document
            .querySelector(
              "div[aria-labelledby='tab-sys/duty/dutyScheduling/dutyScheduling'] .el-card__body",
            )
            .setAttribute('style', 'padding: 0px 5px;margin-top: 10px;');
          document
            .querySelector(
              "div[aria-labelledby='tab-sys/duty/dutyScheduling/dutyScheduling'] .el-card.is-always-shadow",
            )
            .setAttribute(
              'style',
              'background: #f1f4f5!important;box-shadow: initial!important; webkit-box-shadow: initial!important;border: initial!important;overflow:initial!important;',
            );
        }, 1000);
      }
      if (this.$route.path === '/riskInvestigation/patrolRecord/patrolRecord') {
        setTimeout(() => {
          document
            .querySelector(
              "div[aria-labelledby='tab-riskInvestigation/patrolRecord/patrolRecord'] .el-card__body",
            )
            .setAttribute('style', 'background-color:#f4f4f4');
          document
            .querySelector(
              "div[aria-labelledby='tab-riskInvestigation/patrolRecord/patrolRecord'] .el-card.is-always-shadow",
            )
            .setAttribute('style', 'box-shadow:none');
        }, 1000);
      }

      if (this.$route.path === '/riskInvestigation/checkItem/contentManage') {
        setTimeout(() => {
          document
            .querySelector(
              "div[aria-labelledby='tab-riskInvestigation/checkItem/contentManage'] .el-card__body",
            )
            .setAttribute('style', 'background-color:#f4f4f4');
          document
            .querySelector(
              "div[aria-labelledby='tab-riskInvestigation/checkItem/contentManage'] .el-card.is-always-shadow",
            )
            .setAttribute('style', 'box-shadow:none');
        }, 1000);
      }

      if (this.$route.path === '/riskInvestigation/task/task') {
        setTimeout(() => {
          document
            .querySelector(
              "div[aria-labelledby='tab-riskInvestigation/task/task'] .el-card__body",
            )
            .setAttribute('style', 'background-color:#f4f4f4');
          document
            .querySelector(
              "div[aria-labelledby='tab-riskInvestigation/task/task'] .el-card.is-always-shadow",
            )
            .setAttribute('style', 'box-shadow:none');
        }, 1000);
      }
    },
    mainTabs(newValue) {
      window.console.log(newValue);
    },
  },
  mounted() {
    // 调试用
    // this.$refs.voiceTextRef.autoOpen = true
    // this.voiceTextFlag = true
    // ↑
    this.$http({
      url: this.$http.adornUrl('/sys/platform/platformName'),
      method: 'get',
      params: this.$http.adornParams({
        id: this.$store.state.user.platformId,
      }),
    }).then(({ data }) => {
      if (data) {
        sessionStorage.setItem('platformName', data);
      } else {
        this.$message.error(data.msg);
      }
    });
    this.initWebSocket();
    Watermark.set(
      `${this.$store.state.user.name} ${this.$store.state.user.mobile.substr(
        -4,
        4,
      )}`,
    );

    // 调用获取物业小区、校园安全上报title方法
    this.getCommunityTitle();
    this.getCampusTitle();
    // 3.0不要这个接口了
    // this.contactorGroupsFromDictionary()

    // 即将超时的任务的列表
    this.getTaskList();
    // console.log(JSON.parse(sessionStorage.getItem('licenceDate')), this.licenceDate)
    // if (this.licenceDate.length === 0) {
    //   this.$http.post(`${window.SITE_CONFIG.cloudUrl}/oauth/ignorelicense/getExpireTime`)
    //   .then((result) => {
    //     if (result.data.errorcode === 0) {
    //       console.log(result.data.data);
    //       this.timeDiff(result.data.data);
    //     } else {
    //       this.$message.error(response.msg);
    //     }
    //   }).catch((error) => {
    //     this.$message.error(error);
    //   });
    // }
  },

  beforeDestroy() {
    // 页面离开时断开连接,清除定时器
    // console.log('页面离开时断开连接,清除定时器')
    this.disconnect();
    clearInterval(this.timer);
  },
  created() {
    // this.initWebSocket();
    bus.$on('closeSocket', () => {
      const that = this;
      that.stompClient.disconnect(() => {
        // console.log('断开连接')
        clearInterval(that.timer);
      });
    });
  },
  methods: {
    // 关闭语音转文字弹窗
    closeVoiceText() {
      this.voiceTextFlag = false;
    },    
    // 存为电话备注
    cellRemark(obj) {
      this.$refs.bigTemplate.mackeValue = obj.remark;
    },    
    // 接收到新的通知公告
    openMessageTip(noticeId, title) {
      const that = this;
      let tipNum = 5;
      clearInterval(this.noticeTimer);
      this.$notify({
        customClass: 'messageTip',
        title: '您有一条新消息',
        dangerouslyUseHTMLString: true,
        message: `<div class="messageTipDiv">
                            <div>收到“${title}”</div>
                            <div>
                              <div id="iglore">忽略（${tipNum}S）</div>
                              <div>查看</div>
                              </div>
                            </div>`,
        duration: 5000,
        position: 'bottom-right',
        onClick: () => {
          this.openMessageDetail(noticeId);
        },
        onClose: () => {
          clearInterval(this.noticeTimer);
        },
      });
      this.$nextTick(() => {
        document.getElementById('iglore').onclick = function(e){
           e.stopPropagation(); 
           that.$notify.closeAll();
        };
      });
      that.noticeTimer = setInterval(() => {
        tipNum -= 1;
        document.getElementById('iglore').innerHTML = `忽略（${tipNum}S）`;
        if (tipNum === 0) {
          document.getElementById('iglore').innerHTML = '忽略';
          clearInterval(that.noticeTimer);
          return false;
        }
      }, 1000);
    },
    // 打开通告详情
    openMessageDetail(data) {
      this.$refs.MessageDetailRef.noticeId = data;
      this.$refs.MessageDetailRef.dialogVisible = true;
      this.$refs.MessageDetailRef.getNoticeContent();
      this.readByPlatform(data);
    },
    // 平台已读
    readByPlatform(noticeId) {
      const data = {
        noticeId,
        readFalg: 1, // 0未读、1已读
      };
      this.$api.readByPlatform(data).then((res) => {
        
      });
    },
    /**
     * @description: 文字信息转语音播报
     * @param {*}
     * @return {*}
     */
    wordsToVoice(messageString) {
      const message = new SpeechSynthesisUtterance();
      message.text = messageString;
      message.lang = 'zh';
      speechSynthesis.speak(message);
    },
    back() {
      this.$router.push({ path: '/secondary' });
      // console.log('返回');
    },
    // tabs, 选中tab
    selectedTabHandle(tab) {
      let selectedTab = tab;
      selectedTab = this.mainTabs.filter((item) => item.name === selectedTab.name);
      // 是预案管理并且有预案在编辑中，直接去newlyadded
      if (tab.name === 'organization' && Number(sessionStorage.getItem('preplanActive')) > -1) {
        this.$router.push({
          path: '/newlyadded',
          name: 'newlyadded',
        });
      } else if (selectedTab.length >= 1) {
        this.$router.push({
          name: selectedTab[0].name,
          query: selectedTab[0].query,
          params: selectedTab[0].params,
        });
      }
    },
    // tabs, 删除tab
    removeTabHandle(tabName) {
      this.mainTabs = this.mainTabs.filter((item) => item.name !== tabName);
      if (this.mainTabs.length >= 1) {
        // 当前选中tab被删除
        if (tabName === this.mainTabsActiveName) {
          const tab = this.mainTabs[this.mainTabs.length - 1];
          this.$router.push(
            { name: tab.name, query: tab.query, params: tab.params },
            () => {
              this.mainTabsActiveName = this.$route.name;
            },
          );
        }
      } else {
        this.menuActiveName = '';
        this.$router.push({ name: 'home' });
      }
    },
    // tabs, 关闭当前
    tabsCloseCurrentHandle() {
      this.removeTabHandle(this.mainTabsActiveName);
    },
    // tabs, 关闭其它
    tabsCloseOtherHandle() {
      this.mainTabs = this.mainTabs.filter(
        (item) => item.name === this.mainTabsActiveName,
      );
    },
    // tabs, 关闭全部
    tabsCloseAllHandle() {
      this.mainTabs = [];
      this.menuActiveName = '';
      this.$router.push({ name: 'home' });
    },
    // tabs, 刷新当前
    tabsRefreshCurrentHandle() {
      const tab = this.$route;
      this.removeTabHandle(tab.name);
      this.$nextTick(() => {
        this.$router.push({
          name: tab.name,
          query: tab.query,
          params: tab.params,
        });
      });
    },
    handleCaptureInfo(id) {
      this.captureInfoVisible = true;
      this.$nextTick(() => {
        this.$refs.captureInfo.init(id);
      });
    },
    handleCaptureVehicle(id) {
      this.captureVehicleVisible = true;
      this.$nextTick(() => {
        this.$refs.captureVehicle.init(id);
      });
    },

    // 获取物业小区title
    getCommunityTitle() {
      this.$http({
        url: this.$http.adornUrl('/sys/config/infoByKey?key=WYXQ_TK'),
        method: 'get',
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.communityTitle = data.config.paramValue;
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 获取校园安全上报title
    getCampusTitle() {
      this.$http({
        url: this.$http.adornUrl('/sys/config/infoByKey?key=XYAQ_TK'),
        method: 'get',
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.campusTitle = data.config.paramValue;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description 获取下级平台列表
     */
    getChildrenPlatform() {
      return new Promise((resolve) => {
        const request = {
          method: 'get',
          baseURL: `${window.SITE_CONFIG.baseUrl}`,
          url: '/sys/platform/getChildrenPlatform',
        };
        this.$http(request).then((response) => {
          if (response.data.errorcode === 0) {
            const platformOptions = response.data.data || [];
            resolve(platformOptions);
          } else {
            this.$message.error(`获取下级平台列表失败，错误代码${response.data.errorcode}，错误信息：${response.data.msg}`);
          }
        });
      });
    },
    // 连接
    initWebSocket() {
      const that = this;
      that.connection();
      // 断开重连机制,尝试发送消息,捕获异常发生时重连
      this.timer = setInterval(() => {
        try {
          that.globalStompClient.send(
            '/platform/check',
            {},
            JSON.stringify({ to: that.platformId }),
          );
        } catch (err) {
          that.connection();
        }
      }, 10000);
    },
    // 连接
    connection() {
      const that = this;
      that.socket = new SockJS(`${window.SITE_CONFIG.websocket}`);
      // 使用STMOP子协议的WebSocket客户端
      that.stompClient = Stomp.over(that.socket);
      that.globalStompClient = that.stompClient;
      // 连接WebSocket服务端
      that.stompClient.connect({}, (frame) => {
        // 通过stompClient.subscribe订阅/topic/getResponse 目标(destination)发送的消息
        that.stompClient.subscribe(
          `/platform/${that.platformId}/message`,
          function (response) {
            /**
             * @debug
             * @author tanjinfeng
             * @date 2020-11-20
             * @description websocket响应格式处理出错
             */
            // *** 原来的代码 ***
            // var str = response.body
            // *** 修正后的代码 ***
            window.console.log('recieve websocket response:', response);
            const str = JSON.parse(response.body).content;
            const { msgType } = JSON.parse(response.body); // 收到的消息码
            console.log('状态码：', msgType, str);
            // *** 结束 ***

            if (typeof str === 'object') {
              // msgType： 60002 更新事件管理页面的事件
              //           60001 更新下级平台上报首报/
              //           2001  接收到通知公告
              if (msgType === 60002) {
                bus.$emit('updateEventList');
              } else if (msgType === 2001) {
                console.log('接收到通知公告：');
                console.log(str);
                that.openMessageTip(str.appNotice.id, str.appNotice.title); // 打开通知公告消息弹窗
              } else if (msgType === 60001) {
                const {
                  eventTitle,
                  reportTime,
                  platformName,
                  type,
                  dealOrder,
                  platformId,
                } = str;
                // 收到下级平台新增的首报/续报，要通知本级平台
                that.getChildrenPlatform().then((res) => {
                  const childrenPlatformIds = getRelations({
                    arr: res,
                    relationKey: 'platformName',
                    findKey: 'id',
                    findValue: Number(platformId),
                  });
                  // 有下级平台
                  if (childrenPlatformIds.length > 0) {
                    if (type === 'add') {
                      that.$notify({
                        dangerouslyUseHTMLString: true,
                        message: `
                          <div style="cursor:pointer;">
                            <el-col style="background: ${dealOrder === 0 ? '#D9001B' : '#F59A23'};
                              color: #ffffff;
                              text-align: center;
                              border-radius: 5px;
                              width: 40px;
                              padding: 0;
                              display: block;
                              float: left;
                              margin-right:10px;">${dealOrder === 0 ? '首报' : '续报'}</el-col>
                            ${eventTitle || ''}</br>
                            上报时间：${reportTime || ''}</br>
                            上报平台：${platformName || ''}</br>
                          </div>`,
                        duration: 0,
                        onClick: () => {
                          that.$router.push({
                            path: '/informationDisposal',
                            query: {
                              to: 'systemReport',
                            },
                          });
                          bus.$emit('toSystemReport', str);
                        },
                      });
                    } else {
                      bus.$emit('updateEventDealList', str);
                    }
                  }
                });
              } else if (msgType === 60006) {
                this.getTaskList();
              } else if (msgType === 60003) {
                const tipNum = 5;
                clearInterval(that.noticeTimer);
                that.$notify({
                  customClass: 'messageTip',
                  title: '您有一条新消息',
                  dangerouslyUseHTMLString: true,
                  message: `<div class="messageTipDiv">
                            <div>收到APP上报的事件“${str.title}”</div>
                            <div>
                              <div id="iglore${str.eventId}">关闭</div>
                              <div>查看</div>
                              </div>
                            </div>`,
                  duration: 0,
                  position: 'bottom-right',
                  onClick: () => {
                    that.$refs.AppEventRef.showDetail(str.eventId);
                  },
                  onClose: () => {
                    clearInterval(that.noticeTimer);
                  },
                });
                that.$nextTick(() => {
                  document.getElementById(`iglore${str.eventId}`).onclick = function(e) {
                    e.stopPropagation();
                    that.$notify.closeAll();
                  };
                });
                that.noticeTimer = setInterval(() => {
                  if (tipNum === 0) {
                    clearInterval(that.noticeTimer);
                    return false;
                  }
                }, 1000);
              }
            } else {
              if (str.indexOf('human') > -1) {
                // 位置更新
                var str2 = str;
                var strArray = str2.split('_');
                that.humanAlarmId = strArray[3];
                // 获取人抓怕列表
                that
                  .$http({
                    url: that.$http.adornUrl('/risk/riskhumanalarm/info'),
                    method: 'get',
                    params: that.$http.adornParams({
                      id: that.humanAlarmId,
                    }),
                  })
                  .then(({ data }) => {
                    // console.log(data)
                    if (data && data.code === 0) {
                      if (data.riskHumanAlarm.alarmId === that.humanAlarmId) {
                        that.dataList = data.riskHumanAlarm;
                        let messageInfo = '';
                        if (that.dataList) {
                          messageInfo = `<div style='display:flex;padding-right:2vw'><img style='margin-right:1vw;width:50px;height:50px' src=${
                            that.dataList.smallPicUrl
                          }><span style='width:170px'>在${
                            that.dataList.cameraName
                          }抓拍到${
                            that.dataList.listLibName
                          }${that.dataList.humanName
                          }</span></div>`;
                        } else {
                          messageInfo = '抓拍数据有误';
                        }
                        // 提示
                        that.$notify.info({
                          title: '抓拍到新的数据',
                          dangerouslyUseHTMLString: true,
                          message: messageInfo,
                          position: 'bottom-right',
                          customClass: 'notify__red-icon',
                          duration: 0,
                          onClick() {
                            that.dialogTableVisible = true;
                          },
                        });
                        this.wordsToVoice(messageInfo);
                      } else {
                        this.dataList = [];
                      }
                    } else {
                      this.dataList = [];
                      this.$message.error(data.msg);
                    }
                  });
              } else if (str.indexOf('vehicle') > -1) {
                // 位置更新
                var str2 = str;
                var strArray = str2.split('_');
                that.vehicleId = strArray[3];

                // 获取车抓拍列表
                that
                  .$http({
                    url: that.$http.adornUrl('/risk/riskvehiclealarm/info'),
                    method: 'get',
                    params: that.$http.adornParams({
                      id: that.vehicleId,
                    }),
                  })
                  .then(({ data }) => {
                    // console.log(data)
                    if (data && data.code === 0) {
                      if (data.riskVehicleAlarm.id === that.vehicleId) {
                        that.vehicleList = data.riskVehicleAlarm;
                        let messageInfo = '';
                        if (that.vehicleList) {
                          messageInfo = `<div style='display:flex;padding-right:2vw'><img style='margin-right:1vw;width:50px;height:50px' src=${
                            that.vehicleList.picVehicle
                          }></img><span style='width:170px'>在${
                            that.vehicleList.cameraName
                          }抓拍到车牌号为${
                            that.vehicleList.plateInfo
                          }的车辆</span></div>`;
                        } else {
                          messageInfo = '抓拍数据有误';
                        }
                        // 列表
                        that.$notify.info({
                          title: '抓拍到新的数据',
                          dangerouslyUseHTMLString: true,
                          message: messageInfo,
                          position: 'bottom-right',
                          customClass: 'notify__red-icon',
                          duration: 0,
                          onClick() {
                            // that.$router.push({ path: "risk-riskhuamnalarminfo" });
                            that.dialogVehicleVisible = true;
                          },
                        });
                        this.wordsToVoice(messageInfo);
                      } else {
                        that.vehicleList = [];
                      }
                    } else {
                      this.$message.error(data.msg);
                    }
                  });
              } else if (str.indexOf('violation') > -1) {
                // 位置更新
                var str2 = str;
                var strArray = str2.split('_');

                that.violationPlatformId = strArray[2];
                that.violationId = strArray[3];

                // 获取违规抓拍列表
                that
                  .$http({
                    url: 'http://192.168.3.220:8848/ser/violation/findById',
                    method: 'get',
                    params: that.$http.adornParams({
                      id: that.violationId,
                    }),
                  })
                  .then(({ data }) => {
                    if (data && data.code === 0) {
                      if (data.data.id === that.violationId) {
                        that.violationList = data.data;
                        let messageInfo = '';
                        if (that.violationList) {
                          switch (that.violationList.intelligentType) {
                            case '0':
                              that.violationList.intelligentType = '未违规';
                              break;
                            case '1':
                              that.violationList.intelligentType = '店外经营';
                              break;
                            case '2':
                              that.violationList.intelligentType = '游摊小贩';
                              break;
                            case '3':
                              that.violationList.intelligentType = '占道经营';
                              break;
                            case '4':
                              that.violationList.intelligentType = '乱堆物堆料';
                              break;
                            case '5':
                              that.violationList.intelligentType = '非机动车';
                              break;
                            case '6':
                              that.violationList.intelligentType = '户外广告';
                              break;
                            case '7':
                              that.violationList.intelligentType = '打包垃圾';
                              break;
                            case '8':
                              that.violationList.intelligentType = '违规撑伞';
                              break;
                            case '9':
                              that.violationList.intelligentType = '垃圾箱满溢';
                              break;
                            case '10':
                              that.violationList.intelligentType = '垃圾箱满溢';
                              break;
                            case '11':
                              that.violationList.intelligentType = '暴露垃圾';
                              break;
                            case '12':
                              that.violationList.intelligentType = '沿街晾晒';
                              break;
                            case '2000':
                              that.violationList.intelligentType = '违章停车';
                              break;
                            default:
                              that.violationList.intelligentType = '未知';
                              break;
                          }

                          messageInfo = `<div style='display:flex;padding-right:2vw'><img style='margin-right:1vw;width:50px;height:50px' src=${
                            that.violationList.picUrl
                          }></img><span style='width:170px'>在${
                            that.violationList.orgName
                          }抓拍到有${
                            that.violationList.intelligentType
                          }的现象</span></div>`;
                        } else {
                          messageInfo = '抓拍数据有误';
                        }
                        // 列表
                        that.$notify.info({
                          title: '抓拍到新的数据',
                          dangerouslyUseHTMLString: true,
                          message: messageInfo,
                          position: 'bottom-right',
                          duration: 0,
                          onClick() {
                            that.$router.push({
                              path: '/city/badManagement/badManagement',
                            });
                          },
                        });
                        this.wordsToVoice(messageInfo);
                      } else {
                        that.violationList = [];
                      }
                    }
                  });
              } else if (str.indexOf('report') > -1) {
                // 位置更新
                var str2 = str;
                var strArray = str2.split('_');
                let reportName = strArray[2];
                const eventTypeName = strArray[3];
                // 提示
                if (reportName === 'null' || reportName == null) {
                  reportName = '请注意！发现';
                } else {
                  reportName += '上报了';
                }
                // 提示
                const messageInfo = `${reportName + eventTypeName}工单`;

                // alert(messageInfo)
                that.$notify({
                  title: '有新的工单上报',
                  duration: 0,
                  message:
                    `<a href='${that.backgroundURL}/#/word/manager/wordmanager'>${
                      messageInfo
                    }</a>`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-right',
                  type: 'warning',
                });
              } else if (str.indexOf('community') > -1) {
                // 位置更新
                var str2 = str;
                var strArray = str2.split('_');
                var id = strArray[1];
                let reportName = strArray[2];
                const eventTypeName = strArray[3];

                // 提示
                if (reportName === 'null' || reportName == null) {
                  reportName = '群众';
                }
                // 提示
                const messageInfo = `${reportName}上报了${eventTypeName}工单`;

                // that.$notify({
                //   title: that.communityTitle,
                //   message:
                //     `<a href='${that.backgroundURL}/#/risk/propertyDistrict/propertyDistrict'>` +
                //     messageInfo +
                //     "</a>",
                //   dangerouslyUseHTMLString: true,
                //   position: "bottom-right",
                //   type: "warning",
                // });
                that.notifyId = id;
                that.$notify({
                  title: that.communityTitle,
                  duration: 0,
                  // message:
                  //   `<span>` +
                  //   messageInfo +
                  //   "</span>",
                  message:
                    `<span>${
                      messageInfo
                    }</span>`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-right',
                  type: 'warning',
                  onClick() {
                    that.$router.push({
                      path: '/risk/propertyDistrict/propertyDistrict',
                      query: { id: that.notifyId },
                    });
                  },
                });
              } else if (str.indexOf('school') > -1) {
                // 位置更新
                var str2 = str;
                var strArray = str2.split('_');
                var id = strArray[1];
                let reportName = strArray[2];
                const eventTypeName = strArray[3];

                // 提示
                if (reportName === 'null' || reportName == null) {
                  reportName = '群众';
                }
                // 提示
                const messageInfo = `${reportName}上报了${eventTypeName}工单`;

                // that.$notify({
                //   title: that.campusTitle,
                //   message:
                //     `<a href='${that.backgroundURL}/#/risk/campusPeriphery/campusPeriphery'>` +
                //     messageInfo +
                //     "</a>",
                //   dangerouslyUseHTMLString: true,
                //   position: "bottom-right",
                //   type: "warning",
                // });
                that.notifyId = id;
                that.$notify({
                  title: that.campusTitle,
                  duration: 0,
                  message:
                    `<span>${
                      messageInfo
                    }</span>`,
                  // message:
                  //   `<span>` +
                  //   messageInfo +
                  //   "</span>",
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-right',
                  type: 'warning',
                  onClick() {
                    that.$router.push({
                      path: '/risk/campusPeriphery/campusPeriphery',
                      query: { id: that.notifyId },
                    });
                  },
                });
              } else if (str.indexOf('crowd') > -1) {
                // 位置更新
                var str2 = str;
                var strArray = str2.split('_');
                const riskCrowdAlarmId = strArray[3];

                // 获取人群抓拍列表
                that
                  .$http({
                    url: that.$http.adornUrl('/vcm/riskCrowdAlarm/info'),
                    method: 'get',
                    params: that.$http.adornParams({
                      id: riskCrowdAlarmId,
                    }),
                  })
                  .then(({ data }) => {
                    // console.log(data)
                    if (data && data.code === 0) {
                      that.riskCrowdAlarmList = data.riskCrowdAlarm;
                      let messageInfo = '';
                      if (that.riskCrowdAlarmList) {
                        messageInfo = `<div style='display:flex;padding-right:2vw'><img style='margin-right:1vw;width:50px;height:50px' src=${
                          that.backgroundURL
                        }${that.riskCrowdAlarmList.picVehicle
                        }></img><span style='width:170px'>在${
                          that.riskCrowdAlarmList.cameraName
                        }人群密度已达到${
                          that.riskCrowdAlarmList.crowdCount
                        }</span></div>`;
                      } else {
                        messageInfo = '抓拍数据有误';
                      }
                      // 列表
                      that.$notify.info({
                        title: '有新的抓拍数据',
                        dangerouslyUseHTMLString: true,
                        message: messageInfo,
                        position: 'bottom-right',
                        duration: 0,
                        onClick() {
                          that.dialogCrowdAlarmVisible = true;
                        },
                      });
                      this.wordsToVoice(messageInfo);
                    } else {
                      this.$message({
                        type: 'error',
                        message: data.msg,
                      });
                    }
                  });
              }
            }
          },
        );
        that.stompClient.subscribe(
          `/topic/${that.$store.state.user.id}/message`,
          (response) => {
            const str = response.body;
            const obj = JSON.parse(str);

            const messageInfo = `<div style='padding-right:2vw;width: 260px;height: 50px;white-space:nowrap; text-overflow:ellipsis; overflow: hidden;'><span style='width:170px;'>${
              obj.name
            }回复了内容${
              obj.content
            }</span></div>`;
            // alert(messageInfo)
            that.$notify({
              title: '有新的回复信息',
              message: messageInfo,
              dangerouslyUseHTMLString: true,
              position: 'bottom-right',
              type: 'warning',
              duration: 0,
              onClick() {
                that.dialogSMSVisible = true;
                that
                  .$http({
                    url: that.$http.adornUrl(
                      '/message/messageinfor/queryPageByPhoneThreeDay',
                    ),
                    method: 'get',
                    params: that.$http.adornParams({
                      phone: obj.phone,
                    }),
                  })
                  .then(({ data }) => {
                    if (data && data.code === 0) {
                      that.oneList = data.page.list;
                      that.total = data.page.totalCount;
                    } else {
                      that.oneList = [];
                      that.total = 0;
                      this.$message.error(data.msg);
                    }
                  });
              },
            });
          },
        );
        this.stompClient.subscribe(
          '/topic/icp/CtiNotify',
          (msg) => {
            // 根据返回来的信息分别处理
            const message = msg;
            const msgBody = JSON.parse(message.body);
            console.log(message);
            console.log(msgBody);
            // 事件通知弹窗
            // 信息处置-事件接报-信息核实-刷新核实列表
            if (msgBody.cmd && msgBody.cmd.SubCmd == "131") {
              const msgData = {
                contactorName: msgBody.contactorName,
                SubCmd: msgBody.cmd.SubCmd,
                datetime: msgBody.datetime,
                eventName: msgBody.eventName,
              };
              bus2.$emit('informationVerification', msgData);
            }
          },
        );
      });

      // 推送备忘录提醒
      // 建立连接对象
      const memoSocket = new SockJS(`${window.SITE_CONFIG.websocketUrl}/endpointOyzc`);
      // 获取STOMP子协议的客户端对象
      this.memoClient = Stomp.over(memoSocket);
      // 定义客户端的认证信息,按需求配置
      const headers = {
        Authorization: '',
      };
      // 向服务器发起websocket连接
      this.memoClient.connect(
        headers,
        () => {
          this.memoClient.subscribe(
            '/topic/memo',
            (msg) => {
              console.log('/topic/memo msg', msg);
              // 根据返回来的信息分别处理
              const message = msg;
              const msgBody = JSON.parse(message.body);
              console.log(message);
              console.log(msgBody);
              // 备忘录通知
              this.$notify({
                title: '备忘录提醒',
                position: 'bottom-right',
                dangerouslyUseHTMLString: true,
                message: `
                          <div style="font-size:16px;">
                                <h3 style="text-align: center;color: blue">标题:${msgBody.vcTitle}</h3>

                                 <div style="height:400px;white-space: pre-wrap;text-indent:2em;margin: 0;word-break:break-all;text-align:left;">
                                   <el-scrollbar class='page-component__scroll'>
                                          ${msgBody.vcMemo}
                                   </el-scrollbar>
                                 </div>

                          </div>
                          `,
                duration: 0,
              });
            },
            headers,
          );
        },
        () => {},
      );
    },
    // 1734 【基线】APP上报事件后，无上报信息提示，需要完善信息提醒功能
    getAppEventList(noticeId, title) {
      const that = this;
      this.$notify({
        customClass: 'messageTip',
        title: '您有一条新消息',
        dangerouslyUseHTMLString: true,
        message: `<div class="messageTipDiv">
                            <div>收到APP上报的事件“${title}”</div>
                            <div>
                              <div id="APPiglore">关闭</div>
                              <div>查看</div>
                              </div>
                            </div>`,
        duration: 0,
        position: 'bottom-right',
        onClick: () => {
          this.$refs.AppEventRef.showDetail(noticeId);
          document.getElementById('APPiglore').onclick = () => {
            that.$notify.closeAll();
          };
        },
        onClose: () => {
          document.getElementById('APPiglore').onclick = () => {
            that.$notify.closeAll();
          };
        },
      });
    },
    getTaskList() {
      const that = this;
      that.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/event/event/task/getUserUnalertTask`,
        method: 'GET',
        params: {
        },
      }).then((res) => {
        that.tasklist = res.data.data;
        res.data.data.forEach(el => {
          that.openTaskWindow(el);
        });
      });
    },
    // 开任务窗
    openTaskWindow(item) {
      const that = this;
      let tipNum = 5;
      clearInterval(that.taskTimer);
      this.$notify({
        customClass: 'messageTip',
        title: '告警提醒',
        dangerouslyUseHTMLString: true,
        message: `<div class="messageTipDiv">
                    <div>您有任务“${item.title}”即将超时，请尽快处理！</div>
                    <div>
                      <div id="ignoreTask">忽略（${tipNum}S）</div>
                      <div>查阅任务</div>
                      </div>
                    </div>`,
        duration: 5000,
        position: 'bottom-right',
        onClick: () => {
          that.jump(item);
        },
        onClose: () => {
          clearInterval(that.taskTimer);
        },
      });
      this.$nextTick(() => {
        document.getElementById('ignoreTask').onclick = this.$notify.close();
      });
      that.taskTimer = setInterval(() => {
        tipNum -= 1;
        document.getElementById('ignoreTask').innerHTML = `忽略（${tipNum}S）`;
        if (tipNum === 0) {
          document.getElementById('ignoreTask').innerHTML = '忽略';
          clearInterval(that.taskTimer);
          return false;
        }
      }, 1000);
    },
    // 跳到任务
    jump(event) {
      this.$router.push({
        path: "/TaskManager",
        query: {
          event: event,
          isJump: true,
        },
      });
    },
    // 断开
    disconnect() {
      if (this.globalStompClient.connected === false) {
        this.globalStompClient.disconnect();
      }
      if (this.memoClient) {
        this.memoClient.disconnect();
      }
    },
    // 每页数
    handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      this.getConactsList();
    },
    // 当前页
    handleCurrentChange(val) {
      this.page = val;
      this.getConactsList();
    },
    /**
     * @author hexinting
     * @date 2020-11-12
     * @lastEditor hexinting
     * @lastDate 2020-11-12
     * @description 登录成功后获取融合通讯分组
     */
    contactorGroupsFromDictionary() {
      this.$api.contactorGroupsFromDictionary().then((res) => {
        if (res.errorcode === 0) {
          sessionStorage.setItem('contactorGroups', JSON.stringify(res.data));
        }
        console.log('获取融合通讯分组', res);
      });
    },
    // 点击licence过期弹窗
    updateLience() {
      let licenceDate = JSON.parse(sessionStorage.getItem('licenceDate'));
      console.log(licenceDate);
      // 0-是否过期 1-过期日期 2-剩余天数
      this.$refs.licenceDialog.initInfo(licenceDate[0], licenceDate[1], licenceDate[2]);
    },
    // 更新licence过期时间
    timeDiff(resDate) {
      let resDate2 = resDate.replace('年', '-');
      resDate2 = resDate2.replace('月', '-');
      resDate2 = resDate2.replace('日', ' 24:00:00');

      let todayDate = new Date().getTime(); // 现在时间
      let validDate = new Date(resDate2).getTime(); // 结束时间

      // 结束时间 - 现在时间 > 0 则没过期
      let nowDiff = validDate - todayDate
      let diffDate = ''
      console.log(resDate2, todayDate, validDate, nowDiff) 
      // 未过期
      if (nowDiff >= 0) {
        diffDate = Math.floor(nowDiff / 1000 / 60 / 60 / 24); // 剩余天数
        // 还有30天过期时 弹出提示框
        if (diffDate <= 30) {
          this.$nextTick(() => {
            let licenceDate = JSON.stringify([false, resDate, diffDate]);
            this.licenceDate = JSON.parse(licenceDate)
            sessionStorage.setItem('licenceDate', licenceDate); // 存储过期时间
          });
        } else {
          let licenceDate = JSON.stringify(['normal', '', '']);
          sessionStorage.setItem('licenceDate', licenceDate);
          this.licenceDate = JSON.parse(licenceDate)
        }
      } else {
        // 过期了几天
        diffDate = Math.floor(Math.abs(nowDiff) / 1000 / 60 / 60 / 24); // 剩余天数
        this.$nextTick(() => {
          let licenceDate = JSON.stringify([true, resDate, diffDate]);
          sessionStorage.setItem('licenceDate', licenceDate);
          this.licenceDate = JSON.parse(licenceDate)
          // this.$refs.licenceDialog.initInfo(true, resDate, diffDate);
        });
      }
    }
  },
};
</script>
<style lang="scss">
// .el-checkbox__inner {
//   // border: 1px solid rgba(0, 0, 0, 0.5);
// }
.notify__red-icon {
    /deep/ .el-icon-info {
        color: red;
    }
}
</style>
<style lang="scss" scoped>
>>> .el-tabs__header.is-top {
    padding: 0px;
}

.clearfloat {
    display: flex;
}
.cardClass {
    padding: 3px;
    border: 1px solid rgba(230, 230, 230, 1);
    width: 100%;
    min-width: 540px;
}
ul {
    margin: 0;
    padding: 0;
}
ul li {
    list-style: none;
}
.list {
    display: flex;
    justify-content: space-between;
    align-content: space-between;
    padding: 0px 10px 0px 10px;
    flex-wrap: wrap;
}
.list:after {
    content: '';
    width: 65%;
    border: 1px solid transparent;
}
.colStaff {
    width: 65%;
    min-width: 550px;
    padding: 5px;
    height: 200px;
    position: relative;
    margin-top: 5px;
    border: 1px solid #555;
    display: flex;
    > div {
        display: flex;
        margin-left: 10px;
    }
    .right {
        ul {
            padding-left: 10px;
            padding-top: 30px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            li {
                line-height: 28px;
                text-align: left;
                label {
                    overflow: hidden; /*自动隐藏文字*/
                    text-overflow: ellipsis; /*文字隐藏后添加省略号*/
                    white-space: nowrap; /*强制不换行*/
                    width: 12em;
                    display: inline-block;
                }
            }
        }
    }
    .left {
        margin-top: 16px;
        border: 1px solid #555;
        .el-image {
            img {
                width: 3vh;
                height: 100%;
            }
        }
    }
}
.el-notification {
    z-index: 999;
}
.el-notification__title {
    margin-left: 20px;
}
h2 {
    margin-right: 20px;
}
.el-notification .el-notification__group .el-notification__title {
    margin-left: 20px;
}

.site-content /deep/ .dutyLog {
    min-height: 825px !important;
}
.site-content /deep/ .combined {
    min-height: 825px !important;
}
.content {
    height: 550px;
    padding: 5px 30px;
    background-color: #f4f4f4;
    // overflow-x: hidden;
    box-sizing: border-box;
    ul {
        li {
            padding: 5px 5px 30px 5px;
            background-color: cornflowerblue;
            border-radius: 5px;
            margin-bottom: 10px;
            p {
                margin: 5px;
                font-size: 14px;
                font-weight: bold;
                // text-indent: 1em;
            }
        }
    }
}
.site-content /deep/ .page-container.el-card {
    border: none;
    padding: 0;
    background-color: #f4f4f4;
}
.site-content /deep/.page-container > .el-card__body {
    padding: 10px !important;
    height: calc(100vh - 92px);
    overflow: auto;
    background-color: #f4f4f4;
}
.bestBigWrap /deep/ .el-tabs__header {
    min-height: 40px;
}
.bestBigWrap /deep/ .el-tabs__nav-scroll {
    margin: 0 !important;
}

body
    > div.site-wrapper.mainWrap
    > div
    > main
    > div.el-tabs.el-tabs--top
    > div.el-tabs__content
    > div.site-tabs__tools.el-dropdown {
    margin: 0;
}

.backHome {
    position: absolute;
    z-index: 9999;
    top: 0px;
    left: 14px;
    width: 16px;
    height: 14px;
}
.backHome > img {
    width: 100%;
    height: 100%;
}
.bestBigWrap /deep/ .el-tabs__item {
    padding: 0 15.23px 0 16px !important;
    font-size: 12px;
    .el-icon-close {
        margin-left: 7.18px;
        &:hover {
            background-color: #aebfce;
        }
    }
}
.bestBigWrap /deep/ .el-table--fit {
    box-shadow: 0px 3px 10px 0px rgba(211, 214, 216, 0.91);
    border-radius: 3px;
}
// 表格标题样式
.bestBigWrap /deep/ .el-table th > .cell {
    text-align: center;
    color: #333333;
    font-size: 14px;
    font-weight: bold;
}
.bestBigWrap /deep/ .el-table {
    font-size: 13px;
}
.bestBigWrap /deep/ .el-table__row {
    color: #666666;
}
.bestBigWrap /deep/ .el-table {
    color: red;
}
// 表格边框样式
.bestBigWrap /deep/ .el-table td,
.el-table th,
.el-table--border,
.el-table--group {
    border-color: #f2f2f2;
    // border-color: #c9dcfe;
}

// 表格头部背景样式
.bestBigWrap /deep/ .el-table th {
    background-color: #f9fcff;
}
// 表格鼠标滑过样式
.bestBigWrap /deep/ .el-table__body tr:hover > td {
    background: rgba(255, 255, 255, 1);
}
.bestBigWrap /deep/ .el-table__body tr.current-row > td {
    background: rgba(255, 255, 255, 1);
}
// .bestBigWrap /deep/ .el-table--enable-row-hover .el-table__body tr:hover {
//     box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.12);
// }
// 表格鼠标滑过样式第一列样式
.bestBigWrap /deep/ .el-table__body tr:hover > td:nth-child(1) {
    border-left: 3px solid #0091ff;
}
// 表格鼠标滑过样式第一列样式
.bestBigWrap /deep/ .el-table__body tr.current-row > td:nth-child(1) {
    border-left: 3px solid #0091ff;
}
// 表格滚动条
.bestBigWrap /deep/ .el-table--scrollable-x .el-table__body-wrapper,
.el-table--scrollable-y .el-table__body-wrapper {
    // &::-webkit-scrollbar {
    //     width: 10px;
    //     height: 10px;
    //     /**/
    // }
    // &::-webkit-scrollbar-track {
    //     background: rgb(239, 239, 239);
    //     border-radius: 2px;
    // }
    // &::-webkit-scrollbar-thumb {
    //     background: #bfbfbf;
    //     border-radius: 10px;
    // }
    // &::-webkit-scrollbar-corner {
    //     background: #179a16;
    // }
}
.bestBigWrap
    /deep/
    .el-tabs__header
    .el-tabs__nav-wrap
    .el-tabs__nav-scroll
    .el-tabs__nav
    .el-tabs__item.is-top.is-closable.is-active,
.el-tabs__header
    .el-tabs__nav-wrap
    .el-tabs__nav-scroll
    .el-tabs__nav
    .el-tabs__item.is-top.is-active {
    color: #0091ff;
    letter-spacing: 1px;
}
.bestBigWrap
    /deep/
    .el-tabs__header
    .el-tabs__nav-wrap
    .el-tabs__nav-scroll
    .el-tabs__nav
    .el-tabs__active-bar {
    display: none;
}
.bestBigWrap /deep/ .el-tabs__nav-prev,
.bestBigWrap /deep/ .el-tabs__nav-next {
    display: block;
}

// 分页居右显示
.bestBigWrap /deep/ .el-pagination {
    justify-content: flex-end;
}
// 分页点击后的样式
.bestBigWrap /deep/ .el-pager li.active {
    background: #0091ff;
    color: #fff;
}
// 分页鼠标进入时的样式
.bestBigWrap /deep/ .el-pager li:hover {
    color: #0091ff;
    // background: #DDDEE1;
}
// 每一页的样式
.bestBigWrap /deep/ .el-pager li {
    border: 1px solid #dddee1;
    margin-right: 10px;
    min-width: 30px;
    // height: 30px;
    border-radius: 2px;
    text-align:center !important;
}
.bestBigWrap /deep/ .el-pager li:last-child {
    margin: 0;
}
// 下一页样式
.bestBigWrap /deep/ .btn-prev,
.bestBigWrap /deep/ .btn-next {
    border: 1px solid #dddee1;
    padding: 0;
    border-radius: 2px;
    margin: 0 5px 0 10px;
}
// 上一页样式
.bestBigWrap /deep/ .btn-prev {
    border: 1px solid #dddee1;
    padding: 0;
    margin-right: 10px;
}
// 上、下一页点击后的样式
// .bestBigWrap /deep/ .el-pagination button:hover {
//     color: #0091ff;
// }
// .bestBigWrap /deep/ .el-icon-arrow-up::before {
//     content: '';
//     width: 16px;
//     height: 22px;
//     display: inline-block;
//     background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAGhklEQVR4Xu3dP26cVRTG4bGEaNgIC6BMQ4+ElBWkYlmkpEqyA0xBSZS1IHqMC0cKlj0Zv/P9ufd7H/qjzPmdeXQNWHBz8pcCCjxb4EYbBRR4vgAgvh0KnCkAiK+HAoD4DiiQFfCCZN1MlRQApOTQ1swKAJJ1M1VSAJCSQ1szKwBI1s1USQFASg5tzawAIFk3UyUFACk5tDWzAoBk3UyVFACk5NDWzAoAknUzVVIAkJJDWzMrAEjWzVRJAUBKDm3NrAAgWTdTJQUAKTm0NbMCgGTdTJUUAKTk0NbMCgCSdTNVUgCQkkNbMysASNbNVEkBQEoObc2sACBZN1MlBQApObQ1swKAZN1MlRQApOTQ1swKAJJ1M1VSAJCSQ1szKwBI1s1USQFASg5tzawAIFk3UyUFACk5tDWzAoBk3UyVFACk5NDWzAoAknUzVVIAkJJDWzMrAEjWzVRJAUBKDm3NrAAgWTdTJQUAKTm0NbMCgGTdTJUUAKTk0NbMCgCSdTNVUgCQkkNbMysASNbNVEkBQEoObc2sACBZN1MlBQApObQ1swKAZN1MlRQApOTQ1swKAJJ1M1VSAJCSQ1szKwBI1s1USQFASg5tzawAIFk3UyUFACk5tDWzAoBk3UyVFACk5NDWzAoAknUzVVIAkJJDWzMrAEjWzVRJAUAGO/T7279evf7xhz8H+1i1HweQgU7//o9Pv57u7l6fTv/+BMkYhwFkjDuc3t1+fHtzunnz8HH+hmSMwwAywB0e4fj8iSAZ4DaA7HyEZ3BAsvNdPv/xgOx4iK/ggGTH2wCyc/wLcUCy8528IDsc4IU4INnhRl6QnaKHOCDZ6V5ekA3DX4kDkg1v5QXZOPZCOCDZ+G5ekA2CL4wDkg1u5gXZKPJKOCDZ6H5ekBVDr4wDkhVv5wVZOe5GOCBZ+Y5ekBUCb4wDkhVu6AVZKepOOCBZ6Z5ekAXD7owDkgVv6QVZOOYgOCBZ+K5ekAWCDoYDkgVu6gVZKOKgOCBZ6L5ekCtCDo4Dkitu6wW5Mt4kOCC58s5ekCDgZDggCW7sBQmjTYoDkvDeXpAXhJscByQvuLUX5IWxDoIDkhfe3QtyQbCD4YDkgpt7QS6MdFAckFx4fy/ImVAHxwHJBUgAeSZSCQ5IvoIEkCcCleGA5AwSQB7FKcUByTNIAPkiTDkOSJ5AAshDFDj+9+3wv154yAHIfQg4nvz5ApL7LPVA4Dj7j3HqkVQDgeOCfxFwOlUjqQUCx0U46v/GvRIIHC/CUY2kDggcEY5aJFVA4LgKRyWSGiBwLIKjDkkFEDgWxVGF5PBA4FgFRw2SQwOBY1UcFUgOCwSOTXAcHskhgcCxKY5DIzkcEDh2wXFYJIcCAseuOA6J5DBA4BgCx+GQHALIh9uPb+9ON2+G+or4MIf4LeDpgcAxtMTpkUwNBI6hcRzix61pgcAxBY7pkUwJBI6pcEyNZDogcEyJY1okUwGBY2ocUyKZBggch8AxHZIpgMBxKBxTIRkeCByHxDENkqGBwHFoHFMgGRbIh9tP978+cufXRyqMjPsfpxsSCBwdKh5tOeSvpQwHBI5KHMP+uDUUEDiqcQyJZBggcMDxRYFhftwaAsi73z/+4uuhwOMC33z73W8/v/r+nz3LDAFkzwD+bAXOFQDE90OBMwUA8fVQABDfAQWyAl6QrJupkgKAlBzamlkBQLJupkoKAFJyaGtmBQDJupkqKQBIyaGtmRUAJOtmqqQAICWHtmZWAJCsm6mSAoCUHNqaWQFAsm6mSgoAUnJoa2YFAMm6mSopAEjJoa2ZFQAk62aqpAAgJYe2ZlYAkKybqZICgJQc2ppZAUCybqZKCgBScmhrZgUAybqZKikASMmhrZkVACTrZqqkACAlh7ZmVgCQrJupkgKAlBzamlkBQLJupkoKAFJyaGtmBQDJupkqKQBIyaGtmRUAJOtmqqQAICWHtmZWAJCsm6mSAoCUHNqaWQFAsm6mSgoAUnJoa2YFAMm6mSopAEjJoa2ZFQAk62aqpAAgJYe2ZlYAkKybqZICgJQc2ppZAUCybqZKCgBScmhrZgUAybqZKikASMmhrZkVACTrZqqkACAlh7ZmVgCQrJupkgKAlBzamlkBQLJupkoKAFJyaGtmBQDJupkqKQBIyaGtmRUAJOtmqqQAICWHtmZWAJCsm6mSAoCUHNqaWQFAsm6mSgoAUnJoa2YFAMm6mSopAEjJoa2ZFfgPO0vt2E5LOWUAAAAASUVORK5CYII=');
//     background-size: 100% 100%;
//     margin-top: 4px;
// }
// .bestBigWrap /deep/ .el-input--medium .el-input__inner{
//   height: 30px;
//   line-height: 30px;
// }
// .bestBigWrap /deep/ .el-pagination .el-select .el-input {
//   // width: 85px;
// }
.bestBigWrap .el-pagination .el-select .el-input .el-input__inner {
    padding-right: 28px;
}
.bestBigWrap
    /deep/
    .el-tabs__header
    .el-tabs__nav-wrap
    .el-tabs__nav-scroll
    .el-tabs__nav
    .el-tabs__item.is-top.is-closable.is-active,
.el-tabs__header
    .el-tabs__nav-wrap
    .el-tabs__nav-scroll
    .el-tabs__nav
    .el-tabs__item.is-top.is-active {
    background: #f4f7fe;
}
.bestBigWrap {
    padding: 40px 0 0 !important;
}
.el-card.is-always-shadow,
.el-card.is-hover-shadow:focus,
.el-card.is-hover-shadow:hover {
    box-shadow: none;
}
// 时间图标位置调整
.bestBigWrap /deep/ .el-range-editor--medium .el-range__icon {
    position: absolute;
}
.bestBigWrap /deep/ .el-range-editor--medium input:nth-of-type(1) {
    margin-left: 10px;
}
// 时间 至的间隔
.bestBigWrap /deep/ .el-date-editor .el-range-separator {
    padding: 0;
    padding-right: 17px;
    margin-top: -4px;
}
// 时间插件高度
// .bestBigWrap /deep/ .el-range-editor--medium.el-input__inner {
//   // height: 30px;
//   // vertical-align: sub;
// }
// 表格删除图标
.bestBigWrap /deep/ .delete {
    width: 13.99px;
    height: 15.96px;
    cursor: pointer;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAYAAADUFP50AAAA3klEQVQ4T92RvwrCQAzG8x2o6KSzgo9RN919AiepD+EktIiLL9F2dvIVnGzfQkFnHYvIxbvTSitH/TOa5ZLv8ktCAspZlPCQmVdKauR15acEjFwH60yHdlSyeaOYPAJ7L5AJQZiPHfKNDzDCmHcK7dqSS7S96fSLPcEwlidVoFlaBHR2HdG6j/4wBfInnd2eMIwVFBIdKfigE2QVbXHhY1a0FNSf2QR5X8P/An61nGArU4Bqb06SquXUC+cIEl6AearEig1mpisJLCcOZgVQB77Pot8nYQM3A5I+ILO/G5ycfVVJ+YuqAAAAAElFTkSuQmCC')
        no-repeat;
    background-size: 13.99px 15.96px;
}
.bestBigWrap /deep/ .delete:hover {
    width: 13.99px;
    height: 15.96px;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAYAAADUFP50AAAAxElEQVQ4T92RwQ4BMRCG/1kR4cSZxAN5Ak+xcXGSaMTFsfsYTh6JxJ459kDHtJuuXcriaJK203/6TdsZQtUynoCxFalX0wEDiylmtAs6eYe5WDMsZXbj2RgrpFA+QCSA5r244+jh1+KhuOkHu4OaT8L3G3KckdLAv7Y8qJk/ujglz8TBK0Zo4egTJRhKRfMy6VvQBcMLqr6j/wX8sjhGvt5paImR4nQf27EWYS6jHYUZF2neRsBFHXQ7xYnvXNwsFNkQugETZ1iAkW3B2QAAAABJRU5ErkJggg==')
        no-repeat;
    background-size: 13.99px 15.96px;
}
// 表单文字颜色
.bestBigWrap /deep/ .el-form-item__label {
    color: #333;
}
.main_tabs /deep/ .el-tabs__header {
    padding: 0 0 0 0;
}
</style>
<style lang="less">
  .messageTip {
    width: 267px;
    height: 159px;
    background: #ffffff !important;
    -webkit-box-shadow: 0px 4px 14px 3px rgb(44 45 46 / 16%);
    box-shadow: 0px 4px 14px 3px rgb(44 45 46 / 16%);
    border-radius: 6px 6px 0px 0px;
    margin: 0;
    padding: 0;
    :global(.el-notification__group) {
      margin: 0 !important;
      width: 100%;
      :global(.el-notification__title) {
        font-size: 17px;
      font-weight: 400;
      color: #323233;
      height: 42px;
      background: #F1F4F6;
      border-radius: 6px 6px 0px 0px;
      line-height: 42px;
      padding-left: 10px;
      }
      :global(.el-notification__closeBtn) {
        top: 7px;
        right: 0;
      }
      :global(.el-icon-close:before) {
        content: "\E6DB";
        color: #000;
        font-size: 20px;
      }
    }
    .messageTipDiv {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      & > div:nth-child(1) {
        font-weight: 400;
        color: #646566;
        font-size: 17px;
        height: 48px;
        text-align: center;
        line-height: 48px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      & > div:nth-child(2) {
        display: flex;
        justify-content: center;
        & > div:nth-child(1) {
          width: 90px;
          height: 30px;
          background: #ffffff;
          border-radius: 4px;
          border: 1px solid #dedede;
          color: #000;
          text-align: center;
          line-height: 30px;
        }
        & > div:nth-child(2) {
          width: 73px;
          height: 30px;
          background: #0091ff;
          border-radius: 4px;
          text-align: center;
          line-height: 30px;
        }
      }
    }
  }
  .site-tabs__warn {
    display: flex;
    align-items: center;
    position: fixed;
    top: 50px;
    right: 45px;
    z-index: 931;
    height: 40px;
    padding: 0 5px;
    /* font-size: 16px; */
    line-height: 40px;
    cursor: pointer;
    z-index: 931;
    color: red;
  }
  .el-icon-warning {
    padding: 0 5px;
  }
  .updateLience {
    margin-left: 5px;
    color: #0091ff;
  }
</style>
