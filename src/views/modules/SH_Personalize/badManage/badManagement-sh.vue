<template>
  <div class="campusPeriphery" style="height: initial !important">
    <bad-management-header
      @searchHandle="searchHandle"
      :platformTypeId="platformTypeId"
      :pageType="pageTypeName"
      @exportEventData="exportEventData"
    ></bad-management-header>

    <div class="cardClass">
      <div class="list">
        <bad-management-table
          ref="table"
          :tableData="tableDataDisplay"
          @formFindHandleClick="formFindHandleClick"
          @formManuaVerifylHandleClick="formManuaVerifylHandleClick"
          @updateValidlHandleClick="updateValidlHandleClick"
        ></bad-management-table>
      </div>

      <div>
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[16, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>

    <!--点击查看，弹出查看窗口-->
    <word-manager-view
      :visible.sync="wordMangerViewVisible"
      ref="wordManagerView"
      append-to-body
      z-index="2"
    ></word-manager-view>
    <!--点击编辑，弹出派单窗口-->
    <word-manager-verify
      v-if="wordmanagerVerify"
      ref="wordmanagerVerify"
    ></word-manager-verify>
  </div>
</template>

<script>
import badManagementHeader from "./badManagement-header";
import badManagementTable from "./badManagement-table";
import WordManagerView from "./wordmanager-view";
import wordmanagerVerify from "./wordmanager-verify";

export default {
  data() {
    return {
      pageTypeName: "sh",
      // 分页
      pageIndex: 1, // 当前页
      pageSize: 16, // 单页显示数据
      totalPage: 100, // 总条数

      // 共享平台id数组
      sharePlatfromArray: [],

      // 搜索条件
      audited: "",
      startTime: "",
      endTime: "",
      searchTitle: "",
      sharePatformId: "",
      eventTypeId: "",
      shareTownId: "",

      // 全部表格数据
      tableDataDisplay: [],

      //查看工单组件弹窗
      wordMangerViewVisible: false,
      wordmanagerVerify: false,
      platformTypeId: 6,
    };
  },
  components: {
    "bad-management-header": badManagementHeader,
    "bad-management-table": badManagementTable,
    "word-manager-view": WordManagerView,
    "word-manager-verify": wordmanagerVerify,
  },
  created() {
    // 表格数据
    this.getDataList();
  },
  methods: {
    // 初始化数据
    getDataList() {
      // 判断类型
      // if (this.eventTypeId == null || this.eventTypeId == '') {
      //   this.eventTypeId = ''
      // }

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
            this.getAllData(null);
          } else {
            this.$message.error(data.msg);
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
      // console.log(objTime)
      if (objTime !== null || objTime !== "") {
        // 时间不为空
        this.startTime = objTime[0];
        this.endTime = objTime[1];
      }

      this.audited = objValid;
      this.sharePatformId = objPlatformId;
      this.eventTypeId = objTypearray;
      this.searchTitle = objContent;
      this.shareTownId = shareTownId;

      this.downloadWordExcel();
    },

    // 下载工单数据
    downloadWordExcel() {
      // 判断类型
      // if (this.eventTypeId == null || this.eventTypeId == '') {
      //   this.eventTypeId = ''
      // }

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
          } else {
            this.$message.error(data.msg);
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
      // console.log("获取下载工单表格的数据接口", this.sharePlatfromArray);

      //flagType放开数据限制 flagType: 0,
      let eventInfoConditionEntity = {
        audited: this.audited,
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
        if (data.code === 0) {
          let eleLink = document.createElement("a");
          let url = window.URL.createObjectURL(data);
          let name = "工单统计.xls";
          eleLink.href = url;
          eleLink.download = name;
          document.body.appendChild(eleLink);
          eleLink.click();
          window.URL.revokeObjectURL(url);
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 获取全部工单数据
    getAllData(status) {
      // console.log(this.eventTypeId);
      // console.log(this.audited)
      // console.log('getAllData获取全部工单数据', status,this.pageIndex,this.pageSize)
      //flagType放开数据限制 flagType: 0,
      let eventInfoConditionEntity = {
        //  indexCode: '',
        startTime: this.startTime,
        endTime: this.endTime,
        // orderType: '',
        // orderField: '',
        audited: this.audited !== "" ? this.audited : undefined,
        intelligentType: 13,
        // originalType: '',
        limit: this.pageSize,
        page: this.pageIndex,
      };

      this.$http({
        url: this.$http.adornUrl("/violation/list"),
        method: "get",
        params: this.$http.adornParams(eventInfoConditionEntity, false),
      }).then(({ data }) => {
        if (data.code === 0) {
          this.tableDataDisplay = data.data.list;
          this.tableDataDisplay.map((v) => {
            switch (v.intelligentType) {
              case "0":
                v.intelligentType = "未违规";
                break;
              case "1":
                v.intelligentType = "店外经营";
                break;
              case "2":
                v.intelligentType = "游摊小贩";
                break;
              case "3":
                v.intelligentType = "占道经营";
                break;
              case "4":
                v.intelligentType = "乱堆物堆料";
                break;
              case "5":
                v.intelligentType = "非机动车";
                break;
              case "6":
                v.intelligentType = "户外广告";
                break;
              case "7":
                v.intelligentType = "打包垃圾";
                break;
              case "8":
                v.intelligentType = "违规撑伞";
                break;
              case "9":
                v.intelligentType = "垃圾箱满溢";
                break;
              case "10":
                v.intelligentType = "垃圾箱满溢";
                break;
              case "11":
                v.intelligentType = "暴露垃圾";
                break;
              case "12":
                v.intelligentType = "沿街晾晒";
                break;
              case "13":
                v.intelligentType = "人群聚集";
                break;
              case "2000":
                v.intelligentType = "违章停车";
                break;
              default:
                v.intelligentType = "未知";
                break;
            }
          });
          this.pageSize = data.data.pageSize;
          this.pageIndex = data.data.currPage;
          this.totalPage = data.data.totalCount;
          this.$nextTick(() => {
            // 加载列表预览图片
            this.$refs.table.initImageTools();
          });
          // console.log(data.data.totalPages)
          // 根据返回的总页数，请求最后一页的条数，得到总条数
        } else {
          this.tableDataDisplay = [];
          this.totalPage = 0;
          this.$message.error(res.msg);
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
      shareTownId
    ) {
      // console.log(objTime);
      // var objEventTypeId;
      // if (objTypearray != null && objTypearray != '') {
      //   // objPlatformId是共享平台的id
      //   var typearray = objTypearray.slice(-1).join(',')
      //   objEventTypeId = Number(typearray)
      // } else {
      //   objEventTypeId = ''
      // }

      if (objTime != null && objTime != "") {
        // 时间不为空
        this.startTime = objTime[0];
        this.endTime = objTime[1];
      }

      this.audited = objValid;
      this.sharePatformId = objPlatformId;
      this.eventTypeId = objTypearray;
      this.searchTitle = objContent;
      this.shareTownId = shareTownId;
      this.pageIndex = 1;

      // console.log("条件查询条件查询条件查询",startTime,endTime)

      this.getDataList();
    },

    formFindHandleClick(row) {
      // 查看
      // console.log("点击查看", row);
      this.wordMangerViewVisible = true;
      this.$nextTick(() => {
        this.$refs.wordManagerView.init(row);
      });
    },

    formManuaVerifylHandleClick(row) {
      // 编辑
      // console.log(row);
      this.wordmanagerVerify = true;
      this.$nextTick(() => {
        this.$refs.wordmanagerVerify.init(row);
      });
    },

    updateValidlHandleClick(row) {
      if (row.audited == 0) {
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
      } else if (row.audited == 1) {
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
        url: this.$http.adornUrl("/event/eventinfo/updateEventInfoaudited"),
        method: "post",
        params: this.$http.adornParams({
          audited: flag,
          eventInfoId: eventInfoId,
        }),
      }).then(({ data }) => {
        if (data.code === 0) {
          // console.log("/event/eventinfo/updateEventInfoaudited");
          // 刷新表格数据
          this.$message({
            message: "操作成功",
            type: "success",
            duration: 1500,
            onClose: () => {
              this.getDataList();
            },
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 当前显示条数
    sizeChangeHandle(val) {
      var that = this;
      this.pageSize = val;
      this.pageIndex = 1;
      this.getAllData();
      // console.log("当前显示条数", val);
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getAllData();
      // console.log("当前页当前页当前页", val);
    },
  },
};
</script>
<style lang="scss" scoped>
.cardClass {
  padding: 3px;
  border: 1px solid rgba(230, 230, 230, 1);
  width: 100%;
  min-width: 540px;
}
</style>
