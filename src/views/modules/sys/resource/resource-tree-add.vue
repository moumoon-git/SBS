<template>
  <el-dialog
    title="新增物资仓库"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close="cancelFormSubmit"
  >
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="150px"
      @keyup.enter.native="dataFormSubmit()"
    >
      <el-form-item
        label="物资库名称"
        prop="name"
      >
        <el-input
          v-model="dataForm.name"
          :readonly="type===1"
        />
      </el-form-item>
      <el-form-item
        label="所属区域"
        prop="townId"
      >
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
      </el-form-item>
      <el-form-item
        label="物资仓库所在地"
        prop="address"
      >
        <el-input
          v-model="dataForm.address"
          type="textarea"
          :rows="1"
          resize="none"
          style="width: 90%"
          :placeholder="dataForm.address"
          read-only
        />
        <el-button
          style="width:8%"
          type="text"
          icon="el-icon-location-outline"
          @click="mapDialogVisible = true"
        >
          定位
        </el-button>
      </el-form-item>

      <el-form-item
        label="物资仓库类型"
        prop="classId"
      >
        <el-cascader
          ref="classId"
          v-model.trim="dataForm.classId"
          :options="warehouseTypeData"
          :props="propsObj"
          clearable
          style="float: left; width: 100%"
          :show-all-levels="false"
          placeholder="请选择装备仓库类型"
        />
      </el-form-item>

      <el-form-item
        label="物资库面积"
        prop="acreage"
      >
        <el-input
          v-model="dataForm.acreage"
          :readonly="type===1"
        />
      </el-form-item>

      <el-form-item
        v-if="type===2"
        label="主管单位"
        prop="responsibleUnitId"
      >
        <el-dialog
          title="请选择要新增到的分组节点"
          :visible.sync="newgroups"
          width="30%"
          append-to-body
        >
          <el-tree
            ref="eventTypeTree"
            :data="eventTypeList"
            :props="eventTypeListTreeProps"
            node-key="id"
            :default-expand-all="false"
            :auto-expand-parent="true"
            :highlight-current="true"
            :expand-on-click-node="false"
            @current-change="eventTypeListTreeCurrentChangeHandle"
          />
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              plain
              size="small"
              @click="newgroups = false"
            >取 消</el-button>
            <el-button
              type="primary"
              size="small"
              @click="newgroups = false"
            >确 定</el-button>
          </span>
        </el-dialog>
        <el-input
          v-model="dataForm.eventTypeParentName"
          v-popover:eventTypeListPopover
          placeholder="选择分组"
          :readonly="true"
          @focus="gettingfocus"
        />
        <el-input
          v-show="false"
          v-model="dataForm.responsibleUnitId"
          :readonly="true"
        />
      </el-form-item>

      <!--地图弹窗-->
      <el-dialog
        title="地图"
        :visible.sync="mapDialogVisible"
        append-to-body
      >
        <!-- <div style="height:580px;">
          <div :style="{width:'100%',height:'500px',float: 'right'}">
            <el-amap-search-box
              class="search-box"
              :search-option="searchOption"
              :on-search-result="onSearchResult"
            />
            <el-amap
              v-if="mapDialogVisible"
              id="amapDemo"
              :center="center"
              :zoom="12"
              class="amap-demo"
              :events="events"
              :plugin="plugin"
            >
              <el-amap-marker
                :position="position"
                :events="events"
              />
            </el-amap>
            <div class="toolbar">
              position: [{{ lng }}, {{ lat }}] address: {{ address }}
              <div style="text-align: center">
                <el-button
                  plain
                  size="small"
                  @click="mapDialogVisible = false"
                >
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
        </div> -->
        <div style="height: 700px">
          <Location
            :address="dataForm && dataForm.address"
            :lng-lat="[dataForm && dataForm.longitude, dataForm && dataForm.latitude]"
            :cgcsLngLatInit="[dataForm.cgcsLongitude, dataForm.cgcsLatitude]"
            @confirm="LongitudeandLatitude"
          />
        </div>
      </el-dialog>

      <!-- <el-form-item label="请选择联系人" prop="contactor_id" v-if="type===2">
            <el-dialog
              title="请选择要新增到的分组节点"
              :visible.sync="newcontactors"
              width="30%"
              append-to-body>
              <el-tree
                :data="eventTypeList"
                :props="eventTypeListTreeProps"
                node-key="id"
                ref="eventTypeTree"
                @current-change="eventTypeListTreeCurrentChangeHandle"
                :default-expand-all="true"
                :auto-expand-parent="true"
                :highlight-current="true"
                :expand-on-click-node="false">
              </el-tree><span slot="footer" class="dialog-footer">
                <el-button @click="newcontactors = false">取 消</el-button>
                <el-button type="primary" @click="newcontactors = false">确 定</el-button>
              </span>
            </el-dialog>
            <el-input v-model="dataForm.eventTypeParentName" @focus="gettingfocus" v-popover:eventTypeListPopover   placeholder="选择分组" :readonly="true" ></el-input>
            <el-input v-show="false" v-model="dataForm.parentId"   :readonly="true"></el-input>
          </el-form-item>-->

      <!-- <el-form-item label="传真" prop="fax">
            <el-input v-model="dataForm.fax"  v-bind:readonly="type===1"></el-input>
          </el-form-item>-->

      <el-form-item
        label="主管单位地址"
        prop="responsibleUnitAddress"
      >
        <el-input
          v-model="dataForm.responsibleUnitAddress"
          :readonly="type===1"
        />
      </el-form-item>

      <el-form-item
        v-if="type===2"
        label="请选择负责人"
      >
        <Linkman
          v-show="showcommonLink"
          ref="commonLink"
          @OnchildByValue="handelLinkdata"
        />
        <el-input
          v-model="dataForm.contactor_names"
          @focus="handelVerify('verify')"
        />
      </el-form-item>

      <el-form-item
        label="周边交通"
        prop="aroundTraffic"
      >
        <el-input
          v-model="dataForm.aroundTraffic"
          :readonly="type===1"
        />
      </el-form-item>

      <el-form-item
        label="物资库描述"
        prop="remark"
      >
        <el-input
          v-model="dataForm.remark"
          :readonly="type===1"
        />
      </el-form-item>
      <el-form-item label="关联设备">
        <el-dropdown
          trigger="click"
          placement="bottom-start"
          @command="handleCommand"
        >
          <el-button
            plain
          >
            增加
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item,key,idx) in deviceObj"
                :key="idx+key"
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
      </el-form-item>
      <div :class="$style.backDiv">
        <div
          v-for="(item,idx) in deviceTextArr"
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
            <div
              :class="$style.showDelete"
              @click.stop="deleteDevice(item1)"
            />
          </div>
        </div>
      </div>
    </el-form>
    <span slot="footer">
      <el-button
        plain
        size="small"
        @click="cancelFormSubmit"
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
    </span>
  </el-dialog>
