<!--- 坐席平台 --->
<template>
  <div class="admin-seats-management">
    <!-- 头部 -->
    <div class="admin-seats-management_header">
      <!-- 左边 -->
      <div class="admin-seats-management_header-left">
        <div class="searchForm-item">
          <el-input
            v-model="seatNumber"
            placeholder="请输入坐席组名称搜索"
            clearable
            width="304px"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              size="small"
              type="primary"
              @click="getSeatManageGroup"
            />
          </el-input>
        </div>
      </div>
      <!-- 右边 -->
      <div class="admin-seats-management_header-right">
        <el-button
          type="primary"
          @click="addOrUpdateSeatGroup"
        >
          新增坐席组
        </el-button>
        <el-button
          type="primary"
          @click="batchDelete"
        >
          批量删除
        </el-button>
      </div>
    </div>
    <div class="admin-seats-management_body">
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        style="width: 100%"
        height="730"
        @selection-change="selectionChangeHandle"
      >
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50"
        />
        <el-table-column
          type="index"
          header-align="center"
          align="center"
          label="序号"
          width="100"
        />
        <el-table-column
          prop="seatGroupName"
          header-align="center"
          align="center"
          label="坐席组名称"
        />
        <el-table-column
          header-align="center"
          align="center"
          label="坐席数量"
          width="400"
        >
          <template slot-scope="scope">
            {{
              '电话坐席：' +
                (scope.row.phoneSeatNumber ? scope.row.phoneSeatNumber : '无') +
                '；    视频坐席：' +
                (scope.row.meetSeatNumber ? scope.row.meetSeatNumber : '无') +
                '；    监控坐席：' +
                (scope.row.monitorSeatNumber ? scope.row.monitorSeatNumber : '无')
            }}
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="200"
          label="操作"
        >
          <template slot-scope="scope">
            <div class="button-list">
              <button
                title="修改"
                class="icon-button"
                @click="editSeatsGroup(scope.row)"
              >
                <i class="icon-edit" />
              </button>
              <button
                title="删除"
                class="icon-button"
                @click="deleteSeatsGroup(scope.row)"
              >
                <i class="icon-delete" />
              </button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="admin-seats-management_footer">
      <el-pagination
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="pageSize"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
      />
    </div>
    <!-- 添加坐席组 -->
    <AddSeatsGroupDialog
      v-if="showAddSeatsGroupDialog"
      ref="addSeatsGroupDialog"
      :title="addSeatsGroupDialogTitle"
      @cancel="handleCancelAddSeatsGroupDialog"
      @success="handleSuccessAddSeatsGroupDialog"
    />
    <!-- 提示弹窗 -->
    <sv-dialog-hint
      ref="svDialogHintRef"
      :title="'删除坐席组'"
      :type="'delete'"
      :supplement="'是否删除已选择坐席组'"
      @cancel="$refs.svDialogHintRef.visible = false"
      @confirm="confirmDeleteSeatGroup"
    />
  </div>
</template>
<script>
import AddSeatsGroupDialog from '../components/Dialog/AddSeatsGroup';
import $seat from '../assets/js/seatManagementApi.js';

export default {
  name: 'PlateformSeatsManagement',
  components: {
    AddSeatsGroupDialog,
  },
  data() {
    return {
      addSeatsGroupDialogTitle: '新增坐席组', // 弹窗标题
      showAddSeatsGroupDialog: false, // 显示/隐藏 新增/编辑坐席组弹窗
      seatNumber: '', // 坐席号码
      dataList: [], // 表格数据
      dataListLoading: false, // 加载中
      pageIndex: 1, // 页码
      pageSize: 10, // 页数
      totalCount: 0, // 总页数
      selectedSeatList: [], // 表格中已选的坐席
      deleteSeatGroupIds: [], // 要删除的坐席组Id
    };
  },
  mounted() {
    this.getSeatManageGroup();
  },
  methods: {
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getSeatManageGroup();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getSeatManageGroup();
    },
    // 多选
    selectionChangeHandle(val) {
      this.selectedSeatList = val;
    },
    /**
     * @description 新增坐席
     */
    addOrUpdateSeatGroup() {
      this.showAddSeatsGroupDialog = true;
      this.addSeatsGroupDialogTitle = '新增坐席组';
    },
    /**
     * @description 关闭新增坐席弹窗
     */
    handleCancelAddSeatsGroupDialog() {
      this.showAddSeatsGroupDialog = false;
    },
    /**
     * @description 新增坐席组成功
     */
    handleSuccessAddSeatsGroupDialog() {
      this.showAddSeatsGroupDialog = false;
      this.getSeatManageGroup();
    },
    /**
     * @description 坐席管理(超管) 列表 模糊查询
     */
    getSeatManageGroup() {
      this.dataListLoading = true;
      const data = {
        name: this.seatNumber,
        page: this.pageIndex,
        limit: this.pageSize,
        type: 2, // 1:为登录判断是否可用 2：为坐席组列表显示
      };
      $seat.getSeatManageGroup(data, this.getSeatManageGroupCallback);
    },
    /**
     * @description 坐席管理(超管) 列表 模糊查询 回调函数
     */
    getSeatManageGroupCallback(type, data) {
      this.dataListLoading = false;
      if (type === 'success') {
        this.dataList = data.data.list;
        this.totalCount = data.data.totalCount;
      } else {
        this.dataList = [];
        this.totalCount = 0;
        this.$message.error(
          `查询列表失败，错误代码：${data.code}，错误信息：${data.msg}`,
        );
      }
    },
    /**
     * @description 编辑坐席组
     */
    editSeatsGroup(row) {
      this.showAddSeatsGroupDialog = true;
      this.addSeatsGroupDialogTitle = '编辑坐席组';
      setTimeout(() => {
        const data = {
          id: row.id,
          seatName: row.seatGroupName, // 坐席名称
          phoneSeat: row.phoneSeatId, // 电话坐席
          placeTerminal: row.meetSeatId, // 会场终端
          mornitoringTerminal: row.monitorSeatId, // 监控终端
        };
        Object.assign(this.$refs.addSeatsGroupDialog.formData, data);
      }, 100);
    },
    /**
     * @description 批量删除坐席
     */
    batchDelete() {
      this.deleteSeatGroupIds = this.selectedSeatList.map((item) => item.id);
      if (this.deleteSeatGroupIds.length === 0) {
        this.$message.error('请先勾选坐席组');
        return;
      }
      this.$refs.svDialogHintRef.visible = true;
    },
    /**
     * @description 删除坐席
     */
    deleteSeatGroup() {
      const data = {
        ids: this.deleteSeatGroupIds,
      };
      $seat.deleteSeatGroup(data, this.deleteSeatGroupIdsCallback);
    },
    /**
     * @description 删除坐席回调
     */
    deleteSeatGroupIdsCallback(type, data) {
      if (type === 'success') {
        this.$message({
          type: 'success',
          message: '删除成功',
        });
        this.getSeatManageGroup();
      } else {
        this.$message.error(
          `删除失败，错误代码：${data.code}，错误信息：${data.msg}`,
        );
      }
    },
    /**
     * @description 删除坐席组
     */
    deleteSeatsGroup(row) {
      this.deleteSeatGroupIds = [];
      this.deleteSeatGroupIds.push(row.id);
      this.$refs.svDialogHintRef.visible = true;
    },
    /**
     * @description 确定删除
     */
    confirmDeleteSeatGroup() {
      this.deleteSeatGroup();
    },
  },
};
</script>
<style lang="scss">
@import '../assets/css/platformSeatsManagement';
</style>
