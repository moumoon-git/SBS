<template>
  <div class="response">
    <el-dialog
      title="响应情况查看"
      :visible.sync="dialogVisible"
      width="750px"
      :close-on-click-modal="false"
      :before-close="closeDialog"
    >
      <el-row style="padding:20px 0px 10px 20px;">
        <el-col :span="10">
          <el-input
            placeholder="请输入关键字"
            v-model="key"
            class="input-with-select"
            size="medium"
            @keyup.enter.native="search"
          ></el-input>
        </el-col>
        <el-col :span="3">
          <el-select v-model="value" placeholder="状态" size="medium">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" size="medium" @click="search">搜索</el-button>
        </el-col>
      </el-row>
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        height="600px"
        :header-cell-style="{background:'rgba(249,251,255,1)',color:'#333'}"
      >
        <el-table-column
          min-width="120"
          v-for="(item,key) in tableColumn"
          :key="key"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          :resizable="false"
        ></el-table-column>

        <el-table-column min-width="80" :resizable="false" label="状态" style="padding-left: 15px;">
          <template slot-scope="scope">
            <span
              :style="{color:scope.row.affairsContactorConfirm==0?'#FF977A':'#0091FF'}"
            >{{scope.row.affairsContactorConfirm==0?"未确认":scope.row.affairsContactorConfirm==1?"已确认":""}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="160" label="确认时间" prop="affairsContactorConfirmTime" :resizable="false"></el-table-column>
        <el-table-column width="60" :resizable="false" label="操作" style="padding-left: 15px;">
          <template slot-scope="scope">
            <span v-if="scope.row.affairsContactorConfirm==1">-</span>
            <span v-else class="cellPhoneImg" @click="callPhoneAssign(scope.row)"></span>
          </template>
        </el-table-column>
      </el-table>

      <div class="framework_right_footer">
        <span > <span style="margin:0 10px">/</span> {{totalPages}}</span>
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/assets/api/api'

export default {
  name: "response",
  props:{
      responseId:{
          type: Number
      }
  },
  computed:{
    totalPages(){
      return this.total>0?this.total/this.pageSize>1?Math.ceil(this.total/this.pageSize):1:0
    }
  },
  data() {
    return {
      dialogVisible: true,
      total: 0, //数据总数
      currentPage: 1, //当前页
      pageSize: 10, //每页条数
      key:"",
      tableColumn: [
        {
          label: "人员",
          prop: "appContactorName"
        },
        {
          label: "部门",
          prop: "appContactorWorkUnit"
        },
        {
          label: "职务",
          prop: "appContactorPosition"
        }
      ], //表头
      options: [
        {
          value: "0",
          label: "未确认"
        },
        {
          value: "1",
          label: "确认"
        }
      ],
      tableData:[],
      value: "",
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
      //表格数据
    getTableData() {
      let params = {
        id: this.responseId,
        page: (this.currentPage-1) * this.pageSize,
        size: this.pageSize,
        key: this.key,
        statu: this.value,
      };
        console.log('params: ', params);
      // if (this.searchText != "") {
      //   data.searchText = this.searchText;
      // }
      // this.$api.seeResponse(params)
      axios({ //备忘录，查找表格
        url: window.SITE_CONFIG['event'] + '/app/sjs/affairs/seeResponse',
        method: 'get',
        params
      })
      .then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          this.tableData = []
          this.total = 0
          return;
        }
        this.tableData = res.data.appSjsAffairsContacotrVos;
        this.total = res.data.conutAll;
        //默认显示第一条数据
        // this.$nextTick(() => {
        //   if (this.tableData.length !== 0) {
        //     this.$refs.TableDetails.showData(res.data.data[0]);
        //     this.rowData = res.data.data[0];
        //   } else {
        //     this.$refs.TableDetails.showData(null);
        //   }
        // });
      }).catch(()=>{
          this.tableData = []
          this.total = 0
      })
    },
    //页数改变
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableData();
    },
    // 关闭弹窗
    closeDialog(){
        this.$emit('closeDialog')
    },
    // 拨打默认电话
    callPhoneAssign(item) {
      console.log('item: ', item);
      let data = {
        affairsId: this.responseId,
        contactorId: item.appContactorId,
      }
      // this.$api.chasing({data})
      axios({ //备忘录，查找表格
        url: window.SITE_CONFIG['event'] + '/app/sjs/affairs/call',
        method: 'post',
        data:{data},
      })
      .then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.$message.success("追呼成功")
        this.dialogVisible = false
      })
    },
    search(){
      this.currentPage = 1
      this.getTableData()
    }
  }
};
</script>

<style lang="scss" scoped>
.response .cellPhoneImg{
  display: inline-block;
  width: 22px;
  height: 25px;
  background: url("../../../../static/img/Communihistory/cell.png") no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}
.response .cellPhoneImg:hover {
  background: url("../../../../static/img/Communihistory/cell1.png") no-repeat;
  background-size: 100% 100%;
}
/deep/ .el-dialog__header {
  background-color: #f1f4f6;
  border-radius: 5px 5px 0px 0px;
  padding: 10px 0 10px 20px;
  text-align: left;
}
/deep/ .el-dialog__title {
  color: #333;
  font-size: 15px;
}
/deep/ .el-dialog__headerbtn {
  top: 12px;
  font-size: 20px;
}
/deep/ .el-dialog__headerbtn .el-dialog__close {
    color: #ADB6C2;
}
/deep/ .el-dialog__body {
  padding: 0 0 10px;
}

.framework_right_footer {
  position: relative;
  margin: 10px 0 5px;
}

.framework_right_footer > span {
  position: absolute;
  z-index: 100;
  top: 6px;
  bottom: 0;
  left: 51.5%;
  margin: auto;
}
/deep/ .el-pager > li {
    display: none !important;
  }

/deep/ .el-pager > li:last-child {
display: block;
text-align: right;
}

/deep/ .el-pager {
width: 95px;
overflow: hidden;
z-index: 99;
position: relative;
}
/deep/ .el-pagination {
  position: relative;
}

/deep/ .el-pagination__jump {
  font-size: 0 !important;
  position: absolute;
  top: 4px;
  left: 39.5%;
  height: 25px !important;
  z-index: 100;
}

/deep/ .el-pagination .btn-next .el-icon,
/deep/ .el-pagination .btn-prev .el-icon {
  font-size: 18px;
}


/deep/ .el-pagination .btn-prev {
  position: absolute;
  z-index: 99;
  left: 39%;
}
/deep/ .el-pagination .btn-next {
  position: absolute;
  z-index: 99;
  right: 39%;
}

/deep/ .el-pagination__jump .el-pagination__editor.el-input,
/deep/ .el-pagination__jump .el-pagination__editor.el-input .el-input__inner {
  width: 57px;
  height: 25px;
}
</style>
