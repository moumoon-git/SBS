<!--
 * @Author: your name
 * @Date: 2021-01-06 16:58:37
 * @LastEditTime: 2021-01-07 11:21:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GGECSd:\xuchuangxing\SJSEOS\src\view\informationDynamics\document\watchHistory.vue
-->
<template>
  <div>
    <el-dialog
      title="编辑历史"
      width="400px"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="closeHistory"
    >
      <el-timeline>
        <el-timeline-item
          :timestamp="item.updateTime"
          placement="top"
          v-for="item in historyData"
          :key="item.id"
        >
          <div style="display: flex; justify-content: space-between">
            <div style="width: 200px">
              {{ item.operator }}
              <i
                style="vertical-align: middle"
                :class="fileType[item.extension]"
              ></i
              >{{ item.title }}
            </div>
            <div>
              <a
                :href="wordUrl ? wordUrl : undefined"
                @click="preview(item)"
                style="
                  color: #fb7293;
                  border-bottom: 1px solid #fb7293;
                  cursor: pointer;
                "
                >预览
              </a>
              <span
                style="
                  color: #54a0ff;
                  border-bottom: 1px solid #54a0ff;
                  margin-left: 10px;
                  cursor: pointer;
                "
                @click="reduction(item)"
                >还原</span
              >
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
const UrlRoot = window.g.ApiUrl;
export default {
  data() {
    return {
      dialogVisible: false,
      historyData: [],
      wordUrl: "",
      fileId: "",
      fileType: {
        doc: "icon-word",
        docx: "icon-word",
        xls: "icon-excel",
        XLS: "icon-excel",
        xlsx: "icon-excel",
        XLSX: "icon-excel",
        pdf: "icon-pdf",
        png: "icon-pic",
        PNG: "icon-pic",
        jpg: "icon-pic",
        jpeg: "icon-pic",
        gif: "icon-pic",
        txt: "icon-txt",
        zip: 'icon-zip',
        rar: 'icon-rar'
      },
    };
  },
  methods: {
    /**
     * @description: 初始化历史数据
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/1/6 18:02
     * @param {*} fileId // 当前选择行文档Id
     * @return {*}
     */
    initData(fileId) {
      this.fileId = fileId;
      this.$api.documentList({ fileId }).then((res) => {
        if (res.errorcode == 0) {
          this.historyData = res.data;
        }
      });
    },
    /**
     * @description: 预览文档
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/1/6 18:02
     * @param {*} id // 当前选择记录信息
     * @return {*}
     */
    preview(item) {
      if (item.extension == "doc" || item.extension == "docx") {
        this.wordUrl = `javascript:POBrowser.openWindowModeless('${UrlRoot}/pageoffice/word?filePath=${item.path}&attachmentId=${item.appAttachmentId}&fileId=${this.appFileId}
          ','width=1200px;height=800px;')`;
      } else if (item.extension == "xls" || item.extension == "xlsx") {
        this.wordUrl = `javascript:POBrowser.openWindowModeless('${UrlRoot}/pageoffice/excel?filePath=${item.path}&attachmentId=${item.appAttachmentId}&fileId=${this.appFileId}
        ','width=1200px;height=800px;')`;
      }
    },
    /**
     * @description: 还原到这次历史文档
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/1/6 18:02
     * @param {*} id // 当前选择记录信息
     * @return {*}
     */
    reduction(item) {
      this.$api
        .documentRestore({
          fileId: item.appFileId,
          attachmentId: item.appAttachmentId,
          filePath: item.path,
        })
        .then((res) => {
          if (res.errorcode == 0) {
            this.initData(this.fileId);
          }
        });
    },
    /**
     * @description: 关闭历史弹窗
     * @author: xuchuangxing
     * @lastUpdateTime : 2021/1/6 18:02
     * @return {*}
     */
    closeHistory() {
      this.dialogVisible = false;
      this.$emit("closeHistory");
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-timeline-item__tail {
  border-left: 2px solid #409eff;
}
/deep/ .el-timeline-item__node {
  background-color: white;
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.27);
}
</style>