<template>
  <div>
    <div
      style="height:560px;min-width:400px;border:1px solid #DBDBDB;padding:5px;"
    >
      <el-scrollbar
        wrap-class="list"
        wrap-style="color: red;max-height:560px;"
        view-class="view-box"
        :native="false"
      >
        <el-input placeholder="搜索" v-model="searchText"></el-input>
        <el-tree
          @node-click="handleNodeClick"
          :check-on-click-node="true"
          :show-checkbox="true"
          :data="treeData"
          :props="prop ? prop : treeProps"
          node-key="id"
          style="height:100%;"
          highlight-current
          default-expand-all
          :expand-on-click-node="true"
          :filter-node-method="filterNode"
          ref="rightTree"
        >
        </el-tree>
      </el-scrollbar>
    </div>

    <div style="text-align: center;margin-top: 20px;">
      <el-button type="primary" style="padding: 12px 20px;" @click="onSubmit"
        >确定</el-button
      >
      <el-button style="padding: 12px 20px;" @click="onCancel">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "GroupSelect",

  props: ["prop"],

  data() {
    return {
      searchText: "",
      title: "",
      treeData: [], // 树形列表
      treeProps: {
        children: "children",
        label: "name"
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      selectObject: "" // 选中的对象
    };
  },

  watch: {
    searchText: {
      handler: function(val, oldVal) {
        this.$refs.rightTree.filter(val);
      }
    }
  },

  methods: {
    init(url, title, id) {
      this.searchText = "";
      this.title = title || "请选择";
      this.selectObject = "";
      this.$http({
        url: this.$http.adornUrl(url),
        method: "get",
        param: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data.data.name)
          switch (url) {
            case "/event/eventType/list":
              break;
            default:
            // console.log('url=' + url)
          }
          let tempTreeData = data.data;
          // 先清空
          this.cancelDisabledNode(tempTreeData);
          this.eidtTreeNode(tempTreeData, id);
          //   tempTreeData.forEach(item => {

          //   })
          this.treeData = tempTreeData;
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 点击树形结点事件
    handleNodeClick(obj) {
      // console.log('点击树形结点事件', obj)
      this.selectObject = obj;
      console.log(obj);
    },

    // 递归遍历树形结构修改目标子节点
    eidtTreeNode(tree, id) {
      for (let i = 0; i < tree.length; i++) {
        // tree[i]["disabled"] = false;
        if (tree[i].id === id) {
          tree[i]["disabled"] = true;
          // this.$set(this.platformList[i], "disabled", true);
        } else {
          // tree[i]["disabled"] = false;
          if (tree[i].children) {
            this.eidtTreeNode(tree[i].children, id);
          }
        }
      }
    },

    // 递归初始化树结构的不可选节点
    cancelDisabledNode(tree) {
      for (let i = 0; i < tree.length; i++) {
        tree[i]["disabled"] = false;
        if (tree[i].children && tree[i].children.length > 0) {
          this.cancelDisabledNode(tree[i].children);
        }
      }
    },

    // 点击确定
    onSubmit() {
      //   if (this.selectObject == null || this.selectObject === "") {
      //     this.$message({
      //       message: "请选择",
      //       type: "warning"
      //     });
      //   } else {
      //     this.$emit("onSubmit", this.selectObject);
      //   }
      let checkedNodes = this.$refs.rightTree
        .getCheckedNodes()
        .map(item => item.id);
      if (checkedNodes && checkedNodes.length > 0) {
        this.$emit("selectPlatforms", checkedNodes);
      } else {
        this.$message({
          message: "请选择",
          type: "warning"
        });
      }
      console.log(checkedNodes);
    },
    // 点击取消
    onCancel() {
      this.$emit("cancelPlatforms");
    },
    // 树节点搜索事件
    filterNode(value, data) {
      if (!value) return true;
      if (data.platformName) {
        return data.platformName.indexOf(value) !== -1;
      } else {
        return data.name.indexOf(value) !== -1;
      }
    }
  }
};
</script>

<style scoped></style>
