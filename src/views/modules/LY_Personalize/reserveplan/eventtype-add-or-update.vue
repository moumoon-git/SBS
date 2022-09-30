<template>
  <div>
    <el-dialog :title="
        type === 1
          ? '查看事件类型'
          : type === 2
          ? '新增事件类型'
          : '修改事件类型'
      " :close-on-click-modal="false" :visible.sync="visible">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
        <el-form-item label="所属类型" prop="parentName" v-if="type === 2">
          <span @click="selectEventType">
            <el-input v-model="dataForm.parentName" placeholder="所属类型" :readonly="true"></el-input>
          </span>
        </el-form-item>

        <el-form-item label="事件类型" prop="name">
          <el-input v-model="dataForm.name" placeholder="事件类型" v-bind:readonly="type === 1"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="gmtCreate" v-if="type === 1">
          <el-input v-model="dataForm.gmtCreate" placeholder="创建时间" v-bind:readonly="type === 1"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false" plain size="small">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()" size="small">确定</el-button>
      </span>
    </el-dialog>
    <!--选择事件类型-->
    <GroupSelect v-if="showCommonSet" ref="commonSet" @onSubmit="onSubmit"></GroupSelect>
  </div>
</template>

<script>
import { treeDataTranslate } from '@/utils';
import CommonSet from './commonSet';
import GroupSelect from '@/views/common/groupselect';

export default {
  components: {
    CommonSet,
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
        gmtCreate: '',
        modifiedUserId: '',
        gmtModified: '',
        isDeleted: '',
        eventTypeParentId: '',
        eventTypeParentName: ''
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
    // type 1 查看  2新增   3修改
    init (id, currenTreeObject, type) {
      this.dataForm.id = id || 0
      this.visible = true
      this.type = type
      // console.log('type=', type === 1 ? '查看' : '新增修改')
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        // 查看
        if (type === 1 && currenTreeObject != null) {
          this.dataForm.name = currenTreeObject.name
          this.dataForm.gmtCreate = currenTreeObject.gmtCreate
        }
        if (type === 2) {
          this.visible = true
        }

        if (type === 3) {
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
      // console.log('选择事件类型后', obj)
      this.dataForm.parentId = obj.id
      this.dataForm.parentName = obj.name
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid && (this.type === 2 || this.type === 3)) {
          this.$http({
            url: this.$http.adornUrl(
              `/event/eventType/${this.type === 2 ? 'save' : 'update'}`
            ),
            method: 'post',
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              parentId: this.dataForm.parentId,
              name: this.dataForm.name
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              this.$emit('refreshEventTypeDataList')
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
