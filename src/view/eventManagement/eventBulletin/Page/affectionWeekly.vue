<!--@author：yf-->
<template>
    <div>
      <el-header class="navsBar" style="height: 80px">
          <el-col :span="12" style="text-align: left">
            <el-date-picker
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              v-model="valueTime"
              type="date">
            </el-date-picker>
            <el-button type="primary" size="medium" @click="queryBytime">更新快报</el-button>
          </el-col>
      </el-header>
      <el-main style="padding: 20px 30px;" >
        <el-row>
          <el-col :span="12" class="background" :style="affctionStyle" style="min-height:600px">
            <el-col :span="24">
              <my-table style="padding: 0 10px" :tableColumn="tableColumn" :tableData="tableData" @handleCurrentChange="handleCurrentChange"></my-table>
                <el-pagination style="padding-top: 20px" :small="pagingSize"  :page-size="pageSize"  :total="total"
                               :current-page="currentPage"  @size-change="handleSizeChange" @current-change="pageMode"
                               layout="total,prev,pager,next,sizes,jumper"></el-pagination>
            </el-col>
          </el-col>
          <el-col :span="12" v-if="refreshAffction">
            <div class="background" style="margin-left: 30px;min-height: 600px" :style="affctionStyle">
              <div style="height: 550px">
                <div v-if="show" >
                  <div class="topPlan">
                    <div class="specificTitle">{{specificTitle}}</div>
                    <div class="specificTime">{{specificTime}}</div>
                    <div class="specificPeriods">{{specificPeriods}}</div>
                  </div>

                  <div class="bottomPlan">
                    <div class="specificEvent">{{specificEvent}}</div>
                    <div>
                      <div class="contentMatter" >
                        <div v-for="(item,index) in contentMatter" style="width: 100%;padding: 10px 0;text-align: left" :key="index">
                          <span v-if="item.split('-').length == 3" style="font-weight: bold;font-size: 18px">{{item}}</span>
                          <span v-else style="display: inline-block;width: 100%;text-indent: 20px">{{item}}</span>

                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <div class="addButton">
                <el-button type="primary" size="small" @click="sendFaxAffction">发送传真</el-button>
                <el-button type="primary" size="small" @click="affectionSendApp">发送到APP</el-button>
                <el-button type="primary" size="small" v-print="'#showAffction'" :disabled="showAffctionButton">打印</el-button>
                <el-button type="primary" size="small" @click="expWord">导出Word</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>

      <div id="showAffction" style="position: absolute;left: 0;top: 0;z-index: -99999999">
        <div style="width: 700px">
          <div>
            <div class="specificTitle">{{printSpecificTitle}}</div>
            <div class="specificTime">{{printSpecificTime}}</div>
            <div class="specificPeriods">{{printSpecificPeriods}}</div>
          </div>

          <div>
            <div class="specificEvent">{{printSpecificEvent}}</div>
            <div>
              <div  >
                <div v-for="(item,index) in contentMatter" style="width: 100%;padding: 10px 0;text-align: left" :key="index">
                  <span v-if="item.split('-').length == 3" style="font-weight: bold;font-size: 18px">{{item}}</span>
                  <span v-else style="display: inline-block;width: 100%;text-indent: 20px">{{item}}</span>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <affection-table ref="searchTable"
                       :selectTitle="affectionData" :selectData="affectionDialog"
                       @closeDialog="affectionCloseDialog"
                       @confirm="affectionConfirm"
                       @close="affectionClose"
      >

      </affection-table>
    </div>
</template>

