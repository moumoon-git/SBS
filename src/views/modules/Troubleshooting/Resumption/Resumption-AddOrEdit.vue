<template>
  <div class="ResumptionAddOrEdit">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-row :gutter="20">
          <div style="display:flex;justify-content:center;background-color: white;padding: 6px 0 10px;">
            <img style="width:27;height:21.41px;margin:8px 12px 0 0;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAWCAYAAAAxSueLAAABt0lEQVRIS8WWMU9TURTH///zGmgkLhoJfATCZEKaGLSvgwuJgQU2dgZiowMDn8DBQVpgcGTHwRgXExKwwAAYHQwfgAWMiTERCsa+8zfPpOY10L6k+ugdzz33/s7vnDtcFpc1SeklgCFkt05EzjGs+rGT07XH3MmK9WBZ4yatxzBtlY1ZgZr3xpwew2YUhCEKbCBoZ+uEn+Wx/2GOv4ovNGLE7ZZc4XTzKT8lY1eahSu6B9duWlspTpwTu3noG3C5MAdHa2UedmxjaUn3ZaqlwRz+qFbOvS1V9dAVDbaaBafvn+ANQP1XWFpRPYRVXPzJ4WYF3ocCqddpFYuctQtseB5TFG4l82WoWx2vQDSacfXrmGHFZeBYMxgJo6TW0mCQ5gX7TNM7AP0tMMEJThtw9FcCOrgEizfdMWiAtQNGBgXAl3hfjpsRMNCSa7jIAd+TMW8HS7XqIqH3sLgtHmiRwo0uBP4cEVG3iM9o+NFxZgLuOLRK/gNMqBs4T+Br6gPp1qjTueufWbHiUQAWsrBJ3hlBeyxWtQ34R0p7WQHFWMbusrSqoajhC5bhH8SBkyBnzzP/DiS79Rs8xgUahfhE1QAAAABJRU5ErkJggg==" alt="">
            <span class="thetitle">新增企业认证</span>
          </div>
            <div style="padding: 6px 10px 30px;box-shadow:0px 3px 10px 2px rgba(54,121,225,0.09);background:rgba(255,255,255,1);">
            <div style="display:flex;justify-content:space-between;">
              <div style="width: 15%" class="hide">审核状态：<span :style="{color:detailData.lockStatusString==='已审核'?'#0BD295':'#F2B626'}">{{detailData.lockStatusString}}</span></div>
              <div style="width: 25%" class="hide">登记时间：{{detailData.gmtCreate}}</div>
              <div style="width: 25%" class="hide">审核时间：{{detailData.lockTime?detailData.lockTime:'-'}}</div>
              <div style="width: 30%" class="hide">审核备注：{{detailData.lockReason?detailData.lockReason:'-'}}</div>
            </div>
          </div>
          <p class="title hide">档主基本信息</p>
          <div class="info" style="display:flex;justify-content:space-between;">
            <el-col :span="10">
              <el-form ref="form" :model="detailData" :rules="rules" label-width="120px">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="detailData.imName"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                  <el-input v-model="detailData.sexString"></el-input>
                </el-form-item>
                  <el-form-item label="籍贯" >
                    <el-input v-model="detailData.nativePlace"></el-input>
                  </el-form-item>
                <el-form-item label="身份证号码" prop="credentialsNum">
                  <el-input v-model="detailData.credentialsNum"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" prop="phone">
                  <el-input v-model="detailData.phone"></el-input>
                </el-form-item>
                <el-form-item label="所属社区">
                  <el-select v-model="detailData.communityId" placeholder="请选择社区" @change="handleCommunity">
                    <el-option v-for="item in community"
                     :key="item.id"
                     :label="item.townName"
                     :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="所属市场">
                  <el-select v-model="detailData.marketId" placeholder="请选择市场" @change="$forceUpdate()">
                    <el-option v-for="item in market"
                     :key="item.id"
                     :label="item.platformName"
                     :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="档口编号" prop="phone">
                  <el-input v-model="detailData.phone"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <div v-if="electronicId" style="width:250px;text-align:center">
              <img v-if="detailData.qrCode" :src="detailData.qrCode.indexOf('http') === -1?baseUrl+detailData.qrCode:detailData.qrCode" class="code" />
              <img v-else :src="detailData.qrCode" class="code" />
              <div class="status">
                  <!-- <span style="cursor:pointer" @click="show">预览</span> -->
                  <span style="cursor:pointer" @click="download">下载</span>
              </div>
            </div>
          </div>
        </el-row>

        <el-row :gutter="20">
          <div class="info">
            <p class="title">登记信息</p>
            <template>
              <div v-for="(item,index) in registeinfor" :key="item.id" style="padding:0 20px;margin-bottom: 20px;">
                <p style="margin:5px;font-weight:bold;color:#333;">{{item.title}}</p>
                <template v-if="item.topicName==='单选题'">
                  <el-radio-group v-model="item.answer">
                    <!-- item.answer?parseInt(item.answer):[] -->
                    <span
                      v-for="v in item.epiSelectEntityList"
                      style="margin-right: 30px;"
                      :key="v.id"
                    >
                      <el-radio :label="v.id">
                        {{v.content}}
                        <input
                          v-if="v.ifInput==='1'"
                          type="text"
                          class="content"
                          v-model="item.remark"
                        />
                      </el-radio>
                    </span>
                  </el-radio-group>
                </template>
                <template v-if="item.topicName==='混答+多选'">
                  <el-checkbox-group v-model="item.answer">
                    <!-- item.answer?item.answer.substring(0,item.answer.indexOf('#')).split(',').map(item => {  return +item;  }):[] -->
                    <span
                      v-for="v in item.epiSelectEntityList"
                      style="margin-right: 20px;"
                      :key="v.id"
                    >
                      <el-checkbox :label="v.id" :key="v.id">
                        {{v.content}}
                        <!-- item.answer?item.answer.substring(item.answer.indexOf('#')+2,item.answer.length).split(','):'' -->
                        <input
                          v-if="v.ifInput==='1'"
                          v-model="item.remark"
                          type="text"
                          class="content"
                        />
                      </el-checkbox>
                    </span>
                  </el-checkbox-group>
                </template>
                <template v-if="item.topicName==='混答+单选'">
                  <el-radio-group v-model="item.answer">
                    <!-- item.answer?parseInt(item.answer.split('##')[0]):[] -->
                    <span
                      v-for="v in item.epiSelectEntityList"
                      :key="v.id"
                      style="margin-right: 30px;"
                    >
                      <el-radio :label="v.id">
                        {{v.content}}
                        <!-- item.answer?item.answer.split('##')[1]:'' -->
                        <input
                          v-if="v.ifInput==='1'"
                          v-model="item.remark"
                          type="text"
                          class="content"
                        />
                      </el-radio>
                    </span>
                  </el-radio-group>
                </template>
                <template v-if="item.topicName==='简答-输入'">
                  <input type="text" placeholder="选填" class="content" v-model="item.answer" />
                </template>
                <template v-if="item.topicName==='简答-文本'">
                  <el-input
                    type="textarea"
                    style="width:450px"
                    resize="none"
                    placeholder="选填"
                    v-model="item.answer"
                  ></el-input>
                </template>
              </div>
            </template>
            <div>
            </div>
          </div>
        </el-row>
          <!-- <el-row :gutter="20">
            <div style="display:flex;justify-content:center;backgroundColor:white;">
              <el-button>取消</el-button>
              <el-button class="save" @click="preserve">保存</el-button>
            </div>
          </el-row> -->
      </el-col>
     <el-col :span="8">
        <div class="records" v-if="electronicId">
          <p class="title">从业人员登记（{{trafficRecord.length}}人）</p>
          <el-timeline style="padding:0;list-style:none;">
            <el-timeline-item placement="top" style="position:relative;margin-left:20px;" icon="iconfont icon-yuanquan" v-for="item in trafficRecord" :key="item.id">
              <el-card>
                <div class="process">
                  <div style="width:80%;line-height:30px;color:#666;">
                    <div class="hide"><span class="circle"></span> <span style="color:#999;">登记时间：</span>{{item.gmtCreate}}</div>
                    <div style="display:flex;justify-content:space-between;">
                      <div class="hide"><span class="circle"></span> <span style="color:#999;">姓名：</span>{{item.name?item.name:'无'}}</div>
                      <div class="hide"><span class="circle"></span> <span style="color:#999;">性别：</span>{{item.sexString?item.sexString:'无'}}</div>
                      <div class="hide"><span class="circle"></span> <span style="color:#999;">籍贯：</span>{{item.nativePlace?item.nativePlace:'无'}}</div>
                    </div>
                    <div class="hide"><span class="circle"></span> <span style="color:#999;">手机号码：</span>{{item.phone?item.phone:'无'}}</div>
                    <div class="hide"><span class="circle"></span> <span style="color:#999;">身份证号码：</span>{{item.credentialsNum?item.credentialsNum:'无'}}</div>
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
    <el-dialog title="从业人员信息" :visible.sync="centerDialogVisible" width="930px">
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
        </el-col>
        <el-col :span="14">
          <div style="border: 1px solid #f0f0f0;">
            <p class="baseInfo">登记信息</p>
            <ul class="right">
              <li v-for="item in employeeInfor" :key="item.id" style="padding:15px;">
                <p>{{item.title}}</p>
                <p style="margin:10px 0;">{{item.answer}}</p>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 核验、锁定、解锁 -->
    <change-status ref="changeStatusView" @getStatu="getStatu"></change-status>
  </div>
