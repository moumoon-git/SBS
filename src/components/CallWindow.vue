<template>
  <!--来电弹窗-->
  <el-dialog :visible.sync="callIsVisible" width="20%" :title="calltitle" :modal="false"
             :close-on-click-modal="false"
             :modal-append-to-body="false"
             @close="callIsVisible=false">
    <!-- <el-card class="box-card" shadow="never"> -->
    <div align="center" style="margin-top:-20px;">
       <div class="call-menu-box">
          <div class="call-menu-box-main oy-position-box" v-show="pid!=0"  @click="backMyList">
             <span class="call-menu-box-main-img"></span>
          </div>
          <div v-if="myContent==''" class="myscroll-box" :class="{'oy-active':pid==0}">
               <div class="call-menu-box-main" v-for="(item,index) in myList" :key="index" @click="getData(item)">
                  {{item.name}}
              </div>
          </div>
          <div v-else class="mycontent-box myscroll-box">
              {{myContent}}
          </div>


      </div>
      <el-row style="margin:10px;">通话号码:{{callee}}</el-row>
      <el-row style="margin:10px;" v-if="caller.name" :span="12">姓名:{{caller.name}}</el-row>
       <el-row style="margin:10px;" v-else :span="12">陌生联系人</el-row>
      <el-row style="margin:10px;">通话时长:{{str}}</el-row>
      <el-row style="margin:10px;" v-if="caller.position">职务:{{caller.position}}</el-row>
      <el-row style="margin:10px;" v-if="caller.workUnit">工作单位:{{caller.workUnit}}</el-row>
        <!-- </el-card> -->
        <el-row style="margin-top: 50px">
          <el-button v-if="callClass=='callin'" type="primary" @click="answer">接听</el-button>
          <el-button v-if="callClass=='callon'" type="primary" @click="maintain">保持</el-button>
          <el-button v-if="callClass=='callheld'" type="primary" @click="AlternateCall">恢复</el-button>
          <el-button v-if="callClass=='callin'||callClass=='callon'||callClass=='callheld'||callClass=='callout'" type="danger" @click="hangup">挂断</el-button>
        </el-row>
        <el-row style="margin-top: 50px" v-if="callClass==''">正在尝试进行呼叫，请等待系统请求呼叫资源</el-row>
      </div>
      <!-- <div>
        <el-row style="margin-top: 50px">关联事件</el-row>
        <el-row style="margin:10px;">
          <el-select v-model="HistoryForm.eventId" filterable clearable  placeholder="请选择关联事件">
            <el-option v-for="item in eventOptions" :key="item.id" :label="item.title" :value="item.id">
            </el-option>
          </el-select>
        </el-row>
        <el-row style="margin:10px;">
          <el-input type="textarea" placeholder="请输入备注" :autosize="{ minRows: 2, maxRows: 4}" v-model="HistoryForm.remark"></el-input>
        </el-row>
        <el-row style="margin:10px;">
          <div align="center" ><el-button type="primary" @click="updatephone">保存</el-button></div>
        </el-row>
      </div> -->
  </el-dialog>
</template>

