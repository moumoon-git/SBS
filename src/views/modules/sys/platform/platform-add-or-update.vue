<template>
  <el-dialog
    :title="!dataForm.platformId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :width="isInput ? '1000px' : '1300px'"
  >
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="80px"
      @keyup.enter.native="dataFormSubmit()"
    >
      <el-row>
        <el-col
          v-if="isInput"
          :span="12"
        >
          <el-form-item
            label="平台名称"
            prop="platformName"
          >
            <el-input
              v-model="dataForm.platformName"
              placeholder="平台名称"
            />
          </el-form-item>

          <el-form-item
            label="平台标题"
            prop="platformTitle"
          >
            <el-input
              v-model="dataForm.platformTitle"
              class="platformTitle"
              placeholder="平台标题"
            />
          </el-form-item>

          <el-form-item label="标题颜色">
            <div class="block">
              <el-color-picker
                v-model="dataForm.titleColor"
                @change="handleChangeColor"
              />
            </div>
            <!--<div>
          <colorPicker v-model="dataForm.titleColor" @change="handleChangeColor" style="z-index: 2000;width: 230px"></colorPicker>
            </div>-->
          </el-form-item>

          <el-form-item label="背景图片">
            <el-upload
              class="picture-card"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-preview="handlePictureCardPreview"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="dataForm.backgroundImage"
                :src="
                  dataForm.backgroundImage.startsWith('http')
                    ? dataForm.backgroundImage
                    : $window.SITE_CONFIG.cloudUrl + dataForm.backgroundImage
                "
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              />
            </el-upload>
          </el-form-item>

          <el-form-item label="启动动画">
            <template>
              <el-radio
                v-model="dataForm.animationFlag"
                label="1"
              >
                是
              </el-radio>
              <el-radio
                v-model="dataForm.animationFlag"
                label="0"
              >
                否
              </el-radio>
            </template>
          </el-form-item>

          <!-- <el-form-item label="显示LOGO">
            <template>
              <el-radio
                v-model="dataForm.isLogo"
                label="1"
              >
                是
              </el-radio>
              <el-radio
                v-model="dataForm.isLogo"
                label="0"
              >
                否
              </el-radio>
            </template>
          </el-form-item> -->

          <el-form-item
            label="平台类型"
            prop="typeId"
          >
            <el-select
              v-model="dataForm.typeId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in platformTypeList"
                :key="item.id"
                :label="item.typeName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="所属镇街">
            <el-select
              v-model="dataForm.townId"
              placeholder="请选择"
              @change="changeTownValue"
            >
              <el-option
                v-for="item in townList"
                :key="item.id"
                :label="item.townName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            v-if="dataForm.typeId === 6"
            label="所属学段"
          >
            <el-select
              v-model="dataForm.periodId"
              placeholder="请选择"
              @change="changePeriodValue"
            >
              <el-option
                v-for="item in periodList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            v-if="isAuth('sys:platform:save')"
            label="上级平台"
          >
            <el-popover
              ref="platFormListPopover"
              placement="bottom-start"
              trigger="click"
            >
              <el-tree
                ref="platFormListTree"
                :data="platFormList"
                :props="platFormListTreeProps"
                node-key="id"
                :default-expand-all="true"
                :auto-expand-parent="true"
                :highlight-current="true"
                :expand-on-click-node="false"
                @current-change="platFormListTreeCurrentChangeHandle"
              />
            </el-popover>
            <el-input
              v-model="dataForm.platformParentName"
              v-popover:platFormListPopover
              :readonly="true"
              placeholder="点击上级平台"
              class="menu-list__input"
            />
          </el-form-item>

          <!--<el-form-item  label="平台图标" prop="icon">
        <el-row>
          <el-col :span="22">
            <el-popover
              ref="iconListPopover"
              placement="bottom-start"
              trigger="click"
              popper-class="mod-menu__icon-popover">
              <div class="mod-menu__icon-inner">
                <div class="mod-menu__icon-list">
                  <el-button
                    v-for="(item, index) in iconList"
                    :key="index"
                    @click="iconActiveHandle(item)"
                    :class="{ 'is-active': item === dataForm.icon }">
                    <icon-svg :name="item"></icon-svg>
                  </el-button>
                </div>
              </div>
            </el-popover>
            <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="true" placeholder="平台图标名称" class="icon-list__input"></el-input>
          </el-col>
          <el-col :span="2" class="icon-list__tips">
            <el-tooltip placement="top" effect="light">
              &lt;!&ndash;<div slot="content">全站推荐使用SVG Sprite, 详细请参考:<a href="//github.com/daxiongYang/renren-fast-vue/blob/master/src/icons/index.js" target="_blank">icons/index.js</a>描述</div>
              <i class="el-icon-warning"></i>&ndash;&gt;
            </el-tooltip>
          </el-col>
        </el-row>
          </el-form-item>-->

          <el-form-item label="地址">
            <el-input
              v-model="dataForm.address"
              placeholder="地址"
              style="width: 78%"
            />
            <el-button
              type="text"
              icon="el-icon-location-outline"
              @click="mapDialogVisible = true"
            >
              定位
            </el-button>
          </el-form-item>
          <el-form-item label="App激活名额">
            <template>
              <el-radio-group
                v-model="dataForm.isStartApp"
                @change="changeAppNum"
              >
                <el-radio :label="0">
                  不限额
                </el-radio>
                <el-radio :label="1">
                  固定名额
                </el-radio>
              </el-radio-group>
              <!-- <el-radio v-model="dataForm.isStartApp" label="0">不限制</el-radio>
              <el-radio v-model="dataForm.isStartApp" label="1" >固定名额</el-radio> -->
              <el-input-number
                v-if="dataForm.isStartApp===1"
                v-model="dataForm.appNumber"
                placeholder="请输入可激活名额数量(纯数字整数)"
                type="number"
                :controls="false"
              />
            </template>
          </el-form-item>
          <el-form-item label="关联设备">
            <el-dropdown
              trigger="click"
              placement="bottom-start"
              @command="handleCommand"
            >
              <el-button plain>
                增加
              </el-button>
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
                  <div
                    v-if="
                      ['2', '3', '11', '12'].includes(String(item1.type)) &&
                        type === 1
                    "
                    :class="[
                      { [$style.position]: item1.isDefault === 1 },
                      { [$style.related_btn]: item1.isDefault === 0 },
                    ]"
                    @click="relatedLocation(item1)"
                  >
                    <!-- <span>{{
                      item1.isDefault === 1 ? '已关联' : '关联定位'
                    }}</span> -->
                  </div>
                  <div
                    v-if="
                      ['2', '3', '11', '12'].includes(String(item1.type)) &&
                        type === 0
                    "
                    :class="[{ [$style.position]: item1.isDefault === 1 }]"
                  >
                    <!-- <span>{{ item1.isDefault === 1 ? '已关联' : '' }}</span> -->
                  </div>
                  <div
                    :class="$style.showDelete"
                    @click.stop="deleteDevice(item1)"
                  />
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="直播参数">
             <el-input
              v-model="dataForm.imAppId"
              class="liveStream"
              style="width: 180px"
              placeholder="请输入腾讯IM账号"
            />
            <el-input
              v-model="dataForm.imSecretKey"
              class="liveStream"
              style="width: 190px"
              placeholder="请输入腾讯IM密钥"
            />
          </el-form-item>
          <el-form-item label="录播参数">
             <el-input
              v-model="dataForm.txyunSecretId"
              class="liveStream"
              style="width: 180px"
              placeholder="请输入腾讯云账户"
            />
            <el-input
              v-model="dataForm.txyunSecretKey"
              class="liveStream"
              style="width: 190px"
              placeholder="请输入腾讯云密钥"
            />
          </el-form-item>
          <el-dialog
            title="地图"
            :visible.sync="mapDialogVisible"
            append-to-body
          >
            <div style="height: 700px">
              <Location
                :address="dataForm.address"
                :lng-lat="[dataForm.longitude, dataForm.latitude]"
                :cgcsLngLatInit="[dataForm.cgcsLongitude, dataForm.cgcsLatitude]"
                @confirm="LongitudeandLatitude"
              />
            </div>
          </el-dialog>
        </el-col>
        <el-col :span="isInput ? 12 : 8">
          <el-tabs
            v-model="activeName"
            style="min-width: 121px"
            @tab-click="tabHandleClick"
          >
            <el-tab-pane
              label="PC端"
              name="0"
            >
              <el-form-item
                v-if="isAuth('sys:platform:save')"
                size="mini"
                label="授权"
              >
                <el-tree
                  ref="menuListTree"
                  :data="menuList"
                  :props="menuListTreeProps"
                  node-key="menuId"
                  :default-expand-all="true"
                  show-checkbox
                />
              </el-form-item>
            </el-tab-pane>
            <!-- <el-tab-pane
              label="微信端"
              name="1"
            >
              <el-form-item
                v-if="isAuth('sys:platform:save')"
                size="mini"
                label="授权"
              >
                <el-tree
                  ref="menuListTree2"
                  :data="menuList2"
                  :props="menuListTreeProps"
                  node-key="menuId"
                  :default-expand-all="true"
                  show-checkbox
                />
              </el-form-item>
            </el-tab-pane> -->
             <el-tab-pane
              label="App端"
              name="2"
            >
              <el-form-item
                v-if="isAuth('sys:platform:save')"
                size="mini"
                label="授权"
              >
                <el-tree
                  ref="menuListTree3"
                  :data="menuList3"
                  :props="menuListTreeProps"
                  node-key="menuId"
                  :default-expand-all="true"
                  show-checkbox
                />
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col
          v-if="!isInput"
          :span="16"
        >
          <el-tabs
            v-model="platformActiveName"
            style="min-width: 121px"
            @tab-click="platformTabHandleClick"
          >
            <el-tab-pane
              label="PC端"
              name="0"
            >
              <el-col :gutter="20">
                <el-col
                  :span="8"
                  class="roleTree"
                >
                  <el-aside width="302px">
                    <el-tree
                      ref="sysplatformListTree"
                      :data="sysplatformList"
                      :props="sysplatformListTreeProps"
                      node-key="id"
                      show-checkbox
                      @node-click="handleNodeClick"
                    />
                  </el-aside>
                </el-col>

                <el-col :span="16">
                  <el-table
                    ref="roleListRef"
                    :data="roleList"
                    border
                    style="width: 100%"
                    @select="pushDataId"
                    @select-all="selectAll"
                  >
                    <el-table-column
                      type="selection"
                      header-align="center"
                      align="center"
                      width="50"
                    />
                    <el-table-column
                      prop="roleId"
                      header-align="center"
                      align="center"
                      width="80"
                      label="ID"
                    />
                    <el-table-column
                      prop="roleName"
                      header-align="center"
                      align="center"
                      label="角色名称"
                    />
                  </el-table>

                  <el-pagination
                    :current-page="pageIndex"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    :total="totalPage"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="sizeChangeHandle"
                    @current-change="currentChangeHandle"
                  />
                </el-col>
              </el-col>
            </el-tab-pane>
            <el-tab-pane
              label="微信端"
              name="1"
            >
              <el-col :gutter="20">
                <el-col
                  :span="8"
                  class="roleTree"
                >
                  <el-aside width="302px">
                    <el-tree
                      ref="sysplatformListTree2"
                      :data="sysplatformList2"
                      :props="sysplatformListTreeProps"
                      node-key="id"
                      show-checkbox
                      @node-click="handleNodeClick"
                    />
                  </el-aside>
                </el-col>

                <el-col :span="16">
                  <el-table
                    ref="roleListRef2"
                    :data="roleList"
                    border
                    style="width: 100%"
                    @select="pushDataId"
                    @select-all="selectAll"
                  >
                    <el-table-column
                      type="selection"
                      header-align="center"
                      align="center"
                      width="50"
                    />
                    <el-table-column
                      prop="roleId"
                      header-align="center"
                      align="center"
                      width="80"
                      label="ID"
                    />
                    <el-table-column
                      prop="roleName"
                      header-align="center"
                      align="center"
                      label="角色名称"
                    />
                  </el-table>

                  <el-pagination
                    :current-page="pageIndex"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    :total="totalPage"
                    layout="total, sizes, prev, pager, next, jumper"
                    @size-change="sizeChangeHandle"
                    @current-change="currentChangeHandle"
                  />
                </el-col>
              </el-col>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
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
      <!-- <el-upload
        :with-credentials="true"
        :show-file-list="false"
        :on-progress="beforeUploadFile"
        :on-error="handleError"
        :on-success="handleAvatarSuccess"
        :action="documenttoken"
        style="display: inline-flex; margin: 0 10px;"
      >
        <el-tooltip placement="top" effect="light">
          <div slot="content">
            请填写我们提供
            <br />的模板进行导入
          </div>
          <el-button
            ref="importButton"
            v-loading.fullscreen.lock="fullscreenLoading"
            element-loading-text="正在导入平台信息，可能需要几分钟时间，请耐心等待.."
            plain
          >
            <img src="../../../../assets/img/upload.svg" />
            导入
          </el-button>
        </el-tooltip>
      </el-upload>-->
    </span>
    <deviceDialog
      ref="deviceDialogEl"
      :dialog-title="deviceTitle"
      :selectedOne="true"
      @selectedList="getDeviceData"
      @mettingDeviceData="mettingDeviceData"
    />
  </el-dialog>
