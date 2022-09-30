<template>
  <div>
    <el-dialog
      title="催办"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="900px"
      @close="imgDialogVisible = false"
    >
      <el-container>
        <el-main>
          <div>
            <el-input
              v-model="description"
              type="textarea"
              :rows="4"
              placeholder="备注"
            />
          </div>
        </el-main>
        <el-aside width="500px">
          <el-table
            :data="urgeList"
            style="width: 100%; text-align: center"
          >
            <el-table-column
              prop="urgeTime"
              label="催办时间"
              width="180"
            />
            <el-table-column
              prop="eventName"
              label="催办工单"
              width="180"
            />
            <el-table-column
              prop="description"
              label="备注"
            />
          </el-table>
        </el-aside>
      </el-container>
      <!--取消与确认按钮-->
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          plain
          size="small"
          @click="urgeCancel()"
        >取消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="sendMessage()"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      // 催办描述
      description: '',
      urgeList: [],
      eventId: '',
      flagType: '',
      // 0旧工单  1新工单
      eventType: '',
      // 工单描述
      eventDescription: '',
    };
  },

  methods: {
    init(row) {
      this.visible = true;
      this.description = '';
      this.urgeList = [];
      this.eventId = row.id;
      this.eventType = row.eventType;
      if (row.eventType === 0) {
        this.flagType = row.flagType;
        this.eventDescription = row.eventDescription;
      } else if (row.eventType === 1) {
        this.eventDescription = row.name;
        this.flagType = row.contactorId;
      }

      this.$http({
        url: this.$http.adornUrl('/event/urgeHistory/listById'),
        method: 'post',
        data: this.$http.adornData({
          eventId: row.id,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.urgeList = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    sendMessage() {
      this.$http({
        url: this.$http.adornUrl('/event/eventinfo/sendMessage'),
        method: 'post',
        data: this.$http.adornData({
          id: this.eventId,
          flagType: this.flagType,
          platformId: 0,
          eventDescription: this.eventDescription,
          urgeDescription: this.description,
          urgeType: this.eventType,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
          });
          this.visible = false;
          if (this.eventType === 0) {
            this.$emit('refresh-data-list');
          } else {
            this.$emit('refresh-new-dataList');
          }
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    urgeCancel() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss">
</style>
