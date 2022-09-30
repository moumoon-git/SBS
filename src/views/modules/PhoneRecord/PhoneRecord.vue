<!--
 * @Author: yanghaohao
 * @Date: 2021-01-12 15:18:50
 * @LastEditTime: 2021-01-27 14:03:32
 * @LastEditors: Please set LastEditors
 * @Description: 昌平区市民热线服务中心电话登记单
 * @FilePath: /SBS/src/views/modules/PhoneRecord/PhoneRecord.vue
-->
<template>
  <div>
    <template v-if="!is12345">
      <div v-show="isViewOrEdit">
        <router-view />
      </div>
      <div v-show="!isViewOrEdit">
        <sv-template
          ref="template"
          :table-request="tableRequest"
          :tree-setting="treeSetting"
          :search-setting="{
            width:'255px',
            placeholder:'请输入人员名称、电话关键字'
          }"
          title="电话记录"
          :import-data-config="{
            api: '/ottffemergency/ottffemergencyinfo/xlsInput'
          }"
          :export-select-config="{
            api: '/garbage/garbageSortPoint/xlsOutputSelect',
          }"
          :export-query-config="{
            api: '/garbage/garbageSortPoint/xlsOutputCondition',
            params: {
              status: tableRequest.params.status,
              emergencyType: tableRequest.params.emergencyType,
              workOrder: tableRequest.params.workOrder,
              delegating: tableRequest.params.delegating,
            },
          }"
          :download-template-config="{
            api: '/ottffemergency/ottffemergencyinfo/getTemplate'
          }"
          :delete-selected-config="{ api: '/ottffemergency/ottffemergencyinfo/delete' }"
          @tree-click="handleTreeClick"
          @tree-node-delete="deleteTreeNode"
          @refresh="getStatisticData"
        >
          <template #middle__operation__select>
            <sv-button @click="routeTo12345">
              12345统计
            </sv-button>
            <sv-select
              v-model="tableRequest.params.emergencyType"
              placeholder="请选择问题分类"
              :options="questionOptions"
              @change="getTableList"
            />
            <sv-select
              v-model="tableRequest.params.workOrder"
              placeholder="请选择工单分类"
              :options="workListOptions"
              @change="getTableList"
            />
            <sv-select
              v-model="tableRequest.params.status"
              placeholder="请选择办理状态"
              :options="statusOptions"
              @change="getTableList"
            />
          </template>
          <template #middle__statistics>
            <table :class="PhoneRecord.statistic_table">
              <span :class="PhoneRecord.statistic">
                <td :class="PhoneRecord.span_td">{{ statisticList.add }}</td>
                <tr :class="PhoneRecord.span_tr">
                  今日新增事项
                </tr></span>

              <span :class="PhoneRecord.span_line" />
              <span :class="PhoneRecord.statistic">
                <td :class="PhoneRecord.span_td">{{ statisticList.upcoming }}</td>
                <tr :class="PhoneRecord.span_tr">
                  待办事项
                </tr></span>

              <span :class="PhoneRecord.span_line" />
              <span :class="PhoneRecord.statistic">
                <td :class="PhoneRecord.span_td">{{ statisticList.processing }}</td>
                <tr :class="PhoneRecord.span_tr">
                  办理中事项
                </tr></span>

              <span :class="PhoneRecord.span_line" />
              <span :class="PhoneRecord.statistic">
                <td :class="PhoneRecord.span_td">{{ statisticList.finished }}</td>
                <tr :class="PhoneRecord.span_tr">
                  已办结事项
                </tr></span>
            </table>
          </template>
          <template #middle__table>
            <el-table-column
              prop="number"
              header-align="center"
              align="center"
              label="事件编号"
            />
            <el-table-column
              prop="title"
              header-align="center"
              align="center"
              label="事件标题"
            />
            <el-table-column
              prop="address"
              header-align="center"
              align="center"
              label="发生地址"
            />
            <el-table-column
              prop="emergencyTypeName"
              header-align="center"
              align="center"
              label="问题分类"
            />
            <el-table-column
              prop="workOrderName"
              header-align="center"
              align="center"
              label="工单分类"
            />
            <el-table-column
              prop="reflectedUnit"
              header-align="center"
              align="center"
              label="被反应单位"
            />
            <el-table-column
              prop="reportTime"
              header-align="center"
              align="center"
              label="接报时间"
            />
            <el-table-column
              prop="disposalPeriod"
              header-align="center"
              align="center"
              label="处理时限（天）"
            />
            <el-table-column
              prop="deadline"
              header-align="center"
              align="center"
              label="截止时间"
            />
            <el-table-column
              prop="statusName"
              header-align="center"
              align="center"
              label="办理状态"
            />
            <el-table-column
              header-align="center"
              align="center"
              width="150"
              label="操作"
            >
              <template slot-scope="scope">
                <sv-table-operation
                  :display="['view', 'edit', 'delete']"
                  @view="viewOrEditContent(scope.row.id,scope.row,'view')"
                  @edit="viewOrEditContent(scope.row.id,scope.row,'edit')"
                  @delete="
                    deleteIds = [scope.row.id];
                    $refs.delete_table.visible = true;
                  "
                />
              </template>
            </el-table-column>
          </template>
        </sv-template>
        <!-- 树的删除弹窗 -->
        <sv-dialog-hint
          ref="delete_hint"
          type="delete"
        />
        <!-- 表格数据的删除弹窗 -->
        <sv-dialog-hint
          ref="delete_table"
          type="delete"
          @confirm="batchDelete(deleteIds)"
        />
        <sv-dialog-hint
          ref="delete_fail"
          type="fail"
          text="删除失败"
        />
      </div>
    </template>
    <Emergency12345 v-else />
  </div>
