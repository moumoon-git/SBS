<template>
  <el-dialog
    :visible.sync="visible"
    width="1000px"
    center
    append-to-body
    :close-on-click-modal="false"
    @close="closeDom"
  >
    <div slot="title">定位</div>
    <iframe
      v-if="rushLocation"
      ref="mapFrame"
      :id="mapframe"
      frameborder="0"
      width="100%"
      height="600px"
      scrolling="auto"
      :src="`${root}/location.html?type=b`"
    ></iframe>
  </el-dialog>
</template>

<script>
export default {
    props: ['mapframe'],
    name: 'loction',
    data() {
        return {
            visible: false,
            root: '',
            rushLocation: true,
        };
    },
    created() {
        this.root = window.g.ApiMap;
    },
    methods: {
        closeDom() {
            this.$emit('closeDom');
        },
    },
};
</script>
