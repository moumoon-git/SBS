<template>
  <div class="knowledgeBase-form-dialog">
    <sv-dialog
      ref="dialog"
      :title="title"
      @cancel="cancleDialog"
      @confirm="save"
    >
      <el-form
        ref="ruleForm"
        label-width="100px"
        :model="ruleForm"
        :rules="rules"
        class="knowledgeBase-form"
        @submit.native.prevent
      >
        <el-form-item label="标题：" prop="title">
          <template v-if="type==='detail'">
            {{ ruleForm.title }}
          </template>
          <el-input
            v-else
            v-model="ruleForm.title"
            :maxlength="maxlength.VcTitle"
            clearable
            show-word-limit
            class="sbs-input"
          />
        </el-form-item>
        <el-form-item label="文档类别：" prop="groupId">
          <template v-if="type==='detail'">
            {{ ruleForm.groupName }}
          </template>
          <sv-select-group
            v-else
            v-model="ruleForm.groupId"
            api="/resoure/resourceknowledgegroup/list"
            :name="ruleForm.groupName"
            placeholder="请选择文档类别"
            title="请选择文档类别"
          />
        </el-form-item>

        <el-form-item label="文件号：" prop="fileNo">
          <template v-if="type==='detail'">
            {{ ruleForm.fileNo }}
          </template>
          <el-input
            v-else
            v-model="ruleForm.fileNo"
            :maxlength="maxlength.VcFileNo"
            clearable
            show-word-limit
            class="sbs-input"
          />
        </el-form-item>
        <el-form-item label="关键词：" prop="keywords">
          <template v-if="type==='detail'">
            {{ ruleForm.keywords }}
          </template>
          <el-input
            v-else
            v-model="ruleForm.keywords"
            :maxlength="maxlength.VcKeywords"
            clearable
            show-word-limit
            class="sbs-input"
          />
        </el-form-item>

        <el-form-item label="制定单位：" prop="dept">
          <template v-if="type==='detail'">
            {{ ruleForm.dept }}
          </template>
          <el-input
            v-else
            v-model="ruleForm.dept"
            :maxlength="maxlength.VcDept"
            clearable
            show-word-limit
            class="sbs-input"
          />
        </el-form-item>

        <el-form-item
          label="发布时间："
          prop="publishTime"
        >
          <template v-if="type==='detail'">
            {{ ruleForm.publishTime }}
          </template>
          <el-date-picker
            v-else
            v-model="ruleForm.publishTime"
            clearable
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            class="sbs-date-picker"
          />
        </el-form-item>

        <el-form-item label="适用事件描述:" prop="useDescription">
          <template v-if="type==='detail'">
            {{ ruleForm.useDescription }}
          </template>
          <el-input
            v-else
            v-model="ruleForm.useDescription"
            type="textarea"
            :rows="2"
            class="sbs-input"
          />
        </el-form-item>

        <el-form-item label="适用范围：" prop="useScope">
          <template v-if="type==='detail'">
            {{ ruleForm.useScope }}
          </template>
          <el-input
            v-else
            v-model="ruleForm.useScope"
            type="textarea"
            :rows="2"
            class="sbs-input"
          />
        </el-form-item>

        <el-form-item label="内容：" prop="content">
          <template v-if="type==='detail'">
            {{ ruleForm.content }}
          </template>
          <el-input
            v-else
            v-model="ruleForm.content"
            type="textarea"
            :rows="2"
            class="sbs-input"
          />
        </el-form-item>

        <el-form-item label="备注：" prop="remark">
          <template v-if="type==='detail'">
            {{ ruleForm.remark }}
          </template>
          <el-input
            v-else
            v-model="ruleForm.remark"
            type="textarea"
            :rows="2"
            class="sbs-input"
          />
        </el-form-item>

        <el-form-item label="附件：">
          <template v-if="type==='detail'">
            <div v-for="item in fileList" :key="item.name" @click="handlePreview(item)" class="accessory">
              {{ item.name }}
            </div>
          </template>
          <el-upload
            v-else
            class="upload-demo"
            action=""
            :http-request="uploadFileMethod"
            :accept="accept"
            :file-list="fileList"
            :headers="{
              Authorization: $window.localStorage.getItem('token')
                ? $window.localStorage.getItem('token')
                : '',
            }"
            :before-upload="beforeAvatarUpload"
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
import axios from 'axios';
import { getRelations } from '@/assets/js/yz_common.js';

