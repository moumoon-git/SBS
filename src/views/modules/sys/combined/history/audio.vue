<template>
    <div>
      <!--录音文件的下-->
      <div class="recording" >
        <audio id="recordAudio" >
          <source :src="audioSrc" type="audio/ogg">
          <source :src="audioSrc" type="audio/wav">
          <source :src="audioSrc" type="audio/mp3">
          您的浏览器不支持 audio 元素。
        </audio>
        <div class="controller">
          <img @click="trianglePlay" v-if="playFlag" style="margin-right: 5px;cursor: pointer;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAABEElEQVQ4T2NkQAUSQG42EPsAMQtU6geQ3gHEE4H4DUw5I5K+YCC7BoinAvEKIP4CleMB0hFQA1uA9FqQOEwjSFMBEPsC8Qc0V8C4AkDGZiDuAeKNII0g520HYkc8mpA17wdyXEEam4H4IRDPQbJpOZA9AYhPYrE9BSgmD9J4HohtkfwEUvsaiI8AMSgwKqE0zAyQn/eDNF4GYl00k+8D+YpAHADE9UAM8tdSJDWXCWn0BypuwKURl1PPADU8wedUUOA8AOK5SE4BBQ4owk+geQHETQZiBYqiA2RKCBDnAzExCaAXqG4DcpIDaa4G4ilAvBKIkZNcOJCfA8SNIE0gm5A1gviwRO4BZHNA/Yc1kQMAI/ZAecFwqOUAAAAASUVORK5CYII=" alt="">
          <img @click="trianglePlay" v-if="!playFlag" style="margin-right: 5px;cursor: pointer;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAABC0lEQVQ4T2NkQAWSQG4mEPsAsTRU6imQ3gjE04H4FUw5I5K+ICC7F4i3A/FaID4LlTMG0sFQw3KA9CaQOEwjSNNkIPYG4gtoroBxDYCMrVAXbQJpBDnvOBAHIGkKA7IPQHU4AOlVUDZIM8jZpiCNTUAsAsRZSDadB7Ibofx6IG2IJDcNyH4F0ghSVALEe4nUCHJBP0jjSyBWB+IPRGoUAKq7SY5GkLeuwpxaiBQYIIvx+RHuVFIDB5QQXoJsFAPi00DsD8SwOCQqOkBOgyUADyD7MlIgITMxEgBMEqS5H4hBSQqU5ED+BLkIpAEkB3JRLlQenuRgmkHOBqVHXyCWggo+A9Kg1AKOeJhCAGX9QKtbAxBkAAAAAElFTkSuQmCC" alt="">
          <p><span style="font-weight: 400;">{{stratTime}}</span>/<span style="font-weight: 400;">{{duration}}</span></p>
          <input type="range" ref="myrange" @input="changeInpVal" :max="parseInt(durationTime)" min="0" value="0" />
          <img :src="textSrc" class="vox" alt="语音转文字" @click="TurnTheText">
          <img @click="setdefaultMuted"  v-if="!defaultMuted" class="vox" id="vox" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAABXUlEQVQ4T2NkwAIuXrzI/fXr163//v07ZGNjU4dNDSO64OHDh+WYmJiOMDIyygLxEUtLS1uCGo8ePeoGVLwTphBZ47Fjx2r///+/x9ra+jhIHmwjUIARKJECVDgL2XRkjUBDZwL5KX///k21tbWdB9IwHajYCoj10J0E0whUw8nPz//3w4cPU4Biqd+/f1cAafyPzQ9g50D9CLRtI5CrCHSmPlD9fWCgzSJK45EjR6SAAfYU6CVDoAElQDYzURr379/Pw87O/vnPnz/aLCwsDUDN34nSCHTqcaCzn7CxscX//PnzJZDdCNKoAjRBF4jX4QqckydPCvPw8Hz++PHjIZBfgQaowRMA0B/aQLefBkpw4ojH/UBxC6Bz7e3s7E6hpBxQIACdsRGITZBDFcQGJY5fv35dcnR0fAFPAMhO3LZtG7uAgMBioFgo0UkOZgA0JdUDQ/Cqubn5amzxDABEMKZTVxy+1wAAAABJRU5ErkJggg==" alt="">
          <img @click="setdefaultMuted"  v-if="defaultMuted" class="vox" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAB8UlEQVQ4T3WSO0jbURTGvXmYpMVBSaCSjIVit9IMeZhgoDhph9LaybaKFHR0UNBJSgZFKE6Kgq2IoOlgh0KRKjE1ydKgCGKFbEJAyCAhQh6a/P2d0D8Yk1643Hse33e+e+5RkUjE6HQ635XL5fVQKHTTwkomk880TdtVSu35fL4B8d1fKh6PtxkMhjSBw1Kp9NJisTzm/ldPxGeDsPiPMFqpVN4HAoFzJY5YLNZlNptjVDmCZJVz8z/ADVR0ejyeF1LxCcmPblgmk+lXtVrdhuQbzNsClopWqzVcLBanXS6Xls1mM4CHFO8pELdSZY89A8ku9ib3LAnjAB8g/ww77Pf7VxKJxAI5HQLUdFkED0j+iH3KnsVuzeVyU3a7vQtBhw6Hw0bFHmJLdUAhIPkEuaNGo1FIxrxe76L4qXTJEcJ3Rc6fBqBg2Tu8MQz4N0nDSPyqA7EdSF1uBqwVpuoO7D/Zn7n3c77JZDIjNGiCuE/BJJK6m30y7LPELojN88bXwWDwOz05w55TqVTKnM/nH/IVCmkLOAfvksh30FXxf0BiH0/oY8omawOgL9hsVPlClbf3B4DYGr5XxPpp2H4dUJLT6bSFlie4Phe7leV2u6/lDngL4l6a1d4AlIRoNGpC3if5BYb8h15dnlUoFJ4yq8e3goUQVQ7wyU4AAAAASUVORK5CYII=" alt="">
          <img class="download" @click="download" id="download" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAANCAYAAACpUE5eAAACGUlEQVQ4T8VSPUgbYRjOl8vdNd5JfiBQ6CbUwQwdDCEJIXBrWjqV4CTudRBU6FBISkEHUZykWwdBIREXwSFLkktIQiC06SAtwU1KCSheScS75C4+r0Q4xL/Ng+P93vd7nuf9+V7meORrt9tip9OZBayvadpuMpnUH6KwxwQLhcILQRAWCWcYxrqiKJfPLzgcDlmj0fDDUpumLMsLVFW32930eDwcY4wPh8NnsMPb1d7ZMgnWarUPsArHcSumac4REQLfYZZga5FIJPdkQeKqqvrS5XJtQbQA/xUJOp3OE0oyGAw+JhKJfwjdX2Gr1ZJ6vZ5X13WtVCpdpNNpqvI1BLYhdEyCOE/AzEaj0XYul3P4fD5ZkiQZnNObx2IAOZvNph/BdyCmQFhEO3/QjkUvjJanUenOSHAGL/2DyOBxSBhH/LNlWRvw6/F4/JyVy+UJkL7iYhIi87j4lc/n9UwmY5FIpVIZR/wt4hYqOgwGg10aCc25WCyOud3uBARXEVOxXiusWq2qcIIAfIH9SQsMgIEkR7FY7HrnstksTzaVSvWBc0BIEkVxiqpEMgG/gvMy/gMSPAfWDeeC2hytAVXxCRn3QqFQ374aNAae59MYD728MLrjYCVo/CbBfTjv6RFtRBKuYK4z2L3/dsFAIOBHBweIvbHHcTbxf2P1ej0JwBocrx2AbJeoWEPMuEUUR9ib6q6vgf+LquevAND6FCKDtloSAAAAAElFTkSuQmCC" alt="">
        </div>
      </div>
      <voiceText 
        v-show="voiceTextFlag" 
        @closeVoiceText="closeVoiceText"
        @cellRemark="cellRemark"
        ref="voiceTextRef"
      />
    </div>
