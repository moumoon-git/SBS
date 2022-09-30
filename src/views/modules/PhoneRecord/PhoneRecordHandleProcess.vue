<template>
  <div
    class="emergencyHandleProcess"
    style="width: 100%"
  >
    <div style="width: 80%; height: 36px; margin: auto; position: relative">
      <el-button
        v-if="
          $route.query.operationStatus !== '已办结'
            && $route.query.status === 'update'
        "
        style="height: 36px; position: absolute; right: 0"
        type="primary"
        size="small"
        @click="dialogVisible = true"
      >
        新增处置记录
      </el-button>
    </div>

    <el-timeline style="width: 80%; margin: auto; margin-right: 100px">
      <el-timeline-item
        v-for="(item, index) in processList"
        :key="index"
        :hide-timestamp="false"
        :timestamp="item.createTime"
        placement="top"
      >
        <el-card>
          <div
            style="
              width: 100%;
              height: 35px;
              line-height: 35px;
              background: #bcbcbc;
              position: relative;
              color: white;
            "
          >
            <span style="position: absolute; left: 2%">{{
              item.type == 0
                ? "要情登记"
                : item.type == 1
                  ? "电话记录"
                  : item.type == 2
                    ? "短信记录"
                    : "处置过程"
            }}</span>
            <span style="position: absolute; right: 2%">值班员:{{ item.workerName }}</span>
          </div>
          <div style="width: 100%; margin: initial; padding: 20px">
            {{ item.content }}
            <audio
              v-if="item.phoneInfo"
              :src="item.phoneInfo ? item.phoneInfo.recordFile : ''"
              controls="controls"
            />
          </div>
          <el-form
            v-if="item.type == 3"
            label-width="80px"
            size="medium "
            style="width: 100%"
          >
            <el-row>
              <el-col :span="24">
                <el-form-item>
                  <el-upload
                    ref="upload"
                    class="upload-demo"
                    :action="
                      $window.SITE_CONFIG['baseUrl'] +
                        '/upload/emergencyHandleProcessFile'
                    "
                    :data="{
                      emergencyHandleProcessId: updateProcessDialog
                        ? processList[0].id
                        : '',
                      token: $Cookies.get('token'),
                    }"
                    :on-preview="previewDocument"
                    :before-remove="processBeforeRemove"
                    multiple
                    :file-list="item.annexs"
                  >
                    <!-- <el-button size="small" type="primary" >点击上传</el-button> -->
                    <div
                      slot="tip"
                      class="el-upload__tip"
                      style="margin-top: -5%; margin-left: -8%; width: 100%"
                    >
                      <div
                        v-for="(annexsItem, annexsIndex) in item.annexs"
                        :key="annexsIndex"
                        style="
                          display: inline-block;
                          width: 23%;
                          margin-right: 5px;
                          margin-bottom: 5px;
                          position: relative;
                        "
                      >
                        <!-- <i v-if="item.type==0" class="iconfont icon-guanbi" @click="deleteImg(index,item)"  style="display: inline-block;position: absolute;line-height: 12px;font-size: 12px;color: white;background: #bcbcbc;right: 3%;top: 5%;border-radius: 50%;padding: 4px;"></i> -->
                        <!-- <viewer v-if="item.type==0" :images="[item.temporaryUrl]"> -->
                        <!-- <img  :src="item.url" style="width:100%;height:100px;"/> -->
                        <!-- </viewer> -->
                      </div>
                    </div>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <div
            v-if="
              item.type == 3
                && $route.query.operationStatus !== '已办结'
                && $route.query.status === 'update'
            "
            style="
              width: 100%;
              position: relative;
              height: 35px;
              line-height: 35px;
            "
          >
            <i
              class="iconfont icon-bianji"
              style="
                display: inline-block;
                position: absolute;
                right: 5%;
                font-size: 16px;
                color: #bcbcbc;
              "
              @click="
                dialogVisible = true;
                dataForm = $window.JSON.parse($window.JSON.stringify(item));
                fileList = dataForm.annexs;
                updateProcessDialog = true;
              "
            />
            <i
              class="iconfont icon-shanchumoban"
              style="
                display: inline-block;
                position: absolute;
                right: 2%;
                font-size: 17px;
                color: #bcbcbc;
              "
              @click="deleteProcessItem(item.id)"
            />
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <el-dialog
      title="新增处置记录"
      style=""
      :visible.sync="dialogVisible"
      :destroy-on-close="true"
      width="40%"
      :before-close="handleClose"
      @close="
        dialogVisible = false;
        updateProcessDialog = false;
        dataForm.content = '';
        dataForm.annexs = [];
        fileList = [];
      "
    >
      <div style="width: 100%; position: relative">
        <!-- <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="100px" class="demo-ruleForm" label-position="right" style="display: flex;flex-wrap: wrap;justify-content: center;padding-right: 24px;">
                <el-form-item  label="节假日名称:" prop="name" style="width:80%;">
                    <el-input v-model="dataForm.name"></el-input>
                </el-form-item>

                <el-form-item  label="节假日设置:" prop="dateRange" style="width:80%;">
                    <el-date-picker :unlink-panels="true"
                        v-model="dataForm.dateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form> -->

        <el-form
          ref="dataForm"
          :model="dataForm"
          :rules="dataRule"
          label-width="80px"
          size="medium"
          style="width: 100%"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="处置情况"
                prop="content"
              >
                <el-input
                  v-model="dataForm.content"
                  style="resize: none"
                  type="textarea"
                  :rows="2"
                  placeholder="处置情况"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item
                label="附件"
                style="height: 300px; overflow: auto"
              >
                <el-upload
                  ref="upload"
                  class="upload-demo"
                  :action="
                    $window.SITE_CONFIG['baseUrl'] +
                      '/upload/emergencyHandleProcessFile'
                  "
                  :data="{
                    emergencyHandleProcessId: updateProcessDialog
                      ? dataForm.id
                      : '',
                    token: $Cookies.get('token'),
                  }"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :on-success="handleSuccess"
                  :on-error="handleError"
                  :before-remove="beforeRemove"
                  multiple
                  :on-exceed="handleExceed"
                  :file-list="fileList"
                >
                  <el-button
                    size="small"
                    type="primary"
                  >
                    点击上传
                  </el-button>
                  <div
                    slot="tip"
                    class="el-upload__tip"
                    style="margin-top: 15px; width: 100%"
                  >
                    <div
                      v-for="(item, index) in dataForm.annexs"
                      :key="index"
                      style="
                        display: inline-block;
                        width: 23%;
                        margin-right: 5px;
                        margin-bottom: 5px;
                        position: relative;
                      "
                    >
                      <i
                        v-if="item.type == 0"
                        class="iconfont icon-guanbi"
                        style="
                          display: inline-block;
                          position: absolute;
                          line-height: 12px;
                          font-size: 12px;
                          color: white;
                          background: #bcbcbc;
                          right: 3%;
                          top: 5%;
                          border-radius: 50%;
                          padding: 4px;
                        "
                        @click="deleteImg(index, item)"
                      />
                      <viewer
                        v-if="item.type == 0"
                        :images="[item.temporaryUrl]"
                      >
                        <img
                          :src="item.temporaryUrl"
                          style="width: 100%; height: 100px"
                        >
                      </viewer>
                    </div>
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
        style=""
      >
        <el-button
          plain
          size="small"
          @click="
            dialogVisible = false;
            updateProcessDialog = false;
            dataForm.content = '';
            dataForm.annexs = [];
          "
        >取 消</el-button>
        <el-button
          type="primary"
          style="background: #1890ff"
          size="small"
          :loading="isSubmitting"
          @click="dataFormSubmit"
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="查看附件"
      :visible.sync="dialogDocumentVisible"
      :destroy-on-close="true"
      style="text-align: center"
      width="800"
    >
      <img
        v-show="getDocumentType"
        :src="documentUrl"
        height="600"
        style="max-width: 100%"
      >
      <preplan-document
        v-show="!getDocumentType"
        :document-url="documentUrl"
      />
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import imageWithHttp from '@/utils/imageWithHttp';
import PreplanDocument from '@/views/modules/ControlPlan/ContingencyPlan/Detail/PreplanDocument';
// import AddOrUpdate from './emergencyhandleprocess-add-or-update';
// import bus from "@/views/common/js/eventBus";

