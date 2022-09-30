<template>
  <div class="videoMeeting">
    <el-row :gutter="10">
      <el-col :span="5">
        <div class="treebox">
          <el-aside width="100%">
            <el-header
              style="
                height: 48px;
                padding: 5px;
                text-align: center;
                padding: 5px;
                display: flex;
              "
              class="operation-btn"
            >
              <el-button
                size="mini"
                @click="getContactorTree()"
                style="width: 4.5vw; background-color: rgba(242, 242, 242, 1)"
                :class="buttonType == 'contactor' ? 'buttonActive' : ''"
                >通讯录</el-button
              >
              <el-button
                size="mini"
                @click="getMeetingTree()"
                style="
                  width: 4.5vw;
                  margin-left: 1px;
                  background-color: rgba(242, 242, 242, 1);
                "
                :class="buttonType == 'meeting' ? 'buttonActive' : ''"
                >会场终端</el-button
              >
              <el-button
                size="mini"
                @click="getClusterTree()"
                style="
                  width: 4.5vw;
                  margin-left: 1px;
                  background-color: rgba(242, 242, 242, 1);
                "
                :class="buttonType == 'cluster' ? 'buttonActive' : ''"
                >集群终端</el-button
              >
              <el-button
                size="mini"
                @click="getVideoTree()"
                style="
                  width: 4.5vw;
                  margin-left: 1px;
                  background-color: rgba(242, 242, 242, 1);
                "
                :class="buttonType == 'video' ? 'buttonActive' : ''"
                >视频监控</el-button
              >
            </el-header>
            <el-form
              :inline="true"
              @keyup.enter.native="getDataList()"
              style="position: relative"
            >
              <el-form-item style="margin: 5px 1px">
                <el-input
                  class="treebox__inp"
                  placeholder="请输入分组关键字搜索"
                  clearable
                  v-model="searchTreeName"
                >
                  <i
                    slot="suffix"
                    class="el-icon-search"
                    @click="getTreeList"
                    style="font-size: 15px"
                  ></i>
                </el-input>
              </el-form-item>
            </el-form>
            <div
              :class="`treebox__wtf-${isAll ? 'click' : 'normal'}`"
              @click="allNodeClick"
            >
              全部
            </div>

            <div class="treeClass">
              <el-tree
                show-checkbox
                class="treeboxbotten"
                :default-expand-all="Treeexpansion"
                @node-click="handleNodeClick"
                :data="treeList"
                :props="treeProps"
                node-key="id"
                style="padding-top: 10px"
                current-node-key
                highlight-current
                ref="tree"
              ></el-tree>
            </div>
          </el-aside>
        </div>
      </el-col>

      <el-col :span="13">
        <el-form
          :inline="true"
          :model="dataForm"
          @keyup.enter.native="getDataList()"
          style="position: relative; margin-top: 5px"
        >
          <el-form-item style="width: 15vw">
            <el-input
              style="width: 15vw"
              v-model="dataForm.search"
              :placeholder="inputPlaceholder"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              @click="searchResult()"
              style="width: 4vw"
              >查询</el-button
            >
          </el-form-item>
        </el-form>

        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          style="width: 100%"
          height="700"
          @select="pushDataId"
          ref="dataListRef"
        >
          <el-table-column
            type="selection"
            header-align="left"
            class="firstSelection"
            align="center"
            width="55"
          ></el-table-column>
          <el-table-column
            v-if="buttonType == 'contactor' ? false : true"
            prop="name"
            header-align="center"
            align="center"
            label="设备名称"
          ></el-table-column>
          <el-table-column
            v-if="buttonType == 'contactor' ? false : true"
            :prop="buttonType == 'cluster' ? 'num' : 'codeNum'"
            header-align="center"
            align="center"
            label="号码"
          ></el-table-column>
          <el-table-column
            v-if="buttonType == 'contactor' ? true : false"
            prop="name"
            header-align="center"
            align="center"
            label="姓名"
          ></el-table-column>
          <el-table-column
            v-if="buttonType == 'contactor' ? true : false"
            prop="workUnit"
            header-align="center"
            align="center"
            label="工作单位"
          ></el-table-column>
          <el-table-column
            v-if="buttonType == 'contactor' ? true : false"
            prop="position"
            header-align="center"
            align="center"
            label="职务"
          ></el-table-column>
          <el-table-column
            v-if="buttonType == 'contactor' ? true : false"
            prop="mobile1"
            header-align="center"
            align="center"
            label="手机号码"
          ></el-table-column>
          <el-table-column
            v-if="buttonType == 'contactor' ? true : false"
            header-align="center"
            align="center"
            label="办公室电话"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.officeTel ? scope.row.officeTel : "未知"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="buttonType == 'contactor' ? true : false"
            header-align="center"
            align="center"
            label="家庭电话"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.homeTel ? scope.row.homeTel : "未知" }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column header-align="center" align="center" label="操作">
            <template slot-scope="scope">
              <img
                src="../../../assets/img/edit.svg"
                @click="getInfo(scope.row.id)"
                style="cursor: pointer; color: #02a7f0; width: 20px"
              />
              <img
                src="../../../assets/img/del.svg"
                @click="deleteData(scope.row.id)"
                style="cursor: pointer; color: #d9001b; width: 20px"
              />
            </template>
          </el-table-column> -->
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

        <!-- 新增会场终端 -->
        <el-dialog
          :title="tableTitle"
          :close-on-click-modal="false"
          :visible.sync="tableVisible"
          width="27%"
        >
          <el-container>
            <el-header style="height: 120px">
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
                    v-bind:readonly="tableType === 'show'"
                  ></el-input>
                </el-form-item>

                <el-form-item label="设备号码" prop="codeNum">
                  <el-input
                    v-model="tableDialogForm.codeNum"
                    placeholder="请填写设备号码"
                    v-bind:readonly="tableType === 'show'"
                  ></el-input>
                </el-form-item>
                <el-form-item label="分组名称" prop="eventTypeParentName">
                  <el-dialog
                    title="请选择要新增到的分组节点"
                    :visible.sync="newgroups2"
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
                      <el-button @click="cancelTree()" plain size="small"
                        >取 消</el-button
                      >
                      <el-button
                        type="primary"
                        @click="newgroups2 = false"
                        size="small"
                        >确 定</el-button
                      >
                    </span>
                  </el-dialog>
                  <el-input
                    v-model="tableDialogForm.eventTypeParentName"
                    @focus="gettingfocus"
                    v-popover:eventTypeListPopover
                    placeholder="选择分组"
                    :readonly="true"
                  ></el-input>
                  <el-input
                    v-show="false"
                    v-model="tableDialogForm.parentId"
                    :readonly="true"
                  ></el-input>
                </el-form-item>
              </el-form>
            </el-header>
            <el-footer class="tableFoor">
              <el-button @click="tableVisible = false" plain size="small"
                >取消</el-button
              >
              <el-button type="primary" @click="tableSubmit()" size="small"
                >保存</el-button
              >
            </el-footer>
          </el-container>
        </el-dialog>

        <!-- 弹窗, 通讯录查看 / 修改 -->
        <add-or-update
          v-if="addOrUpdateVisible"
          ref="addOrUpdate"
          @refreshDataList="getDataList"
        ></add-or-update>
      </el-col>

      <el-col :span="6">
        <el-card class="box-card" style="height: 27vw">
          <div slot="header" class="clearfix">
            <span v-if="meetingTitle != ''">会议名称:{{ meetingTitle }}</span>
            <span>会议成员：{{ tableData.length }}</span>
            <span>会议时长：{{ recordTime }}</span>
          </div>

          <div
            v-for="(item, index) in tableData"
            :key="index"
            style="
              padding-left: 12px;
              padding-bottom: 10px;
              margin-bottom: 0.3vw;
              border-bottom: 1px solid #ebeef5;
              width: 100%;
            "
          >
            <span>
              <i class="el-icon-place"></i>
              {{ item.name }}
            </span>

            <span style="float: right">
              <i
                class="el-icon-close"
                @click="closeMember(item)"
                style="position: relative; bottom: 10px; cursor: pointer"
              ></i>
            </span>
          </div>
        </el-card>
        <el-button
          v-if="!meetingStart"
          type="success"
          circle
          style="
            width: 40%;
            height: 150px;
            position: relative;
            top: 4vw;
            left: 7.4vw;
          "
          @click="startMeeting"
          >启动会议</el-button
        >
        <el-button
          v-if="meetingStart"
          type="danger"
          circle
          style="
            width: 40%;
            height: 150px;
            position: relative;
            top: 4vw;
            left: 7.4vw;
          "
          @click="endMeeting"
          >结束会议</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { platformTreeDataTranslate } from "@/utils";
