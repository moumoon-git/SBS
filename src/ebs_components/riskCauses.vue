<template>
  <el-dialog
    :title="title"
    :visible.sync="causeClassesdialog"
    width="850px"
    center
    append-to-body
    :close-on-click-modal="false"
  >
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card class="candidate">
          <div slot="header" style="text-align: left">
            <span>应急类别</span>
          </div>
          <el-scrollbar style="height: 320px">
            <el-input
              placeholder="请输入应急类型"
              clearable
              v-model="searchText"
              style="margin-bottom: 10px"
            >
            </el-input>
            <el-tree
              :data="causeClassestree"
              ref="tree"
              :render-content="renderContent"
              :default-expanded-keys="[indexkey]"
              
              highlight-current
              :props="props"
              @node-click="causeClassesclick"
              node-key="id"
			  :filter-node-method="filterNode"
            ></el-tree>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card class="candidate">
          <div slot="header" style="text-align: left">
            <span>事件类型</span>
          </div>
          <el-scrollbar style="height: 320px; width: 450px; text-align: left">
            <el-tag
              :key="tag.id"
              v-for="tag in dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
              style="margin-bottom: 10px; text-align: left"
            >
              {{ tag.name }}
            </el-tag>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <div class="submit-btn">
        <el-button size="small" type="primary" @click="Determine"
          >确定</el-button
        >
      </div>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  name: "riskCauses",
  data() {
    const data = [
      {
        id: 0,
        name: "应急类型",
        children: null,
      },
    ];
    return {
      title: "",
      causeClassesdialog: false,
      causeClassestree: JSON.parse(JSON.stringify(data)),
      indexkey: 0,
      props: {
        label: "name",
        children: "children",
      },
	  dynamicTags: [],
	  
	  searchText: "",
    };
  },
  created() {
    this.getTree();
  },
  watch: {
    searchText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    getTree() {
      let data = {};
      this.$http("/emergency/preparation/caseClass/getTree", data).then(
        (res) => {
          this.causeClassestree[0].children = res.data;
        }
      );
    },
    causeClasses(resultcauseClasses, typeTitle) {
      this.causeClassesdialog = true;
      this.dynamicTags = resultcauseClasses;
      this.title = typeTitle;
    },
    renderContent(
      h,
      {
        //树形控件title提示
        node,
        data,
        store,
      }
    ) {
      return (
        <span class="custom-tree-node">
          <span title={node.data.name} class="el-tree-node__label">
            {node.data.name}
          </span>
        </span>
      );
    },
    causeClassesclick(data, node) {
      if (data.id == 0) {
        this.$message({
          message: "请选择应急类型下的应急类别！",
          type: "warning",
        });
        return;
      }
      for (let i in this.dynamicTags) {
        if (this.dynamicTags[i].id == data.id) {
          this.$message({
            message: "类型不能重复！",
            type: "warning",
          });
          return;
        }
      }
      let parentName = node.parent.data.name; //父级ID名称
      let list = {};
      if (parentName == "应急类型") list.name = data.name;
      else list.name = parentName + "->" + data.name;
      list.id = data.id;
      this.dynamicTags.push(list);
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    Determine() {
      this.$emit("causeclassesReturn", this.dynamicTags);
      this.causeClassesdialog = false;
	},
	/*
     * @param  {String}    :   关键字
     * @param  {String}    :   节点数据
     * @descripttion       :   分组树的过滤
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
  },
};
</script>

<style scoped>
.candidate {
  margin-top: 10px;
  height: 400px;
}

.el-tree--highlight-current
  >>> .el-tree-node.is-current
  > .el-tree-node__content
  .el-tree-node__label {
  background-color: #ccc;
}

/*.el-tree--highlight-current>>>.el-tree-node.is-current>.el-tree-node__content {
		background-color: #c0c0c054;
	}*/

.el-scrollbar >>> .el-scrollbar__wrap {
  overflow-x: hidden;
}

.submit-btn {
  margin-top: 20px;
  text-align: center;
}

/*.el-tag+.el-tag {
		margin-left: 10px;
	}*/
.el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
