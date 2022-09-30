<template>
  <div>
    <el-row :gutter="20">
      <risk-warning-header
        @addHandle="seeOrAddOrEdit"
        @batchDelHandle="del"
      />
    </el-row>

    <el-row :gutter="20">
      <risk-warning-table
        :table-data="tableData"
        @seeOrEdit="seeOrAddOrEdit"
        @delHandle="del"
        @getCheckList="getCheckList"
      />
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>

    <!-- 新增/编辑/删除 -->
    <add-or-edit
      ref="AddOrEditView"
      @delData="delData"
      @initData="initData"
    />
  </div>
</template>

<script>
import RiskWarningHeader from './RiskWarning-header';
import RiskWarningTable from './RiskWarning-table';

import AddOrEdit from './AddOrEditOrDelete';

export default {
  name: 'TerminalOnline',
  components: {
    RiskWarningHeader,
    RiskWarningTable,
    AddOrEdit,
  },
  data() {
    return {
      checkGroup: [], // 选中数据
      id: '', // 行Id
      tableData: [],

      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      totalNum: 0, // 总条数
    };
  },
  created() {
    this.initData();
  },
  methods: {
    // 初始化表格数据
    initData() {
      this.$http({
        url: this.$http.adornUrl('/ty/tyAlarm/list'),
        method: 'GET',
        params: this.$http.adornParams({
          page: this.currentPage,
          limit: this.pageSize,
          startTime: '',
          endTime: '',
        }),
      }).then(({ data }) => {
        // console.log(data)
        if (data.data.list !== 0) {
          this.tableData = data.data.list;
          this.totalNum = data.data.totalCount;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //   新增/编辑
    seeOrAddOrEdit(type, id) {
      this.id = id;
      this.$nextTick(() => {
        this.$refs.AddOrEditView.init(type, id);
      });
    },
    // 删除弹窗
    del(id) {
      this.id = id;
      this.$nextTick(() => {
        this.$refs.AddOrEditView.delList();
      });
    },
    // 执行删除
    delData() {
      if (this.id || this.checkGroup.length !== 0) {
        this.$http({
          url: this.$http.adornUrl('/ty/tyAlarm/delete'),
          method: 'POST',
          data: this.$http.adornData({
            ids: this.id ? [this.id] : this.checkGroup.map((v) => v.id),
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.initData();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      } else {
        this.$message.error('请选择删除数据');
      }
    },
    // 获取选中的列表
    getCheckList(val) {
      this.checkGroup = val;
    },

    // 每页数
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.initData();
    },
    //  当前页数
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initData();
    },

  },
};
</script>
