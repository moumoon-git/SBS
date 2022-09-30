<template>
  <div class="event-manager">

      <!--头部组件-->
      <el-header
        style="height: initial;padding: 0 0 0 0; clear: both; margin-top: 6px"
        class="left">
        <event-manager-header ref="header" @searchHandle="searchHandle" @addOrUpdateHandle="addOrUpdateHandle"></event-manager-header>
      </el-header>

      <el-row>
        <el-col :span="24">
          <!--tab组件-->
          <el-tabs class="el-tabs" v-model="activeName" type="card" @tab-click="cardHandleClick">
            <el-tab-pane label="全部" name="first">
              <!--全部表格数据-->
              <event-manager-table
                ref="table"
                :tableData="tableDataDisplay"
                @formFindHandleClick="formFindHandleClick"
                @formUpdateHandleClick="formUpdateHandleClick"
                @formVerifyHandleClick="formVerifyHandleClick"
                @formDisposeHandleClick="formDisposeHandleClick"
                @formCloseHandleClick="formCloseHandleClick"
                @formSurveyHandleClick="formSurveyHandleClick"
              >
              </event-manager-table>
            </el-tab-pane>

            <el-tab-pane label="待核实" name="second">
              <!--待核实表格数据-->
              <event-manager-table
                ref="table"
                :tableData="tableDataDisplay"
                @formFindHandleClick="formFindHandleClick"
                @formUpdateHandleClick="formUpdateHandleClick"
                @formVerifyHandleClick="formVerifyHandleClick"
                @formDisposeHandleClick="formDisposeHandleClick"
                @formCloseHandleClick="formCloseHandleClick"
                @formSurveyHandleClick="formSurveyHandleClick"
              >
              </event-manager-table>
            </el-tab-pane>

            <el-tab-pane label="核实中" name="third">
              <!--核实中-->
              <event-manager-table
                ref="table"
                :tableData="tableDataDisplay"
                @formFindHandleClick="formFindHandleClick"
                @formUpdateHandleClick="formUpdateHandleClick"
                @formVerifyHandleClick="formVerifyHandleClick"
                @formDisposeHandleClick="formDisposeHandleClick"
                @formCloseHandleClick="formCloseHandleClick"
                @formSurveyHandleClick="formSurveyHandleClick"
              >
              </event-manager-table>
            </el-tab-pane>

            <el-tab-pane label="待处理" name="fourth">
              <!--待处理-->
              <event-manager-table
                ref="table"
                :tableData="tableDataDisplay"
                @formFindHandleClick="formFindHandleClick"
                @formUpdateHandleClick="formUpdateHandleClick"
                @formVerifyHandleClick="formVerifyHandleClick"
                @formDisposeHandleClick="formDisposeHandleClick"
                @formCloseHandleClick="formCloseHandleClick"
                @formSurveyHandleClick="formSurveyHandleClick"
              >
              </event-manager-table>
            </el-tab-pane>

            <el-tab-pane label="处理中" name="fire">
              <!--处理中-->
              <event-manager-table
                ref="table"
                :tableData="tableDataDisplay"
                @formFindHandleClick="formFindHandleClick"
                @formUpdateHandleClick="formUpdateHandleClick"
                @formVerifyHandleClick="formVerifyHandleClick"
                @formDisposeHandleClick="formDisposeHandleClick"
                @formCloseHandleClick="formCloseHandleClick"
                @formSurveyHandleClick="formSurveyHandleClick"
              >
              </event-manager-table>
            </el-tab-pane>
            <el-tab-pane label="已处理" name="six">
              <!--已处理-->
              <event-manager-table
                ref="table"
                :tableData="tableDataDisplay"
                @formFindHandleClick="formFindHandleClick"
                @formUpdateHandleClick="formUpdateHandleClick"
                @formVerifyHandleClick="formVerifyHandleClick"
                @formDisposeHandleClick="formDisposeHandleClick"
                @formCloseHandleClick="formCloseHandleClick"
                @formSurveyHandleClick="formSurveyHandleClick"
              >
              </event-manager-table>
            </el-tab-pane>
            <el-tab-pane label="已关闭" name="seven">
              <!--已关闭-->
              <event-manager-table
                ref="table"
                :tableData="tableDataDisplay"
                @formFindHandleClick="formFindHandleClick"
                @formUpdateHandleClick="formUpdateHandleClick"
                @formVerifyHandleClick="formVerifyHandleClick"
                @formDisposeHandleClick="formDisposeHandleClick"
                @formCloseHandleClick="formCloseHandleClick"
                @formSurveyHandleClick="formSurveyHandleClick"
              >
              </event-manager-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>

    <!--分页-->
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage"
    >
    </el-pagination>

    <!--点击查看，弹出查看窗口-->
    <event-manager-view
      v-if="eventMangerViewVisible"
      ref="eventManagerView"
    ></event-manager-view>

    <!--点击编辑，弹出编辑窗口-->
    <event-manager-update
      v-if="eventMangerUpdateVisible"
      ref="eventManagerUpdate"
      @refreshDataList="getDataList"
    ></event-manager-update>

    <!--点击核实，弹出编辑窗口-->
    <event-manager-verify
      v-if="eventMangerVerifyVisible"
      ref="eventManagerVerify"
      @refreshDataList="getDataList"
    ></event-manager-verify>

    <!--点击调查反馈，弹出编辑窗口-->
    <!--<event-manager-survey
      v-if="eventMangerSurveyVisible"
      ref="eventManagerSurvey"
    ></event-manager-survey>-->


  </div>
