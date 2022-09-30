<template >
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/sys/reserveplan/reserveplan' }"
        >预案管理</el-breadcrumb-item
      >
      <el-breadcrumb-item v-if="status == 1">预案查看</el-breadcrumb-item>
      <el-breadcrumb-item v-if="status == 2">预案新增</el-breadcrumb-item>
      <el-breadcrumb-item v-if="status == 3">预案修改</el-breadcrumb-item>
      <el-breadcrumb-item v-if="grade == 1">等级制定</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row :gutter="20">
      <p class="thetitle" v-if="status == 2">新增预案</p>
      <p class="thetitle" v-if="status == 3">修改预案</p>
    </el-row>
    <el-row
      :gutter="20"
      v-loading="pictLoading"
      element-loading-background="rgba(0, 0, 0, 0.3)"
      element-loading-text="正在加载中"
    >
      <!-- <add-form-one
        v-if="(grade == 0 && status == 2) || (grade == 0 && status == 3)"
        @addPlan="addPlan"
        @updatePlan="updatePlan"
        :dataFormId="dataFormId"
        :dataForm1="dataForm1"
      ></add-form-one> -->
      <add-form-tow
        v-if="status !== 1 && grade == 1||(grade == 0 && status == 2) || (grade == 0 && status == 3)"
        @savePolicResponse="savePolicResponse"
      >
      </add-form-tow>
      <!-- <el-col :span="7">
        <form-one
          v-if="status !== 1"
          @addPlan="addPlan"
          @updatePlan="updatePlan"
          :dataFormId="dataFormId"
          :dataForm1="dataForm1"
        ></form-one>
      </el-col>
      <el-col :span="17">
        <form-two
          v-if="status !== 1"
          @savePolicResponse="savePolicResponse"
        ></form-two>
      </el-col> -->
      <div v-if="status === 1">
        <el-button
          type="primary"
          style="margin-top:20px;"
          @click="handleHTTPfile"
          v-if="loockFile"
          size="small"
          >查看附件</el-button
        >
        <div style="width:800px;margin:0 auto">
          <pdf
            v-for="item in numPages"
            :key="item"
            :page="item"
            :src="src"
            style="display:block;width:680px;"
          ></pdf>
          <div style="height:1000px" v-if="pictLoading"></div>
        </div>
      </div>
    </el-row>

    <!--
        <div style="text-align: center;margin-top: 20px;">
          <el-button type="primary" style="padding: 12px 20px;">保存预案</el-button>
        </div>
    -->
  </div>
</template>

