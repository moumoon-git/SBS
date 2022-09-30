<!--
 * @Author: linhuiting
 * @Date: 2020-11-17 08:17:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-08-10 11:13:28
 * @Description: 应急队伍添加、修改弹窗
 * @FilePath: \product_SBS\src\views\modules\sys\resoureteam\resoureteam-add-or-modify.vue
-->

<template>
  <sv-dialog
    ref="dialog"
    :title="type === 'modify' ? '修改' : '新增'"
    :close-on-click-modal="false"
    @cancel="handleCancel"
    @confirm="$refs.submitConfirm.visible = true"
  >
    <div
      v-loading="loading"
      class="aoe"
      :class="{ 'aoe-fullscreen': isFullscreen }"
      element-loading-spinner="sv-loading"
    >
      <!-- A. 左边栏 -->
      <div class="aoe__left">
        <div class="aoe__left__item aoe__left__item-required">
          <div class="aoe__left__item__label">队伍名称</div>
          <div class="aoe__left__item__content">
            <sv-input-search
              v-model="dataForm.name"
              :suffix="false"
              placeholder="请输入队伍名称"
              width="100%"
            />
            <div v-if="nameRepeat" class="aoe__left__item__error">名称重复</div>
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">负责人</div>
          <div class="aoe__left__item__content">
            <sv-select-contact
              v-model="selectedResponsibleID"
              title="负责人"
              :api="['/mail/mailgroup/list', '/mail/mailcontactor/list']"
              :detail="
                dataForm.responsiblesList && dataForm.responsiblesList.length
                  ? dataForm.responsiblesList[0]
                  : {}
              "
              @update="updateResponsiblesList"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">联系人</div>
          <div class="aoe__left__item__content">
            <sv-select-contact
              v-model="selectedContactID"
              title="联系人"
              :api="['/mail/mailgroup/list', '/mail/mailcontactor/list']"
              :detail="
                dataForm.contactsList && dataForm.contactsList.length
                  ? dataForm.contactsList[0]
                  : {}
              "
              @update="updateContactsList"
            />
          </div>
        </div>
        <div class="aoe__left__item aoe__left__item-required">
          <div class="aoe__left__item__label">
            队伍分组
          </div>
          <div class="aoe__left__item__content">
            <el-input
              v-model="dataForm.teamClassName"
              :readonly="true"
              placeholder="请选择队伍分组"
              @focus="selectExpertGroup()"
            />
            <sv-dialog
              ref="teamGroupDialog"
              title="新增队伍分组"
              @cancel="$refs.teamGroupDialog.visible = false"
              @confirm="$refs.teamGroupDialog.visible = false"
            >
              <div style="height: 307px;width: 100%;overflow: auto;">
                <el-tree
                  ref="expertTree"
                  :data="teamTreeGroup"
                  :props="treeProp"
                  node-key="id"
                  :filter-node-method="filterNode"
                  :highlight-current="true"
                  @current-change="treeChangeGroupHandle"
                />
              </div>
            </sv-dialog>
          </div>
        </div>
        <div class="aoe__left__item aoe__left__item-required">
          <div class="aoe__left__item__label">
            队伍类型
          </div>
          <div class="aoe__left__item__content">
            <!-- <sv-select-group
              v-model="dataForm.teamTypeId"
              api="/resoure/resoureteamtype/tree"
              :name="dataForm.teamTypeName"
              :params="{
                apiVersion: '0.0.2',
              }"
            /> -->
            <el-input
              v-model="dataForm.teamTypeName"
              :readonly="true"
              placeholder="请选择队伍类型"
              @focus="selectExpertType()"
            />
            <sv-dialog
              ref="teamDialog"
              title="新增队伍类型"
              @cancel="$refs.teamDialog.visible = false"
              @confirm="$refs.teamDialog.visible = false"
            >
              <div style="height: 307px; width: 100%; overflow: auto">
                <el-tree
                  ref="expertTree"
                  :data="teamTreeList"
                  :props="treeProp"
                  node-key="id"
                  :filter-node-method="filterNode"
                  :highlight-current="true"
                  @current-change="treeChangeHandle"
                />
              </div>
            </sv-dialog>
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">所属区域</div>
          <div class="aoe__left__item__content">
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
          <div class="aoe__left__item__label">队伍单位</div>
          <div class="aoe__left__item__content">
            <!-- <sv-select-group
              v-model="dataForm.groupId"
              api="/mail/mailgroup/list"
              :name="dataForm.teamGroup"
            /> -->
            <sv-input-search
              v-model="dataForm.teamGroup"
              :suffix="false"
              placeholder="请输入队伍单位"
              width="100%"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">队伍人数</div>
          <div class="aoe__left__item__content">
            <sv-input-search
              v-model="dataForm.peopleNumber"
              :suffix="false"
              placeholder="请输入队伍人数"
              width="100%"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">成立时间</div>
          <div class="aoe__left__item__content">
            <el-date-picker
              v-model="dataForm.creationTime"
              unlink-panels
              :editable="false"
              type="date"
              style="width: 100%"
              value-format="yyyy-MM-dd"
              placeholder="请选择使用成立时间"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">传真</div>
          <div class="aoe__left__item__content">
            <sv-input-search
              v-model="dataForm.fax"
              :suffix="false"
              placeholder="请输入传真"
              width="100%"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">值班电话</div>
          <div class="aoe__left__item__content">
            <sv-input-search
              v-model="dataForm.telephoneNum"
              :suffix="false"
              placeholder="请输入值班电话"
              width="100%"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">应急通讯方式</div>
          <div class="aoe__left__item__content">
            <sv-input-search
              v-model="dataForm.communicationMethod"
              :suffix="false"
              placeholder="请输入应急通讯方式"
              width="100%"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">邮政编码</div>
          <div class="aoe__left__item__content">
            <sv-input-search
              v-model="dataForm.postalCode"
              :suffix="false"
              placeholder="请输入邮政编码"
              width="100%"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">应急准备时间(分钟)</div>
          <div class="aoe__left__item__content">
            <sv-input-search
              v-model.number="dataForm.preparationTime"
              :suffix="false"
              placeholder="请输入应急准备时间（分钟）"
              width="100%"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">机密等级</div>
          <div class="aoe__left__item__content">
            <sv-select
              v-model="dataForm.secretLevel"
              width="100%"
              :options="secretLevelOptions"
              placeholder="请选择机密类型"
              align="left"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">资质等级</div>
          <div class="aoe__left__item__content">
            <sv-input-search
              v-model="dataForm.qualificationLevel"
              :suffix="false"
              placeholder="请输入资质等级"
              width="100%"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">性质</div>
          <div class="aoe__left__item__content">
            <sv-select
              v-model="dataForm.nature"
              width="100%"
              :options="natureOptions"
              placeholder="请选择性质"
              align="left"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">级别</div>
          <div class="aoe__left__item__content">
            <sv-select
              v-model="dataForm.level"
              width="100%"
              :options="levelOptions"
              placeholder="请选择级别"
              align="left"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">地址</div>
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
          <div class="aoe__left__item__label">主要职责</div>
          <div class="aoe__left__item__content" style="font-size: 0">
            <sv-textarea
              v-model="dataForm.duties"
              :rows="2"
              placeholder="请输入主要职责"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">装备描述</div>
          <div class="aoe__left__item__content" style="font-size: 0">
            <sv-textarea
              v-model="dataForm.equipment"
              :rows="2"
              placeholder="请输入装备描述"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">专长</div>
          <div class="aoe__left__item__content" style="font-size: 0">
            <sv-textarea
              v-model="dataForm.specialty"
              :rows="2"
              placeholder="请输入专长"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">应急救援经历</div>
          <div class="aoe__left__item__content" style="font-size: 0">
            <sv-textarea
              v-model="dataForm.rescueExperience"
              :rows="2"
              placeholder="请输入应急救援经历"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">备注</div>
          <div class="aoe__left__item__content" style="font-size: 0">
            <sv-textarea
              v-model="dataForm.remark"
              :rows="2"
              placeholder="请输入备注"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">关联设备</div>
          <div class="aoe__left__item__content" style="font-size: 0">
            <el-dropdown
              trigger="click"
              placement="bottom-start"
              @command="handleCommand"
            >
              <el-button plain> 增加 </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="(item, key, idx) in deviceObj"
                    :key="idx + key"
                    :command="key"
                  >
                    {{ item }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <deviceDialog
              ref="deviceDialogEl"
              :dialog-title="deviceTitle"
              @selectedList="getDeviceData"
            />
          </div>
        </div>
        <div :class="$style.backDiv">
          <div
            v-for="(item, idx) in deviceTextArr"
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
              <div
                :class="[
                  {
                    [$style.deviceName]: ['0', '1', '9', '10'].includes(
                      String(item1.type),
                    ),
                  },
                  {
                    [$style.deviceName_default]: [
                      '2',
                      '3',
                      '11',
                      '12',
                    ].includes(String(item1.type)),
                  },
                ]"
              >
                <span :title="item1.name">{{ item1.name }}</span>
              </div>
              <!-- <div
                v-if="['2', '3', '11', '12'].includes(String(item1.type))"
                :class="[
                  { [$style.position]: item1.isDefault === 1 },
                  { [$style.related_btn]: item1.isDefault === 0 },
                ]"
                @click="relatedLocation(item1)"
              >
                <span>{{ item1.isDefault === 1 ? '已关联' : '关联定位' }}</span>
              </div> -->
              <div
                :class="$style.showDelete"
                @click.stop="deleteDevice(item1)"
              />
            </div>
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">关联定位</div>
          <div class="aoe__left__item__content" style="font-size: 0">
            <el-select
              v-model="positionItem"
              class="position_select"
              placeholder="请选择设备"
              @change="positionChange"
            >
              <el-option
                v-for="item in positionObj"
                :key="item.value"
                :label="item.label"
                :value="item.label"
                :disabled="item.disabled"
              />
            </el-select>
            <el-select
              v-if="positionItem === '集群终端' || positionItem === 'WeComm'"
              v-model="positionSecondItem"
              value-key="id"
              placeholder="请选择设备"
              @change="positionSecondChange"
            >
              <el-option
                v-for="item in positionSecondObj"
                :key="item.id"
                :label="
                  item.subscription ? item.name : item.name + '（未订阅）'
                "
                :value="item"
                :disabled="item.subscription ? false : true"
              />
            </el-select>
          </div>
        </div>
      </div>

      <!-- B. 右边栏 -->
      <div class="aoe__right">
        <div class="aoe__right__title">地址</div>
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

    <sv-dialog-hint ref="submitConfirm" type="submit" @confirm="handleSubmit" />
    <sv-dialog-hint ref="submitFail" type="fail" />
  </sv-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils';
