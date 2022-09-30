<template>
  <el-dialog
    :title="type === 0 ? '联系人查看' : '联系人修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :destroy-on-close="true"
    width="1000px"
    :modal-append-to-body="false"
  >
    <el-container :class="$style.newcontacts">
      <el-aside width="300px">
        <el-tree
          ref="menuListTree"
          :data="menuList"
          :check-strictly="checkstrictly"
          :default-checked-keys="dataForm.groups"
          :props="menuListTreeProps"
          :show-checkbox="showcheckbox"
          :default-expanded-keys="dataForm.groups"
          :default-expand-all="defaultexpandall"
          node-key="id"
          style="background: #cccccc47; margin-top: 18px; padding-top: 10px"
          @node-click="handleNodeClick"
          @check="Treecheckbox"
        />
      </el-aside>
      <el-main>
        <el-form
          ref="ruleForm"
          :model="dataForm"
          :rules="type === 0 ? {} : rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-row :gutter="20">
            <!--左边框-->
            <el-col :span="17">
              <el-form-item label="姓名" prop="name" size="small">
                <el-input
                  v-model="dataForm.name"
                  :disabled="disabled"
                  style="min-width: 50px"
                />
              </el-form-item>
              <el-form-item label="性别" prop="sex" size="small">
                <el-select
                  v-model="dataForm.sex"
                  :disabled="disabled"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in sexOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="单位" size="small">
                <el-input
                  v-model="dataForm.workUnit"
                  :disabled="disabled"
                  style="min-width: 50px"
                />
              </el-form-item>

              <el-form-item label="职务" size="small" prop="position">
                <el-input
                  v-model="dataForm.position"
                  :disabled="disabled"
                  style="min-width: 50px"
                />
              </el-form-item>
              <el-form-item label="手机号码" size="small" prop="mobile1">
                <el-input
                  v-model="dataForm.mobile1"
                  :disabled="disabled"
                  style="min-width: 50px"
                  placeholder="激活APP需填写手机号码"
                />
              </el-form-item>

              <el-form-item label="办公电话" size="small" prop="officeTel">
                <el-input
                  v-model="dataForm.officeTel"
                  :disabled="disabled"
                  style="min-width: 50px"
                />
              </el-form-item>
              <el-form-item label="家庭电话" size="small" prop="homeTel">
                <el-input
                  v-model="dataForm.homeTel"
                  :disabled="disabled"
                  style="min-width: 50px"
                />
              </el-form-item>
              <el-form-item label="其他电话" size="small" prop="mobile2">
                <el-input
                  v-model="dataForm.otherTel"
                  :disabled="disabled"
                  style="min-width: 50px"
                />
              </el-form-item>

              <el-form-item label="备注" size="small" prop="remark">
                <el-input
                  v-model="dataForm.remark"
                  :disabled="disabled"
                  style="min-width: 50px"
                />
              </el-form-item>

              <el-form-item label="来电语音" size="small" prop="ring">
                <el-radio-group v-model="dataForm.ring">
                  <el-radio :label="0">一般</el-radio>
                  <el-radio :label="1">紧急</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="激活H5" prop="sex" size="small">
                <el-checkbox v-model="dataForm.wxUser" :disabled="disabled">
                  开启
                </el-checkbox>
                <span v-show="dataForm.wxUser" style="color: #a1cf5a"
                  >关联平台：{{
                    dataForm.wxActivationPlatform
                      ? dataForm.wxActivationPlatform
                      : '暂无'
                  }}</span
                >
                <div v-show="dataForm.wxUser">
                  <el-select
                    v-model="dataForm.roleId"
                    :disabled="disabled"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in wxRoleOptions"
                      :key="item.roleId"
                      :label="item.roleName"
                      :value="item.roleId"
                    />
                  </el-select>
                </div>
              </el-form-item>

              <el-form-item label="激活APP" prop="appUser" size="small">
                <el-checkbox
                  v-model="dataForm.appUser"
                  :disabled="disabled || diffrencePlatform"
                >
                  开启
                </el-checkbox>
                <span v-show="dataForm.appUser" style="color: #a1cf5a"
                  >关联平台：{{
                    dataForm.appActivationPlatform
                      ? dataForm.appActivationPlatform
                      : '暂无'
                  }}</span
                >
                <div v-show="dataForm.appUser" style="color: #aaaaaa">
                  注：激活APP需手机号码，无需激活请关闭开关 {{ numstr }}
                </div>
                <div v-show="dataForm.appUser">
                  <el-select
                    popper-class="select_role"
                    v-model="dataForm.appRoleId"
                    placeholder="请选择角色"
                  >
                    <el-option
                      v-for="item in roleList"
                      :key="item.roleId"
                      :label="item.roleName"
                      :value="item.roleId"
                    >
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>

              <el-form-item
                v-show="dataForm.appUser"
                label="会议软终端"
                prop="meetingDevice"
                size="small"
              >
                <div
                  style="color: #3aabdc; cursor: pointer"
                  @click="handleCommand(null, true)"
                >
                  请选择软终端设备
                </div>
                <div v-if="dataForm.meetingDevice.name" class="app-box">
                  <span @click="handleCommand(null, true)">{{
                    dataForm.meetingDevice.name
                  }}</span>
                  <span
                    class="close-btn"
                    @click.stop="
                      dataForm.meetingDevice = {
                        id: '',
                        isDefault: 0,
                        name: '',
                        subscription: 1,
                        type: '4',
                      }
                    "
                    >x</span
                  >
                </div>
                <div style="color: #aaaaaa">
                  注：若未选择软终端设备，则无法在APP里开启会议
                </div>
              </el-form-item>

              <el-form-item
                v-show="dataForm.appUser || dataForm.wxUser"
                label="随机登录码"
                prop="randomPassword"
                size="small"
              >
                <el-input
                  v-model.trim="dataForm.randomPassword"
                  readonly
                  :disabled="disabled"
                  style="width: 100px"
                />
                <el-button
                  plain
                  :disabled="disabled || sending"
                  @click="refreshCode"
                >
                  {{ refreshCodeOnce ? '生成' : '刷新' }}
                </el-button>
                <template v-if="type === 0">
                  <el-button v-if="!sending" plain @click="sendMsgCode">
                    短信发送
                  </el-button>
                  <span v-else class="countdown">{{ second }}s</span>
                </template>
              </el-form-item>

              <el-form-item label="关联设备">
                <!-- <el-button @click="addObjectFun">
                  添加
                </el-button> -->
                <el-dropdown
                  v-if="type === 1"
                  trigger="click"
                  placement="bottom-start"
                  :disabled="disabled"
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
              </el-form-item>
            </el-col>

            <!-- 头像 -->
            <el-col :span="4">
              <div v-if="type == 1" style="margin-bottom: 5px">
                <el-upload
                  class="avatar-uploader"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img
                    v-if="dataForm.images"
                    :src="
                      dataForm.images.startsWith('http')
                        ? dataForm.images
                        : $window.SITE_CONFIG.cloudUrl + dataForm.images
                    "
                    class="avatar"
                  />
                  <i v-else class="el-icon-picture avatar-uploader-icon" />
                  <!-- <span v-else class="avatar-uploader-icon">上传头像</span> -->
                </el-upload>
              </div>

              <div v-if="type == 0">
                <viewer
                  :images="[dataForm.images ? dataForm.images : imageUrl]"
                >
                  <img
                    :src="
                      dataForm.images
                        ? dataForm.images.startsWith('http')
                          ? dataForm.images
                          : $window.SITE_CONFIG.cloudUrl + dataForm.images
                        : imageUrl
                    "
                    style="width: 163px; height: 163px"
                  />
                </viewer>
              </div>
            </el-col>
          </el-row>

          <!-- TOOD -->

          <el-row>
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
                    v-if="
                      ['2', '3', '11', '12'].includes(String(item1.type)) &&
                      type === 1
                    "
                    :class="[
                      { [$style.position]: item1.isDefault === 1 },
                      { [$style.related_btn]: item1.isDefault === 0 },
                    ]"
                    @click="relatedLocation(item1)"
                  > -->
                  <!-- <span>{{
                      item1.isDefault === 1 ? '已关联' : '关联定位'
                    }}</span> -->
                  <!-- </div> -->
                  <!-- <div
                    v-if="
                      ['2', '3', '11', '12'].includes(String(item1.type)) &&
                      type === 0
                    "
                    :class="[{ [$style.position]: item1.isDefault === 1 }]"
                  > -->
                  <!-- <span>{{ item1.isDefault === 1 ? '已关联' : '' }}</span> -->
                  <!-- </div> -->
                  <div
                    v-if="type === 1"
                    :class="$style.showDelete"
                    @click.stop="deleteDevice(item1)"
                  />
                </div>
              </div>
            </div>
          </el-row>
          <el-row>
            <el-form-item label="关联定位：">
              <el-select
                v-model="positionItem"
                :disabled="disabled"
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
                :disabled="disabled"
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
            </el-form-item>
          </el-row>
        </el-form>
      </el-main>
    </el-container>
    <span v-if="type" slot="footer" class="dialog-footer">
      <el-button plain size="small" @click="visible = false">取消</el-button>
      <el-button type="primary" size="small" @click="dataFormSubmit()"
        >确定</el-button
      >
    </span>
    <!--地图弹窗-->
    <el-dialog title="地图" :visible.sync="dialogVisible" append-to-body>
      <div style="height: 580px">
        <div :style="{ width: '100%', height: '500px', float: 'right' }">
          <el-amap-search-box
            class="search-box"
            :search-option="searchOption"
            :on-search-result="onSearchResult"
          />
          <el-amap
            vid="amapDemo"
            :center="center"
            :zoom="zoom"
            class="amap-demo"
            :events="events"
            :plugin="plugin"
          >
            <el-amap-marker :position="position" :events="events" />
            <el-amap-marker
              v-for="{ position, index } in markers"
              :key="index"
              :position="position"
            />
          </el-amap>
          <div class="toolbar">
            position: [{{ lng }}, {{ lat }}] address: {{ address }}
            <div style="text-align: center">
              <el-button plain size="small" @click="dialogVisible = false">
                取消
              </el-button>
              <el-button
                type="primary"
                size="small"
                @click="LongitudeandLatitude()"
              >
                确定
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!--关联设备弹窗-->
    <deviceDialog
      ref="deviceDialogEl"
      :dialog-title="deviceTitle"
      @selectedList="getDeviceData"
      @mettingDeviceData="mettingDeviceData"
    />
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils';
import Icon from '@/icons';
import deviceDialog from '../resource/deviceDialog.vue';

