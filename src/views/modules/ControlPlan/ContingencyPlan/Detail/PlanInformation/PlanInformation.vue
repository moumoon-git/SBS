<!--
 * @Author: Liukanglin
 * @Date: 2021-02-03 09:33:44
 * @LastEditors: Liukanglin
 * @LastEditTime: 2021-03-02 13:26:23
 * @Desc: 预案信息
-->
<template>
  <div :class="PlanInformation.wrapper">
    <div :class="PlanInformation.list">
      <div>预案名称：{{ planData ? (planData.name ? planData.name : '无') : '无' }}</div>
      <div>预案版本：{{ planData ? (planData.version ? planData.version : '无') : '无' }}</div>
      <div>所属分类：{{ planData ? (planData.groupName ? planData.groupName : '无') : '无' }}</div>
      <div>编码：{{ planData ? (planData.code ? planData.code : '无') : '无' }}</div>
      <div>编制单位：{{ planData ? (planData.preparationUnit ? planData.preparationUnit : '无') : '无' }}</div>
      <div>发布单位：{{ planData ? (planData.issued ? planData.issued : '无') : '无' }}</div>
      <div>发布时间：{{ planData ? (planData.issuedTime ? planData.issuedTime : '无') : '无' }}</div>
      <div>适用区域：{{ planData ? (planData.applicableArea ? planData.applicableArea : '无') : '无' }}</div>
      <div>修订时间：{{ planData ? (planData.revisionTime ? planData.revisionTime : '无') : '无' }}</div>
      <div>备注：{{ planData ? (planData.remark ? planData.remark : '无') : '无' }}</div>
    </div>
  </div>
</template>

<script>
import bus from '@/views/common/js/eventBus';

export default {
  data() {
    return {
      // 预案信息
      planData: {},
    };
  },
  mounted() {
    bus.$off('getPlanInformation');
    bus.$on('getPlanInformation', (val) => {
      // 传递接收到的预案信息
      this.planData = val;
    });
  },
  methods: {
  },
};
</script>

<style lang="scss" module="PlanInformation">
.wrapper{
  padding: 20px;
  .list{
    div{
      margin-bottom: 20px;
    }
  }
}
</style>
