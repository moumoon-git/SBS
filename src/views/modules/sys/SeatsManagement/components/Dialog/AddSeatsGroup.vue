<!-- 弹窗--新增坐席 -->
<template>
  <div class="add-seat-dialog">
    <sv-dialog
      ref="dialog"
      :title="title"
      :modal="true"
      @cancel="handleCancel"
    >
      <div class="seat-dialog-body">
        <el-form
          :model="formData"
          label-position="right"
          label-width="80px"
        >
          <el-form-item label="坐席名称">
            <el-input
              v-model="formData.seatName"
              size="small"
              style="width: 280px"
            />
          </el-form-item>
          <el-form-item label="电话坐席">
            <SvSelect
              v-model="formData.phoneSeat"
              :options="phoneSeats"
              @change="handleChangePhoneSeat"
            />
          </el-form-item>
          <el-form-item label="会场终端">
            <SvSelect
              v-model="formData.placeTerminal"
              :options="placeTerminalSeats"
              @change="handleChangePlaceTerminal"
            />
          </el-form-item>
          <el-form-item label="监控终端">
            <SvSelect
              v-model="formData.mornitoringTerminal"
              :options="mornitoringTerminalSeats"
              @change="handleChangeMornitoringTerminal"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="seats-dialog-footer">
          <sv-button
            @click="cancelSubmit"
          >
            取消
          </sv-button>
          <sv-button
            type="primary"
            @click="submitSeatsGroup"
          >
            确定
          </sv-button>
        </div>
      </template>
    </sv-dialog>
  </div>
</template>
<script>
import SvSelect from '../sv_select';
import $seat from "../../assets/js/seatManagementApi.js";