<script>


  export default {
    name: "CallWindow",
    data() {
      return {
        pid:0,
        myList:[],
        myContent:'',
        HWICP_Version: window.g.HWICP_Version,//icp版本
        callIsVisible: false,//是否显示来电弹窗
        calltitle: "通话信息",
        key: 0,
        agent_id: "",//坐席ID
        conn: "",//通道编号
        callClass: "",//当callStatus=true时，呼出【callout】,呼入【callin】,通话中【callon】,保持中【callheld】
        caller: {//
          name: "",//姓名
          position: "",//职务
          workUnit: "",//工作单位
        },//通话人信息
        str: "00:00:00",
        //通话关联事件
        HistoryForm: {
          remark: "",
          eventId: "",
          id: ""
        },
        //事件列表
        eventOptions: []
      }
    },
    computed: {
      timer(){
        return this.$store.getters.getTimer;
      },
      releaseIsDisabled() {
        return this.$store.getters.getCallStatus;
      },
      callee() {
        return this.$store.getters.getCallee;
      },
      connChange() {
        return this.$store.getters.getCallConn;
      },
      callClassChange() {
        return this.$store.getters.getCallClass;
      },
      //通话队列
      callQueue() {
        return this.$store.getters.getCallQueue;
      },

      //备注
      remark() {
        return this.$store.getters.getTxtNotif;
      }
    },
    created() {
      this.agent_id = sessionStorage.getItem("agent_id");
      this.getEventOptions();
      this.str=this.$store.getters.getTimer;
      this.getData();
    },
    watch: {
      timer(newVal){
        this.str=newVal
      },
      releaseIsDisabled(newVal) {
        this.callIsVisible = newVal
      },
      connChange(newVal) {
        this.conn = newVal
      },
      callee(newVal){
        console.log(newVal);
        this.findContactorByMobile();
      },
      callClassChange(newVal) {
        this.callClass = newVal
      },
      remark(newVal) {
        this.HistoryForm.remark = newVal
      },
    },
    methods: {
        getData(item){//获取下一级
           let formData ={}
            if(item){
              formData ={pid:item.id};
            }else{
               formData ={pid:this.pid};
            }
            this.$api.getPhoneHelperByPid(formData).then(res =>{
              if(res.errorcode===0){
                    if(item){
                        this.pid=item.id;
                     if(item.isend==1){
                        let data1 = res.data||[];
                        this.myContent =data1[0].name||'';
                        this.myList =[];
                      }else{
                        this.myList = res.data||[];
                      }
                    }else{
                           this.myList = res.data||[];
                    }

                }

            })
        },
       backMyList(){//返回电话助手上一级
         this.$api.getSamePidPhoneHelper({id:this.pid}).then(res =>{
              if(res.errorcode===0){
                    // console.log(res)
                    //  this.pid=item.id;
                     this.myContent ='';
                      let data1 = res.data||[];
                      this.pid=data1[0].pid;
                      this.myList = res.data||[];
              }
         })


      },
      getEventOptions() {
        this.$api.allEventlist({}).then((res) => {
          if (res.data)
            this.eventOptions = res.data;
        })
      },
      findContactorByMobile() {
        Object.keys(this.caller).forEach(key => this.caller[key]= '');
        let data = {phoneNum:this.callee};
        this.$api.findContactorByMobile(data).then((res)=>{
          if (res.errorcode!=0){
            this.$message.error(res.msg);
            return;
          }
          console.log(res.data);
          this.caller = res.data;
        })
      },

      updatephone() {
        this.HistoryForm.id = this.$store.getters.getCallHistoryId;
        let data = this.HistoryForm
        this.$api.ok(data).then((res) => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
          } else {
            this.$store.commit("setTxtNotify", '')
            this.$message({
              message: '保存成功！',
              type: 'success'
            });
          }
        })
      },
      //接听方法
      answer() {
        if (this.HWICP_Version == 'HWICP-19.0') {
          this.$icp19.AnswerCall(Number(this.agent_id), Number(this.conn), 1)
        }
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
            this.$icp19.DropCall(Number(self.agent_id), Number(self.conn),"");
            this.$store.commit("setCallStatus", false);
          }
        });
      },


    }
  }
</script>

<style scoped>
>>> .el-input__inner {
    color: #606266;
    font-size: inherit;
    font-weight:inherit;
    text-align: center;
  }

  >>> .el-input__inner {
    color: #76D672;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
  }
  .call-menu-box{
     width: 300px;
    position: absolute;
    top:0;
    left:100%;
    z-index:20;
    background:#fff;
    box-sizing: border-box;
    height: 100%;
    /* overflow: auto; */
    /* box-shadow: 0 1px 3px rgba(0,0,0,.3); */
    box-shadow: 0px 1px 3px 0px rgba(0,0,0,.3);
  }

  .call-menu-box-main{
    width:300px;
    height: 40px;
    line-height: 40px;
    position: relative;
    /* border-top:1px solid #333;
    border-bottom:1px solid #333; */
    border-bottom: 1px solid rgba(0,0,0,.3);
    box-sizing: border-box;
    cursor:pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .mycontent-box{
    padding:10px 5px;
    text-align: justify;
    word-break: break-all;
    text-indent: 2em;

  }
  .call-menu-box-main.oy-position-box{
    position: relative;
    z-index: 40;
    background: #fff;

  }
  .myscroll-box{
    height: 100%;
    padding-top: 42px;
    overflow: auto;
    box-sizing:border-box;
    position: absolute;
    top:0;
    left:0;
    width: 100%;
    z-index: 30;
    background: #fff;

  }
  .myscroll-box.oy-active{
    padding-top: 0;
  }
  .call-menu-box-main-img{
    display: inline-block;
    width: 26px;
    height: 26px;
    background-position: center;
    background-repeat: no-repeat;
    background-size:cover;
    background-image: url(../assets/back.png);
    margin:7px 0;
  }
  /* .call-menu-box-main:last-child{
    border-bottom: none;
  } */
</style>
