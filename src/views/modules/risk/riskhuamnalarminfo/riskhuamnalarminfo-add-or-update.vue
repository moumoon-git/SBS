<template>
  <div>
    <el-dialog
      v-dialogDrag
      class="infoclass"
      title="抓拍信息"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="800px"
      :append-to-body="true"
    >
      <!-- <el-row :gutter="20"> -->
      <!--左边是事件详情表单-->
      <!-- <el-col :span="24"> -->
      <div class="clearfloat">
        <!-- <img style="width:200px;margin-right:2vw" class="blackListFaceImg" :src="dataForm.facePicUrl" > -->

        <!-- <el-image style="width: 200px; height: 200px" class="blackListFaceImg" :src="dataForm.facePicUrl" fit="fill"></el-image> -->
        <viewer
          :images="[
            dataForm.facePicUrl && dataForm.facePicUrl.length > 97
              ? imageUrl
              : dataForm.facePicUrl
          ]"
          v-if="
            dataForm.facePicUrl && dataForm.facePicUrl.indexOf('http') !== -1
          "
        >
          <img
            class="blackListFaceImg"
            :src="
              dataForm.facePicUrl && dataForm.facePicUrl.length > 97
                ? imageUrl
                : dataForm.facePicUrl
            "
            style="width: 200px; height: 200px;margin-right:2vw"
          />
        </viewer>

        <viewer
          :images="[
            dataForm.facePicUrl && dataForm.facePicUrl.length > 97
              ? imageUrl
              : dataForm.facePicUrl
          ]"
          v-else
        >
          <img
            class="blackListFaceImg"
            :src="
              dataForm.facePicUrl && dataForm.facePicUrl.length > 97
                ? imageUrl
                : backgroundURL + '/' + dataForm.facePicUrl
            "
            style="width: 200px; height: 200px;margin-right:2vw"
          />
        </viewer>

        <div class="textBox" style="width:200px">
          <p>姓名:{{ dataForm.humanName }}</p>
          <p>
            性别:{{
              dataForm.sex === 0 ? "未知" : dataForm.sex == 1 ? "男" : "女"
            }}
          </p>
          <p>证件号:{{ dataForm.credentialsNum }}</p>
          <p>人脸识别类型:{{ dataForm.listLibName }}</p>
          <p>出生日期:{{ dataForm.birthday }}</p>
        </div>
      </div>

      <el-row class="riskvehiclealarm-table">
        <el-form
          :inline="true"
          :model="timeStrings"
          @keyup.enter.native="tableData()"
          style="margin-top:1vh;height:5vh"
        >
          <el-form-item>
            <el-input
              v-model="timeStrings.cameraName"
              placeholder="请输入摄像头名称搜索"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              unlink-panels
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="timeStrings.startEndAt"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="tableData()">查询</el-button>
            <!-- <el-button v-if="isAuth('risk:riskhuamnalarminfo:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
            <!-- <el-button v-if="isAuth('risk:riskhuamnalarminfo:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
          </el-form-item>
        </el-form>
        <el-col>
          <el-table :data="timeData" style="width: 100%;overflow:auto">
            <el-table-column
              prop="alarmTime"
              header-align="center"
              align="center"
              label="抓拍时间"
              width="110"
            ></el-table-column>
            <el-table-column
              prop="cameraName"
              header-align="center"
              align="center"
              label="摄像头"
            ></el-table-column>
            <el-table-column
              prop="address"
              header-align="center"
              align="center"
              label="抓拍地点"
            ></el-table-column>
            <el-table-column
              prop="status"
              header-align="center"
              align="center"
              label="状态"
            ></el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              label="抓拍图片"
              width="225"
            >
              <template slot-scope="scope" style="display:flex">
                <viewer :images="[scope.row.bkgPicUrl]">
                  <img
                    id="image"
                    :data-original="scope.row.bkgPicUrl"
                    :src="scope.row.bkgPicMinUrl"
                    style="width:100px;height:100px;"
                  />
                </viewer>
                <viewer :images="[scope.row.facePicUrl]">
                  <img
                    v-if="scope.row.facePicUrl"
                    :src="
                      scope.row.facePicUrl.indexOf('http') === -1
                        ? backgroundURL + '/' + scope.row.facePicUrl
                        : scope.row.facePicUrl
                    "
                    width="100"
                    height="100"
                  />
                  <img
                    v-else
                    :src="scope.row.facePicUrl"
                    width="100"
                    height="100"
                  />
                </viewer>
              </template>
            </el-table-column>
            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="100"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  v-if="scope.row.eventInfoId"
                  style="margin-left:27px"
                  @click="formFindHandleClick(scope.row)"
                  >查看</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  style="margin-left:27px"
                  v-else
                  @click="order(scope.row)"
                  >派单</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[3, 6, 9, 12]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper"
          ></el-pagination>
        </el-col>
      </el-row>
      <!-- 过渡动画 -->
      <transition name="fade" v-if="showImg">
        <div class="img-view" @click="viewImg">
          <!-- 遮罩层 -->
          <div class="img-layer"></div>
          <div class="img">
            <img :src="imgSrc" />
          </div>
        </div>
      </transition>
      <!-- </el-col> -->
      <!-- </el-row> -->
      <!--点击查看，弹出查看窗口-->
      <riskvehiclealarm-view
        v-if="riskvehiclealarmViewVisible"
        ref="riskvehiclealarmView"
      ></riskvehiclealarm-view>
      <!--点击派单，弹出查看窗口-->
      <riskvehiclealarm-order
        v-if="riskvehiclealarmOrderVisible"
        ref="riskvehiclealarmOrder"
        :index="dataForm.id"
        @upDataTable="init($event)"
      ></riskvehiclealarm-order>
    </el-dialog>
  </div>
