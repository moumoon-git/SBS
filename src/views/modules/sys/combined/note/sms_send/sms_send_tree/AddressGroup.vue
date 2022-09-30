<template>
  <div class="AddressGroup">
    <p class="title">通讯录分组</p>
    
    <el-scrollbar
          wrap-class="list"
          wrap-style="color: red;max-height:340px;"
          view-class="view-box"
          :native="false"
        >
          <el-tree
            class="treeGroup"
            draggable
            :default-expand-all="false"
            :data="list"
            :props="listProps"
            :default-checked-keys="checkedIds"
            node-key="id"
            style="padding-top: 10px;"
            current-node-key
            highlight-current
            @node-click="handleNodeClick"
            ref="tree"
            ></el-tree>
        </el-scrollbar>
  </div>
</template>

<script>
export default {
  props:{
      list:{
          type: Array,
      },
      listProps:{
          type: Object,
      },
  },
  data() {
    return {
      checkedIds: []
    };
  },
  methods: {
    //点击树形更新表格
    handleNodeClick(obj) {
      this.$emit("handleNodeClick", obj);
      // this.currentTreeId = obj.id;
      // // console.log(this.currentTreeId)
      // /*let groupId = obj.id
      //   //请求表格数据
      //   this.$http({
      //     url: this.$http.adornUrl(`/mail/mailcontactor/list`),
      //     method: 'POST',
      //     params: this.$http.adornParams({
      //       groupId: groupId
      //     })
      //   }).then(({data}) => {
      //     this.platShareMenuList = data.data
      //   })*/
      //   if (this.operGroupVisiable) {
      //     this.setGrout(obj)
      //   }
    }
  }
};
</script>

<style lang="scss" scoped>

.AddressGroup{
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
    height: 404px;
    .title{
        border-bottom: 1px dashed #ccc;
        text-align: center;
        padding: 6px 0;
    }
    .el-tree{
        overflow-x: none; 
        height: 340px;
        /deep/ .el-tree-node__content{
            border-bottom: 1px dashed #ccc;
        }
    }
}


</style>