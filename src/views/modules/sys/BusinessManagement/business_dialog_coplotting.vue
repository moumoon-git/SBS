<template>
  <div>
    <!-- <sv-dialog
      ref="dialog"
      :title="title"
      @cancel="$refs.dialog.visible = false"
      @modal="$refs.dialog.visible = false"
      @confirm="handleSubmit(title)"
    >
      <MFC
        :module="microModule"
        :data="data"
      />
    </sv-dialog> -->
    <MFC
      module="CoplottingPupop"
      :data="data"
    />
  </div>
</template>

<script>
import MFC from '@/components/MicroFEContainer/MicroFEContainer.vue';

export default {
  name: 'business_dialog_coplotting',
  components: {
    MFC,
  },
  props: {
    data: {
      type: [String, Array, Object, Number, Boolean],
      default: undefined,
    },
  },
  data() {
    return {

    };
  },

  methods: {

  },
};
</script>

<style lang="scss" scoped>

</style>
