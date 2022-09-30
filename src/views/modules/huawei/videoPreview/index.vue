<template>
  <div class="playView">
    <el-header
      style="
        height: 80px;
        padding: 24px 16px;
        clear: both;
        border: 1px solid rgba(219, 219, 219, 1);
        border-radius: 3px;
      "
      class="left"
    >
      <span class="seats" v-if="activeName == 'second' ? true : false">
        <el-button type="primary" size="small" @click="newvideosHandle()"
          >新增</el-button
        >
      </span>
      <span class="seats">
        <el-button type="primary" size="small" @click="updateGroup()"
          >更新分组</el-button
        >
        <el-button type="primary" size="small" @click="updateCamera()"
          >更新设备</el-button
        >
      </span>
      <!-- <videoPreviewheader :modifiedUserList="modifiedUserList" @initData="searchData"></videoPreviewheader> -->
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="默认分组" name="first">
          <!-- <div style="height:8px;width:100%;background: rgb(240, 243, 244);"></div> -->

          <div
            v-if="activeName == 'first'"
            style="width: 100%; display: flex; padding: 32px 16px 0px 16px"
          >
            <!-- <el-row :gutter="20" > -->
            <!-- <el-col > -->
            <div style="width: 280px">
              <videoPreviewtree
                :list="modifiedUserList"
                :listProps="modifiedUserProps"
                @handleNodeClick="handleNodeClick"
                @handleNodeClickAll="handleNodeClickAll"
              ></videoPreviewtree>
            </div>
            <!-- </el-col> -->
            <!-- <el-col :span="13"> -->
            <div class="tableClass">
              <div style="width: 50vw; height: 530px; max-height: 530px">
                <videoPreviewtable
                  @handleSelectionChange="handleSelectionChange"
                  @refrehStatus="refrehStatus"
                  :camera-data="cameraData"
                ></videoPreviewtable>
                <div>
                  <!--分页-->
                  <el-pagination
                    @size-change="sizeChangeHandle"
                    @current-change="currentChangeHandle"
                    :current-page="currPage"
                    :page-sizes="[15, 30, 50, 100]"
                    :page-size="pageSize"
                    :total="totalCount"
                    layout="total, sizes, prev, pager, next, jumper"
                  ></el-pagination>
                  <!--分页-->
                </div>
              </div>
            </div>
            <!-- </el-col> -->
            <!-- <el-col :span="7"> -->
            <div class="screenshot">
              <videoPreviewTreeCrud
                ref="resoureteamTreeCrud"
                @close="resoureteamTreeCrudVisible = false"
                :reportParams="reportParams"
                :selectInvitedToJoinList="selectInvitedToJoinList"
                @invitedToJoin="contactViewHandle"
              ></videoPreviewTreeCrud>
            </div>

            <!-- </el-col>
            </el-row>-->
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-header>

    <!--邀请加入-->
    <!-- <el-dialog
      title="邀请加入"
      class
      :visible.sync="invitedToJoinVisible"
      style="overflow: auto;
  zoom: 1;"
    >
      <el-table
        :data="invitedToJoinList"
        @selection-change="invitedToJoinSelectionChange"
        @current-change="oneSelect"
        ref="Table"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column property="name" label="姓名"></el-table-column>
        <el-table-column property="mobile1" label="手机"></el-table-column>
        <el-table-column property="email" label="邮箱"></el-table-column>
      </el-table>
      <div style="margin-left:70%;margin-top:20px;">
        <el-button type="primary" @click="sendInvitedMessage()">确定</el-button>
        <el-button @click="invitedToJoinVisible=false">取消</el-button>
      </div>
    </el-dialog>-->

    <!-- 树状, 查看，修改-->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="40%"
      :rules="rules"
    >
      <el-form :modal="treeForm" ref="treeForm" :rules="rules">
        <el-form-item label="分组名称" size="large" label-width="100px">
          <el-input
            :readonly="groupingdisabled"
            placeholder="请输入内容"
            v-model="treeForm.currentTreename"
            clearable
            style="margin-bottom: 10px"
          ></el-input>
        </el-form-item>
        <el-form-item label="分组描述" size="large" label-width="100px">
          <el-input
            placeholder="分组描述"
            :readonly="groupingdisabled"
            v-model="treeForm.groupingdescription"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="dialogTitle === '修改'">
        <el-button @click="dialogVisible = false" plain size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="submittingbygroups" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!--树状，新增 -->
    <videoPreviewGrouptreeCrud
      v-if="groupTreeCrudVisible"
      ref="groupTreeCrud"
      @refreshGroupDataList="getDataList2"
      @close="groupTreeCrudVisible = false"
    ></videoPreviewGrouptreeCrud>

    <!-- 摄像头,新增 -->
    <el-dialog
      title="新增"
      :visible.sync="dialogVideoVisible"
      width="80%"
      :close-on-click-modal="false"
      @closed="closeVideoDialog"
    >
      <el-container>
        <el-aside width="300px">
          <videoPreviewOftentree
            :list="modifiedUserList2"
            :listProps="modifiedUserProps2"
            @handleNodeClick="handleNodeClick2"
            @setCheckedIds="setCheckedIds"
            :Treeexpansion="Treeexpansion"
            :buttonVisible="hideButton"
          ></videoPreviewOftentree>
        </el-aside>

        <el-aside width="300px">
          <videoPreviewtree
            :list="modifiedUserList"
            :listProps="modifiedUserProps"
            @handleNodeClick="handleNodeClick"
          ></videoPreviewtree>
        </el-aside>

        <!-- </el-col> -->
        <!-- <el-col :span="13"> -->
        <el-main>
          <videoPreviewtable
            @handleSelectionChange="handleSelectionChange"
            @selectionChangeHandle="selectionChangeHandle"
            :camera-data="cameraData"
          ></videoPreviewtable>

          <!--分页-->
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="currPage"
            :page-sizes="[15, 30, 50, 100]"
            :page-size="pageSize"
            :total="totalCount"
            layout="total, sizes, prev, pager, next, jumper"
          ></el-pagination>
        </el-main>
        <!--分页-->
      </el-container>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeVideo" plain size="small">取 消</el-button>
        <el-button type="primary" @click="addVideoToOften" size="small"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 摄像头弹窗, 新增-->
    <!-- <newvideos v-if="newvideosVisible" ref="newvideos" @refreshDataList="getDataList"></newvideos> -->
    <!-- 新增联系人视图 -->
    <linkman-draggable
      ref="commonLink"
      v-show="showcommonLink"
      @OnchildByValue="handelLinkdata"
    ></linkman-draggable>
  </div>
