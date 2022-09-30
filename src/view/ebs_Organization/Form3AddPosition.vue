<template>
  <!-- 新增职务 -->
  <el-dialog
    title="职务管理"
    center
    class="sbs-dialog"
    width="818px"
    :visible.sync="isVisible"
    :close-on-click-modal="false"
  >
    <div class="flex">
      <div
        class="frame"
        style="width: 31%;"
      >
        <el-button
          type="plain"
          style="width: 100%;"
          @click="isDisabled = false, isAdd = true, handleClick({ id: '', name: '', remark: '' })"
        >
          新增职务
        </el-button>
        <div
          v-for="(item, i) in positionList"
          :key="i"
          class="leftItemStyle"
          :style="groupId === item.id ? 'color: #0091FF;' : ''"
          @click="isDisabled = true, isAdd = false, handleClick(item)"
        >
          {{ item.name }}
        </div>
      </div>
      <div
        class="frame"
        style="width: 62%;"
      >
        <el-form label-width="100px">
          <el-form-item label="职务名称:">
            <el-input
              v-model="name"
              :disabled="isDisabled"
            />
          </el-form-item>
          <el-form-item label="职务职责:">
            <el-input
              v-model="remark"
              type="textarea"
              :disabled="isDisabled"
              :rows="6"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="bottom">
      <el-button
        v-if="!isDisabled"
        type="plain"
        class="sbs-button"
        @click="isDisabled = true"
      >
        取消
      </el-button>
      <el-button
        v-if="!isDisabled"
        type="primary"
        class="sbs-button"
        @click="handleCommit"
      >
        确定
      </el-button>
      <el-button
        v-if="isDisabled && groupId"
        type="plain"
        class="sbs-button"
        @click="isDisabled = false, isAdd = false"
      >
        编辑
      </el-button>
      <el-button
        v-if="isDisabled && groupId"
        type="danger"
        class="sbs-button"
        @click="handleDelete"
      >
        删除
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false, // 是否开窗
      positionList: [], // 领导小组左
      groupId: '', // 当前id
      name: '', // 当前名
      remark: '', // 当前内容
      isDisabled: true, // 是否可输入
      isAdd: true, // 是修改还是新增
      versionId: '',
      flag: 1, // 1是专项2是现场
    };
  },
  methods: {
    init(flag) { // 1是专项2是现场
      this.flag = flag;
      this.isVisible = true;
      this.isDisabled = true;
      this.isAdd = false;
      this.handleClick({ id: '', name: '', remark: '' });
      this.versionId = Number(sessionStorage.getItem('preplanVersionId'));
      // 领导小组
      this.$http({
        method: 'get',
        url: `${window.SITE_CONFIG.baseUrl}/mail/mailgroup/getGroupResponseAndContactor`,
        params: {
          versionId: this.versionId, // 版本
          structType: flag, // 1是专项
          type: 1, // 领导小组
        },
      }).then((res) => {
        if (res.data.data) {
          this.positionList = res.data.data; // 职务
        }
      });
    },
    // 领导小组-点一行
    handleClick(item) {
      this.groupId = item.id || '';
      this.name = item.name || '';
      this.remark = item.remark || '';
    },
    // 删除
    handleDelete() {
      if (!this.groupId) {
        this.$message({
          type: 'error',
          message: '请先选中职务再删除',
        });
        return;
      }
      this.$confirm('是否删除该职务？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/deleteStruct',
          baseURL: window.g.ApiUrl,
          data: {
            id: this.groupId,
          },
        }).then((res) => {
          if (res.data.code === 0 || res.data.errorcode === 0) {
            this.$message({
              message: '职务删除成功！',
              type: 'success',
            });
            this.isDisabled = true;
            this.isAdd = false;
            this.handleClick({ id: '', name: '', remark: '' });
            this.init(this.flag);
            this.$emit('refresh');
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
        });
      });
    },
    // 确定
    handleCommit() {
      if (!this.name) {
        this.$message({
          type: 'error',
          message: '职务名称不能为空',
        });
        return;
      }
      this.isVisible = false;
      if (this.isAdd) { // 新增
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/addStruct',
          baseURL: window.g.ApiUrl,
          data: {
            data: {
              versionId: this.versionId, // 版本id
              structType: this.flag, // 专项
              pid: 0, // 职务不要，就是0
              type: 1, // 领导小组是467
              name: this.name, // 职务名
              remark: this.remark, // 职务内容
            },
          },
        }).then((res) => {
          if (res.data.code === 0 || res.data.errorcode === 0) {
            this.$message({
              message: '职务新增成功！',
              type: 'success',
            });
            this.$emit('refresh');
          }
        });
      } else { // 编辑
        this.$http({
          method: 'post',
          url: '/emergency/preparation/preplan/updateStruct',
          baseURL: window.g.ApiUrl,
          data: {
            data: {
              id: this.groupId,
              versionId: this.versionId, // 版本id
              structType: this.flag, // 专项
              pid: 0, // 职务不要，就是0
              type: 1, // 领导小组是467
              name: this.name, // 职务名
              remark: this.remark, // 职务内容
            },
          },
        }).then((res) => {
          if (res.data.code === 0 || res.data.errorcode === 0) {
            this.$message({
              message: '职务修改成功！',
              type: 'success',
            });
            this.$emit('refresh');
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.flex {
  display: flex;
}
.frame {
  border: 1px solid #DDDDDD;
  height: 46vh;
  overflow: auto;
  padding: 10px;
  margin: 20px 0px 20px 20px;
}
.bottom {
  border-top: 1px solid #E9ECF1;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 15px 10px;
}
.leftItemStyle {
  padding: 6px 0px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.leftItemStyle:hover {
  background: rgba(0, 145, 255, 0.05);
  border-left: 2px solid rgba(0, 145, 255, 1);
}
</style>
