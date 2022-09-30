<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="140px">
    <el-form-item label="平台类型名称" prop="typeName">
      <el-input v-model="dataForm.typeName" placeholder="平台类型名称"></el-input>
    </el-form-item>
    <el-form-item label="显示顺序" prop="orderNum">
      <el-input v-model="dataForm.orderNum" placeholder="显示顺序"></el-input>
    </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
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
          typeName: '',
          orderNum: '',
          status: '',
          createUserId: '',
          gmtCreate: '',
          modifiedUserId: ''
        },
       dataRule: {
          typeName: [
            { required: true, message: '平台类型名称不能为空', trigger: 'blur' }
          ],
          orderNum: [
            { required: true, message: '显示顺序不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态（0正常 1停用）不能为空', trigger: 'blur' }
          ],
          isDeleted: [
            { required: true, message: '删除标志（0代表存在 1代表删除）不能为空', trigger: 'blur' }
          ],
          createUserId: [
            { required: true, message: '创建者id不能为空', trigger: 'blur' }
          ],
          gmtCreate: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          gmtModified: [
            { required: true, message: '更新时间不能为空', trigger: 'blur' }
          ],
          modifiedUserId: [
            { required: true, message: '更新者id不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/sys/platformtype/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
             if (data && data.code === 0) {
                this.dataForm.typeName = data.sysPlatformType.typeName
                this.dataForm.orderNum = data.sysPlatformType.orderNum
                this.dataForm.status = data.sysPlatformType.status
                this.dataForm.isDeleted = data.sysPlatformType.isDeleted
                this.dataForm.createUserId = data.sysPlatformType.createUserId
                this.dataForm.gmtCreate = data.sysPlatformType.gmtCreate
                this.dataForm.gmtModified = data.sysPlatformType.gmtModified
                this.dataForm.modifiedUserId = data.sysPlatformType.modifiedUserId
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
              url: this.$http.adornUrl(`/sys/platformtype/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
             data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'typeName': this.dataForm.typeName,
                'orderNum': this.dataForm.orderNum,
                'status': this.dataForm.status,
                'isDeleted': this.dataForm.isDeleted,
                'createUserId': this.dataForm.createUserId,
                'gmtCreate': this.dataForm.gmtCreate,
                'gmtModified': this.dataForm.gmtModified,
                'modifiedUserId': this.dataForm.modifiedUserId
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
