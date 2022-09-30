<template>
  <div class="mod-menu" style="margin: -20px">
    <el-header class="header" style="height: 80px">
      <reserveplan-header
        :value3="value3"
        :dataForm="dataForm"
        @planData="planData"
        :checkedIds="checkedIds"
        @addOrUpdateHandle="addOrUpdateHandle"
        @planMoreDelete="planMoreDelete(arguments)"
        @planMoreStart="planMoreStart"
        @planMoreStop="planMoreStop"
        @handelHTTPSeek="handelHTTPSeek"
      />
    </el-header>
    <div style="height: 8px; background: rgb(240, 243, 244)"></div>
    <div style="width: 100%; display: flex; padding: 32px 16px 0px 16px">
      <div style="width: 15%; min-width: 320px">
        <tree
          :list="modifiedUserList"
          :listProps="modifiedUserProps"
          @checkGroupNode="checkGroupNode"
          @showTree="showEventType"
          @addTree="addEventType"
          @updateTree="updateEventType"
          @deleteTree="deleteEventType"
          @commonSet="commonSet"
          @handleNodeClick="handleNodeClick"
        ></tree>
      </div>

      <div class="tableClass">
        <div style="height: 583px; max-height: 583px">
          <el-scrollbar
            wrap-class="list"
            wrap-style="color: red;max-height:596px;"
            view-class="view-box"
            :native="false"
          >
            <!--表格-->
            <reserveplan-table
              :dataList="dataList"
              @handleGain="getDataList"
              @addOrUpdateHandle="addOrUpdateHandle"
              @deleteHandle="deleteHandle(arguments)"
            />
          </el-scrollbar>
        </div>
        <div>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalPage"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <!--<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>-->

    <!--事件弹窗,查看 /新增 / 修改-->
    <eventtype-add-or-update
      v-if="eventtypeAddOrUpdateVisible"
      ref="eventtypeAddOrUpdate"
      @refreshEventTypeDataList="getDataList"
    ></eventtype-add-or-update>

    <!--公共事件配置-->
    <common-set v-if="showCommonSet" ref="commonSetTree" />
  </div>
</template>

<script>
import Tree from "./tree";
import AddOrUpdate from "./reserveplan-add-or-updata";
import ReserveplanTable from "./reserveplan-table";
import ReserveplanHeader from "./reserveplan-head";
// import Pagination from "@/views/common/pagination";
import { treeDataTranslate } from "@/utils";
import EventtypeAddOrUpdate from "./eventtype-add-or-update";
import CommonSet from "./commonSet";

