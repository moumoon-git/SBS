<!--
 * @Author: your name
 * @Date: 2021-08-18 15:53:57
 * @LastEditTime: 2021-08-18 15:55:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-nanhai\src\views\modules\riskInvestigation\statisticAnalysis\eventInformation\eventType.vue
-->
<template>
  <span class="selectTree">
    <el-select
      multiple
      clearable
      collapse-tags
      v-model="value"
      placeholder="请选择"
      @clear="clear"
      class="hi-input cole selectTree">
      <el-option
        value=""
        style="display: none ">
      </el-option>
       <el-tree
         :check-strictly="true"
         check-on-click-node
         ref="tree"
         :data="data"
         show-checkbox
         node-key="id"
         :props="defaultProps"
         @node-click="handleNodeClick"
         :highlight-current="true"
         @check-change="getEvenTypeData"
       >
    </el-tree>
    </el-select>
  </span>


</template>

<script>
    export default {
        name: "eventType",
        data(){
          return{
            value:[],//下拉选中的值
            sendValue:[],//树选中的
            options:[],//下拉数据
            data: [],//树数据
            defaultProps: {
              children: 'children',
              label: 'name'
            },
            arrid:[],
          }
        },
        mounted(){
          this.$nextTick( () =>{
            this.eventType();
          })
        },
        methods:{
          clear(){
            this.sendValue=[];
            this.arrid=[];
            this.value=[];
            this.$refs.tree.setCheckedKeys([])
          },
          eventType(){
            let data={};
            this.$api.getTree(data).then((res) => {
              if(res.errorcode=='0'){
                this.data=res.data
              }
            })
          },
          handleNodeClick(data, node) {
            console.log(data, node);
          },
          getEvenTypeData(){
            this.arrid=[]
            let res = this.$refs.tree.getCheckedNodes();
            let arr=[], valueName=[]
             for(let i=0;i<res.length;i++){
               let id=res[i].id;
               let name=res[i].name;
               arr.push(name);
               this.arrid.push(id)
               valueName.push({id:id,name:name})
             }
             this.value=arr;
             this.sendValue=valueName;
             this.$emit('getEvenTypeData',this.arrid)
            }

        }
    }
</script>

<style scoped>
  .selectTree{
    /* width: 500px; */
   display: inline-block;
  }
  >>>.el-tag.el-tag--info .el-tag__close{
   display: none;
  }
</style>
