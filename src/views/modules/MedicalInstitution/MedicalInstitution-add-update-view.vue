<template>
  <div class="MedicalInstitutionFormDialog">
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
            label-width="100px"
            :model="ruleForm"
            :rules="rules"
            class="MedicalInstitutionForm"
            @submit.native.prevent
          >
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
                style="width: 100%"
                clearable
                :maxlength="maxlength.VcDeptName"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="分组：" prop="groupId">
              <template v-if="type === 'detail'">
                {{ ruleForm.groupName }}
              </template>
              <sv-select-group
                v-else
                v-model="ruleForm.groupId"
                api="/resoure/resourcehealthdeptgroup/list"
                :name="ruleForm.groupName"
              />
            </el-form-item>

            <el-form-item
              label="医疗机构类型"
              prop="classId"
            >
              <el-cascader
                ref="classId"
                v-model.trim="ruleForm.classId"
                :options="warehouseTypeData"
                :props="propsObj"
                clearable
                style="float: left; width: 100%"
                :show-all-levels="false"
                placeholder="请选择医疗机构类型"
              />
            </el-form-item>

            <el-form-item
              label="行政区划:"
              prop="townId"
            >
              <template v-if="type === 'detail'">
                {{ ruleForm.townName }}
              </template>
              <el-cascader
                v-else
                ref="townId"
                v-model="ruleForm.townId"
                style="width: 100%"
                :options="areaOptions"
                :props="propsArea"
                clearable
                :show-all-levels="false"
                placeholder="请选择行政区划"
              />
            </el-form-item>
            <el-form-item
              label="传真:"
              prop="fax"
            >
              <template v-if="type === 'detail'">
                {{ ruleForm.fax }}
              </template>
              <el-input
                v-else
                v-model="ruleForm.fax"
                style="width: 100%"
                clearable
              />
            </el-form-item>
            <el-form-item
              label="值班电话:"
              prop="dutyTel"
            >
              <template v-if="type === 'detail'">
                {{ ruleForm.dutyTel }}
              </template>
              <el-input
                v-else
                v-model="ruleForm.dutyTel"
                style="width: 100%"
                clearable
              />
            </el-form-item>
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
                disabled
              />
            </el-form-item>
            <el-form-item
              label="经纬度:"
              prop="longitude"
              class="lonlat"
            >
              <template v-if="type === 'detail'">
                <div>{{ '经度：' + ruleForm.longitude || '' }}</div>
                <div>{{ '纬度：' +ruleForm.latitude || '' }}</div>
              </template>
              <template v-else>
                <el-input
                  v-model="ruleForm.longitude"
                  disabled
                  type="number"
                  placeholder="经度"
                />
                <el-input
                  v-model="ruleForm.latitude"
                  disabled
                  type="number"
                  placeholder="纬度"
                />
              </template>
            </el-form-item>
            <el-form-item
              label="类别:"
              prop="type"
              style="text-align: left"
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
                  v-for="item in healthdepttype"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="等级:"
              prop="level"
              style="text-align: left"
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
            <el-form-item
              label="急救车辆数:"
              prop="ambulanceNum"
              style="text-align: left"
            >
              <template v-if="type === 'detail'">
                {{ ruleForm.ambulanceNum }}
              </template>
              <el-input-number
                v-else
                v-model.number="ruleForm.ambulanceNum"
                :min="0"
                :max="1000000000"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item
              label="全血库存:"
              prop="wholeBlood"
              style="text-align: left"
            >
              <template v-if="type === 'detail'">
                {{ ruleForm.wholeBlood }}
              </template>
              <el-input-number
                v-else
                v-model.number="ruleForm.wholeBlood"
                :min="0"
                :max="1000000000"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item
              label="血浆存库:"
              prop="bloodPlasma"
              style="text-align: left"
            >
              <template v-if="type === 'detail'">
                {{ ruleForm.bloodPlasma }}
              </template>
              <el-input-number
                v-else
                v-model.number="ruleForm.bloodPlasma"
                :min="0"
                :max="1000000000"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item
              label="病床数:"
              prop="bedNum"
              style="text-align: left"
            >
              <template v-if="type === 'detail'">
                {{ ruleForm.bedNum }}
              </template>
              <el-input-number
                v-else
                v-model.number="ruleForm.bedNum"
                :min="0"
                :max="1000000000"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item
              label="血小板库存:"
              prop="bloodPlatelet"
              style="text-align: left"
            >
              <template v-if="type === 'detail'">
                {{ ruleForm.bloodPlatelet }}
              </template>
              <el-input-number
                v-else
                v-model.number="ruleForm.bloodPlatelet"
                :min="0"
                :max="1000000000"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item
              label="医生数:"
              prop="doctorNum"
              style="text-align: left"
            >
              <template v-if="type === 'detail'">
                {{ ruleForm.doctorNum }}
              </template>
              <el-input-number
                v-else
                v-model.number="ruleForm.doctorNum"
                :min="0"
                :max="1000000000"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item
              label="护士数:"
              prop="nurseNum"
              style="text-align: left"
            >
              <template v-if="type === 'detail'">
                {{ ruleForm.nurseNum }}
              </template>
              <el-input-number
                v-else
                v-model.number="ruleForm.nurseNum"
                :min="0"
                :max="1000000000"
                controls-position="right"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item
              label="装备描述:"
              prop="equipDesc"
            >
              <template v-if="type === 'detail'">
                {{ ruleForm.equipDesc }}
              </template>
              <el-input
                v-else
                v-model="ruleForm.equipDesc"
                type="textarea"
                :rows="2"
                :maxlength="maxlength.VcEquipDesc"
                show-word-limit
              />
            </el-form-item>
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
            <el-form-item label="联系人:">
              <sv-select-contact
                v-model="contacts"
                title="联系人"
                :api="['/mail/mailgroup/list','/mail/mailcontactor/list']"
                :multiple="true"
                :display-only="type === 'detail' ? true : false"
                @click="addContactHandle('contactorlist')"
                @delete="delIt(item.id, 'contactorlist')"
              />
            </el-form-item>
            <el-form-item label="负责人:">
              <sv-select-contact
                v-model="responsibles"
                title="负责人"
                :api="['/mail/mailgroup/list','/mail/mailcontactor/list']"
                :multiple="true"
                :display-only="type === 'detail' ? true : false"
                @click="addContactHandle('principalList')"
                @delete="delIt(item.id, 'principalList')"
              />
            </el-form-item>
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
      <!-- 地图弹窗 -->
      <AddContact ref="AddContactView" />
    </sv-dialog>
  </div>
