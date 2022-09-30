<template>
  <el-table
    :data="dataList"
    border
    style="width: 100%;
          margin-top: 20px">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      prop="id"
      header-align="center"
      align="center"
      width="60"
      label="ID">
    </el-table-column>
    <el-table-column
      prop="planName"
      header-align="center"
      align="center"
      width="320"
      label="预案名称">
    </el-table-column>
    <el-table-column
      prop="publishUnit"
      header-align="center"
      align="center"
      width="220"
      label="发布单位">
    </el-table-column>
    <el-table-column
      prop="version"
      header-align="center"
      align="center"
      :show-overflow-tooltip="true"
      label="版本号">
    </el-table-column>
    <el-table-column
      prop="publishDate"
      header-align="center"
      align="center"
      width="160"
      label="发布时间">
    </el-table-column>


    <el-table-column
      fixed="right"
      header-align="center"
      align="center"
      width="250"
      label="操作">
      <template slot-scope="scope">
        <el-button v-if="isAuth('sys:platform:update')" type="info" size="mini"
                   @click="addOrUpdateHandle(scope.row.id)">查看
        </el-button>
        <el-button v-if="isAuth('sys:platform:update')" type="primary" size="mini"
                   @click="addOrUpdateHandle(scope.row.id)">修改
        </el-button>
        <el-button v-if="isAuth('sys:platform:delete')" type="danger" size="mini"
                   @click="deleteHandle(scope.row.id)">删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

</template>

<script>
  export default {
    props:['dataList']
  }
</script>

<style scoped>

</style>
