<!--
 * @Author: your name
 * @Date: 2020-11-11 09:16:31
 * @LastEditTime: 2020-11-23 13:25:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \SBS\src\views\main-navbar.vue
-->
// 首页入口
<template>
  <!-- <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType" :style="{'background':`${typeof Number($window.SITE_CONFIG['baseUrl'].substr(7,1))=='number'?'initial':'#2b3547!important'}`}">  -->
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div
      class="site-navbar__header"
      v-if="
        typeof Number($window.SITE_CONFIG['baseUrl'].substr(7, 1)) == 'number'
      "
    >
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <template v-if="isLogo == 1">
          <a class="site-navbar__brand-lg" href="javascript:;">
            <img width="156px" height="34px" src="../assets/img/logo.png"
          /></a>
        </template>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu
        class="site-navbar__menu"
        mode="horizontal"
        :style="{
          position: isLogo != 1 ? 'absolute' : 'initial',
          left: isLogo != 1 ? '-9%' : 'initial',
        }"
      >
        <el-menu-item
          class="site-navbar__switch"
          index="0"
          @click="changesidebarFold"
        >
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>
      <div
        class="site-navbar__title"
        :style="{
          width: 'fit-content',
          'font-size': '25px',
          position: isLogo != 1 ? 'absolute' : 'initial',
          left: isLogo != 1 ? '-6%' : 'initial',
        }"
      >
        {{ `${platformTitle}` }}
      </div>

      <el-menu
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal"
        style="margin-top:10px;height: 30px;line-height: 30px;"
      >
        <uploadFile v-if="$cookie.get('isAdmin') === '1'" />
        <!-- 坐席弹窗 -->
        <SelectSeatsDialog v-if="useUDS" />
        <LngLatTransform />
        <!-- <el-menu-item index="1" @click="$router.push({ name: 'theme' })">
          <template slot="title">
            <el-badge value="new">
              <icon-svg name="shezhi" class="el-icon-setting"></icon-svg>
            </el-badge>
          </template>
        </el-menu-item> -->
        <!--
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-popover
            class="online_count_popover"
            placement="bottom"
            width="700"
            trigger="click"
          >
            <span>当前在线总数：{{ userCount }}</span>
            <div style="overflow-y: scroll; height: 350px">
              <table>
                <template v-for="(headItem, index) in userCountList">
                  <tr style="background: #f2f2f2">
                    <td colspan="4">{{ headItem.platform.platformName }}</td>
                    <td colspan="2">（在线数：{{ headItem.count }}）</td>
                  </tr>
                  <tr
                    v-for="(contentItem, index) in headItem.userList"
                    :key="index"
                  > -->
        <!-- <td style="width: 3%">
                      <span style="color: #16c88b; font-size: 10px">·</span>
                    </td> -->
        <!-- <td class="td_normal">登录账号</td>
                    <td class="td_user">
                      {{ contentItem.user.username }}({{
                        contentItem.user.userId
                      }})
                    </td>
                    <td class="td_normal">上线时间</td>
                    <td class="td_long">{{ contentItem.loginTime }}</td>
                    <td class="td_normal">在线时长</td>
                    <td class="td_online_time">
                      {{ contentItem.onlineTime }}小时
                    </td>
                  </tr>
                </template>
              </table>
            </div>
            <el-button type="text" slot="reference"
              ><span
                style="
                  color: #16c88b;
                  font-size: 100px;
                  position: relative;
                  bottom: 5px;
                "
                >·</span
              >
              <span
                style="
                  color: white;
                  margin-right: 30px;
                  position: relative;
                  bottom: 33px;
                "
                >在线数:{{ userCount }}</span
              ></el-button
            > -->
        <!--
             /**
              * @description:注释了之前的折叠板信息，按照UI图重新处理的
              * @auth yanghaohao
              * @data 2020.11.12
              */
             -->
        <div
          class="message-more"
          :class="isFocus ? 'message-more__focus' : 'message-more__unfocus'"
        >
          <!-- <span @click="onlineCondition" style="cursor: pointer">
            <img src="../assets/img/online.svg" alt="" />
            <span v-if="userCount > 0" class="span_point">{{ userCount }}</span>
          </span> -->
          <div class="message-more__content">
            <div style="position: absolute;top: -13px;right: 65px;">
              <canvas id="trigCanvas"> </canvas>
            </div>
            <div class="content_title">
              <div>
                <canvas id="pointCanvas"> </canvas>
              </div>
              <span style="margin-left: 10px">
                当前在线总数：{{ userCount }}</span
              >
              <span class="message__close" @click="isFocus = false"></span>
            </div>
            <div
              class="table_content"
              style="overflow-y: scroll; height: 450px"
            >
              <div v-for="(headItem, index) in userCountList" :key="index">
                <div class="table_title">
                  <span colspan="4">{{ headItem.platform.platformName }}</span>
                  <span colspan="2">在线数：{{ headItem.count }}</span>
                </div>
                <div
                  v-for="(contentItem, index) in headItem.userList"
                  :key="index"
                  class="everyRow"
                >
                  <!-- <td style="width: 3%">
                      <span style="color: #16c88b; font-size: 10px">·</span>
                    </td> ({{
                        contentItem.user.userId
                      }})-->
                  <span class="td_normal"
                    >登录账号：
                    <span class="td_user">
                      {{ contentItem.user.username }}
                    </span>
                  </span>

                  <span class="td_normal"
                    >上线时间：
                    <span class="td_time">{{ contentItem.loginTime }}</span>
                  </span>

                  <span class="td_normal"
                    >在线时长：
                    <span class="td_times">
                      {{ parseFloat(contentItem.onlineTime).toFixed(1) }}小时
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- <el-tooltip class="item" effect="dark" content="设置" placement="bottom" style="display:none">
          <el-button
            type="button"
            size="small"
            icon="el-icon-s-tools"
            class="shrink-button"
            @click="settingVisible=true"
          ></el-button>
        </el-tooltip> -->

        <!-- </el-popover> -->
        <!-- <span @click="showUserCount">

            </span> -->
        <img
          src="../assets/img/back.png"
          alt=""
          style="
            width: 20px;
            height: 20px;
            vertical-align: middle;
            margin-right: 10px;
            outline: none;
          "
          @click="back"
        >
        <img
          src="../assets/img/portrait.png"
          style="
            width: 20px;
            height: 20px;
            vertical-align: middle;
            margin-right: 12px;
            margin-top: 1px;
            outline: none;
            display:none
          "
          :alt="userName"
        /><span style="color: white; outline: none">{{ userName }}</span>
        <el-dropdown :show-timeout="0" placement="bottom">
          <i
            class="el-icon-arrow-down"
            style="font-size: 16px; color: white; margin-left: 12px"
          ></i>
          <span class="el-dropdown-link" style="font-size: 18px"> </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="updatePasswordHandle()"
              >修改密码</el-dropdown-item
            >
            <el-dropdown-item @click.native="logoutHandle()"
              >退出</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <!-- </el-menu-item> -->
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password
      v-if="updatePassowrdVisible"
      ref="updatePassowrd"
    ></update-password>
    <setting-dialog
      ref="settingDialog"
      :dialogVisible="settingVisible"
      @handleClose="settingVisible=false"
    ></setting-dialog>
  </nav>
