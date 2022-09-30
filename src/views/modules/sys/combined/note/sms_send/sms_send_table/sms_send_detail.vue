<template>
  <div>
    <el-dialog title="联系人信息" :visible.sync="centerDialogVisible" width="450px" center>
      <div class="content">
        <div class="info">
          <div class="mainInfo">
            <p>姓名：{{oneList.name}}</p>
            <p>性别：{{oneList.sex===0?'男':(oneList.sex===1?'女':'未知')}}</p>
            <p style="margin-bottom:0;">工作单位：{{oneList.workUnit?oneList.workUnit:"无"}}</p>
          </div>
          <img v-if="oneList.images" :src="oneList.images.indexOf('http') === -1?baseUrl+oneList.images:oneList.images" class="avator" />
          <img v-else :src="images" class="avator" />
        </div>
        <p>职务：{{oneList.position?oneList.position:"无"}}</p>
        <p>手机号码：{{oneList.mobile1?oneList.mobile1:"无"}}</p>
        <p>其他号码：{{oneList.otherTel?oneList.otherTel:"无"}}</p>
        <p>紧急联系电话：{{oneList.urgentContactorMobile1?oneList.urgentContactorMobile1:"无"}}</p>
        <p>传真：{{oneList.fex?oneList.fex:"无"}}</p>
        <p>邮箱：{{oneList.email?oneList.email:"无"}}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      centerDialogVisible: false,
      oneList: {},
      // oneList: [
      //   { createTime: 20191029, status: "成功", content: "打卡萨丁卡就能打开，1" },
      //   { createTime: 20191029, status: "失败", content: "的哈萨克电话卡打斯诺克" }
      // ]
      images: require('../../../../../../../assets/img/load.jpg'),
      baseUrl: window.SITE_CONFIG['cloudUrl'],
    };
  },
  methods: {
    checkHistory(contactData) {
      this.centerDialogVisible = true;
      this.oneList = contactData;
    },
  }
};
</script>

<style lang="scss" scoped>
li {
  list-style: none;
}
ul {
  padding: 0;
}
.content {
  p{
    margin: 30px 0;
  }
  padding: 5px 30px;
  // overflow-x: hidden;
  box-sizing: border-box;
  font-size: 16px;
  color: black;
  .info{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .avator{
      width: 120px;
      height: 150px;
    }
  }
}

/deep/ .el-dialog__wrapper .el-dialog{
  border-radius: 8px;
  .el-dialog__header{
    background-color: #01a9f2 !important;
    padding: 10px 0;
    border-radius: 8px 8px 0 0;
    .el-dialog__headerbtn {
      top: 12px;
      .el-dialog__close{
        color: #d1f9fb; 
      }
    }
    span{
      color: #d1f9fb; 
    }
  }
}
</style>
