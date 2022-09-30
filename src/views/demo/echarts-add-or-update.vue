<template>
  <el-dialog
    :title="!dataForm.id ? '联系人新增' : '联系人修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-row :gutter="20">
      <!--左边复选框-->
      <el-col :span="12">
        <el-form-item label="姓名" prop="name" size="large">
          <el-input v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="请选择分组" size="large">
          <el-popover
            ref="menuListPopover"
            placement="bottom-start"
            trigger="click">
            <el-tree
              :data="menuList"
              :props="menuListTreeProps"
              node-key="menuId"
              ref="menuListTree"
              @current-change="menuListTreeCurrentChangeHandle"
              :default-expand-all="true"
              :highlight-current="true"
              :expand-on-click-node="false">
            </el-tree>
          </el-popover>
          <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="请选择分组" class="menu-list__input"></el-input>
        </el-form-item>
        <el-form-item label="年龄" size="large">
          <el-input v-model="dataForm.age"></el-input>
        </el-form-item>
        <el-form-item label="工作单位" size="large">
          <el-input v-model="dataForm.workUnit"></el-input>
        </el-form-item>
        <el-form-item label="家庭电话" size="large">
          <el-input v-model="dataForm.home_tel"></el-input>
        </el-form-item>
        <el-form-item label="办公室电话" size="large">
          <el-input v-model="dataForm.officeTel"></el-input>
        </el-form-item>
      </el-col>
      <!--右边复选框-->
      <el-col :span="12">
        <el-form-item label="性别" size="large">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="手机号" size="large" prop="mobile1">
          <el-input v-model="dataForm.mobile1"></el-input>
        </el-form-item>
        <el-form-item label="职务" size="large">
          <el-input v-model="dataForm.position"></el-input>
        </el-form-item>
        <el-form-item label="电子邮件" size="large">
          <el-input v-model="dataForm.emai"></el-input>
        </el-form-item>
        <el-form-item label="其他号码" size="large">
          <el-input v-model="dataForm.mobile2"></el-input>
        </el-form-item>
        <el-form-item label="备注" size="large">
        <el-input type="textarea"  v-model="dataForm.remark"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  import Icon from '@/icons'
  export default {
    data () {
      return {
        visible: false,
        //表单验证
        options: [{
          value: '0',
          label: '男'
        }, {
          value: '1',
          label: '女'
        }],
        value: '',

        //菜单数据
        dataForm: {
          //id
          id: 0,
          parentId : 0,
          parentName:'',
          //姓名
          name: '',
          //办公室电话
          officeTel:'',
          //手机
          mobile1:"",
          //职务
          position:'',
          //单位
          workUnit:'',
          //其他号码
          mobile2:'',
          //家庭电话
          home_tel:'',
          //邮箱地址
          emai:'',
          //备注
          remark:'',
          //年龄
          age:''

        },
        //树形
        modifiedUserList: [],
        modifiedUserProps: {
          children: 'children',
          label: 'name'
        },
        //终端类型数据
        platformTypeList: [],
        // 表单必填绑定
        rules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min:2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          mobile1: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { min: 11, max: 11, message: '请输入正确的手机号码', trigger: 'blur' }
          ]
        },
        menuList: [],
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        },

      }
    },
    created () {
      this.iconList = Icon.getNameList()
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/mail/mailgroup/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          // console.log(data.data)
          //权限数据
          this.menuList = treeDataTranslate(data.tree, 'id')
        }).then(() => {
          this.visible = true
        }).then(() => {
          if (!this.dataForm.id) {
            // 新增
            this.menuListTreeSetCurrentNode()
          } else {
            // 修改
            let id = this.dataForm.id;
            this.$http({
              url: this.$http.adornUrl(`/mail/mailcontactor/info/${id}`),
              method: 'post',
              data: this.$http.adornData({})
            }).then(({data}) => {
              // console.log("///////////////////////")
              // console.log(data)
              if (data && data.code === 0) {
                //终端平台
                this.dataForm.id = data.mailContactor.id;
                this.dataForm.name = data.mailContactor.name;
                this.dataForm.officeTel = data.mailContactor.vofficeTel;
                this.dataForm.mobile1 = data.mailContactor.mobile1;
                this.dataForm.workUnit = data.mailContactor.workUnit;
                this.dataForm.position = data.mailContactor.position;
                this.dataForm.home_tel = data.mailContactor.home_tel;
                this.dataForm.officeTel = data.mailContactor.officeTel;
                this.dataForm.age = data.mailContactor.age;
                this.dataForm.mobile2 = data.mailContactor.mobile2;
                this.dataForm.emai = data.mailContactor.emai;
                this.menuListTreeSetCurrentNode()

              }else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      },
        // 菜单树选中
      menuListTreeCurrentChangeHandle (data, node) {
        this.dataForm.parentId = data.id
        this.dataForm.parentName = data.name
      },

      // 菜单树设置当前选中节点
      menuListTreeSetCurrentNode () {
        this.$refs.menuListTree.setCurrentKey(this.menuList.id)
        this.menuList.name = (this.$refs.menuListTree.getCurrentNode() || {})['name']
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/mail/mailcontactor/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'name': this.ruleForm.name || undefined,
                'officeTel': this.ruleForm.officeTel,
                'mobile1': this.ruleForm.mobile1,
                'position': this.ruleForm.position,
                'workUnit': this.ruleForm.workUnit,
                'mobile2': this.ruleForm.mobile2,
                'home_tel': this.ruleForm. home_tel,
                'emai': this.ruleForm.emai,
                'fax' : this.ruleForm.fax || null,
                'value' : this.ruleForm.value,
               })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }


</script>

<style lang="scss">
  .mod-menu {
    .menu-list__input,
    .icon-list__input {
      > .el-input__inner {
        cursor: pointer;
      }
    }
    &__icon-popover {
      width: 458px;
      overflow: hidden;
    }
    &__icon-inner {
      width: 478px;
      max-height: 258px;
      overflow-x: hidden;
      overflow-y: auto;
    }
    &__icon-list {
      width: 458px;
      padding: 0;
      margin: -8px 0 0 -8px;
      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }
    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
</style>
