<template>
  <div style="width: 100%">
    <div style="width: 100%;text-indent: 10px;text-align: left;height: 40px;line-height: 40px">流程说明:</div>
    <div style="padding: 0 10px">
      <el-input
        type="textarea"
        :autosize="{minRows:14,maxRows:14}"  resize="none"
        v-model="leadershipConductor"
        placeholder="请输入内容"
      >
      </el-input>
    </div>
    <div style="width: 100%;text-align: right">
      <el-button style="margin:10px 30px 10px 0" type="success" size="mini" @click="saveLeaderInstructionThat">保存</el-button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "leadIndicate",
        data(){
          return{
            caseId:'',
            leadershipConductor:'',//领导批示内容
          }
        },
        mounted(){
          this.$nextTick(() =>{
            this.evaluationID()
          })
        },
        methods:{
          getLeadershipConductorTableDatas(){//获取流程说明
            let data={
              code:'LeaderInstruction',
              caseId:this.caseId
            };
            this.$api.getFlow(data).then((res) => {
              if(res.errorcode==0){
                if(res.data[0]==''||res.data[0]==undefined||res.data[0]==null){
                  this.$message({
                    message: '暂无流程!',
                    type: 'warning'
                  });
                  this.leadershipConductor='';
                }else {
                  this.leadershipConductor=res.data[0].content;
                }

              }
            })
          },
          evaluationID(){
            this.caseId=sessionStorage.getItem('parameterTreeId')
            this.getLeadershipConductorTableDatas()
          },
          saveLeaderInstructionThat(){//保存说明
            if(this.caseId==''||this.caseId==null){
              this.$message({
                message: '请先选择事件类型!',
                type: 'warning'
              });
              return;
            }
            let data={
              caseId:this.caseId,
              code:'LeaderInstruction',
              content:this.leadershipConductor
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
