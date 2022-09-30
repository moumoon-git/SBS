<template>
  <!-- <aside class="site-sidebar" :class="'site-sidebar--' + sidebarLayoutSkin" :style="{'z-index':'9999999','margin-top':`${typeof Number($window.SITE_CONFIG['baseUrl'].substr(7,1))=='number'?'initial':'-30px'}`}"> -->
  <aside
    class="site-sidebar"
    :class="'site-sidebar--' + sidebarLayoutSkin"
    style="z-index:9999999;margin-top:0px;"
  >
    <div class="site-sidebar__inner">
      <el-menu
        :default-active="menuActiveName || 'home'"
        :collapse="sidebarFold"
        :collapseTransition="false"
        class="site-sidebar__menu"
      >
        <!-- <el-menu-item index="home" @click="$router.push({ name: 'home' })"> -->
        <!--           <icon-svg name="shouye" class="site-sidebar__menu-icon"></icon-svg>-->
        <!-- <span slot="title">首页</span> -->
        <!-- </el-menu-item> -->
        <!--        <el-submenu index="">
          <template slot="title">
            <icon-svg name="shoucang" class="site-sidebar__menu-icon"></icon-svg>
            <span>demo</span>
          </template>
          <el-menu-item index="demo-echarts" @click="$router.push({ name: 'demo-echarts' })">
            <icon-svg name="maillist" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">通讯录</span>
          </el-menu-item>
          <el-menu-item index="demo-ueditor" @click="$router.push({ name: 'demo-ueditor' })">
            <icon-svg name="editor" class="site-sidebar__menu-icon"></icon-svg>
            <span slot="title">ueditor</span>
          </el-menu-item>
        </el-submenu>-->
        <sub-menu
          v-for="menu in menuList"
          :key="menu.menuId"
          :menu="menu"
          :dynamicMenuRoutes="dynamicMenuRoutes"
        ></sub-menu>
      </el-menu>
    </div>
  </aside>
</template>

