<template>
  <div>
    <el-dialog :title="
        type === 1
          ? '查看类型'
          : type === 2
          ? '新增类型'
          : '修改类型'
      " :close-on-click-modal="false" :visible.sync="visible">
      <el-form  :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
        <el-form-item v-if="type===1" label="所属类型" prop="parentName">
          <span @click="selectEventType">
            <el-input v-model="dataForm.parentName" placeholder="请选择所属类型" :readonly="true"></el-input>
          </span>
        </el-form-item>

        <el-form-item label="类型名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入类型名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
    <!--选择事件类型-->
    <GroupSelect v-if="showCommonSet" ref="commonSet" @onSubmit="onSubmit"></GroupSelect>
  </div>
</template>

<script>
import GroupSelect from '@/views/common/groupselect'
export default {
  components: {
    GroupSelect
  },
  data () {
    return {
      showCommonSet: false, // 选择弹窗
      visible: false,
      type: 0,
      dataForm: {
        id: 0,
        parentId: '',
        parentName: '',
        name: '',
        platformId: '',
        createUserId: '',
        isDeleted: '',
        typeFlag: ''
      },

      // 选择事件类型
      showSelectEventType: false,

      eventTypeList: [], // 树的数据
      eventTypeListTreeProps: {
        label: 'name',
        children: 'children'
      },
      dataRule: {
        parentName: [
          { required: true, message: '事件类型不能为空', trigger: 'change' }
        ],
        name: [
          { required: true, message: '事件名称不能为空', trigger: 'blur' }
        ],
        platformId: [
          { required: true, message: '终端用户id不能为空', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    // type 1 新增  2 修改
    init (currenTreeObject, type) {
      this.dataForm.id = currenTreeObject.id || 0
      this.visible = true
      this.type = type
      this.$nextTick(() => {
        // this.$refs['dataForm'].resetFields()
        // 查看
        // if (type === 1 && currenTreeObject != null) {
        //   this.dataForm.name = currenTreeObject.name
        // }
        // if (type === 2) {
        //   this.visible = true
        // }
        if (type === 1) {
          this.dataForm.id = 0
          this.dataForm.name = ''
          this.dataForm.parentId = ''
        }
        if (type === 2) {
          // console.log(currenTreeObject)
          this.dataForm.id = currenTreeObject.id
          this.dataForm.name = currenTreeObject.name
          this.dataForm.parentId = currenTreeObject.parentId
        }
      })
    },

    // 选择事件类型
    selectEventType () {
      this.showCommonSet = true
      this.$nextTick(() => {
        this.$refs.commonSet.init(`/event/eventType/list`, '请选择事件类型')
      })
    },
    // 选择事件类型后
    onSubmit (obj) {
      this.dataForm.parentId = obj.id
      this.dataForm.parentName = obj.name
      this.dataForm.typeFlag = obj.typeFlag
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(
              `/event/eventType/${this.dataForm.id === 0 ? 'save' : 'updateName'}`
            ),
            method: 'post',
            data: this.$http.adornData({
              id: this.dataForm.id || 0,
              parentId: this.dataForm.parentId,
              name: this.dataForm.name,
              typeFlag: this.dataForm.typeFlag
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              this.$emit('refreshDataList')
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
