<template>
  <el-container>
    <el-container>
      <el-aside width="250px" style="background: #cccccc47;">
        <div class="tree">
          <el-input
            placeholder="请输入应急类型"
            clearable
            v-model="AddressText"
            style="margin-bottom: 6px;"
          ></el-input>
          <el-scrollbar style="height: calc(100vh - 165px)">
            <el-tree
              class="filter-tree"
              :data="datas"
              highlight-current
              :props="defaultProps"
              @node-click="handleNodeClick"
              ref="tree"
              :filter-node-method="filterNode"
              :default-expanded-keys="[indexKey]"
              node-key="id"
            ></el-tree>
          </el-scrollbar>
        </div>
      </el-aside>

      <el-main>
        <el-header class="header" style="width:100%;">
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="float: left;margin-top: 8px;margin-right: 30px;"
          ></el-date-picker>
          <div class="left">
            <search-bar
              ref="search"
              :placeholder="placeholder"
              @on-search="onSearch"
              style="width: 240px;"
            ></search-bar>
          </div>
          <div class="right">
            <div class="nav">
              <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAppend">新增</el-button>
            </div>
          </div>
        </el-header>
        <div class="right">
          <my-table
            :table-data="tableData"
            :table-key="tableKey"
            @selection-change="handleSelectionChange"
            @detail="handleDetail"
            @update="handleUpdate"
            @delete="handleDelete"
            @row-dblclick="handleDetail"
          ></my-table>
          <my-pagination
            :total="total"
            :current-page="currentPage"
            :page-size="pageSize"
            @handle-current-change="handleCurrentChange"
          ></my-pagination>
        </div>
      </el-main>
    </el-container>

    <!-- 新增/修改/查看弹出框 -->
    <my-dialog
      ref="dialog"
      :title="dialogTitle"
      :width="dialogWidth"
      :top="dialogTop"
      @closeDialog="closeDialog"
    >
      <my-form
        slot="form"
        ref="dataForm"
        :id="subId"
        :type="type"
        :case-class-id="caseClassId"
        :case-class-name="caseClassName"
        @on-submit="onSubmit"
        @on-cancel="onCancel"
        :treeData="datas"
        :ZoningData="ZoningData"
      ></my-form>
    </my-dialog>
  </el-container>
</template>

