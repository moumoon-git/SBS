<template>
  <div id="center">
    <div style="width: 100%;margin: 0px auto;">
      <!--<p class="thetitle">预案版本信息管理</p>-->
      <el-form label-width="100px" :rules="dataRules" :model="dataForm" ref="ruleForm">
        <el-form-item label="预案名称:" style="width: 65%;margin: 0 auto;margin-bottom: 20px;" prop="planName">
          <el-input v-model="dataForm.planName" class="input" :disabled="disabled"></el-input>
        </el-form-item>
        <div style="width: 65%;margin: 0 auto;margin-bottom: 20px;">
          <el-form-item label="预案版本:" style="width: 45%;margin: 0 auto; margin-bottom: 20px;display: inline-block;" prop="version" :value="dataForm.version">
            <el-input v-model="dataForm.version"></el-input>
          </el-form-item>
          <el-form-item label="版本内容:" style="width: 45%;margin: 0 auto; margin-bottom: 20px;display: inline-block;float:right">
            <el-input v-model="dataForm.content"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="事件类型:" style="width: 65%;margin: 0 auto; margin-bottom: 20px;" prop="eventTypeName" required>
          <el-input v-model="dataForm.eventTypeName" @focus="handleOpenEvent" :readonly="true"></el-input>
        </el-form-item>
        <div style="width: 65%;margin: 0 auto;">
          <!--  prop="serviceName" required  -->
          <!-- <el-form-item label="服务对象:" style="width: 45%;margin: 0 auto; margin-bottom: 20px;display: inline-block;" class="member">
            <el-input size="mini" class="right-input" v-model="dataForm.serviceName" disabled></el-input>
          </el-form-item>-->
          <!-- <el-button type="primary" size="mini" @click="handleService">选择服务对象</el-button> -->
        </div>

        <!-- <el-form-item label="启用状态:" style="width: 65%;margin: 0 auto;margin-bottom: 20px;" prop="state">
          <el-radio-group v-model="dataForm.state">
            <el-radio label="1" value="1">是</el-radio>
            <el-radio label="0" value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>-->
        <!-- <el-form-item label="编制单位:" style="width: 65%;margin: 0 auto; margin-bottom: 20px;" prop="editUnit">
          <el-input v-model="dataForm.editUnit"></el-input>
        </el-form-item> -->
        <div style="width: 65%;margin: 0 auto;margin-bottom: 20px;">
          <el-form-item label="发布单位:" style="width: 40%;margin: 0 auto; margin-bottom: 20px;display: inline-block;" prop="publishUnit">
            <el-input v-model="dataForm.publishUnit"></el-input>
          </el-form-item>
          <el-form-item label="发布时间:" style="width:45% ; margin-bottom: 20px;display: inline-block;float:right" prop="publishDate">
            <el-date-picker v-model="dataForm.publishDate" unlink-panels type="date" placeholder="选择日期" value-format="yyyy-MM-dd" default-value style="width: 100%;"></el-date-picker>
          </el-form-item>
        </div>

        <div style="width: 65%;margin: 0 auto;margin-bottom: 20px;">
          <el-form-item label="有效时间:" style="width: 45%;margin: 0 auto; margin-bottom: 20px;display: inline-block;" prop="validTime">
            <el-time-picker @change="validTimeMethod" value-format="yyyy-MM-dd HH:mm:ss"
              is-range
              v-model="dataForm.validTime"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
            </el-time-picker>
          </el-form-item>

          <el-form-item label="间隔时间(分钟):" id="intervalTime" style="width: 45%;margin: 0 auto; margin-bottom: 20px;display: inline-block;float:right;" prop="intervalTime">
            <el-input-number v-model="dataForm.intervalTime"  :min="0" :max="300" label="描述文字"></el-input-number>
          </el-form-item>
        </div>
        

        


        <!-- <el-form-item label="备注:" style="width: 65%;margin: 0 auto; margin-bottom: 20px;">
          <el-input type="textarea" v-model="dataForm.remark"></el-input>
        </el-form-item> -->

        <el-form-item label="附件:" style="width: 65%;margin: 0 auto; margin-bottom: 100px;">
          <el-upload
            action
            :file-list="fileList"
            :http-request="uploadSectionFile"
            :limit="1"
            :on-exceed="handleExceed"
            accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-change="handleChange"
          >
            <el-button size="small" style="width:88px;height:32px;" class="el-icon-upload2">点击上传</el-button>

            <el-button @click="handleHTTPfile" size="small" type="success" v-if="lookFile">点击查看附件</el-button>
            <div slot="tip" class="el-upload__tip" style="display: inline-block;margin-left:10px;">只能上传pdf,doc格式的文件</div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div style="text-align: center; clear:">
        <el-button type="primary" @click="submitForm('ruleForm')" size="small">保存</el-button>
      </div>
      <GroupSelect v-if="showCommonSet" ref="commonSet" @onSubmit="handleOnSubmit"></GroupSelect>
    </div>
  </div>
