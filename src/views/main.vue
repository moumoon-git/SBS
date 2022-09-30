<template>
  <div
    class="site-wrapper mainWrap"
    :class="{ 'site-sidebar--fold': sidebarFold }"
    v-loading.fullscreen.lock="loading"
    element-loading-spinner="sv-loading"
    element-loading-text="正在加载中">
    <template v-if="!loading">
      <main-navbar />
      <main-sidebar />
      <div class="site-content__wrapper" >
        <main-content v-if="!$store.state.common.contentIsNeedRefresh" />
      </div>
      <!-- 2020.08.03 取消旧的打电话方式，统一改用c端的app -->
      <!-- <call-phone ></call-phone> -->
    </template>
    <!-- :style="{ 'min-height': documentClientHeight}"  -->
  </div>
</template>

<script>
  import MainNavbar from './main-navbar'
  import MainSidebar from './main-sidebar'
  import MainContent from './main-content'
  import callPhone from './modules/callPhone/callPhone'
  import url from '../mock/modules/url'

  export default {
    provide () {
      return {
        // 刷新
        refresh () {
          this.$store.commit('common/updateContentIsNeedRefresh', true)
          this.$nextTick(() => {
            this.$store.commit('common/updateContentIsNeedRefresh', false)
          })
        }
      }
    },
    data () {
      return {
        loading: true
      }
    },
    components: {
      MainNavbar,
      MainSidebar,
      MainContent,
      callPhone
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight },
        set (val) { this.$store.commit('common/updateDocumentClientHeight', val) }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold }
      },
      userId: {
        get () { return this.$store.state.user.id },
        set (val) { this.$store.commit('user/updateId', val) }
      },
      userName: {
        get () { return this.$store.state.user.name },
        set (val) { this.$store.commit('user/updateName', val) }
      },
      userMobile: {
        get () { return this.$store.state.user.mobile },
        set (val) { this.$store.commit('user/updateMobile', val) }
      },
      platformId: {
        get () { return this.$store.state.user.platformId },
        set (val) { this.$store.commit('user/updatePlatformId', val) }
      },
      platformTypeId: {
        get () { return this.$store.state.user.platformTypeId },
        set (val) { this.$store.commit('user/updatePlatformTypeId', val) }
      },
      isAdmin: {
        get () { return this.$store.state.user.isAdmin },
        set (val) { this.$store.commit('user/updateIsAdmin', val) }
      },
      isLogo: {
        get () { return this.$store.state.user.isLogo },
        set (val) { this.$store.commit('user/updateIsLogo', val) }
      }

    },
    created () {
      this.getUserInfo()
      this.viewRole()
    },
    mounted () {
      this.resetDocumentClientHeight()
 // Watermark.set("水印内容")
  },
    methods: {
      // 重置窗口可视高度
      resetDocumentClientHeight () {
        this.documentClientHeight = document.documentElement['clientHeight']
        window.onresize = () => {
          this.documentClientHeight = document.documentElement['clientHeight']
        }
      },
      // 获取当前管理员信息
      getUserInfo () {
        this.$http({
          url: this.$http.adornUrl('/sys/user/info'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.loading = false
            this.userId = data.user.userId
            this.userName = data.user.username
            this.userMobile = data.user.mobile
            this.isAdmin = data.user.admin
            this.platformId = data.user.platformId
            this.platformTypeId = data.platform.platformTypeId
            this.isLogo = data.platform.isLogo
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      viewRole () {
        let Base64 = require('js-base64').Base64
        this.$http({
          url: this.$http.adornUrl(url.dataViewrole.url),
          method: url.dataViewrole.method,
          params: this.$http.adornParams()
        }).then((res) => {
          if (res.data.code == 0) {
            sessionStorage.Diction = Base64.encode(JSON.stringify(res.data.data))
          } else {
            this.$message.error(res.msg)
          }
        })
      }

    }
  }
</script>
<style lang="less">
@import url("//at.alicdn.com/t/font_1504385_pv58vrfkfp.css");
* {
  font-family: "Microsoft YaHei", PingFangSC-Regular, "PingFang SC", Roboto-Regular, SourceHanSansCN-Regular !important;
}
.el-message{
  z-index:9999999999!important;
}
// body > div.site-wrapper.mainWrap > div > main > div.el-tabs.el-tabs--top > div.el-tabs__header.is-top
body > div.site-wrapper.mainWrap > div > main > div.el-tabs.el-tabs--top > div.el-tabs__header.is-top > div > div{
  margin-top:18px;
}
body > div.site-wrapper.mainWrap > div > main > div.el-tabs.el-tabs--top > div.el-tabs__content > div.site-tabs__tools.el-dropdown{
  margin-top:18px;
}
.site-content__wrapper{
  margin-left: 173px;
  background-color: #f4f4f4;
  height: 100vh;
}
.site-content > .el-tabs > .el-tabs__header{
  left: 173px;
}
.site-content > .el-tabs > .el-tabs__content{
  padding: 0;
}
.el-dropdown-menu.el-popper.el-dropdown-menu--medium{
  // z-index: 99999999999999999!important;
}
 .mainWrap{

 }
 .el-notification__title{
   color: #fff;
 }
 .el-notification.right{
   background: rgba(0,0,0,.7);
   div{
     color: #fff;
     margin: 5px;
   }
 }
 .bgr{
   width: 100px;
   height: 100px;
   background-image: url("../assets/img/user.png");
   background-size: 100% 100%;
   position: absolute;
   /*right: -90px;*/
   right: 10px;
   top: 0;
 }
  .phoneInfo{
    width: 30vh;
    position: relative;
  }
  .Phonebtn{
    display: flex;
    margin-top: 20px !important;
  }
  .take{
    background:rgb(26,172,25);
    outline: none;
    border: 0;
    color: #fff;
    font-size: 16px;
    padding: 5px 30px;
    margin-right: 50px;
  }
  .refuse{
    background: rgb(243,84,84);
    outline: none;
    border: 0;
    color: #fff;
    font-size: 16px;
    padding: 5px 30px;
  }
body > div.site-wrapper.mainWrap > div > main > div.el-tabs.el-tabs--top > div.el-tabs__header.is-top{
  margin-top: 0;
}

// 搜索条件之间边距
.searchMargin{
  margin-right: 0.3vw !important;
}
// 文本溢出隐藏
.textHiding{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
// 主要按钮样式
.el-button--primary{
  height:36px !important;
  background-color: #0091FF !important;
  border-color: #0091FF !important;
  color: white !important;
}
.el-button--primary:hover{
  background:#5eadff !important;
  border-color: #5eadff !important;
}
.el-button--primary:focus{
  background:#2476e0 !important;
  border-color: #2476e0 !important;
}
// 朴素按钮样式
.el-button--default.is-plain{
  height:36px !important;
  border-color: #ddd !important;
}
.el-button--default.is-plain:hover{
  color: #606266 !important;
  border-color:#5eadff !important;
}
.el-button--default.is-plain:focus{
  color: #606266 !important;
  border-color:#2476e0 !important;
}
.el-input__inner:focus{
  border-color: #0091FF !important;
}
.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
  background-color:#0091FF;
  border-color: #0091FF;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #0091FF !important;
}
.el-checkbox.is-bordered.is-checked{
  border-color: #0091FF !important;
}
.el-checkbox__input.is-focus .el-checkbox__inner{
  border-color:  #0091FF !important;
}
.viewer-container {
  z-index: 99999999999999999!important;
}
</style>
