<template>
  <div class="treeAdd">
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="type">
            <el-radio v-for="(type, index) in dataForm.typeList" :label="index" :key="index">{{ type }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="dataForm.typeList[type] + '名称'" prop="name">
          <el-input v-model="dataForm.name" :placeholder="dataForm.typeList[type] + '名称'"></el-input>
        </el-form-item>

        <el-form-item label="所属类型" prop="controlTypeId">
          <el-cascader clearable :show-all-levels="false" ref="cascade" placeholder="点击选择所属类型" :props="props" v-model="dataForm.TypeId" :options="menuList" @change="handelChangeType" change-on-select></el-cascader>
        </el-form-item>
        <!-- table 显示不同输入框根据 type 来判断  目前只有 0: 管控类型 1:管控等级-->
        <el-form-item label="关注程度" prop="typeId">
          <el-radio-group v-model="dataForm.concern">
            <el-radio label="0" value="0">不关注</el-radio>
            <el-radio label="1" value="1">重点关注</el-radio>
          </el-radio-group>
          <!-- <el-input v-model="dataForm.url" placeholder="关注程度"></el-input> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { treeDataTranslate } from '@/utils'
import Icon from '@/icons'
export default {
  data () {
    var validateUrl = (rule, value, callback) => {
      if (this.type === 1 && !/\S/.test(value)) {
        callback(new Error('菜单URL不能为空'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      props: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      typeData: [
        { value: 0, label: '普通关注' },
        { value: 1, label: '重点关注' }
      ],
      type: 0, // 0 : 管控类型 1 : 管控等级F
      dataForm: {
        id: 0,
        typeList: ['管控类型', '管控等级'],
        TypeId: '',
        deviceTypeId: '1', // 1 人脸 2 车辆  写死
        controlTypeId: '', // 新增等级时 父级类型id
        name: '', // 名称
        concern: '0', // 0:普通关注 1:重点关注
        parentName: '', // 父级name
        parentId: '' // 新增类型时 父级类型id
      },
      dataRule: {
        name: [{ required: true, message: '名称不能为空' }],
        parentName: [{ required: true, message: '上级类型不能为空' }],
        url: [{ validator: validateUrl, trigger: 'blur' }]
      },
      menuList: [
        {
          id: '0',
          name: '顶级',
          disabled: false,
          children: ''
        }
      ]
    }
  },
  computed: {},
  watch: {
    type (val) {
      if (val === 1) {
        this.menuList[0]['disabled'] = true
        // 动态清空级联选择器数据
        let obj = {}
        obj.stopPropagation = () => {}
        this.$refs.cascade.handleClear(obj)
        this.dataForm.typeId = ''
      } else {
        this.menuList[0]['disabled'] = false
      }
    }
  },
  created () {
    this.iconList = Icon.getNameList()
  },
  methods: {
    // 树形选择后
    handelChangeType (val) {
      if (!this.type) {
        this.dataForm.parentId = val[val.length - 1]
      } else {
        this.dataForm.controlTypeId = val[val.length - 1]
      }
    },
    // 获取管控类型 树形
    init (id) {
      this.dataForm.id = id || 0
      this.$http({
        url: this.$http.adornUrl('/risk/riskcontroltype/tree'),
        method: 'get',
        params: this.$http.adornParams({
          deviceTypeId: '1'
        })
      })
        .then(({ data }) => {
          // console.log(data)
          if (data && data.code === 0) {
            // console.log(data.data.length)

            if (data.data.length) {
              data.data.forEach(item => {
                this.menuList.push(item)
              })
              // console.log(this.menuList)
            }
          }
          this.visible = true
        })
        .then(() => {
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        })
        .then(() => {
          if (this.dataForm.id) {
            // 修改
            this.$http({
              url: this.$http.adornUrl(`/sys/menu/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({ data }) => {
              if (data && data.code == 0) {
                this.dataForm.name = data.name
                this.dataForm.parentId = data.parentId
                this.dataForm.concern = data.concern
              }
            })
          }
        })
    },
    // 菜单树选中
    // menuListTreeCurrentChangeHandle (data, node) {
    //   this.dataForm.parentId = data.menuId
    //   this.dataForm.parentName = data.name
    // },
    // // 菜单树设置当前选中节点
    // menuListTreeSetCurrentNode () {
    //   this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
    //   this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() ||
    //     {})['name']
    // },
    // // 图标选中
    // iconActiveHandle (iconName) {
    //   this.dataForm.icon = iconName
    // },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              // this.type 0 类型 1 等级
              `${
                !this.type ? '/risk/riskcontroltype' : '/risk/riskControlLevel'
              }/${!this.dataForm.id ? 'save' : 'update'}`
            ),
            method: 'post',
            data: this.$http.adornData({
              deviceTypeId: this.dataForm.deviceTypeId,
              controlTypeId: this.dataForm.controlTypeId,
              name: this.dataForm.name, // 名称
              concern: this.dataForm.concern, // 关注程度
              parentId: this.dataForm.parentId
            })
          }).then(({ data }) => {
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
.el-cascader-menu__wrap {
  height: 215px;
}
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
