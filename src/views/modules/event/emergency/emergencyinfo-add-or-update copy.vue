<template>
  <div class="emergencyinfo-add-or-update" style="position:relative;">
    <div style="position:relative;width:100%;height:86px;text-align: center;">
      <el-radio-group
        v-if="$route.query.status == 'update' || $route.query.status == 'watch'"
        v-model="elRadio"
        @change="changeRadioGroup"
        style="width: max-content;margin:20px auto 30px auto;border-radius:5px;display: inline-block;"
        fill="#409EFF"
        text-color="#ffffff"
      >
        <el-radio-button label="登记信息"></el-radio-button>
        <el-radio-button label="处置过程"></el-radio-button>
        <el-radio-button label="通讯记录"></el-radio-button>
        <!-- <el-radio-button label="工单信息"></el-radio-button> -->
      </el-radio-group>
      <el-tooltip class="item" effect="dark" content="浏览" placement="top">
        <i
          v-if="radioGroupVisible == '登记信息'"
          class="iconfont icon-yanjing"
          @click="previewEmergency"
          style="font-size: 24px;color: #bcbcbc;position: absolute;right: 8%;top: 50%;transform: translateY(-50%);"
        ></i>
      </el-tooltip>
      <!-- <el-tooltip class="item" effect="dark" content="下载" placement="top">
      <i v-if="radioGroupVisible=='登记信息'" class="iconfont icon-xiazai1" style="font-size: 34px;color: #bcbcbc;position: absolute;right: 5%;top: 50%;transform: translateY(-50%);"></i>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="打印" placement="top">
      <i v-if="radioGroupVisible=='登记信息'" class="iconfont icon-duanxinfasongrizhi"  style="font-size: 34px;color: #bcbcbc;position: absolute;right: 2%;top: 50%;transform: translateY(-50%);"></i>
      </el-tooltip>-->
    </div>
    <div
      style="width:100%;position:relative;"
      v-if="radioGroupVisible == '登记信息'"
    >
      <el-form
        class="emergencyinfoForm"
        :model="dataForm"
        :rules="dataRule"
        ref="dataForm"
        @submit.native.prevent
        label-width="80px"
        size="medium "
        style="width:57%;display: inline-block;margin-left: 2%;"
      >
        <el-row style="text-align: center;position:relative;">
          <el-col :span="24">
            <span>要情登记表</span>
            <!-- <el-button v-if="$route.query.status=='update'&&$route.query.operationStatus!='已办结'" icon="el-icon-edit-outline" @click="editAble=!editAble" style="width: 85px;height: 36px;position: absolute;right: 2%;top: 50%;transform: translateY(-50%);">修改</el-button> -->
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" style="border-right: 1px solid #bcbcbc;">
            <el-form-item label="报送人" prop="reportName">
              <el-input
                v-model="dataForm.reportName"
                placeholder="报送人名称"
                :disabled="editAble"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- <el-form-item label="报送时间" prop="reportTime">
            <el-input v-model="dataForm.reportTime" placeholder="报送时间"></el-input>
            </el-form-item>-->
            <el-form-item label="接报时间" prop="reportTime">
              <el-date-picker
                v-model="dataForm.reportTime"
                type="datetime"
                placeholder="选择接报时间"
                :disabled="editAble"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" style="border-right: 1px solid #bcbcbc;">
            <el-form-item label="来电号码">
              <el-input
                v-model="dataForm.reportPhone"
                placeholder="来电号码"
                :disabled="editAble"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- <el-form-item label="要情来源" prop="source">
            <el-input v-model="dataForm.source" placeholder="要情来源"></el-input>
            </el-form-item>-->
            <el-form-item label="要情来源" prop="source">
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
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" style="border-right: 1px solid #bcbcbc;">
            <el-form-item label="要情标题" prop="title">
              <el-input
                v-model="dataForm.title"
                placeholder="标题"
                :disabled="editAble"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- <el-form-item label="要情分类" prop="type">
            <el-input v-model="dataForm.type" placeholder="要情类型"></el-input>
            </el-form-item>-->
            <el-form-item label="要情分类" prop="type">
              <el-radio-group
                v-model="emergencyType"
                @change="initEmergencyType"
                :disabled="editAble"
              >
                <el-radio label="1">普通事件</el-radio>
                <el-radio label="2">突发事件</el-radio>
              </el-radio-group>
              <el-select
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
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12" style="border-right: 1px solid #bcbcbc;">
            <!-- <el-form-item label="事发时间" prop="time">
            <el-input v-model="dataForm.time" placeholder="事生时间"></el-input>
            </el-form-item>-->
            <el-form-item label="事发时间" prop="time">
              <el-date-picker
                v-model="dataForm.time"
                type="datetime"
                placeholder="选择事发时间"
                :disabled="editAble"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="要情状态" prop="status">
              <el-radio-group v-model="dataForm.status" :disabled="editAble">
                <el-radio :label="0">待办</el-radio>
                <el-radio :label="1">办理中</el-radio>
                <el-radio :label="2">已办结</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="要情详情" prop="detail">
              <el-input
                style="resize:none;"
                type="textarea"
                :autosize="true"
                placeholder="要情详情"
                v-model="dataForm.detail"
                :disabled="editAble"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="事发地点" style>
              <div
                class="mapSelectOptions"
                style="display: flex;align-items: center;"
              >
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
                <el-input
                  v-model="dataForm.address"
                  placeholder="事发地点"
                  :disabled="editAble"
                  style
                ></el-input>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="拟办意见">
              <el-input
                style="resize:none;"
                type="textarea"
                :autosize="true"
                placeholder="拟办意见"
                v-model="dataForm.opinion"
                :disabled="editAble"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="领导批示">
              <el-input
                style="resize:none;"
                type="textarea"
                :autosize="true"
                placeholder="领导批示"
                v-model="dataForm.leadershipDirective"
                :disabled="editAble"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="border-bottom: 1px solid #bcbcbc;">
          <el-col :span="24">
            <el-form-item label="附件" style="height: 300px;overflow: auto;">
              <el-upload
                class="upload-demo"
                ref="upload"
                action="https://jsonplaceholder.typicode.com/posts/"
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-error="handleError"
                :before-remove="beforeRemove"
                multiple
                :on-exceed="handleExceed"
                :file-list="$route.query.status == 'watch' ? [] : fileList"
              >
                <el-button size="small" type="primary" :disabled="editAble"
                  >点击上传</el-button
                >
                <div slot="tip" class="el-upload__tip" style="width:100%;">
                  <!--<div v-if="$route.query.status == 'update'">
                    <div
                      v-for="(item, index) in dataForm.annex"
                      :key="index"
                      style="display: inline-block;width:23%;margin-right: 5px;margin-bottom: 5px;position:relative;"
                    >
                      <i
                        v-if="item.type == 0"
                        class="iconfont icon-guanbi"
                        @click="deleteImg(index, item)"
                        style="display: inline-block;position: absolute;line-height: 12px;font-size: 12px;color: white;background: #bcbcbc;right: 3%;top: 5%;border-radius: 50%;padding: 4px;"
                      ></i>

                      <viewer
                        v-if="item.type == 0"
                        :images="[item.temporaryUrl]"
                      >
                        <img
                          :src="item.temporaryUrl"
                          style="width:100%;height:100px;"
                        />
                      </viewer>
                    </div>
                  </div>-->
                  <div v-if="$route.query.status == 'watch'">
                    <div
                      v-for="(item, index) in dataForm.annex"
                      :key="index"
                      style="display: inline-block;box-sizing:border-box;width:99%;margin-right: 5px;margin-bottom: 5px;position:relative;"
                    >
                      <div class="fileList__show">
                        <div class="fileList__name">
                          <i class="el-icon-document"></i
                          ><span
                            style="margin-left: 5px;cursor: pointer"
                            @click="downloadDocument(item)"
                            :title="tip"
                            >{{ item.name }}</span
                          >
                        </div>
                        <div
                          class="fileList__button"
                          style="height:100%;display:flex;align-items:center"
                        >
                          <el-button
                            type="success"
                            size="mini"
                            style="height: 80%;line-height:80%;"
                            @click="previewDocument(item)"
                            >预览</el-button
                          >

                          <i
                            class="el-icon-success"
                            style="color:#67c23a;margin-left:15px;margin-right: 5px"
                          ></i>
                        </div>
                      </div>

                      <!--<viewer
                        v-if="item.type == 0"
                        :images="[item.temporaryUrl]"
                      >
                        <img
                          :src="item.temporaryUrl"
                          style="width:100%;height:100px;"
                        />
                      </viewer>-->
                    </div>
                  </div>
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        class="mapContainer"
        style="width: 37%;border: 1px solid #bcbcbc;display: inline-block;position:absolute;top:0%;right: 2%;"
      >
        <div style="width:95%;margin:2.6% auto;position:relative;">
          <el-amap-search-box
            class="search-box"
            :search-option="mapOptions.searchOption"
            :on-search-result="onSearchResult"
          ></el-amap-search-box>
          <i
            class="iconfont icon-dingwei"
            style="font-size: 34px;color: #bcbcbc;position: absolute;right: 8%;top: 50%;transform: translateY(-50%);"
          ></i>
          <i
            class="iconfont icon-fangda"
            @click="enlargeMap"
            style="font-size: 28px;color: #bcbcbc;position: absolute;right: 0%;top: 50%;transform: translateY(-50%);"
          ></i>
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
          <el-amap-marker
            vid="_mapCenter"
            :key="mapOptions._mapCenter"
            :position="mapOptions._mapCenter"
          ></el-amap-marker>

          <el-amap-marker
            v-for="(marker, index) in mapOptions.markers"
            :position="marker.position"
            :key="index"
            :vid="index"
          ></el-amap-marker>
        </el-amap>
        <div style="width:95%;margin:2.6% auto;">
          position: [{{ mapOptions.lng }}, {{ mapOptions.lat }}] address:
          {{ mapOptions.address }}
        </div>
      </div>

      <div
        v-if="!editAble"
        style="text-align: center;margin: 30px auto 20px auto;"
      >
        <el-button @click="$router.back(-1)" plain size="small">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()" size="small"
          >确定</el-button
        >
      </div>
    </div>

    <div
      v-if="$route.query.status === 'audio' && radioGroupVisible == '登记信息'"
      style="width:37%;height:50px;position: absolute;right: 2%;bottom: 38%;"
    >
      <audioComponent ref="audio"></audioComponent>
    </div>

    <div
      style="width:100%;position:relative;height:700px;overflow: auto;"
      v-if="radioGroupVisible == '处置过程'"
    >
      <emergencyhandleprocess
        style="width:100%;height:100%;"
      ></emergencyhandleprocess>
    </div>
    <div
      style="width:100%;position:relative;overflow: auto;"
      v-if="radioGroupVisible == '通讯记录'"
    >
      <emergencyhandleCommunicationLog
        style="width:100%;height:100%;"
      ></emergencyhandleCommunicationLog>
    </div>
    <div
      style="width:100%;position:relative;background:lightblue;height:600px;"
      v-if="radioGroupVisible == '工单信息'"
    ></div>

    <previewEmergencyDialog
      v-if="previewEmergencyDialogVisible"
      ref="previewEmergencyDialog"
    ></previewEmergencyDialog>
    <el-dialog
      title="查看附件"
      :visible.sync="dialogDocumentVisible"
      :destroy-on-close="true"
      style="text-align:center;"
    >
      <img v-if="getDocumentType" :src="documentUrl" />
      <preplan-document v-else :documentUrl="documentUrl"></preplan-document>
    </el-dialog>
  </div>
