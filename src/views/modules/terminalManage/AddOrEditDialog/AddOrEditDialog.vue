<template>
  <sv-dialog
    ref="dialog"
    :title="type === 'add' ? '新增会场终端' : '编辑会场终端'"
    @cancel="handleCancel"
    @confirm="$refs.submitConfirm.visible = true"
  >
    <div class="terminal">
      <div
        class="aoe"
        :class="{ 'aoe-fullscreen': isFullscreen }"
        v-loading="loading"
        element-loading-spinner="sv-loading"
      >
        <!-- A. 左边栏 -->
        <div class="aoe__left">
          <div class="aoe__left__item aoe__left__item-required">
            <div class="aoe__left__item__label">终端名称</div>
            <div class="aoe__left__item__content">
              <sv-input-search
                v-model="formData.name"
                :suffix="false"
                placeholder="请输入终端名称"
                width="100%"
              />
            </div>
          </div>
          <div class="aoe__left__item aoe__left__item-required">
            <div class="aoe__left__item__label">终端号码</div>
            <div class="aoe__left__item__content">
              <sv-input-search
                v-model="formData.codeNum"
                :suffix="false"
                placeholder="请输入终端号码"
                width="100%"
              />
            </div>
          </div>
          <div class="aoe__left__item aoe__left__item-required">
            <div class="aoe__left__item__label">所属分组</div>
            <div class="aoe__left__item__content">
              <sv-select-group
                api="/meeting/meetingTerminalGroup/listTree"
                v-model="formData.groupId"
                :name="formData.groupIdName"
              />
            </div>
          </div>
          <div class="aoe__left__item aoe__left__item-required">
            <div class="aoe__left__item__label">地点位置</div>
            <div class="aoe__left__item__content">
              <sv-input-search
                :suffix="false"
                placeholder="请从右侧地图确认位置"
                width="100%"
                :disabled="true"
                v-model="formData.place"
                :clearable="false"
              />
            </div>
          </div>
          <div class="aoe__left__item aoe__left__item">
            <div class="aoe__left__item__label">备注信息</div>
            <div class="aoe__left__item__content">
              <sv-textarea
                v-model="formData.remark"
                :rows="3"
                placeholder="请输入备注信息"
                width="100%"
              />
            </div>
          </div>
        </div>
        <!-- B. 右边栏 -->
        <div class="aoe__right">
          <div class="aoe__right__title">地点位置</div>
          <div
            class="aoe__right__fullscreen"
            @click="isFullscreen = !isFullscreen"
          ></div>
          <Location
            :address="formData.place"
            :lngLat="[formData.longitude, formData.latitude]"
            :cgcsLngLatInit="[formData.cgcsLongitude, formData.cgcsLatitude]"
            @confirm="handleLocationConfirm"
          />
        </div>
      </div>
    </div>
    <sv-dialog-hint ref="submitConfirm" type="submit" @confirm="handleSubmit" />
    <sv-dialog-hint ref="submitFail" type="fail" />
  </sv-dialog>
</template>

<script>
import Location from "../Location/Location.vue";
export default {
  name: "AddOrEditDialog",
  components: {
    Location,
  },
  props: ['currentNode'],
  data() {
    return {
      // 地图是否全屏
      isFullscreen: false,
      // 弹窗类型：add or edit
      type: "add",
      // 数据提交中
      loading: false,
      // 左边栏数据
      formData_empty: {
        // 集群名称
        name: "",
        // 集群位置
        place: "",
        // 集群号码
        codeNum: "",
        // 所属分组
        groupId: "",
        groupIdName: "",
        // 备注信息
        remark: "",
        cgcsLongitude: '',
        cgcsLatitude: '',
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
         if(this.currentNode){

        this.formData.groupId=this.currentNode.id
        this.formData.groupIdName=this.currentNode.name}
        else{
           this.formData.groupId=''
        this.formData.groupIdName=''
        }
        // 显示弹窗
        this.$refs.dialog.visible = true;
      } else if (type === "edit") {
        // 获取数据详情
        const request = {
          method: "get",
          url: `/meeting/meetingTerminal/infor/${id}`,
          baseURL: window.SITE_CONFIG.baseUrl,
          params: {
            token: this.$cookie.get("token"),
          },
        };
        this.$http(request)
          .then((response) => {
            if (response.data.code == 0) {
              this.formData = response.data.MeetingTerminal;
              // console.log("formData", this.formData, response);
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
     * @desc 地图定位确定位置，获取地址和坐标
     */
    handleLocationConfirm(...arg) {
      this.isFullscreen = false;
      this.formData.place = arg[0];
      this.formData.longitude = arg[1][0];
      this.formData.latitude = arg[1][1];
      // 大地坐标系
      this.formData.cgcsLongitude = arg[3][0];
      this.formData.cgcsLatitude = arg[3][1];
      // 强制更新，防止深对象v-model不更新
      this.$forceUpdate();
    },
    /**
     * @method
     * @desc 关闭弹窗
     */
    handleCancel() {
      this.$refs.dialog.visible = false;
      this.isFullscreen = false;
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
      // this.formData.groupId = -200;
      // 新增
      if (this.type === "add") {
        const request = {
          method: "post",
          url: "/meeting/meetingTerminal/save",
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
              this.isFullscreen = false;
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
          url: "/meeting/meetingTerminal/update",
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
              this.isFullscreen = false;
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
      console.log("表单数据", form);
      if (
        form.name == "" ||
        // form.groupId == "" ||
        form.place == "" ||
        form.place == null ||
        form.codeNum == ""
      ) {
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
