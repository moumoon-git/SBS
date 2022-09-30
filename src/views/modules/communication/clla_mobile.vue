<template>
  <div >
    <div>
      <el-tabs class="minWid">
        <!--      <el-tab-pane label="键盘拨号">-->
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
              v-for="(item,i) in ['1','2','3','4','5','6','7','8','9','*','0','#']"
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
        <!--      </el-tab-pane>-->
        <!--      <el-tab-pane label="通话队列">-->
        <!--        <div style="height:100%">-->

        <!--        </div>-->
        <!--      </el-tab-pane>-->
      </el-tabs>
<!--       联系人详情-->
      <div class="clla_delelt">
        <h2 class="flexs1"><p><span>姓名：</span>{{linkman.name}}</p><p><span>职务：</span>{{linkman.position}}</p> </h2>
        <span class="qy">单位：{{linkman.workUnit}}</span>
        <h2 class="flexs"><span>手机号码</span><span style="min-height: 33px;">{{linkman.mobile1?linkman.mobile1:" "}}</span></h2>
        <h2 class="flexs"><span>办公电话</span><span style="min-height: 33px;">{{linkman.mobile2?linkman.mobile2:" "}}</span></h2>
      </div>
<!--       监测拨机状态-->
      <div class="cllaState">
<!--        左边电话-->
        <div class="leftCllaState">
          <img src="../../../assets/img/clla.png" alt="">
<!--          默认是分秒  -->
          <div>00:00</div>
        </div>
<!--       右边电话-->
        <div class="rightCllaState">
          <img src="../../../assets/img/clla.png" alt="">
<!--          默认是分秒  -->
          <div>00:00</div>
        </div>

      </div>


    </div>
  </div>
</template>

<script>
  import '@/assets/font/iconfont.css'
  import Bus from '../../../utils/bus.js'
  export default {
    name: "clla_mobile",
    components: {},
    data() {
      let number=(rule,value,callback)  =>{
        let num= /^[1][2,3,4,5,7,8,9][0-9]{9}$/;
        let n=value.match(num);
        if(n ==null){
          callback(new Error('请输入正确的电话号码!'));
        }
        callback();
      };
      return {
        timeId: '',
        intervalId: '',
        contact_id:0,
        linkman:"",
        ruleForm:{
          tel:'',//添加号码
        },
        rules:{
          tel: [
            { validator: number, trigger: 'blur' },
            { min: 6, max: 17,  message:'请输入正确的电话号码!' },
          ],
        },
      }
    },
    methods: {
      handleDial() {//拨号操作
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            var num=this.$store.state.callPhone.num;
            // console.log("拨打电话",this.ruleForm.tel, this.$store.state)
            this.$store.commit('callPhone/phoneNum', this.ruleForm.tel)
            this.$store.commit('callPhone/num', num+=1)
              //拨打电话接口
              this.$http({
                url: this.$http.adornUrl('/phone/phoneinfo/makeCall'),
                method: 'POST',
                params: this.$http.adornParams({
                  phoneNum:this.ruleForm.tel,
                  agentId:0,
                  contact_id:this.contact_id
                })
              }).then((data) => {
                 if (data.code === 0) {
                    // console.log(data)
                  } else {
                    this.$message.error(data.msg);
                  }
              })


            // this.$icp19.MakeCall(10, this.ruleForm.tel, 1005)
          }//确认
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
      handleMouseUp() {
        window.clearTimeout(this.timeId)
        window.clearInterval(this.intervalId)
      }
    },
    mounted(){
      Bus.$off('cllaVal')
      Bus.$on('cllaVal', (data) => {
        // 用$on事件来接收参数
        //   data为对象array{"data",type}类型  必须包含字段id
        //   获得参数后将调用请求方法进行请求和渲染
        var data=data;
        // console.log('mobile1mobile1mobile1mobile1mobile1mobile1mobile1mobile1',data.mobile1,data)
        if(data.type=="human"){
          this.ruleForm.tel=data.data.mobile1;
        }else if(data.type=="hisHuman"){
          //获取联系人
          if(data.data.contactId){
            var id=data.data.contactId;
            this.$http({
              url: this.$http.adornUrl(`/mail/mailcontactor/info/${id}`),
              method: 'POST',
              data: this.$http.adornParams({})
            }).then(({ data }) => {
               if (data.code === 0) {
                // console.log(data.mailContactor)
                var Msgdata=data.mailContactor;
                this.ruleForm.tel=Msgdata.mobile1;
                this.linkman=Msgdata;
                this.contact_id=Msgdata.id;
                return
              } else {
                this.$message.error(data.msg);
              }
            })
          }else{
            // name,position,workUnit,mobile1,mobile2
            data.data.name= data.data.operatorName;
            data.data.mobile1= data.data.phoneCalled;
            data.data.position= "";//职务
            data.data.workUnit= "";//单位
            data.data.mobile2= "";//电话2
          }

        }
        this.linkman=data.data;
        this.contact_id=data.data.id;
      })
    },
    beforeDestroy() {

    },
    watch: {
      ruleForm: {
        handler() {
          this.$refs.ruleForm.clearValidate()
        },
        deep: true
      }
    }
  }
</script>

<style scoped >
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
    color: rgb(36,87,4);
    font-weight: bold;
    font-size: 35px;
    border: none;
    background: #e5e5e5;
    user-select: none;
    text-align: center;
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
    text-align: center;
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

  .minWid{
    min-width: 100%;
    border: 1px solid #999;
    padding:0 10px ;
  }
  .telBox{
    height: 70px;
  }
  .minWid  /deep/ .el-tabs__header{
    margin: 2px 0 0 0;
  }
  .telBox /deep/ .el-input__inner{
    font-size:25px;
    height: 50px;
    font-weight: bold;
    color: rgb(36,87,4);
    margin-top: 10px;
  }

  .clla_delelt{
    padding: 0 5px;
    height: 290px;
  }
  .flexs{

  }
  .flexs1{
    width: 100%;
    display: flex;
  }
  .flexs1>p{
    flex: 1;
    font-size: 24px;
    display: flex;
    text-align: left;
  }
  .flexs>span{
    display:inline-block;
    width: 35%;
    text-align: center;
  }
  .flexs>span:nth-child(2){
    width: 60%;
    background: #0e8ebe;
    color: #fff;
    font-size: 20px;
    padding: 5px 0;
  }
.qy{
  font-size: 20px;
  font-weight: bold;
  margin-top: 30px;
  display: block;
}


/*  电话*/
.cllaState{
  width: 100%;
  display: flex;
  height: 90px;
}
.cllaState>div{
  flex: 1;
  height: 100%;
}
  /*.cllaState>div:nth-child(1){*/
  /*  margin-right: 45px;*/
  /*}*/
  /*.cllaState>div:nth-child(2){*/
  /*  margin-left: 45px;*/
  /*}*/
  .leftCllaState,.rightCllaState{
    height: 100%;
    display: flex;
    align-items: center;
  }
  .leftCllaState>img,.rightCllaState>img{
    width: 50%;
    margin: 0 5%;
    height: 100%;
  }
  .rightCllaState{
    flex-flow: row-reverse;
  }
  .rightCllaState>div{
    justify-content: flex-end;
  }
  .leftCllaState>div,.rightCllaState>div{
    width: 40%;
    height: 50%;
    display: flex;
    align-items: flex-end;
    color: #444;
  }


</style>

