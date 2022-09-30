<template>
  <div class="ElectronicPassSee">
    <el-row :gutter="20"></el-row>
    <el-row :gutter="20">
      <div style="display:flex;justify-content:center;background-color: white;padding: 6px 0 10px;">
        <img
          style="width:27;height:21.41px;margin:8px 12px 0 0;"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAWCAYAAAAxSueLAAABt0lEQVRIS8WWMU9TURTH///zGmgkLhoJfATCZEKaGLSvgwuJgQU2dgZiowMDn8DBQVpgcGTHwRgXExKwwAAYHQwfgAWMiTERCsa+8zfPpOY10L6k+ugdzz33/s7vnDtcFpc1SeklgCFkt05EzjGs+rGT07XH3MmK9WBZ4yatxzBtlY1ZgZr3xpwew2YUhCEKbCBoZ+uEn+Wx/2GOv4ovNGLE7ZZc4XTzKT8lY1eahSu6B9duWlspTpwTu3noG3C5MAdHa2UedmxjaUn3ZaqlwRz+qFbOvS1V9dAVDbaaBafvn+ANQP1XWFpRPYRVXPzJ4WYF3ocCqddpFYuctQtseB5TFG4l82WoWx2vQDSacfXrmGHFZeBYMxgJo6TW0mCQ5gX7TNM7AP0tMMEJThtw9FcCOrgEizfdMWiAtQNGBgXAl3hfjpsRMNCSa7jIAd+TMW8HS7XqIqH3sLgtHmiRwo0uBP4cEVG3iM9o+NFxZgLuOLRK/gNMqBs4T+Br6gPp1qjTueufWbHiUQAWsrBJ3hlBeyxWtQ34R0p7WQHFWMbusrSqoajhC5bhH8SBkyBnzzP/DiS79Rs8xgUahfhE1QAAAABJRU5ErkJggg=="
          alt
        />
        <span class="thetitle" v-if="title==='查看'">通行证详情</span>
        <span class="thetitle" v-if="title==='审核'">{{title}}通行证</span>
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
          <div style="width: 25%" class="hide">审核时间：{{detailData.lockTime?detailData.lockTime:'-'}}</div>
        </div>
        <div style="width: 100%;">审核备注：{{detailData.lockReason?detailData.lockReason:'-'}}</div>
        <div style="color:#0091ff;text-align:center;cursor: pointer;" @click="seeRecord">查看审核记录</div>
      </div>
      <p class="title">基本信息</p>
      <div class="info" style="display:flex;justify-content:space-between;">
        <div>
          <div style="display:flex;">
            <img
              id="image"
              v-if="detailData.imgUrl"
              :src="detailData.imgUrl.indexOf('http') === -1?baseUrl+detailData.imgUrl:detailData.imgUrl"
              class="avatar"
            />
            <img
              id="image"
              v-else
              :src="detailData.sex=='1'?malePicture:femalePicture"
              class="avatar"
            />
            <div style="display:flex;flex-direction:column;justify-content:space-between;">
              <p>
                <span class="limit">所属企业：</span>
                {{detailData.platformNameString?detailData.platformNameString:"无"}}
              </p>
              <p>
                <span class="limit">姓名：</span>
                {{detailData.imName?detailData.imName:"无"}}
              </p>
              <p>
                <span class="limit">性别：</span>
                {{detailData.sexString?detailData.sexString:"无"}}
              </p>
              <p>
                <span class="limit">手机号码：</span>
                {{detailData.phone?detailData.phone:'无'}} &nbsp;&nbsp;&nbsp;&nbsp; <span style="color:#0091ff;cursor: pointer;" @click="sendSMS(detailData.id)">发送短信</span>
              </p>
              <p>
                <span class="limit">身份证号码：</span>
                {{detailData.credentialsNum?detailData.credentialsNum:"无"}}
              </p>
            </div>
          </div>
        </div>
        <div v-if="electronicId" style="width:200px;text-align:center;">
          <img
            v-if="detailData.qrCode"
            id="code"
            :src="detailData.qrCode.indexOf('http') === -1?baseUrl+detailData.qrCode:detailData.qrCode"
            class="code"
          />
          <img v-else id="code" :src="detailData.qrCode" class="code" />
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
          v-for="(item,index) in registeinfor"
          :key="item.id"
          style="padding:0 20px;margin:20px 0;line-height:35px;"
        >
          <p style="color:#333;font-weight:bold;">{{item.title}}</p>
          <p style="color:#666" v-if="item.topicName!='图片'">{{item.answer?item.answer:'无'}}</p>
          <template v-else>
            <img
              v-for="(v,index) in  item.answer?JSON.parse(item.answer):[]"
              :key="index"
              :src="v.oldPath"
              id="image"
              width="150"
              height="200"
              style="margin:5px;"
            />
          </template>
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
    <!-- 发送短信 -->
    <send-sms ref="SendSMSView" v-if="SendSMSView"> </send-sms>
    <!-- 审核记录 -->
    <audit-record ref="AuditRecordView" v-if="AuditRecordView"></audit-record>
  </div>
