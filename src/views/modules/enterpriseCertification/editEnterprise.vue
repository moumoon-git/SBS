<!--
 * @Author: linhuiting
 * @Date: 2020-11-12 08:47:13
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-05-12 17:02:41
 * @Description: 避难场所添加、修改弹窗
 * @FilePath: \SBS\src\views\modules\contingencyManage\shelterManage\shelterManage-add-or-modify.vue
-->

<template>
  <sv-dialog
    ref="dialog"
    :title="`修改${title}`"
    :close-on-click-modal="false"
    @cancel="handleCancel"
    @confirm="handleSubmit"
    style="top: -115px"
  >
    <div v-loading="loading" element-loading-spinner="sv-loading">
      <!-- A. 左边栏 -->
      <div>
        <div class="aoe__left__item aoe__left__item-required">
          <div class="aoe__left__item__label">{{ enterpriseObj.name }}</div>
          <div class="aoe__left__item__content">
            <sv-input-search
              v-model="enterpriseObj.value"
              :suffix="false"
              placeholder="请输入避难场所名称"
              width="100%"
            />
          </div>
        </div>
        <div class="aoe__left__item" v-for="item in numData">
          <div class="aoe__left__item__label">{{ item.name }}</div>
          <div class="aoe__left__item__content">
            <el-input-number
              v-model="item.value"
              style="width: 100%"
              :min="0"
            />
          </div>
        </div>
      </div>
    </div>
  </sv-dialog>
</template>

<script>
import bus from "@/views/common/js/eventBus";

export default {
  name: "AddOrModifyDialog",
  data() {
    return {
      title: "", // 弹窗标题
      numData: [], // 企业多个数量选择器的标题和值
      // 数据提交中
      loading: false,
      enterpriseObj: {
        name: "",
        value: "",
      }, // 企业标题和值
    };
  },

  methods: {
    /**
     * @description: 初始化数据，打开弹窗
     * @lastUpdateTime : 2021/5/12
     * @lastEditor : xuchuangxing
     * @param {String} type 弹窗类型，add新增、modify编辑
     * @param {Object} data 编辑的数据
     * @return {}
     */
    init(editData) {
      this.title = editData.title;
      this.enterpriseObj = editData.enterpriseObj;
      this.numData = editData.numData;
      this.$nextTick(() => {
        this.$refs.dialog.visible = true;
      });
    },
    /**
     * @description: 关闭弹窗
     * @lastUpdateTime : 2021/5/12
     * @lastEditor : xuchuangxing
     * @param {}
     * @return {}
     */
    handleCancel() {
      this.$refs.dialog.visible = false;
    },
    /**
     * @description: 确认提交
     * @lastUpdateTime : 2021/5/12
     * @lastEditor : xuchuangxing
     * @param {}
     * @return {}
     */
    handleSubmit() {
      // 表单必填项验证
      if (!this.submitValidate()) {
        return;
      }
      this.loading = true;
      let data = { name: this.enterpriseObj.value, num: this.numData };
      this.$emit("submitData", data);
    },
    /**
     * @description: 提交数据验证
     * @lastUpdateTime : 2021/5/12
     * @lastEditor : xuchuangxing
     * @param {}
     * @return {Boolean} 提交数据是否通过验证
     */
    submitValidate() {
      const form = this.dataForm;
      if (this.enterpriseObj.value === "") {
        this.$message.warning("带星号必填项不能为空！");
        return false;
      }
      return true;
    },
  },
};
</script>

<style
  lang="scss"
  src="@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/AddOrEditDialog/AddOrEditDialog.scss"
></style>
