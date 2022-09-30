<!--@author：yf-->
<template>
  <el-container>
  <div style="margin-top: 20px;width: 100%">
    <el-header class="navsBar" style="height: 80px">
      <el-col :span="9" style="text-align: left">
<!--        <el-date-picker-->
<!--          v-model="value"-->
<!--          format="yyyy-MM-dd"-->
<!--          value-format="yyyy-MM-dd"-->
<!--          type="daterange"-->
<!--          range-separator="至"-->
<!--          start-placeholder="开始日期"-->
<!--          end-placeholder="结束日期">-->
<!--        </el-date-picker>-->
        <el-date-picker
          v-model="valueStr"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="开始日期">
        </el-date-picker>

        <el-date-picker
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          v-model="valueEnd"
          type="date"
          placeholder="结束日期">
        </el-date-picker>
      </el-col>
      <el-col :span="8">
        <el-col :span="12">
          <el-input
            placeholder="输入标题"
            prefix-icon="el-icon-search"
            v-model="searchInput"
            @change="changeVal"
          >
          </el-input>
        </el-col>
        <el-col :span="12" style="text-align: left;text-indent: 10px;margin-top: 2px">
          <el-button type="primary" size="medium" @click="queryData">查找</el-button>
<!--          <el-button type="primary" size="medium" @click="advancedSearch">高级查找</el-button>-->
        </el-col>
      </el-col>
      <el-col :span="7">
<!--        <span >共<span style="font-size: 30px;color: #479DFF;">{{12}}</span>件事件</span>-->
<!--        <span ><span style="font-size: 30px;color: red;">{{1}}</span>人死亡</span>-->
<!--        <span ><span style="font-size: 30px;color: #76D672;;">{{50}}</span>人受伤</span>-->
<!--        <span ><span style="font-size: 30px;color: #F58D25;">{{3}}</span >人失踪</span>-->
      </el-col>
    </el-header>

    <el-main style="padding: 12px 20px">
          <div class="contentStyle" >
            <div style=" height: 72px;line-height: 72px;text-align: left;">
<!--              <el-button class="el-icon-plus">新增</el-button>-->
              <el-button class="el-icon-thumb" @click="openEvent">打开</el-button>
              <el-button class="el-icon-delete" @click="rowDelete">删除</el-button>
<!--              <el-button class="el-icon-tickets">总结报告</el-button>-->
            </div>
            <div class="tableContainer" :style="tableContainer">
              <my-table
                @handleCurrentChange="handleCurrentChange"
                :tableColumn="tableColumn"
                :isSelection="isSelection"
                :myLoading ="myLoading"
                :tableData="tableData" @selection-change="myHandleSelectionChange"></my-table>
              <el-pagination :small="pagingSize"  :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"
                             :current-page="currentPage"
                             @size-change="handleSizeChange" @current-change="pageMode"
                             layout="total, prev, pager, next, sizes, jumper"></el-pagination>
            </div>
          </div>
    </el-main>
    <!--外层弹窗-->
    <el-dialog width="600px" :title="title" :visible.sync="outerVisible" :close-on-click-modal="false">
      <el-form label-width="80px" :model="ruleForm" :rules="rules" ref="ruleForm"    @submit.native.prevent>
        <el-form-item label="事件标题:" >
          <el-input type="text"  v-model.trim="ruleForm.eventTitle" @change="changeVal" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="报送单位:" >
          <el-input type="text" disabled  v-model.trim="ruleForm.submittedUnit">
            <template slot="append"><el-button @click="submittedSelect">选择</el-button></template>
          </el-input>
        </el-form-item>
        <el-form-item label="事件类型:" >
          <el-input type="text" disabled v-model.trim="ruleForm.submittedType">
            <template slot="append"><el-button @click="eventSelect">选择</el-button></template>
          </el-input>
        </el-form-item>
        <el-form-item label="事发时间:">
          <el-date-picker
            v-model="beginTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
          >
          </el-date-picker>
          <span>&nbsp;至&nbsp;</span>
          <el-date-picker
            v-model="endTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="事件级别:">
          <el-select style="width: 100%" v-model="ruleForm.rankEvent"  placeholder="请选择">
            <el-option
              v-for="item in rankSelect"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!--内层弹窗-->
      <el-dialog width="400px" :title="coreTitle" :visible.sync="innerVisible" append-to-body :close-on-click-modal="false">
          <tree-search ref="treeSearch" @affirmDialog="affirmDialog" @cancelDialog="cancelDialog"></tree-search>
      </el-dialog>


      <div slot="footer" class="dialog-footer" style="text-align: center">
