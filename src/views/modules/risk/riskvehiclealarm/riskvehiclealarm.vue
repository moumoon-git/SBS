<template>
  <!-- 车辆预警 -->
  <div class="mod-config">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
      style="min-width:1450px;"
    >
      <!-- <el-form-item>
        <el-select v-model="value" placeholder="请选择类型" size="small">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item>
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          unlink-panels
          v-model="dataForm.startEndAt"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-input
          class="search"
          v-model="dataForm.key"
          placeholder="请输入车牌号搜索"
          clearable
          size="small"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-input
          class="search"
          v-model="dataForm.cameraName"
          placeholder="请输入摄像头名称或摄像头编码搜索"
          clearable
          size="small"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-select v-model="dataForm.typeId" placeholder="请选择管控类型" clearable size="small">
          <el-option
            v-for="item in managementTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- <el-form-item>
        <el-input v-model="dataForm.cameraName" placeholder="请输入摄像头名称搜索" clearable></el-input>
      </el-form-item>-->

      <el-form-item>
        <el-button
          @click="search"
          style="background: #409eff;color: #fff;margin-left: initial;"
          type="primary"
          size="small"
        >查询</el-button>
        <el-button
          @click="exportData"
          style="background: #409eff;color: #fff;margin-left: initial;"
          type="primary"
          size="small"
        >导出</el-button>
        <el-button
          @click="switchingMode()"
          v-if="!switchView"
          style="background: #409eff;color: #fff;margin-left: initial;"
          type="primary"
          size="small"
        >列表模式</el-button>
        <el-button
          @click="switchingMode()"
          v-else
          style="background: #409eff;color: #fff;margin-left: initial;"
          type="primary"
          size="small"
        >卡片模式</el-button>
        <el-button
          @click="statisticalData()"
          style="background: #409eff;color: #fff;margin-left: initial;"
          type="primary"
          size="small"
        >统计</el-button>
        <!-- <el-button v-if="isAuth('risk:riskvehiclealarm:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <!-- <el-button v-if="isAuth('risk:riskvehiclealarm:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>

      <!-- <el-form-item>
        <el-button @click="getDataList()">筛选</el-button>
      </el-form-item>-->
    </el-form>

    <div class="cardClass">
      <template v-if="!switchView">
        <div class="list" v-loading="dataListLoading">
          <!-- 一个卡片单位 -->
          <div class="colStaff" v-for="item in dataList" :key="item.alarmId">
            <div style="position: absolute;font-size:0.9vw;font-weight:bold">
              <span>{{item.cameraName}}</span>
            </div>
            <div style="position: absolute;right: 4%;top:4%">
              <!--<span>{{item.alarmTime}}</span>-->
            </div>
            <!-- <div class="left" style="margin-top:16px;">
            <img style="width:162px;height:100%" :src="item.bkgPicUrl" alt />
            </div>-->
            <div>
              <div class="left" style="margin-top:25px;">
                <img
                  id="image"
                  :data-original="item.picAbbreviate"
                  :src="item.picAbbreviateMin"
                  style="height:180px;width:13vw;min-width:195px"
                />
              </div>
              <div class="right">
                <ul>
                  <li>
                    <label>车牌号：{{item.plateInfo}}</label>
                    <span></span>
                  </li>
                  <li>
                    <label>管控类型：{{item.typeName}}</label>
                    <span></span>
                  </li>
                  <li>
                    <label>车辆识别类型：{{item.type}}</label>
                    <span></span>
                  </li>
                  <li>
                    <label v-if="item.alarmTime">经过时刻：{{item.alarmTime.substring(0,19)}}</label>
                    <span></span>
                  </li>
                  <li>
                    <!-- <label>名单库:{{item.listLibName}}</label> -->
                    <!-- <span></span> -->
                  </li>
                  <li>
                    <el-button type="text" @click="addOrUpdateHandle(item.plateInfo)">抓拍信息</el-button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </template>

      <el-table :data="dataList" style="width: 100%" v-else v-loading="dataListLoading">
        <el-table-column label="抓拍图片" align="center" width="140">
          <template slot-scope="scope">
            <img
              id="image"
              :data-original="scope.row.picAbbreviate"
              :src="scope.row.picAbbreviateMin"
              style="height:100px;width:100px;min-width:100px;border:1px solid #ccc;"
            />
          </template>
        </el-table-column>
        <el-table-column prop="cameraName" label="地址" align="center"></el-table-column>
        <el-table-column prop="plateInfo" label="车牌号" align="center"></el-table-column>
        <el-table-column prop="typeName" label="管控类型" align="center"></el-table-column>
        <el-table-column prop="type" label="车辆识别类型" align="center"></el-table-column>
        <el-table-column prop="alarmTime" label="经过时刻" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="addOrUpdateHandle(scope.row.plateInfo)">抓拍信息</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div>
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[9, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./riskvehiclealarm-add-or-update";
import Viewer from "viewerjs";
export default {
  data() {
    return {
      dataForm: {
        key: "",
        cameraName: "",
        startEndAt: [],
        typeId: ""
      },
      managementTypeOptions: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 9,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      options: [
        {
          value: "所有车辆",
          label: "所有车辆"
        },
        {
          value: "黑名单车辆",
          label: "黑名单车辆"
        },
        {
          value: "建模车辆",
          label: "建模车辆"
        }
      ],
      value: "",
      showImg: false,
      carType: "",

      switchView: false //切换呈现形式
    };
  },
  mounted() {
    this.getDataTypeList();
    this.getDataList("");
  },
  components: {
    AddOrUpdate
  },
  //activated() {
  //this.getDataList("");
  //},
  methods: {
    // 预览图片
    initImageTools() {
      //初始化 viewerjs
      const ViewerDom = document.querySelectorAll("#image");
      for (let i = 0; i < ViewerDom.length; i++) {
        const viewer = new Viewer(ViewerDom[i], {
          url: "data-original"
        });
      }
    },

    //类型
    getDataTypeList() {
      this.$http({
        url: this.$http.adornUrl("/event/eventType/selectTypeList"),
        method: "get",
        params: this.$http.adornParams({
          typeFlag: 4
        })
      }).then(({ data }) => {
        data.list.forEach(element => {
          this.managementTypeOptions.push({
            value: element.id,
            label: element.name
          });
        });
      });
    },

    // 获取数据列表
    getDataList() {
      if (this.value == "所有车辆" || this.value == "") {
        this.carType = "";
      } else if (this.value == "黑名单车辆") {
        this.carType = 1;
      } else {
        this.carType = 2;
      }
      if (this.dataForm.startEndAt === null) {
        this.dataForm.startEndAt = [];
      }
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/risk/riskvehiclealarm/make-up"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          platformId: this.$store.state.user.platformId,
          pageType: this.carType,
          startAt: this.dataForm.startEndAt[0] || "",
          endAt: this.dataForm.startEndAt[1] || "",
          cameraName: this.dataForm.cameraName,
          typeId: this.dataForm.typeId
        })
      }).then(({ data }) => {
        // console.log("dlaskdasdasd1a23", data);
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
          this.dataList = data.page.records;
          this.totalPage = data.page.total;
          this.$nextTick(() => {
            this.initImageTools();
          });
          // this.pageIndex = 1
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });

      console.log(
        'document.getElementsByClassName("v-modal")[0]: ',
        document.getElementsByClassName("v-modal").style
      );
      setTimeout(() => {
        document.getElementsByClassName("v-modal")[0].style.zIndex = "2000";
        document.getElementsByClassName("el-dialog__wrapper")[4].style.zIndex =
          "2001";
      }, 300);
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.id;
          });
      this.$confirm(
        `确定对[id=${ids.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl("/risk/riskvehiclealarm/delete"),
          method: "post",
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getDataList();
              }
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    clickImg(e) {
      this.showImg = true; // 获取当前图片地址
      if (e) {
        this.imgSrc = e;
      } else {
        this.imgSrc = "../../../assets/img/load (1).jpg";
      }
    },
    viewImg() {
      this.showImg = false;
    },
    // 切换形式
    switchingMode() {
      this.switchView = !this.switchView;
      this.getDataList();
    },
    //统计分析
    statisticalData() {
      this.$router.push({
        path: "/vehicle/statisticalAnalysis/vehicle"
      });
    },
    // 导出
    exportData() {
      console.log("表单数据", this.dataForm);
      let httpaddress = window.SITE_CONFIG.baseUrl;
      // window.location.href = `${httpaddress}/risk/riskhumanalarm/xlsOutput?token=${this.$cookie.get('token')}&cameraName=${this.dataForm.cameraName}&typeId=${this.dataForm.typeId}&platformId=${this.$store.state.user.platformId}&startAt=${this.dataForm.startEndAt.length>0?this.dataForm.startEndAt[0]:''}&endAt=${this.dataForm.startEndAt.length>0?this.dataForm.startEndAt[1]:''}&key=${this.dataForm.key}`
      window.location.href = `${httpaddress}/risk/riskvehiclealarm/xlsOutput?t=1588849728526&key=${
        this.dataForm.key
      }&platformId=${this.$store.state.user.platformId}&pageType=&startAt=${
        this.dataForm.startEndAt.length > 0 ? this.dataForm.startEndAt[0] : ""
      }&endAt=${
        this.dataForm.startEndAt.length > 0 ? this.dataForm.startEndAt[1] : ""
      }&cameraName=${this.dataForm.cameraName}&typeId=${
        this.dataForm.typeId
      }&token=${this.$cookie.get("token")}`;

      // this.$http({
      //   url: this.$http.adornUrl("/risk/riskhumanalarm/xlsOutput"),
      //   method: "get",
      //   params: this.$http.adornParams({
      //     key: this.dataForm.key,
      //     startAt: this.dataForm.startEndAt[0] || "",
      //     endAt: this.dataForm.startEndAt[1] || "",
      //     platformId: this.$store.state.user.platformId,
      //     cameraName: this.dataForm.cameraName,
      //     typeId: this.dataForm.typeId
      //   })
      // }).then(({ data }) => {
      //     let eleLink = document.createElement('a')
      //     let url = window.URL.createObjectURL(data)
      //     let name = '人员预警信息.xls'
      //     eleLink.href = url
      //     eleLink.download = name
      //     document.body.appendChild(eleLink)
      //     eleLink.click()
      //     window.URL.revokeObjectURL(url)
      // })
    },
    // 查询
    search() {
      this.pageIndex = 1;
      this.getDataList();
    }
  }
};
</script>
<style scoped lang="less">
.search {
  width: 243px;
}
.cardClass {
  padding: 3px;
  border: 1px solid rgba(230, 230, 230, 1);
  width: 100%;
  // min-width: 1370px;
}
ul {
  margin: 0;
  padding: 0;
}
ul li {
  list-style: none;
}
.list {
  display: flex;
  justify-content: space-between;
  align-content: space-between;
  padding: 0px 10px 0px 10px;
  flex-wrap: wrap;
}
.list:after {
  content: "";
  width: 33%;
  border: 1px solid transparent;
}
.colStaff {
  // background-color: rgb(231, 240, 190);
  border-radius: 5px;
  width: 32%;
  min-width: 350px;
  padding: 5px;
  height: 220px;
  position: relative;
  margin-top: 5px;
  border: 1px solid #555;
  display: flex;
  > div {
    display: flex;
    margin-left: 10px;
  }
  .right {
    ul {
      padding-left: 10px;
      padding-top: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 13vw;
      min-width: 173px;
      li {
        line-height: 28px;
        text-align: left;
        label {
          overflow: hidden; /*自动隐藏文字*/
          text-overflow: ellipsis; /*文字隐藏后添加省略号*/
          white-space: nowrap; /*强制不换行*/
          width: 100%;
          display: inline-block;
        }
      }
    }
  }
  .left {
    margin-top: 16px;
    // border: 1px solid #555;
    .el-image {
      img {
        width: 100%;
        height: 100%;
      }
    }
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
  // margin: auto;
  z-index: 1000;
}
</style>
