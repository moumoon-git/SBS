<template>
    <el-dialog class="scheduleDialogAddOrUpdate"
        title="班次管理" style=""
        :visible.sync="dialogVisible"
        width="45%"
        :before-close="handleClose" @close="dialogVisible=false;$parent.scheduleDialogAddOrUpdateVisible=false;">
        
        <div style="width:100%;position:relative;">
            <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="100px" class="demo-ruleForm" label-position="right" style="display: flex;flex-wrap: wrap;justify-content: center;">
                <el-form-item  label="班次类型：" prop="isHoliday" style="width:80%;">
                    <el-radio v-model="dataForm.isHoliday" :label="0">                 
                        <span style="font-size:16px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(85,85,85,1);">日常值班</span>                  
                    </el-radio>
                    <el-radio v-model="dataForm.isHoliday" :label="1">                 
                        <span style="font-size:16px;font-family:PingFangSC-Regular,PingFang SC;font-weight:400;color:rgba(85,85,85,1);">节假日值班</span>                  
                    </el-radio>
                </el-form-item>

                <el-form-item  label="班次名称：" prop="name" style="width:80%;">
                    <el-input v-model="dataForm.name" style="width:18.25vw;"></el-input>
                </el-form-item>

                <el-form-item  label="起始时间：" prop="timeRange" style="width:80%;">
                    <el-time-picker
                        is-range format='HH:mm:ss' 
                        v-model="dataForm.timeRange"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        placeholder="选择时间范围" >
                    </el-time-picker>
                </el-form-item>

                <el-form-item  label="" prop="icon" class="icon" style="margin-bottom: 0px;">
                <!-- <div  style="display:flex;"> -->
                    <el-input v-model="dataForm.icon" v-show="false"></el-input>
                    <div style="display:inline-block;width:1.75vw;height:1.75vw;background:rgba(0,145,255,1);margin:0px 0.73vw;border-radius:50%;text-align: center;line-height: 1.75vw;" @click="dataForm.icon='rgba(0,145,255,1)'" >
                        <i class="el-icon-check" style="color:white;" v-show="dataForm.icon=='rgba(0,145,255,1)'" ></i>
                    </div>
                    <div style="display:inline-block;width:1.75vw;height:1.75vw;background:rgba(11,210,149,1);margin:0px 0.73vw;border-radius:50%;text-align: center;line-height: 1.75vw;" @click="dataForm.icon='rgba(11,210,149,1)'">
                        <i class="el-icon-check" style="color:white;" v-show="dataForm.icon=='rgba(11,210,149,1)'"></i>
                    </div>
                    <div style="display:inline-block;width:1.75vw;height:1.75vw;background:rgba(242,182,38,1);margin:0px 0.73vw;border-radius:50%;text-align: center;line-height: 1.75vw;" @click="dataForm.icon='rgba(242,182,38,1)'">
                        <i class="el-icon-check" style="color:white;" v-show="dataForm.icon=='rgba(242,182,38,1)'"></i>
                    </div>
                    <div style="display:inline-block;width:1.75vw;height:1.75vw;background:rgba(255,159,127,1);margin:0px 0.73vw;border-radius:50%;text-align: center;line-height: 1.75vw;" @click="dataForm.icon='rgba(255,159,127,1)'">
                        <i class="el-icon-check" style="color:white;" v-show="dataForm.icon=='rgba(255,159,127,1)'"></i>
                    </div>
                    <div style="display:inline-block;width:1.75vw;height:1.75vw;background:rgba(50,197,255,1);margin:0px 0.73vw;border-radius:50%;text-align: center;line-height: 1.75vw;" @click="dataForm.icon='rgba(50,197,255,1)'">
                        <i class="el-icon-check" style="color:white;" v-show="dataForm.icon=='rgba(50,197,255,1)'"></i>
                    </div>
                    <div style="display:inline-block;width:1.75vw;height:1.75vw;background:rgba(119,105,250,1);margin:0px 0.73vw;border-radius:50%;text-align: center;line-height: 1.75vw;" @click="dataForm.icon='rgba(119,105,250,1)'">
                        <i class="el-icon-check" style="color:white;" v-show="dataForm.icon=='rgba(119,105,250,1)'"></i>
                    </div>
                    <div style="display:inline-block;width:1.75vw;height:1.75vw;background:rgba(196,114,238,1);margin:0px 0.73vw;border-radius:50%;text-align: center;line-height: 1.75vw;" @click="dataForm.icon='rgba(196,114,238,1)'">
                        <i class="el-icon-check" style="color:white;" v-show="dataForm.icon=='rgba(196,114,238,1)'"></i>
                    </div>
                    <div style="display:inline-block;width:1.75vw;height:1.75vw;background:rgba(246,105,171,1);margin:0px 0.73vw;border-radius:50%;text-align: center;line-height: 1.75vw;" @click="dataForm.icon='rgba(246,105,171,1)'">
                        <i class="el-icon-check" style="color:white;" v-show="dataForm.icon=='rgba(246,105,171,1)'"></i>
                    </div>
                    <div style="display:inline-block;width:1.75vw;height:1.75vw;background:rgba(246,88,123,1);margin:0px 0.73vw;border-radius:50%;text-align: center;line-height: 1.75vw;" @click="dataForm.icon='rgba(246,88,123,1)'">
                        <i class="el-icon-check" style="color:white;" v-show="dataForm.icon=='rgba(246,88,123,1)'"></i>
                    </div>
                    <div style="display:inline-block;width:1.75vw;height:1.75vw;background:rgba(202,67,240,1);margin:0px 0.73vw;border-radius:50%;text-align: center;line-height: 1.75vw;" @click="dataForm.icon='rgba(202,67,240,1)'">
                        <i class="el-icon-check" style="color:white;" v-show="dataForm.icon=='rgba(202,67,240,1)'"></i>
                    </div>
                    <div style="display:inline-block;width:1.75vw;height:1.75vw;background:rgba(157,150,245,1);margin:0px 0.73vw;border-radius:50%;text-align: center;line-height: 1.75vw;" @click="dataForm.icon='rgba(157,150,245,1)'">
                        <i class="el-icon-check" style="color:white;" v-show="dataForm.icon=='rgba(157,150,245,1)'"></i>
                    </div>
                    <div style="display:inline-block;width:1.75vw;height:1.75vw;background:rgba(109,114,120,1);margin:0px 0.73vw;border-radius:50%;text-align: center;line-height: 1.75vw;" @click="dataForm.icon='rgba(109,114,120,1)'">
                        <i class="el-icon-check" style="color:white;" v-show="dataForm.icon=='rgba(109,114,120,1)'"></i>
                    </div>
                <!-- </div> -->
                </el-form-item>
                
            </el-form>
            
        </div>
        <span slot="footer" class="dialog-footer" style="margin-left: 78%!important;">
            <el-button @click="dialogVisible=false;$parent.scheduleDialogAddOrUpdateVisible=false;" plain size="small">取 消</el-button>
            <el-button @click="commit" type="primary"  style="background:#1890ff;" size="small">确 定</el-button>
        </span>
        
    </el-dialog>
