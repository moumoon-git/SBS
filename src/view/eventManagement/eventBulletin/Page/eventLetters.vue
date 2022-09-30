<!--@author：yf-->
<template>
    <el-container>
      <el-main style="padding: 0 30px 0 30px">
        <el-header class="navsBar" style="height: 80px">
            <el-col :span="24">
              <el-col :span="12" style="text-align: left">
                <el-date-picker
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  v-model="value"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">

                </el-date-picker>
              </el-col>
              <el-col :span="12">
                <el-col :span="24">
                  <div style="display: flex">
                    <div style="flex: 1">
                      <el-input
                        clearable
                        placeholder="输入标题"
                        prefix-icon="el-icon-search"
                        v-model="searchInput">
                      </el-input>
                    </div>
                    <div style="flex: 1;text-align: left;text-indent: 10px">
                      <el-button type="primary" size="medium" @click="searchData">查找</el-button>
                    </div>
                  </div>

                </el-col>
              </el-col>

            </el-col>
        </el-header>
        <el-row :style="styleBulletin" class="contentStyle" style="min-height: 600px;">

            <el-col :span="12">
              <div class="tableContainer"  >
                <my-table
                  style="max-height: 650px;overflow-y: auto"
                  :tableColumn="tableColumn" :tableData="tableData"
                  @handleCurrentChange="handleCurrentChange"
                ></my-table>
                <el-pagination :small="pagingSize"  :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"
                               :current-page="currentPage"
                               @size-change="handleSizeChange" @current-change="pageMode"
                               layout="total,prev,pager,next,sizes,jumper"></el-pagination>
              </div>
            </el-col>

            <el-col :span="12">
              <nav-bar :selectedName="selectedName" :navBarList="navBarList"  class="narBar" @changTab="changTab"></nav-bar>

                <div v-if="forceRefresh" :style="rightStyle" >
                  <el-scrollbar style="height: 100%">
                    <historical-details v-show="selectedName=='事件快报'"  @getReceive="getReceive"
                                        @getEventHistorical="getEventHistorical" ref="historicalDetails"></historical-details>
                    <express-the-details v-show="selectedName=='快报历史'" ref="expressTheDetails"></express-the-details>
                  </el-scrollbar>
                </div>

            </el-col>

        </el-row>
      </el-main>
    </el-container>
</template>

