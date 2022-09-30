<!--运输企业-->
<template>
  <div class="TransportationFormDialog">
    <sv-dialog
      ref="dialog"
      :title="title"
      @cancel="cancleDialog"
      @confirm="save"
    >
      <div
        class="aoe"
        :class="{ 'aoe-fullscreen': isFullscreen }"
      >
        <!-- 左边 -->
        <div class="aoe__left">
          <el-form
            ref="ruleForm"
            label-width="130px"
            :model="ruleForm"
            :rules="rules"
            class="TransportationForm"
            @submit.native.prevent
          >
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item
                  label="名称:"
                  prop="name"
                >
                  <template v-if="type === 'detail'">
                    {{ ruleForm.name }}
                  </template>
                  <el-input
                    v-else
                    v-model="ruleForm.name"
                    :maxlength="maxlength.Vcname"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="分组：" prop="groupId">
              <template v-if="type === 'detail'">
                {{ ruleForm.groupName }}
              </template>
              <sv-select-group
                v-else
                v-model="ruleForm.groupId"
                api="/resoure/resourcetransportgroup/list"
                :name="ruleForm.groupName"
              />
            </el-form-item>
            <el-row :gutter="20">
              <el-col
                :span="24"
              >
                <el-form-item
                  label="类别:"
                  prop="type"
                >
                  <template v-if="type === 'detail'">
                    {{ ruleForm.typeName }}
                  </template>
                  <el-select
                    v-else
                    v-model="ruleForm.type"
                    placeholder="请选择"
                    clearable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in transportentype"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col
                :span="24"
              >
                <el-form-item
                  label="级别:"
                  prop="level"
                >
                  <template v-if="type === 'detail'">
                    {{ ruleForm.levelName }}
                  </template>
                  <el-select
                    v-else
                    v-model="ruleForm.level"
                    placeholder="请选择"
                    clearable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in administrativelevels"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col
                :span="24"
              >
                <el-form-item
                  label="地址:"
                  prop="address"
                >
                  <template v-if="type === 'detail'">
                    {{ ruleForm.address }}
                  </template>
                  <el-input
                    v-else
                    v-model="ruleForm.address"
                    clearable
                    :maxlength="maxlength.VcAddress"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col
                :span="24"
              >
                <el-form-item
                  label="经度:"
                  prop="longitude"
                >
                  <template v-if="type === 'detail'">
                    {{ ruleForm.longitude }}
                  </template>
                  <el-input
                    v-else
                    v-model="ruleForm.longitude"
                    type="number"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col
                :span="24"
              >
                <el-form-item
                  label="纬度:"
                  prop="latitude"
                >
                  <template v-if="type === 'detail'">
                    {{ ruleForm.latitude }}
                  </template>
                  <el-input
                    v-else
                    v-model="ruleForm.latitude"
                    type="number"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col
                :span="24"
              >
                <el-form-item
                  label="客运能力:"
                  prop="passCap"
                >
                  <template v-if="type === 'detail'">
                    {{ ruleForm.passCap }}
                  </template>
                  <el-input
                    v-else
                    v-model="ruleForm.passCap"
                    clearable
                    :maxlength="maxlength.VcPassCap"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="24"
              >
                <el-form-item
                  label="货运能力:"
                  prop="freCap"
                >
                  <template v-if="type === 'detail'">
                    {{ ruleForm.freCap }}
                  </template>
                  <el-input
                    v-else
                    v-model="ruleForm.freCap"
                    clearable
                    :maxlength="maxlength.VcFreCap"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="24"
              >
                <el-form-item
                  label="运输工具及数量:"
                  prop="transTools"
                >
                  <template v-if="type === 'detail'">
                    {{ ruleForm.transTools }}
                  </template>
                  <el-input
                    v-else
                    v-model="ruleForm.transTools"
                    clearable
                    :maxlength="maxlength.VcTransTools"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="24"
              >
                <el-form-item
                  label="基本情况:"
                  prop="firmDesc"
                >
                  <template v-if="type === 'detail'">
                    {{ ruleForm.firmDesc }}
                  </template>
                  <el-input
                    v-else
                    v-model="ruleForm.firmDesc"
                    clearable
                    :maxlength="maxlength.VcFirmDesc"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="24"
              >
                <el-form-item
                  label="应急能力描述:"
                  prop="emCapDesc"
                >
                  <template v-if="type === 'detail'">
                    {{ ruleForm.emCapDesc }}
                  </template>
                  <el-input
                    v-else
                    v-model="ruleForm.emCapDesc"
                    type="textarea"
                    :rows="2"
                    :maxlength="maxlength.VcEmCapDesc"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="24"
              >
                <el-form-item
                  label="备注:"
                  prop="notes"
                >
                  <template v-if="type === 'detail'">
                    {{ ruleForm.notes }}
                  </template>
                  <el-input
                    v-else
                    v-model="ruleForm.notes"
                    type="textarea"
                    :rows="2"
                    :maxlength="maxlength.VcNotes"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col
                :span="24"
              >
                <el-form-item label="联系人:">
                  <sv-select-contact
                    v-model="contactor"
                    title="联系人"
                    :api="['/mail/mailgroup/list','/mail/mailcontactor/list']"
                    :multiple="true"
                    :display-only="type === 'detail' ? true : false"
                    @click="addContactHandle('contactorlist')"
                    @delete="delIt(item.id, 'contactorlist')"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="24"
              >
                <el-form-item label="负责人:">
                  <sv-select-contact
                    v-model="responsibles"
                    title="负责人"
                    :api="['/mail/mailgroup/list','/mail/mailcontactor/list']"
                    :multiple="true"
                    :display-only="type === 'detail' ? true : false"
                    @click="addContactHandle('responsibleList')"
                    @delete="delIt(item.id, 'responsibleList')"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- 右边 -->

        <div class="aoe__right">
          <div class="aoe__right__title">地址</div>
          <div
            class="aoe__right__fullscreen"
            @click="isFullscreen = !isFullscreen"
          />
          <Location
            :address="ruleForm.address"
            :lng-lat="[ruleForm.longitude, ruleForm.latitude]"
            :display-only="type === 'detail' ? true : false"
            @confirm="handleLocationConfirm"
          />
        </div>
      </div>
    </sv-dialog>
    <AddContact ref="AddContactView" />
  </div>
