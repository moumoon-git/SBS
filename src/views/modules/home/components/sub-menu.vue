<template>
  <el-submenu
    class="elSubMenuLeft"
    v-if="menu.children && menu.children.length >= 1"
    :index="menu.id + ''"
    >
    <template slot="title" style="padding-left: 0px;">
     <!-- <icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon"></icon-svg>-->
      <span v-if="menu.sourceName != null">{{menu.sourceName}}</span>
      <!--<span v-else>{{menu.name}}</span>-->
    </template>

    <sub-menu
      v-for="item in menu.children"
      :key="item.id"
      :menu="item"
    >
    </sub-menu>
  </el-submenu>

  <el-menu-item :disabled="menu.subMenuDisabled" class="elSubMenuItem" v-else :index="menu.id + ''" @click="clickMenuItem(menu)">
    <!--<icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon"></icon-svg>-->
    <span v-if="menu.sourceName != null">{{menu.sourceName}}</span>
    <!--<span v-else>{{menu.name}}</span>-->
  </el-menu-item>
</template>

<script>

  export default {
    name: 'sub-menu',
    data(){
      return {
        subDisabled: false,
        itemDisabled: false,
      }
    },

    props:['menu','subMenuDisabled','menuItemDisabled'],

    data(){
      return {};
    },
    components: {

    },
    // computed:{
    //   submenuLeftId: {
    //     get () { return this.$store.state.analysis.submenuLeftId },
    //     set (val) { this.$store.commit('analysis/updateAnalysisSubmenuLeftId', val) }
    //   },
    // },
    methods: {
      // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
      clickMenuItem(menu){
        // console.log("点击菜单，联动弹窗",menu)
        //this.$emit("clickMenuItem",menu);
        //this.submenuLeftId = menu.id;
        this.$store.commit('analysis/updateAnalysisSubmenuLeftId', menu.id)
      }
    }
  }
</script>

<style lang="scss">
  .elSubMenuLeft{
    background-color: #d3d4d6 !important;
    padding-left: 0px !important;
    width: 200px !important;
    min-width: 0px !important;
  }
  .elSubMenuItem{
    background-color: whitesmoke !important;
    padding-left: 40px !important;
    width: 200px !important;
    min-width: 0px !important;
  }
  .elSubMenuLeft .el-menu--inline{
    background-color: whitesmoke !important;

  }

</style>
