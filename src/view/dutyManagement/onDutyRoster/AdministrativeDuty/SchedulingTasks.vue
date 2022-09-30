<template>
<!-- 选择人员弹窗 -->
  <el-dialog :title="selectTitle" width='800px' class="popoxwrap" :visible.sync="selectData" append-to-body :close-on-click-modal="false" :before-close="closeDialog"
    >
      
      <div class="main">
         <div class="left">
              <el-scrollbar style="height: 100%">
                <div v-if="groupData.length > 0">
                  <!-- <el-checkbox-group  v-model="checkboxGroup" @change="checkGroupChange"> -->
                    <div class="allGroup" v-for="item in groupData" :label="item.id" :key="item.id">
                      <div @click.stop="initContact(item)" :style="{'padding': '5px', 'cursor': 'pointer', 'background-color': currentContactorId == item.id?'#ccc':undefined}">{{item.contactorGroupName}}</div>
                    </div>
                  <!-- </el-checkbox-group> -->
                </div>
                <div class="p_" v-else>
                  <span>暂无数据</span>
                </div>
              </el-scrollbar>
          <el-button type="primary" @click="addMans" style="margin-top:20px;">下发</el-button>
        </div>

         <div class="right">
           <div class="top">
              <el-input type="input"  placeholder="输入姓名/单位/职位/号码" v-model="searchText" class='selectInput'></el-input>
              <el-button type="primary" @click="query()">查询</el-button>
            </div>
            <div style="border: 1px solid rgba(211, 215, 219, 1);margin-top: 37px;">
              <div class="groupData">
                <el-scrollbar style="height: 100%">
                  <div v-if="mans && mans.length > 0">
                    <el-checkbox-group  v-model="checkContact" :max='1' @change="checkContactChange" style="display:flex;flex-wrap: wrap;">
                      <el-checkbox class="checkbox" v-for="item in mans" :label="item.id" :key="item.id" >
                          <div style="width:110px;">{{item.name}}</div>
                          <div style="width:110px;">{{item.position?'('+item.position + ')':""}}</div> 
                      </el-checkbox>
                    </el-checkbox-group>
                  </div>
                  <div class="p_" v-else>
                    <span>暂无数据</span>
                  </div>
                </el-scrollbar>
              </div>

              <div class="history">
                <div class="historyTitle">
                  历史记录：
                </div>
                <div class="allHistory" v-if="historyData.length>0">
                  <el-checkbox-group  v-model="checkHistory" style="display:flex;flex-wrap: wrap;">
                      <el-checkbox class="checkbox" v-for="(item,index) in historyData" :label="item" :key="index" :disabled="checkHistory.length>0?!!(checkHistory.find(v=> (v.contactorId != item.contactorId) && (v.groupId == item.groupId))):(checkContact.length>0?!!(mans.filter(v=> v.id == checkContact[0]).find(v=> (v.id != item.contactorId) && (v.groupId == item.groupId))):false)">
                        <div style="width:110px;">{{item.contactorName}}</div>
                          <div style="width:110px;">{{item.groupName?'('+item.groupName + ')':""}}</div> 
                      </el-checkbox>
                    </el-checkbox-group>
                </div>
                <div class="p_" v-else>
                    <span>暂无数据</span>
                </div>
              </div>

              <div class="allCheckData">
                <template v-if="mansList.length>0">
                  <el-tag
                    :key="index"
                    v-for="(tag,index) in mansList"
                    closable
                    :disable-transitions="false"
                    @close="delContactor(tag)">
                    {{tag.contactorName}}
                  </el-tag>
                </template>
                <div class="p_" v-else>
                  <span>暂无数据</span>
                </div>
              </div>
            </div>
        </div>
        <div class="page">
              <el-pagination :small="pagingSize1" :page-size="pageSize1" :total="total1"
              @current-change="pageChange"
              :current-page.sync="currentPage1"
              layout="total, prev, pager, next, jumper"></el-pagination>
        </div>
      </div>
  </el-dialog>
