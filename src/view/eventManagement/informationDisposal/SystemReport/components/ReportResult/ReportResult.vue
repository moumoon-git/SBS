<template>
  <div>
    <el-table
      ref="tableRef"
      height="630px"
      :data="tableData"
      :header-row-style="{ background: '#F0F5FF' }"
      highlight-current-row
      style="width: 100%; margin: 10px 0; text-align: center; box-shadow: none"
      @row-click="tableRowClick"
    >
      <el-table-column
        label="事件标题"
        height="30"
        align="left"
        show-overflow-tooltip
        min-width="40%"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
          <!-- 1已读, 0未读 -->
          <span
            v-if="scope.row.superiorReadStatus === 0"
            :class="$style['read-status']"
            :style="{background: '#D9001B'}"
          >
            新
          </span>
          <span
            v-else-if="scope.row.superiorDealReadStatus === 0"
            :class="$style['read-status']"
            :style="{background: '#F59A23'}"
          >
            续
          </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="事发时间"
        height="30"
        show-overflow-tooltip
        min-width="30%"
      >
        <template slot-scope="scope">
          {{
            scope.row.occurTime
              ? scope.row.occurTime.substring(
                0,
                scope.row.occurTime.lastIndexOf(':'),
              )
              : ''
          }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="更新时间"
        height="30"
        show-overflow-tooltip
        min-width="30%"
      >
        <template slot-scope="scope">
          {{
            scope.row.occurTime
              ? scope.row.occurTime.substring(
                0,
                scope.row.occurTime.lastIndexOf(':'),
              )
              : ''
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="platformName"
        align="center"
        label="上报平台"
        height="30"
        show-overflow-tooltip
        min-width="30%"
      />
    </el-table>
    <!--分页-->
    <el-pagination
      center
      layout="prev, pager, next, sizes, total, jumper"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      :total="total"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      tableData: [],
      pageSize: 10,
      total: 0,
      currentPage: 1,
    };
  },
  methods: {
    /**
     * @description 点击行
     * @param {object} item 行数据
     */
    tableRowClick(item) {
      // superiorDealReadStatus 续报未读
      // superiorReadStatus 事件未读
      if (item.superiorReadStatus === 0 || item.superiorDealReadStatus === 0) {
        this.superiorReadEvent(item.id);
      }
      this.$emit('row-click', item);
    },
    /**
     * @description 上级阅读下级上报事件（设为已读）
     * @param {number | string} eventId 事件id
     */
    superiorReadEvent(eventId) {
      const request = {
        eventId,
      };
      this.$api.superiorReadEvent(request).then((res) => {
        if (res.errorcode === 0) {
          this.$emit('refresh');
        }
      });
    },
    /**
     * @description 分页
     * @param {number} val 页数
     */
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$emit('current-change', val);
    },
    /**
     * @description 分页
     * @param {number} val 页条数
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.$emit('size-change', val);
    },
    /**
     * @description 选中行-高亮
     */
    setCurrentRow(row) {
      this.$refs.tableRef.setCurrentRow(row);
    },
  },
};
</script>

<style module>
.read-status {
  width: 30px;
  height: 30px;
  opacity: 1;
  font-size: 16px;
  font-weight: 400;
  color: #ffffff;
  display: block;
  border-radius: 50%;
  text-align: center;
  line-height: 30px;
  position: absolute;
  right: 0;
  top: calc(50% - 15px);
}
</style>
