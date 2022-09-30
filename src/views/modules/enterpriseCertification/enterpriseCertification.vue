<template>
  <div class="inspectionSheetManagement">
    <!-- 左侧搜索栏 -->
    <slot name="left__container">
      <div class="left-bar">
        <div class="treeClass">
          <!-- 树形 -->
          <el-tree
            :data="searchTreeData"
            :props="treeProps"
            ref="tree"
            node-key="id"
            :current-node-key="2"
            :highlight-current="true"
            @node-click="clickTree"
          ></el-tree>
        </div>
      </div>
    </slot>

    <!-- 右侧主体内容 -->
    <div class="task-wrapper">
      <!-- 右侧顶部选项栏 -->

      <div class="task-content-header">
        <div class="task-content-header-title">{{ title }}</div>
      </div>
      <!-- 右侧表单内容 -->
      <div class="task-content-table">
        <el-table :data="sheetTableData" height="calc(100% - 119px)">
          <!-- 1. 工单名称 -->
          <el-table-column
            header-align="center"
            align="center"
            :prop="item.prop"
            :label="item.label"
            v-for="item in tableColumn"
            :key="item.prop"
          ></el-table-column>
          <!-- 5. 发布时间 -->
          <el-table-column
            header-align="center"
            align="center"
            prop="modifiedUserId"
            label="修改人"
          ></el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="gmtModified"
            label="修改时间"
          ></el-table-column>
          <!-- 9. 操作按钮 -->
          <el-table-column
            header-align="center"
            align="center"
            prop
            label="操作"
          >
            <template slot-scope="scope">
              <span>
                <img
                  class="edit"
                  src="../../../assets/img/outEdit.svg"
                  alt="编辑"
                  style="cursor: pointer; width: 20px; margin-right: 10px"
                  @click="showReleaseSheet(scope.row)"
                  @mouseenter="mouseEnterImg(1, scope.$index)"
                  @mouseleave="mouseLeaveImg(1, scope.$index)"
                />
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 编辑企业弹窗 -->
    <editEnterprise
      ref="releaseSheet"
      @submitData="submitData"
    ></editEnterprise>
  </div>
</template>

