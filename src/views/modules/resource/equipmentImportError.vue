<template>
  <el-dialog
    class="error_Dialog"
    title="导入失败"
    :close-on-click-modal="false"
    width="850px"
    :visible.sync="visible"
  >
    <div class="error_detail">
      导入失败！检测到{{ errorData.length }}项内容填写存在异常，请根据“填写须知”修改后重新导入
    </div>
    <el-table
      :data="errorData"
      border
      height="400"
      :header-cell-class-name="headerClass"
    >
      <el-table-column
        v-for="item in tableColumn"
        :key="item.id"
        :label="item.label"
        :prop="item.prop"
        :width="item.width?item.width: 80"
        align="center"
        header-align="center"
      />
    </el-table>
    <div class="tip_wrap">
      <div>填写须知：</div>
      <div
        v-for="(item, index) in tips"
        :key="index"
        class="write_tips"
      >
        {{ item }}
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      errorData: [],
      // 表头
      tableColumn: [],
      // 底部提示信息
      tips: [],
      // 必填项
      required: [],
    };
  },
  methods: {
    init(data) {
      this.visible = true;
      this.errorData = data;
    },
    // 区分必填字段样式
    headerClass({ column }) {
      let headerClass = '';
      if (this.required.indexOf(column.label) !== -1) {
        headerClass = 'header_required';
      } else {
        headerClass = '';
      }
      return headerClass;
    },
  },
};
</script>
<style lang="scss" scoped>
.error_Dialog {
  /deep/ .header_required {
    .cell {
      color: #EC808D !important;
    }
  }
  .error_detail {
    color: #EC808D;
  }
  .tip_wrap {
    color: #EC808D;
    .write_tips {
      text-indent: 2em;
    }
  }
}
</style>