</template>

<script>
import voiceText from '@/view/eventManagement/informationDisposal/communicationHistory/comonnTemplat/voiceText.vue';
import Bus from '@/views/common/js/eventBus';

const TurnTheText = require('@/assets/img/text.png');
const allApiRequest = require('@/assets/js/weblfasr/weblfasr.js').default;

  export default {
    name: 'audio',
    components: {
      voiceText,
    },
    data () {
      return {
        audio: '',
        duration: '00:00',
        durationFlag: true,
        stratTime: '00:00',
        underway: '',
        durationTime: 0,
        setIntVal: '',
        playFlag: true,  // 暂停和播放
        defaultMuted: false, // 是否静音
        playOneFlag: true,
        overAudio: false,
        isnum: 0,
        maxNum: 150,
        blob: '',
        audioSrc: '',
        sdflex: false,
        setIntGetDuration:'',
        setIntGetDuration3: '',
        textSrc:TurnTheText,
        row: '',
        voiceTextFlag: false,
      }
    },
    methods: {
    // 语音转文字
    async TurnTheText() {
      this.$refs.voiceTextRef.textarea = '';
      this.voiceTextFlag = true;
      if (!this.row.recordFile || this.row.recordFile === '') {
        this.$message.error('不存在录音文件');
        this.$store.commit('setTurnToTextLoading', {
          loading: false,
        });
      } else {
        try {
          const response = await allApiRequest(this.row.recordFile, { id: this.row.eventId });
          if (response) {
            this.$refs.voiceTextFlag.textarea = response;
            this.$store.commit('setTurnToTextLoading', {
              loading: false,
            });
          } else {
            throw Error(`错误代码${response.data.errorCode}，${response.data.msg}`);
          }
        } catch (err) {
          this.$message.error(`$语音转换失败：${err}`);
        }
      }
    },
    // 关闭弹窗
    closeVoiceText() {
      this.voiceTextFlag = false;
    },
    /**
       * 点击单元格将对应row对象传过来
       * @param {object} row 表格行对象
       */
    getRow(row) {
      this.row = row;
    },
    /**
       * 添加备注信息
       * @param {string} data 备注内容
       */
    cellRemark(data) {
      this.$http({
        url: `${window.SITE_CONFIG.cloudUrl}/event/eos/history/phone/updateCdrs`,
        method: 'post',
        data: this.$http.adornParams({
          ids: [this.row.id],
          voiceTxt: data.remark,
        }),
      }).then((res) => {
        if (res.data.errorcode === 0) {
          // console.log(res)
          this.$message.success('备注成功');
          Bus.$emit('refsh', '');
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },

      init (data) {
        this.loadIng()
        const _that= this
        if (data && (data.indexOf('wav') != -1 || data.indexOf('mp3') != -1)) {
          this.audioSrc = data
          let audio = document.getElementById('recordAudio')
          audio.src = data
          this.audio = audio
          clearInterval(this.setIntGetDuration3)
          this.setIntGetDuration3 = null
          this.setIntGetDuration3 = setInterval(()=>{
            if (audio.readyState == 4) {
              _that.getAudio()
              clearInterval(_that.setIntGetDuration3)
            }
          },500)
          audio.load()
        }
      },
      //初始化
      loadIng () {
        if (this.audio ) {
          this.audio.currentTime=0
        }
        this.audio = null
        clearInterval(this.setIntGetDuration)
        clearInterval(this.setIntVal)
        this.setIntGetDuration = null
        this.setIntVal = null
        this.playFlag = true
        this.playOneFlag = true
        this.duration = '00:00'
        this.stratTime = '00:00'
        this.$refs.myrange.value = 0
      },
      // 二进制
      initBase (data) {
        this.blob = this.jiema(data)
        this.shitin(this.blob)
      },
      getAudio () {
        let that = this
        this.setIntGetDuration = setInterval(function () {
            that.audioDuration()
        }, 1000)
      },
      audioDuration () {
        const that = this
        let playTime = ''
        playTime = that.audio.duration ? that.audio.duration : 0
        that.durationTime = playTime
          if (that.audio.duration) {
            that.durationFlag = false
            that.sdflex = true
          }else {
            that.durationFlag = true
          }
          // playTime
          let shi = parseInt(playTime / 60 / 60)
          let fen = parseInt(playTime / 60)
          let miao = parseInt(playTime % 60)
          let str = ''
          shi = that.bothStr(shi)
          fen = that.bothStr(fen)
          miao = that.bothStr(miao)
          if (shi && shi != '00') {
            str = shi + ':' + fen + ':' + miao
          } else {
            str = fen + ':' + miao
          }
          that.duration = str || '00:00'
          clearInterval(this.setIntGetDuration)
          this.setIntGetDuration = null
      },
      trianglePlay () {
        if (this.sdflex) {
          if (this.playFlag) {
            this.audio.play()
            this.playFlag = false
            this.durationFlag = true
          }else {
            this.audio.pause()
            this.playFlag = true
            this.durationFlag = true
          }
          if (this.playOneFlag) {
            this.watchAudioTime()
            this.playOneFlag = false
          }
        }
      },
      watchAudioTime () {
        this.durationFlag = true
        let that = this
        this.setIntVal = setInterval(function () {
          that.$refs.myrange.value = that.audio.currentTime
          let shi = parseInt(that.audio.currentTime / 60 / 60)
          let fen = parseInt(that.audio.currentTime / 60)
          let miao = parseInt(that.audio.currentTime % 60)
          let str = ''
          shi = that.bothStr(shi)
          fen = that.bothStr(fen)
          miao = that.bothStr(miao)
          if (shi && shi != '00') {
            str = shi + ':' + fen + ':' + miao
          } else {
            str = fen + ':' + miao
          }
          that.stratTime = str
          if (that.audio.currentTime == that.durationTime) {
            that.overAudio = true
            that.playOneFlag = false
            clearInterval(that.setIntVal)
          }
        }, 10)
      },
      bothStr (val) {
        if (val < 10) {
          return '0' + val
        }
        return val
      },
      changeInpVal () {
        if (this.overAudio) {
          this.audio.play()
          this.playOneFlag = true
          this.audio.currentTime = this.$refs.myrange.value
          this.watchAudioTime()
          this.overAudio = false
        } else {
          this.audio.currentTime = this.$refs.myrange.value
        }
      },
      setdefaultMuted () {
        if (this.sdflex) {
          if (this.defaultMuted) {
            this.audio.volume = 1
          } else {
            this.audio.volume = 0
          }
          this.defaultMuted = !this.defaultMuted
        }
      },
      jiema (res) {
        let sliceSize = 512
        let byteCharacters = window.atob(res)
        let byteArrays = []
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          let slice = byteCharacters.slice(offset, offset + sliceSize)
          let byteNumbers = new Array(slice.length)
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i)
          }
          let byteArray = new Uint8Array(byteNumbers)
          byteArrays.push(byteArray)
        }
        let blob = new Blob(byteArrays)
        return blob
      },
      shitin (blob) {
        let that = this
        setTimeout(function () {
          let audio = document.getElementById('audio')
          if (window.URL) {
            audio.src = URL.createObjectURL(blob)
          } else {
            audio.src = blob
          }
          audio.load()
          that.getAudio()
        },100)
      },
      download () {
        if (this.audioSrc) {
          let aTag = document.createElement('a')
          aTag.download = '电话录音.wav'
          // aTag.href = URL.createObjectURL(this.blob)
          aTag.href = this.audioSrc
          aTag.click()
          aTag.remove()
          aTag = null
          // window.URL.revokeObjectURL(this.blob)
        }
      },
      changeTextValue (e) {
        this.isnum = e.target.value.length
      }
    },
    mounted () {

    }
  }
