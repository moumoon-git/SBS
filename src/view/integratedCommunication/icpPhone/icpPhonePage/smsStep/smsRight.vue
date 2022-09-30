<template>
  <div class="my-phone-right-main">
    <div class="my-phone-right-main-user">
      <div class="my-sms-box">
        <div class="my-fax-list-box" v-if="peopleList.length > 0">
          <div
            class="my-fax-list1"
            v-for="(item, index) in peopleList"
            :key="index"
          >
            <span>{{
              item.name ||
              item.contactor ||
              item.number ||
              item.mobile ||
              item.call
            }}</span>
            <i
              class="my-fax-list1-delete el-icon-close"
              @click="myDelete(index)"
            ></i>
          </div>
        </div>

        <div class="NoSMSList" v-else>
          暂无短信队列
          <!-- <el-collapse accordion>
            <el-collapse-item v-for="item in testData" :title="item.title" :key="item.title">
              <div style="display:flex;flex-flow: wrap;">
                <div v-for="v in item.listdata" :key="v" style="width:20%;padding:10px;">
                  {{v}}
                </div>
              </div>
            </el-collapse-item>
          </el-collapse> -->
        </div>
      </div>
      <div class="my-fax-head">
        <div class="my-fax-head-left">
          收信人
          <span class="recipieNumber">{{ peopleList.length }}</span>
        </div>
        <div class="my-fax-head-right">
          <span @click="clearNumber">清空</span>
          <span class="my-fax-head-right-line"></span>
          <template v-if="selectContact">
            <span @click="selectHandle">选择通讯录</span>
            <span class="my-fax-head-right-line"></span>
          </template>
          <span @click="submitPhones">添加号码</span>
          <span class="my-fax-head-right-line"></span>
          <span @click="getContactsInfo">保存分组</span>
        </div>
      </div>

      <el-dialog
        title="存为分组"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
        custom-class="dialogVisible"
        :close-on-click-modal="false"
        :append-to-body="true"
      >
        <!-- <div class="tree">
          <el-scrollbar style="height: 100%">
            <el-tree
              :data="treeData"
              :check-on-click-node="true"
              ref="tree"
              :check-strictly="true"
              node-key="id"
              :default-expanded-keys="groupIds"
              :default-checked-keys="groupIds"
              :props="defaultProps"
            ></el-tree>
          </el-scrollbar>
        </div> -->
        <el-input v-model="GroupNameValue" placeholder="请输入分组名"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" size="medium"
            >取 消</el-button
          >
          <el-button
            type="primary"
            @click="saveGroup()"
            size="medium"
            style="margin-right: 20px"
            >保 存</el-button
          >
        </span>
      </el-dialog>
    </div>
    <div class="sendMsg">
      <el-form
        ref="form"
        label-width="80px"
        label-position="right"
        v-show="isShow"
      >
        <div class="contentModular">短信内容</div>
        <el-row :gutter="gutter" style="margin: 0 22px 12px; height: 220px">
          <el-input
            v-model="copyBusinessCard"
            type="textarea"
            placeholder="请输入短信内容"
            resize="none"
            show-word-limit
            maxlength="500"
            :autosize="{ minRows: 10, maxRows: 10 }"
          ></el-input>
        </el-row>
        <el-form-item label="关联事件" style="padding: 0 10px">
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
            <template v-if="eventOptions.length > 0">
              <ul class="eventList">
                <li
                  v-for="item in eventOptions"
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
              v-model="msgForm.caseTitle"
              readonly
              placeholder="请选择"
              size="small"
            ></el-input>
          </el-popover>

          <!-- <el-button type="primary" size="small" @click="getMsgOperatorSign">短信预览</el-button> -->
        </el-form-item>
      </el-form>
      <el-form
        v-show="!isShow"
        v-model="msgForm1"
        label-width="80px"
        @submit.native.prevent
        label-position="right"
      >
        <el-row :gutter="gutter" style="margin: 0 10px">
          <el-form-item label="短信类型:">
            <el-col :span="24">
              <el-radio-group
                ref="msgTypeRadio"
                v-model="msgForm1.msgTypeId"
               
              >
                <el-radio  v-for="(item, key) in msgType"
                :key="key" :label="item.value" style="margin-right: 10px">{{
                  item.name
                }}</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>
        </el-row>
        <!-- <el-row :gutter="gutter" style="margin: 0 10px">
          <el-form-item label="短信签名:">
            <el-col :span="13" style="padding: 0">
              <el-select
                clearable
                filterable
                v-model="msgForm1.signature"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in signatureOptions"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :offset="1" :span="4" style="padding: 0">
              <el-button plain size="small" @click="addSmsM">添加</el-button>
            </el-col>
            <el-col :offset="1" :span="4" style="padding: 0">
              <el-button plain size="small" @click="removerSmsSignature"
                >删除</el-button
              >
            </el-col>
          </el-form-item>
        </el-row>
        <el-row :gutter="gutter" style="margin: 0 10px" v-show="isSms">
          <el-form-item label="签名名称:">
            <el-col :span="16">
              <el-input
                v-model="msgForm1.signatureNew"
                placeholder="请输入签名名称"
                clearable
                size="small"
              ></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="small" @click="addSmsSignature"
                >保存</el-button
              >
            </el-col>
          </el-form-item>
        </el-row> -->
        <el-row :gutter="gutter" style="margin: 0 10px">
          <el-form-item label="定时短信:">
            <el-date-picker
              v-model="msgForm1.timedSMS"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptionsStart"
              :disabled="!msgForm1.isTimingSMS"
              value-format="timestamp"
              placeholder="选择日期时间"
              size="small"
              style="width: 240px; margin-right: 5px"
            ></el-date-picker>
            <!-- <el-checkbox v-model="msgForm1.isTimingSMS " :border="false"></el-checkbox> -->
            <el-switch v-model="msgForm1.isTimingSMS"></el-switch>
          </el-form-item>
        </el-row>
        <el-row :gutter="gutter" style="margin: 0 10px">
          <el-form-item label="催报短信:">
            <el-row :gutter="gutter" style="margin: 0">
              <!-- <el-col :span="2" style="padding:0 0"> -->
              <!-- <el-checkbox v-model="msgForm1.isUrgeSMS" :border="false"></el-checkbox> -->
              <!-- </el-col> -->
              <el-input-number
                v-model="msgForm1.times"
                :disabled="!msgForm1.isUrgeSMS"
                :min="1"
                :max="99999"
                size="small"
                style="width: 100px; margin-right: 10px"
              ></el-input-number
              >间隔:
              <el-select
                v-model="msgForm1.interval"
                :disabled="!msgForm1.isUrgeSMS"
                size="small"
                style="width: 95px"
              >
                <el-option
                  v-for="item in intervalOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-switch
                v-model="msgForm1.isUrgeSMS"
                style="margin-left: 5px"
              ></el-switch>
            </el-row>
          </el-form-item>
        </el-row>
      </el-form>
      <div class="operation">
        <div>
          <!-- <el-button icon="el-icon-document-copy" @click="showTemplate">模板</el-button> -->
          <el-tooltip class="item" effect="dark" content="更多" placement="top">
            <span class="more" @click="showMore" style="cursor: pointer"></span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="模板" placement="top">
            <span
              class="template"
              @click="showTemplateNew"
              id="container"
              style="cursor: pointer"
            ></span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="预览" placement="top">
            <span
              class="SMSPreview"
              @click="getMsgOperatorSign"
              style="cursor: pointer"
            ></span>
          </el-tooltip>
          <!-- <el-button icon="el-icon-chat-dot-round" @click="showMore">更多</el-button> -->
        </div>
        <div>
          <span class="sendPair" @click="sendPair">查看发送队列</span>
          <el-button type="primary" @click="sendMsg" size="medium"
            >发送</el-button
          >
        </div>
      </div>

      <el-dialog
        :visible.sync="msgDialogVisible"
        width="13.2%"
        :before-close="handleClose"
        :show-close="false"
        custom-class="preview"
        append-to-body
      >
        <div class="msg-dialog">
          <div
            style="
              height: 410px;
              overflow: auto;
              transform: translateY(40px);
              margin: 0 10%;
            "
          >
            <span
              >{{  copyBusinessCard
              }}{{
                msgForm1.signature ? "【" + msgForm1.signature + "】" : ""
              }}</span
            >
          </div>
        </div>

        <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="msgDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="msgDialogVisible = false">确 定</el-button>
        </span>-->
      </el-dialog>

      <!-- 存为分组确认 -->
      <el-dialog
        title="提示"
        :visible.sync="groupDialogVisible"
        width="450px"
        custom-class="groupDialog"
        :close-on-click-modal="false"
      >
        <img
          src="/static/img/ConvergedCommunication/bell.png"
          alt
          style="margin-right: 10px"
        />
        <span style="color: #555">该分组已存在数据，请确认分组保存模式</span>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="cover" size="medium"
            >覆 盖</el-button
          >
          <el-button
            type="primary"
            @click="append"
            size="medium"
            style="margin-right: 20px"
            >追 加</el-button
          >
        </span>
      </el-dialog>

      <!-- 查看发送队列 -->
      <send-pair
        v-if="sendPairVisible"
        ref="sendPair"
        @close="sendPairVisible = false"
      ></send-pair>

      <!-- 通讯录 -->
      <add-contact
        ref="addContact"
        v-if="addContactVisible"
        @changeDialog="addContactVisible = false"
      ></add-contact>

      <!-- 添加号码 -->
      <el-dialog
        title="添加号码"
        :visible.sync="isAddNumberShow"
        :before-close="handleClose"
        width="35%"
        :close-on-click-modal="false"
        :append-to-body="true"
        :modal-append-to-body="false"
        custom-class="addPhoneDialog"
      >
        <div
          v-show="showDialPlate"
          class="transition-box"
          style="display: flex; padding: 15px 20px 5px"
        >
          <dial-plate
            isShowClose="true"
            @dialing="dialing"
            style="display: inline-block"
          ></dial-plate>
          <el-input
            type="textarea"
            resize="none"
            :autosize="{ minRows: 11, maxRows: 11 }"
            v-model="phonesText1"
            placeholder="请输入号码，多个号码使用“，”隔开"
            class="dial-plate-input"
          ></el-input>
        </div>

        <div
          style="
            border-top: 1px solid #e9ecf1;
            padding: 20px 0;
            text-align: right;
          "
        >
          <el-button @click="handleClose" size="small">取 消</el-button>
          <el-button
            type="primary"
            @click="submitPhones1"
            size="small"
            style="margin-right: 20px"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>

    <!-- 模板 -->
    <!-- <msg-template
      ref="MsgTemplate"
      @selectTemplate="selectTemplate"
      v-if="MsgTemplateVisble"
      @closeDialog="MsgTemplateVisble = false"
    ></msg-template> -->
    <!-- 模板弹窗 -->
    <MessagesTemplateDialog
      ref="MessagesTemplateDialog"
      @choose-template="handleChooseTemplate"
    />
  </div>
