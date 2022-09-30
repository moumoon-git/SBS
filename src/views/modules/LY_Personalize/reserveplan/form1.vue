<template>
  <div id="center">
    <div style="width: 440px;margin: 0px auto;">
      <!--<p class="thetitle">预案版本信息管理</p>-->
      <el-form
        label-width="100px"
        :rules="dataRules"
        :model="dataForm"
        ref="ruleForm"
      >
        <el-form-item
          label="预案名称:"
          style="width: 400px;margin: 0 auto;margin-bottom: 20px;"
          prop="planName"
        >
          <el-input
            v-model="dataForm.planName"
            class="input"
            :disabled="disabled"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="预案版本:"
          style="width: 400px;margin: 0 auto; margin-bottom: 20px;"
          prop="version"

        >
          <el-input v-model="dataForm.version"></el-input>
        </el-form-item>
        <el-form-item
          label="版本内容:"
          style="width: 400px;margin: 0 auto; margin-bottom: 20px;"
        >
          <el-input v-model="dataForm.content"></el-input>
        </el-form-item>
        <el-form-item
          label="事件类型:"
          style="width: 400px;margin: 0 auto; margin-bottom: 20px;"
          prop="eventName"
          required
        >
          <el-input
            v-model="dataForm.eventName"
            @focus="handleOpenEvent"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="启用状态:"
          style="width: 400px;margin: 0 auto;margin-bottom: 20px;"
          prop="state"
        >
          <el-radio-group v-model="dataForm.state">
            <el-radio label="1" value="1">是</el-radio>
            <el-radio label="0" value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="编制单位:"
          style="width: 400px;margin: 0 auto; margin-bottom: 20px;"
          prop="editUnit"
        >
          <el-input v-model="dataForm.editUnit"></el-input>
        </el-form-item>
        <el-form-item
          label="发布单位:"
          style="width: 400px;margin: 0 auto; margin-bottom: 20px;"
          prop="publishUnit"
        >
          <el-input v-model="dataForm.publishUnit"></el-input>
        </el-form-item>
        <el-form-item
          label="发布时间:"
          style="width: 400px;margin: 0 auto; margin-bottom: 20px;"
          prop="publishDate"
        >
          <el-date-picker
            unlink-panels
            v-model="dataForm.publishDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width: 300px;"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="备注:"
          style="width: 400px;margin: 0 auto; margin-bottom: 20px;"
        >
          <el-input v-model="dataForm.remark"></el-input>
        </el-form-item>

        <el-form-item
          label="附件:"
          style="width: 400px;margin: 0 auto; margin-bottom: 20px;"
        >
          <el-upload
            action=""
            :file-list="fileList"
            :http-request="uploadSectionFile"
            :limit="1"
            :on-exceed="handleExceed"
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-change="handleChange"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <el-button @click="handleHTTPfile" size="small" type="primary"
              >点击查看附件</el-button
            >
            <div slot="tip" class="el-upload__tip">
              只能上传pdf,doc格式的文件
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div style="text-align: center; clear: both;">
        <el-button type="primary" @click="submitForm('ruleForm')" size="small"
          >保存</el-button
        >
      </div>
      <GroupSelect
        v-if="showCommonSet"
        ref="commonSet"
        @onSubmit="handleOnSubmit"
      ></GroupSelect>
    </div>
  </div>
</template>

