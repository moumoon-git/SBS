<!--@author：yf-->
<template>
    <div>
      <el-dialog   width="300px" :title="title" :visible.sync="addEventDialog" :before-close="closeDialog" :close-on-click-modal="false">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
        <el-scrollbar>
          <el-tree
            style="height: 300px;"
            class="filter-tree"
            :data="treeData"
            :props="defaultProps"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
            accordion
            highlight-current
            node-key="id"
            ref="tree">
            <span class="span-ellipsis" slot-scope="{node}">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </el-tree>
        </el-scrollbar>
        <div slot="footer" class="dialog-footer">
          <el-button @click="close" size="small">取 消</el-button>
          <el-button type="primary" size="small" @click="confirm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    export default {
        props:['addEventDialog','title'],
        name: "eventDialog",
        data(){
          return{
            defaultProps: {
              children: 'children',
              label: 'name',
            },
            treeData:[],
            filterText: '',
          }
        },
        watch: {
          filterText(val) {
            this.$refs.tree.filter(val);
          }
        },
        methods:{
          clearData(){
            this.filterText=''
          },
          filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
          },
          lol(treeData){
            this.treeData=treeData;
          },
          close(){
            this.$emit('close');
          },
          confirm(){
            this.$emit('confirm');
          },
          closeDialog(){
            this.$emit('closeDialog');
          },
          handleNodeClick(data, node){
            this.$emit('handleNodeClick',data,node);
          }


        }
    }
</script>

<style scoped>
  >>>.el-dialog__body{
    padding: 10px 10px;
  }
  .span-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
