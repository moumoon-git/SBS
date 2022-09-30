<template>
  <el-dialog
    title="工单升级事件"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="700px"
  >

    <!--事件详情表单-->
    <el-form ref="eventDetailForm" :model="eventDetailForm" label-width="80px">

      <el-form-item label="事件标题">
        <el-input v-model="eventDetailForm.title" style="width: 50%"></el-input>
      </el-form-item>

      <!--<el-form-item label="事件类型">
        <el-input v-model="eventDetailForm.eventType"></el-input>
      </el-form-item>-->

      <el-form-item label="事件类型">
        <el-popover
          ref="eventTypeListPopover"
          placement="right-start"
          trigger="click"
        >
          <el-tree
            :data="eventTypeList"
            :props="eventTypeListTreeProps"
            node-key="id"
            ref="eventTypeListTree"
            @current-change="eventTypeListTreeCurrentChangeHandle"
            :default-expand-all="false"
            :auto-expand-parent="true"
            :highlight-current="true"
            :expand-on-click-node="true"
          >
          </el-tree>
        </el-popover>

        <el-input v-model="eventDetailForm.eventTypeName"
                  v-popover:eventTypeListPopover
                  :readonly="true"
                  style="width: 50%" placeholder="点击事件类型" class="menu-list__input">

        </el-input>
      </el-form-item>

      <el-form-item label="关联预案">
        <!--<el-input v-model="eventDetailForm.eventLevel"></el-input>-->
        <!--eventDetailForm.statusFlag对应item.id-->
        <el-select v-model="eventDetailForm.planId" :placeholder="planPaceholder"  :disabled="planDisableFlag" @change="eventPlanChange">
          <el-option
            v-for="item in eventPlanData"
            :key="item.id"
            :label="item.planName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="警情响应">
        <el-select v-model="eventDetailForm.eventLevel" :placeholder="levelPaceholder"  :disabled="levelDisableFlag">
          <el-option
            v-for="item in eventLevelData"
            :key="item.id"
            :label="item.responseName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="服务对象">
        <el-select v-model="eventDetailForm.serviceObjectId" :placeholder="serviceObjectPaceholder"  :disabled="serviceObjectDisableFlag">
          <el-option
            v-for="item in serviceObjectData"
            :key="item.id"
            :label="item.serviceName"
            :value="item.dataSourceId">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="上报人员">
        <el-input v-model="eventDetailForm.reportName" style="width: 50%"></el-input>
      </el-form-item>

      <el-form-item label="上报时间">
        <el-input v-model="eventDetailForm.reportTime" :readonly="true" style="width: 50%"></el-input>
      </el-form-item>

      <el-form-item label="事发地点">
        <el-input v-model="eventDetailForm.eventPosition"></el-input>
      </el-form-item>

      <el-form-item label="事件描述">
        <el-input  type="textarea" :rows="2" v-model="eventDetailForm.eventDescription"></el-input>
      </el-form-item>

      <el-form-item label="事件状态">
        <el-radio-group v-model="eventDetailForm.status" size="small" readonly="true">
          <el-radio :label="1" style="margin-right: 0px; margin-left: 20px;">待核实</el-radio>
          <el-radio :label="2" style="margin-right: 0px; margin-left: 20px;">核实中</el-radio>
          <el-radio :label="3" style="margin-right: 0px; margin-left: 20px;">待处理</el-radio>
          <el-radio :label="4" style="margin-right: 0px; margin-left: 20px;">处理中</el-radio>
          <el-radio :label="5" style="margin-right: 0px; margin-left: 20px;">已处理</el-radio>
          <el-radio :label="6" style="margin-right: 0px; margin-left: 20px;">超出范围</el-radio>

        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否关闭" >
        <el-radio-group v-model="eventDetailForm.isClose" size="small" readonly="true">
          <el-radio :label="1" style="margin-left: 20px;">否</el-radio>
          <el-radio :label="0">是</el-radio>
        </el-radio-group>
      </el-form-item>

    </el-form>

    <!--取消与确认按钮-->
    <span slot="footer" class="dialog-footer">
      <el-button @click="eventDetailFormCancel()" plain size="small">取消</el-button>
      <el-button type="primary" @click="eventDetailFormSubmit()" size="small">确定</el-button>
    </span>


  </el-dialog>

