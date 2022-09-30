<template>
    <el-dialog class="previewEmergencyDialog"
        title="预览要情信息" style=""
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose" @close="dialogVisible=false;$parent.previewEmergencyDialogVisible=false;">
        
        <div style="width:100%;position:relative;">
            <!-- <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="100px" class="demo-ruleForm" label-position="right" style="display: flex;flex-wrap: wrap;justify-content: center;padding-right: 24px;">
                <el-form-item  label="节假日名称:" prop="name" style="width:80%;">
                    <el-input v-model="dataForm.name"></el-input>
                </el-form-item>

                <el-form-item  label="节假日设置:" prop="dateRange" style="width:80%;">
                    <el-date-picker :unlink-panels="true"
                        v-model="dataForm.dateRange"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                
            </el-form> -->

            <el-form  :model="$parent.dataForm" :rules="dataRule" ref="dataForm"  label-width="80px" size="medium " style="width:100%;">
                <el-row style="text-align: center;position:relative;">
                    <el-col :span="24" >      
                    <span>要情登记表</span>
                    <!-- <el-button icon="el-icon-edit-outline" @click="editAble=!editAble" style="width: 85px;height: 36px;position: absolute;right: 2%;top: 50%;transform: translateY(-50%);">修改</el-button> -->
                    </el-col>
                </el-row> 

                <el-row >
                    <el-col :span="12" style="border-right: 1px solid;">      
                    <el-form-item label="报送人" prop="reportName">
                        <el-input v-model="$parent.dataForm.reportName" placeholder="报送人名称" readonly></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="12"> 
                    <!-- <el-form-item label="报送时间" prop="reportTime">
                        <el-input v-model="$parent.dataForm.reportTime" placeholder="报送时间"></el-input>
                    </el-form-item> -->
                    <el-form-item label="接报时间" prop="reportTime">
                        <el-date-picker
                        v-model="$parent.dataForm.reportTime"
                        type="datetime"
                        placeholder="选择接报时间" readonly>
                        </el-date-picker>
                    </el-form-item>
                    
                    </el-col>
                </el-row>  

                <el-row>
                    <el-col :span="12" style="border-right: 1px solid;"> 
                    <el-form-item label="报送电话" prop="reportPhone">
                        <el-input v-model="$parent.dataForm.reportPhone" placeholder="报送人电话" readonly></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    <!-- <el-form-item label="要情来源" prop="source">
                        <el-input v-model="$parent.dataForm.source" placeholder="要情来源"></el-input>
                    </el-form-item> -->
                    <el-form-item label="要情来源" prop="source">
                        <el-select v-model="$parent.dataForm.source" placeholder="选择要情来源" disabled>
                        <el-option
                            v-for="item in $parent.sourceOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                        </el-select>
                    </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12" style="border-right: 1px solid;"> 
                    <el-form-item label="要情标题" prop="title">
                        <el-input v-model="$parent.dataForm.title" placeholder="标题" readonly></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span="12">
                    <!-- <el-form-item label="要情分类" prop="type">
                        <el-input v-model="$parent.dataForm.type" placeholder="要情类型"></el-input>
                    </el-form-item> -->
                    <el-form-item label="要情分类" prop="type">
                        <el-cascader
                            v-model="$parent.dataForm.type"
                            :options="$parent.typeOptions"
                            disabled
                        />
                    </el-form-item>
                    </el-col>
                </el-row>
                
                <el-row>
                    <el-col :span="12" style="border-right: 1px solid;"> 
                    <!-- <el-form-item label="事发时间" prop="time">
                        <el-input v-model="$parent.dataForm.time" placeholder="事生时间"></el-input>
                    </el-form-item> -->
                    <el-form-item label="事发时间" prop="time">
                        <el-date-picker
                        v-model="$parent.dataForm.time"
                        type="datetime"
                        placeholder="选择事发时间" readonly>
                        </el-date-picker>
                    </el-form-item>  
                    </el-col>
                    <el-col :span="12">
                    <el-form-item label="事发地点" prop="address">
                        <el-input v-model="$parent.dataForm.address" placeholder="事发地点" readonly></el-input>
                    </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24"> 
                    <el-form-item label="要情详情" prop="detail">
                        <el-input style="resize:none;"
                        type="textarea"
                        :rows="2"
                        placeholder="要情详情"
                        v-model="$parent.dataForm.detail" readonly>
                        </el-input>
                    </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24"> 
                    <!--状态  0:代办  1:办理中   2:已办结 -->
                    <!-- <el-form-item label="要情状态" prop="status"> 
                        <el-input v-model="$parent.dataForm.status" placeholder="状态  0:代办  1:办理中   2:已办结"></el-input>
                    </el-form-item> -->

                    <el-form-item label="要情状态" prop="status">
                        <el-radio-group v-model="$parent.dataForm.status" disabled>
                        <el-radio :label="0">待办</el-radio>
                        <el-radio :label="1">办理中</el-radio>
                        <el-radio :label="2">已办完</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24"> 
                    <el-form-item label="拟办意见" prop="opinion">
                        <el-input v-model="$parent.dataForm.opinion" placeholder="拟办意见" readonly></el-input>
                    </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24"> 
                    <el-form-item label="领导批示" prop="leadershipDirective">
                        <el-input v-model="$parent.dataForm.leadershipDirective" placeholder="领导批示" readonly></el-input>
                    </el-form-item>
                    </el-col>
                </el-row>
                    
                <el-row style="border-bottom: 1px solid;">
                  
                    <el-col :span="24"> 
                    <el-form-item label="附件" style="height: 300px;overflow: auto;">
                        <el-upload
                        class="upload-demo" ref="upload"
                        :action="$window.SITE_CONFIG['cloudUrl']+'/upload/file'"
                        :data="{
                            emergencyInfoId:'',
                            token:$Cookies.get('token')
                        }"
                        :before-remove="beforeRemove"
                        multiple
                        :file-list="fileList">
                        <el-button size="small" type="primary" readonly>点击上传</el-button>
                        <div slot="tip" class="el-upload__tip" style="margin-top:15px;width:100%;" >
                            <div  v-for="(item,index) in $parent.dataForm.annex" :key="index" style="display: inline-block;width:23%;margin-right: 5px;margin-bottom: 5px;position:relative;">
                            <!-- <i v-if="item.type==0" class="iconfont icon-guanbi" @click="deleteImg(index)"  style="display: inline-block;position: absolute;line-height: 12px;font-size: 12px;color: white;background: #bcbcbc;right: 3%;top: 5%;border-radius: 50%;padding: 4px;"></i> -->
                            <!-- <viewer v-if="item.type==0" :images="[item.temporaryUrl]"> -->
                                <img  v-if="item.type==0" :src="item.temporaryUrl" style="width:100%;height:100px;"/>
                            <!-- </viewer> -->
                            </div>
                            
                        </div>         
                        </el-upload>
                    </el-form-item>
                    </el-col>
                </el-row>
                
                </el-form>
            
        </div>
        <!-- <span slot="footer" class="dialog-footer" style="">
            <el-button @click="dialogVisible=false;$parent.previewEmergencyDialogVisible=false;">取 消</el-button>
            <el-button @click="beforeConfirm" type="primary"  style="background:#1890ff;">确 定</el-button>
        </span> -->
        
    </el-dialog>
