<template>
  <div>
    <el-table
      :data="list"
      border
      height="717px"
      highlight-current-row
      ref="multipleTable"
      v-loading="dataListLoading"
    >
      <el-table-column prop="createTime" label="创建时间" align="center" sortable></el-table-column>
      <el-table-column prop="name" label="卡口名称" align="center"></el-table-column>
      <el-table-column prop="type" label="卡口类型" align="center"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[15, 30, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
      class="pagination"
      style="background-color: white;"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      pageSize: 15,
      list: [],
      total: 0,

      dataListLoading: false,
    };
  },
  created(){
      this.init()
  },
  methods: {
    init() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl("/vcm/vcmManager/SearchBayonet"),
        method: "get",
        params: this.$http.adornParams({
          page: this.page,
          limit: this.pageSize,
        })
      }).then(({ data }) => {
        // console.log(
        //   "getDataList+++++++++++++++++++++++++++++++++++++++++++++++",
        //   data
        // );

        if (data && data.code === 0) {
          this.list = data.data.list;
          this.total = data.data.totalCount;
          this.list.map(v => {
              switch (v.type) {
                case "1":
                  v.type = "车辆卡口";
                  break;
                case "2":
                  v.type = "人脸卡口";
                  break;
              }
            });
        } else {
          this.list = [];
          this.total = 0;
        }
        this.dataListLoading = false
      });
    },
    hide(){
      this.groupView = false
    },
     // 每页数
    handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      this.init();
    },
    // 当前页
    handleCurrentChange(val) {
      this.page = val;
      this.init();
    },
  }
};
</script>

<style lang="scss" scoped>

</style>