<!--@author：wzm-->
<template>
   <div class="out">
     <div v-if='!showSort' class="top">
       <el-button type="primary" @click="add" >新增</el-button>&nbsp;&nbsp;
       <el-button type="primary" @click="delet">移除</el-button>
       <el-button type="primary" @click="sort">排序</el-button>
     </div>
     <div v-if='showSort' class="top">
       <el-button type="primary" @click='sortchild("最前")'>最前</el-button>
       <el-button type="primary" @click='sortchild("上移")'>上移</el-button>
       <el-button type="primary" @click='sortchild("下移")'>下移</el-button>
       <el-button type="primary" @click='sortchild("最后")'>最后</el-button>
      <!-- <el-button type="primary" @click='sortchild("排序")'>保存排序</el-button>-->  
       <el-button type="primary" @click='showSort = false'>取消排序</el-button>
     </div>
    <my-table :height="height" :tableColumn="tableColumn"  @handleCurrentChange="test" :tableData="tableData"></my-table>
    <!-- //分页器 -->
    <el-pagination   :total="total2"
                       layout="total"></el-pagination>
    <!-- 选择人员弹窗 -->
    <selectMansDialog ref="selectDialog" selectTitle="选择联系人"
                  :selectData="outerVisible" @close='outerVisible = false'
                  @closeDialog="outerVisible = false"
                  @addMans='change'>
    </selectMansDialog>
   </div>
</template>

