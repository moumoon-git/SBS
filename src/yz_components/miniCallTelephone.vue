<template>
  <div
    ref="miniDailog"
    :class="
      'modelBox ' +
      (isCallType == 'callIng' &&
      isMissedCalls == true &&
      isCallPhone == 'hangUp'
        ? 'modelBox_missCall'
        : '')
    "
    @mousedown="mouseDownHandleelse($event)"
    @mouseup="mouseUpHandleelse($event)"
  >
    <!--呼入-->
    <div v-if="isCallType == 'callIng'">
      <!--未接-->
      <div
        class="miniPlanMissCalls"
        v-if="
          isCallType == 'callIng' &&
          isMissedCalls == true &&
          isCallPhone == 'hangUp'
        "
      >
        <div class="missCallHeader">
          未接来电
          {{
            answerList !== undefined && answerList !== null
              ? " （" + answerList.length + "）"
              : " （" + 0 + "）"
          }}
        </div>
        <i
          class="el-icon-close"
          style="
            position: absolute;
            right: 10px;
            top: 5px;
            color: #fff;
            cursor: pointer;
          "
          @click="colseMini"
        ></i>
        <div style="padding: 15px 20px">
          <el-scrollbar style="height: 410px">
            <div>
              <div v-for="(item, index) in answerList" :key="item.id">
                <div
                  class="answerContentList"
                  :class="index == IDX ? 'hover' : ''"
                  @click="clickAnswerList(item, index)"
                >
                  <template v-if="item.contactor">
                    <div
                      style="flex: 1"
                      :style="index == IDX ? whiteStyle : redStyle"
                    >
                      {{ item.contactor }}
                    </div>
                    <div style="flex: 2">
                      <div>{{ item.position }}</div>
                      <div>{{ item.unit }}</div>
                    </div>
                  </template>
                  <template v-else>
                    <div
                      style="flex: 3;display:flex;flex-direction:column;"
                      :style="index == IDX ? whiteStyle : redStyle"
                    >
                      <span>{{ item.phone }}</span>
                      <span :style="index == IDX ? whiteStyle : blackStyle">{{ item.attribution }}</span>
                    </div>
                  </template>
                  <div style="flex: 1.5; font-size: 13px">{{ item.time }}</div>
                </div>
              </div>
            </div>
          </el-scrollbar>
          <div class="bottomPlan">
            <el-button type="success" size="mini" @click="goCallPhone"
              >回拨</el-button
            >
            <el-button type="danger" size="mini" @click="allClear"
              >全部清除</el-button
            >
          </div>
        </div>
      </div>
      <div
        v-else
        class="miniPlanCallIng"
        :class="[
          isCallPhone == 'call'
            ? basicsData.important != 'leader'
              ? 'miniCallBack'
              : 'miniCallBackLeader'
            : isCallPhone == 'talking'
            ? basicsData.important != 'leader'
              ? 'miniCallTelephone'
              : 'miniCallTelephoneLeader'
            : basicsData.important != 'leader'
            ? 'miniCallUp'
            : 'miniCallUpLeader',
        ]"
      >
        <div style="padding: 20px">
          <!--个人信息-->
          <div class="messagePlan">
            <div
              style="
                font-size: 17px;
                font-weight: 500;
                color: rgba(255, 255, 255, 1);
                display: flex;
              "
            >
              <img
                miniCallTelephone
                :src="
                  basicsData.picture
                    ? basicsData.picture.search('http') == -1
                      ? $window.g.ApiUrl + basicsData.picture
                      : basicsData.picture
                    : 'static/img/headless.png'
                "
                style="width: 60px; height: 60px; margin-left: 20px"
              />
              <span
                style="
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                "
                :title="basicsData.name || '未知'"
                >{{ basicsData.name || "未知" }}</span
              >
              <span
                style="
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                "
                :title="basicsData.position"
                v-if="basicsData.position"
                >({{ basicsData.position }})</span
              >
              <span
                style="
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  position: absolute;
                  top: 23%;
                  left: 33%;
                  width: 178px;
                "
                :title="basicsData.workUnit"
                v-if="basicsData.workUnit"
                >{{ basicsData.workUnit }}</span
              >
            </div>
            <!-- <div
              style="font-size:14px;font-weight:400;color:rgba(255,245,245,1);"
            >{{basicsData.workUnit}}</div>-->
            <i
              class="el-icon-minus"
              style="
                position: absolute;
                right: 30px;
                top: 18px;
                color: #fff;
                cursor: pointer;
              "
              v-if="isCallPhone == 'talking' || isCallPhone == 'call'"
              @click="setToMini"
            ></i>
            <i
              class="el-icon-close"
              style="
                position: absolute;
                right: 30px;
                top: 18px;
                color: #fff;
                cursor: pointer;
              "
              v-if="isCallPhone == 'hangUp' || isCallPhone == ''"
              @click="colseMini"
            ></i>
          </div>
          <!--号码-->
          <div class="numberPlan">
            <div class="numberAffilation">
              <div style="padding-right: 10px">{{ basicsData.phone }}</div>
              <div style="padding-left: 10px">{{ provincial }} {{ city }}</div>
            </div>
            <div class="callStatus" v-if="isCallPhone !== 'hangUp'">
              {{
                isCallPhone == "call"
                  ? "来电..."
                  : isCallPhone == "talking"
                  ? timer
                  : ""
              }}
            </div>
            <div
              class="callStatus"
              v-if="isCallPhone == 'hangUp' && audios[0].url !== ''"
            >
              <div
                v-if="audios[0].url !== ''"
                v-for="(item, index) in audios"
                :key="index"
                style="
                  width: 205px;
                  height: 30px;
                  position: absolute;
                  top: 111px;
                  left: 50px;
                "
              >
                <vue-audio
                  :theUrl="item.url"
                  :theControlList="item.controlList"
                ></vue-audio>
              </div>
            </div>
          </div>

          <!--挂断-->
          <div
            class="audioImg"
            v-if="isCallPhone == 'hangUp' && audios[0].url !== ''"
          >
            <div class="item audioToTxt">
              <span class="item_text">语音转文字</span>
              <img
                src="/static/img/phoneCallImg/audioToText_mini.jpg"
                @click="audioToTxt"
              />
            </div>
            <div class="item audioDownload">
              <span class="item_text">下载</span>
              <img
                src="/static/img/phoneCallImg/download_mini.png"
                @click="audioDownload"
              />
            </div>
            <div class="item audioRemark">
              <span class="item_text">备注</span>
              <img
                src="/static/img/phoneCallImg/remark_mini.jpg"
                @click="audioRemark"
              />
            </div>
            <div class="item audioRelevance">
              <span class="item_text">关联事件</span>
              <img
                src="/static/img/phoneCallImg/relatedEvents_mini.jpg"
                @click="audioRelevance"
              />
            </div>
          </div>

          <!--来电-->
          <div class="bottomPlan" v-if="isCallPhone == 'call'">
            <el-button type="success" size="mini" @click="answerPhone"
              >接听</el-button
            >
            <el-button type="danger" size="mini" @click="hangUp"
              >拒接</el-button
            >
          </div>

          <!--接通-->
          <div class="bottomPlan" v-if="isCallPhone == 'talking'">
            <el-button type="danger" size="mini" @click="hangUp"
              >挂机</el-button
            >
            <el-button
              type="success"
              size="mini"
              @click="clickReports"
              v-if="!this.isShenShanProject"
              >智能接报</el-button
            >
          </div>
        </div>
      </div>
    </div>

    <!--呼出-->
    <div
      class="miniPlanCallOut"
      v-if="isCallType == 'callOut'"
      :class="[
        isCallPhone == 'call'
          ? basicsData.important != 'leader'
            ? 'miniCallToBack'
            : 'miniCallToBackLeader'
          : isCallPhone == 'talking'
          ? basicsData.important != 'leader'
            ? 'miniCallTelephone'
            : 'miniCallTelephoneLeader'
          : basicsData.important != 'leader'
          ? 'miniCallUp'
          : 'miniCallUpLeader',
      ]"
    >
      <div style="padding: 20px">
        <!--个人信息-->
        <div class="messagePlan">
          <div
            style="
              font-size: 17px;
              font-weight: 500;
              color: rgba(255, 255, 255, 1);
              display: flex;
            "
          >
            <img
              miniCallTelephone
              :src="
                basicsData.picture
                  ? basicsData.picture.search('http') == -1
                    ? $window.g.ApiUrl + basicsData.picture
                    : basicsData.picture
                  : 'static/img/headless.png'
              "
              style="width: 60px; height: 60px; margin-left: 20px"
            />
            <span
              style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
              :title="basicsData.name || '未知'"
              >{{ basicsData.name || "未知" }}</span
            >
            <span
              style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
              :title="basicsData.position"
              v-if="basicsData.position"
              >({{ basicsData.position }})</span
            >
            <span
              style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                position: absolute;
                top: 23%;
                left: 33%;
                width: 178px;
              "
              :title="basicsData.workUnit"
              v-if="basicsData.workUnit"
              >{{ basicsData.workUnit }}</span
            >
          </div>
          <!-- <div
            style="font-size:14px;font-weight:400;color:rgba(255,245,245,1);"
          >{{basicsData.workUnit}}</div>-->
          <i
            class="el-icon-minus"
            style="
              position: absolute;
              right: 30px;
              top: 18px;
              color: #fff;
              cursor: pointer;
            "
            v-if="isCallPhone == 'talking' || isCallPhone == 'call'"
            @click="setToMini"
          ></i>
          <i
            class="el-icon-close"
            style="
              position: absolute;
              right: 30px;
              top: 18px;
              color: #fff;
              cursor: pointer;
            "
            v-if="isCallPhone == 'hangUp' || isCallPhone == ''"
            @click="colseMini"
          ></i>
        </div>
        <!--号码-->
        <div class="numberPlan">
          <div class="numberAffilation">
            <div style="padding-right: 10px">{{ basicsData.phone }}</div>
            <div style="padding-left: 10px">{{ provincial }} {{ city }}</div>
          </div>
          <div class="callStatus" v-if="isCallPhone !== 'hangUp'">
            {{
              isCallPhone == "call"
                ? "正在呼叫..."
                : isCallPhone == "talking"
                ? timer
                : ""
            }}
          </div>
          <div
            class="callStatus"
            v-if="isCallPhone == 'hangUp' && audios[0].url !== ''"
          >
            <div
              v-if="audios[0].url !== ''"
              v-for="(item, index) in audios"
              :key="index"
              style="
                width: 205px;
                height: 30px;
                position: absolute;
                top: 111px;
                left: 50px;
              "
            >
              <vue-audio
                :theUrl="item.url"
                :theControlList="item.controlList"
              ></vue-audio>
            </div>
          </div>
        </div>

        <!--挂断-->
        <div
          class="audioImg"
          v-if="isCallPhone == 'hangUp' && audios[0].url !== ''"
        >
          <div class="item audioToTxt">
            <span class="item_text">语音转文字</span>
            <img
              src="/static/img/phoneCallImg/audioToText_mini.jpg"
              @click="audioToTxt"
            />
          </div>
          <div class="item audioDownload">
            <span class="item_text">下载</span>
            <img
              src="/static/img/phoneCallImg/download_mini.png"
              @click="audioDownload"
            />
          </div>
          <div class="item audioRemark">
            <span class="item_text">备注</span>
            <img
              src="/static/img/phoneCallImg/remark_mini.jpg"
              @click="audioRemark"
            />
          </div>
          <div class="item audioRelevance">
            <span class="item_text">关联事件</span>
            <img
              src="/static/img/phoneCallImg/relatedEvents_mini.jpg"
              @click="audioRelevance"
            />
          </div>
        </div>

        <!--呼出-->
        <div class="bottomPlan" v-if="isCallPhone == 'call'">
          <!-- <el-button type="danger" size="mini" @click="hangUp" :disabled="isHangUp">挂断</el-button> -->
          <el-button type="danger" size="mini" @click="hangUp('call')"
            >挂断</el-button
          >
        </div>

        <!--接通-->
        <div class="bottomPlan" v-if="isCallPhone == 'talking'">
          <el-button type="danger" size="mini" @click="hangUp">挂断</el-button>
          <el-button
            type="success"
            size="mini"
            @click="clickReports"
            v-if="!this.isShenShanProject"
            >智能接报</el-button
          >
        </div>
      </div>
    </div>

    <!--语音转文字弹窗-->
    <el-dialog
      width="562px"
      :visible.sync="audioToTxtDialog"
      title="语音转文字"
      :before-close="closeAudioToTxtDialog"
      :close-on-click-modal="false"
      append-to-body
      custom-class="audioDialogClass"
    >
      <div style="border-bottom: 1px solid rgba(242, 242, 242, 1)">
        <el-input
          v-loading="loading"
          type="textarea"
          resize="none"
          v-model="textContent"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-link
          :underline="false"
          @click="rebuildTxt"
          type="primary"
          style="position: absolute; left: 30px"
          >重新生成</el-link
        >
        <el-button @click="audioToTxtDialog = false">取 消</el-button>
        <el-button type="primary" @click="confimToText">保 存</el-button>
      </span>
    </el-dialog>

    <!--备注弹窗-->
    <el-dialog
      width="562px"
      :visible.sync="remarkDialog"
      title="备注"
      :before-close="closeRemarkDialog"
      :close-on-click-modal="false"
      append-to-body
      custom-class="remarkDialogClass"
    >
      <div style="border-bottom: 1px solid rgba(242, 242, 242, 1)">
        <el-input type="textarea" resize="none" v-model="remarkTxt"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remarkDialog = false">取 消</el-button>
        <el-button type="primary" @click="confimRemark">保 存</el-button>
      </span>
    </el-dialog>

    <!--事件关联-->
    <el-dialog
      width="562px"
      :visible.sync="relevanceDialog"
      title="事件关联"
      :before-close="closeRelevanceDialog"
      :close-on-click-modal="false"
      append-to-body
      custom-class="remarkDialogClass"
    >
      <div
        style="
          min-height: 183px;
          height: 183px;
          border-bottom: 1px solid rgba(242, 242, 242, 1);
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        "
      >
        <el-popover
          placement="bottom"
          v-model="visible"
          popper-class="eventOptions"
        >
          <div class="eventSearch">
            <el-input
              v-model="searchText"
              placeholder="请输入关键字"
              size="small"
            >
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                @click="searchEvent"
              ></i>
            </el-input>
          </div>
          <!-- <div class="recentOptions">
                <div class="recentTitle">近期选择：</div>
                <ul class="recentList">
                  <li class="eachRecent">08.27天河区自然灾害</li>
                </ul>
              </div> -->
          <template v-if="eventList.length > 0">
            <ul class="eventList">
              <li
                v-for="item in eventList"
                :key="item.id"
                class="evenyEvent"
                @click="selectEvent(item)"
                :style="selectEventStyle(item.id)"
              >
                {{ item.title }}
              </li>

              <div class="loadMore">
                <el-button
                  round
                  icon="iconfont icon-loadMore"
                  size="mini"
                  @click="loadMoreHandle"
                  v-if="loadMore"
                  >加载更多</el-button
                >
                <div v-else>暂无更多数据</div>
              </div>
            </ul>
          </template>
          <template v-else>
            <div style="text-align: center; margin-top: 10px">暂无数据</div>
          </template>

          <el-input
            slot="reference"
            v-model="eventTitle"
            readonly
            placeholder="请选择"
          ></el-input>
        </el-popover>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="relevanceDialog = false">取 消</el-button>
        <el-button type="primary" @click="confimRelevance">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VueAudio from "../components/template/VueAudio";
