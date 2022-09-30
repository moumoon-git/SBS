<template>
  <div>
    <sv-dialog
      ref="dialog"
      title="添加指定转发"
      @cancel="onCancel"
      @confirm="onConfirm"
    >
      <el-form :class="$style.dialog">
        <el-form-item label="来信人：">
          <div v-show="type !== 'detail'">
            <sv-select-contact
              v-model="sender"
              title=""
              :multiple="false"
              :api="['/mail/mailgroup/list', '/mail/mailcontactor/list']"
              :is-display="false"
              @update="updateSender"
            />
          </div>
          <ul :class="[$style['contactor-list']]">
            <template v-if="sender.length > 0">
              <li
                v-for="(el, index) in sender"
                :key="el.id"
                :class="[
                  $style.contactor,
                  type === 'detail' ? '' : $style['contactor-active'],
                ]"
              >
                {{
                  el.name +
                    (el.workUnit || el.position ? '（' : '') +
                    (el.workUnit || '') +
                    (el.workUnit && el.position ? '/' : '') +
                    (el.position || '') +
                    (el.workUnit || el.position ? '）' : '')
                }}
                <i
                  v-if="type !== 'detail'"
                  class="el-icon-error"
                  @click="deleteItem('sender', index)"
                />
              </li>
            </template>
          </ul>
        </el-form-item>
        <el-form-item label="收信人：">
          <div v-show="type !== 'detail'">
            <sv-select-contact
              v-model="receivers"
              title=""
              :api="['/mail/mailgroup/list', '/mail/mailcontactor/list']"
              :multiple="true"
              :is-display="false"
              @update="updateReceivers"
            />
          </div>
          <ul :class="[$style['contactor-list'], $style['contactor-list2']]">
            <template v-if="receivers.length > 0">
              <li
                v-for="(el, index) in receivers"
                :key="getRandomNumber(el.id)"
                :class="[
                  $style.contactor,
                  type === 'detail' ? '' : $style['contactor-active'],
                ]"
              >
                {{
                  el.name +
                    (el.workUnit || el.position ? '（' : '') +
                    (el.workUnit || '') +
                    (el.workUnit && el.position ? '/' : '') +
                    (el.position || '') +
                    (el.workUnit || el.position ? '）' : '')
                }}
                <i
                  v-if="type !== 'detail'"
                  class="el-icon-error"
                  @click="deleteItem('receivers', index)"
                />
              </li>
            </template>
          </ul>
        </el-form-item>
      </el-form>
    </sv-dialog>
  </div>
</template>
<script>
export default {
  name: 'AddOrUpdateSenderAndReceiver',
  data() {
    return {
      // 指定转发
      // 来信人
      sender: [],
      // 转发的收信人
      receivers: [],
      type: '', // add, update, detail
    };
  },
  methods: {
    /**
     * @description 获取随机数
     */
    getRandomNumber(id) {
      const str = String(Math.random(10) * 100) + String(id);
      return str;
    },

    /**
     * @description 显示弹窗
     */
    showDialog(type, item) {
      this.type = type;
      if (type === 'update' || type === 'detail') {
        this.sender = [item.from];
        this.receivers = item.to;
      } else {
        this.sender = [];
        this.receivers = [];
      }
      this.$refs.dialog.visible = true;
    },

    /**
     * @description 删除联系人
     */
    delIt(id, type) {
      this[type] = this[type].filter((v) => v.id !== id);
    },

    /**
     * @description 关闭弹窗
     */
    onCancel() {
      this.$refs.dialog.visible = false;
      this.sender = [];
      this.receivers = [];
    },

    /**
     * @description 确定按钮
     */
    onConfirm() {
      if (this.receivers.length > 0 && this.sender.length === 0) {
        this.$message({
          message: '请选择来信人',
          type: 'warning',
        });
        return;
      }
      if (this.receivers.length === 0 && this.sender.length > 0) {
        this.$message({
          message: '请选择收信人',
          type: 'warning',
        });
        return;
      }
      this.$refs.dialog.visible = false;
      this.$emit('confirm', {
        type: this.type,
        from: this.sender,
        to: this.receivers,
      });
    },

    /**
     * @description 更新来信人
     */
    updateSender(id, result) {
      if (id) {
        this.sender = [result];
      }
    },
    /**
     * @description 更新收信人
     */
    updateReceivers(result) {
      this.receivers = [...result];
    },
    /**
     * @description 删除项目
     */
    deleteItem(type, index) {
      this[type].splice(index, 1);
    },
  },
};
</script>

<style lang="scss" module>
.dialog {
  width: 660px;
  height: 478px;
  padding: 20px;

  .contactor-list {
    width: 100%;
    line-height: 40px;
    min-height: 40px;
    padding: 10px 20px 0 20px;
    list-style: none;
    margin: 10px 0 0 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: flex-start;
    border: 1px solid #dcdee0;
    box-sizing: border-box;
    
    &::-webkit-scrollbar {
      background: transparent;
      width: 5px;
    }

    &::-webkit-scrollbar-thumb {
      background: #d5d5d5;
      border-radius: 5px;
    }
    
    li {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 3px;
    }

    .contactor {
      color: #969799;
      min-width: 45%;
      height: 30px;
      margin-bottom: 10px;
      padding: 0 10px;

      .el-icon-error {
        color: #cccccc;
      }
    }

    .contactor-active {
      background: #f2f3f5;
    }
  }
  .contactor-list2 {
    height: 280px;
    overflow-y: scroll;
    box-sizing: border-box;
  }
}
</style>
