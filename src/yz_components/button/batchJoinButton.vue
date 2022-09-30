<template>
  <el-upload
    style="float: right;"
    class="upload-demo"
    ref="upload"
    accept=".xlsx, .xls"
    :headers="{Authorization: $window.localStorage.getItem('token') ? $window.localStorage.getItem('token') : ''}"
    :limit="1"
    :action="action"
    :file-list="fileList"
    :before-upload="beforeUpload"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :http-request="httpRequest"
    :show-file-list="false"
  >
    <el-button slot="trigger" icon="iconfont icon-piliangjiaru" type="primary">批量加入</el-button>

    <el-dialog
      title="导入情况"
      :visible.sync="dialogVisible"
      center
      width="600px"
      @close="closeDialog"
      :close-on-click-modal="false"
    >
      <div style="text-align: left;">导入情况:{{SituationMessage}}</div>
      <el-button
        type="primary"
        @click="failsBtn"
        plain
        size="mini"
        style="text-align: left;margin-top: 10px;margin-bottom: 10px;"
      >错误详情</el-button>
      <ul style="padding: 0;margin: 0;text-align: left;" v-if="show">
        <li
          v-for="(fails,index) in failsData"
          style="text-align: left;"
          :key="index"
        >第{{fails.row}}行,{{fails.msg}}</li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="surnBtn">确 定</el-button>
      </span>
    </el-dialog>
  </el-upload>
</template>

<script>
import { ImportData } from '../../assets/js/importExcel';

export default {
    name: 'batchJoinButton',
    props: ['pId', 'groupType'],
    data() {
        return {
            action: '', //excel导入地址
            fileType:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            fileList: [],
            dialogVisible: false,
            SituationMessage: '', //导入情况
            failsData: [], //错误数据
            treePid: '',
            show: false,
        };
    },
    computed: {
        pidNull() {
            return this.$store.getters.getGroupId;
        },
    },
    methods: {
        handleRemove(file, fileList) {},
        handlePreview(file) {},
        beforeUpload(file) {
            this.$emit('handleBatchJoin');
            if (this.pidNull !== '' && this.pidNull != null) {
                this.treePid = this.pidNull;
                return true;
            } else {
                this.treePid = 0;
                return true;
            }
        },
        httpRequest(item) {
            console.log(this.$store.getters.getGroupType);
            this.fileList.push(item.file);
            let formData = new FormData();
            formData.append('file', this.fileList[0]);
            formData.append('dictType', this.$store.getters.getGroupType);
            // formData.append("pid", this.treePid);
            formData.append('pid', this.pidNull);
            this.$api.importFromContactorExcel(formData).then(res => {
                this.dialogVisible = true;
                let fails = res.data.fails;
                this.SituationMessage =
                    '格式正确:' +
                    res.data.successNum +
                    '条,' +
                    '格式错误:' +
                    fails.length +
                    '条';
                this.failsData = fails;
                this.fileList = [];
                this.$emit('refreshData');
            });
        },
        failsBtn() {
            this.show = !this.show;
        },
        surnBtn() {
            this.dialogVisible = false;
        },
        closeDialog() {
            this.dialogVisible = false;
        },
    },
};
</script>

<style scoped>
@import '../../assets/font/iconfont.css';

li {
    padding: 0;
    margin: 0;
    list-style: none;
}
.upload-demo >>> .el-button--primary {
    padding: 11px 20px;
}
</style>
