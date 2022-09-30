<template>
  <div class="releWrap_wrap" v-if="wrap_flag">
    <!--关联事件-->
    <div class="releWrap">
      <h3 class="releTitle">
        <span>通话结束</span>
        <img
          @click="close"
          src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNy4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuWbvuWxgl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9IjIwMHB4IiBoZWlnaHQ9IjIwMHB4IiB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMjAwIDIwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMTAwLDEyMS4ybDQ5LjUsNDkuNWM1LjksNS45LDE1LjMsNS45LDIxLjIsMGM1LjktNS45LDUuOS0xNS4zLDAtMjEuMkwxMjEuMiwxMDBsNDkuNS00OS41DQoJYzUuOS01LjksNS45LTE1LjMsMC0yMS4yYy01LjktNS45LTE1LjMtNS45LTIxLjIsMEwxMDAsNzguOEw1MC41LDI5LjNjLTUuOS01LjktMTUuMy01LjktMjEuMiwwcy01LjksMTUuMywwLDIxLjJsMCwwTDc4LjgsMTAwDQoJbC00OS41LDQ5LjVjLTUuOSw1LjktNS45LDE1LjMsMCwyMS4yczE1LjMsNS45LDIxLjIsMEwxMDAsMTIxLjJMMTAwLDEyMS4yeiIvPg0KPC9zdmc+DQo="
          alt
        />
      </h3>
      <!--             联系人内容-->
      <div class="human_Content">
        <!--               有联系人信息-->
        <div v-if="userInfoFlag" class="human_Content_wrap">
          <img
            src="data:image/png;base64,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"
            alt
          />
          <p class="pcon">姓名：{{ userInfo.name ? userInfo.name : " " }}</p>
          <p>单位：{{ userInfo.workUnit ? userInfo.workUnit : " " }}</p>
          <p>职务：{{ userInfo.position ? userInfo.position : " " }}</p>
        </div>
        <!--               没联系人信息-->
        <div v-else class="human_Content_wrap">
          <img
            src="data:image/png;base64,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"
            alt
          />
          <p class="pcon">未知联系人</p>
          <button class="addHuamn">
            <span @click="newcontactsHandles">添加至通讯录</span>
          </button>
        </div>
      </div>
      <!--录音文件的下-->
      <div class="recording">
        <audio id="audio">
          <source src type="audio/ogg" />
          <source src type="audio/mpeg" />
          您的浏览器不支持 audio 元素。
        </audio>
        <div class="controller">
          <img
            @click="trianglePlay"
            v-if="playFlag"
            style="margin-right: 5px;cursor: pointer;"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAABEElEQVQ4T2NkQAUSQG42EPsAMQtU6geQ3gHEE4H4DUw5I5K+YCC7BoinAvEKIP4CleMB0hFQA1uA9FqQOEwjSFMBEPsC8Qc0V8C4AkDGZiDuAeKNII0g520HYkc8mpA17wdyXEEam4H4IRDPQbJpOZA9AYhPYrE9BSgmD9J4HohtkfwEUvsaiI8AMSgwKqE0zAyQn/eDNF4GYl00k+8D+YpAHADE9UAM8tdSJDWXCWn0BypuwKURl1PPADU8wedUUOA8AOK5SE4BBQ4owk+geQHETQZiBYqiA2RKCBDnAzExCaAXqG4DcpIDaa4G4ilAvBKIkZNcOJCfA8SNIE0gm5A1gviwRO4BZHNA/Yc1kQMAI/ZAecFwqOUAAAAASUVORK5CYII="
            alt
          />
          <img
            @click="trianglePlay"
            v-if="!playFlag"
            style="margin-right: 5px;cursor: pointer;"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAABC0lEQVQ4T2NkQAWSQG4mEPsAsTRU6imQ3gjE04H4FUw5I5K+ICC7F4i3A/FaID4LlTMG0sFQw3KA9CaQOEwjSNNkIPYG4gtoroBxDYCMrVAXbQJpBDnvOBAHIGkKA7IPQHU4AOlVUDZIM8jZpiCNTUAsAsRZSDadB7Ibofx6IG2IJDcNyH4F0ghSVALEe4nUCHJBP0jjSyBWB+IPRGoUAKq7SY5GkLeuwpxaiBQYIIvx+RHuVFIDB5QQXoJsFAPi00DsD8SwOCQqOkBOgyUADyD7MlIgITMxEgBMEqS5H4hBSQqU5ED+BLkIpAEkB3JRLlQenuRgmkHOBqVHXyCWggo+A9Kg1AKOeJhCAGX9QKtbAxBkAAAAAElFTkSuQmCC"
            alt
          />
          <p>
            <span>{{ stratTime }}</span
            >/
            <span>{{ duration }}</span>
          </p>
          <input
            type="range"
            ref="myrange"
            @input="changeInpVal"
            :max="parseInt(durationTime)"
            min="0"
            value="0"
          />
          <img
            @click="setdefaultMuted"
            v-if="!defaultMuted"
            class="vox"
            id="vox"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAABXUlEQVQ4T2NkwAIuXrzI/fXr163//v07ZGNjU4dNDSO64OHDh+WYmJiOMDIyygLxEUtLS1uCGo8ePeoGVLwTphBZ47Fjx2r///+/x9ra+jhIHmwjUIARKJECVDgL2XRkjUBDZwL5KX///k21tbWdB9IwHajYCoj10J0E0whUw8nPz//3w4cPU4Biqd+/f1cAafyPzQ9g50D9CLRtI5CrCHSmPlD9fWCgzSJK45EjR6SAAfYU6CVDoAElQDYzURr379/Pw87O/vnPnz/aLCwsDUDN34nSCHTqcaCzn7CxscX//PnzJZDdCNKoAjRBF4jX4QqckydPCvPw8Hz++PHjIZBfgQaowRMA0B/aQLefBkpw4ojH/UBxC6Bz7e3s7E6hpBxQIACdsRGITZBDFcQGJY5fv35dcnR0fAFPAMhO3LZtG7uAgMBioFgo0UkOZgA0JdUDQ/Cqubn5amzxDABEMKZTVxy+1wAAAABJRU5ErkJggg=="
            alt
          />
          <img
            @click="setdefaultMuted"
            v-if="defaultMuted"
            class="vox"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAB8UlEQVQ4T3WSO0jbURTGvXmYpMVBSaCSjIVit9IMeZhgoDhph9LaybaKFHR0UNBJSgZFKE6Kgq2IoOlgh0KRKjE1ydKgCGKFbEJAyCAhQh6a/P2d0D8Yk1643Hse33e+e+5RkUjE6HQ635XL5fVQKHTTwkomk880TdtVSu35fL4B8d1fKh6PtxkMhjSBw1Kp9NJisTzm/ldPxGeDsPiPMFqpVN4HAoFzJY5YLNZlNptjVDmCZJVz8z/ADVR0ejyeF1LxCcmPblgmk+lXtVrdhuQbzNsClopWqzVcLBanXS6Xls1mM4CHFO8pELdSZY89A8ku9ib3LAnjAB8g/ww77Pf7VxKJxAI5HQLUdFkED0j+iH3KnsVuzeVyU3a7vQtBhw6Hw0bFHmJLdUAhIPkEuaNGo1FIxrxe76L4qXTJEcJ3Rc6fBqBg2Tu8MQz4N0nDSPyqA7EdSF1uBqwVpuoO7D/Zn7n3c77JZDIjNGiCuE/BJJK6m30y7LPELojN88bXwWDwOz05w55TqVTKnM/nH/IVCmkLOAfvksh30FXxf0BiH0/oY8omawOgL9hsVPlClbf3B4DYGr5XxPpp2H4dUJLT6bSFlie4Phe7leV2u6/lDngL4l6a1d4AlIRoNGpC3if5BYb8h15dnlUoFJ4yq8e3goUQVQ7wyU4AAAAASUVORK5CYII="
            alt
          />
          <img
            class="download"
            @click="download"
            id="download"
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAANCAYAAACpUE5eAAACGUlEQVQ4T8VSPUgbYRjOl8vdNd5JfiBQ6CbUwQwdDCEJIXBrWjqV4CTudRBU6FBISkEHUZykWwdBIREXwSFLkktIQiC06SAtwU1KCSheScS75C4+r0Q4xL/Ng+P93vd7nuf9+V7meORrt9tip9OZBayvadpuMpnUH6KwxwQLhcILQRAWCWcYxrqiKJfPLzgcDlmj0fDDUpumLMsLVFW32930eDwcY4wPh8NnsMPb1d7ZMgnWarUPsArHcSumac4REQLfYZZga5FIJPdkQeKqqvrS5XJtQbQA/xUJOp3OE0oyGAw+JhKJfwjdX2Gr1ZJ6vZ5X13WtVCpdpNNpqvI1BLYhdEyCOE/AzEaj0XYul3P4fD5ZkiQZnNObx2IAOZvNph/BdyCmQFhEO3/QjkUvjJanUenOSHAGL/2DyOBxSBhH/LNlWRvw6/F4/JyVy+UJkL7iYhIi87j4lc/n9UwmY5FIpVIZR/wt4hYqOgwGg10aCc25WCyOud3uBARXEVOxXiusWq2qcIIAfIH9SQsMgIEkR7FY7HrnstksTzaVSvWBc0BIEkVxiqpEMgG/gvMy/gMSPAfWDeeC2hytAVXxCRn3QqFQ374aNAae59MYD728MLrjYCVo/CbBfTjv6RFtRBKuYK4z2L3/dsFAIOBHBweIvbHHcTbxf2P1ej0JwBocrx2AbJeoWEPMuEUUR9ib6q6vgf+LquevAND6FCKDtloSAAAAAElFTkSuQmCC"
            alt
          />
        </div>
      </div>

      <!--事件的备注和关联-->
      <div class="incident">
        <div class="events">
          <span>关联事件：</span>
          <div>
            <select v-model="selectVal">
              <option
                v-for="(item, index) in seletData"
                :key="index"
                :value="item.id"
                >{{ item.title }}</option
              >
            </select>
          </div>
          <button class="addyaoqing" @click="increased">新增要情</button>
        </div>
        <div class="events">
          <span>备注：</span>
          <div>
            <textarea
              maxlength="150"
              v-model="ramakVal"
              @input="changeTextValue($event)"
              cols="30"
              rows="10"
            ></textarea>
            <span class="textareaValueNum">字数{{ isnum }}/{{ maxNum }}</span>
          </div>
        </div>

        <div></div>
      </div>
      <!--按钮-->
      <div class="btn_wrap">
        <button class="cancel" @click="close">取消</button>
        <button class="save" @click="save">保存</button>
      </div>
    </div>
    <newcontacts ref="newcontactsTow"></newcontacts>
  </div>
