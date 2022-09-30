<!--@author：llp-->
<template>
  <div>
    <div class="box-card">
      <el-row>
        <el-col class="selectedPeople">注：已选择{{peopleList.length}}人</el-col>
      </el-row>
      <el-row>
        <div class="peopleList">
          <el-col style="height: 200px">
            <el-scrollbar style="height: 100%">
              <el-row v-for="(item,key) in peopleList" :key="key" style="margin-top:10px">
                <el-col :span="10" style="text-align: left;font-size:14px;">{{key+1}}.{{item.name}}</el-col>
                <el-col :span="10" style="text-align: left;font-size:14px;">{{item.fax}}</el-col>
                <el-col :span="2" style="text-align: right">
                  <el-button icon="el-icon-close" class="shrink-button" @click="removeContact(key)"></el-button>
                </el-col>
              </el-row>
            </el-scrollbar>
          </el-col>
        </div>
      </el-row>
      <el-row>
        <el-col :offset="4" :span="8">
          <el-button type="primary" @click="addPhones">添加号码</el-button>
        </el-col>
        <el-col :offset="1" :span="4">
          <el-button type="primary" @click="removeAllContact">清除</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="sendFaxBox">
      <el-form
        v-model="faxForm"
        label-width="80px"
        @submit.native.prevent
        style="margin:32px"
        label-position="right"
      >
        <el-row :gutter="gutter">
          <el-form-item label="事件关联:">
            <el-col :span="20">
              <el-select v-model="faxForm.caseId" placeholder="请选择">
                <el-option
                  v-for="item in eventOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row :gutter="gutter">
          <el-form-item label="传真标题:">
            <el-col :span="20">
              <el-input v-model="faxForm.faxTitle"></el-input>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row :gutter="gutter">
          <el-form-item label="传真文件:">
            <el-input v-show="false" v-model="faxForm.faxFileName" readonly></el-input>
            <!--</el-col>-->
            <el-col :span="24">
              <div style="width: 100%;text-align: left;">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  accept=".pdf, .jpg, .jpeg, .png, .ppt, .pptx, .doc, .docx, .txt, .xlsx, .xls"
                  :limit="1"
                  :action="action"
                  :headers="{Authorization: $window.localStorage.getItem('token') ? $window.localStorage.getItem('token') : ''}"
                  auto-upload
                  with-credentials
                  :file-list="faxFileList"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-upload="beforeUpload"
                  :on-exceed="onExceed"
                  :on-success="onSuccess"
                  :show-file-list="true"
                >
                  <el-button slot="trigger" size="mini" type="primary">选择</el-button>
                  <el-button type="primary" size="mini" @click="preview">预览</el-button>
                  <el-button size="mini" type="primary" @click="clearFiles">清除</el-button>
                </el-upload>
              </div>
            </el-col>
          </el-form-item>
        </el-row>
        <!--<el-row :gutter="gutter">-->
        <!--<el-form-item label="回执文件:">-->
        <!--<el-col :span="16">-->
        <!--<el-input v-model="faxForm.receiptFileName" readonly></el-input>-->
        <!--</el-col>-->
        <!--<el-col :span="8">-->
        <!--<div style="width: 100%;text-align: left;">-->
        <!--<el-upload-->
        <!--class="upload-demo"-->
        <!--ref="upload"-->
        <!--accept=".pdf"-->
        <!--:limit="1"-->
        <!--:action="action"-->
        <!--:before-upload="beforeUploadReceiptFile"-->
        <!--:http-request="httpRequest"-->
        <!--:show-file-list="false"-->
        <!--&gt;-->
        <!--<el-button slot="trigger" size="mini" type="primary">选择</el-button>-->
        <!--</el-upload>-->
        <!--</div>-->
        <!--</el-col>-->
        <!--</el-form-item>-->
        <!--</el-row>-->
        <!--<el-row :gutter="gutter">-->
        <!--<el-form-item label="传真预览:">-->
        <!--</el-form-item>-->
        <!--</el-row>-->
        <el-row :gutter="gutter">
          <el-col :span="18">
            <el-date-picker
              v-model="faxForm.sendingTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择发送时间"
            ></el-date-picker>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="submitUpload">发送</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!--添加号码对话框-->
    <el-dialog
      title="添加号码"
      :visible.sync="isAddPhonesShow"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-input
        type="textarea"
        resize="none"
        :autosize="{minRows:4,maxRows:4}"
        v-model="phonesText"
        placeholder="请输入手机号码，多个号码使用“，”隔开"
      ></el-input>
      <el-button @click="isAddPhonesShow = false">取 消</el-button>
      <el-button type="primary" @click="submitPhones">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { Url } from '@/assets/js/common';

