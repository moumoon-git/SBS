/**
 * @description 新字典表
 * @date 2021-03-02
 * @route sys/DictionaryTable/DictionaryTable
 */
<template>
  <div style="height: 100%;">
    <div :class="$style.container">
      <!-- 左边栏 -->
      <div
        v-loading="left.isLoading"
        element-loading-spinner="sv-loading"
        :class="$left.container"
      >
        <!-- 筛选框 -->
        <sv-input-tree-search
          v-model="left.filterKeyword"
          width="calc(100% - 20px)"
          @change="filterTypeList"
        />
        <ul>
          <li
            v-for="(type, typeIndex) in left.filteredTypeList"
            :key="`typeList_${typeIndex}`"
            :class="{ [$left.active]: Object.is(selectedType, type) }"
            @click="selectedType = type;"
          >
            {{ type.name }}
          </li>
        </ul>
      </div>
      <!-- 右边栏 -->
      <div
        v-loading="right.isLoading"
        element-loading-spinner="sv-loading"
        :class="$right.container"
      >
        <div :class="$right.header">
          <span :class="$right.title">字典表</span>
          <sv-input-search
            v-model="right.filterKeyword"
            @change="filterTableList"
          />
          <sv-button
            type="primary"
            @click="handleAdd({ addNew: selectedType.id })"
          >
            添加字典
          </sv-button>
        </div>
        <div :class="['sv-table', $right.table]">
          <el-table
            :data="right.filteredTableList"
            row-key="id"
            :tree-props="{
              children: 'children',
            }"
          >
            <el-table-column
              label="名称"
              prop="name"
              header-align="center"
              :align="selectedType.isTree ? 'left' : 'center'"
            />
            <el-table-column
              label="备注"
              prop="remark"
              header-align="center"
              align="center"
            />
            <el-table-column
              label="最后修改时间"
              prop="gmtModified"
              header-align="center"
              align="center"
            />
            <el-table-column
              label="最后修改人"
              prop="modifiedUser"
              header-align="center"
              align="center"
            />
            <el-table-column
              label="排序"
              prop="orderNum"
              header-align="center"
              align="center"
            />
            <el-table-column
              label="操作"
              header-align="center"
              align="center"
              width="180px"
            >
              <template slot-scope="scope">
                <sv-table-operation
                  :display="
                    selectedType.isTree
                      ? ['up', 'down', 'cross', 'edit', 'delete']
                      : ['up', 'down', 'edit', 'delete']
                  "
                  @up="handleMove(scope.row, true)"
                  @down="handleMove(scope.row, false)"
                  @cross="handleAdd(scope.row)"
                  @edit="handleEdit(scope.row)"
                  @delete="handleDelete(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 新增编辑弹窗 -->
    <DictionaryTableDialog
      ref="DictionaryTableDialog"
      @refresh-data="getTable"
    />
  </div>
</template>

<script>
import DictionaryTableDialog from './DictionaryTableDialog/DictionaryTableDialog.vue';

