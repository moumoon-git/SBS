<template>
  <div>
    <el-dialog
      title="值班人员挂起配置"
      width="700px"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      class="dialog-style"
    >
      <div
        class="add-rule"
        @click="addRule"
      >
        <el-button
          type="mini"
          icon="el-icon-plus"
        />
        <span>添加挂起规则</span>
      </div>
      <div
        v-if="ruleListShow"
        class="rules-group"
      >
        <scheduling-rule
          v-for="(item, index) in ruleList"
          :key="getRandom(item.id)"
          :form-data="item"
          :length="ruleList.length"
          :index="index"
          :class-list="classList"
          :active-class="activeClass"
          :class-contactor-ids="firstContactorIds"
          :class-mans-list="mansList"
          @deleteRule="deleteRule"
          @getData="getData"
          @update="updateRule"
        />
      </div>
      <div class="operation-group">
        <el-button
          type="info"
          size="small"
          @click="handleClose"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="saveAllRules"
        >
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import SchedulingRule from './schedulingRule';

export default {
  name: 'SchedulingSuspended',
  components: {
    SchedulingRule,
  },
  props: ['classList', 'activeClass'],
  data() {
    return {
      dialogVisible: true,
      dataList: [],
      rule: {
        id: 0,
      },
      ruleList: [],
      classId: 0, // 班次id
      ruleListShow: false,
      firstContactorIds: [],
      mansList: [], // 人员列表
    };
  },
  mounted() {
    this.getRuleData();
    // this.getClassId()
  },
  methods: {
    /**
     * @description 获取随机数
     */
    getRandom(id) {
      return `${id}${String(Math.random() * 100)}`;
    },
    /**
     * @description 获取该班次下的所有挂起规则
     */
    getRuleByClassId() {
      const data = {
        classId: this.classId.toString(),
      };
      this.$api.getRuleByClassId(data).then((res) => {
        if (res.errorcode === 0) {
          if (res.data.length > 0) {
            this.ruleList = res.data;
          } else {
            this.ruleList = [];
            this.addRule();
          }
          this.ruleListShow = true;
        }
      });
    },
    /**
     * @description 获取规则
     */
    async getRuleData() {
      await this.getClassId();
      await this.getAllContactorByClassId();
      await this.getRuleByClassId();
    },
    /**
     * @description 获取班次id
     */
    getClassId() {
      this.classId = Number(this.activeClass);
    },
    /**
     * @description 根据班次id查询值班人员
     */
    getAllContactorByClassId() {
      const data = {
        classId: this.classId,
      };
      let contactorIds = [];
      this.$api.getAllContactorByClassId(data).then((res) => {
        if (res.errorcode === 0) {
          this.mansList = res.data;
          this.mansList.forEach((item) => {
            contactorIds.push(item.contactorId);
          });
          this.firstContactorIds = contactorIds;
          // this.getRule(classId, contactorIds)
        }
      });
    },
    /**
     * @description 值班人员---获取挂起规则
     */
    getRule(classId, contactorId, index) {
      const data = {
        classId: classId.toString(),
        contactorId: contactorId[index].toString(),
      };
      this.$api.getRule(data).then((res) => {
        this.ruleList[index] = res.data;
        this.ruleListShow = true;
      });
    },
    /**
     * @description 添加规则按钮->更新规则列表
     */
    getData(params) {
      this.ruleList[params.index] = params.data;
      console.log('规则', params, this.ruleList);
    },

    handleClose() {
      this.$emit('close');
    },

    /**
     * @description 值班人员---添加全部挂起规则
     */
    addAllRule() {
      const data = {
        data: this.ruleList,
      };
      console.log('----规则：', this.ruleList);
      this.$api.addAllRule(data).then((res) => {
        if (res.errorcode === 0) {
          this.getRuleData();
          this.$emit('updateRules');
        }
      });
    },
    /**
     * @description 保存全部规则
     */
    saveAllRules() {
      this.addAllRule();
    },
    /**
     * @description 添加挂起规则
     */
    addRule() {
      const rule = {
        index: this.ruleList.length,
        classId: this.classId,
        contactorIds: [],
        startDate: null,
        endDate: null,
        day: '',
        startTime: null,
        endTime: null,
      };
      this.ruleList.push(rule);
    },
    /**
     * @description 更新规则
     */
    updateRule(params) {
      this.getRuleData();
      this.$emit('updateRules');
      // this.ruleList[params.index] = params.data
      // this.getRule(params.data.classId, params.data.contactorIds, params.index)
    },
    /**
     * @description 删除挂起规则
     */
    deleteRule(formData) {
      console.log(formData.index, '要删除的规则：', formData);
      const data = {
        classId: formData.classId,
        contactorIds: formData.contactorIds,
      };
      if (data.contactorIds.length > 0) {
        this.$api.deleteRule(data).then((res) => {
          if (res.errorcode === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.getRuleByClassId();
            this.$emit('updateRules');
          }
        });
      } else {
        this.$message({
          type: 'success',
          message: '删除成功!',
        });
        this.ruleList.splice(formData.index, 1);
        this.$emit('updateRules');
      }
    },
  },
};
</script>
<style scoped>
/deep/ .el-tabs__header {
  margin: 0;
}
/deep/ .dialog-style .el-dialog__header {
  background: rgba(241, 244, 246, 1);
  text-align: left !important;
  padding: 10px 20px;
  border-radius: 5px 5px 0 0;
}
/deep/ .dialog-style .el-dialog__headerbtn {
  top: 15px !important;
}
/deep/ .el-dialog__body {
  padding-top: 10px !important;
}
.operation-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}
.add-rule {
  text-align: right;
  margin-bottom: 10px;
  margin-right: 22px;
  cursor: pointer;
}
/deep/ .add-rule .el-button {
  width: 18px;
  height: 18px;
  background: rgba(0, 145, 255, 1);
  border-radius: 3px;
  color: #ffffff;
  padding: 0;
  border: 1px solid rgba(0, 145, 255, 1);
}
.rules-group {
  height: 430px;
  overflow: scroll;
}
</style>
