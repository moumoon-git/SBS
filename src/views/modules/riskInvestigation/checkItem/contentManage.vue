<!--
 * @Author:yanghaoahao
 * @Date: 2020-10-30 11:11:17
 * @LastEditTime: 2020-11-24 17:12:24
 * @LastEditors: Please set LastEditors
 * @Description:风险排查的检查项目页面
 * @FilePath: \product_SBS\src\views\modules\riskInvestigation\checkItem\contentManage.vue
-->

<template>
  <div>
    <sv-template
      ref="template"
      :treeSetting="treeSetting"
      @tree-click="handleTreeClick"
      title="检查项目"
      :dateSelect="false"
      :searchSetting="{
        width:'255px',
        placeholder:'请输入检查项目名称、内容关键字'
        }"
      :exportSelectConfig="{
        api: '/investigation/investigationInfor/xlsOutputSelect',
        params: {},
      }"
      :exportQueryConfig="{
        api: '/investigation/investigationInfor/xlsOutputCondition',
        params: {
          type: this.checkType[this.checkType.length - 1],
        },
      }"
      :importDataConfig="{
        api: '/investigation/investigationInfor/xlsInput',
      }"
      :downloadTemplateConfig="{
        api: '/investigation/investigationInfor/gettemplate',
      }"
      :deleteSelectedConfig="{ api: '/investigation/investigationInfor/delete' }"
      :tableRequest="tableRequest"
    >
      <template #middle__operation__select>
        <el-cascader
          ref="myCascader"
          v-model="checkType"
          :options="options"
          :props="{value: 'id',label: 'name',checkStrictly: true}"
          :clearable="true"
          placeholder="检查类型"
          @change="optionChange"
          class="cascaderStyle"
        ></el-cascader>
      </template>
      <template #middle__operation__button>
        <sv-button @click="$refs.CheckTypeDialog.open">自定义检查类型</sv-button>
        <sv-button type="primary" @click="addItem">新增检查项目</sv-button>
      </template>
      <template #middle__table>
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="项目名称"
        ></el-table-column>
        <el-table-column
          prop="content"
          header-align="cneter"
          align="center"
          label="检查内容"
        ></el-table-column>
        <el-table-column
          prop="typeName"
          header-align="cneter"
          align="center"
          label="检查类型"
        ></el-table-column>
        <el-table-column
          header-align="cneter"
          align="center"
          width="150"
          label="操作"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="['edit', 'delete']"
              @edit="editContent(scope.row)"
              @delete="
                deleteIds = [scope.row.id];
                $refs.delete_hint.visible = true;
              "
            ></sv-table-operation>
          </template>
        </el-table-column>
      </template>
    </sv-template>
    <sv-dialog
      ref="dialog"
      :title="type === 0 ? '新增检查项目' : '编辑检查项目'"
      @confirm="addSubmit"
      class="add-task-dialog"
      @cancel="closeDialog"
    >
      <el-form
        :model="dataFormAdd"
        :rules="dataRuleAdd"
        ref="dataFormAdd"
        label-width="100px"
        class="dialog_form"
      >
        <el-form-item label="请选择分组" prop="selectTreeNodeName">
          <el-input
            v-model="dataFormAdd.selectTreeNodeName"
            @focus="selectTreeNode()"
            placeholder="选择分组"
            :readonly="true"
          ></el-input>
          <el-dialog
            title="请选择要新增到的分组节点"
            :visible.sync="selectTreeNodeVisible"
            append-to-body
            width="300px"
            class="selectGroupDialog"
          >
          <el-input
               clearable
               style="margin:10px;"
              placeholder="输入关键字进行过滤"
              v-model="filterText">
          </el-input>
            <el-tree
              :data="selectTreeList"
              :props="treeProp"
              node-key="id"
              ref="tree"
              @current-change="treeChangeHandle"
              :filter-node-method="filterNode"
              :highlight-current="true"
              :auto-expand-parent="true"
            ></el-tree>
            <div class="selectGroup_footer">
              <sv-button
                @click="selectTreeNodeVisible = false"
                >取消</sv-button
              >
              <sv-button
                @click="selectTreeNodeVisible = false"
                 type="primary"
                >确定</sv-button
              >
            </div>
          </el-dialog>
        </el-form-item>

        <el-form-item label="项目名称" prop="itemName">
          <el-input
            clearable
            v-model="dataFormAdd.itemName"
            placeholder="请填写项目名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="检查内容" prop="itemContent">
          <el-input
            type="textarea"
            placeholder="请输入检查内容"
            v-model="dataFormAdd.itemContent"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属类型" prop="itemType">
          <el-cascader
          v-model="dataFormAdd.itemType"
          :options="options"
          :props="{value: 'id',label: 'name'}"
          placeholder="请选择所属类型"
        ></el-cascader>
        </el-form-item>
      </el-form>
    </sv-dialog>
    <!-- 树的新增编辑弹窗 -->
    <el-dialog
      width="30%"
      :title="type === 0 ? '新增分组' : '修改分组'"
      :close-on-click-modal="false"
      :visible.sync="treeAddorUpdateDialogVisible"
      @closed="clearDialog()"
      class="dialog_tree"
    >
      <el-form
        :model="dataForm"
        ref="dataForm"
        :rules="dataRule"
        @keyup.enter.native="treeFormSubmit()"
        label-width="100px"
        class="tree_form"
      >
        <el-form-item label="分组名称" prop="name">
          <el-input
            v-model="dataForm.name"
            placeholder="请填写分组名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="请选择分组" prop="selectTreeNodeName">
          <el-input
            v-model="dataForm.selectTreeNodeName"
            @focus="selectTreeNode()"
            placeholder="选择分组"
            :readonly="true"
          ></el-input>
          <el-dialog
            title="请选择要新增到的分组节点"
            :visible.sync="selectTreeNodeVisible"
            append-to-body
            width="30%"
          >
            <el-tree
              :data="selectTreeList"
              :props="treeProp"
              node-key="id"
              ref="tree"
              @current-change="treeChangeHandle"
              :default-expand-all="true"
              :highlight-current="true"
              :auto-expand-parent="true"
              :expand-on-click-node="false"
            ></el-tree>
            <span slot="footer">
              <el-button
                @click="selectTreeNodeVisible = false"
                plain
                size="small"
                >取消</el-button
              >
              <el-button
                @click="selectTreeNodeVisible = false"
                plain
                size="small"
                >确定</el-button
              >
            </span>
          </el-dialog>
        </el-form-item>
        <el-form-item label="分组描述">
          <el-input
            type="textarea"
            placeholder="请填写分组描述"
            :row="2"
            v-model="dataForm.groupDesc"
          ></el-input>
        </el-form-item>
      </el-form>

      <div class="tree_foot">
        <el-button @click="clearDialog()">取消</el-button>
        <el-button type="primary" @click="treeDataFormSubmit()">确定</el-button>
      </div>
    </el-dialog>
    <sv-dialog-hint
      ref="delete_hint"
      type="delete"
      @confirm="deleteContent(deleteIds)"
    />
    <CheckTypeDialog
      ref="CheckTypeDialog"
      @refresh-type="getType"
    />
  </div>
