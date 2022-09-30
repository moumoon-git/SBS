<template>
  <div class="my-phone-right-main">
    <div class="my-phone-right-main-user">
      <el-row style="margin-top: 10px">
        <el-col :span="24">
          <div class="my-phone-right-title" style="min-height:30px;">{{findCallData.name}}</div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="24">
          <i class="icon-zhiwu" style="vertical-align:text-top"></i>
          <span class="my-phone-right-title">{{findCallData.position}}</span>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="24">
          <i class="icon-danwei" style="vertical-align:text-top"></i>
          <span class="my-phone-right-title">{{findCallData.workUnit}}</span>
        </el-col>
      </el-row>
      <div class="my-phone-list">
        <div class="my-phone-list-item">
          <span class="my-phone-list-left">手机号码:</span>
          <span class="my-phone-list-middle">{{findCallData.mobile}}</span>
          <span class="my-phone-list-right" @click="talcCall('mobile')">
            <i class="el-icon-phone"></i>
          </span>
        </div>
        <div class="my-phone-list-item">
          <span class="my-phone-list-left">备用手机:</span>
          <span class="my-phone-list-middle">{{findCallData.otherTel}}</span>
          <span class="my-phone-list-right" @click="talcCall('otherTel')">
            <i class="el-icon-phone"></i>
          </span>
        </div>
        <div class="my-phone-list-item">
          <span class="my-phone-list-left">办公电话:</span>
          <span class="my-phone-list-middle">{{findCallData.officeTel}}</span>
          <span class="my-phone-list-right" @click="talcCall('officeTel')">
            <i class="el-icon-phone"></i>
          </span>
        </div>
        <div class="my-phone-list-item">
          <span class="my-phone-list-left">应急电话:</span>
          <span class="my-phone-list-middle">{{findCallData.homeTel}}</span>
          <span class="my-phone-list-right" @click="talcCall('homeTel')">
            <i class="el-icon-phone"></i>
          </span>
        </div>
        <div class="my-phone-list-item">
          <span class="my-phone-list-left">其他电话:</span>
          <span class="my-phone-list-middle">{{findCallData.otherTel2}}</span>
          <span class="my-phone-list-right" @click="talcCall('otherTel2')">
            <i class="el-icon-phone"></i>
          </span>
        </div>
        <div class="my-phone-list-item">
          <span class="my-phone-list-left">手持终端:</span>
          <span class="my-phone-list-middle">{{findCallData.temobile}}</span>
          <span class="my-phone-list-right" @click="talcCall('temobile')">
            <i class="el-icon-phone"></i>
          </span>
        </div>
      </div>
    </div>
    <div class="my-phone-footer-box">
      <el-row>
          <el-col :span="20">
                 <el-input placeholder="请输入号码" v-model="telNumber" class="searchInput" clearable></el-input>
          </el-col>
          <el-col :span="4">
                  <el-button type="primary" @click="talkCall">拨号</el-button>
          </el-col>
      </el-row>


    </div>
    <!-- <div class="my-phone-list-box">
            <div class="my-phone-list-item">
                        <span class="my-phone-list-left">通话队列:</span>

             </div>
          <div class="my-phone-list-item">
                        <span class="my-phone-list-left">xxxxx</span>
                        <span class="my-phone-list-middle">12344422</span>
                        <span class="my-phone-list-right"><i class="el-icon-phone"></i></span>
              </div>
    </div>-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  components: {},
  props: {
    findCallData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      telNumber:'',
      seatNumber: sessionStorage.getItem("seat"),
      agent_id: sessionStorage.getItem("agent_id"),
      HWICP_Version: window.g.HWICP_Version //icp版本
    };
  },
  watch:{
    telNumber(newval, oldval) {
      this.telNumber = newval.replace(/[^0-9]/ig, "");
    },
  },
  created() {},
  computed: {
    ...mapGetters({
      callIsVisible: "getCallStatus",
      isShowWind: "getIsShowWind",
      confStatus: "getConfStatus" //会议状态
    })
  },
  methods: {
    talkCall(){
        if(!this.telNumber){
            this.$message({
                message: "号码不能为空",
                type: "warning"
            });
            return
        }else{
             this.talcCall(this.telNumber,1)
        }
    },
    talcCall(key,type) {
      if (this.isShowWind || this.callIsVisible) {
        this.$message({
          message: "正在通话中",
          type: "warning"
        });
        return;
      }
      if (this.confStatus) {
        this.$message({
          message: "你正在会议中不可以拨打电话",
          type: "warning"
        });
        return;
      }
      let mobile = type==1?key:this.findCallData[key];
      if (mobile == "" || mobile == null) {
        this.$message({
          message: "号码不能为空",
          type: "warning"
        });
        return;
      }
      this.$confirm("确认呼叫当前号码?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let self = this;
          if (self.HWICP_Version == "HWICP-19.0") {
            this.$icp19.MakeCall(
              Number(self.agent_id),
              mobile,
              self.seatNumber.toString()
            );
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消呼叫"
          });
        });
    }
  }
};
</script>

<style scoped>
.my-phone-right-main {
  padding: 20px;
  height: calc(100vh - 200px);
  background-color: white;
}
.my-phone-right-title {
  color: #858585;
  line-height: 30px;
}
.my-phone-right-main-user {
  /* background: rgba(0,0,0,0.3); */
  padding: 20px;
  border-radius: 8px;
  font-size: 16px;
  border: 1px solid #d7d7d7;
}
.my-phone-list {
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #fff;
  border-radius: 6px;
}
.my-phone-list-item {
  line-height: 40px;
  font-size: 0px;
  color: #858585;
}
.my-phone-list-item span {
  display: inline-block;
  font-size: 16px;
  vertical-align: middle;
}
.my-phone-list-middle {
  padding: 0 40px 0 10px;
}
.my-phone-list-item .my-phone-list-right {
  font-size: 20px;
  height: 40px;
  width: 40px;
  text-align: center;
  cursor: pointer;
  color: #66b1ff;
  float: right;
  margin: 0 20px;
}
.my-phone-list-box {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  font-size: 16px;
  min-height: 200px;
  max-height: 300px;
  margin-top: 10px;
  border: 1px solid #d7d7d7;
}
.my-phone-footer-box{
    padding:10px 0;
}
.searchInput{
    font-size: 20px;
}
</style>
