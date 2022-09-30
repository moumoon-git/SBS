<template>
  <div class="taskManagementInfo">
    <el-row :gutter="20">
      <el-col :span="14" style="border-top:1px solid #E9ECF1;border-right:1px solid #E9ECF1;height:820px;">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" style="margin-top:20px">
          <el-form-item label="任务状态：">
            <ul class="taskStatus">
              <li v-for="(item,index) in status" :key="item.id" class="oneTaskStatus" @click="statusHandle(index,item.id)" :class="{'statusStyle':idx == index}">
                {{item.name}}
              </li>
            </ul>
          </el-form-item>
          <el-form-item label="任务名称：">
            <el-input v-model="form.taskName" style="width:30%"></el-input>
          </el-form-item>
          <!-- <el-form-item label="任务类型：">
        <el-radio-group v-model="taskType">
          <el-radio :label="1">疫情排查</el-radio>
          <el-radio :label="2">其他任务</el-radio>
        </el-radio-group>
          </el-form-item>-->
          <!-- <el-form-item label="其他任务：" v-if="taskType===2 ">
        <el-select v-model="type" placeholder="请选择" style="width:30%">
          <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
          </el-form-item>-->
          <el-form-item label="排查对象：">
            <div class="allCheckContact">
              <el-button @click="addObjectHandle">选择</el-button>
              <ul class="checkContact">
                <li class="oneContact" v-for="item in objectData" :key="item.id">
                  {{item.imName}}&nbsp;
                  <i class="el-icon-close" @click="delIt(item.id)"></i>
                </li>
              </ul>
            </div>
            <!-- 添加排查对象 -->
            <add-object ref="addObjectView" @getSelections="getSelections" :objectData="objectData"></add-object>
          </el-form-item>
          <el-form-item label="任务详情：">
            <el-input
              type="textarea"
              v-model="form.details"
              style="width:30%"
              resize="none"
              rows="8"
            ></el-input>
          </el-form-item>
          <el-form-item label="任务附件:">
            <div class="file_wrap">
              <el-upload
                ref="upload"
                class="upload-demoupload-demo"
                :action="this.$http.adornUrl('/duty/dutyLogOperations/uploadImg')"
                list-type="picture"
                :file-list="fileList"
                :with-credentials="true"
                :on-preview="handlePictureCardPreview"
                :http-request="uploadSectionFile"
                :before-remove="beforeRemove"
              >
                <span size="small" class="uploadBtns">
                  <img src="@/assets/img/upload.png" class="upload" alt />
                </span>
                <!--                   <div slot="tip" class="el-upload__tip">一次只能上传3张jpg/png文件，且不超过500kb</div>-->
              </el-upload>
            </div>

            <!-- <div class="file_wrap" v-if="readonly" style="overflow: auto;display: flex;"> -->
            <!-- <div
              style="display: flex;align-items: center;"
              v-for="(item, index) in fileList"
              @click="_export(item)"
              :key="index"
            >-->
            <!--                      <a :href="item.url" style="display: block;" :download="item.name" >-->

            <!-- <i v-else class="el-icon-document" style="font-size:80px;color: #ccc;"></i> -->
            <!-- <span
                style="display: block;width: 100px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
            >{{item.name}}</span>-->
            <!--                      </a>-->
            <!-- </div> -->
            <!-- </div> -->
          </el-form-item>

          <el-form-item label="任务负责人：">
            <div class="allCheckContact">
              <el-button @click="addContactHandle('getCharge')">选择</el-button>
              <ul class="checkContact">
                <li class="oneContact" v-for="item in receiverId" :key="item.id">
                  {{item.name}}
                  <i class="el-icon-close" @click="delCharge(item.id)"></i>
                </li>
              </ul>
            </div>
            <!-- 添加负责人 -->
            <add-contact ref="AddContactView"></add-contact>
          </el-form-item>

          <el-form-item label="任务参与人：">
            <div class="allCheckContact">
              <el-button @click="addContactHandle('getParticipant')">选择</el-button>
              <ul class="checkContact">
                <li class="oneContact" v-for="item in participantId" :key="item.id">
                  {{item.name}}
                  <i class="el-icon-close" @click="delParticipant(item.id)"></i>
                </li>
              </ul>
            </div>
            <!-- 添加负责人 -->
            <add-contact ref="AddContactView"></add-contact>
          </el-form-item>

          <!-- <el-form-item label="任务周期" v-if="taskType===1">
         <el-radio-group v-model="form.doWay" style="margin-top:7px;">
          <p><el-radio :label="'1'">长期执行</el-radio></p>
          <el-radio :label="'2'" style="margin:10px 10px 10px 0;">定期执行</el-radio>
          <el-date-picker
            v-model="taskTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-if="form.taskCycle===2">
          </el-date-picker>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="任务状态：">
         <el-radio-group v-model="form.status">
            <el-radio :label="'1'">执行中</el-radio>
            <el-radio :label="'2'">已完成</el-radio>
            <el-radio :label="'3'">关闭</el-radio>
        </el-radio-group>
          </el-form-item>-->

          <el-form-item style="text-align:center">
            <el-button>取消</el-button>
            <el-button @click="save">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="10" style="padding:0">
        <div class="taskTab">
          <el-button @click="task='taskManagementTrack'" :class="{'taskStyle':task=='taskManagementTrack'}" class="track">任务跟踪</el-button>
          <el-button @click="task='taskManagementTable'" :class="{'taskStyle':task=='taskManagementTable'}" style="margin-left:0;" class="track">排查对象跟踪表</el-button>
        </div>
        <!-- 任务切换 -->
        <div :is="task" :taskInfo="taskInfo" v-bind="$attrs"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import AddContact from "../addContact/AddContact";
