<template>
  <div class="campusPeriphery">
    <campus-periphery-header
      @searchHandle="searchHandle"
      :switchView="switchView"
      :platformTypeId="platformTypeId"
      @exportEventData="exportEventData"
      @changeForm="changeForm"
    ></campus-periphery-header>

    <div class="cardClass">
      <div class="list">
        <campus-periphery-table
          ref="table"
          :tableData="tableDataDisplay"
          :switchView="switchView"
          @formFindHandleClick="formFindHandleClick"
          @formManuaVerifylHandleClick="formManuaVerifylHandleClick"
          @updateValidlHandleClick="updateValidlHandleClick"
          @refresh-table="getDataList"
        ></campus-periphery-table>
      </div>
      <div>
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[12, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
    <!--点击查看，弹出查看窗口-->
    <campus-periphery-view v-if="campusPeripherView" ref="campusPeripherView"></campus-periphery-view>

    <!--点击编辑，弹出查看窗口-->
    <campus-periphery-verify v-if="campusPeripherVerify" ref="campusPeripherVerify"></campus-periphery-verify>
  </div>
</template>

<script>
import campusPeripheryHeader from "./campusPeriphery-header";
import campusPeripheryTable from "./campusPeriphery-table";
import campusPeripherView from "./campusPeriphery-view";
import campusPeripherVerify from "../../word/manager/wordmanager-verify";
export default {
  data() {
    return {
      // 分页
      pageIndex: 1, // 当前页
      pageSize: 12, // 单页显示数据
      totalPage: 100, // 总条数
      // 共享平台id数组
      sharePlatfromArray: [],
      // 搜索条件
      validFlag: "1",
      startTime: "",
      endTime: "",
      searchTitle: "",
      sharePatformId: "",
      eventTypeId: "",
      shareTownId: "",
      // 全部表格数据
      tableDataDisplay: [],
      campusPeripherView: false,
      campusPeripherVerify: false,
      platformTypeId: 6,
      status: "",
      switchView: false, //切换呈现形式
    };
  },
  components: {
    "campus-periphery-header": campusPeripheryHeader,
    "campus-periphery-table": campusPeripheryTable,
    "campus-periphery-view": campusPeripherView,
    "campus-periphery-verify": campusPeripherVerify,
  },
  created() {
    // 表格数据
    this.getDataList();
  },
  methods: {
    // 初始化数据
    getDataList() {
      // 判断类型
      if (this.eventTypeId == null || this.eventTypeId == "") {
        this.eventTypeId = 0;
      }

      //判断镇街
      if (this.shareTownId == null || this.shareTownId == "") {
        this.shareTownId = 0;
      }

      if (this.sharePatformId == null || this.sharePatformId == "") {
        // 本平台id,27是增城的，解决上级查看全部共享的平台数据
        // if(this.platformId == 27){
        //   this.sharePatformId = 0
        // }else{
        //   this.sharePatformId = this.platformId
        // }

        // 查出本平台的共享平台
        this.$http({
          async: false,
          url: this.$http.adornUrl(
            "/event/eventShare/selectShareMenuPlatformByMenuId"
          ),
          method: "post",
          params: this.$http.adornParams({
            myPlatformId: this.$store.state.user.platformId,
          }),
        }).then(({ data }) => {
          // 说明有共享数据
          if (data.list.length > 0) {
            // 先清空
            this.sharePlatfromArray = [];

            for (var i = 0; i < data.list.length; i++) {
              var id = data.list[i].linkagePlatformId;
              this.sharePlatfromArray.push(id);
            }
            // 调用获取全部工单数据
            this.getAllData(null);
          }
        });
      } else {
        // 先清空
        this.sharePlatfromArray = [];
        this.sharePlatfromArray.push(this.sharePatformId);
        // 调用获取全部工单数据
        this.getAllData(null);
      }
    },

    // 根据时间条件查询
    exportEventData(
      objValid,
      objTime,
      objContent,
      objPlatformId,
      objTypearray,
      shareTownId
    ) {
      var objEventTypeId;
      if (objTypearray != null && objTypearray != "") {
        // objPlatformId是共享平台的id
        var typearray = objTypearray.slice(-1).join(",");
        objEventTypeId = Number(typearray);
      } else {
        objEventTypeId = 0;
      }

      var startTime;
      var endTime;
      if (objTime !== null || objTime !== "") {
        // 时间不为空
        startTime = objTime[0];
        endTime = objTime[1];
      } else {
        startTime = "";
        endTime = "";
      }

      this.validFlag = objValid;
      this.sharePatformId = objPlatformId;
      this.eventTypeId = objEventTypeId;
      this.startTime = startTime;
      this.endTime = endTime;
      this.searchTitle = objContent;
      this.shareTownId = shareTownId;

      this.downloadWordExcel();
    },

    // 下载工单数据
    downloadWordExcel() {
      // 判断类型
      if (this.eventTypeId == null || this.eventTypeId == "") {
        this.eventTypeId = 0;
      }

      //判断镇街
      if (this.shareTownId == null || this.shareTownId == "") {
        this.shareTownId = 0;
      }

      if (this.sharePatformId == null || this.sharePatformId == "") {
        // 查出本平台的共享平台
        this.$http({
          async: false,
          url: this.$http.adornUrl(
            "/event/eventShare/selectShareMenuPlatformByMenuId"
          ),
          method: "post",
          params: this.$http.adornParams({
            myPlatformId: this.$store.state.user.platformId,
          }),
        }).then(({ data }) => {
          // 说明有共享数据
          if (data.list.length > 0) {
            // 先清空
            this.sharePlatfromArray = [];

            for (var i = 0; i < data.list.length; i++) {
              var id = data.list[i].linkagePlatformId;
              this.sharePlatfromArray.push(id);
            }
            // 调用获取全部工单数据
            this.getDownloadData();
          }
        });
      } else {
        // 先清空
        this.sharePlatfromArray = [];
        this.sharePlatfromArray.push(this.sharePatformId);
        // 调用获取全部工单数据
        this.getDownloadData();
      }
    },

    // 获取下载工单表格的数据
    getDownloadData() {
      // console.log('获取下载工单表格的数据接口', this.sharePlatfromArray)

      //flagType放开数据限制 flagType: 0,
      let eventInfoConditionEntity = {
        validFlag: this.validFlag,
        flagType: 5,
        keyword: this.searchTitle,
        startTime: this.startTime,
        endTime: this.endTime,
        eventTypeId: this.eventTypeId,
        townId: this.shareTownId,
        platformIds: this.sharePlatfromArray,
        platformTypeId: this.platformTypeId,
      };

      this.$http({
        url: this.$http.adornUrl("/event/eventinfo/exportEventData"),
        method: "post",
        data: this.$http.adornData(eventInfoConditionEntity, false),
        responseType: "blob",
      }).then(({ data }) => {
        let eleLink = document.createElement("a");
        let url = window.URL.createObjectURL(data);
        let name = "工单统计.xls";
        eleLink.href = url;
        eleLink.download = name;
        document.body.appendChild(eleLink);
        eleLink.click();
        window.URL.revokeObjectURL(url);
      });
    },

    // 获取全部工单数据
    getAllData(status) {
      // console.log('getAllData获取全部工单数据', status,this.pageIndex,this.pageSize)
      //flagType放开数据限制 flagType: 0,
      let eventInfoConditionEntity = {
        validFlag: this.validFlag,
        flagType: 5,
        keyword: this.searchTitle,
        startTime: this.startTime,
        endTime: this.endTime,
        eventTypeId: this.eventTypeId,
        townId: this.shareTownId,
        platformIds: this.sharePlatfromArray,
        status: this.status,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        platformTypeId: 6,
      };

      this.$http({
        url: this.$http.adornUrl("/event/eventinfo/listByConditions"),
        method: "post",
        data: this.$http.adornData(eventInfoConditionEntity, false),
      }).then(({ data }) => {
        // console.log("listByConditions,listByConditions",data)
        data.list.map((v) => {
          switch (v.status) {
            case 1:
              v.status = "待核实";
              break;
            case 2:
              v.status = "核实中";
              break;
            case 3:
              v.status = "待处理";
              break;
            case 4:
              v.status = "处理中";
              break;
            case 5:
              v.status = "已处理";
              break;
            case 6:
              v.status = "超出范围";
              break;
            default:
              v.status = "未知";
              break;
          }
        });
        // console.log(this.tableDataDisplay)
        this.tableDataDisplay = data.list;
        this.totalPage = data.totalPage;
          if(this.$route.query.id){
            // 判断是否有传递过来的id
            const id = this.$route.query.id;
            this.tableDataDisplay.forEach(item=>{
              if(item.id == id){
                // 调出查看弹窗 
                this.formFindHandleClick(item);
              }
            })
          }
      });
    },
    // 根据时间条件查询
    searchHandle(
      objValid,
      objTime,
      objContent,
      objPlatformId,
      objTypearray,
      shareTownId,
      status
    ) {
      var objEventTypeId;
      if (objTypearray != null && objTypearray != "") {
        // objPlatformId是共享平台的id
        var typearray = objTypearray.slice(-1).join(",");
        objEventTypeId = Number(typearray);
      } else {
        objEventTypeId = 0;
      }

      var startTime;
      var endTime;
      if (objTime != null && objTime != "") {
        // 时间不为空
        startTime = objTime[0];
        endTime = objTime[1];
      } else {
        startTime = "";
        endTime = "";
      }

      this.validFlag = objValid;
      this.sharePatformId = objPlatformId;
      this.eventTypeId = objEventTypeId;
      this.startTime = startTime;
      this.endTime = endTime;
      this.searchTitle = objContent;
      this.shareTownId = shareTownId;
      this.pageIndex = 1;
      this.status = status;

      // console.log("条件查询条件查询条件查询",startTime,endTime)

      this.getDataList();
    },
    // 子组件点击查看，触发父组件方法"
    formFindHandleClick(row) {
      // 查看
       console.log("点击查看",row)
      this.campusPeripherView = true;
      this.$nextTick(() => {
        this.$refs.campusPeripherView.init(row);
      });
    },

    formManuaVerifylHandleClick(row) {
      // 编辑
      // console.log(row)
      this.campusPeripherVerify = true;
      this.$nextTick(() => {
        this.$refs.campusPeripherVerify.init(row);
      });
    },

    updateValidlHandleClick(row) {
      if (row.validFlag == 1) {
        //从有效变成无效
        var flag = 2;
        this.$confirm("该操作将此隐患变成无效?", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.updateValid(flag, row.id);
          })
          .catch(() => {
            return;
          });
      } else if (row.validFlag == 2) {
        //从无效变成有效
        var flag = 1;
        this.$confirm("该操作将此隐患变成有效?", "提示", {
          distinguishCancelAndClose: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.updateValid(flag, row.id);
          })
          .catch(() => {
            return;
          });
      }
    },

    updateValid(flag, eventInfoId) {
      //改变有效性
      this.$http({
        url: this.$http.adornUrl("/event/eventinfo/updateEventInfoValidFlag"),
        method: "post",
        params: this.$http.adornParams({
          validFlag: flag,
          eventInfoId: eventInfoId,
        }),
      }).then(({ data }) => {
        // console.log("/event/eventinfo/updateEventInfoValidFlag")
        // 刷新表格数据
        this.$message({
          message: "操作成功",
          type: "success",
          duration: 1500,
          onClose: () => {
            this.getDataList();
          },
        });
      });
    },
    // 切换模式
    changeForm() {
      this.switchView = !this.switchView;
      this.getAllData();
    },

    // 当前显示条数
    sizeChangeHandle(val) {
      var that = this;
      this.pageSize = val;
      this.pageIndex = 1;
      this.getAllData();
      // console.log('当前显示条数', val)
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getAllData();
      // console.log('当前页当前页当前页', val)
    },
  },
};
</script>
<style lang="scss" scoped>
  .campusPeriphery {
    background-color: #ffffff;
    height: calc(100vh - 112px);
    .cardClass {
      padding: 3px;
      border: 1px solid rgba(230, 230, 230, 1);
      width: 100%;
      min-width: 540px;
      max-height: calc(100vh - 168px);
      overflow: auto;
    }
  }
</style>
