<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" @close="message=''">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="值班时间" prop="time">
        <!-- <el-input v-model="dataForm.time" placeholder="值班时间"></el-input> -->

        <el-date-picker v-model="dataForm.time" unlink-panels type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </el-form-item>
      <el-form-item label="来电/文记录" class="inp" >
        <el-input
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 4}"
          placeholder="来电/文记录"
          v-model="dataForm.telegram">
        </el-input>
        <el-select @change="electricity" v-model="electricitys" prop="telegram" placeholder="请选择电话记录" >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.label">
          </el-option>
        </el-select>
        <el-select @change="writing" v-model="writings" prop="note" placeholder="请选择短信记录">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="办理情况">
        <el-select  v-model="dataForm.writingsInfo" value="已完成" prop="writingsInfo" >
          <el-option
            v-for="item in writingsInfoData"
            :key="item.value"
            :label="item.label"
            :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="简要情况" prop="brief">
        <el-input v-model="dataForm.brief" placeholder="简要情况"></el-input>
      </el-form-item>
      <el-form-item label="办理意见" prop="manage">
        <el-input v-model="dataForm.manage" placeholder="办理意见"></el-input>
      </el-form-item>
      <el-form-item label="领导批示" prop="instruction">
        <el-input v-model="dataForm.instruction" placeholder="领导批示"></el-input>
      </el-form-item>
      <el-form-item label="办理人" prop="instruction">
        <el-input v-model="dataForm.transact" placeholder="办理人"></el-input>
      </el-form-item>
      <!-- <el-form-item label="日志id" prop="dutyId">
      <el-input v-model="dataForm.dutyId" placeholder="日志id"></el-input>
    </el-form-item>
    <el-form-item label="删除 0：未删除  1：已删除" prop="isDeleted">
      <el-input v-model="dataForm.isDeleted" placeholder="删除 0：未删除  1：已删除"></el-input>
    </el-form-item>
    <el-form-item label="创建者id" prop="createUserId">
      <el-input v-model="dataForm.createUserId" placeholder="创建者id"></el-input>
    </el-form-item>
    <el-form-item label="创建时间" prop="gmtCreate">
      <el-input v-model="dataForm.gmtCreate" placeholder="创建时间"></el-input>
    </el-form-item>
    <el-form-item label="修改者Id" prop="modifiedUserId">
      <el-input v-model="dataForm.modifiedUserId" placeholder="修改者Id"></el-input>
    </el-form-item>
    <el-form-item label="修改时间" prop="gmtModified">
      <el-input v-model="dataForm.gmtModified" placeholder="修改时间"></el-input>
    </el-form-item>
    <el-form-item label="平台id" prop="platformId">
      <el-input v-model="dataForm.platformId" placeholder="平台id"></el-input>
      </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer" v-if="message!='watch'&&message!='xg'&&message!='update'">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" size="small">确定</el-button>
    </span>
    <span slot="footer" class="dialog-footer" v-if="message=='xg'">
      <el-button type="primary" @click="dispose" size="small">处置</el-button>
    </span>
    <span slot="footer" class="dialog-footer" v-if="message=='update'">
     <el-button type="primary" @click="xg" size="small">修改</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import Bus from '@/utils/bus'
  import Cookies from 'js-cookie'
