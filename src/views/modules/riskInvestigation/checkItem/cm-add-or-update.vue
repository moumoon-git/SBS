<template>
  <div>
    <el-dialog
      :title="type==='add' ? '新增检查项目' : '修改检查项目'"
      :close-on-click-modal="false"
      :visible.sync="visible"
      @closed="clearDialog"
    >
      <el-form
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @keyup.enter.native="dataFormSubmit()"
        label-width="100px"
      >
        <el-form-item label="所属分组" ref="dataform" prop="eventTypeParentName">
          <el-dialog title="请选择要新增到的分组节点" :visible.sync="newgroups" width="30%" append-to-body>
            <el-tree
              :data="eventTypeList"
              :props="eventTypeListTreeProps"
              node-key="id"
              ref="eventTypeTree"
              @current-change="eventTypeListTreeCurrentChangeHandle"
              :default-expand-all="true"
              :auto-expand-parent="true"
              :highlight-current="true"
              :expand-on-click-node="false"
            ></el-tree>
            <span slot="footer" class="dialog-footer">
              <el-button @click="newgroups = false" plain size="small">取 消</el-button>
              <el-button type="primary" @click="newgroups = false" size="small">确 定</el-button>
            </span>
          </el-dialog>
          <el-input
            v-model="dataForm.eventTypeParentName"
            @focus="gettingfocus"
            v-popover:eventTypeListPopover
            placeholder="选择分组"
            :readonly="true"
          ></el-input>
          <el-input v-show="false" v-model="dataForm.parentId" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="检查项目" prop="itemName">
          <el-input v-model="dataForm.itemName" placeholder="检查项目"></el-input>
        </el-form-item>
        <el-form-item label="检查内容" prop="remark">
          <el-input v-model="dataForm.remark" placeholder="检查内容"></el-input>
        </el-form-item>
        <el-form-item label="检查类型" prop="infoType">
          <el-select clearable v-model="dataForm.infoType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item size="mini" label="授权">
          <el-tree
            :data="menuList"
            :props="menuListTreeProps"
            node-key="menuId"
            ref="menuListTree"
            :default-expand-all="true"
            show-checkbox>
          </el-tree>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="destroySelf">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { treeDataTranslate } from "@/utils";
import CmTree from "./cm-tree";
import GroupSelect from "@/views/common/groupselect";
import $ from "jquery";

