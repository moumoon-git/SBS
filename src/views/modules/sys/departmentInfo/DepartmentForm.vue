<!--
 * @Author: your name
 * @Date: 2021-11-05 13:45:13
 * @LastEditTime: 2021-11-06 22:27:07
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \project-yangzhou-caseInstitutions\src\views\modules\sys\departmentInfo\DepartmentForm.vue
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="Modal"
    width="900px"
    center
    @close="closeDialog"
    top="15vh"
    :close-on-click-modal="false"
  >
    <el-form
      label-width="100px"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      @submit.native.prevent
    >
      <!-- author: qinjiaqi -->
      <!-- description: 这一行是头像 -->
      <!-- <el-row :gutter="30">
        <el-col :span="24" v-if="!isDisabled">
          <el-form-item style="text-align: center">
            <div class="head-class">
              <img
                :src="
                  ruleForm.picture == ''
                    ? imageUrl
                    : this.$window.g.ApiUrl + ruleForm.picture
                "
                alt=""
              />
              <div class="head-class-background"></div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="isDisabled">
          <el-form-item style="text-align: center">
            <div class="upload-class" v-if="ruleForm.picture == ''">
              <el-upload
                class="upload-demo"
                action=""
                :http-request="uploadFileMethod"
                :accept="accept"
                :before-upload="beforeAvatarUpload"
                :headers="{
                  Authorization: $window.localStorage.getItem('token')
                    ? $window.localStorage.getItem('token')
                    : '',
                }"
                :before-remove="beforeRemove"
              >
                <img :src="ruleForm.picture == '' ? uploadUrl : ''" alt="" />
              </el-upload>
              <div class="upload-class-background"></div>
              <p>上传照片</p>
            </div>
            <div class="head-class" v-if="ruleForm.picture != ''">
              <div class="delete-class">
                <img
                  :src="ruleForm.picture == '' ? '' : deleteUrl"
                  alt=""
                  @click="beforeRemove"
                />
              </div>
              <img
                :src="
                  ruleForm.picture == ''
                    ? ''
                    : this.$window.g.ApiUrl + ruleForm.picture
                "
                alt=""
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="姓名:" prop="name">
            <el-input
              v-model="ruleForm.name"
              :disabled="disabled"
              :maxlength="maxlength.VcName"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="isDisabled || (ruleForm.sex != null && ruleForm.sex != '')"
        >
          <el-form-item label="性别:" prop="sex" style="text-align: left">
            <el-select
              v-model="ruleForm.sex"
              :disabled="disabled"
              clearable
              style="width: 310px"
              value-key="id"
            >
              <el-option
                v-for="item in genders"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="24">
          <el-form-item
            label="联系人分组"
            prop="contactorGroup"
            style="text-align: left"
          >
            <el-input
              v-model="ruleForm.contactorGroup"
              disabled
              style="width: 660px"
            ></el-input>
            <el-button
              type="primary"
              v-if="isDisplay"
              size="mini"
              @click="onSelectTree()"
              style="margin-left: 0px; padding: 7px 7px"
              >选择</el-button
            >
            <el-button
              type="primary"
              v-if="isDisplay"
              size="mini"
              :disabled="disabled"
              @click="onClearSelect()"
              style="margin-left: 0px; padding: 7px 7px"
              >清除</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col
          :span="12"
          v-if="
            isDisabled || (ruleForm.workUnit != null && ruleForm.workUnit != '')
          "
        >
          <el-form-item label="工作单位:" prop="workUnit">
            <el-input
              v-model="ruleForm.workUnit"
              :disabled="disabled"
              :maxlength="maxlength.VcWorkUnit"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="
            isDisabled || (ruleForm.position != null && ruleForm.position != '')
          "
        >
          <el-form-item label="职务:" prop="position">
            <el-input
              v-model="ruleForm.position"
              :disabled="disabled"
              clearable
            >
              <el-button
                slot="append"
                @click="changePosition"
                v-show="isDisabled"
                >选择</el-button
              >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="
            isDisabled || (ruleForm.mobile1 != null && ruleForm.mobile1 != '')
          "
        >
          <el-form-item label="手机号码:" prop="mobile1">
            <el-input
              v-model="ruleForm.mobile1"
              :disabled="disabled"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="
            isDisabled ||
            (ruleForm.officeTel != null && ruleForm.officeTel != '')
          "
        >
          <el-form-item label="办公电话:" prop="officeTel">
            <el-input
              v-model="ruleForm.officeTel"
              :disabled="disabled"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="
            isDisabled || (ruleForm.mobile2 != null && ruleForm.mobile2 != '')
          "
        >
          <el-form-item label="手机2:" prop="mobile2">
            <el-input
              v-model="ruleForm.mobile2"
              :disabled="disabled"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="
            isDisabled || (ruleForm.temobile != null && ruleForm.temobile != '')
          "
        >
          <el-form-item label="手持终端:" prop="temobile">
            <el-input
              v-model="ruleForm.temobile"
              :disabled="disabled"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="
            isDisabled || (ruleForm.homeTel != null && ruleForm.homeTel != '')
          "
        >
          <el-form-item label="家庭电话" prop="homeTel">
            <el-input
              v-model="ruleForm.homeTel"
              :disabled="disabled"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="
            isDisabled ||
            (ruleForm.otherTel != null && ruleForm.otherTel != '')
          "
        >
          <el-form-item label="其他电话:" prop="otherTel">
            <el-input
              v-model="ruleForm.otherTel"
              :disabled="disabled"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="isDisabled || (ruleForm.fax != null && ruleForm.fax != '')"
        >
          <el-form-item label="传真号码:" prop="fax">
            <el-input
              v-model="ruleForm.fax"
              :disabled="disabled"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="isDisabled || (ruleForm.email != null && ruleForm.email != '')"
        >
          <el-form-item label="电子邮箱:" prop="email">
            <el-input
              v-model="ruleForm.email"
              :disabled="disabled"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="
            isDisabled ||
            (ruleForm.importance != null && ruleForm.importance != '')
          "
        >
          <el-form-item
            label="重要程度:"
            prop="importance"
            style="text-align: left"
          >
            <el-select
              v-model="ruleForm.importance"
              clearable
              :disabled="disabled"
              style="width: 310px"
              value-key="id"
            >
              <el-option
                v-for="item in Importance"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          v-if="
            isDisabled || (ruleForm.remark != null && ruleForm.remark != '')
          "
        >
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="ruleForm.remark"
              :disabled="disabled"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="isDisabled" class="dialog-footer">
      <el-button type="primary" size="medium" @click="save('ruleForm')"
        >确认</el-button
      >
      <el-button type="info" size="medium" @click="cancleDialog('ruleForm')"
        >取消</el-button
      >
    </div>
    <div v-else class="dialog-footer">
      <el-button type="primary" size="medium" @click="cancleDialog('ruleForm')"
        >确认</el-button
      >
    </div>
    <!-- 分组 -->
    <checked-grouping ref="mychild" @treeChild="treeChild"></checked-grouping>
    <!-- 职务弹窗 -->
    <position-tree
      ref="PositionTree"
      @handleNodeClick="handleNodeClick"
    ></position-tree>
  </el-dialog>
