<!--@author：yf-->
<template>
  <div>
    <div style="display: flex;justify-content: flex-start;overflow-x: auto">
      <div v-for="(item,index) in buttonName" :key="index">
        <el-button   @click="changeButton(item)" style="margin: 0 5px" native-type="button" size="small">第{{item.number}}期</el-button>
      </div>
    </div>
    <div>
      <div v-if="vcShow" >
          <h1 class="titleStyle">{{vcTitle}}</h1>
          <div class="numberStyle">第{{vcNumber}}期</div>
          <div class="timeStyle">{{vcTime}}</div>
          <div style="padding: 0 20px" class="builclass">
            <el-input type="textarea" style="border: none"  :autosize="{ minRows:5,maxRows:7}"
                      readonly resize="none"  v-model.trim="vcContent" show-word-limit></el-input>
          </div>
        <div  class="contentStyle buildContent">
          <ul>
            <li>主送:{{lordSent}}</li>
            <li>报送:{{submissionSend}}</li>
            <li>抄送:{{copySent}}</li>
            <li>编辑:{{compile}}</li>
            <li>电话:{{phone}}</li>
            <li>签发人:{{signAndIssue}}</li>
            <li>签发单位:{{signAndArea}}</li>
          </ul>
        </div>
          <div class="rightTime">{{time}}</div>

      </div>
    </div>
    <div style="text-align: right;padding: 20px">
      <el-button type="primary" size="small" @click="sendApps">发送到APP</el-button>
      <el-button type="primary" size="small" @click="getDomToPdf" :disabled="buttonHideBuild">导出PDF</el-button>
      <el-button type="primary" size="small" @click="exportWord">生成文档</el-button>
      <el-button type="primary" size="small" v-print="'#buildHistor'" :disabled="eventStamp">打印</el-button>
    </div>
    <!-- bug7728 author:hexinting date:2020-10-22 -->
    <search-table
      ref="searchTable"
      :selectTitle="selectTitle" :selectData="selectData"
      @closeDialog="searchCloseDialog"
      @confirm="searchConfirm"
      @close="searchClose"
    ></search-table>

    <div id="buildHistor" style="position: absolute;left: 0;top: 0;z-index: -999;">
      <div style="width: 800px">
        <h1 class="titleStyle">{{sopVcTitle}}</h1>
        <div class="numberStyle">第{{sopVcNumber}}期</div>
        <div class="timeStyle">{{sopVcTime}}</div>
<!--        <div style="padding: 0 20px" class="builclass">-->
<!--          <el-input type="textarea" style="border: none" :autosize="{ minRows:5}"-->
<!--                    readonly  resize="none"  v-model.trim="sopVcContent" show-word-limit></el-input>-->
<!--        </div>-->
        <div style="padding: 0 20px;text-indent: 20px;text-align: left;word-break:break-all" class="builclass">
          {{sopVcContent}}
        </div>
        <div class="contentStyle buildContent">
          <ul>
            <li>主送:{{sopLordSent}}</li>
            <li>报送:{{sopSubmissionSend}}</li>
            <li>抄送:{{sopCopySent}}</li>
            <li>编辑:{{sopCompile}}</li>
            <li>电话:{{sopPhone}}</li>
            <li>签发人:{{sopSignAndIssue}}</li>
            <li>签发单位:{{sopSignAndArea}}</li>
          </ul>
        </div>
        <div class="rightTime">{{sopTime}}</div>

      </div>
    </div>
  </div>
</template>

