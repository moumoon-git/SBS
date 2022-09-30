<!--
 * @Author: your name
 * @Date: 2021-01-12 15:19:10
 * @LastEditTime: 2021-01-27 14:30:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /SBS/src/views/modules/PhoneRecord/PhoneRecord-addOrUpdate.vue
-->
<template>
  <div
    class="emergencyinfo-add-or-update"
    style="position: relative"
  >
    <div
      style="position: relative; width: 100%; height: 86px; text-align: center"
    >
      <el-button
        v-if="editAble"
        class="back"
        plain
        size="small"
        @click="$router.back(-1)"
      >
        返回
      </el-button>
      <el-radio-group
        v-if="$route.query.status == 'update' || $route.query.status == 'watch'"
        v-model="elRadio"
        style="
          width: max-content;
          margin: 20px auto 30px auto;
          border-radius: 5px;
          display: inline-block;
        "
        fill="#409EFF"
        text-color="#ffffff"
        @change="changeRadioGroup"
      >
        <el-radio-button label="接报信息" />
        <el-radio-button label="处置情况" />
        <el-radio-button label="事件回访" />
        <el-radio-button label="通讯记录" />
        <el-radio-button label="工单信息" />
      </el-radio-group>
      <!-- <el-tooltip
        class="item"
        effect="dark"
        content="浏览"
        placement="top"
      >
        <i
          v-if="radioGroupVisible == '接报信息'"
          class="iconfont icon-yanjing"
          style="
            font-size: 24px;
            color: #bcbcbc;
            position: absolute;
            right: 8%;
            top: 50%;
            transform: translateY(-50%);
          "
          @click="previewEmergency"
        />
      </el-tooltip> -->
      <!-- <el-tooltip class="item" effect="dark" content="下载" placement="top">
      <i v-if="radioGroupVisible=='登记信息'" class="iconfont icon-xiazai1" style="font-size: 34px;color: #bcbcbc;position: absolute;right: 5%;top: 50%;transform: translateY(-50%);"></i>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="打印" placement="top">
      <i v-if="radioGroupVisible=='登记信息'" class="iconfont icon-duanxinfasongrizhi"  style="font-size: 34px;color: #bcbcbc;position: absolute;right: 2%;top: 50%;transform: translateY(-50%);"></i>
      </el-tooltip>-->
    </div>
    <div
      v-if="radioGroupVisible == '接报信息'"
      style="width: 100%; position: relative"
    >
      <el-form
        ref="dataForm"
        class="emergencyinfoForm"
        :model="dataForm"
        label-width="80px"
        size="medium "
        style="width: 57%; display: inline-block; margin-left: 2%"
        @submit.native.prevent
      >
        <el-row style="text-align: center; position: relative">
          <el-col :span="24">
            <span>接报信息表</span>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :span="12"
            style="border-right: 1px solid #bcbcbc"
          >
            <el-form-item
              label="事件分类"
              prop="reportName"
            >
              <el-input
                v-model="dataForm.eventTypeName"
                placeholder="事件分类名称"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="事件状态"
              prop="reportTime"
            >
              <el-radio-group
                v-model="dataForm.status"
                :disabled="true"
              >
                <el-radio :label="1">
                  待办
                </el-radio>
                <el-radio :label="2">
                  办理中
                </el-radio>
                <el-radio :label="3">
                  已办结
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :span="12"
            style="border-right: 1px solid #bcbcbc"
          >
            <el-form-item label="事件编号">
              <el-input
                v-model="dataForm.number"
                placeholder="事件编号"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="来电时间"
              prop="source"
            >
              <el-input
                v-model="dataForm.callerTime"
                placeholder="来电时间"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :span="12"
            style="border-right: 1px solid #bcbcbc"
          >
            <el-form-item
              label="热线号码"
              prop="title"
            >
              <el-input
                v-model="dataForm.hotlineNumber"
                placeholder="热线号码"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="受理单位"
              prop="type"
            >
              <el-input
                v-model="dataForm.receivingUnit"
                placeholder="受理单位"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :span="12"
            style="border-right: 1px solid #bcbcbc"
          >
            <el-form-item
              label="来电人"
              prop="time"
            >
              <el-input
                v-model="dataForm.caller"
                placeholder="来电人"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="来电号码"
              prop="status"
            >
              <el-input
                v-model="dataForm.callerPhone"
                placeholder="来电号码"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :span="12"
            style="border-right: 1px solid #bcbcbc"
          >
            <el-form-item
              label="联系方式"
              prop="time"
            >
              <el-input
                v-model="dataForm.contact"
                placeholder="联系方式"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="来电地址"
              prop="status"
            >
              <el-input
                v-model="dataForm.callerAddress"
                placeholder="来电人地址"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :span="12"
            style="border-right: 1px solid #bcbcbc"
          >
            <el-form-item
              label="问题分类"
              prop="time"
            >
              <el-input
                v-model="dataForm.emergencyTypeName"
                placeholder="问题分类"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="工单分类"
              prop="status"
            >
              <el-input
                v-model="dataForm.workOrderName"
                placeholder="工单分类"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :span="12"
            style="border-right: 1px solid #bcbcbc"
          >
            <el-form-item
              label="被反应单位"
              prop="time"
            >
              <el-input
                v-model="dataForm.reflectedUnit"
                placeholder="被反应单位"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="发生地址"
              prop="status"
            >
              <el-input
                v-model="dataForm.address"
                placeholder="发生地址"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item
              label="事件标题"
              prop="address"
            >
              <el-input
                v-model="dataForm.title"
                placeholder="事件标题"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item
              label="事件内容"
              prop="detail"
            >
              <el-input
                v-model="dataForm.detail"
                style="resize: none"
                type="textarea"
                :autosize="true"
                placeholder="事件内容"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :span="12"
            style="border-right: 1px solid #bcbcbc"
          >
            <el-form-item
              label="派单人员"
              prop="time"
            >
              <el-input
                v-model="dataForm.reportName"
                placeholder="派单人员"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="派单时间"
              prop="status"
            >
              <el-input
                v-model="dataForm.reportTime"
                placeholder="派单时间"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item
              label="处理意见"
              prop="opinion"
            >
              <el-input
                v-model="dataForm.opinion"
                style="resize: none"
                type="textarea"
                :autosize="true"
                placeholder="处理意见"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :span="12"
            style="border-right: 1px solid #bcbcbc"
          >
            <el-form-item
              label="截止时间"
              prop="deadline"
            >
              <el-input
                v-model="dataForm.deadline"
                placeholder="截止时间"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="处理时限"
              prop="disposalPeriod"
            >
              <el-input
                v-model="dataForm.disposalPeriod"
                placeholder="处理时限"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item
              label="承办单位"
              prop="organizer"
            >
              <el-input
                v-model="dataForm.organizer"
                placeholder="承办单位"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="border-bottom: 1px solid #bcbcbc">
          <el-col :span="24">
            <el-form-item
              label="附件上传"
            >
              <sv-upload
                v-model="dataForm.annex"
                :is-view="$route.query.status == 'watch' ? true : false"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        class="mapContainer"
        style="
          width: 37%;
          border: 1px solid #bcbcbc;
          display: inline-block;
          position: absolute;
          top: 0%;
          right: 2%;
        "
      >
        <div style="width: 95%; margin: 2.6% auto; position: relative">
          <el-amap-search-box
            class="search-box"
            :search-option="mapOptions.searchOption"
            :on-search-result="onSearchResult"
          />
          <i
            class="iconfont icon-dingwei"
            style="
              font-size: 34px;
              color: #bcbcbc;
              position: absolute;
              right: 8%;
              top: 50%;
              transform: translateY(-50%);
            "
          />
          <i
            class="iconfont icon-fangda"
            style="
              font-size: 28px;
              color: #bcbcbc;
              position: absolute;
              right: 0%;
              top: 50%;
              transform: translateY(-50%);
            "
            @click="enlargeMap"
          />
        </div>
        <el-amap
          ref="map"
          vid="amapDemo"
          :center="mapOptions.mapCenter"
          :zoom="mapOptions.zoom"
          :plugin="mapOptions.plugin"
          :events="mapOptions.events"
          class="amap-demo"
        >
          <!--  :key="mapOptions._mapCenter" -->
          <el-amap-marker
            :key="1000"
            vid="_mapCenter"
            :position="mapOptions._mapCenter"
          />

          <el-amap-marker
            v-for="(marker, index) in mapOptions.markers"
            :key="index"
            :position="marker.position"
            :vid="index"
          />
        </el-amap>
        <div style="width: 95%; margin: 2.6% auto">
          经纬度: [{{ mapOptions.lng }}, {{ mapOptions.lat }}]
          详细地址:{{ mapOptions.address }}
        </div>
        <div
          v-if="!editAble && confimVisible"
          style="float:right; margin: 10px 10px 10px auto"
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
      </div>
    </div>
    <div
      v-if="$route.query.status === 'audio' && radioGroupVisible == '接报信息'"
      style="
        width: 37%;
        height: 50px;
        position: absolute;
        right: 2%;
        bottom: 38%;
      "
    >
      <audioComponent ref="audio" />
    </div>

    <div
      v-if="radioGroupVisible == '处置情况'"
      style="width: 100%; position: relative; height: 700px; overflow: auto"
    >
      <handle-process
        style="width: 100%; height: 100%"
      />
    </div>
    <div
      v-if="radioGroupVisible == '事件回访'"
      style="width: 100%; position: relative; height: 700px; overflow: auto"
    >
      <handle-back
        style="width: 100%; height: 100%"
      />
    </div>
    <div
      v-if="radioGroupVisible == '通讯记录'"
      style="width: 100%; position: relative; overflow: auto"
    >
      <emergencyhandleCommunicationLog
        style="width: 100%; height: 100%"
      />
    </div>
    <div
      v-if="radioGroupVisible == '工单信息'"
    >
      <handleOrder
        :sheet-data="sheetData"
        :is-open="sheetData.isOpen"
        style="width: 100%; height: 100%"
      />
    </div>

    <previewEmergencyDialog
      v-if="previewEmergencyDialogVisible"
      ref="previewEmergencyDialog"
    />
    <el-dialog
      width="800px"
      title="查看附件"
      :visible.sync="dialogDocumentVisible"
      :destroy-on-close="true"
      style="text-align: center"
    >
      <img
        v-if="getDocumentType"
        :src="documentUrl"
        height="600"
        style="max-width: 100%"
      >
      <preplan-document
        v-else
        :document-url="documentUrl"
      />
    </el-dialog>
  </div>
