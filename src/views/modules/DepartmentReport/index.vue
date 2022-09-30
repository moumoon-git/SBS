<template>
  <div class="wrap">
    <el-header
      style="height: initial;padding: 10px 16px; clear: both;border:1px solid rgba(219, 219, 219, 1);border-radius:3px;"
      class="left"
    >
      <departmentReportHeader
        @downloadtemplate="downloadtemplate"
        @addNewTable="addNewTable"
        :uploadfilesname="uploadfilesname"
        :beforeUploadFile="beforeUploadFile"
        :filename="filename"
        @exportExcel="exportExcel"
        @batchDelete="batchDelete"
        @handleAvatarSuccess="handleAvatarSuccess"
        :documenttoken="documenttoken"
        :fileList="fileList"
        @searchcontacts="searchcontacts"
      >
      </departmentReportHeader>
    </el-header>
    <div style="height:8px;width:100%;background: rgb(240, 243, 244);"></div>

    <div style="width:100%;display: flex;padding:32px 16px 0px 16px">
      <!-- 树形控件 -->
      <div style="width:15%;min-width:320px;">
        <departmentReportTree
          :list="modifiedUserList"
          :listProps="modifiedUserProps"
          @handleNodeClick="handleNodeClick"
          @showTree="showTree"
          @addTree="addTree"
          @updateTree="updateTree"
          @modifythename="modifythename"
          @deleteTree="deleteTree"
          @setCheckedIds="setCheckedIds"
          :Treeexpansion="Treeexpansion"
        >
        </departmentReportTree>
      </div>
      <div class="tableClass">
        <div style="height:583px;max-height:583px;">
          <departmentReportTable
            :dataList="platShareMenuList"
            @addOrUpdateHandle="addOrUpdateHandle"
            @handleSelectionChange="handleSelectionChange"
            @batchDelete="batchDelete"
          >
          </departmentReportTable>
        </div>
        <div>
          <!--分页-->
          <el-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="currPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalCount"
            layout="total, sizes, prev, pager, next, jumper"
          >
          </el-pagination>
          <!--分页-->
        </div>
      </div>
    </div>
    <!-- 树状, 查看，修改-->
    <el-dialog :title="dialogtitle" :visible.sync="dialogVisible" width="40%">
      <el-form :rules="rules" :modal="treeForm" ref="treeForm">
        <el-form-item label="仓库名称" size="large" label-width="100px">
          <el-input
            :readonly="groupingdisabled"
            placeholder="请输入内容"
            v-model="treeForm.currentTreename"
            clearable
            style="margin-bottom: 10px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="仓库描述" size="large" label-width="100px">
          <el-input
            placeholder="仓库描述"
            v-model="treeForm.groupingdescription"
            clearable
            :readonly="groupingdisabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人" size="large" label-width="100px">
          <el-input
            placeholder="联系人"
            v-model="treeForm.contactorList"
            clearable
            :readonly="groupingdisabled"
          ></el-input>
        </el-form-item>
        <el-form-item label="主管单位" size="large" label-width="100px">
          <el-input
            placeholder="主管单位"
            v-model="treeForm.groupName"
            clearable
            :readonly="groupingdisabled"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submittingbygroups">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹窗, 新增-->
    <departmentReportAddTable
      v-if="departmentReportAddTableVisible"
      ref="departmentReportAddTable"
      @refreshTableData="getDataList"
      @close="departmentReportAddTableVisible=false"
    ></departmentReportAddTable>
    <!-- 弹窗, 错误信息-->
    <departmentReportErrorData
      v-if="errorDataVisible"
      ref="departmentReportErrorData"
    ></departmentReportErrorData>
    <!-- 弹窗, 查看 / 修改 -->
    <departmentReportSeeOrUpdateTable
      v-if="addOrUpdateVisible"
      ref="departmentReportSeeOrUpdateTable"
      @refreshTableData="getDataList"
    ></departmentReportSeeOrUpdateTable>
    <!--树状，新增 -->
    <departmentReportAddTree
      v-if="departmentReportAddTreeVisible"
      ref="departmentReportAddTree"
      @refreshTreeData="getDataList"
      @close="departmentReportAddTreeVisible=false"
    ></departmentReportAddTree>
    <!--树状，修改 -->
    <departmentReportUpdateTree
      v-if="departmentReportUpdateTreeVisible"
      ref="departmentReportUpdateTree"
      @refreshTreeData="getDataList"
    ></departmentReportUpdateTree>

  </div>
