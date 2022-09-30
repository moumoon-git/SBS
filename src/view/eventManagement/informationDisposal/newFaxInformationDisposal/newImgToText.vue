<template>
  <div class="imgToText_wrap" v-show="flag" id="dialogOCR">
    <div class="header" @mousedown="mousedown">
      <span class="header-title">图文识别</span>
      <el-button @click="toText('重新')" size="medium"> 重新识别 </el-button>
      <!-- <img
        @click="closeImgToText"
        src="../../../../static/img/Communihistory/close.png"
        alt
      /> -->
    </div>
    <div class="distinguish">
      <!-- <div class="imageText">
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
        > -->
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
      <!-- <pdf :src="baseUrl + item.imgName" width="91px" height="125px"></pdf>
          <div>第{{ index + 1 }}/{{ imageTextArr.length }}页</div>
        </div>
      </div> -->
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
          <div class="page-container">
            <img
              src="./assets/images/arrow.svg"
              alt=""
              class="left-arrow"
              @click="handlePrePage"
            />
            <el-input
              v-model="page"
              class="page"
              @input="handleInput"
            ></el-input>
            <span class="division">/</span>
            <span>{{ imageTextArr.length }}</span>
            <img
              src="./assets/images/arrow.svg"
              alt=""
              class="right-arrow"
              @click="handleNextPage"
            />
          </div>
          <!-- 注释原因：对比了深圳项目此模块的页面，没有顺序旋转/保存修正的功能。重新识别功能挪到头部去 20210704 -->
          <!-- <el-button
            type="primary"
            @click="sequentialRotation"
            size="medium"
            v-if="isSequentialRotationIn"
            >顺序旋转</el-button
          > -->
          <!-- <el-button type="primary" @click="toText('反向')" size="medium"
            >反向识别</el-button
          > -->
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
import Qs from 'qs';
import { debounce } from '@/utils/common.js';
import wangeditor from 'wangeditor';
import pdf from 'vue-pdf';