</template>

<script>
import url from "../../../mock/modules/url";
import newcontacts from "@/views/modules/sys/mailList/mailList-add";
export default {
  name: "relevance",
  data() {
    return {
      seletData: [],
      wrap_flag: false,
      audio: "",
      duration: "00:00",
      durationFlag: true,
      stratTime: "00:00",
      underway: "",
      durationTime: 0,
      setIntVal: "",
      playFlag: true, // 暂停和播放
      defaultMuted: false, // 是否静音
      playOneFlag: true,
      overAudio: false,
      isnum: 0,
      maxNum: 150,
      blob: "",
      ramakVal: "", // 备注字段
      selectVal: "", // 选择的值
      phoneInfoId: "", // 电话ID
      phoneNum: "",
      userInfo: "", // 用户信息
      userInfoFlag: false,
      datas: ""

      // phoneInfo: {} // 电话信息
    };
  },
  mounted() {
    this.httpEmergencyList();
  },
  methods: {
    init(data) {
      console.log("电话信息", data);
      this.datas = data;
      this.wrap_flag = true;
      this.phoneInfoId = data.cdrId;
      this.shitin(data.cdrId);
      this.phoneNum = data.callType == 0 ? data.phoneCalling : data.phoneCalled;
      this.humanListDat(this.phoneNum);
      this.httpEmergencyList();
    },
    getAudio() {
      if (this.wrap_flag) {
        let that = this;
        let audio = document.getElementById("audio");
        this.audio = audio;
        setInterval(function() {
          if (that.durationFlag) {
            that.audioDuration();
          }
        }, 1000);
      }
    },
    audioDuration() {
      // console.log(this.audio.duration)
      let playTime = this.audio.duration ? this.audio.duration : 0;
      this.durationTime = playTime;
      if (this.audio.duration) {
        this.durationFlag = false;
      }
      // playTime
      let shi = parseInt(playTime / 60 / 60);
      let fen = parseInt(playTime / 60);
      let miao = parseInt(playTime % 60);
      let str = "";
      shi = this.bothStr(shi);
      fen = this.bothStr(fen);
      miao = this.bothStr(miao);
      if (shi && shi != "00") {
        str = shi + ":" + fen + ":" + miao;
      } else {
        str = fen + ":" + miao;
      }
      this.duration = str || "00:00";
    },
    trianglePlay() {
      if (this.playFlag) {
        this.audio.play();
        this.playFlag = false;
        // console.log('播放')
      } else {
        this.audio.pause();
        this.playFlag = true;
        // console.log('暂停')
      }
      if (this.playOneFlag) {
        this.watchAudioTime();
        this.playOneFlag = false;
      }
    },
    watchAudioTime() {
      let that = this;
      clearInterval(this.setIntVal);
      this.setIntVal = setInterval(function() {
        that.$refs.myrange.value = that.audio.currentTime;
        let shi = parseInt(that.audio.currentTime / 60 / 60);
        let fen = parseInt(that.audio.currentTime / 60);
        let miao = parseInt(that.audio.currentTime % 60);
        let str = "";
        shi = that.bothStr(shi);
        fen = that.bothStr(fen);
        miao = that.bothStr(miao);
        if (shi && shi != "00") {
          str = shi + ":" + fen + ":" + miao;
        } else {
          str = fen + ":" + miao;
        }
        that.stratTime = str;

        if (that.audio.currentTime == that.durationTime) {
          that.overAudio = true;
          that.playOneFlag = false;
          clearInterval(that.setIntVal);
        }
        // console.log(that.audio.currentTime)
      }, 10);
    },
    bothStr(val) {
      if (val < 10) {
        return "0" + val;
      }
      return val;
    },
    changeInpVal() {
      if (this.overAudio) {
        this.audio.play();
        this.playOneFlag = true;
        this.audio.currentTime = this.$refs.myrange.value;
        this.watchAudioTime();
        // console.log('结束后播放')
        this.overAudio = false;
      } else {
        this.audio.currentTime = this.$refs.myrange.value;
      }
    },
    setdefaultMuted() {
      if (this.defaultMuted) {
        this.audio.volume = 1;
      } else {
        this.audio.volume = 0;
      }
      this.defaultMuted = !this.defaultMuted;
    },
    jiema(res) {
      let sliceSize = 512;
      let byteCharacters = atob(res);
      let byteArrays = [];
      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);
        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      let blob = new Blob(byteArrays);
      return blob;
    },
    shitin(cdrId) {
      this.$http({
        url: this.$http.adornUrl(url.phoneinfoAudioFlie.url + "/" + cdrId),
        method: url.phoneinfoAudioFlie.method,
        data: this.$http.adornParams({})
      }).then(res => {
        let that = this;
        let audio = document.getElementById("audio");
        console.log("电话号码", this.phoneNum);

        // this.phoneInfo = res.data.phoneInfo;

        audio.src =
          window.SITE_CONFIG["RecordFlieUrl"] + res.data.phoneInfo.recordFile;
        this.blob =
          window.SITE_CONFIG["RecordFlieUrl"] + res.data.phoneInfo.recordFile;
        audio.load();
        that.getAudio();
      });
    },
    download() {
      if (this.blob) {
        let aTag = document.createElement("a");
        aTag.download = "电话录音.wav";
        // aTag.href = URL.createObjectURL(this.blob)
        aTag.href = this.blob;
        aTag.click();
        aTag.remove();
        aTag = null;
        // window.URL.revokeObjectURL(this.blob)
      }
    },
    changeTextValue(e) {
      this.isnum = e.target.value.length;
    },
    close() {
      this.wrap_flag = false;
      this.audio = "";
      this.duration = "00:00";
      this.durationFlag = true;
      this.stratTime = "00:00";
      this.underway = "";
      this.durationTime = 0;
      this.playFlag = true; // 暂停和播放
      this.defaultMuted = false; // 是否静音
      this.playOneFlag = true;
      this.overAudio = false;
      this.isnum = 0;
      this.maxNum = 150;
      this.blob = "";
      this.selectVal = "";
      this.phoneInfoId = "";
      this.ramakVal = "";
      clearInterval(this.setIntVal);
    },
    // 添加联系人
    newcontactsHandles() {
      this.$refs.newcontactsTow.init();
    },
    httpEmergencyList() {
      let that = this;
      this.$http({
        url: this.$http.adornUrl(url.emergencyList.url),
        method: url.emergencyList.method,
        params: this.$http.adornParams()
      }).then(res => {
        // console.log(res.data)
        if (res.data.code === 0) {
          console.log(res.data.data);
          that.seletData = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 保存
    save() {
      this.$http({
        url: this.$http.adornUrl(url.savePhoneEmergencyProcess.url),
        method: url.savePhoneEmergencyProcess.method,
        params: this.$http.adornParams({
          emergencyInfoId: this.selectVal,
          phoneInfoId: this.phoneInfoId,
          remark: this.ramakVal
        })
      }).then(res => {
        console.log("保存成功", res.data);
        if (res.data.code === 0) {
          this.close();
          this.$message({
            message: "保存成功",
            type: "success"
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    humanListDat(data) {
      // console.log(data)

      let that = this;
      this.$http({
        url: this.$http.adornUrl(url.liknHuman.url),
        method: url.liknHuman.method,
        data: this.$http.adornParams({
          groupId: [],
          search: data,
          limit: 1,
          page: 1
        })
      }).then(res => {
        console.log("humanListDathumanListDat", res);
        if (res.data.data.list.length != 0) {
          this.userInfoFlag = true;
          this.userInfo = res.data.data.list[0];
        } else {
          this.userInfo = [];
          this.$message.error(res.data.msg);
        }
      });
    },
    increased() {
      this.close();
      this.$router.push({
        path: "/emergencyinfo-add-or-update",
        query: { status: "audio", id: 0, item: this.datas }
      });
    }
  },
  components: {
    newcontacts
  }
};
</script>

<style scoped>
.releWrap_wrap {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999999;
}
.releWrap {
  width: 400px;
  height: 560px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}
.releTitle {
  height: 40px;
  background: #00a9f2;
  font-size: 15px;
  text-align: center;
  line-height: 40px;
  color: #fff;
  position: relative;
  margin: 0;
}
.releTitle > img {
  width: 13px;
  height: 13px;
  position: absolute;
  right: 6px;
  top: 6px;
  cursor: pointer;
}
.human_Content {
  height: 183px;
  width: 100%;
  background: #f1f1f1;
}
.human_Content_wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.human_Content_wrap > img {
  width: 78px;
  height: 97px;
  margin-top: 13px;
}
.human_Content_wrap > p {
  margin: 0;
  color: #a4a4a4;
  font-size: 12px;
  transform: scale(0.9);
}
.human_Content_wrap > .pcon {
  margin-top: 10px;
}
.addHuamn {
  width: 76px;
  height: 22px;
  background: rgba(0, 169, 242, 1);
  border-radius: 3px;
  text-align: center;
  height: 22px;
  border: 0;
  padding: 0;
  margin-top: 12px;
  cursor: pointer;
  outline: none;
}
.addHuamn > span {
  transform: scale(0.86);
  font-size: 12px;
  color: #fff;
  display: block;
}
.triangle {
  border: 7px solid transparent;
  border-left-color: #ccc;
  cursor: pointer;
}
.recording {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px dashed #ccc;
}
.controller {
  display: flex;
  align-items: center;
}
.controller > p {
  margin: 0;
  margin-right: 10px;
}
.vox {
  margin-right: 12px;
  cursor: pointer;
}
.download {
  cursor: pointer;
}
.controller input[type="range"] {
  outline: none;
  margin-right: 50px;
}
.controller input[type="range"] {
  -webkit-appearance: none; /*清除系统默认样式*/
  width: 146px;
  background: -webkit-linear-gradient(#ddd, #ddd) no-repeat, #ddd; /*设置左边颜色为#61bd12，右边颜色为#ddd*/
  background-size: 75% 100%; /*设置左右宽度比例*/
  height: 2px; /*横条的高度*/
  border-radius: 0.1rem;
}
/*拖动块的样式*/
.controller input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; /*清除系统默认样式*/
  height: 8px; /*拖动块高度*/
  width: 8px; /*拖动块宽度*/
  background: #fff; /*拖动块背景*/
  border-radius: 50%; /*外观设置为圆形*/
  border: solid 1px #ddd; /*设置边框*/
}
#audio {
  visibility: visible;
  display: block !important;
}
.incident > div:first-child {
  margin-top: 24px;
  margin-bottom: 13px;
}
.events {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative;
}
.events > span {
  display: block;
  width: 15%;
  font-size: 12px;
  transform: scale(0.96);
  text-align: right;
}
.events > div {
  width: 75%;
  position: relative;
}
.events > div > select {
  width: 147px;
  outline: none;
  border: 1px solid rgba(230, 230, 230, 1);
  border-radius: 5px;
}
.events > div > textarea {
  width: 268px;
  height: 124px;
  outline: none;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(230, 230, 230, 1);
  resize: none;
  overflow: auto;
}
.events > div > span {
  position: absolute;
  bottom: -15px;
  right: 32px;
  color: #c2c2c2;
}
.btn_wrap {
  margin-top: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn_wrap > button {
  outline: none;
  width: 49px;
  height: 22px;
  background: #00a9f2;
  border-radius: 3px;
  border: none;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
}
.cancel {
  margin-right: 59px;
}
.addyaoqing {
  position: absolute;
  top: 0;
  right: 90px;
  background: #00a9f2;
  border-radius: 3px;
  border: none;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  outline: none;
}
</style>
