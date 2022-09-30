<template>
  <!-- 人员预警 -->
  <div class="mod-config">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="this.pageIndex=1;getDataList()"
      style="min-width:1350px;"
    >
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
        <el-input class="search" v-model="dataForm.key" placeholder="请输入名字或身份证搜索" clearable size="small"></el-input>
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
        <el-button @click="pageIndex=1;getDataList()" style="background: #409eff;color: #fff;margin-left: initial;" type="primary" size="small">查询</el-button>
        <el-button @click="exportData" style="background: #409eff;color: #fff;margin-left: initial;" type="primary" size="small">导出</el-button>
        <el-button  @click="switchingMode()" v-if="!switchView" style="background: #409eff;color: #fff;margin-left: initial;" type="primary" size="small">列表模式</el-button>
        <el-button  @click="switchingMode()" v-else style="background: #409eff;color: #fff;margin-left: initial;" type="primary" size="small">卡片模式</el-button>
        <el-button  @click="statisticalData()" style="background: #409eff;color: #fff;margin-left: initial;" type="primary" size="small">统计</el-button>
        <!-- <el-button v-if="isAuth('risk:riskhuamnalarminfo:save')" type="primary" size="small" @click="addOrUpdateHandle()">新增</el-button> -->
        <!-- <el-button v-if="isAuth('risk:riskhuamnalarminfo:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <div class="cardClass">
      <template v-if="!switchView">
      <div class="list">
        <!-- 一个卡片单位 -->
        <div class="colStaff" v-for="(item,index) in dataList" :key="index">
          <div style="position: absolute;font-size:0.9vw;font-weight:bold">
            <span>{{item.cameraName}}</span>
          </div>
          <div style="position: absolute;right: 4%;top:4%">
            <span>{{item.alarmTime}}</span>
          </div>

          <div>
            <div class="left" style="margin-top:25px;width:8vw;height:181px;min-width:120px">
              <img
                id="image"
                :data-original="item.bkgPicUrl"
                :src="item.bkgPicMinUrl"
              />
            </div>
            <div class="left" style="margin-top:25px;height:180px;">
              <viewer :images="[item.smallPicUrl.length>97?imageUrl:item.smallPicUrl]" v-if="item.smallPicUrl.indexOf('http') !== -1" style="width:8vw;height:180px;min-width:120px">
                <img
                  v-for="(item,index) in [item.smallPicUrl.length>97?imageUrl:item.smallPicUrl]"
                  :src="item"
                  :key="index"
                  style="width:100%;height:100%"
                />
              </viewer>
              <viewer :images="[item.smallPicUrl.length>97?imageUrl:item.smallPicUrl]" v-else style="width:8vw;height:180px;min-width:120px">
                <img
                  v-for="(item,index) in [item.smallPicUrl.length>97?imageUrl:item.smallPicUrl]"
                  :src="backgroundURL+'/'+item"
                  :key="index"
                  style="width:100%;height:100%"
                />
              </viewer>
            </div>

            <div class="right">
              <ul>
                <li style="font-weight:bold;">
                  <label>姓名：{{item.humanName}}</label>
                  <span></span>
                </li>
                <li>
                  <label>性别：{{item.sex === 2 ? "女": "男" }}</label>
                  <span></span>
                </li>
                <li>
                  <label>管控类型：{{item.listLibName}}</label>
                  <span></span>
                </li>
                <li v-if="item.similarity">
                  <label>相似度：{{item.similarity}}</label>
                  <span></span>
                </li>
                <li>
                  <el-button type="text" @click="addOrUpdateHandle(item.id,item.listLibName)">抓拍信息</el-button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </template>

      <el-table :data="dataList" style="width: 100%" v-else>
      <el-table-column label="抓拍图片" align="center" width="260">
        <template slot-scope="scope">
          <div style="display:flex;justify-content: center">
          <div>
                <!-- <viewer :images="[item.bkgPicUrl?item.bkgPicUrl:imageUrl]">
                  <img
                      v-for="(item,index) in [item.bkgPicUrl?item.bkgPicUrl:imageUrl]"
                      :src="item"
                      :key="index"
                      style="width:8vw;height:100%;min-width:120px"
                    >
                </viewer>-->
                <!-- <img
                      id="image"
                      src="../../../../assets/img/0.png"
                      data-original="../../../../assets/img/0.png"
                      style="width:8vw;height:100%;min-width:120px"
                >-->
                <img
                  id="image"
                  :data-original="scope.row.bkgPicUrl"
                  :src="scope.row.bkgPicMinUrl"
                  style="width:100px;height:100px;min-width:100px;border:1px solid #ccc;"
                />
              </div>
              <div>
                <viewer :images="[scope.row.smallPicUrl.length>97?imageUrl:scope.row.smallPicUrl]" v-if="scope.row.smallPicUrl.indexOf('http') !== -1" style="width:100px;height:100px;min-width:100px">
                  <img
                    v-for="(item,index) in [scope.row.smallPicUrl.length>97?imageUrl:scope.row.smallPicUrl]"
                    :src="item"
                    :key="index"
                    style="width:100%;height:100%"
                  />
                </viewer>
                <viewer :images="[scope.row.smallPicUrl.length>97?imageUrl:scope.row.smallPicUrl]" v-else style="width:100px;height:100px;min-width:100px">
                  <img
                    v-for="(item,index) in [scope.row.smallPicUrl.length>97?imageUrl:scope.row.smallPicUrl]"
                    :src="backgroundURL+'/'+item"
                    :key="index"
                    style="width:100%;height:100%"
                  />
                </viewer>
              </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="cameraName" label="地点" align="center"></el-table-column>
      <el-table-column prop="alarmTime" label="时间" align="center" width="180"></el-table-column>
      <el-table-column prop="humanName" label="姓名" align="center" width="200"></el-table-column>
      <el-table-column label="性别" align="center" width="60">
        <template slot-scope="scope">{{scope.row.sex === 2 ? "女": "男" }}</template>
      </el-table-column>
      <el-table-column prop="listLibName" label="管控" align="center" width="140"></el-table-column>
      <el-table-column prop="similarity" label="相似度" align="center" width="80"></el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="addOrUpdateHandle(scope.row.id)">抓拍信息</el-button>
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
    <!-- 弹窗 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./riskhuamnalarminfo-add-or-update";