</template>

<script>
import Location from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/Location.vue';
import { isAuth, treeDataTranslate, platformTreeDataTranslate } from '@/utils';
import deviceDialog from '../resource/deviceDialog.vue';
import Icon from '@/icons';
import $ from 'jquery';

const httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  components: {
    Location,
    deviceDialog,
  },
  data() {
    const self = this;

    const validateUrl = (rule, value, callback) => {
      if (this.dataForm.type === 1 && !/\S/.test(value)) {
        callback(new Error('菜单URL不能为空'));
      } else {
        callback();
      }
    };
    return {
      visible: false,

      activeName: '0',

      // 菜单数据
      dataForm: {
        // 设置颜色
        titleColor: '#47A6FF',
        ancestors: '',
        id: 0,
        type: 1,
        name: '',
        parentId: 0,
        parentName: '',
        url: '',
        perms: '',
        orderNum: 0,

        icon: '',
        iconList: [],

        // 平台数据
        platformId: 0,
        platformTypeId: '',
        platformName: '',
        platformParentId: 0,
        platformParentName: '',

        // 平台类型数据
        typeId: '',
        typeName: '',

        // 平台镇街数据
        townId: '',
        townName: '',

        // 学段数据
        periodId: '',
        periodName: '',

        // 平台标题
        platformTitle: '',

        // 平台背景图片
        backgroundImage: '',

        // 平台背景图片是否启动动画
        animationFlag: '',

        // 是否激活App
        isStartApp: '',

        // 是否显示logo
        isLogo: '',

        // 平台地址
        address: '',

        longitude: 0,
        latitude: 0,
        // 终端类型
        terminal: '0',
        // app激活人数限制
        appNumber: -1, // -1是不限制人数。
        cgcsLongitude: '',
        cgcsLatitude: '',
        // 直播参数
        imAppId: '',
        imSecretKey: '',
        // 录播参数
        txyunSecretId: '',
        txyunSecretKey: '',
      },

      // 平台类型数据
      platformTypeList: [],

      // 平台镇街数据
      townList: [],

      // 学段数据
      periodList: [],

      dataRule: {
        platformName: [
          { required: true, message: '请填写平台名称', trigger: 'blur' },
        ],
        platformTitle: [
          { required: true, message: '请填写平台标题', trigger: 'blur' },
        ],
        typeId: [
          { required: true, message: '请选择平台类型', trigger: 'change' },
        ],
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' },
        ],
        /* parentName: [
            { required: true, message: '上级菜单不能为空', trigger: 'change' }
          ], */
        url: [{ validator: validateUrl, trigger: 'blur' }],
      },
      // 菜单
      menuIdArray: [],
      menuList: [],
      menuList2: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children',
      },
      // 平台树
      sysplatformList: [],
      sysplatformList2: [],
      sysplatformListTreeProps: {
        label: 'platformName',
        children: 'children',
      },
      sysplatformIds: [],
      sysplatformId: '',
      // 角色列表
      roleList: [],
      // roleTreeProps: {
      //   label: "roleName",
      //   children: "children",
      // },
      roleformIds: [],
      roleformId: '',
      platformActiveName: '0',
      // 角色列表分页
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListSelections: [],
      // 平台
      platFormList: [],
      platFormListTreeProps: {
        label: 'platformName',
        children: 'children',
      },
      // 平台地址
      center: [113.3245904, 23.1066805],
      position: [113.3245904, 23.1066805],
      plugin: [{ pName: 'Geolocation' }],
      lng: 0,
      lat: 0,
      address: '',
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
      searchOption: {
        city: '广州',
        citylimit: false,
      },
      // 地图
      mapDialogVisible: false,
      // 是否显示
      isInput: true,
      // 导入加载提示
      fullscreenLoading: false,
      // 获取到的token
      documenttoken: '',
      // 导入选的菜单
      inputMenuList: [],
      deviceObj: {
        0: '监控视频',
        1: '会场终端',
        // 2: '集群终端',
        // 3: 'WeComm',
        // 4: 'APP终端',
      },
      deviceTitle: '',
      deviceTypeObj: {
        0: 'monitor',
        1: 'room',
        // 2: 'colony',
        // 3: 'wecomm',
        // 4: 'app',
      },
      deviceTextArr: [
        'monitor',
        'room',
        // 'colony',
        // 'wecomm',
        // 'app',
      ],
      showDeviceData: {
        monitor: [],
        room: [],
        // colony: [],
        // wecomm: [],
        // app: [],
      },
    };
  },
  created() {
    this.iconList = Icon.getNameList();
    // this.getTreeList();
    // this.getTreeList2();
    this.getsysplatformTree();
    this.getsysplatformTree2();
    this.getRoleList();
  },
  watch: {
    showDeviceData: {
      handler(newVal, oldVal) {
        this.showDeviceData = newVal;
      },
      deep: true,
    },
  },
  methods: {
    // 切换卡片视图
    platformTabHandleClick(tab, event) {
      this.platformActiveName = tab.name;
      this.sysplatformId = '';
      this.roleList = [];
      this.totalPage = 0;
      this.getRoleList();
    },
    // 获取平台列表树
    getsysplatformTree() {
      this.$http({
        url: this.$http.adornUrl(
          `/sys/platform/allList?${this.platformActiveName}`,
        ),
        method: 'get',
      }).then(({ data }) => {
        this.sysplatformList = platformTreeDataTranslate(data.data, 'id');
        // this.platFormList = data.data;
      });
    },
    getsysplatformTree2() {
      this.$http({
        url: this.$http.adornUrl(
          `/sys/platform/allList?${this.platformActiveName}`,
        ),
        method: 'get',
      }).then(({ data }) => {
        this.sysplatformList2 = platformTreeDataTranslate(data.data, 'id');
        // this.platFormList = data.data;
      });
    },
    handleNodeClick(obj) {
      console.log('点击节点', obj);
      this.sysplatformIds = [];
      this.currentTreeObject = obj.id;
      if (obj.id == 0) {
        this.sysplatformIds = [];
      } else {
        this.sysplatformIds = [obj.id];
      }
      this.sysplatformId = obj.id;
      this.getRoleList();
    },
    // 点击平台树获取相应角色
    getRoleList() {
      this.$http({
        url: this.$http.adornUrl('/sys/role/roleList'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          platformId: String(this.sysplatformId),
          terminal: this.platformActiveName,
          roleName: '',
        }),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.roleList = data.page.list;
          this.totalPage = data.page.totalCount;

          this.roleList.forEach((row) => {
            this.dataListSelections.forEach((id) => {
              if (row.roleId == id) {
                if (this.platformActiveName == '0') {
                  this.$nextTick(() => {
                    this.$refs.roleListRef.toggleRowSelection(row, true);
                  });
                } else {
                  this.$nextTick(() => {
                    this.$refs.roleListRef2.toggleRowSelection(row, true);
                  });
                }
              }
            });
          });
        } else {
          this.roleList = [];
          this.totalPage = 0;
          this.$message.error(data.msg);
        }
      });
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 勾选数据
    pushDataId(selection, row) {
      console.log('勾选数据', selection, row, this.dataListSelections);
      if (
        $(':checkbox').is(':checked')
        && this.dataListSelections.indexOf(row.roleId) == -1
      ) {
        this.dataListSelections.push(row.roleId);
      } else {
        const index = this.dataListSelections.indexOf(row.roleId);
        this.dataListSelections.splice(index, 1);
      }
    },
    // 勾选全部数据
    selectAll(rows) {
      this.roleList.forEach((row) => {
        if (
          $(':checkbox').is(':checked')
          && this.dataListSelections.indexOf(row.roleId) == -1
        ) {
          this.dataListSelections.push(row.roleId);
          // console.log("勾选数据", this.dataIds);
        }
        if (
          rows.length == 0
          && this.dataListSelections.indexOf(row.roleId) != -1
        ) {
          const index = this.dataListSelections.indexOf(row.roleId);
          this.dataListSelections.splice(index, 1);
          // console.log("去除数据", this.dataIds);
        }
        // this.$refs.dataTable.toggleRowSelection(row, true);
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // 切换是否限制app激活人数
    changeAppNum(e) {
      console.log(e);
      if (e === 0) {
        this.dataForm.appNumber = -1;
      } else {
        this.dataForm.appNumber = '';
      }
    },
    init(id, isInput) {
      // 清空关联设备数据
      this.showDeviceData = {
        monitor: [],
        room: [],
        // colony: [],
        // wecomm: [],
        // app: [],
      };
      this.dataListSelections = [];
      this.documenttoken = `${httpaddress}/sys/platform/buildPlatform?token=${this.$cookie.get(
        'token',
      )}`;
      this.isInput = isInput;
      this.dataForm.platformId = id || 0;
      console.log('平台id', this.dataForm.platformId);
      this.$http({
        url: this.$http.adornUrl('/sys/platform/list'),
        method: 'get',
        params: this.$http.adornParams({
          terminal: '1',
        }),
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            // 权限数据
            this.menuList2 = treeDataTranslate(data.menuList, 'menuId');
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {
          console.log('platformId', this.dataForm.platformId);
          // 修改
          if (this.dataForm.platformId) {
            this.$http({
              url: this.$http.adornUrl(
                `/sys/platform/info/${this.dataForm.platformId}`,
              ),
              method: 'get',
              params: this.$http.adornParams({
                terminal: '1',
              }),
            }).then(({ data }) => {
              // console.log("info",data);

              if (data && data.code === 0) {
                // 菜单
                const { menuIdList } = data.platForm;

                this.menuIdArray = [];
                for (let i = 0; i < menuIdList.length; i++) {
                  const getMenuId = menuIdList[i].platformMenuId;
                  if (
                    getMenuId != null
                    && getMenuId != ''
                    && getMenuId != undefined
                  ) {
                    this.menuIdArray.push(getMenuId);
                    // 解决同级出现问题

                    // if (this.$refs.menuListTree2) {
                    //   this.$refs.menuListTree2.setChecked(
                    //     getMenuId,
                    //     true,
                    //     false,
                    //   );
                    // }
                  }
                }
                data.resources.forEach((item) => {
                  // 设备软终端处理
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
                });
              } else {
                this.$message.error(data.msg);
              }
            });
          }
        });

        // 获取app授权树
   this.$http({
        url: this.$http.adornUrl('/sys/platform/list'),
        method: 'get',
        params: this.$http.adornParams({
          terminal: '2',
        }),
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            // 权限数据
            this.menuList3 = treeDataTranslate(data.menuList, 'menuId');
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {
          console.log('platformId', this.dataForm.platformId);
          // 修改
          if (this.dataForm.platformId) {
            this.$http({
              url: this.$http.adornUrl(
                `/sys/platform/info/${this.dataForm.platformId}`,
              ),
              method: 'get',
              params: this.$http.adornParams({
                terminal: '2',
              }),
            }).then(({ data }) => {
              // console.log("info",data);

              if (data && data.code === 0) {
                // 菜单
                const { menuIdList } = data.platForm;

                this.menuIdArray = [];
                for (let i = 0; i < menuIdList.length; i++) {
                  const getMenuId = menuIdList[i].platformMenuId;
                  if (
                    getMenuId != null
                    && getMenuId != ''
                    && getMenuId != undefined
                  ) {
                    this.menuIdArray.push(getMenuId);
                    // 解决同级出现问题

                    if (this.$refs.menuListTree3) {
                      this.$refs.menuListTree3.setChecked(
                        getMenuId,
                        true,
                        false,
                      );
                    }
                  }
                }
              } else {
                this.$message.error(data.msg);
              }
            });
          }
        });


      this.$http({
        url: this.$http.adornUrl('/sys/platform/list'),
        method: 'get',
        params: this.$http.adornParams({
          terminal: '0',
        }),
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            // 平台类型
            this.platformTypeList = data.platformTypeList;
            // 平台镇街
            this.townList = data.townList;
            // 学段数据
            this.periodList = data.periodList;
            // 平台数据
            const obj = {
              id: 0,
              parentId: 0,
              platformName: '一级平台',
            };
            data.platFormList.push(obj);
            this.platFormList = platformTreeDataTranslate(
              data.platFormList,
              'id',
            );
            console.log('平台数据', this.platFormList);
            // 权限数据
            // if (this.activeName == "0") {
            this.menuList = treeDataTranslate(data.menuList, 'menuId');
            // } else {
            //   this.menuList2 = treeDataTranslate(data.menuList, "menuId");
            // }
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {
          this.visible = true;
          // this.$nextTick(() => {
          // 菜单表格
          // this.$refs['dataForm'].resetFields()
          // })
        })
        .then(() => {
          if (!this.dataForm.platformId) {
            this.$refs.dataForm.resetFields();
            this.dataForm.imAppId = '';
            this.dataForm.imSecretKey = '';
            this.dataForm.txyunSecretId = '';
            this.dataForm.txyunSecretKey = '';
            // 新增
            this.menuListTreeSetCurrentNode();
            this.platFormListTreeSetCurrentNode();
          } else {
            console.log('platformId', this.dataForm.platformId);
            // 修改
            this.$http({
              url: this.$http.adornUrl(
                `/sys/platform/info/${this.dataForm.platformId}`,
              ),
              method: 'get',
              params: this.$http.adornParams({
                terminal: this.activeName,
              }),
            }).then(({ data }) => {
              // console.log("info",data);

              if (data && data.code === 0) {
                // 平台平台
                this.dataForm.platformId = data.platForm.id;
                this.dataForm.platformTypeId = data.platForm.platformTypeId;
                this.dataForm.platformParentName = data.platForm.parentName;
                this.dataForm.platformParentId = data.platForm.parentId;

                this.dataForm.platformName = data.platForm.platformName;
                this.dataForm.icon = data.platForm.icon;
                this.dataForm.ancestors = data.platForm.ancestors || '';
                this.platFormListTreeSetCurrentNode();

                // 类型
                this.dataForm.typeId = data.platForm.platformTypeId;
                this.dataForm.typeName = data.platForm.type.typeName;

                // 镇街
                this.dataForm.townId = data.platForm.townId;
                this.dataForm.townName = data.platForm.townName;

                // 学段
                this.dataForm.periodId = data.platForm.periodId;
                this.dataForm.periodName = data.platForm.periodName;

                // 标题
                this.dataForm.platformTitle = data.platForm.platformTitle;
                console.log(
                  '标题',
                  data.platForm.platformTitle,
                  this.dataForm.platformTitle,
                );
                // 地址
                this.dataForm.address = data.platForm.address;
                // app激活数目
                this.dataForm.appNumber = data.platForm.appNumber;

                // 经度纬度
                this.dataForm.longitude = data.platForm.longitude;
                this.dataForm.latitude = data.platForm.latitude;

                // 直播参数
                this.dataForm.imAppId = data.platForm.imAppId.trim();
                this.dataForm.imSecretKey = data.platForm.imSecretKey.trim();
                // 录播参数
                this.dataForm.txyunSecretId = data.platForm.txyunSecretId.trim();
                this.dataForm.txyunSecretKey = data.platForm.txyunSecretKey.trim();
                // 颜色
                if (
                  data.platForm.titleColor != null
                  && data.platForm.titleColor != ''
                ) {
                  this.dataForm.titleColor = data.platForm.titleColor;
                  setTimeout(() => {
                    document
                      .querySelector('.platformTitle input')
                      .setAttribute(
                        'style',
                        `color:${data.platForm.titleColor};`,
                      );
                  });
                } else {
                  this.dataForm.titleColor = '#47A6FF';
                  setTimeout(() => {
                    document
                      .querySelector('.platformTitle input')
                      .setAttribute('style', 'color:#47A6FF;');
                  });
                }
                // 背景图片
                this.dataForm.backgroundImage = data.platForm.backgroundImage;
                // 动画
                this.dataForm.animationFlag = `${data.platForm.animationFlag}`;

                // LOGO
                this.dataForm.isLogo = `${data.platForm.isLogo}`;

                // 菜单
                const { menuIdList } = data.platForm;

                this.menuIdArray = [];
                for (let i = 0; i < menuIdList.length; i++) {
                  const getMenuId = menuIdList[i].platformMenuId;
                  if (
                    getMenuId != null
                    && getMenuId != ''
                    && getMenuId != undefined
                  ) {
                    this.menuIdArray.push(getMenuId);
                    // 解决同级出现问题
                    // if (this.activeName == "0") {
                    if (this.$refs.menuListTree) {
                      this.$refs.menuListTree.setChecked(
                        getMenuId,
                        true,
                        false,
                      );
                    }
                    // } else {
                    // if (this.$refs.menuListTree2) {
                    //   this.$refs.menuListTree2.setChecked(
                    //     getMenuId,
                    //     true,
                    //     false
                    //   );
                    // }
                    // }
                  }
                }
              } else {
                this.$message.error(data.msg);
              }
            });
          }
        });
    },
    // 卡片切换
    tabHandleClick(tab, event) {
      this.activeName = tab.name;
      // this.getTreeList();
      // this.init(this.dataForm.platformId);
    },
    // 设置颜色
    handleChangeColor(val) {
      console.log('设置颜色', val);
      this.dataForm.titleColor = val;
      setTimeout(() => {
        document
          .querySelector('.platformTitle input')
          .setAttribute('style', `color:${val};`);
      });
    },

    // 图片上传之前
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
          if (data && data.errorcode === 0) {
            this.dataForm.backgroundImage = data.data.url;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch((err) => {});
    },

    handleAvatarSuccess(res, file) {},

    handleUploading(res, file) {
      // alert("正在上传中");
    },

    handlePictureCardPreview(file, fileList) {
      this.dataForm.backgroundImage = file.url;
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

    // 地图提交
    LongitudeandLatitude(addr, lnglat, spotInfo, cgcs) {
      this.dataForm.longitude = this.lng = lnglat[0];
      this.dataForm.latitude = this.lat = lnglat[1];
      this.dataForm.address = this.address = addr;
      console.log(spotInfo);
      // 大地坐标系
      this.dataForm.cgcsLongitude = cgcs[0];
      this.dataForm.cgcsLatitude = cgcs[1];
      this.mapDialogVisible = false;
    },

    // 菜单树选中
    menuListTreeCurrentChangeHandle(data, node) {
      this.dataForm.parentId = data.menuId;
      this.dataForm.parentName = data.name;
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode() {
      if (this.activeName == '0') {
        this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId);
        this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode()
          || {}).name;
      } 
      // else if(this.activeName == '1') {
      //   this.$refs.menuListTree2.setCurrentKey(this.dataForm.parentId);
      //   this.dataForm.parentName = (this.$refs.menuListTree2.getCurrentNode()
      //     || {}).name;
      // } 
      else {
           this.$refs.menuListTree3.setCurrentKey(this.dataForm.parentId);
          this.dataForm.parentName = (this.$refs.menuListTree3.getCurrentNode()
            || {}).name;
      }
    },

    // 平台菜单树设置当前选中节点
    platFormListTreeSetCurrentNode() {
      if (this.$refs.platFormListTree) {
        this.$refs.platFormListTree.setCurrentKey(
          this.dataForm.platformParentId,
        );
        this.dataForm.platformParentName = (this.$refs.platFormListTree.getCurrentNode() || {}).platformName;
      }
    },

    // 平台菜单树选中
    platFormListTreeCurrentChangeHandle(data, node) {
      // console.logconsole.log("选中上级平台",data);
      this.dataForm.ancestors = `${data.ancestors},${data.id}`;
      // this.dataForm.ancestors=data.id
      this.dataForm.platformParentId = data.id;
      this.dataForm.platformParentName = data.platformName;
    },

    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName;
    },

    // 选择所属镇街
    changeTownValue(value) {
      let obj = {};
      obj = this.townList.find((item) => item.id === value);
      // console.log("town label",obj.townName);
      this.dataForm.townName = obj.townName;
    },

    // 选择镇街
    changePeriodValue(value) {
      let obj = {};
      obj = this.periodList.find((item) => item.id === value);
      // console.log("period label",obj.name);
      this.dataForm.periodName = obj.name;
    },

    // 表单提交
    dataFormSubmit() {
      if (!this.$refs.dataForm.validate()) {
        return;
      }
      console.log(
        '表单提交',
        this.$refs.menuListTree
          ? [].concat(
            this.$refs.menuListTree.getCheckedKeys(),
            this.$refs.menuListTree.getHalfCheckedKeys(),
            // this.$refs.menuListTree2.getCheckedKeys(),
            // this.$refs.menuListTree2.getHalfCheckedKeys(),
          )
          : null,
        this.$refs.sysplatformListTree
          ? [].concat(
            this.$refs.sysplatformListTree.getCheckedKeys(),
            this.$refs.sysplatformListTree.getHalfCheckedKeys(),
            this.$refs.sysplatformListTree2.getCheckedKeys(),
            this.$refs.sysplatformListTree2.getHalfCheckedKeys(),
          )
          : null,
        this.dataListSelections,
      );
      if (!this.isInput) {
        this.$http({
          url: this.$http.adornUrl('/sys/platform/inputMenu'),
          method: 'post',
          data: {
            id: undefined,
            menuList: this.$refs.menuListTree
              ? [].concat(
                this.$refs.menuListTree.getCheckedKeys(),
                this.$refs.menuListTree.getHalfCheckedKeys(),
                // this.$refs.menuListTree2.getCheckedKeys(),
                // this.$refs.menuListTree2.getHalfCheckedKeys(),
                this.$refs.menuListTree3.getCheckedKeys(),
                this.$refs.menuListTree3.getHalfCheckedKeys(),
              )
              : null,
            sysplatformList: this.$refs.sysplatformListTree
              ? [].concat(
                this.$refs.sysplatformListTree.getCheckedKeys(),
                this.$refs.sysplatformListTree.getHalfCheckedKeys(),
                this.$refs.sysplatformListTree2.getCheckedKeys(),
                this.$refs.sysplatformListTree2.getHalfCheckedKeys(),
                this.$refs.sysplatformListTree3.getCheckedKeys(),
                this.$refs.sysplatformListTree3.getHalfCheckedKeys(),
              )
              : null,
            roleList: this.dataListSelections,
          },
        }).then(({ data }) => {
          if (data && data.code == 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
            });
            this.visible = false;
            this.$emit('refreshDataList');
          } else {
            this.$message.error(data.msg);
          }
        });
      } else {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            console.log('this.$refs.menuListTree', this.$refs.menuListTree);
            this.dataForm.ancestors = this.dataForm.ancestors
              .split(',')
              .filter((i) => !Number.isNaN(Number(i)))
              .join(',');
            // 关联设备
            const params = {
              related: [],
            };
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
            this.$http({
              url: this.$http.adornUrl(
                `/sys/platform/${
                  !this.dataForm.platformId ? 'save' : 'update'
                }`,
              ),
              method: 'post',
              data: this.$http.adornData({
                // 终端类型:
                terminal: this.activeName,

                // 平台数据
                id: this.dataForm.platformId || undefined,
                platformName: this.dataForm.platformName,
                parentId: this.dataForm.platformParentId,
                icon: this.dataForm.icon,
                gmtCreate: getFormatDate(),

                // 类型数据
                platformTypeId: this.dataForm.typeId,
                typeName: this.dataForm.typeName,

                // 镇街数据
                townId: this.dataForm.townId,
                townName: this.dataForm.townName,

                // 学段数据
                periodId: this.dataForm.periodId,
                periodName: this.dataForm.periodName,

                // 标题
                platformTitle: this.dataForm.platformTitle,
                // 标题颜色
                titleColor: this.dataForm.titleColor,
                // 背景图片
                backgroundImage: this.dataForm.backgroundImage,
                // 是否启动动画,0是不开启动画，1是开启动画
                animationFlag: this.dataForm.animationFlag,
                // 是否显示logo,0是不显示logo，1是显示logo
                isLogo: this.dataForm.isLogo,
                // 地址
                address: this.dataForm.address,
                // app激活数目
                appNumber: this.dataForm.appNumber,
                // 经度
                longitude: this.dataForm.longitude,
                latitude: this.dataForm.latitude,
                // 菜单数据
                // menuIdList:
                //   this.activeName == "0"
                //     ? this.$refs.menuListTree
                //       ? [].concat(
                //           this.$refs.menuListTree.getCheckedKeys(),
                //           this.$refs.menuListTree.getHalfCheckedKeys()
                //         )
                //       : null
                //     : this.$refs.menuListTree2
                //     ? [].concat(
                //         this.$refs.menuListTree2.getCheckedKeys(),
                //         this.$refs.menuListTree2.getHalfCheckedKeys()
                //       )
                //     : null,
                menuIdList: this.$refs.menuListTree
                  ? [].concat(
                    this.$refs.menuListTree.getCheckedKeys(),
                    this.$refs.menuListTree.getHalfCheckedKeys(),
                    // this.$refs.menuListTree2.getCheckedKeys(),
                    // this.$refs.menuListTree2.getHalfCheckedKeys(),
                    this.$refs.menuListTree3.getCheckedKeys(),
                    this.$refs.menuListTree3.getHalfCheckedKeys(),
                  )
                  : null,
                ancestors: this.dataForm.ancestors,
                // 关联设备
                params,
                imAppId: this.dataForm.imAppId.trim(), // 直播参数id
                imSecretKey: this.dataForm.imSecretKey.trim(), // 直播参数密码
                txyunSecretId: this.dataForm.txyunSecretId.trim(), // 录播参数id
                txyunSecretKey: this.dataForm.txyunSecretKey.trim(), // 录播参数密码
              }),
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false;
                this.$emit('refreshDataList');
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                });
              } else {
                this.$message.error(data.msg);
              }
            });
          }
        });
      }
    },
    // 文件上传时的钩子
    beforeUploadFile(event, file, fileList) {
      this.inputMenuList = this.$refs.menuListTree
        ? [].concat(
          this.$refs.menuListTree.getCheckedKeys(),
          this.$refs.menuListTree.getHalfCheckedKeys(),
          // this.$refs.menuListTree2.getCheckedKeys(),
          // this.$refs.menuListTree2.getHalfCheckedKeys(),
          this.$refs.menuListTree3.getCheckedKeys(),
          this.$refs.menuListTree3.getHalfCheckedKeys(),
        )
        : null;
      this.documenttoken = `${httpaddress}/sys/platform/buildPlatform?ids=${
        this.inputMenuList
      }&&token=${this.$cookie.get('token')}`;
      this.fullscreenLoading = true;
    },
    // 上传失败的回调
    handleError(err, file, fileList) {},
    // 上传成功的回调
    handleAvatarSuccess(response, file, fileList) {
      this.fullscreenLoading = false;
      this.filename = file.name;
      this.search();
      if (file.response.errorData.length == 0) {
        this.$message({
          message: '导入成功!',
          type: 'success',
        });
      } else if (file.response.errorData.length > 0) {
      } else {
        this.$message.error({
          type: 'error',
          message: `${file.response.msg}`,
        });
      }
    },
    // 导入自定义文件上传行为
    uploadSectionFile(param) {
      const form = new FormData();
      form.append('file', param.file);
      this.$http({
        url: this.$http.adornUrl('/sys/platform/buildPlatform'),
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: form,
        menuIdList: this.$refs.menuListTree
          ? [].concat(
            this.$refs.menuListTree.getCheckedKeys(),
            this.$refs.menuListTree.getHalfCheckedKeys(),
            // this.$refs.menuListTree2.getCheckedKeys(),
            // this.$refs.menuListTree2.getHalfCheckedKeys(),
            this.$refs.menuListTree3.getCheckedKeys(),
            this.$refs.menuListTree3.getHalfCheckedKeys(),
          )
          : null,
      })
        .then(({ data }) => {
          if (!data.code) {
            this.$message({
              message: '导入成功!',
              type: 'success',
            });
            this.getDataList();
          } else {
            this.$message.error('只支持导入平台信息文件');
          }
        })
        .catch((err) => {
          // alert(err)
        });
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
    },
    mettingDeviceData(data) {
      Object.assign(this.dataForm.meetingDevice, data[data.length - 1]);
    },
  },
};

