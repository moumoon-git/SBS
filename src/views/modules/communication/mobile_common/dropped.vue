<template>
    <div class="bgrs" v-if="seleConfirmsFlag">
        <div class="content_wrap" >
          <div class="content">
             <h2><span>提示</span><img @click="cancels" src="../../../../assets/img/close.png" alt=""></h2>
             <div class="selet_wrap">
               <div class="ts">
                  要选择值班日志进行关联吗？
               </div>
               <div class="selet">
                 <button @click="confirms">选择</button>
                 <button @click="cancels" >取消</button>
               </div>
             </div>
          </div>
        </div>
    </div>
</template>

<script>
  import Bus from '@/utils/bus'
  export default {
    name: 'dropped',
    data () {
      return {
        seleConfirmsFlag: false
      }
    },
    mounted () {
      var that = this
      Bus.$off('seleConfirms')
      Bus.$on('seleConfirms', (data) => {
        that.seleConfirmsFlag = data
      })
    },
    methods: {
      confirms () {
      //  确定
        this.seleConfirmsFlag = false
        //选择关联日志
        Bus.$emit('dutylogoperationsAddOrUpdate', '')
      },
      cancels () {
      //  取消
        this.seleConfirmsFlag = false
      }
    }

  }
</script>

<style scoped lang="less">
.bgrs{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0,0,0,.5);
  z-index: 2002;
}
.content_wrap{
  position: relative;
  width: 100%;
  height: 100vh;
}
.content{
 position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 500px;
  height: 160px;
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  h2{
    margin: 0;
    padding: 10px ;
    background: #0e8ebe;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

}

.selet_wrap{
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}
.ts{
  margin-top: 20px;
  font-size: 20px;
}
.selet{
  margin-top: 20px;
  button{
    width: 100px;
    outline: none;
    background: #0e8ebe;
    border: none ;
    padding: 5px 0;
    color: #fff;
    border-radius: 5px;
  }
  button:nth-child(1){
    margin-right: 50px;
  }
}








</style>
