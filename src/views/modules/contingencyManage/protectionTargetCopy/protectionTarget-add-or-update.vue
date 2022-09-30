<template>
  <el-dialog
    v-dialogDrag
    :title="type=='edit'?'修改':(type=='watch'?'查看':'新增')"
    :close-on-click-modal="false"
    width="1062px"
    :visible.sync="visible"
    @closed="$parent.addOrUpdateVisible=false"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="125px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="dataForm.name" :readonly="type=='watch'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="防护目标类型" prop="protectType">
            <el-dialog title="选择防护目标类型" :visible.sync="teamTypeVisible" width="30%" append-to-body>
              <el-tree
                :data="teamTypeList"
                :props="eventTypeListTreeProps"
                node-key="id"
                ref="teamTypeTree"
                @current-change="protectTypeListTreeCurrentChangeHandle"
                :default-expand-all="true"
                :auto-expand-parent="true"
                :highlight-current="true"
                :expand-on-click-node="false"
              ></el-tree>
              <span slot="footer" class="dialog-footer">
                <el-button @click="teamTypeVisible = false">取 消</el-button>
                <el-button type="primary" @click="teamTypeVisible = false">确 定</el-button>
              </span>
            </el-dialog>
            <el-input
              v-model="dataForm.protectTypeName"
              v-popover:eventTypeListPopover
              placeholder="选择分组"
              :readonly="true"
              style="width:71%;"
            ></el-input>
            <el-button class="button" @click="teamTypeGettingFocus" v-if="type!=='watch'">选择</el-button>
            <el-button class="button" @click="dataForm.protectTypeName='',dataForm.protectType=''" v-if="type!=='watch'">清除</el-button>
            <el-input v-show="false" v-model="dataForm.protectType" :readonly="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="地址" prop="location">
        <el-input v-model="dataForm.location" style="width: 90%" v-if="type!=='watch'"></el-input>
        <el-button
          @click="mapDialogVisible = true"
          style="width:8%"
          type="text"
          icon="el-icon-location-outline"
          v-if="type!=='watch'"
        >定位</el-button>
      </el-form-item>

      <!--<el-row>
        <el-col :span="12">
          <el-form-item label="经度">
            <el-input style="width:100%;" readonly v-model="dataForm.longitude"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纬度">
            <el-input style="width:100%;" readonly v-model="dataForm.latitude"></el-input>
          </el-form-item>
        </el-col>
      </el-row>-->

      <el-dialog title="地图" :visible.sync="mapDialogVisible" append-to-body>
        <div style="height:580px;">
          <div :style="{width:'100%',height:'500px',float: 'right'}">
            <el-amap-search-box
              class="search-box"
              :search-option="searchOption"
              :on-search-result="onSearchResult"
            ></el-amap-search-box>
            <el-amap
              id="amapDemo"
              :center="center"
              :zoom="12"
              class="amap-demo"
              :events="events"
              :plugin="plugin"
              v-if="mapDialogVisible"
            >
              <el-amap-marker :position="position" :events="events"></el-amap-marker>
              <!-- <el-amap-marker v-for="(position,index) in markers" :position="position" :key="index"></el-amap-marker> -->
            </el-amap>
            <div class="toolbar">
              position: [{{ lng }}, {{ lat }}] address: {{ address }}
              <div style="text-align: center">
                <el-button @click="mapDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="LongitudeandLatitude()">确定</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>

      <el-row>
        <el-col :span="8">
          <el-form-item label="等级" prop="level">
            <!-- <el-input v-model="dataForm.level" placeholder="级别  1:国家级2:省级3:市级 4:县级 5:乡镇级 5:其他"></el-input> -->
            <el-select v-model="dataForm.level" placeholder="请选择" style="width:100%;" :disabled="type=='watch'">
              <el-option
                v-for="item in levelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="面积(m²)" prop="areaSize">
            <el-input-number
              v-model="dataForm.areaSize"
              controls-position="right"
              style="width:100%;"
              :min="0"
              :disabled="type=='watch'"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="当前人数" prop="nowNumber">
            <el-input-number
              v-model="dataForm.nowNumber"
              controls-position="right"
              style="width:100%;"
              :min="0"
              :disabled="type=='watch'"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="可容纳人数" prop="canuseNumber">
            <el-input-number
              v-model="dataForm.canuseNumber"
              controls-position="right"
              style="width:100%;"
              :min="0"
              :disabled="type=='watch'"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="防护等级" prop="protectLevel">
            <el-select v-model="dataForm.protectLevel" placeholder="请选择" style="width:100%;" :disabled="type=='watch'">
              <el-option
                v-for="item in natureOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="成立时间" prop="useTime">
            <el-date-picker
              unlink-panels
              v-model="dataForm.useTime"
              type="date"
              style="width:100%;"
              value-format="yyyy-MM-dd HH:mm:ss"
              :readonly="type=='watch'"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <!--<el-form-item label="风险缘由">
        <el-dialog title="选择防护目标类型" :visible.sync="riskReasonVisible" width="30%" append-to-body>
          <el-tree
            :data="riskReasonList"
            :props="eventTypeListTreeProps"
            node-key="id"
            ref="riskReasonTree"
            @current-change="riskReasonListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :auto-expand-parent="true"
            :highlight-current="true"
            :expand-on-click-node="false"
          ></el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="riskReasonVisible = false">取 消</el-button>
            <el-button type="primary" @click="riskReasonVisible = false">确 定</el-button>
          </span>
        </el-dialog>
        <el-input
          v-popover:eventTypeListPopover
          placeholder="选择分组"
          :readonly="true"
          style="width:88%"
          v-model="dataForm.riskReasonParentName"
        ></el-input>
        <el-button class="button" @click="riskReasonGettingFocus">选择</el-button>
        <el-button class="button" @click="dataForm.riskReasonParentName=''">清除</el-button>
        <el-input v-show="false" v-model="dataForm.riskReason" :readonly="true"></el-input>
      </el-form-item>-->

      <el-row>
        <el-col :span="12">
          <el-form-item label="行政区划" prop="area">
            <el-dialog title="选择行政区划" :visible.sync="areaVisible" width="30%" append-to-body>
              <el-tree
                :data="areaList"
                :props="eventTypeListTreeProps"
                node-key="id"
                ref="areaTree"
                @current-change="areaListTreeCurrentChangeHandle"
                :default-expand-all="true"
                :auto-expand-parent="true"
                :highlight-current="true"
                :expand-on-click-node="false"
              ></el-tree>
              <span slot="footer" class="dialog-footer">
                <el-button @click="areaVisible = false">取 消</el-button>
                <el-button type="primary" @click="areaVisible = false">确 定</el-button>
              </span>
            </el-dialog>
            <el-input
              v-model="dataForm.areaParentName"
              v-popover:eventTypeListPopover
              placeholder="选择分组"
              :readonly="true"
              style="width:71%"
            ></el-input>
            <el-button class="button" @click="areaGettingFocus" v-if="type!=='watch'">选择</el-button>
            <el-button class="button" @click="dataForm.areaParentName='',dataForm.area=''" v-if="type!=='watch'">清除</el-button>
            <el-input v-show="false" v-model="dataForm.area" :readonly="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主体单位" prop="chargeUnit">
            <el-input v-model="dataForm.chargeUnit" :readonly="type=='watch'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!--<el-row>
        <el-col :span="12">
          <el-form-item label="受灾形式">
            <el-input v-model="dataForm.layout"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="监测方式">
            <el-input v-model="dataForm.monitorWay"></el-input>
          </el-form-item>
        </el-col>
      </el-row>-->

      <!--<el-row>
        <el-col :span="12">
          <el-form-item label="数据来源单位">
            <el-input v-model="dataForm.dataSourceUnit"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="防护区域">
            <el-input v-model="dataForm.defenseArea"></el-input>
          </el-form-item>
        </el-col>
      </el-row>-->

      <!--<el-form-item label="周边交通状况">
        <el-input :rows="2" v-model="dataForm.trafficConditions"></el-input>
      </el-form-item>-->

      <!--<el-form-item label="基本情况">
        <el-input  :rows="2" v-model="dataForm.generalSituation"></el-input>
      </el-form-item>-->

      <el-form-item label="防护措施" prop="conservatoryMeasure">
        <el-input :rows="2" v-model="dataForm.conservatoryMeasure" :readonly="type=='watch'"></el-input>
      </el-form-item>

      <el-form-item label="应急通讯方式" prop="communicationMode">
        <el-input type="textarea" :rows="1" v-model="dataForm.communicationMode" resize="none" :readonly="type=='watch'"></el-input>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :rows="2" v-model="dataForm.remark" resize="none" :readonly="type=='watch'"></el-input>
      </el-form-item>

      <el-form-item label="联系人">
        <div class="allCheckContact">
          <ul class="checkContact">
            <li class="oneContact" v-for="item in dataForm.contactsId" :key="item.id">
              {{item.name}}&nbsp;&nbsp;&nbsp;&nbsp;
              <i
                class="el-icon-close"
                @click="delIt('contact',item.id)"
              ></i>
            </li>
          </ul>
          <div class="operation" @click="addContactHandle('联系人')" v-if="type!=='watch'">
            <input type="”button”" class="addContact" />
            <i class="el-icon-plus"></i>
          </div>
        </div>

        <!-- 添加联系人 -->
        <add-contact ref="AddContactView"></add-contact>
      </el-form-item>

      <!--<el-form-item label="负责人">
         <div class="allCheckContact">
          <ul class="checkContact">
            <li class="oneContact" v-for="item in dataForm.chargeId" :key="item.id">
              {{item.name}}&nbsp;&nbsp;&nbsp;&nbsp;
              <i class="el-icon-close" @click="delIt('charge',item.id)"></i>
            </li>
          </ul>
          <div class="operation" @click="addContactHandle('负责人')">
            <input type="”button”" class="addContact" />
            <i class="el-icon-plus"></i>
          </div>
        </div>
        &lt;!&ndash; 添加负责人 &ndash;&gt;
        <add-contact ref="AddContactView"></add-contact>
      </el-form-item>-->

      <el-form-item label="附件">
        <el-upload
          class="upload-demo"
          :action="this.$http.adornUrl(`/upload/incidentDocument`)"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :limit="1"
          :on-exceed="handleExceed"
          :before-upload="beforeAvatarUpload"
          :file-list="fileList"
        >
          <el-button size="small" v-if="type!=='watch'">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
      v-if="type!=='watch'"
      style="text-align:center;margin-top:-50px;"
    >
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from "@/utils";
import AddContact from "./addContact/AddContact";
import bus from "@/views/common/js/eventBus";

