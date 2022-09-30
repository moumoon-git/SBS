<template>
  <div class="lawFormDialog">
    <sv-dialog
      ref="dialog"
      :title="title"
      @cancel="onCancel"
      @confirm="onSubmit"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-position="right"
        label-width="100px"
        size="medium"
        class="lawForm"
        @submit.native.prevent
      >
        <el-form-item label="法规名称:" prop="vcName">
          <template v-if="type === 'detail'">
            {{ ruleForm.vcName }}
          </template>
          <el-input
            v-else
            v-model="ruleForm.vcName"
            :maxlength="maxlength.VcTitle"
            show-word-limit
            clearable
          />
        </el-form-item>
        <el-form-item label="分组：" prop="groupId">
          <template v-if="type === 'detail'">
            {{ ruleForm.groupName }}
          </template>
          <sv-select-group
            v-else
            v-model="ruleForm.groupId"
            api="/resoure/resourcelawgroup/list"
            :name="ruleForm.groupName"
          />
        </el-form-item>
        <el-form-item label="版本号:" prop="vcVersionNo">
          <template v-if="type === 'detail'">
            {{ ruleForm.vcVersionNo }}
          </template>
          <el-input
            v-else
            v-model="ruleForm.vcVersionNo"
            :maxlength="maxlength.VcVersionNo"
            show-word-limit
            clearable
          />
        </el-form-item>
        <el-form-item label="发布日期:">
          <template v-if="type === 'detail'">
            {{ ruleForm.dtPublishDate }}
          </template>
          <el-date-picker
            v-else
            v-model="ruleForm.dtPublishDate"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择日期"
            clearable
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="法规内容:" prop="txtContent">
          <!-- 富文本编辑器 -->
          <RichTextEditor ref="richEditor" v-model="ruleForm.txtContent" />
        </el-form-item>
        <el-form-item label="附件:">
          <el-upload
            class="upload-demo"
            action=""
            :http-request="uploadFileMethod"
            :accept="accept"
            :file-list="fileList"
            :before-upload="beforeAvatarUpload"
            :headers="{
              Authorization: $window.localStorage.getItem('token')
                ? $window.localStorage.getItem('token')
                : '',
            }"
            :before-remove="beforeRemove"
            :on-preview="handlePreview"
            style="text-align: left"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </sv-dialog>
  </div>
</template>

<script>
import RichTextEditor from '@/ebs_components/MyRichTextEditor.vue';
import axios from 'axios';
import { getRelations } from '@/assets/js/yz_common.js';

