<template>
  <div>
    <el-dialog
      top="50px"
      width="70%"
      :title="selectTitle"
      :visible.sync="selectData"
      left
      :before-close="closeDialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-row>
        <el-col :span="6">
          <el-scrollbar>
            <el-tree
              style="overflow: scroll; height: 600px"
              :highlight-current="showTree"
              node-key="id"
              :data="dataTree"
              :props="defaultProps"
              :default-expanded-keys="expandedKeys"
              :current-node-key="selectedNode"
              @node-click="handleNodeClick"
            >
              <span
                slot-scope="{ node }"
                class="span-ellipsis"
              >
                <span :title="node.label">{{ node.label }}</span>
              </span>
            </el-tree>
          </el-scrollbar>
        </el-col>
        <el-col :span="18">
          <div style="display: flex; width: 90%; margin: 0 auto">
            <div style="flex: 5">
              <el-input
                v-model="inquireQuery"
                type="text"
                placeholder="请输入姓名/单位/职位/号码"
                clearable
              >
                <template slot="append">
                  <el-button @click="getTableList">查询</el-button>
                </template>
              </el-input>
            </div>
          </div>
          <div style="display: flex; width: 90%; margin: 0 auto">
            <el-checkbox-group
              v-model="checkedCities"
              style="display: flex; flex-wrap: wrap"
            >
              <el-checkbox
                v-for="(city, item) in cities"
                :key="item"
                :label="city.id"
              >
                <div style="width: 100%">
                  <div style="display: flex; height: 60px; line-height: 60px">
                    <div
                      style="
                        flex: 1;
                        text-align: center;
                        display: block;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                      "
                      :title="city.name"
                    >
                      {{ city.name }}
                    </div>
                    <div
                      style="
                        flex: 1;
                        text-align: center;
                        display: block;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                      "
                      :title="city.position"
                    >
                      {{ city.position }}
                    </div>
                  </div>
                  <div
                    style="
                      height: 60px;
                      line-height: 60px;
                      text-indent: 20px;
                      text-align: left;
                    "
                  >
                    {{ city.mobile }}
                  </div>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div style="width: 100%; margin-top: 30px; text-align: center">
            <el-pagination
              :small="pagingSize"
              :page-size="pageSize"
              :total="total"
              :current-page="currentPage"
              layout="total, prev, pager, next, jumper"
              @current-change="pageMode"
            />
          </div>
        </el-col>
      </el-row>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="small"
          @click="close"
        >
          取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="confirm"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SelectDialog',
  props: ['selectTitle', 'selectData'],
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      dataTree: [],
      pagingSize: true,
      total: 0,
      pageSize: 12, // 每页多少条
      currentPage: 1, // 当前页
      checkedCities: [], // 选中联系人
      cities: [], // 右侧列表
      inquireQuery: '', // 查询
      tree: {}, // 当前选中的树节点
      treeId: '', // 树ID
      showTree: true,
      serchTs: '', // 用来判断搜索内容是否点击了
      expandedKeys: [], // 默认展开的分组
      selectedNode: 0, // 选中的分组
    };
  },
  watch: {
    treeId: {
      handler(newV, oldV) {
        if (newV != oldV) {
          this.currentPage = 1;
        }
      },
      deep: true,
    },
    serchTs: {
      handler(newV, oldV) {
        if (newV != oldV) {
          this.currentPage = 1;
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.getDataTree();
  },
  methods: {
    /**
     * @param tree 选中树节点
     * @description 获取当前节点和子级节点的id
     */
    getTreeIds(tree = {}) {
      let arr = [];
      arr.push(tree.id);
      function getIds(children = []) {
        return children.map((el) => el.id);
      }
      function getChildrenIds(children = [], targetArr = []) {
        let newArr = targetArr.concat(getIds(children));
        children.forEach((item) => {
          if (item.children) {
            newArr = newArr.concat(getChildrenIds(item.children, newArr));
          }
        });
        return newArr;
      }
      if (tree.children) {
        arr = arr.concat(getChildrenIds(tree.children, arr));
        arr = [...new Set(arr)]; // 去重
      }
      return arr;
    },
    getDataTree() {
      this.$http({
        method: 'get',
        url: '/mail/mailgroup/list',
        baseURL: window.SITE_CONFIG.baseUrl,
      }).then((response) => {
        if (response.data.code === 0) {
          this.dataTree = response.data.data;
          this.handleNodeClick(this.dataTree[0]);
          this.expandedKeys.push(this.dataTree[0].id);
          this.selectedNode = this.dataTree[0].id;
        }
      });
    },
    close() {
      this.$emit('close');
    },
    confirm() {
      this.$emit('confirm', this.checkedCities);
    },
    closeDialog() {
      this.$emit('closeDialog');
    },
    handleNodeClick(data) {
      this.treeId = data.id;
      this.inquireQuery = '';
      this.currentPage = 1;
      this.checkedCities = [];
      this.tree = data;
      this.getTableList();
    },
    getTableList() {
      const groupIds = this.getTreeIds(this.tree);
      const request = {
        method: 'post',
        url: '/mail/mailcontactor/list',
        baseURL: window.SITE_CONFIG.baseUrl,
        headers: {
          token: this.$cookie.get('token'),
        },
        data: {
          page: this.currentPage,
          limit: 10,
          search: this.inquireQuery,
          groupId: groupIds,
        },
      };

      this.$http(request).then((response) => {
        if (response.data.code === 0) {
          this.cities = response.data.data
            ? response.data.data.list
            : response.data.page.list;
          this.total = response.data.data
            ? response.data.data.totalCount
            : response.data.page.totalCount;
        }
      });
    },
    pageMode(val) {
      this.currentPage = val;
      this.checkedCities = [];
      this.getTableList();
    },
  },
};
</script>

<style scoped>
>>> .el-checkbox-group .el-checkbox {
  display: inline-block;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 200px;
  height: 120px;
  line-height: 120px;
  margin: 10px 5px;
}
>>> .el-checkbox__input {
  display: none;
}
>>> .el-checkbox__label {
  display: flex;
  padding-left: 0;
  width: 100%;
}
>>> .el-input-group__append {
  background-color: #409eff;
  border-color: #409eff;
  color: white;
  cursor: pointer;
}
</style>