import addObject from "./addObject";
import bus from "@/views/common/js/eventBus";
import taskManagementTrack from "./taskManagement-track";
import taskManagementTable from "./taskManagement-table";

export default {
  name: "taskManagement-info",
  props: {
    taskInfo: {
      type: Object
    },
    page:{
      type: Number,
    }
  },
  data() {
    return {
      form: {
        taskName: "",
        details: "",
        status: "",
        doWay: "",
        taskTime: "",
        documentList: []
      },
      idx: '',//当前状态
      status: [{name:'执行中',id:1}, {name:'已完成',id:2}],
      type: "",
      typeData: [],
      taskType: "",
      receiverId: [],// 负责人
      participantId: [],//参与人
      objectData: [],
      fileList: [],
      rules: {
        taskName: [
          { required: true, trigger: "blur", message: "请输入任务名称" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      task: "taskManagementTrack",
    };
  },
  created() {
    setTimeout(() => {
      // console.log('created-info',this.taskInfo)
      this.initData();
      this.handleTaskType();
    }, 300);
  },
  mounted() {
    // console.log('mounted-info',this.taskInfo)
    // 获取已选负责人
    bus.$off("getCharge");
    bus.$on("getCharge", val => {
      // console.log(val);
      this.receiverId = val
    });
    // 获取已选参与人
    bus.$off("getParticipant");
    bus.$on("getParticipant", val => {
      this.participantId = val
    });
  },
  methods: {
    // 初始化数据
    initData() {
      if (this.taskInfo.taskType) {
        if (this.taskInfo.taskType === 401) {
          // console.log(this.taskInfo.taskType)
          this.taskType = 1;
        } else {
          this.taskType = 2;
          this.type = this.taskInfo.taskType;
          // console.log(this.taskInfo.taskType)
        }
      } else {
        this.taskType = 0;
      }
      this.form.taskName = this.taskInfo.taskName;
      this.form.doWay = this.taskInfo.doWay;
      this.form.details = this.taskInfo.details;
      this.fileList = this.taskInfo.documentList;
      this.form.status = this.taskInfo.status;
      this.idx = this.taskInfo.status;
      this.form.doWay = this.taskInfo.doWay;
      this.form.taskTime = this.taskInfo.taskTime;
      this.receiverId = this.taskInfo.mailContactorList;
      this.participantId = this.taskInfo.responsibleList;
      this.objectData = this.taskInfo.epiRegisterList;

      if (this.taskInfo.documentList) {
        this.taskInfo.documentList.map(v => {
          this.form.documentList.push({ documentName: v.name, url: v.url });
        });
      }
    },
    // 获取任务类型
    handleTaskType() {
      this.$http({
        url: this.$http.adornUrl(
          `/event/eventType/selectTypeByTypeFlagParentNoZero`
        ),
        method: "get",
        params: this.$http.adornParams({ typeFlag: 8 })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.typeData = data.list;
          this.typeData.splice(0, 1);
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    handlePictureCardPreview(file, fileList) {
      this.dialogImageUrl = file.url;
      // console.log(
      //   "this.dialogImageUrl++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
      //   file,
      //   fileList
      // );
    },
    uploadSectionFile(param) {
      let that = this;
      let form = new FormData();
      form.append("file", param.file);
      form.append(
        "incidenPlanId",
        this.saveOrEditData ? this.saveOrEditData.id : ""
      );
      // console.log(param.file, form, that.updataFileList);
      let obj = param.file;
      this.$http({
        url: "http://scg.chinaemt.com/ser/upload/incidentDocument",
        method: "post",
        data: form
      })
        .then(({ data }) => {
          // console.log(
          //   "data++++++++++++++++++++++++++++++++++++++",
          //   data,
          //   this.fileList,
          //   param.file.type
          // );
          //   data.url = this.baseUrl + '/' + data.url;
          //   obj.data = data;
          // obj.url = data.url;
          let typeName = "";
          if (/(image)/g.test(param.file.type)) {
            typeName = "image";
          } else if (/(excel)/g.test(param.file.type)) {
            typeName = "excel";
          } else if (/(word)/g.test(param.file.type)) {
            typeName = "word";
          }
          obj.typeName = typeName;
          if (!obj.name) {
            obj.name = data.fileName;
          }
          // that.updataFileList.push(obj);
          this.form.documentList.push({
            documentName: data.data.name,
            url: data.data.url
          });
          // console.log(that.files);
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {});
    },
    beforeRemove(file, fileList) {
      this.form.documentList = this.form.documentList.filter(v => {
        return v.documentName !== file.name;
      });
      // this.$http({
      //   url: this.$http.adornUrl(`/incidentplan/rpincidentDocument/delete`),
      //   method: "post",
      //   data: this.$http.adornData(
      //     {
      //       id: file.id
      //     },
      //     false
      //   )
      // }).then(({ data }) => {});
    },
    // 添加接收人视图
    addContactHandle(type) {
      this.$refs.AddContactView.getDataList(type,type=='getCharge'?this.receiverId:this.participantId);
    },
    // 添加对象视图
    addObjectHandle() {
      this.$refs.addObjectView.getDataList();
    },
    // 获取对象
    getSelections(obj) {
      // console.log(obj)
      obj.map(v => {
        this.objectData.push(v);
      });
    },
    save() {
      // alert(this.page)
      this.$http({
        url: this.$http.adornUrl(`/task/taskInfor/update`),
        method: "post",
        data: this.$http.adornData({
          id: this.$parent.taskId,
          ...this.form,
          taskType: this.taskType === 1 ? 401 : this.type,
          epiRegisterArray:
            this.objectData.length > 0
              ? this.objectData.map(v => {
                  return +v.id;
                })
              : [],
          responsibleArray:
            this.receiverId.length > 0
              ? this.receiverId.map(v => {
                  return +v.id;
                })
              : [],
          mailContactorArray:
            this.participantId.length > 0
              ? this.participantId.map(v => {
                  return +v.id;
                })
              : [],
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            type: "success",
            message: "保存成功",
            duration: 1500,
            onClose: () => {
              this.$router.push({
                path: "/Linkage/taskManagement/taskManagement",
                query: {
                  page: this.page,
                }
              });
            }
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 刪除排查对象
    delIt(id) {
      this.objectData = this.objectData.filter(v => v.id !== id);
    },
    // 刪除负责人
    delCharge(id) {
      this.receiverId = this.receiverId.filter(v => v.id !== id);
    },
    // 刪除参与人
    delParticipant(id) {
      this.participantId = this.participantId.filter(v => v.id !== id);
    },
    show() {
      this.form.taskName = "";
      this.details = "";
      this.status = "";
      this.receiverId = [];
      this.objectData = [];
      this.fileList = [];
    },
    // 改变状态
    statusHandle(index,id){
      this.idx = index
      this.form.status = id
    }
  },
  components: {
    AddContact,
    addObject,
    taskManagementTrack,
    taskManagementTable,
  }
};
</script>

<style lang="scss" scoped>
.taskManagementInfo {
  // 当前任务状态样式
  .statusStyle{
    background:rgba(63,146,254,1);
    color:rgba(255,255,255,1) !important;
  }
  // 任务跟踪和排查对象跟踪表按钮选中样式
  .active{

  }
  .file_wrap {
    position: relative;
    /*height: 200px;*/
    padding-right: 10px;
    width: 100%;
    /*overflow: auto;*/
  }
  .file_wrap /deep/ .el-upload-list {
    // display: flex;
    // flex-wrap: wrap;
    // height: 102px;
    width: 47%;
    overflow: auto;
    margin-top: 0px;
    border: none;
  }
  .file_wrap /deep/ .el-upload-list > li {
    /*display: none;*/
    flex: 1;
    border: none;
  }
  /deep/ .el-upload-list__item-name {
    margin-right: 0;
  }

  .uploadBtns {
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 3px;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 25px;
    .upload {
      width: 10px;
      height: 10px;
    }
  }
  // 任务状态
  .taskStatus{
    width: 168px;
    padding: 0;
    list-style: none;
    border:1px solid rgba(221,222,225,1);
    border-radius: 3px;
    display: flex;
    text-align: center;
    align-items: center;
    .oneTaskStatus{
      flex: 1;
      color: #999;
      font-size: 12px;
      &:first-child{
        border-radius: 3px 0 0 3px;
      }
       &:last-child{
        border-radius: 0px 3px 3px 0px;
      }
    } 
  }
  .allCheckContact {
    .checkContact {
      padding: 0;
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      margin-right: 5px;
      margin-top: 20px;
      .oneContact {
        padding: 0px 7px 0 4px;
        border: 1px solid #e0e0e0;
        border-radius: 3px;
        margin-right: 10px;
        width: 70px;
        box-sizing: border-box;
        font-size: 12px;
        height: 22px;
        line-height: 21px;
        background: #fafafa;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    .operation {
      width: 30px;
      height: 30px;
      position: relative;
      .addContact {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        line-height: 30px;
        outline: none;
        border: none;
        background-color: #00a9f2;
      }
      .el-icon-plus {
        position: absolute;
        top: 33%;
        left: 20%;
        color: white;
      }
    }
  }
  // 任务跟踪和排查对象跟踪表切换
  .taskTab{
    display: flex;
    margin-bottom: 20px;
    .track,.el-button:focus, .el-button:hover{
      background:rgba(247,248,250,1);
      color: #555;
      font-size: 12px;
      border: none;
      border-top: 2px solid rgba(247,248,250,1);
      border-radius:0;
      flex: 1;
      font-weight: bold;
    }
    .taskStyle{
      background-color: white !important;
      border: none;
      border-top: 2px solid #0091ff !important;
      color: #555 !important;
    }
  }
}
</style>