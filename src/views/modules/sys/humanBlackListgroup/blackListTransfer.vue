<template>
  
    <el-dialog
    title=""
    :visible.sync="dialogVisible" @close="serviceObject=[];serviceObjectData=[];dialogVisible=false;$parent.showServiceObjectDialog=false;"
    width="35%" 
    >
        
        <el-transfer filterable filter-placeholder="请输入关键词搜索" v-model="serviceObject" :data="serviceObjectData" ></el-transfer>
        

        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible=false;$parent.showServiceObjectDialog=false;">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
  
</template>

<script>

export default {
  
  data() {
    return {
      row:{},
      column:{},
      dialogVisible: false,
      serviceObject:[],
      serviceObjectData:[],
      pageNumber:1
    };
  },
  created() {
    
    this.getDataList()
    
  },
  watch:{
    // serviceObject(curVal, oldVal){
    //   if(this.serviceObject.length>0){
    //     this.serviceObjectData.forEach(element=>{
          
    //       element.disabled=true;
    //       if(element.key===this.serviceObject[0]){
    //         element.disabled=false;
    //         console.log("element.key,this.serviceObject[0]",element.key,this.serviceObject[0])
    //       }
    //     })
        
    //   } else{
    //     this.serviceObjectData.forEach(element=>{
    //       element.disabled=false;
    //     })
    //   }
    // },
   
    pageNumber(curVal, oldVal){
        
        this.getDataList()
        
    }
  },
  computed: {
   
  },
  mounted(){
    setTimeout(()=>{
      if(document.querySelectorAll(".el-transfer-panel")[0]){
        
        var pagesNode=document.createElement('div');
        pagesNode.setAttribute("style","position:relative;top:20px;")
        pagesNode.innerHTML=`<span id="previousPage"  style="position:absolute;left:12%;border:1px solid gray;border-radius:5px;padding:2px 10px;font-size:1px;">上一页</span> <span id="nextPage"  style="position:absolute;left:58%;border:1px solid gray;border-radius:5px;padding:2px 10px;font-size:1px;">下一页</span>`
        
        document.querySelectorAll(".el-transfer-panel")[0].append(pagesNode)
        document.querySelectorAll(".el-transfer-panel")[0].style.setProperty("overflow","inherit")
        document.querySelector("#previousPage").onclick=this.previousPage
        document.querySelector("#nextPage").onclick=this.nextPage
      }
    //   if(document.querySelectorAll("#center > div:nth-child(4) > div > div.el-dialog__body > div.el-transfer > div:nth-child(1) > p > label > span.el-checkbox__label")[0]&&document.querySelectorAll("#center > div:nth-child(4) > div > div.el-dialog__body > div.el-transfer > div:nth-child(1) > p > label > span.el-checkbox__label")[0].innerHTML.replace(/[\r\n]/g,"").trim().search('列表 1')!=-1){
    //     document.querySelectorAll("#center > div:nth-child(4) > div > div.el-dialog__body > div.el-transfer > div:nth-child(1) > p > label > span.el-checkbox__label")[0].innerHTML="请选择服务对象"
    //   }
    //   if(document.querySelectorAll("#center > div:nth-child(3) > div > div.el-dialog__body > div.el-transfer > div:nth-child(1) > p > label > span.el-checkbox__label")[0]&&document.querySelectorAll("#center > div:nth-child(3) > div > div.el-dialog__body > div.el-transfer > div:nth-child(1) > p > label > span.el-checkbox__label")[0].innerHTML.replace(/[\r\n]/g,"").trim().search('列表 1')!=-1){
    //     document.querySelectorAll("#center > div:nth-child(3) > div > div.el-dialog__body > div.el-transfer > div:nth-child(1) > p > label > span.el-checkbox__label")[0].innerHTML="请选择服务对象"
    //   }

    //   if(document.querySelectorAll("#center > div:nth-child(4) > div > div.el-dialog__body > div.el-transfer > div:nth-child(3) > p > label > span.el-checkbox__label")[0]&&document.querySelectorAll("#center > div:nth-child(4) > div > div.el-dialog__body > div.el-transfer > div:nth-child(3) > p > label > span.el-checkbox__label")[0].innerHTML.replace(/[\r\n]/g,"").trim().search('列表 2')!=-1){
    //     document.querySelectorAll("#center > div:nth-child(4) > div > div.el-dialog__body > div.el-transfer > div:nth-child(3) > p > label > span.el-checkbox__label")[0].innerHTML="已选择服务对象"
    //   }
    //   if(document.querySelectorAll("#center > div:nth-child(3) > div > div.el-dialog__body > div.el-transfer > div:nth-child(1) > p > label > span.el-checkbox__label")[0]&&document.querySelectorAll("#center > div:nth-child(3) > div > div.el-dialog__body > div.el-transfer > div:nth-child(1) > p > label > span.el-checkbox__label")[0].innerHTML.replace(/[\r\n]/g,"").trim().search('列表 2')!=-1){
    //     document.querySelectorAll("#center > div:nth-child(3) > div > div.el-dialog__body > div.el-transfer > div:nth-child(1) > p > label > span.el-checkbox__label")[0].innerHTML="已选择服务对象"
    //   }
                                 
                                                                          
      // document.querySelectorAll("#center > div:nth-child(4) > div > div.el-dialog__body > div.el-transfer > div:nth-child(3) > div > div.el-transfer-panel__filter.el-input.el-input--small.el-input--prefix")[0].setAttribute("style","display: none;")
    })
  },                           
  methods: {
    getDataList(){
        this.$http({
            url: this.$http.adornUrl(
                '/risk/riskhumanblacklist/list'
            ),
            method: 'get',
            params: this.$http.adornParams({
                page: this.pageNumber,
                limit: 200,
                
            })
            }).then(({ data }) => {
               if (data && data.code === 0) {
                this.serviceObjectData=[]
                // console.log("/risk/riskhumanblacklist/list",data)
                data.page.records.forEach(element => {
                  this.serviceObjectData.push({key:element.id,label:element.name,disabled:false})
                });
              }else{
                this.$message.error(data.msg)
              }
               
        })
    },
    confirm(){
        // console.log("??????????????????????????????????????",this.serviceObject,typeof this.serviceObject[0])
        this.$http({
            url: this.$http.adornUrl(`/vcm/vcmManager/synhuman`),
            method: 'post',
            data: this.$http.adornData({
            ids:this.serviceObject
            })
        }).then(({ data }) => {
           if (data && data.code === 0) {
              this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                  
              }
              })
              this.dialogVisible=false;
              this.$parent.showServiceObjectDialog=false;
          }else{
            this.$message.error(data.msg)
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
