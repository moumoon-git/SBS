<template>
  <div>
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="visible"
      v-dialogDrag
    >
      <div style="height:560px;border:1px solid #DBDBDB;padding:5px;">
        <el-scrollbar
          wrap-class="list"
          wrap-style="color: red;max-height:560px;"
          view-class="view-box"
          :native="false"
        >
          <el-input placeholder="搜索" v-model="searchText"></el-input>
          <el-tree
            @node-click="handleNodeClick"
            :data="treeData"
            :props="prop ? prop : treeProps"
            node-key="id"
            style="height:100%;"
            highlight-current
            default-expand-all
            :expand-on-click-node="true"
            :filter-node-method="filterNode"
            ref="tree"
          >
          </el-tree>
        </el-scrollbar>
      </div>

      <div style="text-align: center;margin-top: 20px;">
        <el-button type="primary" style="padding: 12px 20px;" @click="onSubmit"
          >确定</el-button
        >
        <el-button style="padding: 12px 20px;" @click="onCancel"
          >取消</el-button
        >
      </div>
    </el-dialog>
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
      visible: false, // 窗口是否可见
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
        this.$refs.tree.filter(val);
      }
    }
  },

  methods: {
    init(url, title) {
      this.searchText = "";
      this.title = title || "请选择";
      this.visible = true;
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
          this.treeData = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 点击树形结点事件
    handleNodeClick(obj) {
      // console.log('点击树形结点事件', obj)
      this.selectObject = obj;
      this.$emit("choosePlatform", obj);
    },

    // 点击确定
    onSubmit() {
      if (this.selectObject == null || this.selectObject === "") {
        this.$message({
          message: "请选择",
          type: "warning"
        });
      } else {
        this.$emit("onSubmit", this.selectObject);
        this.visible = false;
      }
    },
    // 点击取消
    onCancel() {
      this.filterText = "";
      this.visible = false;
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
