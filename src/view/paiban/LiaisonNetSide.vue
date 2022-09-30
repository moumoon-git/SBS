<template>
  <el-dialog :title="title" :visible.sync="Modal" width="540px" center @close="closeDialog" top="15vh"
             :close-on-click-modal="false" append-to-body>
    <el-form label-width="100px" :model="ruleForm" :rules="rules" ref="ruleForm" @submit.native.prevent>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="上级分组:" style="text-align: left;">
            <el-input v-model="parentName" style="width: 310px;" type="text" disabled></el-input>
            <el-button type="primary" v-if="isDisplay" size="mini" :disabled="disabled" @click="onSelectTree()">选择</el-button>
          </el-form-item>
          <el-form-item label="分组名称:" prop="name">
            <el-input v-model="ruleForm.name" style="width: 360px;" type="text" :disabled="disabled"
                      :maxlength="maxlength.VcName"
                      show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="isDisabled" class="dialog-footer">
      <el-button type="primary" size="medium" @click="save('ruleForm')">确认</el-button>
      <el-button type="info" size="medium" @click="cancleDialog('ruleForm')">取消</el-button>
    </div>
    <div v-else class="dialog-footer">
      <el-button type="primary" size="medium" @click="cancleDialog('ruleForm')">确认</el-button>
    </div>
    <!-- 上级分组 -->
    <superior-grouping ref="mychild" @treeChild="treeChild"></superior-grouping>
  </el-dialog>
</template>

<script>
import SuperiorGrouping from './SuperiorGrouping'
import regular from './regular'

export default {
  name: "LiaisonNetSide",
  inject: ['reload'],
  components: {
    'superior-grouping': SuperiorGrouping
  },
  data() {
    return {
      	isDisplay:true,
      title: '', //标题
      dialogTitle: '',
      Modal: false, //模态框
      disabled: false,
      isDisabled: true,
      type: '', //判断是新增还是修改
      ruleForm: {
        name: '', //名称

      },
      rules: { //正则
        name: [{
          required: true,
          validator: regular.currencyRules,
          trigger: 'blur'
        }],

      },
      ID: '',
      parentID: '',
      maxlength: [],
      parentName: '',
    }
  },
  created() {
    let params = {
      table: "app_contactor_group",
    }
    this.$http.post(window.g.ApiUrl + '/common/getColumnLength', params).then(res => {
      this.maxlength.VcName = res.data.VcName;
    });
  },
  methods: {
    treeChild(data) { //数据回传
      console.log(data);
      this.parentID = data.treeID;
      this.parentName = data.treeName;
    },
    openModal(fromData, type) {
      this.Modal = true;
      switch (type) {
        case 'add': //新增
          this.disabled = false;
          this.isDisabled = true;
          this.type = 'add';
          this.title = '联系人分组新增';
          this.$nextTick(() => {
            this.$refs['ruleForm'].resetFields();
            this.ID = '';
            this.parentID = fromData.treeID;
            this.parentName = fromData.treeName;
          })
          break;
        default:
          if (type == 'detail') {
            	this.isDisplay = false;
            this.disabled = true;
            this.isDisabled = false;
            this.title = '联系人分组查看';
            this.type = 'detail';
          } else if (type == 'update') {
            	this.isDisplay = true;
            this.disabled = false;
            this.isDisabled = true;
            this.title = '联系人分组修改';
            this.type = 'update';
          }
          this.$nextTick(() => {
            this.ruleForm.name = fromData.treeName;
            this.ID = fromData.treeID;
            this.parentID = fromData.parentID;
            this.parentName = fromData.parentName;
          })
          break;
      }
    },
    save(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          if (this.type == 'update') {
            let test = {
              pid: this.parentID,
              id: this.ID
            };
            let formData = Object.assign(test, this.ruleForm);
            let data = {
              data: formData,
              type: 'phone'
            }
            let CallbackReload = this;
            this.$http('/emergency/preparation/contactorGroup/update', data, CallbackReload).then(res => {
              let data = {
                treeID: res.data.id,
                treeName: res.data.name,
                parentID: this.parentID,
                parentName: this.parentName
              }
              this.Modal = false;
              this.$emit("childMethod", data);
              this.$message({
                message: '修改成功',
                type: 'success'
              });

            })
          } else if (this.type == 'add') {
            let test = {
              pid: this.parentID
            };
            let formData = Object.assign(test, this.ruleForm);
            let data = {
              data: formData,
              type: 'phone'
            }
            let CallbackReload = this;
            this.$http('/emergency/preparation/contactorGroup/add', data, CallbackReload).then(res => {
              this.Modal = false;
              let data = {
                treeID: res.data.id,
                treeName: res.data.name,
                parentID: this.parentID,
                parentName: this.parentName
              }
              this.$emit("childMethod", data);
              this.$message({
                message: '新增成功',
                type: 'success'
              });
            })
          }
        } else {
          return false;
        }
      });

    },
    onSelectTree() {//选择上级分组
      let URL, data;
      if (this.type == 'add') {
        data = {
          platformId:''
        }
        URL = '/mail/mailgroup/list';
      } else if (this.type == 'update') {
        data = {
          type: 'phone',
          id: this.ID,
          menuId: this.$store.state.menu.menuID
        }
        URL = '/emergency/preparation/contactorGroup/getAllGroup';
      }
      let CallbackReload = this;
      this.$http.get(window.SITE_CONFIG["baseUrl"] + URL, {params:data}, CallbackReload).then(res => {
        let data = [...res.data.data]
        data = JSON.parse(JSON.stringify(data).replace(/name/g, "label"))
        // console.log(data);
        this.$refs.mychild.openModal(data, this.parentID, this.parentName);
      })
    },
    cancleDialog(ruleForm) { //关闭模态框并清除规则
      this.Modal = false;
      this.$refs[ruleForm].resetFields();
    },
    closeDialog() { // 对话框关闭事件
      this.$refs['ruleForm'].resetFields();
    }

  }
}
</script>

<style>
@import './common.css';
</style>
<style scoped>
.dialog-footer {
  text-align: center;
  padding-top: 30px;
}

/* .el-tree-node__expand-icon {
  color: #606266;
} */
.el-form-item >>> .el-form-item__content {
  line-height: 38px;
}

.el-input >>> .el-input__inner {
  padding: 0px 54px 0 10px;
}
</style>
