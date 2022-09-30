<!-- 事件上报表单 EventReportForm.vue -->
<template>
  <div :style="type === 'create' ? 'overflow: scroll;height: 660px;padding-bottom:20px' : ''">
    <div class="form-content">
      <el-form
        label-width="80px"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        @submit.native.prevent
        label-position="left">
        <el-row :gutter="gutter">
          <el-col :span="12">
            <el-form-item label="报送单位:" prop="reportUnit">
              <el-input
                v-model="ruleForm.reportUnit"
                v-if="type === 'edit'"
                readonly
                size="small"
                class="form-input-style form-readonly-input-style">
              </el-input>
              <el-input
                v-model="ruleForm.reportUnit"
                v-else
                size="small"
                class="form-input-style">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事件标题:" prop="title">
              <el-input
                v-model="ruleForm.title"
                placeholder="请输入事件标题"
                size="small"
                class="form-input-style">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="gutter">
          <el-col :span="12">
            <el-form-item label="发生时间:" prop="happenTime">
              <el-date-picker
                v-model="ruleForm.happenTime"
                type="datetime"
                size="small"
                placeholder="请选择发生时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                class="form-input-style">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报送时间:" prop="sendTime">
              <el-date-picker
                v-model="ruleForm.sendTime"
                type="datetime"
                size="small"
                placeholder="请选择报送时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                class="form-input-style">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="gutter">
          <el-col :span="12">
            <el-form-item label="接报时间:" prop="receiveTime">
              <el-date-picker
                v-model="ruleForm.receiveTime"
                :picker-options="pickerOptions"
                type="datetime"
                size="small"
                placeholder="请选择接报时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                class="form-input-style">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上报人:">
              <el-input
                v-model="ruleForm.sendUserName"
                placeholder="请输入上报人"
                size="small"
                class="form-input-style">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="gutter">
          <el-col :span="12">
            <el-form-item label="事发等级:">
              <el-select
                v-model="ruleForm.disasterLevel"
                size="small"
                placeholder="请选择事件等级"
                class="form-input-style">
                <el-option
                  v-for="item in disasterLevels"
                  :key="item.level"
                  :label="item.name"
                  :value="item.level">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="灾害类型:">
               <el-cascader
                v-model.trim="ruleForm.disasterType"
                :options="eventTypeData"
                :props="props"
                clearable
                size="small"
                placeholder="请选择灾害类型"
                :show-all-levels="false"
                class="form-input-style"
                filterable
                @change="incidenTypeChange"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="gutter">
          <el-col :span="12">
            <el-form-item label="事发地点:">
              <el-input
                type="text"
                size="small"
                v-model.trim="ruleForm.address"
                show-word-limit
                :title="ruleForm.address"
                class="form-input-style"
              >
                <template slot="append">
                  <el-button style="letter-spacing: 6px" @click="location">
                    <i class="el-icon-location-outline"></i>
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经纬度:">
              <el-input
                v-model="ruleForm.lon"
                placeholder="请输入经度"
                size="small"
                style="width:44%">
              </el-input>
              <el-input
                v-model="ruleForm.lat"
                placeholder="请输入纬度"
                size="small"
                style="width:44%">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="gutter">
          <el-col :span="24">
            <el-form-item label="信息要素:" class="information">
              <div style="width:93%;display: flex;justify-content: flex-start;margin-left:20px;background:rgba(249,251,255,1);padding-left:20px;">
                <div style="display: flex;justify-content: flex-start;">
                  <span style="width:100px">死亡人数</span>
                  <el-input-number
                    v-model.number="ruleForm.deathNum"
                    size="small"
                    :min="0"
                    class="underline-input">
                  </el-input-number>
                </div>
                <div style="display: flex;justify-content: flex-start;">
                  <span style="width:100px">失踪人数</span>
                  <el-input-number
                    v-model.number="ruleForm.missNum"
                    size="small"
                    :min="0"
                    class="underline-input">
                  </el-input-number>
                </div>
                <div style="display: flex;justify-content: flex-start;">
                  <span style="width:100px">受伤人数</span>
                  <el-input-number
                    v-model.number="ruleForm.injuredNum"
                    size="small"
                    :min="0"
                    class="underline-input">
                  </el-input-number>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="gutter">
          <el-col :span="24">
            <el-form-item label="事件描述:">
              <el-input
                v-model="ruleForm.description"
                type="textarea"
                size="small"
                @change="inputChange">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="gutter">
          <el-col :span="6">
            <el-form-item label="签发人:" label-width="80px">
              <el-input
                v-model="ruleForm.signUserName"
                size="small"
                class="underline-input">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="电话号码:" label-width="80px" prop="phone">
              <el-input
                v-model="ruleForm.phone"
                size="small"
                class="underline-input">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col
            v-if="type === 'edit'"
            :span="12"
            class="button-list">
            <el-form-item>
              <el-button
                type="text"
                style="color:#F66E6E;"
                @click="deleteReport">删除</el-button>
              <el-button type="text"
              @click="saveEdit">保存</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div
      v-if="type === 'create'"
      class="submit-button">
      <el-button size="small" @click="cancelCreateReport">取消</el-button>
      <el-button type="primary" size="small" @click="createReport">报送</el-button>
    </div>
    <location ref="loction" :mapframe="mapId"></location>

  </div>