<!--        <el-button @click="outerVisible = false">取消</el-button>-->
        <el-button type="primary" @click="lookForConfirmation">查找</el-button>
      </div>
    </el-dialog>
  </div>

  </el-container>
</template>

<script>
    import treeSearch from "@/view/yz_eventManagement/eventHistory/plan/treeSearch"
    import myTable from "@/yz_components/tables/tables"
    export default {
        name: "eventHistory",
        components:{
          myTable,
          treeSearch
        },
        data(){
          return{
            valueStr:'',//查询开始日期
            valueEnd:'',//查询结束日期
            searchInput:'',//搜索
            tableColumn: [
              {
                prop: "title",
                label: "事件标题"
              }, {
                prop: "caseClass",
                label: "事件类型"
              },
              {
                prop: "occurTime",
                label: "事发时间"
              },  {
                prop: "status",
                label: "事件状态"
              },  {
                prop: "reportTime",
                label: "接报时间"
              },  {
                prop: "receiveOperator",
                label: "接报人"
              },  {
                prop: "reportSuperior",
                label: "上报情况"
              },

            ],//表头
            tableData: [],//表格数据
            total: 0,//数据总数
            pageSize: 10,//每页显示多少条
            currentPage: 1,//当前页数
            pagingSize:false,  //分页大小
            pathname:'/eventReports',
            rowId:'',//当前id
            outerVisible:false,//外层是否弹窗
            title:'',//外层弹窗标题
            currentTime:'',//当前时间
            rankSelect:[],//事件等级数据

            innerVisible:false,//内层是否弹窗
            coreTitle:'',//内层弹窗标题

            ruleForm:{
              eventTitle:'',
              submittedUnit:'',
              submittedType:'',
              rankEvent:''
            },
            beginTime:'',//开始时间
            endTime:'',//结束时间
            rules:{},
            typeData:'' ,//区分事件类型
            reportingUnitid:[],//存储报送单位ID
            evenTypeId:'',//存储事件类型ID
            typeTitle:'',//判断是查找还是高级查找
            planLevelId:'',
            planPlanId:'',

            RownewID:'',
            RowcaseID:'',
            RowLevelID:'',
            RowareaId:'',
            Rowarea:'',
            RoweventTitle:'',
            RowallCase:'',
            caseName:'',
            myLoading:false,
            isSelection:false,
            tableContainer:{
              height:''
            }
          }
        },
        mounted(){
          this.emptyEventId()
        },
        created(){
          this.getTabDatas();
          window.addEventListener('resize', this.getHeight);
          this.getHeight()
        },
        destroyed(){
          window.removeEventListener('resize', this.getHeight)
        },
        methods:{
          getHeight(){
            let h = document.documentElement.clientHeight || document.body.clientHeight
            this.tableContainer.height = h - (68 + 220) + 'px'
          },
          myHandleSelectionChange(row){
            console.log(row)
          },
          emptyEventId(){
            this.rowId=''
          },
          getTabDatas(){//获取表格数据
            let data={
              size:this.pageSize,
              page:this.currentPage
            };
            this.myLoading =true;
            this.$api.eventHistory(data).then((res) => {
              if(res.errorcode==0){
                this.tableData=res.data.data
                this.total=res.data.totalElements
              }
               this.myLoading = false;
            }).catch(() =>{
              this.myLoading = false;
            })
          },
          handleCurrentChange(row){//点击获取表格数据
            this.rowId=row.id;
            this.RownewID=row.id;
            this.RowcaseID=row.caseClassId;
            this.RowLevelID=row.eventLevelId;
            this.RowareaId=row.areaId;
            this.Rowarea=row.area;
            this.RoweventTitle=row.title;
            this.RowallCase=row.reportDescription;

            this.caseName=row.caseName;
            this.planLevelId=row.levelId;
            this.planPlanId=row.planId;
          },
          openEvent(){//打开具体事件
            // let eventID=sessionStorage.getItem('newID');
            if(this.planLevelId!== 0 && this.planLevelId!=='' && this.planPlanId!==''&& this.planPlanId!==0){//已经启动过预案
              this.$store.commit('setTurnOnEmergencyResponse',true);
            }else {
              this.$store.commit('setTurnOnEmergencyResponse',false);
            }

            if(this.rowId==''||this.rowId==null){
              this.$message({
                message: '请先选择事件',
                type: 'warning'
              });
            }else {
              sessionStorage.setItem('eventTitle', this.RoweventTitle);//为了自动生成写的存储标题
              sessionStorage.setItem('allCase', this.RowallCase);//为了自动生成写的存储总体情况
              sessionStorage.setItem('LevelID', this.RowLevelID);
              sessionStorage.setItem('newID', this.RownewID);
              sessionStorage.setItem('caseID', this.RowcaseID);
              sessionStorage.setItem('caseName', this.caseName);
              sessionStorage.setItem('areaId', this.RowareaId);
              sessionStorage.setItem('area', this.Rowarea);
              this.$router.push({
                path:this.pathname
              });
            }
          },
          rowDelete(){//删除行数据
            if(this.rowId==''||this.rowId==undefined||this.rowId==null){
              this.$message({
                message: '请先选中事件再进行删除!',
                type: 'warning'
              });
              return
            }
            this.$confirm('此操作将删除该事件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let data={
                id:this.rowId
              };
              this.$api.eventDelete(data).then((res) => {
                if(res.errorcode==0){
                  this.$message({
                    message: '删除成功!',
                    type: 'success'
                  });
                  this.rowId='';
                  sessionStorage.removeItem('newID')
                  if(this.typeTitle==''){
                    this.getTabDatas();
                  }else {
                    this.getEnv()
                  }

                }else {
                  //this.$message.error(res.msg)
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
          },
          queryData(){ //按标题查找
            this.currentPage=1;
            let oDate1=new Date(this.valueStr);
            let oDate2=new Date(this.valueEnd);
            console.log(oDate1, oDate2);
            if(this.valueEnd!==null){
              if(oDate1.getTime()>oDate2.getTime()){//转换成毫秒进行比较
                this.$message({
                  message: '开始时间不能小于结束时间',
                  type: 'warning'
                });
                return
              }
            }
            this.typeTitle = '查找';
            this.getEnv()
          },
          getEnv(){
            this.timeValue=[];
            if(this.valueStr==''||this.valueStr==null || this.valueEnd==''||this.valueEnd==null){
              if(this.valueStr==''||this.valueStr==null){
                this.timeValue.push({sta:null,end:this.valueEnd})
              }
              if(this.valueEnd==''||this.valueEnd==null){
                this.timeValue.push({sta:this.valueStr,end:null})
              }
              if(this.valueStr==''||this.valueStr==null || this.valueEnd==''||this.valueEnd==null) {
                this.timeValue.push({sta:null,end:null})
              }
            }else {
              this.timeValue.push(
                {
                  sta:this.valueStr,
                  end:this.valueEnd
                })
            }
            console.log( this.timeValue,this.currentPage);
            let data={
              size:this.pageSize,
              page:this.currentPage,
              name:this.searchInput,
              beginTime: this.timeValue[0].sta,
              endTime:this.timeValue[0].end
            };
            console.log( data);
            this.$api.eventHistory(data).then((res) => {
              if(res.errorcode==0){
                this.tableData=res.data.data
                this.total=res.data.totalElements
              }
            })
          },
          handleSizeChange(val){//监听每页数量
            this.pageSize=val;
            console.log(val);
            let type=this.typeTitle;
            console.log(type);
            switch (type) {
              case '查找':
                  this.getEnv();
                break;
              case '高级查找':
                this.currentPage=val;
                if(this.ruleForm.eventTitle!==''&&this.ruleForm.eventTitle!=null ||this.value!==''&&this.value!=null){
                  this.lookForConfirmation();
                }else {
                  this.getTabDatas();
                }
                break;
                case "":
                  this.getEnv();
                  break;
              default:
                break;
            }
          },
          pageMode(val){//监听是第几页
            this.rowId='';
            let type=this.typeTitle;
            if(type==''){
              this.currentPage=val;
              this.getTabDatas();
            }
            switch (type) {
              case '查找':
                this.currentPage=val;
                if(this.searchInput!==''||this.searchInput!=null ||this.value!==''||this.value!=null){
                  this.getEnv();
                }
                else {
                  this.getTabDatas();
                }
                break;
              case '高级查找':
                this.currentPage=val;
                if(this.ruleForm.eventTitle!==''||this.ruleForm.eventTitle!=null ||this.value!==''||this.value!=null){
                  this.lookForConfirmation();
                }else {
                  this.getTabDatas();
                }
                break;
              default:
                break;
            }

          },
          advancedSearch(){ //高级查找
            this.typeTitle='高级查找';
            this.title='高级查找';
            this.outerVisible=true;
            let pcode='emtlevel';
            let data={
              pcode:pcode
            };
            this.$api.eventLevel(data).then((res) => {
              if(res.errorcode=='0'){
                console.log(res.data);
                this.rankSelect=res.data
              }
            })
          },
          submittedSelect(){//高级查找弹出联系人
            this.coreTitle='选择区域';
            this.innerVisible=true;
            this.typeData='报送单位';
            let data={};
            this.$api.topTree(data).then((res) => {
              if(res.errorcode=='0'){
                console.log(res.data);
                this.$refs.treeSearch.dataUpdating(res.data,this.typeData);
              }
            })
          },
          eventSelect(){//高级查找弹出事件类型
            this.coreTitle='选择事件类型';
            this.innerVisible=true;
            this.typeData='事件类型';
            let data={};
            this.$api.getTree(data).then((res) => {
              if(res.errorcode=='0'){
                console.log(res.data);
                this.$refs.treeSearch.dataUpdating(res.data,this.typeData);
              }
            })
          },
          cancelDialog(){//内层取消按钮
            this.innerVisible=false;
          },
          affirmDialog(filterText,filterId,typeData){//内层确认按钮
            console.log(filterText,filterId,typeData,'接收');
            switch (typeData) {
              case '报送单位':
                if(filterText==''||filterText==null ||filterId==''||filterId==null ){
                  this.$message({
                    message: '请选择报送单位',
                    type: 'warning'
                  });
                }else {
                  this.reportingUnitid.push(filterId);
                  this.ruleForm.submittedUnit=filterText;
                  this.innerVisible=false;
                }
                break;
              case '事件类型':
                if(filterText==''||filterText==null ||filterId==''||filterId==null ){
                  this.$message({
                    message: '请选择事件类型',
                    type: 'warning'
                  });
                }else {
                  this.evenTypeId=filterId;
                  this.ruleForm.submittedType=filterText;
                  this.innerVisible=false;
                }
                break;
              default:
                break;
            }
          },
          changeVal(){
            this.currentPage=1;
            let type=this.typeTitle;
            if(type=='查找'){
              this.getEnv();
              return
            }
            if(type=='高级查找'){
              this.lookForConfirmation();
              return
            }
          },
          lookForConfirmation(){//查找确认按钮
            this.outerVisible=false;
            let data={
              size:this.pageSize,
              page:this.currentPage,
              name:this.ruleForm.eventTitle,
              beginTime:this.beginTime,
              endTime:this.endTime,
              depts: this.reportingUnitid,
              caseClassId: this.evenTypeId,
              levelId:this.ruleForm.rankEvent,
            };
            console.log(data);

            this.$api.eventAdvancedInquire(data).then((res) => {
              if(res.errorcode=='0'){
                this.tableData=res.data.data
                this.total=res.data.totalElements
              }
            })
          },
        }
    }
</script>

<style scoped>
  .navsBar {
    margin: 0 30px;
    background-color: white;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border:1px solid rgba(219, 219, 219, 1);
    border-radius:3px;
  }
  .contentStyle {
    margin: 0 10px 0 10px;
    padding: 0 20px;
    background-color: white;
    box-sizing: border-box;
    border:1px solid rgba(219, 219, 219, 1);
    border-radius:3px;
  }
  .tableContainer {
    /*padding: 6px;*/
    box-sizing: border-box;
    /*border: 1px solid rgba(211, 215, 219, 1);*/
  }
</style>
