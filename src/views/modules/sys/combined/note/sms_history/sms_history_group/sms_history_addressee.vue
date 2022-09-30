<template>
  <div class="all">
    <div class="send">
      <div class="title">收信人</div>
    </div>
<!-- 
    <el-table
      :data="list"
      border
      style="width: 100%;height:657px"
      @row-click="handleSelectionChange"
    >
      <el-table-column prop="name" label="联系人" align="center"></el-table-column>
      <el-table-column prop="workUnit" label="单位" align="center"></el-table-column>
      <el-table-column prop="position" label="职位" align="center"></el-table-column>
      <el-table-column prop="reply" label="回复" align="center"></el-table-column>
    </el-table> -->

<!-- <el-table
    :data="list"
    style="width: 100%;height:657px"
      @row-click="handleSelectionChange">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="联系人">
            <span>{{ props.row.name }}</span>
          </el-form-item>
          <el-form-item label="单位">
            <span>{{ props.row.workUnit }}</span>
          </el-form-item>
          <el-form-item label="职位">
            <span>{{ props.row.position }}</span>
          </el-form-item>
          <el-form-item label="店铺 ID">
            <span>{{ props.row.shopId }}</span>
          </el-form-item>
          <el-form-item label="回复">
            <span>{{ props.row.reply }}</span>
          </el-form-item>
          <el-form-item label="联系号码">
            <span>{{ props.row.phone }}</span>
          </el-form-item>
          <el-form-item label="状态">
            <span>{{ props.row.status }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="联系人"
      prop="name">
    </el-table-column>
    <el-table-column
      label="单位"
      prop="workUnit">
    </el-table-column>
    <el-table-column
      label="职位"
      prop="position">
    </el-table-column>
  </el-table> -->

  <el-table
    :data="list"
    style="width: 100%;height:657px">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="联系人">
            <span>{{ props.row.name }}</span>
          </el-form-item>
          <el-form-item label="单位">
            <span>{{ props.row.workUnit }}</span>
          </el-form-item>
          <el-form-item label="职位">
            <span>{{ props.row.position }}</span>
          </el-form-item>
          <el-form-item label="回复">
            <span>{{ props.row.reply }}</span>
          </el-form-item>
          <el-form-item label="联系号码">
            <span>{{ props.row.phone }}</span>
          </el-form-item>
          <el-form-item label="状态">
            <span>{{ props.row.status }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="联系人"
      prop="name">
    </el-table-column>
    <el-table-column
      label="单位"
      prop="workUnit">
    </el-table-column>
    <el-table-column
      label="职位"
      prop="position">
    </el-table-column>
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
  </div>
</template>

<script>
import Bus from "@/views/common/js/eventBus";
export default {
  // props: ["list"],
  name: "sms_history_contact",
  components: {},
  data() {
    return {
      page: 1,
      pageSize: 5,
      list: [],
      oneMobileData: "",
      total: 0,

      // 查收信人参数
      tableData: [{
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }]
    };
  },
  mounted() {
    Bus.$on("upDateGroupList", (row,key) => {
      if (row) {
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
          //   "getDataList+++++++++++++++++++++++++++++++++++++++++++++++",
          //   data
          // );
          if (data.page.list.length != 0 && data.code === 0) {
            this.list = [...data.page.list];
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
    Bus.$off('upDateGroupList')  
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

/deep/ .demo-table-expand {
    font-size: 0;
  }
/deep/  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
/deep/  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
