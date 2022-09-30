<template>
  <div class="mod-log">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="用户名／用户操作" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%">
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        width="80"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="用户名"
        width="100"
        >
      </el-table-column>
      <el-table-column
        prop="operation"
        align="center"
        label="用户操作"
        >
      </el-table-column>
      <el-table-column
        prop="method"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="请求方法">
      </el-table-column>
      <el-table-column
        prop="params"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="请求参数">
      </el-table-column>
      <el-table-column
        prop="time"
        header-align="center"
        align="center"
        label="执行时长(毫秒)"
        width="130">
      </el-table-column>
      <el-table-column
        prop="ip"
        header-align="center"
        align="center"
        width="150"
        label="IP地址">
      </el-table-column>
      <el-table-column
        prop="createDate"
        header-align="center"
        align="center"
        width="180"
        label="创建时间">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        selectionDataList: []
      }
    },
    created () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/log/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
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
      }
    }
  }
</script>
<style lang="less" scoped>
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
    .el-button--default{
      background:linear-gradient(180deg,rgba(71,175,255,1),rgba(71,157,255,1));
      border-radius:3px;
      color: white;
      width:88px;
    }
  }
  
  //修改，删除按钮样式
  .cell{
    .el-button--text:first-child{
      background-color: transparent;
      border: none;
      font-size:12px;
      font-family:MicrosoftYaHei;
      font-weight:bold;
      color:rgba(118,214,114,1);
    }
    .el-button--text:last-child{
      background-color: transparent;
      border: none;
      font-size:12px;
      font-family:MicrosoftYaHei;
      font-weight:bold;
      color:rgba(230,115,128,1);
    }
  }
    
</style>
