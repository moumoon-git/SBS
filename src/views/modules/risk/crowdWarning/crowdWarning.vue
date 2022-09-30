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
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          unlink-panels
          v-model="dataForm.startEndAt"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-input class="search" v-model="dataForm.key" placeholder="请输入名字或身份证搜索" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-input
          class="search"
          v-model="dataForm.cameraName"
          placeholder="请输入摄像头名称或摄像头编码搜索"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.typeId" placeholder="请选择管控类型" clearable>
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
        <el-button @click="pageIndex=1;getDataList()">查询</el-button>
        <!-- <el-button v-if="isAuth('risk:riskhuamnalarminfo:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <!-- <el-button v-if="isAuth('risk:riskhuamnalarminfo:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <div class="cardClass">
      <div class="list">
        <!-- 一个卡片单位 -->
        <div class="colStaff" v-for="(item,index) in dataList" :key="index">
          <div style="position: absolute;font-size:0.9vw;font-weight:bold">
            <span>{{item.cameraName}}</span>
          </div>
          <div style="position: absolute;right: 4%;top:4%">
            <span>{{item.shootTime}}</span>
          </div>

          <div>
            <div class="left" style="margin-top:25px;">
              <viewer :images="[item.imgName.length>97?imageUrl:item.imgName]" v-if="item.imgName.indexOf('http') !== -1">
                <img
                  v-for="(item,index) in [item.imgName.length>97?imageUrl:item.imgName]"
                  :src="item"
                  :key="index"
                  style="width:8vw;height:181px;min-width:120px"
                />
              </viewer>

              <viewer :images="[item.imgName.length>97?imageUrl:item.imgName]" v-else>
                <img
                  v-for="(item,index) in [item.imgName.length>97?imageUrl:item.imgName]"
                  :src="backgroundURL + item"
                  :key="index"
                  style="width:8vw;height:181px;min-width:120px"
                />
              </viewer>
            </div>

            <div class="right">
              <ul>
                <li>
                  <label>人群密集度：{{item.crowdCount}}</label>
                  <span></span>
                </li>
                <li>
                  <label>报警阙值：{{item.alarmThreshold}}</label>
                  <span></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
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
    <!-- <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update> -->
  </div>
</template>

<script>
// import AddOrUpdate from "./riskhuamnalarminfo-add-or-update";
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
      backgroundURL: window.SITE_CONFIG.baseUrl
    };
  },

  created() {
    this.getDataList();
  },

  methods: {
    // 预览图片
    initImageTools() {
      //初始化 viewerjs
      setTimeout(()=>{
        const ViewerDom = document.querySelectorAll("#image");
        
        for (let i in ViewerDom) {
          if(typeof ViewerDom[i]==='object'){
            // console.log("ViewerDom[i]",ViewerDom[i])
            const viewer = new Viewer(ViewerDom[i], {
              url: "data-original"
            });
          }
          
        }
      })
    },

    // 获取数据列表
    getDataList() {
      if (this.dataForm.startEndAt === null) {
        this.dataForm.startEndAt = [];
      }
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/vcm/riskCrowdAlarm/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
        //   key: this.dataForm.key,
        //   startAt: this.dataForm.startEndAt[0] || "",
        //   endAt: this.dataForm.startEndAt[1] || "",
        //   platformId: this.$store.state.user.platformId,
        //   cameraName: this.dataForm.cameraName,
        //   typeId: this.dataForm.typeId
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
           this.dataList.map(v => {
              v.shootTime = v.shootTime.replace('T',' ')
            });

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
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
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
  width: 24%;
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
      justify-content: space-around;
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
  margin: auto;
  z-index: 1000;
}
</style>