export default {
  name: 'AddSeatDialog',
  components: {
    SvSelect
  },
  props: {
    title: {
      type: String,
      default: '新增坐席组',
    },
  },
  data() {
    return {
      formData: {
        seatName: '', // 坐席名称
        phoneSeat: '', // 电话坐席
        placeTerminal: '', // 会场终端
        mornitoringTerminal: '', // 监控终端
      },
      phoneSeats: [],
      placeTerminalSeats: [],
      mornitoringTerminalSeats: [],
      isExist: false, // 坐席组名字是否存在
    };
  },
  mounted() {
    this.$refs.dialog.visible = true;
    this.getTypeSeatInfoList();
  },
  methods: {
    /**
     * @description 初始化数据
     */
    handleInitData() {
      Object.assign(this.formData, {
        seatName: '', // 坐席名称
        phoneSeat: '', // 电话坐席
        placeTerminal: '', // 会场终端
        mornitoringTerminal: '', // 监控终端
      });
    },
    /**
     * @description 取消提交
     */
    cancelSubmit() {
      this.$emit('cancel');
    },
    /**
     * @description 添加坐席组前 获取坐席组名字是否存在
     */
    getSeatGroupNameIsExist() {
      this.isExist = false;
      const data = {
        name: this.formData.seatName,
      };
      $seat.searchByname(data, this.searchBynameCallback);
    },
    /**
     * @description 添加坐席组前 获取坐席组名字是否存在 回调函数
     */
    searchBynameCallback(type, data) {
      if (type === 'success') {
        this.isExist = data.data.length === 0;
      }
    },
    /**
     * @description 提交坐席组
     */
    submitSeatsGroup() {
      if (this.formData.seatName === '' || this.formData.phoneSeat === '' || this.formData.placeTerminal === '' || this.formData.mornitoringTerminal === '') {
        this.$message.info('请将坐席组信息补充完整');
        return;
      }
      if (this.title === '新增坐席组') {
        this.getSeatGroupNameIsExist();
        const data = {
          name: this.formData.seatName,
        };
        this.$http({
          url: this.$http.adornUrl('/seatmanage/seatManageGroup/searchByname'),
          method: 'get',
          params: this.$http.adornParams(data),
        }).then((res) => {
          if (res.data.code === 0) {
            if (res.data.data.length > 0) {
              this.$message.info('坐席组名字已存在，请重新输入');
            } else {
              const params = {
                seatGroupName: this.formData.seatName, // 坐席名称
                phoneSeatId: this.formData.phoneSeat, // 电话坐席
                meetSeatId: this.formData.placeTerminal, // 会场终端
                monitorSeatId: this.formData.mornitoringTerminal, // 监控终端
              };
              $seat.addSeatGroup(params, this.addSeatGroupCallback);
            }
          }
        });
      } else {
        const data = {
          id: this.formData.id,
          seatGroupName: this.formData.seatName, // 坐席名称
          phoneSeatId: this.formData.phoneSeat, // 电话坐席
          meetSeatId: this.formData.placeTerminal, // 会场终端
          monitorSeatId: this.formData.mornitoringTerminal, // 监控终端
        };
        $seat.updateSeatGroup(data, this.editSeatGroupCallback);
      }
    },
    /**
     * @param {string} type success: 成功 error: 失败
     * @param {object} data 接口返回数据
     * @description 坐席管理平台 添加坐席组
     */
    addSeatGroupCallback(type, data) {
      if (type === 'success') {
        this.$emit('success');
        this.$message.success('新增坐席组成功');
      } else {
        this.$message.error(`新增坐席组失败，错误代码：${data.code}，错误信息：${data.msg}`);
      }
    },
    /**
     * @param {string} type success: 成功 error: 失败
     * @param {object} data 接口返回数据
     * @description 坐席管理平台 编辑坐席组
     */
    editSeatGroupCallback(type, data) {
      if (type === 'success') {
        this.$emit('success');
        this.$message.success('编辑坐席组成功');
      } else {
        this.$message.error(`编辑坐席组失败，错误代码：${data.code}，错误信息：${data.msg}`);
      }
    },
    getSeatInfo(seatType) {
      const data = {
        seatType,
        connectPlatformId: this.$store.state.user.platformId,
        seatNumber: '',
        page: 1,
        limit: 10000,
      };
      $seat.getSeatInfo(data, this.getSeatInfoCallback);
    },
    getSeatInfoCallback(type, params, data) {
      if (type === 'success') {
        const seats = data.data.list.map((item) => {
          let newData = item;
          // newData.status 为1或者空，标识坐席被占用了
          if (!newData.manageGroupId || newData.manageGroupId === 0) {
            Object.assign(newData, { disabled: false });
          } else {
            Object.assign(newData, { remark: `该坐席已关联“${item.manageGroupName}”无法重复关联` });
            Object.assign(newData, { disabled: true });
          }
          return newData;
        });
        switch (params.seatType) {
          case '0':
            this.phoneSeats = seats;
            break;
          case '1':
            this.placeTerminalSeats = seats;
            break;
          default:
            this.mornitoringTerminalSeats = seats;
        }
      } else {
        this.$message.error(`获取坐席信息失败，错误代码：${data.code}，错误信息：${data.msg}`);
      }
    },
    /**
     * @description 坐席管理(平台) 坐席信息下拉列表
     */
    getTypeSeatInfoList() {
      // 0：代表电话坐席 1 代表会议坐席  2 代表 监控终端
      // $seat.getTypeSeatInfoList('0', this.getTypeSeatInfoListCallback);
      // $seat.getTypeSeatInfoList('1', this.getTypeSeatInfoListCallback);
      // $seat.getTypeSeatInfoList('2', this.getTypeSeatInfoListCallback);
      this.getSeatInfo('0');
      this.getSeatInfo('1');
      this.getSeatInfo('2');
    },
    /**
     * @param {string} type success: 成功 error: 失败
     * @param {string} seatType 0：代表电话坐席 1 代表会议坐席  2 代表 监控终端
     * @param {object} data 接口返回数据
     * @description 坐席管理(平台) 坐席信息下拉列表 回调函数
     */
    getTypeSeatInfoListCallback(type, seatType, data) {
      if (type === 'success') {
        const seats = data.data.map((item) => {
          let newData = item;
          // newData.manageGroupId 不为0或者空，标识坐席被占用了
          if (!newData.manageGroupId || newData.manageGroupId === 0) {
            Object.assign(newData, { disabled: false });
          } else {
            Object.assign(newData, { remark: `该坐席已关联“${item.manageGroupName}”无法重复关联` });
            Object.assign(newData, { disabled: true });
          }
          return newData;
        });
        switch (seatType) {
          case '0':
            this.phoneSeats = seats;
            break;
          case '1':
            this.placeTerminalSeats = seats;
            break;
          default:
            this.mornitoringTerminalSeats = seats;
        }
      } else {
        this.$message.error(`获取坐席信息失败，错误代码：${data.code}，错误信息：${data.msg}`);
      }
    },
    /**
     * @description 改变电话坐席时触发
     */
    handleChangePhoneSeat(val) {
      this.formData.phoneSeat = val;
    },
    /**
     * @description 改变会场终端时触发
     */
    handleChangePlaceTerminal(val) {
      this.formData.placeTerminal = val;
    },
    /**
     * @description 改变监控终端时触发
     */
    handleChangeMornitoringTerminal(val) {
      this.formData.mornitoringTerminal = val;
    },
    /**
     * @description 关闭弹窗
     */
    handleCancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style lang="scss">
.add-seat-dialog {
  .seat-dialog-body {
    width: 450px;
    padding: 20px 0 0 30px;
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

  .seat-card-popper {
    background: rgba(0, 0, 0, 0.6) !important;
    box-shadow: 0px -2px 7px 0px rgba(0, 0, 0, 0.18);
  }
}
</style>