<script>
  import SubMenu from './main-sidebar-sub-menu'
  import { isURL } from '@/utils/validate'

  export default {
    data () {
      return {
        dynamicMenuRoutes: [],
        $window:{}
      }
    },
    components: {
      SubMenu
    },
    mounted(){
    },
    computed: {
      sidebarLayoutSkin: {
        get () { return this.$store.state.common.sidebarLayoutSkin }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold }
      },
      menuList: {
        get () { return this.$store.state.common.menuList },
        set (val) { this.$store.commit('common/updateMenuList', val) }
      },
      menuActiveName: {
        get () { return this.$store.state.common.menuActiveName },
        set (val) { this.$store.commit('common/updateMenuActiveName', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      mainTabsActiveName: {
        get () { return this.$store.state.common.mainTabsActiveName },
        set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
      }
    },
    watch: {
      $route: 'routeHandle'
    },
    created () {
      this.$window=window
      this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
      this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
      this.routeHandle(this.$route)
    },
    methods: {
      // 路由操作
      routeHandle (route) {
        
        if (route.meta.isTab) {
          // tab选中, 不存在先添加
          var tab = this.mainTabs.filter(item => item.name === route.name)[0]
          if (!tab) {
            if (route.meta.isDynamic) {
              route = this.dynamicMenuRoutes.filter(item => item.name === route.name)[0]
              if (!route) {
                return console.error('未能找到可用标签页!')
              }
            }
            tab = {
              menuId: route.meta.menuId || route.name,
              name: route.name,
              title: route.meta.title,
              type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
              iframeUrl: route.meta.iframeUrl || '',
              params: route.params,
              query: route.query
            }
            this.mainTabs = this.mainTabs.concat(tab)
          }
          this.menuActiveName = tab.menuId + ''
          this.mainTabsActiveName = tab.name
        }
      }
    }
  }
</script>
<style lang="scss" >
.site-sidebar {
    width: 173px;
}
.site-sidebar__menu.el-menu {
    width: 173px;
}
.site-sidebar__menu.el-menu .is-active .el-submenu__title i {
    color: #d8d8d8;
}
.el-submenu__title {
    padding: 0 19.51px 0 23px;
    i {
        color: #8f9aa1;
    }
}
.site-sidebar--dark .site-sidebar__menu.el-menu .el-menu {
    position: relative;
}
.site-sidebar--dark,
.site-sidebar__menu,
.el-menu .el-menu,
.site-sidebar--dark,
.site-sidebar__menu,
.el-menu,
.el-submenu,
.is-opened,
.site-sidebar--dark,
.el-menu--popup,
.el-menu,
.site-sidebar--dark,
.el-menu--popup,
.el-submenu,
.is-opened,
.site-sidebar--dark-popper,
.site-sidebar__menu.el-menu,
.el-menu,
.site-sidebar--dark-popper,
.site-sidebar__menu,
.el-menu,
.el-submenu,
.is-opened,
.site-sidebar--dark-popper,
.el-menu--popup,
.el-menu,
.site-sidebar--dark-popper,
.el-menu--popup,
.el-submenu,
.is-opened {
    background-color: #272c34 !important;
}
.site-navbar__menu.el-menu--horizontal.el-menu {
    background-color: white !important;
}
/deep/ .el-submenu .el-menu-item {
    font-size: 13px !important;
    padding-left: 40px !important;
}
.site-sidebar--dark .site-sidebar__menu.el-menu .el-submenu .el-submenu__title {
    padding-left: 14px !important;
}
.site-sidebar--dark
    .site-sidebar__menu.el-menu
    .el-submenu
    .site-sidebar--dark
    .site-sidebar__menu.el-menu
    .el-menu-item,
.site-sidebar--dark
    .site-sidebar__menu.el-menu
    .el-submenu
    > .el-submenu__title,
.site-sidebar--dark > .el-menu--popup .el-menu-item,
.site-sidebar--dark > .el-menu--popup .el-submenu > .el-submenu__title,
.site-sidebar--dark-popper .site-sidebar__menu.el-menu .el-menu-item,
.site-sidebar--dark-popper
    .site-sidebar__menu.el-menu
    .el-submenu
    > .el-submenu__title,
.site-sidebar--dark-popper > .el-menu--popup .el-menu-item,
.site-sidebar--dark-popper > .el-menu--popup .el-submenu > .el-submenu__title {
    color: #8f9aa1;
}
.site-sidebar--dark .site-sidebar__menu.el-menu .el-menu-item.is-active,
.site-sidebar--dark
    .site-sidebar__menu.el-menu
    .el-submenu.is-active
    > .el-submenu__title,
.site-sidebar--dark > .el-menu--popup .el-menu-item.is-active,
.site-sidebar--dark
    > .el-menu--popup
    .el-submenu.is-active
    > .el-submenu__title,
.site-sidebar--dark-popper .site-sidebar__menu.el-menu .el-menu-item.is-active,
.site-sidebar--dark-popper
    .site-sidebar__menu.el-menu
    .el-submenu.is-active
    > .el-submenu__title,
.site-sidebar--dark-popper > .el-menu--popup .el-menu-item.is-active,
.site-sidebar--dark-popper
    > .el-menu--popup
    .el-submenu.is-active
    > .el-submenu__title {
    color: white;
}
.site-sidebar .el-submenu,
.site-sidebar .el-menu-item {
    margin-left: 0;
}
.site-sidebar--dark .site-sidebar__menu.el-menu .el-menu-item:focus,
.site-sidebar--dark .site-sidebar__menu.el-menu .el-menu-item:hover,
.site-sidebar--dark
    .site-sidebar__menu.el-menu
    .el-submenu
    > .el-submenu__title:focus,
.site-sidebar--dark
    .site-sidebar__menu.el-menu
    .el-submenu
    > .el-submenu__title:hover,
.site-sidebar--dark > .el-menu--popup .el-menu-item:focus,
.site-sidebar--dark > .el-menu--popup .el-menu-item:hover,
.site-sidebar--dark > .el-menu--popup .el-submenu > .el-submenu__title:focus,
.site-sidebar--dark > .el-menu--popup .el-submenu > .el-submenu__title:hover,
.site-sidebar--dark-popper .site-sidebar__menu.el-menu .el-menu-item:focus,
.site-sidebar--dark-popper .site-sidebar__menu.el-menu .el-menu-item:hover,
.site-sidebar--dark-popper
    .site-sidebar__menu.el-menu
    .el-submenu
    > .el-submenu__title:focus,
.site-sidebar--dark-popper
    .site-sidebar__menu.el-menu
    .el-submenu
    > .el-submenu__title:hover,
.site-sidebar--dark-popper > .el-menu--popup .el-menu-item:focus,
.site-sidebar--dark-popper > .el-menu--popup .el-menu-item:hover,
.site-sidebar--dark-popper
    > .el-menu--popup
    .el-submenu
    > .el-submenu__title:focus,
.site-sidebar--dark-popper
    > .el-menu--popup
    .el-submenu
    > .el-submenu__title:hover {
    background-color: #272c34;
    color: white;
}
.site-sidebar--dark .site-sidebar__menu.el-menu .el-menu-item:hover span {
    color: white;
}
.site-sidebar--dark .site-sidebar__menu.el-menu .el-menu-item.is-active,
.site-sidebar--dark > .el-menu--popup .el-menu-item.is-active,
.site-sidebar--dark-popper .site-sidebar__menu.el-menu .el-menu-item.is-active,
.site-sidebar--dark-popper > .el-menu--popup .el-menu-item.is-active {
    background-color: #202020;
}
.site-sidebar--dark .site-sidebar__menu.el-menu .el-menu-item.is-active,
.site-sidebar--dark > .el-menu--popup .el-menu-item.is-active,
.site-sidebar--dark-popper .site-sidebar__menu.el-menu .el-menu-item.is-active,
.site-sidebar--dark-popper > .el-menu--popup .el-menu-item.is-active {
    &::before {
        content: '';
        display: inline-block;
        width: 2px;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #3f92fe;
        box-shadow: 0px 2px 7px 0px rgba(71, 72, 80, 0.44);
    }
}
.site-sidebar--dark .site-sidebar__menu.el-menu .el-menu-item.is-active span,
.site-sidebar--dark > .el-menu--popup .el-menu-item.is-active span,
.site-sidebar--dark-popper
    .site-sidebar__menu.el-menu
    .el-menu-item.is-active
    span,
.site-sidebar--dark-popper > .el-menu--popup .el-menu-item.is-active span {
    color: white;
}
.site-sidebar--dark .site-sidebar__menu .is-opened .el-submenu__title {
    color: white !important;
    i {
        color: #d8d8d8;
    }
}
.site-sidebar--dark .site-sidebar__menu.el-menu .el-menu-item span,
.site-sidebar--dark > .el-menu--popup .el-menu-item span,
.site-sidebar--dark-popper .site-sidebar__menu.el-menu .el-menu-item span,
.site-sidebar--dark-popper > .el-menu--popup .el-menu-item span {
    color: #8f9aa1;
}
</style>
