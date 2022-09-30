<!--
 * @Author: yanghaohao
 * @Date: 2021-02-03 15:06:23
 * @LastEditTime: 2021-03-09 13:21:08
 * @LastEditors: Please set LastEditors
 * @Description: 查看应急专家
 * @FilePath: /SBS/src/views/modules/EmergencyManagement/ViewContent.vue
-->

<template>
  <div :class="$style.expert">
    <sv-dialog
      ref="dialog"
      title="查看装备详情"
      @cancel="$refs.dialog.visible = false"
      @confirm="$refs.dialog.visible = false"
    >
      <el-form
        label-width="100px"
        :class="$style.ruleForm"
      >
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="装备名称:"
              prop="name"
            >
              {{ equipmentData.name }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="装备类别:"
              prop="className"
            >
              {{ equipmentData.className }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="装备仓库:"
              prop="groupName"
            >
              {{ equipmentData.groupName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="规格型号:"
              prop="specification"
            >
              {{ equipmentData.specification }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="装备数量:"
              prop="number"
            >
              {{ equipmentData.number }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="应急类别:"
              prop="caseClassName"
            >
              {{ equipmentData.caseClassName }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="有效期:"
              prop="quaguaPeriod"
            >
              {{ equipmentData.quaguaPeriod }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="需要更换时间:"
              prop="renewTime"
            >
              {{ equipmentData.renewTime }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="当前占用状态:"
              prop="nowStatus"
            >
              {{ statusText[equipmentData.nowStatus] }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="主要性能参数:"
              prop="status"
            >
              {{ equipmentData.capabilityParam }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item
              label="负责人:"
            >
              {{ equipmentData.mailContactorEntity ? equipmentData.mailContactorEntity.name : '' }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="装备图片:"
              prop="picPath"
            >
              <el-image
                v-if="equipmentData.picPath"
                style="width: 100px; height: 100px"
                :src="cloudUrl + equipmentData.picPath"
                :fit="fit"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col>
            <el-form-item
              label="备注:"
              prop="remark"
            >
              {{ equipmentData.remark }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </sv-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cloudUrl: window.SITE_CONFIG.cloudUrl,
      equipmentData: [], // 专家树
      statusText: {
        0: '正常',
        1: '损坏待维修',
        2: '报废',
      },
    };
  },
  methods: {
    /**
     * @description: 初始化弹窗
     */
    init(id) {
      this.$refs.dialog.visible = true;
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/ser/resoure/resoureequipment/info/${id}`,
        method: 'get',
        params: this.$http.adornParams(),
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.equipmentData = data.resoureEquipment;
          } else {
            this.$message.error(data.msg);
          }
        });
    },
  },
};
</script>
<style lang="scss" module>
.expert {
  .ruleForm {
    padding: 20px 20px 0 10px;
    width: 800px;
  }
}
</style>
