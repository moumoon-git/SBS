<template>
  <div class="submissionReview_wrap">
    <div
      style="
        padding: 0;
        width: 100%;
        display: flex;
        align-items: center;
        position: relative;
      "
    >
      <div
        style="
          display: flex;
          align-items: center;
          position: relative;
          flex-wrap: wrap;
          justify-content: flex-start;
          flex: 7;
        "
      >
        <div
          class="aLink"
          v-for="(list, index) in buttons"
          @click="missPlan(list, index)"
          :key="index"
        >
          <div id="divButton" :class="{ red: changeRed == index }">
            <el-tooltip
              :content="list.content"
              placement="bottom"
              effect="light"
            >
              <el-button>{{ list.name }}</el-button>
            </el-tooltip>

            <!--                <el-popover-->
            <!--                  title="说明:"-->
            <!--                  width="200"-->
            <!--                  trigger="hover"-->
            <!--                 >-->
            <!--                  <div class="popover-content">{{list.content}}</div>-->
            <!--                  -->
            <!--                </el-popover>-->
          </div>
          <div v-if="buttons[index].dynamicContactor.code === 'yes'">
            <!--                <i class="el-icon-user-solid" style="font-size: 18px"  @click="setClick(index)" ></i>-->
            <!--                <i class="el-icon-warning" style="font-size: 18px"   ></i>-->
          </div>
          <div v-else-if="buttons[index].dynamicContactor.code === 'no'"></div>
        </div>
      </div>
      <!-- 提示-->
      <div
        style="height: 54px; flex: 3; width: 112px; display: flex"
        v-if="tipData"
      >
        <el-card
          shadow="hover"
          style="display: flex; font-size: 14px; width: 100%"
        >
          <div
            style="flex: 1; text-align: center; cursor: pointer"
            @click="clickBookType"
            :class="{ backCoror: indexBook == '联系人' }"
          >
            <div class="contactor_img"></div>
            <div>联系人</div>
          </div>
          <div
            style="flex: 1; text-align: center; cursor: pointer"
            @click="clickStiggeType"
            :class="{ backCoror: indexBook == '配置' }"
          >
            <div
              style="
                background: url('/static/img/svg/st.svg') center no-repeat;
                width: 100%;
                height: 30px;
              "
            ></div>
            <div>配置</div>
          </div>
        </el-card>
      </div>

      <div
        v-if="tipData"
        style="
          width: 0;
          height: 0;
          position: absolute;
          left: 68%;
          top: 44%;
          border: 8px solid #ebeef5;
          border-color: transparent #ebeef5 transparent transparent;
        "
      ></div>
    </div>
    <el-main style="padding: 10px 20px" v-if="rorcedToRefreshAll">
      <el-row>
        <el-scrollbar style="height: 100%">
          <el-col :span="11">
            <el-card shadow="always">
              <div style="padding: 5px; width: 100%">
                <el-row>
                  <el-col :span="20" id="setting">
                    <div style="width: 100%" v-if="settingInput">
                      <el-input
                        size="small"
                        style="width: 100%"
                        placeholder="请输入内容"
                        v-model="search"
                        class="input-with-select"
                      >
                        <el-button slot="append" @click="findContact"
                          >查找</el-button
                        >
                      </el-input>
                    </div>
                    <div style="width: 100%" v-if="settingSelect">
                      <el-select
                        style="width: 100%"
                        size="small"
                        v-model="flowSetting"
                        placeholder="请选择"
                        @change="processForm"
                      >
                        <el-option
                          v-for="item in flowSettingArr"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <el-button
                      type="primary"
                      icon="el-icon-refresh"
                      size="small"
                      id="iconButton"
                      @click="settingButton"
                      title="切换"
                    ></el-button>
                  </el-col>
                </el-row>
                <div>
                  <!--表格-->
                  <div>
                    <my-table
                      ref="tableEvent"
                      @handleCurrentChange="handleCurrentChange"
                      @handleDialPhone="handleDialPhone"
                      @handleDialsSpecialPlane="handleDialsSpecialPlane"
                      @handleDialsFax="handleDialsFax"
                      :tableColumn="tableColumn"
                      :tableData="tableData"
                    ></my-table>
                  </div>
                </div>
                <!--表格分页-->
                <div style="overflow-y: auto">
                  <el-pagination
                    :small="pagingSize"
                    :page-size="pageSize"
                    :total="total"
                    :current-page="currentPage"
                    @current-change="pageMode"
                    layout="total, prev, pager, next, jumper"
                  ></el-pagination>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="2">
            <div style="width: 100%; height: 60px; margin-top: 110px">
              <div class="rightIcon"></div>
            </div>
          </el-col>
          <el-col :span="11">
            <el-tabs type="border-card" v-model="msgTable" @tab-click="msg">
              <!--              <el-tab-pane label="H5短信" name="H5短信">-->
              <el-tab-pane
                :label="msgTableLabel ? '短信' : 'H5短信'"
                :name="msgTableLabel ? '短信' : 'H5短信'"
              >
                <note-check
                  ref="noteCheck"
                  :submitData.sync="submitData"
                  @initData="getAuditSubmissionList"
                ></note-check>
              </el-tab-pane>
              <el-tab-pane label="电话" name="电话">
                <phone-disposition ref="phoneDisposition"></phone-disposition>
              </el-tab-pane>
              <el-tab-pane label="传真" name="传真">
                <fax-check
                  ref="faxCheck"
                  @clearFaxList="clearFaxList"
                ></fax-check>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-scrollbar>
      </el-row>

      <el-row style="height: 300px; margin-top: 20px">
        <div v-if="nameType == '短信'" style="height: 235px">
          <el-row>
            <el-col :span="16">
              <textarea
                style="
                  border-radius: 5px 0 0 5px;
                  width: 100%;
                  height: 235px;
                  resize: none;
                  border: 1px solid #ddd;
                  padding: 0;
                "
                :style="backSms"
                v-model="submitData.smsContent"
              ></textarea>
            </el-col>
            <el-col :span="8">
              <div class="eventImg">
                <template v-if="submitData.checkImgArr.length > 0">
                  <div
                    v-for="item in submitData.checkImgArr"
                    :key="item.id"
                    class="allImg"
                  >
                    <div class="hover">
                      <img :src="item.url" alt class="oneImg" />
                      <div class="hoverStyle" @click="preview(item)">
                        <div class="preview"></div>
                      </div>
                    </div>
                    <i
                      class="iconfont icon-guanbi close"
                      @click="delImg(item.id)"
                    ></i>
                  </div>
                </template>
                <div v-else class="noImg">
                  <i class="iconfont icon-Smile icon"></i>暂无图片，请添加
                </div>
                <div class="addImg" @click="showPicture"></div>
              </div>
            </el-col>
          </el-row>

          <div class="bottomRow">
            <div class="leftSelect">
              <!-- bug12442 短信签名隐藏 -->
              <!-- <label class="export">签名:</label>
              <el-select
                v-model="submitData.signature"
                filterable
                clearable
                placeholder="请选择"
                @blur="selectBlur"
              >
                <el-option
                  v-for="item in signatureOptions"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select> -->
              <span
                style="color: #666; margin-left: 5px; fontsize: 15px"
                class="reviewer"
                >审核人：</span
              >
              <el-input
                type="text"
                readonly
                v-model="reviewer"
                show-word-limit
                :title="reviewer"
              >
                <template slot="append">
                  <el-button style="letter-spacing: 0px" @click="reviewerHandle"
                    >通讯录</el-button
                  >
                </template>
              </el-input>

              <!-- 选择人员弹窗 -->
              <selectMansDialog
                ref="selectDialog"
                selectTitle="选择联系人"
                :selectData="outerVisible"
                :maxSelect="1"
                @close="outerVisible = false"
                @closeDialog="outerVisible = false"
                @addMans="change"
                @contactorIds="
                  contactorIds = [];
                  reviewer = '';
                "
              ></selectMansDialog>
            </div>
            <div class="rightButton">
              <el-button type="primary" size="mini" @click="clcikSend"
                >确定</el-button
              >
            </div>
          </div>

          <!-- 审核报送列表 -->
          <div class="auditSubmissionData">
            <div
              v-for="item in auditSubmissionList"
              :key="item.eventSubmitApproval.id"
            >
              <div class="auditSubmissionInfo">
                <div class="auditSubmissionDetail">
                  <div class="auditSubmissionPeople" ref="more">
                    审核人：{{ item.eventSubmitApproval.contactorName }}
                  </div>
                  <div class="auditSubmissionTime">
                    {{ item.eventSubmitApproval.statusUpdateTime }}
                  </div>
                </div>
                <div
                  class="auditSubmissionStatus"
                  style="color: #ff977a; background: rgba(255, 151, 122, 0.1)"
                  v-if="item.eventSubmitApproval.status == 0"
                >
                  未提交
                </div>
                <div
                  class="auditSubmissionStatus"
                  style="color: #0091ff; background: rgba(0, 145, 255, 0.1)"
                  v-if="item.eventSubmitApproval.status == 1"
                >
                  审批中
                </div>
                <div
                  class="auditSubmissionStatus"
                  style="color: #0bd295; background: rgba(11, 210, 149, 0.1)"
                  v-if="item.eventSubmitApproval.status == 2"
                >
                  退回
                </div>
                <div
                  class="auditSubmissionStatus"
                  style="color: #f46666; background: rgba(244, 102, 102, 0.1)"
                  v-if="item.eventSubmitApproval.status == 3"
                >
                  已过审
                </div>
              </div>
              <div></div>
              <div
                class="auditSubmissionContent"
                ref="textContainer"
                :style="{ '-webkit-line-clamp': !item.onOff ? 2 : undefined }"
              >
                {{ item.eventSubmitApproval.content }}
                <div class="stretch" v-if="item.stretch !== null">
                  <i
                    class="el-icon-arrow-down"
                    style="color: rgba(0, 145, 255, 0.5)"
                    v-if="!item.onOff"
                    @click="item.onOff = !item.onOff"
                  ></i>
                  <i
                    class="el-icon-arrow-up"
                    style="color: rgba(0, 145, 255, 0.5)"
                    v-if="item.onOff"
                    @click="item.onOff = !item.onOff"
                  ></i>
                </div>
              </div>
              <div
                class="approvalOpinions"
                v-if="item.eventSubmitApproval.approvalContent"
              >
                审批意见：{{ item.eventSubmitApproval.approvalContent }}
              </div>
              <div class="auditSubmissionButton">
                <template v-if="item.eventSubmitApproval.status == 0">
                  <el-button plain size="small" @click="editHandle(item)">{{
                    item.addOrEdit ? "修改" : "恢复"
                  }}</el-button>
                  <el-button
                    plain
                    size="small"
                    @click="delApproval(item.eventSubmitApproval.id)"
                    >删除</el-button
                  >
                  <el-button
                    type="primary"
                    size="small"
                    @click="submitApproval(item.eventSubmitApproval.id)"
                    >提交审核</el-button
                  >
                </template>
                <el-button
                  v-if="item.eventSubmitApproval.status == 2"
                  type="primary"
                  size="small"
                  @click="editHandle(item)"
                  >{{ item.addOrEdit ? "引用历史" : "恢复" }}</el-button
                >
              </div>
            </div>

            <div class="framework_right_footer">
              <span>
                <span style="margin: 0 10px">/</span>
                {{ approvalPages }}
              </span>
              <el-pagination
                @current-change="handleCurrentChange"
                :page-size="approvalPageSize"
                :total="approvalTotal"
                layout="prev, pager, next, jumper"
              ></el-pagination>
            </div>
          </div>
        </div>
        <div v-if="nameType == '电话'" style="height: 235px">
          <div style="border-radius: 5px; width: 100%; height: 100%">
            <div style="height: 100%">
              <div class="dialpad">
                <div class="peopleList">
                  <el-scrollbar style="height: 100%">
                    <template v-for="(items, index) in callQueue">
                      <div
                        class="showPhone"
                        @click="clickPhone(items, index)"
                        @dblclick="openCallWindow(items)"
                        :class="{ blue: changeColor === items.mobile }"
                        :key="index"
                      >
                        <div class="showPhoneLeft">
                          <div>{{ items.mobile }}</div>
                          <div style="text-align: center"></div>
                        </div>
                        <div class="showPhoneRight">
                          <div @click="release(items, index)">
                            <i class="el-icon-video-pause"></i>
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-scrollbar>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="nameType == '传真'"
          style="height: 270px; border: 1px solid #ddd"
        >
          <div id="uploadListDom" style="border-radius: 5px; width: 100%">
            <div
              style="
                display: flex;
                justify-content: flex-end;
                border-bottom: 1px solid #ddd;
              "
            >
              <div
                style="
                  width: 100%;
                  text-align: right;
                  margin: 10px 0px;
                  padding-right: 10px;
                "
              >
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  :action="string"
                  accept=".jpg, .jpeg, .png, .pdf, .ppt, .pptx, .doc, .docx, .txt, .xlsx, .xls"
                  :limit="1"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :file-list="fileList"
                  :on-success="onSuccess"
                  :on-error="onError"
                  :before-upload="beforeUpload"
                  auto-upload
                  with-credentials
                  :show-file-list="false"
                  :on-exceed="onExceed"
                >
                  <i
                    style="
                      position: absolute;
                      left: 26px;
                      top: 20px;
                      font-size: 20px;
                    "
                    class="el-icon-full-screen"
                    @click="fullScreen"
                  ></i>
                  <el-button slot="trigger" size="small" type="primary"
                    >选择</el-button
                  >
                  <el-button size="small" type="primary" @click="expEmpty"
                    >清空</el-button
                  >
                  <el-button size="small" type="primary" @click="submitUpload"
                    >发送</el-button
                  >
                </el-upload>
              </div>
            </div>
          </div>
          <div :style="backFax" style="width: 100%; height: 215px">
            <iframe
              :src="previewPath"
              id="fpxIframe"
              width="100%"
              height="100%"
              frameborder="no"
              border="0"
              marginwidth="0"
              marginheight="0"
              scrolling="no"
              allowtransparency="yes"
            ></iframe>
          </div>
        </div>
      </el-row>
    </el-main>

    <!-- 全屏预览传真 -->
    <el-dialog
      :visible.sync="dialogVisible"
      fullscreen
      :close-on-click-modal="false"
    >
      <iframe
        :src="previewPath"
        id="iframe"
        width="100%"
        height="900px"
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
        scrolling="no"
        allowtransparency="yes"
      ></iframe>
    </el-dialog>

    <!--配置-->
    <el-dialog
      :visible.sync="submittedDisopsitionDom"
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="1200px"
      top="30px"
    >
      <submitted-disopsition
        ref="submittedDisopsition"
        @confirmDialog="confirmDialog"
      ></submitted-disopsition>
    </el-dialog>

    <!-- 添加审核报送图片 -->
    <el-dialog
      title="事件全景图片"
      :visible.sync="eventImgVisible"
      class="eventImgDialog"
      width="1010px"
      :close-on-click-modal="false"
    >
      <div
        style="
          padding: 20px 20px 3px;
          text-align: left;
          height: 625px;
          overflow: scroll;
        "
      >
        <el-checkbox-group v-model="checkList">
          <el-checkbox :label="item.id" v-for="item in imgArr" :key="item.id">
            <img :src="item.url" alt style="width: 300px; height: 180px" />
            <div class="eventImghover" @click.prevent="preview(item)">
              <div class="preview"></div>
            </div>
          </el-checkbox>
        </el-checkbox-group>
      </div>

      <el-row
        style="
          padding: 13px 20px 12px 0;
          border-top: 1px solid #f1f4f6;
          text-align: right;
        "
      >
        <el-col :span="24">
          <el-button plain size="medium" @click="eventImgVisible = false"
            >取消</el-button
          >
          <el-button type="primary" size="medium" @click="submit"
            >确认</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 预览图片 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      class="previewDialog"
      width="1000px"
      :close-on-click-modal="false"
    >
      <img :src="previewUrl" alt style="width: 100%; height: 100%" />
    </el-dialog>
  </div>
