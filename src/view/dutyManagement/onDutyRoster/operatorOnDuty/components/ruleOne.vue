<!--添加挂起规则 ruleOne-->
<template>
  <div>
    <el-row class="row-style">
      <el-col :span="1" class="checkbox-style">
        <el-checkbox v-model="checked"></el-checkbox>
      </el-col>
      <el-col :span="4" class="title-style">
        <div>挂起时间段1设定</div>
      </el-col>
      <el-col :span="18" class="select-wrapper">
        <el-date-picker
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="mini" icon="el-icon-minus" class="reduce-rules" @click="deleteThisRule"></el-button>
      </el-col>
    </el-row>
    <el-row class="row-style">
      <el-col :span="1" class="checkbox-style">
        <el-checkbox v-model="checked"></el-checkbox>
      </el-col>
      <el-col :span="4" class="title-style">
        <div>挂起周工作日</div>
      </el-col>
      <el-col :span="18" class="select-wrapper">
        <el-checkbox-group v-model="value" @change="handleCheckedWeekChange" class="checkbox-wrapper">
          <el-checkbox v-for="week in weekList" :label="week" :key="week">{{week}}</el-checkbox>
        </el-checkbox-group>
      </el-col>
    </el-row>
    <el-row class="row-style">
      <el-col :span="1" class="checkbox-style">
        <el-checkbox v-model="checked"></el-checkbox>
      </el-col>
      <el-col :span="4" class="title-style">
        <div>挂起工作时段</div>
      </el-col>
      <el-col :span="18" class="select-wrapper">
        <el-time-select
          v-model="value"
          size="small"
          :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30'
          }"
          placeholder="选择时间">
        </el-time-select>
        <i class="el-icon-minus"></i>
        <el-time-select
          v-model="value"
          size="small"
          :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30'
          }"
          placeholder="选择时间">
        </el-time-select>
      </el-col>
    </el-row>
    <el-row class="row-style">
      <el-col :span="1" class="checkbox-style">
      </el-col>
      <el-col :span="4" class="title-style">
        <div>时段挂起人员</div>
      </el-col>
      <el-col :span="18">
        <personnel-pool
            :personnel-pool="mansList"
            :type="type"
            @delete="deletePersonnel"
            @add="addPersonnel"
            @allCheck="allCheck"
            @cancelAllCheck="cancelAllCheck">
          </personnel-pool>
      </el-col>
    </el-row>
    <div class="save-btn">
      <el-button type="primary" size="small" @click="saveRule">保存</el-button>
    </div>
  </div>
</template>
<script>
import personnelPool from './personnelPool.vue'

export default {
  name: 'ruleOne',
  props: ['formData'],
  components: {
    personnelPool
  },
  data() {
    return {
      checked: '',
      dialogVisible: true,
      value: '',
      value1: '',
      weekList:['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      type: 'small',
      mansList: [],
      tabData: [
        {
          label: '区带班领导',
          name: 'areaLeader'
        },
        {
          label: '应急局带班',
          name: 'emergencyBureau'
        },
        {
          label: '区委区政府618',
          name: 'goverment' 
        },
        {
          label: '指挥中心622',
          name: 'commandCentre'
        },
        {
          label: '技术值班',
          name: 'technology'
        },
      ],
    }
  },
  methods: {
    handleCheckedWeekChange() {

    },
    deletePersonnel() {

    },
    addPersonnel() {

    },
    cancelAllCheck() {

    },
    allCheck() {

    },
    // 删除本条规则
    deleteThisRule() {
      this.$emit('deleteRule', this.formData)
    },
    // 保存该表单
    saveRule() {

    }
  }
}
</script>
<style scoped>
.add-rule {
  text-align: right;
}
/deep/ .add-rule .el-button {
  width:18px;
  height:18px;
  background:rgba(0,145,255,1);
  border-radius:3px;
  color: #ffffff;
  padding: 0;
}
.title-style {
  height:30px;
  line-height: 30px;
  text-align: right;
}
.checkbox-style {
  height:30px;
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
  width:509px;
  height:30px;
  background:rgba(242,242,242,1);
  border-radius:3px;
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
.el-date-editor.el-input, .el-date-editor.el-input__inner {
  width:240px;
}
.el-icon-minus {
  color: rgba(221,221,221,1);
  margin: 0 4px;
}

/deep/ .reduce-rules.el-button {
  width:18px;
  height:18px;
  background:rgba(0,145,255,1);
  border-radius:3px;
  color: #ffffff;
  padding: 0;
  border: 1px solid rgba(0,145,255,1);
}
.save-btn {
  display: flex;
  justify-content: flex-end;
}
</style>