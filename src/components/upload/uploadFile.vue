<!-- 上传文件组件 author:hexinting date:2020-11-24 -->
<template>
  <div class="upload-file-container">
    <div class="upload_content">
      <span v-if="isShowTitle" style="margin-right:12px;margin-left:20px">{{ uploadLabel + ':' }}</span>
      <!-- 保存文件的服务器：fileServer：文件服务器；eosServer：eos后端-->
      <template v-if="saveFileServer === 'fileServer'">
        <el-upload
            class="upload_wrap"
            ref="upload"
            :file-list="uploadFile"
            with-credentials
            :accept="fileType"
            action=""
            :headers="{Authorization: $window.localStorage.getItem('token') ? $window.localStorage.getItem('token') : ''}"
            :on-success="onsuccess"
            :on-remove="onremove"
            :before-upload="onBeforeUpload"
            :http-request="httpRequest"
        >
            <div class="upload_button">
            <img src="../../../static/img/Communihistory/upload.png" alt="上传附件" class="upload_icon" />
            <span>上传文件</span>
            </div>
        </el-upload>
      </template>
      <!-- 保存文件的服务器：fileServer：文件服务器；eosServer：eos后端-->
      <template v-else-if="saveFileServer === 'eosServer'">
        <el-upload
            class="upload_wrap"
            ref="upload"
            :file-list="uploadFile"
            with-credentials
            :accept="fileType"
            :action="action"
            :headers="{Authorization: $window.localStorage.getItem('token') ? $window.localStorage.getItem('token') : ''}"
            :on-success="onsuccess"
            :on-remove="onremove"
            :before-upload="onBeforeUpload"
        >
            <div class="upload_button">
            <img src="../../../static/img/Communihistory/upload.png" alt="上传附件" class="upload_icon" />
            <span>上传文件</span>
            </div>
        </el-upload>
      </template>
    </div>
    <!-- 图片列表 -->
    <div v-if="imageList.length > 0" class="image_list">
      <div v-for="(img, index) in imageList" :key="img.index" class="img_wrap">
        <el-image
          v-if="isShowPreviewer"
          class="img_item"
          :src="img.url"
          :preview-src-list="imageUrlList"
        ></el-image>
        <img v-else :src="img.url" class="img_item" @click="clickFile(img)" />
        <img
          src="../../../static/img/icon/close.png"
          class="img_delete"
          @click.stop.prevent="deleteImg(img, index)"
        />
      </div>
    </div>
    <!-- 文件列表 -->
    <div class="file_list">
      <div v-for="(item, index) in fileList" :key="item.index" class="file_item">
        <i class="el-icon-paperclip"></i>
        <span class="file_name" @click="clickFile(item)">{{ item.fileName }}</span>
        <img
          v-if="item.type === 'success'"
          src="../../../static/img/icon/tick.png"
          alt
          class="upload_success_icon"
        />
        <i class="el-icon-close" @click.stop.prevent="deleteFile(item, index)"></i>
        <i v-if="item.type === 'loading'" class="el-icon-loading"></i>
      </div>
    </div>
  </div>
