<template>
  <div :class="$style.container">
    <!-- 1. 记录 -->
    <section :class="$style.left">
      <!-- 1-1. 表格 -->
      <div :class="['sv-table', $style.table]">
        <el-table
          :data="faxRecordList"
          height="100%"
          @row-click="handleRowClick"
        >
          <!-- 1-1-1. 发送时间 -->
          <el-table-column
            prop="sendtime"
            label="发送时间"
            header-align="left"
            align="left"
          />
          <!-- 1-1-2. 发送状态 -->
          <!-- <el-table-column
            label="发送状态"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.send_status?send_status[scope.row.send_status].label:'' }}</span>
            </template>
          </el-table-column> -->
          <!-- 1-1-3. 收信人数 -->
          <el-table-column
            prop="total"
            label="收信人数"
            header-align="center"
            align="center"
          />
          <!-- 1-1-4. 成功 -->
          <el-table-column
            prop="totalSuccess"
            label="成功"
            header-align="center"
            align="center"
          />
          <!-- 1-1-5. 失败 -->
          <el-table-column
            prop="totalFailed"
            label="失败"
            header-align="center"
            align="center"
          />
        </el-table>
      </div>
      <!-- 1-2. 分页器 -->
      <Pagination
        v-model="pageIndex"
        :total="pageTotal"
        @change="getFaxRecordList"
      />
    </section>
    <!-- 2. 队列 -->
    <section :class="$style.right">
      <Tab
        :current-index="queueTypeIndex"
        :data="[
          { name: '传真总队列', value: faxQueueList.total },
          { name: '发送成功', value: faxQueueList.total_success },
          { name: '发送失败', value: faxQueueList.total_failed },
          { name: '待发送', value: faxQueueList.total_wait_to_send },
        ]"
        @click="queueTypeIndex = $event;"
      />
      <div style="padding: 10px;">
        <sv-button
          v-if="queueTypeIndex==0 || queueTypeIndex==2"
          type="primary"
          @click="failedResend"
          :class="{[$style.failedResend]:faxQueueList.list.filter((item)=>{ return item.send_status == 3}).length==0}"
        >
          失败重发
        </sv-button>
        <!-- <sv-button
          type="primary"
        >
          取消发送
        </sv-button> -->
      </div>
      <div :class="['sv-table', $style.table]">
        <el-table
          height="100%"
          :data="queueTypeIndex===0?faxQueueList.list:(queueTypeIndex===1?faxQueueList.successList:(queueTypeIndex===2?faxQueueList.failedList:faxQueueList.waitToSendList))"
        >
          <el-table-column
            prop="platform_name"
            label="单位"
            header-align="left"
            align="center"
          />
          <el-table-column
            label="发送状态"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ send_status[scope.row.send_status].label }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </section>
  </div>
</template>

<script>
import Pagination from './components/Pagination.vue';
import Tab from './components/Tab.vue';

