<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @keyup.enter.native="dataFormSubmit()"
    >
      <el-form-item
        label="物资类型id"
        prop="articleTypeId"
      >
        <el-input
          v-model="dataForm.articleTypeId"
          placeholder="物资类型id"
        />
      </el-form-item>
      <el-form-item
        label="物资型号"
        prop="model"
      >
        <el-input
          v-model="dataForm.model"
          placeholder="物资型号"
        />
      </el-form-item>
      <el-form-item
        label="物资所属库id"
        prop="articleStorehouseId"
      >
        <el-input
          v-model="dataForm.articleStorehouseId"
          placeholder="物资所属库id"
        />
      </el-form-item>
      <el-form-item
        label="数量"
        prop="amount"
      >
        <el-input
          v-model="dataForm.amount"
          placeholder="数量"
        />
      </el-form-item>
      <el-form-item
        label="计量单位"
        prop="measureUnit"
      >
        <el-input
          v-model="dataForm.measureUnit"
          placeholder="计量单位"
        />
      </el-form-item>
      <el-form-item
        label="生产厂家"
        prop="factory"
      >
        <el-input
          v-model="dataForm.factory"
          placeholder="生产厂家"
        />
      </el-form-item>
      <el-form-item
        label="保质期"
        prop="expireTime"
      >
        <el-input
          v-model="dataForm.expireTime"
          placeholder="保质期"
        />
      </el-form-item>
      <el-form-item
        label="需要更换的时间"
        prop="replaceTime"
      >
        <el-input
          v-model="dataForm.replaceTime"
          placeholder="需要更换的时间"
        />
      </el-form-item>
      <el-form-item
        label="现状态 :   0:可正常使用 1:不可正常使用"
        prop="nowStatus"
      >
        <el-input
          v-model="dataForm.nowStatus"
          placeholder="现状态 :   0:可正常使用 1:不可正常使用"
        />
      </el-form-item>
      <el-form-item
        label="维修保养状态 :   0:好  1:良好   2:差"
        prop="maintainStatus"
      >
        <el-input
          v-model="dataForm.maintainStatus"
          placeholder="维修保养状态 :   0:好  1:良好   2:差"
        />
      </el-form-item>
      <el-form-item
        label="级别:  0: 国家级  1:省级  2: 市级  3: 县级 4:乡镇级 5:其他"
        prop="level"
      >
        <el-input
          v-model="dataForm.level"
          placeholder="级别:  0: 国家级  1:省级  2: 市级  3: 县级 4:乡镇级 5:其他"
        />
      </el-form-item>
      <el-form-item
        label="保密级别: 0:机密 1:秘密 2:限制 3:公开 4:其他"
        prop="secret"
      >
        <el-input
          v-model="dataForm.secret"
          placeholder="保密级别: 0:机密 1:秘密 2:限制 3:公开 4:其他"
        />
      </el-form-item>
      <el-form-item
        label="调用方式"
        prop="transferMethod"
      >
        <el-input
          v-model="dataForm.transferMethod"
          placeholder="调用方式"
        />
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="dataForm.remark"
          placeholder="备注"
        />
      </el-form-item>
      <el-form-item
        label="删除 0：未删除  1：已删除"
        prop="isDeleted"
      >
        <el-input
          v-model="dataForm.isDeleted"
          placeholder="删除 0：未删除  1：已删除"
        />
      </el-form-item>
      <el-form-item
        label="创建者id"
        prop="createUserId"
      >
        <el-input
          v-model="dataForm.createUserId"
          placeholder="创建者id"
        />
      </el-form-item>
      <el-form-item
        label="创建时间"
        prop="gmtCreate"
      >
        <el-input
          v-model="dataForm.gmtCreate"
          placeholder="创建时间"
        />
      </el-form-item>
      <el-form-item
        label="修改者Id"
        prop="modifiedUserId"
      >
        <el-input
          v-model="dataForm.modifiedUserId"
          placeholder="修改者Id"
        />
      </el-form-item>
      <el-form-item
        label="修改时间"
        prop="gmtModified"
      >
        <el-input
          v-model="dataForm.gmtModified"
          placeholder="修改时间"
        />
      </el-form-item>
      <el-form-item
        label="终端用户id"
        prop="platformId"
      >
        <el-input
          v-model="dataForm.platformId"
          placeholder="终端用户id"
        />
      </el-form-item>
      <el-form-item
        label="是否易耗品  0:否   1:是"
        prop="consumables"
      >
        <el-input
          v-model="dataForm.consumables"
          placeholder="是否易耗品  0:否   1:是"
        />
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="visible = false">取消</el-button>
      <el-button
        type="primary"
        @click="dataFormSubmit()"
      >确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        articleTypeId: '',
        model: '',
        articleStorehouseId: '',
        amount: '',
        measureUnit: '',
        factory: '',
        expireTime: '',
        replaceTime: '',
        nowStatus: '',
        maintainStatus: '',
        level: '',
        secret: '',
        transferMethod: '',
        remark: '',
        isDeleted: '',
        createUserId: '',
        gmtCreate: '',
        modifiedUserId: '',
        gmtModified: '',
        platformId: '',
        consumables: '',
      },
      dataRule: {
        articleTypeId: [
          { required: true, message: '物资类型id不能为空', trigger: 'blur' },
        ],
        model: [
          { required: true, message: '物资型号不能为空', trigger: 'blur' },
        ],
        articleStorehouseId: [
          { required: true, message: '物资所属库id不能为空', trigger: 'blur' },
        ],
        amount: [
          { required: true, message: '数量不能为空', trigger: 'blur' },
        ],
        measureUnit: [
          { required: true, message: '计量单位不能为空', trigger: 'blur' },
        ],
        factory: [
          { required: true, message: '生产厂家不能为空', trigger: 'blur' },
        ],
        expireTime: [
          { required: true, message: '保质期不能为空', trigger: 'blur' },
        ],
        replaceTime: [
          { required: true, message: '需要更换的时间不能为空', trigger: 'blur' },
        ],
        nowStatus: [
          { required: true, message: '现状态 :   0:可正常使用 1:不可正常使用不能为空', trigger: 'blur' },
        ],
        maintainStatus: [
          { required: true, message: '维修保养状态 :   0:好  1:良好   2:差不能为空', trigger: 'blur' },
        ],
        level: [
          { required: true, message: '级别:  0: 国家级  1:省级  2: 市级  3: 县级 4:乡镇级 5:其他不能为空', trigger: 'blur' },
        ],
        secret: [
          { required: true, message: '保密级别: 0:机密 1:秘密 2:限制 3:公开 4:其他不能为空', trigger: 'blur' },
        ],
        transferMethod: [
          { required: true, message: '调用方式不能为空', trigger: 'blur' },
        ],
        remark: [
          { required: true, message: '备注不能为空', trigger: 'blur' },
        ],
        isDeleted: [
          { required: true, message: '删除 0：未删除  1：已删除不能为空', trigger: 'blur' },
        ],
        createUserId: [
          { required: true, message: '创建者id不能为空', trigger: 'blur' },
        ],
        gmtCreate: [
          { required: true, message: '创建时间不能为空', trigger: 'blur' },
        ],
        modifiedUserId: [
          { required: true, message: '修改者Id不能为空', trigger: 'blur' },
        ],
        gmtModified: [
          { required: true, message: '修改时间不能为空', trigger: 'blur' },
        ],
        platformId: [
          { required: true, message: '终端用户id不能为空', trigger: 'blur' },
        ],
        consumables: [
          { required: true, message: '是否易耗品  0:否   1:是不能为空', trigger: 'blur' },
        ],
      },
    };
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/resoure/resourearticle/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams(),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.articleTypeId = data.resourearticle.articleTypeId;
              this.dataForm.model = data.resourearticle.model;
              this.dataForm.articleStorehouseId = data.resourearticle.articleStorehouseId;
              this.dataForm.amount = data.resourearticle.amount;
              this.dataForm.measureUnit = data.resourearticle.measureUnit;
              this.dataForm.factory = data.resourearticle.factory;
              this.dataForm.expireTime = data.resourearticle.expireTime;
              this.dataForm.replaceTime = data.resourearticle.replaceTime;
              this.dataForm.nowStatus = data.resourearticle.nowStatus;
              this.dataForm.maintainStatus = data.resourearticle.maintainStatus;
              this.dataForm.level = data.resourearticle.level;
              this.dataForm.secret = data.resourearticle.secret;
              this.dataForm.transferMethod = data.resourearticle.transferMethod;
              this.dataForm.remark = data.resourearticle.remark;
              this.dataForm.isDeleted = data.resourearticle.isDeleted;
              this.dataForm.createUserId = data.resourearticle.createUserId;
              this.dataForm.gmtCreate = data.resourearticle.gmtCreate;
              this.dataForm.modifiedUserId = data.resourearticle.modifiedUserId;
              this.dataForm.gmtModified = data.resourearticle.gmtModified;
              this.dataForm.platformId = data.resourearticle.platformId;
              this.dataForm.consumables = data.resourearticle.consumables;
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/resoure/resourearticle/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              articleTypeId: this.dataForm.articleTypeId,
              model: this.dataForm.model,
              articleStorehouseId: this.dataForm.articleStorehouseId,
              amount: this.dataForm.amount,
              measureUnit: this.dataForm.measureUnit,
              factory: this.dataForm.factory,
              expireTime: this.dataForm.expireTime,
              replaceTime: this.dataForm.replaceTime,
              nowStatus: this.dataForm.nowStatus,
              maintainStatus: this.dataForm.maintainStatus,
              level: this.dataForm.level,
              secret: this.dataForm.secret,
              transferMethod: this.dataForm.transferMethod,
              remark: this.dataForm.remark,
              isDeleted: this.dataForm.isDeleted,
              createUserId: this.dataForm.createUserId,
              gmtCreate: this.dataForm.gmtCreate,
              modifiedUserId: this.dataForm.modifiedUserId,
              gmtModified: this.dataForm.gmtModified,
              platformId: this.dataForm.platformId,
              consumables: this.dataForm.consumables,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit('refreshDataList');
                },
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
  },
};
</script>
