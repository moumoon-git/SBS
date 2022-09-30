<!--
 * @Author: your name
 * @Date: 2020-11-26 17:41:08
 * @LastEditTime: 2021-02-25 15:28:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SZEos2.7.1.ucse:\xuchuangxing\openLab\src\view\yangZhouEventReports\page\expressPush.vue
-->
<template>
  <div class="expressPush">
    <el-dialog
      :title="expressPushData.expressPushTitle"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="535px"
      custom-class="expressPushDialog"
    >
      <div class="allContacts">
        <div
          v-if="
            expressPushData.faxOrMail == 'all' ||
              expressPushData.faxOrMail == 'fax'
          "
        >
          <div class="contacts">
            传真联系人
            <span class="blueStyle" @click="selectHandle('传真')"
              >选择通讯录</span
            >
          </div>
          <div class="contactsList">
            <el-checkbox-group
              v-model="checkFaxContactsId"
              size="small"
              v-if="faxContacts.length > 0"
            >
              <el-checkbox
                :label="item.id"
                border
                v-for="item in faxContacts"
                :key="item.id"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>

            <div v-else class="NoContacts">暂无数据</div>
          </div>
        </div>

        <div
          v-if="
            expressPushData.faxOrMail == 'all' ||
              expressPushData.faxOrMail == 'mail'
          "
        >
          <div class="contacts">
            邮件联系人
            <span class="blueStyle" @click="selectHandle('邮件')"
              >选择通讯录</span
            >
          </div>
          <div class="contactsList">
            <el-checkbox-group
              v-model="checkMailContactsId"
              size="small"
              v-if="mailContacts.length > 0"
            >
              <el-checkbox
                :label="item.id"
                border
                v-for="item in mailContacts"
                :key="item.id"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>

            <div v-else class="NoContacts">暂无数据</div>
          </div>
        </div>
      </div>

      <div class="operation">
        <el-button @click="handleClose" size="small">取 消</el-button>
        <el-button
          type="primary"
          @click="determine"
          size="small"
          class="determine"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!--更改审定人/传真、邮件发送人 -->
    <add-contact
      ref="addContact"
      v-if="addContactVisible"
      @changeDialog="addContactVisible = false"
    ></add-contact>
  </div>
</template>