</template>

<script>
import VueAMap from "vue-amap";
import Cookies from "js-cookie";
import imageWithHttp from "@/utils/imageWithHttp";
import previewEmergencyDialog from "./previewEmergencyDialog";
import emergencyhandleprocess from "./emergencyhandleprocess";
import emergencyhandleCommunicationLog from "./emergencyhandleCommunicationLog.vue";
import emergencyhandleprocessannex from "./emergencyhandleprocessannex";
import audioComponent from "../../sys/combined/history/audio.vue";
import PreplanDocument from "@/views/modules/ControlPlan/ContingencyPlan/Detail/PreplanDocument";
import $ from "jquery";

export default {
  data() {
    let self = this;

    return {
      dialogDocumentVisible: false, // 预览文件弹窗
      documentUrl: "", // 预览文件路径
      tip: "",

      previewEmergencyDialogVisible: false,
      editAble:
        this.$route.query.status === "watch" ||
        this.$route.query.operationStatus == "已办结"
          ? true
          : false,
      radioGroupVisible: "登记信息",
      elRadio: "登记信息",
      $window: {},
      $Cookies: {},
      mapOptions: {
        map: {},
        polygons: [],
        districtSearch: "",
        citycode: "",
        zoom: 12,
        searchOption: {
          city: "广州",
          citylimit: true
        },
        lng: 0,
        lat: 0,
        address: "",
        mapCenter: [113.3245904, 23.1066805],

        _mapCenter: [],

        markers: [],
        events: {
          init: o => {
            self.mapOptions.map = o;
            o.getCity(result => {});
          },
          moveend: () => {},
          zoomchange: () => {},
          click: e => {
            self.mapOptions.markers = [];
            // console.log("点击地图e",e)
            let { lng, lat } = e.lnglat;
            self.mapOptions.lng = lng;
            self.mapOptions.lat = lat;
            self.dataForm.longitude = lng;
            self.dataForm.latitude = lat;
            let marker = {
              position: [lng, lat]
            };
            self.mapOptions.markers.push(marker);
            var geocoder;
            // 这里通过高德 SDK 完成。
            AMap.plugin("AMap.Geocoder", function() {
              geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
              });
            });

            setTimeout(() => {
              geocoder.getAddress([lng, lat], function(status, result) {
                if (status === "complete" && result.info === "OK") {
                  // console.log("点击地图的result为",result)
                  if (result && result.regeocode) {
                    self.mapOptions.address = result.regeocode.formattedAddress;
                    self.dataForm.address = result.regeocode.formattedAddress;
                    self.$nextTick();
                  }
                  if (
                    JSON.parse(localStorage.getItem("platformInfo")).flag ==
                    "province"
                  ) {
                    setTimeout(() => {
                      $("#province")
                        .find(
                          `option:contains('${result.regeocode.addressComponent.province}')`
                        )
                        .attr("selected", true);
                      self.search(
                        self.$window.document.getElementById("province")
                      );
                    }, 800);
                  }
                  if (
                    JSON.parse(localStorage.getItem("platformInfo")).flag ==
                      "city" ||
                    JSON.parse(localStorage.getItem("platformInfo")).flag ==
                      "province"
                  ) {
                    setTimeout(() => {
                      $("#city")
                        .find(
                          `option:contains('${result.regeocode.addressComponent.city}')`
                        )
                        .attr("selected", true);
                      self.search(self.$window.document.getElementById("city"));
                    }, 1100);
                  }
                  if (
                    JSON.parse(localStorage.getItem("platformInfo")).flag ==
                      "district" ||
                    JSON.parse(localStorage.getItem("platformInfo")).flag ==
                      "city" ||
                    JSON.parse(localStorage.getItem("platformInfo")).flag ==
                      "province"
                  ) {
                    setTimeout(() => {
                      $("#district")
                        .find(
                          `option:contains('${result.regeocode.addressComponent.district}')`
                        )
                        .attr("selected", true);
                      self.search(
                        self.$window.document.getElementById("district")
                      );
                    }, 4000);
                  }

                  setTimeout(() => {
                    $("#street")
                      .find(
                        `option:contains('${result.regeocode.addressComponent.township}')`
                      )
                      .attr("selected", true);
                    self.setCenter(
                      self.$window.document.getElementById("street")
                    );
                  }, 4300);
                }
              });
            }, 500);
          }
        },
        plugin: [
          "ToolBar",
          {
            pName: "MapType",
            defaultType: 0,
            events: {
              init(o) {
                // console.log(o);
              }
            }
          }
        ]
      },
      typeOptions: [],
      sourceOptions: [],
      visible: false,
      fileList: [],
      dataForm: {
        id: 0,
        reportName: "",
        reportPhone: "",
        reportTime: "",
        source: "",
        type: "",
        title: "",
        time: "",
        address: "",
        detail: "",
        status: "",
        opinion: "",
        leadershipDirective: "",
        images: [],
        temporaryImages: [],
        annex: [], //附件
        longitude: "",
        latitude: "",
        createTime: "",
        updateTime: "",
        createUserId: "",
        updateUserId: "",
        isDeleted: "",
        array: [
          {
            reportName: "飞洒",
            reportPhone: "123165",
            reportTime: "08：40",
            source: "发生"
          },
          {
            reportName: "发放",
            reportPhone: "4568",
            reportTime: "09：40",
            source: "发申请"
          },
          {
            reportName: "回复",
            reportPhone: "5646",
            reportTime: "11：45",
            source: "我去"
          }
        ]
      },
      dataRule: {
        reportName: [
          { required: true, message: "报送人名称不能为空", trigger: "blur" }
        ],
        reportPhone: [
          { required: true, message: "报送人电话不能为空", trigger: "blur" }
        ],
        reportTime: [
          { required: true, message: "报送时间不能为空", trigger: "blur" }
        ],
        source: [
          { required: true, message: "要情来源不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "要情类型不能为空", trigger: "blur" }
        ],
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        time: [
          { required: true, message: "事生时间不能为空", trigger: "blur" }
        ],
        address: [
          { required: true, message: "事发地点不能为空", trigger: "blur" }
        ],
        detail: [{ required: true, message: "详情不能为空", trigger: "blur" }],
        status: [
          {
            required: true,
            message: "状态  0:代办  1:办理中   2:已办结不能为空",
            trigger: "blur"
          }
        ],
        opinion: [
          { required: true, message: "拟办意见不能为空", trigger: "blur" }
        ],
        leadershipDirective: [
          { required: true, message: "领导批示不能为空", trigger: "blur" }
        ],
        images: [
          { required: true, message: "图片数组不能为空", trigger: "blur" }
        ],
        annex: [
          { required: true, message: "附件数组不能为空", trigger: "blur" }
        ],
        longitude: [
          { required: true, message: "经度不能为空", trigger: "blur" }
        ],
        latitude: [
          { required: true, message: "维度不能为空", trigger: "blur" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "更新时间不能为空", trigger: "blur" }
        ],
        createUserId: [
          { required: true, message: "创建用户不能为空", trigger: "blur" }
        ],
        updateUserId: [
          { required: true, message: "更新用户不能为空", trigger: "blur" }
        ],
        isDeleted: [
          {
            required: true,
            message: "是否删除 0否 1删除不能为空",
            trigger: "blur"
          }
        ]
      },
      emergencyType: "1"
    };
  },
  created() {
    this.$window = window;
    this.$Cookies = Cookies;
    // console.log("this.$router",this.$router,this.$route)
    this.initSelectOptions();
    if (
      this.$route.query.status === "update" ||
      this.$route.query.status === "watch" ||
      this.$route.query.status === "audio"
    ) {
      this.init();
    }
  },
  mounted() {
    setTimeout(() => {
      // console.log("self.mapOptions.map",this.mapOptions.map,this.mapOptions,this.mapOptions.map.panTo)
      this.initMapSelectOptions();
    }, 1000);
  },
  components: {
    previewEmergencyDialog,
    emergencyhandleprocess,
    emergencyhandleprocessannex,
    emergencyhandleCommunicationLog,
    audioComponent,
    PreplanDocument
  },
  watch: {
    "dataForm.annex"(newValue, oldValue) {
      if (this.dataForm.annex.length > 0) {
        this.dataForm.annex.forEach((item, index) => {
          if (item.type == 0) {
            var temporaryObject = imageWithHttp.withHttp(item.url);
            setTimeout(() => {
              this.$set(item, "temporaryUrl", temporaryObject.image);
              this.$forceUpdate();
            }, 1500);
          }
        });
      }
    }
  },
  computed: {
    getDocumentType() {
      if (
        [
          "png",
          "jpg",
          "jpeg",
          "bmp",
          "gif",
          "webp",
          "psd",
          "svg",
          "tiff"
        ].indexOf(
          this.documentUrl
            .substr(this.documentUrl.lastIndexOf(".") + 1)
            .toLowerCase()
        ) !== -1
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    // 上传组件文件列表
    pointerAction() {},

    enlargeMap() {
      if (document.querySelector(".mapContainer").style.width == "37%") {
        document
          .querySelector(".mapContainer")
          .setAttribute(
            "style",
            "width: 100%;height: 100%;border: 1px solid #bcbcbc;display: inline-block;position:absolute;top:0%;left:0%;background: white;"
          );
        document.querySelector(
          ".el-vue-amap-container.amap-demo"
        ).style.height = "80%";
      } else {
        document
          .querySelector(".mapContainer")
          .setAttribute(
            "style",
            "width: 37%;border: 1px solid #bcbcbc;display: inline-block;position:absolute;top:0%;right: 2%;"
          );
        document.querySelector(
          ".el-vue-amap-container.amap-demo"
        ).style.height = "500px";
      }
    },
    initMapSelectOptions() {
      var that = this;
      AMap.plugin("AMap.DistrictSearch", function() {
        that.mapOptions.districtSearch = new AMap.DistrictSearch({
          // 关键字对应的行政区级别，country表示国家
          // level: 'country',
          //  显示下级行政区级数，1表示返回下一级行政区
          subdistrict: 1,
          showbiz: false
        });

        // 搜索所有省/直辖市信息 JSON.parse(localStorage.getItem('platformInfo')).townName
        that.mapOptions.districtSearch.search("增城区", function(
          status,
          result
        ) {
          // 查询成功时，result即为对应的行政区信息
          // console.log('中国查询成功',status, result,JSON.parse(localStorage.getItem('platformInfo')) )
          if (status == "complete") {
            that.getData(result.districtList[0]);
            setTimeout(() => {
              $("#street")
                .find(
                  `option:contains(${
                    JSON.parse(localStorage.getItem("platformInfo")).townName
                  })`
                )
                .attr("selected", true);
              setTimeout(() => {
                that.search(that.$window.document.getElementById("street"));
                that.setCenter(that.$window.document.getElementById("street"));
              }, 600);
            }, 500);
          }
        });
      });
    },
    getData(data, level) {
      var citySelect = document.getElementById("city");
      var districtSelect = document.getElementById("district");
      var areaSelect = document.getElementById("street");
      var that = this;
      var bounds = data.boundaries;
      if (bounds) {
        for (var i = 0, l = bounds.length; i < l; i++) {
          var polygon = new AMap.Polygon({
            map: that.mapOptions.map,
            strokeWeight: 1,
            strokeColor: "#0091ea",
            fillColor: "#80d8ff",
            fillOpacity: 0.2,
            path: bounds[i]
          });
          polygon.on("click", that.mapOptions.events.click);
          that.mapOptions.polygons.push(polygon);
        }
        that.mapOptions.map.setFitView(); //地图自适应
      }

      //清空下一级别的下拉列表
      if (level === "province") {
        if (citySelect) {
          citySelect.innerHTML = "";
        }
        if (districtSelect) {
          districtSelect.innerHTML = "";
        }
        if (areaSelect) {
          areaSelect.innerHTML = "";
        }
      } else if (level === "city") {
        if (districtSelect) {
          districtSelect.innerHTML = "";
        }
        if (areaSelect) {
          areaSelect.innerHTML = "";
        }
      } else if (level === "district") {
        if (areaSelect) {
          areaSelect.innerHTML = "";
        }
      } else if (level === "street") {
        if (areaSelect) {
          if (areaSelect.innerHTML) {
            return;
          } else {
            areaSelect.innerHTML = "";
          }
        }
      }

      var subList = data.districtList;
      if (subList) {
        var contentSub = new Option("--请选择--");
        var curlevel = subList[0].level;
        // console.log('subList[0].level',subList[0].level,subList)
        var curList = document.querySelector("#" + curlevel);
        curList.add(contentSub);
        for (var i = 0, l = subList.length; i < l; i++) {
          var name = subList[i].name;
          var levelSub = subList[i].level;
          var cityCode = subList[i].citycode;
          contentSub = new Option(name);
          contentSub.setAttribute("value", levelSub);
          contentSub.center = subList[i].center;
          contentSub.adcode = subList[i].adcode;
          curList.add(contentSub);
        }
      }
    },
    search(obj) {
      var that = this;

      //清除地图上所有覆盖物
      for (var i = 0, l = that.mapOptions.polygons.length; i < l; i++) {
        that.mapOptions.polygons[i].setMap(null);
      }
      var option = obj[obj.options.selectedIndex];
      var keyword = option.text; //关键字
      var adcode = option.adcode;
      that.mapOptions.districtSearch.setLevel(option.value); //行政区级别
      that.mapOptions.districtSearch.setExtensions("all");
      //行政区查询
      //按照adcode进行查询可以保证数据返回的唯一性
      that.mapOptions.districtSearch.search(adcode, function(status, result) {
        if (status === "complete") {
          // console.log("search完后的result",result,obj.id)
          that.getData(result.districtList[0], obj.id);
        }
      });
    },
    setCenter(obj) {
      var that = this;
      var centerPositon = obj[obj.options.selectedIndex].center;
      // that.mapOptions.map.setCenter(obj[obj.options.selectedIndex].center);
      that.mapOptions.map.setCenter(centerPositon);

      console.log("emmm", centerPositon);
      that.mapOptions._mapCenter = [centerPositon.lng, centerPositon.lat];
      that.mapOptions.mapCenter = [centerPositon.lng, centerPositon.lat];

      console.log("地图对象", this.mapOptions);
    },
    initSelectOptions() {
      this.sourceOptions = [];
      this.$http({
        url: this.$http.adornUrl(`/sys/sysdictionary/dictionaryList?id=99`),
        method: "get",
        param: this.$http.adornParams()
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          // console.log("/sys/sysdictionary/dictionaryList 获取要情来源source",data)

          data.data.forEach(item => {
            this.sourceOptions.push({ value: item.id, label: item.name });
          });
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error"
          });
        }
      });

      this.initEmergencyType();
    },
    initEmergencyType() {
      this.typeOptions = [];
      this.dataForm.type = "";
      this.$http({
        url: this.$http.adornUrl(
          `/sys/sysdictionary/getSysDictionaryListByCode?code=${
            this.emergencyType == 1 ? "emergencyType" : "tufa_type "
          }`
        ),
        method: "get",
        param: this.$http.adornParams()
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          data.data.forEach(item => {
            this.typeOptions.push({ value: item.id, label: item.name });
          });
          if (this.$route.query.status === "add") {
            this.dataForm.type = this.typeOptions[0].value;
          }
        } else {
          this.$message({
            message: `${data.msg}`,
            type: "error"
          });
        }
      });
    },
    init(id) {
      this.dataForm.id = this.$route.query.id || 0;
      // this.visible = true
      if (
        this.$route.query.status === "update" ||
        this.$route.query.status === "watch"
      ) {
        this.$nextTick(() => {
          this.$refs["dataForm"].resetFields();
          // if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/emergency/emergencyinfo/info/${this.$route.query.id}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              console.log(
                "/emergency/emergencyinfo/info data",
                data,
                this.dataForm
              );
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
              this.dataForm.leadershipDirective =
                data.emergencyInfo.leadershipDirective;
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
              this.initEmergencyType();
              this.dataForm.source = this.sourceOptions.find(
                v => v.value === data.emergencyInfo.sourceId
              ).value;
              setTimeout(() => {
                this.dataForm.type = this.typeOptions.find(
                  v => v.value == data.emergencyInfo.typeId
                ).value;
              }, 300);
              //地图位置
              this.mapOptions.mapCenter = [
                this.dataForm.longitude,
                this.dataForm.latitude
              ];
            } else {
              this.$message.error(data.msg);
            }
          });
        });
      }

      if (this.$route.query.status === "audio") {
        if (this.$route.query.item.type == 0) {
          this.dataForm.reportPhone = this.$route.query.item.calling;
        } else {
          this.dataForm.reportPhone = this.$route.query.item.called;
        }
        this.dataForm.reportName = this.$route.query.item.contactId;
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
          ".el-upload-list.el-upload-list--text li .el-icon-close"
        )
        [index].setAttribute("display", "initial");
      document
        .querySelectorAll(
          ".el-upload-list.el-upload-list--text li .el-icon-close"
        )
        [index].click();

      if (this.$route.query.status === "update") {
        this.$http({
          url: this.$http.adornUrl(`/emergency/emergencyinfoannex/delete`),
          method: "post",
          data: this.$http.adornData({
            ids: [item.id]
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            // console.log("删除成功",data)
            this.$message({
              message: "删除成功!",
              type: "success"
            });
          } else {
            this.$message({
              message: `${data.msg}`,
              type: "error"
            });
          }
        });
      }
    },

    handleRemove(file, fileList) {
      this.dataForm.annex = [];
      // console.log("删除上传handleRemove file, fileList",file, fileList);
      fileList.forEach(item => {
        this.dataForm.annex.push(item.response.data);
      });

      this.fileList = this.dataForm.annex;
    },

    //图片上传之前
    beforeAvatarUpload(file) {
      let form = new FormData();
      form.append("file", file);
      var flag =
        this.$route.query.status === "update" ? this.$route.query.id : "";
      console.log(flag);
      form.append("emergencyInfoId", flag);
      this.$http({
        url: this.$http.adornUrl(`/upload/emergencyFile`),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        data: form
      })
        .then(({ data }) => {
          console.log("上传上传", data, this.fileList, file);
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
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => {});
    },

    handlePreview(file) {
      console.log("上传预览handlePreview file", file);
      if (this.$route.query.status === "update") {
        let httpaddress = window.SITE_CONFIG.cloudUrl;
        window.open(
          `${httpaddress}/${file.url}?attname=${
            file.name
          }&token=${this.$cookie.get("token")}`
        );
      }
    },

    // 预览文件
    previewDocument(file) {
      console.log("aaaaaaaaaaaaaaaaaaaaa", file);

      var index = file.name.lastIndexOf(".");
      var ext = file.name.substr(index + 1);
      if (
        [
          "png",
          "jpg",
          "jpeg",
          "bmp",
          "gif",
          "webp",
          "psd",
          "svg",
          "tiff"
        ].indexOf(ext.toLowerCase()) !== -1
      ) {
        // console.log('该文件是图片')
        this.dialogDocumentVisible = false;
        this.documentUrl =
          this.$window.SITE_CONFIG["cloudUrl"] + "/" + file.url;
        console.log("文件路径1", this.documentUrl);
        return true;
      } else {
        this.dialogDocumentVisible = true;
        this.documentUrl = this.$window.SITE_CONFIG["cloudUrl"] + file.url;
        console.log("文件路径2", this.documentUrl);
        return false;
      }
    },

    // 下载文件
    downloadDocument(file) {
      console.log("asfff", file);

      var index = file.name.lastIndexOf(".");
      var ext = file.name.substr(index + 1);
      if (
        [
          "png",
          "jpg",
          "jpeg",
          "bmp",
          "gif",
          "webp",
          "psd",
          "svg",
          "tiff"
        ].indexOf(ext.toLowerCase()) !== -1
      ) {
        // console.log('该文件是图片')
        this.documentUrl =
          this.$window.SITE_CONFIG["cloudUrl"] + "/" + file.url;
        console.log("文件路径1", this.documentUrl);
        return true;
      } else {
        this.documentUrl = this.$window.SITE_CONFIG["cloudUrl"] + file.url;
        this.tip = "点击下载";
        console.log("文件路径2", this.documentUrl);
        window.open(this.documentUrl, "_blank");
        return false;
      }
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
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    onSearchResult(pois) {
      let latSum = 0;
      let lngSum = 0;
      if (pois.length > 0) {
        pois.forEach(poi => {
          let { lng, lat } = poi;
          lngSum += lng;
          latSum += lat;
        });
        this.mapOptions.address = pois[0].name;
        this.dataForm.address = pois[0].name;
        let center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        };
        this.mapOptions.lat = center.lat;
        this.mapOptions.lng = center.lng;
        this.dataForm.longitude = center.lng;
        this.dataForm.latitude = center.lat;
        this.mapOptions.mapCenter = [center.lng, center.lat];
      }
    },
    // 表单提交
    dataFormSubmit() {
      var annexs = [];
      this.dataForm.annex.forEach(item => {
        annexs.push({
          url: item.url,
          name: item.name,
          type: 0
        });
      });
      // return;
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/emergency/emergencyinfo/${
                !this.dataForm.id ? "save" : "update"
              }`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              reportName: this.dataForm.reportName,
              reportPhone: this.dataForm.reportPhone,
              reportTime: this.dateFormatter(this.dataForm.reportTime),
              sourceId: this.dataForm.source,
              typeId: this.dataForm.type,
              title: this.dataForm.title,
              time: this.dateFormatter(this.dataForm.time),
              address: this.dataForm.address,
              detail: this.dataForm.detail,
              status: this.dataForm.status,
              opinion: this.dataForm.opinion,
              leadershipDirective: this.dataForm.leadershipDirective,
              longitude: this.dataForm.longitude,
              latitude: this.dataForm.latitude,
              annexs: annexs,
              emergencyType: this.emergencyType
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  // this.visible = false
                  this.$router.back(-1);
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    //格式化起始时间结束时间
    dateFormatter(str) {
      //默认返回yyyy-MM-dd HH-mm-ss
      var hasTime = arguments[1] != false ? true : false; //可传第二个参数false，返回yyyy-MM-dd
      var d = new Date(str);
      var year = d.getFullYear();
      var month =
        d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
      var day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
      var hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
      var minute = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
      var second = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
      if (hasTime) {
        return (
          [year, month, day].join("-") + " " + [hour, minute, second].join(":")
        );
      } else {
        return [year, month, day].join("-");
      }
    }
  }
};
</script>
<style lang="less">
.emergencyinfo-add-or-update {
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
