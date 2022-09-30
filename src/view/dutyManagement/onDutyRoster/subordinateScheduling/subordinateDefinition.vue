<!--
    * @description
    * @author yangqingdong
    * @lastEditors yangqingdong
    * @lastEditTime 2020/9/8 18:11
    -->
<template>
  <el-dialog id="subordinateDefinition" title="选择分组" :visible.sync="dialogVisible" width="1147px" :close-on-click-modal="false">
    <el-container style="height: 460px">
      <el-main style="padding-top: 0">
        <div style="text-align: center">
          <el-input style="width: 80%" placeholder="请输入部门名称" v-model="filterText" @keyup.enter.native="filterTree"></el-input>
          <el-button @click="filterTree">搜索</el-button>
          <div class="treeBlock">
            <el-tree
              :data="data"
              :props="defaultProps"
              default-expand-all
              node-key="id"
              show-checkbox
              :check-strictly="true"
              @check-change="handleCheckChange"
              :filter-node-method="filterNode"
              ref="tree"
            ></el-tree>
          </div>
        </div>
      </el-main>
      <el-aside>
        <div class="selectedBlock">
          <p class="title">已选中分组：</p>
          <div class="selectedGroupBlock" v-for="(item, index) in selected" :key="index">
            <div class="selectedGroup">
              <span>{{item.platformName}}</span>
              <i class="el-icon-delete" @click="deleteGroup(item, index)"></i>
            </div>
          </div>
        </div>
      </el-aside>
    </el-container>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeDialog">确认</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: "SubordinateDefinition",
  props: ["dialogSubordinateDefinition", "allGroupList", "selectedGroupList"],
  data() {
    return {
      dialogVisible: true,

      selected: [],
      selectedId: [],

      filterText: "",
      data: [],
      defaultProps: {
        children: "children",
        label: "platformName",
      },
    };
  },
  created() {
    const tmp = JSON.parse(JSON.stringify(this.allGroupList));
    if (tmp && tmp.length) {
      tmp.forEach((i) => {
        i.id = i.id || i.deptId;
      });
    }
    this.data = tmp;
    this.selected = JSON.parse(JSON.stringify(this.selectedGroupList));
    this.selected.forEach((i) => {
      i.id = i.id || i.deptId;
    });
  },
  mounted() {
    this.$nextTick(() => {
      if (this.selectedId) {
        this.$refs.tree.setCheckedNodes(this.selected);
        this.selectedId = this.$refs.tree.getCheckedKeys(false, false);
      }
    });
  },
  methods: {
    closeDialog() {
      //this.$emit("setGroupList", this.selected);

      this.$api
        .subordinateSaveSelectedGroup({ ids: this.selectedId })
        .then((res) => {
          this.$emit("setGroupList");
          this.dialogVisible = false;
        });
    },
    handleCheckChange() {
      this.selected = this.$refs.tree.getCheckedNodes(false, false);
      this.selectedId = this.$refs.tree.getCheckedKeys(false, false);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) != -1;
    },
    deleteGroup(item, index) {
      this.selected.splice(index, 1);
      this.selectedId.splice(index, 1);
      this.$refs.tree.setCheckedNodes(this.selected);
    },
    filterTree(){
      this.$refs.tree.filter(this.filterText);
    }
  },
  watch: {
    dialogVisible: {
      handler(newValue) {
        this.$emit("update:dialogSubordinateDefinition", newValue);
      },
    },
    filterText(val) {
      if(!val){
        this.$refs.tree.filter(val);
      }
    },
  },
};
</script>
<style scoped>
#subordinateDefinition .title {
  padding-left: 8px;
  text-align: left;
}
#subordinateDefinition .selectedBlock {
  height: 430px;
  width: 95%;
  border: 1px solid rgba(188, 188, 188, 1);
  overflow-y: auto;
}
#subordinateDefinition .selectedGroupBlock {
  text-align: left;
}
#subordinateDefinition .selectedGroup {
  padding: 8px;
  margin-bottom: 15px;
  display: inline-block;
  color: rgba(0, 153, 255, 1);
  position: relative;
}
#subordinateDefinition .selectedGroup .el-icon-delete {
  color: rgba(0, 153, 255, 1);
  font-size: 16px;
}
#subordinateDefinition .selectedGroup .el-icon-delete:hover {
  cursor: pointer;
}
#subordinateDefinition .treeBlock {
  display: inline-block;
  width: 90%;
  height: 380px;
  overflow-y: auto;
  padding-top: 15px;
  /* border: 1px solid rgba(188, 188, 188, 1); */
}
</style>
