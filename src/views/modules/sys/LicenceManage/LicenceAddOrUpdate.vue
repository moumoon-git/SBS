<template>
  <div class="dialog-tree">
    <el-dialog
      :title="type === 'add' ? '新增license' : '修改license'"
      :close-on-click-modal="false"
      width="550px"
      :visible.sync="visible"
      :before-close="handleClose"
    >
    <el-form
      ref="dataForm"
      class="formStyle"
      :model="dataForm"
      :rules="dataRule"
      label-width="125px"
      @keyup.enter.native="dataFormSubmit(type)"
    >
      <el-form-item
        label="使用状态"
        prop="status"
        v-if="type === 'modify'"
      >
        <el-select
          v-model="dataForm.status"
          placeholder="请选择使用状态"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="所属项目"
        prop="projectId"
      >
        <el-select
          v-model="dataForm.projectId"
          placeholder="请选择所属项目"
        >
          <el-option
            v-for="item in projectOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="申请人"
        prop="proposer"
      >
        <el-input
          v-model="dataForm.proposer"
          placeholder="请输入申请人"
        />
      </el-form-item>
      <el-form-item
        label="联系电话"
        prop="proposerTel"
      >
        <el-input
          v-model="dataForm.proposerTel"
          placeholder="请输入联系电话"
        />
      </el-form-item>
      <el-form-item
        label="有效期"
        prop="expireTime"
      >
        <el-date-picker
          v-model="dataForm.expireTime"
          :disabled="type === 'modify'?true:false"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="项目合同"
        prop="files"
        ref="uploadElement"
      >
        <el-upload
          ref="upload"
          :show-file-list="true"
          :file-list="dataForm.files"
          action=""
          :http-request="downloadFileMethod"
          :on-change="changeUpload"
          :accept="accept"
          :headers="{
            Authorization: $window.localStorage.getItem('token')
              ? $window.localStorage.getItem('token')
              : '',
          }"
        >
          <el-button size="small">上传文件</el-button>
          <div class="upload_file" slot="file" slot-scope="{file}">
            <div>{{ file.name || file.vcTitle }}</div>
            <div>
              <el-button
                type="text"
                v-if="type === 'modify' && file.vcUrl"
                @click="downloadFile(file)"
              >
                下载
              </el-button>
              <el-button
                type="text"
                @click="removeFile(file)"
              >
                删除
              </el-button>
            </div>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item
        label="服务器IP"
        prop="serverIp"
      >
        <el-input
          v-model="dataForm.serverIp"
          :disabled="type === 'modify'?true:false"
          placeholder="请输入服务器IP,多个ip以，隔开"
        />
      </el-form-item>

      <el-form-item
        label="主板信息"
        prop="serverMainBoard"
      >
        <el-input
          v-model="dataForm.serverMainBoard"
          :disabled="type === 'modify'?true:false"
          placeholder="请输入主板信息"
        />
      </el-form-item>
      <el-form-item
        label="MacAddress"
        prop="serverMacAddress"
      >
        <el-input
          v-model="dataForm.serverMacAddress"
          :disabled="type === 'modify'?true:false"
          placeholder="请输入Mac地址，多个地址以，隔开"
        />
      </el-form-item>
      <el-form-item
        label="CPUSerial"
        prop="serverCpuSerial"
      >
        <el-input
          v-model="dataForm.serverCpuSerial"
          :disabled="type === 'modify'?true:false"
          placeholder="请输入CPU信息"
        />
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button
        plain
        size="small"
        @click="handleClose"
      >
        取消
      </el-button>
      <el-button
        type="primary"
        size="small"
        @click="dataFormSubmit(type)"
      >
        确定
      </el-button>
    </span>
    </el-dialog>
    <sv-dialog-hint
      ref="hint"
      type="normal"
      text="分组名称不能为空！"
    />
  </div>
