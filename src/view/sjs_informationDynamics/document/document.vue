<template>
  <div class="document_box">
    <div class="document_main">
      <div class="document_left">
        <div class="let_top">
          <el-button type="primary" size="small" @click="treeAdd"
            >新增</el-button
          >
          <el-button type="primary" size="small" @click="treeUpdat"
            >修改</el-button
          >
          <el-button type="primary" size="small" @click="treeDelet"
            >删除</el-button
          >
        </div>
        <div class="left_bottom">
          <div style="width: 100%; text-align: center">
            <el-alert
              style="position: absolute; bottom: 0"
              title="温馨提示"
              type="info"
              description="可拖动修改同级分组排序"
              show-icon
            ></el-alert>
          </div>

          <div style="width: 100%">
            <el-scrollbar style="height: 100%">
              <el-tree
                class="filter-tree"
                :filter-node-method="filterNode"
                :data="treeData"
                highlight-current
                :props="defaultProps"
                @node-click="handleNodeClick"
                ref="tree"
                accordion
                :default-expanded-keys="[indexKey]"
                node-key="id"
                :render-content="renderContent"
                draggable
                @node-drop="handleDrop"
                :allow-drop="allowDrop"
                :allow-drag="allowDrag"
              ></el-tree>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <div class="document_right">
        <div class="right_top">
          <div class="right_top_button">
            <el-button type="primary" size="small" @click="tableAdd"
              >新增</el-button
            >
            <el-button type="primary" size="small" @click="tableUpdate"
              >修改</el-button
            >
            <el-button type="primary" size="small" @click="tableDelet"
              >删除</el-button
            >
          </div>
          <div class="right_bottom_search">
            <el-col :span="18">
              <el-input
                type="text"
                size="small"
                v-model="searchText"
                placeholder="输入标题/关键字/文件号/制定单位"
              ></el-input>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" size="small" @click="findTable"
                >查找</el-button
              >
            </el-col>
          </div>
        </div>
        <div class="right_bottom">
          <el-scrollbar style="height: 100%">
            <el-table
              :data="tableData"
              border
              stripe
              highlight-current-row
              @row-click="handleClick"
              style="width: 100%"
            >
              <el-table-column
                prop="title"
                label="标题"
                width="180"
              ></el-table-column>
              <el-table-column
                prop="keywords"
                label="关键词"
                width="180"
              ></el-table-column>
              <el-table-column prop="fileNo" label="文件号"></el-table-column>
              <el-table-column prop="dept" label="制定单位"></el-table-column>
              <el-table-column
                prop="publishTime"
                :formatter="formatterFun"
                label="发布时间"
              ></el-table-column>
              <el-table-column
                prop="publishTime"
                :formatter="formatterFun"
                label="操作"
              >
                <template slot-scope="scope">
                  <div
                    style="
                      display: flex;
                      justify-content: space-around;
                      align-items: center;
                    "
                  >
                    <el-button
                      type="text"
                      icon="el-icon-download"
                      style="font-size: 20px"
                      @click="handleShowAtt(scope.row.id)"
                    ></el-button>

                    <el-dropdown trigger="click">
                      <a
                        href="javascript:void(0)"
                        @click="editWord(scope.row.id)"
                        class="el-dropdown-link"
                        ><i
                          class="el-icon-edit"
                          style="
                            font-size: 18px;
                            color: #409eff;
                            cursor: pointer;
                          "
                        ></i
                      ></a>
                      <el-dropdown-menu slot="dropdown">
                        <template v-if="attList.length > 1">
                          <el-dropdown-item
                            v-for="item in attList"
                            :key="item.id"
                          >
                            <a
                              href="javascript:void(0)"
                              @click="editCurrentWord(item)"
                              ><i
                                style="vertical-align: middle"
                                :class="fileType[item.extension]"
                              ></i
                              >{{ item.title + "." + item.extension }}</a
                            >
                          </el-dropdown-item>
                        </template>
                      </el-dropdown-menu>
                    </el-dropdown>
                    <i
                      class="iconfont icon-lishi"
                      style="font-size: 18px; color: #409eff; cursor: pointer"
                      @click="watchHistory(scope.row.id)"
                    ></i>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </div>
        <div style="width: 100%; margin-top: 60px; text-align: center">
          <el-pagination
            :page-size="pageSize"
            :total="total"
            :current-page="currentPage"
            @current-change="handleCurrentChange"
            layout="prev, pager, next,total"
          ></el-pagination>
        </div>
      </div>
    </div>

    <el-dialog
      :visible="dialogVisible"
      :title="title"
      width="480px"
      @close="closeOuterSphere"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-position="right"
        label-width="100px"
      >
        <el-form-item v-show="title == '修改分组'" label="所选分组:">
          <el-col :span="18">
            <el-input v-model="currentGroupName" disabled></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="分组名称:" prop="groupName">
          <el-col :span="18">
            <el-input
              v-model="ruleForm.groupName"
              show-word-limit
              maxlength="10"
            ></el-input>
          </el-col>
        </el-form-item>

        <el-form-item
          label="上级分组:"
          prop="parentName"
          v-show="title == '新增分组'"
        >
          <el-col :span="18">
            <el-input v-model="ruleForm.parentName" disabled></el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="cancelDialog(true)"
              >选择</el-button
            >
          </el-col>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        @click="submitForm(1)"
        v-show="title == '新增分组'"
        >保存并新增</el-button
      >
      <el-button
        type="primary"
        @click="submitForm(2)"
        v-show="title == '修改分组'"
        :disabled="isSameName"
        >保存并修改</el-button
      >
    </el-dialog>

    <!--内层弹窗-->
    <el-dialog
      width="400px"
      :visible.sync="innerVisible"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-row>
        <el-col :span="20">
          <el-input
            clearable
            placeholder="输入关键字搜索"
            v-model="filterText"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            style="width: 100%; padding-right: 0; padding-left: 0"
            @click="filterTexts"
            >搜索</el-button
          >
        </el-col>
      </el-row>
      <el-scrollbar>
        <el-tree
          style="height: 300px"
          class="filter-tree"
          :data="treeData"
          :accordion="true"
          :props="defaultProps"
          :filter-node-method="coreFilterNode"
          :default-expand-all="isExpand"
          @node-click="coreHandleNodeClick"
          ref="tree"
          node-key="id"
          highlight-current
        ></el-tree>
      </el-scrollbar>
      <div slot="footer" style="text-align: center">
        <el-button size="mini" @click="cancelDialog(false)">取消</el-button>
        <el-button size="mini" type="primary" @click="affirmDialog"
          >确认</el-button
        >
      </div>
    </el-dialog>
    <!--表格新增||修改弹窗-->
    <work-popup
      ref="WorkPopup"
      @getTableData="getTableData"
      @selectTreeType="selectTreeType"
    ></work-popup>
    <attachment-popup ref="AttachmentPopup"></attachment-popup>
    <watch-history
      v-if="watchHistoryVisible"
      ref="watchHistory"
      @closeHistory="watchHistoryVisible = false"
    ></watch-history>
  </div>
