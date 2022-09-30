<template>
  <div>
    <div style="text-align: left">
        <el-button type="primary" @click='showDialog("事件类别新增")'>新增</el-button>
        <el-button type="primary" @click='showDialog("事件类别修改")'>修改</el-button>
        <el-button type="primary" @click='showDialog("事件类别删除")'>删除</el-button>
    </div>
    <div style="height: 500px;padding: 20px 0">
      <el-scrollbar style="height: 100%">
        <el-row>
          <el-col :span="10">
           <el-input
             placeholder="输入关键字进行过滤"
             v-model="filterText"
            ></el-input>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-tree :data="treedata" ref='tree' :props="defaultProps" node-key="id" :default-expanded-keys='treeKey' highlight-current @node-click='nodeClick' :filter-node-method="filterNode"></el-tree>
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
   <!--  弹框 --> 
      <el-dialog
        :title='title'
        :visible.sync="dialogVisible"
        width="30%"
        append-to-body
        :close-on-click-modal="false"
        center>
        <div>
         <el-form :label-position="labelPosition" label-width="60px">
          <el-form-item label="名称：">
            <el-input v-model="name" maxlength='20'></el-input>
          </el-form-item>
          <el-form-item label="上级：">
            <el-input v-model="upName" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: center;">
          <span style="margin-right: 30px">是否为涉非正常死亡事件类型</span>
          <el-radio v-model="radio" label="yes">是</el-radio>
          <el-radio v-model="radio" label="no">否</el-radio>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" v-if='title == "事件类别新增"'>
        <el-button @click="saveEventType('保存并新增')">保存并新增</el-button>
        <el-button type="primary" @click="saveEventType('保存并关闭')">保存并关闭</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-if='title == "事件类别修改"'>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEventType('保存修改')">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "eventTypeManagement",
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        treedata: [{
          name: '事件类型',
          id: 0,
          children: []
        }],
        breadList:['事件类型'],//获取当前树节点和其所有父级节点的lable
        nodeContent:{'id':0,'name':'事件类型'},//保存当前选择节点的内容,默认选中第一个
        treeKey:[0],
        title:'',
        dialogVisible:false,
        name:'',
        oldName:'',
        upName:'',
        labelPosition:'right',
        radio:'yes',
        filterText: '',
      }
    },
    watch: {
          filterText(val) {
            this.$refs.tree.filter(val);
          }
        },
    mounted() {
      this.getTreeData()
    },
    methods: {
      //获取事件类型树
      getTreeData() {
          let data = {};
          this.$api.getTree(data).then(res => {
            if (res.errorcode !=0){
              this.$message({
                message:res.msg,
                type:"error"
              });
              return
            }
            let treeData = res.data;
            console.log(res)
            this.treedata[0].children = JSON.parse(JSON.stringify(treeData));
            this.$nextTick(function(){
                this.treeKey = this.nodeContent.id === 0? [0]:[0,this.nodeContent.id];//设置默认展开
                this.$refs.tree.setCurrentKey(this.nodeContent.id);  //调用setCurrentKey方法设置当前节点高亮
            })
        })
      },
      //筛选
      filterNode(value, data) {
              if (!value) return true;
              return data.name.indexOf(value) !== -1;
        },
      showDialog(title){
         if(this.nodeContent == ''){
            this.$message({
              message: '请先选择要操作的事件',
              type: 'warning'
            });
            return;
         }
         this.title = title;
         console.log(this.nodeContent)
         if(title == '事件类别新增'){
              this.name = '';
              this.upName = this.breadList[0];
              this.radio = 'yes';
              this.dialogVisible = true;
         }else if(title == '事件类别修改'){
            if(this.nodeContent.name == '事件类型'){
               this.$message({
                message: '对此节点不可进行修改和删除操作',
                type: 'warning'
              });
            }else{
              let data = {
                        "data":{
                          "parameter":this.nodeContent.id,
                          "type":"eventTypeId"
                        }
                    };
                this.$api.eventType(data).then(res => {
                    console.log(res)
                    if (res.errorcode !=0){
                      this.$message({
                        message:res.msg,
                        type:"error"
                      });
                    }else{
                       this.name = this.breadList[0];
                       this.upName = this.breadList[1];
                       this.oldName = this.breadList[0];
                       this.radio = res.data.abnormalDeath;
                    }

                })
              this.dialogVisible = true;
            }
         }else if(title == '事件类别删除'){
             if(this.nodeContent.name == '事件类型'){
                  this.$message({
                      message: '对此节点不可进行修改和删除操作',
                      type: 'warning'
                    });
                  return
               }
             this.$confirm('是否删除该事件类型', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                let data = {
                     "data":{
                      "parameter":[this.nodeContent.id],
                      "type":"delete"
                    }
                  }
                  console.log(data);
                  this.$api.eventType(data).then((res) => {
                    console.log(res)
                    if(res.errorcode == 0){
                      this.$message({
                        type: 'success',
                        message: '删除成功!'
                      });
                      this.breadList = ['事件类型'],//获取当前树节点和其所有父级节点的lable
                      this.nodeContent = {'id':0,'name':'事件类型'},//保存当前选择节点的内容,默认选中第一个
                      this.getTreeData();
                    } else{
                        this.$message.error(res.msg);
                    }
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                });
              });
         }
      },
      nodeClick(e){ //树节点点击
            console.log(e)
            let tree = this.$refs.tree;
            this.breadList = []; //初始化
            this.nodeContent = e;
            if (!e.groups){
                this.getTreeNode(tree.getNode(e.id));
            }
        },
      getTreeNode(node){ //获取当前树节点和其所有父级节点
            if (node) {
                if (node.label !== undefined) {
                    this.breadList.push(node.label); //在数组头部添加元素
                    this.getTreeNode(node.parent); //递归
                }
            }
        },
      saveEventType(button){
           console.log(this.name,this.upName,this.radio);
           this.name = this.trim(this.name);
           if(this.name == ''){
             this.$message.error('名称不能为空');
           }else{
                /* 修改事件类型 */
                if(button == '保存修改'){
                   let data = {
                      "data":{
                        "parameter":{
                           "name":this.name,
                           "oldName":this.oldName,
                           "id":this.nodeContent.id,
                           "abnormalDeath":this.radio
                          },
                        "type":"update"
                      }
                  };
                  this.$api.eventType(data).then(res => {
                      if (res.errorcode !=0){
                        this.$message({
                          message:res.msg,
                          type:"error"
                        });
                      }else{
                        this.$message({
                          message: '修改成功',
                          type: 'success'
                        });
                        this.dialogVisible = false;
                        this.breadList[0] = this.name;
                        this.getTreeData();
                      }

                  })
                }
                /* 保存事件类型 */
                else{
                  let data = {
                      "data":{
                        "parameter":{
                           "name":this.name,
                           "pid":this.nodeContent.id,
                           "abnormalDeath":this.radio
                          },
                        "type":"add"
                      }
                  };
                  console.log(data)
                this.$api.eventType(data).then(res => {
                    console.log(res)
                    if (res.errorcode !=0){
                      this.$message({
                        message:res.msg,
                        type:"error"
                      });
                    }else{
                      if(button == '保存并关闭'){
                          this.dialogVisible = false;
                      }else if(button == '保存并新增'){
                          this.name = '';
                      }
                      this.getTreeData();
                    }

                })
              }
           }
        },
      trim(str){
        return str.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
      }
    }
  }
</script>

<style scoped>
  .tree {
    height: 676px;
    background-color: white;
    border: 1px solid rgba(211, 215, 219, 1);
  }

  >>> .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  >>> .el-tree-node__content {
    margin-top: 14px;
  }

  /*>>>.el-tree-node>.el-tree-node__children{*/
  /*overflow: visible !important;*/
  /*}*/
  >>> .treeDiv {
    width: 100%;
  }

  >>> .leftTree {
    display: inline-block;
    width: 70%;
    text-align: left;
  }

  >>> .rightTree {
    display: inline-block;
    width: 30%;
  }

</style>