export default {
  name: 'KnowledgeBaseAddOrUpdate',
  inject: ['reload'],
  props: ['treeData'],
  data() {
    const validateName = (rule, value, callback) => {
      this.getByName(value).then((res) => {
        if (res.length > 0) {
          callback(new Error('当前已有该应急知识，请勿重复'));
        } else {
          callback();
        }
      });
    };
    return {
      // 当前登录用户的token
      token: this.$cookie.get('token'),
      accept: '.xls,.xlsx,.doc,.txt,.pdf,.docx,.jpg,.jpeg,.png,.ppt,.pptx',
      title: '', // 标题
      dialogTitle: '',
      type: '', // 判断是新增还是修改
      ID: '', // 当前数据ID
      fileList: [],
      ruleForm: {
        title: '', // 标题
        keywords: '', // 关键词
        publishTime: '', // 发布时间
        fileNo: '', // 文件号
        dept: '', // 制定单位
        useDescription: '', // 适用事件描述
        useScope: '', // 适用范围
        content: '', // 内容
        remark: '', // 备注
        groupId: '', // 分组id
      },
      rules: {
        // 正则
        title: [
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
        groupId: [
          {
            required: true,
            message: '分组不能为空',
            trigger: 'blur',
          },
        ],
      },
      root: window.SITE_CONFIG.baseUrl,
      maxlength: {
        VcTitle: 100,
        VcKeywords: 20,
        VcFileNo: 50,
        VcDept: 20,
      },
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
          url: '/resoure/resourceknowledge/getByName',
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
            message: '上传成功'
          })
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
      console.log(
        `${file.url}?Authorization=${
          localStorage.getItem('token') ? localStorage.getItem('token') : ''
        }`,
      );
      window.open(
        `${file.url}?Authorization=${
          this.token
        }`,
      );
    },
    /**
     * @description 上传前类型判断
     */
    beforeAvatarUpload(file) {
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
     * @description 数据初始化
     */
    initData(type, fromData) {
      console.log(type, fromData);
      this.$refs.dialog.visible = true;
      this.fileList = [];
      this.type = type;
      if (type === 'add') {
        this.title = '新增应急知识库';
        this.$nextTick(() => {
          for (let i in this.ruleForm) {
            if (i !== 'groupId') {
              this.ruleForm[i] = '';
            }
          }
        });
      } else if (type === 'detail') {
        this.title = '查看应急知识库';
        this.getResourceKnowledge(fromData.id);
      } else {
        this.title = '修改应急知识库';
        this.getResourceKnowledge(fromData.id);
      }
    },
    /**
     * @description 获取详情
     */
    getResourceKnowledge(id) {
      const request = {
        method: 'post',
        url: `/resoure/resourceknowledge/info/${id}`,
        baseURL: window.SITE_CONFIG.baseUrl,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          token: this.token,
        },
      };
      axios(request).then((response) => {
        console.log('获取详情', response);
        if (response.data.code === 0) {
          const { resourceKnowledge } = response.data.data;
          this.ruleForm.title = resourceKnowledge.title;
          this.ruleForm.keywords = resourceKnowledge.keywords;
          this.ruleForm.publishTime = resourceKnowledge.publishTime;
          this.ruleForm.fileNo = resourceKnowledge.fileNo;
          this.ruleForm.dept = resourceKnowledge.dept;
          this.ruleForm.useDescription = resourceKnowledge.useDescription;
          this.ruleForm.useScope = resourceKnowledge.useScope;
          this.ruleForm.content = resourceKnowledge.content;
          this.ruleForm.remark = resourceKnowledge.remark;
          this.ruleForm.id = resourceKnowledge.id;
          this.ruleForm.groupId = resourceKnowledge.groupId;
          this.fileList = resourceKnowledge.attachments ? resourceKnowledge.attachments.map((item) => {
            const file = {
              name: item.title,
              id: item.id,
              url: window.SITE_CONFIG.cloudUrl + item.url,
            }
            return file;
          }) : [];
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
     * @description 保存
     */
    save() {
      if (this.type === 'detail') {
        this.cancleDialog();
      } else {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let arrayID = [];
            for (let i in this.fileList) {
              arrayID.push(this.fileList[i].id);
            }
            let data =
              this.type === 'update'
                ? {
                    id: this.ID,
                    attachIds: arrayID,
                    ...this.ruleForm,
                  }
                : {
                    attachIds: arrayID,
                    ...this.ruleForm,
                  };
            this.$http({
              method: 'post',
              baseURL: window.SITE_CONFIG.baseUrl,
              url: `/resoure/resourceknowledge/${
                this.type === 'update' ? 'update' : 'save'
              }`,
              data,
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
            return false;
          }
        });
      }
    },
    /**
     * @description 关闭模态框并清除规则
     */
    cancleDialog() {
      this.$refs.ruleForm.resetFields();
      this.$refs.dialog.visible = false;
    },
  },
};
</script>

<style lang="scss">
.knowledgeBase-form-dialog {
  .knowledgeBase-form {
    width: 800px;
    box-sizing: border-box;
    padding: 20px 20px 0px 10px;
    .accessory:hover{
      color: #409EFF;
      cursor: pointer;
    }
    .sbs-input {
      width: 100%;
    }

    .sbs-select {
      width: 100%;
    }

    .sbs-date-picker {
      width: 100%;
    }
  }
}
</style>
