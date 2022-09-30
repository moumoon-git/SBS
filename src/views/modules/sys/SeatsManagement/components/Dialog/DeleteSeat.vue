<!-- 弹窗--新增坐席 -->
<template>
  <div class="delete-seat-dialog">
    <sv-dialog
      ref="dialog"
      :title="title"
      :modal="true"
      @cancel="handleCancel"
    >
      <div class="seat-dialog-body">
        <!-- 已选坐席 -->
        <div class="selected-seats">
          <div class="selected-seats_header">已选</div>
          <ul class="selected-seats-list">
            <li v-for="item in seatList" :key="item.id">
              {{ '坐席号：'+ item.seatNumber }}
            </li>
          </ul>
        </div>

        <div class="delete-tips">是否删除已选坐席号？</div>
      </div>
      <template #footer>
        <div class="seats-dialog-footer">
          <sv-button @click="handleCancel">取消</sv-button>
          <sv-button type="primary" @click="handleDelete"> 确定 </sv-button>
        </div>
      </template>
    </sv-dialog>
  </div>
</template>
<script>
export default {
  name: 'DeleteSeatDialog',
  components: {
  },
  props: {
    title: {
      type: String,
      default: '批量关联坐席号',
    },
    seatList: {
      type: Array,
      default: () => ([]),
    },
  },
  data() {
    return {
    };
  },
  mounted() {
    this.$refs.dialog.visible = true;
  },
  methods: {
    /**
     * @description 关闭弹窗
     */
    handleCancel() {
      this.$emit('cancel');
    },
    /**
     * @description 关闭弹窗
     */
    handleDelete() {
      const ids = this.seatList.map((item) => item.id);
      this.$emit('delete', ids);
    },
  },
};
</script>

<style lang="scss">
.delete-seat-dialog {
  .seat-dialog-body {
    width: 450px;
    padding: 10px 40px;
    
    // 已选坐席
    .selected-seats {
      width: 370px;
      height: 150px;
      background: #F2F2F2;
      border-radius: 3px;
      border: 1px solid #DDDEE1;

      .selected-seats_header {
        height: 20px;
        // font-size: 12px;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
        text-align: center;
      }

      .selected-seats-list {
        list-style: none;
        padding: 10px;
        overflow-y: scroll;
        height: calc(100% - 20px);
        box-sizing: border-box;
        margin: 0;

        // 定义滚动条样式
        &::-webkit-scrollbar {
          width: 0px;
          height: 5px;
          border-radius: 10px;
        }
        // 定义滚动条轨道 内阴影+圆角
        &::-webkit-scrollbar-track {
          box-shadow: inset 0 0 6px rgba(0, 0, 0, 30%);
          border-radius: 10px;
          background-color: rgba(100, 104, 105, 1);
        }
        // 定义滑块 内阴影+圆角
        &::-webkit-scrollbar-thumb {
          border-radius: 10px;
          box-shadow: inset 0 0 6px rgba(0, 0, 0, 30%);
          background-color: rgba(86, 233, 255, 1);
        }

        & > li {
          height: 30px;
          line-height: 30px;
          list-style: none;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #999999;
          // font-size: 12px;
        }
      }
    }

    // 删除提示
    .delete-tips {
      height: 38px;
      line-height: 38px;
      // font-size: 12px;
      font-weight: 500;
      color: #F46666;
      text-align: center;
      margin-top: 10px;
    }

    .el-form {
      margin: 14px 0 4px 0;

      .el-form-item {
        margin-bottom: 0;
      }

      .el-form-item__label {
        // font-size: 12px;
        color: #555555;
      }
    }
  }
  // 底部
  .seats-dialog-footer {
    height: 60px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 20px;
    border-top: 1px solid #dddee1;

    .sv-button {
      padding: 0 14px;
      margin-left: 10px;
    }
  }

}
</style>
