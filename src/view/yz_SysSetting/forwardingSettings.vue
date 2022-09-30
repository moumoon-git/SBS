<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="指定转发至" name="first">
      <specify-forwarding-to></specify-forwarding-to>
    </el-tab-pane>
    <el-tab-pane label="全部转发至" name="second">
      <forward-all-to></forward-all-to>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import SpecifyForwardingTo from "@/view/yz_SysSetting/specifyForwardingTo";
  import ForwardAllTo from "@/view/yz_SysSetting/forwardAllTo";

  export default {
    name: "forwardingSettings",
    components: {ForwardAllTo, SpecifyForwardingTo},
    data() {
      return {
        activeName: "first"
      }
    },
    methods: {
      handleClick() {

      }
    }
  }
</script>

<style scoped>

</style>
