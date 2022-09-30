<!--@author：llp-->
<template>
  <div>
    <div class="box-card">
      <el-row style="margin:24px 24px 12px 24px">
        <el-col class="walkieTalkie">对讲机列表</el-col>
      </el-row>
      <el-row>
        <div class="walkieTalkieList">
          <el-col style="height: 694px">
            <el-scrollbar style="height: 100%">
              <el-row v-for="(item,key) in walkieTalkieList" :key="key" style="margin-top:10px">
                <el-col
                  :offset="1"
                  :span="8"
                  style="text-align: left;font-size:14px;"
                >{{key+1}}.{{item.name}}</el-col>
                <el-col :offset="8" :span="2" style="text-align: right">
                  <el-button
                    v-if="headset[key]"
                    icon="el-icon-headset"
                    class="shrink-button"
                    @click="TalkingGroupMonitor(key,1)"
                  ></el-button>
                  <el-button
                    v-else
                    icon="icon-headset"
                    class="shrink-button"
                    @click="TalkingGroupMonitor(key,0)"
                  ></el-button>
                </el-col>
                <el-col :span="2" style="text-align: right">
                  <el-button
                    v-if="microphone[key]"
                    icon="el-icon-turn-off-microphone"
                    class="shrink-button"
                    @click="TalkingGroupPTT(key,1)"
                  ></el-button>
                  <el-button
                    v-else
                    icon="icon-voice"
                    class="shrink-button"
                    @click="TalkingGroupPTT(key,0)"
                  ></el-button>
                </el-col>
                <el-col :span="2" style="text-align: right">
                  <el-button
                    icon="el-icon-close"
                    class="shrink-button"
                    @click="TalkingGroupSelect(key)"
                  ></el-button>
                </el-col>
              </el-row>
            </el-scrollbar>
          </el-col>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "icpGroupTalkDetail",
  data() {
    return {
      HWICP_Version: window.g.HWICP_Version, //icp版本
      agent_id: "", //坐席ID
      tableData: [], //表格数据
      walkieTalkieList: [], //对讲机列表
      microphone: [], //抢权、放权
      headset: [], //监听
      timer: '', // 定时器
      key: '', //当前索引
    };
  },
  mounted() {
    this.agent_id = Number(sessionStorage.getItem("agent_id"));
  },
  methods: {
    //显示选中数据
    showData(name, call) {
      this.walkieTalkieList.push({ name: name, call: call });
      this.microphone.push(true);
      this.headset.push(true);
      this.removerSamePhone();
    },
    //号码去重
    removerSamePhone() {
      for (let i = 0; i < this.walkieTalkieList.length; i++) {
        for (let j = i + 1; j < this.walkieTalkieList.length; j++) {
          if (this.walkieTalkieList[i].call == this.walkieTalkieList[j].call) {
            this.walkieTalkieList.splice(j, 1);
            this.microphone.splice(j, 1);
            this.headset.splice(j, 1);
            j--;
          }
        }
      }
      this.walkieTalkieList = Array.from(new Set(this.walkieTalkieList));
    },
    //移除对讲机列表
    TalkingGroupSelect(key) {
      if (!this.microphone[key]) {
        this.$message({
          message: "请先放权无线集群群组！",
          type: "warning"
        });
        return;
      } else if (!this.headset[key]) {
        this.$message({
          message: "请先停止监听无线集群群组！",
          type: "warning"
        });
        return;
      }
      if (this.HWICP_Version == "HWICP-19.0") {
        let groupName = [this.walkieTalkieList[key].call];
        this.$icp19.TalkingGroupSelect(this.agent_id, groupName, 0);
      }
      this.walkieTalkieList.splice(key, 1);
      this.microphone.splice(key, 1);
      this.headset.splice(key, 1);
    },
    //isPTT//是否抢权，1抢权，0放权
    TalkingGroupPTT(key, isPTT) {
      this.key = key
      if (isPTT == 1) {
        if (this.headset[key]) {
          this.$message({
            message: "请先发起监听无线集群群组！",
            type: "warning"
          });
          return;
        }
      }
      this.microphone[key] = !this.microphone[key];
      this.walkieTalkieList = Array.from(new Set(this.walkieTalkieList));
      if (this.HWICP_Version == "HWICP-19.0") {
        let groupName = [this.walkieTalkieList[key].call];
        this.$icp19
          .TalkingGroupPTT(this.agent_id, groupName, isPTT)
          .then((data) =>  {
              if (data.data.errorcode == 0) {
                if (isPTT == 1) {
                  this.$message.success("抢权成功，你有1分钟说话时间");
                  this.$store.commit("SET_Talkback", true);
                  this.timer = setTimeout(() => {
                  this.TalkingGroupPTT(this.key,1);
                }, 60000);
                } else if (isPTT == 0) {
                  this.$message.success("无线集群群组已放权！");
                  this.$store.commit("SET_Talkback", false);
                  clearTimeout(this.timer);
                }
              }else{
                  this.$message.error("抢权失败，请稍等片刻重试");
              }
      })
      }
    },
    //isMonitor//是否开始监听，1开始监听，0停止监听
    TalkingGroupMonitor(key, isMonitor) {
      if (isMonitor == 0) {
        if (!this.microphone[key]) {
          this.$message({
            message: "请先放权无线集群群组！",
            type: "warning"
          });
          return;
        }
      }
      if (this.microphone[key]) this.headset[key] = !this.headset[key];
      this.walkieTalkieList = Array.from(new Set(this.walkieTalkieList));
      if (this.HWICP_Version == "HWICP-19.0") {
        let groupName = [this.walkieTalkieList[key].call];
        this.$icp19.TalkingGroupMonitor(this.agent_id, groupName, isMonitor, 1);
      }
    }
  }
};
</script>

<style scoped>
.box-card {
  height: 792px;
  margin-top: 16px;
  margin-left: 8px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(219, 219, 219, 1);
  border-radius: 3px;
}

.walkieTalkie {
  text-align: left;
  height: 21px;
  font-size: 20px;
  font-family: Microsoft YaHei, sans-serif;
  font-weight: bold;
  color: rgba(50, 50, 50, 1);
}

.walkieTalkieList {
  margin: 0 24px;
  height: 694px;
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
</style>
