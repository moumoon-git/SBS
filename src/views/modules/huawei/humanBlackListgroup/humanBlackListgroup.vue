<template>
  <!-- 人员黑名单 -->
  <div class="riskhumanblacklist">
    <div style="height:80px;margin: -20px;padding: 0 20px;" class="header">
      <el-input
        style="width:300px;float: left;"
        v-model="dataForm.key"
        placeholder="按名称搜索"
        clearable
      ></el-input>
      <el-button
        @click="getDataList()"
        style="margin-left:5px;background-color：rgb(64, 158, 255)"
      >查询</el-button>
      <el-button
        v-if="isAuth('risk:riskhumanblacklist:save')"
        type="primary"
        @click="addOrUpdateHandle()"
      >新增</el-button>
      <el-button
        @click="addToTreedialogVisible=true"
        style="background-color：rgb(64, 158, 255)"
      >新增黑名单到组</el-button>
      <el-button
        @click="blacklistSynchronization"
        style="background-color：rgb(64, 158, 255)"
      >人员黑名单同步</el-button>
      <el-button @click="oneClickSynchronization" style="background-color：rgb(64, 158, 255)">一键同步</el-button>
      <el-button @click="synchronizeCamera" style="background-color：rgb(64, 158, 255)">同步相机</el-button>
    </div>
    <!-- padding:32px 16px 0px 16px -->
    <div style="width:100%;display: flex;">
      <div style="width:15%;min-width:320px;">
        <!-- @commonSet="commonSet" -->
        <humanBlackListGroupTree
          :list="modifiedUserList"
          :listProps="modifiedUserProps"
          @handleNodeClick="handleNodeClick"
          @showTree="showEventType"
          @addTree="addEventType"
          @updateTree="updateEventType"
          @deleteTree="deleteEventType"
          @setCheckedIds="setCheckedIds"
          :Treeexpansion="Treeexpansion"
        ></humanBlackListGroupTree>
      </div>

      <div class="cardClass">
        <div class="list">
          <!-- 一个卡片单位 -->
          <div class="colStaff" v-for="item in dataList" :key="item.id">
            <div class="left" style="width:135px;">
              <!-- <el-image style="width:185px;" :src="item.imageUrl"></el-image> -->
              <img :src="item.facePicUrl" style="width:135px;height:100%" alt  v-if="item.facePicUrl.indexOf('http') !== -1"/>
              <img :src="backgroundURL + '/' + item.facePicUrl" style="width:135px;height:100%" alt v-else />
            </div>
            <div class="right">
              <ul>
                <li>
                  <label>姓名：{{item.name}}</label>
                  <span></span>
                </li>
                <li>
                  <label>性别：{{item.sex === 0 ? "未知": item.sex == 1? "男":"女" }}</label>
                  <span></span>
                </li>
                <li>
                  <label>管控类型：{{item.controlTypeName}}</label>
                  <span></span>
                </li>
                <li>
                  <label>状态：{{item.casefileId?'已同步':'未同步'}}</label>
                  <span></span>
                </li>
                <li>
                  <el-button type="text" @click="addOrUpdateHandle(item.id)">编辑</el-button>
                  <el-button @click="handleupDelete(item.id)" type="text">删除</el-button>
                </li>
                <li>
                  <el-button type="text" @click="handleSnapshot(item.id)">抓拍信息</el-button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-if="totalPage!==0">
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[12, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 监管类型 新增 / 修改 -->
    <tree-add-or-updata
      @refreshEventTypeDataList="getDatatree"
      v-if="TreeAddOrUpdataVisible"
      ref="treeAddOrUpdata"
      @reftreeDataList="getDatatree"
    ></tree-add-or-updata>
    <snapshot-record
      v-if="SnapshotRecordVisible"
      ref="SnapshotRecord"
      @refreshDataList="getDataList"
    ></snapshot-record>

    <!-- 树状, 查看，修改-->
    <el-dialog :title="dialogtitle" :visible.sync="dialogVisible" width="40%">
      <el-form :modal="treeForm" ref="treeForm">
        <el-form-item label="分组名称" size="large" label-width="100px">
          <el-input
            :readonly="groupingdisabled"
            placeholder="请输入内容"
            v-model="treeForm.currentTreename"
            clearable
            style="margin-bottom: 10px"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="分组类型" size="large" label-width="100px">
           <el-select v-model="treeForm.type" placeholder="请选择">
              <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item>-->
        <el-form-item label="分组描述" size="large" label-width="100px">
          <el-input
            placeholder="分组描述"
            v-model="treeForm.groupingdescription"
            clearable
            :readonly="groupingdisabled"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="dialogtitle==='修改分组'">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submittingbygroups">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增黑名单到组-->
    <el-dialog title="新增黑名单到组" :visible.sync="addToTreedialogVisible" width="40%">
      <el-form :modal="addToTreeObject" ref="addToTreeObject">
        <el-form-item label="请选择分组" prop="eventTypeParentName">
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
              <el-button @click="newgroups = false">取 消</el-button>
              <el-button type="primary" @click="newgroups = false">确 定</el-button>
            </span>
          </el-dialog>
          <el-input
            v-model="addToTreeObject.treeName"
            @focus="gettingfocus"
            v-popover:eventTypeListPopover
            placeholder="选择分组"
            :readonly="true"
          ></el-input>
          <el-input v-show="false" v-model="addToTreeObject.treeId" :readonly="true"></el-input>
        </el-form-item>

        <!-- <el-form-item label="分组类型" size="large" label-width="100px">
           <el-select v-model="treeForm.type" placeholder="请选择">
              <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item>-->
        <el-form-item label="选择人员黑名单">
          <el-input
            size="mini"
            placeholder="请选择人员黑名单"
            @focus="handelVerify('addToTree')"
            v-model="addToTreeObject.blackNames"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addToTreedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submittingToTree">确 定</el-button>
      </span>
    </el-dialog>

    <LinkmanDraggable ref="commonLink" v-show="showcommonLink" @OnchildByValue="handelLinkdata"></LinkmanDraggable>

    <blackListTransfer ref="serviceObjectDialog" v-if="showServiceObjectDialog"></blackListTransfer>
  </div>
</template>

<script>
import AddOrUpdate from "./humanBlackListgroup-add-or-update";
import TreeAddOrUpdata from "./humanBlackListgroup-tree-crud";
import SnapshotRecord from "./SnapshotRecordVisible";
// import Tree from './tree'
import humanBlackListGroupTree from "./humanBlackListGroup-tree";
import { treeDataTranslate } from "@/utils";
import LinkmanDraggable from "./humanBlackListDraggable";
import blackListTransfer from "./blackListTransfer";

export default {
  data() {
    return {
      // 修改||查看分组Form表单是否可用
      groupingdisabled: false,
      dialogVisible: false,
      dialogtitle: "",
      currPage: "",
      totalCount: "",
      currentTreeancestors: {},
      currentTreeparentId: "",
      currentTreeplatformId: "",
      currentTreeObject: "",
      // 保存搜索框里的值
      search: "",
      selectedNode: new Array(),
      treeForm: {
        // 分组名字
        currentTreename: "",
        // 分组描述
        groupingdescription: "",
        type: 0
      },
      dataForm: {
        key: ""
      },
      checkedIds: [],
      credentialsTypeData: [
        { value: -1, label: "无限制" },
        { value: 0, label: "未知" },
        { value: 1, label: "身份证" },
        { value: 2, label: "警官号" }
      ],
      modifiedUserList: [], // 管控类型树形结构
      modifiedUserProps: {
        children: "children",
        label: "name"
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 12,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      TreeAddOrUpdataVisible: false,
      SnapshotRecordVisible: false,
      checkedNodes: [],
      Treeexpansion: false,
      addToTreedialogVisible: false,
      addToTreeObject: {
        treeName: "",
        treeId: "",
        blackIdList: [],
        blackNames: ""
      },
      showcommonLink: false, // 获取人员黑名单弹窗
      newgroups: false,
      eventTypeList: [], // 树的数据
      eventTypeListTreeProps: {
        label: "name",
        children: "children"
      },
      showServiceObjectDialog: false,

      backgroundURL: window.SITE_CONFIG['baseUrl']
    };
  },
  components: {
    AddOrUpdate,
    // Tree,
    humanBlackListGroupTree,
    TreeAddOrUpdata,
    SnapshotRecord,
    LinkmanDraggable,
    blackListTransfer
  },
  activated() {
    this.getDatatree();
    this.getDataList();
  },
  created() {
    this.$window = window;
  },
  methods: {
    oneClickSynchronization() {
      this.$confirm("确定是否一键同步?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.$http({
            url: this.$http.adornUrl("/vcm/vcmManager/synhumanAll"),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    },
    synchronizeCamera() {
      this.$confirm("确定是否同步相机?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.$http({
            url: this.$http.adornUrl("/vcm/vcmManager/synCamera"),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    blacklistSynchronization() {
      this.showServiceObjectDialog = true;
      setTimeout(() => {
        this.$refs.serviceObjectDialog.dialogVisible = true;
      });
    },
    // 当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
    gettingfocus(event) {
      this.newgroups = true;
      this.$http({
        url: this.$http.adornUrl("/vcm/vcmHumanGroup/list"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.eventTypeParentName = "";
            data.data.splice(0, 0, {
              id: 0,
              name: "顶级分组节点",
              ancestors: "0"
            });
            this.eventTypeList = treeDataTranslate(data.data, "id");
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {
          this.visible = true;
        })
        .then(() => {
          // 新增
          // this.dataForm.name = ''
          // this.dataForm.gmtCreate = ''
          this.eventTypeListTreeSetCurrentNode();
        });
    },
    // 分组树设置当前选中节点
    eventTypeListTreeSetCurrentNode() {
      this.$refs.eventTypeTree.setCurrentKey(this.addToTreeObject.treeId);
      this.addToTreeObject.treeName = (this.$refs.eventTypeTree.getCurrentNode() ||
        {})["name"];
    },
    // 分组树选中
    eventTypeListTreeCurrentChangeHandle(data, node) {
      // console.log("data, node", data, node);
      // this.dataForm.parentId = data.id
      this.addToTreeObject.treeId = data.id;
      this.addToTreeObject.treeName = data.name;
      // if(data.id===0){
      //   this.dataForm.ancestors=data.ancestors
      // } else{
      //   this.dataForm.ancestors=data.ancestors+','+data.id
      // }
    },
    submittingToTree() {
      this.$http({
        url: this.$http.adornUrl(`/vcm/vcmHumanGroup/saveHumanToVcmGroup`),
        method: "post",
        data: this.$http.adornData({
          id: this.addToTreeObject.treeId,
          humans: this.addToTreeObject.blackIdList
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
          this.getDatatree();
          this.addToTreedialogVisible = false;
        } else {
          // console.log(data);
          this.$message.error(data.msg);
        }
      });
    },
    handelVerify(name) {
      this.showcommonLink = true;
      this.$refs.commonLink.handleAddContacts(
        "/vcm/vcmHumanGroup/list",
        "请选择",
        name
      );
    },
    // 人员黑名单弹窗多选组件返回数据
    handelLinkdata({ linkman, name }) {
      // console.log("人员黑名单弹窗多选组件返回数据linkman, name", linkman, name);
      linkman.forEach(item => {
        this.addToTreeObject.blackIdList.push(`${item.id}`);
        this.addToTreeObject.blackNames =
          this.addToTreeObject.blackNames + " " + item.name;
      });
    },
    // 分组修改提交
    submittingbygroups() {
      if (!this.treeForm.currentTreename) {
        this.$message.error("分组名称不能为空");
      } else {
        this.dialogVisible = false;
        this.$http({
          url: this.$http.adornUrl(`/risk/riskHumanBlacklistGroup/update`),
          method: "post",
          data: this.$http.adornData({
            id: this.currentTreeObject,
            name: this.treeForm.currentTreename,
            parentId: this.currentTreeparentId,
            ancestors: this.currentTreeancestors,
            orderNum: this.currentTreeorderNum,
            remark: this.treeForm.groupingdescription
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
            this.getDatatree();
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    // 点击树形节点事件
    handleNodeClick(obj) {
      function findChilden(obj, list) {
        list.push(obj.id);
        let children = obj.children;
        // console.log(list);
        if (children != null) {
          children.forEach((item, index) => {
            // console.log(item);
            findChilden(item, list);
          });
        }
      }

      // console.log("树形结点点击事件", obj);
      this.selectedNode = [];
      this.currentTreeObject = obj.id;
      this.treeForm.currentTreename = obj.name;
      this.search = "";
      // 分组描述
      this.treeForm.groupingdescription = obj.remark;
      this.treeForm.type = obj.type;
      this.currentTreeplatformId = obj.platformId;
      this.currentTreeparentId = obj.parentId;
      this.currentTreeancestors = obj.ancestors;

      findChilden(obj, (this.selectedNode = []));

      // console.log("selectedNode:" + this.selectedNode);
      // console.log(this.currentTreeObject);
      // console.log(this.treeForm.currentTreename);
      // console.log({
      //   limit: this.pageSize,
      //   page: 1,
      //   groupId: this.selectedNode
      // });
      // 查询树形关联的联系人
      this.$http({
        url: this.$http.adornUrl(`/vcm/vcmHumanGroup/selectHumanByVcmGroup`),
        method: "get",
        params: this.$http.adornParams({
          limit: this.pageSize,
          page: 1,
          // eventTypeId: this.selectedNode.join()
          id: this.selectedNode.join()
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log("/risk/riskhumanblacklist/list", data);
          this.totalPage = data.data.totalCount;
          this.pageIndex = data.data.currPage;
          this.pageSize = data.data.pageSize;
          this.dataList = data.data.list;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    handleSnapshot(id) {
      this.SnapshotRecordVisible = true;
      this.$nextTick(() => {
        this.$refs.SnapshotRecord.init(id);
      });
    },
    // 导出人员黑名单数据
    planpdf() {
      let httpaddress = window.SITE_CONFIG.baseUrl;
      let token = document.cookie
        .substring(document.cookie.indexOf("token="))
        .substring("6");
      // console.log(token);
      if (!this.checkedIds.length) {
        this.$message({
          message: "请选择一个人员黑名单类型进行导出",
          type: "warning"
        });
      } else {
        window.location.href = `${httpaddress}//risk/riskhumanblacklist/output-excel?controlTypeId=${
          this.checkedIds[0]
        }&token=${this.$cookie.get("token")}`;
      }
    },
    // 导出黑名单模板
    exportExcel() {
      let httpaddress = window.SITE_CONFIG.baseUrl;
      let token = document.cookie
        .substring(document.cookie.indexOf("token="))
        .substring("6");
      // console.log(token);
      // window.open(
      //   `${httpaddress}//risk/riskhumanblacklist/get-template?token=${this.$cookie.get('token')}`
      // )
      window.location.href = `${httpaddress}//risk/riskhumanblacklist/get-template?token=${this.$cookie.get(
        "token"
      )}`;
    },
    // 自定义文件上传行为
    uploadSectionFile(param) {
      let form = new FormData();
      // console.log("parma////////", param);
      form.append("file", param.file);
      this.$http({
        url: this.$http.adornUrl(`/risk/riskhumanblacklist/input-excel`),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data: form
      })
        .then(({ data }) => {
          if (!data.code) {
            this.$message({
              message: "预案导入成功",
              type: "success"
            });
            this.dataForm.enclosure = data.filePath;
            this.dataForm.fileName = data.fileName;
            // 上传成功重新请求数据渲染页面
            // this.$emit('planData')
            this.getDataList();
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {
          // alert(err);
        });
    },
    // 编辑
    handleDelet(id) {
      this.$http({
        url: this.$http.adornUrl(`/risk/riskhumanblacklist/delete`),
        method: "post",
        data: this.$http.adornData({
          ids: [id]
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data);
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    /* 树形结点点击事件 */
    // handleNodeClick (obj) {
    //   console.log('树形结点点击事件', obj)
    //   this.currentTreeObject = obj
    //   // 查询对就的预案
    //   // this.getPlanById(this.currentTreeObject.id)
    // },
    // 删除管控类型
    deleteEventType(data) {
      // console.log('删除事件类型', data)
      // this.deleteEventTypeHandle(data)

      var that = this;
      this.$confirm(`确定对进行[删除]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var checkedNames = "";
        if (that.checkedNodes.length > 0) {
          that.checkedNodes.forEach(item => {
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
              url: that.$http.adornUrl(`/vcm/vcmHumanGroup/delete`),
              method: "POST",
              data: this.$http.adornData({
                ids: that.checkedIds
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
                that.getDatatree();
              } else {
                that.$message.error(data.msg);
              }
            });
        });
      });
    },
    // 删除事件类型
    deleteEventTypeHandle(data) {
      this.$confirm(`确定${data.name}进行删除操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(""),
            method: "post",
            data: this.$http.adornData(data.id, false)
          }).then(({ data }) => {
            if (data.rePlan.length > 0) {
              this.$message.error("删除的事件类型中存在预案，请先删除预案!");
            } else {
              this.$http({
                url: this.$http.adornUrl("/event/eventType/delete"),
                method: "post",
                data: this.$http.adornData(data.id, false)
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
            }
          });
        })
        .catch(() => {});
    },
    // 修改管控类型
    updateEventType(data) {
      // console.log(data.id)
      // this.TreeAddOrUpdataVisible = true
      // this.$nextTick(() => {
      //   this.$refs.treeAddOrUpdata.init(data.id)
      //   // this.$refs.treeAddOrUpdata.init(id, this.currentTreeObject, 3) // 代表修改
      // })
      // console.log(this.treeForm.currentTreename);
      this.dialogVisible = true;
      this.dialogtitle = "修改分组";
      this.groupingdisabled = false;
    },
    // 查看事件类型
    showEventType(id) {
      // this.eventtypeAddOrUpdateVisible = true
      // this.$nextTick(() => {
      //   this.$refs.eventtypeAddOrUpdate.init(id, this.currentTreeObject, 1) // 1代表查看
      // })
      this.dialogVisible = true;
      this.dialogtitle = "查看分组";
      this.groupingdisabled = true;
    },
    // 勾选的树形控件 全部预案id
    checkGroupNode(checkedIds) {
      this.checkedIds = checkedIds;
      // this.checkedIds.splice(0, this.checkedIds.length, ...checkedIds)
      // 传值给子元素
    },
    // 添加事件类型
    addEventType(id) {
      this.TreeAddOrUpdataVisible = true;
      this.$nextTick(() => {
        this.$refs.treeAddOrUpdata.init(null, null, 2); // 代表新增
      });
    },
    // 获取树形分类
    getDatatree() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl(`/vcm/vcmHumanGroup/list`),
        method: "get",
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // data.list.forEach(item => {
          //   if (item.children) {
          //     item.children = item.levels.concat(item.children)
          //   } else {
          //     item.children = item.levels
          //   }
          // })
          // this.modifiedUserList = data.list
          // console.log(this.modifiedUserList)
          // console.log("/vcm/vcmHumanGroup/list", data);
          this.modifiedUserList = treeDataTranslate(data.data, "id");
        } else {
          this.$message.error(data.msg);
        }
        this.dataListLoading = false;
      });
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true; // 遮罩
      this.$http({
        url: this.$http.adornUrl("/risk/riskhumanblacklist/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          eventTypeId: this.selectedNode.join()
        })
      }).then(({ data }) => {
        // console.log(data);
        if (data && data.code === 0) {
          data.page.records.forEach((item, index, arr) => {
            // item.credentialsType
            arr[index]["credentialsName"] =
              this.credentialsTypeData.find(
                items => items.value === item.credentialsType
              ).label || "";
            if (item.facePicUrl && item.facePicUrl.search("http") != -1) {
              arr[index]["imageUrl"] = item.facePicUrl;
            } else {
              arr[index]["imageUrl"] =
                window.SITE_CONFIG.baseUrl + "/" + item.facePicUrl;
            }
            var urlList = arr[index]["imageUrl"].split("");

            for (let i = 0; i < urlList.length; i++) {
              if (urlList[i] === "\\") {
                urlList[i] = "/";
              }
            }
            setTimeout(() => {
              arr[index]["imageUrl"] = urlList.join("");
            }, 1000);
          });
          this.dataList = data.page.records;
          this.totalPage = data.page.total;
        } else {
          this.$message.error(data.msg);

          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    getPagesChange() {
      this.$http({
        url: this.$http.adornUrl(`/risk/riskhumanblacklist/list-by-type`),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          eventTypeId: this.selectedNode.join()
        })
      }).then(({ data }) => {
        // console.log("/risk/riskhumanblacklist/list", data);
        if (data && data.code === 0) {
          data.data.list.forEach((item, index, arr) => {
            // item.credentialsType
            arr[index]["credentialsName"] =
              this.credentialsTypeData.find(
                items => items.value === item.credentialsType
              ).label || "";
            if (item.facePicUrl && item.facePicUrl.search("http") != -1) {
              arr[index]["imageUrl"] = item.facePicUrl;
            } else {
              arr[index]["imageUrl"] =
                window.SITE_CONFIG.baseUrl + "/" + item.facePicUrl;
            }

            var urlList = arr[index]["imageUrl"].split("");

            for (let i = 0; i < urlList.length; i++) {
              if (urlList[i] === "\\") {
                urlList[i] = "/";
              }
            }
            setTimeout(() => {
              arr[index]["imageUrl"] = urlList.join("");
            }, 1000);
          });
          this.totalPage = data.data.totalCount;
          this.pageIndex = data.data.currPage;
          this.pageSize = data.data.pageSize;
          this.dataList = data.data.list;
        } else {
          this.$message.error(data.msg);

          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      // this.getDataList()
      this.getPagesChange();
    },
    // 当前页
    currentChangeHandle(val) {
      // console.log();
      this.pageIndex = val;
      // this.getDataList()
      this.getPagesChange();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    handleupDelete(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.id;
          });
      // console.log(ids);

      this.$confirm(
        `确定对当前黑名单进行${id ? "删除" : "批量删除"}操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl("/risk/riskhumanblacklist/delete"),
          method: "post",
          data: this.$http.adornData(ids, false)
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
      });
    },
    // 树形复选框勾选ID
    setCheckedIds(checkedIds, checkedNodes) {
      this.checkedIds = checkedIds;
      this.checkedNodes = checkedNodes;
    }
  }
};
</script>
<style lang="less" >
.riskhumanblacklist {
  .el-button {
    margin-left: initial;
  }
  .header {
    clear: both;
    line-height: 80px;
    /* border: 1px solid rgba(219, 219, 219, 1); */
    border-radius: 3px;
  }
  .cardClass {
    padding: 3px;
    border: 1px solid rgba(230, 230, 230, 1);
    width: 82%;
    margin-left: 20px;
    min-width: 1020px;
  }
  ul {
    margin: 0;
    padding: 0;
  }
  ul li {
    list-style: none;
  }
  .list {
    display: flex;
    justify-content: space-between;
    align-content: space-between;
    padding: 10px;
    flex-wrap: wrap;
  }
  .list:after {
    content: "";
    width: 33%;
    border: 1px solid transparent;
  }
  .colStaff {
    width: 24%;
    min-width: 280px;
    padding: 5px;
    border: 1px solid #eee;
    display: flex;
    margin: 5px;
    .el-image {
      width: 100%;
    }
    .right {
      ul {
        padding-left: 10px;
        padding-top: 10px;
        li {
          line-height: 28px;
          text-align: left;
        }
      }
    }
  }
}
</style>