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
        <el-radio-button label="登记信息" />
        <el-radio-button label="处置过程" />
        <el-radio-button label="通讯记录" />
        <el-radio-button label="工单信息" />
        <!-- 莘县工单 -->
      </el-radio-group>
      <el-tooltip
        class="item"
        effect="dark"
        content="浏览"
        placement="top"
      >
        <i
          v-if="radioGroupVisible == '登记信息'"
          class="el-icon-view"
          style="
            font-size: 30px;
            color: #bcbcbc;
            position: absolute;
            right: 8%;
            top: 50%;
            transform: translateY(-50%);
          "
          @click="previewEmergency"
        />
      </el-tooltip>
      <!-- <el-tooltip class="item" effect="dark" content="下载" placement="top">
      <i v-if="radioGroupVisible=='登记信息'" class="iconfont icon-xiazai1" style="font-size: 34px;color: #bcbcbc;position: absolute;right: 5%;top: 50%;transform: translateY(-50%);"></i>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="打印" placement="top">
      <i v-if="radioGroupVisible=='登记信息'" class="iconfont icon-duanxinfasongrizhi"  style="font-size: 34px;color: #bcbcbc;position: absolute;right: 2%;top: 50%;transform: translateY(-50%);"></i>
      </el-tooltip>-->
    </div>
    <div
      v-if="radioGroupVisible == '登记信息'"
      style="width: 100%; position: relative"
    >
      <el-form
        ref="dataForm"
        class="emergencyinfoForm"
        :model="dataForm"
        :rules="dataRule"
        label-width="80px"
        size="medium "
        style="width: 57%; display: inline-block; margin-left: 2%"
        @submit.native.prevent
      >
        <el-row style="text-align: center; position: relative">
          <el-col :span="24">
            <span>要情登记表</span>
            <!-- <el-button v-if="$route.query.status=='update'&&$route.query.operationStatus!='已办结'" icon="el-icon-edit-outline" @click="editAble=!editAble" style="width: 85px;height: 36px;position: absolute;right: 2%;top: 50%;transform: translateY(-50%);">修改</el-button> -->
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :span="12"
            style="border-right: 1px solid #bcbcbc"
          >
            <el-form-item
              label="报送人"
              prop="reportName"
            >
              <el-input
                v-model="dataForm.reportName"
                placeholder="报送人名称"
                :disabled="editAble"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- <el-form-item label="报送时间" prop="reportTime">
            <el-input v-model="dataForm.reportTime" placeholder="报送时间"></el-input>
            </el-form-item>-->
            <el-form-item
              label="接报时间"
              prop="reportTime"
            >
              <el-date-picker
                v-model="dataForm.reportTime"
                type="datetime"
                placeholder="选择接报时间"
                :disabled="editAble"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :span="12"
            style="border-right: 1px solid #bcbcbc"
          >
            <el-form-item label="来电号码">
              <el-input
                v-model="dataForm.reportPhone"
                placeholder="来电号码"
                :disabled="editAble"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col
            :span="12"
            style="border-right: 1px solid #bcbcbc"
            v-if="editAble"
          >
            <el-form-item label="要情标题" prop="title">
              <el-input
                v-model="dataForm.title"
                placeholder="标题"
                :disabled="editAble"
              ></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <!-- <el-form-item label="要情来源" prop="source">
            <el-input v-model="dataForm.source" placeholder="要情来源"></el-input>
            </el-form-item>-->
            <el-form-item
              label="要情来源"
              prop="source"
            >
              <el-select
                v-model="dataForm.source"
                placeholder="选择要情来源"
                :disabled="editAble"
              >
                <el-option
                  v-for="(item, idx) in sourceOptions"
                  :key="idx"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :span="12"
            style="border-right: 1px solid #bcbcbc"
          >
            <el-form-item
              label="要情标题"
              prop="title"
            >
              <el-input
                v-model="dataForm.title"
                placeholder="标题"
                :disabled="editAble"
              />
            </el-form-item>
            <!-- 回访满意度 -->
            <!-- <el-form-item
              class="margin__top"
              label="满意度"
              prop="satisfaction"
            >
              <el-cascader
                v-model="dataForm.satisfaction"
                :options="satisfactionOptions"
                :disabled="editAble"
              />
            </el-form-item> -->
          </el-col>
          <el-col :span="12">
            <!-- <el-form-item label="要情分类" prop="type">
            <el-input v-model="dataForm.type" placeholder="要情类型"></el-input>
            </el-form-item>-->
            <el-form-item
              label="要情分类"
              prop="type"
            >
              <el-radio-group
                v-model="emergencyType"
                :disabled="editAble"
                @change="initEmergencyType"
              >
                <el-radio label="1">
                  普通事件
                </el-radio>
                <el-radio label="2">
                  突发事件
                </el-radio>
              </el-radio-group>

              <el-cascader
                v-model="dataForm.type"
                :options="typeOptions"
                :disabled="editAble"
              />

              <!-- <el-select
                v-model="dataForm.type"
                placeholder="选择要情分类"
                :disabled="editAble"
              >
                <el-option
                  v-for="(item, idx) in typeOptions"
                  :key="idx"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>-->
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col
            :span="12"
            style="border-right: 1px solid #bcbcbc"
          >
            <!-- <el-form-item label="事发时间" prop="time">
            <el-input v-model="dataForm.time" placeholder="事生时间"></el-input>
            </el-form-item>-->
            <el-form-item
              label="事发时间"
              prop="time"
            >
              <el-date-picker
                v-model="dataForm.time"
                type="datetime"
                placeholder="选择事发时间"
                :disabled="editAble"
                :picker-options="{
                  disabledDate(date) {
                    return new Date(date) > Date.now();
                  }
                }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="要情状态"
              prop="status"
            >
              <el-radio-group
                v-model="dataForm.status"
                :disabled="editAble"
              >
                <el-radio :label="0">
                  待办
                </el-radio>
                <el-radio :label="1">
                  办理中
                </el-radio>
                <el-radio :label="2">
                  已办结
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item
              label="要情详情"
              prop="detail"
            >
              <el-input
                v-model="dataForm.detail"
                style="resize: none"
                type="textarea"
                :autosize="true"
                placeholder="要情详情"
                :disabled="editAble"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item
              label="事发地点"
              prop="address"
            >
              <el-select
                v-if="!editAble"
                v-model="addressOptions.district"
                placeholder="请选择区/县"
                @change="addressSelectionChange($event, 'district')"
              >
                <el-option
                  v-for="district in addressOptions.districtOptions"
                  :key="district.value"
                  :label="district.label"
                  :value="district.value"
                />
              </el-select>
              <el-select
                v-if="!editAble"
                v-model="addressOptions.street"
                placeholder="请选择街道/镇"
                @change="addressSelectionChange($event, 'street')"
              >
                <el-option
                  v-for="street in addressOptions.streetOptions"
                  :key="street.value"
                  :label="street.label"
                  :value="street.value"
                />
              </el-select>
              <el-input
                v-model="dataForm.address"
                placeholder="事发地点"
                :disabled="editAble"
              />
            </el-form-item>
            <!-- <el-form-item label="事发地点" style>
              <div class="mapSelectOptions" style="display: flex;align-items: center;">
                <div
                  class="input-item"
                  v-if="
                    $window.JSON.parse(
                      $window.localStorage.getItem('platformInfo')
                    ).flag == 'province'
                  "
                >
                  <div class="input-item-prepend">
                    <span class="input-item-text">省市区</span>
                  </div>
                  <select
                    id="province"
                    style="width:100px"
                    @change="
                      search($window.document.getElementById('province'))
                    "
                  ></select>
                </div>
                <div
                  class="input-item"
                  v-if="
                    $window.JSON.parse(
                      $window.localStorage.getItem('platformInfo')
                    ).flag == 'city' ||
                      $window.JSON.parse(
                        $window.localStorage.getItem('platformInfo')
                      ).flag == 'province'
                  "
                >
                  <div class="input-item-prepend">
                    <span class="input-item-text">地级市</span>
                  </div>
                  <select
                    id="city"
                    style="width:100px"
                    @change="search($window.document.getElementById('city'))"
                  ></select>
                </div>
                <div
                  class="input-item"
                  v-if="
                    $window.JSON.parse(
                      $window.localStorage.getItem('platformInfo')
                    ).flag == 'district' ||
                      $window.JSON.parse(
                        $window.localStorage.getItem('platformInfo')
                      ).flag == 'city' ||
                      $window.JSON.parse(
                        $window.localStorage.getItem('platformInfo')
                      ).flag == 'province'
                  "
                >
                  <div class="input-item-prepend">
                    <span class="input-item-text">区县</span>
                  </div>
                  <select
                    id="district"
                    style="width:100px"
                    @change="
                      search($window.document.getElementById('district'))
                    "
                  ></select>
                </div>
                <div class="input-item">
                  <div class="input-item-prepend">
                    <span class="input-item-text">街道</span>
                  </div>
                  <select
                    id="street"
                    style="width:100px"
                    @change="
                      setCenter($window.document.getElementById('street'))
                    "
                  ></select>
                </div>
                <el-input v-model="dataForm.address" placeholder="事发地点" :disabled="editAble" style></el-input>
              </div>
            </el-form-item> -->
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="拟办意见">
              <el-input
                v-model="dataForm.opinion"
                style="resize: none"
                type="textarea"
                :autosize="true"
                placeholder="拟办意见"
                :disabled="editAble"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="领导批示">
              <el-input
                v-model="dataForm.leadershipDirective"
                style="resize: none"
                type="textarea"
                :autosize="true"
                placeholder="领导批示"
                :disabled="editAble"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="border-bottom: 1px solid #bcbcbc">
          <el-col :span="24">
            <el-form-item
              label="附件"
              style="height: 300px; overflow: auto"
            >
              <sv-upload
                v-model="dataForm.annex"
                :is-view="$route.query.status === 'watch' ? true : false"
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
          position: [{{ mapOptions.lng }}, {{ mapOptions.lat }}] address:
          {{ mapOptions.address }}
        </div>
      </div>

      <!-- 右下角工单部分 -->
      <div class="orderContainer">
        <el-row class="judgeLine">
          派人处置
          <el-switch
            v-model="isOpen"
            class="switch"
            active-value="1"
            inactive-value="2"
            active-text="是"
            inactive-text="否"
          />
        </el-row>
        <el-form
          v-if="isOpen == '1'"
          class="table"
        >
          <el-row>
            <el-col
              :span="10"
              style="border-right: 1px solid #bcbcbc"
            >
              <div class="sub-title">
                处置部门
              </div>
              <div
                label="处置部门选择"
                style="display: flex"
              >
                <el-input
                  v-model="dataForm.mailGroupName"
                  class="charge"
                  placeholder="请选择处置部门"
                  disabled
                />
                <el-button
                  type="primary"
                  @click="showDepList"
                >
                  选择
                </el-button>
                <!-- <el-select name="selected" v-model="dataForm.mailGroupName" @change="showDepList">
                        <option :value="dataForm.depId" v-for="mailGroup in departmentListData" :class="dataForm.depId">{{dataForm.mailGroupName}}</option>
                      </el-select> -->
              </div>
            </el-col>

            <el-col :span="13">
              <div class="sub-title">
                工单负责人
              </div>
              <div
                label="负责人选择"
                style="display: flex"
              >
                <el-input
                  v-model="dataForm.chargeManDetail"
                  class="charge"
                  placeholder="请选择工单负责人"
                  disabled
                />
                <el-button
                  type="primary"
                  @click="showContactorList"
                >
                  选择
                </el-button>
              </div>
            </el-col>
          </el-row>

          <!-- <el-row>工单参与人</el-row>

            <el-form class="choiceInput" style="display: block; background-color: #E9EEF3; width: 100%; height: 135px;">
              <el-button @click="contactViewHandle" type="primary" style="margin-top: 8px; margin-left: 20px;">+选择参与人</el-button>
                <span v-for="(item,index) in contactorName" :key="index">
                  <div class="contactMan" label="参与人" style="margin-top: 5px; margin-left: 20px;">
                      <el-input class="inputPerson" placeholder="张安" v-model="item.name" style="width: 200px; text-align: center;" disabled></el-input>
                      <img src="../../../../assets/img/delete.png" @click="deleteItem(item.id, contactorName, dataForm.participantsManList)" style="width: 30px; height: 30px;"/>
                  </div>
                </span>
            </el-form>

            <el-form class="choiceInput" style="display: block; background-color: #E9EEF3; width: 100%; height: 135px; margin-top: 10px;">
              <el-button @click="copyViewHandle" type="primary" style="margin-top: 8px; margin-left: 20px; position: relative;">+选择抄送人</el-button>
                <span v-for="(item,index) in copyName" :key="index">
                  <div class="contactMan" label="抄送人" style="margin-top: 5px; margin-left: 20px;">
                    <el-input class="inputPerson" v-model="item.name" style="width: 200px; text-align: center;" disabled></el-input>
                    <img src="../../../../assets/img/delete.png" @click="deleteItem(item.id, copyName, dataForm.copyManList)" style="width: 30px; height: 30px;"/>
                  </div>
                </span>
            </el-form> -->

          <el-row style="border: 1px solid #bcbcbc; border-bottom: none">
            <sv-select-contact
              v-model="dataForm.participantsManList"
              title="参与人"
              :multiple="true"
            />
          </el-row>
          <el-row
            style="
              border: 1px solid #bcbcbc;
              border-top: none;
              padding-top: 10px;
            "
          >
            <sv-select-contact
              v-model="dataForm.copyManList"
              title="抄送人"
              :multiple="true"
            />
          </el-row>
        </el-form>
      </div>

      <!-- 处置部门弹窗 -->
      <getDepartmentList
        ref="getDepartmentList"
        :dep-id="dataForm.depId"
        @checkDepId="checkDepId"
      />
      <!-- 工单负责人弹窗 -->
      <getContactorList
        ref="getContactorList"
        :contactor-id="dataForm.contactorId"
        :dep-id="this.dataForm.depId"
        @checkContactorId="checkContactorId"
      />
      <!-- 参与人弹窗 -->
      <linkman-draggable
        v-show="showcommonLink"
        ref="commonLink"
        @OnchildByValue="handleLinkdata"
      />
      <!-- 抄送人弹窗 -->
      <linkman-draggable
        v-show="showcopyLink"
        ref="copyLink"
        @OnchildByValue="handleCopyLinkdata"
      />

      <div
        v-if="!editAble"
        style="text-align: center; margin: 30px auto 20px auto"
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

    <div
      v-if="$route.query.status === 'audio' && radioGroupVisible == '登记信息'"
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
      v-if="radioGroupVisible == '处置过程'"
      style="width: 100%; position: relative; height: 700px; overflow: auto"
    >
      <emergencyhandleprocess
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
      v-if="radioGroupVisible == '工单信息' && workType === -1"
      style="
        width: 100%;
        position: relative;
        background: lightblue;
        height: 600px;
      "
    >
      <emergencyhandleOrder
        style="width: 100%; height: 100%"
      />
    </div>
    <div
      v-if="radioGroupVisible == '工单信息' && workType === 0"
      style="
        width: 100%;
        position: relative;
        background: lightblue;
        height: 600px;
      "
    >
      <handleOrder
        :sheet-data="sheetData"
        style="width: 100%; height: 100%"
      />
    </div>
    <previewEmergencyDialog
      v-if="previewEmergencyDialogVisible"
      ref="previewEmergencyDialog"
    />
    <sv-dialog-hint
      ref="hint_fail"
      type="fail"
      text="抱歉，上传失败！"
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
import axios from 'axios';
import previewEmergencyDialog from './previewEmergencyDialog';
import emergencyhandleprocess from './emergencyhandleprocess';
import emergencyhandleCommunicationLog from './emergencyhandleCommunicationLog.vue';
import emergencyhandleOrder from './emergencyhandleOrder';
import emergencyhandleprocessannex from './emergencyhandleprocessannex';
import audioComponent from '../../sys/combined/history/audio.vue';
import handleOrder from '../../PhoneRecord/PhoneRecordHandleOrder-shenxian';
// import local from '@/store/modules/contactor'

