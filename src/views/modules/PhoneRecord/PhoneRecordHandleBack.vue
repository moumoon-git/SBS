<!--
 * @Author: linhuiting
 * @Date: 2021-01-20 17:06:32
 * @LastEditTime: 2021-01-28 11:14:16
 * @LastEditors: Please set LastEditors
 * @Description: 事件回访
 * @FilePath: /SBS/src/views/modules/PhoneRecord/PhoneRecordHandleBack.vue
-->
<template>
  <div>
    <el-form
      ref="dataForm"
      :model="dataForm"
      :class="PhoneRecordHandleBack.form"
      label-width="80px"
      label-position="left"
      label-suffix=":"
    >
      <el-form-item
        label="回访时间"
        prop="time"
        :class="PhoneRecordHandleBack.item"
      >
        <el-date-picker
          v-model="dataForm.time"
          clearable
          type="datetime"
          placeholder="请选择回访时间"
          :disabled="editAble"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item
        label="回访人"
        prop="person"
        :class="PhoneRecordHandleBack.item"
      >
        <el-input
          v-model="dataForm.person"
          placeholder="请输入回访人"
          clearable
          :disabled="editAble"
          style="width: 220px;"
        />
      </el-form-item>
      <el-form-item
        label="回访结果"
        prop="result"
        :class="PhoneRecordHandleBack.item"
      >
        <el-radio-group
          v-model="dataForm.result"
          :disabled="editAble"
          clearable
        >
          <el-radio
            v-for="(item, index) in resultList"
            :key="index"
            clearable
            :label="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="回访说明"
        prop="desc"
      >
        <el-input
          v-model="dataForm.desc"
          type="textarea"
          :rows="3"
          placeholder="请输入回访说明"
          clearable
          :disabled="editAble"
        />
      </el-form-item>

      <div
        v-if="!editAble"
        :class="PhoneRecordHandleBack.button"
      >
        <el-button
          plain
          size="small"
          @click="$router.back(-1)"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="dataFormSubmit()"
        >
          确定
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 电话记录id
      id: this.$route.query.id,
      // 查看数据时disabled为true
      editAble: this.$route.query.status === 'watch',
      // 回访结果数据列表
      resultList: [],
      // 判断是更新还是保存
      updateOrSave: '',
      // 表单数据
      dataForm: {
        time: '',
        person: '',
        result: 1,
        desc: '',
      },
    };
  },

  mounted() {
    this.getResultList();
    this.init();
  },

  methods: {
    // 获取回访结果列表
    getResultList() {
      this.$http({
        url: this.$http.adornUrl(
          '/sys/sysdictionary/getSysDictionaryListByCode?code=return_visit_result_id',
        ),
        method: 'get',
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.data.forEach((item) => {
            this.resultList.push({
              value: Number(item.code),
              label: item.name,
            });
          });
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 获取表格数据
    init() {
      this.$http({
        url: this.$http.adornUrl(
          `/ottffemergency/ottffemergencyinforeturn/info/${this.id}`,
        ),
        method: 'get',
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // 一开始没回访信息填后调用save接口，有则调update
          if (data.ottffEmergencyInfoReturnEntity === null) {
            window.console.log('暂无数据');
            this.updateOrSave = 'save';
          } else {
            this.dataForm.time = data.ottffEmergencyInfoReturnEntity.returnDate;
            this.dataForm.person = data.ottffEmergencyInfoReturnEntity.returnVisitor;
            this.dataForm.result = data.ottffEmergencyInfoReturnEntity.returnVisitResult;
            this.dataForm.desc = data.ottffEmergencyInfoReturnEntity.remark;

            this.updateOrSave = 'update';
          }
        } else {
          this.$message.error(data.msg);
        }
      });
    },

    // 数据提交
    dataFormSubmit() {
      this.$http({
        url: this.$http.adornUrl(
          `/ottffemergency/ottffemergencyinforeturn/${
            this.updateOrSave === 'save' ? 'save' : 'update'
          }`,
        ),
        method: 'post',
        data: this.$http.adornData({
          emergencyInfoId: this.id,
          returnDate: this.dataForm.time,
          returnVisitor: this.dataForm.person,
          returnVisitResult: this.dataForm.result,
          remark: this.dataForm.desc,
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.init();
            },
          });
          this.$router.back(-1);
        } else {
          this.$message.error(data.msg);
        }
      });
    },
  },
};
</script>

<style lang="scss" module="PhoneRecordHandleBack">
.form {
  width: 600px;
  margin-left: 100px;
  .item {
    margin-bottom: 10px !important;
  }
  .button {
    text-align: center;
    margin: 30px auto 20px auto;
  }
}
</style>