<script>
    import {Url} from '@/assets/js/common'
    import searchTable from '../searchTable'
    const downLoadFile = require('@/utils/downloadFile.js').default;

    export default {
        name: "expressTheDetails",
        components:{
          searchTable
        },
        data(){
          return{
            historicalData:'',//存储快报历史
            buttonName:[],
            vcTitle:'',//标题
            vcNumber:'',//第几期
            vcTime:'',//时间
            vcContent:'',//内容
            vcShow:false,//判断有不有快报
            buildID:'',//快报ID


            lordSent:'',//主送
            submissionSend:'',//报送
            copySent:'',//抄送
            compile:'',//编辑
            phone:'',//电话
            signAndIssue:'',//签发
            signAndArea:'',//签发单位
            time:'',
            eventStamp:true,

            sopVcTitle:'',//必须用input接收数据，不然格式会乱，后天返回了一些数据
            sopVcNumber:'',
            sopVcTime:'',
            sopVcContent:'',
            sopLordSent:'',
            sopSubmissionSend:'',
            sopCopySent:'',
            sopCompile:'',
            sopPhone:'',
            sopSignAndIssue:'',
            sopSignAndArea:'',
            sopTime:'',
            buttonHideBuild:false,

            selectTitle:'',//选择发送APP弹窗标题
            selectData:false,//选择发送APP弹窗
          }
        },
        watch:{
          vcTitle:{
            handler(newV){
              this.sopVcTitle=newV
            },
            deep:true
          },
          vcNumber:{
            handler(newV){
              this.sopVcNumber=newV
            },
            deep:true
          },
          vcTime:{
            handler(newV){
              this.sopVcTime=newV
            },
            deep:true
          },
          vcContent:{
            handler(newV){
              this.sopVcContent=newV
            },
            deep:true
          },
          lordSent:{
            handler(newV){
              this.sopLordSent=newV
            },
            deep:true
          },
          submissionSend:{
            handler(newV){
              this.sopSubmissionSend=newV
            },
            deep:true
          },
          copySent:{
            handler(newV){
              this.sopCopySent=newV
            },
            deep:true
          },
          compile:{
            handler(newV){
              this.sopCompile=newV
            },
            deep:true
          },
          phone:{
            handler(newV){
              this.sopPhone=newV
            },
            deep:true
          },
          signAndIssue:{
            handler(newV){
              this.sopSignAndIssue=newV
            },
            deep:true
          },
          signAndArea:{
            handler(newV){
              this.sopSignAndArea=newV
            },
            deep:true
          },
          time:{
            handler(newV){
              this.sopTime=newV
            },
            deep:true
          },
        },
        methods:{
          getDomToPdf(){//导出pdf
            console.log(this.vcNumber);
            if(this.vcNumber==null||this.vcNumber==''){
              this.$message({
                message: '无快报历史不能导出',
                type: 'warning'
              })
              return
            }
            this.buttonHideBuild=true;
            setTimeout(() => {
              this.buttonHideBuild=false;
            },3000);
            this.getPdf('#buildHistor',`突发事件快报${this.vcTime}`) // 修复禅道 7135 author：hexinting date:2020-9-28
            // this.getPdf('#buildHistor',`快报历史${this.vcNumber}`)
          },
          /**
           * @lastEditor 2020-11-9
           * @lastDate 2020-11-9
           * @description 导出word
           */
          exportWord(){//导出word
            if(this.buildID==''||this.buildID==null){
              this.$message({
                message: '无快报历史不能导出',
                type: 'warning'
              });
              return
            }
            console.log(this.buildID);
            // 下载文件
            const request = {
              method: 'post',
              url: '/eos/event/bullitin/exportEventDayWord',
              baseURL: window.g.ApiUrl,
              headers: {
                'Content-Type': 'application/json; charset=utf-8',
                token: this.$cookie.get('token'),
              },
              responseType: 'arraybuffer',
              data: {
                id: this.buildID,
              },
            };
            downLoadFile(request);
            // this.$api.verification().then(() => {
            //   // 只有登录没失效的才会导出word bug7722 author hexinting date 2020-11-9
            //   window.location.href= Url + `/eos/event/bullitin/exportEventDayWord?id=${this.buildID}`
            // })
            // .catch(err => {
            //   // 网络请求错误 或者 登录失效的信息都在这捕获
            //   console.log(err)
            // })
          },
          readingData(rowData,requestData){//表格数据;接口返回数据;
            if(requestData==[]||requestData==null){
              this.buildID=''
            }
            this.buttonName=requestData;

          },
          changeButton(item){//赋值每一期数据
            console.log(item.number);
            this.buildID=item.id;//快报ID
            this.vcShow=true;
            this.vcTitle=JSON.parse(item.json).vc_big_title;
            this.vcNumber=item.number;
            this.vcTime=JSON.parse(item.json).vc_title;
            this.vcContent=JSON.parse(item.json).vc_detail;
            this.time=JSON.parse(item.json).vc_sign_time;

            this.lordSent=JSON.parse(item.json).vc_send//主送
            this. submissionSend=JSON.parse(item.json).vc_report//报送
            this.copySent=JSON.parse(item.json).vc_copy//抄送
            this.compile=JSON.parse(item.json).vc_edi_man//编辑
            this.phone=JSON.parse(item.json).vc_edi_phone//电话
            this.signAndIssue=JSON.parse(item.json).vc_sign_man//签发
            this.signAndArea=JSON.parse(item.json).vc_sign_unit//签发

          },
          show(){//判断是否显示
            return this.vcShow=false;
          },
          bulletinEnd(){//默认设置最后一个
            this.buildID=''
            this.eventStamp=true
            if(this.buttonName.length!==0){
              this.eventStamp=false
              let last;
              if (this.buttonName.length>0){
                last = this.buttonName.length-1;
              }
              this.vcShow=true;
              console.log(this.buttonName[last]);
              this.buildID=this.buttonName[last].id
              this.vcTitle=JSON.parse(this.buttonName[last].json).vc_big_title;
              this.vcNumber=this.buttonName[last].number;
              this.vcTime=JSON.parse(this.buttonName[last].json).vc_title;
              this.vcContent=JSON.parse(this.buttonName[last].json).vc_detail;
              this.time=JSON.parse(this.buttonName[last].json).vc_sign_time

              this.lordSent=JSON.parse(this.buttonName[last].json).vc_send//主送
              this. submissionSend=JSON.parse(this.buttonName[last].json).vc_report//报送
              this.copySent=JSON.parse(this.buttonName[last].json).vc_copy//抄送
              this.compile=JSON.parse(this.buttonName[last].json).vc_edi_man//编辑
              this.phone=JSON.parse(this.buttonName[last].json).vc_edi_phone//电话
              this.signAndIssue=JSON.parse(this.buttonName[last].json).vc_sign_man//签发
              this.signAndArea=JSON.parse(this.buttonName[last].json).vc_sign_unit//签发单位

            }else {
              this.vcNumber=null
            }
          },
           /**
           * @lastEditor hexinting
           * @laseDate 2020-10-22
           * @description 发送APP
           */
          sendApps() {//发送APP
            if(this.buildID == '' || this.buildID == null){
              this.$message({
                message: '无快报历史不能导出',
                type: 'warning'
              });
              return
            }
            this.selectTitle = '选择联系人';
            this.selectData = true;
            this.$refs.searchTable.info();
          },
          /**
           * @author hexinting
           * @date 2020-10-22
           * @lastEditor hexinting
           * @laseDate 2020-10-22
           * @description 关闭弹窗
           */
          searchCloseDialog() {
            this.selectData = false;
          },
          /**
           * @author hexinting
           * @date 2020-10-22
           * @lastEditor hexinting
           * @laseDate 2020-10-22
           * @description 确认选中联系人
           */
          searchConfirm(multipleSelection) {//确认
            if(multipleSelection == '' || multipleSelection == null || multipleSelection == undefined){
              this.$message({
                message: '选项不能为空!',
                type: 'warning'
              });
              return
            }

            let data = {
              id: this.buildID, // 快报历史
              contacters: multipleSelection
            };
            this.$api.sendApp(data).then((res) => {
              if(res.errorcode == 0){
                this.$message({
                  message: '发送成功!',
                  type: 'success'
                });
                this.selectData = false;
              }else {
                //this.$message.error(res.msg)
              }
            })
          },
          /**
           * @author hexinting
           * @date 2020-10-22
           * @lastEditor hexinting
           * @laseDate 2020-10-22
           * @description 关闭弹窗
           */
          searchClose() {
            this.selectData = false;
          }
        }
    }
