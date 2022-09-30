<!--
 * @Author: yanghaohao
 * @Date: 2020-09-01 10:46:42
 * @LastEditTime: 2021-01-15 10:14:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SBS\src\views\modules\specialTopic\specialTopicPublishLower\specialTopicPublishLower.vue
-->

<template>
  <div class="specialTopicPublishTop">
    <div class="custom-tree-container">
      <div class="warning-tree-search">
        <div
          class="el-icon-search warning-tree-search-icon"
        />
        <input
          v-model="dataForm.searchName"
          class="warning-tree-search-inner"
          placeholder="按enter搜索"
          @keyup.enter="getTreeList()"
          @change="getTreeList()"
        >
        <div
          v-if="dataForm.searchName"
          class="warning-tree-search-cancel el-icon-close"
          @click="
            dataForm.searchName = '';
            getTreeList();
          "
        />
        <!-- <img
          class="taskTree-add"
          src="../../../../assets/img/addTask.svg"
          @click="addTree()"
        /> -->
      </div>
      <div class="treeClass">
        <el-tree
          ref="tree"
          :data="treeList"
          :default-expanded-keys="[0]"
          :current-node-key="0"
          :props="treeProp"
          node-key="id"
          highlight-current
          @node-click="handleNodeClick"
        />
      </div>
    </div>
    <div class="right-content">
      <div class="topHeader">
        <div class="top-header__title">
          次级专题发布
        </div>
        <sv-input-search
          v-model="searchTable"
          placeholder="请输入专题名字搜索"
          width="200px"
          @change="getDataList"
        />
        <!-- <el-button type="primary" class="addButton" @click="addTask()"
          >发布任务</el-button
        > -->
      </div>
      <div class="FromWrap">
        <el-table
          ref="refTable"
          v-loading="dataListLoading"
          :data="dataList"
          height="calc(100% - 5px)"
          border
          @selection-change="selectionChangeHandle"
          @row-click="clickTable"
        >
          <el-table-column
            type="expand"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <el-form
                label-position="left"
                inline
                class="demo-table-expand"
              >
                <el-form-item>
                  <span>子任务平台/人员：</span>
                  <span
                    v-for="(item, index) in scope.row.platformList"
                    :key="index"
                  >
                    <span>{{ item.platformName }}
                      <span
                        v-if="item.status == '0'"
                        style="
                          border: 1px solid #f4f4f4;
                          background-color: #ffadad;
                          margin-left: 10px;
                          border-radius: 6px;
                          padding: 5px;
                          color: #f4f4f4;
                        "
                      >未读</span>
                      <span
                        v-if="item.status == '1'"
                      ><span
                        style="
                            border: 1px solid #f4f4f4;
                            background-color: #56a6ff;
                            margin-left: 10px;
                            border-radius: 6px;
                            padding: 5px;
                            color: #f4f4f4;
                          "
                      >
                        进行中</span>
                      </span>
                      <span v-if="item.status == '2'">
                        <span
                          style="
                            border: 1px solid #f4f4f4;
                            background-color: #1add89;
                            margin-left: 10px;
                            border-radius: 6px;
                            padding: 5px;
                            color: #f4f4f4;
                          "
                        >已完成</span></span>
                      <span v-if="item.status == '3'">
                        <span
                          style="
                            border: 1px solid #f4f4f4;
                            background-color: #1add89;
                            margin-left: 10px;
                            border-radius: 6px;
                            padding: 5px;
                            color: #f4f4f4;
                          "
                        >已读</span></span>
                    </span>
                  </span>
                  <span
                    v-for="(item, index) in scope.row.contactorList"
                    :key="index"
                  >
                    <span>{{ item.contactorName }}
                      <span
                        v-if="item.status == '0'"
                        style="
                          border: 1px solid #f4f4f4;
                          background-color: #ffadad;
                          margin-left: 10px;
                          border-radius: 6px;
                          padding: 5px;
                          color: #f4f4f4;
                        "
                      >未读</span>
                      <span
                        v-if="item.status == '1'"
                      ><span
                         style="
                            border: 1px solid #f4f4f4;
                            background-color: #56a6ff;
                            margin-left: 10px;
                            border-radius: 6px;
                            padding: 5px;
                            color: #f4f4f4;
                          "
                       >
                         进行中</span>
                        <span v-if="item.status == '2'">
                          <span
                            style="
                              border: 1px solid #f4f4f4;
                              background-color: #1add89;
                              margin-left: 10px;
                              border-radius: 6px;
                              padding: 5px;
                              color: #f4f4f4;
                            "
                          >已完成</span></span>
                        <span v-if="item.status == '3'">
                          <span
                            style="
                              border: 1px solid #f4f4f4;
                              background-color: #1add89;
                              margin-left: 10px;
                              border-radius: 6px;
                              padding: 5px;
                              color: #f4f4f4;
                            "
                          >已读</span></span>
                      </span>
                    </span>
                  </span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="专题名称"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="groupIdString"
            label="所属分组"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="platformName"
            :show-overflow-tooltip="true"
            label="发布平台"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="endTime"
            label="截止时间"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="endDay"
            label="剩余天数"
            header-align="center"
            align="center"
          />
          <el-table-column
            prop="status"
            label="状态"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">进行中</span>
              <span v-if="scope.row.status == 2">已完成</span>
              <span v-if="scope.row.status == 3">已过期</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            header-align="center"
            align="center"
            width="300"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleLook(scope.row)"
              >
                查看
              </el-button>
              <!-- <el-button size="mini" @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="deleteHandle(scope.row.id)"
                >删除</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content-footer">
        <el-pagination
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, prev, pager, next, sizes, jumper"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
        />
      </div>
    </div>
    <!-- 新增查看编辑弹窗组件绑定-->
    <publish-special-topic-task
      v-if="addTaskVisible"
      ref="publishSpecialTopicTask"
      @cancelSubmit="cancelSubmit"
      @refreshDataList="getDataList"
    />

    <look-publish-task
      v-if="lookTaskVisible"
      ref="lookPublishTask"
      @cancelLook="cancelLook"
      @refreshDataList="getDataList"
    />

    <edit-publish-task
      v-if="editTaskVisible"
      ref="editPublishTask"
      @cancelEdit="cancelEdit"
      @refreshDataList="getDataList"
    />
  </div>
