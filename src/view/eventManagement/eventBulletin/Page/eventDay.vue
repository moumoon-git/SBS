<!--@author：yf-->
<template>
  <el-container>
    <el-header class="navsBar" style="height: 80px">
      <el-col :span="12" style="text-align: left">
        <el-date-picker
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          v-model="valueTime"
          type="date"
        >
        </el-date-picker>
        <el-button type="primary" size="medium" @click="queryBytime"
          >更新快报</el-button
        >
      </el-col>
    </el-header>
    <el-main style="padding: 20px 30px">
      <el-row :style="dailyStyle" class="elMain" style="min-height: 600px">
        <el-col :span="4">
          <el-tree
            default-expand-all
            :data="treeData"
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps"
            @node-click="handleTreeClick"
          >
          </el-tree>
        </el-col>
        <el-col :span="8">
          <my-table
            style="padding: 0 10px"
            :tableColumn="tableColumn"
            :tableData="tableData"
            @handleCurrentChange="handleCurrentChange"
          ></my-table>
          <el-pagination
            :small="pagingSize"
            :page-size="pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="total"
            :current-page="currentPage"
            @size-change="handleSizeChange"
            @current-change="pageMode"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </el-col>
        <el-col :span="12">
          <div
            v-if="refreshDay"
            style="
              border: 1px solid #ebeef5;
              border-radius: 3px;
              width: 100%;
              min-height: 600px;
            "
          >
            <div>
              <h2 style="color: red; font-family: '华文宋体'; font-size: 40px">
                {{ titleEvnet }}
              </h2>
              <!-- <div class="datePosition">
                <span class="spanOneClass">{{ whichVolume }}</span>
                <span class="spanClass">
                  {{ number }}
                </span>
              </div> -->
            </div>
            <!-- <h2 style="text-align: left; text-indent: 10px">
              {{ eventsNumber }}
            </h2> -->

            <!-- <el-form
              label-width="80px"
              :model="ruleForm"
              :rules="rules"
              ref="form"
              id="borderClass"
              @submit.native.prevent
              label-position="top"
            >
              <el-row :gutter="gutter">
                <el-col :span="24">
                  <el-form-item>
                    <el-input
                      type="textarea"
                      :autosize="{ minRows: 12, maxRows: 12 }"
                      resize="none"
                      v-model.trim="ruleForm.overallSituation"
                      show-word-limit
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form> -->
            <div class="faxViewer">
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
            </div>
            <div class="addButton">
              <!--            <el-button type="primary" size="small" @click="saveData">保存</el-button>-->
              <el-button type="primary" size="small" @click="complyWithBulletin"
                >导出PDF</el-button
              >
              <!-- <el-button type="primary" size="small" @click="sendFaxToList"
                >发送传真</el-button
              > -->
              <el-button
                type="primary"
                size="small"
                @click="expressPushHandle()"
                >发送传真</el-button
              >
              <el-button type="primary" size="small" @click="eventDaySendApp"
                >发送到APP</el-button
              >
              <el-button
                type="primary"
                size="small"
                v-print="'#dayP'"
                :disabled="showPrint"
                >打印</el-button
              >
              <a :href="wordUrl" class="onlineEdit">在线编辑</a>
              <el-button type="primary" size="small" @click="deriveBulletin"
                >导出Word</el-button
              >
            </div>
          </div>
        </el-col>
      </el-row>
    </el-main>

    <!--下面是用来打印的，暂时想不出其他在不影响样式的情况下能打印完全textarea的方法-->
    <div style="position: absolute; z-index: -999" id="dayP">
      <div style="width: 700px">
        <div style="padding-bottom: 20px">
          <h2
            style="
              color: red;
              text-align: center;
              font-family: '华文宋体';
              font-size: 40px;
            "
          >
            {{ titleEvnet }}
          </h2>
          <div class="datePosition">
            <span class="spanOneClass">{{ whichVolume }}</span>
            <span class="spanClass">
              {{ number }}
            </span>
          </div>
        </div>
        <h2 style="text-align: left">{{ eventsNumber }}</h2>

        <el-input
          type="textarea"
          resize="none"
          :autosize="{ minRows: 15 }"
          v-model.trim="overallSituation"
          show-word-limit
        ></el-input>
      </div>
    </div>
    <!--弹窗-->
    <event-day-send-app-table
      ref="searchTable"
      :selectTitle="eventDayData"
      :selectData="eventDataDialog"
      @closeDialog="eventDayCloseDialog"
      @confirm="eventDayConfirm"
      @close="eventDayClose"
    >
    </event-day-send-app-table>

    <!--发送传真-->
    <el-dialog
      :title="expressPushTitle"
      :visible.sync="expressPushVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      width="535px"
      custom-class="expressPushDialog"
    >
      <express-push
        @closeExpressPush="handleClose"
        @selectHandle="selectHandle"
        @sendFaxAndEmail="sendFaxAndEmail"
        :expressPushData="expressPushData"
      ></express-push>
    </el-dialog>

    <!--更改传真发送人 -->
    <add-contact
      ref="addContact"
      v-if="addContactVisible"
      @changeDialog="addContactVisible = false"
    ></add-contact>
  </el-container>
