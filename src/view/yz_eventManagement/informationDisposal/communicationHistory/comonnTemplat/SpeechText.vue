<template>
  <div class="SpeechText_wrap">

    <div class="SpeechText_content">
      <header class="SpeechText_header">
        <span>语音转文字</span>
        <img @click="close" src="../../../../../../static/img/Communihistory/close.png" alt="">
      </header>
      <aside class="SpeechText_contents" v-loading="loading">
        <el-input
          :readonly="true"
          ref="copyEle"
          type="textarea"
          :rows="14"
          placeholder="请输入内容"
          v-model="textarea">
        </el-input>
      </aside>

      <footer class="SpeechText_footer">
        <el-button type="primary" @click="copyContent" >复制全文</el-button>
        <el-button type="primary" @click="cellRemark" >存为电话备注</el-button>
      </footer>
    </div>

  </div>
</template>

<script>
import {mapGetters} from 'vuex'

  export default {
      name:'SpeechText',
      data () {
          return{
            // ???
            // textarea:'自分加记压着再铁和步消七点集增制步细查之集亲选造头派技太形事再小始头王表通报往者需发般条复深高。属种细水特联水路持空圆值包料路调消八更科民这况影边性指天多必九过状王们山说求酸感须术王不社后全品经报我么南持快活业关同关置劳转子新之流七。用示收步管话事那飞素酸道出走列决验太住目院品圆给表需造百族目压内增压角就证在华千布系规拉传前空现。质九行具力去火给期状年周军技准少能至养类革见本圆声题题头包支也看根切变南达运响记给质长它。个究状会阶响西每电土面听单里改连工度识日非商传由参价被话式处克统始两别收任同学龙是正调建全为重想层身求例养争设开属向影合风。包工步积联家没权马历水严五明务物路式确速收什象接业花有许精但论之才引结你步克部圆温增约教提改养便之作领能干。性拉府府小见花然干能积样日速实去电分着革党看自分加记压着再铁和步消七点集增制步细查之集亲选造头派技太形事再小始头王表通报往者需发般条复深高。属种细水特联水路持空圆值包料路调消八更科民这况影边性指天多必九过状王们山说求酸感须术王不社后全品经报我么南持快活业关同关置劳转子新之流七。用示收步管话事那飞素酸道出走列决验太住目院品圆给表需造百族目压内增压角就证在华千布系规拉传前空现。质九行具力去火给期状年周军技准少能至养类革见本圆声题题头包支也看根切变南达运响记给质长它。个究状会阶响西每电土面听单里改连工度识日非商传由参价被话式处克统始两别收任同学龙是正调建全为重想层身求例养争设开属向影合风。包工步积联家没权马历水严五明务物路式确速收什象接业花有许精但论之才引结你步克部圆温增约教提改养便之作领能干。性拉府府小见花然干能积样日速实去电分着革党看自分加记压着再铁和步消七点集增制步细查之集亲选造头派技太形事再小始头王表通报往者需发般条复深高。属种细水特联水路持空圆值包料路调消八更科民这况影边性指天多必九过状王们山说求酸感须术王不社后全品经报我么南持快活业关同关置劳转子新之流七。用示收步管话事那飞素酸道出走列决验太住目院品圆给表需造百族目压内增压角就证在华千布系规拉传前空现。质九行具力去火给期状年周军技准少能至养类革见本圆声题题头包支也看根切变南达运响记给质长它。个究状会阶响西每电土面听单里改连工度识日非商传由参价被话式处克统始两别收任同学龙是正调建全为重想层身求例养争设开属向影合风。包工步积联家没权马历水严五明务物路式确速收什象接业花有许精但论之才引结你步克部圆温增约教提改养便之作领能干。性拉府府小见花然干能积样日速实去电分着革党看'
            textarea:'',
            loading: false // 加载中
          }
      },
      computed: {
        ...mapGetters({
          getTurnToTextLoading: 'getTurnToTextLoading'
        })
      },
      watch: {
        /**
         * @author hexinting
         * @date 2020-10-14
         * @description 监听语音转文字过程
         */
        getTurnToTextLoading: {
          handler (newVal, oldVal) {
            this.loading = newVal.loading
          }
        }
      },
      methods:{
          copyContent () {
              let ele = this.$refs.copyEle
              console.log(ele)
              ele.select(); // 选择对象
              document.execCommand("Copy"); // 执行浏览器复制命令
              this.$message({
                  message: '已复制到剪切板',
                  type: 'success'
              });
          },
          //存为电话备注
          cellRemark () {
              this.$emit('cellRemark',{remark:this.textarea})
              this.$emit('closeSpeechTextEle',{remark:this.textarea})
              this.$message({
                  message: '已存为电话备注',
                  type: 'success'
              });
          },
          close () {
              this.$emit('closeSpeechTextEle',{remark:this.textarea})
          }
      }
  }
</script>

<style scoped>
.SpeechText_wrap{
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,.5);
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.SpeechText_content{
  width:759px;
  height:655px;
  background:rgba(255,255,255,1);
  box-shadow:0px 0px 21px 3px rgba(0,0,0,0.27);
  border-radius:7px;
  display: flex;
  flex-direction: column;
}
.SpeechText_header{
  width:759px;
  height:56px;
  background:rgba(241,244,246,1);
  border-radius:7px 7px 0px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 28px;
  box-sizing: border-box;
}
.SpeechText_header>span{
  font-size:18px;
  font-weight:400;
  color:rgba(51,51,51,1);
}
.SpeechText_header>img{
  cursor: pointer;
}
.SpeechText_contents{
  height: 510px;
  padding: 28px;
  box-sizing: border-box;
  border-bottom: 1px solid  rgba(221,222,225,1);
}
.SpeechText_contents /deep/ .el-textarea__inner {
  height:456px;
  background:rgba(255,255,255,1);
  border-radius:4px;
  border:1px solid rgba(221,222,225,1);
  font-size:17px;
  font-weight:400;
  color:rgba(51,51,51,1);
  padding: 11px 20px ;
  overflow-y: scroll;
  box-sizing: border-box;
  text-align: left;
  resize: none;
}
.SpeechText_footer{
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 21px;
  box-sizing: border-box;
}

</style>
