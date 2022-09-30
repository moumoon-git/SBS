<template>
  <div style="height:215px;">
    <div>
        <div class="telBox">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" @submit.native.prevent>
            <el-form-item prop="tel">
              <el-row>
                <el-col :span="18">
                  <el-input size="small" v-model="ruleForm.inputMobile" placeholder="请输入要拨打的号码" :validate-event="false"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-button @click="handleDial" type="success" size="small">拨号</el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <div class="linkman">
            <el-link @click="changeCallNumber(ruleForm.mobile)" :underline="false" class="linkmanA">
              <span>常用号码:</span>
              <span> {{ruleForm.mobile}}</span>
            </el-link>
          </div>
          <div class="linkman">
            <el-link  :underline="false" class="linkmanA">
              <span>姓名:</span>
              <span>{{ruleForm.name}}</span>
            </el-link>
          </div>
          <div class="linkman">
            <el-link @click="changeCallNumber(ruleForm.officeTel)" :underline="false" class="linkmanA">
              <span>固定号码:</span>
              <span>{{ruleForm.officeTel}}</span>
            </el-link>
          </div>
          <div class="linkman">
            <el-link  :underline="false" class="linkmanA">
              <span>职位:</span>
              <span>{{ruleForm.position}}</span>
            </el-link>
          </div>
          <div class="linkman">
            <el-link  :underline="false" class="linkmanA">
              <span>单位:</span>
              <span>{{ruleForm.workUnit}}</span>
            </el-link>
          </div>
        </div>
    </div>
    <!--来电弹窗-->
<!--    <call-window ref="CallWindow"></call-window>-->
  </div>
</template>

<script>
    // import '@/assets/font/iconfont.css'
    import { mapGetters } from "vuex";
    // import mixin from "@/view/yz_integratedCommunication/icpPhone/icpPhonePage/mixin";
    import mixin from '@/view/yangZhouEventReports/assets/js/mixin/mixin.js'
    // import CallWindow from "@/components/CallWindow";
    import mixin2 from '@/view/yangZhouEventReports/assets/js/mixin/mixin.js';

    export default {
        name: "phoneDisposition",
        // components:{
        //   CallWindow
        // },
        mixins: [mixin, mixin2],
        data(){
          return{
            ruleForm:{
              inputMobile:'',
              mobile:'',
              name:'',
              officeTel:'',
              position:'',
              workUnit:'',
            },
            seatNumber:sessionStorage.getItem("seat"),
            agent_id:sessionStorage.getItem("agent_id"),
            HWICP_Version: window.g.HWICP_Version,//icp版本
            rules:{},
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
          //点击信息
          changeCallNumber(obj){
            this.ruleForm.inputMobile=obj
          },
          //父组件点击调用方法赋值
          assignment(row){
            console.log(row)
            this.ruleForm.mobile=row.mobile
            this.ruleForm.name=row.name
            this.ruleForm.officeTel=row.officeTel
            this.ruleForm.position=row.position
            this.ruleForm.workUnit=row.workUnit
          },
          handleDial() {//拨号操作
              this.makePhoneCall(this.ruleForm.inputMobile, null, null, sessionStorage.getItem('newID'));
              // 注释原因：旧业务逻辑talkCall 改为makePhoneCall
              // let row={
              //     number:this.ruleForm.inputMobile
              // }
              // this.talkCall(row)

            // if(this.isShowWind||this.callIsVisible){
            //   this.$message({
            //     message: "正在通话中",
            //     type: "warning"
            //   });
            //   return;
            // }
            // if(this.confStatus){
            //   this.$message({
            //       message: "你正在会议中不可以拨打电话",
            //       type: "warning"
            //     }
            //   );
            //   return
            // }
            // let self = this;
            // let mobile = self.ruleForm.inputMobile;
            //
            // this.$nextTick(() => {
            //   if (mobile == '' || mobile == null) {
            //     this.$message({
            //         message: "联系号码不能为空",
            //         type: "warning"
            //       }
            //     );
            //     return;
            //   }
            //   this.$confirm('确认呼叫当前号码?', {
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     type: 'warning'
            //   }).then(() => {
            //     let data = {number: mobile,agentId:sessionStorage.getItem("agent_id")||''};
            //     this.$api.validateNumber(data).then(res => {
            //       try {
            //          if (self.HWICP_Version == 'HWICP-19.0') {
            //           this.$store.commit("setCallee", mobile);
            //           let data = {number:mobile};
            //           this.$api.findContactorByMobile(data).then((res)=>{
            //             if (res.errorcode!=0){
            //               //this.$message.error(res.msg);
            //               return;
            //             }
            //
            //             res.data.data =res.data.data||{}
            //             console.log(res.data);
            //             this.$store.commit("SET_USERC",res.data);
            //
            //           })
            //           this.$icp19.MakeCall(Number(self.agent_id), mobile, self.seatNumber.toString());
            //         }
            //       } catch (error) {
            //         console.log(error)
            //       }
            //
            //     });
            //   }).catch(() => {
            //     this.$message({
            //       type: 'info',
            //       message: '已取消呼叫'
            //     });
            //   });
            // })
          },

        }
    }
</script>

<style scoped>
  .linkman{
    width: 100%;
    text-align: left;
    display: flex;
    align-items: center;
    padding: 5px 0;
  }
  .linkman::before{
    content: "●";
    color: #BDE4FF ;
    padding-right: 10px;
  }
  .linkmanA{
    display: flex;
    justify-content: space-around;
  }
  .linkmanA span{
    padding: 10px 20px;
  }
</style>
