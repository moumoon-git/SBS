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
        <!--<el-col :span="4">
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
        </el-col>-->
        <el-col :span="12">
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
            style="text-align: center;"
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
            <div style="padding-bottom: 20px">
              <h2 style="color: red; font-family: '华文宋体'; font-size: 40px">
                {{ titleEvnet }}
              </h2>
              <div class="datePosition">
                <span class="spanOneClass">{{ whichVolume }}</span>
                <span class="spanClass">
                  {{ number }}
                </span>
              </div>
            </div>
            <h2 style="text-align: left; text-indent: 10px">
              {{ eventsNumber }}
            </h2>

            <el-form
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

              <!--              <el-row :gutter="gutter">-->
              <!--                <el-col :span="24">-->
              <!--                  <el-form-item label="呈报:">-->
              <!--                    <el-input type="text"-->
              <!--                              v-model.trim="ruleForm.submitAReport" show-word-limit></el-input>-->
              <!--                  </el-form-item>-->
              <!--                </el-col>-->
              <!--              </el-row>-->

              <!--              <el-row :gutter="gutter">-->
              <!--                <el-col :span="24">-->
              <!--                  <el-form-item label="抄送:">-->
              <!--                    <el-input type="text"-->
              <!--                              v-model.trim="ruleForm.copyTo" show-word-limit></el-input>-->
              <!--                  </el-form-item>-->
              <!--                </el-col>-->
              <!--              </el-row>-->

              <!--              <el-row :gutter="gutter">-->
              <!--                <el-col :span="12">-->
              <!--                  <el-form-item label="核稿:">-->
              <!--                    <el-input type="text"-->
              <!--                              v-model.trim="ruleForm.nuclearDraft" show-word-limit></el-input>-->
              <!--                  </el-form-item>-->
              <!--                </el-col>-->
              <!--                <el-col :span="12">-->
              <!--                  <el-form-item label="签发:">-->
              <!--                    <el-input type="text"-->
              <!--                              v-model.trim="ruleForm.signAndIssue" show-word-limit></el-input>-->
              <!--                  </el-form-item>-->
              <!--                </el-col>-->
              <!--              </el-row>-->
            </el-form>
            <div class="addButton">
              <!--            <el-button type="primary" size="small" @click="saveData">保存</el-button>-->
              <el-button type="primary" size="small" @click="complyWithBulletin"
                >导出PDF</el-button
              >
              <el-button
                type="primary"
                size="small"
                @click="sendFaxToList('IcpFax')"
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
    <!-- <event-day-send-app-table
      ref="searchTable"
      :selectTitle="eventDayData"
      :selectData="eventDataDialog"
      @closeDialog="eventDayCloseDialog"
      @confirm="eventDayConfirm"
      @close="eventDayClose"
    >
    </event-day-send-app-table> -->
    <add-contact
      v-if="addContactVisible"
      ref="addContact"
      @changeDialog="addContactVisible = false"
      @appConfirm="eventDayConfirm"
    />
  </el-container>
</template>

