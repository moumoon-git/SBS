<template>
  <div class="my-phone-right-main">
    <div class="my-phone-right-main-user">
      <div class="my-fax-head">
        <!-- <div class="my-fax-head-left">
                  对讲机列表:<span>{{peopleList.length}}</span>
        </div>-->
        <!-- <div class="my-fax-head-right">
                   <span @click="clearNumber">清除</span>
        </div>-->
      </div>
      <div v-if="peopleList.length>0">
        <div class="my-fax-list-box">
          <div class="my-fax-list1" v-for="(item,index) in peopleList" :key="index">
            <i class="el-icon-close" @click="myDelete(index)"></i>
            <!-- <i class="my-fax-list1-delete oy-icon-myAuto" @click="openMicrophone(index)" :class="{'oy-active':item.microphone}"></i> -->
            <!-- <i class="my-fax-list1-delete el-icon-headset" @click="openHeadset(index)" :class="{'oy-active':item.headset}"></i>  -->
            <i
              class="my-fax-list1-delete iconfont icon-closeTalkBack oy-active"
              @click="openMicrophone(index)"
              v-if="item.microphone"
            ></i>
            <!-- 样式修改：改为蓝色图标 -->
            <!-- <i
              class="my-fax-list1-delete iconfont icon-talkBack"
              :class="{'noClick':talkBackVisble}"
              @click="openMicrophone(index)"
              v-else
            ></i> -->
            <i
              class="my-fax-list1-delete iconfont icon-talkBack"
              @click="openMicrophone(index)"
              v-else
            ></i>
            <i
              class="my-fax-list1-delete iconfont icon-volume"
              @click="openHeadset(index)"
              v-if="item.headset"
            ></i>
            <i
              class="my-fax-list1-delete iconfont icon-closeVolume oy-active"
              @click="openHeadset(index)"
              v-else
            ></i>

            <div class="my-fax-list1-left-box">
              <i class="iconfont icon-talkBack"></i>
              <div class="my-fax-list1-right">{{item.name}}</div>
            </div>
          </div>
        </div>

        <div class="dial">
          <div class="dialLogo" @click="submitPhones"></div>
        </div>
      </div>

      <div class="NoSMSList" v-else>暂无设备</div>
    </div>
    <div class="sendMsg"></div>

    <!-- 拨号入会 -->
    <el-dialog
      :visible.sync="isAddNumberShow"
      :before-close="handleClose"
      width="242px"
      :close-on-click-modal="false"
      custom-class="addPhone"
    >
      <div class="transition-box" style="display: flex;padding-left: 13px;">
        <dial-plate isShowClose="true" @callPhone="callPhone" style="display: inline-block"></dial-plate>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Url } from "@/assets/js/common";
import { mapGetters } from "vuex";
import dialPlate from "../meetingSep/dialPlate";

