<template>
<div class="addOrUpdate">
  <el-dialog
    :title="!sysId ? '新增登录页' : '修改登录页'"
    :close-on-click-modal="false"
    :visible.sync="visible" @close="$parent.addOrUpdateVisible=false"
    width="500px"
    center
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px"
    >
      <el-form-item label="登录页名称:" prop="name">
        <el-input v-model="dataForm.name"></el-input>
      </el-form-item>
      <el-form-item label="平台名称:" prop="pname">
        <el-input class="platformTitle" v-model="dataForm.pname"></el-input>
      </el-form-item>
      <el-form-item label="字号:">
        <el-select v-model="dataForm.wordSize">
          <el-option v-for="(item,index) in sizeArr" :label="item" :value="item" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="风格:">
        <el-select v-model="dataForm.style">
          <el-option
            v-for="(item,index) in styleArr"
            :label="item.name"
            :value="item.id"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="颜色:">
        <div class="block">
          <el-color-picker v-model="dataForm.color" @change="handleChangeColor"></el-color-picker>
        </div>
        <!--<colorPicker v-model="dataForm.color" style="z-index:999;width:200px"></colorPicker>-->
      </el-form-item>
      <el-form-item label="背景图片:">
        <el-upload
          class="picture-card"
          action="https://jsonplaceholder.typicode.com/posts/"
          :before-upload="beforeAvatarUpload"
          :show-file-list="false"
        >
          <img v-if="dataForm.background" :src="cloudUrl + dataForm.background" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="描述:">
        <el-input type="textarea" v-model="dataForm.remark" resize="none" rows="6"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      sysId: 0,
      dataForm: {
        name: "",
        pname: "",
        remark: "",
        wordSize: 18,
        background: "",
        color: "#000",
        style: ""
      },
      sizeArr: [18, 20, 22, 26, 28, 36, 48, 56, 72, 96],
      styleArr: [
        { name: "物业小区登录页", id: "1" },
        { name: "校园安全登录页", id: "2" },
        { name: "社会治理登录页", id: "3" }
      ],
      dataRule: {
        name: [
          { required: true, message: "登录页名称不能为空", trigger: "blur" }
        ],
        pname: [
          { required: true, message: "平台名称不能为空", trigger: "blur" }
        ]
      },
      dialogVisible: false,
      cloudUrl: window.SITE_CONFIG.cloudUrl,
    };
  },
  methods: {
    init(id) {
      this.sysId = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.sysId) {
          this.$http({
            url: this.$http.adornUrl(`/sys/sysLoginPage/info/${this.sysId}`),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              // console.log(data)
              this.dataForm.name = data.SysLoginPageEntity.name;
              this.dataForm.pname = data.SysLoginPageEntity.pname;
              this.dataForm.remark = data.SysLoginPageEntity.remark;
              this.dataForm.wordSize = data.SysLoginPageEntity.wordSize;
              this.dataForm.background = data.SysLoginPageEntity.background;
              this.dataForm.color = data.SysLoginPageEntity.color;
              this.dataForm.style = data.SysLoginPageEntity.style;
            } else {
              this.$message.error(data.msg)
            }
          });
        }
      });
    },

    //设置颜色
    handleChangeColor (val) {
      console.log("设置颜色",val)
      this.dataForm.color = val;
      setTimeout(()=>{
        document.querySelector(".platformTitle input").setAttribute("style",`color:${val};`)
      })

    },

    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/sys/sysLoginPage/save`),
            method: "post",
            data: this.$http.adornData({
              id: this.sysId ? this.sysId : 0,
              ...this.dataForm
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === ("image/jpeg" || "image/png");
      // const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 2MB!");
      // }
      // return isJPG && isLt2M;
      let that = this;
      let form = new FormData();
      form.append("file", file);
      this.$http({
        url: '/scgMailContactor/uploadImg',
        baseURL: window.SITE_CONFIG.fileupload,
        method: "post",
        data: form
      })
        .then(({ data }) => {
          if (data && data.errorcode === 0) {
              // console.log(data)
              this.dataForm.background = data.data.url;
          } else {
            this.$message.error(data.msg)
          }
          
        })
        .catch(err => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.addOrUpdate{
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
