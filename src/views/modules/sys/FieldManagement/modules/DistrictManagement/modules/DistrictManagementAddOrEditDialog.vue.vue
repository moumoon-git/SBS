<template>
  <sv-dialog
    ref="dialog"
    :title="type === 'save' ? '新增区域类型' : '编辑区域类型'"
    @confirm="handleConfirm"
    @cancel="handleClose"
    @modal="handleClose"
  >
    <div :class="$style.container" v-loading="loading">
      <div>
        <label :class="$style.required">分类名称</label>
        <sv-input-search
          v-model="name"
          placeholder="请输入分类名称"
          :suffix="false"
          width="300px"
        />
      </div>
      <div>
        <label :class="$style.required">上级分类</label>
        <el-cascader
          v-model="parent"
          :props="{
            value: 'id',
            label: 'townName',
            children: 'children',
            checkStrictly: true,
            emitPath: false,
          }"
          :options="[{ id: -1, townName: '顶级分类' }, ...parentTree]"
          :show-all-levels="false"
        />
      </div>
      <div style="display: inline-block; margin-top: 5px;">
        <label style="float: left; margin-right: 24px;">备注信息</label>
        <sv-textarea
          v-model="remark"
          placeholder="请输入备注信息"
          :rows="3"
          width="300px"
        />
      </div>
      <div style="display: flex; height: 40px; align-items: center;">
        <label style="margin-right: 10px;">属地负责人</label>
        <sv-select-contact
          v-model="contact"
          :class="$style.contact"
          title="负责人"
          :detail="contactDetail"
        />
      </div>
      <div style="display: flex; height: 40px; align-items: center;">
        <label style="margin-right: 20px;">行政边界</label>
        <el-upload
          :class="$style.upload"
          ref="upload"
          action=""
          :http-request="uploadFileMethod"
          :file-list="fileList"
          :on-remove="removeFile"
          :limit="1"
        >
          <span :class="$style.button">
            上传行政边界
          </span>
        </el-upload>
      </div>
      <div :class="$style.borderStyle">
        <label style="margin-right: 20px;">边界样式</label>
        <div :class="$style.button" @click="setStyleDialog">
          设置边界样式
        </div>
        <div :class="$style.preview">
          <div :style="stylePreview.stroke">
            <div :style="stylePreview.background" />
          </div>
        </div>
      </div>
    </div>
    <sv-dialog-hint
      ref="fail"
      type="fail"
      :text="errorText"
    />
    <borderStyleDialog ref="borderStyleDialogRef" @save="save"/>
  </sv-dialog>
</template>

<script>
import borderStyleDialog from './borderStyleDialog.vue';

