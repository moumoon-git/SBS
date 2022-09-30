<template>
    <div class="sv-upload-img">
        <div class="sv-upload-img__container">
            <div
                class="sv-upload-img__item"
                v-for="file in myFileList"
                :key="`img_${file.url}`"
            >
                <viewer>
                    <img
                        :src="`${cloudUrl}${file.url}`"
                        :alt="file.name"
                        :key="file.url"
                    >
                </viewer>
                <div
                    v-if="!isView"
                    class="sv-upload-img__item__delete"
                    @click="deleteFile(file.url)"
                ></div>
            </div>
            <div
                v-if="!isView"
                class="sv-upload-img__button"
                @click="uploading ? null : $refs.upload.click()"
            >
                {{uploading ? '上传中...' : '上传照片'}}
            </div>
            <input
                type="file"
                ref="upload"
                style="display:none"
                multiple
                accept="image/*"
                @change="getFile($event)"
            >
        </div>
        <!-- 上传失败的提示框 -->
        <sv-dialog-hint ref="hint_fail" type="fail" text="抱歉，上传失败！"/>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'sv-upload-img',
    model: {
        prop: 'fileList',
        event: 'update'
    },
    props: {
        // 上传接口
        api: {
            type: String,
            default: '/upload/emergencyHandleProcessFile'
        },
        // 已存在的文件列表，每个元素包含属性name和url
        fileList: {
            type: Array,
            default: _ => []
        },
        // 是否压缩
        compress: {
            type: Boolean,
            default: true
        },
    isView: {
      type: Boolean,
      default: false,
    },
    },
    data() {
        return {
            // 图片资源所在的服务器地址
            cloudUrl: window.SITE_CONFIG.cloudUrl,
            myFileList: [],
            // 是否正在上传
            uploading: false,
        }
    },
    methods: {
        /**
         * @method
         * @desc 文件上传，返回文件保存在服务器中的地址
         * @param {object} event 上传文件事件
         */
        getFile(event) {
            this.uploading = true
            // 上传接口
            const url = this.api
            // 上传的文件列表
            const fileList = event.target.files
            // 所有文件的axios请求配置
            let request = []
            // 图片压缩
            if (this.compress) {
                const fileLength = fileList.length
                for (let file of fileList) {
                    let formData = new FormData()
                    // 1. 将上传文件转成img对象
                    new Promise((resolve, reject) => {
                        const img = new Image()
                        const reader = new FileReader()
                        reader.onload = function(e) {
                            img.src = e.target.result
                        }
                        reader.readAsDataURL(file)
                        img.onload = function() {
                            resolve(img)
                        }
                    })
                    // 2. 将img对象画在canvas上，在canvas上进行压缩，然后转成blob对象，最后转回file对象
                    .then(img => {
                        return new Promise((resolve, reject) => {
                            const canvas = document.createElement('canvas')
                            const context = canvas.getContext('2d')
                            const { width: originWidth, height: originHeight } = img
                            // 最大尺寸限制
                            const maxWidth = 2000
                            const maxHeight = 2000
                            // 目标尺寸
                            let targetWidth = originWidth
                            let targetHeight = originHeight
                            if (originWidth > maxWidth || originHeight > maxHeight) {
                                if (originWidth / originHeight > 1) {
                                    // 宽图片
                                    targetWidth = maxWidth
                                    targetHeight = Math.round(maxWidth * (originHeight / originWidth))
                                } else {
                                    // 高图片
                                    targetHeight = maxHeight
                                    targetWidth = Math.round(maxHeight * (originWidth / originHeight))
                                }
                            }
                            canvas.width = targetWidth
                            canvas.height = targetHeight
                            context.clearRect(0, 0, targetWidth, targetHeight)
                            // 图片绘制
                            context.drawImage(img, 0, 0, targetWidth, targetHeight)
                            canvas.toBlob(function(blob) {
                                // blob转换file
                                resolve(new File([blob], file.name))
                            }, 'image/png')
                        })
                    })
                    // 3. 上传图片
                    .then(compressFile => {
                        let formData = new FormData()
                        formData.append("file", compressFile)
                        request.push(axios({
                            method: 'post',
                            url,
                            baseURL: url.startsWith('http') ? undefined : window.SITE_CONFIG.baseUrl,
                            headers: {
                                'content-type': 'multipart/form-data;charset=UTF-8;',
                                token: this.$cookie.get("token")
                            },
                            data: formData
                        }))
                        // 所有图片压缩处理完，上传服务器
                        if (request.length == fileLength) {
                            axios.all(request).then(axios.spread((...responseList) => {
                                for(let response of responseList) {
                                    if(response.data.code == 0) {
                                        this.myFileList.push({
                                            name: response.data.data.name,
                                            url: response.data.data.url
                                        })
                                    } else if (response.data.errorcode === 0) {
                                        this.myFileList.push({
                                            name: response.data.data.url.split('/').pop(),
                                            url: response.data.data.url
                                        })
                                    } else {
                                        console.log('上传图片失败！错误信息：【\n', response, '\n】')
                                        this.$refs.hint_fail.supplementText = `错误代码：${response.data.code}`
                                        this.$refs.hint_fail.visible = true
                                    }
                                }
                                this.$emit('update', this.myFileList)
                                // 清空input值，防止上传重复文件时不触发change事件
                                event.srcElement.value = ''
                                this.uploading = false
                            }))
                        }
                    })
                }
            } else {
                for (let file of fileList) {
                    let formData = new FormData()
                    formData.append("file", file)
                    request.push(axios({
                        method: 'post',
                        url,
                        baseURL: url.startsWith('http') ? undefined : window.SITE_CONFIG.baseUrl,
                        headers: {
                            'content-type': 'multipart/form-data;charset=UTF-8;',
                            token: this.$cookie.get("token")
                        },
                        data: formData
                    }))
                }
                // 并行axios请求
                axios.all(request).then(axios.spread((...responseList) => {
                    for(let response of responseList) {
                        if(response.data.code == 0) {
                            this.myFileList.push({
                                name: response.data.data.name,
                                url: response.data.data.url
                            })
                        } else if (response.data.errorcode === 0) {
                            this.myFileList.push({
                                name: response.data.data.url.split('/').pop(),
                                url: response.data.data.url
                            })
                        } else {
                            console.log('上传图片失败！错误信息：【\n', response, '\n】')
                            this.$refs.hint_fail.supplementText = `错误代码：${response.data.code}`
                            this.$refs.hint_fail.visible = true
                        }
                    }
                    this.$emit('update', this.myFileList)
                    // 清空input值，防止上传重复文件时不触发change事件
                    event.srcElement.value = ''
                    this.uploading = false
                }))
                .catch(error => {
                    console.log('上传图片失败！错误信息：【\n', error, '\n】')
                    this.uploading = false
                    this.$refs.hint_fail.supplementText = error
                    this.$refs.hint_fail.visible = true
                })
            }
        },
        /**
         * @method
         * @desc 删除文件
         * @param {String} url 文件的地址（唯一值）
         */
        deleteFile(url) {
            const index = this.myFileList.findIndex(element => element.url == url)
            this.myFileList.splice(index, 1)
            this.$emit('update', this.myFileList)
        }
    },
    mounted() {
        if (this.fileList) {
            this.myFileList = [...this.fileList]
        }
    },
    watch: {
        fileList: {
            deep: true,
            immediate: true,
            handler(newVal) {
                this.myFileList = [...newVal]
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.sv-upload-img {
    font-size: 0;
    * {user-select: none}
    &__container {
        margin-bottom: -10px;
        padding-top: 5px;
    }
    &__item,
    &__button {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 88px;
        height: 65px;
        line-height: 1.5;
        border-radius: 4px;
        font-size: 12px;
        color: #0091FF;
        margin: 0 10px 10px 0;
        position: relative;
        vertical-align: bottom;
    }
    &__item {
        border: 1px solid #9FC8FE;
        cursor: zoom-in;
        img {
            max-height: 63px;
            max-width: 100%;
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
    &__button {
        border: 1px dashed #9FC8FE;
        cursor: pointer;
        &:hover {
            border: 1px solid #0091FF;
        }
        // 照相机图标
        &::before {
            content: '';
            display: block;
            width: 36px;
            height: 36px;
            margin: 5px auto 0;
            background: no-repeat center/100% 100% url('../img/upload_img.svg');
        }
    }
}
</style>