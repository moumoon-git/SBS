<template>
  <div :class="{'oy-active':isShowWind}" class="drag-call-btn" ref="moveBtn" @mousedown.prevent="down" @touchstart="down" @mousemove.prevent="move"
	 @touchmove="move" @mouseup.prevent="end" @touchend="end" @touchcancel="end" @dblclick.prevent="showWind" title="双击最大化"></div>
     
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  props: {
      
  },
  data() {
    return {
      flags: false,
      position: {
        x: 0,
        y: 0
      },
      nx: "",
      ny: "",
      dx: "",
      dy: "",
      xPum: "",
      yPum: "",
      isShow: false,
      moveBtn: {}
    };
  },
  computed: {
      ...mapGetters({
          isShowWind:'getIsShowWind'
      })
  },

  created() {},
  mounted() {
   this.moveBtn = this.$refs.moveBtn
  },

  methods: {
      showWind(){
        this.$store.commit("setCallStatus", true);
        this.$store.commit("SET_ISSHOWWIN", false);
      },
    // 实现移动端拖拽
			down() {
				this.flags = true;
				var touch;
				if (event.touches) {
					touch = event.touches[0];
				} else {
					touch = event;
				}
				this.position.x = touch.clientX;
				this.position.y = touch.clientY;
				this.dx = this.moveBtn.offsetLeft;
				this.dy = this.moveBtn.offsetTop;
			},
			move() {
				if (this.flags) {
					var touch;
					if (event.touches) {
						touch = event.touches[0];
					} else {
						touch = event;
					}
					this.nx = touch.clientX - this.position.x;
					this.ny = touch.clientY - this.position.y;
					this.xPum = this.dx + this.nx;
					this.yPum = this.dy + this.ny;
					var clientWidth = document.documentElement.clientWidth;
					var clientHeight = document.documentElement.clientHeight;
					if (this.xPum > 0 && this.xPum < (clientWidth - this.moveBtn.offsetWidth)) {
						this.moveBtn.style.left = this.xPum + "px";
					}
					if (this.yPum > 0 && this.yPum < (clientHeight - this.moveBtn.offsetHeight)) {
						this.moveBtn.style.top = this.yPum + "px";
					}

					//阻止页面的滑动默认事件
					document.addEventListener("touchmove", this.handler, {
						passive: false
					});
				}
			},
			//鼠标释放时候的函数
			end() {
				this.flags = false;
				document.addEventListener('touchmove', this.handler, {
					passive: false
				});
			},
			handler(e) {
				if(this.flags){
					event.preventDefault(); 
				}else{
					return true
				}
			}
  }
};
</script>

<style scoped>
.drag-call-btn {
  width: 60px;
  height: 60px;
  position: fixed;
  z-index: 99999;
  bottom: 100px;
  right: 100px;
  background-image: url(../assets/icpImg/IcpPhone.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
  display: none;
}
.drag-call-btn.oy-active{
    display: block;
}
</style>
