<!--@author：llp-->
<template>
  <div>
    <div class="box-card">
      <div class="videoIcon">
        <i class="icon-shipinfenzu"></i>
      </div>
      <div class="videoAddress">
        <!--视频监控地址-->
        <el-row>
          <el-col :offset="2" :span="22" class="videoAddress-text">
            <i class="icon-zhiwu"></i>
            <span>{{videoList.name}}</span>
          </el-col>
        </el-row>
        <!--视频监控编号-->
        <el-row>
          <el-col :offset="2" :span="22" class="videoAddress-text">
            <i class="icon-danwei"></i>
            <span>{{videoList.indexCode}}</span>
          </el-col>
        </el-row>
      </div>
      <div class="details">
        <p>地址:{{videoList.address}}</p>
      </div>
    </div>

    <div class="dialpad">
      <el-row class="phoneNumberInput">
        <el-input v-model="phoneNumber" :disabled="isDisable"></el-input>
      </el-row>
      <!--呼叫与拨号-->
      <el-row style="margin-top: 40px">
        <el-col :span="12">
          <el-button type="primary" style="width: 120px">呼叫</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" style="width: 120px">拨号</el-button>
        </el-col>
      </el-row>
      <!--三方通话与结束通话-->
      <el-row style="margin-top:40px">
        <el-col :span="12">
          <el-button type="primary" style="width: 120px">三方通话</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" style="width: 120px">结束通话</el-button>
        </el-col>
      </el-row>
      <!--保持通话与恢复通话-->
      <el-row style="margin-top:40px">
        <el-col :span="12">
          <el-button type="primary" style="width: 120px">保持通话</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" style="width: 120px">恢复通话</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: "videoGroupingDetails",
    data() {
      return {
        isDisable: false,//是否禁用输入框
        phoneNumber: 18315464597,//电话号码
        videoList: []//视频详情
      }
    },
    methods: {
      showData(data) {
        this.videoList = data;
      }
    }
  }
</script>

<style scoped>
  @import '../../../assets/css/icon.css';

  .box-card {
    float: left;
    min-width: 392px;
    height: 450px;
    margin-top: 16px;
    margin-left: 8px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
  }

  .videoIcon {
    margin-top: 40px;
    margin-right: 288px;
  }

  .videoAddress-text {
    text-align: left;
    margin-top: 10px;
    margin-left: 32px;
    font-size: 14px;
    font-family: MicrosoftYaHei, sans-serif;
    color: rgba(162, 162, 162, 1);
  }

  .videoAddress-text i {
    float: left;
    margin-right: 12px;
  }

  .details {
    width: 328px;
    height: 256px;
    border: 1px solid rgba(230, 230, 230, 1);
    margin: 20px 32px 20px 32px;
  }

  .details p {
    margin-left: 15px;
    margin-top: 24px;
    text-align: left;
    font-family: MicrosoftYaHei, sans-serif;
    font-weight: 400;
  }

  .dialpad {
    float: left;
    margin-top: 16px;
    margin-left: 8px;
    min-width: 392px;
    height: 320px;
    background-color: white;
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
  }

  /*>>> .el-input.is-disabled .el-input__inner {*/
  /*color: #76D672;*/
  /*font-size: 24px;*/
  /*font-weight: bold;*/
  /*text-align: center;*/
  /*}*/

  >>> .el-input__inner {
    color: #76D672;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
  }

  .phoneNumberInput {
    margin-top: 12px;
    padding-left: 16px;
    padding-right: 16px;
  }


</style>
