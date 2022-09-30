/**
 * @author tanjinfeng
 * @date 2020-09-23
 * @desc 分类点管理页面
 */
<template>
  <div class="classification-site">
    <sv-template
      ref="template"
      :treeSetting="treeSetting"
      @tree-click="handleTreeClick"
      title="分类点管理"
      :dateSelect="false"
      :searchSetting="{
        width: '280px',
        placeholder: '请输入分类点名称、小区名称关键字',
      }"
      :exportSelectConfig="{
        api: '/garbage/garbageSortPoint/xlsOutputSelect',
        params: {},
      }"
      :exportQueryConfig="{
        api: '/garbage/garbageSortPoint/xlsOutputCondition',
        params: {
          townId: tableRequest.params.townId,
          villageType: tableRequest.params.villageType,
          launchType: tableRequest.params.launchType,
          delegating: tableRequest.params.delegating,
        },
      }"
      :exportQrcodeConfig="{ api: '/garbage/garbageSortPoint/getAllqrCode' }"
      :importDataConfig="{ api: '/garbage/garbageSortPoint/xlsInput' }"
      :downloadTemplateConfig="{ api: '/garbage/garbageSortPoint/getTemplate' }"
      :deleteSelectedConfig="{ api: '/garbage/garbageSortPoint/delete' }"
      :tableRequest="tableRequest"
    >
      <template #middle__operation__select>
        <sv-select
          v-model="tableRequest.params.townId"
          placeholder="选择社区"
          :options="communityListOptions"
          @change="getTableList"
        />
        <sv-select
          v-model="tableRequest.params.villageType"
          placeholder="选择小区性质"
          width="140px"
          :options="communityPropertyOptions"
          @change="getTableList"
        />
        <sv-select
          v-model="tableRequest.params.launchType"
          placeholder="选择投放点模式"
          :options="deliveryPointModeOptions"
          @change="getTableList"
        />
        <sv-select
          v-model="tableRequest.params.delegating"
          placeholder="选择守桶人员委派方"
          width="180px"
          :options="delegationOptions"
          @change="getTableList"
        />
      </template>
      <template #middle__operation__button>
        <sv-button type="primary" @click="openAddOrEditDialog('add')"
          >新增分类点</sv-button
        >
      </template>
      <template #middle__table>
        <el-table-column
          header-align="center"
          align="center"
          label="分类点名称"
        >
          <template slot-scope="scope">
            <sv-table-tooltip :content="scope.row.name" />
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="所属社区">
          <template slot-scope="scope">
            {{ translateCommunityIdToName(scope.row.townId) }}
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="城中村/小区名"
        >
          <template slot-scope="scope">
            <sv-table-tooltip :content="scope.row.village" />
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="小区性质">
          <template slot-scope="scope">
            <span v-if="scope.row.villageType == '1'">物业小区</span>
            <span v-if="scope.row.villageType == '2'">非物业小区</span>
            <span v-if="scope.row.villageType == '3'">商城投放点</span>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="投放点模式"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.launchType == '1'">定时</span>
            <span v-if="scope.row.launchType == '2'">误时</span>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="守桶人员委派方"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.delegating == '1'">物业</span>
            <span v-if="scope.row.delegating == '2'">环卫</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="状态">
          <template slot-scope="scope">
            <span class="icon" v-if="scope.row.status == '1'">正常</span>
            <span class="icon yellow" v-if="scope.row.status == '2'">黄牌</span>
            <span class="icon red" v-if="scope.row.status == '3'">红牌</span>
            <span class="icon grey" v-if="scope.row.status == '4'">拒收</span>
            <span class="icon blue" v-if="scope.row.status == '5'"
              >责令整改</span
            >
            <span class="icon pink" v-if="scope.row.status == '6'"
              >行政处罚</span
            >
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="操作"
          width="170px"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="['monitor', 'qrcode', 'view', 'edit', 'delete']"
              @monitor="openMonitor(scope.row)"
              @qrcode="openQrcodeDialog(scope.row)"
              @view="openViewDetailDialog(scope.row)"
              @edit="openAddOrEditDialog('edit', scope.row.id)"
              @delete="
                deleteIds = [scope.row.id];
                $refs.delete_hint.visible = true;
              "
            ></sv-table-operation>
          </template>
        </el-table-column>
      </template>
    </sv-template>
    <!-- 新增/编辑弹窗 -->
    <AddOrEditDialog
      ref="AddOrEditDialog"
      :communityListOptions="communityListOptions"
      :communityPropertyOptions="communityPropertyOptions"
      @refresh="$refs.template.getTableList(tableRequest)"
    />
    <!-- 二维码弹窗 -->
    <QrcodeDialog
      ref="QrcodeDialog"
      :api="[
        '/garbage/garbageSortPoint/info',
        '/garbage/garbageSortPoint/output-sortUrCode',
      ]"
    />
    <!-- 查看详情弹窗 -->
    <ViewDetailDialog
      ref="ViewDetailDialog"
      :communityList="communityListOptions"
    />
    <!-- 删除提示弹窗 -->
    <sv-dialog-hint
      ref="delete_hint"
      type="delete"
      @confirm="handleDelete(deleteIds)"
    />
    <sv-dialog-hint ref="delete_fail" type="fail" text="抱歉！删除失败" />
    <!-- 监控视频弹窗 -->
    <MonitorDialog ref="MonitorDialog" />
  </div>
