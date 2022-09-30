<!--
 * @Author: yanghaohao
 * @Date: 2021-02-01 14:56:35
 * @LastEditTime: 2021-08-10 11:04:24
 * @LastEditors: Please set LastEditors
 * @Description: 新增或编辑应急专家
 * @FilePath: /SBS/src/views/modules/EmergencyManagement/EmergencyManagement-add-or-update.vue
-->

<template>
  <div :class="$style.expert">
    <sv-dialog
      ref="dialog"
      :title="isUpdate ? '编辑应急专家' : '新增应急专家'"
      @cancel="$refs.dialog.visible = false"
      @confirm="confirmSubmit"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        :class="$style.ruleForm"
      >
        <el-form-item label="上传头像" prop="fileList">
          <sv-upload-img
            v-model="ruleForm.fileList"
            :api="
              $window.SITE_CONFIG.fileupload + '/scgMailContactor/uploadImg'
            "
          />
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请填写名字" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="moblie">
              <el-input
                v-model="ruleForm.moblie"
                placeholder="请填写手机号码"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="专家组" prop="expertGroup">
              <el-input
                v-model="ruleForm.expertGroup"
                :readonly="true"
                placeholder="请选择专家分组"
                @focus="selectExpertGroup()"
              />
              <sv-dialog
                ref="expertDialog"
                title="新增应急专家"
                @cancel="$refs.expertDialog.visible = false"
                @confirm="$refs.expertDialog.visible = false"
              >
                <div :class="$style.expertTree">
                  <!-- <el-input
                    v-model="filterText"
                    clearable
                    style="padding: 10px"
                    placeholder="输入关键字进行过滤"
                  /> -->
                  <el-tree
                    ref="expertTree"
                    :data="expertTreeList"
                    :props="treeProp"
                    node-key="id"
                    :filter-node-method="filterNode"
                    :highlight-current="true"
                    @current-change="treeChangeHandle"
                  />
                </div>
              </sv-dialog>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="办公电话" prop="phone">
              <el-input v-model="ruleForm.phone" placeholder="请填写办公电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="专家类型" prop="teamTypeName">
              <el-input
                v-model="ruleForm.teamTypeName"
                :readonly="true"
                placeholder="请选择专家类型分组"
                @focus="selectExpertTypeGroup()"
              />
              <sv-dialog
                ref="expertTypeDialog"
                title="选择应急专家类型"
                @cancel="$refs.expertTypeDialog.visible = false"
                @confirm="$refs.expertTypeDialog.visible = false"
              >
                <div :class="$style.expertTree">
                  <el-tree
                    ref="expertTree"
                    :data="expertTypeTreeList"
                    :props="treeProp"
                    node-key="id"
                    :highlight-current="true"
                    @current-change="typeTreeChangeHandle"
                  />
                </div>
              </sv-dialog>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作单位" prop="workPlace">
              <el-input
                v-model="ruleForm.workPlace"
                placeholder="请填写工作单位"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="职务" prop="work">
              <el-input v-model="ruleForm.work" placeholder="请填写职务" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主管单位" prop="manage">
              <el-input
                v-model="ruleForm.manage"
                placeholder="请填写主管单位"
              />
            </el-form-item>
          </el-col>
          
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="数据来源部门" prop="statics">
              <el-input
                v-model="ruleForm.statics"
                placeholder="请填写数据来源部门"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业类别" prop="perform">
              <el-input
                v-model="ruleForm.perform"
                placeholder="请填写专业类别"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="职称" prop="position">
              <el-input v-model="ruleForm.position" placeholder="请填写职称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- <el-form-item
              label="应急分类"
              prop="classify"
            >
              <sv-select
                v-model="ruleForm.classify"
                :options="classifyOptions"
                placeholder="请选择应急分类"
              />
            </el-form-item> -->
            <el-form-item label="应急分类" prop="classify">
              <el-cascader
                ref="caseClassId"
                v-model="ruleForm.classify"
                :options="classifyOptions"
                :props="propsObj"
                clearable
                style="float: left; width: 100%"
                :show-all-levels="false"
                placeholder="请选择应急分类"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="所属区域" prop="area">
              <el-cascader
                ref="townId"
                v-model="ruleForm.area"
                style="width: 100%"
                :options="areaOptions"
                :props="propsArea"
                clearable
                :show-all-levels="false"
                placeholder="请选择所属区域"
              />
            </el-form-item>
            <!-- <el-form-item
              label="所属区域"
              prop="area"
            >
              <sv-select
                v-model="ruleForm.area"
                :options="areaOptions"
                placeholder="请选择所属区域"
              />
            </el-form-item> -->
          </el-col>
        </el-row>
        <el-form-item label="重要成果">
          <sv-textarea
            v-model="ruleForm.achievement"
            placeholder="请简述重要成果"
          />
        </el-form-item>
        <el-form-item label="专业领域">
          <sv-textarea v-model="ruleForm.field" placeholder="请填写专业领域" />
        </el-form-item>
        <el-form-item label="应急工作简历">
          <sv-textarea v-model="ruleForm.resume" placeholder="请填写工作简历" />
        </el-form-item>
        <el-form-item label="工作简历描述">
          <sv-textarea
            v-model="ruleForm.description"
            placeholder="请简述工作简历"
          />
        </el-form-item>
        <el-form-item label="备注">
          <sv-textarea v-model="ruleForm.remark" placeholder="请填写补充内容" />
        </el-form-item>
        <el-form-item label="关联设备" :class="$style.addObjectValueParent">
          <!-- <el-button @click="addObjectFun">
            添加
          </el-button> -->
          <el-dropdown
            trigger="click"
            placement="bottom-start"
            @command="handleCommand"
          >
            <el-button plain> 增加 </el-button>
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
    </sv-dialog>
    <deviceDialog
      ref="deviceDialogEl"
      :dialog-title="deviceTitle"
      @selectedList="getDeviceData"
    />
  </div>
