<!-- 上传文件组件 author:hexinting date:2020-11-24 -->
<template>
  <div>
    <div class="upload_content">
      <span v-if="label !=='' " class="upload-content__label">{{ label }}</span>
      <el-upload
        ref="upload"
        :file-list="uploadFile"
        with-credentials
        accept=".pdf, .jpg, .jpeg, .png, .ppt, .pptx, .doc, .docx, .txt, .xlsx, .xls"
        action=""
        :headers="{
          Authorization: $window.localStorage.getItem('token')
            ? $window.localStorage.getItem('token')
            : '',
        }"
        :on-success="onsuccess"
        :before-upload="onBeforeUpload"
        :http-request="httpRequest"
        class="upload_wrap"
      >
        <div class="upload_button">
          <img
            src="/static/img/Communihistory/upload.png"
            alt="上传附件"
            class="upload_icon"
          />
          <span>上传文件</span>
        </div>
      </el-upload>
    </div>
    <!-- 图片列表 -->
    <div v-if="imageList.length > 0" class="image_list">
      <div v-for="(img, index) in imageList" :key="img.id" class="img_wrap">
        <!-- <el-image
          class="img_item"
          :src="img.url"
          :preview-src-list="imageUrlList"
        /> -->
        <viewer>
          <img :src="img.url" alt="" class="img_item">
        </viewer>
        <img
          src="/static/img/icon/close.png"
          class="img_delete"
          @click.stop.prevent="deleteFile(img)"
        >
      </div>
    </div>
    <!-- 文件列表 -->
    <div class="file_list">
      <div
        v-for="(item, index) in fileList"
        :key="item.index"
        class="file_item"
      >
        <i class="el-icon-paperclip" />
        <span class="file_name" @click="downloadFile(item)">{{
          item.fileName
        }}</span>
        <img
          v-if="item.type === 'success'"
          src="/static/img/icon/tick.png"
          alt=""
          class="upload_success_icon"
        />
        <i class="el-icon-close" @click.stop.prevent="deleteFile(item)" />
        <i v-if="item.type === 'loading'" class="el-icon-loading" />
      </div>
    </div>
  </div>
</template>
<script>
import { matchFileType } from '@/assets/js/yz_common.js';
import { mapGetters } from 'vuex';
import Cookies from 'js-cookie';
import axios from 'axios';

const $downLoadFile = require('@/utils/downloadFile.js').default;

