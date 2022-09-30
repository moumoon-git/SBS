<template lang="">
  <div :class="$style.NotifyDialog">
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="1120px"
      destroy-on-close
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        :disabled="mode === 'readonly' || mode === 'read'"
      >
        <el-form-item
          label="标题："
          prop="title"
        >
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item
          label="类型："
          prop="noticeType"
        >
          <el-radio-group v-model="form.noticeType">
            <el-radio :label="1">
              通知
            </el-radio>
            <el-radio :label="2">
              公告
            </el-radio>
            <el-radio :label="3">
              预警
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="分组："
          prop="groupId"
        >
          <el-select
            ref="selectReport"
            v-model="groupName"
            placeholder="请选择分组"
          >
            <el-option
              style="height:100%;max-height: 245px;overflow: auto;"
              value=""
            >
              <el-tree
                ref="InnerTree"
                :data="groupList"
                :props="defaultProps"
                default-expand-all
                :expand-on-click-node="false"
                highlight-current
                @node-click="handleNodeClick"
              />
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="正文："
          prop="content"
        >
          <editor-bar
            ref="editorBar"
            v-model="form.content"
            :height-editor="heightEditor"
            :none-display="{ display: 'flex'}"
            :is-clear="false"
          />
        </el-form-item>
        <el-form-item label="图片：">
          <el-upload
            ref="picUpload"
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :limit="4"
            accept=".jpg,.jpeg,.png"
            :disabled="mode === 'readonly' || mode === 'read'"
          >
            <template slot="default">
              <div :class="$style['text-box']">
                <i
                  class="el-icon-plus"
                />
                <span>（仅限4张）</span>
              </div>
            </template>

            <div
              slot="file"
              slot-scope="{file}"
            >
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in" />
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete" />
                </span>
              </span>
            </div>
          </el-upload>
          <el-dialog
            :visible.sync="imgDialogVisible"
            append-to-body
          >
            <img
              width="100%"
              :src="dialogImageUrl"
              alt=""
            >
          </el-dialog>
        </el-form-item>
        <el-form-item label="附件：">
          <el-upload
            class="upload-demo"
            action="#"
            :file-list="fileList"
            :auto-upload="false"
            :on-change="fileUploadChange"
            :on-remove="fileRemove"
            :on-preview="filePreview"
          >
            <el-button
              slot="trigger"
              size="small"
            >
              点击上传
            </el-button>
            <span
              slot="tip"
              class="el-upload__tip"
            >
              上传文件大小30MB内
            </span>
          </el-upload>
        </el-form-item>

        <el-form-item label="联系人：">
          <el-input
            v-model="contactorInput"
            :readonly="true"
            @focus="showcontactDialog"
          >
            <template slot="append">
              <el-button @click="showcontactDialog">
                选择
              </el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="平台：">
          <el-input
            v-model="platformInput"
            :readonly="true"
            @focus="showPlatformDialog"
          >
            <template slot="append">
              <el-button @click="showPlatformDialog">
                选择
              </el-button>
            </template>
          </el-input>
          <el-checkbox v-model="isSendMsg">
            并同时短信通知平台负责人
          </el-checkbox>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          v-if="operationConf('edit')"
          v-loading.fullscreen.lock="loading"
          type="primary"
          @click="edit"
        >
          保 存
        </el-button>
        <el-button
          v-if="operationConf('save')"
          v-loading.fullscreen.lock="loading"
          type="primary"
          @click="save"
        >
          保 存
        </el-button>
        <el-button
          v-if="operationConf('sendNotify')"
          v-loading.fullscreen.lock="loading"
          type="primary"
          @click="sendNotify"
        >
          发送
        </el-button>
        <el-button
          v-if="operationConf('recall')"
          @click="recall"
        >
          撤回
        </el-button>
      </div>
    </el-dialog>
    <platform-dialog
      ref="platformDialog"
      @platformSelect="platformSelect"
    />
    <contact-dialog
      ref="contactDialog"
      @contactSelect="contactSelect"
    />
  </div>
</template>
<script>
import EditorBar from '@/view/eventManagement/informationDisposal/editorChint.vue';
import PlatformDialog from './PlatformDialog.vue';
import ContactDialog from './ContactDialog.vue';

