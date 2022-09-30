<template>
  <div>
    <sv-dialog
      ref="dialog"
      title="短信转发"
      @cancel="handleCancel"
      @modal="$refs.dialog.visible = false"
      @confirm="handleConfirm"
    >
      <div :class="$style['dialog']">
        <el-tabs
          v-model="activeName"
          type="card"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="指定转发"
            name="first"
          >
            <div
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              :class="$style['specify-transfer']"
            >
              <div :class="$style['header']">
                <span :class="$style.tips">
                  (注：平台接收的指定来信人短信后将自动转发给对应收信人)
                </span>
                <sv-button
                  type="primary"
                  @click="addOrUpdateSpecifyTransfer('add')"
                >
                  添加指定转发
                </sv-button>
              </div>

              <ul
                v-if="smsSpecifyTransferList.length > 0"
                :class="$style['transfer-list']"
              >
                <li
                  v-for="(item, index) in smsSpecifyTransferList"
                  :key="getRandomNumber(item.fromContactorId)"
                  :class="[
                    $style['transfer-list__item'],
                    activeSpecifyTransferIndex === index
                      ? $style['transfer-list__item--active']
                      : '',
                  ]"
                  @click="handleSelected(item, index)"
                >
                  <div :class="$style['transfer-list__item-header']">
                    <div :class="$style['transfer-list__item-header__left']">
                      来信人：
                      <span v-if="item.from">
                        {{
                          item.from.name +
                            (item.from.workUnit || item.from.position
                              ? '（'
                              : '') +
                            (item.from.workUnit || '') +
                            (item.from.workUnit && item.from.position
                              ? '/'
                              : '') +
                            (item.from.position || '') +
                            (item.from.workUnit || item.from.position ? '）' : '')
                        }}
                      </span>
                    </div>
                    <div
                      v-show="activeSpecifyTransferIndex === index"
                      :class="$style['transfer-list__item-header__right']"
                    >
                      <el-button
                        type="text"
                        size="medium"
                        style="margin: 0 10px"
                        @click="
                          addOrUpdateSpecifyTransfer('detail', item)
                        "
                      >
                        查看
                      </el-button>
                      <el-button
                        type="text"
                        size="medium"
                        :class="$style['reset-button']"
                        @click="
                          addOrUpdateSpecifyTransfer('update', item)
                        "
                      >
                        编辑
                      </el-button>
                      <el-button
                        type="text"
                        size="medium"
                        :class="$style['delete-button']"
                        @click="handleDelete"
                      >
                        删除
                      </el-button>
                    </div>
                  </div>
                  <ul
                    :class="[
                      $style['transfer-list__item-body'],
                      $style['transfer-list__item-body1'],
                    ]"
                  >
                    <template v-if="item.to && item.to.length > 0">
                      <li
                        v-for="el in item.to"
                        :key="getRandomNumber(el.id)"
                        :class="$style.contactor"
                      >
                        {{
                          el.name +
                            (el.workUnit || el.position ? '（' : '') +
                            (el.workUnit || '') +
                            (el.workUnit && el.position ? '/' : '') +
                            (el.position || '') +
                            (el.workUnit || el.position ? '）' : '')
                        }}
                      </li>
                    </template>
                  </ul>
                </li>
              </ul>
              <div
                v-else
                :class="$style['noData']"
              >
                <img :src="require('@/assets/img/noFile.png')" alt="" :class="$style['noData-img']">
                <span>暂无数据</span>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane
            label="全部转发"
            name="second"
          >
            <div :class="$style['all-transfer']">
              <div :class="$style['header']">
                <span :class="$style.tips">
                  (注：平台接收的所有短信都将转发给以下收信人)
                </span>
                <sv-select-contact
                  ref="svSelectContact"
                  v-model="allTransferList"
                  :api="['/mail/mailgroup/list', '/mail/mailcontactor/list']"
                  :multiple="true"
                  :button-type="'primary'"
                  :button-text="'设置收信人'"
                  :is-display="false"
                  @update="updateAllTransferList"
                />
              </div>

              <ul
                v-if="allTransferList.length > 0"
                :class="$style['transfer-list']"
              >
                <li
                  :class="$style['transfer-list__item']"
                >
                  <div :class="$style['transfer-list__item-header']">
                    <div :class="$style['transfer-list__item-header__left']">
                      <span
                        :class="
                          $style['transfer-list__item-header__left-title']
                        "
                      >
                        收信人
                      </span>
                    </div>
                    <div :class="$style['transfer-list__item-header__right']">
                      <el-button
                        type="text"
                        size="medium"
                        style="margin: 0 10px"
                        @click="addContactHandle"
                      >
                        编辑
                      </el-button>
                      <el-button
                        type="text"
                        size="medium"
                        :class="$style['delete-button']"
                        @click="handleDelete"
                      >
                        删除
                      </el-button>
                    </div>
                  </div>
                  <div :class="$style['transfer-list__item-body']">
                    <div
                      v-for="el in allTransferList"
                      :key="el.id"
                      :class="$style.contactor"
                    >
                      {{
                        el.name +
                          (el.workUnit || el.position ? '（' : '') +
                          (el.workUnit || '') +
                          (el.workUnit && el.position ? '/' : '') +
                          (el.position || '') +
                          (el.workUnit || el.position ? '）' : '')
                      }}
                    </div>
                  </div>
                </li>
              </ul>
              <div
                v-else
                :class="$style['noData']"
              >
                <img
                  :src="require('@/assets/img/noFile.png')"
                  alt=""
                  :class="$style['noData-img']"
                >
                <span>暂无数据</span>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </sv-dialog>
    <!-- 添加指定转发 -->
    <AddOrUpdateSenderAndReceiver
      ref="addOrUpdateSenderAndReceiverRef"
      @confirm="confirmAddOrUpdate"
    />
    <sv-dialog-hint
      ref="hint_delete"
      type="delete"
      text="确认删除该条转发配置？"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script>
