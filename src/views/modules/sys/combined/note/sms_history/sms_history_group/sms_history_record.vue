<template>
  <div class="all">
    <div class="send">
      <div class="title">短信记录</div>
    </div>

    <el-table :data="list" border style="width: 100%;height:657px" 
      @current-change="currentChange"
      highlight-current-row
      ref='multipleTable'>
      <el-table-column prop="content" label="短信内容" align="center"></el-table-column>
      <el-table-column prop="createTime" label="发送时间" align="center"></el-table-column>
    </el-table>
    <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="page"  
                :page-sizes="[5, 30, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next"
                :total="total"
                class="pagination"
                style="background-color: white;">
            </el-pagination>

  </div>
</template>

<script>
import Bus from '@/views/common/js/eventBus'
export default {
  // props:['list'],
  name: "sms_history_contact",
  components: {},
  data() {
    return {
      page: 1,
      pageSize: 5,
      list: [],
      total: 0,
      oneMobileData: '',
      startTime: '',
      endTime: ''
    };
  },
  created() {
    this.initGroup()
    Bus.$on('initGroup',()=>{
      this.initGroup()
    })
  },
  computed: {
    // ...mapState(['content']),
    // 存储转发数据
    forwardData: {
      get() {
        return this.$store.state.user.forward;
      },
      set(value) {
        this.$store.commit("user/updateSMSForward", value);
      }
    }
  },
  methods: {
    // 初始化所有联系人和信息数据   
      initGroup(startTime,endTime){
        this.startTime = startTime
        this.endTime = endTime
        this.$http({
          url: this.$http.adornUrl("/message/messageinfor/getMessageByDoWay"),
          method: "get",
          params: this.$http.adornParams({
            page: this.page,
            limit: this.pageSize,
            doWay: 0,
            startTime: this.startTime,
            endTime: this.endTime
          })
        }).then(({ data }) => {
          // console.log("getDataList+++++++++++++++++++++++++++++++++++++++++++++++",data);
          if (data && data.code === 0) {
              this.list = data.page.list
              this.total = data.page.totalCount
              this.$refs.multipleTable.setCurrentRow(this.list[0])
              this.forwardData = this.list[0]
        } else {
          this.list = []
          this.total = 0
          this.$message.error(data.msg)
        }
        });
      },
      // 点击联系人获取对应信息  
      currentChange(row){
        Bus.$emit('upDateGroupList',row)
        Bus.$emit('getContent',row)
        Bus.$emit('getRow',row)
        this.forwardData = row
      },
       // 每页数
       handleSizeChange(val) {
        this.pageSize = val
        this.page = 1
        this.initGroup(this.startTime,this.endTime)
      },
      // 当前页   
      handleCurrentChange(val) {
        this.page = val
        this.initGroup(this.startTime,this.endTime)
      }
  }
};
</script>
<style lang="scss" scoped>
.send {
  height: 50px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  line-height: 50px;

  .title {
    font-size: 18px;
    padding-left: 10px;
  }
  .sendOut {
    height: 35px;
    line-height: 35px;
    background-color: brown;
    margin: 8px 20px 0;
    font-size: color;
    border: none;
  }
}

.all{
    position: relative;
    margin-right: 5px;
    background-color: white;
    margin-top: 5px;  
    .pagination{
        width: 100%;
        height: 50px;
        padding-top: 12px;
        background-color: #ddd;
        margin-right: 10px;
        position: absolute;
        bottom: 0;
        left: 0;
    }
}
</style>
