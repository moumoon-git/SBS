<!--@author：yf-->
<template>
  <div>
    <div>
      <el-col :span="24">
        <div style="padding: 20px; text-align: left">
          <label style="font-size: 14px">报送单位:</label>
          <el-select
            v-model="SelectValue"
            clearable
            placeholder="请选择"
            @change="monitorSelect"
          >
            <el-option
              v-for="item in options"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            >
            </el-option>
          </el-select>
        </div>
      </el-col>
    </div>

    <div class="contentMain">
      <div
        v-for="(item, index) in list"
        class="operationPlan"
        :key="index"
        @click="clickUpdate(item, index)"
      >
        <div id="plans" :class="{ red: changeRed == index }">
          <div class="timePlan">
            <el-row>
              <el-col :span="5"
                ><div class="reportingunit">
                  报送单位:{{ item.department }}
                </div></el-col
              >
              <el-col :span="4"
                ><div class="submissionPeople">
                  报送人:{{ item.dealName }}
                </div></el-col
              >
              <el-col :span="7"
                ><div class="submitPhoneNumber">
                  报送号码:{{ item.dealPhone }}
                </div></el-col
              >
              <el-col :span="8"
                ><div class="submitTime">
                  报送时间:{{ item.dealTime }}
                </div></el-col
              >
            </el-row>
          </div>
          <!-- <div class="timePlan">{{item.department}} {{item.dealTime}}&nbsp;&nbsp;&nbsp;</div> -->
          <!-- <div class="contentPlan">{{item.description}}</div> -->
          <div class="contentPlan">
            <el-row
              ><el-col :span="24"
                ><div class="reportingunit">
                  报送内容:{{ item.description }}
                </div></el-col
              ></el-row
            >
          </div>

          <!-- <div class="upLoadtext" v-for="(item,index) in item.attachments" :key="index">
            {{item.fileName}}
            <el-button size="mini" type="primary" @click.stop="downloadFile(item)">下载</el-button>
          </div> -->
          <div
            class="upLoadtext"
            v-for="(item, index) in item.attachments"
            :key="index"
          >
            <el-row>
              <el-col :span="24"
                ><div class="reportingunit">
                  报送附件:{{ item.fileName }}
                  <el-button
                    size="mini"
                    type="primary"
                    @click.stop="downloadFile(item)"
                    >下载</el-button
                  >
                </div></el-col
              >
            </el-row>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="addButton">
        <el-button
          type="primary"
          size="small"
          v-if="restShow"
          @click="addReport"
          >新增续报</el-button
        >
        <el-button
          type="primary"
          size="small"
          v-if="restShow"
          @click="updataReport"
          >修改续报</el-button
        >
        <el-button
          type="primary"
          size="small"
          v-if="restShow"
          @click="delectReport"
          >删除续报</el-button
        >
        <el-button
          type="primary"
          size="small"
          v-if="saveShow"
          @click="saveEvent('ruleForm')"
          >保存续报</el-button
        >
        <el-button type="primary" size="small" v-if="saveShow" @click="callOff"
          >取消</el-button
        >
      </div>
    </div>

    <div id="formSave">
      <el-form
        style="padding: 0 20px"
        label-width="100px"
        :model="ruleForm"
        :rules="disabled ? null : rules"
        ref="ruleForm"
        @submit.native.prevent
        label-position="right"
      >
        <el-row :gutter="gutter">
          <el-col :span="12">
            <el-form-item label="报送单位:" prop="submissionUnits">
              <el-input
                type="text"
                :readonly="disabled"
                v-model.trim="ruleForm.submissionUnits"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-row :gutter="gutter"> -->
          <el-col :span="12">
            <el-form-item label="报送人:" prop="submissionPeople">
              <el-input
                type="text"
                :readonly="disabled"
                v-model.trim="ruleForm.submissionPeople"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- -->
        </el-row>

        <el-row :gutter="gutter">
          <el-col :span="12">
            <el-form-item label="报送号码:" prop="submissionNumber">
              <el-input
                type="text"
                :readonly="disabled"
                v-model.trim="ruleForm.submissionNumber"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报送时间:" prop="submissionTime">
              <el-date-picker
                :readonly="disabled"
                v-model.trim="ruleForm.submissionTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
                default-time="12:00:00"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="gutter">
          <el-col :span="24">
            <el-form-item label="报送内容:" prop="submissionContent">
              <el-input
                type="textarea"
                :readonly="disabled"
                resize="none"
                v-model.trim="ruleForm.submissionContent"
                show-word-limit
                :autosize="{ minRows: 4, maxRows: 8 }"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="gutter">
          <el-col :span="2">
            <el-form-item label="上传附件:" prop="submissionUpload">
              <!-- <el-upload
                :disabled="disabled"
                class="upload-demo"
                ref="upload"
                :file-list="uploadFile"
                with-credentials
                accept=".pdf, .jpg, .jpeg, .png, .ppt, .pptx, .doc, .docx, .txt, .xlsx, .xls"
                :action="action"
                :headers="{
                  Authorization: $window.localStorage.getItem('token')
                    ? $window.localStorage.getItem('token')
                    : '',
                }"
                :on-success="onsuccess"
                :on-remove="onremove"
              >
                <el-button slot="trigger" size="small" type="primary"
                  >+</el-button
                >
              </el-upload> -->
              <el-upload
                :disabled="disabled"
                class="upload-demo"
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
                :on-remove="onremove"
                :http-request="httpRequest"
              >
                <el-button slot="trigger" size="small" type="primary"
                  >+</el-button
                >
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Url } from "../../../../assets/js/common";
import axios from 'axios';
export default {
  name: "eventBack",
  components: {},
  data() {
    return {
      root: Url,
      gutter: 24,
      options: [],
      rules: {
        submissionUnits: [
          { required: true, message: "请输入报送单位", trigger: "blur" },
        ],
        submissionPeople: [{ message: "请输入报送人姓名", trigger: "blur" }],
        submissionNumber: [{ message: "请输入报送号码", trigger: "blur" }],
        submissionTime: [
          { required: true, message: "请选择报送时间", trigger: "blur" },
        ],
        submissionContent: [
          { required: true, message: "请输入报送内容", trigger: "blur" },
        ],
      },
      changeRed: -1, //切换颜色
      SelectValue: "", //选择接报单位
      ruleForm: {
        submissionUnits: "",
        submissionTime: "",
        submissionContent: "",
        submissionPeople: "", //报送人
        submissionNumber: "", //报送号码
      },
      eventId: "", //事件ID
      list: [], //列表数据
      restShow: true, //默认显示按钮
      saveShow: false, //默认隐藏按钮
      disabled: true, //input禁用
      continueRow: "", //当前续报ID
      rowData: [], //行数据
      showfileList: false,
      type: "",
      uploadFile: [], //附件初始放数据
      uploadFileData: [], //存后台返回的容器
      fileNameList: [], //附件fileName
      action: window.g.ApiUrl + "/upload/uploadEventDealAttachment",
    };
  },
  mounted() {
    this.getDataList();
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
            url: window.g.FileUrl + '/eos/event/sum/report/upload',
            method: 'post',
            data: params,
            header: {
                Authorization: window.localStorage.getItem('token') ? window.localStorage.getItem('token') : '' // token
            }
        }).then(res => {
            console.log(res)
            if (res.data.errorcode === 0) {
                this.onsuccess(res.data); // 上传成功
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
    getDataList() {
      this.options = [];
      this.eventId = sessionStorage.getItem("newID");
      if (
        this.eventId == "" ||
        this.eventId == null ||
        this.eventId == "newID"
      ) {
        return;
      }
      let _this = this;
      if (_this.eventId == "" || _this.eventId == null) {
        setTimeout(() => {
          _this.eventId = sessionStorage.getItem("newID");
          if (_this.eventId == "" || _this.eventId == null) {
            _this.$message({
              message: "网络延迟，事件加载失败。请重新进入事件接报！",
              type: "warning",
            });
          } else {
            let data = {
              eventId: _this.eventId,
              department: _this.ruleForm.submissionUnits,
            };
            _this.$api.selectEventDealList(data).then((res) => {
              if (res.errorcode == "0") {
                _this.list = res.data;
                let arr = [];
                console.log(res.data, "数据");
                for (let i = 0; i < res.data.length; i++) {
                  arr.push(res.data[i].department);
                }
                for (let i = 0; i < arr.length; i++) {
                  for (let j = i + 1; j < arr.length; j++) {
                    if (arr[i] == arr[j]) {
                      arr.splice(j, 1);
                      j--;
                    }
                  }
                }
                for (let i = 0; i < arr.length; i++) {
                  _this.options.push({ label: arr[i] });
                }
              }
            });
          }
        }, 1500);
      } else {
        let data = {
          eventId: _this.eventId,
          department: _this.ruleForm.submissionUnits,
        };
        _this.$api.selectEventDealList(data).then((res) => {
          if (res.errorcode == "0") {
            _this.list = res.data;
            for (let i in _this.list) {
              let fileArr = _this.list[i].attachments;
              for (let i in fileArr) {
                _this.fileNameList.push(fileArr[i]);
              }
            }
            let arr = [];
            for (let i = 0; i < res.data.length; i++) {
              arr.push(res.data[i].department);
            }
            for (let i = 0; i < arr.length; i++) {
              for (let j = i + 1; j < arr.length; j++) {
                if (arr[i] == arr[j]) {
                  arr.splice(j, 1);
                  j--;
                }
              }
            }
            for (let i = 0; i < arr.length; i++) {
              _this.options.push({ label: arr[i] });
            }
          }
        });
      }
    },
    monitorSelect(val) {
      //监听下拉
      let data = {
        eventId: this.eventId,
        department: val,
      };
      this.$api.selectEventDealList(data).then((res) => {
        if (res.errorcode == "0") {
          this.list = res.data;
        }
      });
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-10-20
     * @description 新增续报
     */
    addReport() {
      //新增续报
      if (
        this.eventId == "" ||
        this.eventId == null ||
        this.eventId == "newID"
      ) {
        this.$message({
          message: "请先保存事件",
          type: "warning",
        });
        return;
      }
      this.restShow = false;
      this.saveShow = true;
      this.disabled = false;
      this.type = "新增";
      let date = new Date(); //年
      let year = date.getFullYear(); //月
      let month = date.getMonth() + 1; //日
      let day = date.getDate(); //时
      let hh = date.getHours(); //分
      let mm = date.getMinutes(); //秒
      let ss = date.getSeconds();
      let rq = year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
      this.ruleForm.submissionTime = rq;
      setTimeout(() => {
        this.$refs.ruleForm.clearValidate(); // 移除表单验证结果 bug7559 date:2020-10-20 author:hexinting
      }, 10);
    },
    updataReport() {
      //修改续报
      if (
        this.eventId == "" ||
        this.eventId == null ||
        this.eventID == "newID"
      ) {
        this.$message({
          message: "请先保存事件",
          type: "warning",
        });
        return;
      }
      if (
        this.continueRow == "" ||
        this.continueRow == null ||
        this.continueRow == []
      ) {
        this.$message({
          message: "请点击表格选择续报进行修改！",
          type: "warning",
        });
        return;
      }
      this.restShow = false;
      this.saveShow = true;
      this.disabled = false;
      this.type = "修改";
      this.ruleForm.submissionUnits = this.rowData.department;
      this.ruleForm.submissionContent = this.rowData.description;
      this.ruleForm.submissionTime = this.rowData.dealTime;
      this.uploadFileData = [...this.rowData.attachments];
      this.ruleForm.submissionPeople = this.rowData.dealName;
      this.ruleForm.submissionNumber = this.rowData.dealPhone;
      this.rowData.attachments.forEach((e) => {
        this.uploadFile.push({ name: e.fileName, path: e.filePath });
      });
    },
    delectReport() {
      //删除续报
      if (
        this.eventId == "" ||
        this.eventId == null ||
        this.eventID == "newID"
      ) {
        this.$message({
          message: "请先保存事件",
          type: "warning",
        });
        return;
      }
      if (
        this.continueRow == "" ||
        this.continueRow == null ||
        this.continueRow == []
      ) {
        this.$message({
          message: "请点击表格选择续报进行删除！",
          type: "warning",
        });
        return;
      }
      this.$confirm("此操作将永久删除该续报, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let data = {
          eventDealId: this.rowData.id,
        };
        this.$api.deleteEventDeal(data).then((res) => {
          if (res.errorcode == "0") {
            this.$message({
              message: "删除成功！",
              type: "success",
            });
            this.callOff();
            this.getDataList();
          } else {
            //this.$message.error(res.msg);
          }
        });
      });
    },
    saveEvent(ruleForm) {
      //保存续报
      if (
        this.eventId == "" ||
        this.eventId == null ||
        this.eventId == "newID"
      ) {
        this.$message({
          message: "请先保存事件",
          type: "warning",
        });
        return;
      }
      let type = this.type;
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          if (type == "新增") {
            let data = {
              data: {
                eventProcessId: this.eventId,
                description: this.ruleForm.submissionContent,
                department: this.ruleForm.submissionUnits,
                dealTime: this.ruleForm.submissionTime,
                attachments: this.uploadFileData,
                dealName: this.ruleForm.submissionPeople, //报送人
                dealPhone: this.ruleForm.submissionNumber, //报送号码
              },
            };
            this.$api.saveEventDeal(data).then((res) => {
              if (res.errorcode == "0") {
                let fileNameData = data.data;
                for (let i in fileNameData) {
                  this.fileNameList.push(fileNameData[i]);
                }
                this.$message({
                  message: "保存续报成功！",
                  type: "success",
                });
                this.callOff();
                this.getDataList();
              } else {
                this.$message.error(res.msg);
              }
            });
            this.$refs.upload.clearFiles();
            return;
          } else if (type == "修改") {
            let updata = {
              data: {
                id: this.rowData.id,
                eventProcessId: this.eventId,
                description: this.ruleForm.submissionContent,
                department: this.ruleForm.submissionUnits,
                dealTime: this.ruleForm.submissionTime,
                attachments: this.uploadFileData,
                dealName: this.ruleForm.submissionPeople, //报送人
                dealPhone: this.ruleForm.submissionNumber, //报送号码
              },
            };
            this.$api.editEventDeal(updata).then((res) => {
              if (res.errorcode == "0") {
                this.$message({
                  message: "更新续报成功！",
                  type: "success",
                });
                this.callOff();
                this.getDataList();
              } else {
                this.$message.error(res.msg);
              }
            });
            return;
          }
        }
      });
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2020-10-20
     * @description 取消续报
     */
    callOff() {
      //取消续报
      this.restShow = true;
      this.saveShow = false;
      this.disabled = true;
      this.changeRed = -1;
      this.continueRow = "";
      this.ruleForm.submissionUnits = "";
      this.ruleForm.submissionContent = "";
      this.ruleForm.submissionTime = "";
      this.ruleForm.submissionPeople = ""; //报送人
      this.ruleForm.submissionNumber = ""; //报送号码

      this.uploadFile = [];
      this.uploadFileData = [];
      this.$refs.ruleForm.clearValidate(); // 移除表单验证结果
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDataList();
    },
    pageMode(val) {
      this.currentPage = val;
      this.getDataList();
    },
    clickUpdate(item, index) {
      //选中当前的续报
      this.continueRow = item.id;
      this.changeRed = index;
      this.rowData = item;
    },
    //移除附件的数据
    onremove(file, fileList) {
      this.uploadFile = fileList;
      this.uploadFileData = this.uploadFileData.filter(
        (e) => file.path !== e.filePath
      );
    },
    //文件上传成功时的钩子
    onsuccess(res) {
      this.uploadFileData.push(res.data); //保存时请求参数
      this.uploadFile.push({
        name: res.data.fileName,
        path: res.data.filePath,
      });
    },
    /**
     * @lastEditor hexinting
     * @lastDate 2021-02-07
     * @description 下载附件
     */
    downloadFile(item) {
      console.log(item)
      let name = item.title;
      // let url = `${Url}/eos/file/getStream?id=${item.id}`; // 从eos后端下载文件
      let url = `${window.g.FileUrl}/eos/event/sum/downloadFile?fileName=${item.fileName}&filePath=${item.filePath}`; // 从文件服务器上传文件 bug10024 要上传到文件服务器，ecs才能访问到文件
      let eleLink = document.createElement("a");
      eleLink.download = name;
      eleLink.href = url;
      eleLink.click();
    },
  },
};
</script>

