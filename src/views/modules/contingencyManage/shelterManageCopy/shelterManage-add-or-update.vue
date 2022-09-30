<template>
  <el-dialog
    :title="type=='modify'?'修改':(type=='watch'?'查看':'新增')"
    :close-on-click-modal="false"
    width="900px"
    :visible.sync="visible"
    @closed="type=''"
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
          <el-form-item label="行政区划" prop="areaId">
            <el-dialog title="选择行政区划" :visible.sync="teamTypeVisible" width="30%" append-to-body>
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
                <el-button type="primary" @click="teamTypeVisible = false">确 定</el-button>
              </span>
            </el-dialog>
            <el-input
              v-model="dataForm.teamTypeParentName"
              v-popover:eventTypeListPopover
              placeholder="选择分组"
              :readonly="true"
              style="width:71%;"
            ></el-input>
            <el-button
              class="button"
              @click="teamTypeGettingFocus"
              style="height: 34px;line-height: 12px;vertical-align: top;"
            >
            选择
            </el-button>
            <el-input v-show="false" v-model="dataForm.areaId" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="地址" prop="address">
        <el-input v-model="dataForm.address" style="width: 88%" :readonly="type=='watch'"></el-input>
        <el-button
          @click="mapDialogVisible = true"
          style="width:10%"
          type="text"
          icon="el-icon-location-outline"
        >定位</el-button>
      </el-form-item>

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
        <el-col :span="12">
          <el-form-item label="经度" prop="longitude">
            <el-input style="width:100%;" :readonly="type=='watch'" v-model="dataForm.longitude"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纬度" prop="latitude">
            <el-input style="width:100%;" :readonly="type=='watch'" v-model="dataForm.latitude"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="场所功能" prop="feature">
            <el-input v-model="dataForm.feature" :readonly="type=='watch'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="面积(m²)" prop="acreage">
            <el-input-number
              controls-position="right"
              style="width:100%;"
              :min="0"
              v-model="dataForm.acreage"
              :disabled="type=='watch'"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="可容纳人数" prop="peopleNum">
            <el-input-number
              controls-position="right"
              :min="0"
              style="width:100%;"
              v-model="dataForm.peopleNum"
              :disabled="type=='watch'"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="抗震设防程度" prop="level">
            <el-input-number
              v-model="dataForm.level"
              controls-position="right"
              style="width:100%;"
              :min="0"
              :disabled="type=='watch'"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="使用时间" prop="useTime">
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
        <el-col :span="12">
          <el-form-item label="设计使用年限" prop="useYear">
            <el-input-number
              controls-position="right"
              style="width:100%;"
              :min="0"
              v-model="dataForm.useYear"
              :disabled="type=='watch'"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="主管单位" prop="competentUnit">
            <el-input v-model="dataForm.competentUnit" :readonly="type=='watch'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="应急标识" prop="emergencyFlag">
            <el-select v-model="dataForm.emergencyFlag" placeholder="请选择" style="width:100%;">
              <el-option
                v-for="item in natureOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="给排水情况" prop="waterDetails">
        <el-input type="textarea" :rows="2" v-model="dataForm.waterDetails" resize="none" :readonly="type=='watch'"></el-input>
      </el-form-item>

      <el-form-item label="供电状况" prop="electricityDetails">
        <el-input type="textarea" :rows="2" v-model="dataForm.electricityDetails" resize="none" :readonly="type=='watch'"></el-input>
      </el-form-item>

      <el-form-item label="通风状况" prop="windDetails">
        <el-input type="textarea" :rows="2" v-model="dataForm.windDetails" resize="none" :readonly="type=='watch'"></el-input>
      </el-form-item>

      <el-form-item label="应急器材" prop="emergencyEquipment">
        <el-input type="textarea" :rows="2" v-model="dataForm.emergencyEquipment" resize="none" :readonly="type=='watch'"></el-input>
      </el-form-item>

      <el-form-item label="储备物资" prop="storeMaterials">
        <el-input type="textarea" :rows="2" v-model="dataForm.storeMaterials" resize="none" :readonly="type=='watch'"></el-input>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :rows="2" v-model="dataForm.remark" resize="none" :readonly="type=='watch'"></el-input>
      </el-form-item>

      <el-form-item label="联系人">
        <div class="allCheckContact">
          <ul class="checkContact">
            <li class="oneContact" v-for="item in dataForm.contactsId" :key="item.id">
              {{item.name}}&nbsp;&nbsp;&nbsp;&nbsp;
              <i class="el-icon-close" @click="delIt(item.id)" v-if="type!='watch'"></i>
            </li>
          </ul>
          <div class="operation" @click="addContactHandle" v-if="type!='watch'">
            <input type="”button”" class="addContact" />
            <i class="el-icon-plus"></i>
          </div>
        </div>
        <!-- 添加联系人 -->
        <add-contact ref="AddContactView" v-on="$listeners"></add-contact>
      </el-form-item>
    </el-form>
    <div
      slot="footer"
      class="dialog-footer"
      v-if="type=='modify' || type==''"
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
        name: "",
        areaTypeId: '',
        areaId: "",
        level: "",
        feature: "",
        peopleNum: 0,
        acreage: 0,
        useTime: "",
        useYear: 0,
        emergencyFlag: "",
        longitude: "",
        latitude: "",
        competentUnit: "",
        storeMaterials: "",
        address: "",
        waterDetails: "",
        windDetails: "",
        electricityDetails: "",
        remark: "",
        emergencyEquipment: "",
        contactsId: [],
      },
      dataRule: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        areaId: [{ required: true, message: "行政区划不能为空" }],
        acreage: [
          { required: true, message: "面积不能为空", trigger: "blur" },
          {
            type: "number",
            message: "面积类型必须为整数",
            trigger: "blur",
            transform: function(value) {
              return Number(value);
            }
          }
        ],
        peopleNum: [
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
        qualificationLevel: [
          { required: true, message: "资质等级不能为空", trigger: "blur" }
        ],
        useTime: [
          { required: true, message: "使用时间不能为空", trigger: "blur" }
        ],
        emergencyEquipment: [
          {
            required: true,
            message: "应急标识: 1:专职 2:兼职 3:专业志愿者不能为空",
            trigger: "blur"
          }
        ],
        feature: [
          { required: true, message: "场所功能不能为空", trigger: "blur" }
        ],
        competentUnit: [
          { required: true, message: "主管单位不能为空", trigger: "blur" }
        ],
        longitude: [
          { required: true, message: "经度不能为空", trigger: "blur" }
        ],
        latitude: [
          { required: true, message: "纬度不能为空", trigger: "blur" }
        ],
        address: [{ required: true, message: "地址不能为空", trigger: "blur" }],
        remark: [{ required: true, message: "备注不能为空", trigger: "blur" }],
        level: [
          { required: true, message: '抗震设防程度类型不能为空', trigger: 'blur' },
          {
            type: "number",
            message: "抗震设防程度类型必须为整数",
            trigger: "blur",
            required: false,
            transform: function(value) {
              return Number(value);
            }
          }
          // { pattern: /^-?[1-9]\d*$/,message: '坐标类型必须为整数'}
        ],
        useYear: [
          { required: true, message: '设计使用年限不能为空', trigger: 'blur' },
          {
            type: "number",
            message: "设计使用年限类型必须为整数",
            trigger: "blur",
            transform: function(value) {
              return Number(value);
            }
          }
        ],
        waterDetails: [
          { required: true, message: "给排水情况不能为空", trigger: "blur" }
        ],
        electricityDetails: [
          { required: true, message: "供电状况不能为空", trigger: "blur" }
        ],
        windDetails: [
          { required: true, message: "通风状况不能为空", trigger: "blur" }
        ],
        emergencyFlag: [
          { required: true, message: "应急器材不能为空", trigger: "blur" }
        ],
        storeMaterials: [
          { required: true, message: "储备物资不能为空", trigger: "blur" }
        ],
      }
    };
  },
  mounted() {
    // 获取已选联系人
    bus.$off("getCheckContact");
    bus.$on("getCheckContact", val => {
      // console.log(val)
      this.dataForm.contactsId = val;
    });
  },
  methods: {
    init(id, status) {
      this.visible = true;
      if (status) {
        this.type = status;
      }
      // console.log(id)
      if (typeof id !== "object") {
        this.dataForm.areaTypeId = id;
        this.$nextTick(()=>{
          this.$refs["dataForm"].resetFields();
          this.dataForm.contactsId = []
        })
      } else {
        this.$nextTick(() => {
          this.$refs["dataForm"].resetFields();
          this.dataForm.contactsId = []
          this.dataForm.areaTypeId = id.id;
          this.dataForm.name = id.name;
          this.dataForm.areaId = id.areaTypeId;
          this.dataForm.level = id.level;
          this.dataForm.feature = id.feature;
          this.dataForm.acreage = id.acreage;
          this.dataForm.useTime = id.useTime;
          this.dataForm.useYear = id.useYear;
          this.dataForm.emergencyFlag = id.emergencyFlag;
          this.dataForm.longitude = id.longitude;
          this.dataForm.latitude = id.latitude;
          this.dataForm.address = id.address;
          this.dataForm.competentUnit = id.competentUnit;
          this.dataForm.storeMaterials = id.storeMaterials;
          this.dataForm.waterDetails = id.waterDetails;
          this.dataForm.remark = id.remark;
          this.dataForm.windDetails = id.windDetails;
          this.dataForm.electricityDetails = id.electricityDetails;
          this.dataForm.emergencyEquipment = id.emergencyEquipment;
          this.dataForm.contactsId = id.contactorlist;

          // 防护目标数据回渲
            if (this.dataForm.protectType) {
              this.teamTypeListTreeSetCurrentNode();
              this.teamTypeVisible = false;
              let that = this;
              setTimeout(() => {
                areaParentName(this.areaList[0]);
                function areaParentName(obj) {
                  if (obj.children != null) {
                    obj.children.map(v => {
                      if (v.id == that.dataForm.area) {
                        that.dataForm.teamTypeParentName = v.name;
                        return;
                      }
                      areaParentName(v);
                    });
                  }
                }
              }, 500);
            }
        });
      }
    },
    // 分组树选中
    teamTypeListTreeCurrentChangeHandle(data, node) {
      // console.log("分组树选中", data, node);
      this.dataForm.areaId = data.id;

      this.dataForm.eventTypeParentId = data.id;
      this.dataForm.teamTypeParentName = data.name;
    },

    //当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
    teamTypeGettingFocus(event) {
      this.teamTypeVisible = true;
      this.$http({
        url: this.$http.adornUrl("/resoure/resourareatype/list"),
        method: "get",
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          if (data && data.code == 0) {
            this.dataForm.teamTypeParentName = "";
            // data.tree.splice(0,0, {id:0,name: '顶级分组节点'})
            this.teamTypeList = treeDataTranslate(data.tree, "id");
            // this.teamTypeList = data.tree
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

    //分组树设置当前选中节点
    teamTypeListTreeSetCurrentNode() {
      this.$refs.teamTypeTree.setCurrentKey(this.dataForm.id);
      this.dataForm.teamTypeParentName = (this.$refs.teamTypeTree.getCurrentNode() ||
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
      // console.log("this.dataForm", this.dataForm.contactsId.map(v=>v.id));
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/resoure/resourearea/${!this.type ? "save" : "update"}`
            ),
            method: "post",
            data: this.$http.adornData({
              name: this.dataForm.name,
              areaTypeId: this.dataForm.areaTypeId,
              id: this.dataForm.areaId || undefined,
              peopleNum: this.dataForm.peopleNum,
              level: this.dataForm.level,
              longitude: this.dataForm.longitude,
              latitude: this.dataForm.latitude,
              address: this.dataForm.address,
              feature: this.dataForm.feature,
              acreage: this.dataForm.acreage,
              useTime: this.dataForm.useTime,
              useYear: this.dataForm.useYear,
              competentUnit: this.dataForm.competentUnit,
              emergencyFlag: this.dataForm.emergencyFlag,
              waterDetails: this.dataForm.waterDetails,
              electricityDetails: this.dataForm.electricityDetails,
              windDetails: this.dataForm.windDetails,
              emergencyEquipment: this.dataForm.emergencyEquipment,
              storeMaterials: this.dataForm.storeMaterials,
              remark: this.dataForm.remark,
              contactsId: this.dataForm.contactsId.map(v => v.id)
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
    // 添加联系人视图
    addContactHandle() {
      this.$refs.AddContactView.getDataList(this.dataForm.contactsId);
    },
    delIt(id) {
      this.dataForm.contactsId = this.dataForm.contactsId.filter(
        v => v.id !== id
      );
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
      top: 40%;
      left: 30%;
      color: white;
    }
  }
}
</style>
