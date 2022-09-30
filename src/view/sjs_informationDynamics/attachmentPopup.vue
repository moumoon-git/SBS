<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="isDialogVisible"
      :close-on-click-modal="false"
      @close="closeDialog"
      width="360px"
    >
      <div>
        <el-row
          class="att-checkbox"
          v-for="(item, index) in attList"
          :key="index"
        >
          <el-checkbox
            v-model="item.checked"
            :title="item.title + '.' + item.extension"
            @change="changeBox(item)"
            ><i
              style="vertical-align: middle"
              :class="fileType[item.extension]"
            ></i
            ><span
              style="
                width: 180px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-block;
                vertical-align: middle;
              "
              >{{ item.title + "." + item.extension }}</span
            ></el-checkbox
          >
        </el-row>
        <el-row style="display: flex; justify-content: center">
          <el-button
            type="primary"
            style="width: 240px; color: #fff; padding: 9px 20px"
            @click="handleDownload"
            >下载</el-button
          >
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const UrlRoot = window.g.ApiUrl;
export default {
  name: "attachmentPopup",
  data() {
    return {
      title: "附件下载", //标题
      isDialogVisible: false, //是否显示弹窗
      attList: [],
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
      wordUrl: "",
      fileId: "",
    };
  },
  computed: {
    editFile() {
      return function (type) {
        if (
          type == "doc" ||
          type == "docx" ||
          type == "xls" ||
          type == "xlsx"
        ) {
          return true;
        } else {
          return false;
        }
      };
    },
  },
  methods: {
    closeDialog() {
      this.attList = [];
      //清空表单内容以及校验信息
      this.isDialogVisible = false;
    },
    showAtt(attList, id) {
      this.fileId = id;
      this.attList = JSON.parse(JSON.stringify(attList));
      console.log("组件：", this.attList);
    },
    changeBox(item) {
      if (!item.exists) {
        this.$message({
          type: "info",
          message: "该文件不存在!",
        });
        item.checked = false;
      }
    },
    preview(item) {
      if (!item.exists) {
        this.$message({
          type: "info",
          message: "该文件不存在!",
        });
        item.checked = false;
        return;
      }
      if (item.extension == "doc" || item.extension == "docx") {
        this.wordUrl = `javascript:POBrowser.openWindowModeless('${UrlRoot}/pageoffice/word?filePath=${item.path}&attachmentId=${item.id}&fileId=${this.fileId}
          ','width=1200px;height=800px;')`;
      } else if (item.extension == "xls" || item.extension == "xlsx") {
        this.wordUrl = `javascript:POBrowser.openWindowModeless('${UrlRoot}/pageoffice/excel?filePath=${item.path}&attachmentId=${item.id}&fileId=${this.fileId}
          ','width=1200px;height=800px;')`;
      }
    },
    handleDownload() {
      let bool = this.attList.some((e) => e.checked);
      if (!bool) {
        this.$message({
          type: "info",
          message: "请选择下载文件!",
        });
      }
      this.attList.forEach((t) => {
        if (t.checked) {
          const iframe = document.createElement("iframe");
          iframe.style.display = "none"; // 防止影响页面
          iframe.style.height = 0; // 防止影响页面
          iframe.src = `${UrlRoot}/download/downloadFile?filepath=${
            t.path
          }&filename=${encodeURI(t.title)}.${t.extension}`;
          //console.log(encodeURI(t.title)+ '.' + t.extension)
          document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
          setTimeout(() => {
            //iframe.remove();
            document.body.removeChild(iframe);
          }, 6000);
          // this.closeDialog()
          // function downloadMulti (name, url) {
          //   var aDom = document.createElement('a')
          //   var evt = document.createEvent('HTMLEvents')
          //   evt.initEvent('click', false, false)
          //   aDom.download = name
          //   aDom.href = url
          //   aDom.dispatchEvent(evt)
          //   aDom.click()
          // }
          // downloadMulti(t.title+ '.' + t.extension,UrlRoot+t.path)
        }
      });
    },
  },
};
</script>

<style scoped>
.att-checkbox {
  width: 240px;
  height: 32px;
  border: 1px solid #ccc;
  margin: 0 auto 15px;
  background: #eee;
  text-align: left;
  display: flex;
  align-items: center;
  border-radius: 5px;
  padding: 0 10px;
}
.att-checkbox .onlineEdit {
  margin-left: 10px;
}
</style>
