<template lang="">
  <el-dialog
    :class="$style.CommonDialog"
    :title="tableConfig[activeComponent].title"
    :visible.sync="dialogVisible"
    width="70%"
  >
    <div :class="$style.headerBar">
      <span>查询时间：</span>
      <el-date-picker
        v-model="datePick"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
      />
      <el-input
        v-model="keyword"
        :class="$style['search-input']"
        :placeholder="tableConfig[activeComponent].placeholder"
      />
      <el-button
        type="primary"
        @click="search"
      >
        查询
      </el-button>
    </div>
    <component
      :is="activeComponent"
      :table-data="tableData"
      :handle-click="tableClick"
    />
    <div>
      <el-pagination
        :total="totalCount"
        :current-page="currentIndex"
        layout="total, prev, pager, next, jumper"
        @current-change="currentIndexChange"
      />
    </div>

    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button
        type="primary"
        @click="$emit('sendContent', content);dialogVisible = false"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import EventTable from './EventTable.vue';
import PhoneTable from './PhoneTable.vue';
import MsgTable from './MsgTable.vue';

export default {
  name: 'CommonDialog',
  components: {
    EventTable,
    PhoneTable,
    MsgTable,
  },
  data() {
    return {
      dialogVisible: false,
      datePick: '',
      keyword: '',
      activeComponent: 'EventTable',
      totalCount: 100,
      currentIndex: 1,
      tableConfig: {
        EventTable: {
          title: '选择事件',
          apiMethod: 'getEventTableData',
          placeholder: '请输入事件标题',
          searchParams: ['beginTime', 'endTime', 'name'],
          filterContent(row) {
            return row.reportDescription;
          },
        },
        PhoneTable: {
          title: '选择电话',
          apiMethod: 'getPhoneTableData',
          placeholder: '请输入联系人/联系电话',
          searchParams: ['dtStart', 'dtEnd', 'searchText'],
          filterContent(row) {
            let phone = '';
            if (row.callType === 0) {
              phone = row.calling;
            } else {
              phone = row.callType === 1 ? row.called : '无';
            }
            return `【${row.direct}来电】 ${row.contactor ? row.contactor : '未知'}（${row.workUnit ? row.workUnit : '未知'}）${phone}`;
          },
        },
        MsgTable: {
          title: '选择短信',
          apiMethod: 'getMsgTableData',
          placeholder: '请输入联系人/联系电话',
          searchParams: ['startTime', 'endTime', 'key'],
          filterContent(row) {
            let content = '';
            if (row.direct === 0) {
              content = `【发送短信】${row.content}`;
            } else {
              content = `【接收短信】${row.content}`;
            }
            return content;
          },
        },
      },
      tableData: [],
      content: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
    };
  },
  watch: {
    dialogVisible(newVal) {
      if (!newVal) {
        Object.assign(this.$data, this.$options.data());
      }
    },
  },
  methods: {
    search() {
      const search_obj = {};
      const { searchParams } = this.tableConfig[this.activeComponent];
      const arr = this.datePick ? [...this.datePick, this.keyword] : ['', '', this.keyword];
      searchParams.forEach((key, index) => {
        if (arr[index]) {
          search_obj[key] = arr[index];
        }
      });
      this.currentIndex = 1;
      this.getTableList(search_obj);
    },

    tableClick(row) {
      const { filterContent } = this.tableConfig[this.activeComponent];
      console.log(row);
      this.content = filterContent(row);
    },
    /**
     * @method
     * @desc 分页器页跳转
     */
    currentIndexChange(val) {
      this.content = '';
      this.currentIndex = val;
      this.getTableList();
    },
    getTableData(activeTable) {
      this.dialogVisible = true;
      this.activeComponent = activeTable;
      this.getTableList();
    },
    getTableList(searchObj) {
      const emitHttp = this.tableConfig[this.activeComponent].apiMethod;
      this[emitHttp](searchObj);
    },

    // 选择事件接口
    getEventTableData(searchObj) {
      const requestData = {
        page: this.currentIndex,
        size: 8,
      };
      if (searchObj) {
        Object.assign(requestData, searchObj);
      }
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/event/eos/event/bullitin/list`,
        method: 'post',
        data: requestData,
      }).then((res) => {
        console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', res);
        if (res.data.code === 0) {
          this.totalCount = res.data.data.totalElements;
          this.tableData = res.data.data.data;
        }
      });
    },

    // 选择电话接口
    getPhoneTableData(searchObj) {
      const requestData = {
        limit: 10,
        page: this.currentIndex,
      };
      if (searchObj) {
        Object.assign(requestData, searchObj);
      }
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/event/eos/history/phone/list`,
        method: 'post',
        data: requestData,
      }).then((res) => {
        console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', res);
        if (res.data.code === 0) {
          this.totalCount = res.data.data.totalElements;
          this.tableData = res.data.data.data;
        }
      });
    },

    // 选择短信接口
    getMsgTableData(searchObj) {
      const requestData = {
        size: 10,
        page: this.currentIndex,
      };
      if (searchObj) {
        Object.assign(requestData, searchObj);
      }
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/event/eos/communication/sms/smsGroupByEvent`,
        method: 'get',
        params: requestData,
      }).then((res) => {
        console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', res);
        if (res.data.code === 0) {
          this.totalCount = res.data.data.totalElements;
          this.tableData = res.data.data.data;
        }
      });
    },
  },
};
</script>
<style lang="scss" module>
.CommonDialog {
  .headerBar {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .search-input {
      width: 30%;
      margin: 0 2% 0 13%;
    }
  }
}
</style>
