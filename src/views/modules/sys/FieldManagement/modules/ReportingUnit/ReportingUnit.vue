<template>
  <div :class="$style.container">
    <sv-template
      ref="template"
      title="报告单位"
      :date-select="false"
      :overload="overload"
    >
      <template #left__container><span /></template>
      <template #middle__operation>
        <sv-input-search
          v-model="keyword"
          width="250px"
          placeholder="请输入报告单位名称"
          @change="filterTableList"
        />
        <sv-button
          type="primary"
          @click="openAddOrEditDialog('save')"
        >
          新增
        </sv-button>
      </template>
      <template #middle__table>
        <el-table-column
          header-align="center"
          align="left"
          label="报告单位名称"
          prop="vcName"
        >
          <template slot-scope="{ row }">
            <span
              v-if="row.parentId === 0"
              :class="$style.iconFolder"
            />
            <span>{{ row.vcName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="报告单位负责人"
        >
          <template slot-scope="scope">
            {{
              (scope.row.contactors && scope.row.contactors[0] && scope.row.contactors[0].name)
                || '-'
            }}
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="负责人单位"
        >
          <template slot-scope="scope">
            {{
              (scope.row.contactors && scope.row.contactors[0] && scope.row.contactors[0].workUnit)
                || '-'
            }}
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="负责人职务"
        >
          <template slot-scope="scope">
            {{
              (scope.row.contactors && scope.row.contactors[0] && scope.row.contactors[0].position)
                || '-'
            }}
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="手机号码"
        >
          <template slot-scope="scope">
            {{
              (scope.row.contactors && scope.row.contactors[0] && scope.row.contactors[0].mobile1)
                || '-'
            }}
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="办公电话"
          prop="remark"
        >
          <template slot-scope="scope">
            {{
              (scope.row.contactors && scope.row.contactors[0] && scope.row.contactors[0].officeTel)
                || '-'
            }}
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="120px"
          label="操作"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="['add', 'edit', 'delete']"
              @add="openAddOrEditDialog('save', { parentId: scope.row.id })"
              @edit="openAddOrEditDialog('update', scope.row)"
              @delete="handleDelete(scope.row.id)"
            />
          </template>
        </el-table-column>
      </template>
      <template #middle__footer><span /></template>
    </sv-template>

    <!-- 新增/编辑弹窗 -->
    <ReportingUnitAddOrEditDialog
      ref="ReportingUnitAddOrEditDialogRef"
      :parent-tree="tableList"
      @refresh="handleRefresh"
    />
    <!-- 确认删除弹窗 -->
    <sv-dialog-hint
      ref="deleteHint"
      type="delete"
      supplement="是否删除所选分类？"
      @confirm="doDelete"
    />
  </div>
</template>

<script>
import ReportingUnitAddOrEditDialog from './modules/ReportingUnitAddOrEditDialog.vue';

export default {
  name: 'ReportingUnit',
  components: {
    ReportingUnitAddOrEditDialog,
  },
  data() {
    return {
      keyword: '',
      toBeDeletedId: -1,
      tableList: [],
      overload: {
        getTableList: this.getTableList,
      },
    };
  },
  methods: {
    /**
     * 递归遍历所有节点，只保留符合条件的项
     *
     * @param list 数组
     */
    filterChildren(list) {
      const res = [];
      list.forEach((item) => {
        if (item.children && item.children.length) {
          item.children = this.filterChildren(item.children);
        }
        if (item.children && item.children.length) {
          res.push(item);
        } else {
          if (item.vcName && item.vcName.includes(this.keyword)) {
            res.push(item);
          }
        }
      });
      return res;
    },
    /**
     * 筛选表格列表
     */
    filterTableList() {
      const tableList = JSON.parse(JSON.stringify(this.tableList));
      this.$refs.template.tableList = this.filterChildren(tableList);
    },
    /**
     * 拦截请求表格列表
     *
     * @param tableRequest 默认请求参数
     * @param ctx sv-template 的实例
     */
    getTableList(tableRequest, ctx) {
      ctx.tableLoading = true;
      const request = {
        method: 'get',
        url: `${window.g.ApiUrl}/eos/system/unit/treeList`,
      };
      this.$http(request).then((response) => {
        if (response.data.errorcode === 0) {
          ctx.tableList = response.data.list || [];
          this.tableList = ctx.tableList;
        }
      }).finally(() => {
        ctx.tableLoading = false;
      });
    },
    /**
     * 打开新增/编辑弹窗
     *
     * @param {String} type 类型
     * @param {Object} data 事件项
     */
    openAddOrEditDialog(type, data) {
      this.$refs.ReportingUnitAddOrEditDialogRef.open(type, data);
    },
    /**
     * 刷新表格
     */
    handleRefresh() {
      this.$refs.template.getTableList();
    },
    /**
     * 删除表格项
     *
     * @param {Number} id 表各项 id
     */
    handleDelete(id) {
      this.toBeDeletedId = id;
      this.$refs.deleteHint.visible = true;
    },
    doDelete() {
      const request = {
        method: 'post',
        url: `${window.g.ApiUrl}/eos/system/unit/delete`,
        data: [this.toBeDeletedId],
      };
      this.$refs.template.tableLoading = true;
      this.$http(request).then((response) => {
        if (response.data.errorcode === 0) {
          this.$message.success('删除成功');
          this.handleRefresh();
        } else {
          this.$message.error(`删除失败，错误代码${response.data.errorcode}，错误信息：${response.data.msg}`);
          this.$refs.template.tableLoading = false;
        }
      }).catch((error) => {
        this.$message.error(`删除失败，错误信息：${error}`);
        this.$refs.template.tableLoading = false;
      });
    },
  },
};
</script>

<style lang="scss" module>
.container {
  :global(.middle__footer) {
    display: none !important;
  }
  .iconFolder {
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: middle;
    background: no-repeat center/100% 100% url(../../assets/imgs/icon-folder.svg);
  }
}
</style>
