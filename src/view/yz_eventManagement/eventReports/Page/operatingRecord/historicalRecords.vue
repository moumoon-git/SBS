<!--@author：yf-->
<template>
    <div>
      <el-main style="padding: 0 10px 20px 10px;height:512px;overflow: auto">
        <div v-for="(item,index) in list" class="operationPlan" :key="index">
          <div v-if="item.type=='appEventTrace'" class="plans">
            <div class="timePlan">{{item.operateTime}}&nbsp;&nbsp;&nbsp;{{item.operator}}</div>
            <div class="contentPlan">{{item.remark}}{{item.content==null?'':item.content}}</div>
          </div>
          <div v-else-if="item.type=='phone'" class="plans">
            <div  v-if="item.send=='1'">
              <div class="timePlan">{{item.operateTime}}&nbsp;&nbsp;&nbsp;{{item.operator}}</div>
              <div class="contentPlan">呼叫{{item.remark}}【{{item.number}}】</div>
            </div>
            <div  v-if="item.send=='0'">
              <div class="timePlan">{{item.operateTime}}&nbsp;&nbsp;&nbsp;{{item.operator}}</div>
              <div class="contentPlan">被{{item.remark}}【{{item.number}}】</div>
            </div>

          </div>
          <div v-else-if="item.type=='message'" class="plans">
            <div  v-if="item.send=='1'">
              <div class="timePlan">{{item.operateTime}}&nbsp;&nbsp;&nbsp;{{item.operator}}</div>
              <div class="contentPlan">发送{{item.remark}}【{{item.number}}】,{{item.content==null?'':item.content}}</div>
            </div>
            <div  v-if="item.send=='0'">
              <div class="timePlan">{{item.operateTime}}&nbsp;&nbsp;&nbsp;{{item.operator}}</div>
              <div class="contentPlan">接收{{item.remark}}【{{item.number}}】,{{item.content==null?'':item.content}}</div>
            </div>
          </div>
        </div>
      </el-main>
      <el-footer>
        <el-pagination :small="pagingSize"  :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"
                       :current-page="currentPage"
                       @size-change="handleSizeChange" @current-change="pageMode"
                       layout="total, prev, pager, next, sizes, jumper"></el-pagination>
      </el-footer>
    </div>
</template>

<script>
    export default {
        name: "historicalRecords",
        data(){
          return{
            eventId:'',//事件Id
            list:[],
            pagingSize:true,
            total:0,
            pageSize:10, //每页多少条
            currentPage:1, //当前页
          }
        },
        mounted(){
          this.getDataList();
        },
        methods:{
          getDataList(){
              this.eventId=sessionStorage.getItem('newID');
            if(this.eventId==''||this.eventId==null||this.eventId=='newID'){
              return
            }
              let data={
                eventId:this.eventId,
                size:this.pageSize,
                page:this.currentPage
              }
              this.$api.selectAllOperatorHistory(data).then((res) => {
                if(res.errorcode==0){
                  this.list=res.data.data
                  this.total=res.data.totalElements
                }
              })

          },
          handleSizeChange(val){
            this.pageSize=val;
            this.getDataList();
          },
          pageMode(val){
            this.currentPage=val;
            this.getDataList();
          }
        }
    }
</script>

<style scoped>
  .operationPlan{
    text-align: left;
    background-color: white;
  }
  .contentPlan{
    text-indent: 10px;
    padding: 10px 0 0 0;
  }
  .contentPlan{
    font-size: 16px;
    font-family:'黑体';
    font-weight:400;
    color:rgba(96,98,102,1);
  }
  .plans{
    border: 1px solid #ddd;
    margin: 10px 0;
    padding: 5px;
    border-radius: 5px;
  }
</style>
