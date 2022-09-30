<template>
  <div class="contair">
    <el-input
      size="medium"
      v-model="state"
      style="width:300px;float: left;"
      placeholder="请输入摄像头名称搜索"
      @input="searchcontacts(state)"
      @keyup.delete.native="showSearch"
    >
    </el-input>
    <ul class="searchList" v-if="searchState">
      <li v-for="(item,index) in searchData" :key="item.id" @click="playVideo(searchData,index)">
        {{item.name}}
      </li>

    </ul>


<!--    <el-autocomplete-->
<!--      v-model="state"-->
<!--      :fetch-suggestions="querySearchAsync"-->
<!--      placeholder="搜索联系人"-->
<!--      @select="handleSelect"-->
<!--    >-->
<!--      <template slot-scope="{ item  }">-->
<!--        <div class="name">{{ item .name}}</div>-->
<!--      </template>-->
<!--    </el-autocomplete>-->
    
  </div>
</template>

<script>
import bus from "../../../common/js/eventBus";
export default {
  props: ['documenttoken', 'uploadfilesname', 'fileList', 'filename','modifiedUserList'],
  data () {
    return {
      // 联系人搜索
      contactsearch: '',
      fullscreenLoading: false,
      restaurants: [],
      state: '',
      timeout: null,
      searchData:[],
      searchState:false
    }
  },
  methods: {
    // openFullScreen() {
    //   this.fullscreenLoading = true;
    // },
    querySearchAsync (queryString, cb) {
      // console.log(queryString)
      if (queryString != '') {
        this.$http({
          url: this.$http.adornUrl(`/mail/mailcontactor/listOld`),
          method: 'POST',
          params: this.$http.adornParams({
            search: queryString
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
              //  console.log(data.data)
              this.restaurants = data.data.list
              // console.log(this.restaurants)
              // console.log(this.state)
              cb(this.restaurants)
          } else {
            this.$message.error(data.msg)
          }
        })
      } else {
        cb(null)
      }
    },
    createStateFilter (queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 搜索事件回调
    searchcontacts () {
      this.searchState = true
      this.$http({
          url: this.$http.adornUrl("/risk/riskcamera/getList?platfirmId=27&token=7396d88fee58f41f658fd8a1aab577db&key="+this.state),
          method: "get",
        }).then(({ data }) => {
          // console.log(data)
          if(data.data.length == 0){
            this.searchData = [{name:"暂无数据"}]
          }else{
            this.searchData = data.data
          }
            // console.log(this.searchData)
        })
    },
    handleSelect (item) {
      this.state = item.name
      this.searchcontacts()
      // console.log(item)
    },
    // 上传时的钩子
    beforeUploadFile (event, file, fileList) {
      this.fullscreenLoading = true
      this.$emit('beforeUploadFile', event, file, fileList)
    },
    // 上传成功的回调
    handleAvatarSuccess (response, file, fileList) {
      this.fullscreenLoading = false
      this.$emit('handleAvatarSuccess', response, file, fileList)
    },
    // 上传失败的回调
    handleError () {
      this.$emit('handleError')
    },
    // 新增
    newcontactsHandle () {
      this.$emit('addNewResoureteam')
    },
    // 导出模板
    downloadtemplate () {
      this.$emit('downloadtemplate')
    },
    
    // 导出数据
    exportExcel () {
      this.$emit('exportExcel')
    },
    exportExcelAll () {
      let httpaddress = window.SITE_CONFIG.baseUrl
      let token = document.cookie
      window.location.href = `${httpaddress}//resoure/resoureteam/xlsOutput?checkedIds=&token=${this.$cookie.get('token')}`
    },
    // 批量删除
    batchDelete () {
      this.$emit('batchDelete')
    },
    showSearch(){
      // console.log(this.modifiedUserList)
      if(!this.state){
        this.searchState = false
      }
    },
    playVideo(searchData,idx){
      // alert(this.modifiedUserList)
        this.modifiedUserList[0].children.map((v,i)=>{
          this.modifiedUserList[0].children[i].children.map((item,j)=>{
            // console.log(item)
            if(item.children[j].townName == searchData[idx].name){
               bus.$emit('getSign',item.children[j])
            }
          })
        })
      // console.log(item[idx].name)
      if(item.length != 1){
        
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// .headerboxright{
//   position: absolute;
//   right: -35%;
// }
.el-button--primary {
  width: 88px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(211, 215, 219, 1);
  border-radius: 2px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(163, 163, 163, 1);
  text-align: center;
}
.el-button--danger {
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(211, 215, 219, 1);
  border-radius: 2px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(163, 163, 163, 1);
}
.el-button--success {
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(211, 215, 219, 1);
  border-radius: 2px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(163, 163, 163, 1);
}

  .searchList{
    width: 300px;
    position:absolute;
    top:8%;
    left:3%;
    list-style:none;
    line-height:22px;
    z-index:1;
    height:210px;
    overflow:auto;
    background-color: #ffffff;
    border: 1px solid #ccc;
    padding: 0.5vh 0.5vw;
    border-radius: 5px;
    &::-webkit-scrollbar {
      width: 0 !important;
    }
  }
</style>