</template>

<script>
// 新增、编辑弹窗
import AddOrEditDialog from "./AddOrEditDialog/AddOrEditDialog.vue";
// 二维码弹窗
import QrcodeDialog from "./QrcodeDialog/QrcodeDialog.vue";
// 查看详情弹窗
import ViewDetailDialog from "./ViewDetailDialog/ViewDetailDialog.vue";
// 监控视频弹窗
import MonitorDialog from "./MonitorDialog/MonitorDialog.vue";

export default {
  components: {
    AddOrEditDialog,
    QrcodeDialog,
    ViewDetailDialog,
    MonitorDialog,
  },
  data() {
    return {
      // 树形接口
      treeSetting: {
        api: "/garbage/garbageSortpointGroup/list",
        edit: {
          add: "/garbage/garbageSortpointGroup/save",
          update: "/garbage/garbageSortpointGroup/update",
          delete: "/garbage/garbageSortpointGroup/delete",
        },
      },
      // 表格数据接口
      tableRequest: {
        api: "/garbage/garbageSortPoint/list",
        params: {
          groupIds: [],
          townId: "",
          villageType: "",
          launchType: "",
          delegating: "",
        },
      },
      // 小区列表选项
      communityListOptions: [],
      // 选择小区性质选项
      communityPropertyOptions: [
        {
          label: "物业小区",
          value: "1",
        },
        {
          label: "非物业小区",
          value: "2",
        },
        {
          label: "商城投放点",
          value: "3",
        },
      ],
      // 选择投放点模式选项
      deliveryPointModeOptions: [
        {
          label: "定时",
          value: "1",
        },
        {
          label: "误时",
          value: "2",
        },
      ],
      // 选择守桶人员委派方
      delegationOptions: [
        {
          label: "物业",
          value: "1",
        },
        {
          label: "环卫",
          value: "2",
        },
      ],
      // 准备删除的数据的id数组
      deleteIds: [],
    };
  },
  methods: {
    test(sth) {
      console.log("test", sth);
    },
    /**
     * @method
     * @desc 获取小区列表
     */
    getCommunityList() {
      this.$http
        .get(`${window.SITE_CONFIG.baseUrl}/sys/systown/list`)
        .then((response) => {
          if (response.data.code === 0) {
            let options = [];
            response.data.list.forEach((item) => {
              options.push({
                label: item.townName,
                value: item.id,
              });
            });
            this.communityListOptions = options;
          } else {
            console.log(
              "获取小区列表数据失败！错误信息：【\n",
              response,
              "\n】"
            );
          }
        })
        .catch((error) => {
          console.log("获取小区列表数据失败！错误信息：【\n", error, "\n】");
        });
    },
    /**
     * @method
     * @desc 获取表格数据
     */
    getTableList() {
      this.$refs.template.getTableList(this.tableRequest);
    },
    /**
     * @method
     * @desc 点击树形，获取树的子孙节点
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
     * @method
     * @desc 点击树形，获取表格数据
     */
    handleTreeClick(data, tabIndex) {
      this.tableRequest.params.groupIds = [];
      if (data !== null) {
        this.getTreeChildren(data);
      } else {
        this.tableRequest.params.groupIds = [];
      }
      this.getTableList();
    },
    /**
     * @method
     * @desc 将后台获取的社区id转换成社区名
     * @param {Number, String} id 社区id
     * @return {String} 社区名
     */
    translateCommunityIdToName(id) {
      const communityName = this.communityListOptions.find(
        (item) => item.value == id
      );
      if (
        communityName &&
        communityName.label !== undefined &&
        communityName.label !== null
      ) {
        return communityName.label;
      }
    },
    /**
     * @method
     * @desc 打开监控视频弹窗
     */
    openMonitor(row) {
      let indexCode = "";
      if (
        row.indexCodeList &&
        row.indexCodeList.length &&
        row.indexCodeList[0]
      ) {
        indexCode = row.indexCodeList[0];
      } else {
        indexCode = row.indexCode.split(",")[0];
      }
      this.$refs.MonitorDialog.init(indexCode);
    },
    /**
     * @method
     * @desc 打开二维码弹窗
     * @param {Object} row 该行数据
     */
    openQrcodeDialog(row) {
      this.$refs.QrcodeDialog.init(row);
    },
    /**
     * @method
     * @desc 打开查看详情弹窗
     * @param {Object} row 表格该行的数据
     */
    openViewDetailDialog(row) {
      this.$refs.ViewDetailDialog.init(row.id);
    },
    /**
     * @method
     * @desc 打开新增/编辑分类点弹窗
     * @param {String} type 弹窗类型：add新增、edit编辑
     * @param {Object} id 编辑时该行的数据的id
     */
    openAddOrEditDialog(type, id) {
      this.$refs.AddOrEditDialog.init(type, id);
    },
    /**
     * @method
     * @desc 删除数据
     * @param 需要删除的数据的id数组
     */
    handleDelete(ids) {
      const request = {
        method: "post",
        url: "/garbage/garbageSortPoint/delete",
        baseURL: window.SITE_CONFIG.baseUrl,
        data: {
          ids,
        },
      };
      this.$http(request)
        .then((response) => {
          if (response.data.code == 0) {
            // 提交成功后，刷新表格
            this.$refs.template.getTableList(this.tableRequest);
          } else {
            console.log("删除失败！错误信息：【\n", response, "\n】");
            this.$refs.delete_fail.visible = true;
            this.$refs.delete_fail.supplementText = `错误代码：${response.data.code}`;
          }
        })
        .catch((error) => {
          console.log("删除失败！错误信息：【\n", error, "\n】");
          this.$refs.delete_fail.visible = true;
          this.$refs.delete_fail.supplementText = error;
        });
    },
  },
  mounted() {
    this.getCommunityList();
  },
};
</script>

<style lang="scss">
.classification-site {
  /deep/ .icon {
    font-size: 12px;
    color: #16c88b;
    background: #e8f9f4;
    border-radius: 5px;
    padding: 2px 10px;
    user-select: none;
    &.yellow {
      color: #f8b10c;
      background: #fff8ea;
    }
    &.red {
      color: #f94e36;
      background: #ffefed;
    }
    &.grey {
      color: #000000;
      background: #e6e6e6;
    }
    &.blue {
      color: #368bf9;
      background: #ecf5fc;
    }
    &.pink {
      color: #ff8171;
      background: #ffffff;
      border: 1px solid #ff8171;
    }
  }
}
</style>