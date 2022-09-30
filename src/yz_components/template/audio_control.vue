<template>
  <div class="audio_control_wrap" >

    <aside class="audio_control_content" >
        <div v-if="audios[0].url!==''"  v-for="(item, index) in audios" :key="index">
          <vue-audio  :theUrl="item.url" :theControlList="item.controlList" ></vue-audio>
        </div>
        <!-- openlab项目需求： 1. 通话结束，如果通话有录音，就保留翻译按钮。 2.通话结束，如果通话没有录音，就屏蔽翻译按钮。 -->
        <template v-if="!IsOpenLabProject">
            <div style="position: absolute;right: 20px;bottom: 0; ">
                <img style="margin-left:120px;" src="/static/img/text1.png" @click="recordingToText" alt="">
                <img style="margin-left:10px;" src="/static/img/doument.png" alt="" class="download"  @click="download" id="download">
            </div>
        </template>
        <template v-else>
            <div v-if="audios[0].url!==''" style="position: absolute;right: 20px;bottom: 0; ">
                <img style="margin-left:120px;" src="/static/img/text1.png" @click="recordingToText" alt="">
                <img style="margin-left:10px;" src="/static/img/doument.png" alt="" class="download"  @click="download" id="download">
            </div>
        </template>
    </aside>
    <!--语音转文字弹窗-->
    <SpeechText
      ref="SpeechText"
      v-show="SpeechTextFlag"
      @cellRemark="cellRemark"
      @closeSpeechTextEle="closeSpeechTextEle"
    ></SpeechText>
  </div>
</template>

<script>
import VueAudio from './VueAudio'
import SpeechText from '@/view/eventManagement/informationDisposal/communicationHistory/comonnTemplat/SpeechText.vue'

const allApiRequest = require('@/assets/js/weblfasr/weblfasr.js').default;

