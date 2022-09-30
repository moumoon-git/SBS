<template>
  <el-submenu
    v-if="menu.list && menu.list.length >= 1"
    :index="menu.menuId + ''"
    :popper-class="'site-sidebar--' + sidebarLayoutSkin + '-popper'">
    <template slot="title">
      <icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon"></icon-svg>
      <!--<span v-if="menu.name">{{ menu.name }}</span>-->
      <span v-if="menu.customMenuName != null">{{menu.customMenuName}}</span>
      <span v-else>{{menu.name}}</span>
    </template>
    <sub-menu
      v-for="item in menu.list"
      :key="item.menuId"
      :menu="item"
      :dynamicMenuRoutes="dynamicMenuRoutes">
    </sub-menu>
  </el-submenu>
  <el-menu-item v-else :index="menu.menuId + ''"  @click="gotoRouteHandle(menu)">
    <icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon"></icon-svg>
    <!--<span>{{ menu.name }}</span>-->
    <span v-if="menu.customMenuName != null">{{menu.customMenuName}}</span>
    <span v-else>{{menu.name}}</span>
  </el-menu-item>
</template>

<script>
  // import SubMenu from './main-sidebar-sub-menu'
  import Cookies from 'js-cookie'
  export default {
    name: 'sub-menu',
    data(){
      return {

      }
    },
    props: {
      menu: {
        type: Object,
        required: true
      },
      dynamicMenuRoutes: {
        type: Array,
        required: true
      }
    },
    components: {
      // SubMenu
    },
    computed: {
      sidebarLayoutSkin: {
        get () { return this.$store.state.common.sidebarLayoutSkin }
      }
    },
    methods: {
      // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
      gotoRouteHandle (menu) {
        let Base64 = require('js-base64').Base64
        console.log(menu)
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  // window.SITE_CONFIG['visual'] = `${window.SITE_CONFIG['baseUrl'].slice(0,-4)}/visualizion/index.html`
  if (menu.url === 'map/map') {
    // &allLoad= human  人/ car 车 / school 学校 / estate 小区
    let str = `token=${Cookies.get('token')}&platformId=${Cookies.get('platformId')}&type=map&allLoad=${JSON.parse(Base64.decode(sessionStorage.Diction)).join('/')}`
    console.log('document.cookie', document.cookie, str)
    // window.open(`${window.SITE_CONFIG['baseUrl'].slice(0,-4)}/visualizion/index.html?${Base64.encode(encodeURIComponent(str))}`)
    window.open( `${window.SITE_CONFIG['visual']}?${Base64.encode(encodeURIComponent(str))}`)
    sessionStorage.open = Base64.encode(encodeURIComponent(str))
  } else if (menu.url === 'map/duty') {
    let str1 = `token=${Cookies.get('token')}&platformId=${Cookies.get('platformId')}&type=duty&allLoad=''`
    console.log('值班态势', window.SITE_CONFIG['baseUrl'], str1)
    // window.open(`${window.SITE_CONFIG['baseUrl'].slice(0,-4)}/visualizion/index.html?${Base64.encode(encodeURIComponent(str1))}`)
    window.open( `${window.SITE_CONFIG['visual']}?${Base64.encode(encodeURIComponent(str1))}`)
    sessionStorage.open = Base64.encode(encodeURIComponent(str1))
  } else if (menu.url === 'map/conduct') {
    let str2 = `token=${Cookies.get('token')}&platformId=${Cookies.get('platformId')}&type=conduct&allLoad=''`
    console.log('指挥调度', str2)
    // window.open( `${window.SITE_CONFIG['baseUrl'].slice(0,-4)}/visualizion/index.html?${Base64.encode(encodeURIComponent(str2))}`)
    window.open( `${window.SITE_CONFIG['visual']}?${Base64.encode(encodeURIComponent(str2))}`)
    sessionStorage.open = Base64.encode(encodeURIComponent(str2))
  } else if (menu.url === 'map/NewGeneral') {
    let str2 = `token=${Cookies.get('token')}&platformId=${Cookies.get('platformId')}&type=NewGeneral&allLoad=''`
    console.log('新总体态势', str2)
    // window.open( `${window.SITE_CONFIG['baseUrl'].slice(0,-4)}/visualizion/index.html?${Base64.encode(encodeURIComponent(str2))}`)
    window.open( `${window.SITE_CONFIG['visual']}?${Base64.encode(encodeURIComponent(str2))}`)
    sessionStorage.open = Base64.encode(encodeURIComponent(str2))
  }else if (menu.url === 'map/NewGeneral') {
    let str2 = `token=${Cookies.get('token')}&platformId=${Cookies.get('platformId')}&type=NewGeneral&allLoad=''`
    console.log('新总体态势', str2)
    // window.open( `${window.SITE_CONFIG['baseUrl'].slice(0,-4)}/visualizion/index.html?${Base64.encode(encodeURIComponent(str2))}`)
    window.open( `${window.SITE_CONFIG['visual']}?${Base64.encode(encodeURIComponent(str2))}`)
    sessionStorage.open = Base64.encode(encodeURIComponent(str2))
  }else if (menu.url === 'map/Outbreak') {
    let str2 = `token=${Cookies.get('token')}&platformId=${Cookies.get('platformId')}&type=Outbreak&allLoad=''`
    console.log('疫情看板1', str2)
    // window.open( `${window.SITE_CONFIG['baseUrl'].slice(0,-4)}/visualizion/index.html?${Base64.encode(encodeURIComponent(str2))}`)
    window.open( `${window.SITE_CONFIG['visual']}?${Base64.encode(encodeURIComponent(str2))}`)
    sessionStorage.open = Base64.encode(encodeURIComponent(str2))
  }else if (menu.url === 'map/Outbreakt') {
    let str2 = `token=${Cookies.get('token')}&platformId=${Cookies.get('platformId')}&type=Outbreakt&allLoad=''`
    console.log('疫情看板2', str2)
    // window.open( `${window.SITE_CONFIG['baseUrl'].slice(0,-4)}/visualizion/index.html?${Base64.encode(encodeURIComponent(str2))}`)
    window.open( `${window.SITE_CONFIG['visual']}?${Base64.encode(encodeURIComponent(str2))}`)
    sessionStorage.open = Base64.encode(encodeURIComponent(str2))
  }else if (menu.url === 'map/Outbreaks') {
    let str2 = `token=${Cookies.get('token')}&platformId=${Cookies.get('platformId')}&type=Outbreaks&allLoad=''`
    console.log('防控情况', str2)
    // window.open( `${window.SITE_CONFIG['baseUrl'].slice(0,-4)}/visualizion/index.html?${Base64.encode(encodeURIComponent(str2))}`)
    window.open( `${window.SITE_CONFIG['visual']}?${Base64.encode(encodeURIComponent(str2))}`)
    sessionStorage.open = Base64.encode(encodeURIComponent(str2))
  }else if (menu.url === 'map/barGraph') {
    let str2 = `token=${Cookies.get('token')}&platformId=${Cookies.get('platformId')}&type=barGraph&allLoad=''`
    console.log('防控情况', str2)
    // window.open( `${window.SITE_CONFIG['baseUrl'].slice(0,-4)}/visualizion/index.html?${Base64.encode(encodeURIComponent(str2))}`)
    window.open( `${window.SITE_CONFIG['visual']}?${Base64.encode(encodeURIComponent(str2))}`)
    sessionStorage.open = Base64.encode(encodeURIComponent(str2))
  }else if (menu.url === 'map/visual') {
    let str2 = `token=${Cookies.get('token')}&platformId=${Cookies.get('platformId')}&type=visual&allLoad=''`
    console.log('可是指挥', str2)
    // window.open( `${window.SITE_CONFIG['baseUrl'].slice(0,-4)}/visualizion/index.html?${Base64.encode(encodeURIComponent(str2))}`)
    window.open( `${window.SITE_CONFIG['visual']}?${Base64.encode(encodeURIComponent(str2))}`)
    sessionStorage.open = Base64.encode(encodeURIComponent(str2))
  }
  /**
   * @author tanjinfeng
   * @date 2020-11-20
   * @desc 华为可视指挥
   */
  else if (menu.url === 'map/hwvisual') {
    let str2 = `token=${Cookies.get('token')}&platformId=${Cookies.get('platformId')}&type=hwvisual&allLoad=''`
    console.log('华为可视指挥', str2)
    // window.open( `${window.SITE_CONFIG['baseUrl'].slice(0,-4)}/visualizion/index.html?${Base64.encode(encodeURIComponent(str2))}`)
    window.open( `${window.SITE_CONFIG['visual']}?${Base64.encode(encodeURIComponent(str2))}`)
    sessionStorage.open = Base64.encode(encodeURIComponent(str2))
  }
  /**
   * @author tanjinfeng
   * @date 2020-10-21
   * @desc 垃圾分类可视指挥页面
   */
  else if (menu.url === 'map/visualGarbage') {
    let str2 = `token=${Cookies.get('token')}&platformId=${Cookies.get('platformId')}&type=visual&allLoad=''&garbage='true'`
    console.log('垃圾分类可视指挥', str2)
    // window.open( `${window.SITE_CONFIG['baseUrl'].slice(0,-4)}/visualizion/index.html?${Base64.encode(encodeURIComponent(str2))}`)
    window.open( `${window.SITE_CONFIG['visual']}?${Base64.encode(encodeURIComponent(str2))}`)
    sessionStorage.open = Base64.encode(encodeURIComponent(str2))
  }
  /**
   * @author tanjinfeng
   * @date 2020-09-14
   * @desc 垃圾分类页面
   */
  // begin
  else if (menu.url === 'map/classification') {
    let str2 = `token=${Cookies.get('token')}&platformId=${Cookies.get('platformId')}&type=GarbageClassification&allLoad=''`
    console.log('垃圾分类看板', str2)
    // window.open( `${window.SITE_CONFIG['baseUrl'].slice(0,-4)}/visualizion/index.html?${Base64.encode(encodeURIComponent(str2))}`)
    window.open( `${window.SITE_CONFIG['visual']}?${Base64.encode(encodeURIComponent(str2))}`)
    sessionStorage.open = Base64.encode(encodeURIComponent(str2))
  }
  // end
  /**
   * @author tanjinfeng
   * @date 2020-10-29
   * @desc 矛盾纠纷看板
   */
  // begin
  else if (menu.url === 'map/Disputes') {
    let str2 = `token=${Cookies.get('token')}&platformId=${Cookies.get('platformId')}&type=Disputes&allLoad=''`
    console.log('矛盾纠纷看板', str2)
    // window.open( `${window.SITE_CONFIG['baseUrl'].slice(0,-4)}/visualizion/index.html?${Base64.encode(encodeURIComponent(str2))}`)
    window.open( `${window.SITE_CONFIG['visual']}?${Base64.encode(encodeURIComponent(str2))}`)
    sessionStorage.open = Base64.encode(encodeURIComponent(str2))
  }
  // end
  else if (menu.url === 'map/vanguard') {
    let str2 = `token=${Cookies.get('token')}&platformId=${Cookies.get('platformId')}&type=vanguard&allLoad=''`
    console.log('越秀先锋', str2)
    // window.open( `${window.SITE_CONFIG['baseUrl'].slice(0,-4)}/visualizion/index.html?${Base64.encode(encodeURIComponent(str2))}`)
    window.open( `${window.SITE_CONFIG['visual']}?${Base64.encode(encodeURIComponent(str2))}`)
    sessionStorage.open = Base64.encode(encodeURIComponent(str2))
  }
  // 3.0模块直接跳转
  else if (window.SITE_CONFIG["3.0"].includes(menu.url)) {
    window.open(menu.url);
  }

        var route = this.dynamicMenuRoutes.filter(item => item.meta.menuId === menu.menuId)
        if (route.length >= 1) {
          this.$router.push({ name: route[0].name })
        }
      }
    }
  }
</script>
