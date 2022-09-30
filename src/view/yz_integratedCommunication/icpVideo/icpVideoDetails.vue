<template>
  <div>
    <div class="box-card">
      <el-row style="margin:24px 24px 12px 24px">
        <el-col class="selectedVideo">成员列表</el-col>
      </el-row>
      <el-row>
        <div class="videoList">
          <el-col style="height: 432px">
            <el-scrollbar style="height: 100%">
              <el-row v-for="(item,key) in videoList" :key="key" style="margin-top:10px">
                <el-tooltip class="item" effect="dark" :content="item.call" placement="top">
                  <el-col
                    :offset="1"
                    :span="8"
                    style="text-align: left;font-size:14px;"
                  >{{key+1}}.{{item.name}}</el-col>
                </el-tooltip>
                <el-col :offset="8" :span="2" style="text-align: right">
                  <el-button
                    v-if="camera[key]"
                    icon="el-icon-camera"
                    class="shrink-button"
                    :disabled="!confStatus"
                    @click="ConfBoardCastMember(key,1)"
                  ></el-button>
                  <el-button
                    v-else
                    icon="el-icon-camera-solid"
                    class="shrink-button"
                    :disabled="!confStatus"
                    @click="ConfBoardCastMember(key,0)"
                  ></el-button>
                </el-col>
                <el-col :span="2" style="text-align: right">
                  <el-button
                    v-if="microphone[key]"
                    icon="el-icon-turn-off-microphone"
                    class="shrink-button"
                    :disabled="!confStatus"
                    @click="OperateConfMember(key,2)"
                  ></el-button>
                  <el-button
                    v-else
                    icon="icon-voice"
                    class="shrink-button"
                    :disabled="!confStatus"
                    @click="OperateConfMember(key,3)"
                  ></el-button>
                </el-col>
                <el-col :span="2" style="text-align: right">
                  <el-button icon="el-icon-close" class="shrink-button" @click="removeContact(key)"></el-button>
                </el-col>
              </el-row>
            </el-scrollbar>
          </el-col>
        </div>
      </el-row>
      <el-row style="margin:32px 0">
        <el-col :offset="4" :span="8">
          <el-button v-if="!confStatus" type="primary" @click="CreateConf">召开会议</el-button>
          <el-button v-else type="danger" @click="EndConf">结束会议</el-button>
        </el-col>
        <el-col :offset="1" :span="4">
          <el-button type="primary" @click="removeAllContact">清空</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="conferencePanel">
      <el-row style="margin:20px">
        <el-col :span="8" class="labelName">会议类型：</el-col>
        <el-radio-group v-model="videoType">
          <el-radio :label="0" :disabled="confStatus">电话会议</el-radio>
          <el-radio :label="1" :disabled="confStatus">视频会议</el-radio>
        </el-radio-group>
      </el-row>
      <el-row style="margin:20px">
        <el-col :span="8" class="labelName">会议人数：</el-col>
        <el-col :span="16">
          <el-col :offset="4" :span="8" class="totalNum">{{videoList.length}}</el-col>
          <el-col :span="2">人</el-col>
        </el-col>
      </el-row>
      <el-row style="margin:20px">
        <el-col :span="8" class="labelName">会议时长：</el-col>
        <el-col :span="14">{{ str}}</el-col>
      </el-row>
      <el-row style="margin:5px" v-if="confStatus">
        <el-col :span="12">
          <el-link type="primary" icon="icon-voice" @click="OperateConfMemberAll(3)">全部发言</el-link>
        </el-col>
        <el-col :span="12">
          <el-link
            type="primary"
            icon="el-icon-camera-solid"
            @click="ConfBoardCastMemberAll(0)"
          >全部广播</el-link>
        </el-col>
      </el-row>
      <el-row style="margin:5px" v-if="confStatus">
        <el-col :span="12">
          <el-link
            type="info"
            icon="el-icon-turn-off-microphone"
            @click="OperateConfMemberAll(2)"
          >全部禁言</el-link>
        </el-col>
        <el-col :span="12">
          <el-link type="info" icon="el-icon-camera" @click="ConfBoardCastMemberAll(1)">取消广播</el-link>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "icpVideoDetail",
  data() {
    return {
      HWICP_Version: window.g.HWICP_Version, //icp版本
      agent_id: "", //坐席ID
      confId: 0, //会议ID
      videoList: [], //选择会议人员列表;
      videoListMemberNum: "", //ECS视频会议参会人员
      videoListNumType: "", //ECS视频会议参会人员类型
      videoType: 1, //会议类型
      camera: [], //视频画面
      microphone: [], //语音
      str: "00:00:00"
    };
  },
  mounted() {
    this.str = this.$store.getters.getTimer;
    this.agent_id = sessionStorage.getItem("agent_id");
    this.confId = this.$store.getters.getConfId;
    // this.confStatus = this.$store.getters.getConfStatus;

    this.videoList = this.$store.getters.getConfMemberStatus.videoList;
    this.camera = this.$store.getters.getConfMemberStatus.camera;
    this.microphone = this.$store.getters.getConfMemberStatus.microphone;
    if (this.HWICP_Version == "HWICP-19.0") {
    }
    this.videoListMemberNum = sessionStorage.getItem("videoListMemberNum");
    this.videoListNumType = sessionStorage.getItem("videoListNumType");
    if (this.videoListMemberNum) {
      let videoListMemberNumArray = this.videoListMemberNum.split(",");
      let videoListNumTypeArray = this.videoListNumType.split(",");
      let name = [];
      let call = [];
      if (this.videoListMemberNumArray.length > 0) {
        for (let i in this.videoListMemberNumArray) {
          let array = this.videoListMemberNumArray[i].split("|*|");
          call.push(array[0]);
          name.push(array[1]);
        }
      }
      this.AddvideoList(name, call, videoListNumTypeArray);
    }
  },
  computed: {
    ...mapGetters({
      myVdcConfId: "getMyVdcConfId",
      confStatus: "getConfStatus" //会议状态
    }),
    timer() {
      return this.$store.getters.getTimer;
    },
    confIdChange() {
      return this.$store.getters.getConfId;
    }
  },
  watch: {
    timer(newVal) {
      this.str = newVal;
    },
    confIdChange(newVal) {
      this.confId = Number(newVal);
    },
    videoList(newVal) {
      this.$store.commit("setConfMemberStatus", { videoList: newVal });
    },
    camera(newVal) {
      this.$store.commit("setConfMemberStatus", { camera: newVal });
    },
    microphone(newVal) {
      this.$store.commit("setConfMemberStatus", { microphone: newVal });
    }
  },
  methods: {
    showData(name, phone, type) {
      this.videoList.push({ name: name, call: phone, numType: type });
      this.microphone.push(false);
      this.camera.push(false);
      this.removerSamePhone();
      if (this.confStatus) {
        //入会
        if (this.HWICP_Version == "HWICP-19.0") {
          this.$icp19.JoinConfEx3(
            Number(this.agent_id),
            Number(this.confId),
            0,
            phone,
            Number(type),
            name
          );
        }
      }
    },
    //增加会议列表
    AddvideoList(name, phone, type) {
      for (let i in name) {
        this.videoList.push({
          name: name[i],
          call: phone[i],
          numType: type[i]
        });
        this.microphone.push(false);
        this.camera.push(false);
      }
    },
    //号码去重
    removerSamePhone() {
      for (let i = 0; i < this.videoList.length; i++) {
        for (let j = i + 1; j < this.videoList.length; j++) {
          if (this.videoList[i].call == this.videoList[j].call) {
            this.videoList.splice(j, 1);
            this.microphone.splice(j, 1);
            this.camera.splice(j, 1);
            j--;
          }
        }
      }
      this.videoList = Array.from(new Set(this.videoList));
    },
    //移除召开会议的成员列表
    removeContact(key) {
      if (this.confStatus) {
        //出会
        if (this.HWICP_Version == "HWICP-19.0") {
          this.$icp19.RemoveFromConfEx(
            Number(this.agent_id),
            Number(this.confId),
            0,
            this.videoList[key].call,
            this.videoList[key].numType
          );
        }
      }
      this.videoList.splice(key, 1);
      this.microphone.splice(key, 1);
      this.camera.splice(key, 1);
    },
    //清空
    removeAllContact() {
      if (this.confStatus) {
        if (this.HWICP_Version == "HWICP-19.0") {
          for (let key in this.videoList) {
            this.$icp19.RemoveFromConfEx(
              Number(this.agent_id),
              Number(this.confId),
              0,
              this.videoList[key].call,
              this.videoList[key].numType
            );
            let videoList = [...this.videoList],
              len = videoList.length - 1;
            for (let i = len; i >= 0; i--) {
              let idx = this.videoList.indexOf(videoList[i]);
              if (idx != -1) {
                this.microphone.splice(idx, 1);
                this.camera.splice(idx, 1);
                this.videoList.splice(idx, 1);
              }
              this.videoList.length == 0 &&
                this.$message.success("全部移除成功");
            }
          }
        }
      } else {
        this.videoList = [];
        this.microphone = [];
        this.camera = [];
      }
    },

    //召开会议
    CreateConf() {
      if (this.videoList.length == 0) {
        this.$message({
          message: "请添加会议成员！",
          type: "warning"
        });
        return;
      }
      this.$confirm("确认召开会议？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let self = this;
          if (self.HWICP_Version == "HWICP-19.0") {
            let memberNum = "";
            let numType = "";
            for (let index = 0; index < self.videoList.length; index++) {
              if (index != self.videoList.length - 1) {
                memberNum =
                  memberNum +
                  self.videoList[index].call +
                  "|*|" +
                  self.videoList[index].name +
                  ",";
                if (
                  self.videoType == "0" &&
                  self.videoList[index].numType == "8"
                )
                  numType = numType + "1" + ",";
                else numType = numType + self.videoList[index].numType + ",";
              } else {
                memberNum =
                  memberNum +
                  self.videoList[index].call +
                  "|*|" +
                  self.videoList[index].name;
                numType = numType + self.videoList[index].numType;
              }
            }
            if (self.videoType == "0") {
              numType = numType + ",1";
            } else if (self.videoType == "1") {
              numType = numType + ",8";
            }
            this.$icp19
              .CreateConfEx(Number(self.agent_id), memberNum, numType)
              .then(data => {
                if (data.data.errorcode == 0) {
                  this.$message.success("已发起创建会议！");
                  // start();
                  // typeof call==='function'&&call(data)
                  //router.push({path: '/icpVideo'});
                  sessionStorage.setItem("videoListMemberNum", memberNum);
                  sessionStorage.setItem("videoListNumType", numType);
                  this.$store.commit("setConfStatus", true); //设置会议状态
                }
              });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消召开会议"
          });
        });
    },
    //结束会议
    EndConf() {
      this.$confirm("确认结束会议？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let self = this;
          if (self.HWICP_Version == "HWICP-19.0") {
            this.$icp19.DeleteConf(Number(self.agent_id), Number(self.confId));
            sessionStorage.removeItem("videoListMemberNum");
            sessionStorage.removeItem("videoListNumType");
            this.$store.commit("setConfStatus", false); //设置会议状态
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消结束会议"
          });
        });
    },
    //会议成员发言 状态1、只能说2、只能听3、可说可听
    OperateConfMember(key, status) {
      this.microphone[key] = !this.microphone[key];
      this.videoList = Array.from(new Set(this.videoList));
      if (this.HWICP_Version == "HWICP-19.0") {
        console.log(status);
        this.$icp19.OperateConfMemberEx(
          Number(this.agent_id),
          Number(this.confId),
          0,
          status,
          this.videoList[key].call.toString()
        ).then((data)=> {
          if (data.data.errorcode == 0) {
            if (status == 5) {
              this.$message.success("已发起会议成员禁言");
            } else if (status == 6) {
              this.$message.success("已发起会议成员发言");
            }
            this.videoList.forEach((o, i) => {
              if (status == 6) o.myAuto = true;
              else if (status == 5) o.myAuto = false;
            });
          }
        });
      }
    },
    //会议广播 是否取消广播，0否，1取消
    ConfBoardCastMember(key, isCannel) {
      this.camera[key] = !this.camera[key];
      this.videoList = Array.from(new Set(this.videoList));
      if (this.HWICP_Version == "HWICP-19.0") {
        this.$icp19.ConfBoardCastMember(
          Number(this.agent_id),
          Number(this.confId),
          1,
          this.videoList[key].call.toString(),
          isCannel
        );
      }
    },
    //全部发言、禁言
    OperateConfMemberAll(status) {
      let phoneNum = "";
      if (this.HWICP_Version == "HWICP-19.0") {
        for (let index = 0; index < this.videoList.length; index++) {
          if (status == 2) this.microphone[index] = false;
          else if (status == 3) this.microphone[index] = true;
          if (index != this.videoList.length - 1) {
            phoneNum = phoneNum + this.videoList[index].call + ",";
          } else {
            phoneNum = phoneNum + this.videoList[index].call;
          }
        }
        this.$icp19.OperateConfMemberEx(
          Number(this.agent_id),
          Number(this.confId),
          0,
          status,
          phoneNum
        ).then((data)=> {
          if (data.data.errorcode == 0) {
            if (status == 5) {
              this.$message.success("已发起会议成员禁言");
            } else if (status == 6) {
              this.$message.success("已发起会议成员发言");
            }
            this.videoList.forEach((o, i) => {
              if (status == 6) o.myAuto = true;
              else if (status == 5) o.myAuto = false;
            });
          }
        });
      }
    },
    //全部广播、取消
    ConfBoardCastMemberAll(isCannel) {
      let mixType = 16;
      let phoneNum = "";
      if (isCannel == 1) {
        mixType = 1;
      } else {
        if (this.videoList.length <= 1) {
          mixType = 1;
        } else if (2 <= this.videoList.length && this.videoList.length <= 4) {
          mixType = 4;
        } else if (5 <= this.videoList.length && this.videoList.length <= 9) {
          mixType = 9;
        } else if (9 <= this.videoList.length) {
          mixType = 16;
        }
      }
      if (this.HWICP_Version == "HWICP-19.0") {
        for (let index = 0; index < this.videoList.length; index++) {
          if (index != this.videoList.length - 1) {
            if (isCannel == 1) this.camera[index] = false;
            else if (isCannel == 0) this.camera[index] = true;
            phoneNum = phoneNum + this.videoList[index].call + ",";
          } else {
            phoneNum = phoneNum + this.videoList[index].call;
          }
        }
        this.$icp19.ConfBoardCastMember(
          Number(this.agent_id),
          Number(this.confId),
          mixType,
          phoneNum,
          isCannel
        );
      }
    }
  }
};
</script>

