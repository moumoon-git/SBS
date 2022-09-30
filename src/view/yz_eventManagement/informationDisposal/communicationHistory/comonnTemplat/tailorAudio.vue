<template>
  <div class="tailorAudio_wrap">
    <div class="tailorAudio_content">
      <header class="SpeechText_header">
        <span>音频裁剪</span>
        <img
          @click="close"
          src="../../../../../../static/img/Communihistory/close.png"
          alt=""
        />
      </header>
      <!--显示裁剪的开始时间和结束时间-->
      <aside class="tailorAudio_timeVisCont">
        <div>
          开始裁剪：<span>{{ timeObj.startTailorTime }}</span>
        </div>
        <div>
          结束裁剪：<span>{{ timeObj.endTailorTime }}</span>
        </div>
        <div>
          裁剪时长：<span>{{ timeObj.tailorTime }}</span>
        </div>
      </aside>

      <aside class="tailorAudio_contents">
        <!--音频可视化的插件-->
        <div id="WaveSurfer_wrap">
          <div
            class="tailorAudio_visCont"
            id="WaveSurfer_del"
            style="position: relative"
          >
            <div id="wave_timeline_del"></div>
            <div id="wave_cursor_del"></div>
          </div>
        </div>
        <!--控制音频进度-->
        <div class="rangeWrap">
          <el-slider
            v-model="rangeValue"
            :show-tooltip="false"
            :max="rangeMax"
            @change="changeRangeValue($event)"
          ></el-slider>
          <span class="rangeWrap_left">{{ playTime }}</span>
          <span class="rangeWrap_right">{{ allTime }}</span>
        </div>
        <!-- 操作音频可视化的按钮-->
        <div class="curoseBtn">
          <img
            @click="rollback"
            src="../../../../../../static/img/Communihistory/next.png"
            alt=""
          />
          <img
            @click.stop="playAudio"
            v-if="!playImgFlag"
            src="../../../../../../static/img/Communihistory/play.png"
            alt=""
          />
          <img
            @click.stop="playAudio"
            v-else
            src="../../../../../../static/img/Communihistory/stop.png"
            alt=""
          />
          <img
            @click="speed"
            src="../../../../../../static/img/Communihistory/next.png"
            alt=""
          />
          <img
            @click="loading"
            src="../../../../../../static/img/Communihistory/loading.png"
            alt=""
          />
        </div>
        <!--        裁剪的操作-->
        <div class="tailorBtn_wrap">
          <el-button size="mini" @click="startTailor">开始裁剪</el-button>
          <el-button size="mini" @click="endTailor" type="primary"
            >结束裁剪</el-button
          >
        </div>
      </aside>

      <!--页脚的按钮-->
      <aside class="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="audioTailor">裁剪</el-button>
      </aside>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'tailorAudio',
  data() {
    return {
      apiUrl: window.g.ApiUrl, //服务器地址
      audioUrlData: '',
      wavesurfer: '',
      playImgFlag: false, //控制播放的按钮
      rangeValue: 0, // 控制进度值
      rangeMax: 0,
      playTime: '00:00:00', //播放时间
      allTime: '00:00:00', //总时长
      timeObj: {
        startTime: 0,
        endTime: 0,
        startTailorTime: '00:00:00', //开始裁剪时间
        endTailorTime: '00:00:00', //结束裁剪时间
        tailorTime: '00:00:00', //裁剪时间
      },
      expandSelectRowData: {}, // 展开行的对象
      waveReadyState: false, //音频加载的状态
    };
  },
  methods: {
    //开始裁剪
    startTailor() {
      if (this.waveReadyState) {
        let startTime = this.wavesurfer.getCurrentTime();
        this.timeObj.startTime = startTime;
        this.timeObj.startTailorTime = this.hourTimeNum(parseInt(startTime));
      }
    },
    //结束裁剪
    endTailor() {
      if (this.waveReadyState) {
        this.playImgFlag = false;
        this.wavesurfer.pause();
        let endTime = this.wavesurfer.getCurrentTime();
        this.timeObj.endTime = endTime;
        this.timeObj.tailorTime = this.hourTimeNum(
          parseInt(this.timeObj.endTime) - parseInt(this.timeObj.startTime),
        );
        this.timeObj.endTailorTime = this.hourTimeNum(parseInt(endTime));
      }
    },
    //关闭这个组件
    close() {
      this.$emit('tailorAudioClose', '');
    },
    //裁剪
    audioTailor() {
      const _that = this;
      // console.log(_that.apiUrl)
      let endtime = parseInt(this.timeObj.endTime);
      let starttime = parseInt(this.timeObj.startTime);
      let id = this.expandSelectRowData.id;
      console.log(endtime, starttime); // 裁剪结束，开始时间
      if (endtime - starttime >= 1) {
        let eleLink = document.createElement('a');
        eleLink.href =
          window.g.ApiUrl +
          `/eos/communication/phone/cutWav?id=${id}&start=${starttime}&end=${endtime}`;
        // console.log(eleLink.href);
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);

        /*this.$api.cutWav(data).then((res) => {
              console.log(res)
                  if (res.errorcode == 0) {
                      let val=res.data
                      this.$message({
                          message: '裁剪成功',
                          type: 'success'
                      });
                      let eleLink = document.createElement('a');
                      eleLink.download = res.data;
                      eleLink.style.display = 'none';
                      // 字符内容转变成blob地址
                      let blob = new Blob([_that.apiUrl+'/rec/'+res.data]);
                      eleLink.href = URL.createObjectURL(blob);
                      // 触发点击
                      document.body.appendChild(eleLink);
                      eleLink.click();
                      // 然后移除
                      document.body.removeChild(eleLink);

                  }else {
                      this.$message.error(res.msg)
                  }
            })*/
      } else {
        this.$message({
          message: '剪切时长小于1秒',
          type: 'warning',
        });
      }
    },
    //快退
    rollback() {
      this.rangeValue -= 15;
      this.wavesurfer.skipBackward(15);
      this.wavesurfer.play(this.rangeValue);
      this.playImgFlag = true;
    },
    //快进
    speed() {
      this.rangeValue += 15;
      this.wavesurfer.skipForward(15);
      this.wavesurfer.play(this.rangeValue);
      this.playImgFlag = true;
    },
    //回到起始
    loading() {
      this.wavesurfer.stop();
      this.wavesurfer.pause();
      this.rangeValue = 0;
      this.playTime = '00:00:00';
      this.playImgFlag = false;
    },
    //重新给这个插件的url赋值
    loadingAudio() {
      this.playImgFlag = false;
      this.waveReadyState = false;
      this.createWave();
    },
    //加载成功返回
    createWave() {
      const _that = this;
      let wavesurfer = (_that.wavesurfer = WaveSurfer.create({
        container: '#WaveSurfer_del',
        barHeight: 2,
        waveColor: '#E3E6EC',
        cursorColor: '#BCD8FD', //光标的颜色
        progressColor: '#BCD8FD', //进度条的颜色
        scrollParent: true, //试一次显示全部还是以滚动条的形式
        height: 180, //高度
        cursorWidth: 2, //光标的宽度
        autoCenter: true, //是否滚动
        fillParent: true, //
        hideScrollbar: false, //是否隐藏滚动条
        xhr: {
          withCredentials: true, //额外的请求xhr参数
        },
        plugins: [
          WaveSurfer.timeline.create({
            //时间线 plugin
            container: '#wave_timeline_del',
            height: 10,
          }),
          WaveSurfer.cursor.create({
            //光标 plugin
            container: '#wave_cursor_del',
            showTime: true,
            opacity: 1,
            customShowTimeStyle: {
              'background-color': '#000',
              color: '#fff',
              padding: '2px',
              'font-size': '10px',
            },
          }),
        ],
      }));
      axios({
        url: _that.audioUrlData,
        method: 'get',
        responseType: 'blob',
        headers: {
          token: 'PC_f5389b08f6b052af819e9479c3a8e820',
        },
      })
        .then((res) => {
          const blob = res.request.response;
          console.log('获取到的音频文件:', blob);
          console.log(_that.audioUrlData);
          // this.wavesurfer.load(_that.audioUrlData);
          wavesurfer.loadBlob(blob);
          // wavesurfer.load(_that.audioUrlData);
          this.loading = false;
        })
        .catch((error) => {
          console.log('获取音频文件失败:', error);
          console.log(_that.audioUrlData);
          this.loading = false;
        });
      // this.wavesurfer.load(this.audioUrlData);
      // console.log(_that.audioUrlData)

      //绑定事件
      //暂停时触发
      this.wavesurfer.on('finish', function () {
        _that.playImgFlag = false;
      });
      //播放时触发
      this.wavesurfer.on('audioprocess', function () {
        _that.rangeValue = _that.wavesurfer.getCurrentTime();
        _that.playTime = _that.hourTimeNum(parseInt(_that.rangeValue));
      });
      //读取成功
      this.wavesurfer.on('ready', function () {
        let timeline = Object.create(WaveSurfer.timeline);
        timeline.create({
          wavesurfer: _that.wavesurfer,
          container: '#wave_timeline_del',
        });
        _that.rangeMax = _that.wavesurfer.getDuration();
        _that.allTime = _that.hourTimeNum(parseInt(_that.rangeMax));
        _that.waveReadyState = true;
      });
      //鼠标点击
      this.wavesurfer.on('seek', function (e) {
        _that.rangeValue = _that.wavesurfer.getCurrentTime();
        _that.wavesurfer.play(_that.rangeValue);
        _that.playImgFlag = true;
      });
    },
    //播放
    playAudio() {
      if (this.waveReadyState) {
        this.wavesurfer.playPause();
        this.playImgFlag = !this.playImgFlag;
      } else {
        this.$message({
          message: '音频加载失败',
          type: 'warning',
        });
      }
    },
    //分钟数
    minutes(time) {
      let secondNum = parseInt(time) % 3600; //得到秒
      let minutes = '00';
      //分钟
      if (secondNum >= 60) {
        minutes =
          parseInt(secondNum / 60) >= 10
            ? parseInt(secondNum / 60)
            : '0' + parseInt(secondNum / 60);
      }
      return (
        minutes +
        ':' +
        (secondNum % 60 >= 10 ? secondNum % 60 : '0' + (secondNum % 60))
      );
    },
    //小时
    hourTimeNum(time) {
      //大于等于一个小时
      let hourStr = '00';
      if (time >= 3600) {
        hourStr =
          parseInt(time / 3600) >= 10
            ? parseInt(time / 3600)
            : '0' + parseInt(time / 3600);
      }
      return hourStr + ':' + this.minutes(time);
    },
    //点击改变range的值
    changeRangeValue(e) {
      console.log(e);
      this.wavesurfer.skip(e);
      this.playTime = this.hourTimeNum(parseInt(e));
      this.wavesurfer.play(e);
      this.playImgFlag = true;
    },
  },
  mounted() {
    this.loadingAudio();
  },
  destroyed() {
    if (this.wavesurfer) {
      this.wavesurfer.empty();
      this.wavesurfer.destroy();
    }
  },
};
</script>

