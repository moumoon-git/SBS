<template>
  <div class="playView">
    <el-header
      style="height: 80px;padding: 24px 16px; clear: both;border:1px solid rgba(219, 219, 219, 1);border-radius:3px;"
      class="left"
    >
      <!-- <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
          <el-button v-if="isAuth('resoure:resoureteam:save')" type="primary" @click="addNewResoureteam()">新增</el-button>
          <el-button v-if="isAuth('resoure:resoureteam:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
          <el-upload

            :with-credentials="true"
            :on-progress="beforeUploadFile"
            :show-file-list="false"
            :on-error="handleError"
            :data="{
              file: filename,
              url: 'http://localhost:8200/108ee3f1-9df4-4998-9112-17ee0b9f08db'
            }"
            :on-success="handleAvatarSuccess"
            :action="documenttoken"
            style="display: inline-flex; margin: 0 10px;"
          >
            <el-tooltip placement="top"  effect="light">
              <div slot="content">请填写我们提供<br/>的模板进行导入</div>
              <el-button
                v-loading.fullscreen.lock="fullscreenLoading"
                element-loading-text="正在导入通讯录，可能需要几分钟时间，请耐心等待.."
                icon="el-icon-upload"
                type="success"
                v-if="isAuth('mail:mailgroup:xlsInput')"
              >导入
              </el-button>
            </el-tooltip>

          </el-upload>
          <el-button
            icon="el-icon-download "
            type="success"
            @click="downloadtemplate()"
            >导出模板</el-button
          >
          <el-dropdown style="margin-left: 10px;">
          <el-button
            v-if="isAuth('mail:mailgroup:xlsOutput')"
            type="success"
            icon="el-icon-printer"
            >导出数据</el-button>
          <el-dropdown-menu slot="dropdown" split-button="true">
            <el-dropdown-item @click.native="exportExcel()">导出已选择数据</el-dropdown-item>
            <el-dropdown-item @click.native="exportExcelAll()">导出所有数据</el-dropdown-item>
          </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form> -->
      <resoureteamheader
        @downloadtemplate="downloadtemplate"
        @addNewResoureteam="addNewResoureteam"
        :uploadfilesname="uploadfilesname"
        :beforeUploadFile="beforeUploadFile"
        :filename="filename"
        @exportExcel="exportExcel"
        @batchDelete="batchDelete"
        @handleAvatarSuccess="handleAvatarSuccess"
        :documenttoken="documenttoken"
        :fileList="fileList"
        @searchcontacts="searchcontacts"
        :modifiedUserList="modifiedUserList"
      >
      </resoureteamheader>
    </el-header>
    
    <div style="height:8px;width:100%;background: rgb(240, 243, 244);"></div>

    <div style="width:100%;display: flex;padding:32px 16px 0px 16px">
      <div style="width:15%;min-width:320px;">
        <resoureteamtree
          :list="modifiedUserList"
          :listProps="modifiedUserProps"
          @handleNodeClick="handleNodeClick"
          @showTree="showEventType"
          @addTree="addEventType"
          @updateTree="updateEventType"
          @deleteTree="deleteEventType"
          @setCheckedIds="setCheckedIds"
        >
        </resoureteamtree>
      </div>
      <div class="tableClass">
        <div style="width:42vw;height:630px;max-height:630px;">
          <resoureteamtable
            :dataList="platShareMenuList"
            @addOrUpdateHandle="addOrUpdateHandle"
            @handleSelectionChange="handleSelectionChange"
            @batchDelete="batchDelete"
          >
          </resoureteamtable>
        </div>
      </div>
      <div class="screenshot">
            <resoureteamTreeCrud
            ref="resoureteamTreeCrud"
            @invitedToJoin="invitedToJoin"
            @close="resoureteamTreeCrudVisible=false"
            :selectInvitedToJoinList="selectInvitedToJoinList"
            :reportParams="reportParams"
            ></resoureteamTreeCrud>
      </div>
      
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" @close="addOrUpdateVisible=false"></add-or-update>
    <!--树状，新增 -->

    <!-- 树状, 查看，修改-->
    <el-dialog :title="dialogtitle" :visible.sync="dialogVisible" width="40%">
      <el-form  :modal="treeForm" ref="treeForm">
        <el-form-item label="队伍类型名称" size="large" label-width="100px">
          <el-input
            :readonly="groupingdisabled"
            placeholder="请输入内容"
            v-model="treeForm.currentTreename"
            clearable
            style="margin-bottom: 10px"
          >
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="分组描述" size="large" label-width="100px">
          <el-input
            placeholder="分组描述"
            v-model="treeForm.groupingdescription"
            clearable
            :readonly="groupingdisabled"
          ></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="!groupingdisabled">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submittingbygroups">确 定</el-button>
      </span>
    </el-dialog>

    <!--新增联系人-->
    <el-dialog title="新增联系人" class="" :visible.sync="invitedToJoinVisible" style="overflow: auto;
  zoom: 1;">

        <el-table :data="invitedToJoinList"  @selection-change="invitedToJoinSelectionChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column property="name" label="姓名" ></el-table-column>
        <el-table-column property="mobile1" label="手机" ></el-table-column>
        <el-table-column property="email" label="邮箱"></el-table-column>
      </el-table>
      <div style="margin-left:70%;margin-top:20px;">
        <el-button type="primary" @click="sendInvitedMessage()">确定</el-button>
        <el-button @click="invitedToJoinVisible=false">取消</el-button>
      </div>



    </el-dialog>
  
  </div>
