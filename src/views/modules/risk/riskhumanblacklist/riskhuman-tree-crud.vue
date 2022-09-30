<template>
  <el-dialog title="新增分组" :close-on-click-modal="false" :visible.sync="visible">
    <el-container>
      <el-header style="height:120px">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
          <el-form-item label="请选择分组" prop="eventTypeParentName" v-if="type===2">
            <el-dialog title="请选择要新增到的分组节点" :visible.sync="newgroups" width="30%" append-to-body>
              <el-tree
                :data="eventTypeList"
                :props="eventTypeListTreeProps"
                node-key="id"
                ref="eventTypeTree"
                @current-change="eventTypeListTreeCurrentChangeHandle"
                :default-expand-all="true"
                :auto-expand-parent="true"
                :highlight-current="true"
                :expand-on-click-node="false"
              ></el-tree>
              <span slot="footer" class="dialog-footer">
                <el-button @click="newgroups = false" plain size="small">取 消</el-button>
                <el-button type="primary" @click="newgroups = false" size="small">确 定</el-button>
              </span>
            </el-dialog>
            <el-input v-model="dataForm.eventTypeParentName" @focus="gettingfocus" v-popover:eventTypeListPopover placeholder="选择分组" :readonly="true"></el-input>
            <el-input v-show="false" v-model="dataForm.parentId" :readonly="true"></el-input>
          </el-form-item>

          <el-form-item label="分组名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="请填写分组名称" v-bind:readonly="type===1"></el-input>
          </el-form-item>
          <!-- <el-form-item label="分组类型">
            <el-select v-model="dataForm.type" placeholder="请选择">
              <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="分组描述">
            <el-input v-model="dataForm.gmtCreate" v-bind:readonly="type===1"></el-input>
          </el-form-item>
        </el-form>
      </el-header>
      <el-footer class="foor">
        <el-button @click="visible = false" plain size="small">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()" size="small">确定</el-button>
      </el-footer>
    </el-container>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
export default {
  data () {
    return {
      // 分组弹出的开关
      typeData: [
        {
          id: 0,
          name: '部门'
        },
        {
          id: 1,
          name: '义工'
        }
      ],
      newgroups: false,
      visible: false,
      type: 0,
      dataForm: {
        id: 0,
        parentId: '',
        name: '',
        platformId: '',
        createUserId: '',
        gmtCreate: '',
        groupingdescription: '',
        modifiedUserId: '',
        gmtModified: '',
        isDeleted: '',
        eventTypeParentId: '',
        eventTypeParentName: '',
        type: 0,
        ancestors:''
      },
      eventTypeList: [], // 树的数据
      eventTypeListTreeProps: {
        label: 'name',
        children: 'children'
      },
      dataRule: {
        eventTypeParentName: [
          { required: true, message: '请选择一个分组', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '分组名称不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2到10字左右', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    init (id, currenTreeObject, type) {
      this.dataForm.id = id || 0
      this.visible = true
      this.type = type
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        /* if (type === 2) {
            this.$http({
              url: this.$http.adornUrl('/mail/mailgroup/list'),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.eventTypeParentName=''
              // data.data.splice(0,0, {id:0,name: '顶级分组节点'})
              this.eventTypeList = treeDataTranslate(data.data, 'id')
              console.log(data.data)
              // console.log(this.eventTypeList)
            }).then(() => {
              this.visible = true
            }).then(() => {
              // 新增
              this.dataForm.name=''
              this.dataForm.gmtCreate=''
              this.eventTypeListTreeSetCurrentNode()
            })
          } */
      })
    },
    // 当选择分组获取到焦点是才触发,并把顶级分组节点插入到树形中
    gettingfocus (event) {
      this.newgroups = true
      this.$http({
        url: this.$http.adornUrl('/risk/riskHumanBlacklistGroup/tree'),
        method: 'get',
        params: this.$http.adornParams()
      })
        .then(({ data }) => {
          
          this.eventTypeParentName = ''
          data.tree.splice(0, 0, { id: 0, name: '顶级分组节点',ancestors:'0'})
          // this.eventTypeList = treeDataTranslate(data.tree, 'id')
          this.eventTypeList =  data.tree
        })
        .then(() => {
          this.visible = true
        })
        .then(() => {
          // 新增
          this.dataForm.name = ''
          this.dataForm.gmtCreate = ''
          this.eventTypeListTreeSetCurrentNode()
        })
    },
    // 分组树设置当前选中节点
    eventTypeListTreeSetCurrentNode () {
      this.$refs.eventTypeTree.setCurrentKey(this.dataForm.id)
      this.dataForm.eventTypeParentName = (this.$refs.eventTypeTree.getCurrentNode() ||
        {})['name']
    },
    // 分组树选中
    eventTypeListTreeCurrentChangeHandle (data, node) {
      // console.log("data, node",data, node)
      this.dataForm.parentId = data.id
      this.dataForm.eventTypeParentId = data.id
      this.dataForm.eventTypeParentName = data.name
      if(data.id===0){
        this.dataForm.ancestors=data.ancestors
      } else{
        this.dataForm.ancestors=data.ancestors+','+data.id
      }
      
    },

    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid && (this.type === 2 || this.type === 3)) {
          this.$http({
            url: this.$http.adornUrl(
              `/risk/riskHumanBlacklistGroup/${this.type === 2 ? 'save' : 'update'}`
            ),
            method: 'post',
            data: this.$http.adornData({
              id: this.dataForm.id || undefined,
              parentId: this.dataForm.parentId,
              name: this.dataForm.name,
              remark: this.dataForm.gmtCreate,
              orderNum: '1',
              ancestors:this.dataForm.ancestors
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
              this.$emit('close')
            } else {
              this.$message.error('请选择你要新增到的分组节点')
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.foor {
  margin-top: 100px;
  color: #333;
  text-align: center;
  line-height: 60px;
}
</style>
