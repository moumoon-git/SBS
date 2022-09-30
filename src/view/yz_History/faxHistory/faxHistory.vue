<template>
  <div class="faxHistory">
    <el-row style="margin: 0 10px">
      <!--左-->
      <el-col class="left_box" :span="16" style="background-color: #fff">
        <el-tabs
          v-model="TabsActiveName"
          type="card"
          @tab-click="handleTabClick"
        >
          <el-tab-pane label="全部" name=" ">
            <allFax
              v-if="TabsActiveName === ' '"
              ref="childrenRef"
              @clickRowData="clickRowData"
            ></allFax>
          </el-tab-pane>
          <el-tab-pane label="发送记录" name="发送记录">
            <sendFax
              ref="childrenRef"
              v-if="TabsActiveName === '发送记录'"
              @clickRowData="clickRowData"
            ></sendFax>
          </el-tab-pane>
          <el-tab-pane label="联系人记录" name="联系人记录">
            <relationFax
              ref="childrenRef"
              v-if="TabsActiveName === '联系人记录'"
              @clickRowData="clickRowData"
              @handleIcon="handleIcon"
            ></relationFax>
          </el-tab-pane>
          <el-tab-pane label="回收站" name="回收站">
            <recycleFax
              :iframeUrl="iframeUrl"
              v-if="TabsActiveName === '回收站'"
              @clickRowData="clickRowData"
            ></recycleFax>
          </el-tab-pane>
          <el-tab-pane label="黑名单传真" name="黑名单传真">
            <faxBlackList
              :iframeUrl="iframeUrl"
              v-if="TabsActiveName === '黑名单传真'"
              @clickRowData="clickRowData"
            ></faxBlackList>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <!--右-->
      <!--全部-->
      <el-col
        v-if="TabsActiveName === ' '"
        :span="8"
        class="right_box"
        style="border-left: 15px solid #ebeef5"
      >
        <div class="all_right_box">
          <div class="right_top_box mgb14">
            <el-button @click="handleAllSend">保存</el-button>
            <div
              style="position: absolute; top: 18px; left: 135px; display: none"
            >
              <span style="font-size: 18px; color: #666; margin-right: 5px"
                >页数</span
              >
              <span
                style="
                  display: inline-block;
                  padding: 6px 12px;
                  font-size: 18px;
                  font-weight: 600;
                  background: #f3f3f7;
                  border-radius: 6px;
                "
                >0</span
              >
            </div>
            <h5 style="margin-bottom: 24px">传真详情</h5>

            <!--表单-->
            <el-form
              ref="faxAllForm"
              :model="faxAllForm"
              label-width="50px"
              hide-required-asterisk
            >
              <el-row>
                <el-col :span="15">
                  <span
                    class="pdr10"
                    style="
                      font-size: 15px;
                      color: #333;
                      border-right: 1px solid #ddd;
                      line-height: 40px;
                    "
                    >{{ faxAllForm.call }}</span
                  >
                  <span
                    class="pdlr10"
                    style="font-size: 15px; color: #333; line-height: 40px"
                    >{{ faxAllForm.sendtime }}</span
                  >
                </el-col>
                <el-col :span="9">
                  <el-form-item label="状态" prop="processing">
                    <el-select
                      style="width: 100%"
                      v-model="faxAllForm.processing"
                      placeholder="请选择"
                      :disabled="isSend"
                    >
                      <el-option
                        v-for="item in faxAllProcessingList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="类型" prop="type">
                    <el-dropdown trigger="click" @command="handleCommand">
                      <span class="el-dropdown-link">
                        <el-input
                          v-model="faxAllForm.type"
                          placeholder="请输入内容"
                          suffix-icon="el-icon-arrow-down"
                          :disabled="isSend"
                        ></el-input>
                      </span>
                      <el-dropdown-menu slot="dropdown" v-if="!isSend">
                        <el-dropdown-item
                          style="width: 130px"
                          v-for="(item, index) in faxAllTypeList"
                          :key="index"
                          :command="item"
                        >
                          <div
                            style="
                              display: flex;
                              justify-content: space-between;
                              align-items: center;
                            "
                          >
                            <span>{{ item }}</span>
                            <i
                              class="el-icon-close"
                              @click.stop="delType(item)"
                            ></i>
                          </div>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="单位" prop="unit">
                    <el-input
                      type="text"
                      v-model.trim="faxAllForm.unit"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="标题" prop="title">
                <el-input v-model.trim="faxAllForm.title"></el-input>
              </el-form-item>
              <el-form-item
                label="处理记录"
                prop="processingResult"
                class="form_label_lh"
              >
                <el-input
                  type="textarea"
                  resize="none"
                  :autosize="{ minRows: 2, maxRows: 2 }"
                  v-model="faxAllForm.processingResult"
                  :disabled="isSend"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="关联事件"
                prop="caseId"
                class="form_label_lh"
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
                  <template v-if="faxAllCaseId.length > 0">
                    <ul class="eventList">
                      <li
                        v-for="item in faxAllCaseId"
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
                    <div style="text-align: center; margin-top: 10px">
                      暂无数据
                    </div>
                  </template>

                  <el-input
                    slot="reference"
                    v-model="faxAllForm.caseTitle"
                    readonly
                    placeholder="请选择"
                  ></el-input>
                </el-popover>
              </el-form-item>
            </el-form>
          </div>
          <div class="right_bottom_box">
            <img
              v-show="iframeUrl"
              @click="fullScreenDialog = true"
              style="
                width: 20px;
                height: 20px;
                position: absolute;
                top: 20px;
                right: 20px;
                z-index: 99;
                cursor: pointer;
              "
              src="../../../assets/phoneHistoryIcon/fullScreen.png"
            />
            <h5 style="margin-bottom: 5px">传真预览</h5>
            <div class="iframe">
              <div v-if="!iframeUrl" style="height: 373px">
                <img src="../../../assets/phoneHistoryIcon/faxBack.png" />
              </div>
              <template v-else>
                <iframe
                  :src="iframeUrl"
                  id="iframe"
                  frameborder="no"
                  border="0"
                  marginwidth="0"
                  height="323px"
                  marginheight="0"
                  scrolling="no"
                  allowtransparency="yes"
                ></iframe>
                <div style="text-align: center; padding-top: 10px">
                  <el-button size="small" @click="sequentialRotationOut"
                    >顺序旋转</el-button
                  >
                  <el-button size="mini" @click="handleBtnFax('回复')"
                    >回复</el-button
                  >
                  <el-button size="mini" @click="handleBtnFax('转发')"
                    >转发</el-button
                  >
                  <el-button size="mini" @click="handleFaxMerge"
                    >合并</el-button
                  >
                  <el-button size="mini" @click="activeResolution"
                    >拆分</el-button
                  >
                  <el-button size="mini" @click="faxToText">图文识别</el-button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </el-col>
      <!--发送记录/联系人记录/回收站/黑名单传真-->
      <el-col
        v-else
        :span="8"
        class="right_box"
        style="border-left: 15px solid #ebeef5"
      >
        <div class="send_right_box">
          <el-button
            :disabled="btnDisabled"
            v-if="
              TabsActiveName !== '回收站' && TabsActiveName !== '黑名单传真'
            "
            style="position: absolute; top: 14px; right: 14px; z-index: 99"
            type="primary"
            @click="handleRecordSend"
            >保存</el-button
          >
          <div class="right_box">
            <img
              v-if="
                iframeUrl &&
                TabsActiveName !== '回收站' &&
                TabsActiveName !== '黑名单传真'
              "
              @click="fullScreenDialog = true"
              style="
                width: 20px;
                height: 20px;
                position: absolute;
                top: 106px;
                right: 20px;
                z-index: 99;
                cursor: pointer;
              "
              src="../../../assets/phoneHistoryIcon/fullScreen.png"
            />
            <img
              v-if="
                iframeUrl &&
                (TabsActiveName === '回收站' || TabsActiveName === '黑名单传真')
              "
              @click="fullScreenDialog = true"
              style="
                width: 20px;
                height: 20px;
                position: absolute;
                top: 50px;
                right: 20px;
                z-index: 99;
                cursor: pointer;
              "
              src="../../../assets/phoneHistoryIcon/fullScreen.png"
            />
            <h5 class="common_h5" style="margin-bottom: 28px">传真预览</h5>
            <div
              style="display: flex; align-items: center"
              class="mgb14"
              v-if="
                TabsActiveName !== '回收站' && TabsActiveName !== '黑名单传真'
              "
            >
              <span style="font-size: 16px; color: #555; margin: 0 28px 0 14px"
                >事件关联</span
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
                <template v-if="faxAllCaseId.length > 0">
                  <ul class="eventList">
                    <li
                      v-for="item in faxAllCaseId"
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
                  <div style="text-align: center; margin-top: 10px">
                    暂无数据
                  </div>
                </template>

                <el-input
                  slot="reference"
                  v-model="eventTitle"
                  readonly
                  placeholder="请选择"
                ></el-input>
              </el-popover>
            </div>
            <div class="iframe">
              <!-- @authorName: qinjiaqi
                     @description: 没有传真路径 -->
              <div
                v-if="!iframeUrl"
                :style="
                  TabsActiveName === '回收站' || TabsActiveName === '黑名单传真'
                    ? 'height:655px'
                    : 'height:600px'
                "
              >
                <img src="../../../assets/phoneHistoryIcon/faxBack.png" />
              </div>
              <div v-else>
                <!-- description: 有传真路径但是找不到传真 -->
                <div v-if="isIframeUrlNotFound == 1" style="height: 601px">
                  <img src="../../../assets/phoneHistoryIcon/faxBack.png" />
                </div>
                <!-- description: 有传真路径且找到传真 -->
                <div v-else>
                  <iframe
                    :src="iframeUrl"
                    id="iframe"
                    frameborder="no"
                    border="0"
                    marginwidth="0"
                    :height="
                      !(
                        TabsActiveName === '回收站' ||
                        TabsActiveName === '黑名单传真'
                      )
                        ? '590px'
                        : '680px'
                    "
                    marginheight="0"
                    scrolling="no"
                    allowtransparency="yes"
                  ></iframe>
                </div>
              </div>
              <template
                v-if="
                  TabsActiveName !== '回收站' && TabsActiveName !== '黑名单传真'
                "
              >
                <div style="text-align: center; padding-top: 10px">
                  <el-button
                    size="small"
                    @click="sequentialRotationOut"
                    v-if="TabsActiveName != '发送记录'"
                    >顺序旋转</el-button
                  >
                  <el-button
                    :disabled="TabsActiveName === '发送记录'"
                    size="mini"
                    @click="handleBtnFax('回复')"
                    >回复</el-button
                  >
                  <el-button size="mini" @click="handleBtnFax('转发')"
                    >转发</el-button
                  >
                  <el-button size="mini" @click="handleFaxMerge"
                    >合并</el-button
                  >
                  <el-button size="mini" @click="activeResolution"
                    >拆分</el-button
                  >
                  <el-button size="mini" @click="faxToText">图文识别</el-button>
                </div>
              </template>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--弹窗预览传真-->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="fullScreenDialog"
      fullscreen
    >
      <iframe
        :src="iframeUrl"
        id="iframe"
        width="100%"
        height="900px"
        frameborder="no"
        marginwidth="0"
        marginheight="0"
        scrolling="no"
        allowtransparency="yes"
      ></iframe>
    </el-dialog>

    <!--发传真弹窗-->
    <el-dialog
      class="relationFaxDialog"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="relationFaxDialog"
      width="1460px"
      top="3vh"
      append-to-body
    >
      <relationFaxDialog
        v-if="relationFaxDialog"
        ref="relationFaxDialog"
        :contactData="contactData"
        :faxAllCaseId="faxAllCaseId"
        :faxName="iframeUrl"
      ></relationFaxDialog>
    </el-dialog>

    <!--图文识别-->
    <!-- <el-dialog class="msg_box" top='80px'  :close-on-click-modal="false"  width='1100px' title="转文字内容"
               :visible.sync="faxToTextDialog">
      <el-card class="box-card">
        <el-scrollbar style="height: 100%">
          <div style="height: 450px;width: 100%;padding: 10px" ref="imgToText">{{toText}}</div>
          <div style="width: 100%;padding-right: 20px;text-align: right">
            <el-link  v-clipboard:copy="toText"
                      v-clipboard:success="copyTextSuccess" v-clipboard:error="copyTextError">一键复制到粘贴板</el-link>
          </div>
        </el-scrollbar>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="faxToTextDialog=false" size="small">关闭</el-button>
      </div>
    </el-dialog> -->

    <img-to-text
      ref="imgToText"
      :faxId="faxAllForm.id"
      :isSequentialRotationIn="isSequentialRotationIn"
      @imgToText="faxToText"
      v-if="imgToTextVisible"
      @closeImgToText="imgToTextVisible = false"
      @sequentialRotationIn="sequentialRotationIn"
    ></img-to-text>

    <!--合并传真-->
    <mergefaxDialog
      ref="mergeFaxDialog"
      :TabsActiveName="TabsActiveName"
      :faxAllForm="faxAllForm"
      @closeFaxDialog="closeFaxDialog"
    ></mergefaxDialog>

    <!--拆分传真-->
    <resolution ref="resolution" @closeFlag="closeFlag"></resolution>
  </div>