</template>
<script>
import { matchFileType } from '@/assets/js/common.js';
import { mapGetters } from 'vuex';
import axios from 'axios';
export default {
    name: 'uploadFile',
    props: {
        fileType: {
            // 可上传的文件类型
            default:
                '.pdf, .jpg, .jpeg, .png, .ppt, .pptx, .doc, .docx, .txt, .xlsx, .xls',
            type: String,
        },
        attachments: {
            // attachments: 附件列表
            default() {
                return [];
            },
            type: Array,
        },
        uploadLabel: {
            // 上传文本
            default: '其他附件',
            type: String,
        },
        isShowPreviewer: {
            // 是否显示图片预览器
            default: true,
            type: Boolean,
        },
        isShowTitle: {
            // 是否显示标题
            default: true,
            type: Boolean,
        },
        saveFileServer: {
            // 保存文件的服务器：fileServer：文件服务器；eosServer：eos后端
            default: 'fileServer',
            type: String,
        },
    },
    data() {
        return {
            fileList: [], // 附件列表
            imageList: [], // 图片列表
            imageUrlList: [], // 存放图片的显示路径
            action: window.g.ApiUrl + '/upload/uploadEventDealAttachment',
            uploadFile: [], // 上传的附件数据
            uploadFileData: [], // 上传的附件数据
            fileUrl: window.g.FileUrl, // 文件服务器地址
        };
    },
    computed: {
        ...mapGetters({
            commonInformationReport: 'getCommonInformationReport',
        }),
    },
    mounted() {
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
            params.append('filename', file.file.name) // 文件名
            params.append('functionPoint', 'EVENTATTACH') // 后端定义要上传
            params.append('time', new Date().formatDate("yyyyMMddhhmmss")) // 时间戳
            params.append('file', file.file) // 文件
            axios({
                url: `${window.SITE_CONFIG.fileupload}/eos/event/sum/report/upload`,
                method: 'post',
                data: params,
                header: {
                    token: this.$cookie.get('token'),
                }
            }).then(res => {
                console.log(res)
                if (res.data.errorcode === 0) {
                    this.onsuccess(res.data, file.file); // 上传成功
                } else if (res.data.errorcode === 10002) {
                    this.$router.push({
                        path: '/login'
                    }) // 登录失效，调转到登录页
                } else {
                    this.$message({
                        type: 'warn',
                        message: res.data.msg
                    })
                }
            })
        },
        /**
         * @author hexinting
         * @date 2020-12-23
         * @description 点击文件名字
         */
        clickFile(item) {
            this.$emit('clickFile', item);
        },
        /**
         * @date 2020-12-17
         * @author hexinting
         * @desciption 获取父组件传过来的值
         */
        getNewFileData(val) {
            this.imageList = [];
            this.imageUrlList = [];
            this.fileList = [];
            this.uploadFileData = val;
            if (val.length > 0) {
                val.forEach(item => {
                    this.uploadFileData.push(item);
                    this.judgeFileType(item, 'success'); // 判断文件类型
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
                if (matchFileType(file.fileName) === 2) {
                    // 2 是图片
                    this.imageList.push({
                        url: window.g.FileUrl + file.filePath,
                        fileName: file.fileName,
                        type: type,
                        filePath: file.filePath,
                        id: file.id,
                    });
                    this.imageUrlList.push(
                        window.g.FileUrl + file.filePath
                    ); // 图片显示列表
                } else if (
                    matchFileType(file.fileName) !== 1 ||
                    matchFileType(file.fileName) !== 10
                ) {
                    this.fileList.push({
                        url: window.g.FileUrl + file.filePath,
                        fileName: file.fileName,
                        type: type,
                        filePath: file.filePath,
                        id: file.id,
                    });
                }
            } else {
                if (matchFileType(file.name) === 2) {
                    // 2 是图片
                    this.imageList.push({
                        url: URL.createObjectURL(file),
                        fileName: file.name,
                        type: type,
                    });
                    this.imageUrlList.push(URL.createObjectURL(file)); // 图片显示列表
                } else if (
                    matchFileType(file.name) !== 1 ||
                    matchFileType(file.name) !== 10
                ) {
                    this.fileList.push({
                        url: window.g.FileUrl + '/' + file.name,
                        fileName: file.name,
                        type: type,
                    });
                }
            }
        },

        /**
         * @param {Object} file 当前上传的文件
         * @param {Array} fileList 当前文件列表
         * @author hexinting
         * @date 2020-11-23
         * @lastEditor 2020-12-13
         * @description 上传文件之前的钩子
         */
        onBeforeUpload(file, fileList) {
            let fileSize = 20971520; // 上传单个文件最大：20m 20*1024*1024
            let type = 'loading'; // loading：上传中 用来判断图标
            console.log('1-上传文件之前: ', file, fileList);
            console.log(this.uploadFileData);
            if (this.uploadFileData.length > 0) {
                let filterFile = this.uploadFileData.filter(
                    item => item.fileName === file.name
                ); // 过滤已上传文件中是否有同名文件
                console.log(filterFile);
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
            console.log('图片列表：', this.imageList);
            console.log('文件列表：', this.fileList);
        },

        /**
         * @param {Object} item 当前选中的文件
         * @param {Number} index 下标
         * @date 2020-11-27
         * @author hexinting
         * @lastEditor 2020-12-03
         * @description 删除图片
         */
        deleteImg(item, index) {
            console.log('2-删除图片');
            console.log(item);
            this.deleteServerFile(item);
            const newImageList = this.imageList.filter(
                el => el.fileName !== item.fileName
            ); // 查找出这个文件并删除
            const newUploadFile = this.uploadFile.filter(
                el => el.name !== item.fileName
            ); // 查找出这个文件并删除
            const newUploadFileData = this.uploadFileData.filter(
                el => el.fileName !== item.fileName
            ); // 查找出这个文件并删除
            const newImageUrlList = this.imageUrlList.filter(
                el => el !== item.url
            ); // 查找出这个文件并删除
            console.log('图片列表：', [...this.imageList]);
            console.log('文件列表：', [...this.uploadFile]);
            console.log('上传列表：', [...this.uploadFileData]);
            this.imageList = newImageList;
            this.uploadFile = newUploadFile;
            this.uploadFileData = newUploadFileData;
            this.imageUrlList = newImageUrlList;
            console.log(newImageList);
            console.log(newUploadFile);
            console.log(newUploadFileData);
            this.$emit('remove', this.uploadFileData);
        },

        /**
         * @param {Object} item 当前选中的文件
         * @param {Number} index 下标
         * @date 2020-12-02
         * @author hexinting
         * @lastDate 2020-11-30
         * @description 删除文件
         */
        deleteFile(item, index) {
            console.log('3-删除文件');
            console.log(item);
            this.deleteServerFile(item);
            const newFile = this.fileList.filter(
                el => el.fileName !== item.fileName
            ); // 查找出这个文件并删除
            const newUploadFile = this.uploadFile.filter(
                el => el.name !== item.fileName
            ); // 查找出这个文件并删除
            const newUploadFileData = this.uploadFileData.filter(
                el => el.fileName !== item.fileName
            ); // 查找出这个文件并删除
            console.log('文件列表：', [...this.fileList]);
            console.log('文件列表：', [...this.uploadFile]);
            console.log('上传列表：', [...this.uploadFileData]);
            this.fileList = newFile;
            this.uploadFile = newUploadFile;
            this.uploadFileData = newUploadFileData;
            this.$emit('remove', this.uploadFileData);
        },

        //移除附件的数据
        onremove(file, fileList) {
            console.log('4-移除文件');
            this.uploadFile = fileList;
            this.uploadFileData = this.uploadFileData.filter(
                e => file.path !== e.filePath
            );
            console.log(this.uploadFile, this.uploadFileData);
            this.$emit('remove', this.uploadFileData);
        },

        /**
         * @param {} response
         * @param {} file
         * @param {} fileList
         * @author hexinting
         * @date 2020-12-02
         * @lastEditor 2020-12-13
         * @description 文件上传成功时的钩子
         */
        onsuccess(res, file, fileList) {
            console.log('3-上传成功', res, file);
            if (res.errorcode === 0) {
                this.$message.success('上传成功');
                let uploadFileData = res.data;
                this.uploadFileData.push(uploadFileData); //保存时请求参数
                this.uploadFile.push({
                    name: res.data.fileName,
                    path: res.data.filePath,
                });
                this.imageList.forEach((item, index) => {
                    if (item.fileName === res.data.fileName) {
                        item.type = 'success';
                        item.filePath = res.data.filePath;
                        item.url = window.g.FileUrl + res.data.filePath;
                    }
                });
                this.fileList.forEach(item => {
                    console.log(item, item.fileName, res.data.fileName, item.fileName===res.data.fileName)
                    if (item.fileName === res.data.fileName) {
                        item.type = 'success';
                        item.filePath = res.data.filePath;
                        item.url = window.g.FileUrl + res.data.filePath;
                        console.log(item);
                    }
                });
                this.$emit('success', this.uploadFileData);
                console.log('图片列表：', this.imageList);
                console.log('文件列表：', this.fileList);
                console.log('文件列表：', this.uploadFileData);
            } else {
                this.$message.error(res.msg);
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
                        item.fileName
                    )}&filePath=${encodeURIComponent(item.filePath)}`
                )
                .then(res => {
                    if (res.data.errorcode != 0) {
                        this.$message({
                            message: res.msg,
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
.upload-file-container .upload_content {
    display: flex;
    justify-content: flex-start;
}

.upload-file-container .upload_wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
}

.upload-file-container .upload_button {
    background: #ffffff;
    border: 1px solid #d9d9d9;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 5px;
    width: 90px;
    height: 30px;
    border-radius: 3px;
}

.upload-file-container .upload_icon {
    width: 14px;
    height: 14px;
    margin-right: 6px;
}

.upload-file-container .upload_wrap >>> .el-upload-list__item {
    display: flex !important;
}

.upload-file-container .image_list {
    display: flex;
    /* justify-content: center; */
    /* align-items: center; */
    /* justify-content: space-between; */
    flex-wrap: wrap;
    margin: 10px 0 15px 0;
}

.upload-file-container .image_list .img_wrap {
    position: relative;
}

.upload-file-container .img_item {
    width: 88px;
    height: 88px;
    margin-right: 15px;
    object-fit: cover;
    cursor: pointer;
}

.upload-file-container .img_item >>> .el-image__preview {
    object-fit: cover;
}

.upload-file-container .img_delete {
    width: 14px;
    height: 14px;
    position: absolute;
    top: -6px;
    right: 8px;
    cursor: pointer;
}

.upload-file-container .file_list {
    display: flex;
    flex-direction: column;
    padding-left: 10px;
}
.upload-file-container .file_list:hover {
    background: #f6f7fa;
    border-radius: 2px;
}
.upload-file-container .file_item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 30px;
    line-height: 30px;
    margin-bottom: 4px;
    cursor: pointer;
}
.upload-file-container .file_name:hover {
    font-weight: 400;
    color: #0091ff;
    cursor: pointer;
}
.upload-file-container .upload_success_icon {
    width: 12px;
    height: 12px;
    display: block;
}
.upload-file-container .file_name {
    font-size: 14px;
    min-width: 206px;
    text-overflow: ellipsis;
    text-align: left;
    padding-left: 4px;
    margin-right: 20px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.upload-file-container .upload_content >>> .el-upload-list {
    display: none !important;
}
.upload-file-container .file_item .el-icon-close {
    display: none;
}
.upload-file-container .file_item:hover .el-icon-close {
    display: block;
}
.upload-file-container .file_item:hover .upload_success_icon {
    display: none;
}
</style>