</template>

<script>
import VueAMap from 'vue-amap';
import Cookies from 'js-cookie';
import imageWithHttp from '@/utils/imageWithHttp';
import PreplanDocument from '@/views/modules/ControlPlan/ContingencyPlan/Detail/PreplanDocument';
import getDepartmentList from '@/views/modules/riskInvestigation/inspectionSheetManagement/getDepartmentList/getDepartmentList';
import getContactorList from '@/views/modules/riskInvestigation/inspectionSheetManagement/getContactorList/getContactorList';
import LinkmanDraggable from '@/views/modules/riskInvestigation/inspectionSheetManagement/LinkmanDraggable/LinkmanDraggable';
import url from '@/mock/modules/url';
import $ from 'jquery';
import previewEmergencyDialog from './previewEmergencyDialog';
import HandleProcess from './PhoneRecordHandleProcess';
import HandleBack from './PhoneRecordHandleBack';
import emergencyhandleCommunicationLog from './emergencyhandleCommunicationLog.vue';
import handleOrder from './PhoneRecordHandleOrder';
import emergencyhandleprocessannex from './emergencyhandleprocessannex';
import audioComponent from '../sys/combined/history/audio.vue';
import Sv_upload from '../../../sinvieUI/sv_upload/sv_upload.vue';

// import local from '@/store/modules/contactor'

