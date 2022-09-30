<template>
  <div class="addObject">
    <el-dialog
      title="排查对象选择"
      :visible.sync="dialogFormVisible"
      width="738px"
      append-to-body
      border
    >
    <div class="outBorder">
        <header>
            <div class="left">
                <div>
                    <!-- <ul class="tab">
                        <li v-for="(item,index) in reportType" :key="index" :class="{bgc:idx===index}" @click="idx=index">
                            {{item}}
                        </li>
                    </ul> -->
                </div>
                <!-- <input type="text" class="search" placeholder="姓名、居住地关键字" v-model="key"> -->
            </div>
            
        </header>
         <el-table :data="dataList" ref="multipleTable" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <!-- <el-table-column prop="id" header-align="center" align="center" label></el-table-column> -->
          <el-table-column prop="imName" header-align="center" align="center" label="姓名" width="80"></el-table-column>
          <el-table-column prop="humanTypeString" header-align="center" align="center" label="人员类型" ></el-table-column>
          <el-table-column prop="detailedAddressString" header-align="center" align="center" label="现居住地址"></el-table-column>
          <el-table-column prop="phone" header-align="center" align="center" label="联系电话" width="160"></el-table-column>
          <el-table-column header-align="center" align="center" label="状态" width="90">
            <template slot-scope="scope">
              <span :style="{color:scope.row.investigateResultString==='正常'?'#0BD295':'#F85B47'}">{{scope.row.investigateResultString}}</span>
            </template>
          </el-table-column>
        </el-table>

      <div class="paging">  
        <span class="selected">已选{{dataListSelections.length}}人</span>
        <el-pagination
            style="margin-left:50%;transform: translateX(-50%);width:100%;"
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-size="pageSize"
            :page-sizes="[5, 10, 20, 50]"
            :total="totalPage"
            layout="prev, pager, next, sizes, jumper"
          ></el-pagination>
      </div>



    </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button @click="submit" class="save">确 定</el-button>
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
                this.$refs.multipleTable.toggleRowSelection(v);
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
    background-color: #3F92FE;
    color:white;
    border:1px solid #3F92FE;
}
.outBorder{
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
                border-radius: 3px;
                li{
                    width:103px;
                    height:40px;
                    line-height: 40px;
                    text-align: center;
                    font-size: 12px;
                    border:1px solid rgba(221,222,225,1);
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
    .paging {
      margin-top: 10px;
      .selected{
        color: #999;
      }
    }
}


/deep/ .el-dialog {
  border-radius: 5px;
  box-shadow:0px 0px 15px 2px rgba(0,0,0,0.27);
  .el-dialog__header {
    background-color: rgba(241,244,246,1) !important;
    border-radius: 8px 8px 0 0;
    height: 40px;
    line-height: 40px;
    .el-dialog__headerbtn {
      top: -4px;
      font-size: 20px;
      .el-dialog__close {
        color: rgba(173,182,194,1);
        vertical-align: sub;
      }
    }
    span {
      color: #333333;
      padding-left: 20px;
      font-size:13px;
    }
  }
  .el-dialog__body{
    padding: 20px 20px 10px;
    border-bottom: 1px solid #E9ECF1;
  }
  .el-dialog__footer{
    padding: 15px 20px;
  }
}
/deep/ .el-pagination{
  margin-left: 68%;
  margin-top: -3%;
}
// 表格外框样式
/deep/  .el-table--fit{
  border: 1px solid #F2F2F2;
  border-bottom: none;
}
// 表格头部背景样式
/deep/ .el-table th{
  background-color: #F9FCFF;
}
// 分页居右显示
/deep/ .el-pagination{
  justify-content: flex-end;
}
// 页数选中效果
/deep/ .el-pager li.active{
  color: #0091ff;
}
// 页数之间的样式
/deep/ .el-pager li {
  min-width: 25px;
}
// 上、下页按钮样式
/deep/ .el-pagination button, .el-pagination span:not([class*=suffix]) {
  min-width: 25px;
}
// 上一页样式
/deep/ .el-pagination .btn-next{
  padding-left: 0;
}
// 上一页样式
/deep/ .el-pagination .btn-prev{
  padding-right: 0;
}
// 表格内边框样式
/deep/ .el-table td, .el-table th,.el-table--border, .el-table--group{
  border-color: #F2F2F2; 
}
// 表格页尺寸样式
/deep/ .el-pagination .el-select .el-input{
  margin: 0 5px 0 3px;
}
// 当前页样式
/deep/ .el-pagination__editor{
  margin: 0 2px 0 5px;
}
</style>
