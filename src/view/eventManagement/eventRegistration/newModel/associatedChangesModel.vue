<template>
  <div>
    <el-dialog  top="50px" width="800px"  :title="associatedChangesModelTitle"
                :visible.sync="associatedChangesModelDialog"
                :before-close="associatedManageCloseDialog" :close-on-click-modal="false"
                append-to-body lock-scroll left
    >
      <el-table
        @row-click="associateClick"
        :data="associateTableData"
        border
        highlight-current-row
        style="width: 100%;margin: 10px 0;text-align:center;">
        <el-table-column
          prop="title"
          align="center"
          label="事件标题"
          height="30"
          show-overflow-tooltip
          min-width="40%">
        </el-table-column>
        <el-table-column
          prop="occurTime"
          align="center"
          label="事发时间"
          height="30"
          show-overflow-tooltip
          min-width="40%">
        </el-table-column>
        <el-table-column
          prop="status"
          align="center"
          label="状态"
          height="30"
          show-overflow-tooltip
          min-width="20%">
        </el-table-column>
      </el-table>
      <el-pagination
        center
        small
        layout="prev, pager, next,  total, jumper"
        :page-size="pageSize"
        :total="total"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="associatedClose">取 消</el-button>
        <el-button type="primary" @click="associatedAffirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "associatedChangesModel",
        props:['associatedChangesModelTitle','associatedChangesModelDialog'],
        data(){
          return{
            associateTableData:[],
            pageSize:10,
            total:0,
            currentPage:1,
            eventId:null,//需要更改的事件的id
          }
        },
        mounted(){
          let ipData={
            size:this.pageSize,
            page:this.currentPage,
          };
          this.$szApi.listBy(ipData).then((res) => {
            if(res.errorcode == 0){
              this.associateTableData=res.data.data;
              this.total=res.data.totalElements
            }else {
              // //this.$message.error(res.msg)
            }

          });
        },
        watch:{
          currentPage:{
            handler(nV,oV){
              console.log(nV, oV);
              if(nV!==oV){
                this.eventId=null
              }
            },
            deep:true
          }
        },
        methods:{
          associateClick(row){
            this.eventId=row.id
          },
          getAssociateData(){
            let ipData={
              size:this.pageSize,
              page: this.currentPage,
            };
            this.$szApi.listBy(ipData).then((res) => {
              if(res.errorcode == 0){
                this.associateTableData=res.data.data;
                this.total=res.data.totalElements
              }else {
                // //this.$message.error(res.msg)
              }
            });
          },
          handleCurrentChange(val){
            console.log(val);
            this.currentPage=val
            this.getAssociateData()
          },
          associatedManageCloseDialog(){
            this.$emit('associatedManageCloseDialog')
          },
          associatedClose(){
            this.$emit('associatedClose')
          },
          associatedAffirm(){
            this.$emit('associatedAffirm',this.eventId)
          }
        }
    }
</script>

<style scoped>

</style>
