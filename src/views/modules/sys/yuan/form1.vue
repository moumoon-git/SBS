<template>
  <div id="center">
    <div style="width: 440px;margin: 0px auto;">
      <!--<p class="thetitle">预案版本信息管理</p>-->
      <el-form label-width="100px" :rules="dataRules" :model="dataForm">
        <el-form-item label="预案名称:" style="width: 400px;margin: 0 auto;margin-bottom: 20px;" prop="planName">
          <el-input v-model="dataForm.planName" class="input" :disabled='disabled' ></el-input>
        </el-form-item>
        <el-form-item label="预案版本:" style="width: 400px;margin: 0 auto; margin-bottom: 20px;" required>
          <el-input v-model="dataForm.version"></el-input>
        </el-form-item>
        <el-form-item label="事件类型:" style="width: 400px;margin: 0 auto; margin-bottom: 20px;">
          <el-input v-model="dataForm.eventType" readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="启用状态:" prop="resource" style="width: 400px;margin: 0 auto; margin-bottom: 20px;">
          <el-radio-group v-model="dataForm.state">
            <el-radio label="是" value="1"></el-radio>
            <el-radio label="否" value="0"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="编制单位:" style="width: 400px;margin: 0 auto; margin-bottom: 20px;">
          <el-input v-model="dataForm.editUnit"></el-input>
        </el-form-item>
        <el-form-item label="发布单位:" style="width: 400px;margin: 0 auto; margin-bottom: 20px;">
          <el-input v-model="dataForm.publishUnit"></el-input>
        </el-form-item>
        <el-form-item label="发布时间:" style="width: 400px;margin: 0 auto; margin-bottom: 20px;">
          <el-date-picker unlink-panels v-model="dataForm.publishDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                          style="width: 300px;">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注:" style="width: 400px;margin: 0 auto; margin-bottom: 20px;">
          <el-input v-model="dataForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="附件:" style="width: 400px;margin: 0 auto; margin-bottom: 20px;">
          <el-input v-model="dataForm.enclosure"></el-input>
        </el-form-item>
      </el-form>

      <div style="text-align: center; clear: both;">
        <el-button type="primary" @click="add">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {getRules} from '@/utils/rules'

  export default {
    props: ['eltreeId', 'eltreelable', 'queryid', 'planname', 'editionid', 'dataFormId'],
    name: 'organization',
    data () {
      return {
        dataRules:[],
        dataForm: {
          id: '',//id
          planName: '',//预案名称
          version: '',//预案版本
          eventTypeId: '',//事件类型id
          eventType: '',//事件类型
          state: 1,//启动状态
          editUnit: '',//编制单位
          publishUnit: '',//发布单位
          publishDate: '',//发布日期
          remark: '',//备注
          enclosure: ''//附件
        },

        show: false,
        fileList: [],
        filePath: '', //文件路径
        filesize: '', //文件大小
        filename: '', //上传文件名称
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        queryids: this.queryid, //路由传过来的预案ID
        active: 1,
        name: '',
        edition: '',
        //state: '',
        code: '',
        company: '',
        release: '',
        region: '',
        value1: new Date(),
        value2: new Date(),
        remarks: '',
        versionId: '', //预案版本ID
        preplanId: '', //预案ID
        disabled: false,
        root: ''
      }
    },
    created () {
      //this.obtain()
      // this.dataForm.state=

      this.dataRules=getRules();

    },
    computed: {
      rpList: {
        get () {
          return this.$store.state.user.rpList
        },
      },
    },
    methods: {
      //添加预案信息
      add () {
        // console.log('========vjhvbhjvhjvbhjvbhjbhbjkb2222222222222222',this.rules)

        //如果是再次点击保存
        let planId = sessionStorage.getItem('planId')
        if (planId!=null) {
          // alert('updatePlan')
          this.$emit('updatePlan', this.dataForm)

        } else {
          // console.log('rpList=====', this.rpList)
          const id = []
          for (let a of this.rpList.values()) {
            // console.log(a) //结果：1,2,234,sdf,-2 遍历了数组arr的值
            id.push(a.id)
          }
          if (id.length < 1) {
            max_id = 0
          } else {
            var max_id = Math.max(...id)//最大值
          }
          this.dataForm.id = ++max_id

          sessionStorage.setItem('planId', this.dataForm.id)
          // alert('addPlan')
          //bus.$emit("sendPlanId",this.dataForm.id)
          this.$emit('addPlan', this.dataForm)

        }

      },

      //获取预案版本信息
      handleChange (file, fileList) {
        this.filename = file.name
      },
      handleUploadSuccess (response) {//上传成功函数
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

      },
      onerror () {//上传失败函数
        this.$message({
          message: '未知错误，请重新上传！',
          type: 'warning'
        })
      },
      handleUpload () {
        if (this.filePath) {
          let data = {
            versionId: this.versionId,
            filePath: this.filePath,
            size: this.filesize,
            type: 'prepalnVersion',
            relationId: this.versionId
          }
          getList('/emergency/preparation/preplan/setVersionDocData', data).then(res => {
            if (res) {
              this.importPreplan()
              this.$emit('geteditor')
              this.$emit('refreshList')
            }
          })
        } else {
          this.$emit('geteditor')
          this.$emit('refreshList')
        }
      },
      importPreplan () {
        let data = {
          versionId: this.versionId
        }
        getList('/emergency/preparation/preplan/importPreplan', data).then(res => {
          if (res) {
          }
        })
      },
      obtain () {
        let condition = localStorage.getItem('AddpreplanId') //从本地存储获取预案ID和预案版本ID
        if (condition) {
          this.queryids = JSON.parse(condition).preplanId //获取预案ID
        }
        if (this.editionid) {
          this.name = this.planname
          this.disabled = true
        }
        if (this.queryids) {
          let data = {
            'id': this.queryids //预案ID
          }
          getList('/emergency/preparation/preplan/getPreplanInfo', data).then(res => {
            if (res) {
              this.name = res.name //预案名称
              this.edition = res.version //版本号
              this.code = res.code //编码
              this.company = res.builder //编制单位
              this.release = res.publishUnit //发布单位
              this.value1 = res.publishDate //发布时间
              this.region = res.area //适用区域
              this.remarks = res.remark
              this.versionId = res.versionId
              this.preplanId = res.preplanId
              // this.filename = res.attach.name+res.attach.extension;
            }
          })
        }
      },
      next () {
        /*if(this.name === '') {
          this.$message({
            message: '预案名称不能为空',
            type: 'warning'
          });
         // return;
        }
        if(this.edition === '') {
          this.$message({
            message: '预案版本不能为空',
            type: 'warning'
          });
         // return;
        }*/

        //判断是新增还是修改

        if (this.preplanId) { //修改
          let data = {
            preplanId: this.preplanId, //预案ID
            versionId: this.versionId, //预案版本ID
            name: this.name, //预案名称
            version: this.edition, //版本号
            code: this.code, //编码
            builder: this.company, //编制单位
            publishUnit: this.release, //发布单位
            publishDate: this.value2, //发布时间
            area: this.region, //适用区域
            remark: this.remarks, //备注

          }
          let test = {
            data: data
          }
          getList('/emergency/preparation/preplan/updatePreplanInfo', test).then(res => {
            if (res) {
              this.versionId = res.versionId
              let preplanId = {
                preplanId: res.preplanId, // 新增的预案ID
                versionId: res.versionId //新增的预案版本ID
              }
              let AddpreplanId = JSON.stringify(preplanId)
              localStorage.setItem('AddpreplanId', AddpreplanId) //建立新增预案本地存储
              this.handleUpload()
              this.$message({
                message: '修改预案成功',
                type: 'success'
              })
            }
          })
        } else if (this.editionid) {
          let data = {
            id: this.editionid, //预案ID
            version: this.edition, //版本号
            code: this.code, //编码
            builder: this.company, //编制单位
            publishUnit: this.release, //发布单位
            publishDate: this.value1, //发布时间
            area: this.region, //适用区域
            remark: this.remarks, //备注
          }
          let test = {
            data: data
          }
          getList('/emergency/preparation/preplan/add', test).then(res => {
            if (res) {
              this.versionId = res.versionId
              let preplanId = {
                preplanId: res.preplanId, // 新增的预案ID
                versionId: res.versionId //新增的预案版本ID
              }
              let AddpreplanId = JSON.stringify(preplanId)
              localStorage.setItem('AddpreplanId', AddpreplanId) //建立新增预案本地存储
              if (this.filePath == '') {
                this.initCatalog() //调用初始化预案文本目录。在第七步获取目录，没有这一步获取不了目录树
              }

              this.handleUpload()
              this.$message({
                message: '新增版本成功',
                type: 'success'
              })

            }
          })
        } else { //新增
          let data = {
            name: this.name, //预案名称
            version: this.edition, //版本号
            classId: this.eltreeId, //应急类别ID
            code: this.code, //编码
            builder: this.company, //编制单位
            publishUnit: this.release, //发布单位
            publishDate: this.value1, //发布时间
            area: this.region, //适用区域
            remark: this.remarks, //备注

          }
          let test = {
            data: data
          }
          getList('/emergency/preparation/preplan/add', test).then(res => {
            if (res) {
              this.versionId = res.versionId
              let preplanId = {
                preplanId: res.preplanId, // 新增的预案ID
                versionId: res.versionId //新增的预案版本ID
              }
              let AddpreplanId = JSON.stringify(preplanId)
              localStorage.setItem('AddpreplanId', AddpreplanId) //建立新增预案本地存储
              this.initCatalog() //调用初始化预案文本目录。在第七步获取目录，没有这一步获取不了目录树
              this.handleUpload()
              this.$message({
                message: '新增预案成功',
                type: 'success'
              })

            }
          })
        }

      },
      initCatalog () {
        let condition = localStorage.getItem('AddpreplanId') //从本地存储获取预案ID和预案版本ID
        this.versionId = JSON.parse(condition).versionId //获取预
        let data = {
          versionId: this.versionId
        }
        getList('/emergency/preparation/preplan/initCatalog', data).then(res => {
          if (res) {
          }
        })
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
</style>
