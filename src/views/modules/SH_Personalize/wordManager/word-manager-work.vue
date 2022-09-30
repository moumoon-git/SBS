<template>
  <div class="work">
    <div class="work-head">
      <el-select
        v-model="dataForm.emergencyType"
        class="task-content-header-disposer"
        clearable
        placeholder="请选择问题分类"
      >
        <el-option
          v-for="item in questionOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="dataForm.workOrder"
        class="task-content-header-disposer"
        clearable
        placeholder="请选择工单分类"
      >
        <el-option
          v-for="item in workListOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="dataForm.status"
        class="task-content-header-disposer"
        clearable
        placeholder="请选择办理状态"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-model="dataForm.name"
        class="task-content-header-search"
        placeholder="请输入关键字"
        clearable
        suffix-icon="el-icon-search"
        @keyup.enter.native="searchResult()"
      />
      <el-button
        style="margin-left:5px;"
        @click="searchResult()"
      >
        查询
      </el-button>
    </div>

    <div class="work-table">
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        :header-cell-style="getRowClass"
        height="calc(100% - 155px)"
      >
        <el-table-column
          prop="number"
          header-align="center"
          align="center"
          label="事件编号"
        />
        <el-table-column
          prop="title"
          header-align="center"
          align="center"
          label="事件标题"
        />
        <el-table-column
          prop="address"
          header-align="center"
          align="center"
          label="发生地址"
        />
        <el-table-column
          prop="emergencyTypeName"
          header-align="center"
          align="center"
          label="问题分类"
        />
        <el-table-column
          prop="workOrderName"
          header-align="center"
          align="center"
          label="工单分类"
        />
        <el-table-column
          prop="reflectedUnit"
          header-align="center"
          align="center"
          label="被反应单位"
        />
        <el-table-column
          prop="reportTime"
          header-align="center"
          align="center"
          label="接报时间"
        />
        <el-table-column
          prop="disposalPeriod"
          header-align="center"
          align="center"
          label="处理时限（天）"
        />
        <el-table-column
          prop="deadline"
          header-align="center"
          align="center"
          label="截止时间"
        />
        <el-table-column
          prop="statusName"
          header-align="center"
          align="center"
          label="办理状态"
        />
        <el-table-column

          header-align="center"
          align="center"
          width="250"
          label="操作"
        >
          <template slot-scope="scope">
            <span
              type="text"
              size="small"
              style="
                  border: none;
                  background: none;
                  color: #479dff;
                  font-size: 12px;
                  font-family: MicrosoftYaHei;
                  font-weight: bold;
                  cursor: pointer;
                "
              @click="viewContent(scope.row.id)"
            >查看
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
     <div class="task-content-footer">
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
</template>

