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
      <div class="clearfloat">
        <!-- <el-image style="width: 200px; height: 200px" class="blackListFaceImg" :src="dataForm.facePicUrl" fit="fill"></el-image> -->

        <img
          id="image"
          :data-original="
            dataForm.length > 0 ? dataForm[0].picAbbreviate : '未知'
          "
          :src="dataForm.length > 0 ? dataForm[0].picAbbreviateMin : '未知'"
          style="width: 200px; height: 200px;margin-right:2vw"
        />

        <div class="textBox" style="width:200px">
          <p>时间:{{ dataForm.length > 0 ? dataForm[0].alarmTime : "未知" }}</p>
          <p>
            车牌号:{{ dataForm.length > 0 ? dataForm[0].plateInfo : "未知" }}
          </p>
          <p>车辆类型:{{ dataForm.length > 0 ? dataForm[0].type : "未知" }}</p>
          <p>
            摄像头名称:{{
              dataForm.length > 0 ? dataForm[0].cameraName : "未知"
            }}
          </p>
        </div>
      </div>

      <el-row class="riskvehiclealarm-table">
        <el-form
          :inline="true"
          :model="timeStrings"
          @keyup.enter.native="init(index)"
          style="margin-top:1vh;height:5vh"
        >
          <el-form-item>
            <el-input
              v-model="timeStrings.cameraName"
              placeholder="请输入摄像头名"
              clearable
              size="small"
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
              size="small"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="init(index)" type="primary" size="small"
              >查询</el-button
            >
            <!-- <el-button v-if="isAuth('risk:riskhuamnalarminfo:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
            <!-- <el-button v-if="isAuth('risk:riskhuamnalarminfo:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
          </el-form-item>
        </el-form>
        <el-col>
          <el-table :data="dataForm" style="width: 100%;overflow:auto">
            <el-table-column
              prop="alarmTime"
              header-align="center"
              align="center"
              label="抓拍时间"
              width="110"
            ></el-table-column>
            <el-table-column
              prop="plateInfo"
              header-align="center"
              align="center"
              label="车牌号"
            ></el-table-column>
            <el-table-column
              prop="cameraName"
              header-align="center"
              align="center"
              label="摄像头"
            ></el-table-column>
            <el-table-column
              prop="cameraAddress"
              header-align="center"
              align="center"
              label="卡口地址"
            ></el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              label="抓拍图片"
              width="225"
            >
              <template slot-scope="scope">
                <img
                  id="image"
                  :data-original="scope.row.picAbbreviate"
                  :src="scope.row.picAbbreviateMin"
                  style="width: 100px; height: 100px;"
                />

                <viewer
                  :images="[scope.row.picPlate ? scope.row.picPlate : imageUrl]"
                >
                  <img
                    id="image"
                    v-for="(item, index) in [
                      scope.row.picPlate ? scope.row.picPlate : imageUrl
                    ]"
                    :src="item"
                    :key="index"
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
            :page-sizes="[4, 8, 12, 16]"
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
      <!--点击查看，弹出查看窗口-->
      <riskvehiclealarm-view
        v-if="riskvehiclealarmViewVisible"
        ref="riskvehiclealarmView"
      ></riskvehiclealarm-view>
      <!--点击派单，弹出查看窗口-->
      <riskvehiclealarm-order
        v-if="riskvehiclealarmOrderVisible"
        ref="riskvehiclealarmOrder"
        :index="index"
        @upDataTable="init($event)"
      ></riskvehiclealarm-order>
    </el-dialog>
  </div>
</template>