<script>
import GroupSelect from "@/views/common/groupselect";
import { getRules } from "@/utils/rules";
export default {
  components: {
    GroupSelect
  },
  props: [
    "eltreeId",
    "eltreelable",
    "queryid",
    "planname",
    "editionid",
    "dataFormId",
    "dataForm1"

  ],
  name: "organization",
  data() {
    return {
      status: "",
      showCommonSet: false, // 事件类型弹窗
      dataRules: [],
      dataForm: {
        content: "",
        planName: "", //预案名称
        version: "", //预案版本
        eventTypeId: "", //事件类型id
        eventName: "", //事件类型
        // 启动状态的验证  判断是否有一个被选中了
        state: "1", //启动状态
        editUnit: "", //编制单位
        publishUnit: "", //发布单位
        publishDate: "", //发布日期
        remark: "", //备注
        enclosure: "", // 附件路径
        fileName: "" // 附件名称
      },

      show: false,
      File: "",

      fileList: [],
      filePath: "", //文件路径
      filesize: "", //文件大小
      filename: "", //上传文件名称
      fileType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      queryids: this.queryid, //路由传过来的预案ID
      active: 1,
      name: "",
      edition: "",
      //state: '',
      code: "",
      company: "",
      release: "",
      region: "",
      value1: new Date(),
      value2: new Date(),
      remarks: "",
      versionId: "", //预案版本ID
      preplanId: "", //预案ID
      disabled: false,
      root: ""
    };
  },
  created() {
    this.obtain();
    // this.dataForm.state=
    this.dataRules = getRules();
  },
  computed: {
    rpList: {
      get() {
        return this.$store.state.user.rpList;
      }
    }
  },
  mounted() {
    this.status = this.$route.query.status;
    if (this.status == 1) {
    } else if (this.status == 2) {
      for (let prop in this.dataForm) {
        this.dataForm[prop] = "";
      }
      this.$store.commit("user/updateLevelListdel");
      this.dataForm.state = "1";
    } else if (this.status == 3) {
      this.dataForm = {
        ...this.$route.query.data
      };
      this.handleHTTPuit();

      this.dataForm.state = this.$route.query.data.state + "";
      this.dataForm.planId = this.$route.query.data.id;
      if (this.dataForm.fileName) {
        this.fileList.push({
          name: this.dataForm.fileName,
          url: this.dataForm.enclosure
        });
      }
      sessionStorage.setItem("planId", this.$route.query.data.id);

      // 获取警情响应数据
      this.$http({
        url: this.$http.adornUrl(
          `/rp/policeResponse/listByPlanId/${this.dataForm.id}`
        ),
        method: "get"
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$store.commit(
            "user/updateLevelListMore",
            data.rpPoliceResponseList
          );
          // 获取全部数据
          data.rpPoliceResponseList.forEach((item, index) => {
            this.handleHTTPAll(item.id);
          });
        }else{
          this.$message.error(data.msg)
        }
      });
    }
  },
  methods: {
    // 查看word 文档
    handleHTTPfile() {
      let id = {
        planId: this.$route.query.data.id,
        filePath: this.$route.query.data.enclosure,
        fileName: this.$route.query.data.fileName
      };
      let baseUrl = window.SITE_CONFIG.baseUrl;
      let url =
        baseUrl +
        "/rp/plan/viewPlanFile?planId=" +
        id.planId +
        "&filePath=" +
        id.filePath +
        "&fileName=" +
        id.fileName +
        "&" +
        document.cookie;
      window.open(url);
    },
    // 附件列表
    handleChange(file, fileList) {
      // console.log(fileList);

      this.fileList = fileList;
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleRemove(file, fileList) {
      this.dataForm.enclosure = "";
      this.dataForm.fileName = "";
    },
    handleExceed() {
      this.$message.error("只能上传一个附件");
      return false;
    },
    // 自定义文件上传行为
    uploadSectionFile(param) {
      let form = new FormData();
      // console.log("parma////////", param);
      form.append("file", param.file);
      this.$http({
        url: this.$http.adornUrl(`/rp/plan/upload`),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data: form
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm.enclosure = data.filePath;
            this.dataForm.fileName = data.fileName;
          }else{
            this.$message.error(data.msg)
          }
        })
        .catch(err => {});
    },
    // 获取事件类型数据
    handleHTTPuit() {
      this.$http({
        url: this.$http.adornUrl(`/event/eventType/list`),
        method: "get",
        param: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.handlefor(data.data, this.dataForm.eventTypeId, event);
          this.dataForm.eventName = event[0].name;
          }else{
            this.$message.error(data.msg)
          }
        let event = [];
      });
    },

    // 遍历树形 获取相应的数据
    // jsonData 数据
    // destID 目标id
    // json 目标数据
    handlefor(jsonData, destID, json) {
      for (var i = 0; i < jsonData.length; i++) {
        if (jsonData[i].id == destID) {
          json.push(jsonData[i]);
        } else {
          if (
            jsonData[i].hasOwnProperty("children") &&
            jsonData[i].children !== null
          ) {
            this.handlefor(jsonData[i].children, destID, json);
          }
        }
      }
    },
    // 获取全部等级数据
    handleHTTPAll(id) {
      // 获取人员关联数据
      // console.log(id);
      this.$http({
        url: this.$http.adornUrl(
          `/rp/personnelAssociated/selectListByResponseId/${id}`
        ),
        method: "get"
      }).then(({ data }) => {
        if (data && data.code === 0) {
          //  console.log(data);
        // 核实部门id
        let verifyDeptId = data.verifyContactorList.map(
          item => item.verifyDeptId
        );
        // 核实部门页面显示数据
        let verify = Array.from(
          new Set(data.verifyContactorList.map(item => item.deptName))
        ).join("、");
        // console.log(verify);
        // 核实人员id
        let rpVerifyContactorList = data.verifyContactorList.map(
          (item, index) => {
            return {
              // 预案id
              planId: item.planId,
              // 警情响应id
              responseId: item.id,
              // 联系人id
              verifyContactorId: item.verifyContactorId,
              // 核实部门id
              verifyDeptId: item.verifyDeptId
            };
          }
        );
        // 核实人员 显示页面数据
        let verifyContactsShow = data.verifyContactorList
          .map((item, index) => {
            return item.name;
          })
          .join("、");
        let obj = {
          ...data.personnelAssociatedList[0],
          ...data.rpServiceObject[0],
          rpVerifyContactorList,
          verifyContactsShow,
          verifyDeptId,
          verify
        };
        this.$store.commit("user/updataStaffListMore", obj);
        // 获取处置参考数据
        this.$http({
          url: this.$http.adornUrl(
            `/rp/disposalReference/selectReferenceByRespId/${id}`
          ),
          method: "get"
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$store.commit("user/updataReferenceListMore", data.refList);
          }else{
            this.$message.error(data.msg)
          }
        });
        }else{
          this.$message.error(data.msg)
        }
       
      });
    },
    handleOpenEvent() {
      // 事件类型点击事件
      this.showCommonSet = true;
      this.$nextTick(() => {
        this.$refs.commonSet.init(`/event/eventType/list`, "请选择事件类型");
      });
    },
    handleOnSubmit(obj) {
      //选择事件类型后
      // console.log(obj, "选择事件类型后");
      this.dataForm.eventName = obj.name;
      this.dataForm.eventTypeId = obj.id;
      // console.log(this.dataForm.eventTypeId);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.add();
        } else {
          // console.log(valid);

          return false;
        }
      });
    },
    //添加预案信息
    // valid 为 true 时 执行添加逻辑
    add() {
      //如果是再次点击保存
      let planId = sessionStorage.getItem("planId");
      if (planId != null) {
        // console.log(123123);
        this.$http({
          url: this.$http.adornUrl(`/rp/plan/update`),
          method: "post",
          data: this.$http.adornData({ ...this.dataForm })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            // console.log(data);
          }else{
            this.$message.error(data.msg)
          }
        });
        this.$emit("updatePlan", this.dataForm);
      } else {
        // console.log("rpList=====", this.rpList);
        const id = [];
        for (let a of this.rpList.values()) {
          id.push(a.id);
        }
        if (id.length < 1) {
          max_id = 0;
        } else {
          var max_id = Math.max(...id); //最大值
        }
        this.dataForm.id = ++max_id;
        this.$http({
          url: this.$http.adornUrl("/rp/plan/save"),
          method: "post",
          data: this.$http.adornData({
            ...this.dataForm
          })
        }).then(result => {
          if (data && data.code === 0) {
            let id = {
              rpPlanId: result.data.rpPlanId
            };
            this.$emit("addPlan", this.dataForm);
            this.preplanId = result.data.rpPlanId;
            sessionStorage.setItem("planId", result.data.rpPlanId);
          }else{
            this.$message.error(data.msg)
          }
        });
      }
    },

    handleUploadSuccess(response) {
      //上传成功函数
      if (response.msg === "SUCCESS") {
        this.$message({
          message: "上传成功",
          type: "success"
        });
        this.filePath = response.data.filePath;
        this.filesize = response.data.size;
      } else {
        this.$message.error(response.msg);
        this.filename = "";
      }
    },
    onerror() {
      //上传失败函数
      this.$message({
        message: "未知错误，请重新上传！",
        type: "warning"
      });
    },
    handleUpload() {
      if (this.filePath) {
        let data = {
          versionId: this.versionId,
          filePath: this.filePath,
          size: this.filesize,
          type: "prepalnVersion",
          relationId: this.versionId
        };
        getList("/emergency/preparation/preplan/setVersionDocData", data).then(
          res => {
            if (res) {
              this.importPreplan();
              this.$emit("geteditor");
              this.$emit("refreshList");
            }
          }
        );
      } else {
        this.$emit("geteditor");
        this.$emit("refreshList");
      }
    },
    importPreplan() {
      let data = {
        versionId: this.versionId
      };
      getList("/emergency/preparation/preplan/importPreplan", data).then(
        res => {
          if (res) {
          }
        }
      );
    },
    obtain() {
      let condition = localStorage.getItem("AddpreplanId"); //从本地存储获取预案ID和预案版本ID
      if (condition) {
        this.queryids = JSON.parse(condition).preplanId; //获取预案ID
      }
      if (this.editionid) {
        this.name = this.planname;
        this.disabled = true;
      }
      if (this.queryids) {
        let data = {
          id: this.queryids //预案ID
        };
        getList("/emergency/preparation/preplan/getPreplanInfo", data).then(
          res => {
            if (res) {
              this.name = res.name; //预案名称
              this.edition = res.version; //版本号
              this.code = res.code; //编码
              this.company = res.builder; //编制单位
              this.release = res.publishUnit; //发布单位
              this.value1 = res.publishDate; //发布时间
              this.region = res.area; //适用区域
              this.remarks = res.remark;
              this.versionId = res.versionId;
              this.preplanId = res.preplanId;
              // this.filename = res.attach.name+res.attach.extension;
            }
          }
        );
      }
    },
    next() {
      //判断是新增还是修改

      if (this.preplanId) {
        let data = {
          preplanId: this.preplanId, //预案ID
          versionId: this.versionId, //预案版本ID
          name: this.name, //预案名称
          version: this.edition, //版本号
          code: this.code, //编码
          builder: this.company, //编制单位
          publishUnit: this.release, //发布单位
          publishDate: this.value2, //发布时间
          area: this.region, //适用区域
          remark: this.remarks //备注
        };
        let test = {
          data: data
        };
        getList("/emergency/preparation/preplan/updatePreplanInfo", test).then(
          res => {
            if (res) {
              this.versionId = res.versionId;
              let preplanId = {
                preplanId: res.preplanId, // 新增的预案ID
                versionId: res.versionId //新增的预案版本ID
              };
              let AddpreplanId = JSON.stringify(preplanId);
              localStorage.setItem("AddpreplanId", AddpreplanId); //建立新增预案本地存储
              this.handleUpload();
              this.$message({
                message: "修改预案成功",
                type: "success"
              });
            }
          }
        );
      } else if (this.editionid) {
        let data = {
          id: this.editionid, //预案ID
          version: this.edition, //版本号
          code: this.code, //编码
          builder: this.company, //编制单位
          publishUnit: this.release, //发布单位
          publishDate: this.value1, //发布时间
          area: this.region, //适用区域
          remark: this.remarks //备注
        };
        let test = {
          data: data
        };
        getList("/emergency/preparation/preplan/add", test).then(res => {
          if (res) {
            this.versionId = res.versionId;
            let preplanId = {
              preplanId: res.preplanId, // 新增的预案ID
              versionId: res.versionId //新增的预案版本ID
            };
            let AddpreplanId = JSON.stringify(preplanId);
            localStorage.setItem("AddpreplanId", AddpreplanId); //建立新增预案本地存储
            if (this.filePath == "") {
              this.initCatalog(); //调用初始化预案文本目录。在第七步获取目录，没有这一步获取不了目录树
            }

            this.handleUpload();
            this.$message({
              message: "新增版本成功",
              type: "success"
            });
          }
        });
      } else {
        //新增
        let data = {
          name: this.name, //预案名称
          version: this.edition, //版本号
          classId: this.eltreeId, //应急类别ID
          code: this.code, //编码
          builder: this.company, //编制单位
          publishUnit: this.release, //发布单位
          publishDate: this.value1, //发布时间
          area: this.region, //适用区域
          remark: this.remarks //备注
        };
        let test = {
          data: data
        };
        getList("/emergency/preparation/preplan/add", test).then(res => {
          if (res) {
            this.versionId = res.versionId;
            let preplanId = {
              preplanId: res.preplanId, // 新增的预案ID
              versionId: res.versionId //新增的预案版本ID
            };
            let AddpreplanId = JSON.stringify(preplanId);
            localStorage.setItem("AddpreplanId", AddpreplanId); //建立新增预案本地存储
            this.initCatalog(); //调用初始化预案文本目录。在第七步获取目录，没有这一步获取不了目录树
            this.handleUpload();
            this.$message({
              message: "新增预案成功",
              type: "success"
            });
          }
        });
      }
    },
    initCatalog() {
      let condition = localStorage.getItem("AddpreplanId"); //从本地存储获取预案ID和预案版本ID
      this.versionId = JSON.parse(condition).versionId; //获取预
      let data = {
        versionId: this.versionId
      };
      getList("/emergency/preparation/preplan/initCatalog", data).then(res => {
        if (res) {
        }
      });
    }
  }
};
</script>

<style scoped>
.nav li {
  float: left;
}

li {
  list-style: none;
}

#center h1 {
  text-align: center;
  line-height: 50px;
}

.el-scrollbar__wrap {
  overflow-x: hidden;
}

.thetitle {
  text-align: center;
  font-size: 24px;
  margin: 15px auto;
  color: #000;
}

.view .p2 {
  text-align: center;
}
</style>
