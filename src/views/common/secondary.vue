<template style="overflow: hidden">
  <div>
    <Welcome v-if="isNewWelcome" :title="platformTitle" />
    <div
      v-else
      class="secondary"
      :style="{
        background: 'url(' + (backgroundImage ? backgroundImage : bgc) + ')',
      }"
    >
      <el-menu
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal"
        style="margin-top: 1px; background-color: initial !important"
      >
        <!-- <el-menu-item index="1" @click="$router.push({ name: 'theme' })">
            <template slot="title">
              <el-badge value="new">
                <icon-svg name="shezhi" class="el-icon-setting"></icon-svg>
              </el-badge>
            </template>
        </el-menu-item>-->

        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span
              class="el-dropdown-link"
              style="font-size: 18px; color: black"
            >
              <img src="../../assets/img/portrait.png" :alt="userName" />
              {{ userName }}
            </span>
            <el-dropdown-menu
              slot="dropdown"
              style="background-color: none !important"
            >
              <el-dropdown-item @click.native="updatePasswordHandle()"
                >修改密码</el-dropdown-item
              >
              <el-dropdown-item @click.native="logoutHandle()"
                >退出</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>

      <header :style="{color:titleColor}" ref="header_wrapper">
        <span ref="header_inner">{{platformTitle?platformTitle:"3.0一体化指挥中台"}}</span>
      </header>

      <div class="contair" :class="{ play: isActive }">
        <!-- <div class="date">
          <div class="left">
            <span class="hours">{{hours}}</span>
            <i>:</i>
            <span class="minutes">{{minutes}}</span>
            <i>:</i>
            <span class="seconds">{{seconds}}</span>
          </div>
          <div class="right">
            <p class="week">{{day}}</p>
            <p class="time">{{date}}</p>
          </div>
        </div>-->

        <div class="mangerList">
          <ul>
            <li
              v-for="(item, index) in menuList"
              :key="index"
              @click="toHome(index)"
            >
              <div>
                <img :src="item.imgUrl" />
                <!-- <img v-else :src="item.imgUrl" /> -->
                <p v-if="item.customMenuName != null">
                  {{ item.customMenuName }}
                </p>
                <p v-else>{{ item.name }}</p>
              </div>
            </li>
            <!-- <li  v-for="(item,index) in menuList" :key="index" @click="toHome(index)">
              <img :src="imgUrl" />
              <p >{{item.name}}</p>
            </li>-->
          </ul>
        </div>
      </div>
      <!-- 弹窗, 修改密码 -->
      <update-password
        v-if="updatePassowrdVisible"
        ref="updatePassowrd"
      ></update-password>
    </div>
  </div>
</template>

