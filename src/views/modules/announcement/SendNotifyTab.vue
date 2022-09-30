<template lang="">
  <div class="sendNotify">
    <sv-template
      ref="template"
      :tree-setting="treeSetting"
      :table-request="tableRequest"
      @tree-click="handleNodeClick"
    >
      <template #middle__header>
        <span />

        <div class="middle__header__title">
          通知公告
        </div>
        <div class="middle__header__title2">
          <el-select
            v-model="noticeTypeVal"
            placeholder="请选择类型"
            clearable
          >
            <el-option
              v-for="item in noticeTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="middle__header__title2">
          <el-date-picker
            v-model="startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择开始时间"
          />
          <span class="word">至</span>
          <el-date-picker
            v-model="endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择结束时间"
          />
        </div>
        <div class="middle__header__title2">
          <sv-input-search
            v-model="keySearch"
            width="200px"
            placeholder="请输入标题名称搜索"
            @keyup.enter.native="searchTable"
            @change="searchTable"
          />
        </div>
        <div class="middle__header__title2">
          <el-button @click="searchData">
            查询
          </el-button>
          <el-button
            type="primary"
            @click="publish"
          >
            <i class="el-icon-s-promotion" />发布
          </el-button>
        </div>
      </template>

      <template #middle__table>
        <el-table-column
          sortable
          prop="title"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
          label="标题"
        />

        <el-table-column
          prop="noticeType"
          header-align="center"
          width="120"
          align="center"
          :show-overflow-tooltip="true"
          label="类型"
        >
          <template slot-scope="scope">
            <span>
              {{ typeMap[scope.row.noticeType] }}
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="content"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
          label="内容"
        /> -->
        <el-table-column
          prop="publishStatus"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
          label="发布状态"
        >
          <template slot-scope="scope">
            <span :style="{color: scope.row.publishStatus === 0? '#F59A23': '#70B603'}">
              {{ scope.row.publishStatus === 0? '待发布': '已发布' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="publishTime"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
          label="发布时间"
        />
        <el-table-column
          prop="readNum"
          header-align="center"
          align="center"
          width="120"
          :show-overflow-tooltip="true"
          label="已读人数"
        />
        <el-table-column
          prop="unReadNum"
          header-align="center"
          align="center"
          width="120"
          :show-overflow-tooltip="true"
          label="未读人数"
        />
        <el-table-column
          header-align="center"
          align="center"
          label="操作"
        >
          <template slot-scope="scope">
            <sv-table-operation
              :display="[
                scope.row.publishStatus === 0 ? 'release' : 'release_disable',
                'view',
                scope.row.publishStatus === 0 ? 'edit' : 'edit_disable' ,
                (scope.row.publishStatus === 1 && !isOver2Hour(scope.row.publishTime))
                  ? 'recall' : 'recall_disable',
                scope.row.publishStatus === 0 ? 'delete' : 'delete_disable'
              ]"
              @view="viewHandle(scope.row.id, scope.row.publishStatus, scope.row.publishTime)"
              @edit="addOrUpdateHandle(scope.row.id)"
              @delete="
                deleteIds = scope.row.id;
                $refs.delete_hint.visible = true;
              "
              @release="releaseHandle(scope.row)"
              @recall="recallHandle(scope.row.id)"
            />
          </template>
        </el-table-column>
      </template>
    </sv-template>
    <notify-dialog
      ref="notifyDialog"
      :platform-id="platformId"
      @update="updateTable"
    />
    <sv-dialog-hint
      ref="delete_hint"
      type="delete"
      @confirm="deleteHandle(deleteIds)"
    />
  </div>
</template>
<script>
import NotifyDialog from './components/SendNotifyTab/NotifyDialog.vue';

export default {
  name: 'SendNotifyTab',
  components: {
    NotifyDialog,
    // ResourcetreeAddOrUpdate,
    // ResourceTreeUpdate,
  },
  data() {
    return {
      keySearch: '',
      noticeTypeVal: '',
      startTime: '',
      endTime: '',
      noticeTypeList: [
        {
          value: '1',
          label: '通知',
        },
        {
          value: '2',
          label: '公告',
        },
        {
          value: '3',
          label: '预警',
        },
      ],
      currentGroupId: '',
      typeMap: { 1: '通知', 2: '公告', 3: '预警' },
    };
  },
  computed: {
    platformId() {
      return this.$store.state.user.id;
    },
    treeSetting() {
      return {
        tab: [],
        api: '/appnotice/appNoticeGroup/list',
        searchAdd: true,
        edit: {
          add: '/appnotice/appNoticeGroup/save',
          update: '/appnotice/appNoticeGroup/update',
          delete: '/appnotice/appNoticeGroup/delete',
        },
        deleteOption: {
          groupId: this.currentGroupId,
          title: '',
          startTime: '',
          endTime: '',
          noticeType: '',
        },
        isPlatformRoot: true,
      };
    },
    tableRequest() {
      return {
        api: '/appManagement/noticePage',
        method: 'get',
        params: {
          groupId: this.currentGroupId,
          title: this.keySearch,
          startTime: this.startTime,
          endTime: this.endTime,
          noticeType: this.noticeTypeVal,
        },
      };
    },
  },
  methods: {
    viewHandle(id, isPublish, publishTime) {
      if (isPublish) {
        if (!this.isOver2Hour(publishTime)) {
          this.$refs.notifyDialog.searchDetailById(id, 'read');
        } else {
          this.$refs.notifyDialog.searchDetailById(id, 'readonly');
        }
      } else {
        // 编辑
        this.addOrUpdateHandle(id);
      }
    },
    addOrUpdateHandle(id) {
      this.$refs.notifyDialog.searchDetailById(id, 'edit');
    },
    deleteHandle(noticeId) {
      this.$http({
        url: this.$http.adornUrl(`/appManagement//notice/${noticeId}/delete`),
        method: 'post',
      }).then((res) => {
        if (res.data.code === 0 || res.data.errorcode === 0) {
          this.$message.success('已删除');
          this.updateTable();
        } else {
          this.$message.error('删除失败');
        }
      });
    },
    recallHandle(noticeId) {
      this.$confirm('是否撤回?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info ',
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl(`/appManagement/withdrawNotice?noticeId=${noticeId}`),
          method: 'post',
        }).then((res) => {
          if (res.data.code === 0 || res.data.errorcode === 0) {
            this.$message.success('已撤回');
            this.updateTable();
          } else {
            this.$message.error('撤回失败');
          }
        });
      });
    },
    releaseHandle(data) {
      const { id, contactors, platforms } = data;
      console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', data);
      this.$confirm('是否发布?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info ',
      }).then(() => {
        // if (!contactors && !platforms) {
        //   this.$message.error('发布失败，请选择发送对象');
        //   return;
        // }
        this.$http({
          url: this.$http.adornUrl('/appManagement/publishNotice'),
          method: 'post',
          data: {
            noticeId: id,
          },
        }).then((res) => {
          if (res.data.code === 0 || res.data.errorcode === 0) {
            this.$message.success('发布成功，2小时内支持撤回');
            this.updateTable();
          } else {
            this.$message.error(res.data.msg || '发布失败');
          }
        });
      });
    },

    isOver2Hour(publishTime) {
      const nowStamp = new Date().getTime();
      const targetStamp = new Date(publishTime).getTime();
      const twoHour = 2 * 60 * 60 * 1000;
      return nowStamp - targetStamp > twoHour;
    },

    updateTable() {
      this.$refs.template.getTableList(this.tableRequest);
    },

    publish() {
      this.$refs.notifyDialog.open('add', '');
    },
    searchData() {
      console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', this.platformId);
      this.searchTable();
    },
    searchTable() {
      const tableRequest = {
        api: '/appManagement/noticePage',
        method: 'get',
        params: {
          title: this.keySearch,
          startTime: this.startTime,
          endTime: this.endTime,
          noticeType: this.noticeTypeVal,
          groupId: this.currentGroupId,
          page: 1,
          limit: 10,
        },
      };
      console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', tableRequest);
      this.$refs.template.getTableList(tableRequest);
      // this.tableRequest.params.page = 1;
      // this.tableRequest.params.limit = 10;
    },
    handleNodeClick(obj) {
      console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', obj);
      this.currentGroupId = obj ? obj.id : '';
      this.$refs.template.getTableList(this.tableRequest);
    },

    getDataList() {
      this.$refs.template.getTree();
      this.$refs.template.getTableList(this.tableRequest);
    },
  },
};
</script>
<style lang="scss" scope>
.sendNotify {
  .middle__header__title2 {
    .word {
      margin: 0 10px;
      font-size: 16px;
    }
  }
}

</style>
