<template>
  <el-dialog
    :title="readOnlyFlag == 2 ? '新增装备仓库' : '修改装备仓库'"
    width="35%"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close="cancelFormSubmit"
  >
    <el-form
      ref="dataForm"
      class="formStyle"
      :model="dataForm"
      :rules="dataRule"
      label-width="125px"
      @keyup.enter.native="dataFormSubmit()"
    >
      <el-form-item
        label="装备库名称"
        prop="name"
      >
        <el-input
          v-model="dataForm.name"
        />
      </el-form-item>

      <el-form-item
        label="所属区域"
        prop="townId"
      >
        <el-cascader
          ref="townId"
          v-model.trim="dataForm.townId"
          style="width: 100%;"
          :options="jurisdictionData"
          :props="propsArea"
          clearable
          :show-all-levels="false"
        />
      </el-form-item>

      <el-form-item
        label="装备仓库所在地"
        prop="address"
        style="white-space: nowrap;"
      >
        <el-input
          v-model="dataForm.address"
          type="textarea"
          :rows="1"
          resize="none"
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
        label="应急类别"
        prop="caseClassId"
      >
        <el-cascader
          ref="caseClassId"
          v-model.trim="dataForm.caseClassId"
          :options="eventTypeData"
          :props="propsObj"
          clearable
          style="float: left; width: 100%"
          :show-all-levels="false"
          placeholder="请选择应急类别"
        />
      </el-form-item>

      <el-form-item
        label="装备仓库类型"
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
        label="仓库面积"
        prop="acreage"
      >
        <el-input
          v-model="dataForm.acreage"
        />
      </el-form-item>

      <!--          主管单位-->
      <el-form-item
        label="主管单位"
        prop="responsibleUnitName"
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
            :default-expand-all="true"
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
          v-model="dataForm.responsibleUnitName"
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
        class="mapdialog"
        title="地图"
        :visible.sync="mapDialogVisible"
        append-to-body
      >
        <div style="height: 200px">
          <Location
            :address="dataForm.address"
            :lng-lat="[dataForm.longitude, dataForm.latitude]"
            :cgcsLngLatInit="[dataForm.cgcsLongitude, dataForm.cgcsLatitude]"
            @confirm="handleLocationConfirm"
          />
        </div>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="mapDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="mapDialogVisible = false"
          >确 定</el-button>
        </span>
      </el-dialog>

      <el-form-item
        label="单位地址"
        prop="responsibleUnitAddress"
      >
        <el-input
          v-model="dataForm.responsibleUnitAddress"
        />
      </el-form-item>

      <el-form-item
        label="值班电话"
        prop="phone"
      >
        <el-input
          v-model="dataForm.phone"
        />
      </el-form-item>

      <el-form-item
        label="负责人"
        prop="contactor"
      >
        <el-input
          v-model="dataForm.contactor"
          placeholder="请输入"
          @focus="handleInform()"
        />
      </el-form-item>

      <el-form-item
        label="周边交通"
        prop="aroundTraffic"
      >
        <el-input
          v-model="dataForm.aroundTraffic"
        />
      </el-form-item>

      <el-form-item
        label="仓库描述"
        prop="remark"
      >
        <el-input
          v-model="dataForm.remark"
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
    <!-- 单选联系人弹窗 -->
    <LinkmanRadio
      v-show="showcommonLink"
      ref="commonLink"
      @OnchildByValue="handelLinkdata"
    />
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils';
import LinkmanRadio from '@/views/common/LinkmanRadio';
import Location from '../GarbageClassification/SiteManagement/ClassificationSite/Location/Location.vue';
import deviceDialog from '../sys/resource/deviceDialog.vue';

