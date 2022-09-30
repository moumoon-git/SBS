<!--- 坐席超管 --->
<template>
  <div class="admin-seats-management">
    <!-- 头部 -->
    <div class="admin-seats-management_header">
      <!-- 左边 -->
      <div class="admin-seats-management_header-left">
        <div class="searchForm-item">
          <span>坐席类型</span>
          <el-select
            v-model="searchForm.seatType"
            placeholder="请选择"
            clearable
            @change="getSeatInfo"
          >
            <el-option
              v-for="item in seatType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              width="170px"
            />
          </el-select>
        </div>
        <div class="searchForm-item">
          <span>关联平台</span>
          <el-cascader
            v-model="searchForm.associatedPlatform"
            :options="platform"
            :props="platformProps"
            :show-all-levels="false"
            filterable
            clearable
            width="170px"
            @change="getSeatInfo"
          />
        </div>
        <div class="searchForm-item">
          <el-input
            v-model="searchForm.seatNumber"
            placeholder="请输入坐席号码搜索"
            clearable
            width="304px"
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              size="small"
              type="primary"
              @click="getSeatInfo"
            />
          </el-input>
        </div>
      </div>
      <!-- 右边 -->
      <div class="admin-seats-management_header-right">
        <el-button type="primary" @click="addOrUpdateSeat">新增坐席</el-button>
        <el-button type="primary" @click="batchAssociated">批量关联</el-button>
        <el-button type="primary" @click="batchDelete">批量删除</el-button>
      </div>
    </div>
    <div class="admin-seats-management_body">
      <el-table
        v-loading="dataListLoading"
        :data="dataList"
        style="width: 100%"
        height="720"
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
          prop="seatTypeName"
          header-align="center"
          align="center"
          label="坐席类型"
        />
        <el-table-column
          prop="seatNumber"
          header-align="center"
          align="center"
          label="坐席号码"
        />
        <el-table-column
          prop="platFormName"
          header-align="center"
          align="center"
          label="关联平台"
        >
          <template slot-scope="scope">
            <span
              v-if="
                !scope.row.connectPlatformId ||
                  scope.row.connectPlatformId === ''
              "
              style="color: #f46666"
            >未关联</span>
            <span v-else>{{ scope.row.platFormName }}</span>
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
              <button class="icon-button" title="修改" @click="editSeat(scope.row)">
                <i class="icon-edit" />
              </button>
              <button class="icon-button" title="删除" @click="handleDeleteSeat(scope.row)">
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
    <!-- 添加坐席弹窗 -->
    <AddSeatDialog
      v-if="showAddSeatDialog"
      ref="addSeatDialog"
      :title="addSeatDialogTitle"
      :seat-type="defaultSeatType"
      :platform-data="defaultPlatform"
      :platform-props="platformProps"
      @success="handleSuccessAddSeatDialog"
      @cancel="handleCancelAddSeatDialog"
    />
    <!-- 批量删除弹窗 -->
    <DeleteSeatDialog
      v-if="showDeleteSeatDialog"
      :seat-list="selectedSeatList"
      :title="deleteSeatDialogTitle"
      @cancel="handleCancelDeleteSeatDialog"
      @delete="handleBatchDeleteSeat"
    />
    <!-- 批量关联坐席弹窗 -->
    <AssociateSeats
      v-if="showAssociateSeatDialog"
      :seat-list="selectedSeatList"
      :title="associateSeatDialogTitle"
      :platform-data="defaultPlatform"
      :platform-props="platformProps"
      @cancel="handleCancelAssociateSeatDialog"
      @success="handleSuccessAssociateSeat"
    />

    <sv-dialog-hint
      ref="svDialogHintRef"
      :title="'删除坐席'"
      :type="'delete'"
      :supplement="'是否删除已选择坐席'"
      @cancel="$refs.svDialogHintRef.visible = false"
      @confirm="confirmDeleteSeat"
    />
  </div>
</template>
<script>
import AddSeatDialog from '../components/Dialog/AddSeat';
import DeleteSeatDialog from '../components/Dialog/DeleteSeat';
import AssociateSeats from '../components/Dialog/AssociateSeats';
import $seat from '../assets/js/seatManagementApi.js';
import $common from '../assets/js/common.js';