export default {
  name: 'FaxHistorySend',
  components: {
    Pagination,
    Tab,
  },
  props: {
    searchKeyword: {
      type: String,
      default: '',
    },
    dateRange: {
      type: Array,
      default: () => (['', '']),
    },
  },
  data() {
    return {
      // 发送队列-0，发送成功-1，发送失败-2
      queueTypeIndex: 0,
      // 分页
      pageIndex: 1,
      pageTotal: 0,
      templateFaxId: '',
      // 传真记录发送类型的列表
      faxRecordList: [],
      // 传真队列列表
      faxQueueList: {
        successList: [],
        failedList: [],
        waitToSendList: [],
        list: [],
      },
      send_status: [
        {
          id: 0,
          label: '待发送',
        },
        {
          id: 1,
          label: '发送中',
        },
        {
          id: 2,
          label: '发送成功',
        },
        {
          id: 3,
          label: '发送失败',
        },
        {
          id: 4,
          label: '已取消',
        },
        {
          id: 5,
          label: '已暂停',
        },
      ],
    };
  },
  created() {
    this.getFaxRecordList();
  },
  methods: {
    // 获取传真记录
    getFaxRecordList() {
      this.$http({
        baseURL: window.SITE_CONFIG.cloudUrl,
        url: '/event/eos/history/faxListNew',
        method: 'get',
        params: this.$http.adornParams({
          direct: 1,
          faxId: '',
          eventId: '',
          eventDealId: '',
          searchText: this.searchKeyword,
          page: this.pageIndex,
          size: 10,
          dtStart: this.dateRange[0],
          dtEnd: this.dateRange[1],
        }),
      }).then(({ data }) => {
        if (data.errorcode === 0) {
          this.pageTotal = data.data.totalElements || 0;
          if (data.data.data.length > 0) {
            this.templateFaxId = data.data.data[0].id;
            this.getFaxQueueDetail();
            this.faxRecordList = [...data.data.data];
            if (this.faxRecordList[0].faxFile.search('doc') !== -1) {
              this.$http({
                baseURL: window.SITE_CONFIG.cloudUrl,
                url: '/event/fax/previewFax',
                method: 'get',
                params: this.$http.adornParams({
                  attachmentId: this.faxRecordList[0].app_attachment_id,
                }),
              }).then(({ data }) => {
                console.log('/event/fax/previewFax', data);
                if (data.errorcode === 0) {
                  this.$emit('updateFileUrl', this.faxRecordList[0]);
                }
              });
            } else {
              this.$emit('updateFileUrl', this.faxRecordList[0]);
            }
          } else {
            this.templateFaxId = '';
            this.faxRecordList = [];
          }
        }
      });
    },
    // 获取传真队列表格详情数据
    getFaxQueueDetail() {
      this.$http({
        baseURL: window.SITE_CONFIG.cloudUrl,
        url: '/event/fax/getSendFaxQueueDetail',
        method: 'get',
        params: this.$http.adornParams({
          faxId: this.templateFaxId,
          sendStatus: '',
        }),
      }).then(({ data }) => {
        console.log('/event/fax/getSendFaxQueueDetail', data);
        if (data.errorcode === 0) {
          this.faxQueueList = data.data;
          this.faxQueueList.successList = data.data.list.filter((item) =>{ return item.send_status==2 });
          this.faxQueueList.failedList = data.data.list.filter((item) =>{ return item.send_status==3 });
          this.faxQueueList.waitToSendList = data.data.list.filter((item) =>{ return item.send_status==0 });
        }
      });
    },
    failedResend() {
      this.faxQueueList.list.forEach((item) => {
        if (item.send_status == '3') {
          this.$http({
            url: '/event/fax/reSendFax',
            baseURL: window.SITE_CONFIG["cloudUrl"],
            method: 'post',
            data: this.$http.adornData({
              faxId: item.fax_id
            }),
          }).then(({ data }) => {
            console.log('/event/fax/reSendFax', data);
            if (data.errorcode === 0) {
              this.$message.success('重发成功');
            } else {
              this.$message.error('重发失败');
            }
          });
        }
      });
    },
    handleRowClick(row, column, event) {
      const index = this.faxRecordList.findIndex((el) => el.id === row.id);
      console.log('row, column, event', row, column, event);
      this.templateFaxId = row.id;
      this.getFaxQueueDetail();
      if (row.faxFile.search('doc') !== -1) {
        this.$http({
          baseURL: window.SITE_CONFIG.cloudUrl,
          url: '/event/fax/previewFax',
          method: 'get',
          params: this.$http.adornParams({
            attachmentId: row.attachmentId,
          }),
        }).then(({ data }) => {
          console.log('/event/fax/previewFax', data);
          if (data.errorcode === 0) {
            this.faxRecordList[index].faxFile = data.data;
            this.$emit('updateFileUrl', this.faxRecordList[index]);
          }
        });
      } else {
        this.$emit('updateFileUrl', this.faxRecordList[index]);
      }
    },
  },
};
</script>
<style lang="scss" module>
.container {
  display: grid;
  height: 100%;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1px;
  background: #F2F2F2;
  & > section {
    background: #FFF;
  }
}
.left {
  display: flex;
  flex-direction: column;
  .table {
    position: relative;
    width: 100%;
    overflow: hidden;
    flex-grow: 1;
  }
  .pagination {
    flex-shrink: 0;
  }
}
.right {
  display: flex;
  flex-direction: column;
  .failedResend {
    background: #ddd;
    cursor: not-allowed;
  }
  .table {
    position: relative;
    width: 100%;
    overflow: hidden;
    flex-grow: 1;
  }
}
</style>
