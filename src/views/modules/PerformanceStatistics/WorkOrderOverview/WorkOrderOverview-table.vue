<!--
 * @Author: liukanglin
 * @Date: 2020-12-02 13:32:33
 * @LastEditors: Liukanglin
 * @LastEditTime: 2021-01-05 19:49:24
 * @Desc: 工单总览表格
 * @FilePath: /SBS/src/views/modules/PerformanceStatistics/WorkOrderOverview/WorkOrderOverview-table.vue
-->
<template>
  <div class="work-order-overview-table">
    <div class="table__header">
      <div>责任人考核统计</div>
      <sv-input-search
        placeholder="请输入责任人姓名、单位名称、职位名称关键字查询"
        :width="inputSearchWidth"
        @change="tableSearch"
      />
    </div>
    <el-table
      v-loading="tableLoading"
      border
      :data="workOrderOverviewTableData.list"
      element-loading-spinner="sv-loading"
    >
      <template slot="empty">
        <img
          class="sv-table__empty"
          alt="暂无数据"
          src="./Image/table_empty.svg"
        >
        <p>暂无数据</p>
      </template>
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      />
      <el-table-column
        prop="name"
        label="姓名"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.name ? scope.row.name : "—" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.sex == "0" ?
            "男" : (scope.row.sex == "1" ? "女" : (scope.row.sex == "2" ? "未知" : "—" )) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="unit"
        label="所属单位"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.unit ? scope.row.unit : "—" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="联系电话"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.phone ? scope.row.phone : "—" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="eventNumber"
        label="工单数量"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.eventNumber ? scope.row.eventNumber : "—" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="avgResponseTime"
        label="平均响应时间（小时）"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.avgResponseTime ? scope.row.avgResponseTime : "—" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="avgHandleTime"
        label="平均处理时效（小时）"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.avgHandleTime ? scope.row.avgHandleTime : "—" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="responseRatio"
        label="响应率"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.responseRatio ? `${parseFloat(scope.row.responseRatio).toFixed(2)}%` : "—" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="handleRatio"
        label="处置率"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.handleRatio ? `${parseFloat(scope.row.handleRatio).toFixed(2)}%` : "—" }}
        </template>
      </el-table-column>
    </el-table>
    <div class="table__pagination">
      <el-pagination
        :total="workOrderOverviewTableData.totalCount"
        :current-page="1"
        :page-size="10"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, prev, pager, next, sizes, jumper"
        @current-change="currentIndexChange"
        @size-change="pageSizeChange"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    workOrderOverviewTableData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      inputSearchWidth: '400px', // 设置搜索框的宽度
      // 表格数据
      tableData: {
        page: 1,
        limit: 10,
      },
      // 表格数据请求中
      tableLoading: false,
    };
  },
  methods: {
    /**
     * @description: 表格搜索
     * @param {String} inputValue 搜索框的值
     */
    tableSearch(inputValue) {
      this.tableData.search = inputValue || '';
      this.$emit('get-table-list', this.tableData);
    },
    /**
     * @description: 分页器页跳转
     * @param {String} index 当前页
     */
    currentIndexChange(index) {
      this.tableData.page = index;
      this.$emit('get-table-list', this.tableData);
    },
    /**
   * @description: 分页器每页显示数量变更
   * @param {String} size 显示数量
   */
    pageSizeChange(size) {
      this.tableData.limit = size;
      this.$emit('get-table-list', this.tableData);
    },
  },
};
</script>
<style lang="less" scoped>
  .work-order-overview-table {
    width: calc(100% - 375px);
    height: calc(100vh - 385px);
    background-color: #ffffff;
    border-radius: 4px;
    position: relative;
    box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
    overflow-x: hidden;
    &:hover{
      overflow-x: auto;
    }
    .table__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      > div {
        &:nth-child(1) {
          height: 16px;
          font-size: 16px;
          line-height: 16px;
          border-left: 3px solid #15a6fc;
          margin-left: 20px;
          padding-left: 10px;
        }
        &:nth-last-child(1) {
          margin-right: 10px;
        }
      }
    }
    // 设置表格样式
    /deep/ .el-table::before {
      display: none;
    }
    /deep/ .el-table {
      min-width: 1000px;
      // 设置鼠标移入时才出现滚动条
      /deep/ .el-table__body-wrapper{
        height: calc(100vh - 550px);
        overflow-y: hidden;
        &:hover{
          overflow-y: auto;
        }
      }
      box-shadow: none !important;
      border: none;
      max-width: none;
      height: calc(100vh - 484px);
      width: 100%;
      position: absolute;
      thead {
        th {
          height: 40px;
          border-bottom: none;
          div {
            font-size: 14px;
            font-weight: bold;
            color: #333333;
          }
        }
      }
      tbody {
        div,
        td {
          font-size: 14px;
          font-family: "Microsoft YaHei", PingFangSC-Regular, "PingFang SC",
            Roboto-Regular, SourceHanSansCN-Regular;
          font-weight: normal;
          color: #666666;
        }
        td {
          min-height: 67px;
          height: 67px;
          border-left: none;
          border-right: none;
          .cell {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            /*! autoprefixer: off */
            -webkit-box-orient: vertical;
            /* autoprefixer: on */
            white-space: normal;
          }
        }
        tr {
          background: none;
        }
        tr:hover {
          box-shadow: 0px 0px 11px 3px rgba(67, 85, 114, 0.1);
          & > td:nth-child(1) {
            border-left: 3px solid #0091ff;
          }
        }
      }
      // 暂无数据
      .sv-table__empty {
        width: 123px;
        height: 123px;
        position: relative;
        left: -7px;
        margin-bottom: 4px;
        & + p {
          color: #cad5e8;
          font-size: 14px;
          line-height: 14px;
        }
      }
    }
    .table__pagination {
      height: 50px;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      padding: 0 10px 0 0;
      position: absolute;
      bottom: 0;
      right: 0;
      // .el-pagination {
      //   margin-top: 0;
      // }
    /deep/ .el-pagination {
        margin: 0;
        * {
            font-size: 14px;
            font-weight: normal;
            color: #495060;
        }
        button:disabled i {
            color: #DDDEE1;
        }
        .el-pagination__total {
            font-size: 16px;
        }
        .btn-prev,
        .number,
        .btn-next {
            width: 30px;
            min-width: 0;
            height: 30px;
            line-height: 30px;
            border: 1px solid #DDDEE1;
            border-radius: 2px;
            padding: 0;
        }
        li.active {
            border-color: #0091FF !important;
            color: #ffffff !important;
        }
        .more {
            color: #CCCCCC;
        }
        .el-select {
            .el-input {
                width: 90px;
                .el-input__inner {
                    width: 85px;
                    height: 30px;
                    padding: 0 20px 0 5px;
                    border-radius: 2px;
                }
                .el-select__caret::before {
                    background: no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAOCAYAAAA1+Nx+AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAADgAAAAANlRePAAABeklEQVQ4Eb1SsUrEQBC9TXEBwc5gL/gBFsKh5BIrK1sNglwh9lp4foMnqL9wCBJrsbAQk0tODiysUgn2EvsjFonvHVnY80xcLFwYZjIz772Z3TQa/33CMNxJkqT5V11iwbEt8YYM6AeDwUFRFH6apn14odZ0YmJK7A25iJkSMAzDF0K8IO+h4VyHVO0pMR45yMXazJSj0Wgxy7InTLOE+onruj2VpCoOgqCL2inI30zTXGu1Wu/snRFgEne4DDeELWCSjm3bV8xXnSiK9vI876P+AVt3HOdV9v4owCImWoV7xERN2Fa73b6XINXjWjax7S3sE/kNbPys1isF2PQbWGeIqUdWlRlzalzRPjaYg92VVzdpY8wca+yp2rB2AymITY5xxz2QTR4QhGI8Hg/5IyDugvxM9n73WgIEYeILEB5ChL9xA/EK4ks86BG/q462AAgFRK5B5JVkPsh3IVJUkTNf+wYqkESWZXXgH2hlXEuu4rXjOI7nabqAL81rpopzt9VwAAAAAElFTkSuQmCC) center/100% 40%;
                    transform: rotate(180deg);
                }
            }
        }
        .el-pagination__jump {
            margin: 0;
            .el-input {
                width: 35px;
                .el-input__inner {
                    width: 30px;
                    height: 30px;
                    border-radius: 2px;
                }
            }
        }
    }
    }
  }
</style>
