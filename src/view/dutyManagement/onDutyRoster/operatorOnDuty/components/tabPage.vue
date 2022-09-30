<template>
  <div class="tab-page-style">
    <el-tabs
      v-model="activeClassId"
      type="card"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="item in classList"
        :key="item.id"
        :label="item.name"
        :name="item.id"
        :lazy="lazy"
      >
        <div v-if="onDutyMans && onDutyMans.length > 0">
          <el-table
            :data="onDutyMans"
            style="width: 100%;height:530px;overflow-y:scroll;"
          >
            <el-table-column
              prop="name"
              label="人员"
              align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
                <span v-if="scope.row.sex === '女'">{{
                  '（' + scope.row.sex + '）'
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="position"
              label="职务"
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
              label="排班日期"
              show-overflow-tooltip
              width="300px">
              <template slot-scope="scope">
                <div class="date-list-style">
                  <span v-for="(item, index) in scope.row.date" :key="index">{{item + (index !== scope.row.date.length - 1 ? '、' : '')}}</span>
                </div>
              </template>
            </el-table-column> -->
            <el-table-column
              label="挂起规则"
              align="center"
            >
              <template
                slot-scope="scope"
              >
                <p
                  v-if="scope.row.startDate || scope.row.endDate"
                  class="col-item"
                >
                  <span v-if="scope.row.startDate">{{
                    scope.row.startDate
                  }}</span>
                  <span
                    v-if="scope.row.startDate && scope.row.endDate"
                  >
                    至
                  </span>
                  <span v-if="scope.row.endDate">{{ scope.row.endDate }}</span>
                </p>
                <p
                  v-if="scope.row.day"
                  class="col-item"
                >
                  <span
                    v-for="(day, index) in scope.row.daysList"
                    :key="day"
                  >
                    {{
                      day +
                        (index + 1 !== scope.row.daysList.length ? '，' : '')
                    }}
                  </span>
                </p>
                <p
                  v-if="scope.row.startTime || scope.row.endTime"
                  class="col-item"
                >
                  <span v-if="scope.row.startTime">{{
                    scope.row.startTime
                  }}</span>
                  <span v-if="scope.row.startTime || scope.row.endTime">-</span>
                  <span v-if="scope.row.endTime">{{ scope.row.endTime }}</span>
                </p>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            class="pagination-style"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <div
          v-else
          class="noList"
        >
          暂无值班人员
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: 'Operation',
  props: [
    'month', // 日期
    'classList', // 班次列表
    'activeClass', // 当前选中班次id
    'mansList', // 值班人员列表
    'total', // 值班人员总数
  ],
  data() {
    return {
      lazy: true, // 懒加载
      activeClassId: '', // 当前选中班次id
      currentPage: 1, // 当前页数
      pageSize: 10, // 每页条数
      pageSizes: [10, 20, 30, 40], // 可选条数
      onDutyMans: [],
    };
  },
  watch: {
    activeClass: {
      // 当前选中班次id
      handler(newVal) {
        this.activeClassId = newVal;
      },
      deep: true,
    },
    mansList: {
      handler(newVal) {
        this.onDutyMans = newVal;
      },
      deep: true,
    },
  },
  mounted() {
    this.activeClassId = this.activeClass;
  },
  methods: {
    // 切换标签页
    handleClick(el) {
      this.currentPage = 1;
      this.pageSize = 10;
      this.$forceUpdate();
      this.$emit('changeClass', el.name);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.$emit('handleSizeChange', val);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$emit('handleCurrentChange', val);
    },
  },
};
</script>
<style scoped>
/deep/ .el-tabs__item {
  background: rgba(249, 251, 255, 1);
  color: rgba(153, 153, 153, 1);
  border-bottom: 1px solid rgba(221, 221, 221, 1) !important;
}
/deep/ .el-tabs__item.is-active {
  background: #ffffff;
  border-bottom: 1px solid transparent !important;
}
.pagination-style {
  background: #ffffff;
  display: flex;
  justify-content: flex-end;
  padding: 20px;
}
.col-item {
  margin: 0;
}
.noList {
  background-image: url(/static/img/nullList.png);
  background-repeat: no-repeat;
  background-position: center;
  background-color: white;
  text-align: center;
  line-height: 610px;
  font-size: 12px;
  font-weight: bold;
  color: #cad5e8;
  height: 470px;
}
.date-list-style {
  padding-right: 20px;
  text-overflow: ellipsis;
  overflow: hidden;
}
/* >>>.el-tooltip__popper {
  max-width: 200px !important;
} */
</style>
