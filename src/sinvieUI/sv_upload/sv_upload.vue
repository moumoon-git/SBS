<!--
 * @Author: yanghaoaho
 * @Date: 2021-01-22 09:23:57
 * @LastEditTime: 2021-02-24 16:29:24
 * @LastEditors: Please set LastEditors
 * @Description: 附件上传模块
 * @FilePath: /SBS/src/sinvieUI/sv_upload/sv_upload.vue
-->

<template>
  <div class="svUpload">
    <div class="svUpload-container">
      <!-- 附件上传按钮 -->
      <div
        v-if="!isView"
        class="svUpload-container__button"
        @click="uploading ? null : $refs.upload.click()"
      >
        上传文件
      </div>
      <input
        ref="upload"
        type="file"
        :accept="accept"
        style="display:none"
        multiple
        @change="getFile($event)"
      >
      <!-- 图片的上传展示 -->
      <div
        v-viewer
        class="svUpload-container__img"
      >
        <div
          v-for="(file, index) in imageList"
          :key="`${index}_${file.url}`"
          class="svUpload-container__img__item"
        >
          <img
            :src="`${cloudUrl}${file.url}`"
            :alt="file.name"
            class="svUpload-container__img__item__main"
          >
          <div
            v-if="!isView"
            class="svUpload-container__img__item__delete"
            @click="deleteFile(file.url)"
          />
        </div>
      </div>
      <!-- 图片类型外的附件展示 -->
      <div style="margin-top:20px;">
        <div
          v-for="(file, index) in otherFileList"
          :key="index"
          class="svUpload-container__otherfile"
        >
          <div
            class="svUpload-container__otherfile__title"
          />
          <div
            class="svUpload-container__otherfile__item"
            @click="$preview(file)"
          >
            {{ file.name }}
          </div>
          <div
            v-if="!isView"
            class="svUpload-container__otherfile__delete"
            @click="deleteFile(file.url)"
          />
          <div
            class="svUpload-container__otherfile__complete"
          />
        </div>
      </div>
      <!-- 上传附件过程的上传动画 -->
      <div
        v-for="(previewFile,index) in previewList"
        :key="index"
        class="svUpload-container__preview"
      >
        <div
          class="svUpload-container__preview__loading"
        />
        <div
          class="svUpload-container__preview__name"
        >
          {{ previewFile ? previewFile.name : '' }}
        </div>
        <div class="svUpload-container__preview__process">
          {{ previewFile ? previewFile.process : '' }}%
        </div>
        <!-- 叠加进度条 -->
        <div class="svUpload-container__preview__processBar" />
        <div :class="`svUpload-container__preview__processBar_${previewFile.process}`" />
      </div>
    </div>

    <sv-dialog-hint
      ref="hint_fail"
      type="fail"
      text="抱歉，上传失败！"
    />
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SvUpload',
  model: {
    prop: 'fileList',
    event: 'update',
  },
  props: {
    fileList: {
      type: Array,
      default: () => ([]),
    },
    accept: {
      type: String,
      default: '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*,video/*,audio/*,.xls,.xlsx,.txt,.pdf',
    },
    // 判断是否为查看状态
    isView: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      cloudUrl: window.SITE_CONFIG.cloudUrl, // 图片资源所在的服务器地址
      otherFileList: [], // 除图片外的附件类型的名字及地址
      imageList: [], // 附件类型为图片
      uploadApi: '/upload/emergencyHandleProcessFile', // 文件上传api
      uploading: false, // 上传加载提示
      localFileList: [], // 接受和传递数据
      previewList: [], // 拷贝一份上传文件数组，用于展示上传动画
    };
  },
  watch: {
    fileList: {
      deep: true,
      handler(newVal) {
        this.init(newVal);
      },
      immediate: true,
    },
  },
  methods: {
    /**
     * @description: 加载已经上传过的文件列表
     * @param {Object} fileList 传进来的附件对象
     */
    init(fileList) {
      if (fileList) {
        // 获取上传的文件列表，并将文件分为图片与非图片类型
        this.localFileList = [...this.fileList];
        this.imageList = [];
        this.otherFileList = [];
        this.localFileList.forEach((item) => {
          const isImageUrl = item.url;
          if (isImageUrl) {
            if (isImageUrl.match(/\.(png|jpe?g|svg|bmp|gif|webp)$/i)) {
              this.imageList.push({
                name: item.name || item.documentName,
                url: item.url,
              });
            } else {
              this.otherFileList.push({
                name: item.name || item.documentName,
                url: item.url,
              });
            }
          }
        });
      }
    },
    /**
      * @method
      * @desc 文件上传，返回文件保存在服务器中的地址
      * @param {object} event 上传文件事件
      */
    getFile(event) {
      this.uploading = true;
      const upLoadUrl = window.SITE_CONFIG.baseUrl + this.uploadApi;
      const newFileList = event.target.files;
      this.previewList = [];
      this.imageList = [];
      this.otherFileList = [];
      // 每次上传都分别请求一次
      newFileList.forEach((file) => {
        const temp = {};
        temp.name = file.name;
        temp.process = 0;
        this.previewList.push(temp);
        const formData = new FormData();
        formData.append('file', file);
        // 每次请求头
        const request = {
          method: 'post',
          url: upLoadUrl,
          baseUrl: window.SITE_CONFIG.baseUrl,
          data: formData,
          headers: {
            'content-type': 'multipart/form-data;charset=UTF-8;',
            token: this.$cookie.get('token'),
          },
          // 获取文件上传进度
          onUploadProgress: (progressEvent) => {
            const complete = Number((progressEvent.loaded / progressEvent.total) * 100).toFixed(0);
            temp.process = complete;
          },
        };
        axios(request).then((response) => {
          if (response.data.code === 0) {
            // 上传完成一个后从上传列表中删除
            const index = this.previewList.findIndex((item) => item.name === response.data.name);
            this.previewList.splice(index, 1);
            this.localFileList.push({
              documentName: response.data.data.name,
              name: response.data.data.name,
              url: response.data.data.url,
            });
            const isImageUrl = response.data.data.url;
            // 将图片与其他类型的附件分开保存进行渲染
            if (isImageUrl.match(/\.(png|jpe?g|svg|bmp|gif|webp)$/i)) {
              this.imageList.push({
                name: response.data.data.name,
                url: response.data.data.url,
              });
            } else {
              this.otherFileList.push({
                name: response.data.data.name,
                url: response.data.data.url,
              });
            }
          } else {
            this.$refs.hint_fail.supplementText = `错误代码：${response.data.code}`;
            this.$refs.hint_fail.visible = true;
          }
          event.srcElement.value = '';
          this.uploading = false;
          this.$emit('update', this.localFileList);
        }).catch((error) => {
          this.uploading = false;
          this.$refs.hint_fail.supplementText = error;
          this.$refs.hint_fail.visible = true;
        });
      });
    },
    /**
     * @desc 删除文件，需要删除localFileList，图片或者非图片的类型对应的数组中的文件
     * @param {String} url 文件的地址（唯一值）
     */
    deleteFile(url) {
      // 从localFileList删除并反馈给v-mode的值
      const mainIndex = this.localFileList.findIndex((element) => element.url === url);
      this.localFileList.splice(mainIndex, 1);
      this.$emit('update', this.localFileList);
      // 视觉删除
      if (this.imageList.findIndex((element) => element.url === url) > -1) {
        const index = this.imageList.findIndex((element) => element.url === url);
        this.imageList.splice(index, 1);
      } else {
        const index = this.otherFileList.findIndex((element) => element.url === url);
        this.otherFileList.splice(index, 1);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
  .svUpload {
    .svUpload-container {
        &__button{
        display: inline-flex;
        border:1px solid #999999;
        justify-content: center;
        align-items: center;
        width: 88px;
        height: 28px;
        line-height: 1.5;
        border-radius: 4px;
        font-size: 12px;
        color: #666666;
        margin: 0 10px 10px 0;
        position: relative;
        vertical-align: bottom;
        cursor: pointer;
        // 上传按钮图片及悬浮样式
        &::before{
          content: '';
          display: block;
          width: 14px;
          height: 14px;
          margin: 4px;
          background: no-repeat center/100% 100% url('../img/upload.svg');
        }
        &:hover {
          color: #2476e0;
          border:1px solid #2476e0;
        }
        &:hover::before{
        background: no-repeat center/100% 100% url('../img/upload_hover.svg');
        }
      }
     // 图片的展示样式
     &__img {
       display: flex;
       justify-content: flex-start;
       flex-wrap: wrap;
       font-size: 0;
       margin-top:-10px;
       * {user-select: none}
       &__item {
         margin:20px 10px 0px 0px;
         position: relative;
         &__main {
         height:88px;
         width: 88px;
         margin-bottom: -10px;
         padding-top: 5px;
         cursor: zoom-in;
         }
         &__delete {
            cursor: pointer;
            display: inline-block;
            width: 20px;
            height: 20px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 10px;
            position: absolute;
            right: -5px;
            top: -5px;
            &:before {
                content: '';
                display: block;
                width: 12px;
                height: 12px;
                margin: 4px;
                background: no-repeat center/100% 100% url('../img/upload_delete.svg');
            }
            &:hover {
                background: #F66E6E;
            }
           }
       }
     }
     // 非图片的文件类型的展示效果
     &__otherfile {
        position: relative;
        cursor: pointer;
        &__item {
          // background: #f4f4f4;
          border-radius: 4px;
          padding:0px 20px;
          color: #666666;
          line-height:1.5;
          &:hover{
            color: #0091FF;
          }
        }
         &__title {
            cursor: pointer;
            position: absolute;
            left: 0px;
            &:before {
                content: '';
                display: block;
                width: 12px;
                height: 12px;
                margin: 4px;
                background: no-repeat center/100% 100% url('../img/fujian.svg');
            }
           }
          &__delete {
            cursor: pointer;
            display: none;
            width: 18px;
            height: 18px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 10px;
            position: absolute;
            right: 2px;
            top: 2px;
            &:before {
                content: '';
                display: block;
                width: 10px;
                height: 10px;
                margin: 4px;
                background: no-repeat center/100% 100% url('../img/upload_delete.svg');
            }
            &:hover {
                background: #F66E6E;
            }
           }
           &__complete {
            cursor: pointer;
            display: inline-block;
            width: 18px;
            height: 18px;
            background: #5ACD76;
            border-radius: 10px;
            position: absolute;
            right: 2px;
            top: 2px;
            &:before {
                content: '';
                display: block;
                width: 10px;
                height: 10px;
                margin: 4px;
                background: no-repeat center/100% 100% url('../img/right.svg');
            }
            &:hover {
                background: #F66E6E;
            }
           }
          &:hover {
          background: #F6F7FA;
          .svUpload-container__otherfile__delete {
            display: inline-block;
          }
          .svUpload-container__otherfile__complete {
            display: none;
          }
          }
     }
     // 上传过程的过场动画
    &__preview {
      display: inline-flex;
      width: 100%;
      position: relative;
      padding:5px;
      font-size: 10px;
      color:#999999;
      line-height: 1.5;
      &__loading {
        cursor: pointer;
            position: absolute;
            left: 0px;
            @keyframes sv-animation-rotate {
              from {transform: rotate(0);}
              to {transform: rotate(360deg);}
            }
            &:before {
                content: '';
                display: block;
                width: 16px;
                height: 16px;
                margin: 0px 4px;
                background: no-repeat center/100% 100% url('../img/upload_loading.svg');
                animation: linear infinite sv-animation-rotate 2s;
      }}
      &__name {
        padding:0px 20px;
      }
      &__process {
        position: absolute;
        right: 0px;
      }
      // 加载进度条的样式
      &__processBar {
         background-image: linear-gradient(#DFE8F1);
         width: 100%;
         position: absolute;
        height: 3px;
        bottom:0%;
        @for $i from 0 through 100 {
        &_#{$i} {
         background: #67c23a;
         width: $i * 1%;
         position: absolute;
        height: 3px;
        bottom:0%;
        transition: width 1s;
        }
        }
      }
    }

  }}
</style>
