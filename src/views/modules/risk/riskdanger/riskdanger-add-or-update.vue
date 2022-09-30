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
      <el-form-item label="隐患源" prop="source">
        <el-input v-model="dataForm.source" placeholder="隐患源" />
      </el-form-item>
      <el-row>
        <el-col style="width:280px;margin-right:35px;">
          <el-form-item label="辖区范围" prop="jurisdiction">
            <el-cascader
              ref="caseClassId"
              v-model.trim="dataForm.jurisdiction"
              :options="jurisdictionData"
              :props="{
                value: 'id',
                label: 'townName',
                children: 'children',
                checkStrictly: true,
                emitPath: false,
              }"
              clearable
              :show-all-levels="false"
              place-holder="请选择"
            />
          </el-form-item>
        </el-col>
        <el-col style="width:595px;">
          <el-form-item label="隐患地址" prop="address">
            <el-input
              v-model="dataForm.address"
              placeholder="隐患地址"
              style="width: 87%"
            />
            <el-button
              style="width: 12%"
              type="text"
              icon="el-icon-location-outline"
              @click="location"
            >
              定位
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 整改期限(限期整顿时间) -->
      <div class="flexClass" style>
        <el-form-item v-if="dataForm.id" label="整改时间">
          <el-date-picker
            v-model="dataForm.rectificationTime"
            style="width: 200px"
            unlink-panels
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择整改时间"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="整改期限" prop="deadlineForRectification">
          <el-date-picker
            v-model="dataForm.deadlineForRectification"
            style="width: 200px"
            unlink-panels
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择整改期限"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <!-- 可控程度:可控、基本可控、较难控制、基本失控 -->
        <el-form-item label="可控程度" prop="controllability">
          <el-select v-model="dataForm.controllability" placeholder="请选择">
            <el-option
              v-for="item in controllabilityData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- 隐患类型-->
        <el-form-item label="隐患类型" prop="type">
          <!-- <el-input v-model="dataForm.type" placeholder="隐患类型"></el-input>-->
          <!-- <el-select
            v-model="dataForm.type"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in typeData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select> -->
          <el-cascader
            ref="caseClassId"
            v-model.trim="dataForm.type"
            :options="typeData"
            :props="{
              value: 'id',
              label: 'name',
              children: 'children',
              checkStrictly: true,
              emitPath: false,
            }"
            clearable
            :show-all-levels="false"
            place-holder="请选择"
          />
        </el-form-item>
        <!-- 隐患等级: 一般、较大、重大、特别重大 -->
        <el-form-item label="隐患等级">
          <!-- <el-input v-model="dataForm.level" placeholder="隐患等级"></el-input> -->
          <el-select v-model="dataForm.level" placeholder="请选择">
            <el-option
              v-for="item in levelData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- 通知人的id:从通讯录中选择一个人儿 -->
        <el-form-item
          style="width: 280px"
          label="联系人"
          prop="notificationObjectName"
        >
          <el-input
            v-model="dataForm.notificationObjectName"
            placeholder="联系人"
            @focus="handleInform('notificationObjectName')"
          />
        </el-form-item>
        <el-form-item
          style="width: 280px"
          label="联系人手机号码"
          prop="contactTelephone"
          label-width="122px"
        >
          <el-input
            v-model="dataForm.contactTelephone"
            placeholder="联系人手机号码"
          />
        </el-form-item>
        <el-form-item
          style="width: 280px"
          label="负责人"
          prop="principalName"
        >
          <el-input
            v-model="dataForm.principalName"
            placeholder="负责人"
            @focus="handleInform('principalName')"
          />
        </el-form-item>
        <el-form-item
          style="width: 280px"
          label="负责人手机号码"
          prop="principalMobile"
          label-width="122px"
        >
          <el-input
            v-model="dataForm.principalMobile"
            placeholder="负责人手机号码"
          />
        </el-form-item>
        <!-- <el-form-item style="width: 280px;" label="通知方式">
          <el-select v-model="dataForm.notificationMethod" placeholder="请选择通知方式">
            <el-option
              v-for="item in notificationMethodData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width: 280px;" label="通知人">
          <el-input
            @focus="handleInform()"
            v-model="dataForm.notificationObjectName"
            placeholder="点击选择通知人"
            :readonly="true"
          ></el-input>
        </el-form-item>-->
      </div>
      <!-- <el-form-item label="通知内容">
        <el-input v-model="dataForm.notificationContent" placeholder="通知内容"></el-input>
      </el-form-item>-->
      <el-form-item
        label="可能造成的影响"
        prop="possibleImpact"
        label-width="122px"
      >
        <el-input
          v-model="dataForm.possibleImpact"
          placeholder="可能造成的影响"
        />
      </el-form-item>
      <el-form-item
        label="处置能力和资源储备"
        label-width="140px"
      >
        <el-input
          v-model="dataForm.disposingCapacityOrResourceReserve"
          placeholder="处置能力和资源储备"
        />
      </el-form-item>
      <el-form-item
        label="整改措施"
        label-width="100px"
      >
        <el-input
          v-model="dataForm.rectificationMeasuresSituation"
          placeholder="整改措施"
        />
      </el-form-item>
      <el-form-item
        v-if="dataForm.id"
        label="未完成整改原因"
        prop="reasonsForNotCompleted"
        label-width="112px"
      >
        <el-input
          v-model="dataForm.reasonsForNotCompleted"
          placeholder="未完成整改原因"
        />
      </el-form-item>
      <el-form-item label="关联设备" :class="$style.addObjectValueParent">
        <!-- <el-button @click="addObjectFun">
          添加
        </el-button> -->
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
      </el-form-item>
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
            <div :class="$style.deviceName">
              <span :title="item1.name">{{ item1.name }}</span>
            </div>
            <div :class="$style.showDelete" @click.stop="deleteDevice(item1)" />
          </div>
        </div>
      </div>

      <!-- <el-form-item label="经度" prop="longitude">
        <el-input v-model="dataForm.longitude" placeholder="经度"></el-input>
      </el-form-item>
      <el-form-item label="纬度" prop="latitude">
        <el-input v-model="dataForm.latitude" placeholder="纬度"></el-input>
      </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button plain size="small" @click="visible = false">取消</el-button>
      <el-button type="primary" size="small" @click="dataFormSubmit()"
        >确定</el-button
      >
    </span>

    <!-- 联系人选项 -->
    <!-- <el-dialog title="请选择联系人" :visible.sync="newContactors" width="40%" append-to-body>
      <el-table
        :data="contactorsData"
        style="width: 100%"
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <el-table-column prop="name" label="名字"></el-table-column>
        <el-table-column prop="mobile1" label="电话"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="currPage"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageSize"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newContactors = false" plain size="small">取 消</el-button>
        <el-button @click="submitContactor" size="small" plain>确 定</el-button>
      </span>
    </el-dialog>-->
    <!--地图弹窗-->
    <!-- <el-dialog
      title="地图"
      :visible.sync="dialogVisible"
      append-to-body
    >
      <div style="height:580px;">
        <div :style="{width:'100%',height:'500px',float: 'right'}">
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
            <el-amap-marker
              :position="position"
              :events="events"
            />
            <el-amap-marker
              v-for="{position,index} in markers"
              :key="index"
              :position="position"
            />
          </el-amap>
          <div class="toolbar">
            position: [{{ lng }}, {{ lat }}] address: {{ address }}
            <div style="text-align: center">
              <el-button @click="dialogVisible = false">
                取消
              </el-button>
              <el-button
                type="primary"
                @click="LongitudeandLatitude()"
              >
                确定
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog> -->
    <!-- 单选联系人弹窗 -->
    <LinkmanRadio
      v-show="showcommonLink"
      ref="commonLink"
      @OnchildByValue="handelLinkdata"
    />
    <deviceDialog
      ref="deviceDialogEl"
      :dialog-title="deviceTitle"
      @selectedList="getDeviceData"
    />
    <!-- 地图弹窗 -->
    <LocationDialog ref="LocationDialogRef" />
  </el-dialog>
