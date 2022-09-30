<template>
  <div class="popUpWindowDelTop_wrap">
    <div class="popUpWindowDelTop_left">
        <img popUpWindowDelTop :src="basicsData.picture?(basicsData.picture.search('http')==-1?($window.g.ApiUrl+basicsData.picture):basicsData.picture):'static/img/headless.png'" style="width:60px;height:60px;">
      <h4 v-if="basicsData.position">{{basicsData.name}} ({{basicsData.position}})</h4>
      <h4 v-else>{{basicsData.name}}</h4>
      <p>{{basicsData.workUnit}}</p>
    </div>
    <div class="popUpWindowDelTop_right">
      <!-- 电话和文字转换的div -->
      <div class="popUpWindowDelTop_right_control_wrap">
        <p>
          <span>{{basicsData.phone}}</span>
          <span v-if="isCallPhone=='hangUp'"
                style="color: #fff;opacity: .7;font-size:10px;padding-top:5px">（通话结束）</span>
        </p>
        <!-- <span>00:00</span> -->
        <!-- 操作语音控件 -->
        <!--呼入-->
        <div class="popUpWindowDelTop_right_control" v-if="isCallType=='callIng'">
          <audioControl v-if="isCallPhone=='hangUp' && url!==''" :url="url"
                        @recordingToText="recordingToText"></audioControl>
          <div v-if="isCallPhone=='call'" style="color: #fff;opacity: .7;font-size:10px;padding-top:5px">
            <span>来电中...</span></div>
          <div v-if="isCallPhone=='talking'" style="color: #fff;opacity: .7;font-size:10px;padding-top:5px">
            <span>通话中...</span>
            <span>{{timer}}</span>
          </div>
        </div>

        <!--呼出-->
        <div class="popUpWindowDelTop_right_control" v-if="isCallType=='callOut'">
          <audioControl v-if="isCallPhone=='hangUp' && url!==''" :url="url"
                        @recordingToText="recordingToText"></audioControl>
          <div v-if="isCallPhone=='call'" style="color: #fff;opacity: .7;font-size:10px;padding-top:5px">
            <span>呼出中...</span></div>
          <div v-if="isCallPhone=='talking'" style="color: #fff;opacity: .7;font-size:10px;padding-top:5px">
            <span>通话中...</span>
            <span>{{timer}}</span>
          </div>
        </div>

        <!--呼入-->
        <div v-if="isCallType=='callIng'" style="position: absolute;right: 55px;">
          <div v-if="isCallPhone=='call'">
            <!-- 接听图片 -->
            <img @click="answerPhone" src="/static/img/cellPhoneDel.png" alt=""
                 style="width: 30px;height: 30px;margin-right: 8px;">
            <!-- 挂机图片   -->
            <img @click="hangup" src="/static/img/hangup.png" alt=""
                 style="width: 30px;height: 30px;margin-right: 8px;">
          </div>

          <div v-if="isCallPhone=='talking'">
            <!-- 挂机图片  -->
            <img @click="hangup" src="/static/img/hangup.png" alt=""
                 style="width: 30px;height: 30px;margin-right: 8px;">
          </div>
        </div>

        <!--呼出-->

        <div v-if="isCallType=='callOut'" style="position: absolute;right: 55px;">
          <div v-if="isCallPhone=='call'">
            <!-- 挂机图片 -->
            <!--              <img  src="/static/img/hangup.png" alt="" style="width: 30px;height: 30px;margin-right: 8px;">-->
          </div>

          <div v-if="isCallPhone=='talking'">
            <!-- 挂机图片 -->
            <img @click="hangup" src="/static/img/hangup.png" alt=""
                 style="width: 30px;height: 30px;margin-right: 8px;">
          </div>
        </div>

      </div>

    </div>
    <div class="popUpWindowDelTop_right_handle">
      <div>
        <i class="el-icon-minus" style="cursor: pointer;padding-right: 5px" @click="closeDomDug"></i>
        <i class="el-icon-close" style="cursor: pointer" v-if="isCallPhone=='hangUp'" @click="closeModel"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import audioControl from './audio_control'
  import {mapGetters} from "vuex";
  import store from "../../assets/store";

  export default {
    name: 'popUpWindowDelTop',
    components: {
      audioControl
    },
    data() {
      return {
          $window:window,
        url: '',
        agent_id: sessionStorage.getItem("agent_id") || '',//坐席ID
      }
    },
    computed: {
      ...mapGetters({
        isCallPhone: 'getIsCallPhone',//电话队列的通话状态
        timer: 'getTimer',
        isCallType: 'getIsCallType',//呼入还是呼出
        conn: 'getCallConn',
      }),
    },
    props: ['basicsData'],
    watch: {
      isCallPhone: {
        handler(neW, olD) {
          if (olD == 'talking' && neW == 'hangUp') {
            this.getPhoneUrl()
          }
        },
        deep: true
      }
    },
    methods: {
      /**
       * @lastEditor hexinting
       * @lastDate 2021-01-20
       * @description 获取录音文件地址
       */
      getPhoneUrl() {
        let ID = this.$store.getters.getCallHistoryId
        setTimeout(() => {
          this.$szApi.phoneGetUrl({phoneId: ID}).then((res) => {
            if (res.errorcode == 0) {
              if (res.data.url && res.data.url !== '' && res.data.url !== undefined) {
                this.url = window.g.ApiUrl + '/rec/' + res.data.url
                this.$store.commit('setPhoneRecordFile', window.g.ApiUrl + '/rec/' + res.data.url)
              }
            }
          })
        }, 4000)
      },
      //缩小弹窗
      closeDomDug() {
        // this.$store.commit("setIsShowButton", true);  //显示小按钮
        // this.$store.commit('setIsIntelligenceReports',false)
        this.$store.commit('setIsDialogType', 'mini')
      },

      recordingToText(data) {
        this.$emit('recordingToText', data)
      },

      //关闭弹窗
      closeModel() {
        this.$store.commit('setIsCallType', '') //关闭的时候把呼入和呼出都置空
        this.$store.commit('setIsAgentSpeekList', []) //清掉转文字内容
        this.$store.commit('setIsDialogType', 'mini') //清掉转文字内容
      },

      //接听电话
      answerPhone() {
        this.$icp19.AnswerCall(Number(this.agent_id), Number(this.conn), 1)
      },

      //挂断电话
      hangup() {
        this.$icp19.DropCall(Number(this.agent_id), Number(this.conn), "");
        // this.$store.commit("setIsCallType", '');
        // this.$store.commit('setIsDialogType', 'big') //big弹窗。
        // this.$store.commit('setIsCallPhone', 'hangUp')
      }
    }
  }
