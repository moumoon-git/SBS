<template>
<!-- 隐患管理 -->
  <div class="hiddenTroubleClass">
    <el-form style="height:58px" :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <div style="float:left">
        <el-form-item>
          <el-button icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button>
          <el-button @click="deleteHandle()" icon="el-icon-close" :disabled="false">批量删除</el-button>

          <el-dropdown style="margin-left: 10px;">
            <el-button icon="el-icon-printer">导出数据</el-button>
            <el-dropdown-menu slot="dropdown" split-button="true">
              <el-dropdown-item @click.native="exportExcel()">导出已选择数据</el-dropdown-item>
              <el-dropdown-item @click.native="exportExcelAll()">导出所有数据</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </div>

      <div style="float: right;">
        <el-form-item>
          <el-input v-model="dataForm.key" placeholder="请搜索" clearable>
            <i slot="suffix" @click="getDataList()" class="iconfont icon-chaxun"></i>
          </el-input>
        </el-form-item>
      </div>
    </el-form>
     <!-- <div style="height:8px;background: rgb(240, 243, 244);"></div> -->
     <div>
        
     </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dataForm: {
        key: ''
      }
    }
  }
}
</script>

<style>
.hiddenTroubleClass {
}
</style>