export default {
  name: 'NewImgToText',
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
      editor: '',
      loading: false,
      textarea: '',
      flag: true,
      allData: {},
      selectElement: '',
      imageTextArr: [], // PDF列表
      imageArr: [], // 图文列表
      idx: 0, // 当前激活的图片索引
      pageData: {}, // 当前页信息
      result: '', // 识别结果
      oldFaxPath: '', // 传真文件路径
      faxOcrUrl: window.g.faxOcrUrl, // 传真OCR地址
      baseUrl: window.g.ApiUrl + '/fax/', // 服务器地址
      baseFaxOcrUrl: window.g.ApiUrl + '/fax',
      popupOn: false, // 判断是否点击每页保存还是点击保存修正按钮
      proxyUrl: window.SITE_CONFIG["proxyUrl"],
      identificationType: '重新', // 识别类型
    };
  },
  computed: {
    // 页码
    page() {
      return this.imageTextArr.length === 0 ? 0 : this.idx + 1;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initWangEditor();
      // 获取传真orc弹窗
      let dialogOCR = document.getElementById('dialogOCR');
      let that = this;
      // 监听弹窗的复制事件
      dialogOCR.addEventListener('copy', () => {
        var content = window.getSelection().toString();
        console.log('模板复制', content);
        that.$store.commit('setCopy', content); // 赋值到剪切板
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
        // .css("border", "1px solid #ccc")
        .css('position', 'relative')
        .css('overflow', 'auto')
        .css('text-align', 'left')
        .css('font-size', '14px')
        .css('width', '100%')
        .css('height', '620px');
    },
    // 复制全文
    copyText() {
      const el = document.createElement('textarea');
      el.value = this.textarea;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      const selected =
        document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false;
      el.select();
      document.execCommand('copy'); // 浏览器执行复制命令
      document.body.removeChild(el);
      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }
      this.$message({
        message: '已复制到剪切板',
        type: 'success',
      });
    },
    // 保存修改
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
        this.textarea = '';
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
              message: '保存成功',
              type: 'success',
            });
            this.flag = false;
          }
          this.imageTextArr[this.idx].result = this.textarea;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 弹窗拖动
    mousedown(event) {
      this.selectElement = document.getElementById('dialogOCR');
      let div1 = this.selectElement,
        distanceX = event.clientX - div1.offsetLeft,
        distanceY = event.clientY - div1.offsetTop,
        maxWidth = document.body.clientWidth,
        maxHeight = document.body.clientHeight;
      div1.style.cursor = 'move';

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

        div1.style.left = X + 'px';
        div1.style.top = Y + 'px';
      };

      // 清除拖动事件
      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
        div1.style.cursor = 'default';
      };
    },
    /**
     * @description 上一页传真转文字
     */
    handleInput() {
      if (this.idx < 0) this.idx = 0;
      if (this.idx > this.imageTextArr.length) {
        this.idx = this.imageTextArr.length - 1;
      }
      this.getPageData(this.imageTextArr[this.idx], this.idx);
    },
    /**
     * @description 上一页传真转文字
     */
    handlePrePage() {
      this.idx -= 1;
      if (this.idx < 0) this.idx = 0;
      this.getPageData(this.imageTextArr[this.idx], this.idx);
    },
    /**
     * @description 下一页传真转文字
     */
    handleNextPage() {
      this.idx += 1;
      if (this.idx > this.imageTextArr.length - 1) {
        this.idx = this.imageTextArr.length - 1;
      }
      this.getPageData(this.imageTextArr[this.idx], this.idx);
    },
    // 获取以保存的页数结果
    getPageData(obj, idx) {
      this.idx = idx;
      this.pageData = obj;
      const data = {
        faxId: this.faxId,
      };
      // this.$api.ocrResultList(data).then((res) => {
      //   if (res.errorcode == 0) {
      //     if (res.data.length > 0) {
      console.log('obj.id: ', obj.id);
      this.editor.txt.clear();
      const currtentFile = this.imageTextArr.find((item) => item.id == obj.id);
      if (currtentFile.result) {
        this.editor.txt.append(currtentFile.result);
      } else {
        this.toText('重新');
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
      let image = ''; // 转文字图片路径

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
            
            console.log('reverseOrForward res', res);
            if (res.errorcode == 0) {
              if (res.data) {
                // console.log('res.data: ', res.data[0]);
                // this.imageArr = res.data;
                // this.imageArr.map((v, index) => {
                //   if (index == this.idx) {
                //     image = v;
                //   }
                // });
                this.baiDuIdentify(res.data);
              } else {
                this.$message.error('暂无数据');
                this.loading = false;
              }
            } else {
              this.$message.error(res.msg);
              this.loading = false;
            }
          })
          .catch(() => {
            this.$message.error('接口报错');
            this.loading = false;
          });
      }
    },
    // 反向或正向识别
    reverseOrForward() {
      // 判断是正向还是反向
      if (this.identificationType == '重新') {
        let imageData = {
          id: this.faxId,
        };
        return axios({ // 获取单页传真文件流
          url: window.SITE_CONFIG["cloudUrl"] + '/event/fax/getSubPdfStream',
          method: 'get',
          params: { subPdfPath: this.imageTextArr[this.idx].fileUrl, },
        });
      } else if (this.identificationType == '反向') {
        let imageData = {
          faxId: this.faxId,
        };
        return this.$api.rotateTiff(imageData);
      }
    },
    // 百度AI 图文识别
    baiDuIdentify(image) {
      
      if (!JSON.parse(sessionStorage.getItem('textRecognition'))) {
        sessionStorage.setItem(
          'textRecognition',
          JSON.stringify({
            imageAccessToken: '',
            imageAccessTokenOverdue: true,
          }),
        );
      }
      let textRecognition = JSON.parse(
        sessionStorage.getItem('textRecognition'),
      ); // 存储的图文识别对象

      if (textRecognition.imageAccessTokenOverdue) {
        let apiKey = window.SITE_CONFIG['OCR'].apiKey;
        let secretKey = window.SITE_CONFIG['OCR'].secretKey;
        // axios.get(`/api/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`)
        axios({
          // url: `http://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`,
          url: `/api/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`,
          method: 'get',
        })
          .then((res) => {
            console.log('/api/oauth/2.0/token res', res);
            sessionStorage.setItem(
              'textRecognition',
              JSON.stringify({
                imageAccessToken: res.access_token,
                imageAccessTokenOverdue: false,
              }),
            );
            setTimeout(() => {
              sessionStorage.setItem(
                'textRecognition',
                JSON.stringify({
                  imageAccessToken: res.access_token,
                  imageAccessTokenOverdue: true,
                }),
              );
            }, res.expires_in * 1000);
            // 百度AI 图文识别
            this.accurate(res.access_token, image);
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
      axios({
        url: `/api/rest/2.0/ocr/v1/accurate?access_token=${access_token}`,
        method: 'post',
        headers: { 'Content-Type': ' application/x-www-form-urlencoded' },
        data,
      }).then((res) => {
          console.log('/api/rest/2.0/ocr/v1/accurate res', res);
          // if (!res.error_code) {
            this.editor.txt.clear();
            this.textarea = '';
            res.words_result.forEach((m) => {
              m.words = this.toDBC(m.words);
              let location = m.location;
              let style = `position: absolute; top: ${
                location.top / 2.5
              }px; left: ${location.left / 3}px`;
              this.editor.txt.append(`<p style="${style}">${m.words}</p>`);
              this.textarea += `<p style="${style}">${m.words}</p>`;
            });
            this.popupOn = false;
            // this.saveEventText();
            this.loading = false;
          // } 
          // else {
          //   this.$message.warning(res.error_msg);
          //   this.loading = false;
          // }
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
      var result = '';
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
      console.log('fileName: ', fileName);
      axios
        .get(
          this.faxOcrUrl +
            `/huaweiCloud/huaweiOcr?url=${this.baseFaxOcrUrl}${
              fileName.indexOf('/') > -1 ? fileName : '/' + fileName
            }&fileName=${
              fileName.indexOf('/') > -1 ? fileName : '/' + fileName
            }`,
        )
        // this.$api.splitToJpgs(imageData)
        .then((response) => {
          if (response.data.errorcode == 0) {
            this.editor.txt.clear();
            this.textarea = '';
            response.data.data.result.words_region_list.map((v, index) => {
              if (v.type == 'text') {
                v.words_block_list.map((item) => {
                  this.wordsAndLocation(item);
                });
              } else if (v.type == 'table') {
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
          this.$message.error('未获取到识别图片');
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
      this.$emit('closeImgToText');
    },
    sequentialRotation() {
      this.$emit('sequentialRotationIn');
    },
  },
};
</script>

<style scoped lang="scss">
.imgToText_wrap {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  box-sizing: border-box;

  .header {
    width: 100%;
    height: 45px;
    font-size: 15px;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px;
    box-sizing: border-box;

    img {
      cursor: pointer;
    }

    .header-title {
      font-size: 18px;
      font-weight: 500;
      color: #333333;
      line-height: 28px;
      position: relative;
      padding-left: 11px;

      &::before {
        display: block;
        content: '';
        position: absolute;
        left: 0;
        top: 7px;
        width: 3px;
        height: 18px;
        background: #0091ff;
      }
    }
  }

  .distinguish {
    width: 100%;
    display: flex;
    flex: 1;

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

    .right {
      width: 100%;
      display: flex;
      flex-direction: column;

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
        height: 630px !important;
      }

      .footer {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-right: 20px;
        box-sizing: border-box;
        margin-top: 30px;

        .page-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .page {
            width: 57px;
            height: 25px;

            & /deep/ input {
              height: 25px !important;
              padding: 0 !important;
              text-align: center;
            }
          }

          .division {
            margin: 0 18px;
          }

          .left-arrow {
            height: 20px;
            margin-right: 21px;
            cursor: pointer;
          }

          .right-arrow {
            height: 20px;
            transform: rotateZ(180deg);
            margin-left: 21px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
