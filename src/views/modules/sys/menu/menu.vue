<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm" style="position:relative;height:58px;">
      <el-button
        class="save"
        style="width:120px;position:absolute;right: 10%;top:8%;z-index:10"
        v-if="isAuth('sys:menu:save')"
        type="primary"
        @click="showHomePage()"
      >菜单排序</el-button>
      <el-button
        class="save"
        style="position:absolute;right: 2%;top:8%;z-index:10"
        v-if="isAuth('sys:menu:save')"
        type="primary"
        @click="addOrUpdateHandle(null, activeName)"
      >新增</el-button>
      <el-tabs v-model="activeName" @tab-click="tabHandleClick" type="card">
        <el-tab-pane label="PC端" name="0">
          <el-table :data="dataList" border style="width: 100%;" height='700'>
            <el-table-column
              prop="menuId"
              header-align="center"
              align="center"
              width="80"
              label="ID"
            ></el-table-column>
            <table-tree-column prop="name" header-align="center" treeKey="menuId" label="名称"></table-tree-column>
            <!-- <table-tree-column
              prop="customMenuName"
              header-align="center"
              treeKey="menuId"
              width="150"
              label="自定义名称"
            ></table-tree-column>-->
            <el-table-column prop="parentName" header-align="center" align="center" label="上级菜单"></el-table-column>
            <el-table-column header-align="center" align="center" label="图标" width="70">
              <template slot-scope="scope">
                <icon-svg :name="scope.row.icon || ''"></icon-svg>
              </template>
            </el-table-column>
            <el-table-column prop="type" header-align="center" align="center" label="类型" width="90">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
                <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
                <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="orderNum"
              header-align="center"
              align="center"
              label="排序号"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="url"
              header-align="center"
              align="center"
              :show-overflow-tooltip="true"
              label="菜单URL"
            ></el-table-column>
            <el-table-column
              prop="perms"
              header-align="center"
              align="center"
              width="150"
              :show-overflow-tooltip="true"
              label="授权标识"
            ></el-table-column>
            <el-table-column header-align="center" align="center" width="150" label="操作">
              <template slot-scope="scope">
                <el-button
                  v-if="isAuth('sys:menu:update')"
                  type="text"
                  size="small"
                  @click="addOrUpdateHandle(scope.row.menuId, null)"
                >修改</el-button>
                <el-button
                  v-if="isAuth('sys:menu:delete')"
                  type="text"
                  size="small"
                  @click="deleteHandle(scope.row.menuId)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="微信端" name="1">
          <el-table :data="dataList" border style="width: 100%;" height='700'>
            <el-table-column
              prop="menuId"
              header-align="center"
              align="center"
              width="80"
              label="ID"
            ></el-table-column>
            <table-tree-column prop="name" header-align="center" treeKey="menuId" label="名称"></table-tree-column>
            <el-table-column prop="parentName" header-align="center" align="center" label="上级菜单"></el-table-column>
            <el-table-column header-align="center" align="center" label="图标" width="70">
              <template slot-scope="scope">
                <icon-svg :name="scope.row.icon || ''"></icon-svg>
              </template>
            </el-table-column>
            <el-table-column prop="type" header-align="center" align="center" label="类型" width="90">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
                <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
                <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="orderNum"
              header-align="center"
              align="center"
              label="排序号"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="url"
              header-align="center"
              align="center"
              :show-overflow-tooltip="true"
              label="菜单URL"
            ></el-table-column>
            <el-table-column
              prop="perms"
              header-align="center"
              align="center"
              width="150"
              :show-overflow-tooltip="true"
              label="授权标识"
            ></el-table-column>
            <el-table-column header-align="center" align="center" width="150" label="操作">
              <template slot-scope="scope">
                <el-button
                  v-if="isAuth('sys:menu:update')"
                  type="text"
                  size="small"
                  @click="addOrUpdateHandle(scope.row.menuId, null)"
                >修改</el-button>
                <el-button
                  v-if="isAuth('sys:menu:delete')"
                  type="text"
                  size="small"
                  @click="deleteHandle(scope.row.menuId)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
         <el-tab-pane label="APP端" name="2">
          <el-table :data="dataList" border style="width: 100%;" height='700'>
            <el-table-column
              prop="menuId"
              header-align="center"
              align="center"
              width="80"
              label="ID"
            ></el-table-column>
            <table-tree-column prop="name" header-align="center" treeKey="menuId" label="名称"></table-tree-column>
            <el-table-column prop="parentName" header-align="center" align="center" label="上级菜单"></el-table-column>
            <el-table-column header-align="center" align="center" label="图标" width="70">
              <template slot-scope="scope">
                <icon-svg :name="scope.row.icon || ''"></icon-svg>
              </template>
            </el-table-column>
            <el-table-column prop="type" header-align="center" align="center" label="类型" width="90">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
                <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
                <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="orderNum"
              header-align="center"
              align="center"
              label="排序号"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="url"
              header-align="center"
              align="center"
              :show-overflow-tooltip="true"
              label="菜单URL"
            ></el-table-column>
            <el-table-column
              prop="perms"
              header-align="center"
              align="center"
              width="150"
              :show-overflow-tooltip="true"
              label="授权标识"
            ></el-table-column>
            <el-table-column header-align="center" align="center" width="150" label="操作">
              <template slot-scope="scope">
                <el-button
                  v-if="isAuth('sys:menu:update')"
                  type="text"
                  size="small"
                  @click="addOrUpdateHandle(scope.row.menuId, null)"
                >修改</el-button>
                <el-button
                  v-if="isAuth('sys:menu:delete')"
                  type="text"
                  size="small"
                  @click="deleteHandle(scope.row.menuId)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

    <!--展示首页-->
    <show-home-page v-if="showHomePageVisible" ref="ShowHomePage"></show-home-page>
  </div>
