<!--@author：llp-->
<template>
  <div>
    <div class="box-card">
      <!-- <el-tabs type="card">
        <el-tab-pane label="信息详情" style="margin:0"> -->
      <div>
        <el-row>
          <el-col :offset="2" :span="22" class="name">
            {{contactorDetails.name}}
          </el-col>
        </el-row>
      </div>
      <div class="introduction">
        <el-row style="margin-top: 10px">
          <el-col :offset="2" :span="22">
            <i class="icon-zhiwu" style="vertical-align:text-top"></i>
            <span>{{contactorDetails.position}}</span>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :offset="2" :span="24">
            <i class="icon-danwei" style="vertical-align:text-top"></i>
            <span>{{contactorDetails.workUnit}}</span>
          </el-col>
        </el-row>
      </div>
      <div class="details">
        <p @click="changeCallNumber(contactorDetails.mobile)">
          <el-link :underline="false">常用手机:{{contactorDetails.mobile}}</el-link>
        </p>
        <p @click="changeCallNumber(contactorDetails.temobile)">
          <el-link :underline="false">手持终端:{{contactorDetails.temobile}}</el-link>
        </p>
        <p @click="changeCallNumber(contactorDetails.otherTel)">
          <el-link :underline="false"> 备用手机:{{contactorDetails.otherTel}}</el-link>
        </p>
        <p @click="changeCallNumber(contactorDetails.officeTel)">
          <el-link :underline="false">办公电话:{{contactorDetails.officeTel}}</el-link>
        </p>
        <p @click="changeCallNumber(contactorDetails.homeTel)">
          <el-link :underline="false">应急电话:{{contactorDetails.homeTel}}</el-link>
        </p>
        <p @click="changeCallNumber(contactorDetails.otherTel2)">
          <el-link :underline="false">其他电话:{{contactorDetails.otherTel2}}</el-link>
        </p>
      </div>

      <el-row>
        <el-button style="margin-left: 10px" v-if="callClass=='callon'" type="primary" @click="TransferCall">转接
        </el-button>
        <el-button style="margin-left: 10px" v-if="callClass=='callon'" type="primary" @click="ThreeWayConf">三方通话
        </el-button>
        <el-button style="margin-left: 10px" v-if="callClass=='callon'" type="primary" @click="maintain">保持</el-button>
        <el-button style="margin-left: 10px" v-if="callClass=='callheld'" type="primary" @click="AlternateCall">恢复
        </el-button>
        <el-button style="margin-left: 10px" v-if="callClass=='callon'||callClass=='callheld'" type="danger"
                   @click="hangup">挂断
        </el-button>
      </el-row>
    </div>

    <div class="dialpad">
      <el-row class="phoneNumberInput">
        <el-col :span="16">
          <el-input v-model="phoneNumber" :disabled="isDisable"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" style="width: 100px" @click="dial">呼叫</el-button>
        </el-col>
      </el-row>
      <div class="peopleList">
        <el-scrollbar style="height: 100%">
          <template v-for="(items, index) in callQueue">
            <div class="showPhone" @click='clickPhone(items,index)'
                 @dblclick="openCallWindow(items)"
                 :class="{blue: changeColor === items.mobile}" :key='index'>
              <div class="showPhoneLeft">
                <div>{{items.mobile}}</div>
                <div style="text-align: center"></div>
              </div>
              <div class="showPhoneRight">
                <div @click='release(items,index)'><i class="el-icon-phone-outline"></i></div>
              </div>
            </div>
          </template>
        </el-scrollbar>
      </div>
    </div>

    <!--来电弹窗-->
    <call-window ref="CallWindow"></call-window>

  </div>
</template>