export default {
  name: 'AdminSeatsManagement',
  components: {
    AddSeatDialog,
    DeleteSeatDialog,
    AssociateSeats,
  },
  data() {
    return {
      showAssociateSeatDialog: false,
      associateSeatDialogTitle: '批量关联坐席号',

      deleteSeatDialogTitle: '批量删除', // 弹窗标题
      showDeleteSeatDialog: false, // 显示/隐藏 批量删除/批量关联弹窗

      addSeatDialogTitle: '新增坐席', // 弹窗标题
      showAddSeatDialog: false, // 显示/隐藏 新增/编辑坐席弹窗

      // 搜索表单
      searchForm: {
        seatType: '',
        associatedPlatform: [''],
        seatNumber: '',
      },
      seatType: [], // 坐席类型
      defaultSeatType: [], // 坐席类型 没有全部子选项的
      defaultPlatform: [], // 平台信息 没有全部子选项的
      platform: [], // 平台信息
      // 配置选项
      platformProps: {
        value: 'id',
        label: 'platformName',
        children: 'children',
        checkStrictly: true,
      },
      dataList: [], // 表格数据
      dataListLoading: false, // 加载中
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      selectedSeatList: [], // 表格中已选的坐席
      deleteSeatIds: [], // 要删除的坐席Id
    };
  },
  mounted() {
    $seat.getSysDictionaryListByCode(this.getSysDictionaryListByCode);
    $seat.getPlatform(this.getPlatform);
    this.getSeatInfo(); // 获取坐席列表
  },
  methods: {
    /**
     * @description 坐席管理(超管) 获取 坐席信息类型列表(字典表)
     */
    getSysDictionaryListByCode(type, data) {
      if (type === 'success') {
        this.seatType = Array.from(
          data.data.map((item) => ({
            value: item.code,
            label: item.name,
          })),
        );
        this.defaultSeatType = Array.from(
          data.data.map((item) => ({
            value: item.code,
            label: item.name,
          })),
        );
        this.seatType.unshift({
          value: '',
          label: '全部',
        });
      } else {
        this.$message.error(
          `查询坐席信息失败，错误代码：${data.code}，错误信息：${data.msg}`,
        );
      }
    },
    /**
     * @description 坐席平台（超管） 获取平台信息
     */
    getPlatform(type, data) {
      if (type === 'success') {
        this.platform = Array.from(data.data);
        this.defaultPlatform = data.data;
        this.platform.unshift({
          id: '',
          platformName: '全部',
          children: null,
        });
      } else {
        this.$message.error(
          `查询平台信息失败，错误代码：${data.code}，错误信息：${data.msg}`,
        );
      }
    },
    /**
     * @description 坐席管理(超管) 列表 模糊查询
     */
    getSeatInfo() {
      this.dataListLoading = true;
      const data = {
        seatType: this.searchForm.seatType,
        connectPlatformId:
          this.searchForm.associatedPlatform[
            this.searchForm.associatedPlatform.length - 1
          ],
        seatNumber: this.searchForm.seatNumber,
        page: this.pageIndex,
        limit: this.pageSize,
      };
      $seat.getSeatInfo(data, this.getSeatInfoCallback);
    },
    /**
     * @description 坐席管理(超管) 列表 模糊查询 回调函数
     */
    getSeatInfoCallback(type, params, data) {
      this.dataListLoading = false;
      if (type === 'success') {
        this.dataList = data.data.list;
        this.totalCount = data.data.totalCount;
      } else {
        this.$message.error(
          `查询列表失败，错误代码：${data.code}，错误信息：${data.msg}`,
        );
      }
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getSeatInfo(); // 获取坐席列表
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getSeatInfo(); // 获取坐席列表
    },
    // 多选
    selectionChangeHandle(val) {
      this.selectedSeatList = val;
    },
    /**
     * @description 新增坐席
     */
    addOrUpdateSeat() {
      this.showAddSeatDialog = true;
      this.addSeatDialogTitle = '新增坐席';
    },

    /**
     * @description 批量关联坐席
     */
    batchAssociated() {
      if (this.selectedSeatList.length === 0) {
        this.$message.info('请先勾选要批量关联的坐席');
        return;
      }
      this.showAssociateSeatDialog = true;
      this.associateSeatDialogTitle = '批量关联坐席号';
    },
    /**
     * @description 批量删除坐席
     */
    batchDelete() {
      if (this.selectedSeatList.length === 0) {
        this.$message.info('请先勾选要删除的坐席');
        return;
      }
      this.showDeleteSeatDialog = true;
      this.deleteSeatDialogTitle = '删除坐席';
    },
    /**
     * @description 关闭批量关联坐席
     */
    handleCancelDeleteSeatDialog() {
      this.showDeleteSeatDialog = false;
    },
    /**
     * @description 关闭批量关联坐席
     */
    handleCancelAssociateSeatDialog() {
      this.showAssociateSeatDialog = false;
    },
    /**
     * @description 成功批量关联坐席
     */
    handleSuccessAssociateSeat() {
      this.showAssociateSeatDialog = false;
      this.getSeatInfo(); // 获取坐席列表
    },
    /**
     * @description 关闭新增坐席弹窗
     */
    handleCancelAddSeatDialog() {
      this.showAddSeatDialog = false;
      this.$refs.addSeatDialog.visible = false;
    },
    /**
     * @description 新增坐席成功
     */
    handleSuccessAddSeatDialog() {
      this.showAddSeatDialog = false;
      this.handleCancelAddSeatDialog(); // 关闭新增坐席弹窗
      this.handleInitData(); // 初始化数据
      this.getSeatInfo(); // 获取坐席列表
    },
    /**
     * @description 初始化数据
     */
    handleInitData() {
      // 初始化搜索表单
      Object.assign(this.searchForm, {
        seatType: '',
        associatedPlatform: [''],
        seatNumber: '',
      });
      this.pageIndex = 1;
      this.pageSize = 10;
    },
    /**
     * @description 编辑坐席
     */
    editSeat(row) {
      this.showAddSeatDialog = true;
      this.addSeatDialogTitle = '编辑坐席';
      setTimeout(() => {
        const data = {
          id: row.id,
          seatType: String(row.seatTypeId),
          seatNumber: row.seatNumber,
          associatedPlatform: $common.getRelations({
            arr: this.platform,
            relationKey: 'id',
            findKey: 'id',
            findValue: Number(row.connectPlatformId),
          }),
        };
        Object.assign(this.$refs.addSeatDialog.formData, data);
        this.$refs.addSeatDialog.getLocalSeatUcsInfo(String(row.seatTypeId)); // 调用UDS 获取 坐席信息
      }, 100);
    },
    /**
     * @description 删除坐席
     */
    deleteSeat() {
      const data = {
        ids: this.deleteSeatIds,
      };
      $seat.deleteSeatInfo(data, this.deleteSeatInfoCallback);
    },
    /**
     * @description 删除坐席回调
     */
    deleteSeatInfoCallback(type, data) {
      if (type === 'success') {
        this.$message({
          type: 'success',
          message: '删除成功',
        });
        this.getSeatInfo(); // 获取坐席列表
        this.showDeleteSeatDialog = false;
      } else {
        this.$message.error(
          `删除失败，错误代码：${data.code}，错误信息：${data.msg}`,
        );
      }
    },
    /**
     * @description 删除坐席
     */
    handleDeleteSeat(row) {
      this.deleteSeatIds = [];
      this.deleteSeatIds = [row.id];
      this.$refs.svDialogHintRef.visible = true;
    },
    /**
     * @description 确定删除
     */
    confirmDeleteSeat() {
      this.deleteSeat();
    },
    /**
     * @description 批量删除
     */
    handleBatchDeleteSeat(ids) {
      this.deleteSeatIds = ids;
      this.deleteSeat();
    },
  },
};
</script>
<style lang="scss">
@import '../assets/css/adminSeatsManagement';
</style>
