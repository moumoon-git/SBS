<template>
  <div
    v-loading.fullscreen.lock="loading"
    class="site-wrapper site-page--login"
    element-loading-spinner="sv-loading"
    element-loading-text="正在加载中"
  >
    <div v-if="!loading" class="site-content__wrapper">
      <div class="site-content">
        <div class="title">
          <div
            class="name"
            :style="{ fontSize: updateStyle.wordSize + 'px' }"
          >{{ updateStyle.name }}{{ updateStyle.pname }}</div>
          <!--          <div-->
          <!--            class="pname"-->
          <!--            :style="{fontSize: updateStyle.wordSize*0.7+'px'}"-->
          <!--          >-->
          <!--            {{ updateStyle.pname }}-->
          <!--          </div>-->
        </div>
        <div class="outBorder">
          <!-- <div class="brand-info">{{pname?pname:'社会治理综合管理平台'}}</div> -->
          <div class="login-main">
            <div class="versionNumber">欢迎登录</div>
            <el-form
              ref="dataForm"
              :model="dataForm"
              status-icon
              style="margin: 40px 0;position:static"
              @keyup.enter.native="dataFormSubmit()"
            >
              <div style="color: rgba(255, 255, 255, 0.6)">用户名</div>
              <el-form-item prop="userName" class="userName">
                <el-input
                  v-model="dataForm.userName"
                  placeholder="请输入用户名"
                  clearable
                  autofocus
                  autocomplete
                />
              </el-form-item>
              <div style="color: rgba(255, 255, 255, 0.6)">密码</div>
              <el-form-item prop="password" class="password">
                <!-- <el-input type="password" style="postion:fixed;bottom:-9999px"></el-input>
                <el-input type="password" class="forget" clearable></el-input>-->
                <el-input
                  v-model="dataForm.password"
                  type="password"
                  placeholder="请输入密码"
                  :trigger-on-focus="false"
                  clearable
                />
              </el-form-item>
              <el-form-item>
                <el-row :gutter="20">
                  <el-col :span="14">
                    <el-input v-model="dataForm.captcha" placeholder="验证码" />
                  </el-col>
                  <el-col :span="10" class="login-captcha">
                    <img :src="dataForm.captchaPath" alt @click="getCaptcha()" />
                  </el-col>
                </el-row>
              </el-form-item>
              <!-- <div>验证码</div>
              <el-form-item prop="captcha" class="captcha">
                    <el-input
                      v-model="dataForm.captcha"
                      placeholder="请输入验证码"
                      clearable
                    ></el-input>
                    <span
                      type="primary"
                      @click="sendMessage"
                      class="getVerificationCode"
                    >{{getCode}}</span>
              </el-form-item>-->
              <!-- <el-form-item class="operation">
                <el-radio-group v-model="radio2">
                  <el-radio
                    label="Yes"
                    @click.native.prevent="radioExt('Yes', radio2, 'radio2')"
                    class="rememberPassword"
                    tabindex="5"
                  >记住密码</el-radio>
                  <el-radio label="No" @click.native.prevent="radioExt('No', radio2, 'radio2')">No</el-radio>
                </el-radio-group>
                <div class="forgetPassword" tabindex="6">忘记密码?</div>
              </el-form-item>-->
            </el-form>

            <el-button
              class="login-btn-submit"
              type="primary"
              @click="dataFormSubmit()"
              @keyup.enter.native="dataFormSubmit()"
            >登录</el-button>
          </div>
        </div>
        <div class="secret">
          <div class="secret_l">
            <el-checkbox v-model="checked">我已阅读并同意</el-checkbox>
          </div>
          <div class="secret_r" @click="jumpToSecret">隐私政策</div>
        </div>
        <div class="copyright" />
      </div>
    </div>
    <banquet ref="banquets" />
    <div class="recordNumber">{{ recordNumber }}</div>
    <div class="downFile">
      <div
        v-for="(item, index) in fileList"
        :key="item.id"
      >
        <div class="item" :title="item.name" @click="openDownloadDialog(item)">
          {{ item.fileName }}
        </div>
        <span v-if="index !== fileList.length-1" />
      </div>
    </div>
    <downloadDialog ref="downloadDialogRef" />
  </div>
</template>

<script>
import { getUUID } from '@/utils';
import Watermark from '@/utils/watermark';
import $ from 'jquery';
import { Encrypt, Decrypt } from '@/utils/AESUtils';
import banquet from './banquet';
import url from '../../mock/modules/url';
import downloadDialog from './downloadDialog.vue';

