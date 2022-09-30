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
      <el-table-column
        prop="gmtCreate"
        label="日期"
        width="110"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="telSum"
        label="天翼对讲总数"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="telOnline"
        label="天翼对讲在线"
        align="center"
      ></el-table-column>
      <el-table-column label="天翼对讲在线率" align="center">
        <template slot-scope="scope">
          {{
            ((scope.row.telOnline / scope.row.telSum) * 100).toFixed(2) + "%"
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="monSum"
        label="视频监控总数"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="monOnline"
        label="视频监控在线"
        align="center"
      ></el-table-column>
      <el-table-column label="视频监控在线率" align="center">
        <template slot-scope="scope">
          {{
            ((scope.row.monOnline / scope.row.monSum) * 100).toFixed(2) + "%"
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="netSum"
        label="网格终端总数"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="netOnline"
        label="网格终端在线"
        align="center"
      ></el-table-column>
      <el-table-column label="网格终端在线率" align="center">
        <template slot-scope="scope">
          {{
            ((scope.row.netOnline / scope.row.netSum) * 100).toFixed(2) + "%"
          }}
        </template>
      </el-table-column>
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
  props: {
    tableData: {
      type: Array
    }
  },
  data() {
    return {
      multipleSelection: []
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
      this.$emit("getCheckList", val);
    },

    // 查看
    see(id) {
      this.$emit("seeOrEdit", "查看", id);
    },
    // 编辑
    edit(id) {
      this.$emit("seeOrEdit", "编辑", id);
    },
    // 删除
    del(id) {
      this.$emit("delHandle", id);
    }
  }
};
</script>

<style lang="scss">
.TerminalOnlineTable {
  .del {
    color: red;
  }
}
</style>
