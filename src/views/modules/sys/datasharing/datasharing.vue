<template>
  <div>
    <sv-template ref="template">
      <template #left__container>
        <div class="left__container" :class="{ left__collapse: leftCollaspe }">
          <div
            class="left__collapse__button"
            @click="leftCollaspe = !leftCollaspe"
          ></div>
          <div class="left__header">
            <!-- 搜索框 -->
            <sv-input-tree-search
              v-model="searchValue"
              width="calc(100% - 20px)"
              @change="searchHandle"
              @keyup.enter.native="searchHandle"
            />
          </div>
          <div
            class="left__tree sv-tree"
            v-loading="treeLoading"
            element-loading-spinner="sv-loading"
          >
            <el-tree
              @node-click="handleNodeClick"
              :data="platFormList"
              :props="defaultProps"
              :current-node-key="0"
              node-key="id"
            >
              <div class="sv-tree-node" slot-scope="{ node }">
                <div class="label">{{ node.label }}</div>
              </div>
            </el-tree>
          </div>
        </div>
      </template>
   
      <template #middle__container>
        <div class="middle__container">
          <div class="middle__header">
           <span class="middle__header__title">平台数据共享</span>
              <sv-button type="primary" @click="addOrUpdateHandle()">新增</sv-button>
        <sv-button type="primary" @click="deleteGroupHandle()">批量删除</sv-button>
          </div>
          <div class="middle__table sv-table">
          <el-table :data="platShareMenuList" border style="width: 100%" ref="table">
            <el-table-column
              type="selection"
              header-align="center"
              align="center"
              width="50px"
            >
              
            </el-table-column>
            <el-table-column
              prop="shareId"
              header-align="center"
              align="center"
              width="80"
              label="ID"
            >
            </el-table-column>
            <el-table-column
              prop="myPlatformName"
              header-align="center"
              align="center"
              label="上级平台"
            >
            </el-table-column>
            <el-table-column
              prop="linkagePlatformName"
              header-align="center"
              align="center"
              label="下级平台"
            >
            </el-table-column>
            <!--<el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="300"
            :show-overflow-tooltip="true"
            label="共享权限">
          </el-table-column>-->

            <!--隐藏宽-->
            <el-table-column
              prop="myPlatformId"
              v-if="false"
              label="本级平台id"
            >
            </el-table-column>

            <el-table-column
              prop="linkagePlatformId"
              v-if="false"
              label="其他平台id"
            >
            </el-table-column>

            <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              label="操作"
            >
              <template slot-scope="scope">
                <sv-table-operation
                  :display="[
                    isAuth('sys:share:update') ? 'edit' : '',
                    isAuth('sys:share:delete') ? 'delete' : '',
                  ]"
                  @edit="
                    addOrUpdateHandle(
                      scope.row.shareId,
                      scope.row.myPlatformId,
                      scope.row.linkagePlatformId
                    )
                  "
                  @delete="
                    deleteHandle(
                      scope.row.shareId,
                      scope.row.myPlatformId,
                      scope.row.linkagePlatformId
                    )
                  "
                ></sv-table-operation>
              </template>
            </el-table-column>
          </el-table>
          </div>
          <div  class="middle__footer sv-pagination">
            
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          ref="pagination"
          background
          layout="total, prev, pager, next, sizes, jumper">
        </el-pagination>
          </div>
        </div>
      </template>
    </sv-template>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    ></add-or-update>
  </div>
</template>

