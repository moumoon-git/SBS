<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="sendRecordData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <p>发送内容：{{ scope.row.content }}</p>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        prop="content"
        label="发送内容"
        align="center"
      />
      <el-table-column
        label="收信人数量"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <span>
            {{ scope.row.countSuccess + '/' + scope.row.countAll }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="关联事件"
        align="center"
      >
        <template slot-scope="scope">
          <span>
            {{
              scope.row.eventName
                ? scope.row.eventName
                : "无"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sendType"
        label="发送方式"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.sendType === 1">
            即时发送
          </span>
          <span v-else-if="scope.row.sendType === 2">
            定时发送
          </span>
          <span v-else>
            催报发送
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sendTime"
        label="发送时间"
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
              content="关联事件"
              placement="top"
            >
              <img
                src="../../../../../../assets/img/relateEvent.svg"
                style="width: 20px"
                alt
                @click="related(scope.row.groupNum, scope.row.eventName)"
              >
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="转发"
              placement="top"
            >
              <img
                src="../../../../../../assets/img/forward.svg"
                style="width: 20px"
                alt
                @click="forward(scope.row.content)"
              >
            </el-tooltip>
            <!-- <el-tooltip
              class="item"
              effect="dark"
              content="撤销"
              placement="top"
            >
              <img
                v-if="scope.row.status === '等待发送'"
                src="../../../../../../assets/img/revoke.png"
                style="width: 20px"
                alt
                @click="retransmission(scope.row.id, 3)"
              >
            </el-tooltip> -->
            <el-tooltip
              class="item"
              effect="dark"
              content="发送"
              placement="top"
            >
              <img
                v-if="scope.row.status === '等待发送'"
                src="../../../../../../assets/img/sendOut.png"
                style="width: 20px"
                alt
                @click="sendOut(scope.row.id)"
              >
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <img
                v-if="scope.row.status === '已撤销'"
                src="../../../../../../assets/img/del.png"
                style="width: 20px"
                alt
              >
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="重发"
              placement="top"
            >
              <img
                v-if="scope.row.status === '已撤销'"
                src="../../../../../../assets/img/retransmission.png"
                style="width: 20px"
                alt
                @click="retransmission(scope.row.id, 1)"
              >
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="详情"
              placement="top"
            >
              <img
                src="../../../../../../assets/img/details.svg"
                style="width: 20px"
                alt
                @click="detail(scope.row.groupNum)"
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
        共{{ total }}条记录&nbsp;&nbsp;第{{ currentPage }}页/共{{ allPage }}页
      </p>
    </div>

    <!-- 短信详情 -->
    <sms-history-detail ref="SMSDetailView" />

    <!-- 关联事件 -->
    <el-dialog
      title="关联事件"
      :visible.sync="centerDialogVisible"
      width="400px"
      center
    >
      <el-form
        ref="form"
        class="op_button"
        :model="form"
      >
        <el-input
          v-model="form.searchKey"
          placeholder="请输入标题"
          clearable
          class="search_btn"
          @clear="getClearList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getEventList"
          />
        </el-input>
        <el-form-item label="关联事件:">
          <span>{{ eventName?eventName:'暂无关联事件' }}</span>
          <div>
            <span>总数：{{ totalCount }}</span>
            <el-button
              type="text"
              :disabled="currentPageSelect === 1"
              @click="changeSelectPage(1)"
            >
              <i
                class="iconstyle el-icon-arrow-left"
              />
            </el-button>
            <span>{{ currentPageSelect }}/</span>
            <span>{{ totalPages }}</span>
            <el-button
              type="text"
              :disabled="currentPageSelect === totalPages"
              @click="changeSelectPage(2)"
            >
              <i
                class="iconstyle el-icon-arrow-right"
              />
            </el-button>
          </div>
        </el-form-item>
        <div class="radio_div">
          <el-radio-group v-model="form.event">
            <el-radio
              v-for="item in eventData"
              :key="item.id"
              class="radio_style"
              :label="item.id"
            >
              <div
                :title="item.title"
                class="title_div"
              >
                {{ item.title }}
              </div>
            </el-radio>
          </el-radio-group>
        </div>
      </el-form>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          plain
          size="small"
          @click="centerDialogVisible = false"
        >取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="submit"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import bus from '@/views/common/js/eventBus';
import SMSHistoryDetail from './SMSHistoryDetail';
import { isAuth } from '@/utils';

export default {
  name: 'SendRecord',
  components: {
    'sms-history-detail': SMSHistoryDetail,
  },
  data() {
    return {
      sendRecordData: [],
      pageSize: 14, // 每页条数
      currentPage: 1, // 当前页数
      currentPageSelect: 1, // 当前页数
      totalCount: 0, // 总条数
      totalPages: 0, // 总页数
      total: 0,
      allPage: 0,
      centerDialogVisible: false, // 关联事件视图
      groupNum: '', // 要情Id
      form: {
        searchKey: '',
        event: '',
      },
      eventData: [],
      eventName: '', // 关联事件名字
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData(search, startTime, endTime, doWay) {
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/event/eos/communication/sms/smsGroupByEvent`,
        method: 'get',
        params: this.$http.adornParams({
          size: this.pageSize,
          page: this.currentPage,
          key: search,
          startTime,
          endTime,
          sendType: doWay,
          direct: 0,
        }),
      }).then(({ data }) => {
        if (data.errorcode === 0) {
          this.total = data.data.totalElements;
          this.allPage = data.data.totalPages;
          this.sendRecordData = data.data.data;
        } else {
          this.total = 0;
          this.allPage = 0;
          this.sendRecordData = [];
          this.$message.error(data.msg);
        }
      });
    },
    handleSelectionChange(val) {
      this.$emit('getMultipleSelection', val);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
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
    // 查看详情
    detail(id) {
      this.$nextTick(() => {
        this.$refs.SMSDetailView.init(id);
      });
    },
    // 发送
    sendOut(id) {
      this.$http({
        url: this.$http.adornUrl('/message/messageinfor/reSendFailMesaage'),
        method: 'post',
        data: this.$http.adornData({
          id,
        }),
      }).then(({ data }) => {
        if (data.code === 0) {
          this.$message({
            type: 'success',
            message: '发送成功',
            duration: 1000,
          });
          this.initData();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 撤销与重发
    retransmission(id, type) {
      this.$http({
        url: this.$http.adornUrl(
          '/message/messageinfor/cancleAndreSendMesaage',
        ),
        method: 'post',
        data: this.$http.adornData({
          id,
          status: type,
        }),
      }).then(({ data }) => {
        if (data.code === 0) {
          this.$message({
            type: 'success',
            message: type === 3 ? '撤销成功' : '重发成功',
            duration: 1500,
            onClose: () => {
              this.initData();
            },
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 转发
    forward(content) {
      const toTab = isAuth('duanxin:mokuai') && !isAuth('phone:phoneinfo:list')
        ? 'first'
        : 'second';
      bus.$emit('tabChange', toTab);
      bus.$emit('getContent', content);
    },
    // 关联事件视图
    related(id, eventName) {
      this.groupNum = id;
      this.form.event = '';
      this.eventName = eventName || '';
      this.centerDialogVisible = true;
      this.getEventList();
    },
    changeSelectPage(v) {
      this.currentPageSelect = v === 1
        ? this.currentPageSelect -= 1
        : this.currentPageSelect += 1;
      this.currentPageSelect = this.currentPageSelect < 1
        ? 1
        : this.currentPageSelect;
      this.getEventList();
    },
    getClearList() {
      this.currentPageSelect = 1;
      this.getEventList();
    },
    // 获取关联事件
    getEventList() {
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/event/eos/event/listBy`,
        method: 'get',
        params: this.$http.adornParams({
          size: 10,
          page: this.currentPageSelect,
          reportType: 0,
          name: this.form.searchKey,
        }),
      }).then((data) => {
        // console.log(data)
        if (data.data.errorcode === 0) {
          this.eventData = data.data.data.data;
          this.totalCount = data.data.data.totalElements;
          this.totalPages = data.data.data.totalPages;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 提交关联
    submit() {
      this.centerDialogVisible = false;
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/event/eos/sms/register/batchRegister`,
        method: 'post',
        data: this.$http.adornData({
          groupNum: this.groupNum,
          eventId: this.form.event ? this.form.event : null,
        }),
      }).then(({ data }) => {
        // console.log(data)
        if (data && data.errorcode === 0) {
          this.$message({
            type: 'success',
            message: '关联事件成功',
            duration: 1500,
            onClose: () => {
              this.initData();
            },
          });
        } else {
          this.$message.error(data.msg);
        }
      });
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

.operation {
  display: flex;
  justify-content: space-around;
}

/deep/ .el-input--medium .el-input__inner {
  height: 33px;
}
/deep/ .el-button--text {
  color: black;
  &:hover {
    color: #0091FF;
  }
}
.iconstyle {
  display: block;
  font-weight: bold;
}
.op_button /deep/ .el-button:disabled {
  color: #c0c4cc!important;
  background-color: #fff;
  cursor: not-allowed;
}
.op_button /deep/ .el-button:hover {
  color: #0091FF!important;
  background: transparent;
}
.search_btn /deep/ .el-button:hover {
  background-color: transparent;
}
.radio_style {
  width: 350px;
  white-space: nowrap;
  margin-bottom: 5px;
}
.radio_div {
  /deep/ .el-radio__input {
    padding-bottom: 4px;
  }
  .title_div {
    display: inline-block;
    width: 340px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