</template>
<script>
  import { debounce } from "@/utils/common.js";
  const $downLoadFile = require('@/utils/downloadFile.js').default;
  
  export default {
    data() {
      return {
        type: 'add',
        visible: false,
        projectOptions: [], // 项目数组
        dataForm: {
          id: '',
          status: '', // 状态
          projectId: '', // 项目id
          projectName: '', // 项目名称
          proposer: '', // 申请人
          createUserName: '', // 创建人
          proposerTel: '', // 申请人电话
          expireTime: '', // 有效期
          serverIp: '',// 服务器ip
          serverMacAddress: '', // 服务器mac地址
          serverCpuSerial: '',// 服务器cpu信息
          serverMainBoard: '',// 服务器主板信息
          files: [],// 合同文件
          remainingDays: '', // 剩余天数
        },
        dataRule: {
          projectId: [
            { required: true, message: '所属项目不能为空', trigger: 'change' }
          ],
          proposer: [
            { required: true, message: '申请人不能为空', trigger: 'blur' },
          ],
          proposerTel: [
            { required: true, validator: this.$regular.mobileOrLandline, trigger: ['change', 'blur'] }
          ],
          expireTime: [
            { required: true, message: '有效期不能为空', trigger: 'blur' },
          ],
          serverIp: [
            { required: true, message: '服务器IP不能为空', trigger: 'blur' },
          ],
          serverMacAddress: [
            { required: true, message: 'MacAddress不能为空', trigger: 'blur' },
          ],
          serverCpuSerial: [
            { required: true, message: 'CPUSerial不能为空', trigger: 'blur' },
          ],
          serverMainBoard: [
            { required: true, message: '主板信息不能为空', trigger: 'blur' },
          ],
        },
        statusOptions: [
          {
            id: 0,
            name: '使用中',
          },
          {
            id: 1,
            name: '已停用',
          }
        ],
        accept: '.xls,.xlsx,.doc,.txt,.pdf,.docx,.jpg,.jpeg,.png,.ppt,.pptx',
        uploadContract: [], // 修改时上传的文件
        pickerOptions: { // 选择日期限制
          disabledDate(time) {
            return time.getTime() < Date.now();
          },
        },
      }
    },
    methods: {
      init(type, data, projectOptions) {
        this.type = type;
        this.projectOptions = projectOptions;
        this.visible = true;
        if (type !== 'add') {
          let datas = new FormData();
          datas.append('id', data.id);
          this.$http({
            url: `${window.SITE_CONFIG.cloudUrl}/oauth/license/get`, 
            method: 'post',
            data: datas,
          })
          .then(({data}) => {
            if (data && data.errorcode === 0) {
              this.dataForm = data.data;
              this.dataForm.files = data.data.contractList;
            } else {
              this.$message.error(data.msg);
            }
          })
        }
      },
      dataFormSubmit: debounce(function (type) {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) {
            this.$message({
              message: "格式不正确",
              type: "error",
            });
            return;
          } else {
            let datas = new FormData();
            datas.append('projectId', this.dataForm.projectId);
            datas.append('proposer', this.dataForm.proposer);
            datas.append('proposerTel', this.dataForm.proposerTel);
            if (type === 'add') {
              datas.append('expireTime', this.dataForm.expireTime);
              datas.append('serverIp', this.dataForm.serverIp);
              datas.append('serverMacAddress', this.dataForm.serverMacAddress);
              datas.append('serverCpuSerial', this.dataForm.serverCpuSerial);
              datas.append('serverMainBoard', this.dataForm.serverMainBoard);
              for (let i = 0; i < this.dataForm.files.length; i += 1) {
                const data = this.dataForm.files[i].raw;
                datas.append('files', data);
              }
            }
            if (type === 'modify') {
              datas.append('id', this.dataForm.id);
              datas.append('status', this.dataForm.status);
              this.uploadContracts()
            }
            this.$http({
              url: `${window.SITE_CONFIG.cloudUrl}/oauth/license/${type}`, 
              method: 'post',
              data: datas,
            })
            .then(({data}) => {
              if (data && data.errorcode === 0) {
                this.$emit('refresh')
                this.uploadContract = []
                this.visible = false;
              } else {
                this.$message.error(data.msg);
              }
            })
          }
        });
      }, 500),
      // 关闭弹窗清空数据
      handleClose() {
        this.$refs.upload.clearFiles();
        this.$refs['dataForm'].clearValidate()
        for (let key in this.dataForm) {
          this.dataForm[key] = ''
          if(key === 'files') {
            this.dataForm[key] = []
          }
        }
        this.uploadContract = []
        this.visible = false;
      },
      // 存储需要上传的文件
      downloadFileMethod(param) {
        // 新增时无需单独上传，文件列表传入新增接口即可
        if (this.type === 'add') {
          return;
        }
        this.uploadContract.push(param)
      },
      // 批量上传合同
      uploadContracts() {
        if (this.uploadContract.length == 0 ) {
          return;
        }
        // 修改时自定义上传
        let formData = new FormData();
        console.log(this.dataForm.files)
        formData.append('id', this.dataForm.id);
        for (let i = 0; i < this.uploadContract.length; i += 1) {
          const data = this.uploadContract[i].file;
          formData.append('files', data);
        }
        this.$http.post(
          `${window.SITE_CONFIG.cloudUrl}/oauth/license/addContract`,
          formData
        ).then((res) => {
          if (res.data.errorcode !== 0) {
            this.$message.error('合同上传失败：', res.data.msg || res.data.message);
          }
        });
      },
      changeUpload(file, fileList) {
        this.dataForm.files = fileList;
        console.log(this.dataForm.files)
      },
      // 下载合同
      downloadFile(file) {
        let documentUrl = this.$window.SITE_CONFIG["cloudUrl"] + file.vcUrl;
        const request = {
          method: 'get',
          baseURL: window.SITE_CONFIG.cloudUrl,
          url: '/fileupload/appAttachment/download',
          params: {
            appAttachmentId: file.iId,
            isForceDownload: '1',
          },
          headers: {
            token: this.$cookie.get('token'),
          },
          responseType: 'arraybuffer',
        };
        this.$http(request).then((response) => {
					if (response.data) {
						const a = document.createElement('a');
						a.target = '_blank';
						a.download = file.vcTitle;
						a.href = window.URL.createObjectURL(new Blob([response.data]));
						a.click();
					}
				});
      },
      // 删除合同
      removeFile(file) {
        if (this.type === 'modify' && file.iId) {
          this.$confirm('确定要删除此合同?', '提示', {
            customClass: 'message-del',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            let formData = new FormData();
            formData.append('attachmentId', file.iId);
            formData.append('id', this.dataForm.id);
            this.$http.post(
              `${window.SITE_CONFIG.cloudUrl}/oauth/license/deleteContract`,
              formData
            ).then((res) => {
              if (res.data.errorcode === 0) {
                this.$refs.upload.handleRemove(file)
                // 移除
                this.dataForm.files = this.dataForm.files.filter(
                  (e) => file.iId !== e.iId
                );
                this.$message.success('合同删除成功');
              } else {
                this.$message.error('删除失败：', res.data.msg || res.data.message)
              }
            });
          })
        } else {
          this.$refs.upload.handleRemove(file)
        }
      },
    }
  }
</script>
<style lang="scss" scoped>
.upload_file {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>