<template>
    <div>
         <div class="harassment">
              <div class="info">
                 <h1>提示 <img src="../../../../assets/img/close.png" alt="" @click="close"></h1>
                 <div class="msg">
                   <p>是否将 <span class="harassmentData_contactName">{{harassmentData.contactName}}</span>（<span class="harassmentData_phoneCalled">{{harassmentData.phoneCalled}}</span>）加入防骚扰名单？【防骚扰名单可以在设置中管理】</p>
                   <div class="Btn_Wrap" ><button @click="confirm">确定</button><button @click="close">关闭</button></div>
                 </div>

              </div>
         </div>
    </div>
</template>

<script>
  import Bus from '@/utils/bus'

  export default {
    name: 'mobile_harassment',
    data () {
      return {
        harassmentData: '',
        harassmentData_contactName: '',
        harassmentData_phoneCalled: ''
      }
    },
    mounted () {
      var that = this
      that.jiantin()
      Bus.$off('Event_harassment')
      Bus.$on('Event_harassment', (data) => {
        that.harassmentData = data
        sessionStorage.harassmentData_contactName = that.harassmentData.contactName
        sessionStorage.harassmentData_phoneCalled = that.harassmentData.phoneCalled
        // console.log(data, '传过来的防骚扰数据', that.harassmentData, that.harassmentData.contactName, that.harassmentData.phoneCalled)
      })
    },

    methods: {
      confirm () {
        // console.log('确定的要发送请求')
        // this.$http.adornParams()
        // this.$http({
        //   url: this.$http.adornUrl('/phone/phoneinfo/output-excel'),
        //   method: 'get',
        //   params: {ids}
        // }).then((data) => {
        //   console.log(data, '导出联系人数据')
        //   window.open()
        // })
        // console.log(this.dataListSelections.join(','))
        Bus.$emit('close', false)
      },
      close () {
        // console.log('关闭')
        Bus.$emit('close', false)
      },
      jiantin () {
        setInterval(() => {
          // harassmentData_contactName harassmentData_phoneCalled
          var contactName = sessionStorage.harassmentData_contactName
          var phoneCalled = sessionStorage.harassmentData_phoneCalled
          // eslint-disable-next-line eqeqeq
          if (this.harassmentData_contactName != contactName || this.harassmentData_phoneCalled != phoneCalled) {
            // eslint-disable-next-line camelcase
            var harassmentData_contactName = document.querySelector('.harassmentData_contactName')
            // eslint-disable-next-line camelcase
            var harassmentData_phoneCalled = document.querySelector('.harassmentData_phoneCalled')
            harassmentData_contactName.innerHTML = contactName
            harassmentData_phoneCalled.innerHTML = phoneCalled
            this.harassmentData_contactName = contactName
            this.harassmentData_phoneCalled = phoneCalled
          }
        }, 100)
      }
    },
    components: {

    }
  }
</script>

<style scoped lang="less">
.harassment{
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
  width: 100%;
  z-index: 2004;
  height: 100vh;
  background: rgba(0,0,0,.2);
  overflow: hidden;
}
  .info{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2005;
    margin: auto;
    /*margin-top: 50%;*/
    width: 20%;
    height: 20%;
    background: rgba(79,193,233);
    overflow: hidden;
    border-radius: 5px ;
    display: flex;
    flex-direction: column;
    h1{
      font-size: 18px;
      color: #fff;
      font-weight: 300;
      padding: 10px 5px ;
      align-items: flex-start;
      margin: 0;
      display: flex;
      justify-content: space-between;
      img{
        width: 16px;
        height: 16px;
      }
    }
    .msg{
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      background: #Fff;
      padding:0 30px;
      p{
        line-height: 25px;
        margin:5px 0;
      }
      .Btn_Wrap{
        display: flex;
        padding: 5px 20%;
        padding-bottom: 10px;
        justify-content: space-between;
        button{
          border-radius: 3px;
          font-size: 16px;
          font-weight: 300;
          border: 0;
          padding: 5px 15px;
          outline: none;
          background: rgba(14,142,190);
          color: #fff;
        }
      }
    }
  }

</style>