<script>
import { clearLoginInfo } from "@/utils";
import bus from "./js/eventBus";
import UpdatePassword from "../main-navbar-update-password.vue";
import Cookies from "js-cookie";
// 新欢迎页
import Welcome from "./Welcome";
export default {
  data() {
    return {
      day: "",
      hours: "",
      minutes: "",
      seconds: "",
      date: "",
      isActive: false,
      timeInterval: "",
      menuList: [],
      data: "",
      updatePassowrdVisible: false,
      imgUrl: require(`../../assets/img/0.png`),
      bgc: require(`../../assets/img/bj2.png`), //背景图
      baseUrl: window.SITE_CONFIG["cloudUrl"],
      // 是否使用新的欢迎页
      isNewWelcome: false,
    };
  },
  components: {
    UpdatePassword,
    Welcome,
  },
  created() {
    this.useNewWelcomeOrNot();

    setTimeout(() => {
      this.isActive = true;
      this.startTime();
    }, 4000);

    this.$http({
      url: this.$http.adornUrl("/sys/menu/nav"),
      method: "get",
      params: this.$http.adornParams(),
    })
      .then(({ data }) => {
        // console.log("/sys/menu/nav",data);
        if (data && data.code === 0) {
          sessionStorage.setItem(
            "menuList",
            JSON.stringify(data.menuList || "[]")
          );
          if (JSON.parse(sessionStorage.getItem("menuList")).length > 8) {
            this.data = JSON.parse(sessionStorage.getItem("menuList")).slice(
              0,
              8
            );
          } else {
            this.data = JSON.parse(sessionStorage.getItem("menuList"));
          }
          this.data.map((v, index) => {
            // if(v.backgroundImageFlag === 1 ){
            this.getDate(v, index);
            // }
          });
        } else {
          this.$message.error(data.msg);
        }
      })
      .catch((e) => {
        console.log(
          `%c${e} 请求菜单列表和权限失败，跳转至登录页！！`,
          "color:blue"
        );
        router.push({ name: "login" });
      });

    this.getUserInfo();
  },
  beforeDestroy() {
    clearInterval(this.timeInterval);
  },
  computed: {
    sidebarFold: {
      get() {
        return this.$store.state.common.sidebarFold;
      },
    },
    userName: {
      get() {
        return this.$store.state.user.name;
      },
      set(val) {
        this.$store.commit("user/updateName", val);
      },
    },
    platformTitle: {
      get() {
        return this.$store.state.user.platformTitle;
      },
      set(val) {
        this.$store.commit("user/updatePlatformTitle", val);
      },
    },
    backgroundImage: {
      get() {
        return this.$store.state.user.backgroundImage;
      },
      set(val) {
        this.$store.commit("user/updateBackgroundImage", val);
      },
    },
    animationFlag: {
      get() {
        return this.$store.state.user.animationFlag;
      },
      set(val) {
        this.$store.commit("user/updateAnimationFlag", val);
      },
    },
    titleColor: {
      get() {
        return this.$store.state.user.titleColor;
      },
      set(val) {
        this.$store.commit("user/updateTitleColor", val);
      },
    },
    hopRoutingInfo: {
      get() {
        return this.$store.state.user.hopRoutingInfo;
      },
      set(val) {
        this.$store.commit("user/updateHopRoutingInfo", val);
      },
    },
  },
  methods: {
    // 获取用户信息
    getUserInfo() {
      setTimeout(() => {
        this.$http({
          url: this.$http.adornUrl("/sys/user/info"),
          method: "get",
          params: this.$http.adornParams(),
        }).then(({ data }) => {
          // console.log("用户信息和平台信息",data)

          if (data && data.code === 0) {
            this.userName = data.user.username;
            this.platformTitle = data.platform.platformTitle;
            this.backgroundImage = data.platform.backgroundImage;
            this.animationFlag = data.platform.animationFlag;
            this.titleColor = data.platform.titleColor;
            // this.$store.commit('common/updatePlatformInfo', data.townInfo)
            localStorage.setItem("platformInfo", JSON.stringify(data.townInfo));
            this.autoAdjustHeaderFontSize();
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    startTime() {
      this.timeInterval = setInterval(() => {
        var arr = [
          "星期日",
          "星期一",
          "星期二",
          "星期三",
          "星期四",
          "星期五",
          "星期六",
        ];
        var nowYear = new Date().getFullYear().toString();
        var nowMonth = (new Date().getMonth() + 1).toString();
        var nowDay = new Date().getDate().toString();
        var nowHours = new Date().getHours().toString(); //获取当前小时数(0-23)
        var nowMin = new Date().getMinutes().toString(); //获取当前分钟数(0-59)
        var nowSeconds = new Date().getSeconds().toString(); //获取当前秒数(0-59)
        function timeAdd0(str) {
          if (str.length <= 1) {
            str = "0" + str;
          }
          return str;
        }
        nowYear = timeAdd0(nowYear);
        nowMonth = timeAdd0(nowMonth);
        nowDay = timeAdd0(nowDay);
        nowHours = timeAdd0(nowHours);
        nowMin = timeAdd0(nowMin);
        nowSeconds = timeAdd0(nowSeconds);

        this.hours = nowHours;
        this.minutes = nowMin;
        this.seconds = nowSeconds;
        this.day = arr[new Date().getDay()];
        this.date = nowSeconds + "/" + nowMonth + "/" + nowDay;
      }, 1000);
    },
    toHome(idx) {
      if(this.menuList[idx].name=='数据可视'){
        this.$router.push({ path: 'map/visual' })
        let str = `token=${Cookies.get('token')}&platformId=${Cookies.get('platformId')}&type=visual&allLoad=''`
        window.open( `${window.SITE_CONFIG['baseUrl'].slice(0,-4)}/visualizion/index.html?${Base64.encode(encodeURIComponent(str))}`)
        sessionStorage.open = Base64.encode(encodeURIComponent(str))
      } else if (window.SITE_CONFIG['3.0'].includes(this.menuList[idx].url)) {
        window.open(this.menuList[idx].url);
      } else {
        this.$router.push({
          path: this.menuList[idx].url,
        });
      }

      clearInterval(this.timeInterval);
    },

    getDate(object, idx) {
      console.log(idx);
      if (
        object.list != null &&
        object.list != "" &&
        object.backgroundImageFlag === 1
      ) {
        this.getDate(object.list[0], idx);
      } else {
        /**
         * @author tanjinfeng
         * @date 2020-11-23
         * @description debug: 背景图片处理，后台数据有则用后台数据
         */
        // *** 新增的代码 ***
        let imgUrl = require("../../assets/img/" + idx + ".png");
        if (this.data[idx].backgroundImage) {
          if (this.data[idx].backgroundImage.includes("http")) {
            imgUrl = this.data[idx].backgroundImage;
          } else {
            imgUrl =
              window.SITE_CONFIG.cloudUrl + this.data[idx].backgroundImage;
          }
        }
        // *** 结束 ***
        const url = object.url || (object.list && object.list[0] && object.list[0].url) || '/home';
        this.menuList.push({
          name: (this.data[idx].customMenuName != null)?this.data[idx].customMenuName:this.data[idx].name,
          // url: object.url ? object.url : "/home",
          url,
          // imgUrl: require('../../assets/img/'+idx+'.png')
          // imgUrl: this.data[idx].backgroundImage?baseUrl+this.data[idx].backgroundImage:require('../../assets/img/'+idx+'.png')
          imgUrl,
        });
      }
    },
    // getUrl(object,index,idx){
    //   if(object.list != null && object.list != "") {
    //     this.getUrl(object.list[index],idx)
    //   }else{
    //     this.menuList.push({'name':this.data[idx].name,'url':object.url?object.url:'/home','imgUrl':require(`../../assets/img/${idx}.png`)})
    //   }
    // },
    // 修改密码
    updatePasswordHandle() {
      this.updatePassowrdVisible = true;
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init();
      });
    },
    // 退出
    logoutHandle() {
      this.$confirm(`确定进行[退出]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
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
              //this.$router.push({ name: "login" });
              this.$router.push({
                path: "/login",
                query: {
                  infor: url,
                },
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        })
        .catch(() => {});
    },
    /**
     * @method
     * @author tanjinfeng
     * @date 2020-10-23
     * @desc 根据标题字数，自动修正字体字号
     */
    autoAdjustHeaderFontSize() {
      if (!this.isNewWelcome) {
        let fontSize = 90;
        this.$nextTick((_) => {
          while (
            this.$refs.header_wrapper.offsetHeight <=
            this.$refs.header_inner.offsetHeight
          ) {
            this.$refs.header_inner.style.fontSize = `${--fontSize}px`;
          }
        });
      }
    },
    /**
     * @method
     * @author tanjinfeng
     * @date 2020-10-23
     * @desc 判断是否使用新欢迎页
     */
    useNewWelcomeOrNot() {
      this.$http
        .get(`${window.SITE_CONFIG.baseUrl}/sys/config/infoByKey?key=SHXM`)
        .then((res) => {
          if (
            res.data.code == 0 &&
            res.data.config &&
            res.data.config.paramKey &&
            res.data.config.paramKey.length &&
            res.data.config.paramKey.length > 0
          ) {
            this.isNewWelcome = true;
            this.$forceUpdate();
          }
        });
    },
  },
  mounted() {
    this.autoAdjustHeaderFontSize();
  },
  watch: {
    platformTitle(val) {
      this.autoAdjustHeaderFontSize();
    },
  },
};
</script>
<style lang="scss" scoped>
a {
  text-decoration: none;
}
i {
  font-style: normal;
}

@keyframes myScale {
  0% {
    top: 42.5%;
    font-size: 75px;
    font-weight: 0;
  }

  50% {
    top: 42.5%;
    font-size: 75px;
    font-weight: 0;
  }
  51% {
    top: 42.5%;
    font-size: 75px;
  }
  100% {
    // background-image: url('../../assets/img/组 25.png');
    top: 7.5%;
    font-size: 75px;
    position: absolute;
  }
}
@keyframes myOpacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

* {
  margin: 0;
  padding: 0;
}
.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  background-color: transparent !important;
}
.el-menu-item {
  padding: 0 20px !important;
}
/deep/ .el-dropdown-menu {
  background-color: none !important;
  border: none !important;
}
.secondary {
  width: 100%;
  height: 100vh;
  min-width: 1200px;
  background-size: 100% 100vh !important;
  color: #ddd;
  overflow: hidden;
  /deep/ .el-dropdown-menu {
    background-color: none;
    border: 1px solid #ddd;
  }
  header {
    width: 100%;
    height: 15%;
    position: absolute;
    top: 42.5%;
    left: 0;
    font-size: 90px;
    color: rgba(0, 0, 0, 0.7);
    // background-image: url('../../assets/img/组 25.png');

    // font-weight: bold;
    // background-image: -webkit-linear-gradient(bottom, #00b3ff, #bfe5f8);
    // -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
    letter-spacing: 0.5vw;
    text-align: center;
    animation: myScale 4s;
    animation-fill-mode: forwards;
    line-height: 15vh;
    font-weight: bold;
    text-shadow: 0 8px 9px rgba(0, 0, 0, 0.4);
  }
  .play {
    animation: myOpacity 2s;
    opacity: 1 !important;
  }
  .contair {
    opacity: 0;
    width: 100%;
    height: 100%;
    // background: url(../../assets/img/kuang.png) no-repeat;
    background-size: 100% 100%;
    position: relative;
    .date {
      display: flex;
      justify-content: flex-end;
      position: absolute;
      top: 10.7vh;
      right: 1vw;
      .left {
        font-size: 1.1vw;
        color: #fffffd;
        margin-right: 0.3vw;
        span {
          display: inline-block;
          width: 1.5vw;
          height: 4vh;
          text-align: center;
          line-height: 4vh;
          background-color: #0f4782;
          vertical-align: middle;
          margin-right: 0.3vw;
        }
      }
      .right {
        font-size: 0.6vw;
        line-height: 2.1vh;
        background-color: #0f4782;
      }
    }
    .mangerList {
      width: 91.5vw;
      // overflow: hidden;
      margin: 26vh auto;
      li {
        float: left;
        margin: 1.5vh 1.4vw;
        width: 20vw;
        height: 30vh;
        list-style: none;
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.5);
        box-shadow: 0px 6px 14px 0px rgba(0, 0, 0, 0.4);
        border-radius: 4px;
        text-align: center;
        cursor: pointer;
        position: relative;
        div {
          position: absolute;
          top: calc(50% - 12.5vh);
          left: calc(50% - 5vw);

          img {
            width: 10vw;
            height: 20vh;
            margin-bottom: 1.5vh;
          }
          p {
            font-size: 1.5vw;
            font-weight: bold;
          }
        }
      }

      // .pubicP1 {
      //   position: absolute;
      //   width: 14.5vw;
      //   text-align: right;
      // }
      // .pubicP2 {
      //   position: absolute;
      //   width: 10.5vw;
      //   text-align: center;
      // }
      // .pubicP3 {
      //   position: absolute;
      //   width: 14.5vw;
      //   text-align: left;
      // }
      // .list1 {
      //   p {
      //     top: 25.3vh;
      //     left: 11.1vw;
      //   }
      //   img {
      //     position: absolute;
      //     top: 31.6vh;
      //     left: 12.6vw;
      //   }
      // }
      // .list5 {
      //   p {
      //     position: absolute;
      //     bottom: 38.8vh;
      //     left: 10.6vw;
      //   }
      //   img {
      //     position: absolute;
      //     bottom: 18vh;
      //     left: 12vw;
      //   }
      // }
      // .list2 {
      //   p {
      //     top: 25.3vh;
      //     left: 33.3vw;
      //   }
      //   img {
      //     position: absolute;
      //     top: 31.6vh;
      //     left: 34.6vw;
      //   }
      // }
      // .list3 {
      //   p {
      //     top: 25.3vh;
      //     right: 33.3vw;
      //   }
      //   img {
      //     position: absolute;
      //     top: 31.6vh;
      //     right: 34vw;
      //   }
      // }
      // .list6 {
      //   p {
      //     bottom: 38.8vh;
      //     left: 33.3vw;
      //   }
      //   img {
      //     position: absolute;
      //     bottom: 18vh;
      //     left: 34.6vw;
      //   }
      // }
      // .list7 {
      //   p {
      //     bottom: 38.8vh;
      //     right: 33.3vw;
      //   }
      //   img {
      //     position: absolute;
      //     bottom: 18vh;
      //     right: 34.6vw;
      //   }
      // }
      // .list4 {
      //   p {
      //     top: 25.3vh;
      //     right: 11.1vw;
      //   }
      //   img {
      //     position: absolute;
      //     top: 31.6vh;
      //     right: 12.3vw;
      //   }
      // }
      // .list8 {
      //   p {
      //     bottom: 38.8vh;
      //     right: 11.1vw;
      //   }
      //   img {
      //     position: absolute;
      //     bottom: 18vh;
      //     right: 12.3vw;
      //   }
      // }
    }
  }
}
</style>
