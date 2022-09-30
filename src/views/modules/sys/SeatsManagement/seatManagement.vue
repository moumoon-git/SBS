<template>
  <div class="seats-management">
    <!-- 坐席超管 -->
    <AdminSeatsManagement />
  </div>
</template>
<script>
import AdminSeatsManagement from './components/AdminSeatsManagement';

export default {
  name: 'SeatsManagement',
  components: {
    AdminSeatsManagement,
  },
};
</script>
<style lang="scss">
.seats-management {
  width: 100%;
  height: 100%;
}
</style>