// 格式化时间
function getFormatDate() {
  const date = new Date();
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = `0${month}`;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = `0${strDate}`;
  }
  const currentDate = `${date.getFullYear()
  }-${
    month
  }-${
    strDate
  } ${
    date.getHours()
  }:${
    date.getMinutes()
  }:${
    date.getSeconds()}`;
  return currentDate;
};


</script>

<style lang="scss">
.m-colorPicker .box.open {
  width: 220px;
}
.el-tree {
  overflow-y: auto;
  overflow-x: scroll;
  height: 680px;
  //border: 1px solid blue;
}
.mod-menu {
  .menu-list__input,
  .icon-list__input {
    > .el-input__inner {
      cursor: pointer;
    }
  }
  &__icon-popover {
    width: 458px;
    overflow: hidden;
  }
  &__icon-inner {
    width: 478px;
    max-height: 258px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &__icon-list {
    width: 458px;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
  .icon-list__tips {
    font-size: 18px;
    text-align: center;
    color: #e6a23c;
    cursor: pointer;
  }

  .avatar-uploader .el-upload {
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
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
<style lang="scss" module>
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
  margin-top: 10px;
  background: #f2f2f2;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}
.outDiv {
  margin-top: -2px;
  .showDevice {
    display: flex;
    height: 30px;
    line-height: 30px;
    margin: 5px;
    .type {
      width: 110px;
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
