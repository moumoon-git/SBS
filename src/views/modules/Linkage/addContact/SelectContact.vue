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

    <div class="num">
      <div style="color:#999">共{{selectData?selectData.length:0}}人</div>
      <span style="color:#0091FF" @click="delAll">全部清空</span>
    </div>

    <div class="opertion">
      <el-button @click="cancel">取 消</el-button>
      <el-button @click="onSubmit">确 定</el-button>
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
      // bus.$emit("getCheckData", this.selectData);
    },
    selectData(){
      bus.$emit("getCheckData", this.selectData);
    }
  },
  methods: {
    close(id) {
      this.selectData = this.selectData.filter(v=> v.id !== id)
      bus.$emit("getCheckData", this.selectData);
      this.$emit("initContact")//初始化联系人，取消选中
      this.$emit("delIt",id)//取消选中
    },
    onSubmit() {
      //  console.log(this.allSelectData)
      // if (this.judge === '联系人') {
        //   bus.$emit("getCheckContact", this.allSelectData);
      // }else{
        if (this.judge == 'getCharge' && this.selectData.length>1) {
          this.$message.warning('只能选择一个负责人')
          return
        }
        this.$emit("changeDialog",1);
        bus.$emit(this.judge, this.selectData);
      // }
    },
    // 取消
    cancel(){
      this.$emit("changeDialog",2);
    },
    delAll(){
      this.selectData = []
      this.$emit("changeDialog",2);
      bus.$emit(this.judge, this.selectData);
    }
  }
};
</script>

<style lang="scss" scoped>
p{
  margin: 0;
}
.SelectContact {
  height: 308px;
  border: 1px solid #ddd;
  border-bottom: none;
  .title {
    border-bottom: 1px solid #ddd;
    font-size: 12px;
    height: 32px;
    line-height: 32px;
    background:rgba(251,252,255,1);
    padding-left: 14px;
  }
  .allName {
    padding: 10px 0px 10px 10px;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    // height: 270px;
    overflow: auto;
    &::-webkit-scrollbar{
      width: 0;
      height: 0 !important;
    }
    .name {
      width:75px;
      height:22px;
      line-height: 22px;
      font-size: 12px;
      color: #555;
      padding: 0 10px;
      box-sizing: border-box;
      margin: 5px 12px 5px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background:rgba(250,250,250,1);
      border-radius:3px;
      border:1px solid rgba(224,224,224,1);
      span {
        width: 41px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.num{
  display: flex;
  justify-content: space-between;
  padding: 0 10px 0 14px;
  border:1px solid #DDDDDD;
  font-size: 12px;
  height: 32px;
  line-height: 32px;
  
}
.opertion {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>