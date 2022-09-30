<!--@author：llp-->
<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="isDialogVisible"
      @close="closeDialog"
      :close-on-click-modal="false"
    >
      <el-form ref="terminalForm" :model="terminalForm" :rules="rules" label-position="right" label-width="100px">
        <el-row>
          <el-form-item label="终端名称:" prop="name">
            {{terminalForm.name}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="终端号码:" prop="uri">
            {{terminalForm.uri}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="视频点名:">
            <el-col :span="2">
              {{terminalForm.roll==0?"未授权":(terminalForm.roll==1?"授权":"")}}
            </el-col>
            <el-col :span="22" style="text-align: left">(授权后才可以在视频点名中邀请此成员)</el-col>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="地点:" prop="incidentSite">
            {{terminalForm.incidentSite}}
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
    name: "terminalDialog",
    data() {
      return {
        title: '',
        isDialogVisible: false,
        treeData: [],
        terminalForm: {
          id: '',//id
          name: '',//终端名称
          uri: '',//终端好吗
          roll: '',//是否视频点名
          incidentSite: "", //地点
        },//终端详细信息
        rules: {},//验证规则
        groupIds: [],//选中的树分组
        defaultProps: {
          children: 'children',
          label: 'name',
          plusIcon: true,
        },
      }
    },
    mounted() {
      this.getTerminalGroupListData();
    },
    methods: {
      //获取终端分组
      getTerminalGroupListData() {
        let data = {
          displayDefault: false
        };
        this.$api.terminalGroupList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.treeData = res.data;
        })
      },
      //把表格内属性显示到列表中
      showData(row) {
        this.terminalForm.id = row.id;
        this.terminalForm.name = row.name;
        this.terminalForm.uri = row.uri;
        this.terminalForm.roll = row.roll;
        this.terminalForm.incidentSite = row.address;
        if (row.groupIds != 0) {
          this.groupIds = row.groupIds;
        }
      },
      //关闭模态框
      closeDialog() {
        this.isDialogVisible = false;
        this.$nextTick(()=>{
          this.$refs['terminalForm'].resetFields();
           this.terminalForm ={
            id: '',//id
            name: '',//终端名称
            uri: '',//终端好吗
            roll: '',//是否视频点名
            incidentSite: "", //地点
          }//终端详细信息
          this.$refs.tree.setCheckedKeys([]);
        });
      },
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
