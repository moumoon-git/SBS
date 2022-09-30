<template>
  <div>
    <el-dialog
      :title="dataForm.unitName"
      center
      class="sbs-dialog"
      width="48%"
      :visible.sync="visible"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane
          label="单位信息"
          name="first"
          style="padding: 0 30px;"
        >
          <el-form
            ref="dataForm"
            label-width="90px"
            :model="dataForm"
            :rules="rules"
          >
            <el-form-item label="上级单位">
              <el-dialog
                title="请选择要新增到的分组节点"
                center
                class="sbs-dialog"
                width="30%"
                :visible.sync="topUnitVisible"
                :close-on-click-modal="false"
                append-to-body
              >
                <div class="overFlow">
                  <el-tree
                    ref="topUnitRef"
                    :data="topUnitTree"
                    :props="{
                      label: 'name',
                      children: 'children',
                    }"
                    node-key="id"
                    default-expand-all
                    :highlight-current="true"
                    :expand-on-click-node="false"
                    @current-change="topUnitChange"
                  />
                </div>
                <span slot="footer">
                  <el-button
                    type="primary"
                    class="sbs-button"
                    @click="topUnitVisible = false"
                  >
                    确定
                  </el-button>
                </span>
              </el-dialog>
              <el-input
                v-model="dataForm.topUnit"
                v-popover:eventTypeListPopover
                :disabled="isDisabled"
                placeholder="请选择上级单位"
                :readonly="true"
                @focus="topUnitInit"
              />
            </el-form-item>
            <el-form-item
              label="单位名称"
              prop="unitName"
            >
              <el-input
                v-model.trim="dataForm.unitName"
                :disabled="isDisabled"
              />
            </el-form-item>
            <el-form-item label="单位地址">
              <el-input
                v-model="dataForm.unitAddress"
                :disabled="isDisabled"
              />
            </el-form-item>
            <el-form-item
              label="办公电话"
              prop="workPhone"
            >
              <el-input
                v-model="dataForm.workPhone"
                :disabled="isDisabled"
              />
            </el-form-item>
            <el-form-item
              label="传真号码"
              prop="fax"
            >
              <el-input
                v-model="dataForm.fax"
                :disabled="isDisabled"
              />
            </el-form-item>
            <el-form-item
              label="联系电话"
              prop="contactPhone"
            >
              <el-input
                v-model="dataForm.contactPhone"
                :disabled="isDisabled"
              />
            </el-form-item>
            <el-form-item
              label="电子邮箱"
              prop="mail"
            >
              <el-input
                v-model="dataForm.mail"
                :disabled="isDisabled"
              />
            </el-form-item>
            <el-form-item label="单位负责人">
              <el-input
                v-model="dataForm.dutyPeople"
                :disabled="isDisabled"
              />
            </el-form-item>
            <el-form-item label="关联设备">
              <el-dropdown
                trigger="click"
                placement="bottom-start"
                @command="handleCommand"
              >
                <el-button plain>
                  增加
                </el-button>
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
            <el-row>
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
                    <div
                      :class="[
                        {
                          [$style.deviceName]: ['0', '1', '9', '10'].includes(
                            String(item1.type),
                          ),
                        },
                        {
                          [$style.deviceName_default]: [
                            '2',
                            '3',
                            '11',
                            '12',
                          ].includes(String(item1.type)),
                        },
                      ]"
                    >
                      <span :title="item1.name">{{ item1.name }}</span>
                    </div>
                    <div
                      v-if="
                        ['2', '3', '11', '12'].includes(String(item1.type)) &&
                          type === 1
                      "
                      :class="[
                        { [$style.position]: item1.isDefault === 1 },
                        { [$style.related_btn]: item1.isDefault === 0 },
                      ]"
                      @click="relatedLocation(item1)"
                    >
                      <!-- <span>{{
                          item1.isDefault === 1 ? '已关联' : '关联定位'
                        }}</span> -->
                    </div>
                    <div
                      v-if="
                        ['2', '3', '11', '12'].includes(String(item1.type)) &&
                          type === 0
                      "
                      :class="[{ [$style.position]: item1.isDefault === 1 }]"
                    >
                      <!-- <span>{{ item1.isDefault === 1 ? '已关联' : '' }}</span> -->
                    </div>
                    <div
                      :class="$style.showDelete"
                      @click.stop="deleteDevice(item1)"
                    />
                  </div>
                </div>
              </div>
            </el-row>
          </el-form>
        </el-tab-pane>

        <el-tab-pane
          v-if="!isDisabled && dataForm.id"
          label="应急岗位"
          name="second"
        >
          <el-tabs
            v-model="activeInnerName"
            type="card"
          >
            <el-tab-pane
              label="应急负责人"
              name="first"
            >
              <div class="flex">
                <div class="frame">
                  <div class="headLine">
                    分管类型
                  </div>
                  <div class="notHeadLine">
                    <el-input
                      v-model.trim="input1"
                      placeholder="添加分管类型"
                    />
                    <el-button
                      type="primary"
                      class="sbs-button"
                      @click="addLeft(input1, 467)"
                    >
                      添加
                    </el-button>
                  </div>
                  <div
                    class="overFlow"
                    style="height: 38vh;"
                  >
                    <div
                      v-for="item in left1"
                      :key="item.id"
                      :class="currleft1 === item ? 'listItemChoosed' : 'listItem'"
                      @click.stop="clickLeft(item, 467)"
                    >
                      {{ item.name }}
                      <img
                        src="/static/img/reversePlan/close.svg"
                        class="deleteImg"
                        @click="deleteLeft(item)"
                      >
                    </div>
                  </div>
                </div>
                <div class="frame">
                  <div class="headLine">
                    事件类型
                  </div>
                  <div class="overFlow">
                    <el-tree
                      ref="middleTreeOne"
                      class="middleTree"
                      node-key="id"
                      :data="middle1"
                      :props="{
                        label: 'name',
                        children: 'children',
                      }"
                      :show-checkbox="true"
                      default-expand-all
                      @check-change="middleClick1"
                    />
                  </div>
                </div>
                <div class="frame">
                  <div class="headLine">
                    分管人员
                    <el-button
                      type="text"
                      class="sbs-button"
                      style="height: 14px !important;"
                      @click="addRight(0)"
                    >
                      添加
                    </el-button>
                  </div>
                  <div class="overFlow">
                    <div
                      v-for="item in right1"
                      :key="item.id"
                      class="listItem"
                    >
                      {{ item.name }}（{{ item.workUnit }}/{{ item.position }}）
                      <img
                        src="/static/img/reversePlan/close.svg"
                        class="deleteImg"
                        @click="right1 = right1.filter((el) => el.id !== item.id)"
                      >
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane
              label="应急联络人"
              name="second"
            >
              <div class="flex">
                <div class="frame">
                  <div class="headLine">
                    分管类型
                  </div>
                  <div class="notHeadLine">
                    <el-input
                      v-model.trim="input2"
                      placeholder="添加分管类型"
                    />
                    <el-button
                      type="primary"
                      class="sbs-button"
                      @click="addLeft(input2, 468)"
                    >
                      添加
                    </el-button>
                  </div>
                  <div
                    class="overFlow"
                    style="height: 38vh;"
                  >
                    <div
                      v-for="item in left2"
                      :key="item.id"
                      :class="currleft2 === item ? 'listItemChoosed' : 'listItem'"
                      @click.stop="clickLeft(item, 468)"
                    >
                      {{ item.name }}
                      <img
                        src="/static/img/reversePlan/close.svg"
                        class="deleteImg"
                        @click="deleteLeft(item)"
                      >
                    </div>
                  </div>
                </div>
                <div class="frame">
                  <div class="headLine">
                    事件类型
                  </div>
                  <div class="overFlow">
                    <el-tree
                      ref="middleTreeTwo"
                      class="middleTree"
                      node-key="id"
                      :props="{
                        label: 'name',
                        children: 'children',
                      }"
                      :data="middle2"
                      :show-checkbox="true"
                      default-expand-all
                      @check-change="middleClick2"
                    />
                  </div>
                </div>
                <div class="frame">
                  <div class="headLine">
                    分管人员
                    <el-button
                      type="text"
                      class="sbs-button"
                      style="height: 14px !important;"
                      @click="addRight(1)"
                    >
                      添加
                    </el-button>
                  </div>
                  <div class="overFlow">
                    <div
                      v-for="item in right2"
                      :key="item.id"
                      class="listItem"
                    >
                      {{ item.name }}（{{ item.workUnit }}/{{ item.position }}）
                      <img
                        src="/static/img/reversePlan/close.svg"
                        class="deleteImg"
                        @click="right2 = right2.filter((el) => el.id !== item.id)"
                      >
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
      <div class="bottom">
        <el-button
          type="plain"
          class="sbs-button"
          @click="visible = false"
        >
          取消
        </el-button>
        <el-button
          v-if="activeName === 'first' && !isDisabled"
          type="primary"
          class="sbs-button"
          @click="save1"
        >
          确定
        </el-button>
        <el-button
          v-if="activeName === 'second'"
          type="primary"
          class="sbs-button"
          @click="save2"
        >
          确定
        </el-button>
      </div>
    </el-dialog>
    <!-- 分管人员 弹窗 -->
    <MailListTreeAddManager
      ref="MailListTreeAddManager"
      @submit="submit"
    />

    <deviceDialog
      ref="deviceDialogEl"
      :dialog-title="deviceTitle"
      :selected-one="true"
      @selectedList="getDeviceData"
    />
  </div>
