<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="类别名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="类别名称"></el-input>
    </el-form-item>
    <el-form-item label="" prop="parentId">
      <el-input v-model="dataForm.parentId" placeholder=""></el-input>
    </el-form-item>
    <el-form-item label="平台id" prop="platformId">
      <el-input v-model="dataForm.platformId" placeholder="平台id"></el-input>
    </el-form-item>
    <el-form-item label="删除 0：未删除  1：已删除" prop="isDeleted">
      <el-input v-model="dataForm.isDeleted" placeholder="删除 0：未删除  1：已删除"></el-input>
    </el-form-item>
    <el-form-item label="创建者id" prop="createUserId">
      <el-input v-model="dataForm.createUserId" placeholder="创建者id"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="gmtCreate">
      <el-input v-model="dataForm.gmtCreate" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="修改者Id" prop="modifiedUserId">
      <el-input v-model="dataForm.modifiedUserId" placeholder="修改者Id"></el-input>
    </el-form-item>
    <el-form-item label="修改时间" prop="gmtModified">
      <el-input v-model="dataForm.gmtModified" placeholder="修改时间"></el-input>
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
          name: '',
          parentId: '',
          platformId: '',
          isDeleted: '',
          createUserId: '',
          gmtCreate: '',
          modifiedUserId: '',
          gmtModified: ''
        },
        dataRule: {
          name: [
            { required: true, message: '类别名称不能为空', trigger: 'blur' }
          ],
          parentId: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          platformId: [
            { required: true, message: '平台id不能为空', trigger: 'blur' }
          ],
          isDeleted: [
            { required: true, message: '删除 0：未删除  1：已删除不能为空', trigger: 'blur' }
          ],
          createUserId: [
            { required: true, message: '创建者id不能为空', trigger: 'blur' }
          ],
          gmtCreate: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          modifiedUserId: [
            { required: true, message: '修改者Id不能为空', trigger: 'blur' }
          ],
          gmtModified: [
            { required: true, message: '修改时间不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/resoure/resoureteamtype/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.name = data.resoureteamtype.name
                this.dataForm.parentId = data.resoureteamtype.parentId
                this.dataForm.platformId = data.resoureteamtype.platformId
                this.dataForm.isDeleted = data.resoureteamtype.isDeleted
                this.dataForm.createUserId = data.resoureteamtype.createUserId
                this.dataForm.gmtCreate = data.resoureteamtype.gmtCreate
                this.dataForm.modifiedUserId = data.resoureteamtype.modifiedUserId
                this.dataForm.gmtModified = data.resoureteamtype.gmtModified
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
              url: this.$http.adornUrl(`/resoure/resoureteamtype/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'parentId': this.dataForm.parentId,
                'platformId': this.dataForm.platformId,
                'isDeleted': this.dataForm.isDeleted,
                'createUserId': this.dataForm.createUserId,
                'gmtCreate': this.dataForm.gmtCreate,
                'modifiedUserId': this.dataForm.modifiedUserId,
                'gmtModified': this.dataForm.gmtModified
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
