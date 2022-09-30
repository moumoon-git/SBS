<template>
    <div class="previewDialog" v-if="dialogShow">
       <div class="imgWrapper">
        <img :src="imgSrc" alt="" class="imgStyle">
        <img src="~@/assets/img/delete.png" alt="" class="deleteIcon" @click="closePicture">
       </div>
    </div>
</template>
<script>
export default {
    name: 'previewPicture',
    data() {
        return {
            dialogShow: this.isShow,
            imgSrc: ''
        }
    },
    props: {
        isShow: {
            type: Boolean,
            required: true
        }
    },
    watch: {
       isShow(newVal,oldVal) {
           this.dialogShow = newVal
       }
    },
    methods: {
        closePicture() {
            this.$emit('closePreview')
        }
    }
}
</script>
<style lang="less" scoped>
.previewDialog {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #000;
     opacity: 80%;
    z-index: 1000000  ;
     display: flex;
      justify-content: center;
      align-items: center;
  .imgWrapper {
      
     
  img.imgStyle {
      width: 500px;
      height: 500px;

  }

  img.deleteIcon {
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100px;

  }
}
}
</style>