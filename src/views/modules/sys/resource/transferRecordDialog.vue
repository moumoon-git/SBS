<template>
  <sv-dialog
    ref="dialog"
    title="调拨记录"
    class="transfer_record"
    :modal-append-to-body="false"
    @cancel="handleDialogClose"
  >
    <div>
      <el-table
        :data="recordData"
        header-align="center"
        height="485"
      >
        <el-table-column
          v-for="item in (showType ? tableColumn2 : tableColumn)"
          :key="item.label"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            <span v-if="item.prop === 'contactorName'">
              <div
                class="record_people"
                @click="showDetail(scope.row.contactorId)"
              >
                {{ scope.row.contactorName }}
              </div>
            </span>
            <span v-else-if="item.prop === 'allocationNum'">
              {{ scope.row.allocationNum }} {{ scope.row.unit || '' }}
            </span>
            <span v-else>
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :page-size="pageSize"
        :total="total"
        :current-page.sync="currentPage"
        layout="total, prev, pager, next, jumper"
        @current-change="init()"
      />
    </div>
    <template #footer>
      <span />
    </template>
    <AddOrUpdate
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
    />
  </sv-dialog>
</template>

<script>
import AddOrUpdate from '../mailList/mailList-See-or-update.vue';

export default {
  components: { AddOrUpdate },
  data() {
    return {
      recordData: [],
      tableColumn2: [
        {
          prop: 'allocationTime',
          label: '调拨时间',
          width: '180',
        },
        {
          prop: 'contactorName',
          label: '调拨人',
          width: '120',
        },
        {
          prop: 'storehouseName',
          label: '仓库名称',
          width: '180',
        },
        {
          prop: 'resourceName',
          label: '装备名称',
          width: '120',
        },
        {
          prop: 'typeName',
          label: '装备类型',
          width: '150',
        },
        {
          prop: 'allocationNum',
          label: '调拨数量',
          width: '120',
        },
      ],
      tableColumn: [
        {
          prop: 'allocationTime',
          label: '调拨时间',
          width: '180',
        },
        {
          prop: 'contactorName',
          label: '调拨人',
          width: '120',
        },
        {
          prop: 'storehouseName',
          label: '仓库名称',
          width: '180',
        },
        {
          prop: 'resourceName',
          label: '物资名称',
          width: '120',
        },
        {
          prop: 'typeName',
          label: '物资类型',
          width: '150',
        },
        {
          prop: 'allocationNum',
          label: '调拨数量',
          width: '120',
        },
      ],
      total: 0, // 数据总数
      pageSize: 10, // 每页显示条目个数
      currentPage: 1, // 当前页数
      pagingSize: false, // 分页大小
      addOrUpdateVisible: false, // 联系人窗口
      showType: 0, // 物资调拨-0，装备调拨-1，
      curId: '', // 调拨分组id
    };
  },
  mounted() {
  },
  methods: {
    init() {
      this.recordData = [];
      this.$refs.dialog.visible = true;
      console.log('!!', this.curId, this.recordData, this.showType);
      this.$http({
        url: `${window.SITE_CONFIG.event}/event/task/getAllocationHistory`,
        methods: 'get',
        params: {
          type: this.showType,
          storehouseId: this.curId,
          page: this.currentPage,
          size: this.pageSize,
        },
      }).then((res) => {
        if (res.data.code === 0) {
          this.recordData = res.data.data.data;
          this.total = res.data.data.totalElements || 0;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 联系人详细
    showDetail(id) {
      console.log(id);
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, 0);
      });
    },
    handleDialogClose() {
      this.recordData = [];
      this.curId = '';
      this.total = 0;
      this.currentPage = 1;
      this.$refs.dialog.visible = false;
    },
  },
};
</script>

<style lang="less" scoped>
  .transfer_record {
    .record_people {
      cursor: pointer;
      opacity: 1;
      text-decoration: underline;
      color: #23b5f4;
    }
    .el-pagination {
      box-shadow: none;
    }
    .el-pagination {
      margin: 15px;
    }
  }
</style>