<script>
    // import Tree from "@/view/dutyManagement/treePlan/treePlan"
    import myTable from "@/components/tables/tables"
    import affectionTable from "../searchTable"
    import {Url} from '@/assets/js/common'
    const downLoadFile = require('@/utils/downloadFile.js').default;

    export default {
        name: "affectionWeekly",
        components:{
          // Tree,
          myTable,
          affectionTable
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
            ],//表头数据
            total: 0,//数据总数
            pageSize: 10,//总页数
            currentPage: 1,//当前页数1
            pagingSize:false,  //分页大小
            tableData:[],//表格数据
            specificTitle:'一周值班要情',//要情标题
            specificTime:'',//要情时间
            specificPeriods:'',//要情期数
            specificEvent:'',//要情事件
            contentMatter:'',//具体内容情况
            show:false,

            affid:'',//周报ID
            affectionData:'',//app弹窗标题
            affectionDialog:false,//app弹窗

            printSpecificTitle:'一周值班要情',//打印的内容
            printSpecificTime:'',
            printSpecificPeriods:'',
            printSpecificEvent:'',
            printContentMatter:'',
            showAffctionButton:true,//打印按钮

            pathname:'/icpPhone',

            refreshAffction:true,//强制刷新

            affctionStyle:{
              height:''
            }
          }
        },
        watch:{
          specificTime:{
            handler(newV){
              this.printSpecificTime=newV
            },
            deep:true
          },
          specificPeriods:{
            handler(newV){
              this.printSpecificPeriods=newV
            },
            deep:true
          },
          specificEvent:{
            handler(newV){
              this.printSpecificEvent=newV
            },
            deep:true
          },
          contentMatter:{
            handler(newV){
              this.printContentMatter=newV
            },
            deep:true
          }
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
            this.affctionStyle.height = h - (68 + 240) + 'px'
          },
          sendFaxAffction(){//发送传真
            if (this.affid == '' || this.affid == undefined || this.affid == null) {
              this.$message({
                message: '请优先选择周报再进行发送传真',
                type: 'warning'
              });
            }else {
              this.$confirm('该操作将下载【一周值班要情】的文件,然后跳转至【传真模块】', '提示', {
                confirmButtonText: '知道了',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                window.location.href = `${Url}/eos/event/bullitin/exportWeekPdf?id=${this.affid}`
                this.$router.push({
                  path:this.pathname
                });
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消发送传真'
                });
              });
            }
          },
          /**
           * @lastEditor 2020-11-9
           * @lastDate 2020-11-9
           * @description 导出word
           */
          expWord(){//导出word
            if (this.affid == '' || this.affid == undefined || this.affid == null) {
              this.$message({
                message: '请优先选择日报期号',
                type: 'warning'
              });
              return
            }
            const request = {
              method: 'post',
              url: `/eos/event/bullitin/exportWeekWord?id=${this.affid}`,
              baseURL: window.g.ApiUrl,
              headers: {
                token: this.$cookie.get('token'),
              },
              responseType: 'arraybuffer',
            };
            downLoadFile(request);
            // 注释原因：导出文件接口要加token
            // this.$api.verification().then(() => {
            //   // 只有登录没失效的才会导出word bug7722 author hexinting date 2020-11-9
            //   window.location.href= Url +`/eos/event/bullitin/exportWeekWord?id=${this.affid}`
            // })
            // .catch(err => {
            //   // 网络请求错误 或者 登录失效的信息都在这捕获
            //   console.log(err)
            // })
          },
          getTableData(){//获取表格数据;
            let data={
              size:this.pageSize,
              page:this.currentPage
            };
            this.$api.findByWeek(data).then((res) => {
              if(res.errorcode==0){
                this.tableData=res.data.data;
                this.total=res.data.totalElements
              }
            })
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
              this.$api.updateWeek(data).then((res) => {
                if(res.errorcode==0){
                  this.$message({
                    message: this.valueTime+"日报更新成功!",
                    type: 'success'
                  });
                  this.getTableData()
                }else {
                  this.$message.error(res.msg)
                }
              })
            }

          },
          handleSizeChange(val){//监听每页数量
            this.pageSize=val;
            this.affid=''
            this.currentPage=1
            this.refreshAffction=false;
            this.$nextTick(()=>{
              this.refreshAffction=true;
            })
            this.getTableData();
          },
          pageMode(val){//监听是第几页
            this.currentPage=val;
            this.affid=''
            this.refreshAffction=false;
            this.$nextTick(()=>{
              this.refreshAffction=true;
            })
            this.getTableData();
          },
          handleCurrentChange(row){//表格点击
            console.log(row);
            this.show=true;
              let tableRowData=[];
              this.affid=row.id;
              tableRowData=JSON.parse(row.json);
              console.log(tableRowData.dt_time);
              this.specificTime=tableRowData.dt_time;
              this.specificPeriods=tableRowData.vc_number;
              this.specificEvent=tableRowData.outburstCount;
              const eventList=tableRowData.OutburstEventList;
              this.contentMatter=eventList
              this.showAffctionButton=false
          },
          numberFormatter:function(row){//修改表格达到预期数据形式
            return "第 " + row.number +" 期";
          },
          affectionSendApp(){//发送到APP
            if(this.affid==''||this.affid==null||this.affid==undefined){
              this.$message({
                message: '请优先选择期号!',
                type: 'warning'
              });
              return
            }
            this.affectionData='选择联系人';
            this.$refs.searchTable.info();
            this.affectionDialog=true;
          },
          affectionCloseDialog(){//弹窗取消
            this.affectionDialog=false;
          },
          affectionConfirm(multipleSelection){//弹窗确定
            if(multipleSelection==''||multipleSelection==null||multipleSelection==undefined){
              this.$message({
                message: '选项不能为空!',
                type: 'warning'
              });
              return
            }
            let data={
              id:this.affid,
              contacters:multipleSelection
            };
            this.$api.sendApp(data).then((res) => {
              if(res.errorcode==0){
                this.$message({
                  message: '发送成功!',
                  type: 'success'
                });
                this.affectionDialog=false;
              }else {
                //this.$message.error(res.msg)
              }
            })
          },
          affectionClose(){//弹窗叉叉
            this.affectionDialog=false;
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
    body
    {
      display: inherit; /*设置为none，则打印空白，即不能打印*/
    }
    header {
      display: none;
    }

    footer {
      display: none;
    }
    .specificTitle{
      color: red;
      font-family: '华文宋体';
      font-size: 40px;
      width: 100%;
      text-align: center;
      padding: 10px 0;
      font-weight: bold;
    }
    .specificTime,.specificPeriods{
      font-size: 22px;
      width: 100%;
      text-align: center;
    }
    .specificEvent{
      font-size: 28px;
      font-weight: bold;
      width:95%;
      padding: 20px 0;
      text-align: left;
      margin: 0 auto;
    }
    #showAffction >>> .el-textarea__inner {
      border: none;
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
  .topPlan{}
  .bottomPlan{}
  .specificTitle{
    color: red;
    width: 100%;
    text-align: center;
    padding: 10px 0;
    font-weight: bold;
    font-family: '华文宋体';
    font-size: 40px;
  }
  .specificTime{
    font-size: 22px;

  }
  .specificPeriods{
    font-size: 22px;
  }
  .specificEvent{
    font-size: 28px;
    font-weight: bold;
    width:95%;
    padding: 20px 0;
    text-align: left;
    margin: 0 auto;
  }

  .contentMatter{
    border: none ;
    padding: 0 20px;
    font-size: 16px;
    font-family: SimHei;
    overflow-y:auto ;
    height: 350px;
  }
</style>
