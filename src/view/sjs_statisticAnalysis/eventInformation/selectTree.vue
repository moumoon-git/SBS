<!--
 * @Author: your name
 * @Date: 2021-08-18 15:54:33
 * @LastEditTime: 2021-08-18 18:01:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-nanhai\src\views\modules\riskInvestigation\statisticAnalysis\eventInformation\selectTree.vue
-->
<template>
  <span class="selectTree">
    <el-select
      multiple
      clearable
      collapse-tags
      v-model="value"
      @clear="clear"
      placeholder="请选择"
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
         @check-change="getChecked"
       >
    </el-tree>
    </el-select>

  </span>
</template>

<script>
  export default {
    name: "selectTree",
    data(){
      return{
        value:[],
        sendValue:[],
        options:[],
        data: [],
        defaultProps: {
          children: 'children',
          label: 'townName'
        },
        arrid:[]
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
        this.$api.topTree(data).then((res) => {
          if(res.errorcode=='0'){
            this.data=res.list;
            console.log(res.list,"this.data")
          }
        })
      },
      handleNodeClick(data, node) {
        console.log(data, node,555);
      },
      getChecked(){//点击树之后显示数据在input里
        this.arrid=[]
        let res = this.$refs.tree.getCheckedNodes();
        let arr=[], valueName=[]
        console.log(res,"res")
        for(let i=0;i<res.length;i++){
          let id=res[i].id;
          let name=res[i].townName;
          arr.push(name);
          this.arrid.push(id)
          valueName.push({id:id,name:name})
        }
        this.value=arr;
        this.sendValue=valueName;
        this.$emit('getChecked',this.arrid)
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
