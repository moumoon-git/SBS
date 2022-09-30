<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%;"
      @row-click = "clickRow"
      :header-cell-style="{background:'rgba(249,252,255,1)',color:'#black'}"
      highlight-current-row>
      <el-table-column
        type="groupNum"
        width="80">
        <template slot-scope="scope">
          <el-radio :label="scope.row.groupNum" v-model="radio" class="textRadio">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="发送类型"
        width="140">
        <template slot-scope="scope">
          <span >{{scope.row.type?scope.row.type:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="发送时间"
        width="155">
        <template slot-scope="scope" >
          <span v-if="scope.row.sendTime">{{scope.row.sendTime.slice(0,10)}}</span><br />
          <span v-if="scope.row.sendTime" style="text-align: left">{{scope.row.sendTime.slice(10)}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <!--    <el-table-column-->
      <!--      prop="address"-->
      <!--      label="发送状态"-->
      <!--      width="124">-->
      <!--    </el-table-column>-->
      <el-table-column
        prop="total"
        label="收信人数"
        width="145">
        <template slot-scope="scope">
          <span >{{scope.row.total?scope.row.total:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="成功"
        width="110">
        <template slot-scope="scope">
          <span style="color:#0BD295;">{{scope.row.success?scope.row.success:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="失败"
        width="110">
        <template slot-scope="scope">
          <span style="color:#F46666">{{scope.row.failed?scope.row.failed:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="短信内容"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span style="white-space: nowrap">{{scope.row.content?scope.row.content:'-'}}</span>
        </template>
      </el-table-column>
    </el-table>
<!--    <el-pagination v-if="totalElements>=10" background layout="prev, pager, next" :total="totalElements"-->
<!--                   :current-page.sync="selectPage"  @current-change="box_lookup"></el-pagination>-->
  </div>
</template>

<script>
  export default {
    name: "sendHistory",
    props:['sendTable','size'],
    data() {
      return {
        tableData: [],
        multipleSelection: [],
        totalElements:0,
        radio:'',
        rowActived: {},
        selectPage:1,
      }
    },
    watch:{
      //点击搜索时执行
      sendTable:function (newVal, oldVal) {
        this.tableData = this.sendTable.data
        // console.log(this.tableData[0])
        if(this.tableData[0]){
          this.radio = this.tableData[0].groupNum
        }

      },
      radio:function (newVal,oldVal) {
        this.tableData.forEach((val,index) => {
          if (val.groupNum === newVal) {
            this.$emit('changeSMS',newVal,val)
            this.rowActived = val
          }
        })
        // this.$emit('changeSMS',newVal,this.rowActived)
        // console.log('rowActived',newVal, this.rowActived)
      }
    },
    created() {

    },
    methods:{
      // handleSelectionChange(val) {
      //   this.multipleSelection = val;
      //   console.log(this.multipleSelection)
      // },
      initData() {
        let data = {
          startTime: '',
          endTime: '',
          type: 0,
          searchText: '',
          page: 1,
          size: this.size,
        };
        this.$api.smsSendRecord(data).then((res) => {
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
          this.$nextTick(()=>{
            let data = res.data
            this.totalElements = data.totalElements
            this.tableData = data.data
            if(this.tableData[0]){
              this.rowActived = this.tableData[0]
              this.radio = this.rowActived.groupNum
            }

          })
        })

      },
      clickRow(row,col){
        // this.radio = row.groupNum
        if(this.radio != row.groupNum){
          this.radio = row.groupNum
          this.rowActived = row
          this.$emit('changeSMS',this.radio,row)
          // console.log(this.radio)
        }
      },
      box_lookup(page){
        let data = {
          startTime: '',
          endTime: '',
          type: 0,
          searchText: '',
          page: page,
          size: 10,
        };
        this.$api.smsSendRecord(data).then((res) => {
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
          this.$nextTick(()=>{
            let data = res.data
            this.totalElements = data.totalElements
            this.tableData = data.data
            if(this.tableData[0]){
              this.rowActived = this.tableData[0]
              this.radio = this.rowActived.groupNum
            }

          })
        })
      }
    },
    mounted() {
      this.$emit("lookup", 1)
    },
  }
</script>

<style scoped>
  /deep/.el-table th > .cell {
    /*text-align: center;*/
    color:#333333;
  }
  /deep/.el-table .cell {
    /*text-align: center;*/
  }
  .el-pagination{
    text-align: right;
  }
  >>>.el-table .el-table__body-wrapper .el-table__row td{
    padding: 0;
    height: 25px;
  }
  /deep/ .el-table__body tr.current-row>td{
    background-color: rgb(204, 228, 255, .7);
  }
  /* 表格鼠标悬浮时的样式（高亮 浮出） */
  /deep/ .el-table--enable-row-hover .el-table__body tr:hover {
      -webkit-transform: translateY(-3px);
      -ms-transform: translateY(-3px);
      transform: translateY(-3px);
      -webkit-box-shadow: 0 0 6px #999;
      box-shadow: 0 0 6px #999;
      -webkit-transition: all .5s ease-out;
      transition: all .5s ease-out;
  }
</style>
