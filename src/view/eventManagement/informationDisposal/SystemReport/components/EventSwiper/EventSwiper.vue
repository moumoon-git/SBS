<template>
  <div class="swiper_event-list">
    <div class="swiper-container">
      <div class="swiper-wrapper event_list">
        <div
          v-for="(item, index) in eventDealList"
          :key="index"
          class="swiper-slide"
        >
          <div
            :class="
              'item_wrap ' +
                (activeIndex === index ? 'item_wrap_active' : '')
            "
            @click="clickEvent(item, index)"
          >
            <p class="event_name">
              {{ item.dealOrderName }}
            </p>
            <div class="item_wrap_bg" />
          </div>
        </div>
      </div>
      <div slot="button-prev" class="swiper-button-prev" />
      <div slot="button-next" class="swiper-button-next" />
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      eventDealList: [],
      activeIndex: 0,
    };
  },
  watch: {
    eventDealList: {
      handler() {
        setTimeout(() => {
          this.initSwiper();
        }, 500);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    /**
     * @description 初始化swiper插件
     */
    initSwiper() {
      return new this.$Swiper('.swiper-container', {
        // freeMode: false,
        freeMode: true, // 默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动可能不止一格且不会贴合。
        freeModeSticky: true, // 使得freeMode也能自动贴合。
        freeModeMinimumVelocity: 1, // 触发FreeMode惯性的最小触摸速度（px/ms），低于这个值不会惯性滑动
        effect: 'coverflow', // slide的切换效果，默认为"slide"（位移切换），可设置为'slide'（普通切换、默认）,"fade"（淡入）"cube"（方块）"coverflow"（3d流）"flip"（3d翻转）
        slidesPerView: 'auto', // 设置slider容器能够同时显示的slides数量(carousel模式)
        centeredSlides: false, // 设定为true时，active slide会居中，而不是默认状态下的居左
        spaceBetween: 20, // 在slide之间设置距离（单位px）。
        coverflowEffect: {
          // 类似于苹果将多首歌曲的封面以3D界面的形式显示出来的方式
          rotate: 0, // slide做3d旋转时Y轴的旋转角度
          stretch: 0, // 每个slide之间的拉伸值，越大slide靠得越紧。5.3.6 后可使用%百分比
          depth: 0, // slide的位置深度。值越大z轴距离越远，看起来越小。
          modifier: 2, // depth和rotate和stretch的倍率，相当于depth*modifier、rotate*modifier、stretch*modifier，值越大这三个参数的效果越明显。
          slideShadows: false, // 是否开启slide阴影
        },
        navigation: {
          nextEl: '.swiper-button-next', // 设置前进按钮的css选择器或HTML元素
          prevEl: '.swiper-button-prev', // 设置后退按钮的css选择器或HTML元素。
          disabledClass: 'my-button-disabled', // 前进后退按钮不可用时的类名。
        },
      });
    },

    clickEvent(item, index) {
      this.activeIndex = index;
      this.$emit('item-click', index);
    },

  },
};
</script>

<style>
@import './assets/css/eventSwiper.scss';
</style>