export default {
  vcName: 'LawAddOrUpdate',
  components: {
    RichTextEditor,
  },
  inject: ['reload'],
  props: ['id'],
  data() {
    const validateName = (rule, value, callback) => {
      this.getByName(value).then((res) => {
        if (res.length > 0) {
          callback(new Error('当前已有该法律法规，请勿重复'));
        } else {
          callback();
        }
      });
    };
    return {
      // 当前登录用户的token
      token: this.$cookie.get('token'),
      accept: '.xls,.xlsx,.doc,.txt,.pdf,.docx,.jpg,.jpeg,.png,.ppt,.pptx',
      root: window.SITE_CONFIG.baseUrl,
      theme: '法律法规',
      fileList: [],
      type: '',
      ruleForm: {
        id: '',
        vcName: '',
        vcVersionNo: '', // 版本号
        txtContent: '', // 案例内容
        dtPublishDate: null, // 发布日期
        groupId: '', // 分组id
        groupName: '', // 分组名字
      },
      rules: {
        // 正则
        vcName: [
          {
            required: true,
            validator: this.$regular.currencyRules,
            trigger: 'blur',
          },
          {
            required: true,
            validator: validateName,
            trigger: 'blur',
          },
        ],
        vcVersionNo: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],
        txtContent: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],
        groupId: [
          {
            required: true,
            message: '文档类别不能为空',
            trigger: 'blur',
          },
        ],
      },
      attachmentId: null, // 附件ID
      attachmentName: '', // 附件名称
      maxlength: {
        VcName: 100,
        VcVersionNo: 100,
        TxtContent: 2147483647,
      },
      title: '',
      groupOptions: [], // 分组选项
    };
  },
  methods: {
    /**
     * @description 判断名字是否重名
     */
    getByName(name) {
      return new Promise((resolve, reject) => {
        this.$http({
          method: 'get',
          baseURL: window.SITE_CONFIG.baseUrl,
          url: '/resoure/resourcelaw/getByName',
          params: {
            name,
          },
        }).then((res) => {
          if (res.data.code === 0) {
            if (res.data.data.length === 1 && res.data.data[0].id === this.ruleForm.id) {
              resolve([]);
            } else {
              resolve(res.data.data);
            }
          }
        });
      });
    },
    /**
     * @description 数据初始化
     */
    initData(type = '', formData) {
      this.type = type;
      this.$refs.dialog.visible = true;
      this.fileList = [];
      if (type === 'detail') {
        this.title = '查看法律法规';
        this.getLawDetail(formData.id);
      } else if (type === 'add') {
        this.title = '新增法律法规';
        this.$nextTick(() => {
          for (let i in this.ruleForm) {
            if (i !== 'groupId') {
              this.ruleForm[i] = '';
            }
          }
        });
        this.attachmentId = null;
        this.attachmentName = '';
      } else {
        this.title = '修改法律法规';
        this.getLawDetail(formData.id);
      }
    },
    /* author xry
      调用富文本只读或是可修改的方法
    */
    setRichEditorStatus(type) {
      this.$refs.richEditor.setContent(type);
    },
    /**
     * @description 获取详情
     */
    getLawDetail(id) {
      const request = {
        method: 'post',
        url: `/resoure/resourcelaw/info/${id}`,
        baseURL: window.SITE_CONFIG.baseUrl,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          token: this.token,
        },
      };
      axios(request).then((response) => {
        console.log('获取详情', response);
        if (response.data.code === 0) {
          const { resourceLaw } = response.data.data;
          this.$nextTick(() => {
            this.ruleForm.vcName = resourceLaw.vcName;
            this.ruleForm.vcVersionNo = resourceLaw.vcVersionNo;
            this.ruleForm.dtPublishDate = resourceLaw.dtPublishDate;
            this.ruleForm.txtContent = resourceLaw.txtContent;
            this.ruleForm.groupId = resourceLaw.groupId;
            this.ruleForm.id = resourceLaw.id;
            this.fileList = resourceLaw.attachments ? resourceLaw.attachments.map((item) => {
              const file = {
                name: item.title,
                id: item.id,
                url: window.SITE_CONFIG.cloudUrl + item.url,
              };
              return file;
            }) : [];
            console.log('表单：', this.ruleForm);
          });
        }
      });
    },

    /**
     * @description 显示分组名字
     */
    getGroupName(groupId) {
      const names = getRelations({
        arr: this.groupOptions,
        relationKey: 'name',
        findKey: 'id',
        findValue: Number(groupId),
      });
      this.ruleForm.groupName = names[names.length - 1];
    },

    /**
     * @description 自定义上传
     */
    uploadFileMethod(files) {
      const formData = new FormData();
      formData.append('file', files.file);
      formData.append('type', 0);
      this.$http({
        url: '/appAttachment/fileUploadAttachment',
        baseURL: window.SITE_CONFIG.fileupload,
        method: 'post',
        data: formData,
      }).then(({ data }) => {
        console.log('/appAttachment/fileUploadAttachment', data);
        if (data.errorcode === 0) {
          this.$message({
            type: 'success',
            message: '上传成功',
          });
          let filelist = {};
          filelist.name = data.data.title;
          filelist.id = data.data.id;
          filelist.url = window.SITE_CONFIG.cloudUrl + data.data.url;
          this.fileList.push(filelist);
          console.log('文件：', this.fileList)
        } else {
          this.$message.error('上传失败');
        }
      })
    },

    /**
     * @description 预览文件
     */
    handlePreview(file) {
      window.open(
        `${file.url}?Authorization=${
          this.token
        }`,
      );
    },

    beforeAvatarUpload(file) {
      // 上传前类型判断
      let fileName = file.name.lastIndexOf('.'); // 取到文件名开始到最后一个点的长度
      let fileNameLength = file.name.length; // 取到文件名长度
      let fileFormat = file.name.substring(fileName + 1, fileNameLength);
      let fileType =
        fileFormat === 'xlsx' ||
        fileFormat === 'xls' ||
        fileFormat === 'doc' ||
        fileFormat === 'docx' ||
        fileFormat === 'txt' ||
        fileFormat === 'pdf' ||
        fileFormat === 'jpg' ||
        fileFormat === 'jpeg' ||
        fileFormat === 'png' ||
        fileFormat === 'ppt' ||
        fileFormat === 'pptx';
      if (!fileType) {
        this.$message.error(
          '上传格式为.xls,.xlsx,.doc,.txt,.pdf,.docx,.jpg,.jpeg,.png,.ppt,.pptx',
        );
      }
      return fileType;
    },
    /**
     * @description 删除文件
     */
    beforeRemove(file, fileList) {
      this.fileList.splice(this.fileList.indexOf(file), 1);
    },
    /**
     * @description 对话框确认按钮事件
     */
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const attachmentIds = this.fileList.map((item) => item.id) || [];
          if (this.type === 'add' || this.type === 'update') {
            const params = this.type === 'add' ? {
              vcName: this.ruleForm.vcName,
              vcVersionNo: this.ruleForm.vcVersionNo,
              dtPublishDate: this.ruleForm.dtPublishDate,
              txtContent: this.ruleForm.txtContent,
              groupId: this.ruleForm.groupId,
              attachIds: attachmentIds, // 附件id
            } : {
              id: this.ruleForm.id,
              vcName: this.ruleForm.vcName,
              vcVersionNo: this.ruleForm.vcVersionNo,
              dtPublishDate: this.ruleForm.dtPublishDate,
              txtContent: this.ruleForm.txtContent,
              groupId: this.ruleForm.groupId,
              attachIds: attachmentIds, // 附件id
            };
            this.$http({
              method: 'post',
              baseURL: window.SITE_CONFIG.baseUrl,
              url: `/resoure/resourcelaw/${this.type === 'update' ? 'update' : 'save'}`,
              data: params,
            }).then((res) => {
              if (res.data.code === 0) {
                this.$refs.dialog.visible = false;
                this.$emit('refresh');
                this.$message({
                  message: this.type === 'update' ? '修改成功' : '新增成功',
                  type: 'success',
                });
              }
            });
          } else {
            this.$refs.dialog.visible = false;
          }
        } else {
          return false;
        }
      });
    },
    /**
     * @description 关闭模态框并清除规则
     */
    onCancel() {
      this.$refs.dialog.visible = false;
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>

<style lang="scss">
.lawFormDialog {

  .lawForm {
    width: 1000px;
    box-sizing: border-box;
    padding: 20px 20px 0px 10px;

    .sbs-input {
      width: 100%;
    }

    .sbs-select {
      width: 100%;
    }
  }
}
</style>
