<template>
  <div style="width: 100%">
    <div style="width: 100%;text-indent: 10px;text-align: left;height: 40px;line-height: 40px">流程说明:</div>
    <div style="padding: 0 10px">
      <el-input
        type="textarea"
        :autosize="{minRows:14,maxRows:14}"  resize="none"
        v-model="planToStart"
        placeholder="请输入内容"
      >
      </el-input>
    </div>
    <div style="width: 100%;text-align: right">
      <el-button style="margin:10px 30px 10px 0" type="success" size="mini" @click="savePlanToStartData">保存</el-button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "startArranged",
        data(){
          return{
            caseId:'',
            planToStart:'',//启动预案内容
          }
        },
        mounted(){
          this.$nextTick(() =>{
            this.evaluationID()
          })
        },
        methods:{
          getPlanToStartTableDatas(){//获取流程说明
            let data={
              code:'StartPreplan',
              caseId:this.caseId
            };
            this.$api.getFlow(data).then((res) => {
              if(res.errorcode==0){
                if(res.data[0]==''||res.data[0]==undefined||res.data[0]==null){
                  this.$message({
                    message: '暂无流程!',
                    type: 'warning'
                  });
                  this.planToStart='';
                }else {
                  this.planToStart=res.data[0].content;
                }

              }
            })
          },
          evaluationID(){
            this.caseId=sessionStorage.getItem('parameterTreeId')
            this.getPlanToStartTableDatas()
          },
          savePlanToStartData(){//保存说明
            if(this.caseId==''||this.caseId==null){
              this.$message({
                message: '请先选择事件类型!',
                type: 'warning'
              });
              return;
            }
            let data={
              caseId:this.caseId,
              code:'StartPreplan',
              content:this.planToStart
            };
            this.$api.addFlowContent(data).then((res) => {
              if(res.errorcode==0){
                this.$message({
                  message: '流程说明保存成功!',
                  type: 'success'
                });
              }else {
                this.$message.error(res.msg)
              }
            })
          },
        }
    }
</script>

<style scoped>

</style>