</template>

<script>
import videoPreviewtree from "./videoPreview-tree";
import videoPreviewOftentree from "./videoPreview-oftentree";
import videoPreviewGrouptreeCrud from "./videoPreview-groupTree-crud";
import videoPreviewheader from "./videoPreview-header";
import videoPreviewtable from "./videoPreview-table";
import videoPreviewTreeCrud from "./videoPreview-tree-crud";
import { treeDataTranslate } from "@/utils";
import LinkmanDraggable from "../../risk/riskvehiclealarm/LinkmanDraggable ";

var token = document.cookie;
var httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  data() {
    return {
      treeIds: [],
      //默认树形
      modifiedUserList: [],
      modifiedUserProps: {
        children: "children",
        label: "name",
      },
      //常用树形
      modifiedUserList2: [],
      modifiedUserProps2: {
        children: "children",
        label: "name",
      },
      invitedToJoinList: [],
      invitedToJoinVisible: false,
      selectInvitedToJoinList: [],
      reportParams: "",
      showcommonLink: false,
      cameraData: [],
      cameraData2: [],
      // 当前页数
      currPage: 0,
      // 每页显示条目个数
      pageSize: 15,
      // 总条目数
      totalCount: 0,
      // 搜索条件
      search: "",
      startTime: "",
      endTime: "",
      typeId: "",
      statusId: "",
      indexCode: "",
      indexCode2: "",
      activeName: "first",
      Treeexpansion: false,
      // 当前树
      currentTreeProperty: {},
      resoureteamTreeCrudVisible: false,
      // type: "",
      checkedNodes: [],
      checkedIds: [],
      dialogVisible: false,
      dialogTitle: "",
      groupingdisabled: false,
      treeForm: {
        // 分组名字
        currentTreename: "",
        // 分组描述
        groupingdescription: "",
      },
      dataFrom: {},
      //分組增加框
      groupTreeCrudVisible: false,
      //新增数据框
      dialogVideoVisible: false,
      //摄像头新增按钮显示
      showButton: true,
      //摄像头新增按钮隐藏
      hideButton: false,
      //表单复选Id
      currenttableArray: [],
      parentId: "",
      oftenId: "",
      treeType: "",
      //常用分组表单验证
      rules: {
        currentTreename: [
          { required: true, message: "请输入分组名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10个字", trigger: "blur" },
        ],
      },
      //地点
      workPlace: "",
      codeNum: [],
      isView: false,
    };
  },
  components: {
    videoPreviewtable,
    videoPreviewtree,
    videoPreviewOftentree,
    videoPreviewGrouptreeCrud,
    videoPreviewTreeCrud,
    videoPreviewheader,
    LinkmanDraggable,
  },
  created() {
    this.getDataList();
    this.getDataList2();
  },
  methods: {
    updateGroup() {
      var ws = new WebSocket(window.SITE_CONFIG["websocket_phone"]);
      var sendMsg = {
        group: "0",
        type: "Update_VideoGroup",
      };

      // sendMsg.platformId = data[0].platformId;
      // sendMsg.type = "CreateConf";
      console.log("发送data", sendMsg, "json", JSON.stringify(sendMsg));
      ws.onopen = function () {
        ws.send(JSON.stringify(sendMsg));
        console.log("WebSocket发送的内容：", sendMsg);
        console.log("WebSocket地址：", ws);
      };
      ws.onmessage = function (evt) {
        console.log("WebSocket接收到的数据：", evt);
      };
      ws.onerror = function (evt) {
        console.log("WebSocket错误信息：", evt);
      };
    },
    updateCamera() {
      var ws = new WebSocket(window.SITE_CONFIG["websocket_phone"]);
      var sendMsg = {
        group: "0",
        type: "Update_Video",
      };

      // sendMsg.platformId = data[0].platformId;
      // sendMsg.type = "CreateConf";
      console.log("发送data", sendMsg, "json", JSON.stringify(sendMsg));
      ws.onopen = function () {
        ws.send(JSON.stringify(sendMsg));
        console.log("WebSocket发送的内容：", sendMsg);
        console.log("WebSocket地址：", ws);
      };
      ws.onmessage = function (evt) {
        console.log("WebSocket接收到的数据：", evt);
      };
      ws.onerror = function (evt) {
        console.log("WebSocket错误信息：", evt);
      };
    },
    //被选中的的菜单
    handleSelectionChange(val) {
      var value = val[val.length - 1].name;
      var tal = [];
      var selectName = "";
      // this.$emit("handleSelectionChange", val);
      for (var i = 0; i < val.length; i++) {
        tal.push(val[i].indexCode);
        this.currenttableArray = tal;
      }
      // this.reportParams
      // this.workPlace = this.treeForm.currentTreename;
      console.log("this.$refs===>", this.$refs);
      this.$refs.resoureteamTreeCrud.workPlace =
        this.treeForm.currentTreename + "-" + value;
      console.log("value===》", value);
      console.log("this.currenttableArray===》", this.currenttableArray);
      console.log(
        "this.treeForm.currentTreename====>",
        this.treeForm.currentTreename
      );
      console.log(
        "this.$refs.resoureteamTreeCrud.workPlace====>",
        this.$refs.resoureteamTreeCrud.workPlace,
        this.$refs.resoureteamTreeCrud,
        this.treeForm.currentTreename
      );
    },
    handleNodeClickAll() {
      this.treeIds = [];
      this.initData();
    },
    //点击树形节点事件
    handleNodeClick(obj) {
      console.log("点击树形节点事件===>", obj);
      this.reportParams = obj;
      // this.indexCode = obj.indexCode;
      this.parentId = obj.parentId;
      this.oftenId = obj.id;
      this.treeIds[0] = obj.groupId;
      this.currPage = 1;
      this.treeForm.currentTreename = obj.name;
      this.treeForm.groupingdescription = obj.remark;
      if (this.checkedIds.length == 0 || this.checkedIds.length == 1) {
        this.checkedIds = [this.oftenId];
      }
      if (obj.children != null && obj.children.length > 0) {
        this.getChildren(obj.children);
      }
      // console.log(this.checkedIds);
      // console.log(obj);
      if (obj.children == null) {
        this.initData(obj);
      }
    },
    getChildren(data) {
      //   console.log("222222222222222children", data);
      if (data != null && data.length > 0) {
        data.forEach((d) => {
          this.treeIds.push(d.groupId);
          if (d.children != null && d.children.length > 0) {
            this.getChildren(d);
          }
        });
      }
    },
    handleNodeClick2(obj) {
      this.indexCode2 = obj.id;
    },
    // 预览取消预览更新状态
    refrehStatus(num, isView) {
      if (!isView) {
        let pushIndex = this.codeNum.findIndex((item) => item == num);
        if (pushIndex == -1 && num != "") {
          this.codeNum.push(num);
        }
      } else {
        let removeIndex = this.codeNum.findIndex((item) => item == num);
        if (removeIndex > -1) {
          this.codeNum.splice(removeIndex, 1);
          console.log("测试123", num, removeIndex);
        }
      }
      console.log("Num数据", this.codeNum);
      this.isView = isView;
      this.initData();
    },
    // 初始化表格
    initData() {
      this.$http({
        url: this.$http.adornUrl(`/meeting/meetingCamera/list`),
        method: "post",
        data: this.$http.adornData({
          page: this.currPage,
          limit: this.pageSize,
          search: "",
          groupIds: this.treeIds,
        }),
      }).then(({ data }) => {
        // console.log("dhaskhdkahdkjakdjka-------------", data);
        if (data) {
          this.cameraData = data.page.list;
          this.cameraData.forEach((item) => {
            item.isView = true;
          });
          this.codeNum.forEach((num) => {
            let targetIndex = this.cameraData.findIndex(
              (item) => item.codeNum == num
            );
            // console.log("所在位置", targetIndex, this.codeNum);
            if (targetIndex > -1) {
              this.cameraData[targetIndex].isView = false;
              this.$set(
                this.cameraData,
                targetIndex,
                this.cameraData[targetIndex]
              );
            }
          });
          console.log("初始化数据", this.cameraData, "codeNum", this.codeNum);
          this.totalCount = data.page.totalCount;
        } else {
          this.cameraData = [];
          this.totalCount = 0;
          // this.$message.error(data.msg);
          // this.$message({
          //   type: "error",
          //   message: data.msg,
          // });
        }
      });
    },
    //切换卡片
    handleClick(tab, event) {
      console.log(this.activeName);
      this.activeName = tab.name;
      this.cameraData = [];
      this.totalCount = 0;
      if (this.activeName == "first") {
        this.getDataList();
      } else {
        this.getDataList2();
      }
    },
    // 获取默认分组数据列表
    getDataList() {
      this.dataListLoading = true;

      this.$http({
        url: this.$http.adornUrl("/meeting/meetingCameraGroup/listTree"),
        method: "get",
        params: this.$http.adornParams({
          name: "",
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log("data: ", data);
          // var townData = data.data;
          // this.modifiedUserList = treeDataTranslate(townData, "id");
          // var result = data.groupInfo;
          // this.modifiedUserList = data.groupInfo;
          // this.modifiedUserList.forEach((item) => {
          //   item.children = [];
          //   result.forEach((item2) => {
          //     if (item2.pGroupID == item.groupID) {
          //       item.children.push(item2);
          //     }
          //   });
          // });
          this.modifiedUserList = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 获取常用分组数据列表
    getDataList2() {
      this.dataListLoading = true;

      this.$http({
        url: this.$http.adornUrl("/risk/spdyCommonGroup/list"),
        method: "get",
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log("data: ", data);
          var townData = data.data;
          // this.modifiedUserList2 = treeDataTranslate(townData, "id");
          this.modifiedUserList2 = townData;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 树形复选框勾选ID
    setCheckedIds(checkedIds, checkedNodes) {
      this.checkedIds = checkedIds;
      // console.log('this.checkedIds', this.checkedIds)
      this.checkedNodes = checkedNodes;
    },
    // 表单复选框勾选ID
    selectionChangeHandle(dataIds) {
      this.dataIds = dataIds;
      // console.log("this.dataIds", this.dataIds);
    },
    //查看分组
    showEventType() {
      this.dialogTitle = "查看";
      this.dialogVisible = true;
      this.groupingdisabled = true;
    },
    //添加分组
    addEventType() {
      this.groupTreeCrudVisible = true;
      this.$nextTick(() => {
        this.$refs.groupTreeCrud.init(null, null, 2); // 代表新增
      });
    },
    // 修改分组
    updateEventType(rows) {
      // console.log(this.treeForm.currentTreename)
      this.dialogTitle = "修改";
      this.dialogVisible = true;
      this.groupingdisabled = false;
    },
    // 删除分组
    deleteEventType(ids) {
      var that = this;
      this.$confirm(`确定要进行[删除]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        var checkedNames = "";
        if (that.checkedNodes.length > 0) {
          that.checkedNodes.forEach((item) => {
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
              url: that.$http.adornUrl(`/risk/spdyCommonGroup/delete`),
              method: "post",
              data: this.$http.adornData({
                ids: that.checkedIds,
              }),
              // data: that.$http.adornData(id)
            })
            .then(({ data }) => {
              if (data && data.code === 0) {
                that.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                });
                that.getDataList2();
              } else {
                that.$message.error(data.msg);
              }
            });
        });
      });
    },
    // 分组修改提交
    submittingbygroups() {
      if (!this.treeForm.currentTreename) {
        this.$message.error("分组名称不能为空");
      } else {
        this.$http({
          url: this.$http.adornUrl(`/risk/spdyCommonGroup//update`),
          method: "post",
          data: this.$http.adornData({
            id: this.oftenId,
            parentId: this.parentId,
            name: this.treeForm.currentTreename,
            remark: this.treeForm.groupingdescription,
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dialogVisible = false;
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getDataList2();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    // 新增视频弹窗
    newvideosHandle(id) {
      this.treeType = "1";
      this.dialogVideoVisible = true;
      this.cameraData = [];
      this.indexcode2 = "";
      this.currenttableArray = [];
    },
    //关闭添加摄像头
    closeVideo() {
      this.dialogVideoVisible = false;
      this.treeType = "";
    },
    //添加摄像头到常用分组
    addVideoToOften() {
      this.treeType = "1";
      // console.log(this.indexCode2, this.currenttableArray);
      if (this.indexCode2 == "" || this.currenttableArray.length == 0) {
        this.$message.error("请选择要添加的节点或数据");
      } else {
        this.$http({
          url: this.$http.adornUrl(
            `/risk/spdyCommonGroup//addCameraToCommonGroup`
          ),
          method: "post",
          data: this.$http.adornData({
            id: this.indexCode2,
            cameraCodes: this.currenttableArray,
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.treeType = "";
            this.visible = false;
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
            });
            // this.checkedIds = [this.indexCode2];
            // console.log("checkids",this.checkedIds);
            // this.initData();
            this.cameraData = [];
            this.cameraData2 = [];
            this.initData();
            this.dialogVideoVisible = false;
          } else {
            this.$message.error("请选择要添加的分组或数据");
          }
        });
      }
    },
    closeVideoDialog() {
      this.treeType = "";
    },
    // // 新增人员
    // invitedToJoin(boolean) {
    //   this.invitedToJoinList = [];
    //   var that = this;
    //   this.invitedToJoinVisible = boolean;
    //   this.$http({
    //     url: this.$http.adornUrl("/mail/mailcontactor/listByPlatformId"),
    //     method: "GET",
    //     param: this.$http.adornParams()
    //   }).then(res => {
    //     if (res && res.data.code === 0) {
    //       // console.log("invitedToJoin", res);
    //       res.data.data.forEach(item => {
    //         if (item.openId) {
    //           that.invitedToJoinList.push(item);
    //         }
    //       });
    //     } else {
    //       this.$message.error(res.data.msg)
    //     }
    //   });
    // },
    // // 增人员被勾选的表格
    // invitedToJoinSelectionChange(val) {
    //   if (val.length > 1) {
    //     this.$refs.Table.clearSelection();
    //     this.$refs.Table.toggleRowSelection(val.pop());
    //   } else {
    //     this.selectInvitedToJoinList = [];
    //     // console.log("invitedToJoinSelectionChange", val);
    //     for (var i = 0; i < val.length; i++) {
    //       this.selectInvitedToJoinList.push(val[i].name);
    //       this.selectInvitedToJoinList.push(val[i].openId);
    //     }
    //   }
    // },
    // 选择联系人视图
    contactViewHandle() {
      this.showcommonLink = true;
      this.$nextTick(() => {
        this.$refs.commonLink.handleAddContacts(
          "/mail/mailgroup/list",
          "请选择"
        );
      });
    },
    // 选择联系人数据
    handelLinkdata({ linkman }) {
      // if (linkman.length > 1) {
      //   this.$refs.Table.clearSelection();
      //   this.$refs.Table.toggleRowSelection(linkman.pop());
      // } else {
      // console.log("invitedToJoinSelectionChange", val);
      this.selectInvitedToJoinList = [];
      for (var i = 0; i < linkman.length; i++) {
        this.selectInvitedToJoinList.push({
          name: linkman[i].name,
          openId: linkman[i].openId,
          id: linkman[i].id,
        });
        // }
        // console.log('this.selectInvitedToJoinList: ', this.selectInvitedToJoinList);
      }
    },
    oneSelect() {
      this.$refs.Table.toggleRowSelection(val);
    },
    sendInvitedMessage() {
      this.invitedToJoinVisible = false;
    },
    // 改变页数尺寸
    sizeChangeHandle(val) {
      this.currPage = 1;
      this.pageSize = val;
      this.initData();
    },
    // 改变当前页数
    currentChangeHandle(val) {
      this.currPage = val;
      this.initData();
    },
    // 搜索
    searchData(obj) {
      this.currPage = 1;
      this.search = obj.cameraName;
      this.typeId = obj.typeId;
      this.statusId = obj.statusId;
      if (obj.startEndAt) {
        this.startTime = obj.startEndAt[0];
        this.endTime = obj.startEndAt[1];
      }
      this.initData();
    },
  },
};
</script>
<style lang="less">
.seats {
  position: absolute;
  right: 0px;
  width: 200px;
  white-space: nowrap;
  top: 40px;
  z-index: 5;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}
.resoureteamWrap {
  .tableClass {
    padding: 3px;
    border: 1px solid rgba(230, 230, 230, 1);
    height: 652px;
    width: 100%;
    margin-left: 20px;
    min-width: 540px;
  }
  .el-table__fixed-right::before,
  .el-table__fixed::before {
    height: 0px;
  }
  thead {
    tr {
      .el-table-column--selection {
        .cell {
          display: none;
        }
      }
    }
  }
}
</style>
