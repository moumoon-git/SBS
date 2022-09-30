<template>
  <div class="drag-call-btn" :class="{'oy-active':buttonShow}" ref="callButton"
       @mousedown="mouseDownHandleelse($event)" @mouseup="mouseUpHandleelse($event)"
       @dblclick.prevent="showWind" title="双击最大化"
  ></div>
</template>

<script>
    import { mapGetters, mapMutations } from "vuex";
    export default {
        name: "phoneCallButton",
        computed: {
            ...mapGetters({
                buttonShow:'getIsShowButton'
            })
        },
        data() {
            return {
                moveDataelse: {
                    x: null,
                    y: null
                },
            };
        },
        methods: {
            showWind(){
                this.$store.commit("setIsShowButton", false);
            },
            mouseDownHandleelse (event) {
                document.onselectstart = function() {
                    return false;
                };
                this.moveDataelse.x = event.pageX - this.$refs.callButton.offsetLeft
                this.moveDataelse.y = event.pageY - this.$refs.callButton.offsetTop
                event.currentTarget.style.cursor = 'move'
                this.mouseMoveHandleelse(event)
            },
            mouseMoveHandleelse (event) {
                //计算出鼠标相对点击元素的位置,e.clientX获取的是鼠标的位置，OffsetLeft是元素相对于外层元素的位置
                let x = event.clientX - this.$refs.callButton.offsetLeft;
                let y = event.clientY - this.$refs.callButton.offsetTop;
                window.onmousemove  = (e) => {
                    // 获取拖拽元素的位置
                    let left = e.clientX - x;
                    let top = e.clientY - y;
                    //console.log(document.documentElement.clientHeight,odiv.offsetHeight)
                    // 把拖拽元素 放到 当前的位置
                    if (left <= 0) {
                        left = 0;
                    } else if (left >= document.documentElement.clientWidth - this.$refs.callButton.offsetWidth){
                        //document.documentElement.clientWidth 屏幕的可视宽度
                        left = document.documentElement.clientWidth - this.$refs.callButton.offsetWidth;
                    }

                    if (top <= 0) {
                        top = 0;
                    } else if (top >= document.documentElement.clientHeight - this.$refs.callButton.offsetHeight){
                        // document.documentElement.clientHeight 屏幕的可视高度
                        top = document.documentElement.clientHeight - this.$refs.callButton.offsetHeight

                    }
                    this.$refs.callButton.style.left = left +'px'
                    this.$refs.callButton.style.top = top + "px"
                }


            },
            /**
             * @lastEditor hexinting
             * @lastDate 2020-11-16
             * @description 松开鼠标按钮事件
             */
            mouseUpHandleelse (event) {
                console.log('---松开鼠标按钮---')
                window.onmousemove = null
                event.currentTarget.style.cursor = 'move'
                // bug8432 author:hexinting date:2020-11-16
                document.onselectstart = function () {
                    return true; // 可选择网页中的文字
                };
            },
        }
    }
</script>

<style scoped>
  .drag-call-btn {
    width: 60px;
    height: 60px;
    position: fixed;
    z-index: 99999;
    bottom: 100px;
    right: 100px;
    background-image: url('/static/img/phoneIcon.png');
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
