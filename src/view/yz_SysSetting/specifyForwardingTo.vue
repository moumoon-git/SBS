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
        @current-change="handleCurrentChange"
        @row-click="tableDataRow"
        style="width: 100%">
        <el-table-column min-width="100" v-for="(item,key) in tableColumn" :key="key" :label="item.label"
                         :prop="item.prop"
                         :width="item.width" :resizable="false"></el-table-column>
      </el-table>
      <el-pagination class="pagination" :page-size="pageSize"  :total="total"
                     :current-page.sync="currentPage"
                     @current-change="getTableData()"
                     layout="total, prev, pager, next,  jumper"></el-pagination>
    </div>

    <!--  新增弹框 -->
    <el-dialog
      title='短信转发'
      :visible.sync="dialogVisible"
      width="700px"
      append-to-body
      :close-on-click-modal="false"
      center>
      <div>
       <el-form   class="demo-form-inline" label-width="100px">
        <el-form-item label="">
          <el-button type="primary" @click='selectPerson("选择来信人")'>选择来信人</el-button>
        </el-form-item>
        <el-form-item label="来信人姓名：" style="display: inline-block;">
          <el-input  v-model="name"   :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="来信人号码：" style="display: inline-block;">
          <el-input  v-model="phoneNumber" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click='selectPerson("选择转至人")'>选择转至人</el-button>
          <el-button type="primary" @click='deletePerson'>删除转至人</el-button>
        </el-form-item>
      </el-form>
      <el-table
         ref="singleTable"
         class="tableStyle"
         :data="tableDataPerson"
         highlight-current-row
         @row-click="rowClick"
         :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
         height='240'
         >
         <el-table-column  v-for="(item,key) in tableTitlePerson" :key="key" :label="item.label"
         :prop="item.prop"
         :width="item.width" :resizable="false"></el-table-column>
       </el-table>
   </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </span>
  </el-dialog>

  <!-- 选择人员弹窗 -->
  <selectMansDialog ref="selectDialog" selectTitle="选择联系人"
                  :selectData="outerVisible" @close='outerVisible = false' :maxSelect='maxSelect'
                  @closeDialog="outerVisible = false"
                  @addMans='addMans'>
  </selectMansDialog>
 <!-- <el-dialog title="联系人选择" width='50%' :visible.sync="outerVisible" append-to-body>
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
       <el-checkbox-group style="height: 450px" v-model="checkboxGroup2" v-if="who == '选择来信人'" :max="1">
           <el-checkbox class="checkbox" v-for="(item,index) in mans" :label="item.id" :key="item.id">
             <p><span>{{item.name}}</span><span>{{item.position}}</span></p>
             <p>{{item.mobile}}</p>
           </el-checkbox>
       </el-checkbox-group>
       <el-checkbox-group style="height: 450px" v-model="checkboxGroup" v-else>
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
 </el-dialog>  -->

  </div>

</template>