</template>

<script>
import $ from "jquery";
import Viewer from "viewerjs";
import Cookies from "js-cookie";
import AuditRecord from "../../Troubleshooting/AuditRecord";
import SendSMS from "../../Troubleshooting/SendSMS";

export default {
  name: "ElectronicPass-see",
  data() {
    return {
      registeinfor: [], //登记信息
      problem2: "",
      problem3: [],
      problem4: "",
      problem5: "",
      trafficInfo: "", //交通信息
      seeChange: true, // 身份证开关
      detailData: {
        //详情数据
        imName: "",
        phone: "",
        credentialsNum: "",
        sexString: "",
        platformNameString: "",
        imgUrl: "",
        qrCode: "",
        lockStatusString: ""
      },
      electronicId: "",
      // trafficRecord: [],
      baseUrl: window.SITE_CONFIG["baseUrl"] + "/",
      checkCode: "", //核验口令
      title: "", //复工类型
      lockReason: "", //审核备注
      malePicture: require("../../../../assets/img/ElectronicPass/maleHead.png"),
      femalePicture: require("../../../../assets/img/ElectronicPass/femaleHead.png"),
      AuditRecordView: false, //审核记录视图
      SendSMSView: false, //短信视图
      page: "", //当前列表页数
    };
  },
  created() {
    if (this.$route.query.electronicId) {
      this.electronicId = this.$route.query.electronicId;
      this.getDetailData();
      this.getPicture();
    }
    this.title = this.$route.query.title;
    this.page = this.$route.query.page;
    // alert(this.title)
    this.checkCode = this.$route.query.checkCode;
  },
  mounted() {
    setTimeout(() => {
      for (let i = 0; i < $(".statu").length; i++) {
        if (
          $(".statu")
            .eq(i)
            .siblings()
            .eq(0)
            .html() === "进入园区" ||
          $(".statu")
            .eq(i)
            .siblings()
            .eq(0)
            .html() === "解锁通行证"
        ) {
          $(".statu")
            .eq(i)
            .parents(".el-timeline-item__wrapper")
            .siblings(".el-timeline-item__node")
            .css({ color: "#0BD295" });
        } else if (
          $(".statu")
            .eq(i)
            .siblings()
            .eq(0)
            .html() === "离开园区"
        ) {
          $(".statu")
            .eq(i)
            .parents(".el-timeline-item__wrapper")
            .siblings(".el-timeline-item__node")
            .css({ color: "#0091FF" });
        } else if (
          $(".statu")
            .eq(i)
            .siblings()
            .eq(0)
            .html() === "拒绝通行" ||
          $(".statu")
            .eq(i)
            .siblings()
            .eq(0)
            .html() === "锁定通行证"
        ) {
          $(".statu")
            .eq(i)
            .parents(".el-timeline-item__wrapper")
            .siblings(".el-timeline-item__node")
            .css({ color: "#F85B47" });
        } else if (
          $(".statu")
            .eq(i)
            .siblings()
            .eq(0)
            .html() === "通过核验" ||
          $(".statu")
            .eq(i)
            .siblings()
            .eq(0)
            .html() === "已驳回申请"
        ) {
          $(".statu")
            .eq(i)
            .parents(".el-timeline-item__wrapper")
            .siblings(".el-timeline-item__node")
            .css({ color: "#F2B626" });
        }
      }
    }, 300);
  },
  beforeRouteLeave(to, from, next) {
    // console.log(from.name);
    if (to.name != "ElectronicPass") {
      to.query.page = this.page;
    }
    next(); //一定不能忘写！
  },
  methods: {
    // 预览图片
    initImageTools() {
      // alert(11111)
      //初始化 viewerjs
      // 预览头像
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
      // 预览二维码
      setTimeout(() => {
        const ViewerCode = document.querySelectorAll("#code");
        for (let i = 0; i < ViewerCode.length; i++) {
          if (typeof ViewerCode[i] === "object") {
            // console.log("ViewerDom[i]",ViewerDom[i])
            const viewer = new Viewer(ViewerCode[i], {
              url: "data-original"
            });
          }
        }
      });
    },
    // 获取详情数据
    getDetailData() {
      this.$http({
        url: this.$http.adornUrl("/pass/passRegister/getOneAndLink"),
        method: "get",
        params: this.$http.adornParams({
          id: this.electronicId
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          var trafficInfo = []; //存放交通信息
          this.detailData = data.data;
          this.registeinfor =
            data.data.epiRegisterTikuEntity.epiQuestionEntityList;

          this.initImageTools();
          this.registeinfor.map(v => {
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
              let content = "";
              v.epiSelectEntityList.map(item => {
                if (v.answer.indexOf("#") === -1) {
                  v.answer.split(",").map(one => {
                    if (item.id == one) {
                      content += item.content + "，";
                    }
                  });
                } else {
                  // console.log(v.answer.substring(0,v.answer.indexOf('#')))
                  // console.log(v.answer.substring(0,v.answer.indexOf('#')).split(','))
                  v.answer
                    .substring(0, v.answer.indexOf("#"))
                    .split(",")
                    .map(one => {
                      if (item.id == one) {
                        content += item.content + "，";
                      }
                    });
                }
              });
              if (v.answer.indexOf("#") === -1) {
                v.answer = content.substring(0, content.length - 1);
              } else {
                v.answer =
                  content +
                  v.answer.substring(
                    v.answer.indexOf("#") + 2,
                    v.answer.length
                  );
              }
            }
          });
          // this.trafficRecord = data.data.passRegisterHistoryList
        } else {
          this.detailData = {};
          this.registeinfor = [];
          trafficInfo = [];
          this.$message.error(data.msg);
        }
      });
    },
    // 获取认证图片
    getPicture() {
      this.$http({
        url: this.$http.adornUrl(
          `/pass/passRegister/output-passEpiEmployeeToPicture?id=${this.electronicId}`
        ),
        method: "get",
        responseType: "blob"
      }).then(({ data }) => {
        const qrUrl = window.URL.createObjectURL(data);
        this.detailData.qrCode = qrUrl;
        // console.log(qrUrl)
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
    // 通过审核
    preserve(type) {
      this.$http({
        url: this.$http.adornUrl(`/pass/passRegister/updateLockStatusPc`),
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
                path: "/Linkage/ElectronicPass/ElectronicPass"
              });
            }
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
      // 打开
    sendSMS(){
      this.SendSMSView = true
      this.$nextTick(()=>{
        this.$refs.SendSMSView.init(this.detailData.id,'/pass/passRegister/sendRegisterMsg')
      })
    },  
    // 下载通行证
    download() {
      window.location.href = `${
        this.baseUrl
      }pass/passRegister/output-passEpiEmployeeToPicture?id=${
        this.electronicId
      }&token=${Cookies.get("token")}`;
    },
    blobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = e => {
          resolve(e.target.result);
        };
        // readAsDataURL
        fileReader.readAsDataURL(blob);
        fileReader.onerror = () => {
          reject(new Error("文件流异常"));
        };
      });
    },
    // 查看审核记录
    seeRecord(){
      this.AuditRecordView = true
      this.$nextTick(()=>{
        this.$refs.AuditRecordView.init(2,this.electronicId)
      })
    }
  },
  components: {
    AuditRecord,
    sendSms: SendSMS,
  }
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
.ElectronicPassSee {
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
    .example {
      color: #c0c0c0;
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
    width: 120px;
    height: 200px;
    border-radius: 10px;
    margin-right: 30px;
  }
  .limit {
    display: inline-block;
    width: 120px;
  }
  .code {
    width: 100%;
    height: 250px;
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
    .process {
      padding: 10px 20px;
      display: flex;
      align-items: center;
      box-shadow: 0px 1px 4px 0px rgba(187, 211, 230, 0.5);
      border: 1px solid rgba(237, 237, 237, 1);
      margin: 10px 0px 10px 20px;
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
  .operation {
    display: flex;
    justify-content: center;
    background-color: white;
  }
  .remark {
    display: flex;
    align-items: center;
    padding: 20px 20px 5px;
    background-color: white;
  }
  .save {
    color: white !important;
    background-color: #0091ff !important;
    border-color: #0091ff !important;
  }
}
</style>