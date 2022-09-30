<template>
  <sv-dialog
    ref="dialog"
    title="请选择地点"
    @modal="handleClose"
    @cancel="handleClose"
  >
    <div style="min-width: 600px; min-height: 400px; padding: 20px;">
      <Location
        :address="address"
        :lng-lat="[longitude, latitude]"
        :cgcsLngLatInit="[cgcsLongitude, cgcsLatitude]"
        @confirm="handleConfirm"
      />
    </div>
    <template #footer><span /></template>
  </sv-dialog>
</template>

<script>
import Location from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/Location.vue';

export default {
  name: 'LocationDialog',
  components: {
    Location,
  },
  data() {
    return {
      visible: false,
      resolve: null,
      rejcet: null,
      longitude: 0,
      latitude: 0,
      address: '',
      cgcsLatitude: '',
      cgcsLongitude: '',
    };
  },
  methods: {
    open({
      longitude,
      latitude,
      address,
      cgcsLongitude,
      cgcsLatitude,
    }) {
      this.longitude = longitude;
      this.latitude = latitude;
      this.address = address;
      this.cgcsLatitude = cgcsLatitude
      this.cgcsLongitude = cgcsLongitude
      this.$refs.dialog.visible = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    handleClose() {
      this.$refs.dialog.visible = false;
      this.reject();
    },
    handleConfirm(address, lngLat, pointInfo, cgcsLngLat) {
      this.resolve({
        address,
        longitude: lngLat[0],
        latitude: lngLat[1],
        pointInfo,
        cgcsLongitude: cgcsLngLat[0],
        cgcsLatitude: cgcsLngLat[1],
      });
      this.$refs.dialog.visible = false;
    },
  },
};
</script>

<style>

</style>
