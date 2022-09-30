<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="处置过程ID" prop="emergencyHandleProcessId">
      <el-input v-model="dataForm.emergencyHandleProcessId" placeholder="处置过程ID"></el-input>
    </el-form-item>
    <el-form-item label="文件地址" prop="url">
      <el-input v-model="dataForm.url" placeholder="文件地址"></el-input>
    </el-form-item>
    <el-form-item label="文件名" prop="name">
      <el-input v-model="dataForm.name" placeholder="文件名"></el-input>
    </el-form-item>
    <el-form-item label="文件类型 0 图片  1文件" prop="type">
      <el-input v-model="dataForm.type" placeholder="文件类型 0 图片  1文件"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="更新时间" prop="updateTime">
      <el-input v-model="dataForm.updateTime" placeholder="更新时间"></el-input>
    </el-form-item>
    <el-form-item label="删除状态 0 未删除  1已删除" prop="isDeleted">
      <el-input v-model="dataForm.isDeleted" placeholder="删除状态 0 未删除  1已删除"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" plain size="small">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" size="small">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          emergencyHandleProcessId: '',
          url: '',
          name: '',
          type: '',
          createTime: '',
          updateTime: '',
          isDeleted: ''
        },
        dataRule: {
          emergencyHandleProcessId: [
            { required: true, message: '处置过程ID不能为空', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '文件地址不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '文件名不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '文件类型 0 图片  1文件不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          updateTime: [
            { required: true, message: '更新时间不能为空', trigger: 'blur' }
          ],
          isDeleted: [
            { required: true, message: '删除状态 0 未删除  1已删除不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/emergency/emergencyhandleprocessannex/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.emergencyHandleProcessId = data.emergencyHandleProcessAnnex.emergencyHandleProcessId
                this.dataForm.url = data.emergencyHandleProcessAnnex.url
                this.dataForm.name = data.emergencyHandleProcessAnnex.name
                this.dataForm.type = data.emergencyHandleProcessAnnex.type
                this.dataForm.createTime = data.emergencyHandleProcessAnnex.createTime
                this.dataForm.updateTime = data.emergencyHandleProcessAnnex.updateTime
                this.dataForm.isDeleted = data.emergencyHandleProcessAnnex.isDeleted
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/emergency/emergencyhandleprocessannex/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'emergencyHandleProcessId': this.dataForm.emergencyHandleProcessId,
                'url': this.dataForm.url,
                'name': this.dataForm.name,
                'type': this.dataForm.type,
                'createTime': this.dataForm.createTime,
                'updateTime': this.dataForm.updateTime,
                'isDeleted': this.dataForm.isDeleted
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
