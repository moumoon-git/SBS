<template>
  <div class="ResumptionSee">
    <el-row :gutter="20"></el-row>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-row :gutter="20">
          <div
            style="display:flex;justify-content:center;background-color: white;padding: 6px 0 10px;"
          >
            <img
              style="width:27;height:21.41px;margin:8px 12px 0 0;"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAWCAYAAAAxSueLAAABt0lEQVRIS8WWMU9TURTH///zGmgkLhoJfATCZEKaGLSvgwuJgQU2dgZiowMDn8DBQVpgcGTHwRgXExKwwAAYHQwfgAWMiTERCsa+8zfPpOY10L6k+ugdzz33/s7vnDtcFpc1SeklgCFkt05EzjGs+rGT07XH3MmK9WBZ4yatxzBtlY1ZgZr3xpwew2YUhCEKbCBoZ+uEn+Wx/2GOv4ovNGLE7ZZc4XTzKT8lY1eahSu6B9duWlspTpwTu3noG3C5MAdHa2UedmxjaUn3ZaqlwRz+qFbOvS1V9dAVDbaaBafvn+ANQP1XWFpRPYRVXPzJ4WYF3ocCqddpFYuctQtseB5TFG4l82WoWx2vQDSacfXrmGHFZeBYMxgJo6TW0mCQ5gX7TNM7AP0tMMEJThtw9FcCOrgEizfdMWiAtQNGBgXAl3hfjpsRMNCSa7jIAd+TMW8HS7XqIqH3sLgtHmiRwo0uBP4cEVG3iM9o+NFxZgLuOLRK/gNMqBs4T+Br6gPp1qjTueufWbHiUQAWsrBJ3hlBeyxWtQ34R0p7WQHFWMbusrSqoajhC5bhH8SBkyBnzzP/DiS79Rs8xgUahfhE1QAAAABJRU5ErkJggg=="
              alt
            />
            <span class="thetitle" v-if="detailData.lockStatusString==='已审核'">企业认证信息</span>
            <span class="thetitle" v-if="detailData.lockStatusString==='待审核'">企业认证申请</span>
          </div>
          <div
            style="padding: 6px 10px 30px;box-shadow:0px 3px 10px 2px rgba(54,121,225,0.09);background:rgba(255,255,255,1);"
          >
            <div style="display:flex;justify-content:space-between;">
              <div style="width: 20%" class="hide">
                审核状态：
                <span
                  :style="{color:detailData.lockStatusString==='已审核'?'#0BD295':(detailData.lockStatusString==='待审核'?'#F2B626':'#F85B47')}"
                >{{detailData.lockStatusString}}</span>
              </div>
              <div style="width: 25%" class="hide">登记时间：{{detailData.gmtCreate}}</div>
              <div
                style="width: 25%"
                class="hide"
              >审核时间：{{detailData.lockTime?detailData.lockTime:'-'}}</div>
            </div>
            <div style="width: 100%;">审核备注：{{detailData.lockReason?detailData.lockReason:'-'}}</div>
            <div style="color:#0091ff;text-align:center;cursor: pointer;" @click="seeRecord">查看审核记录</div>
          </div>
          <p class="title">档主基本信息</p>
          <div class="info" style="display:flex;justify-content:space-between;">
            <div class="detail">
              <p>
                <span class="limit">姓名：</span>
                {{detailData.imName?detailData.imName:'无'}}
              </p>
              <p>
                <span class="limit">性别：</span>
                {{detailData.sexString?detailData.sexString:'无'}}
              </p>
              <p>
                <span class="limit">籍贯：</span>
                {{detailData.nativePlace?detailData.nativePlace:'无'}}
              </p>
              <p>
                <span class="limit">身份证号码：</span>
                {{detailData.credentialsNum?detailData.credentialsNum:'无'}}
              </p>
              <p>
                <span class="limit">联系方式：</span>
                {{detailData.phone?detailData.phone:'无'}} &nbsp;&nbsp;&nbsp;&nbsp;
                <span style="color:#0091ff;cursor: pointer;" @click="sendSMS(detailData.id)">发送短信</span>
              </p>
              <p>
                <span class="limit">所属社区：</span>
                {{detailData.townNameString?detailData.townNameString:'无'}}
              </p>
              <p>
                <span class="limit">所属市场：</span>
                {{detailData.platformNameString?detailData.platformNameString:'无'}}
              </p>
              <p>
                <span class="limit">档口编号：</span>
                {{detailData.bussCode?detailData.bussCode:'无'}}
              </p>
              <p>
                <span class="limit">所属楼层：</span>
                {{detailData.floorString?detailData.floorString:'无'}}
              </p>
            </div>

            <div v-if="electronicId" style="width:250px;text-align:center">
              <img
                id="image"
                v-if="detailData.qrCode"
                :src="detailData.qrCode.indexOf('http') === -1?baseUrl+detailData.qrCode:detailData.qrCode"
                class="code"
              />
              <img v-else :src="detailData.qrCode" class="code" />
              <div class="status">
                <!-- <span style="cursor:pointer" @click="show">预览</span> -->
                <span style="cursor:pointer" @click="download">下载</span>
              </div>
            </div>
          </div>
        </el-row>

        <el-row :gutter="20">
          <p class="title">登记信息</p>
          <div class="info">
            <div
              v-for="item in registeinfor"
              :key="item.id"
              style="padding:0 20px;margin:20px 0;line-height:35px;"
            >
              <p style="color:#333;font-weight:bold;">{{item.title}}</p>
              <p style="color:#666">{{item.answer?item.answer:'无'}}</p>
            </div>
          </div>
        </el-row>
        <div v-if="title==='审核' || title==='撤销'">
          <el-row :gutter="20">
            <p class="title">审核</p>
            <div class="remark">
              <div>审核备注：</div>
              <textarea style="resize:none;width:60%;" maxlength="50" v-model="lockReason"></textarea>
            </div>
            <div style="background-color:white;padding-bottom:20px;">
              <p style="text-align:right;width:67.3%;">{{lockReason?lockReason.length:0}}/50字</p>
            </div>
          </el-row>
          <el-row :gutter="20">
            <div class="operation">
              <template v-if="title=='审核'">
                <el-button @click="preserve('驳回')">驳回申请</el-button>
                <el-button @click="preserve('审核')">通过审核</el-button>
              </template>
              <template v-if="title=='撤销'">
                <el-button @click="preserve('撤销')">撤销申请</el-button>
              </template>
            </div>
          </el-row>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="records" v-if="electronicId">
          <p class="title">从业人员登记（{{trafficRecord.length}}人）</p>
          <el-timeline style="padding:0;list-style:none;">
            <el-timeline-item
              placement="top"
              style="position:relative;margin-left:20px;"
              icon="iconfont icon-yuanquan"
              v-for="item in trafficRecord"
              :key="item.id"
            >
              <el-card>
                <div class="process">
                  <div style="width:80%;line-height:30px;color:#666;">
                    <div class="hide">
                      <span class="circle"></span>
                      <span style="color:#999;">登记时间：</span>
                      {{item.gmtCreate}}
                    </div>
                    <div style="display:flex;justify-content:space-between;">
                      <div class="hide">
                        <span class="circle"></span>
                        <span style="color:#999;">姓名：</span>
                        {{item.name?item.name:'无'}}
                      </div>
                      <div class="hide">
                        <span class="circle"></span>
                        <span style="color:#999;">性别：</span>
                        {{item.sexString?item.sexString:'无'}}
                      </div>
                      <div class="hide" style="width:40%">
                        <span class="circle"></span>
                        <span style="color:#999;">籍贯：</span>
                        {{item.nativePlace?item.nativePlace:'无'}}
                      </div>
                    </div>
                    <div class="hide">
                      <span class="circle"></span>
                      <span style="color:#999;">手机号码：</span>
                      {{item.phone?item.phone:'无'}}
                    </div>
                    <div class="hide">
                      <span class="circle"></span>
                      <span style="color:#999;">身份证号码：</span>
                      {{item.credentialsNum?item.credentialsNum:'无'}}
                    </div>
                  </div>
                  <div style="color:#0091FF;cursor:pointer;" @click="seeDetail(item.id)">查看</div>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-col>
    </el-row>

    <!-- 查看详情 -->
    <el-dialog
      title="从业人员信息"
      :visible.sync="centerDialogVisible"
      width="930px"
      :modal-append-to-body="false"
      :close-on-press-escape="false"
      center
      :append-to-body="true"
    >
      <el-row :gutter="20">
        <el-col :span="10">
          <div style="border: 1px solid #f0f0f0;">
            <p class="baseInfo">基本信息</p>
            <ul class="left">
              <li>
                <div class="one">姓名</div>
                <div class="two">{{employeeData.name}}</div>
              </li>
              <li>
                <div class="one">性别</div>
                <div class="two">{{employeeData.sexString}}</div>
              </li>
              <li>
                <div class="one">籍贯</div>
                <div class="two">{{employeeData.nativePlace}}</div>
              </li>
              <li>
                <div class="one">手机号</div>
                <div class="two">{{employeeData.phone}}</div>
              </li>
              <li>
                <div class="one">身份证号码</div>
                <div class="two">{{employeeData.credentialsNum}}</div>
              </li>
            </ul>
          </div>
          <img
            id="authentication"
            :src="employeeData.imgUrl"
            alt
            width="100%"
            style="margin-top:10px;"
          />
        </el-col>
        <el-col :span="14">
          <div style="border: 1px solid #f0f0f0;">
            <p class="baseInfo">登记信息</p>
            <ul class="right">
              <li v-for="item in employeeInfor" :key="item.id" style="padding:15px;">
                <p>{{item.title}}</p>
                <p
                  style="color:#666;margin:10px;"
                  v-if="item.topicName!='图片'"
                >{{item.answer?item.answer:'无'}}</p>
                <template v-else>
                  <img
                    v-for="(v,index) in  item.answer?JSON.parse(item.answer):[]"
                    :key="index"
                    :src="v.oldPath"
                    id="authentication"
                    style="max-width:150px;max-height:200px;margin: 5px;"
                  />
                </template>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 发送短信 -->
    <send-sms ref="SendSMSView" v-if="SendSMSView"></send-sms>
    <!-- 审核记录 -->
    <audit-record ref="AuditRecordView" v-if="AuditRecordView"></audit-record>
  </div>
