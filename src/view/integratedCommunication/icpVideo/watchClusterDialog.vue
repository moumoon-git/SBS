<!--@author：llp-->
<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="isDialogVisible"
      @close="closeDialog"
      :close-on-click-modal="false"
    >
      <el-form ref="clusterForm" :model="clusterForm" :rules="rules" label-position="right" label-width="100px">
        <el-row>
          <el-form-item label="集群名称:">
            {{clusterForm.name}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="集群号码:">
            {{clusterForm.number}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="集群类型:">
            {{clusterForm.type}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注:">
            {{clusterForm.remark}}
          </el-form-item>
        </el-row>
      </el-form>
      <el-row>
        选择分组
      </el-row>
      <el-row>
        <div class="tree">
          <el-scrollbar style="height: 100%">
            <el-tree
              :data="treeData"
              ref="tree"
              show-checkbox
              node-key="id"
              :default-checked-keys="groupIds"
              :props="defaultProps">
            </el-tree>
          </el-scrollbar>
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "clusterDialog",
    data() {
      return {
        title: '',//弹窗标题,
        isDialogVisible: false,
        clusterForm: {
          id: '',
          name: '',//集群名称
          number: '',//集群号码
          remark: '',//备注
          type:'',//类型
        },
        rules: {
          name: [
            {required: true, message: '内容不能为空', trigger: 'blur'},
          ],
          number: [
            {required: true, message: '内容不能为空', trigger: 'blur'},
          ],
          type: [
            {required: true, message: '内容不能为空', trigger: 'blur'},
          ],
        },//校验规则
        treeData: [],
        groupIds: [],//选中的树分组
        defaultProps: {
          children: 'children',
          label: 'name',
          plusIcon: true,
        },
        options:[],
      }
    },
    mounted() {
      this.getTalkGroupListTree();
      this.getPcode()
    },
    methods: {
      //获取type的字典表
      getPcode(){
        this.$api.getByPcode({pcode:'talking_group_type'}).then(res => {
            if (res.errorcode == 0) {
              this.options=res.data
            }
        })
      },
      //获取集群分组
      getTalkGroupListTree() {
        let data = {
          displayDefault: false
        };
        this.$api.talkGroupListTree(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return
          }
          this.treeData = res.data;
        })
      },
      //展示数据
      showData(row) {
        this.clusterForm.id = row.id;
        this.clusterForm.name = row.name;
        this.clusterForm.number = row.number;
        this.clusterForm.remark = row.remark;
        this.options.map(v=>{
          if (((row.type==0)?'':row.type) == v.id) {
            this.clusterForm.type = v.name
          }
        })
        if (row.groupIds != 0) {
          this.groupIds = row.groupIds;
        } else {
          this.groupIds = 0;
        }
      },
      //关闭模态框
      closeDialog() {
        this.isDialogVisible = false;
        this.$refs['clusterForm'].resetFields();
        this.$refs.tree.setCheckedKeys([]);
         this.clusterForm ={
          id: '',
          name: '',//集群名称
          number: '',//集群号码
          remark: ''//备注
        };
      },
      //模态框的确认方法
      submit() {
        if (this.title == '新增集群信息') {
          this.addTalkGroup();
        }
        if (this.title == '修改集群信息') {
          this.editTalkGroup();
        }
      },
      //新增集群信息方法
      addTalkGroup(){
        this.$refs['clusterForm'].validate((valid) => {
          if (valid){
            let data = {
              groupId:this.$refs.tree.getCheckedKeys(),
              number:this.clusterForm.number,
              displayName:this.clusterForm.name,
              remark:this.clusterForm.remark,
              type:this.clusterForm.type
            };
            this.$api.addTalkGroup(data).then(res => {
              if (res.errorcode!=0){
                this.$message.error(res.msg);
                return;
              }
              this.$message.success("新增成功");
              this.closeDialog();
              this.$emit("getTableData");
            });
          }
        })
      },
      //修改集群信息方法
      editTalkGroup() {
        this.$refs['clusterForm'].validate((valid) => {
          if (valid){
            let data = {
              id: this.clusterForm.id,
              groupId:this.$refs.tree.getCheckedKeys(),
              remark: this.clusterForm.remark,
              number:this.clusterForm.number,
              displayName:this.clusterForm.name,
              type:this.clusterForm.type
            };
            this.$api.editTalkGroup(data).then(res => {
              if (res.errorcode!=0){
                this.$message.error(res.msg);
                return;
              }
              this.$message.success("修改成功");
              this.closeDialog();
              this.$emit("getTableData");
            });
          }
        })
      }
    }
  }
</script>

<style scoped>
  .tree {
    height: 240px;
    background-color: white;
    border: 1px solid rgba(211, 215, 219, 1);
  }
</style>