export default {
  components: {
    AddContact
  },
  data() {
    let self = this;
    return {
      type: "",
      natureOptions: [
        {
          value: '1',
          label: "特别重要防护"
        },
        {
          value: '2',
          label: "重要防护"
        },
        {
          value: '3',
          label: "较高防护"
        },
        {
          value: '4',
          label: "一般防护"
        }
      ],
      levelOptions: [
        {
          value: '1',
          label: "国家级"
        },
        {
          value: '2',
          label: "省级"
        },
        {
          value: '3',
          label: "市级"
        },
        {
          value: '4',
          label: "县级"
        },
        {
          value: '5',
          label: "乡镇级"
        },
        {
          value: '6',
          label: "其他"
        }
      ],
      secretLevelOptions: [
        {
          value: '1',
          label: "机密"
        },
        {
          value: '2',
          label: "秘密"
        },
        {
          value: '3',
          label: "限制"
        },
        {
          value: '4',
          label: "公开"
        },
        {
          value: '5',
          label: "其他"
        }
      ],
      teamTypeVisible: false,
      riskReasonVisible: false,
      areaVisible: false,
      teamTypeList: [],
      riskReasonList: [],
      areaList: [],
      eventTypeListTreeProps: {
        label: "name",
        children: "children"
      },
      center: [113.619965, 23.118933],
      position: [113.619965, 23.118933],
      plugin: [
        {
          pName: "Geolocation",
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  console.log('result.position: ', result.position);
                  self.lng = result.position.lng;
                  self.lat = result.position.lat;
                  self.center = [self.lng, self.lat];
                  self.mapCenter = [self.lng, self.lat];
                  self.position = [self.lng, self.lat];
                  var geocoder = new AMap.Geocoder({
                    radius: 1000,
                    extensions: "all"
                  });
                  geocoder.getAddress([self.lng, self.lat], function(status, result) {
                    if (status === "complete" && result.info === "OK") {
                      if (result && result.regeocode) {
                        self.address = result.regeocode.formattedAddress;
                        // console.log(self)

                        // self.$nextTick()
                      }
                    }
                  });
                  self.$nextTick();
                }
              });
            }
          }
        }
      ],
      lng: 0,
      lat: 0,
      address: "",
      events: {
        click(e) {
          let { lng, lat } = e.lnglat;
          self.lng = lng;
          self.lat = lat;
          self.position = [lng, lat];
          // 这里通过高德 SDK 完成。
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });
          geocoder.getAddress([lng, lat], function(status, result) {
            if (status === "complete" && result.info === "OK") {
              if (result && result.regeocode) {
                self.address = result.regeocode.formattedAddress;
                self.$nextTick();
              }
            }
          });
        }
      },
      searchOption: {
        city: "广州",
        citylimit: false
      },
      mapDialogVisible: false,
      visible: false,
      dataForm: {
        id: 0,
        name: "",
        protectType: "",
        protectTypeName: "",
        groupId: "",
        location: "",
        longitude: "",
        latitude: "",
        level: "",
        protectLevel: "",
        area: "",
        areaParentName: "",
        areaParentName: "",
        areaSize: "",
        riskReason: "",
        riskReasonParentName: "",
        chargeUnit: "",
        nowNumber: "",
        useTime: "",
        canuseNumber: "",
        layout: "",
        monitorWay: "",
        dataSourceUnit: "",
        defenseArea: "",
        trafficConditions: "",
        generalSituation: "",
        conservatoryMeasure: "",
        communicationMode: "",
        remark: "",
        contactsId: [],
        chargeId: []
      },
      dataRule: {
        name: [
          { required: true, message: "防护目标名称不能为空", trigger: "blur" }
        ],
        protectType: [{ required: true, message: "防护目标类型id不能为空" }],
        area: [{ required: true, message: "行政区划类型id不能为空" }],
        location: [
          { required: true, message: "地址不能为空", trigger: "blur" }
        ],
        canuseNumber: [
          { required: true, message: "可容纳人数不能为空", trigger: "blur" },
          {
            type: "number",
            message: "可容纳人数类型必须为整数",
            trigger: "blur",
            transform: function(value) {
              return Number(value);
            }
          }
        ],

        useTime: [
          { required: true, message: "成立时间不能为空", trigger: "blur" }
        ],
        level: [
          {
            required: true,
            message:
              "级别  1:国家级2:省级3:市级 4:县级 5:乡镇级 6:其他不能为空",
            trigger: "blur"
          }
        ],
        protectLevel: [
          {
            required: true,
            message: "防护等级  1特别重要防护 2重要防护 3较高防护  4一般防护不能为空",
            trigger: "blur"
          }
        ],

        // longitude: [
        //   { required: true, message: "经度不能为空", trigger: "blur" }
        // ],
        // latitude: [
        //   { required: true, message: "纬度不能为空", trigger: "blur" }
        // ],
        address: [{ required: true, message: "地址不能为空", trigger: "blur" }],
        chargeUnit: [
          { required: true, message: "主要单位不能为空", trigger: "blur" }
        ],
        conservatoryMeasure: [
          { required: true, message: "防护措施不能为空", trigger: "blur" }
        ],
        communicationMode: [
          { required: true, message: "应急通讯方式不能为空", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "备注不能为空", trigger: "blur" }
        ],

        areaSize: [
          { required: true, message: '面积类型不能为空', trigger: 'blur' },
          {
            type: "number",
            message: "面积类型必须为整数",
            trigger: "blur",
            required: false,
            transform: function(value) {
              return Number(value);
            }
          }
          // { pattern: /^-?[1-9]\d*$/,message: '坐标类型必须为整数'}
        ],
        nowNumber: [
          { required: true, message: '当前人数不能为空', trigger: 'blur' },
          {
            type: "number",
            message: "当前人数类型必须为整数",
            trigger: "blur",
            transform: function(value) {
              return Number(value);
            }
          }
        ]
      },
      fileList: [] // 上传文件
    };
  },
  mounted() {
    // 获取已选联系人
    bus.$off("getCheckContact");
    bus.$on("getCheckContact", val => {
      // console.log(val);
      this.dataForm.contactsId = val;
    });

    // 获取已选负责人
    bus.$off("getCheckCharge");
    bus.$on("getCheckCharge", val => {
      // console.log(val);
      this.dataForm.chargeId = val;
    });
  },
  methods: {
    init(id, status) {
      // this.dataForm.id = id || 0;
      this.type = status;
      if (status == "watch" || status == "edit") {
        this.dataForm.id = id;
      }else {
        if (id) {
          this.dataForm.groupId = id;
        } else {
          this.$message({
            type: "warning",
            message: "请选择防护目标分组"
          });
          return;
        }
      }
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/resoure/resoureProtectTarget/info`),
            method: "get",
            params: this.$http.adornParams({
              id: this.dataForm.id
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              // console.log("修改数据",data)
              this.dataForm.name = data.ResoureProtectTargetEntity.name;
              this.dataForm.protectType =
                data.ResoureProtectTargetEntity.protectType;
              this.dataForm.protectTypeParentName =
                data.ResoureProtectTargetEntity.protectTypeParentName;
              this.dataForm.groupId = data.ResoureProtectTargetEntity.groupId;
              this.dataForm.location = data.ResoureProtectTargetEntity.location;
              this.dataForm.longitude =
                data.ResoureProtectTargetEntity.longitude;
              this.dataForm.latitude = data.ResoureProtectTargetEntity.latitude;
              this.dataForm.level = data.ResoureProtectTargetEntity.level;
              this.dataForm.protectLevel =
                data.ResoureProtectTargetEntity.protectLevel;
              this.dataForm.area = data.ResoureProtectTargetEntity.area;
              this.dataForm.areaParentName =
                data.ResoureProtectTargetEntity.areaParentName;
              this.dataForm.areaSize = data.ResoureProtectTargetEntity.areaSize;
              this.dataForm.riskReason =
                data.ResoureProtectTargetEntity.riskReason;
              this.dataForm.riskReasonParentName =
                data.ResoureProtectTargetEntity.riskReasonParentName;
              this.dataForm.chargeUnit =
                data.ResoureProtectTargetEntity.chargeUnit;
              this.dataForm.nowNumber =
                data.ResoureProtectTargetEntity.nowNumber;
              this.dataForm.useTime = data.ResoureProtectTargetEntity.useTime;
              this.dataForm.canuseNumber =
                data.ResoureProtectTargetEntity.canuseNumber;
              this.dataForm.layout = data.ResoureProtectTargetEntity.layout;
              this.dataForm.monitorWay =
                data.ResoureProtectTargetEntity.monitorWay;
              this.dataForm.dataSourceUnit =
                data.ResoureProtectTargetEntity.dataSourceUnit;
              this.dataForm.defenseArea =
                data.ResoureProtectTargetEntity.defenseArea;
              this.dataForm.trafficConditions =
                data.ResoureProtectTargetEntity.trafficConditions;
              this.dataForm.generalSituation =
                data.ResoureProtectTargetEntity.generalSituation;
              this.dataForm.conservatoryMeasure =
                data.ResoureProtectTargetEntity.conservatoryMeasure;
              this.dataForm.communicationMode =
                data.ResoureProtectTargetEntity.communicationMode;
              this.dataForm.remark = data.ResoureProtectTargetEntity.remark;

              this.dataForm.contactsId =
                data.ResoureProtectTargetEntity.contactsList;
              this.dataForm.chargeId =
                data.ResoureProtectTargetEntity.responsiblesList;

              // 行政区划数据回渲
              if (this.dataForm.area) {
                this.areaGettingFocus();
                this.areaVisible = false;
                let that = this;
                setTimeout(() => {
                  areaParentName(this.areaList[0]);
                  function areaParentName(obj) {
                    if (obj.children != null) {
                      obj.children.map(v => {
                        if (v.id == that.dataForm.area) {
                          that.dataForm.areaParentName = v.name;
                          return;
                        }
                        areaParentName(v);
                      });
                    }else{
                      if (obj.id == that.dataForm.area) {
                          that.dataForm.areaParentName = obj.name;
                          return;
                        }
                    }
                  }
                }, 500);
              }
              // 防护目标数据回渲
              if (this.dataForm.protectType) {
                this.teamTypeGettingFocus();
                this.teamTypeVisible = false;
                let that = this;
                setTimeout(() => {
                  this.teamTypeList.map((v,index)=>{
                    areaParentName(this.teamTypeList[index]);
                  })
                  function areaParentName(obj) {
                    if (obj.children != null) {
                      obj.children.map(v => {
                        if (v.id == that.dataForm.protectType) {
                          that.dataForm.protectTypeName = v.name;
                          return;
                        }
                        areaParentName(v);
                      });
                    }else{
                      if (obj.id == that.dataForm.protectType) {
                          that.dataForm.protectTypeName = obj.name;
                          return;
                        }
                    }
                  }
                }, 500);
              }
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    // 分组树选中
    protectTypeListTreeCurrentChangeHandle(data, node) {
      // console.log("分组树选中", data, node);
      this.dataForm.protectType = data.id;

      this.dataForm.eventTypeParentId = data.id;
      this.dataForm.protectTypeName = data.name;
    },
    // 分组树选中
    riskReasonListTreeCurrentChangeHandle(data, node) {
      // console.log("分组树选中", data, node);
      this.dataForm.riskReason = data.id;

      this.dataForm.eventTypeParentId = data.id;
      this.dataForm.riskReasonParentName = data.name;
    },
    // 分组树选中
    areaListTreeCurrentChangeHandle(data, node) {
      // console.log("分组树选中", data, node);
      this.dataForm.area = data.id;

      this.dataForm.eventTypeParentId = data.id;
      this.dataForm.areaParentName = data.name;
    },
    //当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
    teamTypeGettingFocus(event) {
      this.teamTypeVisible = true;
      this.$http({
        url: this.$http.adornUrl("/resoure/resoureProtectGroup/listTree"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          if (data.code == 0) {
            this.dataForm.protectTypeName = "";
            // data.data.splice(0, 0, { id: 0, name: "所有目标" });
            this.teamTypeList = treeDataTranslate(data.data, "id");
            // this.teamTypeList = data.data
            console.log(this.teamTypeList);
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {
          this.visible = true;
        })
        .then(() => {
          // 新增
          // this.dataForm.name=''
          this.dataForm.gmtCreate = "";
          this.teamTypeListTreeSetCurrentNode();
        });
    },
    //当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
    riskReasonGettingFocus(event) {
      this.riskReasonVisible = true;
      this.$http({
        url: this.$http.adornUrl("/resoure/resoureProtectGroup/tree"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          if (data.code == 0) {
            this.dataForm.riskReasonParentName = "";
            // data.tree.splice(0,0, {id:0,name: '顶级分组节点'})
            this.riskReasonList = treeDataTranslate(data.tree, "id");
            // this.riskReasonList = data.tree
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {
          this.visible = true;
        })
        .then(() => {
          // 新增
          // this.dataForm.name=''
          this.dataForm.gmtCreate = "";
          this.riskReasonListTreeSetCurrentNode();
        });
    },
    //当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
    areaGettingFocus(event) {
      this.areaVisible = true;
      this.$http({
        url: this.$http.adornUrl("/resoure/resourareatype/list"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          if (data.code == 0) {
            // console.log('platShareMenuList++++++++++++++++++++++++++++++++++++++++++++',this.platShareMenuList)
            this.dataForm.areaParentName = "";
            // data.data.splice(0,0, {id:0,name: '顶级分组节点'})
            this.areaList = treeDataTranslate(data.tree, "id");
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {
          this.visible = true;
        })
        .then(() => {
          // 新增
          // this.dataForm.name=''
          this.dataForm.gmtCreate = "";
          this.areaListTreeSetCurrentNode();
        });
    },
    //分组树设置当前选中节点
    teamTypeListTreeSetCurrentNode() {
      this.$refs.teamTypeTree.setCurrentKey(this.dataForm.id);
      this.dataForm.protectTypeName = (this.$refs.teamTypeTree.getCurrentNode() ||
        {})["name"];
    },
    //分组树设置当前选中节点
    riskReasonListTreeSetCurrentNode() {
      this.$refs.riskReasonTree.setCurrentKey(this.dataForm.id);
      this.dataForm.riskReasonName = (this.$refs.riskReasonTree.getCurrentNode() ||
        {})["name"];
    },
    //分组树设置当前选中节点
    areaListTreeSetCurrentNode() {
      this.$refs.areaTree.setCurrentKey(this.dataForm.id);
      this.dataForm.areaParentName = (this.$refs.areaTree.getCurrentNode() ||
        {})["name"];
    },
    //地图搜索回调事件
    onSearchResult(pois) {
      let latSum = 0;
      let lngSum = 0;
      if (pois.length > 0) {
        pois.forEach(poi => {
          let { lng, lat } = poi;
          lngSum += lng;
          latSum += lat;
          this.center = [poi.lng, poi.lat];
          this.lng = poi.lng;
          this.lat = poi.lat;
          this.address = pois[0].name;
        });
        let center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        };
        this.position = [center.lng, center.lat];
        this.center = [center.lng, center.lat];
      }
    },
    //地图提交
    LongitudeandLatitude() {
      this.dataForm.longitude = this.lng;
      this.dataForm.latitude = this.lat;
      this.dataForm.location = this.address;
      this.mapDialogVisible = false;
    },
    // 表单提交
    dataFormSubmit() {
      // console.log("表单提交", this.dataForm);
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/resoure/resoureProtectTarget/${
                !this.dataForm.id ? "save" : "update"
              }`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id,
              groupId: this.dataForm.groupId,
              name: this.dataForm.name,
              location: this.dataForm.location,
              longitude: this.dataForm.longitude,
              latitude: this.dataForm.latitude,
              level: this.dataForm.level,
              area: this.dataForm.area,
              chargeUnit: this.dataForm.chargeUnit,
              nowNumber: this.dataForm.nowNumber,
              useTime: this.dataForm.useTime,
              canuseNumber: this.dataForm.canuseNumber,
              conservatoryMeasure: this.dataForm.conservatoryMeasure,
              communicationMode: this.dataForm.communicationMode,
              protectLevel: this.dataForm.protectLevel,
              areaSize: this.dataForm.areaSize,
              protectType: this.dataForm.protectType,
              remark: this.dataForm.remark,
              contacts: this.dataForm.contactsId
                ? this.dataForm.contactsId.map(v => v.id)
                : this.dataForm.contactsId,
              //contactName: this.dataForm.contactsId?this.dataForm.contactsId.map(v=> v.name):this.dataForm.contactsId,
              responsibles: this.dataForm.chargeId,
              documentList: this.fileList
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                  this.$emit("close");
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview(file) {
      // console.log(file);
    },
    beforeAvatarUpload(files){
      // console.log('fileList: ', fileList);
      // console.log('files: ', files);
      let form = new FormData();
      form.append("file", files);
      // form.append('token',this.$cookie.get('token'))
      this.$http({
        url: this.$http.adornUrl("/upload/incidentDocument"),
        method: "post",
        data: form
      })
        .then(({ data }) => {
          this.fileList.push({name:data.data.name,url:data.data.url})
          console.log('data: ', data);
          // if (data.code == 0) {
          //   // console.log('platShareMenuList++++++++++++++++++++++++++++++++++++++++++++',this.platShareMenuList)
          //   this.dataForm.areaParentName = "";
          //   // data.data.splice(0,0, {id:0,name: '顶级分组节点'})
          //   this.areaList = treeDataTranslate(data.tree, "id");
          // } else {
          //   this.$message.error(data.msg);
          // }
        })
        .then(() => {
          this.visible = true;
        })
        .then(() => {
          // 新增
          // this.dataForm.name=''
          this.dataForm.gmtCreate = "";
          this.areaListTreeSetCurrentNode();
        });
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
    // 添加联系人视图
    addContactHandle(type) {
      if (type == "联系人") {
        this.$refs.AddContactView.getDataList(type, this.dataForm.contactsId);
      } else if (type == "负责人") {
        this.$refs.AddContactView.getDataList(type, this.dataForm.chargeId);
      }
    },
    delIt(type, id) {
      if (type == "contact") {
        this.dataForm.contactsId = this.dataForm.contactsId.filter(
          v => v.id !== id
        );
      } else if (type == "charge") {
        this.dataForm.chargeId = this.dataForm.chargeId.filter(
          v => v.id !== id
        );
      }
    }
  }
};
</script>
<style lang="scss" scoped>
button {
  background-color: #00a9f2;
  color: white;
  border-radius: 3px;
  border: none;
  padding: 10px 5px;
}
.addContact {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  line-height: 30px;
  outline: none;
}
/deep/ .el-message-box .el-message-box__btns .el-button--primary {
  background-color: #00a9f2;
}
/deep/ .el-button--primary:focus,
.el-button:hover {
  background-color: #00a9f2;
  border: none;
  color: white;
}

.allCheckContact {
  display: flex;
  flex-wrap: wrap;
  .checkContact {
    padding: 0;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    margin-right: 5px;
    .oneContact {
      background-color: #9bd4ec;
      color: #00a9f2;
      border: 1px solid #00a9f2;
      padding: 0 5px;
      border-radius: 3px;
    }
  }
  .operation {
    width: 30px;
    height: 30px;
    position: relative;
    .addContact {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      line-height: 30px;
      outline: none;
      border: none;
      background-color: #00a9f2;
    }
    .el-icon-plus {
      position: absolute;
      top: 39%;
      left: 24%;
      color: white;
    }
  }
}
</style>