import { isNull } from "util";
import Viewer from "viewerjs";
export default {
  data() {
    return {
      dataForm: {
        key: "",
        startEndAt: [],
        cameraName: "",
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
      showImg: false,
      imageUrl: require("../../../../assets/img/load (1).jpg"),
      backgroundURL: window.SITE_CONFIG.baseUrl,

      switchView: false,//切换呈现形式
    };
  },
  components: {
    AddOrUpdate
  },

  mounted() {
    this.getDataTypeList();
    this.getDataList();
  },

  methods: {
    // 预览图片
    initImageTools() {
      //初始化 viewerjs
      setTimeout(()=>{
        const ViewerDom = document.querySelectorAll("#image");

      for(let i=0;i<ViewerDom.length;i++){
          if(typeof ViewerDom[i]==='object'){
            // console.log("ViewerDom[i]",ViewerDom[i])
            const viewer = new Viewer(ViewerDom[i], {
              url: "data-original"
            });
          }

        }
      });
    },

    //类型
    getDataTypeList(){
      this.$http({
        url: this.$http.adornUrl(`/event/eventType/selectTypeList`),
        method: "get",
        params: this.$http.adornParams({
          typeFlag: 3
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
      if (this.dataForm.startEndAt === null) {
        this.dataForm.startEndAt = [];
      }
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/risk/riskhumanalarm/make-up"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          startAt: this.dataForm.startEndAt[0] || "",
          endAt: this.dataForm.startEndAt[1] || "",
          platformId: this.$store.state.user.platformId,
          cameraName: this.dataForm.cameraName,
          typeId: this.dataForm.typeId
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data);
          data.page.records.map(v => {
            if (v.similarity) {
              v.similarity = (v.similarity * 100).toFixed(1) + "%";
            }
          });
          this.dataList = data.page.records;
          this.totalPage = data.page.total;
          this.$nextTick(() => {
            this.initImageTools();
          });
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
    // 查看
    addOrUpdateHandle(id,listLibName) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id,listLibName);
      });
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
          url: this.$http.adornUrl("/risk/riskhuamnalarminfo/delete"),
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
      // console.log(e);
      if (e) {
        this.imgSrc = e;
      } else {
        this.imgSrc = "../../../../assets/img/load (1).jpg";
      }
    },
    viewImg() {
      this.showImg = false;
    },
     // 切换形式
    switchingMode(){
      this.switchView = !this.switchView
      this.getDataList()
    },
    //统计分析
    statisticalData(){
      this.$router.push({
        path: '/human/statisticalAnalysis/human',
      })
    },
    // 导出
    exportData(){
      let httpaddress = window.SITE_CONFIG.baseUrl
      window.location.href = `${httpaddress}/risk/riskhumanalarm/xlsOutput?token=${this.$cookie.get('token')}&cameraName=${this.dataForm.cameraName}&typeId=${this.dataForm.typeId}&platformId=${this.$store.state.user.platformId}&startAt=${this.dataForm.startEndAt.length>0?this.dataForm.startEndAt[0]:''}&endAt=${this.dataForm.startEndAt.length>0?this.dataForm.startEndAt[1]:''}&key=${this.dataForm.key}`

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

    }
  }
};
</script>
<style scoped lang="less">
.search {
  width: 290px;
}
.cardClass {
  padding: 3px;
  border: 1px solid rgba(230, 230, 230, 1);
  width: 100%;
  // min-width: 1593px;
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
  // padding: 0px 10px 0px 10px;
  flex-wrap: wrap;
  // min-width: 1593px;
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
  overflow: hidden;
  > div {
    display: flex;
    // margin-left: 10px;
  }
  .right {
    // font-size: 0.7vw;
    ul {
      height: 208px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding-left: 10px;
      padding-top: 28px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      li {
        // align-items: center;
        // justify-items: center;
        // line-height: 24px;
        // text-align: left;
        label {
          width: 9vw;
          min-width: 109px;
          overflow: hidden; /*自动隐藏文字*/
          text-overflow: ellipsis; /*文字隐藏后添加省略号*/
          white-space: nowrap; /*强制不换行*/
          display: inline-block;
        }
      }
    }
  }
  .left {
    margin-top: 16px;
    border: 1px solid #555;
    img {
      width: 100%;
      height: 100%;
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
  margin: auto;
  z-index: 1000;
}

</style>
