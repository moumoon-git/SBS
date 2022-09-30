<template>
    <div class="banquet_wrap" v-if="wrapFlag">
      <div class="banquet_content" >
        <h5>
          <span>请选择当前电脑坐席</span>
          <img @click="close" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAbUlEQVQ4T2NkoBAwUqifYRAa4P////7/DAwHNjEyNiJ7z+///3qgcx02MjI6IotjeAGqsAFoSAPMEGxiMEOwhgGyBpBCoCIUA/G6ACYJMwTER3YNeqzhjAWKDKDICxQHIsXRSGrSHoRJmVQvAAB6RkgRLhDeuAAAAABJRU5ErkJggg==" alt="">
        </h5>

        <div class="content">
          <input v-model="banquetPhone" type="text" placeholder="请输入坐席号码" >
          <button @click="addDanquet" >添加坐席</button>
        </div>

<!--        <div class="select_content" v-if="selectCallData" >-->
<!--          <div @click="selectCall(item)" v-for="(item, index) in selectCallData" :key="index" class="select_call">-->
<!--            <span>{{item.telephone}}</span>-->
<!--            <img @click.stop="delCall(item)" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAbUlEQVQ4T2NkoBAwUqifYRAa4P////7/DAwHNjEyNiJ7z+///3qgcx02MjI6IotjeAGqsAFoSAPMEGxiMEOwhgGyBpBCoCIUA/G6ACYJMwTER3YNeqzhjAWKDKDICxQHIsXRSGrSHoRJmVQvAAB6RkgRLhDeuAAAAABJRU5ErkJggg==" alt="">-->
<!--          </div>-->
<!--        </div>-->

      </div>
    </div>
</template>

<script>
  import url from '@/mock/modules/url'
  export default {
    name: 'banquet',
    data () {
      return {
        wrapFlag: false,
        selectCallData: [],
        banquetPhone: ''
      }
    },
    methods: {
      init () {
        this.wrapFlag = false
        this.$router.replace({ name: 'secondary' })
      },
      close () {
        this.wrapFlag = false
        this.$router.replace({ name: 'secondary' })
      },
      state () {
        // console.log(localStorage.banquetFlag, !localStorage.banquetFlag)
        if (!localStorage.banquetFlag) {
          this.wrapFlag = true
          this.requerPhoneList()
          localStorage.banquetFlag = true
        } else {
          var item = ''
          if (localStorage.phoneData) {
            item = JSON.parse(localStorage.phoneData)
          }
          // console.log(item)
          this.$http({
            url: this.$http.adornUrl(url.savePhoneUser.url + '/' + item.id),
            method: url.savePhoneUser.method,
            params: this.$http.adornParams()
          }).then((res) => {
            if (res.code === 0) {
            }else{
              this.$message.error(res.msg)
            }
          })
        }
      },
      // 选择电话
      selectCall (item) {
        this.banquetPhone = item.telephone
        if (this.rex(this.banquetPhone)) {
          this.$http({
            url: this.$http.adornUrl(url.savePhoneUser.url + '/' + item.id),
            method: url.savePhoneUser.method,
            params: this.$http.adornParams()
          }).then((res) => {
            if (res.code === 0) {
              localStorage.phoneData = JSON.stringify(item)
              this.init()
            }else{
              this.$message.error(res.msg)
            }
          })
        } else {
          this.$message.error('号码有误')
        }
      },
      // 添加坐席
      addDanquet () {
        if (this.rex(this.banquetPhone)) {
          localStorage.seatsPhone = this.banquetPhone
          this.$http({
            url: this.$http.adornUrl(url.savePhone.url),
            method: url.savePhone.method,
            params: this.$http.adornParams({
              phone: this.banquetPhone
            })
          }).then((res) => {
            if (res.code === 0) {
              // console.log(res)
              // this.requerPhoneList()
              this.$router.replace({ name: 'secondary' })
            }else{
              this.$message.error(res.msg)
            }
          })
        } else {
          this.$message.error('号码有误')
        }
      },
      // 删除电话
      delCall (item) {
        this.$http({
          url: this.$http.adornUrl(url.delete.url + '/' + item.id),
          method: url.delete.method,
          params: this.$http.adornParams()
        }).then((res) => {
           if (res.code === 0) {
              // console.log(res)
              this.requerPhoneList()
            }else{
              this.$message.error(res.msg)
            }
        })
        // console.log(item)
      },
      requerPhoneList () {
        this.$http({
          url: this.$http.adornUrl(url.phoneUserConfig.url),
          method: url.phoneUserConfig.method,
          params: this.$http.adornParams({
            page: 1,
            limit: 20
          })
        }).then((res) => {
          if (res.code === 0) {
              // console.log(res.data.page.list)
              // this.selectCallData = res.data.page.list
            }else{
              this.$message.error(res.msg)
            }
        })
      },
      rex (data) {
        let a = /0\d{2}-\d{7,8}/
        return a.test(data)
      }
    },
    mounted () {

    }
  }
