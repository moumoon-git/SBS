<template>
  <div
    class="resoureteam-table-wrap"
    style="padding:3px;height:690px;margin-top:20px;margin: 0px;"
    ref="imageTofile"
  >
    <!-- <input type="submit" class="submit" value="视频预览播放" @click="getSign"/> -->
    <!-- <el-button class="submit"
          type="success"
          size="small"
          @click="getSign()"
          >视频预览播放</el-button
    > -->
    <input type="hidden" name="config" id="config" value="ReqType:PlayReal;wndcount:1" />
    <!-- 添加预览控件（需要先在windows下注册） -->
    <object
      classid="CLSID:7E393848-7238-4CE3-82EE-44AF444B240A"
      id="PlayViewOCX"
      wmode="opaque"
      width="0"
      height="0"
      name="PlayViewOCX"
      style="z-index:-999;zoom:-999"
    ></object>
  </div>
</template>


<script>
// import html2canvas from "html2canvas";
import bus from "../../../common/js/eventBus";
// import client from 'artemis-header-sign';
// import kscreenshot from 'kscreenshot'
export default {
  props: ["dataList"],
  //表格内容
  data() {
    return {};
  },
  mounted() {
    this.preview();
  },
  methods: {
    preview() {
      //延迟初始化
      setTimeout(()=> {
        this.init();
      }, 50); //这里设置延迟是为了正确加载OCX(取决于电脑性能,具体数值请根据实际情况设定,通常不需要修改 直接调用init()是可行的)
      setTimeout(()=>{
        $("#PlayViewOCX").css({
          width: "100%",
          height: "100%"
        });
      }, 500); //这里设置延迟(数值请根据实际情况来)是防止快速刷新页面导致进程残留  具体清楚进程方式请参考<关闭进程 云台控制>demo中的代码

      //初始化
    },
    init() {
      var OCXobj = document.getElementById("PlayViewOCX");
      var txtInit = $("#config").val();
      OCXobj.ContainOCX_Init(txtInit);
      a;
    },
    play_ocx_do(param) {
      if (
        "null" == param ||
        "" == param ||
        null == param ||
        "undefined" == typeof param
      ) {
        return;
      } else {
        var OCXobj = document.getElementById("PlayViewOCX");
        OCXobj.ContainOCX_Do(param);
      }
    }
  },
  created(){
     bus.$on('confirmEdit', () => {
      // 第一个参数是需要生成截图的元素,第二个是自己需要配置的参数,宽高等
      // html2canvas(this.$refs.imageTofile, {
      //   backgroundColor: null,
      //   useCORS: true // 如果截图的内容里有图片,可能会有跨域的情况,加上这个参数,解决文件跨域问题
      // }).then(canvas => {
      //   let url = canvas.toDataURL("image/png");
      //   // this.$store.htmlUrl = url;
      //   // alert(this.$store.htmlUrl)
      //   // 把生成的base64位图片上传到服务器,生成在线图片地址
      // });
      // const c = document.getElementById("myCanvas");

      // const cxt = c.getContext("2d");

      // const video = document.querySelector("object");

      // cxt.drawImage(video, 0, 0, 425, 720);

      // this.downLoad(this.saveAsPNG(c));
    })

    //获取签名认证
     bus.$on('getSign', () => {
      //  var signHeader = client(appKey, secret).signHeader;
      //  var header = signHeader(url, urlParams, method, headers, params, data);
      //  var signHeader = client('23967750', 'BZcz3VlqL1DVhWeF1boE').signHeader;
      //  axios.get('https://open8200.hikvision.com/api/artemis/v1/agreementService/securityParam/appKey/26135724 ' /* appkey 被替换 */, {
      //       headers: signHeader('https://open8200.hikvision.com/api/artemis/v1/agreementService/securityParam/appKey/{appKey}',
      //               {
      //                   appKey: '26135724',
      //                   appSecret:'DQCHl2JZTqqYUBKpP4z9'
      //               },
      //               'get', null, null, null)
   this.$http({
     url: 'http://scg.chinaemt.com/artemis/',
        method: "get"
    }).then((res)=>{
      if (res && res.code === 0) {
              //  console.log(res)
        var result = res.data
  
        var param =
          "ReqType:" +
          "PlayReal" +
          ";" +
          "SvrIp:" +
          "open8200.hikvision.com" +
          ";" +
          "WndCount: 1" +
          ";" +
          "SvrPort:" +
          443 +
          ";" +
          "Appkey:" +
          26135724 +
          ";" +
          "AppSecret:" +
          result.data.appSecret +
          ";" +
          "time:" +
          result.data.time +
          ";" +
          "timesecret:" +
          result.data.timeSecret +
          ";" +
          "httpsflag:" +
          1 +
          ";" +
          "CamList:" +
          "00000000001310013707" +
          ";";
        //如果初始化传了WndCont值 这里也需要传 如demo中设置了WndCont:1  这里也要传WndCont:1  如果使用默认四窗口则可以不传

        this.play_ocx_do(param);
          } else {
            this.$message.error(res.msg)
          }
        
      });
    })

    
    
  },

};
</script>

<style lang="scss" scoped>
</style>

