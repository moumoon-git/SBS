<template>
  <div class="taskManagement">
    <el-row :gutter="20">
      <div style="display:flex;justify-content:space-between;margin: 10px 20px">
        <p class="thetitle">发布任务</p>
        <el-button @click="$router.push({path: '/Linkage/taskManagement/taskManagement'})"  >返回</el-button>
      </div>
    </el-row>

    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="任务名称：" prop="taskName">
        <el-input v-model="form.taskName" style="width:30%"></el-input>
      </el-form-item>
      <!-- <el-form-item label="任务类型：">
        <el-radio-group v-model="taskType">
          <el-radio :label="1">疫情排查</el-radio>
          <el-radio :label="2">其他任务</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <!-- <el-form-item label="其他任务：" v-if="taskType===2 ">
        <el-select v-model="type" placeholder="请选择" style="width:30%">
          <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="排查对象：" v-if="taskType===1">
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
        <add-object ref="addObjectView" @getSelections="getSelections"></add-object>
      </el-form-item>
      <el-form-item label="任务详情：">
        <el-input type="textarea" v-model="form.details" style="width:30%" resize="none" rows="8"></el-input>
      </el-form-item>
      <el-form-item label="预案文档:">
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
            multiple
          >
            <el-button>选择</el-button>
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
            v-model="form.taskTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-if="form.doWay==='2'">
          </el-date-picker>
        </el-radio-group>
      </el-form-item> -->

      <el-form-item style="text-align: center;">
        <el-button>取消</el-button>
        <el-button @click="onSubmit">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import AddContact from "../addContact/AddContact";
import addObject from "./addObject";
import bus from "@/views/common/js/eventBus";

export default {
  name:'taskManagement-add',
  data() {
    return {
      form: {
        taskName: "",
        details: "",
        doWay: '1',
        documentList: [],
        taskTime: '',
        status: '',
      },
      type: '',
      taskType: 1,
      typeData: [],
      fileList: [],
      objectData: [],
      receiverId: [],//负责人
      participantId: [],//参与人
      rules:{
        taskName:[
          {required: true,trigger: "blur",message: '请输入任务名称'},
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      }
    };
  },
  created(){
    this.handleTaskType()
  },
  mounted() {
    // 获取已选负责人
    bus.$off("getCharge");
    bus.$on("getCharge", val => {
      // alert(val)
      this.receiverId = val;
    });
    // 获取已选参与人
    bus.$off("getParticipant");
    bus.$on("getParticipant", val => {
      // alert(val)
      this.participantId = val;
    });
  },
  methods: {
    // 获取任务类型
    handleTaskType () {
      this.$http({
        url: this.$http.adornUrl(`/event/eventType/selectTypeByTypeFlagParentNoZero`),
        method: 'get',
        params: this.$http.adornParams({ typeFlag: 8})
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.typeData = data.list
          this.typeData.splice(0,1)
        } else {
          this.$message.error(data.code)
        }
      })
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
      // console.log(param, form, that.updataFileList);
      let obj = param.file;
      this.$http({
        url: this.$http.adornUrl(`/upload/incidentDocument`),
        method: "post",
        data: form
      })
        .then(({ data }) => {
          if (data && data.code === 0) {

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
            this.form.documentList.push({ "documentName": data.data.name, "url": data.data.url});
        } else {
          this.$message.error(data.msg)
        }
          // console.log(that.form.documentList);
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {});
    },
    beforeRemove(file, fileList) {
      // alert(file.name)
      this.form.documentList =  this.form.documentList.filter(v=>{ return v.name !== file.name  })
      // console.log(this.form.documentList)
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
    // 添加负责/接收人视图
    addContactHandle(type) {
      this.$refs.AddContactView.getDataList(type,type=='getCharge'?this.receiverId:this.participantId);
    },
    // 添加对象视图
    addObjectHandle(){
      this.$refs.addObjectView.getDataList();
    },
    // 获取对象
    getSelections(obj){
      // console.log(obj)
      this.objectData = obj
    },
    // 保存发布
    onSubmit(){
      this.$http({
        url: this.$http.adornUrl(`/task/taskInfor/save`),
        method: 'post',
        data: this.$http.adornData({
          ...this.form,
          taskType: this.taskType === 1?401:this.type,
          epiRegisterArray: this.objectData.length>0?this.objectData.map(v=> { return +v.id }):[],
          responsibleArray: this.receiverId.length>0?this.receiverId.map(v=> { return +v.id }):[],
          mailContactorArray: this.participantId.length>0?this.participantId.map(v=> { return +v.id }):[],
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            type: 'success',
            message: '发布成功',
            duration:1500,
            onClose:()=>{
              this.$router.push({path:'/Linkage/taskManagement/taskManagement'})
            }
          })
          
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 刪除排查对象
    delIt(id){
      this.objectData = this.objectData.filter(v=> v.id !== id)
    },
    // 刪除负责人
    delCharge(id){
      this.receiverId = this.receiverId.filter(v=> v.id !== id)
    },
    // 刪除参与人
    delParticipant(id){
      this.participantId = this.participantId.filter(v=> v.id !== id)
    }
  },
  components: {
    AddContact,
    addObject
  }
};
</script>

<style lang="scss" scoped>
.taskManagement {
  .thetitle {
    font-weight: bold;
    font-size: 14px;
    color: #333333;
    letter-spacing: 3px;
    &::before{
      content: '';
      display: inline-block;
      width:2px;
      height:13px;
      background:rgba(63,146,254,1);
      margin-right: 10px;
    }
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
      background: #FAFAFA;
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
  /deep/ .el-radio__input.is-checked .el-radio__inner{
    border-color: #1DAAF6;
    background: #1DAAF6;
  }
  /deep/ .el-radio__input.is-checked+.el-radio__label{
    color: #555 !important;
  }
}
</style>