export default {
  components: {
    previewEmergencyDialog,
    emergencyhandleprocess,
    emergencyhandleprocessannex,
    emergencyhandleCommunicationLog,
    emergencyhandleOrder,
    audioComponent,
    PreplanDocument,
    handleOrder,
    getDepartmentList,
    getContactorList,
    LinkmanDraggable,
  },
  data() {
    const self = this;
    return {
      workType: -1,
      sheetData: {},
      testFileList: [],
      // 图片资源所在的服务器地址
      cloudUrl: window.SITE_CONFIG.cloudUrl,
      otherFileList: [], // 除图片外的附件类型的名字及地址
      imageList: [], // 附件类型为图片
      upLoadApi: '/upload/emergencyHandleProcessFile', // 文件上传api
      uploading: false, // 上传加载提示
      throttleFlag: true, // 节流标志
      dialogDocumentVisible: false, // 预览文件弹窗
      documentUrl: '', // 预览文件路径
      tip: '',

      previewEmergencyDialogVisible: false,
      editAble:
        !!(this.$route.query.status === 'watch'
        || this.$route.query.operationStatus == '已办结'),
      radioGroupVisible: '登记信息',
      elRadio: '登记信息',
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
      // 满意度选项
      satisfactionOptions: [],
      // 满意度字段
      satisfactionString: '',
      sourceOptions: [],
      visible: false,
      fileList: [],

      isOpen: '1',

      // let storage = {
      //   getStorage(options) {
      //     let config={}
      //   }
      // }

      dataForm: {
        id: 0,
        reportName: '',
        reportPhone: '',
        reportTime: '',
        source: '',
        type: '',
        title: '',
        // 满意度
        satisfaction: '',
        time: '',
        address: '',
        detail: '',
        status: '',
        opinion: '',
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
        satisfaction: [
          { required: true, message: '满意度不能为空', trigger: 'blur' },
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
  watch: {
    'dataForm.annex': function (newValue, oldValue) {
      if (this.dataForm.annex.length > 0) {
        this.dataForm.annex.forEach((item, index) => {
          if (item.type == 0) {
            const temporaryObject = imageWithHttp.withHttp(item.url);
            setTimeout(() => {
              this.$set(item, 'temporaryUrl', temporaryObject.image);
              this.$forceUpdate();
            }, 1500);
          }
        });
      }
    },
  },
  created() {
    this.$window = window;
    this.$Cookies = Cookies;
    // console.log("this.$router",this.$router,this.$route)
    this.initSelectOptions();
    // 初始化回访满意度选项
    this.initSatisfactionOptions();
    if (
      this.$route.query.status === 'update'
      || this.$route.query.status === 'watch'
      || this.$route.query.status === 'audio'
    ) {
      this.init();
    }
  },
  mounted() {
    const currentLngLat = [this.$cookie.get('longitude'), this.$cookie.get('latitude')]
    const geocoder = new AMap.Geocoder({extensions: 'all'})
    // 获取初始点所在的城市
    geocoder.getAddress(
      currentLngLat,
      (status, result) => {
        if (status === 'complete' && result.regeocode) {
          this.mapOptions.searchOption = { city: result.regeocode.addressComponent.citycode, citylimit: true }
        } else {
          console.log('坐标地址转换失败！错误信息：【\n', status, result, '\n】')
        }
      }
)
    setTimeout(() => {
      // console.log("self.mapOptions.map",this.mapOptions.map,this.mapOptions,this.mapOptions.map.panTo)
      // this.initMapSelectOptions();
      this.addressSelectionInit();
    }, 1000);
  },
  methods: {
    /**
      * @method
      * @desc 文件上传，返回文件保存在服务器中的地址
      * @param {object} event 上传文件事件
      */
    getFile(event) {
      this.uploading = true;
      const upLoadUrl = window.SITE_CONFIG.baseUrl + this.upLoadApi;
      const fileList = event.target.files;
      const request = [];
      fileList.forEach((file) => {
        const formData = new FormData();
        formData.append('file', file);
        request.push(axios({
          method: 'post',
          url: upLoadUrl,
          baseUrl: window.SITE_CONFIG.baseUrl,
          data: formData,
          headers: {
            'content-type': 'multipart/form-data;charset=UTF-8;',
            token: this.$cookie.get('token'),
          },
        }));
      });
      axios.all(request).then(axios.spread((...responseList) => {
        responseList.forEach((response) => {
          if (response.data.code === 0) {
            const isImageUrl = response.data.data.url;
            this.testFileList.push({
                name: response.data.data.name,
                url: response.data.data.url,
              });
            if (isImageUrl.match(/\.(png|jpe?g|svg|bmp|gif|webp)$/i)) {
              this.imageList.push({
                name: response.data.data.name,
                url: response.data.data.url,
              });
            } else {
              this.otherFileList.push({
                name: response.data.data.name,
                url: response.data.data.url,
              });
            }
          } else {
            this.$refs.hint_fail.supplementText = `错误代码：${response.data.code}`;
            this.$refs.hint_fail.visible = true;
          }
        });
        event.srcElement.value = '';
        this.uploading = false;
      })).catch((error) => {
        this.uploading = false;
        this.$refs.hint_fail.supplementText = error;
        this.$refs.hint_fail.visible = true;
      });
    },
    /**
     * @method
     * @desc 删除文件
     * @param {String} url 文件的地址（唯一值）
     */
    deleteFile(url) {
      if (this.imageList.findIndex((element) => element.url === url) > -1) {
        const index = this.imageList.findIndex((element) => element.url === url);
        this.imageList.splice(index, 1);
      } else {
        const index = this.otherFileList.findIndex((element) => element.url === url);
        this.otherFileList.splice(index, 1);
      }
    },
    // 上传组件文件列表
    pointerAction() {},

    enlargeMap() {
      if (document.querySelector('.mapContainer').style.width == '37%') {
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
        document
          .querySelector('.mapContainer')
          .setAttribute(
            'style',
            'width: 37%;border: 1px solid #bcbcbc;display: inline-block;position:absolute;top:0%;right: 2%;',
          );
        document.querySelector(
          '.el-vue-amap-container.amap-demo',
        ).style.height = '500px';
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
    init(id) {
      this.workType = this.$Cookies.get('platformName').search('莘县');
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
              `/emergency/emergencyinfo/info/${this.$route.query.id}`,
            ),
            method: 'get',
            params: this.$http.adornParams(),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              console.log(
                '/emergency/emergencyinfo/info data',
                data,
                this.dataForm,
              );
              this.sheetData = data.emergencyInfo;
              this.dataForm.source = data.emergencyInfo.sourceId;
              this.dataForm.reportName = data.emergencyInfo.reportName;
              this.dataForm.reportPhone = data.emergencyInfo.reportPhone;
              this.dataForm.reportTime = data.emergencyInfo.reportTime;
              this.dataForm.title = data.emergencyInfo.title;
              this.dataForm.time = data.emergencyInfo.time;
              this.mapOptions.address = data.emergencyInfo.address;
              this.dataForm.address = data.emergencyInfo.address;
              this.dataForm.detail = data.emergencyInfo.detail;
              this.dataForm.status = data.emergencyInfo.status;
              this.dataForm.opinion = data.emergencyInfo.opinion;
              this.dataForm.leadershipDirective = data.emergencyInfo.leadershipDirective;
              this.dataForm.images = data.emergencyInfo.images;
              this.dataForm.annex = data.emergencyInfo.annexs;
              this.fileList = this.dataForm.annex;
              this.mapOptions.lng = data.emergencyInfo.longitude;
              this.mapOptions.lat = data.emergencyInfo.latitude;
              this.dataForm.longitude = data.emergencyInfo.longitude;
              this.dataForm.latitude = data.emergencyInfo.latitude;
              this.dataForm.createTime = data.emergencyInfo.createTime;
              this.dataForm.updateTime = data.emergencyInfo.updateTime;
              this.dataForm.createUserId = data.emergencyInfo.createUserId;
              this.dataForm.updateUserId = data.emergencyInfo.updateUserId;
              this.dataForm.isDeleted = data.emergencyInfo.isDeleted;
              this.emergencyType = data.emergencyInfo.emergencyType;

              this.isOpen = data.emergencyInfo.isOpen;
              this.dataForm.mailGroup = data.emergencyInfo.mailGroup;
              // this.dataForm.contactorId = data.emergencyInfo.contactorId;
              // this.dataForm.participantsManList = data.emergencyInfo.participantsManList;
              // this.dataForm.copyManList = data.emergencyInfo.copyManList;
              this.dataForm.mailGroupName = data.emergencyInfo.mailGroupName;
              this.dataForm.chargeMan = data.emergencyInfo.chargeMan
                ? data.emergencyInfo.chargeMan
                : this.dataForm.chargeMan;
              // this.dataForm.chargeManDetail = data.emergencyInfo.chargeManDetail ? data.emergencyInfo.chargeManDetail : this.dataForm.chargeManDetail;
              this.dataForm.position = data.emergencyInfo.position;
              this.dataForm.mobile1 = data.emergencyInfo.mobile1;
              this.dataForm.satisfaction = data.emergencyInfo.returnSatisfactionId;
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
          // 将满意度的值转换为对应的字段
          this.satisfactionString = '';
          // switch (this.dataForm.satisfaction[0]) {
          //   case '1':
          //     this.satisfactionString = '非常满意';
          //     break;
          //   case '2':
          //     this.satisfactionString = '满意';
          //     break;
          //   case '3':
          //     this.satisfactionString = '一般';
          //     break;
          //   case '4':
          //     this.satisfactionString = '不满意';
          //     break;
          //   case '5':
          //     this.satisfactionString = '非常不满意';
          //     break;
          //   default:
          // }
          this.$http({
            url: this.$http.adornUrl(
              `/emergency/emergencyinfo/${
                !this.dataForm.id ? 'save' : 'update'
              }`,
            ),
            method: 'post',
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              reportName: this.dataForm.reportName,
              reportPhone: this.dataForm.reportPhone,
              reportTime: this.dateFormatter(this.dataForm.reportTime),
              sourceId: this.dataForm.source,
              typeId: this.dataForm.type[this.dataForm.type.length - 1],
              title: this.dataForm.title,
              time: this.dateFormatter(this.dataForm.time),
              address: this.dataForm.address,
              detail: this.dataForm.detail,
              status: this.dataForm.status,
              opinion: this.dataForm.opinion,
              leadershipDirective: this.dataForm.leadershipDirective,
              longitude: this.dataForm.longitude,
              latitude: this.dataForm.latitude,
              annexs,
              emergencyType: this.emergencyType,

              isOpen: this.isOpen,
              mailGroup: this.dataForm.mailGroup,
              contactorId: this.dataForm.contactorId,
              participantsManList: this.dataForm.participantsManList.map(
                (e) => e.id,
              ),
              copyManList: this.dataForm.copyManList.map((e) => e.id),
              mailGroupName: this.dataForm.mailGroupName,
              chargeMan: this.dataForm.chargeMan,
              chargeManDetail: this.dataForm.chargeManDetail,
              position: this.dataForm.position,
              mobile1: this.dataForm.mobile1,
              // returnSatisfactionId: this.dataForm.satisfaction[0],
              returnSatisfactionIdString: this.satisfactionString,
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
                  this.$parent.getDataList();
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
    /**
     * @description: 初始化回访满意度选项
     */
    initSatisfactionOptions() {
      this.satisfactionOptions = [];
      this.dataForm.satisfaction = [];
      this.$http({
        url: this.$http.adornUrl(
          '/sys/sysdictionary/getSysDictionaryListByCode?code=return_visit_result_id',
        ),
        method: 'get',
        param: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          const obj = [...data.data];
          // 添加value和label字段
          data.data.forEach((item, index) => {
            obj[index].value = item.code;
            obj[index].label = item.name;
          });
          this.satisfactionOptions = obj;
        } else {
          this.$message({
            message: `${data.msg}`,
            type: 'error',
          });
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>

.emergencyinfo-add-or-update {
  .sv-upload-img {
    font-size: 0;
    * {user-select: none}
    &__container {
        margin-bottom: -10px;
        padding-top: 5px;
    }
    &__item,
    &__button {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 88px;
        height: 35px;
        line-height: 1.5;
        border-radius: 4px;
        font-size: 12px;
        color: #0091FF;
        margin: 0 10px 10px 0;
        position: relative;
        vertical-align: bottom;
    }
    &__item {
        border: 1px solid #9FC8FE;
        height: 64px;
        border-radius: 1px;
        cursor: zoom-in;
        img {
            height: 63px;
            max-height: 63px;
            max-width: 100%;
        }
        &__delete {
            cursor: pointer;
            display: inline-block;
            width: 20px;
            height: 20px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 10px;
            position: absolute;
            right: -5px;
            top: -5px;
            &:before {
                content: '';
                display: block;
                width: 12px;
                height: 12px;
                margin: 4px;
                background: no-repeat center/100% 100% url('../../../../sinvieUI/img/upload_delete.svg');
            }
            &:hover {
                background: #F66E6E;
            }
        }
    }
    &__button {
        border: 1px dashed #9FC8FE;
        cursor: pointer;
        &:hover {
            border: 1px solid #0091FF;
        }
        照相机图标
        &::before {
            content: '';
            display: block;
            width: 36px;
            height: 36px;
            margin: 5px auto 0;
            background: no-repeat center/100% 100% url('../../../../sinvieUI/img/upload_img.svg');
        }
    }
}
.upload-file{
  display: inline;
  &__item{
  margin-top: 10px;
  background: #9FC8FE;
  border: 1px dashed #9FC8FE;
  border-radius: 4px;
  position: relative;
  padding-left:10px;
  &:hover {
    border: 1px solid #0091FF;
  }
  &__delete {
            cursor: pointer;
            display: inline-block;
            width: 20px;
            height: 20px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 10px;
            position: absolute;
            right: -1px;
            top: -1px;
            &:before {
                content: '';
                display: block;
                width: 12px;
                height: 12px;
                margin: 4px;
                background: no-repeat center/100% 100% url('../../../../sinvieUI/img/upload_delete.svg');
            }
            &:hover {
                background: #F66E6E;
            }
        }
  }
}
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
    height: 500px;
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
  .margin__top{
    margin-top: 4px;
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
