<!-- 弹窗--选择坐席 -->
<template>
  <div v-if="isHaveSeatPermission" class="select-seat-dialog">
    <button class="site-navbar__menu__seat" @click="showSeatInformation" />
    <div ref="seatInformationRef" v-show="visible" class="seat-information">
      <template v-if="seatInformation">
        <div class="seat-information-header">
          <span>{{
            seatInformation.seatGroupName ? seatInformation.seatGroupName : '无'
          }}</span>
          <el-button type="text" @click="handleChangeSeat('update')"
            >更换</el-button
          >
        </div>
        <ul class="seat-information-body">
          <li class="seat-information-body__seat">
            {{
              '电话坐席：' +
              (seatInformation.phoneSeatNumber
                ? seatInformation.phoneSeatNumber
                : '无')
            }}
          </li>
          <li class="seat-information-body__seat">
            {{
              '监控坐席：' +
              (seatInformation.meetSeatNumber
                ? seatInformation.meetSeatNumber
                : '无')
            }}
          </li>
          <li class="seat-information-body__seat">
            {{
              '会场坐席：' +
              (seatInformation.monitorSeatNumber
                ? seatInformation.monitorSeatNumber
                : '无')
            }}
          </li>
        </ul>
      </template>
      <template v-else>
        <div class="no-set-seat">未设置坐席组</div>
        <div class="seat-information-footer">
          <el-button type="text" @click="handleChangeSeat('add')"
            >设置</el-button
          >
        </div>
      </template>
    </div>
    <sv-dialog
      ref="dialog"
      title="请选择坐席组"
      :modal="true"
      @cancel="$refs.dialog.visible = false"
    >
      <div
        v-loading="dataListLoading"
        element-loading-spinner="el-icon-loading"
        class="seat-cards"
      >
        <template v-if="dataList && dataList.length > 0">
          <div
            v-for="(item, index) in dataList"
            :key="index"
            @click="handleSelectedSeat(item, index)"
          >
            <div
              :class="
                'seat-card ' +
                (index === activeIndex ||
                (item.status === 1 && item.userId && item.userId === userId)
                  ? 'seat-card__active '
                  : '') +
                (item.status &&
                item.status === 1 &&
                item.userId &&
                item.userId !== userId
                  ? 'seat-card__disabled'
                  : '')
              "
            >
              <div
                v-if="
                  item.status &&
                  item.status === 1 &&
                  item.userId &&
                  item.userId !== userId
                "
                class="disabled-mask"
              >
                当前坐席已被占用无法选择
              </div>
              <div
                :class="
                  'seat-card-header ' +
                  (item.status &&
                  item.status === 1 &&
                  item.userId &&
                  item.userId !== userId
                    ? 'seat-card-header__disabled'
                    : '')
                "
              >
                {{ item.seatGroupName ? item.seatGroupName : '无' }}
              </div>
              <div
                :class="
                  'seat-card-body ' +
                  (item.status &&
                  item.status === 1 &&
                  item.userId &&
                  item.userId !== userId
                    ? 'seat-card-body__disabled'
                    : '')
                "
              >
                <ul class="seat-list">
                  <li class="seat-item">
                    <div class="seat-item-icon">
                      <img src="../../assets/svg/phone.svg" alt="电话" />
                    </div>
                    <span
                      :title="
                        item.phoneSeatNumber ? item.phoneSeatNumber : '无'
                      "
                    >
                      {{
                        '电话坐席：' +
                        (item.phoneSeatNumber ? item.phoneSeatNumber : '无')
                      }}
                    </span>
                  </li>
                  <li class="seat-item">
                    <div class="seat-item-icon">
                      <img src="../../assets/svg/video.svg" alt="视频" />
                    </div>
                    <span
                      :title="item.meetSeatNumber ? item.meetSeatNumber : '无'"
                    >
                      {{
                        '监控坐席：' +
                        (item.meetSeatNumber ? item.meetSeatNumber : '无')
                      }}
                    </span>
                  </li>
                  <li class="seat-item">
                    <div class="seat-item-icon">
                      <img src="../../assets/svg/camera.svg" alt="监控" />
                    </div>
                    <span
                      :title="
                        item.monitorSeatNumber ? item.monitorSeatNumber : '无'
                      "
                      >{{
                        '会场坐席：' +
                        (item.monitorSeatNumber ? item.monitorSeatNumber : '无')
                      }}</span
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </template>
        <template v-else> 暂无数据 </template>
      </div>
      <template #footer>
        <div class="seats-dialog-footer">
          <div class="seats-dialog-footer__radio">
            <el-checkbox v-model="isRememberSeat">记住我的选择</el-checkbox>
          </div>
          <div class="seats-dialog-footer__button">
            <sv-button @click="cancelSave">跳过</sv-button>
            <sv-button type="primary" @click="saveSeatInformation">
              确定
            </sv-button>
          </div>
        </div>
      </template>
    </sv-dialog>
  </div>
