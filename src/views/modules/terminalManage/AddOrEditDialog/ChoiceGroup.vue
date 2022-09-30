<template>
  <sv-dialog
    ref="dialog"
    title="选择要更新的分组"
    @cancel="handleCancel"
    @confirm="$refs.submitConfirm.visible = true"
  >
    <div class="group">
      <div class="aoe" v-loading="loading" element-loading-spinner="sv-loading">
        <!-- A. 左边栏 -->
        <div class="aoe__left">
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
  props: {},
  data() {
    return {
      formData_empty: {
        // 所属分组
        groupId: "",
      },
      formData: {},
      formData_add: {},
      // 数据提交中
      loading: false,
    };
  },
  methods: {
    /**
     * @method
     * @desc 初始化数据，打开弹窗
     * @param {String} type 弹窗类型，add新增、edit编辑
     * @param {Object} data 编辑的数据
     */
    init() {
      this.formData = { ...this.formData_add };
      // 显示弹窗
      this.$refs.dialog.visible = true;
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

      this.$emit("choiceGroup", this.formData.groupId);
      this.$refs.dialog.visible = false;
      this.formData = { ...this.formData_empty };
      this.formData_add = { ...this.formData_empty };
    },
    /**
     * @method
     * @desc 提交数据验证
     * @return {Boolean} 提交数据是否通过验证
     */
    submitValidate() {
      let form = this.formData;
      console.log("表单数据", form);
      if (form.groupId == "") {
        this.$refs.submitFail.visible = true;
        this.$refs.submitFail.supplementText = `带星号必填项不能为空！`;
        return false;
      } else {
        return true;
      }
    },

    mounted() {
      this.formData_add = { ...this.formData_empty };
      this.formData = { ...this.formData_empty };
    },
  },
};
</script>

<style lang="scss">
.group {
  .aoe {
    width: 450px;
    display: flex;
    * {
      transition: width 0.5s;
    }
    // 左边栏
    &__left {
      width: 400px;
      min-height: 200px;
      // border-right: 1px solid #DFE2E3;
      color: #555555;
      font-size: 14px;
      // 每一项
      &__item {
        display: flex;
        align-items: center;
        margin: 20px 0;
        // 标签
        &__label {
          text-align: right;
          width: 70px;
          margin: 5px 10px 0 0;
          flex-shrink: 0;
          align-self: flex-start;
        }
        // 内容
        &__content {
          flex-shrink: 0;
          width: 320px;
          margin-right: 24px;
        }
        // 星号
        &.aoe__left__item-required {
          .aoe__left__item__label::before {
            content: "*";
            color: #ff8171;
          }
        }
      }
    }
  }
}
</style>