</template>
<script>
import Location from "@/components/loction/loction";

export default {
  name: 'EventReportForm',
  components: {
    Location
  },
  props: [
    'formData',
    'type',
    'eventTypeData'
  ],
  data() {
    let number=(rule,value,callback)  =>{
      let num= /^[1][2,3,4,5,6,7,8,9][0-9]{9}$/;
      let n=value.match(num);
      if(n ==null){
        callback(new Error('请输入正确的电话号码!'));
      }
      callback();
    };
    // let receive_time=(rule,value,callback)  =>{
    //   if (this.ruleForm.happenTime !== '') {
    //     if (this.formDate(this.ruleForm.happenTime) > this.formDate(this.ruleForm.receiveTime)) {
    //       callback(new Error('接报时间要大于发生时间'));
    //     }
    //   }
    //   callback();
    // };
    return {
      periodNumber: 221,
      orgCode: 'gdszyj-7a863389-84a5-4354-a1e1-46f2ce5b47af', // 针对省厅写死的
      gutter:24,
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() < new Date(new Date().toLocaleDateString()).getTime()
          );
        }
      },
      value1: '',
      disasterLevels: [ // 事件等级
        {
          level: 1,
          name: '特别重大'
        },
        {
          level: 2,
          name: '重大'
        },
        {
          level: 3,
          name: '较大'
        },
        {
          level: 4,
          name: '一般'
        },
        {
          level: 5,
          name: '其他'
        }
      ],
      props: {
        value: "code",
        label: "name",
        checkStrictly: true,
      },
      ruleForm: { // 表单内数据
        id: 0,
        reportUnit: '广东省应急局', // 报送单位
        title: '', // 事件标题
        happenTime: '', // 发生时间
        sendTime: '', // 报送时间
        receiveTime: '', // 接报时间 接报时间要大于发生时间
        sendUserName: '', // 上报人
        phone: '', // 电话号码
        disasterType: [], // 灾害类型
        address: '', // 事发地点
        lon: '', // 经度
        lat: '', // 纬度
        disasterLevel: '', // 事发等级
        description: '', // 事件描述
        signUserName: '', // 签发人
        number: '', // 电话号码
        deathNum: 0, // 死亡人数
        missNum: 0, // 失踪人数
        injuredNum: 0, // 受伤人数
        periodNumber: 0, // 期数
        disasterId: '', // 省厅的事件id
        eventId: sessionStorage.getItem("newID"), // 事件id
        feedbackId: '' // 续报 id
      },
      rules: { // 表单验证规则
        reportUnit: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        happenTime: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        sendTime: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        receiveTime: [
          { required: true, message: "不能为空", trigger: "change" }
        ],
        phone: [
          { validator: number, trigger: 'blur' },
          { min: 11, max: 11,  message:'请输入11位数的电话号码!' },
        ],
      },
      mapId: "overId", //地图定位不同的ID
    }
  },
  created() {
    window.addEventListener("message", this.locationCallback);
    window.addEventListener("message", this.sendLocationMsg);
  },
  mounted() {
    if (this.type === 'edit') {
      this.initFormData()
      console.log('表单数据：', this.formData)
    }
  },
  methods: {
    inputChange(val) {
      console.log('描述：', val)
      console.log(val.indexOf('\n'))
      console.log(val.split('\n'))
      console.log(val.split())
      console.log(JSON.stringify(val.split()))
    },
    initFormData() {
      this.ruleForm.id = this.formData.iId // id
      this.ruleForm.orgCode = this.formData.vcOrgCode // 企业代码
      this.ruleForm.title = this.formData.vcTitle // 事件标题
      this.ruleForm.happenTime = this.formData.vcHappenTime // 发生时间
      this.ruleForm.sendTime = this.formData.vcSendTime // 报送时间
      this.ruleForm.receiveTime = this.formData.vcReceiveTime // 接报时间 接报时间要大于发生时间
      this.ruleForm.sendUserName = this.formData.vcSendUserName // 上报人
      this.ruleForm.phone = this.formData.vcPhone // 电话号码
      this.ruleForm.disasterType = this.formData.vcDisasterType // 灾害类型
      this.ruleForm.address = this.formData.vcAddress // 事发地点
      this.ruleForm.lon = this.formData.vcLon // 经度
      this.ruleForm.lat = this.formData.vcLat // 纬度
      this.ruleForm.disasterLevel = this.formData.vcDisasterLevel // 事发等级
      this.ruleForm.description = this.formData.vcDescription // 事件描述
      this.ruleForm.signUserName = this.formData.vcSignUserName // 签发人
      this.ruleForm.deathNum = this.formData.vcDeathNum // 死亡人数
      this.ruleForm.missNum = this.formData.vcMissNum // 失踪人数
      this.ruleForm.injuredNum = this.formData.vcInjuredNum // 受伤人数
      this.ruleForm.periodNumber = this.formData.vcPeriodNumber // 期数
      this.ruleForm.disasterId = this.formData.vcDisasterId // 省厅的事件id
      this.ruleForm.eventId = this.formData.IEventId // 事件id
      this.ruleForm.feedbackId = this.formData.vcFeedbackId // 续报id
      this.findCaseClassByCode(this.ruleForm.disasterType)
    },
    // 将 yyyy-MM-dd h:m:s 格式的时间转为时间戳
    // time -> YYYY-MM-DD hh:mm:ss 格式的字符串
    formDate (time) {
      const thisTime = time.replace(/ /g, '/')
      var nowTime = new Date(thisTime)
      nowTime = nowTime.getTime()
      return nowTime
    },
    // 查询省厅事件灾害类型
    selectProvinceCaseClass() {
      this.$api.selectProvinceCaseClass().then(res => {
        if (res.errorcode === 0) {
          this.eventTypeData = res.data
        }
      })
    },
    // 修改上报事件
    saveEdit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.govEventUpdate()
        }
      })
    },
    // 删除上报事件
    deleteReport() {
      this.$confirm('是否删除报送记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.govEventDelete();
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 取消新建报送
    cancelCreateReport() {
      this.$emit('cancel')
    },
    // 新建报送
    createReport() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.govReportEvent()
        }
      })
    },
    // 新增省厅-事件上报
    govReportEvent() {
      this.periodNumber++
      let data = {
        id: this.ruleForm.id,
        orgCode: this.orgCode, // 企业代码
        title: this.ruleForm.title, // 事件标题
        description: JSON.stringify(this.ruleForm.description.split()), // 事件描述
        disasterLevel: this.ruleForm.disasterLevel, // 事件等级
        lon: this.ruleForm.lon, // 经度
        lat: this.ruleForm.lat, // 纬度
        address: this.ruleForm.address, // 地址
        deathNum: this.ruleForm.deathNum, // 死亡人数
        missNum: this.ruleForm.missNum, // 失踪人数
        injuredNum: this.ruleForm.injuredNum, // 受伤人数
        sendUserName: this.ruleForm.sendUserName, // 上报人姓名
        signUserName: this.ruleForm.signUserName, // 签发人姓名
        phone: this.ruleForm.phone, // 电话号码
        disasterType: this.ruleForm.disasterType[this.ruleForm.disasterType.length - 1], // 灾害类型
        // periodNumber: this.ruleForm.periodNumber, // 期数
        periodNumber: this.periodNumber, // 期数
        happenTime: this.ruleForm.happenTime, // 发生时间
        sendTime: this.ruleForm.sendTime, // 报送时间
        receiveTime: this.ruleForm.receiveTime, // 接报时间
        // disasterId: this.ruleForm.disasterId , // 省厅的事件id 如果不为空，就是有事件
        eventId: this.ruleForm.eventId, // 事件id
        // feedbackId: this.ruleForm.feedbackId // 续报 id
      }
      this.$api.govReportEvent({paramJson: data}).then(res => {
        if (res.errorcode === 0) {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.$emit('create')
        }
      })
    },
    // 省厅事件删除接口
    govEventDelete() {
      console.log('表单数据：', this.ruleForm)
      if (this.ruleForm.disasterId !== '' || this.ruleForm.disasterId) {
        let data = {
          disasterId: this.ruleForm.disasterId  // 初报id 初报 id 和续报 id 不能 同时存在
        }
        this.$api.govEventDelete(data).then(res => {
        if (res.errorcode === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.$emit('update')
        }
      })
      }
      if (this.ruleForm.feedbackId !== '' || this.ruleForm.feedbackId) {
        let data = {
          feedbackId: this.ruleForm.feedbackId  // 续报id 初报 id 和续报 id 不能 同时存在
        }
        this.$api.govEventDelete(data).then(res => {
        if (res.errorcode === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.$emit('update')
        }
      })
      }
      // this.$api.govEventDelete(data).then(res => {
      //   if (res.errorcode === 0) {
      //     this.$message({
      //       type: 'success',
      //       message: '删除成功!'
      //     });
      //     this.$emit('update')
      //   }
      // })
    },
    // 突发事件初报续报修改接口
    govEventUpdate() {
      let data = {
        id: this.ruleForm.id,
        orgCode: this.orgCode, // 企业代码
        title: this.ruleForm.title, // 事件标题
        description: JSON.stringify(this.ruleForm.description.split()), // 事件描述
        disasterLevel: this.ruleForm.disasterLevel, // 事件等级
        lon: this.ruleForm.lon, // 经度
        lat: this.ruleForm.lat, // 纬度
        address: this.ruleForm.address, // 地址
        deathNum: this.ruleForm.deathNum, // 死亡人数
        missNum: this.ruleForm.missNum, // 失踪人数
        injuredNum: this.ruleForm.injuredNum, // 受伤人数
        sendUserName: this.ruleForm.sendUserName, // 上报人姓名
        signUserName: this.ruleForm.signUserName, // 签发人姓名
        phone: this.ruleForm.phone, // 电话号码
        disasterType: this.ruleForm.disasterType[this.ruleForm.disasterType.length - 1], // 灾害类型
        happenTime: this.ruleForm.happenTime, // 发生时间
        sendTime: this.ruleForm.sendTime, // 报送时间
        receiveTime: this.ruleForm.receiveTime, // 接报时间
        disasterId: this.ruleForm.disasterId , // 省厅的事件id 如果不为空，就是有事件
        eventId: this.ruleForm.eventId, // 事件id
        feedbackId: this.ruleForm.feedbackId // 续报 id
      }
      this.$api.govEventUpdate({paramJson: data}).then(res => {
        if (res.errorcode === 0) {
          this.$message({
            message:'保存成功',
            type: 'success'
          })
          this.$emit('update')
        }
      })
    },
    // 通过code查询省厅事件类型
    findCaseClassByCode(code) {
      let type = []
      // 循环获取code
      var getCode = function(data) {
        if(data.children && data.children.length > 0) {
          if (data.children.filter(item => item.code === code).length > 0) {
            type.push(data.code)
            type.push(code)
          } else {
            for(let j = 0; j < data.children.length; j++) {
              getCode(data.children[j])
            }
          }
        }
      }

      if (this.eventTypeData.filter(item => item.code === code).length > 0) {
        type.push(code)
      } else {
        for(let i = 0; i < this.eventTypeData.length; i++) {
          getCode(this.eventTypeData[i])
        }
      }
      console.log('灾害类型：', type)
      return type
    },
    incidenTypeChange() {
      console.log('灾害类型', this.ruleForm.disasterType)
    },
    //定位弹窗
    location() {
      this.$refs.loction.visible = false;
      this.$refs.loction.rushLocation = false;
      this.$nextTick(() => {
        this.$refs.loction.visible = true;
        this.$refs.loction.rushLocation = true;
      });
    },
    locationCallback(obj) {
      if (obj.data.action && obj.data.action == "retpoint") {
        let latlon = obj.data.object.point.split(",");
        this.ruleForm.lon = latlon[0]; // 经度
        console.log(latlon[0], latlon[1]);
        this.ruleForm.lat = latlon[1]; // 纬度
        this.ruleForm.address = obj.data.object.address;
        this.$refs.loction.visible = false;
      }
    },
    sendLocationMsg(obj) {
      if (obj.data.action && obj.data.action == "ready") {
        // console.log('经度', this.ruleForm.lon);
        // console.log('纬度', this.ruleForm.lat);
        if (this.ruleForm.lon && this.ruleForm.lat) {
          //var framew = window.mapFrame.contentWindow;
          var mapFarme = document.getElementById("overId");
          if (mapFarme) {
            var data = {};
            data.action = "getpoint";
            var object = {};
            object.center = this.ruleForm.lon + "," + this.ruleForm.lat;
            object.address = this.ruleForm.incidentSite;
            object.area = "";
            data.object = object;
            mapFarme.contentWindow.postMessage(JSON.stringify(data), "*");
          }
        }
      }
    },
  },
  beforeDestroy() {
      window.removeEventListener('message', this.locationCallback);
      window.addEventListener("message", this.sendLocationMsg);
  },
}
</script>
<style scoped>
.form-content {
  padding: 17px 28px 0 17px;
  position: relative;
}
.form-input-style {
  width:351px;
}
/deep/ .form-readonly-input-style .el-input__inner {
  background:rgba(248,250,252,1);
}
.el-col-12 {
  padding-right: 30px;
}
/deep/ .form-content .el-form-item__label {
  line-height: 40px;
}
/deep/ .underline-input .el-input__inner {
  border: none !important;
  border-bottom: 1px solid #DCDFE6 !important;
  border-radius: 0 !important;
  width: 120px;
  display: flex;
  justify-content: flex-start;
}
/deep/ .underline-input .el-input-number__increase,
/deep/ .underline-input .el-input-number__decrease {
  display: none;
}
.button-list {
  display: flex;
  justify-content: flex-end;
}
.submit-button {
  position: fixed;
  bottom: 90px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  width: 1000px;
  border-top: 1px solid rgba(233,236,241,1);
  padding-top: 20px;
  background: #ffffff;
}
/deep/ .form-content .el-textarea {
  width: 95%;
}
#itemCalss >>> .el-form-item__content {
  margin-left: 0 !important;
}
/deep/ .information .el-input input {
  background: rgb(249, 251, 255);
}
/deep/ .information .el-input__inner {
  padding: 0;
}
</style>