</template>
<script>
import $seat from '../../assets/js/seatManagementApi.js';
// UDS
import { createClient } from '@/assets/js/uds/useUDS.js';

export default {
  name: 'SelectSeatsDialog',
  data() {
    return {
      isRememberSeat: false, // 记住选择
      dataList: [], // 表格数据
      dataListLoading: false, // 加载中
      pageIndex: 1, // 页码
      pageSize: 10000, // 页数
      totalPage: 0, // 总页数
      activeIndex: null, // 选中的坐席
      selectedSeat: {}, // 选中的坐席
      visible: false,
      seatInformation: null, // 坐席信息
      isSeatOccupy: false, // 坐席是否被占用
      seatAddOrUpdate: 'list', // 坐席是添加还是更新
      userId: null, // userId
      uds: null, // uds
      isHaveSeatPermission: false, // 是否有选择坐席组的能力
    };
  },
  created() {
    this.uds = createClient();
    bus.$off('heartbeatAck');
    bus.$on('heartbeatAck', this.handleHeartbeatAck);
  },
  beforeDestroy() {
    this.uds.disconnect();
  },
  mounted() {
    this.getSeatManageGroup(); // 获取坐席组
    this.userId = Number(this.$cookie.get('userId')); // 用户id
    // 点击弹窗外的地方关闭弹窗
    document.addEventListener('mouseup', (e) => {
      if (this.$refs.seatInformationRef) {
        if (!this.$refs.seatInformationRef.contains(e.target)) {
          this.visible = false;
        }
      }
    });
  },
  methods: {
    /**
     * @description 判断坐席是否被占用
     */
    seatGroupUsage() {
      if (this.dataList.length > 0) {
        const filterData = this.dataList.filter((item) => item.id === this.seatInformation.id);
        if (filterData.length > 0) {
          // status 为 1,说明当前坐席被占用了。要判断当前坐席被哪个用户占用了
          if (Number(filterData[0].status) === 1) {
            if (filterData[0].userId === this.userId || !filterData[0].userId) {
              // 激活的坐席组
              this.handleActiveSeatGroup();
              if (this.seatAddOrUpdate === 'list') {
                // 唤醒uds
                this.noticeUcsGroupInfo();
              }
            } else if (filterData[0].userId !== this.userId) {
              this.$message.info('坐席已被占用，请重新选择');
              this.$refs.dialog.visible = true;
            }
          } else {
            // 激活的坐席组
            this.handleActiveSeatGroup();
            if (this.seatAddOrUpdate === 'list') {
              // 唤醒uds
              this.noticeUcsGroupInfo();
            }
          }
        }
      }
    },
    /**
     * @description 处理激活的坐席组
     */
    handleActiveSeatGroup() {
      if (this.seatInformation) {
        this.activeIndex = this.dataList.findIndex(
          (item) => item.id === this.seatInformation.id,
        );
        this.selectedSeat = this.seatInformation;
      }
    },
    /**
     * @description 获取个人信息
     */
    getUserSeatInformation() {
      $seat.getUserSeatInformation(this.getUserSeatInformationCallback);
    },
    /**
     * @description 获取个人信息回调信息
     */
    getUserSeatInformationCallback(type, data) {
      if (type === 'success') {
        // data.data 不为空，说明用户有记住坐席组
        if (data.data) {
          this.seatInformation = data.data;
          this.$cookie.set(
            'seatInformation',
            JSON.stringify(this.seatInformation),
          );
          setTimeout(() => {
            // 判断记住选择的坐席是否被占用
            this.seatGroupUsage();
          }, 100);
        } else {
          // 坐席信息
          const seatInfo = JSON.parse(this.$cookie.get('seatInformation'));
          // 是否跳过
          const jumpSetSeat = this.$cookie.get('jumpSetSeat');
          if (this.$cookie.get('seatInformation') !== 'null') {
            this.seatInformation = seatInfo;
            setTimeout(() => {
              // 判断记住选择的坐席是否被占用
              this.seatGroupUsage();
            }, 100);
          } else {
            // 不是跳过选择，就打开弹窗
            if (jumpSetSeat !== 'true') {
              this.$refs.dialog.visible = true;
            }
          }
        }
      } else {
        if (data.code) {
          this.$message.error(
            `查询用户坐席信息失败，错误代码：${data.code}，错误信息：${data.msg}`,
          );
        }
      }
    },
    /**
     * @description 显示坐席信息
     */
    showSeatInformation() {
      this.visible = !this.visible;
    },
    /**
     * @description 跳过
     */
    cancelSave() {
      this.$refs.dialog.visible = false;
      this.$cookie.set('jumpSetSeat', true);
    },
    /**
     * @description 保存选中坐席
     */
    saveSeatInformation() {
      // status:0 表示坐席还未被占用
      // status:1 和 userId为当前用户 ：表示选中坐席被当前登录用户占用
      if (
        Number(this.selectedSeat.status) === 0 ||
        (Number(this.selectedSeat.status) === 1 &&
          this.userId === this.selectedSeat.userId)
      ) {
        this.seatInformation = this.selectedSeat;
        // 将选中的坐席组存入cookie
        this.$cookie.set(
          'seatInformation',
          JSON.stringify(this.seatInformation),
        );
        // 坐席管理(超管) 列表 模糊查询
        // this.getSeatManageGroup();
        this.$message.info('保存成功');
        // 关闭弹窗
        this.$refs.dialog.visible = false;
        // 没有跳过选择
        this.$cookie.set('jumpSetSeat', false);
        const params = {
          seatGroupId: this.isRememberSeat ? this.selectedSeat.id : '',
          userId: this.userId,
        };
        $seat.setUserSeatInformation(
          params,
          this.setUserSeatInformationCallback,
        );
        this.noticeUcsGroupInfo(); // 选中坐席成功后，通知uds
      } else {
        this.$message.info('请先选择坐席组');
      }
    },
    /**
     * @description 保存选中坐席
     */
    setUserSeatInformationCallback(type, data) {
      if (type !== 'success') {
        if (data.code) {
          this.$message.error(
            `保存坐席失败，错误码${data.code}，错误信息${data.msg}`,
          );
        }
      }
    },
    /**
     * @description 选中坐席成功后，通知uds
     */
    noticeUcsGroupInfo() {
      console.log('延迟时间：', window.SITE_CONFIG.UDSHeartbeatAckTime)
      // 坐席号码，传入电话坐席
      const agent = `${this.seatInformation.phoneSeatNumber}`;
      this.heartbeatDetection(agent).then(() => {
        setTimeout(() => {
          // 如果到了一定时间还没收到uds心跳检测的回调，就唤起uds
          if (!this.isHeartbeatAck) {
            console.log('还没收到回调，唤醒uds')
            this.uds.waken(agent); // 唤起uds
          }
        }, window.SITE_CONFIG.UDSHeartbeatAckTime * 1000 || 3000);
      });
      this.uds.waken(agent); // 唤起uds
    },

    /**
     * @description 更换坐席
     */
    handleChangeSeat(status) {
      this.$refs.dialog.visible = !this.$refs.dialog.visible;
      this.seatAddOrUpdate = status;
      this.visible = false;
      if (this.$refs.dialog.visible) {
        this.getSeatManageGroup();
      }
    },
    /**
     * @description 选中坐席组
     */
    handleSelectedSeat(item, index) {
      // 已经被占用的坐席组不能勾选
      if (
        item.status &&
        item.status === 1 &&
        item.userId &&
        item.userId !== this.userId
      ) {
        return;
      }
      this.activeIndex = index;
      this.selectedSeat = item;
    },
    /**
     * @description 坐席管理(超管) 列表 模糊查询
     */
    getSeatManageGroup() {
      this.dataListLoading = true;
      const data = {
        name: this.seatNumber,
        page: this.pageIndex,
        limit: this.pageSize,
        type: 1, // 1:为登录判断是否可用 2：为坐席组列表显示
      };
      $seat.getSeatManageGroup(data, this.getSeatManageGroupCallback);
    },
    /**
     * @description 坐席管理(超管) 列表 模糊查询 回调函数
     */
    getSeatManageGroupCallback(type, data) {
      this.dataListLoading = false;
      if (type === 'success') {
        if (data.data.list.length > 0) {
          this.isHaveSeatPermission = true;
          this.dataList = data.data.list;
          this.totalPage = data.data.totalPage;
          this.getUserSeatInformation(); // 获取个人信息
        } else {
          this.isHaveSeatPermission = false;
        }
      } else {
        if (data.code) {
          this.$message.error(
            `查询列表失败，错误代码：${data.code}，错误信息：${data.msg}`,
          );
        }
        this.dataList = [];
        this.totalPage = 0;
      }
    },
  },
};
</script>

