<template>
  <div class="navMenu">
    <label v-for="menu in menus">
        <el-menu-item v-if="menu.child.length == 0" :index="menu.name">
        	<!--index：类型为字符串，在每一个el-menu-item组件上都有一个编号，给default-active标记--> 
          <i :class="menu.resourceLogo" style="margin-right: 8px;"></i>
          <span slot="title" style=" font-size: 16px;">{{menu.displayname}}</span>
        </el-menu-item>

        <el-submenu v-if="menu.child.length != 0" :index="menu.name" @click="menuItemClick(menu)">
          <template slot="title">
            <i :class="menu.resourceLogo" style="margin-right: 8px;"></i>
            <span style=" font-size: 16px;"> {{menu.displayname}}</span>
          </template>
          <my-nav :menus="menu.child"></my-nav>
        </el-submenu>
    </label>
  </div>
</template>

<script>

export default {
  name: 'my-nav',
  props: [ 'menus' ],
  data() {
      return {
        isCollapse: false
      };
    },
    methods: {
        menuItemClick(menu) {
            console.log('menuItemClick点击', menu);
            localStorage.setItem("sharedMenuCode",menu.menuId)
        },
    }
}
</script>
<style scoped>
	/*@import '../assets/css/common.css';*/
	@import '../assets/icon/iconfont.css';
	.el-menu-item, .el-submenu__title{
		height: 50px;
		line-height: 50px;
	}
.el-submenu>>> .el-submenu__title{
	height: 50px;
		line-height: 50px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    height: calc(100vh - 60px);
  }
	.el-submenu>>> .el-submenu__title .el-submenu__icon-arrow{
		right: 8px;
  }
  .el-submenu>>> .el-submenu__title i{
      color: white;
  }
</style>