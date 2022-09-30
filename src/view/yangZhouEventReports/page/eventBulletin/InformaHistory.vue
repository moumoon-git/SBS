<template>
  <div class="InformaHistory_wrap">
    <div class="InformaHistory_content_wrap">
      <!--头部-->
      <div class="header">
        <span>通信历史</span>
        <img @click="close" src="/static/img/Communihistory/close.png" alt />
      </div>

      <div class="InformaHistory_content" v-loading="historyVisiable">
        <ul class="InformaHistory_content_ul" v-if="listData.length > 0">
          <li class="InformaHistory_content_li" v-for="(item, index) in listData" :key="index">
            <div class="InformaHistory_content_li_left">
              <img src="/static/img/Communihistory/msg.png" alt v-if="item.type.code == 'sms'" />
              <img src="/static/img/Communihistory/phone.png" alt v-if="item.type.code == 'phone'" />
              <img src="/static/img/Communihistory/fax.png" alt v-if="item.type.code == 'fax'" />
              <img
                src="/static/img/Communihistory/approval.png"
                alt
                v-if="
                  item.type.code == 'h5Approval' ||
                  item.type.code == 'pcApproval'
                "
              />
              <img src="/static/img/Communihistory/emil.png" alt v-if="item.type.code == 'emil'" />
            </div>
            <div class="InformaHistory_content_li_right">
              <div
                class="InformaHistory_content_li_right_div"
                style="
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                "
              >
                {{ item.time }}
                <!-- <i
                  class="iconfont icon-shanchu"
                  style="font-size: 16px; color: #9fc8fe; cursor: pointer"
                  @click="removeRecord(item)"
                ></i>-->
              </div>
              <div class="InformaHistory_content_li_right_div" v-if="item.type.code == 'sms'">
                <span>收信人:</span>
                <div>
                  <!-- <span v-for="(el, _index) in item.list" :key="el">{{
                    el.contactor
                      ? el.contactor
                      : el.phone + (_index + 1 === item.list.length ? "" : "、")
                  }}</span>-->
                  {{item.name}}
                </div>
                <!-- <div>{{item.groupName?item.groupName.join(' '):""}}</div> -->
              </div>
              <div class="InformaHistory_content_li_right_div" v-if="item.type.code == 'fax'">
                <span>收信人:</span>
                <!-- <div
                  v-for="v in item.list"
                  :key="v.id"
                  style="display: flex; align-items: center; margin-right: 30px"
                >
                  {{ v.unit ? v.unit : v.phone
                  }}<span
                    class="cellPhoneImg"
                    @click="callPhoneAssign(v)"
                    v-if="v.phone"
                ></span>-->
                <!-- </div> -->
                {{item.name}}
              </div>
              <div class="InformaHistory_content_li_right_div" v-if="item.type.code == 'phone'">
                <span>联系人:</span>
                <div>
                  {{ item.name }}
                  <span
                    class="cellPhoneImg"
                    @click="callPhoneAssign(item)"
                    v-if="item.mobile"
                  ></span>
                </div>
              </div>
              <div class="InformaHistory_content_li_right_div" v-if="item.type.code == 'fax'">
                <span>传真件:</span>
                <el-link @click="filePreview(item.attachment)">
                  {{
                  item.attachment
                  }}
                </el-link>
                <img
                  @click="fileDownLoad(item.attachment)"
                  src="/static/audioControls/dow.png"
                  alt
                  style="
                    width: 25px;
                    height: 25px;
                    margin-left: 10px;
                    cursor: pointer;
                  "
                />
              </div>
              <div class="InformaHistory_content_li_right_div" v-if="item.type.code == 'sms'">
                <span>短信内容:</span>
                <el-tooltip class="item" effect="dark" :content="item.content" placement="top">
                  <div
                    style="
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                    "
                  >{{ item.content }}</div>
                </el-tooltip>
              </div>
              <div class="InformaHistory_content_li_right_div" v-if="item.type.code == 'phone'">
                <span>通话时长:</span>
                <div>
                  {{
                  item.seconds / 60 > 0
                  ? parseInt(item.seconds/60) +
                  "分" +
                  (item.seconds % 60) +
                  "秒"
                  : (item.seconds % 60) + "秒"
                  }}
                </div>
              </div>
              <div class="InformaHistory_content_li_right_div" v-if="item.type.code == 'phone'">
                <span>备注信息:</span>
                <div>{{ item.content ? item.content : "" }}</div>
              </div>
              <!-- <div
                class="InformaHistory_content_li_right_div"
                v-if="item.type.code == 'phone'"
              >
                <span>通话录音:</span>
                <div id="content_del" v-if="item.url">
                  <audio
                    style="display: none"
                    controls
                    :src="apiUrl + '/rec/' + item.url"
                  ></audio>
                </div>
              </div>-->

              <div
                v-if="
                  item.type.code == 'h5Approval' ||
                  item.type.code == 'pcApproval'
                "
              >
                <el-row>
                  <el-col :span="7">
                    <div class="InformaHistory_content_li_right_div">
                      <span>审定人:</span>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="item.approvalContactor"
                        placement="top"
                      >
                        <div
                          style="
                            width: 100%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                          "
                        >{{ item.approvalContactor }}</div>
                      </el-tooltip>
                    </div>
                  </el-col>
                  <el-col :span="7">
                    <div class="InformaHistory_content_li_right_div">
                      <span>审定结果:</span>
                      <div>{{ item.stateName }}</div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="InformaHistory_content_li_right_div">
                      <span>审定意见:</span>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="item.content"
                        placement="top"
                      >
                        <div
                          style="
                            width: 100%;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                          "
                        >{{ item.content }}</div>
                      </el-tooltip>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div v-if="item.type.code == 'emil'">
                <el-row>
                  <el-col :span="7">
                    <div class="InformaHistory_content_li_right_div">
                      <span>收件人:</span>
                      <div>张三</div>
                    </div>
                  </el-col>
                  <el-col :span="7">
                    <div class="InformaHistory_content_li_right_div">
                      <span>邮件名:</span>
                      <div>ABC.doc</div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </li>
        </ul>
        <div v-else class="notData">暂无数据</div>
      </div>
    </div>

    <!-- 移除记录 -->
    <el-dialog
      title="移除通讯记录"
      :close-on-click-modal="false"
      :visible.sync="removeRecordVisiable"
      width="350px"
      append-to-body
    >
      <span>是否移除通讯记录与当前传真的关联关系？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="removeRecordVisiable = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 预览传真 -->
    <!-- 全屏预览传真 -->
    <el-dialog
      :visible.sync="dialogVisible"
      fullscreen
      append-to-body
      :close-on-click-modal="false"
    >
      <iframe
        :src="allFpxPreviewPath"
        id="iframe"
        width="100%"
        height="900px"
        frameborder="no"
        border="0"
        marginwidth="0"
        marginheight="0"
        scrolling="no"
        allowtransparency="yes"
      ></iframe>
    </el-dialog>
  </div>
