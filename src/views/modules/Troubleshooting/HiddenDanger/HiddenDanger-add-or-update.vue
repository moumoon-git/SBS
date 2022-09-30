<template>
  <div class="HiddenDanger">

    <el-row :gutter="20">
      <p class="thetitle">排查详情</p>
    </el-row>

    <el-row :gutter="20">
      <div class="info">
        <div class="title">排查情况</div>
        <div style="display:flex;justify-content:space-around;margin:20px 0 0 160px;">
          <div style="width:33.3%" class="hide">排查结果：{{detailData.investigateResultString}}</div>
          <div style="width:33.3%" class="hide">登记时间：{{detailData.gmtCreate}}</div>
          <div style="width:33.3%" class="hide">备注：{{detailData.remark}}</div>
        </div>
      </div>
    </el-row>

    <el-row :gutter="20">
      <div class="info">
        <p class="title">基本信息</p>
        <div style="display:flex;justify-content:space-around;margin:20px 0 0 160px;">
          <div style="width:33.3%" class="hide">排查区域：{{detailData.areaTownGridNameString}}</div>
          <div style="width:33.3%" class="hide">详细地址：{{detailData.detailedAddress}}</div>
          <div style="width:33.3%" class="hide">姓名：{{detailData.imName}}</div>
        </div>
        <div style="display:flex;justify-content:space-around;margin:20px 0 0 160px;">
          <div style="width:33.3%" class="hide">联系方式：{{detailData.phone}}</div>
          <div style="width:33.3%" class="hide">年龄：{{detailData.age}}</div>
          <div style="width:33.3%" class="hide">籍贯：{{detailData.nativePlaceString}}</div>
        </div>
        <div style="display:flex;justify-content:space-around;margin:20px 0 0 160px;">
          <div style="width:33.3%" class="hide">家庭人员数：{{detailData.familyNumber}}</div>
          <div style="width:33.3%" class="hide">身份证号码：{{ seeChange?credentialsNum:detailData.credentialsNum}} <span class="iconfont icon-eye" v-if="credentialsNum!=='无'" @click="seeChange = !seeChange"></span></div>
          <div style="width:33.3%" class="hide">人员类型：{{detailData.humanTypeString}}</div>
        </div>
      </div>
    </el-row>

    <el-row :gutter="20">
      <div class="info">
        <p class="title">登记信息</p>
        <div v-for="item in registeinfor" :key="item.id" style="padding:0 20px;">
          <p>{{item.id+'.'+item.title}}</p>
          <template v-if="item.topicName==='单选题'">
            <el-radio-group :value="parseInt(item.answer)">
              <span v-for="v in item.epiSelectEntityList" style="margin-right: 30px;" :key="v.id"><el-radio :label="v.id" disabled>{{v.content}}<input v-if="v.ifInput==='1'" type="text" class="content"  readonly></el-radio></span  >
            </el-radio-group>
          </template>
          <template v-if="item.topicName==='混答+多选'">
            <el-checkbox-group :value="item.answer.substring(0,item.answer.indexOf('#')).split(',').map(item => {  return +item;  })">
              <span v-for="v in item.epiSelectEntityList" style="margin-right: 20px;" :key="v.id"><el-checkbox :label="v.id" :key="v.id" disabled>{{v.content}}<input v-if="v.ifInput==='1'" :value="item.answer.substring(item.answer.indexOf('#')+2,item.answer.length).split(',')" type="text" class="content" readonly></el-checkbox></span>
            </el-checkbox-group>
          </template>
          <template v-if="item.topicName==='混答+单选'">
            <el-radio-group :value="parseInt(item.answer.split('##')[0])">
              <span v-for="v in item.epiSelectEntityList" :key="v.id" style="margin-right: 30px;"><el-radio :label="v.id" disabled>{{v.content}}<input v-if="v.ifInput==='1'" :value="item.answer.split('##')[1]" type="text" class="content" readonly></el-radio></span>
            </el-radio-group>
          </template>
          <template v-if="item.topicName==='简答-输入'">
            <input type="text" placeholder="选填" class="content" v-model="item.answer" readonly>
          </template>
          <template v-if="item.topicName==='简答-文本'">
            <el-input type="textarea" style="width:450px" resize="none" placeholder="选填" v-model="item.answer" readonly></el-input>
          </template>
        </div>
        <!-- <div>
          <p>2.你和你的家人是否有接触过疑似患者，接待过来自湖北的亲戚朋友，或者经过武汉</p>
          <div><el-radio v-model="problem2" label="1" disabled>是</el-radio></div>
          <el-radio v-model="problem2" label="2" disabled>否</el-radio>
        </div>
        <div>
          <p>3.您和您家人身体状况</p>
           <el-checkbox-group v-model="problem3">
            <div><el-checkbox :label="1" :key="1" disabled>自觉正常</el-checkbox></div>
            <div><el-checkbox :label="2" :key="2" disabled>发热</el-checkbox></div>
            <div><el-checkbox :label="3" :key="3" disabled>咳嗽</el-checkbox></div>
            <div><el-checkbox :label="4" :key="4" disabled>乏力</el-checkbox></div>
            <div><el-checkbox :label="5" :key="5" disabled>腹泻</el-checkbox></div>
            <div><el-checkbox :label="6" :key="6" disabled>感冒</el-checkbox></div>
            <div><el-checkbox :label="7" :key="7" disabled>头疼头晕</el-checkbox></div>
            <el-checkbox :label="8" :key="8" disabled>其他症状<input type="text" style="margin-left:10px;" readonly></el-checkbox>
          </el-checkbox-group>
        </div>
        <div>
          <p>4.您和您的家人是否有就诊住院</p>
          <el-radio-group v-model="problem4">
            <div><el-radio label="3" disabled>无</el-radio></div>
            <div><el-radio label="6" disabled>门诊</el-radio></div>
            <div><el-radio label="9" disabled>住院</el-radio></div>
            <el-radio label="12" disabled>其他</el-radio>
          </el-radio-group>
        </div>
        <div>
          <p>5.您和您的家人近半个月是否曾乘坐的跨市/省交通工具及相关信息</p>
          <div><el-radio v-model="problem5" label="1" disabled>是</el-radio><input type="text" v-model="trafficInfo" placeholder="请填写交通工具信息" style="margin-left:10px;" readonly></div>
          <div><el-radio v-model="problem5" label="2" disabled>否</el-radio></div>
          <span class="example">例如：火车1月15日G113北京上 广州南下 5号车厢 3F</span>
        </div>
        <div>
          <p>6.您和您的家人是否已复工</p>
          <div><el-radio v-model="problem6" label="1" disabled>是</el-radio></div>
          <el-radio v-model="problem6" label="2" disabled>否</el-radio>
        </div>
        <div>
          <p>7.您所在的企业、单位、是否有湖北（武汉）或其他疫情严重地区返工人员</p>
          <div><el-radio v-model="problem7" label="1" disabled>是</el-radio></div>
          <el-radio v-model="problem7" label="2" disabled>否</el-radio>
        </div>
        <div>
          <p>8.您所在的企业、单位、是否有疑似或确诊病例</p>
          <div><el-radio v-model="problem8" label="1" disabled>是</el-radio></div>
          <el-radio v-model="problem8" label="2" disabled>否</el-radio>
        </div>
        <div>
          <p>9.企业单位名称</p>
          <input type="text" placeholder="选填" v-model="registeinfor[8].answer" readonly>
        </div>
        <div>
          <p>10.企业单位联系方式</p>
          <input type="text" placeholder="选填" v-model="registeinfor[9].answer" readonly>
        </div>
        <div>
          <p>11.您想告诉我们的其他事项（疫情防控人人有责）</p>
          <el-input type="textarea" style="width:450px" resize="none" placeholder="选填" v-model="registeinfor[10].answer" readonly></el-input>
        </div> -->
      </div>
    </el-row>
  </div>