</script>

<style scoped>
  h4, p {
    margin: 0;
  }

  .popUpWindowDelTop_wrap {
    height: 100%;
    overflow: hidden;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
  }

  .popUpWindowDelTop_left {
    width: 50%;
    text-align: left;
  }

  .popUpWindowDelTop_left > h4 {
    font-size: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 1);
  }

  .popUpWindowDelTop_left > p {
    font-size: 10px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    margin-top: 5px;
  }

  .popUpWindowDelTop_right {
    display: flex;
    width: 50%;
    height: 40px;
    overflow: hidden;
    align-items: center;
  }

  .popUpWindowDelTop_right_control_wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 40px;
    position: relative;
    width: 100%;
  }

  .popUpWindowDelTop_right_control_wrap > p {
    font-size: 12px;
    font-weight: 600;
    text-align: left;
    color: rgba(255, 255, 255, 1);
    letter-spacing: 1px;
  }

  .popUpWindowDelTop_right_control_wrap > span {
    font-size: 12px;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    letter-spacing: 1px;
    transform: scale(.8);
    display: inline-block;
    text-align: left;
    margin-left: -9px;
  }

  .popUpWindowDelTop_right_control {
    flex: 1;
    align-items: center;
    text-align: left;
  }

  .popUpWindowDelTop_right_handle {
    color: #fff;
    font-size: 12px;
    position: absolute;
    right: 10px;
    top: 5px;
  }

</style>