</script>

<style scoped>
  .recording{
    /*height: 50px;*/
    display: flex;
    align-items: center;
    justify-content: center;
    /*border-bottom: 1px dashed #ccc;*/
  }
  .controller{
    display: flex;
    align-items: center;
  }
  .controller>p{
    margin: 0;
    margin-right: 10px;
  }
  .vox{
    margin-right: 12px;
    cursor: pointer;
  }
  .download{
    cursor: pointer;
  }
  .controller input[type=range]{
    outline: none;
    margin-right: 50px;
  }
  .controller input[type=range] {
    -webkit-appearance: none;/*清除系统默认样式*/
    width: 146px;
    background: -webkit-linear-gradient(#ddd, #ddd) no-repeat, #ddd;/*设置左边颜色为#61bd12，右边颜色为#ddd*/
    background-size: 75% 100%;/*设置左右宽度比例*/
    height: 2px;/*横条的高度*/
    border-radius: 0.1rem;
  }
  /*拖动块的样式*/
  .controller input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;/*清除系统默认样式*/
    height: 8px;/*拖动块高度*/
    width: 8px;/*拖动块宽度*/
    background: #fff;/*拖动块背景*/
    border-radius: 50%; /*外观设置为圆形*/
    border: solid 1px #ddd; /*设置边框*/
  }
  #audio{
    visibility: hidden;
  }
</style>
