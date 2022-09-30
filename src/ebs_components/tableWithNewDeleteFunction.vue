<template>
  <div>
    <el-table
      ref="table"
      :data="tableData"
      stripe
      highlight-current-row
      @selection-change="handleSelectionChange"
      border
      @row-dblclick="handleRowDblclick"
      @cell-mouse-enter="showInfo"
    >
      <el-table-column
        type="selection"
        fixed="left"
        :resizable="false"
      ></el-table-column>
      <el-table-column
        v-for="(item, key) in tableKey"
        :key="key"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        :resizable="true"
      >
        <template slot-scope="scope">
          <span
            style="color: red"
            v-if="scope.row.infoMark == 1 && item.prop == 'name'"
            >*</span
          >
          <span style="margin-left: 10px">{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="240"
        :resizable="false"
        min-width="240"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button type="info" size="mini" @click="handleDetail(scope.row)"
            >查看</el-button
          >
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="mini"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- editor: qinjiaqi -->
    <!-- description: 联系人删除逻辑改变 -->
    <el-dialog
      title="联系人删除提示"
      :visible.sync="deleteBtnFlag"
      width="25%"
      center
    >
      <span
        >该联系人在系统中存在分组、预案等关联数据,删除数据将不可恢复，请您确认相关操作!</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteGroupOne"
          >从分组中删除</el-button
        >
        <el-button type="danger" @click="deleteGroupAll">彻底删除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: ["table-data", "table-key"],
  data() {
    return {
      deleteBtnFlag: false, // 控制删除对话框
      deleteMoreorOne: "", // 打开的是删除单个的还是删除多个的。more多个，one一个
      deleteId: "", // 彻底删除
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.$emit("selection-change", val);
    },
    handleRowDblclick(row, column, event) {
      this.$emit("row-dblclick", row);
    },
    handleDetail(row) {
      this.$emit("detail", row);
    },
    handleUpdate(row) {
      this.$emit("update", row);
    },
    /**
     * @author qinjiaqi
     * @param {Int} 当前选择的单个联系人
     * @return {type} undefined
     * @description：删除单个联系人，删除操作由父组件执行
     */
    handleDelete(id) {
      this.deleteBtnFlag = true;
      this.deleteMoreorOne = "one";
      this.deleteId = id;
      /*this.$confirm('确认删除该数据？', '提示', {
					type: 'warning',
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(() => {
					this.$emit('delete', id);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					})
				})*/
    },
    /**
     * @author qinjiaqi
     * @param {type} 没有
     * @return {type} undefined
     * @description：在当前分组里删除联系人
     */
    deleteGroupOne() {
      this.deleteBtnFlag = false;
      if (this.deleteMoreorOne == "one") {
        this.$emit("delete", this.deleteId, "one");
        /*if(this[key].rowData.groupId <= 0) {
						this.$message.error('未分组联系人没有分组关系只能彻底删除');
						return
					}
					let data = {
						groupId: this.groupId,
						ids: this.deleteId,
					};
					this.$api.deleteContactorGroupRel(data).then(res => {
						if (res.errorcode !== 0) {
							this.$message.error(res.msg);
							this.deleteBtnFlag = false
							return;
						}
						this.$message.success('删除成功!');
						this.deleteBtnFlag = false
					});*/
      }
      /* if(this.deleteMoreorOne == 'more'){
					let data = {
						groupId: this.groupId,
						ids: this.deleteId,
					}
					this.$api.deleteContactorGroupRel(data).then(res => {
						if (res.errorcode !== 0) {
							this.$message.error(res.msg);
							this.deleteBtnFlag = false
							return;
						}
						this.$message.success('删除成功!');
						this.deleteBtnFlag = false
					});
				}*/
    },
    /**
     * @author qinjiaqi
     * @param {type} 没有
     * @return {type} undefined
     * @description：在所有分组里删除这个id对应的联系人
     */
    deleteGroupAll() {
      this.deleteBtnFlag = false;
      if (this.deleteMoreorOne == "one") {
        this.$emit("delete", this.deleteId, "all");
      }
      /*if(this.deleteMoreorOne == 'more'){
					this.$http({
						url: `${window.g.ApiUrl}/eos/communication/contactor/deleteContactor`,
						method: 'post',
						data: {
							ids: this.deleteId,
						},
					}).then(({ data }) => {
						if (data.errorcode !== 0) {
							this.$message.error(data.msg);
							return;
						}
						this.$message.success('删除成功!');
					})
				}*/
    },
    showInfo(row, column, cell, event) {
      if (row.infoMark == 1) {
        let relGroup;
        this.$emit("getRelGroup", row.groupInfoName, (val) => {
          relGroup = val;
        });
        cell.title = `关联分组: ${relGroup}`;
      } else {
        cell.title = "";
      }
    },
  },
};
</script>

<style scoped>
@import "../assets/css/common.css";
.el-table >>> .el-table__fixed-right {
  height: 100%;
}
.el-table td,
.el-table th {
  padding: 8px 0;
}
</style>