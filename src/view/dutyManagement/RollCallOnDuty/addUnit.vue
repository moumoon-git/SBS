<!--
 * @Author: your name
 * @Date: 2021-04-08 13:44:24
 * @LastEditTime: 2021-04-26 10:48:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \xuchuangxing\SJSEOS\src\view\dutyManagement\RollCallOnDuty\addUnit.vue
-->
<!--@author：yf-->
<template>
  <div>
    <el-dialog
      width="300px"
      :title="unitDialogTitle"
      :visible.sync="addUnitDialog"
      :before-close="closeUnitDialog"
      :close-on-click-modal="false"
    >
      <el-input placeholder="输入关键字进行过滤" v-model="filterText">
      </el-input>
      <el-scrollbar>
        <el-tree
          show-checkbox
          style="height: 300px;"
          class="filter-tree"
          :data="unitTreeData"
          :props="defaultProps"
          :filter-node-method="filterNode"
          @check="handleCheck"
          accordion
          highlight-current
          node-key="id"
          ref="tree"
          check-on-click-node
          check-strictly
        >
          <span class="span-ellipsis" slot-scope="{ node }">
            <span :title="node.label">{{ node.label }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeUnitDialog" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmUnit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["unitDialogTitle", "unitData"],
  name: "addUnit",
  data() {
    return {
      addUnitDialog: true,
      defaultProps: {
        children: "children",
        label: "name"
      },
      unitTreeData: [],
      filterText: "",
      checkUnitNode: [] // 选中的单位Id
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    clearData() {
      this.filterText = "";
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    getUnitTreeData(unitTreeData) {
      this.unitTreeData = unitTreeData;
    },
    confirmUnit() {
      this.closeUnitDialog();
      this.$emit("confirmUnit", this.checkUnitNode);
    },
    closeUnitDialog() {
      this.$emit("closeUnitDialog");
    },
    handleCheck(data, node) {
      //   console.log("this.unitData: ", this.unitData);
      let existUints = node.checkedNodes.filter(x =>
        this.unitData.some(y => x.id == y.groupId)
      );
      if (existUints.length > 0) {
        this.$message.warning(`${existUints[0].name}已存在`);
        this.$refs.tree.setChecked(existUints[0].id, false);
        node.checkedKeys.pop();
      }

      this.checkUnitNode = node.checkedKeys;
    }
  }
};
</script>

<style scoped>
>>> .el-dialog__body {
  padding: 10px 10px;
}
.span-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
