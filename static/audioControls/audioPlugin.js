// 设置audio的组件函数
// allImages{
//   play,  // 播放
//   stop,  // 暂停
//   TurnTheText,//转文字
//   tailor, //裁剪
//   dow, // 下载
// }
import { musicrecord } from '../../src/assets/interface/interface';
// let phoneHistoryVM = null
import { Message } from 'element-ui';
import './css/index.css';
function AddTamplat(
  appendEle,
  src,
  allImages,
  allDurationDisFlag = true,
  turnToTextCallback,
  tailorCallback,
  audioData,
) {
  // phoneHistoryVM = vm
  this.audioData = audioData;
  this.tailorCallback = tailorCallback;
  this.turnToTextCallback = turnToTextCallback;
  this.appendEle = appendEle;
  this.allImages = allImages;
  this.allDurationDisFlag = allDurationDisFlag;
  this.state = {
    src,
    eleId: '',
    controlId: '',
    thisAudio: '',
    thisPlayImg: '',
    playFlag: true, //  暂停和播放的控制
    duration: 0, //  获取整个音频的时间/秒
    durationNum: 0, //  获取和设置range的时间
    durationTime: '00:00',
    PlayDurationTime: '00:00',
    readyStateFlag: false, // 音频初始化
    Interval: '', //  实时监视播放时间
  };
}
/*
 ** randomWord 产生任意长度随机字母数字组合
 ** 用法  randomWord(leng);规定位数
 * arr变量可以把其他字符加入，如以后需要小写字母，直接加入即可
 */
AddTamplat.prototype.randomWord = function (leng) {
  var range = leng,
    arr = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'n',
      'm',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'y',
      'z',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ],
    letter = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];
  // 随机产生开头是字母的值
  let exp = /^[a-zA-Z]/;
  var str = '';
  for (var i = 0; i < range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  if (!exp.test(str)) {
    str = str.replace(
      /^[0-9]/,
      letter[Math.round(Math.random() * (letter.length - 1))],
    );
  }
  return str;
};
// 把所有的state挂载到this下并实现数据观察
AddTamplat.prototype.ApplyThis = function () {
  let data = this.state;
  for (let key in data) {
    let val = data[key];
    this[key] = data[key];
    Object.defineProperty(this, key, {
      enumerable: true,
      get() {
        return val;
      },
      set(newVal) {
        if (newVal != val) {
          val = newVal;
          if (key == 'durationTime' || key == 'PlayDurationTime') {
            if (document.getElementById(this.controlId)) {
              Array.from(
                document.getElementById(this.controlId).children,
              )[2].innerText = this.allDurationDisFlag
                ? this.PlayDurationTime + '/' + this.durationTime
                : this.PlayDurationTime;
            }
          } else if (key == 'durationNum') {
            let numStr =
              (Math.round(this.durationNum) / Math.round(this.duration)) * 100;
            if (document.getElementById(this.controlId)) {
              if (
                Array.from(document.getElementById(this.controlId).children)
                  .length != 0
              ) {
                if (
                  Array.from(
                    Array.from(
                      document.getElementById(this.controlId).children,
                    )[1].children,
                  ).length != 0
                ) {
                  document.getElementById(
                    this.controlId + 'rangeInput',
                  ).value = Math.round(this.durationNum);
                  Array.from(
                    Array.from(
                      document.getElementById(this.controlId).children,
                    )[1].children,
                  )[1].style.width = Math.round(numStr) + '%';
                }
              }
            }
          }
        }
      },
    });
  }
};
// 构造模板
AddTamplat.prototype.tamplat = function (isShow) {
  this.ApplyThis();
  this.eleId = this.randomWord(11);
  this.controlId = this.randomWord(11);
  return `<div class="audio_wrap">
      <audio id="${
        this.eleId
      }" flag='true' style="visibility: hidden;" @timeupdate="($event)" >
        <source src="" type="audio/ogg">
        <source src="" type="audio/mpeg">
        您的浏览器不支持 audio 元素。
      </audio>
      <div class="control_wrap " id="${this.controlId}" >
        <div class="playImg playImg_Del">
          <img src="${this.allImages.play}" alt="">
        </div>
		    <!--播放进度控制-->
        <div class="schedule" >
		      <input id="${
            this.controlId + 'rangeInput'
          }" type="range" max="${Math.round(
    Number(this.duration),
  )}" min="0" value="0" />
			    <div style='width:0px;'></div>
        </div>
		    <!--播放时间显示-->
        <div class="timeDis">${
          this.allDurationDisFlag
            ? this.PlayDurationTime + '/' + this.durationTime
            : this.PlayDurationTime
        }</div>
		    <div id="turn_to_text" class="img_del" style="display:${
          isShow ? 'none' : 'initial'
        }">
		      <img src="${this.allImages.TurnTheText}" alt="">
		    </div>
		    <div class="img_del" style="display:${isShow ? 'none' : 'initial'}">
		      <img src="${this.allImages.tailor}" alt="">
		    </div>
		    <!--下载-->
        <div class="downloadAuido img_del" style="display:${
          isShow ? 'none' : 'initial'
        }">
			    <img src="${this.allImages.dow}" alt="">
		    </div>
      </div>
    </div>`;
};
// 显示
AddTamplat.prototype.ifNumBigTen = function (data) {
  if (Number(data) < 10) {
    return '0' + Number(data);
  }
  return data;
};
AddTamplat.prototype.minute = function (Time) {
  // 分钟以上级别
  if (Time >= 60) {
    let AllTimeNum = Number(Time);
    let minutes = parseInt(AllTimeNum / 60);
    let second = parseInt(AllTimeNum % 60);
    return this.ifNumBigTen(minutes) + ':' + this.ifNumBigTen(second);
  } else if (Time < 60) {
    //    秒一下级别
    return '00:' + this.ifNumBigTen(parseInt(Time));
  }
};
//小时以上级别
AddTamplat.prototype.hour = function (Time) {
  let hourTimeNum = Time / 3600;
  let remainder = Time % 3600;
  let minutes = this.minute(parseInt(remainder));
  return this.ifNumBigTen(parseInt(hourTimeNum)) + ':' + minutes;
};

