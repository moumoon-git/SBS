<template>
  <div class="wrap">
    <header class="header">
      <div class="headerContent">
        <select v-model="status">
          <option
            v-for="(item, index) in selectData"
            :key="index"
            :value="item.value"
            size="small"
          >
            {{ item.name }}
          </option>
        </select>

        <div style="display: flex; align-items: center">
          <div style="white-space: nowrap; margin-right: 15px">通话时间</div>
          <el-date-picker
            v-model="value2"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            size="small"
          />
        </div>
        <el-input
          v-model="search"
          class="inpX"
          placeholder="输入联系人/手机号码"
          size="small"
        />
        <el-button style="margin-right: 10px" plain size="small" @click="cx">
          查询
        </el-button>
        <el-button
          style="margin-right: 10px"
          plain
          size="small"
          @click="exportExel"
        >
          导出
        </el-button>
        <el-button
          style="margin-right: 10px;"
          plain
          size="small"
          @click="exportAll"
        >
          导出全部
        </el-button>
        <!--          <button @click="blackList" class="blackLists" >电话黑名单</button>-->
      </div>
    </header>

    <div class="content">
      <phoneFrom ref="phoneFrom" />
    </div>

    <footer class="footer">
      <div class="BtnsWrap">
        <button class="homePage" @click="sikpHomePage">首页</button>
        <el-pagination
          :current-page.sync="page"
          :page-size="limit"
          layout="prev, pager, next, jumper"
          :total="pageListNum"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        <button class="trailerPage" @click="sikpTrailerPage">尾页</button>
        <div class="allPage">
          共{{ pageListNum }}条记录&nbsp;&nbsp;第{{ page }}页/共{{
            Math.ceil(pageListNum / limit)
          }}页
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Bus from '@/views/common/js/eventBus';
import url from '../../../../../mock/modules/url';
import phoneFrom from './phoneFrom';
import { createClient } from '@/assets/js/uds/useUDS.js';
import connectWebsocketMixin from '@/assets/mixin/connectWebsocketMixin.js';

