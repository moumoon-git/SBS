/** * @author tanjinfeng * @date 2020-10-23 * @desc 社会治理欢迎页-新 */

<template>
  <div class="welcome">
    <header ref="header_wrapper">
      <div ref="header_text">{{ title }}</div>
    </header>
    <div class="welcome__card">
      <div
        class="welcome__card__item"
        :class="{
          'welcome__card__item-garbage-classification':
            cardItem.name == '垃圾分类',
          'welcome__card__item-market-management':
            cardItem.name == '专业市场管理',
          'welcome__card__item-epidemic-situation-control':
            cardItem.name == '疫情防控',
          'welcome__card__item-emergency-management':
            cardItem.name == '基层应急管理',
          'welcome__card__item-member-management': cardItem.name == '人员管控',
          'welcome__card__item-car-management': cardItem.name == '车辆管控',
          'welcome__card__item-command-link': cardItem.name == '指挥联动',
          'welcome__card__item-operation-forbidden':
            cardItem.name == '令行禁止',
        }"
        v-for="(cardItem, cardIndex) in cardList"
        :key="`welcome_card_item_${cardIndex}`"
        @click="jumpTo(cardItem)"
      >
        <div>{{ cardItem.name }}</div>
      </div>
    </div>
    <div class="welcome__dock">
      <div
        class="welcome__dock__item"
        v-for="(dockItem, dockIndex) in dockList"
        :key="`welcome_dock_item_${dockIndex}`"
        :ref="`welcome_dock_item_${dockIndex}`"
        @click="jumpTo(dockItem)"
        @mouseover="iconNearbyTransform(dockIndex, 'over')"
        @mouseleave="iconNearbyTransform(dockIndex, 'leave')"
      >
        <img :src="switchDockItemImg(dockItem.name)" alt="图标" />
        <div>{{ dockItem.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie';

export default {
  name: 'Welcome',
  props: {
    title: {
      type: String,
      default: '社会智慧治理综合指挥中心',
    },
  },
  data() {
    return {
      // 上方菜单数据列表
      cardList: ['', '', '', '', '', '', '', ''],
      // 下方菜单数据列表
      dockList: [],
    };
  },
  methods: {
    /**
     * @method
     * @desc 调整header的font-size，保证不换行
     */
    adjustHeader() {
      let fontSize = 78;
      if (this.$refs.header_wrapper && this.$refs.header_text) {
        this.$refs.header_text.style.fontSize = `${--fontSize}px`;
        this.$nextTick((_) => {
          while (
            this.$refs.header_wrapper.offsetHeight <
            this.$refs.header_text.offsetHeight
          ) {
            this.$refs.header_text.style.fontSize = `${--fontSize}px`;
          }
        });
      }
    },
    /**
     * @method
     * @desc 获取菜单列表
     */
    getMenu() {
      this.$http
        .get(`${window.SITE_CONFIG.baseUrl}/sys/menu/nav`)
        .then((res) => {
          if (res.data.code == 0) {
            const menuList = res.data.menuList;
            menuList.forEach((element) => {
              switch (element.name) {
                case '垃圾分类':
                  this.cardList[4] = element;
                  break;
                case '专业市场管理':
                  this.cardList[5] = element;
                  break;
                case '人员管控':
                  this.cardList[0] = element;
                  break;
                case '车辆管控':
                  this.cardList[1] = element;
                  break;
                case '基层应急管理':
                  this.cardList[6] = element;
                  break;
                case '指挥联动':
                  this.cardList[3] = element;
                  break;
                case '令行禁止':
                  this.cardList[2] = element;
                  break;
                case '疫情防控':
                  this.cardList[7] = element;
                  break;
                case '视频巡查':
                  this.dockList.push(element);
                  break;
                case '智能发现':
                  this.dockList.push(element);
                  break;
                case '风险排查':
                  this.dockList.push(element);
                  break;
                case '应用链接':
                  this.dockList.push(element);
                  break;
                case '群防共治':
                  this.dockList.push(element);
                  break;
                case '队伍管理':
                  this.dockList.push(element);
                  break;
                case '日常管理':
                  this.dockList.push(element);
                  break;
                case '数据可视':
                  this.dockList.push(element);
                  break;
              }
            });
            console.log(this.cardList);
          }
        });
    },
    /**
     * @method
     * @desc 根据dock item的名字返回图标的url
     * @param {String} name dock item的名字
     * @return {String}
     */
    switchDockItemImg(name) {
      switch (name) {
        case '视频巡查':
          return require('../../assets/img/welcome/video-inspect.svg');
          break;
        case '智能发现':
          return require('../../assets/img/welcome/intelligence-discover.svg');
          break;
        case '风险排查':
          return require('../../assets/img/welcome/risk-check.svg');
          break;
        case '应用链接':
          return require('../../assets/img/welcome/application-link.svg');
          break;
        case '群防共治':
          return require('../../assets/img/welcome/group-govern.svg');
          break;
        case '队伍管理':
          return require('../../assets/img/welcome/team-management.svg');
          break;
        case '日常管理':
          return require('../../assets/img/welcome/daily-management.svg');
          break;
        case '数据可视':
          return require('../../assets/img/welcome/data-visualization.svg');
          break;
      }
    },
    /**
     * @method
     * @desc 跳转页面
     * @param {Object} data 菜单项目数据
     */
    jumpTo(data) {
      if (data.name == '数据可视') {
        const Base64 = require('js-base64').Base64;
        const url = `token=${Cookies.get('token')}&platformId=${Cookies.get(
          'platformId',
        )}&type=visual&allLoad=''`;
        window.open(
          `${window.SITE_CONFIG.baseUrl.slice(
            0,
            -4,
          )}/visualizion/index.html?${Base64.encode(encodeURIComponent(url))}`,
        );
        sessionStorage.open = Base64.encode(encodeURIComponent(url));
        return;
      }
      if (data.url) {
        this.$router.push({
          path: `${data.url[0] == '/' ? '' : '/'}${data.url}`,
        });
      } else {
        if (data.list && data.list[0] && data.list[0].url) {
          this.$router.push({
            path: `${data.list[0].url[0] == '/' ? '' : '/'}${data.list[0].url}`,
          });
        } else {
          this.jumpTo(data.list[0]);
        }
      }
    },
    /**
     * @method
     * @desc 鼠标hover时，前后图标图片放大1.2倍
     * @param {Number} dockIndex 图标下标
     * @param {String} flag 鼠标移入或移出：over or leave
     */
    iconNearbyTransform(dockIndex, flag) {
      if (flag === 'over') {
        if (
          this.$refs[`welcome_dock_item_${dockIndex - 1}`] &&
          this.$refs[`welcome_dock_item_${dockIndex - 1}`][0]
        ) {
          this.$refs[`welcome_dock_item_${dockIndex - 1}`][0].classList.add(
            'welcome__dock__item__nearby',
          );
        }
        if (
          this.$refs[`welcome_dock_item_${dockIndex + 1}`] &&
          this.$refs[`welcome_dock_item_${dockIndex + 1}`][0]
        ) {
          this.$refs[`welcome_dock_item_${dockIndex + 1}`][0].classList.add(
            'welcome__dock__item__nearby',
          );
        }
      } else {
        if (
          this.$refs[`welcome_dock_item_${dockIndex - 1}`] &&
          this.$refs[`welcome_dock_item_${dockIndex - 1}`][0]
        ) {
          this.$refs[`welcome_dock_item_${dockIndex - 1}`][0].classList.remove(
            'welcome__dock__item__nearby',
          );
        }
        if (
          this.$refs[`welcome_dock_item_${dockIndex + 1}`] &&
          this.$refs[`welcome_dock_item_${dockIndex + 1}`][0]
        ) {
          this.$refs[`welcome_dock_item_${dockIndex + 1}`][0].classList.remove(
            'welcome__dock__item__nearby',
          );
        }
      }
    },
  },
  mounted() {
    this.adjustHeader();
    this.getMenu();
    window.addEventListener('resize', this.adjustHeader, false);
  },
  watch: {
    title(val) {
      this.adjustHeader();
    },
  },
};
</script>

<style scoped lang="scss">
@keyframes zoom-in-out {
  0% {
    background-size: 100% 100%;
  }
  50% {
    background-size: 120% 120%;
  }
  100% {
    background-size: 100% 100%;
  }
}
.welcome {
  background: no-repeat center/100% 100%
    url('../../assets/img/welcome/background.jpg');
  animation: zoom-in-out 30s linear infinite;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 6vh 0 0;
  position: relative;
  // 触发硬件加速
  transform: translate3d(0, 0, 0);
  * {
    user-select: none;
    line-height: normal;
    font-family: 'Microsoft YaHei', PingFangSC-Regular, 'PingFang SC',
      Roboto-Regular, SourceHanSansCN-Regular;
  }
  header {
    width: 100%;
    height: 1em;
    font-size: 78px;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
    text-align: center;
  }
  &__card {
    display: flex;
    width: 80vw;
    flex-wrap: wrap;
    align-items: center;
    position: fixed;
    left: 50vw;
    top: 50vh;
    transform: translate(-50%, -55%);
    &__item {
      border-radius: 10px;
      width: calc(20vw - 30px);
      height: calc(14.2vw - 30px);
      flex-shrink: 0;
      margin: 15px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      // hover下沉，显示蓝线
      &:hover {
        top: 1px;
        transition: top 0.6s;
        // 顶部蓝线
        &::before {
          content: '';
          background: #0091ff;
          display: block;
          height: 6px;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      // 背景图
      background-repeat: no-repeat;
      background-size: 102% 102%;
      background-position: center;
      &.welcome__card__item-garbage-classification {
        background-image: url('../../assets/img/welcome/garbage-classification.svg');
      }
      &.welcome__card__item-market-management {
        background-image: url('../../assets/img/welcome/market-management.svg');
      }
      &.welcome__card__item-epidemic-situation-control {
        background-image: url('../../assets/img/welcome/epidemic-situation-control.svg');
      }
      &.welcome__card__item-emergency-management {
        background-image: url('../../assets/img/welcome/emergency-management.svg');
      }
      &.welcome__card__item-member-management {
        background-image: url('../../assets/img/welcome/member-management.svg');
      }
      &.welcome__card__item-car-management {
        background-image: url('../../assets/img/welcome/car-management.svg');
      }
      &.welcome__card__item-operation-forbidden {
        background-image: url('../../assets/img/welcome/operation-forbidden.svg');
      }
      &.welcome__card__item-command-link {
        background-image: url('../../assets/img/welcome/command-link.svg');
      }
      // 标题
      & > div {
        color: #333333;
        font-size: 2vw;
        font-weight: bold;
        margin: 1vw 0 0 1vw;
        position: relative;
        &::before {
          content: '';
          display: inline-block;
          width: 4vw;
          height: 100%;
          border-bottom: 0.25vw solid #0091ff;
          position: absolute;
          top: 0.5vw;
        }
      }
    }
  }
  &__dock {
    position: absolute;
    left: calc(10vw + 15px);
    bottom: 0;
    width: calc(80vw - 30px);
    height: 15vh;
    background: url('../../assets/img/welcome/dock.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: space-around;
    align-items: flex-end;
    &__item {
      cursor: pointer;
      flex-shrink: 1;
      display: inline-block;
      text-align: center;
      position: relative;
      margin-bottom: 2vh;
      // 图标
      & > img {
        width: 8vh;
        height: 8vh;
        position: absolute;
        left: 0;
        bottom: 3vh;
        transform-origin: center bottom;
        transition: transform 0.3s;
      }
      // 标题
      & > div {
        color: #ffffff;
        font-size: 2vh;
        font-weight: bold;
        text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
      }
      // 鼠标经过图标放大
      &:hover > img {
        transform: scale(1.5);
      }
      &__nearby > img {
        transform: scale(1.1);
      }
    }
  }
}
</style>
