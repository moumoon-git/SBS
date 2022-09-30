<template>
  <el-dialog
    title="批量生成"
    :visible.sync="visible"
    width="800px"
    v-dialogDrag
  >
    <div class="form" style="margin: 0 auto;width:100%">
      <el-form label-width="80px">
        <el-form-item>
          <el-button
            icon="el-icon-download "
            type="success"
            @click="downloadtemplate()"
            style="background: #409eff;"
            >导出模板</el-button
          >
        </el-form-item>

        <el-form-item label="平台名称">
          <span @click="selectPlatform">
            <el-input
              v-model="platformObj.platformName"
              :readonly="true"
              placeholder="选择平台"
              style="width: 50%"
            ></el-input>
          </span>
        </el-form-item>

        <el-form-item label="终端类型">
          <el-radio-group v-model="terminal" @change="changeTerminal">
            <el-radio label="0">PC端</el-radio>
            <el-radio label="1">移动端</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="PC端角色" v-if="terminal == '0'">
          <el-select
            v-model="roleId"
            placeholder="请选择"
            @change="selectRoleHandle"
            style="width: 50%"
          >
            <el-option
              v-for="(item, index) in roleList"
              :key="index + 1"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="移动端角色" v-if="terminal == '1'">
          <el-select
            v-model="roleId"
            placeholder="请选择"
            @change="selectRoleHandle"
            style="width: 50%"
          >
            <el-option
              v-for="(item, index) in roleList"
              :key="index + 1"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            :with-credentials="true"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            style="display: inline-flex; margin: 0 10px;background: #409eff;"
          >
            <el-tooltip placement="top" effect="light">
              <div slot="content">
                请填写我们提供
                <br />的模板进行导入
              </div>
              <el-button
                v-loading.fullscreen.lock="fullscreenLoading"
                element-loading-text="正在创建平台用户，可能需要几分钟时间，请耐心等待.."
                icon="el-icon-upload"
                type="success"
                style="background: #409eff;"
                >导入数据</el-button
              >
            </el-tooltip>
          </el-upload>

          <el-button
            v-if="showSuccessDataBtn"
            icon="el-icon-download "
            type="success"
            @click="downloadDatatemplate()"
            style="background: #409eff;"
            >导出数据</el-button
          >
        </el-form-item>
      </el-form>

      <div class="rightTree">
        <batchCreateTree
          :prop="prop"
          ref="rightTree"
          @selectPlatforms="getSelectPlatforms"
          @cancelPlatforms="cancelPlatforms"
        ></batchCreateTree>
      </div>
    </div>
    <!--内层-->
    <GroupSelect
      :modal-append-to-body="false"
      v-if="showSelectPlatform"
      :prop="prop"
      ref="selectPlatformRef"
      @onSubmit="onSubmit"
      @choosePlatform="handleNodeClick"
    />
  </el-dialog>
</template>

<script>
import GroupSelect from "@/views/common/groupselect";
import batchCreateTree from "./batchCreateTree";