export default {
    name: 'sendFaxPanel',
    data() {
        let number = (rule, value, callback) => {
            let num = /^((\+?[0-9]{2,4}\-[0-9]{3,4}\-)|([0-9]{3,4}\-))?([0-9]{7,8})(\-[0-9]+)?$/;
            let n = value.match(num);
            if (n == null) {
                callback(new Error('请输入正确的传真号码!'));
            }
            callback();
        };
        return {
            gutter: 20,
            peopleList: [], //选择发送传真的人员列表;
            faxForm: {
                caseId: '', //事件关联
                faxTitle: '', //传真标题
                sendingTime: new Date(), //发送时间(默认显示当前时间)
                faxFileName: '', //传真文件地址
                receiptFileName: '', //回执文件
            }, //传真文件表单
            faxFileList: [], //传真文件
            eventOptions: [], //事件关联选择框
            action: Url + '/eos/communication/fax/convertPDF',
            isAddPhonesShow: false,
            phonesText: '', //电话号码输入框
            contactorIds: '', //联系人id
            previewPath: '', //文件预览路径
            pdfPath: '', //PDF路径
            HWICP_Version: window.g.HWICP_Version, //icp版本号
        };
    },
    mounted() {
        this.getEventOptions();
        let name = sessionStorage.getItem('fax_name');
        let fax_call = sessionStorage.getItem('fax_call');
        if (name != '' && fax_call != '' && name != null && fax_call != null) {
            this.peopleList = [
                {
                    name: sessionStorage.getItem('fax_name'),
                    fax: sessionStorage.getItem('fax_call'),
                },
            ];
            sessionStorage.removeItem('fax_name');
            sessionStorage.removeItem('fax_call');
        }
    },
    methods: {
        //限制上传一个文件
        onExceed() {
            this.$message.warning('请点击清除按钮后重新选择文件上传!');
        },
        //清除文件按钮
        clearFiles() {
            this.faxForm.faxFileName = '';
            this.faxFileList = [];
            this.pdfPath = '';
            this.previewPath = '';
        },
        //移除需发送短信的人员列表
        removeContact(key) {
            this.peopleList.splice(key, 1);
        },
        //移除所有需发送短信的人员列表
        removeAllContact() {
            this.peopleList = [];
            this.contactorIds = [];
        },
        //显示选中数据
        showData(data) {
            this.peopleList.push({
                contactorId: data.id,
                name: data.name,
                fax: data.fax,
            });
            this.removerSamePhone();
        },
        //号码去重
        removerSamePhone() {
            for (let i = 0; i < this.peopleList.length; i++) {
                for (let j = i + 1; j < this.peopleList.length; j++) {
                    if (this.peopleList[i].fax == this.peopleList[j].fax) {
                        this.peopleList.splice(j, 1);
                        j--;
                    }
                }
            }
            this.peopleList = Array.from(new Set(this.peopleList));
        },
        //获取未办结事件
        getEventOptions() {
            let data;
            this.$api.allEventlist(data).then(res => {
                if (res.errorcode != 0) {
                    this.$message({
                        message: res.msg,
                        type: 'error',
                    });
                    return;
                }
                for (let i = 0; i < res.data.length; i++) {
                    this.eventOptions.push({
                        value: res.data[i].id,
                        label: res.data[i].title,
                    });
                }
            });
        },
        httpRequest(item) {},
        //上传文件前调用的方法
        beforeUpload(file) {
            this.faxFileList.push(file);
            this.faxForm.faxFileName = file.name;
        },
        //点击发送按钮后调用的方法
        submitUpload() {
            if (this.faxFileList == '') {
                this.$message.warning('请选择需要发送的传真文件!');
                return;
            }
            if (this.peopleList.length == 0) {
                this.$message.warning('请添加接收人号码!');
                return;
            } else {
                this.$confirm('确认发送?', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                    .then(() => {
                        this.sendFax();
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消发送',
                        });
                    });
            }
        },
        //批量发送传真
        sendFax() {
            let phones = [];
            for (let i = 0; i < this.peopleList.length; i++) {
                phones.push(Number(this.peopleList[i].fax));
            }
            let phoneArry = [...new Set(phones)];

            let contactorIds = [];
            for (let i = 0; i < this.peopleList.length; i++) {
                if (this.peopleList[i].contactorId) {
                    contactorIds.push(Number(this.peopleList[i].contactorId));
                } else {
                    contactorIds.push(0);
                }
            }
            let contactorIdsArray = [...new Set(contactorIds)];

            if (
                this.faxForm.sendingTime == null ||
                this.faxForm.sendingTime == ''
            ) {
                this.faxForm.sendingTime = new Date();
            }

            // let nowMonth = this.faxForm.sendingTime.getMonth() + 1;
            // let strDate = this.faxForm.sendingTime.getDate();
            // let seperator = "-";// 添加分隔符“-”
            // if (nowMonth >= 1 && nowMonth <= 9) {// 对月份进行处理，1-9月在前面添加一个“0”
            //   nowMonth = "0" + nowMonth;
            // }
            // if (strDate >= 0 && strDate <= 9) { // 对月份进行处理，1-9号在前面添加一个“0”
            //   strDate = "0" + strDate;
            // }
            // let faxTime = this.faxForm.sendingTime.getFullYear() + seperator + nowMonth + seperator + strDate;

            let datas = {
                faxSendTime: this.faxForm.sendingTime.toString(),
                faxCaseId: this.faxForm.caseId,
                faxName: this.faxForm.faxTitle,
                contactorId: contactorIdsArray.toString(),
            };

            let formData = new FormData();
            formData.append('data', JSON.stringify(datas));
            formData.append('file', this.faxFileList[0]);
            formData.append('phoneNum', phoneArry.toString()); //其他参数
            this.$api.sendFax(formData).then(res => {
                if (res.errorcode == 0) {
                    this.$message({
                        message: '发送成功!',
                        type: 'success',
                    });
                } else {
                    this.$message.error('发送失败');
                }
            });
        },
        // beforeUploadReceiptFile(file) {
        //   this.faxForm.receiptFileName = file.name;
        // },
        //移除上传的文件
        handleRemove(file, fileList) {
            this.pdfPath = '';
            this.previewPath = '';
            this.faxFileList = [];
        },
        handlePreview(file) {},
        //打开添加号码弹窗
        addPhones() {
            this.isAddPhonesShow = true;
        },
        //相同号码去重
        submitPhones() {
            let phone = this.phonesText.split(/[,，]/);
            //相同号码去重
            let phoneArry = [...new Set(phone)];

            for (let i = 0; i < phoneArry.length; i++) {
                this.checkPhone(phoneArry[i]);
            }
        },
        //检验传真号码的格式
        checkPhone(phoneNumber) {
            if (!/^(\d{3,4}-)?\d{7,8}$/.test(phoneNumber)) {
                setTimeout(() => {
                    this.$message.error('传真号码格式错误:' + phoneNumber);
                }, 500);
                return false;
            } else {
                this.peopleList.push({ fax: Number(phoneNumber) });
                this.removerSamePhone();
                this.isAddPhonesShow = false;
            }
        },
        //上传文件成功后返回预览的文件名称
        onSuccess(response) {
            this.previewPath = response.data;
        },
        //传真预览
        preview() {
            this.pdfPath =
                `${Url}/eos/communication/pdf/preview?filename=` +
                this.previewPath;
            if (
                this.previewPath == '' ||
                this.previewPath == null ||
                this.previewPath == undefined
            ) {
                this.$message({
                    message: '请先选择文件',
                    type: 'warning',
                });
                return;
            }
            window.open(
                this.pdfPath +
                    `&Authorization=${
                        localStorage.getItem('token')
                            ? localStorage.getItem('token')
                            : ''
                    }`
            );
        },
    },
};
</script>

<style scoped>
.box-card {
    height: 340px;
    margin-top: 16px;
    margin-left: 8px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
}

.selectedPeople {
    margin-top: 24px;
}

.peopleList {
    margin: 20px 32px;
    height: 200px;
    border: 1px solid rgba(162, 162, 162, 1);
}

.sendFaxBox {
    margin-top: 16px;
    margin-left: 8px;
    height: 432px;
    background-color: white;
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
}

.shrink-button {
    border: none;
    color: #9da4b3;
    padding: 0;
}

.shrink-button:hover {
    color: #656565;
    background-color: white;
}

.shrink-button:focus {
    color: #656565;
    background-color: white;
}

>>> .el-form-item {
    margin-bottom: 10px;
}

>>> .el-form-item__label {
    padding: 0;
}

>>> .el-row {
    margin: 0;
}
</style>
