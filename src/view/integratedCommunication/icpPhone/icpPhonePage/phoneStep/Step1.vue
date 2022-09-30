<template>
  <div class="my-radio-box">
      <div class="my-radio-box-main">
            <el-radio-group v-model="tabPosition">
                    <el-radio-button v-for="(item,index) in list" :label="index+1" :key="index">{{item.name}}</el-radio-button>
            </el-radio-group>
      </div>
      <div  class="my-phone-main" v-if="tabPosition==1">
                  <div class="my-tree-box">
                        <treeBtn  @changeDialog="closeDialog" @refreshData="refreshData" :treeDataItem="treeDataItem" :treeData="treeData" :formData="formData"></treeBtn>
                        <el-scrollbar class="my-tree-scroll">
                                 <el-tree :data="treeData"  v-loading="myLoading"  @node-click="handleNodeClick"  node-key="id" ref="tree" highlight-current :props="defaultProps"></el-tree>
                        </el-scrollbar>

                  </div>
                  <div class="my-table-box">

                       <btn-box :btnArry="btnArry" v-bind="{
                            add:{callback:addList},
                            edit:{callback:handleEdit},
                            del:{callback:handleDelete},
                            sort:{callback:handleSort},
                            download:{callback:handleExportContactor},
                            document:{callback:handleExportm}
                         }" :batchJoinIsShow="true">
                        </btn-box>
                      <el-row  class="my-table-box-search" style="margin:0 0 10px 8px;">
                          <el-col :span="14">
                               <el-input
                            placeholder="请输入姓名/单位/职位/号码"
                            class="searchInput"
                            v-model="searchText"
                          ></el-input>
                          </el-col>
                          <el-col :span="10">
                               <el-button type="primary"  @click="handleSearch">搜索</el-button>
                          </el-col>

                      </el-row>
                      <el-table ref="singleTable" :data="tableData" highlight-current-row
                            max-height="586px"
                            :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                            style="height: 614px;width:100%;" @row-dblclick="handleRowDbClick" @row-click="handleRowClick">
                             <el-table-column type="index" width="50" :resizable="false"></el-table-column>
                                    <el-table-column   show-overflow-tooltip
                                                    v-for="(item,key) in tableColumn" :key="key" :label="item.label" :prop="item.prop"
                                                    :width="item.width" :resizable="false"></el-table-column>
                              <el-table-column label="操作" width="175">
                                        <template slot-scope="scope" >
                                            <el-button type="primary" size="mini" @click="talkCall(scope.row)">拨号</el-button>
                                            <el-button type="primary" size="mini" @click="handSetToCommon(scope.row)">设为常用</el-button>
                                        </template>
                                </el-table-column>
                     </el-table>
                      <el-row>
                      <el-pagination class="pagination" background :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"
                                    :current-page="currentPage"
                                    @current-change="handCurrentChange"
                                    @size-change="handSizeChange"
                                    layout="total, prev, pager, next, sizes, jumper"></el-pagination>
                  </el-row>
                  </div>
        </div>

        <!--联系人弹窗-->
    <contact-details-popup ref="ContactDetailsPopup" @getContactorList="getContactorList"></contact-details-popup>
    <contact-sorting-popup ref="ContactSortingPopup" @getContactorList="getContactorList"></contact-sorting-popup>

  </div>
</template>

