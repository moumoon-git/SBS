<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="isDialogVisible"
      @close="closeDialog"
      width="360px"
      :close-on-click-modal="false"
    >
      <div>
        <el-row
          class="att-checkbox"
          v-for="(item, index) in attList"
          :key="index"
        >
          <el-checkbox
            v-model="item.checked"
            :title="item.fileOldName"
            @change="changeBox(item)"
          >
            <i
              style="vertical-align: middle"
              :class="fileType[item.extension]"
            ></i>
            <span
              style="
                width: 180px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-block;
                vertical-align: middle;
              "
              >{{ item.fileOldName }}</span
            >
          </el-checkbox>
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
import cookie from "js-cookie";

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
    };
  },
  methods: {
    closeDialog() {
      this.attList = [];
      //清空表单内容以及校验信息
      this.isDialogVisible = false;
    },
    /**
     * @description 显示附件
     * @lastEditor hexinting
     * @lastEditedDate 2021-03-19
     */
    showAtt(attList) {
      console.log("组件：", this.attList);
      let list = JSON.parse(JSON.stringify(attList));
      list.forEach(el => {
        if (!el.extension) {
          let extension = el.fileOldName.slice(
            el.fileOldName.lastIndexOf(".") + 1,
            el.fileOldName.length
          );
          el.extension = extension;
        }
      })
      this.attList = list;
    },
    changeBox(item){
      if(!item.exists){
        this.$message({
          type: 'info',
          message: '该文件不存在!'
        })
        item.checked = false
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
          // window.open(`${UrlRoot}/download/downloadFile?filepath=${t.fileUrl}&filename=${encodeURI(t.fileOldName)}`)
          // window.open(
          //   `${window.g.ApiUrl}/${t.fileUrl}?type=download&fileName=${
          //     t.fileOldName
          //   }&Authorization=${
          //     localStorage.getItem("token") ? localStorage.getItem("token") : ""
          //   }`
          // );
          // const iframe = document.createElement("iframe");
          // iframe.style.display = "none";  // 防止影响页面
          // iframe.style.height = 0;  // 防止影响页面
          // iframe.src = `${UrlRoot}/download/downloadFile?filepath=${t.fileUrl}&filename=${encodeURI(t.fileOldName)}`;
          // document.body.appendChild(iframe);  // 这一行必须，iframe挂在到dom树上才会发请求
          // setTimeout(()=>{
          //    document.body.removeChild(iframe);
          // }, 6000);

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
          const iframe = document.createElement("iframe");
          iframe.style.display = "none";  // 防止影响页面
          iframe.style.height = 0;  // 防止影响页面
          iframe.src = `${window.SITE_CONFIG['cloudUrl']}/fileupload/fileDownload/downloadFile?token=${localStorage.getItem("token") || cookie.get("token")}&filepath=${t.fileUrl}&filename=${encodeURI(t.fileOldName)}`;
          // iframe.src = `${window.g.ApiUrl}${t.fileUrl}`+`?Authorization=${localStorage.getItem("token")? localStorage.getItem("token"): ""}`
          console.log(iframe.src)
          //console.log(encodeURI(t.title)+ '.' + t.extension)
          document.body.appendChild(iframe);  // 这一行必须，iframe挂在到dom树上才会发请求
          setTimeout(()=>{
            //iframe.remove();
            document.body.removeChild(iframe);
          }, 6000);
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
</style>
