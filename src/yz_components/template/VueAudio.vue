<template>
  <div class="di main-wrap" v-loading="audio.waiting">
    <!-- 这里设置了ref属性后，在vue组件中，就可以用this.$refs.audio来访问该dom元素 -->
    <audio ref="audio" class="dn"
    :src="url" :preload="audio.preload"
    @play="onPlay"
    @error="onError"
    @waiting="onWaiting"
    @pause="onPause"
    @timeupdate="onTimeupdate"
    @loadedmetadata="onLoadedmetadata"
    ></audio>
    <div class="block">
<!--      <el-button type="text" style="color: #fff" @click="startPlayOrPause">-->
<!--        {{audio.playing | transPlayPause}}-->
<!--      </el-button>-->
      <img style="width: 14px;height: 14px;cursor: pointer" @click="startPlayOrPause" src="/static/img/stpo.png" v-if="audio.playing==true">
      <img style="width: 14px;height: 14px;cursor: pointer" @click="startPlayOrPause" src="/static/img/play.png" v-if="audio.playing==false">
<!--      <el-button v-show="!controlList.noSpeed" type="text" @click="changeSpeed">{{audio.speed | transSpeed}}</el-button>-->

<!--      <el-tag type="info">{{ audio.currentTime | formatSecond}}</el-tag>-->

      <el-slider v-show="!controlList.noProcess" v-model="sliderTime"  :show-tooltip="false"
                 :format-tooltip="formatProcessToolTip" @change="changeCurrentTime" class="slider"></el-slider>

      <el-tag type="info">{{ audio.maxTime | formatSecond }}</el-tag>

      <el-button v-show="!controlList.noMuted" type="text" @click="startMutedOrNot">{{audio.muted | transMutedOrNot}}</el-button>

      <el-slider v-show="!controlList.noVolume" v-model="volume" :format-tooltip="formatVolumeToolTip" @change="changeVolume" class="slider"></el-slider>

      <a :href="url" v-show="!controlList.noDownload" target="_blank" class="download" download>下载</a>
    </div>
  </div>
</template>

<script>
  function realFormatSecond(second) {
    var secondType = typeof second

    if (secondType === 'number' || secondType === 'string') {
      second = parseInt(second)

      var hours = Math.floor(second / 3600)
      second = second - hours * 3600
      var mimute = Math.floor(second / 60)
      second = second - mimute * 60

      return hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
    } else {
      return '0:00:00'
    }
  }

  export default {
    props: {
      theUrl: {
        type: String,
        required: true,
      },
      theSpeeds: {
        type: Array,
        default () {
          return [1, 1.5, 2]
        }
      },
      theControlList: {
        type: String,
        default: ''
      }
    },
    name: 'VueAudio',
    data() {
      return {
        url: this.theUrl,
        audio: {
          currentTime: 0,
          maxTime: 0,
          playing: false,
          muted: false,
          speed: 1,
          waiting: true,
          preload: 'auto'
        },

        sliderTime: 0,
        volume: 100,
        speeds: this.theSpeeds,

        controlList: {
          // 不显示下载
          noDownload: true,
          // 不显示静音
          noMuted: true,
          // 不显示音量条
          noVolume: true,
          // 不显示进度条
          noProcess: false,
          // 只能播放一个
          onlyOnePlaying: true,
          // 不要快进按钮
          noSpeed: true
        }
      }
    },
    methods: {
      setControlList () {
        let controlList = this.theControlList.split(' ')
        controlList.forEach((item) => {
          if(this.controlList[item] !== undefined){
            this.controlList[item] = true
          }
        })
      },
      changeSpeed() {
        let index = this.speeds.indexOf(this.audio.speed) + 1
        this.audio.speed = this.speeds[index % this.speeds.length]
        this.$refs.audio.playbackRate = this.audio.speed
      },
      startMutedOrNot() {
        this.$refs.audio.muted = !this.$refs.audio.muted
        this.audio.muted = this.$refs.audio.muted
      },
      // 音量条toolTip
      formatVolumeToolTip(index) {
        return '音量条: ' + index
      },
      // 进度条toolTip
      formatProcessToolTip(index = 0) {
        index = parseInt(this.audio.maxTime / 100 * index)
        return '进度条: ' + realFormatSecond(index)
      },
      // 音量改变
      changeVolume(index = 0) {
        this.$refs.audio.volume = index / 100
        this.volume = index
      },
      // 播放跳转
      changeCurrentTime(index) {
        this.$refs.audio.currentTime = parseInt(index / 100 * this.audio.maxTime)
      },
      startPlayOrPause() {
        return this.audio.playing ? this.pausePlay() : this.startPlay()
      },
      // 开始播放
      startPlay() {
        this.$refs.audio.play()
      },
      // 暂停
      pausePlay() {
        this.$refs.audio.pause()
      },
      // 当音频暂停
      onPause () {
        this.audio.playing = false
      },
      // 当发生错误, 就出现loading状态
      onError () {
        this.audio.waiting = true
      },
      // 当音频开始等待
      onWaiting (res) {
        console.log(res)
      },
      // 当音频开始播放
      onPlay (res) {
        console.log(res)
        this.audio.playing = true
        this.audio.loading = false

        if(!this.controlList.onlyOnePlaying){
          return
        }

        let target = res.target

        let audios = document.getElementsByTagName('audio');

        [...audios].forEach((item) => {
          if(item !== target){
            item.pause()
          }
        })
      },
      // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
      onTimeupdate(res) {
        // console.log('timeupdate')
        // console.log(res)
        this.audio.currentTime = res.target.currentTime
        this.sliderTime = parseInt(this.audio.currentTime / this.audio.maxTime * 100)
      },
      // 当加载语音流元数据完成后，会触发该事件的回调函数
      // 语音元数据主要是语音的长度之类的数据
      onLoadedmetadata(res) {
        console.log('loadedmetadata')
        console.log(res)
        this.audio.waiting = false
        this.audio.maxTime = parseInt(res.target.duration)
      }
    },
    filters: {
      formatSecond(second = 0) {
        return realFormatSecond(second)
      },
      transPlayPause(value) {
        return value ? `暂停` : '播放'
      },
      transMutedOrNot(value) {
        return value ? '放音' : '静音'
      },
      transSpeed(value) {
        return '快进: x' + value
      }
    },
    created() {
      this.setControlList()
    },
    mounted() {
      console.log(this.url,this.theUrl)
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main-wrap{
    position: absolute;
    top: -3px;
    left: 0;
  }
  .slider {
    display: inline-block;
    width: 100px;
    position: relative;
    top: 14px;
    margin-left: 15px;
  }

  .di {
    display: inline-block;
  }

  .download {
    color: #409EFF;
    margin-left: 15px;
  }

  .main-wrap /deep/ .el-slider__button-wrapper .el-tooltip,
  .main-wrap /deep/ .el-slider__button-wrapper{
    display: none;
  }
  .main-wrap /deep/ .el-slider__bar{
    background: #5ACD76;
  }
  .main-wrap /deep/ .el-tag{
     background-color: rgb(81, 185, 255 );
    /* border-color: #d9ecff; */
     display: initial;
    height: 32px;
    padding: 0 10px;
    line-height: 30px;
    font-size: 12px;
    color:#fff;
    border-width: 1px;
    border-style: none;
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    white-space: nowrap;
  }
  /*.main-wrap /deep/ .el-slider__runway{*/
  /*  margin: 0;*/
  /*}*/

  .dn{
    display: none;
  }

</style>
