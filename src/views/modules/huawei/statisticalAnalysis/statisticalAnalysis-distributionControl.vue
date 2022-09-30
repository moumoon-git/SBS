<template>
  <div>
    <el-table
      :data="list"
      border
      height="717px"
      @cell-mouse-enter="enterChange"
      highlight-current-row
      ref="multipleTable"
      v-loading="dataListLoading"
    >
      <el-table-column prop="startDate" label="布控开始时间" align="center" sortable></el-table-column>
      <el-table-column prop="name" label="布控名称" align="center"></el-table-column>
      <el-table-column prop="type" label="布控类型" align="center"></el-table-column>
      <el-table-column prop="alarmLevel" label="预警等级" align="center"></el-table-column>
      <el-table-column prop="endDate" label="布控结束时间" align="center"></el-table-column>
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
              <p>布控对象名称</p> 
              <p>布控状态</p>
            </li>
            <li v-for="(item,index) in groupData" :key="index" class="oneGroupData">
                 <p>{{item.name}}</p>
                <p>{{item.enable}}</p> 
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
      groupData: [],//布控对象

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
        url: this.$http.adornUrl("/vcm/vcmManager/SearchSuspect"),
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
         
        } else {
          this.list = [];
          this.total = 0;
        }
        this.dataListLoading = false
      });
    },
     // 移入事件
    show(val){
       val.groupList.map(v => {
          switch (v.enable) {
            case "true":
              v.enable = "启用";
              break;
            case "false":
              v.enable = "禁用";
              break;
          }
        });
        this.groupData = val.groupList
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