</template>
<script>
import Emergency12345 from './Emergency12345/Emergency12345.vue';

export default {
  components: {
    Emergency12345,
  },
  data() {
    return {
      deleteIds: [],
      // 判断是查看还是编辑
      isViewOrEdit: false,
      // 统计数据
      statisticList: [],
      // 问题分类选项
      questionOptions: [],
      // 工单分类选项
      workListOptions: [],
      // 办理状态选项
      statusOptions: [],
      // 模板参数
      treeSetting: {
        api: '/ottffemergency/ottffemergencyinfogroup/list',
        edit: false,
      },
      tableRequest: {
        api: '/ottffemergency/ottffemergencyinfo/list',
        params: {
          status: '',
          emergencyType: '',
          workOrder: '',
          groupIds: [],
        },
      },
      // 12345要情页面
      is12345: false,
    };
  },
  watch: {
    $route: {
      handler(val) {
        if (val.path === '/phoneRecord-edit-or-view') {
          this.isViewOrEdit = true;
        } else {
          this.isViewOrEdit = false;
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.getTableList();
    this.getSelectType();
  },
  methods: {
    /**
     * @description: 点击编辑或查看图标后进行嵌套路由跳转进行相应操作
     * @param {Number} id 点击表格行的id
     * @param {Object} data 点击表格行的数据列表
     * @return {*}
     */
    viewOrEditContent(id, data, editOrView) {
      const status = editOrView === 'view' ? 'watch' : 'update';
      this.$router.push({
        path: '/phoneRecord-edit-or-view',
        query: {
          status,
          id,
          data,
          operationStatus: data.statusName,
        },
      });
    },
    /**
     * @description: 获取搜索条件的下拉框列表数据
     */
    getSelectType() {
      this.$http({
        url: this.$http.adornUrl(
          '/sys/sysdictionary/getSysDictionaryListByCode?code=ottff_work_order',
        ),
        method: 'get',
        params: this.$http.adornParams({
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.data.forEach((item) => {
            this.workListOptions.push({
              value: item.code,
              label: item.name,
            });
          });
        } else {
          this.$message.error(data.msg);
        }
      });
      this.$http({
        url: this.$http.adornUrl(
          '/sys/sysdictionary/getSysDictionaryListByCode?code=ottff_emergency_type',
        ),
        method: 'get',
        params: this.$http.adornParams({
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.data.forEach((item) => {
            this.questionOptions.push({
              value: item.code,
              label: item.name,
            });
          });
        } else {
          this.$message.error(data.msg);
        }
      });
      this.$http({
        url: this.$http.adornUrl(
          '/sys/sysdictionary/getSysDictionaryListByCode?code=ottff_status',
        ),
        method: 'get',
        params: this.$http.adornParams({
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.data.forEach((item) => {
            this.statusOptions.push({
              value: item.code,
              label: item.name,
            });
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description: 通过请求参数获取列表上方各种事项的数据
     * @param {Object} request 包含你请求列表的所有请求数据
     * @return {*}
     */
    getStatisticData(request) {
      this.$http({
        url: this.$http.adornUrl('/ottffemergency/ottffemergencyinfo/statistics'),
        method: 'post',
        data: this.$http.adornData({
          search: request.data.search,
          startTime: request.data.startTime,
          endTime: request.data.endTime,
          emergencyType: request.data.emergencyType,
          workOrder: request.data.workOrder,
          status: request.data.status,
          groupIds: request.data.groupIds,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.statisticList = data.data;
        } else {
          this.statisticList = [];
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description: 根据问题分类，工单分类，办理状态，日期以及自定义搜索内容进行更新查询
     */
    getTableList() {
      this.$refs.template.getTableList(this.tableRequest);
    },
    /**
     * @description: 点击树节点获取节点结构展示其分组下的表单数据
     * @param {Object} obj 点击树节点的数据结构
     */
    handleTreeClick(obj) {
      this.tableRequest.params.groupIds = [];
      if (obj === null) {
        this.currentNode = '';
      } else {
        this.currentNode = obj;
        this.getTreeChildren(obj);
      }
      this.$refs.template.getTableList(this.tableRequest);
    },
    /**
     * @description: 判断传进的数据是否包含子节点，并将所有节点的id保存为数组
     * @param {Obiect} obj 点击树节点的数据结构
     */
    getTreeChildren(obj) {
      this.tableRequest.params.groupIds.push(obj.id);
      if (obj.children !== null) {
        obj.children.forEach((item) => {
          this.getTreeChildren(item);
        });
      }
    },
    /**
     * @description:删除选中的表格的行数据
     * @param {传入当前行id}
     * @return {type}
     */
    batchDelete(ids) {
      const request = {
        method: 'post',
        url: '/ottffemergency/ottffemergencyinfo/delete',
        baseURL: window.SITE_CONFIG.baseUrl,
        data: {
          ids,
        },
      };
      this.$http(request)
        .then((response) => {
          if (response.data.code === 0) {
            // 提交成功后，刷新表格
            this.$refs.template.getTableList(this.tableRequest);
          } else {
            window.console.log('删除失败！错误信息：【\n', response, '\n】');
            this.$refs.delete_fail.visible = true;
            this.$refs.delete_fail.supplementText = `错误代码：${response.data.code}`;
          }
        })
        .catch((error) => {
          window.console.log('删除失败！错误信息：【\n', error, '\n】');
          this.$refs.delete_fail.visible = true;
          this.$refs.delete_fail.supplementText = error;
        });
    },
    /**
     * @description: 删除对应的树节点，并限制树节点有数据时无法删除
     */
    deleteTreeNode() {
      if (this.$refs.tamplate.tableList.length > 0) {
        this.$refs.delete_hint.visible = true;
        this.$refs.delete_hint.supplementText = '请先删除分组内的表格数据！';
        return;
      }
      this.$refs.delete_hint.visible = true;
      this.$http({
        url: this.$http.adornUrl(''),
        method: 'post',
        data: this.$http.adornData({
          id: this.currentNode.id,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '删除成功',
            type: 'success',
          });
          this.$refs.template.getTableList(this.tableRequest);
        } else {
          this.$message({
            message: `${data.msg}`,
            type: 'error',
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    /**
     * @description 跳转到12345页面
     */
    routeTo12345() {
      this.is12345 = true;
    },
  },
};
</script>

<style lang="scss" module="PhoneRecord">
// 统计数据样式
.statistic_table {
  display: flex;
  justify-content: space-around;
  .statistic {
    font-size: 14px;
    color: #333333;
    padding-left: 70px;
    font-weight: bold;
    display: inline-block;
    height: 50px;
    width: 200px;
    .span_td {
      font-size: 13px;
      color: #333333;
      text-align: center;
    }
    .span_tr {
      color: #999999;
    }
  }
  .span_line {
    display: block;
    width: 2px;
    height: 20px;
    margin: 9px 5px;
    background-color: rgba(0, 0, 0, 0.05);
  }
}
</style>