export default {
  name: 'DictionaryTable',
  components: {
    DictionaryTableDialog,
  },
  data() {
    return {
      // 左边栏数据
      left: {
        // 后台获取的数据字典类型列表
        typeList: [],
        // 是否正在获取【类型列表】
        isLoading: false,
        // 筛选关键词
        filterKeyword: '',
        // 筛选后的【类型列表】
        filteredTypeList: [],
      },
      // 选中的类型
      selectedType: null,
      // 右边栏数据
      right: {
        // 后台获取的表格数据
        tableList: [],
        // 是否正在获取表格数据
        isLoading: false,
        // 筛选关键词
        filterKeyword: '',
        // 筛选后的表格数据
        filteredTableList: [],
      },
    };
  },
  watch: {
    selectedType(val) {
      if (val) {
        this.getTable();
      }
    },
  },
  mounted() {
    this.getTypeList();
  },
  methods: {
    /**
     * @description get请求【类型列表】
     */
    getTypeList() {
      this.left.isLoading = true;
      this.$http
        .get(`${window.SITE_CONFIG.baseUrl}/sys/sysdictionary/treeList`)
        .then((response) => {
          if (response.data.code === 0) {
            this.left.typeList = response.data.data || [];
            this.left.filteredTypeList = [...this.left.typeList];
            this.selectedType = this.left.filteredTypeList[0]
              ? this.left.filteredTypeList[0]
              : null;
          } else {
            this.$mesaage.error(`无法获取字典表类型列表，错误代码${response.data.code}，错误信息：${response.data.msg}`);
          }
        })
        .catch((error) => {
          this.$message.error(`无法获取字典表类型列表，错误信息：${error}`);
        })
        .finally(() => {
          this.left.isLoading = false;
        });
    },
    /**
     * @description 根据关键词筛选【类型列表】
     * @param {String} keyword 筛选关键词
     */
    filterTypeList(keyword) {
      const regexp = new RegExp(keyword);
      this.left.filteredTypeList = this.left.typeList.filter((type) => regexp.test(type.name));
    },
    /**
     * @description 获取表格数据
     */
    getTable() {
      this.right.isLoading = true;
      this.$http
        .get(`${window.SITE_CONFIG.baseUrl}/sys/sysdictionary/getSysDictionaryListByCode2tree?code=${this.selectedType.code}`)
        .then((response) => {
          if (response.data.code === 0) {
            this.right.tableList = response.data.data || [];
            this.right.filteredTableList = [...this.right.tableList];
            this.right.filterKeyword = '';
          } else {
            this.$message.error(`获取表格数据失败，错误代码${response.data.code}，错误信息：${response.data.msg}`);
          }
        })
        .catch((error) => {
          this.$message.error(`获取表格数据失败，错误信息：${error}`);
        })
        .finally(() => {
          this.right.isLoading = false;
        });
    },
    /**
     * @description 筛选
     * @param {String} keyword 关键词
     */
    filterTableList(keyword) {
      const regexp = new RegExp(keyword);
      const flattedTableList = new Set();
      const flat = (nodeList) => {
        nodeList.forEach((node) => {
          flattedTableList.add(node);
          if (node.children && node.children.length) {
            flat(node.children);
          }
        });
      };
      flat(this.right.tableList);
      this.right.filteredTableList = Array.from(flattedTableList)
        .filter((node) => regexp.test(node.name));
    },
    /**
     * @description 移动表格项
     * @param {Object} row 表格项数据
     * @param {Boolean} isUp 是否上移
     */
    handleMove(row, isUp) {
      let orderNum = Number(row.orderNum) > 0 ? Number(row.orderNum) - 1 : 0;
      if (!isUp) {
        orderNum = Number(row.orderNum) + 1;
      }
      const request = {
        method: 'post',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: '/sys/sysdictionary/update',
        data: {
          id: row.id,
          code: row.code,
          name: row.name,
          parentId: row.parentId,
          remark: row.remark,
          orderNum,
        },
      };
      this.$http(request)
        .then((response) => {
          if (response.data.code === 0) {
            this.getTable();
          } else {
            this.$message.error(`移动失败，错误代码${response.data.code}，错误信息${response.data.msg}`);
          }
        })
        .catch((error) => {
          this.$message.error(`移动失败，错误信息：${error}`);
        });
    },
    /**
     * @description 新增表格项子节点
     * @param {Object} row 表格项数据
     */
    handleAdd(row) {
      this.$refs.DictionaryTableDialog.open(false, row);
    },
    /**
     * @description 编辑表格项
     * @param {Object} row 表格项数据
     */
    handleEdit(row) {
      this.$refs.DictionaryTableDialog.open(true, row);
    },
    /**
     * @description 删除表格项
     * @param {Object} row 表格项数据
     */
    handleDelete(row) {
      this.$confirm(`确定移除${row.name}？子孙节点也将一并删除，且数据无法恢复`)
        .then(() => {
          const ids = [];
          const findChildren = (node) => {
            ids.push(node.id);
            if (node.children && node.children.length) {
              node.children.forEach((child) => {
                findChildren(child);
              });
            }
          };
          findChildren(row);
          const request = {
            method: 'post',
            baseURL: window.SITE_CONFIG.baseUrl,
            url: '/sys/sysdictionary/delete',
            data: {
              ids,
            },
          };
          this.$http(request)
            .then((response) => {
              if (response.data.code === 0) {
                this.$message.success('删除成功');
                this.getTable();
              } else {
                this.$message.error(`删除失败，错误代码${response.data.code}，错误信息：${response.data.msg}`);
              }
            })
            .catch((error) => {
              this.$message.error(`删除失败，错误信息：${error}`);
            });
        })
        .catch(() => {});
    },
  },
};
</script>
// 通用样式
<style lang="scss" module>
.container {
  display: flex;
  height: 100%;
  & > div {
    height: 100%;
    border-radius: 4px;
    background: #FFFFFF;
    box-shadow: 0px 4px 14px 2px rgba(54, 121, 225, 0.09);
  }
}
</style>
// 左边栏样式
<style lang="scss" module="$left">
.container {
  width: 300px;
  flex-shrink: 0;
  margin-right: 10px;
  text-align: center;
  padding-top: 5px;
  ul {
    margin-top: 5px;
    height: calc(100% - 40px);
    overflow-x: hidden;
    overflow-y: auto;
    text-align: left;
    list-style: none;
    padding: 0;
    &::-webkit-scrollbar {
      background: transparent;
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: #d5d5d5;
      border-radius: 5px;
    }
    & > li {
      padding: 15px 15px 15px 24px;
      border-left: 2px solid transparent;
      cursor: pointer;
      &:hover {
        background: rgba(0, 145, 255, 0.1);
        border-left: 2px solid #0091FF;
      }
    }
    .active {
      color: #0091FF;
      background: rgba(0, 145, 255, 0.1);
      border-left: 2px solid #0091FF;
    }
  }
}
</style>
// 右边栏样式
<style lang="scss" module="$right">
.container {
  flex-grow: 1;
  .header {
    height: 40px;
    line-height: 40px;
    text-align: right;
    padding: 0 10px;
    .title {
      float: left;
      border-left: 3px solid #0091FF;
      padding-left: 15px;
      font-size: 16px;
      font-weight: bold;
      line-height: 16px;
      margin-top: 12px;
    }
  }
  .table {
    width: 100%;
    height: calc(100% - 40px);
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      background: transparent;
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: #d5d5d5;
      border-radius: 5px;
    }
  }
}
</style>
