<!--
 * @author: author
 * @date: date
 * @version: version
 * @lastEditors: lastEditors
 * @lastEditTime: lastEditTime
 * @descripttion: descripttion
-->
<template>
  <el-container>
    <el-header
      style="height: 80px;display: flex;align-items: center;border-top: 15px solid #ebeef5;"
    >
      <el-row :gutter="20" style="width:100%;">
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-printer" style="width:100%;">新传真</el-button>
        </el-col>
        <el-col style="width:initial;">
          <el-radio-group v-model="tabPosition">
            <el-radio-button label="突发事件"></el-radio-button>
            <el-radio-button label="三防响应"></el-radio-button>
            <el-radio-button label="领导批示"></el-radio-button>
            <el-radio-button label="通知及其它"></el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="5">
          <el-date-picker
            style="width:100%;"
            v-model="dateRage"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-col>
        <el-col :span="5">
          <el-input
            placeholder="请输入关键字内容"
            v-model="searchKey"
            class="input-with-select"
            style="width:100%;"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-main style="background:pink;">
        <el-table :data="tableData" style="width: 100%" height="600px">
          <el-table-column prop="date" label="来信时间" width="180"></el-table-column>
          <el-table-column prop="name" label="来信单位" width="180"></el-table-column>
          <el-table-column prop="address" label="来信号码"></el-table-column>
          <el-table-column prop="address" label="状态"></el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="tableConfig.currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="tableConfig.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableConfig.total"
        ></el-pagination>
      </el-main>
      <el-aside width="35%" style="background:yellow;">Aside</el-aside>
    </el-container>
  </el-container>
</template>

<script>
export default {
    data() {
        return {
            tabPosition: 'left',
            dateRage: [],
            searchKey: '',
            tableData: [],
            tableConfig: {
                currentPage: 1,
                pageSize: 10,
                total: 1,
            },
        };
    },
    components: {},
    props: [],
    mounted() {},
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
    },
};
</script>
<style lang="less" scoped>
.el-tabs__content {
    overflow: initial;
}
</style>