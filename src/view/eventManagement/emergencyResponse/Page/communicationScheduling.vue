<template>
  <div class="block">
        <el-row>
          <el-col :span="16">
            <div class="contentStyle">
              <el-main>
                <el-row>
                  <el-col :span="12">
                    <el-input
                        :placeholder="placeholder"
                        prefix-icon="el-icon-search"
                        class="searchInput"
                        v-model="searchText"
                        clearable
                    ></el-input>
                  </el-col>
                  <el-col :span="2">
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                  </el-col>
                </el-row>
                <div class="tableContainer" style="height:596px">
                  <el-table ref="singleTable" :data="tableData" highlight-current-row
                            :header-cell-style="{background:'#E6E6E6',color:'#606266'}"
                            height="550px"
                            @row-click="handleClick"
                  >
                    <el-table-column type="index" min-width="50" :resizable="false"></el-table-column>
                    <el-table-column min-width="100" v-for="(item,key) in tableColumn" :key="key" :label="item.label"
                                     :prop="item.prop"
                                     :width="item.width" :resizable="false"></el-table-column>
                  </el-table>
                  <el-pagination class="pagination" :page-size="pageSize" :page-sizes="[10,20,30,40]" :total="total"
                                 :current-page="currentPage"
                                 @current-change="handleCurrentChange"
                                 @size-change="handleSizeChange"
                                 :small="true"
                                 layout="total, prev, pager, next, sizes, jumper" width="100"></el-pagination>
                </div>
              </el-main>
            </div>
          </el-col>
          <el-col :span="8">
            <div style="margin-top: 20px;padding-right:20px;">
              <el-tabs type="border-card"  v-model="selectTab">
                <el-tab-pane label="电话">
                  <phone-check ref="phoneCheck" :dialPerson="currentRow"></phone-check>
                </el-tab-pane>
                <el-tab-pane label="短信">
                  <note-check ref="noteCheck"></note-check>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-col>
        </el-row>
  </div>
</template>

<script>
  import noteCheck from "@/view/eventManagement/emergencyResponse/Plan/noteCheck"
  import phoneCheck from "@/view/eventManagement/emergencyResponse/Plan/phoneCheck"

  export default {
    name: "communicationScheduling",
    props: ['personInfo','type'],
    components: {noteCheck, phoneCheck},
    data() {
      return {
        tableColumn: [{
          label: "姓名",
          prop: "name",
        }, {
          label: "单位",
          prop: "workUnit",
        }, {
          label: "职务",
          prop: "position",
        }, {
          label: "通讯方式",
          prop: "mobile",
        }],//表头
        pageSize: 10,//每页大小
        currentPage: 1,//当前页
        total: 0, //总页数
        searchText: "",
        placeholder:"输入姓名/单位/职务/号码",
        tableData: [],
        currentRow: {},//选中的组织架构人员
        selectTab: 0//选中的电话/短信tab
      }
    },
    methods: {
      getTableData() {
        //接口未完成
        if (this.personInfo.id === 0 && this.personInfo.name === '组织架构') {
          let eventId = sessionStorage.getItem('newID');
          if (eventId == '' || eventId == null || eventId == undefined ||eventId=='newID') return
          let data = {
            eventId,
            page: this.currentPage,
            size: this.pageSize,
            key:this.searchText
          }
          this.$api.responseSearch(data).then(res => {
            if (res.errorcode != 0) {
              this.$message({
                message: '该节点没有相关人员',
                type: "error"
              });
              this.tableData = [];
              this.total = 0;
              return
            }
            this.tableData = res.data.data;
            this.total = res.data.totalElements;
          })
        }else{
          let data = {
            structId: this.personInfo.id,
            page: this.currentPage,
            size: this.pageSize,
            key:this.searchText
          }
          this.$api.responseSearch(data).then(res => {
            if (res.errorcode != 0) {
              this.$message({
                message: '该节点没有相关人员',
                type: "error"
              });
              this.tableData = [];
              this.total = 0;
              return
            }
            this.tableData = res.data.data;
            this.total = res.data.totalElements;
          })
        }
      },
      //页数改变
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getTableData();
      },
      //每页条数改变
      handleSizeChange(val) {
        this.pageSize = val;
        this.getTableData();
      },
      handleClick(item) {
        console.log(this.selectTab)
        this.currentRow = {}
        this.$nextTick(() => {
          if (this.selectTab == '0') {
            this.currentRow = item
          }else{
            this.$refs.noteCheck.get(item);
          }
        })
      },
      handleSearch() {
        this.getTableData()
      }
    },
    watch:{
      personInfo:{
        handler(){
          if (this.type !== '通讯调度') return;
            if (this.personInfo.mobile) {
              return
            }
            this.getTableData()
        },
        deep:true
      }
    }
  }
</script>

<style scoped>
  .tableContainer {
    padding: 6px;
    margin-top: 10px;
    border: 1px solid rgba(211, 215, 219, 1);
  }
  .pagination {
    margin-top: 16px;
    padding: 0;
  }
  >>> .el-pagination__jump {
    margin-left: 0;
  }
</style>