</template>

<script>
import UpdatePassword from "./main-navbar-update-password";
import { clearLoginInfo } from "@/utils";
import bus from "./common/js/eventBus";
import LngLatTransform from './common/LngLatTransform/LngLatTransform';
import uploadFile from './common/uploadFilePage/uploadFile';
import SelectSeatsDialog from '@/views/modules/sys/SeatsManagement/components/Dialog/SelectSeatsGroup.vue';
import settingDialog from "@/view/yz_SysSetting/settingDialog";


export default {
  components: {
    UpdatePassword,
    LngLatTransform,
    SelectSeatsDialog,
    settingDialog,
    uploadFile,
  },
  data() {
    return {
      isFocus: false,
      settingVisible: false,
      updatePassowrdVisible: false,
      platformName: "",
      $window: {},
      userCount: 0,
      userCountList: [],
      welcomeView: true,
      useUDS: false, // 是否能使用uds能力
    };
  },
  computed: {
    navbarLayoutType: {
      get() {
        return this.$store.state.common.navbarLayoutType;
      },
    },
    sidebarFold: {
      get() {
        return this.$store.state.common.sidebarFold;
      },
      set(val) {
        this.$store.commit("common/updateSidebarFold", val);
      },
    },
    mainTabs: {
      get() {
        return this.$store.state.common.mainTabs;
      },
      set(val) {
        this.$store.commit("common/updateMainTabs", val);
      },
    },
    userName: {
      get() {
        return this.$store.state.user.name;
      },
    },
    platformNames: {
      get() {
        return this.$store.state.user.platformName;
      },
      set(val) {
        this.$store.commit("user/updatePlatformName", val);
      },
    },
    platformTitle() {
      return this.$store.state.user.platformTitle || this.$cookie.get('platformTitle');
    },
    hopRoutingInfo: {
      get() {
        return this.$store.state.user.hopRoutingInfo;
      },
      set(val) {
        this.$store.commit("user/updateHopRoutingInfo", val);
      },
    },
    isLogo: {
      get() {
        return this.$store.state.user.isLogo;
      },
      set(val) {
        this.$store.commit("user/updateIsLogo", val);
      },
    },
  },
  created() {
    this.$window = window;
  },
  mounted() {
    this.canvasPoint();
    this.canvasTrig();
    this.$http.get(`${window.SITE_CONFIG.baseUrl}/sys/config/infoByKey?key=WELCOME_VIEW`)
      .then((res) => {
        if (
          res.data.code === 0
          && res.data.config
        ) {
          this.welcomeView = false;
        }
      });
    this.$http({
      url: this.$http.adornUrl("/sys/platform/platformName"),
      method: "get",
      params: this.$http.adornParams({
        id: this.$store.state.user.platformId,
      }),
    }).then(({ data }) => {
      if (data) {
        this.platformName = data;
        this.platformNames = data;
        bus.$emit('diaomao',this.platformName)
      } else {
        this.$message.error(data.msg);
      }
    });
    this.getOnlineCount();
    // 是否能使用uds能力
    this.useUDS = sessionStorage.getItem('useUDS') === '1';
  },
  methods: {
    getOnlineCount() {
      // 在线统计人数
      this.$http({
        url: this.$http.adornUrl('/sys/platform/onlineCount'),
        method: 'GET',
        params: this.$http.adornParams({
          // id: this.$store.state.user.platformId,
        }),
      }).then(({ data }) => {
        if (data) {
          this.userCount = data.data.count;
          this.userCountList = data.data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
      // 5分钟更新一次
      setTimeout(this.getOnlineCount, 1000 * 60 * 5);
    },
    /**
     * @description:画三角指示箭头
     * @param {*}
     * @return {*}
     */
    canvasTrig() {
      const canvas = document.getElementById("trigCanvas");
      const ctx = canvas.getContext("2d");

      const canvasWidth = 20;
      const canvasHeight = 12;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(0, 12);
      ctx.lineTo(20, 12);

      ctx.fillStyle = "#fff";
      ctx.fill();
    },
    /**
     * @description:画圆点
     * @param {*}
     * @return {*}
     */
    canvasPoint() {
      const canvas = document.getElementById("pointCanvas");
      const ctx = canvas.getContext("2d");

      const canvasWidth = 24;
      const canvasHeight = 24;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      //绘制背景圆图层
      ctx.beginPath();
      ctx.arc(14, 14, 9, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = "RGB(11,210,149,19%)";

      ctx.fill();

      ctx.beginPath();
      ctx.arc(14, 14, 6, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = "#0BD295";

      ctx.fill();
    },
    /**
     * @description: 控制是否展开折叠板信息
     * @param {*}
     * @return {*}
     */
    onlineCondition() {
      this.isFocus = !this.isFocus;
    },
    // 修改密码
    updatePasswordHandle() {
      this.updatePassowrdVisible = true;
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init();
      });
    },
    changesidebarFold() {
      this.sidebarFold = !this.sidebarFold;
    },
    // 退出
    logoutHandle() {
      this.$confirm(`确定进行[退出]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: 'main-navbar__confirm__cancel',
        type: "warning",
      })
        .then(() => {
          this.$http({
            baseURL: window.SITE_CONFIG.cloudUrl,
            url: "/oauth/logout",
            method: "post",
            headers: {
              token: this.$cookie.get('token'),
            },
          }).then(({ data }) => {
            if (data && data.code === 0) {
              let url = this.hopRoutingInfo;
              clearLoginInfo();
              bus.$emit("closeSocket");
              this.$router.push({
                path: "/login",
                query: {
                  infor: url,
                },
              });
              //this.$router.push({ name: 'login' })
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    },
    back() {
      this.$router.push({ path: "/SecondaryPage" });
    },
  },
};
</script>
<style lang="less" scoped>
// .site-navbar{
//防止加入element css后nav高度崩塌
.site-navbar__header {
  width: 173px;
}
.site-navbar__body.clearfix {
  ul:first-child li {
    height: 50px;
    display: flex;
    align-items: center;
  }
  ul:last-child {
    li:first-child {
      height: 51px;
      margin-top: -1px;
    }
    li:last-child {
      height: 50px;
      line-height: 50px;
      display: flex;
      align-items: center;
    }
  }
  .message-more {
    position: relative;
    display: inline-block;
    margin-right: 10px;

    outline: none;
    .span_point {
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      right: -10px;
      top: -8px;
      border-radius: 50%;
      position: absolute;
      background-color: #0bd295;
      color: #fefefe;
      font-size: 10px;
      font-weight: 400;
      text-align: center;
    }

    .message-more__content {
      position: absolute;
      top: 38px;
      // right: -150px;
      right: -65px;
      width: 700px;
      z-index: 1;
      transform: scaleY(0);
      transform-origin: center top;
      transition: transform 0.5s;
      background: #ffffff;
      box-shadow: 0px 3px 11px 0px rgba(0, 0, 0, 0.1);
      border-radius: 4px 0px 4px 4px;
      padding: 5px 0;

      .content_title {
        color: #333333;
        padding: 5px 0px 10px 10px;
        font-size: 20px;
        font-weight: 700;
        display: flex;
        position: relative;
        .message__close {
          position: absolute;
          width: 15px;
          height: 15px;
          background: no-repeat url("../sinvieUI/img/dialog/close.svg")
            center/100% 100%;
          top: 12px;
          right: 5px;
          cursor: pointer;
          &:hover {
            background-image: url("../sinvieUI/img/dialog/close_hover.svg");
          }
        }
      }
      .table_content {
        &::-webkit-scrollbar {
          background: transparent;
          width: 5px;
        }
        &::-webkit-scrollbar-thumb {
          background: #d5d5d5;
          border-radius: 5px;
        }
        .table_title {
          padding: 10px;
          font-size: 17px;
          font-weight: 400;
          color: #333333;
          background: #f0f6ff;
          display: flex;
          justify-content: space-between;
        }
        .everyRow {
          display: flex;
          justify-content: space-around;
          flex-direction: row;
          padding: 5px 0px;
          .td_normal {
            color: #999999;
            font-weight: 300;
            .td_user {
              display: inline-block;
              color: #555555;
              width: 100px;
            }
            .td_time {
              display: inline-block;
              color: #555555;
              width: 150px;
            }
            .td_times {
              display: inline-block;
              color: #555555;
              width: 70px;
            }
          }
        }
      }
    }

    &.message-more__unfocus:hover {
      //border-color:red
    }
    &.message-more__focus {
      //border-color: #0091ff;

      .message-more__content {
        z-index: 100;
        transform: scaleY(1);
      }
    }
  }
}
.site-navbar__title {
  display: inline-block;
  height: 50px;
  line-height: 50px;
  position: absolute;
  left: 45px;
  font-weight: bold;
  font-size: 18px;
  color: rgba(255, 255, 255, 1);
}
.site-navbar__body {
  margin-left: 173px;
  position: relative;
  border-bottom: 1px double #dcdfe6;
  background: #3595f3;
}
.site-navbar__brand {
  width: 173px;
  background: #3595f3;
  .site-navbar__brand-lg {
    display: flex;
    // justify-content: center;
    align-items: center;
    margin-left: 8px;
  }
  .site-navbar__brand-lg:focus,
  .site-navbar__brand-lg:hover {
    color: transparent;
    background: transparent;
    opacity: 1;
  }
}

.clearfix /deep/ .site-navbar__menu.el-menu--horizontal.el-menu {
  background: transparent !important;
}
.clearfix /deep/ .el-menu--horizontal > .el-menu-item {
  color: #b3c4f7 !important;
}
.clearfix /deep/ .el-menu--horizontal > .el-menu-item.is-active {
  color: #b3c4f7 !important;
}
.clearfix /deep/ .el-dropdown-menu__item--divided:before,
.el-menu,
.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  background: transparent !important;
}
.clearfix /deep/ .icon-svg {
  width: 17px;
  height: 17px;
}
.clearfix /deep/ .el-menu-item {
  padding: 0 5px 0 12px;
}
.clearfix /deep/ .el-dropdown {
  color: #fff;
}
.bestBigWrap /deep/ .el-tabs__item {
  padding: 0 20px;
}

.el-menu.el-menu--horizontal {
  border: none;
}

.el-popover.el-popper {
  top: 38px !important;
}
</style>

<style>
.main-navbar__confirm__cancel {
  height: 36px;
  border-radius: 4px;
}
</style>
