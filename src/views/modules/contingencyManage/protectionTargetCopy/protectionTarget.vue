<template>
  <div class="resoureteamWrap">
    <sv-template
      ref="template"
      :treeSetting="treeSetting"
      @tree-click="handleNodeClick"
      @tree-node-delete="deleteEventType"
      title="防护目标"
      :dateSelect="false"
      :searchSetting="{
          width: '280px',
          placeholder: '请输入名称搜索',
      }"
      :exportSelectConfig="{
          api: '/resoure/resoureProtectTarget/xlsOutputSelect',
          params: {}
      }"
      :exportQueryConfig="{
          api: '/resoure/resoureProtectTarget/xlsOutput',
          params: {}
      }"
      :importDataConfig="{api:'/resoure/resoureProtectTarget/xlsInput'}"
      :downloadTemplateConfig="{api: '/resoure/resoureProtectTarget/gettemplate'}"
      :deleteSelectedConfig="{api: '/resoure/resoureProtectTarget/delete'}"
      :tableRequest="tableRequest"
    >
    <template #middle__operation__button>
      <sv-button
            type="primary"
            @click="addNewProtectionTarget()"
            v-if="isAuth('resoure:resoureteam:save')"
        >新增</sv-button>
    </template>

    <template #middle__table>    
      
      <el-table-column
        header-align="center"
        align="center"
        label="名称" :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <sv-table-tooltip :content="scope.row.name"/>
        </template>
      </el-table-column>

       <el-table-column
        header-align="center"
        align="center"
        label="地址" :show-overflow-tooltip="true"
        >
        <template slot-scope="scope">
          <sv-table-tooltip :content="scope.row.location"/>
        </template>
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        label="主体单位"
        >
        <template slot-scope="scope">
          <sv-table-tooltip :content="scope.row.chargeUnit"/>
        </template>
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        label="联系人"  :show-overflow-tooltip="true"
        >
        <template slot-scope="scope">
          <sv-table-tooltip :content="scope.row.contactName"/>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="联系电话"  :show-overflow-tooltip="true"
        >
        <template slot-scope="scope">
          <sv-table-tooltip :content="scope.row.mobile"/>
        </template>
      </el-table-column>

      <el-table-column
        header-align="center"
        align="center"
        width="170px"
        label="操作">
        <template slot-scope="scope">
            <!-- <div class="opration">
            <el-button type="info" size="small" @click.native="addOrUpdateHandle(scope.row.id,'watch')">查看</el-button>
            <span type="primary" size="small" @click="addOrUpdateHandle(scope.row.id,'edit')">编辑</span>
            <span type="danger" size="small" @click="batchDelete(scope.row.id)">删除</span>
          </div> -->
          <sv-table-operation
              :display="['view', 'edit', 'delete']"
              @view="seeOrUpdateHandle(scope.row.id,'watch')"
              @edit="seeOrUpdateHandle(scope.row.id,'edit')"
              @delete="
                deleteIds = [scope.row.id]
                $refs.delete_hint.visible = true
              "
          ></sv-table-operation>
        </template>
      </el-table-column>
      </template>
    <!-- </div> -->

    <!-- <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[20, 30, 50, 100]"
      :page-size="pageSize"
      :total="totalCount"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination> -->
    </sv-template>
    <!-- 弹窗, 新增  -->
    <add v-if="addVisible" ref="add" @refresh="getDataList" @close="addVisible=false"></add>
    <!-- 弹窗, 查看 / 修改 -->
    <see-or-update
      v-if="seeOrUpdateVisible"
      ref="seeOrUpdate"
      @refresh="getDataList"
      @close="seeOrUpdateVisible=false"
    ></see-or-update>
    <!-- 删除提示弹窗 -->
        <sv-dialog-hint ref="delete_hint" type="delete" @confirm="handleDelete(deleteIds)"/>
        <sv-dialog-hint ref="delete_fail" type="fail" text="抱歉！删除失败"/>
    
  </div>
</template>

