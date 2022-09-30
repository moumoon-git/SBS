<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="物资类型" prop="eventTypeParentName">
      <!-- <el-input v-model="dataForm.parentId" placeholder="父子id"></el-input> -->
      <el-dialog
        title="请选择要新增到的分组节点"
        :visible.sync="treeDialogVisible"
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
          <el-button @click="treeDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="treeDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-input v-model="dataForm.eventTypeParentName" @focus="gettingfocus" v-popover:eventTypeListPopover   placeholder="选择分组" :readonly="true" ></el-input>
      <el-input v-show="false" v-model="dataForm.parentId"   :readonly="true"></el-input>
    </el-form-item>
    <el-form-item label="类型名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="类型名称"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>

  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        eventTypeList: [],
        eventTypeListTreeProps: {
          label: 'name',
          children: 'children'
        },
        treeDialogVisible:false,
        visible: false,
        dataForm: {
          id: 0,
          parentId: '',
          name: '',
          platformId: '',
          createUserId: '',
          gmtCreate: '',
          modifiedUserId: '',
          gmtModified: '',
          isDeleted: '',
          eventTypeParentName:''
        },
        dataRule: {
          eventTypeParentName: [
            {required: true, message: '请选择一个分组', trigger: 'blur'}
          ],
          parentId: [
            { required: true, message: '父子id不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '类型名称不能为空', trigger: 'blur' }
          ],
          platformId: [
            { required: true, message: '终端用户id不能为空', trigger: 'blur' }
          ],
          createUserId: [
            { required: true, message: '创建者id不能为空', trigger: 'blur' }
          ],
          gmtCreate: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          modifiedUserId: [
            { required: true, message: '修改者Id不能为空', trigger: 'blur' }
          ],
          gmtModified: [
            { required: true, message: '修改时间不能为空', trigger: 'blur' }
          ],
          isDeleted: [
            { required: true, message: '删除 0：未删除  1：已删除不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
    },
    methods: {
      // 分组树选中
      eventTypeListTreeCurrentChangeHandle (data, node) {
        this.dataForm.parentId = data.id
        this.dataForm.eventTypeParentId = data.id
        this.dataForm.eventTypeParentName = data.name
      },
      //当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
      gettingfocus(event){
        this.treeDialogVisible=true
        this.$http({
          url: this.$http.adornUrl('/resoure/resourearticletype/tree'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.eventTypeParentName=''
            data.tree.splice(0,0, {id:0,name: '顶级分组节点'})
            this.eventTypeList = treeDataTranslate(data.tree, 'id')
          } else {
            this.$message.error("请选择你要新增到的分组节点")
          }
        }).then(() => {
          this.visible = true
        }).then(() => {
          // 新增
          this.dataForm.name=''
          this.dataForm.gmtCreate=''
          this.eventTypeListTreeSetCurrentNode()
        })
      },
      //分组树设置当前选中节点
      eventTypeListTreeSetCurrentNode () {
        this.$refs.eventTypeTree.setCurrentKey(this.dataForm.id)
        this.dataForm.eventTypeParentName = (this.$refs.eventTypeTree.getCurrentNode() || {})['name']
      },
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/resoure/resourearticletype/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              // console.log('data',data)
              if (data && data.code === 0) {
                this.dataForm.eventTypeParentName = data.resoureArticleType.parentId
                this.dataForm.parentId = data.resoureArticleType.parentId
                this.dataForm.name = data.resoureArticleType.name
                this.dataForm.platformId = data.resoureArticleType.platformId
                this.dataForm.createUserId = data.resoureArticleType.createUserId
                this.dataForm.gmtCreate = data.resoureArticleType.gmtCreate
                this.dataForm.modifiedUserId = data.resoureArticleType.modifiedUserId
                this.dataForm.gmtModified = data.resoureArticleType.gmtModified
                this.dataForm.isDeleted = data.resoureArticleType.isDeleted
              } else {
                this.$message.error("请选择你要新增到的分组节点")
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/resoure/resourearticletype/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'parentId': this.dataForm.parentId,
                'name': this.dataForm.name,
                // 'platformId': this.dataForm.platformId,
                // 'createUserId': this.dataForm.createUserId,
                // 'gmtCreate': this.dataForm.gmtCreate,
                // 'modifiedUserId': this.dataForm.modifiedUserId,
                // 'gmtModified': this.dataForm.gmtModified,
                // 'isDeleted': this.dataForm.isDeleted
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
                    this.$emit('close')
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