</template>

<script>
import MailListTreeAddManager from './mailList-tree-add-manager.vue';
import deviceDialog from '../resource/deviceDialog.vue';

export default {
  components: {
    MailListTreeAddManager,
    deviceDialog,
  },
  data() {
    return {
      // 整个窗-----------
      visible: false, // 这个弹窗是否显示
      activeName: 'first', // 切换单位信息应急岗位
      activeInnerName: 'first', // 切换应急两人
      // 单位信息-----------
      dataForm: {
        id: 0, // 自己的id
        parentId: 0, // 上级单位id
        topUnit: '顶级分组节点', // 上级单位名字
        unitName: '', // 单位名称
        unitAddress: '', // 单位地址
        workPhone: '', // 办公电话
        fax: '', // 传真号码
        contactPhone: '', // 联系电话
        mail: '', // 电子邮箱
        dutyPeople: '', // 单位负责人
        resourceRelatedFormList: [], // 关联设备
      },
      // 单位信息判断
      rules: {
        unitName: [
          { required: true, message: '不能为空', trigger: 'blur' },
        ],
        workPhone: [{
          required: false,
          validator: this.$regular.mobileOrLandline,
          trigger: 'blur',
        }],
        fax: [{
          required: false,
          validator: this.$regular.fixedTelephone,
          trigger: 'blur',
        }],
        contactPhone: [{
          required: false,
          validator: this.$regular.mobileOrLandline,
          trigger: 'blur',
        }],
        mail: [{
          required: false,
          validator: this.$regular.emailCheck,
          trigger: 'blur',
        }],
      },
      isDisabled: false, // 单位信息能否修改
      // 左-----------
      left1: [], // 负责人左边列表
      left2: [], // 联络人左边列表
      currleft1: '', // 点击左负责人
      currleft2: '', // 点击左联络人
      input1: '', // 新增负责分管类型输入框
      input2: '', // 新增联络分管类型输入框
      // 中-----------
      middle1: [], // 负责人-中间树
      middle2: [], // 联络人-中间树
      middleCheckList1: [], // 负责人-中间树-勾选
      middleCheckList2: [], // 联络人-中间树-勾选
      tempAllTreeId: [], // 所有树节点id拿出来
      // 右-----------
      right1: [], // 负责人右边列表
      right2: [], // 联络人右边列表
      // 添加分管人员-----------
      isManageOrContact: 0, // 添加分管人员-弹窗-添加负责还是联络

      // 添加上级单位-----------
      topUnitVisible: false, // 上级分组选择窗
      topUnitTree: [], // 上级单位树的数据
      // 关联设备-----------
      deviceTypeObj: {
        1: 'room',
      },
      deviceObj: {
        1: '会场终端',
      },
      deviceTitle: '',
      deviceTextArr: [
        'room',
      ],
      showDeviceData: {
        room: [],
      },
    };
  },
  methods: {
    clearAll() {
      this.dataForm.parentId = 0;
      this.dataForm.topUnit = '顶级分组节点';
      this.dataForm.unitName = '';
      this.dataForm.unitAddress = '';
      this.dataForm.workPhone = '';
      this.dataForm.fax = '';
      this.dataForm.contactPhone = '';
      this.dataForm.mail = '';
      this.dataForm.dutyPeople = '';
      this.dataForm.resourceRelatedFormList = [];
      this.activeName = 'first';
      this.activeInnerName = 'first';
      this.left1 = [];
      this.left2 = [];
      this.currleft1 = '';
      this.currleft2 = '';
      this.input1 = '';
      this.input2 = '';
      this.middle1 = [];
      this.middle2 = [];
      this.middleCheckList1 = [];
      this.middleCheckList2 = [];
      this.tempAllTreeId = [];
      this.right1 = [];
      this.right2 = [];
      this.isManageOrContact = 0;
      this.topUnitVisible = false;
      this.topUnitTree = [];
      this.showDeviceData = {
        room: [],
      };
      this.$http({
        method: 'post',
        url: '/eos/caseClass/getTree',
        baseURL: window.g.ApiUrl,
      }).then((r) => {
        if (r.data.data) {
          this.middle1 = r.data.data;
          this.middle2 = r.data.data;
          if (this.dataForm.id && !this.isDisabled) {
            this.$nextTick(() => {
              this.$refs.middleTreeOne.setCheckedKeys([]);
              this.$refs.middleTreeTwo.setCheckedKeys([]);
              this.$refs.dataForm.resetFields();
            });
          }
        }
      });
    },
    // 初始化，新增就从外面传个0进来，否则传组id
    init(id) {
      this.visible = true;
      this.clearAll();
      this.dataForm.id = id;
      if (id) {
        this.$http({
          method: 'post',
          url: `${window.SITE_CONFIG.baseUrl}/mail/mailgroup/getGroupManageEvent`,
          data: {
            Ids: [id],
          },
        }).then((res) => {
          if (res.data.data) {
            this.dataForm.id = res.data.data[0].id;
            this.dataForm.parentId = res.data.data[0].parentId;
            this.dataForm.topUnit = res.data.data[0].ancestors || '顶级分组节点';
            this.dataForm.unitName = res.data.data[0].name;
            this.dataForm.unitAddress = res.data.data[0].address;
            this.dataForm.workPhone = res.data.data[0].officePhone;
            this.dataForm.fax = res.data.data[0].fax;
            this.dataForm.contactPhone = res.data.data[0].responsiblePhone;
            this.dataForm.mail = res.data.data[0].email;
            this.dataForm.dutyPeople = res.data.data[0].responsible;
            this.left1 = res.data.data[0].groupResponsibleTypeList || [];
            this.left2 = res.data.data[0].groupContactorTypeList || [];
            if (!this.left1.length) {
              this.left1.push({ name: '默认类型', eventTypeIdList: [] });
            }
            if (this.dataForm.id && !this.isDisabled) this.clickLeft(this.left1[0], 467);
            if (!this.left2.length) {
              this.left2.push({ name: '默认类型', eventTypeIdList: [] });
            }
            if (this.dataForm.id && !this.isDisabled) this.clickLeft(this.left2[0], 468);
            this.dataForm.resourceRelatedFormList = [];
            if (res.data.data[0].resourceData) {
              res.data.data[0].resourceData.resources.forEach((item) => {
                const typeChange = parseInt(item.type, 10) - 9;
                const arrType = this.deviceTypeObj[typeChange];
                item.data.forEach((item1) => {
                  const o = {};
                  o.id = item1.entity.id;
                  o.name = item1.entity.name;
                  o.isDefault = item1.isDefault;
                  o.type = typeChange;
                  o.subscription = item1.entity.subscription;
                  this.showDeviceData[arrType].push(o);
                });
              });
            }
          }
        });
      }
      if (!this.left1.length) {
        this.left1.push({ name: '默认类型', eventTypeIdList: [] });
      }
      if (this.dataForm.id && !this.isDisabled) this.clickLeft(this.left1[0], 467);
      if (!this.left2.length) {
        this.left2.push({ name: '默认类型', eventTypeIdList: [] });
      }
      if (this.dataForm.id && !this.isDisabled) this.clickLeft(this.left2[0], 468);
    },
    addLeft(name, emergencyStation) {
      if (!name) {
        this.$message({
          message: '请输入分管类型名字',
          type: 'error',
        });
        return;
      }
      this.$http({
        method: 'post',
        url: `${window.SITE_CONFIG.baseUrl}/mail/mailGroupManageType/add`,
        data: {
          name,
          creatDate: '',
          isDeleted: 0,
          platformId: null,
          parentId: '',
          emergencyStation,
          groupId: this.dataForm.id, // 当前组id
          eventTypeIdList: emergencyStation === 467 ? this.middleCheckList1
            : this.middleCheckList2, // 中间勾选的类型
        },
      }).then((res) => {
        if (res.data.code === 0 || res.data.errorcode === 0) {
          this.$message({
            message: '新增分管类型成功！',
            type: 'success',
          });
          this.init(this.dataForm.id);
          this.activeName = 'second';
        }
      });
    },
    clickLeft(item, i) {
      if (i === 467) {
        this.currleft1 = item;
        this.right1 = item.malicontactorList || [];
        if (item.eventTypeIdList) {
          if (item.eventTypeIdList.length > 0) {
            this.$nextTick(() => {
              this.$refs.middleTreeOne.setCheckedKeys(item.eventTypeIdList);
            });
          }
        } else {
          this.$nextTick(() => {
            this.$refs.middleTreeOne.setCheckedKeys([]);
          });
        }
      } else {
        this.currleft2 = item;
        this.right2 = item.malicontactorList || [];
        if (item.eventTypeIdList) {
          if (item.eventTypeIdList.length > 0) {
            this.$nextTick(() => {
              this.$refs.middleTreeTwo.setCheckedKeys(item.eventTypeIdList);
            });
          }
        } else {
          this.$nextTick(() => {
            this.$refs.middleTreeTwo.setCheckedKeys([]);
          });
        }
      }
    },
    deleteLeft(item) {
      this.$http({
        url: `${window.SITE_CONFIG.baseUrl}/mail/mailGroupManageType/delete`,
        method: 'post',
        data: [item.id],
      }).then((res) => {
        if (res.data.code === 0 || res.data.errorcode === 0) {
          this.$message({
            message: '删除成功！',
            type: 'success',
          });
          this.init(this.dataForm.id);
          this.activeName = 'second';
        }
      });
    },
    // 负责人中-点击
    middleClick1(data, checked) {
      if (checked) {
        this.middleCheckList1.push(data.id);
      } else {
        this.middleCheckList1 = this.middleCheckList1.filter((el) => el !== data.id);
      }
    },
    // 联络人中-点击
    middleClick2(data, checked) {
      if (checked) {
        this.middleCheckList2.push(data.id);
      } else {
        this.middleCheckList2 = this.middleCheckList2.filter((el) => el !== data.id);
      }
    },
    addRight(i) {
      if (!this.currleft1 && !i) {
        this.$message({
          message: '请先在负责人tab下选中处置类型',
          type: 'error',
        });
        return;
      } if (!this.currleft2 && i) {
        this.$message({
          message: '请先在联络人tab下选中处置类型',
          type: 'error',
        });
        return;
      }
      this.isManageOrContact = i;
      this.$nextTick(() => {
        this.$refs.MailListTreeAddManager.init(this.dataForm.id);
      });
    },
    // 负责人联络人右，人员赋值
    submit(arr) {
      if (this.isManageOrContact) this.right2 = arr;
      else this.right1 = arr;
    },
    // 单位信息-新增
    save1() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.dataForm.resourceRelatedFormList = this.showDeviceData.room.map((item) => {
            const obj = {
              resoureId: item.id,
              type: parseInt(item.type, 10) + 9,
              isDefault: item.isDefault,
            };
            return obj;
          });
          this.$http({
            url:
            this.dataForm.id
              ? `${window.SITE_CONFIG.baseUrl}/mail/mailgroup/update`
              : `${window.SITE_CONFIG.baseUrl}/mail/mailgroup/save`,
            method: 'post',
            data: {
              id: this.dataForm.id, // 当前组id
              parentId: this.dataForm.parentId, // 上级id
              name: this.dataForm.unitName,
              address: this.dataForm.unitAddress,
              officePhone: this.dataForm.workPhone,
              fax: this.dataForm.fax,
              responsiblePhone: this.dataForm.contactPhone,
              email: this.dataForm.mail,
              responsible: this.dataForm.dutyPeople,
              remark: '', // 旧字段，应该换成单位信息的
              type: this.dataForm.id ? 1 : 0, // 0新增1修改
              resourceRelatedFormList: this.dataForm.resourceRelatedFormList,
            },
          }).then((res) => {
            if (res.data.code === 0 || res.data.errorcode === 0) {
              this.$message({
                message: '保存成功！',
                type: 'success',
              });
              if (res.data.data) this.dataForm.id = res.data.data;
              else this.visible = false;
              this.init(this.dataForm.id);
              this.$emit('refreshEventTypeDataList');
            }
          });
        }
      });
    },
    // 全局-修改
    save2() {
      this.$http({
        url: `${window.SITE_CONFIG.baseUrl}/mail/mailgroup/update`,
        method: 'post',
        data: {
          type: 3, // 全局修改里的类型
          id: this.dataForm.id, // 当前组id
          parentId: this.dataForm.parentId, // 上级id
          name: this.dataForm.unitName,
          remark: '', // 不需要
          groupResponsibleTypeList: [
            {
              id: this.currleft1.id, // 左-分管类型id
              name: this.currleft1.name, // 左-分管类型名字
              emergencyStation: 467, // 467是负责
              eventTypeIdList:
              this.middleCheckList1.length
                ? this.middleCheckList1
                : this.currleft1.eventTypeIdList, // 中-事件类型id
              contactorList: this.right1.map((e) => e.id), // 右-联系人id
            },
          ],
          groupContactorTypeList: [
            {
              id: this.currleft2.id, // 左-分管类型id
              name: this.currleft2.name, // 左-分管类型名字
              emergencyStation: 468, // 468是联络
              eventTypeIdList:
              this.middleCheckList2.length
                ? this.middleCheckList2
                : this.currleft2.eventTypeIdList, // 中-事件类型id
              contactorList: this.right2.map((e) => e.id), // 右-联系人id
            },
          ],
        },
      }).then((res) => {
        if (res.data.code === 0 || res.data.errorcode === 0) {
          this.$message({
            message: '修改成功！',
            type: 'success',
          });
          this.init(this.dataForm.id);
          this.visible = false;
          this.$emit('refreshEventTypeDataList');
        }
      });
    },
    // 上级单位
    topUnitChange(data) {
      if (this.dataForm.id !== 0 && data.id === this.dataForm.id) {
        this.$message({
          message: '不能选自己作为上级单位',
          type: 'error',
        });
        return;
      }
      this.dataForm.parentId = data.id;
      this.dataForm.topUnit = data.name;
    },
    // 获得上级分组列表
    topUnitInit() {
      this.topUnitVisible = true;
      this.$http({
        url: this.$http.adornUrl('/mail/mailgroup/list'),
        method: 'get',
        params: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data) {
          data.data.splice(0, 0, { id: 0, name: '顶级分组节点' });
          this.topUnitTree = data.data;
        }
      }).then(() => {
        // 只有打开上级框才能被响应
        this.$nextTick(() => {
          this.$refs.topUnitRef.setCurrentKey(this.dataForm.parentId);
          this.dataForm.topUnit = (this.$refs.topUnitRef.getCurrentNode() || {}).name;
        });
      });
    },
    // 添加关联对象
    handleCommand(command, isMettingDevice = false) {
      if (typeof isMettingDevice !== 'boolean') {
        this.deviceTitle = this.deviceObj[command];
        this.$refs.deviceDialogEl.loadingPopup();
        const arrType = this.deviceTypeObj[command];
        this.$refs.deviceDialogEl.isMettingismDevice = false;
        this.$refs.deviceDialogEl.initData(
          command,
          this.showDeviceData[arrType],
        );
      }
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

<style scoped>
.flex {
  display: flex;
  justify-content: space-evenly;
}
.frame {
  border: 1px solid #DDDDDD;
  width: 31%;
  margin: 0 0 20px 0;
}
.headLine {
  width: 100%;
  padding: 10px;
  background: #FBFCFF;
  border-bottom: 1px solid #DDDDDD;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.overFlow {
  height: 44vh;
  overflow: auto;
}
.notHeadLine {
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.listItem {
  padding: 6px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.listItem:hover {
  background: rgba(0, 145, 255, 0.05);
  border-left: 2px solid rgba(0, 145, 255, 1);
}
.deleteImg {
  width: 17px;
  height: 17px;
  cursor: pointer;
}
.listItemChoosed {
  padding: 6px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 145, 255, 0.05);
  border-left: 2px solid rgba(0, 145, 255, 1);
}
.bottom {
  border-top: 1px solid #E9ECF1;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 15px 10px;
}
</style>

<style lang="scss" module>
.backDiv {
  margin-left: 20px;
  background: #f2f2f2;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 12px;
}
.outDiv {
  margin-top: -2px;
  .showDevice {
    display: flex;
    height: 30px;
    line-height: 30px;
    margin: 5px;
    .type {
      width: 100px;
      text-align: center;
      border: 1px dashed #0091ff;
      padding: 0px 5px;
    }
    .related_btn {
      opacity: 0;
      text-align: center;
      border: 1px dashed #000000;
      padding: 0 5px;
      height: 30px;
      width: 90px;
      cursor: pointer;
      margin-right: 10px;
    }
    .position {
      opacity: 1;
      text-align: center;
      border: 1px dashed #000000;
      padding: 0 5px;
      height: 30px;
      width: 90px;
      cursor: pointer;
      margin-right: 10px;
    }
    .deviceName_default {
      width: 395px;
      padding-left: 10px;
      color: #0091ff;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .deviceName {
      width: 490px;
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
    &:hover > .related_btn {
      opacity: 1;
    }
  }
}
</style>