</template>
<script>
import CheckTypeDialog from './CheckTypeDialog/CheckTypeDialog.vue';

export default {
  components: {
    CheckTypeDialog,
  },
  data() {
    return {
      filterText:'',
      deleteIds: [],
      //树弹窗布尔变量
      treeAddorUpdateDialogVisible: false,
      selectTreeNodeVisible: false,
      //树形控件数据
      selectTreeList: [],
      treeProp: {
        label: "name",
        children: "children",
      },
      taskList: [],
      //组Id
      groupIds: "",
      //当前选择的树节点
      currentNode: "",
      pageIndex: 1,
      //判断是新增还是编辑，为1是编辑,为0是新增
      type: 0,
      checkType: [],
      checkIdList: [],
      dataForm: {
        //已选择的分组名
        name: "",
        //树的搜索值
        searchName: "",
        //树Id
        treeId: "",
        //分组描述
        groupDesc: "",
        //父Id
        parentId: 0,
      },
      //新增树节点弹窗的参数
      dataFormAdd: {
        //选择的分组名称，这个是保存在选择分组时在弹窗里选择的值
        selectTreeNodeName: "",
        itemName: "",
        itemGroup: "",
        itemContent: "",
        itemType: "",
        id: "",
      },
      //新增表格的验证规则
      dataRule: {
        name: [
          {
            required: true,
            message: "请输入分组名称",
            trigger: "blur",
          },
        ],
      },
      //新增树弹窗表单的验证规则
      dataRuleAdd: {
        selectTreeNodeName: [
          {
            required: true,
            message: "请输入分组名称",
            trigger: "blur,change",
          },
        ],
        itemName: [
          {
            required: true,
            message: "请输入项目名称",
            trigger: "blur",
          },
        ],
        itemGroup: [
          {
            required: true,
            message: "请选择新增分组",
            trigger: "blur",
          },
        ],
        itemType: [
          {
            required: true,
            message: "请选择新增类型",
            trigger: "blur",
          },
        ],
        itemContent: [
          {
            required: true,
            message: "请填写检查内容",
            trigger: "blur",
          },
        ],
      },
      //使用自定义模板参数
      treeSetting: {
        tab: [],
        api: "/investigation/investigationGroup/listTree",
        edit: {
          add: "/investigation/investigationGroup/save",
          update: "/investigation/investigationGroup/update",
          delete: "/investigation/investigationGroup/delete",
        },
      },
      tableRequest: {
        api: "/investigation/investigationInfor/list",
        params: {
          groupIds: this.groupIds,
          type: this.checkIdList,
        },
      },
      options: [],
    };
  },
      watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
  mounted() {
    this.getType();
    this.getTreeData();
  },
  methods: {
    /**
       * @description: 选择分组时可以进行关键字过滤搜索
       * @param {*} value：获取到的输入框的值
       * @param {*} data：树的结构数据
       * @return {*}
       */
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      }
    ,
    /**
     * @description: 删除树节点，通过选中树id来进行删除，若树节点有数据，将无法进行删除
     * @param  选中的树节点的id
     * @return {type}
     */
    deleteTree(ids) {
      var that = this;
      if (this.$refs.template.tableList.length > 0) {
        this.$alert("请先删除分组里的内容", "提醒", {
          confirmButtonText: "确定",
        });
        return;
      }
      this.$confirm(`确定要进行[删除]操作?`, "提示", {
        customClass: "message-del",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        var checkedNames = "";
        if (that.groupIds.length > 0) {
          that.groupIds.forEach((item) => {
            if (item.system === 1) {
              checkedNames += item.name;
            }
          });
        }
        setTimeout(() => {
          if (checkedNames) {
            that.$message({
              message: `${checkedNames}删除失败`,
              type: "error",
              duration: 1500,
            });
            return 0;
          }
          that
            .$http({
              url: that.$http.adornUrl(
                `/investigation/investigationGroup/delete`
              ),
              method: "post",
              data: this.$http.adornData({
                ids: that.groupIds,
              }),
            })
            .then(({ data }) => {
              if (data && data.code === 0) {
                that.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                });
                this.$refs.template.getTree();
              } else {
                that.$message.error(data.msg);
              }
            });
        });
      });
    },
    /**
     * @description: 获取树节点的相关数据
     * @param {type}
     * @return {type}
     */
    getTreeData() {
      this.$http({
        url: this.$http.adornUrl("/investigation/investigationGroup/listTree"),
        method: "get",
        params: this.$http.adornParams({
          name: "",
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.taskList = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description: 编辑树节点，通过弹窗修改，最后表单验证更新
     * @param {type}
     * @return {type}
     */
    editTree() {
      this.type = 1;
      this.treeAddorUpdateDialogVisible = true;
      this.dataForm.name = this.currentNode.name;
      this.dataForm.parentId = this.currentNode.parentId;
      this.dataForm.groupDesc = this.currentNode.remark;
      this.dataForm.selectTreeNodeName = this.currentNode.name;
    },
    /**
     * @description:点击新增检查项目按钮触发，弹出新增的弹框
     * @param {type}
     * @return {type}
     */
    addItem() {
      this.type = 0;
      this.$refs.dialog.visible = true;

      if (this.currentNode.name == undefined) {
        this.dataFormAdd.selectTreeNodeName = "顶级分组节点";
      } else {
        this.dataFormAdd.selectTreeNodeName = this.currentNode.name;
      }
      this.dataFormAdd.itemName = "";
      this.dataFormAdd.itemContent = "";
      this.dataFormAdd.itemType = "";
      this.dataForm.parentId = this.currentNode.id;
    },
    /**
     * @description:新增树节点，通过弹窗新增，最后提交表单新增
     * @param {type}
     * @return {type}
     */
    addTree() {
      this.type = 0;
      this.treeAddorUpdateDialogVisible = true;
      this.dataForm.name = "";
      this.dataForm.groupDesc = "";
      this.dataForm.parentId = this.currentNode.id;
      this.dataForm.selectTreeNodeName = this.currentNode.name;
    },
    /**
     * @description:搜索框右边的新增，默认是新增顶级分组节点
     * @param {type}
     * @return {type}
     */
    addTreeNode() {
      this.type = 0;
      this.treeAddorUpdateDialogVisible = true;
      this.dataForm.name = "";
      this.dataForm.parentId = 0;
      this.dataForm.selectTreeNodeName = "顶级分组节点";
    },

    /**
     * @description:关闭新增和编辑树节点弹窗，关闭时会清除验证规则
     * @param {type}
     * @return {type}
     */
    clearDialog() {
      this.treeAddorUpdateDialogVisible = false;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
      });
    },
    /**
     * @description:新增修改树节点的表单提交
     * @param {type}
     * @return {type}
     */
    treeDataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid && (this.type === 0 || this.type === 1)) {
          this.$http({
            url: this.$http.adornUrl(
              `/investigation/investigationGroup/${
                this.type === 0 ? "save" : "update"
              }`
            ),

            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.treeId || undefined,
              parentId: this.dataForm.parentId,
              name: this.dataForm.name,
              remark: this.dataForm.treeRemark,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.treeAddorUpdateDialogVisible = false;
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
              });
              this.$refs.template.getTree();
            } else {
              this.$message.error("请选择您要新增到的分组");
            }
          });
        }
      });
    },
    /**
     * @description:选择分组
     * @param {type}
     * @return {type}
     */
    selectTreeNode() {
      this.selectTreeNodeVisible = true;
      this.$http({
        url: this.$http.adornUrl("/investigation/investigationGroup/listTree"),
        method: "get",
        params: this.$http.adornParams(),
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.selectTreeNodeName = "";
            data.data.splice(0, 0, { id: 0, name: "顶级分组节点" });
            this.selectTreeList = data.data;
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {
          // this.treeAddorUpdateDialogVisible = true;
        })
        .then(() => {
          this.eventTypeListTreeSetCurrentNode();
        });
    },
    /**
     * @description:选择分组节点的数据处理
     * @param {type}
     * @return {type}
     */
    treeChangeHandle(data, node) {
      this.dataForm.parentId = data.id;

      this.dataFormAdd.selectTreeNodeName = data.name;
    },
    /**
     * @description: 分组树设置当前选中节点
     * @param {type}
     * @return {type}
     */
    eventTypeListTreeSetCurrentNode() {
      this.$refs.tree.setCurrentKey(this.dataForm.treeId);
      this.dataFormAdd.selectTreeNodeName = (this.$refs.tree.getCurrentNode() ||
        {})["name"];
    },
  /**
     * @description: 循环获得tree的Id,用来回显所属分组名称
     * @param data 为点击行的行数据，目的是获得其id进行匹配，list则是原始tree结构 
     * @return {type} 
     */
    getAllId(data,list) {
      if (list != null && list.length > 0) {
        try {
          list.forEach((d) => {
            if (data.groupId === d.id) {
              this.dataFormAdd.selectTreeNodeName = d.name;
              throw Error();
            }
            if (d.children != null && d.children.length > 0) {
              this.getAllId(data,d.children);
            }
          });
        } catch (err) {}
      }
    },
    /**
     * @description: 编辑选择的表格行数据
     * @param {传入当前行的数据data}
     * @return {type}
     */
    editContent(data) {
      this.getAllId(data,this.taskList);

      this.type = 1;
      this.$refs.dialog.visible = true;

      this.dataFormAdd.itemName = data.name;
      this.dataFormAdd.itemContent = data.content;
      this.dataFormAdd.itemType = data.type;
      this.dataForm.parentId = data.groupId;
      this.dataFormAdd.id = data.id;
    },
    /**
     * @description:删除选中的表格的行数据
     * @param {传入当前行id}
     * @return {type}
     */
    deleteContent(ids) {
      const request = {
        method: "post",
        url: "/investigation/investigationInfor/delete",
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
    /**
     * @description: 点击树触发的事件
     * @param {type}
     * @return {type}
     */
    handleTreeClick(obj) {
      if (obj == null) {
        this.groupIds = [];
        this.currentNode = "";
        this.tableRequest.params.groupIds = this.groupIds;
      } else {
        this.currentNode = obj;
        this.groupIds = [];
        this.tableRequest.params.groupIds = this.groupIds;
        this.pageIndex = 1;

        if (obj.id == 0) {
          this.groupIds = [];
          this.tableRequest.params.groupIds = this.groupIds;
        } else {
          this.groupIds = [obj.id];
          this.tableRequest.params.groupIds = this.groupIds;
        }

        if (obj.children != null) this.getChildren(obj);

        this.dataForm.treeId = obj.id;
      }
      this.$refs.template.getTableList(this.tableRequest);
    },
    /**
     * @description: 点击树结点获取相应的子节点
     * @param {}
     * @return {}
     */
    getChildren(data) {
      if (data.children != null && data.children.length > 0) {
        data.children.forEach((d) => {
          this.groupIds.push(d.id);
          if (d.children != null && d.children.length > 0) {
            this.getChildren(d);
          }
        });
      }
      else{
        this.groupIds.push(data.id)
      }
    },
    /**
     * @description: 获取检查类型
     * @param {type}
     * @return {type}
     */
    getType() {
      this.$http({
        url: this.$http.adornUrl("/work/workProperty/treelist"),
        method: "post",
        params: this.$http.adornParams({
          module: "1",
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.options = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description: 新增弹窗的表单提交
     * @param {type}
     * @return {type}
     */
    addSubmit() {
      this.$refs["dataFormAdd"].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/investigation/investigationInfor/${
                this.type === 0 ? "save" : "update"
              }`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataFormAdd.id || undefined,
              name: this.dataFormAdd.itemName,
              groupId: this.dataForm.parentId,
              content: this.dataFormAdd.itemContent,
              type: this.dataFormAdd.itemType[this.dataFormAdd.itemType.length - 1],
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
              });

              this.$refs.dialog.visible = false;
              this.$refs.template.getTableList(this.tableRequest);
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    /**
     * @description:下拉框选择时进行搜索
     * @param {type}
     * @return {type}
     */
    optionChange() {
      // this.checkIdList = [];
      // this.getCheckNodesAndChildren(this.$refs.myCascader.getCheckedNodes()[0]);
      this.tableRequest.params.type = this.checkType[this.checkType.length - 1];
      // this.tableRequest.params.type = this.checkIdList;
      this.$refs.template.getTableList(this.tableRequest);
    },
    /**
     * @description:下拉框选择时进行搜索
     * @param {type}
     * @return {type}
     */
    getCheckNodesAndChildren(obj) {
      if (!obj) {
        return;
      }
      this.checkIdList.push(obj.value);
      obj.children.forEach((item) => {
        this.getCheckNodesAndChildren(item);
      });
    },
    /**
     * @description:关闭新增表格弹窗
     * @param {type}
     * @return {type}
     */
    closeDialog() {
      this.$refs.dialog.visible = false;

      this.$nextTick(() => {
        if (this.$refs["dataFormAdd"] !== undefined) {
          this.$refs["dataFormAdd"].resetFields();
        }
      });
    },
  },
};
</script>
<style src="./contentManage.scss" lang="scss" >
</style>
