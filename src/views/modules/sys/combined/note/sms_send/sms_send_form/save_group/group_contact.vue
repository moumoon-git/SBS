<template>
  <div>
    <p class="addressee">
      收信人
    </p>
    <ul class="list">
      <li v-for="item in value" :key="item.id">
          {{item.name}}
      </li>
      <li v-for="(item,index) in newAddresseeData" :key="index">
          {{item.phone}}
      </li>
    </ul>
    <div class="opearation">
      <el-button type="primary" @click="saveGroup" size="small">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "template_content",
  props:['value','newAddresseeData','phone','userIds'],
  components: {},
  data() {
    return {
      event: "",
    
      id: "",
      phone: '',
      userIds: ''
    };
  },
  watch: {},
  created() {},
  methods: {
    getContent(id,phone,userIds) {
      this.phone = phone
      this.userIds = userIds
      this.id = id;
      console.log(
        "this.templateData+++++++++++++++++++++++++++++",
        this.templateData
      );
    },
    // 保存模板
    saveGroup() {
          this.$emit('close',false)
          this.$http({
            url: this.$http.adornUrl(`/message/messageGroup/saveMessageContactorGroup`),
            method: "POST",
            data: this.$http.adornData({
              messageGroupId: this.id,
              userIds: this.userIds, 
              phone: this.phone
            })
          }).then(({ data }) => {
            if (data && data.code == 0) {
              this.$emit("upData");
              this.$message({
                type: "success",
                message: "保存成功!"
              });
            }else{
              this.$message({
                type: "info",
                message: "保存失败"
              });
            }
          });
    }
  }
};
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
}
.send {
  height: 40px;
  background: rgb(14, 142, 190);
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  padding: 0 10px;
  box-sizing: border-box;
  .title {
    font-size: 16px;
    color: black;
  }
}

.addressee{
  text-align: center;
  font-size: 17px;
  color: black;
  margin: 10px 0;
}
.list{
  list-style: none;
  li{
    padding: 10px 5px;
    background-color: #ddd;
    margin-bottom: 5px;
    color: black;
  }
}

.opearation {
  display: flex;
  justify-content: space-between;
  button {
    padding: 10px 15px;
    position: absolute;
    bottom: -40px;;
  }
}
.el-select-dropdown__item {
  padding: 0 20px !important;
}
</style>