</template>

<script>
import { getMsgOperatorSign } from "../../../../../assets/interface/interface";
import sendPair from "./sendPair";
import addContact from "./addContact/AddContact";
import dialPlate from "@/components/dialPlate";
import MsgTemplate from "@/view/integratedCommunication/icpSms/informationTransmission/msgTemplate";
import bus from "@/components/common/js/eventBus";
import { mapGetters } from "vuex";
// 短信模板
import SMSDispatchRightBottomMessagesTemplateDialog from '@/views/modules/sys/combined/SMSDispatch/SMSDispatchRight/SMSDispatchRightBottom/SMSDispatchRightBottomMessagesTemplateDialog/SMSDispatchRightBottomMessagesTemplateDialog.vue';

export default {
  components: {
    sendPair,
    addContact,
    dialPlate,
    MsgTemplate,
    MessagesTemplateDialog: SMSDispatchRightBottomMessagesTemplateDialog,
  },
  props: {
    selectContact: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  data() {
    return {
      testData: [
        {
          title: "奖金",
          listdata: [
            "全勤奖",
            "绩效奖金",
            "年终奖",
            "法定节假日三薪",
            "年底双薪",
            "工龄奖",
          ],
        },
        {
          title: "工资/补助",
          listdata: [
            "餐补",
            "房补",
            "保底工资",
            "话补",
            "晚班补贴",
            "高温补贴",
            "交通补贴",
            "底薪加提成",
          ],
        },
        {
          title: "企业福利",
          listdata: [
            "包吃",
            "包住",
            "8小时工作制",
            "环境好",
            "弹性工作",
            "员工旅游",
            "老板好",
            "帅哥美女多",
            "不加班",
            "就近分配",
            "环境好",
            "免费培训",
            "员工聚餐",
            "晋升空间大",
            "生日福利",
            "宿舍有空调",
          ],
        },
      ],
      msmEventFlag: true, //信息处置使用
      msgHeadleState: "no", //信息处置使用 初始值是no
      dialogVisible: false,
      msgDialogVisible: false, // 短信预览
      treeData: [],
      groupIds: [-2], // 选中分组ids
      pickerOptionsStart: {
        disabledDate(time) {
          return (
            time.getTime() < new Date(new Date().toLocaleDateString()).getTime()
          );
        },
      },
      msgForm1: {
        msgTypeId: "",
        signature: "",
        signatureNew: "",
        isTimingSMS: false, //是否为定时短信
        timedSMS: Number(new Date()), //定时短信
        interval: "",
        isUrgeSMS: false,
        times: "",
      },
      isTimingSMS: false,
      intervalOptions: [
        {
          label: "1分钟",
          value: 1,
        },
        {
          label: "3分钟",
          value: 3,
        },
        {
          label: "5分钟",
          value: 5,
        },
        {
          label: "10分钟",
          value: 10,
        },
        {
          label: "15分钟",
          value: 15,
        },
      ], //间隔选择框
      isSms: false,
      seatNumber: sessionStorage.getItem("seat"),
      agent_id: sessionStorage.getItem("agent_id"),
      HWICP_Version: window.g.HWICP_Version, //icp版本
      // peopleList: [],
      findfaxNumber: [],
      gutter: 20,
      msgType: {
        id: "",
        name: "",
      }, //短信类型
      msgForm: {
        caseId: "", //事件Id
        caseTitle: "", //事件标题
        msgContent: "", //短信内容
        msgTypeId: 1, //短信类型Id
        signature: "", //短信签名
        timedSMS: Number(new Date()), //定时短信
        times: "", //发送次数
        interval: "", //间隔
      }, //表单变量
      eventOptions: [], //事件选择框属性
      contentid: "", //主键id
      isShow: true,
      signatureOptions: [], //短信签名选择框
      signatureId: "",
      reEdit: false, //是否重新编辑
      defaultProps: {
        children: "children",
        label: "name",
        plusIcon: true,
      },
      contactsList: [], // 存为分组前的联系人列表
      msgOperatorSign: "", // 短信平台签名
      sendPairVisible: false, // 查看队列试图
      groupDialogVisible: false, // 短信确认弹窗
      addContactVisible: false, //选择通讯录
      phonesText1: "", // 号码字符串
      isAddNumberShow: false, //添加号码弹窗
      showDialPlate: true, // 键盘试图
      MsgTemplateVisble: false, // 模板视图
      keys: "",
      visible: false,
      currentPage: 1, // 事件列表页码
      searchText: "", // 事件列表搜索关键字
      loadMore: true, // 是否有更多事件数据
      GroupNameValue:''
    };
  },
  created() {
    // this.$refs.MessagesTemplateDialog.init();
    let name = sessionStorage.getItem("name");
    let mobile = sessionStorage.getItem("mobile");
    let remark = sessionStorage.getItem("remark");
    let historyContactor = sessionStorage.getItem(
      "historyContactor",
      this.contactorId
    );
    if (name != "" && name != null && mobile != "" && mobile != null) {
      this.peopleList = [
        {
          contactorId: historyContactor,
          name: name,
          mobile: mobile,
        },
      ];
      sessionStorage.removeItem("name");
      sessionStorage.removeItem("mobile");
      sessionStorage.removeItem("historyContactor");
      // this.msgForm.msgContent=remark.replace(/××/, "<input type='text'></input>")
    } else if (remark != "" && remark != null) {
      this.$store.commit("setCopy", remark);
      sessionStorage.removeItem("remark");
      // this.msgForm.msgContent=remark.replace(/××/, "<input type='text'></input>")
    }
    console.log(this.peopleList);
    this.getEventOptions();
    this.getSmsType();
    this.getFindSmsSign();
    var that = this;
    // this.$bus.$on("clearNumber", function() {
    //   that.clearNumber();
    // });
  },
  watch: {
    "$store.state.isMsgContactsUpdate": {
      deep: true,
      handler: function (newVal, oldVal) {
        console.log(newVal, oldVal);
      },
    },
    "msgForm1.isTimingSMS"(newV) {
      if (newV) {
        this.msgForm1.isUrgeSMS = !newV;
        this.msgForm1.times = newV;
      }
    },
    "msgForm1.isUrgeSMS"(newV) {
      if (newV) {
        this.msgForm1.isTimingSMS = !newV;
        // this.msgForm1.timedSMS = newV
      }
    },
  },
  computed: {
    ...mapGetters({
      peopleList: "getSmsMember",
    }),
    // 复制名片
    copyBusinessCard: {
      get() {
        return this.$store.state.copyBusinessCard;
      },
      set(val) {
        this.$store.commit("setCopyBusinessCard", val);
      },
    },
    selectEventStyle() {
      return function (eventId) {
        if (this.msgForm.caseId == eventId) {
          return "color:#0091ff;background-color:rgba(0, 145, 255, .1);";
        } else {
          return "";
        }
      };
    },
  },
  mounted() {
    const that = this;
    bus.$off("getCheckCharge");
    bus.$on("getCheckCharge", (data) => {
      if (data.length != 0) {
        let arr = [];
        data.forEach((ele) => {
          arr.push(ele);
        });
        // that.peopleList = arr
        that.$store.commit("setSmsMember", arr);
        // console.log(that.peopleList)
      } else {
        that.$store.commit("setSmsMember", []);
      }
    });
    // this.getFaxList()
    // this.fileListTime = setInterval(this.getRemainTime,1000)
  },
  methods: {
    /**
     * @description 设置短信类型
     */
    setMsgType(type) {
      const filterMsgType = this.msgType.filter((el) => el.name === type || el.id === type);
      if (filterMsgType.length > 0) {
        const { id } = filterMsgType[0];
        this.msgForm1.msgTypeId = id;
      }
    },
    saveGroup(){
      let numberStr = ``
      this.peopleList.forEach((item,index)=>{
        numberStr+=item.mobile1||item.phone||item.mobile2||item.otherTel||item.number
        if(index<this.peopleList.length-1){
          numberStr+=`,`
        }
      })
      console.log('numberStr',numberStr)
      let idStr = ``
      this.peopleList.forEach((item,index)=>{
        idStr += item.contactorId || item.id;
        if (index < this.peopleList.length - 1) {
          idStr += `,`
        }
      })
      console.log('idStr', idStr);
      let data = {
        id: -1,
        mailGroup: [],
        messageGroup: [],
        name: this.GroupNameValue,
        phone: numberStr,
        parentId:0,
        userIds: idStr,
      }
      this.$api.addNewGroup(data).then((res) => {
        if (res.code != 0) {
          this.$message.error(res.msg);
          return;
        }
        this.$message.success("添加成功!");
        this.dialogVisible = false;
      });
    },
    handleClose(done) {
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {
      //   });
      this.phonesText1 = "";
      this.dialogVisible = false;
      this.msgDialogVisible = false;
      this.isAddNumberShow = false;
    },

    showMsgContent(data) {
      this.msgForm.msgTypeId = data.smstypeId;
      this.$store.commit("setCopy", data.content);
      this.msgId = data.id;
      this.validateEvent(data.caseId);
      if (data.isUrgeSMS == "true") {
        this.isUrgeSMS = true;
        this.msgForm1.times = data.count;
        this.msgForm1.interval = data.interval;
      } else {
        this.msgForm1.isUrgeSMS = false;
      }
      this.reEdit = true;
    },
    addSmsM() {
      //
      this.isSms = !this.isSms;
    },
    //根据短信签名校验id
    validateSmsSignature(name) {
      for (let key in this.signatureOptions) {
        if (this.signatureOptions[key].value == name)
          this.signatureId = this.signatureOptions[key].id;
      }
    },
    //删除短信签名
    removerSmsSignature() {
      if (this.msgForm1.signature == "" || this.msgForm1.signature == null) {
        this.$message.error("请选择需要删除的签名!");
        return false;
      }
      this.validateSmsSignature(this.msgForm1.signature);
      let data = {
        id: this.signatureId,
      };
      this.$api.deleteSmsSign(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message.error(res.msg);
          return;
        }
        this.$message.success("删除成功!");
        this.signatureId = null;
        this.msgForm1.signature = "";
        this.getFindSmsSign();
      });
    },
    //添加短信签名
    addSmsSignature() {
      if (
        this.msgForm.signatureNew == "" ||
        this.msgForm1.signatureNew == null
      ) {
        this.$message.error("短信签名不能为空!");
        return;
      }

      let data = {
        data: {
          value: this.msgForm1.signatureNew,
        },
      };
      this.$api.addSmsSign(data).then((res) => {
        if (res.errorcod != 0) {
          this.$message.success("保存成功!");
          this.msgForm1.signature = "";
          this.msgForm1.signatureNew = "";
          this.isSms = false;
          this.getFindSmsSign();
        } else {
          this.$message.error(res.msg);
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
    selectTemplate(item) {
      // console.log('item: ', item);
      if (item.id != "") {
        this.contentid = item.id;
      }
      this.copyBusinessCard = item.text;
      this.$store.commit("setCopy", item.text);
      // this.$emit("showTemple", false);
      this.MsgTemplateVisble = false;
    },
    //显示更多
    showMore() {
      this.isShow = !this.isShow;
    },
    showTemplate() {
      this.MsgTemplateVisble = true;
      this.$nextTick(() => {
        this.$refs.MsgTemplate.getSmsMould();
      });
    },
    // 移植通讯调度的选择短信模板start
    // 打开选择模板弹框
    showTemplateNew(){
      this.$refs.MessagesTemplateDialog.init();
    },
    /**
     * @description 更新编辑值为模板值
     */
    handleChooseTemplate(templateContent) {
      if (templateContent.length > 0) {
        this.copyBusinessCard = templateContent
      }
    },
    // 移植通讯调度的选择短信模板end

    //获取短信类型
    getSmsType() {
      let data;
      this.$api.smsType(data).then((res) => {
        if (res.errorcode != 0) {
          this.$message.error(res.msg);
          return;
        }
        if (!res.data || res.data.length==0) {
          return
        }
        this.msgType = res.data;
        this.msgForm.msgTypeId = res.data[0].id;
      });
    },
    sendMsg() {
      if (this.copyBusinessCard == "" || this.copyBusinessCard == null) {
        this.$message.warning("短信内容不能为空!");
        return;
      }
      if (this.peopleList.length == 0) {
        this.$message.warning("请添加收信人!");
        return;
      } else {
        this.$confirm("确认发送短信?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            if (!this.msgForm1.isUrgeSMS) {
              this.addSmsQueue(); //不是催报短信发送方法
            } else {
              this.addPromptSmsQueue();
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消发送",
            });
          });
      }
    },
    addPromptSmsQueue() {
      //发现这里还没有调接口，这里是更多选项里的
      let phones = [];
      let contactorIds = [];
      for (let i = 0; i < this.peopleList.length; i++) {
        phones.push(
          Number(this.peopleList[i].number || this.peopleList[i].mobile)
        );
        contactorIds.push(this.peopleList[i].id);
      }
      let phoneArry = [...new Set(phones)];
      let msgcontent;
      let caseId;

      if (this.msgForm.caseId == "") {
        caseId = 0;
      } else {
        caseId = this.msgForm.caseId;
      }
      if (
        this.msgForm1.signature == "" ||
        this.msgForm1.signature == null ||
        this.msgForm1.signature == undefined
      ) {
        msgcontent = this.copyBusinessCard;
      } else {
        msgcontent =
          this.copyBusinessCard + "【" + this.msgForm1.signature + "】";
      }

      //相同号码去重
      let json = {
        smstypeId: this.msgForm1.msgTypeId,
        caseId: this.msgForm.caseId,
        content: msgcontent,
        phoneNum: phoneArry.toString(),
        interval: this.msgForm1.interval,
        count: this.msgForm1.times,
        contactorIds: contactorIds.join(","),
      };
      let data = {
        data: json,
      };
      this.$api.addPromptSmsQueue(data).then((res) => {
        if (res.errorcode == "0") {
          this.$message({
            message: "短信下发中...",
            type: "success",
          });
          this.reEdit = false;
          // 发送成功，清空表单数据
          this.copyBusinessCard = "";
          this.msgForm.caseId = "";
          this.msgForm1.msgTypeId = '';
          this.clearNumber();
          return;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    addSmsQueue() {
      let phones = [];
      let contactorIds = [];
      for (let i = 0; i < this.peopleList.length; i++) {
        phones.push(
          Number(
            this.peopleList[i].number
              || this.peopleList[i].mobile
              || this.peopleList[i].call
              || this.peopleList[i].mobile1
              || this.peopleList[i].mobile2
          ),
        );
        contactorIds.push(this.peopleList[i].id);
      }
      let phoneArry = [...new Set(phones)];
      let msgcontent;
      let caseId;
      if (this.msgForm.caseId == "") {
        caseId = 0;
      } else {
        caseId = this.msgForm.caseId;
      }
      if (
        this.msgForm1.signature == "" ||
        this.msgForm1.signature == null ||
        this.msgForm1.signature == undefined
      ) {
        msgcontent = this.copyBusinessCard;
      } else {
        msgcontent =
          this.copyBusinessCard + "【" + this.msgForm1.signature + "】";
      }
      console.log(contactorIds);
      let json;
      //相同号码去重
      if (this.reEdit) {
        json = {
          id: this.msgId,
          reEdit: this.reEdit,
          smstypeId: this.msgForm1.msgTypeId,
          caseId: caseId,
          content: msgcontent,
          phoneNum: phoneArry.toString(),
          contactorIds: contactorIds.join(","),
        };
      } else {
        json = {
          smstypeId: this.msgForm1.msgTypeId,
          caseId: caseId,
          content: msgcontent,
          phoneNum: phoneArry.toString(),
          contactorIds: contactorIds.join(","),
        };
      }
      console.log(json);
      if (this.msgHeadleState == "yes") {
        Object.assign(json, {
          historyType: this.$store.state.msgHeadleData.sendType,
          historyId: this.$store.state.msgHeadleData.sendTypeId,
        });
      }
      if (this.msgForm1.isTimingSMS) {
        json["sendTime"] = this.msgForm1.timedSMS;
      }
      let data = {
        data: json,
      };
      this.$api.addSmsQueue(json).then((res) => {
        if (res.errorcode == "0") {
          this.$message({
            message: "短信已加入发送队列，等待发送",
            type: "success",
          });
          this.reEdit = false;
          // 发送成功，清空表单数据
          this.msgForm.caseId = "";
          this.msgForm.caseTitle = "";
          this.copyBusinessCard = "";
          this.msgForm1.msgTypeId = '';
          this.clearNumber();
          return;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //获取未办结事件
    getEventOptions() {
      let ipData = {
        dtStart: "",
        dtEnd: "",
        searchText: this.searchText,
        page: this.currentPage,
        size: 10,
      };
      this.$api.todolist(ipData).then((res) => {
        if (res.errorcode == 0) {
          this.eventOptions.push(...res.data.data);
          this.loadMore = res.data.data.length == 0 ? false : true;
        } else {
          // //this.$message.error(res.msg)
        }
      });
    },
    myDelete(index) {
      let peopleList = this.peopleList;
      peopleList.splice(index, 1);
      this.$store.commit("setSmsMember", peopleList);
      // this.findfaxNumber.splice(index, 1);
    },
    getfaxDataN(filterData) {
      let peopleList = this.peopleList;
      filterData.forEach((o, i) => {
        console.log(
          "查看号码是否有重复：",
          this.peopleList.filter((v) => v.mobile == o)
        );
        // console.log('this.peopleList: ', typeof this.peopleList);
        if (this.peopleList.filter((v) => v.mobile == o).length == 0) {
          let data = {
            phoneNum: o,
          };
          this.$api.findContactorByMobile(data).then((res) => {
            res.number = o;
            // 信息处置中，接口查找通讯录后，返回数据在mailContactor里面，因此加多一个判断
            if (res.mailContactor) {
              res.mailContactor.mobile = res.mailContactor.mobile1;
            }
            peopleList.push(res.mailContactor ? res.mailContactor : res);
          });
        }
      });
      // this.$store.commit("setSmsMember", peopleList);
      this.$emit("update:isAddNumberShow", false);
    },
    // getfaxData(data) {
    //   let data1 = Object.assign({}, data);
    //   if (this.findfaxNumber.indexOf(data1.mobile) == -1) {
    //     this.peopleList.push(data1);
    //     this.findfaxNumber.push(data1.mobile);
    //   } else {
    //     this.$message.warning("你已添加当前电话");
    //   }
    //   console.log(this.peopleList);
    // },
    submitPhones() {
      // this.$emit("update:isAddNumberShow", true);
      this.isAddNumberShow = true;
    },
    clearNumber() {
      this.$store.commit("setSmsMember", []);
      console.log("清空 sms right");
      // this.peopleList = [];
      // this.findfaxNumber = [];
    },

    // 获取所有分组
    getSMSTree() {
      this.treeData = [];
      let data = {};
      this.$api.groupCollection(data).then((res) => {
        console.log(res);
        // for (let item of res.data) {
        //   if (item.name === "短信分组") {
        //     console.log(item);
        //     this.treeData = [item];
        //   }
        // }
        this.treeData = res.data
      });
    },

    // 获取短信分组与联系人信息
    async getContactsInfo() {
      console.log(this.peopleList)
      if (this.peopleList.length === 0) {
        this.$message({
          type: "info",
          message: "请选择联系人后再保存!",
        });
        return;
      }
      await this.getSMSTree();
      this.dialogVisible = true;
      console.log(this.peopleList);
      this.contactsList = [];
      for (let item of this.peopleList) {
        let { id, contactorId, mobile } = item;
        let obj = {};
        obj.id = contactorId ? contactorId : id;
        obj.number = mobile;
        this.contactsList.push(obj);
      }
      console.log("this.contactsList: ", this.contactsList); // 获取右边短信下的联系人列表
      // 获取全部分组
      // console.log()
      // this.saveContactsToSMSGroup(contactsList)

      // console.log(this.$store.state.groupId)
    },

    // 保存联系人为短信分组
    // saveContactsToGroup() {
    //   this.keys = this.$refs.tree.getCurrentKey();
    //   this.$refs.tree.setCurrentKey();
    //   console.log(this.keys);
    //   if (!!this.keys) {
    //     let data = {
    //       searchText: "",
    //       groupId: this.keys,
    //       page: 1,
    //       size: 10,
    //       type: "sms",
    //     };
    //     this.$api.contactorList(data).then((res) => {
    //       if (res.errorcode == 0) {
    //         if (res.data.list.length > 0) {
    //           this.groupDialogVisible = true;
    //         } else {
    //           this.contactsToGroup("append");
    //         }
    //       } else {
    //         this.$message({
    //           message: res.msg,
    //           error: "error",
    //         });
    //       }
    //     });
    //   } else {
    //     this.$message.warning("请选择短信分组");
    //   }
    // },
    contactsToGroup(type) {
      let data = {};
      data = {
        groupId: this.keys,
        type,
        contactorData: this.contactsList,
      };
      this.$api.addContactsToGroup(data).then((res) => {
        if (res.errorcode != 0) {
          this.groupDialogVisible = true;
          return;
        }
        this.dialogVisible = false;
        this.groupDialogVisible = false;

        console.log(res);
        this.$message({
          message: "存为短信分组成功",
          type: "success",
        });
        this.$store.commit("getMsgContactsUpdate", true);
        console.log(this.$store.state.msgContactsUpdate);
      });
    },

    // 更新短信分组联系人
    // updateMsgGroup() {
    // },

    // 获取短信预览头部
    getMsgOperatorSign() {
      this.msgDialogVisible = true;
      // 竞意说前端先屏蔽
      // this.$api.getMsgOperatorSign().then((res) => {
      //   if (res.errorcode !== 0) {
      //     this.$message({
      //       message: res.msg,
      //       type: "error",
      //     });
      //     return;
      //   }
      //   console.log(res);
      //   this.msgOperatorSign = res.data;
      //   this.msgDialogVisible = true;
      // });

    },
    // 查看发送队列
    sendPair() {
      this.sendPairVisible = true;
    },
    // 覆盖
    cover() {
      let data = {};
      data = {
        groupId: this.keys,
        contactorData: this.contactsList,
      };
      this.contactsToGroup("overwrite");
    },
    // 追加
    append() {
      let data = {};
      data = {
        groupId: this.keys,
        contactorData: this.contactsList,
      };
      this.contactsToGroup("append");
    },
    // 选择通讯录
    selectHandle() {
      this.addContactVisible = true;
      console.log('123456479879651654643')
      console.log(this.peopleList)
      this.peopleList.forEach(item=>{
        if(item.number){
          item.name = item.number
        }
      })
      this.$nextTick(() => {
        this.$refs.addContact.getDataList("getCheckCharge", this.peopleList);
        // console.log('this.peopleList: ', this.peopleList);
      });
      this.$store.commit("setSmsOrFax", "sms");
    },
    // 添加的手机号码
    submitPhones1() {
      if (this.phonesText1.length == 0) {
        this.$message.warning("输入不能为空");
      } else {
        let data = this.phonesText1.split(/[,，]/) || [];
        data = [...new Set(data)];
        let data1 = [];
        data.forEach((o) => {
          if (/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(o)) {
            data1.push(o);
          } else {
            setTimeout(() => {
              this.$message.warning("手机号码格式错误:" + o);
            }, 500);
          }
        });

        if (data1.length == 0) {
          this.$message.warning("请输入正确的手机号码");
        } else {
          this.getfaxDataN(data1);
          // console.log(data1)
          // let addPhoneList = data1.map((value, index) => {
          //   let obj = {}
          //   obj.id = ++index * -1
          //   obj.mobile = value
          //   console.log(obj);
          //   return obj
          // })
          // console.log(addPhoneList);
          // for (let item of addPhoneList) {
          //   this.peopleList.push(item)
          // }
          // console.log(this.peopleList)
          this.handleClose();
        }
      }
    },
    //拨号盘拨号
    dialing(data) {
      console.log(data);
      if (data.phoneNumber) {
        let rowNumber = {
          number: data.phoneNumber,
        };
        console.log(rowNumber);
        console.log(this.phonesText1);
        if (this.phonesText1.length > 0) {
          console.log("存在");
          this.phonesText1 = this.phonesText1 + "," + rowNumber.number;
        } else {
          console.log("不存在");
          this.phonesText1 = rowNumber.number;
        }
        console.log(this.phonesText1);
        // this.makeCallDish(rowNumber)  //拨号盘呼叫
      }
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
      this.msgForm.caseTitle = obj.title;
      this.msgForm.caseId = obj.id;
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
      this.eventOptions = [];
      this.getEventOptions();
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
      this.getEventOptions();
    },
  },
};
</script>

<style scoped>
.my-phone-right-main {
  /* padding: 20px 0; */
  overflow: auto;
  height: calc(100vh - 200px);
  background-color: white;
}

.my-phone-right-main-user {
  background: #fff;
  padding: 0px 0 20px;
  /* border-radius: 8px; */
  font-size: 16px;
  /* border-bottom: 1px solid #d7d7d7; */
  margin-bottom: 10px;
  border-radius: 0 0 3px 3px;
}

.my-fax-head {
  padding: 0 20px;
  display: flex;
  justify-content: center;
  font-size: 14px;
  align-items: center;
}

.my-fax-head-left {
  color: #666;
  line-height: 20px;
  flex: 1;
  text-align: left;
}

.my-fax-head-left span {
  font-weight: bold;
  color: #333;
  margin: 0 5px;
}

.my-fax-head-right {
  color: #0091ff;
  display: flex;
  justify-content: center;
}

.my-fax-head-right span {
  cursor: pointer;
}

.my-fax-head-right-line {
  margin: 3.6px 10px;
  height: 14px;
  width: 1px;
  background: rgba(216, 216, 216, 1);
  opacity: 0.51;
}
.my-sms-box {
  height: 300px;
  overflow: auto;
  padding: 13px 9px;
}
.NoSMSList {
  background-image: url(/static/img/nullList.png);
  background-repeat: no-repeat;
  background-position: center;
  background-color: white;
  text-align: center;
  line-height: 420px;
  font-size: 12px;
  font-weight: bold;
  color: #cad5e8;
  height: 300px;
}
.my-fax-list-box {
  /* border: 1px solid #858585; */
  /* border-radius: 6px; */
  display: flex;
  flex-wrap: wrap;
}

.my-fax-list {
  display: flex;
  height: 30px;
  color: #858585;
  align-items: center;
}

.my-fax-list1 {
  /* margin-top: 10px; */
  height: 22px;
  line-height: 22px;
  background: rgba(250, 250, 250, 1);
  border-radius: 3px;
  border: 1px solid rgba(224, 224, 224, 1);
  padding: 0 6px 0 4px;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #555;
  margin: 0 10px 10px 0;
}

.my-fax-list1:hover {
  background: #f5faff;
  border-color: #9dbeff;
}

.my-fax-list1-left-box {
  display: inline-block;
  width: 50%;
  box-sizing: border-box;
  padding: 0 10px;
  vertical-align: middle;
  height: 30px;
}

.my-fax-list1-left-box:first-child {
  border-right: 1px solid #eae6e6;
}

.my-fax-list1-right {
  margin-left: 30px;
  color: #333333;
  font-size: 14px;
  line-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.my-fax-list1-right-left {
  margin-right: 30px;
  color: #333333;
  font-size: 14px;
  line-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.my-fax-list1-delete {
  margin: 2px 0 0 4px;
  font-size: 6px;
}

.my-fax-list1-left {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #7bc6fe;
  text-align: center;
  line-height: 20px;
  color: #fff;
  font-size: 9px;
  float: left;
  margin: 5px 0;
}

.my-flex-1 {
  flex: 1;
}

.my-delete-btn {
  width: 30px;
  width: 40px;
  line-height: 30px;
  cursor: pointer;
  text-align: center;
  margin-right: 20px;
}

.my-fax-list-middle {
  text-align: center;
  margin: 0 10px;
}

.my-fax-btn-box {
  text-align: center;
}

.my-fax-btn-box span {
  display: inline-block;
  padding: 7px 20px;
  font-size: 15px;
  color: #858585;
  margin-left: 20px;
  cursor: pointer;
}

/* 
 * @editor: qinjiaqi
 * @description：注释掉滑动条
*/
.sendMsg {
  background-color: white;
  /* border: 1px solid rgba(219, 219, 219, 1); */
  border-radius: 3px;
  /* overflow: auto; */
  padding-bottom: 20px;
}

.msg-dialog {
  /*border:1px solid green;*/
  height: 482px;
  /* overflow: scroll; */
  background: url("/static/img/msgPreview.png") no-repeat;
  background-size: 100% 100%;
}
.msg-dialog span {
  display: inline-block;
  margin: 5%;
}
</style>

<style lang="scss" scoped>
.my-phone-right-main {
  .my-phone-right-main-user {
    .my-fax-head {
      .my-fax-head-left {
        .recipieNumber {
          display: inline-block;
          text-align: center;
          margin-left: 6px;
          width: 24px;
          height: 22px;
          line-height: 22px;
          background: rgba(243, 243, 247, 1);
          border-radius: 4px;
        }
      }
    }
  }
  .sendMsg {
    .contentModular {
      margin: 12px 0 8px 12px;
      &::before {
        content: "";
        display: inline-block;
        width: 2px;
        height: 13px;
        background: rgba(0, 145, 255, 1);
        margin-right: 8px;
      }
    }
    .operation {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 10px 0 14px;
      .more {
        display: inline-block;
        width: 26px;
        height: 25px;
        background-image: url(/static/img/ConvergedCommunication/more.png);
      }
      .more:hover {
        display: inline-block;
        width: 26px;
        height: 25px;
        background-image: url(/static/img/ConvergedCommunication/moreHover.png);
      }
      .template {
        display: inline-block;
        width: 26px;
        height: 25px;
        background-image: url(/static/img/ConvergedCommunication/template.png);
      }
      .template:hover {
        display: inline-block;
        width: 26px;
        height: 25px;
        background-image: url(/static/img/ConvergedCommunication/templateHover.png);
      }
      .SMSPreview {
        display: inline-block;
        width: 26px;
        height: 25px;
        background-image: url(/static/img/ConvergedCommunication/SMSPreview.png);
      }
      .SMSPreview:hover {
        display: inline-block;
        width: 26px;
        height: 25px;
        background-image: url(/static/img/ConvergedCommunication/SMSPreviewHover.png);
      }

      .sendPair {
        color: #0091ff;
        cursor: pointer;
        margin-right: 10px;
        font-size: 14px;
      }
    }
    // 文本域，限制字数，左边显示
    /deep/ .el-textarea .el-input__count {
      right: initial;
      left: 10px;
    }
    // 表单文字
    /deep/ .el-form-item__label {
      color: #555;
    }
  }

  // 存为分组弹窗
  /deep/ .dialogVisible {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.27);
    border-radius: 5px;
    .el-dialog__header {
      background: rgba(241, 244, 246, 1);
      border-radius: 5px 5px 0px 0px;
      text-align: left;
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      .el-dialog__title {
        font-size: 13px;
        color: #333;
      }
      .el-dialog__headerbtn {
        top: 14px;
      }
    }
    .el-dialog__footer {
      padding: 15px 0px 20px;
      border-top: 1px solid #e9ecf1;
      text-align: right;
    }
  }

  // 存为分组确认弹窗
  /deep/ .groupDialog {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.27);
    border-radius: 5px;
    .el-dialog__header {
      background: rgba(241, 244, 246, 1);
      border-radius: 5px 5px 0px 0px;
      text-align: left;
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      .el-dialog__title {
        font-size: 13px;
        color: #333;
      }
      .el-dialog__headerbtn {
        top: 14px;
      }
    }
    .el-dialog__body {
      padding: 30px 71.5px;
      text-align: center;
      display: flex;
      align-items: center;
    }
    .el-dialog__footer {
      padding: 15px 0px 20px;
      border-top: 1px solid #e9ecf1;
      text-align: right;
    }
  }

  // 添加号码弹窗
  /deep/ .addPhoneDialog {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.27);
    border-radius: 5px;
    .el-dialog__header {
      background: rgba(241, 244, 246, 1);
      border-radius: 5px 5px 0px 0px;
      text-align: left;
      height: 40px;
      line-height: 40px;
      padding: 0 20px;
      .el-dialog__title {
        font-size: 13px;
        color: #333;
      }
      .el-dialog__headerbtn {
        top: 14px;
      }
    }
    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>
<style lang="scss" scoped>
/deep/ .preview {
  border-radius: 34px;
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
