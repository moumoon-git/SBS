<template>
  <div class="contact">
    <el-table
      ref="multipleTable"
      :data="list"
      style="width: 100%;height:657px;overflow-y:auto"
      highlight-current-row
      @current-change="currentChange"
    >
      <el-table-column
        prop="contactorName"
        label="联系人"
        align="center"
      />
      <el-table-column
        prop="contactorWorkUnit"
        label="工作单位"
        align="center"
      />
      <el-table-column
        prop="contactorPosition"
        label="职务"
        align="center"
      />
      <el-table-column
        prop="phone"
        label="联系号码"
        align="center"
      />
      <el-table-column
        prop="sendCount"
        label="已发送数量"
        align="center"
      />
      <el-table-column
        prop="receiveCount"
        label="已回复数量"
        align="center"
      />
    </el-table>
    <div class="paging">
      <button
        class="buttonStyle"
        @click="homePage"
      >
        首页
      </button>
      <el-pagination
        :current-page="page"
        :page-sizes="[14, 30, 50, 100]"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="total"
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <button
        class="buttonStyle tailPage"
        @click="tailPage"
      >
        尾页
      </button>
      <p>
        共&nbsp;&nbsp;
        <span>{{ total }}条记录</span>
        &nbsp;&nbsp;第{{ page }}页/共{{ allPage }}页
      </p>
    </div>
  </div>
</template>

<script>
import Bus from '@/views/common/js/eventBus';

export default {
  name: 'Contact',
  data() {
    return {
      page: 1,
      pageSize: 14,
      list: [],
      total: 0,
      allPage: 0,
      oneMobileData: '',
      currentRow: null,
    };
  },
  created() {
    this.initAll();
  },
  mounted() {
    Bus.$off('contactKey');
    Bus.$on('contactKey', (val) => {
      this.initAll(val);
    });
  },
  methods: {
    // 初始化所有联系人和信息数据

    initAll(search) {
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/event/eos/communication/sms/getEventSmsContactor`,
        method: 'get',
        params: this.$http.adornParams({
          page: this.page,
          size: this.pageSize,
          key: search,
        }),
      }).then(({ data }) => {
        if (data && data.errorcode === 0) {
          this.list = data.data.data;
          this.total = data.data.totalElements;
          this.allPage = data.data.totalPages;
          this.$forceUpdate();
          this.$refs.multipleTable.setCurrentRow(this.list[0]);
          this.currentChange(this.list[0]);
        } else {
          this.list = [];
          this.total = 0;
          this.allPage = 0;
          this.$message.error(data.msg);
        }
      });
    },
    // 首页
    homePage() {
      this.page = 1;
      this.initAll();
    },
    // 每页条数
    handleSizeChange(val) {
      this.page = 1;
      this.pageSize = val;
      this.initAll();
    },
    // 当前页
    handleCurrentChange(val) {
      this.page = val;
      this.initAll();
    },
    // 尾页
    tailPage() {
      this.page = this.allPage;
      this.initAll();
    },
    // 点击联系人获取对应信息
    currentChange(val) {
      this.currentRow = val;
      Bus.$emit('upDateAllList', val);
    },
  },
};
</script>
<style lang="scss" scoped>

p {
  margin: 0;
}
.paging {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  .buttonStyle {
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 3px;
    height: 28px;
    outline: none;
  }
  .tailPage {
    position: relative;
    right: 157px;
  }
}

/deep/ .el-table__expanded-cell[class*="cell"] {
  background: rgba(246, 246, 246, 1);

  padding: 8px 0 8px 5px;
  p {
    font-size: 11px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 10px;
    color: rgba(106, 106, 106, 1);
  }
}
/deep/ .wrap .viewWrap .BtnHistory .is-active {
  background-color: none !important;
}

/deep/ .el-table .cell {
  font-weight: bold;
  font-size: 15px;
  color: #6a6a6a;
}
/deep/ .el-pagination {
  margin: 0;
}
/deep/ .el-pagination .el-pagination__jump {
  margin-left: 69px;
}
/deep/ .el-pagination button:disabled {
  border: 1px solid #ccc;
  border-radius: 3px;
}
/deep/ .el-pagination .btn-next {
  border: 1px solid #ccc;
  border-radius: 3px;
}
/deep/ .el-pagination .btn-prev {
  padding: 0;
}
/deep/ .el-pagination .btn-next {
  padding: 0;
}
/deep/ .el-pager li {
  color: black;
  border: 1px solid #ccc;
  margin: 0 3px;
  border-radius: 3px;
  &:hover {
    color: royalblue;
  }
}
/deep/ .el-pager li.active {
  background-color: #00a9f2;
}
  /deep/  .el-table::before {
    z-index: inherit;
}
</style>
