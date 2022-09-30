<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <div style="display: flex;">
        <div style="width:45%">
          <!-- 头像上传功能 -->
          <el-form-item label="人脸图片">
            <el-upload
              action
              :file-list="fileList"
              :http-request="uploadSectionFile"
              :limit="1"
              :on-exceed="handleExceed"
              accept="image/png, image/jpg, image/jpeg"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-change="handleChange"
            >
              <i v-if="imageUrl === ''" class="el-icon-plus avatar-uploader-icon"></i>

              <!-- <el-button size="small" style="width:88px;height:32px;" class="el-icon-upload2">点击上传</el-button> -->
            </el-upload>
            <img v-if="imageUrl !== ''" :src="imageUrl" class="avatar" />

            <!-- <el-upload class="avatar-uploader" action :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"></el-upload> -->
            <!-- <el-input v-model="dataForm.facePicUrl" placeholder="人脸图片路径"></el-input> -->
            <!-- <el-upload :action="api.base+api.uploadotherpic" list-type="picture-card" :file-list="fileList" with-credentials :before-upload="beforeUpload" :on-remove="afterRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>-->
          </el-form-item>
        </div>
        <div style="width:45%">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="dataForm.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <!-- <el-input v-model="dataForm.sex" placeholder="性别"></el-input> -->
            <el-radio-group v-model="dataForm.sex">
              <el-radio value="1" label="1">男</el-radio>
              <el-radio value="2" label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="dataForm.address" placeholder="地址"></el-input>
          </el-form-item>
          <!-- 管控类型 -->
          <el-form-item label="管控类型" prop="controlTypeId">
            <el-select    placeholder="请选择所属类型"  v-model="dataForm.controlTypeId">
              <el-option v-for="item in menuList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!-- 管控等级 -->
          <!-- <el-form-item label="管控地址"> -->
          <!-- 下拉框 -->
          <!-- <el-select ref="controlLevelClearable" v-model="dataForm.controlLevelId" placeholder="请选择管控等级" clearable> -->
          <!-- <el-option v-for="item in grade" :key="item.value" :label="item.name" :value="item.id"></el-option> -->
          <!-- </el-select> -->
          <!-- </el-form-item> -->
          <el-form-item label="证件类型" prop="credentialsType">
            <!-- <el-input v-model="dataForm.credentialsType" placeholder="证件类型 -1 无限制 0 未知 1 身份证 2 警官号"></el-input> -->
            <el-select v-model="dataForm.credentialsType" placeholder="请选择">
              <el-option v-for="item in credentialsTypeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证件号">
            <el-input v-model="dataForm.credentialsNum" placeholder="证件号"></el-input>
          </el-form-item>

          <!-- <el-form-item label="图片uuid" prop="pictureUuid">
        <el-input v-model="dataForm.pictureUuid" placeholder="图片uuid"></el-input>
          </el-form-item>-->
          <!-- 预案名称  关联的预案 -->
          <!-- <el-form-item label="预案" prop="planId">
            <el-input v-model="dataForm.planId" placeholder="预案id"></el-input>
          </el-form-item>-->
          <el-form-item label="备注">
            <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
          </el-form-item>
          <!-- 平台名称 -->
          <!-- <el-form-item label="平台" prop="platformId">
            <el-input v-model="dataForm.platformId" placeholder="平台id"></el-input>
          </el-form-item>-->
        </div>
      </div>
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
      fileList: [],
      filePath: '', // 文件路径
      filesize: '', // 文件大小
      filename: '', // 上传文件名称
      imageUrl: '', // 页面显示路径
      visible: false,
      concernData: [{ value: 0, label: '普通' }, { value: 1, label: '重点' }],
      credentialsTypeData: [
        { value: -1, label: '无限制' },
        { value: 0, label: '未知' },
        { value: 1, label: '身份证' },
        { value: 2, label: '警官号' }
      ],
      // 类型
      menuList: [],
      // 等级
      grade: [],
      dataForm: {
        id: 0,
        name: '',
        sex: '1',
        address: '',
        imageUrl: '', // 保存人脸路径
        credentialsType: '', // 身份证类型
        credentialsNum: '',
        facePicUrl: '',
        pictureUuid: '',
        planId: '',
        remark: '',
        controlTypeId: '', // 类型id
        concern: '0',
        platformId: ''
      },
      // 验证
      dataRule: {
        name: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
        sex: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
        address: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
        controlTypeId: [
          {
            required: true,
            message: '所属类型不能为空',
            trigger: 'blur'
          }
        ],
        credentialsType: [
          {
            required: true,
            message: '证件类型不能为空',
            trigger: 'blur'
          }
        ],
        // 可以为空
        credentialsNum: [
          { required: true, message: '证件号不能为空', trigger: 'blur' }
          // {
          //   pattern: /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/,
          //   message: '目前只支持中国大陆的'
          // }
        ],
        facePicUrl: [
          { required: true, message: '人脸图片路径不能为空', trigger: 'blur' }
        ],
        pictureUuid: [
          { required: true, message: '图片uuid不能为空', trigger: 'blur' }
        ],
        planId: [
          { required: true, message: '预案id不能为空', trigger: 'blur' }
        ],
        controlLevelId: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]

      }
    }
  },
  created () {
    this.imageUrl = ''
    this.handleTypeData()
  },
  methods: {
    // 附件列表
    handleChange (file, fileList) {
      this.fileList = fileList
    },
    beforeRemove (file, fileList) {
      this.$confirm(`确定移除 ${file.name}？`)
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!',
            offset:100
          })
          this.dataForm.facePicUrl = ''
          this.imageUrl = ''
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            offset:100
          })
        })
    },
    handleRemove (file, fileList) {
      this.dataForm.enclosure = ''
      this.dataForm.fileName = ''
    },
    handleExceed () {
      this.$message.error('只能上传一个附件')
      return false
    },
    // 自定义文件上传行为
    uploadSectionFile (param) {
      // console.log(param)
      let form = new FormData()
      form.append('file', param.file)
      // console.log( param.file)
      this.$http({
        url: this.$http.adornUrl(`/upload/file`),
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: form
      })
        .then(({ data }) => {
          if (data.code === 0) {
            // console.log(data)
            this.imageUrl = window.SITE_CONFIG.cloudUrl + '/' + data.url;
            this.dataForm.facePicUrl = imageUrl
          }else{
            this.$message.error(data.msg)
          }

          // this.dataForm.fileName = data.fileName
        })
        .catch(err => {})
    },
    // 获取类型的数据
    handleTypeData () {
      this.$http({
        url: this.$http.adornUrl('/event/eventType/selectTypeList'),
        method: 'get',
        params: this.$http.adornParams({
          typeFlag: 3,
          isTree: '1'
        })
      }).then(({ data }) => {
        if (data.code === 0) {
            // console.log(data)
            this.menuList = data.list
          }else{
            this.$message.error(data.msg)
          }
      })
    },
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.dataForm.credentialsNum = ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/risk/riskhumanblacklist/info/?id=${this.dataForm.id}`
            ),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              // console.log(data)

              this.dataForm.name = data.riskHumanBlacklist.name
              this.dataForm.sex = `${data.riskHumanBlacklist.sex}`
              this.dataForm.address = data.riskHumanBlacklist.address
              this.dataForm.credentialsType =
                data.riskHumanBlacklist.credentialsType
              this.dataForm.credentialsNum =
                data.riskHumanBlacklist.credentialsNum
              this.dataForm.facePicUrl = data.riskHumanBlacklist.facePicUrl
              this.dataForm.pictureUuid = data.riskHumanBlacklist.pictureUuid
              this.dataForm.planId = data.riskHumanBlacklist.planId
              this.dataForm.remark = data.riskHumanBlacklist.remark
              this.dataForm.controlTypeId =
                data.riskHumanBlacklist.controlTypeId
              this.dataForm.controlLevelId =
                data.riskHumanBlacklist.controlLevelId
              this.dataForm.concern = data.riskHumanBlacklist.concern
              this.dataForm.platformId = data.riskHumanBlacklist.platformId
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
              `/risk/riskhumanblacklist/${
                !this.dataForm.id ? 'save' : 'update'
              }`
            ),
            method: 'post',
            data: this.$http.adornData({
              id: this.dataForm.id || undefined, // id
              name: this.dataForm.name, // 名称
              sex: this.dataForm.sex, // 性别
              address: this.dataForm.address, // 地址
              credentialsType: this.dataForm.credentialsType, // 身份证类型
              credentialsNum: this.dataForm.credentialsNum, // 身份证
              facePicUrl: this.dataForm.facePicUrl, // 图片路径
              remark: this.dataForm.remark, // 备注
              controlTypeId: this.dataForm.controlTypeId // 类型id
            })
          }).then(({ data }) => {
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
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
