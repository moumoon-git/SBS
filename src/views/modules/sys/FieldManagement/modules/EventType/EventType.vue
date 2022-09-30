<template>
  <div :class="$style.container">
    <sv-template
      ref="template"
      title="事件类型"
      :date-select="false"
      :overload="overload"
    >
      <template #left__container><span /></template>
      <template #middle__operation>
        <sv-input-search
          v-model="keyword"
          width="250px"
          placeholder="请输入分类名称、分类编码"
          @change="filterTableList"
        />
        <sv-button
          type="primary"
          @click="openAddOrEditDialog('add')"
        >
          新增
        </sv-button>
      </template>
      <template #middle__table>
        <el-table-column
          header-align="center"
          align="left"
          label="分类名称"
          prop="name"
        >
          <template slot-scope="{ row }">
            <span
              v-if="row.isTopest"
              :class="$style.iconFolder"
            />
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          label="分类级别"
          prop="level"
        />
        <el-table-column
          header-align="center"
          align="center"
          label="类别编码"
          prop="code"
        />
        <el-table-column
          header-align="center"
          align="center"
          label="所属领域"
          prop="domain"
        />
        <el-table-column
          header-align="center"
          align="center"
          label="备注"
          prop="remark"
        />
        <el-table-column
          header-align="center"
          align="center"
          width="120px"
          label="操作"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="['add', 'edit', 'delete']"
              @add="openAddOrEditDialog('add', { pid: scope.row.id })"
              @edit="openAddOrEditDialog('update', scope.row)"
              @delete="handleDelete(scope.row.id)"
            />
          </template>
        </el-table-column>
      </template>
      <template #middle__footer><span /></template>
    </sv-template>

    <!-- 新增/编辑弹窗 -->
    <EventTypeAddOrEditDialog
      ref="EventTypeAddOrEditDialogRef"
      :parent-tree="tableList"
      @refresh="handleRefresh"
    />
    <!-- 确认删除弹窗 -->
    <sv-dialog-hint
      ref="deleteHint"
      type="delete"
      text="删除分类后，该分类所有下级分类将同时删除？"
      supplement="是否删除所选分类？"
      @confirm="doDelete"
    />
  </div>
</template>

<script>
import EventTypeAddOrEditDialog from './modules/EventTypeAddOrEditDialog.vue';

export default {
  name: 'EventType',
  components: {
    EventTypeAddOrEditDialog,
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
          if (
            (item.name && item.name.includes(this.keyword))
            || (item.code && item.code.includes(this.keyword))
          ) {
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
        method: 'post',
        url: `${window.SITE_CONFIG.event}/eos/caseClass/getTree`,
      };
      this.$http(request).then((response) => {
        if (response.data.errorcode === 0) {
          ctx.tableList = response.data.data || [];
          const setPid = (parent, children) => {
            if (children && children.length) {
              children.forEach((child) => {
                child.pid = parent.id;
                if (child.children && child.children.length) {
                  setPid(child, child.children);
                }
              });
            }
          };
          ctx.tableList.forEach((i) => {
            i.isTopest = true;
            i.pid = -1;
            setPid(i, i.children);
          });
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
      this.$refs.EventTypeAddOrEditDialogRef.open(type, data);
    },
    /**
     * 刷新表格
     */
    handleRefresh() {
      this.keyword = '';
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
        url: `${window.SITE_CONFIG.event}/eos/caseClass/delete`,
        data: {
          id: this.toBeDeletedId,
        },
      };
      this.$refs.template.tableLoading = true;
      this.$http(request).then((response) => {
        if (response.data.errorcode === 0) {
          this.$message.success('删除成功');
          this.handleRefresh();
        } else {
          this.$message.error(`删除失败，错误代码${response.data.errorcode}，错误信息：${response.data.msg}`);
        }
      }).catch((error) => {
        this.$message.error(`删除失败，错误信息：${error}`);
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
