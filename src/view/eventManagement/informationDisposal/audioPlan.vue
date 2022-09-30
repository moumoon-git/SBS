<template>
  <div  id="names"  v-loading="loading"
        element-loading-text="识别中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div id="waveform" class="waveform" style="position: relative"></div>

    <div id="wave-timeline" class="wave-timeline"></div>

    <div id="wave-spectrogram" class="wave-spectrogram"></div>


    <div class="box">
      <el-button type="primary" size="mini"  id="getTimeData">
          <i class="el-icon-crop"></i>开始裁剪
      </el-button>

      <el-button type="primary" size="mini" id="endCutting" style="display: none">
          <i class="el-icon-crop"></i>结束裁剪
      </el-button>

      <el-button type="primary" size="mini" id="playPause">
            <span id="play">
                <i class="el-icon-video-play"></i>
                播放
            </span>

            <span id="pause" style="display: none">
                  <i class="el-icon-video-pause"></i>
                  暂停
            </span>
      </el-button>

      <el-button type="primary" size="mini" id="btnStop"><i class="el-icon-switch-button"></i>停止</el-button>
    </div>


  </div>
</template>

<script>
    export default {
        name: "audioPlan",
        props:['audioUrlData','audioId'],
        data(){
          return{
            strTime:'',//开始时间
            endTime:'',//结束时间
            loading:false,
          }
        },
        mounted(){
          let _this=this
          const wavesurfer = WaveSurfer.create({
            container: '#waveform',
            barHeight: 2,
            waveColor: "#E3E6EC",
            cursorColor: '#BCD8FD',//光标的颜色
            progressColor: '#BCD8FD', //进度条的颜色
            scrollParent: true,//试一次显示全部还是以滚动条的形式
            height: 180,  //高度
            cursorWidth: 2,//光标的宽度
            autoCenter: true,  //是否滚动
            fillParent: true, //
            hideScrollbar: false,//是否隐藏滚动条
            xhr: {
              withCredentials: true//额外的请求xhr参数
            },
            plugins: [
              WaveSurfer.timeline.create({                             //时间线 plugin
                container: "#wave-timeline",
                height: 10,
              }),
              WaveSurfer.cursor.create({                              //光标 plugin
                container: "#wave-cursor",
                showTime: true,
                opacity: 1,
                customShowTimeStyle: {
                  'background-color': '#000',
                  color: '#fff',
                  padding: '2px',
                  'font-size': '10px'
                }
              }),
            ]
          });

          //TimeLine
          wavesurfer.on('ready', function () {
            let timeline = Object.create(WaveSurfer.timeline);
            timeline.create({
              wavesurfer: wavesurfer,
              container: '#wave-timeline'
            });
          });
          wavesurfer.load(_this.audioUrlData);
          //Stop
          btnStop.addEventListener('click', function () {
            wavesurfer.stop();
          });
          // PlayPause ,playPause
          let playPause = document.querySelector('#playPause');
          this.$emit('recordingInstance',wavesurfer)
          playPause.addEventListener('click', function () {
            wavesurfer.playPause();
          });
          // Toggle play/pause text
          wavesurfer.on('play', function () {
            document.querySelector('#play').style.display = 'none';
            document.querySelector('#pause').style.display = '';
          });
          wavesurfer.on('pause', function () {
            document.querySelector('#play').style.display = '';
            document.querySelector('#pause').style.display = 'none';
          });


          let getTimeData = document.querySelector('#getTimeData');
          getTimeData.addEventListener('click', function () {//开始裁剪
            if(_this.audioUrlData==''||_this.audioUrlData==null){
              _this.$message({
                message: '暂无可截取的音频',
                type: 'warning'
              })
              return
            }
              document.querySelector('#getTimeData').style.display = 'none';
              document.querySelector('#endCutting').style.display = '';
              _this.strTime=parseInt(wavesurfer.getCurrentTime())  //获取现在的时间
            // wavesurfer.playPause();
          });


          let endCutting = document.querySelector('#endCutting');
          endCutting.addEventListener('click', function () {//结束裁剪
            document.querySelector('#getTimeData').style.display = '';
            document.querySelector('#endCutting').style.display = 'none';
            _this.endTime=parseInt(wavesurfer.getCurrentTime()) //获取现在的时间
            _this.loading=true       //圆圈加载
            _this.sendTailor()
          });
          setTimeout(function () {
            console.log( wavesurfer.getDuration());    //获得总时长
          }, 5000)

        },
        methods: {
          sendTailor(){//发送裁剪时间
            let str,end
            if(this.strTime<this.endTime){
              str=this.strTime
            }else {
              str=this.endTime
            }
            if(this.endTime<this.strTime){
              end=this.strTime
            }else {
              end=this.endTime
            }
            let data={
              id:this.audioId,
              start:str,
              end:end
            }
            this.$api.cutWav(data).then((res) => {
              if (res.errorcode == 0) {
                console.log(res)
                let val=res.data
                this.$emit('sendPhoneText',val)
                this.loading=false
                this.$message({
                  message: '识别成功',
                  type: 'success'
                });
              }else {
                this.loading=false;
                this.$message.error(res.msg)
              }
            })
          }
        }



    }
</script>

<style scoped>
  #names{
    width: 100%;
    min-height: 250px;
  }
  .box{
    margin: 10px 0;
  }
</style>
