<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :row-style="{height:'30px'}"
      cell-class-name="noticeTableClass"
    >
      <el-table-column
        prop="title"
        label="标题"
        width="180"
        align="center"
      />
      <el-table-column
        prop="noticeType"
        label="类型"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          <div>
            {{ returnTypeName[scope.row.noticeType-1] }}
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="content"
        label="内容"
        align="center"
      >
        <template slot-scope="scope">
          <div :class="$style.contenttemplate">
            {{ dealContentFun(scope.row.content) }}
          </div>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="platformName"
        label="来信单位"
        align="center"
      />
      <el-table-column
        prop="publishTime"
        label="来信时间"
        align="center"
      />
      <el-table-column
        prop="address"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            :class="$style.look"
            type="text"
            size="small"
            @click="handleClick(scope.row.id)"
          />
          <el-button
            :class="$style.send"
            type="text"
            size="small"
            @click="sendToOther(scope.row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
    <MessageDetail ref="MessageDetailRef" />
    <PlatformDialog
      ref="PlatformDialogRef"
      @platformSelect="sendToOtherFun"
    />
    <ContactDialog
      ref="ContactDialogRef"
      @contactSelect="sendToOtherFun"
    />
  </div>
</template>
<script>
import MessageDetail from './MessageDetail.vue'; // 详情弹窗
import PlatformDialog from './SendNotifyTab/PlatformDialog.vue'; // 选择平台
import ContactDialog from './SendNotifyTab/ContactDialog.vue'; // 选择联系人
// 通知公告详情弹窗
export default {
  components: {
    MessageDetail,
    PlatformDialog,
    ContactDialog,
  },
  data() {
    return {
      noticeId: 0, // 当前查看的通告id
      tableData: [],
      returnTypeName: ['通知', '公告', '预警'],
    };
  },
  methods: {
    // 查看详情
    handleClick(data) {
      this.noticeId = data;
      this.$refs.MessageDetailRef.noticeId = data;
      this.$refs.MessageDetailRef.dialogVisible = true;
      this.$refs.MessageDetailRef.getNoticeContent();
      // this.openMessageTip();
    },
    // 转发
    sendToOther(id) {
      this.noticeId = id;
      this.$refs.ContactDialogRef.getDataList([]);
    },
    // 确认转发
    sendToOtherFun(arr) {
      console.log('%c [ arr ]', 'font-size:13px; background:pink; color:#bf2c9f;', arr);
      if (this.noticeId === 0) {
        return this.$message({
          message: '通告数据有误',
          type: 'warning',
        });
      }
      const contactorIds = [];
      arr.forEach((element) => {
        contactorIds.push(element.id);
      });
      if (contactorIds === []) {
        return this.$message({
          message: '请选择平台',
          type: 'warning',
        });
      }
      const data = {
        noticeId: this.noticeId, // 通告id数组
        contactorIds, // 联系人数组
        platformIds: [], // 平台id数组
      };
      this.$api.sendNoticeToOther(data).then((res) => {
        if (res.errorcode === 0) {
          this.$message({
            message: '转发成功',
            type: 'success',
          });
        } else {
          this.$message({
            message: `转发失败:${res.msg}`,
            type: 'warning',
          });
        }
      });
    },
    // 处理内容
    dealContentFun(str) {
      str = str.replaceAll('&lt;','<')
      str = str.replaceAll('&gt;','>')
      let text = document.createRange().createContextualFragment(str).children[0]
      if(text) {
        return text.innerHTML.split('<')[0];
      }
      return ''
    },
  },

};
</script>
<style module lang="scss">
.look {
  width: 24px;
  height: 17px;
  background: url(./assets/look.svg) no-repeat;
  &:hover {
    background: url(./assets/lookActive.svg) no-repeat;
  }
}
.send {
  width: 18px;
  height: 20px;
  background: url(./assets/send.svg) no-repeat;
  &:hover {
    background: url(./assets/sendActive.svg) no-repeat;
  }
}
.contenttemplate{
    max-height: 26px;
    overflow: hidden;
}
</style>
<style lang="less">
.noticeTableClass{
 height: 61px;
}
</style>
