<template>
  
    <el-dialog
    title=""
    :visible.sync="dialogVisible" @close="serviceObject=[];serviceObjectData=[];dialogVisible=false;$parent.showServiceObjectDialog=false;"
    width="35%" 
    >
        
        <el-transfer v-model="serviceObject" :data="serviceObjectData" ></el-transfer>
        

        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible=false;$parent.showServiceObjectDialog=false;" plain size="small">取 消</el-button>
            <el-button type="primary" @click="confirm" size="small">确 定</el-button>
        </span>
    </el-dialog>
  
</template>

<script>
import $ from 'jquery'
function init() {
  this.$http({
          url: this.$http.adornUrl(
            this.servePort[`${this.eventTypeFlag}`]
          ),
          method: 'get',
          params: this.$http.adornParams({
            page: this.pageNumber,
            limit: 200,
            eventTypeId: this.eventTypeId,
            platformId: this.$store.state.user.platformId,
            key: this.key
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.serviceObjectData=[]
            if(this.servePort[`${this.eventTypeFlag}`]==='/risk/riskcamera/getList'){
              data.data.records.forEach(element => {
                this.serviceObjectData.push({key:element.id,label:element.name,disabled:false})
              });
            }
            else if(this.servePort[`${this.eventTypeFlag}`]==='/risk/riskvehicleblacklist/listNoPage'){
              data.list.list.forEach(element => {
                this.serviceObjectData.push({key:element.id,label:element.carNum,disabled:false})
              });
            }
            else{
              data.data.list.forEach(element => {
                this.serviceObjectData.push({key:element.id,label:element.name,disabled:false})
              });
            }
            } else {
              this.$message.error(data.msg)
            }
        })
}
export default {
  props: [
    'eventTypeFlag',
    'eventTypeId',
    'eventTypeName'
  ],
  data() {
    return {
      row:{},
      column:{},
      dialogVisible: false,
      serviceObject:[],
      serviceObjectData:[],
      pageNumber:1,
      servePort:{
        '1': '/event/eventType/selectChildTypeList',
        '2': '/risk/riskdanger/list-by-type',
        '3': '/risk/riskhumanblacklist/list-by-type',
        '4': '/risk/riskvehicleblacklist/listNoPage',
        '5': '/event/eventType/selectChildTypeList',
        '6': '/risk/riskcamera/getList',
        '7': '/event/eventType/selectChildTypeList'
      },
      key: '',
    };
  },
  created() {
    this.init()    
    
  },
  watch:{
    serviceObject(curVal, oldVal){
      if(this.serviceObject.length>0){
        this.serviceObjectData.forEach(element=>{
          
          element.disabled=true;
          if(element.key===this.serviceObject[0]){
            element.disabled=false;
            // console.log("element.key,this.serviceObject[0]",element.key,this.serviceObject[0])
          }
        })
        
      } else{
        this.serviceObjectData.forEach(element=>{
          element.disabled=false;
        })
      }
    },
    eventTypeName(curVal, oldVal){
      if(curVal!==oldVal){
          this.pageNumber=1
          this.init()    
      }
    },
    pageNumber(curVal, oldVal){
      this.init()        
    }
  },
  computed: {
   
    },
  mounted(){
    setTimeout(()=>{
      // 插入全局搜索框
      $('.el-transfer-panel__header').eq(0).after('<input class="search" style="outline: none;border-radius: 5px;width: 90%;margin: 10px 5%;border:1px solid #ddd;">')
       $(".search").on("input",()=>{
         console.log('$(".search").value(): ', $(".search").val());
        this.key = $(".search").val()
         this.init()
       })
      if(document.querySelectorAll(".el-transfer-panel")[0]){
        
        var pagesNode=document.createElement('div');
        pagesNode.setAttribute("style","position:relative;top:20px;")
        pagesNode.innerHTML=`<span id="previousPage"  style="position:absolute;left:12%;border:1px solid gray;border-radius:5px;padding:2px 10px;font-size:1px;">上一页</span> <span id="nextPage"  style="position:absolute;left:58%;border:1px solid gray;border-radius:5px;padding:2px 10px;font-size:1px;">下一页</span>`
        
        document.querySelectorAll(".el-transfer-panel")[0].append(pagesNode)
        document.querySelectorAll(".el-transfer-panel")[0].style.setProperty("overflow","inherit")
        document.querySelector("#previousPage").onclick=this.previousPage
        document.querySelector("#nextPage").onclick=this.nextPage
      }
      if(document.querySelectorAll("#center > div:nth-child(4) > div > div.el-dialog__body > div.el-transfer > div:nth-child(1) > p > label > span.el-checkbox__label")[0]&&document.querySelectorAll("#center > div:nth-child(4) > div > div.el-dialog__body > div.el-transfer > div:nth-child(1) > p > label > span.el-checkbox__label")[0].innerHTML.replace(/[\r\n]/g,"").trim().search('列表 1')!=-1){
        document.querySelectorAll("#center > div:nth-child(4) > div > div.el-dialog__body > div.el-transfer > div:nth-child(1) > p > label > span.el-checkbox__label")[0].innerHTML="请选择服务对象"
      }
      if(document.querySelectorAll("#center > div:nth-child(3) > div > div.el-dialog__body > div.el-transfer > div:nth-child(1) > p > label > span.el-checkbox__label")[0]&&document.querySelectorAll("#center > div:nth-child(3) > div > div.el-dialog__body > div.el-transfer > div:nth-child(1) > p > label > span.el-checkbox__label")[0].innerHTML.replace(/[\r\n]/g,"").trim().search('列表 1')!=-1){
        document.querySelectorAll("#center > div:nth-child(3) > div > div.el-dialog__body > div.el-transfer > div:nth-child(1) > p > label > span.el-checkbox__label")[0].innerHTML="请选择服务对象"
      }

      if(document.querySelectorAll("#center > div:nth-child(4) > div > div.el-dialog__body > div.el-transfer > div:nth-child(3) > p > label > span.el-checkbox__label")[0]&&document.querySelectorAll("#center > div:nth-child(4) > div > div.el-dialog__body > div.el-transfer > div:nth-child(3) > p > label > span.el-checkbox__label")[0].innerHTML.replace(/[\r\n]/g,"").trim().search('列表 2')!=-1){
        document.querySelectorAll("#center > div:nth-child(4) > div > div.el-dialog__body > div.el-transfer > div:nth-child(3) > p > label > span.el-checkbox__label")[0].innerHTML="已选择服务对象"
      }
      if(document.querySelectorAll("#center > div:nth-child(3) > div > div.el-dialog__body > div.el-transfer > div:nth-child(1) > p > label > span.el-checkbox__label")[0]&&document.querySelectorAll("#center > div:nth-child(3) > div > div.el-dialog__body > div.el-transfer > div:nth-child(1) > p > label > span.el-checkbox__label")[0].innerHTML.replace(/[\r\n]/g,"").trim().search('列表 2')!=-1){
        document.querySelectorAll("#center > div:nth-child(3) > div > div.el-dialog__body > div.el-transfer > div:nth-child(1) > p > label > span.el-checkbox__label")[0].innerHTML="已选择服务对象"
      }
                                 
                                                                          
      // document.querySelectorAll("#center > div:nth-child(4) > div > div.el-dialog__body > div.el-transfer > div:nth-child(3) > div > div.el-transfer-panel__filter.el-input.el-input--small.el-input--prefix")[0].setAttribute("style","display: none;")
    })
  },                           
  methods: {
    init(){
       this.$http({
          url: this.$http.adornUrl(
            this.servePort[`${this.eventTypeFlag}`]
          ),
          method: 'get',
          params: this.$http.adornParams({
            page: this.pageNumber,
            limit: 200,
            eventTypeId: this.eventTypeId,
            platformId: this.$store.state.user.platformId,
            key: this.key
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.serviceObjectData=[]
            if(this.servePort[`${this.eventTypeFlag}`]==='/risk/riskcamera/getList'){
              data.data.records.forEach(element => {
                this.serviceObjectData.push({key:element.id,label:element.name,disabled:false})
              });
            }
            else if(this.servePort[`${this.eventTypeFlag}`]==='/risk/riskvehicleblacklist/listNoPage'){
              data.list.list.forEach(element => {
                this.serviceObjectData.push({key:element.id,label:element.carNum,disabled:false})
              });
            }
            else{
              data.data.list.forEach(element => {
                this.serviceObjectData.push({key:element.id,label:element.name,disabled:false})
              });
            }
            } else {
              this.$message.error(data.msg)
            }
        })
    },
    confirm(){
      // console.log("??????????????????????????????????????")
      this.serviceObjectData.forEach(element=>{
        if(element.key===this.serviceObject[0]){
          this.serviceObject=[];
          this.serviceObject.push({key:element.key,label:element.label});
          this.$emit('confirm',this.serviceObject,this.row,this.column);
          this.dialogVisible=false;
          this.$parent.showServiceObjectDialog=false;
          
          return ;
        }
      })
      
    },
    previousPage(){
      if(this.pageNumber!==1){
        this.pageNumber=this.pageNumber-1;
        // console.log('上一页')
      }
    },
    nextPage(){
      this.pageNumber=this.pageNumber+1;
      // console.log('下一页')
    }
  }
};
</script>

<style scoped>

.el-dialog__body .el-transfer{
  display: flex;
  justify-content: center;
}
.el-button+.el-button{
  margin-left: 25px;
}
</style>
