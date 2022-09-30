<template>
  <div>
    <el-row style="margin-top:25px">
      <el-col :span="18">
        <div>
          <el-row>
            <el-col :offset="1" :span="23" class="name">
              {{contactorDetails.name}}
            </el-col>
          </el-row>
        </div>
        <div class="introduction">
          <el-row style="margin-top: 10px">
            <el-col :span="24">
              <i class="icon-zhiwu" style="vertical-align:text-top"></i>
              <span>{{contactorDetails.position}}</span>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-col :span="24">
              <i class="icon-danwei" style="vertical-align:text-top"></i>
              <span>{{contactorDetails.workUnit}}</span>
            </el-col>
          </el-row>
        </div>
        <div class="details">
          <div>
            <span @click="changeCallNumber(contactorDetails.mobile)">
              <el-link :underline="false">常用手机:{{contactorDetails.mobile}}</el-link>
            </span>
            <span @click="changeCallNumber(contactorDetails.temobile)">
              <el-link :underline="false"> 手持终端:{{contactorDetails.temobile}}</el-link>
            </span>
          </div>

          <div>
            <span @click="changeCallNumber(contactorDetails.otherTel)">
              <el-link :underline="false"> 备用手机:{{contactorDetails.otherTel}}</el-link>
            </span>
            <span @click="changeCallNumber(contactorDetails.officeTel)">
            <el-link :underline="false">办公电话:{{contactorDetails.officeTel}}</el-link>
          </span>
          </div>

          <div>
            <span @click="changeCallNumber(contactorDetails.homeTel)">
             <el-link :underline="false">应急电话:{{contactorDetails.homeTel}}</el-link>
            </span>
            <span @click="changeCallNumber(contactorDetails.otherTel2)">
              <el-link :underline="false">其他电话:{{contactorDetails.otherTel2}}</el-link>
            </span>
          </div>

        </div>
      </el-col>
      <el-col :span="6">
        <div>
          <div class="telBox">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" @submit.native.prevent>
              <el-form-item prop="tel">
                <el-input v-model="ruleForm.tel" placeholder="请输入要拨打的号码" :validate-event="false"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="numList">
            <el-tag
              :key="item.id"
              v-for="item in ['1','2','3','4','5','6','7','8','9','*','0','#']"
              @click="addnum(item)"
              :disable-transitions="false"
              class="numTag"
            >
              {{item}}
            </el-tag>
          </div>
          <div class="bottomRow">
            <div class="numTag" style="background:#fff;"></div>
            <el-tag
              @click="handleDial"
              :disable-transitions="false"
              class="dialTag"
            >
              <span class="el-icon-phone"></span>
            </el-tag>
            <el-tag
              @click="handleDeleteNum"
              :disable-transitions="false"
              class="numTag"
              style="background:#fff;"
              @mousedown.native="handleMouseDown"
              @mouseup.native="handleMouseUp"
            >
              <span class="iconfont icondelete" style="font-size: 40px;"></span>
            </el-tag>
          </div>
        </div>
      </el-col>
    </el-row>

     <!--来电弹窗-->
    <call-window ref="CallWindow"></call-window>
  </div>
</template>

<script>
  import CallWindow from "@/components/CallWindow";
  export default {
    name: "phoneModel",
    components: {CallWindow},
    data() {
      return {
        contactorDetails:
          {
            name: '杨飞',//联系人名称
            position: '前端',//联系人职位
            workUnit: '欣纬',//联系人工作单位
            temobile: '13787614826',//手持终端
            mobile: '17373221483',//常用电话
            officeTel: '17373221483',//办公电话
            homeTel: '17373221483',//应急电话
            otherTel: '17373221483',//备用手机
            otherTel2: '18374626737',//其它电话
          }
        ,//联系人详细信息
        ruleForm: {
          tel: ''
        },
        rules: {},
        seatNumber:'',//坐席号,
        agent_id:"",
        conn:'',
        HWICP_Version: window.g.HWICP_Version,//icp版本
      }
    },
    mounted(){
      this.seatNumber = sessionStorage.getItem("seat");
      this.agent_id = sessionStorage.getItem("agent_id");

      this.$refs.CallWindow.callIsVisible = this.$store.getters.getCallStatus;
      if (this.$store.getters.getCallStatus == true) {
          this.$refs.CallWindow.callClass = this.$store.getters.getCallClass;
          this.$refs.CallWindow.conn = this.$store.getters.getCallConn;
          this.$refs.CallWindow.findContactorByMobile();
      }
    },
    methods: {
      changeCallNumber(mobile) {
        this.ruleForm.tel = mobile;
      },
      addnum(num) {
        if (this.ruleForm.tel.length <= 20) {
          this.ruleForm.tel += num
        }
      },
      handleDeleteNum() {
        if (this.ruleForm.tel.length !== 0) {
          this.ruleForm.tel = this.ruleForm.tel.substr(0, this.ruleForm.tel.length - 1)
        }
      },
      handleDial() {//拨号操作
        let self = this;
        console.log(self.ruleForm.tel);
        let data = {number: self.ruleForm.tel,agentId:sessionStorage.getItem("agent_id")||''};
        // this.$icp.dial(self.phoneNumber);
        this.$api.validateNumber(data).then(res => {
          if (self.HWICP_Version == 'HWICP-19.0') {
            this.$store.commit("setCallee", self.ruleForm.tel);
            this.$refs.CallWindow.findContactorByMobile();
            this.$store.commit("setIsJumpToIcpPhone", false);
            this.$icp19.MakeCall(Number(self.agent_id), self.ruleForm.tel.toString(), self.seatNumber.toString());
          }
        });
      },
      handleMouseDown() {
        this.timeId = setTimeout(() => {
          this.intervalId = setInterval(() => {
            this.ruleForm.tel = this.ruleForm.tel.substr(0, this.ruleForm.tel.length - 1)
          }, 50)
        }, 200)
      },
      handleMouseUp() {
        window.clearTimeout(this.timeId)
        window.clearInterval(this.intervalId)
      },
    }
  }
</script>

<style scoped>
  .name {
    font-weight: bold;
    font-size: 25px;
  }

  .numList {
    display: flex;
    flex-wrap: wrap;
  }

  .numTag {
    width: 25.3333%;
    margin: 5px 4%;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-radius: 50%;
    color: #666;
    font-size: 35px;
    border: none;
    background: #e5e5e5;
    user-select: none;
  }

  .numTag:active:focus, .numTag:active:hover {
    background-color: #d5d5d5;
  }

  .dialTag {
    text-align: center;
    width: 25.3333%;
    margin: 5px 4%;
    height: 69px;
    line-height: 69px;
    border-radius: 50%;
    font-size: 35px;
    border: none;
    user-select: none;
    color: #fff;
    background: #4cd966;
  }

  .dialTag:active:focus, .dialTag:active:hover {
    background-color: #3cc956;
  }

  .bottomRow {
    width: 100%;
    display: flex;
  }

  .icondelete:active:focus, .icondelete:active:hover {
    background-color: #d5d5d5;
  }

  .telBox {
    margin-bottom: 10px;
  }

  .telBox >>> .el-input {
    font-size: 20px;
  }

  .blue {
    /* box-sizing:border-box;  */
    border: 2px solid #338FCC;
  }

  .details {
    border: 1px solid #ddd;
    margin-top: 50px;
  }

  .details div {
    display: flex;
    align-items: center;
  }

  .details span {
    flex: 1;
    display: inline-block;
    padding: 20px 10px;
  }
</style>
