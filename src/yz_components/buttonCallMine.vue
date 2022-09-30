<template>
  <div class="miniCallBox" ref="miniCallBox"  @mousedown="mouseDownHandleelse($event)" @mouseup="mouseUpHandleelse($event)">
    <div   v-if="isCallType=='callIng'">
      <div @dblclick="toBig"  class="buttonCallIngBox" :class="isCallPhone=='talking'?(basicsData.important!='leader'?'tonhua':'tonhuaLeader'):isCallPhone=='hangUp' ?'guaduan':''">
        <div style="padding: 95px 20px 5px 20px; color: #ddd;font-weight: 400;font-size: 14px;">
          {{isCallPhone=='call'?'来电中...':isCallPhone=='talking'?this.timer:this.timer}}</div>
        <div style="font-weight: 500;color: rgba(255,255,255,1);font-size: 17px;width: 80px;overflow: hidden;white-space: nowrap;text-overflow:ellipsis;padding: 0px 20px 5px 20px; "
         :title="basicsData.name"
        >{{basicsData.name}}</div>
      </div>
    </div>
    <div  v-if="isCallType=='callOut'">
      <div @dblclick="toBig" class="buttonCallOutBox" :class="isCallPhone=='talking'?(basicsData.important!='leader'?'tonhua':'tonhuaLeader'):isCallPhone=='hangUp' ?'guaduan':''">
        <div style="padding: 95px 20px 5px 20px; color: #ddd;font-weight: 400;font-size: 14px;">
          {{isCallPhone=='call'?'正在呼叫...':isCallPhone=='talking'?this.timer:this.timer}}
        </div>
        <div style="font-weight: 500;color: rgba(255,255,255,1);font-size: 17px;">{{basicsData.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
    import {mapGetters} from "vuex";
    export default {
        name: "buttonCallMine",
        computed: {
            ...mapGetters({
                isCallPhone: 'getIsCallPhone' ,//电话队列的通话状态,
                isCallType:'getIsCallType' ,//呼入还是呼出
                timer:'getTimer',
            }),
        },
        data() {
            return{
                basicsData:{
                    name:'',
                    important:''
                } ,
                moveDataelse: {
                    x: null,
                    y: null
                },
            }
        },
        mounted() {
            this.getCallMsg()
        },
        methods: {
            mouseDownHandleelse (event) {
                document.onselectstart = function() {
                    return false;
                };
                this.moveDataelse.x = event.pageX - this.$refs.miniCallBox.offsetLeft
                this.moveDataelse.y = event.pageY - this.$refs.miniCallBox.offsetTop
                event.currentTarget.style.cursor = 'move'
                this.mouseMoveHandleelse(event)
            },
            mouseMoveHandleelse (event) {
                //计算出鼠标相对点击元素的位置,e.clientX获取的是鼠标的位置，OffsetLeft是元素相对于外层元素的位置
                let x = event.clientX - this.$refs.miniCallBox.offsetLeft;
                let y = event.clientY - this.$refs.miniCallBox.offsetTop;
                window.onmousemove  = (e) => {
                    // 获取拖拽元素的位置
                    let left = e.clientX - x;
                    let top = e.clientY - y;
                    //console.log(document.documentElement.clientHeight,odiv.offsetHeight)
                    // 把拖拽元素 放到 当前的位置
                    if (left <= 0) {
                        left = 0;
                    } else if (left >= document.documentElement.clientWidth - this.$refs.miniCallBox.offsetWidth){
                        //document.documentElement.clientWidth 屏幕的可视宽度
                        left = document.documentElement.clientWidth - this.$refs.miniCallBox.offsetWidth;
                    }

                    if (top <= 0) {
                        top = 0;
                    } else if (top >= document.documentElement.clientHeight - this.$refs.miniCallBox.offsetHeight){
                        // document.documentElement.clientHeight 屏幕的可视高度
                        top = document.documentElement.clientHeight - this.$refs.miniCallBox.offsetHeight

                    }
                    this.$refs.miniCallBox.style.left = left +'px'
                    this.$refs.miniCallBox.style.top = top + "px"
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
            toBig() {
                this.$store.commit('setIsDialogType','small')
            },
            getCallMsg() {
                if(this.isCallType=='callIng'){
                    let data=this.$store.getters.getUserCall
                    this.basicsData.name=data.name;
                    this.basicsData.important=data.important
                }
                if(this.isCallType=='callOut') {
                    let data=this.$store.getters.getNowSelectPhoneList
                    this.basicsData.name=data[0].content.name;
                    this.basicsData.important=data[0].content.important;
                }
            },
        },
        watch:{
            isCallPhone:{
                handler(neW,olD){
                    if(olD ==''&& neW=='call'|| olD =='hangUp'&& neW=='call' ) {
                        this.getCallMsg()
                    }
                },
                deep:true
            }
        }
    }
</script>

<style scoped>
  div:hover{
    width: auto;
  }
  .miniCallBox{
    width: 155px;
    height: 169px;
    position:absolute;
    right: 0;
    bottom: 0;
    z-index: 9999
  }
  .buttonCallIngBox{
    width: 155px;
    height: 169px;
    background-image: url("/static/img/phoneCallImg/callIng.png");
    background-repeat: no-repeat;
    background-size: 155px  169px;
    background-position: center center;
  }
  .tonhua{
    background-image: url("/static/img/phoneCallImg/callIng.png") !important;
  }
  .tonhuaLeader{
    background-image: url("/static/img/phoneCallImg/callIngLeader.png") !important;
  }
  .guadan{
    background-image: url("/static/img/phoneCallImg/callBreakX.png") !important;
  }

  .buttonCallOutBox{
    width: 155px;
    height: 169px;
    background-image: url("/static/img/phoneCallImg/callIng.png");
    background-repeat: no-repeat;
    background-size: 155px  169px;
    background-position: center center;
  }

</style>
