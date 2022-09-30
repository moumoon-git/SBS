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
            v-model="faxSearch"
            class="input-with-select"
            size="medium"
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
          <el-button type="primary" size="medium" @click="getTableData">搜索</el-button>
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

        <el-table-column min-width="60" :resizable="false" label="状态" style="padding-left: 15px;">
          <template slot-scope="scope">
            <span
              :style="{color:scope.row.lastUpdate=='2020-06-29 16:14:08'?'#FF977A':'#0091FF'}"
            >{{scope.row.lastUpdate}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="160" label="确认时间" prop="lastUpdate" :resizable="false"></el-table-column>
        <el-table-column min-width="40" :resizable="false" label="操作" style="padding-left: 15px;">
          <template slot-scope="scope">
            <span v-if="scope.row.lastUpdate=='2020-06-29 16:14:08'">-</span>
            <span v-else class="cellPhoneImg" @click="callPhoneAssign(scope.row)"></span>
          </template>
        </el-table-column>
      </el-table>

      <div class="framework_right_footer">
        <span > <span style="margin:0 10px">/</span> {{totalPages}}</span>
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="10"
          :total="total"
          layout="prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "response",
  props:{
      responseId:{
          type: Number
      }
  },
  data() {
    return {
      dialogVisible: true,
      total: 0, //数据总数
      currentPage: 1, //当前页
      totalPages: 0, // 总页数
      responseId: "", // 响应Id
      tableColumn: [
        {
          label: "人员",
          prop: "title"
        },
        {
          label: "部门",
          prop: "title"
        },
        {
          label: "职务",
          prop: "lastUpdate"
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
      value: ""
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
      //表格数据
    getTableData() {
      let data = {
        iType: 373,
        page: this.currentPage,
        size: this.pageSize,
        value: "",
      };
      if (this.searchText != "") {
        data.searchText = this.searchText;
      }
      this.$api.InformationReleas(data).then(res => {
        if (res.errorcode != 0) {
          this.$message({
            message: res.msg,
            type: "error"
          });
          return;
        }
        this.tableData = res.data.data;
        this.total = res.data.totalElements;
        this.totalPages = res.data.totalPages;
        //默认显示第一条数据
        // this.$nextTick(() => {
        //   if (this.tableData.length !== 0) {
        //     this.$refs.TableDetails.showData(res.data.data[0]);
        //     this.rowData = res.data.data[0];
        //   } else {
        //     this.$refs.TableDetails.showData(null);
        //   }
        // });
      });
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
      let obj = {
        type: this.$store.state.msgHeadleData.sendType,
        typeId: this.$store.state.msgHeadleData.sendTypeId
      };
      if (item.mobile) {
        this.talkCall({ number: item.mobile }, "", obj);
      } else if (item.otherTel) {
        this.talkCall({ number: item.otherTel }, "", obj);
      } else if (item.officeTel) {
        this.talkCall({ number: item.officeTel }, "", obj);
      } else if (item.number) {
        this.talkCall({ number: item.number }, "", obj);
      } else if (item.otherTel2) {
        this.talkCall({ number: item.otherTel2 }, "", obj);
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.response .cellPhoneImg{
  display: inline-block;
  width: 22px;
  height: 25px;
  background: url("../../../static/img/Communihistory/cell.png") no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}
.response .cellPhoneImg:hover {
  background: url("../../../static/img/Communihistory/cell1.png") no-repeat;
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