export default {
  name: 'PhoneHistory',
  components: {
    phoneFrom,
  },
  mixins: [connectWebsocketMixin],
  data() {
    return {
      uds: null,
      selectData: [
        { name: '全部', value: 0 },
        { name: '未接', value: 1 },
        { name: '已接', value: 2 },
        { name: '已拨', value: 3 },
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            },
          },
        ],
      },
      value2: '',
      //  分页
      pageListNum: 10,
      allPage: '',
      groupId: [],
      search: '',
      limit: 10,
      page: 1,
      startTime: '',
      endTime: '',
      status: 0,
    };
  },
  watch: {
    value2(newValue, oldValue) {
      if (newValue) {
        this.startTime = `${newValue[0]
          .toLocaleDateString()
          .replace(/\//gi, '-')} 00:00:00`;
        this.endTime = `${newValue[1]
          .toLocaleDateString()
          .replace(/\//gi, '-')} 23:59:59`;
      } else {
        this.startTime = '';
        this.endTime = '';
      }
    },
  },
  created() {
    this.uds = createClient();
  },
  mounted() {
    // WebSocket
    this.initWebSocket([
      {
        topic: '/updatePhoneList',
        callback: (message) => {
          this.http();
        },
      },
    ]);
    // 以下是mq的 改为用websocket通信了，先注释
    // const topic = '/updatePhoneList';
    // this.uds._client.subscribe(topic, (message) => {
    //   console.log('收到。我要更新电话历史', message);
    //   this.http();
    // });
    this.http();
    Bus.$on('refsh', () => {
      this.http();
    });
  },
  beforeDestroy() {
    Bus.$off('refsh');
    this.uds.disconnect();
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.limit = val;
      this.allPage = Math.ceil(this.pageListNum / this.limit);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.page = val;
      this.http();
    },
    sikpTrailerPage() {
      this.page = Math.ceil(this.pageListNum / this.limit);
      this.http();
    },
    sikpHomePage() {
      this.page = 1;
      this.http();
    },
    cx() {
      this.page = 1;
      this.http();
    },
    http() {
      const that = this;
      const directArr = ['', '未接', '已接', '呼出'];
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/event/eos/history/phone/list`,
        method: url.callHisory.method,
        data: this.$http.adornParams({
          page: this.page,
          limit: this.limit,
          searchText: this.search,
          vcDirect: directArr[this.status],
          dtStart: this.startTime,
          dtEnd: this.endTime,
        }),
      }).then((data) => {
        if (data && data.data.errorcode === 0) {
          // console.log(data.data.data.list)
          that.$refs.phoneFrom.init(data.data.data.data);
          that.pageListNum = data.data.data.totalElements;
        } else {
          this.$message.error(data.data.msg);
        }
      });
    },
    blackList() {
      this.$refs.phoneFrom.openblackList();
      // console.log('电话黑名单')
    },
    exportExel() {
      this.$refs.phoneFrom.exsd();
      // console.log('导出')
    },
    exportAll() {
      const directArr = ['', '未接', '已接', '呼出'];
      const request = {
        method: 'get',
        baseURL: window.SITE_CONFIG.cloudUrl,
        url: '/event/eos/history/phone/list/output-excel',
        headers: {
          token: this.$cookie.get('token'),
        },
        params: {
          searchText: this.search,
          vcDirect: directArr[this.status],
          dtStart: this.startTime,
          dtEnd: this.endTime,
        },
        responseType: 'arraybuffer',
      };
      this.$http(request).then((response) => {
        if (response.data) {
          const a = document.createElement('a');
          a.target = '_blank';
          a.download = '导出全部电话记录.xls';
          a.href = window.URL.createObjectURL(new Blob([response.data]));
          a.click();
        }
      });
    },
  },
};
</script>

<style scoped>
.wrap {
  width: 100%;
  min-height: 760px;
  max-height: 760px;
  background: #fff;
  padding: 0px;
}
.header {
  height: 55px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 98%;
  margin: auto;
  padding-left: 360px;
}
.footer {
  display: block;
}
.headerContent {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.headerContent > select {
  outline: none;
  width: 110px;
  height: 30px;
  border: 1px solid #ccc;
  background-color: #ffffff;
  border-radius: 5px;
  box-sizing: border-box;
  text-align: center;
  margin-right: 20px;
  display: block;
}
.headerContent /deep/ .inpX {
  width: 220px;
  margin-left: 33px;
  margin-right: 10px;
}
/* .headerContent>button{
  outline: none;
  border: 0;
  background: #fff;
  color: #00a9f2;
  border-radius: 5px;
  border: 1px solid #00a9f2;
  font-size: 14px;
  cursor: pointer;
} */
/* .headerContent>button:hover{
  background: #00a9f2;
  color: #fff;
}
.headerContent>button:active{
  background: #00a9f2;
  color: #fff;
} */
.content {
  width: 100%;
  height: 629px;
  padding: 0 15px;
}
.footer {
  width: 100%;
}
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px 0 25px;
  margin-top: 5px;
  position: relative;
}
.footer > div {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
}
.allPage {
  /* color: #999999; */
  font-size: 14px;
  margin-bottom: 5px;
  margin-left: 10px;
}
.footer /deep/ .el-pagination__jump {
  margin-left: 70px;
}
.footer /deep/ .el-pagination {
  padding-right: 20px;
  position: relative;
}
.footer /deep/ .el-pagination__sizes {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
.footer /deep/ .el-pager li.active {
  background: #23b5f4;
  color: #fff !important;
}
.footer /deep/ .el-pager li:hover {
  color: #0079fe;
}
.footer /deep/ .el-pager li {
  border: 1px solid #e4e4e4;
  margin-right: 5px;
}
.footer /deep/ .el-pager li:last-child {
  margin: 0;
}
.footer /deep/ .btn-prev,
.footer /deep/ .btn-next {
  border: 1px solid #e4e4e4;
  padding: 0;
}
.footer /deep/ .btn-prev {
  margin-right: 5px;
}
.footer /deep/ .btn-next {
  margin-left: 5px;
}
.footer /deep/ .el-pagination button:hover {
  color: #0079fe;
}
.header_left {
  width: 90%;
  position: relative;
}
.header_left:after {
  content: '';
  height: 2px;
  width: 100%;
  background: #f1f1f1;
  position: absolute;
  bottom: -5px;
  left: 0;
}
.BtnsWrap {
  position: relative;
}
/*  */
.BtnsWrap > .homePage {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 3px;
  height: 28px;
  outline: none;
  position: relative;
  top: -2px;
  left: -7px;
}
.BtnsWrap > .trailerPage {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 3px;
  height: 28px;
  outline: none;
  /* z-index: 99999; */
  position: relative;
  top: -2px;
  left: -170px;
}
.footer /deep/ .el-pagination button {
  min-width: 32.5px;
}
.blackLists {
  margin-left: 10px;
}
</style>