</template>

<script>
import Location from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/Location.vue';
import { treeDataTranslate } from '@/utils';
import Linkman from '@/views/common/LinkmanRadio';
import deviceDialog from './deviceDialog.vue';

export default {
  components: {
    Linkman,
    deviceDialog,
    Location,
  },
  props: {
    // 分组树形列表，用来判断重名
    treeList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const self = this;
    const isExistName = (rule, value, callback) => {
      // 改用接口判断命名
      // if (this.treeList) {
      //   for (let i = 0; i < this.treeList.length; i += 1) {
      //     const node = this.treeList[i];
      //     if (node.name === value && node.id !== this.dataForm.id) {
      //       callback(new Error('分组名已存在'));
      //       return;
      //     }
      //   }
      // }
      if (value) {
        this.$http({
          url: `${window.SITE_CONFIG.baseUrl}/resoure/resourearticlestorehouse/verifyName`,
          method: 'get',
          params: this.$http.adornParams({
            name: value,
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            if (!data.data) {
              callback(new Error('当前仓库已有该装备'));
            } else {
              callback();
            }
          }
        });
      }
    };
    return {
      plugin: [{ pName: 'Geolocation' }],
      // 联系人数据
      contactor: {
        // 性别
        sex: '',
        // id
        id: 0,
        parentId: 0,
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
        // 邮箱地址
        email: '',
        // 描述
        remark: '',
        // 年龄
        age: 1,
        // 是否为常用联系人
        importance: 0,
        // 是否为重要联系人
        commonlyUsed: 0,
        // 经度
        longitude: '',
        // 纬度
        latitude: '',
        // 人物地点
        address: '',
        acreage: '',
      },
      lng: 0,
      lat: 0,
      address: '',
      // 高德地图
      markers: [
        [113.3245904, 23.2066805],
        [113.323623, 23.106341],
        [113.325399, 23.106156],
      ],
      position: [113.3245904, 23.1066805],
      center: [113.3245904, 23.1066805],
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
      // 地图弹窗
      mapDialogVisible: false,
      // 分组弹出的开关
      newcontactors: false,
      showcommonLink: false, // 获取多人联系人弹窗
      newgroups: false,
      visible: false,
      type: 0,
      warehouseTypeData: [],
      propsObj: {
        value: 'id',
        label: 'name',
        children: 'children',
        checkStrictly: true,
      },
      dataForm: {
        id: 0,
        parentId: '',
        name: '',
        platformId: '',
        createUserId: '',
        gmtCreate: '',
        groupingdescription: '',
        modifiedUserId: '',
        gmtModified: '',
        isDeleted: '',
        eventTypeParentId: '',
        eventTypeParentName: '',
        contactor_ids: '',
        contactor_names: '',
        classId: '',
        // 经度
        longitude: '',
        // 纬度
        latitude: '',
        // 人物地点
        address: '',
        fax: '',
        remark: '',
        aroundTraffic: '',
        responsibleUnitAddress: '',
        responsibleUnitId: '',
        acreage: '',
        cgcsLongitude: '',
        cgcsLatitude: '',
      },
      eventTypeList: [], // 树的数据
      eventTypeListTreeProps: {
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
      dataRule: {
        eventTypeParentName: [
          { required: true, message: '请选择一个分组', trigger: 'blur' },
        ],
        responsibleUnitId: [
          // { required: true, message: '主管单位不能为空' },
        ],
        contactor_ids: [
          { required: true, message: '联系人不能为空', trigger: 'blur' },
        ],
        contactor_names: [
          // { required: true, message: '负责人不能为空', trigger: ['blur', 'change'] },
        ],
        address: [{ required: true, message: '地址不能为空', trigger: 'blur' }],
        classId: [{ required: true, message: '请选择物资仓库类型', trigger: 'blur' }],
        name: [
          { required: true, message: '分组名称不能为空', trigger: 'blur' },
          {
            min: 2, max: 50, message: '长度在2到50字左右', trigger: 'blur',
          },
          { validator: isExistName, trigger: 'blur' },
        ],
      },
      areaOptions: [], // 地区选择数据
      propsArea: {
        value: 'id',
        label: 'townName',
        children: 'children',
        checkStrictly: true,
        emitPath: false,
      },
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
  methods: {
    // 仓库类别
    warehouse(){
      this.$http({
        url: this.$http.adornUrl('/resoureArticleStorehouseClass/treeList'),
        method: 'get',
        params: {
          apiVersion: '0.0.2',
        },
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.warehouseTypeData = data.data;
          // console.log('%c [ xxx ]', 'font-size:13px; background:pink; color:#bf2c9f;', data.data); // 类型树数据
        } else {
          this.$message.error(data.msg);
        }
      }).catch((err) => {
        this.$message.error(err);
      });
      // , // 装备库
    },
    // 地图提交
    LongitudeandLatitude(addr, lnglat, spotInfo, cgcs) {
      this.dataForm.longitude = this.lng = lnglat[0];
      this.dataForm.latitude = this.lat = lnglat[1];
      this.dataForm.address = this.address = addr;
      this.contactor.longitude = this.lng;
      this.contactor.latitude = this.lat;
      this.contactor.address = this.address;
       // 大地坐标系
      this.dataForm.cgcsLongitude = cgcs[0];
      this.dataForm.cgcsLatitude = cgcs[1];
      this.mapDialogVisible = false;
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
    init(id, currenTreeObject, type) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.type = type;
      this.showDeviceData = {
        monitor: [],
        room: [],
        colony: [],
        // wecomm: [],
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
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields();
        /* if (type === 2) {
            this.$http({
              url: this.$http.adornUrl('/mail/mailgroup/list'),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.eventTypeParentName=''
              // data.data.splice(0,0, {id:0,name: '顶级分组节点'})
              this.eventTypeList = treeDataTranslate(data.data, 'id')
              // console.log(data.data)
              // console.log(this.eventTypeList)
            }).then(() => {
              this.visible = true
            }).then(() => {
              // 新增
              this.dataForm.name=''
              this.dataForm.gmtCreate=''
              this.eventTypeListTreeSetCurrentNode()
            })
          } */
      });
    },
    // 当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
    gettingfocus(event) {
      this.newgroups = true;
      this.$http({
        url: this.$http.adornUrl('/mail/mailgroup/list'),
        method: 'get',
        params: this.$http.adornParams(),
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm.eventTypeParentName = '';
            // data.data.splice(0,0, {id:0,name: '顶级分组节点'})
            this.eventTypeList = treeDataTranslate(data.data, 'id');
          } else {
            this.$message.error(data.msg);
          }
        })
        .then(() => {
          this.visible = true;
        })
        .then(() => {
          // 新增
          // this.dataForm.name = "";
          this.dataForm.gmtCreate = '';
          this.eventTypeListTreeSetCurrentNode();
        });
    },
    // 触发多选组件
    handelVerify(name) {
      this.showcommonLink = true;
      this.$refs.commonLink.handleAddContacts(
        '/mail/mailgroup/list',
        '请选择',
        name,
      );
    },
    // 多选组件 返回数据
    handelLinkdata({ linkman, name }) {
      const that = this;
      // console.log("handelLinkdata", linkman);
      that.dataForm.contactor_ids = [];
      that.dataForm.contactor_names = '';
      linkman.forEach((element) => {
        that.dataForm.contactor_ids.push(element.id);
        that.dataForm.contactor_names += `${element.name} `;
      });

      that.dataForm.contactor_ids = JSON.stringify(that.dataForm.contactor_ids);
    },

    // 分组树设置当前选中节点
    eventTypeListTreeSetCurrentNode() {
      this.$refs.eventTypeTree.setCurrentKey(this.dataForm.id);
      this.dataForm.eventTypeParentName = (this.$refs.eventTypeTree.getCurrentNode()
        || {}).name;
    },
    // 分组树选中
    eventTypeListTreeCurrentChangeHandle(data, node) {
      // console.log("分组树选中", data, node);
      this.dataForm.responsibleUnitId = data.id;

      this.dataForm.eventTypeParentId = data.id;
      this.dataForm.eventTypeParentName = data.name;
    },

    // 表单提交
    dataFormSubmit() {
      const that = this;
      this.$refs.dataForm.validate((valid) => {
        if (valid && (this.type === 2 || this.type === 3)) {
          // console.log(
          //   "this.dataForm.contactor_ids",
          //   that.dataForm.contactor_ids,
          //   typeof that.dataForm.contactor_ids
          // );
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
          this.$http({
            url: this.$http.adornUrl(
              `/resoure/resourearticlestorehouse/${
                this.type === 2 ? 'save' : 'update'
              }`,
            ),
            method: 'post',
            data: this.$http.adornData({
              // 'id': this.dataForm.id || undefined,
              // 'parentId': this.dataForm.parentId,
              name: this.dataForm.name,
              townId: this.dataForm.townId,
              remark: this.dataForm.remark,
              contactorStringIds: that.dataForm.contactor_ids || '',
              fax: this.dataForm.fax,
              longitude: this.dataForm.longitude,
              latitude: this.dataForm.latitude,
              coordinateType: 1,
              responsibleUnitId: this.dataForm.responsibleUnitId,
              classId: this.dataForm.classId[this.dataForm.classId.length - 1],
              responsibleUnitAddress: this.dataForm.responsibleUnitAddress,
              aroundTraffic: this.dataForm.aroundTraffic,
              address: this.dataForm.address,
              acreage: this.dataForm.acreage,
              params,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false;
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
              });
              this.$emit('refreshEventTypeDataList');
              this.$emit('close');
            } else {
              // this.$message.error("请选择你要新增到的分组节点");
              this.$message.error(`${data.msg}`);
            }
          });
        }
      });
    },
    /**
     * @description: 取消提交表单
     * @param {}
     * @return {}
     */
    cancelFormSubmit() {
      // 重置表单为默认值
      // this.$refs.dataForm.resetFields();
      // 清空表单内容
      this.contactor.address = '';
      this.dataForm.eventTypeParentName = '';
      this.dataForm.contactor_names = '';
      // 关闭表单
      this.visible = false;
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
    deleteDevice(item) {
      const arrType = this.deviceTypeObj[item.type];
      const index = this.showDeviceData[arrType].findIndex((it) => it.id === item.id);
      this.showDeviceData[arrType].splice(
        index,
        1,
      );
    },
  },
  beforeMount() {
    this.warehouse();
  },
};
</script>
<style lang="scss" module>
.backDiv {
  margin-left: 55px;
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
      background: url('../../DeviceAdmin/assets/close.svg')no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
    }
  }
}
</style>
