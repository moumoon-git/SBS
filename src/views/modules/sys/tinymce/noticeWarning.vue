<template>
  <div style="padding-bottom:100px;min-height: 500px;">
    <el-button @click="$router.go(-1)">返回</el-button>

    <div style="">

      <div>
        <el-form label-width="100px"  :model="dataForm" ref="dataForm" style="width:50%;margin: 0 auto; margin-bottom: 20px;">

          <el-form-item label="公告标题:" style="margin-top: 50px">
            <el-input v-model="dataForm.title"  placeholder="请输入公告标题" style="width: 100%;margin: 0 auto; margin-bottom: 20px;"></el-input>
          </el-form-item>

          <el-form-item label="公告类型">
            <el-popover
              ref="noticeTypeListPopover"
              placement="right"
              trigger="click"

            >
              <el-tree
                :data="noticeTypeList"
                :props="noticeTypeListTreeProps"
                node-key="id"
                ref="noticeTypeListTree"
                @current-change="noticeTypeListTreeCurrentChangeHandle"
                :default-expand-all="false"
                :auto-expand-parent="true"
                :highlight-current="true"
                :expand-on-click-node="true"
              >
              </el-tree>
            </el-popover>
            <el-input v-model="dataForm.noticeTypeName"
                      v-popover:noticeTypeListPopover
                      :readonly="true"
                      style="width: 100%;margin: 0 auto; margin-bottom: 20px;" placeholder="点击公告类型" class="menu-list__input">

            </el-input>
          </el-form-item>


          <el-form-item label="发送方式">
            <el-select v-model="dataForm.sendFlag" placeholder="请选择报送方式" style="width: 100%;margin: 0 auto; margin-bottom: 20px;">
              <el-option
                v-for="item in sendMethodList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="收件人员">
            <el-input v-model="dataForm.receiveContactorNameStr" :readonly="true"  @click.native="handelVerify"
                      style="width: 100%;margin: 0 auto; margin-bottom: 20px;"></el-input>
          </el-form-item>

        </el-form>

        <!--富文本框-->
        <div id="noticeWarning" style="margin-top:50px;width: 100%;">
        </div>
      </div>

      <div style="float:right; margin-top:20px;">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </div>

    </div>


    <!--服务号多人选择组件-->
    <LinkmanDraggable ref="commonLink" v-show="showcommonLink" @OnchildByValue="handelLinkdata"></LinkmanDraggable>

    <!--短信多人选择组件-->
    <MobileLinkmanDraggable ref="mobilecommonLink" v-show="mobileshowcommonLink" @OnchildByValue="mobilehandelLinkdata"></MobileLinkmanDraggable>

  </div>
</template>

