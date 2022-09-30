<template>
    <el-dialog class="settingSchedulingDialog"
        :title="isUpdate?(historicalScheduling?'查看值班':'编辑值班'):'新增值班'" style=""
        :visible.sync="dialogVisible"
        width="48%"
        :before-close="handleClose" @close="dialogVisible=false;$parent.settingSchedulingDialogVisible=false;">
        
        <div style="width:100%;position:relative;">
            <div style="margin:2.5vh 0px;display: flex;align-items: center;">
                <span style="font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(85,85,85,1);margin-left:1.46vw;">班次类型：</span>
                <el-radio v-model="dataForm.isHoliday" label="0" style="margin-left:1.46vw;">日常值班</el-radio>
                <el-radio v-model="dataForm.isHoliday" label="1">节假日值班</el-radio>
            </div>
            <div style="margin:2.5vh 0px;display: flex;align-items: center;">
                <span style="font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(85,85,85,1);margin-left:1.46vw;">值班领导：</span>
                <div style="display:inline-block;margin-left:1.46vw;width:77%;white-space: nowrap;overflow: auto;" class="scheduleLeader">
                    <div style="width:100%;" v-if="leaderMembersList.length!=0">
                        <span v-for="(item,index) in leaderMembersList" :key="index" @click="dataForm.leaderMembers=item;"  :style="{background:dataForm.leaderMembers && dataForm.leaderMembers.id==item.id?'rgba(245,250,255,1)':'rgba(245,245,245,1)','border-radius':'3px',border:dataForm.leaderMembers && dataForm.leaderMembers.id==item.id?'2px solid rgba(0,145,255,1)':'2px solid rgba(245,245,245,1)',display:'inline-block','font-size':'17px','font-family':'PingFangSC-Regular,PingFang SC','font-weight':'400',color:'rgba(102,102,102,1)',padding:'0.39vh 0.73vw','margin-left':'0.73vw'}">{{item.name}}</span>
                    </div>
                    <div v-else style="text-align:center;">
                        <img src="../../../../../assets/img/calendarNodatas.png" style="width:7.3vw;height:7.3vw;">
                        <div style="font-size:16px;font-family:PingFangSC-Medium,PingFang SC;font-weight:500;color:rgba(202,213,232,1);">暂无值班领导</div>
                    </div>
                </div>
            </div>

            <div style="margin:2.5vh 0px;display: flex;align-items: center;width:100%;">
                <span style="font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(85,85,85,1);margin-left:1.46vw;">班次设置：</span>
                <div style="display: flex;justify-content: center;flex-wrap: wrap;width: 77%;padding: 1vh 0px 1vh 1.2vw;margin-left:1.46vw;background:rgba(255,255,255,1);border-radius:3px;border:1px solid rgba(234,230,230,1);overflow:auto;max-height:200px;" >
                    <!-- <span style="display: inline-block;width:21%;height: 4vh;line-height: 3.3vh;text-align: center;background:rgba(245,245,245,1);border-radius:3px;border:2px solid rgba(245,245,245,1);font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin: 1vh 0.5vw;">李老八</span>
                    <span style="display: inline-block;width:21%;height: 4vh;line-height: 3.3vh;text-align: center;background:rgba(245,245,245,1);border-radius:3px;border:2px solid rgba(245,245,245,1);font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin: 1vh 0.5vw;">李老八</span>
                    <span style="display: inline-block;width:21%;height: 4vh;line-height: 3.3vh;text-align: center;background:rgba(245,245,245,1);border-radius:3px;border:2px solid rgba(245,245,245,1);font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin: 1vh 0.5vw;">李老八</span>
                    <span style="display: inline-block;width:21%;height: 4vh;line-height: 3.3vh;text-align: center;background:rgba(245,245,245,1);border-radius:3px;border:2px solid rgba(245,245,245,1);font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin: 1vh 0.5vw;">李老八啊啊啊</span>
                    <span style="display: inline-block;width:21%;height: 4vh;line-height: 3.3vh;text-align: center;background:rgba(245,245,245,1);border-radius:3px;border:2px solid rgba(245,245,245,1);font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin: 1vh 0.5vw;">李老八</span>
                    <span style="display: inline-block;width:21%;height: 4vh;line-height: 3.3vh;text-align: center;background:rgba(245,245,245,1);border-radius:3px;border:2px solid rgba(245,245,245,1);font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin: 1vh 0.5vw;">李老八</span>
                    <span style="display: inline-block;width:21%;height: 4vh;line-height: 3.3vh;text-align: center;background:rgba(245,245,245,1);border-radius:3px;border:2px solid rgba(245,245,245,1);font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin: 1vh 0.5vw;">李老八</span>
                    <span style="display: inline-block;width:21%;height: 4vh;line-height: 3.3vh;text-align: center;background:rgba(245,245,245,1);border-radius:3px;border:2px solid rgba(245,245,245,1);font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin: 1vh 0.5vw;">李老八</span>
                    <span style="display: inline-block;width:21%;height: 4vh;line-height: 3.3vh;text-align: center;background:rgba(245,245,245,1);border-radius:3px;border:2px solid rgba(245,245,245,1);font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin: 1vh 0.5vw;">李老八</span>
                    <span style="display: inline-block;width:21%;height: 4vh;line-height: 3.3vh;text-align: center;background:rgba(245,245,245,1);border-radius:3px;border:2px solid rgba(245,245,245,1);font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin: 1vh 0.5vw;">李老八</span> -->
                    <draggable v-if="ordinaryMembersList.length!=0"
                    element="div" style="width: 100%;white-space: initial;"
                    v-model="ordinaryMembersList"
                    :options="dragOptions1"
                    :move="onMove"
                    @start="isDragging=true"
                    @end="isDragging=false">
                        <span  v-for="(item,key) in ordinaryMembersList" :key="key" style="display: inline-block;white-space: nowrap;overflow:hidden;text-overflow:ellipsis;width:21%;height: 4vh;line-height: 3.3vh;text-align: center;background:rgba(245,245,245,1);border-radius:3px;border:2px solid rgba(245,245,245,1);font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin: 1vh 0.5vw;">{{item.name}}</span>    
                    </draggable>
                    <div  v-if="ordinaryMembersList.length==0" style="text-align:center;">
                        <img src="../../../../../assets/img/calendarNodatas.png" style="width:7.3vw;height:7.3vw;">
                        <div style="font-size:16px;font-family:PingFangSC-Medium,PingFang SC;font-weight:500;color:rgba(202,213,232,1);">暂无值班成员</div>
                    </div>
                </div>    
            </div>

            <div style="margin: 2.5vh 0px;width: 100%;overflow-x: auto;white-space: nowrap;">
                <div v-if="schedulesList.length!=0" style="text-align: center;">
                    <div v-for="(item,index) in schedulesList" :key="index" style="display:inline-block;width:12vw;height:18.8vh;background:rgba(255,255,255,1);border-radius:3px;border:1px solid rgba(234,230,230,1);margin:0px 0.73vw;overflow:auto;">
                        <div style="font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(0,145,255,1);padding:1.3vh 0px;text-align:center;">{{item.name+'('+item.startTime.substr(0,5)+'-'+item.endTime.substr(0,5) +')' }}</div>
                        <draggable 
                            element="div" style="width: 100%;white-space: initial;"
                            v-model="item.scheduleMembersList"
                            :options="dragOptions2"
                            :move="onMove"
                            @start="isDragging=true"
                            @end="isDragging=false">
                            <span v-for="(scheduleMembersItem,scheduleMembersIndex) in item.scheduleMembersList" :key="scheduleMembersIndex" style="display: inline-block;width:40%;white-space: nowrap;overflow:hidden;text-overflow:ellipsis;height: 4vh;line-height: 3.3vh;text-align: center;background:rgba(245,245,245,1);border-radius:3px;border:2px solid rgba(245,245,245,1);font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);margin: 1vh 0.5vw;">{{scheduleMembersItem.name}} <i v-if="!historicalScheduling" class="el-icon-error" style="margin-left: 0.3vw;" @click="item.scheduleMembersList.splice(scheduleMembersIndex,1)"></i></span>
                        </draggable>
                        <div style="text-align:center;margin-top: -0.6vh;" v-if="item.scheduleMembersList.length==0">
                            <img src="../../../../../assets/img/calendarNodatas.png" style="width:4.5vw;">
                            <div style="font-size:16px;font-family:PingFangSC-Medium,PingFang SC;font-weight:500;color:rgba(202,213,232,1);">如需排班 请从班次设置拖动人员</div>
                        </div>
                    </div>  
                </div>
                <div v-else style="text-align:center;">
                    <img src="../../../../../assets/img/calendarNodatas.png" style="width:7.3vw;height:7.3vw;">
                    <div style="font-size:16px;font-family:PingFangSC-Medium,PingFang SC;font-weight:500;color:rgba(202,213,232,1);">暂无班次</div>         
                </div>                       
            </div>
            <!-- <div style="margin:2.5vh 0px;display: flex;align-items: center;">
                <span style="font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(85,85,85,1);margin-left:1.46vw;">是否重复：</span>
                <div style="display:inline-block;margin-left:1.46vw;width:77%;white-space: nowrap;overflow: auto;" class="scheduleLeader">
                    <span style="background:rgba(245,245,245,1);border-radius:3px;border:2px solid rgba(245,245,245,1);display:inline-block;font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);padding:0.39vh 0.73vw;margin-left:0.73vw;">不重复</span>
                    <span style="background:rgba(245,245,245,1);border-radius:3px;border:2px solid rgba(245,245,245,1);display:inline-block;font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);padding:0.39vh 0.73vw;margin-left:0.73vw;">每天重复</span>
                    <span style="background:rgba(245,245,245,1);border-radius:3px;border:2px solid rgba(245,245,245,1);display:inline-block;font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);padding:0.39vh 0.73vw;margin-left:0.73vw;">每周重复</span>
                    <span style="background:rgba(245,245,245,1);border-radius:3px;border:2px solid rgba(245,245,245,1);display:inline-block;font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);padding:0.39vh 0.73vw;margin-left:0.73vw;">每月重复</span>
                    <span style="background:rgba(245,245,245,1);border-radius:3px;border:2px solid rgba(245,245,245,1);display:inline-block;font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);padding:0.39vh 0.73vw;margin-left:0.73vw;">工作日重复</span>
                    <span style="background:rgba(245,245,245,1);border-radius:3px;border:2px solid rgba(245,245,245,1);display:inline-block;font-size:17px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(102,102,102,1);padding:0.39vh 0.73vw;margin-left:0.73vw;">周六日重复</span>
                </div>
            </div> -->
            <div style="text-align:center;">班次设置拖不动时请刷新页面试试</div>
              
        </div>
        <span slot="footer" class="dialog-footer" style="margin-left: 81%!important;">
            <el-button @click="dialogVisible=false;$parent.settingSchedulingDialogVisible=false;" plain size="small">取 消</el-button>
            <el-button @click="commit" type="primary"  style="background:#1890ff;" size="small">确 定</el-button>
        </span>
        
    </el-dialog>