<script>
    import navBar from "@/view/eventManagement/eventReports/Page/criminalHistory/navbar"
    import historicalDetails from "@/view/eventManagement/eventBulletin/Page/historicalDetails"
    import expressTheDetails from "@/view/eventManagement/eventBulletin/Page/expressTheDetails"
    import myTable from "@/components/tables/tables"
    export default {
        name: "eventLetters",
        components:{
          navBar,
          myTable,
          historicalDetails,
          expressTheDetails
        },
        data(){
          return{
            gutter:20,
            value:'', //时间
            searchInput:'', //搜索
            selectedName: "事件快报",//默认选中导航条
            navBarList: [
              {
                name: "事件快报"
              }, {
                name: "快报历史"
              }
            ] ,//导航条模块
            tableColumn: [
              {
                prop: "eventCode",
                label: "事件编号"
              }, {
                prop: "title",
                label: "事件标题"
              }, {
                prop: "caseClass",
                label: "事件类型"
              }, {
                prop: "occurTime",
                label: "事发时间"
              }
              , {
                prop: "status",
                label: "事件状态"
              }
              , {
                prop: "reportTime",
                label: "接报时间"
              }
              , {
                prop: "receiveOperator",
                label: "接报人"
              }],//表头
            tableData: [],//表格数据
            total: 0,//数据总数
            pageSize: 10,//总页数
            currentPage: 1,//当前页数
            pagingSize:true,  //分页大小

            rowData:[],

            searchJt:'',//解决分页bug

            forceRefresh:true,//强制刷新
            styleBulletin:{
              height:''
            },
            rightStyle:{
              height:''
            }
          }
        },
        watch:{
          searchJt:{
            handler(newV,oldV){
              if(newV!==oldV){
                this.currentPage=1
              }
            }
          }
        },
        mounted(){
          this.getEventHistorical();
        },
        created(){
          window.addEventListener('resize', this.getHeight);
          this.getHeight()
        },
        destroyed(){
          window.removeEventListener('resize', this.getHeight)
        },
        methods:{
          changTab(tabName){
            return this.selectedName=tabName;
          },
          getEventHistorical(){//获取事件历史
            let data={
              size:this.pageSize,
              page:this.currentPage,
            };
            this.$api.eventInformationHistory(data).then((res) => {
              if(res.errorcode==0){
               this.tableData=res.data.data;
               this.total=res.data.totalElements
              }
            })
          },
          searchData(){//查找数据
            this.currentPage=1;
            this.searchJt=this.searchInput;
            let timeValue=[];
            if(this.value==''||this.value==null){
              timeValue.push({sta:null,end:null})
            }else {
              timeValue.push(
                {
                  sta:this.value[0],
                  end:this.value[1]
                })
            }
            let data={
              size:this.pageSize,
              page:this.currentPage,
              name: this.searchJt,
              beginTime:timeValue[0].sta,
              endTime:timeValue[0].end
            };
            this.$api.eventInformationHistory(data).then((res) => {
              if(res.errorcode==0){
                this.tableData=res.data.data;
                this.total=res.data.totalElements
              }
            })
          },
          handleSizeChange(val){//监听每页数量
            this.currentPage=1
            this.rowData=[];
            this.forceRefresh=false;
            this.$nextTick(()=>{
              this.forceRefresh=true
            })
            this.pageSize=val;
            if(this.searchInput!==''||this.searchInput!=null ||this.value!==''||this.value!=null){
                console.log(this.searchJt);
                let timeValue=[];
                if(this.value==''||this.value==null){
                    timeValue.push({sta:null,end:null})
                }else {
                    timeValue.push(
                        {
                            sta:this.value[0],
                            end:this.value[1]
                        })
                }
                let data={
                    size:this.pageSize,
                    page:this.currentPage,
                    name: this.searchJt,
                    beginTime:timeValue[0].sta,
                    endTime:timeValue[0].end
                };
                this.$api.eventInformationHistory(data).then((res) => {
                    if(res.errorcode==0){
                        this.tableData=res.data.data;
                        this.total=res.data.totalElements
                    }
                })
            }else {
              this.getEventHistorical();
            }
          },
          pageMode(val){//监听是第几页
            this.rowData=[];
            this.forceRefresh=false;
            this.$nextTick(()=>{
              this.forceRefresh=true
            })
            console.log(val);
            this.currentPage=val;
            if(this.searchInput!==''&&this.searchInput!=null ||this.value!==''&&this.value!=null){
                console.log(this.searchJt);
                let timeValue=[];
                if(this.value==''||this.value==null){
                    timeValue.push({sta:null,end:null})
                }else {
                    timeValue.push(
                        {
                            sta:this.value[0],
                            end:this.value[1]
                        })
                }
                let data={
                    size:this.pageSize,
                    page:this.currentPage,
                    name: this.searchJt,
                    beginTime:timeValue[0].sta,
                    endTime:timeValue[0].end
                };
                this.$api.eventInformationHistory(data).then((res) => {
                    if(res.errorcode==0){
                        this.tableData=res.data.data;
                        this.total=res.data.totalElements
                    }
                })
            }else {
              this.getEventHistorical();
            }
          },
          handleCurrentChange(row){//表格行点击
              this.$refs.expressTheDetails.show();//传给快报历史
              this.rowData=[];
              this.rowData=row;
              this.$refs.historicalDetails.addShow=true;
              this.$refs.historicalDetails.cancelShow=false;
              this.$refs.historicalDetails.typeLX='撤销';
              this.getReceive()
          },
          getReceive(){
            let data={
              eventId:this.rowData.id
            };
            this.$api.eventLettersHistory(data).then((res) => {
              if(res.errorcode==0){
                let requestData=res.data;
                this.$refs.historicalDetails.receiveData(this.rowData,requestData);//传给事件快报
                this.$refs.expressTheDetails.readingData(this.rowData,requestData);//传给快报历史
                this.$refs.expressTheDetails.bulletinEnd();
              }
            })
          },
          getHeight(){
            let h = document.documentElement.clientHeight || document.body.clientHeight
            this.styleBulletin.height = h - (68 + 220) + 'px'
            this.rightStyle.height=h - (68 + 300) + 'px'
          },

        }
    }
</script>

<style scoped>
  .navsBar {
    background-color: white;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border:1px solid rgba(219, 219, 219, 1);
    border-radius:3px;
  }
  .contentStyle {

    background-color: white;
    box-sizing: border-box;
    border:1px solid rgba(219, 219, 219, 1);
    border-radius:3px;
  }
  .tableContainer {
    padding: 6px;
    box-sizing: border-box;
    border: 1px solid rgba(211, 215, 219, 1);
  }
  >>>.el-pagination{
    padding: 40px 5px;
  }
</style>
