<template>
  <div
    v-loading="isLoading"
    element-loading-spinner="sv-loading"
    :class="$style.container"
  >
    <!-- 1. 头部搜索框 -->
    <header :class="$style.header">
      <sv-input-search
        v-model="searchKeyword"
        placeholder="请输入会议名称"
        width="250px"
      />
      <sv-button
        type="primary"
        @click="handleSearch"
      >
        搜索
      </sv-button>
    </header>
    <!-- 2. 表格 -->
    <main
      :class="[
        'sv-table',
        $style.main,
      ]"
    >
      <el-table
        ref="table"
        :data="historyList"
        height="100%"
        border
        @header-dragend="$refs.table.doLayout()"
        @expand-change="getMeetingDetail"
      >
        <!-- 2-1. 序号 -->
        <el-table-column
          label="序号"
          type="index"
          header-align="center"
          align="center"
          width="60px"
        />
        <!-- 2-2. 展开 -->
        <el-table-column
          type="expand"
        >
          <template slot-scope="{ row }">
            <!-- 2-2-1. 会议成员 -->
            <div
              style="margin-bottom: 10px;"
            >
              会议成员：
              <span
                v-for="member in (row._detail.members || [])"
                :key="member.id"
                :class="$style.member"
              >
                {{ member.memberName || '未知' }}
              </span>
            </div>
            <!-- 2-2-2. 会议备注 -->
            <div>会议备注：{{ row.remark }}</div>
          </template>
        </el-table-column>
        <!-- 2-3. 会议名称 -->
        <el-table-column
          label="会议名称"
          header-align="center"
          align="center"
          prop="title"
        />
        <!-- 2-4. 会议人数 -->
        <el-table-column
          label="会议人数"
          header-align="center"
          align="center"
          prop="memberNum"
        />
        <!-- 2-5. 发起时间 -->
        <el-table-column
          label="发起时间"
          header-align="center"
          align="center"
          prop="startTime"
        />
        <!-- 2-6. 会议时长 -->
        <el-table-column
          label="会议时长"
          header-align="center"
          align="center"
          prop="duration"
        >
          <template slot-scope="{ row }">
            {{ transformDuration(row.duration) }}
          </template>
        </el-table-column>
        <!-- 2-7. 发起人 -->
        <el-table-column
          label="发起人"
          header-align="center"
          align="center"
          prop="createUserName"
        />
        <!-- 2-8. 关联事件 -->
        <el-table-column
          label="关联事件"
          header-align="center"
          align="center"
          prop="eventId"
        >
          <template slot-scope="{ row }">
            {{ (eventList.find((val) => val.id === row.eventId) || {}).title }}
          </template>
        </el-table-column>
        <!-- 2-9. 操作 -->
        <el-table-column
          label="操作"
          header-align="center"
          align="center"
          width="250px"
        >
          <template slot-scope="{ row }">
            <el-button
              type="text"
              @click="handleRemark(row)"
            >
              备注
            </el-button>
            <el-button
              type="text"
              @click="handleRename(row)"
            >
              修改
            </el-button>
            <el-button
              type="text"
              @click="handleSelectEvent(row)"
            >
              关联事件
            </el-button>
            <el-button
              type="text"
              @click="handleRetartMeeting(row)"
            >
              重启会议
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <!-- 3. 分页器 -->
    <footer
      :class="[
        'sv-pagination',
        $style.footer,
      ]"
    >
      <el-pagination
        :total="pageConfig.total"
        :current-page="pageConfig.pageIndex"
        :page-size="pageConfig.pageSize"
        :page-sizes="[10, 20, 50]"
        layout="total, prev, pager, next, sizes, jumper"
        @size-change="handlePageSizeChange"
        @current-change="handlePageIndexChange"
      />
    </footer>
    <!-- 修改备注弹窗 -->
    <MeetingHistoryRemarkDialog ref="MeetingHistoryRemarkDialogRef" />
    <!-- 修改会议名称弹窗 -->
    <MeetingHistoryRenameDialog ref="MeetingHistoryRenameDialogRef" />
    <!-- 修改关联事件弹窗 -->
    <MeetingHistoryEventDialog
      ref="MeetingHistoryEventDialogRef"
      :event-list="eventList"
    />
    <!-- 重启会议弹窗 -->
    <MeetingHistoryRestartDialog ref="MeetingHistoryRestartDialogRef" />
  </div>
