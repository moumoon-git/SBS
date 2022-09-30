<template>

  <el-container class="homeContainer">
    <!--左边-->
    <el-aside width="220px" style="background-color: #fff;
    height: 100%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    margin-right: 5px;">
      <AsideLeft
        ref="asideLeft"
        @proportionClick="proportionClick"
      >
      </AsideLeft>
    </el-aside>

    <el-container>
      <!--头部-->
      <el-header style="height:90px;background-color: #fff;
      border-bottom: 2px solid #d6d6d6;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      margin-bottom: 5px;">
        <Header
          ref="header"
        >
        </Header>
      </el-header>

      <!--主要-->
      <el-main style="background-color: #fff;">
        <div class="home">
          <!--ehcart图表显示-->
          <LineSimple
            :addEcharts = 'addEcharts'
            ref="lineChartsFunc"
            :disab="disabled">
          </LineSimple>
        </div>
      </el-main>

      <!--脚部-->
      <el-footer style="background-color: #fff;">
        <div class="funcBtn">
          <el-button type="primary" plain @click="compileBtnFunc()">编辑</el-button>
          <el-button type="primary" plain @click="saveBtnFunc()" :disabled='disab'>保存</el-button>
          <!--<el-button type="primary" plain @click="selectchartFunc()">添加</el-button>-->
          <NavMenu ref="navMenu" v-on:addEchart='selectchart' class="echartNav" v-if="selectchartDisabled"></NavMenu>
        </div>
      </el-footer>
    </el-container>
  </el-container>


</template>

<script>
  import draggable from 'vuedraggable'
  import LineSimple from "./components/LineSimple.vue";
  import NavMenu from './components/NavMenu.vue'
  import AsideLeft from './components/Aside'
  import Header from './components/Header'
  export default {
    data() {
      return {
        addEcharts:[],
        disabled:true,
        disab:true,
        selectchartDisabled: false,
        submenuLeftId: 0,
        sourceFlag: '',

      };
    },
    computed:{
    },
    created() {

    },
    mounted () {

    },
    methods: {
      //大屏点击
      largeScreenClick(position,name){
        // console.log("大屏点击",position,name)
        //this.modulePosition = position;
        //this.moduleName = name;

      },
      //首页点击
      homePageClick(position,name){
        // console.log("首页点击",position,name)
        //this.modulePosition = position;
        //this.moduleName = name;
      },

      //选择按钮
      selectchart(data){
        // console.log("选择按钮选择按钮选择按钮",data)
        this.addEcharts = []
        this.addEcharts.push(data)
        this.$nextTick(()=>{
          this.addEcharts = []
        })
      },

      selectchartFunc(){
        this.selectchartDisabled = true;
        this.disab = false
        this.disabled = false
        this.$nextTick(() => {
          this.$refs.navMenu.init(this.submenuLeftId,this.sourceFlag)
        });

      },
      //编辑按钮
      compileBtnFunc(){

        this.$refs.lineChartsFunc.parentInfo(false)
        this.disab = false
        this.disabled = false
      },
      //保存按钮
      saveBtnFunc(){
        this.$refs.lineChartsFunc.parentInfo(true)
        this.disab = true
        this.disabled = true
      },

      //点击比例模块，选择资源指标弹窗
      proportionClick(submenuLeftId,sourceFlag){
        // console.log("点击比例模块点击比例模块,左边，比例",submenuLeftId,sourceFlag)
        this.submenuLeftId = submenuLeftId;
        this.sourceFlag = sourceFlag;
        //弹出选择框
        this.selectchartDisabled = true;
        this.disab = false
        this.disabled = false
        this.$nextTick(() => {
          this.$refs.navMenu.init(this.submenuLeftId,this.sourceFlag)
        });

      }
    },
    components: {
      AsideLeft,
      Header,
      draggable,
      LineSimple,
      NavMenu
    },
  };
</script>
<style lang="scss">

  .homeContainer .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .homeContainer .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .homeContainer .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    //line-height: 160px;
  }

  .homeContainer {
    margin-bottom: 40px;
  }

  .homeContainer:nth-child(5) .el-aside,
  .homeContainer:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .homeContainer:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .color-item{
    border:1px solid #f1f1f1;
    padding:10px 5px;
    margin:5px 0;
    border-radius: 4px;
  }

  .home{
    height:100%;
    width:100%;
    .funcBtn{
      height:6.5vh;
      padding-top:.5vh;
      width:100%;
      text-align: right;
    }
    .echart1Box,.echart2Box,.echart3Box{
      height:100%;
      background:#f0f;
      .chartmain{
        position:relative;
        display:inline-block;
        margin-bottom:1vh;
        border-radius: 2px 2px 2px 2px;
        box-shadow: 1px 2px 5px #ccc;
        border: 1px solid #ddd;
        //min-height:29vh;
        min-height:29vh;
        width:24vw;
        margin-right:.5vw;
      }
    }
    .echart2Box{
      background:#ff0;
    }
    .echart3Box{
      min-height:38.5vh;
      background:#0ff;
    }

    .h12 {
      height: 12vh !important;
    }
    .h15 {
      height: 19vh !important;
    }
    .h20 {
      height: 24vh !important;
    }
    .h30 {
      height: 34vh !important;
    }
    .h40 {
      height: 45vh !important;
    }

    .w12 {
      width: 12vw !important;
    }
    .w24{
      width:24vw !important;
    }
    .w32{
      width:32vw !important;
    }
    .w49{
      width:49vw !important;
    }

    .itemclass{
      background:red;
    }
  }
</style>