<script>
import protectiontargettree from "./protectionTarget-tree";
// import protectiontargetheader from "./protectionTarget-header";
import add from "./protectionTarget-add";
import seeOrUpdate from "./protectionTarget-see-or-update";
// import protectiontargetTable from "./protectionTarget-table";
import protectiontargettreecrud from "./protectionTarget-tree-crud";
import { treeDataTranslate } from "@/utils";
import Cookies from "js-cookie";
import axios from 'axios';
var token = document.cookie;
var httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  // props: ["dataList"],
  data() {
    return {
      // 树形接口
            treeSetting: {
                api: '/resoure/resoureProtectGroup/listTree',
                edit: {
                    add: '/resoure/resoureProtectGroup/save',
                    update: '/resoure/resoureProtectGroup/update',
                    // delete: '/resoure/resoureriskreasongroup/delete'
                }
            },
            // 表格数据接口
            tableRequest: {
                api: '/resoure/resoureProtectTarget/listByGroupId',
                params: {
                groupId: [],
                  }
            },

      selectedNode: [],
      fileList: [],
      //获取到的token
      documenttoken: `${httpaddress}/resoure/resoureProtectTarget/xlsInput?token=${this.$cookie.get(
        "token"
      )}`,
      filename: "",
      //上传文件的文件名
      uploadfilesname: "",
      // 树形勾选框选中的id
      checkedIds: [],
      dialogVisible: false,
      dialogtitle: "",
      groupingdisabled: false,
      treeForm: {
        id: "",
        parentId: "",
        ancestors: "",
        // 分组名字
        currentTreename: "",
        //分组描述
        groupingdescription: ""
      },
      //表格
      platShareMenuList: [],
      Treeexpansion: false,
      dataForm: {
        key: ""
      },
      //树形
      modifiedUserList: [],
      modifiedUserProps: {
        children: "children",
        label: "name"
      },
      dataList: [],
      pageIndex: 1,
      totalCount: 0,
      pageSize: 20,
      // 分页器配置
            // paginationConfig: {
            //     currentIndex: 1,
            //     totalCount: 0,
            //     pageSize: 10
            // },
      dataListLoading: false,
      dataListSelections: [],
      addVisible: false,
      seeOrUpdateVisible: false,
      //队伍类型Visible
      resoureteamtreeCrudVisible: false
    };
  },
  components: {
    add,
    seeOrUpdate,
    protectiontargettree,
    // protectiontargetTable,
    protectiontargettreecrud,
    // protectiontargetheader
  },
  methods: {
    /**
         * @method
         * @desc 获取表格数据
         */
        // getTableList() {
        //     this.$refs.template.getTableList(this.tableRequest)
        // },
// getDataList() {
//             // this.tableLoading = true
//             const data = Object.assign(
//                 {},
//                 {
//                     search: "",
//                     page: this.pageIndex,
//                     limit: this.pageSize,
//                 },
//             )
//             const request = {
//                 method: 'get',
//                 url: this.$http.adornUrl(`/resoure/resoureProtectTarget/listByGroupId`),
//                 baseURL: window.SITE_CONFIG.baseUrl,
//                 // headers: {
//                 //     'Content-Type': 'application/json; charset=utf-8',
//                 //     token: this.token,
//                 // },
//                 data
//             }
//             axios(request).then(
//                 response => {
//                     if(response.data.code == 0) {
//                         // 表格内容
//                         this.platShareMenuList = response.data.page.list
//                         this.totalCount = response.data.page.totalCount
//                         // this.$emit('refresh', request, response.data)
//                     }
//                     // this.tableLoading = false
//                 }
//             )
//         },
    // 新增
    // newcontactsHandle () {
    //   this.$emit('addNewProtectionTarget')
    // },
    /**
         * @method
         * @desc 点击树形，获取表格数据
         */
        // handleTreeClick(data, tabIndex) {
        //     this.tableRequest.params.groupIds = data ? [data.id] : []
        //     this.getTableList()
        // },

    // 新增队伍弹窗
    addNewResoureteam() {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(this.treeForm.id, "");
      });
    },
    //被勾选的表格
    handleSelectionChange(val) {
      var tal = [];
      this.$emit("handleSelectionChange", val);
      for (var i = 0; i < val.length; i++) {
        tal.push(val[i].id);
        this.currenttableArray = tal;
      }
      // console.log(this.currenttableArray);
    },
    //点击树形节点事件
    handleNodeClick(obj) {
      function findChilden(obj, list) {
        list.push(obj.id);
        let children = obj.children;
        // console.log(list)
        if (children != null) {
          children.forEach((item, index) => {
            // console.log(item)
            findChilden(item, list);
          });
        }
      }

      // console.log("树形结点点击事件", obj);
      this.selectedNode = [];
      this.currentTreeObject = obj.id;
      this.treeForm.currentTreename = obj.name;
      this.search = "";
      //分组描述
      this.treeForm.groupingdescription = obj.remark;
      this.treeForm.id = obj.id;
      this.treeForm.ancestors = obj.ancestors;
      this.treeForm.parentId = obj.parentId;
      this.treeForm.name = obj.name;
      this.currentTreeplatformId = obj.platformId;
      this.currentTreeparentId = obj.parentId;
      this.currentTreeancestors = obj.ancestors;

      findChilden(obj, (this.selectedNode = []));
      this.tableRequest.params.groupId = this.selectedNode
      this.getDataList();
      // this.$refs.template.getTableList(this.tableRequest)
      
     },
    // //点击树形节点事件
    // handleNodeClick(obj) {
    //   this.tableRequest.params.groupId = obj ? [obj.id] : [] ;
    //   console.log(this.tableRequest.params.groupId);
    //   this.getDataList();


    //   // function findChilden(obj,list){
    //   //   list.push(obj.id)
    //   //   let children = obj.children
    //   //   console.log(list)
    //   //   if(children!=null){
    //   //     children.forEach((item, index) => {
    //   //       console.log(item)
    //   //       findChilden(item,list)
    //   //     })
    //   //   }
    //   // }

    //   // console.log("树形结点点击事件", obj);
    //   // this.selectedNode=[]
    //   // this.currentTreeObject = obj.id;
    //   // this.treeForm.currentTreename = obj.name;
    //   // this.search = "";
    //   // //分组描述
    //   // this.treeForm.groupingdescription = obj.remark;
    //   // this.treeForm.id = obj.id;
    //   // this.treeForm.ancestors = obj.ancestors;
    //   // this.treeForm.parentId = obj.parentId;
    //   // this.treeForm.name = obj.name;
    //   // this.currentTreeplatformId = obj.platformId;
    //   // this.currentTreeparentId = obj.parentId;
    //   // this.currentTreeancestors = obj.ancestors;

    //   // findChilden(obj, this.selectedNode=[])

    //   // // console.log("selectedNode:"+this.selectedNode);
    //   // // console.log(this.currentTreeObject);
    //   // // console.log(this.treeForm.currentTreename);
    //   // //查询树形关联的联系人
    //   // this.$http({
    //   //   url: this.$http.adornUrl(`/resoure/resoureProtectTarget/listByGroupId`),
    //   //   // method: "GET",
    //   //   // params: this.$http.adornParams({
    //   //   //   limit: this.pageSize,
    //   //   //   page: this.pageIndex,
    //   //   //   groupId: this.currentTreeObject !== 0 ? this.currentTreeObject : "",
    //   //   //   search: ""
    //   //   // })
    //   //   method: "post",
    //   //       headers: {
    //   //                   'Content-Type': 'application/json; charset=utf-8',
    //   //                   token: document.cookie,
    //   //               },
    //   //       data:this.$http.adornParams({
    //   //         limit: String(this.pageSize),
    //   //         page: String(this.pageIndex),
    //   //         groupId: String(this.currentTreeObject),
    //   //         search: ""
    //   //       })
    //   // }).then(({ data }) => {
    //   //   if (data && data.code === 0) {
    //   //      console.log("获取表格数据",data);
    //   //     // this.totalCount = data.data.totalCount;
    //   //     // this.currPage = data.data.currPage;
    //   //     // this.pageSize = data.data.pageSize;
    //   //     this.platShareMenuList = data.page.list;
    //   //   } else {
    //   //     this.$message.error(data.msg);
    //   //   }
    //   // });
    // },
    //查看分组
    showEventType() {
      this.dialogVisible = true;
      this.dialogtitle = "查看防护目标组";
      this.groupingdisabled = true;
    },
    //添加分组
    addEventType() {
      this.resoureteamTreeCrudVisible = true;
      this.$nextTick(() => {
        this.$refs.resoureteamTreeCrud.init(null, null, 2); //代表新增
      });
    },
    //修改分组名称
    updateEventType(id) {
      // console.log(this.treeForm.currentTreename);
      this.dialogVisible = true;
      this.dialogtitle = "修改防护目标组";
      this.groupingdisabled = false;
    },
    // //分组拖拽排序
    // modifythename(before, after, inner, event) {
    //   let treesubnode = [];
    //   // console.log("==============");
    //   // console.log(this.modifiedUserList);
    //   // console.log(before); // 移动的节点
    //   // console.log(after); // 移动到的父节点
    //   // console.log(inner);
    //   // console.log("==============");
    //   let prentId;
    //   if (inner == "inner") {
    //     prentId = after.data.id;
    //     //this.modifiedUserList
    //   } else {
    //     prentId = after.data.parentId;
    //   }
    //   // console.log(prentId);
    //   // console.log(this.modifiedUserList);
    //   let groupId = before.data.id;
    //   let ancestors;
    //   let parentId;
    //   let groupIds;
    //   let prent;
    //   if (prentId == 0) {
    //     ancestors = "0";
    //     parentId = 0;
    //     groupIds = new Array();
    //     this.modifiedUserList.forEach((item, index) => {
    //       groupIds.push(item.id);
    //     });
    //   } else {
    //     prent = findPrent(prentId, this.modifiedUserList);
    //     ancestors = prent.ancestors + "," + prent.id;
    //     parentId = prent.id;
    //     groupIds = new Array();
    //     prent.children.forEach((item, index) => {
    //       groupIds.push(item.id);
    //     });
    //   }
    //   // console.log(groupId);
    //   // console.log(ancestors);
    //   // console.log(parentId);
    //   // console.log(groupIds);
    //   var params = {
    //     id: groupId,
    //     ancestors: ancestors,
    //     parentId: parentId,
    //     groupIds: groupIds,
    //     children: before.data.children
    //   };
    //   this.$http({
    //     url: this.$http.adornUrl("/resoure/resoureteamtype/order"),
    //     method: "POST",
    //     data: this.$http.adornData(params, false)
    //   }).then(({ data }) => {
    //     if (data && data.code === 0) {
    //       this.getTableList();
    //       // console.log(data);
    //       this.$message({
    //         message: "操作成功",
    //         type: "success",
    //         duration: 1500
    //       });
    //     } else {
    //       this.$message.error(data.msg);
    //     }
    //   });

    //   function findPrent(prentId, list) {
    //     for (let i = 0; i < list.length; i++) {
    //       var item = list[i];

    //       if (item.id == prentId) {
    //         // console.log(item.name);
    //         return item;
    //       }
    //       if (item.children != null) {
    //         let temp = findPrent(prentId, item.children);
    //         if (temp != null) {
    //           return temp;
    //         }
    //       }
    //     }
    //     return null;
    //   }
    // },
    
    //树形复选框勾选ID
    setCheckedIds(checkedIds, checkedNodes) {
      this.checkedIds = checkedIds;
      this.checkedNodes = checkedNodes;
    },
    // 获取数据列表
    getDataList() {
      this.$refs.template.getTableList(this.tableRequest)
      // this.dataListLoading = true;
      // this.$http({
      //   url: this.$http.adornUrl("/resoure/resoureProtectGroup/listTree"),
      //   method: "get"
      // }).then(({ data }) => {
      //   if (data.code === 0) {
      //     // data.data.splice(0,0, {id:0,name: '所有目标',ancestors:0})
      //     // console.log(data.data);
      //     // this.modifiedUserList = treeDataTranslate(data.data, "id");
      //     this.modifiedUserList = data.data;
      //     // console.log(this.modifiedUserList)
      //     //请求表格数据
      //     this.$http({
      //       url: this.$http.adornUrl(
      //         "/resoure/resoureProtectTarget/listByGroupId"
      //       ),
      //       method: "post",
      //   headers: {
      //               'Content-Type': 'application/json; charset=utf-8',
      //               token: document.cookie,
      //           },
      //   data:this.$http.adornParams({
      //     limit: String(this.pageSize),
      //     page: String(this.pageIndex),
      //     groupId: this.currentTreeObject,
      //     search: ""
      //   })
      //       // method: "get",
      //       // params: this.$http.adornParams({
      //       //   groupId: this.currentTreeObject,
      //       //   limit: this.pageSize,
      //       //   page: this.pageIndex,
      //       //   search: ""
      //       // })
      //     }).then(({ data }) => {
      //       if (data.code === 0) {
      //         console.log("getDataList", data);
      //         this.totalCount = data.page.totalCount;
      //         this.currPage = data.page.currPage;
      //         this.pageSize = data.page.pageSize;
      //         this.platShareMenuList = data.page.list;
      //         this.handleNodeClick(data.tree[0]);
      //         console.log('this.platShareMenuList',this.platShareMenuList)
      //       } else {
      //         this.$message.error(data.msg);
      //       }
      //     });
      //   } else {
      //     this.$message.error(data.msg);
      //   }
      // });
    },
    // 分组修改提交
    submittingbygroups() {
      if (!this.treeForm.currentTreename) {
        this.$message.error("分组名称不能为空");
        return;
      } else {
        this.dialogVisible = false;
        this.$http({
          url: this.$http.adornUrl(`/resoure/resoureProtectGroup/update`),
          method: "post",
          data: this.$http.adornData({
            id: this.treeForm.id,
            parentId: this.treeForm.parentId,
            name: this.treeForm.currentTreename
            // 'ancestors':this.treeForm.ancestors
          })
        }).then(({ data }) => {
          if (data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getDataList();
                console.log("分组修改this.getDataList", this.getDataList)
              }
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    // 每页数
    // sizeChangeHandle(val) {
    //   this.pageSize = val;
    //   this.pageIndex = 1;
    //   this.getDataList();
    // },
    // 当前页
    // currentChangeHandle(val) {
    //   this.pageIndex = val;
    //   this.getDataList();
    // },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增
    addNewProtectionTarget() {
      this.addVisible = true;
      this.$nextTick(() => {
        this.$refs.add.init();
      });
    },
    // 查看 / 修改
    seeOrUpdateHandle(id, status) {
      this.seeOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.seeOrUpdate.init(id, status);
      });
    },
    //删除分组
    deleteEventType(ids) {
      var that = this;
      // console.log('删除前that.checkedIds',that.checkedIds)
      this.$confirm(`确定进行[删除]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var checkedNames = "";
        if (that.selectedNode.length > 0) {
          that.selectedNode.forEach(item => {
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
          if (this.$refs.template.tableList.length > 0) {
              this.$alert("请先删除分组里的内容", "提醒", {
                confirmButtonText: "确定",
              });
              return;
            }
          that
            .$http({
              url: that.$http.adornUrl(`/resoure/resoureProtectGroup/delete`),
              method: "post",
              data: that.$http.adornData(
                {
                  ids: that.selectedNode
                },
                false
              )
            })
            .then(({ data }) => {
              if (data && data.code === 0) {
                that.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500
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
     * @method
     * @desc 删除数据
     * @param 需要删除的数据的id数组
     */
    handleDelete(ids) {
        const request = {
            method: 'post',
            url:  '/resoure/resoureProtectTarget/delete',
            baseURL: window.SITE_CONFIG.baseUrl,
            data: {
                ids
            }
        }
        this.$http(request)
        .then(response => {
            if(response.data.code == 0) {
                // 提交成功后，刷新表格
                // this.$refs.template.getTableList(this.tableRequest)
                this.getDataList();
            } else {
                console.log('删除失败！错误信息：【\n', response, '\n】')
                this.$refs.delete_fail.visible = true
                this.$refs.delete_fail.supplementText = `错误代码：${response.data.code}`
            }
        })
        .catch(error => {
            console.log('删除失败！错误信息：【\n', error, '\n】')
            this.$refs.delete_fail.visible = true
            this.$refs.delete_fail.supplementText = error
        })
    },

    //删除||批量删除联系人
    batchDelete(id) {
      if (!this.currentTreeObject) {
        var ids = {
          ids: this.currenttableArray || [id],
          groupId: null
        };
      } else {
        var ids = {
          ids: this.currenttableArray || [id],
          groupId: this.currentTreeObject
        };
      }
      this.$confirm(
        `确定对id为${this.currenttableArray || [
          id
        ]}进行删除操作?删除该防护目标将会删除所有目标组的该防护目标，确定吗？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/resoure/resoureProtectTarget/delete"),
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
              this.$message.error("请选择一个联系人删除");
            }
          });
        })
        .catch(() => {});
    },
    //上传成功的回调
    handleAvatarSuccess(response, file, fileList) {
      this.filename = file.name;
      // console.log("上传成功的回调", response);
      // console.log("上传成功的回调2", file);
      // console.log(fileList);
      if (file.response.errorData.length == 0) {
        this.$message({
          message: "导入成功!",
          type: "success"
        });
        this.getDataList();
      } else if (file.response.errorData.length > 0) {
        this.getDataList();
        this.errorDataVisible = true;
        this.$nextTick(() => {
          this.$refs.errorData.init(file.response.errorData); //
        });
      } else {
        this.$message.error({
          type: "error",
          message: `${file.response.msg}`
        });
      }
    },
    //联系人搜索
    searchcontacts(contactsearch) {
      // console.log(this.currentTreeObject);
      this.search = contactsearch;
      this.pageIndex = 1;
      this.selectedNode = [];
      this.$http({
        url: this.$http.adornUrl(`/resoure/resoureProtectTarget/listByGroupId`),
        // method: "get",
        // params: this.$http.adornParams({
        //   groupId: this.currentTreeObject,
        //   search: contactsearch,
        //   limit: this.pageSize,
        //   page: this.pageIndex
        // })
        method: "post",
            headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        token: document.cookie,
                    },
            data:this.$http.adornParams({
              limit: this.pageSize,
              page: this.pageIndex,
              groupId: this.currentTreeObject,
              search: ""
            })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.platShareMenuList = data.data.list;
          // this.totalCount = data.data.totalCount;
          // this.currPage = data.data.currPage;
          // this.pageSize = data.data.pageSize;
        } else {
          this.$message.error(data.msg);
        }
      });
    }
  },
};
</script>
<style lang="less">

</style>