<script>
  import CallWindow from "@/components/CallWindow";

  export default {
    name: "detailsAndDialing",
    components: {CallWindow},
    data() {
      return {
        seatNumber: "",//座席号
        agent_id: "",//坐席ID
        conn: "",//通道编号
        HWICP_Version: window.g.HWICP_Version,//icp版本
        isDisable: false,//是否禁用输入框
        contactorDetails: [
          {
            name: '',//联系人名称
            position: '',//联系人职位
            temobile:'',//手持终端
            workUnit: '',//联系人工作单位
            mobile: '',//常用电话
            officeTel: '',//办公电话
            homeTel: '',//应急电话
            otherTel: '',//备用手机
            otherTel2: '',//其它电话
          }
        ],//联系人详细信息
        phoneNumber: "",
        clickPhoneData: [],//通话队列中选中的数据
        changeColor: '',
        callClass: '',//当callStatus=true时，呼出【callout】,呼入【callin】,通话中【callon】,保持中【callheld】
      }
    },
    computed: {
      //通话队列
      callQueue() {
        return this.$store.getters.getCallQueue;
      },
      connChange() {
        return this.$store.getters.getCallConn;
      },
      callClassChange() {
        return this.$store.getters.getCallClass;
      },
      callee() {
        return this.$store.getters.getCallee;
      },
    },
    mounted() {
      this.phoneNumber = sessionStorage.getItem("phoneCall");
      this.seatNumber = sessionStorage.getItem("seat");
      this.agent_id = sessionStorage.getItem("agent_id");
      if (this.HWICP_Version == 'HWICP-19.0') {
        this.$refs.CallWindow.callIsVisible = this.$store.getters.getCallStatus;
        if (this.$refs.CallWindow.callIsVisible == true) {
          // this.callQueue=this.$store.getters.getCallQueue;
          this.callClass=this.$store.getters.getCallClass;
          this.conn=this.$store.getters.getCallConn;
          this.callee=this.$store.getters.getCallee;
          this.$refs.CallWindow.callClass = this.$store.getters.getCallClass;
          this.$refs.CallWindow.conn = this.$store.getters.getCallConn;
          this.$refs.CallWindow.findContactorByMobile();
        }
      }
    },
    watch: {
      releaseIsDisabled(newVal) {
        this.$refs.CallWindow.callIsVisible = newVal
      },
      connChange(newVal) {
        this.conn = newVal
      },
      callClassChange(newVal) {
        this.callClass = newVal
      }
    },
    methods: {
      getRowData(id) {
        let data = {
          id: id
        };
        this.$api.findContactorById(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.contactorDetails = res.data;
          this.phoneNumber = this.contactorDetails.mobile;
        })
      },
      showRowData(row) {
        let name = row.contactor;
        this.contactorDetails = row;
        this.contactorDetails.name = name;
        this.contactorDetails.mobile = row.call;
        this.phoneNumber = row.mobile;
      },
      showEmergencyAddressBookData(row) {
        this.contactorDetails = row;
        this.phoneNumber = row.mobile;
      },
      //icp呼叫电话
      dial() {
        if (this.phoneNumber == '' || this.phoneNumber == null) {
          this.$message({
              message: "电话号码不能为空",
              type: "warning"
            }
          );
          return;
        }
        this.$confirm('确认呼叫当前号码?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let self = this;
          let data = {number: self.phoneNumber};
          // this.$icp.dial(self.phoneNumber);
          this.$api.validateNumber(data).then(res => {
            if (self.HWICP_Version == 'HWICP-19.0') {
              this.$store.commit("setCallee", self.phoneNumber);
              this.$refs.CallWindow.findContactorByMobile();
              this.$icp19.MakeCall(Number(self.agent_id), self.phoneNumber, self.seatNumber.toString());
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消呼叫'
          });
        });
      },
      //语音挂断
      release(items,key) {
        this.$confirm('是否结束当前通话?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          let self = this;
          if (self.HWICP_Version == 'HWICP-19.0') {
            this.$icp19.DropCall(Number(self.agent_id), Number(items.conn), key);
          }
        })
      },

      //转接
      TransferCall() {
        if (this.phoneNumber == '' || this.phoneNumber == null) {
          this.$message({
              message: "电话号码不能为空",
              type: "warning"
            }
          );
          return;
        }
        if (this.phoneNumber == this.callee) {
          this.$message({
              message: "不能选择当前通话用户进行转接",
              type: "warning"
            }
          );
          return;
        }
        this.$confirm('是否转接当前通话?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          let self = this;
          if (self.HWICP_Version == 'HWICP-19.0') {
            this.$icp19.TransferCallOneKey(Number(self.agent_id), self.phoneNumber.toString());
            this.$store.commit("setCallStatus", false);
          }
        });
      },
      //三方通话
      ThreeWayConf() {
        if (this.phoneNumber == '' || this.phoneNumber == null) {
          this.$message({
              message: "电话号码不能为空",
              type: "warning"
            }
          );
          return;
        }
        if (this.phoneNumber == this.callee) {
          this.$message({
              message: "不能选择当前通话用户进行三方通话",
              type: "warning"
            }
          );
          return;
        }
        this.$confirm('是否进行三方通话?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          let self = this;
          if (self.HWICP_Version == 'HWICP-19.0') {
            this.$icp19.ThreeWayConf(Number(self.agent_id), Number(self.conn), self.phoneNumber.toString(), 1);
          }
        });
      },
      //保持方法
      maintain() {
        this.$confirm('是否保持当前通话?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          let self = this;
          if (self.HWICP_Version == 'HWICP-19.0') {
            this.$icp19.HeldCall(Number(self.agent_id), Number(self.conn));
          }
        });
      },
      //恢复通话
      AlternateCall() {
        this.$confirm('是否恢复当前通话?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          let self = this;
          if (self.HWICP_Version == 'HWICP-19.0') {
            this.$icp19.AlternateCall(Number(self.agent_id), Number(self.agent_id), Number(self.conn));
            this.$refs.CallWindow.callIsVisible = true
          }
        });
      },
      //挂断方法
      hangup() {
        this.$confirm('是否结束当前通话?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          let self = this;
          if (self.HWICP_Version == 'HWICP-19.0') {
            for (let i = 0; i < self.callQueue.length; i++) {
              if (self.callee == self.callQueue[i].mobile) {
                this.$icp19.DropCall(Number(self.agent_id), Number(self.conn), i);
              }
            }
            this.$store.commit("setCallStatus", false);
          }
        });
      },
      //选中的电话号码信息
      clickPhone(data, index) {
        this.clickPhoneData = data;
        this.changeColor = data.mobile;
        this.$store.commit("setCallee", data.mobile);
        this.$store.commit("setCallClass", data.callClass);
        this.$store.commit("setCallConn", data.conn);
      },
      //重新打开callwindows方法
      openCallWindow(items) {
        this.$refs.CallWindow.callIsVisible = true;
        this.$refs.CallWindow.cid = items.cid;
        this.$store.commit("setCallee", items.mobile);
        this.$store.commit("setCallClass", items.callClass);
        this.$store.commit("setCallConn", items.conn);
      },
      changeCallNumber(mobile) {
        this.phoneNumber = mobile;
      },
    }
  }
