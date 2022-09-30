<template>
  <div class="my-table-box-btn" style="display: flex;">
     <el-button type="primary" :icon="item.icon" :disabled="item.disabled"  v-for="(item,index) in btnArry" @click="myEvent(item)" :key="index">{{item.title}}</el-button>
     <batch-join-button
      ref="BatchJoinButton"
      v-if="batchJoinIsShow"
      @refreshData="refreshData"
      @handleBatchJoin="handleBatchJoin"
      style="margin:0px;float:none;display:inline-block;heigth:40px;margin-left:10px;"
      :groupType="groupType"
      :pId="pId"></batch-join-button>
  </div>
</template>

<script>
import BatchJoinButton from "@/components/button/batchJoinButton";
export default {
     components: {
        BatchJoinButton
      },
    props:{
        btnArry:{
            type:Array,
            default:()=>{
              return[]
            },
        },
        batchJoinIsShow:false
    },
  data() {
    return {
        groupType:"",//分组类型
        pId:""//分组id
    };
  },
  methods: {
    
    myEvent(item){
            const { event: model} = item;
             let handler = this.$attrs[model]
            if (typeof handler === 'object') {
                handler = handler.callback
            }
            const defHandler = () => {
                console.warn(`父组件没有传与该操作对应的回调函数！对应this.$attrs键名是：${model}`)
            }
            handler = handler || defHandler
            let options = { model }
            handler(options)
    },
    //批量加入方法
    handleBatchJoin() {
      this.$emit('handleBatchJoin')
    },
    refreshData(){
      this.$emit("refreshData");
      this.$emit("refreshTableData");
      this.$emit("success");
    }
  }
};
</script>

<style scoped>
.my-table-box-btn{
  margin: 10px;
}

</style>
