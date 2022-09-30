<template>
  <div style="height:514px;">
    <el-tabs>
      <el-tab-pane label="键盘拨号">
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
      </el-tab-pane>
      <el-tab-pane label="通话队列">
        <div style="height:100%">
          <div class="dialpad">
            <div class="peopleList">
              <el-scrollbar style="height: 100%">
                <template v-for="(items, index) in phoneQueue">
                  <div class="showPhone" @click='clickPhone(items,index)'
                      @dblclick="openCallWindow(items)"
                       :class="{blue: changeColor === items.mobile}" :key='index'>
                    <div class="showPhoneLeft">
                      <div>{{items.mobile}}</div>
                      <div style="text-align: center"></div>
                    </div>
                    <div class="showPhoneRight">
                      <div @click='release(items,index)'><i class="el-icon-d-arrow-right"></i></div>
                    </div>
                  </div>
                </template>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!--来电弹窗-->
    <call-window ref="CallWindow"></call-window>
  </div>
</template>

<script>
  import CallWindow from "@/yz_components/CallWindow";
  import '@/assets/font/iconfont.css'

  export default {
    name: "phoneCheck",
    components: {CallWindow},
    data() {
      let number=(rule,value,callback)  =>{
        let num= /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/;
        let n=value.match(num);
        if(n ==null){
          callback(new Error('请输入正确的电话号码!'));
        }
        callback();
      };
      return {
        timeId: '',
        intervalId: '',
        ruleForm:{
          tel:'',//添加号码
        },
        rules:{
          tel: [
            { validator: number, trigger: 'blur' },
            { min: 6, max: 17,  message:'请输入正确的电话号码!' },
          ],
        },
        changeColor:'',
        agent_id: "",//坐席ID
        conn: "",//通道编号，
        seatNumber:"",//坐席号
        HWICP_Version: window.g.HWICP_Version,//icp版本
      }
    },
    computed:{//计算属性监听全局变量进行数组操作
      phoneQueue(){
        return this.$store.getters.getCallQueue
      }
    },
    watch: {
      ruleForm: {
        handler() {
          this.$refs.ruleForm.clearValidate()
        },
        deep: true
      },
    },
    mounted()
    {
      this.seatNumber = sessionStorage.getItem("seat");
      this.agent_id = sessionStorage.getItem("agent_id");

      this.$refs.CallWindow.callIsVisible = this.$store.getters.getCallStatus;
      if (this.$refs.CallWindow.callIsVisible == true) {
        this.phoneQueue=this.$store.getters.getCallQueue;
        this.$refs.CallWindow.callClass = this.$store.getters.getCallClass;
        this.$refs.CallWindow.conn = this.$store.getters.getCallConn;
        this.$refs.CallWindow.findContactorByMobile();
      }

    },
    methods: {
      clickPhone(data){
        this.clickPhoneData = data;
        this.changeColor = data.mobile;
        this.$store.commit("setCallee", data.mobile);
        this.$store.commit("setCallClass", data.callClass);
        this.$store.commit("setCallConn", data.conn);
      },
      handleDial() {//拨号操作
        let self = this;
        console.log(self.ruleForm.tel);
        let data = {number: self.ruleForm.tel};
        // this.$icp.dial(self.phoneNumber);
        this.$api.validateNumber(data).then(res => {
          if (self.HWICP_Version == 'HWICP-19.0') {
            this.$store.commit("setCallee", self.ruleForm.tel);
            this.$refs.CallWindow.findContactorByMobile();
            this.$store.commit("setIsJumpToIcpPhone",false);
            this.$icp19.MakeCall(Number(self.agent_id), self.ruleForm.tel, self.seatNumber.toString());
          }
        });
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
      handleMouseDown() {
        this.timeId = setTimeout(() => {
          this.intervalId = setInterval(() => {
            this.ruleForm.tel = this.ruleForm.tel.substr(0, this.ruleForm.tel.length - 1)
          }, 50)
        }, 200)
      },
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
      handleMouseUp() {
        window.clearTimeout(this.timeId)
        window.clearInterval(this.intervalId)
      },
       //重新打开callwindows方法
      openCallWindow(items) {
        this.$refs.CallWindow.callIsVisible = true;
        this.$refs.CallWindow.cid = items.cid;
        this.$store.commit("setCallee", items.mobile);
        this.$store.commit("setCallClass", items.callClass);
        this.$store.commit("setCallConn", items.conn);
      }
    }
  }
</script>

<style scoped>
  .numList {
    display: flex;
    flex-wrap: wrap;
  }

  .numTag {
    width: 25.3333%;
    margin: 5px 4%;
    height: 69px;
    line-height: 69px;
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

  .blue{
    /* box-sizing:border-box;  */
    border:2px solid #338FCC;
  }
  .peopleList {
    height: 530px;
    border: 1px solid rgba(162, 162, 162, 1);
  }

  .showPhone{
    font-size: 0px;
    color: #fff;
    height: 30px;
    display: flex;
  }

  .showPhoneLeft{
    height: 30px;
    flex: 8;
    background: rgb(69,69,69);
  }

  .showPhoneRight{
    flex: 2;
    height: 30px;
    background: rgb(37,37,37);
  }

  .showPhoneLeft div{
    font-size: 14px;
    line-height: 30px;
    width:45%;
    padding-left: 5%;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;

  }
  .showPhoneRight i{
    font-size: 20px;
    cursor: pointer;
  }
  .showPhoneRight div{
    font-size: 20px;
    padding: 0 10px;
    display: inline-block;
  }
</style>
