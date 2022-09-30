<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="地域编码" prop="areaCode">
      <el-input v-model="dataForm.areaCode" placeholder="地域编码"></el-input>
    </el-form-item>
    <el-form-item label="联系人id" prop="contactorId">
      <el-input v-model="dataForm.contactorId" placeholder="联系人id"></el-input>
    </el-form-item>
    <el-form-item label="传真" prop="fax">
      <el-input v-model="dataForm.fax" placeholder="传真"></el-input>
    </el-form-item>
    <el-form-item label="经度" prop="longitude">
      <el-input v-model="dataForm.longitude" placeholder="经度"></el-input>
    </el-form-item>
    <el-form-item label="纬度" prop="latitude">
      <el-input v-model="dataForm.latitude" placeholder="纬度"></el-input>
    </el-form-item>
    <el-form-item label="坐标类型" prop="coordinateType">
      <el-input v-model="dataForm.coordinateType" placeholder="坐标类型"></el-input>
    </el-form-item>
    <el-form-item label="主管单位" prop="responsibleUnit">
      <el-input v-model="dataForm.responsibleUnit" placeholder="主管单位"></el-input>
    </el-form-item>
    <el-form-item label="主管单位地址" prop="responsibleUnitAddress">
      <el-input v-model="dataForm.responsibleUnitAddress" placeholder="主管单位地址"></el-input>
    </el-form-item>
    <el-form-item label="周边交通" prop="aroundTraffic">
      <el-input v-model="dataForm.aroundTraffic" placeholder="周边交通"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
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
    <el-form-item label="终端用户id" prop="platformId">
      <el-input v-model="dataForm.platformId" placeholder="终端用户id"></el-input>
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
          areaCode: '',
          contactorId: '',
          fax: '',
          longitude: '',
          latitude: '',
          coordinateType: '',
          responsibleUnit: '',
          responsibleUnitAddress: '',
          aroundTraffic: '',
          remark: '',
          isDeleted: '',
          createUserId: '',
          gmtCreate: '',
          modifiedUserId: '',
          gmtModified: '',
          platformId: ''
        },
        dataRule: {
          areaCode: [
            { required: true, message: '地域编码不能为空', trigger: 'blur' }
          ],
          contactorId: [
            { required: true, message: '联系人id不能为空', trigger: 'blur' }
          ],
          fax: [
            { required: true, message: '传真不能为空', trigger: 'blur' }
          ],
          longitude: [
            { required: true, message: '经度不能为空', trigger: 'blur' }
          ],
          latitude: [
            { required: true, message: '纬度不能为空', trigger: 'blur' }
          ],
          coordinateType: [
            { required: true, message: '坐标类型不能为空', trigger: 'blur' }
          ],
          responsibleUnit: [
            { required: true, message: '主管单位不能为空', trigger: 'blur' }
          ],
          responsibleUnitAddress: [
            { required: true, message: '主管单位地址不能为空', trigger: 'blur' }
          ],
          aroundTraffic: [
            { required: true, message: '周边交通不能为空', trigger: 'blur' }
          ],
          remark: [
            { required: true, message: '备注不能为空', trigger: 'blur' }
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
          ],
          platformId: [
            { required: true, message: '终端用户id不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/resoure/resourearticlestorehouse/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.areaCode = data.resourearticlestorehouse.areaCode
                this.dataForm.contactorId = data.resourearticlestorehouse.contactorId
                this.dataForm.fax = data.resourearticlestorehouse.fax
                this.dataForm.longitude = data.resourearticlestorehouse.longitude
                this.dataForm.latitude = data.resourearticlestorehouse.latitude
                this.dataForm.coordinateType = data.resourearticlestorehouse.coordinateType
                this.dataForm.responsibleUnit = data.resourearticlestorehouse.responsibleUnit
                this.dataForm.responsibleUnitAddress = data.resourearticlestorehouse.responsibleUnitAddress
                this.dataForm.aroundTraffic = data.resourearticlestorehouse.aroundTraffic
                this.dataForm.remark = data.resourearticlestorehouse.remark
                this.dataForm.isDeleted = data.resourearticlestorehouse.isDeleted
                this.dataForm.createUserId = data.resourearticlestorehouse.createUserId
                this.dataForm.gmtCreate = data.resourearticlestorehouse.gmtCreate
                this.dataForm.modifiedUserId = data.resourearticlestorehouse.modifiedUserId
                this.dataForm.gmtModified = data.resourearticlestorehouse.gmtModified
                this.dataForm.platformId = data.resourearticlestorehouse.platformId
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
              url: this.$http.adornUrl(`/resoure/resourearticlestorehouse/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'areaCode': this.dataForm.areaCode,
                'contactorId': this.dataForm.contactorId,
                'fax': this.dataForm.fax,
                'longitude': this.dataForm.longitude,
                'latitude': this.dataForm.latitude,
                'coordinateType': this.dataForm.coordinateType,
                'responsibleUnit': this.dataForm.responsibleUnit,
                'responsibleUnitAddress': this.dataForm.responsibleUnitAddress,
                'aroundTraffic': this.dataForm.aroundTraffic,
                'remark': this.dataForm.remark,
                'isDeleted': this.dataForm.isDeleted,
                'createUserId': this.dataForm.createUserId,
                'gmtCreate': this.dataForm.gmtCreate,
                'modifiedUserId': this.dataForm.modifiedUserId,
                'gmtModified': this.dataForm.gmtModified,
                'platformId': this.dataForm.platformId
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
