<template>
  <el-container>
    <div style="padding-bottom: 30px">
      <div>
        <h2>{{ titleEvnet }}</h2>
        <div style="position: relative" v-if="(showEvent = false)">
          第
          <span class="spanClass">
            <el-input disabled v-model="number"></el-input>
          </span>
          期
        </div>
        <div
          style="position: absolute; right: 20px; top: 30px"
          v-if="(showEvent = false)"
        >
          <el-button
            type="primary"
            size="small"
            v-if="addTopShow"
            @click="addTopBulletin"
            >新增</el-button
          >
          <el-button
            type="primary"
            size="small"
            v-if="cancelTopShow"
            @click="cancelTopBulletin"
            >撤销</el-button
          >
        </div>
      </div>

      <div class="mainForm" style="padding: 20px">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          @submit.native.prevent
        >
          <el-form-item>
            <el-input
              type="text"
              v-model.trim="ruleForm.title"
              show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              type="textarea"
              v-model.trim="ruleForm.content"
              show-word-limit
              :autosize="{ minRows: 7, maxRows: 7 }"
              resize="none"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div style="padding: 20px">
        <el-form
          label-width="80px"
          :model="form"
          :rules="formRules"
          ref="form"
          @submit.native.prevent
          label-position="left"
        >
          <!--          <el-row :gutter="gutter">-->
          <!--            <el-col :span="24">-->
          <!--              <el-form-item label="主送:">-->
          <!--                <el-input type="text"  v-model.trim="form.lordSent" show-word-limit></el-input>-->
          <!--              </el-form-item>-->
          <!--            </el-col>-->
          <!--          </el-row>-->
          <!--          <el-row :gutter="gutter">-->
          <!--            <el-col :span="24">-->
          <!--              <el-form-item label="抄送:">-->
          <!--                <el-input type="text"  v-model.trim="form.coptTo" show-word-limit></el-input>-->
          <!--              </el-form-item>-->
          <!--            </el-col>-->
          <!--          </el-row>-->
          <!--          <el-row :gutter="gutter">-->
          <!--            <el-col :span="24">-->
          <!--              <el-form-item label="报送:">-->
          <!--                <el-input type="text"  v-model.trim="form.submission " show-word-limit></el-input>-->
          <!--              </el-form-item>-->
          <!--            </el-col>-->
          <!--          </el-row>-->
          <el-row :gutter="gutter">
            <el-col :span="8">
              <el-form-item label="编辑:">
                <el-input
                  type="text"
                  v-model.trim="form.compile"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电话:" prop="phone">
                <el-input
                  type="text"
                  placeholder="联系电话"
                  v-model.trim="form.phone"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="gutter">
            <el-col :span="8">
              <el-form-item label="签发人:">
                <el-input
                  type="text"
                  v-model.trim="form.signPerson"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="签发单位:">
                <el-input
                  type="text"
                  v-model.trim="form.signArea"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="签发时间:">
                <el-date-picker
                  style="width: 100%"
                  v-model="form.signTime"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row> </el-row>
      </div>
      <div style="width: 100%; text-align: left; text-indent: 30px">
        <el-button
          type="primary"
          size="small"
          @click="saveEvent('form')"
          :disabled="saveSetime"
          >保存</el-button
        >
        <el-button type="primary" size="small" @click="automaticGeneration"
          >自动生成</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="systemTemplate"
          :disabled="buttonShowTemplat"
          >系统模板</el-button
        >
        <el-button type="primary" size="small" @click="expDutyPdf"
          >导出PDF</el-button
        >
        <!--        <el-button type="primary" size="small" @click="conditionSendApp">发送到APP</el-button>-->
        <el-button
          type="primary"
          size="small"
          v-print="'#conditionTopPrintButton'"
          >打印</el-button
        >
        <el-button type="primary" size="small" @click="expDutyWord"
          >导出Word</el-button
        >
        <el-checkbox v-model="checked" style="display: none"
          >导出附件</el-checkbox
        >
      </div>
    </div>
    <!--打印dom-->
    <div id="conditionTopPrintButton" style="position: fixed; z-index: -999">
      <div style="width: 700px">
        <div>
          <h2 style="text-align: center; font-family: 华文宋体; color: red">
            {{ titleEvnet }}
          </h2>
          <div
            style="
              position: relative;
              width: 100%;
              text-align: center;
              margin-top: 20px;
              font-size: 20px;
            "
          >
            第 {{ monthlyNumber }} 期
          </div>
        </div>
        <div class="mainForm" style="margin: 0 20px; word-wrap: break-word">
          <div
            style="
              padding-top: 10px;
              min-height: 40px;
              width: 100%;
              margin: 15px 0;
              text-align: center;
              text-indent: 20px;
            "
          >
            {{ monthlyTitle }}
          </div>
          <div
            style="
              padding-top: 10px;
              min-height: 150px;
              width: 100%;
              text-align: left;
              text-indent: 20px;
            "
          >
            {{ monthlyContent }}
          </div>
          <!--          <el-input type="textarea" resize="none"-->
          <!--                    :autosize="{ minRows:15}"-->
          <!--                    v-model.trim="monthlyContent" show-word-limit></el-input>-->
        </div>
        <div style="padding: 20px">
          <ul id="lorsty">
            <!--            <li>主送:{{monthlyLordSent}}</li>-->
            <!--            <li>抄送:{{monthlyCoptTo}}</li>-->
            <!--            <li>报送:{{monthlySubmission}}</li>-->
            <li>编辑:{{ monthlyCompile }}</li>
            <li>电话:{{ monthlyPphone }}</li>
            <li>签发人:{{ monthlySignPerson }}</li>
            <li>签发单位:{{ monthlySignArea }}</li>
            <li>签发时间:{{ monthlySignTime }}</li>
          </ul>
        </div>
      </div>
    </div>

    <top-table-dialog
      ref="searchTable"
      :selectTitle="conditionTitle"
      :selectData="conditionData"
      @closeDialog="conditionCloseDialog"
      @confirm="conditionConfirm"
      @close="conditionClose"
    >
    </top-table-dialog>
  </el-container>
