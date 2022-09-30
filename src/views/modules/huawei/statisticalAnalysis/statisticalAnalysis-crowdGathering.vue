<template>
  <div>
    <el-table
      :data="list"
      border
      height="717px"
      highlight-current-row
      ref="multipleTable"
      v-loading="dataListLoading"
    >
      <el-table-column prop="createdAt" label="创建时间" align="center" sortable></el-table-column>
      <el-table-column prop="taskName" label="卡口名称" align="center"></el-table-column>
      <el-table-column prop="edgeRestartTimes" label="边缘起点" align="center"></el-table-column>
      <el-table-column prop="updatedAt" label="更新时间" align="center"></el-table-column>
      <el-table-column prop="serviceVersion" label="版本号" align="center"></el-table-column> 
      <el-table-column prop="state" label="状态" align="center"></el-table-column>
      <el-table-column  label="操作" align="center">
          <template slot-scope="scope">
            <span @mouseenter="show(scope.row)" @mouseleave="hide">详情</span>
          </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[15, 30, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
      class="pagination"
      style="background-color: white;"
    ></el-pagination>

     <!-- 鼠标事件 -->
    <div v-if="groupView" style="width:500px;position:absolute;left:calc( 50% - 250px );top:20%;">
        <ul class="groupData">
            <li class="oneGroupData">
              <p>输入列表</p> 
            </li>
            <li v-for="(item,index) in inputData" :key="index" class="oneGroupData">
                 <p>类型</p>
                <p>{{item}}</p> 
            </li>
            <li class="oneGroupData">
              <p>输出列表</p> 
            </li>
            <li v-for="(item,index) in outputData" :key="index" class="oneGroupData">
                 <p>webhook</p>
                 <div>
                    <span>url：</span> <span>{{item.url}}</span> 
                 </div>
            </li>
        </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      pageSize: 15,
      list: [],
      total: 0,

      groupView: false,
      inputData: {},//输入列表
      outputData: {},//输出列表

      dataListLoading: false,
    };
  },
  created(){
      this.init()
  },
  methods: {
    init() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl("/vcm/vcmManager/searchCrowdcountEdge"),
        method: "get",
        params: this.$http.adornParams({
          page: this.page,
          limit: this.pageSize,
        })
      }).then(({ data }) => {
        // console.log(
        //   "getDataList+++++++++++++++++++++++++++++++++++++++++++++++",
        //   data
        // );

        if (data && data.code === 0) {
          this.list = data.data.list;
          this.total = data.data.totalCount;
            this.list.map(v => {
              switch (v.state.toLowerCase()) {
                case "abnormal":
                  v.state = "紧急";
                  break;
              }
              v.createdAt = v.createdAt.replace('T',' ')
              v.createdAt = v.createdAt.replace('Z','')
              v.updatedAt = v.createdAt.replace('T',' ')
              v.updatedAt = v.createdAt.replace('Z','')
              // console.log(v.createdAt)
            });
        } else {
          this.list = [];
          this.total = 0;
        }
        this.dataListLoading = false
      });
    },
    // 移入事件
    show(val){
        this.inputData = val.input
        // console.log(this.inputData)
        this.outputData = val.output
        this.groupView = true
    },
    hide(){
      this.groupView = false
    },
     // 每页数
    handleSizeChange(val) {
      this.pageSize = val;
      this.page = 1;
      this.init();
    },
    // 当前页
    handleCurrentChange(val) {
      this.page = val;
      this.init();
    },
  }
};
</script>

<style lang="scss" scoped>
.groupData{
    list-style: none;
    padding: 0;
    height: 300px;
    border: 1px solid #ccc;
    background-color: white;
    .oneGroupData{
        display: flex;
        padding: 10px;
        border-bottom: 1px solid #ccc;
        p{
          flex: 1;
        }
    }
}
</style>