<template>
    <div>
        <div>
          <div class="telBox">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" @submit.native.prevent>
              <el-form-item prop="tel" class="phoneCall">
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
              <span class="iconfont icondelete" style="display:inline-block;font-size: 28px;margin-top: 3px;margin-left: 6px;"></span>
            </el-tag>
          </div>
        </div>

     <!--来电弹窗-->
<!--    <call-window ref="CallWindow"></call-window>-->
    </div>
</template>

<script>
  // import CallWindow from "@/components/CallWindow";
  import { mapGetters } from "vuex";
    export default {
        name: "figurePlate",
        // components: {CallWindow},
        data(){
          return{
            ruleForm:{
              tel:''
            },
            rules:{

            },
            seatNumber:sessionStorage.getItem("seat"),//坐席号
            agent_id: sessionStorage.getItem("agent_id"),
            conn:'',
            HWICP_Version: window.g.HWICP_Version,//icp版本
            IsZengChengProject: window.g.IsZengChengProject // 增城项目
          }
        },
        computed: {
          ...mapGetters({
            callIsVisible:'getCallStatus',
            isShowWind:'getIsShowWind',
            confStatus: "getConfStatus" //会议状态
          }),
        },
        methods:{
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
          handleMouseUp() {
            window.clearTimeout(this.timeId)
            window.clearInterval(this.intervalId)
          },
          /**
           * @param {mobile: String} 呼出号码
           * @author hexinting
           * @date 2020-12-25
           * @description 呼出电话
           */
          makeCall(mobile) {
            console.log(mobile);
            let self = this;
            let data = {number: mobile,agentId:sessionStorage.getItem("agent_id")||''};
            this.$api.validateNumber(data).then(res => {
              try {
                  if (self.HWICP_Version == 'HWICP-19.0') {
                  this.$store.commit("setCallee", mobile);
                  let data = {phoneNum:mobile};
                  this.$api.findContactorByMobile(data).then((res)=>{
                    if (res.errorcode!=0){
                      //this.$message.error(res.msg);
                      return;
                    }

                    res.data =res.data||{}
                    console.log(res.data);
                    this.$store.commit("SET_USERC",res.data);

                  })
                  this.$icp19.MakeCall(Number(self.agent_id), mobile, self.seatNumber.toString());
                }
              } catch (error) {
                console.log(error)
              }
            });
          },
          /**
            * @lastEditor hexinting
            * @lastDate 2020-12-25
            * @description 呼叫电话
            */
          handleDial() {//拨号操作
            if(this.isShowWind||this.callIsVisible){
              this.$message({
                message: "正在通话中",
                type: "warning"
              });
              return;
            }
            if(this.confStatus){
              this.$message({
                  message: "你正在会议中不可以拨打电话",
                  type: "warning"
                }
              );
              return
            }
            let self = this;
            let mobile = self.ruleForm.tel;

            this.$nextTick(() => {
              if (mobile == '' || mobile == null) {
                this.$message({
                    message: "联系号码不能为空",
                    type: "warning"
                  }
                );
                return;
              }
              // bug9749 增城项目不需要呼叫确认框 author:hexinting date:2020-12-25
              if (this.IsZengChengProject) {
                this.makeCall(mobile);
              } else {
                this.$confirm('确认呼叫当前号码?', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.makeCall(mobile);
                  // let self = this
                  // let data = {number: mobile,agentId:sessionStorage.getItem("agent_id")||''};
                  // this.$api.validateNumber(data).then(res => {
                  //   try {
                  //     if (self.HWICP_Version == 'HWICP-19.0') {
                  //       this.$store.commit("setCallee", mobile);
                  //       let data = {number:mobile};
                  //       this.$api.findContactorByMobile(data).then((res)=>{
                  //         if (res.errorcode!=0){
                  //           //this.$message.error(res.msg);
                  //           return;
                  //         }

                  //         res.data =res.data||{}
                  //         console.log(res.data);
                  //         this.$store.commit("SET_USERC",res.data);

                  //       })
                  //       this.$icp19.MakeCall(Number(self.agent_id), mobile, self.seatNumber.toString());
                  //     }
                  //   } catch (error) {
                  //     console.log(error)
                  //   }
                  // });
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消呼叫'
                  });
                });
              }
            })

          },
        }
    }
</script>

<style scoped>
  .name{
    font-weight: bold;
    font-size: 25px;
  }
  .numList {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .numTag {
    width: 18.3333%;
    margin: 3px 7%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 50%;
    color: #666;
    font-size: 19px;
    border: none;
    background: #e5e5e5;
    user-select: none;
  }

  .numTag:active:focus, .numTag:active:hover {
    background-color: #d5d5d5;
  }

  .dialTag {
    text-align: center;
    width: 17.3333%;
    margin: 5px 4%;
    height: 40px;
    line-height: 40px;
    border-radius: 50%;
    font-size: 25px;
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
    justify-content: center;
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
  .details{
    border: 1px solid #ddd;
    margin-top:50px;
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

</style>
