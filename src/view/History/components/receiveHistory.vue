<template>
  <div class="msg_container">
    <el-table
      :data="tableData"
      style="width: 100%;"
      :header-cell-style="{background:'rgba(249,252,255,1)',color:'black'}"
      @row-click = "clickRow"
      highlight-current-row
      v-loading="loading">
      <el-table-column
        label="收/发"
        width="200"
      >
        <template slot-scope="scope" >
          <div v-if="scope.row.direct == '发送'" style="display: inline-block; width: 11px;height: 11px;border-radius: 50%;background: #0BD295"></div>
          <div v-if="scope.row.direct == '接收'" style="display: inline-block; width: 11px;height: 11px;border-radius: 50%;background: #0091FF"></div>
          <span style="text-align: left">{{scope.row.direct}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="姓名/号码"
        width="200"
        >
        <template slot-scope="scope" >
          <span style="text-align: left">{{scope.row.contactor}}</span><br />
          <span style="text-align: left">{{scope.row.call}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="workUnit"
        label="单位"
        width="220"
        >
        <template slot-scope="scope">
          <span >{{scope.row.workUnit?scope.row.workUnit:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="position"
        label="职位"
        width="220">
        <template slot-scope="scope">
          <span >{{scope.row.position?scope.row.position:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sendTime"
        label="时间"
        >
          <template slot-scope="scope" >
            <span style="text-align: left">{{scope.row.sendTime.slice(10)}}</span>
            <br />
            <span>{{scope.row.sendTime.slice(0,10)}}</span>
          </template>
      </el-table-column>
      <!-- <el-table-column
        prop="status"
        label="状态"
        width="120">
        <template slot-scope="scope" >
          <el-button v-if="scope.row.status == '发送失败'" type="danger" class="temp">{{scope.row.status}}</el-button>
          <el-button v-if="scope.row.status == '发送成功'" type="success" class="temp">{{scope.row.status}}</el-button>
          <el-button v-if="scope.row.status == '已发送'" type="success" class="temp">{{scope.row.status}}</el-button>
          <el-button v-if="scope.row.status == '未读'" type="warning" class="temp">{{scope.row.status}}</el-button>
          <el-button v-if="scope.row.status == '已读'" type="primary" class="temp">{{scope.row.status}}</el-button>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        prop="receipt"
        label="回执"
        width="">
        <template slot-scope="scope" >
          <span v-if="scope.row.receipt">{{scope.row.receipt}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        width="">
        <template slot-scope="scope" >
          <span >{{scope.row.type?scope.row.type:'-'}}</span>
        </template>
      </el-table-column> -->
    </el-table>
<!--    <el-pagination background layout="prev, pager, next" :total="totalElements"-->
<!--                  @current-change="box_lookup" current-page.sync="totalPages"-->
<!--    ></el-pagination>-->
  </div>
</template>

<script>
  export default {
    name: "receiveHistory",
    props:['sendTable','queryAllData','clickQueryAll','size'],
    data() {
      return {
        tableData: [],
        totalElements:0,
        totalPages:0,
        loading:false,
      }
    },
    watch:{
      'sendTable.data':function (newVal) {
        this.tableData = this.sendTable.data
        this.totalElements = this.sendTable.totalElements
        this.totalPages = parseInt(this.sendTable.totalPages)
        console.log('点击搜索了')
      },

    },
    mounted() {
      if (!this.$route.query.type){
        this.$emit("getStatusOptions",true)
      }
    },
    methods:{
      init(page){
        this.loading = true;
        let data = {
          id:'',
          dtStart: '',
          dtEnd: '',
          // smsType:'',
          page:page,
          size: this.size,
          status:5,
          smsId:'',
          searchText:'',
          direct:'',
        };
        this.queryData = data
        this.$api.findAllSmsList(data).then((res) => {
          // 返回的数据赋值给table
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          if(!res.data){
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }

          let temp = res.data
          // 区分发送和接受的号码
          temp.data.forEach(item=>{
            item['number'] = item['call']
          })

          this.totalElements = temp.totalElements
          this.totalPages = parseInt(temp.totalPages)
          this.tableData = temp.data
          this.loading = false;
          if(temp.data[0]){
            //默认选中第一个
            this.$nextTick(()=>{
              let content = temp.data[0]['content']
              let smsId = temp.data[0]['smsId']
              let eventId = temp.data[0]['eventId']
              let workUnit = temp.data[0]['workUnit']
              let direct = temp.data[0]['direct']

              console.log(temp.data[0])
              this.$emit('changeALL',temp.data[0])
            })
          }

        })
      },
      // box_lookup(page){
      //   this.queryData['page'] = page-1
      //   this.queryData = this.queryAllData
      //   // console.log(this.queryAllData + '111')
      //   let data = this.queryData
      //   this.$api.lishijilu(data).then(res=>{
      //     if (res.errorcode != 0) {
      //       this.$message({
      //         message: res.msg,
      //         type: "error"
      //       });
      //       return
      //     }
      //     if(!res.data){
      //       this.$message({
      //         message: res.msg,
      //         type: "error"
      //       });
      //       return
      //     }
      //     console.log(page)
      //     let temp = res.data
      //     this.totalElements = temp.totalElements
      //     this.totalPages = parseInt(temp.totalPages)
      //     this.tableData = temp.data
      //   })
      // },
      clickRow(row){
        let content = row['content']
        let smsId = row['smsId']
        let eventId = row['eventId']
        let workUnit = row['workUnit']
        let direct = row['direct']
        // alert(row)
        if(row.status == '未读'){
          // console.log(row.id)
          let data = {id:row.id}
          this.$api.smsRead(data).then(res=>{
            if(res.msg == 'SUCCESS'){
              row.status = '已读'

              this.$store.commit('SET_ANSWERNUM') //改变未读状态
            }
          })
        }
        this.$emit('changeALL',row)
        console.log(row)
        // console.log(smsId,eventId,'111111111')
      }
    },
  }
</script>

<style scoped>
  /deep/.el-table th > .cell {
    text-align: center;
  }
  /deep/.el-table .cell {
    text-align: center;
  }
  .el-pagination {
    text-align: right;
  }
  .container {
    padding: 28px 0 0 0;
  }
  .temp.el-button.el-button--warning{
    background: #ff977a;
  }
  .temp{
    padding: 5px ;
    width: 78px;
    cursor:default;
  }
  >>>.el-table .el-table__body-wrapper .el-table__row td{
    padding: 0;
    height: 56px;
  }
  >>> .el-table__body tr.current-row>td{
    background-color: rgb(204, 228, 255, .7);
  }
  /* 表格鼠标悬浮时的样式（高亮 浮出） */
  >>> .el-table--enable-row-hover .el-table__body tr:hover {
      -webkit-transform: translateY(-3px);
      -ms-transform: translateY(-3px);
      transform: translateY(-3px);
      -webkit-box-shadow: 0 0 6px #999;
      box-shadow: 0 0 6px #999;
      -webkit-transition: all .5s ease-out;
      transition: all .5s ease-out;
  }
</style>
