<template>
  <div class="SMSReport">
    <el-dialog :title="'短信公告'" :visible.sync="centerDialogVisible" width="750px" center>
      <el-row :gutter="20" style="border: 1px solid #ccc">
        <el-col :span="8" style="border-right: 1px solid #ccc;padding: 5px 10px 20px">
          <div class="historyRecord">
            <p class="historyTitle">历史记录</p>
            <el-select
              v-model="auditStatusId"
              filterable
              default-first-option
              placeholder="请选择时间"
              @change="seeRecord"
            >
              <el-option
                style="height:30px;"
                v-for="item in historyList"
                :key="item.id"
                :label="item.gmtCreate"
                :value="item.id"
              ></el-option>
            </el-select>
            <p class="sendPeople">发送人：{{historyData.createUserIdString}}</p>
            <p class="SMSNum">短信数量：{{historySendNum}} 条</p>
            <p class="SMSTime">发送时间：{{historyData.gmtCreate}}</p>
            <el-input type="textarea" rows="8" resize="none" v-model="historyData.content" style="margin: 5px 0" readonly></el-input>
            <p>发送成功：{{historyData.sendScussess?historyData.sendScussess:0}}</p> 
            <p>发送失败：{{historyData.sendError?historyData.sendError:0}}<span v-if="historyData.sendError && historyData.sendError!=0" class="replacement" @click="replacement(historyData.id)">补发</span></p>
          </div>
        </el-col>
        <el-col :span="16">
          <div class="SMSDetail">
            <div class="SMSStatistics">
              <p class="needNum">本次公告需发送短信数量 {{sendNum}}条</p>

              <p class="surplusNum">
                剩余短信数量：
                <span style="color:red;">{{SMSNum}}</span>
              </p>
            </div>
            <div class="content">
              <el-input type="textarea" v-model="sendContent" rows="4" resize="none" maxlength="500"></el-input>
              <p class="limit">{{sendContent.length}}/500字</p>
            </div>
            <p class="tip" v-if="SMSNum<sendNum">短信剩余不足，无法发送短信，请及时充值。</p>
          </div>
          <div class="opeation">
            <el-button style="margin-right:20px;">取消</el-button>

            <el-button @click="send">发送</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      centerDialogVisible: false,
      historyData:{
        id: '',
        content: '',
        createUserIdString: '',
        gmtCreate: '',
        sendScussess: 0,
        sendError: 0,
      },
      SMSNum: "",
      auditStatusId: '',
      sendContent: "",
      historyList: [],//下拉列表
      sendNum: 600,
    };
  },
  computed:{
    //发送数量
    historySendNum(){
      return this.historyData.sendScussess + this.historyData.sendError
    }
  },
  methods: {
    init(SMSNum) {
      this.SMSNum = SMSNum;
      this.centerDialogVisible = true;

      // 历史
      this.$http({
        url: this.$http.adornUrl("/buss/bussMessage/list"),
        method: "get"
      }).then(data => {
        if (data.data.code === 0) {
          this.historyList = data.data.data
          this.auditStatusId = this.historyList[0].gmtCreate
            this.getOneList(this.historyList[0])
            
        } else {
          this.$message.error(data.data.msg);
        }
      });
    },
    getOneList(object){
      for (const key in this.historyData) {
        if (object.hasOwnProperty(key)) {
          this.historyData[key] = object[key];
        }
      }
    },
    send() {
      // 短信报告发送
      this.$http({
        url: this.$http.adornUrl("/buss/bussMessage/sendBussMsg"),
        method: "post",
        data: this.$http.adornData({
          content: this.sendContent,
        })
      }).then(({ data }) => {
        console.log(data)
        if (data.code == 0) {
          this.$message({
            type: 'success',
            message: '发送成功',
            duration: 1000,
            onClose:()=>{
              this.centerDialogVisible = false
            }
          })
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 查记录
    seeRecord(id) {
      this.$http({
        url: this.$http.adornUrl(`/buss/bussMessage/getOneAndLink?id=${id}`),
        method: "get"
      }).then(data => {
        if (data.data.code === 0) {
          this.getOneList(data.data.data)
        } else {
          this.$message.error(data.data.msg);
        }
      });
    },
    replacement(id){  
      // alert(id)
    }
  }
};
</script>

<style lang="scss" scoped>
.SMSReport {
  .el-dialog--center .el-dialog__body {
    text-align: center;
  }
  /deep/ .el-dialog {
    border-radius: 2px;
    box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.27);
    .el-dialog__header {
      background-color: rgba(241, 244, 246, 1) !important;
      padding: 11px 0 11px 20px;
      border-radius: 5px 5px 0 0;
      font-weight: initial;
      .el-dialog__headerbtn {
        
        top: 14px;
        .el-dialog__close {
          color: #adb6c2;
        }
      }
      span {
        font-weight: initial;
        color: #333;
        font-size: 16px;
      }
    }
    .el-dialog__body {
      color: black;
      font-size: 13px;

      padding: 30px 41.5px;
    }
  }
  // 历史记录样式
  .historyRecord {
    .historyTitle {
      text-align: center;
    }
    .sendPeople{
      margin-top: 5px;
    }
    .replacement{
      color: #0091FF;
      margin-left: 20px;
      cursor: pointer;
    }
  }
  // 右边短信样式
  .SMSDetail {
    padding: 0 20px;
    .SMSStatistics {
      display: flex;
      justify-content: space-between;
      padding: 30px 0;
    }
    .content {
      .limit {
        text-align: right;
      }
    }
    .tip {
      background-color: yellow;
      margin-bottom: 20px;
    }
  }
  .opeation {
    text-align: center;
  }
}
</style>