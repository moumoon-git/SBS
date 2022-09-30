<template>
  <div :class="$style.container">
    <!-- 1. 表格 -->
    <div :class="['sv-table', $style.table]">
      <el-table
        :data="faxRecordList"
        height="100%"
        @row-click="handleRowClick"
      >
        <!-- 1-1. 单位 -->
        <el-table-column
          prop="unit"
          label="单位"
          header-align="left"
          align="left"
        />
        <!-- 1-2. 号码 -->
        <el-table-column
          prop="calling"
          label="号码"
          header-align="left"
          align="left"
        />
        <!-- 1-3. 时间 -->
        <el-table-column
          prop="sendtime"
          label="时间"
          header-align="left"
          align="left"
        />
        <!-- 1-4. 状态 -->
        <!-- <el-table-column
          label="状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.send_status?send_status[scope.row.send_status].label:'' }}</span>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <!-- 2. 分页器 -->
    <div :class="['sv-pagination']">
      <Pagination
        v-model="pageIndex"
        :total="pageTotal"
        @change="getFaxRecordList"
      />
    </div>
  </div>
</template>

<script>
import Pagination from '../FaxHistorySend/components/Pagination.vue';

export default {
  name: 'FaxHistoryRecieve',
  components: {
    Pagination,
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
      // 分页
      pageIndex: 1,
      pageTotal: 0,
      // 传真记录接收类型的列表
      faxRecordList: [],
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
          direct: 0,
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
        console.log('/event/fax/getFaxRecord', data);
        if (data.errorcode === 0) {
          this.pageTotal = data.data.totalElements || 0;
          if (data.data.data.length > 0) {
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
            this.faxRecordList = [];
          }
        }
      });
    },
    handleRowClick(row, column, event) {
      // console.log('row, column, event', row, column, event);
      const index = this.faxRecordList.findIndex((el) => el.id === row.id);
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
  display: flex;
  flex-direction: column;
  height: 100%;
  .table {
    position: relative;
    width: 100%;
    overflow: hidden;
    flex-grow: 1;
  }
}
</style>