</template>

<script>
import AddContact from "@/views/modules/contingencyManage/shelterManage/addContact/AddContact.vue";
import Location from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/Location.vue';
import axios from 'axios';
import { getRelations } from '@/assets/js/yz_common.js';

export default {
  name: 'TransportationAddOrUpdate',
  components: {
    AddContact,
    Location,
  },
  inject: ['reload'],
  data() {
    const validateName = (rule, value, callback) => {
      this.getByName(value).then((res) => {
        if (res.length > 0) {
          callback(new Error('当前已有该运输企业，请勿重复'));
        } else {
          callback();
        }
      });
    };
    return {
      isFullscreen: false, // 地图是否全屏
      // 当前登录用户的token
      token: this.$cookie.get('token'),
      title: '', // 标题
      type: '', // 判断是新增还是修改
      ID: '', // 当前数据ID
      transportentype: [
        {
          value: 1,
          label: '航运企业',
          code: 'SHIPPING_ENTERPRISE',
        },
        {
          value: 2,
          label: '铁路运输企业',
          code: 'RAILROAD_TRANSPORT_ENTERPRISE',
        },
        {
          value: 3,
          label: '汽车运输企业',
          code: 'AUTOMOBILE_TRANSPORTATION_ENTERPRISE',
        },
        {
          value: 4,
          label: '其他运输保障机构',
          code: 'OTHER_TRANSPORTATION_SUPPORT_INSTITUTION',
        },
        {
          value: 5,
          label: '航空企业',
          code: 'AVIATION_ENTERPRISE',
        },
      ], // 类型数组
      administrativelevels: [
        {
          value: 1,
          label: '国家级',
          code: 'COUNTRY',
        },
        {
          value: 2,
          label: '省级',
          code: 'PROVINCE',
        },
        {
          value: 3,
          label: '市级',
          code: 'CITY',
        },
        {
          value: 4,
          label: '县级',
          code: 'VILLAGE',
        },
        {
          value: 5,
          label: '乡镇级',
          code: 'COUNTRY',
        },
        {
          value: 6,
          label: '其他',
          code: 'OTHER',
        },
      ], // 等级数组
      ruleForm: {
        name: '', // 名称
        passCap: '', // 客运能力
        freCap: '', // 货运能力
        transTools: '', // 客运输工具及数量
        emCapDesc: '', // 应急能力描述
        address: '', // 地址
        longitude: '', // 经度
        latitude: '', // 纬度
        firmDesc: '', // 基本情况
        notes: '', // 备注common/getColumnLen
        type: '', // 类别ID
        level: '', // 等级ID
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
      contactor: [], // 联系人数组
      responsibles: [], // 负责人数组
      contactorType: 'contactor',
      // 表单字数
      maxlength: {
        Vcname: 50,
        VcPassCap: 200,
        VcFreCap: 200,
        VcTransTools: 200,
        VcFirmDesc: 600,
        VcAddress: 200,
        VcEmCapDesc: 2000,
        VcNotes: 200,
      },
      groupOptions: [], // 分组选项
    };
  },
  methods: {
    /**
     * @method
     * @desc 地图定位确定位置，获取地址和坐标
     */
    handleLocationConfirm(...arg) {
      this.isFullscreen = false;
      this.ruleForm.address = arg[0];
      this.ruleForm.longitude = arg[1][0];
      this.ruleForm.latitude = arg[1][1];
      // 强制更新，防止深对象v-model不更新
      this.$forceUpdate();
    },
    /**
     * @description 表单数据初始化
     */
    initData(type, formData) {
      this.$refs.dialog.visible = true;
      switch (type) {
        case 'add': // 新增
          this.type = 'add';
          this.title = '新增运输企业';
          this.contactor = [];
          this.responsibles = [];
          this.$nextTick(() => {
            for (let i in this.ruleForm) {
              if (i !== 'groupId') {
                this.ruleForm[i] = '';
              }
            }
          });
          break;
        default:
          if (type === 'detail') {
            this.type = 'detail';
            this.title = '查看运输企业';
          } else if (type === 'update') {
            this.title = '修改运输企业';
            this.type = 'update';
          }
          this.$nextTick(() => {
            this.ID = formData.id;
            this.getTransportation(formData.id);
          });
          break;
      }
    },
    /**
     * @description 获取运输企业详情
     */
    getTransportation(id) {
      const request = {
        method: 'post',
        url: `/resoure/resourcetransport/info/${id}`,
        baseURL: window.SITE_CONFIG.baseUrl,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          token: this.token,
        },
      };
      axios(request).then((response) => {
        console.log('获取运输企业详情', response);
        if (response.data.code === 0) {
          const { resourceTransport } = response.data.data;
          this.contactor = resourceTransport.contactsList;
          this.responsibles = resourceTransport.responsiblesList;
          this.ruleForm.name = resourceTransport.name;
          this.ruleForm.passCap = resourceTransport.passCap;
          this.ruleForm.freCap = resourceTransport.freCap;
          this.ruleForm.transTools = resourceTransport.transTools;
          this.ruleForm.emCapDesc = resourceTransport.emCapDesc;
          this.ruleForm.address = resourceTransport.address;
          this.ruleForm.longitude = resourceTransport.longitude;
          this.ruleForm.latitude = resourceTransport.latitude;
          this.ruleForm.firmDesc = resourceTransport.firmDesc;
          this.ruleForm.type = resourceTransport.type;
          this.ruleForm.typeName = resourceTransport.typeName;
          this.ruleForm.level = resourceTransport.level;
          this.ruleForm.levelName = resourceTransport.levelName;
          this.ruleForm.notes = resourceTransport.notes;
          this.ruleForm.groupId = resourceTransport.groupId;
          this.ruleForm.id = resourceTransport.id;
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
     * @description 判断名字是否重名
     */
    getByName(name) {
      return new Promise((resolve, reject) => {
        this.$http({
          method: 'get',
          baseURL: window.SITE_CONFIG.baseUrl,
          url: '/resoure/resourcetransport/getByName',
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
     * @description 保存
     */
    save() {
      if (this.type === 'detail') {
        this.$refs.dialog.visible = false;
        return;
      }
      this.getByName(this.ruleForm.name);
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 联系人
          const contactorIds = this.contactor ? this.contactor.map((item) => item.id) : [];
          // 负责人
          const responsibleIds = this.responsibles ? this.responsibles.map((item) => item.id) : [];
          if (this.type === 'update' || this.type === 'add') {
            let params = this.type === 'update' ? {
              id: this.ID,
              contacts: contactorIds,
              responsibles: responsibleIds,
              ...this.ruleForm,
            } : {
              contacts: contactorIds,
              responsibles: responsibleIds,
              ...this.ruleForm,
            };
            this.$http({
              method: 'post',
              baseURL: window.SITE_CONFIG.baseUrl,
              url: `/resoure/resourcetransport/${this.type === 'update' ? 'update' : 'save'}`,
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
        }
      });
    },

    /**
     * @description 关闭模态框并清除规则
     */
    cancleDialog() {
      this.$refs.dialog.visible = false;
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>

<style lang="scss">
.TransportationFormDialog {
  .sv-dialog {
    .aoe__left {
      max-height: 800px;
      overflow-y: auto;
      overflow-x: hidden;

      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: #d5d5d5;
        border-radius: 5px;
      }
      &::-webkit-scrollbar-corner {
        background: transparent;
      }

      .TransportationForm {
        width: 100%;
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
  }
}
</style>
<style lang="scss" src="@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/AddOrEditDialog/AddOrEditDialog.scss">
