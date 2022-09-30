<template>
  <div>
    <el-row>
      <el-row>
        <el-button type="primary" @click="crowdGatheringAdd">新增</el-button>
      </el-row>
      <el-col :span="24">
        <el-table :data="tableData" style="width: 100%" height="730">
          <el-table-column fixed prop="gmtCreate" label="创建时间" align="center" width="180"></el-table-column>
          <el-table-column prop="taskName" label="任务名称" align="center"></el-table-column>
          <el-table-column prop="description" label="任务描述" align="center"></el-table-column>
          <el-table-column prop="projectId" label="项目ID" align="center"></el-table-column>
          <el-table-column prop="taskId" label="任务ID" align="center"></el-table-column>
          <el-table-column fixed="right" label="操作" width="50">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.row.taskId)"
                type="text"
                size="small"
                align="center"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
    ></el-pagination>

    <!-- 新增 -->
    <crowdGathering-add ref="crowdGatheringAddView"></crowdGathering-add>
  </div>
</template>

<script>
import crowdGatheringAdd from "./crowdGathering-add";
export default {
  components: {
    crowdGatheringAdd: crowdGatheringAdd
  },
  data() {
    return {
      pageSize: 10,
      page: 1,
      total: 0,
      tableData: []
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.$http({
        url: this.$http.adornUrl(`/vcm/vcmCrowdcountTask/list`),
        method: "get",
        params: this.$http.adornParams({
          limit: this.pageSize,
          page: this.page
        })
      }).then(({ data }) => {
        if (data.page.length !== 0) {
          this.total = data.page.totalCount;
          this.tableData = data.page.list;
        }
      });
    },
    crowdGatheringAdd() {
      this.$refs.crowdGatheringAddView.init();
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
    },
    deleteRow(taskId) {
      this.$confirm("此操作将永久删除该人群, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/vcm/vcmCrowdcountTask/delete`),
          method: "post",
          data: this.$http.adornData({
            taskId,
          })
        }).then(({ data }) => {
          this.initData()
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>