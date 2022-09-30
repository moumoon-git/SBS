<template>
  <div>
    <el-dialog title="新增布控" :visible.sync="dialogVisible" width="943px">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发送方域编码">
              <el-input v-model="ruleForm.code"></el-input>
            </el-form-item>

            <el-form-item prop="region" label="布控类型">
              <el-select v-model="ruleForm.region">
                <el-option label="车辆布控" value="1"></el-option>
                <el-option label="人脸黑名单布控" value="2"></el-option>
                <el-option label="人脸白名单布控" value="3"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="命中布控">
              <el-checkbox v-model="ruleForm.checked"></el-checkbox>
            </el-form-item>

            <el-form-item prop="name" label="布控任务名称">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>

            <el-form-item prop="domains" label="布控域信息">
              <el-input v-model="ruleForm.domains"></el-input>
            </el-form-item>

            <el-form-item label="告警级别">
              <el-radio-group v-model="ruleForm.radio">
                <el-radio :label="1">紧急</el-radio>
                <el-radio :label="2">严重</el-radio>
                <el-radio :label="3">一般</el-radio>
                <el-radio :label="4">提示</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item prop="threshold" label="布控阙值">
              <el-input v-model="ruleForm.threshold"></el-input>
            </el-form-item>

            <el-form-item label="相似车牌">
              <el-switch v-model="ruleForm.similar" active-color="#13ce66" inactive-color="#dcdfe6"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="布控生效日期">
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="ruleForm.value1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                clearable
              ></el-date-picker>
            </el-form-item>

            <div style="display:flex;align-items: center;">
              <p style="width:192px;padding-right:10px;text-align:right;">布控生效时间</p>
              <ul class="timeSlot">
                <li class="day" v-for="(item,index) in ruleForm.value2" :key="index">
                  <p v-if="index === 0" class="title">星期一</p>
                  <p v-if="index === 1" class="title">星期二</p>
                  <p v-if="index === 2" class="title">星期三</p>
                  <p v-if="index === 3" class="title">星期四</p>
                  <p v-if="index === 4" class="title">星期五</p>
                  <p v-if="index === 5" class="title">星期六</p>
                  <p v-if="index === 6" class="title">星期日</p>
                  <el-time-picker v-model="item.startTime" arrow-control placeholder="起始时间" value-format="HH:mm:ss" style="margin-right:10px;"></el-time-picker>
                  <el-time-picker arrow-control v-model="item.endTime" placeholder="结束时间" value-format="HH:mm:ss"></el-time-picker>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveDistributionControl">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { format } from "path";
export default {
  data() {
    return {
      dialogVisible: false,

      ruleForm: {
        code: "",
        region: "",
        name: "",
        checked: true,
        value1: "",
        value2: [
          {
            "startTime": "00:00:00",
            "endTime": "23:59:59",
            "day": "0"
          },
          {
            "startTime": "00:00:00",
            "endTime": "23:59:59",
            "day": "1"
          },
          {
            "startTime": "00:00:00",
            "endTime": "23:59:59",
            "day": "2"
          },
          {
            "startTime": "00:00:00",
            "endTime": "23:59:59",
            "day": "3"
          },
          {
            "startTime": "00:00:00",
            "endTime": "23:59:59",
            "day": "4"
          },
          {
            "startTime": "00:00:00",
            "endTime": "23:59:59",
            "day": "5"
          },
          {
            "startTime": "00:00:00",
            "endTime": "23:59:59",
            "day": "6"
          }
        ],
        domains: "",
        groupList: "",
        radio: 1,
        threshold: 85,
        similar: false
      },
      rules: {
        name: [
          { required: true, message: "请输入布控任务名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请选择布控类型", trigger: "change" }
        ],
        // value1: [
        //   {
        //     type: "date",
        //     required: true,
        //     message: "请选择日期",
        //     trigger: "change"
        //   }
        // ],
        domains: [
          { required: true, message: "请输入布控域信息", trigger: "blur" }
        ],
        threshold: [{ type: "number", message: "布控阙值必须为数字值" }]
      }
    };
  },
  methods: {
    // 打开新增弹窗
    init() {
      this.dialogVisible = true;
    },
    // 保存布控
    saveDistributionControl() {
      var that = this
      that
        .$http({
          url: that.$http.adornUrl(`/vcm/vcmSuspectTask/save`),
          method: "POST",
          data: this.$http.adornData({
            srcDomainCode: this.ruleForm.code,
            type: this.ruleForm.region,
            hitType: this.ruleForm.checked?1:2,
            name: this.ruleForm.name,
            startDate: this.ruleForm.value1[0],
            endDate: this.ruleForm.value1[1],
            alarmLevel: this.ruleForm.radio,
            confidenceThreshold: this.ruleForm.threshold,
            plateSimilar: `${this.ruleForm.similar}`,
            timeList: JSON.stringify(this.ruleForm.value2),
            destDomainCode: this.ruleForm.domains
          })
          // data: that.$http.adornData(id)
        })
        .then(({ data }) => {
          if (data && data.code === 0) {
              // console.log(data)
            that.$message({
              message: "添加成功",
              type: "success",
              duration: 1500
            });
            that.$parent.initList()
          } else {
            that.$message.error(data.msg);
          }
        });
      this.dialogVisible = false;
    }
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-date-editor .el-range-separator {
  margin-right: 5px;
}
.timeSlot {
  list-style: none;
  padding: 0;
  border: 1px solid #ccc;
  border-bottom: none;
  .day {
    display: flex;
    border-bottom: 1px solid #ccc;
    align-items: center;
    height: 50px;
    line-height: 50px;
    padding: 0 5px;
    box-sizing: border-box;
    .title {
      margin: 0;
      width: 80px;
      text-align: center;
      border-right: 1px solid #ccc;
      margin-right: 10px;
    }
  }
}
.el-date-editor--daterange.el-input__inner {
  width: 100%;
}
.el-date-editor--timerange.el-input__inner {
  width: 100%;
}
.el-date-editor.el-input{
    width: 46%;
}
.el-input--suffix .el-input__inner {
    padding-right: 0;
}
</style>