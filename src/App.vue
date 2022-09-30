<!--
 * @Author: yaoweixin 
 * @Date: 2020-12-21 10:43:48   
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-12-21 11:40:23
 * @Description: file content
 * @FilePath: \SBS\src\App.vue

 
-->
<template>
  <transition name="fade">
    <router-view v-if="isRouterAlive"></router-view>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      isRouterAlive:  true
    };
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  created() {
    const title = localStorage.getItem('tabTitle');
    if (title) {
      document.title = title;
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    }
  }
};
</script>
