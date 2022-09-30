<template>
  <div class="addObject">
    <el-dialog
      title="排查对象选择"
      :visible.sync="dialogFormVisible"
      width="1020px"
      append-to-body
      center
    >
    <div class="outBorder">
        <header>
            <div class="left">
                <div>
                    <ul class="tab">
                        <li v-for="(item,index) in reportType" :key="index" :class="{bgc:idx===index}" @click="idx=index">
                            {{item}}
                        </li>
                    </ul>
                </div>
                <input type="text" class="search" placeholder="姓名、居住地关键字" v-model="key">
            </div>
            <p class="selected">已选{{dataListSelections.length}}人</p>
        </header>
         <el-table :data="dataList" ref="multipleTable" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <!-- <el-table-column prop="id" header-align="center" align="center" label></el-table-column> -->
          <el-table-column prop="imName" header-align="center" align="center" label="姓名" width="120"></el-table-column>
          <el-table-column prop="humanTypeString" header-align="center" align="center" label="人员类型" ></el-table-column>
          <el-table-column prop="detailedAddressString" header-align="center" align="center" label="现居住地址"></el-table-column>
          <el-table-column prop="phone" header-align="center" align="center" label="联系电话" width="140"></el-table-column>
          <el-table-column prop="investigateResultString" header-align="center" align="center" label="状态"></el-table-column>
        </el-table>

        <el-pagination style="margin-left:50%;transform: translateX(-50%);width:100%;"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-size="pageSize"
          :total="totalPage"
          layout="prev, pager, next"
        ></el-pagination>



    </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "addObject",
  props:{
    objectData:{
      type: Array,
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      reportType: ['部门上报','网格上报'],
      idx: 1,
      dataList: [],
      dataListLoading: false,
      //  分页  
      pageIndex: 1,
      pageSize: 5,
      totalPage: 0,
      key: '',
      dataListSelections: []
    };
  },
  mounted() {},
  methods: {
    getDataList(){
        this.dialogFormVisible = true

        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/epi/epiRegister/list'),
          method: 'get',
          params: this.$http.adornParams({
            page: this.pageIndex,
            limit: this.pageSize,
            key: this.key,
            startTime: '',
            endTime: '',
            investigateResult: '',
            humanType: '',
            townName: ''
          })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.data.records
        // console.log( this.dataList)

          this.$nextTick(()=>{
            this.dataList.map(v=>{
              this.objectData.map( item=>{
                if(v.id === item.id){
                  // console.log(this.$refs.multipleTable)
                //这是默认选中上的
                this.$refs.multipleTable.toggleRowSelection(v,true);
              }
              })
            })
          })
          
          this.totalPage = data.data.total
        } else {
          this.dataList = []
          this.totalPage = 0
          this.$message.error(data.msg)
        }
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    submit(){
      this.dialogFormVisible = false
      // console.log(this.dataListSelections)
      this.$emit("getSelections",this.dataListSelections)
    }
  }
};
</script>

<style scoped lang="scss">
.bgc{
    background-color: #c0c0c0;
}
.outBorder{
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px 20px;
    header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left{
            display: flex;
            .tab{
                list-style: none;
                padding: 0;
                display: flex;
                margin-right: 20px;
                li{
                    width: 120px;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    font-size: 20px;
                    border: 1px solid black;
                }
            }
            .search{
                width: 300px;
                height: 40px;
                border-radius: 20px;
                outline: none;
                border: 1px solid #ccc;
                padding-left: 15px;
                &::-webkit-input-placeholder {
                    color: #ccc;
                    text-align: center;
                }
            }
        }
    }
}


/deep/ .el-dialog {
  border-radius: 8px;
  .el-dialog__header {
    background-color: #01a9f2 !important;
    padding: 15px 0;
    border-radius: 8px 8px 0 0;
    font-size: 25px;
    font-weight: bold;
    .el-dialog__headerbtn {
      top: 12px;
      .el-dialog__close {
        color: #d1f9fb;
      }
    }
    span {
      color: #d1f9fb;
    }
  }
}
</style>