</template>

<script>
import publishSpecialTopicTask from './components/publishSpecialTopicTaskDialog.vue';
import lookPublishTask from './components/lookSpecialTopicTaskDialog.vue';
import editPublishTask from './components/editSpecialTopicTaskDialog.vue';

export default {
  name: 'SpecialTopicPublishTop',
  components: {
    publishSpecialTopicTask,
    lookPublishTask,
    editPublishTask,
  },
  data() {
    return {
      searchTable: '',
      // 记录是新增还是更新
      type: 0,
      // 记录当前获取到的树节点用于增删查改
      currentNode: '',
      // 新增修改树节点弹窗
      addorupdateDialogVisible: false,
      // 选择分组节点的弹窗
      selectTreeNodeVisible: false,
      // 绑定悬浮树节点的值,悬浮时显示图标
      hoverIndex: '',
      // 发布任务弹窗
      addTaskVisible: false,
      // 查看&编辑弹窗
      lookTaskVisible: false,
      editTaskVisible: false,
      // 加载提示
      dataListLoading: false,
      // 树形控件数据
      treeList: [],
      selectTreeList: [],
      treeProp: {
        label: 'name',
        children: 'children',
      },

      // 表单数据
      dataList: [],
      // 多选
      dataListSelections: [],
      // 分页
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      // 搜索值
      dataForm: {
        treeId: '',
        searchName: '',
        name: '',
        selectTreeNodeName: '',
        parentId: 0,
        groupDesc: '',
      },
      // 组ID
      groupIds: [],
    };
  },
  mounted() {
    this.getTreeList();
    this.getDataList();
  },
  methods: {
    /**
     * @description: 点击表格出现折叠面板
     * @param {type}
     * @return {type}
     */

    clickTable(row, index, e) {
      this.$refs.refTable.toggleRowExpansion(row);
    },
    /** 未注明参数即为空
     * @description: 发布任务弹窗
     * @param {}
     * @return {}
     */
    addTask() {
      this.addTaskVisible = true;
    },
    /**
     * @description: 关闭发布任务弹窗
     * @param {}
     * @return {}
     */
    cancelSubmit() {
      this.addTaskVisible = false;
    },
    /**
     * @description: 控制查看&编辑弹窗开关
     * @param {}
     * @return {}
     */
    cancelLook() {
      this.lookTaskVisible = false;
      this.getDataList();
    },
    cancelEdit() {
      this.editTaskVisible = false;
    },
    /**
     * @description: 查看和编辑数据
     * @param {data,即传入点击表的行数据，跳转至相关组件进行数据处理}
     * @return {页面反馈为相应弹窗}
     */
    handleLook(data) {
      this.lookTaskVisible = true;
      this.$nextTick(() => {
        this.$refs.lookPublishTask.init(data);
      });
    },
    handleEdit(data) {
      this.editTaskVisible = true;
      this.$nextTick(() => {
        this.$refs.editPublishTask.init(data);
      });
    },

    /**
     * @description: 更新表格数据
     * @param {}
     * @return {展示从后端拿取的表格数据}
     */
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl('/fk/fkTask/receiveTask'),
        method: 'post',
        data: this.$http.adornData({
          page: this.pageIndex,
          limit: this.pageSize,
          search: this.searchTable,
          groupIds: this.groupIds,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log('dataList', data);
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
          this.$message.error(data.msg);
        }
        this.dataListLoading = false;
      });
    },
    /**
     * @description: 获取树形控件数据
     * @param {}
     * @return {展示后端返回的树形控件数据}
     */
    getTreeList() {
      this.$http({
        url: this.$http.adornUrl('/fk/fkTemplateGroup/list'),
        method: 'get',
        params: this.$http.adornParams({
          name: this.dataForm.searchName,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.treeList = [
            {
              id: 0,
              name: '全部',
              children: null,
            },
            ...data.data,
          ];
          this.getDataList();
        } else {
          this.$message(data.msg);
        }
      });
    },
    /**
     * @description: 点击树形事件触发
     * @param {}
     * @return {}
     */
    handleNodeClick(obj) {
      this.currentNode = obj;
      this.groupIds = [];
      this.pageIndex = 1;
      if (obj.id === 0) {
        this.groupIds = [];
      } else {
        this.groupIds = [obj.id];
      }
      if (obj.children != null) {
        this.getChildren(obj.children);
      }
      this.getDataList();
    },
    //
    /**
     * @description: 点击树结点获取相应的子节点
     * @param {}
     * @return {}
     */
    getChildren(data) {
      if (data != null && data.length > 0) {
        data.forEach((d) => {
          this.groupIds.push(d.id);
          if (d.children != null && d.children.length > 0) {
            this.getChildren(d.children);
          }
        });
      }
    },

    /**
     * @description: 保存表格多选的数据
     * @param {}
     * @return {}
     */
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },

    /**
     * @description: 删除选择的表格行数据
     * @param {}
     * @return {}
     */
    deleteHandle(id) {
      const ids = id
        ? [id]
        : this.dataListSelections.map((item) => item.id);
      this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl('/fk/fkTask/delete'),
            method: 'post',
            data: this.$http.adornData({ ids }),
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
    /**
     * @description: 每页数
     * @param {}
     * @return {}
     */
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    /**
     * @description: 当前页
     * @param {type}
     * @return {type}
     */
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
  },
};
</script>