</template>

<script>
import workPopup from "@/view/sjs_informationDynamics/document/tableDialog";
import attachmentPopup from "@/view/sjs_informationDynamics/attachmentPopup";
import watchHistory from "@/view/sjs_informationDynamics/document/watchHistory"; // 查看编辑历史
import { debounce } from "@/utils/common.js";
const UrlRoot = window.g.ApiUrl;
export default {
  name: "document",
  components: {
    workPopup,
    attachmentPopup,
    watchHistory,
  },
  data() {
    return {
      treeData: [],
      indexKey: 0,
      defaultProps: {
        children: "children",
        label: "name",
      },
      fileType: {
        doc: "icon-word",
        docx: "icon-word",
        xls: "icon-excel",
        XLS: "icon-excel",
        xlsx: "icon-excel",
        XLSX: "icon-excel",
        pdf: "icon-pdf",
        png: "icon-pic",
        PNG: "icon-pic",
        jpg: "icon-pic",
        jpeg: "icon-pic",
        gif: "icon-pic",
        txt: "icon-txt",
        zip: 'icon-zip',
        rar: 'icon-rar'
      },
      tableData: [],
      dialogVisible: false,
      title: "新增分组",
      ruleForm: {
        groupName: "", //分组名称
        parentName: "", //上级分组
      }, //表单变量
      rules: {
        groupName: [
          {
            required: true,
            trigger: "blur",
            message: "分组名称不能为空",
          },
          { required: true, validator: this.sameName, trigger: "change" },
        ],
      }, //表单验证
      innerVisible: false,
      filterText: "",
      isExpand: false,
      currentGroupParent: {
        id: "",
        name: "",
      },
      parentID: "", //left树父id
      parentName: "", //left树父name
      currentGroupName: "", //要修改组的名称
      treeNodeData: {
        //left选中时的节点
        id: "",
        name: "",
      },
      classId: "", //树ID
      searchText: "", //搜索
      currentPage: 1,
      pageSize: 10,
      total: 0,
      rowData: null,
      dialogVisibleType: "树新增",
      attList: [],
      isSameName: false,
      watchHistoryVisible: false, // 编辑历史弹窗
      wordUrl: "",
    };
  },
  mounted() {
    this.getLeftTree();
  },
  watch: {
    filterText(val) {
      if (val == "" || val == null || val == undefined) {
        this.$refs.tree.filter(val);
      }
    },
    classId: {
      handler(newL, oldL) {
        if (newL !== oldL) {
          console.log("点击树的id：", newL);
          this.rowData = null;
          this.searchText = "";
          this.currentPage = 1;
          // this.treeNodeData={
          //     id:'',
          //     name:''
          // };
          this.currentGroupParent = {
            id: "",
            name: "",
          };
          this.ruleForm = {
            groupName: "",
            parentName: "",
          };
          this.currentGroupName = "";
          this.parentName = "";
          this.parentID = "";
          this.filterText = "";
        }
      },
      deep: true,
    },
  },
  methods: {
    //切割时间
    formatterFun(row) {
      if (row.publishTime) {
        let dateTime = row.publishTime.split(" ", 1);
        return dateTime;
      }
    },
    //查找表格
    findTable() {
      this.currentPage = 1;
      this.getTableData();
    },
    //新增||修改后刷新表格
    getTableData() {
      let data = {
        classId: this.classId,
        searchText: this.searchText,
        page: this.currentPage,
        size: this.pageSize,
      };
      this.$api.listFileClass(data).then((res) => {
        if (res.errorcode == 0) {
          this.tableData = res.data.data;
          this.total = res.data.totalElements;
        }
      });
    },
    //表格新增
    tableAdd() {
      if (this.classId) {
        this.$nextTick(() => {
          this.$refs.WorkPopup.isDialogVisible = true;
          this.$refs.WorkPopup.title = "新增";
          this.dialogVisibleType = "表格新增";
          this.$refs.WorkPopup.workForm.type = this.classId;
          console.log(this.treeNodeData);
          this.$refs.WorkPopup.workForm.typeName = this.treeNodeData.name;
          this.$refs.WorkPopup.workForm.type = this.treeNodeData.id;
        });
      } else {
        this.$message({
          message: "请先选择需要添加的分组",
          type: "warning",
        });
      }
    },
    //表格修改
    tableUpdate() {
      if (this.rowData) {
        this.$refs.WorkPopup.isDialogVisible = true;
        this.$refs.WorkPopup.title = "修改";
        this.$refs.WorkPopup.showData(this.rowData);
      } else {
        this.$message({
          message: "请点击表格进行选择",
          type: "warning",
        });
      }
    },
    //表格删除
    tableDelet() {
      if (!this.rowData) {
        this.$message({
          message: "请选中表格中任意行进行删除!",
          type: "warning",
        });
      } else {
        let data = {
          id: this.rowData.id,
        };
        this.$confirm("删除当前信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.$api.deleteFileClass(data).then((res) => {
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
                return;
              }
              this.$message({
                message: "删除成功!",
                type: "success",
              });
              this.getTableData();
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除!",
            });
          });
      }
    },
    handleClick(row) {
      this.$nextTick(() => {
        this.rowData = row;
        console.log("row:", row);
      });
    },
    getLeftTree() {
      this.$api.listClass({}).then((res) => {
        if (res.errorcode == 0) {
          this.treeData = res.data;
        }
      });
    },
    //分页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableData();
    },
    //弹窗关闭时
    closeOuterSphere() {
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
        this.currentGroupName = "";
        this.treeNodeData.id = "";
        this.treeNodeData.name = "";
        this.currentGroupParent.id = "";
        this.currentGroupParent.name = "";
        this.parentID = "";
        this.parentName = "";
        this.dialogVisible = false;
      });
    },
    // 判断是否重名
    sameName(rule, value, callback) {
      return new Promise((resolve, reject) => {
        if (this.currentGroupName === this.ruleForm.groupName) {
          // this.$message({
          //     type: 'warning',
          //     message: '名字相同，不可修改'
          // })
          reject("修改名字与原名相同");
          this.isSameName = true;
          console.log(this.isSameName);
        } else {
          this.isSameName = false;
          resolve();
        }
      });
    },
    async isDuplicateName() {
      return new Promise((resolve, reject) => {
        if (!this.parentID) {
          if (
            this.treeData.filter(
              (item) => item.name === this.ruleForm.groupName
            ).length > 0
          ) {
            this.$message({
              type: "warning",
              message: "您输入的名称出现重复，请重新输入",
            });
            reject("重名了");
          } else {
            resolve();
          }
        }
        var loop = function (data, parentId, groupName, that) {
          data.forEach((item) => {
            if (item.id === parentId) {
              console.log("二级");
              console.log(item);
              // 判断二级是否同名
              if (item.children.length > 0) {
                console.log("二级");
                console.log(
                  item.children.filter((el) => el.name === groupName)
                );
                if (
                  item.children.filter((el) => el.name === groupName).length > 0
                ) {
                  that.$message({
                    type: "warning",
                    message: "您输入的名称出现重复，请重新输入",
                  });
                  reject("重名了");
                } else {
                  resolve();
                }
              } else {
                resolve();
              }
            } else {
              loop(item.children, parentId, groupName, that);
            }
          });
        };
        if (this.parentID) {
          const that = this;
          loop(this.treeData, this.parentID, this.ruleForm.groupName, that);
          // this.treeData.forEach(item => {
          //     if (item.id === this.parentID) {
          //         console.log('二级')
          //         console.log(item)
          //         // 判断二级是否同名
          //         if (item.children.length > 0) {
          //             console.log('二级')
          //             console.log(item.children.filter(el => el.name === this.ruleForm.groupName))
          //             if (item.children.filter(el => el.name === this.ruleForm.groupName).length > 0) {
          //                 this.$message({
          //                     type: 'warning',
          //                     message: '您输入的名称出现重复，请重新输入'
          //                 })
          //                 reject('重名了');
          //             } else {
          //                 resolve()
          //             }
          //         } else {
          //             resolve()
          //         }
          //     } else {
          //         item.children.forEach(el => {
          //             if (el.id === this.parentID) {
          //                 console.log('三级')
          //                 // 判断三级是否同名
          //                 if (el.children.length > 0) {
          //                     console.log(el.children.filter(i => i.name === this.ruleForm.groupName))
          //                     if (el.children.filter(i => i.name === this.ruleForm.groupName).length > 0) {
          //                         this.$message({
          //                             type: 'warning',
          //                             message: '您输入的名称出现重复，请重新输入'
          //                         })
          //                         reject('重名了');
          //                     } else {
          //                         resolve()
          //                     }
          //                 } else {
          //                     resolve()
          //                 }
          //             } else {
          //                 resolve()
          //             }
          //         })
          //     }
          // })
        }
      });
    },
    //新增||修改保存时
    submitForm: debounce(function(key) {
      //key 1为新增 2为修改
      console.log("树：", this.treeData);
      this.$refs["ruleForm"].validate(async (valid) => {
        if (valid) {
          let res = await this.isDuplicateName();
          // console.log('res: ', res);
          if (key == 1) {
            console.log("分组id：", this.parentID, this.ruleForm.groupName);
            // 判断同等级是否重名
            let data = {
              pid: this.parentID,
              name: this.ruleForm.groupName,
            };
            this.$api.addlistClass({ data }).then((res) => {
              if (res.errorcode == 0) {
                this.$message({
                  message: "新增成功",
                  type: "success",
                });
                this.getLeftTree();
                this.dialogVisible = false;
              }
            });
          } else if (key == 2) {
            let data = {
              id: this.treeNodeData.id,
              name: this.ruleForm.groupName,
            };
            console.log("修改：", data);
            this.$api.updatelistClass({ data }).then((res) => {
              if (res.errorcode == 0) {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.getLeftTree();
                this.dialogVisible = false;
              }
            });
          }
        }
      });
    },500),
    selectTreeType() {
      this.dialogVisibleType = "表格新增";
      this.cancelDialog(true);
    },
    //内层确认按钮
    affirmDialog() {
      if (
        this.currentGroupParent.name != "" ||
        this.currentGroupParent.id != ""
      ) {
        if (this.dialogVisibleType == "树新增") {
          console.log("树新增");
          this.ruleForm.parentName = this.currentGroupParent.name;
          this.parentID = this.currentGroupParent.id;
          this.cancelDialog(false);
        }

        if (this.dialogVisibleType == "表格新增") {
          console.log("表格新增");
          console.log(this.currentGroupParent);
          this.$refs.WorkPopup.workForm.typeName = this.currentGroupParent.name;
          this.$refs.WorkPopup.workForm.type = this.currentGroupParent.id;
          this.cancelDialog(false);
        }
      } else {
        this.$message({
          message: "请选择分组!",
          type: "warning",
        });
      }
    },
    //内层树节点点击
    coreHandleNodeClick(data, node) {
      this.currentGroupParent = {
        id: data.id,
        name: data.name,
      };
    },
    //内层数节点搜索
    coreFilterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //外层树节点搜索
    filterTexts() {
      this.$refs.tree.filter(this.filterText);
    },
    //上级树选择
    cancelDialog(key) {
      this.innerVisible = key;
    },
    //left树新增
    treeAdd() {
      this.title = "新增分组";
      this.dialogVisibleType = "树新增";
      this.dialogVisible = true;
    },
    //left树修改
    treeUpdat() {
      console.log("修改：", this.treeNodeData);
      if (this.treeNodeData.id == "" || this.treeNodeData.name == "") {
        this.$message({
          message: "请先选择要修改的节点!",
          type: "warning",
        });
      } else {
        this.title = "修改分组";
        this.dialogVisible = true;
        this.currentGroupName = this.treeNodeData.name;
      }
    },
    //left树删除
    treeDelet() {
      if (this.treeNodeData.id == "" || this.treeNodeData.name == "") {
        this.$message({
          message: "请先选择要删除的分组!",
          type: "warning",
        });
        return;
      }
      this.$confirm("确定删除该分组?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$api
            .deleteClasslistClass({ id: this.treeNodeData.id })
            .then((res) => {
              if (res.errorcode == 0) {
                this.$message({
                  message: "删除成功",
                  type: "success",
                });
                this.getLeftTree();
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //left树搜索
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //left点击树形菜单
    handleNodeClick(data, node) {
      this.classId = data.id;
      this.treeNodeData = { id: data.id, name: data.name }; //当前选中名称
      this.parentID =
        node.parent.data.id == undefined ? 0 : node.parent.data.id; //父级ID
      this.parentName =
        node.parent.data.name == undefined ? "" : node.parent.data.name; //父级名称
      this.getTableData();
      console.log("当前点击的数据：", this.treeNodeData);
      // this.$refs.tableForm.getTable(this.treeID);
    },
    //left拖拽时判定目标节点能否被放置
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.level === dropNode.level) {
        if (draggingNode.parent.id === dropNode.parent.id) {
          // 向上拖拽 || 向下拖拽
          return type === "prev" || type === "next";
        }
      } else {
        // 不同级进行处理
        return false;
      }
    },
    //left判断节点能否被拖拽
    allowDrag(draggingNode) {
      let groupName = this.treeData[0].name;
      return draggingNode.data.name.indexOf(groupName) === -1;
    },
    //left拖拽成功完成时触发的事件
    handleDrop(draggingNode, dropNode, dropType, ev) {
      let arr = [];
      for (let item of dropNode.parent.childNodes) {
        arr.push(item.data.id);
      }
      this.$api.orderlistClass({ ids: arr }).then((res) => {
        if (res.errorcode == 0) {
          this.getLeftTree();
        }
      });
    },
    renderContent(
      h,
      {
        //树形控件title提示
        node,
        data,
        store,
      }
    ) {
      return (
        <span class="custom-tree-node">
          <span class="el-tree-node__label" title={node.data.name}>
            {" "}
            {node.data.name}{" "}
          </span>{" "}
        </span>
      );
    },
    //获取附件数量
    getAtt(id) {
      //获取附件数量
      this.$api.detailFileClass({ id }).then((res) => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error",
          });
          return;
        }
        this.attList = res.data.att;
        console.log("文件列表", this.attList);
      });
    },
    // getAtt(id) {
    //     //获取附件数量
    //     this.$api.appDutyInformationReleasDetail({id}).then(res=>{
    //     if(res.errorcode!=0){
    //         this.$message({
    //         message:res.msg,
    //         type:"error"
    //         });
    //         return
    //     }
    //     this.attList = res.data.att
    //     console.log('文件列表：', this.attList)
    //     })
    // },
    //点击显示附件下载框
    handleShowAtt(id) {
      this.$nextTick(() => {
        this.getAtt(id);
        setTimeout(() => {
          this.$refs.AttachmentPopup.isDialogVisible = true;
          this.$refs.AttachmentPopup.showAtt(this.attList, id);
        }, 200);
      });
    },
    /**
     * @description: 点击显示编辑Word
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/1/7 10:54
     * @param {*} id // 选中当文行档Id
     * @return {*}
     */
    editWord(id) {
      this.$nextTick(() => {
        this.getAtt(id);
        // 等接口请求完在做逻辑
        setTimeout(() => {
          console.log("this.attList: ", this.attList);
          if (this.attList.length == 1) {
            let firstFile = this.attList[0];
            this.openWord(firstFile);
          }
        }, 300);
      });
    },
    /**
     * @description: 点击编辑选中文件
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/1/7 10:54
     * @param {*} item // 选中文件信息
     * @return {*}
     */
    editCurrentWord(item) {
      this.openWord(item);
    },
    /**
     * @description: 打开选中文件
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/1/7 10:54
     * @param {*} firstFile // 选中文件信息
     * @return {*}
     */
    openWord(firstFile) {
      var elink = document.createElement("a");
      elink.style.display = "none";
      if (!firstFile.exists) {
        this.$message({
          type: "info",
          message: "该文件不存在!",
        });
        return;
      }

      if (firstFile.extension == "doc" || firstFile.extension == "docx") {
        elink.href = `javascript:POBrowser.openWindowModeless('${UrlRoot}/pageoffice/word?filePath=${firstFile.path}&attachmentId=${firstFile.id}&fileId=${firstFile.fileId}
          ','width=1200px;height=800px;')`;
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      } else if (
        firstFile.extension == "xls" ||
        firstFile.extension == "xlsx"
      ) {
        elink.href = `javascript:POBrowser.openWindowModeless('${UrlRoot}/pageoffice/excel?filePath=${firstFile.path}&attachmentId=${firstFile.id}&fileId=${firstFile.fileId}
          ','width=1200px;height=800px;')`;
        document.body.appendChild(elink);
        elink.click();
        document.body.removeChild(elink);
      } else {
        this.$message.warning("请选择word/excel编辑");
      }
    },
    // 下载传真文件
    fileDownLoad(url) {
      window.open(
        `${
          window.g.ApiUrl
        }/eos/communication/pdf/download?filename=${url}&Authorization=${
          localStorage.getItem("token") ? localStorage.getItem("token") : ""
        }`
      );
    },
    /**
     * @description: 查看编辑文档历史
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/1/6 16:58
     * @param {*}
     * @return {*}
     */
    watchHistory(id) {
      this.watchHistoryVisible = true;
      this.$nextTick(() => {
        this.$refs.watchHistory.dialogVisible = true;
        this.$refs.watchHistory.initData(id);
      });
    },
  },
};
</script>

<style scoped>
.document_box {
  min-height: 800px;
  margin: 20px 30px;
  padding: 20px 0;
  box-sizing: border-box;
  text-align: left;
  height: calc(100vh - 120px);
  background-color: white;
  box-sizing: border-box;
}
.document_main {
  height: 100%;
  width: 100%;
  position: relative;
}
.document_left {
  position: absolute;
  left: 0;
  height: 100%;
  width: 20%;
  border-right: 1px solid #ddd;
}
.document_right {
  position: absolute;
  right: 0;
  height: 100%;
  width: 80%;
}
.let_top {
  width: 100%;
  text-align: left;
  padding-left: 20px;
  height: 40px;
  line-height: 40px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}
.right_top {
  display: flex;
  height: 40px;
  line-height: 40px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}
.right_top_button {
  flex: 4;
  text-align: left;
  padding-left: 20px;
}
.right_bottom_search {
  flex: 6;
  text-align: center;
}
.right_bottom {
  min-height: 500px;
  height: calc(100vh - 320px);
}
</style>
