<!--@author：yf-->
<template>
  <div>
      <div >
        <div style="display:flex;text-align: left;padding: 0 10px;height: 40px;line-height: 40px">
          <label>报送单位:</label>
          <el-select v-model="value" clearable placeholder="请选择"  @change="chanFaxUnit">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="myTable">
        <fax-table  ref="faxTable"
                    :tableColumn="faxTableColumn"
                    @handleCheck="faxHandleCheck"
                    @downloadCheck="downloadCheck"
                    :tableData="faxTableData"
        >

        </fax-table>

      </div>
    <div>
<!--      <pdf ref="pdf"></pdf>-->
    </div>
  </div>
</template>

<script>
    import  faxTable from '@/view/eventManagement/eventReports/Page/criminalHistory/faxTable'
    // import pdf from './pdf'
    //import {Url} from '../../../../../assets/js/common'
    export default {
        name: "faxHistory",
        components:{
          faxTable,
          // pdf
        },
        data(){
        return{
          options: [],
          total:0,//总数据
          pageSize:1,//第几页
          currentPage:10,//每页多少条数据
          pagingSize:false,//分页大小
          value:'全部',//报送单位
          faxTableColumn: [
            {
              prop: "faxName",
              label: "文件名字"
            },{
              prop: "faxFile",
              label: "文件类型",
              formatter: this.fileNameTable
            }, {
              prop: "sendtime",
              label: "时间"
            }],//表头
          faxTableData: [],//表格数据
          eventId:'',//事件ID

          uploading:false,//
          fileId: '',//
        }
      },
      mounted(){
          this.$nextTick(() =>{
            this.getID();
            this.getFaxUnit();
          })
      },
      methods:{
        downloadCheck(){},
        faxHandleCheck(row){//tiff下载
          console.log(row.faxFile);
          //window.open(`${window.g.ApiUrl}/fax/recv/${row.faxFile}`)
          window.open(`${window.g.ApiUrl}/eos/communication/pdf/download?filename=${row.faxFile}`)
        },
        getID(){
          this.eventId=sessionStorage.getItem('newID');
        },
        getFaxTableData(){
          if(this.eventId==''||this.eventId==null||this.eventID=='newID'){
            this.$message({
              message: '请先保存事件',
              type: 'warning'
            });
            return
          }
          let data={
            eventId:this.eventId,
          };
          this.$api.getFaxHistory(data).then((res) => {
            if(res.errorcode=='0'){
              console.log(res.data);
              if(res.data.path!=''){
                this.$refs.faxTable.examine=true;
              }
              if(res.data.path==''){
                this.$refs.faxTable.guess=true;
              }
              this.faxTableData=res.data;
            }else {
              //this.$message.error(res.msg);
            }
          })
        },
        chanFaxUnit(val){
          if(this.eventId==''||this.eventId==null||this.eventID=='newID'){
            this.$message({
              message: '请先保存事件',
              type: 'warning'
            });
            return
          }
          console.log(val);
          if(val=='全部'){
            this.getFaxTableData();
          }
          else if(val=='查询未知单位'){
            let data={
              eventId:this.eventId,
              unit:'',
            };
            this.$api.selectFaxHistoryByEventAndUnit(data).then((res) => {
              if(res.errorcode=='0'){
                this.faxTableData=res.data;
                console.log(res.data);
              }else {
                //this.$message.error(res.msg);
              }
            })
          }
          else {
            let data={
              eventId:this.eventId,
              unit:val
            };
            this.$api.selectFaxHistoryByEventAndUnit(data).then((res) => {
              if(res.errorcode=='0'){
                console.log(res.data);
                this.faxTableData=res.data;
              }else {
                //this.$message.error(res.msg);
              }
            })
          }
        },
        getFaxUnit(){
          if(this.eventId==''||this.eventId==null||this.eventId=='newID'){
            return
          }
          let data={
            eventId:this.eventId
          }
          this.$api.selectFaxDepartment(data).then((res) => {
            if(res.errorcode==0){
              console.log(res.data);
              let arr=[{
                value:'全部',
                label:'全部'
              }];
              let stuck=true;
              for(let i=0;i<res.data.length;i++){
                if(stuck){
                  if(res.data[i]==""||res.data[i]==null||res.data[i]==undefined){
                    res.data[i]='查询未知单位'
                  }
                  stuck=false
                }
                arr.push({
                  value:res.data[i],
                  label:res.data[i]
                });

              }
              this.options=arr;
              this.getFaxTableData()
            }
          })
        },
        fileNameTable: function (row) {//修改表格达到预期数据形式
          return  row.faxFile.split('.')[row.faxFile.split('.').length-1];
        },
      }
    }
</script>

<style scoped>
  .myTable{
    border: 1px solid #ddd;
    padding: 10px 15px;
    margin: 10px;
  }
</style>
