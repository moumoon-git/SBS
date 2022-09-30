<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm" style="position:relative;height:58px;">
      <div>
        <el-input style="width:300px;" v-model="searchValue" placeholder="请输入平台名称查询"></el-input>
        <el-button @click="searchHandle()" class="save">搜索</el-button>

        <el-button
          type="primary"
          class="save"
          style="width:initial;margin-left:initial;"
          size="medium"
          @click="watchLeaderDialog()"
        >查看负责人</el-button>

        <el-button
          style="width:initial;margin-left:initial;"
          type="primary"
          @click="showHomePage()"
          class="save"
        >菜单自定义</el-button>

        <el-button
          style="width:initial;margin-left:initial;"
          type="primary"
          @click="batchCreate()"
          class="save"
        >批量生成</el-button>

        <el-button
          style="width:initial;margin-left:initial;"
          type="primary"
          @click="getDataList"
          class="save"
        >刷新列表</el-button>
      </div>

      <el-button
        style="position: absolute;right: 5%;top:0%;background: #409eff;color: #fff;"
        @click="getTree()"
        class="save"
      >导入</el-button>

      <el-button
        style="position: absolute;right: 0%;top:0%;background: #409eff;color: #fff;"
        v-if="isAuth('sys:platform:save')"
        @click="addOrUpdateHandle()"
        class="save"
      >新增</el-button>

      <!--展示首页-->
      <show-home-page v-if="showHomePageVisible" ref="ShowHomePage"></show-home-page>
    </el-form>

    <el-table v-loading="dataListLoading" :data="dataList" border style="width: 100%;" row-key="id">
      <el-table-column prop="id" header-align="center" align="left" width="150" label="ID"></el-table-column>

      <!--
        * @author tanjinfeng
        * @date 2020-11-18
        * @description 优化：树形结构太卡，改用elementUI表格自带的方法
      -->
      <!-- *** 原来的代码 *** -->
      <!-- <table-tree-column
        prop="platformName"
        header-align="center"
        align="left"
        treeKey="id"
        label="名称"
      ></table-tree-column> -->
      <!-- *** 优化后的代码 *** -->
      <el-table-column
        prop="platformName"
        header-align="center"
        align="left"
        label="名称"
        :tree-props="{children: 'children'}"
      />
      <!-- *** 结束 *** -->

      <el-table-column prop="platformTitle" header-align="center" align="left" label="标题"></el-table-column>

      <el-table-column header-align="center" align="center" width="140" label="背景图片">
        <template slot-scope="scope">
          <img
            v-if="!!scope.row.backgroundImage"
            :src="scope.row.backgroundImage.indexOf('http')===-1?baseUrl+scope.row.backgroundImage:scope.row.backgroundImage"
            width="50"
            height="50"
            class="head_pic"
          />
        </template>
      </el-table-column>

      <el-table-column header-align="center" align="center" width="100" label="设置动画">
        <template slot-scope="scope">
          <span style="color: #c29b3c" v-if="scope.row.animationFlag == '0'">否</span>
          <span style="color: #0d85c2" v-else-if="scope.row.animationFlag == '1'">是</span>
          <span v-else style="color: #c27c2c">未知</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="platformType"
        header-align="center"
        align="center"
        width="300"
        label="类型"
      />

      <el-table-column
        prop="gmtCreate"
        header-align="center"
        align="center"
        width="200"
        :show-overflow-tooltip="true"
        label="创建时间"
      ></el-table-column>

      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <div class="opration">
            <el-button
              v-if="isAuth('sys:platform:update')"
              type="text"
              size="small"
              @click="addOrUpdateHandle(scope.row.id)"
            >修改</el-button>
            <el-button
              v-if="isAuth('sys:platform:delete')"
              type="text"
              size="small"
              @click="deleteHandle(scope.row)"
            >删除</el-button>
            <el-button
              v-if="isAuth('sys:platform:update')"
              type="text"
              size="small"
              @click="upordown = 0, moveItem(scope.row.id)"
            >
              上移
            </el-button>
            <el-button
              v-if="isAuth('sys:platform:update')"
              type="text"
              size="small"
              @click="upordown = 1, moveItem(scope.row.id)"
            >
              下移
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

    <el-dialog title="查看二维码" :visible.sync="watchQrCodeDialogVisible" style="text-align:center;">
      <img :src="watchQrCodeSrc" alt />
    </el-dialog>

    <!-- 弹窗, 新增-->
    <leaderDialog v-if="leaderDialogVisible" ref="leaderDialog" @refreshDataList="getDataList"></leaderDialog>

    <!-- 批量生成弹窗-->
    <batchCreate
      v-if="batchCreateDialogVisible"
      ref="batchCreateDialog"
      @refreshDataList="getDataList"
    ></batchCreate>
  </div>