</template>
<script>
import allFax from "./children/allFax";
import sendFax from "./children/sendFax";
import relationFax from "./children/relationFax";
import recycleFax from "./children/recycleFax";
import faxBlackList from "./children/faxBlackList";
import { Url } from "@/assets/js/common";

import relationFaxDialog from "./components/relationFaxDialog";
import mergefaxDialog from "./components/mergefaxDialog";
import resolution from "./components/resolution";
import imgToText from "@/view/yz_eventManagement/informationDisposal/imgToText";
import axios from "axios"; // 使用axios获取状态码
export default {
  name: "faxHistory",
  components: {
    allFax, //全部
    sendFax, //发送记录
    relationFax, //联系人记录
    recycleFax, //回收站
    faxBlackList, // 传真黑名单
    relationFaxDialog,
    mergefaxDialog,
    resolution,
    imgToText,
  },

  data() {
    return {
      isIframeUrlNotFound: 0,
      resolutionKey: "",
      timerDate: "",

      fullScreenDialog: false,

      iframeUrl: "",
      TabsActiveName: " ", //全部/发送记录/联系人记录/回收站

      // 右边传真详情表单
      faxAllForm: {
        id: "", //id
        caseId: "", //关联事件id
        caseTitle: "", //关联事件标题
        type: "", //类型
        unit: "", //单位
        title: "", //标题
        processing: "", //状态
        processingResult: "", //处理记录

        call: "", //电话
        sendtime: "", //时间
        faxFile: "", //传真

        direct: "",
        faxName: "",
      },
      isSend: false,

      btnDisabled: true, //保存按钮禁用
      eventID: "",
      eventTitle: "",
      faxID: "",

      faxAllProcessingList: [],
      faxAllTypeList: [],
      faxAllCaseId: [],

      // 图文识别
      faxToTextDialog: false,
      toText: "",

      // 回复/转发重发弹窗
      dialogTitle: "",
      relationFaxDialog: false,
      // 弹窗数据
      contactData: {},

      // 点击表格当行存储当行数据
      rowData: {},
      totalpage: "",
      imgToTextVisible: false, //图文识别弹窗
      isSequentialRotationIn: false,
      visible: false,
      currentPage: 1, // 事件列表页码
      searchText: "", // 事件列表搜索关键字
      loadMore: true, // 是否有更多事件数据
    };
  },
  created() {
    if (this.$route.query.type) {
      this.TabsActiveName = " ";
    }
    this.getFaxTypeSelections(); //选择全部右边表单类型
    this.getByPcode(); //获取全部右边表单状态
    this.getAllEventlist(); //获取右表单所有关联数据
  },
  computed: {
    selectEventStyle() {
      return function (eventId) {
        if (
          (this.TabsActiveName == " "
            ? this.faxAllForm.caseId
            : this.eventID) == eventId
        ) {
          return "color:#0091ff;background-color:rgba(0, 145, 255, .1);";
        } else {
          return "";
        }
      };
    },
  },
  watch: {
    "$route.query.type"(newVal) {
      if (newVal) {
        this.TabsActiveName = " ";
      }
    },
  },
  methods: {
    /**
     * @createTime: 2020-11-05
     * @authorName: qinjiaqi
     * @param {type} 没有
     * @return {type} undefined
     * @Description: 监听传真状态码
     */
    isIframeUrlFound() {
      let url = this.iframeUrl;
      if (url == "" || url == null || url == undefined) return;
      axios
        .get(url)
        .then((res) => {})
        .catch((err) => {
          console.log("err.response.status: ", err.response.status);
          if (err.response.status === 404) {
            this.isIframeUrlNotFound = 1;
            console.log("isIframeUrlNotFound: ", this.isIframeUrlNotFound);
          }
        });
    },
    //Tabs切换
    handleTabClick() {
      this.eventID = "";
      this.eventTitle = "";
      this.searchText = "";
      this.currentPage = 1;
      this.faxAllCaseId = [];
      this.getAllEventlist();
      this.iframeUrl = "";
      this.faxID = "";
      this.btnDisabled = true;

      // this.$router.push({path: '/messageHistory'}) // 注释原因：在本页面跳转本页面会报错（hexinting）
    },
    /**
     * @createTime: 2020-11-05
     * @editorName: qinjiaqi
     * @param {Object, String} 点击的行，左还是右
     * @return {type} undefined
     * @Description: 点击表格当行
     */
    clickRowData(row, msg) {
      console.log(
        "title:" +
          row.title +
          "," +
          "faxName:" +
          row.faxName +
          "caseId:" +
          row.caseId
      );
      /*if(row.direct == '已发'){
          this.isSend = true
        }else {
          this.isSend = false
        }*/
      // 处置状态为0时即为空
      if (row.processing == 0) {
        row.processing = "";
      }
      // 事件id为0时即为空
      if (row.caseId == 0 || row.caseId == -1) {
        row.caseId = "";
      }
      this.faxAllForm = { ...row };
      this.faxAllForm.caseTitle = row.eventTitle;
      // 如果是发送的传真 标题置为faxName
      if (this.isSend) {
        this.faxAllForm.title = this.faxAllForm.faxName;
      }
      this.totalpage = row.totalpage;
      this.rowData = row;
      this.btnDisabled = true;
      if (this.TabsActiveName === "发送记录") {
        this.btnDisabled = false;
        if (msg === "right" && row.eventId) {
          this.eventID = row.eventId;
          this.eventTitle = row.event;
          this.faxID = row.id;
        }
        if (msg === "right" && (!row.eventId || row.eventId === -1)) {
          this.eventID = "";
          this.eventTitle = "";
        }
        if (msg === "left" && row.faxFile) {
          this.faxID = row.id;
          this.iframeUrl = "";
          // this.iframeUrl = `${Url}/eos/communication/pdf/preview?filename=${row.faxFile}&type=send`
          this.isIframeUrlNotFound = 0; // 清零
          this.isIframeUrlFound(); //得到传真路径，开始检查
        }
        if (msg === "left" && !row.faxFile) {
          this.iframeUrl = "";
        }
        // return;
      }

      if (this.TabsActiveName === "联系人记录") {
        if (row) {
          this.btnDisabled = false;
          this.eventID = row.caseId;
          this.eventTitle = row.eventTitle;
          this.faxID = row.id;
        }
      } else if (this.TabsActiveName === "回收站") {
        this.eventID = ""; //将发送记录/联系人记录的关联事件清空
        this.eventTitle = ""; //将发送记录/联系人记录的关联事件标题清空
        this.faxID = row.id;
      } else {
        this.eventID = ""; //将发送记录/联系人记录的关联事件清空
        this.eventTitle = ""; //将发送记录/联系人记录的关联事件标题清空
        this.faxID = row.id;
      }

      if (this.faxID) {
        // console.log(row.faxFile);
        // 传真预览---获取流
        let data1 = {
          faxId: this.faxID,
        };
        this.$api.previewFax(data1).then((res) => {
          if (res.errorcode == 0) {
            this.iframeUrl = `${window.g.ApiUrl}/fax/${
              res.data
            }?timeStamp=${new Date().getTime()}`;
          } else if (res.errorcode == 500) {
            this.iframeUrl = "";
            //this.$message.error(res.msg)
          }
        });
        // this.iframeUrl = `${Url}/eos/communication/pdf/preview?id=${this.faxID}`;
      } else {
        this.iframeUrl = "";
      }
    },
    // 选择全部右边表单类型
    handleCommand(val) {
      this.faxAllForm.type = val;
    },
    // 获取全部右边表单类型
    getFaxTypeSelections() {
      this.$api.getFaxTypeSelections().then((res) => {
        if (!res.data) {
          this.faxAllTypeList = [];
          return;
        }
        this.faxAllTypeList = res.data;
      });
    },
    // 获取全部右边表单状态
    getByPcode() {
      let parmas = {
        pcode: "information_processing_status",
      };
      this.$api.eventGetByPcodes(parmas).then((res) => {
        if (!res.data) {
          this.faxAllProcessingList = [];
          return;
        }
        this.faxAllProcessingList = res.data;
        console.log(res.data);
      });
    },
    // 获取全部右表单所有关联数据
    getAllEventlist() {
      let ipData = {
        dtStart: "",
        dtEnd: "",
        searchText: this.searchText,
        page: this.currentPage,
        size: 10,
      };
      this.$api.todolist(ipData).then((res) => {
        if (res.errorcode == 0) {
          this.faxAllCaseId.push(...res.data.data);
          this.loadMore = res.data.data.length == 0 ? false : true;
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    // 全部传真详情保存
    handleAllSend() {
      this.$refs["faxAllForm"].validate((valid) => {
        if (valid) {
          let parmas = {
            id: this.faxAllForm.id,
            iCaseId: this.faxAllForm.caseId,
            type: this.faxAllForm.type,
            unit: this.faxAllForm.unit,
            title: this.faxAllForm.title,
            status: this.faxAllForm.processing,
            processingResult: this.faxAllForm.processingResult,
          };
          this.$api.fax_success(parmas).then((res) => {
            if (res.errorcode != 0) {
              this.$message({
                message: res.msg,
                type: "error",
              });
            } else {
              this.$message({
                message: "保存成功！",
                type: "success",
              });
              // 刷新表格数据
              this.$refs.childrenRef.getSaveUnitFaxList();
            }
          });
        } else {
          this.$message({
            type: "error",
            message: "请填写完整信息!",
          });
          return false;
        }
      });
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-12-02
     * @description  记录传真详情保存
     */
    handleRecordSend() {
      if (!this.faxID) {
        this.$message({
          type: "error",
          message: "请先选择要保存事件的传真",
        });
        return;
      }
      this.btnDisabled = true;
      // bug 8652 添加参数 author:hexinting date:20201202
      let parmas = {
        id: this.faxID,
        iCaseId: this.eventID,
        type: this.faxAllForm.type,
        unit: this.faxAllForm.unit,
        title: this.faxAllForm.title,
        status: this.faxAllForm.processing,
        processingResult: this.faxAllForm.processingResult,
      };
      this.$api
        .fax_success(parmas)
        .then((res) => {
          if (this.TabsActiveName === "发送记录") {
            this.$refs.childrenRef.getSendfaxGroupList();
            this.$refs.childrenRef.radioBtn = "发送成功";
          } else if (this.TabsActiveName === "联系人记录") {
            this.$refs.childrenRef.getFaxContactorList();
          }
          this.btnDisabled = false;
          if (res.errorcode === 0) {
            this.$message({
              type: "success",
              message: "保存成功",
            });
          } else {
            this.$message({
              type: "error",
              message: res.msg,
            });
          }
        })
        .catch((err) => {
          this.btnDisabled = false;
          this.$message({
            type: "error",
            message: err.msg,
          });
        });
    },
    // 图文识别
    faxToText() {
      this.imgToTextVisible = true;
      this.$nextTick(() => {
        if (this.TabsActiveName != "发送记录") {
          this.isSequentialRotationIn = true;
        } else {
          this.isSequentialRotationIn = false;
        }

        this.$refs.imgToText.oldFaxPath = "";
        this.$refs.imgToText.imageTextArr = [];
        // console.log(this.imgToTextId, this.faxForm);
        if (this.iframeUrl) {
          let fileName = this.iframeUrl.substring(
            this.iframeUrl.lastIndexOf("/") + 1,
            this.iframeUrl.lastIndexOf("?")
          ); //72c0d9d068b34cbabe812ea171f0bf94.pdf
          let data = {
            faxId: this.faxID,
            fileName,
            isSingle: true,
          };
          // let loading = this.$loading({
          //   lock: true,
          //   text: '识别中...',
          //   spinner: 'el-icon-loading',
          //   background: 'rgba(0, 0, 0, 0.7)'
          // })
          // console.log('faxAllForm: ', this.faxAllForm);
          this.$api.splitPdf(data).then((res) => {
            if (res.errorcode == 0) {
              if (res.data.length > 0) {
                this.$refs.imgToText.imageTextArr = res.data;
                this.$refs.imgToText.getPageData(res.data[0], 0);
                // console.log('imgToText:', this.$refs.imgToText)
              } else {
                this.$refs.imgToText.imageTextArr = [];
              }
              this.$refs.imgToText.flag = true;
              this.$refs.imgToText.oldFaxPath = this.iframeUrl;
              // loading.close()
            } else {
              this.$message.error(res.msg);
              this.$refs.imgToText.imageTextArr = [];
              this.$refs.imgToText.oldFaxPath = "";
              // loading.close()
            }
            // console.log('imgToText:', this.$refs.imgToText)
          });
        }
      });
    },
    // 一键复制到剪切板
    copyTextSuccess(e) {
      console.log(e);
      //复制成功
      this.$message.success("复制成功");
    },
    copyTextError() {
      this.$message.error("复制失败");
    },
    // 传真回复
    handleBtnFax(msg) {
      this.handleIcon(this.rowData, msg);
    },
    // 转发/重发/回复
    handleIcon(item, msg) {
      console.log("item: ", item);
      let addKey = {};
      if (msg === "回复") {
        this.dialogTitle = "回复传真";
        if (item.contactor || item.call) {
          // 只用来判断是不是回复传真的唯一key
          addKey["newKey"] = "newKey";
        }
      } else if (msg === "转发") {
        // 渲染文件时提供新的key传真路径,避免修改导致外部页面传真改变
        addKey["newIframeUrl"] = this.iframeUrl;
        addKey["fileName"] = item.faxFile;
        this.dialogTitle = "转发传真";
      } else {
        //重发
        // 渲染文件时提供新的key传真路径,避免修改导致外部页面传真改变
        addKey["newKey"] = "newKey";
        addKey["newIframeUrl"] = this.iframeUrl;
        addKey["fileName"] = item.faxFile;
        this.dialogTitle = "重发传真";
      }
      let resetData = {
        name: item.faxName,
        fax: item.call,
        id: item.contactId,
      };
      addKey = { ...addKey, ...resetData };
      this.contactData = addKey;
      console.log("this.contactData: ", this.contactData);
      this.relationFaxDialog = true;
    },
    // 传真合并
    handleFaxMerge() {
      this.$refs.mergeFaxDialog.isMergeFaxDialog = true;
    },
    closeFaxDialog() {
      this.$refs.mergeFaxDialog.isMergeFaxDialog = false;
      this.timerDate = new Date().getTime();
    },
    //传真拆分resolutionKey
    activeResolution() {
      if (this.iframeUrl) {
        this.$refs.resolution.flag = true;
        this.$refs.resolution.totalpage = this.totalpage;
        this.$refs.resolution.oldFaxPath =
          window.g.ApiUrl + "/fax/" + this.faxAllForm.faxFile;
      }
    },
    closeFlag() {
      this.resolutionKey = new Date().getTime();
    },
    /**
     * @description: 删除类型
     * @updateTime :2020-10-12 13:54
     * @lastEditor :xuchuangxing
     * @param {item} //删除的内容
     * @return {type}
     */
    delType(item) {
      let data = {
        item,
      };
      this.$api.allEventlist(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message.error(res.msg);
          return;
        }
        if (this.faxAllForm.type == item) {
          this.faxAllForm.type = "";
        }
        this.faxAllTypeList = this.faxAllTypeList.filter((v) => v != item);
        this.$message.success("删除成功");
      });
    },
    /**
     * @description: 列表中的顺序旋转
     * @updateTime : 2020-11-12 11:00
     * @athor : xuchuangxing
     * @lastEditor : xuchuangxing
     * @param {*}
     * @return {*}
     */
    sequentialRotationIn() {
      this.sequentialRotationApi().then((res) => {
        if (res.errorcode == 0) {
          this.getTabsActiveData();
          setTimeout(() => {
            this.faxToText();
          }, 200);
          this.$message.success("旋转成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @description: 图文识别中的顺序旋转
     * @updateTime : 2020-11-12 11:00
     * @athor : xuchuangxing
     * @lastEditor : xuchuangxing
     * @param {*}
     * @return {*}
     */
    sequentialRotationOut() {
      this.sequentialRotationApi().then((res) => {
        if (res.errorcode == 0) {
          this.getTabsActiveData();
          this.$message.success("旋转成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @description: 判断当前tab项加载初始化不同数据
     * @updateTime : 2020-11-12 16:56
     * @athor : xuchuangxing
     * @lastEditor : xuchuangxing
     * @param {*}
     * @return {*}
     */
    getTabsActiveData() {
      if (this.TabsActiveName == " ") {
        this.$refs.childrenRef.getFaxList();
      } else if (this.TabsActiveName == "发送记录") {
        this.$refs.childrenRef.getSendfaxGroupList();
      } else if (this.TabsActiveName == "联系人记录") {
        this.$refs.childrenRef.getFaxContactorList();
      }
    },
    /**
     * @description: 顺序旋转接口
     * @updateTime : 2020-11-12 11:00
     * @athor : xuchuangxing
     * @lastEditor : xuchuangxing
     * @param {*}
     * @return {*}
     */
    sequentialRotationApi() {
      return new Promise((resove, reject) => {
        let data = {
          faxId: this.faxID,
          angel: 90,
        };
        this.$api.rotatePdf(data).then((res) => {
          resove(res);
        });
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
      if (this.TabsActiveName == " ") {
        this.faxAllForm.caseId = obj.id;
        this.faxAllForm.caseTitle = obj.title;
      } else {
        this.eventID = obj.id;
        this.eventTitle = obj.title;
      }
    },
    /**
     * @description: 搜索事件
     * @author : xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-19 15:06
     * @param {*}
     * @return {*}
     */
    searchEvent() {
      this.currentPage = 1;
      this.faxAllCaseId = [];
      this.getAllEventlist();
    },
    /**
     * @description: 每次追加10条事件列表
     * @author : xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-19 15:06
     * @param {*}
     * @return {*}
     */
    loadMoreHandle() {
      this.currentPage++;
      this.getAllEventlist();
    },
  },
};
</script>

<style scoped>
.pdlr10 {
  padding: 0 10px;
}
.pdr10 {
  padding-right: 10px;
  padding-left: 28px;
}
.mgb14 {
  margin-bottom: 14px;
}
.left_box >>> .el-tabs__header {
  background: #fff;
}
.left_box >>> .el-tabs__item {
  height: 38px;
  line-height: 38px;
  font-size: 14px;
  color: #999999;
  padding: 0px 44px !important;
  background: #fbfcff;
  border: 1px solid #dddee1 !important;
}

.left_box >>> .el-tabs__item:nth-child(2),
>>> .el-tabs__item:nth-child(3) {
  padding: 0px 28px !important;
}
.left_box >>> .el-tabs__header {
  margin-bottom: 0px;
}
.left_box >>> .el-tabs__nav .is-active {
  color: #333333;
  background: white;
  border-bottom: 1px solid white !important;
}

.left_box >>> .el-tabs__nav .el-tabs__item:first-child {
  border-radius: 4px 0 0 0;
}
.left_box >>> .el-tabs__nav .el-tabs__item:last-child {
  border-radius: 0 4px 0 0;
}
.faxHistory .all_right_box .right_top_box >>> .el-form-item {
  margin-bottom: 10px;
}

.faxHistory .all_right_box .right_top_box,
.right_bottom_box {
  background: white;
  padding: 14px 14px 8px 0px;
  box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
  border-radius: 4px;
  position: relative;
}
.faxHistory .send_right_box {
  background: white;
  padding: 20px 14px 14px 0px;
  box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
  border-radius: 4px;
  position: relative;
}

.right_box h5 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  padding: 0 0 0 14px;
  margin: 0 0 0 14px;
  text-align: left;
  position: relative;
}
.right_box h5:after {
  content: "";
  width: 3px;
  height: 18px;
  background: #0091ff;
  position: absolute;
  top: 5px;
  left: 0;
}

.all_right_box .right_top_box >>> .el-button {
  position: absolute;
  top: 17px;
  right: 14px;
  z-index: 999;
  background: #0091ff;
  color: white;
  border: none;
  padding: 10px 18px;
  font-size: 16px;
}
.all_right_box .right_box >>> .el-form-item__label {
  padding: 0 12px;
}
.all_right_box .form_label_lh >>> .el-form-item__label {
  line-height: 24px;
}

.faxHistory2 .right_inner_box {
  background: white;
  margin-bottom: 15px;
  padding: 20px 14px 14px;
  box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
  border-radius: 4px;
  position: relative;
}

.iframe iframe {
  width: 460px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.iframe >>> .el-button {
  padding: 8px 8px;
  margin: 0 14px 5px 0;
}

.iframe >>> .el-button:last-of-type {
  margin-right: 0px;
}

.relationFaxDialog >>> .el-dialog__header {
  padding: 10px 15px;
}
.relationFaxDialog >>> .el-dialog__body {
  padding: 0 0 20px 0;
}
</style>
