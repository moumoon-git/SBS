<!--@author：yf-->
<template>
    <div style="padding: 0 20px">
      <div class="phone">
        <div class="phoneTop">

        </div>
        <div style="text-align: left">附件:</div>
        <div class="phoneBottom">

        </div>
      </div>
    </div>
</template>

<script>
    export default {
        name: "smallMobilePlatform"
    }
</script>

<style scoped>
  .phone{
    margin: 20px 0;
  }
  .phoneTop,
  .phoneBottom{
    width: 100%;
    min-height:200px;
    border: 1px solid #ddd;
    padding: 10px 0;
  }
</style>
