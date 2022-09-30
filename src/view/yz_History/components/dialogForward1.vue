<template>
  <div class="container ">
    <el-row style="height: 50px;position: relative;background: #F1F4F6">
      <h3 style="text-align: left;line-height: 50px;font-size: 17px;margin:0 0 0 20px">短信发送</h3>
      <div style="position: absolute;right: 10px;top: 10px;font-size: 25px;cursor: pointer;" @click="close"><span class="el-icon-close"></span></div>
    </el-row>
    <el-row >
      <el-col :span="13">
        <test @findfaxDataS="selection"></test>
      </el-col>
      <el-col :span="11" style="padding:10px">
        <div class="mgb10" style="height: 225px; padding:10px; border-radius:4px;border:1px solid #ddd;position: relative;">
          <el-tag
            style="margin:0 10px 10px 0"
            v-for="(tag,i) in tags"
            :key="i"
            closable
            @close="handleClose(tag)">
            {{tag.name}}
          </el-tag>
          <div class="addressee_box">
            <span>收信人</span>
            <div>{{tags.length}}</div>
          </div>
        </div>
        <div class="mgb10" >
          <h2 class="title" style="margin-bottom: 28px;">短信内容</h2>
          <el-input
            type="textarea"
            placeholder="请输入内容"
            maxlength="500"
            show-word-limit
            class="textContent"
            v-model="textContent"
          >
          </el-input>
        </div>
      </el-col>
    </el-row>
    <div class="footer_box" >
      <el-button @click="close">取消</el-button>
      <el-button type="primary">发送</el-button>
    </div>
  </div>
</template>

<script>
  import test from "./test";
  export default {
    name: "dialogForward1",
    components:{
      test,
    },
    data(){
      return {
        textContent:'',
        relatedEvent:'',
        // 标签
        tags: [

        ],
        time:null,
      }
    },
    methods:{
      close(){
        this.$emit('closeDialog',false)
      },
      updateContent(text,event){
        this.textContent = text
        this.relatedEvent = event
        this.tags = []
        console.log(text,event)
      },
      handleClose(tag){
        this.tags.splice(this.tags.indexOf(tag),1)
      },
      selection(val){
        console.log(val)
        let flag = true

        this.tags.forEach(item=>{
          if(item.id == val.id){
            this.debounceMsg()
            flag = false
            return
          }
        })
        if(flag) this.tags.push(val)
      },
      debounceMsg(){
        if(this.time) clearTimeout(this.time)
        this.time = setTimeout(()=>{
          this.$message.warning("已添加进发送列表")
        },10)

      },

    },
  }
</script>

<style scoped>
  .container{
    padding: 0;
    position: fixed;
    top: 10%;
    left: 10%;
    z-index: 99;
    overflow: auto;
    width:1300px;
    height:800px;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 21px 3px rgba(0,0,0,0.27);
    border-radius:7px;
  }
  .mgb10{
    margin: 15px;
    text-align: left;
  }
  .textContent >>>.el-textarea__inner{
    min-height: 280px!important;
    max-height: 280px!important;
  }
  .addressee_box{
    position: absolute;
    left: 10px;
    bottom: 10px;
  }
  .addressee_box span{
    font-size: 14px;
    color: #666;
  }
  .addressee_box div{
    display: inline-block;
    padding: 5px 10px;
    background: #F3F3F7;
    border-radius:6px;
  }
  .footer_box{
    text-align: right;
    border-top:1px solid #E9ECF1;
    margin-top: 10px;
    padding: 18px 30px 22px 0;
  }
</style>