import { mapGetters } from "vuex";
import mixin from "../view/integratedCommunication/icpPhone/icpPhonePage/mixin";

const allApiRequest = require('@/assets/js/weblfasr/weblfasr.js').default;

export default {
  name: "miniCallTelephone",
  mixins: [mixin],
  components: {
    VueAudio,
  },
  computed: {
    ...mapGetters({
      isCallPhone: "getIsCallPhone", //电话队列的通话状态,
      isCallType: "getIsCallType", //呼入还是呼出
      timer: "getTimer",
      isHangUp: "getIsHangUp",
      isMissedCalls: "getIsMissedCalls", //电话是否未接
      isDialogType: "getIsDialogType", //弹窗类型
    }),
    selectEventStyle() {
      return function (eventId) {
        if (this.eventId == eventId) {
          return "color:#0091ff;background-color:rgba(0, 145, 255, .1);";
        } else {
          return "";
        }
      };
    },
  },
  data() {
    return {
      $window: window,
      loading: false,
      isShenShanProject: window.g.IsShenShanProject,
      audios: [
        {
          url: "",
          controlList: "onlyOnePlaying",
        },
      ],
      basicsData: {
        picture: "",
        name: "",
        phone: "",
        position: "",
        workUnit: "",
      },
      provincial: "",
      city: "",
      audioToTxtDialog: false,
      textContent: "",
      remarkDialog: false,
      remarkTxt: "",
      relevanceDialog: false,
      eventList: [],
      eventTitle: "",
      eventId: "",
      answerList: [], //未接列表
      IDX: -1,
      redStyle: {
        color: "#FE5F5F",
      },
      whiteStyle: {
        color: "#FFF",
      },
      blackStyle: {
        color: "#666666",
      },
      callListItem: "",
      moveDataelse: {
        x: null,
        y: null,
      },
      isOpenFunction_AudioToText: false, // 是否开通语音转文字功能
      IsZengChengProject: window.g.IsZengChengProject, // 是否是增城项目
      IsYangZhouProject: window.g.IsYangZhouProject, // 扬州项目
      IsOpenLabProject: window.g.IsOpenLabProject, // 是否openLab项目
      visible: false,
      currentPage: 1, // 事件列表页码
      searchText: "", // 事件列表搜索关键字
      loadMore: true, // 是否有更多事件数据
    };
  },
  methods: {
    mouseDownHandleelse(event) {
      document.onselectstart = function () {
        return false;
      };
      this.moveDataelse.x = event.pageX - this.$refs.miniDailog.offsetLeft;
      this.moveDataelse.y = event.pageY - this.$refs.miniDailog.offsetTop;
      event.currentTarget.style.cursor = "move";
      this.mouseMoveHandleelse(event);
    },
    mouseMoveHandleelse(event) {
      //计算出鼠标相对点击元素的位置,e.clientX获取的是鼠标的位置，OffsetLeft是元素相对于外层元素的位置
      let x = event.clientX - this.$refs.miniDailog.offsetLeft;
      let y = event.clientY - this.$refs.miniDailog.offsetTop;
      window.onmousemove = (e) => {
        // 获取拖拽元素的位置
        let left = e.clientX - x;
        let top = e.clientY - y;
        //console.log(document.documentElement.clientHeight,odiv.offsetHeight)
        // 把拖拽元素 放到 当前的位置
        if (left <= 0) {
          left = 0;
        } else if (
          left >=
          document.documentElement.clientWidth -
            this.$refs.miniDailog.offsetWidth
        ) {
          //document.documentElement.clientWidth 屏幕的可视宽度
          left =
            document.documentElement.clientWidth -
            this.$refs.miniDailog.offsetWidth;
        }

        if (top <= 0) {
          top = 0;
        } else if (
          top >=
          document.documentElement.clientHeight -
            this.$refs.miniDailog.offsetHeight
        ) {
          // document.documentElement.clientHeight 屏幕的可视高度
          top =
            document.documentElement.clientHeight -
            this.$refs.miniDailog.offsetHeight;
        }
        this.$refs.miniDailog.style.left = left + "px";
        this.$refs.miniDailog.style.top = top + "px";
      };
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-11-16
     * @description 松开鼠标按钮事件
     */
    mouseUpHandleelse(event) {
      // console.log('---松开鼠标按钮---')
      window.onmousemove = null;
      event.currentTarget.style.cursor = "move";
      // bug8432 author:hexinting date:2020-11-16
      document.onselectstart = function () {
        return true; // 可选择网页中的文字
      };
    },
    setToMini() {
      this.$store.commit("setIsDialogType", "mini");
    },
    colseMini() {
      this.$store.commit("setIsDialogType", "");
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2021-02-08
     * @description 未接号码回拨
     */
    goCallPhone() {
      if (this.callListItem) {
        let mobile = {
          number: this.callListItem.phone,
        };
        this.talkCall(mobile);
        // 拨号后将该条记录清除
        let ids = [this.callListItem.id];
        this.$api
          .handleMissCalls({
            id: ids,
          })
          .then((res) => {
            if (res.errorcode == 0) {
              this.getMissCalls();
            }
          });
      } else {
        this.$message({
          message: "请先选择要回拨的号码",
          type: "warning",
        });
      }
    },
    /* 获取未接来电 */
    getMissCalls() {
      this.$api.getMissCalls({}).then((res) => {
        if (res.errorcode === 0) {
          this.answerList = res.data || [];
          console.log('未接来电：', this.answerList)
        }
      });
    },
    clickAnswerList(item, index) {
      this.IDX = index;
      this.callListItem = item;
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2021-02-08
     * @description 清除全部未接来电
     */
    allClear() {
      let ids = [];
      this.answerList.forEach((item, index) => {
        ids.push(item.id);
      });
      this.$confirm('是否要全部清除未接来电?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
      }).then(() => {
        this.$api.handleMissCalls({
          id: ids,
        })
        .then((res) => {
          if (res.errorcode == 0) {
            this.getMissCalls();
          }
        });
      });
    },
    /**
     * @author hexinting
     * @param 无
     * @date 2020-10-14
     * @lastEditor hexinting
     * @lastDate 2021-01-19
     * @description 语音转文字
     */
    async audioToTxt() {
      let IsZengChengOrYangZhou = this.IsZengChengProject ||this.IsYangZhouProject  // 增城or扬州项目
      if (IsZengChengOrYangZhou) {
        // 是否是增城or扬州项目
        this.isOpenFunction_AudioToText = true; // 增城项目已经开启语音转文字功能 author:hexinting date:2020-11-10
      }
      if (!this.isOpenFunction_AudioToText) {
        this.$message({
          message: "暂未开通语音转文字功能，请开通后再使用。",
          type: "info",
        });
        return;
      }
      let id = this.$store.getters.getCallHistoryId; // 电话录音id
      let url = this.$store.getters.getPhoneRecordFile; // 录音地址
      // let url = 'http://192.168.3.136:8088/rec/20201029162827_15819249242_6001_CALLIN.wav' // 测试数据
      // let id = 1761; // 测试数据
      console.log("录音id：", id);
      console.log("录音url：", url);
      if (url) {
        this.audioToTxtDialog = true;
        this.loading = true;
      }
      // 先判断语音是否已经转过文字，若是，拿数据库的显示。
      this.$api.findRecordTextByPhoneId({ phoneId: id }).then(async (res) => {
        if (res.errorcode == 0) {
          if (res.data.recordText) {
            this.textContent = res.data.recordText;
          } else {
            let response = await allApiRequest(url, { id: id }); // 获取录音结果
            console.log("录音结果", response);
            if (response) {
              this.textContent = response;
              console.log("成功了");
            } else {
              console.log("失败了");
            }
          }
          this.loading = false;
        } else {
          this.$message.error(res.msg);
          this.loading = false;
        }
      });
    },
    // 注释原因： phoneToText 改成使用科大讯飞的方法 (author：hexinting；date:2020-9-23)
    // 语音转文字
    // audioToTxt() {
    //   let id = this.$store.getters.getCallHistoryId
    //   this.$api.phoneToText({phoneId: id}).then((res) => {
    //     if (res.errorcode == 0) {
    //       this.textContent = res.data;
    //       this.audioToTxtDialog = true;
    //     } else {
    //       this.$message.error(res.msg)
    //     }
    //   })
    // },
    closeAudioToTxtDialog() {
      this.audioToTxtDialog = false;
    },
    confimToText() {
      let id = this.$store.getters.getCallHistoryId;
      this.$api
        .updateRecordPhoneHisory({ id: id, text: this.textContent })
        .then((res) => {
          if (res.errorcode == 0) {
            this.audioToTxtDialog = false;
            this.$message({
              message: "保存成功!",
              type: "success",
            });
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    /**
     * @param 无
     * @lastEditor hexinting
     * @lastDate 2020-11-10
     * @description 重新语音转文字
     */
    rebuildTxt() {
      if (this.textContent) {
        this.$confirm("文本框内已有实时转换记录，是否覆盖？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.audioToTxt();
            // 注释原因： phoneToText 改成使用科大讯飞的方法 (author：hexinting；date:2020-11-10)
            // let id = this.$store.getters.getCallHistoryId;
            // this.$api.phoneToText({ phoneId: id }).then(res => {
            //     if (res.errorcode == 0) {
            //         this.textContent = res.data;
            //         this.$message({
            //             message: '生成成功',
            //             type: 'success',
            //         });
            //     } else {
            //         this.$message.error(res.msg);
            //     }
            // });
          })
          .catch(() => {});
      } else {
        this.audioToTxt();
        // 注释原因： phoneToText 改成使用科大讯飞的方法 (author：hexinting；date:2020-9-23)
        // let id = this.$store.getters.getCallHistoryId;
        // this.$api.phoneToText({ phoneId: id }).then(res => {
        //     if (res.errorcode == 0) {
        //         this.textContent = res.data;
        //         this.$message({
        //             message: '生成成功',
        //             type: 'success',
        //         });
        //     } else {
        //         this.$message.error(res.msg);
        //     }
        // });
      }
    },

    // 下载
    audioDownload() {
      let dataName = this.audios[0].url.split("/rec/");
      let eleLink = document.createElement("a");
      // eleLink.download = dataName[1]+'.wav';
      eleLink.download = dataName[1];
      eleLink.style.display = "none";
      // 字符内容转变成blob地址
      let blob = new Blob([this.audios[0].url]);
      eleLink.href = URL.createObjectURL(blob);
      // 触发点击
      document.body.appendChild(eleLink);
      eleLink.click();
      // 然后移除
      document.body.removeChild(eleLink);
    },

    // 备注
    audioRemark() {
      this.remarkDialog = true;
    },

    closeRemarkDialog() {
      this.remarkDialog = false;
    },

    //备注保存
    confimRemark() {
      let id = this.$store.getters.getCallHistoryId;
      this.$api
        .updateRecordPhoneHisory({ id: id, remark: this.remarkTxt })
        .then((res) => {
          if (res.errorcode == 0) {
            this.remarkDialog = false;
            this.$message({
              message: "保存成功!",
              type: "success",
            });
          } else {
            this.$message.error(res.msg);
          }
        });
    },

    // 事件关联
    audioRelevance() {
      let ipData = {
        dtStart: "",
        dtEnd: "",
        searchText: this.searchText,
        page: this.currentPage,
        size: 10,
      };
      this.$api.todolist(ipData).then((res) => {
        if (res.errorcode == 0) {
          this.eventList.push(...res.data.data);
          this.loadMore = res.data.data.length == 0 ? false : true;
          this.relevanceDialog = true;
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    closeRelevanceDialog() {
      this.relevanceDialog = false;
    },
    confimRelevance() {
      let id = this.$store.getters.getCallHistoryId;
      this.$api.ok({ id: id, eventId: this.eventId }).then((res) => {
        if (res.errorcode == 0) {
          this.relevanceDialog = false;
          this.$message({
            message: "保存成功!",
            type: "success",
          });
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    clickReports() {
      // this.$store.commit('setIsIntelligenceReports',true)
      this.$store.commit("setIsDialogType", "big");
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2021-01-20
     * @description 获取录音文件地址
     */
    getPhoneUrl() {
      console.log("-------获取录音文件地址--------");
      let ID = this.$store.getters.getCallHistoryId;
      setTimeout(() => {
        this.$szApi.phoneGetUrl({ phoneId: ID }).then((res) => {
          if (res.errorcode == 0) {
            if (res.data.url && res.data.url !== '' && res.data.url !== undefined) {
              this.audios.forEach((m, i) => {
                if (i === 0) {
                  this.$set(m, "url", window.g.ApiUrl + "/rec/" + res.data.url);
                }
              });
              this.$store.commit(
                "setPhoneRecordFile",
                window.g.ApiUrl + "/rec/" + res.data.url
              );
              console.log(
                "录音地址：",
                window.g.ApiUrl + "/rec/" + res.data.url
              );
            }
          }
        });
      }, 4000);
    },
    /**
     * @param {type} underfine
     * @return {type} return underfine
     * @descripttion: 获取电话打进打出联系人信息
     */
    getCallMsg() {
      if (this.isCallType == "callIng") {
        let data = this.$store.getters.getUserCall;
        console.log(data);
        this.basicsData.picture = data && data.picture ? data.picture : "";
        this.basicsData.name = data && data.name ? data.name : "";
        this.basicsData.position = data && data.position ? data.position : "";
        this.basicsData.phone =
          data && data.mobile
            ? data.mobile.replace(/^(.{3})(.*)(.{4})$/, "$1 $2 $3")
            : "";
        this.basicsData.workUnit = data && data.workUnit ? data.workUnit : "";
      }
      if (this.isCallType == "callOut") {
        var data = this.$store.getters.getNowSelectPhoneList;

        console.log(
          "this.$store.getters.getNowSelectPhoneList",
          data,
          this.$store
        );
        this.basicsData.picture =
          data && data.length >= 1 ? data[0].content.picture : "";
        this.basicsData.name =
          data && data.length >= 1 ? data[0].content.name : "";
        this.basicsData.position =
          data && data.length >= 1 ? data[0].content.position : "";
        this.basicsData.phone =
          data && data.length >= 1
            ? data[0].content.number.replace(/^(.{3})(.*)(.{4})$/, "$1 $2 $3")
            : "";
        this.basicsData.workUnit =
          data && data.length >= 1 ? data[0].content.workUnit : "";
      }
      let phone = this.basicsData.phone.replace(/\s+/g, "");
      if (phone) {
        this.$api.getNumberArea({ number: phone }).then((res) => {
          if (res.errorcode == 0) {
            this.provincial = res.data.province;
            this.city = res.data.city;
          } else {
            this.provincial = "未知";
            this.city = "未知";
          }
        });
      }
    },
    //挂断方法
    hangUp() {
      console.log("挂断2！");
      this.$confirm("是否结束当前通话?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
      }).then(() => {
        let self = this;
        if (self.HWICP_Version == "HWICP-19.0") {
          this.$icp19.DropCall(Number(self.agent_id), Number(self.conn), "");
          this.$store.commit("setCallStatus", false);
          if (window.g.IsOpenLabProject) {
            this.$store.commit("setIsDialogType", '');
          }
        }
      });
    },
    /**
     * @description: 选中的事件
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 20201119 14:56
     * @param {obj} 选中的事件信息
     * @return {*}
     */
    selectEvent(obj) {
      this.visible = false;
      this.eventTitle = obj.title;
      this.eventId = obj.id;
    },
    /**
     * @description: 搜索事件
     * @author : xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-19 15:03
     * @param {*}
     * @return {*}
     */
    searchEvent() {
      this.currentPage = 1;
      this.eventList = [];
      this.audioRelevance();
    },
    /**
     * @description: 每次追加10条事件列表
     * @author : xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-19 15:03
     * @param {*}
     * @return {*}
     */
    loadMoreHandle() {
      this.currentPage++;
      this.audioRelevance();
    },
  },
  mounted() {
    this.getCallMsg();
    console.log("isCallPhone:", this.isCallPhone);
    // bug 7913 当isCallPhone为'hangUp' isDialogType（弹窗类型）从'mini'变为‘small’时，拿取在home.vue页面中缓存的通话记录
    if (this.isCallPhone === "hangUp") {
      this.audios[0].url = this.$store.getters.getPhoneRecordFile;
      this.getMissCalls();
    }
  },
  watch: {
    isCallPhone: {
      handler(neW, olD) {
        console.log("-------通话状态1：", neW, olD);
        this.getCallMsg();
        if (olD === "talking" && neW === "hangUp") {
          this.getPhoneUrl();
        }
        if (neW === "hangUp") {
          if (this.isMissedCalls) {
            this.getMissCalls();
          }
        }
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.modelBox {
  width: 301px;
  height: 214px;
  max-height: 522px;
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 2000;
  border-radius: 5px;
  overflow: hidden;
}

.modelBox_missCall {
  height: 522px !important;
  box-shadow: 0px 4px 14px 3px rgba(44, 45, 46, 0.16);
}

.miniPlanCallIng {
  width: 301px;
  height: 214px;
}

/*背景图设置*/
/*呼入中*/
.miniCallBack {
  background-image: url("/static/img/phoneCallImg/callJoinX.png");
  background-repeat: no-repeat;
  background-size: 301px 214px;
  background-position: center center;
}
.miniCallBackLeader {
  background-image: url("/static/img/phoneCallImg/callJoinXLeader.png");
  background-repeat: no-repeat;
  background-size: 301px 214px;
  background-position: center center;
}

/*呼入通话中*/
.miniCallTelephone {
  background-image: url("/static/img/phoneCallImg/callBeingX.png");
  background-repeat: no-repeat;
  background-size: 301px 214px;
  background-position: center center;
}
.miniCallTelephoneLeader {
  background-image: url("/static/img/phoneCallImg/callBeingXLeader.png");
  background-repeat: no-repeat;
  background-size: 301px 214px;
  background-position: center center;
}

/*通话结束*/
.miniCallUp {
  background-image: url("/static/img/phoneCallImg/callBreakX.png");
  background-repeat: no-repeat;
  background-size: 301px 214px;
  background-position: center center;
}
.miniCallUpLeader {
  background-image: url("/static/img/phoneCallImg/callBreakXLeader.png");
  background-repeat: no-repeat;
  background-size: 301px 214px;
  background-position: center center;
}

/*呼出中*/
.miniCallToBack {
  background-image: url("/static/img/phoneCallImg/callIngX.png");
  background-repeat: no-repeat;
  background-size: 301px 214px;
  background-position: center center;
}
.miniCallToBackLeader {
  background-image: url("/static/img/phoneCallImg/callIngXLeader.png");
  background-repeat: no-repeat;
  background-size: 301px 214px;
  background-position: center center;
}

/*********/
.miniPlanCallOut {
  width: 301px;
  height: 214px;
  /*background-image: url("/static/img/phoneCallImg/callIngX.png");*/
  /*background-repeat: no-repeat;*/
  /*background-size: 301px  214px;*/
  /*background-position: center center;*/
}

.messagePlan {
  width: 100%;
  height: 60px;
  text-align: left;
}

.bottomPlan {
  width: 100%;
  display: flex;
  height: 40px;
  justify-content: center;
  align-items: center;
}

.numberPlan {
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.numberAffilation {
  font-size: 17px;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.callStatus {
  padding-top: 10px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}

.audioImg {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
  margin-left: 20px;
}

.audioImg img {
  width: 15px;
  margin: 0 10px;
  height: 15px;
  cursor: pointer;
}

.audioImg .item {
  position: relative;
}

.audioImg .item_text {
  position: absolute;
  z-index: 2001;
  top: -24px;
  left: -22px;
  width: 80px;
  display: none;
  font-size: 14px;
  text-align: center;
  background: #ffffff;
}

.audioImg .audioToTxt:hover .item_text,
.audioImg .audioDownload:hover .item_text,
.audioImg .audioRemark:hover .item_text,
.audioImg .audioRelevance:hover .item_text {
  display: block;
}

.callStatus .main-wrap > .el-tag {
  background-color: #fff;
  color: #fff !important;
}

>>> .el-dialog__header {
  background: rgba(241, 244, 246, 1);
  height: 56px;
  font-weight: 400;
  line-height: 56px;
  padding: 0 0 0 20px;
}

>>> .el-dialog__body {
  padding: 0;
  height: 183px;
}

>>> .el-dialog__footer {
  padding: 0;
  height: 70px;
  line-height: 70px;
  text-align: right;
  margin-right: 20px;
}

>>> .el-textarea__inner {
  border: none;
  min-height: 183px;
  height: 183px;
}

.elSelectEvent >>> .el-popper {
  min-width: 440px !important;
  max-width: 440px !important;
}

.miniPlanMissCalls {
  width: 301px;
  /* height: 214px; */
  position: relative;
  /* background-image: url("/static/img/phoneCallImg/callAnswerX.png");
  background-repeat: no-repeat;
  background-size: 301px 214px;
  background-position: center center; */
  background: #ffffff;
}

.missCallHeader {
  width: 301px;
  height: 42;
  line-height: 42px;
  background-image: url("/static/img/phoneCallImg/missCallHeader.png");
  background-repeat: no-repeat;
  background-size: 301px 42px;
  background-position: center center;
  text-align: left;
  text-indent: 15px;
  color: #fff;
}

.answerContentList {
  display: flex;
  align-items: center;
  background: rgba(234, 242, 246, 1);
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 7px;
  transition: box-shadow 0.2s;
}

.answerContentList:hover {
  box-shadow: inset 0 0 0 1px #479dff;
}

.answerContentList.hover {
  color: white !important;
  background: linear-gradient(
    131deg,
    rgba(31, 161, 255, 1) 0%,
    rgba(105, 197, 255, 1) 100%
  );
}
</style>