<script>
import riskvehiclealarmView from "./riskvehiclealarm-view";
import riskvehiclealarmOrder from "./riskvehiclealarm-order";
import Viewer from "viewerjs";
export default {
  components: {
    "riskvehiclealarm-view": riskvehiclealarmView,
    "riskvehiclealarm-order": riskvehiclealarmOrder
  },
  data() {
    return {
      visible: false,
      dataForm: [],
      index: "",
      pageIndex: 1,
      pageSize: 4,
      totalPage: 0,
      imgSrc: "",
      showImg: false,
      // 查看弹窗默认关
      riskvehiclealarmViewVisible: false,
      riskvehiclealarmOrderVisible: false,
      id: "",
      timeStrings: {
        name: "",
        startEndAt: null,
        cameraName: ""
      },
      imageUrl: require("../../../../assets/img/load (1).jpg")
    };
  },
  methods: {
    // 预览图片
    initImageTools() {
      //初始化 viewerjs
      const ViewerDom = document.querySelectorAll("#image");
      console.log("ViewerDomViewerDom", ViewerDom);
      ViewerDom.forEach(item => {
        const viewer = new Viewer(item, {
          url: "data-original"
        });
      });
    },
    init(id) {
      // alert(id)
      console.log(this.timeStrings.startEndAt);
      this.index = id;
      this.visible = true;
      this.$http({
        url: this.$http.adornUrl(`/risk/riskvehiclealarm/make-up`),
        method: "get",
        params: this.$http.adornParams({
          limit: this.pageSize,
          carNum: id,
          page: this.pageIndex,
          platformId: this.$store.state.user.platformId,
          startAt: this.timeStrings.startEndAt
            ? this.timeStrings.startEndAt[0]
            : "",
          endAt: this.timeStrings.startEndAt
            ? this.timeStrings.startEndAt[1]
            : "",
          cameraName: this.timeStrings.cameraName
        })
      }).then(({ data }) => {
        // console.log("/risk/riskvehiclealarm/make-up", data);
        if (data && data.code === 0) {
          data.page.records.map(v => {
            // console.log(typeof v.type)
            switch (v.type) {
              case 0:
                v.type = "其它车型";
                break;
              case 1:
                v.type = "客车";
                break;
              case 2:
                v.type = "货车";
                break;
              case 3:
                v.type = "轿车";
                break;
              case 4:
                v.type = "面包车";
                break;
              case 5:
                v.type = "小货车";
                break;
              case 6:
                v.type = "行人";
                break;
              case 7:
                v.type = "二轮车";
                break;
              case 8:
                v.type = "三轮车";
                break;
              case 9:
                v.type = "SUV/MPV";
                break;
              case 10:
                v.type = "中型客车";
                break;
            }
          });
          this.dataForm = data.page.records;
          this.totalPage = data.page.total;
          this.$nextTick(() => {
            this.initImageTools();
          });
          // console.log(this.dataForm);
        }
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.init(this.index);
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.init(this.index);
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
        this.$refs.riskvehiclealarmView.init(row, 4);
      });
    },
    // 父组件点击派单，触发子组件方法"
    order(row) {
      // 派单
      this.riskvehiclealarmOrderVisible = true;
      this.$nextTick(() => {
        this.$refs.riskvehiclealarmOrder.init(row, "车辆预警", 4);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.riskvehiclealarm-table {
  .el-tooltip__popper {
    max-width: 45%;
  }
  tr {
    th {
      div {
        text-align: center;
      }
    }
    td {
      div {
        text-align: center;
      }
    }
  }
}
.infoclass {
  .clearfloat:after {
    content: "";
    display: block;
    clear: both;
    visibility: hidden;
    height: 0;
  }
  .clearfloat {
    zoom: 1;
    display: flex;
  }
  .el-dialog__body {
    padding: 5px 20px;
  }
  .el-dialog {
    // width: 55% !important;
  }
  // .cardBox {
  //   margin: 10px;
  //   width: 540px;
  //   height: auto;
  //   border: 1px solid black;
  //   border-top: none;
  //   .boxFooter {
  //     margin-top: 10px;
  //     height: auto;
  //     background: black;
  //     clear: both;
  //   }
  //   .title {
  //     font-size: 16px;
  //     color: white;
  //     height: 24px;
  //     background-color: black;
  //     text-align: left;
  //   }
  //   .blackListFaceImg {
  //     margin: 20px;
  //     /* padding: 20px; */
  //     width: 220px;
  //     height: 200px;
  //     border: 1px solid black;
  //     float: left;
  //   }
  //   .textBox {
  //     margin: 20px;
  //     width: 220px;
  //     height: 200px;
  //     float: right;
  //   }
  // }
  .el-table td div {
    float: right;
  }
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
}
</style>
