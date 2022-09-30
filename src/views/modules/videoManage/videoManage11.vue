<template>
  <div class="patrolRecord">
    <el-col :gutter="10">
      <el-col :span="4">
        <div class="treebox">
          <el-aside width="270px">
            <el-header
              style="height: 48px;padding: 5px;text-align: center;padding: 5px;display:flex"
              class="operation-btn"
            >
              <el-button type="success" size="mini" @click="showTree()" style>查看</el-button>

              <el-button type="primary" size="mini" @click="addTree()">添加</el-button>

              <el-button type="warning" size="mini" @click="updateTree()">修改</el-button>

              <el-button type="danger" size="mini" @click="deleteTree()">删除</el-button>
            </el-header>
            <el-form :inline="true" @keyup.enter.native="getDataList()" style="position: relative;">
              <el-form-item style="margin:5px 1px;">
                <el-input
                  @input="getTreeList"
                  class="treebox__inp"
                  placeholder="请输入巡查区域关键字"
                  v-model="searchTreeName"
                  clearable
                >
                  <!-- <i
                    slot="suffix"
                    class="el-icon-search"
                    @click="searchTree"
                    style="font-size:28px"
                  ></i>-->
                </el-input>
              </el-form-item>
            </el-form>
            <div :class="`treebox__wtf-${isAll ? 'click' : 'normal'}`" @click="allNodeClick">全部</div>

            <div class="treeClass">
              <el-tree
                class="treeboxbotten"
                :default-expand-all="Treeexpansion"
                @node-click="handleNodeClick"
                :data="treeList"
                :props="treeProps"
                node-key="id"
                style="padding-top: 10px;"
                current-node-key
                highlight-current
                show-checkbox
                @check="checkGroupNode"
                ref="tree"
              ></el-tree>
            </div>
          </el-aside>
        </div>
      </el-col>

      <el-col :span="20">
        <el-form
          :inline="true"
          :model="dataForm"
          @keyup.enter.native="getDataList()"
          style="position: relative;"
        >
          <el-form-item style="width:15vw">
            <el-input
              style="width:15vw;"
              v-model="dataForm.search"
              placeholder="请输入设备关键字"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="searchResult()" style="width:4vw">查询</el-button>
          </el-form-item>
          <el-form-item style="position:absolute;right:30px">
            <el-button size="small" @click="addTable()" style="width:4vw;background:#02A7F0">新增</el-button>
            <el-button
              size="small"
              @click="deleteHandle()"
              style="width:4vw;background:white;color:black"
            >删除</el-button>
          </el-form-item>
        </el-form>

        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%;"
          height="700"
          @selection-change="tableSelectionChange"
        >
          <el-table-column type="selection" header-align="left" align="center" width="55"></el-table-column>
          <el-table-column prop="name" header-align="center" align="center" label="设备名称">
            <!-- <template slot-scope="scope">
              <div style="display:flex;flex-direction:column;">
                <div v-if="scope.row.unusual > 0" class="patrolRecord__unusual">异常</div>
                <span>{{ scope.row.taskEntity.name }}</span>
              </div>
            </template>-->
          </el-table-column>
          <el-table-column prop="codeNum" header-align="center" align="center" label="号码">
            <!-- <template slot-scope="scope">
              <span>{{ `${Math.round(scope.row.unusual/(scope.row.usual + scope.row.unusual)*10000) / 100}%` }}</span>
            </template>-->
          </el-table-column>
          <el-table-column header-align="center" align="center" label="操作">
            <template slot-scope="scope">
              <img
                src="../../../assets/img/edit.svg"
                @click="getInfo(scope.row.id)"
                style="cursor:pointer;color:#02A7F0;width:20px"
              />
              <img
                src="../../../assets/img/del.svg"
                @click="deleteData(scope.row.id)"
                style="cursor:pointer;color:#D9001B;width:20px;"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </el-col>
    </el-col>
    <!-- <patrol-report ref="patrolReport"></patrol-report> -->

    <!-- 新增修改树 -->
    <el-dialog
      :title="treeTitle"
      :close-on-click-modal="false"
      :visible.sync="treeVisible"
      @closed="clearDialog"
    >
      <el-container>
        <el-header style="height:120px">
          <el-form
            :model="treeDialogForm"
            :rules="treeDataRule"
            ref="treeDialogForm"
            @keyup.enter.native="treeSubmit()"
            label-width="100px"
          >
            <el-form-item label="请选择分组" prop="eventTypeParentName" v-if="treeType==='add'">
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
                  <el-button @click="cancelTree()" plain size="small">取 消</el-button>
                  <el-button type="primary" @click="newgroups = false" size="small">确 定</el-button>
                </span>
              </el-dialog>
              <el-input
                v-model="treeDialogForm.eventTypeParentName"
                @focus="gettingfocus"
                v-popover:eventTypeListPopover
                placeholder="选择分组"
                :readonly="true"
              ></el-input>
              <el-input v-show="false" v-model="treeDialogForm.parentId" :readonly="true"></el-input>
            </el-form-item>

            <el-form-item label="分组名称" prop="name">
              <el-input
                v-model="treeDialogForm.name"
                placeholder="请填写分组名称"
                v-bind:readonly="treeType==='show'"
              ></el-input>
            </el-form-item>
            <el-form-item label="分组描述">
              <el-input v-model="treeDialogForm.gmtCreate"></el-input>
            </el-form-item>
          </el-form>
        </el-header>
        <el-footer class="treeFoor">
          <el-button @click="treeVisible = false" plain size="small">取消</el-button>
          <el-button type="primary" @click="treeSubmit()" size="small">确定</el-button>
        </el-footer>
      </el-container>
    </el-dialog>

    <!-- 新增会场终端 -->
    <el-dialog
      :title="tableTitle"
      :close-on-click-modal="false"
      :visible.sync="tableVisible"
      @closed="clearTable"
      width="27%"
    >
      <el-container>
        <el-header style="height:120px">
          <el-form
            :model="tableDialogForm"
            :rules="tableDataRule"
            ref="tableDialogForm"
            @keyup.enter.native="tableSubmit()"
            label-width="100px"
          >
            <el-form-item label="设备名称" prop="name">
              <el-input
                v-model="tableDialogForm.name"
                placeholder="请填写设备名称"
                v-bind:readonly="tableType==='show'"
              ></el-input>
            </el-form-item>

            <el-form-item label="设备号码" prop="codeNum">
              <el-input
                v-model="tableDialogForm.codeNum"
                placeholder="请填写设备号码"
                v-bind:readonly="tableType==='show'"
              ></el-input>
            </el-form-item>
            <el-form-item label="分组名称" prop="eventTypeParentName">
              <el-dialog
                title="请选择要新增到的分组节点"
                :visible.sync="newgroups2 "
                width="30%"
                append-to-body
              >
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
                  <el-button @click="cancelTree()" plain size="small">取 消</el-button>
                  <el-button type="primary" @click="newgroups2 = false" size="small">确 定</el-button>
                </span>
              </el-dialog>
              <el-input
                v-model="tableDialogForm.eventTypeParentName"
                @focus="gettingfocus"
                v-popover:eventTypeListPopover
                placeholder="选择分组"
                :readonly="true"
              ></el-input>
              <el-input v-show="false" v-model="tableDialogForm.parentId" :readonly="true"></el-input>
            </el-form-item>
          </el-form>
        </el-header>
        <el-footer class="tableFoor">
          <el-button @click="tableVisible = false" plain size="small">取消</el-button>
          <el-button type="primary" @click="tableSubmit()" size="small">保存</el-button>
        </el-footer>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