</template>

<script>
import myTable from "@/components/tables/tables";
import expressPush from "@/view/eventManagement/eventBulletin/Page/ExpressPush"; // 发送传真
import addContact from "@/view/integratedCommunication/icpPhone/icpPhonePage/smsStep/addContact/AddContact"; // 更改
import eventDaySendAppTable from "../searchTable";
import bus from "@/components/common/js/eventBus";
import { isAuth } from '@/utils';
import { Url } from "@/assets/js/common";
const downLoadFile = require('@/utils/downloadFile.js').default;

export default {
  name: "eventDay",
  components: {
    myTable,
    eventDaySendAppTable,
    expressPush,
    addContact,
  },
  data() {
    const data = [
      {
        id: 0,
        name: "请选择日期",
        children: null,
      },
    ];
    return {
      defaultProps: {
        children: "children",
        label: "name",
      },
      treeData: JSON.parse(JSON.stringify(data)), //树数据
      gutter: 24,
      titleEvnet: "一天值班要情", //标题
      valueTime: "", //日期选择
      ruleForm: {
        overallSituation: "", //总体情况
        submitAReport: "", //呈报
        copyTo: "", //抄送
        nuclearDraft: "", //核稿
        signAndIssue: "", //签发
      }, //表单
      rules: {}, //表单验证
      number: "", //时间日期
      tableColumn: [
        {
          prop: "number",
          label: "期号",
          formatter: this.numberFormatter,
        },
        {
          prop: "time",
          label: "发行时间",
        },
      ], //表头
      tableData: [], //表格数据
      pagingSize: true, //分页大小
      pageSize: 10, //每页数量
      total: 0, //数据总数
      currentPage: 1, //第几页
      tableRowData: [],
      id: "", //日报ID
      dateTime: "",

      eventDataDialog: false, //发送app弹窗
      eventDayData: "", //发送APP标题
      eventsNumber: "", //事件宗数
      whichVolume: "", //第几期

      showPrint: true, //打印按钮能否使用
      overallSituation: "", //存入数据进打印div

      pathname: "/sys/combined/index",

      refreshDay: true, //强制刷新每日一报
      dailyStyle: {
        //获取浏览器的高度
        height: "",
      },
      dayStyle: {
        height: "",
      },
      fileUrl: window.g.FileUrl,
      wordData: "", // 下载 word 文件路径
      pdfData: "", // 下载 和预览 pdf 文件路径
      wordUrl: "",
      expressPushData: {
        faxContacts: [], // 传真联系人
        mailContacts: [], // 邮件联系人
        faxOrMail: "fax",
      },
      expressPushVisible: false, // 发送传真弹窗
      addContactVisible: false, // 审定/信息报送更改弹窗
      expressPushTitle: "发送传真", // 发送传真弹窗标题
    };
  },
  mounted() {
    this.getTreeData();
    // 添加传真联系人
    bus.$on("getCheckCharge", (data) => {
      if (data.length != 0) {
        if (this.selectType == "传真") {
          this.expressPushData.faxContacts = data;
        }
      }
    });
  },
  watch: {
    ruleForm: {
      handler(newV) {
        this.overallSituation = newV.overallSituation;
      },
      deep: true,
    },
  },
  created() {
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
  },
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  computed: {
    faxUrl() {
      return this.pdfData
        ? this.fileUrl +
            this.pdfData.path +
            "?timeStamp=" +
            new Date().getTime()
        : "";
    },
  },
  methods: {
    getHeight() {
      let h =
        document.documentElement.clientHeight || document.body.clientHeight;
      this.dailyStyle.height = h - (68 + 240) + "px";
      this.dayStyle.height = h - (68 + 180) + "px";
    },
    sendFaxToList() {
      //发送传真
      if (this.id == "" || this.id == undefined || this.id == null) {
        this.$message({
          message: "请优先选择日报再进行发送传真",
          type: "warning",
        });
      } else {
        this.$confirm(
          "该操作将下载【一天值班要情】的文件,然后跳转至【传真模块】",
          "提示",
          {
            confirmButtonText: "知道了",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            this.$store.commit("SET_ICPNAME", "IcpFax");
            // window.location.href = `${Url}/eos/event/bullitin/exportDayPdf?id=${this.id}`;
            const request = {
              method: 'get',
              url: `/eos/event/bullitin/exportDayPdf?id=${this.id}`,
              baseURL: window.g.ApiUrl,
              headers: {
                'Content-Type': 'application/json; charset=utf-8',
                token: this.$cookie.get('token'),
              },
              responseType: 'arraybuffer',
            };
            downLoadFile(request);
            this.$router.push({
              path: this.pathname,
            });
            setTimeout(() => {
              const _index = isAuth('chuanzhen:xianshi') &&
                !isAuth('duanxin:mokuai') &&
                !isAuth('phone:phoneinfo:list')
                ? 'first'
                : isAuth('duanxin:mokuai') && isAuth('phone:phoneinfo:list')
                  ? 'fourth'
                  : 'second'
                  console.log('啊啊啊啊：',  _index)
              bus.$emit('tabChange', _index);
              
            }, 100);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消发送传真",
            });
          });
      }
    },
    // complyWithBulletin() {
    //   //详细预览
    //   if (this.id == "" || this.id == undefined || this.id == null) {
    //     this.$message({
    //       message: "请优先选择日报再进行导出",
    //       type: "warning",
    //     });
    //     return;
    //   }
    //   window.location.href = `${Url}/eos/event/bullitin/exportDayPdf?id=${this.id}`;
    // },
    // /**
    //  * @lastEditor 2020-11-9
    //  * @lastDate 2020-11-9
    //  * @description 导出word
    //  */
    // deriveBulletin() {
    //   //导出word
    //   if (this.id == "" || this.id == undefined || this.id == null) {
    //     this.$message({
    //       message: "请优先选择日报再进行导出",
    //       type: "warning",
    //     });
    //     return;
    //   }
    //   this.$api
    //     .verification()
    //     .then(() => {
    //       // 只有登录没失效的才会导出word bug7722 author hexinting date 2020-11-9
    //       window.location.href =
    //         Url + "/eos/event/bullitin/exportDayWord?id=" + this.id;
    //     })
    //     .catch((err) => {
    //       // 网络请求错误 或者 登录失效的信息都在这捕获
    //       console.log(err);
    //     });
    // },
    // 新的一天值班要情模板预览对应的导出
    /**
     * @description: 导出pdf
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2021-1-18
     * @param {*}
     * @return {*}
     */
    complyWithBulletin() {
      if (!!this.pdfData) {
        window.location.href = `${this.fileUrl}/eos/event/sum/downloadFile?fileName=${this.pdfData.name}&filePath=${this.pdfData.path}`;
      } else {
        this.$message.warning("请先生成快报");
      }
      //
    },
    /**
     * @description: 导出word
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2021-1-18
     * @param {*}
     * @return {*}
     */ deriveBulletin() {
      if (!!this.wordData) {
        window.location.href = this.fileUrl + this.wordData.path;
      } else {
        this.$message.warning("请先生成快报");
      }
      //
    },
    saveData() {
      //保存每日一报
      let json = {
        vc_bullitin_id: this.tableRowData.id,
        flag: this.tableRowData.flag,
        dt_time: this.number,
        vc_number: this.tableRowData.vc_number,
        vc_sign_unit: this.tableRowData.vc_sign_unit,
        outburstCount: this.tableRowData.outburstCount,
        OutburstEventList: this.tableRowData.OutburstEventList,
        businessCount: this.tableRowData.businessCount,
        BusinessEventList: this.ruleForm.overallSituation,
        vc_send: this.tableRowData.vc_send,
        writer: this.ruleForm.signAndIssue,
        Images: this.tableRowData.Images,
        vc_from: this.tableRowData.vc_from,
        confirm: this.ruleForm.nuclearDraft,
        report: this.ruleForm.submitAReport,
        CC: this.ruleForm.copyTo,
      };
      let data = {
        id: this.id,
        json: JSON.stringify(json),
      };
      this.$api.saveDay(data).then((res) => {
        if (res.errorcode == 0) {
          if (res.msg == "SUCCESS") {
            this.$message({
              message: "保存成功",
              type: "success",
            });
            this.getdataTable();
          }
        }
      });
    },
    queryBytime() {
      //按时间查询更新快报
      if (this.valueTime == "" || this.valueTime == null) {
        this.$message({
          message: "请选择日期!",
          type: "warning",
        });
      } else {
        this.currentPage = 1;
        let data = {
          date: this.valueTime,
        };
        this.$api.updateDay(data).then((res) => {
          if (res.errorcode == 0) {
            this.$message({
              message: this.valueTime + "日报更新成功!",
              type: "success",
            });
            this.ruleForm = [];
            this.id = "";
            this.number = "";
            this.eventsNumber = "";
            this.whichVolume = "";
            this.tableData = [];
            this.pageSize = 10;
            this.total = 0;
            this.currentPage = 1;
            this.tableRowData = [];
            this.dateTime = "";
            this.getTreeData();
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    },
    getTreeData() {
      let data = {
        date: "",
      };
      this.$api.bullitinTree(data).then((res) => {
        if (res.errorcode == 0) {
          this.treeData = [];
          let fakeData = [
            {
              id: 0,
              name: "请选择日期",
              children: null,
            },
          ];
          this.treeData = JSON.parse(JSON.stringify(fakeData));
          for (let i = 0; i < res.data.length; i++) {
            this.treeData.push({ name: res.data[i], children: [] });
          }
        }
      });
    },
    handleTreeClick(node) {
      //树点击
      this.dateTime = node.name;
      if (this.dateTime == "请选择日期") {
        return;
      } else if (this.dateTime.length <= 5) {
        this.dateTime = this.dateTime.replace("年", "");
      } else if (this.dateTime.length > 5 && this.dateTime.length < 9) {
        this.dateTime = this.dateTime.replace("年", "-");
        this.dateTime = this.dateTime.replace("月", "");
      } else if (this.dateTime.length > 9 && this.dateTime.length <= 11) {
        this.dateTime = this.dateTime.replace("年", "-");
        this.dateTime = this.dateTime.replace("月", "-");
        this.dateTime = this.dateTime.replace("日", "");
      } else {
        return;
      }
      let treeClick = {
        date: this.dateTime,
      };
      this.$api.bullitinTree(treeClick).then((res) => {
        if (res.errorcode == 0) {
          node.children = [];
          for (let i = 0; i < res.data.length; i++) {
            node.children.push({ name: res.data[i], children: [] });
          }
        }
      });
      this.getdataTable();
    },
    getdataTable() {
      let dayData = {
        size: this.pageSize,
        page: this.currentPage,
        date: this.dateTime,
      };
      this.$api.findByDay(dayData).then((res) => {
        if (res.errorcode == 0) {
          this.total = res.data.totalElements;
          this.tableData = res.data.data;
        }
      });
    },
    handleCurrentChange(row) {
      //表格点击
      console.log(row);
      if (row.attachmentList && row.attachmentList.length > 0) {
        row.attachmentList.map((v) => {
          if (!!v.extension && v.extension == ".word") {
            this.wordData = v;
          } else if (!!v.extension && v.extension == ".pdf") {
            this.pdfData = { ...v };
          }
          if (!!this.wordData && !!this.pdfData) {
            this.wordUrl = `javascript:POBrowser.openWindowModeless('${this.fileUrl}/pageoffice/word?filePath=${this.wordData.path}&pdfFilePath=${this.pdfData.path}
          ','width=1200px;height=800px;')`;
          }
        });
      }
      this.id = row.id;
      console.log("this.id: ", this.id);
      // this.tableRowData = JSON.parse(row.json);
      // this.eventsNumber = this.tableRowData.outburstCount;
      // this.whichVolume = this.tableRowData.vc_number;
      // this.number = this.tableRowData.dt_time;
      // this.ruleForm.overallSituation = this.tableRowData.OutburstEventList.join();
      // this.ruleForm.submitAReport = this.tableRowData.report;
      // this.ruleForm.copyTo = this.tableRowData.CC;
      // this.ruleForm.nuclearDraft = this.tableRowData.confirm;
      // this.ruleForm.signAndIssue = this.tableRowData.writer;
      // this.showPrint = false; //打印按钮
    },
    handleSizeChange(val) {
      //监听一页几条
      console.log(val);
      this.currentPage = 1;
      this.refreshDay = false;
      this.$nextTick(() => {
        this.refreshDay = true;
      });
      this.tableRowData = [];
      this.ruleForm = [];
      this.id = "";
      this.number = "";
      this.eventsNumber = "";
      this.whichVolume = "";
      this.pageSize = val;
      this.getdataTable();
    },
    pageMode(val) {
      //监听第几页
      this.refreshDay = false;
      this.$nextTick(() => {
        this.refreshDay = true;
      });
      this.ruleForm = [];
      this.id = "";
      this.number = "";
      this.eventsNumber = "";
      this.whichVolume = "";
      this.tableRowData = [];
      this.currentPage = val;
      this.getdataTable();
    },
    numberFormatter: function (row) {
      //修改表格达到预期数据形式
      return "第 " + row.number + " 期";
    },
    eventDaySendApp() {
      //发送到到APP
      if (this.id == "" || this.id == null || this.id == undefined) {
        this.$message({
          message: "请优先选择每日一报期号!",
          type: "warning",
        });
        return;
      }

      this.eventDayData = "选择联系人";
      this.eventDataDialog = true;
      this.$refs.searchTable.info();
    },
    eventDayCloseDialog() {
      //弹窗取消
      this.eventDataDialog = false;
    },
    eventDayConfirm(multipleSelection) {
      //弹窗确认
      if (
        multipleSelection == "" ||
        multipleSelection == null ||
        multipleSelection == undefined
      ) {
        this.$message({
          message: "选项不能为空!",
          type: "warning",
        });
        return;
      }
      let data = {
        id: this.id,
        contacters: multipleSelection,
      };
      this.$api.sendApp(data).then((res) => {
        if (res.errorcode == 0) {
          this.$message({
            message: "发送成功!",
            type: "success",
          });
          this.eventDataDialog = false;
        } else {
          //this.$message.error(res.msg)
        }
      });
    },
    eventDayClose() {
      //弹窗叉叉
      this.eventDataDialog = false;
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
      this.expressPushVisible = true;
      //   } else {
      //     this.$message.error(res.msg);
      //   }
      // });
    },
    /**
     * @description: 选择通讯录
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-12-06 18:09
     * @param {
     *          1.type 点击的类型
     *          1.selectData 要回显的数据
     *        }
     * @return {*}
     */
    selectHandle(type, selectData) {
      this.selectType = type; // 判断是哪里触发的更改弹窗
      this.addContactVisible = true;

      console.log("selectData.checkFaxContactsId: ", selectData);
      this.$nextTick(() => {
        if (type == "传真") {
          this.$store.commit("setSmsOrFax", "fax");
          this.$refs.addContact.getDataList(
            "getCheckCharge",
            selectData.checkFaxContactsId
          );
        }
      });
    },
    /**
     * @description: 发送传真或邮件
     * @param {*} sendData  :传真、邮件联系人 faxContacts:传真联系人  mailContacts:邮件联系人
     * @return {*}
     */
    sendFaxAndEmail(sendData) {
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
      this.expressPushVisible = false;

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
          faxName: "",
        };
        let formData = new FormData();
        formData.append("pdfName", this.pdfData.name);
        formData.append("data", JSON.stringify(datas));
        formData.append("file", undefined);
        formData.append("phoneNum", phoneArry.toString());
        formData.append("contactorId", contactorIdsArray.toString());
        this.$api.sendFax(formData).then(async (res) => {
          if (res.errorcode == 0) {
            if (res.msg == "暂无数据") {
              this.$message({
                message: "传真发送失败",
                type: "warning",
              });
              return;
            }
            this.$message({
              message: "传真已加入发送队列，等待发送",
              type: "success",
            });
          } else {
            this.$message.error("传真发送失败");
          }
        });
      }
    },
    /**
     * @description: 关闭发送传真弹窗
     * @author: xuchuangxing
     * @lastEditor : xuchuangxing
     * @updateTime : 2020-11-27 16:12
     * @param {*}
     * @return {*}
     */
    handleClose() {
      this.expressPushVisible = false;
    },
  },
};
</script>

