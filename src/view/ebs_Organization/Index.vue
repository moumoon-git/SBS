<template>
  <el-container>
    <el-container>
      <div style="background: #cccccc47;">
        <div class="tree">
          <el-input
            v-model="emergency"
            placeholder="请输入应急类型"
            clearable
          />
          <div style="margin-top: 6px; overflow: auto; height: calc(100vh - 160px);">
            <el-tree
              ref="tree"
              :filter-node-method="filterNode"
              :data="datas"
              :highlight-current="true"
              :props="{
                children: 'children',
                label: 'name',
              }"
              :default-expanded-keys="[0]"
              node-key="id"
              @node-click="handleNodeClick"
            />
          </div>
        </div>
      </div>
      <el-main>
        <el-header class="header">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="float: left;margin-top: 8px;margin-right: 30px;"
          />
          <div class="left">
            <search-bar
              ref="search"
              placeholder="输入名称或版本号搜索"
              @on-search="searchTable"
            />
          </div>
          <div class="right">
            <div class="nav">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="handleAdd"
              >
                新增
              </el-button>
            </div>
          </div>
        </el-header>
        <div class="right">
          <el-table
            highlight-current-row
            stripe
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;"
            border
          >
            <el-table-column
              prop="name"
              label="预案名称"
              min-width="200"
              :resizable="true"
            />
            <el-table-column
              prop="version"
              label="版本号"
              min-width="200"
              :resizable="true"
            />
            <el-table-column
              prop="publishDate"
              label="发布时间"
              show-overflow-tooltip
              min-width="200"
              :resizable="true"
            />
            <el-table-column
              prop="address"
              label="操作"
              show-overflow-tooltip
              min-width="240"
              width="240"
              :resizable="false"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  type="info"
                  class="sbs-button"
                  @click="handleDetail(scope.$index, scope.row)"
                >
                  查看
                </el-button>
                <el-button
                  type="primary"
                  class="sbs-button"

                  @click="handleUpdate(scope.$index, scope.row)"
                >
                  修改
                </el-button>
                <el-button
                  type="danger"
                  class="sbs-button"
                  @click="handleDelete(scope.$index, scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="total, prev, pager, next, jumper"
            :total="total"
            :current-page="currentPage"
            :page-size="pageSize"
            style="margin-top: 20px;text-align: center;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SearchBar from '../../ebs_components/SearchBar.vue';
import { adjustCurrentPage } from '../../assets/js/ebs_common';

