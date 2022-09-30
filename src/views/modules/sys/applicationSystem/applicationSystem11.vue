
<template>
  <div class="applicationSystem">
        <el-row>
            <el-button v-if="isAuth('sys:sysapplicationlink:save')" @click="dialogVisible=true;dialogTitle='新增应用';fileList=[];" type="primary" size="small">新增应用链接</el-button>
        </el-row>
        <ul>
            <li v-for="(item,index) in dataList" :key="index">
                <a  @click="$window.console.log(`${item.url}`),$window.open(`${item.url.search('http')==-1?'http://'+item.url:item.url}`);">
                    <img v-if="item.images" :src="item.images.indexOf('http') > -1?item.images: ($window.SITE_CONFIG['cloudUrl']+item.images)" alt="" style="width:300px;height:140px;">
                    <!-- <img v-else :src="$window.require(`../../../../assets/img/nophoto.jpg`)" alt="" style="width:300px;height:140px;"> -->
                    <p>{{item.name}}</p>
                </a>
                <el-row style="margin-top:10px;">
                    <div v-if="isAuth('sys:sysapplicationlink:update')" @click="editApplication(item)" style="display:inline-block;font-size:12px;vertical-align: middle;padding: 4px 6px;border: 1px solid #ebeef5;borderRadius: 4px;box-shadow:0 2px 12px 0 rgba(0,0,0,.1);float:right;color:#bcbcbc;" >编辑</div>
                    <div v-if="isAuth('sys:sysapplicationlink:delete')" @click="deleteApplication(item)" style="display:inline-block;font-size:12px;vertical-align: middle;padding: 4px 6px;border: 1px solid #ebeef5;borderRadius: 4px;box-shadow:0 2px 12px 0 rgba(0,0,0,.1);float:right;margin-right: 10px;color:#bcbcbc;">删除</div>
                </el-row>
                
            </li>
        </ul>
        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            width="40%"
            center>

            <el-form style="width:100%;margin-top:-20px;" >
                <el-form-item label="应用名称" style="width: 100%;margin:auto auto;">
                    <el-input v-model="dataForm.name"></el-input>
                </el-form-item>
                <el-form-item label="应用链接" style="width: 100%;margin:auto auto;">
                    <el-input v-model="dataForm.url"></el-input>
                </el-form-item>
                <el-form-item label="排序号" style="width: 100%;margin:auto auto;margin-top:20px;">
                    <el-input-number v-model="dataForm.orderNum" :min="1"  label="描述文字"></el-input-number>
                </el-form-item>
                <el-form-item label="封面图片" style="width: 100%;margin:auto auto;margin-top:20px;">
                   <el-upload
                        :limit="1"
                        :headers="{
                        'token': this.$cookie.get('token')
                        }"
                        :file-list="fileList"
                        :action="$window.SITE_CONFIG['cloudUrl']+'/ser/upload/file'"
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
                </el-form-item>
                
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveApplication">确 定</el-button>
            </span>  
        </el-dialog>
  </div>
</template>