<script>
import mixin from '@/view/integratedCommunication/icpPhone/icpPhonePage/mixin.js';
import treeBtn from '@/components/phoneNew/treeBtn';
import btnBox from '@/components/phoneNew/btnBox';
import ContactDetailsPopup from "@/view/integratedCommunication/contactDetailsPopup";
import ContactSortingPopup from "@/view/integratedCommunication/contactSortingPopup";
import mixin2 from '@/view/yangZhouEventReports/assets/js/mixin/mixin.js';

  export default {
      mixins:[mixin, mixin2],
    components: {
        treeBtn,
        btnBox,
        ContactDetailsPopup,
        ContactSortingPopup
      },
    data() {
      return {
        searchText:'',
        rowData: [],//行表格数据
        btnArry:[{
          event:'add',
          icon:'el-icon-plus',
          title:'新增'
        },{
          event:'edit',
          icon:'el-icon-edit',
          title:'修改'
        },{
          event:'del',
          icon:'el-icon-delete',
          title:'删除'
        },{
          event:'document',
          icon:'el-icon-document',
          title:'模板'
        },{
          event:'download',
          icon:'el-icon-download',
          title:'导出'

        },{
          event:'sort',
          icon:'el-icon-sort',
          title:'排序'
        }],
        dialogVisible:true,
        formData:{
         pid:0,
         code:'phone',
         name:'政务联络网',
        },
        treeDataItem:{},
        currentPage: 1,//当前页数
        groupId: -1,//分组id
        defaultProps: {
          children: 'children',
          label: 'name',
          plusIcon: true,
        },
        myLoading:false,
        treeData: [],//电话分组
        list:[{//按钮切换
            name:'政务联络网',
            label:'1'
        },{
            name:'常用联系人',
            label:'2'
        },{
            name:'最近联系人',
            label:'3'
        },{
            name:'应急通讯录',
            label:'4'
        }],
        tableColumn: [
          {
            prop: "name",
            label: "姓名"
          }, {
            prop: "workUnit",
            label: "单位"
          }, {
            prop: "position",
            label: "职位"
          }, {
            prop: "mobile",
            label: "联系号码"
          }],//表头
        tabPosition: '1',
        tableData: [],//表格数据
        total: 0,//数据总数
        pageSize: 10,//总页数
      }
    },
    created(){
            this.getPhoneGroupingTree();
    },
    methods: {
        handleSearch(){//搜索
           this.getContactorList();
        },
        addList(){//新增

            this.$nextTick(() => {
                this.$refs.ContactDetailsPopup.isDialogVisible = true;
                this.$refs.ContactDetailsPopup.title = "新增联系人";
                this.$refs.ContactDetailsPopup.getTree();
           });
        },
        //修改方法
        handleEdit() {
          if (this.rowData == "" || this.rowData == null) {
            this.$message({
              message: "请选中表格中任意行或双击任意行进行修改!",
              type: "warning"
            });
            return;
          } else {
            this.handleRowDbClick(this.rowData);
          }
        },
         //删除方法
      handleDelete() {
        if (this.rowData == "" || this.rowData == null) {
          this.$message({
            message: "请选中表格中任意行进行删除!",
            type: "warning"
          });
          return;
        } else {
          let data = {
            data: {id: this.rowData.id},
            operate: 2,
          };
          this.$confirm('删除当前信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.updateConcator(data).then(res => {
              if (res.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error"
                });
                return;
              }
              this.$message({
                message: "删除成功!",
                type: "success"
              });
              this.getContactorList();
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除!'
            });
          });
        }
      },
       //排序方法
      handleSort() {
        this.$nextTick(()=>{
          this.$refs.ContactSortingPopup.isDialogVisible = true;
          this.$refs.ContactSortingPopup.getTree();
        });
      },
      //根据分组导出联系人
        handleExportContactor() {
          if (this.groupId == -1) {
            this.$message.warning("未分组联系人不能另存为excel文件");
            return;
          }
          if (this.groupId == null || this.groupId == "" ||
            this.groupId == undefined) {
            this.$message.warning("请先选择一个分组");
            return;
          }
          console.log(this.groupId);
          window.location.href = window.g.ApiUrl + "/eos/communication/contactor/export?groupId=" + this.groupId;
        },
        //表格行点击方法
        handleRowClick(row) {
          this.rowData = row;
        },
        handleRowDbClick(row){//双击修改

            this.$nextTick(() => {
              this.$refs.ContactDetailsPopup.isDialogVisible = true;
              this.$refs.ContactDetailsPopup.title = "修改联系人";
              this.$refs.ContactDetailsPopup.getTree();
              this.$refs.ContactDetailsPopup.showData(row);
            });
        },
        closeDialog(key){
            this.$emit('closeDialog',key);
        },
        handleNodeClick(data, node){
                 this.currentPage = 1;//跳转到第一页
                this.groupId = data.id;
                this.searchText = "";
                this.treeDataItem = {
                    groupId:data.id,
                    currentGroupName:data.name
                }
                this.getContactorList()
        },
         //改变页数查询
      handCurrentChange(val) {
        this.currentPage = val;
        this.getContactorList();
      },
          //改变每页条数查询
        handSizeChange(val) {
          this.currentPage = 1;//跳转到第一页
          this.pageSize = val;
          this.getContactorList();
        },
         //获取联系人数据
      getContactorList() {
        this.rowData = null;
        let data;
        console.log(this.groupId)
        data = {
            groupId: this.groupId,
            page: this.currentPage,
            size: this.pageSize,
            searchText: this.searchText,
          };
        // if (this.searchText == "") {
        //   data = {
        //     groupId: this.groupId,
        //     page: this.currentPage,
        //     size: this.pageSize,
        //     searchText: this.searchText,
        //   };
        // } else {
        //   data = {
        //     page: this.currentPage,
        //     size: this.pageSize,
        //     searchText: this.searchText,
        //   };
        // }
        this.$api.contactorList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.tableData = res.data.list||[];
          this.total = res.data.totalCount||0;
        })
      },
      refreshData(){
        this.treeDataItem = {};
        this.getPhoneGroupingTree();
      },
        //电话分组树
      getPhoneGroupingTree() {
        let data = {
          displayDefault: true //是否显示未分组联系人
        };
        this.myLoading = true;
        this.$api.telephoneGroupingTree(data).then(res => {
          this.myLoading = false;
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          this.treeData = res.data||[];
        }).catch(err=>{
             this.myLoading = false;
        })
      },
       handSetToCommon(row){
          let data = {contactorId:row.id};
          this.$api.usedContactor(data).then(res=>{
            if (res.errorcode!=0){
              this.$message.error(res.msg);
              return;
            }
            this.$message.success("已设为常用联系人!");
          });
      }
    }
  }
</script>

<style scoped>
.my-phone-main{
    box-sizing: border-box;
    height:calc(100vh- 138px);
    overflow: auto;
    display: flex;
}
.my-tree-box{
    background-color: #fff;
    border-top: 1px solid rgba(211, 215, 219, 1);
    border-right: 1px solid rgba(211, 215, 219, 1);
    width: 20.83333%;
    position: relative;
}

.my-tree-scroll{
    height: 100%;
    box-sizing: border-box;
    position: relative;
    padding-top:40px;
    z-index: 20;
}
.my-table-box{
    flex:1;
    margin:0 10px;
}
.el-tree--highlight-current>>>.el-tree-node.is-current>.el-tree-node__content {
    background-color: #C0C0C0;
  }
  .pagination {
    padding: 16px 0;
    text-align: center;
  }
</style>
