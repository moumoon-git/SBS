<template>
  <div>
    <div class="box-card">
      <el-row style="margin:24px 24px 12px 24px">
        <el-col class="selectedVideo">ๆๅๅ่กจ</el-col>
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
          <el-button v-if="!confStatus" type="primary" @click="CreateConf">ๅฌๅผไผ่ฎฎ</el-button>
          <el-button v-else type="danger" @click="EndConf">็ปๆไผ่ฎฎ</el-button>
        </el-col>
        <el-col :offset="1" :span="4">
          <el-button type="primary" @click="removeAllContact">ๆธ็ฉบ</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="conferencePanel">
      <el-row style="margin:20px">
        <el-col :span="8" class="labelName">ไผ่ฎฎ็ฑปๅ๏ผ</el-col>
        <el-radio-group v-model="videoType">
          <el-radio :label="0" :disabled="confStatus">็ต่ฏไผ่ฎฎ</el-radio>
          <el-radio :label="1" :disabled="confStatus">่ง้ขไผ่ฎฎ</el-radio>
        </el-radio-group>
      </el-row>
      <el-row style="margin:20px">
        <el-col :span="8" class="labelName">ไผ่ฎฎไบบๆฐ๏ผ</el-col>
        <el-col :span="16">
          <el-col :offset="4" :span="8" class="totalNum">{{videoList.length}}</el-col>
          <el-col :span="2">ไบบ</el-col>
        </el-col>
      </el-row>
      <el-row style="margin:20px">
        <el-col :span="8" class="labelName">ไผ่ฎฎๆถ้ฟ๏ผ</el-col>
        <el-col :span="14">{{ str}}</el-col>
      </el-row>
      <el-row style="margin:5px" v-if="confStatus">
        <el-col :span="12">
          <el-link type="primary" icon="icon-voice" @click="OperateConfMemberAll(3)">ๅจ้จๅ่จ</el-link>
        </el-col>
        <el-col :span="12">
          <el-link
            type="primary"
            icon="el-icon-camera-solid"
            @click="ConfBoardCastMemberAll(0)"
          >ๅจ้จๅนฟๆญ</el-link>
        </el-col>
      </el-row>
      <el-row style="margin:5px" v-if="confStatus">
        <el-col :span="12">
          <el-link
            type="info"
            icon="el-icon-turn-off-microphone"
            @click="OperateConfMemberAll(2)"
          >ๅจ้จ็ฆ่จ</el-link>
        </el-col>
        <el-col :span="12">
          <el-link type="info" icon="el-icon-camera" @click="ConfBoardCastMemberAll(1)">ๅๆถๅนฟๆญ</el-link>
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
      HWICP_Version: window.g.HWICP_Version, //icp็ๆฌ
      agent_id: "", //ๅๅธญID
      confId: 0, //ไผ่ฎฎID
      videoList: [], //้ๆฉไผ่ฎฎไบบๅๅ่กจ;
      videoListMemberNum: "", //ECS่ง้ขไผ่ฎฎๅไผไบบๅ
      videoListNumType: "", //ECS่ง้ขไผ่ฎฎๅไผไบบๅ็ฑปๅ
      videoType: 1, //ไผ่ฎฎ็ฑปๅ
      camera: [], //่ง้ข็ป้ข
      microphone: [], //่ฏญ้ณ
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
      confStatus: "getConfStatus" //ไผ่ฎฎ็ถๆ
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
        //ๅฅไผ
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
    //ๅขๅ?ไผ่ฎฎๅ่กจ
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
    //ๅท็?ๅป้
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
    //็งป้คๅฌๅผไผ่ฎฎ็ๆๅๅ่กจ
    removeContact(key) {
      if (this.confStatus) {
        //ๅบไผ
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
    //ๆธ็ฉบ
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
                this.$message.success("ๅจ้จ็งป้คๆๅ");
            }
          }
        }
      } else {
        this.videoList = [];
        this.microphone = [];
        this.camera = [];
      }
    },

    //ๅฌๅผไผ่ฎฎ
    CreateConf() {
      if (this.videoList.length == 0) {
        this.$message({
          message: "่ฏทๆทปๅ?ไผ่ฎฎๆๅ๏ผ",
          type: "warning"
        });
        return;
      }
      this.$confirm("็กฎ่ฎคๅฌๅผไผ่ฎฎ๏ผ", {
        confirmButtonText: "็กฎๅฎ",
        cancelButtonText: "ๅๆถ",
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
                  this.$message.success("ๅทฒๅ่ตทๅๅปบไผ่ฎฎ๏ผ");
                  // start();
                  // typeof call==='function'&&call(data)
                  //router.push({path: '/icpVideo'});
                  sessionStorage.setItem("videoListMemberNum", memberNum);
                  sessionStorage.setItem("videoListNumType", numType);
                  this.$store.commit("setConfStatus", true); //่ฎพ็ฝฎไผ่ฎฎ็ถๆ
                }
              });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "ๅๆถๅฌๅผไผ่ฎฎ"
          });
        });
    },
    //็ปๆไผ่ฎฎ
    EndConf() {
      this.$confirm("็กฎ่ฎค็ปๆไผ่ฎฎ๏ผ", {
        confirmButtonText: "็กฎๅฎ",
        cancelButtonText: "ๅๆถ",
        type: "warning"
      })
        .then(() => {
          let self = this;
          if (self.HWICP_Version == "HWICP-19.0") {
            this.$icp19.DeleteConf(Number(self.agent_id), Number(self.confId));
            sessionStorage.removeItem("videoListMemberNum");
            sessionStorage.removeItem("videoListNumType");
            this.$store.commit("setConfStatus", false); //่ฎพ็ฝฎไผ่ฎฎ็ถๆ
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "ๅๆถ็ปๆไผ่ฎฎ"
          });
        });
    },
    //ไผ่ฎฎๆๅๅ่จ ็ถๆ1ใๅช่ฝ่ฏด2ใๅช่ฝๅฌ3ใๅฏ่ฏดๅฏๅฌ
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
              this.$message.success("ๅทฒๅ่ตทไผ่ฎฎๆๅ็ฆ่จ");
            } else if (status == 6) {
              this.$message.success("ๅทฒๅ่ตทไผ่ฎฎๆๅๅ่จ");
            }
            this.videoList.forEach((o, i) => {
              if (status == 6) o.myAuto = true;
              else if (status == 5) o.myAuto = false;
            });
          }
        });
      }
    },
    //ไผ่ฎฎๅนฟๆญ ๆฏๅฆๅๆถๅนฟๆญ๏ผ0ๅฆ๏ผ1ๅๆถ
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
    //ๅจ้จๅ่จใ็ฆ่จ
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
              this.$message.success("ๅทฒๅ่ตทไผ่ฎฎๆๅ็ฆ่จ");
            } else if (status == 6) {
              this.$message.success("ๅทฒๅ่ตทไผ่ฎฎๆๅๅ่จ");
            }
            this.videoList.forEach((o, i) => {
              if (status == 6) o.myAuto = true;
              else if (status == 5) o.myAuto = false;
            });
          }
        });
      }
    },
    //ๅจ้จๅนฟๆญใๅๆถ
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
