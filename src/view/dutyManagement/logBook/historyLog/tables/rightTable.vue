<template>
  <div class="dddd" style="padding: 0 20px">
    <div class="show" id="printTest">
      <div class="tableHeader">值班日志 </div>
      <table border= "1" width="100%" cellspacing="0" cellpadding="0">
        <thead>
             <tr height="40px">
          <td>日期</td>
                  <td colspan="4">{{leftname.dateStart}} 至 {{leftname.dateEnd}}</td>
               </tr>
             <tr height="40px">
                  <td width= "25%" >值班人员</td>  
                  <td width= "25%" >{{leftname.primaryDutyOperator}}</td>  
                  <td width= "25%">接班人员</td>  
                  <td width= "25%">{{leftname.secondDutyOperator}}</td> 
               </tr>
        <tr>
          <td colspan="4" height="40px">值班内容</td>
        </tr>
        </thead>
        <tbody v-for="item in tableData" >
        <tr>
          <td rowspan="3">{{item.operateTime}}</td>
          <td class="matter">事项</td>
          <td colspan="2" width= "25%">
            <p  class="tdContent" >{{item.event}}</p>
          </td>
        </tr>
        <tr>
          <td class="matter">处置记录</td>
          <td colspan="2" width= "25%">
            <p  class="tdContent">{{item.operation}}</p>
          </td>
        </tr>
        <tr>
          <td class="matter">领导批示</td>
          <td colspan="2" width= "25%">
            <p class="tdContent">{{item.leadershipInstructions}}</p>
          </td>
        </tr>
        </tbody>

      </table>
      <div class="tableHeader">交接班事项</div>
      <el-row class="borderBox">
        <el-row style="height: 80px;line-height: 80px">
          <el-col :span="8" class="borderBox">
            硬件设备状态
          </el-col>
          <el-col :span="16" class="borderBox">
            <div>
              {{hardwareState}}
            </div>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="8"  class="borderBox heightBox">
            故障描述
          </el-col>
          <el-col :span="16"  class="borderBox heightBox">
            <p class="contextBox">
              {{leftname.breakDown}}
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8"  class="borderBox heightBox">
            事件处理
          </el-col>
          <el-col :span="16" class="borderBox heightBox">
            <p class="contextBox">
              {{leftname.eventDeal}}
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="borderBox heightBox">
            领导交办
          </el-col>
          <el-col :span="16" class="borderBox heightBox">
            <p class="contextBox">
              {{leftname.handover}}
            </p>
          </el-col>
        </el-row>
      </el-row>
    </div>
<!--    <div class="none">-->
<!--      <p class="p">暂无数据</p>-->
<!--    </div>-->

  </div>
</template>

<script>
    export default {
        props: ["leftname","tableData"],
        name: "rightTable",
        data(){
          return{
            hardwareState:''
          }
        },
        mounted(){
            console.log(this.leftname)
            console.log(this.tableData)
            if(this.leftname==''){

            }
            else{
                let show=document.getElementsByClassName('show')[0];
                let unshow=document.getElementsByClassName('none')[0];
                show.style.display='block'
                unshow.style.display='none'
            }
        },
        beforeUpdate(){
            if(this.leftname.breakDown===''){
              this.hardwareState='正常'
            }
            else{
              this.hardwareState='异常'
            }
        }
    }
</script>

<style scoped>
 /* @page{
     margin: 1cm;
   }
  */
 @page {
    size: a4;
    margin: 0cm 1cm 0cm 1cm
  }
   @media print {
    header{
      display: none;
    }
    footer{
      display: none;
    }
    .show{
      width:1080px;
    }
  }
  .borderBox{
    box-sizing: border-box;
    border:1px solid #565656;
  }
  .heightBox{
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .contextBox{
    width: 100%;
    height: 100%;
    text-align: left;
    text-indent: 2em;
    overflow-y: auto;
  }
  .tableHeader{
    height:60px;
    line-height: 60px;
    font-size:20px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(50,50,50,1);
  }
  table{
    /*height: 535px;*/
    box-sizing: border-box;
    color:rgba(96,98,102,1);
  }

  .matter{
    background:rgba(242,242,242,1);
  }
  /* .tdContent{
    display: flex;
    justify-content: flex-start;
    text-indent: 10px;
    min-height: 80px;
    width: 400px;
    overflow-y: auto;
  } */
  .tdContent{
    text-align: left;
    text-indent: 2em;
  }
  .dddd{
    margin-bottom: 20px;

  }
 /* .show{
    width:1080px;
  }  */
  /*.show{*/
  /*  display: none;*/
  /*}*/
  /*.none{*/
  /*  height: 500px;*/
  /*  display: flex;*/
  /*  justify-content: center;*/
  /*  align-items: center;*/
  /*}*/
  /*.p{*/
  /*  font-size: 20px;*/
  /*  color: #9DA4B3;*/
  /*}*/
</style>