</script>

<style scoped>
.banquet_wrap{
  width: 100%;
  height: 100vh;
  position: relative;
}
.banquet_content{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.banquet_content>h5{
  text-align: center;
  color: #fff;
  height: 48px;
  line-height: 48px;
  position: relative;
  margin: 0;
  background: #2C607F;
}
.banquet_content>h5>span{
  font-size:20px;
  font-weight: 400;
  font-family:AdobeHeitiStd-Regular;
  letter-spacing: 2px;
}
.banquet_content>h5>img{
  position: absolute;
  top: 2px;
  right: 2px;
  cursor: pointer;
}
.content{
  padding: 30px 46px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0,0,0,.6);
}
.content>input{
  width: 288px;
  height: 38px;
  text-align: center;
  line-height: 40px;
  outline: none;
  border: 1px solid #4fffff;
  box-sizing: border-box;
  background:rgba(102,127,143,.6) ;
  color: #fff;
  /*background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoQAAACUCAYAAAAK/jj9AAAHpklEQVR4Xu3WQQ0AIBDEQE4KIhCKYxJsdHBwwz46a5+7PAIECBAgQIAAgazACMLs3zucAAECBAgQIPAFBKEhECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQEoQ0QIECAAAECBOICgjA+AOcTIECAAAECBAShDRAgQIAAAQIE4gKCMD4A5xMgQIAAAQIEBKENECBAgAABAgTiAoIwPgDnEyBAgAABAgQetQuGIUBJ5hYAAAAASUVORK5CYII=");*/
  /*background-size: 100% 100%;*/
}
.content>button{
  width: 110px;
  height: 38px;
  /*background: rgba(24,105,122,.6);*/
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAAmCAYAAAAlUK76AAAApUlEQVR4Xu3TQRHAMAzEwIRgy7UE3U9I7ERGoJF8+52Z1XEG9gn3cOR3A3+FMx+gcGa3VbjCoQZQ7BZXONQAit3iCocaQLFbXOFQAyh2iyscagDFbnGFQw2g2C2ucKgBFLvFFQ41gGK3uMKhBlDsFlc41ACK3eIKhxpAsVtc4VADKHaLKxxqAMVucYVDDaDYLa5wqAEUu8UVDjWAYrc4PRzKfy/2D3VYoW+JNeDwAAAAAElFTkSuQmCC");
  background-size: 100% 100%;
  border: 0;
  text-align: center;
  line-height: 34px;
  font-size:16px;
  outline: none;
  color: #fff;
  cursor: pointer;
  /*border: 1px solid #4fffff;*/
  box-sizing: border-box;
}
.select_content{
  background: rgba(0,0,0,.6);
  padding: 0 48px;
  max-height: 250px;
  overflow-y: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.select_call{
  width: 150px;
  height: 40px;
  background: rgba(102,127,143,.6);
  color: #fff;
  border:1px solid #4fffff;
  box-sizing: border-box;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-bottom: 30px;
  cursor: pointer;
  margin-right: 32px;
}
.select_call>img{
  width: 20px;
  height: 20px;
  position: absolute;
  top: 8px;
  right: 0px;
  cursor: pointer;
}






</style>
