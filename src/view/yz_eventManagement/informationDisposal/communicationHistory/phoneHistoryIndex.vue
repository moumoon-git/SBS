
<template>
  <div class="phoneHistoryIndex_wrap" style="height: 100%;">
    <div style="height: 100%;">
      <!--
          expandSelectRow点击展开行
          getChildrenSeachData 获取搜索的数据
          TurnTheText 语音转文字
          SeeTheHistory 查看历史
          callback 回拨
          saveEvent  保存
          tailor_del  裁剪
      -->
      <bigTemplate
        ref="bigTemplate"
        @expandSelectRow="expandSelectRow"
        @getChildrenSeachData="getChildrenSeachData"
        @TurnTheText="TurnTheText"
        @SeeTheHistory="SeeTheHistory"
        @callback="callback"
        @saveEvent="saveEventInfo"
        @tailor_del="tailor_del"
        @clickRow="phoneClick"
      ></bigTemplate>
      <!--      <phoneHistory-->
      <!--        ref="phoneHistory"-->
      <!--        @TurnTheText="TurnTheText"-->
      <!--        @callback="callback"-->
      <!--      >-->
      <!--      </phoneHistory>-->
    </div>
    <SpeechText
      ref="SpeechText"
      v-show="SpeechTextFlag"
      @cellRemark="cellRemark"
      @closeSpeechTextEle="closeSpeechTextEle"
    ></SpeechText>

    <tailorAudio ref="tailorAudio" v-if="tailorAudioFlag" @tailorAudioClose="tailorAudioClose"></tailorAudio>
    <InformaHistory
      v-show="InformaHistoryFlag"
      @closeInformaHis="closeInformaHis"
      ref="InformaHistory"
    ></InformaHistory>
  </div>
</template>

<script>
import InformaHistory from "./comonnTemplat/InformaHistory";
import SpeechText from "./comonnTemplat/SpeechText";
import tailorAudio from "./comonnTemplat/tailorAudio";
import bigTemplate from "./comonnTemplat/bigTemplate";
import phoneHistory from "@/view/yz_History/phoneHistory/phoneHistory";
import audioControls from "../../../../../static/audioControls/audioPlugin";
import mixin from "@/view/yz_integratedCommunication/icpPhone/icpPhonePage/mixin";
import axios from "axios";
import {mapGetters} from 'vuex'
import mixin2 from '@/view/yangZhouEventReports/assets/js/mixin/mixin.js';

const allApiRequest = require('@/assets/js/weblfasr/weblfasr.js').default;

