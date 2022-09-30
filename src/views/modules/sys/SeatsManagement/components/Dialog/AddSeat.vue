<!-- 弹窗--新增坐席 -->
<template>
  <div class="add-seat-dialog">
    <sv-dialog ref="dialog" :title="title" :modal="true" @cancel="handleCancel">
      <div class="seat-dialog-body">
        <el-form
          :model="formData"
          :rules="formRules"
          label-position="right"
          label-width="80px"
        >
          <el-form-item label="坐席类型">
            <el-select
              v-model="formData.seatType"
              placeholder="请选择坐席类型"
              style="width: 280px"
              @change="handleChangeSeatType"
            >
              <el-option
                v-for="item in seatType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                clearable
                style="width: 280px"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="坐席号码" prop="seatNumber">
            <el-input
              v-model.trim="formData.seatNumber"
              :placeholder="
                title === '新增坐席' ? '请输入坐席号码，以‘，’逗号隔开' : '请输入坐席号码'
              "
              style="width: 280px"
            />
            <!-- 注释原因：需求优化（不再从ucs那边同步坐席信息了），以下选择框替换成输入框 -->
            <!-- <el-select
              v-model="formData.seatNumber"
              placeholder="请选择"
              style="width: 280px"
            >
              <el-option
                v-for="item in seatNumbers"
                :key="item.id"
                :label="item.displayname"
                :value="item.extension"
                :disabled="item.platformId && item.platformId !== ''"
                clearable
              />
            </el-select> -->
          </el-form-item>
          <el-form-item label="关联平台">
            <el-cascader
              v-model="formData.associatedPlatform"
              :options="platformData"
              :props="platformProps"
              :show-all-levels="false"
              filterable
              clearable
              style="width: 280px"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="seats-dialog-footer">
          <div :title="errorTips" class="footer-left">
            {{ errorTips }}
          </div>
          <div class="footer-right">
            <sv-button @click="cancelAddSeat">取消</sv-button>
            <sv-button type="primary" @click="submitAddSeat">确定</sv-button>
          </div>
        </div>
      </template>
    </sv-dialog>
  </div>