</script>

<style scoped>
  @page {
    size: a4;
    margin: 0cm 1cm 0cm 1cm
  }

  @media print {
    header {
      display: none;
    }
    footer {
      display: none;
    }

    .titleStyle{
      padding:10px 0;
      color: red;
      text-align: center;
      font-family: '华文宋体';
      font-size: 40px;
    }
    .numberStyle{
      text-align: center;
      font-size: 24px;
      font-weight: bold;
    }
    .timeStyle{
      text-align: center;
      padding: 20px 0;
      font-size: 18px;
    }
    .rightTime{
      text-align: right;
      padding-top: 30px;
      padding-right: 20px;
      font-size: 16px;
    }
    .buildContent{
      text-align: left;
      margin-top: 20px;
      padding: 0;

    }
    .buildContent ul {
      margin: 0;
      padding: 0;
    }
    .buildContent ul li{
      list-style: none;
      padding: 5px 0;
    }
    .builclass >>> .el-textarea__inner {
      border: none !important;
      color: black !important;
    }
  }

  .titleStyle{
    padding:10px 0;
    color: red;
    font-family: '华文宋体';
    font-size: 40px;
  }
  .numberStyle{
    font-size: 24px;
    font-weight: bold;
  }
  .timeStyle{
    padding: 20px 0;
    font-size: 18px;
  }
  .contentStyle{
    padding: 0 20px;
    max-height: 450px;
    overflow: auto;
    letter-spacing: 1px;
    text-align: left;
    text-indent: 30px;
  }
  .rightTime{
    text-align: right;
    padding-top: 30px;
    padding-right: 20px;
    font-size: 16px;

  }

  .buildContent{
    text-align: left;
    margin-top: 20px;
    padding: 0;
  }
  .buildContent ul {
    margin: 0;
    padding: 0;
  }

  .buildContent ul li{
    list-style: none;
    padding: 5px 0;
  }
  .builclass >>> .el-textarea__inner {
    border: none !important;
    color: black !important;
  }
</style>
