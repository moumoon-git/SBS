<template>
  <div class="ElectronicPassAddOrEdit">
    <el-row :gutter="20">
          <div style="display:flex;justify-content:center;background-color: white;padding: 6px 0 10px;">
            <img style="width:27;height:21.41px;margin:8px 12px 0 0;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAWCAYAAAAxSueLAAABt0lEQVRIS8WWMU9TURTH///zGmgkLhoJfATCZEKaGLSvgwuJgQU2dgZiowMDn8DBQVpgcGTHwRgXExKwwAAYHQwfgAWMiTERCsa+8zfPpOY10L6k+ugdzz33/s7vnDtcFpc1SeklgCFkt05EzjGs+rGT07XH3MmK9WBZ4yatxzBtlY1ZgZr3xpwew2YUhCEKbCBoZ+uEn+Wx/2GOv4ovNGLE7ZZc4XTzKT8lY1eahSu6B9duWlspTpwTu3noG3C5MAdHa2UedmxjaUn3ZaqlwRz+qFbOvS1V9dAVDbaaBafvn+ANQP1XWFpRPYRVXPzJ4WYF3ocCqddpFYuctQtseB5TFG4l82WoWx2vQDSacfXrmGHFZeBYMxgJo6TW0mCQ5gX7TNM7AP0tMMEJThtw9FcCOrgEizfdMWiAtQNGBgXAl3hfjpsRMNCSa7jIAd+TMW8HS7XqIqH3sLgtHmiRwo0uBP4cEVG3iM9o+NFxZgLuOLRK/gNMqBs4T+Br6gPp1qjTueufWbHiUQAWsrBJ3hlBeyxWtQ34R0p7WQHFWMbusrSqoajhC5bhH8SBkyBnzzP/DiS79Rs8xgUahfhE1QAAAABJRU5ErkJggg==" alt="">
            <span class="thetitle">{{title}}通行证</span>
          </div>
          <div v-if="electronicId" style="padding: 6px 10px 30px;box-shadow:0px 3px 10px 2px rgba(54,121,225,0.09);background:rgba(255,255,255,1);">
            <div style="display:flex;justify-content:space-between;">
              <div style="width: 20%" class="hide">审核状态：<span :style="{color:detailData.lockStatusString==='已审核'?'#0BD295':(detailData.lockStatusString==='待审核'?'#F2B626':'#F85B47')}">{{detailData.lockStatusString}}</span></div>
              <div style="width: 25%" class="hide">登记时间：{{detailData.gmtCreate}}</div>
              <div style="width: 25%" class="hide">审核时间：{{detailData.lockTime?detailData.lockTime:'-'}}</div>
            </div>
            <div style="width: 100%;">审核备注：{{detailData.lockReason?detailData.lockReason:'-'}}</div>
          </div>
          <p class="title hide">基本信息</p>
          <div class="info" style="display:flex;justify-content:space-between;">
            <div>
              <el-col :span="electronicId?6:6">
                <img id="image" v-if="electronicId && detailData.imgUrl" :src="detailData.imgUrl.indexOf('http') === -1?baseUrl+detailData.imgUrl:detailData.imgUrl" class="portrait" />
                <img id="image" v-if="electronicId && !detailData.imgUrl" :src="detailData.sex=='1'?malePicture:femalePicture" class="portrait" />
                <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :list-type="!electronicId?'picture-card':''"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :http-request="upqiniu"
                >
                  <template v-if="!electronicId">
                    <img v-if="detailData.imgUrl" :src="detailData.imgUrl" class="avatar" />
                    <template v-else>
                      <i class="iconfont icon-xiangji" style="fontSize:35px;margin:25px 0 20px;"></i>
                      <span style="color:#999999">上传照片</span>
                    </template>
                  </template>
                  <template v-else>
                    <el-button style="padding: 10px;margin-top: 10px;margin-left:5%">更换图片</el-button>
                  </template>
                </el-upload>
              </el-col>
              <el-col :span="18">
                <el-form ref="form" :model="detailData" :rules="rules" label-width="120px">
                  <!-- <el-form-item label="所属企业">
                    {{detailData.platformNameString?detailData.platformNameString:'无'}}
                  </el-form-item> -->
                  <el-form-item label="姓名" prop="imName">
                    <el-input v-model="detailData.imName"></el-input>
                  </el-form-item>
                  <el-form-item label="性别" prop="sex">
                    <el-select
                      v-model="detailData.sex"
                      placeholder="请选择性别"
                      style="width:100%"
                    >
                      <el-option label="男" value="1"></el-option>
                      <el-option label="女" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="detailData.phone"></el-input>
                  </el-form-item>
                  <el-form-item label="身份证号码" prop="credentialsNum">
                    <el-input v-model="detailData.credentialsNum"></el-input>
                  </el-form-item>
                </el-form>
              </el-col>
            </div>
            <div v-if="electronicId" style="width:200px;text-align:center;">
              <img
                v-if="detailData.qrCode"
                :src="detailData.qrCode.indexOf('http') === -1?baseUrl+detailData.qrCode:detailData.qrCode"
                class="code"
                id="code"
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
          <div class="info">
            <p class="title">登记信息</p>
            <template>
              <div v-for="(item,index) in registeinfor" :key="item.id" style="padding:0 20px;margin-bottom: 20px;">
                <p style="margin:5px;font-weight:bold;color:#333;"><span v-if="item.isAnswer=='1'" style="color:red;margin-right:5px;">*</span>{{item.title}}</p>
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
                          v-if="v.ifInput==='1' && item.answer==v.id"
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
                          v-if="v.ifInput==='1' && item.answer==v.id"
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
                          v-if="v.ifInput==='1' && item.answer==v.id"
                          v-model="item.remark"
                          type="text"
                          class="content"
                        />
                      </el-radio>
                    </span>
                  </el-radio-group>
                </template>
                <template v-if="item.topicName==='简答-输入'">
                  <input type="text" class="content" v-model="item.answer" />
                </template>
                <template v-if="item.topicName==='简答-文本'">
                  <el-input
                    type="textarea"
                    style="width:450px"
                    resize="none"
                    v-model="item.answer"
                  ></el-input>
                </template>
                <template v-if="item.topicName==='图片'">
                    <el-upload
                      action="https://jsonplaceholder.typicode.com/posts/"
                      list-type="picture-card"
                      :on-remove="function(res){return handleRemove(res,index)}"
                      :before-upload="beforeUpload"
                      :http-request="function(file){return beforeAvatarUpload(file,index)}"
                      :file-list="item.answer"
                      limit="2"
                      :on-exceed='overFile'
                      multiple
                      >
                      <i class="el-icon-plus" style="line-height:5"></i>
                    </el-upload>
                </template>
              </div>
            </template>
            <div>
            </div>
          </div>
        </el-row>
          <el-row :gutter="20">
            <div style="display:flex;justify-content:center;backgroundColor:white;">
              <el-button @click="cancel">取消</el-button>
              <el-button class="save" @click="preserve">保存</el-button>
            </div>
    </el-row>
  

    <!-- 核验、锁定、解锁 -->
    <change-status ref="changeStatusView" @getStatu="getStatu"></change-status>
  </div>
