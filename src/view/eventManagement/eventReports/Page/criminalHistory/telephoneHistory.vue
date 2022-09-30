<!--@author：yf-->
<template>
  <div style="text-align: left;">

    <div style="display:flex;text-align: left;padding: 0 10px;height: 40px;line-height: 40px">
      <label>报送单位:</label>
      <el-select v-model="value" clearable placeholder="请选择"  @change="changeUnit">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="myTable">
      <my-table :tableColumn="tableColumn" :tableData="tableData"></my-table>
    </div>
<!--    <div>-->
<!--      <el-pagination :small="pagingSize"  :page-size="pageSize"  :total="total"-->
<!--                     :current-page="currentPage"-->
<!--                     @current-change="pageMode"-->
<!--                     layout="total, prev, pager, next, jumper"></el-pagination>-->
<!--    </div>-->

  </div>
</template>

<script>
    import myTable from "@/components/tables/tables"
    export default {
        name: "telephoneHistory",
        components:{
          myTable
        },
        data(){
          return{
            gutter:20,
            options: [
              {
                value:'全部',
                label:'全部'
              },
            ],
            total:0,//总数据
            pageSize:1,//第几页
            currentPage:10,//每页多少条数据
            pagingSize:false,//分页大小
            value:'全部',//报送单位
            tableColumn: [
              {
                prop: "contactor",
                label: "姓名"
              }, {
                prop: "workUnit",
                label: "单位"
              }, {
                prop: "position",
                label: "职务"
              }, {
                prop: "call",
                label: "电话号码"
              }, {
                prop: "connectedTime",
                label: "通话时间"
              }],//表头
            tableData: [],//表格数据
            eventId:'',//事件ID
          }
        },
        created(){
          this.getID();
        },
        mounted(){
          this.$nextTick(()=>{
            this.getPhoneData();
            this.getUnit();
          });
        },
        methods:{
          changeUnit(val){//监听选中下拉
            if(this.eventId==''||this.eventId==null||this.eventId=='newID'){
              this.$message({
                message: '请先保存事件',
                type: 'warning'
              });
              return
            }
            if(val=='全部'){
              this.getPhoneData();
            }
            else if(val=='查询未知单位'){
              let data={
                eventId:this.eventId,
                unit:'',
              };
              this.$api.selectPhoneHistoryByEventAndUnit(data).then((res) => {
                if(res.errorcode=='0'){
                  this.tableData=res.data;
                  console.log(res.data);
                  // this.total=res.data.totalElements
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
              this.$api.selectPhoneHistoryByEventAndUnit(data).then((res) => {
                if(res.errorcode=='0'){
                  this.tableData=res.data;
                  console.log(res.data);
                  // this.total=res.data.totalElements
                }else {
                  //this.$message.error(res.msg);
                }
              })
            }
          },
          getID(){
            this.eventId=sessionStorage.getItem('newID');
          },
          getPhoneData(){
            if(this.eventId==''||this.eventId==null||this.eventId=='newID'){
              return
            }
              let data={
                eventId:this.eventId
              };
              this.$api.selectPhoneHistory(data).then((res) => {
                if(res.errorcode=='0'){
                  this.tableData=res.data;
                  console.log(res.data);

                }else {
                  //this.$message.error(res.msg);
                }
              })

          },
          getUnit(){
            if(this.eventId==''||this.eventId==null||this.eventId=='newID'){

              return
            }
              let data={
                eventId:this.eventId
              };
              this.$api.selectPhoneDepartment(data).then((res) => {
                if(res.errorcode=='0'){
                  let arr=[
                    {
                      value:'全部',
                      label:'全部'
                    }
                  ];
                  for(let i=0;i<res.data.length;i++){
                    if(res.data[i]==''||res.data[i]==null||res.data[i]==undefined){
                      res.data[i]='查询未知单位'
                    }
                    arr.push({
                      value:res.data[i],
                      label:res.data[i]
                    })
                  }
                  this.options=arr;
                }else {
                  //this.$message.error(res.msg);
                }
              })

          },
          pageMode(val){//监听第几页
            console.log(val);
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
