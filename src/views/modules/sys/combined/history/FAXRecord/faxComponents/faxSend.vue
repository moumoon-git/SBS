<template>
  <div class="faxSend">
    <div class="faxSend__table">
      <el-table
        :data="acceptFaxs"
        style="width: 100%;overflow-y: auto;"
        height="660"
        :row-class-name="indexMethod"
        @row-click="tabClick"
      >
        <el-table-column label="发送时间">
          <template slot-scope="scope">
            {{ scope.row.faxUnit }}
          </template>
        </el-table-column>
        <el-table-column label="发送状态">
          <template slot-scope="scope">
            {{ scope.row.faxnumber }}
          </template>
        </el-table-column>
        <el-table-column label="收信人数">
          <template slot-scope="scope">
            {{ scope.row.startTime }}
          </template>
        </el-table-column>
        <el-table-column label="成功">
          <template slot-scope="scope">
            {{ scope.row.state }}
          </template>
        </el-table-column>
        <el-table-column label="失败">
          <template slot-scope="scope">
            {{ scope.row.state }}
          </template>
        </el-table-column>
      </el-table>
      <div class="faxSend__pagination">
        <!--<div class="faxSend__allPage">
          共{{ pageListNum }}条记录 第{{ page }}页/共{{
            Math.ceil(pageListNum / limit)
          }}页
        </div>-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          :page-size="limit"
          layout="prev, pager, next, jumper"
          :total="pageListNum"
        >
        </el-pagination>
      </div>
    </div>
    <div class="faxSend__faxList">
      <div class="faxSend__tab">
        <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true">
          <el-tab-pane
            :label="`发送队列(${successList.length + failList.length})`"
            name="sendList"
          >
          </el-tab-pane>
          <el-tab-pane
            :label="`发送成功(${successList.length})`"
            name="successList"
          ></el-tab-pane>
          <el-tab-pane
            :label="`发送失败(${failList.length})`"
            name="failList"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <div class="faxSend__btnContain">
        <el-button type="primary" size="small">失败重发</el-button>
        <el-button type="primary" size="small">取消发送</el-button>
      </div>
      <div class="faxSend__faxTable">
        <el-table
          :data="sendLists"
          style="width: 100%;overflow-y: auto;"
          height="560"
          :row-class-name="indexMethod"
          @row-click="tabClick"
        >
          <el-table-column label="单位">
            <template slot-scope="scope">
              {{ scope.row.faxUnit }}
            </template>
          </el-table-column>
          <el-table-column label="发送状态">
            <template slot-scope="scope">
              {{ scope.row.faxnumber }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="faxSend__readFax">
      <div v-if="faxFile.url" style="margin-top:20px;width: 95%">
        <read-fax :document="faxFile"></read-fax>
      </div>
      <div class="faxSend__image" v-else>
        <el-image :src="require('@/assets/img/noFile.png')"></el-image>
        <div style="color:#CAD5E8">暂无预览</div>
      </div>
      <div class="faxSend__readFaxFooter" v-if="faxFile.url">
        <el-image :src="require('@/assets/img/refresh.png')"></el-image>
        <el-image :src="require('@/assets/img/download.png')"></el-image>
        <el-image :src="require('@/assets/img/share.png')"></el-image>
      </div>
    </div>
  </div>
</template>

<script>
import readFax from "../../../fax/faxComponents/previewFax";
export default {
  components: {
    "read-fax": readFax
  },
  data() {
    return {
      acceptFaxs: [],
      faxFile: {
        url: ""
      },

      activeName: "sendList",
      sendLists: [], // 每次传真的队列详情

      limit: 10, // 每次请求条数
      page: 1, // 当前页数

      allPage: 0, // 总页数
      pageListNum: 0, // 总数据条数

      successList: ["465645", "4558879", "898746"],
      failList: ["9897448", "69746546"]
    };
  },

  methods: {
    indexMethod({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex;
      // console.log(row.index, rowIndex)
    },

    // 切换传真状态
    handleClick() {},

    // 点击表格某一行
    tabClick(row, event, column) {
      console.log("点击的行", row, event, column);
    },

    // 当前页数变化
    handleCurrentChange(val) {
      console.log("当前页数", val);
      this.page = val;
    },

    // 每次请求的条数变化
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.limit = val;
      this.allPage = Math.ceil(this.pageListNum / this.limit);
    }
  }
};
</script>

<style lang="less">
.faxSend {
  width: 100%;
  display: flex;

  .faxSend__table {
    width: 35%;
    min-width: 400px;

    .faxSend__pagination {
      display: flex;
      align-items: center;
      .faxSend__allPage {
        color: #999999;
        font-size: 14px;
        align-self: flex-end;

        margin-bottom: 5px;
        margin-left: 10px;
      }
    }
  }

  .faxSend__faxList {
    width: 25%;
    min-width: 325px;

    .faxSend__btnContain {
      margin-left: 10px;
    }

    .faxSend__faxTable {
      margin-top: 10px;
    }

    .el-tabs,
    .el-tabs--top {
      // width: 700px;
      width: 100%;
      padding-top: 0;
      min-width: 325px !important;
    }

    .el-tabs__nav-scroll {
      display: flex;
      justify-content: center;

      .el-tabs__nav {
        height: 45px !important;
      }
    }

    .el-tabs__item {
      // width: 130px;
      width: 33%;
      text-align: center;
      margin: 0;
      height: 45px !important;
    }

    .el-tabs__content {
      // margin: auto 20px auto 20px;
    }
  }

  .faxSend__readFax {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 40%;
    background-color: #f9f9f9;

    .faxSend__image {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 40px;
    }

    .faxSend__readFaxFooter {
      width: 25%;
      display: flex;
      justify-content: space-around;
      margin-bottom: 30px;
    }
  }
}
</style>
