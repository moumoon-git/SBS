<!--@author：yf-->
<template>
  <div>
    <div style="padding-bottom: 30px">
      <div>
        <el-header style="height: 80px">
          <h2>{{ titleEvnet }}</h2>
          <div style="position: relative">
            第
            <span class="spanClass">
              <el-input :disabled="true" v-model="number"></el-input>
            </span>
            期
            <div style="position: absolute; right: 0; top: 0">
              <el-button
                type="primary"
                size="small"
                v-if="addShow"
                @click="addBulletin"
                >新增</el-button
              >
              <el-button
                type="primary"
                size="small"
                v-if="cancelShow"
                @click="cancelBulletin"
                >撤销</el-button
              >
            </div>
          </div>
        </el-header>

        <el-main class="mainForm">
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
              ></el-input>
            </el-form-item>
          </el-form>
        </el-main>

        <div style="padding: 20px">
          <el-form
            label-width="80px"
            :model="form"
            :rules="formRules"
            ref="form"
            @submit.native.prevent
            label-position="left"
          >
            <el-row :gutter="gutter">
              <el-col :span="24">
                <el-form-item label="主送:">
                  <el-input
                    type="text"
                    v-model.trim="form.lordSent"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="gutter">
              <el-col :span="24">
                <el-form-item label="抄送:">
                  <el-input
                    type="text"
                    v-model.trim="form.coptTo"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="gutter">
              <el-col :span="24">
                <el-form-item label="报送:">
                  <el-input
                    type="text"
                    v-model.trim="form.submission"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="gutter">
              <el-col :span="7">
                <el-form-item label="编辑:">
                  <el-input
                    type="text"
                    v-model.trim="form.compile"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
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
              <el-col :span="7">
                <el-form-item label="签发人:">
                  <el-input
                    type="text"
                    v-model.trim="form.signPerson"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="签发单位:">
                  <el-input
                    type="text"
                    v-model.trim="form.signArea"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="签发时间:">
                  <el-date-picker
                    style="width: 100%"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    v-model="form.signTime"
                    type="date"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="addButton">
        <el-button
          type="primary"
          size="small"
          @click="save('form')"
          :disabled="saveDisabled"
          >保存</el-button
        >
        <el-button type="primary" size="small" @click="automaticGeneration"
          >自动生成</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="generateSystemTemplate"
          :disabled="buttonShowTemplat"
          >系统模板</el-button
        >
        <el-button type="primary" size="small" @click="sendApps"
          >发送到APP</el-button
        >
        <el-button
          type="primary"
          size="small"
          v-print="'#printEvent'"
          :disabled="showPrintEvent"
          >打印</el-button
        >
        <el-button
          type="primary"
          size="small"
          @click="expEventBuildWord"
          ref="download"
          >导出Word</el-button
        >
        <el-checkbox v-model="checked" style="display: none"
          >导出附件</el-checkbox
        >
        <el-button size="small" type="primary" @click="warnNoWord">
          快报文档
        </el-button>
      </div>

      <!-- <search-table
        ref="searchTable"
        :selectTitle="selectTitle"
        :selectData="selectData"
        @closeDialog="searchCloseDialog"
        @confirm="searchConfirm"
        @close="searchClose"
      ></search-table> -->
      <add-contact
        v-if="addContactVisible"
        ref="addContact"
        @changeDialog="addContactVisible = false"
        @appConfirm="searchConfirm"
      />
    </div>

    <!-- 下面是打印的内容-->
    <div id="printEvent" style="position: fixed; z-index: -999">
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
            第 {{ number }} 期
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
            {{ title }}
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
            {{ content }}
          </div>
          <!--          <el-input type="textarea" resize="none"-->
          <!--                    :autosize="{ minRows:15}"-->
          <!--                    v-model.trim="monthlyContent" show-word-limit></el-input>-->
        </div>
        <div style="padding: 20px">
          <ul id="lorsty">
            <li>主送:{{ lordSent }}</li>
            <li>抄送:{{ coptTo }}</li>
            <li>报送:{{ submission }}</li>
            <li>编辑:{{ compile }}</li>
            <li>电话:{{ phone }}</li>
            <li>签发人:{{ signPerson }}</li>
            <li>签发单位:{{ signArea }}</li>
            <li>签发时间:{{ signTime }}</li>
          </ul>
        </div>
      </div>
    </div>
    <!--    <div  id="printEvent" style="position: fixed;z-index: -9999999">-->
    <!--      <div style="height: 80px;width: 800px">-->
    <!--        <h2 style="text-align: center">{{titleEvnet}}</h2>-->
    <!--        <div style="position: relative;text-align: center">-->
    <!--          第-->
    <!--          <span class="spanClass">-->
    <!--           <el-input :disabled="true" v-model="number"></el-input>-->
    <!--          </span>-->
    <!--          期-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <el-main class="mainForm">-->
    <!--        <el-form >-->
    <!--          <el-form-item>-->
    <!--            <el-input type="text"  v-model="title" show-word-limit></el-input>-->
    <!--          </el-form-item>-->
    <!--          <el-form-item>-->
    <!--            <el-input-->
    <!--              type="textarea" v-model="content" show-word-limit-->
    <!--              :autosize="{ minRows:7, maxRows: 9999999999999999999999999999999999999999}"-->
    <!--            ></el-input>-->
    <!--          </el-form-item>-->
    <!--        </el-form>-->
    <!--      </el-main>-->
    <!--      <div style="padding: 20px">-->
    <!--        <el-form label-width="80px" label-position="left">-->
    <!--          <el-row :gutter="gutter">-->
    <!--            <el-col :span="24">-->
    <!--              <el-form-item label="主送:">-->
    <!--                <span>{{lordSent}}</span>-->
    <!--              </el-form-item>-->
    <!--            </el-col>-->
    <!--          </el-row>-->
    <!--          <el-row :gutter="gutter">-->
    <!--            <el-col :span="24">-->
    <!--              <el-form-item label="抄送:">-->
    <!--                <span >{{coptTo}}</span>-->
    <!--              </el-form-item>-->
    <!--            </el-col>-->
    <!--          </el-row>-->
    <!--          <el-row :gutter="gutter">-->
    <!--            <el-col :span="24">-->
    <!--              <el-form-item label="报送:">-->
    <!--                <span>{{submission}}</span>-->
    <!--              </el-form-item>-->
    <!--            </el-col>-->
    <!--          </el-row>-->
    <!--          <el-row :gutter="gutter">-->
    <!--            <el-col :span="24" >-->
    <!--              <el-form-item label="编辑:">-->
    <!--                <span>{{compile}}</span>-->
    <!--              </el-form-item>-->
    <!--            </el-col>-->

    <!--          </el-row>-->
    <!--          <el-row>-->
    <!--            <el-col :span="24" >-->
    <!--              <el-form-item label="电话:" >-->
    <!--                <span >{{phone}}</span>-->
    <!--              </el-form-item>-->
    <!--            </el-col>-->
    <!--          </el-row>-->

    <!--          <el-row :gutter="gutter">-->
    <!--            <el-col :span="7">-->
    <!--              <el-form-item label="签发人:">-->
    <!--                <span >{{signPerson}}</span>-->
    <!--              </el-form-item>-->
    <!--            </el-col>-->
    <!--          </el-row>-->

    <!--          <el-row :gutter="gutter">-->
    <!--            <el-col :span="24">-->
    <!--              <el-form-item label="签发单位:">-->
    <!--                <span  >{{signArea}}</span>-->
    <!--              </el-form-item>-->
    <!--            </el-col>-->
    <!--          </el-row>-->
    <!--          <el-row :gutter="gutter">-->
    <!--            <el-col :span="24">-->
    <!--              <el-form-item label="签发时间:">-->
    <!--                <span>{{signTime}}</span>-->
    <!--              </el-form-item>-->
    <!--            </el-col>-->
    <!--          </el-row>-->
    <!--        </el-form>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script>
