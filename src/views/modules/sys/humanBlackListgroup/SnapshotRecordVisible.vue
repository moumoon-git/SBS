<template>
  <el-dialog class="infoclass" title="抓拍信息" :close-on-click-modal="false" :visible.sync="visible">
    <div class="cardBox clearfloat">
      <div class="title">
        <span>识别结果</span>
      </div>
      <!-- <el-image style="width: 200px; height: 200px" class="blackListFaceImg" :src="dataForm.facePicUrl" fit="fill"></el-image> -->
      <img style="width: 200px; height: 200px" class="blackListFaceImg" :src="dataForm.facePicUrl" >
      <div class="textBox">
        <p>姓名:{{dataForm.humanName}}</p>
        <p>性别:{{dataForm.sex === 0 ? "未知": dataForm.sex == 1? "男":"女" }}</p>
        <p>证件号:{{dataForm.credentialsNum}}</p>
        <p>名单库:{{dataForm.listLibName}}</p>
        <p>出生日期:{{dataForm.birthday}}</p>
      </div>
    </div>
    <el-timeline>
      <el-timeline-item v-for="(item,index) in dataForm.riskHumanAlarmEntities" :key="index" timestamp="2018/4/12" placement="top">
        <el-card>
          <div class="cardBox">
            <div class="title">
              <span style="float: left;">抓拍图片</span>
              <span style="float: right;;">抓拍时间:{{item.alarmTime}}</span>
            </div>
            <!-- <el-image style="width: 220px; height: 200px" class="blackListFaceImg" :src="item.bkgPicUrl" fit="fill"></el-image> -->
            <img style="width: 228px; height: 200px" class="blackListFaceImg" :src="item.bkgPicUrl" fit="fill">
            <img style="width: 228px; height: 200px" class="blackListFaceImg" :src="item.facePicUrl" fit="fill">
            <!-- <el-image style="width: 220px; height: 200px" class="blackListFaceImg" :src="item.facePicUrl" fit="fill"></!-->
            <div class="boxFooter">
              <span style="text-align: left;color:white;">卡口地址:{{item.cameraName}}</span>
            </div>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0
      }
    }
  },
  methods: {
    init (id) {
      // console.log(id)
      this.dataForm.id = id
      this.visible = true
      this.$http({
        url: this.$http.adornUrl(`/risk/riskhumanblacklist/info`),
        method: 'get',
        params: this.$http.adornParams({
          limit: 10,
          id: this.dataForm.id
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = { ...data.riskHumanBlacklist }
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  }
}
</script>
<style lang="less">
.infoclass {
  .clearfloat:after {
    content: "";
    display: block;
    clear: both;
    visibility: hidden;
    height: 0;
  }
  .clearfloat {
    zoom: 1;
  }
  .el-dialog__body{
    padding:5px 20px;
  }
    .el-dialog {
      width: 600px !important;
    }
  .cardBox {
    margin: 10px;
    width: 500px;
    height: auto;
    border: 1px solid black;
    border-top: none;
    .boxFooter {
      margin-top: 10px;
      height: auto;
      background: black;
      clear: both;
    }
    .title {
      font-size: 16px;
      color: white;
      height: 24px;
      background-color: black;
      text-align: left;
    }
    .blackListFaceImg {
      margin: 10px;
      /* padding: 20px; */
      width: 220px;
      height: 200px;
      border: 1px solid black;
      float: left;
    }
    .textBox {
      margin: 20px;
      width: 220px;
      height: 200px;
      float: right;
    }
  }
}
</style>