<style scoped>
@import "../../../assets/css/icon.css";

.box-card {
  height: 572px;
  margin-top: 16px;
  margin-left: 8px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(219, 219, 219, 1);
  border-radius: 3px;
}

.selectedVideo {
  text-align: left;
  height: 21px;
  font-size: 20px;
  font-family: Microsoft YaHei, sans-serif;
  font-weight: bold;
  color: rgba(50, 50, 50, 1);
}

.videoList {
  margin: 0 24px;
  height: 432px;
  border: 1px solid rgba(162, 162, 162, 1);
}

.shrink-button {
  border: none;
  color: #9da4b3;
  padding: 0;
}

.shrink-button:hover {
  color: #656565;
  background-color: white;
}

.shrink-button:focus {
  color: #656565;
  background-color: white;
}

.conferencePanel {
  height: 200px;
  margin-top: 16px;
  margin-left: 8px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(219, 219, 219, 1);
  border-radius: 3px;
}

.labelName {
  font-size: 14px;
  font-family: Microsoft YaHei, sans-serif;
  font-weight: 400;
  color: rgba(96, 98, 102, 1);
}

.totalNum {
  font-family: Microsoft YaHei, sans-serif;
  font-weight: bold;
  color: rgba(71, 157, 255, 1);
}
</style>
