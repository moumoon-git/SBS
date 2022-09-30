<template>
    <div class="addBlackList_Bigwrap" v-if="addBlackList_BigwrapFlag" >

      <div class="addBlackList_wrap"  >
<!--        拉入黑名单-->
        <div class="addBlackList">
          <h5 class="title">
            <span v-if="addBlackFlag">拉入黑名单</span>
            <span v-else>电话黑名单</span>
            <img @click="close" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACd0lEQVRYR7WXa0rDQBSFm3YdQlfgTgR/KL7AFwoWWy1qmyooPsDQlIr1gYKiqPj8JboBdyLoOtp6JiQyTe7M3NG2v9Lkdr4z59yZThzP87KZTGY0lUr1t1qtt0ql8oTrnn1qtdpKu90uAPDRbDZ3HN/3r/FlOiI6jrNVKpX2eqEArBeMOyyN7QsBn7iRlYEQsQERXjdFEHAx/KMTWlInYG65XPa7IUIBTyHyMUcAVAXIas11XUocW5dqbLi8DZd3AgE6EXhWhBMNNlEOOJl58DSCB9fywBonCnDixEaEaea/TR8fVCMiBxHnHBFceMIBRhzziONSJ8IGrhRgaMxZOCH2jsTHFq4VYBAxCRF3nP6RG44S3dGENrNC7TjieNQJNcGNDph6AhvJSDqdHkKdvL0mlpquZ4wOmESQtoabDGfFsAXorJZBHNs76jkqOc0W5Gkx82hMKwdCF8R5YeS/1v9JANb5veh+bVNZusB2APAbgCc5kdlEwRKAM8MV/ppnCPhzeC8RCVeEUQBmfgHIHAF/wEY0EfYFGQ1HhFYA4GcALBDwW8CnYquDjMgkQikAcPH/vxiHY8BrnGRmqV5QRaUTQQoA/BCAZQJyiZnP6xpRFZlKREJAtVqto3iFgJwDnuOsAlV0lIj4kawKQJmAnAKe58CjGk2EwWE0sRFh5vtQuE5AGoAXbeCSCDLKxKEU8F3c3IxDsPYPcPBY/Qs8+o0q0t9jOQry+HJMQHzM3P0PXHKCjFa8I4pXsy8U9skgPPAw841uwCUnqIi/xavZG4ADUSGu9wDf6iZcEtERNZx/j17NjlA0CLhv+wJiKzSMXKy0V0S89APvbUcaq1sdugAAAABJRU5ErkJggg==" alt="">
          </h5>

          <div class="selCall" >
            <span v-if="addBlackFlag" >已选电话</span>
            <span v-else >关闭联系人可将该联系人移除黑名单</span>
          </div>
<!--        要加入黑名单的联系人-->
          <div class="addList">

            <div v-for="(item, index) in listData" :key="index" >
              <span>{{item.name+'   '+ item.phone}}</span>
              <div @click="deletes(item, index)" >
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA/ElEQVRYR+1WOw7CMAxtJi7CBCsLIydg4wScjJGNE7CxMcLELThAeJESCUWp62dBvaSSh7b288vLyycMzk9w7j90Al2BUQVijFcYdIE4hhCeFrMCY4W6E+INjF0LQyJwQ8EW8UAcWBK5+Rm1a8Qd9RuWQGJfACgSVXOxVjQhA1RGx9ZMrgIGkMkthCcJpEQNsCaH8kCdLDWwNk89VApI85v/mcxKE2hMxysTWFqXK6VApcQF76lxehKRPbtXmBT4UsGHQGW4eaeg5fbZTOi6DDXrXJNj2ogYYCZXtRVbANka6T7gexxjJO4XEt8rWcux//hmOgt+SaQT6Ap8ANfRzCHagFuSAAAAAElFTkSuQmCC" alt="">
              </div>
            </div>

          </div>
<!--          提示-->
          <div class="info" v-if="addBlackFlag">
            是否将联系人拉入通讯黑名单，拉入黑名单后将无法接受该联系人电话？
          </div>
<!--          按钮-->
          <div class="BtnWrap">
            <button @click="close" >取消</button>
            <button v-if="addBlackFlag" @click="saveAllBlackList">拉入黑名单</button>
            <button v-else @click="addBlackList_BigwrapFlag = false" >保存</button>
          </div>

        </div>

      </div>

    </div>