</template>

<script>
import AddContact from "@/views/modules/contingencyManage/shelterManage/addContact/AddContact.vue";
import axios from 'axios';
import Location from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/Location.vue';
import contactSortingPopupVue from '../../../view/integratedCommunication/contactSortingPopup.vue';
import { getRelations } from '@/assets/js/yz_common.js';

export default {
  name: 'MedicalInstitutionAddOrUpdate',
  components: {
    AddContact,
    Location,
  },
  inject: ['reload'],
  props: ['ZoningData'],
  data() {
    const validateName = (rule, value, callback) => {
      this.getByName(value).then((res) => {
        if (res.length > 0) {
          callback(new Error('当前已有该医疗机构，请勿重复'));
        } else {
          callback();
        }
      });
    };
    return {
      // 当前登录用户的token
      token: this.$cookie.get('token'),
      isFullscreen: false, // 地图是否全屏
      title: '', // 标题
      type: '', // 判断是新增还是修改
      warehouseTypeData: [], // 事件类型
      propsObj: {
        value: 'id',
        label: 'name',
        children: 'children',
        checkStrictly: true,
      },
      ruleForm: {
        classId: '',
        name: '', // 名称
        townId: '', // 行政区划
        fax: '', // 传真
        dutyTel: '', // 值班电话
        wholeBlood: '', // 全血库存
        bloodPlasma: '', // 血浆库存
        bedNum: '', // 病床数
        bloodPlatelet: '', // 血小板库存
        doctorNum: '', // 医生数
        nurseNum: '', // 护士数
        ambulanceNum: '', // 救护车辆数
        address: '', // 地址
        longitude: '', // 经度
        latitude: '', // 纬度
        equipDesc: '', // 装备
        notes: '', // 备注
        type: '', // 类别ID
        level: '', // 等级ID
        groupId: '', // 分组ID
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
        tel: [
          {
            // 值班电话
            validator: this.$regular.fixedTelephone,
            trigger: 'blur',
          },
        ],
        fax: [
          {
            // 传真
            validator: this.$regular.fixedTelephone,
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
        classId: [{ required: true, message: '请选择医疗机构类型', trigger: 'blur' }],
      },
      contactorType: 'contactor',
      contacts: [], // 联系人数组
      responsibles: [], // 负责人数组
      maxlength: {
        VcDeptName: 50,
        VcAddress: 200,
        VcEquipDesc: 2000,
        VcNotes: 200,
      },
      propsArea: {
        value: 'id',
        label: 'townName',
        children: 'children',
        checkStrictly: true,
        emitPath: false,
      },
      areaOptions: [], // 行政区划
      healthdepttype: [
        {
          value: 1,
          label: '医院',
          code: 'HOSPITAL',
        },
        {
          value: 2,
          label: '疗养院',
          code: 'SANATORIUM',
        },
        {
          value: 3,
          label: '医院',
          code: '社区卫生服务中心',
        },
        {
          value: 4,
          label: '卫生院',
          code: 'HEALTH_CENTER',
        },
        {
          value: 5,
          label: '门诊部',
          code: 'OUTPATIENT_DEPARTMENT',
        },
        {
          value: 6,
          label: '诊所、卫生所(室)、医务室',
          code: 'CLINIC',
        },
        {
          value: 7,
          label: '妇幼保健院(所、站)',
          code: 'MATERNAL_AND_CHILD_HEALTH_HOSPITAL',
        },
        {
          value: 8,
          label: '职专科业疾病防治院(所、站)',
          code: 'CONTROL_AND_PREVENTION_HOSPITAL',
        },
        {
          value: 9,
          label: '急救中心(站)',
          code: 'FIRST_AID_CENTRE',
        },
        {
          value: 10,
          label: '其他医疗机构',
          code: 'OTHER_MEDICAL_INSTITUTION',
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
      groupOptions: [], // 分组选项
    };
  },
  created() {
    this.getArea();
    this.medical();
  },
  methods: {
    // 医疗类别
    medical(){
      this.$http({
        url: this.$http.adornUrl('/resourceHealthDeptClass/treeList'),
        method: 'get',
        params: {
          apiVersion: '0.0.2',
        },
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.warehouseTypeData = data.data;
        } else {
          this.$message.error(data.msg);
        }
      }).catch((err) => {
        this.$message.error(err);
      });
      // , // 装备库
    },
    /**
     * @description 判断名字是否重名
     */
    getByName(name) {
      return new Promise((resolve, reject) => {
        this.$http({
          method: 'get',
          baseURL: window.SITE_CONFIG.baseUrl,
          url: '/resoure/resourcehealthdept/getByName',
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
     * @description 获取行政区划
     */
    getArea() {
      this.$http
        .get(`${window.SITE_CONFIG.baseUrl}/sys/systown/treeList`)
        .then((response) => {
          if (response.data.code === 0) {
            this.areaOptions = response.data.list;
          }
        });
    },

    /**
     * @description 数据初始化
     */
    initData(type, fromData) {
      this.$refs.dialog.visible = true;
      this.getArea(); // 获取行政区划，可能导入数据中会存在新增的行政区划
      switch (type) {
        case 'add': // 新增
          this.type = 'add';
          this.title = '新增医疗卫生机构';
          this.contacts = [];
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
            this.title = '查看医疗卫生机构';
          } else if (type === 'update') {
            this.title = '修改医疗卫生机构';
            this.type = 'update';
          }
          this.getMedicalInstitution(fromData.id);
          break;
      }
    },
    /**
     * @description 获取运输企业详情
     */
    getMedicalInstitution(id) {
      const request = {
        method: 'post',
        url: `/resoure/resourcehealthdept/info/${id}`,
        baseURL: window.SITE_CONFIG.baseUrl,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          token: this.token,
        },
      };
      axios(request).then((response) => {
        console.log('获取运输企业详情', response);
        if (response.data.code === 0) {
          const { resourceHealthDept } = response.data.data;
          this.contacts = resourceHealthDept.contactsList;
          this.responsibles = resourceHealthDept.responsiblesList;
          this.ruleForm.id = resourceHealthDept.id;
          this.ruleForm.name = resourceHealthDept.name || '';
          this.ruleForm.fax = resourceHealthDept.fax || '';
          this.ruleForm.dutyTel = resourceHealthDept.dutyTel || '';
          this.ruleForm.wholeBlood = resourceHealthDept.wholeBlood || '';
          this.ruleForm.bloodPlasma = resourceHealthDept.bloodPlasma || '';
          this.ruleForm.bedNum = resourceHealthDept.bedNum || '';
          this.ruleForm.bloodPlatelet = resourceHealthDept.bloodPlatelet || '';
          this.ruleForm.doctorNum = resourceHealthDept.doctorNum || '';
          this.ruleForm.nurseNum = resourceHealthDept.nurseNum || '';
          this.ruleForm.ambulanceNum = resourceHealthDept.ambulanceNum || '';
          this.ruleForm.address = resourceHealthDept.address || '';
          this.ruleForm.longitude = resourceHealthDept.longitude || '';
          this.ruleForm.latitude = resourceHealthDept.latitude || '';
          this.ruleForm.equipDesc = resourceHealthDept.equipDesc || '';
          this.ruleForm.notes = resourceHealthDept.notes || '';
          this.ruleForm.level = resourceHealthDept.level || '';
          this.ruleForm.levelName = resourceHealthDept.levelName || '';
          this.ruleForm.type = resourceHealthDept.type || '';
          this.ruleForm.typeName = resourceHealthDept.typeName || '';
          this.ruleForm.groupId = resourceHealthDept.groupId || '';
          const townId = getRelations({
            arr: this.areaOptions,
            relationKey: 'id',
            findKey: 'id',
            findValue: Number(resourceHealthDept.townId),
          });
          const townName = getRelations({
            arr: this.areaOptions,
            relationKey: 'townName',
            findKey: 'id',
            findValue: Number(resourceHealthDept.townId),
          });
          this.ruleForm.townId = townId || '';
          this.ruleForm.townName = townName.join('/') || '';
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
     * @description 保存
     */
    save() {
      if (this.type === 'detail') {
        this.$refs.dialog.visible = false;
        return;
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 联系人
          const contactorIds = this.contacts ? this.contacts.map((item) => item.id) : [];
          // 负责人
          const responsibleIds = this.responsibles ? this.responsibles.map((item) => item.id) : [];
          // 联系人
          const params = this.type === 'update' ? {
            id: this.ruleForm.id,
            contacts: contactorIds,
            responsibles: responsibleIds,
            ...this.ruleForm,
            classId: this.ruleForm.classId[this.ruleForm.classId.length - 1],
            townId: this.ruleForm.townId.length > 0 ? this.ruleForm.townId[this.ruleForm.townId.length - 1] : this.ruleForm.townId,
          } : {
            contacts: contactorIds,
            responsibles: responsibleIds,
            ...this.ruleForm,
            classId: this.ruleForm.classId[this.ruleForm.classId.length - 1],
            townId: this.ruleForm.townId.length > 0 ? this.ruleForm.townId[this.ruleForm.townId.length - 1] : this.ruleForm.townId,
          };
          this.$http({
            method: 'post',
            baseURL: window.SITE_CONFIG.baseUrl,
            url: `/resoure/resourcehealthdept/${this.type === 'update' ? 'update' : 'save'}`,
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
    cancleDialog() {
      // 关闭模态框并清除规则
      this.$refs.dialog.visible = false;
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>

<style lang="scss">
.MedicalInstitutionFormDialog {
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
      .MedicalInstitutionForm {
        width: 100%;
        box-sizing: border-box;
        padding: 20px 20px 0px 10px;

        .sbs-input {
          width: 100%;
        }

        .sbs-select {
          width: 100%;
        }

        .lonlat{
            &>div{
                display: flex;
                &>div:first-child{
                    margin-right: 10px;
                }
            }
        }
      }
    }
  }
}
</style>
<style lang="scss" src="@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/AddOrEditDialog/AddOrEditDialog.scss">
