<template>
    <div>

      <div class="history_human_wrap" style="position:relative;">
<!--        标题-->
        <div class="history_human_title">
          <span></span>
          <div>
            最近联系人
          </div>
        </div>
        <!--           查看更多进行tab切换 @click="tabGD"-->
<!--        <div class="tabHis" >-->
<!--          <div >-->
<!--            查看更多-->
<!--          </div>-->
<!--        </div>-->
<!--        内容-->
        <div class="history_human_content">
<!--         外套-->
         <div :style="{width:listLength*215+50+'px'}" style="height:100%;">
<!--            渲染的列表-->
           <div class="listxx" @click="details(item)" v-for="(item,index) in tableData" :key="index" >
             <h3>姓名:{{item.operatorName}}</h3>
             <p>电话:{{item.phoneCalled}}</p>
             <p>通话时间:{{item.startTime}}</p>
           </div>
         </div>
        </div>

      </div>

    </div>
</template>

<script>
  // 引入中间件
  import Bus from '../../../utils/bus.js'
  export default {
    name: 'history_human',
    data () {
      return {
        page: 1,
        limit: 10,
        search: '',
        status: 0,
        startTime: '',
        endTime: '',
        listLength: 0,
        tableData: ''
      }
    },
    mounted () {
      this.httpHumanAll()
    },
    methods: {
      details (data) {
        // console.log('点击了div')
        Bus.$emit('cllaVal', {data, type: 'hisHuman'})
      },
      // tabGD(){
      //   this.$emit('childByValue', false)
      // },
      httpHumanAll () {
        var that = this
        this.$http({
          url: this.$http.adornUrl('/phone/phoneinfo/list'),
          method: 'POST',
          data: this.$http.adornParams({
            page: this.page,
            limit: this.limit,
            search: this.search,
            status: this.status,
            startTime: this.startTime,
            endTime: this.endTime
          })
        }).then((data) => {
           if (data.code === 0) {
            // console.log(data, that.tableData)
            that.tableData = data.data.data.list
            that.listLength = data.data.data.list.length
          } else {
            this.$message.error(data.msg);
          }
        })
      }
    }

  }
</script>

<style scoped lang="less">
.history_human_wrap{
  display: flex;
  width: 100%;
  height: 130px;
}
  .history_human_title{
    width: 6%;
    margin-right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    /*writing-mode: vertical-lr;!*从左向右 从右向左是 writing-mode: vertical-rl;*!*/
    /*writing-mode: tb-lr;*/
    span{
      display: inline-block;
      width: 2px;
      height: 73px;
      background-color: #4fc0e8;
      margin: 0 5px;
    }
    div{
      width: 12px;
      font-size: 12px;
      line-height: 15px;
    }
  }
  .history_human_content{
    overflow-x: scroll;
    div{
      display: flex;
      align-items: flex-start;
       div{
         display: inline-block;
       }
    }
  }

  .listxx{
     max-width: 215px;
     min-width: 215px;
     border: 1px solid #999;
     height: 100%;
     background-color: #f0f0f0;
     border-radius: 5px;
     margin: 10px 5px;
     p{
       margin: 0;
       padding:8px 10px 0;
       font-size: 16px;
     }
    h3{
      text-align: center;
      line-height: 25px;
      margin: 0;
      height:25px;
      color: #000;
    }
  }

/*查看更多*/
.tabHis{
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 50px;
  display: flex;
  justify-content: center;
  background: #4fc0e8;
  align-items: center;
  div{
    width: 18px;
    font-size: 18px;
  }
}

</style>
