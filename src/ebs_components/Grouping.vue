<template>
  <el-dialog
    :visible.sync="Modal"
    width="500px"
    center
    append-to-body
    :close-on-click-modal="false"
  >
    <div slot="title">{{title}}</div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="tree">
          <el-scrollbar style="height: 360px;">
            <el-tree
              :data="treeData"
              ref="tree"
              @node-click="handleNodeClick"
         
              node-key="id"
              :props="props"
              :highlight-current="highlightCurrent"
              :expand-on-click-node="true"
              :default-expanded-keys="[indexKey]"
            ></el-tree>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <div class="submit-btn">
        <el-button type="primary" size="medium" @click="onSubmit">确认</el-button>
      </div>
    </el-row>
  </el-dialog>
</template>

<script>
	export default {
		name: "Grouping",
		data() {
			return {
				props: {
					label: 'name',
					children: 'children'
				},
				title: '',
				indexKey: 0,
				highlightCurrent: false,
				treeData: [],
				Modal: false, //模态框
				treeID: '', //选择树id
				treeName: '', //选择树名称
				parentName: '', //父节点名称
			}
		},
		methods: {
			//获取选择树数据
			openModal(data, type,treeData) {
				this.Modal = true;
				this.highlightCurrent = false;
				this.treeData = JSON.parse(JSON.stringify(data));
				this.title = type;
				this.treeID = treeData.id;
				let name=treeData.name.split("->");
				if(name.length==1){
					this.treeName = name[0];
					this.parentName = '';	
				} else{
					this.parentName = name[0];	
					this.treeName = name[1];	
				}	
				this.chooseTree(this.treeID);
			},
			chooseTree(id) {//默认选中树形
				this.$nextTick(function() {
					let treeId=id;
					if(id==''){
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
			handleNodeClick(data,node) {
				this.highlightCurrent = true;
				this.treeID = data.id;
				this.treeName = data.name;
				this.parentName = node.parent.data.name; //父级名称
			},
			onSubmit() {
				if (this.treeName == '' || this.treeID==0) {
					this.$message({
						type: 'warning',
						message: '请'+this.title
					})
					return;
				}
				let data={} 
				if (typeof(this.parentName) == "undefined")
					data = {
						treeID: this.treeID,
						treeName: this.treeName
					}
				else
					data= {
						treeID: this.treeID,
						treeName: this.parentName + '->' + this.treeName
					}
				this.Modal = false;
				this.$emit("treeChild", data);
			},
			renderContent(h, { //树形控件title提示
				node,
				data,
				store
			}) {
				return ( `<
					span class = "custom-tree-node" >
					<
					span title = {
						${node.data.name}
					}
					class = "el-tree-node__label" > {
						${node.data.name}
					} < /span> < /
					span >` );
			},
		},
	}
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