// import patrolTree from "./patrolComponents/patrol-tree";
// import patrolReport from "./patrolComponents/patrol-report";
import { platformTreeDataTranslate } from "@/utils";
import Cookies from "js-cookie";
const token = document.cookie;
const httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  data() {
    return {
      treeOrTable: "",
      //新增修改树
      treeTitle: "",
      treeVisible: false,
      newgroups: false,
      newgroups2: false,
      treeDialogForm: {
        id: "",
        parentId: "",
        name: "",
        gmtCreate: "",
        eventTypeParentId: "",
        eventTypeParentName: ""
      },
      treeType: "",
      eventTypeList: [], // 树的数据
      eventTypeListTreeProps: {
        label: "name",
        children: "children"
      },
      treeDataRule: {
        eventTypeParentName: [
          { required: true, message: "请选择一个分组", trigger: "blur" }
        ],
        name: [
          { required: true, message: "分组名称不能为空", trigger: "blur" },
          { min: 2, max: 20, message: "长度在2到20字左右", trigger: "blur" }
        ]
      },
      //新增修改会场
      tableTitle: "",
      tableVisible: false,
      tableDialogForm: {
        id: "",
        groupId: "",
        name: "",
        codeNum: "",
        parentId: "",
        eventTypeParentId: "",
        eventTypeParentName: ""
      },
      tableType: "",
      tableDataRule: {
        eventTypeParentName: [
          { required: true, message: "请选择一个分组", trigger: "blur" }
        ],
        name: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        codeNum: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ]
      },
      isAll: false, //是否点击全部
      // fullscreenLoading: false,
      // 获取到的token
      documenttoken: `${httpaddress}/mail/mailgroup/xlsInput?token=${this.$cookie.get(
        "token"
      )}`,
      // documenttoken: `${httpaddress}/mail/mailgroup/loading?${this.$cookie.get('token')}`,
      //搜索树
      searchTreeName: "",
      dataForm: {
        search: ""
      },
      treeId: "",
      treeIds: [],
      treeList: [],
      treeProps: {
        label: "name",
        children: "children"
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      //树状新增显示
      groupTreeCrudVisible: false,
      // 树形勾选框选中的id
      checkedIds: [],
      checkedNodes: [],
      Treeexpansion: false,
      //表格勾选选中的id
      tableCheckedIds: []
    };
  },
  components: {
    // "patrol-tree": patrolTree,
    // "patrol-report": patrolReport
    // AddOrUpdate,
    // TaskTree,
    // TreeAddOrUpdate
  },
  watch: {
    recordTime: function(newValue, oldValue) {
      if (newValue) {
        this.startTime =
          newValue[0].toLocaleDateString().replace(/\//gi, "-") + " 00:00:00";
        this.endTime =
          newValue[1].toLocaleDateString().replace(/\//gi, "-") + " 23:59:59";
      } else {
        this.startTime = "";
        this.endTime = "";
      }
    }
  },

  mounted() {
    this.getTreeList();
    this.getDataList();
  },
  methods: {
    // 新增
    addTable() {
      this.tableTitle = "新增";
      this.tableType = "add";
      this.treeOrTable = "table";
      this.tableDialogForm.parentId = "";
      this.tableVisible = true;
      this.$nextTick(() => {
        this.clearTable();
      });
    },
    //编辑详情
    getInfo(id) {
      this.tableDialogForm.id = id;
      this.tableTitle = "修改";
      this.tableType = "update";
      this.treeOrTable = "table";
      this.tableVisible = true;
      this.$http({
        url: this.$http.adornUrl(
          `/meeting/meetingCamera/infor/${this.tableDialogForm.id}`
        ),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.tableDialogForm.name = data.MeetingCamera.name;
            this.tableDialogForm.codeNum = data.MeetingCamera.codeNum;
            this.tableDialogForm.eventTypeParentName =
              data.MeetingCamera.groupIdName;
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {
          this.visible = true;
        });
    },
    //删除表单数据
    deleteData(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
            console.log("1111111111", item);
            return item.id;
          });
      // 对[id=${ids.join(",")}]进行[${id ? "删除" : "批量删除"}]操作
      this.$confirm(`确定删除?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log("删除ID", ids);
          this.$http({
            url: this.$http.adornUrl("/meeting/meetingCamera/delete"),
            method: "post",
            data: this.$http.adornData({
              ids: ids
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    },
    // 树形表单提交
    treeSubmit() {
      console.log("分组节点", this.treeDialogForm.eventTypeParentName);
      this.$refs["treeDialogForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/meeting/meetingCameraGroup/${
                this.treeType === "add" ? "save" : "update"
              }`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.treeDialogForm.id || undefined,
              parentId: this.treeDialogForm.parentId,
              name: this.treeDialogForm.name,
              remark: this.treeDialogForm.gmtCreate
            })
          }).then(({ data }) => {
            console.log(data.code);
            if (data && data.code === 0) {
              this.treeVisible = false;
              this.getTreeList();
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500
              });
            } else {
              this.$message.error("操作失败");
            }
          });
        }
      });
    },
    // 会场表单提交
    tableSubmit() {
      this.$refs["tableDialogForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/meeting/meetingCamera/${
                this.tableType === "add" ? "save" : "update"
              }`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.tableDialogForm.id || undefined,
              name: this.tableDialogForm.name,
              codeNum: this.tableDialogForm.codeNum,
              groupId: this.tableDialogForm.parentId
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.tableVisible = false;
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500
              });
              this.getDataList();
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    addTree() {
      this.treeDialogForm.name = "";
      this.treeDialogForm.gmtCreate = "";
      this.treeOrTable = "tree";
      this.treeType = "add";
      this.treeTitle = "新增";
      this.treeVisible = true;
    },
    showTree() {
      this.treeType = "show";
      this.treeTitle = "查看";
      this.treeOrTable = "tree";
      this.treeDialogForm.id = this.treeId;
      this.getTreeData();
    },
    updateTree() {
      if (!this.treeId) {
        this.$message.error("请选择一个分组!");
        return;
      }
      this.treeType = "update";
      this.treeTitle = "修改";
      this.treeOrTable = "tree";
      this.treeDialogForm.id = this.treeId;
      this.getTreeData();
    },
    getTreeData() {
      this.$http({
        url: this.$http.adornUrl(
          `/meeting/meetingCameraGroup/info/${this.treeId}`
        ),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log("修改数据", data.data);
          this.treeDialogForm.parentId = data.MeetingCameraGroupEntity.parentId;
          this.treeDialogForm.name = data.MeetingCameraGroupEntity.name;
          this.treeDialogForm.gmtCreate = data.MeetingCameraGroupEntity.remark;
          this.treeVisible = true;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    deleteTree() {
      var that = this;
      console.log("删除树", that.checkedIds);
      if (that.treeIds.length <= 0) {
        this.$message.error("请选择一个分组!");
        return;
      }
      this.$confirm(`确定要进行删除操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var checkedNames = "";
        if (that.treeIds.length > 0) {
          that.treeIds.forEach(item => {
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
              duration: 1500
            });
            return 0;
          }
          that
            .$http({
              url: that.$http.adornUrl(`/meeting/meetingCameraGroup/delete`),
              method: "post",
              data: this.$http.adornData({
                ids: that.treeIds
              })
              // data: that.$http.adornData(id)
            })
            .then(({ data }) => {
              if (data && data.code === 0) {
                that.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500
                });
                that.getTreeList();
                this.treeIds = [];
                this.getDataList();
              } else {
                that.$message.error(data.msg);
              }
            });
        });
      });
    },
    // 当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
    gettingfocus(event) {
      if (this.treeOrTable == "tree") {
        this.newgroups = true;
      }
      if (this.treeOrTable == "table") {
        this.newgroups2 = true;
      }
      this.$http({
        url: this.$http.adornUrl("/meeting/meetingCameraGroup/listTree"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          // console.log("22222222", data);
          if (data && data.code === 0) {
            this.eventTypeParentName = "";
            if (this.treeOrTable == "tree") {
              data.data.splice(0, 0, { id: 0, name: "顶级分组节点" });
            }
            // data.data.splice(0, 0, { id: 0, name: "顶级分组节点" });
            // console.log("this.eventTypeList: ", data.data);
            // this.eventTypeList = treeDataTranslate(data.data, 'id')
            this.eventTypeList = data.data;
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {
          if (this.treeOrTable == "tree") {
            this.treeVisible = true;
          }
          if (this.treeOrTable == "table") {
            this.tableVisible = true;
          }
        })
        .then(() => {
          // 新增
          this.eventTypeListTreeSetCurrentNode();
        });
    },
    // 分组树设置当前选中节点
    eventTypeListTreeSetCurrentNode() {
      if (this.treeOrTable == "tree") {
        this.$refs.eventTypeTree.setCurrentKey(this.treeDialogForm.id);
        this.treeDialogForm.eventTypeParentName = (this.$refs.eventTypeTree.getCurrentNode() ||
          {})["name"];
        this.treeDialogForm.eventTypeParentName = this.eventTypeList[0].name;
      }
      if (this.treeOrTable == "table") {
        this.$refs.eventTypeTree.setCurrentKey(this.tableDialogForm.id);
        this.tableDialogForm.eventTypeParentName = (this.$refs.eventTypeTree.getCurrentNode() ||
          {})["name"];
        this.tableDialogForm.eventTypeParentName = this.eventTypeList[0].name;
      }
    },
    // 分组树选中
    eventTypeListTreeCurrentChangeHandle(data, node) {
      if (this.treeOrTable == "tree") {
        this.treeDialogForm.parentId = data.id;
        this.treeDialogForm.eventTypeParentId = data.id;
        this.treeDialogForm.eventTypeParentName = data.name;
      }
      if (this.treeOrTable == "table") {
        this.tableDialogForm.parentId = data.id;
        this.tableDialogForm.eventTypeParentId = data.id;
        this.tableDialogForm.eventTypeParentName = data.name;
      }
    },
    //取消选择
    cancelTree() {
      if (this.treeOrTable == "tree") {
        this.treeDialogForm.eventTypeParentName = "";
        this.newgroups = false;
      }
      if (this.treeOrTable == "table") {
        this.tableDialogForm.eventTypeParentName = "";
        this.newgroups2 = false;
      }
    },
    //清空新增修改树
    clearDialog() {
      this.$refs["treeDialogForm"].resetFields();
      this.treeDialogForm.gmtCreate = "";
    },
    //清空新增修改表
    clearTable() {
      this.$refs["tableDialogForm"].resetFields();
      this.tableDialogForm.codeNum = "";
      console.log("sdasdas", "清空");
      this.tableDialogForm.eventTypeParentName = "";
    },

    //获取树形数据
    getTreeList() {
      this.$http({
        url: this.$http.adornUrl("/meeting/meetingCameraGroup/listTree"),
        method: "get",
        params: this.$http.adornParams({
          name: this.searchTreeName
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.treeList = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl(`/meeting/meetingCamera/list`),
        method: "post",
        data: this.$http.adornData({
          page: this.pageIndex,
          limit: this.pageSize,
          search: this.dataForm.search,
          groupIds: this.treeIds
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;

          this.totalPage = data.page.totalCount;
          console.log(this.dataList, this.totalPage);
        } else {
          this.dataList = [];
          this.totalPage = 0;
          this.$message.error(data.msg);
        }
        this.dataListLoading = false;
      });
    },
    handleNodeClick(obj) {
      console.log("点击节点", obj);
      this.treeIds = [];
      this.pageIndex = 1;
      this.treeId = obj.id;
      this.treeIds[0] = obj.id;
      //   this.checkedIds[0] = obj.id;
      if (obj.children != null && obj.children.length > 0) {
        this.getChildren(obj.children);
      }
      this.getDataList();
    },
    getChildren(data) {
      //   console.log("222222222222222children", data);
      if (data != null && data.length > 0) {
        data.forEach(d => {
          this.treeIds.push(d.id);
          if (d.children != null && d.children.length > 0) {
            this.getChildren(d);
          }
        });
      }
    },
    // 树形复选框勾选ID
    // setCheckedIds(checkedIds, checkedNodes) {
    //   this.checkedIds = checkedIds;
    //   // console.log('this.checkedIds', this.checkedIds)
    //   this.checkedNodes = checkedNodes;
    // },
    //监听树形复选框的勾选id
    checkGroupNode(id, arr) {
      //   this.$emit("setCheckedIds", arr.checkedKeys, arr.checkedNodes);
      this.checkedIds = arr.checkedKeys;
      this.checkedNodes = arr.checkedNodes;
    },
    //搜索树形
    searchTree() {
      this.getTreeList();
    },
    // 查询
    searchResult() {
      this.pageIndex = 1;
      this.getDataList();
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.tableCheckedIds.map(item => {
            return item.id;
          });
      if (ids <= 0) {
        this.$message.error("请选择数据!");
        return;
      }
      this.$confirm(`确定删除?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log("删除数据");
          this.$http({
            url: this.$http.adornUrl(`/meeting/meetingCamera/delete`),
            method: "post",
            data: this.$http.adornData({
              ids: ids
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    },
    // 点击全部请求为所有节点
    allNodeClick() {
      this.isAll = true;
    },
    //表格所选数据
    tableSelectionChange(val) {
      // console.log("多选框", val);
      this.tableCheckedIds = val;
      // console.log("checkids", this.checkedIds);
    }
  }
};
</script>
<style lang="less">
.patrolRecord {
  //按钮样式
  .el-button.el-button--medium:hover {
    // color: #a3a3a3 !important;
    border-color: rgba(71, 157, 255, 1) !important;
    // background: transparent !important;
  }
  .el-form {
    .el-button--danger {
      background: white;
      border: 1px solid #d3d7db;
      border-radius: 5px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: #a3a3a3;
      margin-left: 20px;
    }
    .el-button--primary {
      width: 88px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(211, 215, 219, 1);
      border-radius: 5px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: rgba(162, 162, 162, 1);
    }
    .el-button--default {
      background: linear-gradient(
        180deg,
        rgba(71, 175, 255, 1),
        rgba(71, 157, 255, 1)
      );
      border-radius: 3px;
      color: white;
      width: 88px;
    }
  }

  //修改，删除按钮样式
  .cell {
    .el-button--text:first-child {
      background-color: transparent;
      border: none;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      font-weight: bold;
      color: rgba(118, 214, 114, 1);
    }
    .el-button--text:last-child {
      background-color: transparent;
      border: none;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      font-weight: bold;
      color: rgba(230, 115, 128, 1);
    }
  }

  .treebox__inp .el-input__inner {
    background-color: rgba(242, 242, 242, 1);
    width: 265px;
  }
}

.treebox {
  width: 100%;
  height: 100%;

  .treebox__wtf-normal {
    margin: 0 auto;
    width: 247px;
    height: 34px;
    box-sizing: border-box;
    padding: 2px 24px;
    text-align: left;
    line-height: 34px;
    color: #333333;
    font-weight: bold;

    &:hover {
      background-color: #f0f0f0;
      color: #666666;
    }
  }

  .treebox__wtf-click {
    margin: 0 auto;
    width: 247px;
    height: 34px;
    box-sizing: border-box;
    padding: 2px 24px;
    text-align: left;
    line-height: 34px;
    // &:extend(.treebox__wtf-normal);
    border-left: 2px solid rgba(0, 145, 255, 1);
    color: #333333;
    font-weight: bold;
    background-color: rgba(229, 244, 255, 1);
  }

  input.el-input__inner {
    background-color: rgba(242, 242, 242, 1) !important;
    border-radius: 10px;
  }
  .treebox__inp {
    width: 100%;
    min-width: 247px;
  }
}
.treeClass {
  height: 90%;
  // margin-top: 8px;
  // border: 1px solid rgba(229, 229, 229, 1);
  background-color: #fff;
}
.treebox > .treeboxtop {
  line-height: 60px;
}
.treebox .el-tree-node__content {
  height: 35px;
  margin-left: 10px;
}
.treeFoor {
  margin-left: 715px;
  margin-top: 100px;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.tableFoor {
  display: flex;
  margin-left: 315px;
  margin-top: 100px;
  color: #333;
  text-align: center;
  line-height: 20px;
  height: 35px !important;
}
</style>