export default {
  components: {
    dialPlate
  },
  data() {
    return {
      seatNumber: sessionStorage.getItem("seat"),
      agent_id: sessionStorage.getItem("agent_id"),
      HWICP_Version: window.g.HWICP_Version, //icp版本
      // peopleList:[],
      findfaxNumber: [],
      timer: "", // 定时器
      isAddNumberShow: false // 拨号入会弹窗
    };
  },
  created() {
    var that = this;
    // this.$bus.$on("clearNumber", function() {
    //     that.clearNumber();
    // });
  },
  computed: {
    ...mapGetters({
      meetingFunction: "getMeetingFunction", // 广播、发言、对讲状态
      talkBackVisble: "getConfTalkbackStatus", // 判断当前是否对讲状态
      peopleList: "getTalkMember"
    })
  },
  methods: {
    openMicrophone(index) {
      let peopleList = this.peopleList;
      // if(!this.peopleList[index].headset){
      //         this.$message({
      //         message: '请先发起监听无线集群群组！',
      //         type: "warning"
      //         });
      //         return;
      //  }
      let isPTT = peopleList[index].microphone ? 1 : 0;
      if (this.HWICP_Version == "HWICP-19.0") {
        let groupName = peopleList[index].number;
        this.$icp19
          .TalkingGroupPTT(this.agent_id, groupName, isPTT)
          .then(data => {
            if (data.data.errorcode == 0) {
              if (isPTT == 1) {
                this.$message.success("抢权成功，你有1分钟说话时间");
                this.$store.commit("SET_Talkback", true);
                this.timer = setTimeout(() => {
                  this.openMicrophone(index);
                }, 60000);
              } else if (isPTT == 0) {
                this.$message.success("无线集群群组已放权！");
                this.$store.commit("SET_Talkback", false);
                clearTimeout(this.timer);
              }

              peopleList[index].microphone = !peopleList[index].microphone;

              // this.$store.commit("setTalkMember", peopleList);
              let copyPeopleList = JSON.parse(JSON.stringify(peopleList)) // 深拷贝
              this.$store.commit("setTalkMember", copyPeopleList);
            } else {
              this.$message.error("抢权失败，请稍等片刻重试");
            }
          });
      }
    },
    openHeadset(index) {
      let peopleList = this.peopleList;
      let isMonitor = !peopleList[index].headset ? 1 : 0;
      // if(this.peopleList[index].microphone){
      //      this.$message({
      //         message: '请先放权无线集群群组！',
      //         type: "warning"
      //         });
      //     return;
      // }
     if (this.HWICP_Version == "HWICP-19.0") {
        let groupName = peopleList[index].number;
        this.$icp19.TalkingGroupMonitor(this.agent_id, groupName, isMonitor, 1);
      }
      peopleList[index].headset = !peopleList[index].headset;
      let copyPeopleList = JSON.parse(JSON.stringify(peopleList)) // 深拷贝
      this.$store.commit("setTalkMember", copyPeopleList);
      // this.$store.commit("setTalkMember", peopleList);
    },
    myDelete(index) {
      let peopleList = this.peopleList;
      if (!peopleList[index].microphone) {
        this.$message({
          message: "请先放权无线集群群组！",
          type: "warning"
        });
        return;
      } else if (peopleList[index].headset) {
        this.$message({
          message: "请先停止监听无线集群群组！",
          type: "warning"
        });
        return;
      }
      // if (this.HWICP_Version == "HWICP-19.0") {
      //   let groupName = [peopleList[index].call];
      //   this.$icp19.TalkingGroupSelect(this.agent_id, groupName, 0);
      // }
      peopleList.splice(index, 1);
      let copyPeopleList = JSON.parse(JSON.stringify(peopleList)) // 深拷贝
      this.$store.commit("setTalkMember", copyPeopleList);
      // this.$store.commit("setTalkMember", peopleList);
      // this.findfaxNumber.splice(index,1);
    },
    //     getfaxData(data){
    //        let data1 = Object.assign({},data);
    //        if(this.findfaxNumber.indexOf(data1.call)==-1){
    //            this.peopleList.push(data1)
    //            this.findfaxNumber.push(data1.call)
    //        }else{
    //            this.$message.warning("你已添加当前号码");
    //      }
    //    },
    clearNumber() {
      this.$store.commit("setTalkMember", []);
      // this.peopleList = [];
      // this.findfaxNumber= [];
    },
    // 拨号入会
    submitPhones() {
      // this.$emit("update:isAddNumberShow", true);
      this.isAddNumberShow = true;
    },
    //拨号盘拨号
    dialing(data) {
      console.log(data);
      if (data.phoneNumber) {
        let rowNumber = {
          number: data.phoneNumber
        };
        console.log(rowNumber);
        console.log(this.phonesText1);
        if (this.phonesText1.length > 0) {
          console.log("存在");
          this.phonesText1 = this.phonesText1 + "," + rowNumber.number;
        } else {
          console.log("不存在");
          this.phonesText1 = rowNumber.number;
        }
        console.log(this.phonesText1);
        // this.makeCallDish(rowNumber)  //拨号盘呼叫
      }
    },
    handleClose() {
      this.isAddNumberShow = false;
    },
    // 拨号入会
    callPhone(phoneNumber) {
      let successConf = false
      let peopleList = this.peopleList
      let error = ''
      let phoneData = phoneNumber.split(",") || [];
      phoneData = [...new Set(phoneData)];
      phoneData = phoneData.filter(x =>
        peopleList.every(y => x != y.number)
      );
      if (this.HWICP_Version == "HWICP-19.0") {
          if (phoneData.length > 0) {
              phoneData.map(v => {
                let data = {
                  number: v
                };
                this.$api.findDeviceByNumber(data).then(res => {
                  if (res.errorcode == 0) {
                    let detailData = res.data
                      detailData.headset = false
                      detailData.microphone = true
                      peopleList.push(detailData);
                  }else{
                    error = res.msg
                  }
                })
                // console.log('videoList: ', videoList);
                this.$store.commit("SET_COMEMBER", peopleList); //成员
              });
          }else{
              this.$message.warning('你输入的设备已存在')
          }
            this.isAddNumberShow = false;
      }
    }
  }
};
</script>