</template>

<script>
  import resoureteamtree from "./resoureteam-tree";
  import resoureteamheader from "./resoureteam-header";
  import AddOrUpdate from './resoureteam-add-or-update';
  import resoureteamtable from "./resoureteam-table";
  import resoureteamTreeCrud from "./resoureteam-tree-crud";
  import { treeDataTranslate } from "@/utils";
  var token = document.cookie;
  var httpaddress = window.SITE_CONFIG.baseUrl;
  export default {
    created(){
         this.$http({
          url: this.$http.adornUrl(`/risk/riskcamera/list`),
          method: 'get',
          // params: this.$http.adornParams({
          //   search: queryString
          // })
        }).then(({ data }) => {
           if (data && data.code === 0) {
            // console.log(data.data)
          } else {
            this.$message.error(data.msg);
          }
        })
    },
    data () {
      return {
        selectedNode:[],
        fileList: [],
        //获取到的token
        documenttoken: `${httpaddress}/resoure/resoureteam/xlsInput?token=${this.$cookie.get('token')}`,
        filename: "",
        //上传文件的文件名
        uploadfilesname: "",
        // 树形勾选框选中的id
        checkedIds: [],
        dialogVisible:false,
        dialogtitle:'',
        groupingdisabled:false,
        treeForm: {
          id:'',
          parentId:'',
          ancestors:'',
          // 分组名字
          currentTreename: "",
          //分组描述
          groupingdescription: ""
        },
        //表格
        platShareMenuList: [],
        dataForm: {
          key: ''
        },
        //树形
        modifiedUserList: [],
        modifiedUserProps: {
          children: "children",
          label: "townName"
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        //队伍类型Visible
        resoureteamTreeCrudVisible: false,
        invitedToJoinList: [],
      invitedToJoinVisible: false,
      selectInvitedToJoinList:[],
      reportParams:''
      }
    },
    components: {
      AddOrUpdate,
      resoureteamtable,
      resoureteamtree,
      resoureteamTreeCrud,
      resoureteamheader
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 新增队伍弹窗
      addNewResoureteam(id) {
        this.addOrUpdateVisible = true;
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id);
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
        this.reportParams = obj
        // console.log(this.reportParams)
        // function findChilden(obj,list){
        //   list.push(obj.id)
        //   let children = obj.children
        //   console.log(list)
        //   if(children!=null){
        //     children.forEach((item, index) => {
        //       console.log(item)
        //       findChilden(item,list)
        //     })
        //   }
        // }

        // console.log("树形结点点击事件", obj);
        // this.selectedNode=[]
        // this.currentTreeObject = obj.id;
        // this.treeForm.currentTreename = obj.name;
        // this.search="";
        // //分组描述
        // this.treeForm.groupingdescription = obj.remark;
        // this.treeForm.id=obj.id
        // this.treeForm.ancestors=obj.ancestors
        // this.treeForm.parentId=obj.parentId
        // this.treeForm.name=obj.name
        // this.currentTreeplatformId = obj.platformId;
        // this.currentTreeparentId = obj.parentId;
        // this.currentTreeancestors = obj.ancestors;

        // findChilden(obj, this.selectedNode=[])

        // console.log("selectedNode:"+this.selectedNode);
        // console.log(this.currentTreeObject);
        // console.log(this.treeForm.currentTreename);
        // //查询树形关联的联系人
        // this.$http({
        //   url: this.$http.adornUrl(`/resoure/resoureteam/list`),
        //   method: "POST",
        //   data: this.$http.adornData({
        //     limit:this.pageSize ,
        //     page:1,
        //     teamTypeIds: this.selectedNode,
        //   })
        // }).then(({ data }) => {
        //   console.log(data);



        //   this.totalCount = data.page.totalCount;
        //   this.currPage = data.page.currPage;
        //   this.pageSize = data.page.pageSize;
        //   this.platShareMenuList = data.page.list;
        // });
      },
      //查看分组
      showEventType() {
        this.dialogVisible = true;
        this.dialogtitle = "查看队伍类型";
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
        this.dialogtitle = "修改队伍类型";
        this.groupingdisabled = false;
        
      },
      // //分组拖拽排序
      // modifythename(before, after, inner, event) {
      //   let treesubnode = [];
      //   console.log("==============");
      //   console.log(this.modifiedUserList);
      //   console.log(before); // 移动的节点
      //   console.log(after); // 移动到的父节点
      //   console.log(inner);
      //   console.log("==============");
      //   let prentId;
      //   if (inner == "inner") {
      //     prentId = after.data.id;
      //     //this.modifiedUserList
      //   } else {
      //     prentId = after.data.parentId;
      //   }
      //   console.log(prentId);
      //   console.log(this.modifiedUserList);
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
      //   console.log(groupId);
      //   console.log(ancestors);
      //   console.log(parentId);
      //   console.log(groupIds);
      //   var params = {
      //     id: groupId,
      //     ancestors: ancestors,
      //     parentId: parentId,
      //     groupIds: groupIds,
      //     children:before.data.children
      //   };
      //   this.$http({
      //     url: this.$http.adornUrl("/resoure/resoureteamtype/order"),
      //     method: "POST",
      //     data: this.$http.adornData(params, false)
      //   }).then(({ data }) => {
      //     this.getDataList();
      //     console.log(data);
      //     this.$message({
      //       message: "操作成功",
      //       type: "success",
      //       duration: 1500

      //     });
      //   });

      //   function findPrent(prentId, list) {
      //     for (let i = 0; i < list.length; i++) {
      //       var item = list[i];

      //       if (item.id == prentId) {
      //         console.log(item.name);
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
      //删除分组
      deleteEventType(ids) {
        var that=this
        // console.log('删除前that.checkedIds',that.checkedIds)
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
              `/resoure/resoureteamtype/delete`
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
      },
      //树形复选框勾选ID
      setCheckedIds(checkedIds,checkedNodes) {
        // console.log('勾选的checkedIds,checkedNodes',checkedIds,checkedNodes)
        this.checkedIds = checkedIds;
        // console.log('this.checkedIds',this.checkedIds);
        this.checkedNodes=checkedNodes
      },
      // 获取数据列表
      getDataList () {
        // this.dataListLoading = true
        // this.$http({
        //   url: this.$http.adornUrl('/resoure/resoureteamtype/tree'), //resoure/resoureteam/list
        //   method: 'get',
        //   params: this.$http.adornParams({
        //     'page': this.pageIndex,
        //     'limit': this.pageSize,
        //     'key': this.dataForm.key
        //   })
        // }).then(({data}) => {
        //   if (data && data.code === 0) {
        //     this.dataList = data.page.list
        //     this.totalPage = data.page.totalCount
        //     this.platShareMenuList = treeDataTranslate(data.data.list, "id");
        //   } else {
        //     this.dataList = []
        //     this.totalPage = 0
        //   }
        //   this.dataListLoading = false
        // })
        this.dataListLoading = true;
        // this.$http({
        //   url: this.$http.adornUrl("/resoure/resoureteamtype/tree"),
        //   method: "get",
        // }).then(({ data }) => {
        //   console.log(data);
        //   this.modifiedUserList = treeDataTranslate(data.tree, "id");
        //   console.log(this.modifiedUserList)
        //   //请求表格数据
        //   // this.$http({
        //   //   url: this.$http.adornUrl("/resoure/resoureteam/list"),
        //   //   method: "POST",
        //   //   data: this.$http.adornData({
        //   //       teamTypeIds: this.selectedNode,
        //   //       limit:this.pageSize ,
        //   //       page:1,
        //   //     })
        //   // }).then(({ data }) => {
        //   //   console.log('getDataList',data)
        //   //   this.totalCount = data.page.totalCount;
        //   //   this.currPage = data.page.currPage;
        //   //   this.pageSize = data.page.pageSize;
        //   //   this.platShareMenuList = treeDataTranslate(data.page.list, "id");
        //   //   console.log('this.platShareMenuList',this.platShareMenuList)
        //   // });
        // });

        this.$http({
          url: this.$http.adornUrl("/sys/systown/treeList"),
          method: "get",
        }).then(({ data }) => {
          var townData = data.list
          for(let i = 0;i<data.list[0].children.length;i++){
            this.$http({
              url: this.$http.adornUrl("/event/eventShare/selectShareMenuByTownId"),
              method: "POST",
              params: this.$http.adornParams({
                townId:data.list[0].children[i].id,
                myPlatformId:this.$store.state.user.platformId,
                platformMenuId:126,
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                
                that.getDataList();
              } else {
                that.$message.error(data.msg);
              }
              

              })
              // this.totalCount = data.page.totalCount;
              // this.currPage = data.page.currPage;
              // this.pageSize = data.page.pageSize;
              // this.platShareMenuList = treeDataTranslate(data.page.list, "id");
              // console.log('this.platShareMenuList--------',data)
            townData[0].children[i].parentName = townData[0].townName
            // console.log("dsaaaaaa---------------",data.list[0].children[i])
          }
            // console.log("dsaaaaaa---------------",townData)
            setTimeout(() => {
              this.modifiedUserList = treeDataTranslate(townData, "id");
              // console.log("this.modifiedUserList",this.modifiedUserList)
            },1500);
          
          // this.townName = ,
          // this.townId = ,
          // console.log("modifiedUserList--------------",this.modifiedUserList)
          //请求表格数据
          // this.$http({
          //   url: this.$http.adornUrl(`/event/eventShare/selectShareMenuByTownId`),
          //   method: 'post',
          //   params: this.$http.adornParams({
          //     townId:1,
          //     myPlatformId:27,
          //     platformMenuId:126,
          //   })
          // })
          // .then(({ data }) => {
          //   console.log(data)

          // })
          // this.$http({
          //   url: this.$http.adornUrl("/event/eventShare/selectShareMenuByTownId"),
          //   method: "POST",
          //   params: this.$http.adornParams({
          //     townId:1,
          //     myPlatformId:27,
          //     platformMenuId:126,
          //   })
          // }).then(({ data }) => {
          //   console.log('getDataList',data)
          //   this.totalCount = data.page.totalCount;
          //   this.currPage = data.page.currPage;
          //   this.pageSize = data.page.pageSize;
          //   this.platShareMenuList = treeDataTranslate(data.page.list, "id");
          //   console.log('this.platShareMenuList',this.platShareMenuList)
          // });
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
            url: this.$http.adornUrl(`/resoure/resoureteamtype/update`),
            method: "post",
            data: this.$http.adornData({
              'id': this.treeForm.id,
              'parentId': this.treeForm.parentId,
              'name': this.treeForm.currentTreename,
              'ancestors':this.treeForm.ancestors
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
                that.$message.error(data.msg);
              }
            
          });
        }
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id,status) {
        
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          if(status==='watch'){
            this.$refs.addOrUpdate.init(id,status)
          } else {
            this.$refs.addOrUpdate.init(id)
          }
          
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/resoure/resoureteam/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      //导出模板
      downloadtemplate() {
        let httpaddress = window.SITE_CONFIG.baseUrl;
        let token = document.cookie;
        let exportEx = this.currentTreeObject;
        // console.log(
        //   `${httpaddress}//resoure/resoureteam/gettemplate?gId=${exportEx}&token=${this.$cookie.get('token')}`
        // );
        // window.open(httpaddress +'//mail/mailgroup/gettemplate?gId=' + exportEx + '&' + token)
        window.location.href= `${httpaddress}//resoure/resoureteam/gettemplate?gId=${exportEx}&token=${this.$cookie.get('token')}`;
      },
      // 文件上传时的钩子
      beforeUploadFile(event, file, fileList) {
        // console.log("文件上传时的钩子", event, file, fileList);
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
          window.location.href=`${httpaddress}//resoure/resoureteam/xlsOutput?checkedIds=${checkedIds}&token=${this.$cookie.get('token')}`;
        }
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
          `确定对id为${this.currenttableArray || [id]}进行删除操作?删除该联系人将会删除所有部门下的该联系人，确定吗？`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.$http({
              url: this.$http.adornUrl("/resoure/resoureteam/delete"),
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
        }else if(file.response.errorData.length > 0){
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
        this.currPage=1;
        this.selectedNode=[];
        this.$http({
          url: this.$http.adornUrl(`/resoure/resoureteam/list`),
          method: "POST",
          data: this.$http.adornParams({
            teamTypeIds: this.selectedNode,
            search: contactsearch,
            limit:this.pageSize ,
            page:this.currPage,
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
              this.platShareMenuList = data.page.list;
              this.totalCount = data.page.totalCount;
              this.currPage = data.page.currPage;
              this.pageSize = data.page.pageSize;
          } else {
            this.$message.error(data.msg)
          }
        });
      },
      // 添加联系人
    invitedToJoin (boolean) {
      var that = this
      this.invitedToJoinVisible = boolean
      this.$http({
        url: this.$http.adornUrl('/mail/mailcontactor/listByPlatformId'),
        method: 'GET',
        param: this.$http.adornParams()
      }).then((res) => {
         if (res && res.code === 0) {
              that.invitedToJoinList = []
              // console.log('invitedToJoin', res)
              // console.log('invitedToJoin', res.data.data)
              res.data.data.forEach((item) => {
                // if (!item.openId) {
                  that.invitedToJoinList.push(item)
                  // console.log(that.invitedToJoinList)
                // }
              })
          } else {
            this.$message.error(res.msg)
          }
        
      })
    },
      // 邀请加入被勾选的表格
    invitedToJoinSelectionChange (val) {
      this.selectInvitedToJoinList = []
      // console.log('invitedToJoinSelectionChange', val)
      for (var i = 0; i < val.length; i++) {
        this.selectInvitedToJoinList.push(val[i].name)
        this.selectInvitedToJoinList.push(val[i].openId)
      }
      // console.log('this.selectInvitedToJoinList', this.selectInvitedToJoinList)
      // console.log(this.currenttableArray);
    },
    sendInvitedMessage(){
      this.invitedToJoinVisible=false
    }
    }
  }
</script>
<style lang="less">
.resoureteamWrap{
  margin: -20px;
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
}
</style>
