<template>
  <div class="seats-management">
    <!-- 坐席平台 -->
    <PlatformSeatsManagement />
  </div>
</template>
<script>
import PlatformSeatsManagement from './components/PlatformSeatsManagement';

export default {
  name: 'SeatsManagement',
  components: {
    PlatformSeatsManagement,
  },
};
</script>
<style lang="scss">
.seats-management {
  width: 100%;
  height: 100%;
}
</style>
