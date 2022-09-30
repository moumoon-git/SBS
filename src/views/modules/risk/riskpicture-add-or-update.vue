<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="图片唯一标识" prop="uuid">
      <el-input v-model="dataForm.uuid" placeholder="图片唯一标识"></el-input>
    </el-form-item>
    <el-form-item label="本地文件路径" prop="localUrl">
      <el-input v-model="dataForm.localUrl" placeholder="本地文件路径"></el-input>
    </el-form-item>
    <el-form-item label="类型: 0 :人抓拍原图,1：抓拍人脸图,2告警人脸图,3:相似车牌图片,4:相似过车图片,5:车报警缩略图" prop="type">
      <el-input v-model="dataForm.type" placeholder="类型: 0 :人抓拍原图,1：抓拍人脸图,2告警人脸图,3:相似车牌图片,4:相似过车图片,5:车报警缩略图"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
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
          uuid: '',
          localUrl: '',
          type: ''
        },
        dataRule: {
          uuid: [
            { required: true, message: '图片唯一标识不能为空', trigger: 'blur' }
          ],
          localUrl: [
            { required: true, message: '本地文件路径不能为空', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '类型: 0 :人抓拍原图,1：抓拍人脸图,2告警人脸图,3:相似车牌图片,4:相似过车图片,5:车报警缩略图不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/risk/riskpicture/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.uuid = data.riskpicture.uuid
                this.dataForm.localUrl = data.riskpicture.localUrl
                this.dataForm.type = data.riskpicture.type
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
              url: this.$http.adornUrl(`/risk/riskpicture/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'uuid': this.dataForm.uuid,
                'localUrl': this.dataForm.localUrl,
                'type': this.dataForm.type
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
