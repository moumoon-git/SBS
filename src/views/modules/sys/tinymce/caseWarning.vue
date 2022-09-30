<template>
  <div style="padding-bottom:100px;">
    <el-button @click="$router.go(-1)">返回</el-button>
    <el-form label-width="100px" :rules="dataRules" :model="dataForm" ref="dataForm" style="margin-top:50px;">
      <el-form-item label="主标题:" style="width: 65%;margin: 0 auto;margin-bottom: 20px;" prop="mainTitle">
        <el-input v-model="dataForm.mainTitle"  placeholder="请输入主标题"></el-input>
      </el-form-item>

      <el-form-item label="副标题:" style="width: 65%;margin: 0 auto; margin-bottom: 20px;" prop="subTitle" >
        <el-input v-model="dataForm.subTitle" placeholder="请输入副标题"></el-input>
      </el-form-item>

        <!-- <el-form-item label="发生时间:" style="width: 65%;margin: 0 auto; margin-bottom: 20px;" prop="dateTime">
          <el-date-picker
            v-model="dataForm.dateTime" value-format="yyyy-MM-dd HH:mm:ss" @focus="dateTimeOnfocus"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item> -->

        <el-form-item label="标签:"  style="width: 65%;margin: 0 auto; margin-bottom: 20px;" prop="tag">
          <el-input v-model="dataForm.tag"  placeholder="请输入多个标签，以逗号分隔开来"></el-input>
        </el-form-item>

        <el-form-item label="封面图片:" style="width: 65%;margin: 0 auto; margin-bottom: 20px;" prop="subTitle" >
          <el-upload
            :limit="1"
            :headers="{
              'token': this.$cookie.get('token')
            }"
            :file-list="fileList"
            :action="$window.SITE_CONFIG['baseUrl']+'/upload/articleImages'"
            list-type="picture-card"
            :on-success="onSuccess"
            >
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{file}" v-if="!file.url">
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url" alt=""
                >
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleDownload(file)"
                  >
                    <i class="el-icon-download"></i>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>

    </el-form>

    <div id="caseWarning" style="margin-top:50px;z-index:1;">

    </div>
    <div style="float:right;margin-top:20px;">
      <el-button type="primary" @click="submit">提交</el-button>
      <el-button @click="reset">重置</el-button>
    </div>

  </div>
</template>

<script>

var E = require('wangeditor')

import { getRules } from '@/utils/rules'

