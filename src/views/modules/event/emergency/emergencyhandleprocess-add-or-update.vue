<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="要勤信息ID" prop="emergencyInfoId">
      <el-input v-model="dataForm.emergencyInfoId" placeholder="要勤信息ID"></el-input>
    </el-form-item>
    <el-form-item label="处置情况" prop="content">
      <el-input v-model="dataForm.content" placeholder="处置情况"></el-input>
    </el-form-item>
    <el-form-item label="操作记录（电话、短信才会用到）" prop="operation">
      <el-input v-model="dataForm.operation" placeholder="操作记录（电话、短信才会用到）"></el-input>
    </el-form-item>
    <el-form-item label="当type=1时:电话记录ID，type=2时:短信记录ID" prop="dataSourceId">
      <el-input v-model="dataForm.dataSourceId" placeholder="当type=1时:电话记录ID，type=2时:短信记录ID"></el-input>
    </el-form-item>
    <el-form-item label="类型(0要勤登记 1电话记录  2短信记录  3处置过程)" prop="type">
      <el-input v-model="dataForm.type" placeholder="类型(0要勤登记 1电话记录  2短信记录  3处置过程)"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="createTime">
      <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="更新时间" prop="updateTime">
      <el-input v-model="dataForm.updateTime" placeholder="更新时间"></el-input>
    </el-form-item>
    <el-form-item label="最后登记人ID" prop="operatorId">
      <el-input v-model="dataForm.operatorId" placeholder="最后登记人ID"></el-input>
    </el-form-item>
    <el-form-item label="登记人姓名" prop="operatorName">
      <el-input v-model="dataForm.operatorName" placeholder="登记人姓名"></el-input>
    </el-form-item>
    <el-form-item label="是否删除 0未删除  1已删除" prop="isDeleted">
      <el-input v-model="dataForm.isDeleted" placeholder="是否删除 0未删除  1已删除"></el-input>
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
          emergencyInfoId: '',
          content: '',
          operation: '',
          dataSourceId: '',
          type: '',
          createTime: '',
          updateTime: '',
          operatorId: '',
          operatorName: '',
          isDeleted: ''
        },
        dataRule: {
          emergencyInfoId: [
            { required: true, message: '要勤信息ID不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '处置情况不能为空', trigger: 'blur' }
          ],
          operation: [
            { required: true, message: '操作记录（电话、短信才会用到）不能为空', trigger: 'blur' }
          ],
          dataSourceId: [
            { required: true, message: '当type=1时:电话记录ID，type=2时:短信记录ID不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '类型(0要勤登记 1电话记录  2短信记录  3处置过程)不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          updateTime: [
            { required: true, message: '更新时间不能为空', trigger: 'blur' }
          ],
          operatorId: [
            { required: true, message: '最后登记人ID不能为空', trigger: 'blur' }
          ],
          operatorName: [
            { required: true, message: '登记人姓名不能为空', trigger: 'blur' }
          ],
          isDeleted: [
            { required: true, message: '是否删除 0未删除  1已删除不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/emergency/emergencyhandleprocess/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.emergencyInfoId = data.emergencyHandleProcess.emergencyInfoId
                this.dataForm.content = data.emergencyHandleProcess.content
                this.dataForm.operation = data.emergencyHandleProcess.operation
                this.dataForm.dataSourceId = data.emergencyHandleProcess.dataSourceId
                this.dataForm.type = data.emergencyHandleProcess.type
                this.dataForm.createTime = data.emergencyHandleProcess.createTime
                this.dataForm.updateTime = data.emergencyHandleProcess.updateTime
                this.dataForm.operatorId = data.emergencyHandleProcess.operatorId
                this.dataForm.operatorName = data.emergencyHandleProcess.operatorName
                this.dataForm.isDeleted = data.emergencyHandleProcess.isDeleted
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
              url: this.$http.adornUrl(`/emergency/emergencyhandleprocess/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'emergencyInfoId': this.dataForm.emergencyInfoId,
                'content': this.dataForm.content,
                'operation': this.dataForm.operation,
                'dataSourceId': this.dataForm.dataSourceId,
                'type': this.dataForm.type,
                'createTime': this.dataForm.createTime,
                'updateTime': this.dataForm.updateTime,
                'operatorId': this.dataForm.operatorId,
                'operatorName': this.dataForm.operatorName,
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
