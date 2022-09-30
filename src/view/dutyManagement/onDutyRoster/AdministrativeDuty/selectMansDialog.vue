<template>
<!-- 选择人员弹窗 -->
  <el-dialog width='1060px' class="popoxwrap" :visible.sync="selectData" append-to-body :close-on-click-modal="false" :before-close="closeDialog"
   @open='open'>
      <el-row>
        <el-col :span="6">
          <div class="dutyTitle">选择对应值班</div>
          <el-row>
            <el-radio-group v-model="radio2" size="medium" @change="getDayShift">
              <el-col :span="12">
                <el-radio-button :label="0" >工作日</el-radio-button>
              </el-col>
              <el-col :span="12">
                <el-radio-button :label="1">节假日</el-radio-button>
              </el-col>
            </el-radio-group>
          </el-row>
          <div class="outDutyList">
            <div v-for="(item, index) in radio2==0?dutyArr0:dutyArr1" :key="item.id" class="dutyList" @click="initContactor(item,index)" :style="{'background-color':idx==index?'skyblue':'initial'}">
                <div class="dutyName">
                  {{item.name}}:
                </div>
                <el-tag
                  :key="tag.id"
                  v-for="tag in item.appSjsDutyContactorVos"
                  closable
                  :disable-transitions="false"
                  @close="currentId = item.id;item.appSjsDutyContactorVos.splice(item.appSjsDutyContactorVos.indexOf(tag), 1);checkboxGroup = item.appSjsDutyContactorVos.length>0?item.appSjsDutyContactorVos.map(v=> { return v.id }):[]">
                  {{tag.name}}
                </el-tag>
            </div>
          </div>
          <el-button type="primary" @click="addMans">
            保存
          </el-button>
        </el-col>
        <el-col :span="18">
        <div>
          <div class="top">
            <div class="contactorTitle">
              <div class="contactorName">选择联系人</div>
              <i class="el-icon-close close" @click="closeDialog"></i>
            </div>
            <el-input type="input"  placeholder="输入姓名/单位/职位/号码" v-model="searchText" class='selectInput'></el-input>
            <el-button type="primary" @click="query(1)">查询</el-button>
          </div>
          <div class="main">
            <div class="left">
              <el-scrollbar style="height: 100%">
                <el-tree :data="data2" ref='tree' node-key="id"  highlight-current @node-click="handleNodeClick" :props="defaultProps"></el-tree>
              </el-scrollbar>
            </div>

            <div class="right">
              <el-scrollbar style="height: 100%">
                <div v-if="mans && mans.length > 0">
                  <el-checkbox-group  v-model="checkboxGroup" v-if='maxSelect >= 1' :max='maxSelect' @change="checkChange">
                    <el-checkbox class="checkbox" v-for="item in mans" :label="item.id" :key="item.id" >
                      <div >{{item.name}}</div>
                      <div >{{item.position}}</div>
                      <div>{{ item.mobile !== '' ? item.mobile : item.otherTel }}</div>
                    </el-checkbox>
                  </el-checkbox-group>
                  <el-checkbox-group  v-model="checkboxGroup" v-else @change="checkChange">
                    <el-checkbox class="checkbox" v-for="item in mans" :label="item.id" :key="item.id">
                      <div >{{item.name}}</div>
                      <div >{{item.position}}</div>
                      <div>{{ item.mobile !== '' ? item.mobile : item.otherTel }}</div>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="p_" v-else>
                  {{checkboxGroup}}
                  <span>暂无数据</span>
                </div>
              </el-scrollbar>
            </div>
            <div class="page">
                  <el-pagination :small="pagingSize1" :page-size="pageSize1" :total="total1"
                  @current-change="pageChange"
                  :current-page.sync="currentPage1"
                  layout="total, prev, pager, next, jumper"></el-pagination>
            </div>
          </div>
        </div>
        </el-col>
      </el-row>
  </el-dialog>
