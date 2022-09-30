<template>
  <el-dialog :title="dialogTitle" width='400px' :visible.sync="visible" append-to-body :close-on-click-modal="false" :before-close="closeDialog" @open='getData'>
    <div style="height: 600px;padding: 5px 0;">
      <el-row style="height: 3%;padding-left: 30px;">
        <span>*请拖拽数据进行排序</span>
      </el-row>
      <el-scrollbar style="height: 87%">
        <el-row>
          <el-col :span="24">
            <el-tree :data="treeData" ref='tree' :props="defaultProps" node-key="id" draggable :allow-drop="allowDrop"></el-tree>
          </el-col>
        </el-row>
      </el-scrollbar>
      <el-row style="text-align: center;height: 10%">
        <el-button style="margin-top: 4px" type="primary" @click='save()'>保存</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
    export default {
      name: "orderList",
      props:['dialogTitle','visible','type','pid','treeData'],
      data() {
        return {
          defaultProps: {
            children: 'children',
            label: 'name',
          },
          treeData:[]
        }
      },
      methods:{
        getData(){

        },

        allowDrop(draggingNode, dropNode, type) {
          //不允许拖动成为子节点
          return type !== 'inner';
        },

        closeDialog(){
          this.$emit('closeDialog');
        },

        save(){
          if (this.treeData !== undefined && this.treeData.length > 0){
            let ids = [];
            for (let i = 0; i < this.treeData.length; i++){
              let data = this.treeData[i];
              ids.push(data.id);
            }
            switch (this.type) {
              case 'area':
                let data = {
                  pid:this.pid,
                  ids:ids
                };
                this.$api.updateAreaOrder(data).then(res => {
                  if (res.errorcode !== 0){
                    this.$message({
                      message: res.msg,
                      type:"error"
                    });
                    return;
                  }
                  this.$emit('callBack');
                  this.$message({
                    message: "保存成功",
                    type:"info"
                  });
                });
                break;
              default:
                break;
            }

          }
        }
      }
    }
</script>

<style scoped>
  >>> .el-dialog__body {
    padding: 10px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
</style>
