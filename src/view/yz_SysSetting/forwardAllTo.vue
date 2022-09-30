<template>
  <div>
    <!-- <el-row>
      <el-col :span="8">
        <el-button icon="el-icon-plus" class="shrink-button" @click='showDialog("新增")'>新增</el-button>
        <el-button icon="el-icon-delete" class="shrink-button" @click='showDialog("删除")'>删除</el-button>
      </el-col>
    </el-row> -->
    <div style="text-align: left">
           <el-button type="primary" @click='showDialog("新增")'>新增</el-button>
           <el-button type="primary" @click='showDialog("删除")'>删除</el-button>
    </div>
    <div>
      <el-table
        ref="singleTable"
        class="tableStyle"
        :data="tableData"
        :height="288"
        highlight-current-row
        @row-click="tableDataRow"
        @current-change="handleCurrentChange"
        style="width: 100%">
        <el-table-column min-width="100" v-for="(item,key) in tableColumn" :key="key" :label="item.label"
                         :prop="item.prop"
                         :width="item.width" :resizable="false"></el-table-column>
      </el-table>
      <el-pagination class="pagination" :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"
                     :current-page.sync="currentPage"
                     @current-change="getTableData"
                     layout="total, prev, pager, next, jumper"></el-pagination>
    </div>

    <!-- 选择人员弹窗 -->
    <selectMansDialog ref="selectDialog" selectTitle="选择联系人" 
                  :selectData="dialogVisible" @close='dialogVisible = false' 
                  @closeDialog="dialogVisible = false"
                  @addMans='addMans'>
   </selectMansDialog>
 <!-- <el-dialog title="联系人选择" width='50%' :visible.sync="dialogVisible" append-to-body>
    <div class="top">
      <el-input type="input"  placeholder="输入姓名/单位/职位/号码" v-model="searchText" class='selectInput'></el-input>
      <el-button type="primary" @click="query">查询</el-button>
      <el-button type="primary" @click="addMans">确定</el-button>
    </div>
    <div class="main">
      <div class="left">
        <el-scrollbar style="height: 100%">
         <el-tree class='presonTree' :data="data2" style="max-height: 500px" node-key="id" check-on-click-node @node-click="handleNodeClick" :props="defaultProps"></el-tree>
       </el-scrollbar>
     </div>
   
     <div class="right">
       <el-scrollbar style="height: 100%">
        <el-checkbox-group style="height: 450px" v-model="checkboxGroup">
            <el-checkbox class="checkbox" v-for="(item,index) in mans" :label="item.id" :key="item.id">
              <p><span>{{item.name}}</span><span>{{item.position}}</span></p>
              <p>{{item.mobile}}</p>
            </el-checkbox>
        </el-checkbox-group>
       </el-scrollbar>
       <div class="page">
           <el-pagination :small="pagingSize1" :page-size="pageSize1" :total="total1"
           @current-change="handleNodeClick(treeId)"
           :current-page.sync="currentPage1"
           layout="total, prev, pager, next, jumper"></el-pagination>
       </div>      
    </div>
   </div>
  </el-dialog> --> 
  </div>
</template>

