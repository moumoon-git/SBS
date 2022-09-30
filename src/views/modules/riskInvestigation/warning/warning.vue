<template>
  <div>
    <div class="warning-all-container">
      <div
        :class="[
          'warning-tree',
          { left__collapse: leftCollaspe }]"
      >
        <div
          class="left__collapse__button"
          @click="leftCollaspe = !leftCollaspe;"
        />
        <div class="warning-tree-top">
          <div
            class="warning-tree-tab"
            @click="showAreaTree()"
            :class="buttonType == '0' ? 'warning-tree-tab-active' : ''"
          >
            <span>巡查区域</span>
          </div>
          <div
            class="warning-tree-tab"
            @click="showGroupTree()"
            :class="buttonType == '1' ? 'warning-tree-tab-active' : ''"
          >
            <span>项目分组</span>
          </div>
        </div>
        <div class="warning-tree-search">
          <div
            class="el-icon-search warning-tree-search-icon"
            @click="searchTree"
          ></div>
          <input
            class="warning-tree-search-inner"
            placeholder="按enter搜索"
            v-model="search.searchTreeName"
            @keyup.enter="searchTree"
          />
          <div
            class="warning-tree-search-cancel el-icon-close"
            v-if="search.searchTreeName"
            @click="
              search.searchTreeName = '';
              searchTree();
            "
          ></div>
        </div>
        <div class="warning-tree-scroll">
          <el-tree
            ref="tree"
            :highlight-current="true"
            @node-click="handleNodeClick"
            @check="handleCheckClick"
            :data="treeList"
            :props="treeProps"
            :show-checkbox="exportVisible"
            node-key="id"
            :default-expanded-keys="[0]"
            :current-node-key="0"
          ></el-tree>
        </div>
      </div>
      <div class="warning-content-wrapper">
        <!-- 1. 顶部功能栏 -->
        <div class="warning-content-header" @keyup.enter.native="getDataList()">
          <div class="warning-content-header-title">隐患预警</div>
          <span class="warning-content-header-button">
            <el-select
              class="warning-content-header-cycle"
              v-model="dataForm.value"
              clearable
              placeholder="巡查周期"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select
              class="warning-content-header-disposer"
              v-model="dataForm.value2"
              clearable
              placeholder="处置人"
            >
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-date-picker
              class="warning-content-header-date"
              v-model="dataForm.dateRange"
              clearable
              :unlink-panels="false"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="medium"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
            <el-input
              class="warning-content-header-search"
              v-model="dataForm.name"
              placeholder="请输入项目名/情况说明/巡查人"
              clearable
            ></el-input>
            <el-button
              class="warning-content-header-search-button"
              type="primary"
              plain
              @click="searchResult()"
              >查询</el-button
            >
            <el-button
              class="warning-content-header-export-button"
              plain
              size="medium"
              slot="reference"
              @click="
                exportVisible = !exportVisible;
                treeList[0].disabled = !treeList[0].disabled;
              "
            >
              <img src="../../../../assets/img/download.svg" />
              导出数据
            </el-button>
            <div
              class="warning-content-header-export-expand"
              :class="
                !exportVisible
                  ? 'warning-content-header-export-expand-hide'
                  : ''
              "
            >
              <div
                class="warning-content-header-export-expand-item"
                @click="exportSelectAll()"
              >
                选择数据导出
              </div>
              <div
                class="warning-content-header-export-expand-item"
                @click="exportSearchAll()"
              >
                查询分组导出
              </div>
            </div>
          </span>
        </div>
        <!-- 2. 表格 -->
        <div class="warning-content-table">
          <el-table
            :data="dataList"
            height="calc(100% - 155px)"
            border
            v-loading="dataListLoading"
            :header-cell-style="getRowClass"
            @select="selectCheckBox"
            @select-all="selectAllCheckBox"
          >
            <!-- <el-table-column prop="id" header-align="center" align="center" width="80" type="hidden"></el-table-column> -->
            <el-table-column
              v-if="exportVisible"
              type="selection"
              header-align="left"
              align="center"
              width="50"
            ></el-table-column>
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="50px"
            ></el-table-column>
            <el-table-column
              prop="inforName"
              header-align="center"
              align="center"
              label="检查项目"
            ></el-table-column>
            <el-table-column
              prop="remark"
              header-align="center"
              align="center"
              label="情况说明"
            ></el-table-column>
            <el-table-column
              prop="period"
              header-align="center"
              align="center"
              label="检查周期"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.period == '1'">每天</span>
                <span v-if="scope.row.period == '2'">每周</span>
                <span v-if="scope.row.period == '3'">每月</span>
                <span v-if="scope.row.period == '4'">每年</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="patrolContactorString"
              header-align="center"
              align="center"
              label="巡查人"
            ></el-table-column>
            <el-table-column
              prop="gmtModified"
              header-align="center"
              align="center"
              label="巡查时间"
              width="200px"
            ></el-table-column>
            <el-table-column
              prop="isNotice"
              header-align="center"
              align="center"
              label="是否通知处置人"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.isNotice == '0'">通知</span>
                <span v-if="scope.row.isNotice == '1'">不通知</span>
              </template>
            </el-table-column>
            <el-table-column
              header-align="center"
              align="center"
              width="150"
              label="操作"
            >
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="查看"
                  placement="top"
                >
                  <div
                    class="button-view"
                    @click="addOrUpdateHandle(scope.row.id, 'show')"
                  ></div>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 3. 分页 -->
        <div class="warning-content-footer">
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, prev, pager, next, sizes, jumper"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 数据弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    ></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./warning-add-or-update";
import { platformTreeDataTranslate } from "@/utils";
import Cookies from "js-cookie";
var token = document.cookie;
var httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  data() {
    return {
      leftCollaspe: false,
      //  获取到的token
      documenttoken: `${httpaddress}/mail/mailgroup/xlsInput?token=${this.$cookie.get(
        "token"
      )}`,
      buttonType: "0",
      search: {
        searchTreeName: "",
      },
      areaTreeIds: [], //巡查区域树被点击时候获取到的id
      groupTreeIds: [], //项目分组区域被点击时候获取到的id
      areaCheckboxTreeIds: [], //巡查区域复选框被选中时候获取到的id
      groupCheckboxTreeIds: [], //项目分组复选框被选中时候获取到的id
      treeList: [],
      treeProps: {
        children: "children",
        label: "name",
      },
      //查询数据
      dataForm: {
        value: "",
        value2: "",
        name: "",
        dateRange: [],
        enclosure: "",
        fileName: "",
      },
      options: [
        {
          value: "1",
          label: "每天",
        },
        {
          value: "2",
          label: "每周",
        },
        {
          value: "3",
          label: "每月",
        },
        {
          value: "4",
          label: "每年",
        },
      ],
      options2: [
        {
          value: "0",
          label: "通知",
        },
        {
          value: "1",
          label: "不通知",
        },
      ],
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      exportVisible: false,
      selectionIds: [], //复选框选中的id
    };
  },
  components: {
    AddOrUpdate,
  },
  mounted() {
    // this.getPlatformDataList();
    this.getDataList();
    this.getAreaTree();
  },
  methods: {
    //复选框被选中事件
    selectCheckBox(selection, row) {
      this.selectionIds = [];
      //判断是否被选中
      selection.forEach((v) => {
        this.selectionIds.push(v.id);
      });
      console.log(this.selectionIds);
    },
    //复选框全选事件
    selectAllCheckBox(selection) {
      this.selectionIds = [];
      selection.forEach((v) => {
        this.selectionIds.push(v.id);
      });
      this.selectionData = selection;
      console.log("全选被触发了", this.selectionData, this.selectionIds);
      for (let index = 0; index < this.dataList.length; index++) {
        if (selection.length == 0) {
          console.log("反选情况");
          this.noCheck(index);
        } else {
          console.log("全选情况", selection);
          this.isCheck(index);
        }
      }
    },
    //表头填充
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#F0F5FF";
        //return 'background: #0091FF'
      } else {
        return "";
      }
    },
    searchTree() {
      this.pageIndex = 1;
      if (this.buttonType == "0") {
        this.getAreaTree();
      } else {
        this.getGroupTree();
      }
    },
    getDataList() {
      this.dataListLoading = true;
      // console.log("日期格式", this.dataForm.dateRange);
      if (this.dataForm.dateRange == null) {
        this.dataForm.dateRange = [];
      }
      if (this.buttonType == "0") {
        this.groupTreeIds = [];
      } else {
        this.areaTreeIds = [];
      }
      this.$http({
        url: this.$http.adornUrl(`/investigation/instanceInfor/instanceList`),
        method: "post",
        data: this.$http.adornData({
          page: this.pageIndex,
          limit: this.pageSize,
          search: this.dataForm.name,
          taskGroups: this.areaTreeIds,
          inforGroups: this.groupTreeIds,
          isNotice: this.dataForm.value2,
          period: this.dataForm.value,
          startTime: this.dataForm.dateRange[0],
          endTime: this.dataForm.dateRange[1],
        }),
      }).then(({ data }) => {
        console.log("数据列表data", data);
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
    //获取巡查区域树
    getAreaTree() {
      this.$http({
        url: this.$http.adornUrl(
          "/investigation/investigationTaskGroup/listTree"
        ),
        method: "get",
        params: this.$http.adornParams({
          name: this.search.searchTreeName,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log("巡查区域树形数据", data);
          // this.treeList = data.data;
          // this.treeList = [{
          //   id: 0,
          //   name: '全部',
          //   children: null
          // }]
          // this.treeList[0].children = data.data
          this.treeList = [
            {
              id: 0,
              name: "全部",
              children: null,
              disabled: false,
            },
            ...data.data,
          ];
          this.getDataList();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //获取项目分组树
    getGroupTree() {
      this.$http({
        url: this.$http.adornUrl("/investigation/investigationGroup/listTree"),
        method: "get",
        params: this.$http.adornParams({
          name: this.search.searchTreeName,
        }),
      }).then(({ data }) => {
        console.log("树形数据", data);
        // this.treeList = data.data;
        this.treeList = [
          {
            id: 0,
            name: "全部",
            children: null,
          },
          ...data.data,
        ];
        // this.treeList[0].children = data.data
        this.getDataList();
      });
    },
    //获取全部
    // getAll() {
    //   if (this.buttonType == "0") {
    //     this.areaTreeIds = [];
    //     this.getDataList();
    //   } else {
    //     this.groupTreeIds = [];
    //     this.getDataList();
    //   }
    // },
    showAreaTree() {
      this.buttonType = "0";
      this.search.searchTreeName = "";
      this.getAreaTree();
    },
    showGroupTree() {
      this.buttonType = "1";
      this.search.searchTreeName = "";
      this.getGroupTree();
    },
    //查询数据
    searchResult() {
      this.pageIndex = 1;
      this.getDataList();
    },
    // 选择数据导出
    exportSelectAll() {
      this.$http({
        url: this.$http.adornUrl(
          "/investigation/instanceInfor/xlsOutputSelectYh"
        ),
        method: "post",
        data: this.$http.adornData({
          checkedIds: this.selectionIds,
        }),
        responseType: "arraybuffer",
      })
        .then(({ data }) => {
          if (this.selectionIds.length < 1) {
            this.$message({
              message: "请选择相应数据进行导出",
              type: "warning",
            });
            return;
          }
          if (navigator.msSaveOrOpenBlob) {
            // 兼容ie
            navigator.msSaveOrOpenBlob(
              new Blob([data], { type: "application/vnd.ms-excel" }),
              "导出数据.xls"
            );
          } else {
            let a = document.createElement("a");
            a.href = window.URL.createObjectURL(
              new Blob([data], { type: "application/vnd.ms-excel" })
            );
            a.download = "导出数据.xls";
            document.body.appendChild(a); // 兼容Firefox浏览器
            a.click();
            a.remove();
          }
        })
        .catch((err) => {
          this.$message.error(data.msg);
        });

      // let httpaddress = window.SITE_CONFIG.baseUrl;
      // let checkedIds = this.$refs.tree.getCheckedKeys();
      // checkedIds = checkedIds.filter((item) => item !== 0);
      // // var checkedIds = [];
      // // if (this.buttonType == "0") {
      // //   checkedIds = this.areaTreeIds;
      // // } else {
      // //   checkedIds = this.groupTreeIds;
      // // }
      // // console.log("分组数据", checkedIds);

      // if (checkedIds.length < 1) {
      //   this.$message({
      //     message: "请选择一个分组进行导出",
      //     type: "warning",
      //   });
      // } else {
      //   let token = document.cookie;

      //   window.location.href = `${httpaddress}/investigation/instanceInfor/xlsOutputSelectYh?checkedIds=${
      //     this.buttonType == "0" ? this.areaTreeIds : this.groupTreeIds
      //   }
      //   &token=${Cookies.get("token")}`;
      // }
    },

    //查询分组导出
    exportSearchAll() {
      this.$http({
        url: this.$http.adornUrl(
          "/investigation/instanceInfor/xlsOutputConditionYh"
        ),
        method: "post",
        data: this.$http.adornData({
          taskGroups: this.areaCheckboxTreeIds,
          inforGroups: this.groupCheckboxTreeIds,
          search: this.dataForm.name,
          period: this.dataForm.value,
          startTime: this.dataForm.dateRange[0],
          endTime: this.dataForm.dateRange[1],
          isNotice: this.dataForm.value2,
        }),
        responseType: "arraybuffer",
      })
        .then(({ data }) => {
          if (
            this.areaCheckboxTreeIds.length < 1 &&
            this.groupCheckboxTreeIds.length < 1
          ) {
            this.$message({
              message: "请选择相应分组进行导出",
              type: "warning",
            });
            return;
          }
          if (navigator.msSaveOrOpenBlob) {
            // 兼容ie
            navigator.msSaveOrOpenBlob(
              new Blob([data], { type: "application/vnd.ms-excel" }),
              "导出数据.xls"
            );
          } else {
            let a = document.createElement("a");
            a.href = window.URL.createObjectURL(
              new Blob([data], { type: "application/vnd.ms-excel" })
            );
            a.download = "导出数据.xls";
            document.body.appendChild(a); // 兼容Firefox浏览器
            a.click();
            a.remove();
          }
        })
        .catch((err) => {
          this.$message.error(data.msg);
        });

      // let httpaddress = window.SITE_CONFIG.baseUrl;
      // // var checkedIds = [];
      // // if (this.buttonType == "0") {
      // //   checkedIds = this.areaTreeIds;
      // // } else {
      // //   checkedIds = this.groupTreeIds;
      // // }
      // let checkedIds = this.$refs.tree.getCheckedKeys();
      // checkedIds = checkedIds.filter((item) => item !== 0);
      // this.$http({
      //   url: this.$http.adornUrl(
      //     "/investigation/instanceInfor/xlsOutputConditionYh"
      //   ),
      //   method: "post",
      //   data: this.$http.adornData({
      //     page: this.pageIndex,
      //     limit: this.pageSize,
      //     search: this.dataForm.name,
      //     taskGroups: this.areaTreeIds,
      //     inforGroups: this.groupTreeIds,
      //     isNotice: this.dataForm.value2,
      //     //period: this.dataForm.value,
      //     startTime: this.dataForm.dateRange[0],
      //     endTime: this.dataForm.dateRange[1],
      //   }),
      // }).then(({ data }) => {
      //   if (checkedIds.length < 1) {
      //     this.$message({
      //       message: "请选择相应分组进行导出",
      //       type: "warning",
      //     });
      //   } else if (data && data.code === 0) {
      //     let token = document.cookie;
      //     // console.log("this.deleteIds",this.deleteIds)
      //     // window.location.href = `${httpaddress}/investigation/investigationInfor/xlsOutputCondition?token=${Cookies.get("token")}`;
      //   } else {
      //     this.$message.error(data.msg);
      //   }
      // });

      // this.$http({
      //   url: this.$http.adornUrl(
      //     "/investigation/instanceInfor/xlsOutputConditionYh"
      //   ),
      //   method: "post",
      //   data: this.$http.adornData({
      //     page: this.pageIndex,
      //     limit: this.pageSize,
      //     search: this.dataForm.name,
      //     taskGroups: this.areaTreeIds,
      //     inforGroups: this.groupTreeIds,
      //     isNotice: this.dataForm.value2,
      //     //period: this.dataForm.value,
      //     startTime: this.dataForm.dateRange[0],
      //     endTime: this.dataForm.dateRange[1],
      //   }),
      //   responseType: "arraybuffer",
      // })
      //   .then(({ data }) => {
      //     if (this.checkedIds.length < 1) {
      //       this.$message({
      //         message: "请选择相应分组进行导出",
      //         type: "warning",
      //       });
      //       return;
      //     }
      //     let a = document.createElement("a");
      //     a.href = window.URL.createObjectURL(
      //       new Blob([data], { type: "application/vnd.ms-excel" })
      //     );
      //     a.download = "导出数据.xls";
      //     document.body.appendChild(a); // 兼容Firefox浏览器
      //     a.click();
      //     a.remove();
      //   })
      //   .catch((err) => {
      //     this.$message.error(data.msg);
      //   });
    },

    addOrUpdateHandle(id, type) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type);
      });
    },
    /**
     * @description: 树复选框被选中时触发
     * @param {*}
     * @return {*}
     */
    handleCheckClick(obj) {
      this.areaCheckboxTreeIds = [];
      this.groupCheckboxTreeIds = [];
      if (this.buttonType == "0") {
        obj.id == 0
          ? (this.areaCheckboxTreeIds = [])
          : (this.areaCheckboxTreeIds = [obj.id]);
      } else {
        obj.id == 0
          ? (this.groupCheckboxTreeIds = [])
          : (this.groupCheckboxTreeIds = [obj.id]);
      }
    },
    /**
     * @method
     * @desc 树节点勾选操作时触发表格更新
     */
    handleNodeClick(obj) {
      const ids = [];
      const findChildren = (parent) => {
        ids.push(parent.id);
        if (parent.children) {
          parent.children.forEach((child) => {
            findChildren(child);
          });
        }
      };
      findChildren(obj);

      this.pageIndex = 1;
      this.areaTreeIds = [];
      this.groupTreeIds = [];
      if (this.buttonType == "0") {
        this.areaTreeIds = obj.id == 0 ? [] : [...ids];
      } else {
        this.groupTreeIds = obj.id == 0 ? [] : [...ids];
      }
      this.getDataList();
    },

    // 新增 修改
    addOrUpdateHandle(id, type) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type);
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
  },
};
</script>
<style lang="less" scoped>
.warning-all-container {
  background: #f4f4f4;
  height: calc(100vh - 112px);
  display: flex;
  .warning-tree {
    background: white;
    // height: calc(100vh - 115px);
    height: 100%;
    // max-width: 358px;
    width: 300px;
    //min-width: 200px;
    box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
    border-radius: 4px;
    position: relative;
    transition: width 0.3s ease;
    .left__collapse__button{
    width: 20px;
        height: 70px;
        background: #ffffff;
        border-top-right-radius: 30px  50px;
        border-bottom-right-radius: 30px 50px;
        box-shadow: 1px 0px 5px rgba(54, 121, 225, 0.15);
        position: absolute;
        right: -20px;
        top: calc(50% - 35px);
        cursor: pointer;
        transition: right 0.3s ease;
        z-index: 1;
        &::after {
            content: '';
            display: block;
            width: 100%;
            height: 100%;
            background: no-repeat url('../../../../sinvieUI/img/tree/left_collapse_hover.svg') center/60% 20%;
        }
        &:hover::after{
            background-image: url('../../../../sinvieUI/img/tree/left_collapse.svg');
        }
  }
    .warning-tree-top {
      display: flex;
      // justify-content: space-between;
      // padding: 27px 69px 20px 69px;
      justify-content: space-around;
      padding: 27px 0 20px 0;
      border-bottom: 2px solid rgba(234, 238, 242, 1);
      margin-bottom: 27px;
      .warning-tree-tab {
        font-size: 16px;
        color: rgba(153, 153, 153, 1);
        cursor: pointer;
        position: relative;
      }
      .warning-tree-tab-active {
        color: rgba(51, 51, 51, 1);
        font-weight: bold;
      }
      .warning-tree-tab-active span::after {
        content: "";
        position: absolute;
        left: 27px;
        bottom: -30px;
        display: block;
        background: white;
        width: 20px;
        height: 20px;
        transform: rotate(45deg);
        border: 2px solid rgba(234, 238, 242, 1);
        border-bottom: none;
        border-right: none;
      }
    }
    .warning-tree-search {
      &:hover {
        border-color: #c0c4cc;
      }
      &:focus-within {
        border-color: rgba(0, 145, 255, 1);
      }
      margin: 0 auto;
      height: 40px;
      // width: 330px;
      width: calc(100% - 28px);
      border-radius: 21px;
      border: 1px solid rgba(232, 236, 240, 1);
      position: relative;
      margin-bottom: 20px;
      .warning-tree-search-icon {
        font-size: 17px;
        font-weight: bold;
        width: 17px;
        height: 17px;
        color: rgba(153, 153, 153, 1);
        margin: 10px 0px 11px 18px;
        cursor: pointer;
      }
      .warning-tree-search-inner {
        border: none;
        outline: none;
        // width: 260px;
        width: calc(100% - 70px);
        font-size: 16px;
      }
      .warning-tree-search-cancel {
        width: 17px;
        height: 17px;
        line-height: 15px;
        font-size: 15px;
        text-align: center;
        border: 1px solid rgba(153, 153, 153, 1);
        color: rgba(153, 153, 153, 1);
        border-radius: 50%;
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 11px;
      }
      .warning-tree-search-cancel:hover {
        color: rgba(153, 153, 153, 0.5);
        border-color: rgba(153, 153, 153, 0.5);
      }
    }
    .warning-tree-scroll::-webkit-scrollbar {
      background: transparent;
      width: 5px;
    }
    .warning-tree-scroll::-webkit-scrollbar-thumb {
      background: rgba(153, 153, 153, 1);
      border-radius: 20px;
    }
    .warning-tree-scroll {
      overflow: auto;
      height: calc(100vh - 290px);
      /deep/.el-tree-node__content {
        height: 45px;
      }
      /deep/.el-tree-node__label {
        font-size: 14px;
      }
      /deep/.is-current > .el-tree-node__content {
        background: rgba(0, 145, 255, 0.1);
        border-left: 2px solid rgba(0, 145, 255, 1);
        color: rgba(0, 145, 255, 1);
      }
      /deep/.el-tree-node__content:hover {
        background: rgba(0, 145, 255, 0.1);
      }
    }
  }
  .left__collapse {
        width: 0px ;
        margin-right: 0;
        // 除了折叠按钮，隐藏其余所有元素
        &>*:not(.left__collapse__button) {
            display: none;
        }
        .left__collapse__button {
            margin-right: -10px;
            z-index: 2;
            border-radius: 0;
            border-top-left-radius: 30px  50px  ;
            border-bottom-left-radius: 30px 50px  ;
            border-top-right-radius: 0px ;
            border-bottom-right-radius: 0px  ;
            transform: rotate(180deg);
            box-shadow: -1px 0px 5px rgba(54, 121, 225, 0.15)  ;
            // margin-top: 400px;
        }
    }
  .warning-content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
    border: 1px solid transparent;
    background: white;
    margin-left: 10px;
    // width: 1360px;
   // width: calc(78% - 10px);
   // min-width: 1050px;
    // height: calc(100vh - 115px);
    height: 100%;
    position: relative;
    .warning-content-header {
      height: 76px;
      .warning-content-header-title {
        border-left: 3px solid rgba(0, 145, 255, 1);
        font-size: 16px;
        font-weight: bold;
        display: inline-block;
        height: 16px;
        line-height: 16px;
        padding-left: 14px;
        position: absolute;
        left: 15px;
        top: 30px;
      }
      .warning-content-header-button {
        position: absolute;
        right: 13px;
        top: 17px;
        .warning-content-header-cycle,
        .warning-content-header-disposer {
          width: 104px;
          height: 42px;
          /deep/.el-input__inner {
            height: 42px;
            line-height: 42px;
            padding-left: 10px;
            padding-right: 10px;
            font-size: 16px;
          }
          /deep/.el-icon-arrow-up::before {
            margin-top: 9px;
          }
          /deep/.el-input__suffix {
            right: 2px;
          }
          /deep/.el-icon-arrow-up::before {
            background: no-repeat
              url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAOCAYAAAA1+Nx+AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAADgAAAAANlRePAAABeklEQVQ4Eb1SsUrEQBC9TXEBwc5gL/gBFsKh5BIrK1sNglwh9lp4foMnqL9wCBJrsbAQk0tODiysUgn2EvsjFonvHVnY80xcLFwYZjIz772Z3TQa/33CMNxJkqT5V11iwbEt8YYM6AeDwUFRFH6apn14odZ0YmJK7A25iJkSMAzDF0K8IO+h4VyHVO0pMR45yMXazJSj0Wgxy7InTLOE+onruj2VpCoOgqCL2inI30zTXGu1Wu/snRFgEne4DDeELWCSjm3bV8xXnSiK9vI876P+AVt3HOdV9v4owCImWoV7xERN2Fa73b6XINXjWjax7S3sE/kNbPys1isF2PQbWGeIqUdWlRlzalzRPjaYg92VVzdpY8wca+yp2rB2AymITY5xxz2QTR4QhGI8Hg/5IyDugvxM9n73WgIEYeILEB5ChL9xA/EK4ks86BG/q462AAgFRK5B5JVkPsh3IVJUkTNf+wYqkESWZXXgH2hlXEuu4rXjOI7nabqAL81rpopzt9VwAAAAAElFTkSuQmCC);
            background-size: 20px 10px;
            background-position: center;
            transform: rotate(180deg);
          }
          /deep/.el-icon-circle-close {
            font-size: 17px;
          }
        }
        .warning-content-header-date {
          height: 42px;
          width: 290px;
          margin-left: 1px;
          /deep/.el-icon-date {
            top: 2px;
          }
          /deep/.el-range-input,
          /deep/.el-range-separator {
            font-size: 16px;
          }
          /deep/.el-range-input {
            margin-left: 20px;
            width: 105px;
          }
          /deep/.el-range-separator {
            margin-top: 5px;
            margin-left: 5px;
            margin-right: -15px;
          }
          /deep/.el-range__icon {
            font-size: 17px;
          }
          /deep/.el-range__close-icon {
            font-size: 17px;
            position: relative;
            top: 1px;
          }
        }
        .warning-content-header-search {
          width: 270px;
          /deep/.el-input__inner {
            height: 42px;
            width: 270px;
            font-size: 16px;
          }
          /deep/.el-input__clear {
            font-size: 17px;
            padding-top: 2px;
          }
        }
        .warning-content-header-search-button,
        .warning-content-header-export-button {
          height: 42px !important;
          position: relative;
          bottom: 1px;
          /deep/span {
            font-size: 16px;
          }
        }
        .warning-content-header-export-button {
          padding: 10px;
          margin-left: 1px;
        }
        .warning-content-header-export-expand {
          position: absolute;
          border: 1px solid white;
          border-radius: 4px;
          right: 0;
          top: 45px;
          background: white;
          z-index: 999;
          transition: opacity 0.5s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
          color: rgba(85, 85, 85, 1);
          font-size: 16px;
          .warning-content-header-export-expand-item {
            cursor: pointer;
            padding: 5px 10px;
            font-size: 16px;
          }
          .warning-content-header-export-expand-item:hover {
            background: #e2f5ff;
            color: #0091ff;
          }
        }
        .warning-content-header-export-expand-hide {
          opacity: 0;
          z-index: -999;
        }
      }
    }
    .warning-content-table {
      height: calc(100% - 155px);
      overflow: hidden;
      /deep/.el-table {
        -webkit-box-shadow: none;
        box-shadow: none;
        border: none;
        position: absolute;
        left: -1px;
        width: calc(100% + 3px);
        max-width: none;
        overflow-y: auto;
        thead div {
          font-size: 14px;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          th {
            height: 56px;
          }
        }
        tbody {
          td {
            min-height: 67px;
            height: 67px;
          }
          div {
            font-size: 14px;
            font-family: "Microsoft YaHei", PingFangSC-Regular, "PingFang SC",
              Roboto-Regular, SourceHanSansCN-Regular;
            font-weight: normal;
            color: rgba(102, 102, 102, 1);
          }
          td {
            border-left: none;
            border-right: none;
            .button-view {
              margin: 0 auto;
              width: 27px;
              height: 25px;
              cursor: pointer;
              background: no-repeat
                url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAkCAYAAADl9UilAAAEDElEQVRYR+2Wb2hVZRzHv9/nrOlWU5molcSiMoTaIne79zZ7Y0QUQkLLEZTb7k3qTc02rSCDDDKodEvrTWH3bloQswQDKyLyTa57592grUCyohFWOhzO1aZr53zjzhn7c+89z50Vvtjz7pzn+/38vvzO8zznIS7Twcs0F+aC5ftl5jr2v3QsntJKelgLodLzVE5yCYCFE8UHJfUbw14QXTI4FAnw2H8W7JPjmtc/gA2e0ACoPL9C7DXE7sFS7GtYwfM2Xqs1FktoHYlmSDfYQLNqyJ8kNEXDPOjHyRmsvUNFww52S9roB8pnnuSeYhcNNVUcyebLGqwtqcUe8DGkqnyKWmvJDgM8UBfi6UyejMHeTmlh4Ri+BLTKutCshOweLcDdTwQ4ON0+I1i75Awn8ZmgeyxrDQD8CELvuJ4oB1QNoNTGT/CL4hDuqyHdyfoZweJfazuo522goNpGHbPpt0oMXZfCirTnlwCOX9OFkkLX2wWxzoojvhK5k1uzBms7qqDnqgOA4wcUFI+GnWgsoUcJvAro2gse/irguWiY78USboxgxI8FwDUeq+qq2HlR+0/HJLEtiU5BAV+Q0O+5vJEOHiTVmkkvsV4uDhhHP4JIH8A5B8FUXQhBkrqwIiZGW0IPedB+P8C4SXqr7Jxp7CvCCUFLM+8qniobwfK++V6LyCdtuAZcXxfmh1OCxRNeAkDIBkBy45iLbseoO6fe8HYKlZL22HABJCNhE54erAuA1fEgMGqAHkGpXAUJBjygglDMMlh3JGwqpwRrTaha0Hgb/QbBnWcHsLVksX6HsCijnjgzdJpXLyjFdkGb/ZjpecewujbIA1OCpR/iCX0FaLUF5ASW8Sb243F52pVxjRlu0hK8g5P6AcByfyaPRMK866Juyjm296hudV2lP2mhL4hsjoS4OZZUI6WXAJRMeIZEvhgNsSWe1E5ITb4sYNRxWFl7B7/NGCz9MpbQFkKvW8BAaMfZAfPCvKVwCl2Mr41RB13nT8FdUIqXBW2x4Qh8Jhrmjsnamf9Kia2d+EBSjQ0UQh+g941jetJ6z/UqAD4CoszGT7K9PoiHMXF+Ze1YeqK5Q0WLjA4RWGMDn61GwOEzHtc2Zbj+ZL327P1GV3oj2C/o/tkWzuUj+Kkpwvra2/hnxs2Ty7ztsAqun++9JvLpyX+JSwwqSm/8fM48u20Nx7KxrK7WrQndK+hNADdfYqjvCT5VH+bnfhyrYGlI+3cqHB5CvaRGECv9wFPmhWMkW4pL0FpzC0dtvNbBJsP2pbTqrzFvHckghAoAyyZdldIXvpMgeiR1XlFgDm4IMPc/NUPSWQWbwZH47hFclX7/2Gr8MX3r23RouubfCTabyj6euWD5NnWuY/l27G9733k0ycG80wAAAABJRU5ErkJggg==);
              background-size: 100% 100%;
              &:hover {
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAkCAYAAADl9UilAAADdElEQVRYR+2XW4iMYRjHf4/ZzIp1WDlfKKdcWMUK4YYkUpRFCjkkbtb3rXUqlFUox9357A3JIZScihJJ3LCx2b3AhZzKhXPWYckOOz16v92tmd2Z+d4Zh1zsczff9///n/88877P84zwn4b8p75oN5bpL9NesX9TsQM6HGUmUIhSAPRC6OYnVz4D7xEeADUIl1ktj/6eMU/DKIsRnGYz9rmMScVDOIEjURui3RmL6GxgPzDIRjQN5jlQiisXg3TSG9uvncjBQ1kRJJTRe+EwjTiUyvdUvNTGKrUnMS4BEzJKag+uIsQsiuVDMkpyYwe1G1FuoIy2z5MFUqglzBRWibkwCdHW2BkN8YarKFMtU9UhnEf9WwhCAUoRkG/FF67Tl+nMl1g8vq0xT3egbLIShePk4vKaeroz1Od84gn9yKOBCLDESkfYiSObUxvzdCxKFRCyEDyKK8up0EUIu4D+zZxXKBspkZNE9AiwzEIrhjABR6pbsHEVU8GjGmWMhdB7GhhMLnOAYynwS2ngArk88xtwUAj3cBgLok0noiU8nYtyNojffI4qqWMN+bxE6Z2UI7yjjgHkU45SbKk7D0fOJRqL6B1gnJWA6WsdqEWpTYvPYRQ/KcT0Lbu4iyvjE41VqJlrtu1hOXAfuBeQzxyLkYA5a8FhvmiJFLY2VoTglzEwhH3AZpQ3QPcU+E8IfQFzy9cGaja5KcKRC4nGzCdPb6FMtBB5SVeGUM9K1G8LbUNwyeMQX3gKDAjUFG7jyKQWXGIfi+gI1F9VOgYKmaHuyloqdA2wDSHP5yj1wFZKpJyImsqWBmopPxAKceVhcmPmaUTXAXsCxZoAexG2ECZEFP9sEKaGKDGU7YDRson1uLI3HphkVqoQ4TQw30YReIFwCvEvg6nYSJSFwEBL/hlcFrT0r9QVM2/MuhPiMjDZUjxb2E1izEy2/qRee/ZoZ8KcRZmRbda0POEKUeaxXr4lvzvp2GWaQw92AyUJU+L3nJqRU8FHNlAmjamk7FZrT6ehHACG/Z4nHiOsxpFrQTp2xoxKmXakB0sB0x6GBwm3em/+JZXzkWOUyQ8brr2xeLVKHU0jsxGzDfgjp0/cqmQWvrf+yFKqyeEixZJ+piZxmp2xNkJqNrIu/uONfG199W0q1Brzh4xlkzo9p91YpjVtr1imFfsFaaXrJVm90+MAAAAASUVORK5CYII=);
              }
            }
          }
          tr {
            background: none;
          }
          tr:hover {
            box-shadow: 0px 0px 11px 3px rgba(67, 85, 114, 0.1);
            td:nth-child(1) {
              border-left: 3px solid #0091ff;
            }
          }
        }
      }
    }
    .warning-content-footer {
      height: 83px;
      position: relative;
      .el-pagination {
        position: absolute;
        bottom: 15px;
        right: 30px;
        /deep/.el-pagination__total {
          font-size: 16px;
          color: rgba(96, 98, 102, 1);
          vertical-align: center;
          position: relative;
          top: 8px;
          right: 10px;
        }
        /deep/.number,
        /deep/.btn-prev,
        /deep/.btn-next,
        /deep/.more {
          border-radius: 3px;
          height: 42px;
          width: 42px;
          line-height: 42px;
          font-size: 16px;
          font-weight: normal;
          margin: 0;
          margin-right: 14px;
        }
        /deep/.el-pagination__sizes {
          .el-input__inner {
            border-radius: 3px;
            height: 42px;
            width: 107px;
            line-height: 42px;
            font-size: 16px;
          }
        }
        /deep/.el-pagination__jump {
          height: 42px;
          line-height: 42px;
          font-size: 16px;
          margin-left: 5px;
          /deep/.el-input__inner {
            border-radius: 3px;
            height: 42px;
            width: 38px;
            line-height: 42px;
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
