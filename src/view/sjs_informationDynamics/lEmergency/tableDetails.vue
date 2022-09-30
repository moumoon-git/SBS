<template>
  <div class="details">
    <!--有数据时候显示-->
    <template v-if="id">
    <el-row class="title">
      <div class="tittle tittle-box">{{title}}</div>

    </el-row>

    <el-row id="inputs" style="margin-top: 26px;margin-left: 36px;color:rgba(162,162,162,1);font-size: 14px">

    </el-row>
    <el-row style="margin-top:10px;padding: 20px;margin-left:32px;margin-right: 32px;height:472px;overflow-y:scroll;border: 1px solid #ccc ">

            <p style="white-space: pre-wrap;text-indent:2em;margin: 0;word-break:break-all;text-align:left;" v-for="(item,index) in content" :key="index">{{item}}</p>
    </el-row>
    </template>
    <!--无数据的时候提醒-->
    <template v-if="flag">
      <el-row style="margin-top: 300px">
        暂无数据,请点击上方 <b style="color:red">新增</b> 按钮添加数据
      </el-row>
    </template>
  </div>

</template>

<script>

  export default {
    name: "tableDetails",
    data() {
      return {
        id: "",
        title: "",//标题
        content: "",//内容
        flag: false//是否提醒无消息指示旗
      }
    },
    methods: {
      showData(row) {
        if (row) {
          this.id = row.id;
          this.title = row.title;
          this.flag = false;
          this.content = row.memo.split('\n')

        }else {
          this.id = "";
          this.title = "";
          this.content = "";
          this.flag = true
        }
      },

    },
  }
</script>

<style scoped>
  .details {
    margin-left: 10px;
    margin-top: 16px;
    margin-right: 30px;
    height: 790px;
    background-color: white;
    border: 1px solid rgba(219, 219, 219, 1);
    border-radius: 3px;
    overflow: auto;
    box-sizing: border-box;
    padding-bottom:20px;
  }

  .title {
    margin-top: 16px;
    min-height: 53px;
    font-size: 24px;
    font-family: Microsoft YaHei, sans-serif;
    font-weight: 400;
    color: rgba(50, 50, 50, 1);
  }

  >>> .el-col {
    text-align: left;
  }

  >>> .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .detailDescTitle{
    color: #000;
    font-weight: 700;
    padding-right:10px;
  }
   .title{
     text-align: center;
    /*padding: 0 20px 20px 0;*/
    /*background-color: #ccc;*/
     border-bottom: 1px solid #ccc;
  }
  .tittle-box{
    text-align:center;
    word-break: break-all;
  }
  .title-btn-box{
    float: right;
  }

>>> .el-input.is-disabled .el-input__inner{
  overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
