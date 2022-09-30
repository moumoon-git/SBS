<!--@author：llp-->
<template>
  <div>
    <div class="box-card">
      <el-row>
        <el-col class="selectedPeople">
          注：已选择{{peopleList.length}}人
        </el-col>
      </el-row>
      <el-row>
        <div class="peopleList">
          <el-scrollbar style="height: 100%">
            <el-row v-for="(item,key) in peopleList" :key="key" style="margin-top:10px">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                <el-col :span="10" style="text-align: left;overflow-x: hidden;">{{key+1}}.{{item.name}}</el-col>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="item.mobile.toString()" placement="top">
                <el-col :span="10" style="text-align: left">{{item.mobile}}</el-col>
              </el-tooltip>
              <el-col v-if="item.mobile!==''|| item.mobile!==null" :span="2" style="text-align: right">
                <el-button icon="el-icon-close" class="shrink-button" @click="removeContact(key)"></el-button>
              </el-col>
            </el-row>
          </el-scrollbar>
        </div>
      </el-row>
      <el-row>
        <el-col :offset="4" :span="8">
          <el-button type="primary" @click="addPhones">添加号码</el-button>
        </el-col>
        <el-col :offset="1" :span="4">
          <el-button type="primary" @click="removeAllContact">清除</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="sendMsg">
      <!--发送短信面板-->
      <el-form ref="form" v-show="isShow" v-model="msgForm" label-width="80px" @submit.native.prevent
               label-position="right">
        <div v-show="isShow">
          <el-row :gutter="gutter" style="margin: 10px 32px">
            <el-form-item label="事件:" style="margin:0 32px">
              <el-select ref="eventSelect" clearable v-model="msgForm.caseId" placeholder="请选择">
                <el-option v-for="item in eventOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row :gutter="gutter" style="margin: 0 32px 12px;height: 200px">
            <el-input v-model="msgForm.msgContent" v-if="!Stylemsg" type="textarea" placeholder="请输入短信内容" resize="none"
                      show-word-limit
                      maxlength="500" :autosize="{minRows: 8,maxRows:8}"></el-input>
            <div id="text" v-if="Stylemsg" v-html="msgForm.msgContent">
              {{msgForm.msgContent}}
            </div>
          </el-row>
        </div>
      </el-form>
      <!-- **********腾讯云********* -->
      <!--            <el-form ref="form" v-show="isShow" v-model="msgForm" label-width="80px" @submit.native.prevent-->
      <!--        label-position="right">-->
      <!--        <div v-show="isShow">-->
      <!--          <el-row :gutter="gutter" style="margin: 10px 32px">-->
      <!--            <el-form-item label="事件:" style="margin:0 32px">-->
      <!--              <el-select clearable v-model="msgForm.caseId" placeholder="请选择">-->
      <!--                <el-option v-for="item in eventOptions" :key="item.value" :label="item.label" :value="item.value">-->
      <!--                </el-option>-->
      <!--              </el-select>-->
      <!--            </el-form-item>-->
      <!--          </el-row>-->
      <!--          <el-row :gutter="gutter" style="margin: 5px 32px 12px;height: 200px">-->
      <!--              <div class="text" v-html="msgForm.msgContent">-->
      <!--                {{msgForm.msgContent}}-->
      <!--              </div>-->
      <!--          </el-row>-->
      <!--        </div>-->
      <!--      </el-form>-->
      <!--更多面板-->
      <el-form v-show="!isShow" v-model="msgForm" label-width="60px" @submit.native.prevent label-position="right">
        <el-row :gutter="gutter" style="margin:0 16px">
          <el-form-item label="短信类型:">
            <el-col :span="24">
              <el-radio-group ref="msgTypeRadio" v-model="msgForm.msgTypeId" v-for="(item,key) in msgType" :key="key">
                <el-radio :label="item.id" style="margin-right: 10px">{{item.name}}</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>
        </el-row>
        <!-- bug12442 短信签名隐藏 -->
        <!-- <el-row :gutter="gutter" style="margin:0 16px">
          <el-form-item label="短信签名:">
            <el-col :span="12">
              <el-select clearable filterable @blur="selectBlur" v-model="msgForm.signature" placeholder="请选择">
                <el-option v-for="item in signatureOptions" :key="item.value" :label="item.value" :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="small" @click="addSmsSignature">保存</el-button>
            </el-col>
            <el-col :offset="2" :span="4">
              <el-button type="primary" size="small" @click="removerSmsSignature">删除</el-button>
            </el-col>
          </el-form-item>
        </el-row> -->
        <el-row :gutter="gutter" style="margin:0 16px">
          <el-form-item label="定时短信:">
            <el-col :span="2">
              <el-checkbox v-model="isTimingSMS " :border="false" @change="changeisTimingSMS"></el-checkbox>
            </el-col>
            <el-col :span="16">
              <el-date-picker v-model="msgForm.timedSMS" type="datetime" format="yyyy-MM-dd HH:mm:ss"
                              :picker-options="pickerOptionsStart" :disabled="!isTimingSMS" value-format="timestamp"
                              placeholder="选择日期时间">
              </el-date-picker>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row :gutter="gutter" style="margin:0 16px">
          <el-form-item label="催报短信:">
            <el-row :gutter="gutter" style="margin: 0">
              <el-col :span="2" style="padding:0 0">
                <el-checkbox v-model="isUrgeSMS" :border="false" @change="changeisUrgeSMS"></el-checkbox>
              </el-col>
              <el-col :span="3" style="padding:0 0">次数:</el-col>
              <el-col :span="16" style="padding:0 0">
                <el-input-number v-model="msgForm.times" :disabled="!isUrgeSMS" :min="1" :max="99999"></el-input-number>
                <!--<el-select v-model="msgForm.times">-->
                <!--<el-option-->
                <!--v-for="item in timesOptions"-->
                <!--:key="item.value"-->
                <!--:label="item.label"-->
                <!--:value="item.value">-->
                <!--</el-option>-->
                <!--</el-select>-->
              </el-col>
            </el-row>
            <el-row :gutter="gutter" style="margin-top: 10px">
              <el-col :offset="1" :span="3" style="padding:0 0">间隔:</el-col>
              <el-col :span="16" style="padding:0 0">
                <el-select v-model="msgForm.interval" :disabled="!isUrgeSMS">
                  <el-option v-for="item in intervalOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
        </el-row>
      </el-form>
      <el-row :gutter="gutter">
        <el-col :span="8">
          <el-button icon="el-icon-document-copy" @click="showTemplate">模板</el-button>
        </el-col>
        <el-col :span="8">
          <el-button icon="el-icon-chat-dot-round" @click="showMore">更多</el-button>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="sendMsg">发送</el-button>
        </el-col>
      </el-row>
    </div>
    <msg-template ref="MsgTemplate" @selectTemplate="selectTemplate"></msg-template>

    <!--添加号码对话框-->
    <el-dialog title="添加号码" :visible.sync="isAddPhonesShow" width="30%" :close-on-click-modal="false">
      <el-input type="textarea" resize="none" :autosize="{minRows:4,maxRows:4}" v-model="phonesText"
                placeholder="请输入手机号码，多个号码使用“，”隔开"></el-input>
      <el-button @click="isAddPhonesShow = false">取 消</el-button>
      <el-button type="primary" @click="submitPhones">确 定</el-button>
    </el-dialog>

  </div>