export default {
  components: {
    GroupSelect,
    batchCreateTree
  },

  data() {
    return {
      fullscreenLoading: false,
      filename: "",
      //导出时的路径
      exportTemplateUrl:
        window.SITE_CONFIG.baseUrl +
        `/sys/batchCreate/exportTemplate?token=${this.$cookie.get("token")}`,
      inputTemplateUrl: "",

      //平台
      showSelectPlatform: false,
      prop: {
        children: "children",
        label: "platformName"
      },

      platformId: "",
      platformObj: {},
      platformName: "",

      //终端类型
      terminal: "0",

      //角色
      roleList: [],
      roleName: "",
      roleId: "",

      platFormList: [],
      defaultProps: {
        children: "children",
        label: "platformName"
      },

      //导入成功时的数据
      successData: [],
      checkedIds: [],
      showSuccessDataBtn: false,
      visible: false
    };
  },

  mounted() {
    this.getPlatformDataList();
  },

  methods: {
    init() {
      this.visible = true;
    },

    changeTerminal() {
      console.log("terminal", this.terminal);
      this.roleId = "";
      this.roleList = [];
      if (this.platformId == "") {
        return;
      } else {
        this.getRoleList();
      }
    },

    //选择终端用户
    selectPlatform() {
      this.showSelectPlatform = true;
      this.$nextTick(() => {
        setTimeout(() => {
          document
            .querySelector("body > div.v-modal")
            .setAttribute("style", "z-index:999;");
        });
        this.$refs.selectPlatformRef.init(
          "/sys/platform/treeList",
          "请选择终端用户"
        );
      });
    },

    //选择终端用户
    onSubmit(obj) {
      console.log("选择终端用户后", obj);
      this.platformObj = obj;
      this.platformId = obj.id;

      //角色管理
      this.roleId = "";
      this.getRoleList();
    },

    //获取平台
    getPlatformDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/sys/platform/treeList"),
        method: "get"
      }).then(({ data }) => {
        this.platFormList = data.data;
      });
    },

    //根据平台id，获取用户角色
    getRoleList() {
      this.$http({
        url: this.$http.adornUrl(`/sys/role/select/${this.platformId}`),
        method: "get",
        params: this.$http.adornParams({
          terminal: this.terminal
        })
      }).then(({ data }) => {
        if (data && data.code == 0) {
          //角色列表
          console.log("角色列表", data.list);
          this.roleList = [];
          // var role = { roleId: 0, roleName: "系统管理员(拥有所有权限)" };
          // this.roleList.push(role);

          data.list.forEach(item => {
            var roleItem = { roleId: item.roleId, roleName: item.roleName };
            this.roleList.push(roleItem);
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    //点击选择平台
    handleNodeClick(obj) {
      console.log("点击节点", obj);
      this.platformId = obj.id;
      this.platformObj = obj;
      //角色管理
      this.roleId = "";
      this.getRoleList();

      this.$nextTick(() => {
        this.$refs.rightTree.init(
          "/sys/platform/treeList",
          "请选择终端用户",
          this.platformId
        );
      });
    },

    //选择角色
    selectRoleHandle() {
      console.log(this.roleId);
    },

    // 批量用户角色提交
    getSelectPlatforms(data) {
      console.log(data);
      if (data.length === 0 || !this.roleId) {
        this.$message.info('请选择平台和角色！');
        return;
      }
      this.$http({
        url: this.$http.adornUrl(`/sys/batchCreate/sycRoleOtherPaltform`),
        method: "post",
        data: this.$http.adornData({
          platformIdList: data,
          roleId: this.roleId
        })
      }).then(({ data }) => {
        console.log(data);
        if (data && data.code === 0) {
          this.$message({
            type: "success",
            message: "保存成功",
            duration: 1000
          });
          this.cancelPlatforms();
          //仅做刷新
          //this.init(this.initList);
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    cancelPlatforms() {
      this.visible = false;
      this.roleId = '';
      this.platformObj = {};
      this.terminal = '0';
      this.$refs.rightTree.treeData = [];
    },

    // 导入数据
    beforeAvatarUpload(file) {
      if (!this.platformObj.platformName || !this.roleId) {
        this.$message.info('请先选择平台和角色再导入');
        return;
      }
      this.fullscreenLoading = true;

      let form = new FormData();
      form.append("file", file);
      form.append("platformId", this.platformId);
      form.append("roleId", this.roleId);
      form.append("terminal", this.terminal);
      this.$http({
        url: this.$http.adornUrl(`/sys/batchCreate/inputTemplate`),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data: form
      })
        .then(({ data }) => {
          console.log("data", data);

          if (data.code == 0) {
            console.log("data", data);
            console.log("data", data);
            this.fullscreenLoading = false;

            if (data.errorData.length == 0) {
              this.successData = data.successData;
              this.showSuccessDataBtn = true;

              this.$message({
                message: "导入成功!",
                type: "success"
              });
              this.cancelPlatforms();
            } else {
              this.successData = [];
              this.showSuccessDataBtn = false;

              var pplatformName = data.errorData[0].platformName;
              this.$message({
                message: "平台名称为【" + pplatformName + "】重复，导入失败!",
                type: "warning"
              });
            }
          }
        })
        .catch(err => {});
    },

    // 上传成功的回调
    handleAvatarSuccess(response, file, fileList) {
      console.log("导入成功返回", file);
      this.fullscreenLoading = false;
    },

    // 上传失败的回调
    handleError() {
      this.fullscreenLoading = false;
      console.log("上传失败");
    },

    //导出模板
    downloadtemplate() {
      this.$http({
        url: this.$http.adornUrl("/sys/batchCreate/dynamicallyExportTemplate"),
        method: "get"
      }).then(({ data }) => {
        if (data.code == 0) {
          const request = {
            method: 'get',
            baseURL: window.SITE_CONFIG.baseUrl,
            url: '/sys/batchCreate/exportTemplate',
            headers: {
              token: this.$cookie.get('token'),
            },
            responseType: 'arraybuffer',
          };
          this.$http(request).then((response) => {
            if (response.data) {
              const a = document.createElement('a');
              a.target = '_blank';
              a.download = '导出平台模板.xls';
              a.href = window.URL.createObjectURL(new Blob([response.data]));
              a.click();
            }
          });
        } else {
          this.$message.error("导出失败");
        }
      });
    },

    //导出下载的数据
    downloadDatatemplate() {
      if (this.successData.length > 0) {
        this.checkedIds = [];
        this.successData.forEach(item => {
          this.checkedIds.push(item.id);
        });
        this.$http({
          url: this.$http.adornUrl("/sys/batchCreate/xlsOutput"),
          method: "post",
          data: this.$http.adornData(this.checkedIds, false),
          responseType: "blob"
        }).then(({ data }) => {
          let eleLink = document.createElement("a");
          let url = window.URL.createObjectURL(data);
          let name = "平台账号导出.xls";
          eleLink.href = url;
          eleLink.download = name;
          document.body.appendChild(eleLink);
          eleLink.click();
          window.URL.revokeObjectURL(url);
        });
      } else {
        this.$message({
          message: "平台数据为空，请先导入平台数据",
          type: "warning"
        });
      }
    }
  }
};
</script>
<style lang="less">
.batchUser {
  .el-aside {
    width: 80% !important;
    color: #333;
    text-align: center;
    height: calc(100vh - 300px);
    border: 1px solid #ebeef5;
    margin-top: 18px;
    padding-top: 10px;
  }
}

.form {
  display: flex;
  justify-content: space-between;
  .el-form-item__label {
    font-size: 13px !important;
  }
}
</style>
