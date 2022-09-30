<template>
  <div>
    <el-dialog
      title="选配公共事件"
      :close-on-click-modal="false"
      :visible.sync="visible">


      <el-tree
        :default-expand-all='true'
        @node-click="handleNodeClick"
        :data="commonSetList"
        :props="commonSetListProps"
        node-key="id"
        style="background: #cccccc47;
            margin-top: 18px;
            height: calc(100vh - 350px);
            padding-top: 10px;"
        current-node-key
        show-checkbox
        highlight-current
        :expand-on-click-node="false"
        ref="tree"
      >
      </el-tree>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'commonSet',
    data(){
      return {
        key:"",
        visible:false,
        commonSetList:[],
        commonSetListProps:{
          children: 'children',
          label: 'name'
        }
      }
    },
    methods:{
      init(){

        this.visible=true
        this.$http({
          url:this.$http.adornUrl('/event/eventType/commonEventTypeTree'),
          method:'get',
          param:this.$http.adornParams()
        }).then(({data})=>{
          if (data && data.code === 0) {
            // console.log("commonEventTypeTree",data)
            this.commonSetList=data.tree
          }else{
            this.$message.error(data.msg)
          }
        })
      },

      //点击树形结点事件
      handleNodeClick(){
        // console.log("点击树形结点事件")
      }
    }
  }
</script>

<style scoped>

</style>