<style scoped>
@page {
  size: a4;
  margin: 0cm 1cm 0cm 1cm;
}

@media print {
  header {
    display: none;
  }

  footer {
    display: none;
  }

  .datePosition {
    text-align: right;
    width: 100%;
    height: 40px;
    line-height: 40px;
    position: relative;
  }

  .spanOneClass {
    width: 100px;
    text-align: center;
    margin-left: -50px;
    font-size: 20px;
    position: absolute;
    top: 0;
    left: 50%;
  }

  .spanClass {
    display: inline-block;
    width: 200px;
  }

  .elMain {
    /*padding: 5px 10px;*/
    box-sizing: border-box;
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
    background-color: white;
  }

  #dayP >>> .el-textarea__inner {
    border: none;
  }
}

.navsBar {
  margin: 0 30px;
  background-color: white;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border: 1px solid rgba(219, 219, 219, 1);
  border-radius: 3px;
}

.addButton {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: left;
  text-indent: 20px;
}

.datePosition {
  text-align: right;
  width: 100%;
  height: 40px;
  line-height: 40px;
  position: relative;
}

.spanOneClass {
  width: 100px;
  text-align: center;
  margin-left: -50px;
  font-size: 20px;
  position: absolute;
  top: 0;
  left: 50%;
}

.spanClass {
  display: inline-block;
  width: 200px;
}

.elMain {
  /*padding: 5px 10px;*/
  box-sizing: border-box;
  border: 1px solid rgba(219, 219, 219, 1);
  border-radius: 3px;
  background-color: white;
}

#borderClass >>> .el-textarea__inner {
  border: none;
}

/*  传真预览 */
.faxViewer {
  width: 100%;
  height: 481px;
}
.faxViewer .noFax {
  width: 100%;
  height: 100%;
  background: url("/static/img/faxBack.png") center no-repeat;
  background-size: 220px;
}

.onlineEdit {
  text-decoration: none;
  color: white;
  background-color: #409eff;
  padding: 7px 15px;
  vertical-align: middle;
  border-radius: 3px;
  font-size: 12px;
}
</style>