// import LinkmanDraggable from "@/views/common/LinkmanDraggable";
import bus from '@/views/common/js/eventBus';
import Location from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/Location.vue';
import deviceDialog from '../resource/deviceDialog.vue';

export default {
  name: 'AddOrModifyDialog',
  components: {
    Location,
    deviceDialog,
  },
  props: ['currentNode'],
  data() {
    return {
      deviceShowData: [],
      filterText: '', // 选择队伍树的值
      teamTreeGroup: [], // 队伍分组
      teamTreeList: [], // 队伍类型
      treeProp: {
        label: 'name',
        children: 'children',
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
      natureOptions: [
        {
          value: 1,
          label: '专职',
        },
        {
          value: 2,
          label: '兼职',
        },
        {
          value: 3,
          label: '专业志愿者',
        },
      ],
      levelOptions: [
        {
          value: 1,
          label: '国家级',
        },
        {
          value: 2,
          label: '省级',
        },
        {
          value: 3,
          label: '市级',
        },
        {
          value: 4,
          label: '县级',
        },
        {
          value: 5,
          label: '其他',
        },
      ],
      secretLevelOptions: [
        {
          value: 1,
          label: '机密',
        },
        {
          value: 2,
          label: '秘密',
        },
        {
          value: 3,
          label: '限制',
        },
        {
          value: 4,
          label: '公开',
        },
        {
          value: 5,
          label: '其他',
        },
      ],
      // 弹窗类型: add or modify
      type: 'add',
      // 数据提交中
      loading: false,
      // 左边栏数据
      dataForm_empty: {
        id: 0,
        name: '',
        teamTypeId: '',
        teamClassId: '',
        teamClassName: '',
        teamTypeName: '',
        peopleNumber: '',
        qualificationLevel: '',
        creationTime: '',
        nature: '',
        level: '',
        secretLevel: '',
        areaCode: '',
        postalCode: '',
        fax: '',
        longitude: '',
        latitude: '',
        address: '',
        duties: '',
        specialty: '',
        equipment: '',
        remark: '',
        townName: '', // 所属区域名称
        townId: '', // 所属区域id
        // groupId: '',
        teamGroup: '',
        unitAddress: '',
        coordinateType: '',
        preparationTime: '',
        telephoneNum: '',
        rescueExperience: '',
        communicationMethod: '',
        isDeleted: '',
        createUserId: '',
        gmtCreate: '',
        modifiedUserId: '',
        gmtModified: '',
        platformId: '',
        teamTypeParentName: '',
        unitParentName: '',
        responsiblesName: '',
        // responsibles: [],
        contactsName: '',
        contacts: [],
        contactsList: [],
        responsiblesList: [],
        cgcsLongitude: '',
        cgcsLatitude: '',
      },
      dataForm: {},
      dataForm_add: {},
      isFullscreen: false, // 地图是否全屏
      // 已选负责人 ID
      selectedResponsibleID: 0,
      // 已选联系人 ID
      selectedContactID: 0,

      dataRule: {
        peopleNumber: [
          // { required: true, message: "队伍人数不能为空", trigger: "blur" },
          {
            type: 'number',
            message: '坐标类型必须为整数',
            trigger: 'blur',
            transform(value) {
              return Number(value);
            },
          },
        ],
      },
      positionItem: '不关联', // 新增时默认勾选APP，默认定位为App
      positionObj: [
        {
          label: '不关联',
          value: '',
          disabled: false,
        },
        {
          label: '集群终端',
          value: 11,
          disabled: true,
        },
        // {
        //   label: 'WeComm',
        //   value: 12,
        //   disabled: true,
        // },
      ],
      positionSecondItem: '',
      positionSecondObj: [],
      positionSelectItem: {},
      nameRepeat: 0, // 判断名称是否重复
      propsArea: {
        value: 'id',
        label: 'townName',
        children: 'children',
        checkStrictly: true,
        emitPath: false,
      },
      areaOptions: [], // 地区选择数据
      platformId: '', // 选择平台id
    };
  },
  watch: {
    deviceShowData: {
      handler(newVal, oldVal) {
        this.deviceShowData = newVal;
        console.log(this.deviceShowData);
      },
      deep: true,
    },
    showDeviceData: {
      handler(newVal, oldVal) {
        this.showDeviceData = newVal;
        console.log(this.showDeviceData);
      },
      deep: true,
    },
    dataForm: {
      immediate: true,
      handler(newVal) {
        if (newVal.responsiblesList && newVal.responsiblesList.length) {
          this.selectedResponsibleID = newVal.responsiblesList[0].id;
        } else {
          this.selectedResponsibleID = 0;
        }
        if (newVal.contactsList && newVal.contactsList.length) {
          this.selectedContactID = newVal.contactsList[0].id;
        } else {
          this.selectedContactID = 0;
        }
      },
    },
    'showDeviceData.colony': {
      handler(newV) {
        if (newV.length > 0) {
          this.positionObj[1].disabled = false;
        } else {
          if (this.positionItem === '集群终端') {
            this.positionItem = '不关联';
          }
          this.positionObj[1].disabled = true;
        }
        this.positionSecondObj = newV; // 更新分组
      },
      deep: true,
    },
    'showDeviceData.wecomm': {
      handler(newV) {
        if (newV.length > 0) {
          this.positionObj[2].disabled = false;
        } else {
          if (this.positionItem === 'WeComm') {
            this.positionItem = '不关联';
          }
          if (this.positionObj[2]) {
            this.positionObj[2].disabled = true;
          }
        }
      },
      deep: true,
    },
    'dataForm.name': {
      handler(newV) {
        if (newV) {
          console.log(newV);
          this.$http({
            url: `${window.SITE_CONFIG.baseUrl}/resoure/resoureteam/verifyName`,
            method: 'get',
            params: this.$http.adornParams({
              name: newV,
              id: this.dataForm.id ? this.dataForm.id : '',
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              // true为不存在重复，false为存在重复
              if (!data.data) {
                this.nameRepeat = 1;
              } else {
                this.nameRepeat = 0;
              }
            }
          });
        } else {
          console.log(newV);
        }
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
    this.nameRepeat = 0;
  },

  methods: {
    /**
     * @description: 选择树分组弹窗
     */
    selectExpertGroup() {
      this.$refs.teamGroupDialog.visible = true;
      console.log(this.platformId);
      this.$http({
        url: this.$http.adornUrl('/resoure/resoureteamclass/search'),
        method: 'get',
        params: {
          platformId: this.platformId,
        },
        // params: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.teamTreeGroup = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description: 选择树类型弹窗
     */
    selectExpertType() {
      this.$refs.teamDialog.visible = true;
      this.$http({
        url: this.$http.adornUrl('/resoure/resoureteamtype/tree'),
        method: 'get',
        params: {
          apiVersion: '0.0.2',
        },
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.teamTreeList = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description: 获取到点击的树节点信息
     * @param {Obj} data 选中的数据节点信息
     */
    treeChangeGroupHandle(data) {
      this.dataForm.teamClassId = data.id;
      this.dataForm.teamClassName = data.name !== '全部' ? data.name : '';
    },
    treeChangeHandle(data) {
      this.dataForm.teamTypeId = data.id;
      this.dataForm.teamTypeName = data.name !== '全部' ? data.name : '';
    },
    /**
     * @description: 树的模糊搜索过滤
     * @param {String} value 输入的值
     * @param {Obj} data 树形结构
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    /**
     * @description: 初始化数据，打开弹窗
     * @desc 初始化数据，打开弹窗
     * @param {String} type 弹窗类型，add新增、modify编辑
     * @param {Object} data 编辑的数据
     */
    init(type, id, platformId) {
      this.type = type;
      this.dataForm.id = id || 0;
      this.platformId = platformId;
      this.showDeviceData = {
        monitor: [],
        room: [],
        colony: [],
        wecomm: [],
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
        this.dataForm = { ...this.dataForm_empty };
        // 把当前选择的分组赋值到添加应急队伍表格中
        if (this.currentNode) {
          this.dataForm.teamClassName = this.currentNode.name !== '全部' ? this.currentNode.name : '';
          this.dataForm.teamClassId = this.currentNode.id;
        }
        // 显示弹窗
        this.$refs.dialog.visible = true;
      } else if (type === 'modify') {
        // 先清空数据
        // this.dataForm = {...this.dataForm_empty}
        // 获取数据详情
        const request = {
          method: 'get',
          url: this.$http.adornUrl(
            `/resoure/resoureteam/info/${this.dataForm.id}`,
          ),
          baseURL: window.SITE_CONFIG.baseUrl,
          params: this.$http.adornParams(),
          // params: {
          //     ids: id,
          //     token: this.$cookie.get('token')
          // }
        };
        this.$http(request)
          .then((response) => {
            // console.log('/resoure/resoureteam/info', response);
            this.dataForm.teamClassName = '';
            if (response.data.code === 0) {
              Object.assign(this.dataForm, response.data);
              this.dataForm = response.data.resoureTeam;
              // console.log("this.dataForm.name", this.dataForm.name)
              console.log('获取信息成功', response.data.resoureTeam);
              this.dataForm.longitude = response.data.resoureTeam.longitude;
              this.dataForm.latitude = response.data.resoureTeam.latitude;
              // console.log("this.dataForm", this.dataForm)
              this.positioningDevice(this.dataForm.positioningDeviceType);
              this.positionSecondItem = this.dataForm.positioningDeviceName;
              this.positionSelectItem.id = this.dataForm.positioningDeviceId;
              // 显示弹窗
              response.data.resources.forEach((item) => {
                const typeChange = parseInt(item.type, 10) - 9;
                const arrType = this.deviceTypeObj[typeChange];
                item.data.forEach((item1) => {
                  const o = {};
                  o.id = item1.entity.id;
                  o.name = item1.entity.name;
                  o.isDefault = item1.isDefault;
                  o.type = typeChange;
                  o.subscription = item1.entity.subscription;
                  this.showDeviceData[arrType].push(o);
                });
              });
              this.$refs.dialog.visible = true;
            } else {
              console.log(
                '获取id =',
                id,
                '的详情失败！错误信息：【\n',
                response,
                '\n】',
              );
            }
          })
          .catch((error) => {
            console.log(
              '获取id =',
              id,
              '的详情失败！错误信息：【\n',
              error,
              '\n】',
            );
          });
      }
    },
    /**
     * @method
     * @desc 地图定位确定位置，获取地址和坐标
     */
    handleLocationConfirm(...arg) {
      this.isFullscreen = false;
      this.dataForm.address = arg[0];
      this.dataForm.longitude = arg[1][0];
      this.dataForm.latitude = arg[1][1];
      // 大地坐标系
      this.dataForm.cgcsLongitude = arg[3][0];
      this.dataForm.cgcsLatitude = arg[3][1];
      // 强制更新，防止深对象v-model不更新
      this.$forceUpdate();
    },
    /**
     * @method
     * @desc 关闭弹窗
     */
    handleCancel() {
      this.$refs.dialog.visible = false;
      this.isFullscreen = false;
      // 保存新增页面的编辑内容，清除编辑页面的内容
      this.type === 'add'
        ? (this.dataForm_add = { ...this.dataForm })
        : (this.dataForm = { ...this.dataForm_empty });
    },
    /**
     * @method
     * @desc 确认提交
     */
    handleSubmit() {
      let isSecondItem = 0;
      console.log(
        'this.dataForm.responsiblesList的name',
        this.dataForm.responsiblesList.length > 0
          ? this.dataForm.responsiblesList.map((item) => item.name).join(',')
          : '',
      );
      (this.dataForm.responsibles = []), // 声明为数组，否则push报错
        this.dataForm.responsiblesList.length > 0
          ? this.dataForm.responsiblesList
              .map((item) => {
                this.dataForm.responsibles.push(item.id);
              })
              .join(',')
          : '';
      console.log('this.dataForm.responsibles', this.dataForm.responsibles);

      console.log(
        'this.dataForm.contactsList的name',
        this.dataForm.contactsList.length > 0
          ? this.dataForm.contactsList.map((item) => item.name).join(',')
          : '',
      );
      (this.dataForm.contacts = []), // 声明为数组，否则push报错
        this.dataForm.contactsList.length > 0
          ? this.dataForm.contactsList
              .map((item) => {
                this.dataForm.contacts.push(item.id);
              })
              .join(',')
          : '';
      console.log('this.dataForm.contacts', this.dataForm.contacts);
      console.log('this.dataForm', this.dataForm);
      console.log('this.dataForm_add', this.dataForm_add);

      this.dataForm_add = { ...this.dataForm };
      // 表单必填项验证
      if (!this.submitValidate()) {
        return;
      }
      // 名称重复
      if (this.nameRepeat) {
        return;
      }
      if (this.positionItem === '集群终端' || this.positionItem === 'WeComm') {
        if (this.positionSecondItem === '') {
          isSecondItem = 1;
        } else {
          isSecondItem = 0;
        }
      }
      if (isSecondItem) {
        this.$message({
          message: '请选择关联定位设备',
          type: 'warning',
        });
        return;
      }
      this.loading = true;

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
          o.isDefault = value.isDefault;
          params.related.push(o);
        });
      }

      if (this.dataForm.peopleNumber) {
        this.dataForm.peopleNumber = Number(this.dataForm.peopleNumber);
      }
      // 设备对应的类型类型
      let positioningDeviceType = '';
      if (this.positionItem === '集群终端') {
        positioningDeviceType = 11;
      }
      if (this.positionItem === 'WeComm') {
        positioningDeviceType = 12;
      }
      this.dataForm.positioningDeviceType = positioningDeviceType;
      // 设备
      this.dataForm.positioningDeviceId = this.positionSelectItem.id;
      if (this.type === 'add') {
        const request = {
          method: 'post',
          url: '/resoure/resoureteam/save',
          baseURL: window.SITE_CONFIG.baseUrl,
          data: {
            ...this.dataForm,
            params,
          },
          // contactsId: this.dataForm.contactsId
        };
        this.$http(request)
          .then((response) => {
            if (response.data.code == 0) {
              console.log('新增', this.dataForm);
              this.$emit('refreshDataList');
              // 提交成功后，清空数据
              this.$refs.dialog.visible = false;
              this.dataForm = { ...this.dataForm_empty };
              this.dataForm_add = { ...this.dataForm_empty };
              this.isFullscreen = false;
            } else {
              console.log('新增失败！错误信息：【\n', response, '\n】');
              this.$refs.submitFail.visible = true;
              this.$refs.submitFail.supplementText = `错误代码：${response.data.msg}`;
            }
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
            console.log('新增失败！错误信息：【\n', error, '\n】');
            this.$refs.submitFail.visible = true;
            this.$refs.submitFail.supplementText = error;
          });
      }
      // 修改
      else if (this.type === 'modify') {
        // 表单必填项验证
        // if(!this.submitValidate()) {
        //   return
        // }
        const request = {
          method: 'post',
          url: '/resoure/resoureteam/update',
          baseURL: window.SITE_CONFIG.baseUrl,
          data: {
            ...this.dataForm,
            params,
          },
          // contactsId: this.dataForm.contactsId.map(v => v.id)
        };
        this.$http(request)
          .then((response) => {
            if (response.data.code == 0) {
              this.$emit('refreshDataList');
              // 提交成功后，清空数据
              this.$refs.dialog.visible = false;
              this.dataForm = { ...this.dataForm_empty };
              this.isFullscreen = false;
            } else {
              console.log('更新失败！错误信息：【\n', response, '\n】');
              this.$refs.submitFail.visible = true;
              this.$refs.submitFail.supplementText = `错误代码：${response.data.msg}`;
            }
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
            console.log('更新失败！错误信息：【\n', error, '\n】');
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
      if (form.name == '' || form.teamTypeId == '') {
        this.$refs.submitFail.visible = true;
        this.$refs.submitFail.supplementText = '带星号必填项不能为空！';
        return false;
      }
      if (form.peopleNumber && !String(form.peopleNumber).match(/^\d*$/)) {
        this.$refs.submitFail.visible = true;
        this.$refs.submitFail.supplementText = '队伍人数只能填写数字！';
        return false;
      }
      if (form.preparationTime && !String(form.preparationTime).match(/^\d*$/)) {
        this.$refs.submitFail.visible = true;
        this.$refs.submitFail.supplementText = '应急准备时间(分钟)只能填写数字！';
        return false;
      }
      if (form.postalCode && !String(form.postalCode).match(/[1-9]\d{5}(?!\d)/)) {
        this.$refs.submitFail.visible = true;
        this.$refs.submitFail.supplementText = '邮政编码格式不正确！';
        return false;
      }
      if (form.telephoneNum && !String(form.telephoneNum).match(/\d{3}-\d{8}|\d{4}-\d{7}/)) {
        this.$refs.submitFail.visible = true;
        this.$refs.submitFail.supplementText = '值班电话格式不正确(例如：0000-0000000)！';
        return false;
      }
      if (form.fax && !String(form.fax).match(/\d{3}-\d{8}|\d{4}-\d{7}/)) {
        this.$refs.submitFail.visible = true;
        this.$refs.submitFail.supplementText = '传真格式不正确(例如：0000-0000000)！';
        return false;
      }

      return true;
    },
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
    relatedLocation(item) {
      if (parseInt(item.type, 10) === 2) {
        this.showDeviceData.colony.forEach(
          (v) => (v.isDefault = v.id === item.id ? 1 : 0),
        );
        this.showDeviceData.wecomm.forEach((v) => (v.isDefault = 0));
      } else {
        this.showDeviceData.colony.forEach((v) => (v.isDefault = 0));
        this.showDeviceData.wecomm.forEach(
          (v) => (v.isDefault = v.id === item.id ? 1 : 0),
        );
      }
    },
    deleteDevice(item) {
      const arrType = this.deviceTypeObj[item.type];
      const index = this.showDeviceData[arrType].findIndex(
        (it) => it.id === item.id,
      );
      this.showDeviceData[arrType].splice(index, 1);
      // 当删除的设备是当前选择的设备时，清空选中数据
      if (item.id === this.positionSelectItem.id) {
        this.positionSecondItem = '';
      }
    },
    // 更新负责人
    updateResponsiblesList(id, contact) {
      this.selectedResponsibleID = id;
      this.dataForm.responsiblesList = contact ? [contact] : [];
    },
    // 更新联系人
    updateContactsList(id, contact) {
      this.selectedContactID = id;
      this.dataForm.contactsList = contact ? [contact] : [];
    },
    positionChange() {
      console.log(this.positionItem);
      if (this.positionItem === '集群终端') {
        this.positionSecondObj = this.showDeviceData.colony;
        this.positionSecondItem = '';
      }
      if (this.positionItem === 'WeComm') {
        this.positionSecondObj = this.showDeviceData.wecomm;
        this.positionSecondItem = '';
      }
    },
    positionSecondChange(item) {
      this.positionSelectItem = item;
    },
    positioningDevice(id) {
      switch (id) {
        case 11:
          this.positionItem = '集群终端';
          this.positionSecondObj = this.showDeviceData.colony;
          break;
        case 12:
          this.positionItem = 'WeComm';
          this.positionSecondObj = this.showDeviceData.wecomm;
          break;
        default:
          this.positionItem = '不关联';
          break;
      }
    },
  },
};
</script>

<style lang="scss" src="@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/AddOrEditDialog/AddOrEditDialog.scss">
</style>
<style lang="scss" module>
.backDiv {
  margin-left: 20px;
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
      width: 100px;
      text-align: center;
      border: 1px dashed #0091ff;
      padding: 0px 5px;
    }
    .related_btn {
      opacity: 0;
      text-align: center;
      border: 1px dashed #000000;
      padding: 0 5px;
      height: 30px;
      width: 90px;
      cursor: pointer;
      margin-right: 10px;
    }
    .position {
      opacity: 1;
      text-align: center;
      border: 1px dashed #000000;
      padding: 0 5px;
      height: 30px;
      width: 90px;
      cursor: pointer;
      margin-right: 10px;
    }
    .deviceName_default {
      width: 395px;
      padding-left: 10px;
      color: #0091ff;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .deviceName {
      width: 490px;
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
      background: url('../../DeviceAdmin/assets/close.svg') no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
    }
    &:hover > .related_btn {
      opacity: 1;
    }
  }
}
</style>
<style lang="scss" scoped>
.aoe__left {
  max-height: 800px;
  overflow-y: auto;
  overflow-x: hidden;
  .position_select {
    width: 115px;
    margin-right: 5px;
  }
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