</template>

<script>
import TableTreeColumn from "@/components/table-tree-column/index";
import AddOrUpdate from "./platform-add-or-update";
import { treeDataTranslate, platformTreeDataTranslate } from "@/utils";
import leaderDialog from "./leaderDialog";
import ShowHomePage from "../menu/menu-show-homepage";
import batchCreate from "./batchCreate";
export default {
  data() {
    return {
      watchQrCodeSrc: "",
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      //修改窗口
      addOrUpdateVisible: false,
      //添加授权窗口
      addingauthorization: false,
      watchQrCodeDialogVisible: false,
      //搜索的值
      searchValue: "",
      leaderDialogVisible: false,
      //菜单弹窗
      showHomePageVisible: false,
      //批量生成
      batchCreateDialogVisible: false,

      baseUrl: window.SITE_CONFIG["cloudUrl"],
      activeName: "0",
      //菜单
      platformTreeVisible: false,
      menuIdArray: [],
      menuList: [],
      menuList2: [],
      menuListTreeProps: {
        label: "name",
        children: "children",
      },
      currIdIndex: 0,
      upordown: 0, // 0上1下
      hasFind: false,
      currArr: [],
    };
  },
  components: {
    TableTreeColumn,
    AddOrUpdate,
    leaderDialog,
    ShowHomePage,
    batchCreate,
  },

  mounted() {
    this.getDataList();
  },

  methods: {
    watchLeaderDialog(id) {
      this.leaderDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.leaderDialog.init(id);
      });
    },

    //卡片切换
    tabHandleClick(tab, event) {
      this.activeName = tab.name;
    },

    //递归dataList用于生成二维码，验证码
    recursiveDataList({ dataList, id, src, verification }) {
      var that = this;
      if (dataList && dataList.length > 0) {
        dataList.forEach((item) => {
          if (item.children && item.children.length > 0) {
            that.recursiveDataList({
              dataList: item.children,
              id,
              src,
              verification,
            });
          }

          if (item.id === id) {
            if (src) {
              this.$set(item, "qrCode", src);
            } else {
              this.$set(item, "verificationCode", verification);
            }
          }
        });
      }
    },
    //生成二维码
    createdQrCode(id, row) {
      var that = this;
      // console.log('row',row)
      this.$http({
        url: this.$http.adornUrl("/wechat/createQRCode"),
        method: "get",
        params: this.$http.adornParams({
          platformId: id,
        }),
      }).then((res) => {
        if (data && data.code === 0) {
          that.recursiveDataList({
            dataList: that.dataList,
            id: id,
            src: res.data.qrCode,
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/sys/platform/treeList"),
        method: "get",
        params: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data) {
          this.dataList = platformTreeDataTranslate(data.data, "id");
        } else {
          this.$message.error(data.msg);
        }
        this.dataListLoading = false;
      });
      this.getPlatformInfo();
    },

    /**
     * 获取平台信息，平台标题可能会修改
     */
    getPlatformInfo() {
      this.$http({
        url: this.$http.adornUrl(`/sys/platform//infoById/${this.$cookie.get('platformId')}`),
        method: 'GET',
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          let newPlatformTitle;
          try {
            newPlatformTitle = data.platform.platformTitle;
          } catch (e) {
            console.error('更新本地平台信息错误', e);
          }
          if (newPlatformTitle) {
            this.$cookie.set('platformTitle', newPlatformTitle);
            this.$store.commit('user/updatePlatformTitle', newPlatformTitle);
            localStorage.setItem('tabTitle', data.platform.platformTitle);
            document.title = data.platform.platformTitle;
          }
        }
      });
    },

    //搜索
    searchHandle() {
      this.$http({
        url: this.$http.adornUrl("/sys/platform/selectPlatformTree"),
        method: 'get',
        params: this.$http.adornParams({
          apiVersion: '0.0.2',
          keyword: this.searchValue,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.list;
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, true);
      });
    },

    // 删除
    deleteHandle(row) {
      this.$confirm(`确定对"${row.platformName}"进行[删除]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/sys/platform/delete/${row.id}`),
            method: "post",
            data: this.$http.adornData(),
          }).then(({ data }) => {
            if (data && data.code === 0) {
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
        })
        .catch(() => {});
    },

    //首页菜单自定义名称、自定义排序
    showHomePage() {
      this.showHomePageVisible = true;
      this.$nextTick(() => {
        this.$refs.ShowHomePage.init();
      });
    },

    //批量生成
    batchCreate() {
      this.batchCreateDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.batchCreateDialog.init();
      });
    },

    // 导入自定义文件上传行为
    uploadSectionFile(param) {
      let form = new FormData();
      form.append("file", param.file);
      this.$http({
        url: this.$http.adornUrl(`/sys/platform/buildPlatform`),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: form,
      })
        .then(({ data }) => {
          if (!data.code) {
            this.$message({
              message: "导入成功!",
              type: "success",
            });
            this.getDataList();
          } else {
            this.$message.error("只支持导入平台信息文件");
          }
        })
        .catch((err) => {
          // alert(err)
        });
    },

    //获取树形图
    getTree() {
      let id = null;
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, false);
      });
    },
    // 获得同级里所有id
    getSameLevelAll(arr, id) {
      arr.forEach((e, index) => {
        if (e.id === id && !this.hasFind) {
          this.hasFind = true;
          this.currIdIndex = index;
          this.currArr = arr.map((ell) => ell.id);
        }
        if (e.id !== id && !this.hasFind && e.children) {
          this.getSameLevelAll(e.children, id);
        }
      });
    },
    swap(arr, id) {
      for (let i = 0; i < arr.length; i += 1) {
        if ((arr[i] === id && this.upordown === 0)
          || (arr[i - 1] === id && this.upordown === 1)
        ) {
          const temp = arr[i - 1];
          arr[i - 1] = arr[i];
          arr[i] = temp;
          i = arr.length - 1; // 直接结束循环
        }
      }
    },
    // 移
    moveItem(rowid) {
      this.currArr = [];
      this.hasFind = false;
      this.currIdIndex = 0;
      new Promise((resolve) => {
        this.getSameLevelAll(this.dataList, rowid);
        if (this.currArr) resolve();
      }).then(() => {
        if (!this.currIdIndex && this.upordown === 0) {
          this.$message.info('当前已经在最顶层，无法上移');
        } else if (this.currIdIndex === this.currArr.length - 1 && this.upordown === 1) {
          this.$message.info('当前已经在最底层，无法下移');
        } else {
          this.swap(this.currArr, rowid);
          this.$http({
            baseURL: window.SITE_CONFIG.cloudUrl,
            url: '/ser/sys/platform/updatePlatFormOrder',
            method: 'post',
            data: {
              platFormIds: this.currArr,
            },
          }).then((res) => {
            if (res.data.errorcode === 0 || res.data.code === 0 || res.data.errorCode === 0) {
              this.$message.success('移动成功');
              this.getDataList();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
//表格奇偶行换颜色
.has-gutter tr > th {
  background: rgba(230, 230, 230, 1);
}
.el-table th {
  background-color: rgba(230, 230, 230, 1);
}
.el-table__body tbody > :nth-child(2n) {
  background: rgba(230, 230, 230, 1);
}
//弹窗样式
.el-form-item.is-success .el-input__inner,
.el-form-item.is-success .el-input__inner:focus,
.el-form-item.is-success .el-textarea__inner,
.el-form-item.is-success .el-textarea__inner:focus {
  border: 1px solid #dcdfe6;
}
.save {
  color: white !important;
  background-color: #0091ff !important;
  border-color: #0091ff !important;
}
//按钮样式
.el-button.el-button--medium:hover {
  color: #a3a3a3 !important;
  border-color: rgba(71, 157, 255, 1) !important;
  background: transparent !important;
}
.el-form {
  .el-button--primary {
    width: 88px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(211, 215, 219, 1);
    border-radius: 5px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(162, 162, 162, 1);
  }
}
.opration {
  display: flex;
  justify-content: space-around;
}
</style>


