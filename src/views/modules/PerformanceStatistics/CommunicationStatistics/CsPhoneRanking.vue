<template>
  <div class="right">
    <div class="phone_ranking">
      <span class="title_span">值班电话接听率排行榜</span>
      <el-table
        ref="table"
        v-loading="staticsLoading"
        element-loading-spinner="sv-loading"
        :data="phoneData.phoneInfo"
        class="table_ranking"
        :default-sort="{ prop: 'countPercent', order: 'descending' }"
      >
        <el-table-column
          label="序号"
          type="index"
          header-align="center"
          align="center"
          width="50px"
        >
          <template slot-scope="scoped">
            <span :class="`ranking_item_${scoped.$index + 1}`">
              {{ scoped.$index + 1 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="orderCount"
          label="接听数"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="countPercent"
          label="接听率"
          align="center"
          sortable
          header-align="center"
        >
          <template slot-scope="scoped">
            <span v-if="scoped.row.countPercent === 0">0%</span>
            <span v-else>{{ parseFloat(scoped.row.countPercent * 100).toFixed(2) }}%
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="sms_ranking">
      <span class="title_span">值班电话平均响应时间排行榜</span>
      <el-table
        ref="table"
        v-loading="staticsLoading"
        element-loading-spinner="sv-loading"
        :data="phoneData.phoneResponseTimeEntities"
        class="table_ranking"
        :default-sort="{ prop: 'oneResponsePercent', order: 'descending' }"
      >
        <el-table-column
          label="序号"
          type="index"
          header-align="center"
          align="center"
          width="50px"
        >
          <template slot-scope="scoped">
            <span :class="`ranking_item_${scoped.$index + 1}`">
              {{ scoped.$index + 1 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="orderCount"
          label="接听数"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="oneResponsePercent"
          label="平均响应时间"
          align="center"
          width="150px"
          sortable
          header-align="center"
        >
          <template slot-scope="scoped">
            <span v-if="scoped.row.oneResponsePercent === 0">0 s</span>
            <span v-else>{{ parseFloat(scoped.row.oneResponsePercent).toFixed(1) }} s
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    phoneData: {
      type: Object,
      required: true,
    },
    staticsLoading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
.right {
  width: 25%;
  .phone_ranking {
    border-radius: 4px;
    margin-left: 10px;
    background-color: #fff;
    width: 100%;
    height: 430px;
    box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
     /deep/.el-table {
        box-shadow: none !important;
        border: none;
        max-width: none;
        width: calc(100% + 1px);
        height: calc(100% - 48px);
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
                font-family: "Microsoft YaHei",
                  PingFangSC-Regular, "PingFang SC", Roboto-Regular, SourceHanSansCN-Regular;
                font-weight: normal;
                color: #666666;
            }
            td {
                min-height: 40px;
                height: 40px;
                border-left: none;
                border-right: none;
                .cell {
                    overflow : hidden;
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
                color: #CAD5E8;
                font-size: 14px;
                line-height: 14px;
            }
        }
    }
    // 设置鼠标移入时才出现滚动条
      /deep/ .el-table--scrollable-x .el-table__body-wrapper{
          height: calc(100% - 50px);
          // height: 167px;
          overflow-y: hidden;
          overflow-x: hidden;
          &:hover{
          overflow-y: auto;
          }
        }
    .table_ranking {
      $colorList: #f56a6a, #ff8e7a, #ffbe72;
      @for $i from 1 through 3 {
        .ranking_item_#{$i} {
          background-color: nth($colorList, $i);
          color: white;
          display: inline-block;
          border-radius: 50%;
          width: 22px;
        }
      }
    }
    .title_span {
      display: inline-block;
      font-size: 16px;
      height: 18px;
      line-height: 18px;
      border-left: 3px solid rgba(0, 145, 255, 1);
      padding-left: 10px;
      font-weight: 500;
      color: #555555;
      margin: 15px 15px;
    }
  }
  .sms_ranking {
    margin-top: 10px;
    border-radius: 4px;
    margin-left: 10px;
    background-color: #fff;
    width: 100%;
    height: calc(100% - 435px);
    min-height: 340px;
    box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
    /deep/.el-table {
        box-shadow: none !important;
        border: none;
        max-width: none;
        width: calc(100% + 1px);
        height: calc(100% - 48px);
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
                font-family: "Microsoft YaHei",
                  PingFangSC-Regular, "PingFang SC", Roboto-Regular, SourceHanSansCN-Regular;
                font-weight: normal;
                color: #666666;
            }
            td {
                min-height: 40px;
                height: 40px;
                border-left: none;
                border-right: none;
                .cell {
                    overflow : hidden;
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
                color: #CAD5E8;
                font-size: 14px;
                line-height: 14px;
            }
        }
    }
     // 设置鼠标移入时才出现滚动条
    /deep/ .el-table--scrollable-x .el-table__body-wrapper {
      height: calc(100% - 50px);
      overflow-y: hidden;
      overflow-x: hidden;
        &:hover {
          overflow: auto;
          }
    }
    .title_span {
      display: inline-block;
      font-size: 16px;
      height: 18px;
      line-height: 18px;
      border-left: 3px solid rgba(0, 145, 255, 1);
      padding-left: 10px;
      font-weight: 500;
      color: #555555;
      margin: 15px 15px;
    }
    .table_ranking {
      width:100%;
       overflow-y: hidden;
      $colorList: #f56a6a, #ff8e7a, #ffbe72;
      @for $i from 1 through 3 {
        .ranking_item_#{$i} {
          background-color: nth($colorList, $i);
          color: white;
          display: inline-block;
          border-radius: 50%;
          width: 22px;
        }
      }
    }
  }
}
</style>