<script>
import { treeDataTranslate } from '@/utils'
import Icon from '@/icons'
import addForm1 from './add-form1'
import addForm2 from './add-form2'
// import form1 from './form1'
// import form2 from './form2'
import pdf from 'vue-pdf'
import { log } from 'util'
export default {
  data () {
    var validateUrl = (rule, value, callback) => {
      if (this.dataForm.type === 1 && !/\S/.test(value)) {
        callback(new Error('菜单URL不能为空'))
      } else {
        callback()
      }
    }
    return {
      loockFile: true, // 判断查看附件是否显示
      pictLoading: false,
      src: '',
      numPages: '',
      // 步骤条的绑定
      active: 0,
      status: '', // 1代表查看，2代表新增，3代表修改
      grade: '', // 0代表隐藏 1代表显示
      // 步骤数
      elsteps: [
        {
          title: '版本信息'
        },
        {
          title: '预警响应'
        },
        {
          title: '预案完成'
        }
      ],

      dataFormId: 1,
      dataForm1: {
        rpPlanId: '', // 预案id
        planName: '', // 预案名称
        version: '', // 预案版本
        eventTypeId: '', // 事件类型id
        eventType: '', // 事件类型
        state: '', // 启动状态
        editUnit: '', // 编制单位
        publishUnit: '', // 发布单位
        publishDate: '', // 发布日期
        remark: '', // 备注
        enclosure: '', // 附件
        response: []
      },

      rpList: [], // 预案列表

      levelList: [] // 等级列表
    }
  },
  components: {
    // 'form-one': form1,
    // 'form-two': form2,
    'add-form-one': addForm1,
    'add-form-tow': addForm2,
    pdf: pdf
  },
  created () {
    this.clearSession()
    this.status = this.$route.query.status
    this.grade = this.$route.query.grade
  },
  watch: {
    $route (to, from) {
      this.clearSession()
      this.status = this.$route.query.status
      this.grade = this.$route.query.grade
    }
  },
  mounted () {
    if (this.status === 1) {
      this.pictLoading = true

      this.pdfdata()
      if (!this.$route.query.data.fileName) {
        this.loockFile = false
      }
    }
    if (this.status === 2) {
      // statue 等于 2 的时候清空data中数据
      for (let prop in this.dataForm1) {
        this.dataForm1[prop] = ''
      }
    }
  },
  methods: {
    // 添加响应等级 add-form2返回的数据
    savePolicResponse (data) {
      // console.log(data, 'form2返回回来的数据--------------')
      switch (data.name) {
        case 'dataForm':
          this.$store.commit('user/updateLevelList', data.obj)
          break
        case 'dataStaff':
          this.$store.commit('user/updatastaffList', data.obj)
          break
        case 'Reference':
          this.$store.commit('user/updataReferenceList', data.obj)
          break
      }
    },
    // 查看word 文档(查看附件)
    handleHTTPfile () {
      let id = {
        planId: this.$route.query.data.id,
        filePath: this.$route.query.data.enclosure,
        fileName: this.$route.query.data.fileName,
        token: document.cookie
      }
      // console.log(id)
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
      // this.$http({
      //   url:this.$http.adornUrl(`/rp/plan/viewPlanFile`),
      //   method:"post",
      //   params:this.$http.adornParams({...id})
      // }).then(({data})=>{
      //   console.log(data);
      // })
      window.open(url)
    },
    // 页面开始加载的时候就获取
    // 显示pdf
    pdfdata () {
      let id = {
        planId: this.$route.query.data.id
      }
      // console.log(document.cookie)
      let baseUrl = window.SITE_CONFIG.baseUrl
      let url =
        baseUrl + '/rp/plan/view?planId=' + id.planId + '&' + document.cookie
      this.src = pdf.createLoadingTask(url)
      // window.open(url)
      this.src.then(pdf => {
        this.numPages = pdf.numPages
        this.pictLoading = false
      })
    },
    clearSession () {
      let planId = sessionStorage.getItem('planId')
      if (planId != null) {
        sessionStorage.removeItem('planId')
        this.$store.commit('user/updataFormtwodelete', [])
      }
    },

    // 保存预案信息
    addPlan (data) {
      Object.assign(this.dataForm1, data)
      this.rpList.push(this.dataForm1)
      this.$store.commit('user/updateRpList', this.rpList)
      this.$message({
        message: '保存成功！',
        type: 'success'
      })
    },

    // 修改预案信息
    updatePlan (data) {
      this.dataForm1.id = data.id
      this.dataForm1.planName = data.planName
      this.dataForm1.version = data.version
      this.dataForm1.eventTypeId = data.eventTypeId
      this.dataForm1.eventType = data.eventType
      this.dataForm1.state = data.state
      this.dataForm1.editUnit = data.editUnit
      this.dataForm1.publishUnit = data.publishUnit
      this.dataForm1.publishDate = data.publishDate
      this.dataForm1.remark = data.remark
      this.dataForm1.enclosure = data.enclosure

      // 根据id查找 ，已经存在，就删除再添加
      let indexIndex = this.rpList.findIndex((item, index, list) => {
        return item.id === data.id
      })
      if (indexIndex != -1) {
        this.rpList.splice(indexIndex, 1, this.dataForm1)
      }

      this.$store.commit('user/updateRpList', this.rpList)
      this.$message({
        message: '修改成功！',
        type: 'success'
      })
    },

    // 格式化时间
    getFormatDate () {
      var date = new Date()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentDate =
        date.getFullYear() +
        '-' +
        month +
        '-' +
        strDate +
        ' ' +
        date.getHours() +
        ':' +
        date.getMinutes() +
        ':' +
        date.getSeconds()
      return currentDate
    }
  }
}
</script>

<style lang="scss" scoped>
.site-content {
  width: 800px;
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

.thetitle {
  text-align: center;
  font-size: 24px;
  margin: 15px auto;
  color: #000;
}
</style>