</template>

<script>
import checkedGrouping from '../../../../ebs_components/checkedGrouping';
import PositionTree from './positionTree'; // 导入职务数据
import { getlocalStorage } from '../../../../assets/js/ebs_common'; //获取localStorage
import { getRelations } from '@/assets/js/yz_common.js';
export default {
  name: 'Form',
  props: ['treeData', 'currentNode'],
  components: {
    PositionTree,
    'checked-grouping': checkedGrouping,
  },
  computed: {
    mobileValue() {
      return this.ruleForm.mobile1;
    },
    otherTelValue() {
      return this.ruleForm.mobile2;
    },
  },
  watch: {
    mobileValue(newval, oldval) {
      if (newval != '********') {
        this.hideMobile = newval;
      }
      // this.hideMobile = newval
      console.log(this.hideMobile, newval);
    },
    otherTelValue(newval, oldval) {
      if (newval != '********') {
        this.hideOtherTel = newval;
      }
      // this.hideOtherTel = newval
      console.log(this.hideOtherTel, newval);
    },
  },
  inject: ['reload'],
  data() {
    // 扬州领导手机号需要加密，因此这里校验需要作区分
    var checkPhone = (rule, value, callback) => {
      // 如果是修改弹窗，且该联系人是领导，手机号可以是'*'
      if (this.type == 'update' && this.leader && value == '********') {
        if (this.hideMobile == null || this.hideMobile.indexOf('*') != -1) {
          callback(new Error('格式不正确'));
        } else {
          callback();
        }
        console.log(this.type, value, this.hideMobile);
      } else {
        var reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
        if (value == '' || value == null) {
          callback();
        } else {
          if (!reg.test(value)) {
            callback(new Error('格式不正确'));
          } else {
            callback();
          }
        }
      }
    };
    var checkOtherTel = (rule, value, callback) => {
      // 如果是修改弹窗，且该联系人是领导，手机号可以是'*'
      if (this.type == 'update' && this.leader && value == '********') {
        if (this.hideOtherTel == null || this.hideOtherTel.indexOf('*') != -1) {
          callback(new Error('格式不正确'));
        } else {
          callback();
        }
        console.log(this.type, value, this.hideOtherTel);
      } else {
        var reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
        if (value == '' || value == null) {
          callback();
        } else {
          if (!reg.test(value)) {
            callback(new Error('格式不正确'));
          } else {
            callback();
          }
        }
      }
    };
    return {
      imageUrl: '../../../static/img/head.png', // 默认头像
      deleteUrl: '../../../static/img/delete.png', // 删除按钮
      uploadUrl: '../../../static/img/upload.png', // 上传按钮
      accept: '.jpg, .jpeg, .png, .JPG, .JPEG, .PNG', // 可接受类型
      isDisplay: true,
      title: '', //标题
      dialogTitle: '',
      Modal: false, //模态框
      disabled: false,
      isDisabled: true,
      type: '', //判断是新增还是修改
      ruleForm: {
        name: '',
        contactorGroup: '', //联系人分组名称
        sex: '',
        importance: '',
        email: '',
        workUnit: '',
        position: '',
        mobile1: '',
        officeTel: '',
        homeTel: '',
        fax: '',
        mobile2: '',
        otherTel: '',
        temobile: '', //手持终端
        remark: '',
        picture: '',
      },
      rules: {
        //正则
        name: [
          {
            required: true,
            validator: this.$regular.mailList,
            trigger: 'blur',
          },
        ],
        contactorGroup: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur',
          },
        ],
        mobile1: [
          {
            validator: window.g.isYangZhouProject
              ? checkPhone
              : this.$regular.phoneReg,
            trigger: 'blur',
          },
        ],
        email: [
          {
            type: 'email',
            message: '格式不正确',
            trigger: 'blur',
          },
        ],
        officeTel: [
          {
            //办公电话
            validator: this.$regular.fixedTelephone,
            trigger: 'blur',
          },
        ],
        homeTel: [
          {
            //住宅电话
            validator: this.$regular.fixedTelephone,
            trigger: 'blur',
          },
        ],
        fax: [
          {
            //传真号码
            validator: this.$regular.fixedTelephone,
            trigger: 'blur',
          },
        ],
        mobile2: [
          {
            //其他手机号码1
            validator: window.g.isYangZhouProject
              ? checkOtherTel
              : this.$regular.phoneReg,
            trigger: 'blur',
          },
        ],
        otherTel: [
          {
            //其他号
            validator: this.$regular.numberType,
            trigger: 'blur',
          },
        ],
        temobile: [
          {
            //手持终端
            validator: this.$regular.numberType,
            trigger: 'blur',
          },
        ],
      },
      genders: [],
      Importance: [],
      root: '',
      contactorGroupId: [], //分组ID
      maxlength: {
        VcName: 100,
        VcWorkUnit: 100,
        VcPosition: 100,
      },
      IsYangZhouProject: window.g.isYangZhouProject,
      isLeader: getlocalStorage('isLeader'), // 登录用户是否领导
      leader: '', // 当前选中联系人是否为领导
      hideMobile: '', // 查看或修改时保存被隐藏的手机号（任务：扬州领导手机号需要隐藏）
      hideOtherTel: '', // 查看或修改时保存被隐藏的手机号2（任务：扬州领导手机号需要隐藏）
      leader: '', // 当前选中联系人是否为领导
      token: this.$cookie.get('token'),
      allTreeData:[]
    };
  },
  created() {
    this.getGender();
    this.getImportance();
  },
  methods: {
    /**
     * @description 获取性别
     */
    getGender() {
      this.$http({
        url: `${window.SITE_CONFIG['event']}/emergency/preparation/dictionary/getByParentCode`,
        method: 'POST',
        data: {
          pcode: 'sex',
        },
      }).then((result) => {
        this.genders = result.data.data; //性别
        console.log('性别：', this.genders)
      });
    },
    /**
     * @description 获取重要程度
     */
    getImportance() {
      this.$http({
      url: `${window.SITE_CONFIG['event']}/emergency/preparation/dictionary/getByParentCode`,
      method: 'POST',
      data: {
        pcode: 'importance',
      },
    }).then((result) => {
      this.Importance = result.data.data; //重要程度
      console.log('重要程度:', this.Importance)
    });
    },
    /**
     * @description: 初始化数据，打开弹窗
     * @desc 初始化数据，打开弹窗
     * @param {String} type 弹窗类型，add新增、modify编辑
     * @param {Object} data 编辑的数据
     */
    init(type, id, platformId) {
      this.type = type;
      // this.ruleForm.id = id || 0;
      if (type === 'add') {
        this.ruleForm = { ...this.ruleForm };
        // 把当前选择的分组赋值到添加应急队伍表格中
        if (this.currentNode) {
          this.ruleForm.contactorGroup = this.currentNode.name;
          this.contactorGroupId = this.currentNode.id;
        }
        // 显示弹窗
        this.$refs.dialog.visible = true;
      }
    },

    /**
     * @param {type} 没有
     * @return {type} undefined
     * @description：使职务框可见，然后修改职务
     */
    changePosition() {
      this.$nextTick(() => {
        this.$refs.PositionTree.isShow = true;
      });
    },
    /**
     * @param {String} 数据传来的职务名称
     * @return {String} 前端展示的职务名称
     * @description：获得职务名称
     */
    handleNodeClick(position) {
      return (this.ruleForm.position = position);
    },
    onSelectTree() {
      //打开联系人分组类别树
      this.$http({
        method: 'get',
        url: `/emergency/mechanism/group/tree`,
        baseURL: window.SITE_CONFIG['event'],
        headers: {
          token: this.token,
        },
        params: {
          token: this.token,
        },
      }).then((res) => {
        let data = [
          {
            id: 0,
            name: '应急机构分组',
            children: res.data.data,
          },
        ];
        console.log('左边分组树：', data)
        let type = '选择联系人分组';
        let treeData = {
          id: this.contactorGroupId,
          name: this.ruleForm.contactorGroup,
        };
        this.$refs.mychild.openModal(data, type, treeData);
      });
    },
    onClearSelect() {
      //清除联系人分组
      this.ruleForm.contactorGroup = '';
      this.contactorGroupId = [];
    },
    treeChild(data) {
      //数据回传
      this.ruleForm.contactorGroup = data.treeName;
      this.contactorGroupId = data.treeID;
    },
    /**
     * @description 获取详情
     * @param id 应急机构联系人id
     */
    getDetail(id) {
      this.$http({
        url:  `${ window.SITE_CONFIG['event']}/emergency/mechanism/contactor/detail/${id}`,
        method: 'get',
      }).then(({ data }) => {
        console.log('详情：', data)
        const result = data.data;
        // 获取分组级联关系
        const groupNames = getRelations({
          arr: this.allTreeData,
          relationKey: 'name',
          findKey: 'id',
          findValue: Number(result.groups[0].id),
        });
        console.log('救命：', this.allTreeData, result.groups[0].id, groupNames)
        const contactor = {
          id: result.id,
          name: result.name || '',
          contactorGroup: groupNames.join('->') || '', // 联系人分组名称
          sex: result.sex == 539 ? '男' : '女',
          importance: result.importance || '',
          email: result.email || '',
          workUnit: result.workUnit || '',
          position: result.position || '',
          mobile1: result.mobile1 || '',
          officeTel: result.officeTel || '',
          homeTel: result.homeTel || '',
          fax: result.fax || '',
          mobile2: result.mobile2 || '',
          otherTel: result.otherTel || '',
          temobile: result.temobile || '', // 手持终端
          remark: result.remark || '',
          picture: result.picture || '',
        }
        this.ruleForm = contactor;
        console.log('赋值：', this.ruleForm)
      });
    },
    /**
     * @editor qinjiaqi
     * @param {Object, String} 数据表单，当前是新增还是修改
     * @return {type} undefined
     * @description：新加头像的清空和获取, 修改工作单位的新增填充
     */
    openModal(fromData, type,currentGoupId) {
      console.log(  this.treeData,'数据')
      this.ruleForm.picture = '';
      this.Modal = true;
      let groupAll = [];
      this.contactorGroupId = [];
      switch (type) {
        case 'add': //新增
          this.isDisplay = true;
          groupAll = fromData.groups;
          this.disabled = false;
          this.isDisabled = true;
          this.type = 'add';
          this.title = '联系人新增';
          this.$nextTick(() => {
            this.$refs['ruleForm'].resetFields();
            for (let i in this.ruleForm) {
              this.ruleForm[i] = '';
            }
            let groupsName = '';
            let tempGroupsName = '';
            for (let i in groupAll) {
              this.contactorGroupId.push(groupAll[i].id);
              let parentName = this.$ParentnodeTree(
                this.treeData,
                groupAll[i].id,
              ); //父级名称
              if (parentName) {
                if (parentName.name === this.treeData[0].name) {
                  groupsName += groupAll[i].name;
                  tempGroupsName = groupAll[i].name;
                } else groupsName += parentName.name + '->' + groupAll[i].name;
                tempGroupsName = groupAll[i].name;
                if (i < groupAll.length - 1) groupsName += `   `;
              }
            }
            this.ruleForm.contactorGroup = groupsName;
            this.ruleForm.workUnit = tempGroupsName;
          });
          break;
        default:
          console.log(fromData,'fromData')
          this.getDetail(fromData.id)
          if (type == 'detail') {
            console.log(this.ruleForm.contactorGroup,'this.ruleForm.contactorGroup')
            this.disabled = true;
            this.isDisabled = false;
            this.isDisplay = false;
            this.title = '联系人查看';
            this.type = 'detail';
            console.log(this.ruleForm)
          } else if (type == 'update') {
            groupAll = fromData.groupIds;
            this.disabled = false;
            this.isDisabled = true;
            this.isDisplay = true;
            this.title = '联系人修改';
            this.type = 'update';
          }
          break;
      }
    },
    save(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          if (this.type == 'update') {
            let test = {
              groupIds: this.contactorGroupId,
            };
            let formData = Object.assign(test, this.ruleForm);
            console.log(formData);
            // bug10652 当修改时不更改性别，传后端是文字，应改为数字 重要程度同理 author:husiyue date:2021.3.19
            if (formData.sex == '男') {
              formData.sex = 12;
            } else if (formData.sex == '女') {
              formData.sex = 11;
            }
            if (formData.importance == '一般') {
              formData.importance = 217;
            } else if (formData.importance == '紧急') {
              formData.importance = 219;
            } else if (formData.importance == '领导') {
              formData.importance = 2813;
            }
            // 赋值隐藏的手机号
            if (this.IsYangZhouProject) {
              formData.mobile1 = this.hideMobile;
              formData.mobile2 = this.hideOtherTel;
            }
            console.log(this.hideMobile, this.hideOtherTel);
            this.$http(
              {
              method: 'post',
              url: '/emergency/mechanism/contactor/save',
              baseURL: window.SITE_CONFIG['event'],
              data: formData,
            }
            ).then(({ data }) => {
              if (data.code === 0) {
                this.Modal = false;
                this.$emit('fatherMethod');
                this.$message({
                  message: '修改成功',
                  type: 'success',
                });
                this.$refs.template.getTableList();
              } else {
                this.$message.error(`${data.msg}修改失败`);
              }
            });
          } else if (this.type == 'add') {
            let test = {
              groupIds: this.contactorGroupId,
            };
            let formData = Object.assign(test, this.ruleForm);
            this.$http({
              method: 'post',
              url: '/emergency/mechanism/contactor/save',
              baseURL: window.SITE_CONFIG['event'],
              data: formData,
            }).then(({ data }) => {
              if (data.code === 0) {
                this.Modal = false;
                this.$emit('fatherMethod');
                this.$message({
                  message: '新增成功',
                  type: 'success',
                });
                this.$refs.template.getTableList();
              } else {
                this.$message.error(`${data.msg}新增失败`);
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    cancleDialog(ruleForm) {
      //关闭模态框并清除规则
      this.Modal = false;
      this.$refs[ruleForm].resetFields();
    },
    closeDialog() {
      // 对话框关闭事件
      this.$refs['ruleForm'].resetFields();
    },
    /**
     * @author qinjiaqi
     * @param {Object} "el-upload"的参数
     * @return {type} undefined
     * @description：上传头像，把头像路径赋给表单
     */
    uploadFileMethod(param) {
      let fileObject = param.file;
      let formData = new FormData();
      formData.append('file', fileObject);
      this.$http({
        method: 'post',
        url: '/scgMailContactor/uploadImg',
        baseURL: window.SITE_CONFIG['fileupload'],
        data: formData,
      }).then((res) => {
        this.$message({
          message: '上传成功',
          type: 'success',
        });
        console.log(res, 'res');
        this.ruleForm.picture = res.data.data.url;
        console.log('图片路径：', param, this.ruleForm.picture);
      });
    },
    /**
     * @author qinjiaqi
     * @param {Object} 图像
     * @return {type} undefined
     * @description：上传前类型判断
     */
    beforeAvatarUpload(file) {
      let fileName = file.name.lastIndexOf('.'); //取到文件名开始到最后一个点的长度
      let fileNameLength = file.name.length; //取到文件名长度
      let fileFormat = file.name.substring(fileName + 1, fileNameLength);
      let fileType =
        fileFormat === 'jpg' ||
        fileFormat === 'jpeg' ||
        fileFormat === 'png' ||
        fileFormat === 'JPG' ||
        fileFormat === 'JPEG' ||
        fileFormat === 'PNG';
      if (!fileType) {
        this.$message.error('上传格式为jpg, jpeg, png, JPG, JPEG, PNG');
      }
      return fileType;
    },
    /**
     * @author qinjiaqi
     * @param {type} 无
     * @return {type} undefined
     * @description：删除文件
     */
    beforeRemove() {
      this.ruleForm.picture = '';
      console.log('图片路径：', this.ruleForm.picture);
    },
    // getImportance(id){
    //   if(id=='544'){
    //     return '领导'
    //   }else if(id=='543'){
    //     return '紧急'
    //   }else if(id=='542'){
    //     return '中等'
    //   }else if(id=='541'){
    //     return '一般'
    //   }else{
    //     return 
    //   }
    // }
  },
};
</script>

<style scoped>
.dialog-footer {
  text-align: center;
  padding-top: 30px;
}

.el-form-item >>> .el-form-item__content {
  line-height: 38px;
}
/** 
     * @author qinjiaqi
     * @description：头像类
     */
.head-class {
  top: -11px;
  left: 224px;
  width: 100px;
  height: 100px;
  position: relative;
  z-index: 0;
}
/** 
     * @author qinjiaqi
     * @description：头像类中头像图片的样式
     */
.head-class img {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 0;
}
/** 
     * @author qinjiaqi
     * @description：头像类中头像背景的样式
     */
.head-class .head-class-background {
  position: absolute;
  width: 100%;
  height: 100%;
  right: -50px;
  background: #9fc8fe;
  z-index: -1;
}
/** 
     * @author qinjiaqi
     * @description：头像类中删除按钮的样式
     */
.head-class .delete-class img {
  top: -6px;
  left: 134px;
  width: 20px;
  height: 20px;
  position: absolute;
  z-index: 1;
}
/** 
     * @author qinjiaqi
     * @description：上传类
     */
.upload-class {
  top: -6px;
  left: 224px;
  width: 100px;
  height: 100px;
  position: relative;
  z-index: 0;
}
/** 
     * @author qinjiaqi
     * @description：上传类中上传图片的样式
     */
.upload-class img {
  position: absolute;
  right: -22px;
  top: 11px;
  width: 45px;
  height: 45px;
  z-index: 1;
}
/** 
     * @author qinjiaqi
     * @description：上传类中上传文字的样式
     */
.upload-class p {
  position: absolute;
  bottom: -3px;
  right: -28px;
  z-index: 10;
  color: #0091ff;
  font-family: PingFangSC-Medium, PingFang SC;
  z-index: 1;
}
/** 
     * @author qinjiaqi
     * @description：上传类中上传背景的样式
     */
.upload-class .upload-class-background {
  position: absolute;
  width: 100%;
  height: 100%;
  right: -50px;
  top: -7px;
  border: 2px dashed #9fc8fe;
  z-index: 0;
}
</style>
