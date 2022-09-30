<!--
 * @Author: linhuiting
 * @Date: 2020-11-12 08:47:13
 * @LastEditors: Liukanglin
 * @LastEditTime: 2021-01-12 10:14:07
 * @Description: 避难场所添加、修改弹窗
 * @FilePath: \SBS\src\views\modules\contingencyManage\shelterManage\shelterManage-add-or-modify.vue
-->

<template>
  <sv-dialog
    ref="dialog"
    :title="type=='modify' ? '修改' : type == 'add' ? '新增' : ''"
    :close-on-click-modal="false"
    @cancel="handleCancel"
    @confirm="$refs.submitConfirm.visible = true"
  >
    <div
      v-loading="loading"
      class="aoe"
      :class="{'aoe-fullscreen': isFullscreen}"
      element-loading-spinner="sv-loading"
      :rules="dataRule"
    >
      <!-- A. 左边栏 -->
      <div class="aoe__left">
        <div class="aoe__left__item aoe__left__item-required">
          <div class="aoe__left__item__label">
            名称
          </div>
          <div class="aoe__left__item__content">
            <sv-input-search
              v-model="dataForm.name"
              :suffix="false"
              placeholder="请输入避难场所名称"
              width="100%"
            />
          </div>
        </div>
        <div class="aoe__left__item aoe__left__item-required">
          <div class="aoe__left__item__label">
            分组
          </div>
          <div class="aoe__left__item__content">
            <sv-select-group
              v-model="dataForm.areaTypeId"
              api="/resoure/resourareatype/list"
              :name="dataForm.areaType"
            />
          </div>
        </div>

        <div class="aoe__left__item aoe__left__item-required">
          <div class="aoe__left__item__label">
            避难场所类型
          </div>
          <div class="aoe__left__item__content">
            <el-cascader
              ref="classId"
              v-model.trim="dataForm.classId"
              :options="warehouseTypeData"
              :props="propsObj"
              clearable
              style="float: left; width: 100%"
              :show-all-levels="false"
              placeholder="请选择避难场所类型"
            />
          </div>
        </div>

        <div class="aoe__left__item aoe__left__item-required">
          <div class="aoe__left__item__label">
            所属区域
          </div>
          <div class="aoe__left__item__content">
            <!-- <sv-select-group
              v-model="dataForm.townId"
              api="/sys/systown/treeList"
              :name="dataForm.townName"
              :tree-props="{
                children: 'children',
                label: 'townName',
                value: 'id'
              }"
              :placeholder="'请选择所属区域'"
              :title="'请选择所属区域'"
            /> -->
            <el-cascader
              ref="townId"
              v-model="dataForm.townId"
              style="width: 100%"
              :options="areaOptions"
              :props="propsArea"
              clearable
              :show-all-levels="false"
              placeholder="请选择所属区域"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            地址
          </div>
          <div class="aoe__left__item__content">
            <sv-input-search
              v-model="dataForm.address"
              :suffix="false"
              placeholder="请从右侧地图确认位置"
              width="100%"
              :disabled="true"
              :clearable="false"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            经度
          </div>
          <div class="aoe__left__item__content">
            <sv-input-search
              v-model="dataForm.longitude"
              :suffix="false"
              placeholder="请从右侧地图确认位置"
              width="100%"
              :disabled="true"
              :clearable="false"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            纬度
          </div>
          <div class="aoe__left__item__content">
            <sv-input-search
              v-model="dataForm.latitude"
              :suffix="false"
              placeholder="请从右侧地图确认位置"
              width="100%"
              :disabled="true"
              :clearable="false"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            场所功能
          </div>
          <div class="aoe__left__item__content">
            <sv-input-search
              v-model="dataForm.feature"
              :suffix="false"
              placeholder="请输入场所功能"
              width="100%"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            面积(㎡)
          </div>
          <div class="aoe__left__item__content">
            <el-input-number
              v-model="dataForm.acreage"
              style="width:100%;"
              :min="0"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            可容纳人数
          </div>
          <div class="aoe__left__item__content">
            <el-input-number
              v-model="dataForm.peopleNum"
              :min="0"
              style="width:100%;"
              :disabled="type == 'watch'"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            抗震设防程度
          </div>
          <div class="aoe__left__item__content">
            <el-input-number
              v-model="dataForm.level"
              style="width:100%;"
              :min="0"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            使用时间
          </div>
          <div class="aoe__left__item__content">
            <el-date-picker
              v-model="dataForm.useTime"
              unlink-panels
              :editable="false"
              type="datetime"
              style="width:100%;"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="请选择使用日期时间"
              default-time="09:00:00"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            设计使用年限
          </div>
          <div class="aoe__left__item__content">
            <el-input-number
              v-model="dataForm.useYear"
              style="width:100%;"
              :min="0"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            主管单位
          </div>
          <div class="aoe__left__item__content">
            <sv-input-search
              v-model="dataForm.competentUnit"
              width="100%"
              :suffix="false"
              placeholder="请输入主管单位"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            应急标识
          </div>
          <div class="aoe__left__item__content">
            <sv-select
              v-model="dataForm.emergencyFlag"
              width="100%"
              :options="natureOptions"
              placeholder="请选择应急标识"
              align="left"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            给排水情况
          </div>
          <div
            class="aoe__left__item__content"
            style="font-size:0"
          >
            <sv-textarea
              v-model="dataForm.waterDetails"
              :rows="2"
              placeholder="请输入给排水情况"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            供电状况
          </div>
          <div
            class="aoe__left__item__content"
            style="font-size:0"
          >
            <sv-textarea
              v-model="dataForm.electricityDetails"
              :rows="2"
              placeholder="请输入供电状况"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            通风状况
          </div>
          <div
            class="aoe__left__item__content"
            style="font-size:0"
          >
            <sv-textarea
              v-model="dataForm.windDetails"
              :rows="2"
              placeholder="请输入通风状况"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            应急器材
          </div>
          <div
            class="aoe__left__item__content"
            style="font-size:0"
          >
            <sv-textarea
              v-model="dataForm.emergencyEquipment"
              :rows="2"
              placeholder="请输入应急器材"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            储备物资
          </div>
          <div
            class="aoe__left__item__content"
            style="font-size:0"
          >
            <sv-textarea
              v-model="dataForm.storeMaterials"
              :rows="2"
              placeholder="请输入储备物资"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            备注
          </div>
          <div
            class="aoe__left__item__content"
            style="font-size:0"
          >
            <sv-textarea
              v-model="dataForm.remark"
              :rows="2"
              placeholder="请输入备注"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            联系人
          </div>
          <div class="aoe__left__item__content">
            <sv-select-contact
              v-model="dataForm.contactorlist"
              title="联系人"
              :api="['/mail/mailgroup/list','/mail/mailcontactor/list']"
              :multiple="true"
              @click="addContactHandle('contactorlist')"
              @delete="delIt(item.id, 'contactorlist')"
            />
            <!-- 添加联系人 -->
            <add-contact ref="AddContactView" />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            负责人
          </div>
          <div class="aoe__left__item__content">
            <sv-select-contact
              v-model="dataForm.principalList"
              title="负责人"
              :api="['/mail/mailgroup/list','/mail/mailcontactor/list']"
              :multiple="true"
              @click="addContactHandle('principalList')"
              @delete="delIt(item.id, 'principalList')"
            />
            <add-contact ref="AddContactView" />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            关联设备
          </div>
          <div
            class="aoe__left__item__content"
            style="font-size:0"
          >
            <el-dropdown
              trigger="click"
              placement="bottom-start"
              @command="handleCommand"
            >
              <el-button
                plain
              >
                增加
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="(item,key,idx) in deviceObj"
                    :key="idx+key"
                    :command="key"
                  >
                    {{ item }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <div :class="$style.backDiv">
          <div
            v-for="(item,idx) in deviceTextArr"
            :key="idx"
            :class="$style.outDiv"
          >
            <div
              v-for="(item1, idx1) in showDeviceData[item]"
              :key="idx1"
              :class="$style.showDevice"
            >
              <div :class="$style.type">
                {{ deviceObj[item1.type] }}
              </div>
              <div :class="$style.deviceName">
                <span :title="item1.name">{{ item1.name }}</span>
              </div>
              <div
                :class="$style.showDelete"
                @click.stop="deleteDevice(item1)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- B. 右边栏 -->
      <div class="aoe__right">
        <div class="aoe__right__title">
          避难场所地址
        </div>
        <div
          class="aoe__right__fullscreen"
          @click="isFullscreen = !isFullscreen"
        />
        <Location
          :address="dataForm.address"
          :lng-lat="[dataForm.longitude, dataForm.latitude]"
          :cgcsLngLatInit="[dataForm.cgcsLongitude, dataForm.cgcsLatitude]"
          @confirm="handleLocationConfirm"
        />
      </div>
    </div>

    <sv-dialog-hint
      ref="submitConfirm"
      type="submit"
      @confirm="handleSubmit"
    />
    <sv-dialog-hint
      ref="submitFail"
      type="fail"
    />
    <deviceDialog
      ref="deviceDialogEl"
      :dialog-title="deviceTitle"
      @selectedList="getDeviceData"
    />
  </sv-dialog>
</template>

<script>
import bus from '@/views/common/js/eventBus';
import Location from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/Location';
import AddContact from './addContact/AddContact.vue';
import deviceDialog from '../../sys/resource/deviceDialog';

export default {
  name: 'AddOrModifyDialog',
  components: {
    AddContact,
    Location,
    deviceDialog,
  },
  data() {
    return {
      natureOptions: [
        {
          value: '1',
          label: '是',
        },
        {
          value: '0',
          label: '否',
        },
      ],
      // 弹窗类型: add or modify
      type: 'add',
      // 数据提交中
      loading: false,
      // 左边栏数据
      dataForm_empty: {
        name: '', // 避难场所名称
        areaType: '', // 分组名称
        areaTypeId: '', // 分组id
        townName: '', // 所属区域名称
        townId: '', // 所属区域id
        level: '', // 抗震设防程度
        feature: '', // 场所功能
        peopleNum: 0, // 使用人数
        acreage: 0, // 面积
        useTime: '', // 使用时间
        useYear: 0, // 使用年限
        emergencyFlag: '', // 应急标识
        longitude: '', // 经度
        latitude: '', // 纬度
        competentUnit: '', // 主管单位
        storeMaterials: '', // 储备物资
        address: '', // 地址
        waterDetails: '', // 给排水情况
        windDetails: '', // 通风状况
        electricityDetails: '', // 供电状况
        remark: '', // 备注
        emergencyEquipment: '', // 应急器材
        contactsId: [], // 联系人id
        principalIds: [], // 负责人id
        contactorlist: [],
        principalList: [],
        cgcsLatitude: '',
        cgcsLongitude: '',
      },
      warehouseTypeData: [], // 事件类型
      propsObj: {
        value: 'id',
        label: 'name',
        children: 'children',
        checkStrictly: true,
      },
      dataForm: { classId: '', },
      dataForm_add: {},
      isFullscreen: false, // 地图是否全屏

      dataRule: {
        acreage: [
          {
            type: 'number',
            message: '面积类型必须为整数',
            trigger: 'blur',
            transform(value) {
              return Number(value);
            },
          },
        ],
        peopleNum: [
          {
            type: 'number',
            message: '可容纳人数类型必须为整数',
            trigger: 'blur',
            transform(value) {
              return Number(value);
            },
          },
        ],
        level: [
          {
            required: true,
            message: '抗震设防程度类型不能为空',
            trigger: 'blur',
          },
          {
            type: 'number',
            message: '抗震设防程度类型必须为整数',
            trigger: 'blur',
            required: false,
            transform(value) {
              return Number(value);
            },
          },
          // { pattern: /^-?[1-9]\d*$/,message: '坐标类型必须为整数'}
        ],
        useYear: [
          { required: true, message: '设计使用年限不能为空', trigger: 'blur' },
          {
            type: 'number',
            message: '设计使用年限类型必须为整数',
            trigger: 'blur',
            transform(value) {
              return Number(value);
            },
          },
        ],
      },
      deviceTitle: '',
      deviceObj: {
        0: '监控视频',
        1: '会场终端',
        2: '集群终端',
        // 3: 'WeComm',
        // 4: 'APP终端',
      },
      deviceTypeObj: {
        0: 'monitor',
        1: 'room',
        2: 'colony',
        // 3: 'wecomm',
        4: 'app',
      },
      deviceTextArr: [
        'monitor',
        'room',
        'colony',
        // 'wecomm',
        'app',
      ],
      showDeviceData: {
        monitor: [],
        room: [],
        colony: [],
        // wecomm: [],
        app: [],
      },
      propsArea: {
        value: 'id',
        label: 'townName',
        children: 'children',
        checkStrictly: true,
        emitPath: false,
      },
      areaOptions: [], // 地区选择数据
    };
  },
  watch: {
    showDeviceData: {
      handler(newVal, oldVal) {
        this.showDeviceData = newVal;
      },
      deep: true,
    },
  },
  mounted() {
    this.dataForm_add = { ...this.dataForm_empty };
    this.dataForm = { ...this.dataForm_empty };
    // 获取已选联系人
    bus.$off('getCheckContact');
    bus.$on('getCheckContact', (val) => {
      // console.log(val)
      this.dataForm.contactsId = val;
    });
    this.refuge();
  },

  methods: {
    // 避难场所类别
    refuge(){
      this.$http({
        url: this.$http.adornUrl('/resoureAreaClass/treeList'),
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
     * @description: 初始化数据，打开弹窗
     * @param {String} type 弹窗类型，add新增、modify编辑
     * @param {Object} data 编辑的数据
     */
    init(type, id) {
      this.type = type;
      this.showDeviceData = {
        monitor: [],
        room: [],
        colony: [],
        // wecomm: [],
        app: [],
      };
      // 所属区域
      this.$http
        .get(`${window.SITE_CONFIG.baseUrl}/sys/systown/treeList`)
        .then((response) => {
          if (response.data.code === 0) {
            this.areaOptions = response.data.list;
          }
        });
      if (type === 'add') {
        // 显示弹窗
        this.$refs.dialog.visible = true;
      } else if (type === 'modify') {
        // 获取数据详情
        const request = {
          method: 'get',
          url: '/resoure/resourearea/selectById',
          baseURL: window.SITE_CONFIG.baseUrl,
          params: {
            ids: id,
            token: this.$cookie.get('token'),
          },
        };
        this.$http(request)
          .then((response) => {
            if (response.data.code === 0) {
              // this.dataForm = response.data.data[0];
              // 数组解构获取要修改的数据 response.data.data[0]
              response.data.data[0].resources.forEach((item) => {
                const typeChange = parseInt(item.type, 10) - 9;
                const arrType = this.deviceTypeObj[typeChange];
                if (item.data && item.data.length) {
                  item.data.forEach((item1) => {
                    const o = {};
                    o.id = item1.entity.id;
                    o.name = item1.entity.name;
                    o.type = typeChange;
                    this.showDeviceData[arrType].push(o);
                  });
                }
              });
              [this.dataForm, ...response.data.data] = response.data.data;
              // 清除异常数据
              if (this.dataForm.contactorlist && this.dataForm.contactorlist.length) {
                this.dataForm.contactorlist = this.dataForm.contactorlist.filter((i) => !!i);
              }
              if (this.dataForm.principalList && this.dataForm.principalList.length) {
                this.dataForm.principalList = this.dataForm.principalList.filter((i) => !!i);
              }
              // console.log("this.dataForm", this.dataForm)
              // 显示弹窗
              this.$refs.dialog.visible = true;
            } else {
              window.console.log('获取id =', id, '的详情失败！错误信息：【\n', response, '\n】');
            }
          })
          .catch((error) => {
            window.console.log('获取id =', id, '的详情失败！错误信息：【\n', error, '\n】');
          });
      }
    },
    /**
     * @description: 地图定位确定位置，通过数组解构，获取地址和坐标
     * @param {String} currentAddress 确定地址
     * @param {Array} currentLngLat 确定坐标数组
     */
    handleLocationConfirm(currentAddress, currentLngLat, spotInfo, cgcsLngLat) {
      this.isFullscreen = false;
      this.dataForm.address = currentAddress;
      [this.dataForm.longitude, this.dataForm.latitude] = currentLngLat;
      // 大地坐标系
      this.dataForm.cgcsLongitude = cgcsLngLat[0];
      this.dataForm.cgcsLatitude = cgcsLngLat[1];
      // 强制更新，防止深对象v-model不更新
      this.$forceUpdate();
    },
    // 添加联系人视图
    addContactHandle(type) {
      if (type === 'contactorlist') {
        this.$refs.AddContactView.getDataList(this.dataForm.contactsId);
      } else {
        this.$refs.AddContactView.getDataList(this.dataForm.principalIds);
      }
    },
    delIt(id, type) {
      if (type === 'contactorlist') {
        this.dataForm.contactsId = this.dataForm.contactsId.filter(
          (v) => v.id !== id,
        );
      } else {
        this.dataForm.principalIds = this.dataForm.principalIds.filter(
          (v) => v.id !== id,
        );
      }
    },
    /**
     * @method
     * @desc 关闭弹窗
     */
    handleCancel() {
      this.$refs.dialog.visible = false;
      this.isFullscreen = false;
      // 保存新增页面的编辑内容，清除编辑页面的内容
      if (this.type === 'add') {
        this.dataForm_add = { ...this.dataForm };
      } else {
        this.dataForm = { ...this.dataForm_empty };
      }
    },
    /**
     * @method
     * @desc 确认提交
     */
    handleSubmit() {
      // 表单必填项验证
      if (!this.submitValidate()) {
        return;
      }
      this.loading = true;
      this.dataForm_add = { ...this.dataForm };
      this.dataForm.contactsId = []; // 声明为数组，否则push报错
      this.dataForm.principalIds = [];
      // this.dataForm.contactorlist.length > 0 ? this.dataForm.contactorlist.map((item) => {
      //   this.dataForm.contactsId.push(item.id);
      // }).join(',') : '';
      // 判断是否存在联系人（通过方法调用，不要用上方表达式）
      if (this.dataForm.contactorlist && this.dataForm.contactorlist.length > 0) {
        this.dataForm.contactorlist.map((item) => {
          this.dataForm.contactsId.push(item.id);
          return this.dataForm.contactsId;
        }).join(',');
      } else {
        this.dataForm.contactsId = [];
      }
      if (this.dataForm.principalList && this.dataForm.principalList.length > 0) {
        this.dataForm.principalList.map((item) => {
          this.dataForm.principalIds.push(item.id);
          return this.dataForm.principalIds;
        }).join(',');
      } else {
        this.dataForm.principalIds = [];
      }
      // 新增
      const params = {
        related: [],
      };
      for (const k in this.showDeviceData) {
        this.showDeviceData[k].forEach((item) => {
          const o = {};
          const value = item;
          o.resoureId = value.id;
          o.type = parseInt(value.type, 10) + 9;
          params.related.push(o);
        });
      }
      if (this.type === 'add') {
        const request = {
          method: 'post',
          url: '/resoure/resourearea/save',
          baseURL: window.SITE_CONFIG.baseUrl,
          data: {
            ...this.dataForm,
            classId: this.dataForm.classId[this.dataForm.classId.length - 1],
            params
          },
          contactsId: this.dataForm.contactsId,
          principalIds: this.dataForm.principalIds,
        };
        this.$http(request)
          .then((response) => {
            if (response.data.code === 0) {
              // console.log('新增', this.dataForm);
              this.$emit('refreshDataList');
              // 提交成功后，清空数据
              this.$refs.dialog.visible = false;
              this.dataForm = { ...this.dataForm_empty };
              this.dataForm_add = { ...this.dataForm_empty };
              this.isFullscreen = false;
            } else {
              window.console.log('新增失败！错误信息：【\n', response, '\n】');
              this.$refs.submitFail.visible = true;
              this.$refs.submitFail.supplementText = `错误代码：${response.data.code}`;
            }
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
            window.console.log('新增失败！错误信息：【\n', error, '\n】');
            this.$refs.submitFail.visible = true;
            this.$refs.submitFail.supplementText = error;
          });
      } else if (this.type === 'modify') { // 修改
        const request = {
          method: 'post',
          url: '/resoure/resourearea/update',
          baseURL: window.SITE_CONFIG.baseUrl,
          data: {
            ...this.dataForm,
            classId:this.dataForm.classId[this.dataForm.classId.length-1],
            params,
          },
          contactsId: this.dataForm.contactsId.map((v) => v.id),
          principalIds: this.dataForm.principalIds.map((v) => v.id),
        };
        this.$http(request)
          .then((response) => {
            if (response.data.code === 0) {
              this.$emit('refreshDataList');
              // 提交成功后，清空数据
              this.$refs.dialog.visible = false;
              this.dataForm = { ...this.dataForm_empty };
              this.isFullscreen = false;
            } else {
              window.console.log('更新失败！错误信息：【\n', response, '\n】');
              this.$refs.submitFail.visible = true;
              this.$refs.submitFail.supplementText = `错误代码：${response.data.code}`;
            }
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
            window.console.log('更新失败！错误信息：【\n', error, '\n】');
            this.$refs.submitFail.visible = true;
            this.$refs.submitFail.supplementText = error;
          });
      }
    },
    /**
     * @method
     * @desc 提交数据验证
     * @return {Boolean} 提交数据是否通过验证
     */
    submitValidate() {
      const form = this.dataForm;
      if (
        form.name === ''
        || form.areaTypeId === ''
        || form.townId === ''
      ) {
        this.$refs.submitFail.visible = true;
        this.$refs.submitFail.supplementText = '带星号必填项不能为空！';
        return false;
      }
      return true;
    },
    // 添加关联对象
    handleCommand(command) {
      this.deviceTitle = this.deviceObj[command];
      this.$refs.deviceDialogEl.loadingPopup();
      const arrType = this.deviceTypeObj[command];
      this.$refs.deviceDialogEl.initData(command, this.showDeviceData[arrType]);
    },
    getDeviceData(type, data) {
      const arrType = this.deviceTypeObj[type];
      this.showDeviceData[arrType] = [...data];
    },
    deleteDevice(item) {
      const arrType = this.deviceTypeObj[item.type];
      const index = this.showDeviceData[arrType].findIndex((it) => it.id === item.id);
      this.showDeviceData[arrType].splice(
        index,
        1,
      );
    },
  },
};
</script>

<style
  lang="scss"
  src="@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/AddOrEditDialog/AddOrEditDialog.scss"
>
</style>
<style lang="scss" module>
.backDiv {
  margin-left: 85px;
  background: #f2f2f2;
  border-radius: 4px;
  overflow: hidden;
}
.outDiv {
  margin-top: -2px;
  .showDevice {
    display: flex;
    height: 30px;
    line-height: 30px;
    margin: 5px;
    .type {
      width: 25%;
      text-align: center;
      border: 1px dashed #0091ff;
      padding: 0px 5px;
    }
    .deviceName {
      width: 75%;
      padding-left: 10px;
      color: #0091ff;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .showDelete {
      display: block;
      width: 15px;
      // height: 14px;
      background: url('../../DeviceAdmin/assets/close.svg')no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
    }
  }
}
</style>
<style lang="scss" scoped>
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
  /deep/ .el-cascader {
    .el-input__inner {
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