</template>
<script>
  export default {
    name: "selectMansDialog",
    props:['selectTitle','selectData','maxSelect', 'dutyArr','currentDate'],//maxSelect 可限制选中联系人的个数，无限制可不传这个参数
    data() {
        return {
          defaultProps: {
            children: 'children',
            label: 'name',
          },
          searchText:'',
          data2:[],
          treeId:'',
          checkboxGroup:[],
          mans:[],
          total1: 0,//数据总数
          pageSize1: 10,//每页条数
          currentPage1: 1,//当前页数
          pagingSize1: true,  //分页大小
          first:true,//判断弹框是否是第一次进来
          checkboxData: [],
          currentId: "", //当前选择值班Id
          lastTime: {}, // 上次选中的组
          radio2: 0,
          idx: 0,
          dutyArr0: [],
          dutyArr1: [],
        }
      },
    mounted(){
      this.getPhoneTree();
      // 去除dialog头部
      // console.log('document.getElementsByClassName("popoxwrap")[0]: ', document.getElementsByClassName("popoxwrap")[0]);
      setTimeout(()=>{
        console.log('document.getElementsByClassName("popoxwrap")[0]: ', document.getElementsByClassName("popoxwrap"));
        let diglog = document.getElementsByClassName("popoxwrap")[0].firstElementChild
        diglog.removeChild(diglog.firstElementChild)
        this.dutyArr0 = this.dutyArr
      },200)
      
      // if (this.dutyArr0.length>0) {
      //   this.initContactor(this.dutyArr0[0], 0)
      // }
    },
    methods: {
      // 获取所有的checkbox
    getChechbox(){
      let allEle = document.querySelectorAll('.right .is-checked')
      console.log(allEle);
      if(Array.from(allEle).length!=0){
        allEle.forEach(ele=>{
          ele.classList.remove('is-checked')
          if(ele.localName == 'label'){
            ele.removeAttribute('aria-checked')
          }
        })
      }
    },
    closeDialog(){
       this.$emit('closeDialog');
    },
    getPhoneTree(){
      // 渲染弹窗左侧列表
       let data={"data":{}};
       this.$api.telephoneGroupingTree(data).then((res) =>{
            console.log(res);
            if (res.errorcode!=0){
                  this.$message({
                    message:res.msg,
                    type:"error"
                  });
                  return;
             }
            this.data2=res.data;
            this.handleNodeClick(this.lastTime?this.lastTime:this.data2[0])
        })
     },
     //换页
     pageChange(){
         if(!this.treeId){
           this.query(this.currentPage1);
         }else{
            let data={
               groupId:this.treeId.id,
               serchText:'',
               page:this.currentPage1,
               size:10
             };

            this.$api.contactorList(data).then((res) =>{
              this.total1 = res.data.totalCount;
              this.mans=res.data.list;
            })
         }

     },
    // 点击tree节点
    handleNodeClick(num){
      this.lastTime = num
        console.log(this.$refs.tree)
        this.treeId = num;
        this.currentPage1 = 1;
        let data={
           groupId:num.id,
           serchText:'',
           page:1,
           size:10
         };

        this.$api.contactorList(data).then((res) =>{
          console.log(res.data.data)
          this.total1 = res.data.totalCount;
          console.log('res.data: ', res.data);
          this.mans=res.data.list;
        })
    },
    //input框查找
    query(page){
        //  if(page === 0){
        //    this.currentPage1 = 1;
        //  }
         this.treeId = '';
         let data = {
             searchText: this.searchText,
             page:  page,
             size: this.pageSize1
         };
         console.log(data)
         this.$api.contactorList(data).then(res => {
             console.log(res)
             if (res.errorcode != 0) {
                 this.$message({
                     message: res.msg,
                     type: "error"
                 });

             }
             this.mans = res.data.list;
             this.total1=res.data.totalCount;
         })
     },
     //点击确定添加联系人
     addMans(){
       let dutyArr = this.radio2 == 0 ?this.dutyArr0:this.dutyArr1
       dutyArr.map(v=>{
         console.log('v.appSjsDutyContactorVos: ', v.appSjsDutyContactorVos);
         
         if (v.appSjsDutyContactorVos && v.appSjsDutyContactorVos.length>0) {
             v.contactorIds = v.appSjsDutyContactorVos.map(v=>{return v.id})
         }else{
           v.contactorIds = [] 
         }
       })
        let data = {
             data: dutyArr
         };
         this.$api.affairsGroupSaveOrUpdate(data).then(res => { 
             console.log(res)
             if (res.errorcode != 0) {
                 this.$message({
                     message: res.msg,
                     type: "error"
                 });

             }
             this.$message.success("保存成功")
             this.$emit("initList")
         })
     },
     //父组件调用该方法初始this.checkboxGroup的选中状态
     defaultSelection(checkboxGroup, type){
        if (type === 'onduty') {
          // 值班人员处调用
          this.mansList = []
          setTimeout(() => {
            this.checkChange(checkboxGroup)
          }, 100);
        }
        console.log('调用：', checkboxGroup, this.mansList)
        this.checkboxGroup = checkboxGroup;
     },
     open(){
         //初始点开弹框，默认选中第一条tree
        if(this.first){
            this.first = false;
            this.$nextTick(() => {
            this.handleNodeClick(this.data2[0]);
            this.$refs.tree.setCurrentKey(this.data2[0].id);  //调用setCurrentKey方法设置当前节点高亮
          });
        }
     },
	 empty(){
		 this.checkboxGroup = [];
		 this.searchText = '';
		 this.$nextTick(() =>{
		   this.handleNodeClick(this.data2[0]);
		   this.$refs.tree.setCurrentKey(this.data2[0].id);  //调用setCurrentKey方法设置当前节点高亮
		 });
   },
    checkChange(val) {
      this.checkboxData = val
      console.log('--我是分界线--------------',val, this.mans)
      // val.forEach(item => {
      //   if (this.mans.filter(el => el.id === item).length > 0 && this.mansList.filter(el => el.id === item).length === 0) {
      //     this.mansList.push(this.mans.filter(el => el.id === item)[0])
      //     // console.log('天选之人：', this.mans.filter(el => el.id === item)[0])
      //   }
      // })
    },
    // 默认选中值
    checkData(arr,name){
      if (arr.length>0) {
        setTimeout(()=>{
          this.treeId = '';
            let data = {
                searchText: name,
                page:  1,
                size: this.pageSize1
            };
            console.log(data)
            this.$api.contactorList(data).then(res => {
                console.log(res)
                if (res.errorcode != 0) {
                    this.$message({
                        message: res.msg,
                        type: "error"
                    });
                }
                this.mans = res.data.list;
                this.total1=res.data.totalCount;
            }).then(()=>{
              console.log('this.mans: ', this.mans);
              if (this.mans.find(v=>v.id == arr[0])){
                 this.checkboxGroup = arr
               }else{
                 this.checkboxGroup = []
                 this.$emit('appSjsDutyContactorVos')
                 this.$message({
                    message: "联系人已不存在通讯录中",
                    type: "error"
                });
               }
            })
        },600)
      }else{
        this.checkboxGroup = []
      }
    },
    // 删除当前所选值班联系人
    handleClose(tag) {
      // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      // this.checkboxGroup = this.checkboxGroup.filter(v=> tag.id != v.id )
    },
    // 初始化联系人
    initContactor(currentDuty, index){
      this.idx = index
      this.currentId = currentDuty.id
      this.getPhoneTree()
      if (!currentDuty.appSjsDutyContactorVos) {
        currentDuty.appSjsDutyContactorVos = []
      }
      if ( currentDuty.appSjsDutyContactorVos.length > 0 ) {
        this.checkboxGroup = currentDuty.appSjsDutyContactorVos.map(v=> { return v.id })
      }else{
        this.checkboxGroup = []
      }
    },
    getDayShift(type){
      console.log('this[', this.dutyArr1);
      if (type &&   this.dutyArr1.length == 0) {
        this.getOneByDate(1).then((res)=>{
          this.dutyArr1 = res
          if (this.dutyArr1.length>0) {
            this.initContactor(this.dutyArr1[0],0)
          }
        })
      }
    },
    // 获取当天值班
    getOneByDate(type) {
      return new Promise((reslove, reject) => {
        let data = {
          date: this.currentDate,
          type,
        };
        this.$api.getOneByDate(data).then((res) => {
          if (res.errorcode == 0) {
            console.log('res: ', res);
            reslove(res.data);
          }
        });
      });
    },
  },
  watch:{
    checkboxData(newV, oldV){
      // 获取当前选中值班所有联系人
      let cuttentContactors = []
      let dutyArr = this.radio2 == 0?this.dutyArr0:this.dutyArr1
        cuttentContactors = dutyArr.find(v=>v.id == this.currentId).hasOwnProperty('appSjsDutyContactorVos')?dutyArr.find(v=>v.id == this.currentId).appSjsDutyContactorVos:[]
        console.log('cuttentContactors: ', cuttentContactors);
        if (cuttentContactors.length>0) {
          oldV = cuttentContactors.map(v=> { return v.id } )
        }else{
          dutyArr[this.idx].appSjsDutyContactorVos = []
          oldV = []
        }
      if (newV.length>oldV.length) {
        let addData = [...newV].filter(x => [...oldV].every(y => y !== x))
        if (this.mans.filter(el => el.id === addData[0]).length > 0) {
          dutyArr[this.idx].appSjsDutyContactorVos.push(this.mans.filter(el => el.id === addData[0])[0])
          this.$forceUpdate()
        }
      }else{
        let delData = [...oldV].filter(x => [...newV].every(y => y !== x))
        dutyArr[this.idx].appSjsDutyContactorVos.splice(cuttentContactors.indexOf(cuttentContactors.find((el) => {
              return el.id == delData[0]
        })),1)
        this.$forceUpdate()
      }
    }
  }
}
</script>

