<template>
  <div
    class="resoureteam-table-wrap"
    style="padding:3px;height:630px;margin-top:20px;margin: 0px;"
    ref="imageTofile"
  >
    <el-table
      :data="cameraData"
      style="width: 100%"
      max-height="630"
      @selection-change="handleSelectionChange"
    >
      >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="摄像头名称" align="center"></el-table-column>
      <el-table-column label="类型" align="center">
        <template
          slot-scope="scope"
        >{{scope.row.cameraType == 0?'人的摄像头':(scope.row.cameraType == 1?'车的摄像头':(scope.row.cameraType == 2?'预览的摄像头':""))}}</template>
      </el-table-column>
      <el-table-column prop="indexCode" label="摄像头编码" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">{{scope.row.status == 1?'启用':(scope.row.status == 2?'禁用':"")}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <div @click="videoPreview(scope.row)" class="videoPreview" style="cursor: pointer;">预览</div>
        </template>
      </el-table-column>
    </el-table>
    <iframe width="0" height="0" id="url"></iframe>
  </div>
</template>


<script>
// import html2canvas from "html2canvas";
import bus from "../../../common/js/eventBus";
// import client from 'artemis-header-sign';
// import kscreenshot from "kscreenshot";
//  new kscreenshot({
//         key: 65,
//         needDownload: true
//       });
export default {
  props: ["cameraData"],
  //表格内容
  data() {
    return {
      SvrIp: "",
      SvrPort: "",
      Appkey: ""
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    //多选
    handleSelectionChange(val) {
      // console.log(val);
      this.$emit("handleSelectionChange", val);
    },
    videoPreview(row) {
      bus.$emit("getSign", row);
    },
    initData() {
      this.$http({
        url: this.$http.adornUrl("/risk/riskcamera/getEncryptionInfor"),
        method: "get"
      }).then(res => {
        console.log("dhaskjhdkashdjkashdjka", res);
        if (res && res.data.code == 0) {
          let msg = res.data.msg;
          if (msg) {
            this.SvrIp = msg.hostPortUrl.substring(
              0,
              msg.hostPortUrl.lastIndexOf(":")
            );
            this.SvrPort = msg.hostPortUrl.substring(
              msg.hostPortUrl.lastIndexOf(":") + 1
            );
            this.Appkey = msg.key;
          }
        }
      });
    }
  },
  created() {
    bus.$on("confirmEdit", () => {
      // 第一个参数是需要生成截图的元素,第二个是自己需要配置的参数,宽高等
      html2canvas(this.$refs.imageTofile, {
        backgroundColor: null,
        useCORS: true // 如果截图的内容里有图片,可能会有跨域的情况,加上这个参数,解决文件跨域问题
      }).then(canvas => {
        let url = canvas.toDataURL("image/png");
      });
    });

    //获取签名认证
    bus.$on("getSign", obj => {
      // console.log('obj: ', obj.indexCode);

      this.$http({
        url: this.$http.adornUrl("/risk/riskcamera/getEncryptionProtocol"),
        method: "get"
      }).then(res => {
        // console.log('dhaskjhdkashdjkashdjka',res.data.code == 0)
        if (res && res.data.code == 0) {
          if (res.data != "") {
            // console.log(res);
            var result = res.data;

            var param =
              "hikvideoclient://ReqType:" +
              "PlayReal" +
              ";" +
              "VersionTag:artemis" +
              ";" +
              "SvrIp:" +
              this.SvrIp +
              ";" +
              "SvrPort:" +
              this.SvrPort +
              ";" +
              "Appkey:" +
              this.Appkey +
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
              obj.indexCode +
              ";";
            //如果初始化传了WndCont值 这里也需要传 如demo中设置了WndCont:1  这里也要传WndCont:1  如果使用默认四窗口则可以不传

            // this.play_ocx_do(param);
            // console.log(param)
            document.getElementById("url").src = param;
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    });

    bus.$on("snap", () => {
      new kscreenshot({
        key: 65,
        needDownload: true
      });
    });
  }
};
</script>

<style lang="scss" scoped>
.videoPreview {
  cursor: pointer;
}
</style>

