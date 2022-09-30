<template>
  <div>
    aaaaaaaa
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/sys/reserveplan/reserveplan' }">预案管理</el-breadcrumb-item>
      <el-breadcrumb-item>预案新增</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row :gutter="20"><p class="thetitle">新增预案</p></el-row>
    <el-row :gutter="20">
      <el-col :span="7">
        <form-one @addPlan="addPlan" @updatePlan="updatePlan"  :dataFormId="dataFormId"></form-one>
      </el-col>
      <el-col :span="17">
        <form-two @savePolicResponse="savePolicResponse"></form-two>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {treeDataTranslate} from '@/utils'
  import Icon from '@/icons'
  import form1 from './form1'
  import form2 from './form2'

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
        //步骤条的绑定
        active: 0,

        //步骤数
        elsteps: [{
          title: '版本信息'
        }, {
          title: '预警响应'
        }, {
          title: '预案完成'
        }],

        dataFormId: 1,
        dataForm1: {
          id: '',//id
          planName: '',//预案名称
          version: '',//预案版本
          eventTypeId: '',//事件类型id
          eventType: '',//事件类型
          state: '',//启动状态
          editUnit: '',//编制单位
          publishUnit: '',//发布单位
          publishDate: '',//发布日期
          remark: '',//备注
          enclosure: '',//附件
          response: []
        },


        rpList: [],//预案列表

        levelList:[],//等级列表
      }
    },
    components: {
      'form-one': form1,
      'form-two': form2
    },
    created () {
      this.clearSession()
    },
    methods: {
      clearSession () {
        let planId = sessionStorage.getItem('planId')
        if (planId != null) {
          sessionStorage.removeItem('planId')
          // console.log('清除planId')
        }
      },
      //添加响应等级
      savePolicResponse (data) {
        //警情响应
        const policResponse={
            planId: '',//预案id
            responseName:'',//等级名称
            responseLevel: '',//响应等级
            responseLevelName: '',//响应等级名称
            responseDuration: '',//响应时长
            generalEventDuration: '',//一般事件响应时长
            complexEventDuration: '',//复杂事件响应时长
          }//警情响应

        policResponse.planId = data.planId
        policResponse.responseName=data.responseName
        policResponse.responseLevel = data.responseLevel
        policResponse.responseLevelName = data.responseLevelName
        policResponse.responseDuration = data.responseDuration
        policResponse.generalEventDuration = data.generalEventDuration
        policResponse.complexEventDuration = data.complexEventDuration

        // console.log("===========",this.rpList)
        //根据id查找 ,返回下标
        let indexaaa = this.rpList.findIndex((item, index, list) => {
          return item.id == data.planId
        })
        if (indexaaa != -1) {
          this.rpList[indexaaa].response.push(this.policResponse)
          this.levelList.push(policResponse)
          this.$store.commit('user/updateLevelList', this.levelList)
        }

        // console.log("添加警情响应",this.rpList)

      },

      //保存预案信息
      addPlan (data) {
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

        this.rpList.push(this.dataForm1)
        this.$store.commit('user/updateRpList', this.rpList)
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
        // console.log('rpList', this.rpList)

      },

      //修改预案信息
      updatePlan (data) {
        // alert('updatePlan')
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

        //根据id查找 ，已经存在，就删除再添加
        let indexIndex = this.rpList.findIndex((item, index, list) => {
          return item.id === data.id
        })

        // alert("index="+indexIndex)

        if (indexIndex != -1) {
          this.rpList.splice(indexIndex, 1, this.dataForm1)
        }

        this.$store.commit('user/updateRpList', this.rpList)
        this.$message({
          message: '修改成功！',
          type: 'success'
        })
        // console.log('修改rpList', this.rpList)
      },


      //步骤条的下一步
      next () {
        if (this.active++ > 2) this.active = 0
      },

      //格式化时间
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
        var currentDate = date.getFullYear() + '-' + month + '-' + strDate
          + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
        return currentDate
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

  .thetitle {
    text-align: center;
    font-size: 24px;
    margin: 15px auto;
    color: #000;
  }

</style>