<script>

  var E = require('wangeditor')

  //openid为空禁用
  import LinkmanDraggable from '@/views/common/NoticeLinkmanDraggable '

  //手机号为空禁用
  import MobileLinkmanDraggable from '@/views/common/MobileLinkmanDraggable '

  //import { getRules } from '@/utils/rules'

  export default {

    components: {
      LinkmanDraggable,
      MobileLinkmanDraggable
    },

    data () {
      return {

        showcommonLink: false, // 获取多人联系人弹窗
        mobileshowcommonLink: false, // 获取多人联系人弹窗

        //公告类型数据
        noticeTypeList: [],

        //发送方式
        sendMethodList: [],

        typeDisableFlag:true,

        noticeTypeListTreeProps: {
          label: 'name',
          children: 'children'
        },

        dataForm:{
          //构造事件类型数据
          title: '',
          noticeTypeId: '',
          noticeTypeName: '',
          sendFlag: '',
          receiveContactorList: [],
          //拼接名字
          receiveContactorNameStr: ''
        },

        editor:{},
        duplicate:{
          dataForm:{},
          edit:{}
        },
        dataRules:{}
      }
    },

    watch:{
      'dataForm.sendFlag': function (newVal, oldVal) {
        this.dataForm.receiveContactorNameStr = '';
      }
    },

    mounted(){
      this.getInitData();
      //this.dataRules=getRules()
      this.dataForm.noticeTypeName = this.$route.query.name; // 获取公告类型的名字
      this.dataForm.noticeTypeId = this.$route.query.id; // 获取公告类型的Id
      this.editor = new E('#noticeWarning')
      // editor.customConfig.uploadImgServer = '/upload'
      this.editor.customConfig.uploadImgShowBase64 = true
      this.editor.customConfig.showLinkImg = false
      this.editor.customConfig.uploadImgServer = `${window.SITE_CONFIG['baseUrl']}/upload/file`;
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
          var url =window.SITE_CONFIG['cloudUrl']+'/'+result.url;
          // console.log("url",url)
          insertImg(url);

          // result 必须是一个 JSON 格式字符串！！！否则报错
        }
      }
      this.editor.create()

      document.querySelector(".el-input__inner").focus()

      if(this.$route.query.item){
        this.dataForm.id=this.$route.query.item.id
        this.dataForm.mainTitle=this.$route.query.item.title
        document.querySelector("#safeEducation > div.w-e-text-container").innerHTML=this.$route.query.item.content
        this.editor.txt.html(this.$route.query.item.content)
      }
      // console.log("this.$router",this.$route)
    },

    methods: {

      // 核实人员，处置人员弹窗多选组件 返回数据
      handelLinkdata ({ linkman, name }) {
        // console.log("openid======================================",linkman)
        //先清空
        this.dataForm.receiveContactorList = [];
        this.dataForm.receiveContactorNameStr = '';

        for(var i=0; i<linkman.length; i++){

          var contactor = {
            'id': linkman[i].id,
            'mobile1': linkman[i].mobile1,
            'contactorName': linkman[i].name,
            'openId': linkman[i].openId,
            'contactorFlag': 1
          }

          //组成
          this.dataForm.receiveContactorNameStr =  this.dataForm.receiveContactorNameStr + linkman[i].name.trim() + "、"

          //添加进去数组
          this.dataForm.receiveContactorList.push(contactor);

        }

      },

      mobilehandelLinkdata({ linkman, name }){
        // console.log("mobile======================================",linkman)
        //先清空
        this.dataForm.receiveContactorList = [];
        this.dataForm.receiveContactorNameStr = '';

        for(var i=0; i<linkman.length; i++){

          var contactor = {
            'id': linkman[i].id,
            'mobile1': linkman[i].mobile1,
            'name': linkman[i].name,
            'openId': linkman[i].openId,
            'contactorFlag': 1
          }

          //组成
          this.dataForm.receiveContactorNameStr =  this.dataForm.receiveContactorNameStr + linkman[i].name.trim() + "、"

          //添加进去数组
          this.dataForm.receiveContactorList.push(contactor);

        }

      },

      // 触发多选组件
      handelVerify (name) {

        if(!this.dataForm.sendFlag){
          this.$message({
            message: '请先选择发送方式',
            type: 'warning'
          });
          return;
        }

        if(this.dataForm.sendFlag == '10'){
          //服务号发送
          this.showcommonLink = true
          this.$refs.commonLink.handleAddContacts(
            '/mail/mailgroup/list',
            '请选择',
            name
          )
        }else if(this.dataForm.sendFlag == '2'){
          //短信发送
          this.mobileshowcommonLink = true
          this.$refs.mobilecommonLink.handleAddContacts(
            '/mail/mailgroup/list',
            '请选择',
            name
          )
        }else{
          // console.log("其他发送")
          this.mobileshowcommonLink = true
          this.$refs.mobilecommonLink.handleAddContacts(
            '/mail/mailgroup/list',
            '请选择',
            name
          )
        }

      },

      getInitData(){
        //请求事件类型树型数据
        this.$http({
          url: this.$http.adornUrl(`/notice/noticetype/list`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          // console.log("noticeTypeList::::",data)
          //本平台转成树形
          this.noticeTypeList = data.data;

        }).then(()=>{
          this.$http({
            url: this.$http.adornUrl(`/notice/noticemanagement/reportMethodList`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code == 0) {
              // console.log("sendMethodList::::",data)
              //本平台转成树形
              this.sendMethodList = data.list;
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },


      // 事件类型设置当前选中节点 (修改、增加时调用)
      noticeTypeListTreeSetCurrentNode () {
        this.$refs.noticeTypeListTree.setCurrentKey(this.dataForm.noticeTypeId)
        this.dataForm.noticeTypeName = (this.$refs.noticeTypeListTree.getCurrentNode() || {})['name']
      },

      // 事件类型选中
      noticeTypeListTreeCurrentChangeHandle (data, node) {
        // console.log("data:::",data)
        this.dataForm.noticeTypeId = data.id
        this.dataForm.noticeTypeName = data.name
      },

      submit(){

        this.$refs.dataForm.validate(valid => {
          var that=this
          //添加
          if (valid && !this.$route.query.item) {
            if(this.duplicate.editor===this.editor.txt.html() && Object.keys(this.duplicate.dataForm).length>0 && Object.keys(that.duplicate.dataForm).every(function (elem, index, arr) {return that.duplicate.dataForm[elem] === that.dataForm[elem];}) ){
              this.$message({
                type: 'warning',
                message: '请不要重复提交！'
              })
              return;
            }else {
              this.duplicate.dataForm=JSON.parse(JSON.stringify(this.dataForm));
              this.duplicate.editor=this.editor.txt.html()

            }

            if(!this.dataForm.title){
              this.$message({
                type: 'warning',
                message: '请输入公告标题！'
              })
              return;
            }

            if(!this.dataForm.noticeTypeId){
              this.$message({
                type: 'warning',
                message: '请选择公告类型！'
              })
              return;
            }

            if(!this.editor.txt.text()){
              this.$message({
                type: 'warning',
                message: '请输入富文本内容！'
              })
              return;
            }
            // console.log("editor.txt.html(),editor.txt.text()",this.editor.txt.html(),this.editor.txt.text())
            this.$http({
              url: this.$http.adornUrl(`/notice/noticemanagement/save`),
              method: 'POST',
              data: this.$http.adornData({
                'title': this.dataForm.title,
                'noticeTypeId': this.dataForm.noticeTypeId,
                'noticeTypeName': this.dataForm.noticeTypeName,
                'sendFlag': this.dataForm.sendFlag,
                'receiveContactorList': this.dataForm.receiveContactorList,
                'content':document.querySelector(".w-e-text-container").innerHTML

              })
            }).then((res) => {
              console.log('res: ', res.data);
              if (res.data && res.data.code == 0) {
                this.$message({
                  type: 'success',
                  message: '提交成功!'
                })
                // console.log("上传成功",res)
                this.$router.go(-1)
              } else {
                this.$message.error(res.msg)
              }
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

            this.$http({
              url: this.$http.adornUrl(`/notice/noticemanagement/update`),
              method: 'POST',
              data: this.$http.adornData({
                'id':this.dataForm.id,
                'title': this.dataForm.title,
                'noticeTypeId': this.dataForm.noticeTypeId,
                'noticeTypeName': this.dataForm.noticeTypeName,
                'sendFlag': this.dataForm.sendFlag,
                'receiveContactorList': this.dataForm.receiveContactorList,
                'content':document.querySelector(".w-e-text-container").innerHTML
              })
            }).then((res) => {
              if (res && res.code == 0) {
                this.$message({
                  type: 'success',
                  message: '提交成功!'
                })
                // console.log("上传成功",res)
                this.$router.go(-1)
              } else {
                this.$message.error(res.msg)
              }
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
    z-index: 1 !important;
    height: 400px !important;/*!important是重点，因为原div是行内样式设置的高度300px*/
  }

  .w-e-menu{
    z-index: 2 !important;
  }


</style>
