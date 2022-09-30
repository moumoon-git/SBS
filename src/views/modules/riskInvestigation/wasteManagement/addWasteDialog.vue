/*
 * @Author: liukanglin 
 * @Date: 2020-09-01
 */
<template>
  <el-dialog title="新增垃圾分类点" width="1180px" :visible.sync="dialogFormVisible">
    <img src="./image/add_dialog.png" />
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelAdd">取 消</el-button>
      <el-button type="primary" @click="comfirmAdd">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      formLabelWidth: "120px",
    };
  },
  methods: {
    // 确认新增
    comfirmAdd() {
      this.dialogFormVisible = false;
      this.$message({
        message: "保存成功",
        type: "success",
      });
    },
    // 取消新增
    cancelAdd() {
      this.dialogFormVisible = false;
      this.$message({
        message: "取消操作",
      });
    },
  },
};
</script>

<style lang="less" scoped>
  /deep/ .el-dialog__header {
    background-color: rgba(241, 244, 246, 1);
  }
</style>