<style lang="less" scoped>
* {
  font-family: PingFangSC-Regular, PingFang SC;
}
.specialTopicPublishTop {
  height: calc(100vh - 112px);
  display: flex;
  background: #f4f4f4;

  .custom-tree-container {
    background: white;
    height: 100%;
    // max-width: 358px;
    width: 18%;
    min-width: 200px;
    box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);

    border-radius: 4px;
    font-family: PingFangSC-Regular, PingFang SC;

    .warning-tree-search {
      &:hover {
        border-color: #c0c4cc;
      }
      &:focus-within {
        border-color: rgba(0, 145, 255, 1);
      }

      height: 40px;
      width: calc(100% - 20px);
      border-radius: 21px;
      border: 1px solid rgba(232, 236, 240, 1);
      position: relative;
      margin: 20px 0px 20px 10px;
      .warning-tree-search-icon {
        font-size: 17px;
        font-weight: bold;
        width: 17px;
        height: 17px;
        color: rgba(153, 153, 153, 1);
        margin: 10px 0px 11px 18px;
        cursor: pointer;
      }
      .warning-tree-search-inner {
        border: none;
        outline: none;
        // width: 260px;
        width: calc(100% - 90px);
        font-size: 14px;
      }
      .warning-tree-search-cancel {
        width: 17px;
        height: 17px;
        line-height: 15px;
        font-size: 15px;
        text-align: center;
        border: 1px solid rgba(153, 153, 153, 1);
        color: rgba(153, 153, 153, 1);
        border-radius: 50%;
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 11px;
      }
      .warning-tree-search-cancel:hover {
        color: rgba(153, 153, 153, 0.5);
        border-color: rgba(153, 153, 153, 0.5);
      }
      .taskTree-add {
        position: absolute;
        width: 17px;
        height: 17px;
        margin-left: 63px;
        margin-top: 10px;
        cursor: pointer;
      }
    }
    .treeClass::-webkit-scrollbar {
      background: transparent;
      width: 5px;
    }
    .treeClass::-webkit-scrollbar-thumb {
      background: rgba(153, 153, 153, 1);
      border-radius: 20px;
    }
    .treeClass {
      overflow: auto;
      height: calc(100vh - 290px);
      .img1-hover {
        margin: 0 0;
        width: 18px;
        height: 19px;
        cursor: pointer;
        position: absolute;
        right: 40px;
        background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYwICg4ODEwMykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTM8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0i6aOO6Zmp5o6S5p+lIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5qOA5p+l6aG555uuIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzY3LjAwMDAwMCwgLTMxMi4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9IuW3puS+pyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcwLjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0ibGVmdCI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Im1lbnUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuMDAwMDAwLCA0Ni4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC0yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxOTcuMDAwMDAwLCAxNjguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0i5Yig6ZmkaWNvbiI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE1LjUwOTgzOTksMy45OTI0MTkwOCBMMTIuNTA1NTM2OSwzLjk5MjQxOTA4IEwxMi41MDU1MzY5LDMuMDYzNjQ1MTkgQzEyLjUwNDY2NDUsMi4zNTU0Njg5MyAxMi4xNjA5Njg2LDIgMTEuMzM4MTcxMywyIEw2LjczODcyMDE2LDIgQzUuOTEwNjczMTIsMiA1LjQ5ODg1NDY4LDIuMzU1NDY4OTMgNS40OTg4NTQ2OCwzLjA2MzY0NTE5IEw1LjQ5ODg1NDY4LDMuOTkyNDE5MDggTDIuNDkxNDgxMSwzLjk5MjQxOTA4IEMyLjIxNDU4Nzg4LDMuOTkyNDE5MDggMiw0LjI1MTUyODQ1IDIsNC40ODc4NDA2IEMyLDQuNzI0ODk5NiAyLjIxNTQ2MDIzLDUgMi40OTE0ODExLDUgTDE1LjUwODk2NzUsNSBDMTUuNzg0OTg4NCw1IDE2LDQuODMwNzAxNCAxNiw0LjQ4Nzg0MDYgQzE2LDQuMjU5MjY2NzMgMTUuODM2NjEzMyw0LjA5NDEyNjIzIDE1LjUwOTgzOTksMy45OTI0MTkwOCBaIE0xMy41MDExNzE0LDYgTDQuNTAwNTY4NTEsNiBDNC4zNjc1NTAzLDYgNC4yNDA2NjE4Myw2LjA1MjU4NzA5IDQuMTQ2MTQ4ODksNi4xNTAzOTY0NCBDNC4wNTMzOTM5Nyw2LjI0OTEyNDM1IDQsNi4zNzkyMTQyMyA0LDYuNTIwMzc1OTUgTDQsMTQuNDM1ODE0OSBDNCwxNS4zMDg2NTIyIDQuNjczODUsMTYuMDE4MTY3OCA1LjUwMDgzNDI5LDE2LjAxODE2NzggTDEyLjUwMTc5MjQsMTYuMDE4MTY3OCBDMTMuMzI4Nzc2NywxNi4wMTgxNjc4IDE0LDE1LjMwODY1MjIgMTQsMTQuNDM1ODE0OSBMMTQsNi41Mjg2NzU3MiBDMTQuMDAwODY4Nyw2LjIzNzExNzU2IDEzLjc3NzcwOTMsNi4wMDA5MTg1NSAxMy41MDExNzE0LDYgTDEzLjUwMTE3MTQsNiBaIiBpZD0iQ29tYmluZWQtU2hhcGUiIGZpbGw9IiM5RkM4RkUiIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xMS4wMDA2Nzg5LDEzLjU0MDI2ODEgQzExLjAwMDY3ODksMTMuNzk1NTg2OSAxMC43NzYxNjQ2LDE0IDEwLjUwMDc3NiwxNCBDMTAuMjIzNjQxMiwxNCAxMCwxMy43OTU1ODY5IDEwLDEzLjU0MDI2ODEgTDEwLDguNDYwNTUwNjcgQzEwLDguMjA1MjMxODIgMTAuMjIzNjQxMiw4IDEwLjUwMDc3Niw4IEMxMC43NzcwMzc3LDggMTEuMDAwNjYzMyw4LjIwNjAzNjIgMTEuMDAwNjYzMyw4LjQ2MDU1MDY3IEwxMS4wMDA2NjMzLDEzLjU0MDI2ODEgTDExLjAwMDY3ODksMTMuNTQwMjY4MSBaIiBpZD0iUGF0aCIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik04LjAwMDY3ODg2LDEzLjU0MDI2ODEgQzguMDAwNjc4ODYsMTMuNzk1NTg2OSA3Ljc3NjE2NDU4LDE0IDcuNTAwNzc1OTksMTQgQzcuMjIzNjQxMTcsMTQgNywxMy43OTU1ODY5IDcsMTMuNTQwMjY4MSBMNyw4LjQ2MDU1MDY3IEM3LDguMjA1MjMxODIgNy4yMjM2NDExNyw4IDcuNTAwNzc1OTksOCBDNy43NzcwMzc2OSw4IDguMDAwNjYzMjcsOC4yMDYwMzYyIDguMDAwNjYzMjcsOC40NjA1NTA2NyBMOC4wMDA2NjMyNywxMy41NDAyNjgxIEw4LjAwMDY3ODg2LDEzLjU0MDI2ODEgWiIgaWQ9IlBhdGgtQ29weSIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=");
        background-size: 100% 100%;
        &:hover {
          background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTU8L3RpdGxlPgogICAgPGcgaWQ9IumjjumZqeaOkuafpSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuajgOafpemhueebriIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyOTguMDAwMDAwLCAtMzMwLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0i57yW57uELTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQzNC4wMDAwMDAsIDk4LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTflpIfku70iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU2LjAwMDAwMCwgMTg2LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzg0LjAwMDAwMCwgNDYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxnIGlkPSLliKDpmaRpY29uIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNC4wMDAwMDAsIDAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTUuNTA5ODM5OSwzLjk5MjQxOTA4IEwxMi41MDU1MzY5LDMuOTkyNDE5MDggTDEyLjUwNTUzNjksMy4wNjM2NDUxOSBDMTIuNTA0NjY0NSwyLjM1NTQ2ODkzIDEyLjE2MDk2ODYsMiAxMS4zMzgxNzEzLDIgTDYuNzM4NzIwMTYsMiBDNS45MTA2NzMxMiwyIDUuNDk4ODU0NjgsMi4zNTU0Njg5MyA1LjQ5ODg1NDY4LDMuMDYzNjQ1MTkgTDUuNDk4ODU0NjgsMy45OTI0MTkwOCBMMi40OTE0ODExLDMuOTkyNDE5MDggQzIuMjE0NTg3ODgsMy45OTI0MTkwOCAyLDQuMjUxNTI4NDUgMiw0LjQ4Nzg0MDYgQzIsNC43MjQ4OTk2IDIuMjE1NDYwMjMsNSAyLjQ5MTQ4MTEsNSBMMTUuNTA4OTY3NSw1IEMxNS43ODQ5ODg0LDUgMTYsNC44MzA3MDE0IDE2LDQuNDg3ODQwNiBDMTYsNC4yNTkyNjY3MyAxNS44MzY2MTMzLDQuMDk0MTI2MjMgMTUuNTA5ODM5OSwzLjk5MjQxOTA4IFogTTEzLjUwMTE3MTQsNiBMNC41MDA1Njg1MSw2IEM0LjM2NzU1MDMsNiA0LjI0MDY2MTgzLDYuMDUyNTg3MDkgNC4xNDYxNDg4OSw2LjE1MDM5NjQ0IEM0LjA1MzM5Mzk3LDYuMjQ5MTI0MzUgNCw2LjM3OTIxNDIzIDQsNi41MjAzNzU5NSBMNCwxNC40MzU4MTQ5IEM0LDE1LjMwODY1MjIgNC42NzM4NSwxNi4wMTgxNjc4IDUuNTAwODM0MjksMTYuMDE4MTY3OCBMMTIuNTAxNzkyNCwxNi4wMTgxNjc4IEMxMy4zMjg3NzY3LDE2LjAxODE2NzggMTQsMTUuMzA4NjUyMiAxNCwxNC40MzU4MTQ5IEwxNCw2LjUyODY3NTcyIEMxNC4wMDA4Njg3LDYuMjM3MTE3NTYgMTMuNzc3NzA5Myw2LjAwMDkxODU1IDEzLjUwMTE3MTQsNiBMMTMuNTAxMTcxNCw2IFoiIGlkPSJDb21iaW5lZC1TaGFwZSIgZmlsbD0iIzAwOTFGRiIgZmlsbC1ydWxlPSJub256ZXJvIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTEuMDAwNjc4OSwxMy41NDAyNjgxIEMxMS4wMDA2Nzg5LDEzLjc5NTU4NjkgMTAuNzc2MTY0NiwxNCAxMC41MDA3NzYsMTQgQzEwLjIyMzY0MTIsMTQgMTAsMTMuNzk1NTg2OSAxMCwxMy41NDAyNjgxIEwxMCw4LjQ2MDU1MDY3IEMxMCw4LjIwNTIzMTgyIDEwLjIyMzY0MTIsOCAxMC41MDA3NzYsOCBDMTAuNzc3MDM3Nyw4IDExLjAwMDY2MzMsOC4yMDYwMzYyIDExLjAwMDY2MzMsOC40NjA1NTA2NyBMMTEuMDAwNjYzMywxMy41NDAyNjgxIEwxMS4wMDA2Nzg5LDEzLjU0MDI2ODEgWiIgaWQ9IlBhdGgiIGZpbGw9IiNGRkZGRkYiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik04LjAwMDY3ODg2LDEzLjU0MDI2ODEgQzguMDAwNjc4ODYsMTMuNzk1NTg2OSA3Ljc3NjE2NDU4LDE0IDcuNTAwNzc1OTksMTQgQzcuMjIzNjQxMTcsMTQgNywxMy43OTU1ODY5IDcsMTMuNTQwMjY4MSBMNyw4LjQ2MDU1MDY3IEM3LDguMjA1MjMxODIgNy4yMjM2NDExNyw4IDcuNTAwNzc1OTksOCBDNy43NzcwMzc2OSw4IDguMDAwNjYzMjcsOC4yMDYwMzYyIDguMDAwNjYzMjcsOC40NjA1NTA2NyBMOC4wMDA2NjMyNywxMy41NDAyNjgxIEw4LjAwMDY3ODg2LDEzLjU0MDI2ODEgWiIgaWQ9IlBhdGgtQ29weSIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=);
        }
      }
      .img2-hover {
        margin: 0 0;
        width: 18px;
        height: 19px;
        cursor: pointer;
        position: absolute;
        right: 20px;
        background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYwICg4ODEwMykgLSBodHRwczovL3NrZXRjaC5jb20gLS0+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTM8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZyBpZD0i6aOO6Zmp5o6S5p+lIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5qOA5p+l6aG555uuIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzkzLjAwMDAwMCwgLTMxMi4wMDAwMDApIiBmaWxsPSIjOUZDOEZFIiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8ZyBpZD0i5bem5L6nIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNzAuMDAwMDAwLCA5OC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJsZWZ0Ij4KICAgICAgICAgICAgICAgICAgICA8ZyBpZD0ibWVudSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDQ2LjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgICAgICA8ZyBpZD0i57yW57uELTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE5Ny4wMDAwMDAsIDE2OC4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik00MS43NjYyLDUuMTEwOCBDNDEuOTE1MzE0OSw0Ljk2ODg5MTY3IDQxLjk5OTcyMDEsNC43NzIwNDc2MSA0MS45OTk3MjAxLDQuNTY2MiBDNDEuOTk5NzIwMSw0LjM2MDM1MjM5IDQxLjkxNTMxNDksNC4xNjM1MDgzMyA0MS43NjYyLDQuMDIxNiBMMzkuOTc4NCwyLjIzMzggQzM5LjgzNjQ5MTcsMi4wODQ2ODUwNyAzOS42Mzk2NDc2LDIuMDAwMjc5OTIgMzkuNDMzOCwyLjAwMDI3OTkyIEMzOS4yMjc5NTI0LDIuMDAwMjc5OTIgMzkuMDMxMTA4MywyLjA4NDY4NTA3IDM4Ljg4OTIsMi4yMzM4IEwzNy40ODkyLDMuNjMzOCBMNDAuNDQzMiw2LjU4NzggTDQxLjc2NjIsNS4xMTA4IEw0MS43NjYyLDUuMTEwOCBaIE0yOCwxMy4wNDYgTDI4LDE2IEwzMC45NTU0LDE2IEwzOS41MTA4LDcuMzY2MiBMMzYuNTU2OCw0LjQxMjIgTDI4LDEzLjA0MzIgTDI4LDEzLjA0NiBaIiBpZD0i5b2i54q2Ij48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==");
        background-size: 100% 100%;
        &:hover {
          background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+57yW57uEIDLlpIfku70gMTQ8L3RpdGxlPgogICAgPGcgaWQ9IumjjumZqeaOkuafpSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuajgOafpemhueebriIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEyNzQuMDAwMDAwLCAtMzMwLjAwMDAwMCkiIGZpbGw9IiMwMDkxRkYiIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDM0LjAwMDAwMCwgOTguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtN+Wkh+S7vSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTYuMDAwMDAwLCAxODYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC0yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3ODQuMDAwMDAwLCA0Ni4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE1Ljc2NjIsNS4xMTA4IEMxNS45MTUzMTQ5LDQuOTY4ODkxNjcgMTUuOTk5NzIwMSw0Ljc3MjA0NzYxIDE1Ljk5OTcyMDEsNC41NjYyIEMxNS45OTk3MjAxLDQuMzYwMzUyMzkgMTUuOTE1MzE0OSw0LjE2MzUwODMzIDE1Ljc2NjIsNC4wMjE2IEwxMy45Nzg0LDIuMjMzOCBDMTMuODM2NDkxNywyLjA4NDY4NTA3IDEzLjYzOTY0NzYsMi4wMDAyNzk5MiAxMy40MzM4LDIuMDAwMjc5OTIgQzEzLjIyNzk1MjQsMi4wMDAyNzk5MiAxMy4wMzExMDgzLDIuMDg0Njg1MDcgMTIuODg5MiwyLjIzMzggTDExLjQ4OTIsMy42MzM4IEwxNC40NDMyLDYuNTg3OCBMMTUuNzY2Miw1LjExMDggTDE1Ljc2NjIsNS4xMTA4IFogTTIsMTMuMDQ2IEwyLDE2IEw0Ljk1NTQsMTYgTDEzLjUxMDgsNy4zNjYyIEwxMC41NTY4LDQuNDEyMiBMMiwxMy4wNDMyIEwyLDEzLjA0NiBaIiBpZD0i5b2i54q2Ij48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=");
        }
      }
      .img3-hover {
        margin: 0 0;
        width: 18px;
        height: 19px;
        cursor: pointer;
        position: absolute;
        right: 0px;
        background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+R3JvdXAgMTI8L3RpdGxlPgogICAgPGcgaWQ9IumjjumZqeaOkuafpSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuajgOafpemhueebriIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM2MS4wMDAwMDAsIC0zMTIuMDAwMDAwKSIgc3Ryb2tlPSIjOUZDOEZFIiBzdHJva2Utd2lkdGg9IjIiPgogICAgICAgICAgICA8ZyBpZD0i5bem5L6nIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNzAuMDAwMDAwLCA5OC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJtZW51IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgNDYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTEyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxOTEuMDAwMDAwLCAxNjguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yLDkgTDE2LDkgTTksMiBMOSwxNiIgaWQ9IuW9oueKtue7k+WQiCI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+");
        background-size: 100% 100%;
        &:hover {
          background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOXB4IiB2aWV3Qm94PSIwIDAgMTggMTkiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+R3JvdXAgMTI8L3RpdGxlPgogICAgPGcgaWQ9IumjjumZqeaOkuafpSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IuajgOafpemhueebriIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM4OS4wMDAwMDAsIC0zMTIuMDAwMDAwKSIgc3Ryb2tlPSIjMDA5MUZGIiBzdHJva2Utd2lkdGg9IjIiPgogICAgICAgICAgICA8ZyBpZD0i5bem5L6nIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNzAuMDAwMDAwLCA5OC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJtZW51IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgNDYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTEy5aSH5Lu9IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMTkuMDAwMDAwLCAxNjguMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yLDkgTDE2LDkgTTksMiBMOSwxNiIgaWQ9IuW9oueKtue7k+WQiCI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+");
        }
      }
      /deep/.el-tree-node__content {
        height: 45px;
      }
      /deep/.el-tree-node__label {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
      }
      /deep/.is-current > .el-tree-node__content {
        background: rgba(0, 145, 255, 0.1);
        border-left: 2px solid rgba(0, 145, 255, 1);
        color: rgba(0, 145, 255, 1);
      }
      /deep/.el-tree-node__content:hover {
        background: rgba(0, 145, 255, 0.1);
      }
    }
  }

  .right-content {
    border-radius: 4px;
    box-shadow: 0px 4px 14px 3px rgba(54, 121, 225, 0.09);
    border: 1px solid transparent;
    background: white;
    margin-left: 10px;
    // width: 1360px;
    width: calc(82% - 10px);
    min-width: 1050px;
    // height: calc(100vh - 115px);
    height: 100%;
    position: relative;
    .topHeader {
      height: 60px;
      background-color: #fff;
      padding: 15px 10px;
      display: flex;
      justify-content: space-between;
       .top-header__title{
         flex-grow: 1;
         flex-shrink: 0;
         border-left: 3px solid #0091FF;
         font-size: 16px;
         line-height: 20px;
         height:20px;
         font-weight: bold;
         padding: 0 0 0 14px;
      }
    }
    .FromWrap {
      height: calc(100% - 125px);
      // overflow: hidden;
      overflow-y: auto;
      overflow-x: hidden;
      /deep/ .el-table__expanded-cell {
        background-color: #f4f4f4;
        padding: 0px 0px 0px 100px;
      }
      .demo-table-expand {
        font-size: 0;
      }
      .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
      }
      .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
      }
      /deep/.el-table {
        -webkit-box-shadow: none;
        box-shadow: none;
        border: none;
        left: -1px;
        width: calc(100% + 3px);
        max-width: none;
        overflow-y: auto;
        /deep/thead div {
          font-size: 14px;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          th {
            height: 56px;
          }
        }
        /deep/tbody {
          div {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: normal;
            color: rgba(102, 102, 102, 1);
          }
          td {
            border-left: none;
            border-right: none;
            .button-view {
              margin: 0 auto;
              width: 27px;
              height: 25px;
              cursor: pointer;
              background: no-repeat
                url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAkCAYAAADl9UilAAAEDElEQVRYR+2Wb2hVZRzHv9/nrOlWU5molcSiMoTaIne79zZ7Y0QUQkLLEZTb7k3qTc02rSCDDDKodEvrTWH3bloQswQDKyLyTa57592grUCyohFWOhzO1aZr53zjzhn7c+89z50Vvtjz7pzn+/38vvzO8zznIS7Twcs0F+aC5ftl5jr2v3QsntJKelgLodLzVE5yCYCFE8UHJfUbw14QXTI4FAnw2H8W7JPjmtc/gA2e0ACoPL9C7DXE7sFS7GtYwfM2Xqs1FktoHYlmSDfYQLNqyJ8kNEXDPOjHyRmsvUNFww52S9roB8pnnuSeYhcNNVUcyebLGqwtqcUe8DGkqnyKWmvJDgM8UBfi6UyejMHeTmlh4Ri+BLTKutCshOweLcDdTwQ4ON0+I1i75Awn8ZmgeyxrDQD8CELvuJ4oB1QNoNTGT/CL4hDuqyHdyfoZweJfazuo522goNpGHbPpt0oMXZfCirTnlwCOX9OFkkLX2wWxzoojvhK5k1uzBms7qqDnqgOA4wcUFI+GnWgsoUcJvAro2gse/irguWiY78USboxgxI8FwDUeq+qq2HlR+0/HJLEtiU5BAV+Q0O+5vJEOHiTVmkkvsV4uDhhHP4JIH8A5B8FUXQhBkrqwIiZGW0IPedB+P8C4SXqr7Jxp7CvCCUFLM+8qniobwfK++V6LyCdtuAZcXxfmh1OCxRNeAkDIBkBy45iLbseoO6fe8HYKlZL22HABJCNhE54erAuA1fEgMGqAHkGpXAUJBjygglDMMlh3JGwqpwRrTaha0Hgb/QbBnWcHsLVksX6HsCijnjgzdJpXLyjFdkGb/ZjpecewujbIA1OCpR/iCX0FaLUF5ASW8Sb243F52pVxjRlu0hK8g5P6AcByfyaPRMK866Juyjm296hudV2lP2mhL4hsjoS4OZZUI6WXAJRMeIZEvhgNsSWe1E5ITb4sYNRxWFl7B7/NGCz9MpbQFkKvW8BAaMfZAfPCvKVwCl2Mr41RB13nT8FdUIqXBW2x4Qh8Jhrmjsnamf9Kia2d+EBSjQ0UQh+g941jetJ6z/UqAD4CoszGT7K9PoiHMXF+Ze1YeqK5Q0WLjA4RWGMDn61GwOEzHtc2Zbj+ZL327P1GV3oj2C/o/tkWzuUj+Kkpwvra2/hnxs2Ty7ztsAqun++9JvLpyX+JSwwqSm/8fM48u20Nx7KxrK7WrQndK+hNADdfYqjvCT5VH+bnfhyrYGlI+3cqHB5CvaRGECv9wFPmhWMkW4pL0FpzC0dtvNbBJsP2pbTqrzFvHckghAoAyyZdldIXvpMgeiR1XlFgDm4IMPc/NUPSWQWbwZH47hFclX7/2Gr8MX3r23RouubfCTabyj6euWD5NnWuY/l27G9733k0ycG80wAAAABJRU5ErkJggg==);
              background-size: 100% 100%;
              &:hover {
                background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAkCAYAAADl9UilAAADdElEQVRYR+2XW4iMYRjHf4/ZzIp1WDlfKKdcWMUK4YYkUpRFCjkkbtb3rXUqlFUox9357A3JIZScihJJ3LCx2b3AhZzKhXPWYckOOz16v92tmd2Z+d4Zh1zsczff9///n/88877P84zwn4b8p75oN5bpL9NesX9TsQM6HGUmUIhSAPRC6OYnVz4D7xEeADUIl1ktj/6eMU/DKIsRnGYz9rmMScVDOIEjURui3RmL6GxgPzDIRjQN5jlQiisXg3TSG9uvncjBQ1kRJJTRe+EwjTiUyvdUvNTGKrUnMS4BEzJKag+uIsQsiuVDMkpyYwe1G1FuoIy2z5MFUqglzBRWibkwCdHW2BkN8YarKFMtU9UhnEf9WwhCAUoRkG/FF67Tl+nMl1g8vq0xT3egbLIShePk4vKaeroz1Od84gn9yKOBCLDESkfYiSObUxvzdCxKFRCyEDyKK8up0EUIu4D+zZxXKBspkZNE9AiwzEIrhjABR6pbsHEVU8GjGmWMhdB7GhhMLnOAYynwS2ngArk88xtwUAj3cBgLok0noiU8nYtyNojffI4qqWMN+bxE6Z2UI7yjjgHkU45SbKk7D0fOJRqL6B1gnJWA6WsdqEWpTYvPYRQ/KcT0Lbu4iyvjE41VqJlrtu1hOXAfuBeQzxyLkYA5a8FhvmiJFLY2VoTglzEwhH3AZpQ3QPcU+E8IfQFzy9cGaja5KcKRC4nGzCdPb6FMtBB5SVeGUM9K1G8LbUNwyeMQX3gKDAjUFG7jyKQWXGIfi+gI1F9VOgYKmaHuyloqdA2wDSHP5yj1wFZKpJyImsqWBmopPxAKceVhcmPmaUTXAXsCxZoAexG2ECZEFP9sEKaGKDGU7YDRson1uLI3HphkVqoQ4TQw30YReIFwCvEvg6nYSJSFwEBL/hlcFrT0r9QVM2/MuhPiMjDZUjxb2E1izEy2/qRee/ZoZ8KcRZmRbda0POEKUeaxXr4lvzvp2GWaQw92AyUJU+L3nJqRU8FHNlAmjamk7FZrT6ehHACG/Z4nHiOsxpFrQTp2xoxKmXakB0sB0x6GBwm3em/+JZXzkWOUyQ8brr2xeLVKHU0jsxGzDfgjp0/cqmQWvrf+yFKqyeEixZJ+piZxmp2xNkJqNrIu/uONfG199W0q1Brzh4xlkzo9p91YpjVtr1imFfsFaaXrJVm90+MAAAAASUVORK5CYII=);
              }
            }
          }
          tr {
            background: none;
          }
          tr:hover {
            box-shadow: 0px 0px 11px 3px rgba(67, 85, 114, 0.1);
            td:nth-child(1) {
              border-left: 3px solid #0091ff;
            }
          }
        }
      }
    }
    .content-footer {
      .el-pagination {
        position: absolute;
        bottom: 5px;
        right: 30px;
        /deep/.el-pagination__total {
          font-size: 14px;
          color: rgba(96, 98, 102, 1);
          vertical-align: center;
          position: relative;
          top: 8px;
          right: 10px;
        }
        /deep/.number,
        /deep/.btn-prev,
        /deep/.btn-next,
        /deep/.more {
          border-radius: 3px;
          height: 42px;
          width: 42px;
          line-height: 42px;
          font-size: 14px;
          font-weight: normal;
          margin: 0;
          margin-right: 14px;
        }
        /deep/.el-pagination__sizes {
          /deep/.el-input__inner {
            border-radius: 3px;
            height: 42px;
            width: 107px;
            line-height: 42px;
            font-size: 14px;
          }
        }
        /deep/.el-pagination__jump {
          height: 42px;
          line-height: 42px;
          font-size: 14px;
          margin-left: 5px;
          /deep/.el-input__inner {
            border-radius: 3px;
            height: 42px;
            width: 38px;
            line-height: 42px;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
