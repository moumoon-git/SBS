<template lang="">
  <div :class="$style.receiveBg">
    <!-- 头部 -->
    <header>
      <div :class="$style.title">
        接收通知公告
      </div>
      <div :class="$style.searchSection">
        <!-- 类型选择 -->
        <el-select
          v-model="searchType"
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- 日期选择 -->
        <el-date-picker
          v-model="time"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd hh:mm:ss"
          @change="changeSearchTime"
        />
        <!-- 关键字选择 -->
        <el-input
          v-model="searchValue"
          placeholder="请输入内容"
          :class="$style.input"
        />
        <div
          :class="$style.search"
          @click="getTableData"
        />
      </div>
    </header>
    <!-- 表格 -->
    <main>
      <Table ref="tableRef" />
    </main>
    <!-- 底部分页 -->
    <footer>
      <div>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="allNum"
          :current-page.sync="thisPage"
          :page-size="pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </footer>
  </div>
</template>
<script>
import Table from './components/ReceiveNotifyTable.vue';
// 表格
export default {
  name: 'ReceiveNotifyTab',
  components: { Table },
  data() {
    return {
      options: [{
        value: 1,
        label: '通知',
      }, {
        value: 2,
        label: '公告',
      }, {
        value: 3,
        label: '预警',
      }],
      time: '',
      thisPage: 1, // 当前页数
      allNum: 0, // 总条数
      pageSize: 10, // 每页的条数
      searchValue: '', // 搜索值
      timeRange: [], // 时间范围
      searchType: '', // 搜索类型，1通知、2公告、3预警
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 获取表格数据
    getTableData() {
      const data = {
        page: this.thisPage,
        limit: this.pageSize,
        title: this.searchValue,
        startTime: this.timeRange === null ? '' : this.timeRange[0],
        endTime: this.timeRange === null ? '' : this.timeRange[1],
        noticeType: this.searchType,
      };
      this.$api.getReceiveNotices(data).then((res) => {
        if (res.errorcode !== 0) {
          this.$message({
            message: res.msg,
            type: 'error',
          });
          return;
        }
        // this.tableData = res.page.list || [];
        this.$refs.tableRef.tableData = res.page.list || []
        this.thisPage = res.page.currPage;
        this.allNum = res.page.totalCount;
      });
    },
    // 修改每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTableData();
    },
    // 修改当前页数
    handleCurrentChange(val) {
      this.thisPage = val;
      this.getTableData();
    },
    // 修改时间范围
    changeSearchTime(val) {
      this.timeRange = val;
    },
  },
};
</script>
<style module lang="scss">
.receiveBg {
  width: 100%;
  height: 800px;
  background: #ffffff;
  box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
  border-radius: 4px;
  & > header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-size: 17px;
      font-weight: bold;
      color: #333333;
      border-left: 3px solid #0091ff;
      height: 18px;
      line-height: 16px;
      padding-left: 8px;
      margin-left: 14px;
    }
    .searchSection {
      display: flex;
      margin-right: 10px;
      & > div {
        margin: 0 7px;
      }
      .input {
        width: 309px;
        margin-right: 0;
        :global(.el-input__inner) {
          border-radius: 0;
          border-right: 0;
        }
      }
      .search {
        width: 42px;
        margin: 0;
        background: #3f92fe;
        cursor: pointer;
        background: url(./components/assets/search.svg) no-repeat #3f92fe;
        background-size: 20px;
        background-position: 50% 50%;
      }
    }
  }
  & > main {
    height: 680px;
    overflow: auto;
    :global(.el-table__row) {
      height: 60px;
    }
  }
  & > footer {
    height: 60px;
  }
}
</style>
