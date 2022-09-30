<template>
    <div class="SelectContact">
        <p class="title">已选联系人</p>
        <ul class="allName">
          <li class="name" v-for="v in allSelectData" :key="v.id"><span>{{v.name}}</span><i class="el-icon-close" @click="close"></i></li>
        </ul>
    </div>
</template>

<script>
import bus from "@/views/common/js/eventBus";
    export default {
      props:{
        allSelectData:{
          type: Array,
        },
        
      },
      mounted(){
      },
        data() {
            return {
              selectData: []
            }
        },
        watch: {
          allSelectData(newV){
            bus.$emit("getCheckData",this.allSelectData)
          },
        },
        methods: {
           close(){

           }
        },
    }
</script>

<style lang="scss" scoped>
.SelectContact{
  height: 404px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  .title{
        border-bottom: 1px dashed #ccc;
        text-align: center;
        padding: 6px 0;
    }
    .allName{
      list-style: none;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      .name{
        margin: 5px;
        background-color: #f4f4f4;
        border-radius: 3px;
        padding: 2px 5px;
        width: 84px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span{
          width: 60px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
}
</style>