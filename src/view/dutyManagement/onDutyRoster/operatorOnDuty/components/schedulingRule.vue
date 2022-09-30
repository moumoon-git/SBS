<!--添加挂起规则 SchedulingRule-->
<template>
  <div :class="index !== 0 ? 'item-rule' : ''">
    <el-row class="row-style">
      <el-col
        :span="1"
        class="checkbox-style"
      >
        <el-checkbox
          v-model="addDate"
          :disabled="editOrSave === 'edit'"
        ></el-checkbox>
      </el-col>
      <el-col
        :span="4"
        class="title-style"
      >
        <div>{{ '挂起时间段' + (index + 1) + '设定' }}</div>
      </el-col>
      <el-col
        :span="18"
        class="select-wrapper"
      >
        <el-date-picker
          v-model="selectedDate"
          :disabled="!addDate || editOrSave === 'edit'"
          size="small"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="datePickerChange"
        />
        <el-button
          type="mini"
          icon="el-icon-minus"
          class="reduce-rules"
          @click="deleteThisRule"
        />
      </el-col>
    </el-row>

    <el-row class="row-style">
      <el-col
        :span="1"
        class="checkbox-style"
      >
        <el-checkbox
          v-model="addWeek"
          :disabled="editOrSave === 'edit'"
        />
      </el-col>
      <el-col
        :span="4"
        class="title-style"
      >
        <div>挂起周工作日</div>
      </el-col>
      <el-col
        :span="18"
        class="select-wrapper"
      >
        <el-checkbox-group
          v-model="selectedWeek"
          class="checkbox-wrapper"
          @change="handleCheckedWeekChange"
        >
          <el-checkbox
            v-for="day in weekList"
            :key="day.name"
            :label="day.key"
            :disabled="!addWeek || editOrSave === 'edit'"
          >
            {{ day.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-col>
    </el-row>

    <el-row class="row-style">
      <el-col
        :span="1"
        class="checkbox-style"
      >
        <el-checkbox
          v-model="addTime"
          :disabled="editOrSave === 'edit'"
        />
      </el-col>
      <el-col
        :span="4"
        class="title-style"
      >
        <div>挂起工作时段</div>
      </el-col>
      <el-col
        :span="18"
        class="select-wrapper"
      >
        <el-time-picker
          v-model="startTime"
          size="small"
          :disabled="!addTime || editOrSave === 'edit'"
          :picker-options="pickerOptionsStart"
          placeholder="开始时间"
          value-format="HH:mm:ss"
          @change="startTimeChange"
        />
        <i class="el-icon-minus" />
        <el-time-picker
          v-model="endTime"
          size="small"
          :disabled="!addTime || editOrSave === 'edit'"
          :picker-options="pickerOptionsStart"
          placeholder="结束时间"
          value-format="HH:mm:ss"
          @change="endTimeChange"
        />
      </el-col>
    </el-row>

    <el-row class="row-style">
      <el-col
        :span="1"
        class="checkbox-style"
      />
      <el-col
        :span="4"
        class="title-style"
      >
        <div>时段挂起人员</div>
      </el-col>
      <el-col
        :span="18"
        style="margin-left: 10px"
      >
        <personnel-pool
          :class-list="classTabs"
          :active-class="activeClass"
          :personnel-pool="mansList"
          :type="type"
          :selected-contactors="formData.contactorIds"
          :is-edit="editOrSave"
          @delete="deletePersonnel"
          @add="addPersonnel"
          @allCheck="allCheck"
          @cancelAllCheck="cancelAllCheck"
          @changeClass="changeClass"
          @checkChange="checkChange"
        />
      </el-col>
    </el-row>
    <div class="save-btn">
      <el-button
        v-if="editOrSave === 'edit'"
        type="primary"
        size="small"
        @click="editRule"
      >
        编辑
      </el-button>
      <el-button
        v-if="editOrSave === 'save'"
        type="primary"
        size="small"
        @click="saveRule"
      >
        保存
      </el-button>
    </div>
  </div>
</template>
<script>
import personnelPool from './personnelPool.vue';

export default {
  name: 'SchedulingRule',
  components: {
    personnelPool,
  },
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
    length: {
      type: Number,
      default: 0,
    },
    classList: {
      type: Array,
      default: () => [],
    },
    activeClass: {
      type: [Number, String],
      default: '',
    },
    classContactorIds: {
      type: Array,
      default: () => [],
    },
    classMansList: {
      type: Array,
      default: () => [],
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  // props: [
  //   'formData',
  //   'length',
  //   'classList',
  //   'activeClass',
  //   'classContactorIds',
  //   'classMansList',
  //   'index',
  // ],
  data() {
    return {
      addDate: false,
      addWeek: false,
      addTime: false,
      dialogVisible: true,
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      selectedWeek: [], // 选择的week
      selectedDate: [], // 日期范围
      startDate: '', // 开始日期
      endDate: '', // 结束日期
      editOrSave: 'save', // 编辑或保存按钮
      type: 'small', // 区分弹窗人员设置（big)，排班挂起（small）
      mansList: [], // 联系人列表
      classId: '', // 当前班次id
      contactorIds: [], // 所有联系人
      selectContactors: [], // 勾选中的联系人
      weekList: [
        { name: '周一', key: '1' },
        { name: '周二', key: '2' },
        { name: '周三', key: '3' },
        { name: '周四', key: '4' },
        { name: '周五', key: '5' },
        { name: '周六', key: '6' },
        { name: '周日', key: '7' },
      ],
      pickerOptionsStart: {
        disabledDate(time) {
          return (
            time.getTime() < new Date(new Date().toLocaleDateString()).getTime()
          );
        },
      },
      classTabs: [],
    };
  },
  watch: {
    selectedDate: {
      handler(newVal) {
        if (newVal !== []) {
          [this.startDate, this.endDate] = newVal;
        } else {
          this.startDate = '';
          this.endDate = '';
        }
      },
    },
    addDate: {
      handler(newVal) {
        if (!newVal) {
          this.selectedDate = [];
        }
      },
    },
    addWeek: {
      handler(newVal) {
        if (!newVal) {
          this.selectedWeek = [];
        }
      },
    },
    addTime: {
      handler(newVal) {
        if (!newVal) {
          this.startTime = '';
          this.endTime = '';
        }
      },
    },
    classMansList: {
      handler(newVal) {
        this.mansList = newVal;
      },
    },
    formData: {
      handler(newVal) {
        console.log('formData', newVal)
        if (newVal) {
          this.editOrSave = 'edit';
        }
      },
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    /**
     * @description 数据初始化
     */
    initData() {
      // 班次内所有联系人
      this.mansList = this.classMansList;
      this.contactorIds = this.classContactorIds;
      this.classTabs = this.classList.filter((item) => item.id === this.activeClass);
      // 挂起工作时间
      this.startTime = this.formData.startTime ? this.formData.startTime : '';
      this.endTime = this.formData.endTime ? this.formData.endTime : '';

      // 挂起周工作日
      if (this.formData.day) {
        if (this.formData.day.length === 1) {
          this.selectedWeek.push(this.formData.day);
        } else {
          this.selectedWeek = this.formData.day.split(',');
        }
      } else {
        this.selectedWeek = [];
      }

      // 联系人
      if (this.formData.contactorId) {
        this.selectContactors.push(this.formData.contactorId);
      }
      this.selectContactors = this.formData.contactorIds ? this.formData.contactorIds : [];

      // 挂起工作时间段
      if (this.formData.startDate && this.formData.endDate) {
        this.selectedDate = [this.formData.startDate, this.formData.endDate];
        this.startDate = this.formData.startDate;
        this.endDate = this.formData.endDate;
      }

      this.classId = this.formData.classId;
      if (this.formData.classId && this.formData.contactorIds.length > 0) {
        this.editOrSave = 'edit';
      }
      if (!this.formData.classId || this.formData.contactorIds.length === 0) {
        this.editOrSave = 'save';
      }
    },
    // 拼接数据传给父组件 schedulingSuspended.vue
    async getData() {
      let day = '';
      if (this.selectedWeek.length > 0) {
        day = this.selectedWeek.sort().join(',');
      }
      const data = {
        classId: this.classId.toString(),
        contactorIds: this.selectContactors,
        startDate: this.startDate,
        endDate: this.endDate,
        day,
        startTime: this.startTime,
        endTime: this.endTime,
      };
      const params = {
        index: this.index,
        data,
      };
      this.$emit('getData', params);
      return params;
    },
    // 日期选择器改变
    datePickerChange() {
      this.getData();
    },
    // 勾选周工作日
    handleCheckedWeekChange() {
      this.getData();
    },
    // 改变开始时间
    startTimeChange() {
      this.getData();
    },
    // 改变结束时间
    endTimeChange() {
      this.getData();
    },
    // 删除值班人员
    deletePersonnel() {},
    // 添加值班人员
    addPersonnel() {},
    // 取消全选
    cancelAllCheck(val) {
      this.selectContactors = val;
      this.getData();
    },
    // 全选
    allCheck(val) {
      this.selectContactors = val;
      this.getData();
    },
    // 单个人员勾选
    checkChange(val) {
      this.selectContactors = val;
      this.getData();
    },
    // 删除本条规则
    deleteThisRule() {
      this.$confirm('是否确认删除该条挂起规则？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$emit('deleteRule', this.formData);
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });
        });
    },
    // 值班人员---添加挂起规则
    // classId 班次id [string]
    // contactorIds 联系人id数组 [array]
    // startDate 开始日期 2018-08-18 [string]
    // endDate 结束日期 2018-08-18 [string]
    // day 星期 1,3,5 [string]
    // startTime 开始时间 17:50:11 [string]
    // endTime
    async addRule() {
      const params = await this.getData();
      const { data } = params;
      this.$api.addRule(data).then((res) => {
        if (res.errorcode === 0) {
          this.$message({
            type: 'success',
            message: '保存成功!',
          });
          this.editOrSave = 'edit';
          this.$emit('update', params);
        }
      });
    },
    // 保存该表单
    saveRule() {
      this.addRule();
      this.editOrSave = 'edit';
    },
    // 编辑表单
    editRule() {
      this.editOrSave = 'save';
    },
    // 切换班次
    changeClass(classId) {
      this.contactorIds = [];
      this.classId = Number(classId);
      this.getAllContactorByClassId(this.classId);
    },
    // 根据班次id查询值班人员
    getAllContactorByClassId(classId) {
      const data = {
        classId,
      };
      this.$api.getAllContactorByClassId(data).then((res) => {
        if (res.errorcode === 0) {
          this.mansList = res.data;
          this.mansList.forEach((el) => {
            this.contactorIds.push(el.id);
          });
        }
      });
    },
  },
};
</script>
<style scoped>
.item-rule {
  padding-top: 10px;
  margin-top: 20px;
  border-top: 1px dashed gray;
}
.add-rule {
  text-align: right;
}
/deep/ .add-rule .el-button {
  width: 18px;
  height: 18px;
  background: rgba(0, 145, 255, 1);
  border-radius: 3px;
  color: #ffffff;
  padding: 0;
}
.title-style {
  height: 30px;
  line-height: 30px;
  text-align: right;
}
.checkbox-style {
  height: 30px;
  line-height: 30px;
}
.select-wrapper {
  display: flex;
  margin-left: 10px;
  align-items: center;
  justify-content: space-between;
}
.checkbox-wrapper {
  height: 30px;
  line-height: 30px;
  display: flex;
  justify-content: flex-start;
  width: 509px;
  height: 30px;
  background: rgba(242, 242, 242, 1);
  border-radius: 3px;
  padding: 0 0 0 16px;
}
.el-checkbox {
  margin-right: 20px !important;
}
/deep/ .el-checkbox__label {
  font-size: 12px !important;
}
.row-style {
  margin-bottom: 10px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 240px;
}
.el-icon-minus {
  color: rgba(221, 221, 221, 1);
  margin: 0 4px;
}

/deep/ .reduce-rules.el-button {
  width: 18px;
  height: 18px;
  background: rgba(0, 145, 255, 1);
  border-radius: 3px;
  color: #ffffff;
  padding: 0;
  border: 1px solid rgba(0, 145, 255, 1);
}
.save-btn {
  display: flex;
  justify-content: flex-end;
}
</style>
