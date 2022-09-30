<!--处置弹窗--短信及传真共用-->
<template>
  <div>
    <el-dialog  top="20px" width="1400px"  :title="manageTitle" :visible.sync="manageDialog"
               :before-close="manageCloseDialog" :close-on-click-modal="false"
               append-to-body lock-scroll left
    >
        <el-row>
        <el-col :span="12">
          <el-scrollbar style="height: 100%">
              <div style="width: 100%;height:770px">
                <el-card class="box-card cardCalss" shadow="hover" >
                  <div v-if="disposalType=='短信'">
                    <div class="details">
                      <div>
                          <span >
                            <el-link :underline="false">姓名:{{sms.name}}</el-link>
                          </span>
                          <span >
                            <el-link :underline="false"> 职务:{{sms.duty}}</el-link>
                          </span>
                      </div>

                      <div>
                          <span>
                            <el-link :underline="false"> 单位:{{sms.unit}}</el-link>
                          </span>
                          <span >
                            <el-link :underline="false">发送时间:{{sms.sendTime}}</el-link>
                          </span>
                      </div>

                      <div>
<!--                          <span>-->
<!--                             <el-link :underline="false">内容:{{sms.content}}</el-link>-->
<!--                          </span>-->
                          <span>
                             <el-link :underline="false">电话:{{sms.phone}}</el-link>
                          </span>
                      </div>

                    </div>

                    <div class="reamkCalss">内容:</div>
                    <div>
                      <el-input
                        :maxlength=10000
                        clearable
                        type="textarea"
                        :rows="2"
                        v-model="itemClickDialogRemark"
                        :autosize="{ minRows:24, maxRows:24}"
                        resize="none"
                        show-word-limit
                      >
                      </el-input>
                    </div>
                  </div>
                  <div v-if="disposalType=='传真'">
                    <el-tabs type="border-card" style="height: 716px">
                      <el-tab-pane label="原件预览">
                        <div style="width: 100%;height: 647px;">
                          <iframe :src="fpxPreviewPath" 
                          id="fpxIframe" 
                          width="100%" 
                          height="100%" 
                          v-if="fpxPreviewPath!=''"
                          frameborder="no" 
                          border="0" 
                          marginwidth="0" 
                          marginheight="0" 
                          scrolling="no" 
                          allowtransparency="yes"
                          ></iframe>
                          <div v-if="fpxPreviewPath==''" style="
                      width: 100%;height: 100%;
                      background: url('/static/img/faxBack.png') center no-repeat;
                      background-size: 220px;">
                          </div>
                        </div>
                      </el-tab-pane>
                      <el-tab-pane label="文本预览">
                        <div style="height: 630px;border: 1px solid #ddd">
                          <el-scrollbar style="height: 100%;margin: 10px;text-align: left;">
                            <div style="text-indent: 20px;font-size: 14px" v-if="textShow!=''">{{textShow}}</div>
                            <div style="
                      width: 100%;height:250px;
                      background: url('/static/img/txtNull.png') center no-repeat;
                      background-size: 100px;" v-if="textShow==''"></div>
                          </el-scrollbar>
                        </div>
                      </el-tab-pane>
                    </el-tabs>
                  </div>
                  <div v-if="disposalType=='电话'">
                    <div>
<!--                      <audioCompName :audioList = 'audioList'></audioCompName>-->
                      <audio-plan ref="audioPlan"
                                  @sendPhoneText="sendPhoneText"
                                  v-if="testAudio==true"  :audioId="audioId" :audioUrlData="audioUrlData"></audio-plan>
                      <div v-if="testAudio==false" style="border: 1px solid #ddd;
                      width: 100%;height: 250px;
                      background: url('/static/img/phoneNull.png') center no-repeat;
                      background-size: 130px;">

                      </div>
                    </div>
                    <div class="details">
                      <div>
                          <span >
                            <el-link :underline="false">姓名:{{sms.name}}</el-link>
                          </span>
                        <span >
                            <el-link :underline="false"> 职务:{{sms.duty}}</el-link>
                          </span>
                      </div>

                      <div>
                          <span>
                            <el-link :underline="false"> 单位:{{sms.unit}}</el-link>
                          </span>
                        <span >
                            <el-link :underline="false">发送时间:{{sms.sendTime}}</el-link>
                          </span>
                      </div>

                      <div>
                        <!--                          <span>-->
                        <!--                             <el-link :underline="false">内容:{{sms.content}}</el-link>-->
                        <!--                          </span>-->
                        <span>
                             <el-link :underline="false">电话:{{sms.phone}}</el-link>
                          </span>
                      </div>

                    </div>
                    <div class="reamkCalss">内容:</div>
                    <div>
                      <el-input
                        :maxlength=10000
                        clearable
                        type="textarea"
                        :rows="2"
                        v-model="itemClickDialogRemark"
                        :autosize="{ minRows:12, maxRows:12}"
                        resize="none"
                        show-word-limit

                      >
                      </el-input>
                    </div>
                  </div>
                </el-card>
              </div>
          </el-scrollbar>
        </el-col>

        <el-col :span="12">
          <el-card class="box-card cardCalss" shadow="hover" >
            <el-tabs v-model="activeRightName" type="card" @tab-click="handleClickRight">
              <el-tab-pane label="传真" name="传真">
                <new-fax-model ref="newFaxModel"></new-fax-model>
              </el-tab-pane>
              <el-tab-pane label="电话" name="电话">
                <new-phone-model ref="newPhoneModel"></new-phone-model>
              </el-tab-pane>
              <el-tab-pane label="短信" name="短信">
                <new-sms-model ref="newSmsModel"></new-sms-model>
              </el-tab-pane>
            </el-tabs>

          </el-card>
        </el-col>

      </el-row>

    </el-dialog>
  </div>
