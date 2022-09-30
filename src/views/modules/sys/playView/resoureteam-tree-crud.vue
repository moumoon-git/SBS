<template>
  <div class="contairdaDada">
    <!-- <img :src="this.$store.htmlUrl" alt="" style="width:200">
    {{this.$store.htmlUrl}}-->
    <!-- <el-button
      type="primary"
      size="small"
      @click="toImage()"
      v-if="isAuth('mail:mailgroup:save')"
    >截图</el-button>-->
    <el-form class="formStyle" ref="form" :model="form" label-width="80px">
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :http-request="uploadSectionFile"
        multiple
      >
        <i class="el-icon-plus"></i>
        <span>请上传图片</span>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="80%" :src="dialogImageUrl" alt />
      </el-dialog>
      <p>过程描述</p>
      <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="form.desc"></el-input>
      <p>通报人员</p>
      <el-input type="textarea" :rows="6" placeholder="请添加人员" v-model="selectInvitedToJoinList[0]"></el-input>
      <el-row>
        <el-button
          icon="el-icon-plus"
          style="background: rgba(255, 255, 255, 1);
                  border: 1px solid rgba(211, 215, 219, 1);
                  border-radius: 2px;
                  font-size: 12px;
                  font-family: MicrosoftYaHei;
                  font-weight: 400;
                  color: rgba(163, 163, 163, 1);
                  margin-top:1vh"
          @click="invitedToJoin()"
        >新增联系人</el-button>
      </el-row>
      <el-row style="text-align:center">
        <el-button
          type="primary"
          size="small"
          v-if="isAuth('mail:mailgroup:save')"
          @click="sumbit"
        >提交</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { treeDataTranslate } from "@/utils";
