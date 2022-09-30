<template>
  <el-row>
    <el-col :span="6">
      <div class="flowTitle">响应流程</div>
      <el-scrollbar style="height: 100%">
        <div class="flowBody">
          <el-scrollbar style="height: 100%">
            <el-steps direction="vertical" :active="active" finish-status="success">
              <el-step :title="item.name" v-for="(item,index) in flow" style="cursor: pointer"
                       @click.native="handleClickStep(index,item)" :key="index">
                <div slot="description" style="white-space: pre-line;" v-show="active == index">{{'流程内容: '+item.content}}<br><span style="color:red;">{{item.result? '处理结果: '+item.result : ''}}</span><el-button size='mini' v-if="!item.result" @click="handleOpenSaveFlowPopup">流程处理</el-button></div>
              </el-step>
            </el-steps>
          </el-scrollbar>
        </div>
      </el-scrollbar>
    </el-col>
    <el-col :span="18">
      <nav-bar ref="navBar" :selectedName="selectedName" :navBarList="navBarList"
               @changTab="changTab" style="margin: 10px 15px 10px 20px;"></nav-bar>
      <div style="
                margin: 0 15px 0 20px;
                background-color: white;
                overflow-y: auto;
                height: 700px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
        <el-row> 
          <el-col :span="5" style="height:700px">
            <emergency-departments ref="emergencyDepartments" :type="selectedName" @getPersonInfo="getPersonInfo" @checkChange="checkChange"></emergency-departments>
          </el-col>
          <el-col :span="19">
            <communication-scheduling v-show="selectedName == '通讯调度'" :personInfo="personInfo" :type="selectedName"></communication-scheduling>
            <duty-dispatch v-show="selectedName == '职责分发'" :personInfo="personInfo" :checkedList="checkedList" :checkedFlow="checkedFlow"></duty-dispatch>
            <response-situation v-show="selectedName == '回复情况'" :personInfo="personInfo" :type="selectedName"></response-situation>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <add-process-content-popup @saveFlow="handleSaveFlow" ref="addProcessContentPopup"></add-process-content-popup>
  </el-row>
</template>

<script>
  import navBar from "@/yz_components/menu/navBar"
  import communicationScheduling from "@/view/yz_eventManagement/emergencyResponse/Page/communicationScheduling"
  import dutyDispatch from "@/view/yz_eventManagement/emergencyResponse/Page/dutyDispatch"
  import responseSituation from "@/view/yz_eventManagement/emergencyResponse/Page/responseSituation"
  import emergencyDepartments from "@/view/yz_eventManagement/emergencyResponse/Page/emergencyDepartments"
  import addProcessContentPopup from "@/view/yz_eventManagement/emergencyResponse/Plan/addProcessContentPopup";
  export default {
    name: "emergencyResponse",
    components: {navBar, communicationScheduling, dutyDispatch, responseSituation, emergencyDepartments, addProcessContentPopup},
    data() {
      return {
        active: 0,//默认选中流程
        selectedName: "通讯调度",//默认选中导航条
        navBarList: [
          {
            name: "通讯调度"
          }, {
            name: "职责分发"
          }, {
            name: "回复情况"
          }
        ],//导航条模块
        flow: [],//流程内容
        deparments: [],//给子组件传过去的选中的组织架构
        personInfo:[],//通讯调度表格数据
        checkedList: [],//子组件传过来的选中的组织架构
        checkedFlow: null,//选中的流程
      }
    },
    methods: {
      //根据eventId获取事件流程
      getProcess() {
        let eventId=sessionStorage.getItem('newID');
        console.log(eventId)
        if(eventId==''||eventId==null||eventId==undefined||eventId=='newID') return
        let data = {
          eventId
        }
        this.$api.responseGetProcess(data).then(res => {
          if (res.errorcode != 0) {
            this.$message({
              message: res.msg,
              type: "error"
            });
            return;
          }
          this.flow = res.data
        })
      },
      //接受组织结构组件传递过来的表格信息
      getPersonInfo(personInfo) {
        console.log(personInfo)
        this.personInfo = personInfo
      },
      //获取选中数组
      checkChange(arr){
        this.checkedList = arr
      },
      //根据tab切换组件
      changTab(tabName) {
        console.log(tabName);
        return this.selectedName = tabName;

      },
      //切换index
      handleClickStep(index,item) {
        this.active = index;
        this.checkedFlow = item
      },
      handleSaveFlow(content) {
        let data = {
          content
        }
        if(this.checkedFlow){
          data.processId = this.checkedFlow.id
        }
        this.$api.responseSaveFlow(data).then(res => {
          if (res.errorcode !== 0) {
            this.$message({
              message: res.msg,
              type: 'error'
            })
            return
          }
          this.$message({
            message: '处理成功',
            type: 'success'
          })
          this.$refs.addProcessContentPopup.isDialogVisible = false;
          this.getProcess()
        })
      },
      handleOpenSaveFlowPopup() {
        this.$refs.addProcessContentPopup.isDialogVisible = true;
      }
    },
    created() {
      this.getProcess()
    },
  }
</script>

<style scoped>
  .flowTitle {
    height: 58px;
    line-height: 58px;
    background: rgba(255, 255, 255, 1);
    margin: 10px 0 0 20px;
    font-size: 20px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(50, 50, 50, 1);
    border-radius: 3px 3px 0 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }
  .flowBody {
    height: 670px;
    background-color: white;
    padding: 20px;
    margin: 0 0 0 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }
</style>
