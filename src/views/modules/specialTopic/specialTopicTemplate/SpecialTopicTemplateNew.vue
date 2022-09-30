<template>
  <div>
    <sv-template
      ref="template"
      :treeSetting="treeSetting"
      @tree-click="handleTreeClick"
      :tableRequest="tableRequest"
      :searchSetting="{
        width:'200px',
        placeholder:'请输入专题模板名称搜索'
        }"
      @tree-node-delete = "treeNodeDelete"
      title="专题模板"
    >
      <!-- 中间栏-头部-按钮 -->
      <template #middle__operation__button>
        <sv-button type="primary" @click="addTemplate">新增模板</sv-button>
      </template>
      <!-- 中间栏-表格内容 -->
      <template #middle__table>
        <el-table-column
          prop="name"
          label="专题模板名称"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="remark"
          label="专题模板描述"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="groupIdString"
          label="所属分组"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="gmtCreate"
          label="创建时间"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.status == 1">已发布</div>
            <div v-else>已停用</div>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="150"
          label="操作"
        >
          <template slot-scope="scope">
            <!-- <div
                        v-if="scope.row.status == 1"
                        @click="handleChangeState(scope.$index, scope.row)">停用</div>
                    <div
                        v-else
                        @click="handleChangeState(scope.$index, scope.row)">发布</div> -->
            <sv-table-operation
              :display="['stop', 'view', 'edit', 'delete']"
              @stop="handleChangeState(scope.row)"
              @view="handleLook(scope.row)"
              @edit="handleEdit(scope.row)"
              @delete="deleteIds = [scope.row.id];
                $refs.delete_hint.visible = true;"
              v-if="scope.row.status == 1"
            ></sv-table-operation>
            <sv-table-operation
              :display="['start', 'view', 'edit', 'delete']"
              @start="handleChangeState(scope.row)"
              @view="handleLook(scope.row)"
              @edit="handleEdit(scope.row)"
              @delete="deleteIds = [scope.row.id];
                $refs.delete_hint.visible = true;"
              v-else
            ></sv-table-operation>
          </template>
        </el-table-column>
      </template>
    </sv-template>
    <!-- 编辑专题弹框 -->
    <editSpecialTopicDialog ref="specialTopicDialog" @refreshTable="refreshTable"></editSpecialTopicDialog>
    <!-- 新增专题弹框 -->
    <addSpecialTopicDialog ref="addSpecialTopicDialog" @refreshTable="refreshTable"></addSpecialTopicDialog>
    <!-- 查看专题弹框 -->
    <LookSpecialTopicDialog
      ref="lookSpecialTopicDialog"
    ></LookSpecialTopicDialog>
    <!-- 删除分组弹框 -->
    <sv-dialog-hint
      ref="hint_tree_node_delete"
      type="submit"
      text="确认删除分组？"
      @confirm="confirmTTreeNodeDelete"
    />
    <!-- 删除提示弹窗 -->
    <sv-dialog-hint
      ref="delete_hint"
      type="delete"
      @confirm="handleDelete(deleteIds)"
    />
    <sv-dialog-hint ref="delete_fail" type="fail" text="抱歉！删除失败" />
  </div>
