<template>
    <div class="resolution_wrap" v-if="flag" >
        <div class="resolution_content">

          <div class="header">
            <span>拆分传真</span>
            <img @click="closeFlag" src="/static/img/Communihistory/close.png" alt="">
          </div>

          <div class="content">

            <!--左右两栏的布局-->
            <div class="resolution_content_left">
              <div class="resolution_content_left_top">
                <div class="resolution_content_left_top_top" >
                  <div class="romve" @click="tabRawFax(rawFaxPath)" ></div>
                  <iframe :src="rawFaxPath"  width="100%" height="100%" v-if="rawFaxPath!=''"
                          frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"
                  ></iframe>
                  <div v-else style="
                width: 100%;height: 100%;
                background: url('/static/img/faxBack.png') center no-repeat;
                background-size: 220px;">
                  </div>
                </div>
                <div class="resolution_content_left_top_top_bottom">
                  <span v-if="btnFlag">原传真（共{{totalpage}}页）</span>
                  <span v-else class="spanActive" @click="downloadFax" >下载拆分后传真</span>
                </div>
              </div>

              <div class="resolution_content_left_content">
                <el-scrollbar style="height: 100%">
                  <div class="left_mainContent" >

                    <ul class="left_mainContent_ul" >

                      <li v-for="(item,index) in pageFax" :key="index" >
                        <span>{{index+1}}</span>
                        <!--selectActive notSelect liActive-->
                        <div :class="item.type==0?'':item.type==1?'liActive':item.type==2?'notSelect':'selectActive'" >
                          <div class="selectIcon" @click="typeSelectFax(item)"  ></div>
                          <div class="romve"  @click="tabRawFax(item.src)" ></div>
                          <iframe :src="item.src"  width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>
                        </div>
                      </li>

                    </ul>

                  </div>
                </el-scrollbar>
              </div>

              <div class="resolution_content_left_bottom">
                <el-button type="primary" v-if="btnFlag" @click="confirm" >确定</el-button>
                <el-button type="primary" v-if="!btnFlag" @click="cancel" >撤销</el-button>
              </div>
            </div>

            <div class="resolution_content_right">
              <iframe :src="mianContentFaxPath" id="fpxIframe" width="100%" height="100%" v-if="mianContentFaxPath!=''"
                      frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"
              ></iframe>
              <div v-else style="
              width: 100%;height: 100%;
              background: url('/static/img/faxBack.png') center no-repeat;
              background-size: 220px;">
              </div>
            </div>

          </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "resolution",
        data () {
            return{
              totalpage: '',  //传真页数
                flag:false,//控制显示
                mianContentFaxPath:'',//主的传真
                rawFaxPath:'', //渲染到页面的值
                oldFaxPath:'', //老值
                newRawFaxPath:'',//新值
                btnFlag:true, //按钮的锁
                pageFax:[],  //分页之后的数据
                oldpageFax:[],
                newpageFax:[],
            }
        },
        methods:{
          tabRawFax (src) {
              this.mianContentFaxPath = src
          },
          //  下载拆分后的传真
          downloadFax () {
              let filename = this.newRawFaxPath.substr(this.newRawFaxPath.lastIndexOf('/')+1,);//72c0d9d068b34cbabe812ea171f0bf94.pdf
              let  download= `${window.g.ApiUrl}/eos/communication/pdf/download?filename=${filename}`;
              window.location.href=download
          },
          //确定
          confirm () {
              if (this.pageFax.length!=0) {
                  let arr = []
                  this.pageFax.forEach(ele=>{
                      if (ele.type == 3) {
                          arr.push(ele)
                      }
                  })
                  console.log(arr)
                  this.faxmergePdf(arr)
              }
          },
          //撤销
          cancel () {
              this.btnFlag = true
              this.pageFax = this.oldpageFax
              this.rawFaxPath = this.oldFaxPath
          },
          //合并传真
          faxmergePdf (arr) {
              if (arr.length!=0) {
                  let names = []
                  arr.forEach(ele=>{
                      names.push(ele.name)
                  })
                  let data = {
                      names,
                      isDownload:true
                  }
                  this.$api.faxmergePdf(data).then((res) => {
                      this.$message({
                          message: '拆分成功',
                          type: 'success'
                      });
                      if (res.data) {
                          this.newRawFaxPath = window.g.ApiUrl+'/fax/'+res.data
                          this.rawFaxPath = this.newRawFaxPath
                          this.mianContentFaxPath = this.newRawFaxPath
                          this.btnFlag = false
                          this.splitPdf(res.data,0,'newpageFax')
                      }
                  })
              }

          },
          //拆分传真
          splitPdf (fileName,type,str) {
              let data = {
                  fileName,
                  isSingle:true
              }
              this.$api.splitPdf(data).then((res) => {
                  if (res.data){
                      if (res.data.length!=0){
                          let arr = []
                          res.data.forEach(ele=>{
                              let obj = {
                                  name:ele,
                                  src: window.g.ApiUrl +'/fax/'+ ele,
                                  type
                              }
                              arr.push(obj)
                          })
                          this.pageFax = arr
                          this[str] = arr
                      }
                  }
              })
          },
          //根据拆分状态显示不同样式
          typeSelectFax (item) {
              if (this.btnFlag) {
                  if (item.type == 2) {
                      item.type = 3
                  }else{
                      item.type = 2
                  }
              }else{
                  this.pageFax.forEach(ele=>{
                      ele.type = 0
                  })
                  item.type = 1
              }
          },
          // 关闭
          closeFlag(){
            this.flag = false
            this.$emit('closeFlag')
          }
        },
        created() {

        },
        watch:{
            oldFaxPath:function (newVale) {
              console.log('newVale: ', newVale);
                if (newVale) {
                    let fileName = this.oldFaxPath.substr(this.oldFaxPath.lastIndexOf('/')+1,);//72c0d9d068b34cbabe812ea171f0bf94.pdf
                    this.splitPdf(fileName,'2','oldpageFax')
                }
            }
        }
    }