<script>
import addContact from "@/view/integratedCommunication/icpPhone/icpPhonePage/smsStep/addContact/AddContact"; // 更改
import bus from "@/components/common/js/eventBus";
export default {
  name: "expressPush",
  components: {
    addContact
  },
  props: {
    expressPushData: {
      type: Object,
      default: () => {
        return {
          faxOrMail: {
            type: String,
            default: "all" // all:都显示  fax:只显示传真  mail:只显示邮件
          }, // 标题
          expressPushTitle: {
            type: String,
            default: "信息上报" // 1.信息上报 2.发送传真 3.发送邮件
          },
          expressPushPDFUrl: {
            type: String,
            default: "" // PDF文件路径
          },
          eventDealBulletinId: {
            type: Number,
            default: "" // 事件快报Id
          }
        };
      }
    }
  },
  data() {
    return {
      faxContacts: [], // 传真联系人数据
      mailContacts: [], // 邮件联系人数据
      checkFaxContactsId: [], // 选择所有传真联系人
      checkMailContactsId: [], // 选择所有传真联系人
      dialogVisible: false, // 自身组件弹窗
      addContactVisible: false // 审定/信息报送更改弹窗
    };
  },
  created() {},
  mounted() {
    // 添加传真/邮件联系人
    bus.$on("getCheckCharge", data => {
      if (this.selectType == "传真") {
        this.faxContacts = data;
      } else if (this.selectType == "邮件") {
        this.mailContacts = data;
      }
    });
  },
  methods: {
    /**
     * @description: 显示弹窗数据和初始化数据
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2021-1-29
     * @param {*}
     * @return {*}
     */
    initData() {
      this.dialogVisible = true;
    },
    /**
     * @description: 关闭信息报送弹窗
     * @author: xuchuangxing
     * @lastEditor : 关闭短信/xuchuangxing
     * @updateTime : 2020-11-27 16:12
     * @param {*}
     * @return {*}
     */
    handleClose() {
      this.dialogVisible = false;
      this.$emit("closeExpressPush");
    },
    /**
     * @description: 更改传真、邮箱收件人
     * @author: xuchuangxing
     * @lastEditor : 关闭短信/xuchuangxing
     * @updateTime : 2020-11-27 16:12
     * @param {*}
     * @return {*}
     */
    selectHandle(type) {
      let faxContacts = this.faxContacts.filter(x => {
        return x.id;
      });
      let mailContacts = this.mailContacts.filter(x => {
        return x.id;
      });
      let data = {
        checkFaxContactsId: faxContacts,
        checkMailContactsId: mailContacts
      };
      console.log("data: ", data);
      this.openSelectVisable(type, data);
    },
    // 发送传真/邮件
    determine() {
      if (
        this.checkFaxContactsId.length == 0 &&
        this.checkMailContactsId.length == 0
      ) {
        this.$message.warning("请选择联系人");
        return;
      }
      let faxContacts = this.faxContacts.filter(x =>
        this.checkFaxContactsId.some(y => x.id == y)
      );
      let mailContacts = this.mailContacts.filter(x =>
        this.checkMailContactsId.some(y => x.id == y)
      );
      this.sendFaxAndEmail({ faxContacts, mailContacts });
      this.handleClose();
    },
    /**
     * @description: 选择通讯录弹窗
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-12-06 18:09
     * @param {
     *          1.type 点击的类型
     *          1.selectData 要回显的数据
     *        }
     * @return {*}
     */
    openSelectVisable(type, selectData) {
      this.selectType = type; // 判断是哪里触发的更改弹窗
      this.addContactVisible = true;

      console.log("selectData.checkFaxContactsId: ", selectData);
      this.$nextTick(() => {
        console.log("type: ", type);
        if (type == "传真") {
          this.$store.commit("setSmsOrFax", "fax");
          console.log("this.$store.: ", this.$store.state.smsOrFax);
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
     * @description: 发送传真或邮件
     * @param {*} sendData  :传真、邮件联系人 faxContacts:传真联系人  mailContacts:邮件联系人
     * @return {*}
     */
    async sendFaxAndEmail(sendData) {
      // let data = {
      //   eventId: this.currentExpressNewsInfo.id,
      //   faxIds: sendData.faxContacts.faxContacts,
      //   emailIds: sendData.faxContacts.mailContacts,
      // };
      // this.$api.sendFaxAndEmail(data).then((res) => {
      //   if (res.errorcode == "0") {
      //     this.expressPushVisible = false;
      //     this.$message.success("发送成功");
      //   } else {
      //     this.$message.error(res.msg);
      //   }
      // });

      let that = this;
      if (sendData.faxContacts.length > 0) {
        let phones = [];
        for (let i = 0; i < sendData.faxContacts.length; i++) {
          phones.push(sendData.faxContacts[i].fax.replace("-", ""));
        }
        let phoneArry = [...new Set(phones)];
        let contactorIds = [];
        for (let i = 0; i < sendData.faxContacts.length; i++) {
          if (sendData.faxContacts[i].id) {
            contactorIds.push(Number(sendData.faxContacts[i].id));
          } else {
            contactorIds.push(0);
          }
        }
        let contactorIdsArray = [...new Set(contactorIds)];
        let datas = {
          faxSendTime: new Date().toString(),
          faxCaseId: "",
          faxName: ""
        };
        let faxFileData = await this.$api.downloadFaxFile({
          filePath: this.expressPushData.expressPushPDFUrl
        });
        let formData = new FormData();
        formData.append(
          "pdfName",
          faxFileData.data ? faxFileData.data.fileName : ""
        );
        formData.append("data", JSON.stringify(datas));
        formData.append("file", undefined);
        formData.append("phoneNum", phoneArry.toString());
        formData.append("contactorId", contactorIdsArray.toString());
        formData.append("type", "eventDealBulletinFax");
        formData.append("typeId", this.expressPushData.eventDealBulletinId);
        this.$api.sendFax(formData).then(async res => {
          if (res.errorcode == 0) {
            if (res.msg == "暂无数据") {
              this.$message({
                message: "传真发送失败",
                type: "warning"
              });
              return;
            }
            this.$message({
              message: "传真已加入发送队列，等待发送",
              type: "success"
            });
          } else {
            this.$message.error("传真发送失败");
          }
        });
      }

      console.log("sendData: ", sendData);
      if (sendData.mailContacts.length > 0) {
        let receiveName = sendData.mailContacts.map(v => {
          return v.name;
        }); // 发送邮件所有人名
        let receiveEmail = sendData.mailContacts.map(v => {
          return v.email;
        }); // 发送邮件所有邮箱
        let emailData = {
          receiveName,
          receiveEmail,
          filePath: faxFileData.data ? faxFileData.data.fileName : ""
        };
        console.log("emailData: ", emailData);
        this.$api.sendEmail(emailData).then(async res => {
          if (res.errorcode == 0) {
            if (res.msg == "暂无数据") {
              this.$message({
                message: "邮件发送失败",
                type: "warning"
              });
              return;
            }
            this.$message({
              message: "邮件已加入发送队列，等待发送",
              type: "success"
            });
          } else {
            this.$message.error("邮件发送失败");
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.expressPush {
  text-align: left;
  .blueStyle {
    color: #0091ff;
    margin-left: 22px;
    cursor: pointer;
  }
  font-size: 14px;
  color: #666;
  .allContacts {
    padding: 0 0 24px 36px;
    .contacts {
      margin: 10px 0 14px 0;
    }
    .contactsList {
      max-height: 82px;
      overflow: scroll;
      .NoContacts {
        text-align: center;
      }
    }
    .el-checkbox {
      margin: 0 5px 5px 0;
    }
  }
  .operation {
    border-top: 1px solid #e9ecf1;
    padding: 20px 0;
    text-align: right;
    .determine {
      margin-right: 20px;
    }
  }
}
</style>