export default {
    name:'audio_control',
    components:{
       VueAudio,
       SpeechText
    },
    data () {
        return{
            audios: [
                {
                    url: '',
                    controlList: 'onlyOnePlaying'
                },
            ],
            isOpenFunction_AudioToText: false, // 是否开通语音转文字功能
            IsZengChengProject: window.g.IsZengChengProject, // 是否是增城项目
            IsYangZhouProject: window.g.IsYangZhouProject, // 是否是扬州项目
            IsOpenLabProject: window.g.IsOpenLabProject, // 是否openLab项目
            RealTimeVoiceToText: window.g.RealTimeVoiceToText, // 是否支持实时语音转文字功能
            SpeechTextFlag: false, // 显示或隐藏语音转文字弹窗
        }
    },
    props: ['url'],
    methods :{
        /**
         * @author hexinting
         * @param 无
         * @date 2020-11-10
         * @lastEditor hexinting
         * @lastDate 2020-11-17
         * @description 语音转文字
         */
        async TurnTheText() {
            let id = this.$store.getters.getCallHistoryId; // 电话记录id
            let url = this.$store.getters.getPhoneRecordFile; // 录音url
            // let url = 'http://192.168.3.79:7102/rec/20201026185916_15218272749_6001_CALLIN.wav' // 测试数据
            // let id = 418; // 开发调试使用
            console.log('录音id：', id);
            console.log('录音url：', url);
            this.$refs.SpeechText.textarea = '';    // 语音转文字文本框
            this.SpeechTextFlag = true; // 显示 语音转文字弹窗
            this.$store.commit('setTurnToTextLoading', { // 显示loading
                loading: true,
            });
            if (!url || url === '') { // 不存在录音文件
                this.$message.error('不存在录音文件');
                this.$store.commit('setTurnToTextLoading', { // 隐藏loading
                    loading: false,
                });
            } else { // 存在录音文件
                // 先判断语音是否已经转过文字，若是，拿数据库的显示。
                this.$api.findRecordTextByPhoneId({phoneId: id}).then(async (res) => {
                    if (res.errorcode == 0) {
                        if (res.data.recordText) {
                            this.$refs.SpeechText.textarea = res.data.recordText;
                            this.$emit('recordingToText', res.data.recordText);
                        } else {
                            let response = await allApiRequest(url, { id: id }); // 录音转文字结果
                            this.$refs.SpeechText.textarea = response;
                            console.log('录音结果', response);
                            this.$emit('recordingToText',response);
                        }
                    } else {
                        this.$message.error(res.msg);
                    }
                    this.$store.commit('setTurnToTextLoading', {  // 隐藏loading
                        loading: false,
                    });
                })
            }
        },
        download () {
            console.log(this.url);
            let dataName=this.url.split("/rec/")
            let eleLink = document.createElement('a');
            eleLink.download = dataName[1]+'.wav';
            eleLink.style.display = 'none';
            // 字符内容转变成blob地址
            let blob = new Blob([this.url]);
            eleLink.href = URL.createObjectURL(blob);
            // 触发点击
            document.body.appendChild(eleLink);
            eleLink.click();
            // 然后移除
            document.body.removeChild(eleLink);
        },
        /**
         * @param 无
         * @lastEditor hexinting
         * @lastDate 2020-11-11
         * @description 语音转文字
         */
        recordingToText() {
            let IsZengChengOrYangZhou = this.IsZengChengProject ||this.IsYangZhouProject  // 增城or扬州项目
            if (IsZengChengOrYangZhou) {
                // 是否是增城or扬州项目
                this.isOpenFunction_AudioToText = true; // 增城项目已经开启语音转文字功能 author:hexinting date:2020-11-10
            }
            if (!this.isOpenFunction_AudioToText) { // 是否开通语音转文字功能
                this.$message({
                    message: '暂未开通语音转文字功能，请开通后再使用。',
                    type: 'info',
                });
                return;
            }
            this.TurnTheText(); // 语音转文字
            // 注释原因： phoneToText 改成使用科大讯飞的方法 (author：hexinting；date:2020-11-10)
            // this.$confirm('文本框内已有实时转换记录，是否覆盖？', '提示', {
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     type: 'warning'
            // }).then(() => {
            //     let id=this.$store.getters.getCallHistoryId
            //     this.$api.phoneToText({phoneId:id}).then((res) => {
            //         if (res.errorcode == 0) {
            //             this.$emit('recordingToText',res.data)
            //         }else {
            //             this.$message.error(res.msg)
            //         }
            //     })
            // }).catch(() => {
            //     this.$message({
            //         message: '已取消',
            //         type: 'info'
            //     })
            // });
        },
        /**
         * @author hexinting
         * @date 2020-11-10
         * @lastEditor hexinting
         * @lastDate 2020-11-10
         * @description 存为电话备注
         */
        cellRemark() {
            let data = {
                id: this.$store.getters.getCallHistoryId, // 电话记录id
                remark: this.$refs.SpeechText.textarea, // 电话备注
            };
            this.$api.ok(data).then(res => {
                if (res.errorcode == 0) {
                    this.relevanceDialog = false;
                    this.$message({
                        message: '保存成功!',
                        type: 'success',
                    });
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        /**
         * @author hexinting
         * @date 2020-11-10
         * @lastEditor hexinting
         * @lastDate 2020-11-10
         * @description 关闭语音转文字
         */
        closeSpeechTextEle() {
            this.SpeechTextFlag = false;
        },

    },

    mounted() {
      console.log(this.url);
      if(this.url) {
          this.audios[0].url=this.url;
          this.audios[0].controlList='onlyOnePlaying'
      }
    }
}
</script>

<style scoped>
.audio_control_wrap{
    height: 100%;
    display: flex;
    align-items: center;
}
.audio_control{
    display: none;
}
.audio_control_content{
    display: flex;
    align-items: center;
}
.audio_control_content>div>img{
    width:14px;
    height: 14px;
    cursor: pointer;
}
.audio_control_content>span{
    font-size:10px;
    font-weight:400;
    color:rgba(255,255,255,1);
    line-height:14px;
}
.audio_control_play{
  background: url('/static/img/play.png')no-repeat;
  background-size:100% 100% ;
  width:14px;
  height: 14px;
  cursor: pointer;
}
.audio_control_stop{
  background: url('/static/img/stpo.png')no-repeat;
  background-size:100% 100% ;
  width:14px;
  height: 14px;
  cursor: pointer;
}
/* 进度条 */
.audio_control_progress{
    width: 160px;
    margin: 0 8px 0 6px;
}
.audio_control_progress /deep/ .el-slider__button-wrapper .el-tooltip,
.audio_control_progress /deep/ .el-slider__button-wrapper{
    display: none;
}
.audio_control_progress /deep/ .el-slider__bar{
    background: #5ACD76;
}
.audio_control_progress /deep/ .el-slider__runway{
    margin: 0;
}
.dn{
  display: none;
}
</style>