<script>
  import SearchBar from '../../ebs_components/SearchBar'
  import MyDialog from '../../ebs_components/MyDialog'
  import Form from './Form'
  import MyTable from '../../ebs_components/MyTable'
  import MyPagination from '../../ebs_components/MyPagination'
  import {
    adjustCurrentPage
  } from '../../assets/js/common'
  export default {
    name: "typicalCaseIndex",
    components: {
      'search-bar': SearchBar,
      'my-dialog': MyDialog,
      'my-form': Form,
      'my-table': MyTable,
      'my-pagination': MyPagination
    },
    inject:['reload'],
    data() {
      const data = [{
        id: 0,
        name: '应急类型',
        children: null
      }];
      const Zoning = [{
        id: 0,
        name: '所有区划',
        children: null
      }];
      return {
        AddressText:"",
        theme: '案例管理',
        placeholder: '请输入名称或版本号',
        key: '',
        indexKey: 0,
        tableKey: [
          {
            prop: 'name',
            label: '案例名称',
          },
          {
            prop: 'versionNo',
            label: '版本号',
          },
          {
            prop: 'publishDate',
            label: '发布日期',
          },
          {
            prop: 'caseClass.name',
            label: '案例事件类型',
          },
          {
            prop: 'occurTime',
            label: '案例事发时间',
          },
          {
            prop: 'district.name',
            label: '案例事发区域',
          },
          {
            prop: 'address',
            label: '案例事发地点',
          },
        ],
        datas: JSON.parse(JSON.stringify(data)),
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        caseClassId: '',
        caseClassIds: '',
        caseClassName: "",
        total: 0, //数据总条目数
        currentPage: 1, // 当前页
        pageSize: 10, // 每页数据条目数
        fields: [],
        type: 'create',
        dialogTitle: '', // 对话框标题
        dialogWidth: '900px',
        dialogTop: '5vh', // 对话框margin-top
        tableData: [],
        multipleSelection: [],
        subId: null, //备案ID
        time: [], //时间

        ZoningData: JSON.parse(JSON.stringify(Zoning)), //行政区划
      }
    },
    created() {
      this.getTree();
      this.$http({
				method: 'post',
				url:  '/emergency/preparation/area/topTree',
				baseURL: window.g.ApiUrl
				}).then(result => { //行政区划
        this.ZoningData[0].children = result.data;
      })
    },
    watch: {
      AddressText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      closeDialog() {
        this.$refs.dataForm.closeDialog();
      },
      filterNode(value, data) { //筛选应急
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      getTree() {
        let data = {};
        this.$http({
					method: 'post',
					url: '/eos/caseClass/getTree',
					baseURL: window.g.ApiUrl
					}).then(res => {
          this.datas[0].children = res.data.data;
          this.caseClassIds = 0;
          this.getTable();
          this.chooseTree()
        })
      },
      chooseTree() { //默认选中树形
        this.$nextTick(function() {
          this.$refs.tree.setCurrentKey(0);
        })
      },
      //点击应急类别返回数据
      handleNodeClick(data) { //树形
        this.highlight = true;
        this.caseClassId = data.id;
        this.caseClassName = data.name;
        this.currentPage = 1;
        this.key = "";
        this.$refs.search.reset();
        this.getTable();
      },
      getTable() {
        if (this.caseClassId == '') {
          this.caseClassId = this.caseClassIds;
        }
        let startTime, endTime;
        if (this.time) {
          if (this.time.length > 0) {
            startTime = this.time[0];
            endTime = this.time[1];
          } else {
            startTime = '';
            endTime = '';
          }
        } else {
          startTime = '';
          endTime = '';
        }
        let data = {
          caseClassId: this.caseClassId,
          page: this.currentPage,
          size: this.pageSize,
          fields: this.fields,
          key: this.key,
          includeLowerLevel: 1,
          menuId:this.$store.state.menuID,
          startTime: startTime,
          endTime: endTime,
        };
        this.$http({
				method: 'post',
				url:  '/emergency/preparation/typicalCase/getList',
				baseURL: window.g.ApiUrl,
        data
				}).then(res => {
          let data = res.data;
          this.total = data.totalElements;
          this.tableData = data.data;
        })
      },
      handleSizeChange(val) {
        this.currentPage = val;
        this.getTable();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getTable();
      },
      // 新增按钮触发事件
      handleAppend() {
        /*
        if (this.caseClassId == null || this.caseClassId === 0) {
          this.$message({
            type: 'warning',
            message: '请选择一个应急类别新增案例'
          });
          return;
        }
        */

        this.subId = 0;
        this.type = 'create';
        this.dialogTitle = this.theme + '新增';
        this.$refs.dialog.visible = true;
        this.$nextTick(function() {
          this.$refs.dataForm.getDetail();
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //修改案例
      handleUpdate(id) {
        this.subId = id;
        this.type = 'update';
        this.dialogTitle = this.theme + '修改';
        this.$refs.dialog.visible = true;
        this.$nextTick(function() {
          this.$refs.dataForm.getDetail();
        });
      }, //删除案例
      handleDelete(id) {

        let data = {
          "ids": [id]
        };
        let CallbackReload=this;
        this.$http({
				method: 'post',
				url:  '/emergency/preparation/typicalCase/delete',
				baseURL: window.g.ApiUrl,
        data
				}).then(res => {
          this.currentPage = adjustCurrentPage(this.currentPage, this.pageSize, this.total, 1);
          this.getTable();
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        })

      },
      //查看案例
      handleDetail(id) {
        this.subId = id;
        this.type = 'detail';
        this.dialogTitle = this.theme + '查看';
        this.$refs.dialog.visible = true;
        this.$nextTick(function() {
          this.$refs.dataForm.getDetail();
        });
      },
      // 新增/修改数据项成功后触发事件
      onSubmit(type) {
        this.$refs.dialog.visible = false;
        if (type === 'create') {
          this.currentPage = 1;
          this.getTable();
        } else if (type === 'update') {
          this.getTable();
        }
      },
      // 取消新增/修改操作
      onCancel() {
        this.$refs.dialog.visible = false;
      },

      onSearch(key) {
        this.key = key;
        this.currentPage = 1;
        this.getTable();
      },
      btns() {
        this.$nextTick(function() {
          this.$refs.tree.setCurrentKey(this.eltreeId)
        })
      }
    }
  }
</script>

<style scoped>
@import '../../assets/css/common.css';

span {
    width: 100%;
    height: 1px;
    color: #000;
    display: inline-block;
}

.nav li {
    float: left;
}

li {
    list-style: none;
}

.header .left {
    float: left;
}

.header .right {
    float: left;
    margin-top: 10px;
}

.el-button--small {
    padding: 11px 15px;
}

.container {
    clear: both;
}

.tree {
    overflow-y: auto;
    overflow-x: auto;
    width: 250px;
    /*height: 768px;*/
}

.el-tree {
    min-width: 100%;
    display: inline-block !important;
}

.eltable {
    overflow-x: auto;
}

.operation-btn {
    width: 240px;
    text-align: left;
    margin-left: 5px;
    margin-right: 5px;
    padding-bottom: 5px;
    border-bottom: #ebeef5 1px solid;
}

.el-tree--highlight-current
    >>> .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #c0c0c0;
}

.el-tree {
    background: #c0c0c003;
}

.el-dialog__wrapper >>> .el-dialog--center .el-dialog__body {
    text-align: left;
}
</style>
