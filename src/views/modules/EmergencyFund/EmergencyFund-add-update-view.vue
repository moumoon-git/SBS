<template>
  <div class="emergencyFundFormDialog">
    <sv-dialog
      ref="dialog"
      :title="title"
      @cancel="cancleDialog"
      @confirm="save"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="emergencyFundForm"
      >
        <el-form-item
          label="名称："
          prop="name"
        >
          <template v-if="type === 'detail'">
            {{ ruleForm.name }}
          </template>
          <el-input
            v-else
            v-model="ruleForm.name"
            clearable
            :maxlength="maxlength.VcName"
            show-word-limit
            class="sbs-input"
          />
        </el-form-item>
        <el-form-item label="分组：" prop="groupId">
          <template v-if="type === 'detail'">
            {{ ruleForm.groupName }}
          </template>
          <sv-select-group
            v-else
            v-model="ruleForm.groupId"
            api="/resoure/resourcefundgroup/list"
            :name="ruleForm.groupName"
          />
        </el-form-item>
        <el-form-item
          label="金额（万）："
          prop="amount"
        >
          <template v-if="type === 'detail'">
            {{ ruleForm.amount }}
          </template>
          <el-input-number
            v-else
            v-model.number="ruleForm.amount"
            :min="0"
            :max="1000000000"
            controls-position="right"
            size="small"
            class="sbs-input"
          />
        </el-form-item>
        <el-form-item
          label="主管单位："
          prop="supervisalDept"
        >
          <template v-if="type === 'detail'">
            {{ ruleForm.supervisalDept }}
          </template>
          <el-input
            v-else
            v-model="ruleForm.supervisalDept"
            clearable
            :maxlength="maxlength.VcSupervisalDept"
            show-word-limit
            class="sbs-input"
          />
        </el-form-item>
        <el-form-item label="资金来源：">
          <template v-if="type === 'detail'">
            {{ ruleForm.sourceName }}
          </template>
          <el-select
            v-else
            v-model="ruleForm.sourceId"
            placeholder="请选择"
            clearable
            class="sbs-select"
          >
            <el-option
              v-for="item in getByParentCode"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用途：" prop="usage">
          <template v-if="type === 'detail'">
            {{ ruleForm.usage }}
          </template>
          <el-input
            v-else
            v-model="ruleForm.usage"
            :maxlength="maxlength.VcUsage"
            clearable
            show-word-limit
            class="sbs-input"
          />
        </el-form-item>
        <el-form-item label="备注：" prop="notes">
          <template v-if="type === 'detail'">
            {{ ruleForm.notes }}
          </template>
          <el-input
            v-else
            v-model="ruleForm.notes"
            type="textarea"
            :rows="3"
            :maxlength="maxlength.VcNotes"
            show-word-limit
            class="sbs-input"
          />
        </el-form-item>
        <el-form-item label="联系人:">
          <div class="aoe__left__item__content">
            <sv-select-contact
              v-model="contactor"
              title="联系人"
              :api="['/mail/mailgroup/list','/mail/mailcontactor/list']"
              :multiple="true"
              :display-only="type === 'detail' ? true : false"
              @click="addContactHandle('contactorlist')"
              @delete="delIt(item.id, 'contactorlist')"
            />
          </div>
        </el-form-item>
        <el-form-item label="负责人:">
          <div class="aoe__left__item__content">
            <sv-select-contact
              v-model="principal"
              title="负责人"
              :api="['/mail/mailgroup/list','/mail/mailcontactor/list']"
              :multiple="true"
              :display-only="type === 'detail' ? true : false"
              @click="addContactHandle('principalList')"
              @delete="delIt(item.id, 'principalList')"
            />
          </div>
        </el-form-item>
      </el-form>
    </sv-dialog>
    <AddContact ref="AddContactView" />
  </div>
</template>
<script>
import AddContact from "@/views/modules/contingencyManage/shelterManage/addContact/AddContact.vue";
import axios from 'axios';
import { getRelations } from '@/assets/js/yz_common.js';

