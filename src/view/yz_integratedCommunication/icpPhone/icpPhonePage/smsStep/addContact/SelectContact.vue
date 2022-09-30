<template>
  <div>
    <div class="SelectContact">
      <p class="title">已选联系人</p>
<!-- 联系人列表添加滚动 -->
    <el-scrollbar>
      <ul class="allName">
        <li class="name" v-for="v in selectData" :key="v.id">
          <span>{{v.name?v.name:v.mobile1}}</span>
          <i class="el-icon-close" @click="close(v.id)"></i>
        </li>
      </ul>
    </el-scrollbar>
<!-- 滚动结束 -->
    </div>

    <div class="num">
      <div>共{{selectData?selectData.length:0}}人</div>
      <span style="color:#0091FF" @click="delAll">全部清空</span>
    </div>

    <div class="opertion">
      <el-button plain size="medium" @click="cancel">取 消</el-button>
      <el-button type="primary" @click="onSubmit" size="medium">确 定</el-button>
    </div>
  </div>
</template>

<script>
import bus from "@/yz_components/common/js/eventBus";
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
    selectData(newV,oldV){
      // console.log('this.selectData: ', oldV);
      // console.log('this.selectData: ', newV);
      this.$forceUpdate()
      console.log("监听selectData变化了",this.selectData)
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
      this.$emit("changeDialog");
      //  console.log(this.allSelectData)
      // if (this.judge === '联系人') {
      //   bus.$emit("getCheckContact", this.allSelectData);
      // }else{
      // this.$emit("getCheckCharge", this.selectData);
      console.log("确定关闭按钮", this.selectData);
      this.selectData=this.selectData.filter((item) =>{
        if (!item.mobile1) {
          this.$message({
            message: item.name+'mobile1电话为空',
            type: "error"
          });
        }
        return item.mobile1!=null
      });
      this.$store.commit("setSelectContact", this.selectData);
      if (this.judge === '选择APP联系人') {
        console.log('选择APP联系人');
        this.$emit('appConfirm', this.selectData);
      }
      bus.$emit(this.judge, this.selectData);

      // }
    },
    cancel(){
      this.$emit("changeDialog");
    },
    delAll(){
      this.selectData = []
      this.$emit("initContact")//初始化联系人，取消选中
      this.$emit("delAll")//取消选中
    }
  }
};
</script>

<style lang="scss" scoped>
.SelectContact {
  height: 455px;
  border: 1px solid #ddd;
  border-bottom: none;
  padding-bottom: 10px;
  .title {
    border-bottom: 1px solid #ddd;
    text-align: left;
    font-size: 12px;
    height: 32px;
    line-height: 32px;
    background: rgba(251, 252, 255, 1);
    margin: 0;
    padding-left: 14px;
  }
  .allName {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    margin: 10px 9px;
    .name {
      margin: 5px;
      border-radius: 3px;
      padding: 2px 5px;
      width: 84px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background:rgba(250,250,250,1);
      border-radius:3px;
      border:1px solid rgba(224,224,224,1);
      span {
        width: 60px;
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
  padding: 7px 20px;
  border:1px solid #DDDDDD;
  color: #999;
}
.opertion {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  .save{
    color: white !important;
    background-color: #0091FF !important;
    border-color: #0091FF !important;
  }
  
}
/deep/ .el-scrollbar__wrap{
      height: 440px;
    }
</style>
