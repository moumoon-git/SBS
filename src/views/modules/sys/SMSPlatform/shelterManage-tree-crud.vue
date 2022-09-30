<template>
  <el-dialog
    title="新增平台组"
    :close-on-click-modal="false"
    :visible.sync="visible"
    v-dialogDrag
    width="500px">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
                 label-width="150px">
          <el-form-item label="路由类型" >
            <el-select v-model="dataForm.type" placeholder="请选择路由类型" :disabled="type!==2">
              <el-option label="短信" :value="0"></el-option>
              <el-option label="传真" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="平台名称">
            <el-input v-model="dataForm.SMSName" placeholder="请填写平台名称" v-bind:readonly="type===1"></el-input>
          </el-form-item>

          <el-form-item label="用户名">
            <el-input v-model="dataForm.userName" placeholder="请填写用户名" v-bind:readonly="type===1"></el-input>
          </el-form-item>

          <el-form-item label="密码">
            <el-input v-model="dataForm.password" placeholder="请填写密码" v-bind:readonly="type===1"></el-input>
          </el-form-item>

          <el-form-item label="url">
            <el-input v-model="dataForm.url" placeholder="请填写url" v-bind:readonly="type===1"></el-input>
          </el-form-item>
          <el-form-item label="说明" >
            <el-input v-model="dataForm.desc" placeholder="请填写配置说明" v-bind:readonly="type===1"></el-input>
          </el-form-item>

        </el-form>
      <el-footer class="foor">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </el-footer>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        //分组弹出的开关
        newgroups:false,
        visible: false,
        type: 0,
        dataForm: {
          id: 0,
          type: null,
          parentId: 0,
          SMSName: '',
          userName: '',
          password: '',
          url: '',
          desc: '',
          platformId: '',
        },
        eventTypeList: [],//树的数据
        eventTypeListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataRule: {
          eventTypeParentName: [
            {required: true, message: '请选择一个分组', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '分组名称不能为空', trigger: 'blur'},
            { min: 2, max: 10, message: '长度在2到10字左右', trigger: 'blur' }
          ],
        }
      }
    },

    methods: {

      init (id, currenTreeObject, type) {
        this.dataForm.id = id || 0
        this.visible = true
        this.type = type

        if(type == 1 || type == 3){
          this.getMessageInfo();
        }

      },

      //查看修改
      getMessageInfo(){

        this.$http({
          url: this.$http.adornUrl(`/message/messageSetting/info/${this.dataForm.id}`),
          method: "get",
          params: this.$http.adornParams()
        }).then(({ data }) => {
          if (data && data.code === 0) {
              this.dataForm.SMSName = data.MessageSettingEntity.name;
              this.dataForm.userName = data.MessageSettingEntity.userId;
              this.dataForm.password = data.MessageSettingEntity.password;
              this.dataForm.url = data.MessageSettingEntity.url;
              this.dataForm.desc = data.MessageSettingEntity.remark;
              this.dataForm.type = data.MessageSettingEntity.type
          } else {
            this.$message.error(data.msg)
          }
        });
      },


      // 表单提交
      dataFormSubmit () {

        this.$refs['dataForm'].validate((valid) => {
          const requestData = {
            'id': this.dataForm.id,
            'name': this.dataForm.SMSName,
            "userId":this.dataForm.userName,
            "password":this.dataForm.password,
            "url":this.dataForm.url,
            "remark":this.dataForm.desc,
          }
          if(this.type === 2) {
            requestData.type = this.dataForm.type
          }
          if (valid && (this.type === 2 || this.type === 3)) {
            this.$http({
              url: this.$http.adornUrl(`/message/messageSetting/${this.type === 2 ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData(
                requestData
              )
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.visible = false
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1000,
                })
                this.$emit('refreshEventTypeDataList')
                this.$emit('close')
              } else {
                this.$message.error("请选择你要新增到的分组节点")
              }
            })
          }
        })
      },

    }
  }
</script>
<style scoped>
  .foor {
    color: #333;
    text-align: center;
    line-height: 60px;
  }
</style>