</template>

<script>

import draggable from "vuedraggable";
import Cookies from 'js-cookie'
import qs from 'qs';

export default {
  props:
      ["historicalScheduling"],
  data () {
    return {
        isUpdate:false,
        leaderMembersList:[],
        ordinaryMembersList:[],
        dataForm:{
            isHoliday:'0',
            leaderMembers:{},
            date:'',
            temporaryDutyList:[]
        },
        schedulesList:[],
        isDragging:false,
        dialogVisible:false,
        rules: {
        //   name: [
        //     { required: true, message: '请输入节假日名称', trigger: 'blur' }
        //     // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        //   ],
        //   dateRange : [
        //     { required: true, message: '请选择节假日起始时间', trigger: 'change' }
        //   ]
        }
        }   
    },
    components: {
        draggable
    },
    computed: {
        dragOptions1() {
            return {
                animation: 500,
                group: {
                    name: "description",
                    pull: 'clone',
                    put: false
                },
                ghostClass: "ghost",
            };
        },
        dragOptions2(){
            return {
                animation: 500,
                group: "description",
            };
        }
    },
  created(){
   
  },
  mounted(){
    this.getMembers()
    this.getSchedules()
         
  },
  watch:{
    'dataForm.isHoliday'(newValue,oldValue){       
        this.getSchedules()
        if(this.isUpdate=true){
            this.init(this.dataForm.temporaryDutyList)
        }
    }
  },
  methods: {
    onMove({relatedContext, draggedContext,bbb},ccc,ddd) {
        
        const relatedElement = relatedContext.element;
        const draggedElement = draggedContext.element;
        console.log("relatedContext, draggedContext,bbb",relatedContext, draggedContext,bbb,ccc,ddd,(!relatedElement || !relatedElement.fixed) && !draggedElement.fixed )
        if(relatedContext.list.some(function (elem, index, arr) {
            return elem.id==draggedContext.element.id;
        })){
            console.log('relatedContext, draggedContext,bbb重复了')
            return false
        }
        // return (
        //     (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
        // );
    },
    init(temporaryItem){
        this.dataForm.temporaryDutyList=temporaryItem
        var item=JSON.parse(JSON.stringify(temporaryItem))
        console.log('init init',item)
        this.isUpdate=true
        this.dataForm.leaderMembers=item[0].contactorList.filter(function (elem) {return (elem.isLeader==1)})[0]
        this.dataForm.leaderMembers ? this.dataForm.leaderMembers.id=this.dataForm.leaderMembers.mailContactorId : null
        
        setTimeout(()=>{
            item.forEach(element=>{
                var temporaryId=element.id
                element.id=element.shiftSettingId
                element.shiftSettingId=temporaryId
                element.contactorList=element.contactorList.filter(function (elem) {return (elem.isLeader!=1)})

                this.schedulesList.forEach(schedulesItem=>{
                    
                    if(schedulesItem.id==element.id){
                        schedulesItem.shiftSettingId=temporaryId
                        
                        var temporaryPromise =new Promise((resolve, reject) => {
                            element.contactorList.forEach((forEachItem,forEachIndex)=>{
                                forEachItem.id=forEachItem.mailContactorId
                                forEachItem.name=forEachItem.manName
                            })
                            setTimeout(()=>{
                                resolve()
                            },15*element.contactorList.length)    
                        })
                        temporaryPromise.then(result=>{
                            schedulesItem.scheduleMembersList=element.contactorList
                        })
                    }
                })
                
            })
        },500)
        
    },
    getSchedules(){
        this.$http({
            url: this.$http.adornUrl('/duty/shift/setting/list'),
            method: 'post',
            data: this.$http.adornData({
            })
        }).then(({ data }) => {
            console.log("/duty/shift/setting/list",data)
            if (data && data.code === 0) {
                this.schedulesList=[]
                data.data.forEach(element=>{
                    element.scheduleMembersList=[]
                    if(this.dataForm.isHoliday==0&&element.isHoliday==0){
                        this.schedulesList.push(element)
                    }
                    if(this.dataForm.isHoliday==1&&element.isHoliday==1){
                        this.schedulesList.push(element)
                    }
                })
                
            }else{
                this.$message({
                    message: `${data.msg}`,
                    type: 'error'
                })
            }
        }) 
    },
    getMembers(){

      this.$http({
        url: this.$http.adornUrl('/duty/shift/contactor/setting/list'),
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: this.$http.adornData({
        })
      }).then(({ data }) => {
        console.log("/duty/shift/contactor/setting/list",data)
        if (data && data.code === 0) {
          this.leaderMembersList=[]
          this.ordinaryMembersList=[]
          data.data.forEach(element=>{
            if(element.isLeader==1){
              element.showBoolean=true
              this.leaderMembersList.push(element)
            }else{
              element.showBoolean=true
              this.ordinaryMembersList.push(element)
            }
          })
             
        }else{
            this.$message({
                message: `${data.msg}`,
                type: 'error'
            })
        }
      })    
    },
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
    commit(){
        if(this.historicalScheduling){
            this.dialogVisible=false;
            return
        }
        console.log("奥利给",this.schedulesList)
        if(Object.keys(this.dataForm.leaderMembers).length==0){
            this.$message({
                message: '请选择值班领导',
                type: 'error'
            });
            return false;
        }
        if(this.leaderMembersList.length==0){
            this.$message({
                message: '请添加值班领导',
                type: 'error'
            });
            return false;
        }
        if(this.schedulesList.length==0){
            this.$message({
                message: '请添加值班班次',
                type: 'error'
            });
            return false;
        }
        if( this.schedulesList.every(function (elem, index, arr) {return elem.scheduleMembersList.length == 0}) ){
            this.$message({
                message: '请给班次添加值班人员',
                type: 'error'
            });
            return false;
        }
        var saveSchedulesList=[],miniPromise,that=this
        console.log("fuckoff",this.schedulesList)
        this.schedulesList.forEach(item=>{
            item.scheduleMembersList.push(that.dataForm.leaderMembers)
        })
      
       
        miniPromise= new Promise((resolve, reject) => {
        
            this.schedulesList.forEach(item=>{
                console.log("that.dataForm.leaderMembers",that,that.dataForm.leaderMembers,item.shiftSettingId,item)
                saveSchedulesList.push({
                    id:that.isUpdate?item.shiftSettingId:'',
                    name:item.name,
                    date:that.dataForm.date,
                    shiftSettingId:item.id,
                    contactorList:item.scheduleMembersList.map(function (element) {
                        return {
                            mailContactorId:element.id,
                            isLeader:element.id==that.dataForm.leaderMembers.id?1:0
                        }
                    })
                })
            })
            resolve()
        });
         

        miniPromise.then(solveData=>{
            that.$http({
                url: that.$http.adornUrl('/duty/shift/save'),
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: qs.stringify({
                    "data": that.$http.adornData(saveSchedulesList,false)
                })
            }).then(({ data }) => {
            
                if (data && data.code === 0) {
                    // 详细联系人列表
                    // console.log("保存更新节假日",data)
                    that.$message({
                        message: that.isUpdate?'更新成功':'保存成功',
                        type: 'success'
                    })
                    this.$emit("getSettingScheduling")
                    that.$parent.settingSchedulingDialogVisible=false;
                    that.dialogVisible=false;
                
                }else{
                    that.$message({
                        message: `${data.msg}`,
                        type: 'error'
                    })
                }
            })
        })
      
           
    },
 
    handleClose(done) {
        this.$confirm('确认关闭？')
        .then(_ => {
            this.dialogVisible=false
            this.$parent.settingSchedulingDialogVisible=false
            done();
            
        })
        .catch(_ => {});
    }
    
  }
}
</script>
<style lang="less" >

    .settingSchedulingDialog{
        overflow: hidden;
        .el-dialog{
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            margin-top:initial!important;
            min-width: 659px;
            border-radius: 10px;
            
        }
        
        .el-range-separator{
            width: auto!important;
        }
        
        .el-dialog__header{
            // box-sizing: border-box!important;
            background:#409EFF!important;padding:10px!important;
            // padding-bottom: 5px!important;
            border-radius: 10px 10px 0px 0px!important;
        }

        .el-dialog__title{
            margin-left: 10px;
            color: white!important;
        }
        .el-dialog__headerbtn{
            top: initial!important;
        }
        .el-dialog__close{
            color: white!important;
           
            
        }
        .el-dialog__footer{
            border-top: 1px solid rgba(233,236,241,1);
            padding: 2vh 0px;
            text-align: initial;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
        }
      
        
        
        
       
    }
    
</style>