<style scoped>
  .tree {
    height: 676px;
    background-color: white;
    border: 1px solid rgba(211, 215, 219, 1);
  }

  >>> .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  >>> .el-tree-node__content {
    margin-top: 14px;
  }

  >>> .treeDiv {
    width: 100%;
  }

  >>> .leftTree {
    display: inline-block;
    width: 70%;
    text-align: left;
  }

  >>> .rightTree {
    display: inline-block;
    width: 30%;
  }
  .selectInput{
    width:77%;
    margin-right: 15px;
  }
  .main{
    width: 100%;
    height: 570px;
    display: flex;
    justify-content : space-between;
    margin-top: 15px;

  }
  .left{
    width: 33%;
    height: 540px;
    border: 1px solid rgba(211, 215, 219, 1);
  }
  .right{
    width: 65%;
    height: 540px;
    border: 1px solid rgba(211, 215, 219, 1);
  }
  .page{
    position: absolute;
    right: 15px;
    bottom: 7px;
  }
  .el-checkbox{
    width:80%;
    margin: 15px;
  }
  .el-checkbox div{
    display: inline-block;
    overflow: hidden;
    text-overflow:ellipsis;
    vertical-align:top;
  }
  .el-checkbox div:first-child,.el-checkbox div:nth-child(2){
    width:150px;
  }
  .p_ {
    padding: 10px 30px 10px 30px;
    text-align: left;
  }
  .popoxwrap .el-dialog .el-dialog__body{
    padding: 20px;
  }
  .popoxwrap .dutyTitle{
    font-size: 17px;
    margin-bottom: 10px;
  }
  .popoxwrap .outDutyList{
    height: 612px;
    overflow: scroll;
    margin: 20px 0;
  }
  .popoxwrap .outDutyList .dutyList{
    height: 200px;
    overflow: scroll;
    padding: 10px;
    border: 1px solid #ccc;
  }
  .popoxwrap .outDutyList .dutyList .dutyName{
    text-align: center;
    font-size: 19px;
  }
  .popoxwrap .top .contactorTitle{
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    align-items: center;
  } 
  .popoxwrap .top .contactorTitle .contactorName{
    font-size: 17px;
  } 
  .popoxwrap .top .contactorTitle .close{
    font-size: 15px;
    cursor: pointer;
  } 
  >>> .el-tag{
    margin: 7px;
    padding-right: 0;
  }
  >>> .el-tag .el-tag__close{
    color: white;
    background-color: #0091ff;
    top: -17px;
    right: -7px;
  }
</style>
