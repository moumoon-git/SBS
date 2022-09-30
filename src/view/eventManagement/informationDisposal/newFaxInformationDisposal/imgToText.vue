<template>
  <div class="imgToText_wrap" id="dialogOCR">
    <div class="header">
      <span>传真OCR</span>
    </div>
    <div class="distinguish">
      <div class="imageText">
        <div class="oneImageText">
          <iframe
            :src="oldFaxPath"
            width="91px"
            height="125px"
            frameborder="no"
            border="0"
            marginwidth="0"
            marginheight="0"
            scrolling="no"
            allowtransparency="yes"
          ></iframe>
          <div>传真文件</div>
        </div>
        <div
          class="oneImageText"
          v-for="(item, index) in imageTextArr"
          :key="index"
          @click="getPageData(item, index)"
        >
          <!-- 注释原因： 父级点击时候，子级不能选中，更换插件显示 -->
          <!-- <iframe
            :src="baseUrl + item"
            width="91px"
            height="125px"
            frameborder="no"
            border="0"
            marginwidth="0"
            marginheight="0"
            scrolling="no"
            allowtransparency="yes"
          ></iframe>-->
          <pdf :src="baseUrl + item.imgName" width="91px" height="125px"></pdf>
          <div>第{{ index + 1 }}/{{ imageTextArr.length }}页</div>
        </div>
      </div>
      <div class="right">
        <!--        <el-input type="textarea" placeholder="请输入内容" v-model="textarea" class="content"></el-input>-->
        <!--        <textarea ref="textareaContent" class="textarea-content">{{ textarea }}</textarea>-->
        <div
          class="editor"
          v-loading="loading"
          element-loading-text="识别中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.3)"
        >
          <div ref="toolbar" style="display: none"></div>
          <div ref="editor"></div>
        </div>
        <div class="footer">
          <!-- <el-button
            type="primary"
            @click="sequentialRotation"
            size="medium"
            v-if="isSequentialRotationIn"
            >顺序旋转</el-button
          > -->
          <!-- <el-button type="primary" @click="toText('反向')" size="medium">反向识别</el-button> -->
          <!-- <el-button type="primary" @click="toText('重新')" size="medium"
            >重新识别</el-button
          >
          <el-button
            type="primary"
            @click="
              saveEventText();
              popupOn = true;
            "
            size="medium"
            >保存修正</el-button
          > -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/assets/api/api'
import Qs from "qs";
import wangeditor from "wangeditor";
import pdf from "vue-pdf";