<script>
  export default {
    data() {
      return {
          dataList:[],
          dialogTitle:'',
          dialogVisible:false,
          fileList: [],
          disabled: false,
          dataForm:{
              id:"",
              name:'',
              url:'',
              coverImage:'',
              orderNum:1,
              temporaryCoverImage:''
          }
      }
    },
    created(){
        this.$window=window
        this.getDataList()
    },
    mounted(){
        
    },
    watch:{
        dataList(newValue,oldValue){
            // console.log("触发dataList监听,dataList",this.dataList)
            this.dataList.forEach(item=>{
                // if(item.images&&item.images.search("http")!=-1){
                //     var ImgObj = new Image(); //判断图片是否存在  
                //     ImgObj.src = item.images;  
                
                //     // console.log("输出图片",ImgObj.src,ImgObj,ImgObj.width)
                    
                //     setTimeout(()=>{
                //         //没有图片，则返回-1  
                //         if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {  
                            
                //         } else {
                //             item.temporaryCoverImage=item.images  
                //             item.images=require(`../../../../assets/img/nophoto.jpg`) //require(`../../../../assets/img/nophoto.jpg`)
                            
                //             // console.log("1111111111111")
                //         }
                //     },1500) 
                    
                   
                // }
                // if(item.images&&item.images.search("http")===-1){
                //         var ImgObj = new Image(); //判断图片是否存在  
                
                
                //         item.images=item.images.split('')
                //         item.images.splice(5,1,"/");
                //         item.images=item.images.join('')
                //         ImgObj.src = this.$window.SITE_CONFIG['baseUrl']+'/'+item.images;  
                    
                //         // console.log("输出图片",ImgObj.src,ImgObj,ImgObj.width)
                        
                //         setTimeout(()=>{
                //             //没有图片，则返回-1  
                //             if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {  
                //                 item.images=ImgObj.src
                //             } else {  
                //                 item.temporaryCoverImage=item.images 
                //                 item.images=require(`../../../../assets/img/nophoto.jpg`)
                //                 // console.log("22222222222222")
                //             }
                //         },1500)
                // if(!item.images){
                //     item.temporaryCoverImage='' 
                //    item.images=require(`../../../../assets/img/nophoto.jpg`) 
                // }
                // }
                  
                
            })
            setTimeout(()=>{
                // console.log("nophotonophotonophotonophoto",this.dataList)
            })
        }
    },
    methods: {
        getDataList(){
            this.$http({
                url: this.$http.adornUrl("/sys/sysapplicationlink/list"),
                method: "get",
                params: this.$http.adornParams({
                })
            }).then(({ data }) => {
                // console.log("/sys/sysapplicationlink/list",data)
                this.dataList=data.list
            })
        },
        onSuccess(response, file, fileList){
            // console.log("response, file, fileList",response, file, fileList)
            this.dataForm.coverImage=response.url
            document.querySelectorAll(".el-form-item__content div")[2].setAttribute("style","display:flex;")
        },
        handlePictureCardPreview(file) {
            // this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleDownload(file) {
            // console.log(file);
        },
        handleRemove(file,obj) {
            // console.log(file);
            file.url=''
        },
        saveApplication(){
            this.dialogVisible = false
            
            
            this.$http({
                url: this.dialogTitle==='编辑应用'?this.$http.adornUrl("/sys/sysapplicationlink/update"):this.$http.adornUrl("/sys/sysapplicationlink/save"),
                method: "POST",
                data: this.$http.adornData({
                    "id":this.dataForm.id,
                    "name":this.dataForm.name,
                    "url":this.dataForm.url,
                    "images":this.dataForm.coverImage.search('data:image/')==-1?this.dataForm.coverImage:this.dataForm.temporaryCoverImage,
                    "orderNum":this.dataForm.orderNum
                })
            }).then(({ data }) => {
                // console.log("/sys/sysapplicationlink/save",data)
                this.getDataList()
            })
        },
        editApplication(item){
            this.fileList=[]
            this.dialogTitle='编辑应用'
            this.dataForm={
                id:item.id,
                name:item.name,
                url:item.url,
                coverImage:item.images,
                orderNum:item.orderNum
            }
            item.images=item.images.indexOf('http') > -1?item.images: (this.$window.SITE_CONFIG['cloudUrl']+item.images)
            this.fileList= [{url:item.images}]
            console.log('this.fileList',this.fileList)
            // console.log("item.images",item.images)
            //图片\转/同时加后台域名
            // if(item.images.search('http')!==-1){
            //     var ImgObj = new Image();
            //     ImgObj.src=item.images
            //     setTimeout(()=>{
            //             //没有图片，则返回-1  
            //             if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {  
                            
            //             } else {  

            //                 item.images=require(`../../../../assets/img/nophoto.jpg`)
            //             }

            //             this.fileList= [{url:item.images}] // 不能用push，加上定时器，一直点击编辑，这里变成了循环

            //             this.dialogVisible=true
            //     },1500)
                
            //     }else{
            //             var ImgObj = new Image(); //判断图片是否存在  
                
                
            //             item.images=item.images.split('')
            //             item.images.splice(5,1,"/");
            //             item.images=item.images.join('')
            //             ImgObj.src = this.$window.SITE_CONFIG['baseUrl']+'/'+item.images;  
                    
            //             // console.log("输出图片",ImgObj.src,ImgObj,ImgObj.width)
                        
            //             setTimeout(()=>{
            //                     //没有图片，则返回-1  
            //                     if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {  
            //                         item.images=ImgObj.src
            //                     } else {  
            //                         item.images=require(`../../../../assets/img/nophoto.jpg`)
            //                     }  
                            
                            
            //                 this.fileList= [{url:item.images}]
            //                 this.dialogVisible=true
            //             },1500)
            //     }
            this.dialogVisible=true
                
        },
        deleteApplication(item){
            this.$confirm(`确定移除该应用？`)
            .then(() => {
            this.$http({
                url: this.$http.adornUrl("/sys/sysapplicationlink/delete"),
                method: "POST",
                data: this.$http.adornData({
                    ids:[item.id]
                })
            }).then(({ data }) => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                })
                this.getDataList()
            })

            })
            .catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            })
            })
        }
    }
  };
</script>

<style lang="scss" scoped>
    *{
        padding: 0;
        margin: 0;
    }
    li{
        list-style: none;
    }
    .applicationSystem{
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;  
        .el-button{
            padding: 10px 20px;
        }
        ul{
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            li{
                width: 25%;
                padding: 0px 1.2vw;
                margin-top:4vh;
                text-align: center;
                img{
                    width: 100%;
                }
                p{
                    font-size: 1.1vw;
                    font-weight: bold;
                    margin-top: 2.5vh;
                }
            }
        }
    }
</style>
