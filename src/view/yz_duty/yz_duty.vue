<!--
 * @Author: your name
 * @Date: 2021-08-19 13:46:59
 * @LastEditTime: 2021-08-19 14:29:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-nanhai\src\view\yz_duty\yz_duty.vue
-->
<template>
  <div>
    <dutyRoster></dutyRoster>
  </div>
</template>
<script>
import dutyRoster from "./dutyRoster";
export default {
  data() {
    return {
      username: "",
      password: "",
      patht: "/index",
      num: 1,
    };
  },
  components: {
    dutyRoster:dutyRoster,
  },
};
</script>
<style>
</style>