</template>

<script>
import changeStatus from "./changeStatus";
import Viewer from "viewerjs";
export default {
  name: "ElectronicPass-AddOrEdit",
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
        sex: '',
        phone: "",
        credentialsNum: "",
        park: "", //园区
        platformNameString: "", //企业
        imgUrl: "",
        imgName: "",
        qrCode: "",
        lockStatusString: "",
        tikuId: "", //题库Id
      },
      electronicId: "",
      checkCode: "",
      trafficRecord: [],
      baseUrl: window.SITE_CONFIG["cloudUrl"],

      itemBank: {}, //存储题目数据
      status: "",//当前状态

      rules:{
        imName:[
          {
            required: true,
            pattern: /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/,
            trigger: "blur",
            message: '您输入的姓名有误'
           }
        ],
        sex:[
          {
            required: true,
            trigger: "blur",
            message: '请您选择性别'
           }
        ],
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
      title: "", //复工类型
      imgQuality: 0.5, //压缩图片的质量

      pictureList: [],//题库图片列表      
      malePicture: require('../../../../assets/img/ElectronicPass/maleHead.png'),//默认男头像
      femalePicture: require('../../../../assets/img/ElectronicPass/femaleHead.png'),//默认女头像
      page: '',//当前列表页数
    };
  },
  created() {
    // 修改
      this.electronicId = this.$route.query.electronicId;
      if (this.electronicId) {
        this.getDetailData();
        this.getPicture()
        // 新增
      } else {
        this.getSubjectData();
        this.detailData = []
      }
      this.title = this.$route.query.title;
      this.page = this.$route.query.page;
      this.checkCode = this.$route.query.checkCode;
  },
  //   // 修改
  //   alert(this.$route.query.electronicId)

  //     if (this.$route.query.electronicId) {
  //       this.getDetailData();
        
  //       // 新增
  //     } else {
  //       this.getSubjectData();
  //       this.detailData = []
  //     }
  //     this.electronicId = this.$route.query.electronicId;
  //     this.checkCode = this.$route.query.checkCode;
  // },
  mounted(){
   
  },
   beforeRouteLeave(to, from, next) {
    // console.log(from.name);
    if (to.name != "ElectronicPass" && this.title=='编辑') {
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
      // 预览二维码
      setTimeout(()=>{
        const ViewerCode = document.querySelectorAll("#code");
        for(let i=0;i<ViewerCode.length;i++){
            if(typeof ViewerCode[i]==='object'){
              // console.log("ViewerDom[i]",ViewerDom[i])
              const viewer = new Viewer(ViewerCode[i], {
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
            }else if (
              v.topicName === "图片"
            ) {
              v.answer = [];
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
        url: this.$http.adornUrl("/pass/passRegister/getOneAndLink"),
        method: "get",
        params: this.$http.adornParams({
          id: this.electronicId
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.detailData = data.data;
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
            }else if (
              v.topicName === "图片"
            ) {
              if (v.answer) {
                v.answer = JSON.parse(v.answer).map(v=>{
                  return {name:v.name, url:v.oldPath,oldPath:v.oldPath,path:v.path}
                })
              }else{
                v.answer = []
              }
            }
          });
          this.trafficRecord = data.data.passRegisterHistoryList;

          this.initImageTools()

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
     // 获取认证图片
    getPicture(){
      this.$http({
        url: this.$http.adornUrl(`/pass/passRegister/output-passEpiEmployeeToPicture?id=${this.electronicId}`),
        method: "get",
        responseType: 'blob'
      }).then(({ data }) => {
          const qrUrl = window.URL.createObjectURL(data)
          this.detailData.qrCode = qrUrl
          // console.log(qrUrl)
      });
    },
    dataURItoBlob(dataURI, type) {
  var binary = atob(dataURI.split(',')[1]);
  var array = [];
  for(var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], {type: type});
},

beforeUpload(param) {
  //对图片进行压缩
  const imgSize = param.size / 1024 / 1024
  if(imgSize > 1) {
    const _this = this
    return new Promise(resolve => {
      const reader = new FileReader()
      const image = new Image()
      image.onload = (imageEvent) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const width = image.width * _this.imgQuality
        const height = image.height * _this.imgQuality
        canvas.width = width;
        canvas.height = height;
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(param.type);
        const blobData = _this.dataURItoBlob(dataUrl, param.type);
        resolve(blobData)
      }
      reader.onload = (e => { image.src = e.target.result; });
      reader.readAsDataURL(param);
    })
  }
},
    
    //图片上传之前
    upqiniu(param) { 
      // console.log(param.file.size)
      let file = param.file
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
            this.$forceUpdate()
            console.log('this.detailData.imgUrl: ', this.detailData.imgUrl);
            
            this.detailData.imgName = data.data.name;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {});
    },
    // 删除上传题库图片
    handleRemove(file, idx) {
      this.registeinfor[idx].answer.map((v,index)=>{
        if(v.name == file.name){
          this.registeinfor[idx].answer.splice(index,1)
          }
      })
    },
    // 上传题库图片
    beforeAvatarUpload(param,idx){
       let file = param.file
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
          
             this.registeinfor[idx].answer.push({name:data.data.name, url:this.baseUrl+urlStr, path: urlStr, oldPath:this.baseUrl+urlStr})
            //  this.registeinfor[idx].answer = this.registeinfor[idx].epiSelectEntityList
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {});
    },
    // 保存
    preserve() {
      let sure = true
      console.log(this.registeinfor)
      for(let i in this.registeinfor) {
        let v = this.registeinfor[i]
        if(v.answer.length === 0 && v.isAnswer == '1') {
          this.$message.warning(`请选择${v.title}`)
          sure = false
          return 
        }
      }
      if(sure) {
        this.$refs["form"].validate(valid => {
                if (valid) {
                  // 去除修改时图片展示多余的参数
                  this.registeinfor.map(v => {
                    if(v.topicName=='图片' && v.answer){
                      v.answer.map(v=>{
                        if(v.url) {
                          this.$delete(v,'url')
                          this.$delete(v,'uuid')
                          this.$delete(v,'uid')
                          this.$delete(v,'status')
                        }
                        console.log('url: ', v);
                      })
                    }
                  })
                // 保存修改
                this.$http({
                  url: this.$http.adornUrl(`/pass/passRegister/${this.electronicId?'update':'save'}`),
                  method: "post",
                  data: {
                    imName: this.detailData.imName,
                    id: this.electronicId||undefined,
                    areaName: this.detailData.park + this.detailData.enterprise,
                    phone: this.detailData.phone,
                    credentialsNum: this.detailData.credentialsNum,
                    imgUrl: this.detailData.imgUrl,
                    imgName: this.detailData.imgName,
                    sex: this.detailData.sex,
                    tikuId: this.detailData.tikuId,
                    passAnswerEntityList: this.registeinfor.map(v => {
                      return {
                        questionId: v.id,
                        answer:v.answer?(typeof(v.answer) == 'string'?v.answer+(v.remark?'##'+v.remark:''):(typeof(v.answer) == 'object'&&v.topicName!='图片'?v.answer.toString():JSON.stringify(v.answer))):""
                      };
                    })
                  }
                }).then(({ data }) => {
                  console.log("/upload/platformImages", data);
                  if (data && data.code == 0) {
                    if (data.infor) {
                      if (data.infor.code != 0) {
                        this.$message.warning(data.infor.msg);
                      }else{
                        this.$message({
                          type: "success",
                          message: "保存成功",
                          duration: 1500,
                          onClose: () => {
                            this.$router.push({
                              path: "/Linkage/ElectronicPass/ElectronicPass"
                            });
                          }
                        });
                      }
                    }else{
                      this.$message({
                        type: "success",
                        message: "保存成功",
                        duration: 1500,
                        onClose: () => {
                          this.$router.push({
                            path: "/Linkage/ElectronicPass/ElectronicPass"
                          });
                        }
                      });
                    }
                  } else {
                    this.$message.error(data.msg);
                  }
                });
              }
            });
      }
    },
    // 取消
    cancel(){
      this.$router.push({
        path: "/Linkage/ElectronicPass/ElectronicPass",
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
    // 下载通行证
    download(){
      window.location.href = `${this.baseUrl}pass/passRegister/output-passEpiEmployeeToPicture?id=${this.electronicId}&token=${Cookies.get("token")}`;
    },
    overFile(){
      this.$message.warning('上传图片最多不超过两个')
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
.ElectronicPassAddOrEdit {
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
      width: 120px;
      height: 200px;
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
    // width:113px;
    height: 100%;
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
      box-shadow:0px 1px 4px 0px rgba(187,211,230,0.5);
      border:1px solid rgba(237,237,237,1);
      margin: 10px 0px 10px 20px;
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

  /deep/ .el-upload--picture-card{
    width:146px;
    height:146px;
  }
}
</style>