// import searchTable from '../searchTable';
import addContact from "@/view/yz_integratedCommunication/icpPhone/icpPhonePage/smsStep/addContact/AddContact";
import { Url } from '@/assets/js/common';
import Cookies from "js-cookie";
const downLoadFile = require('@/utils/downloadFile.js').default;
export default {
  name: 'historicalDetails',
  components: {
    // searchTable,
    addContact,
  },
  props: {
    wordUrl: {
      type: String,
    },
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
      number: 1, //第几期
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
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: number, trigger: 'blur' },
          { min: 6, max: 12, message: '请输入正确的电话号码!' },
        ],
      }, //第二个表单验证
      backgroundRequestData: '', //存储父组件后台返回快报数据
      addShow: true, //新增按钮
      cancelShow: false, //撤销按钮
      eventId: '', //事件ID
      id: '', //快报ID

      selectTitle: '', //选择发送APP弹窗标题
      selectData: false, //选择发送APP弹窗

      title: '', //打印的内容
      content: '',
      lordSent: '',
      coptTo: '',
      submission: '',
      compile: '',
      phone: '',
      signPerson: '',
      signArea: '',
      signTime: '',
      showPrintEvent: true, //打印按钮

      saveDisabled: false, //保存按钮定时
      getTimeMoRen: '', //默认时间
      saveResTime: '', //接口返回时间

      automatic: [], //自动生成左侧表格默认
      issuse: '', //为撤销又回到之前的数据存的签发人
      typeLX: '撤销',
      buttonShowTemplat: false,
      addContactVisible: false, // 发送到app
    };
  },
  watch: {
    titleEvnet: {
      handler(newV) {
        this.titleEvnet = newV;
      },
      deep: true,
    },
    number: {
      handler(newV) {
        this.number = newV;
      },
      deep: true,
    },
    ruleForm: {
      handler(newV) {
        this.title = newV.title;
        this.content = newV.content;
      },
      deep: true,
    },
    form: {
      handler(newV) {
        this.lordSent = newV.lordSent;
        this.coptTo = newV.coptTo;
        this.submission = newV.submission;
        this.compile = newV.compile;
        this.phone = newV.phone;
        this.signPerson = newV.signPerson;
        this.signArea = newV.signArea;
        this.signTime = newV.signTime;
      },
      deep: true,
    },
  },
  mounted() {
    this.readUser();
  },
  methods: {
    warnNoWord() {
      if (this.wordUrl === '') {
        this.$message({
          message: '请先生成快报！',
          type: 'warning',
        });
        return;
      }
      const a = document.createElement('a');
      a.href = this.wordUrl;
      a.click();
    },
    generateSystemTemplate() {
      //系统模板
      console.log(this.form.signTime);
      if (this.eventId == '' || this.eventId == null) {
        this.$message({
          message: '请先选择事件再进行系统生成',
          type: 'warning',
        });
        return;
      }
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
      if (
        this.automatic == '' ||
        this.automatic == [] ||
        this.automatic == null
      ) {
        this.ruleForm.title = '';
        this.ruleForm.content = '';
      }
      this.ruleForm.title = this.automatic.title;
      this.ruleForm.content = this.automatic.reportDescription;
      this.$message({
        message: '生成成功',
        type: 'success',
      });
    },
    /**
     * @lastEditor 2020-11-9
     * @lastDate 2020-11-9
     * @description 导出word
     */
    expEventBuildWord() {
      // 导出word
      const dataJson = {
        vc_bullitin_id: this.backgroundRequestData.vc_bullitin_id,
        pictures: this.backgroundRequestData.pictures,
        videos: this.backgroundRequestData.videos,
        flag: this.backgroundRequestData.flag,
        vc_big_title: this.titleEvnet,
        vc_number: this.number,
        vc_sign_man: this.form.signPerson, //签发人
        vc_sign_time: this.form.signTime, //签发时间
        vc_sign_unit: this.form.signArea, //签发单位
        vc_title: this.ruleForm.title,
        vc_detail: this.ruleForm.content,
        vc_send: this.form.lordSent, //主送
        vc_copy: this.form.coptTo, //抄送
        vc_report: this.form.submission, //报送
        vc_edi_man: this.form.compile, //编辑
        vc_edi_phone: this.form.phone, //电话
        vc_from: this.backgroundRequestData.vc_from,
        vc_address: this.backgroundRequestData.vc_address,
        vc_lat: this.backgroundRequestData.vc_lat,
        vc_lng: this.backgroundRequestData.vc_lng,
      };
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
      // this.$api
      //   .verification()
      //   .then(() => {
      //     // 只有登录没失效的才会导出word bug7722 author hexinting date 2020-11-9
      //     let dataJson = {
      //       vc_bullitin_id: this.backgroundRequestData.vc_bullitin_id,
      //       pictures: this.backgroundRequestData.pictures,
      //       videos: this.backgroundRequestData.videos,
      //       flag: this.backgroundRequestData.flag,
      //       vc_big_title: this.titleEvnet,
      //       vc_number: this.backgroundRequestData.vc_number,
      //       vc_sign_man: this.form.signPerson, //签发人
      //       vc_sign_time: this.form.signTime, //签发时间
      //       vc_sign_unit: this.form.signArea, //签发单位
      //       vc_title: this.ruleForm.title,
      //       vc_detail: this.ruleForm.content,
      //       vc_send: this.form.lordSent, //主送
      //       vc_copy: this.form.coptTo, //抄送
      //       vc_report: this.form.submission, //报送
      //       vc_edi_man: this.form.compile, //编辑
      //       vc_edi_phone: this.form.phone, //电话
      //       vc_from: this.backgroundRequestData.vc_from,
      //       vc_address: this.backgroundRequestData.vc_address,
      //       vc_lat: this.backgroundRequestData.vc_lat,
      //       vc_lng: this.backgroundRequestData.vc_lng,
      //     };
      //     let form1 = document.createElement('form');
      //     document.body.appendChild(form1);
      //     let input = document.createElement('input');
      //     input.type = 'text';
      //     input.name = 'json';
      //     input.value = JSON.stringify(dataJson);
      //     form1.appendChild(input);
      //     form1.method = 'POST';
      //     form1.action = Url + '/eos/event/bullitin/exportEventDayWord';
      //     form1.submit();
      //     document.body.removeChild(form1);
      //   })
      //   .catch((err) => {
      //     // 网络请求错误 或者 登录失效的信息都在这捕获
      //     console.log(err);
      //   });
    },
    save(form) {
      //保存内容
      if (
        this.eventId == '' ||
        this.eventId == null ||
        this.eventId == undefined
      ) {
        this.$message({
          message: '请先选择事件',
          type: 'warning',
        });
        return;
      }
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.saveDisabled = true;
          setTimeout(() => {
            this.saveDisabled = false;
          }, 3000);
          let json = {
            vc_bullitin_id: this.backgroundRequestData.vc_bullitin_id,
            pictures: this.backgroundRequestData.pictures,
            videos: this.backgroundRequestData.videos,
            flag: this.backgroundRequestData.flag,
            vc_big_title: this.titleEvnet,
            vc_number: this.number,
            vc_sign_man: this.form.signPerson, //签发人
            vc_sign_time: this.form.signTime, //签发时间
            vc_sign_unit: this.form.signArea, //签发单位
            vc_title: this.ruleForm.title,
            vc_detail: this.ruleForm.content,
            vc_send: this.form.lordSent, //主送
            vc_copy: this.form.coptTo, //抄送
            vc_report: this.form.submission, //报送
            vc_edi_man: this.form.compile, //编辑
            vc_edi_phone: this.form.phone, //电话
            vc_from: this.backgroundRequestData.vc_from,
            vc_address: this.backgroundRequestData.vc_address,
            vc_lat: this.backgroundRequestData.vc_lat,
            vc_lng: this.backgroundRequestData.vc_lng,
          };
          let data;
          if (this.addShow == false) {
            console.log('false');
            data = {
              eventId: this.eventId,
              json: JSON.stringify(json),
              id: null,
            };
          } else {
            console.log('true');
            data = {
              eventId: this.eventId,
              json: JSON.stringify(json),
              id: this.id,
            };
          }
          this.$api.saveEventDay(data).then((res) => {
            if (res.errorcode == 0) {
              if (this.typeLX == '新增') {
                this.$message({
                  message: '新增成功！',
                  type: 'success',
                });
                this.addShow = true;
                this.cancelShow = false;
                this.typeLX = '撤销';
              } else {
                this.$message({
                  message: '保存成功!',
                  type: 'success',
                });
              }
              this.$emit('getEventHistorical');
              this.$emit('getReceive');
            } else {
              //this.$message.error(res.msg)
            }
          });
        }
      });
    },
    addBulletin() {
      //新增快报按钮
      this.number = this.number + 1;
      this.form.signTime = this.getTimeMoRen;
      this.addShow = false;
      this.typeLX = '新增';
      this.cancelShow = true;
      this.issuse = this.form.signPerson;
      this.form.signPerson = ''; //清空签发人
    },
    cancelBulletin() {
      //撤销按钮
      this.number = this.number - 1;
      this.form.signTime = this.saveResTime;
      this.addShow = true;
      this.typeLX = '撤销';
      this.cancelShow = false;
      this.form.signPerson = this.issuse;
    },
    readUser() {
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
      this.getTimeMoRen =
        date.getFullYear() + seperator + nowMonth + seperator + strDate;
    },
    receiveData(rowData, requestData) {
      this.automatic = rowData;
      this.showPrintEvent = false;
      console.log(rowData, requestData);
      if (requestData == '' || requestData == null || requestData == []) {
        this.ruleForm.title = rowData.title;
        this.eventId = rowData.id;
        this.id = null;
        this.ruleForm.content = rowData.reportDescription;
        this.number = 1;

        this.form.lordSent = '';
        this.form.coptTo = '';
        this.form.submission = '';
        let userName = sessionStorage.getItem('displayname');
        this.form.compile = userName;

        this.form.phone = '';
        this.form.signPerson = '';
        this.form.signArea = '';
        this.form.signTime = this.getTimeMoRen;
      } else {
        if (requestData.length != 0) {
          let last;
          if (requestData.length > 0) {
            last = requestData.length - 1;
          }
          this.eventId = requestData[last].eventId;
          this.id = requestData[last].id;
        }
        this.backgroundRequestData = JSON.stringify(requestData);
        let fut = [];
        for (let i = 0; i < requestData.length; i++) {
          this.number = requestData[i].number;
          fut.push(JSON.parse(requestData[i].json));
        }
        let nub = fut.length;
        if (nub > 0) {
          nub = nub - 1;
        }
        this.ruleForm.title = fut[nub].vc_title;
        this.ruleForm.content = fut[nub].vc_detail;

        this.form.lordSent = fut[nub].vc_send;
        this.form.coptTo = fut[nub].vc_copy;
        this.form.submission = fut[nub].vc_report;
        this.form.compile = fut[nub].vc_edi_man;

        this.form.phone = fut[nub].vc_edi_phone;
        this.form.signPerson = fut[nub].vc_sign_man;
        this.form.signArea = fut[nub].vc_sign_unit;
        this.form.signTime = fut[nub].vc_sign_time;
        this.saveResTime = fut[nub].vc_sign_time;
        console.log(this.form.signTime, fut[nub].vc_sign_time);
      }
    },
    /**
     * @lastEditor hexinting
     * @laseDate 2020-10-22
     * @description 发送APP
     */
    sendApps() {
      //发送APP
      // 左边列表未选中时，提醒先选择事件 bug7728 author:hexinting date:2020-10-22
      if (
        this.automatic == '' ||
        this.automatic == [] ||
        this.automatic == null
      ) {
        this.$message({
          message: '请先选择事件!',
          type: 'warning',
        });
        return;
      }
      if (this.cancelShow) {
        this.$message({
          message: '快报未保存，请先保存!',
          type: 'warning',
        });
        return;
      }
      console.log(this.$refs.buildHistor);
      if (this.id == '' || this.id == null || this.id == undefined) {
        this.$message({
          message: '快报未保存，请先保存',
          type: 'warning',
        });
        return;
      }
      this.addContactVisible = true;
      this.$nextTick(() => {
        this.$refs.addContact.getDataList('选择APP联系人', []);
      });
      this.$store.commit('setSmsOrFax', 'sms');
      // this.selectTitle = '选择联系人';
      // this.selectData = true;
      // this.$refs.searchTable.info();
    },
    searchCloseDialog() {
      this.selectData = false;
    },
    searchConfirm(multipleSelection) {
      //确认
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
      // 取出选中联系人id
      let arr = [];
      arr = multipleSelection.map((x) => { return x.id });
      let data = {
        id: this.id,
        contacters: arr,
      };
      this.$api.sendApp(data).then((res) => {
        if (res.errorcode == 0) {
          this.$message({
            message: '发送成功!',
            type: 'success',
          });
          this.selectData = false;
        } else {
          //this.$message.error(res.msg)
        }
      });
    },
    searchClose() {
      this.selectData = false;
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
}
.addButton {
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: left;
  text-indent: 20px;
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