export default {
  components: {
    // AddOrUpdate,
    PreplanDocument,
  },
  data() {
    return {
      $window: {},
      $Cookies: {},
      dialogVisible: false,
      dialogDocumentVisible: false,
      documentUrl: '',
      fileList: [],
      processList: [],
      dataForm: {
        key: '',
      },
      dataList: [],
      dataForm: {
        content: '',
        annexs: [],
      },
      updateProcessDialog: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      dataRule: {
        content: [
          { required: true, message: '处置情况不能为空', trigger: 'blur' },
        ],
        annexs: [
          { required: true, message: '附件数组不能为空', trigger: 'blur' },
        ],
      },
      // 新增、编辑弹窗正在提交
      isSubmitting: false,
    };
  },
  computed: {
    getDocumentType() {
      if (
        [
          'png',
          'jpg',
          'jpeg',
          'bmp',
          'gif',
          'webp',
          'psd',
          'svg',
          'tiff',
        ].indexOf(
          this.documentUrl
            .substr(this.documentUrl.lastIndexOf('.') + 1)
            .toLowerCase(),
        ) !== -1
      ) {
        return true;
      }
      return false;
    },
  },
  watch: {
    'dataForm.annexs': function (newValue, oldValue) {
      if (this.dataForm.annexs.length > 0) {
        this.dataForm.annexs.forEach((item, index) => {
          if (item.type === 0) {
            const temporaryObject = imageWithHttp.withHttp(item.url);
            // console.log("temporaryObject")
            // console.log("temporaryObject",temporaryObject)
            setTimeout(() => {
              this.$set(item, 'temporaryUrl', temporaryObject.image);
              this.$forceUpdate();
              // this.$set(this.dataForm.annexs[index].response.data.temporaryUrl,'image',temporaryObject.image)
              // item.response.data.temporaryUrl=temporaryObject
              // console.log("1500 this.dataForm.annexs",this.dataForm.annexs)
            }, 1500);
          }
        });
      }
    },
    processList(newValue, oldValue) {
      this.processList.forEach((item) => {
        item.annexs.forEach((annexItem) => {
          if (annexItem.type === 0) {
            const temporaryObject = imageWithHttp.withHttp(annexItem.url);
            // console.log("temporaryObject")
            // console.log("temporaryObject",temporaryObject)
            setTimeout(() => {
              this.$set(annexItem, 'temporaryUrl', temporaryObject.image);
              this.$forceUpdate();
              // this.$set(this.dataForm.annexs[index].response.data.temporaryUrl,'image',temporaryObject.image)
              // item.response.data.temporaryUrl=temporaryObject
              // console.log("1500 this.processList",this.processList)
            }, 1500);
          }
        });
      });
    },
  },
  activated() {
    this.getDataList();
  },
  created() {
    this.$Cookies = Cookies;
    this.$window = window;
    this.getDataList();
  },
  mounted() {},
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl(
          `/ottffemergency/ottffemergencyhp/list?emergencyInfoId=${this.$route.query.id}`,
        ),
        method: 'get',
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          // console.log("/emergency/emergencyhandleprocess/list 获取要情的处置流程",data)
          this.processList = data.data;
        } else {
          this.$message({
            message: `${data.msg}`,
            type: 'error',
          });
        }
      });
    },
    previewDocument(file) {
      const index = file.name.lastIndexOf('.');
      const ext = file.name.substr(index + 1);
      if (
        [
          'png',
          'jpg',
          'jpeg',
          'bmp',
          'gif',
          'webp',
          'psd',
          'svg',
          'tiff',
        ].indexOf(ext.toLowerCase()) !== -1
      ) {
        // console.log('该文件是图片')
        this.dialogDocumentVisible = true;
        this.documentUrl = this.$window.SITE_CONFIG.cloudUrl + file.url;
        // console.log('文件路径1', this.documentUrl);
        return true;
      }
      this.dialogDocumentVisible = true;
      this.documentUrl = this.$window.SITE_CONFIG.cloudUrl + file.url;
      // console.log('文件路径2', this.documentUrl);
      // bus.$emit("documentPreview", { url: this.documentUrl });
      return false;
    },
    deleteProcessItem(id) {
      this.$confirm('确定是否删除该处置过程?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http({
            url: this.$http.adornUrl(
              'ottffemergency/ottffemergencyhp//delete',
            ),
            method: 'post',
            data: this.$http.adornData({
              ids: [id],
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              // console.log("删除成功",data)
              this.$message({
                message: '删除成功!',
                type: 'success',
              });
              this.getDataList();
            } else {
              this.$message({
                message: `${data.msg}`,
                type: 'error',
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          this.dialogVisible = false;
          this.updateProcessDialog = false;
          this.dataForm.content = '';
          this.dataForm.annexs = [];
          done();
        })
        .catch((_) => {});
    },
    deleteImg(index, item) {
      document
        .querySelectorAll(
          '.el-upload-list.el-upload-list--text li .el-icon-close',
        )[index].setAttribute('display', 'initial');
      document
        .querySelectorAll(
          '.el-upload-list.el-upload-list--text li .el-icon-close',
        )[index].click();

      if (this.updateProcessDialog) {
        this.$http({
          url: this.$http.adornUrl(
            '/emergency/emergencyhandleprocessannex/delete',
          ),
          method: 'post',
          data: this.$http.adornData({
            ids: [item.id],
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            // console.log("删除成功",data)
            this.$message({
              message: '删除成功!',
              type: 'success',
            });
          } else {
            this.$message({
              message: `${data.msg}`,
              type: 'error',
            });
          }
        });
      }
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    processBeforeRemove(file, fileList) {
      return false;
    },
    handlePreview(file) {
      // console.log("上传预览handlePreview file",file);
      // if(this.$route.query.status==='update'){
      //   let httpaddress = window.SITE_CONFIG.baseUrl
      //   let token = document.cookie
      //   console.log(
      //     `${httpaddress}/${file.url}?attname=${file.name}&token=${this.$cookie.get('token')}`
      //   )
      //   window.open(`${httpaddress}/${file.url}?attname=${file.name}&token=${this.$cookie.get('token')}`)
      //   // window.location.href = `${httpaddress}/${file.url}?attname=${file.name}&token=${this.$cookie.get('token')}`
      // }
    },
    handleRemove(file, fileList) {
      this.dataForm.annexs = [];
      // console.log("删除上传handleRemove file, fileList",file, fileList);
      fileList.forEach((item) => {
        if (item.response) {
          this.dataForm.annexs.push(item.response.data);
        } else {
          this.dataForm.annexs.push(item);
        }
      });

      this.fileList = this.dataForm.annexs;
    },
    handleSuccess(response, file, fileList) {
      this.dataForm.annexs = [];
      // console.log("上传成功response, file, fileList",response.code,response, file, fileList)
      if (response.code === 0) {
        // console.log("response.code&&response.code")
        fileList.forEach((item) => {
          if (item.response) {
            this.dataForm.annexs.push(item.response);
            console.log('response', item.response);
          } else {
            this.dataForm.annexs.push(item);
          }
        });
        console.log('this.dataForm.annexs', this.dataForm.annexs);
        this.fileList = this.dataForm.annexs;
      } else {
        this.$message({
          message: `${response.msg}`,
          type: 'error',
        });
      }
    },
    handleError(err, file, fileList) {
      // console.log("上传失败handleError err, file, fileList",err, file, fileList)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`,
      );
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    deleteHandle(id) {
      const ids = id
        ? [id]
        : this.dataListSelections.map((item) => item.id);
      this.$confirm(
        `确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('ottffemergency/ottffemergencyhp//delete'),
          method: 'post',
          data: this.$http.adornData(ids, false),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList();
              },
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    // 表单提交
    dataFormSubmit() {
      const annexs = [];
      console.log('this.dataForm.annexs', this.dataForm.annexs);
      this.dataForm.annexs.forEach((item) => {
        annexs.push({
          url: item.url,
          name: item.fileName,
          type: 0,
        });
      });
      // return;
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.isSubmitting = true;
          this.$http({
            url: this.$http.adornUrl(
              `${
                this.updateProcessDialog
                  ? '/ottffemergency/ottffemergencyhp/update'
                  : '/ottffemergency/ottffemergencyhp/save'
              } `,
            ),
            method: 'post',
            data: this.$http.adornData({
              id: this.dataForm.id,
              emergencyInfoId: this.$route.query.id,
              content: this.dataForm.content,
              type: 3,
              annexs,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.isSubmitting = false;
                  this.dialogVisible = false;
                  this.updateProcessDialog = false;
                  this.dataForm.content = '';
                  this.dataForm.annexs = [];
                  this.getDataList();
                },
              });
            } else {
              this.$message.error(data.msg);
              this.isSubmitting = false;
            }
          });
        }
      });
    },
  },
};
</script>
<style lang="less">
.emergencyHandleProcess {
  .el-timeline {
    margin: 0;
    font-size: 14px;
    list-style: none;
    .el-timeline-item {
      position: relative;
      padding-bottom: 20px;
    }
    .el-card__body {
      padding: 0px !important;
    }
    .el-timeline-item__tail {
      position: absolute;
      left: -20px;
      height: 100%;
      border-left: 2px solid #e4e7ed;
    }
    .el-timeline-item__node--normal {
      left: -25px;
      width: 12px;
      height: 12px;
    }
    .el-timeline-item__node {
      position: absolute;
      background-color: #e4e7ed;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .el-timeline-item__wrapper {
      .el-timeline-item__timestamp.is-top {
        display: inline-block;
        position: relative;
        left: -170px;
        top: -5px;
        background: #bcbcbc;
        color: white;
        border-radius: 5px;
        padding: 0px 4px;
      }
    }
  }
  .el-dialog {
    border-radius: 10px;
    .el-dialog__header {
      // box-sizing: border-box!important;
      background: #409eff !important;
      padding: 10px !important;
      // padding-bottom: 5px!important;
      border-radius: 10px 10px 0px 0px !important;
    }

    .el-dialog__title {
      margin-left: 10px;
      color: white !important;
    }
    .el-dialog__headerbtn {
      top: initial !important;
    }
    .el-dialog__close {
      color: white !important;
    }
    .el-dialog__footer {
      text-align: center !important;
      margin-top: -30px !important;
      padding-bottom: 30px !important;
    }
  }

  .el-range-separator {
    width: auto !important;
  }
  .el-row {
    border: initial;
  }
}
</style>
