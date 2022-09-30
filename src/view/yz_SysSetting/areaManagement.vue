  <template>
    <div>
      <div style="text-align: left">
        <el-button type="primary" @click='showDialog("新增管理区域")'>新增</el-button>
        <el-button type="primary" @click='showDialog("修改管理区域")'>修改</el-button>
        <el-button type="primary" @click='showDialog("删除管理区域")'>删除</el-button>
        <el-button type="primary" @click='showOrderListDialog()'>排序</el-button>
      </div>
      <div style="height: 500px;padding: 20px 0;">
        <el-scrollbar style="height: 100%">
          <el-row>
            <el-col :span="10">
             <el-input
               placeholder="输入关键字进行过滤"
               v-model="filterText"
              ></el-input>
              </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-tree :data="treedata" ref='tree' :props="defaultProps" node-key="id" :default-expanded-keys='treeKey'  highlight-current @node-click='nodeClick' :filter-node-method="filterNode"></el-tree>
            </el-col>
          </el-row>
        </el-scrollbar>
      </div>
      <!--  新增/修改弹框 -->
      <el-dialog
      :title='title'
      :visible.sync="dialogVisible"
      width="700px"
      append-to-body
      :close-on-click-modal="false"
      center>
      <div>
       <el-form :inline="true"  class="demo-form-inline" label-width="100px">
        <el-form-item label="名称：">
          <el-input v-model ="name" maxlength='20'></el-input>
        </el-form-item>
        <el-form-item label="上级：">
          <el-input v-model="upName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="属地负责人：">
          <el-button type="primary" @click='selectPerson'>选择</el-button>
          <el-button type="primary" @click='deletePerson'>删除</el-button>
        </el-form-item>
      </el-form>
      <el-table
      ref="singleTable"
      class="tableStyle"
      :data="tableData"
      highlight-current-row
      @row-click="rowClick"
      :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
      height='220'
      >
      <el-table-column  v-for="(item,key) in tableColumn" :key="key" :label="item.label"
      :prop="item.prop"
      :width="item.width" :resizable="false"></el-table-column>
    </el-table>
  </div>
  <span slot="footer" class="dialog-footer" v-if='title == "新增管理区域"'>
    <el-button @click="save('保存并新增')">保存并新增</el-button>
    <el-button type="primary" @click="save('保存并关闭')">保存并关闭</el-button>
    <el-button @click="dialogVisible = false">关闭</el-button>
  </span>
  <span slot="footer" class="dialog-footer" v-if='title == "修改管理区域"'>
    <el-button @click="dialogVisible = false">取消</el-button>
    <el-button type="primary" @click="save('保存修改')">保存</el-button>
  </span>
  </el-dialog>

  <!-- 选择人员弹窗 -->
  <selectMansDialog ref="selectDialog" selectTitle="选择联系人"
                  :selectData="outerVisible" @close='outerVisible = false'
                  @closeDialog="outerVisible = false"
                  @addMans='addMans'>
  </selectMansDialog>
  <!-- <el-dialog title="联系人选择" width='800px' :visible.sync="outerVisible" append-to-body :close-on-click-modal="false">
      <div class="top">
         <el-input type="input"  placeholder="输入姓名/单位/职位/号码" v-model="searchText" class='selectInput'></el-input>
         <el-button type="primary" @click="query(0)">查询</el-button>
         <el-button type="primary" @click="addMans">确定</el-button>
       </div>
       <div class="main">
         <div class="left">
           <el-scrollbar style="height: 100%">
            <el-tree :data="data2" style="max-height: 500px" node-key="id" check-on-click-node @node-click="handleNodeClick" :props="defaultProps"></el-tree>
          </el-scrollbar>
        </div>

         <div class="right">
          <el-scrollbar style="height: 100%">
           <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
               <div style="display: inline-block;width:150px;overflow: hidden;text-overflow:ellipsis;vertical-align:top;">姓名</div>
               <div style="display: inline-block;width:150px;overflow: hidden;text-overflow:ellipsis;vertical-align:top;">职称</div>
               <div style="display: inline-block;overflow: hidden;text-overflow:ellipsis;vertical-align:top;">联系电话</div>
           </el-checkbox>
           <el-checkbox-group  v-model="checkboxGroup">
               <el-checkbox class="checkbox" v-for="(item,index) in mans" :label="item.id" :key="item.id">
                 <p><span>{{item.name}}</span><span>{{item.position}}</span></p>
                 <p>{{item.mobile}}</p>
                   <div style="display: inline-block;width:150px;overflow: hidden;text-overflow:ellipsis;vertical-align:top;">{{item.name}}</div>
                   <div style="display: inline-block;width:150px;overflow: hidden;text-overflow:ellipsis;vertical-align:top;">{{item.position}}</div>
                   <div style="display: inline-block;overflow: hidden;text-overflow:ellipsis;vertical-align:top;">{{item.mobile}}</div>

               </el-checkbox>
           </el-checkbox-group>
          </el-scrollbar>
        </div>
        <div class="page">
              <el-pagination :small="pagingSize1" :page-size="pageSize1" :total="total1"
              @current-change="pageChange"
              :current-page.sync="currentPage1"
              layout="total, prev, pager, next, jumper"></el-pagination>
        </div>
      </div>
  </el-dialog> -->

      <!-- 排序弹窗 -->
      <orderListDialog ref="orderListDialog" dialogTitle="区域排序" type="area"
                        :visible="orderListVisible" :pid="pid" :treeData="orderListData"
                        @close='orderListVisible = false'
                        @closeDialog="orderListVisible = false"
                        @callBack="orderListDialogCallBack">
      </orderListDialog>
  </div>
  </template>

  <script>
    import selectMansDialog from "@/view/yz_eventManagement/eventReports/dialog/selectMansDialog"
    import orderListDialog from "@/view/yz_SysSetting/orderList"
    export default {
      name: "areaManagement",
      components:{
          selectMansDialog,
          orderListDialog
        },
      data() {
        return {
          defaultProps: {
            children: 'children',
            label: 'name',
          },
          treedata: [{
            name: '区域',
            id: 0,
            children: []
          }],
          breadList:['区域'],//获取当前树节点和其所有父级节点的lable
          nodeContent:{'id':0,'name':'区域'},//保存当前选择节点的内容,默认选中第一个
          treeKey:[0],
          title:'',
          dialogVisible:false,
          outerVisible:false,
          orderListVisible:false,
          pid: 0,
          orderListData:[],
          name:'',
          oldName:'',
          upName:'',
          labelPosition:'right',
          tableColumn:[
          {
            prop: "name",
            label: "姓名"
          }, {
            prop: "position",
            label: "职务"
          }, {
            prop: "workUnit",
            label: "工作单位"
          }, {
            prop: "mobile",
            label: "手机号码"
          }, {
            prop: "officeTel",
            label: "办公电话"
          }
          ],
          tableData:[],
          searchText:'',
          data2:[],
          treeId:'',
          checkboxGroup:[],
          mans:'',
          total1: 0,//数据总数
          pageSize1: 10,//每页条数
          currentPage1: 1,//当前页数
          pagingSize1: true,  //分页大小
          row:'',
          queryClick:false,//记录点击查询按钮后再点击分页
          checkAll: false,
          isIndeterminate: true,
          filterText: '',
        }
      },
      watch: {
            filterText(val) {
              this.$refs.tree.filter(val);
            }
          },
      methods: {
        //获取区域树
        getTreeData() {
          let data = {
            "data":{
              "parameter":null,
              "type":"select"
            }
          };
          this.$api.areaSetting(data).then(res => {
              console.log(res)
              if (res.errorcode!=0){
                this.$message({
                  message:res.msg,
                  type:"error"
                });
                return
              }
              let treeData = res.data;
              this.treedata[0].children = JSON.parse(JSON.stringify(treeData));
              this.$nextTick(function(){
                  this.treeKey = this.nodeContent.id === 0? [0]:[0,this.nodeContent.id];//设置默认展开
                  this.$refs.tree.setCurrentKey(this.nodeContent.id);  //调用setCurrentKey方法设置当前节点高亮
                  console.log(this.$refs.tree)
              })
          })
        },
        //筛选
        filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
          },
        showDialog(title){
         /*if(this.nodeContent == ''){
          this.$message({
            message: '请先选择要操作的事件',
            type: 'warning'
          });
          return;
        }*/
        this.title = title;
        if(title == '新增管理区域'){
          this.name = '';
          this.upName = this.breadList[0];
          this.tableData = [];
          this.checkboxGroup = [];
          this.dialogVisible = true;
        }else if(title == '修改管理区域'){
          if(this.nodeContent.name == '区域'){
               this.$message({
                message: '对此节点不可进行修改和删除操作',
                type: 'warning'
              });
          }else{
            this.name = this.breadList[0];
            this.upName = this.breadList[1];
            this.oldName = this.breadList[0];
            this.dialogVisible = true;
            let data = {
            "data":{
              "parameter":this.nodeContent.id,
              "type":"careaCassContactors"
            }
          };
          console.log(data);
          this.$api.areaSetting(data).then(res => {
              console.log(res)
              if (res.errorcode!=0){
                this.$message({
                  message:res.msg,
                  type:"error"
                });
                return
              }
               this.tableData = res.data;
               console.log(this.tableData);
               this.checkboxGroup = [];
               for(let i = 0; i < this.tableData.length; i++){
                 this.checkboxGroup.push(this.tableData[i].id);
               }
               console.log(this.checkboxGroup)
              })
          }
        }else if(title == '删除管理区域'){
         if(this.nodeContent.name == '区域'){
            this.$message({
                message: '对此节点不可进行修改和删除操作',
                type: 'warning'
              });
            return
         }
         this.$confirm('是否删除该管理区域', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
           "data":{
            "parameter":[this.nodeContent.id],
            "type":"delete"
          }
        }
        console.log(data);
        this.$api.areaSetting(data).then((res) => {
          console.log(res)
          if(res.errorcode == 0){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.breadList = ['区域'],//获取当前树节点和其所有父级节点的lable
            this.nodeContent = {'id':0,'name':'区域'},//保存当前选择节点的内容,默认选中第一个
            this.getTreeData();
          } else{
            this.$message.error(res.msg);
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
        showOrderListDialog(){
          if (this.nodeContent === undefined || this.nodeContent.id === undefined || this.nodeContent.id < 0){
            this.$message({
              type: 'info',
              message: '请先选择节点'
            });
          }
          this.pid = this.nodeContent.id;
          let data = {
            "pid":this.pid
          };
          this.$api.getAreaListByPid(data).then(res => {
            if (res.errorcode !== 0){
              this.$message({
                message: res.msg,
                type:"error"
              });
              this.orderListData = [];
              return;
            }
            if (res.data.length <= 0){
              this.$message({
                message: "所选区域没有下级区域，无需排序",
                type:"info"
              });
              this.orderListData = [];
              return;
            }
            this.orderListData = res.data;
            this.orderListVisible = true;
          });
        },

        orderListDialogCallBack(){
          //刷新数据
          this.orderListVisible = false;
          this.getTreeData();
        },

  nodeClick(e){ //树节点点击
    console.log(e)
    let tree = this.$refs.tree;
        this.breadList = []; //初始化
        this.nodeContent = e;
        if (!e.groups){
          this.getTreeNode(tree.getNode(e.id));
        }
      },
  getTreeNode(node){ //获取当前树节点和其所有父级节点
    if (node) {
      if (node.label !== undefined) {
                this.breadList.push(node.label); //在数组头部添加元素
                this.getTreeNode(node.parent); //递归
        }
      }
    },
  selectPerson(){
     this.outerVisible = true;
     console.log(this.checkboxGroup);
     this.$refs.selectDialog.defaultSelection(this.checkboxGroup);
     /*console.log(this.outerVisible)
     this.getPhoneTree();*/
  },
  getPhoneTree(){
      // 渲染弹窗左侧列表
       let data={"data": {}};
       this.$api.telephoneGroupingTree(data).then((res) =>{
          console.log(res)
          this.data2=res.data
        })
     },
     //换页
     pageChange(){
         if(!this.treeId){
           this.query(this.currentPage1-1);
         }else{
            let data={
               groupId:this.treeId.id,
               serchText:'',
               page:this.currentPage1-1,
               size:10
             };

            this.$api.contactorList(data).then((res) =>{
              console.log(res.data.data)
              this.total1 = res.data.totalCount;
              this.mans=res.data.list;
            })
         }

     },
    // 请求人员
    handleNodeClick(num){
         /*console.log(num)
        let page = this.currentPage1-1;
        //当点击左侧tree列表时，重置page从0开始
        console.log(this.treeId.id,num.id)
        if(this.treeId && this.treeId.id != num.id){
              page = 0;
              this.currentPage1 = 1;
        }*/
        this.treeId = num;
        this.currentPage1 = 1;
        let data={
           groupId:num.id,
           serchText:'',
           page:0,
           size:10
         };

        this.$api.contactorList(data).then((res) =>{
          console.log(res.data.data)
          this.total1 = res.data.totalCount;
          this.mans=res.data.list;
        })
    },
    //input框查找
    query(page){
         if(page === 0){
           this.currentPage1 = 1;
         }
         this.treeId = '';
         let data = {
             searchText: this.searchText,
             page:  page,
             size: this.pageSize1
         };
         console.log(data)
         this.$api.contactorList(data).then(res => {
             console.log(res)
             if (res.errorcode != 0) {
                 this.$message({
                     message: res.msg,
                     type: "error"
                 });

             }
             this.mans = res.data.list;
             this.total1=res.data.totalCount;
         })
     },
     //添加区域管理负者人
     addMans(checkboxGroup){
        console.log(checkboxGroup);
        let data={"data":checkboxGroup};
        console.log(data)
        // let that = this;
        this.$api.appContactors(data).then((res) =>{
          console.log(res)
          if (res.errorcode!=0){
                this.$message({
                    message:res.msg,
                    type:"error",
                });
                return
            }
            this.tableData = res.data;
            console.log(this.tableData);
            this.outerVisible = false;
            this.checkboxGroup = checkboxGroup;
        })
     },
     //点击某行负责人
     rowClick(row){
        this.row = row;
        console.log(row)
     },
     deletePerson(){
        if(!this.row){
            this.$message({
              message: '请先选中要移除的负者人',
              type: 'warning'
            });
         }else{
            console.log(this.row);
            for(let i = 0; i < this.tableData.length; i++){
              if(this.row == this.tableData[i]){
                 this.tableData.splice(i,1);
                 break;
              }
            }
            for(let i = 0; i < this.checkboxGroup.length; i++){
               if(this.checkboxGroup[i] == this.row.id){
                 this.checkboxGroup.splice(i,1);
                 console.log(this.checkboxGroup);
                 break;
              }
            }
            this.row = '';
         }
     },
     save(button){
        console.log(this.name,this.upName,this.tableData);
           this.name = this.trim(this.name);
           if(this.name == ''){
             this.$message.error('名称不能为空');
           }else{
                 let mansIdList = [];
                   for(let i = 0; i < this.tableData.length; i++){
                      mansIdList.push(this.tableData[i].id);
                   }
                /* 修改事件类型 */
                if(button == '保存修改'){
                   let data = {"data":{
                                "parameter":{
                                  "id":this.nodeContent.id,
                                  "name":this.name,
                                  "oldName":this.oldName,
                                  "contactorId":mansIdList
                                },
                                "type":"update"
                                }
                            };
                  console.log(data)
                  this.$api.areaSetting(data).then(res => {
                      console.log(res)
                      if (res.errorcode !=0){
                        this.$message({
                          message:res.msg,
                          type:"error"
                        });
                      }else{
                        this.$message({
                          message: '修改成功',
                          type: 'success'
                        });
                        this.breadList[0] = this.name;
                        this.dialogVisible = false;
                        this.getTreeData();
                      }

                  })
                }
                /* 保存事件类型 */
                else{
                  let data = {"data":{
                                "parameter":{
                                  "pid":this.nodeContent.id,
                                  "name":this.name,
                                  "contactorId":mansIdList
                                },
                                "type":"add"
                                }
                            };
                console.log(data)
                this.$api.areaSetting(data).then(res => {
                    console.log(res)
                    if (res.errorcode !=0){
                      this.$message({
                        message:res.msg,
                        type:"error"
                      });
                    }else{
                      this.$message({
                        type: 'success',
                        message: '保存成功!'
                      });
                      if(button == '保存并关闭'){
                         this.dialogVisible = false;
                      }else if(button == '保存并新增'){
                          this.name = '';
                          this.upName = this.breadList[0];
                          this.tableData = [];
                          this.checkboxGroup = [];
                      }
                      this.getTreeData();

                    }

                })
              }

           }
     },
     trim(str){
        return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
     }
  },
  mounted(){
        this.getTreeData();
   },
}
</script>

 <style scoped>
  .tree {
    height: 676px;
    background-color: white;
    border: 1px solid rgba(211, 215, 219, 1);
  }

  >>> .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  >>> .el-tree-node__content {
    margin-top: 14px;
  }

  /*>>>.el-tree-node>.el-tree-node__children{*/
    /*overflow: visible !important;*/
    /*}*/
    >>> .treeDiv {
      width: 100%;
    }

    >>> .leftTree {
      display: inline-block;
      width: 70%;
      text-align: left;
    }

    >>> .rightTree {
      display: inline-block;
      width: 30%;
    }
    /* .top{
      text-align: center;
      margin-top: -20px;
    } */
    .selectInput{
      width:77%;
      margin-right: 15px;
    }
    .main{
      width: 100%;
      height: 570px;
      display: flex;
      justify-content : space-between;
      margin-top: 30px;

    }
    .left{
      width: 33%;
      height: 540px;
      border: 1px solid rgba(211, 215, 219, 1);
    }
    .right{
      width: 65%;
      height: 540px;
      border: 1px solid rgba(211, 215, 219, 1);
    }
    .page{
      position: absolute;
      right: 15px;
      bottom: 20px;
    }
    .el-checkbox{
      width:80%;
      margin: 15px;
    }
</style>
