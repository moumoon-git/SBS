<template>
  <el-dialog
    title="审批"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="700px"
  >

    <!--事件详情表单-->
    <el-form ref="eventHistoryDetailForm" :model="eventHistoryDetailForm" label-width="80px">

      <el-form-item label="关联人员" readonly="true"
                    v-if="eventHistoryDetailForm.mailContactorName != null && eventHistoryDetailForm.mailContactorName != ''">
        <el-input v-model="eventHistoryDetailForm.mailContactorName" :readonly="true"></el-input>
      </el-form-item>

      <el-form-item label="关联人员" readonly="true"
                    v-if="eventHistoryDetailForm.mailContactorName == null || eventHistoryDetailForm.mailContactorName == ''">
        <el-input value="暂无关联人员" :readonly="true"></el-input>
      </el-form-item>

      <el-form-item label="联系方式" readonly="true"
                    v-if="eventHistoryDetailForm.mailContactorMobile != null && eventHistoryDetailForm.mailContactorMobile != ''">
        <el-input v-model="eventHistoryDetailForm.mailContactorMobile" :readonly="true"></el-input>
      </el-form-item>

      <el-form-item label="联系方式" readonly="true"
                    v-if="eventHistoryDetailForm.mailContactorMobile == null || eventHistoryDetailForm.mailContactorMobile == ''">
        <el-input value="暂无联系电话" :readonly="true"></el-input>
      </el-form-item>


      <el-form-item label="工单内容" readonly="true">
        <el-input v-model="eventHistoryDetailForm.content" :readonly="true"></el-input>
      </el-form-item>


      <!--处置描述-->
      <el-form-item label="审批描述" >
        <el-input  type="textarea" :rows="3" v-model="verifyDescribe"></el-input>
      </el-form-item>

      <el-form-item label="审批标志">
        <el-radio-group size="small"  v-model="eventHistoryDetailForm.examineFlag">
          <el-radio :label="1">同意</el-radio>
          <el-radio :label="2">驳回</el-radio>
        </el-radio-group>
      </el-form-item>


      <!--<el-form-item label="审批方式">
        <el-select v-model="eventHistoryDetailForm.smsSendType" placeholder="请选择">
          <el-option
            v-for="item in reportMethodData"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>-->

    </el-form>


    <!--取消与确认按钮-->
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" plain>取消</el-button>
      <el-button type="primary" @click="eventHistoryDetailFormSubmit()" size="small">确定</el-button>
    </span>


  </el-dialog>

</template>

<script>



  export default {

    data() {
      return {
        visible: false,
        //联系人弹窗
        popoverVisible: false,

        //表格详情数据
        eventHistoryDetailForm: {
          "title": '', //标题
          "platformId": '', // 平台id
          "dataSourceId": '', //数据来源id,可能来自工单表infoId
          "flagType": '', //标志
          "surveyFlag": 0,  //调查问卷
          "eventStatusAfter": '', //状态
          "examineFlag": '', //审核标志
          "content": '', // 审核描述
          "mailContactorName": '',
          "mailContactorMobile": '',

        },


        //核实描述或者是处置描述
        verifyDescribe: "",
      }
    },
    methods: {

      init(row) {
        // console.log("examination  row::::",row)
        //设置弹窗可见
        this.visible = true

        //初始化数据
        this.eventHistoryDetailForm.dataSourceId = row.id;
        this.eventHistoryDetailForm.flagType = row.flagType;

        //创建人的openId
        //this.eventHistoryDetailForm.openId = row.openId;
        this.eventHistoryDetailForm.title = row.title;
        this.eventHistoryDetailForm.mailContactorName = row.reportName;
        //this.eventHistoryDetailForm.mailGroupName = row.reportUnit;
        this.eventHistoryDetailForm.mailContactorMobile = row.reportContactorMobile;
        this.eventHistoryDetailForm.content = row.eventDescription;

        this.eventHistoryDetailForm.platformId = row.platformId;
        this.eventHistoryDetailForm.eventStatusAfter = row.status;
        //this.eventHistoryDetailForm.openId = row.openId;
      },


      //提交审批
      eventHistoryDetailFormSubmit() {

        this.$refs['eventHistoryDetailForm'].validate((valid) => {
          if (valid) {

            if(this.eventHistoryDetailForm.examineFlag == '2'){
              //驳回
              this.eventHistoryDetailForm.eventStatusAfter = 3;
            }


            this.$http({
              url: this.$http.adornUrl(`/weChatHandleTaskPC/examination`),
              method: 'post',
              data: this.$http.adornData({
                title: this.eventHistoryDetailForm.title,
                dataSourceId: this.eventHistoryDetailForm.dataSourceId,
                flagType: this.eventHistoryDetailForm.flagType,
                platformId: this.eventHistoryDetailForm.platformId,
                eventStatusAfter: this.eventHistoryDetailForm.eventStatusAfter,
                examineFlag: this.eventHistoryDetailForm.examineFlag,
                content: this.verifyDescribe,

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
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })

      },

    }
  }

</script>

<style lang="scss">

</style>
