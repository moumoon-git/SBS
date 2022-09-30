<template>
  <div class="opearationTree">
    <div class="opearation">
        <ul>
            <li @click="refresh">
                <i class="el-icon-refresh"></i>
                刷新
            </li>
            <li>
                <i class="el-icon-plus"></i>
                新增
            </li>
            <li @click="delData">
                <i class="el-icon-delete"></i>
                删除
            </li>
        </ul>

        <div id="tree" style="background-color:#ddd;height:616px;">
          <el-scrollbar
            wrap-class="list"
            wrap-style="color: red;max-height:650px;"
            view-class="view-box"
            :native="false"
          >
            <el-tree
              class="treeboxbotten"
              show-checkbox
              draggable
              :default-expand-all="false"
              :data="list"
              :props="listProps"
              :default-checked-keys="checkedIds"
              node-key="id"
              style="padding-top: 10px;"
              current-node-key
              highlight-current
              :filter-node-method="filterNode"
               @node-click="handleNodeClick"
              ref="tree"
            >
            </el-tree>
          </el-scrollbar>
        </div>
    </div>
  </div>
</template>

<script>

export default {
  props:['list','listProps'],
  name: "sms_template",
  data() {
    return {
      dialogFormVisible:true,
      currentTreeId : [],
      checkedIds: [], //当前选中的id数组
    };
  },
   watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
      filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //点击树形更新表格
    handleNodeClick(obj) {
      this.currentTreeId = []
      // console.log('obj++++++++++++++++++++++++++++++++++++++++',obj)
      this.$emit("handleNodeClick", obj);
      this.currentTreeId.push(obj.id);
      if (obj.children !== '' && obj.children !== null) {
        obj.children.map(v=>{
          this.currentTreeId.push(v.id)
        })
      }
      // console.log('this.currentTreeId++++++++++++++++++++++++++++++++++++++++++++++++',this.currentTreeId)
      // console.log(this.currentTreeId)
      /*let groupId = obj.id
        //请求表格数据
        this.$http({
          url: this.$http.adornUrl(`/mail/mailcontactor/list`),
          method: 'POST',
          params: this.$http.adornParams({
            groupId: groupId
          })
        }).then(({data}) => {
          this.platShareMenuList = data.data
        })*/
    },
    // 更新
    refresh(){
      this.$emit('refreshData')
    },
    // 删除
    delData(){
      this.$confirm("此操作将永久删除该模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(`/message/messagetemple/delete`),
            method: "POST",
            data: this.$http.adornData({
              ids: this.currentTreeId
            },false)
          }).then(({ data }) => {
            if (data && data.code == 0) {
                this.$emit('refreshData')
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
            }else{
              this.$message({
                type: "info",
                message: "删除失败"
              });
            }
          });
        })
    }
  },
};
</script>

<style scoped lang="scss">
*{
  margin: 0;
  padding: 0;
}
li{
    list-style: none;
}
.opearationTree{
    .opearation{
        ul{
            display: flex;
            justify-content: space-around;
            height: 40px;
            line-height: 40px;
            li{
              cursor: pointer;
            }
        }
    }
}
  .el-dialog .el-dialog__body{
      padding-top:10px;
  }
</style>