</template>
<script>
import EventManagerHeader from "@/views/modules/event/manager/eventheader";
import EventManagerTable from "./eventmanager-table";
import EventManagerView from "./eventmanager-view";
import EventManagerUpdate from "./eventmanager-update";
import EventManagerVerify from "./eventmanager-verify";
//调查反馈组件
//import EventManagerSurvey from "./eventmanager-survey";

export default {
  data() {
    return {
      platformId: this.$store.state.user.platformId,

      //头部时间组件值
      headerDateValue: '',
      //查看弹窗默认关
      eventMangerViewVisible: false,
      //编辑弹窗默认关
      eventMangerUpdateVisible: false,
      //核实弹窗默认关
      eventMangerVerifyVisible: false,
      //调查反馈默认弹窗
      eventMangerSurveyVisible: false,

      //默认的tab
      activeName: "first",

      //分页
      pageIndex: 1, // 当前页
      pageSize: 10, // 单页显示数据
      totalPage: 100, // 总条数
      // table 显示数据
      tableDataDisplay: [],

      //共享平台id数组
      sharePlatfromArray: [],

      // 搜索条件
      startTime: '',
      endTime: '',
      searchTitle: '',
      sharePatformId: '',
      eventTypeId: '',
      shareTownId: '',

      //全部表格数据
      tableAllData: [],
      //待核实表格数据
      tableWaitVerifyData: [],
      //核实中表格数据
      tableVerifyingData: [],
      //等处理
      tableWaitDisposeData: [],
      //处理中
      tableDisposeingData: [],
      //已处理
      tableDisposedData: [],
      //已关闭
      tableClosedData: [],
      //已关闭的数据
      tableCloseDisposeData: [
        {
          id: 6,
          statusFlag: "5" /*事件处理状态标志*/,
          title: "中大社区消防通道堵塞",
          eventType: "7",
          eventLevel: "3",
          reportName: "俞思远",
          reportTime: "2019-6-5",
          eventPosition: "中大社区101路",
          eventDescription:
            "消防通道是指消防人员实施营救和被困人员疏散的通道，比如楼梯口、过道，那里都安有消防指示灯。",
          status: "已处理",
          eventClose: "1"
        }
      ],

    };
  },

  components: {
    "event-manager-header": EventManagerHeader,
    "event-manager-table": EventManagerTable,
    "event-manager-view": EventManagerView,
    "event-manager-update": EventManagerUpdate,
    "event-manager-verify": EventManagerVerify,
    //"event-manager-survey": EventManagerSurvey
  },
  mounted(){
    this.getDataList();
  },

  methods: {
    //初始化数据
    // 初始化数据
    getDataList () {

      //判断类型
      if (this.eventTypeId == null || this.eventTypeId == '') {
        this.eventTypeId = 0
      }

      //判断镇街
      if (this.shareTownId == null || this.shareTownId == '') {
        this.shareTownId = 0
      }


      if (this.sharePatformId == null || this.sharePatformId == '') {
        // 本平台id,27是增城的，解决上级查看全部共享的平台数据
        // if(this.platformId == 27){
        //   this.sharePatformId = 0
        // }else{
        //   this.sharePatformId = this.platformId
        // }

        //查出本平台的共享平台
        this.$http({
          async:false,
          url: this.$http.adornUrl(
            '/event/eventShare/selectShareMenuPlatformByMenuId'
          ),
          method: 'post',
          params: this.$http.adornParams({
            myPlatformId: this.$store.state.user.platformId,
            platformMenuId: this.$route.meta.menuId
          })
        }).then(({ data }) => {

          // 说明有共享数据
          if (data.code === 0) {
            //先清空
            this.sharePlatfromArray = [];

            for(var i=0; i<data.list.length; i++){
              var id = data.list[i].linkagePlatformId;
              this.sharePlatfromArray.push(id);
            }
            //调用获取全部工单数据
            this.getAllData(null);

          }else{
            this.$message.error(data.msg)
          }


        })

      }else{
        //先清空
        this.sharePlatfromArray = [];
        this.sharePlatfromArray.push(this.sharePatformId);
        //调用获取全部工单数据
        this.getAllData(null);
      }

    },

    //获取全部事件数据
    getAllData(status){

      let eventInfoConditionEntity= {
        flagType: 1,
        keyword: this.searchTitle,
        startTime: this.startTime,
        endTime: this.endTime,
        eventTypeId: this.eventTypeId,
        townId: this.shareTownId,
        platformIds: this.sharePlatfromArray,
        status: status,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }

      this.$http({
        url: this.$http.adornUrl('/event/eventinfo/listByConditions'),
        method: 'post',
        data: this.$http.adornData(
          eventInfoConditionEntity, false
        ),
        /*data: this.$http.adornData({
          flagType: 5,
          title: this.searchTitle,
          startTime: this.startTime,
          endTime: this.endTime,
          eventTypeId: this.eventTypeId,
          platformIds: this.sharePlatfromArray
        })*/
      }).then(({ data }) => {
         if(data.code === 0){
              //  console.log("listByConditions,listByConditions",data)

        switch (status) {
          case null:
            this.tableAllData = data.list
            this.totalPage = data.totalPage
            break
          case '1':
            this.tableWaitVerifyData = data.list
            this.totalPage = data.totalPage
            break
          case '2':
            this.tableVerifyingData = data.list
            this.totalPage = data.totalPage
            break
          case '3':
            this.tableWaitDisposeData = data.list
            this.totalPage = data.totalPage
            break
          case '4':
            this.tableDisposeingData = data.list
            this.totalPage = data.totalPage
            break
          case '5':
            this.tableDisposedData = data.list
            this.totalPage = data.totalPage
            break
          case '0':
            this.tableClosedData = data.list
            this.totalPage = data.totalPage
            break
          case '6':
            this.tableOutRangeData = data.list
            this.totalPage = data.totalPage
            break
          default:
            break

        }

        // 计算当前页面显示的数据
        let obj = {
          //status = null
          first: 'tableAllData',
          //status = 1
          second: 'tableWaitVerifyData',
          //status = 2
          third: 'tableVerifyingData',
          //status = 3
          fourth: 'tableWaitDisposeData',
          //status = 4
          fire: 'tableDisposeingData',
          //status = 5
          six: 'tableDisposedData',
          //status = 0
          seven: 'tableClosedData',
          //status = 6
          eight: 'tableOutRangeData'
        }

        this.handleCalculate(obj[this.activeName])
            }else{
              this.$message.error(data.msg)
            }
       
      })
    },

    handleCalculate (data) {
      // 分页数据获取
      this.totalPage = this.totalPage;
      this.tableDataDisplay = this[data];
      // this.tableDataDisplay = this[data].slice(
      //   (this.pageIndex - 1) * this.pageSize,
      //   this.pageSize * this.pageIndex
      // )
    },
    // 判断当前在哪个table中
    handleJudge () {
      // console.log("判断当前在哪个table中:",this.activeName)
      switch (this.activeName) {
        case 'first':
          this.getAllData(null)
          break
        case 'second':
          this.getAllData('1')
          break
        case 'third':
          this.getAllData('2')
          break
        case 'fourth':
          this.getAllData('3')
          break
        case 'fire':
          this.getAllData('4')
          break
        case 'six':
          this.getAllData('5')
          break
        case 'seven':
          this.getAllData('0')
          break
        case 'eight':
          this.getAllData('6')
          break
        default:
          break

      }

      let obj = {
        //status = null
        first: 'tableAllData',
        //status = 1
        second: 'tableWaitVerifyData',
        //status = 2
        third: 'tableVerifyingData',
        //status = 3
        fourth: 'tableWaitDisposeData',
        //status = 4
        fire: 'tableDisposeingData',
        //status = 5
        six: 'tableDisposedData',
        //status = 0
        seven: 'tableClosedData',
        //status = 6
        eight: 'tableOutRangeData'
      }

      this.handleCalculate(obj[this.activeName])
    },
    //卡片点击事件
    cardHandleClick(tab, event) {
      // table 切换时,把当前页设置成 1
      this.pageIndex = 1;
      this.handleJudge();
    },

    //子组件点击查看，触发父组件方法"
    formFindHandleClick(row) {
      //查看
      // console.log(row);
      this.eventMangerViewVisible = true;
      this.$nextTick(() => {
        this.$refs.eventManagerView.init(row);
      });
    },

    formUpdateHandleClick(row) {
      //编辑
      // console.log(row);
      this.eventMangerUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.eventManagerUpdate.init(row);
      });
    },

    formVerifyHandleClick(row) {
      //核实 === 1
      // console.log(row);
      this.eventMangerVerifyVisible = true;
      this.$nextTick(() => {
        this.$refs.eventManagerVerify.init(row, "verify");
      });
    },

    formDisposeHandleClick(row) {
      //处理 === 2
      // console.log(row);
      this.eventMangerVerifyVisible = true;
      this.$nextTick(() => {
        this.$refs.eventManagerVerify.init(row, "disposal");
      });
    },

    formCloseHandleClick(row) {
      //关闭
      // console.log(row);
      //关闭状态
      this.$http({
        url: this.$http.adornUrl(`/event/eventinfo/updateEventInfoIsClose`),
        method: "post",
        params: this.$http.adornParams({
          isClose: 0,
          eventInfoId: row.id
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.visible = false;
              this.getDataList();
            }
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    formSurveyHandleClick(row){
      //调查反馈
      // console.log(row);
      this.eventMangerSurveyVisible = true;
      /*this.$nextTick(() => {
        this.$refs.eventManagerSurvey.init(row);
      });*/

    },

    //根据时间条件查询
    // 根据时间条件查询
    searchHandle (objTime, objContent, objPlatformId, objTypearray, shareTownId) {

      var objEventTypeId;
      if (objTypearray != null && objTypearray != '') {
        // objPlatformId是共享平台的id
        var typearray = objTypearray.slice(-1).join(',')
        objEventTypeId = Number(typearray)
      } else {
        objEventTypeId = 0
      }

      var startTime;
      var endTime;
      if(objTime != null && objTime != ''){
        // 时间不为空
        startTime = objTime[0]
        endTime = objTime[1]
      }else{
        startTime = ''
        endTime = ''
      }

      // console.log("事件条件查询",shareTownId)

      this.sharePatformId = objPlatformId;
      this.eventTypeId = objEventTypeId;
      this.startTime = startTime;
      this.endTime = endTime;
      this.searchTitle = objContent;
      this.shareTownId = shareTownId;

      //初始化分布条件
      this.pageIndex = 1;
      this.getDataList()


    },

    //新增跳转路由
    addOrUpdateHandle(){
      this.$router.push({
        path: '/event-info/eventinfo',
      })
    },

    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.handleJudge();
      // console.log("当前显示条数", val);
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.handleJudge();
      // console.log("当前页", val);
    }
  }
};
</script>

<style lang="scss">

   .event-manager {
     height: initial!important;
     .el-table th {
       color: #656565;
       background: rgba(230, 230, 230, 1) !important;
     }

     .el-table__body tbody > :nth-child(2n) {
       background: rgb(248, 248, 248);
     }
   }
</style>
