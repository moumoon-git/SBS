<template>
  <div>
    <div class="close">
      <i @click="closeConnectionModel" class="el-icon-close closeStyle" ></i>
    </div>
    <div v-if="threeCall" style="font-weight: bold;font-size: 14px;width: 100%;text-align: center;">三方通话</div>
    <div  class="inputSearch">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" status-icon   @submit.native.prevent :show-message="false">
        <el-form-item prop="phoneNumber">
          <el-row>
            <el-col :span="18">
              <el-input v-model="ruleForm.phoneNumber"  ref="inputNumber"
                       size="mini" placeholder="请输入号码" ></el-input>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="mini" @click="addNumber">添加</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
    <div style="width: 100%">
      <div style="width: 341px;margin: 0 auto;height: 130px">
        <div class="numberPlan">
          <div class="my-fax-list-box">
            <div class="my-fax-list1" v-if="speakToPeople.mobile!==''">
              <i class="el-icon-close" @click="closeClickIndex()"></i>
              <div class="my-fax-list1-left-box">
                <div class="my-fax-list1-right">
                  <span>{{speakToPeople.name}}</span>
                  <span style="padding-left: 20px">{{speakToPeople.workUnit}}</span>
                </div>
                <div class="my-fax-list1-right" style="padding-top: 12px;">
                  <span style="color: #909399;font-size: 12px">{{speakToPeople.position}}</span>
                  <span style="float: right;font-size: 12px">{{speakToPeople.mobile}}</span>
                </div>
              </div>
            </div>
            <div v-else style="font-size: 14px; color: #666666;text-align: center;">请从左侧通讯录选择需要转接的联系人</div>
          </div>
        </div>
      </div>
    </div>

    <div style="width: 341px;margin: 0 auto;padding-top: 15px;border-top: 1px solid rgba(233,236,241,1)">
      <div style="width: 100%;text-align: center">
        <el-button size="mini" @click="closeConnectionModel">取消</el-button>
        <el-button size="mini"  type="primary" @click="closeAffirm">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
    import mixin from "../mixin";
    import { mapGetters } from "vuex";
    import bus from "@/yz_components/common/js/eventBus";
    export default {
        name: "throughConnection",
        mixins: [mixin],
        props: ["threeCall"],
        data () {
            let number = (rule, value, callback) => {
                let num = /^[0-9*#]+$/;
                let n = value.match(num);
                if (n == null) {
                    callback(new Error('请输入正确的电话号码!'));
                }
                callback();
            };
            return {
                ruleForm:{
                    phoneNumber: '' , // 输入号码
                },
                rules:{
                    phoneNumber:[
                        {validator: number, trigger: 'blur'},
                        {max: 12, message: '请输入正确的电话号码!'},
                    ],
                },
                agent_id:sessionStorage.getItem("agent_id")||'',
                speakToPeople: {
                        name:'',
                        workUnit:'',
                        position:'',
                        mobile:'',
                    }
                ,//转接人
            }
        },
        computed:{
            ...mapGetters({
                box: 'getBoxList' , //获取到当前拨号盘能点击的按钮
                phoneList: "getPhoneList",
                nowSelectPhoneList :'getNowSelectPhoneList', //现在选中的通话
                conn:'getCallConn',
            }),
            numberValue() {
                return this.ruleForm.phoneNumber;
            },
        },
        mounted() {
            let _this = this;
            bus.$on('threeSidesData', ({number}) =>{
                _this.ruleForm.phoneNumber = number
                _this.addNumber()
            })
            bus.$on('transferData',({number}) =>{
                _this.ruleForm.phoneNumber = number
                _this.addNumber()
            })
        },
        watch:{
            numberValue(newval, oldval) {
                this.ruleForm.phoneNumber = newval.replace(/[^0-9*#]/, "");
            },
        },
        methods: {
            assignment(list){
                this.speakToPeople.name=list[0].content.name;
                this.speakToPeople.workUnit=list[0].content.workUnit;
                this.speakToPeople.position=list[0].content.position;
                this.speakToPeople.mobile=list[0].content.number;
            },
            closeConnectionModel() {
                this.$refs.ruleForm.resetFields()
                this.$emit('closeConnectionModel')
            },

            closeClickIndex() {
                this.speakToPeople={
                    name:'',
                    workUnit:'',
                    position:'',
                    mobile:'',
                }
            },

            //确认转接 || 发起三方
            closeAffirm() {
              if([undefined,null,''].includes(this.speakToPeople.mobile)) {
                this.$message({
                  message: '请先添加号码',
                  type: 'warning'
                });
                return
              }
                this.$refs.ruleForm.resetFields()
                this.$emit('affirmModel',this.threeCall,this.speakToPeople)
            },

            //手动添加联系人
            addNumber(){
                let data = {phoneNum:this.ruleForm.phoneNumber};
                this.$api.findContactorByMobile(data).then(res=>{
                    if (res.errorcode == 0){
                        if([''].includes(res.data.mobile)){
                            this.speakToPeople.name='未知联系人';
                            this.speakToPeople.workUnit='未知';
                            this.speakToPeople.position='未知';
                            this.speakToPeople.mobile=this.ruleForm.phoneNumber;
                        }else {
                            this.speakToPeople.name=res.data.name;
                            this.speakToPeople.workUnit=res.data.workUnit;
                            this.speakToPeople.position=res.data.position;
                            this.speakToPeople.mobile=res.data.mobile;
                        }

                    }
                });
            },
        }
    }
</script>

<style scoped>
  .close{
    width: 100%;
    text-align: right;
    height: 20px;
    padding-top: 10px;
    line-height: 20px;
  }
  .closeStyle{
    cursor: pointer;
    padding-right: 15px;
    width:20px;
    height:20px;
    corlor:rgba(188,197,207,1);
  }
  .inputSearch{
    width: 250px;
    text-align: center;
    margin: 0 auto
  }
  .numberPlan{
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    text-decoration: none;
  }

  .my-fax-list1 {
    margin: 10px;
    height: 40px;
    width: 341px;
    padding: 10px 0;
    color: #858585;
    cursor: pointer;
    border: 1px solid #eae6e6;
    border-radius: 4px;
    position: relative;
  }
  .my-fax-list1-left-box {
    display: block;
    box-sizing: border-box;
    height: 30px;
    margin-right: 35px;
  }

  .my-fax-list1-right {
    margin-left: 10px;
    color: #333333;
    font-size: 14px;
    line-height: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .el-icon-close {
    float: right;
    /*font-size: #333;*/
    padding-right: 10px;
    line-height: 30px;
    cursor: pointer;
  }
  .my-fax-list-box{
    width: 100%;
  }
</style>