import bus from "../../../common/js/eventBus";
// import html2canvas from "html2canvas";
export default {
  props: ["selectInvitedToJoinList",'reportParams'],
  data() {
    return {
      //分组弹出的开关
      newgroups: false,
      visible: false,
      type: 0,
      dataForm: {
        id: 0,
        parentId: "",
        name: "",
        platformId: "",
        createUserId: "",
        gmtCreate: "",
        groupingdescription: "",
        modifiedUserId: "",
        gmtModified: "",
        isDeleted: "",
        eventTypeParentId: "",
        eventTypeParentName: "",
        ancestors: ""
      },
      eventTypeList: [], //树的数据
      eventTypeListTreeProps: {
        label: "name",
        children: "children"
      },
      dataRule: {
        eventTypeParentName: [
          { required: true, message: "请选择一个分组", trigger: "blur" }
        ],
        name: [
          { required: true, message: "分组名称不能为空", trigger: "blur" },
          { min: 2, max: 10, message: "长度在2到10字左右", trigger: "blur" }
        ]
      },
      htmlUrl: "",
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  methods: {
    init(id, currenTreeObject, type) {
      var that = this;
      this.dataForm.id = id || 0;
      this.visible = true;
      this.type = type;
    },
    //当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
    gettingfocus(event) {
      this.newgroups = true;
      this.$http({
        url: this.$http.adornUrl("/resoure/resoureteamtype/tree"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.eventTypeParentName = "";
            data.tree.splice(0, 0, { id: 0, name: "顶级分组节点", ancestors: 0 });
            this.eventTypeList = treeDataTranslate(data.tree, "id");
          } else {
            this.$message.error(data.msg)
          }
        })
        .then(() => {
          this.visible = true;
        })
        .then(() => {
          // 新增
          this.dataForm.name = "";
          this.dataForm.gmtCreate = "";
          this.eventTypeListTreeSetCurrentNode();
        });
    },
    //分组树设置当前选中节点
    eventTypeListTreeSetCurrentNode() {
      this.$refs.eventTypeTree.setCurrentKey(this.dataForm.id);
      this.dataForm.eventTypeParentName = (this.$refs.eventTypeTree.getCurrentNode() ||
        {})["name"];
    },
    // 分组树选中
    eventTypeListTreeCurrentChangeHandle(data, node) {
      this.dataForm.parentId = data.id;
      this.dataForm.eventTypeParentId = data.id;
      this.dataForm.eventTypeParentName = data.name;
      if (this.dataForm.parentId === 0) {
        this.dataForm.ancestors = "0";
      } else {
        this.dataForm.ancestors = data.ancestors + "," + data.id;
      }
      // console.log(
      //   "this.dataForm.parentId,this.dataForm.ancestors",
      //   this.dataForm.parentId,
      //   this.dataForm.ancestors
      // );
    },

    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid && (this.type === 2 || this.type === 3)) {
          this.$http({
            url: this.$http.adornUrl(
              `/resoure/resoureteamtype/${this.type === 2 ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              // 'id': this.dataForm.id || undefined,
              parentId: this.dataForm.parentId,
              name: this.dataForm.name,
              // "remark":this.dataForm.gmtCreate,
              ancestors: this.dataForm.ancestors
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false;
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500
              });
              this.$emit("refreshEventTypeDataList");
              this.$emit("close");
            } else {
              this.$message.error("请选择你要新增到的分组节点");
            }
          });
        }
      });
    },
    toImage() {
      bus.$emit("confirmEdit");
    },
    onSubmit() {
      // console.log("submit!");
    },
    toLoad() {
      // alert(111);
      document
        .getElementById("listInput")
        .addEventListener("change", function() {
          var files = this.files;
          var oUL = document.getElementById("divUL");
          oUL.innerHTML = "";
          for (var i = 0; i < files.length; i++) {
            oUL.innerHTML += '<div><img id="img' + i + '" /></div>';
            var imgList = document.getElementById("img" + i);
            imgList.style.height = "100px";
            imgList.style.width = "100px";
            imgList.src = window.URL.createObjectURL(files[i]);
            // console.log(window.URL.createObjectURL(files[i]));
          }
        });
    },
    // 新增联系人
    invitedToJoin() {
      this.$emit("invitedToJoin", true);
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadSectionFile(param) {
      // console.log(this.reportParams.townId)
      // console.log(param)
      let form = new FormData();
      form.append("file", param.file);
      // console.log(param.file);
      this.$http({
        url: this.$http.adornUrl(`/event/eventinfo/saveImages`),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data: form
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.imageUrl = data.filePath;
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => {});
    },
    sumbit(){
      if (this.form.desc === "") {
          this.$message({
            message: "请输入过程描述",
            type: "error",
          });
          return
      }else if(this.selectInvitedToJoinList[0] === ""){
          this.$message({
            message: "请选择联系人",
            type: "error",
          });
          return
      }else{
        this.$http({
           url: this.$http.adornUrl("/event/eventinfo/manuallySendSingle"),
           method: "POST",
           data: this.$http.adornData({
             platformId:this.$store.state.user.platformId,
             platformName:this.$store.state.user.platformName,
             platformMenuId:126,
             openId:this.selectInvitedToJoinList[1],
             imageUrl:this.imageUrl,
             eventDescription:this.form.desc,
             townId:this.reportParams.parentId,
             townName:this.reportParams.parentName,
             longitude:this.reportParams.longitude,
             latitude:this.reportParams.latitude,
             eventPosition:this.reportParams.eventPosition,
           })
         }).then(({ data }) => {
            if (data && data.code === 0) {
               
            } else {
              this.$message.error(data.msg)
            }
         });
      }
    },
  }
};
</script>
<style lang="scss">
.contairdaDada {
  .el-form.formStyle {
    height: 677px;
    width: 24vw;
    border: 1px solid #ccc;
    margin-top: 1vh;
    padding: 1vh 1vw 0;
    box-sizing: border-box;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0 !important;
    }
    & {
      -ms-overflow-style: none;
    }
    & {
      overflow: -moz-scrollbars-none;
    }
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .demonstration {
    display: block;
    color: #8492a6;
    font-size: 14px;
    margin-bottom: 20px;
  }
  .wrapper {
    #divUL {
      div {
        margin: 0.2vh 0.2vw 0.2vh 0;
      }
    }
  }
}
</style>
