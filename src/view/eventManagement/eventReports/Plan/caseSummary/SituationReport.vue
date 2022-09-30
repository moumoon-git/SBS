<template>
  <div>
    <div class="addButton">
      <el-button @click="upload" type="primary" size="small"
        >点击上传</el-button
      >
      <!-- <el-upload
  action="123"
  :show-file-list="false"
  with-credentials
  :before-upload="beforeUpload"
  >
  <el-button size="small" type="primary">点击上传</el-button>
</el-upload> -->
    </div>
    <div style="width: 100%; margin-top: 10px">
      <!--表格-->
      <div>
        <el-table
          ref="elTable1"
          :data="tableData"
          highlight-current-row
          :header-cell-style="{ background: '#E6E6E6', color: '#606266' }"
          style="width: 100%; height: 590px; overflow: auto"
        >
          <el-table-column label="上传名称" width="250px" align="center">
            <template slot-scope="scope">
              {{ scope.row.url.substring(scope.row.url.lastIndexOf("/") + 1) }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            v-for="(item, key) in tableColumn"
            :key="key"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            :resizable="false"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" width="250px" align="center">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="下载"
                placement="top"
              >
                <i
                  class="el-icon-download"
                  @click="handleDownloadItem(scope.row)"
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>

              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top"
              >
                <i
                  class="el-icon-delete-solid"
                  @click="handleDeleteItem(scope.row)"
                  style="
                    font-size: 24px;
                    margin-left: 1vw;
                    color: #9fc8fe;
                    cursor: pointer;
                  "
                ></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--表格分页-->
      <div style="padding: 10px 0">
        <el-pagination
          :small="pagingSize"
          :page-size="pageSize"
          :page-sizes="[10, 20, 30, 40]"
          :total="total"
          :current-page="currentPage"
          @size-change="handleSizeChange"
          @current-change="pageMode"
          layout="total, prev, pager, next, sizes, jumper"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import myTable from "@/components/tables/tables";
import Bus from "@/components/common/js/eventBus";
import axios from "axios";
import Qs from "qs";
import { splitPdf } from "../../../../../assets/interface/interface";

export default {
  name: "hiddenDanger",
  components: {
    myTable,
  },
  data() {
    return {
      tableColumn: [
        {
          prop: "startTime",
          label: "上传时间",
        },
      ],
      tableData: [],
      pagingSize: true,
      total: 0,
      pageSize: 10, //每页多少条
      currentPage: 1, //当前页
      fileUrl: window.g.FileUrl, // 文件服务器地址
    };
  },
  created() {
    this.getReportData();
  },
  mounted() {
    Bus.$on("summary", () => {
      this.reportDatas();
    });
  },
  methods: {
    getReportData() {
      this.id = sessionStorage.getItem("newID");
      if (this.id == "" || this.id == null || this.id == "newID") {
        return;
      }
      this.reportDatas();
    },
    reportDatas() {
      let data = {
        size: this.pageSize,
        page: this.currentPage,
        eventId: this.id,
      };
      this.$api.reportList(data).then((res) => {
        if (res.errorcode == "0") {
          this.tableData = res.data.data;
          this.total = res.data.totalElements;
        }
      });
    },
    beforeUpload(file) {
      let fd = new FormData();
      fd.append("file", file);
      fd.append("eventId", this.id);
      this.$api.reportAdd(fd).then((res) => {
        if (res.errorcode == 0) {
          this.$message.success("上传文件成功");
          this.reportDatas();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    handleCurrentChange(row) {
      this.tableRowData = row;
    },
    handleSizeChange(val) {
      this.tableRowData = [];
      this.pageSize = val;
      this.reportDatas();
    },
    pageMode(val) {
      this.tableRowData = [];
      this.currentPage = val;
      this.reportDatas();
    },
    handleDeleteItem(row) {
      let data = {
        id: row.id,
      };

      this.$confirm("删除当前信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 删除文件服务器对应文件
          axios
            .get(`${this.fileUrl}/eos/event/sum/delFile?filePath=${row.url}`)
            .then((res) => {
              if (res.data.errorcode != 0) {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
                return;
              }

              this.$api.reportDelete(data).then((res) => {
                if (res.errorcode != 0) {
                  this.$message({
                    message: res.msg,
                    type: "error",
                  });
                  return;
                }
                this.$message({
                  message: "删除成功!",
                  type: "success",
                });
                this.reportDatas();
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除!",
          });
        });
    },
    /**
     * @description: 下载当前行情况报告
     * @param {*}
     * @return {*}
     */
    handleDownloadItem(row) {
      // author:xuchuangxing lastUpdateTime:2021/1/17 下载去除加密（之前加密处理文件名有 + 号问题后端一处理）
      window.location.href = `${this.fileUrl}/eos/event/sum/downloadFile?fileName=${row.name}&filePath=${row.url}`;
    },
    upload() {
      Bus.$emit("openUploader", {
        successfulCallbackName: "summary", // 传入的参数
      });
    },
  },
  destroyed() {
    Bus.$off("summary");
  },
};
</script>

<style scoped>
.addButton {
  width: 100%;
  text-align: left;
}
>>> .el-input-number {
  width: 100%;
}
>>> .is-scrolling-none {
  height: 540px;
}
</style>