</template>

<script>
import topTableDialog from '../../../eventBulletin/searchTable';
import { Url } from '@/assets/js/common';
import Cookies from "js-cookie";
const downLoadFile = require('@/utils/downloadFile.js').default;
export default {
  name: 'conditionTop',
  components: {
    topTableDialog,
  },
  data() {
    let number = (rule, value, callback) => {
      let num = /^[0-9*#]+$/;
      let n = value.match(num);
      if (n == null) {
        callback(new Error('请输入正确的电话号码!'));
      }
      callback();
    };
    return {
      eventId: '', //事件ID
      number: '', //第几期
      ruleForm: {
        title: '',
        content: '',
      }, //第一个表单
      gutter: 24,
      rules: {}, //第一个表单验证

      form: {
        lordSent: '',
        coptTo: '',
        submission: '',
        compile: '',
        phone: '',
        signPerson: '',
        signArea: '',
        signTime: '',
      }, //第二个表单
      titleEvnet: '突发事件信息快报', //标题
      checked: false, //单选
      formRules: {
        phone: [
          { validator: number, trigger: 'blur' },
          { min: 6, max: 12, message: '请输入正确的电话号码!' },
        ],
      }, //第二个表单验证
      backgroundRequestData: [], //存储父组件后台返回快报数据
      buildId: '', //快报ID
      buildType: '',

      addTopShow: true, //新增
      cancelTopShow: false, //撤销

      conditionTitle: '',
      conditionData: false,
      saveSetime: false, //保存按钮

      monthlyNumber: '', //打印
      monthlyTitle: '',
      monthlyContent: '',
      monthlyLordSent: '',
      monthlyCoptTo: '',
      monthlySubmission: '',
      monthlyCompile: '',
      monthlyPphone: '',
      monthlySignPerson: '',
      monthlySignArea: '',
      monthlySignTime: '',

      saveTime: '', //保存快报时间
      getTimeMoRens: '', //保存默认时间

      issusePerson: '', //为撤销又回到之前的数据存的签发人
      buttonShowTemplat: false,
    };
  },
  watch: {
    number: {
      handler(newV) {
        this.monthlyNumber = newV;
      },
      deep: true,
    },
    ruleForm: {
      handler(newV) {
        this.monthlyTitle = newV.title;
        this.monthlyContent = newV.content;
      },
      deep: true,
    },
    form: {
      handler(newV) {
        this.monthlyLordSent = newV.lordSent;
        this.monthlyCoptTo = newV.coptTo;
        this.monthlySubmission = newV.submission;
        this.monthlyCompile = newV.compile;
        this.monthlyPphone = newV.phone;
        this.monthlySignPerson = newV.signPerson;
        this.monthlySignArea = newV.signArea;
        this.monthlySignTime = newV.signTime;
      },
      deep: true,
    },
  },
  mounted() {
    this.readUser();
  },
  methods: {
    systemTemplate() {
      //系统模板
      if (this.eventId == '' || this.eventId == null) {
        this.$message({
          message: '暂无事件可以进行操作',
          type: 'warning',
        });
        return;
      }
      if (this.eventId == 'newID') {
        this.$message({
          message: '请选择保存事件!',
          type: 'warning',
        });
        return;
      }
      console.log(this.form.signTime);
      if (this.form.signTime == '' || this.form.signTime == null) {
        this.$message({
          message: '请先选择日期再进行系统生成',
          type: 'warning',
        });
        return;
      }
      this.buttonShowTemplat = true;
      setTimeout(() => {
        this.buttonShowTemplat = false;
      }, 3000);
      const request = {
        method: 'get',
        url: `/eos/event/bullitin/exportTemplate?eventId=${this.eventId}&&date=${this.form.signTime}`,
        baseURL: window.g.ApiUrl,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          token: Cookies.get('token'),
        },
        responseType: 'arraybuffer',
      };
      downLoadFile(request);
      // window.location.href=`${Url}/eos/event/bullitin/exportTemplate?eventId=${this.eventId}&&date=${this.form.signTime}`
    },
    automaticGeneration() {
      //自动生成
      if (this.eventId == '' || this.eventId == null) {
        this.$message({
          message: '暂无事件可以进行操作',
          type: 'warning',
        });
        return;
      }
      if (this.eventId == 'newID') {
        this.$message({
          message: '请选择保存事件!',
          type: 'warning',
        });
        return;
      }
      let eventTitle = sessionStorage.getItem('eventTitle');
      let eventAllss = sessionStorage.getItem('allCase');
      if (eventAllss == undefined || eventAllss == null) {
        eventAllss = '';
      }
      this.ruleForm.title = eventTitle;
      this.ruleForm.content = eventAllss;
    },
    expDutyPdf() {
      //导出pdf
      if (this.eventId == '' || this.eventId == null) {
        this.$message({
          message: '暂无事件可以进行操作',
          type: 'warning',
        });
        return;
      }
      if (this.eventId == 'newID') {
        this.$message({
          message: '请选择保存事件!',
          type: 'warning',
        });
        return;
      }
      this.getPdf(
        '#conditionTopPrintButton',
        `信息快报${
          this.monthlyNumber == undefined || null
            ? ''
            : `-第${this.monthlyNumber}`
        }期`,
      );
    },
    /**
     * @lastEditor 2020-11-9
     * @lastDate 2020-11-9
     * @description 导出word
     */
    expDutyWord() {
      //导出word
      if (this.eventId == '' || this.eventId == null) {
        this.$message({
          message: '暂无事件可以进行操作',
          type: 'warning',
        });
        return;
      }
      if (this.eventId == 'newID') {
        this.$message({
          message: '请选择保存事件!',
          type: 'warning',
        });
        return;
      }
      this.$api
        .verification()
        .then(() => {
          // 只有登录没失效的才会导出word bug7722 author hexinting date 2020-11-9
          let dataJson = {
            vc_bullitin_id: this.backgroundRequestData.vc_bullitin_id,
            pictures: this.backgroundRequestData.pictures,
            videos: this.backgroundRequestData.videos,
            flag: this.backgroundRequestData.flag,
            vc_big_title: this.titleEvnet,
            vc_number: this.backgroundRequestData.vc_number,
            vc_sign_man: this.form.signPerson, //签发人
            vc_sign_time: this.form.signTime, //签发时间
            vc_sign_unit: this.form.signArea, //签发单位
            vc_title: this.ruleForm.title,
            vc_detail: this.ruleForm.content,
            // vc_send:this.form.lordSent,//主送
            // vc_copy:this.form.coptTo,//抄送
            // vc_report:this.form.submission,//报送
            vc_edi_man: this.form.compile, //编辑
            vc_edi_phone: this.form.phone, //电话
            vc_from: this.backgroundRequestData.vc_from,
            vc_address: this.backgroundRequestData.vc_address,
            vc_lat: this.backgroundRequestData.vc_lat,
            vc_lng: this.backgroundRequestData.vc_lng,
          };
          // let form1 = document.createElement('form');
          // document.body.appendChild(form1);
          // let input = document.createElement('input');
          // input.type = 'text';
          // input.name = 'json';
          // input.value = JSON.stringify(dataJson);
          // form1.appendChild(input);
          // form1.method = 'POST';
          // form1.action = Url + '/eos/event/bullitin/exportEventDayWord';
          // form1.submit();
          // document.body.removeChild(form1);

          // 下载文件
          // 修复bug 12455
          let formData = new FormData();
          formData.append('json', JSON.stringify(dataJson))
          const request = {
            method: 'post',
            url: '/eos/event/bullitin/exportEventDayWord',
            baseURL: window.g.ApiUrl,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              token: Cookies.get('token'),
            },
            responseType: 'arraybuffer',
            data: formData,
          };
          downLoadFile(request);
        })
        .catch((err) => {
          // 网络请求错误 或者 登录失效的信息都在这捕获
          console.log(err);
        });
      // if(this.buildId==''||this.buildId==null){
      //   this.$message({
      //     message: '暂无快报可以导出',
      //     type: 'warning'
      //   });
      //   return
      // }
      // window.location.href= Url + `/eos/event/bullitin/exportEventDayWord?id=${this.buildId}`
    },
    conditionSendApp() {
      //发送到APP
      if (this.eventId == '' || this.eventId == null) {
        this.$message({
          message: '暂无事件可以进行操作',
          type: 'warning',
        });
        return;
      }
      if (this.eventId == 'newID') {
        this.$message({
          message: '请选择保存事件!',
          type: 'warning',
        });
        return;
      }
      if (
        this.addTopShow == true &&
        this.buildId !== '' &&
        this.buildId !== null
      ) {
        this.conditionData = true;
        this.conditionTitle = '选择联系人';
        this.$refs.searchTable.info();
      } else {
        this.$message({
          message: '新增请先保存再发送到APP',
          type: 'warning',
        });
      }
    },
    conditionCloseDialog() {
      //弹窗关闭
      this.conditionData = false;
    },
    conditionConfirm(multipleSelection) {
      //弹窗确定
      console.log(multipleSelection);
      if (
        multipleSelection == '' ||
        multipleSelection == null ||
        multipleSelection == undefined
      ) {
        this.$message({
          message: '选项不能为空!',
          type: 'warning',
        });
        return;
      }

      let data = {
        id: this.buildId,
        contacters: multipleSelection,
      };
      this.$api.sendApp(data).then((res) => {
        if (res.errorcode == 0) {
          this.$message({
            message: '发送成功!',
            type: 'success',
          });
          this.conditionData = false;
        } else {
          //this.$message.error(res.msg)
        }
      });
    },
    conditionClose() {
      //弹窗叉叉
      this.conditionData = false;
    },
    readUser() {
      this.eventId = sessionStorage.getItem('newID');
      let userName = sessionStorage.getItem('displayname');
      if (
        this.eventId == '' ||
        this.eventId == null ||
        this.eventId == 'newID'
      ) {
        return;
      }
      this.form.compile = userName;
      let date = new Date(); // 获取当前日期
      let nowMonth = date.getMonth() + 1;
      let strDate = date.getDate();
      let seperator = '-'; // 添加分隔符“-”
      if (nowMonth >= 1 && nowMonth <= 9) {
        // 对月份进行处理，1-9月在前面添加一个“0”
        nowMonth = '0' + nowMonth;
      }
      if (strDate >= 0 && strDate <= 9) {
        // 对月份进行处理，1-9号在前面添加一个“0”
        strDate = '0' + strDate;
      }
      //拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
      this.getTimeMoRens =
        date.getFullYear() + seperator + nowMonth + seperator + strDate;
      this.receiveData();
    },
    receiveData() {
      let data = {
        eventId: this.eventId,
      };
      this.$api.eventLettersHistory(data).then((res) => {
        if (res.errorcode == 0) {
          if (res.data == [] || res.data == '') {
            return;
          }
          console.log(res.data);
          this.number = res.data.length;
          let str = res.data.length - 1;
          this.buildId = res.data[str].id;
          let json = res.data[str].json;
          let resData = JSON.parse(json);
          this.titleEvnet = resData.vc_big_title;
          this.ruleForm.title = resData.vc_title;
          this.ruleForm.content = resData.vc_detail;
          this.form.lordSent = resData.vc_send;
          this.form.coptTo = resData.vc_copy;
          this.form.submission = resData.vc_report;
          this.form.compile = resData.vc_edi_man;
          this.form.phone = resData.vc_edi_phone;
          this.form.signPerson = resData.vc_sign_man;
          this.form.signArea = resData.vc_sign_unit;
          this.form.signTime = resData.vc_sign_time;
          this.saveTime = resData.vc_sign_time;
        }
      });
    },
    addTopBulletin() {
      //新增
      this.number += 1;
      this.form.signTime = this.getTimeMoRens;
      this.buildType = '新增';
      this.addTopShow = false;
      this.cancelTopShow = true;
      this.issusePerson = this.form.signPerson;
      this.form.signPerson = '';
    },
    cancelTopBulletin() {
      //撤销
      this.number -= 1;
      this.form.signTime = this.saveTime;
      this.buildType = '撤销';
      this.addTopShow = true;
      this.cancelTopShow = false;
      this.form.signPerson = this.issusePerson;
    },
    saveEvent(form) {
      //保存情况上报
      if (this.eventId == '' || this.eventId == null) {
        this.$message({
          message: '暂无事件可以进行操作',
          type: 'warning',
        });
        return;
      }
      if (this.eventId == 'newID') {
        this.$message({
          message: '请选择保存事件!',
          type: 'warning',
        });
        return;
      }
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.saveSetime = true;
          setTimeout(() => {
            this.saveSetime = false;
          }, 3000);
          let data;
          let json = {
            vc_bullitin_id: '',
            pictures: '',
            videos: '',
            flag: '',
            vc_big_title: this.titleEvnet,
            vc_number: '',
            vc_sign_man: this.form.signPerson, //签发人
            vc_sign_time: this.form.signTime, //签发时间
            vc_sign_unit: this.form.signArea, //签发单位
            vc_title: this.ruleForm.title,
            vc_detail: this.ruleForm.content,
            // vc_send:this.form.lordSent,//主送
            // vc_copy:this.form.coptTo,//抄送
            // vc_report:this.form.submission,//报送
            vc_edi_man: this.form.compile, //编辑
            vc_edi_phone: this.form.phone, //电话
            vc_from: '',
            vc_address: '',
            vc_lat: '',
            vc_lng: '',
          };

          if (this.addTopShow == false) {
            data = {
              eventId: this.eventId,
              json: JSON.stringify(json),
              id: null,
            };
          } else {
            data = {
              eventId: this.eventId,
              json: JSON.stringify(json),
              id: this.buildId,
            };
          }
          this.$api.saveEventDay(data).then((res) => {
            if (res.errorcode == 0) {
              if (this.buildType == '新增') {
                this.$message({
                  message: '新增成功！',
                  type: 'success',
                });
                this.addTopShow = true;
                this.cancelTopShow = false;
                this.buildType = '撤销';
                this.receiveData();
              } else {
                this.$message({
                  message: '保存成功！',
                  type: 'success',
                });
                this.receiveData();
              }
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped>
@page {
  top: 20px;
  size: a4;
  margin: 0cm 1cm 0cm 1cm;
}
.title {
  page-break-before: always;
  page-break-after: always;
  page-break-inside: avoid;
}
@media print {
  header {
    display: none;
  }
  footer {
    display: none;
  }
  .spanClass {
    display: inline-block;
    width: 60px;
  }
  .mainForm >>> .el-form-item {
    margin-bottom: 5px;
  }
}
.spanClass {
  display: inline-block;
  width: 60px;
}
.spanClass >>> .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.mainForm >>> .el-form-item {
  margin-bottom: 5px;
}
#lorsty {
  margin: 0;
}
#lorsty li {
  list-style: none;
  padding: 10px 0;
  width: 100%;
  text-align: left;
}
</style>