</script>

<style scoped>
  @import '../../../assets/css/icon.css';

  .box-card {
    float: left;
    min-width: 392px;
    height: 460px;
    margin-top: 16px;
    margin-left: 8px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
  }

  .name {
    margin-top: 10px;
    color: #606266;
    text-align: left;
    font-size: 24px;
    font-family: MicrosoftYaHei-Bold, sans-serif;
    font-weight: bold;
  }

  .introduction {
    text-align: left;
    font-size: 14px;
    font-family: MicrosoftYaHei, sans-serif;
    color: rgba(162, 162, 162, 1);
  }

  .details {
    width: 328px;
    height: 256px;
    border: 1px solid rgba(230, 230, 230, 1);
    margin: 20px 32px 20px 32px;
  }

  .details p {
    margin-left: 15px;
    margin-top: 16px;
    text-align: left;
    font-family: MicrosoftYaHei, sans-serif;
    font-weight: 400;
  }

  .dialpad {
    float: left;
    margin-top: 16px;
    margin-left: 8px;
    width: 395px;
    height: 310px;
    background-color: white;
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
  }

  /*>>> .el-input.is-disabled .el-input__inner {*/
  /*color: #76D672;*/
  /*font-size: 24px;*/
  /*font-weight: bold;*/
  /*text-align: center;*/
  /*}*/


  >>> .el-input__inner {
    color: #76D672;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }

  .phoneNumberInput {
    margin-top: 12px;
    padding-left: 16px;
    padding-right: 16px;
  }

  .peopleList {
    margin: 20px 32px;
    height: 200px;
    border: 1px solid rgba(162, 162, 162, 1);
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

  .showPhone {
    font-size: 0px;
    color: #fff;
    height: 30px;
  }

  .showPhoneLeft {
    width: 80%;
    height: 30px;
    float: left;
    background: rgb(69, 69, 69);
  }

  .showPhoneRight {
    width: 20%;
    height: 30px;
    float: left;
    background: rgb(37, 37, 37);
  }

  .showPhoneLeft div {
    font-size: 14px;
    line-height: 30px;
    width: 45%;
    padding-left: 5%;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;

  }

  .showPhoneRight i {
    font-size: 20px;
    cursor: pointer;
  }

  .showPhoneRight div {
    font-size: 20px;
    padding: 0 10px;
    display: inline-block;
  }

  .blue {
    /* box-sizing:border-box;  */
    border: 2px solid #338FCC;
  }

</style>
