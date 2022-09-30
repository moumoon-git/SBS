<template>
  <div class="imgToText_wrap" v-show="flag" id="dialogOCR">
    <div class="header" @mousedown="mousedown">
      <span>传真OCR</span>
      <img
        @click="closeImgToText"
        src="../../../../static/img/Communihistory/close.png"
        alt
      />
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
          <!-- iframe更换为PDF 原因： 父级点击时候，子级不能选中，更换插件显示 -->
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
          <div ref="editor" class="editorStyle"></div>
        </div>
        <div class="footer">
          <el-button
            type="primary"
            @click="sequentialRotation"
            size="medium"
            v-if="isSequentialRotationIn"
            >顺序旋转</el-button
          >
          <!-- <el-button type="primary" @click="toText('反向')" size="medium"
            >反向识别</el-button
          > -->
          <el-button type="primary" @click="toText('重新')" size="medium"
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
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Qs from "qs";
import { debounce } from "@/utils/common.js";
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
      flag: false,
      allData: {},
      selectElement: "",
      imageTextArr: [], //PDF列表
      imageArr: [], //图文列表
      idx: "", // 当前页码
      pageData: {}, // 当前页信息
      result: "", // 识别结果
      oldFaxPath: "", // 传真文件路径
      faxOcrUrl: window.g.faxOcrUrl, //传真OCR地址
      baseUrl: window.g.ApiUrl + "/fax/", // 服务器地址
      baseFaxOcrUrl: window.g.ApiUrl + "/fax",
      popupOn: false, // 判断是否点击每页保存还是点击保存修正按钮
      proxyUrl: window.g.proxyUrl,
      identificationType: "重新", // 识别类型
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initWangEditor();
      // 获取传真orc弹窗
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
        // 等富文本赋值完在保存
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
            this.flag = false;
          }
          this.imageTextArr[this.idx].result = this.textarea;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    //弹窗拖动
    mousedown(event) {
      this.selectElement = document.getElementById("dialogOCR");
      let div1 = this.selectElement,
        distanceX = event.clientX - div1.offsetLeft,
        distanceY = event.clientY - div1.offsetTop,
        maxWidth = document.body.clientWidth,
        maxHeight = document.body.clientHeight;
      div1.style.cursor = "move";

      // 添加拖动事件
      document.onmousemove = function (ev) {
        var oevent = ev || event;
        let x = oevent.clientX - distanceX,
          y = oevent.clientY - distanceY,
          X =
            x < 0
              ? 0
              : x + div1.offsetWidth > maxWidth
              ? maxWidth - div1.offsetWidth
              : x,
          Y =
            y < 0
              ? 0
              : y + div1.offsetHeight > maxHeight
              ? maxHeight - div1.offsetHeight
              : y;

        div1.style.left = X + "px";
        div1.style.top = Y + "px";
      };

      // 清除拖动事件
      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
        div1.style.cursor = "default";
      };
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
      console.log("obj.id: ", obj.id);
      this.editor.txt.clear();
      let currtentFile = this.imageTextArr.find((item) => item.id == obj.id);
      if (currtentFile.result) {
        this.editor.txt.append(currtentFile.result);
      } else {
        this.toText("重新");
      }
      //   } else {
      //     this.toText('重新');
      //   }
      // } else {
      //   this.toText('重新');
      // }
      // });
    },
    // 图片转文字结果
    toText(identificationType) {
      // 如果上次识别类型和当前点击识别类型不一样  // 重新请求相反图片接口
      if (this.identificationType != identificationType) {
        this.identificationType = identificationType;
        this.imageArr = [];
      }
      this.loading = true;
      let image = ""; // 转文字图片路径

      if (this.imageArr.length > 0) {
        this.imageArr.map((v, index) => {
          if (index == this.idx) {
            image = v;
          }
        });
        this.baiDuIdentify(image);
      } else {
        this.reverseOrForward()
          .then((res) => {
            if (res.errorcode == 0) {
              if (res.data && res.data.length > 0) {
                // console.log('res.data: ', res.data[0]);
                this.imageArr = res.data;
                this.imageArr.map((v, index) => {
                  if (index == this.idx) {
                    image = v;
                  }
                });
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
    reverseOrForward() {
      // 判断是正向还是反向
      if (this.identificationType == "重新") {
        let imageData = {
          id: this.faxId,
        };
        return this.$api.splitToJpgs(imageData);
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
          console.log("res: ", res);
          if (!res.data.error_code) {
            this.editor.txt.clear();
            this.textarea = "";
            res.data.words_result.forEach((m) => {
              m.words = this.toDBC(m.words);
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
    // 获取以保存的页数结果
    // getPageData(idx){
    //   this.idx = idx;
    //   this.loading = true;
    //   let data = {
    //     faxId: this.faxId,
    //   };
    //   this.$api.ocrResultList(data).then(res => {
    //     if (res.errorcode == 0) {
    //       if (res.data.length>0) {
    //         this.editor.txt.clear();
    //         let currtentFile = res.data.find(item => item.page == idx +1)
    //         if (currtentFile) {
    //           this.editor.txt.append(currtentFile.result)
    //           this.loading = false
    //         }else{
    //           this.toText()
    //         }
    //       }else{
    //         this.toText()
    //       }
    //     }else{
    //       this.toText()
    //     }
    //   });
    // },
    // // 华为云图文识别
    // toText() {
    //   if (!this.idx) {
    //     this.getFileUrl().then((res)=>{
    //       // console.log('res: ', res);
    //       this.huaweiOcr(res)
    //     })
    //   }else{
    //     this.splitToJpgsForHuawei().then((res)=>{
    //       // console.log('res: ', res);
    //       this.huaweiOcr(res[this.idx-1])
    //     })
    //   }
    // },
    /**
     * @description: 英文字符转换成中文字符
     * @lastUpdateTime : 2020-12-28 19:42
     * @author: xuchuangxing
     * @param {*} str 要转换的字符
     * @return {*}
     */
    toDBC(str) {
      var result = "";
      var len = str.length;
      for (var i = 0; i < len; i++) {
        var cCode = str.charCodeAt(i);
        //全角与半角相差（除空格外）：65248(十进制)
        cCode = cCode >= 0x0021 && cCode <= 0x007e ? cCode + 65248 : cCode;
        //处理空格
        cCode = cCode == 0x0020 ? 0x03000 : cCode;
        result += String.fromCharCode(cCode);
      }
      return result;
    },
    // 完整PDF识别
    async getFileUrl() {
      let data = {
        id: this.faxId,
      };
      return new Promise((resolve, reject) => {
        this.$api.getFileUrl(data).then((res) => {
          if (res.errorcode == 0) {
            resolve(res.data);
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    // 分页图片识别
    async splitToJpgsForHuawei() {
      let data = {
        id: this.faxId,
      };
      return new Promise((resolve, reject) => {
        this.$api.splitToJpgsForHuawei(data).then((res) => {
          if (res.errorcode == 0) {
            resolve(res.data);
            // console.log('res: ', res);
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    // 华为OCR接口
    huaweiOcr(fileName) {
      console.log("fileName: ", fileName);
      axios
        .get(
          this.faxOcrUrl +
            `/huaweiCloud/huaweiOcr?url=${this.baseFaxOcrUrl}${
              fileName.indexOf("/") > -1 ? fileName : "/" + fileName
            }&fileName=${
              fileName.indexOf("/") > -1 ? fileName : "/" + fileName
            }`
        )
        // this.$api.splitToJpgs(imageData)
        .then((response) => {
          if (response.data.errorcode == 0) {
            this.editor.txt.clear();
            this.textarea = "";
            response.data.data.result.words_region_list.map((v, index) => {
              if (v.type == "text") {
                v.words_block_list.map((item) => {
                  this.wordsAndLocation(item);
                });
              } else if (v.type == "table") {
                v.words_block_list.map((item) => {
                  item.words_list.forEach((m) => {
                    this.wordsAndLocation(m);
                  });
                });
              }
            });
            this.popupOn = false;
            this.saveEventText();
            this.loading = false;
          }
        })
        .catch((e) => {
          this.$message.error("未获取到识别图片");
          this.editor.txt.clear();
          this.loading = false;
        });
    },
    // 识别的文字和位置
    wordsAndLocation(obj) {
      let location = obj.location;
      let style = `position: absolute; top: ${location[3][1] / 3}px; left: ${
        location[0][0] / 3
      }px`;
      this.editor.txt.append(`<p style="${style}">${obj.words}</p>`);
      this.textarea += `<p style="${style}">${obj.words}</p>`;
    },
    // 关闭弹窗
    closeImgToText() {
      this.flag = false;
      this.$emit("closeImgToText");
    },
    sequentialRotation() {
      this.$emit("sequentialRotationIn");
    },
  },
};
</script>

<style scoped lang="scss">
.imgToText_wrap {
  position: fixed;
  right: 10%;
  bottom: 10%;
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