</template>

<script>
import changeStatus from "./changeStatus";
import Viewer from "viewerjs";
import Cookies from "js-cookie";

export default {
  name: "Resumption-AddOrEdit",
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
        sexString: "",
        nativePlace: "",
        phone: "",
        credentialsNum: "",
        bussCode: '',
        community: [],
        communityId: "", //社区
        market: [],
        marketId: "", //市场
        qrCode: "",
        lockStatusString: "",
        tikuId: "" //题库Id
      },
      electronicId: "",
      checkCode: "",
      trafficRecord: [],
      baseUrl: window.SITE_CONFIG["cloudUrl"],

      itemBank: {}, //存储题目数据
      status: "",//当前状态

      rules:{
        // name:[
        //   {
        //     required: true,
        //     // pattern: /^[\u4e00-\u9fa5]{2,20}$/,
        //     trigger: "blur",
        //     message: '请输入姓名'
        //    }
        // ],
        phone:[
          {
            required: true,
            pattern: /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/,
            trigger: "blur",
            message: '您输入的手机号码有误'
          }
        ],
        credentialsNum:[
          {
            required: true,
            pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
            trigger: "blur",
            message: '您输入的身份证有误'
          }
        ],
      },
      employeeData: {},//从业人员数据
      employeeInfor: [],//从业人员题库
      centerDialogVisible: false,
    };
  },
  created() {
    // 修改
    if (this.$route.query.electronicId) {
      this.electronicId = this.$route.query.electronicId;
      this.getDetailData();
      // 新增
    } else {
      this.getSubjectData();
    }
    this.checkCode = this.$route.query.checkCode;
  },
  mounted(){
    setTimeout(()=>{
      for(let i=0;i<$('.statu').length;i++){
        if($('.statu').eq(i).siblings().eq(0).html()==="进入园区"||$('.statu').eq(i).siblings().eq(0).html()==="解锁通行证"){ 
          $('.statu').eq(i).parents('.el-timeline-item__wrapper').siblings('.el-timeline-item__node').css({color:'#0BD295'})
        }else if($('.statu').eq(i).siblings().eq(0).html()==="离开园区"){ 
          $('.statu').eq(i).parents('.el-timeline-item__wrapper').siblings('.el-timeline-item__node').css({color:'#0091FF'})
        }else if($('.statu').eq(i).siblings().eq(0).html()==="拒绝通行"||$('.statu').eq(i).siblings().eq(0).html()==="锁定通行证"){ 
          $('.statu').eq(i).parents('.el-timeline-item__wrapper').siblings('.el-timeline-item__node').css({color:'#F85B47'})
        }else if($('.statu').eq(i).siblings().eq(0).html()==="通过核验"||$('.statu').eq(i).siblings().eq(0).html()==="已驳回申请"){ 
          $('.statu').eq(i).parents('.el-timeline-item__wrapper').siblings('.el-timeline-item__node').css({color:'#F2B626'})
        }
      }
    },300)
    this.getTownList()
  },
  methods: {
    // 预览图片
    initImageTools() {
      // alert(11111)
      //初始化 viewerjs
      setTimeout(()=>{
        const ViewerDom = document.querySelectorAll("#image");

      for(let i=0;i<ViewerDom.length;i++){
          if(typeof ViewerDom[i]==='object'){
            // console.log("ViewerDom[i]",ViewerDom[i])
            const viewer = new Viewer(ViewerDom[i], {
              url: "data-original"
            });
          }

        }
      })
    },
    // 获取题目
    getSubjectData() {
      this.$http({
        url: this.$http.adornUrl(
          `/epi/epiRegisterTiku/getTiKuByType?platformId=0&type=5`
        ),
        method: "get"
      }).then(({ data }) => {
        console.log("/upload/platformImages", data);
        if (data && data.code === 0) {
          this.detailData.tikuId = data.data.id;
          this.registeinfor = [...data.data.epiQuestionEntityList];
          this.registeinfor.map(v => {
            if (
              v.topicName === "单选题" ||
              v.topicName === "混答+单选" ||
              v.topicName === "混答+多选"
            ) {
              v.answer = [];
              v.remark = '';
            } else if (
              v.topicName === "简答-文本" ||
              v.topicName === "简答-输入"
            ) {
              v.answer = "";
              v.remark = "";
            }
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
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
          this.detailData.communityId = data.data.townId
          if (this.detailData.townId && this.detailData.platformId) {
            this.handleCommunity()
            setTimeout(()=>{
              this.detailData.marketId = this.detailData.platformId
              this.$forceUpdate()
            },300)
          }
          this.statuOperation(this.detailData.lockStatusString);
          this.registeinfor = [
            ...data.data.epiRegisterTikuEntity.epiQuestionEntityList
          ];
          this.registeinfor.map(v => {
            if (v.topicName === "单选题") {
              v.answer = v.answer ? parseInt(v.answer) : [];
            } else if (v.topicName === "混答+单选") {
              //  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',v.answer.substring(v.answer.indexOf('#'),v.answer.length))
              v.remark = v.answer ? v.answer.split("##")[1] : "";
              v.answer = v.answer ? parseInt(v.answer.split("##")[0]) : [];
            } else if (v.topicName === "混答+多选") {
              v.remark = v.answer
                ? v.answer
                    .substring(v.answer.indexOf("#") + 2, v.answer.length)
                    .split(",")
                : "";
              v.answer = v.answer
                ? v.answer
                    .substring(0, v.answer.indexOf("#"))
                    .split(",")
                    .map(item => {
                      return +item;
                    })
                : [];
            }
          });
          this.trafficRecord = data.data.bussRegisterEmployeeEntityList;

          this.initImageTools()
          this.getPicture()
        } else {
          this.detailData = {};
          this.registeinfor = [];
          this.$message.error(data.msg);
        }
      });
    },
    statuOperation(statu) {
      switch (statu) {
        case "待核验":
          this.status = "核验";
          break;
        case "已锁定":
          this.status = "解锁";
          break;
        case "已驳回申请":
          this.status = "核验";
          break;
        case "允许通行":
          this.status = "锁定";
          break;
        default:
          this.status = "";
      }
    },
    //图片上传之前
    beforeAvatarUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "jpg";
      const extension2 = testmsg === "png";
      if (!extension && !extension2) {
        this.$message({
          message: "上传头像只能是 jpg、png格式!",
          type: "warning"
        });
        return;
      }
      let form = new FormData();
      form.append("file", file);
      this.$http({
        url: this.$http.adornUrl(`/upload/passImg`),
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
            var urlStr = data.data.url.replace(/\\/g, "/");
            this.detailData.imgUrl = this.baseUrl + urlStr;
            this.detailData.imgName = data.data.name;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {});
    },
    // 保存
    preserve() {
          // 保存修改
          console.log('this.registeinforthis.registeinfor',this.registeinfor)
          this.$http({
            url: this.$http.adornUrl(`/buss/bussRegister/${this.electronicId?'update':'save'}`),
            method: "post",
            data: {
              imName: this.detailData.imName,
              id: this.electronicId||undefined,
              phone: this.detailData.phone,
              areaName: '',
              credentialsNum: this.detailData.credentialsNum,
              tikuId: this.detailData.tikuId,
              sex: this.detailData.sexString==="男"?1:(this.detailData.sexString==="女"?2:""),
              nativePlace: this.detailData.nativePlace,
              bussCode: this.detailData.bussCode,
              townId: this.detailData.communityId,
              platformId: this.detailData.marketId,
              bussAnswerEntityList: this.registeinfor.map(v => {
                return {
                  questionId: v.id,
                  answer: v.answer 
                };
              })
            }
          }).then(({ data }) => {
            console.log("/upload/platformImages", data);
            if (data && data.code === 0) {
              if (data.infor.code != 0) {
                this.$message.warning(data.infor.msg);
              }else{
                this.$message({
                  type: "success",
                  message: "保存成功",
                  duration: 1500,
                  onClose: () => {
                    this.$router.push({
                      path: "/Troubleshooting/Resumption/Resumption"
                    });
                  }
                });
              }
            } else {
              this.$message.error(data.msg);
            }
          });
    },
    openView() {
      this.$refs.changeStatusView.init(
        this.electronicId,
        this.checkCode,
        this.status,
        2
      );
    },
    getStatu() {
      if (this.status === "驳回") {
        this.detailData.lockStatusString = '已驳回申请';
      } else if (this.status === "核验") {
        this.detailData.lockStatusString = '允许通行';
      } else if (this.status === "锁定") {
        this.detailData.lockStatusString = '已锁定';
      } else if (this.status === "解锁") {
        this.detailData.lockStatusString = '允许通行';
        // alert(this.detailData.lockStatusString)
      }
      this.statuOperation(this.detailData.lockStatusString)
    },
    // 从业人员详情
    seeDetail(id) {
      this.centerDialogVisible = true;

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

          this.getSubject(this.employeeInfor)
          
        } else {
          this.employeeData = {};
          this.employeeInfor = [];
          this.$message.error(data.msg);
        }
      });
    },
    // 获取认证图片
    getPicture(){
      this.$http({
        url: this.$http.adornUrl(`/buss/bussRegister/output-bussEpiToPicture?id=${this.electronicId}`),
        method: "get",
        responseType: 'blob'
      }).then(({ data }) => {
          const qrUrl = window.URL.createObjectURL(data)
          this.detailData.qrCode = qrUrl
          // console.log(qrUrl)
      });
    },
    // 获取题目
    getSubject(subjectData){
      subjectData.map(v => {
            if (v.topicName === "单选题" && v.answer) {
              v.epiSelectEntityList.map(item => {
                if (v.answer == item.id) {
                  v.answer = item.content;
                }
              });
            } else if (v.topicName === "混答+单选" && v.answer) {
              v.epiSelectEntityList.map(item => {
                if (v.answer.indexOf("#") === -1 && v.answer == item.id) {
                  v.answer = v.content;
                } else {
                  if (v.answer.split("##")[0] == item.id) {
                    v.answer = item.content;
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
    // 获取社区
     getTownList () {
      this.$http({
        url: this.$http.adornUrl(
          '/buss/bussRegister/getsonTownByAreaCode?code=440118'
        ),
        method: 'get',
      }).then(({ data }) => {
        // console.log('getTownList', data)

        // 说明有共享数据
        if (data.data.length > 0) {
          this.community = data.data
        }
      }).then(() => {


      })
    },
    //社区决定市场
    handleCommunity(){
      this.$forceUpdate()
      if(this.detailData.communityId != null && this.detailData.communityId != ''){

        this.$http({
          url: this.$http.adornUrl(
            '/buss/bussRegister/getPlatformIdByTown'
          ),
          method: 'get',
          params: this.$http.adornParams({
            townId: this.detailData.communityId,
          })
        }).then(({ data }) => {
          // 说明有共享数据
          if (data.data.length > 0) {
            this.market = data.data
            this.detailData.marketId = '';
            this.$forceUpdate()
          }else{
            this.detailData.marketId = '';
            this.market = [];
            this.$forceUpdate()
          }
        }).then(() => {
        })
      }else{
        this.detailData.marketId = '';
        this.market = [];
      }
    },
    // 下载复工证
    download(){
      window.location.href = `${this.baseUrl}buss/bussRegister/output-bussEpiToPicture?id=${this.electronicId}&token=${Cookies.get("token")}`;
    }
  },
  components: {
    changeStatus
  }
};
</script>

<style lang="scss" scoped>
p{
  margin: 0;
}
ul{
  list-style:none;
  padding: 0;
}
.ResumptionAddOrEdit {
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
    background:rgba(240,245,255,1);
    &::before{
      content: '';
      display: inline-block;
      width:2px;
      height:13px;
      background:rgba(63,146,254,1);
      margin: 0 10px 0 18px;
    }
  }
  .info {
    font-size: 14px;
    padding: 20px;
    background-color: white;  
    .portrait {
      width: 100%;
      height: 120px;
      border-radius: 10px;
    }
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
    color: #666;
  }
  /deep/ .el-radio__input.is-disabled + span.el-radio__label {
    color: #666;
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
    width: 100%;
    height: 200px;
  }
  /deep/ .el-button:focus,
  .el-button:hover {
    background: #fff;
    border: 1px solid #dcdfe6;
    color: #606266;
  }
  .save {
    color: white !important;
    background-color: #0091ff !important;
    border-color: #0091ff !important;
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
      box-shadow:0px 1px 4px 0px rgba(187,211,230,0.5);
      border:1px solid rgba(237,237,237,1);
      margin: 10px 0px;
      .circle{
        width:4px;
        height:4px;
        display: inline-block;
        background:rgba(189,228,255,1);
        margin-right: 8px;
        vertical-align: middle;
      }
      .statu{
        width:84px;
        height:30px;
        border-radius:10px;
        opacity:0.12;
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
    background-color: #DCDBDB;
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
    border-left: 2px solid #DCDBDB;
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
    color: #0091FF;
  }
  /deep/ .el-timeline .el-timeline-item:last-child .el-timeline-item__tail{
   display:none;
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

  /deep/ .el-dialog {
    border-radius: 5px;
    box-shadow: 0px 0px 15px 2px rgba(0,0,0,0.27);
    .el-dialog__header {
      background-color: rgba(241,244,246,1) !important;
      padding: 11px 0 11px 20px;
      border-radius: 5px 5px 0 0;
      font-size: 25px;
      .el-dialog__headerbtn {
        top: 19px;
        .el-dialog__close {
          color: #ADB6C2;
        }
      }
      span {
        color: #333;
      }
    }
    .el-dialog__body{
      padding: 20px 30px;
    }
  }
  .baseInfo{
    background:rgba(240,245,255,1);
    padding:20px;
    font-weight: bold;
  }
  .left{
    li{
      display:flex;
      border-top: 1px solid #f0f0f0;
      .one{
        width:35%;
        text-align: right;
        padding:20px 20px 20px 0;
        border-right: 1px solid #f0f0f0;
        color: #888;
      }
      .two{
        width:65%;
        padding:20px 0 20px 20px;
      }
    }
  }
}
</style>