export default {
  components: {
    GroupSelect,
    CmTree,
  },
  props: ["currentNode"],
  mounted() {
    if (this.currentNode) {
      this.dataForm.eventTypeParentName = this.currentNode.name;
      this.dataForm.parentId = this.currentNode.id;
    }
  },
  data() {
    let self = this;
    return {
      options: [],
      //负责人数据
      contactorsData: [],
      choiceTreeList: [],
      choiceTreeProps: {
        label: "name",
        children: "children",
      },
      choiceId: "",
      choiceName: "",
      choiceType: "",
      selectedNode: [],
      contactorType: "",
      currentRow: "",
      buttonVisible: false,
      visible: false,
      newgroups: false,
      type: "",
      //选择负责人分页
      // 当前页数
      currPage: 1,
      // 每页显示条目个数
      pageSize: 10,
      // 总条目数
      totalCount: 0,
      //选择项目分页
      currDataPage: 1,
      dataPageSize: 5,
      dataTotalCount: 0,
      //提交数据
      dataForm: {
        id: "",
        name: "",
        infoType: "",
        itemName: "",
        groupId: "",
        groupIdName: "",
        remark: "",
        parentId: "",
        temp: 0,
        period: "",
        investigationTime: "",
        groupIds: [],
        eventTypeParentId: "",
        eventTypeParentName: "",
      },
      eventTypeList: [], // 树的数据
      eventTypeListTreeProps: {
        label: "name",
        children: "children",
      },

      dataRule: {
        eventTypeParentName: [
          { required: true, message: "请选择一个分组", trigger: "blur,change" },
        ],
        itemName: [
          { required: true, message: "检查项目不能为空", trigger: "blur" },
        ],
        remark: [
          { required: true, message: "检查内容不能为空", trigger: "blur" },
        ],
        infoType: [
          { required: true, message: "检查类型不能为空", trigger: "blur" },
        ],
      },

      searchDataForm: {
        searchData: "",
      },
      searchTreeName: "",
      treeList: [],
      treeProps: {
        children: "children",
        label: "name",
      },
      checkedIds: [],
      checkedNodes: [],
      Treeexpansion: true,
      dataListLoading: false,
      dataList: [],
      //勾选检查项目ID
      dataIds: [],
      //总共选择几项
      dataSelectedCount: 0,
    };
  },
  computed: {},
  watch: {
    deep: true,
    immediate: true,
  },

  methods: {
    destroySelf() {
      this.$emit("destroyAddOrUpdate");
    },
    getType() {
      this.$http({
        url: this.$http.adornUrl("/work/workProperty/treelist"),
        method: "post",
        params: this.$http.adornParams({
          module: "1",
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.options = [];
          console.log("data", data);
          data.data.forEach((item) => {
            this.options.push({ value: item.id, label: item.name });
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    gettingfocus(event) {
      this.newgroups = true;
      this.$http({
        url: this.$http.adornUrl("/investigation/investigationGroup/listTree"),
        method: "get",
        params: this.$http.adornParams(),
      })
        .then(({ data }) => {
          // console.log("22222222", data);
          if (data && data.code === 0) {
            this.eventTypeParentName = "";
            data.data.splice(0, 0, { id: 0, name: "顶级分组节点" });
            console.log("this.eventTypeList: ", data.data);
            // this.eventTypeList = treeDataTranslate(data.data, 'id')
            this.eventTypeList = data.data;
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {
          this.visible = true;
        })
        .then(() => {
          // 新增
          // this.dataForm.itemName = "";
          // this.dataForm.remark = "";
          this.eventTypeListTreeSetCurrentNode();
        });
    },

    // 分组树设置当前选中节点
    eventTypeListTreeSetCurrentNode() {
      this.$refs.eventTypeTree.setCurrentKey(this.dataForm.id);
      this.dataForm.eventTypeParentName = (this.$refs.eventTypeTree.getCurrentNode() ||
        {})["name"];
    },
    // 分组树选中
    eventTypeListTreeCurrentChangeHandle(data, node) {
      this.dataForm.parentId = data.id;
      this.dataForm.eventTypeParentId = data.id;
      this.dataForm.eventTypeParentName = data.name;
    },

    handleNodeClick(obj) {
      console.log("点击节点", obj);
      // this.platformId = obj.id;
      this.getDataList();
    },
    // 树形复选框勾选ID
    setCheckedIds(checkedIds, checkedNodes) {
      this.checkedIds = checkedIds;
      // console.log('this.checkedIds', this.checkedIds)
      this.checkedNodes = checkedNodes;
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/investigation/investigationInfor/list"),
        method: "post",
        data: this.$http.adornData({
          page: this.currDataPage,
          limit: this.dataPageSize,
          search: this.searchDataForm.searchData,
          groupIds: this.checkedIds,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.dataList.forEach((row) => {
            this.dataIds.forEach((id) => {
              if (row.id == id) {
                this.$nextTick(() => {
                  this.$refs.dataListRef.toggleRowSelection(row, true);
                });
              }
            });
          });
          this.dataTotalCount = data.page.totalCount;
        } else {
          this.dataList = [];
          this.$message.error(data.msg);
        }
        this.dataListLoading = false;
      });
    },
    //循环拼接数量显示
    makeCount(data) {
      if (data != null && data.length > 0) {
        data.forEach((d) => {
          // console.log("循环数据", d);
          if (d.groupCount != 0) {
            // console.log("111111111111111111111");
            d.name = d.name + "   (" + d.groupCount + ")";
          }
          if (d.children != null && d.children.length > 0) {
            this.makeCount(d.children);
          }
        });
      }
      // console.log("循环结束后数据", data);
      this.treeList = data;
    },
    //获取树形列表
    getTreeList() {
      this.$http({
        url: this.$http.adornUrl(
          `${
            this.type == "add"
              ? "/investigation/investigationGroup/listTree"
              : "/investigation/investigationTask/listTree"
          }`
        ),
        method: "get",
        params: this.$http.adornParams({
          taskId: this.dataForm.id,
          name: this.searchTreeName,
        }),
      }).then(({ data }) => {
        this.makeCount(data.data);
      });
    },
    //搜索树
    searchTree(name) {
      this.searchTreeName = name;
      this.getTreeList();
    },
    init(data, type) {
      console.log("你是什么妖魔鬼怪",data);
      //先清除数据
      this.clearDataForm();

      this.type = type;
      this.getType();
      this.getTreeList();
      //新增
      switch (type) {
        case "add":
          this.visible = true;
          this.dataForm.temp = 0;
          this.dataForm.itemName = "";
          this.dataForm.remark = "";
          this.dataForm.infoType = "";
          break;

        case "update":
          //修改
          this.dataForm.id = data.id;
          this.dataForm.temp = 1;
          this.dataForm.itemName = data.name;
          this.dataForm.remark = data.content;

          this.dataForm.infoType = data.type;
          this.$http({
            url: this.$http.adornUrl(
              `/investigation/investigationGroup/info/${this.dataForm.id}`
            ),
            method: "get",
            params: this.$http.adornParams(),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.name = data.data.name;
              this.dataForm.groupId = data.data.groupId;
              this.dataForm.groupIdName = data.data.groupIdName;
              this.dataForm.remark = data.data.remark;
              data.data.investigationInforEntities.forEach((d) => {
                this.dataForm.groupIds.push(d.id);
              });
              this.dataIds = this.dataForm.groupIds;
              this.dataList.forEach((row) => {
                this.dataForm.groupIds.forEach((id) => {
                  if (row.id == id) {
                    this.$nextTick(() => {
                      this.$refs.dataListRef.toggleRowSelection(row, true);
                    });
                  }
                });
              });
              this.dataSelectedCount = this.dataForm.groupIds.length;
            } else {
              this.$message.error(data.msg);
            }
          });

          break;
        default:
        // console.log("type异常......")
      }
      this.visible = true;
    },

    clearDataForm() {
      // console.log('clearDataForm')
      // this.dataForm.terminal = "";
      this.dataForm.name = "";
      this.dataForm.groupId = "";
      this.dataForm.groupIdName = "";
      this.dataForm.remark = "";
      this.dataForm.groupIds = [];
      this.dataSelectedCount = 0;
      this.dataIds = [];
      //this.dataForm.eventTypeParentName = "";
      // this.$refs.dataForm.resetFields();
    },
    //表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/investigation/investigationInfor/${
                this.dataForm.temp === 0 ? "save" : "update"
              }`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              name: this.dataForm.itemName,
              groupId: this.dataForm.parentId,
              content: this.dataForm.remark,
              type: this.dataForm.infoType,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
              });
              this.visible = false;
              this.$emit("refreshDataList");
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },

    clearDialog() {
      this.destroySelf()
      //  this.$refs["dataForm"].resetFields();
    },
  },
};
</script>

<style lang="less">
.left {
  .el-icon-location-outline {
    margin-left: 12px;
    color: blue;
  }
}

.taskTree {
  .el-aside {
    color: #333;
    text-align: center;
    height: calc(100vh - 300px);
    border: 1px solid #ebeef5;
    margin-top: 1px;
    padding-top: 10px;
  }
}

// 底线边框
.el-dialog__body {
  border-bottom: 1px solid #eceef2;
  margin-bottom: 10px;
}
.el-dialog__header {
  background-color: #f1f4f6;
}
</style>