<style scoped>
.red {
  /*color: white !important;*/
  background-color: white !important;
  border: 1px solid #2d8cf0 !important;
}
.dialogue {
  margin: 0 30px;
  padding: 10px 0;
  border: 1px solid #9da4b3;
  text-align: left;
  text-indent: 10px;
}
.dialogPops {
  border-radius: 5px;
  margin: 5px 10px;
  background-color: #ebeef5;
}
.addButton {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: left;
  text-indent: 20px;
}
.operationPlan {
  text-align: left;
  background-color: white;
}
.contentPlan {
  text-indent: 10px;
  padding: 10px 0 0 0;
}
.contentPlan {
  font-size: 16px;
  font-family: "黑体";
  font-weight: 400;
  color: rgba(96, 98, 102, 1);
}
.upLoadtext {
  position: relative;
  top: 10px;
  width: 100%;
  height: 40px;
}
#plans {
  cursor: pointer;
  border: 1px solid #dbdbdb;
  margin: 10px 0;
  padding: 5px;
  border-radius: 5px;
}
.timePlan {
  font-size: 12px;
}
.contentMain {
  padding: 0 10px;
  height: 230px;
  overflow: auto;
  border: 1px solid #ddd;
  margin: 0 10px;
}
#formSave >>> .el-form-item {
  margin-bottom: 25px;
}
/deep/ .el-upload-list {
  width: 200px;
  height: 77px;
  position: relative;
  right: 22px;
}
</style>