</template>

<script>
import myTable from "@/view/eventManagement/eventReports/dialog/tableCopy";
import noteCheck from "@/view/eventManagement/eventReports/Plan/iphoneCopy/noteCheckCopy"; //短信
import faxCheck from "@/view/eventManagement/eventReports/Plan/faxCheck"; //传真
import phoneDisposition from "@/view/eventManagement/eventReports/Page/share/phoneDisposition"; //电话
import submittedDisopsition from "@/view/eventManagement/eventReports/Page/share/submittedDisopsition"; //配置
import selectMansDialog from "@/view/eventManagement/eventReports/dialog/selectMansDialog";
import bus from "@/components/common/js/eventBus";

export default {
  name: "submissionReview",
  components: {
    myTable,
    noteCheck,
    faxCheck,
    phoneDisposition,
    submittedDisopsition,
    selectMansDialog,
  },
  data() {
    return {
      tipData: false,
      buttons: [], //按钮内容
      changeRed: -1, //切换按钮颜色
      search: "", //搜索
      tableColumn: [
        {
          prop: "name",
          label: "姓名",
        },
        {
          prop: "position",
          label: "职务",
        },
      ], //表头
      tableData: [], //表格数据
      total: 0, //总数据
      pageSize: 10, //每页多少条数据
      currentPage: 1, //第几页
      pagingSize: true, //分页大小
      caseId: "", //事件caseID
      flowSetting: "", //流程设置下拉选中
      flowSettingArr: [], //流程设置数组
      settingInput: false,
      settingSelect: true,
      folwId: "", //流程设置ID
      eventId: "", //事件ID
      areaId: "", //区域ID
      area: "", //区域名字
      sorter: "", //判断是表格还是查找
      // msgTable:'H5短信',
      msgTable: window.g.IsNanShanProject ? "短信" : "H5短信", // tab name
      msgTableLabel: window.g.IsNanShanProject, // tab name
      rorcedToRefreshAll: true,
      indexBook: "", //流程点击
      backSms: {
        background: "",
        backgroundSize: "",
      },
      backFax: {
        background: "",
        backgroundSize: "",
      },
      nameType: "短信", //现在使用的类型

      signatureOptions: [], //签名
      // options: [
      //   {value: '办公室', label: '办公室'},
      //   {value: '财务室', label: '财务室'},
      //   {value: '总裁办', label: '总裁办'},
      // ],//所有签名都是一样的数据
      // heightSms:{
      //   height:'300px'
      // }

      uploadForm: [], //上传成功的存储
      string: window.g.ApiUrl + "/eos/communication/fax/convertPDF", //传真默认上传路径
      fileList: [], //上传的文件的列表
      previewPath: "", //文件预览路径
      pdfPath: "", //PDF路径
      dialogVisible: false, //全屏预览传真弹窗
      linkman: "", //每次点击赋值的流程数据
      submittedDisopsitionDom: false, //配置弹窗
      outerVisible: false, // 选择审核人弹窗
      contactorIds: [], // 选择的审核人
      auditSubmissionList: [], // 审核列表
      approvalTotal: 0, // 审核数据总条数
      approvalPages: 0, // 审核数据总页数
      approvalCurrentPage: 1, // 审核当前页
      approvalPageSize: 4, // 审核每页条数

      reviewer: "", // 审核人
      submitData: {
        reviewerData: [], // 审核人信息
        signature: "", //短信签名内容
        smsContent: "", //短信内容
        approvalId: "", // 修改审批Id
        checkImgArr: [],
      }, // 提条/修改审核参数
      idx: "", // 当前审核点击的索引值
      imgArr: [
        {
          id: 591,
          picture:
            "../../../../../../static/img/ConvergedCommunication/contactorBg.png",
        },
      ], // 审核报送图片
      previewVisible: false, // 预览图片视图
      previewUrl: "", // 预览URL
      eventImgVisible: false, // 添加事件全景图片视图
      checkList: [], // 选中的图片
      baseUrl: window.g.ApiUrl,
    };
  },
  mounted() {
    this.getButton();
    this.backSms.background =
      "url(" + "/static/img/none.png" + ")center no-repeat";
    this.backSms.backgroundSize = "220px";

    this.backFax.background =
      "url(" + "/static/img/faxBack.png" + ")center no-repeat";
    this.backFax.backgroundSize = "220px";

    this.getFindSmsSign(); // 获取签名
    this.getAuditSubmissionList(); // 获取审核数据

    this.auditSubmissionList.forEach((ele, index) => {
      this.$set(
        this.auditSubmissionList,
        index,
        Object.assign({}, ele, { status: null })
      );
    });

    // 拉伸屏幕监听审核内容是否超过两行
    window.onresize = () => {
      if (this.auditSubmissionList.length > 0) {
        this.auditSubmissionList.forEach((ele, index) => {
          this.$set(
            this.auditSubmissionList,
            index,
            Object.assign({}, ele, { stretch: null })
          );
        });
        setTimeout(() => {
          this.calculateText();
        }, 0);
      }
    };

    bus.$off("auditSubmissionList");
    bus.$on("auditSubmissionList", () => {
      this.getAuditSubmissionList(); // 刷新审核数据
    });
    document.getElementsByClassName(
      "submissionReview_wrap"
    )[0].parentNode.style.height = "100%";
  },
  computed: {
    //计算属性监听全局变量进行数组操作
    callQueue() {
      return this.$store.getters.getCallQueue;
    },
    totalPages() {
      return this.approvalTotal > 0
        ? this.approvalTotal / this.approvalPageSize > 1
          ? parseInt(this.approvalTotal / this.approvalPageSize)
          : 1
        : 0;
    },
  },
  watch: {
    "submitData.smsContent": {
      handler(nV) {
        if (nV == "" || nV == null) {
          this.backSms.background =
            "url(" + "/static/img/none.png" + ")center no-repeat";
          this.backSms.backgroundSize = "220px";
        } else {
          this.backSms.background = "none";
          this.backSms.backgroundSize = "220px";
        }
      },
      deep: true,
    },
    previewPath: {
      handler(nV) {
        if (nV == "" || nV == null) {
          this.backFax.background =
            "url(" + "/static/img/faxBack.png" + ")center no-repeat";
          this.backFax.backgroundSize = "220px";
        } else {
          this.backFax.background = "none";
          this.backFax.backgroundSize = "220px";
        }
      },
      deep: true,
    },
    msgTable: {
      handler(newV) {
        let type = newV;
        console.log(newV);
        switch (type) {
          case "电话":
            this.$refs.tableEvent.eventshowPhone();
            break;
          // case 'H5短信':
          case "短信" || "H5短信":
            this.$refs.tableEvent.eventshowline();
            break;
          case "传真":
            break;
          default:
            break;
        }
      },
      deep: true,
    },
    changeRed: {
      handler(newV, oldV) {
        console.log(newV, oldV);
        if (newV != oldV) {
          this.rorcedToRefreshAll = false;
          this.tableData = [];
          this.flowSetting = "";
          this.total = 0;
          this.pageSize = 10;
          (this.currentPage = 1), //第几页
            setTimeout(() => {
              this.rorcedToRefreshAll = true;
            }, 10);
        }
      },
      deep: true,
    },
  },
  methods: {
    // 传真加入发送队列后，清空传真内容
    clearFaxList() {
      this.expEmpty();
    },
    // 获取事件全景图片
    getEventImg() {
      let data = {
        eventId: this.eventId,
      };
      this.$api.eventImg(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message.error(res.msg);
          return;
        }
        this.imgArr = res.data;
        if (this.imgArr.length > 0) {
          this.imgArr.map((v) => {
            v.url =
              v.path.indexOf(".jpg") > -1 ||
              v.path.indexOf(".jpeg") > -1 ||
              v.path.indexOf(".png") > -1
                ? this.baseUrl +
                  (v.path.substring(0, 1) == "/" ? "" : "/") +
                  v.path
                : this.baseUrl +
                  v.path +
                  (v.filename.indexOf(".jpg") > -1 ||
                  v.filename.indexOf(".jpeg") > -1 ||
                  v.filename.indexOf(".png") > -1
                    ? v.filename
                    : v.filename + v.extension);
          });
          console.log("this.imgArr: ", this.imgArr);
        }
      });
    },
    //获取短信签名
    getFindSmsSign() {
      let data;
      this.$api.findSmsSign(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message.error(res.msg);
          return;
        }
        this.signatureOptions = res.data;
      });
    },
    //获取审核列表
    getAuditSubmissionList() {
      this.clearParamsExceptSMSContent();
      let params = {
        page: this.approvalCurrentPage,
        size: this.approvalPageSize,
      };
      this.$api.auditSubmissionList(params).then((res) => {
        if (res.errorcode != 0) {
          this.$message.error(res.msg);
          return;
        }
        this.auditSubmissionList = res.data.content;
        this.approvalTotal = res.data.totalElements;
        this.approvalPages = res.data.totalPages;
        this.auditSubmissionList.map((v) => {
          v.onOff = false;
          v.addOrEdit = true;
        });
        // DOM 加载完执行
        this.$nextTick(() => {
          this.calculateText();
          //console.log(this.auditSubmissionList )
        });
        // console.log('res.data: ', res.data);
      });
    },
    clearParams() {
      this.submitData.reviewerData = [];
      this.submitData.signature = "";
      this.submitData.smsContent = "";
      this.submitData.approvalId = "";
      this.submitData.checkImgArr = "";
      this.contactorIds = [];
      this.reviewer = "";
    },
    clearParamsExceptSMSContent() {
      this.submitData.reviewerData = [];
      this.submitData.signature = "";
      //this.submitData.smsContent = ""
      this.submitData.approvalId = "";
      //this.submitData.checkImgArr = ""
      this.contactorIds = [];
      this.reviewer = "";
    },
    selectBlur(e) {
      this.submitData.signature = e.target.value;
    },
    msg(tab) {
      console.log(tab.label);
      this.msgTable = tab.label;
      // if(tab.label=='H5短信'){
      if (tab.label == "短信" || tab.label == "H5短信") {
        this.nameType = "短信";
        // this.heightSms.height=300+'px'
      }
      if (tab.label == "电话") {
        this.nameType = "电话";
      }
      if (tab.label == "传真") {
        this.nameType = "传真";
      }
      // this.nameType='传真';//先隐藏掉下面的内容
      // let h = document.documentElement.clientHeight || document.body.clientHeight
      // // this.heightSms.height=h-(68+350)+'px'
    },
    getButton() {
      //获取流程设置按钮
      this.area = sessionStorage.getItem("area");
      this.areaId = sessionStorage.getItem("areaId");
      this.caseId = sessionStorage.getItem("caseID");
      this.eventId = sessionStorage.getItem("newID");
      if (this.caseId == "" || this.caseId == null) {
        return;
      }
      if (this.eventId == "newID") {
        return;
      }

      if (this.caseId) {
        let data = {
          code: "Report",
          caseId: this.caseId,
          eventId: this.eventId,
        };
        this.$api.getFlow(data).then((res) => {
          if (res.errorcode == 0) {
            this.buttons = res.data;
            this.tipData = true;
            if (res.data == [] || res.data == null || res.data == "") {
              this.tipData = false;
            }
          }
        });
      } else {
        this.$message({
          message: "暂无事件类型",
          type: "warning",
        });
      }
    },
    missPlan(list, index) {
      this.linkman = list;
      this.changeRed = index;
      this.areaId = sessionStorage.getItem("areaId");
      this.area = sessionStorage.getItem("area");
      this.folwId = this.buttons[index].id;
      this.flowSettingArr = [];
      if (this.buttons[index].dynamicContactor.code === 'yes') {
        if (this.area) {
          this.flowSettingArr.push(
            { name: this.area + "(属地负责人)", id: 0 },
            { name: "预设人员", id: 1 },
            { name: "动态设置人员", id: 2 }
          );
        } else {
          this.flowSettingArr.push(
            { name: "预设人员", id: 1 },
            { name: "动态设置人员", id: 2 }
          );
        }
      }
      if (this.buttons[index].dynamicContactor.code === 'no') {
        if (this.area) {
          this.flowSettingArr.push(
            { name: this.area + "(属地负责人)", id: 0 },
            { name: "预设人员", id: 1 }
          );
        } else {
          this.flowSettingArr.push({ name: "预设人员", id: 1 });
        }
      }
    },
    setClick(index) {
      //设置点击按钮
      console.log(index);
      let name = [{ name: "事件联系人" }];
      if (this.buttons[index].dynamicContactor.code === 'yes') {
        console.log(index, name, this.buttons);
        let caseName = sessionStorage.getItem("caseName");
        let caseId = sessionStorage.getItem("caseID");
        this.$emit("setClick", index, name, this.buttons, caseName, caseId);
      }
    },
    processForm(value) {
      this.tableData = [];
      this.total = 0;
      console.log(value);
      console.log(this.flowSetting);
      if (this.msgTable == "电话") {
        this.$refs.tableEvent.eventshowPhone();
        // }else if(this.msgTable=='H5短信'){
      } else if (this.msgTable == "短信" || this.msgTable == "H5短信") {
        this.$refs.tableEvent.eventshowline();
      } else if (this.msgTable == "传真") {
      }
      this.sorter = "表格";
      this.currentPage = 1;
      if (this.flowSetting === 0) {
        if (this.areaId) {
          let data = {
            areaId: this.areaId,
            page: this.currentPage,
            size: this.pageSize,
          };
          this.$api.areaList(data).then((res) => {
            if (res.errorcode == "0") {
              if (res.data == []) {
                this.tableData = [];
                this.total = 0;
              } else {
                this.tableData = res.data.data;
                this.total = res.data.totalElements;
              }
            } else {
              //this.$message.error(res.msg);
            }
          });
        } else {
          this.$message({
            message: "请先选择区域",
            type: "warning",
          });
        }
      } else if (this.flowSetting === 1) {
        let data = {
          flowId: this.folwId,
          page: this.currentPage,
          size: this.pageSize,
        };
        this.$api.structList(data).then((res) => {
          if (res.errorcode == "0") {
            if (res.data == []) {
              this.tableData = [];
              this.total = 0;
            } else {
              this.tableData = res.data.data;
              this.total = res.data.totalElements;
            }
          } else {
            //this.$message.error(res.msg);
          }
        });
      } else if (this.flowSetting === 2) {
        let update = {
          flowId: this.folwId,
          page: this.currentPage,
          size: this.pageSize,
          eventId: this.eventId,
        };
        this.$api.getFlowList(update).then((res) => {
          if (res.errorcode == "0") {
            if (res.data == []) {
              this.tableData = [];
              this.total = 0;
            } else {
              this.tableData = res.data.data;
              this.total = res.data.totalElements;
            }
          } else {
            //this.$message.error(res.msg);
          }
        });
      }
    },
    settingButton() {
      //点击图标切换
      this.area = sessionStorage.getItem("area");
      this.areaId = sessionStorage.getItem("areaId");
      // this.flowSettingArr=[]
      // this.flowSetting=''
      this.flowSetting = "";
      if (this.settingInput) {
        this.settingInput = false;
      } else {
        this.settingInput = true;
      }
      if (this.settingSelect) {
        this.settingSelect = false;
      } else {
        this.settingSelect = true;
        // if(this.area){
        //   this.flowSettingArr.push(
        //     {name:this.area+'(属地负责人)',id:0},
        //   )
        // }
      }
    },
    findContact() {
      //查找联系人
      this.tableData = [];
      this.total = 0;
      if (this.search.trim() == "" || this.search == null) {
        this.$message({
          message: "请先输入查找内容",
          type: "warning",
        });
        return;
      }
      if (this.msgTable == "电话") {
        this.$refs.tableEvent.eventshowPhone();
        // }else if(this.msgTable=='H5短信'){
      } else if (this.msgTable == "短信" || this.msgTable == "H5短信") {
        this.$refs.tableEvent.eventshowline();
      } else if (this.msgTable == "传真") {
      }
      this.sorter = "查找";
      this.currentPage = 1;
      let grouping = {
        groupId: "",
        page: this.currentPage,
        size: this.pageSize,
        searchText: this.search,
        dictType: "governmentAffairs",
      };

      this.$api.contactorList(grouping).then((res) => {
        if (res.errorcode == "0") {
          if (res.data == []) {
            this.tableData = [];
            this.total = 0;
          } else {
            this.tableData = res.data.list;
            this.total = res.data.totalCount;
          }
        } else {
          //this.$message.error(res.msg);
        }
      });
    },
    handleCurrentChange(row) {
      //表格点击事件
      console.log(row);
      // this.$refs.noteCheck.get(row);
    },
    pageMode(val) {
      //监听第几页
      console.log(val);
      this.currentPage = val;
      let type = this.sorter;
      switch (type) {
        case "表格":
          this.processFormTwo();
          break;
        case "查找":
          this.findContactTwo();
          break;
        default:
          break;
      }
    },
    processFormTwo() {
      if (this.flowSetting === 0) {
        if (this.areaId) {
          let data = {
            areaId: this.areaId,
            page: this.currentPage,
            size: this.pageSize,
          };
          this.$api.areaList(data).then((res) => {
            if (res.errorcode == "0") {
              if (res.data == []) {
                this.tableData = [];
                this.total = 0;
              } else {
                this.tableData = res.data.data;
                this.total = res.data.totalElements;
              }
            } else {
              //this.$message.error(res.msg);
            }
          });
        } else {
          this.$message({
            message: "请先选择区域",
            type: "warning",
          });
        }
      } else if (this.flowSetting === 1) {
        let data = {
          flowId: this.folwId,
          page: this.currentPage,
          size: this.pageSize,
        };
        this.$api.structList(data).then((res) => {
          if (res.errorcode == "0") {
            if (res.data == []) {
              this.tableData = [];
              this.total = 0;
            } else {
              this.tableData = res.data.data;
              this.total = res.data.totalElements;
            }
          } else {
            //this.$message.error(res.msg);
          }
        });
      } else if (this.flowSetting === 2) {
        let update = {
          flowId: this.folwId,
          page: this.currentPage,
          size: this.pageSize,
          eventId: this.eventId,
        };
        this.$api.getFlowList(update).then((res) => {
          if (res.errorcode == "0") {
            if (res.data == []) {
              this.tableData = [];
              this.total = 0;
            } else {
              this.tableData = res.data.data;
              this.total = res.data.totalElements;
            }
          } else {
            //this.$message.error(res.msg);
          }
        });
      }
    },
    findContactTwo() {
      let grouping = {
        groupId: "",
        page: this.currentPage,
        size: this.pageSize,
        searchText: this.search,
        dictType: "governmentAffairs",
      };

      this.$api.contactorList(grouping).then((res) => {
        if (res.errorcode == "0") {
          if (res.data == []) {
            this.tableData = [];
            this.total = 0;
          } else {
            this.tableData = res.data.list;
            this.total = res.data.totalCount;
          }
        } else {
          //this.$message.error(res.msg);
        }
      });
    },
    handleDialPhone(row) {
      if (
        !row.mobile &&
        !row.otherTel &&
        !row.officeTel &&
        !row.homeTel &&
        !row.otherTel2 &&
        !row.temobile
      ) {
        this.$message({
          message: "该位联系人暂无联系号码",
          type: "warning",
        });
        return;
      }
      this.msgTable = "电话";
      this.nameType = "电话";
      console.log(row);
      this.$refs.phoneDisposition.ruleForm.inputMobile =
        row.mobile ||
        row.otherTel ||
        row.officeTel ||
        row.homeTel ||
        row.otherTel2 ||
        row.temobile;
      this.$refs.phoneDisposition.assignment(row);
    },
    handleDialsSpecialPlane(row) {
      // this.msgTable='H5短信'
      this.msgTable = this.msgTableLabel ? "短信" : "H5短信";
      this.nameType = "短信";
      this.$refs.noteCheck.get(row);
    },
    handleDialsFax(row) {
      if (row.fax == "" || row.fax == null) {
        this.$message({
          message: "该位联系人暂无传真号码!",
          type: "warning",
        });
        return;
      }
      this.msgTable = "传真";
      this.nameType = "传真";
      this.$refs.faxCheck.getFax(row);
    },
    clickBookType() {
      //联系人点击
      console.log(this.linkman);
      if (this.linkman) {
        let setting = this.linkman.dynamicContactor.code;
        if (setting === "yes") {
          this.indexBook = "联系人";
          let name = [{ name: "事件联系人" }];
          let caseName = sessionStorage.getItem("caseName");
          let caseId = sessionStorage.getItem("caseID");
          if (this.changeRed == "-1") {
            this.$message({
              message: "请先选择流程",
              type: "warning",
            });
            return;
          } else {
            let index = this.changeRed;
            console.log(index);
            this.$emit("setClick", index, name, this.buttons, caseName, caseId);
          }
        } else {
          this.$emit("closeContact");
          this.$message({
            message: "该流程不能设置人员！",
            type: "warning",
          });
        }
      } else {
        this.$message({
          message: "请先选择流程",
          type: "warning",
        });
      }
    },
    clcikSend() {
      //短信发送
      this.$refs.noteCheck.sendAudit();
    },
    clickStiggeType() {
      //配置点击
      this.indexBook = "配置";
      this.submittedDisopsitionDom = true;
    },
    giveDataClass() {
      this.nameType = "短信";
      this.submitData.smsContent = `${this.submitData.smsContent}${this.$store.getters.getOverallEvent}`;
    },
    clickPhone(data) {
      this.clickPhoneData = data;
      this.changeColor = data.mobile;
      this.$store.commit("setCallee", data.mobile);
      this.$store.commit("setCallClass", data.callClass);
      this.$store.commit("setCallConn", data.conn);
    },
    //重新打开callwindows方法
    openCallWindow(items) {
      this.$refs.CallWindow.callIsVisible = true;
      this.$refs.CallWindow.cid = items.cid;
      this.$store.commit("setCallee", items.mobile);
      this.$store.commit("setCallClass", items.callClass);
      this.$store.commit("setCallConn", items.conn);
    },
    release(items, key) {
      this.$confirm("是否结束当前通话?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
      }).then(() => {
        let self = this;
        if (self.HWICP_Version == "HWICP-19.0") {
          this.$icp19.DropCall(Number(self.agent_id), Number(items.conn), key);
        }
      });
    },

    //点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      console.log(file);
    },

    //传真文件移除时触发
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.pdfPath = "";
      this.previewPath = "";
      this.$refs.upload.clearFiles();
    },

    /**
     * @param {obj} response 后端返回的参数
     * @lastEditor: hexinting
     * @lastDate: 2020-9-16
     * @description 上传成功
     */
    onSuccess(response) {
      console.log(response.data);
      this.pdfPath = response.data;
      this.previewPath = `${window.g.ApiUrl}/fax/${response.data}`;
    },

    //文件提前上传失败
    onError(err) {
      console.log(err);
      this.$message({
        message: "请重新选择文件",
        type: "warning",
      });
    },

    //利用假上传获取文件判断格式
    beforeUpload(file) {
      this.uploadForm.push(file);
      console.log(file);
      let testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "jpg";
      const extension2 = testmsg === "jpeg";
      const extension3 = testmsg === "png";
      const extension4 = testmsg === "pdf";
      const extension5 = testmsg === "ppt";
      const extension6 = testmsg === "pptx";
      const extension7 = testmsg === "doc";
      const extension8 = testmsg === "docx";
      const extension9 = testmsg === "txt";
      const extension10 = testmsg === "xlsx";
      const extension11 = testmsg === "xls";
      // const isLt2M = file.size / 1024 / 1024 < 10
      if (
        !extension &&
        !extension2 &&
        !extension3 &&
        !extension4 &&
        !extension5 &&
        !extension6 &&
        !extension7 &&
        !extension8 &&
        !extension9 &&
        !extension10 &&
        !extension11
      ) {
        this.$message({
          message: "请上传正确的文件格式",
          type: "warning",
        });
      }
      // if(!isLt2M) {
      //     this.$message({
      //         message: '上传文件大小不能超过 10MB!',
      //         type: 'warning'
      //     });
      // }
      // return extension || extension2 && isLt2M
      return (
        extension ||
        extension2 ||
        extension3 ||
        extension4 ||
        extension5 ||
        extension6 ||
        extension7 ||
        extension8 ||
        extension9 ||
        extension10 ||
        extension11
      );
    },

    //文件超出个数限制时的钩子
    onExceed() {
      this.$message({
        message: "请先删除已选择的文件再进行上传!",
        type: "warning",
      });
    },

    //清空文件
    expEmpty() {
      this.pdfPath = "";
      this.previewPath = "";
      this.$refs.upload.clearFiles();
    },

    //全屏预览
    fullScreen() {
      if (this.previewPath == "" || this.previewPath == null) {
        this.$message({
          message: "请先选择传真文件在进行预览",
          type: "warning",
        });
        return;
      }
      this.dialogVisible = true;
    },

    /**
     * @lastEditor: hexinting
     * @lastDate: 2020-9-16
     * @description 发送传真
     */
    submitUpload() {
      this.$refs.faxCheck.submitUpload(this.uploadForm, this.pdfPath);
    },

    //配置弹窗关闭事件
    handleClose() {
      this.submittedDisopsitionDom = false;
    },

    //配置弹窗确定
    confirmDialog() {
      this.submittedDisopsitionDom = false;
    },
    // 选择审核人
    reviewerHandle() {
      this.outerVisible = true;
      console.log("this.contactorIds: ", this.contactorIds);
      // this.$refs.selectDialog.checkboxGroup = this.contactorIds;
      this.$refs.selectDialog.checkData(this.contactorIds, this.reviewer);
    },
    // 选择审核人返回的数据
    change(checkboxGroup, checkboxData) {
      this.submitData.reviewerData = checkboxData;
      // console.log('checkboxData: ', checkboxData);
      this.reviewer = "";
      this.outerVisible = false;
      this.contactorIds = checkboxGroup;
      checkboxData.map((v) => {
        this.reviewer += v.name + "，";
      });
      this.reviewer = this.reviewer.substring(0, this.reviewer.length - 1);
      // console.log('this.vcExtend1: ', this.vcExtend1);
    },
    //页数改变
    handleCurrentChange(val) {
      console.log("val: ", val);
      this.approvalCurrentPage = val;
      this.getAuditSubmissionList();
    },
    // 删除审核记录
    delApproval(id) {
      let data = {
        id,
      };
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api.delAudit({ data }).then((res) => {
            if (res.errorcode == "0") {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.getAuditSubmissionList();
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 提交审核
    submitApproval(id) {
      let data = {
        id,
      };
      this.$api.submitApproval({ data }).then((res) => {
        if (res.errorcode == "0") {
          this.$message({
            message: "提交审核成功",
            type: "success",
          });
          this.getAuditSubmissionList();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 计算文字 显示展开 收起
    calculateText() {
      // 获取一行文字的height 计算当前文字比较列表文字
      let oneHeight = this.$refs.more.scrollHeight;
      // console.log('oneHeight: ', oneHeight);
      let twoHeight = oneHeight * 2 || 40;
      // console.log('twoHeight: ', twoHeight);
      // this.textHeight = `${twoHeight}px`
      let txtDom = this.$refs.textContainer;
      // console.log('txtDom: ', txtDom);
      for (let i = 0; i < txtDom.length; i++) {
        let curHeight = txtDom[i].offsetHeight;
        if (curHeight > twoHeight) {
          this.$set(
            this.auditSubmissionList,
            i,
            Object.assign({}, this.auditSubmissionList[i], { stretch: true })
          );
          // console.log('this.auditSubmissionList: ', this.auditSubmissionList);
        } else {
          this.$set(
            this.auditSubmissionList,
            i,
            Object.assign({}, this.auditSubmissionList[i], { stretch: null })
          );
        }
      }
    },
    more(index) {
      this.auditSubmissionList[index].status = !this.auditSubmissionList[index]
        .status;
    },
    //
    editHandle(obj) {
      // console.log('obj: ', obj);
      if (obj.addOrEdit) {
        console.log("obj: ", obj);
        this.submitData.approvalId = obj.eventSubmitApproval.id;
        let contactData = [];
        this.submitData.reviewerData = [];
        this.reviewer = obj.eventSubmitApproval.contactorName;
        this.submitData.smsContent = obj.eventSubmitApproval.content;
        this.submitData.checkImgArr = obj.attachmentList;
        if (this.submitData.checkImgArr.length > 0) {
          this.submitData.checkImgArr.map((v) => {
            v.url =
              v.vcPath.indexOf(".jpg") > -1 ||
              v.vcPath.indexOf(".jpeg") > -1 ||
              v.vcPath.indexOf(".png") > -1
                ? this.baseUrl +
                  (v.vcPath.substring(0, 1) == "/" ? "" : "/") +
                  v.vcPath
                : this.baseUrl +
                  v.vcPath +
                  (v.vcFilename.indexOf(".jpg") > -1 ||
                  v.vcFilename.indexOf(".jpeg") > -1 ||
                  v.vcFilename.indexOf(".png") > -1
                    ? v.vcFilename
                    : v.vcFilename + v.vcExtension);
          });
        }
        this.submitData.reviewerData.push({
          id: obj.eventSubmitApproval.contactorId,
          name: obj.eventSubmitApproval.contactorName,
          mobile: obj.eventSubmitApproval.contactorPhone,
        });
        obj.eventSubmitApproval.sendContactorId.split(",").map((v, index) => {
          contactData.push({
            id: obj.eventSubmitApproval.sendContactorId.split(",")[index],
            name: obj.eventSubmitApproval.sendName.split(",")[index],
            value: obj.eventSubmitApproval.sendPhone.split(",")[index],
          });
        });
        this.$refs.noteCheck.dataName = contactData;
        // console.log('contactData: ', contactData);
        this.contactorIds = [obj.contactorId];
      } else {
        this.submitData.approvalId = "";
        this.submitData.smsContent = "";
        this.submitData.reviewerData = [];
        this.submitData.checkImgArr = [];
        this.reviewer = "";
        this.$refs.noteCheck.dataName = [];
      }
      obj.addOrEdit = !obj.addOrEdit;
    },
    // 预览图片
    preview(item) {
      this.previewVisible = true;
      this.previewUrl = item.url;
    },
    // 删除选中图片
    delImg(id) {
      this.submitData.checkImgArr = this.submitData.checkImgArr.filter(
        (v) => v.id != id
      );
    },
    // 选中的审核人
    submit() {
      this.eventImgVisible = false;
      // console.log('this.checkList: ', this.checkList);
      // console.log('this.imgArr: ', this.imgArr);
      this.submitData.checkImgArr = [...this.imgArr].filter((v) => {
        return this.checkList.indexOf(v.id) > -1;
      });
      // console.log('this.checkImgArr: ', this.submitData.checkImgArr);
    },
    // 显示事件全景图片
    showPicture() {
      this.getEventImg();
      this.eventImgVisible = true;
      if (this.submitData.checkImgArr.length > 0) {
        this.checkList = this.submitData.checkImgArr.map((v) => {
          return v.id || v.iId;
        });
      }
    },
  },
};
</script>

<style scoped>
.aLink {
  cursor: pointer;
  padding: 0 10px;
  margin: 10px 0;
}
.red {
  color: white !important;
  border: 1px solid #2d8cf0;
}
#divButton {
  color: #7e7f83;
  border-radius: 5px;
  height: 40px;
  font-size: 14px;

  cursor: pointer;
}
.setting >>> .el-select {
  width: 100%;
}
.aLink >>> .el-button {
  border: 1px solid #ddd;
}
>>> .el-card__body {
  display: flex;
  padding: 0;
  width: 100%;
}
.backCoror {
  background-color: #f9fbff;
}
.bottomRow {
  width: 100%;
  display: flex;
  height: 50px;
  line-height: 50px;
}
.export {
  color: #909399;
  vertical-align: middle;
  height: 30px;
  line-height: 30px;
  display: inline-block;
  white-space: nowrap;
  font-size: 14px;
}
.leftSelect {
  flex: 2;
  text-align: left;
}

.rightButton {
  flex: 1;
  text-align: right;
}
.leftSelect .reviewer {
  color: #666;
  margin-left: 5px;
  font-size: 15px;
}
.leftSelect >>> .el-input {
  width: 100px;
}
.leftSelect >>> .el-input-group {
  width: 150px;
}
.leftSelect >>> .el-input-group .el-button {
  padding: 0 5px;
}

.leftSelect >>> .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.rightIcon {
  width: 100%;
  height: 100%;
  background: url("/static/img/svg/row.svg") center no-repeat;
  background-size: 44px 35px;
}
#iconButton {
  padding: 4px 6px;
}
#iconButton >>> .el-icon-refresh {
  font-size: 20px;
}
.peopleList {
  height: 235px;
  border: 1px solid #ddd;
}
.showPhone {
  font-size: 0px;
  color: #fff;
  height: 30px;
  display: flex;
}

.showPhoneLeft {
  height: 30px;
  flex: 8;
  background: rgb(69, 69, 69);
}

.showPhoneRight {
  flex: 2;
  height: 30px;
  background: rgb(37, 37, 37);
}

.showPhoneLeft div {
  font-size: 14px;
  line-height: 30px;
  width: 45%;
  padding-left: 5%;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}
.showPhoneRight i {
  font-size: 20px;
  cursor: pointer;
}
.showPhoneRight div {
  font-size: 20px;
  padding: 0 10px;
  display: inline-block;
}
/* 审核报送样式 */
.auditSubmissionData {
}
.auditSubmissionData > div {
  box-shadow: 0px 8px 40px -8px rgba(54, 121, 225, 0.16);
  border-radius: 10px;
  margin: 5px 0;
}

.auditSubmissionData .auditSubmissionInfo {
  padding: 10px 10px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.auditSubmissionData .auditSubmissionInfo .auditSubmissionDetail {
}
.auditSubmissionData
  .auditSubmissionInfo
  .auditSubmissionDetail
  .auditSubmissionPeople {
  font-size: 14px;
  color: #555;
  font-weight: bold;
  text-align: left;
}
.auditSubmissionData
  .auditSubmissionInfo
  .auditSubmissionDetail
  .auditSubmissionTime {
  font-size: 12px;
  color: #999;
}
.auditSubmissionData .auditSubmissionInfo .auditSubmissionStatus {
  width: 56px;
  height: 19px;
  border-radius: 10px;
  padding: 1px;
  line-height: 19px;
  font-size: 14px;
}

.auditSubmissionData .auditSubmissionContent {
  padding-top: 5px;
  margin: 0 10px 5px;
  padding-right: 15px;
  border-top: 1px solid #f3f3f3;
  text-align: left;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  position: relative;
  font-size: 15px;
}
.auditSubmissionData .auditSubmissionContent .stretch {
  position: absolute;
  bottom: 0;
  right: 0;
}

.auditSubmissionData .approvalOpinions {
  text-align: left;
  border-top: 1px solid #f3f3f3;
  padding: 5px 10px;
  color: #999;
  font-weight: bold;
  font-size: 15px;
}
.auditSubmissionData .auditSubmissionButton {
  text-align: right;
  padding: 10px;
}

.framework_right_footer {
  position: relative;
  margin: 10px 0 5px;
}

.framework_right_footer > span {
  position: absolute;
  z-index: 100;
  top: 6px;
  bottom: 0;
  left: 51.5%;
  margin: auto;
}
.framework_right_footer >>> .el-pager > li {
  display: none !important;
}

.framework_right_footer >>> .el-pager > li:last-child {
  display: block;
  text-align: right;
}

.framework_right_footer >>> .el-pager {
  width: 95px;
  overflow: hidden;
  z-index: 99;
  position: relative;
}
.framework_right_footer >>> .el-pagination {
  position: relative;
}

.framework_right_footer >>> .el-pagination__jump {
  font-size: 0 !important;
  position: absolute;
  top: 4px;
  left: 39.5%;
  height: 25px !important;
  z-index: 100;
}

.framework_right_footer >>> .el-pagination .btn-next .el-icon,
.framework_right_footer >>> .el-pagination .btn-prev .el-icon {
  font-size: 18px;
}

.framework_right_footer >>> .el-pagination .btn-prev {
  position: absolute;
  z-index: 99;
  left: 39%;
}
.framework_right_footer >>> .el-pagination .btn-next {
  position: absolute;
  z-index: 99;
  right: 39%;
}

.framework_right_footer
  >>> .el-pagination__jump
  .el-pagination__editor.el-input,
.framework_right_footer
  >>> .el-pagination__jump
  .el-pagination__editor.el-input
  .el-input__inner {
  width: 57px;
  height: 25px;
}

.eventImg {
  height: 215px;
  border-radius: 0 5px 5px 0;
  border: 1px solid #ddd;
  border-left: none;
  padding: 10px 25px;
  position: relative;
  overflow: scroll;
}
.eventImg .noImg {
  font-size: 13px;
  color: #666;
  height: 215px;
  line-height: 215px;
}
.eventImg .allImg {
  padding: 15px 10px 0 0;
  position: relative;
}
.eventImg .allImg .hover {
  position: relative;
}
.eventImg .allImg .hover:hover .hoverStyle {
  display: block;
  background-color: rgba(5, 5, 5, 0.32);
}
.eventImg .allImg .hover .oneImg {
  width: 100%;
  height: 85px;
}
.eventImg .allImg >>> .close {
  color: rgb(0, 0, 0, 0.6);
  cursor: pointer;
  position: absolute;
  top: 7px;
  right: 3px;
}
/* 鼠标悬停样式 */
.eventImg .allImg .hoverStyle {
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
.eventImg .noImg .icon {
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
/* 预览视图 */
.previewDialog >>> .el-dialog__header {
  background-color: #f1f4f6;
  border-radius: 5px 5px 0px 0px;
  padding: 10px 0 10px 20px;
  text-align: left;
}
.previewDialog >>> .el-dialog__title {
  color: #333;
  font-size: 15px;
}
.previewDialog >>> .el-dialog__headerbtn {
  top: 12px;
  font-size: 20px;
}
.previewDialog >>> .el-dialog__headerbtn .el-dialog__close {
  color: #adb6c2;
}
.previewDialog >>> .el-dialog__body {
  padding: 0;
  width: 1000px;
  height: 500px;
}

/* 事件全景视图 */
.eventImgDialog >>> .el-dialog__header {
  background-color: #f1f4f6;
  border-radius: 5px 5px 0px 0px;
  padding: 10px 0 10px 20px;
  text-align: left;
}
.eventImgDialog >>> .el-dialog__title {
  color: #333;
  font-size: 15px;
}
.eventImgDialog >>> .el-dialog__headerbtn {
  top: 12px;
  font-size: 20px;
}
.eventImgDialog >>> .el-dialog__headerbtn .el-dialog__close {
  color: #adb6c2;
}
.eventImgDialog >>> .el-dialog__body {
  padding: 0;
}
.eventImgDialog >>> .el-checkbox {
  position: relative;
  margin: 10px;
}
.eventImgDialog >>> .el-checkbox:hover .eventImghover {
  display: block;
  background-color: rgba(5, 5, 5, 0.32);
}
.eventImgDialog .eventImghover {
  display: none;
  position: absolute;
  width: 100%;
  height: 180px;
  line-height: 180px;
  top: 0;
  cursor: pointer;
}
.eventImgDialog >>> .el-checkbox .el-checkbox__input {
  position: absolute;
  right: 18px;
  top: 19px;
}
.eventImgDialog >>> .el-checkbox .el-checkbox__input .el-checkbox__inner {
  width: 22px;
  height: 22px;
  border-radius: 50% !important;
}
.eventImgDialog >>> .el-checkbox__inner::after {
  width: 5px;
  height: 10px;
  left: 7px;
  top: 3px;
  border: 2px solid #fff;
  border-left: 0;
  border-top: 0;
}
.eventImgDialog >>> .el-checkbox__label {
  padding-left: 0;
}
.submissionReview_wrap {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.contactor_img {
  background: url("/static/img/svg/contactor.svg") center no-repeat;
  width: 100%;
  height: 30px;
}
</style>