export default {
  mixins: [mixin, mixin2],
  name: "phoneHistoryIndex",
  data() {
    return {
      InformaHistoryFlag: false,
      //语音转文字的显示控制
      SpeechTextFlag: false,
      tailorAudioFlag: false,
      // 表格的数据
      currentPage: 1,
      startTime: "",
      endTime: "",
      pageSize: 10,
      input: "",
      stateValue: "",
      expandSelectRowData: {}, //点击展开列的时候获取的列数据
      historyArray: [], //查看历史的数据
    };
  },
  watch: {},
  methods: {
    phoneClick(row, index) {
      this.$emit("phoneClick", row, index);
    },
    expandSelectRow(data) {
      this.expandSelectRowData = data;
      // console.log(data)
      data.sendType = "phone";
      data.sendTypeId = data.id;
      this.$store.dispatch("msgHeadleDatas", data);
    },
    //初始化数据
    initData() {
      this.currentPage = 1;
      this.startTime = "";
      this.endTime = "";
      this.pageSize = 10;
      this.input = "";
      this.stateValue = "";
      // 回拨设否 初始化 qinjiaqi
      sessionStorage.setItem("isCallback", false);
    },
    //请求的数据
    getRequeryCell() {
      let data = {
        beginTime: this.startTime,
        endTime: this.endTime,
        key: this.input,
        page: this.currentPage,
        size: this.pageSize,
        statusId: this.stateValue
      };
      this.$api.getUnhandledPhone(data).then(res => {
        if (res.errorcode == 0) {
          console.log(res.data.data);
          if (res.data) {
            if (res.data.data.length != 0) {
              res.data.data[0].sendType = "phone";
              res.data.data[0].sendTypeId = res.data.data[0].id;
              this.$store.dispatch("msgHeadleDatas", res.data.data[0]);
            }
          }
          // bug9683 控制台报错新增判断  date: 2020.12.23 author:husiyue
          if(this.$refs.bigTemplate !== undefined){
            this.$refs.bigTemplate.footerPageObj.allData = res.data.data;
            this.$refs.bigTemplate.footerPageObj.total = res.data.total;
          }
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    //获取状态列表
    getStateListData() {
      let data = {
        pcode: "information_processing_status"
      };
      this.$api.eventGetByPcodes(data).then(res => {
        if (res.errorcode == 0) {
          // console.log(res.data)
          if(this.$refs.bigTemplate !== undefined){
            this.$refs.bigTemplate.stateListData = res.data;
            this.$refs.bigTemplate.processData = res.data;
          }
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    //从子组件传过来的数据
    getChildrenSeachData(data) {
      this.startTime = this.$refs.bigTemplate.startTime;
      this.endTime = this.$refs.bigTemplate.endTime;
      this.input = this.$refs.bigTemplate.input;
      this.currentPage = this.$refs.bigTemplate.currentPage;
      this.pageSize = this.$refs.bigTemplate.footerPageObj.pageSize;
      this.stateValue = this.$refs.bigTemplate.stateValue;
      this.getRequeryCell();
    },
    //裁剪
    tailor_del(obj) {
      // console.log(obj.src)
      const _that = this;
      _that.tailorAudioFlag = true;
      // this.$refs.tailorAudio.audioUrlData = 'https://webfs.yun.kugou.com/202004171340/d2afae3feabfb9c2dddf35123194fade/G204/M04/14/15/rJQEAF54mXyARH7pADhZBi3y7ww709.mp3'
      setTimeout(() => {
        _that.$refs.tailorAudio.audioUrlData = obj.src;
        _that.$refs.tailorAudio.expandSelectRowData = _that.expandSelectRowData;
        _that.$refs.tailorAudio.loadingAudio();
      }, 100);
    },
    /**
	 * @author hexinting
	 * @param 无
	 * @date 2020-10-14
	 * @lastEditor hexinting
	 * @lastDate 2020-11-11
	 * @description 语音转文字
	 */
    async TurnTheText(res) {
      this.$refs.SpeechText.textarea = '';
      this.SpeechTextFlag = true;
      this.$store.commit('setTurnToTextLoading', { loading: true });

      const { src, obj } = res;
      console.log(obj);
      if (obj.text) {
        this.$refs.SpeechText.textarea = obj.text;
        this.$store.commit('setTurnToTextLoading', { loading: false });
      } else {
        if (!src || src === '') {
          this.$message.error('不存在录音文件');
          this.$store.commit('setTurnToTextLoading', {
              loading: false,
          });
        } else {
          let response = await allApiRequest(src, { id: obj.id });
          this.$refs.SpeechText.textarea = response;
          this.$store.commit('setTurnToTextLoading', {
              loading: false,
          });
        }
      }
      // 注释原因： phoneToText 改成使用科大讯飞的方法 (author：hexinting；date:2020-10-14)
      // console.log("turn the text func worked", res);
      //   let data = {
      //     phoneId: res.id
      //   };
      //   this.$api.phoneToText(data).then(res => {
      //     if (res.errorcode == 0) {
      //       // console.log(res.msg)
      //       if (res.msg == "暂无数据") {
      //         this.$message("暂无数据");
      //       } else {
      //         this.$refs.SpeechText.textarea = res.data;
      //         this.SpeechTextFlag = true;
      //       }
      //     } else {
      //       this.$message({
      //         message: res.msg,
      //         type: "error"
      //       });
      //     }
      //   });

      // ---2020.7.6 使用讯飞的，先注释百度的
      // if (!JSON.parse(sessionStorage.getItem("phoneticTranscription"))) {
      //   sessionStorage.setItem(
      //     "phoneticTranscription",
      //     JSON.stringify({
      //       voiceAccessToken: "",
      //       voiceAccessTokenOverdue: true
      //     })
      //   );
      // }
      // let textRecognition = JSON.parse(
      //   sessionStorage.getItem("phoneticTranscription")
      // ); // 存储的语音转写对象

      // if (textRecognition.voiceAccessTokenOverdue) {
      //   // 获取百度AI access_token
      //   axios
      //     .get(
      //       "/api/oauth/2.0/token?grant_type=client_credentials&client_id=X3Z1OAofmdi17h6BjKpSadj2&client_secret=GiMhHr2cG9uSLCaGgEDpK9uHMq4S9Glf"
      //     )
      //     .then(res => {
      //       sessionStorage.setItem(
      //         "phoneticTranscription",
      //         JSON.stringify({
      //           voiceAccessToken: res.data.access_token,
      //           voiceAccessTokenOverdue: false
      //         })
      //       );
      //       setTimeout(() => {
      //         sessionStorage.setItem(
      //           "phoneticTranscription",
      //           JSON.stringify({
      //             voiceAccessToken: res.data.access_token,
      //             voiceAccessTokenOverdue: true
      //           })
      //         );
      //       }, res.data.expires_in * 1000);
      //     });
      // }

      // // 百度AI 语音转写
      // let data = {
      //   speech_url: window.g.ApiUrl + res.url,
      //   format: "wav",
      //   pid: 80001,
      //   rate: 16000
      // };
      // axios
      //   .post(
      //     `/api/rpc/2.0/aasr/v1/create?access_token=${textRecognition.voiceAccessToken}`,
      //     data
      //   )
      //   .then(res => {
      //     let data2 = {
      //       task_ids: [res.data.task_id]
      //     };
      //     axios
      //       .post(
      //         `/api/rpc/2.0/aasr/v1/query?access_token=${textRecognition.voiceAccessToken}`,
      //         data2
      //       )
      //       .then(res => {
      //         this.$refs.SpeechText.textarea =
      //           res.data.tasks_info[0].task_status == "Success"
      //             ? res.data.tasks_info[0].task_result.result
      //             : "";
      //         this.SpeechTextFlag = true;
      //       });
      //   });
      // ---2020.7.6 使用讯飞的，先注释百度的
    },
    //获取关联事件
    getEventList() {
      let data = {
      };
      this.$api.todoAll(data).then(res => {
        if (res.errorcode == 0) {
          if(this.$refs.bigTemplate !== undefined){
            this.$refs.bigTemplate.eventOptions = res.data;
          }
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    //查看历史
    SeeTheHistory(item) {
      this.$refs.InformaHistory.listData = [];
      this.$refs.InformaHistory.audio()
      this.historyArray = [];
      let obj = {
        id: item.id,
        type: "phone"
      };
      this.$api.getShowHistory(obj).then(res => {
        this.InformaHistoryFlag = true;
        if (res.errorcode == 0) {
          console.log(res.data);
          for (let key in res.data) {
            this.lockHistory(res.data[key], key.substr(0, key.indexOf("L")));
            this.historyArray.push(res.data[key]);
          }
          let arr = this.historyArray.flat(); //降维成一维
          console.log(arr, this.historyArray);
          // if (arr!=0) {
          arr.forEach(ele => {
            if (ele.list) {
              ele.name = this.disposeVisName(ele.list);
            } else {
              ele.name = "";
            }
            if (ele.type == "phone") {
              ele.durationStr = this.hourTimeNum(ele.duration);
            }
            ele.millisecond = new Date(ele.time).getTime(); //用毫秒数进行冒泡排序
          });
          var len = arr.length;
          for (var i = 0; i < len - 1; i++) {
            for (var j = 0; j < len - 1 - i; j++) {
              // 相邻元素两两对比，元素交换，大的元素交换到后面
              if (arr[j].millisecond > arr[j + 1].millisecond) {
                var temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
              }
            }
          }
          arr = arr.reverse();
          console.log(arr);
          this.$refs.InformaHistory.listData = arr;
          // }
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },
    //分钟数
    minutes(time) {
      let secondNum = parseInt(time) % 3600; //得到秒
      let minutes = "00";
      //分钟
      if (secondNum >= 60) {
        minutes =
          parseInt(secondNum / 60) >= 10
            ? parseInt(secondNum / 60)
            : "0" + parseInt(secondNum / 60);
      }
      return (
        minutes +
        "分" +
        (secondNum % 60 >= 10 ? secondNum % 60 : "0" + (secondNum % 60)) +
        "秒"
      );
    },
    //小时
    hourTimeNum(time) {
      //大于等于一个小时
      let hourStr = "00";
      if (time >= 3600) {
        hourStr =
          parseInt(time / 3600) >= 10
            ? parseInt(time / 3600)
            : "0" + parseInt(time / 3600);
        return hourStr + "时" + this.minutes(time);
      } else {
        return this.minutes(time);
      }
    },
    //处理显示姓名
    disposeVisName(data) {
      let str = "";
      if (data.length != 0) {
        data.forEach((ele, index) => {
          if (index == data.length - 1) {
            str += ele.contactor;
          } else {
            str += ele.contactor + "、";
          }
        });
      }
      // console.log(str)
      return str;
    },
    //处理查看历史回调的数据
    lockHistory(data, type) {
      if (data.length != 0) {
        data.forEach(ele => {
          ele.type = type;
        });
      }
    },
    closeInformaHis() {
      this.InformaHistoryFlag = false;
    },
    //回拨
    callback(item) {
      let obj = {
        type: this.$store.state.msgHeadleData.sendType,
        typeId: this.$store.state.msgHeadleData.sendTypeId
      };
      // qinjiaqi 2021-02-04
      // 回拨设真
      sessionStorage.setItem("isCallback", true);
      // 回拨类型phone
      sessionStorage.setItem("historydataType", "phone");
      // 回拨人id
      sessionStorage.setItem("historydataTypeId", item.id);
      this.talkCall({ number: item.phone }, "", obj);
      // console.log(item)
    },
    //保存
    saveEventInfo(obj) {
      this.$api.disposePhone(obj).then(res => {
        if (res.errorcode == 0) {
          // console.log(res)
          this.$message({
            message: "保存成功",
            type: "success"
          });
          this.initData();
          this.getRequeryCell();
        } else {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
      });
    },

    // 存为电话备注
    cellRemark(obj) {
      this.$refs.bigTemplate.mackeValue = obj.remark;
    },
    //关闭语音转文字
    closeSpeechTextEle() {
      this.SpeechTextFlag = false;
    },
    //关闭裁剪
    tailorAudioClose() {
      this.tailorAudioFlag = false;
    }
  },
  mounted() {
    this.getRequeryCell();
    this.getStateListData();
    this.getEventList();
  },
  components: {
    SpeechText,
    bigTemplate,
    tailorAudio,
    InformaHistory,
    phoneHistory
  }
};
</script>

<style scoped>
</style>
