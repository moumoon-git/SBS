<!---搜索结果--->
<template>
  <div>
    <div v-if="onDutyMans && onDutyMans.length > 0">
      <el-table
        :data="onDutyMans"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="人员"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
            <span v-if="scope.row.sex === '女'">{{'（' + scope.row.sex + '）'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="position"
          label="职务"
          width="180"
          align="center"
        />
        <el-table-column
          prop="mobile"
          label="手机"
          align="center"
        />
        <el-table-column
          prop="officeTel"
          label="办公电话"
          align="center"
        />
        <!-- <el-table-column
          label="排班日期">
          <template slot-scope="scope">
            <div v-if="scope.row.date" class="date-list-style">
              <span v-for="(item, index) in scope.row.date" :key="index">{{item + (index !== scope.row.date.length - 1 ? '、' : '')}}</span>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column
          label="挂起规则"
          align="center"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.startDate || scope.row.endDate" class="col-item">
              <span v-if="scope.row.startDate">{{scope.row.startDate}}</span>
              <span v-if="scope.row.startDate && scope.row.endDate">至</span>
              <span v-if="scope.row.endDate">{{scope.row.endDate}}</span>
            </p>
            <p v-if="scope.row.day" class="col-item">
              <span v-for="item in scope.row.daysList" :key="item">{{item}}</span>
            </p>
            <p v-if="scope.row.startTime || scope.row.endTime" class="col-item">
              <span v-if="scope.row.startTime">{{scope.row.startTime}}</span>
              <span v-if="scope.row.startTime || scope.row.endTime">-</span>
              <span v-if="scope.row.endTime">{{scope.row.endTime}}</span>
            </p>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="pagination-style"
        background>
      </el-pagination>
    </div>
    <div class="noList" v-else>暂无值班人员</div>
  </div>
</template>
<script>
export default {
  name: 'SearchTable',
  props: [
    'mansList', // 值班人员列表
    'total' // 值班人员总数
  ],
  data() {
    return {
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      pageSizes: [10,20,30,40], // 可选条数
      onDutyMans: []
    }
  },
  watch: {
    mansList: {
      handler: function(newVal, oldVal) {
        console.log('监听->值班人员', newVal)
        this.onDutyMans = newVal
      },
      deep: true
    }
  },
  methods: {
    // 改变每页条数
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    // 改变当前页数
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    }
  }
}
</script>
<style scoped>
.col-item {
  margin: 0;
}
.pagination-style {
  background: #ffffff;
  display: flex;
  justify-content: flex-end;
  padding: 20px;
}
.noList{
  background-image: url(/static/img/nullList.png);
  background-repeat: no-repeat;
  background-position: center;
  background-color: white;
  text-align: center;
  line-height: 720px;
  font-size: 12px;
  font-weight: bold;
  color: #cad5e8;
  height: 580px;
}
.date-list-style {
  padding-right:20px;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>