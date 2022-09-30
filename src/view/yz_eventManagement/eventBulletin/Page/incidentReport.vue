<!--
 * @Author: your name
 * @Date: 2020-12-06 15:20:42
 * @LastEditTime: 2021-01-29 16:03:25
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
          :src="fileUrl + this.pdfData.path"
          width="100%"
          height="100%"
          frameborder="no"
          border="0"
          marginwidth="0"
          marginheight="0"
          scrolling="no"
          allowtransparency="yes"
          v-if="fileUrl + this.pdfData.path"
        ></iframe>
        <div v-else class="noFax"></div>
      </el-main>
      <el-footer>
        <el-row class="leadersApproved">
          <el-button type="primary" size="small" @click="expressPushHandle()"
            >信息上报</el-button
          >
          <el-button type="primary" size="small" @click="SeeTheHistory"
            >通讯历史</el-button
          >
          <el-button type="primary" size="small" @click="expWord"
            >导出Word</el-button
          >
        </el-row>
      </el-footer>
    </el-container>

    <div class="NoEventBulletin" v-else>暂无事件快报</div>

    <!--信息报送-->

    <express-push
      @closeExpressPush="handleClose"
      :expressPushData="expressPushData"
      v-if="expressPushVisible"
      ref="expressPush"
    ></express-push>

    <!-- 通讯历史 -->
    <informa-history
      v-show="InformaHistoryFlag"
      @closeInformaHis="closeInformaHis"
      ref="InformaHistory"
    ></informa-history>
  </div>
</template>

<script>
import expressPush from "@/view/yangZhouEventReports/page/eventBulletin/ExpressPush"; // 信息报送
import informaHistory from "@/view/yangZhouEventReports/page/eventBulletin/InformaHistory"; // 通讯历史

import bus from "@/yz_components/common/js/eventBus";
export default {
  name: "incidentReport",
  data() {
    return {
      selectExpressNews: "", // 选中的当前报文
      fileUrl: window.g.FileUrl,
      wordData: "", // 下载 word 文件路径
      pdfData: "", // 下载 和预览 pdf 文件路径
      expressPushVisible: false, // 信息报送弹窗
      expressPushTitle: "信息报送",
      expressPushData: {
        faxOrMail: "all", // 显示哪种类型弹窗 默认都显示 all:都显示  fax:只显示传真  mail:只显示邮件
        expressPushTitle: "信息上报", // 信息报送弹窗标题
        expressPushPDFUrl: "", // 传真文件
        eventDealBulletinId: "", // 事件快报Id
      },
      currentBulletin: {}, //当前选择续保信息
      InformaHistoryFlag: false, // 通讯历史弹窗
    };
  },
  components: {
    expressPush,
    informaHistory,
  },
  props: {
    eventList: {
      type: Array,
    },
  },
  mounted() {
    const that = this;

    // 添加传真/邮件联系人
    bus.$on("getCheckCharge", (data) => {
      if (data.length != 0) {
        if (this.selectType == "传真") {
          this.expressPushData.faxContacts = data;
        } else if (this.selectType == "邮件") {
          this.expressPushData.mailContacts = data;
        }
      } else {
      }
    });
  },
  methods: {
    /**
     * @description:
     * @param {*} expressNewsData
     * @return {*}
     */
    initData(expressNewsData) {
      this.currentBulletin = expressNewsData;
      this.selectExpressNews = expressNewsData.dealOrderName; // 默认显示第一个续保
      // 默认显示第一个续保PDF
      expressNewsData.appEventDealBulletin.attachmentList.map((v) => {
        if (!!v.typeName && v.typeName == "word") {
          this.wordData = v;
        } else if (!!v.typeName && v.typeName == "pdf") {
          this.pdfData = v;
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
      this.initData(expressNewsData);
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
          this.expressPushData.expressPushPDFUrl = this.pdfData.path;
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
        eventDealBulletinId: this.currentBulletin.appEventDealBulletin.id,
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
    destroyed() {
      bus.$off("getCheckCharge");
      bus.$off("activeEvent");
    },
  },
};
</script>

<style lang="scss" scoped>
.incidentReport {
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