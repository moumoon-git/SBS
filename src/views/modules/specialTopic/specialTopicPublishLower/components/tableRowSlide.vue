<template>
    <div class="tableRowSlide">
        <div class="rowTitle">子任务平台/人员：</div>
        <div class="platFormWrapper">
            <div class="platFormName">水利局</div>
            <div class="stateButton">未读</div>
        </div>
        <div class="personWrapper">
            <div class="personName">张三</div>
            <el-tooltip content="Bottom center" placement="bottom" effect="light">
                <div slot="content">任务负责人：张三<br/>任务参与人：李四</div>
                <img src="~@/assets/img/downToastArrow.png" alt="" class="toastImg">
            </el-tooltip>
            <div class="stateButton">已完成</div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'tableRowSlide'
}
</script>
<style lang="less" scoped>
.tableRowSlide {
    height: 50px;
    display: flex;
    align-items: center;
    background-color: #f2f2f2;
    // background-color: #fff;
  .rowTitle {
    margin-left: 30px;
  }

  .platFormWrapper {
      display: flex;
      margin-left: 20px;
      align-items: center;
      &:nth-child(2) {
          margin-left: 10px;
      }
    .platFormName {

    }

    .stateButton {
        margin-left: 15px;
        background-color: #ccc;
        color: #fff;
    }
  }

  .personWrapper {
      display: flex;
      margin-left: 30px;
      align-items: center;
    .personName {

    }

   .toastImg {
       width: 15px;
       height: 15px;
   }

    .stateButton {
        background-color: #85d700;
        color: #fff;
    }
  }
}
</style>