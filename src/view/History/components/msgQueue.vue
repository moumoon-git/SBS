<template>
  <el-table
    :data="tableData"
    style="width: 100%;"
    height="340"
    :header-cell-style="{background:'rgba(249,252,255,1)',color:'#black'}"
    >
<!--    <el-table-column-->
<!--      type="selection"-->
<!--      width="50">-->
<!--    </el-table-column>-->
    <el-table-column
      prop="contactor"
      label="姓名"
      width="83">
    </el-table-column>
    <el-table-column
      prop="unit"
      label="单位"
      width="83">
    </el-table-column>
    <el-table-column
      prop="position"
      label="职位"
      width="85">
    </el-table-column>
    <el-table-column
      prop="phone"
      label="号码"
      width="135">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态">
      <template slot-scope="scope">
        <span style="color:#0BD295" v-if="scope.row.status == '发送成功'">{{scope.row.status}}</span>
        <span style="color:#F46666" v-if="scope.row.status == '发送失败'">{{scope.row.status}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="reason"
      label="失败原因">
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    name: "msgQueue",
    props:{
      groupNum:{
        default: "",
      }
    },
    data() {
      return {
        tableData: [],
        // multipleSelection: [],
        failList:[],
      }
    },
    watch:{
      groupNum:function (newVal,oldVal) {
        console.log(newVal)
        this.getData(newVal)
      }
    },
    methods:{
      getData(Val){
        if(Val==''||Val==null||Val==undefined){
          // this.$message({
          //   message: 'groupNum不能为空',
          //   type: "error"
          // });
          this.tableData = []
          return
        }
        let data = {
          groupNum:Val
        }
        this.$api.findSmsGroup(data).then(res=>{
          if (res.errorcode != 0 || !res.data) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            // 数据申请失败则置为空
            this.tableData = []
            this.$emit('failSms',[])
            return
          }

          let data = res.data
          this.tableData = data
          this.failList = []
          this.tableData.forEach(item=>{
            if(item.status == '发送失败'){
              this.failList.push(item)
            }
          })
          this.$emit('failSms',this.failList)
        })
      }

    },
    mounted() {
      this.getData(this.groupNum)
    }
  }
</script>

<style scoped>
  /deep/.el-table th > .cell {
    text-align: center;
    color:#333333
  }
  /deep/.el-table .cell {
    text-align: center;
    max-height: 45px;
    padding: 0;
  }
</style>



