<template>
    <div class="revampSeats_wrap" v-if="revampSeats_wrap_flag" >

       <div class="revampSeats_content">

          <h5 class="revampSeats_content_title" >
            <span>当前坐席号码</span>
            <img @click="closeSeats" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABLUlEQVQ4T6WSMU8CQRCF3cTEypJSGhN6DQ12UElhwEKEAmLHzzD+DC0tDGABodFKO6iUnhISGkpakvN7Zpcsx64UXvKyt3vzvtmbGXPwz8fInyTJPcupMaa1j0dsjpgXtCK+6ADPHDTRK4e1GATzCd8G6Bx9EZv/Bdhb9FhvYhDMGWu+YP1GDQDTDeAvCOZjay6xjlAd81yeLUAIgvmQ8yEqow9rXrqb7wDSEPYCXKM3dEvmlV+jICAF0baPapjXvjn4C9asrCqqMuuJdidUAxVM5kubWVmj3Ul3Qa3qoiJ6R1e6NoWMttifgyyGDiqgT1TxCxaDuEnUeMp8hsbWvGmVK1wI4gAaDmWeoCqZZ+lqByBPxLUdQFc+Qncaz5jZgzzyviD2IToH+yDu+w8mkIMR4m9tqgAAAABJRU5ErkJggg==" alt="">
          </h5>

          <div class="content" >
            <input v-model="seatsVal" type="text" >
            <button @click="upDataSeats" >修改坐席</button>
          </div>

       </div>

    </div>
</template>

<script>
  import url from '@/mock/modules/url'

  export default {
    name: 'revampSeats',
    data () {
      return {
        seatsVal: '',
        revampSeats_wrap_flag: false,
		alldata:''
      }
    },
    methods: {
      closeSeats () {
        this.revampSeats_wrap_flag = false
      },
      upDataSeats () {
        localStorage.seatsPhone = this.seatsVal
        this.revampSeats_wrap_flag = false
        this.$emit('upDataSeatsx', this.seatsVal)
        this.$http({
          url: this.$http.adornUrl(url.savePhone.url),
			method: url.savePhone.method,
			data: this.$http.adornData({
				phone: this.seatsVal
		    },true,'x'),
			headers: {
			  'Content-Type': 'application/x-www-form-urlencoded'
			}
        }).then((res) => {
           if(res.data.code === 0){
              // console.log(res)
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      upState (data) {
        this.revampSeats_wrap_flag = true
        this.seatsVal = data
      }
    },
    mounted () {
		
    }
  }
</script>

<style scoped>
.revampSeats_wrap{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 9999999999;
  background: rgba(0,0,0,.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.revampSeats_content{
  width: 350px;
  height: 115px;
  background: #fff;
  border-radius: 5px;
  overflow: hidden;
}
.revampSeats_content_title{
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: #00A9F2;
  color: #fff;
  font-size: 17px;
  margin: 0;
}
.revampSeats_content_title>img{
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
}
.content{
  width: 100%;
  height: 78px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
}
.content>input{
  margin-right: 9px;
  width: 80%;
  outline: none;
  border: 0px;
  height: 30px;
  border: 1px solid #ccc;
  padding-left: 10px;
}
.content>button{
  outline: none;
  border: 0px;
  border: 1px solid #00A9F2;
  background: #00A9F2;
  font-size: 12px;
  color: #fff;
  white-space: nowrap;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

</style>
