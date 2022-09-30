<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : type === 'watch' ? '查看' : '修改'"
    :close-on-click-modal="false"
    width="820px"
    :visible.sync="visible"
    @closed="type = ''"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px"
    >
      <el-form-item label="队伍名称" prop="name">
        <el-input
          v-model="dataForm.name"
          placeholder="队伍名称"
          :readonly="type == 'watch'"
        ></el-input>
      </el-form-item>

      <el-form-item label="负责人">
        <el-input
          v-model="dataForm.responsiblesName"
          placeholder="负责人"
          @focus="type !== 'watch' ? responsiblesVerify() : ''"
          :readonly="true"
        ></el-input>
      </el-form-item>

      <el-form-item label="联系人">
        <el-input
          v-model="dataForm.contactsName"
          placeholder="联系人"
          @focus="type !== 'watch' ? contactsVerify() : ''"
          :readonly="true"
        ></el-input>
      </el-form-item>

      <el-form-item label="队伍类型" prop="teamTypeParentName">
        <el-dialog
          title="请选择要新增到的队伍类型节点"
          :visible.sync="teamTypeVisible"
          width="30%"
          append-to-body
        >
          <el-tree
            :data="teamTypeList"
            :props="eventTypeListTreeProps"
            node-key="id"
            ref="teamTypeTree"
            @current-change="teamTypeListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :auto-expand-parent="true"
            :highlight-current="true"
            :expand-on-click-node="false"
          ></el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="teamTypeVisible = false">取 消</el-button>
            <el-button type="primary" @click="teamTypeVisible = false"
              >确 定</el-button
            >
          </span>
        </el-dialog>
        <el-input
          v-model="dataForm.teamTypeParentName"
          @focus="type !== 'watch' ? teamTypeGettingFocus() : ''"
          v-popover:eventTypeListPopover
          placeholder="选择分组"
          :readonly="true"
        ></el-input>
        <el-input
          v-show="false"
          v-model="dataForm.teamTypeId"
          :readonly="true"
        ></el-input>
      </el-form-item>

      <el-form-item label="队伍单位">
        <el-dialog
          title="请选择要新增到的队伍类型节点"
          :visible.sync="unitVisible"
          width="30%"
          append-to-body
        >
          <el-tree
            :data="unitList"
            :props="eventTypeListTreeProps"
            node-key="id"
            ref="unitTree"
            @current-change="unitListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :auto-expand-parent="true"
            :highlight-current="true"
            :expand-on-click-node="false"
          ></el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button @click="unitVisible = false">取 消</el-button>
            <el-button type="primary" @click="unitVisible = false"
              >确 定</el-button
            >
          </span>
        </el-dialog>
        <el-input
          v-model="dataForm.unitParentName"
          @focus="type !== 'watch' ? unitGettingFocus() : ''"
          v-popover:eventTypeListPopover
          placeholder="选择分组"
          :readonly="true"
        ></el-input>
        <el-input
          v-show="false"
          v-model="dataForm.groupId"
          :readonly="true"
        ></el-input>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="队伍人数">
            <el-input
              v-model="dataForm.peopleNumber"
              placeholder="队伍人数"
              :readonly="type == 'watch'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="成立时间" style="margin-left: 54px;">
            <el-date-picker
              unlink-panels
              v-model="dataForm.creationTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :readonly="type == 'watch'"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="传真">
            <el-input
              v-model="dataForm.fax"
              placeholder="传真"
              :readonly="type == 'watch'"
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
          <el-form-item label="应急时间" prop="preparationTime">
            <el-input v-model="dataForm.preparationTime" placeholder="应急准备时间(分钟)"></el-input>
          </el-form-item>
        </el-col>-->
        <el-col :span="8">
          <el-form-item label="值班电话">
            <el-input
              v-model="dataForm.telephoneNum"
              placeholder="值班电话"
              :readonly="type == 'watch'"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="机密等级">
            <!-- <el-input v-model="dataForm.secretLevel" placeholder="机密等级  1机密 2秘密 3限制  4公开  5其他"></el-input> -->
            <el-select
              v-model="dataForm.secretLevel"
              placeholder="请选择"
              :disabled="type == 'watch'"
            >
              <el-option
                v-for="item in secretLevelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="资质等级">
            <el-input
              v-model="dataForm.qualificationLevel"
              placeholder="资质等级"
              :readonly="type == 'watch'"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性质">
            <el-select
              v-model="dataForm.nature"
              placeholder="请选择"
              :disabled="type == 'watch'"
            >
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
          <el-form-item label="级别">
            <!-- <el-input v-model="dataForm.level" placeholder="级别  1:国家级2:省级3:市级 4:县级 5:乡镇级 5:其他"></el-input> -->
            <el-select
              v-model="dataForm.level"
              placeholder="请选择"
              :disabled="type == 'watch'"
            >
              <el-option
                v-for="item in levelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!--<el-col :span="6">
          <el-form-item label="机密" >
            &lt;!&ndash; <el-input v-model="dataForm.secretLevel" placeholder="机密等级  1机密 2秘密 3限制  4公开  5其他"></el-input> &ndash;&gt;
            <el-select v-model="dataForm.secretLevel" placeholder="请选择">
              <el-option
                v-for="item in secretLevelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>-->
      </el-row>

      <!--<el-form-item label="邮政编码" >
        <el-input v-model="dataForm.postalCode" placeholder="邮政编码"></el-input>
      </el-form-item>-->

      <el-form-item label="地址">
        <el-input
          v-model="dataForm.address"
          placeholder="地址"
          style="width: 90%"
          :readonly="true"
        ></el-input>
        <el-button
          @click="mapDialogVisible = true"
          style="width:8%"
          type="text"
          icon="el-icon-location-outline"
          v-if="type !== 'watch'"
          >定位</el-button
        >
      </el-form-item>

      <el-dialog title="地图" :visible.sync="mapDialogVisible" append-to-body>
        <div style="height:580px;">
          <div :style="{ width: '100%', height: '500px', float: 'right' }">
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
              <el-amap-marker
                :position="position"
                :events="events"
              ></el-amap-marker>
              <!-- <el-amap-marker v-for="(position,index) in markers" :position="position" :key="index"></el-amap-marker> -->
            </el-amap>
            <div class="toolbar">
              position: [{{ lng }}, {{ lat }}] address: {{ address }}
              <div style="text-align: center">
                <el-button @click="mapDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="LongitudeandLatitude()"
                  >确定</el-button
                >
              </div>
            </div>
          </div>
        </div>
      </el-dialog>

      <!--<el-form-item label="单位地址" >
        <el-input v-model="dataForm.unitAddress" placeholder="单位地址"></el-input>
      </el-form-item>-->
      <el-form-item label="主要职责">
        <el-input
          type="textarea"
          :rows="2"
          v-model="dataForm.duties"
          placeholder="主要职责"
          :readonly="type == 'watch'"
          resize="none"
        ></el-input>
      </el-form-item>

      <el-form-item label="装备描述">
        <el-input
          type="textarea"
          :rows="2"
          v-model="dataForm.equipment"
          placeholder="装备描述"
          :readonly="type == 'watch'"
          resize="none"
        ></el-input>
      </el-form-item>

      <el-form-item label="专长">
        <el-input
          type="textarea"
          :rows="2"
          v-model="dataForm.specialty"
          placeholder="专长"
          :readonly="type == 'watch'"
          resize="none"
        ></el-input>
      </el-form-item>

      <el-form-item label="应急救援经历">
        <el-input
          type="textarea"
          :rows="2"
          v-model="dataForm.rescueExperience"
          placeholder="应急救援经历"
          :readonly="type == 'watch'"
          resize="none"
        ></el-input>
      </el-form-item>

      <el-form-item label="备注">
        <el-input
          type="textarea"
          :rows="2"
          v-model="dataForm.remark"
          placeholder="备注"
          :readonly="type == 'watch'"
          resize="none"
        ></el-input>
      </el-form-item>

      <!--<el-form-item label="通讯方式" >
        <el-input v-model="dataForm.communicationMethod" placeholder="应急通讯方式"></el-input>
      </el-form-item>-->
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
      v-if="type !== 'watch'"
      style="text-align:center;margin-top:-50px;"
    >
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </div>
    <LinkmanDraggable
      ref="responsiblesCommonLink"
      v-show="showResponsiblesCommonLink"
      @OnchildByValue="responsiblesLinkdata"
    ></LinkmanDraggable>
    <LinkmanDraggable
      ref="contactsCommonLink"
      v-show="showContactsCommonLink"
      @OnchildByValue="contactsLinkdata"
    ></LinkmanDraggable>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from "@/utils";