export default {
  name: 'DistrictManagementAddOrEditDialog',
  components: {
    borderStyleDialog,
  },
  props: {
    parentTree: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      fileList: [],
      id: null,
      type: 'add',
      errorText: '',
      name: '',
      parent: -1,
      contact: null,
      contactDetail: {},
      remark: '',
      style: {
        background: '#F66E6E',
        opacity: 0.7,
        lineHeight: 4,
        strokeColor: '#0091FF',
        id: '',
      },
    };
  },
  computed: {
    stylePreview() {
      return {
        background: {
          background: this.style.background,
          opacity: this.style.opacity,
        },
        stroke: {
          border: `${this.style.lineHeight}px solid ${this.style.strokeColor}`,
        },
      };
    },
  },
  methods: {
    /**
     * 上传文件
     */
    async uploadFileMethod(param) {
      this.loading = true;
      const formData = new FormData();
		  formData.append('file', param.file);
      const request = {
        method: 'post',
        url: '/sysTownBorder/uploadKml',
        baseURL: window.SITE_CONFIG.fileupload,
        data: formData,
      };
      try {
        const { data } = await this.$http(request);
        if (data.errorcode === 0) {
          this.fileList.push(data.data);
          this.$message.success('文件上传成功!');
          // this.getFileList();
        } else {
          this.$message.error(`上传文件报错,报错原因${data.msg}`);
        }
      } catch (error) {
        this.$message.error(`上传文件报错,报错原因${error}`);
      } finally {
        this.loading = false;
      }
    },
    /**
     * 删除文件
     */
    async removeFile() {
      const request = {
        method: 'get',
        url: '/cm/detentionStaff/delFile',
        baseURL: window.SITE_CONFIG.fileupload,
        params: {
          path: this.fileList[0].url,
        },
      };
      try {
        const { data } = await this.$http(request);
        if (data.errorcode === 0) {
          this.fileList.pop();
          this.$message.success('删除文件成功!');
        } else {
          this.$message.error(`删除文件报错,报错原因${data.msg}`);
        }
      } catch (error) {
        this.$message.error(`删除文件报错,报错原因${error}`);
      }
    },
    save(obj) {
      this.style.background = obj.fillColor;
      this.style.opacity = obj.fillOpacity / 100;
      this.style.lineHeight = obj.lineHeight;
      this.style.strokeColor = obj.strokeColor;
      this.style.id = obj.id;
    },
    setStyleDialog() {
      this.$refs.borderStyleDialogRef.open(this.style);
    },
    open(type, data) {
      this.type = type;
      if (data) {
        this.id = data.id;
        this.name = data.townName;
        this.parent = data.parentId > 0 ? data.parentId : -1;
        this.contactDetail = (
          data.contactors && data.contactors.length && data.contactors[0]
        ) || {};
        this.contact = (data.contactors && data.contactors.length && data.contactors[0].id) || null;
        this.remark = data.remark;
        if (data.sysTownBorderStyle) {
          this.style.background = data.sysTownBorderStyle.fillColor;
          this.style.opacity = data.sysTownBorderStyle.fillOpacity;
          this.style.strokeColor = data.sysTownBorderStyle.strokeColor;
          this.style.lineHeight = data.sysTownBorderStyle.strokeWidth;
          this.style.id = data.sysTownBorderStyle.id;
        }
        if (data.file) this.fileList.push(data.file);
      }
      this.$refs.dialog.visible = true;
    },
    handleClose() {
      this.$refs.dialog.visible = false;
      this.resetForm();
    },
    handleConfirm() {
      if (!this.name) {
        this.errorText = '请填写分类名称！';
        this.$refs.fail.visible = true;
        return;
      }
      const request = {
        method: 'post',
        url: `${window.SITE_CONFIG.baseUrl}/sys/systown/${this.type}`,
        data: {
          id: this.id ? this.id : undefined,
          townName: this.name,
          parentId: this.parent > 0 ? this.parent : 0,
          remark: this.remark,
          contactorIds: this.contact ? [this.contact] : [],
          borderCoordinateUrl: this.fileList.length
            ? window.SITE_CONFIG.cloudUrl + this.fileList[0].url : '',
          sysTownBorderStyle: {
            fillColor: this.style.background,
            fillOpacity: this.style.opacity,
            strokeWidth: this.style.lineHeight,
            strokeColor: this.style.strokeColor,
            id: this.type === 'save' ? '' : this.style.id,
          },
        },
      };
      this.$http(request).then((response) => {
        if (response.data.errorcode === 0) {
          this.$emit('refresh');
          this.handleClose();
        } else {
          this.$message.error(`操作失败，错误代码${response.data.errorcode}，错误信息：${response.data.msg}`);
        }
      }).catch((error) => {
        this.$message.error(`操作失败，错误信息：${error}`);
      });
    },
    resetForm() {
      this.id = null;
      this.name = '';
      this.parent = -1;
      this.contact = null;
      this.remark = '';
      this.fileList = [];
      this.style = {
        background: '#F66E6E',
        opacity: 0.7,
        lineHeight: 4,
        strokeColor: '#0091FF',
      };
    },
  },
};
</script>

<style lang="scss" module>
.contact{
  display: flex;
  align-items: center;
  width: 200px;
  justify-content: space-between;
  span{
    vertical-align: center;
    margin-top: 7px !important;
  }
  :global(.sv-button){
    margin-right: 20px;
  }
}

.borderStyle{
  display: flex;
  align-items: center;
}
// 预览
.preview {
  display: flex;
  align-items: center;
  & > div {
    margin-left: 20px;
    width: 150px;
    box-sizing: border-box;
    height: 30px;
    & > div {
      width: auto;
      height: 100%;
    }
  }
}
.button{
  cursor: pointer;
  display: inline-block;
  width: 100px;
  height: 28px;
  line-height: 28px;
  background: #e9f7ff;
  color: #0091ff;
  border: 1px solid #c5defe;
  border-radius: 4px;;
  text-align: center;
}
.container {
      .upload{
      width: 70%;
      display: flex;
      align-items: center;
      :global(.el-upload-list .el-upload-list__item:first-child){
        margin: 0px;
      }
      :global(.el-upload-list__item-name){
        margin-left: 20px;
        width: 150px;
      }
    }
  padding: 30px 70px;
  & > div {
    height: 40px;
    line-height: 40px;
    & > label {
      margin-right: 20px;
      &.required {
        position: relative;
        &::before {
          content: '*';
          position: absolute;
          left: -8px;
          color: red;
        }
      }
    }
  }
  :global(.el-cascader) {
    width: 300px;
    :global(.el-input__inner) {
      height: 30px;
      padding-left: 10px;
      color: #000;
    }
  }
}
</style>
