<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" style="position:relative;width:100%;">
      <!-- <el-form-item>
        <el-input v-model="dataForm.key" placeholder="请输入登录页名称、平台名称" clearable></el-input>
      </el-form-item> -->
      <!-- <el-button @click="getDataList()">查询</el-button> -->
      <el-form-item>
        
        <el-button
          v-if="isAuth('sys:platformtype:save')"
          @click="addOrUpdateHandle('')"
        >新增</el-button>
        <!-- <el-button 
          v-if="isAuth('sys:platformtype:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
     <!-- <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column> -->
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="登录页名称">
      </el-table-column>
      <el-table-column
        prop="pname"
        header-align="center"
        align="center"
        label="平台名称">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="描述">
      </el-table-column>
      <el-table-column
        prop="gmtCreate"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
       <el-table-column
        header-align="center"
        align="center"
        label="URL">
          <template slot-scope="scope">
              <span>{{baseUrl + '/#/login?infor=' + scope.row.pageUrl}}</span>
          </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="200"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="preview(scope.row.pageUrl)">预览</el-button>
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination> -->
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./LoginStyle-add-or-update";
export default {
  data() {
    return {
      dataForm: {
        key: ""
      },
      dataList: [],
      // pageIndex: 1,
      // pageSize: 10,
      // totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,

      baseUrl: window.location.origin,
    };
  },
  components: {
    AddOrUpdate
  },
  created() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/sys/sysLoginPage/list"),
        method: "get",
        // params: this.$http.adornParams({
        //   page: this.pageIndex,
        //   limit: this.pageSize,
        //   key: this.dataForm.key
        // })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.data;
          // this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.$message.error(data.msg)
          // this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    deleteHandle(id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
            return item.id;
          });
          // console.log(ids)
      this.$confirm(
        `确定对[id=${ids.join(",")}]进行[${id ? "删除" : "批量删除"}]操作?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl("/sys/sysLoginPage/delete"),
          method: "post",
          data: this.$http.adornData({
            ids,
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: "操作成功",
              type: "success",
              duration: 1500,
              onClose: () => {
                this.getDataList();
              }
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    // 预览
    preview(url){
      window.open(this.baseUrl + '/#/login?infor=' + url,'_blank')
    }
  }
};
</script>
<style lang="less">
.mod-config{
  //表格奇偶行换颜色
  .has-gutter tr>th{
    background:rgba(230,230,230,1);
  
  }
  .el-table th{
      background-color: rgba(230,230,230,1);
  }
  .el-table__body tbody > :nth-child(2n){
    background:rgba(230,230,230,1);
  }
  //弹窗样式
  .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus{
    border: 1px solid #DCDFE6;
  }
  //按钮样式
  .el-button.el-button--medium:hover{
    color: #a3a3a3 !important;
    border-color:rgba(71,157,255,1) !important;
    background: transparent !important;
  }
  .el-form{
    .el-button--danger{
      width:88px;
      background:rgba(255,255,255,1);
      border:1px solid rgba(211,215,219,1);
      border-radius:2px;
      font-size:12px;
      font-family:MicrosoftYaHei;
      font-weight:400;
      color:rgba(162,162,162,1);
    }
    .el-button--primary{  
      width:88px;
      background:rgba(255,255,255,1);
      border:1px solid rgba(211,215,219,1);
      border-radius:2px;
      font-size:12px;
      font-family:MicrosoftYaHei;
      font-weight:400;
      color:rgba(162,162,162,1);
    }
    
    .el-button--default{
      background:linear-gradient(180deg,rgba(71,175,255,1),rgba(71,157,255,1));
      border-radius:3px;
      color: white;
      width:88px;
    }
  }
  
  //修改，删除按钮样式
  .cell{
    .el-button--text{
      font-size:12px;
      font-family:MicrosoftYaHei;
      font-weight:bold;
      color:rgba(118,214,114,1);
    }
    .el-button:last-child{
      font-size:12px;
      font-family:MicrosoftYaHei;
      font-weight:bold;
      color:rgba(230,115,128,1);
    }
  }
    
    .el-tag.el-tag--small.el-tag--light{
      background-color: rgba(64,158,255,.1);
      padding: 0 10px;
      height: 32px;
      line-height: 30px;
      font-size: 12px;
      color: rgba(71,157,255,1)!important;  
      border-radius: 4px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      border: 1px solid rgba(64,158,255,.2);
      white-space: nowrap;
    }
}

</style>