import LinkmanDraggable from "@/views/common/LinkmanDraggable ";
export default {
  data() {
    let self = this;
    return {
      showResponsiblesCommonLink: false,
      showContactsCommonLink: false,
      type: "",
      natureOptions: [
        {
          value: 1,
          label: "专职"
        },
        {
          value: 2,
          label: "兼职"
        },
        {
          value: 3,
          label: "专业志愿者"
        }
      ],
      levelOptions: [
        {
          value: 1,
          label: "国家级"
        },
        {
          value: 2,
          label: "省级"
        },
        {
          value: 3,
          label: "市级"
        },
        {
          value: 4,
          label: "县级"
        },
        {
          value: 5,
          label: "其他"
        }
      ],
      secretLevelOptions: [
        {
          value: 1,
          label: "机密"
        },
        {
          value: 2,
          label: "秘密"
        },
        {
          value: 3,
          label: "限制"
        },
        {
          value: 4,
          label: "公开"
        },
        {
          value: 5,
          label: "其他"
        }
      ],
      teamTypeVisible: false,
      unitVisible: false,
      teamTypeList: [],
      unitList: [],
      eventTypeListTreeProps: {
        label: "name",
        children: "children"
      },
      center: [113.3245904, 23.1066805],
      position: [113.3245904, 23.1066805],
      plugin: [
        {
          pName: "Geolocation",
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  console.log("result.position: ", result.position);
                  self.lng = result.position.lng;
                  self.lat = result.position.lat;
                  self.center = [self.lng, self.lat];
                  self.mapCenter = [self.lng, self.lat];
                  self.position = [self.lng, self.lat];
                  var geocoder = new AMap.Geocoder({
                    radius: 1000,
                    extensions: "all"
                  });
                  geocoder.getAddress([self.lng, self.lat], function(
                    status,
                    result
                  ) {
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
        teamTypeId: "",
        peopleNumber: "",
        qualificationLevel: "",
        creationTime: "",
        nature: "",
        level: "",
        secretLevel: "",
        areaCode: "",
        postalCode: "",
        fax: "",
        longitude: "",
        latitude: "",
        address: "",
        duties: "",
        specialty: "",
        equipment: "",
        remark: "",
        groupId: "",
        unitAddress: "",
        coordinateType: "",
        preparationTime: "",
        telephoneNum: "",
        rescueExperience: "",
        communicationMethod: "",
        isDeleted: "",
        createUserId: "",
        gmtCreate: "",
        modifiedUserId: "",
        gmtModified: "",
        platformId: "",
        teamTypeParentName: "",
        unitParentName: "",
        responsiblesName: "",
        responsibles: [],
        contactsName: "",
        contacts: []
      },
      dataRule: {
        name: [
          { required: true, message: "队伍名称不能为空", trigger: "blur" }
        ],
        responsiblesName: [{ required: true, message: "负责人不能为空" }],
        contactsName: [{ required: true, message: "联系人不能为空" }],
        teamTypeParentName: [{ required: true, message: "队伍类型不能为空" }],
        peopleNumber: [
          { required: true, message: "队伍人数不能为空", trigger: "blur" },
          {
            type: "number",
            message: "坐标类型必须为整数",
            trigger: "blur",
            transform: function(value) {
              return Number(value);
            }
          }
        ],
        qualificationLevel: [
          { required: true, message: "资质等级不能为空", trigger: "blur" }
        ],
        creationTime: [
          { required: true, message: "成立时间不能为空", trigger: "blur" }
        ],
        nature: [
          {
            required: true,
            message: "性质: 1:专职 2:兼职 3:专业志愿者不能为空",
            trigger: "blur"
          }
        ],
        level: [
          {
            required: true,
            message:
              "级别  1:国家级2:省级3:市级 4:县级 5:乡镇级 5:其他不能为空",
            trigger: "blur"
          }
        ],
        secretLevel: [
          {
            required: true,
            message: "机密等级  1机密 2秘密 3限制  4公开  5其他不能为空",
            trigger: "blur"
          }
        ],
        areaCode: [
          { required: true, message: "行政区域编码不能为空", trigger: "blur" }
        ],
        postalCode: [
          { required: true, message: "邮政编码不能为空", trigger: "blur" }
        ],
        fax: [{ required: true, message: "传真不能为空", trigger: "blur" }],
        longitude: [
          { required: true, message: "经度不能为空", trigger: "blur" }
        ],
        latitude: [
          { required: true, message: "纬度不能为空", trigger: "blur" }
        ],
        address: [{ required: true, message: "地址不能为空", trigger: "blur" }],
        duties: [
          { required: true, message: "主要职责不能为空", trigger: "blur" }
        ],
        specialty: [
          { required: true, message: "专长不能为空", trigger: "blur" }
        ],
        equipment: [
          { required: true, message: "装备描述不能为空", trigger: "blur" }
        ],
        remark: [{ required: true, message: "备注不能为空", trigger: "blur" }],
        unitParentName: [{ required: true, message: "队伍单位不能为空" }],
        unitAddress: [
          { required: true, message: "单位地址不能为空", trigger: "blur" }
        ],
        coordinateType: [
          // { required: true, message: '坐标类型不能为空', trigger: 'blur' },
          {
            type: "number",
            message: "坐标类型必须为整数",
            trigger: "blur",
            required: false,
            transform: function(value) {
              return Number(value);
            }
          }
          // { pattern: /^-?[1-9]\d*$/,message: '坐标类型必须为整数'}
        ],
        preparationTime: [
          // { required: true, message: '应急准备时间(分钟)不能为空', trigger: 'blur' },
          {
            type: "number",
            message: "坐标类型必须为整数",
            trigger: "blur",
            transform: function(value) {
              return Number(value);
            }
          }
        ],
        telephoneNum: [
          { required: true, message: "值班电话不能为空", trigger: "blur" }
        ],
        rescueExperience: [
          { required: true, message: "应急救援经历不能为空", trigger: "blur" }
        ],
        communicationMethod: [
          { required: true, message: "应急通讯方式不能为空", trigger: "blur" }
        ],
        isDeleted: [
          {
            required: true,
            message: "删除 0：未删除  1：已删除不能为空",
            trigger: "blur"
          }
        ],
        createUserId: [
          { required: true, message: "创建者id不能为空", trigger: "blur" }
        ],
        gmtCreate: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        modifiedUserId: [
          { required: true, message: "修改者Id不能为空", trigger: "blur" }
        ],
        gmtModified: [
          { required: true, message: "修改时间不能为空", trigger: "blur" }
        ],
        platformId: [
          { required: true, message: "平台id不能为空", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    LinkmanDraggable
  },
  methods: {
    init(id, status) {
      this.dataForm.id = id || 0;
      if (status === "watch") {
        this.type = status;
      }
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(
              `/resoure/resoureteam/info/${this.dataForm.id}`
            ),
            method: "get",
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.name = data.resoureTeam.name;
              this.dataForm.teamTypeId = data.resoureTeam.teamTypeId;
              this.dataForm.peopleNumber = data.resoureTeam.peopleNumber;
              this.dataForm.qualificationLevel =
                data.resoureTeam.qualificationLevel;
              this.dataForm.creationTime = data.resoureTeam.creationTime;
              this.dataForm.nature = data.resoureTeam.nature;
              this.dataForm.level = data.resoureTeam.level;
              this.dataForm.secretLevel = data.resoureTeam.secretLevel;
              this.dataForm.areaCode = data.resoureTeam.areaCode;
              this.dataForm.postalCode = data.resoureTeam.postalCode;
              this.dataForm.fax = data.resoureTeam.fax;
              this.dataForm.longitude = data.resoureTeam.longitude;
              this.dataForm.latitude = data.resoureTeam.latitude;
              this.dataForm.address = data.resoureTeam.address;
              this.dataForm.duties = data.resoureTeam.duties;
              this.dataForm.specialty = data.resoureTeam.specialty;
              this.dataForm.equipment = data.resoureTeam.equipment;
              this.dataForm.remark = data.resoureTeam.remark;
              this.dataForm.groupId = data.resoureTeam.groupId;
              this.dataForm.unitAddress = data.resoureTeam.unitAddress;
              this.dataForm.coordinateType = data.resoureTeam.coordinateType;
              this.dataForm.preparationTime = data.resoureTeam.preparationTime;
              this.dataForm.telephoneNum = data.resoureTeam.telephoneNum;
              this.dataForm.rescueExperience =
                data.resoureTeam.rescueExperience;
              this.dataForm.communicationMethod =
                data.resoureTeam.communicationMethod;
              this.dataForm.isDeleted = data.resoureTeam.isDeleted;
              this.dataForm.createUserId = data.resoureTeam.createUserId;
              this.dataForm.gmtCreate = data.resoureTeam.gmtCreate;
              this.dataForm.modifiedUserId = data.resoureTeam.modifiedUserId;
              this.dataForm.gmtModified = data.resoureTeam.gmtModified;
              this.dataForm.platformId = data.resoureTeam.platformId;
              this.dataForm.teamTypeParentName = data.resoureTeam.teamTypeName;
              this.dataForm.unitParentName = data.resoureTeam.groupName;
              this.dataForm.responsiblesName = "";
              this.dataForm.contactsName = "";
              data.resoureTeam.responsiblesList.forEach(item => {
                this.dataForm.responsiblesName =
                  this.dataForm.responsiblesName + " " + item.name;
                this.dataForm.responsibles.push(item.id);
              });
              data.resoureTeam.contactsList.forEach(item => {
                this.dataForm.contactsName =
                  this.dataForm.contactsName + " " + item.name;
                this.dataForm.contacts.push(item.id);
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    responsiblesLinkdata({ linkman, name }) {
      // console.log("负责人联系人linkman, name", linkman, name);
      linkman.forEach(item => {
        this.dataForm.responsiblesName =
          this.dataForm.responsiblesName + " " + item.name;
        // console.log('this.dataForm.responsiblesName: ', this.dataForm.responsiblesName);
        // this.$forceUpdate()
        this.dataForm.responsibles.push(String(item.id));
      });
    },
    responsiblesVerify() {
      this.showResponsiblesCommonLink = true;
      this.$refs.responsiblesCommonLink.handleAddContacts(
        "/mail/mailgroup/list",
        "请选择",
        "负责人"
      );
    },
    contactsLinkdata({ linkman, name }) {
      // console.log("联系人linkman, name", linkman, name);
      linkman.forEach(item => {
        this.dataForm.contactsName =
          this.dataForm.contactsName + " " + item.name;
        this.dataForm.contacts.push(String(item.id));
      });
    },
    contactsVerify() {
      this.showContactsCommonLink = true;
      this.$refs.contactsCommonLink.handleAddContacts(
        "/mail/mailgroup/list",
        "请选择",
        "联系人"
      );
    },
    // 分组树选中
    teamTypeListTreeCurrentChangeHandle(data, node) {
      // console.log('分组树选中',data, node)
      this.dataForm.teamTypeId = data.id;

      this.dataForm.eventTypeParentId = data.id;
      this.dataForm.teamTypeParentName = data.name;
    },
    // 分组树选中
    unitListTreeCurrentChangeHandle(data, node) {
      // console.log('分组树选中',data, node)
      this.dataForm.groupId = data.id;

      this.dataForm.eventTypeParentId = data.id;
      this.dataForm.unitParentName = data.name;
    },
    //当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
    teamTypeGettingFocus(event) {
      this.teamTypeVisible = true;
      this.$http({
        url: this.$http.adornUrl("/resoure/resoureteamtype/tree"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm.teamTypeParentName = "";
            // data.tree.splice(0,0, {id:0,name: '顶级分组节点'})
            this.teamTypeList = treeDataTranslate(data.data, "id");
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
    unitGettingFocus(event) {
      this.unitVisible = true;
      this.$http({
        url: this.$http.adornUrl("/mail/mailgroup/list"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm.unitParentName = "";
            // data.data.splice(0,0, {id:0,name: '顶级分组节点'})
            this.unitList = treeDataTranslate(data.data, "id");
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
          this.unitListTreeSetCurrentNode();
        });
    },
    //分组树设置当前选中节点
    teamTypeListTreeSetCurrentNode() {
      this.$refs.teamTypeTree.setCurrentKey(this.dataForm.id);
      this.dataForm.teamTypeParentName = (this.$refs.teamTypeTree.getCurrentNode() ||
        {})["name"];
    },
    //分组树设置当前选中节点
    unitListTreeSetCurrentNode() {
      this.$refs.unitTree.setCurrentKey(this.dataForm.id);
      this.dataForm.unitParentName = (this.$refs.unitTree.getCurrentNode() ||
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
      this.dataForm.address = this.address;
      this.mapDialogVisible = false;
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          // console.log('this.dataForm.creationTime',this.dataForm.creationTime)
          this.$http({
            url: this.$http.adornUrl(
              `/resoure/resoureteam/${!this.dataForm.id ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              name: this.dataForm.name,
              teamTypeId: this.dataForm.teamTypeId,
              peopleNumber: this.dataForm.peopleNumber,
              qualificationLevel: this.dataForm.qualificationLevel,
              creationTime: this.dataForm.creationTime,
              nature: this.dataForm.nature,
              level: this.dataForm.level,
              secretLevel: this.dataForm.secretLevel,
              areaCode: this.dataForm.areaCode,
              postalCode: this.dataForm.postalCode,
              fax: this.dataForm.fax,
              longitude: this.dataForm.longitude,
              latitude: this.dataForm.latitude,
              address: this.dataForm.address,
              duties: this.dataForm.duties,
              specialty: this.dataForm.specialty,
              equipment: this.dataForm.equipment,
              remark: this.dataForm.remark,
              groupId: this.dataForm.groupId,
              unitAddress: this.dataForm.unitAddress,
              coordinateType: Number(this.dataForm.coordinateType),
              preparationTime: Number(this.dataForm.preparationTime),
              telephoneNum: this.dataForm.telephoneNum,
              rescueExperience: this.dataForm.rescueExperience,
              communicationMethod: this.dataForm.communicationMethod,
              isDeleted: this.dataForm.isDeleted,
              createUserId: this.dataForm.createUserId,
              gmtCreate: this.dataForm.gmtCreate,
              modifiedUserId: this.dataForm.modifiedUserId,
              gmtModified: this.dataForm.gmtModified,
              platformId: this.dataForm.platformId,
              responsibles: this.dataForm.responsibles,
              contacts: this.dataForm.contacts
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
                  this.dataForm = this.$options.data().dataForm;
                }
              });
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>