export default {
  components: {
    banquet,
    downloadDialog,
  },
  data() {
    return {
      // 下载文件列表
      fileList: [],
      dataForm: {
        userName: '',
        password:
          this.$cookie.get('check') === 'true'
            ? this.$cookie.get('password')
            : '',
        uuid: '',
        captcha: '',
        codeNum: '',
      },
      getCode: '获取验证码',
      radio2: 'No',
      updateStyle: {
        name: '3.0一体化指挥中台',
        pname: '',
        wordSize: 70,
        background: '',
      },
      recordNumber: '',
      backgroundUrl: require('../../assets/img/zhongshu.png'),
      baseUrl: window.SITE_CONFIG.cloudUrl,
      loading: false,
      welcomeView: true,
      checked: true,
    };
  },
  computed: {
    userId: {
      get() {
        return this.$store.state.user.id;
      },
      set(val) {
        this.$store.commit('user/updateId', val);
      },
    },
    userName: {
      get() {
        return this.$store.state.user.name;
      },
      set(val) {
        this.$store.commit('user/updateName', val);
      },
    },
    userMobile: {
      get() {
        return this.$store.state.user.mobile;
      },
      set(val) {
        this.$store.commit('user/updateMobile', val);
      },
    },
    platformId: {
      get() {
        return this.$store.state.user.platformId;
      },
      set(val) {
        this.$store.commit('user/updatePlatformId', val);
      },
    },
    isAdmin: {
      get() {
        return this.$store.state.user.isAdmin;
      },
      set(val) {
        this.$store.commit('user/updateIsAdmin', val);
      },
    },
  },
  created() {
    // url地址登录时添加背景图片

    if (this.$route.query.infor) {
      // 存起来
      // console.log("存起来存起来存起来",this.$route.query.infor)
      this.$store.commit('user/updateHopRoutingInfo', this.$route.query.infor);

      this.getQueryString(this.$route.query.infor);
    } else {
      // 默认登录时添加背景图片
      // 图片模糊只能通过为元素添加，伪元素中动态添加背景图片
      $('head').append(
        `<style>.site-wrapper::before{ background: url(${this.backgroundUrl}) no-repeat }</style>`,
      );
      this.bigTitle();
      this.smallTitle();
    }
    this.getCaptcha();
    this.getRecordNumber();
    this.getFileList();
  },
  mounted() {
    Watermark.set('');

    this.radioExt(
      this.$cookie.get('check') === 'true' ? 'Yes' : 'No',
      this.radio2,
      'radio2',
    );
    this.autoLogin();
  },
  methods: {
    /**
     * 获取登录页文件记录列表
     */
    async getFileList() {
      const request = {
        method: 'get',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: 'loginPageFile/list',
      };
      try {
        const { data } = await this.$http(request);
        if (data.code === 0) {
          this.fileList = data.data;
        } else {
          this.$message.error(`获取登录页文件记录列表失败,失败原因${data.msg}`);
        }
      } catch (error) {
        this.$message.error(`获取登录页文件记录列表出错,失败原因${error}`);
      }
    },
    /**
     * 点击打开下载弹窗
     * @param { object } item 下载对象
     */
    openDownloadDialog(item) {
      this.$refs.downloadDialogRef.open(item);
    },
    // 跳转隐私页面
    jumpToSecret() {
      this.$router.push('/secret');
    },
    // 解析url参数
    getQueryString(infor) {
      this.$http({
        url: this.$http.adornUrl('/sys/sysLoginPage/decryptInfo'),
        method: 'post',
        data: this.$http.adornData({
          infor,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0 && data.data) {
          // console.log(data);
          this.updateStyle = data.data;
          $('head').append(
            `<style>.site-wrapper::before{ background: url(${this.baseUrl + this.updateStyle.background
            }) no-repeat }</style>`,
          );
        } else {
          this.$message.error('无法获取自定义登录页信息');
          $('head').append(
            `<style>.site-wrapper::before{ background: url(${this.backgroundUrl}) no-repeat }</style>`,
          );
          this.bigTitle();
          this.smallTitle();
        }
      });
    },
    // 大标题名
    bigTitle() {
      this.$http({
        url: this.$http.adornUrl('/sys/config/infoByKey?key=SYSTEM_NAME_BIG'),
        method: 'get',
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data);
          this.updateStyle.name = data.config.paramValue;
          // 设置标签名
          document.title = data.config.paramValue;
          localStorage.setItem('tabTitle', data.config.paramValue);
          if (/北七家/.test(data.config.paramValue)) {
            this.backgroundUrl = require('../../assets/img/beiqijia_login_bg.png');
            $('head').append(
              `<style>.site-wrapper::before{ background: url(${this.backgroundUrl}) no-repeat }</style>`,
            );
          }
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 小标题名
    smallTitle() {
      this.$http({
        url: this.$http.adornUrl('/sys/config/infoByKey?key=SYSTEM_NAME_SMALL'),
        method: 'get',
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data);
          this.updateStyle.pname = data.config.paramValue;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 备案号
    getRecordNumber() {
      this.$http({
        url: this.$http.adornUrl('/sys/config/infoByKey?key=BAH'),
        method: 'get',
      }).then((data) => {
        if (data && data.data.code === 0) {
          // console.log("备案号", data);
          if (data.data.config) {
            this.recordNumber = data.data.config.paramValue;
          }
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 提交表单
    dataFormSubmit(jump = false) {
      const that = this;
      if (!this.dataForm.userName) {
        this.$message.error('请输入用户名');
        return;
      }
      if (!this.dataForm.password) {
        this.$message.error('请输入密码');
        return;
      }
      if (!this.dataForm.captcha) {
        this.$message.error('请输入验证码');
        return;
      }
      if (!this.checked) {
        this.$message.error('请阅读并同意隐私政策');
        return;
      }
      // this.$refs["dataForm"].validate(valid => {
      // if (valid) {
      const userName = this.dataForm.codeNum === 'codeNum'
        ? this.dataForm.userName
        : Encrypt(
          this.dataForm.userName,
          '_aes_secret_key_',
          '_aes_secret_iv__',
        ).toString();
      const password = this.dataForm.codeNum === 'codeNum'
        ? this.dataForm.password
        : Encrypt(
          this.dataForm.password,
          '_aes_secret_key_',
          '_aes_secret_iv__',
        ).toString();

      const formData = new FormData();
      formData.append('username', userName);
      formData.append('password', password);
      formData.append('uuid', this.dataForm.uuid);
      formData.append('captcha', this.dataForm.captcha);
      formData.append('codeNum', this.dataForm.codeNum || this.dataForm.captcha);
      this.$http({
        baseURL: window.SITE_CONFIG.cloudUrl,
        url: '/oauth/login',
        // url: this.$http.adornUrl("/sys/login"),
        method: 'post',
        // data: this.$http.adornData({
        //   username: userName,
        //   password: password,
        //   uuid: this.dataForm.uuid,
        //   captcha: this.dataForm.captcha,
        //   codeNum: this.dataForm.codeNum,
        // }),
        data: formData,
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log("平台信息", data);
          sessionStorage.setItem('latitude', data.platform.latitude);
          sessionStorage.setItem('longitude', data.platform.longitude);
          localStorage.setItem('platformName', data.platform.platformName);
          this.$cookie.set('userId', data.userId);
          this.$cookie.set('userName', data.username);
          this.$cookie.set('token', data.token);
          this.$cookie.set('isAdmin', data.isAdmin);
          this.$cookie.set('platformId', data.platformId);
          this.$cookie.set('password', this.dataForm.password);
          this.$cookie.set('platformName', data.platform.platformName);
          this.$cookie.set('platformNameTaskUse', escape(data.platform.platformName));
          this.$cookie.set('EnterpriseView', 'true'); // 企业认证弹窗
          this.$cookie.set('ElectronicPasseView', 'true'); // 电子通行弹窗
          this.$cookie.set('latitude', data.platform.latitude);
          this.$cookie.set('longitude', data.platform.longitude);
          this.$cookie.set('seatInformation', null);
          this.$cookie.set('jumpSetSeat', null);
          this.$store.commit('user/updatePlatformTitle', data.platform.platformTitle);
          this.$cookie.set('platformTitle', data.platform.platformTitle);
          // 平台背景图片
          sessionStorage.setItem('platformBackgroundImage', data.platform.backgroundImage || '');
          // 设置平台标题
          if (data.platform.platformTitle) {
            document.title = data.platform.platformTitle;
            localStorage.setItem('tabTitle', data.platform.platformTitle);
          }

          // 移除sessionStorage
          // 移除事件id
          sessionStorage.removeItem('newID');
          if (data.platform.animationFlag === 0) {
            this.$router.replace({ name: "home" });
          } else {
          // this.$router.replace({ name: 'secondary' })
          }
          localStorage.userPhoneFlag = false;
          if (jump) {
            this.$router.replace({
              path: window.SITE_CONFIG.autoLogin || '/SecondaryPage',
            });
          } else {
            this.$router.replace({
              // 3.0 新的次级页面
              name: 'SecondaryPage',
            });
          }
        } else {
          this.getCaptcha();
          this.$message.error(data.msg);
        }
      });
      // }
      // });
    },
    // 获取验证码
    getCaptcha() {
      this.dataForm.uuid = getUUID();
      this.dataForm.captchaPath = this.$http.adornUrl(
        `/captcha.jpg?uuid=${this.dataForm.uuid}`,
      );
      this.$forceUpdate();
    },
    sendMessage() {
      // this.$refs["dataForm"].validate(valid => {
      // if (valid) {
      this.$http({
        url: this.$http.adornUrl('/sys/getMobileLoginVerificationCode'),
        method: 'get',
        params: this.$http.adornParams({
          username: this.dataForm.userName,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (this.getCode == '重新获取' || this.getCode == '获取验证码') {
            let reciprocal = 60;
            var time = setInterval(() => {
              this.getCode = `请稍后( ${reciprocal--} )`;
              if (reciprocal == 0) {
                clearInterval(time);
                this.getCode = '重新获取';
              }
            }, 1000);
          }
        } else {
          this.$message.error(data.msg);
        }
      });
      // }
      // });
    },
    radioExt(v, m, _m) {
      const that = this;
      let _v = `this.${_m}="${v}"`;
      if (v === m) {
        _v = `this.${_m}=null`;
        that.$cookie.set('check', false);
      } else {
        that.$cookie.set('check', true);
      }
      eval(_v);
    },
    /**
     * @method
     * @author tanjinfeng
     * @date 2020-11-03
     * @desc 从URL中获取账户信息，自动登录
     */
    autoLogin() {
      const { href } = window.location;
      const params = /\?.*&?user=(.*[^&])&password=([^&]*)/gi.exec(href);
      if (params && params.length && params.length === 3) {
        this.dataForm.userName = decodeURIComponent(params[1]);
        this.dataForm.password = decodeURIComponent(params[2]);
        this.dataForm.captcha = '123';
        this.dataForm.codeNum = 'codeNum';
        this.dataForm.uuid = 'nanhai-singlesignon-2021.3.0';
        this.loading = true;
        this.dataFormSubmit();
      }

    },
  },
};
</script>

<style lang="less" scoped>
.downFile{
  position: relative;
  width: 100vw;
  height: 100px;
  position: absolute;
  bottom: 0px;
  display: flex;
  align-items: center;
  padding: 0px 50px;
  color: #2FA5FF;
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  overflow: auto;
  flex-wrap: wrap;
  &::-webkit-scrollbar {
    background: transparent;
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d5d5d5;
    border-radius: 5px;
  }
  .item{
    display: inline-block;
    margin: 0px 12px;
    cursor: pointer;
    max-width: 200px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  span{
    &::after {
      content: '';
      background: #2FA5FF;
      width: 2px;
      height: 16px;
      position: absolute;
      margin-top: 8px;
      // margin-left: 12px;
    }
  }
}
ul {
  padding: 0;
  list-style: none;
}
.el-button {
  background: rgba(62, 143, 250, 1);
  color: white;
}
.site-wrapper {
  position: relative;
  position: relative;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    // background: url(../../assets/img/bgc.png) no-repeat;
    //filter: blur(2px);
    z-index: -1;
    background-size: 100% 100%;
    margin: 0;
    padding: 0;
  }
}
/* 如果设备像素大于等于1 */
// @media screen and (max-device-pixel-ratio: 1),
//   screen and (-webkit-max-device-pixel-ratio: 1),
//   screen and (-moz-max-device-pixel-ratio: 1),
//   screen and (-ms-max-device-pixel-ratio: 1) {
// .login-main {
//   width: 1400px;
//   height: 759px;
//   position: absolute;
//   left: 14vw;
//   top: 11.5vh;
//   background-image: url(/static/img/底框.png);
//   background-size: 1400px 759px;
// }
// .brand-info {
//   font-size: 3vw;
//   font-family: Microsoft YaHei;
//   // font-weight:bold;
//   color: rgba(255, 255, 255, 1);
//   text-shadow: 4px 4px 6px rgba(0, 0, 0, 0.5);
//   position: absolute;
//   margin: 9vh 6.3vw;
//   letter-spacing: 0.2vw;
//   // left: 15vw;
//   // top: 120px;
// }
// }
/* 如果设备像素大于等于2 */
// @media screen and (max-device-pixel-ratio: 2),
//   screen and (-webkit-max-device-pixel-ratio: 2),
//   screen and (-moz-max-device-pixel-ratio: 2),
//   screen and (-ms-max-device-pixel-ratio: 2) {
.login-main {
  width: 386px;
  // background-image: url(../../assets/img/smallbgc.png);
  // background-size: cover;
  border-radius: 10px;
  position: relative;
  background: rgba(28, 37, 65, 0.8);
  box-shadow: 0 0 13px rgba(0, 235, 255, 0.35) inset;
  border: 2px solid rgba(0, 152, 195, 0.51);
  padding: 0 40px;
}
.brand-info {
  // position: absolute;
  font-size: 26px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: rgba(79, 255, 255, 0.8);
  // margin-left: -3vw;
  text-align: center;
  letter-spacing: 0.2vw;
  padding: 15px 0;
  box-sizing: border-box;
  // position: absolute;
  // left: 90px;
  // top: 60px;
}
// }

body,
html {
  width: 100%;
  height: 100%;
  position: relative;
}
.title {
  //width: calc(100vw - 650px);
  width: 100vw;
  min-width: 940px;
  font-weight: 600;
  position: absolute;
  top: 12vh;
  right: 0;
  text-align: center;
  //left: 8%;
  .name {
    font-family: "SourceHanSansCN-Regular" !important;
    color: rgba(255, 251, 251, 0.85);
    text-shadow: 0px 2px 4px rgba(100, 98, 98, 0.5);
    margin-bottom: 0px;
  }
  .pname {
    color: rgba(255, 251, 251, 0.89);
    text-shadow: 0px 2px 4px rgba(100, 98, 98, 1);
  }
}
.logo {
  position: absolute;
  height: 80px;
  line-height: 80px;
  img {
    height: 50%;
    margin: -15px 20px 0;
  }
  span {
    font-size: 26px;
    font-weight: bold;
    color: #00dbed;
  }
}
.small {
  position: absolute;
  top: 38%;
  left: 26%;
}
.site-wrapper.site-page--login {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background-size: 100% 100%;
  background-position: center;
  overflow: hidden;
  .el-form-item {
    width: 280px;
    height: 36px;
  }
  .loginWay li {
    list-style: none;
    flex: 1;
    text-align: center;
    height: 6vh;
    line-height: 6vh;
    font-size: 1vw;
  }
  .active {
    border-bottom: 3px solid #409eff;
  }
  .userName {
    margin: 0 60px;
    margin-top: 30px;
  }
  /deep/ .el-input__inner {
    border: none;
    background-color: rgba(28, 37, 65, 0);
    border-bottom: 1px solid rgba(204, 204, 204, 1);
    color: #fff;
    border-radius: 0;
    padding: 0;
    caret-color: #fff;
    // 自动填充文本样式
    &:-webkit-autofill::first-line {
      color: #fff;
      font-size: 14px;
    }
  }
  .password {
    margin: 0 60px;
    margin-top: 20px;
    .forget {
      height: 0;
      opacity: 0;
      position: absolute;
    }
  }
  .captcha {
    margin: 0 60px;
    margin-top: 20px;
  }
  .primary {
    margin: 0 60px;
    margin-top: 20px;
  }
  .copyright {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 3%;
    width: 450px;
    height: 15px;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: white;
    opacity: 0.6;
  }
  .site-content__wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 0;
    overflow: hidden;
    background-color: transparent;
    width: 100%;
    height: 100%;
    // background: url(../../assets/img/grid.png) no-repeat;
    background-size: 100% 100%;
  }
  .site-content {
    height: 100%;
    width: 100%;
    position: relative;
  }

  .brand-info__text {
    margin: 0 0 22px 0;
    font-size: 48px;
    font-weight: 400;
    text-transform: uppercase;
  }
  .brand-info__intro {
    margin: 10px 0;
    font-size: 16px;
    line-height: 1.58;
    opacity: 0.6;
  }
  .outBorder {
    width: 400px;
    margin: 27vh 68%;
  }
  .login-main {
    // position: relative;
    position: fixed;
    right: 40%;
    top: 50vh;
    transform: translateY(-50%);
    padding: 0 40px;
    // width: 400px;
    // height: 375px;
    // background:url(../../assets/img/底框.png);
    // background-size: 400px 375px;
    // box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.2);
    // border-radius: 4px;
    // box-sizing: border-box;
    box-sizing: border-box;
    .versionNumber {
      width: 100%;
      height: 70px;
      line-height: 70px;
      font-size: 26px;
      font-weight: 400;
      color: #ffffffff;
      text-align: center;
      border-bottom: 2px solid rgba(255, 255, 255, 1);
    }
    .userInfo {
      margin-top: 40px;
      li {
        div {
          margin-top: 10px;
          font-size: 14px;
          font-family: "Microsoft YaHei", PingFangSC-Regular, "PingFang SC",
            Roboto-Regular, SourceHanSansCN-Regular;
          font-weight: 400;
          color: #ccc;
        }
        input {
          width: 100%;
          height: 35px;
          outline: none;
          border: none;
          border-bottom: 1px solid rgba(204, 204, 204, 1);
          background-color: transparent;
        }
      }
    }
  }
  // .slice {
  //   width: 840px;
  //   height: 720px;
  //   // position: absolute;
  //   // left: 14vw;
  //   // top: 11.5vh;
  //   background-image: url(../../assets/img/wenzidec.png);
  //   background-size: 840px 720px;
  // }
  .login-title {
    // margin-top: 19px;
    font-size: 18px;
    font-family: MicrosoftYaHei-Bold;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    text-align: center;
  }
  .login-captcha {
    overflow: hidden;
    > img {
      width: 100%;
      cursor: pointer;
    }
  }
  .login-btn-submit {
    width: 100%;
    height: 34px;
    border-radius: 4px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    letter-spacing: 2px;
    margin-bottom: 40px;
  }
  .el-tabs--top {
    min-width: 0px;
  }
  .el-form {
    position: absolute;
    top: calc(50% - 140px);
    right: calc(50% - 200px);
    .logo {
      margin: 0 5.5vw 13vh;
      font-size: 2.5vw;
      font-family: Microsoft YaHei;
      font-weight: 300;
      color: rgba(255, 255, 255, 1);
      letter-spacing: 0.5vw;
    }
    .getVerificationCode {
      text-align: center;
      position: absolute;
      right: 0;
      color: #999999;
    }
    .operation {
      display: flex;
      justify-content: flex-start;
      margin: 15px 0 0 60px;
      .rememberPassword {
        color: rgba(79, 255, 255, 0.7);
      }
      .forgetPassword {
        margin-top: -10px;
        color: rgba(79, 255, 255, 0.7);
        cursor: pointer;
      }
    }
    .submit {
      margin-top: 0;
      justify-content: none;
    }
  }
  .el-radio:last-child {
    // margin-left: -2.2vw;
    z-index: -1;
  }
  // .el-form-item__content{
  //   display: flex;
  //   justify-content: space-between;
  // }
  .recordNumber {
    color: rgba(255, 255, 255, 0.7);
    position: fixed;
    bottom: 4px;
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: 400;
  }
}
/deep/ .el-form-item--medium .el-form-item__content {
  display: flex;
  justify-content: space-between;
}

.site-wrapper.site-page--login .el-form {
  width: 307px;
  top: calc(50% - 120px);
  right: 40px;
}
.site-wrapper.site-page--login .el-form-item {
  margin: 0;
  margin-bottom: 20px;
  width: 100%;
}

/deep/ input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
  background-color: transparent;
  background-image: none;
  transition: background-color 50000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间
}
.secret {
  color: #fff;
  display: flex;
  width: 370px;
  height: 15px;
  font-size: 16px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  -webkit-box-align: center;
  align-items: center;
  align-content: center;
  position: fixed;
  right: 40%;
  top: 75vh;
  transform: translateY(-50%);
  padding: 0 40px;
  box-sizing: border-box;
  a:hover {
    color: #3e8ef7;
    text-decoration: none;
  }
}
.secret_r {
  color: #0091ff;
  font-size: 18px;
  margin-left: 10px;
  border-left: 2px solid #fff;
  padding-left: 10px;
  height: 16px;
  line-height: 13px;
  cursor: pointer;
  &:hover {
    text-decoration: none;
  }
}
.secret /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #fff;
}
.secret /deep/ .el-checkbox__inner::after {
  width: 6px;
  height: 9px;
}
.secret /deep/ .el-checkbox {
  color: #fff;
  display: flex;
  .el-checkbox__inner {
    width: 18px;
    height: 18px;
  }
  .el-checkbox__label {
    font-size: 18px;
  }
}

</style>

<style>
input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
  background-color: transparent;
  background-image: none;
  transition: background-color 50000s ease-in-out 0s;
}
</style>