<script>
import TableTreeColumn from "@/components/table-tree-column";
import AddOrUpdate from "./datasharing-add-or-update";
import { treeDataTranslate } from "@/utils";
import Sv_template from "../../../../sinvieUI/sv_template/sv_template.vue";
import Sv_table_operation from "../../../../sinvieUI/sv_table/sv_table_operation.vue";
export default {
  data() {
    return {
      treeSetting: {
        tab: [],
        api: "/sys/platform/treeList",
        edit: false,
      },
      tableRequest: {
        api: "/sys/platformShare/listByPage",
      },
      dataForm: {
        key: "",
      },
      searchValue: "",
      leftCollaspe: false,
      treeLoading: false,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      //修改窗口
      addOrUpdateVisible: false,
      //添加授权窗口
      addingauthorization: false,
      platDataForm: {
        id: 0,
        typeName: "",
        typeNameList: [],
        platformName: "",
        parentId: 0,
        parentName: "",
        orderNum: 0,
      },
      //终端
      platFormList: [],
      defaultProps: {
        children: "children",
        label: "platformName",
      },
      platShareMenuForm: {
        shareId: 0,
        linkagePlatformId: 0,
        linkagePlatformName: [],
        menuId: "",
        myPlatformName: [],
        name: "",
        myPlatformId: "",
        linkagePlatformId: "",
      },
      //点击使用
      platformId: 0,
      //表格
      platShareMenuList: [],
    };
  },
  components: {
    TableTreeColumn,
    AddOrUpdate,
  },
  mounted() {
    this.getDataList();
  },
  methods: {
    /**
     * @description: 获取表格勾选数据
     * @param {*}
     * @return {*}
     */
       getTableChecked() {
            const rows = this.$refs.table.selection

            return rows
        },
    /**
     * @description: 树搜索
     * @param {*}
     * @return {*}
     */
    searchHandle() {
      if (this.searchValue == "") {
        this.$http({
          url: this.$http.adornUrl("/sys/platform/treeList"),
          method: "get",
        }).then(({ data }) => {
          // console.log(data);
          //this.platFormList = treeDataTranslate(data.tree, 'id')
          this.platFormList = data.data;
        });
      } else {
        this.$http({
          url: this.$http.adornUrl("/sys/platform/selectPlatformTree"),
          method: "get",
          params: this.$http.adornParams({ keyword: this.searchValue }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.platFormList = data.list;
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/sys/platform/treeList"),
        method: "get",
      }).then(({ data }) => {
        // console.log(data);
        //this.platFormList = treeDataTranslate(data.tree, 'id')
        this.platFormList = data.data;
        // console.log(this.platFormList)
        //请求表格数据
         this.$http({
            url: this.$http.adornUrl("/sys/platformShare/listByPage"),
            method: "get",
            params: this.$http.adornParams({
              page: this.pageIndex,
              limit: this.pageSize,
              key: this.dataForm.key,
            }),
          }).then(({ data }) => {
            // console.log(data)
            //this.platShareMenuList = treeDataTranslate(data.platShareMenuList, 'id')
            if (data && data.code === 0) {
              this.platShareMenuList = data.page.list;
              this.totalPage = data.page.totalCount;
            } else {
              this.platShareMenuList = [];
              this.totalPage = 0;
              this.$message.error(data.msg);
            }
          });
      });
    },

    // 获取id
    handleNodeClick(obj) {
      if (obj.id == null || obj.id == undefined) {
        //点击上下一页
        //alert("点其他的再点")
        this.platformId = obj;
      } else {
        //解决分页失效问题
        this.pageIndex = 1;
        //this.$refs.pagination.lastEmittedPage = 1
        //直接点击平台执行
        this.platformId = obj.id;
      }
      //alert(this.pageIndex+"======"+this.platformId)
      //请求表格数据，根据平台id
      this.$http({
        url: this.$http.adornUrl(`/sys/platformShare/listByMyIdAndPage`),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          platformId: this.platformId,
        }),
      }).then(({ data }) => {
        // console.log(data);
        if (data && data.code === 0) {
          this.platShareMenuList = data.menuList.list;
          this.totalPage = data.menuList.totalCount;
          this.$refs.template.tableList = data.menuList.list;
          this.$refs.template.getTableList(this.tableRequest);
        } else {
          this.platShareMenuList = [];
          this.totalPage = 0;
          this.$message.error(data.msg);
        }
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
      if (this.platformId == 0 || this.platformId == null) {
        this.getDataList();
      } else {
        this.handleNodeClick(this.platformId);
      }
    },

    // 新增 / 修改
    addOrUpdateHandle(id, myId, linkageId) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, myId, linkageId);
      });
    },

    // 删除
    deleteHandle(shareId,myPlatformId,linkagePlatformId) {
     
      this.$confirm(`确定对[id=${shareId}]进行[删除]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/sys/platformShare/delete`),
            method: "post",
            data: this.$http.adornData({
              id:myPlatformId,
              ids: [linkagePlatformId],
             
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                 this.$http({
        url: this.$http.adornUrl(`/sys/platformShare/listByMyIdAndPage`),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          platformId: this.platformId,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.platShareMenuList = data.menuList.list;
          this.totalPage = data.menuList.totalCount;
        } else {
          this.platShareMenuList = [];
          this.totalPage = 0;
          this.$message.error(data.msg);
        }
      });
                },
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    },
  /**
   * @description: 批量删除
   * @param {*}
   * @return {*}
   */  
  deleteGroupHandle(){
    const checkedRows = this.getTableChecked()
    let linkCheckedIds = []
    let platformCheckId = ''
    if(checkedRows.length == 0)
    {
        this.$confirm(`请勾选想要删除的数据`, "提示", {
        confirmButtonText: "确定",
     
        type: "warning",
      })
        .catch(() => {});
    }
    else{
     checkedRows.forEach(item => {
        linkCheckedIds.push(item.linkagePlatformId)
         platformCheckId = item.myPlatformId
        
     });
       this.$confirm(`确定进行批量删除操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/sys/platformShare/delete`),
            method: "post",
            data: this.$http.adornData({
              id:platformCheckId,
              ids:linkCheckedIds,
             
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "删除成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                 this.$http({
        url: this.$http.adornUrl(`/sys/platformShare/listByMyIdAndPage`),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          platformId: this.platformId,
        }),
      }).then(({ data }) => {

        if (data && data.code === 0) {
          this.platShareMenuList = data.menuList.list;
          this.totalPage = data.menuList.totalCount;
        } else {
          this.platShareMenuList = [];
          this.totalPage = 0;
          this.$message.error(data.msg);
        }
      });
                },
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    }
  }
  },
};
</script>
<style lang="scss" scoped>
.left__container {
  width: 300px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: relative;
  transition: width 0.3s ease;
  // 头部
  .left__header {
    padding: 10px;
    text-align: center;
    display: flex;
  }
  // 树形
  .left__tree {
    flex: 1;
  }
  // 折叠按钮
  .left__collapse__button {
    width: 20px;
    height: 70px;
    background: #ffffff;
    border-top-left-radius: 30px 50px;
    border-bottom-left-radius: 30px 50px;
    box-shadow: -1px 0px 5px rgba(54, 121, 225, 0.15);
    position: absolute;
    right: 0;
    top: calc(50% - 35px);
    cursor: pointer;
    transition: right 0.3s ease;
    z-index: 1;
    &::after {
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      background: no-repeat
        url("../../../../sinvieUI/img/tree/left_collapse_hover.svg") center/60%
        20%;
    }
    &:hover::after {
      background-image: url("../../../../sinvieUI/img/tree/left_collapse.svg");
    }
  }
  &.left__collapse {
    width: 0;
    margin-right: 0;
    // 除了折叠按钮，隐藏其余所有元素
    & > *:not(.left__collapse__button) {
      display: none;
    }
    .left__collapse__button {
      transform: rotate(180deg);
      right: -20px;
      z-index: 2;
    }
  }
}
.middle__container {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    .middle__header {
        padding: 10px;
        font-size: 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-bottom: -10px;
        & > * {
            margin: 0 0 10px 5px;
            flex-shrink: 0;
        }
        .middle__header__title {
            flex-grow: 1;
            flex-shrink: 0;
            border-left: 3px solid #0091FF;
            font-size: 16px;
            line-height: 16px;
            font-weight: bold;
            padding: 0 0 0 14px;
        }
    }
    
    .middle__table {
        flex: 1;
        position: relative;
    }
    .middle__footer {
        height: 50px;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        padding: 0 10px 0 0;
    }
}

