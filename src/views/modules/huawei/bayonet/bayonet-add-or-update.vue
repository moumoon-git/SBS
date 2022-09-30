<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="车牌号码" prop="carNum">
        <el-input v-model="dataForm.carNum" placeholder="请输入车牌号码"></el-input>
      </el-form-item>
      <el-form-item label="车辆类型" prop="carType">
        <el-input v-model="dataForm.carType" placeholder="请输入车辆类型"></el-input>
      </el-form-item>
      <el-form-item label="车主名" prop="owner">
        <el-input v-model="dataForm.owner" placeholder="请输入车主名"></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="dataForm.phone" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="管控类型" prop="controlTypeId">
        <!-- <el-input v-model="dataForm.controlTypeId" placeholder="请选择管控类型"></el-input> -->
        <el-select placeholder="请选择所属类型" v-model="dataForm.controlTypeId">
          <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="请输入备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      typeData: [],
      dataForm: {
        id: 0,
        carNum: "",
        carType: "",
        owner: "",
        phone: "",
        controlTypeId: "",
        remark: ""
      },
      dataRule: {
        carNum: [
          { required: true, message: "车牌号码不能为空", trigger: "blur" }
        ],
        carType: [
          { required: true, message: "车辆类型，写死不能为空", trigger: "blur" }
        ],
        owner: [{ required: true, message: "车主名不能为空", trigger: "blur" }],
        phone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        controlTypeId: [
          { required: true, message: "管控类型不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.handleEventType();
  },
  methods: {
    // 获取隐患类型
    handleEventType() {
      this.$http({
        url: this.$http.adornUrl(`/event/eventType/selectTypeList`),
        method: "get",
        params: this.$http.adornParams({ typeFlag: 4, isTree: "1" })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.typeData = data.list;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    init(id) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/risk/riskvehicleblacklist/info/${this.dataForm.id}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.carNum = data.riskVehicleBlacklist.carNum;
              this.dataForm.carType = data.riskVehicleBlacklist.carType;
              this.dataForm.owner = data.riskVehicleBlacklist.owner;
              this.dataForm.phone = data.riskVehicleBlacklist.phone;
              this.dataForm.controlTypeId =
                data.riskVehicleBlacklist.controlTypeId;
              this.dataForm.remark = data.riskVehicleBlacklist.remark;
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/risk/riskvehicleblacklist/${
                !this.dataForm.id ? "save" : "update"
              }`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              carNum: this.dataForm.carNum,
              carType: this.dataForm.carType,
              owner: this.dataForm.owner,
              phone: this.dataForm.phone,
              controlTypeId: this.dataForm.controlTypeId,
              controlLevelId: this.dataForm.controlLevelId,
              remark: this.dataForm.remark
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>