export default {
  data() {
    return {
      value3: [],
      dataForm: {},
      dataList: [],
      pageIndex: 1, // 当前显示的页数
      pageSize: 10, // 一页显示的条数
      totalPage: 0, // 总条数
      keyword: "", // 搜索关键字
      dataListLoading: false,
      // 修改窗口
      addOrUpdateVisible: false,
      // 添加授权窗口
      addingauthorization: false,
      // 事件类型窗口
      eventtypeAddOrUpdateVisible: false,
      // 当前树形结点的id
      currentTreeId: "",
      // 当前选中的树结点对象
      currentTreeObject: {},
      // 公共事件配置
      showCommonSet: false,

      rpPlanEntity: {
        ids: [],
      },

      platDataForm: {
        id: 0,
        name: "",
        gmtCreate: "",
        platformId: "",
      },
      // 终端
      modifiedUserList: [],
      modifiedUserProps: {
        children: "children",
        label: "name",
      },
      // 所选分组的全部预案id
      checkedIds: [],
    };
  },
  created() {
    this.getDataList();
    //存在修改后跳转回来的情况，如果有则获取pageIndex，然后移除
    this.pageIndex = JSON.parse(sessionStorage.getItem("pageIndex"))
      ? JSON.parse(sessionStorage.getItem("pageIndex"))
      : 1;
    sessionStorage.removeItem("pageIndex");
  },
  components: {
    ReserveplanTable,
    ReserveplanHeader,
    AddOrUpdate,
    // Pagination,
    Tree,
    EventtypeAddOrUpdate,
    CommonSet,
  },
  // activated () {
  //   this.getDataList()
  // },
  computed: {
    isAdmin: {
      get() {
        return this.$store.state.user.isAdmin;
      },
    },
  },
  methods: {
    planData() {
      this.getDataList();
    },
    // 勾选的树形控件 全部预案id
    checkGroupNode(checkedIds) {
      this.checkedIds.splice(0, this.checkedIds.length, ...checkedIds);
      // 传值给子元素
    },
    // 页面显示条数改变时触发
    handleSizeChange(val) {
      this.pageSize = val;
      this.handleHTTPplan();
    },
    // 当前页数改变时触发
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.handleHTTPplan();
    },
    // 跳转新增页面
    goNewlyadded(data, staus, grade) {
      this.$router.push({
        path: "/reserveplan-add-or-updata",
        name: "reserveplan-add-or-updata",
        query: { status: staus, grade: grade },
      });
    },
    // 跳转到修改页面
    goUpdatelyadded(data, staus, grade) {
      console.log("输出当前的页数====》", this.pageIndex);
      //将pageIndex保存到sessionStorage中
      sessionStorage.setItem("pageIndex", this.pageIndex);
      this.$router.push({
        path: "/reserveplan-add-or-updata",
        name: "reserveplan-add-or-updata",
        query: {
          status: staus,
          data: data,
          grade: grade,
          // pageIndex: this.pageIndex,
        },
      });
    },
    // 跳转到查看页面
    goShowlyadded(data, staus) {
      this.$router.push({
        path: "/reserveplan-add-or-updata",
        name: "reserveplan-add-or-updata",
        query: { status: staus, data: data },
      });
    },

    commonSet() {
      this.showCommonSet = true;
      this.$nextTick(() => {
        this.$refs.commonSetTree.init(); // 1代表查看
      });
    },

    // 新增 / 修改
    addOrUpdateHandle(data, staus, grade) {
      // this.addOrUpdateVisible = true
      /* this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        }) */
      if (staus == 1) {
        this.goShowlyadded(data, staus);
      } else if (staus == 2) {
        this.goNewlyadded(data, staus, grade);
      } else if (staus == 3) {
        this.goUpdatelyadded(data, staus, grade);
      }
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl(`/event/eventType/selectTypeList`),
        method: "get",
        params: this.$http.adornParams({
          typeFlag: "",
          isTree: "1",
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.modifiedUserList = data.list;
          // 进来时请求全部预案
          this.handleHTTPplan();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 获取全部预案
    handleHTTPplan() {
      this.$http({
        url: this.$http.adornUrl("/rp/plan/listAndPage"),
        method: "POST",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          keyword: this.keyword,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data.page.list)
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
          this.$message.error(data.msg);
        }
        this.dataListLoading = false;
      });
    },
    /* 树形结点点击事件 */
    handleNodeClick(obj) {
      this.currentTreeObject = obj;
      // 查询对就的预案
      this.getPlanById(this.currentTreeObject.id);
    },

    // 根据事件类型id查询对应的预案
    getPlanById(id) {
      // 根据id查询预案
      this.$http({
        url: this.$http.adornUrl("/rp/plan/listAndPage"),
        method: "POST",
        params: this.$http.adornParams({
          event_type_id: id,
          page: this.pageIndex,
          limit: this.pageSize,
          keyword: this.keyword,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
          this.$message.error(data.msg);
        }
        this.dataListLoading = false;
      });
    },

    // 查看事件类型
    showEventType(id) {
      this.eventtypeAddOrUpdateVisible = true;
      // console.log('查看事件类型', this.eventtypeAddOrUpdateVisible)
      this.$nextTick(() => {
        this.$refs.eventtypeAddOrUpdate.init(id, this.currentTreeObject, 1); // 1代表查看
      });
    },
    // 添加事件类型
    addEventType() {
      this.eventtypeAddOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.eventtypeAddOrUpdate.init(null, null, 2); // 代表新增
      });
    },
    // 修改事件类型
    updateEventType(id) {
      // console.log(id)

      this.eventtypeAddOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.eventtypeAddOrUpdate.init(id, this.currentTreeObject, 3); // 代表修改
      });
    },
    // 删除事件类型
    deleteEventType(data) {
      // console.log('删除事件类型', data)
      this.deleteEventTypeHandle(data);
    },

    // 删除事件类型
    deleteEventTypeHandle(data) {
      this.$confirm(`确定${data.name}进行删除操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/rp/plan/listByIds"),
            method: "post",
            data: this.$http.adornData(data.id, false),
          }).then(({ data }) => {
            // console.log('/rp/plan/listByIds', data)

            if (data.rePlan.length > 0) {
              this.$message.error("删除的事件类型中存在预案，请先删除预案!");
            } else {
              this.$http({
                url: this.$http.adornUrl("/event/eventType/delete"),
                method: "post",
                data: this.$http.adornData(ids, false),
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
            }
          });
        })
        .catch(() => {});
    },
    // 删除
    deleteHandle(argument) {
      console.log(argument);
      let id = argument[0];
      let name = argument[1];
      // this.$confirm(`确定对[id=${id}]进行[删除]操作?`, "提示", {
      this.$confirm(`确定对[${name}]进行[删除]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            message: "操作成功",
            type: "success",
          });

          // 点击确认删除,发送请求给后端,页面重新加载
          //木
          this.$http({
            url: this.$http.adornUrl("/rp/plan/delete"),
            method: "get",
            params: this.$http.adornParams({
              planId: id,
            }),
            //data: this.$http.adornData({ ids: [id] })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              // console.log("删除预案",data)
            } else {
              this.$message.error(data.msg);
            }
          });
          // 点击确认删除,发送请求给后端,页面重新加载
          let indexdelete = this.dataList.findIndex((item) => {
            return item.id === id;
          });
          this.dataList.splice(indexdelete, 1);
          // 重新获取全部预案
          // this.handleHTTPplan();
        })
        .catch(() => {});
    },
    // 搜索功能
    handelHTTPSeek(data) {
      this.pageIndex = 1;
      this.keyword = data;
      this.getDataList();
    },

    // 批量删除
    planMoreDelete(argument) {
      let arr = argument[0];
      let planNames = argument[1];
      if (arr.length === 0) {
        this.$message.error("请选中预案在进行删除!");
        return;
      }
      // this.$confirm(`确定对[id=${arr}]进行[批量删除]操作?`, "批量删除", {
      this.$confirm(`确定对[${planNames}]进行[批量删除]操作?`, "批量删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 点击确认删除,发送请求给后端,页面重新加载
          console.log(arr);
          this.$http({
            url: this.$http.adornUrl("/rp/plan/deleteAll"),
            method: "post",
            data: this.$http.adornData({ planId: arr }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.handleHTTPplan();
            } else {
              this.$message.error(data.msg);
            }
          });
          ids.forEach((item) => {
            const index = this.dataList.findIndex(
              (listitem) => listitem.id == item
            );
            if (index === null) return;
            this.dataList.splice(index, 1);
          });
        })
        .catch(() => {});
    },
    // 批量启动
    planMoreStart(arr) {
      if (arr.length === 0) {
        this.$message.error("请选择预案!");
        return;
      }
      this.$confirm(`确定对[id=${arr}]进行[批量启动]操作?`, "批量启动", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 点击确认删除,发送请求给后端,页面重新加载
          console.log(arr);
          this.$http({
            url: this.$http.adornUrl("/rp/plan/startAll"),
            method: "post",
            data: this.$http.adornData({ planId: arr }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.handleHTTPplan();
            } else {
              this.$message.error(data.msg);
            }
          });
          // ids.forEach((item) => {
          //   const index = this.dataList.findIndex(
          //     (listitem) => listitem.id == item
          //   );
          //   if (index === null) return;
          //   this.dataList.splice(index, 1);
          // });
        })
        .catch(() => {});
    },
    // 批量停止
    planMoreStop(arr) {
      if (arr.length === 0) {
        this.$message.error("请选择预案!");
        return;
      }
      this.$confirm(`确定对[id=${arr}]进行[批量停止]操作?`, "批量停止", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 点击确认删除,发送请求给后端,页面重新加载
          console.log(arr);
          this.$http({
            url: this.$http.adornUrl("/rp/plan/stopAll"),
            method: "post",
            data: this.$http.adornData({ planId: arr }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.handleHTTPplan();
            } else {
              this.$message.error(data.msg);
            }
          });
          // ids.forEach((item) => {
          //   const index = this.dataList.findIndex(
          //     (listitem) => listitem.id == item
          //   );
          //   if (index === null) return;
          //   this.dataList.splice(index, 1);
          // });
        })
        .catch(() => {});
    },
  },
};
</script>
<style scoped lang="scss">
.header {
  clear: both;
  line-height: 80px;
  border: 1px solid rgba(219, 219, 219, 1);
  border-radius: 3px;
}
.tableClass {
  padding: 3px;
  border: 1px solid rgba(230, 230, 230, 1);
  height: 652px;
  width: 82%;
  margin-left: 20px;
  min-width: 540px;
}
.el-aside {
  // background-color: #fff;
  color: #333;
  text-align: center;
  /*line-height: 500px;*/
  border: 1px solid #ebeef5;
}
.el-card__body {
  padding: 0;
}
.el-col-6 {
  width: 20%;
}

.site-wrapper .el-pagination {
  text-align: center;
}

.input-button {
  padding: 10px 0 20px 0;
}

.input-with-select {
  width: 300px;
  float: left;
  margin-right: 20px;
}
</style>