</template>
<script>
import LookSpecialTopicDialog from "./components/LookSpecialTopicDialog.vue";
import editSpecialTopicDialog from "./components/editSpecialTopicDialog.vue";
import addSpecialTopicDialog from "./components/addSpecialTopicDialog.vue";
import axios from 'axios';
export default {
  name: "specialTopicTemplateNew",
  data() {
    return {
      // 将要删除的树节点id
      treeIdWillBeDeleted: '',
      treeDeleteIdArr: [],//删除的节点及其子孙节点的id
      deleteIds: [],//删除某一行的id
      nodeMessage: {name: '',
          id: -1},//保存被选中的树节点的信息
      treeSetting: {
        tab: [],
        api: "/fk/fkTemplateGroup/list",
        edit: {
          add: "/fk/fkTemplateGroup/save",
          update: "/fk/fkTemplateGroup/update",
          delete: true
        },
        delete: true
      },
      tableRequest: {
        api: "/fk/fkTemplate/list",
        params: {
          groupIds: [],
          isNotice: "",
          period: ""
        }
      },
      treeIdArr: []
    };
  },
  methods: {
    /**
     * @description: 删除树节点
     * @param {*} data
     * @return {*}
     */
    treeNodeDelete(data) {
      this.treeIdWillBeDeleted = data.id;
      console.log('节点信息为',JSON.stringify(data))
      this.treeDeleteIdArr = []
      this.addDeleteGroupIds(data)
      this.$http({
        url: this.$http.adornUrl("/fk/fkTemplate/list"),
        method: "post",
        data: this.$http.adornData({
          groupIds: this.treeDeleteIdArr,
          page: 1,
          limit: 10,
          search: ''
        })
      }).then(({ data }) => {
        if (data && data.code == 0) {
          console.log('删除节点拿到的模板数据为',data)
          if(data.page.list.length != 0) {
            this.$message.error('该分组下有模板，无法删除，请先删除所有模板再删除该分组')
            
          }else {
             this.$refs.hint_tree_node_delete.visible = true;
             
          }
        }
      });
    },
     /**
     * @method
     * @desc 确认删除树节点
     */
    confirmTTreeNodeDelete() {
      const request = {
        method: 'post',
        url: '/fk/fkTemplateGroup/delete',
        baseURL: window.SITE_CONFIG.baseUrl,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          token: this.$refs.template.token,
        },
        data: {
          ids: [this.treeIdWillBeDeleted],
        },
      };
      axios(request)
        .then((response) => {
          if (response.data.code == 0) {
            this.$refs.template.getTree(null, null);
          } else {
             this.$refs.delete_fail.visible = true;
             this.$refs.delete_fail.supplementText = `错误代码：${data.code}`;
          }
        })
        .catch((error) => {
          this.$refs.delete_fail.supplementText = error;
          this.$refs.delete_fail.visible = true;
        });
    },
    /**
     * @description: 刷新表格
     * @param {*}
     * @return {*}
     */
    refreshTable() {
      this.$refs.template.getTableList(this.tableRequest);
    },
    /**
     * @description: 树节点的点击事件
     * @param {type} params
     * @return {type}
     */
    handleTreeClick(node, tabIndex) {
      console.log('node',node)
      if(node) {
         this.nodeMessage = node
         this.$refs.addSpecialTopicDialog.oldNodeMessage = node
      }else {
        this.nodeMessage = {
          name: '',
          id: -1
        }
      }
      this.treeIdArr = [];
      if (node != null) {
        this.addGroupIds(node);
      }
      this.tableRequest.params.taskGroups = [];
      this.tableRequest.params.inforGroups = [];
      switch (tabIndex) {
        case 0:
          this.tableRequest.params.groupIds =
            node == null ? [] : this.treeIdArr;
          break;
        case 1:
          this.tableRequest.params.groupIds =
            node == null ? [] : this.treeIdArr;
          break;
      }
      this.$refs.template.getTableList(this.tableRequest);
    },
    /**
     * @description: 获得当前节点及其子节点的id
     * @param {object} node: 当前节点对象
     * @return {type}
     */
    addGroupIds(node) {
      this.treeIdArr.push(node.id);
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          this.addGroupIds(node.children[i]);
        }
      }
      return;
    },
    /**
     * @description: 获得当前删除节点及其子节点的id
     * @param {object} node: 当前节点对象
     * @return {type}
     */
    addDeleteGroupIds(node) {
      this.treeDeleteIdArr.push(node.id);
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          this.addDeleteGroupIds(node.children[i]);
        }
      }
      return;
    },
    handleNodeOperation() {},
    addTemplate() {
      this.$refs.addSpecialTopicDialog.templateGroupNode = this.nodeMessage
      this.$refs.addSpecialTopicDialog.dialogVisible = true;
    },
    /**
     * @description: 修改模板状态
     * @param {int,object}  index:模板索引，row: 模板对象
     * @return {type}
     */
    handleChangeState(row) {
      let rowStatus = "";
      if (row.status == 1) {
        rowStatus = "2";
      } else {
        rowStatus = "1";
      }
      var that = this;
      this.$http({
        url: this.$http.adornUrl("/fk/fkTemplate/updateStatus"),
        method: "post",
        data: this.$http.adornData({
          id: row.id.toString(),
          status: rowStatus
        })
      }).then(({ data }) => {
        if (data && data.code == 0) {
          that.$refs.template.getTableList(this.tableRequest);
        }
      });
    },
    /**
     * @description:
     * @param {int,object} index:模板的索引,row: 模板的详细数据
     * @return {type}
     */
    handleLook(row) {
      this.$refs.lookSpecialTopicDialog.init(row.id);
      this.$refs.lookSpecialTopicDialog.dialogVisible = true;
    },
    /**
     * @description: 编辑模板
     * @param {int,object} index:模板的索引,row: 模板的详细数据
     * @return {type} 无
     */
    handleEdit(row) {
      this.$refs.specialTopicDialog.init(row);
      this.$refs.specialTopicDialog.dialogVisible = true;
    },
    /**
     * @description: 删除模板
     * @param {int,object} index:模板的索引,object: 模板的详细数据
     * @return {type} 无
     */
    // handleDelete(row) {
    //   var that = this;
    //   var ids = [];
    //   ids.push(row.id);
    //   this.$http({
    //     url: this.$http.adornUrl("/fk/fkTemplate/delete"),
    //     method: "post",
    //     data: this.$http.adornData({
    //       ids: ids
    //     })
    //   }).then(({ data }) => {
    //     console.log("删除后返回的数据为", data);
    //     if (data.code === 0) {
    //       that.$refs.template.getTableList(this.tableRequest);
    //     }
    //   });
    // },
     handleDelete(ids) {
       this.$http({
        url: this.$http.adornUrl("/fk/fkTemplate/delete"),
        method: "post",
        data: this.$http.adornData({
          ids: ids
        })
      }).then(({ data }) => {
        console.log("删除后返回的数据为", data);
        if (data.code === 0) {
          this.$refs.template.getTableList(this.tableRequest);
        }else {
            this.$refs.delete_fail.visible = true;
            this.$refs.delete_fail.supplementText = `错误代码：${data.code}`;
        }
      });
    },
  },
  components: {
    editSpecialTopicDialog,
    addSpecialTopicDialog,
    LookSpecialTopicDialog
  }
};
</script>
<style lang="less" scoped>
</style>