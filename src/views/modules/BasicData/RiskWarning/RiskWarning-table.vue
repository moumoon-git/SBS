<template>
  <div class="TerminalOnlineTable">
      <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="日期" align="center">
        <template slot-scope="scope">{{ scope.row.gmtCreate }}</template>
      </el-table-column>
      <el-table-column prop="name" label="预警事项" align="center"></el-table-column>
      <el-table-column prop="basisInfo" label="预警依据" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
           <span @click="see(scope.row.id)">查看</span>
          <span @click="edit(scope.row.id)">编辑</span>
          <span class="del" @click="del(scope.row.id)">删除</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: "TerminalOnlineTable",
  props:{
    tableData:{
      type:Array,
    }
  },
  data() {
    return {
      multipleSelection: [],
    };
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit('getCheckList',val)
    },
    
    // 查看
    see(id) {
      this.$emit("seeOrEdit",'查看',id)
    },
    // 编辑
    edit(id) {
      this.$emit("seeOrEdit",'编辑',id)
    },
    // 删除
    del(id) {
       this.$emit('delHandle',id)
    }
  },
};
</script>

<style lang="scss">
.TerminalOnlineTable {
  .del {
    color: red;
  }
}
</style>