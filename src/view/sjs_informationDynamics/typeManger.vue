<template>
  <div>
    <el-dialog
      title="类型管理"
      :visible.sync="isDialogVisible"
      @close="closeDialog"
      width="700px"
      :close-on-click-modal="false"
    >
      <div style="height: 439px;">
        <!-- <el-scrollbar style="height: 100%;"> -->
        <el-row style="margin-bottom:10px;">
          <el-col :span="24">
            <el-tabs v-model="activeName" type="card" @tab-click="show">
              <el-tab-pane
                :label="item.label"
                :name="item.name"
                v-for="item in typeArray"
                :key="item.id"
                style="border-bottom:#ddd"
              ></el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5" v-show="activeName!='addType'">
            <div
              :style="{padding: '0 10px',backgroundColor:'#F8F8F8',overflow: 'scroll',height:this.typeListHeight+'px'}"
            >
              <div
                v-for="item in typeList"
                :key="item.id"
                style="padding: 10px 0;color:#B3B3B3;"
                :class="{typeClass: typeId == item.id}"
                @click="typeHandle(item.id)"
              >
                <span style="cursor:pointer;">{{item.name}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="activeName!='addType'?19:24" class="right">
            <el-form
              ref="workForm"
              :model="workForm"
              :rules="rules"
              label-position="right"
              label-width="100px"
            >
              <el-row v-show="activeName!='delType'">
                <el-form-item prop="name" label="类型名称">
                  <el-col :span="24">
                    <el-input v-model="workForm.name" placeholder="长度限100字符以内"></el-input>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="初始化标题">
                  <el-col :span="24">
                    <el-input
                      v-model="workForm.title"
                      placeholder="长度限100字符以内"
                      maxlength="100"
                      :disabled="activeName=='delType'"
                    ></el-input>
                  </el-col>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="初始化内容">
                  <!--当数据获取且存在后再渲染标签-->
                  <el-col :span="24">
                    <el-input
                      type="textarea"
                      resize="none"
                      placeholder="长度限10000字符以内"
                      v-model="workForm.content"
                      :rows="activeName!='delType'?6:undefined"
                      :style="{height:  activeName!='delType'?undefined:193 +'px'}"
                      :disabled="activeName=='delType'"
                    ></el-input>
                  </el-col>
                </el-form-item>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
        <!-- </el-scrollbar> -->
      </div>
      <el-row style="padding:13px 20px 12px 0;border-top:1px solid #F1F4F6;text-align:right">
        <el-col :span="24">
          <el-button type="default" @click="closeDialog" size="medium">取消</el-button>
          <el-button
            type="primary"
            @click="submit()"
            size="medium"
          >{{activeName!='delType'?'保存':'删除'}}
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "appDutyPopup",
    data() {
      return {
        title: "", //标题
        workForm: {
          id: "",
          name: "",
          title: "",
          content: ""
        }, //表单数据
        activeName: "addType",
        typeArray: [
          {id: 1, label: "新增类型", name: "addType"},
          {id: 2, label: "编辑类型", name: "editType"},
          {id: 3, label: "删除类型", name: "delType"}
        ],
        typeList: [],
        typeId: "", // 当前类型Id
        typeListHeight: "", // 类型列表高度
        rules: {
          name: [
            {required: true, message: "类型名称不能为空", trigger: "blur"},
            {
              max: 100,
              message: "类型名称不能超过100字"
            }
          ],
          content: [
            {required: true, message: "内容不能为空", trigger: "blur"},
            {
              max: 10000,
              message: "内容不能超过10000字"
            }
          ]
        }, //验证规则
        isDialogVisible: false //是否显示弹窗
      };
    },
    created() {
      this.initTypeData();
    },
    methods: {
      // 初始化类型列表
      async initTypeData() {
        let res = await this.$api.affairsTypeList();
        if (res.errorcode !== 0) {
          this.$message.error(res.msg);
          return;
        }
        this.typeList = res.data;
        this.typeHandle(this.activeName === 'editType' ? this.typeId : res.data[0].id)
      },
      closeDialog() {
        //清空表单内容以及校验信息
        this.$nextTick(() => {
          this.$refs["workForm"].resetFields();
          this.workForm.title = "";
          this.workForm.content = "";
        });
      },
      typeHandle(id) {
        this.typeId = id
        let data = {
          id,
        }
        this.$api.typeDetail(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          for (const key in res.data) {
            if (this.workForm.hasOwnProperty(key)) {
              this.workForm[key] = res.data[key]
            }
          }
        });
      },
      submit() {
        //operate	操作类型 0->新增 1-> 更新 2->删除
        if (this.activeName == "addType") {
          this.addType();
        } else if (this.activeName == "editType") {
          this.editType();
        } else {
          this.delType();
        }
      },
      // 新增类型
      addType() {
        this.$refs.workForm.validate(valid => {
          if (!valid) return;
          let {name, title, content} = this.workForm;
          let data = {
            name,
            title,
            content,
          };
          this.$api.addType(data).then(res => {
            if (res.errorcode != 0) {
              this.$message({
                message: res.msg,
                type: "error"
              });
              return;
            }
            this.$message({
              message: "保存成功!",
              type: "success"
            });
            this.initTypeData()
            this.closeDialog();
          });
        });
      },
      // 编辑类型
      editType() {
        this.$refs.workForm.validate(valid => {
          if (!valid) return;
          let {name, title, content} = this.workForm;
          let data = {
            name,
            title,
            content,
            id: this.typeId,
          };
          this.$api.editType(data).then(res => {
            if (res.errorcode != 0) {
              this.$message({
                message: res.msg,
                type: "error"
              });
              return;
            }
            this.$message({
              message: "保存成功!",
              type: "success"
            });
            this.typeHandle(this.typeId)
          });
        });
      },
      // 删除类型
      delType() {
        let data = {
          id: this.typeId
        };
        this.$api.delType(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.$message({
            message: "删除成功!",
            type: "success"
          });
          this.initTypeData();
        });
      },
      show(obj) {
        if (obj.name != "addType") {
          this.typeListHeight = document.getElementsByClassName(
            "right"
          )[0].offsetHeight;
          if (this.typeList.length > 0) {
            this.typeHandle(this.typeId || this.typeList[0].id)
          }
        } else {
          this.closeDialog()
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  .typeClass {
    color: #0091ff !important;
  }

  /deep/ .el-dialog__header {
    background-color: #f1f4f6;
    border-radius: 5px 5px 0px 0px;
    padding: 10px 0 10px 20px;
    text-align: left;
  }

  /deep/ .el-dialog__title {
    color: #333;
    font-size: 15px;
  }

  /deep/ .el-dialog__headerbtn {
    top: 12px;
    font-size: 20px;
  }

  /deep/ .el-dialog__headerbtn .el-dialog__close {
    color: #adb6c2;
  }

  /deep/ .el-dialog__body {
    padding: 20px 20px 0;
  }

  /deep/ .el-form-item {
    margin-bottom: 15px;
  }

  // tab标签页边框样式
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: 1px solid #ddd;
    border-bottom: none;
  }

  // tab标签页字体样式
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
    color: #999;
  }

  // tab标签页点击后的样式
  /deep/ .el-tabs__item.is-active {
    color: #333 !important;
    background-color: white !important;
  }

  //  文本域样式
  .el-textarea__inner {
    height: 100%;
  }
</style>
