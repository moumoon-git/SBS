<template>
  <div style="position:relative;">
    <el-table
      :data="list"
      border
      height="717px"
      highlight-current-row
      ref="multipleTable"
      v-loading="dataListLoading"
    >
      <el-table-column prop="createTime" label="创建时间" align="center" sortable></el-table-column>
      <el-table-column prop="name" label="姓名" align="center"></el-table-column>
      <el-table-column prop="gender" label="性别" align="center"></el-table-column>
      <el-table-column prop="credentialNumber" label="身份证号" align="center"></el-table-column>
      <el-table-column prop="peopleId" label="人员Id" align="center"></el-table-column>
      <el-table-column prop="faceList[0].fileId" label="文件Id" align="center"></el-table-column>
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
      :page-sizes="[15, 20, 30, 50]"
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
              <p>人脸黑名单组名</p> 
              <p>人脸黑名单组Id</p>
            </li>
            <li v-for="(item,index) in groupData" :key="index" class="oneGroupData">
                <p>{{item.groupName}}</p> 
                 <p>{{item.groupId}}</p>
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

      groupView: false,//组试图
      groupData: [],//当前组数据

      dataListLoading: false
    };
  },
  created(){
      this.init()
  },
  methods: {
    init() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl("/vcm/vcmManager/searchBwdata"),
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
              switch (v.gender) {
                case "0":
                  v.gender = "男";
                  break;
                case "1":
                  v.gender = "女";
                  break;
              }
            });
        } else {
          this.list = [];
          this.total = 0;
        }
        this.dataListLoading = false
      });
    },
    show(val){
      this.groupData = val.group
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