<script>
  import selectMansDialog from "@/view/yz_eventManagement/eventReports/dialog/selectMansDialog"
  export default {
    name: "specifyForwardingTo",
    components:{
          selectMansDialog
       },
    data() {
      return {
        tableColumn: [
          {
            prop: "callingName",
            label: "发送人"
          }, {
            prop: "callingWorkUnit",
            label: "发送人单位"
          }, {
            prop: "callingPosition",
            label: "发送人职务"
          }, {
            prop: "callingMobile",
            label: "发送号码"
          }, {
            prop: "transferName",
            label: "转发至姓名"
          }, {
            prop: "transferWorkUnit",
            label: "转发至单位"
          }, {
            prop: "transferPosition",
            label: "转发至职位"
          },{
            prop:"transferMobile",
            label:"转发至号码"
          }
        ],//表头名称
        tableData: [],//表格数据
        pageSize: 5,//每页显示条目个数
        total: 0,//总数
        currentPage: 1,//当前页
        dialogVisible:false,
        name:'',
        phoneNumber:'',
        tableTitlePerson:[
            {
              prop: "name",
              label: "转至人"
            }, {
              prop: "mobile",
              label: "转至号码"
            }],
        tableDataPerson:[],
        outerVisible:false,
        defaultProps: {
            children: 'children',
            label: 'name',
          },
        data2:[],
        searchText:'',
        treeId:'',
        checkboxGroup:[],
        checkboxGroup2:[],
        mans:'',
        total1: 0,//数据总数
        pageSize1: 10,//每页条数
        currentPage1: 1,//当前页数
        pagingSize1: true,  //分页大小
        who:'',//判断点击按钮是选择来信人/选择转至人
        row:'',//弹框选中当前table行
        outRow:'',//转发指定选中当前table行
        maxSelect:'',
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
                    "type":"single",
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
            this.outRow = '';
            this.tableData = res.data.parameter;
            this.total = res.data.paging.size;
          })
      },

      // 请求人员
    handleNodeClick(num){
        let page = this.currentPage1-1;
        //当点击左侧tree列表时，重置page从0开始
        console.log(this.treeId.id,num.id)
        if(this.treeId && this.treeId.id != num.id){
              page = 0;
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
             page:  this.currentPage1 - 1,
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
        console.log(checkboxGroup,this.who);
        if(this.who == '选择来信人'){
           //if(this.checkboxGroup2.length == 0) return;
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
                  this.name = res.data[0].name;
                  this.phoneNumber = res.data[0].mobile;
                  this.checkboxGroup2 = checkboxGroup;
                  this.outerVisible = false;
              })
        }else if(this.who == '选择转至人'){
            //if(this.checkboxGroup.length == 0) return;
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
                      return;
                  }
                  this.tableDataPerson = res.data;
                  this.checkboxGroup = checkboxGroup;
                  console.log(this.tableDataPerson);
                  this.outerVisible = false;
              })
        }
     },
     selectPerson(title){
         this.who = title;
         if(title == "选择来信人"){
           this.maxSelect = 1;
           this.$refs.selectDialog.defaultSelection([]);
         }else{
          this.maxSelect = 0;
          this.$refs.selectDialog.defaultSelection(this.checkboxGroup);
         }
         this.outerVisible = true;
         /*this.getPhoneTree();*/
      },
      getPhoneTree(){
      // 渲染弹窗左侧列表
       let data={"data": {}};
       this.$api.telephoneGroupingTree(data).then((res) =>{
          console.log(res)
          this.data2=res.data
        })
     },
     save(){
         console.log(this.checkboxGroup,this.checkboxGroup2);
         if(this.checkboxGroup2.length == 0){
            this.$message({
              message: '请选择来信人！',
              type: 'warning'
            });
            return;
         }else if(this.checkboxGroup.length == 0){
            this.$message({
              message: '请选择至信人！',
              type: 'warning'
            });
            return;
         }
         let data = {
                "data":{
                  "parameter":{
                    "callingId":this.checkboxGroup2,
                    "transferId":this.checkboxGroup
                  },
                  "type":"add"
                }
          };
        this.$api.forward(data).then((res) =>{
                console.log(res)
                if (res.errorcode!=0){
                      this.$message({
                          message:res.msg,
                          type:"error",
                      });
                      return
                  }
                  this.getTableData();
                  this.dialogVisible = false;
           });
      },
      //选中转至人
      rowClick(row){
         this.row = row;
      },
      tableDataRow(row){
        this.outRow = row;
      },
      deletePerson(){
        if(!this.row){
            this.$message.error('请先单击选中要移除的转至人');
         }else{
            console.log(this.row);
            for(let i = 0; i < this.tableDataPerson.length; i++){
              if(this.row == this.tableDataPerson[i]){
                 this.tableDataPerson.splice(i,1);
              }
              if(this.row.id == this.checkboxGroup[i]){
                 this.checkboxGroup.splice(i,1);
              }
            }
            console.log(this.tableDataPerson,this.checkboxGroup,this.row.id)
            this.row = '';
         }
     },
     showDialog(button){
       if(button == '新增'){
          this.name = '';
          this.phoneNumber = '';
          this.checkboxGroup  = [];
          this.checkboxGroup2 = [];
          this.tableDataPerson = [];
          this.$refs.selectDialog.defaultSelection([]);
          this.dialogVisible = true;
       }else if(button == '删除'){
             console.log(this.outRow);
             if(!this.outRow){
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
                      "parameter":[this.outRow.id],
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
                this.outRow = '';
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
<style>
  .el-input.is-disabled/deep/.el-input__inner {
    color: #606266 !important;
  }
</style>