<script>
export default {
  data() {
    return {
      workListOptions: [],
      questionOptions: [],
      statusOptions: [],
      dataList: [],
      dataForm: {
        status: '',
        emergencyType: '',
        workOrder: '',
        name: '',
      },
      dataListLoading: false,
      totalPage:0,
      pageSize:10,
      pageIndex: 1,

    };
  },
  mounted() {
    this.getSelectType();
    this.getDataList();
  },
  methods: {
    /**
     * @description: 获取搜索条件的下拉框列表数据
     */
    getSelectType() {
      this.$http({
        url: this.$http.adornUrl(
          '/sys/sysdictionary/getSysDictionaryListByCode?code=ottff_work_order',
        ),
        method: 'get',
        params: this.$http.adornParams({
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.data.forEach((item) => {
            this.workListOptions.push({
              value: item.code,
              label: item.name,
            });
          });
        } else {
          this.$message.error(data.msg);
        }
      });
      this.$http({
        url: this.$http.adornUrl(
          '/sys/sysdictionary/getSysDictionaryListByCode?code=ottff_emergency_type',
        ),
        method: 'get',
        params: this.$http.adornParams({
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.data.forEach((item) => {
            this.questionOptions.push({
              value: item.code,
              label: item.name,
            });
          });
        } else {
          this.$message.error(data.msg);
        }
      });
      this.$http({
        url: this.$http.adornUrl(
          '/sys/sysdictionary/getSysDictionaryListByCode?code=ottff_status',
        ),
        method: 'get',
        params: this.$http.adornParams({
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.data.forEach((item) => {
            this.statusOptions.push({
              value: item.code,
              label: item.name,
            });
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    searchResult() {
      this.pageIndex = 1;
      this.getDataList();
    },
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
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl('/ottffemergency/ottffemergencyinfo/list'),
        method: 'post',
        data: this.$http.adornData({
          status: this.dataForm.status,
          emergencyType: this.dataForm.emergencyType,
          workOrder: this.dataForm.workOrder,
          groupIds: [],
          search: this.dataForm.name,
          page: this.pageIndex,
          limit: this.pageSize,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
           this.totalPage = data.page.totalCount;
        } else {
          this.dataList = {};
           this.totalPage = 0;
          this.$message.error(data.msg);
        }
        this.dataListLoading = false;
      });
    },
    viewContent(id) {

    },
     getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#F0F5FF";
        //return 'background: #0091FF'
      } else {
        return "";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
  .work{
    .work-head{
      display: flex;
      flex-wrap: nowrap;
      margin-bottom:20px;
      .task-content-header-disposer{
        margin-left:5px;
      }
      .task-content-header-search{
                 width: 229px;
                 margin-left:5px;
          /deep/.el-input__inner {
            height: 42px;
            width: 229px;
            font-size: 14px;
          }
          /deep/.el-input__clear {
            font-size: 17px;
            padding-top: 2px;
          }
      }
    }
  .work-table{
    height: 650px;
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
          color:rgba(51, 51, 51, 1);
          th {
            height: 56px;
          }
        }
        /deep/tbody {
          div {
            font-size: 14px;
            font-family: PingFangSC-Regular,PingFang SC;
            font-weight: normal;
            color:rgba(102, 102, 102, 1);
          }
          td {
            border-left: none;
            border-right: none;
            .button-view {
              margin: 0 auto;
              width: 27px;
              height: 25px;
              cursor: pointer;
              background: no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAkCAYAAADl9UilAAAEDElEQVRYR+2Wb2hVZRzHv9/nrOlWU5molcSiMoTaIne79zZ7Y0QUQkLLEZTb7k3qTc02rSCDDDKodEvrTWH3bloQswQDKyLyTa57592grUCyohFWOhzO1aZr53zjzhn7c+89z50Vvtjz7pzn+/38vvzO8zznIS7Twcs0F+aC5ftl5jr2v3QsntJKelgLodLzVE5yCYCFE8UHJfUbw14QXTI4FAnw2H8W7JPjmtc/gA2e0ACoPL9C7DXE7sFS7GtYwfM2Xqs1FktoHYlmSDfYQLNqyJ8kNEXDPOjHyRmsvUNFww52S9roB8pnnuSeYhcNNVUcyebLGqwtqcUe8DGkqnyKWmvJDgM8UBfi6UyejMHeTmlh4Ri+BLTKutCshOweLcDdTwQ4ON0+I1i75Awn8ZmgeyxrDQD8CELvuJ4oB1QNoNTGT/CL4hDuqyHdyfoZweJfazuo522goNpGHbPpt0oMXZfCirTnlwCOX9OFkkLX2wWxzoojvhK5k1uzBms7qqDnqgOA4wcUFI+GnWgsoUcJvAro2gse/irguWiY78USboxgxI8FwDUeq+qq2HlR+0/HJLEtiU5BAV+Q0O+5vJEOHiTVmkkvsV4uDhhHP4JIH8A5B8FUXQhBkrqwIiZGW0IPedB+P8C4SXqr7Jxp7CvCCUFLM+8qniobwfK++V6LyCdtuAZcXxfmh1OCxRNeAkDIBkBy45iLbseoO6fe8HYKlZL22HABJCNhE54erAuA1fEgMGqAHkGpXAUJBjygglDMMlh3JGwqpwRrTaha0Hgb/QbBnWcHsLVksX6HsCijnjgzdJpXLyjFdkGb/ZjpecewujbIA1OCpR/iCX0FaLUF5ASW8Sb243F52pVxjRlu0hK8g5P6AcByfyaPRMK866Juyjm296hudV2lP2mhL4hsjoS4OZZUI6WXAJRMeIZEvhgNsSWe1E5ITb4sYNRxWFl7B7/NGCz9MpbQFkKvW8BAaMfZAfPCvKVwCl2Mr41RB13nT8FdUIqXBW2x4Qh8Jhrmjsnamf9Kia2d+EBSjQ0UQh+g941jetJ6z/UqAD4CoszGT7K9PoiHMXF+Ze1YeqK5Q0WLjA4RWGMDn61GwOEzHtc2Zbj+ZL327P1GV3oj2C/o/tkWzuUj+Kkpwvra2/hnxs2Ty7ztsAqun++9JvLpyX+JSwwqSm/8fM48u20Nx7KxrK7WrQndK+hNADdfYqjvCT5VH+bnfhyrYGlI+3cqHB5CvaRGECv9wFPmhWMkW4pL0FpzC0dtvNbBJsP2pbTqrzFvHckghAoAyyZdldIXvpMgeiR1XlFgDm4IMPc/NUPSWQWbwZH47hFclX7/2Gr8MX3r23RouubfCTabyj6euWD5NnWuY/l27G9733k0ycG80wAAAABJRU5ErkJggg==);
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
</style>