export default {
  name: "imgToText",
  components: {
    pdf,
  },
  props: {
    faxId: {
      type: Number,
    },
    isSequentialRotationIn: {
      type: Boolean,
    },
  },
  data() {
    return {
      editor: "",
      loading: false,
      textarea: "",
      allData: {},
      selectElement: "",
      imageTextArr: [], //PDF列表
      imageArr: [], // 图片数据
      baseUrl: window.SITE_CONFIG["cloudUrl"] + "/fax/",
      idx: 0, // 当前页码
      result: "", // 识别结果
      oldFaxPath: "", // 传真文件路径
      popupOn: false, // 判断是否点击每页保存还是点击保存修正按钮
      proxyUrl: window.SITE_CONFIG["proxyUrl"],
      identificationType: "重新", // 识别类型
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initWangEditor();
      // 获取传真orc弹窗 传真图文转文字-复制传真也把传真内容剪切到短信模板中 author:hexinting date:2020-9-25
      let dialogOCR = document.getElementById("dialogOCR");
      let that = this;
      // 监听弹窗的复制事件
      dialogOCR.addEventListener("copy", () => {
        var content = window.getSelection().toString();
        console.log("模板复制", content);
        that.$store.commit("setCopy", content); // 赋值到剪切板
      });
    });
  },
  methods: {
    initWangEditor() {
      this.editor = new wangeditor(this.$refs.toolbar, this.$refs.editor);
      this.editor.customConfig.menus = [];
      this.editor.customConfig.onchange = (html) => {
        this.textarea = html;
      };
      // 创建富文本编辑器
      this.editor.create();
      this.editor.$textContainerElem
        .css("border", "1px solid #ccc")
        .css("position", "relative")
        .css("overflow", "auto")
        .css("text-align", "left")
        .css("font-size", "14px")
        .css("width", "672px")
        .css("height", "620px");
    },
    //复制全文
    copyText() {
      const el = document.createElement("textarea");
      el.value = this.textarea;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      const selected =
        document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false;
      el.select();
      document.execCommand("copy"); // 浏览器执行复制命令
      document.body.removeChild(el);
      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }
      this.$message({
        message: "已复制到剪切板",
        type: "success",
      });
    },
    //保存修改
    // saveEventText() {
    //   let data = {
    //     id: this.allData.id,
    //     statusId: "",
    //     eventId: this.allData.eventId,
    //     remark: this.allData.remark,
    //     title: "",
    //     result: this.allData.result,
    //     type: this.allData.type,
    //     faxText: this.textarea
    //   };
    //   this.$api.disposeFax(data).then(res => {
    //     if (res.errorcode == 0) {
    //       this.$message({
    //         message: "保存成功",
    //         type: "success"
    //       });
    //       this.flag = false;
    //     }
    //   });
    // },

    saveEventText() {
      if (!this.editor.txt.text()) {
        this.textarea = "";
      }
      let data = {
        resultId: this.pageData.id,
        imgFileName: this.pageData.imgName,
        faxId: this.faxId,
        page: this.idx + 1 || 1,
        result: this.textarea,
      };
      this.$api.saveOcrResult(data).then((res) => {
        if (res.errorcode == 0) {
          if (this.popupOn) {
            this.$message({
              message: "保存成功",
              type: "success",
            });
          }
          this.imageTextArr[this.idx].result = this.textarea;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 获取以保存的页数结果
    getPageData(obj, idx) {
      this.idx = idx;
      this.pageData = obj;
      let data = {
        faxId: this.faxId,
      };
      // this.$api.ocrResultList(data).then((res) => {
      //   if (res.errorcode == 0) {
      //     if (res.data.length > 0) {
      this.editor.txt.clear();
      let currtentFile = this.imageTextArr.find((item) => item.id == obj.id);
      if (currtentFile.result) {
        this.editor.txt.append(currtentFile.result);
      } else {
        this.toText("重新", obj);
      }
      //   } else {
      //     this.toText('重新');
      //   }
      // } else {
      //   this.toText('重新');
      // }
      // })
    },
    // 图片转文字结果
    toText(identificationType, faxItem) {
      this.loading = true;
      // 判断哪种类型识别
      if (this.identificationType != identificationType) {
        this.identificationType = identificationType;
        this.imageArr = [];
      }
      let image = ""; // 转文字图片路径

      if (this.imageArr.length > 0) {
        this.imageArr.map((v, index) => {
          if (index == this.idx) {
            image = v;
          }
        });
        console.log("image: ", image);
        this.baiDuIdentify(image);
      } else {
        this.reverseOrForward(faxItem)
          .then((res) => {
            console.log("reverseOrForward   res", res);
            if (res.errorcode == 0) {
              if (res.data && res.data.length > 0) {
                this.imageArr = res.data;
                // console.log('res.data: ', res.data[0]);
                this.imageArr.map((v, index) => {
                  if (index == this.idx) {
                    image = v;
                  }
                });
                console.log("image: ", image);
                this.baiDuIdentify(image);
              } else {
                this.$message.error("暂无数据");
                this.loading = false;
              }
            } else {
              this.$message.error(res.msg);
              this.loading = false;
            }
          })
          .catch(() => {
            this.$message.error("接口报错");
            this.loading = false;
          });
      }
    },
    // 反向或正向识别
    reverseOrForward(faxItem) {
      // 判断是正向还是反向
      if (this.identificationType == "重新") {
        let imageData = {
          id: this.faxId,
        };
        return axios({ // 获取单页传真文件流
          url: window.SITE_CONFIG["cloudUrl"] + '/event/fax/getSubPdfStream',
          method: 'get',
          params: { subPdfPath: faxItem.fileUrl, },
        });
      } else if (this.identificationType == "反向") {
        let imageData = {
          faxId: this.faxId,
        };
        return this.$api.rotateTiff(imageData);
      }
    },
    // 百度AI 图文识别
    baiDuIdentify(image) {
      if (!JSON.parse(sessionStorage.getItem("textRecognition"))) {
        sessionStorage.setItem(
          "textRecognition",
          JSON.stringify({
            imageAccessToken: "",
            imageAccessTokenOverdue: true,
          })
        );
      }
      let textRecognition = JSON.parse(
        sessionStorage.getItem("textRecognition")
      ); // 存储的图文识别对象

      if (textRecognition.imageAccessTokenOverdue) {
        let apiKey = window.SITE_CONFIG['OCR'].apiKey;
        let secretKey = window.SITE_CONFIG['OCR'].secretKey;
        // axios.get(`/api/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`)
        //axios.get(`${this.proxyUrl}/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`)
        axios
          .get(
            `${this.proxyUrl}/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`
          )
          .then((res) => {
            sessionStorage.setItem(
              "textRecognition",
              JSON.stringify({
                imageAccessToken: res.data.access_token,
                imageAccessTokenOverdue: false,
              })
            );
            setTimeout(() => {
              sessionStorage.setItem(
                "textRecognition",
                JSON.stringify({
                  imageAccessToken: res.data.access_token,
                  imageAccessTokenOverdue: true,
                })
              );
            }, res.data.expires_in * 1000);
            // 百度AI 图文识别
            this.accurate(res.data.access_token, image);
          })
          .catch((e) => {
            this.loading = false;
          });
      } else {
        // 百度AI 图文识别
        this.accurate(textRecognition.imageAccessToken, image);
      }
    },
    // 百度AI 图文识别
    accurate(access_token, image) {
      let data = Qs.stringify({ access_token, image });
      axios
        .post(`${this.proxyUrl}/rest/2.0/ocr/v1/accurate`, data, {
          headers: { "Content-Type": " application/x-www-form-urlencoded" },
        })
        .then((res) => {
          if (!res.data.error_code) {
            this.editor.txt.clear();
            this.textarea = "";
            res.data.words_result.forEach((m) => {
              let location = m.location;
              let style = `position: absolute; top: ${
                location.top / 2.5
              }px; left: ${location.left / 3}px`;
              this.editor.txt.append(`<p style="${style}">${m.words}</p>`);
              this.textarea += `<p style="${style}">${m.words}</p>`;
            });
            this.popupOn = false;
            this.saveEventText();
            this.loading = false;
          } else {
            this.$message.warning(res.data.error_msg);
            this.loading = false;
          }
        })
        .catch((e) => {
          this.editor.txt.clear();
          this.loading = false;
        });
    },
    // 识别的文字和位置
    wordsAndLocation(obj) {
      let location = obj.location;
      let style = `position: absolute; top: ${location[3][1] / 2.5}px; left: ${
        location[0][0] / 3
      }px`;
      this.editor.txt.append(`<p style="${style}">${obj.words}</p>`);
      this.textarea += `<p style="${style}">${obj.words}</p>`;
    },
    sequentialRotation() {
      this.$emit("sequentialRotationIn");
    },
  },
};
</script>

<style scoped lang="scss">
.imgToText_wrap {
  width: 825px;
  height: 742px;
  background: #fff;
  display: flex;
  flex-direction: column;
  z-index: 9999;
  box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.27);
  border-radius: 5px;

  .header {
    width: 100%;
    height: 45px;
    background: rgba(241, 244, 246, 1);
    border-radius: 4px 4px 0px 0px;
    font-size: 15px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 13px 0 28px;
    box-sizing: border-box;

    img {
      cursor: pointer;
    }
  }

  .distinguish {
    width: 100%;
    display: flex;

    .imageText {
      width: 150px;
      height: 630px;
      overflow: scroll;

      .img {
        width: 91px;
        height: 125px;
        margin-bottom: 8px;
      }

      .oneImageText {
        background: rgba(0, 0, 0, 0.04);
        padding: 14px 20px 8px 29px;
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  .right {
    /deep/ .el-textarea {
      width: 480px;
      height: 100%;
    }

    /deep/ .el-textarea__inner {
      resize: none;
      width: 100%;
      height: 100%;
      overflow: scroll;
      border: none;
    }

    .content {
      height: 620px !important;
    }

    .footer {
      height: 65px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      border-top: 1px solid #f2f2f2;
      padding-right: 20px;
      box-sizing: border-box;
    }
  }
}
</style>
