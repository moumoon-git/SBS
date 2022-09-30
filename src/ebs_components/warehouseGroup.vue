<template>
  <el-dialog
    :visible.sync="Modal"
    width="500px"
    center
    append-to-body
    :close-on-click-modal="false"
  >
    <div slot="title">{{ title }}</div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="tree">
          <el-input
            style="margin-bottom: 10px"
            placeholder="请输入名称进行搜索"
            v-model="filterText"
            clearable
          >
          </el-input>
          <el-scrollbar style="height: 400px">
            <el-tree
              :data="treeData"
              :props="props"
              ref="tree"
              node-key="id"
              default-expand-all
              
              :default-expanded-keys="[indexKey]"
              :filter-node-method="filterNode"
              :highlight-current='highlightCurrent'
             @node-click="handleNodeClick"
            ></el-tree>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <div class="submit-btn">
        <el-button type="primary" size="medium" @click="onSubmit"
          >确认</el-button
        >
      </div>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  name: "warehouseGroup",
  data() {
    return {
      props: {
        label: "name",
        children: "children",
      },
      filterText: "",
      title: "",
      treeData: [],
      Modal: false, //模态框
      checkedKeys: [], //勾选数组
      MaillistGroup: [], //完整的通讯录分组
      treeID: '', //选择树id
      treeName: '', //选择树名称
      selectedNode:'',
      materialClassID:'',//物资类型数据第一条数据id
      indexKey: 0,
      highlightCurrent: false,
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //获取选择树数据
    openModal(data, type, treeData) {
        this.Modal = true;
        this.title = type;
        this.treeData = data;
        this.MaillistGroup = JSON.parse(JSON.stringify(data));
        this.$nextTick(function() {
        let treeId=treeData.id;

       
        if(data.id==''){
          this.highlightCurrent = false;
          this.indexKey=0;
          treeId=0;
        }else{
					this.highlightCurrent = true;
          this.indexKey=treeId;
        }
        
        this.$refs.tree.setCurrentKey(treeId);
        
      })
    },
    handleNodeClick(data){
        this.treeID = data.id;
        this.treeName = data.name;
        this.highlightCurrent = true;
    },
    onSubmit() {
      if (this.treeID != '' && this.treeID != 0 && this.treeID!=this.materialClassID) {
        let data = {
          id: this.treeID,
          name:this.treeName
        }
        this.Modal = false;
        this.$emit("treeChild", data);
      }
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
            {" "}
            {node.data.name}
          </span>{" "}
        </span>
      );
    },
  },
};
</script>

<style scoped>
.tree {
  /*height: 400px;*/
  width: 450px;
  /*overflow: auto;*/
  overflow-y: auto;
  overflow-x: auto;
}

.el-tree {
  min-width: 100%;
  display: inline-block !important;
  background: #c0c0c003;
}

.submit-btn {
  margin-top: 20px;
  text-align: center;
}

.el-tree--highlight-current
  >>> .el-tree-node.is-current
  > .el-tree-node__content
  .el-tree-node__label {
  background-color: #ccc;
}

.el-scrollbar >>> .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