export default {
  name: 'UploadFile',
  props: {
    attachments: {
      // attachments: 附件列表
      default() {
        return [];
      },
      type: Array,
    },
    label: {
      // 上传文本
      default: '',
      type: String,
    },
  },
  data() {
    return {
      fileList: [], // 附件列表
      imageList: [], // 图片列表
      imageUrlList: [], // 存放图片的显示路径
      uploadFile: [], // 上传的附件数据
      uploadFileData: [], // 上传的附件数据
      fileUrl: window.SITE_CONFIG.fileupload, // 文件服务器地址
    };
  },
  computed: {
    ...mapGetters({
      commonInformationReport: 'getCommonInformationReport',
    }),
  },
  watch: {
    /**
     * @author hexinting
     * @date 2020-11-29
     * @lastDate 2020-12-03
     * @description 监听上传附件
     */
    attachments: {
      handler(newVal, oldVal) {
        if (newVal && oldVal) {
          if (newVal.length === 0 && oldVal.length !== 0) {
            this.imageList = [];
            this.imageUrlList = [];
            this.fileList = [];
            this.uploadFileData = [];
          } else {
            this.imageList = [];
            this.imageUrlList = [];
            this.fileList = [];
            this.uploadFileData = newVal;
            newVal.forEach((item) => {
              this.judgeFileType(item, 'success'); // 判断文件类型
            });
          }
        } else if (newVal) {
          this.imageList = [];
          this.imageUrlList = [];
          this.fileList = [];
          this.uploadFileData = newVal;
          newVal.forEach((item) => {
            this.judgeFileType(item, 'success'); // 判断文件类型
          });
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    /**
     * @param {Object} file 获取到文件的一些信息
     * @author hexinting
     * @date 2021-02-07
     * @description 自定义上传方法 上传到文件服务器
     */
    httpRequest(file) {
      let params = new FormData();
      params.append('filename', file.file.name); // 文件名
      params.append('functionPoint', 'EVENTATTACH'); // 后端定义要上传
      params.append('time', new Date().formatDate('yyyyMMddhhmmss')); // 时间戳
      params.append('file', file.file); // 文件
      axios({
        url: `${window.SITE_CONFIG.fileupload}/eos/event/sum/report/upload`,
        method: 'post',
        data: params,
        headers: {
          token: this.$cookie.get('token'),
        },
      })
        .then((res) => {
          if (res.data.errorcode === 0) {
            // const result = {};
            // result.data = {
            //   fileName: res.data.data.filePath.split('/').pop(),
            //   filePath: res.data.data.filePath,
            // };
            // this.onsuccess(result, file.file); // 上传成功
            this.onsuccess(res.data, file.file); // 上传成功
          } else if (res.data.errorcode === 10002) {
            this.$router.push({
              path: '/login',
            }); // 登录失效，调转到登录页
          } else {
            this.$message({
              type: 'warn',
              message: res.data.msg,
            });
          }
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: error.message,
          });
        });
    },
    /**
     * @param {Object} item 文件数据
     * @author hexinting
     * @date 2020-12-03
     * @lastDate 2021-02-07
     * @description 下载附件
     */
    downloadFile(item) {
      if (item.id) {
        // 下载文件
        const request = {
          method: 'get',
          url: `/eos/event/sum/downloadFile?fileName=${item.fileName}&filePath=${item.filePath}`,
          baseURL: window.SITE_CONFIG.fileupload,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            token: Cookies.get('token'),
          },
          responseType: 'arraybuffer',
        };
        $downLoadFile(request);
      } else {
        this.$message({
          message: '数据未保存，不支持下载。',
          type: 'info',
        });
      }
    },
    /**
     * @param {} file 文件数据
     * @param {String} type success:代表是从接口返回的文件；loading:代表正在上传中的文件
     * @author hexinting
     * @date 2021-02-07
     * @description 判断文件类型
     */
    judgeFileType(file, type) {
      if (type === 'success') {
        let urls = '';
        if (file.filePath) {
          urls = window.SITE_CONFIG.fileupload + file.filePath;
        } else {
          urls = window.SITE_CONFIG.cloudUrl + file.url;
        }
        if (matchFileType(file.filename) === 2) {
          // 2 是图片
          this.imageList.push({
            url: urls,
            fileName: file.title || file.filename || file.fileName,
            type,
            filePath: file.filePath || file.url,
            id: file.id,
          });
          this.imageUrlList.push(window.SITE_CONFIG.fileupload + file.filePath); // 图片显示列表
        } else if (
          matchFileType(file.filename) !== 1 ||
          matchFileType(file.filename) !== 10
        ) {
          this.fileList.push({
            url: urls,
            fileName: file.title || file.filename || file.fileName,
            type,
            filePath: file.filePath || file.url,
            id: file.id,
          });
        }
      } else {
        if (matchFileType(file.name) === 2) {
          // 2 是图片
          this.imageList.push({
            url: URL.createObjectURL(file),
            fileName: file.name,
            type,
          });
          this.imageUrlList.push(URL.createObjectURL(file)); // 图片显示列表
        } else if (
          matchFileType(file.name) !== 1 ||
          matchFileType(file.name) !== 10
        ) {
          this.fileList.push({
            url: `${window.SITE_CONFIG.fileupload}/${file.name}`,
            fileName: file.name,
            type,
          });
        }
      }
    },
    /**
     * @param {Object} file 当前上传的文件
     * @author hexinting
     * @date 2020-11-23
     * @lastEditor 2020-12-13
     * @description 上传文件之前的钩子
     */
    onBeforeUpload(file) {
      const fileSize = 20971520; // 上传单个文件最大：20m 20*1024*1024
      const type = 'loading'; // loading：上传中 用来判断图标
      if (this.uploadFileData.length > 0) {
        // 过滤已上传文件中是否有同名文件
        const filterFile = this.uploadFileData.filter(
          (item) => item.fileName === file.name,
        );
        if (filterFile.length > 0) {
          this.$message.error('文件已经存在，请重新上传');
          return false;
        }
      }
      if (file.size >= fileSize) {
        this.$message.error('文件大小超过20M，请重新上传');
        return false;
      }
      // 上传接口会判断名字长度
      if (file.name.length >= 50) {
        this.$message.error('文件名字长度不能大于50');
        return false;
      }
      this.judgeFileType(file, type); // 判断类型
      return true;
    },

    /**
     * @param {Object} item 当前选中的文件
     * @date 2020-12-02
     * @author hexinting
     * @lastDate 2020-11-30
     * @description 删除文件
     */
    deleteFile(item) {
      this.$confirm(`您是否要删除文件"${item.fileName || item.title}"?`, '提示', {
        customClass: 'message-logout',
        confirmButtonClass: 'confirm-button-style',
        cancelButtonClass: 'cancel-button-style',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
      })
        .then(() => {
          this.deleteServerFile(item);
          // 查找出这个文件并删除
          console.log(this.fileList);
          console.log(item);
          const newFile = this.fileList.filter(
            (el) => el.fileName !== item.fileName || item.filename,
          );
          const newUploadFile = this.uploadFile.filter(
            (el) => el.name !== item.fileName || item.filename,
          );
          const newUploadFileData = this.uploadFileData.filter(
            (el) => el.fileName !== item.fileName || item.filename,
          );
          this.fileList = newFile;
          this.uploadFile = newUploadFile;
          this.uploadFileData = newUploadFileData;
          console.log(this.fileList, this.uploadFile, this.uploadFileData);
          this.$emit('remove', this.uploadFileData);
        })
        .catch(() => {});
    },

    /**
     * @param {} response
     * @param {} file
     * @author hexinting
     * @date 2020-12-02
     * @lastEditor 2020-12-13
     * @description 文件上传成功时的钩子
     */
    onsuccess(res, file) {
      if (res.errorcode === 0) {
        this.$message.success('上传成功');
        this.uploadFileData.push(res.data); //保存时请求参数
        console.log(res.data);
        this.uploadFile.push({
          name: res.data.fileName,
          path: res.data.filePath,
        });
        this.imageList.forEach((item) => {
          if (item.fileName === res.data.fileName) {
            item.type = 'success';
            item.filePath = res.data.filePath;
          }
        });
        this.fileList.forEach((item) => {
          if (item.fileName === res.data.fileName) {
            item.type = 'success';
            item.filePath = res.data.filePath;
          }
        });
        this.$emit('success', this.uploadFileData);
      } else {
        this.$message.error('上传失败');
        // this.$message.error(res.msg);
        if (matchFileType(file.name) === 2) {
          // 2 是图片
          this.imageList.splice(this.imageList.length - 1, 1);
          this.imageUrlList.splice(this.imageUrlList.length - 1, 1);
        } else if (
          matchFileType(file.name) !== 1 ||
          matchFileType(file.name) !== 10
        ) {
          this.fileList.splice(this.fileList.length - 1, 1);
        }
      }
    },
    /**
     * @author hexinting
     * @date 2020-11-30
     * @lastDate 2020-11-30
     * @description 删除文件服务器对应文件
     */
    deleteServerFile(item) {
      axios
        .get(
          `${
            this.fileUrl
          }/eos/event/sum/deleteFile?fileName=${encodeURIComponent(
            item.fileName,
          )}&filePath=${encodeURIComponent(item.filePath)}`,
        )
        .then((res) => {
          if (res.data.errorcode !== 0) {
            this.$message({
              message: res.data.msg,
              type: 'error',
            });
          } else {
            this.$message({
              message: '删除成功',
              type: 'success',
            });
          }
        });
    },
  },
};
</script>
<style scoped>
@import url('./assets/css/uploadFile');
</style>
