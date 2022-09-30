<template>
  <div class="seeOrUpdata_template">
    <el-dialog
      :title="saveOrEditData?'编辑预案':'添加预案'"
      :visible.sync="dialogFormVisible"
      width="470px"
      center
    >
      <el-form
        ref="form"
        :rules="rules"
        :model="form"
        label-width="97px"
      >
        <el-form-item
          label="预案名称:"
          prop="name"
        >
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item
          label="预案版本:"
          prop="version"
        >
          <el-input v-model="form.version" />
        </el-form-item>
        <el-form-item
          label="所属分类:"
          prop="eventId"
        >
          <!-- <el-select v-model="form.eventId" placeholder="请选择活动区域">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>-->
          <el-cascader clearable v-model="form.eventId" :options="typeOptions"></el-cascader>
        </el-form-item>
        <el-form-item label="编码:">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="编制单位:">
          <el-input v-model="form.preparationUnit" />
        </el-form-item>
        <el-form-item label="发布单位:">
          <el-input v-model="form.issued" />
        </el-form-item>
        <el-form-item label="发布时间:">
          <el-date-picker
            v-model="form.issuedTime"
            :picker-options="getFreeiTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            placeholder="请选择发布时间"
          />
        </el-form-item>
        <el-form-item label="适用区域:">
          <el-input v-model="form.applicableArea" />
        </el-form-item>
        <el-form-item label="修订时间:">
          <el-date-picker
            v-model="form.revisionTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="getFreeReTime"
            type="date"
            placeholder="请选择修订时间"
          />
        </el-form-item>
        <el-form-item label="备注:">
          <el-input type="textarea" rows="4" resize="none" v-model="form.remark"></el-input>
        </el-form-item>

        <el-form-item label="预案文档:">
          <div class="file_wrap" v-if="!readonly">
            <!-- <el-upload
              ref="upload"
              class="upload-demoupload-demo"
              :action="this.$http.adornUrl('/duty/dutyLogOperations/uploadImg')"
              list-type="text"
              :file-list="fileList"
              :with-credentials="true"
              :on-preview="handlePictureCardPreview"
              :http-request="uploadSectionFile"
              :before-remove="beforeRemove"
              :limit="1"
              accept=".doc,.docx,.xls,.xlsx,image/*,.pdf"
            >
              <span size="small" class="uploadBtns">
                <img src="../../../../assets/img/upload.png" class="upload" alt />
              </span>
                                <div slot="tip" class="el-upload__tip">一次只能上传3张jpg/png文件，且不超过500kb</div>
            </el-upload> -->
            <sv-upload v-model="fileList" />
          </div>

          <div class="file_wrap" v-if="readonly" style="overflow: auto;display: flex;">
            <div
              style="display: flex;align-items: center;"
              v-for="(item, index) in fileList"
              @click="_export(item)"
              :key="index"
            >
              <!--                      <a :href="item.url" style="display: block;" :download="item.name" >-->

              <!-- <i v-else class="el-icon-document" style="font-size:80px;color: #ccc;"></i> -->
              <span
                style="display: block;width: 100px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
              >{{item.name}}</span>
              <!--                      </a>-->
            </div>
          </div>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" plain size="small">取 消</el-button>
        <el-button @click="saveOrEditHandle" type="primary" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="delGroupView" width="410px" title="删除分组" center append-to-body>
      <p style="text-align:center;">是否删除该分组?</p>

      <div slot="footer" class="dialog-footer">
        <el-button @click="delGroupView = false" plain size="small">取 消</el-button>
        <el-button type="primary" @click="delGroupHandle" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <sv-dialog-hint ref="submitFail" type="fail" />
  </div>
</template>

<script>
import { treeDataTranslate } from "@/utils";
import bus from "@/views/common/js/eventBus";
import moment from 'moment';
import $ from "jquery";