</template>

<script>
import GroupSelect from '@/views/common/groupselect'
import { getRules } from '@/utils/rules'
export default {
  components: {
    GroupSelect
  },
  props: [
    'eltreeId',
    'eltreelable',
    'queryid',
    'planname',
    'editionid',
    'dataFormId',
    'dataForm1'
  ],
  name: 'organization',
  data () {
    return {
      
      lookFile: false,
      status: '',
      showCommonSet: false, // 事件类型弹窗
      dataRules: [],
      dataForm: {
        planId: 0,
        id: 0,
        eventTypeId: '', // 类型id
        eventTypeFlag: '', // 类型标志 1 事件 2 隐患 3 黑名单 4 黑车 5 工单
        eventTypeName: '', // 事件类型名称
        planName: '', // 预案名称
        editUnit: '', // 编制单位
        publishUnit: '', // 发布单位
        publishDate: '', // 发布日期
        content: '', // 版本内容
        enclosure: '', // 附件路径
        fileName: '', // 附件名称
        state: '0', // 启动状态  默认为0
        version: '', // 预案版本
        // 启动状态的验证  判断是否有一个被选中了
        remark: '', // 备注
        rpServiceObjectEntity: {
          // planId: '',
          serviceObjectId: '', // 服务对象id
          serviceObjectType: '', // 服务类型id
          serviceName: '', // 服务对象
          serviceContact: '', // 联系方式
          serviceObjectAddress: '', // 对象地址
          serviceContent: '' // 服务内容
        },
        intervalTime:1,//间隔时间
        validTime:[this.dateFormatter(new Date()),this.dateFormatter(new Date())] //起始时间
      },

      show: false,
      File: '',

      fileList: [],
      filePath: '', // 文件路径
      filesize: '', // 文件大小
      filename: '', // 上传文件名称
      
      
      
      name: '',
      
      preplanId: '', // 预案ID
      disabled: false,
    
    }
  },
  created () {
    // this.obtain()
    // this.dataForm.state=
    this.dataRules = getRules()
    if (this.$route.query.status === 3) {
      this.handlePlanlist()
    }
    // console.log('versionversion', this.dataForm.version)
  },
  mounted(){
    document.querySelector('#intervalTime>label').setAttribute("style","width: initial!important;")
  },
  computed: {
    rpList: {
      get () {
        return this.$store.state.user.rpList
      }
    }
  },
  activated () {
    this.status = this.$route.query.status
    if (this.status == 1) {
    } else if (this.status == 2) {
      this.lookFile = false
      for (let prop in this.dataForm) {
        this.dataForm[prop] = ''
      }
      // 测试
      let planForm = this.$cookie.get('planForm')
      if (planForm != null) {
        planForm = JSON.parse(planForm)
        this.dataForm = planForm
      } else {
        this.dataForm.version = '1.0'
        this.dataForm.publishDate = new Date()
      }
      this.$store.commit('user/updateLevelListdel')
      // this.dataForm.state = '0'
    } else if (this.status == 3) {
      this.lookFile = true
      this.handleHTTPuit()
      // this.dataForm.state = this.$route.query.data.state + ''
      if (this.dataForm.fileName) {
        this.fileList.push({
          name: this.dataForm.fileName,
          url: this.dataForm.enclosure
        })
      }
    }
  },
  methods: {
    dateFormatter(str){//默认返回yyyy-MM-dd HH-mm-ss
      var hasTime = arguments[1] != false ? true : false;//可传第二个参数false，返回yyyy-MM-dd
      var d = new Date(str);
      var year = d.getFullYear();
      var month = (d.getMonth()+1)<10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1);
      var day = d.getDate()<10 ? '0'+d.getDate() : d.getDate();
      var hour = d.getHours()<10 ? '0'+d.getHours() : d.getHours();
      var minute = d.getMinutes()<10 ? '0'+d.getMinutes() : d.getMinutes();
      var second = d.getSeconds()<10 ? '0'+d.getSeconds() : d.getSeconds();
      if(hasTime){
        return [year, month, day].join('-') + " " + [hour, minute, second].join(':');
      }else{
        return [year, month, day].join('-');
      }
    },
    validTimeMethod(){
      // console.log('this.validTime',this.dataForm.validTime)
      
    },
    //  修改时获取预案数据
    handlePlanlist () {
      this.dataForm.planId = this.$route.query.data.id
      this.$http({
        url: this.$http.adornUrl(
          `/rp/plan/listById/${this.$route.query.data.id}`
        ),
        method: 'get',
        params: this.$http.adornParams({})
      }).then(({ data }) => {
        if (data && data.code === 0) {
            this.dataForm = { ...data.rpPlan }

            // console.log('修改时获取预案数据',this.dataForm.validTime,data.rpPlan.startTime,data.rpPlan.endTime)
            // this.dataForm.validTime=[data.rpPlan.startTime,data.rpPlan.endTime]
            
            this.$set(this.dataForm,'validTime',[data.rpPlan.startTime,data.rpPlan.endTime])
        } else {
          this.$message.error(data.msg)
        }
       
      
       
      })
    },
    // 查看word 文档
    handleHTTPfile () {
      let id = {
        planId: this.$route.query.data.id,
        filePath: this.$route.query.data.enclosure,
        fileName: this.$route.query.data.fileName
      }
      let baseUrl = window.SITE_CONFIG.baseUrl
      let url =
        baseUrl +
        '/rp/plan/viewPlanFile?planId=' +
        id.planId +
        '&filePath=' +
        id.filePath +
        '&fileName=' +
        id.fileName +
        '&' +
        document.cookie
      window.open(url)
    },
    // 附件列表
    handleChange (file, fileList) {
      this.fileList = fileList
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleRemove (file, fileList) {
      this.dataForm.enclosure = ''
      this.dataForm.fileName = ''
    },
    handleExceed () {
      this.$message.error('只能上传一个附件')
      return false
    },
    // 自定义文件上传行为
    uploadSectionFile (param) {
      let form = new FormData()
      form.append('file', param.file)
      this.$http({
        url: this.$http.adornUrl(`/rp/plan/upload`),
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: form
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm.enclosure = data.filePath
            this.dataForm.fileName = data.fileName
            } else {
              this.$message.error(data.msg)
            }
        })
        .catch(err => {})
    },
    // 获取事件类型数据
    handleHTTPuit () {
      this.$http({
        url: this.$http.adornUrl(`/event/eventType/list`),
        method: 'get',
        param: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          let event = []
          this.handlefor(data.data, this.dataForm.eventTypeId, event)
          this.dataForm.eventName = event[0].name
        } else {
          this.$message.error(data.msg)
        }
      })
    },

    // 遍历树形 获取相应的数据
    // jsonData 数据
    // destID 目标id
    // json 目标数据
    handlefor (jsonData, destID, json) {
      for (var i = 0; i < jsonData.length; i++) {
        if (jsonData[i].id == destID) {
          json.push(jsonData[i])
        } else {
          if (
            jsonData[i].hasOwnProperty('children') &&
            jsonData[i].children !== null
          ) {
            this.handlefor(jsonData[i].children, destID, json)
          }
        }
      }
    },
    // 事件类型
    handleOpenEvent () {
      this.showCommonSet = true
      this.$nextTick(() => {
        this.$refs.commonSet.init(`/event/eventType/list`, '请选择事件类型')
      })
    },
    handleOnSubmit (obj) {
      // 选择事件类型后
      this.dataForm.eventTypeName = obj.name // 事件名称
      this.dataForm.eventTypeId = obj.id // 事件id
      this.dataForm.eventTypeFlag = obj.typeFlag // 类型标志id
    },
    // 表单验证
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.add()
        } else {
          return false
        }
      })
    },
    // 添加预案信息
    // valid 为 true 时 执行添加逻辑
    add () {
      // 判断本地是否有planId 如果有则为修改
      let planId = this.dataForm.id
     
      this.dataForm.startTime=this.dataForm.validTime[0]
      this.dataForm.endTime=this.dataForm.validTime[1]
      if (planId) {
        this.$http({
          url: this.$http.adornUrl(`/rp/plan/update`),
          method: 'post',
          data: this.$http.adornData({...this.dataForm})
        }).then(({ data }) => {
          // this.$emit('updatePlan', this.dataForm)
          this.handelRoute(this.$route.query.status, 1, this.dataForm.id, this.dataForm.eventTypeFlag, this.dataForm.eventTypeId)
        })
      } else {
        // this.dataForm.id = ++max_id
        // 新增接口
        // console.log('startTime,endTime,intervalTime',this.dataForm.validTime[0],this.dataForm.validTime[1],this.dataForm.intervalTime)
        this.$http({
          url: this.$http.adornUrl('/rp/plan/save'),
          method: 'post',
          data: this.$http.adornData({
            eventTypeId: this.dataForm.eventTypeId,
            eventTypeFlag: this.dataForm.eventTypeFlag,
            eventTypeName: this.dataForm.eventTypeName,
            version: this.dataForm.version,
            remark: this.dataForm.remark,
            planName: this.dataForm.planName,
            editUnit: this.dataForm.editUnit,
            publishUnit: this.dataForm.publishUnit,
            publishDate: this.dataForm.publishDate,
            content: this.dataForm.content,
            enclosure: this.dataForm.enclosure,
            fileName: this.dataForm.fileName,
            state: this.dataForm.state,
            startTime:this.dataForm.validTime[0],
            endTime:this.dataForm.validTime[1],
            intervalTime:this.dataForm.intervalTime
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
              this.$emit('addPlan', this.dataForm)
              this.preplanId = data.rpPlanId
              this.handelRoute(this.$route.query.status, 1, data.rpPlanId, data.typeFlag, this.dataForm.eventTypeId)
          } else {
            this.$message.error(data.msg)
          }

        })
      }
    },
    // 保存成功跳转页面
    handelRoute (status, grade, rpPlanId, rpTypeFlag, eventTypeId) {
      this.$router.push({
        path: '/reserveplan-add-or-updata',
        name: 'reserveplan-add-or-updata',
        query: {
          status: status,
          grade: grade,
          rpPlanId: rpPlanId,
          rpTypeFlag: rpTypeFlag,
          eventTypeId: eventTypeId
        }
      })
    },
    handleUploadSuccess (response) {
      // 上传成功函数
      if (response.msg === 'SUCCESS') {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        this.filePath = response.data.filePath
        this.filesize = response.data.size
      } else {
        this.$message.error(response.msg)
        this.filename = ''
      }
    }
  }
}
</script>

<style scoped>
.nav li {
  float: left;
}

li {
  list-style: none;
}

#center h1 {
  text-align: center;
  line-height: 50px;
}

.el-scrollbar__wrap {
  overflow-x: hidden;
}

.thetitle {
  text-align: center;
  font-size: 24px;
  margin: 15px auto;
  color: #000;
}

.view .p2 {
  text-align: center;
}
.el-date-editor .el-range-separator{
  padding: 0px 0px;
}
#intervalTime.el-form-item.is-required.el-form-item--medium{
  width: 43%!important; 
}

</style>