export default {
  components: {
    Location,
    LinkmanRadio,
    deviceDialog,
  },
  props: {
    // 分组树形列表，用来判断重名
    treeList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const isExistName = (rule, value, callback) => {
      if (this.treeList) {
        for (let i = 0; i < this.treeList.length; i += 1) {
          const node = this.treeList[i];
          if (node.name === value && node.id !== this.dataForm.id) {
            callback(new Error('分组名已存在'));
            return;
          }
        }
      }
      callback();
    };
    return {
      plugin: [{ pName: 'Geolocation' }],
      address: '',
      // 地图弹窗
      mapDialogVisible: false,
      // 分组弹出的开关
      newcontactors: false,
      showcommonLink: false, // 获取多人联系人弹窗
      newgroups: false,
      visible: false,
      readOnlyFlag: 0,
      jurisdictionData: [],
      eventTypeData: [], // 事件类型
      warehouseTypeData: [], // 事件类型
      propsObj: {
        value: 'id',
        label: 'name',
        children: 'children',
        checkStrictly: true,
      },
      dataForm: {
        id: '',
        name: '',
        townId: '',
        address: '',
        longitude: '',
        latitude: '',
        leibie: '',
        acreage: '',
        caseClassId: '',
        classId: '',
        className: '',
        responsibleUnitId: '', // 主管单位
        responsibleUnitName: '',
        responsibleUnitAddress: '', // 单位地址
        phone: '',
        contactor: '',
        contactorId: '', // 负责人
        aroundTraffic: '', // 周边交通
        remark: '', // 仓库描述
        cgcsLongitude: '',
        cgcsLatitude: '',
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
      eventTypeList: [], // 树的数据
      eventTypeListTreeProps: {
        label: 'name',
        children: 'children',
      },
      dataRule: {
        name: [
          { required: true, message: '装备库名称不能为空', trigger: 'blur' },
          { validator: isExistName, trigger: 'blur' },
        ],
        townId: [
          { required: true, message: '请选择所属区域', trigger: 'blur' },
        ],
        address: [{ required: true, message: '装备仓库所在地不能为空', trigger: 'blur' }],
        caseClassId: [{ required: true, message: '请选择应急类别', trigger: 'blur' }],
        classId: [{ required: true, message: '请选择装备仓库类型', trigger: 'blur' }],
        phone: [{ required: false, validator: this.$regular.mobileOrLandline, trigger: ['change', 'blur'] }],
      },
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
  beforeMount() {
    this.eventScene();
    this.incidentType();
    this.warehouse();
  },
  methods: {
    checkPhone(rule, value, callback) {
      // const reg = /^1[^01]\d{9}$/.test(value) || /^((\(\d{3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}$/;
      // if(value&&reg&&reg.test(value)){
      //   callback()
      // }else{
      //   callback(new Error('请输入正确的电话格式'));
      // }


      // if (value !== '' && !reg?.test(value)) {
      //   callback(new Error('请输入正确的电话格式'));
      // } else {
      //   callback();
      // }

      if (value && !/^1[0-9]{10}$/.test(value)) {
        callback('手机号信息有误');
      } else {
        callback();
      }
    },
    // 行政选择
    eventScene() {
      this.jurisdictionData = [];
      this.$http.get(`${window.SITE_CONFIG.baseUrl}/sys/systown/treeList`)
        .then((response) => {
          if (response.data.code === 0) {
            this.jurisdictionData = response.data.list;
          }
        });
    },
    incidentType() {
      const params = {};
      this.$api.getTree(params).then((res) => {
        if (res.errorcode === 0) {
          this.eventTypeData = res.data;
        }
      });
    },
    // 仓库类别
    warehouse(){
      this.$http({
        url: this.$http.adornUrl('/resoureEquipmentGroupClass/treeList'),
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
    init(obj, type) {
      this.readOnlyFlag = type;
      this.visible = true;
      this.showDeviceData = {
        monitor: [],
        room: [],
        colony: [],
        // wecomm: [],
        app: [],
      };
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields();
      });
      if (type === 3) {
        this.$http({
          url: this.$http.adornUrl(
            `/resoure/resoureequipmentgroup/info/${obj.id}`,
          ),
          method: 'post',
          params: this.$http.adornParams(),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm = data.resoureEquipmentGroup;
            this.dataForm.contactor = data.resoureEquipmentGroup
              && data.resoureEquipmentGroup.mailContactorEntity
              && data.resoureEquipmentGroup.mailContactorEntity.name;
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
          } else {
            this.$message.error(data.msg);
          }
        });
      }
    },
    handleLocationConfirm(...arg) {
      this.dataForm.address = arg[0];
      this.dataForm.longitude = arg[1][0];
      this.dataForm.latitude = arg[1][1];
      // 大地坐标系
      this.dataForm.cgcsLongitude = arg[3][0];
      this.dataForm.cgcsLatitude = arg[3][1];
      // 强制更新，防止深对象v-model不更新
      this.$forceUpdate();
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
    // 触发单选组件
    handleInform() {
      this.showcommonLink = true;
      this.$refs.commonLink.handleAddContacts(
        '/mail/mailgroup/list',
        '请选择',
        this.dataForm.notificationMethod,
      );
    },
    handelLinkdata({ linkman }) {
      this.dataForm.contactorId = linkman[0].id;
      this.dataForm.contactor = linkman[0].name;
      this.$forceUpdate();
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
      this.dataForm.responsibleUnitName = data.name;
    },

    // 表单提交
    dataFormSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid && (this.readOnlyFlag in { 2: '', 3: '' })) {
          const deviceParams = {
            related: [],
          };
          for (const k in this.showDeviceData) {
            this.showDeviceData[k].forEach((item) => {
              const o = {};
              const value = item;
              o.resoureId = value.id;
              o.type = parseInt(value.type, 10) + 9;
              deviceParams.related.push(o);
            });
          }
          const paramsData = {
            name: this.dataForm.name,
            caseClassId: this.dataForm.caseClassId[this.dataForm.caseClassId.length - 1],
            address: this.dataForm.address,
            townId: this.dataForm.townId,
            acreage: this.dataForm.acreage,
            responsibleUnitId: this.dataForm.responsibleUnitId,
            phone: this.dataForm.phone,
            responsibleUnitAddress: this.dataForm.responsibleUnitAddress,
            aroundTraffic: this.dataForm.aroundTraffic,
            contactorId: this.dataForm.contactorId,
            remark: this.dataForm.remark,
            classId: this.dataForm.classId[this.dataForm.classId.length - 1],
            params: deviceParams,
            longitude: this.dataForm.longitude,
            latitude: this.dataForm.latitude,
          };
          if (this.readOnlyFlag === 3) {
            paramsData.id = this.dataForm.id;
          }
          this.$http({
            url: this.readOnlyFlag === 2
              ? `${window.SITE_CONFIG.cloudUrl}/ser/resoure/resoureequipmentgroup/save`
              : `${window.SITE_CONFIG.cloudUrl}/ser/resoure/resoureequipmentgroup/update`,
            method: 'post',
            data: paramsData,
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
      const itemObj = JSON.parse(item);
      const arrType = this.deviceTypeObj[itemObj.type];
      this.showDeviceData[arrType].splice(
        this.showDeviceData[arrType].indexOf(item),
        1,
      );
    },
  },
};
</script>
<style scoped>
.formStyle {
  width: 90%;
}
.mapdialog >>> .el-dialog__body {
  height: 710px;
}
</style>
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
      background: url('../DeviceAdmin/assets/close.svg')no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
    }
  }
}
</style>
