<template>
  <div style="margin-top:7px;">
    <el-row :gutter="20">
      <el-col :span="16">
        <contact />
      </el-col>
      <el-col :span="8">
        <contact-record-content />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import contact from './contact';
import ContactRecordContent from './ContactRecord-content';

export default {
  components: {
    contact,
    ContactRecordContent,
  },
};
</script>

<style lang="scss" scoped>
</style>