</template>

<script>


import Cookies from 'js-cookie'

export default {
  data () {
    return {
        dialogVisible:false,
        isUpdate:false,
        dataForm:{
            id:"",
            name:'',
            isHoliday:0,
            timeRange:[new Date(), new Date()],
            icon:''
        },
        rules: {
            isHoliday : [
                { required: true, message: '请选择班次类型', trigger: 'blur' }
            ],
            name: [
                { required: true, message: '请输入班次名称', trigger: 'blur' }
                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            timeRange:[
                { required: true, message: '请选择起始时间', trigger: 'blur' }
            ],
            icon:[
                { required: true, message: '请选择班次图标颜色', trigger: 'blur' }
            ]
        }
    }
  },
  components: {

  },
  created(){
    this.dataForm.timeRange=[new Date(), new Date()]
  },
  mounted(){
      
  },
  watch:{

  },
  methods: {
    init(item){
        // console.log("编辑值班排班",item)
        this.dataForm.id=item.id
        this.dataForm.isHoliday=item.isHoliday
        this.dataForm.name=item.name
        this.dataForm.timeRange=[new Date( 2019,11,20,item.startTime.substr(0,2),item.startTime.substr(3,2) ), new Date( 2019,11,20,item.endTime.substr(0,2),item.endTime.substr(3,2) )]
        this.dataForm.icon=item.icon
        this.isUpdate=true
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
        this.$refs['dataForm'].validate((valid) => {
            if (valid) {
                this.$http({
                    url: this.$http.adornUrl('/duty/shift/setting/save'),
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: this.$http.adornData({
                        "id":this.isUpdate?this.dataForm.id:'',
                        "name": this.dataForm.name,
                        "startTime": this.dateFormatter(this.dataForm.timeRange[0]).substr(11),
                        "endTime": this.dateFormatter(this.dataForm.timeRange[1]).substr(11),
                        "icon": this.dataForm.icon,
                        "isHoliday": this.dataForm.isHoliday,
                        'orderNum':'',
                        'isCrossDay':'',
                        'remake':''
                    },true,'application/x-www-form-urlencoded')
                }).then(({ data }) => {
                
                    if (data && data.code === 0) {
                        // 详细联系人列表
                        // console.log("保存更新值班排班",data)
                        this.$message({
                            message: this.isUpdate?'更新成功!':'保存成功!',
                            type: 'success'
                        })
                        this.$parent.scheduleDialogAddOrUpdateVisible=false;
                        this.dialogVisible=false;
                        this.$emit('getSchedules')
                        
                      
                    }else{
                        this.$message({
                            message: `${data.msg}`,
                            type: 'error'
                        })
                    }
                })
             

            } else {
                return false;
            }
        });
           
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
        .then(_ => {
            // console.log("this.$parent",this.$parent)
            this.dialogVisible=false
            this.$parent.scheduleDialogAddOrUpdateVisible=false
            done();
            
        })
        .catch(_ => {});
    }
    
  }
}
</script>
<style lang="less" >

    .scheduleDialogAddOrUpdate{
        .el-dialog{
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            margin-top:initial!important;
            min-width: 659px;
            border-radius: 10px;
            // overflow: hidden;
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
        .el-form-item__content{
            margin-left: initial!important;
            display: inline-block!important;
        }
        .icon .el-form-item__content{
            display: flex!important;
        }
    }
    
</style>
