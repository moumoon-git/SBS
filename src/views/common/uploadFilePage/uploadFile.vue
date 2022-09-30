<template>
  <div style="display: inline-block;">
    <el-popover
      placement="top"
      v-model="visible"
    >
      <div :class="$style.content">
        <div :class="$style.title">
          <span>登录页文件</span>
          <i class="el-icon-close" @click="visible=false"/>
        </div>
        <div :class="$style.main" v-loading="loading">
          <ul v-if="upFileList.length">
            <li v-for="item in upFileList" :key="item.id">
              {{ item.fileName }}
              <sv-table-operation
                :class="$style.operation"
                style="width: 100px;"
                @delete="deleteFile(item)"
                @edit="openEditDialog('edit',item)"
                @view="openViewDialog(item)"
              />
            </li>
          </ul>
          <div v-else>
            暂无上传文件！
          </div>
        </div>
        <div :class="$style.footer">
          <el-button type="primary" @click="openEditDialog('add')">
            新增
          </el-button>
        </div>
      </div>
      <span slot="reference" :class="$style.uploadIcon" @click="getUpFileList"/>
    </el-popover>
    <addOrEditUploadDialog ref="addOrEditUploadDialogRef" />
    <viewUploadDialog ref="viewUploadDialogRef" />
    <sv-dialog-hint
      ref="delete_hint"
      type="delete"
      @confirm="batchDelete(deleteItem)"
    />
  </div>
</template>
<script>
import addOrEditUploadDialog from './components/addOrEditUploadDialog.vue';
import viewUploadDialog from './components/viewUploadDialog.vue';

export default {
  name: 'uploadFile',
  components: {
    addOrEditUploadDialog,
    viewUploadDialog,
  },
  data() {
    return {
      visible: false,
      // 上传文件列表
      upFileList: [],
      // 删除对象
      deleteItem: '',
      loading: false,
    };
  },
  methods: {
    /**
     * 获取登录页文件记录列表
     */
    async getUpFileList() {
      this.loading = true;
      const request = {
        method: 'get',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: '/loginPageFile/list',
      };
      try {
        const { data } = await this.$http(request);
        if (data.code === 0) {
          this.upFileList = data.data;
        } else {
          this.$message.error(`获取登录页文件记录列表失败,失败原因${data.msg}`);
        }
      } catch (error) {
        this.$message.error(`获取登录页文件记录列表出错,失败原因${error}`);
      } finally {
        this.loading = false;
      }
    },
    /**
     * 打开查看弹窗
     */
    openViewDialog(item) {
      this.$refs.viewUploadDialogRef.open(item);
    },
    /**
     * 打开修改或新增弹窗
     */
    openEditDialog(status, item = '') {
      this.$refs.addOrEditUploadDialogRef.open(status, item);
    },
    /**
     * 点击删除按钮
     */
    deleteFile(item) {
      this.deleteItem = item;
      this.$refs.delete_hint.visible = true;
    },
    /**
     * 删除登录页文件列表
     */
    async batchDelete() {
      this.loading = true;
      const request = {
        method: 'get',
        baseURL: window.SITE_CONFIG.baseUrl,
        url: 'loginPageFile/delete',
        params: {
          id: this.deleteItem.id,
          path: this.deleteItem.url,
        },
      };
      try {
        const { data } = await this.$http(request);
        if (data.code === 0) {
          this.$message.success('删除成功！');
          this.getUpFileList();
        } else {
          this.$message.error(`删除文件记录列表失败,失败原因${data.msg}`);
        }
      } catch (error) {
        this.$message.error(`删除文件记录列表出错,失败原因${error}`);
      } finally {
        this.loading = false;
      }
    },
  },
};

</script>
<style module lang="scss">
:global(.el-popover){
  padding: 0px;
  border-radius: 4px;
}
.uploadIcon{
  display: inline-block;
  outline: 0;
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin: 0 10px;
  cursor: pointer;
  background:  no-repeat center/100% 100% url('./img/uploadFile.svg');
}
.content{
  min-height: 200px;
  width: 220px;
  max-height: 250px;
  border-radius: 4px;
  padding: 0px 10px;
  .title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    border-bottom: 1px solid #F2F2F2;
    &span:first-child{
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
    }
    i{
      cursor: pointer;
    }
  }
  .main{
    padding: 5px 0px;
    max-height: 150px;
    min-height: 120px;
    overflow: auto;
    overflow-x: hidden;
    box-sizing: border-box;
    ul{
      padding: 0px;
      li{
        display: flex;
        justify-content: space-between;
        height: 35px;
        list-style: none;
        cursor: pointer;
        line-height: 35px;
        padding: 0px 5px;
        .operation{
          opacity: 0;
        }
      }
      li:hover{
          background: #e5f4ff;
          color: #0091FF;
          .operation{
            opacity: 1;
          }
      }
    }
    &::-webkit-scrollbar {
      background: transparent;
      width: 5px;
    }

    &::-webkit-scrollbar-thumb {
      background: #d5d5d5;
      border-radius: 5px;
    }
  }
  .footer{
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 0px;
    button{
      width: 80%;
      height: 50%;
    }
  }
}
</style>
