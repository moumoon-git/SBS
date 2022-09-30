<!--@author：yf-->
<template>
    <div>
      <el-header style="text-align: left;line-height: 50px;height: 50px">
        <el-button type="primary" size="small" @click="addOperation">新增</el-button>
        <el-button type="primary" size="small" @click="updateOperation">修改</el-button>
        <el-button type="primary" size="small" @click="deleteReport">删除</el-button>
      </el-header>
      <el-main style="padding-top: 0">
        <my-table
          @handleCurrentChange="handleCurrentChange"
          :tableColumn="tableColumn"
          :tableData="tableData"></my-table>
        <el-pagination :small="pagingSize"  :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"
                       :current-page="currentPage"
                       @size-change="handleSizeChange" @current-change="pageMode"
                       layout="total, prev, pager, next, sizes, jumper"></el-pagination>
      </el-main>


      <!--弹窗-->
      <el-dialog width="600px" :title="title" :visible.sync="innerVisible" append-to-body center :close-on-click-modal="false" @close="close">
        <el-form :hide-required-asterisk="false" label-width="90px" :model="addFlowForm" :rules="addFlowRules" ref="addFlowForm"  label-position="content"   @submit.native.prevent>
            <el-form-item label="操作时间:" prop="name">
              <el-date-picker
                @change="dateChangebirthday"
                format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                v-model.trim="addFlowForm.time"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="操作内容:" prop="content">
              <el-input type="textarea"  v-model.trim="addFlowForm.content"
                        :autosize="{minRows:5,maxRows:7}"
                        resize="none"
                        show-word-limit ></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button size="small" type="primary" @click="lookForConfirmation('addFlowForm')">确认</el-button>
        </div>

      </el-dialog>

    </div>
</template>

<script>
    import myTable from "@/components/tables/tables"
    export default {
        name: "operationalRecords",
        components:{
          myTable
        },
        data(){
          return{
            total: 200,//数据总数
            pageSize: 10,//总页数
            currentPage: 1,//当前页数
            pagingSize:false,  //分页大小
            tableColumn: [
              {
                prop: "oprTime",
                label: "操作时间"
              }, {
                prop: "content",
                label: "操作内容"
              }, {
                prop: "oprName",
                label: "操作员"
              }],//表头
            tableData: [],//表格数据
            eventId:'',//事件ID
            title:'',//title
            innerVisible:false,//弹窗
            addFlowForm:{//表单
              time:'',
              content:''
            },
            addFlowRules:{//表单验证

            },
            tableRowData:[],//表格行点击
          }
        },
        mounted(){
          this.setGettable();
        },
        methods:{
          dateChangebirthday(val) {
            console.log(val);
            this.addFlowForm.time = val;
          },
          setGettable(){
              this.eventId=sessionStorage.getItem('newID');
            if(this.eventId==''||this.eventId==null||this.eventId=='newID'){
              return
            }

              let data={
                eventId:this.eventId,
                size:this.pageSize,
                page:this.currentPage
              }
              this.$api.selectOperator(data).then((res) => {
                if(res.errorcode==0){
                  this.tableData=res.data.data
                  this.total=res.data.totalElements
                }
              })
          },
          getTableData(){
              this.eventId=sessionStorage.getItem('newID');
              let data={
                eventId:this.eventId,
                size:this.pageSize,
                page:this.currentPage
              }
              this.$api.selectOperator(data).then((res) => {
                if(res.errorcode==0){
                  this.tableData=res.data.data
                  this.total=res.data.totalElements
                }
              })
          },
          addOperation(){//新增
            if(this.eventId==''||this.eventId==null||this.eventId=='newID'){
              this.$message({
                message: '请先保存事件',
                type: 'warning'
              });
              return
            }
            this.innerVisible=true;
            this.title='新增操作记录';
            this.addFlowForm.time='';
            this.addFlowForm.content='';
          },
          updateOperation(){
            if(this.eventId==''||this.eventId==null||this.eventId=='newID'){
              this.$message({
                message: '请先保存事件',
                type: 'warning'
              });
              return
            }
            if(this.tableRowData==''||this.tableRowData==null||this.tableRowData==[]){
              this.$message({
                message: '请点击表格选择操作记录进行修改！',
                type: 'warning'
              });
              return;
            }
            this.innerVisible=true;
            this.title='修改操作记录';
            this.addFlowForm.time=this.tableRowData.oprTime;
            this.addFlowForm.content=this.tableRowData.content;
          },
          lookForConfirmation(addFlowForm){
            this.$refs[addFlowForm].validate((valid) => {
              if (valid) {
                let type=this.title;
                let addData,upData;
                switch (type) {
                  case "新增操作记录":
                    addData={
                      data:{
                        vcType:'处置',
                        iEventId:this.eventId,
                        dtOprTime:this.addFlowForm.time,
                        txtContent:this.addFlowForm.content
                      }
                    };
                    this.$api.saveOperator(addData).then((res) => {
                      if(res.errorcode=='0'){
                        this.$message({
                          message: '新增成功！',
                          type: 'success'
                        });
                        this.getTableData();
                        this.tableRowData='';
                        this.innerVisible=false;
                      }else {
                        this.$message.error(res.msg);
                      }
                    })
                    break;
                  case "修改操作记录":
                     upData={
                      data:{
                        vcType:'处置',
                        iEventId:this.eventId,
                        dtOprTime:this.addFlowForm.time,
                        txtContent:this.addFlowForm.content,
                        iId:this.tableRowData.id
                      }
                    };
                    this.$api.saveOperator(upData).then((res) => {
                      if(res.errorcode=='0'){
                        this.$message({
                          message: '修改成功！',
                          type: 'success'
                        });
                        this.getTableData();
                        this.tableRowData='';
                        this.innerVisible=false;
                      }else {
                        //this.$message.error(res.msg);
                      }
                    })
                    break;
                }
              }

            });
          },
          deleteReport(){//删除
            if(this.tableRowData==''||this.tableRowData==null||this.tableRowData==[]){
              this.$message({
                message: '请点击表格选择操作记录进行删除！',
                type: 'warning'
              });
              return;
            }
            this.$confirm('此操作将删除该条内容, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let data={
                id:this.tableRowData.id
              };
              this.$api.deleteOperator(data).then((res) => {
                if(res.errorcode=='0'){
                  this.$message({
                    message: '已删除！',
                    type: 'success'
                  });
                  this.getTableData();
                  this.tableRowData='';
                  this.innerVisible=false;
                }else {
                  //this.$message.error(res.msg);
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
          },
          handleCurrentChange(row){
            this.tableRowData=row;
            console.log(row)
          },
          handleSizeChange(val){
            this.tableRowData=[]
            this.pageSize=val;
            this.getTableData();
          },
          pageMode(val){
            this.tableRowData=[]
            this.currentPage=val;
            this.getTableData();
          },
          close(){//弹窗关闭

          }
        }
    }
</script>

<style scoped>
  >>>.el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100%;
  }
</style>