</template>

<script>
import audioControls from "@/../static/audioControls/audioPlugin";
export default {
  name: "InformaHistory",
  data() {
    return {
      listData: [],
      audioControls: "", // 音频的构造函数
      audioEventList: {},
      apiUrl: window.g.ApiUrl,
      removeRecordData: {}, // 当前记录ID
      removeRecordVisiable: false, // 删除记录弹窗
      allFpxPreviewPath: "",
      dialogVisible: false, // 预览传真
      historyVisiable: false,
    };
  },
  //销毁前清除实例
  beforeDestroy() {
    this.audioEventList = null;
    this.audioEventList = {};
},
  mounted() {
    // 加载录音
    setTimeout(() => {
      const _that = this;
      let getAllAudio = document.querySelectorAll("#content_del audio");
      let audioArray = Array.from(getAllAudio);
      let play = require("@/../static/audioControls/play.png"),
        stop = require("@/../static/audioControls/stop.png"),
        dow = require("@/../static/audioControls/dow.png");

      let obj = {
        play,
        stop,
        dow,
      };
      Array.from(audioArray).forEach((ele, index) => {
        let audio = new audioControls(
          ele.parentNode,
          ele.src,
          obj,
          false,
          _that
        );
        _that.audioEventList[index] = audio;
        audio.addIncident();
      });
    }, 100);
  },
  methods: {
    initData() {},
    //关闭
    close() {
      this.$emit("closeInformaHis", "");
    },
    // 预览传真文件
    filePreview(url) {
      let data = {
        filename: url,
      };
      this.$api
        .previewPdf(data)
        .then((res) => {
          if (res.errorcode == 0) {
            this.allFpxPreviewPath = window.g.ApiUrl + "/" + res.data;
            this.dialogVisible = true;
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        })
        .catch(() => {
          this.$message.error("预览失败");
        });
    },
    // 下载传真文件
    fileDownLoad(url) {
      window.open(
        `${window.g.ApiUrl}/eos/communication/pdf/download?filename=${url}` +
          `&Authorization=${
            localStorage.getItem("token") ? localStorage.getItem("token") : ""
          }`
      );
    },
    // 拨打默认电话
    callPhoneAssign(item) {
      let obj = {
        type: this.$store.state.msgHeadleData.sendType,
        typeId: this.$store.state.msgHeadleData.sendTypeId,
      };
      if (item.phone) {
        this.talkCall({ number: item.phone }, "", obj);
      } else if (item.mobile) {
        this.talkCall({ number: item.mobile }, "", obj);
      } else if (item.otherTel) {
        this.talkCall({ number: item.otherTel }, "", obj);
      } else if (item.officeTel) {
        this.talkCall({ number: item.officeTel }, "", obj);
      } else if (item.number) {
        this.talkCall({ number: item.number }, "", obj);
      } else if (item.otherTel2) {
        this.talkCall({ number: item.otherTel2 }, "", obj);
      }
    },
    audio() {
      setTimeout(() => {
        const _that = this;
        let getAllAudio = document.querySelectorAll("#content_del audio");
        let audioArray = Array.from(getAllAudio);
        let play = require("@/../static/audioControls/play.png"),
          stop = require("@/../static/audioControls/stop.png"),
          dow = require("@/../static/audioControls/dow.png");

        let obj = {
          play,
          stop,
          dow,
        };
        Array.from(audioArray).forEach((ele, index) => {
          let audio = new audioControls(
            ele.parentNode,
            ele.src,
            obj,
            false,
            _that
          );
          _that.audioEventList[index] = audio;
          audio.addIncident();
        });
      }, 100);
    },
    // 删除记录
    removeRecord(item) {
      // console.log('item: ', item);
      this.removeRecordData = item;
      this.removeRecordVisiable = true;
    },
    // 确定删除
    submit() {
      let data = {
        id: this.removeRecordData.list[0].id,
        type: this.removeRecordData.type,
      };
      this.$api
        .removeRecord(data)
        .then((res) => {
          if (res.errorcode == 0) {
            this.$message.success("移除成功");
          } else {
            this.$message({
              message: res.msg,
              type: "error",
            });
          }
        })
        .catch(() => {
          this.$message.error("移除失败");
        });
      this.removeRecordVisiable = false;
    },
  },
};
</script>

<style scoped>
.InformaHistory_wrap {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: center;
}
.InformaHistory_content_wrap {
    width: 956px;
    height: 774px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 21px 3px rgba(0, 0, 0, 0.27);
    border-radius: 7px;
}
.header {
    height: 55px;
    background: rgba(241, 244, 246, 1);
    border-radius: 7px 7px 0px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 10px 0 30px;
}
.header > img {
    cursor: pointer;
}
.InformaHistory_content {
    height: 718px;
    overflow-y: scroll;
    padding: 0 80px;
    box-sizing: border-box;
}
.InformaHistory_content_ul {
    list-style: none;
    position: relative;
}
.InformaHistory_content_ul:before {
    height: 32px;
    position: absolute;
    content: '';
    width: 1px;
    background: rgba(237, 237, 237, 1);
    z-index: 1;
    opacity: 0.65;
    top: -30px;
    left: 63px;
}
.InformaHistory_content_ul:after {
    height: 70px;
    position: absolute;
    content: '';
    width: 1px;
    background: rgba(237, 237, 237, 1);
    z-index: 1;
    opacity: 0.65;
    bottom: -56px;
    left: 63px;
}
.InformaHistory_content_ul
    > li:last-child
    > .InformaHistory_content_li_left:after {
    display: none;
}
.InformaHistory_content_li {
    margin-bottom: 55px;
    display: flex;
}
.InformaHistory_content_li_left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 20px;
    box-sizing: border-box;
    margin-right: 20px;
    position: relative;
}
.InformaHistory_content_li_left:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 1px;
    height: 100%;
    opacity: 0.65;
    background: rgba(237, 237, 237, 1);
    z-index: 1;
}
.InformaHistory_content_li_left:after {
    content: '';
    position: absolute;
    bottom: -55px;
    left: 0;
    right: 0;
    margin: auto;
    width: 1px;
    height: 55px;
    opacity: 0.65;
    background: rgba(237, 237, 237, 1);
    z-index: 1;
}
.InformaHistory_content_li_left > img {
    width: 46px;
    height: 46px;
    z-index: 10;
}
.InformaHistory_content_li_right {
    width: 722px;
    height: 186px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 1px 6px 0px rgba(187, 211, 230, 0.5);
    border: 1px solid rgba(237, 237, 237, 1);
    border-radius: 8px;
    position: relative;
    overflow-y: scroll;
}
.InformaHistory_content_li_right:before {
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    transform: rotate(45deg);
    border: 1px solid rgba(237, 237, 237, 1);
    border-top: none;
    border-right: none;
    background: rgba(255, 255, 255, 1);
    top: 37px;
    left: -6px;
}
.InformaHistory_content_li_right > div:last-child {
    margin-bottom: 10px;
}
.InformaHistory_content_li_right_div {
    margin-top: 14px;
    display: flex;
    position: relative;
    padding-left: 40px;
}
.InformaHistory_content_li_right_div .cellPhoneImg {
    display: inline-block;
    width: 25px;
    height: 27px;
    background: url(/static/img/Communihistory/cell.png) no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
    margin-left: 5px;
}
.InformaHistory_content_li_right_div .cellPhoneImg:hover {
    background: url(/static/img/Communihistory/cell1.png) no-repeat;
    background-size: 100% 100%;
}

.InformaHistory_content_li_right_div:before {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    background: rgba(189, 228, 255, 1);
    border-radius: 50%;
    top: 8px;
    left: 20px;
}
.InformaHistory_content_li_right_div > span {
    width: 10%;
    min-width: 85px;
    font-size: 14px;
    font-weight: bold;
    color: #666;
    text-align: left;
}
.InformaHistory_content_li_right_div > div {
    width: 90%;
    /* min-width: 507px; */
    font-size: 14px;
    font-weight: 400;
    color: #666;
    text-align: left;
}
.notData {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    font-size: 25px;
}
</style>
