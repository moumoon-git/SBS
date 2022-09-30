<!--@author：yf-->
<template>
  <div>
    <el-header class="navsBar" style="height: 80px">
      <el-col :span="12" style="text-align: left">
        <el-date-picker
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择日期"
          v-model="valueTime"
          type="month">
        </el-date-picker>
        <el-button type="primary" size="medium" @click="queryBytime">更新快报</el-button>
      </el-col>
    </el-header>
    <el-main style="padding: 20px 30px">
      <el-row >
        <el-col :span="12"  class="background" style="min-height: 600px" :style="monthlyStyle">
          <el-col :span="24">
            <my-table style="padding: 0 10px" :tableColumn="tableColumn" :tableData="tableData" @handleCurrentChange="handleCurrentChange"></my-table>
            <el-pagination :small="pagingSize"  :page-size="pageSize"  :total="total"
                           :current-page="currentPage" @size-change="handleSizeChange" @current-change="pageMode"
                           layout="total, prev, pager, next,jumper"></el-pagination>
          </el-col>
        </el-col>
        <el-col :span="12" >
          <div style="margin-left: 30px;min-height: 600px" class="background" v-if="refreshMonthly" :style="monthlyStyle">
            <div  >
              <el-header style="height: 120px;padding-top: 10px">
                <h2>{{titleEvnet}}</h2>
                <div class="datePosition">
                  第
                  <span class="spanClass">
                    <el-input :disabled="false" v-model="number"></el-input>
                  </span>
                  期
                  <div class="dateAbsolutes">
                    <el-date-picker
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      v-model="amendDate"
                      type="date"
                      placeholder="修改日期">
                    </el-date-picker>
                  </div>
                </div>
              </el-header>
              <el-main style="padding: 20px;width:100%;overflow-y: auto;height: 400px">
                <div >
                  <el-form label-width="80px" :model="ruleForm" :rules="rules" ref="form" @submit.native.prevent  label-position="left">
                    <el-row :gutter="gutter">
                      <el-col :span="24">
                        <el-form-item label="综述:">
                          <el-input type="text"  v-model.trim="ruleForm.summarize" show-word-limit></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="gutter">
                      <el-col :span="24">
                        <el-form-item label="总体情况:">
                          <el-input type="textarea"  :autosize="{ minRows:5, maxRows: 5}"
                                    v-model.trim="ruleForm.overallSituation" show-word-limit></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="gutter">
                      <el-col :span="24">
                        <el-form-item label="情况分析:">
                          <el-input type="textarea"  :autosize="{ minRows:5, maxRows: 5}"
                                    v-model.trim="ruleForm.situationAnalysis" show-word-limit></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="gutter">
                      <el-col :span="24">
                        <el-form-item label="工作建议:">
                          <el-input type="textarea"  :autosize="{ minRows:5, maxRows: 5}"
                                    v-model.trim="ruleForm.workProposal" show-word-limit></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="gutter">
                      <el-col :span="24">
                        <el-form-item label="报送情况:">
                          <el-input type="textarea"  :autosize="{ minRows:5, maxRows: 5}"
                                    v-model.trim="ruleForm.submitTheCase" show-word-limit></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="gutter">
                      <el-col :span="12">
                        <el-form-item label="核搞:">
                          <el-input type="text"
                                    v-model.trim="ruleForm.nuclearDraft" show-word-limit></el-input>
                        </el-form-item>
                      </el-col>

                      <el-col :span="12">
                        <el-form-item label="签发人:">
                          <el-input type="text"
                                    v-model.trim="ruleForm.signAndIssue" show-word-limit></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
              </el-main>
              <div class="addButton">
                <el-button type="primary" size="small" @click="saveData" :disabled="saveShowMonthly">保存</el-button>
                <el-button type="primary" size="small" @click="expMonthlyPdf">导出PDF</el-button>
                <el-button type="primary" size="small" @click="monthlySendApp">发送到APP</el-button>
                <el-button type="primary" size="small" v-print="'#showMonthly'" :disabled="showMonthlyButton">打印</el-button>
                <el-button type="primary" size="small" @click="expMonthWord">导出Word</el-button>
              </div>

            </div>
          </div>
        </el-col>
      </el-row>
    </el-main>
    <monthiy-table ref="searchTable"
                   :selectTitle="monthlyData" :selectData="monthlyDialog"
                   @closeDialog="monthlyCloseDialog"
                   @confirm="monthlyConfirm"
                   @close="amonthlyClose"
    >

    </monthiy-table>
    <div id="showMonthly" style="position: absolute;left: 0;top: 0;z-index: -999;">
      <div style="width: 800px;margin: 0 20px">
        <div style="height: 120px;padding-top: 10px">
          <h2 style="text-align: center">{{printTitleEvnet}}</h2>
          <div style="position: relative;width: 100%">
            <div style="position: absolute;left: 50%;width: 100px;margin-left: -50px">
              第 {{printNumber}} 期
            </div>
            <div  style="text-align: right;">
              {{printAmendDate}}
            </div>
          </div>
        </div>
        <el-main style="padding: 20px 0;width:100%;overflow-y: auto;">
          <div >
            <el-form label-width="80px"   @submit.native.prevent  label-position="left">
              <el-row :gutter="gutter">
                <el-col :span="24">
                  <el-form-item label="综述:">
                    <el-input type="text"  v-model.trim="printSummarize" show-word-limit
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="gutter">
                <el-col :span="24">
                  <el-form-item label="总体情况:">
                    <el-input type="textarea"  :autosize="{ minRows:5}" resize="none"
                              v-model.trim="printOverallSituation" show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="gutter">
                <el-col :span="24">
                  <el-form-item label="情况分析:">
                    <el-input type="textarea"  :autosize="{ minRows:5}" resize="none"
                              v-model.trim="printSituationAnalysis" show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="gutter">
                <el-col :span="24">
                  <el-form-item label="工作建议:">
                    <el-input type="textarea"  :autosize="{ minRows:5}" resize="none"
                              v-model.trim="printWorkProposal" show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="gutter">
                <el-col :span="24">
                  <el-form-item label="报送情况:">
                    <el-input type="textarea"  :autosize="{ minRows:5}" resize="none"
                              v-model.trim="printSubmitTheCase" show-word-limit></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="gutter">
                <el-col :span="24">
                  <el-form-item label="核搞:">
                    <el-input type="textarea"  :autosize="{ minRows:2}" resize="none"
                              v-model.trim="printNuclearDraft" show-word-limit></el-input>
