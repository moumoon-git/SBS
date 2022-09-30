<template>
  <div
    class="resoureteam-table-wrap"
    style="padding: 3px; height: 630px; margin-top: 20px; margin: 0px"
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
      <el-table-column
        prop="name"
        label="摄像头名称"
        align="center"
      ></el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">{{
          scope.row.type == 0
            ? "人的摄像头"
            : scope.row.type == 1
            ? "车的摄像头"
            : scope.row.type == 2
            ? "预览的摄像头"
            : ""
        }}</template>
      </el-table-column>
      <el-table-column
        prop="codeNum"
        label="摄像头编码"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">{{
          scope.row.status == 1 ? "启用" : scope.row.status == 2 ? "禁用" : ""
        }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <div
            v-if="scope.row.isView"
            @click="videoPreview(scope.row, scope.$index)"
            class="videoPreview"
            style="cursor: pointer"
          >
            预览
          </div>
          <div
            v-if="!scope.row.isView"
            @click="videoPreview(scope.row, scope.$index)"
            class="videoPreview"
            style="cursor: pointer"
          >
            取消预览
          </div>
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
      Appkey: "",
      isView: true,
      codeNum: "",
    };
  },
  mounted() {
    this.initData();
    this.handlePreview();
  },
  methods: {
    //多选
    handleSelectionChange(val) {
      // console.log(val);
      this.$emit("handleSelectionChange", val);
    },
    handlePreview() {
      var socket = new WebSocket(window.SITE_CONFIG["websocket_phone"]);
      socket.onmessage = (evt) => {
        var receiveMessage = JSON.parse(evt.data);
        var messageData = JSON.parse(receiveMessage.data);
        let index = this.rowIndex;
        if (receiveMessage.type == "StopRealPlay" && receiveMessage.code == 0) {
          this.codeNum = messageData.devNum;
          console.log("WebSocket接收到服务端的数据：", this.codeNum);
          this.$emit("refrehStatus", this.codeNum, true);
        } else if (
          receiveMessage.type == "StartRealPlay" &&
          receiveMessage.code == 0
        ) {
          console.log("WebSocket接收到服务端的数据：", this.codeNum);
          this.codeNum = messageData.devNum;
          this.$emit("refrehStatus", this.codeNum, false);
        }
      };
    },
    videoPreview(row, index) {
      // this.isView = !this.isView;
      this.rowIndex = index;
      var type = "";
      if (row.isView) {
        type = "StartRealPlay";
        this.isView = false;
      } else {
        type = "StopRealPlay";
        this.isView = true;
      }
      // bus.$emit("getSign", row);
      // var ws = new WebSocket("ws://192.168.3.28:9529");
      var ws = new WebSocket(window.SITE_CONFIG["websocket_phone"]);
      // var ws = new WebSocket(window.SITE_CONFIG["websocket"]);
      var sendMsg = {
        type: type,
        phone: row.codeNum,
      };
      console.log("发送data", sendMsg, "json", JSON.stringify(sendMsg));
      // this.$emit("refrehStatus", row.codeNum, this.isView);
      ws.onopen = function () {
        ws.send(JSON.stringify(sendMsg));
        console.log("WebSocket发送的内容：", sendMsg);
        console.log("WebSocket地址：", ws);
      };
      ws.onmessage = (evt) => {
        console.log("WebSocket接收到的数据：", evt);
        var previewMessage = JSON.parse(evt.data);
        if (previewMessage.code == 0) {
          // console.log("WebSocket接收到的数据：", previewMessage);
          // this.cameraData[index].isView = !row.isView;
          // this.$set(this.cameraData, index, this.cameraData[index]);
          this.$emit("refrehStatus", row.codeNum, this.isView);
          ws.close();
        }
      };
      ws.onerror = function (evt) {
        console.log("WebSocket错误信息：", evt);
      };
      // ws.close();
    },
    initData() {
      this.$http({
        url: this.$http.adornUrl("/risk/riskcamera/getEncryptionInfor"),
        method: "get",
      }).then((res) => {
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
    },
  },
  created() {
    bus.$on("confirmEdit", () => {
      // 第一个参数是需要生成截图的元素,第二个是自己需要配置的参数,宽高等
      html2canvas(this.$refs.imageTofile, {
        backgroundColor: null,
        useCORS: true, // 如果截图的内容里有图片,可能会有跨域的情况,加上这个参数,解决文件跨域问题
      }).then((canvas) => {
        let url = canvas.toDataURL("image/png");
      });
    });

    //获取签名认证
    bus.$on("getSign", (obj) => {
      // console.log('obj: ', obj.indexCode);

      this.$http({
        url: this.$http.adornUrl("/risk/riskcamera/getEncryptionProtocol"),
        method: "get",
      }).then((res) => {
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
            //如果初始化传了WndCont值 这里也需要传 如demo中设置了WndCont:1  这里也要传WndCont:1  如

            果使用默认四窗口则可以不传;

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
        needDownload: true,
      });
    });
  },
};
</script>

<style lang="scss" scoped>
.videoPreview {
  cursor: pointer;
}
</style>

