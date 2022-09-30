<template>
  <div class="approve-edit-container">
    <!-- <div class="approve-edit-title">审批</div> -->
    <div class="approve-edit-text">
      <label>审核意见</label>
      <textarea v-model="form.approveComments"></textarea>
    </div>
    <div class="approve-edit-result">
      <label>审批结果</label>
      <span>
        <input
          type="radio"
          id="approve"
          v-model="form.approveResult"
          value="0"
        />
        <label for="approve">同意</label>
      </span>
      <span>
        <input
          type="radio"
          id="reject"
          v-model="form.approveResult"
          value="1"
        />
        <label for="reject">驳回</label>
      </span>
    </div>
    <div class="approve-edit-sign">
      <div class="img-upload" @click="$refs.fileUpload.click()">
        上传二维码签名
        <input
          class="img-upload-inner"
          type="file"
          accept="image/*"
          ref="fileUpload"
          @change="getFile($event)"
        />
      </div>
      <div class="img-preview">
        <img :alt="img.name" :src="`${hostUrl}${img.url}`" v-if="img.url" />
      </div>
    </div>
    <div class="approve-edit-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="approveSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "approveEdit",
  props: ["id", "nextPlatformId", "processid", "tikutype", "accounttype"],
  methods: {
    /**
     * @method
     * @desc 提交审核结果
     */
    approveSubmit() {
      let self = this;
      console.log("提交的审核结果", this.form, this.form.platformId);
      if (
        this.form.platformId == "" ||
        this.form.platformId == undefined ||
        this.form.platformId == null
      ) {
        if (this.form.approveResult == "0") {
          this.$alert("请选择下一个平台");
          return;
        }
      }
      if (this.form.approveResult == "") {
        this.$alert("请选择审核结果");
        return;
      }
      if (this.form.approveComments == "") {
        this.$alert("请输入审核意见");
        return;
      }
      if (this.form.approveResult == "1") {
        this.form.platformId = 0;
      }
      let url = `${window.SITE_CONFIG.baseUrl}/approve/approveApprove/save`;
      this.$confirm("确认提交？").then((_) => {
        self.$http.post(url, self.form).then((res) => {
          console.log("提交审核成功");
          this.$emit("refreshTable");
          self.closeDialog();
        });
        self.init();
      });
    },

    init() {
      this.form = {
        approveResult: "",
        approveComments: "",
        qrcodeImg: "",
      };
      this.img = {};
    },

    /**
     * @method
     * @desc 文件上传，返回文件在服务器中保存地址
     * @param {object} event input事件
     * @return {null}
     */
    getFile(event) {
      // 上传接口
      let url =
        window.SITE_CONFIG["baseUrl"] + "/upload/emergencyHandleProcessFile";
      let that = this;
      // 上传的文件列表
      let fileList = event.target.files;
      for (let file of fileList) {
        // 每次上传1个文件，返回一条url
        let formData = new FormData();
        formData.append("file", file);
        formData.append("token", that.$cookie.get("token"));
        that.$http.post(url, formData, { emulateJSON: true }).then(
          function (res) {
            that.img = {
              name: res.data.data.name,
              url: res.data.data.url,
            };
            that.form.qrcodeImg = res.data.data.url;
            // 清空input值，防止重复上传时不触发change事件
            event.srcElement.value = "";
          },
          function (res) {
            console.log("upload fail: ", res);
          }
        );
      }
    },

    // 取消或成功提交后关闭父组件弹窗
    closeDialog() {
      this.init();
      this.$emit("cancel");
    },
  },
  data() {
    return {
      /**
       * @var
       * @desc 提交的表单内容
       */
      form: {
        id: "",
        platformId: "",
        approveResult: "",
        approveComments: "",
        qrcodeImg: "",
        processId: "",
        tikuType: "",
        accountType: "",
      },
      img: {},
      /**
       * @var {string}
       * @desc 图片所在的主机地址
       */
      hostUrl: "http://scg.chinaemt.com",
    };
  },
  mounted() {
    this.form.id = this.id;
    this.form.processId = this.processid;
    this.form.tikuType = this.tikutype;
    console.log("this.tikutype====>", this.tikutype);
    this.form.platformId = this.nextPlatformId;
    this.form.accountType = this.accounttype;
  },
  watch: {
    id(val) {
      this.form.id = val;
    },
    nextPlatformId(val) {
      console.log("nextplatform", val, this.processid, this.tikutype);
      this.form.platformId = val;
    },
    processid(val) {
      console.log("processid", val);
      this.form.processId = val;
    },
    tikutype(val) {
      console.log("val", val);
      this.form.tikuType = val;
    },
  },
};
</script>

<style lang="less">
.approve-edit-container {
  * {
    color: #555555;
    font-size: 14px;
  }
  .approve-edit-text {
    padding: 22px 0 10px 53px;
    label {
      position: relative;
      bottom: 90px;
    }
    textarea {
      margin-left: 10px;
      resize: none;
      width: 848px;
      height: 111px;
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      outline: none;
      &:hover {
        border-color: #dddddd;
      }
      &:focus {
        border-color: #0091ff;
      }
    }
  }
  .approve-edit-result {
    padding-left: 53px;
    span {
      margin-left: 15px;
      label::before {
        opacity: 1;
        content: "";
        display: inline-block;
        width: 14px;
        height: 14px;
        border: 1px solid #dddddd;
        border-radius: 50%;
        position: relative;
        top: 2px;
        left: -5px;
        cursor: pointer;
      }
    }
    input {
      opacity: 0;
      position: absolute;
      &:checked + label:before {
        border: 5px solid #0091ff;
        transition: all 250ms ease;
      }
    }
  }
  .approve-edit-sign {
    padding: 22px 0 10px 12px;
    .img-upload {
      width: 100px;
      height: 20px;
      cursor: pointer;
      color: #0091ff;
      overflow: hidden;
      display: inline-block;
    }
    .img-preview {
      margin-left: 10px;
      display: inline-block;
      img {
        height: 148px;
      }
    }
  }
  .approve-edit-footer {
    margin-top: 20px;
    border-top: 1px solid #f2f2f2;
    height: 82px;
    text-align: right;
    padding: 21px 26px 0 0;
    .el-button {
      height: 42px !important;
      width: 78px;
      padding: 0;
      span {
        font-size: 16px;
      }
      &:first-child span {
        color: #95a5bb;
      }
      &:last-child span {
        color: white;
      }
    }
  }
}
</style>