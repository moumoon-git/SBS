<template>
  <div class="accept-container">
   <!-- <div class="go-back" v-show="goBackState" @click="goBack">GoBack</div>-->
    <ul style="display: none">
      <li v-for="item in webAddress">
        <a :href="item.link" target="showHere" @click='showIframe' v-trigger>{{item.name}}</a>
      </li>
    </ul>

    <iframe v-show="iframeState" id="show-iframe"  frameborder=0 name="showHere" scrolling=auto src=""></iframe>

  </div>
</template>

<script>
  export default {
    name: 'hello',
    data () {
      return {
        iframeState:false,
        goBackState:false,
        webAddress: [
          {
            name:'天翼可视化对讲调度平台',
            link:'http://scg.chinaemt.com/scheduling/'
          }
        ]
      }
    },

    directives:{
      trigger:{
        inserted(el,binging){
          console.log("自动触发事件")
          el.click()
        }
      }
    },
    mounted(){
      const oIframe = document.getElementById('show-iframe');
      const deviceWidth = document.documentElement.clientWidth;
      const deviceHeight = document.documentElement.clientHeight;
      oIframe.style.width = deviceWidth + 'px';
      oIframe.style.height = deviceHeight + 'px';

    },
    methods:{
      goBack(){
        this.goBackState = false;
        this.iframeState = false;
      },
      showIframe(){
        this.goBackState = true;
        this.iframeState = true;
      }
    }
  }

</script>
<style scoped>


</style>
