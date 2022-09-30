<template>
  <div style="height:589px;">
    <div style="margin-bottom: 10px">
      <el-form  :model="ruleForm" :rules="rules" ref="ruleForm"  label-position="left"   @submit.native.prevent>
        <el-form-item  prop="inputImport">
          <el-input @blur="blur('ruleForm')" v-model="ruleForm.inputImport" placeholder="添加号码,回车确认添加!" :validate-event="false"
                    @keyup.enter.native="filterTexts('ruleForm')"  clearable
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="phoneList">
      <tag ref="tag" :dataName="dataName" @handleClose="handleClose"></tag>
    </div>
    <div style="width: 100%;text-align: right;margin-right: 10px;height: 30px;line-height: 30px">
      <el-link :underline="false" @click="empty">清空</el-link>&nbsp;&nbsp;<span>共{{number}}人</span>
    </div>
    <div>
      <el-input
        :maxlength=1000
        clearable
        type="textarea"
        :rows="11"
        placeholder="请输入内容"
        v-model="report"
        resize="none"
        show-word-limit
      >
      </el-input>
    </div>
    <div class="bottomRow">
      <!-- bug12442 短信签名隐藏 -->
      <!-- <div class="leftSelect">
        <label class="export">签名:</label>
        <el-select v-model="signature" filterable clearable placeholder="请选择" @blur="selectBlur">
          <el-option
            v-for="item in signatureOptions"
            :key="item.value"
            :label="item.value"
            :value="item.value">
          </el-option>
        </el-select>
      </div> -->
      <div class="rightButton">
        <el-button type="primary" size="mini" @click="sendData">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import tag from "@/components/tag/tag"
  export default {
    name: "noteCheck",
    components:{
      tag
    },
    data(){
      let number=(rule,value,callback)  =>{
        let num= /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/;
        let n=value.match(num);
        if(n ==null){
          callback(new Error('请输入正确的电话号码!'));
        }
        callback();
      };
      return{
        number:0,//共多少人
        dataName:[],//选中人员
        report:'',//报告
        signature:'',//签名
        signatureOptions: [], //签名
        // options:[
        //   {value:'办公室',label:'办公室'},
        //   {value:'财务室',label:'财务室'},
        //   {value:'总裁办',label:'总裁办'},
        // ],//签名数据
        ruleForm:{
          inputImport:'',//添加号码
        },
        rules:{
          inputImport: [
            { validator: number, trigger: 'blur' },
            { min: 11, max: 11,  message:'请输入11位数的电话号码!' },
          ],
        },
        optFor:[],//选中存储
        datas:[],
        ok:[],
      }
    },
    created(){
      this.getEventDesc()
    },
    mounted(){
      this.getFindSmsSign() // 获取签名
    },
    methods:{
      //获取短信签名
      getFindSmsSign() {
        let data;
        this.$api.findSmsSign(data).then(res => {
          if (res.errorcode != 0) {
            this.$message.error(res.msg);
            return;
          }
          this.signatureOptions = res.data;
        });
      },
      getEventDesc(){//获取默认事件或最新事件
        let eventId=sessionStorage.getItem('newID');
        let data={
          id:eventId
        };
        this.$api.findById(data).then((res) => {
          if(res.errorcode === 0){
            this.report= res.data.event.reportDescription
          }
        })
      },
      blur(ruleForm){
        this.$refs[ruleForm].clearValidate();
      },
      filterTexts(ruleForm) {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            this.optFor.push({
              name:this.ruleForm.inputImport,
              value:this.ruleForm.inputImport
            });
            for(let i=0; i< this.optFor.length; i++){
              for(let j=i+1; j< this.optFor.length; j++){
                if(this.optFor[i].name== this.optFor[j].name){
                  this.optFor.splice(j,1);
                  j--;
                }
              }
            }
            this.datas=Array.from(new Set(this.optFor));
            this.dataName=this.datas;
            this.number=this.dataName.length;
            this.ruleForm.inputImport = '';
          }//确认
        });

      },
      selectBlur(e) {
        this.signature = e.target.value
      },
      handleClose(tag){
        this.dataName.splice(this.dataName.indexOf(tag), 1);
        this.optFor.splice(this.optFor.indexOf(tag), 1);
        this.number=this.dataName.length;
      },
      empty(){//清空列表
        this.dataName=[];
        this.datas=[];
        this.optFor=[];
        this.number=this.dataName.length;
      },
      get(row){
        this.dataName=[];
        this.datas=[];
        this.optFor.push({
          name:row.name,
          value:row.mobile
        });
        for(let i=0; i< this.optFor.length; i++){
          for(let j=i+1; j< this.optFor.length; j++){
            if(this.optFor[i].name== this.optFor[j].name){
              this.optFor.splice(j,1);
              j--;
            }
          }
        }
        this.datas=Array.from(new Set(this.optFor));
        this.dataName=this.datas;
        this.number=this.dataName.length;
      },
      sendData(){
        let datanamevalue='';
        let nameSignature;
        for(let i=0;i<this.dataName.length;i++){
          if(this.dataName[i].value==null||this.dataName[i].value==undefined||this.dataName[i].value==''){
            this.$message({
              message: '某一项电话号码为空',
              type: 'warning'
            });
            return;
          }
            datanamevalue+=this.dataName[i].value+',';
        }
        if(this.signature==''||this.signature==null||this.signature==undefined){
          nameSignature=this.report
        }else{
          nameSignature=this.report+'【'+this.signature+'】'
        }
        let json={
          content:nameSignature,
          phoneNum:datanamevalue
        };
        let data={
          data:JSON.stringify(json)
        };

        this.$api.addSmsQueue(data).then((res) => {
          if(res.errorcode=='0'){
            this.$message({
              message: '短信下发成功!',
              type: 'success'
            });
          }else {
            //this.$message.error(res.msg);
          }
        })
      },
    }
  }
</script>

<style scoped>
  .phoneList{
    border: 1px dashed transparent;
    background: linear-gradient(white,white) padding-box,
    repeating-linear-gradient(-45deg,#ccc 0, #ccc 3px ,white 0,white 5px);
    width: 100%;
    height: 200px;
    overflow-y: auto;
  }
  .bottomRow{
    width: 100%;
    display: flex;
    height: 50px;
    line-height: 50px
  }
  .leftSelect{
    flex: 1;
    text-align: left;
  }
  .rightButton{
    flex: 1;
    text-align: right;
  }
  .export{
    color: #909399;
    vertical-align: middle;
    height: 30px;
    line-height: 30px;
    display: inline-block;
    white-space: nowrap;
    font-size: 14px;
  }
  .leftSelect >>>.el-input{
    width: 100px;
  }
  .leftSelect >>>.el-input__inner{
    height: 30px;
    line-height: 30px;
  }
</style>
