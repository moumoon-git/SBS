<!--
 * @Author: linhuiting
 * @Date: 2020-11-12 15:24:35
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-08-10 11:08:03
 * @Description: 防护目标添加、修改弹窗
 * @FilePath: \SBS\src\views\modules\contingencyManage\protectionTarget\protectionTarget-add-or-edit.vue
-->

<template>
  <sv-dialog
    ref="dialog"
    :title="type=='edit' ? '修改' : type == 'add' ? '新增' : ''"
    :close-on-click-modal="false"
    @cancel="handleCancel"
    @confirm="$refs.submitConfirm.visible = true"
  >
    <div
      v-loading="loading"
      class="aoe"
      :class="{'aoe-fullscreen': isFullscreen}"
      element-loading-spinner="sv-loading"
      :rules="dataRule"
    >
      <!-- A. 左边栏 -->
      <div class="aoe__left">
        <div class="aoe__left__item aoe__left__item-required">
          <div class="aoe__left__item__label">
            名称
          </div>
          <div class="aoe__left__item__content">
            <sv-input-search
              v-model="dataForm.name"
              :suffix="false"
              placeholder="请输入防护目标名称"
              width="100%"
            />
          </div>
        </div>
        <div class="aoe__left__item aoe__left__item-required">
          <div class="aoe__left__item__label">
            防护目标类型
          </div>
          <div class="aoe__left__item__content">
            <!-- <sv-select-group
              v-model="dataForm.classId"
              api="/resoure/resoureProtectTargetclass/tree"
              :name="dataForm.className"
              :params="{
                apiVersion: '0.0.2',
              }"
            /> -->
            <el-input
              v-model="dataForm.className"
              :readonly="true"
              placeholder="请选择防护目标类型"
              @focus="selectExpertGroup()"
            />
            <sv-dialog
              ref="protectDialog"
              title="新增防护目标类型"
              @cancel="$refs.protectDialog.visible = false"
              @confirm="$refs.protectDialog.visible = false"
            >
              <div style="height: 307px;width: 100%;overflow: auto;">
                <el-tree
                  ref="expertTree"
                  :data="protectTreeList"
                  :props="treeProp"
                  node-key="id"
                  :filter-node-method="filterNode"
                  :highlight-current="true"
                  @current-change="treeChangeHandle"
                />
              </div>
            </sv-dialog>
          </div>
        </div>
        <div class="aoe__left__item aoe__left__item-required">
          <div class="aoe__left__item__label">
            防护目标分组
          </div>
          <div class="aoe__left__item__content">
            <sv-select-group
              v-model="dataForm.protectType"
              api="/resoure/resoureProtectGroup/listTree"
              :name="dataForm.protectTypeParentName"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            地址
          </div>
          <div class="aoe__left__item__content">
            <sv-input-search
              v-model="dataForm.location"
              :suffix="false"
              placeholder="请从右侧地图确认位置"
              width="100%"
              :disabled="true"
              :clearable="false"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            所属区域
          </div>
          <div class="aoe__left__item__content">
            <!-- <sv-select-group
              v-model="dataForm.area"
              api="/resoure/resourareatype/list"
              :name="dataForm.areaName"
            /> -->
            <el-cascader
              v-model="dataForm.area"
              style="width: 100%"
              :options="areaOptions"
              :props="propsArea"
              clearable
              :show-all-levels="false"
              placeholder="请选择所属区域"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            等级
          </div>
          <div class="aoe__left__item__content">
            <sv-select
              v-model="dataForm.level"
              width="100%"
              :options="levelOptions"
              placeholder="请选择等级"
              align="left"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            面积(㎡)
          </div>
          <div class="aoe__left__item__content">
            <el-input-number
              v-model="dataForm.areaSize"
              style="width:100%;"
              :min="0"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            当前人数
          </div>
          <div class="aoe__left__item__content">
            <el-input-number
              v-model="dataForm.nowNumber"
              :min="0"
              style="width:100%;"
              :disabled="type == 'watch'"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            可容纳人数
          </div>
          <div class="aoe__left__item__content">
            <el-input-number
              v-model="dataForm.canuseNumber"
              :min="0"
              style="width:100%;"
              :disabled="type == 'watch'"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            防护等级
          </div>
          <div class="aoe__left__item__content">
            <sv-select
              v-model="dataForm.protectLevel"
              width="100%"
              :options="natureOptions"
              placeholder="请选择等级"
              align="left"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            成立时间
          </div>
          <div class="aoe__left__item__content">
            <el-date-picker
              v-model="dataForm.useTime"
              unlink-panels
              :editable="false"
              style="width:100%;"
              value-format="yyyy-MM-dd"
              placeholder="请选择使用日期时间"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            主体单位
          </div>
          <div class="aoe__left__item__content">
            <sv-input-search
              v-model="dataForm.chargeUnit"
              :suffix="false"
              placeholder="请输入主体单位"
              width="100%"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            防护措施
          </div>
          <div
            class="aoe__left__item__content"
            style="font-size:0"
          >
            <sv-textarea
              v-model="dataForm.conservatoryMeasure"
              :rows="2"
              placeholder="请输入防护措施"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            应急通讯方式
          </div>
          <div
            class="aoe__left__item__content"
            style="font-size:0"
          >
            <sv-textarea
              v-model="dataForm.communicationMode"
              :rows="1"
              placeholder="请输入应急通讯方式"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            备注
          </div>
          <div
            class="aoe__left__item__content"
            style="font-size:0"
          >
            <sv-textarea
              v-model="dataForm.remark"
              :rows="2"
              placeholder="请输入备注"
            />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            联系人
          </div>
          <div class="aoe__left__item__content">
            <sv-select-contact
              v-model="contactId"
              :detail="
                dataForm.contactsList && dataForm.contactsList[0]
                  ? dataForm.contactsList[0]
                  : {}
              "
              title="联系人"
              :api="['/mail/mailgroup/list','/mail/mailcontactor/list']"
              @update="updateContact"
            />
            <!-- 添加联系人 -->
            <add-contact ref="AddContactView" />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            负责人
          </div>
          <div class="aoe__left__item__content">
            <sv-select-contact
              v-model="responsibles"
              :detail="
                dataForm.responsiblesList && dataForm.responsiblesList[0]
                  ? dataForm.responsiblesList[0]
                  : {}
              "
              title="负责人"
              :api="['/mail/mailgroup/list','/mail/mailcontactor/list']"
              @update="updatePrincipal"
            />
            <add-contact ref="AddContactView" />
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            附件
          </div>
          <div class="aoe__left__item__content">
            <el-upload
              ref="upload"
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :limit="1"
              :on-exceed="handleExceed"
              :before-upload="beforeAvatarUpload"
              :file-list="fileList"
            >
              <el-button size="small">
                点击上传
              </el-button>
            </el-upload>
          </div>
        </div>
        <div class="aoe__left__item">
          <div class="aoe__left__item__label">
            关联设备
          </div>
          <div class="aoe__left__item__content">
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
          </div>
        </div>
        <div>
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
        </div>
      </div>

      <!-- B. 右边栏 -->
      <div class="aoe__right">
        <div class="aoe__right__title">
          防护目标地址
        </div>
        <div
          class="aoe__right__fullscreen"
          @click="isFullscreen = !isFullscreen"
        />
        <Location
          :address="dataForm.location"
          :lng-lat="[dataForm.longitude, dataForm.latitude]"
          :cgcsLngLatInit="[dataForm.cgcsLongitude, dataForm.cgcsLatitude]"
          @confirm="handleLocationConfirm"
        />
      </div>
    </div>

    <sv-dialog-hint
      ref="submitConfirm"
      type="submit"
      @confirm="handleSubmit"
    />
    <sv-dialog-hint
      ref="submitFail"
      type="fail"
    />
    <deviceDialog
      ref="deviceDialogEl"
      :dialog-title="deviceTitle"
      @selectedList="getDeviceData"
    />
  </sv-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils';