<script>
import myTable from "@/yz_components/tables/tables";
// import eventDaySendAppTable from "../searchTable";
import addContact from "@/view/yz_integratedCommunication/icpPhone/icpPhonePage/smsStep/addContact/AddContact";
import { Url } from "@/assets/js/common";
import bus from '@/views/common/js/eventBus';
import { isAuth } from '@/utils';
const downLoadFile = require('@/utils/downloadFile.js').default;
export default {
  name: "eventDay",
  components: {
    myTable,
    // eventDaySendAppTable,
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
      addContactVisible: false, // 发送到app
    };
  },
  mounted() {
    //this.getTreeData();
    this.getdataTable();
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
  methods: {
    getHeight() {
      let h =
        document.documentElement.clientHeight || document.body.clientHeight;
      this.dailyStyle.height = h - (68 + 240) + "px";
      this.dayStyle.height = h - (68 + 180) + "px";
    },
    /**
     * @LastEditTime: 2020-09-25 18:23:50
     * @LastEditors: qinjiaqi
     * @param {String} 跳转时要传的类型名
     * @return {type} undefined
     * @Description: 发送传真
     */
    sendFaxToList(sendTypeName) {
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
    complyWithBulletin() {
      //详细预览
      if (this.id == "" || this.id == undefined || this.id == null) {
        this.$message({
          message: "请优先选择日报再进行导出",
          type: "warning",
        });
        return;
      }
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
    },
    /**
     * @lastEditor 2020-11-9
     * @lastDate 2020-11-9
     * @description 导出word
     */
    deriveBulletin() {
      //导出word
      if (this.id == "" || this.id == undefined || this.id == null) {
        this.$message({
          message: "请优先选择日报再进行导出",
          type: "warning",
        });
        return;
      }
      const request = {
        method: 'post',
        url: `/eos/event/bullitin/exportDayWord?id=${this.id}`,
        baseURL: window.g.ApiUrl,
        headers: {
          token: this.$cookie.get('token'),
        },
        responseType: 'arraybuffer',
      };
      downLoadFile(request);
      // 注释原因：导出文件接口要加token
      // this.$api
      //   .verification()
      //   .then(() => {
      //     // 只有登录没失效的才会导出word bug7722 author hexinting date 2020-11-9
      //     window.location.href =
      //       Url + "/eos/event/bullitin/exportDayWord?id=" + this.id;
      //   })
      //   .catch((err) => {
      //     // 网络请求错误 或者 登录失效的信息都在这捕获
      //     console.log(err);
      //   });
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
            this.getdataTable();
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
            // this.getTreeData();
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
        // date: this.valueTime,
      };
      this.$api.findByDay(dayData).then((res) => {
        if (res.errorcode == 0) {
          this.total = res.data.totalElements;
          this.tableData = res.data.data;
          // 初始化最新一条日报
          this.id = this.tableData[0].id;
          this.tableRowData = JSON.parse(this.tableData[0].json);
          this.eventsNumber = this.tableRowData.outburstCount;
          this.whichVolume = this.tableRowData.vc_number;
          this.number = this.tableRowData.dt_time;
          this.ruleForm.overallSituation = this.tableRowData.OutburstEventList.join();
          this.ruleForm.submitAReport = this.tableRowData.report;
          this.ruleForm.copyTo = this.tableRowData.CC;
          this.ruleForm.nuclearDraft = this.tableRowData.confirm;
          this.ruleForm.signAndIssue = this.tableRowData.writer;
          this.showPrint = false; //打印按钮
        }
      });
    },
    handleCurrentChange(row) {
      //表格点击
      console.log(row);
      this.id = row.id;
      this.tableRowData = JSON.parse(row.json);
      this.eventsNumber = this.tableRowData.outburstCount;
      this.whichVolume = this.tableRowData.vc_number;
      this.number = this.tableRowData.dt_time;
      this.ruleForm.overallSituation = this.tableRowData.OutburstEventList.join();
      this.ruleForm.submitAReport = this.tableRowData.report;
      this.ruleForm.copyTo = this.tableRowData.CC;
      this.ruleForm.nuclearDraft = this.tableRowData.confirm;
      this.ruleForm.signAndIssue = this.tableRowData.writer;
      this.showPrint = false; //打印按钮
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
      this.addContactVisible = true;
      this.$nextTick(() => {
        this.$refs.addContact.getDataList('选择APP联系人', []);
      });
      this.$store.commit('setSmsOrFax', 'sms');
      // this.eventDayData = "选择联系人";
      // this.eventDataDialog = true;
      // this.$refs.searchTable.info();
    },
    eventDayCloseDialog() {
      //弹窗取消
      this.eventDataDialog = false;
    },
    eventDayConfirm(multipleSelection) {
      // 弹窗确认
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
      let arr = [];
      arr = multipleSelection.map((x) => { return x.id });
      let data = {
        id: this.id,
        contacters: arr,
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
  width: 48%;
  height: 40px;
  line-height: 40px;
  position: absolute;
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
</style>
