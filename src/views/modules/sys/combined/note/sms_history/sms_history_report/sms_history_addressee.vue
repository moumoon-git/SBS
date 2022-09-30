<template>
  <div class="all">
    <div class="send">
      <div class="title">收信人</div>
      <!-- <button >删除</button> -->
    </div>

    <el-table
      :data="list"
      border
      style="width: 100%;height:657px"
      @cell-mouse-enter="replyHistory"
    >
      <el-table-column prop="name" label="联系人" align="center"></el-table-column>
      <el-table-column prop="workUnit" label="工作单位" align="center"></el-table-column>
      <el-table-column prop="position" label="职位" align="center"></el-table-column>
      <el-table-column prop="phone" label="手机号码" align="center"></el-table-column>
      <el-table-column prop="reply" label="是否回复" align="center"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 30, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
      class="pagination"
      style="background-color: white;"
    ></el-pagination>

    <!-- 回复历史 -->
    <sms-history-reply ref="replyHistoryView"></sms-history-reply>
  </div>
</template>

<script>
import Bus from "@/views/common/js/eventBus";
import smsHistoryReply from '../sms_history_reply'

export default {
  // props: ["list"],
  name: "sms_history_contact",
  components: {
    'sms-history-reply': smsHistoryReply
  },
  data() {
    return {
      page: 1,
      pageSize: 5,
      list: [],
      total: 0,
      oneMobileData: "",

      replyHistoryView: false,//回复历史视图
    };
  },
  mounted() {
    Bus.$on("upDateReportList", (row,key) => {
      if (row) {
        // console.log(key)
        // console.log(row)
          this.$http({
            url: this.$http.adornUrl(
              "/message/messageinfor/getMessageInforByMsgId"
            ),
            method: "get",
            params: this.$http.adornParams({
              page: this.page,
              limit: this.pageSize,
              search: key?key:"",
              msgId: row.id,
            })
          }).then(({ data }) => {
            // console.log(
            //   "getDataListaaaaa+++++++++++++++++++++++++++++++++++++++++++++++",
            //   data
            // );
            if (data.page.list.length != 0 && data.code === 0) {
              this.list = data.page.list;
              this.total = data.page.totalCount;
            } else {
              this.list = [];
              this.total = 0;
              this.$message.error(data.msg)
            }
          });
      }
    });
  },
  beforeDestroy () {
    Bus.$off('upDateReportList')  
  },
  methods: {
    // 每页数
    handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      this.getConactsList();
    },
    // 当前页
    handleCurrentChange(val) {
      this.page = val;
      this.getConactsList();
    },
    // 回复历史
    replyHistory(val){
      this.$refs.replyHistoryView.init(val.msgUp)
    }
  }
};
</script>
<style lang="scss" scoped>
.send {
  height: 50px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  line-height: 50px;
  padding: 0 10px;
  box-sizing: border-box;
  .title {
    font-size: 18px;
  }
  button{
    width: 15%;
    height: 35px;
    border-radius: 5px;
    background: rgb(14, 142, 190);
    color: #fff;
    border: none;
    font-size: 15px;
    border: 1px solid lightblue;
    margin: 8px 0 0 10px;
    line-height: 35px;
  }
  .sendOut {
    height: 35px;
    line-height: 35px;
    background-color: brown;
    margin: 8px 20px 0;
    font-size: color;
    border: none;
  }
}

.all {
  position: relative;
  margin-right: 5px;
  background-color: white;
  margin-top: 5px; 
  .pagination {
    width: 100%;
    height: 50px;
    padding-top: 12px;
    background-color: #ddd;
    margin-right: 10px;
    position: absolute;
    bottom: 0;
    left: 0;
  }
}
</style>
