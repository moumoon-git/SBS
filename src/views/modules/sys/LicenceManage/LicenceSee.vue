<template>
  <div class="dialog-tree">
    <el-dialog
      title="查看license"
      :close-on-click-modal="false"
      width="550px"
      :visible.sync="visible"
    >
      <el-form
        ref="dataForm"
        class="formStyle"
        :model="dataForm"
        label-width="125px"
      >
      <div class="see_top">
        <div class="top_first">
          <div>创建人： {{ dataForm.createUserName }}</div>
          <div>创建时间： {{ dataForm.createTime 
            ? dataForm.createTime.substring(0,dataForm.createTime.lastIndexOf(' '))
            : '' }}</div>
        </div>
        <div>
          使用状态：
          <span v-if="dataForm.status" style="color: rgb(246, 110, 110)">已停用</span>
          <span v-else style="color: rgb(11, 210, 149)">使用中</span>
        </div>
      </div>
        <el-form-item
          label="所属项目："
          prop="projectName"
        >
          {{ dataForm.projectName }}
        </el-form-item>
        <el-form-item
          label="申请人："
          prop="proposer"
        >
          {{ dataForm.proposer }}
          </el-input>
        </el-form-item>
        <el-form-item
          label="联系电话："
          prop="proposerTel"
        >
          {{ dataForm.proposerTel }}
        </el-form-item>
        <el-form-item
          label="有效期："
          prop="expireTime"
        >
          {{ dataForm.expireTime }}
        </el-form-item>
        <el-form-item
          label="项目合同："
          prop="files"
        >
          <div class="contract" v-for="(data, index) in dataForm.contractList">
            <div>{{ data.vcTitle }}</div>
            <div>
              <el-button
                type="text"
                @click="downloadFile(data)"
              >
                下载
              </el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="服务器IP："
          prop="serverIp"
        >
          {{ dataForm.serverIp }}
        </el-form-item>
        <el-form-item
          label="主板信息："
          prop="serverMainBoard"
        >
          {{ dataForm.serverMainBoard }}
        </el-form-item>
        <el-form-item
          label="MacAddress："
          prop="serverMacAddress"
        >
          {{ dataForm.serverMacAddress }}
        </el-form-item>
        <el-form-item
          label="CPUSerial："
          prop="serverCpuSerial"
        >
          {{ dataForm.serverCpuSerial }}
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          type="primary"
          size="small"
          @click="sendSms()"
        >
          短信提醒
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  const $downLoadFile = require('@/utils/downloadFile.js').default;
  export default {
    data() {
      return {
        type: 'get',
        visible: false,
        dataForm: {
          id: '', // 项目id
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
          files: '',// 合同文件
          remainingDays: '', // 剩余天数
        },
      }
    },
    methods: {
      init(type, data, projectOptions) {
        this.type = type;
        this.projectOptions = projectOptions;
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
      this.visible = true;
      },
      sendSms() {
        if (!this.dataForm.proposerTel) {
          this.$message.error('申请人未设置手机号码，无法发送短信');
          return;
        }
        let contents = '';
        if (this.dataForm.remainingDays >= 0) {
          contents = `尊敬的用户，您所申请的“${this.dataForm.projectName}”License将在${this.dataForm.expireTime}过期（剩余${this.dataForm.remainingDays}天）`
        } else {
          contents = `尊敬的用户，您所申请的“${this.dataForm.projectName}”License已过期，请及时处理。`
        }
        this.$http({
          url: `${window.SITE_CONFIG.cloudUrl}/event/eos/communication/sms/addSmsQueue`,
          method: 'post',
          data: this.$http.adornData({
            content: contents,
            phoneNum: this.dataForm.proposerTel,
          }),
        }).then((res) => {
          if (res.data.errorcode === 0) {
            this.$message.success('提醒短信发送成功');
          } else {
            this.$message.error('提醒短信发送失败');
          }
        });
      },
      // 下载合同
      downloadFile(file) {
        console.log(file)
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
    }
  }
</script>
<style lang="scss" scoped>
  .see_top {
    display: flex;
    flex-direction: column;
    background: #F7F7F7;
    padding: 10px 20px;
    margin: 5px 10px;
  }
  .top_first {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .contract {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>