</template>

<script>
    import newFaxModel from '@/view/yz_eventManagement/eventRegistration/newModel/newFaxModel'
    import newSmsModel from '@/view/yz_eventManagement/eventRegistration/newModel/newSmsModel'
    import newPhoneModel from '@/view/yz_eventManagement/eventRegistration/newModel/newPhoneModel'
    import audioCompName from '@/view/yz_eventManagement/eventRegistration/newModel/audio'
    import audioPlan from '@/view/yz_eventManagement/informationDisposal/audioPlan'
    export default {
        name: "manageDialog",
        components:{
          newFaxModel,newSmsModel,newPhoneModel,audioCompName,audioPlan
        },
        props:['manageTitle','manageDialog','itemData','disposalType'],
        data(){
          return{
            msgTableWith:'通讯录',//tabs默认打开
            itemClickDialogRemark:'',//弹窗短信内容
            sms:{   //left短信内容显示
              name:'',
              duty:'',
              unit:'',
              sendTime:'',
              content:'',
              phone:'',
            },

            phone:{//right 电话内容显示
              name:'',
              position:'',
              workUnit:'',
              phone:'',
              work:'',
              standbyApplication:'',
              rest:'',
              emergency:'',
              terminal:''
            },
            activeRightName:this.disposalType,//右边tabs选项
            fpxPreviewPath:'',//传真预览

            audioList:{
              //音频组件地址,只能传递一个,如果需要传递多个,可以自己修改源码  换成数组或者json
              url:'',
              //这个音频文件的长度,因为一般都是异步获取到音频地址才能初始化audio的,所以这个参数父传递给子合适点
              totalTime:'',
            },
            audioUrlData:'',
            audioId:'',
            testAudio:false,//
            textShow:'',//语音转文字

          }
        },
        created(){
          console.log(this.itemData);
        },
        mounted(){
          this.sms.name=this.itemData.contact
          this.sms.duty=this.itemData.position
          this.sms.unit=this.itemData.workUnit
          this.sms.sendTime=this.itemData.time
          this.sms.phone=this.itemData.mobile
          this.itemClickDialogRemark=this.itemData.remark
          let faxData,phoneData
          switch (this.disposalType) {
            case '传真':
               faxData = {
                faxId: this.itemData.id
              }
              this.$szApi.previewFax(faxData).then((res) => {
                if (res.errorcode == 0) {
                  console.log(res.data);
                  console.log(window.g.ApiUrl + res.data);
                  this.fpxPreviewPath=window.g.ApiUrl + '/fax/'+res.data
                  this.imgToText(this.itemData.id)
                } else {
                  // //this.$message.error(res.msg)
                }
              });
              break;
            case '电话':
               phoneData = {
                phoneId: this.itemData.id
              }
              this.$szApi.phoneGetUrl(phoneData).then((res) => {
                if (res.errorcode == 0) {
                  // this.audioList.url=window.g.ApiUrl + '/'+res.data.url
                  // this.audioList.totalTime=res.data.second
                    this.testAudio=false
                    if(res.data.url){
                        this.$nextTick(()=>{
                            this.testAudio=true
                            this.audioId=this.itemData.id
                            this.audioUrlData=window.g.ApiUrl+'/rec/'+res.data.url
                        })
                    }
                } else {
                    this.testAudio=false
                  //this.$message.error(res.msg)
                }
              });
              break;
            case '短信':
              break;
            default:
              break;
          }

        },
        methods:{
          sendPhoneText(val){
              this.phoneText=val
          },
          imgToText(id){
              //获取pdf转文字 文本预览
              let data={
                  id
              }
              this.$api.imgToText(data).then((res) => {
                  console.log(res)
                  if (res.errorcode == 0) {
                      this.textShow = res.data;
                  }else {
                      //this.$message.error(res.msg)
                  }
              })
          },
          manageCloseDialog(){
            this.$emit('manageCloseDialog')
          },
          handleClickRight(tab){//右边Tabs
            console.log(tab.label);
            switch (tab.label) {
              case '传真':
                break;
              case '电话':
                break;
              case '短信':
                break;
              default:
                break;
            }
          },



        }
    }
</script>

<style scoped>
  >>>.el-dialog__header{
    background-color: cornflowerblue;
  }
  >>>.el-dialog__title{
    color: white !important;
  }
  >>>.el-dialog__headerbtn .el-dialog__close{
    color: white !important;
  }
  >>>.el-dialog--center .el-dialog__body{
    padding: 5px 0 0 0 ;
  }
  .details{
    border: 1px solid #ddd;
  }
  .details div{
    display: flex;
    align-items: center;
  }
  .details span{
    flex: 1;
    display: inline-block;
    padding:20px 10px;
  }
  .name{
    font-weight: bold;
    font-size: 25px;
  }
  .introduction {
    text-align: left;
    text-indent: 20px;
    font-size: 14px;
    font-family: MicrosoftYaHei, sans-serif;
    padding: 5px 0;
  }
</style>