</template>

<script>

  export default {
    data() {
      return {
        visible: false,

        //事件类型数据
        eventTypeList: [],
        typeDisableFlag:true,

        eventTypeListTreeProps: {
          label: 'name',
          children: 'children'
        },

        //预案数据
        eventPlanData: [],
        planDisableFlag:true,
        planPaceholder:"请先选择事件类型",

        //事件等级数据
        eventLevelData: [],
        levelDisableFlag:true,
        levelPaceholder:"请先选择关联预案",

        //服务对象数据
        serviceObjectData: [],
        serviceObjectDisableFlag:true,
        serviceObjectPaceholder:"请先选择关联响应等级",

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
        }

      }
    },

    watch:{
      'eventDetailForm.eventTypeId': function (newVal, oldVal) {
        //监听事件类型id,当事件等级发生改变时，则预案也会发生改变
        // console.log('type new: %s, type old: %s', newVal, oldVal)
        //根据事件类型请求预案列表
        if(newVal != null && newVal !=""  && newVal != undefined && oldVal != 0){
          //预案设置可以选择了
          this.planDisableFlag = false;
          //重置预案的值
          this.eventDetailForm.planId = null;
          this.eventPlanData = [];

          //重置响应等级的值
          this.eventDetailForm.eventLevel = null;
          this.eventLevelData = [];
          this.levelDisableFlag = true;

          //重置响应等级的值
          this.eventDetailForm.serviceObjectId = null;
          this.serviceObjectData = [];
          this.serviceObjectDisableFlag = true;

          this.$http({
            url: this.$http.adornUrl(`/rp/plan/listByEventTypeId`),
            method: 'post',
            params: this.$http.adornParams({
              eventTypeId:newVal,
              state: 1
            })
          }).then(({data}) => {
             if (data.code === 0) {
                // console.log("根据事件类型id查找预案::::",data)
                this.eventPlanData = data.list;

              if(this.eventPlanData.length > 0){
                this.planPaceholder = "请选择预案"
              }else{
                this.planPaceholder = "该类型暂无预案"
              }
            } else {
              this.$message.error(data.msg);
            }
          })
        }

      },

      'eventDetailForm.planId': function (newVal, oldVal) {
        //监听预案id,当预案id发生改变时，则响应等级也会发生改变
        // console.log('plan new: %s, plan old: %s', newVal, oldVal)
        //根据预案id请求响应等级
        if(newVal != null  && newVal !=""  && newVal != undefined && oldVal != 0){
          //设置可以选择
          this.levelDisableFlag = false;
          //重置响应等级的值
          this.eventDetailForm.eventLevel = null;
          this.eventLevelData = [];

          //重置响应等级的值
          this.eventDetailForm.serviceObjectId = null;
          this.serviceObjectData = [];
          this.serviceObjectDisableFlag = true;

          //根据预案id请求响应等级
          this.$http({
            url: this.$http.adornUrl(`/rp/policeResponse/listByPlanId/${newVal}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
             if (data.code === 0) {
              //  console.log("监听的预案id查找响应等级::::",data)
               this.eventLevelData = data.list;
   
               if(this.eventLevelData.length > 0){
                 this.levelPaceholder = "请选择警情响应";
               }else{
                 this.levelPaceholder = "该预案暂无警情响应";
               }
            } else {
              this.$message.error(data.msg);
            }
          })
        }

      },

      'eventDetailForm.eventLevel': function (newVal, oldVal) {
        //监听预案id,当预案id发生改变时，则响应等级也会发生改变
        // console.log('level new: %s, level old: %s', newVal, oldVal)
        //根据预案id请求响应等级
        if(newVal != null  && newVal !=""  && newVal != undefined && oldVal != 0){
          //设置可以选择
          this.serviceObjectDisableFlag = false;
          //重置服务对象的值
          //this.eventDetailForm.serviceObjectId = null;
          this.serviceObjectData = [];

          //根据响应等级id请求服务对象
          this.$http({
            url: this.$http.adornUrl(`/rp/rpServiceObject/listByResponseId/${newVal}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
             if (data.code === 0) {
              //  console.log("监听的预案id查找响应等级::::",data)
               this.serviceObjectData = data.list;
   
               if(this.serviceObjectData.length > 0){
                 this.serviceObjectPaceholder = "请选择服务对象";
               }else{
                 this.eventDetailForm.serviceObjectId = null;
                 this.serviceObjectPaceholder = "该警情响应暂无服务对象";
               }
            } else {
              this.$message.error(data.msg);
            }
          })
        }

      },

    },

    methods: {

      init(row) {
        //设置弹窗可见
        this.visible = true

        //获取传来的数据ID
        this.eventDetailForm.id = row.id || 0
        //请求事件类型树型数据,事件类型typeFlag = 1
        this.$http({
          url: this.$http.adornUrl(`/event/eventType/selectTypeList`),
          method: 'post',
          params: this.$http.adornParams({
              typeFlag: 1,
              isTree: 1
          })
        }).then(({data}) => {
           if (data.code === 0) {
            //本平台转成树形
            this.eventTypeList = data.list;
          } else {
            this.$message.error(data.msg);
          }

        }).then(() => {
          this.$nextTick(() => {
            //菜单表格
            this.$refs['eventDetailForm'].resetFields()
          })
        }).then(() => {

          if (!this.eventDetailForm.id) {
            //新增

          } else {
            //修改
            //查看人员详情
            this.eventDetailForm.id = row.id;
            this.eventDetailForm.title = row.title;
            this.eventDetailForm.reportName = row.reportName;
            this.eventDetailForm.reportTime = row.reportTime;
            this.eventDetailForm.eventPosition = row.eventPosition;
            this.eventDetailForm.eventDescription = row.eventDescription;
            this.eventDetailForm.status = row.status;
            this.eventDetailForm.isClose = row.isClose;

            this.eventDetailForm.audioUrl = row.audioUrl;
            this.eventDetailForm.imageUrl = row.imageUrl;
            this.eventDetailForm.videoUrl = row.videoUrl;

            this.eventDetailForm.latitude = row.latitude;
            this.eventDetailForm.longitude = row.longitude;
            this.eventDetailForm.eventPosition = row.eventPosition;
            this.eventDetailForm.openId = row.openId;
            this.eventDetailForm.surveyFlag = 0;

            //升级时，默认选中的事件类型ID为空、类型id、类型名称、预案id
            //this.eventDetailForm.dataSourceId = row.dataSourceId;
            //this.eventDetailForm.eventType = row.eventType;
            //this.eventDetailForm.eventLevel = row.eventLevel;
            //this.eventDetailForm.planId = row.planId;

            this.eventTypeListTreeSetCurrentNode ();


          }

        })

      },

      eventPlanChange(value){
        //重置事件等级
        this.eventDetailForm.eventLevel = null;
      },

      onSubmit() {
        // console.log('submit!');
      },

      // 事件类型设置当前选中节点 (修改、增加时调用)
      eventTypeListTreeSetCurrentNode () {
        this.$refs.eventTypeListTree.setCurrentKey(this.eventDetailForm.eventTypeId)
        this.eventDetailForm.eventTypeName = (this.$refs.eventTypeListTree.getCurrentNode() || {})['name']
      },

      // 事件类型选中
      eventTypeListTreeCurrentChangeHandle (data, node) {
        // console.log("data:::",data)
        this.eventDetailForm.eventTypeId = data.id
        this.eventDetailForm.eventTypeName = data.name
      },

      //自动启动预案
      automaticStartPlan(){
        //触发
        this.$http({
          url: this.$http.adornUrl(`/event/eventinfo/workOrderUpgradeEvent`),
          method: 'post',
          data: this.$http.adornData({
            //表格数据
            id: this.eventDetailForm.id,
            title: this.eventDetailForm.title,
            eventType: this.eventDetailForm.eventTypeId,
            planId: this.eventDetailForm.planId,
            serviceObjectId: this.eventDetailForm.serviceObjectId,
            eventLevel: this.eventDetailForm.eventLevel,
            eventTypeName: this.eventDetailForm.eventTypeName,
            reportName: this.eventDetailForm.reportName,
            reportTime: this.eventDetailForm.reportTime,
            eventPosition: this.eventDetailForm.eventPosition,
            eventDescription: this.eventDetailForm.eventDescription,
            status: this.eventDetailForm.status,
            isClose: this.eventDetailForm.isClose,
            audioUrl: this.eventDetailForm.audioUrl,
            imageUrl: this.eventDetailForm.imageUrl,
            videoUrl: this.eventDetailForm.videoUrl,
            latitude: this.eventDetailForm.latitude,
            longitude: this.eventDetailForm.longitude,
            openId: this.eventDetailForm.openId,
            //注意，这个不是服务对象表的id,而是服务对象表的dataSourceId
            dataSourceId: this.eventDetailForm.serviceObjectId,
            surveyFlag: 0,
            flagType: 1,
            //自动
            isAutomatic: 1

          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                //菜单表格
                this.$refs['eventDetailForm'].resetFields()
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },

      manualStartPlan(){
        //手动触发
        this.$http({
          url: this.$http.adornUrl(`/event/eventinfo/workOrderUpgradeEvent`),
          method: 'post',
          data: this.$http.adornData({
            //表格数据
            id: this.eventDetailForm.id,
            title: this.eventDetailForm.title,
            eventType: this.eventDetailForm.eventTypeId,
            planId: this.eventDetailForm.planId,
            serviceObjectId: this.eventDetailForm.serviceObjectId,
            eventLevel: this.eventDetailForm.eventLevel,
            reportName: this.eventDetailForm.reportName,
            reportTime: this.eventDetailForm.reportTime,
            eventPosition: this.eventDetailForm.eventPosition,
            eventDescription: this.eventDetailForm.eventDescription,
            status: this.eventDetailForm.status,
            isClose: this.eventDetailForm.isClose,
            audioUrl: this.eventDetailForm.audioUrl,
            imageUrl: this.eventDetailForm.imageUrl,
            videoUrl: this.eventDetailForm.videoUrl,
            latitude: this.eventDetailForm.latitude,
            longitude: this.eventDetailForm.longitude,
            openId: this.eventDetailForm.openId,
            dataSourceId: this.eventDetailForm.serviceObjectId,
            surveyFlag: 0,
            flagType: 1,
            //手动
            isAutomatic: 2

          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                //菜单表格
                this.$refs['eventDetailForm'].resetFields()
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },

      //提交
      eventDetailFormSubmit() {

        this.$refs['eventDetailForm'].validate((valid) => {
          if (valid) {

            // console.log("typeName:"+this.eventDetailForm.eventTypeName);
            //注意，这个不是服务对象表的id,而是服务对象表的dataSourceId
            var serviceObjectId = this.eventDetailForm.serviceObjectId;

            if(serviceObjectId != null && serviceObjectId != "" && serviceObjectId !=0){
              this.$confirm('该事件存在关联预案, 是否立即启动?', '提示', {
                distinguishCancelAndClose: true,
                confirmButtonText: '立即启动',
                cancelButtonText: '手动启动',
                type: 'warning'
              }).then(() => {
                //自动触发
                this.automaticStartPlan();

              }).catch(action => {

                if(action === 'cancel'){
                  //手动触发
                  this.manualStartPlan();
                }else{

                }


              });

            }else{
              this.$confirm('该工单没有关联服务对象, 是否继续升级工单?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                //手动触发触发
                this.manualStartPlan();

              }).catch(() => {
                return;
              });

            }

          }
        })

      },

      //取消
      eventDetailFormCancel(){
        //菜单表格
        this.$refs['eventDetailForm'].resetFields()
        this.visible = false
        this.$emit('refreshDataList')
      }


    }
  }

</script>

<style lang="scss">
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
