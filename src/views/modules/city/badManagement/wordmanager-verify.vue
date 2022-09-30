<template>
<div>
    <el-dialog
      :title="flag=='verify' ? '核实工单' : '派遣工单'"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="700px"
      :append-to-body="true"
    >

      <!--事件详情表单-->
      <el-form ref="eventDetailForm" :model="eventDetailForm" label-width="80px">


        <!--不存在关联预案-->
        <el-form-item label="关联预案">
          <el-input value="暂无关联预案"></el-input>
        </el-form-item>

        <!--如果预案中的核实人员为空-->
        <!--<el-form-item  v-if="verifyContactorList == '' && flag =='verify'" label="核实人员">
          <el-input
            @focus="handelVerify"
            class="right-input"
            v-model="dataStaff.verifyContactsShow"
            placeholder="从通讯录中选择"
          ></el-input>
        </el-form-item>-->
        <el-form-item label="派遣人员">
          <!-- <el-popover
            placement="right"
            width="450"
            height="250"
            trigger="click"
            popper-class='top'
            >
            <el-table :data="gridData" @row-click="rowClick" style="height:100%;overflow:auto;">
              <el-table-column width="100"  label="姓名"  property="name"></el-table-column>
              <el-table-column width="150"  label="电话" property="mobile1"></el-table-column>
              <el-table-column width="150"  label="微信标识" property="openId"></el-table-column>
            </el-table> -->

            

            <el-input  v-model="contactorName"
                      :readonly="true" placeholder="点击选择派遣人员"
                      @focus="contactViewHandle"
                       v-popover:eventTypeListPopover 
                      class="menu-list__input">

            </el-input>

          <!-- </el-popover> -->

        </el-form-item>


        <!--处置描述-->
        <el-form-item label="派遣描述">
          <el-input  type="textarea" :rows="2" v-model="verifyDescribe"></el-input>
        </el-form-item>


        <el-form-item label="派遣方式">
          <el-select v-model="eventDetailForm.smsSendType" placeholder="请选择">
            <el-option
              v-for="item in reportMethodData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>


      <!--取消与确认按钮-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false" plain size="small">取消</el-button>
        <el-button type="primary" @click="eventDetailFormSubmit()" size="small">确定</el-button>
      </span>

      <!-- 派遣人员视图 -->
      <linkman-draggable ref="commonLink" v-show="showcommonLink" @OnchildByValue="handelLinkdata"></linkman-draggable>
    </el-dialog>
</div>

</template>

