<template>
  <div>
    <div class="SelectContact">
      <p class="title">已选联系人</p>
      <ul class="allName">
        <li class="name" v-for="v in selectData" :key="v.id">
          <span>{{v.name}}</span>
          <i class="el-icon-close" @click="close(v.id)"></i>
        </li>
      </ul>
    </div>

    <div class="opertion">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </div>
</template>

<script>
import bus from "@/views/common/js/eventBus";
export default {
  props: {
    allSelectData: {
      type: Array
    },
    judge: {
      type: String
    },
  },
  mounted() {},
  data() {
    return {
      selectData: []
    };
  },
  created(){
    this.selectData = this.allSelectData
  },
  watch: {
    allSelectData(newV) {
      this.selectData = this.allSelectData
      // console.log('this.allSelectDatathis.allSelectData',this.allSelectData)
      bus.$emit("getCheckData", this.selectData);
    }
  },
  methods: {
    close(id) {
      this.selectData = this.selectData.filter(v=> v.id !== id)
      bus.$emit("getCheckData", this.selectData);
      this.$emit("initContact")//初始化联系人，取消选中
    },
    onSubmit() {
      this.$emit("changeDialog");
      //  console.log(this.allSelectData)
      if (this.judge === '联系人') {
        bus.$emit("getCheckContact", this.selectData);
      }else if(this.judge === '负责人'){
        bus.$emit("getCheckCharge", this.selectData);
      }
    },
    // 取消
    cancel(){
      this.$emit("changeDialog");
    }
  }
};
</script>

<style lang="scss" scoped>
.SelectContact {
  height: 404px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  .title {
    border-bottom: 1px dashed #ccc;
    text-align: center;
    padding: 6px 0;
  }
  .allName {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    .name {
      margin: 5px;
      background-color: #f4f4f4;
      border-radius: 3px;
      padding: 2px 5px;
      width: 84px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        width: 60px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.opertion {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>