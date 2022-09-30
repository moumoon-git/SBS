export default {
  data(){
    return{
      date: '',   //当天日期
    }
  },
  methods:{
    handleNum(num){
      let str = num
      let len1 = str.substr(0, 1)
      let len2 = str.substr(1, 1)
      let len3 = str.substr(-1, 1)
      //如果第一位是0，第二位不是点，就用数字把点替换掉
      if (str.length > 1 && len1 == 0 && len2 != ".") {
        str = str.substr(1, 1)
      }
      //第一位不能是.
      if (len1 == ".") {
        str = ""
      }
      return str.match(/\d+(\.\d{0,2})?/) ? str.match(/\d+(\.\d{0,2})?/)[0] : ''
    },
  }
}