// .dataShare {
//   .el-aside {
//     color: #333;
//     text-align: center;
//     height: calc(100vh - 300px);
//     border: 1px solid #ebeef5;
//     padding-top: 10px;
//   }
// }

// .el-col-6 {
//   width: 20%;
// }
// .site-wrapper .el-pagination {
//   text-align: center;
// }
// .input-button {
//   padding: 10px 0 20px 0;
// }
// .input-with-select {
//   width: 300px;
//   float: left;
//   margin-right: 20px;
// }

//表格奇偶行换颜色
// .has-gutter tr > th {
//   background: rgba(230, 230, 230, 1);
// }
// .el-table th {
//   background-color: rgba(230, 230, 230, 1);
// }
// .el-table__body tbody > :nth-child(2n) {
//   background: rgba(230, 230, 230, 1);
// }
// //弹窗样式
// .el-form-item.is-success .el-input__inner,
// .el-form-item.is-success .el-input__inner:focus,
// .el-form-item.is-success .el-textarea__inner,
// .el-form-item.is-success .el-textarea__inner:focus {
//   border: 1px solid #dcdfe6;
// }

// .save {
//   color: white !important;
//   background-color: #0091ff !important;
//   border-color: #0091ff !important;
// }
// //按钮样式
// .el-button.el-button--medium:hover {
//   color: #a3a3a3 !important;
//   border-color: rgba(71, 157, 255, 1) !important;
//   background: transparent !important;
// }
// .el-form {
//   .el-button--primary {
//     width: 88px;
//     background: rgba(255, 255, 255, 1);
//     border: 1px solid rgba(211, 215, 219, 1);
//     border-radius: 5px;
//     font-size: 12px;
//     font-family: MicrosoftYaHei;
//     font-weight: 400;
//     color: rgba(162, 162, 162, 1);
//   }
// }

// //修改，删除按钮样式
// .cell {
//   .el-button--text:first-child {
//     background-color: transparent;
//     border: none;
//     font-size: 12px;
//     font-family: MicrosoftYaHei;
//     font-weight: bold;
//     color: rgba(118, 214, 114, 1);
//   }
//   .el-button--text:last-child {
//     background-color: transparent;
//     border: none;
//     font-size: 12px;
//     font-family: MicrosoftYaHei;
//     font-weight: bold;
//     color: rgba(230, 115, 128, 1);
//   }
// }
</style>


