<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="replyRecordData"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="回复人"
        align="center"
        width="200"
      />
      <el-table-column
        prop="phone"
        label="手机号码"
        align="center"
        width="150"
      />
      <el-table-column
        prop="remark"
        label="回复内容"
        align="center"
      />
      <el-table-column
        prop="time"
        label="回复时间"
        align="center"
        width="200"
      />
      <el-table-column
        label="操作"
        align="center"
        width="140"
      >
        <template slot-scope="scope">
          <div class="operation">
            <el-tooltip
              class="item"
              effect="dark"
              content="回复"
              placement="top"
            >
              <img
                src="../../../../../../assets/img/sms_reply.svg"
                style="width: 20px"
                alt
                @click="replySms(scope.row)"
              >
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="呼叫"
              placement="top"
            >
              <img
                src="../../../../../../assets/img/sms_recall.svg"
                style="width: 20px"
                alt
                @click="replyCall(scope.row)"
              >
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="paging">
      <button
        class="buttonStyle"
        @click="homePage"
      >
        首页
      </button>
      <el-pagination
        :current-page="currentPage"
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
        &nbsp;&nbsp;第{{ currentPage }}页/共{{ allPage }}页
      </p>
    </div>
  </div>
</template>

<script>
import mixin from "@/view/integratedCommunication/icpPhone/icpPhonePage/mixin.js";
import mixin2 from '@/view/yangZhouEventReports/assets/js/mixin/mixin.js'
import bus from '@/views/common/js/eventBus';

export default {
  name: 'ReplyRecord',
  mixins: [mixin, mixin2],
  inject: ['grandfather'],
  data() {
    return {
      replyRecordData: [],
      pageSize: 14, // 每页条数
      currentPage: 1, // 当前页数
      total: 0, // 总条数
      allPage: 0, // 总页数
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData(search) {
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/event/eos/communication/sms/getReceiveSms`,
        method: 'get',
        params: this.$http.adornParams({
          limit: this.pageSize,
          page: this.currentPage,
          key: search,
        }),
      }).then(({ data }) => {
        // console.log(data)
        if (data.errorcode === 0) {
          this.total = data.data.total;
          this.allPage = data.data.page;
          this.replyRecordData = data.data.data;
        } else {
          this.total = 0;
          this.allPage = 0;
          this.replyRecordData = [];
          this.$message.error(data.msg);
        }
      });
    },
    // 首页
    homePage() {
      this.currentPage = 1;
      this.initData();
    },
    // 每页条数
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.initData();
    },
    // 当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initData();
    },
    // 尾页
    tailPage() {
      this.currentPage = this.allPage;
      this.initData();
    },
    // 回复短信
    replySms(item) {
      bus.$emit('tabChange', 'second'); // 跳转页面
      bus.$emit('replyPhoneNumber', item.phone); // 回复人号码
      bus.$emit('replyPhoneItem', [item.id, 'sms']); // 回复id和回复类型
    },
    // 呼叫
    replyCall(item) {
      if (item.phone) {
        this.makePhoneCall(item.phone, item.id, null, null);
      }
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
.operation {
  display: flex;
  justify-content: space-around;
}
/deep/ .el-table{
  height: 629px;
  overflow-y: auto;
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
</style>