<script>


  //const wayOptions = ['短信通知', '电话通知', '其他通知'];
  import LinkmanDraggable from '../../risk/riskvehiclealarm/LinkmanDraggable '
  export default {

    data() {
      return {
        visible: false,
        //联系人弹窗
        popoverVisible: false,
        //核实方式
        //verifyWays: wayOptions,
        //默认选中
        //checkedVerifyWays: ['短信通知'],

        //事件类型数据
        eventTypeList: [],

        eventTypeListTreeProps: {
          label: 'name',
          children: 'children'
        },

        //事件等级数据
        eventLevelData: [],

        //上报方式
        reportMethodData: [],

        //表格详情数据
        eventDetailForm: {
          id : '',
          statusFlag : '',
          title: '',
          dataSourceId: '',
          eventType: '',
          eventLevel: '',
          reportName: '',
          reportTime: '',
          eventPosition: '',

          audioUrl: '',
          imageUrl: '',
          videoUrl: '',
          eventDescription: '',
          latitude: '',
          longitude: '',
          openId: '',
          surveyFlag: 0,

          status: '',
          isClose: '',
          //预案id
          planId: '',
          //服务对象id
          serviceObjectId: '',
          //构造事件类型数据
          eventTypeId: '',
          eventTypeName: '',
          eventTypeParentId: '',
          eventTypeParentName: '',

          //上报方式
          smsSendType: 2,

          //核实人员姓名
          // contactorName: '',
          contactorOpenId: '',
          contactorMobile: '',
          contactorId: '',

          //类型
          intelligentType:'',

        },

        //核实或者处置的标志,verify为核实，disposal为处置
        flag:"",

        //核实描述或者是处置描述
        verifyDescribe: "",

        //没有预案时，从通讯录选择联系人员
        gridData: [],
        showcommonLink: false, // 派遣联系人试图

        contactorName: '', //派遣人员
        selectContact: [], // 选中联系人
      }
    },
    components:{
      LinkmanDraggable,
    },
    methods: {

      init(row,managerFlag) {
        // console.log("verify  row::::",row)
        //设置弹窗可见
        this.visible = true
        //设置是核实或者处置
        this.flag = managerFlag

        //获取传来的数据ID
        this.eventDetailForm.id = row.id || 0
        this.eventDetailForm.imageUrl = row.picUrl || ''
        this.eventDetailForm.latitude = row.latitude || ''
        this.eventDetailForm.longitude = row.longitude || ''
        this.eventDetailForm.intelligentType = row.intelligentType || ''
        //请求联系人
        this.$http({
          url: this.$http.adornUrl(`/mail/mailcontactor/listByPlatformId`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
           if (data.code === 0) {
              this.gridData = data.data;
              console.log('this.gridData: ', this.gridData);
            } else {
              this.$message.error(data.msg);
            }
        }).then(() => {
          this.$nextTick(() => {
            //菜单表格
            this.$refs['eventDetailForm'].resetFields()
          })
        }).then(() => {

          //请求获取上报方式
          this.$http({
            url: this.$http.adornUrl(`/sys/sysdictionary/reportMethodList`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data.code === 0) {
              this.reportMethodData = data.data;
            } else {
              this.$message.error(data.msg);
            }
          })

        })

      },

      //点击行时触发
      rowClick(row){
        // console.log("rowClick::",row)
        this.eventDetailForm.contactorId = row.id;
        this.eventDetailForm.contactorName = row.name;
        this.eventDetailForm.contactorMobile = row.mobile1;
        this.eventDetailForm.contactorOpenId = row.openId;
        this.popoverVisible = false;

      },


      //核实方式选择
      handleCheckedVerifyWaysChange(value) {
        // console.log(value)
      },


      //提交
      eventDetailFormSubmit() {

        this.$refs['eventDetailForm'].validate((valid) => {
          if (valid) {

            /*var detailUrl = "http://shahe.natapp1.cc/verify.html?infoId=" +this.eventDetailForm.id
              +"&platformId="+platformId
              +"&openId="+openId
              +"&flagType="+flag
              +"&statusType=1";*/

            this.$http({
              url: this.$http.adornUrl(`/weChatHandleTaskPC/monitoringSendSingle`),
              method: 'post',
              data: this.$http.adornData({
                //表格数据
                ////String first, String title, String content, String promoter, String remark, String flagId, String openId, String flag
                first: "您被分配了一个任务",
                title: this.eventDetailForm.intelligentType,
                content: this.verifyDescribe,
                remark: "请尽快核实并处置",
                //事件id
                alarmId: this.eventDetailForm.id,
                //微信标识
                performTaskOpenId: this.selectContact[0].openId || '',
                //事件标识
                flagType: 8,
                //平台platformId
                platformId: this.$store.state.user.platformId,
                platformName: this.$store.state.user.platformName,
                platformTypeId: this.$store.state.user.platformTypeId,
                longitude: this.eventDetailForm.longitude,
                latitude: this.eventDetailForm.latitude,
                //被派遣的人
                contactorName: this.selectContact[0].name || '',
                eventTypeName: '违规预警',
                //联系人id
                performTaskContactorId: this.selectContact[0].id || '',
                mailContactorIds: this.selectContact.map(v=>v.id),
                imageUrl: this.eventDetailForm.imageUrl,
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

                this.eventDetailForm.contactorName = ''
                this.verifyDescribe = ''
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })

      },
      // 选择联系人视图
      contactViewHandle(){
        this.showcommonLink = true;
        this.$nextTick(()=>{
          this.$refs.commonLink.handleAddContacts(
            '/mail/mailgroup/list',
            "请选择",
          );
        })
      },
      // 选择联系人数据
      handelLinkdata({linkman}){
         this.$refs['eventDetailForm'].resetFields()
         this.selectContact = linkman
        //  console.log('linkman: ', linkman);
        
         this.contactorName = ''
          linkman.map(v=>{
            this.contactorName += v.name + ','
          })
          this.contactorName = this.contactorName.substring(0,this.contactorName.length-1)
          // console.log('this.selectInvitedToJoinList: ', this.contactorName)
      }
    }
  }

</script>
<style lang="scss">
 .el-popover{
  top:145px !important;
  height: 430px;
}
/*

  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
*/

</style>
