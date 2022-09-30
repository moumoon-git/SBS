<template>
  <div class="faxAccept">
    <div class="faxAccept__table">
      <el-table
        :data="acceptFaxs"
        style="width: 100%;overflow-y: auto;"
        height="629"
        :row-class-name="indexMethod"
        @row-click="tabClick"
      >
        <el-table-column
          label="单位"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.sendUnit }}
          </template>
        </el-table-column>
        <el-table-column
          label="传真号码"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.faxnumber }}
          </template>
        </el-table-column>
        <el-table-column
          label="时间"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.recicevDate }}
          </template>
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
        >
          <template slot-scope="scope">
            <span
              :style="{'color':(scope.row.status === 1?'red':'#666666')}"
            >
              {{ scope.row.status === 1?'未读':'已读' }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="faxAccept__pagination">
        <!--<div class="faxAccept__allPage">
          共{{ pageListNum }}条记录 第{{ page }}页/共{{
            Math.ceil(pageListNum / limit)
          }}页
        </div>-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageListNum"
        >
        </el-pagination>
      </div>
    </div>
    <div class="faxAccept__readFax">
      <div v-if="faxFile.url" style="margin-top:20px;width: 95%">
        <read-fax :document="faxFile"></read-fax>
      </div>
      <div class="faxAccept__image" v-else>
        <el-image :src="require('@/assets/img/noFile.png')"></el-image>
        <div style="color:#CAD5E8">暂无预览</div>
      </div>
      <div class="faxAccept__readFaxFooter" v-if="faxFile.url">
        <el-image :src="require('@/assets/img/refresh.png')"></el-image>
        <el-image :src="require('@/assets/img/download.png')"></el-image>
        <el-image :src="require('@/assets/img/share.png')"></el-image>
      </div>
    </div>
  </div>
</template>

<script>
import bus from "@/utils/bus.js";
import readFax from "../../../fax/faxComponents/previewFax";
export default {
  components: {
    "read-fax": readFax,
  },
  data() {
    return {
      acceptFaxs: [],
      faxFile: {
        url: "",
      },

      limit: 10, // 每次请求条数
      page: 1, // 当前页数

      allPage: 0, // 总页数
      pageListNum: 0, // 总数据条数
    };
  },

  mounted() {
    // 获取传真记录数据
    this.getfaxRecord();
    bus.$off('getSearchParams');
    bus.$on('getSearchParams', (searchParams) => {
      this.$http({
        url: this.$http.adornUrl('/faxes/faxesreceive/searchfaxandunit'),
        method: 'get',
        params: this.$http.adornParams({
          // token: "PC_27151df5610118f1a41b71bbc5ca975c"
          page: this.page,
          size: this.limit,
          starttime: searchParams.startTime,
          endtime: searchParams.endTime,
          faxnumber: searchParams.search,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.acceptFaxs = data.data.list;
        } else {
          this.$message.error(data.msg);
        }
      });
    });
  },

  methods: {
    /**
     * @description: 获取传真记录数据
     */
    getfaxRecord() {
      this.$http({
        url: this.$http.adornUrl('/faxes/faxesreceive/searchfaxandunit'),
        method: 'get',
        params: this.$http.adornParams({
          page: 1,
          size: 10,
          starttime: '',
          endtime: '',
          faxnumber: '',
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.acceptFaxs = data.data.list;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    indexMethod({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex;
      // console.log(row.index, rowIndex)
    },

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
    },
  },
};
</script>

<style lang="less">
.faxAccept {
  width: 100%;
  display: flex;

  .faxAccept__table {
    width: 60%;
    min-width: 725px;

    .faxAccept__pagination {
      display: flex;
      align-items: center;
      .faxAccept__allPage {
        color: #999999;
        font-size: 14px;
        align-self: flex-end;

        margin-bottom: 5px;
        margin-left: 10px;
      }
    }
  }

  .faxAccept__readFax {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 40%;

    .faxAccept__image {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 40px;
    }

    .faxAccept__readFaxFooter {
      width: 25%;
      display: flex;
      justify-content: space-around;
      margin-bottom: 30px;
    }
  }
}
</style>