export default {
  name: 'Organization',
  components: {
    'search-bar': SearchBar,
  },
  data() {
    const data = [{
      id: 0,
      name: '应急类型',
      children: null,
    }];
    return {
      emergency: '', // 根据应急类型检索树
      datas: JSON.parse(JSON.stringify(data)), // 左树数据
      filterText: '', // 根据名称检索预案表格
      time: ['', ''], // 根据时间检索预案表格
      tableData: [], // 右预案表格
      eltreeId: 0, // 类型ID：‘自然灾害：293’
      eltreelable: '', // 类型文本：‘自然灾害->地震’
      total: 0, // 翻页器
      currentPage: 1, // 翻页器
      pageSize: 10, // 翻页器
    };
  },
  watch: {
    emergency(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    sessionStorage.setItem('preplanActive', -1);
    this.getTree();
  },
  methods: {
    // 左树
    getTree() {
      this.$http({
        method: 'post',
        url: '/eos/caseClass/getTree',
        baseURL: window.g.ApiUrl,
      }).then((res) => {
        this.datas[0].children = res.data.data;
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(0);
        });
        this.getBriefsByClassId();
      });
    },
    // 右表
    getBriefsByClassId() {
      this.$http({
        method: 'post',
        url: '/emergency/preparation/preplan/getBriefsByClassId',
        baseURL: window.g.ApiUrl,
        data: {
          id: this.eltreeId,
          key: this.filterText,
          page: this.currentPage,
          size: this.pageSize,
          includeLowerLevel: 1,
          starttime: this.time[0],
          endtime: this.time[1],
          menuId: this.$store.state.menuID,
        },
      }).then((res) => {
        this.total = res.data.data.totalElements;
        this.tableData = res.data.data.data;
        // 时间的格式要规整
        for (const i in this.tableData) {
          if (this.tableData[i].publishDate != null) {
            const publishDate = this.tableData[i].publishDate.replace(/-/g, '/');
            const time = new Date(publishDate);
            const y = time.getFullYear();
            const m = time.getMonth() + 1;
            const d = time.getDate();
            this.tableData[i].publishDate = `${y}-${this.transformationTime(m)}-${this.transformationTime(d)}`;
          }
        }
      });
    },
    // 转换时间格式
    transformationTime(data) {
      return data < 10 ? `0${data}` : data;
    },
    // 根据地震拼出 自然灾害->地震
    treeParentsFind(tree, func, path = []) {
      for (const data of tree) {
        path.push(data.name);
        if (func(data)) return path;
        if (data.children) {
          const findNode = this.treeParentsFind(data.children, func, path);
          if (findNode.length) return findNode;
        }
        path.pop();
      }
      return [];
    },
    // 点击左树
    handleNodeClick(data) {
      // 当前左边选中类型id（自然灾害：293
      this.eltreeId = data.id;
      // 拼接类型名称
      const labelArr = this.treeParentsFind(this.datas[0].children, (e) => e.id === id);
      let label = '';
      for (const i in labelArr) {
        if (i == labelArr.length - 1) label += labelArr[i];
        else label = `${label + labelArr[i]}->`;
      }
      this.eltreelable = label;
      // 其她参数初始化
      this.currentPage = 1;
      this.filterText = '';
      this.time = [];
      this.$refs.search.reset();
      this.getBriefsByClassId();
    },
    // 搜左边
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 搜右边
    searchTable(key) {
      this.filterText = key;
      this.currentPage = 1;
      this.getBriefsByClassId();
    },
    // 新增预案
    handleAdd() {
      if (this.eltreeId === 0) {
        this.$message({
          message: '请选择一个应急类别新增预案备案！',
          type: 'warning',
        });
        return;
      }
      sessionStorage.setItem('preplanActive', 0);
      sessionStorage.setItem('preplanId', 0); // 有版本id时的预案id
      sessionStorage.setItem('preplanEditionid', 0); // 无版本id时的预案id
      sessionStorage.setItem('preplanVersionId', 0); // 版本id
      sessionStorage.setItem('preplanClassId', this.eltreeId); // 类型ID：‘自然灾害：293’
      sessionStorage.setItem('preplanClassName', this.eltreelable); // 类型文本：‘自然灾害->地震’
      sessionStorage.setItem('preplanName', ''); // 预案名称
      localStorage.setItem('preplanType', 'add'); // 标记全局为新增
      this.$router.push({
        path: '/newlyadded',
        name: 'newlyadded',
      });
    },
    // 查看预案
    handleDetail(index, row) {
      const labelArr = this.treeParentsFind(this.datas[0].children, (data) => data.id == row.classId);
      let label = '';
      for (const i in labelArr) {
        if (i == labelArr.length - 1) label += labelArr[i];
        else label = `${label + labelArr[i]}->`;
      }
      sessionStorage.setItem('preplanActive', 0);
      sessionStorage.setItem('preplanId', row.id); // 有版本id时的预案id
      sessionStorage.setItem('preplanEditionid', 0); // 无版本id时的预案id
      sessionStorage.setItem('preplanVersionId', row.versionId); // 版本id
      sessionStorage.setItem('preplanClassId', row.classId); // 类型ID：‘自然灾害：293’
      sessionStorage.setItem('preplanClassName', label); // 类型文本：‘自然灾害->地震’
      sessionStorage.setItem('preplanName', row.name); // 预案名称
      this.$router.push({
        path: '/edition',
        name: 'edition',
      });
    },
    // 修改预案
    handleUpdate(index, row) {
      localStorage.setItem('preplanType', 'update'); // 标记全局为修改
      const labelArr = this.treeParentsFind(this.datas[0].children, (data) => data.id == row.classId);
      let label = '';
      for (const i in labelArr) {
        if (i == labelArr.length - 1) label += labelArr[i];
        else label = `${label + labelArr[i]}->`;
      }
      sessionStorage.setItem('preplanId', row.id); // 有版本id时的预案id
      sessionStorage.setItem('preplanActive', 0);
      sessionStorage.setItem('preplanClassId', row.classId); // 类型ID：‘自然灾害：293’
      sessionStorage.setItem('preplanClassName', label); // 类型文本：‘自然灾害->地震’
      sessionStorage.setItem('preplanName', row.name); // 预案名称
      if (row.versionId) {
        sessionStorage.setItem('preplanEditionid', 0); // 无版本id时的预案id
        sessionStorage.setItem('preplanVersionId', row.versionId); // 版本id
        this.$router.push({
          path: '/newlyadded',
          name: 'newlyadded',
        });
      } else {
        this.$message('该预案暂无版本，请先新增版本');
        sessionStorage.setItem('preplanEditionid', row.id); // 无版本id时的预案id
        sessionStorage.setItem('preplanVersionId', 0); // 版本id
        this.$router.push({
          path: '/newlyadded',
          name: 'newlyadded',
        });
      }
    },
    // 删除预案
    handleDelete(index, row) {
      const { id } = row;
      this.$confirm('确定删除该数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/delete',
          baseURL: window.g.ApiUrl,
          data: {
            id,
          },
        }).then((res) => {
          if (res) {
            this.currentPage = adjustCurrentPage(this.currentPage, this.pageSize, this.total, 1);
            this.getBriefsByClassId();
            this.$message({
              message: '删除成功',
              type: 'success',
            });
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    // 翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getBriefsByClassId();
    },
    // 翻页
    handleSizeChange(val) {
      this.currentPage = val;
      this.getBriefsByClassId();
    },
  },
};
</script>

<style>
@import '../../assets/css/common.css';
</style>

<style scoped>
.header .left {
  float: left;
}
.header .right {
  float: left;
  margin-top: 10px;
}
.container {
  clear: both;
}
.el-tree {
  min-width: 100%;
  display: inline-block !important;
  background: #c0c0c003;
}
.el-tree--highlight-current
  >>> .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #c0c0c0;
}
</style>