</template>

<script>
  import MsgTemplate from "@/view/integratedCommunication/icpSms/informationTransmission/msgTemplate";

  export default {
    name: "sendMsgPanel",
    components: {
      MsgTemplate
    },
    data() {
      return {
        formInline: {
          user: '',
          region: ''
        },
        gutter: 20,
        isShow: true, //是否发送短信面板
        peopleList: [], //选择发送短信的人员列表;
        eventOptions: [], //事件选择框属性
        msgForm: {
          caseId: '', //事件
          msgContent: '', //短信内容
          msgTypeId: '', //短信类型Id
          signature: '', //短信签名
          timedSMS: Number(new Date()), //定时短信
          times: '', //发送次数
          interval: '', //间隔
        }, //表单变量
        pickerOptionsStart: {
          disabledDate(time) {
            return time.getTime() < new Date(new Date().toLocaleDateString()).getTime();
          }
        },
        msgType: {
          id: '',
          name: ''
        }, //短信类型
        signatureOptions: [], //短信签名选择框
        timesOptions: [], //次数选择框
        intervalOptions: [{
          label: '1分钟',
          value: 1
        }, {
          label: '3分钟',
          value: 3
        }, {
          label: '5分钟',
          value: 5
        }, {
          label: '10分钟',
          value: 10
        }, {
          label: '15分钟',
          value: 15
        }], //间隔选择框
        isTimingSMS: false, //是否为定时短信
        isUrgeSMS: false, //是否为催报短信
        isAddPhonesShow: false, //是否显示添加手机号码模板
        phonesText: '', //
        msgId: '', //短信id
        reEdit: false, //是否重新编辑
        Stylemsg: window.g.Stylemsg,
        contentid: '',//主键id
        signatureId: ''//短信签名id
      }
    },
    mounted() {
      let name = sessionStorage.getItem('name');
      let mobile = sessionStorage.getItem('mobile');
      let remark = sessionStorage.getItem('remark');
      let historyContactor = sessionStorage.getItem('historyContactor', this.contactorId);
      if (name != '' && name != null && mobile != '' && mobile != null) {
        this.peopleList = [{
          contactorId: historyContactor,
          name: name,
          mobile: mobile
        }];
        sessionStorage.removeItem('name');
        sessionStorage.removeItem('mobile');
        sessionStorage.removeItem('historyContactor');
        // this.msgForm.msgContent=remark.replace(/××/, "<input type='text'></input>")
      } else if (remark != '' && remark != null) {
        this.msgForm.msgContent = remark;
        sessionStorage.removeItem('remark');
        // this.msgForm.msgContent=remark.replace(/××/, "<input type='text'></input>")
      }
      this.getEventOptions();
      this.getSmsType();
      this.getFindSmsSign();
    },
    methods: {
      //获取短信签名
      getFindSmsSign() {
        let data;
        this.$api.findSmsSign(data).then(res => {
          if (res.errorcode != 0) {
            this.$message.error(res.msg);
            return
          }
          this.signatureOptions = res.data;
        })
      },
      //获取短信类型
      getSmsType() {
        let data;
        this.$api.smsType(data).then(res => {
          if (res.errorcode != 0) {
            this.$message.error(res.msg);
            return
          }
          this.msgType = res.data;
          this.msgForm.msgTypeId = res.data[0].id;
        })
      },
      //显示选中数据
      showData(data) {
        this.peopleList.push({
          name: data.name,
          mobile: data.mobile,
          contactorId: data.id
        });
        this.removerSamePhone();
      },
      //号码去重
      removerSamePhone() {
        for (let i = 0; i < this.peopleList.length; i++) {
          for (let j = i + 1; j < this.peopleList.length; j++) {
            if (this.peopleList[i].mobile == this.peopleList[j].mobile) {
              this.peopleList.splice(j, 1);
              j--;
            }
          }
        }
        this.peopleList = Array.from(new Set(this.peopleList));
      },
      //移除需发送短信的人员列表
      removeContact(key) {
        this.peopleList.splice(key, 1);
      },
      //移除所有需发送短信的人员列表
      removeAllContact() {
        this.peopleList = [];
      },
      //显示更多
      showMore() {
        if (this.isShow) {
          return this.isShow = false;
        } else {
          return this.isShow = true;
        }
      },
      showTemplate() {
        this.$refs.MsgTemplate.isDialogVisible = true;
      },
      //选择模板方法
      selectTemplate(text, id) {
        if (id != '') {
          this.contentid = id
        }

        if (this.Stylemsg) {
          this.msgForm.msgContent = text.replace(/\{(.+?)\}/g, "<input type='text' class='input'></input>")
        } else {
          this.msgForm.msgContent = text;
        }
        this.$refs.MsgTemplate.isDialogVisible = false;
      },
      //获取未办结事件
      getEventOptions() {
        let data;
        this.$api.allEventlist(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          for (let i = 0; i < res.data.length; i++) {
            this.eventOptions.push({
              value: res.data[i].id,
              label: res.data[i].title
            })
          }
        })
      },
      addPhones() {
        this.isAddPhonesShow = true;
      },
      submitPhones() {
        let phone = this.phonesText.split(/[,，]/);
        //相同号码去重
        let phoneArry = [...new Set(phone)];

        for (let i = 0; i < phoneArry.length; i++) {
          this.checkPhone(phoneArry[i])
        }
      },
      checkPhone(phoneNumber) {
        if (!(/^1[3456789]\d{9}$/.test(phoneNumber))) {
          setTimeout(() => {
            this.$message.error("手机号码格式错误:" + phoneNumber);
          }, 500);
          return false;
        } else {
          let data = {
            phoneNum: Number(phoneNumber)
          };
          this.$api.findContactorByMobile(data).then(res => {
            if (res.errorcode != 0) {
              this.$message.error(res.msg);
              return;
            }
            if (res.data.name) {
              this.peopleList.push({
                contactorId: res.data.id,
                name: res.data.name,
                mobile: Number(phoneNumber)
              });
            } else {
              this.peopleList.push({
                mobile: Number(phoneNumber)
              });
            }
            this.removerSamePhone();
          });
          this.isAddPhonesShow = false;
        }
      },
      sendMsg() {
        if (this.msgForm.msgContent == '' || this.msgForm.msgContent == null) {
          this.$message.warning("短信内容不能为空!");
          return;
        }
        if (this.peopleList.length == 0) {
          this.$message.warning("请添加收信人!");
          return;
        } else {
          this.$confirm('确认发送短信?', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (!this.isUrgeSMS) {
              this.addSmsQueue(); //不是催报短信发送方法
            } else {
              this.addPromptSmsQueue();
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消发送'
            });
          });
        }
      },
      addSmsQueue() {
        let phones = [];
        let contactorIds = [];
        for (let i = 0; i < this.peopleList.length; i++) {
          phones.push(Number(this.peopleList[i].mobile));
          contactorIds.push(this.peopleList[i].contactorId)
        }
        let phoneArry = [...new Set(phones)];
        let msgcontent;
        let caseId;

        if (this.msgForm.caseId == '') {
          caseId = 0;
        } else {
          caseId = this.msgForm.caseId;
        }
        if (this.msgForm.signature == '' || this.msgForm.signature == null || this.msgForm.signature == undefined) {
          msgcontent = this.msgForm.msgContent
        } else {
          msgcontent = this.msgForm.msgContent + '【' + this.msgForm.signature + '】';
        }

        let json;
        if (this.Stylemsg) {
          //腾讯云
          //     let input=document.getElementsByClassName('input')
          //     let msgs=[];
          //     for(let i=0;i<input.length;i++){
          //         msgs.push(input[i].value)
          //     }
          // //相同号码去重
          // if (this.reEdit) {
          //   json = {
          //     templateParams:msgs,
          //     smsTamplateId:this.contentid,
          //     id: this.msgId,
          //     reEdit: this.reEdit,
          //     smstypeId: this.msgForm.msgTypeId,
          //     caseId: caseId,
          //     content: msgcontent,
          //     phoneNum: phoneArry.toString(),
          //     contactorIds: contactorIds.join(",")
          //   };
          // } else {
          //   json = {
          //       templateParams:msgs,
          //       smsTamplateId:this.contentid,
          //     smstypeId: this.msgForm.msgTypeId,
          //     caseId: caseId,
          //     content: msgcontent,
          //     phoneNum: phoneArry.toString(),
          //     contactorIds: contactorIds.join(",")
          //   };
          // }
          //
          // if (this.isTimingSMS) {
          //   json['sendTime'] = this.msgForm.timedSMS;
          // }
        }
///////////////////////////////////////////////////////////
        else {
          //相同号码去重
          if (this.reEdit) {
            json = {
              id: this.msgId,
              reEdit: this.reEdit,
              smstypeId: this.msgForm.msgTypeId,
              caseId: caseId,
              content: msgcontent,
              phoneNum: phoneArry.toString(),
              contactorIds: contactorIds.join(",")
            };
          } else {
            json = {
              smstypeId: this.msgForm.msgTypeId,
              caseId: caseId,
              content: msgcontent,
              phoneNum: phoneArry.toString(),
              contactorIds: contactorIds.join(",")
            };
          }

          if (this.isTimingSMS) {
            json['sendTime'] = this.msgForm.timedSMS;
          }
        }
        let data = {
          data: JSON.stringify(json)
        };
        this.$api.addSmsQueue(data).then((res) => {
          if (res.errorcode == '0') {
            this.$message({
              message: '短信下发成功!',
              type: 'success'
            });
            this.reEdit = false;
            return;
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      addPromptSmsQueue() {
        let phones = [];
        let contactorIds = [];
        for (let i = 0; i < this.peopleList.length; i++) {
          phones.push(Number(this.peopleList[i].mobile));
          contactorIds.push(this.peopleList[i].contactorId)
        }
        let phoneArry = [...new Set(phones)];
        let msgcontent;

        if (this.msgForm.caseId == '') {
          this.msgForm.caseId = 0;
        }
        if (this.msgForm.signature == '' || this.msgForm.signature == null || this.msgForm.signature == undefined) {
          msgcontent = this.msgForm.msgContent
        } else {
          msgcontent = this.msgForm.msgContent + '【' + this.msgForm.signature + '】';
        }

        //相同号码去重
        let json = {
          smstypeId: this.msgForm.msgTypeId,
          caseId: this.msgForm.caseId,
          content: msgcontent,
          phoneNum: phoneArry.toString(),
          interval: this.msgForm.interval,
          count: this.msgForm.times,
          contactorIds: contactorIds.join(",")
        };

        if (this.isTimingSMS) {
          json['sendTime'] = this.msgForm.timedSMS;
        }
        //腾讯云
        if (this.Stylemsg) {
          // let input=document.getElementsByClassName('input')
          // let msgs=[];
          // for(let i=0;i<input.length;i++){
          //     msgs.push(input[i].value)
          // }
          // console.log(msgs);
          // let data = {
          //     data: JSON.stringify(json)
          // };
          //
          // this.$api.addPromptSmsQueue(data).then((res) => {
          //     if (res.errorcode == '0') {
          //         this.$message({
          //             message: '短信下发成功!',
          //             type: 'success'
          //         });
          //         this.reEdit = false;
          //         return;
          //     } else {
          //         this.$message.error(res.msg);
          //     }
          // })
        }
        /////////////////////////////////////////////
        else {
          let data = {
            data: JSON.stringify(json)
          };

          this.$api.addPromptSmsQueue(data).then((res) => {
            if (res.errorcode == '0') {
              this.$message({
                message: '短信下发成功!',
                type: 'success'
              });
              this.reEdit = false;
              return;
            } else {
              this.$message.error(res.msg);
            }
          })
        }
      },
      showMsgContent(data) {
        this.msgForm.msgTypeId = data.smstypeId;
        this.msgForm.msgContent = data.content;
        this.msgId = data.id;
        this.validateEvent(data.caseId);
        if (data.isUrgeSMS == 'true') {
          this.isUrgeSMS = true;
          this.msgForm.times = data.count;
          this.msgForm.interval = data.interval;
        } else {
          this.isUrgeSMS = false;
        }
        this.reEdit = true;
      },
      changeisUrgeSMS() {
        if (this.isTimingSMS) {
          this.isTimingSMS = false;
        }
      },
      changeisTimingSMS() {
        if (this.isUrgeSMS) {
          this.isUrgeSMS = false;
        }
      },
      //改变短信签名
      selectBlur(e) {
        this.msgForm.signature = e.target.value
      },
      //添加短信签名
      addSmsSignature() {
        if (this.msgForm.signature == '' || this.msgForm.signature == null) {
          this.$message.error("短信签名不能为空!");
          return;
        }
        ;
        let data = {
          data: {
            value: this.msgForm.signature
          }
        };
        this.$api.addSmsSign(data).then(res => {
          if (res.errorcod != 0) {
            this.$message.success("保存成功!");
            this.getFindSmsSign();
          } else {
            this.$message.error(res.msg);
          }
        });
      },
      //删除短信签名
      removerSmsSignature() {
        if (this.msgForm.signature == '' || this.msgForm.signature == null) {
          this.$message.error("请选择需要删除的签名!");
          return false;
        }
        this.validateSmsSignature(this.msgForm.signature);
        let data = {
          id: this.signatureId
        };
        this.$api.deleteSmsSign(data).then(res => {
          if (res.errorcode != 0) {
            this.$message.error(res.msg);
            return;
          }
          this.$message.success("删除成功!");
          this.signatureId = null;
          this.getFindSmsSign();
        });
      },
      //根据短信签名校验id
      validateSmsSignature(name) {
        for (let key in this.signatureOptions) {
          if (this.signatureOptions[key].value == name)
            this.signatureId = this.signatureOptions[key].id;
        }
      },
      //根据事件id查询相关事件
      validateEvent(id) {
        for (let key in this.eventOptions) {
          if (this.eventOptions[key].value == id)
            this.$refs.eventSelect.selectedLabel = this.eventOptions[key].label;
          this.msgForm.caseId = id;
        }
      },
    },
  }

</script>

<style scoped>
  .box-card {
    height: 450px;
    margin-top: 16px;
    margin-left: 8px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
  }

  .selectedPeople {
    margin-top: 24px;
  }

  .peopleList {
    margin: 20px 32px;
    height: 315px;
    border: 1px solid rgba(162, 162, 162, 1);
  }

  .sendMsg {
    margin-top: 16px;
    margin-left: 8px;
    height: 320px;
    background-color: white;
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
  }

  .shrink-button {
    border: none;
    color: #9DA4B3;
    padding: 0;
  }

  .shrink-button:hover {
    color: #656565;
    background-color: white;
  }

  .shrink-button:focus {
    color: #656565;
    background-color: white;
  }

  >>> .el-form-item {
    margin-bottom: 10px;
  }

  >>> .el-form-item__label {
    padding: 0;
  }

  >>> .el-form-item__content {
    line-height: 30px;
  }

  .transition-box {
    margin-bottom: 10px;
    width: 200px;
    height: 100px;
    border-radius: 4px;
    background-color: #409EFF;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
    margin-right: 20px;
  }

  #text {
    width: 100%;
    height: 200px;
    overflow-x: hidden;
    overflow-y: scroll;
    border: 1px solid #ccc
  }

  >>> .input {
    width: 50px;
  }
</style>
