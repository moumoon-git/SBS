<template>
  <div>
    <div style="margin-bottom: 10px" id="formDom">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" @submit.native.prevent>
        <el-form-item prop="inputImport">
          <el-input @blur="blur('ruleForm')" v-model="ruleForm.inputImport" placeholder="添加号码,回车确认添加!"
                    :validate-event="false"
                    @keyup.enter.native="filterTexts('ruleForm')" clearable
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="phoneList">
      <tag ref="tag" :dataName="dataName" @handleClose="handleClose" @addman="addman"></tag>
    </div>

    <div style="display: flex;justify-content: space-around;padding: 10px 0">
      <div style="width: 100%;text-align: left;display: flex;justify-content: space-around">
        <el-button type="primary" size="mini" @click="ascendingOrder">提高优先级</el-button>
        <el-button type="primary" size="mini" @click="descendingOrder">降低优先级</el-button>
      </div>
      <div style="width: 100%;text-align: right;margin-right: 10px;height: 30px;line-height: 30px">
        <el-link :underline="false" @click="empty">清空</el-link>
        <span>共{{number}}人</span>
      </div>
    </div>

<!--    <div style="width: 100%;margin: 10px 0">-->
<!--      &lt;!&ndash;        <el-input v-model="inputUpload" placeholder="文件路径" ></el-input>&ndash;&gt;-->
<!--      <el-divider content-position="left">选择文件</el-divider>-->
<!--      <div style="width: 100%;text-align: left;margin: 10px 0">-->
<!--        <el-upload-->
<!--          class="upload-demo"-->
<!--          ref="upload"-->
<!--          :action="string"-->
<!--          accept=".jpg,.jpeg,.png,.pdf,.ppt,.pptx,.doc,.docx,.txt,.xlsx,.xls"-->
<!--          :limit="1"-->
<!--          :on-preview="handlePreview"-->
<!--          :on-remove="handleRemove"-->
<!--          :file-list="fileList"-->
<!--          :on-success="onSuccess"-->
<!--          :on-error="onError"-->
<!--          :before-upload="beforeUpload"-->
<!--          auto-upload-->
<!--          with-credentials-->
<!--          :on-exceed="onExceed"-->
<!--        >-->
<!--          <el-button slot="trigger" size="mini" type="primary">选择</el-button>-->
<!--          <el-button type="primary" size="mini" @click="preview">预览</el-button>-->
<!--          <el-button type="primary" size="mini" @click="expEmpty">清空</el-button>-->
<!--        </el-upload>-->
<!--      </div>-->


<!--    </div>-->

<!--    <div style="width: 100%;text-align: right">-->
<!--      <el-button type="primary" size="mini" @click="submitUpload">发送</el-button>-->
<!--    </div>-->


  </div>
</template>