</template>

<script>
  export default {
    name:'HiddenDanger-add-or-update',
    data() {
      return {
        detailData: {},//详情数据
        registeinfor: [],//登记信息
        problem3: [],
        problem4: '3',
        problem5: '1',
        trafficInfo: '',//交通信息
        credentialsNum: '',//隐藏的身份证
        seeChange: true, // 身份证开关
      }
    },
    created(){
      // alert(this.$route.query.HiddenDangerId)
      this.$http({
        url: this.$http.adornUrl('/epi/epiRegister/getOneAndLink'),
        method: 'get',
        params: this.$http.adornParams({
          id: this.$route.query.HiddenDangerId
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          var trafficInfo = []//存放交通信息
          this.detailData = data.data
          let credentialsNum = this.detailData.credentialsNum
          this.credentialsNum = credentialsNum?credentialsNum.substring(0,3)+'****'+credentialsNum.substring(credentialsNum.length-4,credentialsNum.length):''
          this.registeinfor = data.data.epiRegisterTikuEntity.epiQuestionEntityList
          this.detailData.investigateResultString = this.detailData.investigateResultString==='正常'?'正常':(this.detailData.investigateResultString==='异常'?'有隐患':'')
          this.detailData.humanType = this.detailData.humanType==='1'?'本地常驻':(this.detailData.humanType==='2'?'外地返回':'')
          this.problem1 = parseInt(this.registeinfor[0].answer)
          this.problem2 = parseInt(this.registeinfor[1].answer)
          this.problem6 = parseInt(this.registeinfor[5].answer)
          this.problem7 = parseInt(this.registeinfor[6].answer)
          this.problem8 = parseInt(this.registeinfor[7].answer)
          if (this.registeinfor[4].answer) {
            if(this.registeinfor[4].answer==='否'){
              this.problem5 = '2'
            }else{
              trafficInfo = this.registeinfor[4].answer.split('，')
              this.problem5 = '1'
              this.trafficInfo = trafficInfo[1]
            }
          }else {
            this.problem5 = ''
            this.trafficInfo = ''
          }
        } else {
          this.detailData = {}
          this.registeinfor = []
          trafficInfo = []
          this.$message.error(data.msg);
        }
      })
    },
  }
</script>

<style lang="scss" scoped>
.HiddenDanger{
  .hide{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  // padding: 0 20px;
  .thetitle {
    text-align: center;
    font-size: 24px;
    margin: 15px auto;
    color: #000;
    font-weight: bold;
  }
  .info{
    // padding: 10px;
    margin-bottom: 20px;
    font-size: 14px;
    
    .title{
      font-weight: bold;
      font-size: 14px;
      color: #333333;
      letter-spacing: 3px;
      background-color: #F0F5FF;
      height:40px;
      line-height: 40px;
      &::before{
        content: '';
        display: inline-block;
        width: 5px;
        height: 20px;
        background-color: #3F92FE;
        margin: 0 20px;
        vertical-align: text-bottom;
      }
    }
    .example{
      color: #c0c0c0;
    }
  }
  .content{
    width:250px;
    height:35px;
    margin-left:10px;
    outline: none;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding-left: 10px;
  }
  /deep/ .el-radio__input.is-disabled+span.el-radio__label{
    color: black;
  }
  /deep/ .el-radio__input.is-checked .el-radio__inner{
    border-color: #1DAAF6;
    background: #1DAAF6;
  }
  /deep/ .el-radio__input.is-checked+.el-radio__label{
    color: #1DAAF6 !important;
  }
  /deep/ .el-checkbox__input.is-disabled+span.el-checkbox__label{
    color: black;
  }
  /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    border-color: #1DAAF6;
    background: #1DAAF6;
  }
  /deep/ .el-checkbox__input.is-checked+.el-checkbox__label{
    color: #1DAAF6 !important;
  }
}
</style>