export default {
  components: {
    previewEmergencyDialog,
    HandleProcess,
    HandleBack,
    emergencyhandleprocessannex,
    emergencyhandleCommunicationLog,
    handleOrder,
    audioComponent,
    PreplanDocument,

    getDepartmentList,
    getContactorList,
    LinkmanDraggable,
    Sv_upload,
  },
  data() {
    const self = this;

    return {
      sheetData: {},
      confimVisible: true,
      throttleFlag: true, // 节流标志
      dialogDocumentVisible: false, // 预览文件弹窗
      documentUrl: '', // 预览文件路径
      tip: '',

      previewEmergencyDialogVisible: false,
      // 这里应该是viewAble吧？
      editAble:
        !!(this.$route.query.status === 'watch'
        || this.$route.query.operationStatus === '已办结'),
      radioGroupVisible: '接报信息',
      elRadio: '接报信息',
      $window: {},
      $Cookies: {},
      mapOptions: {
        map: {},
        polygons: [],
        districtSearch: '',
        citycode: '',
        zoom: 12,
        searchOption: {
          city: '广州',
          citylimit: true,
        },
        lng: 0,
        lat: 0,
        address: '',
        mapCenter: [113.3245904, 23.1066805],
        // mapCenter: [117.2700265, 36.595434],

        _mapCenter: [],

        markers: [],
        events: {
          init: (o) => {
            self.mapOptions.map = o;
            o.getCity((result) => {});
          },
          moveend: () => {},
          zoomchange: () => {},
          click: (e) => {
            /**
             * @author tanjinfeng
             * @date 2020-11-02
             * @desc 清除已存在的marker
             */
            // ********开始******
            self.mapOptions.map.remove(self.mapOptions.markers);
            // *********结束*******
            // 点击地图居中
            self.setCenter(e);
            self.mapOptions.markers = [];
            console.log('点击地图e', e);
            const { lng, lat } = e.lnglat;
            self.mapOptions.lng = lng;
            self.mapOptions.lat = lat;
            self.dataForm.longitude = lng;
            self.dataForm.latitude = lat;
            const marker = {
              position: [lng, lat],
            };
            self.mapOptions.markers.push(marker);
            let geocoder;
            // 这里通过高德 SDK 完成。
            AMap.plugin('AMap.Geocoder', () => {
              geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: 'all',
              });
            });

            setTimeout(() => {
              geocoder.getAddress([lng, lat], (status, result) => {
                if (status === 'complete' && result.info === 'OK') {
                  // console.log("点击地图的result为",result)
                  if (result && result.regeocode) {
                    self.mapOptions.address = result.regeocode.formattedAddress;
                    self.dataForm.address = result.regeocode.formattedAddress;
                    self.$nextTick();
                  }
                  if (
                    JSON.parse(localStorage.getItem('platformInfo')).flag
                    == 'province'
                  ) {
                    setTimeout(() => {
                      $('#province')
                        .find(
                          `option:contains('${result.regeocode.addressComponent.province}')`,
                        )
                        .attr('selected', true);
                      self.search(
                        self.$window.document.getElementById('province'),
                      );
                    }, 800);
                  }
                  if (
                    JSON.parse(localStorage.getItem('platformInfo')).flag
                      == 'city'
                    || JSON.parse(localStorage.getItem('platformInfo')).flag
                      == 'province'
                  ) {
                    setTimeout(() => {
                      $('#city')
                        .find(
                          `option:contains('${result.regeocode.addressComponent.city}')`,
                        )
                        .attr('selected', true);
                      self.search(self.$window.document.getElementById('city'));
                    }, 1100);
                  }
                  if (
                    JSON.parse(localStorage.getItem('platformInfo')).flag
                      == 'district'
                    || JSON.parse(localStorage.getItem('platformInfo')).flag
                      == 'city'
                    || JSON.parse(localStorage.getItem('platformInfo')).flag
                      == 'province'
                  ) {
                    setTimeout(() => {
                      $('#district')
                        .find(
                          `option:contains('${result.regeocode.addressComponent.district}')`,
                        )
                        .attr('selected', true);
                      self.search(
                        self.$window.document.getElementById('district'),
                      );
                    }, 4000);
                  }

                  setTimeout(() => {
                    $('#street')
                      .find(
                        `option:contains('${result.regeocode.addressComponent.township}')`,
                      )
                      .attr('selected', true);
                    // self.setCenter(
                    //   self.$window.document.getElementById("street")
                    // );
                  }, 4300);
                }
              });
            }, 500);
          },
        },
        plugin: [
          'ToolBar',
          {
            pName: 'MapType',
            defaultType: 0,
            events: {
              init(o) {
                // console.log(o);
              },
            },
          },
        ],
      },
      typeOptions: [],
      sourceOptions: [],
      visible: false,
      fileList: [],

      isOpen: '2',

      // let storage = {
      //   getStorage(options) {
      //     let config={}
      //   }
      // }

      dataForm: {
        eventType: '',
        statusName: '',
        number: '',
        callerTime: '',
        hotlineNumber: '',
        receivingUnit: '',
        caller: '',
        callerPhone: '',
        contact: '',
        callerAddress: '',
        emergencyTypeName: '',
        workOrderName: '',
        reflectedUnit: '',
        address: '',
        title: '',
        detail: '',
        reportName: '',
        reportTime: '',
        opinion: '',
        deadline: '',
        disposalPeriod: '',
        organizer: '',



        id: 0,
        reportPhone: '',
        
        source: '',
        type: '',
        time: '',
        
        status: 1,
        
        leadershipDirective: '',
        images: [],
        temporaryImages: [],
        annex: [], // 附件
        longitude: '',
        latitude: '',
        createTime: '',
        updateTime: '',
        createUserId: '',
        updateUserId: '',
        isDeleted: '',
        array: [
          {
            reportName: '飞洒',
            reportPhone: '123165',
            reportTime: '08：40',
            source: '发生',
          },
          {
            reportName: '发放',
            reportPhone: '4568',
            reportTime: '09：40',
            source: '发申请',
          },
          {
            reportName: '回复',
            reportPhone: '5646',
            reportTime: '11：45',
            source: '我去',
          },
        ],
        // 工单部分
        mailGroup: '',
        contactorId: '',
        participantsManList: [],
        copyManList: [],
        mailGroupName: '',
        chargeMan: {
          id: '',
          name: '',
        },
        chargeManDetail: '',
        position: '',
        mobile1: '',
      },
      dataRule: {
        reportName: [
          { required: true, message: '报送人名称不能为空', trigger: 'blur' },
        ],
        reportPhone: [
          { required: true, message: '报送人电话不能为空', trigger: 'blur' },
        ],
        reportTime: [
          { required: true, message: '报送时间不能为空', trigger: 'blur' },
        ],
        source: [
          { required: true, message: '要情来源不能为空', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '要情类型不能为空', trigger: 'blur' },
        ],
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        time: [
          { required: true, message: '事生时间不能为空', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '事发地点不能为空', trigger: 'blur' },
        ],
        detail: [{ required: true, message: '详情不能为空', trigger: 'blur' }],
        status: [
          {
            required: true,
            message: '状态  0:代办  1:办理中   2:已办结不能为空',
            trigger: 'blur',
          },
        ],
        opinion: [
          { required: true, message: '拟办意见不能为空', trigger: 'blur' },
        ],
        leadershipDirective: [
          { required: true, message: '领导批示不能为空', trigger: 'blur' },
        ],
        images: [
          { required: true, message: '图片数组不能为空', trigger: 'blur' },
        ],
        annex: [
          { required: true, message: '附件数组不能为空', trigger: 'blur' },
        ],
        longitude: [
          { required: true, message: '经度不能为空', trigger: 'blur' },
        ],
        latitude: [
          { required: true, message: '维度不能为空', trigger: 'blur' },
        ],
        createTime: [
          { required: true, message: '创建时间不能为空', trigger: 'blur' },
        ],
        updateTime: [
          { required: true, message: '更新时间不能为空', trigger: 'blur' },
        ],
        createUserId: [
          { required: true, message: '创建用户不能为空', trigger: 'blur' },
        ],
        updateUserId: [
          { required: true, message: '更新用户不能为空', trigger: 'blur' },
        ],
        isDeleted: [
          {
            required: true,
            message: '是否删除 0否 1删除不能为空',
            trigger: 'blur',
          },
        ],
      },
      emergencyType: '1',

      newContactorName: [],
      // newContactorWorkUnit: [],
      // newContactorPosition: [],
      newCopyName: [],
      // 参与人的名字，用于显示，不传后台
      contactorName: [],
      // contactorWorkUnit: [],
      // contactorPosition: [],
      // contactorDetail: [],
      // 参与人弹窗是否显示
      showcommonLink: false,
      // 抄送人的名字，用于显示，不传后台
      copyName: [],
      // 抄送人弹窗是否显示
      showcopyLink: false,
      addressOptions: {
        city: '',
        district: '',
        districtOptions: [],
        street: '',
        streetOptions: [],
      },
      host: window.SITE_CONFIG.cloudUrl,
    };
  },
  computed: {
    getDocumentType() {
      if (
        [
          'png',
          'jpg',
          'jpeg',
          'bmp',
          'gif',
          'webp',
          'psd',
          'svg',
          'tiff',
        ].indexOf(
          this.documentUrl
            .substr(this.documentUrl.lastIndexOf('.') + 1)
            .toLowerCase(),
        ) !== -1
      ) {
        return true;
      }
      return false;
    },
  },
  // watch: {
  //   'dataForm.annex': function (newValue, oldValue) {
  //     if (this.dataForm.annex.length > 0) {
  //       this.dataForm.annex.forEach((item, index) => {
  //         if (item.type == 0) {
  //           const temporaryObject = imageWithHttp.withHttp(item.url);
  //           setTimeout(() => {
  //             this.$set(item, 'temporaryUrl', temporaryObject.image);
  //             this.$forceUpdate();
  //           }, 1500);
  //         }
  //       });
  //     }
  //   },
  // },
  created() {
    this.$window = window;
    this.$Cookies = Cookies;
    // console.log("this.$router",this.$router,this.$route)
    this.initSelectOptions();
    if (
      this.$route.query.status === 'update'
      || this.$route.query.status === 'watch'
      || this.$route.query.status === 'audio'
    ) {
      this.init();
    }
  },
  mounted() {
    setTimeout(() => {
      // console.log("self.mapOptions.map",this.mapOptions.map,this.mapOptions,this.mapOptions.map.panTo)
      // this.initMapSelectOptions();
      this.addressSelectionInit();
    }, 1000);
  },
  methods: {
    // 上传组件文件列表
    pointerAction() {},

    enlargeMap() {
      if (document.querySelector('.mapContainer').style.width == '37%') {
        this.confimVisible = false;
        document
          .querySelector('.mapContainer')
          .setAttribute(
            'style',
            'width: 100%;height: 100%;border: 1px solid #bcbcbc;display: inline-block;position:absolute;top:0%;left:0%;background: white;',
          );
        document.querySelector(
          '.el-vue-amap-container.amap-demo',
        ).style.height = '80%';
      } else {
        this.confimVisible = true;
        document
          .querySelector('.mapContainer')
          .setAttribute(
            'style',
            'width: 37%;border: 1px solid #bcbcbc;display: inline-block;position:absolute;top:0%;right: 2%;',
          );
        document.querySelector(
          '.el-vue-amap-container.amap-demo',
        ).style.height = '1000px';
      }
    },
    initMapSelectOptions() {
      const that = this;
      AMap.plugin('AMap.DistrictSearch', () => {
        that.mapOptions.districtSearch = new AMap.DistrictSearch({
          // 关键字对应的行政区级别，country表示国家
          // level: 'country',
          //  显示下级行政区级数，1表示返回下一级行政区
          subdistrict: 1,
          showbiz: false,
          extensions: 'all',
        });

        /**
         * @author tanjinfeng
         * @date 2020-10-16
         * @desc 初始化时获取当前平台的坐标，查询所在城市，根据城市获取下拉框选项
         */
        const currentLngLat = [
          that.$cookie.get('longitude'),
          that.$cookie.get('latitude'),
        ];
        that.mapOptions.map.setCenter(currentLngLat);
        // 坐标转换地址组件
        const geocoder = new AMap.Geocoder({ extensions: 'all' });
        // 获取初始点所在的城市
        geocoder.getAddress(currentLngLat, (status, result) => {
          if (status === 'complete' && result.regeocode) {
            const currentCity = result.regeocode.addressComponent.citycode;
            const currentDistrict = result.regeocode.addressComponent.district;
            const currentTownship = result.regeocode.addressComponent.township;

            // 搜索城市信息
            that.mapOptions.districtSearch.search(
              currentCity,
              (status, result) => {
                // 查询成功时，result即为对应的行政区信息
                // console.log('中国查询成功',status, result,JSON.parse(localStorage.getItem('platformInfo')) )
                if (status == 'complete') {
                  that.getData(result.districtList[0]);
                  // setTimeout(() => {
                  //   $("#street")
                  //     .find(
                  //       `option:contains(${
                  //         JSON.parse(localStorage.getItem("platformInfo")).townName
                  //       })`
                  //     )
                  //     .attr("selected", true);
                  //   $("#district")
                  //     .find(
                  //       `option:contains(${
                  //         currentDistrict
                  //       })`
                  //     )
                  //     .attr("selected", true);
                  //   setTimeout(() => {
                  //     that.search(that.$window.document.getElementById("street"));
                  //     that.setCenter(that.$window.document.getElementById("street"));
                  //   }, 600);
                  // }, 500);
                }
              },
            );
          } else {
            console.log(
              '坐标地址转换失败！错误信息：【\n',
              status,
              result,
              '\n】',
            );
          }
        });
      });
    },
    getData(data, level) {
      const citySelect = document.getElementById('city');
      const districtSelect = document.getElementById('district');
      const areaSelect = document.getElementById('street');
      const that = this;
      const bounds = data.boundaries;
      if (bounds) {
        for (var i = 0, l = bounds.length; i < l; i++) {
          const polygon = new AMap.Polygon({
            map: that.mapOptions.map,
            strokeWeight: 1,
            strokeColor: '#0091ea',
            fillColor: '#80d8ff',
            fillOpacity: 0.2,
            path: bounds[i],
          });
          polygon.on('click', that.mapOptions.events.click);
          that.mapOptions.polygons.push(polygon);
        }
        // that.mapOptions.map.setFitView(); //地图自适应
      }

      // 清空下一级别的下拉列表
      if (level === 'province') {
        if (citySelect) {
          citySelect.innerHTML = '';
        }
        if (districtSelect) {
          districtSelect.innerHTML = '';
        }
        if (areaSelect) {
          areaSelect.innerHTML = '';
        }
      } else if (level === 'city') {
        if (districtSelect) {
          districtSelect.innerHTML = '';
        }
        if (areaSelect) {
          areaSelect.innerHTML = '';
        }
      } else if (level === 'district') {
        if (areaSelect) {
          areaSelect.innerHTML = '';
        }
      } else if (level === 'street') {
        if (areaSelect) {
          if (areaSelect.innerHTML) {
            return;
          }
          areaSelect.innerHTML = '';
        }
      }

      const subList = data.districtList;
      if (subList) {
        let contentSub = new Option('--请选择--');
        const curlevel = subList[0].level;
        // console.log('subList[0].level',subList[0].level,subList)
        const curList = document.querySelector(`#${curlevel}`);
        curList.add(contentSub);
        for (var i = 0, l = subList.length; i < l; i++) {
          const { name } = subList[i];
          const levelSub = subList[i].level;
          const cityCode = subList[i].citycode;
          contentSub = new Option(name);
          contentSub.setAttribute('value', levelSub);
          contentSub.center = subList[i].center;
          contentSub.adcode = subList[i].adcode;
          curList.add(contentSub);
        }
      }
    },
    search(obj) {
      const that = this;

      // 清除地图上所有覆盖物;
      for (let i = 0, l = that.mapOptions.polygons.length; i < l; i++) {
        that.mapOptions.polygons[i].setMap(null);
      }
      const option = obj[obj.options.selectedIndex];
      const keyword = option.text; // 关键字
      const { adcode } = option;
      that.mapOptions.districtSearch.setLevel(option.value); // 行政区级别
      that.mapOptions.districtSearch.setExtensions('all');
      // 行政区查询
      // 按照adcode进行查询可以保证数据返回的唯一性
      that.mapOptions.districtSearch.search(adcode, (status, result) => {
        if (status === 'complete') {
          // console.log("search完后的result",result,obj.id)
          that.getData(result.districtList[0], obj.id);
        }
      });
    },
    setCenter(obj) {
      const that = this;
      console.log('22221', obj.lnglat != undefined);
      if (obj.options != undefined) {
        // 表单已有数据的时候，初始化居中
        var centerPositon = obj[obj.options.selectedIndex].center;
      } else {
        // 点击地图居中
        var centerPositon = obj.lnglat;
      }
      console.log('2222', obj.lnglat, centerPositon);
      // that.mapOptions.map.setCenter(obj[obj.options.selectedIndex].center);
      that.mapOptions.map.setCenter(centerPositon);

      console.log('emmm', centerPositon);
      that.mapOptions._mapCenter = [centerPositon.lng, centerPositon.lat];
      that.mapOptions.mapCenter = [centerPositon.lng, centerPositon.lat];

      console.log('地图对象', this.mapOptions);
    },
    initSelectOptions() {
      this.sourceOptions = [];
      this.$http({
        url: this.$http.adornUrl('/sys/sysdictionary/dictionaryList?id=99'),
        method: 'get',
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          // console.log("/sys/sysdictionary/dictionaryList 获取要情来源source",data)

          data.data.forEach((item) => {
            this.sourceOptions.push({ value: item.id, label: item.name });
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: 'error',
          });
        }
      });

      this.initEmergencyType();
    },
    recursion(list) {
      for (let i = 0; i < list.length; i++) {
        list[i].value = list[i].id;
        list[i].label = list[i].name;
        if (list[i].children) {
          this.recursion(list[i].children);
        }
      }
    },
    initEmergencyType() {
      this.typeOptions = [];
      this.dataForm.type = [];
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode2tree?code=${
            this.emergencyType == 1 ? 'emergencyType' : 'tufa_type '
          }`,
        ),
        method: 'get',
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        console.log('/sys/sysdictionary/getSysDictionaryListByCode2tree', data);
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          Promise.resolve(this.recursion(data.data)).then(() => {
            this.typeOptions = data.data;
            console.log('this.typeOptions', this.typeOptions, data.data);
            // 2020-11-02 tanjinfeng 取消默认选第一项，因为第一项可能是目录项，实际不可选，影响validation
            // if (this.$route.query.status === "add") {
            //   this.dataForm.type = this.typeOptions[0].value ? [this.typeOptions[0].value] : this.dataForm.type;
            // }
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: 'error',
          });
        }
      });
    },
    init() {
      this.dataForm.id = this.$route.query.id || 0;
      // this.visible = true
      if (
        this.$route.query.status === 'update'
        || this.$route.query.status === 'watch'
      ) {
        this.$nextTick(() => {
          this.$refs.dataForm.resetFields();
          // if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/ottffemergency/ottffemergencyinfo/info/${this.$route.query.id}`,
            ),
            method: 'get',
            params: this.$http.adornParams(),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.sheetData = data.emergencyInfo;
              this.dataForm.eventType = data.emergencyInfo.eventType;
              this.dataForm.status = data.emergencyInfo.status;
              this.dataForm.number = data.emergencyInfo.number;
              this.dataForm.callerTime = data.emergencyInfo.callerTime;
              this.dataForm.hotlineNumber = data.emergencyInfo.hotlineNumber;
              this.dataForm.receivingUnit = data.emergencyInfo.receivingUnit;
              this.dataForm.caller = data.emergencyInfo.caller;
              this.dataForm.callerPhone = data.emergencyInfo.callerPhone;
              this.dataForm.contact = data.emergencyInfo.contact;
              this.dataForm.callerAddress = data.emergencyInfo.callerAddress;
              this.dataForm.emergencyTypeName = data.emergencyInfo.emergencyTypeName;
              this.dataForm.workOrderName = data.emergencyInfo.workOrderName;
              this.dataForm.reflectedUnit = data.emergencyInfo.reflectedUnit;
              this.dataForm.address = data.emergencyInfo.address;
              this.dataForm.title = data.emergencyInfo.title;
              this.dataForm.detail = data.emergencyInfo.detail;
              this.dataForm.reportName = data.emergencyInfo.reportName;
              this.dataForm.reportTime = data.emergencyInfo.reportTime;
              this.dataForm.opinion = data.emergencyInfo.opinion;
              this.dataForm.deadline = data.emergencyInfo.deadline;
              this.dataForm.disposalPeriod = data.emergencyInfo.disposalPeriod;
              this.dataForm.organizer = data.emergencyInfo.organizer;
              this.mapOptions.lng = data.emergencyInfo.longitude;
              this.mapOptions.lat = data.emergencyInfo.latitude;
              this.dataForm.longitude = data.emergencyInfo.longitude;
              this.dataForm.latitude = data.emergencyInfo.latitude;
              this.dataForm.annex = data.emergencyInfo.annexs;
              this.fileList = this.dataForm.annex;


            //   this.dataForm.source = data.emergencyInfo.sourceId;
            //   this.dataForm.reportName = data.emergencyInfo.reportName;
            //   this.dataForm.reportPhone = data.emergencyInfo.reportPhone;
            //   this.dataForm.reportTime = data.emergencyInfo.reportTime;
            //   this.dataForm.title = data.emergencyInfo.title;
            //   this.dataForm.time = data.emergencyInfo.time;
            //   this.mapOptions.address = data.emergencyInfo.address;
            //   this.dataForm.address = data.emergencyInfo.address;
            //   this.dataForm.detail = data.emergencyInfo.detail;
            //   this.dataForm.opinion = data.emergencyInfo.opinion;
            //   this.dataForm.leadershipDirective = data.emergencyInfo.leadershipDirective;
            //   this.dataForm.images = data.emergencyInfo.images;
            //   this.dataForm.createTime = data.emergencyInfo.createTime;
            //   this.dataForm.updateTime = data.emergencyInfo.updateTime;
            //   this.dataForm.createUserId = data.emergencyInfo.createUserId;
            //   this.dataForm.updateUserId = data.emergencyInfo.updateUserId;
            //   this.dataForm.isDeleted = data.emergencyInfo.isDeleted;
            //   this.emergencyType = data.emergencyInfo.emergencyType;
            //   this.isOpen = data.emergencyInfo.isOpen;
            //   this.dataForm.mailGroup = data.emergencyInfo.mailGroup;


              // this.dataForm.contactorId = data.emergencyInfo.contactorId;
              // this.dataForm.participantsManList = data.emergencyInfo.participantsManList;
              // this.dataForm.copyManList = data.emergencyInfo.copyManList;
            
            // this.dataForm.mailGroupName = data.emergencyInfo.mailGroupName;
            //   this.dataForm.chargeMan = data.emergencyInfo.chargeMan
            //     ? data.emergencyInfo.chargeMan
            //     : this.dataForm.chargeMan;
            //   // this.dataForm.chargeManDetail = data.emergencyInfo.chargeManDetail ? data.emergencyInfo.chargeManDetail : this.dataForm.chargeManDetail;
            //   this.dataForm.position = data.emergencyInfo.position;
            //   this.dataForm.mobile1 = data.emergencyInfo.mobile1;
             
             // this.initEmergencyType();
              // this.dataForm.type = data.emergencyType.emergencyType;
              /**
               * @author tanjinfeng
               * @date 2020-10-30
               * @desc 后台获取的坐标显示在地图上
               */
              // ********开始**********
              if (this.mapOptions.lng != null && this.mapOptions.lat != null) {
                const marker = new AMap.Marker({
                  position: new AMap.LngLat(
                    this.mapOptions.lng,
                    this.mapOptions.lat,
                  ),
                  map: this.mapOptions.map,
                });
                this.mapOptions.map.panTo(marker.getPosition());
              }
              // ******结束**********
              this.dataForm.participantsManList = [];
              this.dataForm.copyManList = [];
              console.log('有没有在111111111111111111');
              if (data.emergencyInfo.allContactorList != null) {
                data.emergencyInfo.allContactorList.forEach((e) => {
                  if (e.type === '2') {
                    this.dataForm.participantsManList.push({
                      name: e.contactorIdString,
                      id: e.contactorId,
                      phone: e.position,
                    });
                  } else if (e.type === '3') {
                    this.dataForm.copyManList.push({
                      name: e.contactorIdString,
                      id: e.contactorId,
                      phone: e.position,
                    });
                  } else if (e.type === '1') {
                    this.dataForm.chargeManDetail = e.contactorIdString;
                  }
                });
              }

              console.log(
                'ffffff',
                this.dataForm.contactorDetail,
                this.dataForm.copyManList,
                this.dataForm.participantsManList,
              );

              this.initEmergencyType();
              this.dataForm.source = this.sourceOptions.find(
                (v) => v.value === data.emergencyInfo.sourceId,
              ).value;
              setTimeout(() => {
                this.dataForm.type = data.emergencyInfo.typeId;
                console.log('this.dataForm.type', this.dataForm.type);
              }, 300);
              // 地图位置
              this.mapOptions.mapCenter = [
                this.dataForm.longitude,
                this.dataForm.latitude,
              ];
            } else {
              this.$message.error(data.msg);
            }
          });
        });
      }

      if (this.$route.query.status === 'audio') {
        if (this.$route.query.item.type == 0) {
          this.dataForm.reportPhone = this.$route.query.item.calling;
        } else {
          this.dataForm.reportPhone = this.$route.query.item.called;
        }
        this.dataForm.reportName = this.$route.query.item.contactorId;
        this.dataForm.time = new Date(this.$route.query.item.startTime);
        setTimeout(() => {
          this.$refs.audio.initBase(this.$route.query.item.recordFile);
        });
      }
    },
    previewEmergency() {
      this.previewEmergencyDialogVisible = true;

      setTimeout(() => {
        this.$refs.previewEmergencyDialog.dialogVisible = true;
      });
    },
    changeRadioGroup(val) {
      this.radioGroupVisible = val;
    },
    deleteImg(index, item) {
      document
        .querySelectorAll(
          '.el-upload-list.el-upload-list--text li .el-icon-close',
        )
        [index].setAttribute('display', 'initial');
      document
        .querySelectorAll(
          '.el-upload-list.el-upload-list--text li .el-icon-close',
        )
        [index].click();

      if (this.$route.query.status === 'update') {
        this.$http({
          url: this.$http.adornUrl('/emergency/emergencyinfoannex/delete'),
          method: 'post',
          data: this.$http.adornData({
            ids: [item.id],
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            // console.log("删除成功",data)
            this.$message({
              message: '删除成功!',
              type: 'success',
            });
          } else {
            this.$message({
              message: `${data.msg}`,
              type: 'error',
            });
          }
        });
      }
    },

    handleRemove(file, fileList) {
      this.dataForm.annex = [];
      console.log('删除上传handleRemove file, fileList', file, fileList);
      fileList.forEach((item) => {
        this.dataForm.annex.push(item);
      });
      console.log('`````````````````', this.dataForm.annex);
      this.fileList = this.dataForm.annex;
    },

    // 图片上传之前
    beforeAvatarUpload(file) {
      const form = new FormData();
      form.append('file', file);
      console.log('1234', file);
      const flag = this.$route.query.status === 'update' ? this.$route.query.id : '';
      console.log(flag);
      form.append('emergencyInfoId', flag);
      this.$http({
        url: this.$http.adornUrl('/upload/emergencyFile'),
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: form,
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            // if(this.fileList.length!=0){
            //   this.fileList.forEach(item=>{
            //     if(item.data){
            //       this.dataForm.annex.push(item.data.data)
            //     }else{
            //       this.dataForm.annex.push(item)
            //     }
            //   })
            // }

            this.dataForm.annex.push(data.data);
            this.fileList = this.dataForm.annex;
            // console.log("上传上传", data, this.fileList, file);
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch((err) => {});
    },

    handlePreview(file) {
      console.log('上传预览handlePreview file', file);
      if (this.$route.query.status === 'update') {
        const httpaddress = window.SITE_CONFIG.cloudUrl;
        // window.open(
        //   `${httpaddress}/${file.url}?attname=${
        //     file.name
        //   }&token=${this.$cookie.get("token")}`
        // );
        if (navigator.msSaveOrOpenBlob) {
          // 兼容ie
          window.open(
            `${httpaddress}/${file.url}?attname=${
              file.name
            }&token=${this.$cookie.get('token')}`,
          );
        } else {
          const a = document.createElement('a');
          a.href = `${httpaddress}/${file.url}?attname=${
            file.name
          }&token=${this.$cookie.get('token')}`;
          a.download = file.name;
          document.body.appendChild(a); // 兼容Firefox浏览器
          a.click();
          a.remove();
        }
      }
    },

    // 预览文件
    previewDocument(file) {
      console.log('aaaaaaaaaaaaaaaaaaaaa', file);

      const index = file.name.lastIndexOf('.');
      const ext = file.name.substr(index + 1);
      if (
        [
          'png',
          'jpg',
          'jpeg',
          'bmp',
          'gif',
          'webp',
          'psd',
          'svg',
          'tiff',
        ].indexOf(ext.toLowerCase()) !== -1
      ) {
        // console.log('该文件是图片')
        /**
         * @author tanjinfeng
         * @date 2020-10-30
         * @desc 修复预览无效
         */
        // *******原来的代码******
        // this.dialogDocumentVisible = false;
        // *******修改的代码******
        this.dialogDocumentVisible = true;
        // *******结束*******
        this.documentUrl = `${this.$window.SITE_CONFIG.cloudUrl}/${file.url}`;
        console.log('文件路径1', this.documentUrl);
        return true;
      }
      this.dialogDocumentVisible = true;
      this.documentUrl = this.$window.SITE_CONFIG.cloudUrl + file.url;
      console.log('文件路径2', this.documentUrl);
      return false;
    },

    // 下载文件
    downloadDocument(file) {
      console.log('asfff', file);

      const index = file.name.lastIndexOf('.');
      const ext = file.name.substr(index + 1);
      if (
        [
          'png',
          'jpg',
          'jpeg',
          'bmp',
          'gif',
          'webp',
          'psd',
          'svg',
          'tiff',
        ].indexOf(ext.toLowerCase()) !== -1
      ) {
        // console.log('该文件是图片')
        this.documentUrl = `${this.$window.SITE_CONFIG.cloudUrl}/${file.url}`;
        console.log('文件路径1', this.documentUrl);
        return true;
      }
      this.documentUrl = this.$window.SITE_CONFIG.cloudUrl + file.url;
      this.tip = '点击下载';
      console.log('文件路径2', this.documentUrl);
      window.open(this.documentUrl, '_blank');
      return false;
    },
    // handleSuccess(response, file, fileList){
    //   this.dataForm.annex=[]
    //   console.log("上传成功response, file, fileList",response.code,response, file, fileList)
    //   if(response.code==0){
    //     fileList.forEach(item=>{
    //       if(item.response){
    //         this.dataForm.annex.push(item.response.data)
    //       }else{
    //         this.dataForm.annex.push(item)
    //       }
    //
    //     })
    //
    //     this.fileList=this.dataForm.annex
    //
    //   }
    // },
    handleError(err, file, fileList) {
      // console.log("上传失败handleError err, file, fileList",err, file, fileList)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`,
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    onSearchResult(pois) {
      let latSum = 0;
      let lngSum = 0;
      if (pois.length > 0) {
        pois.forEach((poi) => {
          const { lng, lat } = poi;
          lngSum += lng;
          latSum += lat;
        });
        this.mapOptions.address = pois[0].name;
        this.dataForm.address = pois[0].name;
        const center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length,
        };
        this.mapOptions.lat = center.lat;
        this.mapOptions.lng = center.lng;
        this.dataForm.longitude = center.lng;
        this.dataForm.latitude = center.lat;
        this.mapOptions.mapCenter = [center.lng, center.lat];
        /**
         * @author tanjinfeng
         * @date 2020-11-02
         * @desc 搜索结果增加落点标识
         */
        // ******开始*****
        const marker = new AMap.Marker({
          map: this.mapOptions.map,
          position: new AMap.LngLat(this.mapOptions.lng, this.mapOptions.lat),
        });
        this.mapOptions.markers.push(marker);
        // ******结束******
      }
    },

    // 点击显示处置部门列表弹窗
    showDepList() {
      this.$refs.getDepartmentList.$forceUpdate();
      this.$refs.getDepartmentList.getDepVisible = true;
    },
    // 处置部门勾选，子组件赋值给父组件
    checkDepId(id, name) {
      if (this.dataForm.depId != id) {
        this.dataForm.chargeMan.name = '';
      }
      this.dataForm.depId = id;
      this.dataForm.mailGroupName = name;
    },

    // 负责人列表弹窗
    showContactorList() {
      this.$refs.getContactorList.$forceUpdate();
      this.$refs.getContactorList.getContactorVisible = true;
    },
    // 负责人勾选，子组件赋值给父组件
    checkContactorId(id, name, position, mobile1) {
      this.dataForm.contactorId = id;
      this.dataForm.chargeMan.id = id;
      this.dataForm.chargeMan.name = name;
      this.dataForm.position = position;
      this.dataForm.mobile1 = mobile1;
      this.dataForm.chargeManDetail = `${name}（${position}/${mobile1}）`;
      console.log(`负责人详情${this.dataForm.chargeManDetail}`);
    },

    // 选择参与人视图
    contactViewHandle() {
      this.showcommonLink = true;
      this.$nextTick(() => {
        this.$refs.commonLink.handleAddContacts(
          '/mail/mailgroup/list',
          '请选择参与人',
        );
      });
    },
    // 参与人勾选
    handleLinkdata({ linkman }) {
      const that = this;
      for (const item of linkman) {
        that.dataForm.participantsManList.push(item.id);
        that.contactorName.push({
          name: item.name,
          id: item.id,
          // workUnit: item.workUnit,
          // position: item.position,
        });
        // console.log("参与人勾选了："+that.contactorDetail.name)
      }
    },
    // 选择抄送人视图
    copyViewHandle() {
      this.showcopyLink = true;
      this.$nextTick(() => {
        this.$refs.copyLink.handleAddContacts(
          '/mail/mailgroup/list',
          '请选择抄送人',
        );
      });
    },
    // 抄送人赋值
    handleCopyLinkdata({ linkman }) {
      const that = this;
      for (const item of linkman) {
        console.log('抄送人：', that.copyName);
        that.dataForm.copyManList.push(item.id);
        that.copyName.push({
          name: item.name,
          id: item.id,
        });
      }
    },
    // 删除参与人、抄送人
    deleteItem(id, display, list) {
      for (const index in display) {
        if (display[index].id == id) {
          display.splice(index, 1);
        }
      }
      for (const index in list) {
        if (list[index] == id) {
          list.splice(index, 1);
        }
      }
      console.log(
        '删除了参与人：',
        this.contactorName,
        this.dataForm.participantsManList,
      );
    },

    // 表单提交
    dataFormSubmit() {
      const annexs = [];
      this.dataForm.annex.forEach((item) => {
        annexs.push({
          url: item.url,
          name: item.name,
          type: 0,
          emergencyInfoId: this.$route.query.id,
        });
      });
      // return;
      /**
       * @author tanjinfeng
       * @date 2020-11-09
       * @desc 右下角开启时需要判断
       */
      // ***** 开始
      if (this.isOpen == '1') {
        if (
          this.dataForm.mailGroupName == ''
          || this.dataForm.chargeManDetail == ''
          || this.dataForm.participantsManList == ''
          || this.dataForm.copyManList == ''
        ) {
          this.$message({
            message: '右下角选项不能为空',
            type: 'error',
          });
          return;
        }
      }
      // *****结束
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          if (this.throttleFlag == false) {
            return;
          }
          this.throttleFlag = false;
          this.$http({
            url: this.$http.adornUrl('/ottffemergency/ottffemergencyinfo/update'),
            method: 'post',
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              longitude: this.dataForm.longitude,
              latitude: this.dataForm.latitude,
              annexs,
              address: this.dataForm.address,
              // reportName: this.dataForm.reportName,
              // reportPhone: this.dataForm.reportPhone,
              // reportTime: this.dateFormatter(this.dataForm.reportTime),
              // sourceId: this.dataForm.source,
              // typeId: this.dataForm.type[this.dataForm.type.length - 1],
              // title: this.dataForm.title,
              // time: this.dateFormatter(this.dataForm.time),
              // detail: this.dataForm.detail,
              // status: this.dataForm.status,
              // opinion: this.dataForm.opinion,
              // leadershipDirective: this.dataForm.leadershipDirective,
              // emergencyType: this.emergencyType,
              // isOpen: this.isOpen,
              // mailGroup: this.dataForm.mailGroup,
              // contactorId: this.dataForm.contactorId,
              // participantsManList: this.dataForm.participantsManList.map(
              //   (e) => e.id,
              // ),
              // copyManList: this.dataForm.copyManList.map((e) => e.id),
              // mailGroupName: this.dataForm.mailGroupName,
              // chargeMan: this.dataForm.chargeMan,
              // chargeManDetail: this.dataForm.chargeManDetail,
              // position: this.dataForm.position,
              // mobile1: this.dataForm.mobile1,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  // this.visible = false
                  this.throttleFlag = true;
                  // this.$parent.getDataList();
                  this.$router.back(-1);
                  this.$emit('refreshDataList');
                },
              });
              console.log(`工单${this.dataForm.isOpen}`);
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    // 格式化起始时间结束时间
    dateFormatter(str) {
      // 默认返回yyyy-MM-dd HH-mm-ss
      const hasTime = arguments[1] != false; // 可传第二个参数false，返回yyyy-MM-dd
      const d = new Date(str);
      const year = d.getFullYear();
      const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
      const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
      const hour = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours();
      const minute = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
      const second = d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds();
      if (hasTime) {
        return (
          `${[year, month, day].join('-')} ${[hour, minute, second].join(':')}`
        );
      }
      return [year, month, day].join('-');
    },

    /**
     * @method
     * @author tanjinfeng
     * @date 2020-10-26
     * @desc 事发地点选择器赋值
     */
    addressSelectionInit() {
      this.mapOptions.districtSearch = new AMap.DistrictSearch({
        //  显示下级行政区级数，1表示返回下一级行政区
        subdistrict: 1,
        showbiz: false,
        extensions: 'all',
      });
      // 查询当前平台坐标所在的城市和区县，设置地图中心
      AMap.plugin('AMap.DistrictSearch', () => {
        const currentLngLat = [
          this.$cookie.get('longitude'),
          this.$cookie.get('latitude'),
        ];
        // 设置中心
        if (!this.mapOptions.lng) {
          this.mapOptions.map.setCenter(
            new AMap.LngLat(currentLngLat[0], currentLngLat[1]),
          );
        }
        // 坐标转换地址组件
        const geocoder = new AMap.Geocoder({ extensions: 'all' });
        // 获取所在的城市、区县、街道
        geocoder.getAddress(currentLngLat, (status, result) => {
          if (status === 'complete' && result.regeocode) {
            const currentCity = (this.addressOptions.city = result.regeocode.addressComponent.city);
            const currentDistrict = (this.addressOptions.district = result.regeocode.addressComponent.district);
            const currentTownship = (this.addressOptions.street = result.regeocode.addressComponent.township);
            // 获取所有区县
            this.mapOptions.districtSearch.search(
              currentCity,
              (status, result) => {
                if (status === 'complete') {
                  this.addressOptions.districtOptions = result.districtList[0].districtList.map(
                    (e) => ({
                      label: e.name,
                      value: e.name,
                      lnglat: [e.center.lng, e.center.lat],
                    }),
                  );
                }
              },
            );
            // 获取所有镇街
            this.mapOptions.districtSearch.search(
              currentDistrict,
              (status, result) => {
                if (status === 'complete') {
                  this.addressOptions.streetOptions = result.districtList[0].districtList.map(
                    (e) => ({
                      label: e.name,
                      value: e.name,
                      lnglat: [e.center.lng, e.center.lat],
                    }),
                  );
                  // 绘制区县区域
                  for (
                    let i = 0, l = result.districtList[0].boundaries.length;
                    i < l;
                    i++
                  ) {
                    const polygon = new AMap.Polygon({
                      map: this.mapOptions.map,
                      strokeWeight: 1,
                      strokeColor: '#0091ea',
                      fillColor: '#80d8ff',
                      fillOpacity: 0.2,
                      path: result.districtList[0].boundaries[i],
                    });
                    polygon.on('click', this.mapOptions.events.click);
                    this.mapOptions.polygons.push(polygon);
                  }
                }
              },
            );
          }
        });
      });
    },
    /**
     * @method
     */
    addressSelectionChange(value, flag) {
      if (flag === 'district') {
        this.addressOptions.street = '';
        this.mapOptions.districtSearch.search(value, (status, result) => {
          if (status === 'complete') {
            console.log(result);
            this.addressOptions.streetOptions = result.districtList[0].districtList.map(
              (e) => ({
                label: e.name,
                value: e.name,
                lnglat: [e.center.lng, e.center.lat],
              }),
            );
            // 绘制区县区域
            for (
              let i = 0, l = result.districtList[0].boundaries.length;
              i < l;
              i++
            ) {
              const polygon = new AMap.Polygon({
                map: this.mapOptions.map,
                strokeWeight: 1,
                strokeColor: '#0091ea',
                fillColor: '#80d8ff',
                fillOpacity: 0.2,
                path: result.districtList[0].boundaries[i],
              });
              polygon.on('click', this.mapOptions.events.click);
              this.mapOptions.map.remove(this.mapOptions.polygons);
              this.mapOptions.polygons = [polygon];
            }
            this.mapOptions.map.setFitView();
          }
        });
      } else if (flag === 'street') {
        const street = this.addressOptions.streetOptions.find(
          (e) => e.value == value,
        );
        // 设置地图中心
        this.mapOptions.map.setCenter(
          new AMap.LngLat(street.lnglat[0], street.lnglat[1]),
        );
        // 缩放
        this.mapOptions.map.setZoom(15);
      }
    },
  },
};
</script>
<style lang="less">
.emergencyinfo-add-or-update {
  .back {
    position: absolute;
    left: 2%;
    top: 20%;
  }
  .el-form-item {
    margin: initial;
  }
  .el-col {
    padding: 15px 30px;
  }
  .el-row {
    border: 1px solid #bcbcbc;
    border-bottom: initial;
  }
  .amap-demo {
    height: 1000px;
    width: 95%;
    margin: auto;
  }
  .search-box {
    width: 65%;
    border: 1px solid #bcbcbc;
  }
  textarea {
    resize: none;
  }
  .el-upload.el-upload--text {
    text-align: initial;
  }

  .mapSelectOptions {
    .input-item {
      position: relative;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: wrap;
      flex-wrap: wrap;
      -ms-flex-align: center;
      align-items: center;
      width: 100%;
      height: 3rem;
    }

    .input-item:last-child {
      margin-bottom: 0;
    }

    .input-item > select,
    .input-item > input[type="text"],
    .input-item > input[type="date"] {
      position: relative;
      -ms-flex: 1 1 auto;
      flex: 1 1 auto;
      width: 1%;
      margin-bottom: 0;
    }

    .input-item > select:not(:last-child),
    .input-item > input[type="text"]:not(:last-child),
    .input-item > input[type="date"]:not(:last-child) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    .input-item > select:not(:first-child),
    .input-item > input[type="text"]:not(:first-child),
    .input-item > input[type="date"]:not(:first-child) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }

    .input-item-prepend {
      margin-right: -1px;
    }

    .input-item-text,
    input[type="text"],
    input[type="date"],
    select {
      height: calc(2.2rem + 2px);
    }

    .input-item-text {
      width: 6rem;
      text-align: justify;
      padding: 0.4rem 0.7rem;
      display: inline-block;
      text-justify: distribute-all-lines;
      /*ie6-8*/
      text-align-last: justify;
      /* ie9*/
      -moz-text-align-last: justify;
      /*ff*/
      -webkit-text-align-last: justify;
      /*chrome 20+*/
      -ms-flex-align: center;
      align-items: center;
      margin-bottom: 0;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
      color: #495057;
      text-align: center;
      white-space: nowrap;
      background-color: #e9ecef;
      border: 1px solid #ced4da;
      border-radius: 0.25rem;
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
    }

    .input-item-text input[type="checkbox"],
    .input-item-text input[type="radio"] {
      margin-top: 0;
    }
  }

  .orderContainer {
    margin-top: 655px;
    right: 2%;
    height: 280px;
    overflow: auto;
    float: right;
    display: flex;
    width: 37%;
    display: block;
    position: relative;
    el-row.judgeLine {
      el-switch.switch {
        padding-left: 50px;
        position: relative;
      }
    }

    el-form.table {
      el-row {
        el-col {
          .sub-title {
          }

          div {
            el-input.charge {
              font-color: black;
              border: 1px solid #bcbcbc;
              float: left;
            }

            el-button {
              float: right;
            }

            undefined {
            }
          }
        }
      }

      el-form.choiceInput {
        el-button {
        }

        span {
          .contactMan {
            el-input.inputPerson {
            }

            img {
            }
          }
        }
      }
    }
  }

  undefined {
  }

  getdepartmentlist {
  }

  getcontactorlist {
  }

  linkman-draggable {
  }

  .fileList__show {
    display: flex;
    width: 100%;
    height: 30px;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
      color: #17b3a1;
      border-radius: 5px;
    }

    .fileList__name {
      padding-left: 5px;
    }
  }
}
</style>
