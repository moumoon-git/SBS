<template>
  <div class="faxState">
    <el-dialog
      :visible.sync="checkFaxState"
      width="700px"
      custom-class="faxState__stateBoard"
    >
      <div slot="title" class="faxState__dialogHeader">
        发送队列
      </div>

      <div class="faxState__header">
        <el-row>
          <el-col :span="6" style="text-align:center;"
            ><div class=""></div>
            {{ faxDetail.fax_name }}</el-col
          >
          <!-- <el-col :span="1" style="text-align:center;">|</el-col>
          <el-col :span="3" style="text-align:center;"
            ><div class="">
              文件<span style="font-size:16px;font-weight:700">{{
                faxInfo.pages
              }}</span
              >页
            </div></el-col
          >
          <el-col :span="1" style="text-align:center;">|</el-col>

          <el-col :span="3" style="text-align:center;"
            ><div class="">
              共<span style="font-size: 16px;font-weight:700">{{
                faxInfo.counts
              }}</span
              >份
            </div></el-col
          > -->
          <el-col :span="10" style="text-align:right;"
            ><el-button type="primary" size="mini">全部重发</el-button></el-col
          >
        </el-row>
      </div>

      <div class="faxState__nav">
        <!--<div>
          <el-button type="text">{{
            `发送队列(${successList.length + failList.length})`
          }}</el-button>
        </div>
        <div>
          <el-button type="text">{{
            `发送成功(${successList.length})`
          }}</el-button>
        </div>
        <div>
          <el-button type="text">{{
            `发送失败(${failList.length})`
          }}</el-button>
        </div>-->
        <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true">
          <el-tab-pane
            :label="`发送队列(${faxDetail.numberCount})`"
            name="sendList"
          >
            <fax-list ref="send" :listType="listType"></fax-list>
          </el-tab-pane>
          <el-tab-pane
            :label="`发送成功(${faxDetail.successCount})`"
            name="successList"
            ><fax-list ref="success" :listType="listType"></fax-list
          ></el-tab-pane>
          <el-tab-pane
            :label="`发送失败(${faxDetail.failCount})`"
            name="failList"
            ><fax-list ref="fail" :listType="listType"></fax-list
          ></el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import faxList from "./faxList";
export default {
  components: {
    "fax-list": faxList
  },
  data() {
    return {
      checkFaxState: false,
      activeName: "sendList",
      faxInfo: {
        name: "卡西欧使用手册",
        pages: 3,
        counts: 50
      },

      listType: "sendList",
      // id: "",
      // historyId: "",
      faxDetail: {}
      // sendList: ["45456"], // 发送队列
      // successList: ["465645", "4558879", "898746"], // 成功队列
      // failList: ["9897448", "69746546"] // 失败队列
    };
  },
  methods: {
    handleClick(e) {
      console.log(e);
      let tabName = e.name;

      switch (tabName) {
        case "sendList":
          this.listType = "sendList";
          this.$refs.send.getFaxList(3, this.faxDetail.id);
          // this.getFaxList(3);
          break;
        case "successList":
          this.listType = "successList";
          this.$refs.send.getFaxList(1, this.faxDetail.id);
          // this.getFaxList(1);
          break;
        case "failList":
          this.listType = "failList";
          this.$refs.send.getFaxList(2, this.faxDetail.id);
          // this.getFaxList(2);
          break;
      }
    }

    // getFaxList(status, id) {
    //   this.$http({
    //     url: this.$http.adornUrl("/faxes/faxesinfo/searchFaxDetail"),
    //     method: "get",
    //     params: this.$http.adornParams({
    //       page: this.page,
    //       size: this.pageSize,
    //       starttime: "",
    //       endtime: "",
    //       status: status,
    //       id: id
    //     })
    //   }).then(({ data }) => {
    //     console.log("表格数据", data);
    //   });
    // }
  }
};
</script>

<style lang="less">
.faxState {
  .faxState__stateBoard {
    position: relative;
    height: 700px;
    .faxState__dialogHeader {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 40px;
      background: #f1f4f6;
      line-height: 40px;
      padding-left: 20px;
      color: #333333;
    }

    .faxState__header {
      font-size: 12px;
      color: #666666;
      font-weight: 500;
    }

    .faxState__nav {
      position: absolute;
      height: 40px;
      left: 0;
      right: 0;
      margin-top: 14px;
      background: #f7f8fa;

      .el-tabs,
      .el-tabs--top {
        // width: 700px;

        padding-top: 0;
        min-width: 650px !important;
      }

      .el-tabs__nav-scroll {
        display: flex;
        justify-content: center;

        .el-tabs__nav {
          height: 45px !important;
        }
      }

      .el-tabs__item {
        width: 210px;
        text-align: center;
        margin: 0;
        height: 45px !important;
      }

      .el-tabs__content {
        margin: auto 20px auto 20px;
      }
    }
  }
}
</style>