<script>
  import selectMansDialog from "@/view/yz_eventManagement/eventReports/dialog/selectMansDialog"
  export default {
    name: "forwardAllTo",
    components:{
          selectMansDialog
       },
    data() {
      return {
        tableColumn: [
          {
            prop: "name",
            label: "联系人"
          }, {
            prop: "workUnit",
            label: "工作单位"
          }, {
            prop: "position",
            label: "职务"
          }, {
            prop: "mobile",
            label: "手机号码"
          }
        ],//表头名称
        tableData: [],//表格数据
        pageSize: 5,//每页显示条目个数
        total: 0,//总数
        currentPage: 1,
        dialogVisible:false,
        defaultProps: {
            children: 'children',
            label: 'name',
          },
        data2:[],
        searchText:'',
        treeId:'',
        checkboxGroup:[],
        mans:'',
        total1: 0,//数据总数
        pageSize1: 10,//每页条数
        currentPage1: 1,//当前页数
        pagingSize1: true,  //分页大小
        row:''
      }
    },
    methods: {
      handleCurrentChange() {

      },
      getTableData(){
          console.log(123);
          let data = {
                "data":{
                  "parameter":{
                    "type":"all",
                    "page":this.currentPage
                  },
                  "type":"select"
                }
            };
          this.$api.forward(data).then(res => {
            console.log(res)
            if (res.errorcode!=0){
              this.$message({
                message:res.msg,
                type:"error"
              });
              return
            }
            this.row = '';
            this.tableData = res.data.parameter;
            this.total = res.data.paging.size;
          })
      },
      // 请求人员
    handleNodeClick(num){
        let page = this.currentPage1;
        //当点击左侧tree列表时，重置page从0开始
        console.log(this.treeId.id,num.id)
        if(this.treeId && this.treeId.id != num.id){
              page = 1;
              this.currentPage1 = 1;
        }
        this.treeId = num;

        let id=num.id;
        let data={
           groupId:id,
           serchText:'',
           page:page,
           size:10
         };
        this.$api.contactorList(data).then((res) =>{
          console.log(res.data.data)
          this.total1 = res.data.totalCount;
          this.mans=res.data.list;
        })
    },
    //input框查找
    query(){
         this.currentPage1 = 1;
         let data = {
             searchText: this.searchText,
             page:  this.currentPage1,
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
     getPhoneTree(){
      // 渲染弹窗左侧列表
       let data={"data": {}};
       this.$api.telephoneGroupingTree(data).then((res) =>{
          console.log(res)
          this.data2=res.data
        })
     },
     tableDataRow(row){
        this.row = row;
     },
     addMans(checkboxGroup){
        console.log(checkboxGroup);
            let data = {
                "data":{
                  "parameter":{
                    "callingId":[-1],
                    "transferId":checkboxGroup
                  },
                  "type":"add"
                  }
              };
            console.log(data)
            this.$api.forward(data).then((res) =>{
              console.log(res)
              if (res.errorcode!=0){
                    this.$message({
                        message:res.msg,
                        type:"error",
                    });
                    return
                }else{
                   this.$message({
                      message: '新增成功',
                      type: 'success'
                    });
                   this.getTableData();
                   this.dialogVisible = false;
                }
                
            })
     },
     showDialog(button){
       if(button == '新增'){
          this.checkboxGroup  = [];
          this.$refs.selectDialog.defaultSelection([]);
          this.dialogVisible = true;
       }else if(button == '删除'){
           console.log(this.row);
           if(!this.row){
                 this.$message({
                  message: '请先单击选中要删除的行',
                  type: 'warning'
                });
                 return;
             }
             this.$confirm('确认删除', '删除提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let data = {
                    "data":{
                      "parameter":[this.row.id],
                      "type":"delete"
                      }
                };
            console.log(data);
            this.$api.forward(data).then((res) => {
              console.log(res)
              if(res.errorcode == 0){
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.row = '';
                this.getTableData();
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
     }
  },
  mounted(){
      this.getTableData();
      this.getPhoneTree();
 },
}
</script>

<style scoped>
  .shrink-button {
    border: none;
    color: #9DA4B3;
  }

  .shrink-button:hover {
    color: #656565;
    background-color: white;
  }

  .shrink-button:focus {
    color: #656565;
    background-color: white;
  }
  .top{
      text-align: center;
      margin-top: -20px;
    }
  .selectInput{
    width:50%;
    margin-right: 10px;
  }
  .main{
    width: 100%;
    display: flex;
    justify-content : space-between; 
    margin-top: 30px;
    
  }
  .left{
    width: 48%;
    
  }
  .right{
    width: 48%;
    
  }
  .presonTree{
    padding: 20px 0;
  }
  .page{
    position: absolute;
    right: 10px;
    bottom: 20px;
  } 
  .el-checkbox{
    width:150px;
  }
</style>