<!--                    <div class="printClass">{{}}</div>-->
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="gutter">
                <el-col :span="24">
                  <el-form-item label="签发人:">
                    <el-input type="textarea"  :autosize="{ minRows:2}" resize="none"
                              v-model.trim="printSignAndIssue" show-word-limit></el-input>
<!--                    <div class="printClass">{{printSignAndIssue}}</div>-->
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-main>
      </div>

    </div>

  </div>
</template>

<script>
  // import Tree from "@/view/dutyManagement/treePlan/treePlan"
  import myTable from "@/components/tables/tables"
  import monthiyTable from "../searchTable"
  import {Url} from '@/assets/js/common'
  const downLoadFile = require('@/utils/downloadFile.js').default;

  export default {
    name: "monthly",
    components:{
      // Tree,
      myTable,
      monthiyTable
    },
    data(){
      return{
        valueTime:'',
        tableColumn: [
          {
            prop: "number",
            label: "期号",
            formatter:this.numberFormatter
          },
          {
            prop: "time",
            label: "发行时间"
          },
        ],//表头
        tableData: [],//表格数据
        tableRowData:[],//行数据
        total: 0,//数据总数
        pageSize: 10,//总页数
        currentPage: 1,//当前页数
        pagingSize:true,  //分页大小
        number:'',//第几期
        titleEvnet:'应急管理简报',//title
        amendDate:'',//修改日期
        gutter:24,
        id:'',//月报ID
        ruleForm:{
          summarize:'',
          overallSituation:'',
          situationAnalysis:'',
          workProposal:'',
          submitTheCase:'',
          nuclearDraft:'',
          signAndIssue:''
        },//表单
        rules:{

        },//表单验证

        monthlyData:'',//标题
        monthlyDialog:false,//弹窗

        printTitleEvnet:'应急管理简报',//打印内容
        printNumber:'',
        printAmendDate:'',
        printSummarize:'',
        printOverallSituation:'',
        printSituationAnalysis:'',
        printWorkProposal:'',
        printSubmitTheCase:'',
        printNuclearDraft:'',
        printSignAndIssue:'',
        showMonthlyButton:true,//打印按钮

        saveShowMonthly:false,

        refreshMonthly:true,//强制刷新

        monthlyStyle:{
          height:''
        }
      }
    },
    watch:{
      number:{
        handler(newV){
          this.printNumber=newV
        },
        deep:true
      },
      amendDate:{
        handler(newV){
          this.printAmendDate=newV
        },
        deep:true
      },
      ruleForm:{
        handler(newV){
          this.printSummarize=newV.summarize
          this.printOverallSituation=newV.overallSituation
          this.printSituationAnalysis=newV.situationAnalysis
          this.printWorkProposal=newV.workProposal
          this.printSubmitTheCase=newV.submitTheCase
          this.printNuclearDraft=newV.nuclearDraft
          this.printSignAndIssue=newV.signAndIssue
        },
        deep:true
      },
    },
    mounted(){
      this.getTableData();
    },
    created(){
      window.addEventListener('resize', this.getHeight);
      this.getHeight()
    },
    destroyed(){
      window.removeEventListener('resize', this.getHeight)
    },
    methods:{
      getHeight(){
        let h = document.documentElement.clientHeight || document.body.clientHeight
        this.monthlyStyle.height = h - (68 + 240) + 'px'
      },
      expMonthlyPdf(){//导出PDF
        console.log(this.amendDate,this.printAmendDate);
        // this.getPdf('#showMonthly',`应急管理简报${this.printNumber==undefined||null?'':`-第${this.printNumber}期`}`)
        if(this.id==''||this.id==null){
          this.$message({
            message: '请优先选择月报期号',
            type: 'warning'
          });
          return
        }
        // window.location.href=`${Url}/eos/event/bullitin/exportMonthPdf?id=${this.id}`
        const request = {
          method: 'get',
          url: `/eos/event/bullitin/exportMonthPdf?id=${this.id}`,
          baseURL: window.g.ApiUrl,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            token: this.$cookie.get('token'),
          },
          responseType: 'arraybuffer',
        };
        downLoadFile(request);
      },
      /**
       * @lastEditor 2020-11-9
       * @lastDate 2020-11-9
       * @description 导出word
       */
      expMonthWord(){//导出word
        if(this.id==''||this.id==null){
          this.$message({
            message: '请优先选择月报期号',
            type: 'warning'
          });
          return
        }
        const request = {
          method: 'get',
          url: `/eos/event/bullitin/exportMonthWorld?id=${this.id}`,
          baseURL: window.g.ApiUrl,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            token: this.$cookie.get('token'),
          },
          responseType: 'arraybuffer',
        };
        downLoadFile(request);
        // this.$api.verification().then(() => {
        //   // 只有登录没失效的才会导出word bug7722 author hexinting date 2020-11-9
        //   window.location.href= Url +`/eos/event/bullitin/exportMonthWorld?id=${this.id}`
        // })
        // .catch(err => {
        //   // 网络请求错误 或者 登录失效的信息都在这捕获
        //   console.log(err)
        // })
      },
      saveData(){//保存月报
        if(this.tableRowData==[]||this.tableRowData==''||this.tableRowData==null){
          this.$message({
            message: "请优先选择月报期号!",
            type: 'warning'
          });
          return
        }
        this.saveShowMonthly=true;
        setTimeout(()=>{
          this.saveShowMonthly=false
        },3000);
        let json={
          flag:this.tableRowData.flag,
          vc_bullitin_id:this.tableRowData.vc_bullitin_id,
          vc_number:this.number,
          vc_sign_time:this.amendDate,
          vc_review:this.ruleForm.summarize,
          vc_reviewInformation:this.ruleForm.overallSituation,
          vc_situationAnalysis:this.ruleForm.situationAnalysis,
          vc_workProposal:this.ruleForm.workProposal,
          vc_submitInformation:this.ruleForm.submitTheCase,
          vc_nuclearDraft:this.ruleForm.nuclearDraft,
          vc_sign_man:this.ruleForm.signAndIssue,
        }
        let data={
          id:this.id,
          json:JSON.stringify(json)
        };
        console.log(data.json);
        this.$api.saveEventDay(data).then((res) => {
          if(res.errorcode==0){
            if(res.msg=='SUCCESS'){
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.getTableData();
            }

          }
        })
      },
      getTableData(){//获取月报表格数据
        let data={
          size:this.pageSize,
          page:this.currentPage
        };
        this.$api.findByMonth(data).then((res) => {
          if(res.errorcode==0){
            this.tableData=res.data.data;
            this.total=res.data.totalElements
          }
        })
      },
      handleCurrentChange(row){//表格点击
        console.log(row);
        this.id=row.id;
        this.showMonthlyButton=false;
        this.tableRowData=JSON.parse(row.json);
        this.number=this.tableRowData.vc_number;
        this.ruleForm.summarize=this.tableRowData.vc_review;
        this.ruleForm.overallSituation=this.tableRowData.vc_reviewInformation;
        this.ruleForm.situationAnalysis=this.tableRowData.vc_situationAnalysis
        this.ruleForm.workProposal=this.tableRowData.vc_workProposal;
        this.ruleForm.submitTheCase=this.tableRowData.vc_submitInformation;
        this.ruleForm.nuclearDraft=this.tableRowData.vc_nuclearDraft;
        this.ruleForm.signAndIssue=this.tableRowData.vc_sign_man;
        let dateTime=this.tableRowData.vc_sign_time;
        dateTime = dateTime.replace('年',"-");
        dateTime = dateTime.replace('月',"-")
        dateTime = dateTime.replace('日',"")
        this.amendDate=dateTime;
      },
      queryBytime(){ //按时间查询更新快报
        if(this.valueTime==''||this.valueTime==null){
          this.$message({
            message: "请选择日期!",
            type: 'warning'
          });
        }else {
          this.currentPage=1
          let data={
            date:this.valueTime
          };
          this.$api.updateMonth(data).then((res) => {
            if(res.errorcode==0){
              this.getTableData();
              this.$message({
                message: this.valueTime+"日报更新成功!",
                type: 'success'
              });
            }else {
              //this.$message.error(res.msg)
            }
          })
        }


      },
      handleSizeChange(val){//监听每页数量
        this.currentPage=1
        this.id='';
        this.tableRowData=[];
        this.number='';
        this.amendDate='';
        this.refreshMonthly=false;
        this.$nextTick(()=>{
          this.refreshMonthly=true;
        })
        this.pageSize=val;
        this.getTableData();
      },
      pageMode(val){//监听是第几页
        this.id='';
        this.tableRowData=[];
        this.number='';
        this.amendDate='';
        this.refreshMonthly=false;
        this.$nextTick(()=>{
          this.refreshMonthly=true;
        })
        this.currentPage=val;
        this.getTableData();
      },
      numberFormatter:function(row){//修改表格达到预期数据形式
        return "第 " + row.number +" 期";
      },

      monthlySendApp(){//发送到APP
        if(this.id==''||this.id==null||this.id==undefined){
          this.$message({
            message: '请优先选择期号!',
            type: 'warning'
          });
          return
        }
        this.monthlyData='选择联系人';
        this.$refs.searchTable.info();
        this.monthlyDialog=true;
      },
      monthlyCloseDialog(){//取消
        this.monthlyDialog=false;
      },
      monthlyConfirm(multipleSelection){//确认
        if(multipleSelection==''||multipleSelection==null||multipleSelection==undefined){
          this.$message({
            message: '选项不能为空!',
            type: 'warning'
          });
          return
        }
        let data={
          id:this.id,
          contacters:multipleSelection
        };
        this.$api.sendApp(data).then((res) => {
          if(res.errorcode==0){
            this.$message({
              message: '发送成功!',
              type: 'success'
            });
            this.monthlyDialog=false;
          }else {
            //this.$message.error(res.msg)
          }
        });
      },
      amonthlyClose(){//叉叉
        this.monthlyDialog=false;
      }

    }
  }
