<!--
 * @Author: your name
 * @Date: 2021-04-12 14:04:15
 * @LastEditTime: 2021-04-16 17:49:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \xuchuangxing\SJSEOS\src\view\dutyManagement\RollCallOnDuty\positionTree.vue
-->
<!--@author：yf-->
<template>
  <div>
    <el-dialog
      width="300px"
      :title="title"
      :visible.sync="isShow"
      :close-on-click-modal="false"
      :before-close="closePositionDialog"
    >
      <div class="tree">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          style="margin-left:23px;"
          >全选</el-checkbox
        >
        <el-scrollbar style="height: 100%">
          <el-tree
            show-checkbox
            ref="tree"
            style="max-height: 400px"
            :data="treeData"
            node-key="name"
            highlight-current
            defau
            :props="defaultProps"
            @check="handleCheck"
            :default-checked-keys="defaultChecked"
          ></el-tree>
        </el-scrollbar>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="confirmPosition">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "positionTree",
  props: {
    positionData: {
      type: Array
    }
  },
  data() {
    return {
      defaultProps: {
        label: "name"
      },
      title: "请选择职务", //标题
      isShow: true, // 是否显示
      treeData: [], //树数据
      positionArr: [], // 所选所有职务数据
      defaultChecked: [], // 默认选中节点
      checkAll: false, // 默认不全选
      isIndeterminate: true
    };
  },
  mounted() {
    // console.log("this.positionData: ", this.positionData);
    this.treeData = this.positionData;
  },
  methods: {
    handleCheckAllChange(val) {
      //   console.log("val: ", val);
      let allPositionCheck = this.treeData.map(v => {
        return v.name;
      });
      //   console.log("this.treeData: ", this.treeData);
      this.defaultChecked = val ? allPositionCheck : [];
      if (!val) {
        this.$refs.tree.setCheckedNodes(allPositionCheck, false);
      }
      this.positionArr = val ? this.treeData : [];
      this.isIndeterminate = false;
    },
    handleCheck(data, node) {
      console.log("node: ", node);
      let checkedCount = node.checkedNodes.length;
      this.checkAll = checkedCount === this.treeData.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.treeData.length;
      this.positionArr = node.checkedNodes;
      //   console.log("node: ", node);
      //   console.log("this.positionArr: ", this.positionArr);
    },
    confirmPosition() {
      // let data = this.treeData.filter(v=>v.name )
      this.$emit("confirmPosition", this.positionArr.reverse());
    },
    closePositionDialog() {
      this.$emit("closePositionDialog");
    }
  }
};
</script>

<style scoped>
.tree {
  background-color: white;
  border: 1px solid rgba(211, 215, 219, 1);
}

>>> .el-dialog__body {
  padding: 10px 5px;
}
>>> .el-checkbox__label {
  padding-left: 30px;
}
</style>