</template>

<script>
  import url from '../../../../../mock/modules/url'
  export default {
    name: 'addBlackList',
    data () {
      return {
        addBlackList_BigwrapFlag: false,
        addBlackFlag: false,
        listData: [],
        arr: ''
      }
    },
    methods: {
      init (data) {
        // console.log(data)
        this.addBlackList_BigwrapFlag = true
        this.addBlackFlag = true
        this.listData = data
        for (var i = 0; i < this.listData.length; i++) {
          if (this.listData[i].callType === 0) {
            this.listData[i].phone = this.listData[i].calling
          } else {
            this.listData[i].phone = this.listData[i].called || '无'
          }
          if (this.listData[i].callType !== 4) {
            this.listData[i].name = this.listData[i].contactor || '未知'
          } else {
            this.listData[i].name = this.listData[i].operator || '未知'
          }
        }
        // console.log(this.listData)
      },
      close () {
        this.addBlackList_BigwrapFlag = false
      },
      allBlackList () {
        this.$http({
          url: this.$http.adornUrl(url.phoneBacklist.url),
          method: url.phoneBacklist.method,
          params: this.$http.adornParams({
            page: 1,
            limit: 20
          })
        }).then((res) => {
          if(res.code === 0){
              // console.log(res.data.page.list)
              this.listData = res.data.page.list
          } else {
            this.$message.error(res.msg);
          }
        })
      },
      deletes (item, index) {
        this.listData.splice(index, 1)
        if (!this.addBlackFlag) {
          let arr = item.id
          this.$http({
            url: this.$http.adornUrl(url.deletePhoneBacklist.url),
            method: url.deletePhoneBacklist.method,
            params: this.$http.adornParams({
              ids: arr
            })
          }).then((res) => {
             if(res.code === 0){
              // console.log(res)
            } else {
              this.$message.error(res.msg);
            }
          })
        }
      },
      openblackListx () {
        this.addBlackList_BigwrapFlag = true
        this.addBlackFlag = false
        this.allBlackList()
      },
      saveAllBlackList () {
        let arr = []
        this.listData.forEach(function (ele,index) {
          // eslint-disable-next-line no-unused-vars
          let obj = {phone: ele.phone, name:ele.name}
          arr.push(obj)
        })
        this.$http({
          url: this.$http.adornUrl(url.addPhoneBacklist.url),
          method: url.addPhoneBacklist.method,
          data: this.$http.adornData({
            blacklist: JSON.stringify(arr)
          }, false)
        }).then((res) => {
          if(res.code === 0){
            // console.log(res)
          } else {
            this.$message.error(res.msg);
          }
          this.addBlackList_BigwrapFlag = false
        })
      }
    },
    mounted () {

    }
  }
</script>

<style scoped>
.addBlackList_Bigwrap{
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999999;
  background: rgba(0,0,0,.5);
}
.addBlackList_wrap{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  z-index: 999999999;
  width: 310px;
  height: 400px;
  background: #fff;
}
.title{
  background: #ccc;
  height: 40px;
  text-align: center;
  line-height: 40px;
  position: relative;
  font-size: 16px;
  margin: 0;
}
.title>img{
  position: absolute;
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.selCall{
 margin: 10px 20px;
}
.addList{
  height: 215px;
  overflow-y: auto;
  padding: 15px 0;
}
.addList>div{
  width: 270px;
  height: 35px;
  border: 1px solid #ccc;
  margin: auto;
  border-radius: 3px;
  position: relative;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
.addList>div>div{
  position: absolute;
  top: -13px;
  right: -12px;
  width: 25px;
  height: 25px;
  border: 1px solid transparent;
  border-radius: 50%;
  overflow: hidden;
  background: #ccc;
  padding: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.addList>div>div>img{
  width: 100%;
  height: 100%;
}
.info{
  margin: 0 20px;
  margin-bottom: 20px;
}
.BtnWrap{
  margin: 15px 20px 0;
  display: flex;
  justify-content: center;
}
.BtnWrap>button{
  padding: 2px 10px;
  cursor: pointer;
}
.BtnWrap>button:nth-child(1){
  margin-right: 15px;
}

</style>
