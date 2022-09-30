<template>
  <el-table
    :data="dataList"
    stripe
    @selection-change="handleSelectionChange"
    :header-cell-style="{
      background: '#E6E6E6 ',
      color: '#555',
      border: '1px solid #fff'
    }"
    :cell-class-name="cellclass"
    :cell-style="{ border: '1px solid #fff' }"
    style="width: 100%"
  >
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column prop="id" header-align="center" align="center" width="60" label="ID"></el-table-column>
    <el-table-column prop="planName" header-align="center" align="center" width="200" label="预案名称"></el-table-column>
    <el-table-column
      prop="eventTypeName"
      header-align="center"
      align="center"
      width="200"
      label="预案类型"
    ></el-table-column>
    <!--<el-table-column prop="version" header-align="center" align="center" :show-overflow-tooltip="true" label="版本号"></el-table-column>
    <el-table-column prop="publishUnit" header-align="center" align="center" width="220" label="发布单位"></el-table-column>-->

    <el-table-column
      prop="startTime"
      header-align="center"
      align="center"
      :show-overflow-tooltip="true"
      :formatter="formatterStartValidTime"
      label="有效时间"
    ></el-table-column>

    <el-table-column
      prop="intervalTime"
      header-align="center"
      align="center"
      :show-overflow-tooltip="true"
      width="120"
      label="间隔时间(分钟)"
    ></el-table-column>

    <el-table-column prop="gmtCreate" header-align="center" align="center" label="发布时间"></el-table-column>

    <el-table-column fixed="right" header-align="center" align="center" width="260" label="操作">
      <template slot-scope="scope">
        <!-- <el-button v-if="isAuth('rp:plan:update')" size="mini" style="border:none;background:none;color:#479DFF" @click="addOrUpdateHandle(scope.row, 1)">查看</el-button> -->
        <el-button
          v-if="isAuth('rp:plan:update')"
          size="mini"
          style="border:none;background:none;color:#76D672"
          @click="handleStart(scope.row)"
        >{{ scope.row.state === 0 ? '未启动':'启动'}}</el-button>
        <el-button
          v-if="isAuth('rp:plan:update')"
          size="mini"
          style="border:none;background:none;color:#76D672"
          @click="addOrUpdateHandle(scope.row, 3, 0)"
        >修改</el-button>
        <el-button
          v-if="isAuth('rp:plan:delete')"
          type="danger"
          size="mini"
          style="border:none;background:none;color:#E67380"
          @click="deleteHandle(scope.row.id,scope.row.planName)"
        >删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: ["dataList"],
  methods: {
    handleStart(row) {
      this.$confirm(
        `此操作将${!(row.state === 0) ? "关闭" : "启动"}预案,是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$message({
            type: "success",
            message: "修改成功!"
          });
          this.$http({
            url: this.$http.adornUrl(`/rp/plan/startOrClosePlan`),
            method: "post",
            params: this.$http.adornParams({
              state: row.state === 0 ? 1 : 0,
              planId: row.id
            })
          }).then(({ data }) => {
            // console.log(data)
            if (data && data.code === 0) {
              this.$emit("handleGain");
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改!"
          });
        });
    },
    cellclass(row, column, rowIndex, columnIndex) {
      return "cellclass";
    },
    addOrUpdateHandle(object, staus, grade) {
      this.$emit("addOrUpdateHandle", object, staus, grade);
    },
    deleteHandle(id,name) {
      console.log(id,name);
      this.$emit("deleteHandle", id,name);
    },
    handleSelectionChange(val) {
      let ids = val.map((item, index) => {
        return item.id;
      });
      let planNames = val.map((item, index) =>{
        return item.planName;
      })
      this.$store.commit("user/updataplanMultiple", ids);
      this.$store.commit("user/updatePlanNames",planNames)
    },
    //格式化有效时间
    formatterStartValidTime(val) {
      return (
        val.startTime.substr(11, val.startTime.length) +
        " ~ " +
        val.endTime.substr(11, val.startTime.length)
      );
    }
  }
};
</script>

<style lang="less" scoped>
.el-table--border td {
  border-right: 1px solid #fff;
}
//表格奇偶行换颜色
.has-gutter tr > th {
  background: rgba(230, 230, 230, 1);
}
.el-table th {
  background-color: rgba(230, 230, 230, 1);
}
.el-table__body tbody > :nth-child(2n) {
  background: rgba(230, 230, 230, 1);
}
//弹窗样式
.el-form-item.is-success .el-input__inner,
.el-form-item.is-success .el-input__inner:focus,
.el-form-item.is-success .el-textarea__inner,
.el-form-item.is-success .el-textarea__inner:focus {
  border: 1px solid #dcdfe6;
}
.el-form-item.is-success .el-input__inner,
.el-form-item.is-success .el-input__inner:focus,
.el-form-item.is-success .el-textarea__inner,
.el-form-item.is-success .el-textarea__inner:focus {
  border: 1px solid #dcdfe6;
}
//按钮样式
.el-button.el-button--medium:hover {
  color: #a3a3a3 !important;
  border-color: rgba(71, 157, 255, 1) !important;
  background: transparent !important;
}
.el-form {
  .el-button--default {
    background: linear-gradient(
      180deg,
      rgba(71, 175, 255, 1),
      rgba(71, 157, 255, 1)
    );
    border-radius: 3px;
    color: white;
    width: 88px;
  }
}

//修改，删除按钮样式
.cell {
  .el-button--text:first-child {
    background-color: transparent;
    border: none;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    font-weight: bold;
    color: rgba(118, 214, 114, 1);
  }
  .el-button--text:last-child {
    background-color: transparent;
    border: none;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    font-weight: bold;
    color: rgba(230, 115, 128, 1);
  }
}
</style>

