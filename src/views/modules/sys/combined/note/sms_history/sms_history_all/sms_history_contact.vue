<template>
  <div class="all">
    <div class="send">
      <div class="title">联系人</div>
      <!-- <button class="sendOut">添加到联系人</button> -->
    </div>

    <el-table
      :data="list"
      border
      style="width: 100%;height:657px"
      @current-change="currentChange"
      highlight-current-row
      ref='multipleTable'
    >
      <el-table-column prop="name" label="联系人" align="center"></el-table-column>
      <el-table-column prop="workUnit" label="工作单位" align="center"></el-table-column>
      <el-table-column prop="position" label="职务" align="center"></el-table-column>
      <el-table-column prop="phone" label="联系号码" align="center"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[3, 30, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="pagination"
      style="background-color: white;"
    ></el-pagination>
  </div>
</template>

<script>
import Bus from "@/views/common/js/eventBus";
export default {
  // props:['list'],
  name: "sms_history_contact",
  components: {},
  data() {
    return {
      page: 1,
      pageSize: 3,
      list: [],
      total: 10,
      oneMobileData: "",
      currentRow: null,
    };
  },
  created() {
    this.initAll();
  },
  
  methods: {
    // 初始化所有联系人和信息数据
    
    initAll(key) {
      this.$http({
        url: this.$http.adornUrl("/message/messageinfor/userlist"),
        method: "get",
        params: this.$http.adornParams({
          page: this.page,
          limit: this.pageSize,
          search: key ? key : ""
        })
      }).then(({ data }) => {
        // console.log(
        //   "getDataList+++++++++++++++++++++++++++++++++++++++++++++++",
        //   data
        // );

        if (data && data.code === 0) {
          this.list = data.data.list;
          this.total = data.data.totalCount;
          this.$forceUpdate()
          this.$refs.multipleTable.setCurrentRow(this.list[0])
          Bus.$emit("upDateAllList", this.list[0]);
        } else {
          this.list = [];
          this.total = 0;
          this.$message.error(data.msg)
        }
      });
    },
    // 每页数
    handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      this.initAll();
    },
    // 当前页
    handleCurrentChange(val) {
      this.page = val;
      this.initAll();
    },
     // 点击联系人获取对应信息
    currentChange(val) {
        this.currentRow = val;
        Bus.$emit("upDateAllList", val);
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

  .title {
    font-size: 18px;
    padding-left: 10px;
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
