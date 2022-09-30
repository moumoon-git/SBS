<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="值班人员名称" prop="dutyPersonnelName">
        <el-input v-model="dataForm.dutyPersonnelName" placeholder="值班人员名称"></el-input>
      </el-form-item>
      <el-form-item label="接班人员名称" prop="nextDutyPersonnelName">
        <el-input v-model="dataForm.nextDutyPersonnelName" placeholder="接班人员名称"></el-input>
      </el-form-item>
      <el-form-item label="交班事项" prop="precautions">
        <el-input v-model="dataForm.precautions" placeholder="交班事项"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="值班机" prop="inspectionItem1">
        <el-input v-model="dataForm.inspectionItem" placeholder="值班机"></el-input>
      </el-form-item>
      <el-form-item label="传真机" prop="inspectionItem2">
        <el-input v-model="dataForm.inspectionItem" placeholder="传真机"></el-input>
      </el-form-item>
      <el-form-item label="打印机" prop="inspectionItem3">
        <el-input v-model="dataForm.inspectionItem" placeholder="打印机"></el-input>
      </el-form-item>
      <el-form-item label="开始日期" prop="inspectionItem">
        <el-input v-model="dataForm.inspectionItem" placeholder="巡检项"></el-input>
      </el-form-item>
      <el-form-item label="结束日期" prop="inspectionItem">
        <el-input v-model="dataForm.inspectionItem" placeholder="巡检项"></el-input>
      </el-form-item>
      <!-- <el-form-item label="删除 0：未删除  1：已删除" prop="isDeleted">
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
    <el-form-item label="平台id" prop="platformId">
      <el-input v-model="dataForm.platformId" placeholder="平台id"></el-input>
      </el-form-item>-->
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
        dutyPersonnelName: '',
        nextDutyPersonnelName: '',
        precautions: '',
        remark: '',
        inspectionItem1: '',
        inspectionItem2: '',
        inspectionItem3: '',
        isDeleted: '',
        createUserId: '',
        gmtCreate: '',
        modifiedUserId: '',
        gmtModified: '',
        platformId: ''
      },
      dataRule: {
        dutyPersonnelName: [
          { required: true, message: '值班人员名称不能为空', trigger: 'blur' }
        ],
        nextDutyPersonnelName: [
          { required: true, message: '接班人员名称不能为空', trigger: 'blur' }
        ],
        precautions: [
          { required: true, message: '交班事项不能为空', trigger: 'blur' }
        ],
        remark: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
        inspectionItem: [
          { required: true, message: '巡检项不能为空', trigger: 'blur' }
        ],
        isDeleted: [
          {
            required: true,
            message: '删除 0：未删除  1：已删除不能为空',
            trigger: 'blur'
          }
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
        ],
        platformId: [
          { required: true, message: '平台id不能为空', trigger: 'blur' }
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
            url: this.$http.adornUrl(`/duty/dutylog/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.dutyPersonnelName = data.dutyLog.dutyPersonnelName
              this.dataForm.nextDutyPersonnelName =
                data.dutyLog.nextDutyPersonnelName
              this.dataForm.precautions = data.dutyLog.precautions
              this.dataForm.remark = data.dutyLog.remark
              this.dataForm.inspectionItem = data.dutyLog.inspectionItem
              this.dataForm.isDeleted = data.dutyLog.isDeleted
              this.dataForm.createUserId = data.dutyLog.createUserId
              this.dataForm.gmtCreate = data.dutyLog.gmtCreate
              this.dataForm.modifiedUserId = data.dutyLog.modifiedUserId
              this.dataForm.gmtModified = data.dutyLog.gmtModified
              this.dataForm.platformId = data.dutyLog.platformId
            }else{
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/duty/dutylog/${!this.dataForm.id ? 'save' : 'update'}`
            ),
            method: 'post',
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              dutyPersonnelName: this.dataForm.dutyPersonnelName,
              nextDutyPersonnelName: this.dataForm.nextDutyPersonnelName,
              precautions: this.dataForm.precautions,
              remark: this.dataForm.remark,
              inspectionItem: this.dataForm.inspectionItem,
              isDeleted: this.dataForm.isDeleted,
              createUserId: this.dataForm.createUserId,
              gmtCreate: this.dataForm.gmtCreate,
              modifiedUserId: this.dataForm.modifiedUserId,
              gmtModified: this.dataForm.gmtModified,
              platformId: this.dataForm.platformId
            })
          }).then(({ data }) => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          })
        }
      })
    }
  }
}
</script>
