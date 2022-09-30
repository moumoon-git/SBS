<template>
  
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input class="search" v-model="dataForm.key" placeholder="请输入案例警示关键字搜索" clearable></el-input>
      </el-form-item>
      
      <el-form-item>
        <el-date-picker format="yyyy 年 MM 月 dd 日" unlink-panels value-format="yyyy-MM-dd" v-model="dataForm.startEndAt" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button @click="$router.push({ path: '/caseWarning', query: {}})">新增</el-button>
        <!-- <el-button v-if="isAuth('risk:riskhuamnalarminfo:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <!-- <el-button v-if="isAuth('risk:riskhuamnalarminfo:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <div class="cardClass">
      <!-- <div style="width:15%;height:500px;min-width:320px;display:inline-block;border:1px solid #dcdfe6;border-radius:5px;"> -->
        <!-- <caseWarningTree
          :list="treeList"
          :listProps="treeListProps"
          @handleNodeClick="handleNodeClick"
          @showTree="showEventType"
          @addTree="addEventType"
          @updateTree="updateEventType"
          
          @deleteTree="deleteEventType"
          @setCheckedIds="setCheckedIds"
          :Treeexpansion="Treeexpansion"
        >
        </caseWarningTree> -->
      <!-- </div> -->
      <div class="list" v-if="dataList.length!==0">
        
          
        
        <!-- 一个卡片单位 -->
        <!-- <section v-if="dataList.length!==0" style="width:100%;display: flex;justify-content: space-between;align-content: space-between;padding: 0px 10px 0px 10px;flex-wrap: wrap;"> -->
          <section class="colStaff"  v-for="(item,index) in dataList" :key="index" @click="watchCard(item)" style="margin: 10px 5px;"> 
            <div  style="display: flex;align-items:center;position: relative;height: 100%;width:100%;">
              <img v-if="item.coverImage" :src="item.coverImage.indexOf('http') === -1?baseUrl+item.coverImage:item.coverImage" style="width:50%;height:63.5%;margin-left: 20px;">
              <img v-else :src="require('../../../../assets/img/nophoto.jpg')" style="width:50%;height:63.5%;margin-left: 20px;">
              <div style="position: relative;height: 80%;margin-left:15px;width: 50%;">
                <div v-if="item.title" style="white-space: nowrap;overflow:hidden;text-overflow:ellipsis;width: 150px;font-size: 18px;position: absolute;top: 10%;">{{item.title}}</div>
                <div v-if="item.subtitle" style="white-space: nowrap;font-size: 16px;color: red;position: absolute;top:30%;white-space: nowrap;overflow:hidden;text-overflow:ellipsis;width:100px;">{{item.subtitle}}</div>
                <div style="white-space: nowrap;font-size: 14px;color: #999;position: absolute;top:50%;">{{item.createTime}}</div>
                <div style="position: absolute;top:73%;">
                  <span  class="layui-badge-rim" v-for="(labelItem,labelIndex) in item.label.split(',')" :key="labelIndex">{{labelItem}}</span>
                  
                </div>
              </div>

              <div style="position: absolute;top:4%;right:2%;">
                <span  class="layui-badge-rim" @click="editCard(item)">编辑</span>
                <span  class="layui-badge-rim"  @click.stop="deleteCard(item)">删除</span>
              </div>
            </div>
          </section>
         
        <!-- </section> -->
        
      </div>
      <section v-if="dataList.length===0" style="text-align: center;font-size: 20px;font-weight: bold;color:#dcdfe6;display:inline-block;width: 74%;height: 600px;line-height:600px;overflow: auto;border: 1px solid gray;position: absolute;right: 0%;top: 0%;min-width: 540px;">
        暂无数据
      </section>
      
      
    </div>

    <div style="width:100%;">
      <el-pagination 
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[9, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
    
    <!-- 过渡动画 -->
      <!-- <transition name="fade" v-if="showImg">
        <div class="img-view" @click="viewImg">
          
          <div class="img-layer"></div>
          <div class="img">
            <img :src="imgSrc" />
          </div>
        </div>
      </transition> -->
    <!-- 弹窗 -->
    <!-- <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update> -->

    <el-dialog
      :title="watchCardObj.title"
      :visible.sync="dialogVisible"
      width="40%"
      center>

      <div style="width:100%;margin-top:-20px;" >
        <!-- <div style="background-image: url('../../../../src/assets/img/kawayi.png');background-size: 100% 100%;width:90%;height:200px;margin:auto auto;"></div>
        <div style="text-indent:2em;width:90%;margin:auto auto;color: #444;font-size: 13px;line-height: 22px;margin-top:10px;">
          <p >2019年1月8日上午11点17分左右，北京市西城区宣师一附小右安校区内发生一起男子伤害学生事件。据西城区官方微博消息称，初步了解，共有20个孩子受伤，均已送到医院救治，其中3人伤势较重，目前生命体征平稳，无生命危险。嫌疑人已被当场控制。市、区公安、卫生、教育、应急等相关单位正在全力开展救治和调查工作。经公安机关初步调查，嫌疑人贾某某，男，49岁，黑龙江人，是该学校聘用的劳务派遣人员，日常从事维修工作。贾某某劳务派遣合同将于今年1月底到期，学校正商劳务公司为其安排其他岗位。贾某某为发泄不满情绪，持日常工作用的手锤在课间将多名学生打伤。</p>
        </div> -->
        <div v-html="watchCardObj.content"></div>
      </div>

      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
    
  </div>
</template>

<script>
import caseWarningTree from './caseWarning-tree';
import { treeDataTranslate } from '@/utils'

export default {
  data () {
    return {
      Treeexpansion: false,
      //树形
      treeList:[],
      treeListProps: {
        children: 'children',
        label: 'name'
      },
      treeForm: {
        // 分组名字
        currentTreename: '',
        // 分组描述
        groupingdescription: '',
        type: 0
      },
      dataForm: {
        key: '',
        startEndAt: ['',''],
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 9,
      totalPage: 0,
      dialogVisible:false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      watchCardObj:{},
      currentTreeObject:'',
      selectedNode: new Array(),
      search:'',
      currentTreeplatformId:'',
      currentTreeparentId:'',
      currentTreeancestors:'',
      currentTreeorderNum:'',
      baseUrl: window.SITE_CONFIG['cloudUrl'],
    }
  },
  components: {
    caseWarningTree
  },
  activated () {
    this.getDataList()
  },
  created(){
    this.$window=window
  },
  mounted(){
    // console.log("dataListdataListdataListdataListdataList",this.dataList)
  },
  watch:{
    dataList(newValue,oldValue){
      this.dataList.forEach(item=>{
        if(item.coverImage&&item.coverImage.search("http")!=-1){
          var ImgObj = new Image();
          ImgObj.src=item.coverImage;
          setTimeout(()=>{
              //没有图片，则返回-1  
              if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {  
                  
              } else {  
                  item.coverImage=require(`../../../../assets/img/nophoto.jpg`)
              }
          },1000)

          
        }else {
            var ImgObj = new Image(); //判断图片是否存在  
        
            
            item.coverImage=item.coverImage.split('')
            item.coverImage.splice(5,1,"/");
            item.coverImage=item.coverImage.join('')
            item.coverImage = this.$window.SITE_CONFIG['baseUrl']+item.coverImage;
            ImgObj.src=item.coverImage
              // console.log("输出图片",ImgObj.src,ImgObj,ImgObj.width)
            
            setTimeout(()=>{
                //没有图片，则返回-1  
                if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {  
                    
                } else {  
                    item.coverImage=require(`../../../../assets/img/nophoto.jpg`)
                }
            },1000)
        }
          
        
      })
      setTimeout(()=>{
        // console.log("nophotonophotonophotonophoto",this.dataList)
      })
    }
  },
  methods: {
    editCard(item){
      // console.log("编辑",item.coverImage,item)
      this.$router.push({ path: '/caseWarning', query: {'item':item}})
    },
    deleteCard(item){
      this.$confirm('此操作将永久删除该案例, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          

          this.$http({
              url: this.$http.adornUrl(`/article/articlesafewarning/delete`),
              method: 'POST',
              data: this.$http.adornData({
                id:item.id
              })
            }).then((res) => {
              if (res && res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  this.getDataList()
                } else {
                  this.$message.error(res.msg)
                }
              
            })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    watchCard(item){
      this.dialogVisible=true
      setTimeout(()=>{
        document.querySelector(".w-e-text").setAttribute("style","padding: 0 10px;overflow-y: auto;height: 500px;")
        
      })
      this.watchCardObj=item
    },
    // 获取数据列表
    getDataList () {
      this.$http({
        url: this.$http.adornUrl('/risk/riskcameragroup/tree'),
        method: 'get'
      }).then(({ data }) => {
         if (data && data.code === 0) {
            // console.log("/risk/riskcameragroup/tree",data)
            this.treeList = treeDataTranslate(data.tree, 'id')
          } else {
            this.$message.error(data.msg)
          }
       
      })


      // console.log("this.dataForm.startEndAt",this.dataForm.startEndAt)
      if (this.dataForm.startEndAt === null) {
        this.dataForm.startEndAt = []
      }
    
      this.$http({
        url: this.$http.adornUrl('/article/articlesafewarning/page'),
        method: 'get',
        params: this.$http.adornParams({
          startAt:this.dataForm.startEndAt[0],
          endAt:this.dataForm.startEndAt[1],  
          key:this.dataForm.key,
          limit: this.pageSize,
          page: this.pageIndex
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log("/article/articlesafewarning/page",data)
          // data.page.records.map(v=>{
          //   v.credentialsNum = v.credentialsNum.slice(0,6)+'xxxxxxxx'+v.credentialsNum.slice(v.credentialsNum.length-4,v.credentialsNum.length)
          // })
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
          this.$message.error(data.msg)
        }
        
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 点击树形节点事件
    // handleNodeClick (obj) {
    //   console.log("handleNodeClick",obj)
    //   function findChilden (obj, list) {
    //     list.push(obj.id)
    //     let children = obj.children
    //     console.log(list)
    //     if (children != null) {
    //       children.forEach((item, index) => {
    //         console.log(item)
    //         findChilden(item, list)
    //       })
    //     }
    //   }
    
    //   console.log('树形结点点击事件', obj)
    //   this.selectedNode = []
    //   this.currentTreeObject = obj.id
    //   this.treeForm.currentTreename = obj.name
    //   this.search = ''
    //   // 分组描述
    //   this.treeForm.groupingdescription = obj.remark
    //   this.treeForm.type = obj.type
    //   this.currentTreeplatformId = obj.platformId
    //   this.currentTreeparentId = obj.parentId
    //   this.currentTreeancestors = obj.ancestors
    //   this.currentTreeorderNum=obj.orderNum

    //   findChilden(obj, this.selectedNode = [])

    //   console.log('selectedNode:' + this.selectedNode)
    //   console.log(this.currentTreeObject)
    //   console.log(this.treeForm.currentTreename)
    //   // 查询树形关联的联系人
    //   this.$http({
    //     url: this.$http.adornUrl(`/risk/riskcamera/list`),
    //     method: 'POST',
    //     data: this.$http.adornData({
    //       key:this.dataForm.key,
    //       cameraType:this.cameraType,
    //       limit: this.pageSize,
    //       page: 1,
    //       groupId: this.selectedNode
    //     })
    //   }).then(({ data }) => {
    //     console.log(data)
    //     this.totalCount = data.data.totalCount
    //     this.currPage = data.data.currPage
    //     this.pageSize = data.data.pageSize
    //     this.platShareMenuList = data.data.list
    //   })
    // },
    // // 查看分组
    // showEventType () {
    //   this.dialogVisible = true
    //   this.dialogtitle = '查看分组'
    //   this.groupingdisabled = true
    // },
    // // 添加分组
    // addEventType () {
    //   this.eventtypeAddOrUpdateVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.eventtypeAddOrUpdate.init(null, null, 2) // 代表新增
    //   })
    // },
    // // 修改分组名称
    // updateEventType (rows) {
    //   console.log(this.treeForm.currentTreename)
    //   this.dialogVisible = true
    //   this.dialogtitle = '修改分组'
    //   this.groupingdisabled = false
    // },
    // // 删除分组
    // deleteEventType (ids) {
    //   var that = this
    //   this.$confirm(`确定对进行[删除]操作?`, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     var checkedNames = ''
    //     if (that.checkedNodes.length > 0) {
    //       that.checkedNodes.forEach(item => {
    //         if (item.system === 1) {
    //           checkedNames += item.name
    //         }
    //       })
    //     }

    //     setTimeout(() => {
    //       if (checkedNames) {
    //         that.$message({
    //           message: `${checkedNames}删除失败`,
    //           type: 'error',
    //           duration: 1500
    //         })
    //         return 0
    //       }
    //       that.$http({
    //         url: that.$http.adornUrl(
    //         `/risk/riskcameragroup/delete`
    //       ),
    //         method: 'POST',
    //         data: this.$http.adornData({
    //           ids:that.checkedIds
    //         })
    //       // data: that.$http.adornData(id)
    //       }).then(({ data }) => {
    //         if (data && data.code === 0) {
    //           that.$message({
    //             message: '操作成功',
    //             type: 'success',
    //             duration: 1500
    //           })
    //           that.getDataList()
    //         } else {
    //           that.$message.error(data.msg)
    //         }
    //       })
    //     })
    //   })
    // },
    // // 树形复选框勾选ID
    // setCheckedIds (checkedIds, checkedNodes) {

    //   this.checkedIds = checkedIds
    //   console.log('this.checkedIds', this.checkedIds)
    //   this.checkedNodes = checkedNodes
    // },
    
    
    
    
    
  }
}
</script>
<style scoped lang="less">
.search{
  width: 290px;
}
.cardClass {
  padding: 3px;
  // border: 1px solid rgba(230, 230, 230, 1);
  width: 100%;
  
  position: relative;
  // min-width: 1593px;
   min-width: 1360px;
}
ul {
  margin: 0;
  padding: 0;
}
ul li {
  list-style: none;
}
.list {
  display:inline-block;
  width: 100%;
  height: 600px;
  overflow: auto;
  border: 1px solid #dcdfe6;
  // position: absolute;
  // right: 0%;
  // top: 0%;
  display: flex;
  // justify-content:space-between;
  align-content: flex-start;
  padding: 0px 7px;
  flex-wrap: wrap;
  min-width: 540px;
  
}
.list:after {
  // content: "";
  // width: 33%;
  // border: 1px solid transparent;
}
.colStaff {
  display: inline-block;
  // background-color: rgb(231, 240, 190);
  border-radius: 5px;
  width: 33%;
 
  margin-top: 7px;
  
  // padding: 5px;
  height: 250px;
  // position: relative;
  // margin-top: 20px;
  border: 1px solid #555; 
  // display: flex;
  overflow: hidden;
  > div {
    // display: flex;
    // margin-left: 10px;
  }
  
}

.layui-badge-rim{
  margin-right:2px;
  border-width: 1px;
  border-style: solid;
  background-color: #fff;
  color: #666;
  position: relative;
  display: inline-block;
  padding: 5px 12px;
  font-size: 12px;
  text-align: center;
  border-radius: 2px;
  border-color: #e6e6e6; 
}


</style>
