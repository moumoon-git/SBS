<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="500px"
  >
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @keyup.enter.native="dataFormSubmit()"
    >
      <el-form-item label="烟感名称" prop="smokeSensingName">
        <el-input v-model="dataForm.smokeSensingName" placeholder="请输入烟感名称" />
      </el-form-item>

      <!-- 通知人的id:从通讯录中选择一个人儿 -->
      <el-form-item
          label="编号"
          prop="number"
      >
          <el-input
          v-model="dataForm.number"
          placeholder="请输入设备编号"
          />
      </el-form-item>

      <!-- 可控程度:可控、基本可控、较难控制、基本失控 -->
      <el-form-item label="状态" prop="status">
          <el-select v-model="dataForm.status" placeholder="请选择" style="width:100%">
          <el-option
              v-for="item in statusData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
          </el-select>
      </el-form-item>

      <el-form-item label="地址">
          <el-input
          v-model="dataForm.address"
          placeholder="请定位地址"
          style="width: 86%"
          />
          <el-button
          style="width: 12%"
          type="text"
          icon="el-icon-location-outline"
          @click="location"
          >
          定位
          </el-button>
      </el-form-item>

      <el-form-item label="备注">
          <el-input
          type="textarea"
          v-model="dataForm.remark"
          placeholder="请输入内容"
          :rows="4"
          resize="none"
          />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button plain size="small" @click="visible = false">取消</el-button>
      <el-button type="primary" size="small" @click="dataFormSubmit()"
        >确定</el-button
      >
    </span>

    <!-- 地图弹窗 -->
    <LocationDialog ref="LocationDialogRef" />
  </el-dialog>
</template>

<script>
import LocationDialog from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/LocationDialog.vue';

export default {
  components: {
    LocationDialog,
  },
  data() {
    const checkName = (rule, value, callback) => {
      if (value) {
        this.$http({
          url: `${window.SITE_CONFIG.baseUrl}/risk/riskdanger/verifyName`,
          method: 'get',
          params: this.$http.adornParams({
            name: value,
            id: this.dataForm.id,
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            console.log(data);
            // true为不存在重复，false为存在重复
            if (!data.data) {
              callback(new Error('名称重复'));
            } else {
              callback();
            }
          }
        });
      }
    };
    const self = this;
    return {
      // 是否已经点击提交表单的标示
      flag: false,
      // 每页显示条目个数
      // 隐患类型:卡口管理、人员管理、预警默认类型、巡检事件类型、专题报告、专项整治行动。
      // 可控程度:可控、基本可控、较难控制、基本失控
      statusData: [
        { value: "1", label: '正常' },
        { value: "0", label: '异常' },
      ],
      // 高德地图结束
      visible: false,
      dataForm: {
        id: 0,
        smokeSensingName: '',
        number: '', // 联系人姓名
        status:"",
        longitude: '',
        latitude: '',
        address: '',
        remark:"",
        cgcsLatitude: '',
        cgcsLongitude: '',
      },
      dataRule: {
        smokeSensingName: [
          { required: true, message: '烟感名称不能为空', trigger: 'blur' },
        //   { validator: checkName, trigger: 'blur' },
        ],
        status: [
          {
            required: true,
            message: '状态不能为空',
            trigger: 'change',
          },
        ],
        number: [
          {
            required: true,
            message: '编号不能为空',
          },
        ],
      },
    };
  },
  methods: {
    location() {
      this.$refs.LocationDialogRef.open({
        longitude: this.dataForm.longitude,
        latitude: this.dataForm.latitude,
        address: this.dataForm.address,
        cgcsLongitude: this.dataForm.cgcsLongitude,
        cgcsLatitude: this.dataForm.cgcsLatitude
      }).then(({ longitude, latitude, address, cgcsLongitude, cgcsLatitude }) => {
        this.dataForm.longitude = longitude;
        this.dataForm.latitude = latitude;
        this.dataForm.address = address;
        this.dataForm.cgcsLatitude = cgcsLatitude;
        this.dataForm.cgcsLongitude = cgcsLongitude;
      });
    },
    init(id) {
      for (const key in this.dataForm) {
          this.dataForm[key] = ""
      }
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/hk/device/detail/${this.dataForm.id}`,
            ),
            method: 'get',
            params: this.$http.adornParams(),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              console.log('数据显示', data);
              this.dataForm.smokeSensingName = data.data.deviceName;
              this.dataForm.number = data.data.deviceId;
              this.dataForm.status = data.data.deviceStatus;
              this.dataForm.address = data.data.location;
              this.dataForm.remark = data.data.remark;
              this.dataForm.cgcsLatitude =  data.riskDanger.cgcsLatitude
              this.dataForm.cgcsLongitude =  data.riskDanger.cgcsLongitude
            }
          });
        } else {

        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      if (this.flag === false) {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.flag = true;
            this.$http({
              url: this.$http.adornUrl(
                `/hk/device/save`,
              ),
              method: 'post',
              'content-type': 'application/json',
              data: this.$http.adornData({
                id: this.dataForm.id || undefined,
                deviceName: this.dataForm.smokeSensingName,
                deviceId: this.dataForm.number,
                deviceStatus: this.dataForm.status,
                location: this.dataForm.address,
                remark: this.dataForm.remark,
                latitude: this.dataForm.latitude,
                longitude: this.dataForm.longitude,
                cgcsLongitude: this.dataForm.cgcsLongitude,
                cgcsLatitude: this.dataForm.cgcsLatitude,
              }),
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false;
                this.$emit('refreshDataList');
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                });
              } else {
                this.$message.error(data.msg);
              }
            }).finally(() => {
              this.flag = false;
            });
          }
        });
      }
    },
  },
};
</script>
