<template>
   <div style="width: 100%">
     <div style="width: 100%;text-indent: 10px;text-align: left;height: 40px;line-height: 40px">流程说明:</div>
     <div style="padding: 0 10px">
       <el-input
         type="textarea"
         :autosize="{minRows:14,maxRows:14}"  resize="none"
         v-model="forTheFirstTimeToDetermine"
         placeholder="请输入内容"
       >
       </el-input>
     </div>
     <div style="width: 100%;text-align: right">
       <el-button style="margin:10px 30px 10px 0" type="success" size="mini" @click="saveJudgingThat">保存</el-button>
     </div>
   </div>
</template>

<script>
    export default {
        name: "truthInitialJudging",
        data(){
          return{
            caseId:'',//事件类型ID
            forTheFirstTimeToDetermine:'',//实情初判内容
          }
        },
        mounted(){
          this.evaluationID()
        },
        methods:{
          getJudgementTableDatas(){//获取流程说明
            let data={
              code:'Judgement',
              caseId:this.caseId
            };
            this.$api.getFlow(data).then((res) => {
              if(res.errorcode==0){
                if(res.data[0]==''||res.data[0]==undefined||res.data[0]==null){
                  this.$message({
                    message: '暂无流程!',
                    type: 'warning'
                  });
                  this.forTheFirstTimeToDetermine='';
                }else {
                  this.forTheFirstTimeToDetermine=res.data[0].content;
                }

              }
            })
          },
          evaluationID(){
            this.caseId=sessionStorage.getItem('parameterTreeId')
            console.log(this.caseId);
            this.getJudgementTableDatas()
          },
          saveJudgingThat(){//保存说明
            if(this.caseId==''||this.caseId==null){
              this.$message({
                message: '请先选择事件类型!',
                type: 'warning'
              });
              return;
            }
            let data={
              caseId:this.caseId,
              code:'Judgement',
              content:this.forTheFirstTimeToDetermine
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