import SockJS from "sockjs-client";
import Cookies from "js-cookie";
import $ from "jquery";
import Bus from "@/utils/bus.js";
import AddOrUpdate from "../sys/mailList/mailList-See-or-update.vue";
const token = document.cookie;
const httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  data() {
    return {
      // 搜索提示词
      inputPlaceholder: '请输入设备关键字',
      platformId: this.$store.state.user.platformId, // 用户平台id
      // 会议成员表格数据
      meetingMember: [],
      //会议是否启动
      meetingStart: false,
      //按钮类型
      buttonType: "meeting",
      eventTypeList: [], // 树的数据
      eventTypeListTreeProps: {
        label: "name",
        children: "children"
      },
      newgroups2: false,
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
      //会场表格勾选选中的id
      meetingTableCheckedIds: [],
      //视频表格勾选选中的id
      videoTableCheckedIds: [],
      //通讯录表格勾选选中的id
      contactorTableCheckedIds: [],
      Treeexpansion: false,
      //总体勾选id
      dataIds: [],
      //勾选数
      dataSelectedCount: [],
      //总体勾选数据
      tableData: [],
      //通讯录查看修改
      addOrUpdateVisible: false,
      //初始时间
      oldTime: "",
      //会议时间
      recordTime: "",
      //会议标题
      meetingTitle: ""
    };
  },
  components: {
    AddOrUpdate
  },
  watch: {
    // recordTime: function (newValue, oldValue) {
    //   if (newValue) {
    //     this.startTime =
    //       newValue[0].toLocaleDateString().replace(/\//gi, "-") + " 00:00:00";
    //     this.endTime =
    //       newValue[1].toLocaleDateString().replace(/\//gi, "-") + " 23:59:59";
    //   } else {
    //     this.startTime = "";
    //     this.endTime = "";
    //   }
    // },
  },

  mounted() {
    this.getTreeList();
    this.getDataList();
    this.receiveWebsocket();
  },
  methods: {
    //启动会议
    startMeeting() {
      console.log("最新的", this.tableData);
      this.meeting(this.tableData);
    },
    //结束会议
    endMeeting() {
      this.clearTableData();
    },
    //编辑详情
    getInfo(id) {
      let url;
      if (this.buttonType == "contactor") {
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id, 1);
        });
        return;
      }
      if (this.buttonType == "meeting") {
        url = "/meeting/meetingTerminal/infor";
      }
      if (this.buttonType == "video") {
        url = "/meeting/meetingCamera/infor";
      }
      this.tableDialogForm.id = id;
      this.tableTitle = "修改";
      this.tableType = "update";
      this.tableVisible = true;
      this.$http({
        url: this.$http.adornUrl(`${url}/${this.tableDialogForm.id}`),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            if (this.buttonType == "meeting") {
              this.tableDialogForm.name = data.MeetingTerminal.name;
              this.tableDialogForm.codeNum = data.MeetingTerminal.codeNum;
              this.tableDialogForm.eventTypeParentName =
                data.MeetingTerminal.groupIdName;
            }
            if (this.buttonType == "video") {
              this.tableDialogForm.name = data.MeetingCamera.name;
              this.tableDialogForm.codeNum = data.MeetingCamera.codeNum;
              this.tableDialogForm.eventTypeParentName =
                data.MeetingCamera.groupIdName;
            }
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
      let url;
      if (this.buttonType == "contactor") {
        url = "/mail/mailcontactor/deleteByMap";
        this.$confirm(`确定删除?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$http({
              url: this.$http.adornUrl(url),
              method: "post",
              data: this.$http.adornData({
                contactorIds: [id]
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
        return;
      }
      if (this.buttonType == "meeting") {
        url = "/meeting/meetingTerminal/delete";
      }
      if (this.buttonType == "video") {
        url = "/meeting/meetingCamera/delete";
      }
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.id;
          });
      // 对[id=${ids.join(",")}]进行[${id ? "删除" : "批量删除"}]操作
      this.$confirm(`确定删除?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(url),
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
    //获取树形数据
    getTreeList() {
      let url;
      if (this.buttonType == "contactor") {
        url = "/mail/mailgroup/list";
      }
      if (this.buttonType == "meeting") {
        url = "/meeting/meetingTerminalGroup/listTree";
      }
      if (this.buttonType == "video") {
        url = "/meeting/meetingCameraGroup/listTree";
      }
      if (this.buttonType == "cluster") {
        url = "/meeting/meetingClusterGroup/listTree";
      }
      this.$http({
        url: this.$http.adornUrl(url),
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
      let url;
      if (this.buttonType == "contactor") {
        this.$http({
          url: this.$http.adornUrl("/mail/mailcontactor/list"),
          method: "post",
          data: this.$http.adornData({
            page: this.pageIndex,
            limit: this.pageSize,
            search: this.dataForm.search,
            groupId: this.treeIds
          })
        }).then(({ data }) => {
          // console.log(data)

          if (data && data.code === 0) {
            // 详细联系人列表
            this.dataList = data.data.list;
            this.totalPage = data.data.totalCount;
            this.dataList.forEach(row => {
              this.tableData.forEach(data => {
                if (row.id == data.id) {
                  this.$nextTick(() => {
                    this.$refs.dataListRef.toggleRowSelection(row, true);
                  });
                }
              });
            });
          } else {
            this.dataList = [];
            this.totalPage = 0;
            this.$message.error(data.msg);
          }
          this.dataListLoading = false;
        });
        console.log("shujuliebiao", this.dataList);
        return;
      }
      if (this.buttonType == "meeting") {
        url = "/meeting/meetingTerminal/list";
      }
      if (this.buttonType == "video") {
        url = "/meeting/meetingCamera/list";
      }
      if (this.buttonType == "cluster") {
        url = "/meeting/meetingCluster/list";
      }
      // console.log("点击类型", this.buttonType, url);
      this.$http({
        url: this.$http.adornUrl(url),
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
          this.dataList.forEach(row => {
            this.tableData.forEach(data => {
              if (row.id == data.id) {
                console.log(
                  "data",
                  data,
                  "row",
                  row,
                  "tableData",
                  this.tableData
                );
                this.$nextTick(() => {
                  this.$refs.dataListRef.toggleRowSelection(row, true);
                });
              }
            });
          });
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
      if (this.buttonType == "video") {
        this.treeIds[0] = obj.groupId;
      } else {
        this.treeIds[0] = obj.id;
      }
      //   this.checkedIds[0] = obj.id;
      if (obj.children != null && obj.children.length > 0) {
        this.getChildren(obj.children);
      }
      this.getDataList();
    },
    getChildren(data) {
      //   console.log("222222222222222children", data);
      if (data != null && data.length > 0) {
        if (this.buttonType == "video") {
          data.forEach(d => {
            this.treeIds.push(d.groupId);
            if (d.children != null && d.children.length > 0) {
              this.getChildren(d);
            }
          });
        } else {
          data.forEach(d => {
            this.treeIds.push(d.id);
            if (d.children != null && d.children.length > 0) {
              this.getChildren(d);
            }
          });
        }
      }
    },
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
    getContactorTree() {
      this.buttonType = "contactor";
      this.inputPlaceholder = '请输入姓名，手机号关键字';
      this.treeIds = [];
      this.getTreeList();
      this.getDataList();
    },
    getMeetingTree() {
      this.buttonType = "meeting";
      this.inputPlaceholder = '请输入设备关键字';
      this.treeIds = [];
      this.getTreeList();
      this.getDataList();
      // if (this.buttonType == "meeting") {
      //   this.meetingTableCheckedIds.forEach(row => {
      //     this.$nextTick(() => {
      //       this.$refs.dataListRef.toggleRowSelection(row, true);
      //     });
      //   });
      // }
    },
    getClusterTree() {
      this.buttonType = "cluster";
      this.inputPlaceholder = '请输入设备关键字';
      this.treeIds = [];
      this.getTreeList();
      this.getDataList();
    },
    getVideoTree() {
      this.buttonType = "video";
      this.inputPlaceholder = '请输入设备关键字';
      this.treeIds = [];
      this.getTreeList();
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
    // 点击全部请求为所有节点
    allNodeClick() {
      this.treeIds = [];
      this.getDataList();
      this.isAll = true;
      this.treeIds = [];
      this.getDataList();
    },
    //表格所选数据
    // selectionChange(val) {
    //   // console.log("多选框", val);
    //   if (this.buttonType == "meeting") {
    //     this.meetingTableCheckedIds = val;
    //     console.log("表格选的数据", val, this.meetingTableCheckedIds);
    //   }
    //   if (this.buttonType == "video") {
    //     this.videoTableCheckedIds = val;
    //   }
    //   if (this.buttonType == "contactor") {
    //     this.contactorTableCheckedIds = val;
    //   }
    //   // console.log("checkids", this.checkedIds);
    // },
    //勾选数据
    pushDataId(selection, row) {
      // console.log("勾选数据", selection, row);
      if ($(":checkbox").is(":checked") && this.dataIds.indexOf(row.id) == -1) {
        this.dataIds.push(row.id);
        this.tableData.push(row);
        let tablelength = this.tableData.length;
        if (this.buttonType == "meeting") {
          if (tablelength > 0) {
            this.tableData[tablelength - 1].type = "8";
          }
        }
        if (this.buttonType == "video") {
          if (tablelength > 0) {
            this.tableData[tablelength - 1].type = "9";
          }
        }
        if (this.buttonType == "contactor") {
          if (tablelength > 0) {
            this.tableData[tablelength - 1].type = "1";
          }
        }
        if (this.buttonType == "cluster") {
          if (tablelength > 0) {
            this.tableData[tablelength - 1].type = "6";
          }
        }
      } else {
        let index = this.dataIds.indexOf(row.id);
        let cindex = this.tableData.findIndex(
          item => item.id == row.id && item.name == row.name
        );

        this.dataIds.splice(index, 1);
        this.tableData.splice(cindex, 1);
      }
      this.dataSelectedCount = this.dataIds.length;
      console.log(
        "勾选数据",
        this.tableData,
        this.dataIds,
        this.dataSelectedCount,
        row
      );
    },
    // 当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
    gettingfocus(event) {
      this.newgroups2 = true;

      this.$http({
        url: this.$http.adornUrl("/meeting/meetingTerminalGroup/listTree"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          // console.log("22222222", data);
          if (data && data.code === 0) {
            this.eventTypeParentName = "";
            // data.data.splice(0, 0, { id: 0, name: "顶级分组节点" });
            // console.log("this.eventTypeList: ", data.data);
            // this.eventTypeList = treeDataTranslate(data.data, 'id')
            this.eventTypeList = data.data;
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {
          this.tableVisible = true;
        })
        .then(() => {
          // 新增
          this.eventTypeListTreeSetCurrentNode();
        });
    },
    // 分组树设置当前选中节点
    eventTypeListTreeSetCurrentNode() {
      this.$refs.eventTypeTree.setCurrentKey(this.tableDialogForm.id);
      this.tableDialogForm.eventTypeParentName = (this.$refs.eventTypeTree.getCurrentNode() ||
        {})["name"];
      this.tableDialogForm.eventTypeParentName = this.eventTypeList[0].name;
    },
    // 分组树选中
    eventTypeListTreeCurrentChangeHandle(data, node) {
      this.tableDialogForm.parentId = data.id;
      this.tableDialogForm.eventTypeParentId = data.id;
      this.tableDialogForm.eventTypeParentName = data.name;
    },
    //取消选择
    cancelTree() {
      this.tableDialogForm.eventTypeParentName = "";
      this.newgroups2 = false;
    },
    //减少成员
    closeMember(data) {
      let index;
      // if (this.buttonType == "meeting") {
      index = this.tableData.findIndex(
        item => item.id == data.id && item.name == data.name
      );
      this.$refs.dataListRef.toggleRowSelection(this.tableData[index], false);
      this.pushDataId(this.tableData, this.tableData[index]);
      // this.tableData.splice(index, 1);
      // console.log("移除后数据", this.tableData);
      // this.meetingTableCheckedIds.forEach(row => {
      //   this.$nextTick(() => {
      //     this.$refs.dataListRef.toggleRowSelection(row, true);
      //   });
      // });
      // }
      // if (this.buttonType == "video") {
      //   index = this.videoTableCheckedIds.findIndex(item => (item.id = id));
      //   this.$refs.dataListRef.toggleRowSelection(
      //     this.videoTableCheckedIds[index],
      //     false
      //   );
      //   this.videoTableCheckedIds.forEach(row => {
      //     this.$nextTick(() => {
      //       this.$refs.dataListRef.toggleRowSelection(row, true);
      //     });
      //   });
      // }
      // if (this.buttonType == "contactor") {
      //   index = this.contactorTableCheckedIds.findIndex(item => (item.id = id));
      //   this.$refs.dataListRef.toggleRowSelection(
      //     this.contactorTableCheckedIds[index],
      //     false
      //   );
      //   this.contactorTableCheckedIds.forEach(row => {
      //     this.$nextTick(() => {
      //       this.$refs.dataListRef.toggleRowSelection(row, true);
      //     });
      //   });
      // }
    },
    connection() {
      var that = this;
      // 连接SockJS的endpoint名称为"endpointOyzc"
      // var socket = new SockJS('http://127.0.0.1:8888/endpointOyzc');
      that.socket = new SockJS(`${window.SITE_CONFIG.websocket}`);
      // 使用STMOP子协议的WebSocket客户端
      that.stompClient = Stomp.over(that.socket);
      that.globalStompClient = that.stompClient;
      // 连接WebSocket服务端
      that.stompClient.connect({}, function(frame) {
        // 通过stompClient.subscribe订阅/topic/getResponse 目标(destination)发送的消息
        // "/platform/" + that.platformId + "/message",
        console.log("有没有连上");
        that.stompClient.subscribe("/platform/endMeeting", function(response) {
          // alert(11111)
          var str = response.body;
          // console.log("监听websocket数据", response);
          let body = JSON.parse(response.body);
          // setTimeout(function() {
          //   Bus.$emit("callPhoneStatex", body);
          // }, 1000);
          console.log("cs端结束会议", body);
          if (body == 0) {
            console.log("有没有进来");
            that.tableData = [];
            that.getDataList();
            that.meetingStart = false;
          }
        });
      });
    },
    receiveWebsocket() {
      var that = this;
      var ws = new WebSocket(window.SITE_CONFIG["websocket_phone"]);
      var sendMsg = {
        type: "DelConf"
      };
      ws.onopen = function() {
        ws.send(JSON.stringify(sendMsg));
      };
      ws.onmessage = evt => {
        var receiveData = JSON.parse(evt.data);
        console.log("BS端结束会议接收到的数据最新111111111", receiveData);
        if (receiveData.code == 0 && receiveData.type == "DelConf") {
          that.tableData = [];
          that.dataIds = [];
          that.getDataList();
          that.meetingStart = false;
          that.meetingTitle = "";
          that.recordTime = "";
        }
      };
      ws.onerror = function(evt) {
        console.log("WebSocket错误信息：", evt);
      };
      that.connection();
      // 断开重连机制,尝试发送消息,捕获异常发生时重连
      that.timer = setInterval(() => {
        try {
          that.globalStompClient.send(
            "/platform/check",
            {},
            JSON.stringify({ to: that.platformId })
          );
          // that.globalStompClient.send("text");
          // console.log('pong!', '平台广播')
        } catch (err) {
          console.log("断线了:" + err);
          that.connection();
        }
      }, 10000);
    },
    clearTableData() {
      var ws = new WebSocket(window.SITE_CONFIG["websocket_phone"]);
      var sendMsg = {
        type: "DelConf"
      };
      console.log("发送data", sendMsg, "json", JSON.stringify(sendMsg));
      // todo
      // this.tableData = [];
      // this.dataIds = [];
      // this.getDataList();
      // this.meetingStart = false;
      // this.meetingTitle = "";
      // this.recordTime = "";

      ws.onopen = function() {
        ws.send(JSON.stringify(sendMsg));
        // console.log("WebSocket发送的内容：", sendMsg);
        // console.log("WebSocket地址：", ws);
      };
      // location.reload();
      ws.onmessage = evt => {
        var receiveData = JSON.parse(evt.data);
        console.log("BS端结束会议接收到的数据", receiveData);
        if (receiveData.code == 0 && receiveData.type == "DelConf") {
          this.tableData = [];
          this.dataIds = [];
          this.getDataList();
          this.meetingStart = false;
          this.meetingTitle = "";
          this.recordTime = "";
        }
      };
      ws.onerror = function(evt) {
        console.log("WebSocket错误信息：", evt);
      };
    },
    initTime() {
      let newTime = new Date();
      let ms = newTime.getTime() - this.oldTime.getTime(); //相差毫秒数
      let ts = parseInt(ms / 1000); //相差总秒数
      let h = parseInt(ts / 3600); //有几个小时
      let m = parseInt((ts - h * 3600) / 60); //有几分钟
      let s = ts - h * 3600 - m * 60; //有几秒
      h = this.checkTime(h);
      m = this.checkTime(m);
      s = this.checkTime(s);
      this.recordTime = h + ":" + m + ":" + s;
      // console.log("会议开始计时", this.recordTime, this.meetingStart);
      setTimeout(() => {
        if (this.meetingStart) {
          this.initTime();
        }
      }, 1000);
    },
    checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },
    meeting(data) {
      if (data.length == 0) {
        this.$message({
          message: "请添加会议成员",
          type: "warning"
        });
        return;
      }
      Bus.$emit("meetingData", data);
      // var ws = new WebSocket("ws://192.168.3.28:9529");
      var ws = new WebSocket(window.SITE_CONFIG["websocket_phone"]);
      // var ws = new WebSocket(window.SITE_CONFIG["websocket"]);
      var msgArray = [];
      for (let i = 0; i < data.length; i++) {
        var msg = {
          contactName: data[i].name,
          phone:
            data[i].type == 1
              ? data[i].mobile1
              : data[i].type == 6
              ? data[i].num
              : data[i].codeNum,
          memberType: data[i].type
        };
        msgArray.push(msg);
      }
      var sendMsg = {
        member: msgArray,
        platformId: data[0].platformId,
        type: "CreateConf"
      };
      // sendMsg.platformId = data[0].platformId;
      // sendMsg.type = "CreateConf";
      console.log("发送data", sendMsg, "json", JSON.stringify(sendMsg));
      ws.onopen = function() {
        ws.send(JSON.stringify(sendMsg));
        // console.log("WebSocket发送 内容：", sendMsg);
        // console.log("WebSocket地址：", ws);
      };
      // ws.onmessage = function (evt) {
      //   console.log("WebSocket接收到的数据11：", evt.data);
      // };
      let count = 1;

      //todo
      // this.meetingStart = true;
      // if (count == 1) {
      //   this.oldTime = new Date();
      //   count = 2;
      //   this.initTime();
      // }

      ws.onmessage = evt => {
        var stratMessage = JSON.parse(evt.data);
        var detailData = JSON.parse(stratMessage.data);
        if (stratMessage.code == 0 && stratMessage.type == "CreateConf") {
          this.meetingStart = true;
          this.meetingTitle = detailData.title;
          if (count == 1) {
            // console.log("开始会议接收到的数据", evt, count);
            this.oldTime = new Date();
            count = 2;
            this.initTime();
          }
        }
        this.getDataList();
      };
      ws.onerror = function(evt) {
        console.log("WebSocket错误信息：", evt);
      };
    }
  }
};
</script>
<style lang="less">
.videoMeeting {
  .el-card__header {
    background-color: rgba(242, 242, 242, 1);
  }

  .buttonActive {
    color: white;
    background-color: #269cf3 !important;
  }
  .button:hover {
    color: rgba(71, 157, 255, 1) !important;
    border-color: rgba(71, 157, 255, 1) !important;
  }
  //按钮样式
  .el-button.el-button--medium:hover {
    // color: #a3a3a3 !important;
    border-color: rgba(71, 157, 255, 1) !important;
    // background: transparent !important;
  }
  .has-gutter {
    .el-checkbox__input {
      display: none;
    }
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
    // margin: 0 auto;
    // width: 247px;
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
    // margin: 0 auto;
    // width: 247px;
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
