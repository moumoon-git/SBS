<template>
  
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input class="search" v-model="dataForm.key" placeholder="请输入案例警示关键字搜索" clearable></el-input>
      </el-form-item>
      
      <el-form-item>
        <el-date-picker unlink-panels format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-model="dataForm.startEndAt" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button @click="$router.push({ path: '/safeEducation', query: {}})">新增</el-button>
        <!-- <el-button v-if="isAuth('risk:riskhuamnalarminfo:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button> -->
        <!-- <el-button v-if="isAuth('risk:riskhuamnalarminfo:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <div class="cardClass">
      <!-- <div style="width:15%;height:500px;min-width:320px;display:inline-block;border:1px solid #dcdfe6;border-radius:5px;">
        
      </div> -->
      <div class="list">
        <el-collapse v-model="activeNames" @change="handleChange" style="width:100%;" v-if="dataList.length!==0">
          <el-collapse-item v-for="(item,index) in dataList" :key="index" :title="item.title" :name="index" >
            <div v-html="item.content"></div>
            <!-- {{`<div contenteditable="true" style="width:100%; height:100%;" class="w-e-text" id="text-elem9529097322190925"><p>发放撒飞洒</p></div>`}} -->
            <!-- {{new DOMParser().parseFromString(`<div contenteditable="true" style="width:100%; height:100%;" class="w-e-text" id="text-elem9529097322190925"><p>发放撒飞洒</p></div>`, 'text/html');}} -->
          </el-collapse-item>
         
        </el-collapse>

        <section v-if="dataList.length===0" style="height: 50vh;line-height: 50vh;text-align: center;font-size: 20px;font-weight: bold;width:100%;color:#dcdfe6;">
          暂无数据
        </section>
      </div>
      <div>
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

  </div>
</template>

<script>


export default {
  data () {
    return {
      dataForm: {
        key: '',
        startEndAt: ['',''],
      },
      activeNames: ['0'],
      dataList: [],
      pageIndex: 1,
      pageSize: 9,
      totalPage: 0,
      dataListSelections: [],
      addOrUpdateVisible: false,
    }
  },
  components: {
    // AddOrUpdate
  },
  activated () {
  },
  created(){
    this.$window=window;
    this.getDataList()
    // console.log("this.$window",this.$window)
  },
  mounted(){
    var that=this
    setTimeout(()=>{
      // console.log("dataList",this.dataList)
        document.querySelectorAll(".el-collapse-item__header").forEach((item,index)=>{
          // console.log("caonimama",index)
          var newDiv=document.createElement('span');
          var newEdit=document.createElement('span');newEdit.innerHTML='编辑'
          var newDel=document.createElement('span');newDel.innerHTML='删除'
          newDiv.setAttribute("style","position: absolute;right: 6%;")
          newEdit.setAttribute("style","border: 1px solid #4b4747;padding: 2px 3px;border-radius: 5px;color: #80848f;")
          newDel.setAttribute("style","border: 1px solid #4b4747;margin-left: 15px;padding: 2px 3px;border-radius: 5px;color: #80848f;")

          newEdit.onclick=function(ev){
            var oEvent = ev || event;
            oEvent.cancelBubble = true;
            oEvent.stopPropagation();
            that.editCard(that.dataList[index]);
          }
          newDel.onclick=function(ev){
            var oEvent = ev || event;
            oEvent.cancelBubble = true;
            oEvent.stopPropagation();
            that.deleteCard(that.dataList[index]);
          }
          newDiv.append(newEdit,newDel)
          
          document.querySelectorAll(".el-collapse-item__header")[index].insertBefore(newDiv,document.querySelectorAll(".el-collapse-item__arrow")[index])
        })
    },1000)
    
    
  },
  methods: {
    editCard(item){
      this.$router.push({ path: '/safeEducation', query: {'item':item}})
    },
    deleteCard(item){
      this.$confirm('此操作将永久删除该案例, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          

          this.$http({
              url: this.$http.adornUrl(`/article/articlesafeeducation/delete`),
              method: 'POST',
              data: this.$http.adornData({
                id:item.id
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.getDataList()
            } else {
              this.$message.error(data.msg)
            }

            })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    handleChange(val) {
      // console.log(val);
    },
    // 获取数据列表
    getDataList () {
      // console.log("this.dataForm.startEndAt",this.dataForm.startEndAt)
      if (this.dataForm.startEndAt === null) {
        this.dataForm.startEndAt = []
      }
    
      this.$http({
        url: this.$http.adornUrl('/article/articlesafeeducation/page'),
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
          // console.log("/article/articlesafeeducation/page",data)
          // data.page.records.map(v=>{
          //   v.credentialsNum = v.credentialsNum.slice(0,6)+'xxxxxxxx'+v.credentialsNum.slice(v.credentialsNum.length-4,v.credentialsNum.length)
          // })
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
          // console.log("this.dataList,this.totalPage",this.dataList,this.totalPage)
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
  // min-width: 1593px;
  position: relative;
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
  justify-content:space-between;
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
  height: 200px;
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



</style>