// 添加和读取音频
AddTamplat.prototype.addIncident = function (isShow) {
  this.appendEle.innerHTML = this.tamplat(isShow);
  const _that = this;
  let x = document.getElementById(this.eleId);
  this.thisAudio = x;
  this.thisPlayImg = document.getElementById(this.controlId).children[0];
  x.ontimeupdate = function (e) {
    // let currentTime = e.currentTarget.currentTime
    let currentTime = e.target.currentTime;
    if (currentTime >= 3600) {
      _that.PlayDurationTime = _that.hour(Math.round(currentTime));
      // 防止超出总时长
      if (_that.PlayDurationTime > _that.hour(x.duration)) {
        _that.PlayDurationTime = _that.hour(x.duration);
      }
    } else if (currentTime < 3600) {
      _that.PlayDurationTime = _that.minute(Math.round(currentTime));
      // 防止超出总时长
      if (_that.PlayDurationTime > _that.minute(x.duration)) {
        _that.PlayDurationTime = _that.minute(x.duration);
      }
    }
    _that.durationNum = currentTime;
  };
  x.src = this.src;
  x.load();
  let readyStateInterval = setInterval(() => {
    if (x.readyState == 4) {
      _that.readyStateFlag = true;
      _that.duration = x.duration; // 获得整个音频的时长
      // 设置整个音频的时长
      // 必须注意DOM的childDode 是否存在再进行下一步操作
      if (
        !!document.getElementById(_that.controlId) &&
        !!document.getElementById(_that.controlId).children[1].children[0]
      ) {
        document
          .getElementById(_that.controlId)
          .children[1].children[0].setAttribute('max', Math.round(x.duration));
        if (Number(x.duration) >= 3600) {
          _that.durationTime = _that.hour(x.duration);
        } else {
          _that.durationTime = _that.minute(x.duration);
        }
        clearInterval(readyStateInterval);
      }
    } else {
      _that.readyStateFlag = false;
    }
    clearInterval(readyStateInterval);
  }, 200);
  this.playAudio();
  // clearInterval(readyStateInterval)
};