export default {
  name: 'EmergencyFundAddOrUpdate',
  components: {
    AddContact,
  },
  data() {
    const validateName = (rule, value, callback) => {
      this.getByName(value).then((res) => {
        if (res.length > 0) {
          callback(new Error('当前已有该应急资金，请勿重复'));
        } else {
          callback();
        }
      });
    };
    return {
      // 当前登录用户的token
      token: this.$cookie.get('token'),
      title: '', // 标题
      dialogTitle: '',
      dynamicTag: [],
      contactorType: 'contactor',
      getByParentCode: [
        {
          value: 1,
          label: '国家预算内资金',
          code: 'COUNTRY_BUDGETARY_FUND',
        },
        {
          value: 2,
          label: '国内贷款',
          code: 'DOMESTIC_LOAN',
        },
        {
          value: 3,
          label: '利用外资',
          code: 'FOREIGN_INVESTMENT',
        },
        {
          value: 4,
          label: '自筹资金',
          code: 'SELF_RAISED_FUND',
        },
        {
          value: 5,
          label: '捐赠资金',
          code: 'DONATED_FUND',
        },
        {
          value: 9,
          label: '其他资金来源',
          code: 'OTHER_FUND',
        },
      ], // 资金来源数组
      Modal: false, // 模态框
      disabled: false,
      isDisabled: true,
      type: '', // 判断是新增还是修改
      contactor: [], // 联系人数组
      principal: [], // 负责人数组
      ruleForm: {
        name: '', // 名称
        sourceId: '', // 资金来源id
        sourceName: '', // 资金来源name
        amount: '', // 金额
        supervisalDept: '', // 主管单位
        usage: '', // 用途
        notes: '', // 备注
        groupId: '', // 分组id
      },
      rules: {
        // 正则
        name: [
          {
            required: true,
            validator: this.$regular.currencyRules,
            trigger: 'blur',
          },
          {
            required: true,
            validator: validateName,
            trigger: 'blur',
          },
        ],
        groupId: [
          {
            required: true,
            message: '分组不能为空',
            trigger: 'blur',
          },
        ],
      },
      maxlength: {
        VcName: 50,
        VcSupervisalDept: 70,
        VcUsage: 20,
        VcNotes: 200,
      },
      groupOptions: [], // 分组选项
    };
  },
  methods: {
    /**
     * @description 判断名字是否重名
     */
    getByName(name) {
      return new Promise((resolve, reject) => {
        this.$http({
          method: 'get',
          baseURL: window.SITE_CONFIG.baseUrl,
          url: '/resoure/resourcefund/getByName',
          params: {
            name,
          },
        }).then((res) => {
          if (res.data.code === 0) {
            if (res.data.data.length === 1 && res.data.data[0].id === this.ruleForm.id) {
              resolve([]);
            } else {
              resolve(res.data.data);
            }
          }
        });
      });
    },
    /**
     * @description 添加联系人
     */
    addContactHandle(type) {
      if (type === 'contactorlist') {
        this.$refs.AddContactView.getDataList(this.contactor);
      } else {
        this.$refs.AddContactView.getDataList(this.principal);
      }
    },

    /**
     * @description 删除联系人
     */
    delIt(id, type) {
      if (type === 'contactorlist') {
        this.contactor = this.contactor.filter(
          (v) => v.id !== id,
        );
      } else {
        this.principal = this.principal.filter(
          (v) => v.id !== id,
        );
      }
    },

    /**
     * @description 数据初始化
     * @param type add | edit
     * @param row type为add row为空 | type为edit row为表格行数据
     */
    initData(type, data) {
      this.$refs.dialog.visible = true;
      this.type = type;
      if (type === 'add') {
        this.title = '新增应急资金';
        this.contactor = [];
        this.principal = [];
        this.$nextTick(() => {
          for (let i in this.ruleForm) {
            if (i !== 'groupId') {
              this.ruleForm[i] = '';
            }
          }
        });
      } else if (type === 'update') {
        this.contactor = [];
        this.principal = [];
        this.title = '编辑应急资金';
        this.getResourcefund(data.id);
      } else {
        this.contactor = [];
        this.principal = [];
        this.title = '查看应急资金';
        this.getResourcefund(data.id);
      }
    },

    /**
     * @description 获取应急资金详情
     */
    getResourcefund(id) {
      const request = {
        method: 'post',
        url: `/resoure/resourcefund/info/${id}`,
        baseURL: window.SITE_CONFIG.baseUrl,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          token: this.token,
        },
      };
      axios(request).then((response) => {
        if (response.data.code === 0) {
          const { resourceFund } = response.data.data;
          this.contactor = resourceFund.contactsList;
          this.principal = resourceFund.responsiblesList;
          this.ruleForm.id = resourceFund.id;
          this.ruleForm.name = resourceFund.name;
          this.ruleForm.amount = resourceFund.amount;
          this.ruleForm.supervisalDept = resourceFund.supervisalDept;
          this.ruleForm.usage = resourceFund.usage;
          this.ruleForm.notes = resourceFund.notes;
          this.ruleForm.sourceId = resourceFund.sourceId;
          this.ruleForm.sourceName = resourceFund.sourceId;
          this.ruleForm.groupId = resourceFund.groupId;
        }
      });
    },

    /**
     * @description 显示分组名字
     */
    getGroupName(groupId) {
      const names = getRelations({
        arr: this.groupOptions,
        relationKey: 'name',
        findKey: 'id',
        findValue: Number(groupId),
      });
      this.ruleForm.groupName = names[names.length - 1];
    },

    /**
     * @description 保存表单
     */
    save() {
      if (this.type === 'detail') {
        this.$refs.dialog.visible = false;
        return false;
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 联系人
          const contactorIds = this.contactor ? this.contactor.map((item) => item.id) : [];
          // 负责人
          const responsibleIds = this.principal ? this.principal.map((item) => item.id) : [];
          const params = this.type === 'update' ? {
            id: this.ruleForm.id,
            sourceId: this.ruleForm.sourceId,
            contacts: contactorIds,
            responsibles: responsibleIds,
            ...this.ruleForm,
          } : {
            sourceId: this.ruleForm.sourceId,
            contacts: contactorIds,
            responsibles: responsibleIds,
            ...this.ruleForm,
          };
          this.$http({
            method: 'post',
            baseURL: window.SITE_CONFIG.baseUrl,
            url: `/resoure/resourcefund/${this.type === 'update' ? 'update' : 'save'}`,
            data: params,
          }).then((res) => {
            if (res.data.code === 0) {
              this.$refs.dialog.visible = false;
              this.$emit('refresh');
              this.$message({
                message: this.type === 'update' ? '修改成功' : '新增成功',
                type: 'success',
              });
            }
          });
        } else {
          return false;
        }
      });
    },

    /**
     * @description 关闭弹窗
     */
    cancleDialog() {
      // 关闭弹窗并清除规则
      this.$refs.ruleForm.resetFields();
      this.$refs.dialog.visible = false;
    },
  },
};
</script>

<style lang="scss">
.emergencyFundFormDialog {

  .emergencyFundForm {
    width: 800px;
    box-sizing: border-box;
    padding: 20px 20px 0px 10px;

    .sbs-input {
      width: 100%;
    }

    .sbs-select {
      width: 100%;
    }
  }
}
</style>
