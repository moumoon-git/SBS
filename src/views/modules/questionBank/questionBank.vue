<template>
  <div class="questionBank" >

    <!-- 主题内容 -->
    <div class="questionBank_content">
      <!-- 左边 -->
      <div class="questionBank_left">
        <questionBankLeft ref='questionBank_left' @addTkType='addTkType' @seleTopic='seleTopic' ></questionBankLeft>
      </div>

      <!-- 右边 -->
      <div class="questionBank_right">
        <questionBankRight ref='questionBankRight' ></questionBankRight>
        <div class="BtnWraps">
<!--          <el-button>取消</el-button>-->
<!--          <el-button type="primary" @click="captures">保存</el-button>-->
          <el-button type="primary" @click="backClick">返回</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import questionBankLeft from './template/questionBank_left'
  import questionBankRight from './template/questionBank_right'
  import url from '@/mock/modules/url'
  export default{
    name:'questionBank',
    data () {
      return{
        data:'',
        alldata:''
      }
    },
    methods:{
      seleTopic (item) {
        console.log(item,'添加单题',this.alldata.id)
        this.$refs.questionBankRight.addTkDT(item,this.alldata.id)
      },
      addTkType (item) {
        // console.log('新增题库类目')
        this.$refs.questionBankRight.addTk()
      },
      captures () {
        let data  = this.$refs.questionBankRight.capture()
        console.log(data)
        if (data[0].id) {
          this.$http({
            url: this.$http.adornUrl(url.epiRegisterTikuUpdate.url),
            method: url.epiRegisterTikuUpdate.method,
            params: this.$http.adornParams(data[0])
          }).then((res)=>{

          }).catch((err)=>{

          })
        }else {
          this.$http({
            url: this.$http.adornUrl(url.epiRegisterTikuSave.url),
            method: url.epiRegisterTikuSave.method,
            data: this.$http.adornData(data[0])
          }).then((res)=>{
            console.log(res.data)
            if (res.data.code == 0) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.$refs.questionBankRight.delOne()
              this.$refs.questionBankRight.addTk()
            }
          }).catch((err)=>{
            console.log(err)
             this.$message.error('保存失败');
          })
        }

      },
      inits (data) {
        console.log(data)
        this.$refs.questionBankRight.init(data)
      },
      alldatas (data) {
        this.alldata = data.data
        this.$refs.questionBankRight.getalldata(data.data)
      },
      Topicinits (data) {
        this.$refs.questionBankRight.Topicinitxs(data)
      },
      backClick () {
        this.$emit('backClicks','')
      }
    },
    mounted () {
      let questionBank = document.getElementsByClassName('questionBankFrom_wrap')[0]
      // console.log(questionBank.parentNode)
      questionBank.parentNode.className = ''
      questionBank.parentNode.style.padding = '0 !important'
      questionBank.parentNode.style.background = 'transparent'
      // this.data = this.$route.query.data
      // this.inits([this.data])
    },
    components:{
      questionBankLeft,
      questionBankRight
    }
  }
</script>

<style scoped>
.questionBank{
  width: 100%;
  min-height: 609px;
  display: flex;
  flex-direction: column;
  background: #ebebeb;
}
.questionBank_content{
  flex: 1;
  display: flex;
}
.questionBank_left{
  width: 155px;
  min-width: 155px;
  /* box-shadow: 2px 2px 2px 0 rgba(0,0,0,.08); */
  border: 1px solid rgba(0,0,0,.08);
  border-radius: 5px;
  margin-right: 10px;
  min-height: 100%;
  background: #fff;
}
.questionBank_right{
  flex: 1;
  min-height: 100%;
  /* box-shadow: 2px 2px 2px 0 rgba(0,0,0,.08); */
  border: 1px solid rgba(0,0,0,.08);
  border-radius: 5px;
  background: #fff;
}
  .BtnWraps {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .BtnWraps /deep/ .el-button--primary {
    background-color: #2672ff;
    border-color: #2672ff;
  }

  .BtnWraps /deep/ .el-button:focus,
  .el-button:hover {
    color: #2672ff;
    border-color: rgb(185, 208, 232);
    background-color: rgb(185, 208, 232);
  }





</style>
