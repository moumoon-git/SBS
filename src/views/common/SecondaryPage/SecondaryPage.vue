<template>
  <div
    :class="$style.container"
    :style="{
      '--background-image': platformBackgroundImage,
    }"
  >
    <div
      style="width: 118px;
        height: 32px;
        border-radius: 16px;
        border: 1px solid #FFFFFF;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        right: 30px;
        top: 30px;
        cursor: pointer;"
      @click="quit"
    >
      <img src="./styles/quit.svg" style="width: 18px;height: 16px;">
      退出登录
    </div>
    <h1
      :class="$style.title"
      v-text="title"
    />
    <ul :class="$style.menus">
      <li
        v-for="menu in menus.slice(0, 8)"
        :key="menu.menuId"
        @click="redirectToPage(menu)"
      >
        <h2>{{ menu.name }}</h2>
        <div
          :style="{
            '--icon-img': `url('${menu.backgroundImage}')`,
          }"
        />
      </li>
    </ul>
    <ul
      v-if="shortcuts && shortcuts.length"
      :class="$style.shortcuts"
    >
      <li
        v-for="(shortcut, shorcutIndex) in shortcuts"
        :key="shortcut.name"
        @click="redirectToPage(shortcut)"
        @mouseover="hoverShortcutIndex = shorcutIndex;"
        @mouseleave="hoverShortcutIndex = -10;"
      >
        <div
          :class="{
            [$style.iconBig]:
              (hoverShortcutIndex === shorcutIndex + 1)
              || (hoverShortcutIndex === shorcutIndex - 1)
          }"
          :style="{
            '--icon-img': `url('${shortcut.backgroundImage}')`,
          }"
        />
        <h3>{{ shortcut.name }}</h3>
      </li>
    </ul>
    <licence-dialog
      @timeDiff="timeDiff"
      ref="licenceDialog"
    />
  </div>
</template>

<script>
import { clearLoginInfo } from '@/utils';
import bus from '../../common/js/eventBus';
  import licenceDialog from '@/views/common/SecondaryPage/licenceDialog.vue';
export default {
  name: 'SecondaryPage',
  components: {
    licenceDialog,
  },
  data() {
    return {
      menus: [],
      shortcuts: [],
      hoverShortcutIndex: -10,
      backgroundImage: sessionStorage.getItem('platformBackgroundImage'),
    };
  },
  
  computed: {
    title() {
      return this.$store.state.user.platformTitle || this.$cookie.get('platformTitle') || '欣纬智慧一体化应急指挥中枢';
    },
    platformBackgroundImage() {
      if (this.backgroundImage) {
        if (this.backgroundImage.startsWith('http')) {
          return `url('${this.backgroundImage}')`;
        }
        return `url('${window.SITE_CONFIG.cloudUrl}${this.backgroundImage}')`;
      }
      return '';
    },
  },
  created() {
    // 获取licence有效时间
    // this.getExpireTime();
    // this.timeDiff('2021年11月10日')
    this.$http.get(`${window.SITE_CONFIG.baseUrl}/sys/menu/nav`)
      .then((response) => {
        if (response.data.code === 0 || response.data.errorcode) {
          // 刷新动态路由，防止上一次登录的账号的动态路由遗留
          this.$router.options.isAddDynamicMenuRoutes = false;
          this.menus = response.data.homePageMenu || [];
          this.shortcuts = response.data.fastMenu || [];
        } else {
          this.$message.error(`无法获取菜单列表，错误代码${
            response.data.code || response.data.errorcode
          }，错误信息：${
            response.msg || response.message
          }`);
        }
      }).catch((error) => {
        this.$message.error(`无法获取菜单列表，错误信息：${error}`);
      });
  },
  methods: {
    quit() {
      this.$confirm('确定进行[退出]操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$http({
            baseURL: window.SITE_CONFIG.cloudUrl,
            url: '/oauth/logout',
            method: 'post',
            headers: {
              token: this.$cookie.get('token'),
            },
          }).then(({ data }) => {
            if (data && data.code === 0) {
              const url = this.$store.state.user.hopRoutingInfo;
              clearLoginInfo();
              bus.$emit('closeSocket');
              this.$router.push({
                path: '/login',
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
    redirectToPage(menu) {
      // 有路径直接跳转
      if (menu.url) {
        // 3.0 指挥的页面，在新窗口打开
        if (window.SITE_CONFIG['3.0'].includes(menu.url)) {
          window.location = menu.url;
          return;
        }
        this.$router.push({ path: menu.url });
        return;
      }
      // 无路径或目录项，递归找出第一个有效的子孙菜单路径
      if (Array.isArray(menu.list) && menu.list.length) {
        let url;
        const findFirstValidItem = (list) => {
          for (let i = 0; i < list.length; i += 1) {
            if (list[i].url) {
              url = list[i].url;
              return;
            }
            if (Array.isArray(list[i].list) && list[i].list.length) {
              findFirstValidItem(list[i].list);
              if (url) return;
            }
          }
        };
        findFirstValidItem(menu.list);
        if (url) {
          // 3.0 指挥的页面，在新窗口打开
          if (window.SITE_CONFIG['3.0'].includes(url)) {
            window.location = url;
            return;
          }
          this.$router.push({ path: url });
          return;
        }
      }
      // 找不到有效路径，跳转home
      this.$router.push({ path: '/' });
    },
    // 获取服务证书licence过期时间
    getExpireTime() {
      this.$http.post(`${window.SITE_CONFIG.cloudUrl}/oauth/ignorelicense/getExpireTime`)
      .then((result) => {
        if (result.data.errorcode === 0) {
          console.log(result.data.data);
          this.timeDiff(result.data.data);
        } else {
          this.$message.error(response.msg);
        }
      }).catch((error) => {
        this.$message.error(error);
      });
    },
    // 计算时间差
    timeDiff(resDate) {
      // let resDate = '2021年11月19日'
      // 转换为YYYY-MM-DD
      let resDate2 = resDate.replace('年', '-');
      resDate2 = resDate2.replace('月', '-');
      resDate2 = resDate2.replace('日', ' 24:00:00');// 添加秒数精确判断

      let todayDate = new Date().getTime(); // 现在时间
      let validDate = new Date(resDate2).getTime(); // 结束时间

      // 结束时间 - 现在时间 > 0 则没过期
      let nowDiff = validDate - todayDate
      let diffDate = ''
      console.log(resDate2, todayDate, validDate, nowDiff) 
      // 未过期
      if (nowDiff >= 0) {
        diffDate = Math.floor(nowDiff / 1000 / 60 / 60 / 24); // 剩余天数
        console.log(diffDate)
        // 还有30天过期时 弹出提示框
        if (diffDate <= 30) {
          this.$nextTick(() => {
            let licenceDate = JSON.stringify([false, resDate, diffDate]);
            sessionStorage.setItem('licenceDate', licenceDate); // 存储过期时间
            this.$refs.licenceDialog.initInfo(false, resDate, diffDate);
          });
        } else {
          sessionStorage.setItem('licenceDate', JSON.stringify(['normal', '', '']));
        }
      } else {
        diffDate = Math.floor(Math.abs(nowDiff) / 1000 / 60 / 60 / 24); // 过期天数
        console.log(diffDate)
        this.$nextTick(() => {
          let licenceDate = JSON.stringify([true, resDate, diffDate]);
          sessionStorage.setItem('licenceDate', licenceDate);
          this.$refs.licenceDialog.initInfo(true, resDate, diffDate);
        });
      }
    },
  },
};
</script>

<style lang="scss" module src="./styles/SecondaryPage.scss" />
