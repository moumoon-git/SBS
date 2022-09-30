<template>
  <el-dialog
    :visible.sync="visible"
    width="500px"
    center
    append-to-body
    :close-on-click-modal="false"
  >
    <div slot="title">{{theme}}</div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="tree">
          <!--<el-main>-->
          <el-scrollbar style="height: 360px;">
            <el-tree
              :data="tree"
              ref="tree"
              :render-content="renderContent"
              node-key="id"
              :props="props"
              :highlight-current="highlightCurrent"
              :expand-on-click-node="true"
              :default-expanded-keys="[indexKey]"
              @node-click="handleNodeClick"
            ></el-tree>
          </el-scrollbar>
          <!--</el-main>-->
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
	import MyDialog from "./MyDialog";

	export default {
		name: "TreeSelectForm",
		components: {
			MyDialog
		},
		data() {
			return {
				theme: "",
				type: "",
				tree: [],
				props: {
					label: 'name',
					children: 'children'
				},
				highlightCurrent: false,
				visible: false,
				treeID: '', //选择树id
				treeName: '', //选择树名称
				parentName: '', //父节点名称
				indexKey: 0,
				materialClassID:'',//物资类型数据第一条数据id
			}
		},
		methods: {
			//获取选择树数据
			getTree(type, treeData) {
				this.type = type;
				switch (type) {
					case "materialAddress": //应急物资库
						this.$http('/emergency/preparation/materialAddress/topTree', null).then(res => {
								this.tree = res.data;
								this.materialClassID='';
						});
						break;
					case "caseClass": //应急类型
						this.$http('/emergency/preparation/caseClass/getTree', null).then(res => {
								// let data = [{
								// 	id: 0,
								// 	name: '应急类型',
								// 	children: res.data
								// }];
								// this.tree = data;
								this.tree = res.data;
								this.treeID = treeData.id;
								let name=treeData.name.split("->");
								this.treeName = name[1];
								this.parentName = name[0];
								this.chooseTree(this.treeID);
								this.materialClassID='';
						});
						break;
					case "materialClass": //物资类型
						this.$http('/emergency/preparation/materialClass/getTree', null).then(res => {
							if (res) {
								// this.tree = res.data;
								this.tree = res.data[0].children;							
								this.materialClassID=res.data[0].id;
								this.treeID = treeData.id;
								let name=treeData.name.split("->");
								this.treeName = name[1];
								this.parentName = name[0];
								this.chooseTree(this.treeID);
							}
						});
						break;
					case "area": //行政区划
						this.$http('/emergency/preparation/area/topTree', null).then(res => {
							if (res) {
								// let data = [{
								// 	id: 0,
								// 	name: '所有区划',
								// 	children: res.data
								// }];
								// this.tree = data;
								this.tree = res.data;
								this.treeID = treeData.id;
								let name=treeData.name.split("->");
								this.treeName = name[1];
								this.parentName = name[0];
								this.chooseTree(this.treeID);
								this.materialClassID='';
							}
						});
						break;
          case "equipmentClass": //物资类型
            this.$http('/emergency/preparation/equipmentClass/getTree', null).then(res => {
              if (res) {
                // this.tree = res.data;
                this.tree = res.data[0].children;
                this.materialClassID=res.data[0].id;
                this.treeID = treeData.id;
                let name=treeData.name.split("->");
                this.treeName = name[1];
                this.parentName = name[0];
                this.chooseTree(this.treeID);
              }
            });
            break;
					default:
						this.tree = [];
				}
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
			handleNodeClick(data, node) {
				this.treeID = data.id;
				this.treeName = data.name;
				this.highlightCurrent = true;
				this.parentName = node.parent.data.name; //父级名称
			},
			onSubmit() {
				if (this.treeID != '' && this.treeID != 0 && this.treeID!=this.materialClassID) {
					let data = {}
					if (typeof(this.parentName) == "undefined"){ 
						data = {
							id: this.treeID,
							name: this.treeName,
							type: this.type
						};
					} else{
						data = {
							id: this.treeID,
							name: this.parentName + '->' +this.treeName,
							type: this.type
						};
					}
					this.$emit("submit", data);
				} else {
					this.$message({
						type: 'warning',
						message: '请' + this.theme
					})
				}
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
    width: 460px;
    /*overflow: auto;*/
}

.el-tree {
    min-width: 100%;
    display: inline-block !important;
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