</template>

<script>
import MeetingHistoryRemarkDialog from './modules/MeetingHistoryRemarkDialog.vue';
import MeetingHistoryRenameDialog from './modules/MeetingHistoryRenameDialog.vue';
import MeetingHistoryEventDialog from './modules/MeetingHistoryEventDialog.vue';
import MeetingHistoryRestartDialog from './modules/MeetingHistoryRestartDialog.vue';

export default {
  name: 'MeetingHistory',
  components: {
    MeetingHistoryRemarkDialog,
    MeetingHistoryRenameDialog,
    MeetingHistoryEventDialog,
    MeetingHistoryRestartDialog,
  },
  data() {
    return {
      // 载入中
      isLoading: false,
      // 事件列表
      eventList: [],
      // 搜索关键词
      searchKeyword: '',
      // 历史记录
      historyList: [],
      // 分页参数
      pageConfig: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 1,
        total: 0,
      },
    };
  },
  mounted() {
    this.getHistoryList();
    this.getEventList();
  },
  methods: {
    /**
     * 获取事件/要情列表
     */
    getEventList() {
      const request = {
        method: 'post',
        baseURL: `${window.SITE_CONFIG.cloudUrl}/event`,
        url: '/eos/event/listBy',
        data: {
          size: 999,
          page: 1,
          name: '',
          reportType: 0,
        },
      };
      this.$http(request).then((response) => {
        if (response.data.errorcode === 0) {
          this.eventList = response.data.data.data || [];
        } else {
          this.$message.error(`获取事件列表失败，错误代码${response.data.errorcode}，错误信息：${response.data.msg}`);
        }
      }).catch((error) => {
        this.$message.error(`获取事件列表失败，错误信息：${error}`);
      });
    },
    /**
     * 获取历史记录
     */
    getHistoryList() {
      const request = {
        method: 'post',
        baseURL: `${window.SITE_CONFIG.cloudUrl}/device`,
        url: '/meeting/csMeetingRecord/list',
        data: {
          title: this.searchKeyword,
          currPage: this.pageConfig.pageIndex,
          pageSize: this.pageConfig.pageSize,
        },
      };
      this.isLoading = true;
      this.$http(request).then((response) => {
        if (response.data.code === 0) {
          this.historyList = response.data.data.page.list || [];
          this.pageConfig.pageTotal = response.data.data.page.totalPage;
          this.pageConfig.total = response.data.data.page.totalCount;
        } else {
          this.$message.error(`获取会议记录失败，错误代码${response.data.code}，错误信息：${response.data.msg}`);
        }
      }).catch((error) => {
        this.$message.error(`获取会议记录失败，错误信息：${error}`);
      }).finally(() => {
        this.isLoading = false;
      });
    },
    /**
     * 执行搜索
     */
    handleSearch() {
      this.pageConfig.pageIndex = 1;
      this.pageConfig.pageTotal = 1;
      this.pageConfig.total = 0;
      this.getHistoryList();
    },
    /**
     * 换页
     */
    handlePageIndexChange(newVal) {
      this.pageConfig.pageIndex = newVal;
      this.getHistoryList();
    },
    /**
     * 分页大小改变
     */
    handlePageSizeChange(newVal) {
      this.pageConfig.pageSize = newVal;
      this.pageConfig.pageIndex = 1;
      this.pageConfig.pageTotal = 1;
      this.getHistoryList();
    },
    /**
     * 获取会议详情
     */
    getMeetingDetail(row) {
      return new Promise((resolve) => {
        if (!row._detail) {
          const request = {
            method: 'get',
            baseURL: `${window.SITE_CONFIG.cloudUrl}/device`,
            url: '/meeting/csMeetingRecord/info/',
            params: {
              id: row.id,
            },
          };
          this.isLoading = true;
          this.$http(request).then((response) => {
            if (response.data.code === 0) {
              this.$set(row, '_detail', response.data.data.detail);
              resolve();
            } else {
              this.$message.error(`获取会议记录详情失败，错误代码${response.data.code}，错误信息：${response.data.msg}`);
            }
          }).catch((error) => {
            this.$message.error(`获取会议记录详情失败，错误信息：${error}`);
          }).finally(() => {
            this.isLoading = false;
          });
        } else {
          resolve();
        }
      });
    },
    /**
     * 格式化会议时间（秒）
     * @return 小时分秒
     */
    transformDuration(duration) {
      const seconds = duration % 60;
      const minutes = Math.round(duration / 60) % 60;
      const hours = Math.round(duration / 60 / 60);
      return `${hours}小时${minutes}分${seconds}秒`;
    },
    /**
     * 执行更新
     * @param {Object} row 会议记录
     * @param {Object} options 修改的选项
     */
    handleUpdate(row, options) {
      return new Promise((resolve) => {
        const request = {
          method: 'post',
          baseURL: `${window.SITE_CONFIG.cloudUrl}/device`,
          url: '/meeting/csMeetingRecord/update',
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            ...row._detail.meetingInfo,
            ...options,
          },
        };
        this.isLoading = true;
        this.$http(request).then((response) => {
          if (response.data.code === 0) {
            this.$message.success('更新成功');
            resolve();
          } else {
            this.$message.error(`更新失败，错误代码${response.data.code}，错误信息：${response.data.msg}`);
          }
        }).catch((error) => {
          this.$message.error(`更新失败，错误信息：${error}`);
        }).finally(() => {
          this.isLoading = false;
        });
      });
    },
    /**
     * 修改备注
     * @param {Object} row 会议记录
     */
    handleRemark(row) {
      this.getMeetingDetail(row)
        .then(() => {
          this.$refs.MeetingHistoryRemarkDialogRef
            // 打开弹窗
            .open(row._detail.meetingInfo.remark)
            // 从弹窗中获取新的数据执行更新
            .then(
              (newVal) => {
                this.handleUpdate(row, { remark: newVal }).then(() => {
                  row._detail.meetingInfo.remark = newVal;
                  row.remark = newVal;
                });
              },
              () => {},
            );
        });
    },
    /**
     * 修改会议名称
     * @param {Object} row 会议记录
     */
    handleRename(row) {
      this.getMeetingDetail(row)
        .then(() => {
          this.$refs.MeetingHistoryRenameDialogRef
            // 打开弹窗
            .open(row._detail.meetingInfo.title)
            // 从弹窗中获取新的数据执行更新
            .then(
              (newVal) => {
                this.handleUpdate(row, { title: newVal }).then(() => {
                  row._detail.meetingInfo.title = newVal;
                  row.title = newVal;
                });
              },
              () => {},
            );
        });
    },
    /**
     * 修改关联事件
     * @param {Object} row 会议记录
     */
    handleSelectEvent(row) {
      this.getMeetingDetail(row)
        .then(() => {
          this.$refs.MeetingHistoryEventDialogRef
            // 打开弹窗
            .open(row._detail.meetingInfo.eventId)
            // 从弹窗中获取新的数据执行更新
            .then(
              (newVal) => {
                this.handleUpdate(row, { eventId: newVal || null }).then(() => {
                  console.log(newVal);
                  row._detail.meetingInfo.eventId = newVal || null;
                  row.eventId = newVal || null;
                });
              },
              () => {},
            );
        });
    },
    /**
     * 重启会议
     */
    handleRetartMeeting(row) {
      this.getMeetingDetail(row)
        .then(() => {
          this.$refs.MeetingHistoryRestartDialogRef.open(row._detail);
        });
    },
  },
};
</script>

<style lang="scss" module>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  .header {
    height: 56px;
    line-height: 56px;
    text-align: right;
    padding-right: 15px;
    border-bottom: 1px solid #F2F2F2;
  }
  .main {
    flex-grow: 1;
    position: relative;
    overflow: hidden;
    .member {
      background: #CCC;
      padding: 3px 5px;
      margin-right: 10px;
    }
  }
  .footer {
    text-align: right;
    padding: 10px 15px;
  }
}
</style>