</template>

<script>
import LinkmanRadio from '@/views/common/LinkmanRadio';
import deviceDialog from '../../sys/resource/deviceDialog';
import LocationDialog from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/LocationDialog.vue';

export default {
  components: {
    LinkmanRadio,
    deviceDialog,
    LocationDialog,
  },
  data() {
    const checkName = (rule, value, callback) => {
      if (value) {
        this.$http({
          url: `${window.SITE_CONFIG.baseUrl}/risk/riskdanger/verifyName`,
          method: 'get',
          params: this.$http.adornParams({
            name: value,
            id: this.dataForm.id,
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            console.log(data);
            // true为不存在重复，false为存在重复
            if (!data.data) {
              callback(new Error('名称重复'));
            } else {
              callback();
            }
          }
        });
      }
    };
    const self = this;
    return {
      // 是否已经点击提交表单的标示
      flag: false,
      // 联系人弹出框
      newContactors: false,
      // 联系人人数据
      contactorsData: [],
      // 选择联系人分页
      // 当前页数
      currPage: 1,
      // 每页显示条目个数
      pageSize: 10,
      // 总条目数
      totalCount: 0,
      // 选择项目分页
      currDataPage: 1,
      showcommonLink: false,
      // 通知方式 1 微信通知 2 短信通知
      notificationMethodData: [
        { value: 1, label: '微信通知' },
        { value: 2, label: '短信通知' },
      ],
      //  隐患等级: 一般、较大、重大、特别重大
      levelData: [
        { value: 1, label: '一般' },
        { value: 2, label: '较大' },
        { value: 3, label: '重大' },
        { value: 4, label: '特别重大' },
      ],
      // 隐患类型:卡口管理、人员管理、预警默认类型、巡检事件类型、专题报告、专项整治行动。
      typeData: [],
      // 可控程度:可控、基本可控、较难控制、基本失控
      controllabilityData: [
        { value: 1, label: '可控' },
        { value: 2, label: '基本可控' },
        { value: 3, label: '较难控制' },
        { value: 4, label: '基本失控' },
      ],
      // 高德地图开始
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
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                // console.log(result)
                if (result && result.position) {
                  self.lng = result.position.lng;
                  self.lat = result.position.lat;
                  // self.lng=self.$cookie.get("longitude")
                  // self.lat=self.$cookie.get("latitude")
                  self.center = [self.lng, self.lat];
                  self.mapCenter = [self.lng, self.lat];
                  self.position = [self.lng, self.lat];
                  const geocoder = new AMap.Geocoder({
                    radius: 1000,
                    extensions: 'all',
                  });
                  geocoder.getAddress(
                    [self.lng, self.lat],
                    (status, result) => {
                      if (status === 'complete' && result.info === 'OK') {
                        if (result && result.regeocode) {
                          console.log(result.regeocode);
                          self.address = result.regeocode.formattedAddress;

                          // self.$nextTick()
                        }
                      }
                    },
                  );
                  self.$nextTick();
                }
              });
            },
          },
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
                // console.log(self)

                // self.$nextTick()
              }
            }
          });
        },
      },
      // 地图弹窗
      dialogVisible: false,
      // 高德地图结束
      visible: false,
      dataForm: {
        id: 0,
        source: '',
        deadlineForRectification: '',
        rectificationTime: '',
        controllability: '',
        type: '',
        level: 1,
        contacts: '',
        contactTelephone: '', // 联系人手机号
        principalMobile: '', // 负责人手机号
        possibleImpact: '',
        disposingCapacityOrResourceReserve: '',
        rectificationMeasuresSituation: '',
        reasonsForNotCompleted: '',
        notificationObjectId: '', // 联系人id
        principalId: '', // 负责人id
        notificationObjectName: '', // 联系人姓名
        principalName: '', // 负责人姓名
        notificationContent: '',
        longitude: '',
        latitude: '',
        address: '',
        notificationMethod: '',
        jurisdiction:"",
        cgcsLatitude: '',
        cgcsLongitude: '',
      },
      dataRule: {
        source: [
          { required: true, message: '隐患源不能为空', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' },
        ],
        address: [{ required: true, message: '隐患地址不能为空' }],
        // deadlineForRectification: [
        //   {
        //     required: true,
        //     message: "整改期限不能为空",
        //     trigger: "blur"
        //   }
        // ],
        controllability: [
          {
            required: true,
            message: '可控程度不能为空',
            trigger: 'change',
          },
        ],
        type: [
          {
            required: true,
            message: '隐患类型不能为空',
            trigger: 'change',
          },
        ],
        // level: [
        //   {
        //     required: true,
        //     message: "隐患等级不能为空",
        //     trigger: "blur"
        //   }
        // ],
        notificationObjectName: [
          {
            required: true,
            message: '联系人/上报人不能为空',
            trigger: 'blur',
          },
        ],
        contactTelephone: [
          { required: true, message: '联系人电话不能为空', trigger: ['blur', 'change'] },
        ],
        possibleImpact: [
          { required: true, message: '造成影响不能为空', trigger: 'blur' },
        ],
        disposingCapacityOrResourceReserve: [
          {
            required: true,
            message: '处理能力/资源储备不能为空',
            trigger: 'blur',
          },
        ],
        rectificationMeasuresSituation: [
          { required: true, message: '整改措施不能为空', trigger: 'blur' },
        ],
        notificationObjectName: [
          {
            required: true,
            message: '通知人不能为空',
          },
        ],
        notificationContent: [
          { required: true, message: '通知内容不能为空', trigger: 'blur' },
        ],
        longitude: [
          { required: true, message: '经度不能为空', trigger: 'blur' },
        ],
        latitude: [
          { required: true, message: '纬度不能为空', trigger: 'blur' },
        ],
        jurisdiction: [
          { required: true, message: '请选择辖区', trigger: ['blur', 'change'] },
        ],
      },
      // 日期选择器选项
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() <
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate(),
            )
          );
        },
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
      jurisdictionData:[],
      contactType: '', // 区分联系人负责人选择弹窗
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
  created() {
    this.handleEventType();
    this.getJurisdictionData();
  },
  methods: {
    location() {
      this.$refs.LocationDialogRef.open({
        longitude: this.dataForm.longitude,
        latitude: this.dataForm.latitude,
        address: this.dataForm.address,
        cgcsLongitude: this.dataForm.cgcsLongitude,
        cgcsLatitude: this.dataForm.cgcsLatitude
      }).then(({ longitude, latitude, address, cgcsLongitude, cgcsLatitude }) => {
        this.dataForm.longitude = longitude;
        this.dataForm.latitude = latitude;
        this.dataForm.address = address;
        this.dataForm.cgcsLatitude = cgcsLatitude;
        this.dataForm.cgcsLongitude = cgcsLongitude;
      });
    },
    // 获取隐患类型
    handleEventType() {
      // this.$http({
      //   url: this.$http.adornUrl('/event/eventType/selectTypeList'),
      //   method: 'get',
      //   params: this.$http.adornParams({ typeFlag: 2, isTree: '0' }),
      // }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     this.typeData = data.list;
      //   } else {
      //     this.$message.error(data.code);
      //   }
      // });
      this.$http({
        url: this.$http.adornUrl('/riskDangerType/tree'),
        method: 'get',
      }).then(({ data }) => {
        if (data.errorcode === 0) {
          // 初始化类型，当children为空数组，不再显示子类型面板
          this.typeData = data.data;
          const gettree = function(data) {
            for (let i = 0; i < data.length; i += 1) {
              if (data[i].children.length === 0) {
                data[i].children = undefined;
              } else {
                gettree(data[i].children);
              }
            }
          };
          gettree(this.typeData);
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 获取辖区范围
    getJurisdictionData() {
      this.$api.getJurisdiction({}).then((res) => {
        if (res.errorcode === 0) {
          this.jurisdictionData = res.list;
        }
      });
    },
    // 触发单选组件
    handleInform(type) {
      this.contactType = type;
      this.showcommonLink = true;
      this.$refs.commonLink.handleAddContacts(
        '/mail/mailgroup/list',
        '请选择',
        this.dataForm.notificationMethod,
      );
    },
    handelLinkdata({ linkman }) {
      // console.log(linkman)
      // 联系人弹窗
      if (this.contactType === 'notificationObjectName') {
        this.dataForm.notificationObjectId = linkman[0].id;
        this.dataForm.notificationObjectName = linkman[0].name;
        this.dataForm.contactTelephone =
          linkman[0].phone || linkman[0].mobile1 || linkman[0].mobile2;
      } else {
        this.dataForm.principalId = linkman[0].id;
        this.dataForm.principalName = linkman[0].name;
        this.dataForm.principalMobile =
          linkman[0].phone || linkman[0].mobile1 || linkman[0].mobile2;

      }
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
        // console.log('-----')
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
    init(id) {
      this.dataForm.id = id || 0;
      this.showDeviceData = {
        monitor: [],
        room: [],
        colony: [],
        // wecomm: [],
        app: [],
      };
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/risk/riskdanger/info/${this.dataForm.id}`,
            ),
            method: 'get',
            params: this.$http.adornParams(),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              console.log('数据显示', data);
              this.dataForm.source = data.riskDanger.source;
              this.dataForm.address = data.riskDanger.address;
              this.dataForm.deadlineForRectification =
                data.riskDanger.deadlineForRectification;
              this.dataForm.rectificationTime =
                data.riskDanger.rectificationTime;
              this.dataForm.controllability = data.riskDanger.controllability;
              this.dataForm.type = data.riskDanger.type;
              this.dataForm.level = data.riskDanger.level;
              this.dataForm.contacts = data.riskDanger.contacts;
              this.dataForm.contactTelephone = data.riskDanger.contactTelephone;
              this.dataForm.principalMobile = data.riskDanger.principalMobile;
              this.dataForm.possibleImpact = data.riskDanger.possibleImpact;
              this.dataForm.disposingCapacityOrResourceReserve =
                data.riskDanger.disposingCapacityOrResourceReserve;
              this.dataForm.rectificationMeasuresSituation =
                data.riskDanger.rectificationMeasuresSituation;
              this.dataForm.reasonsForNotCompleted =
                data.riskDanger.reasonsForNotCompleted;
              this.dataForm.notificationObjectId =
                data.riskDanger.notificationObjectId;
              this.dataForm.principalId =
                data.riskDanger.principalId;
              this.dataForm.notificationContent =
                data.riskDanger.notificationContent;
              this.dataForm.longitude = data.riskDanger.longitude;
              this.dataForm.latitude = data.riskDanger.latitude;
              this.dataForm.notificationObjectName = data.riskDanger.contacts;
              this.dataForm.principalName = data.riskDanger.principalName;
              this.dataForm.notificationMethod =
                data.riskDanger.notificationMethod;
              this.dataForm.cgcsLatitude =  data.riskDanger.cgcsLatitude
              this.dataForm.cgcsLongitude =  data.riskDanger.cgcsLongitude
              data.resources.forEach((item) => {
                const typeChange = parseInt(item.type, 10) - 9;
                const arrType = this.deviceTypeObj[typeChange];
                item.data.forEach((item1) => {
                  const o = {};
                  o.id = item1.entity.id;
                  o.name = item1.entity.name;
                  o.type = typeChange;
                  this.showDeviceData[arrType].push(o);
                });
              });
              this.dataForm.jurisdiction = data.riskDanger.townId;
            }
          });
        } else {
          this.dataForm.level = '';
          this.dataForm.disposingCapacityOrResourceReserve = '';
          this.dataForm.rectificationMeasuresSituation = '';
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
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
      if (this.flag === false) {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.flag = true;
            this.$http({
              url: this.$http.adornUrl(
                `/risk/riskdanger/${!this.dataForm.id ? 'save' : 'update'}`,
              ),
              method: 'post',
              'content-type': 'application/json',
              data: this.$http.adornData({
                id: this.dataForm.id || undefined,
                source: this.dataForm.source,
                address: this.dataForm.address,
                deadlineForRectification:
                  this.dataForm.deadlineForRectification,
                rectificationTime: this.dataForm.rectificationTime,
                controllability: this.dataForm.controllability,
                type: this.dataForm.type,
                level: this.dataForm.level,
                contacts: this.dataForm.notificationObjectName,
                // principalName: this.dataForm.principalName,
                contactTelephone: this.dataForm.contactTelephone,
                principalMobile: this.dataForm.principalMobile,
                possibleImpact: this.dataForm.possibleImpact,
                disposingCapacityOrResourceReserve:
                  this.dataForm.disposingCapacityOrResourceReserve,
                rectificationMeasuresSituation:
                  this.dataForm.rectificationMeasuresSituation,
                reasonsForNotCompleted: this.dataForm.reasonsForNotCompleted,
                notificationObjectId: this.dataForm.notificationObjectId,
                principalId: this.dataForm.principalId,
                notificationContent: this.dataForm.notificationContent,
                longitude: this.dataForm.longitude,
                latitude: this.dataForm.latitude,
                cgcsLongitude: this.dataForm.cgcsLongitude,
                cgcsLatitude: this.dataForm.cgcsLatitude,
                notificationMethod: this.dataForm.notificationMethod,
                notificationObjectName: this.dataForm.notificationObjectName,
                principalName: this.dataForm.principalName,
                townId: this.dataForm.jurisdiction,
                params,
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
            }).finally(() => {
              this.flag = false;
            });
          }
        });
      }
    },
    // 每页显示条目个数改变时会触发
    sizeChangeHandle(val) {
      this.pageSize = val;
      // this.currPage = 1;
      // if (this.contactorType == "patrolContactor") {
      //   this.selectedNode[0] = this.dataForm.patrolDep;
      // } else {
      //   this.selectedNode[0] = this.dataForm.handleDep;
      // }
      // search: "",
      //     platformId: String(this.sharedPlatform.platformId)
      this.$http({
        url: this.$http.adornUrl('/mail/mailcontactor/list'),
        method: 'POST',
        data: this.$http.adornParams(
          {
            limit: this.pageSize,
            page: this.currPage,
            groupId: this.selectedNode,
          },
          false,
        ),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.contactorsData = data.data.list;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 当前页数改变时会触发
    currentChangeHandle(val) {
      this.currPage = val;
      // if (this.contactorType == "patrolContactor") {
      //   this.selectedNode[0] = this.dataForm.patrolDep;
      // } else {
      //   this.selectedNode[0] = this.dataForm.handleDep;
      // }
      this.$http({
        url: this.$http.adornUrl('/mail/mailcontactor/list'),
        method: 'POST',
        data: this.$http.adornParams(
          {
            limit: this.pageSize,
            page: this.currPage,
            groupId: this.selectedNode,
          },
          false,
        ),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.contactorsData = data.data.list;
        } else {
          this.$message.error(data.msg);
        }
      });
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
      const index = this.showDeviceData[arrType].findIndex(
        (it) => it.id === item.id,
      );
      this.showDeviceData[arrType].splice(index, 1);
    },
  },
};
</script>
<style lang="less" scoped>
.flexClass {
  display: flex;
  justify-content: space-between;
  align-content: space-between;
  flex-wrap: wrap;
}
.flexClass:after {
  content: '';
  width: 280px;
  border: 1px solid transparent;
}
</style>
<style lang="scss" module>
.addObjectValueParent {
  position: relative;
}
.backDiv {
  margin-left: 20px;
  background: #f2f2f2;
  border-radius: 4px;
  max-height: 200px;
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
      background: url('../../DeviceAdmin/assets/close.svg') no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
    }
  }
}
</style>
