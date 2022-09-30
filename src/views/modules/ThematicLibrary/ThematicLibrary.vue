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
            @click="showBaseTree()"
            :class="buttonType == '0' ? 'warning-tree-tab-active' : ''"
          >
            <span>基础库</span>
          </div>
          <div
            class="warning-tree-tab"
            @click="showThemeTree()"
            :class="buttonType == '1' ? 'warning-tree-tab-active' : ''"
          >
            <span>主题库</span>
          </div>
          <div
            class="warning-tree-tab"
            @click="showIndexTree()"
            :class="buttonType == '2' ? 'warning-tree-tab-active' : ''"
          >
            <span>指标库</span>
          </div>
        </div>
        <div class="warning-tree-scroll">
          <div :class="['tableName', { 'isActive': tableNameIdx === index}]" v-for="(item, index) in tableNameList" @click="handleNodeClick(item, index)" :key="item">
            {{item}}
          </div>
        </div>
      </div>
      <div class="warning-content-wrapper">
        <!-- 1. 顶部功能栏 -->
        <div class="warning-content-header" @keyup.enter.native="getDataList()">
          <div class="warning-content-header-title">专题库建设</div>
        </div>
        <!-- 2. 表格 -->
        <div class="warning-content-table">
          <el-table
            :data="dataList"
            max-height="calc(100% - 155px)"
            border
            v-loading="dataListLoading"
            :header-cell-style="getRowClass"
          >
            <el-table-column
              :label="item"
              align="center"
              v-for="item in tableHeader"
              :key="item"
              show-overflow-tooltip
              min-width="100"
            >
              <template slot-scope="scope">
                {{scope.row[item]}}
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
  </div>
</template>

<script>
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
      tableNameList: [],
      dataList: [],
      tableHeader: [],
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      subjectLibraryName: '',
      tableNameIdx: 0,
    };
  },
  mounted() {
    // this.getPlatformDataList();
    this.getLibraryTree();
  },
  methods: {
    //表头填充
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#F0F5FF";
        //return 'background: #0091FF'
      } else {
        return "";
      }
    },
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl('/special/theme/tableCollect/data'),
        method: "post",
        data: this.$http.adornData({
          page: this.pageIndex,
          limit: this.pageSize,
          tableName: this.subjectLibraryName,
        }),
      }).then(({ data }) => {
        console.log("数据列表data", data);
        if (data && data.code === 0) {
          this.dataList = data.data.list;
          this.totalPage = data.data.totalCount;
          this.getTableHeader();
        } else {
          this.dataList = [];
          this.totalPage = 0;
          this.$message.error(data.msg);
        }
        this.dataListLoading = false;
      });
    },
    // 获取表头
    getTableHeader() {
      this.$http({
        url: this.$http.adornUrl(
          "/special/theme/tableCollect/columns"
        ),
        method: "get",
        params: this.$http.adornParams({
          tableName: this.subjectLibraryName,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.tableHeader = data.data && data.data.length?data.data:[];
        } else {
          this.$message.error(data.msg);
        }
      });
    },  
    //获取不同专题库表名
    getLibraryTree() {
      this.pageIndex = 1;
      this.$http({
        url: this.$http.adornUrl(
          "/special/theme/tableCollect/tableNames"
        ),
        method: "get",
        params: this.$http.adornParams({
          type: parseInt(this.buttonType)+1,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log("巡查区域树形数据", data);
          this.tableNameList = data.data
          if (this.tableNameList && this.tableNameList.length) {
            this.subjectLibraryName = this.tableNameList[0];
            this.getDataList();
            return
          }
          this.tableHeader = [];
        } else {
          this.tableHeader = [];
          this.$message.error(data.msg);
        }
      });
    },
    showBaseTree() {
      this.buttonType = "0";
      this.getLibraryTree();
    },
    showThemeTree() {
      this.buttonType = "1";
      this.getLibraryTree();
    },
    showIndexTree() {
      this.buttonType = "2";
      this.getLibraryTree();
    },
    /**
     * @method
     * @desc 树节点勾选操作时触发表格更新
     */
    handleNodeClick(name, idx) {
      this.pageIndex = 1;
      this.tableNameIdx = idx;
      this.subjectLibraryName = name;
      this.getDataList();
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
            background: no-repeat url('../../../sinvieUI/img/tree/left_collapse_hover.svg') center/60% 20%;
        }
        &:hover::after{
            background-image: url('../../../sinvieUI/img/tree/left_collapse.svg');
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
        left: 14px;
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
      .tableName{
        padding: 15px 20px;
        &:hover {
          background-color: rgba(0, 145, 255, 0.1);
        }
      }
      .isActive {
        border-left: 2px solid #0091ff;
        background-color: rgba(0, 145, 255, 0.1);
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
        /deep/ li.active {
          border-color: #0091FF !important;
          color: #ffffff !important;
        }
      }
    }
  }
}
</style>