<style lang="scss">
.select-seat-dialog {
  display: inline-block;
  // 坐席按钮图标
  .site-navbar__menu__seat {
    border: 0;
    outline: 0;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    cursor: pointer;
    background: no-repeat center/100% 100% url('../../assets/svg/seat.svg');
    position: relative;
  }

  .seat-information {
    position: absolute;
    left: -30%;
    top: 40px;
    z-index: 2005;
    background: #ffffff;
    box-shadow: 0px 4px 14px 3px rgba(44, 45, 46, 0.16);
    border-radius: 6px;

    // 头部
    .seat-information-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f0f0f0;
      padding: 12px 20px 10px 20px;
      & > span {
        width: auto;
        font-size: 14px;
        font-weight: 500;
        color: #333333;
      }
      & > button {
        padding: 0;
      }
    }

    // 身体
    .seat-information-body {
      list-style: none;
      margin: 0;
      padding: 10px 20px;
      .seat-information-body__seat {
        list-style: none;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
      }
    }

    // 没数据
    .no-set-seat {
      width: 167px;
      height: 106px;
      line-height: 106px;
      font-size: 14px;
      font-weight: 500;
      color: #333333;
      text-align: center;
    }

    // 底部
    .seat-information-footer {
      height: 40px;
      width: 100%;
      text-align: center;
      vertical-align: center;
      border-top: 1px solid #f0f0f0;
    }
  }

  .seat-cards {
    width: 460px;
    height: 300px;
    padding: 10px 20px;
    box-sizing: border-box;
    overflow-y: scroll;
    text-align: center;
    line-height: 280px;

    &::-webkit-scrollbar {
      background: transparent;
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: #d5d5d5;
      border-radius: 5px;
    }

    .seat-card {
      width: 100%;
      height: 134px;
      margin-bottom: 10px;
      background: #ffffff;
      border-radius: 3px;
      border: 1px solid #dddee1;
      box-sizing: border-box;
      float: left;
      cursor: pointer;
      position: relative;

      // 激活样式
      &__active {
        border: 1px solid #0091ff;
      }

      // 禁用样式
      &__disabled {
        background: #f2f2f2 !important;
      }

      // 禁用时的遮罩层
      .disabled-mask {
        display: none;
        width: 420px;
        height: 134px;
        line-height: 134px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 3px;
        position: absolute;
        top: 0;
        left: 0;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        color: #ffffff;
      }
      &:hover {
        .disabled-mask {
          display: block;
        }
        .seat-card-header {
          &__disabled {
            filter: blur(1px);
            background: transparent !important;
            border-bottom: 1px solid #9b9b9b;
          }
        }
        .seat-card-body {
          &__disabled {
            filter: blur(1px);
            background: transparent !important;
          }
        }
      }

      // 头部
      .seat-card-header {
        height: 32px;
        line-height: 32px;
        width: 100%;
        text-align: center;
        font-weight: 500;
        color: #333333;
        border-bottom: 1px solid #dddee1;
        background: #fbfcff;

        &__disabled {
          background: #f2f2f2;
        }
      }

      // 身体
      .seat-card-body {
        height: 100px;
        width: 100%;
        background: transparent;

        &__disabled {
          background: #f2f2f2;
        }

        ul,
        li {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .seat-list {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          height: 100%;
          background-image: url('../../assets/svg/seatBG.svg');
          padding: 10px;

          & > li {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            overflow: hidden;
            .seat-item-icon {
              width: 15px;
              margin-right: 8px;
              & > img {
                width: 15px;
                height: 14px;
              }
            }
            & > span {
              width: calc(100% - 15px);
              overflow: hidden;
              display: block;
              font-size: 14px;
              font-weight: 400;
              color: #666666;
              text-overflow: ellipsis;
              white-space: nowrap;
              text-align: left;
            }
          }
        }
      }
    }

    .el-loading-spinner {
      width: 100%;
      height: 100%;
      margin: 0;
      font-size: 40px;
      top: 0;
    }
  }

  // 底部
  .seats-dialog-footer {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-top: 1px solid #dddee1;

    .seats-dialog-footer__radio {
      .el-checkbox__inner {
        border-radius: 50%;
      }
      & span {
        font-size: 12px;
        font-weight: 400;
        color: #666666;
      }
    }

    .seats-dialog-footer__button {
      .sv-button {
        padding: 0 14px;
      }
    }
  }

  .seat-card-popper {
    background: rgba(0, 0, 0, 0.6) !important;
    box-shadow: 0px -2px 7px 0px rgba(0, 0, 0, 0.18);
  }
}
</style>
