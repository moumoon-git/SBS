<!--@author：llp-->
<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="isDialogVisible"
      @close="closeDialog"
      :close-on-click-modal="false"
    >
      <el-form ref="videoForm" :model="videoForm" :rules="rules" label-position="right" label-width="100px">
        <el-row>
          <el-form-item label="设备信息:" prop="name">
            {{videoForm.name}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="设备号码:" prop="indexCode">
            {{videoForm.indexCode}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="显示名称:" prop="deviceName">
            {{videoForm.deviceName}}
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="地点:" prop="incidentSite">
            {{videoForm.incidentSite}}
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
              :check-on-click-node='true'
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
    name: "videoDialog",
    data() {
      return {
        title: '视频设备信息',
        isDialogVisible: false,
        treeData: [],
        isUpdateName: 'false',//控制显示名称是否可以进行编辑
        isSave: true,//是否展示保存并关闭按钮
        videoForm: {
          id: '',//设备id
          name: '',//设备信息
          indexCode: '',//设备号码
          deviceName: '',//显示名称
          incidentSite: "", //地点
        },//视频详细信息
        rules: {},//视频验证规则
        groupIds: [],//选中的树分组
        defaultProps: {
          children: 'children',
          label: 'name',
          plusIcon: true,
        },
      }
    },
    mounted() {
      this.getVideoGroupTree();
    },
    methods: {
      //获取视频分组树
      getVideoGroupTree() {
        let data = {
          displayDefault: false
        };
        this.$api.videoGroupList(data).then(res => {
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
      //获取视频分组树并禁用
      getDisableVideoGroupTree() {
           let data = {
          displayDefault: false
        };
        this.$api.videoGroupList(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          res.data.forEach(item => {
            item['disabled'] = true
            if(item.children.length !== 0) {
              item.children.forEach(item => {
                item['disabled'] = true
              })
            }
          })
          this.treeData = res.data;
        })
      },
      //显示视频详细信息
      showData(row) {
        this.videoForm.id = row.id;
        this.videoForm.name = row.name;
        this.videoForm.indexCode = row.indexCode;
        this.videoForm.deviceName = row.deviceName;
        this.videoForm.incidentSite = row.address;
        if (row.groupIds!=0){
          this.groupIds = row.groupIds;
        }
      },
      //关闭模态框方法
      closeDialog() {
        this.isSave = true//关闭模态框时重置保存与关闭按钮的状态
        this.isDialogVisible = false;
        this.$nextTick(()=>{
          this.$refs['videoForm'].resetFields();
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
