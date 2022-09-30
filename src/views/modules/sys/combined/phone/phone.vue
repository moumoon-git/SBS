<template>
    <div>
        <div class="wrap">
<!--          树形架构显示-->
          <div class="left">
            <phone_tree></phone_tree>
          </div>
<!--          联系人显示-->
          <div class="right" style="overflow: hidden">
            <humanList></humanList>
          </div>
        </div>
    </div>
</template>

<script>
  import phone_tree from './phone_tree'
  import humanList from './humanList'
  export default {
    name: 'phone',
    data () {
      return {

      }
    },
    methods: {
      styleS () {
        let div = document.getElementById('pane-sys/combined/index').children
        // console.log(div[0].children[0])
        div[0].children[0].className = 'combined'
      }
    },
    mounted () {
      //this.styleS()
    },
    components: {
      phone_tree,
      humanList
    }
  }
</script>

<style scoped>
.wrap{
  width: 100%;
  display: flex;
}
.left{
  height: 770px;
  min-width: 250px;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0);
  background-color: #ffffff;
  box-sizing: border-box;
  padding-top: 10px;
}
.right{
  width: 100%;
  height: 770px;
  margin-left: 10px;
  background: #fff;
  border-left: 1px solid #e2e2e2;
  border-right: 1px solid #e2e2e2;
}

</style>
