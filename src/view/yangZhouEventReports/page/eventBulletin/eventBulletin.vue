<!--
 * @Author: xuchuahgxing
 * @Date: 2020-11-25 09:45:00
 * @LastEditTime: 2021-03-11 17:06:59
 * @LastEditors: Please set LastEditors
 * @Description: 事件快报模块
 * @FilePath: \SZEos2.7.1.ucse:\xuchuangxing\openLab\src\view\yangZhouEventReports\page\eventBulletin.vue
-->
<template>
  <div class="eventBulletin">
    <template v-if="eventList.length > 0">
      <el-container>
        <el-header>
          <div class="eventTab">
            <el-radio-group v-model="selectExpressNews" size="medium" @change="switchBulletin">
              <el-radio-button
                :label="item.dealOrderName"
                v-for="item in eventList"
                :key="item.eventDealId"
              ></el-radio-button>
            </el-radio-group>
          </div>
        </el-header>
        <el-main class="faxViewer">
          <iframe
            v-if="pdfData.path"
            :src="fileUrl + pdfData.path"
            :class="showApprovalOpinions?'show_leader':'fax_viewer'"
            width="100%"
            frameborder="no"
            border="0"
            marginwidth="0"
            marginheight="0"
            scrolling="no"
            allowtransparency="yes"
          />
          <div v-else class="noFax"></div>
          <el-row class="leadersApproved">
            <el-button
              type="primary"
              size="small"
              @click="expWord"
            >
              导出Word
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="expPdf"
            >
              导出PDF
            </el-button>
            <el-button
              type="primary"
              size="small"
              :disabled="showApprovalOpinions"
              @click="showLeadersApproved = true"
            >
              领导审定
            </el-button>
          </el-row>
        </el-main>
        <!-- <el-footer>
        </el-footer> -->
      </el-container>
    </template>

    <div class="NoEventBulletin" v-else>暂无事件快报</div>

    <!--领导审定-->
    <transition name="el-zoom-in-bottom">
      <div v-show="showLeadersApproved" class="leadersApproved-box">
        <div class="operation">
          <span class="blueColor" @click="SeeTheHistory">通讯历史</span>
          <el-divider direction="vertical"></el-divider>
          <span class="blueColor" @click="showLeadersApproved = false">取消操作</span>
        </div>
        <div class="approvedBy">
          <div class="approvedTitle">
            审定人
            <span class="blueColor change" @click="selectHandle('默认')">选择通讯录</span>
          </div>
          <div class="allApprovedBy">
            <el-radio-group v-model="selectApprovedById" v-if="approvedBy.length > 0">
              <el-radio :label="item.id" border v-for="item in approvedBy" :key="item.id">
                <span class="name">{{ item.name }}</span>
                <i class="iconfont icon-bohao myIconBohao" @click.stop="openTip(item, '电话')"></i>
                <i class="myIconSms yf-icon-sms" @click.stop="openTip(item, '短信')"></i>
              </el-radio>
            </el-radio-group>

            <div v-else class="NoAllApprovedBy">暂无数据</div>
          </div>
          <div class="approvedContent">审定意见</div>
          <el-input
            v-model="approvedContent"
            type="textarea"
            placeholder="请输入审定意见（非必填）"
            resize="none"
          ></el-input>
          <el-row class="approvalOpinions">
            <el-button class="agree" @click="approvedHandle('同意')" size="small">同意</el-button>
            <el-button class="disagree" @click="approvedHandle('不同意')" size="small">不同意</el-button>
          </el-row>
        </div>
      </div>
    </transition>

    <!--审定意见-->
    <transition name="el-zoom-in-bottom">
      <div v-show="showApprovalOpinions" class="leadersApproved-box">
        <div class="operation">
          <template v-if="currentExpressNewsInfo.approveStateName == '同意'">
            <span class="blueColor" @click="expressPushHandle">信息上报</span>
            <el-divider direction="vertical"></el-divider>
          </template>
          <span class="blueColor" @click="SeeTheHistory">通讯历史</span>
          <el-divider direction="vertical"></el-divider>
          <span
            class="blueColor"
            @click="
              showApprovalOpinions = false;
              showLeadersApproved = true;
            "
          >取消操作</span>
        </div>
        <div class="approvalDetails">
          <el-row class="approval">
            <el-col :span="8">
              审定结果：
              <span
                :style="{
                  color:
                    currentExpressNewsInfo.approveStateName == '同意'
                      ? '#0BD295'
                      : '#F66E6E',
                }"
              >{{ currentExpressNewsInfo.approveStateName }}</span>
            </el-col>
            <el-col :span="16">
              审定人：
              <span class="blankStyle">
                {{
                !!currentExpressNewsInfo.approvalContactor
                ? currentExpressNewsInfo.approvalContactor.name
                : ""
                }}
              </span>
            </el-col>
          </el-row>
          <el-row>
            审定意见：
            <span class="blankStyle">
              {{
              currentExpressNewsInfo.approveOpinion
              }}
            </span>
          </el-row>
        </div>
      </div>
    </transition>

    <!--信息报送-->
    <express-push
      @closeExpressPush="expressPushVisible = false"
      :expressPushData="expressPushData"
      v-if="expressPushVisible"
      ref="expressPush"
    ></express-push>

    <!-- 通讯历史 -->
    <InformaHistory
      v-show="InformaHistoryFlag"
      @closeInformaHis="closeInformaHis"
      ref="InformaHistory"
    ></InformaHistory>

    <!-- 审定短信/电话 -->
    <prompt-dialog-box
      v-if="promptConfig.visible"
      :promptDialogConfig="promptConfig"
      @cancel="promptCanCel"
      @confirm="confirm"
    ></prompt-dialog-box>
    <!--更改审定人/传真、邮件发送人 -->
    <add-contact
      ref="addContact"
      v-if="addContactVisible"
      @changeDialog="addContactVisible = false"
    ></add-contact>
  </div>