</template>

<script>
import TableTreeColumn from "@/components/table-tree-column";
import AddOrUpdate from "./menu-add-or-update";
import { treeDataTranslate } from "@/utils";
import ShowHomePage from "./menu-show-homepage";
export default {
  data() {
    return {
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      showHomePageVisible: false,
      activeName: "0"
    };
  },
  components: {
    TableTreeColumn,
    AddOrUpdate,
    ShowHomePage
  },

  mounted() {
    this.getDataList();
  },

  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl(`/sys/menu/list?terminal=${this.activeName}`),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.dataList = treeDataTranslate(data, "menuId");
        // console.log("获取数据列表",this.dataList)

        this.dataListLoading = false;
      });
    },
    //PC端微信端切换
    tabHandleClick(tab, event) {
      this.activeName = tab.name;
      this.getDataList();
    },
    // 新增 / 修改
    addOrUpdateHandle(id, activeName) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, activeName);
      });
    },

    //设置为首页
    showHomePage() {
      this.showHomePageVisible = true;
      this.$nextTick(() => {
        this.$refs.ShowHomePage.init();
      });
    },

    // 删除
    deleteHandle(id) {
      this.$confirm(`确定对[id=${id}]进行[删除]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/sys/menu/delete/${id}`),
            method: "post",
            data: this.$http.adornData()
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
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="less" scoped>
.mod-menu {
  .el-tag.el-tag--small.el-tag--light {
    background-color: rgba(64, 158, 255, 0.1);
    padding: 0 10px;
    height: 32px;
    line-height: 30px;
    font-size: 12px;
    color: rgba(71, 157, 255, 1) !important;
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid rgba(64, 158, 255, 0.2);
    white-space: nowrap;
  }
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
      border-radius: 2px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: rgba(162, 162, 162, 1);
    }
  }
  //修改，删除按钮样式
  .cell {
    .el-button--text {
      font-size: 12px;
      font-family: MicrosoftYaHei;
      font-weight: bold;
      color: rgba(118, 214, 114, 1);
    }
    .el-button:last-child {
      font-size: 12px;
      font-family: MicrosoftYaHei;
      font-weight: bold;
      color: rgba(230, 115, 128, 1);
    }
  }

  .save {
    color: white !important;
    background-color: #0091ff !important;
    border-color: #0091ff !important;
  }
}
</style>
