<template>
  <div style="margin-left: 10px;margin-right: 10px;">
      <el-form>
        <el-form-item style="">
            <div class="resource-category">
                <span style="display: flex">资源目录</span>
                <div style="padding-bottom: 20px;">
                  <div style="width: 100%;">
                    <!--<el-menu
                      default-active="2"
                      background-color="#f5f5f5"
                      text-color="#fff"
                      default-active="1"
                      active-text-color="#03a9f4"
                      active-text-color="#ffd04b">-->

                      <el-menu
                        :collapseTransition="false"
                        default-active="1"
                        background-color="#d3d4d6"
                        text-color="#656565"
                        active-text-color="#03a9f4"
                        v-if="hackReset == true"
                      >
                        <sub-menu-left
                          class="subMenuLeft"
                          v-for="menu in menuTreeList"
                          :key="menu.id"
                          :menu="menu"
                         >
                        </sub-menu-left>
                      </el-menu>

                    <!--</el-menu>-->

                  </div>
                </div>
            </div>

            <div class="resource-target" style="margin-top: 20px;margin-bottom: 50px;">
              <span style="display: flex">资源指标</span>
              <div style="background-color: #d3d4d6;padding-top: 20px;padding-bottom: 20px;">
                <el-button style="width: 80%;" type="info" plain @click="proportionClick('131')">总数</el-button>
                <p></p>
                <el-button style="width: 80%;" type="info" plain @click="proportionClick('132')">占比</el-button>
                <p></p>
                <el-button style="width: 80%;" type="info" plain @click="proportionClick('133')">趋势</el-button>
                <p></p>
                <el-button style="width: 80%;" type="info" plain @click="proportionClick('134')">列表</el-button>
              </div>
            </div>

        </el-form-item>
      </el-form>
  </div>


</template>

<script>

import SubMenuLeft from './sub-menu'

export default {
  //props:["leftDisable","modulePosition","moduleName"],

  data() {
      return {
        //头部变量
        analysisModulePosition: [],
        analysisModuleName: '',
        modulePositionId: 0,

        //菜单模块
        hackReset: true,
        menuItemDisabled: false,
        subMenuDisabled: false,
        submenuLeftId: 0,
        //菜单列表
        menuTreeList: [],

        //是否禁用下拉选择
        selectDisa: false,
        value: ''
      }
    },

  watch:{
    '$store.state.analysis.analysisData': {
      handler(newValue, oldValue) {
        // console.log("监听头部模块",newValue,oldValue)
        this.analysisModuleName = newValue.analysisModuleName;
        this.analysisModulePosition = newValue.analysisModulePosition;
        this.hackReset = false;

        if(this.analysisModuleName == 'homePage'){

            //刷新
            this.getAsideMenu()

            this.$nextTick(() => {
              this.hackReset = true;
            });

        }else if(this.analysisModuleName == 'largeScreen'){

            //刷新
            this.getAsideMenu()

            this.$nextTick(() => {
              this.hackReset = true;
            });
        }else{
            function findChilden (obj,position) {
              let children = obj.children
              if (children != null) {
                children.forEach((item, index) => {
                  //存在
                  if(position.includes(item.id)){
                    item.subMenuDisabled = false;
                    //console.log("true")
                  }else{
                    //console.log("false")
                    item.subMenuDisabled = true;
                  }
                  findChilden(item, position)
                })
              }
            }


            if(this.menuTreeList !=null){
              findChilden(this.menuTreeList[0],this.analysisModulePosition)
            }

            // console.log("改造后的菜单",this.menuTreeList)

            this.$nextTick(() => {
              this.hackReset = true;
            });

        }

      },
      deep: true
    },
    '$store.state.analysis.submenuLeftId': {
      handler (newValue, oldValue) {
          this.submenuLeftId = newValue;
      }
    },
    '$store.state.analysis.modulePositionId': {
      handler (newValue, oldValue) {
        this.modulePositionId = newValue;
      }
    }

  },

  created() {

    //获取菜单
    this.getAsideMenu()
  },
    mounted () {

    },

    methods: {
      //请求菜单
      getAsideMenu(){
        this.$http({
          url: this.$http.adornUrl("/analysis/analysisSource/listTreeByType"),
          method: "get",
          params: this.$http.adornParams({
            type: 3
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.menuTreeList = []
            this.menuTreeList = data.data;
            //this.menuTreeList = treeDataTranslate(data.data, 'id');
          } else {
            this.$message.error(data.msg)
          }

        })

      },

      //总数点击
      proportionClick(val){
        // console.log("点击资源指标,左边菜单，头部模块",this.submenuLeftId,this.modulePositionId)
        //var position = this.$store.state.analysis.modulePositionId;
        if(this.modulePositionId ===0){
          this.$message({
            message: '请先选择专题业务',
            type: 'warning'
          });
          return;
        }
        if(this.submenuLeftId === 0){
          this.$message({
            message: '请选择资源目录',
            type: 'warning'
          });
          return;
        }
        this.$emit("proportionClick",this.submenuLeftId,val);
      },

    },
    components: {
      SubMenuLeft
    },
};
</script>
<style lang="scss">

  .subMenuLeft{
    color: #656565 !important;
    background-color: whitesmoke !important;
  }

  .resource-category .el-menu{
    background: whitesmoke !important;
    background-color: whitesmoke !important;
    //opacity: 0 !important;
  }

</style>