// 绑定事件
AddTamplat.prototype.playAudio = function (slae) {
  const that = this;
  let playImg = document.getElementById(this.controlId).children[0];
  let rangeInp = document.getElementById(this.controlId).children[1]
    .children[0];
  that.thisAudio.addEventListener('pause', function () {
    //暂停状态Doing
    that.thisAudio.setAttribute('flag', 'true');
    if (document.getElementById(that.controlId)) {
      document.getElementById(
        that.controlId,
      ).children[0].innerHTML = `<img src="${that.allImages.play}" alt="">`;
    }
  });
  that.thisAudio.addEventListener('playing', function () {
    //播放状态Doing
    that.thisAudio.setAttribute('flag', 'false');
    if (document.getElementById(that.controlId)) {
      document.getElementById(
        that.controlId,
      ).children[0].innerHTML = `<img src="${that.allImages.stop}" alt="">`;
    }
  });
  playImg.addEventListener('click', function () {
    let allAudio = document.getElementsByTagName('audio');
    let playImg_Del = document.getElementsByClassName('playImg_Del');
    let flag = that.thisAudio.getAttribute('flag');
    Array.from(playImg_Del).forEach((ele) => {
      if (ele.children.length != 0) {
        ele.children[0].src = that.allImages.play;
      }
    });
    for (let i = 0; i < allAudio.length; i++) {
      allAudio[i].pause();
      allAudio[i].setAttribute('flag', 'true');
    }
    if (flag == 'true' && that.readyStateFlag) {
      that.thisAudio.play();
      if (document.getElementById(that.controlId)) {
        document.getElementById(
          that.controlId,
        ).children[0].innerHTML = `<img src="${that.allImages.stop}" alt="">`;
      }
      that.thisAudio.setAttribute('flag', 'false');
    } else if (flag == 'false' && that.readyStateFlag) {
      that.thisAudio.pause();
      if (document.getElementById(that.controlId)) {
        document.getElementById(
          that.controlId,
        ).children[0].innerHTML = `<img src="${that.allImages.play}" alt="">`;
      }
      that.thisAudio.setAttribute('flag', 'true');
    }
  });
  // 点击选择播放时间
  rangeInp.oninput = function (e) {
    let allAudio = document.getElementsByTagName('audio');
    let playImg_Del = document.getElementsByClassName('playImg_Del');
    if (that.readyStateFlag) {
      Array.from(playImg_Del).forEach((ele) => {
        if (ele.children.length != 0) {
          ele.children[0].src = that.allImages.play;
        }
      });
      for (let i = 0; i < allAudio.length; i++) {
        allAudio[i].pause();
        allAudio[i].setAttribute('flag', 'true');
      }
      if (that.thisAudio.currentTime >= that.duration) {
        that.durationNum = 0;
        that.thisAudio.setAttribute('flag', 'true');
        if (document.getElementById(that.controlId)) {
          document.getElementById(
            that.controlId,
          ).children[0].innerHTML = `<img src="${that.allImages.play}" alt="">`;
        }
      }
      if (parseInt(that.thisAudio.currentTime) != parseInt(e.target.value)) {
        that.thisAudio.currentTime = e.target.value;
        that.thisAudio.play();
        if (document.getElementById(that.controlId)) {
          document.getElementById(
            that.controlId,
          ).children[0].innerHTML = `<img src="${that.allImages.stop}" alt="">`;
        }
        that.thisAudio.setAttribute('flag', 'false');
      }
    }
  };
  // 转文字
  let allChildren = document.getElementById(that.controlId).children;

  // 获取当前地址栏头部
  let url = window.location.href;
  let isOpenFunction_AudioToText = false;
  let IsZengChengOrYangZhou =
    window.g.IsZengChengProject || window.g.IsYangZhouProject; // 增城项目
  url = url.substr(0, url.indexOf('#'));
  allChildren[allChildren.length - 3].onclick = function () {
    // if (IsZengChengOrYangZhou) { // 增城或扬州项目是否开通语音转文字功能
    // 	isOpenFunction_AudioToText = true
    // }
    // if (!isOpenFunction_AudioToText) {
    // 	Message.info('暂未开通语音转文字功能，请开通后再使用。')
    // 	return;
    // }
    if (
      that.audioData.type === '未接' ||
      that.audioData.url === '' ||
      that.audioData.direct === '未接' ||
      that.audioData.recordFile === ''
    ) {
      let msg =
        that.audioData.type === '未接' || that.audioData.direct === '未接'
          ? '未接号码没有录音文件'
          : '不存在录音文件';
      Message.error(msg);
      return;
    }
    if (that.thisAudio.src == url) {
      return;
    } else {
      console.log( that.thisAudio.src, that.audioData)
      that.turnToTextCallback(that.thisAudio.src, that.audioData);
    }
  };
  // 裁剪
  allChildren[allChildren.length - 2].onclick = function () {
    if (
      that.audioData.type === '未接' ||
      that.audioData.url === '' ||
      that.audioData.direct === '未接' ||
      that.audioData.recordFile === ''
    ) {
      let msg =
        that.audioData.type === '未接' || that.audioData.direct === '未接'
          ? '未接号码没有录音文件'
          : '不存在录音文件';
      Message.error(msg);
      return;
    }
    if (that.thisAudio.src == url) {
      return;
    }
    that.tailorCallback(that.thisAudio.src);
  };
  // 下载
  document.getElementById(
    that.controlId,
  ).lastElementChild.onclick = function () {
    // 检查是否有录音文件 date:2020-10-21 author:hexinting bug7588
    if (
      that.audioData.type === '未接' ||
      that.audioData.url === '' ||
      that.audioData.direct === '未接' ||
      that.audioData.recordFile === ''
    ) {
      let msg =
        that.audioData.type === '未接' || that.audioData.direct === '未接'
          ? '未接号码没有录音文件'
          : '不存在录音文件';
      Message.error(msg);
    } else {
      console.log('录音文件地址：', that.thisAudio.src);
      let eleLink = document.createElement('a');
      eleLink.download = '电话录音.wav';
      eleLink.style.display = 'none';
      if (that.src == url) {
        return;
      }
      eleLink.href = that.thisAudio.src;
      // 触发点击
      document.body.appendChild(eleLink);
      eleLink.click();
      // 然后移除
      document.body.removeChild(eleLink);
    }
  };
};

export default AddTamplat;
