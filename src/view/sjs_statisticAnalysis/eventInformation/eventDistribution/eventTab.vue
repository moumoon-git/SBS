<!--
 * @Author: your name
 * @Date: 2021-08-18 15:56:57
 * @LastEditTime: 2021-08-19 09:35:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project-nanhai\src\views\modules\riskInvestigation\statisticAnalysis\eventInformation\eventDistribution\eventTab.vue
-->
<template>
  <div class="wrapper">
    <div ref="buttonList" class="event-tab">
      <div class="swiper-container"> 
        <div class="swiper-wrapper">
          <div v-for="(btn, index) in buttonList" :key="btn.id" class="one-swiper-slide">
            <el-button 
              type="text"
              :class="'button-style ' + (activeButton === index ? 'active' : '')"
              @click.stop="handleClick(btn, index)" >
              {{ btn.name }}
              </el-button>
          </div>
        </div>
        <div class="swiper-button-prev" slot="button-prev">
          <div class="pre"></div>
        </div>
        <div class="swiper-button-next" slot="button-next">
          <div class="next"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventTab',
  props: [
    'buttonList'
  ],
  data() {
    return {
      activeButton: 0,
    }
  },
  watch: {
    buttonList: {
      handler(newValue) {
        console.log('tab的值：', newValue)
        this.$nextTick(() => {
          this.initSwiper();
        })
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    handleClick(btn, index) {
      this.activeButton = index;
      this.$emit('buttonClick', index);
    },
    initSwiper () {
      var swiper = new this.$Swiper('.swiper-container', {
        allowTouchMove: false, // 不允许鼠标拖动
        slidesPerView: 'auto', // 设置slider容器能够同时显示的slides数量
        navigation: {
          nextEl: '.swiper-button-next', // 设置前进按钮的css选择器或HTML元素
          prevEl: '.swiper-button-prev', // 设置后退按钮的css选择器或HTML元素。
          disabledClass: 'my-button-disabled', // 前进后退按钮不可用时的类名。
        },
        
      })
    }
  }
}
</script>

<style scope>
 .wrapper {
    position: absolute;
    top: 12px;
    right: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .event-tab {
    display: flex;
    flex-direction: row;
    width: 380px;
  }
  .swiper-container .swiper-wrapper {
    padding: 0 10px;
  }
  .swiper-container .one-swiper-slide .button-style {
    font-size:12px;
    color:rgba(102,102,102,0.8);
    line-height:17px;
    margin-right: 20px !important;
    padding-bottom: 2px;
    padding-top: 0;
    border-radius: 0;
    border-bottom: 2px solid #ffffff;
  }
  .swiper-container .one-swiper-slide .active,
  .swiper-container .one-swiper-slide .button-style:active,
  .swiper-container .one-swiper-slide .button-style:hover,
  .swiper-container .one-swiper-slide .button-style:focus {
    color:rgba(50,50,50,1);
    line-height:17px;
    border-bottom: 2px solid rgba(0,145,255,1);
    border-radius: 0;
    padding-top: 0;
    padding-bottom: 2px;
  }
  .swiper-container {
    width: 100%;
    height: 100%;
  }
  .one-swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;
    /* width: 80%; */
    width: auto;
    padding: 0 10px;

    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;

  }
  .swiper-button-prev {
    left: 0 !important;
    background: #ffffff;
    --swiper-navigation-color: #ffffff;/* 单独设置按钮颜色 */
    --swiper-navigation-size: 30px;/* 设置按钮大小 */
  }
  .swiper-button-prev .pre {
    position: absolute;
    /* left: -6px; */
    /* left: 0px; */
    width: 0;
    height: 0;
    border-right: 8px solid #000000;
    border-left: 8px solid transparent;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
  }
  .swiper-button-next {
    right: 0 !important;
    background: #ffffff;
    --swiper-navigation-color: #ffffff;/* 单独设置按钮颜色 */
    --swiper-navigation-size: 30px;/* 设置按钮大小 */
  }
  .swiper-button-next .next {
    position: absolute;
    /* right: -6px; */
    /* right: 0px; */
    width: 0;
    height: 0;
    border-left: 8px solid #000000;
    border-right: 8px solid transparent;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
  }
  .my-button-disabled{
    opacity:0.2;
  }
  .button-next {
    width: 30px;
    height: 30px;
    background: pink;
  }
</style>