export default {
  data () {
    return {
      options: [
        // {
        //   value: '选项1',
        //   label: '黄金糕'
        // }
      ],
      options2: [],
      writingsInfoData: [
        {
          value: '已完成',
          label: '已完成'
        },
        {
          value: '待办',
          label: '待办'
        },
        {
          value: '处理中',
          label: '处理中'
        }
      ],
      value: '',
      message: '',
      visible: false,
      recordType: 0,
      dataForm: {
        id: 0,
        time: '',
        record: '',
        instruction: '',
        dutyId: '',
        isDeleted: '',
        createUserId: '',
        gmtCreate: '',
        modifiedUserId: '',
        gmtModified: '',
        telegram: '',
        brief: '',
        manage: '',
        platformId: '',
        note: '',
        writingsInfo: '已完成',
        transact: ''
      },
      dataRule: {
        time: [{ required: true, message: '值班时间不能为空' }],
        telegram: [{ required: true, message: '来电/文不能为空' }],
        note: [{ required: true, message: '短信不能为空' }],
        brief: [{ required: true, message: '简要情况不能为空' }],
        manage: [{ required: true, message: '办理意见不能为空' }],
        record: [
          { required: true, message: '值班记录不能为空', trigger: 'blur' }
        ],
        instruction: [
          { required: true, message: '领导批示不能为空', trigger: 'blur' }
        ],
        dutyId: [
          { required: true, message: '日志id不能为空', trigger: 'blur' }
        ],
        isDeleted: [
          {
            required: true,
            message: '删除 0：未删除  1：已删除不能为空',
            trigger: 'blur'
          }
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
        platformId: [
          { required: true, message: '平台id不能为空', trigger: 'blur' }
        ]
      },
      electricitys: '',
      writings: '',
      writingsInfo: '已完成',
      startTimes: '',
      endTimesx: '',
      dutyLogOperationsId: '',
      transact: '',
      xgData: '',
      dutyLogId: '',
      eventData: ''
    }
  },
  methods: {
    init (obj, message) {
      // this.dataForm.id = id || 0
      // console.log(obj)
      if (obj.dutyLogId) {
        this.dutyLogId = obj.dutyLogId
      }
      this.eventData = obj
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        // if (this.dataForm.id) {
        //   this.$http({
        //     url: this.$http.adornUrl(`/duty/dutylogoperations/info/${this.dataForm.id}`),
        //     method: 'get',
        //     params: this.$http.adornParams()
        //   }).then(({data}) => {
        //     if (data && data.code === 0) {
        //       this.dataForm.time = data.dutylogoperations.time
        //       this.dataForm.record = data.dutylogoperations.record
        //       this.dataForm.instruction = data.dutylogoperations.instruction
        //       this.dataForm.dutyId = data.dutylogoperations.dutyId
        //       this.dataForm.isDeleted = data.dutylogoperations.isDeleted
        //       this.dataForm.createUserId = data.dutylogoperations.createUserId
        //       this.dataForm.gmtCreate = data.dutylogoperations.gmtCreate
        //       this.dataForm.modifiedUserId = data.dutylogoperations.modifiedUserId
        //       this.dataForm.gmtModified = data.dutylogoperations.gmtModified
        //       this.dataForm.platformId = data.dutylogoperations.platformId
        //     }
        //   })
        // }
        if (obj) {
          // console.log('dataForm', obj, this.message, message)
          this.startTimes = obj.startTime
          this.endTimesx = obj.endTime
          this.dataForm.time = obj.time
          this.dataForm.instruction = obj.instruction
          this.dataForm.manage = obj.manage
          this.dataForm.brief = obj.brief
          this.dataForm.telegram = obj.record
          this.dataForm.index = obj.index
          this.dataForm.note = obj.note
          this.dataForm.writingsInfo = obj.writingsInfo ? obj.writingsInfo : '已完成'
          this.dataForm.transact = obj.transact
        }
        if (message) {
          this.message = message
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // this.$http({
          //   url: this.$http.adornUrl(`/duty/dutylogoperations/${!this.dataForm.id ? 'save' : 'update'}`),
          //   method: 'post',
          //   data: this.$http.adornData({
          //     'id': this.dataForm.id || undefined,
          //     'time': this.dataForm.time,
          //     'record': this.dataForm.record,
          //     'instruction': this.dataForm.instruction,
          //     'dutyId': this.dataForm.dutyId,
          //     'isDeleted': this.dataForm.isDeleted,
          //     'createUserId': this.dataForm.createUserId,
          //     'gmtCreate': this.dataForm.gmtCreate,
          //     'modifiedUserId': this.dataForm.modifiedUserId,
          //     'gmtModified': this.dataForm.gmtModified,
          //     'platformId': this.dataForm.platformId
          //   })
          // }).then(({data}) => {
          //   if (data && data.code === 0) {
          //     this.$message({
          //       message: '操作成功',
          //       type: 'success',
          //       duration: 1500,
          //       onClose: () => {
          //         this.visible = false
          //         this.$emit('refreshDataList')
          //       }
          //     })
          //   } else {
          //     this.$message.error(data.msg)
          //   }
          // })
          this.$emit(
            'refresh',
            {
              time: this.dataForm.time,
              record: this.dataForm.telegram,
              telegram: this.dataForm.telegram,
              instruction: this.dataForm.instruction,
              index: this.dataForm.index,
              brief: this.dataForm.brief,
              manage: this.dataForm.manage,
              note: this.dataForm.note,
              writingsInfo: this.dataForm.writingsInfo,
              transact: this.dataForm.transact
            },
            this.message
          )
          // console.log('aaa', {
          //   time: this.dataForm.time,
          //   record: this.dataForm.telegram,
          //   instruction: this.dataForm.instruction,
          //   telegram: this.dataForm.telegram,
          //   brief: this.dataForm.brief,
          //   manage: this.dataForm.manage,
          //   note: this.dataForm.note,
          //   writingsInfo: this.dataForm.writingsInfo,
          //   transact: this.dataForm.transact
          // })
          this.visible = false
        }
      })
      var writingsInfos = ''
      if (this.dataForm.writingsInfo == '已完成') {
        writingsInfos = 0
      } else if (this.dataForm.writingsInfo == '待办') {
        writingsInfos = 1
      } else {
        writingsInfos = 2
      }
      // dutyLogId
      var dutyLogOperationsId = localStorage.dutyLogId ? localStorage.dutyLogId : ''
      this.dutyLogOperationsId = dutyLogOperationsId
      var dutyLogOperations = {
        dutyLogId: dutyLogOperationsId,
        startTime: this.startTimes,
        endTime: this.endTimesx,
        record: this.dataForm.telegram, // 来文
        recordType: this.recordType, //
        remark: this.dataForm.brief, // 简要情况
        handleOpnion: this.dataForm.manage, // 办理意见
        instruction: this.dataForm.instruction, // 领导意见
        handleStatus: writingsInfos, // 办理状态
        operatorId: '', // 办理人id
        operatorName: this.dataForm.transact, // 办理人名称
        createTime: this.dataForm.time, // 创建时间
        updateTime: '', // 更新时间
        isDeleted: '', // 数据状态
        platformId: Cookies.get('platformId') // 平台ID
      }
      this.$http({
        url: this.$http.adornUrl(`/duty/dutyLogOperations/save`),
        method: 'POST',
        data: this.$http.adornData(dutyLogOperations)
      }).then(({ data }) => {
        Bus.$emit('dqzb', '')
        if (data && data.code === 0) {
            // console.log(data)
            localStorage.dutyLogId = data.dutyLogOperations.dutyLogId
        } else {
          this.$message.error(data.msg)
        }
       
      })
    },
    electricity () {
      this.dataForm.telegram = this.electricitys
      this.recordType = 1
    },
    writing () {
      this.dataForm.telegram = this.writings
      this.recordType = 2
    },
    dispose () {
      // 修改上一班次留下的事项
      var disposedata = {
        dutyLogId: String(this.xgData.dutyLogId),
        startTime: this.xgData.startTime,
        endTime: this.xgData.endTime,
        handleOpinion: this.dataForm.manage, // 办理意见
        instruction: this.dataForm.instruction, // 领导意见
        dutyLogOperationsId: String(this.xgData.id)
      }
      this.$http({
        url: this.$http.adornUrl(`/duty/dutyLogOperationsHistory/handleHistory`),
        method: 'POST',
        data: this.$http.adornData(disposedata)
      }).then(({ data }) => {
        // console.log(data)
        this.visible = false
        Bus.$emit('jbxx', '')
      })
    },
    getPhone () {
      this.$http({
        url: this.$http.adornUrl(`/duty/dutyLogPhone/todayPhoneList`),
        method: 'POST',
        data: this.$http.adornData({})
      }).then(({ data }) => {
        if (data && data.code === 0) {
            //  console.log(data)
            this.options = data.phoneInfoList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    getMsg () {
      this.$http({
        url: this.$http.adornUrl(`/duty/dutyLogMessage/todayMessageList`),
        method: 'POST',
        data: this.$http.adornData({})
      }).then(({ data }) => {
        if (data && data.code === 0) {
              // console.log(data)
              data.messageInforHistoryList.forEach(function (ele,ind) {
                ele.label = ele.content
                ele.value = ele.id
              })
              this.options2 = data.messageInforHistoryList
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    xg () {
    //  修改
      var writingsInfos = ''
      if (this.dataForm.writingsInfo == '已完成') {
        writingsInfos = 0
      } else if (this.dataForm.writingsInfo == '待办') {
        writingsInfos = 1
      } else {
        writingsInfos = 2
      }
      var dutyLogOperations = this.eventData
        dutyLogOperations.dutyLogId = this.dutyLogId,
        dutyLogOperations.startTime = this.startTimes,
        dutyLogOperations.endTime = this.endTimesx,
        dutyLogOperations.record = this.dataForm.telegram, // 值班记录
        dutyLogOperations.recordType = this.recordType, //
        dutyLogOperations.remark = this.dataForm.brief, // 简要情况
        dutyLogOperations.handleOpnion = this.dataForm.manage, // 办理意见
        dutyLogOperations.instruction = this.dataForm.instruction, // 领导意见
        dutyLogOperations.handleStatus = writingsInfos, // 办理状态
        dutyLogOperations.operatorId = '', // 办理人id
        dutyLogOperations.operatorName = this.dataForm.transact, // 办理人名称
        dutyLogOperations.createTime = this.dataForm.time, // 创建时间
        dutyLogOperations.updateTime = '', // 更新时间
        dutyLogOperations.isDeleted = '', // 数据状态
        dutyLogOperations.platformId = Cookies.get('platformId') // 平台ID
      this.$http({
        url: this.$http.adornUrl(`/duty/dutyLogOperations/update`),
        method: 'POST',
        data: this.$http.adornData(dutyLogOperations)
      }).then(({ data }) => {
        // console.log(data)
        this.visible = false
        Bus.$emit('beg', '')
      })
    }
  },
  mounted () {
    this.getPhone()
    this.getMsg()
    Bus.$off('dutylogoperationsAddOrUpdate')
    Bus.$on('dutylogoperationsAddOrUpdate', (deta) => {
      this.init(deta.obj, deta.message)
    })
    Bus.$off('delayed')
    Bus.$on('delayed', (deta) => {
      this.init(deta, 'xg')
      // console.log(deta)
      this.xgData = deta
    })
  }
}
</script>
<style lang="less" scoped>
.inp /deep/ .el-form-item__label{
  width: 100px !important;
}
.inp>.el-form-item__content>input{
  outline: none;
  border: 1px solid #dcdfe6;
  padding: 0px 5px;
  border-radius: 3px;
}

</style>
