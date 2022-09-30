<template>
  <div style="height: 100%;">
<!--    <ul class="ul_wrap" v-show="!add" >-->
<!--      <li class="actives" >新增</li>-->
<!--    </ul>-->

    <ul class="ul_wrap" >
      <li v-if="newDate == date" class="actives"  @click="liActive" >新增</li>
      <!--        :class="item.active == '1'?'actives':''"-->
      <li
        @click="liActive(index,item)"
        v-for="(item,index) in activities" :key="index">
        {{item.createTime.split(" ")[1].split(":")[0]+':'+item.createTime.split(" ")[1].split(":")[1]}}
      </li>

      <li  @click="liActive" v-for="(item,o) in num" :key="o" class="" ></li>

    </ul>
  </div>
</template>

<script>
  import Bus from '@/utils/bus'
  export default {
    name: 'timeLine',
    data () {
      return {
        activities: [],
        add: true,
        num: 3,
        title: '',
        newDate: new Date().toLocaleDateString().replace(/\//g, '-'),
        date: new Date().toLocaleDateString().replace(/\//g, '-')
      }
    },
    mounted () {

    },
    methods: {
      init (data) {
        var that = this
        // console.log(data)
        // eslint-disable-next-line eqeqeq
        if (data.length != 0) {
          data.forEach(function (ele, index) {
            ele.active = '0'
          })
          data[0].active = '1'
        }
        // console.log(data)
        this.add = false
        setTimeout(function () {
          that.activities = data
          that.Nums(that.activities)
        })
        this.getList()
      },
      liActive (index, item) {
        var that = this
        // eslint-disable-next-line eqeqeq
        if (item) {
          Bus.$emit('timeLine', item)
          if (this.activities.length != 0) {
            for (let i = 0; i < this.activities.length; i++) {
              this.activities[i].active = '0'
            }
            item.active = '1'
          }
          this.Nums(this.activities)
        } else {
          setTimeout(function () {
            if (that.title == '新增') {
              // console.log(that.title)
              let data = {
                duty: '',
                handling: '',
                instructions: '',
                addEvent: true
              }
              Bus.$emit('timeLine', data)
            } else {
              // console.log(that.title)
              let data = {
                duty: '',
                handling: '',
                instructions: '',
                addEvent: false
              }
              Bus.$emit('timeLine', data)
            }
          }, 0)
        }
        // console.log(item, item.active, typeof (item.active))
      },
      adds () {
        this.add = true
        let liList = document.querySelectorAll('.ul_wrap')[0].children
        // console.log(liList, liList.length)
        for (let x = 0; x < liList.length; x++) {
          liList[x].className = ''
        }
        liList[0].className = 'actives'
      },
      getList () {
        var that = this
        setTimeout(function () {
          let liList = document.querySelectorAll('.ul_wrap')[0].children
          // console.log(liList, liList.length)
          for (let x = 0; x < liList.length; x++) {
            liList[x].onclick = function (e) {
              for (let i = 0; i < liList.length; i++) {
                liList[i].className = ''
              }
              this.className = 'actives'
              if (this.innerText == '新增') {
                that.title = '新增'
              } else {
                that.title = ''
              }
            }
          }
        }, 10)
      },
      oneActive () {
        setTimeout(function () {
          let liList = document.querySelectorAll('.ul_wrap')[0].children
          if (liList.length != 0) {
            for (let i = 0; i < liList.length; i++) {
              liList[i].className = ''
            }
            liList[0].className = 'actives'
          }
        }, 11)
      },
      Nums (newValue) {
        if (newValue.length >= 3) {
          this.num = 0
        } else {
          this.num = 3 - newValue.length
        }
      },
      update (data) {
        this.newDate = data
        if (this.newDate == this.date) {
          var data = {
            duty: '',
            handling: '',
            instructions: '',
            addEvent: true
          }
          Bus.$emit('timeLine', data)
          this.oneActive()
        }
      }
    },
    components: {

    }
  }
</script>

<style scoped >
  ul{
    list-style: none;
  }
  .ul_wrap{
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 70px 0;
    padding-left: 45px ;
  }
  .ul_wrap>li{
    flex: 1;
    font-size: 18px;
    font-weight: bolder;
    position: relative;
  }
  .ul_wrap>.actives:before {
    background :#409EFF;
  }
  .ul_wrap>li:before{
    content: "";
    position: absolute;
    width: 18px;
    height: 18px;
    background: #fff ;
    border: 1px solid #d7d7d7;
    border-radius: 50%;
    left: -25px;
    top: 4px;
    z-index: 333;
  }
  .ul_wrap>li:last-child:after{
    display: none;
  }
  .ul_wrap>li:after{
    content: "";
    display: block;
    height: 100%;
    width: 1px;
    background: #d7d7d7;
    position: absolute;
    left: -17px;
    top: 5px;
  }

</style>
