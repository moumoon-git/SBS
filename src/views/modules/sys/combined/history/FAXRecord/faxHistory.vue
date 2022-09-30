<template>
  <div class="faxHistory">
    <header class="faxHistory__header">
      <fax-header @changeFaxType="changeFaxType"></fax-header>
    </header>

    <div class="faxHistory__body">
      <div class="faxHistory__accept" v-if="currentFaxType == 0">
        <fax-accept></fax-accept>
      </div>
      <div class="faxHistory__send" v-if="currentFaxType == 1">
        <fax-send></fax-send>
      </div>
    </div>
  </div>
</template>

<script>
import faxHeader from "./faxComponents/faxHeader";
import faxSend from "./faxComponents/faxSend";
import faxAccept from "./faxComponents/faxAccept";
export default {
  components: {
    "fax-header": faxHeader,
    "fax-send": faxSend,
    "fax-accept": faxAccept
  },
  data() {
    return {
      currentFaxType: 0, // 接收/发送传真
      recieveFaxes: [], // 接收传真
      sendFaxes: [] // 发送传真
    };
  },
  methods: {
    changeFaxType(e) {
      this.currentFaxType = e;
    }

    // // 根据传真类型查询传真记录
    // searchFaxes(e) {
    //   console.log("查询参数", e);

    //   if(e.status)
    // },

    // // 查询传真记录
    // getRecieveFaxes(){
    //   this.$http({
    //     url: this.$http.adornUrl('faxes/faxesreceive/searchfaxandunit'),
    //     method: "get",
    //     params: this.$http.adornParams({
    //       // token: "PC_27151df5610118f1a41b71bbc5ca975c"
    //     })
    //   })
    // }
  }
};
</script>

<style lang="less">
.faxHistory {
  width: 100%;
  min-height: 760px;
  max-height: 760px;
  background: #fff;
  padding: 0px;

  .faxHistory__header {
    height: 55px;
    border-bottom: 1px solid #ccc;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 98%;
    margin: auto;
    padding-left: 360px;
  }

  .faxHistory__body {
    width: 100%;

    .faxHistory__accept,
    .faxHistory__send {
      width: 100%;
    }
  }
}
</style>