</template>
<script>
  export default {
    name: "selectMansDialog",
    props:['selectTitle','selectData','maxSelect', 'month'],//maxSelect 可限制选中联系人的个数，无限制可不传这个参数
    data() {
        return {
          defaultProps: {
            children: 'children',
            label: 'name',
          },
          searchText:'',
          data2:[],
          treeId:'',
          checkContact:[], // 顶部选中联系人
          checkboxGroup: [], // 选中组
          groupData: [],
          mans:[],
          total1: 0,//数据总数
          pageSize1: 10,//每页条数
          currentPage1: 1,//当前页数
          pagingSize1: true,  //分页大小
          first:true,//判断弹框是否是第一次进来
          mansList: [], // 选中的人员
          checkboxData: [], // 记录上次选中组中联系人
          historyData: [], // 历史数据
          checkHistory: [], // 选中历史数据
          currentGroupId: "", // 当前选中组Id
          currentContactorId: "", // 当前选中联系人Id
          isHistory: false, //判断是历史记录删除还是组联系人删除的数据
          delPreData: [], // 点击组中联系人删除的数据
          isDelCheck: false, //判断是否是复选框选中的删除
        }
      },
    mounted(){
      this.getDeduplicationList();
      this.initHistoryData()
    },
    methods: {
    // 初始化联系人
    initContact(obj){
      // console.log('obj: ', obj);
      this.currentGroup = obj
      this.currentContactorId = obj.id
      let data={
        groupId: obj.contactorGroupId,
        searchText: this.searchText,
        page:1,
        size:10000,
      };

      this.$api.contactorList(data).then((res) =>{
        if (res.errorcode == 0) {
          this.mans=res.data.list;
          if (this.mans.length>0) {
            this.mans.map(v=>{
              v.groupName = obj.contactorGroupName
              v.groupId = obj.contactorGroupId
            })
          }
          this.checkContact = obj.checkPeople
          // console.log('obj.checkPeople: ', obj.checkPeople);
          // console.log('this.checkContact: ', this.checkContact);
        }else{
          this.$message.error(res.msg)
        }
      })
    },
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
    // 获取历史数据
    initHistoryData(){
      let data={
         page: 1,
         size: 100000,
         date: this.month.formatDate("yyyy-MM"),
       };
       this.$api.contactorHistory(data).then((res) =>{
            console.log(res);
            if (res.errorcode!=0){
                  this.$message({
                    message:res.msg,
                    type:"error"
                  });
                  return;
             }
            this.historyData = res.data;
        })
    },
    getDeduplicationList(){
      // 渲染弹窗左侧列表
        console.log('this.month: ', this.month);
       let data={
         date: this.month.formatDate("yyyy-MM"),
       };
       this.$api.deduplicationList(data).then((res) =>{
            console.log(res);
            if (res.errorcode!=0){
                  this.$message({
                    message:res.msg,
                    type:"error"
                  });
                  return;
             }
            this.groupData = res.data;
            if (this.groupData.length>0) {
              this.groupData.map(v=>{
                v.checkPeople = []
              })
              this.handleNodeClick(this.groupData[0]);
            }
            // console.log('this.groupData: ', this.groupData);
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
    query(){
      // if (this.searchText) {
      //   this.mans = this.mans.filter(v=>v.name == this.searchText)
      // }else{
        if (this.checkContact.length>0) {
          this.initContact(this.groupData[this.groupData.indexOf(this.groupData.find( v => v.contactorGroupId == this.mans[0].groupId)) ])
        }else{
          this.initContact(this.currentGroup)
        }
      // }
     },
     //点击确定添加联系人
     addMans(){
        if(this.mansList.length == 0){
            this.$message({
              message: '您还未选择联系人',
              type: 'warning'
            });
        }else{
           this.$emit('issueHandle',this.mansList);
          //  console.log('this.mansList: ', this.mansList);
        }
     },
    checkContactChange(val) {
       let currentGroup = this.groupData.find(v=> v.contactorGroupId == this.currentGroup.contactorGroupId )
      if (this.checkContact.length>0) {
        let currentContactor = this.mans.find(v=> v.id == this.checkContact[0])
        console.log('currentContactor: ', currentContactor);
        // this.checkboxGroup.push(this.currentGroupId)
        this.groupData[this.groupData.indexOf(currentGroup)].checkPeople = this.checkContact
        if (this.historyData.length>0) {
          // console.log('this.checkContact: ', this.historyData);
          let currentHistory = this.historyData.find(v=> (v.contactorId == currentContactor.id) && (v.groupId == currentContactor.groupId))
          if (currentHistory) {
               this.checkHistory.push(currentHistory)
               this.isHistory = true 
              //  console.log('this.checkHistory: ', this.checkHistory);
          }else{
            this.mansList.push({contactorId: currentContactor.id, contactorMobile: currentContactor.mobile, contactorName: currentContactor.name, groupId: currentContactor.groupId})
          }
        }else{
          this.mansList.push({contactorId: currentContactor.id, contactorMobile: currentContactor.mobile, contactorName: currentContactor.name, groupId: currentContactor.groupId})
        }
      }else{
        if (this.historyData.length>0) {
          // this.checkboxGroup.splice(this.checkboxGroup.indexOf(this.currentGroupId),1)
          if (this.historyData.find(v=> (v.contactorId == this.checkboxData[0].id) && (v.groupId == this.checkboxData[0].groupId))) {
            this.checkHistory.splice(this.checkHistory.findIndex(v => (v.contactorId == this.checkboxData[0].id) && (v.groupId == this.checkboxData[0].groupId)),1)
            this.isHistory = true 
          }else{
            this.mansList.splice(this.mansList.indexOf(this.checkboxData[0]),1)
          }
        }else{
          this.mansList.splice(this.mansList.indexOf(this.checkboxData[0]),1)
        }
        this.groupData[this.groupData.indexOf(this.groupData.find( v=> v.contactorGroupId == this.checkboxData[0].groupId))].checkPeople = []
      }
      this.checkboxData = this.mans.filter(v=> v.id == val[val.length-1])
    },
    // 删除要发送的联系人
    delContactor(obj){
      console.log('obj: ', obj);
      this.isDelCheck = true
      this.delCheckData = [obj]
      let delData = null // 要删除的联系人
      this.checkboxGroup.splice(this.checkboxGroup.indexOf(this.currentGroupId),1)
      if (this.historyData.length>0) {
        delData = this.historyData.find(v=> v == obj)
        if (delData) {
          this.checkHistory.splice(this.checkHistory.indexOf(obj),1)
        }else{
          this.mansList.splice(this.mansList.indexOf(obj),1)
        }
      }else{
        this.mansList.splice(this.mansList.indexOf(obj),1)
      }
      let groupIdx = this.groupData.findIndex( v=> v.contactorGroupId ==Number(obj.groupId)) // 要删除的组索引值
      this.groupData[groupIdx].checkPeople = []
    } 
  },
  watch:{
    // checkboxGroup(newV, oldV){
    //   if (newV.length<oldV.length) {
    //     let delData = [...oldV].filter(x => [...newV].every(y => y !== x))
    //     if (delData[0] == this.currentGroupId)  {
    //       this.checkContact = []
    //     }
    //     this.groupData.find(v=> v.id == delData[0]).checkPeople = []
    //   }
    // },
    checkHistory(newV, oldV){
      // console.log('newV: ', newV);
      if (this.isHistory ) {
        if (newV.length>0) {
          this.delPreData[0] = newV[0]
          oldV = []
        }else{
          oldV = this.delPreData
        }
      }
      if (this.isDelCheck ) {
        oldV = this.delCheckData
      }
      // console.log('oldV: ', oldV);
      if (newV.length>oldV.length) {
        let addData = [...newV].filter(x => [...oldV].every(y => y !== x))
        // console.log('addData: ', addData);
        this.mansList.push(addData[addData.length-1])
        if (!this.isHistory) {
          this.groupData[this.groupData.findIndex(v=> v.contactorGroupId == addData[0].groupId)].checkPeople.push(Number(addData[addData.length-1].contactorId))
          // console.log('this.groupData: ', this.groupData);
          if (this.mans.length>0) {
            if (this.mans.find(v => v.groupId == addData[addData.length-1].groupId)) {
              this.checkContact.push(Number(addData[addData.length-1].contactorId))
            }
          }
        }
      }else{
        let delData = [...oldV].filter(x => [...newV].every(y => y !== x))
        console.log('delData: ', delData);
        this.mansList.splice(this.mansList.findIndex(v=>(v.contactorId == delData[delData.length-1].contactorId) && (v.groupId == delData[delData.length-1].groupId)),1)
        // console.log('delData: ', delData);
        // console.log('this.mans.: ', this.mans);
        if (!this.isHistory) {
          this.groupData[this.groupData.findIndex(v=> v.contactorGroupId == delData[delData.length-1].groupId)].checkPeople = []
          if (this.mans.length>0) {
            if (this.mans.find(v => v.groupId == delData[delData.length-1].groupId) != undefined) {
              // alert(this.mans.find(v => v.groupId == delData[delData.length-1].groupId) != undefined)
              this.checkContact = []
            }
          }
        }
      }
      this.isHistory = false
      this.isDelCheck = false
    },
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
  >>> .el-dialog__body {
    padding-top: 10px;
  }
  .checkbox{
    width: 33% !important;
    display: flex;
    align-items: center;
    margin: 0 !important;
    padding: 15px;
    box-sizing: border-box;
  }
  .checkbox >>> .el-checkbox__label {
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  .checkbox >>> .el-checkbox__label div{  
    width: 110px;
  }
  .selectInput{
    width:64%;
    margin-right: 15px;
  }
  .top{

  }
  .main{
    width: 100%;
    height: 570px;
    display: flex;
    justify-content : space-between;

  }
  .left{
    width: 33%;
    height: 540px;
    border: 1px solid rgba(211, 215, 219, 1);
    padding: 10px;
    box-sizing: border-box;
  }
  .right{
    width: 65%;
  }
  .history{
    height: 150px;
    padding: 10px;
    border-bottom: 1px solid rgba(211, 215, 219, 1);
    overflow: scroll;
  }
  .history .historyTitle{
    
  }
  .history .allHistory{
    
  }
  .history .allHistory .oneHistory{
    
  }
  .allCheckData{
    height: 140px;
    border-bottom: 1px solid rgba(211, 215, 219, 1);
  }
  .page{
    position: absolute;
    right: 15px;
    bottom: 20px;
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

  .groupData{
    border-bottom: 1px solid rgba(211, 215, 219, 1);
    height: 462px;
    height: 150px;
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
