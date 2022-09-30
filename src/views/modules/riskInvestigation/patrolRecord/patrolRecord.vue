<template>
  <div class="patrolRecord">
    <sv-template
      ref="template"
      :tree-setting="treeSetting"
      title="巡查记录"
      :date-select="true"
      :table-request="tableRequest"
      :export-select-config="{
        api: '/investigation/instanceInfor/xlsOutputSelect', // 选择数据导出
        params: {},
      }"
      :export-query-config="{
        api: '/investigation/instanceInfor/xlsOutputCondition',// 选择分组导出
        params: {},
      }"
      @tree-click="handleNodeClick"
    >
      <template #middle__operation__select>
        <sv-select
          v-model="dataForm.status"
          clearable
          placeholder="请选择巡查状态"
          :options="stateOptions"
          @change="getDataList()"
        />
        <sv-select
          v-model="dataForm.period"
          clearable
          placeholder="请选择巡查周期"
          :options="circleOptions"
          @change="getDataList()"
        />
        <sv-select
          v-model="dataForm.resultStatus"
          clearable
          placeholder="请选择巡查结果"
          :options="resultOptions"
          @change="getDataList()"
        />
      </template>
      <template #middle__table>
        <el-table-column
          v-if="exportVisible"
          type="selection"
          header-align="left"
          align="center"
          width="50"
        />
        <el-table-column
          header-align="center"
          align="center"
          label="任务名称"
        >
          <template slot-scope="scope">
            <div style="display: flex; flex-direction: column">
              <div v-if="scope.row.unusual > 0" class="patrolRecord__unusual">
                {{ scope.row.taskEntity.name }}
              </div>
              <div v-if="scope.row.unusual > 0" class="patrolRecord__unusual">
                出现异常
              </div>
              <span v-else>{{ scope.row.taskEntity.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="巡查区域">
          <template slot-scope="scope">
            <span>{{ scope.row.taskEntity.groupIdName }}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="巡查地点">
          <template slot-scope="scope">
            <span>{{ scope.row.taskEntity.place}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="left" label="巡查说明">
          <template slot-scope="scope">
            <div>{{ scope.row.taskEntity.remark }}</div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="检查周期"
          width="90px"
        >
          <template slot-scope="scope">
            <span>{{
              circleOptions.find(
                item => item.value == scope.row.taskEntity.period
              ).label
            }}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="巡查人">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">上次</div>
            <span>{{ scope.row.patrolContactorString }}</span>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="巡查时间"
          width="200px"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.status == 0">上次</div>
            <span>{{ scope.row.gmtModified }}</span>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="巡查状态"
          width="120px"
        >
          <template slot-scope="scope">
            <!-- <span>{{ (stateOptions.find(item => item.value == scope.row.status)) }}</span> -->
            <span v-if="scope.row.status == '0'">未巡查</span>
            <span v-if="scope.row.status == '1'">已巡查</span>
            <span v-if="scope.row.status == '-1'">待巡查</span>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="巡查结果"
        >
          <template slot-scope="scope">
            <span>
              <img
                class="patrolRecord__img"
                :src="require('@/assets/img/result-complete.svg')"
              >
              <span style="padding: 0 5px">{{ scope.row.usual || 0 }}</span>
            </span>
            <span style="margin-left: 10px">
              <img
                class="patrolRecord__img"
                :src="require('@/assets/img/result-warning.svg')"
              >
              <span style="padding: 0 5px">{{ scope.row.unusual || 0 }}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="异常率"
          width="80px"
        >
          <template slot-scope="scope">
            <span>{{
              `${
                scope.row.usual + scope.row.unusual == 0
                  ? "0"
                  : Math.round(
                    (scope.row.unusual /
                      (scope.row.usual + scope.row.unusual)) *
                      10000
                  ) / 100
              }%`
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="操作"
          width="80px"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="['view']"
              @view="showDetail(scope.row.id)"
            />
          </template>
        </el-table-column>
      </template>
    </sv-template>
    <patrol-report ref="patrolReport"></patrol-report>
  </div>
</template>

<script>
import patrolTree from "./patrolComponents/patrol-tree";
import patrolReport from "./patrolComponents/patrol-report";
import { platformTreeDataTranslate } from "@/utils";
import Cookies from "js-cookie";
const token = document.cookie;
const httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  data() {
    return {
      // fullscreenLoading: false,
      // 获取到的token
      documenttoken: `${httpaddress}/mail/mailgroup/xlsInput?token=${this.$cookie.get(
        'token'
      )}`,
      // documenttoken: `${httpaddress}/mail/mailgroup/loading?${this.$cookie.get('token')}`,
      treeIds: [],
      // 巡查状态
      stateOptions: [
        {
          value: '',
          label: '全部状态',
        },
        {
          value: '0',
          label: '未巡查',
        },
        {
          value: '1',
          label: '已巡查',
        },
        {
          value: '-1',
          label: '待巡查',
        },
      ],
      // 状态名称
      stateName: '',

      // 巡查周期
      circleOptions: [
        {
          value: '',
          label: '全部周期',
        },
        {
          value: '1',
          label: '每日',
        },
        {
          value: '2',
          label: '每周',
        },
        {
          value: '3',
          label: '每月',
        },
        {
          value: '4',
          label: '每年',
        },
      ],

      // 巡查结果
      resultOptions: [
        {
          value: '',
          label: '全部结果',
        },
        {
          value: '1',
          label: '正常',
        },
        {
          value: '2',
          label: '异常',
        },
      ],

      recordTime: '', // 查询时间范围
      startTime: '',
      endTime: '',

      // 搜索树
      searchTreeName: '',
      dataForm: {
        search: '',
        period: '',
        status: '',
        resultStatus: '',
      },
      treeId: '',
      taskList: [],
      taskProps: {
        label: 'name',
        children: 'children',
      },
      buttonVisible: true,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      // 树状新增显示
      groupTreeCrudVisible: false,
      // 树形勾选框选中的id
      checkedIds: [],
      checkedNodes: [],
      Treeexpansion: false,
      exportVisible: false,
      // 列表复选框选中的id
      listId: [],
      // 使用模板的一些参数配置，具体看文档
      treeSetting: {
        tab: [],
        api: '/investigation/investigationTaskGroup/listTree', // 查找树接口
        edit: false,
        params: {},
      },
      tableRequest: {
        api: '/investigation/instanceInfor/list',
        params: {
          groupIds: [],
          period: '', // 检测周期
          resultStatus: '', // 巡查结果
          status: '', // 巡查状态
        },
      },
    };
  },
  components: {
    'patrol-tree': patrolTree,
    'patrol-report': patrolReport
    // AddOrUpdate,
    // TaskTree,
    // TreeAddOrUpdate
  },
  watch: {
    recordTime: function(newValue, oldValue) {
      if (newValue) {
        this.startTime =
          newValue[0].toLocaleDateString().replace(/\//gi, '-') + ' 00:00:00';
        this.endTime =
          newValue[1].toLocaleDateString().replace(/\//gi, '-') + ' 23:59:59';
      } else {
        this.startTime = '';
        this.endTime = '';
      }
    }
  },

  mounted() {
    this.getTreeList();
    this.getDataList();
  },
  methods: {
    // 表头背景填充
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#F0F5FF';
        //return 'background: #0091FF'
      } else {
        return '';
      }
    },

    // 高亮未巡查行
    addClass({ row, rowIndex }) {
      // console.log(row.patrolState)
      if (row.status == 0) {
        return 'newRow';
      } else return '';
    },

    // 获取树形数据
    getTreeList() {
      this.$http({
        url: this.$http.adornUrl(
          '/investigation/investigationTaskGroup/listTree',
        ),
        method: 'get',
        params: this.$http.adornParams({
          name: this.searchTreeName,
        }),
      }).then(({ data }) => {
        console.log('111111111111', data);
        if (data && data.code === 0) {
          this.taskList = [
            {
              id: 0,
              name: '全部',
              remark: '全部',
              children: null,
              disabled: false,
            },
            ...data.data,
          ];
          // this.taskList = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 获取数据列表
    getDataList() {
      this.tableRequest.params.period = this.dataForm.period;
      this.tableRequest.params.status = this.dataForm.status;
      this.tableRequest.params.resultStatus = this.dataForm.resultStatus;
      this.tableRequest.params.groupIds = this.treeIds;
      this.$refs.template.getTableList(this.tableRequest);
    },
    getChildren(data) {
      console.log('222222222222222children', data);
      if (data != null && data.length > 0) {
        data.forEach((d) => {
          this.treeIds.push(d.id);
          if (d.children != null && d.children.length > 0) {
            this.getChildren(d.children);
          }
        });
      }
    },
    handleNodeClick(obj) {
      console.log(obj);
      if (!obj) {
        this.getAll();
        return;
      }
      this.treeIds = [];
      this.pageIndex = 1;
      this.treeIds[0] = obj.id;
      if (obj.children != null && obj.children.length > 0) {
        this.getChildren(obj.children);
      }
      this.getDataList();
    },
    getAll() {
      this.pageIndex = 1;
      this.treeIds = [];
      this.getDataList();
      this.getTreeList();
    },
    // 查看巡查记录
    showDetail(id) {
      this.$refs.patrolReport.init(id);
      this.$refs.patrolReport.showPatrolReport = true;
    },
    // 多选
    selectionChangeHandle(val) {
      // this.dataListSelections = val;
      this.listId = val.map((item) => item.id);
      this.dataListSelections = val.map((item) => item.taskId);
    },
    // 新增 / 修改
    addOrUpdateHandle(id, type) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, type);
      });
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.roleId;
          });
      this.$confirm(
        `确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(''),
            method: 'post',
            data: this.$http.adornData(ids, false),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                },
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="less">
.site-content > .el-tabs > .el-tabs__content {
  padding-top: 0px;
}
.newRow {
  opacity: 0.49 !important;
}
.patrolRecord {
  display: flex;
  background: #f4f4f4;
  // position: absolute;
  // left: 10px;
  // top: 10px;
  height: calc(100vh - 112px);
  .patrolRecord__img {
    width: 24px;
    height: 24px;
  }

  .patrolRecord__unusual {
    width: 100px;
    min-height: 20px;
    font-size: 12px;
    // background-color: red;
    color: #f66e6e;
    line-height: 20px;
    border-radius: 4px;
    align-self: center;
  }
  //弹窗样式
  .el-form-item.is-success .el-input__inner,
  .el-form-item.is-success .el-input__inner:focus,
  .el-form-item.is-success .el-textarea__inner,
  .el-form-item.is-success .el-textarea__inner:focus {
    border: 1px solid #dcdfe6;
  }
  .save {
    color: white !important;
    background-color: #0091ff !important;
    border-color: #0091ff !important;
  }
  //按钮样式
  .el-button.el-button--medium:hover {
    // color: #a3a3a3 !important;
    border-color: rgba(71, 157, 255, 1) !important;
    // background: transparent !important;
  }
  .el-form {
    .el-button--danger {
      background: white;
      border: 1px solid #d3d7db;
      border-radius: 5px;
      font-size: 12px;
      color: #a3a3a3;
      margin-left: 20px;
    }
    .el-button--primary {
      width: 88px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(211, 215, 219, 1);
      border-radius: 5px;
      font-size: 12px;
      color: rgba(162, 162, 162, 1);
    }
    .el-button--default {
      background: linear-gradient(
        180deg,
        rgba(71, 175, 255, 1),
        rgba(71, 157, 255, 1)
      );
      border-radius: 3px;
      color: white;
      width: 88px;
    }
  }

  //修改，删除按钮样式
  .cell {
    .el-button--text:first-child {
      background-color: transparent;
      border: none;
      font-size: 12px;
      color: rgba(118, 214, 114, 1);
    }
    .el-button--text:last-child {
      background-color: transparent;
      border: none;
      font-size: 12px;
      color: rgba(230, 115, 128, 1);
    }
  }
}
</style>