export default {
  name: "seeOrUpdata_template",
  props: ["groupId"],
  data() {
    return {
     
      dialogFormVisible: false,
      innerDialogVisible: false, //树形模态框
      list: [],
      listProps: {
        children: "children",
        label: "name",
      },

      checkedIds: [], //当前选中的id数组

      checkData: {}, //当前选中树数据

      value: [],
      newAddresseeData: [],
      // 为保存分组提供参数
      phone: "",
      userIds: "",
      mailGroup: [],
      // 验证规则
      rules: {
        name: [
          { required: true, message: '请输入预案名称', trigger: 'blur' },
        ],
        eventId: [
          { required: true, message: '请输入所属分类', trigger: 'blur,change' },
        ],
        version: [
          { required: true, message: '请输入预案版本', trigger: 'blur' },
        ],
      },
      form: {
        choose: '',
        group: '',
        name: '', // 名称
        version: '', // 版本
        eventId: '', // 所属分类id值
        code: '', // 编码
        preparationUnit: '', // 编制单位
        issued: '', // 发布单位
        issuedTime: '', // 发布时间2021-3-11 23:59:59
        applicableArea: '', // 适用区域
        revisionTime: '', // 修订时间2021-3-11 23:59:59
        remark: '', // 备注
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - (24 * 60 * 60 * 1000);
        },
      },
      freeReTime: '',
      form_init: {
        name: '', // 名称
        version: '', // 版本
        eventId: '', // 所属分类id值
        code: '', // 编码
        preparationUnit: '', // 编制单位
        issued: '', // 发布单位
        issuedTime: '', // 发布时间2021-3-11 23:59:59
        applicableArea: '', // 适用区域
        revisionTime: '', // 修订时间2021-3-11 23:59:59
        remark: '', // 备注
      },

      saveOrEditData: null, //判断新增或编辑

      delGroupView: false, //删除分组视图

      readonly: false,
      fileList: [
        // {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
      ],
      files: [],
      updataFileList: [],
      dialogImageUrl: "",
      baseUrl: window.SITE_CONFIG["cloudUrl"],
      typeOptions: [], //事件类型数据
    };
  },
  computed: {
    getFreeReTime() {
      return {
        disabledDate: (time) => {
          if (this.form.issuedTime === '' || this.form.issuedTime === null) {
            return time.getTime() < Date.now() - (24 * 60 * 60 * 1000);
          }
          return time.getTime() < new Date(this.form.issuedTime).getTime();
        },
      }
    },
    getFreeiTime() {
      return {
        disabledDate: (time) => {
          if (this.form.revisionTime === '' || this.form.revisionTime === null) {
            return time.getTime() < Date.now() - (24 * 60 * 60 * 1000);
          }
          return (time.getTime() > new Date(this.form.revisionTime).getTime()) || (time.getTime() < Date.now() - (24 * 60 * 60 * 1000));
        },
      }
    }
  },
  watch: {
    "form.choose"(newV, oldV) {
      if (newV) {
        this.$http({
          url: this.$http.adornUrl("/message/messageGroup/listTree"),
          method: "post",
        }).then(({ data }) => {
          if (data && data.code == 0) {
            // console.log(
            //   "data.data++++++++++++++++++++++++++++++++++++++",
            //   data.data
            // );
            // this.list = treeDataTranslate(data.data, "id");
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
  },
  mounted() {
    bus.$off("getDocument");
    bus.$on("getDocument", (val) => {
      // console.log(val)
      if (val) {
        this.fileList = val;
      } else {
        this.fileList = [];
      }
    });
  },
  methods: {
    getDataList(obj) {
      this.initEmergencyType();
      this.saveOrEditData = obj;
      if (obj) {
        console.log(obj)
        this.form = { ...this.form_init, ...obj }
        this.$forceUpdate();
      } else {
        this.fileList = [];
        // 初始化表单数据
        this.form = { ...this.form_init };
      }

      this.dialogFormVisible = true;

      this.list = this.$root.modifiedUserList;
    },
    /**
     * @description: 添加父级id
     * @param {Arrar} value 传入级联选择器的值
     */
    addParentId(value) {
      value.forEach((val, index) => {
        if (value[index].children) {
          value[index].children.forEach((item) => {
            if (this.form.eventId.length === 1 && item.id === this.form.eventId[0]) {
              this.form.eventId.unshift(item.parentId);
            }
          });
        }
      });
    },
    recursion(list) {
      for (let i = 0; i < list.length; i++) {
        list[i].value = list[i].id;
        list[i].label = list[i].name;
        if (list[i].children) {
          this.recursion(list[i].children);
        }
      }
    },
    // 初始化事件类型
    initEmergencyType() {
      this.typeOptions = [];
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode2tree?code=tufa_type`
        ),
        method: "get",
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        console.log("/sys/sysdictionary/getSysDictionaryListByCode2tree", data);
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          Promise.resolve(this.recursion(data.data)).then(() => {
            this.typeOptions = data.data;
            // 为子id添加父级id
            this.addParentId(this.typeOptions);
            console.log("this.typeOptions", this.typeOptions, data.data);
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error",
          });
        }
      });
    },
    // 点击树形节点事件
    handleNodeClick(obj) {
      this.checkData = obj;
    },
    // 关闭弹窗
    dialog() {
      this.dialogFormVisible = false;
    },
    // 保存树
    saveTree() {
      // console.log(this.checkData);
      this.innerDialogVisible = false;
      if (this.checkData) {
        this.form.group = this.checkData.name;
      }
    },
    // 新增或编辑分组
    saveOrEditHandle() {
      if (!this.saveOrEditData) {
        this.$refs.form.validate((vaild) => {
          if (vaild) {
            // console.log("this.files+++++++++++++++++++++++++++++++++++++++++++++++++",this.files)
            // console.log("this.groudId+++++++++++++++++++++++++++++++++++++++++++++++++",this.groudId)
            this.$http({
              url: this.$http.adornUrl('/incidentplan/rpIncidentPlan/save'),
              method: 'post',
              data: this.$http.adornData({
                name: this.form.name,
                // documentList: this.files,
                documentList: this.fileList,
                eventId: parseInt(this.form.eventId[this.form.eventId.length - 1]),
                remark: this.form.remark,
                version: this.form.version,
                code: this.form.code,
                preparationUnit: this.form.preparationUnit,
                issued: this.form.issued,
                issuedTime: this.form.issuedTime,
                applicableArea: this.form.applicableArea,
                revisionTime: this.form.revisionTime,
                groupId: this.groupId,
              }),
            }).then(({ data }) => {
              // console.log(data)
              if (data && data.code === 0) {
                this.$message({
                  message: '成功新增预案',
                  type: 'success',
                });
                this.dialogFormVisible = false;
                bus.$emit('ContingencyPlanId', this.groupId);
                //   console.log('data.data++++++++++++++++++++++++++++++++++++++',data)
              } else {
                this.$message.error(data.msg);
              }
            });
          }
        });
      } else {
        this.$http({
          url: this.$http.adornUrl("/incidentplan/rpIncidentPlan/update"),
          method: "post",
          data: this.$http.adornData({
            name: this.form.name,
            id: this.saveOrEditData.id,
            documentList: this.fileList,
            eventId: parseInt(this.form.eventId[this.form.eventId.length - 1]),
            remark: this.form.remark,
            version: this.form.version,
            code: this.form.code,
            preparationUnit: this.form.preparationUnit,
            issued: this.form.issued,
            issuedTime: this.form.issuedTime,
            applicableArea: this.form.applicableArea,
            revisionTime: this.form.revisionTime,
            groupId: this.groupId,
          }),
        }).then(({ data }) => {
          // console.log(data)
          if (data && data.code == 0) {
            this.$message({
              message: "成功修改预案",
              type: "success",
            });
            this.dialogFormVisible = false;
            bus.$emit("ContingencyPlanId", this.groupId);
            //   console.log('data.data++++++++++++++++++++++++++++++++++++++',data)
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    // 删除分组
    delView(currentTreeId) {
      this.delGroupView = true;
      this.currentTreeId = currentTreeId;
    },
    delGroupHandle() {
      this.$http({
        url: this.$http.adornUrl(`/incidentplan/rpIncidentPlan/delete`),
        method: "post",
        data: this.$http.adornData(
          {
            ids: [this.currentTreeId.toString()],
          },
          false
        ),
      }).then(({ data }) => {
        if (data && data.code == 0) {
          this.$emit("refreshData");
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.delGroupView = false;
          bus.$emit("ContingencyPlanId", this.groupId);
        } else {
          this.$message({
            type: "info",
            message: "删除失败",
          });
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
        url: this.$http.adornUrl(`/upload/incidentDocument`),
        method: "post",
        data: form,
      })
        .then(({ data }) => {
          obj.url = data.url;
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
          that.updataFileList.push(obj);
          /**
           * @author tanjinfeng
           * @desc BUG修复：多次上传文件时，前面上传的内容没有清空，导致后台永远取第一个文件
           * @date 2020-11-05
           */
          // *****原来的代码
          // this.files.push({ name: data.data.name, url: data.data.url });
          // *****修改的代码
          this.files = [{ name: data.data.name, url: data.data.url }];
          // *****结束
          // console.log(that.files);
        })
        // eslint-disable-next-line handle-callback-err
        .catch((err) => {});
    },
    beforeRemove(file, fileList) {
      this.$http({
        url: this.$http.adornUrl(`/incidentplan/rpincidentDocument/delete`),
        method: "post",
        data: this.$http.adornData(
          {
            id: file.id,
          },
          false
        ),
      }).then(({ data }) => {
        if (data && data.code == 0) {
        } else {
          this.$message.error(data.msg);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
p {
  margin: 0;
}
.name {
  outline: none;
  border-radius: 3px;
  border: 1px solid #ccc;
  width: 65%;
}
/deep/ .el-dialog {
  border-radius: 8px;
  .el-dialog__header {
    background-color: #00a9f2 !important;
    padding: 10px 0;
    border-radius: 8px 8px 0 0;
    text-align: center !important;
    .el-dialog__headerbtn {
      top: 12px;
      .el-dialog__close {
        color: #d1f9fb;
      }
    }
    span {
      color: #d1f9fb;
    }
  }
  .el-dialog__body {
    // padding: 15px 0;
    padding: 10px 18px 0px;
  }
  /deep/.el-button--primary {
    background-color: #00a9f2;
    border: 1px solid #00a9f2;
  }
}
  // 所属分类
  /deep/ .el-cascader .el-input .el-input__inner{
    width: 323px;
  }
  // 发布/修订时间
  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 323px;
  }

.adjunct {
  position: relative;
  padding-left: 8px;
}
.adjunct:before {
  content: "";
  width: 5px;
  height: 18px;
  background: #409eff;
  position: absolute;
  left: 0;
}
.file_wrap {
  position: relative;
  /*height: 200px;*/
  padding-right: 10px;
  width: 100%;
  /*overflow: auto;*/
}
.file_wrap /deep/ .el-upload-list {
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  height: 102px;
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
//   .uploadBtns:focus,.uploadBtns:hover{
//     border-color: transparent !important;
//     background-color:transparent !important;
//   }
//   .uploadBtns:active{
//     border-color: transparent !important;
//     background-color:transparent !important;
//   }
</style>