</script>

<style scoped>
.resolution_wrap{
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background: rgba(0,0,0,.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.resolution_content{
  width:873px;
  height:815px;
  background:rgba(255,255,255,1);
  box-shadow:0px 0px 21px 3px rgba(0,0,0,0.27);
  border-radius:7px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.header{
  width:873px;
  height:56px;
  background:rgba(241,244,246,1);
  border-radius:7px 7px 0px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size:18px;
  padding: 0 14px 0 32px;
  box-sizing: border-box;
}
.header>img{
  cursor: pointer;
}
.content{
  display: flex;
  flex: 1;
}
.resolution_content_left{
  width:197px;
  display: flex;
  flex-direction: column;
}
.resolution_content_left_top{
  height:242px;
  background:rgba(0,0,0,0.04);
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}
.resolution_content_left_top_top{
  margin: auto;
  width: 140px;
  height: 200px;
  flex: 1;
  position: relative;
}
.romve{
  position: absolute;
  z-index: 999;
  height: 100%;
  width: 90%;
  background: transparent;
  top: 0;
  left: 0;
}

.resolution_content_left_top_top_bottom{
  font-size:17px;
  font-weight:400;
  text-align: center;
  margin: 10px 0;
}
.resolution_content_left_top_top_bottom>.spanActive{
  color:rgba(0,145,255,1);
  cursor: pointer;
}
.resolution_content_left_content{
  flex: 1;
  height: 435px;
  background: rgba(0,0,0,.04);
}
.resolution_content_left_bottom{
  height:70px;
  background:rgba(249,252,255,1);
  border-radius:0px 0px 0px 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.resolution_content_right{
  flex: 1;
  padding: 4.5%;
  box-sizing: border-box;
}
.left_mainContent_ul{
  list-style: none;
  padding: 0;
  margin: 0;
  padding-top: 14px;
}
.left_mainContent_ul>li{
  margin: 14px 0;
  padding: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.left_mainContent_ul>li>div{
  margin-left: 20px;
  width:140px;
  cursor: pointer;
  position: relative;
}
.selectActive{
  border:1px solid rgba(0,145,255,1);
}
.selectIcon{
  content: '';
  position: absolute;
  top: -13px;
  right: -13px;
  width: 27px;
  height: 27px;
  z-index: 999;
  display: none;
}
.selectActive>.selectIcon{
  background: url("/static/img/Communihistory/selectActive.png")no-repeat;
  background-size: 100% 100%;
  display: block;
}
.notSelect{
  border:1px solid rgba(0,145,255,1);
}
.notSelect>.selectIcon{
  background: url("/static/img/Communihistory/notSelect.png")no-repeat;
  background-size: 100% 100%;
  display: block;
}
.liActive{
  border:1px solid rgba(0,145,255,1);
}

</style>