</template>

<script>

import Cookies from 'js-cookie';


export default {
  data () {
    return {
        $window:{},
        $Cookies:{},
        typeOptions: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        sourceOptions: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        dialogVisible:false,
        fileList:[],
        dataForm: {
          id: 0,
          reportName: '',
          reportPhone: '',
          reportTime: '',
          source: '',
          type: '',
          title: '',
          time: '',
          address: '',
          detail: '',
          status: '1',
          opinion: '',
          leadershipDirective: '',
          images: [],
          temporaryImages:[],
          annex: [], //附件
          longitude: '',
          latitude: '',
          createTime: '',
          updateTime: '',
          createUserId: '',
          updateUserId: '',
          isDeleted: '',
          array:[
            {
              reportName: '飞洒',
          reportPhone: '123165',
          reportTime: '08：40',
          source: '发生',
            },
            {
              reportName: '发放',
          reportPhone: '4568',
          reportTime: '09：40',
          source: '发申请',
            },
            {
              reportName: '回复',
          reportPhone: '5646',
          reportTime: '11：45',
          source: '我去',
            },
          ]
        },
        isUpdate:false,
        
        // dataRule: {
        //   reportName: [
        //     { required: true, message: '报送人名称不能为空', trigger: 'blur' }
        //   ],
        //   reportPhone: [
        //     { required: true, message: '报送人电话不能为空', trigger: 'blur' }
        //   ],
        //   reportTime: [
        //     { required: true, message: '报送时间不能为空', trigger: 'blur' }
        //   ],
        //   source: [
        //     { required: true, message: '要情来源不能为空', trigger: 'blur' }
        //   ],
        //   type: [
        //     { required: true, message: '要情类型不能为空', trigger: 'blur' }
        //   ],
        //   title: [
        //     { required: true, message: '标题不能为空', trigger: 'blur' }
        //   ],
        //   time: [
        //     { required: true, message: '事生时间不能为空', trigger: 'blur' }
        //   ],
        //   address: [
        //     { required: true, message: '事发地点不能为空', trigger: 'blur' }
        //   ],
        //   detail: [
        //     { required: true, message: '详情不能为空', trigger: 'blur' }
        //   ],
        //   status: [
        //     { required: true, message: '状态  0:代办  1:办理中   2:已办结不能为空', trigger: 'blur' }
        //   ],
        //   opinion: [
        //     { required: true, message: '拟办意见不能为空', trigger: 'blur' }
        //   ],
        //   leadershipDirective: [
        //     { required: true, message: '领导批示不能为空', trigger: 'blur' }
        //   ],
        //   images: [
        //     { required: true, message: '图片数组不能为空', trigger: 'blur' }
        //   ],
        //   annex: [
        //     { required: true, message: '附件数组不能为空', trigger: 'blur' }
        //   ],
        //   longitude: [
        //     { required: true, message: '经度不能为空', trigger: 'blur' }
        //   ],
        //   latitude: [
        //     { required: true, message: '维度不能为空', trigger: 'blur' }
        //   ],
        //   createTime: [
        //     { required: true, message: '创建时间不能为空', trigger: 'blur' }
        //   ],
        //   updateTime: [
        //     { required: true, message: '更新时间不能为空', trigger: 'blur' }
        //   ],
        //   createUserId: [
        //     { required: true, message: '创建用户不能为空', trigger: 'blur' }
        //   ],
        //   updateUserId: [
        //     { required: true, message: '更新用户不能为空', trigger: 'blur' }
        //   ],
        //   isDeleted: [
        //     { required: true, message: '是否删除 0否 1删除不能为空', trigger: 'blur' }
        //   ]
        // }
    }
  },
  components: {

  },
  
  created(){
    this.$window=window
    this.$Cookies=Cookies
    this.fileList=this.$parent.dataForm.annex
  },
  mounted(){
  
  },
  watch:{
  },
  methods: {
    beforeRemove(file, fileList) {
        return false;
    },
    // init(item){
    //     console.log("编辑节假日",item)
    //     this.dataForm.id=item.id
    //     this.dataForm.name=item.name
    //     this.dataForm.dateRange=[new Date(item.startDate.split('-').join()),new Date(item.endDate.split('-').join())] 
    //     this.isUpdate=true
    // },
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
    // beforeConfirm(){
    //     if(this.isUpdate){
    //         this.$confirm('是否更新用该模板生成的班次', {
    //             confirmButtonText: '确定',
    //             cancelButtonText: '取消',
    //             type: 'warning'
    //         }).then(() => {
              
    //             this.commit()
    //         }).catch(() => {
                
    //             this.commit()        
    //         });
    //     }else{
    //         console.log("日期范围",this.dataForm.dateRange)
    //         this.commit()
    //     }
    // },
    // commit(){
    //     this.$refs['dataForm'].validate((valid) => {
    //         if (valid) {
                
    //             this.$http({
    //             url: this.$http.adornUrl(this.isUpdate?'/duty/dutyscheduleholidaysetting/update':'/duty/dutyscheduleholidaysetting/save'),
    //             method: 'post',
    //             data: this.$http.adornData({
    //                 "id":this.isUpdate?this.dataForm.id:'',
    //                 "name":this.dataForm.name,
    //                 "startDate":this.dateFormatter(this.dataForm.dateRange[0]).substr(0,10),
    //                 "endDate":this.dateFormatter(this.dataForm.dateRange[1]).substr(0,10)
    //             })
    //             }).then(({ data }) => {
                

    //             if (data && data.code === 0) {
    //                 // 详细联系人列表
    //                 console.log("保存更新节假日",data)
    //                 this.$message({
    //                     message: this.isUpdate?'更新成功!':'保存成功!',
    //                     type: 'success'
    //                 })
    //                 this.$parent.previewEmergencyDialogVisible=false;
    //                 this.dialogVisible=false;
    //                 this.$parent.getHolidays()
    //                 this.$parent.updateAllView('updateSchedules')
    //             }else{
    //                 this.$message({
    //                 message: `${data.msg}`,
    //                 type: 'error'
    //                 })
    //             }
    //             })

    //         } else {
    //             console.log('error submit!!');
    //             return false;
    //         }
    //     });
           
    // },
 
    handleClose(done) {
        this.$confirm('确认关闭？')
        .then(_ => {
            // console.log("this.$parent",this.$parent)
            this.dialogVisible=false
            this.$parent.previewEmergencyDialogVisible=false
            done();
            
        })
        .catch(_ => {});
    }
    
  }
}
</script>
<style lang="less" >

    .previewEmergencyDialog{
        .el-dialog{
            min-width: 659px;
            border-radius: 10px;
            // overflow: hidden;
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
              text-align: center!important;margin-top: -30px!important;padding-bottom: 30px!important;
          }
        }
        
        .el-range-separator{
            width: auto!important;
        } 
        .el-upload.el-upload--text{
            display: none;
        }
        .el-upload-list__item-status-label{
            display: none!important;
        }
        
       
    }
    
</style>
