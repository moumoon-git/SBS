<template>
    <div>

    </div>
</template>

<script>
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import Bus from '@/utils/bus'

export default {
  name: 'call-phone',
  data () { 
    return {
      backgroundURL: window.SITE_CONFIG.baseUrl,
      notify: '',
      flag: 'false',
      timer: '', // 存储定时器
      stompClient: '', // 存储订阅
      socket: '',
    } 
  },
  mounted () {
      // eslint-disable-next-line no-unused-vars
    var that = this
    // console.log(this.$store.state.callPhone.flag)
  },
  watch: {
    '$store.state.callPhone.num' () {
      if (this.notify) {
        this.notify.close()
      }
      if (this.$store.state.callPhone.phoneNum) {
        // console.log(this.$store.state.callPhone.phoneNum)
        this.open({
          title: '来电通知',
          type: 'success',
          dangerouslyUseHTMLString: true,
          position: 'bottom-right',
          message: '<div class="phoneInfo" >' +
               '<div class="bgr"></div>' +
               '<div style="display:flex" ><span>姓名：</span><span>' + this.$store.state.callPhone.name + '</span></div>' +
               '<div><span>单位：</span><span>' + this.$store.state.callPhone.unit + '</span></div>' +
               '<div><span>职位：</span><span>' + this.$store.state.callPhone.visa + '</span></div>' +
               '<div><span>号码：</span><span>' + this.$store.state.callPhone.phoneNum + '</span></div>' +
               '<div><span>电话：</span><span>' + this.$store.state.callPhone.del + '</span></div>',
          duration: 0
        }, 2)
      }
    },
    flag (flag) {
      // console.log(flag)
      this.drpos()
    }
  },
  methods: {
    open (obj = '', type = 1) {
        // 弹出电话通知
        // eslint-disable-next-line no-unused-vars
      var that = this
      var notify = this.$notify(obj)
      this.notify = notify
    },
    drpos () {
      this.$http({
        url: this.$http.adornUrl('/phone/phoneinfo/dropCall'),
        method: 'POST',
        params: this.$http.adornParams({
          phoneNum: this.$store.state.callPhone.phoneNum,
          agentId: 0,
          contact_id: 0
        })
      }).then((data) => {
        if(data.code === 0) {
          // console.log(data)
        }else{
          this.$message.error(data.msg)
        }
      })
    },
      // 连接
    initWebSocket () {
      var that = this
      that.connection()
      // 断开重连机制,尝试发送消息,捕获异常发生时重连
      this.timer = setInterval(() => {
        try {
          that.globalStompClient.send(
              '/phone/message',
              {},
              JSON.stringify({ to: that.platformId })
            )
        } catch (err) {
          that.connection()
        }
      }, 10000)
    },
      // 连接
    connection () {
      var that = this
      // 连接SockJS的endpoint名称为"endpointOyzc"
      // var socket = new SockJS('http://127.0.0.1:8888/endpointOyzc');
      that.socket = new SockJS(`${window.SITE_CONFIG.websocket}`)
      // 使用STMOP子协议的WebSocket客户端
      that.stompClient = Stomp.over(that.socket)
      that.globalStompClient = that.stompClient
      // 连接WebSocket服务端
      that.stompClient.connect({}, function (frame) {

        that.stompClient.subscribe(
            '/platform/' + that.platformId + '/phone/message',
            function (response) {
              var str = response.body
              var state = str.split('_')
              var obj = {}
              if (that.notify && that.notify != ' ') {
                that.notify.close()
              }
              switch (state[0]) {
                // * 接收从EMT发布过来的电话API事件通知
                // * 来电响铃通知 "cmdtype":"CallOffered"
                // * 来电号码通知 "cmdtype":"CallingNumberReceived"
                // * 电话状态通知 "cmdtype":"PortStatusChanged"
                // * 呼叫结果通知 "cmdtype":"MackeCallAck"
                // * 电话挂机通知 "cmdtype":"CallReleased"
                // * 话机按键通知 "cmdtype":"KeyDtmfReceived"
                // * 转接结果通知 "cmdtype":"TranslateCallAck"
                // * 停止转接结果通知 "cmdtype":"TranslateRelease"
                case 'CallOffered':
                  obj = {
                    title: '来电通知',
                    type: 'success',
                    dangerouslyUseHTMLString: true,
                    message: '<div class="phoneInfo" >' +
                      '<div class="bgr"></div>' +
                      '<div style="display:flex" ><span>姓名：</span><span>某某某</span></div>' +
                      '<div><span>单位：</span><span>市委</span></div>' +
                      '<div><span>职位：</span><span>市长</span></div>' +
                      '<div><span>号码：</span><span>13800138000</span></div>' +
                      '<div><span>电话：</span><span>4002552632</span></div>',
                    duration: 0
                  }
                  break
                case 'CallingNumberReceived':
                  obj = {
                    title: '来电通知',
                    type: 'success',
                    dangerouslyUseHTMLString: true,
                    message: '<div class="phoneInfo" >' +
                      '<div class="bgr"></div>' +
                      '<div style="display:flex" ><span>姓名：</span><span>某某某</span></div>' +
                      '<div><span>单位：</span><span>市委</span></div>' +
                      '<div><span>职位：</span><span>市长</span></div>' +
                      '<div><span>号码：</span><span>13800138000</span></div>' +
                      '<div><span>电话：</span><span>4002552632</span></div>',
                    duration: 0
                  }
                  break
                case 'PortStatusChanged':
                  obj = {
                    title: '电话状态',
                    type: 'success',
                    dangerouslyUseHTMLString: true,
                    message: '<div class="phoneInfo" >' +
                      '<div class="bgr"></div>' +
                      '<div style="display:flex" ><span>姓名：</span><span>某某某</span></div>' +
                      '<div><span>单位：</span><span>市委</span></div>' +
                      '<div><span>职位：</span><span>市长</span></div>' +
                      '<div><span>号码：</span><span>13800138000</span></div>' +
                      '<div><span>电话：</span><span>4002552632</span></div>',
                    duration: 0
                  }
                  break
                case 'MackeCallAck':
                  obj = {
                    title: '呼叫结果',
                    type: 'success',
                    dangerouslyUseHTMLString: true,
                    message: '<div class="phoneInfo" >' +
                      '<div class="bgr"></div>' +
                      '<div style="display:flex" ><span>姓名：</span><span>某某某</span></div>' +
                      '<div><span>单位：</span><span>市委</span></div>' +
                      '<div><span>职位：</span><span>市长</span></div>' +
                      '<div><span>号码：</span><span>13800138000</span></div>' +
                      '<div><span>电话：</span><span>4002552632</span></div>',
                    duration: 0
                  }
                  break
                case 'CallReleased':
                  obj = {
                    title: '电话挂机',
                    type: 'success',
                    dangerouslyUseHTMLString: true,
                    message: '<div class="phoneInfo" >' +
                      '<div class="bgr"></div>' +
                      '<div style="display:flex" ><span>姓名：</span><span>某某某</span></div>' +
                      '<div><span>单位：</span><span>市委</span></div>' +
                      '<div><span>职位：</span><span>市长</span></div>' +
                      '<div><span>号码：</span><span>13800138000</span></div>' +
                      '<div><span>电话：</span><span>4002552632</span></div>',
                    duration: 0
                  }
                  Bus.$emit('seleConfirms', true)
                  break
                case 'KeyDtmfReceived':
                  obj = {
                    title: '话机按键',
                    type: 'success',
                    dangerouslyUseHTMLString: true,
                    message: '<div class="phoneInfo" >' +
                      '<div class="bgr"></div>' +
                      '<div style="display:flex" ><span>姓名：</span><span>某某某</span></div>' +
                      '<div><span>单位：</span><span>市委</span></div>' +
                      '<div><span>职位：</span><span>市长</span></div>' +
                      '<div><span>号码：</span><span>13800138000</span></div>' +
                      '<div><span>电话：</span><span>4002552632</span></div>',
                    duration: 0
                  }
                  break
                case 'TranslateCallAck':
                  obj = {
                    title: '转接结果',
                    type: 'success',
                    dangerouslyUseHTMLString: true,
                    message: '<div class="phoneInfo" >' +
                      '<div class="bgr"></div>' +
                      '<div style="display:flex" ><span>姓名：</span><span>某某某</span></div>' +
                      '<div><span>单位：</span><span>市委</span></div>' +
                      '<div><span>职位：</span><span>市长</span></div>' +
                      '<div><span>号码：</span><span>13800138000</span></div>' +
                      '<div><span>电话：</span><span>4002552632</span></div>',
                    duration: 0
                  }
                  break
                case 'TranslateRelease':
                  obj = {
                    title: '停止转接结果',
                    type: 'success',
                    dangerouslyUseHTMLString: true,
                    message: '<div class="phoneInfo" >' +
                      '<div class="bgr"></div>' +
                      '<div style="display:flex" ><span>姓名：</span><span>某某某</span></div>' +
                      '<div><span>单位：</span><span>市委</span></div>' +
                      '<div><span>职位：</span><span>市长</span></div>' +
                      '<div><span>号码：</span><span>13800138000</span></div>' +
                      '<div><span>电话：</span><span>4002552632</span></div>',
                    duration: 0
                  }
                  break
              }
              obj.position = 'bottom-right'
            }
          )
      })
    },
      // 断开
    disconnect () {
      if (this.globalStompClient != null) {
        this.globalStompClient.disconnect()
      }
    }
  }

}
</script>

<style scoped lang="less">



</style>
