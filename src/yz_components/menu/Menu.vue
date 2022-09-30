<template>
  <el-submenu :index="menu.name" v-if="menu.child.length!=0">
    <template slot="title">
      <i v-if="isShow" :class="'icon-style '+ menu.resourceLogo"></i>
      <div v-if="isShow==false" :class="menu.resourceLogo+ '-circle'">
        <div :class="menu.resourceLogo+ '-shrink'"></div>
        <!--        <div style=" position: absolute; top: 34px; left: 30px;">{{menu.displayname}}</div>-->
      </div>
      <span slot="title" class="menuName">{{menu.displayname}}</span>
    </template>
    <eos-menu v-for="(menu,index) in menu.child" :key="index" :menu="menu"></eos-menu>
  </el-submenu>

  <el-menu-item :index="menu.name" v-else-if="menu.child.length==0" @click="menuItemClick(menu)">
    <i v-if="isShow" :class="'icon-style '+ menu.resourceLogo"></i>
    <div v-if="isShow==false" :class="menu.resourceLogo+ '-circle'">
      <div :class="menu.resourceLogo+ '-shrink'"></div>
      <!--      <div style=" position: absolute; top: 34px; left: 30px;" >{{menu.displayname}}</div>-->
    </div>
    <span slot="title" class="menuName">{{menu.displayname}}</span>
  </el-menu-item>
</template>

<script>
export default {
    name: 'eos-menu',
    props: ['menu', 'isShow'],
    methods: {
        menuItemClick(menu) {
            console.log('menuItemClick点击', menu);
            localStorage.setItem("sharedMenuCode",menu.menuId)
            sessionStorage.setItem('mainTabsTitle', menu.displayname);
            this.$router.push({ path: '/' + menu.name });
        },
    },
};
</script>

<style scoped>
@import '../../assets/css/icon.css';

.menu {
    background-color: #2b3547;
}

.menuName {
    margin-right: 48px;
    font-size: 16px;
    color: #8f9aa1;
}
.menuName:active,
.menuName:focus,
.menuName:hover,
.menuName:visited,
.menuName:focus-within {
    color: #ffffff;
}
.el-menu-item:hover {
    /* color: #479DFF; */
    color: #ffffff;
    border-left: 3px solid #47afff;
}
.el-menu-item {
    /* color: #8F9AA1; */
    border-left: 3px solid rgb(43, 53, 71);
}

.el-submenu.is-active .el-submenu__title .menuName,
.el-menu-item.is-active .menuName,
.el-submenu__title:hover .menuName,
.el-menu-item.is-active:hover .menuName {
    color: #ffffff !important;
}

.icon-style {
    margin: 16px 4px;
    float: left;
}

.el-menu--collapse > .el-menu-item span,
.el-menu--collapse
    > .el-submenu
    > .el-submenu__title
    spanel-submenu__title
    span {
    height: 0;
    width: 0;
    overflow: hidden;
    visibility: hidden;
    display: inline-block;
}

>>> .el-menu-item {
    /*border-bottom:1px solid;*/
    /*border-bottom-color:rgba(242,242,242,0.1) !important;*/
}

/*>>>.el-tooltip{*/
/*  padding: 0 !important;*/
/*}*/
</style>