</script>

<style scoped>
  @page {
    size: a4;
    margin: 0cm 1cm 0cm 1cm
  }
  @media print {
    body {
      display: inherit; /*设置为none，则打印空白，即不能打印*/
    }
    header {
      display: none;
    }

    footer {
      display: none;
    }
    .spanClass{
      display: inline-block;
      width: 60px
    }
    .spanClass >>>.el-input__inner{
      height: 30px;
      line-height: 30px;
    }
    .datePosition{
      position: relative;
    }
    .dateAbsolutes{
      position: absolute;
      top: 0;
      right: 0;
      margin-right: -85px;
    }
    .datePosition>>>.el-input--prefix .el-input__inner{
      height: 30px;
      line-height: 30px;
    }
    .datePosition>>>.el-input__icon{
      line-height: 30px;
    }
    .printClass{
      border: 1px solid #ddd;
      color: #ddd;
      padding:20px 10px;
    }
  }
  .navsBar {
    margin: 0 30px;
    background-color: white;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border:1px solid rgba(219, 219, 219, 1);
    border-radius:3px;
  }
  .background{
    background-color: white;
    height: 700px;
  }
  .addButton {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: left;
    text-indent: 20px;
  }
  .spanClass{
    display: inline-block;
    width: 60px
  }
  .spanClass >>>.el-input__inner{
    height: 30px;
    line-height: 30px;
  }
  .datePosition{
    position: relative;
  }
  .dateAbsolutes{
    /*width: 400px;*/
    position: absolute;
    top: 0;
    right: 0;
    /*margin-right: -85px;*/
  }
  .datePosition>>>.el-input--prefix .el-input__inner{
    height: 30px;
    line-height: 30px;
  }
  .datePosition>>>.el-input__icon{
    line-height: 30px;
  }
</style>