<script>
  import tag from "@/components/tag/tag"
  import {Url} from '@/assets/js/common'

  export default {
    name: "faxCheck",
    components: {
      tag,
    },
    data() {
      let number1 = (rule, value, callback) => {
        let num = /^010[2-8]{1}[0-9]{7}$/;
        let num1 = /^[2-8]{1}[0-9]{6,7}$/;
        let num2 = /^02[0-57-9]{1}[2-8]{1}[0-9]{7}$/;
        let num3 = /^0[3-9]{1}[0-9]{2}[2-8]{1}[0-9]{6,7}$/;
        let n = value.match(num);
        let n1 = value.match(num1);
        let n2 = value.match(num2);
        let n3 = value.match(num3);
        if (n == null && n1 == null && n2 == null && n3 == null) {
          callback(new Error('请输入正确的传真号码'));
        }
        callback();
      };
      return {
        string: Url + '/eos/communication/fax/convertPDF',
        dataName: [],//选中人员
        ruleForm: {
          inputImport: '',//输入框内容
        },
        rules: {
          inputImport: [
            {validator: number1, trigger: 'blur'},
          ],
        },
        inputUpload: '',//文件路径
        fileList: [],
        optFor: [],//选中存储
        datas: [],
        number: 0,//共多少人
        uploadForm: [],
        eventId: '',

        reduction: 0,//
        previewPath: '',//文件预览路径
        pdfPath: '',//PDF路径
        subscript: [],//选中升降序
        order: null,//下标
        HWICP_Version: window.g.HWICP_Version //ICP版本号
      }
    },
    methods: {
      ascendingOrder() {//升序
        let length = this.dataName.length
        if (length < 1) {
          this.$message({
            message: '请先加入人员',
            type: 'warning'
          });
          return
        }
        if (this.order == null) {
          this.$message({
            message: '请先选择人员',
            type: 'warning'
          });
          return
        }
        let index = this.order;
        let temp = this.subscript[index];
        if (index <= 0) {
          this.$message({
            message: '已是最高优先级',
            type: 'warning'
          });
          return
        }
        this.subscript[index] = this.subscript[index - 1]
        this.subscript[index - 1] = temp;
        this.dataName = this.subscript;
        this.$refs.tag.changeRed = index - 1;
        this.order = index - 1;
        this.dataName.splice();
      },
      descendingOrder() {//降序
        console.log(this.dataName);
        let lengthExtent = this.dataName.length
        if (lengthExtent < 1) {
          this.$message({
            message: '请先加入人员',
            type: 'warning'
          });
          return
        }
        if (this.order == null) {
          this.$message({
            message: '请先选择人员',
            type: 'warning'
          });
          return
        }
        let index = this.order;
        let temp = this.subscript[index];
        let length = this.subscript.length - 1
        console.log(index, length);
        if (index >= length) {
          this.$message({
            message: '已是最低优先级',
            type: 'warning'
          });
          return
        }
        this.subscript[index] = this.subscript[index + 1]
        this.subscript[index + 1] = temp;
        this.dataName = this.subscript;
        this.$refs.tag.changeRed = index + 1;
        this.order = index + 1;
        this.dataName.splice();
      },
      addman(item, i, dataName) {//tag标签点击事件
        this.subscript = dataName;
        this.order = i;
        this.$refs.tag.changeRed = i
      },
      expEmpty() {//清空文件
        this.pdfPath = '';
        this.previewPath = '';
        this.$refs.upload.clearFiles()
      },
      onExceed() {
        this.$message({
          message: '请先删除已选择的文件再进行上传!',
          type: 'warning'
        });
      },
      preview() {//文件预览
        this.pdfPath = `${Url}/eos/communication/pdf/preview?filename=`+this.previewPath
        console.log(this.previewPath);
        if (this.previewPath == '' || this.previewPath == null || this.previewPath == undefined) {
          this.$message({
            message: '请先选择文件',
            type: 'warning'
          });
          return
        }
        window.open(this.pdfPath)
      },
      onError(err) {//文件提前上传失败
        console.log(err);
        this.$message({
          message: '请重新选择文件',
          type: 'warning'
        });
      },
      onSuccess(response) {//上传成功
        this.previewPath = response.data;
      },
      beforeUpload(file) {//利用假上传获取文件判断格式
        this.uploadForm.push(file)
        console.log(file)
        let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
        const extension = testmsg === 'jpg'
        const extension2 = testmsg === 'jpeg'
        const extension3 = testmsg === 'png'
        const extension4 = testmsg === 'pdf'
        const extension5 = testmsg === 'ppt'
        const extension6 = testmsg === 'pptx'
        const extension7 = testmsg === 'doc'
        const extension8 = testmsg === 'docx'
        const extension9 = testmsg === 'txt'
        const extension10 = testmsg === 'xlsx'
        const extension11 = testmsg === 'xls'
        // const isLt2M = file.size / 1024 / 1024 < 10
        if (!extension && !extension2 && !extension3 && !extension4 && !extension5 && !extension6
          && !extension7 && !extension8 && !extension9 && !extension10 && !extension11) {
          this.$message({
            message: '请上传正确的文件格式',
            type: 'warning'
          });
        } else {
          //优士康创建、上传传真方法
          if (this.HWICP_Version == 'YouShiKang') {
            this.$faxFunction.EstablishFax(file);
          }
        }

        // if(!isLt2M) {
        //     this.$message({
        //         message: '上传文件大小不能超过 10MB!',
        //         type: 'warning'
        //     });
        // }
        // return extension || extension2 && isLt2M
        return extension || extension2 || extension3 || extension4 || extension5 || extension6 || extension7 || extension8 || extension9 || extension10 || extension11
      },
      blur(ruleForm) {
        this.$refs[ruleForm].clearValidate();
      },
      filterTexts(ruleForm) {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            this.reduction -= 1;
            this.optFor.push({
              name: this.ruleForm.inputImport,
              value: this.ruleForm.inputImport,
              id: this.reduction
            });
            for (let i = 0; i < this.optFor.length; i++) {
              for (let j = i + 1; j < this.optFor.length; j++) {
                if (this.optFor[i].name == this.optFor[j].name) {
                  this.optFor.splice(j, 1);
                  j--;
                }
              }
            }
            this.datas = Array.from(new Set(this.optFor));
            this.dataName = this.datas;
            this.number = this.dataName.length;
          }//确认
        });

      },
      handleClose(tag) {
        this.dataName.splice(this.dataName.indexOf(tag), 1);
        this.optFor.splice(this.optFor.indexOf(tag), 1);
        this.number = this.dataName.length;
        this.order = null;
        this.$refs.tag.changeRed = -1
      },
      empty() {//清空列表
        this.dataName = [];
        this.number=this.dataName.length
      },
      httpRequest(item) {
        this.uploadForm.push(item.file)
      },
      /**
       * @param {obj} uploadForm 上传传真文件成功的数据
       * @param {string} pdfName 传真文件上传成功后，接口返回的传真名字
       * @lastEditor hexinting
       * @lastEditDate 2020-9-16
       * @description 提交发送传真表单
       */
      submitUpload(uploadForm, pdfName) {
        console.log('uploadForm', uploadForm)
        let date = new Date();// 获取当前日期
        let nowMonth = date.getMonth() + 1;
        let strDate = date.getDate();
        let seperator = "-";// 添加分隔符“-”
        if (nowMonth >= 1 && nowMonth <= 9) {// 对月份进行处理，1-9月在前面添加一个“0”
          nowMonth = "0" + nowMonth;
        }
        if (strDate >= 0 && strDate <= 9) { // 对月份进行处理，1-9号在前面添加一个“0”
          strDate = "0" + strDate;
        }
        let faxTime = date.getFullYear() + seperator + nowMonth + seperator + strDate;
        let datanamevalue = ''; // 传真号码
        let idName = ''; // 联系人id
        let length = this.dataName.length;
        for (let i = 0; i < this.dataName.length; i++) {
          if (length <= 1) {
            datanamevalue += this.dataName[i].value;
            idName += this.dataName[i].id
          } else {
            datanamevalue += this.dataName[i].value + ',';
            idName += this.dataName[i].id + ',';
          }
        }

        if ( !uploadForm || uploadForm.length === 0) {
          this.$message({
            showClose: true,
            message: '请选择文件再发送!',
            type: 'warning'
          });
          return;
        }
        if (this.dataName == [] || this.dataName == '' || this.dataName == null) {
          this.$message({
            showClose: true,
            message: '请选择或输入发送人员!',
            type: 'warning'
          });
          return
        }
        // faxSendTime: faxTime,传真去掉的时间
        let datas = {
          faxCaseId: this.eventId,
          faxName: uploadForm[0].name
        };
        console.log('dataName', this.dataName)
        // let formData = {
        //   data: JSON.stringify(datas),
        //   file: uploadForm[0],
        //   contactorId: idName,
        //   phoneNum: datanamevalue
        // }
        let formData = new FormData();
        formData.append("pdfName", pdfName);
        formData.append("data", JSON.stringify(datas));
        formData.append("phoneNum", datanamevalue);
        formData.append("contactorId", idName);
        // formData.append("file", uploadForm[0]); // 没有传真回执 去掉

        // return
        this.$api.sendFax(formData).then((res) => {
          if (res.errorcode == 0) {
            this.$message({
              message: '传真已加入发送队列，等待发送',
              type: 'success'
            });
            // 发送成功清空内容
            this.$emit('clearFaxList');
            this.empty();
            this.ruleForm.inputImport = "" // 清空输入框
          } else {
            this.$message.error('传真发送失败');
          }
        });

        //优士康发送传真、短信的方法
        if (this.HWICP_Version == 'YouShiKang') {
          this.$faxFunction.sendFax(datanamevalue, this.eventId, idName);
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.pdfPath = '';
        this.previewPath = '';
        this.$refs.upload.clearFiles()
      },
      handlePreview(file) {
        console.log(file);
      },
      getFax(row) {
        this.eventId = sessionStorage.getItem('newID');
        this.dataName = [];
        this.datas = [];
        this.optFor.push({
          name: row.name,
          value: row.fax,
          id: row.contactorId || row.id
        });
        for (let i = 0; i < this.optFor.length; i++) {
          for (let j = i + 1; j < this.optFor.length; j++) {
            if (this.optFor[i].name == this.optFor[j].name) {
              this.optFor.splice(j, 1);
              j--;
            }
          }
        }
        this.datas = Array.from(new Set(this.optFor));
        this.dataName = this.datas;
        this.number = this.dataName.length;
      }
    }
  }
</script>

<style scoped>
  .phoneList {
    border: 1px dashed transparent;
    background: linear-gradient(white, white) padding-box,
    repeating-linear-gradient(-45deg, #ccc 0, #ccc 3px, white 0, white 5px);
    width: 100%;
    height: 120px;
    overflow-y: auto;
  }
  #formDom >>>.el-form-item{
    margin: 0;
  }
</style>
