<template>
  <el-dialog :visible.sync="visible" width="1000px" center append-to-body :close-on-click-modal="false">
    <div slot="title">定位</div>
    <iframe ref="mapFrame" id="map-frame" frameborder=0 width="100%" height="600px" scrolling=auto :src="`${root}/location.html?type=b`"></iframe>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible : false,
        root:''
      }
    },
    created () {
    	this.root=window.g.ApiMap;
    }
  }
</script>
