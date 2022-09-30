<template>
  <div class="details">
    <!--有数据时候显示-->
    <template>
    <el-row class="title">

      <div class="tittle tittle-box">{{detailData.title}}</div>

    </el-row>
    <div class="title-btn-box">
      <el-button size="mini" type="primary" plain @click="handleShowAtt" style="padding:7px 6px;" v-show="attList.length"><span style="display:flex;align-items:center;font-size:13px;"> <i class="iconfont icon-fujian" size="mini" style="vertical-align: middle;margin-right:7px;font-size:18px;"></i><span>附件{{attList.length}}个</span></span></el-button>
      <el-button size="mini" type="primary" plain style="padding:7px 6px;margin-left: 0;" v-show="!attList.length"><span style="display:flex;align-items:center;font-size:13px;"> <i class="iconfont icon-fujian" size="mini" style="vertical-align: middle;margin-right:7px;font-size:18px;"></i><span>暂无附件</span></span></el-button>
    </div>
    <div style="clear:both"></div>

    <el-row id="inputs" style="margin: 10px 0 0 10px;color:rgba(162,162,162,1);font-size: 14px">
      <el-col :span="24">
        <el-row>
          <!-- <el-col :span="12" style="overflow: hidden;padding-right:10px;" :title="detailData.unit">
            <template>
            <span class="detailDescTitle">负责单位</span>
              <el-input style="width: 200px" v-model="detailData.unit" placeholder="请输入内容" disabled></el-input>
            </template>
          </el-col> -->
          <el-col :span="12" style="overflow: hidden;padding-right:10px;" :title="detailData.principal">
            <template>
              <span class="detailDescTitle"> 负责人   &nbsp;&nbsp;</span>
              <el-input style="width: 200px" v-model="detailData.principal" placeholder="无" disabled></el-input>
            </template>
          </el-col>
          <el-col :span="12" style="overflow: hidden;padding-right:10px;">
            <template>
              <span class="detailDescTitle">执行时间</span>
              <el-input style="width: 200px" v-model="detailData.executeTime" placeholder="无" disabled></el-input>
            </template>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <!-- <el-col :span="12" style="overflow: hidden;padding-right:10px;" :title="detailData.status">
            <template>
              <span class="detailDescTitle">执行情况</span>
              <el-input style="width: 200px" v-model="detailData.status" placeholder="请输入内容" disabled></el-input>
            </template>
          </el-col> -->
        </el-row>
      </el-col>
    </el-row>
    <el-row style="margin:10px 10px 0;padding: 5px;height:515px;overflow-y:scroll;border-radius:3px;border:1px solid rgba(221,221,221,1);">
<!--      <el-scrollbar style="height: 100%;border: 1px solid #ccc;padding: 20px;box-sizing: border-box">-->
<!--        <el-col>-->
            <p style="white-space: pre-wrap;margin: 0;word-break:break-all;text-align:left;color:#333;font-size:15px;">{{detailData.content}}</p>
<!--        </el-col>-->
<!--      </el-scrollbar>-->
    </el-row>
    </template>
    <!--无数据的时候提醒-->
    <template v-if="flag">
      <el-row style="margin-top: 300px">
        暂无数据,请点击上方 <b style="color:red">新增</b> 按钮添加数据
      </el-row>
    </template>
    <attachment-popup ref="AttachmentPopup"></attachment-popup>
  </div>

</template>

<script>
  import attachmentPopup from "@/view/yz_informationDynamics/governmentAffairs/attachmentPopup";
  export default {
    name: "tableDetails",
    components: {attachmentPopup},
    data() {
      return {
        id: "",
        detailData:{
          title: "",//标题
          unit: "",//责任单位
          principal: "",//负责人
          executeTime: "",//执行时间
          status: "",//执行情况
          content: "",//内容
        },
        attList: [],//附件列表
        // type: "",//信息动态类型
        flag: false//是否提醒无消息指示旗
      }
    },
    methods: {
      showData(row) {
         this.detailData.principal= ""
        this.$api.seeAffairsDetail({id:row.id}).then(res=>{
          if(res.errorcode!=0){
            this.$message({
              message:res.msg,
              type:"error"
            });
            return
          }
          // this.attList = res.attachment
          for (const key in this.detailData) {
            if (res.data.hasOwnProperty(key)) {
              console.log(key)
              this.detailData[key] = res.data[key];
              // 执行时间显示到分钟
              this.detailData['executeTime'] = res.data['executeTime'].substring(0,res.data['executeTime'].lastIndexOf(':'))
              // console.log(res.data[1].substring(0,res.data[key].executeTime.lastIndexOf(':')))

            }
          }

          res.data.appSjsAffairsContacotrVos.map(v=>{
            this.detailData.principal += v.appContactorName + "，"
          })
          this.detailData.principal = this.detailData.principal.substring(0,this.detailData.principal.length-1)
          this.attList = res.data.appSjsAffairsFiles
        })
      },
      //点击显示附件下载框
      handleShowAtt() {
        this.$nextTick(() => {
          this.$refs.AttachmentPopup.isDialogVisible = true;
          this.$refs.AttachmentPopup.showAtt(this.attList);
        });
      },
      //如果没有附件点击下载框就弹出添加框
      handleAddAtt() {
        //该功能暂时废止
        if (this.id){
          this.$emit('handleAddAtt')
        }
      }
    },
      mounted() {
        // if(this.unit==''&&this.principal==''&&this.time==''&&this.status==''){
        //     console.log(this.unit,this.principal,this.time,this.status)
        //     let aa=document.getElementById("inputs")
        //     aa.removeAttribute()
        //     console.log(aa)
        // }
        // else{
        //     console.log(this.unit,this.principal,this.time,this.status)
        // }
      }
  }
</script>

<style scoped>
  .details {
    margin: 10px 10px 0;
    height: 790px;
    background-color: white;
    box-shadow:0px 3px 10px 2px rgba(54,121,225,0.09);
    border-radius: 3px;
    overflow: auto;
    box-sizing: border-box;
    padding-bottom:10px;
  }

  .title {
    margin-top: 16px;
    min-height: 53px;
    font-size: 24px;
    font-family: Microsoft YaHei, sans-serif;
    font-weight: 400;
    color: rgba(50, 50, 50, 1);
  }

  >>> .el-col {
    text-align: left;
  }

  >>> .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .detailDescTitle{
    color: #555;
    padding-right:10px;
  }
   .title{
    text-align: right;
    font-size: 19px;
    font-weight: bold;
    color: #333;
  }
  .tittle-box{
    text-align:center;
    margin: 11px 13px 6px;
    word-break: break-all;
  }
  .title-btn-box{
    float: right;
    margin-right: 10px;
  }

>>> .el-input.is-disabled .el-input__inner{
  overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 暂无附件按钮默认样式 */
>>> .el-button--primary.is-plain{
  color: #0091ff;
  border-radius: 3px;
  background:rgba(0,145,255,0.08);
  border:1px solid rgba(197,222,254,1);
}
/* 暂无附件按钮鼠标悬停样式 */
>>> .el-button--primary.is-plain:focus, .el-button--primary.is-plain:hover {
  color: white;
  background:#0091ff;
  border:1px solid #0091ff;
}
</style>