<style scoped>
.tailorAudio_wrap {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tailorAudio_content {
  width: 759px;
  height: 507px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 21px 3px rgba(0, 0, 0, 0.27);
  border-radius: 7px;
  display: flex;
  flex-direction: column;
}
.SpeechText_header {
  width: 759px;
  height: 56px;
  background: rgba(241, 244, 246, 1);
  border-radius: 7px 7px 0px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 28px;
  box-sizing: border-box;
}
.SpeechText_header > span {
  font-size: 18px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}
.SpeechText_header > img {
  cursor: pointer;
}
.tailorAudio_timeVisCont {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 0 80px;
  box-sizing: border-box;
  height: 46px;
  border-bottom: 1px solid #e9ecf1;
  font-size: 17px;
}
.tailorAudio_contents {
  height: 317px;
  border-bottom: 1px solid #e9ecf1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.tailorAudio_visCont {
  height: 100%;
  width: 450px;
}
#WaveSurfer_wrap {
  height: 180px;
}
.rangeWrap,
.curoseBtn {
  width: 450px;
}
.rangeWrap {
  margin-top: 10px;
  position: relative;
}
.rangeWrap_left,
.rangeWrap_right {
  position: absolute;
  bottom: -10px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(96, 96, 96, 1);
}
.rangeWrap_left {
  left: -3px;
}
.rangeWrap_right {
  right: 0;
}
.rangeWrap /deep/ .el-slider__button.dragging,
.rangeWrap /deep/ .el-slider__button.hover,
.rangeWrap /deep/ .el-slider__button:hover {
  transform: scale(1);
}
.rangeWrap /deep/ .el-slider__button {
  width: 13px;
  height: 13px;
  border: 3px solid rgba(203, 226, 255, 1);
}
.rangeWrap /deep/ .el-slider__bar {
  background: #99c2f8;
}
.curoseBtn {
  display: flex;
  justify-content: center;
  align-items: center;
}
.curoseBtn > img {
  cursor: pointer;
}
.curoseBtn > img:nth-child(1) {
  transform: rotate(180deg);
  width: 35px;
  height: 30px;
}
.curoseBtn > img:nth-child(2) {
  margin: 0 40px;
  width: 35px;
  height: 45px;
}
.curoseBtn > img:nth-child(3) {
  width: 35px;
  height: 30px;
}
.curoseBtn > img:nth-child(4) {
  width: 35px;
  height: 35px;
  margin-left: 35px;
}
.footer {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 23px;
  box-sizing: border-box;
}
.tailorBtn_wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
}
</style>