<script>
// 发布编辑企业弹窗组件
import editEnterprise from "./editEnterprise";
// 查看企业弹窗组件
export default {
  components: {
    editEnterprise,
  },
  async mounted() {
    // 获取树形数据
    await this.getTreeList();
  },
  data() {
    return {
      title: "", // 右边顶部标题拿取左边选中当前树标题展示
      // 获取到的表单数据
      sheetTableData: [],

      tableColumn: [], // 默认表格表头标题
      tableColumnSysem: [
        { prop: "keyString", label: "行政区划" },
        { prop: "value", label: "巡检任务完成数" },
        { prop: "value1", label: "巡检任务未完成数" },
      ], // 网络化巡查系统、表头标题
      tableColumnFireControl: [
        { prop: "keyString", label: "名称" },
        { prop: "value", label: "数量" },
      ], // 越秀先锋、安全生产消防、表头标题
      tableColumnPeople: [
        { prop: "keyString", label: "行政区划" },
        { prop: "value", label: "社区人员数" },
      ], // 黄花岗社区人员表头标题
      tableColumnHotline: [
        { prop: "keyString", label: "工单" },
        { prop: "value", label: "数量" },
      ], // 12345市长投诉热线表头标题
      // 左侧搜索栏树形数据
      searchTreeData: [],
      newSearchTreeData: [], // 修改后新的树形数据（用于回到选中编辑前的树节点，避免修改后还是选择默认节点）
      // 树形配置
      treeProps: {
        value: "id",
        children: "children",
        label: "value",
      },
      currentNodeData: null, // 选中当前节点数据
      tableRowData: null, // 选中当前表格行数据
    };
  },
  created() {
    this.tableColumn = this.tableColumnSysem;
  },
  methods: {
    //鼠标移入事件
    mouseEnterImg(val, index) {
      console.log("鼠标移入", index);
      if (val == 1) {
        document
          .getElementsByClassName("edit")
          [index].setAttribute("src", require("../../../assets/img/edit.svg"));
      }
    },
    //鼠标离开事件
    mouseLeaveImg(val, index) {
      console.log("鼠标离开", index);
      if (val == 1) {
        document
          .getElementsByClassName("edit")
          [index].setAttribute(
            "src",
            require("../../../assets/img/outEdit.svg")
          );
      }
    },
    /**
     * @description: 点击显示编辑企业”弹窗
     * @lastUpdateTime : 2021/5/12
     * @lastEditor : xuchuangxing
     * @param {row} 选中表格行数据
     * @return {*}
     */
    showReleaseSheet(row) {
      this.tableRowData = row;
      let title = "";
      let enterpriseTitle = "";
      let numData = "";
      let arrkey = [
        "网络化巡查系统",
        "安全生产消防",
        "12345市长投诉热线",
        "越秀先锋",
        "黄花岗社区人员",
      ];
      let arrTitle = ["名称", "行政区划", "行政区划", "名称", "名称"]; // 根据当前选中树的节点对应于渲染不同企业的标题
      let arrEnterpriseTitle = ["行政区划", "名称", "工单", "名称", "行政区划"]; // 根据当前选中树的节点对应于渲染不同编辑弹窗的标题
      let arrNumData = [
        [
          { name: "巡检任务完成数", value: row.value },
          { name: "巡检任务未完成数", value: row.value1 },
        ],
        [{ name: "数量", value: row.value }],
        [{ name: "数量", value: row.value }],
        [{ name: "数量", value: row.value }],
        [{ name: "社区人员数", value: row.value }],
      ]; // 用于渲染编辑弹窗 多个数量选择器的标题和值
      arrkey.map((v, index) => {
        if (this.currentNodeData.value == v) {
          title = arrEnterpriseTitle[index];
          enterpriseTitle = arrEnterpriseTitle[index];
          numData = arrNumData[index];
        }
      });
      this.tableRowData = row;
      this.$refs.releaseSheet.init({
        title,
        enterpriseObj: { name: enterpriseTitle, value: row.keyString },
        numData,
      });
    },
    /**
     * @description: 获取树形数据
     * @lastUpdateTime : 2021/5/12
     * @lastEditor : xuchuangxing
     * @param {}
     * @return {*}
     */
    getTreeList() {
      this.$http({
        url: this.$http.adornUrl("/visualization/visualizationYxxf/list"),
        method: "post",
        params: this.$http.adornParams({
          name: this.searchName,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.list.map((v) => {
            v.children = [];
          });
          if (this.searchTreeData.length == 0) {
            this.searchTreeData = [...data.list];
          } else {
            this.newSearchTreeData = [...data.list];
          }
          console.log("this.searchTreeData: ", this.searchTreeData);

          this.getWorkData(
            //  用于修改后刷新当前表格数据
            this.currentNodeData
              ? this.currentNodeData.typeId
              : data.list[0].typeId
          );
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description: 获取表单数据
     * @lastUpdateTime : 2021/5/12
     * @lastEditor : xuchuangxing
     * @param {typeId} 当前选中树节点类型Id
     * @return {*}
     */
    getWorkData(typeId) {
      let filterData =
        this.newSearchTreeData.length > 0
          ? this.newSearchTreeData
          : this.searchTreeData;
      let currentNodeData = filterData.filter((v) => v.typeId == typeId);
      this.currentNodeData = currentNodeData[0];
      this.sheetTableData = currentNodeData[0].keyStringJson; // 从数形数据中拿取表格数据展示
      this.title = currentNodeData[0].value;
    },
    /**
     * @description: 点击树形数据，传组id查询列表
     * @lastUpdateTime : 2021/5/12
     * @lastEditor : xuchuangxing
     * @param {data} 当前选中树节点数据
     * @return {*}
     */
    clickTree(data) {
      var arrKey = [
        "网络化巡查系统",
        "安全生产消防",
        "12345市长投诉热线",
        "越秀先锋",
        "黄花岗社区人员",
      ];
      var arrValue = [
        this.tableColumnSysem,
        this.tableColumnFireControl,
        this.tableColumnHotline,
        this.tableColumnFireControl,
        this.tableColumnPeople,
      ];
      arrKey.map((v, index) => {
        if (data.value == v) {
          this.tableColumn = arrValue[index];
        }
      });
      this.getWorkData(data.typeId);
    },
    /**
     * @description: 执行修改操作并刷新表格
     * @lastUpdateTime : 2021/5/12
     * @lastEditor : xuchuangxing
     * @param {}
     * @return {*}
     */
    submitData(data) {
      let updateData = {
        type: this.currentNodeData.typeId,
        keyString: this.tableRowData.keyString,
        value: String(data.num[0].value),
        value1: data.num[1] ? String(data.num[1].value) : undefined,
        upKeyString: data.name,
      };
      const request = {
        method: "post",
        url: "/visualization/visualizationYxxf/update",
        baseURL: window.SITE_CONFIG.baseUrl,
        data: updateData,
      };
      this.$http(request)
        .then((response) => {
          if (response.data.code === 0) {
            this.newSearchTreeData = this.searchTreeData;
            this.getTreeList();
            // 提交成功后，清空数据
            this.$refs.releaseSheet.$refs.dialog.visible = false;
          } else {
            this.$message.warning(response.data.msg);
          }
          this.$refs.releaseSheet.loading = false;
        })
        .catch((error) => {
          this.$refs.releaseSheet.loading = false;
        });
    },
  },
};
</script>

<style lang="less" scoped>
* {
  font-family: PingFangSC-Regular, PingFang SC;
}
.inspectionSheetManagement {
  height: calc(100vh - 112px);
  display: flex;
  background: #f4f4f4;

  .left-bar {
    background: white;
    height: 100%;
    // max-width: 358px;
    width: 22%;
    min-width: 200px;
    box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);

    border-radius: 4px;
    font-family: PingFangSC-Regular, PingFang SC;

    .treeClass::-webkit-scrollbar {
      background: transparent;
      width: 5px;
    }
    .treeClass::-webkit-scrollbar-thumb {
      background: rgba(153, 153, 153, 1);
      border-radius: 20px;
    }
    .treeClass {
      overflow: auto;
      height: calc(100vh - 290px);

      /deep/.el-tree-node__content {
        height: 45px;
      }
      /deep/.el-tree-node__label {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
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

  .task-wrapper {
    border-radius: 4px;
    box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
    border: 1px solid transparent;
    background: white;
    margin-left: 10px;
    // width: 1360px;
    width: calc(78% - 10px);
    min-width: 1050px;
    // height: calc(100vh - 115px);
    height: 100%;
    position: relative;
    .task-content-header {
      height: 76px;
      .task-content-header-title {
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
    }
    .task-content-table {
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
        /deep/thead div {
          font-size: 14px;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          th {
            height: 56px;
          }
        }
        /deep/tbody {
          div {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
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
  }
}
</style>
