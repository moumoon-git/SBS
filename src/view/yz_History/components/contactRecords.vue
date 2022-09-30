<template>
  <div>
    <el-table
      :data="tableData"
      ref="refTable2"
      :header-cell-style="{background:'rgba(249,252,255,1)',color:'black'}"
      style="width: 100%"
      @row-click="clickRow"
      @select="selectRow"
      @select-all="selectAll"
      highlight-current-row
    >
      <!-- <el-table-column type="selection" width="50" v-if="tableConfig.selection"></el-table-column> -->
      <el-table-column prop="name" label="姓名" width="120"></el-table-column>
      <el-table-column prop="workUnit" label="单位">
        <template slot-scope="scope">
          <span>{{scope.row.workUnit?scope.row.workUnit:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="position" label="职位">
        <template slot-scope="scope">
          <span>{{scope.row.position?scope.row.position:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="number" label="号码" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.number?scope.row.number:'-'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--    <el-pagination background layout="prev, pager, next" :total="totalElements"></el-pagination>-->
  </div>
</template>

<script>
import { getContacts } from '@/assets/interface/interface';

export default {
    name: 'contactRecords',
    props: ['sendTable', 'size', 'tableConfig'],
    watch: {
        sendTable: function(newVal) {
            this.tableData = this.sendTable.data;
            this.totalElements = this.sendTable.totalElements;
            this.totalPages = parseInt(this.sendTable.totalPages);
        },
    },
    data() {
        return {
            tableData: [],
            totalElements: 0,
        };
    },
    methods: {
        /** 
         * @author qinjiaqi
         * @date 2020-01-13
         * @param {type} 没有
         * @return {type} undefined
         * @description：翻页滚动条自动回到顶部
        */  
        changePage() {
          this.$nextTick(()=>{
            this.$refs.refTable2.$el.parentNode.scrollTop=0
          })
        },
        selectRow(rows) {
            console.log('selectRow', rows);
            this.$emit('selectrow', rows);
        },
        selectAll(rows) {
            console.log('selectAll', rows);
            this.$emit('selectallrow', rows);
        },
        initData() {
            let data = {
                startTime: '',
                endTime: '',
                searchText: '',
                page: 1,
                size: this.size,
            };
            this.$api.getContacts(data).then(res => {
                // 返回的数据赋值给table
                if (res.errorcode != 0 || !res.data) {
                    this.totalElements = 0;
                    this.tableData = [];
                    this.$message({
                        message: res.msg,
                        type: 'error',
                    });
                    return;
                }
                this.$nextTick(() => {
                    let data = res.data;
                    this.totalElements = data.totalElements;
                    this.tableData = data.data;
                    this.$emit('changeCon', this.tableData[0]);
                });
            });
        },
        clickRow(row) {
            this.$emit('changeCon', row);
        },
    },
    mounted() {
        this.$emit('lookupContacts', 1);
    },
};
</script>

<style scoped>
/deep/.el-table th > .cell {
    text-align: center;
}
/deep/.el-table .cell {
    text-align: center;
}
.el-pagination {
    text-align: right;
}
>>> .el-table__body tr.current-row>td{
  background-color: rgb(204, 228, 255, .7);
}
/* 表格鼠标悬浮时的样式（高亮 浮出） */
>>> .el-table--enable-row-hover .el-table__body tr:hover {
    -webkit-transform: translateY(-3px);
    -ms-transform: translateY(-3px);
    transform: translateY(-3px);
    -webkit-box-shadow: 0 0 6px #999;
    box-shadow: 0 0 6px #999;
    -webkit-transition: all .5s ease-out;
    transition: all .5s ease-out;
}
</style>
