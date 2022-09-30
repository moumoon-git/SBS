<template>
  <sv-dialog
    ref="dialog"
    :title="type === 'add' ? '新增视频监控' : '编辑视频监控'"
    @cancel="handleCancel"
    @confirm="$refs.submitConfirm.visible = true"
  >
    <div class="aoe" v-loading="loading" element-loading-spinner="sv-loading">
      <!-- A. 左边栏 -->
      <div class="aoe__left">
        <div class="aoe__left__item aoe__left__item-required">
          <div class="aoe__left__item__label">监控名称</div>
          <div class="aoe__left__item__content">
            <sv-input-search
              v-model="formData.name"
              :suffix="false"
              placeholder="请输入监控名称"
              width="100%"
            />
          </div>
        </div>
        <div class="aoe__left__item aoe__left__item-required">
          <div class="aoe__left__item__label">监控号码</div>
          <div class="aoe__left__item__content">
            <sv-input-search
              v-model="formData.codeNum"
              :suffix="false"
              placeholder="请输入监控号码"
              width="100%"
            />
          </div>
        </div>
        <!-- <div class="aoe__left__item aoe__left__item-required">
          <div class="aoe__left__item__label">所属分组</div>
          <div class="aoe__left__item__content">
            <sv-select-group
              api="/meeting/meetingCameraGroup/listTree"
              v-model="formData.groupId"
              :name="formData.groupIdName"
            />
          </div>
        </div> -->
      </div>
    </div>
    <sv-dialog-hint ref="submitConfirm" type="submit" @confirm="handleSubmit" />
    <sv-dialog-hint ref="submitFail" type="fail" />
  </sv-dialog>
</template>

<script>
export default {
  name: "AddOrEditDialog",
  props: {},
  data() {
    return {
      // 弹窗类型：add or edit
      type: "add",
      // 数据提交中
      loading: false,

      // 左边栏数据
      formData_empty: {
        // 监控名称
        name: "",
        // 监控号码
        cedeNum: "",
        // 所属分组
        groupId: "",
        groupIdName: "",
      },
      formData: {},
      formData_add: {},
    };
  },
  methods: {
    /**
     * @method
     * @desc 初始化数据，打开弹窗
     * @param {String} type 弹窗类型，add新增、edit编辑
     * @param {Object} data 编辑的数据
     */
    init(type, id) {
      this.type = type;
      if (type === "add") {
        this.formData = { ...this.formData_add };
        // 显示弹窗
        this.$refs.dialog.visible = true;
      } else if (type === "edit") {
        // 获取数据详情
        const request = {
          method: "get",
          url: `/meeting/meetingCamera/infor/${id}`,
          baseURL: window.SITE_CONFIG.baseUrl,
          params: {
            token: this.$cookie.get("token"),
          },
        };
        this.$http(request)
          .then((response) => {
            if (response.data.code == 0) {
              this.formData = response.data.MeetingCamera;
              // 显示弹窗
              this.$refs.dialog.visible = true;
            } else {
              console.log(
                "获取id =",
                id,
                "的详情失败！错误信息：【\n",
                response,
                "\n】"
              );
            }
          })
          .catch((error) => {
            console.log(
              "获取id =",
              id,
              "的详情失败！错误信息：【\n",
              error,
              "\n】"
            );
          });
      }
    },
    /**
     * @method
     * @desc 关闭弹窗
     */
    handleCancel() {
      this.$refs.dialog.visible = false;
      // 保存新增页面的编辑内容，清除编辑页面的内容
      this.type === "add"
        ? (this.formData_add = { ...this.formData })
        : (this.formData = { ...this.formData_empty });
    },
    /**
     * @method
     * @desc 确认提交
     */
    handleSubmit() {
      // 表单必填项验证
      if (!this.submitValidate()) {
        return;
      }
      this.loading = true;
      // 新增
      if (this.type === "add") {
        this.formData.groupId = "-200";
        const request = {
          method: "post",
          url: "/meeting/meetingCamera/save",
          baseURL: window.SITE_CONFIG.baseUrl,
          data: this.formData,
        };
        this.$http(request)
          .then((response) => {
            if (response.data.code == 0) {
              this.$emit("refresh");
              // 提交成功后，清空数据
              this.$refs.dialog.visible = false;
              this.formData = { ...this.formData_empty };
              this.formData_add = { ...this.formData_empty };
            } else {
              console.log("新增失败！错误信息：【\n", response, "\n】");
              this.$refs.submitFail.visible = true;
              this.$refs.submitFail.supplementText = `错误代码：${response.data.code}`;
            }
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
            console.log("新增失败！错误信息：【\n", error, "\n】");
            this.$refs.submitFail.visible = true;
            this.$refs.submitFail.supplementText = error;
          });
      }
      // 编辑更新
      else if (this.type === "edit") {
        const request = {
          method: "post",
          url: "/meeting/meetingCamera/update",
          baseURL: window.SITE_CONFIG.baseUrl,
          data: this.formData,
        };
        this.$http(request)
          .then((response) => {
            if (response.data.code == 0) {
              this.$emit("refresh");
              // 提交成功后，清空数据
              this.$refs.dialog.visible = false;
              this.formData = { ...this.formData_empty };
            } else {
              console.log("更新失败！错误信息：【\n", response, "\n】");
              this.$refs.submitFail.visible = true;
              this.$refs.submitFail.supplementText = `错误代码：${response.data.code}`;
            }
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
            console.log("更新失败！错误信息：【\n", error, "\n】");
            this.$refs.submitFail.visible = true;
            this.$refs.submitFail.supplementText = error;
          });
      }
    },
    /**
     * @method
     * @desc 提交数据验证
     * @return {Boolean} 提交数据是否通过验证
     */
    submitValidate() {
      let form = this.formData;
      if (form.name == "" || form.codeNum == "") {
        this.$refs.submitFail.visible = true;
        this.$refs.submitFail.supplementText = `带星号必填项不能为空！`;
        return false;
      } else {
        return true;
      }
    },
  },
  mounted() {
    this.formData_add = { ...this.formData_empty };
    this.formData = { ...this.formData_empty };
  },
};
</script>

<style src="./AddOrEditDialog.scss" lang="scss">