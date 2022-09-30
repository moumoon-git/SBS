<!--
 * @Author: your name
 * @Date: 2020-12-06 15:20:42
 * @LastEditTime: 2021-01-29 15:32:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \YJJ\src\view\eventManagement\eventBulletin\Page\incidentReport.vue
-->
<template>
  <div class="incidentReport">
    <el-container v-if="eventList.length > 0">
      <el-header>
        <div class="eventTab">
          <el-radio-group
            v-model="selectExpressNews"
            size="medium"
            @change="switchBulletin"
          >
            <el-radio-button
              :label="item.dealOrderName"
              v-for="item in eventList"
              :key="item.id"
            ></el-radio-button>
          </el-radio-group>
        </div>
      </el-header>
      <el-main class="faxViewer">
        <iframe
          :src="faxUrl"
          width="100%"
          height="100%"
          frameborder="no"
          border="0"
          marginwidth="0"
          marginheight="0"
          scrolling="no"
          allowtransparency="yes"
          v-if="faxUrl"
        ></iframe>
        <div v-else class="noFax"></div>
      </el-main>
      <el-footer>
        <el-row class="leadersApproved">
          <el-button type="primary" size="small" @click="expressPushHandle()"
            >发送传真</el-button
          >
          <a :href="wordUrl" class="onlineEdit">在线编辑</a>
          <el-button type="primary" size="small" @click="expWord"
            >导出Word</el-button
          >
        </el-row>
      </el-footer>
    </el-container>

    <div class="NoEventBulletin" v-else>暂无事件快报</div>

    <!--信息报送-->
    <express-push
      @closeExpressPush="expressPushVisible = false"
      :expressPushData="expressPushData"
      v-if="expressPushVisible"
      ref="expressPush"
    ></express-push>
  </div>
</template>

<script>
import expressPush from "@/view/eventManagement/eventBulletin/Page/ExpressPush"; // 信息报送
import bus from "@/components/common/js/eventBus";
import { mapGetters } from "vuex";

export default {
  name: "incidentReport",
  data() {
    return {
      eventList: [], // 所有事件快报数据
      selectExpressNews: "", // 选中的当前报文
      fileUrl: window.g.FileUrl,
      wordData: "", // 下载 word 文件路径
      pdfData: "", // 下载 和预览 pdf 文件路径
      expressPushVisible: false, // 信息报送弹窗
      expressPushData: {
        faxOrMail: "fax", // 显示哪种类型弹窗 默认都显示 all:都显示  fax:只显示传真  mail:只显示邮件
        expressPushTitle: "发送传真", // 发送传真弹窗标题
        expressPushPDFUrl: "", // 传真文件
        eventDealBulletinId: "", // 事件快报Id
      },
      currentBulletin: {}, //当前选择续保信息
      wordUrl: "",
    };
  },
  components: {
    expressPush,
  },
  props: ["eventId", "isLinkage"], // eventId: 此事件快报复用，不使用对象形式，避免获取的值多种类型，事件Id, isLinkage: 是否左右联动
  computed: {
    ...mapGetters({
      activeEvent: "getActiveEvent", // 获取左边续报选中数据，右边联动
    }),
    faxUrl() {
      return (
        this.fileUrl +
        (this.pdfData ? this.pdfData.path : "") +
        "?timeStamp=" +
        new Date().getTime()
      );
    },
  },
  created() {
    this.getIncidentReportList();
  },

  methods: {
    /**
     * @description: 获取所有事件快报列表
     * @param {*}
     * @return {*}
     */
    async getIncidentReportList() {
      console.log("this.eventId: ", this.eventId);
      this.eventList = [];
      let data = {
        eventId: !!this.eventId
          ? this.eventId
          : sessionStorage.getItem("newID"),
      };
      let res = await this.$api.findEventDealList(data);
      if (res.errorcode == 0) {
        if (res.data && res.data.length > 0) {
          res.data.map((v) => {
            if (!!v.appEventDealBulletin) {
              this.eventList.push(v);
            }
          });
          if (this.eventList.length > 0) {
            console.log("this.eventList: ", this.eventList);
            this.selectExpressNews = !!this.isLinkage
              ? this.activeEvent.eventName
              : this.eventList[0].dealOrderName; // 初始化选中首报
            this.initData(
              !!this.isLinkage ? this.activeEvent.eventData : this.eventList[0]
            ); // 默认加载首报数据
          }
        }
      }
    },
    /**
     * @description:
     * @param {*} expressNewsData
     * @return {*}
     */
    initData(expressNewsData) {
      this.currentBulletin = expressNewsData;
      // 默认显示第一个续保PDF
      expressNewsData.appEventDealBulletin.attachmentList.map((v) => {
        if (!!v.typeName && v.typeName == "word") {
          this.wordData = v;
        } else if (!!v.typeName && v.typeName == "pdf") {
          this.pdfData = { ...v };
        }
        if (!!this.wordData && !!this.pdfData) {
          this.wordUrl = `javascript:POBrowser.openWindowModeless('${this.fileUrl}/pageoffice/word?filePath=${this.wordData.path}&pdfFilePath=${this.pdfData.path}
          ','width=1200px;height=800px;')`;
        }
      });
    },
    /**
     * @description: 导出word
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-12-06 15:45
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
     * @description: 切换事件快报
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-12-06 18:07
     * @param {*}
     * @return {*}
     */
    switchBulletin(obj) {
      let expressNewsData = this.eventList.find((v) => v.dealOrderName == obj);
      let data = {
        eventData: expressNewsData,
        eventDealId: expressNewsData.id,
        eventName: obj,
        eventProcessId: this.activeEvent.eventProcessId,
      };
      this.initData(expressNewsData);
      if (this.isLinkage) {
        this.$store.commit("setActiveEvent", data);
      }
    },
    /**
     * @description: //更改  打开联系人弹窗
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-12-06 18:09
     * @param {*} type : //显示联系人类型
     * @return {*}
     */
    expressPushHandle(type) {
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
            this.currentBulletin.appEventDealBulletin.id
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

<style lang="scss" scoped>
.incidentReport {
  .eventTab {
    text-align: left;
  }
  // 传真预览
  .faxViewer {
    width: 100%;
    height: 546px;
    .noFax {
      width: 100%;
      height: 100%;
      background: url("/static/img/faxBack.png") center no-repeat;
      background-size: 220px;
    }
  }
  .leadersApproved {
    text-align: right;
    .onlineEdit {
      text-decoration: none;
      color: white;
      background-color: #409eff;
      padding: 7px 15px;
      vertical-align: middle;
      border-radius: 3px;
      font-size: 12px;
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
    line-height: 665px;
    font-size: 12px;
    font-weight: bold;
    color: #cad5e8;
    height: 546px;
  }
}
</style>