export default {
  components: {
    deviceDialog,
  },
  props: {
    modifiedUserList: {
      type: Array,
      default: [],
    },
  },
  data() {
    const self = this;
    return {
      numstr: '',
      roleList: [],
      // 表单验证
      sexOptions: [
        {
          value: 0,
          label: '男',
        },
        {
          value: 1,
          label: '女',
        },
        {
          value: 2,
          label: '未知',
        },
      ],
      wxUserOptions: [
        {
          value: 0,
          label: '不关联',
        },
        {
          value: 1,
          label: '关联',
        },
      ],
      wxRoleOptions: [],

      readonly: true,
      // 地图弹窗
      dialogVisible: false,
      // from表单的禁用
      disabled: true,
      // 父子不互相关联的做法
      checkstrictly: true,
      // 默认树形展开
      defaultexpandall: false,
      showcheckbox: true,
      visible: false,
      type: 0,
      // 表单验证
      options: [
        {
          value: 0,
          label: '男',
        },
        {
          value: 1,
          label: '女',
        },
        {
          value: 2,
          label: '未知',
        },
      ],
      // 被勾选的树形节点的id
      Iidoftreenode: [],
      // 高德地图
      markers: [
        [113.3245904, 23.2066805],
        [113.323623, 23.106341],
        [113.325399, 23.106156],
      ],
      searchOption: {
        city: '广州',
        citylimit: false,
      },
      plugin: [
        {
          pName: 'Geolocation',
        },
      ],
      lng: 0,
      lat: 0,
      count: 1,
      slotStyle: {
        padding: '2px 8px',
        background: '#eee',
        color: '#333',
        border: '1px solid #aaa',
      },
      zoom: 12,
      center: [113.3245904, 23.1066805],
      address: '',
      loaded: false,
      // 标记点的位置
      mapCenter: [113.3245904, 23.1066805],
      position: [113.3245904, 23.1066805],
      events: {
        click(e) {
          const { lng, lat } = e.lnglat;
          self.lng = lng;
          self.lat = lat;
          self.position = [lng, lat];
          // 这里通过高德 SDK 完成。
          const geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: 'all',
          });
          geocoder.getAddress([lng, lat], (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              if (result && result.regeocode) {
                self.address = result.regeocode.formattedAddress;
                self.$nextTick();
              }
            }
          });
        },
      },
      /// //////////////////////////////////
      // 联系人数据
      dataForm: {
        // 性别
        sex: 2,
        // id
        id: 0,
        parentId: 0,
        appUser: 1,
        wxUser: 0,
        parentName: '',
        // 姓名
        name: '',
        // 办公室电话
        officeTel: '',
        // 手机
        mobile1: '',
        // 职务
        position: '',
        // 单位
        workUnit: '',
        // 其他号码
        mobile2: '',
        // 家庭电话
        homeTel: '',

        otherTel: '',
        // 邮箱地址
        email: '',
        // 备注
        remark: '',
        // 年龄
        age: '',
        // 是否为常用联系人
        importance: '',
        // 是否为重要联系人
        commonlyUsed: 1,
        // 所在树形id
        groups: [],
        // 经度
        longitude: '',
        // 纬度
        latitude: '',
        // 人物地点
        address: '',
        // 传真号码
        fax: '',
        images: '',
        randomPassword: '',
        // 微信角色
        roleId: '',
        // app角色
        appRoleId: '',
        // 激活微信
        wxActivationPlatform: '',
        // 激活APP
        appActivationPlatform: '',
        // 会议软终端
        meetingDevice: {
          id: '',
          isDefault: 0,
          name: '',
          subscription: 1,
          type: '4',
        },
        ring: 0,
      },
      // 平台
      // platformId: "27",

      // 短信通知标志
      smsNotification: '',

      // 终端类型数据
      platformTypeList: [],
      // 树形
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children',
        disabled: this.disabledFn,
      },
      imageUrl: require('../../../../assets/img/load.jpg'),
      imgUrl: '',
      deviceObj: {
        // 0: '监控视频',
        // 1: '会场终端',
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
      deviceTitle: '',

      // 短信发送状态
      sending: false,
      second: 60,
      countdownTimer: null,

      refreshCodeOnce: true,
      positionItem: 'APP端', // 新增时默认勾选APP，默认定位为App
      positionObj: [
        {
          label: '不关联',
          value: '',
          disabled: false,
        },
        {
          label: 'APP端',
          value: -1,
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
    };
  },
  computed: {
    platformTitle() {
      return this.$store.state.user.platformName;
    },
    diffrencePlatform() {
      if (!this.dataForm.appActivationPlatform) {
        return false;
      }
      return (
        this.dataForm.appUser &&
        this.platformTitle !== this.dataForm.appActivationPlatform
      );
    },
    rules() {
      const validatePhone = (rule, value, callback) => {
        if (this.dataForm.appUser && !value) {
          callback(new Error('你已开启"激活APP",请输入手机号码'));
        } else {
          callback();
        }
      };
      const validatePhoneOrHomeTel = (rule, value, callback) => {
        const hometelReg =
          /^(?:(?:\d{3}-)?\d{8}|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$/;
        const phoneReg = /^1[3456789]\d{9}$/;
        if (hometelReg.test(value) || phoneReg.test(value)) {
          callback();
        } else if (
          (value && !hometelReg.test(value)) ||
          (value && !phoneReg.test(value))
        ) {
          callback(new Error('请输入正确的手机号码或者座机'));
        } else {
          callback();
        }
      };
      return {
        name: [
          {
            required: true,
            message: '请输入姓名',
            trigger: ['blur', 'change'],
          },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 5 个字符',
            trigger: 'blur',
          },
        ],
        mobile1: [
          { validator: validatePhone, trigger: 'blur' },
          {
            min: 11,
            max: 11,
            message: '请输入正确的手机号码',
            trigger: ['blur', 'change'],
          },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '手机号格式不对',
            trigger: ['blur', 'change'],
          },
        ],
        mobile2: [
          {
            validator: validatePhoneOrHomeTel,
            trigger: ['blur', 'change'],
          },
        ],
        officeTel: [
          {
            validator: validatePhoneOrHomeTel,
            trigger: ['blur', 'change'],
          },
        ],
        homeTel: [
          {
            pattern: /^(?:(?:\d{3}-)?\d{8}|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$/,
            // message: "请输入正确的座机号如:0000-0000000",
            // type: 'number',
            message: '请输入正确的座机号如:0000-00000000',
            trigger: ['blur', 'change'],
          },
        ],
      };
    },
  },
  watch: {
    showDeviceData: {
      handler(newVal, oldVal) {
        this.showDeviceData = newVal;
      },
      deep: true,
    },
    dataForm: {
      handler(newVal, oldVal) {
        if (!newVal.appUser && !newVal.wxUser) {
          newVal.randomPassword = '';
          this.refreshCodeOnce = true;
        }
        // 取消激活APP，关联定位的APP端选项不可选
        if (!newVal.appUser) {
          if (this.positionItem === 'APP端') {
            this.positionItem = '不关联';
          }
          this.positionObj[1].disabled = true;
        } else {
          this.positionObj[1].disabled = false;
        }
      },
      deep: true,
    },
    visible(newVal) {
      if (newVal) {
        this.refreshCodeOnce = true;
        if (this.countdownTimer) {
          clearInterval(this.countdownTimer);
          this.countdownTimer = null;
          this.sending = false;
          this.second = 60;
        }
      } else {
        this.$nextTick(() => {
          Object.assign(this.$data, this.$options.data());
        });
      }
    },
    // 集群终端数据监听
    'showDeviceData.colony': {
      handler(newV) {
        // 若选择了集群终端设备，关联定位中集群终端选项可选
        if (newV.length > 0) {
          this.positionObj[2].disabled = false;
        } else {
          // 没有集群终端设备，关联定位不可关联集群终端
          if (this.positionItem === '集群终端') {
            this.positionItem = '不关联';
          }
          // 关联定位中集群终端选项不可选
          if (this.positionObj[2]) {
            this.positionObj[2].disabled = true;
          }
        }
        this.positionSecondObj = newV; // 更新分组
      },
      deep: true,
    },
    // 'showDeviceData.wecomm': {
    //   handler(newV) {
    //     if (newV.length > 0) {
    //       this.positionObj[3].disabled = false;
    //     } else {
    //       if (this.positionItem === 'WeComm') {
    //         this.positionItem = '不关联';
    //       }
    //       this.positionObj[3].disabled = true;
    //     }
    //   },
    //   deep: true,
    // },
  },
  created() {
    this.iconList = Icon.getNameList();
    this.getRoleOptions();
    this.getRoleList();
  },
  methods: {
    mettingDeviceData(data) {
      Object.assign(this.dataForm.meetingDevice, data[data.length - 1]);
    },
    // 刷新随机验证码
    refreshCode() {
      this.refreshCodeOnce = false;
      const arr = [];

      for (let i = 0; i < 5; i++) {
        let r_n = Math.floor(Math.random() * 10);
        while (i === 0 && r_n === 0) {
          r_n = Math.floor(Math.random() * 10);
        }
        arr.push(r_n);
      }
      this.dataForm.randomPassword = arr.join('');
    },

    // 短信发送验证码
    sendMsgCode() {
      if (this.type === 1) return;
      if (!this.dataForm.mobile1) {
        this.$message.error('该联系人未设置手机号码，无法发送短信');
        return;
      }
      if (!this.dataForm.randomPassword) {
        this.$message.error('未生成随机码，无法发送短信');
        return;
      }
      if (!this.sending) {
        this.$http({
          url: `${window.SITE_CONFIG.cloudUrl}/event/eos/communication/sms/addSmsQueue`,
          method: 'post',
          data: this.$http.adornData({
            content: `尊敬的用户，您的随机登录码为${this.dataForm.randomPassword}`,
            phoneNum: this.dataForm.mobile1,
            contactorIds: this.dataForm.id,
          }),
        }).then((res) => {
          if (res.data.errorcode === 0) {
            this.$message.success('随机登录码发送成功');
          } else {
            this.$message.error('随机登录码发送失败');
          }
        });
      }
      this.sending = true;

      this.countdownTimer = setInterval(() => {
        this.second--;
        if (this.second <= 0) {
          clearInterval(this.countdownTimer);
          this.countdownTimer = null;
          this.sending = false;
          this.second = 60;
        }
      }, 1000);
    },

    getRoleOptions() {
      this.$http({
        url: this.$http.adornUrl('/sys/role/select'),
        method: 'get',
        params: this.$http.adornParams({
          terminal: '1',
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.wxRoleOptions = data.list;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    disabledFn(data, node) {
      // console.log("disabled函数: ", data, node);
      if (this.type == 0) {
        // 根据自己的节点数据条件设置判断，我只提供了个参考
        return true;
      }
      return false;
    },
    init(id, type) {
      console.log('type', type);
      this.getRoleList();
      this.dataForm.id = id;
      this.showDeviceData = {
        monitor: [],
        room: [],
        colony: [],
        wecomm: [],
        app: [],
      };
      this.type = type;
      // console.log(type)
      this.$http({
        url: this.$http.adornUrl('/mail/mailgroup/list'),
        method: 'get',
        params: this.$http.adornParams(),
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            // 树形数据
            // console.log(data);
            // this.menuList = treeDataTranslate(data.data, 'id');
            this.menuList = this.modifiedUserList;
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {
          if (type === 0) {
            // 查询
            this.disabled = true;
            this.$http({
              url: this.$http.adornUrl(`/mail/mailcontactor/info/${id}`),
              method: 'post',
              data: this.$http.adornData({}),
            }).then(({ data }) => {
              if (data && data.code === 0) {
                // console.log(data);
                // 查询数据获取
                // for (let i = 0; i < data.mailContactor.groups.length; i++) {
                //   var arr = data.mailContactor.groups[i];
                // }
                this.visible = true;
                // this.dataForm.groups = arr;
                data.mailContactor.urgentContactorNameMobile =
                  data.mailContactor.urgentContactorName === null
                    ? ''
                    : `${data.mailContactor.urgentContactorName},${data.mailContactor.urgentContactorMobile1}`;
                Object.assign(this.dataForm, data.mailContactor);

                this.dataForm.appUser = !!this.dataForm.appUser;
                this.dataForm.wxUser = !!this.dataForm.wxUser;
                this.positioningDevice(this.dataForm.positioningDeviceType);
                this.positionSecondItem = this.dataForm.positioningDeviceName;
                this.positionSelectItem.id = this.dataForm.positioningDeviceId;
                this.dataForm.roleId =
                  data.mailContactor.roleEntity &&
                  data.mailContactor.roleEntity.roleId;
                this.dataForm.appRoleId =
                  data.mailContactor && data.mailContactor.appRoleId;
                data.resources.forEach((item) => {
                  // 设备软终端处理
                  if (item.type === 13) {
                    this.dataForm.meetingDevice = {
                      id: item.data[item.data.length - 1].entity.id,
                      isDefault: item.data[item.data.length - 1].isDefault,
                      name: item.data[item.data.length - 1].entity.name,
                      type: '4',
                    };
                  } else {
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
                      console.log(item1);
                    });
                  }
                });
                // console.log(this.dataForm.groups);
              } else {
                this.$message.error(data.msg);
              }
            });
          } else if (type === 1) {
            // 修改
            this.disabled = false;
            const { id } = this.dataForm;
            this.$http({
              url: this.$http.adornUrl(`/mail/mailcontactor/info/${id}`),
              method: 'post',
              data: this.$http.adornData({}),
            }).then(({ data }) => {
              // console.log("联系人信息", data);
              if (data && data.code === 0) {
                // 修改数据获取
                // for (let i = 0; i < data.mailContactor.groups.length; i++) {
                //   var arr = data.mailContactor.groups[i];
                // }
                this.visible = true;
                // this.dataForm.groups = arr;
                Object.assign(this.dataForm, data.mailContactor);

                this.dataForm.appUser = !!this.dataForm.appUser;
                this.dataForm.wxUser = !!this.dataForm.wxUser;
                this.positioningDevice(this.dataForm.positioningDeviceType);
                this.positionSecondItem = this.dataForm.positioningDeviceName;
                this.positionSelectItem.id = this.dataForm.positioningDeviceId;
                this.dataForm.roleId =
                  data.mailContactor.roleEntity &&
                  data.mailContactor.roleEntity.roleId;
                this.dataForm.appRoleId =
                  data.mailContactor && data.mailContactor.appRoleId;
                data.resources.forEach((item) => {
                  // 设备软终端处理
                  if (item.type === 13) {
                    this.dataForm.meetingDevice = {
                      id: item.data[item.data.length - 1].entity.id,
                      isDefault: item.data[item.data.length - 1].isDefault,
                      name: item.data[item.data.length - 1].entity.name,
                      type: '4',
                    };
                  } else {
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
                      console.log(item1);
                    });
                  }
                });
                // console.log(this.dataForm);
              } else {
                this.$message.error(data.msg);
              }
            });
            this.returnAppAvaidNumberStr();
          }
        });
    },
    // 地图搜索回调事件
    onSearchResult(pois) {
      let latSum = 0;
      let lngSum = 0;
      if (pois.length > 0) {
        pois.forEach((poi) => {
          const { lng, lat } = poi;
          lngSum += lng;
          latSum += lat;
          this.center = [poi.lng, poi.lat];
          this.lng = poi.lng;
          this.lat = poi.lat;
          this.address = pois[0].name;
        });
        const center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length,
        };
        this.position = [center.lng, center.lat];
        this.center = [center.lng, center.lat];
      }
    },
    // 地图事件
    mounted() {
      loadPromise.then(() => {
        // console.log("-----");
        this.map = new AMap.Map('amap-demo1', {
          center: [121.59996, 31.197646],
          zoom: 12,
        });
        AMapUI.loadUI(['overlay/SimpleMarker'], (SimpleMarker) => {
          const marker = new SimpleMarker({
            iconLabel: 'A',
            iconStyle: 'red',
            map: this.map,
            position: this.map.getCenter(),
          });
        });
      });
    },
    // 地图提交
    LongitudeandLatitude() {
      // 经度赋值
      this.dataForm.longitude = this.lng;
      // 纬度赋值
      this.dataForm.latitude = this.lat;
      this.dataForm.address = this.address;
      this.dialogVisible = false;
    },
    // 点击树形的复选框
    Treecheckbox(checkedNodes, checkedKeys) {
      // console.log(checkedKeys.checkedKeys);
      this.dataForm.groups = checkedKeys.checkedKeys;
    },
    // 点击树形节点事件
    handleNodeClick(obj) {
      // console.log("树形结点点击事件", obj);
      const arr = [];
      arr.push(obj.id);
      this.currentTreeObject = arr;
      // 查询对就的预案
    },
    // 表单提交
    dataFormSubmit() {
      const params = {
        related: [],
      };
      let isSecondItem = 0;
      for (const k in this.showDeviceData) {
        this.showDeviceData[k].forEach((item) => {
          const o = {};
          const value = item;
          if (value) {
            o.resoureId = value.id;
            o.type = parseInt(value.type, 10) + 9;
            o.isDefault = value.isDefault;
            params.related.push(o);
          }
        });
      }
      if (this.dataForm.appUser) {
        if (this.dataForm.meetingDevice.id) {
          params.related.push({
            resoureId: this.dataForm.meetingDevice.id,
            type: parseInt(this.dataForm.meetingDevice.type, 10) + 9,
            isDefault: this.dataForm.meetingDevice.isDefault,
          });
        }
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
      if (this.dataForm.groups.length === 0) {
        this.$message({
          message: '请选择一个分组',
          type: 'warning',
        });
      } else {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            // 设备对应的类型类型
            let positioningDeviceType = null;
            if (this.positionItem === '集群终端') {
              positioningDeviceType = 11;
            }
            if (this.positionItem === 'WeComm') {
              positioningDeviceType = 12;
            }
            // APP端或不关联设备时没有二级菜单，没有设备名和id
            if (
              this.positionItem === '不关联' ||
              this.positionItem === 'APP端'
            ) {
              this.dataForm.positioningDeviceName = null;
              this.dataForm.positioningDeviceId = null;
            } else {
              this.dataForm.positioningDeviceId = this.positionSelectItem.id;
            }
            // 一级菜单对应类型ID
            this.dataForm.positioningDeviceType =
              this.positionItem === 'APP端' ? -1 : positioningDeviceType;
            this.$http({
              url: this.$http.adornUrl('/mail/mailcontactor/update'),
              method: 'post',
              data: this.$http.adornData(
                {
                  ...this.dataForm,
                  appUser: this.dataForm.appUser ? 1 : 0,
                  wxUser: this.dataForm.wxUser ? 1 : 0,
                  params,
                },
                false,
              ),
            }).then(({ data }) => {
              if (data && data.code === 0) {
                // console.log("data",data);
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                });
                this.visible = false;
                this.dataForm.images = '';
                this.$emit('refreshDataList');
              } else {
                this.$message.error(data.msg);
              }
            });
          }
        });
      }
    },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const form = new FormData();
      form.append('file', file);
      this.$http({
        baseURL: window.SITE_CONFIG.fileupload,
        url: '/scgMailContactor/uploadImg',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: form,
      })
        .then(({ data }) => {
          // console.log(
          //   "data++++++++++++++++++++++++++++++++++++++",
          //   this.imageUrl
          // );
          if (data && data.errorcode === 0) {
            this.imgUrl = data.data.url;
            this.dataForm.images = this.imgUrl;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch((err) => {});
    },
    // 获取角色列表
    getRoleList() {
      this.$http({
        baseURL: window.SITE_CONFIG.cloudUrl,
        url: '/ser/sys/role/roleList',
        method: 'get',
        params: {
          terminal: 2,
        },
      }).then((res) => {
        this.roleList = res.data.page.list;
      });
    },

    // 重新生成
    smsNotificationBtn() {
      if (this.smsNotification == 1) {
        // 重新获取
        const num = Math.ceil(Math.random() * 100000);
        // 更改数据库
        // console.log("重新获取",this.dataForm.id)
        // 根据id，改变密码
        this.$http({
          url: this.$http.adornUrl(
            '/mail/mailcontactor/updateRandomPasswordById',
          ),
          method: 'post',
          params: this.$http.adornParams({
            id: this.dataForm.id,
            randomPassword: num,
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '更改成功',
              type: 'success',
              duration: 1000,
            });
          } else {
            this.$message.error(data.msg);
          }
          this.dataForm.randomPassword = num;
        });
      } else if (this.smsNotification == 2) {
        // 重新发送
        if (!this.dataForm.mobile1) {
          this.$message({
            message: '请填写手机号',
            type: 'warning',
          });
          return;
        }

        if (!this.dataForm.randomPassword) {
          this.$message({
            message: '请生成随机密码',
            type: 'warning',
          });
          return;
        }

        this.$http({
          url: this.$http.adornUrl(
            '/mail/mailcontactor/sendNoticeRandomPassword',
          ),
          method: 'post',
          params: this.$http.adornParams({
            phone: this.dataForm.mobile1,
            content: `您的随机密码是：${this.dataForm.randomPassword},请保存`,
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '发送成功',
              type: 'success',
              duration: 1000,
            });
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    // 添加关联对象
    handleCommand(command, isMettingDevice = false) {
      if (typeof isMettingDevice !== 'boolean') {
        this.deviceTitle = this.deviceObj[command];
        this.$refs.deviceDialogEl.loadingPopup();
        const arrType = this.deviceTypeObj[command];
        this.$refs.deviceDialogEl.isMettingismDevice = false;
        this.$refs.deviceDialogEl.initData(
          command,
          this.showDeviceData[arrType],
        );
      } else {
        this.deviceTitle = '软终端设备';
        this.$refs.deviceDialogEl.isMettingismDevice = true;
        this.$refs.deviceDialogEl.loadingPopup();
        this.$refs.deviceDialogEl.initData('4', []);
      }
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
        // this.showDeviceData.wecomm.forEach((v) => (v.isDefault = 0));
      } else {
        this.showDeviceData.colony.forEach((v) => (v.isDefault = 0));
        // this.showDeviceData.wecomm.forEach(
        //   (v) => (v.isDefault = v.id === item.id ? 1 : 0),
        // );
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
    positionChange() {
      console.log(this.positionItem);
      if (this.positionItem === '集群终端') {
        console.log(this.showDeviceData.colony);
        this.positionSecondObj = this.showDeviceData.colony;
        this.positionSecondItem = '';
      }
      if (this.positionItem === 'WeComm') {
        console.log(this.showDeviceData.wecomm);
        this.positionSecondObj = this.showDeviceData.wecomm;
        this.positionSecondItem = '';
      }
    },
    positionSecondChange(item) {
      this.positionSelectItem = item;
    },
    positioningDevice(id) {
      switch (id) {
        case -1:
          this.positionItem = 'APP端';
          break;
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
    // 返回可激活名额
    returnAppAvaidNumberStr() {
      this.$api.getAppPeopleNumber().then((res) => {
        if (res.denominator === -1) {
          this.numstr = '(激活名额/无限制)';
        } else {
          this.numstr = `（激活名额${res.data.molecular}/${res.data.denominator}`;
        }
      });
    },
  },
};
</script>

<style lang="scss">
.search-box {
  z-index: 55;
  position: absolute;
  top: 100px;
  left: 40px;
}

.avatar-uploader .el-upload {
  width: 165px;
  height: 165px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 165px;
  color: #8c939d;
  width: 165px;
  height: 165px;
  line-height: 165px;
  text-align: center;
}
.avatar {
  width: 165px;
  height: 165px;
  display: block;
}
.demo-ruleForm {
  .countdown {
    text-align: center;
    line-height: 40px;
    padding: 7px 30px;
    background: #d7d7d7;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 20px;
  }
  .app-box {
    width: fit-content;
    text-align: center;
    border: 1px dashed #0091ff;
    padding: 0 27px;
    cursor: pointer;
    position: relative;
    .close-btn {
      position: absolute;
      right: 3px;
      top: 0;
    }
  }
}
</style>

<style lang="scss" module>
.select_role {
  position: absolute;
  top: 0;
  right: 0;
}
.newcontacts {
  height: 500px;
  & :global(.el-main) {
    overflow-y: auto;

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
  }
}
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