</template>

<script>
// import {getRules} from '@/utils/rules'
import departmentReportTree from "./departmentReport-tree";
import departmentReportSeeOrUpdateTable from "./departmentReport-seeOrUpdateTable";
import departmentReportHeader from "./departmentReport-header";
import departmentReportTable from "./departmentReport-table";
import { treeDataTranslate } from "@/utils";
import departmentReportAddTree from "./departmentReport-addTree";
import departmentReportUpdateTree from "./departmentReport-updateTree";
import departmentReportAddTable from "./departmentReport-addTable";
import departmentReportErrorData from "./departmentReport-errorData";
import { setTimeout } from 'timers';
import Cookies from "js-cookie";
var token = document.cookie;
var httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  data() {
    return {
      checkedNodes:[],
      selectedNode:new Array(),
      Treeexpansion: false,
      //表单验证
      rules: {
        currentTreename: [
          { required: true, message: "请输入分组名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10个字", trigger: "blur" }
        ]
      },
      //当前树
      currentTreeProperty: {},
      //保存搜索框里的值
      search: "",
      //获取到的token
      documenttoken: `${httpaddress}/epi/epiRegister/xlsInputEpi?token=${this.$cookie.get('token')}`,
      fileList: [],
      filename: "",
      //上传文件的文件名
      uploadfilesname: "",
      //////////////////////////
      //修改||查看分组Form表单是否可用
      groupingdisabled: false,
      //修改分组或者查看分组
      dialogtitle: "",
      //修改||查看分组弹出框
      dialogVisible: false,
      ///////////////////
      //当前页数
      currPage: 1,
      //每页显示条目个数
      pageSize: 10,
      //总条目数
      totalCount: 0,
      /////////
      //分页初始值
      value3: [],
      treeForm: {
        // 分组名字
        currentTreename: "",
        //分组描述
        groupingdescription: "",
        contactorList:'',
        groupName:''
      },
      //错误信息弹窗
      errorDataVisible:false,
      //新增窗口
      departmentReportAddTableVisible: false,
      //新增/修改窗口
      addOrUpdateVisible: false,
      //修改分组
      departmentReportUpdateTreeVisible:false,
      //事件类型窗口
      departmentReportAddTreeVisible: false,
      dataForm: {},
      dataList: [],
      //树形
      modifiedUserList: [],
      modifiedUserProps: {
        children: "children",
        label: "name"
      },
      //表格内容
      platShareMenuForm: {
        age: 0,
        gmtCreate: 0,
        firstName: "",
        id: "",
        homeTel: "",
        mobile1: "",
        mobile2: "",
        name: "",
        officeTel: "",
        position: "",
        workUnit: "",
        isCommonlyUsed: "",
        isImportance: ""
      },
      //表格
      platShareMenuList: [],
      // 树形勾选框选中的id
      checkedIds: []
    };
  },
  components: {
    departmentReportHeader,
    departmentReportTable,
    departmentReportTree,
    departmentReportSeeOrUpdateTable,
    departmentReportAddTable,
    departmentReportAddTree,
    departmentReportUpdateTree,
    departmentReportErrorData

  },
  created() {
    this.getDataList();
  },
  methods: {

    // 一来就请求树形和列表
    getDataList() {
    
      // this.$http({
      //   url: this.$http.adornUrl("/resoure/resourearticlestorehouse/list"),
      //   method: "get",
      // }).then(({ data }) => {
      //   // var resoureArticleStorehouseId;
      //   console.log('resource',data);
      //   this.modifiedUserList = treeDataTranslate(data.articleStorehouseList, "id");
      //   console.log('this.modifiedUserList',this.modifiedUserList)
      //   // resoureArticleStorehouseId=this.modifiedUserList[0].id;

      //   //请求表格数据
      //   this.$http({
      //     url: this.$http.adornUrl("/resoure/resourearticle/list"),
      //     method: "get",
      //     params: this.$http.adornParams({
      //         // groupId: this.selectedNode,
      //         key:'',
      //         limit:this.pageSize ,
      //         page:1,
      //         // resoureArticleStorehouseId:this.modifiedUserList.length>0?'':resoureArticleStorehouseId
      //         resoureArticleStorehouseId:''
      //       })
      //   }).then(({ data }) => {
      //     console.log('getDataList',data)
      //     this.totalCount = data.resoureArticleList.totalCount;
      //     this.currPage = data.resoureArticleList.currPage;
      //     this.pageSize = data.resoureArticleList.pageSize;
      //     this.platShareMenuList = treeDataTranslate(data.resoureArticleList.list, "id");
      //     // console.log(this.platShareMenuList)

      //   });
      // });

      this.$http({
        url: this.$http.adornUrl("/event/eventShare/selectShareMenuPlatformByMenuId"),
        method: "POST",
        params: this.$http.adornParams({
          myPlatformId:this.$store.state.user.platformId,
          platformMenuId:395
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log('/event/eventShare/selectShareMenuPlatformByMenuId',data)
          data.list.forEach(item=>{
            this.modifiedUserList.push({name:item.platformName,id:item.linkagePlatformId})
          })
        } else {
          this.$message.error(dat.msg);
        }
      });

      this.$http({
        url: this.$http.adornUrl("/epi/epiRegister/departmentReportList"),
        method: "POST",
        params: this.$http.adornParams({
          humanType:'',
          concernType:'',
          search:'',
          startTime:'',
          endTime:'',
          platformId:this.$store.state.user.platformId,
          limit:10,
          page:1
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log('/epi/epiRegister/departmentReportList',data)
          this.platShareMenuList=data.data.records
          this.totalCount = data.data.total;
          this.currPage = data.data.current;
          this.pageSize = data.data.size;
        } else {
          this.$message.error(dat.msg);
        }
        
      });

      
    },
    //物资搜索
    searchcontacts(humanTypeValue,attentionValue,timeRange,state) {
      // console.log('this.currentTreeObject',this.currentTreeObject);
      // this.search = contactsearch;
      // this.currPage=1;
      // this.selectedNode=[];
      // var key;

      // this.$http({
      //   url: this.$http.adornUrl(`/resoure/resourearticle/list`),
      //   method: "get",
      //   params: this.$http.adornParams({
      //     // groupId: this.selectedNode,
      //     resoureArticleStorehouseId:this.currentTreeObject?this.currentTreeObject:'',
      //     // search: contactsearch,
      //     key: contactsearch,
      //     limit:this.pageSize ,
      //     page:this.currPage,
      //   })
      // }).then(({ data }) => {
      //   console.log(data.resoureArticleList.list);
      //   this.platShareMenuList = data.resoureArticleList.list;
      //   this.totalCount = data.resoureArticleList.totalCount;
      //   this.currPage = data.resoureArticleList.currPage;
      //   this.pageSize = data.resoureArticleList.pageSize;
      // });
      this.$http({
        url: this.$http.adornUrl("/epi/epiRegister/departmentReportList"),
        method: "POST",
        params: this.$http.adornParams({
          humanType:humanTypeValue,
          concernType:attentionValue,
          search:state,
          startTime:timeRange[0],
          endTime:timeRange[1],
          platformId:this.$store.state.user.platformId,
          limit:10,
          page:1
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          //  console.log('/epi/epiRegister/departmentReportList',data)
            this.platShareMenuList=data.data.records,
            this.totalCount = data.data.total;
            this.currPage = data.data.current;
            this.pageSize = data.data.size;
        } else {
          this.$message.error(dat.msg);
        }
      });
    },
    //分组拖拽排序
    modifythename(before, after, inner, event) {
      let treesubnode = [];
      // console.log("==============");
      // console.log(this.modifiedUserList);
      // console.log(before); // 移动的节点
      // console.log(after); // 移动到的父节点
      // console.log(inner);
      // console.log("==============");
      let prentId;
      if (inner == "inner") {
        prentId = after.data.id;
        //this.modifiedUserList
      } else {
        prentId = after.data.parentId;
      }
      // console.log(prentId);
      // console.log(this.modifiedUserList);
      let groupId = before.data.id;
      let ancestors;
      let parentId;
      let groupIds;
      let prent;
      if (prentId == 0) {
        ancestors = "0";
        parentId = 0;
        groupIds = new Array();
        this.modifiedUserList.forEach((item, index) => {
          groupIds.push(item.id);
        });
      } else {
        prent = findPrent(prentId, this.modifiedUserList);
        ancestors = prent.ancestors + "," + prent.id;
        parentId = prent.id;
        groupIds = new Array();
        prent.children.forEach((item, index) => {
          groupIds.push(item.id);
        });
      }
      // console.log(groupId);
      // console.log(ancestors);
      // console.log(parentId);
      // console.log(groupIds);
      var params = {
        id: groupId,
        ancestors: ancestors,
        parentId: parentId,
        groupIds: groupIds,
        children:before.data.children
      };
      this.$http({
        url: this.$http.adornUrl("/mail/mailgroup/order"),
        method: "POST",
        data: this.$http.adornData(params, false)
      }).then(({ data }) => {
        this.getDataList();
        // console.log(data);
        this.$message({
          message: "操作成功",
          type: "success",
          duration: 1500

        });
      });

      function findPrent(prentId, list) {
        for (let i = 0; i < list.length; i++) {
          var item = list[i];

          if (item.id == prentId) {
            // console.log(item.name);
            return item;
          }
          if (item.children != null) {
            let temp = findPrent(prentId, item.children);
            if (temp != null) {
              return temp;
            }
          }
        }
        return null;
      }
    },
    // 新增物资弹窗
    addNewTable(id) {
      this.departmentReportAddTableVisible = true;
      this.$nextTick(() => {
        this.$refs.departmentReportAddTable.init(id);
      });
    },

    // 查询列表物资弹窗 / 修改列表物资弹窗
    addOrUpdateHandle(id, staus,obj) {
      // this.addOrUpdateVisible = true;
      // if (staus == 0) {
      //   this.$nextTick(() => {
      //     this.$refs.departmentReportSeeOrUpdateTable.init(id, staus);
      //   });
      // } else if (staus == 1) {
      //   this.$nextTick(() => {
      //     this.$refs.departmentReportSeeOrUpdateTable.init(id, staus);
      //   });
      // }
      // console.log("addOrUpdateHandle",id, staus,obj)
      this.$router.push({path: '/hiddenDanger-add-or-update', query: { HiddenDangerId:id,item: obj } })
    },
    //每页显示条目个数改变时会触发
    sizeChangeHandle(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize=val;
      this.currPage=1;
      this.$http({
        url: this.$http.adornUrl("/resoure/resourearticle/list"),
        method: "GET",
        params: this.$http.adornParams(
          {
            limit:this.pageSize ,
            page:this.currPage,
            resoureArticleStorehouseId: this.selectedNode.toString(),
            search: this.search
          },
          false
        )
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.platShareMenuList = treeDataTranslate(data.resoureArticleList.list, "id");
        } else {
          this.$message.error(dat.msg);
        }
      });
    },
    //当前页数改变时会触发
    currentChangeHandle(val) {
      // console.log(`当前页: ${val}`);
      this.currPage=val;
      this.$http({
        url: this.$http.adornUrl("/resoure/resourearticle/list"),
        method: "get",
        params: this.$http.adornParams(
          {
            limit:this.pageSize ,
            page:this.currPage,
            resoureArticleStorehouseId: this.selectedNode,
            search: this.search
          },
          false
        )
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.platShareMenuList = treeDataTranslate(data.resoureArticleList.list, "id");
        } else {
          this.$message.error(dat.msg);
        }
      });
    },
    //点击树形节点事件
    handleNodeClick(obj) {
      var that=this
      function findChilden(obj,list){
        list.push(obj.id)
        let children = obj.children
        // console.log(list)
        if(children!=null){
          children.forEach((item, index) => {
            // console.log(item)
            findChilden(item,list)
          })
        }
      }
      //点击分组查看分组信息
      this.$http({
        url: this.$http.adornUrl(`/resoure/resourearticlestorehouse/info/${obj.id}`),
        method: "get",
        params: this.$http.adornParams(
          {
          },
          false
        )
      }).then(({ data }) => {
        // console.log('点击分组查看分组信息',data)
        if (data && data.code === 0) {
           this.treeForm.currentTreename = data.resoureArticleStorehouse.name;
            this.treeForm.groupingdescription = data.resoureArticleStorehouse.remark;
            this.treeForm.contactorList=''
            data.resoureArticleStorehouse.contactorList.forEach((item)=>{
              this.treeForm.contactorList+=`${item.name},电话:${item.mobile1}  `
            })
            this.treeForm.groupName=data.resoureArticleStorehouse.groupName
        } else {
          this.$message.error(dat.msg);
        }
       
      });

      // console.log("树形结点点击事件", obj);
      this.selectedNode=[]
      this.currentTreeObject = obj.id;

      this.search="";
      //分组描述



      this.currentTreeplatformId = obj.platformId;
      this.currentTreeparentId = obj.parentId;
      this.currentTreeancestors = obj.ancestors;

      findChilden(obj, this.selectedNode=[])

      // console.log("selectedNode:"+this.selectedNode);
      // console.log(this.currentTreeObject);
      // console.log(this.treeForm.currentTreename);
      // console.log('this.pageSize,this.selectedNodethis.pageSize,this.selectedNode',this.pageSize,this.selectedNode)
      //查询树形关联的物资
      this.$http({
        url: this.$http.adornUrl(`/resoure/resourearticle/list`),
        method: "get",
        params: this.$http.adornParams({
          limit:this.pageSize,
          page:1,
          'resoureArticleStorehouseId':this.selectedNode[0]
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
           this.totalCount = data.resoureArticleList.totalCount;
          this.currPage = data.resoureArticleList.currPage;
          this.pageSize = data.resoureArticleList.pageSize;
          this.platShareMenuList = data.resoureArticleList.list;
        } else {
          this.$message.error(dat.msg);
        }
       
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
      // console.log('this.currenttableArray',this.currenttableArray);
    },

    //删除||批量删除物资
    batchDelete(id) {

      if (!this.currentTreeObject) {
        var ids = {
          contactorIds: this.currenttableArray || [id],
          resoureArticleStorehouseId: null
        };
      } else {
        var ids = {
          contactorIds: this.currenttableArray || [id],
          resoureArticleStorehouseId: this.currentTreeObject
        };
        // console.log(ids);
      }
      this.$confirm(
        `确定对id为${this.currenttableArray || [id]}进行删除操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http({
            url: this.$http.adornUrl("/resoure/resourearticle/delete"),
            method: "post",
            data: this.$http.adornData({ids:this.currenttableArray}, false)
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
    // 上传文件之前的钩子
    beforeupload(file) {
      // console.log("上传文件之前的钩子", file);
    },
    // 文件上传时的钩子
    beforeUploadFile(event, file, fileList) {
      // console.log("文件上传时的钩子", event, file, fileList);
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
      }else if(file.response.errorData.length > 0){
        this.getDataList();
        this.errorDataVisible = true;
        this.$nextTick(() => {
          this.$refs.departmentReportErrorData.init(file.response.errorData); //
        });
      } else {
        this.$message.error({
          type: "error",
          message: `${file.response.msg}`
        });
      }
    },
    //导出模板
    downloadtemplate() {
      let httpaddress = window.SITE_CONFIG.baseUrl;
      let token = document.cookie;
      let exportEx = this.currentTreeObject;
      // console.log(
      //   `${httpaddress}//resoure/resourearticle/gettemplate?gId=${exportEx}&token=${Cookies.get('token')}`
      // );
      // window.open(httpaddress +'//mail/mailgroup/gettemplate?gId=' + exportEx + '&' + token)
      window.location.href= `${httpaddress}//epi/epiRegister/gettemplate?token=${Cookies.get('token')}`;
    },
    //树形复选框勾选ID
    setCheckedIds(checkedIds,checkedNodes) {
      this.checkedIds = checkedIds;
      // console.log('this.checkedIds',this.checkedIds);
      this.checkedNodes=checkedNodes


    },
    //导出数据
    exportExcel() {
      let httpaddress = window.SITE_CONFIG.baseUrl;
      const checkedIds = this.checkedIds;
      if (checkedIds.length < 1) {
        this.$message({
          message: "请选择一个分组进行导出",
          type: "warning"
        });
      } else {
        let token = document.cookie;
        window.location.href=`${httpaddress}//epi/epiRegister/output-excel?checkedIds=${checkedIds}&token=${Cookies.get('token')}`;
      }
    },
    //查看分组
    showTree() {
      this.dialogVisible = true;
      this.dialogtitle = "查看物资仓库";
      this.groupingdisabled = true;
    },
    //树状添加分组
    addTree() {
      this.departmentReportAddTreeVisible = true;
      this.$nextTick(() => {
        this.$refs.departmentReportAddTree.init(null, null, 2); //代表新增
      });
    },
    //修改分组名称
    updateTree(id) {
      // console.log(this.treeForm.currentTreename);
      // this.dialogVisible = true;
      // this.dialogtitle = "修改分组";
      // this.groupingdisabled = false;
      // console.log('rows',id)
      this.departmentReportUpdateTreeVisible = true;

      this.$nextTick(() => {
        this.$refs.departmentReportUpdateTree.init(id,null,3);
      });


    },
    // 分组修改提交
    submittingbygroups() {
      if (!this.treeForm.currentTreename) {
        this.$message.error("分组名称不能为空");
        return;
      } else {
        this.dialogVisible = false;
        this.$http({
          url: this.$http.adornUrl(`/mail/mailgroup/update`),
          method: "post",
          data: this.$http.adornData({
            id: this.currentTreeObject,
            name: this.treeForm.currentTreename,
            platformId: this.currentTreeplatformId,
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
          } else {
            this.$message.error(dat.msg);
          }
          
        });
      }
    },
    //树状删除分组
    deleteTree(ids) {
      var that=this
      this.$confirm(`确定对进行[删除]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        var checkedNames='';
        if(that.checkedNodes.length>0){
          that.checkedNodes.forEach(item=>{

            if(item.system===1){
              checkedNames+=item.name
            }

          })
        }

        setTimeout(()=>{
          if(checkedNames){
          that.$message({
            message: `${checkedNames}删除失败`,
            type: "error",
            duration: 1500
          });
          return 0;
        }
        that.$http({
          url: that.$http.adornUrl(
            `/resoure/resourearticlestorehouse/delete`
          ),
          method: "post",
          data: that.$http.adornData({
            ids:that.checkedIds
          },false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              that.$message({
                message: "操作成功",
                type: "success",
                duration: 1500
              });
              that.getDataList();
            } else {
              that.$message.error(data.msg);
            }
          });
        })

      });
    }
  }
};
</script>
<style lang="less" >
.wrap {
  .tableClass {
    padding: 3px;
    border: 1px solid rgba(230, 230, 230, 1);
    height: 652px;
    width: 82%;
    margin-left: 20px;
    min-width: 540px;
  }
  .el-table__fixed-right::before,
  .el-table__fixed::before {
    height: 0px;
  }
}

.wrap {
  .addressbookbox > .el-header {
    color: #333;
    /*text-align: center;*/
    line-height: 80px;
  }

  .addressbookbox > .el-aside {
    /*background-color: #D3DCE6;*/
    color: red;
    text-align: center;
    line-height: 20px;
  }

  .addressbookbox > .el-main {
    /*background-color: #E9EEF3;*/
    color: #333;
    text-align: center;
    line-height: 150px;
  }
}
.wrap {
  margin: -20px;
}

</style>