</template>

<script>
import $ from "jquery";
import Viewer from "viewerjs";
import Cookies from "js-cookie";
import SendSMS from "../SendSMS";
import AuditRecord from "../AuditRecord";

export default {
  name: "Resumption-see",
  data() {
    return {
      registeinfor: [], //登记信息
      problem2: "",
      problem3: [],
      problem4: "",
      problem5: "",
      seeChange: true, // 身份证开关
      detailData: {
        //详情数据
        imName: "",
        phone: "",
        credentialsNum: "",
        imgUrl: "",
        qrCode: "",
        lockStatusString: "",
        id: ""
      },
      electronicId: "",
      trafficRecord: [],
      baseUrl: window.SITE_CONFIG["baseUrl"] + "/",
      status: "",
      centerDialogVisible: false, //从业人员详情

      title: "", //复工类型
      checkCode: "", //核验口令
      lockReason: "", //审核备注
      employeeData: {}, //从业人员数据
      employeeInfor: [], //从业人员题库
      SendSMSView: false, //短信视图
      AuditRecordView: false, //审核记录视图
      page: "", //当前列表页数
    };
  },
  created() {
    // alert(this.$route.query.electronicId)
    if (this.$route.query.electronicId) {
      this.electronicId = this.$route.query.electronicId;
      this.getDetailData();
    }
    this.title = this.$route.query.title;
    this.page = this.$route.query.page;
    this.checkCode = this.$route.query.checkCode;
  },
  beforeRouteLeave(to, from, next) {
    // console.log(from.name);
    if (to.name != "Resumption") {
      to.query.page = this.page;
    }
    next(); //一定不能忘写！
  },
  methods: {
    // 获取详情数据
    getDetailData() {
      this.$http({
        url: this.$http.adornUrl("/buss/bussRegister/getOneAndLink"),
        method: "get",
        params: this.$http.adornParams({
          id: this.electronicId
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.detailData = data.data;
          this.registeinfor =
            data.data.epiRegisterTikuEntity.epiQuestionEntityList;

          this.getSubject(this.registeinfor);

          this.trafficRecord = data.data.bussRegisterEmployeeEntityList;

          this.initCodeTools();
          this.getPicture();
        } else {
          this.detailData = {};
          this.registeinfor = [];
          this.trafficRecord = [];
          this.$message.error(data.msg);
        }
      });
    },
    // 预览档主二维码
    initCodeTools() {
      //初始化 viewerjs
      setTimeout(() => {
        const ViewerDom = document.querySelectorAll("#image");

        for (let i = 0; i < ViewerDom.length; i++) {
          if (typeof ViewerDom[i] === "object") {
            // console.log("ViewerDom[i]",ViewerDom[i])
            const viewer = new Viewer(ViewerDom[i], {
              url: "data-original"
            });
          }
        }
      });
    },
    // 预览从业人员认证码
    initAuthentication() {
      //初始化 viewerjs
      setTimeout(() => {
        const ViewerDom = document.querySelectorAll("#authentication");

        for (let i = 0; i < ViewerDom.length; i++) {
          if (typeof ViewerDom[i] === "object") {
            // console.log("ViewerDom[i]",ViewerDom[i])
            const viewer = new Viewer(ViewerDom[i], {
              url: "data-original"
            });
          }
        }
      });
    },
    //图片上传之前
    beforeAvatarUpload(file) {
      let form = new FormData();
      form.append("file", file);
      this.$http({
        url: this.$http.adornUrl(`/upload/platformImages`),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data: form
      })
        .then(({ data }) => {
          // console.log("/upload/platformImages",data)
          if (data && data.code === 0) {
            //this.imageUrl = window.SITE_CONFIG.baseUrl + "/" + data.url;
            var urlStr = data.url.replace(/\\/g, "/");
            // console.log("platformImages",urlStr);
            this.detailData.imgUrl = window.SITE_CONFIG.baseUrl + "/" + urlStr;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {});
    },
    // 从业人员详情
    seeDetail(id) {
      this.centerDialogVisible = true;

      // 降低dialog层级，v-viewer，图片预览显示
      setTimeout(() => {
        document.getElementsByClassName("v-modal")[0].style.zIndex = "2000";
        document.getElementsByClassName("el-dialog__wrapper")[4].style.zIndex =
          "2001";
      }, 300);
      this.$http({
        url: this.$http.adornUrl(`/buss/bussRegisterEmployee/getOneAndLink`),
        method: "get",

        params: this.$http.adornParams({
          id
        })
      }).then(({ data }) => {
        // console.log("/upload/platformImages",data)
        if (data && data.code === 0) {
          this.employeeData = data.data;
          this.employeeInfor =
            data.data.epiRegisterTikuEntity.epiQuestionEntityList;

          this.getSubject(this.employeeInfor);
          this.initAuthentication();
        } else {
          this.employeeData = {};
          this.employeeInfor = [];
          this.$message.error(data.msg);
        }
      });
    },
    // 获取认证图片
    getPicture() {
      this.$http({
        url: this.$http.adornUrl(
          `/buss/bussRegister/output-bussEpiToPicture?id=${this.electronicId}`
        ),
        method: "get",
        responseType: "blob"
      }).then(({ data }) => {
        const qrUrl = window.URL.createObjectURL(data);
        this.detailData.qrCode = qrUrl;
        // console.log(qrUrl)
      });
    },
    // 获取题目
    getSubject(subjectData) {
      subjectData.map(v => {
        if (v.topicName === "单选题" && v.answer) {
          v.epiSelectEntityList.map(item => {
            if (v.answer.indexOf("#") === -1 && v.answer == item.id) {
              v.answer = item.content;
            } else {
              if (v.answer.split("##")[0] == item.id) {
                v.answer = item.content + "，" + v.answer.split("##")[1];
              }
            }
          });
        } else if (v.topicName === "混答+单选" && v.answer) {
          v.epiSelectEntityList.map(item => {
            if (v.answer.indexOf("#") === -1 && v.answer == item.id) {
              v.answer = item.content;
            } else {
              if (v.answer.split("##")[0] == item.id) {
                v.answer = item.content + "，" + v.answer.split("##")[1];
              }
            }
          });
        } else if (v.topicName === "混答+多选") {
          v.epiSelectEntityList.map(item => {
            if (v.answer.indexOf("#") === -1) {
              v.answer.split(",").map(one => {
                if (item.id == one.id) {
                  v.answer = item.content;
                }
              });
            } else {
              v.answer
                .substring(0, v.answer.indexOf("#"))
                .split(",")
                .map(one => {
                  if (item.id == one.id) {
                    v.answer = item.content;
                  }
                });
            }
          });
        }
      });
    },
    // 通过审核
    preserve(type) {
      this.$http({
        url: this.$http.adornUrl(`/buss/bussRegister/updateLockStatusPc`),
        method: "post",

        data: {
          messageCode: this.checkCode,
          lockStatus:
            type == "驳回" ? -2 : type == "审核" ? 0 : type == "撤销" ? -3 : "",
          id: this.electronicId,
          lockReason: this.lockReason
        }
      }).then(({ data }) => {
        // console.log("/upload/platformImages",data)
        if (data && data.code === 0) {
          this.$message({
            type: "success",
            message: `${type}成功`,
            duration: 1500,
            onClose: () => {
              this.$router.push({
                path: "/Troubleshooting/Resumption/Resumption"
              });
            }
          });
          if (type == "驳回") {
            this.toSend(this.lockReason);
          }
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 下载复工证
    download() {
      window.location.href = `${
        this.baseUrl
      }buss/bussRegister/output-bussEpiToPicture?id=${
        this.electronicId
      }&token=${Cookies.get("token")}`;
    },
    // 打开
    sendSMS() {
      this.SendSMSView = true;
      this.$nextTick(() => {
        this.$refs.SendSMSView.init(
          this.detailData.id,
          "/buss/bussMessage/sendRegisterMsg"
        );
      });
    },
    // 查看审核记录
    seeRecord() {
      this.AuditRecordView = true;
      this.$nextTick(() => {
        this.$refs.AuditRecordView.init(1, this.electronicId);
      });
    }
  },
  components: {
    sendSms: SendSMS,
    AuditRecord
  }
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
ul {
  list-style: none;
  padding: 0;
}
.ResumptionSee {
  background-color: #f0f0f0;
  // 隐藏文本
  .hide {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .thetitle {
    font-size: 24px;
    color: #000;
    font-weight: bold;
  }
  .title {
    font-weight: bold;
    font-size: 14px;
    color: #333333;
    letter-spacing: 3px;
    height: 40px;
    line-height: 40px;
    background: rgba(240, 245, 255, 1);
    &::before {
      content: "";
      display: inline-block;
      width: 2px;
      height: 13px;
      background: rgba(63, 146, 254, 1);
      margin: 0 10px 0 18px;
    }
  }
  .info {
    font-size: 14px;
    padding: 20px;
    background-color: white;
    .detail {
      p {
        color: #333;
        margin: 10px 0;
      }
      .limit {
        display: inline-block;
        width: 120px;
        text-align: right;
        color: #666;
      }
    }
  }
  .content {
    width: 250px;
    height: 35px;
    margin-left: 10px;
    outline: none;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding-left: 10px;
  }
  /deep/ .el-radio__input.is-disabled + span.el-radio__label {
    color: black;
  }
  /deep/ .el-radio__input.is-checked .el-radio__inner {
    border-color: #1daaf6;
    background: #1daaf6;
  }
  /deep/ .el-radio__input.is-checked + .el-radio__label {
    color: #1daaf6 !important;
  }
  /deep/ .el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: black;
  }
  /deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    border-color: #1daaf6;
    background: #1daaf6;
  }
  /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #1daaf6 !important;
  }
  /deep/ .el-upload--picture-card {
    width: 100%;
    height: 108px;
    line-height: initial;
    display: flex;
    flex-direction: column;
  }
  .tip {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .avatar {
    width: 80px;
    height: 120px;
    border-radius: 10px;
    margin-right: 30px;
  }

  .code {
    width: 80%;
    margin: 0 10%;
    height: 200px;
  }
  .status {
    margin-top: 10px;
    color: blue;
  }
  .records {
    background-color: white;
    .title {
      height: 100%;
    }
    .info {
      list-style: none;
      padding: 0;
    }
    .process {
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0px 1px 4px 0px rgba(187, 211, 230, 0.5);
      border: 1px solid rgba(237, 237, 237, 1);
      margin-top: 10px;
      .circle {
        width: 4px;
        height: 4px;
        display: inline-block;
        background: rgba(189, 228, 255, 1);
        margin-right: 8px;
        vertical-align: middle;
      }
      .statu {
        width: 84px;
        height: 30px;
        border-radius: 10px;
        opacity: 0.12;
        text-align: center;
        margin: 0 auto;
      }
    }
  }
  .save {
    color: white !important;
    background-color: #0091ff !important;
    border-color: #0091ff !important;
  }
  .remark {
    display: flex;
    align-items: center;
    padding: 20px 20px 5px;
    background-color: white;
  }
  .operation {
    display: flex;
    justify-content: center;
    background-color: white;
  }

  /deep/ .el-timeline-item__wrapper {
    display: flex;
  }
  .el-timeline-item__timestamp {
    width: 200px;
    height: 40px;
    line-height: 40px;
    margin-top: 15px;
    text-align: center;
    border-radius: 10px;
    background-color: #dcdbdb;
    font-size: 20px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  /deep/ .el-timeline-item__tail {
    position: absolute;
    left: 0px;
    top: 82px;
    height: 100%;
    border-left: 2px solid #dcdbdb;
    z-index: 999;
    height: calc(100% - 20px) !important;
  }

  /deep/ .el-timeline .el-timeline-item:last-child .el-timeline-item__tail {
    height: 60%;
  }

  /deep/ .el-timeline-item__node--normal {
    top: 70px;
    left: -5px;
    width: 12px;
    height: 12px;
  }

  /deep/ .el-timeline-item__node {
    position: absolute;
    // background-color: #00a9f2;
    // border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #0091ff;
  }
  /deep/ .el-timeline .el-timeline-item:last-child .el-timeline-item__tail {
    display: none;
  }

  /deep/ .el-card.is-always-shadow,
  .el-card.is-hover-shadow:focus,
  .el-card.is-hover-shadow:hover {
    box-shadow: none;
  }
  /deep/ .el-card {
    border: none;
    // background-color: none;
    color: none;
  }
  /deep/ .el-timeline-item__content {
    width: 100%;
  }

  // /deep/ .el-dialog {
  //   border-radius: 5px;
  //   box-shadow: 0px 0px 15px 2px rgba(0,0,0,0.27);
  //   .el-dialog__header {
  //     // background-color: rgba(241,244,246,1) !important;
  //     padding: 11px 0 11px 20px;
  //     border-radius: 5px 5px 0 0;

  //     .el-dialog__headerbtn {
  //       top: 19px;
  //       .el-dialog__close {
  //         color: #ADB6C2;
  //       }
  //     }
  //     .el-dialog__title {
  //       color: #333 !important;
  //       font-size: 25px !important;
  //       font-weight: bold !important;
  //     }
  //     span{
  //       font-weight: bold;
  //       font-size: 18px;
  //     }
  //   }
  //   .el-dialog__body{
  //     padding: 20px 30px;
  //   }
  // }
}
// 从业人员基本信息
.baseInfo {
  background: rgba(240, 245, 255, 1);
  padding: 20px;
  font-weight: bold;
}
.left {
  li {
    display: flex;
    border-top: 1px solid #f0f0f0;
    .one {
      width: 35%;
      text-align: right;
      padding: 20px 20px 20px 0;
      border-right: 1px solid #f0f0f0;
      color: #888;
    }
    .two {
      width: 65%;
      padding: 20px 0 20px 20px;
    }
  }
}
</style>