export default {
  name: 'NotifyDialog',
  components: { PlatformDialog, ContactDialog, EditorBar },
  props: {
    platformId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      dialogVisible: false,
      /*
      * add 发布
      * readOnly 未发布下的查看
      * read 发布下的查看
      * edit 修改
      */
      mode: 'add',
      form: {
        title: '',
        noticeType: 1,
        groupId: '',
        content: '',
      },
      pictureIds: [],
      fileIds: [],
      fileList: [],
      platformInput: '',
      platformIds: [],
      contactors: [], // 联系人数组
      contactorInput: '', // 联系人数组input
      contactorIds: [], // 联系人数组id
      isSendMsg: false,
      groupName: '',
      rules: {
        title: [
          { required: true, message: '请输入标题名称', trigger: 'blur' },
        ],
        noticeType: [
          { required: true, message: '请选择类型', trigger: 'blur' },
        ],
        groupId: [
          { required: true, message: '请选择分组', trigger: 'blur' },
        ],
        content: [
          { required: true, message: '请输入正文', trigger: 'blur' },
        ],

      },
      dialogImageUrl: '',
      imgDialogVisible: false,
      disabled: false,
      heightEditor: {
        height: '490px',
      },
      groupList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      loading: false,
      noticeId: '',
    };
  },
  computed: {
    title() {
      return this.mode === 'add' ? '发布通知公告' : '通知公告详情';
    },
  },
  watch: {
    dialogVisible(newVal) {
      console.log('%c [ newVal ]', 'font-size:13px; background:pink; color:#bf2c9f;', newVal);
      if (!newVal) {
        this.initData();
      }
    },
  },
  methods: {
    // 获取分组
    getGroupList() {
      this.$http({
        url: this.$http.adornUrl(
          '/appnotice/appNoticeGroup/list',
        ),
        method: 'get',
      }).then((res) => {
        this.groupList = res.data.data;
      });
    },

    // eslint-disable-next-line vue/return-in-computed-property
    operationConf(type) {
      switch (this.mode) {
        case 'add':
          return {
            edit: false,
            save: true,
            sendNotify: true,
            recall: false,
          }[type];
        case 'readOnly':
          return {
            edit: false,
            save: false,
            sendNotify: false,
            recall: false,
          }[type];
        case 'read':
          return {
            edit: false,
            save: false,
            sendNotify: false,
            recall: true,
          }[type];
        case 'edit':
          return {
            edit: true,
            save: false,
            sendNotify: true,
            recall: false,
          }[type];
        default:
          break;
      }
    },
    // 数据初始化
    initData() {
      Object.assign(this.$data, this.$options.data());
    },
    open(mode) {
      this.mode = mode;
      this.getGroupList();
      this.dialogVisible = true;
    },
    // 撤回公告
    recall() {
      this.$http({
        url: this.$http.adornUrl(`/appManagement/withdrawNotice?noticeId=${this.noticeId}`),
        method: 'post',
      }).then((res) => {
        if (res.data.code === 0 || res.data.errorcode === 0) {
          this.$message.success('已撤回');
          this.$emit('update');
          this.dialogVisible = false;
        } else {
          this.$message.error('撤回失败');
        }
      });
    },
    // 查询公告
    searchDetailById(noticeId, mode) {
      this.mode = mode;
      this.noticeId = noticeId;
      this.getGroupList();
      this.$http({
        url: this.$http.adornUrl(`/appManagement/notice/${noticeId}`),
        method: 'get',
      }).then((res) => {
        if (res.data.code === 0 || res.data.errorcode === 0) {
          const { data } = res.data;
          this.form.title = data.title;
          this.form.noticeType = data.noticeType;
          this.form.groupId = data.groupId;
          this.form.content = data.content.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('imgsinvie', 'img');
          this.isSendMsg = !!data.isSmg;
          this.groupName = data.groupName;
          this.contactors = data.contactors;
          this.contactSelect(data.contactors);
          this.platformSelect(data.platforms);

          this.$nextTick(() => {
            console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.$refs.picUpload);
            this.$refs.editorBar.setHtml();
            if (mode === 'readonly' || mode === 'read') {
              this.$refs.editorBar.disabled();
            }
            data.pictures.forEach((item) => {
              this.$refs.picUpload.uploadFiles.push({
                uid: item.iid,
                url: window.SITE_CONFIG.cloudUrl + item.vcUrl,
                status: 'ready',
                name: item.vcFilename,
              });
            });
            data.files.forEach((item) => {
              this.fileList.push({
                uid: item.iid,
                url: window.SITE_CONFIG.cloudUrl + item.vcUrl,
                status: 'ready',
                name: item.vcFilename,
              });
            });
          });

          this.dialogVisible = true;
        }
      });
    },

    sendNotify() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (!this.platformInput && !this.contactorInput) {
            this.$message.error('发送失败，请选择发送对象');
            return false;
          }
          const noticeId = this.noticeId ? await this.saveHttpProcess(false, false)
            : await this.saveHttpProcess(false, true);
          console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', noticeId);
          this.$http({
            url: this.$http.adornUrl('/appManagement/publishNotice'),
            method: 'post',
            data: {
              noticeId,
            },
          }).then((res) => {
            console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', res);
            if (res.data.code === 0 || res.data.errorcode === 0) {
              this.$message.success('发送成功，2小时内支持撤回');
              this.$emit('update');
              this.dialogVisible = false;
            } else {
              this.$message.error('发送失败');
            }
            this.loading = false;
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    fileUploadChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    fileRemove(file, fileList) {
      console.log(file, fileList);
      const i = fileList.findIndex((item) => item.uid === file.uid);
      this.fileList.splice(i, 1);
    },
    filePreview(file) {
      const request = {
        method: 'get',
        baseURL: window.SITE_CONFIG.cloudUrl,
        url: '/fileupload/appAttachment/download',
        params: {
          appAttachmentId: file.uid,
          isForceDownload: '1',
        },
        headers: {
          token: this.$cookie.get('token'),
        },
        responseType: 'arraybuffer',
      };
      this.$http(request).then((response) => {
        if (response.data) {
          const a = document.createElement('a');
          a.target = '_blank';
          a.download = file.name;
          a.href = window.URL.createObjectURL(new Blob([response.data]));
          a.click();
        }
      });
    },

    // 点击tree节点选中
    handleNodeClick(node) {
      console.log(node);
      this.$refs.selectReport.blur();
      this.form.groupId = node.id;
      this.groupName = node.name;
    },

    // 修改
    async edit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await this.saveHttpProcess(true, false);
          this.loading = false;
          this.dialogVisible = false;
          this.$emit('update');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    // 保存
    async save() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await this.saveHttpProcess(true, true);
          this.loading = false;
          this.dialogVisible = false;
          this.$emit('update');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    async saveHttpProcess(isOnlySave, isSave) {
      this.loading = true;
      console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.form);

      await this.uploadFileOrImg(this.$refs.picUpload.uploadFiles, (imgList, editImgList) => {
        editImgList.forEach((item) => {
          this.pictureIds.push(item.uid);
        });
        imgList.forEach((item) => {
          this.pictureIds.push(item.id);
        });
      });
      await this.uploadFileOrImg(this.fileList, (fileList, editFileList) => {
        editFileList.forEach((item) => {
          this.fileIds.push(item.uid);
        });
        fileList.forEach((item) => {
          this.fileIds.push(item.id);
        });
      });
      const noticeId = await this.saveNotifyHttp(isOnlySave, isSave);
      return noticeId;
    },

    // 批量上传接口
    async uploadFileOrImg(list, cb) {
      if (!list.length) return;
      console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', list);
      const requestData = new FormData();
      const isEmptyFiles = list.every((item) => !item.raw);
      if (isEmptyFiles) {
        cb([], list);
        return;
      }

      list.forEach((item) => {
        if (item.raw) {
          requestData.append('files', item.raw);
        }
      });
      requestData.append('type', 11);

      const res = await this.$http({
        url: `${window.SITE_CONFIG.fileupload}/appAttachment/fileUploadAttachments`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        method: 'post',
        data: requestData,
      });
      // 参数：需要上传图片的列表，编辑图片不需上传的列表
      cb(res.data.data, list.filter((item) => !item.raw));
    },

    // 保存通知公告接口
    async saveNotifyHttp(isOnlySave, isSave) {
      const url = isSave ? '/appManagement/notice' : '/appManagement/notice/update';
      console.log('%c [ pictureIds ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.pictureIds, this.fileIds);
      let formTemp = this.form.content;
      formTemp = formTemp.replaceAll('<','&lt;')
      formTemp = formTemp.replaceAll('>','&gt;')

      const requestData = {
        noticeDto: {
          platformId: this.platformId,
          isSmg: this.isSendMsg ? 1 : 0,
          ...this.form,
        },
        pictureIds: this.pictureIds,
        fileIds: this.fileIds,
        platformIds: this.platformIds,
        contactorIds: this.contactorIds,
      };
      requestData.noticeDto.content = formTemp;
      console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', requestData, this.form);

      if (!isSave) {
        requestData.noticeDto.id = this.noticeId;
      }
      const res = await this.$http({
        url: this.$http.adornUrl(
          url,
        ),
        method: 'post',
        data: this.$http.adornData(requestData),
      });
      console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', res);

      if (res.data.code === 0 || res.data.errorcode === 0) {
        isOnlySave && this.$message.success('保存成功');
      } else {
        isOnlySave && this.$message.error('保存失败');
      }

      return res.data.data;
    },

    // 打开联系人弹窗
    showcontactDialog() {
      // contactors: [{id: number, name: string}]
      this.$refs.contactDialog.getDataList(this.contactors);
    },
    // 联系人回调
    contactSelect(concatList) {
      this.contactorIds.length = 0;
      const joinArr = [];
      concatList.forEach((item) => {
        if(item) {
          this.contactorIds.push(item.id);
          joinArr.push(item.name);
        }

      });
      this.contactorInput = joinArr.join(', ');
      console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.contactorIds, joinArr, concatList);
    },
    // 点击确定后的平台数组
    platformSelect(platFormList) {
      this.platformIds.length = 0;
      const joinArr = [];
      if(platFormList)
      platFormList.forEach((item) => {
        if(item) {
          this.platformIds.push(item.id);
          joinArr.push(item.platformName);
        }

      });
      this.platformInput = joinArr.join(', ');
      console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', platFormList);
    },
    // 打开平台弹窗
    showPlatformDialog() {
      this.$refs.platformDialog.getTree(this.platformIds);
    },

    handleRemove(file) {
      const i = this.$refs.picUpload.uploadFiles.findIndex((item) => item.uid === file.uid);
      this.$refs.picUpload.uploadFiles.splice(i, 1);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.imgDialogVisible = true;
    },
  },
};
</script>
<style lang="scss" module>
.NotifyDialog {
  .text-box{
    height: 148px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 28px;
  }
  :global(.el-dialog__footer){
    text-align: center;
  }
}

</style>