</template>

<script>
import riskvehiclealarmView from "../riskvehiclealarm/riskvehiclealarm-view";
import riskvehiclealarmOrder from "../riskvehiclealarm/riskvehiclealarm-order";
import Viewer from "viewerjs";
export default {
  components: {
    "riskvehiclealarm-view": riskvehiclealarmView,
    "riskvehiclealarm-order": riskvehiclealarmOrder
  },
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0
      },
      pageIndex: 1,
      pageSize: 3,
      totalPage: 0,
      timeData: [],
      riskvehiclealarmViewVisible: false,
      riskvehiclealarmOrderVisible: false,
      showImg: false,
      humanId: "",
      id: "",
      timeStrings: {
        name: "",
        startEndAt: [],
        cameraName: ""
      },
      imageUrl: require("../../../../assets/img/load (1).jpg"),
      backgroundURL: window.SITE_CONFIG.baseUrl
    };
  },
  methods: {
    // 预览图片
    initImageTools() {
      //初始化 viewerjs
      const ViewerDom = document.querySelectorAll("#image");
      ViewerDom.forEach(item => {
        if (typeof ViewerDom[i] === "object") {
          const viewer = new Viewer(item, {
            url: "data-original"
          });
        }
      });
    },
    init(id,listLibName) {
      // console.log(id);
      this.dataForm.id = id;
      this.visible = true;
      this.$http({
        url: this.$http.adornUrl(`/risk/riskhuamnalarminfo/info`),
        method: "get",
        params: this.$http.adornParams({
          limit: 10,
          id: this.dataForm.id
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data);
          var credentialsNum = data.riskHumanAlarmInfo.credentialsNum;
          this.humanId = data.riskHumanAlarmInfo.humanId;
          this.dataForm = { ...data.riskHumanAlarmInfo };
          this.dataForm.credentialsNum =
            credentialsNum.slice(0, 6) +
            "xxxxxxxx" +
            credentialsNum.slice(
              credentialsNum.length - 4,
              credentialsNum.length
            );
          this.dataForm.listLibName = listLibName;
          this.tableData();
          this.$nextTick(() => {
            this.initImageTools();
          });
        }
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.tableData();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.tableData(val);
    },
    clickImg(e) {
      // console.log(e);
      this.showImg = true; // 获取当前图片地址
      if (e) {
        this.imgSrc = e;
      } else {
        this.imgSrc = "../../../../assets/img/load (1).jpg";
      }
    },
    viewImg() {
      this.showImg = false;
    },
    // 子组件点击查看，触发父组件方法"
    formFindHandleClick(row) {
      // 查看
      this.riskvehiclealarmViewVisible = true;
      this.$nextTick(() => {
        this.$refs.riskvehiclealarmView.init(row);
      });
    },
    // 父组件点击派单，触发子组件方法"
    order(row) {
      // 派单
      this.riskvehiclealarmOrderVisible = true;
      this.$nextTick(() => {
        this.$refs.riskvehiclealarmOrder.init(row, "人员预警", 3);
      });
    },
    tableData() {
      if (this.timeStrings.startEndAt === null) {
        this.timeStrings.startEndAt = [];
      }
      this.$http({
        url: this.$http.adornUrl(`/risk/riskhuamnalarminfo/getHumanAlarmList`),
        method: "get",
        params: this.$http.adornParams({
          limit: this.pageSize,
          humanId: this.humanId,
          page: this.pageIndex,
          startAt: this.timeStrings.startEndAt[0],
          endAt: this.timeStrings.startEndAt[1],
          cameraName: this.timeStrings.cameraName
        })
      }).then(({ data }) => {
        // console.log(data);
        if (data && data.code === 0) {
          this.timeData = [...data.page.records];
          this.totalPage = data.page.total;
          // console.log(
          //   "dsa4d2313-----------------------------------------------------",
          //   this.timeData
          // );
        }
      });
    }
  }
};
</script>
<style lang="less">
.infoclass {
  margin: 0;
  padding: 0;

  .clearfloat:after {
    content: "";
    display: block;
    clear: both;
    visibility: hidden;
    height: 0;
  }
  .clearfloat {
    display: flex;
    zoom: 1;
    margin-right: 28px;
    margin-left: 10vw;
  }
  .el-dialog__body {
    // display: flex;
    padding: 5px 20px;
    padding-bottom: 20px;
  }
  // .el-dialog {
  //   width: 45% !important;
  // }
  .cardBox {
    width: 465px;
    height: auto;
    border-top: none;
    .boxFooter {
      width: 200px;
      margin-top: 10px;
      height: auto;
      background: black;
      clear: both;
    }
    .title {
      font-size: 16px;
      color: white;
      height: 24px;
      background-color: black;
      text-align: left;
    }
    .blackListFaceImg {
      margin-right: 20px;
      /* padding: 20px; */
      width: 220px;
      height: 200px;
      border: 1px solid black;
    }
    .textBox {
      margin: 20px;
      margin-left: 0;
      width: 200px;
      height: 200px;
    }
  }
  .picList {
    &::-webkit-scrollbar {
      width: 0 !important;
    }
    &::-webkit-scrollbar {
      width: 0 !important;
      height: 0;
    }
  }
  .el-table td div {
    float: right;
  }

  // .el-table .cell{
  //   display: flex;
  // }
}
/*动画*/
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s linear;
  transform: translate3D(0, 0, 0);
}
.fade-enter,
.fade-leave-active {
  transform: translate3D(100%, 0, 0);
}
/* bigimg */
.img-view {
  position: inherit;
  width: 100%;
  height: 100%;
}
/*遮罩层样式*/
.img-view .img-layer {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  width: 100%;
  height: 100%;
  overflow: hidden;
}
/*不限制图片大小，实现居中*/
.img-view .img img {
  width: 400px;
  height: 400px;
  display: block;
  position: absolute;
  top: calc(50% - 200px);
  right: calc(50% - 200px);
  z-index: 1000;
  z-index: 1000;
}
</style>