</template>

<script>
import expressPush from "@/view/yangZhouEventReports/page/eventBulletin/ExpressPush"; // 信息报送
import InformaHistory from "@/view/yangZhouEventReports/page/eventBulletin/InformaHistory"; // 通讯历史
import promptDialogBox from "@/yz_components/promptDialogBox/promptDialogBox"; // 审定短信/电话
import addContact from "@/view/yz_integratedCommunication/icpPhone/icpPhonePage/smsStep/addContact/AddContact"; // 更改

import bus from "@/yz_components/common/js/eventBus";
import { mapGetters, mapActions } from "vuex";
import mixin from "@/view/yz_integratedCommunication/icpPhone/icpPhonePage/mixin";
import mixin2 from '@/view/yangZhouEventReports/assets/js/mixin/mixin.js';

export default {
  name: "eventBulletin",
  components: {
    expressPush,
    InformaHistory,
    promptDialogBox,
    addContact,
  },
  mixins: [mixin, mixin2],
  data() {
    return {
      selectExpressNews: "", // 选中的当前报文
      currentExpressNewsInfo: "", // 选中的当前报文信息
      eventMessageUrl: "", // 传真路径
      showLeadersApproved: false, // 领导审定弹窗
      selectApprovedById: "", // 选中审定人id
      approvedBy: [], // 所有审定人数据
      approvedContent: "", // 审定意见
      showApprovalOpinions: false, // 审定意见弹窗
      expressPushVisible: false, // 信息报送弹窗
      expressPushTitle: "信息上报", // 信息报送弹窗标题
      InformaHistoryFlag: false, // 通讯历史弹窗
      promptConfig: {}, // 短信/电话弹窗参数
      sendOrCall: "", // 判断是进行短信还是电话操作
      selectContact: "", // 选中审定人信息
      addContactVisible: false, // 审定/信息报送更改弹窗
      expressPushData: {
        expressPushTitle: "发送传真", // 发送传真弹窗标题
        expressPushPDFUrl: "", // 传真文件
        eventDealBulletinId: "", // 事件快报Id
        faxOrMail: "all", // 显示哪种类型弹窗 默认都显示 all:都显示  fax:只显示传真  mail:只显示邮件
      },
      eventId: "", // 事件接报Id
      fileUrl: window.SITE_CONFIG["fileupload"],
      wordData: "", // 下载 word 文件路径
      pdfData: "", // 下载 和预览 pdf 文件路径
    };
  },
  computed: {
    ...mapGetters({
      eventList: "getEventList", // 所有事件报文数据
      activeEvent: "getActiveEvent", // 获取左边续报选中数据，右边联动
    }),
  },
  created() {
    this.getApprovedBy();

    if (this.eventList.length > 0) {
      
      console.log("this.activeEvent: ", this.activeEvent);
      this.selectExpressNews = !!this.activeEvent
        ? this.activeEvent.eventName
        : this.eventList[0].dealOrderName; // 初始化选中首报
      this.initData(
        !!this.activeEvent
          ? this.activeEvent.eventDealId
          : this.eventList[0].eventDealId
      ); // 默认加载首报数据
    }
  },
  mounted() {
    const that = this;
    console.log("approvedBy: ", this.approvedBy);

    bus.$on("getCheckCharge", (data) => {
      if (data.length != 0) {
        if (this.selectType == "传真") {
          this.expressPushData.faxContacts = data;
        } else if (this.selectType == "邮件") {
          this.expressPushData.mailContacts = data;
        } else {
          this.approvedBy = data;
          this.saveAsCommonReviewer(
            data.map((v) => {
              return v.id;
            })
          );
        }
      } else {
      }
    });
  },
  methods: {
    /**
     * @description: 初始化审定人数据
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-27 16:12
     * @param {*}
     * @return {*}
     */
    getApprovedBy(expressNewsId) {
      let params = {
        eventId: sessionStorage.getItem("newID"),
      };
      
      this.$http({ // 获取审定人数据
        url: window.g.ApiUrl + '/eos/event/appEventDealBulletin/getApprovalContacts',
        method: 'get',
        params
    }).then((res) => {
        if (res.data.errorcode == "0") {
          if (!!res.data.data) {
            this.approvedBy = res.data.data.contacts;
            this.selectApprovedById = res.data.data.lastContact;
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @description: 初始化快报数据
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-27 16:12
     * @param {*}
     * @return {*}
     */
    initData(eventDealId) {
      let data = {
        eventDealId,
      };
      this.$http({ // 获取续报信息
        url: window.g.ApiUrl + '/eos/event/appEventDealBulletin/getEventDealBulletin',
        method: 'post',
        data
    }).then((res) => {
        
        res=res.data;
        if (res.errorcode == "0") {
          this.currentExpressNewsInfo = res.data;
          if (
            !!this.currentExpressNewsInfo &&
            !!this.currentExpressNewsInfo.approvalContactor
          ) {
            this.showApprovalOpinions = true;
          }
          // 循环重新获取 word 和 PDF 避免返回顺序反了
          if (
            this.currentExpressNewsInfo &&
            !!this.currentExpressNewsInfo.attachmentList &&
            this.currentExpressNewsInfo.attachmentList.length > 0
          ) {
            this.currentExpressNewsInfo.attachmentList.map((v) => {
              if (!!v.typeName && v.typeName == "word") {
                this.wordData = v;
              } else if (!!v.typeName && v.typeName == "pdf") {
                this.pdfData = v;
              }
            });
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 将审定人 保存为常用审定人
    saveAsCommonReviewer(contactIds) {
      let data = {
        contactIds,
        eventId: sessionStorage.getItem("newID"),
      };
      this.$api.saveApprovedBy(data).then((res) => {
        if (res.errorcode == "0") {
          this.$message.success("保存为常用审定人成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @description: 切换事件快报
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-27 16:12
     * @param {*}
     * @return {*}
     */
    switchBulletin(obj) {
      let expressNewsData = this.eventList.find((v) => v.dealOrderName == obj);
      this.initData(expressNewsData.eventDealId);
      let data = {
        eventDealId: expressNewsData.eventDealId,
        eventName: obj,
        eventProcessId: this.activeEvent.eventProcessId,
      };
      this.$store.commit("setActiveEvent", data);
    },
    /**
     * @description: 关闭信息报送弹窗
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-27 16:12
     * @param {*}
     * @return {*}
     */
    handleClose() {
      this.expressPushVisible = false;
    },
    /**
     * @description: 查看通讯历史
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-27 16:12
     * @param {*}
     * @return {*}
     */
    SeeTheHistory() {
      this.$refs.InformaHistory.listData = [];
      let obj = {
        eventDealBulletinId: this.currentExpressNewsInfo.id,
      };
      this.$api.getEventBulletinHistory(obj).then((res) => {
        this.InformaHistoryFlag = true;
        if (res.errorcode == 0) {
          this.$refs.InformaHistory.listData = res.data;
        } else {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
      });
    },
    //小时
    hourTimeNum(time) {
      //大于等于一个小时
      let hourStr = "00";
      if (time >= 3600) {
        hourStr =
          parseInt(time / 3600) >= 10
            ? parseInt(time / 3600)
            : "0" + parseInt(time / 3600);
        return hourStr + "时" + this.minutes(time);
      } else {
        return this.minutes(time);
      }
    },
    //处理显示姓名
    disposeVisName(data) {
      let str = "";
      if (data.length != 0) {
        data.forEach((ele, index) => {
          if (index == data.length - 1) {
            str += ele.contactor;
          } else {
            str += ele.contactor + "、";
          }
        });
      }
      // console.log(str)
      return str;
    },
    //处理查看历史回调的数据
    lockHistory(data, type) {
      if (data.length != 0) {
        data.forEach((ele) => {
          ele.type = type;
        });
      }
    },
    /**
     * @description: 关闭通讯历史弹窗
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-27 16:12
     * @param {*}
     * @return {*}
     */
    closeInformaHis() {
      this.InformaHistoryFlag = false;
    },
    /**
     * @description: 打开短信/电话提示框
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-30 23:07
     * @param {
     *          1.name : 操作对象的人员名称
     *          2.type : 类型名 判断是点击的短信还是电话
     *        }
     * @return {*}
     */
    openTip(obj, type) {
      this.selectContact = obj;
      this.sendOrCall = type;
      // Object.assign(this.promptConfig, {
      //   visible: true, // 是否显示弹窗
      //   promptType: "default", // 弹窗类型：delete:删除提示弹窗,warn：警告提示弹窗,success：成功提示弹窗,error：错误提示弹窗,info：常规类信息提示弹窗,default：不包含icon提示弹窗
      //   promptTitle: type == "电话" ? "电话联系" : "短信发送", // 弹窗标题
      //   promptText:
      //     type == "电话"
      //       ? `是否拨打电话给${obj.name}`
      //       : `是否发送信息给${obj.name}进行审定`, // 弹窗提示文本
      //   subPomptText: "", // 二级提示文本
      //   cancelButtonText: "取消", // 取消操作按钮文本
      //   confirmButtonText: "确定", // 确认操作按钮文本
      //   isNeedIcon: false, // 是否需要显示左边的图标
      // });
      // bug 8985 author:hexinting date:2020-11-30 23:07
      this.promptConfig = {
        visible: true, // 是否显示弹窗
        promptType: "default", // 弹窗类型：delete:删除提示弹窗,warn：警告提示弹窗,success：成功提示弹窗,error：错误提示弹窗,info：常规类信息提示弹窗,default：不包含icon提示弹窗
        promptTitle: type == "电话" ? "电话联系" : "短信发送", // 弹窗标题
        promptText:
          type == "电话"
            ? `是否拨打电话给${obj.name}`
            : `是否发送信息给${obj.name}进行审定`, // 弹窗提示文本
        subPomptText: "", // 二级提示文本
        cancelButtonText: "取消", // 取消操作按钮文本
        confirmButtonText: "确定", // 确认操作按钮文本
        isNeedIcon: false, // 是否需要显示左边的图标
      };
    },
    /**
     * @description: 关闭短信/电话弹窗
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-27 16:12
     * @param {*}
     * @return {*}
     */
    promptCanCel() {
      this.promptConfig.visible = false; // 隐藏弹窗
      this.$forceUpdate();
    },
    /**
     * @description: 确定 短信/电话 进行操作
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-27 16:12
     * @param {*}
     * @return {*}
     */
    confirm() {
      this.promptConfig.visible = false; // 隐藏弹窗
      this.$forceUpdate();
      if (this.sendOrCall == "短信") {
        let data = {
          eventDealBulletinId: this.currentExpressNewsInfo.id,
          contactorId: this.selectContact.id,
        };
        this.$api.sendEventBulletin(data).then((res) => {
          if (res.errorcode == "0") {
            this.$message.success("发送短信");
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        let obj = {
          type: "eventDealBulletinPhone",
          typeId: this.activeEvent.eventDealId,
        };
        this.talkCall(this.selectContact, "", obj);
      }
    },
    /**
     * @description: 选择通讯录
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-27 16:12
     * @param {
     *          1.type 点击的类型
     *          1.selectData 要回显的数据
     *        }
     * @return {*}
     */
    selectHandle(type, selectData) {
      this.selectType = type; // 判断是哪里触发的更改弹窗
      this.addContactVisible = true;

      this.$nextTick(() => {
        if (type == "传真") {
          this.$store.commit("setSmsOrFax", "fax");
          this.$refs.addContact.getDataList(
            "getCheckCharge",
            selectData.checkFaxContactsId
          );
        } else if (type == "邮件") {
          this.$store.commit("setSmsOrFax", "email");
          this.$refs.addContact.getDataList(
            "getCheckCharge",
            selectData.checkMailContactsId
          );
        } else {
          this.$store.commit("setSmsOrFax", "sms");
          this.$refs.addContact.getDataList("getCheckCharge", this.approvedBy);
        }
      });
    },
    /**
     * @description: 获取审定人信息（selectApprovedBy） 和 切换不用审定页面（approvalOpinionsChange: 1.true:同意 2.false:不同意）
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-27 16:12
     * @param {*}
     * @return {*}
     */
    approvedHandle(type) {
      if (!this.selectApprovedById) {
        this.$message.error("请选择审定人");
        return;
      }
      let data = {
        eventDealBulletinJson: {
          eventDealId: this.currentExpressNewsInfo.eventDealId,
          id: this.currentExpressNewsInfo.id,
          approvalContactorId: this.selectApprovedById,
          approveOpinion: this.approvedContent,
        },
        state: type == "同意" ? "consent" : "dissent",
      };
      // console.log('data: ', data);
      this.$api.saveApprovalOpinions(data).then((res) => {
        if (res.errorcode == "0") {
          this.showApprovalOpinions = true;
          this.showLeadersApproved = false;

          this.initData(this.currentExpressNewsInfo.eventDealId);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    /**
     * @description: 导出word
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-27 16:12
     * @param {*}
     * @return {*}
     */
    expWord() {
      if (!!this.wordData) {
        window.open(
          `${this.fileUrl}/eos/event/sum/downloadFile?filePath=${this.wordData.path}&fileName=${this.wordData.name}`
        );
      } else {
        this.$message.warning("请先生成快报");
      }
      //
    },
    /**
     * @description: 导出PDF
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-27 16:12
     * @param {*}
     * @return {*}
     */
    expPdf() {
      if (!!this.pdfData) {
        window.open(
          `${this.fileUrl}/eos/event/sum/downloadFile?filePath=${this.pdfData.path}&fileName=${this.pdfData.name}`
        );
      } else {
        this.$message.warning("请先生成快报");
      }
      // window.location.href = this.fileUrl + this.pdfData.path;
    },
    expressPushHandle() {
      // let data = {
      //   eventId: this.currentExpressNewsInfo.id,
      // };
      // this.$api.getFaxAndEmailData(data).then((res) => {
      //   if (res.errorcode == "0") {
      //     this.faxContacts = res.data.faxData
      //     this.mailContacts = res.data.emailData
      if (this.pdfData && this.pdfData.path) {
        this.expressPushVisible = true;
        this.$nextTick(() => {
          console.log("this.pdfData: ", this.pdfData);
          this.expressPushData.expressPushPDFUrl = this.pdfData.path;
          console.log(
            "this.expressPushData.expressPushPDFUrl : ",
            this.expressPushData.expressPushPDFUrl
          );
          this.expressPushData.eventDealBulletinId = parseInt(
            this.activeEvent.eventDealId
          );
          this.$refs.expressPush.initData();
        });
      } else {
        this.$message.warning("PDF路径不存在");
      }
      //   } else {
      //     this.$message.error(res.msg);
      //   }
      // });
    },
  },
  destroyed() {
    bus.$off("getCheckCharge");
    bus.$off("activeEvent");
  },
};
</script>
s
<style lang="scss" scoped>
// @import '../../../../assets/iconYf/style.css';
.eventBulletin {
    text-align: left;
    .blueColor {
        color: #0091ff;
        cursor: pointer;
    }
    .blankStyle {
        color: #333;
    }

    // 顶部
    .eventTab {
        margin: 15px 0;
    }

    // 传真预览
    .faxViewer {
        width: 100%;
        // height: 620px;
        .noFax {
            width: 100%;
            height: 525px;
            background: url('/static/img/faxBack.png') center no-repeat;
            background-size: 220px;
        }
        .show_leader {
          height: 400px;
        }
        .fax_viewer {
          height: 520px;
        }
    }
    // 底部
    .leadersApproved {
        text-align: center;
    }

    .leadersApproved-box {
        position: absolute;
        width: 100%;
        bottom: 7px;
        left: 0;
        border-radius: 4px;
        box-sizing: border-box;
        background-color: #fff;
        box-shadow: 0px 0px 32px 4px rgba(201, 201, 201, 0.27);
        font-size: 14px;
        color: #666;

        .operation {
            color: #0091ff;
            font-size: 15px;
            text-align: right;
            margin: 21px 15px 8px 0;
        }
        .approvedBy {
            padding: 0 24px;
            .approvedTitle {
                margin-bottom: 15px;
                .change {
                    margin-left: 28px;
                }
            }
            .allApprovedBy {
                max-height: 106px;
                overflow: scroll;
            }
            .NoAllApprovedBy {
                text-align: center;
            }
            .name {
                height: 100%;
                display: inline-block;
                border-right: 1px solid#E4E7ED;
                padding-right: 6px;
                font-size: 13px;
                color: #666;
            }
            .approvedContent {
                margin: 5px 0 8px 0;
            }
            .approvalOpinions {
                text-align: center;
                margin: 32px 0 22px 0;
                .agree:hover {
                    color: #0091ff;
                    border: 1px solid #0091ff;
                    background-color: initial;
                }
                .disagree:hover {
                    color: #ff8171;
                    border: 1px solid #ff8171;
                    background-color: initial;
                }
            }
        }

        .approvalDetails {
            margin: 0 0 32px 46px;
            .approval {
                margin-bottom: 18px;
                .pepple {
                    color: #333;
                }
            }
        }
    }

    .el-radio.is-bordered {
        padding: 0px 8px 0 11px;
        line-height: 40px;
        margin: 0px 9px 9px 0;
        .el-radio__label {
            padding-left: 6px;
        }
    }
    .myIconSms {
        color: #9fc8fe;
        font-size: 12px;
        &:hover {
            color: #0091ff;
        }
    }
    .myIconBohao {
        color: #9fc8fe;
        font-size: 17px;
        &:hover {
            color: #0091ff;
        }
    }

    // 添加号码弹窗
    /deep/ .expressPushDialog {
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

    // 暂无数据样式
    .NoEventBulletin {
        background-image: url(../../../../../static/img/nullList.png);
        background-repeat: no-repeat;
        background-position: center;
        background-color: white;
        text-align: center;
        line-height: 870px;
        font-size: 12px;
        font-weight: bold;
        color: #cad5e8;
        height: 746px;
    }
}
</style>