<style scoped>
@import "../../../../../assets/oyIcon/style.css";
@import "../../../../../assets/fonts/iconfont.css";
.my-phone-right-main {
  /* padding:20px 0; */
  overflow: auto;
  border-radius: 0 0 3px 3px;
  height: calc(100vh - 200px);
  background-color: white;
}
.my-phone-right-main-user {
  background: #fff;
  padding: 10px 0 20 0;
  /* border-radius: 8px; */
  font-size: 16px;
}
.my-fax-head {
  padding: 0 20px;
  display: flex;
  align-items: center;
}
.my-fax-head-left {
  font-size: 16px;
  color: #999;
  line-height: 20px;
  flex: 1;
}
.my-fax-head-left span {
  font-weight: bold;
  color: #333;
  margin: 0 5px;
}
.my-fax-head-right {
  color: #0091ff;
  display: flex;
  align-items: center;
}
.my-fax-head-right span {
  cursor: pointer;
}

.my-fax-head-right-line {
  margin: 0 10px;
  height: 30px;
  width: 1px;
  background: #e1e2e6;
}
.my-fax-list-box {
  padding: 0 10px 10px 10px;
  /* border: 1px solid #858585; */
  /* border-radius: 6px; */
  height: 634px;
  overflow: auto;
  margin: 0;
}
.dial {
  height: 125px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dial .dialLogo {
  width: 50px;
  height: 50px;
  background-image: url(/static/img/Communihistory/sudoku.png);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  cursor: pointer;
}
.NoSMSList {
  background-image: url(/static/img/nullList.png);
  background-repeat: no-repeat;
  background-position: center;
  background-color: white;
  text-align: center;
  line-height: 890px;
  font-size: 12px;
  font-weight: bold;
  color: #cad5e8;
  height: 770px;
  overflow: hidden;
}
.my-fax-list {
  display: flex;
  height: 30px;
  color: #858585;
  align-items: center;
}
.my-fax-list1 {
  margin-top: 10px;
  height: 30px;
  padding: 10px 0;
  color: #858585;
  border: 1px solid #eae6e6;
  border-radius: 4px;
  position: relative;
}
.my-fax-list1:hover {
  background: #f5faff;
  border-color: #9dbeff;
}
.my-fax-list1-left-box {
  display: flex;
  box-sizing: border-box;
  padding: 0 0 0 10px;
  height: 30px;
  margin-right: 95px;
  align-items: center;
}
.my-fax-list1-right {
  margin-left: 8px;
  color: #333333;
  font-size: 14px;
  line-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.my-fax-list1-right-left {
  margin-right: 30px;
  color: #333333;
  font-size: 14px;
  line-height: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.my-fax-list1-delete {
  float: right;
  width: 20px;
  line-height: 30px;
  text-align: center;
  font-size: 18px;
  height: 30px;
  cursor: pointer;
  margin-right: 7px;
  color: #9fc8fe;
}
.noClick {
  cursor: not-allowed !important;
  color: #ddd;
}
.my-fax-list1-delete.oy-active:before {
  color: #f56c6c;
}
.my-fax-list1-left {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #7bc6fe;
  text-align: center;
  line-height: 20px;
  color: #fff;
  font-size: 9px;
  float: left;
  margin: 5px 0;
}

.sendFaxBox {
  margin: 16px 0;
  background-color: white;
  /* border: 1px solid rgba(219, 219, 219, 1); */
  border-radius: 3px;
}
.el-icon-close {
  float: right;
  font-size: #333;
  padding-right: 10px;
  line-height: 30px;
  cursor: pointer;
}
.openMetting-btn {
  padding: 7px 10px;
  text-align: center;
  color: #fff;
  background: #409eff;
  font-size: 12px;
  border-radius: 3px;
}
.openMetting-btn.oy-active {
  background: #f56c6c;
}

.labelName {
  font-size: 14px;
  font-family: Microsoft YaHei, sans-serif;
  font-weight: 400;
  color: rgba(96, 98, 102, 1);
}
.oy-all-list {
  margin: 0 20px 0 40px;
  color: #9fc8fe;
  cursor: pointer;
}
.oy-all-list.oy-active {
  color: #999;
}
.oy-all-list.oy-active i:before {
  color: #999;
}
.oy-all-list span {
  font-size: 14px;
}
</style>

<style lang="scss" scoped>
// 拨号入会弹窗
/deep/ .addPhone {
  .el-dialog__header {
    height: 19px;
    .el-dialog__headerbtn {
      top: 4px;
      font-size: 7px;
    }
  }
}
</style>