export default {
  data () {
    return {
      dataForm:{
        id:'',
        mainTitle:'',
        subTitle:'',
        dateTime:'',
        tag:'',
        coverImage:''
      },
      fileList: [],
      editor:{},
      duplicate:{
        dataForm:{},
        edit:{}
      },
      dataRules:{},
      dialogImageUrl: '',
        dialogVisible: false,
        disabled: false
    }
  },
  created(){
    this.$window=window
    
  },
  mounted(){
    this.dataRules=getRules()

    setTimeout(()=>{
      this.editor = new E('#caseWarning')
      // editor.customConfig.uploadImgServer = '/upload'
      this.editor.customConfig.uploadImgShowBase64 = true
      this.editor.customConfig.showLinkImg = false
      this.editor.customConfig.uploadImgServer = `${window.SITE_CONFIG['cloudUrl']}/upload/file`;
      this.editor.customConfig.uploadFileName = 'file'
      this.editor.customConfig.uploadImgHeaders = {
          'token': this.$cookie.get('token')
      }
      this.editor.customConfig.uploadImgHooks = {
        before: function (xhr, editor, files) {
          // 图片上传之前触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

          // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
          // return {
          //     prevent: true,
          //     msg: '放弃上传'
          // }
      },
      success: function (xhr, editor, result) {
          // 图片上传并返回结果，图片插入成功之后触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      customInsert: function (insertImg, result, editor) {
                  // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                  // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
                  // console.log("上传图片成功",result)
                  // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
                  var url =window.SITE_CONFIG['baseUrl']+'/'+result.url;
                  insertImg(url);

                  // result 必须是一个 JSON 格式字符串！！！否则报错
              }
          }
     
        this.editor.create()
    

      document.querySelector(".el-input__inner").focus()

      
        if(this.$route.query.item){
            // console.log("this.$route.query.item.content",this.$route.query.item.content,typeof this.$route.query.item.content,this.$route.query.item)
            // console.log("this.$route.query.item.coverImage",window.btoa(this.$route.query.item.coverImage))
            var a=this.$route.query.item.content
            this.dataForm.id=this.$route.query.item.id
            this.dataForm.mainTitle=this.$route.query.item.title
            this.dataForm.subTitle=this.$route.query.item.subtitle
            this.dataForm.dateTime=this.$route.query.item.createTime
            this.dataForm.tag=this.$route.query.item.label
            this.dataForm.coverImage=this.$route.query.item.coverImage
            if(this.$route.query.item.coverImage.search("http")==-1){
              this.fileList=[{url:window.SITE_CONFIG['baseUrl']+'/'+this.$route.query.item.coverImage}]
            }else{
              this.fileList=[{url:this.$route.query.item.coverImage}]
            }
            
            // document.querySelector("#caseWarning > div.w-e-text-container").innerHTML=this.$route.query.item.content
            
            this.editor.txt.html(this.$route.query.item.content)
  
        }
    })
    
    // console.log("this.$router",this.$route)
  },
  components: {

  },
  methods: {
    onSuccess(response, file, fileList){
      // console.log("response, file, fileList",response, file, fileList)
      this.dataForm.coverImage=response.url
    },
    handleRemove(file,obj) {
        // console.log(file);
        file.url=''
      },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      // console.log(file);
    },
    dateTimeOnfocus(){
      setTimeout(()=>{
        document.querySelector("body > div.el-picker-panel.el-date-picker.el-popper.has-time").setAttribute("style","z-index: 99999999999999999999999;position: absolute;top: 324px;left: 604px;}")
      })
    },
    submit(){
      // console.log("this.dataForm",this.dataForm)

      this.$refs.dataForm.validate(valid => {
       var that=this
        //新增
        if (valid && !this.$route.query.item) {
            if(this.duplicate.editor===this.editor.txt.html() && Object.keys(this.duplicate.dataForm).length>0 && Object.keys(that.duplicate.dataForm).every(function (elem, index, arr) {return that.duplicate.dataForm[elem] === that.dataForm[elem];}) ){
            this.$message({
              type: 'info',
              message: '请不要重复提交！'
            })
            return;
          }else {
            this.duplicate.dataForm=JSON.parse(JSON.stringify(this.dataForm));
            this.duplicate.editor=this.editor.txt.html()

          }

          if(!this.editor.txt.text()){
            this.$message({
              type: 'info',
              message: '请输入富文本内容！'
            })
            return;
          }
          if(!this.dataForm.coverImage){
            this.$message({
              type: 'info',
              message: '请上传封面图片！'
            })
            return;
          }
          // console.log("editor.txt.html(),editor.txt.text()",this.editor.txt.html(),this.editor.txt.text())
          this.$http({
            url: this.$http.adornUrl(`/article/articlesafewarning/save`),
            method: 'POST',
            data: this.$http.adornData({
              title:this.dataForm.mainTitle,
              subtitle:this.dataForm.subTitle,
              createTime:this.dataForm.dateTime,
              label:this.dataForm.tag,
              'content':document.querySelector(".w-e-text").innerHTML,
              coverImage:this.dataForm.coverImage
            })
          }).then((res) => {
            if(res.data.code==0){
              this.$message({
                type: 'success',
                message: '提交成功!'
              })
              //  console.log("上传成功",res)
            }else{
              this.$message({
                type: 'error',
                message: '提交失败!'
              })
            }
        
           
            this.$router.go(-1)
          })
        }

        //更新
        if(valid && this.$route.query.item){
            if(this.duplicate.editor===this.editor.txt.html() && Object.keys(this.duplicate.dataForm).length>0 && Object.keys(that.duplicate.dataForm).every(function (elem, index, arr) {return that.duplicate.dataForm[elem] === that.dataForm[elem];}) ){
              this.$message({
                type: 'info',
                message: '请不要重复提交！'
              })
              return;
            }else {
              this.duplicate.dataForm=JSON.parse(JSON.stringify(this.dataForm));
              this.duplicate.editor=this.editor.txt.html()

            }

            if(!this.editor.txt.text()){
              this.$message({
                type: 'info',
                message: '请输入富文本内容！'
              })
              return;
            }
            if(!this.dataForm.coverImage){
              this.$message({
                type: 'info',
                message: '请上传封面图片！'
              })
              return;
            }
            // console.log("editor.txt.html(),editor.txt.text()",this.editor.txt.html(),this.editor.txt.text())
            this.$http({
              url: this.$http.adornUrl(`/article/articlesafewarning/update`),
              method: 'POST',
              data: this.$http.adornData({
                id:this.dataForm.id,
                title:this.dataForm.mainTitle,
                subtitle:this.dataForm.subTitle,
                createTime:this.dataForm.dateTime,
                label:this.dataForm.tag,
                'content':document.querySelector(".w-e-text").innerHTML,
                coverImage:this.dataForm.coverImage
              })
            }).then((res) => {
              if(res.data.code==0){
                this.$message({
                  type: 'success',
                  message: '提交成功!'
                })
                // console.log("上传成功",res)
              }else{
                this.$message({
                  type: 'error',
                  message: '提交失败!'
                })
              }
      
              
              this.$router.go(-1)
            })
        }

      })



    },
    reset(){
      this.editor.txt.clear()
    }
  }

}
</script>
<style lang="less" >

.w-e-text-container{
    
    height: 500px !important;/*!important是重点，因为原div是行内样式设置的高度300px*/
    h1{
      font-size: 2em!important;
    }
    h2{
      font-size: 1.5em!important;
    }
    h3{
      font-size: 1.17em!important;
    }
    h4{
      font-size: 1em!important;
    }
    h5{
      font-size: 0.83em!important;
    }
}

</style>