import AddOrUpdateSenderAndReceiver from '@/views/modules/sys/combined/history/SMSTransfer/AddOrUpdateSenderAndReceiver/AddOrUpdateSenderAndReceiver.vue';

export default {
  name: 'SMSTransfer',
  components: {
    AddOrUpdateSenderAndReceiver,
  },
  data() {
    return {
      loading: true,
      activeName: 'first',
      // 指定转发
      smsSpecifyTransferList: [],
      // 全部转发
      allTransferList: [],
      // 指定转发-当前选中index
      activeSpecifyTransferIndex: 0,
    };
  },
  mounted() {
    this.getTransferData();
  },
  methods: {
    /**
     * @description 删除转发配置弹出提醒
     */
    handleDelete() {
      this.$refs.hint_delete.visible = true;
    },
    /**
     * @description 确认删除
     */
    confirmDelete() {
      if (this.activeName === 'first') {
        this.smsSpecifyTransferList.splice(this.activeSpecifyTransferIndex, 1);
      } else {
        this.allTransferList = [];
      }
      this.setTransferData().then((res) => {
        this.saveTransferData(res).then(() => {
          this.getTransferData();
        });
      });
    },
    /**
     * @description 全部转接-更新收信人
     */
    updateAllTransferList(result) {
      this.allTransferList = [...result];
    },
    /**
     * @description 获取随机数
     */
    getRandomNumber(id) {
      const str = String(Math.random(10) * 100) + String(id);
      return str;
    },
    /**
     * @description 指定转发 - 选中行
     */
    handleSelected(item, index) {
      this.activeSpecifyTransferIndex = index;
    },
    /**
     * @description 确定-添加/编辑/查看 指定转接
     */
    confirmAddOrUpdate({ type, from, to }) {
      const index = this.smsSpecifyTransferList.findIndex((el) => el.from.id === from[0].id);
      if (type === 'update') {
        if (index > -1) {
          to.forEach((el) => {
            const filterData = this.smsSpecifyTransferList[index].to.filter((item) => item.id === el.id)
            if (filterData.length === 0) {
              this.smsSpecifyTransferList[index].to.push(el);
            }
          });
          this.smsSpecifyTransferList.splice(this.activeSpecifyTransferIndex, 1);
          this.activeSpecifyTransferIndex = this.smsSpecifyTransferList.findIndex((el) => el.from.id === from[0].id);
        } else {
          this.smsSpecifyTransferList[this.activeSpecifyTransferIndex].from =
            from[0];
          this.smsSpecifyTransferList[this.activeSpecifyTransferIndex].to = to;
        }
      } else if (type === 'add') {
        // 添加时，若来信人已存在列表中了，就把转发人合并，去重
        if (index > -1) {
          this.activeSpecifyTransferIndex = index;
          to.forEach((el) => {
            const filterData = this.smsSpecifyTransferList[index].to.filter((item) => item.id === el.id)
            if (filterData.length === 0) {
              this.smsSpecifyTransferList[index].to.push(el);
            }
          });
        } else {
          this.smsSpecifyTransferList.push({
            fromContactorId: from[0].id,
            to,
            from: from[0],
          });
          this.activeSpecifyTransferIndex = this.smsSpecifyTransferList.length - 1;
        }
      }
    },
    /**
     * @description 获取转接列表
     */
    getTransferData() {
      this.$http({
        method: 'get',
        baseURL: window.SITE_CONFIG.event,
        url: '/eos/sms/proxy/get',
        headers: {
          token: this.$cookie.get('token'),
        },
      }).then((response) => {
        if (response.data.code === 0) {
          this.loading = false;
          const responseData = response.data.data || [];
          // type为0是“指定转发”  1是“全部转发”
          // 先把fromContactorId组成数组，再根据fromContactorId去匹配toContactorId和to
          const specifyTransfer = responseData.filter(
            (item) => item.type === 0
          );
          // 全部转发
          const allTransfer = responseData.filter((item) => item.type === 1);
          // 全部转发-收信人
          const allTransferReciver = allTransfer.map((item) => item.to);
          // 去重 fromContactors来信人
          const fromContactors = [
            ...new Set(specifyTransfer.map((item) => item.fromContactorId)),
          ];
          // 指定转发
          this.smsSpecifyTransferList = fromContactors.map((item) => {
            const obj = {
              fromContactorId: item,
              from: specifyTransfer
                .filter((el) => el.fromContactorId === item)
                .map((el) => el.from)[0],
              to: specifyTransfer
                .filter((el) => el.fromContactorId === item)
                .map((el) => el.to),
            };
            return obj;
          });
          this.allTransferList = allTransferReciver;
          this.$emit('update', responseData);
        } else {
          this.loading = false;
          this.$message.error(`获取短信转接数据失败！错误信息：${response.data.msg || response.data.message}`);
        }
      });
    },

    /**
     * @description 添加指定转发
     * @param type 类型
     * @param item 选中的指定转发配置
     */
    addOrUpdateSpecifyTransfer(type, item) {
      this.$refs.addOrUpdateSenderAndReceiverRef.showDialog(type, item);
    },

    /**
     * @description 添加联系人
     */
    addContactHandle() {
      this.$refs.svSelectContact.$refs.dialog.visible = true;
    },

    /**
     * @description 切换tab
     */
    handleClick(val) {
      this.activeName = val.name;
    },

    /**
     * @description 显示弹窗
     */
    onShow() {
      this.activeName = 'first';
      // 指定转发
      this.smsSpecifyTransferList = [];
      // 全部转发
      this.allTransferList = [];
      // 指定转发-当前选中index
      this.activeSpecifyTransferIndex = 0;
      this.loading = true;
      this.getTransferData();
      if (this.$refs.dialog) {
        this.$refs.dialog.visible = true;
      }
    },

    /**
     * @description 关闭弹窗
     */
    handleCancel() {
      this.$refs.dialog.visible = false;
    },

    /**
     * @description 设置保存接口的传参数据
     */
    setTransferData() {
      return new Promise((resolve) => {
        let temData = []; // 暂存数据
        this.smsSpecifyTransferList.forEach((el) => {
          if (el.to.length > 0) {
            const arr = el.to.map((item) => ({
              fromContactorId: el.from.id,
              platformId: this.$cookie.get('platformId'),
              toContactorId: item.id,
              type: 0, // type为0是“指定转发”  1是“全部转发”
            }));
            temData = temData.concat(arr);
          }
        });
        if (this.allTransferList.length > 0) {
          const arr = this.allTransferList.map((item) => ({
            fromContactorId: 0,
            platformId: this.$cookie.get('platformId'),
            toContactorId: item.id,
            type: 1, // type为0是“指定转发”  1是“全部转发”
          }));
          temData = temData.concat(arr);
        }
        resolve(temData);
      });
    },

    /**
     * @description 确定
     */
    handleConfirm() {
      this.setTransferData().then((res) => {
        this.saveTransferData(res).then(() => {
          this.$message.success('保存成功');
          this.$refs.dialog.visible = false;
          this.getTransferData();
        });
      });
    },

    /**
     * @description 保存转接数据
     */
    saveTransferData(data) {
      return new Promise((resolve) => {
        this.$http({
          method: 'post',
          baseURL: window.SITE_CONFIG.event,
          url: '/eos/sms/proxy/save',
          headers: {
            token: this.$cookie.get('token'),
          },
          data,
        }).then((response) => {
          console.log(response)
          if (response.data.code === 0) {
            resolve();
          } else {
            this.$message.error(`保存短信转接数据失败！错误信息：${response.data.msg || response.data.message}`);
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" module>
.dialog {
  width: 660px;
  height: 478px;
  margin: 10px;

  .transfer-list {
    width: 100%;
    min-height: 40px;
    list-style: none;
    margin: 0;
    padding: 20px 10px 0 0;
    flex: 1;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      background: transparent;
      width: 5px;
    }

    &::-webkit-scrollbar-thumb {
      background: #d5d5d5;
      border-radius: 5px;
    }

    &__item {
      width: 100%;
      list-style: none;
      padding: 0;
      margin: 0 0 16px 0;
      border: 1px solid #dcdee0;
      border-radius: 5px;
      overflow: hidden;

      &--active {
        border: 1px solid #0091ff;
      }

      &-header {
        background: #f7f8fa;
        height: 30px;
        line-height: 30px;
        padding: 0 10px 0 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &__left {
          color: #969799;

          &-title {
            color: #969799;
            position: relative;
            padding: 0 16px;

            &::before {
              content: '';
              display: block;
              left: 0px;
              top: calc(50% - 6px);
              width: 2px;
              height: 12px;
              background: #0091ff;
              position: absolute;
            }
          }
        }

        &__right {
          display: flex;
          justify-content: center;

          .delete-button {
            color: #ff4d4f;
            margin-left: 10px;
            position: relative;

            &::before {
              width: 1px;
              height: 20px;
              background: #dcdee0;
              display: block;
              content: '';
              position: absolute;
              left: -11px;
              top: calc(50% - 10px);
            }
          }

          .reset-button {
            margin: 0 10px;
            position: relative;

            &::before {
              width: 1px;
              height: 20px;
              background: #dcdee0;
              display: block;
              content: '';
              position: absolute;
              left: -11px;
              top: calc(50% - 10px);
            }
          }
        }
      }

      &-body {
        line-height: 32px;
        padding: 10px 10px 10px 0;
        list-style: none;
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        li {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .contactor {
          color: #969799;
          min-width: 45%;
          height: 30px;
          margin-bottom: 10px;
          padding: 0 10px;
        }
      }

      &-body1 {
        position: relative;
        padding: 10px 10px 10px 55px;
        min-height: 50px;

        &::before {
          height: 30px;
          display: block;
          content: '转接人：';
          position: absolute;
          left: 10px;
          top: 10px;
          color: #969799;
        }
      }
    }

    &__item--active {
      border: 1px solid #0091ff;
    }
  }
}
.tips {
  color: #cccccc;
}
.text-color {
  color: #646566;
}
// 全部转发
.all-transfer {
  height: 422px;
  display: flex;
  flex-direction: column;

  .header {
    height: 35px;
    line-height: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
// 指定转发
.specify-transfer {
  height: 422px;
  display: flex;
  flex-direction: column;

  .header {
    height: 35px;
    line-height: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.noData {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #999999;
  .noData-img {
    margin-bottom: 10px;
  }
}
</style>