import bus from '@/views/common/js/eventBus';
import Location from '@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/Location/Location.vue';
import AddContact from './addContact/AddContact';
import deviceDialog from '../../sys/resource/deviceDialog';

export default {
  name: 'AddOrEditDialog',
  components: {
    AddContact,
    Location,
    deviceDialog,
  },
  data() {
    return {
      // 联系人 ID
      contactId: 0,
      // 负责人 ID
      responsibles: 0,
      filterText: '', // 选择防护树的值
      protectTreeList: [], // 防护树
      treeProp: {
        label: 'name',
        children: 'children',
      },
      natureOptions: [
        {
          value: '1',
          label: '特别重要防护',
        },
        {
          value: '2',
          label: '重要防护',
        },
        {
          value: '3',
          label: '较高防护',
        },
        {
          value: '4',
          label: '一般防护',
        },
      ],
      levelOptions: [
        {
          value: '1',
          label: '国家级',
        },
        {
          value: '2',
          label: '省级',
        },
        {
          value: '3',
          label: '市级',
        },
        {
          value: '4',
          label: '县级',
        },
        {
          value: '5',
          label: '乡镇级',
        },
        {
          value: '6',
          label: '其他',
        },
      ],
      teamTypeVisible: false,
      riskReasonVisible: false,
      areaVisible: false,
      teamTypeList: [],
      riskReasonList: [],
      areaList: [],
      eventTypeListTreeProps: {
        label: 'name',
        children: 'children',
      },
      // 弹窗类型: add or edit
      type: 'add',
      backgroundURL: window.SITE_CONFIG.cloudUrl,
      // 数据提交中
      loading: false,
      // 左边栏数据
      dataForm_empty: {
        id: 0,
        name: '',
        classId: '',// 防护目标类型id
        className: '',
        protectType: '', // 防护目标分组id
        protectTypeName: '',
        protectTypeParentName: '',
        groupId: '',
        location: '',
        longitude: '',
        latitude: '',
        level: '',
        protectLevel: '',
        area: '',
        areaName: '',
        areaSize: '',
        riskReason: '',
        riskReasonParentName: '',
        chargeUnit: '',
        nowNumber: '',
        useTime: '',
        canuseNumber: '',
        layout: '',
        monitorWay: '',
        dataSourceUnit: '',
        defenseArea: '',
        trafficConditions: '',
        generalSituation: '',
        conservatoryMeasure: '',
        communicationMode: '',
        remark: '',
        contacts: [],
        contactsId: [],
        contactsList: [], // 联系人
        responsibles: [],
        responsiblesList: [], // 负责人
        chargeId: [],
        documentList: [],
        cgcsLatitude: '',
        cgcsLongitude: '',
      },
      fileList: [],
      dataForm: {},
      dataForm_add: {},
      isFullscreen: false, // 地图是否全屏

      dataRule: {
        areaSize: [
          // { required: true, message: "面积不能为空", trigger: "blur" },
          {
            type: 'number',
            message: '面积类型必须为整数',
            trigger: 'blur',
            transform(value) {
              return Number(value);
            },
          },
        ],
        canuseNumber: [
          {
            type: 'number',
            message: '可容纳人数类型必须为整数',
            trigger: 'blur',
            transform(value) {
              return Number(value);
            },
          },
        ],
        nowNumber: [
          {
            type: 'number',
            message: '当前人数类型必须为整数',
            trigger: 'blur',
            transform(value) {
              return Number(value);
            },
          },
        ],
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
      propsArea: {
        value: 'id',
        label: 'townName',
        children: 'children',
        checkStrictly: true,
        emitPath: false,
      },
      areaOptions: [], // 地区选择数据
      // details: {
      //   id: '',
      //   name: '',
      //   mobile1: '',
      //   phone: '',
      // },
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
  mounted() {
    this.dataForm_add = { ...this.dataForm_empty };
    this.dataForm = { ...this.dataForm_empty };
    // 获取已选联系人
    bus.$off('getCheckContact');
    bus.$on('getCheckContact', (val) => {
      // console.log(val)
      this.dataForm.contacts = val;
    });
  },

  created() {

  },

  methods: {
    /**
     * @description: 选择树弹窗
     */
    selectExpertGroup() {
      this.$refs.protectDialog.visible = true;
      this.$http({
        url: this.$http.adornUrl('/resoure/resoureProtectTargetclass/tree'),
        method: 'get',
        params: {
          apiVersion: '0.0.2',
        },
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.protectTreeList = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description: 获取到点击的树节点信息
     * @param {Obj} data 选中的数据节点信息
     */
    treeChangeHandle(data) {
      this.dataForm.classId = data.id;
      this.dataForm.className = data.name;
    },
    /**
     * @description: 树的模糊搜索过滤
     * @param {String} value 输入的值
     * @param {Obj} data 树形结构
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    /**
     * @description: 初始化数据，打开弹窗
     * @desc 初始化数据，打开弹窗
     * @param {String} type 弹窗类型，add新增、edit编辑
     * @param {Object} data 编辑的数据
     */
    init(type, id) {
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
      if (type === 'add') {
        // this.dataForm = {...this.dataForm_add}
        // this.dataForm = {...this.dataForm_empty}
        // this.fileList = []
        // 显示弹窗
        this.$refs.dialog.visible = true;
      } else if (type === 'edit') {
        this.dataForm = { ...this.dataForm_empty };
        // this.dataForm.documentList = []
        this.fileList = [];

        console.log('this.fileList', this.fileList);
        // 获取数据详情
        const request = {
          method: 'get',
          url: '/resoure/resoureProtectTarget/info',
          baseURL: window.SITE_CONFIG.baseUrl,
          params: {
            id,
            token: this.$cookie.get('token'),
          },
        };
        this.$http(request)
          .then((response) => {
            console.log('/resoure/resoureProtectTarget/info', response);
            if (response.data.code == 0) {
              // Object.assign(this.dataForm, response.data.data)
              this.dataForm = response.data.ResoureProtectTargetEntity;
              // 所属区域转为int类型，否则修改时不显示
              this.dataForm.area = parseInt(response.data.ResoureProtectTargetEntity.area, 10);
              this.contactId = this.dataForm.contactsList && this.dataForm.contactsList[0]
                ? this.dataForm.contactsList[0].id
                : 0;
              this.responsibles = this.dataForm.responsiblesList && this.dataForm.responsiblesList[0]
                ? this.dataForm.responsiblesList[0].id
                : 0;
              // console.log("this.dataForm.name", this.dataForm.name)
              this.fileList = this.dataForm.documentList;
              console.log('this.dataForm', this.dataForm);
              console.log('this.fileList', this.fileList);
              response.data.resources.forEach((item) => {
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
              // 显示弹窗
              this.$refs.dialog.visible = true;
            } else {
              console.log('获取id =', id, '的详情失败！错误信息：【\n', response, '\n】');
            }
          })
          .catch((error) => {
            console.log('获取id =', id, '的详情失败！错误信息：【\n', error, '\n】');
          });
      }
    },
    /**
     * 更新联系人
     * @param {Object} contact 联系人对象
     */
    updateContact(id, contact) {
      this.dataForm.contactsList = [contact];
    },
    updatePrincipal(id, contact) {
      this.dataForm.responsiblesList = [contact];
    },
    /**
     * @method
     * @desc 地图定位确定位置，获取地址和坐标
     */
    handleLocationConfirm(...arg) {
      this.isFullscreen = false;
      this.dataForm.location = arg[0];
      this.dataForm.longitude = arg[1][0];
      this.dataForm.latitude = arg[1][1];
      // 大地坐标系
      this.dataForm.cgcsLongitude = arg[3][0];
      this.dataForm.cgcsLatitude = arg[3][1];

      // 强制更新，防止深对象v-model不更新
      this.$forceUpdate();
    },
    /**
     * @description: 添加联系人视图
     * @param {*}
     * @return {*}
     */
    addContactHandle() {
      this.$refs.AddContactView.getDataList(this.dataForm.contacts);
      this.$refs.AddContactView.getDataList(this.dataForm.responsibles);
    },
    /**
     * @description: 删除联系人
     * @param {Number} id 删除的联系人id
     * @return {*}
     */
    delIt(id) {
      this.dataForm.contacts = this.dataForm.contacts.filter(
        (v) => v.id !== id,
      );
      this.dataForm.responsibles = this.dataForm.responsibles.filter(
        (v) => v.id !== id,
      );
    },
    /**
     * @method
     * @desc 关闭弹窗
     */
    handleCancel() {
      this.$refs.dialog.visible = false;
      this.isFullscreen = false;
      // 保存新增页面的编辑内容，清除编辑页面的内容
      this.type === 'add' ? this.dataForm_add = { ...this.dataForm } : this.dataForm = { ...this.dataForm_empty };
    },
    /**
     * @description: 文件列表移除文件时的钩子
     * @param {File} file 文件对象
     * @param {Array} fileList 文件数组
     * @return {*}
     */
    handleRemove(file, fileList) {
      console.log('删除过程this.fileList', this.fileList);
      this.fileList = [];
      console.log('删除上传handleRemove file, fileList', file, fileList);
      fileList.forEach((item) => {
        if (item.response) {
          this.fileList.push(item.response.data);
        } else {
          this.fileList.push(item);
        }
      });

      console.log('file, fileList', file, this.fileList);
    },
    /**
     * @description: 判断是图片还是文档
     * @param {String} url 文件的地址
     * @return {Boolean} 图片返回true，文档返回flase
     */
    isImg(url) {
      const res = url.slice(-4);
      if (res == '.png' || res == '.jpg' || res == 'jpeg' || res == '.gif' || res == '.bmp') {
        return true;
      }
      return false;
    },
    /**
     * @description: 点击文件列表中已上传的文件时的钩子
     * @param {File} file 文件对象
     * @return {*}
     */
    handlePreview(file) {
      console.log('上传预览handlePreview file', file);
      const httpaddress = window.SITE_CONFIG.cloudUrl;
      const fileName = this.dataForm.documentList.map((item) => item.name);
      const fileUrl = this.dataForm.documentList.map((item) => item.url);
      if (navigator.msSaveOrOpenBlob) {
        // 兼容ie
        window.open(
          `${httpaddress}/${fileUrl}?attname=${
            fileName
          }&token=${this.$cookie.get('token')}`,
        );
      } else {
        const a = document.createElement('a');
        a.href = `${httpaddress}/${fileUrl}?attname=${
          fileName
        }&token=${this.$cookie.get('token')}`;
        a.download = fileName;
        document.body.appendChild(a); // 兼容Firefox浏览器
        a.click();
        a.remove();
      }
    },
    /**
     * @description: 上传文件之前的钩子
     * @param {File} files 上传的文件
     * @return {*}
     */
    beforeAvatarUpload(files) {
      console.log('files: ', files);
      const form = new FormData();
      form.append('file', files);
      // form.append('token',this.$cookie.get('token'))
      console.log('form', form);
      this.$http({
        baseURL: window.SITE_CONFIG.fileupload,
        url: '/scgMailContactor/uploadImg',
        method: 'post',
        data: form,
      })
        .then(({ data }) => {
          const result = {
            name: data.data.url.split('/').pop(),
            url: data.data.url,
          };
          this.fileList.push(result);
        })
        .then(() => {
          this.visible = true;
        })
        .then(() => {
          // 新增
          // this.dataForm.name=''
          this.dataForm.gmtCreate = '';
          // this.areaListTreeSetCurrentNode();
        });
    },
    /**
     * @description: 文件超出个数限制时的钩子
     * @param {Array} files 当前选的文件数组
     * @param {Array} fileList 已选中的文件数组
     * @return {*}
     */
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`,
      );
    },
    /**
     * @description: 删除文件之前的钩子
     * @param {File} file 上传的文件
     * @param {Array} fileList 文件列表
     * @return {*}
     */
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    /**
     * @method
     * @desc 确认提交
     */
    handleSubmit() {
      console.log(this.dataForm.responsiblesList);
      // console.log('this.dataForm.contactsList的name', this.dataForm.contactsList.length > 0 ? this.dataForm.contactsList.map((item) => item.name).join(',') : '');
      this.dataForm.contacts = []; // 声明为数组，否则push报错
      this.dataForm.responsibles = []; // 声明为数组，否则push报错
      if (this.dataForm.contactsList && this.dataForm.contactsList[0]) {
        this.dataForm.contactsList.map((item) => {
          this.dataForm.contacts.push(item.id);
          return this.dataForm.contacts;
        }).join(',');
      } else {
        this.dataForm.contacts = [];
      }
      if (this.dataForm.responsiblesList && this.dataForm.responsiblesList[0]) {
        this.dataForm.responsiblesList.map((item) => {
          this.dataForm.responsibles.push(item.id);
          return this.dataForm.responsibles;
        }).join(',');
      } else {
        this.dataForm.responsibles = [];
      }
      this.dataForm.documentList = this.fileList;
      console.log('this.dataForm.documentList, this.fileList', this.dataForm.documentList, this.fileList);

      // 表单必填项验证
      if (!this.submitValidate()) {
        return;
        this.loading = false;
        setTimeout(() => {
          this.loading = true;
        }, 0);
      }
      // this.loading = false
      this.dataForm_add = { ...this.dataForm };
      // 新增
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
      if (this.type === 'add') {
        const request = {
          method: 'post',
          url: '/resoure/resoureProtectTarget/save',
          baseURL: window.SITE_CONFIG.baseUrl,
          data: {
            ...this.dataForm,
            params,
          },
        };
        this.$http(request)
          .then((response) => {
            if (response.data.code == 0) {
              console.log('新增', this.dataForm);
              this.$emit('refresh');
              // 提交成功后，清空数据
              this.$refs.dialog.visible = false;
              this.dataForm = { ...this.dataForm_empty };
              this.dataForm_add = { ...this.dataForm_empty };
              this.isFullscreen = false;
            } else {
              console.log('新增失败！错误信息：【\n', response, '\n】');
              this.$refs.submitFail.visible = true;
              this.$refs.submitFail.supplementText = `错误代码：${response.data.code}`;
            }
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
            console.log('新增失败！错误信息：【\n', error, '\n】');
            this.$refs.submitFail.visible = true;
            this.$refs.submitFail.supplementText = error;
          });
      }
      // 修改
      else if (this.type === 'edit') {
        console.log('this.dataForm.contacts', this.dataForm.contacts.length > 0);
        const request = {
          method: 'post',
          url: '/resoure/resoureProtectTarget/update',
          baseURL: window.SITE_CONFIG.baseUrl,
          data: {
            ...this.dataForm,
            params,
          },

        };
        console.log('文件', this.dataForm.documentList);
        this.$http(request)
          .then((response) => {
            if (response.data.code == 0) {
              this.$emit('refresh');
              // 提交成功后，清空数据
              this.$refs.dialog.visible = false;
              this.dataForm = { ...this.dataForm_empty };
              this.isFullscreen = false;
            } else {
              console.log('更新失败！错误信息：【\n', response, '\n】');
              this.$refs.submitFail.visible = true;
              this.$refs.submitFail.supplementText = `错误代码：${response.data.code}`;
            }
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
            console.log('更新失败！错误信息：【\n', error, '\n】');
            this.$refs.submitFail.visible = true;
            this.$refs.submitFail.supplementText = error;
          });
      }
    },
    /**
     * @method
     * @desc 提交数据验证
     * @return {Boolean} 提交数据是否通过验证
     */
    submitValidate() {
      const form = this.dataForm;
      if (
        form.name == ''
        || form.protectType == ''
        || form.classId == ''
      ) {
        this.$refs.submitFail.visible = true;
        this.$refs.submitFail.supplementText = '带星号必填项不能为空！';
        return false;
      }
      return true;
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
      const index = this.showDeviceData[arrType].findIndex((it) => it.id === item.id);
      this.showDeviceData[arrType].splice(
        index,
        1,
      );
    },
  },
};
</script>

<style lang="scss" src="@/views/modules/GarbageClassification/SiteManagement/ClassificationSite/AddOrEditDialog/AddOrEditDialog.scss" lang="scss">
</style>
<style lang="scss" module>
.backDiv {
  margin-left: 20px;
  background: #f2f2f2;
  border-radius: 4px;
  overflow: hidden;
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
<style lang="scss" scoped>
.aoe__left {
  height: 800px;
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
  /deep/ .el-cascader {
    .el-input__inner {
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