</template>
<script>
import SvSelect from '../sv_select';
import $seat from '../../assets/js/seatManagementApi.js';
export default {
  name: 'AddSeatDialog',
  components: {
    SvSelect,
  },
  props: {
    // 坐席类型
    seatType: {
      type: Array,
      default: () => [],
    },
    // 平台信息
    platformData: {
      type: Array,
      default: () => [],
    },
    // 配置选项
    platformProps: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: '新增坐席',
    },
  },
  data() {
    const validateSeatNumber = (rule, value, callback) => {
      const patrn = /[@#\$%\^&\*\!\~\(\)\`\{\}\[\]\'\"\“\”\。\.\/\:\;\；\：\=\+\\\_\——\）\（\|\、\【\】\！]+/g;
      const patrn2 = /[@#\$%\^&\*\!\~\(\)\`\{\}\[\]\'\"\“\”\。\.\/\:\;\；\：\=\+\\\_\——\）\（\|\、\【\】\！\,\，]+/g;
      let arr = [];
      let arr2 = [];
      if (value.indexOf('，') > -1) {
        arr = value.replace(/\，/g, ',').split(',');
      } else {
        arr = value.split(',');
      }
      arr.forEach((item) => {
        const filerData = arr.filter((el) => item === el);
        if (filerData.length > 1) {
          arr2.push(filerData[0]);
        }
      });
      if (this.title === '新增坐席') {
        if (patrn.test(value)) {
          callback(new Error('请勿输入非法字符'));
        } else if (arr2.length > 0) {
          callback(new Error(`坐席号码重复：${[...new Set(arr2)].join(',')}`));
        } else {
          callback();
        }
      } else {
        if (patrn2.test(value)) {
          callback(new Error('请勿输入非法字符'));
        } else {
          callback();
        }
      }
    };
    return {
      seatNumbers: [], // 坐席号码
      formData: {
        seatType: '', // 坐席类型
        seatNumber: '', // 坐席号码
        associatedPlatform: [], // 关联平台
      },
      formRules: {
        seatNumber: [
          {
            validator: validateSeatNumber,
            triggle: 'blur',
          },
        ],
      },
      errorTips: '', // 错误提示
    };
  },
  mounted() {
    this.$refs.dialog.visible = true;
  },
  methods: {
    /**
     * @description 坐席类型改变时触发
     */
    handleChangeSeatType(val) {
      // this.formData.seatNumber = '';
      this.getLocalSeatUcsInfo(val);
    },
    /**
     * @description 坐席管理（超管） 调用UDS 获取 坐席信息
     */
    getLocalSeatUcsInfo(seatType) {
      const data = {
        seatType,
      };
      $seat.getLocalSeatUcsInfo(data, this.getLocalSeatUcsInfoCallback);
    },
    /**
     * @description 坐席管理（超管） 调用UDS 获取 坐席信息接口回调信息
     */
    getLocalSeatUcsInfoCallback(type, data) {
      if (type === 'success') {
        this.seatNumbers = data.data;
      } else {
        this.seatNumbers = [];
      }
    },
    /**
     * @description 关闭弹窗
     */
    handleCancel() {
      this.$emit('cancel');
    },
    /**
     * @description 提交新建坐席
     */
    submitAddSeat() {
      // 判断数据是否填写完整
      if (this.formData.seatType === '' || this.formData.seatNumber === '') {
        this.$message.info('请完善坐席信息');
        return;
      }
      if (this.title === '新增坐席') {
        const data = {
          seatTypeId: this.formData.seatType,
          seatNumber: this.formData.seatNumber.replace(/\，/g, ','),
          connectPlatformId: this.formData.associatedPlatform[
            this.formData.associatedPlatform.length - 1
          ],
        };
        $seat.addSeatInfo(data, this.addSeatInfoCallback);
      } else {
        const data = {
          id: this.formData.id,
          seatTypeId: this.formData.seatType,
          seatNumber: this.formData.seatNumber,
          connectPlatformId: this.formData.associatedPlatform[
            this.formData.associatedPlatform.length - 1
          ],
        };
        $seat.updateSeatInfo(data, this.editSeatInfoCallback);
      }
    },
    /**
     * @description 新建坐席回调
     */
    addSeatInfoCallback(type, data) {
      if (type === 'success') {
        this.$message({
          message: '添加成功',
          type: 'success',
        });
        this.$emit('success');
      } else {
        if (data.code === 30001) {
          if (data.data) {
            this.errorTips = `坐席号码${data.data}已存在`;
          }
        } else {
          this.$message.error(
            `新建坐席失败，错误代码：${data.code}，错误信息：${data.msg}`,
          );
        }
      }
    },
    /**
     * @description 编辑坐席回调
     */
    editSeatInfoCallback(type, data) {
      if (type === 'success') {
        this.$message({
          message: '修改成功',
          type: 'success',
        });
        this.$emit('success');
      } else {
        if (data.code === 30001) {
          if (data.data) {
            this.errorTips = `坐席号码${data.data}已存在`;
          }
        } else {
          this.$message.error(
            `修改坐席失败，错误代码：${data.code}，错误信息：${data.msg}`,
          );
        }
      }
    },
    /**
     * @description 取消提交新建坐席
     */
    cancelAddSeat() {
      Object.assign(this.formData, {
        seatType: '', // 坐席类型
        seatNumber: '', // 坐席号码
        associatedPlatform: [], // 关联平台
      });
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
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-top: 1px solid #dddee1;

    .footer-left {
      color: #f56c6c;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 200px;
      white-space: nowrap;
      height: 60px;
      line-height: 60px;
    }

    .footer-right {
    }

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