</template>
<script>
import deviceDialog from '../sys/resource/deviceDialog.vue';
import { getRelations } from '@/assets/js/yz_common.js';

export default {
  components: {
    deviceDialog,
  },
  props: {
    currentNode: {
      type: Object,
      defalut: () => ({}),
      required: true,
    },
  },
  data() {
    const checkPhone = (rule, value, callback) => {
      if (value) {
        this.$http({
          url: `${window.SITE_CONFIG.baseUrl}/resoure/resourexpert/mobileIsPresent`,
          method: 'get',
          params: this.$http.adornParams({
            mobile: this.ruleForm.moblie,
            id: this.ruleForm.id,
          }),
        }).then(({ data }) => {
          if (data && data.code === 0) {
            console.log(data);
            if (data.data) {
              callback(new Error('号码重复'));
            } else {
              callback();
            }
          } else {
            // this.$message.error(data.msg);
          }
        });
      } else {
        callback();
      }
    };
    // 校验手机号是否合法
    const rulesloginId = (rule, value, callback) => {
      if (!/^1[0-9]{10}$/.test(value)) {
        callback('手机号信息有误');
      } else {
        callback();
      }
    };
    return {
      propsObj: {
        value: 'id',
        label: 'name',
        children: 'children',
        checkStrictly: true,
      },
      propsArea: {
        value: 'id',
        label: 'townName',
        children: 'children',
        checkStrictly: true,
        emitPath: false,
      },
      filterText: '', // 选择专家树的值
      expertTreeList: [], // 专家树
      expertTypeTreeList: [], // 专家类型树
      treeProp: {
        label: 'name',
        children: 'children',
      },
      classifyOptions: [], // 应急分类选择数据
      areaOptions: [], // 地区选择数据
      isUpdate: false,
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
      ruleForm: {
        id: '', // id
        fileList: [], // 上传图片
        name: '', // 姓名
        moblie: '', // 手机号码
        expertGroup: '', // 专家组
        expertGroupId: '', // 专家组id
        teamTypeName: '', // 专家类型
        teamTypeId: '', // 专家类型id
        phone: '', // 办公电话
        workPlace: '', // 工作单位
        work: '', // 职务
        manage: '', // 主管单位
        statics: '', // 数据来源部门
        perform: '', // 专业类别
        position: '', // 职称
        classify: 0, // 应急分类
        area: 0, // 所属区域
        achievement: '', // 重要成果
        field: '', // 专业领域
        resume: '', // 应急工作简历
        description: '', // 工作简历描述
        remark: '', // 备注
        longitude: '',
        latitude: '',
      },
      rules: {
        name: [{ required: true, message: '请填写名字', trigger: 'blur' }],
        expertGroup: [
          { required: true, message: '请选择专家组', trigger: 'change' },
        ],
        teamTypeName: [
          { required: true, message: '请选择专家类型', trigger: 'change' },
        ],
        moblie: [
          { validator: checkPhone, trigger: 'blur' },
        ],
        // moblie: [
        //   { required: true, message: '请输入手机号', trigger: 'blur' },
        //   { validator: rulesloginId, trigger: 'blur' },
        // ],
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
    isUpdate: {
      handler(newVal, oldVal) {
        this.isUpdate = newVal;
      },
      deep: true,
    },
  },
  mounted() {
    this.getType();
  },
  methods: {
    /**
     * @description: 获取检查类型
     * @param {type}
     * @return {type}
     */
    getType() {
      // this.$http({
      //   url: this.$http.adornUrl('/resoure/resourexpert/getRegion'),
      //   method: 'get',
      //   params: this.$http.adornParams({
      //   }),
      // }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     this.areaOptions = [];
      //     data.data.forEach((item) => {
      //       this.areaOptions.push({ value: item.id, label: item.name });
      //     });
      //   } else {
      //     this.$message.error(data.msg);
      //   }
      // });
      // this.$http({
      //   url: this.$http.adornUrl('/resoure/resourexpert/getType'),
      //   method: 'get',
      //   params: this.$http.adornParams({
      //   }),
      // }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     this.classifyOptions = [];
      //     data.data.forEach((item) => {
      //       this.classifyOptions.push({ value: item.id, label: item.name });
      //     });
      //   } else {
      //     this.$message.error(data.msg);
      //   }
      // });
      // 应急分类
      this.$http
        .get(`${window.SITE_CONFIG.baseUrl}/sys/systown/treeList`)
        .then((response) => {
          if (response.data.code === 0) {
            this.areaOptions = response.data.list;
          }
        });
      // 所属区域
      this.$http({
        method: 'post',
        url: '/eos/caseClass/getTree',
        baseURL: window.g.ApiUrl,
      }).then((res) => {
        this.classifyOptions = res.data.data;
      });
    },
    /**
     * @description: 初始化弹窗
     */
    init(operation, row) {
      this.$refs.dialog.visible = true;
      this.isUpdate = false;
      this.ruleForm.name = '';
      this.ruleForm.moblie = '';
      this.ruleForm.phone = '';
      this.ruleForm.expertGroupId = '';
      this.ruleForm.teamTypeId = '';
      this.ruleForm.teamTypeName = '';
      this.ruleForm.workPlace = '';
      this.ruleForm.work = '';
      this.ruleForm.manage = '';
      this.ruleForm.statics = '';
      this.ruleForm.perform = '';
      this.ruleForm.position = '';
      this.ruleForm.classify = 0;
      this.ruleForm.area = 0;
      this.ruleForm.achievement = '';
      this.ruleForm.field = '';
      this.ruleForm.resume = '';
      this.ruleForm.description = '';
      this.ruleForm.remark = '';
      this.ruleForm.fileList = [];
      this.showDeviceData = {
        monitor: [],
        room: [],
        colony: [],
        // wecomm: [],
        app: [],
      };
      if (this.currentNode) {
        this.ruleForm.expertGroupId = this.currentNode.id;
        this.ruleForm.expertGroup = this.currentNode.name;
      }
      if (operation === 'modify') {
        this.isUpdate = true;
        this.ruleForm.id = row.id;
        this.ruleForm.name = row.name;
        this.ruleForm.moblie = row.phone;
        this.ruleForm.expertGroupId = row.groupId;
        this.ruleForm.teamTypeId = row.teamTypeId;
        this.ruleForm.expertGroup = row.groupName;
        this.ruleForm.teamTypeName = row.teamTypeName;
        this.ruleForm.phone = row.officePhone;
        this.ruleForm.workPlace = row.workUnit;
        this.ruleForm.work = row.duty;
        this.ruleForm.manage = row.managerUnit;
        this.ruleForm.statics = row.datasource;
        this.ruleForm.perform = row.majorType;
        this.ruleForm.position = row.dutyName;
        this.ruleForm.classify = getRelations({
          arr: this.classifyOptions ? this.classifyOptions : [],
          relationKey: 'id',
          findKey: 'id',
          findValue: Number(row.emergencyType),
        });
        this.ruleForm.area = row.area;
        this.ruleForm.achievement = row.achievements;
        this.ruleForm.field = row.majorArea;
        this.ruleForm.resume = row.emergencyResume;
        this.ruleForm.description = row.workResume;
        this.ruleForm.remark = row.remark;
        this.ruleForm.fileList = row.imgList || [];
        const request = {
          method: 'post',
          url: `${window.SITE_CONFIG.cloudUrl}/ser/resoure/resourexpert/info/${row.id}`,
          baseURL: window.SITE_CONFIG.baseUrl,
        };
        this.$http(request).then(({ data }) => {
          if (data.code === 0) {
            this.ruleForm.fileList = data.data.imgList || [];
            data.data.resources.forEach((item) => {
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
            this.ruleForm.teamTypeName = data.data.teamTypeName;
          } else {
            this.$refs.submitFail.supplementText = `错误代码：${data.code}`;
          }
        });
      }
    },
    /**
     * @description: 提交新增表单
     */
    confirmSubmit() {
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
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/resoure/resourexpert/${this.isUpdate ? 'update' : 'add'}`,
            ),
            method: 'post',
            data: this.$http.adornData({
              id: this.ruleForm.id || undefined,
              name: this.ruleForm.name,
              groupId: this.ruleForm.expertGroupId,
              teamTypeId: this.ruleForm.teamTypeId,
              officePhone: this.ruleForm.phone,
              phone: this.ruleForm.moblie,
              workUnit: this.ruleForm.workPlace,
              duty: this.ruleForm.work,
              managerUnit: this.ruleForm.manage,
              datasource: this.ruleForm.statics,
              majorType: this.ruleForm.perform,
              dutyName: this.ruleForm.position,
              emergencyType:
                this.ruleForm.classify[this.ruleForm.classify.length - 1],
              area: this.ruleForm.area,
              achievements: this.ruleForm.achievement,
              majorArea: this.ruleForm.field,
              emergencyResume: this.ruleForm.resume,
              workResume: this.ruleForm.description,
              remark: this.ruleForm.remark,
              longitude: this.ruleForm.longitude,
              latitude: this.ruleForm.latitude,
              imgList: this.ruleForm.fileList,
              params,
            }),
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.$emit('refreshDataList');
                },
              });
              this.$refs.dialog.visible = false;
            } else {
              this.$message.error(data.msg);
            }
          });
        }
      });
    },
    /**
     * @description: 选择专家树弹窗
     */
    selectExpertGroup() {
      this.$refs.expertDialog.visible = true;
      this.$http({
        url: this.$http.adornUrl('/resoure/expertGroup/listTree'),
        method: 'get',
        params: this.$http.adornParams(),
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.expertTreeList = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description: 选择专家类型树弹窗
     */
    selectExpertTypeGroup() {
      this.$refs.expertTypeDialog.visible = true;
      this.$http({
        url: this.$http.adornUrl('/resoure/resoureexpertclass/tree'),
        method: 'get',
        params: {
          apiVersion: '0.0.2',
        },
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // data.data.splice(0, 0, { id: 0, name: '顶级分组节点' });
          this.expertTypeTreeList = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    /**
     * @description: 专家树的模糊搜索过滤
     * @param {String} value 输入的值
     * @param {Obj} data 树形结构
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    /**
     * @description: 获取到点击的树节点信息
     * @param {Obj} data 选中的数据节点信息
     */
    treeChangeHandle(data) {
      this.ruleForm.expertGroupId = data.id;
      this.ruleForm.expertGroup = data.name;
    },
    typeTreeChangeHandle(data) {
      this.ruleForm.teamTypeId = data.id;
      this.ruleForm.teamTypeName = data.name;
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
      const index = this.showDeviceData[arrType].findIndex(
        (it) => it.id === item.id,
      );
      this.showDeviceData[arrType].splice(index, 1);
    },
  },
};
</script>
<style lang="scss" module>
.expert {
  .ruleForm {
    padding: 20px 20px 0px 10px;
    .expertTree {
      width: 300px;
      display: flex;
      flex-direction: column;
    }
  }
}
.addObjectValueParent {
  position: relative;
}
.backDiv {
  margin-left: 20px;
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
      background: url('../DeviceAdmin/assets/close.svg') no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
    }
  }
}
</style>
