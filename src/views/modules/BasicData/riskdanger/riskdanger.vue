<template>
  <!-- 风险隐患 -->
  <div class="mod-config">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="pageIndex=1;getDataList()"
    >
      <el-form-item>
        <el-input
          v-model="dataForm.name"
          style="width: 200px"
          placeholder="输入隐患名称搜索"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          v-if="isAuth('risk:riskdanger:save') && isPlatformRoot"
          style="background: #409eff; color: #fff; margin-left: initial"
          type="primary"
          size="small"
          @click="addOrUpdateHandle()"
        >
          新增
        </el-button>
        <el-button
          style="background: #409eff; color: #fff; margin-left: initial"
          type="primary"
          size="small"
          @click="pageIndex=1;getDataList()"
        >
          查询
        </el-button>
      
        <el-button
          v-if="isAuth('risk:riskdanger:delete') && isPlatformRoot"
          style="background: #409eff; color: #fff; margin-left: initial"
          :disabled="dataListSelections.length <= 0"
          type="primary"
          size="small"
          @click="deleteHandle()"
        >
          批量删除
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      style="width: 100%"
      @selection-change="selectionChangeHandle"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      />
      <el-table-column
        prop="deviceName"
        header-align="center"
        align="center"
        label="烟感名称"
      />
      <el-table-column
        width="200"
        prop="deviceId"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="编号"
      />
      <el-table-column
        prop="deviceStatus"
        header-align="center"
        align="center"
        label="状态"
      >
        <template slot-scope="scope">
          <p v-if="scope.row.deviceStatus == 0">异常</p>
          <p v-if="scope.row.deviceStatus == 1">正常</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="location"
        header-align="center"
        align="center"
        label="地址"
      />
      <!--<el-table-column prop="rectificationTime" header-align="center" align="center" label="整改时间"></el-table-column>-->
      <el-table-column header-align="center" align="center" label="操作">
        <template slot-scope="scope">
          <sv-table-operation
            :display="isPlatformRoot? [
                'view',
                'edit',
                'delete'
              ]: ['view']"
            @view="viewHandle(scope.row.id)"
            @edit="addOrUpdateHandle(scope.row.id)"
            @delete="deleteIds = scope.row.id;
                $refs.delete_hint.visible = true;"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    />
    <!-- 查看详情弹窗 -->
    <RiskDangerSeeDialog ref="RiskDangerSeeDialog" />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    />
    <Resource-importError
      ref="resourceImportError"
    />

    <sv-dialog-hint
      ref="delete_hint"
      type="delete"
      @confirm="deleteHandle(deleteIds)"
    />
  </div>
</template>

<script>
import AddOrUpdate from './riskdanger-add-or-update';
// 查看详情弹窗
import RiskDangerSeeDialog from "./RiskDangerSeeDialog/RiskDangerSeeDialog.vue";
import ResourceImportError from '../../resource/equipmentImportError.vue';
export default {
  components: {
    AddOrUpdate,
    RiskDangerSeeDialog,
    ResourceImportError,
  },
  data() {
    return {
      isPlatformRoot: true,
      platformId: '',
      // 可控程度:可控、基本可控、较难控制、基本失控
      controllabilityData: [
        { value: '1', label: '可控' },
        { value: '2', label: '基本可控' },
        { value: '3', label: '较难控制' },
        { value: '4', label: '基本失控' },
      ],
      // 隐患类型:卡口管理、人员管理、预警默认类型、巡检事件类型、专题报告、专项整治行动。
      dataForm: {
        name: '',
        rectificationType: '',
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      deleteIds:"",
    };
  },
  created() {
    this.getDataList();
  },

  methods: {
    /**
     * @description 查看详情
     */
    viewHandle(id) {
      this.$refs.RiskDangerSeeDialog.init(id);
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl('/hk/device/listByPage'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          size: this.pageSize,
          keyword: this.dataForm.name,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // data.page.list.forEach((item, index, arr) => {
          //   arr[index]['deadlineFor'] = item.deadlineForRectification.substring(0, item.deadlineForRectification.indexOf('T'))
          //   arr[index]['controllabilityName'] =
          //     this.controllabilityData.find(items => {
          //       return items.value == item.controllability
          //     }).label || ''
          // })
          this.dataList = data.data.list;
          this.totalPage = data.data.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val.map((item) => item.id);
      // console.log(this.dataListSelections)
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    deleteHandle(id) {
      const ids = id ? [id] : this.dataListSelections;
        this.$http({
          url: this.$http.adornUrl('/hk/device/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
          if (data && data.code === 0) {
              this.$message({
                  message: '操作成功',
                  type: 'success',
            });
            this.pageIndex = 1;
            this.getDataList();
          } else {
            this.$message.error(data.msg);
          }
        });
    },
  },
};
</script>