<script>
    import selectMansDialog from "@/view/eventManagement/eventReports/dialog/selectMansDialog"
    import treeSearch from "@/view/eventManagement/eventHistory/plan/treeSearch"
    import myTable from "@/components/tables/tables"
      const cityOptions = [];
    export default {
        name: "operatorOnDuty",
        components:{
          selectMansDialog,
          treeSearch,
          myTable
        },
        data(){
         return{
             relId:'',
             height:250,
             showSort:false,
             searchText:"",
           citys:cityOptions,
           ruleForm:{
              eventTitle:'',
              submittedUnit:'',
              submittedType:'',
              rankEvent:''
            },
            title:'',//外层弹窗标题
            data2:[],
              defaultProps: {
                children: 'children',
                label: 'name'
              },
              cities: cityOptions,
              checkboxGroup1:[],
              mans:'',
            // ************************************************************************************
             // 分页器1(弹窗)
        total1: 0,//数据总数
        pageSize1: 10,//每页条数
        id:'',
        relid:'',
        currentPage1: 1,//当前页数
        pagingSize1: true,  //分页大小
        // 分页器2
        total2: null,//数据总数
        pageSize2: 10,//每页条数
        currentPage2: 1,//当前页数
        pagingSize2: true,  //分页大小
        dialogFormVisible2:false,

        outerVisible:false,
                tableColumn: [
              {
                prop: "name",
                label: "姓名"
              },
              {
                prop: "workUnit",
                label: "工作单位"
              }, {
                prop: "position",
                label: "职务"
              }, {
                prop: "mobile",
                label: "手机号码"
              }, {
                prop: "officeTel",
                label: "办公电话"
              }],//表头
              tableData: [],//表格数据
              treeId:'',
             rowSort:''
            }
        },
         methods: {
            axios(){
               let data = {
                page:1,
                 size:1000
              };
        //  请求
        this.$api.operatorOnDuty(data).then((res) => {
          console.log(res)
          // 返回的数据赋值给table
          this.tableData = res.data.data
          // console.log(res.data.data[1].diffTime)
          // 把数据赋值给总共的数据总数total
          this.total2 = res.data.totalElements;
          // 把remark（备注）赋值给name
          // this.formLabelAlign.name = res.data.data.remark
        })
            },
            searchApi() {
                console.log(this.currentPage2)
                let data = {
                  page: this.currentPage2,
                  size: 10
                };
                console.log(data);
                this.$api.operatorOnDuty(data).then((res) => {
                  // 返回的数据赋值给options
                  this.tableData = res.data.data;
                  // 把数据赋值给总共的数据总数tableData1
                  this.total2 = res.data.totalElements;
                })
              },
       //  分页器1(弹窗)
      /*handleCurrentChangein(){
        let data = {
                  page: this.currentPage1,
                  size: 10
                };
                console.log(data);
                this.$api.contactorList(data).then((res) => {
                  // 返回的数据赋值给options
                  // 把数据赋值给总共的数据总数tableData1
                  this.total1 = res.data.totalCount;
                  this.mans=res.data.list;
                })
      },*/
       //  分页器2
      handleCurrentChange2() {
        if (this.data == undefined) {
          this.searchApi();
        } else {
          this.axios();
        }
      },
         test(row) {
           console.log(row)
             this.rowSort = row;
           console.log(row.relId)
           this.relId=row.relId
              // this.name = row.name;
              // this.record = row.date;
              this.id = row.id;
              // this.overtime = row.overtime;
              // this.daynum = row.duration;
              // this.daytext = row.remark;
          },
             // 删除
             delet(){
                 if(this.id){
                     this.$confirm('确认删除该值班人员, 是否继续?', '提示', {
                         confirmButtonText: '确定',
                         cancelButtonText: '取消',
                         type: 'warning'
                     }).then(() => {
                         let data={
                             id:this.relId,
                             // dutyLogId: this.bigid,	//duty_log 主键id
                         };
                         this.$api.operatorOnDutydel(data).then((res) =>{
                             if (res.errorcode!=0){
                                 this.$message({
                                     message:res.msg,
                                     type:"error"
                                 });
                                 return
                             }
                             this.axios();
                         });
                     }).catch(() => {
                         this.$message({
                             type: 'info',
                             message: '已取消删除'
                         });
                     });
                 }
                 else{
                     this.$message({
                         type: 'info',
                         message: '请选择人员'
                     });
                 }
              },
             // del(){
             //     let data={
             //         id:this.relid,
             //         // dutyLogId: this.bigid,	//duty_log 主键id
             //     };
             //     this.$api.operatorOnDutydel(data).then((res) =>{
             //         if (res.errorcode!=0){
             //             this.$message({
             //                 message:res.msg,
             //                 type:"error"
             //             });
             //             return
             //         }
             //         this.axios();
             //     });
             //     this.dialogFormVisible2 = false
             // },
           // 请求人员
          handleNodeClick(num){
              console.log(num)
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
                 searchText:this.searchText,
                 page:page,
                 size:10
               };

              this.$api.contactorList(data).then((res) =>{
                console.log(res.data.data)
                this.total1 = res.data.totalCount;
                this.mans=res.data.list;
              })
            },
          change(checkboxGroup){
            //console.log(this.checkboxGroup1)
            let data={
               ids:checkboxGroup
             };
            this.$api.operatorOnDutydeladd(data).then((res) =>{
              console.log(res)
              if (res.errorcode!=0){
                    this.$message({
                        message:res.msg,
                        type:"error",
                    });
                    return
                }
                else{
                  this.outerVisible = false;
                  this.mans='';
                  this.searchText='';
                  this.axios();
                  // let data={
                  //     "data": {}};
                  // this.$api.telephoneGroupingTree(data).then((res) =>{
                  //     console.log(res.data)
                  //     this.data2=res.data
                  //
                  // })
                  //this.checkboxGroup1=[]
              }

            })
          },
             soush(){
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
                     this.total1=res.data.totalCount
                 })
             },
             // unchange(){
             //     this.outerVisible = false
             //     this.searchText=''
             //     this.mans=''
             //     this.checkboxGroup1=[]
             // },
             sort(){
                 this.showSort = true;
             },
             sortchild(text){
                 if(this.id==''){
                     this.$message({
                         message: '请先单击选中要操作的行',
                         type: 'warning'
                     });
                     return;
                 }
                 let index,tem,totalLength = this.tableData.length;
                 for(let i = 0; i < totalLength; i++){
                     if(this.id == this.tableData[i].id){
                         index = i;
                         break;
                     }
                 }
                 if(text=='最前'){
                     // let id=JSON.stringify(this.id)
                     let data = {
                         "data": {
                             "type": "top",
                             "shift": this.relId
                         }
                     };
                     //  请求
                     this.$api.order(data).then((res) => {
                         console.log(res)
                         this.axios()
                     })
                 }
                 else if(text=='上移'){
                     if(index === 0) return;
                     let data = {
                         "data": {
                             "type": "shift",
                             "shift1": this.relId,
                             'shift2': this.tableData[index-1].relId
                         }
                     };
                     //  请求
                     this.$api.order(data).then((res) => {
                         console.log(res)
                         this.axios()
                     })
                 }
                 else if(text=='下移'){
                     if(index === totalLength) return;
                     let data = {
                         "data": {
                             "type": "shift",
                             "shift1": this.relId,
                             'shift2': this.tableData[index+1].relId
                         }
                     };
                     //  请求
                     this.$api.order(data).then((res) => {
                         console.log(res)
                         this.axios()
                     })
                 }
                 else if(text=='最后'){
                     let data = {
                         "data": {
                             "type": "bottom",
                             "shift": this.relId
                         }
                     };
                     //  请求
                     this.$api.order(data).then((res) => {
                         console.log(res)
                         this.axios()
                     })
                 }
             },
             add(){
              console.log(this.outerVisible)
                this.outerVisible = true;
                console.log(this.outerVisible)
                 this.searchText=''
                 this.mans=''
                 // this.checkboxGroup1=[]
             }



        },
        mounted(){
          this.axios()
          // 渲染弹窗左侧列表
           let data={
             "data": {}};
            this.$api.telephoneGroupingTree(data).then((res) =>{
              console.log(res.data)
              this.data2=res.data
            })
        },
    }
</script>

<style scoped>
.out{
    padding: 0 30px 0 30px;
    text-align: left;
}
.main{
  width: 100%;
  display: flex;
}
.left{
  width: 50%;
}
.right{
  width: 50%;
  height: 620px;
  /* background-color: #ccc; */
  position: relative;
}
.page{
  position: absolute;
  margin: 0 auto;
  bottom: 0;
}
#ul{
  list-style: none;
  overflow: hidden;
}
#ul li{
  width: 150px;
  height: 100px;
  background-color: #fff;
  float: left;
  margin: 5px;
}
.checkbox{
  margin-top: 10px;
  width: 180px;
  text-align: left !important;
  height: 80px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
}
.input{
  width: 300px;
  margin: 0 20px;
}
.dialog-footer{
  text-align: center;
}
</style>
