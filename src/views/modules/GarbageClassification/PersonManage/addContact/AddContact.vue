<template>
  <div class="sms-tree">
    <el-dialog
      title="联系人选择"
      :visible.sync="dialogFormVisible"
      width="1060px"
      append-to-body
    >
      <el-row :gutter="20">
        <el-col :span="7">
          <address-group :list="modifiedUserList" :listProps="modifiedUserProps" @handleNodeClick="handleNodeClick"></address-group>
        </el-col>
        <el-col :span="10">
          <all-contact :dataList="platShareMenuList" @selectData="getSelectData" @searchResult="searchResult"></all-contact>
        </el-col>
        <el-col :span="7">
          <select-contact :allSelectData="allSelectData" :judge="judge" v-bind="$attrs" @changeDialog="closeDialogd" @initContact="initContact"></select-contact>
        </el-col>
      </el-row>

    </el-dialog>

    <el-dialog :visible.sync="delGroupView" width="410px" title="删除分组" center append-to-body>
      <div style="background-color: #fffada;padding: 5px 20px;margin-bottom: 40px;">
        <p>该分组包含多个子分组和联系人，删除该分组将同时移除该分组相关联系人。</p>
      </div>

      <p style="text-align:center;">是否删除该分组?</p>

      <div slot="footer" class="dialog-footer">
        <el-button @click="delGroupView = false">取 消</el-button>
        <el-button type="primary" @click="delGroupHandle">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="tipDialog" title="提示" center append-to-body class="tip_dialog">
      <div class="tip_content">
         <img src="../../../../../sinvieUI/img/dialog/hint_alert.svg" />
         <span class="tip_text">请勾选联系人后再选择发送</span>
        </div>
        <div class="footer">
          <sv-button @click="tipDialog=false" width="52px">取消</sv-button>
          <sv-button @click="tipDialog=false" type="primary" width="52px">确定</sv-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { treeDataTranslate } from "@/utils";
import AddressGroup from './AddressGroup';
import AllContact from './AllContact';
import SelectContact from './SelectContact';

export default {
  name: "save_template",
  inheritAttrs: false,
  components: {
    AddressGroup,
    AllContact,
    SelectContact,
  },
  data() {
    return {
      // 通讯录分组
      modifiedUserList: [],
      modifiedUserProps: {
        children: "children",
        label: "name"
      },

      // 通讯录人员
      search: '',
      selectedNode: [],
      platShareMenuList: [],
      pageSize: 2000,
      page: 1,
      selectAllData:[],

      dialogFormVisible: false,
      form: {
        region: [],
        name: "",
        desc: ""
      },
      value: "",
      tipDialog:false,
      //  保存模板参数  
      parentId: "",

      delGroupView: false,
      currentTreeId: [],

      allSelectData: [],//选中联系人

      currentCheck: [],//当前选中联系人

      judge: '',//判断点击的是联系人还是负责人
    };
  },
  mounted() {this.getTreeList()
  this.initContact()},
  created(){
    
  },
  watch:{
    currentCheck(newV,oldV){
      let delData = []
      if (newV.length>oldV.length) {
        newV = this.delRepy(newV)
       
        this.allSelectData = this.allSelectData.concat([...newV].filter(x => [...oldV].every(y => y.id !== x.id)))
      }else{
        newV = this.delRepy(newV)
         delData = [...oldV].filter(x => [...newV].every(y => y.id !== x.id)) //要删除的数据
        this.allSelectData = [...this.allSelectData ].filter(x => [...delData].every(y => y.id !== x.id))
      }
    } 
  },
  methods: {
    // 通讯录树型数据
    getTreeList() {
      
      this.currentCheck = []
      this.selectAllData = []
      this.selectedNode  =[]
      console.log("this.selectAllData",this.selectAllData)
      this.$http({
        url: this.$http.adornUrl('/garbage/garbageMemberGroup/list'),
        method: 'get',
      }).then(({ data }) => {
        // console.log(data)
          if(data && data.code == 0) {
            this.modifiedUserList = treeDataTranslate(data.data, 'id')
            
          }
      })
    },
     // 初始化通讯录人员
    initContact(page,pageSize){
      this.$http({
          url: this.$http.adornUrl(`/garbage/garbageMember/list`),
          method: 'POST',
          data: this.$http.adornData({
            limit: this.pageSize,
            page: this.page,
            groupIds: this.selectedNode,
            search: this.search
          })
        }).then(({ data }) => {
            if (data.code === 0) {
             // this.total = data.data.totalCount
              this.platShareMenuList = data.page.list
              // console.log('platShareMenuList++++++++++++++++++++++++++++++++++++++++++++',this.platShareMenuList)
            } else {
              this.$message.error(data.msg);
            }
        })
    },
     // 点击树形节点事件
    handleNodeClick (obj) {
     
      function findChilden (obj, list) {
        list.push(obj.id)
        let children = obj.children
        if (children != null) {
          children.forEach((item, index) => {
            findChilden(item, list)
          })
        }
      }

      // console.log('树形结点点击事件', obj.id)
      
      this.selectedNode = []

      findChilden(obj, this.selectedNode = [])
      // 查询树形关联的联系人
      this.initContact()
    },
    getDataList(receiverData) {
      // this.judge = type
     
      this.dialogFormVisible = true;
      setTimeout(()=>{
        if(receiverData){
          this.allSelectData = receiverData
        }
      })
    },
    getId(value) {
      this.parentId = value;
    },
    onSubmit() {
          this.currentCheck.forEach((item)=>{
        this.selectAllData.push(item.id)
      })
      console.log("this.selectAllData",this.selectAllData)
      if(this.selectAllData.length == 0)
      {
         this.tipDialog = true;
      }
      else{
      this.$http({
        url: this.$http.adornUrl("/garbage/garbageMember/sendCodeToGarbageMember"),
        method: "post",
        data: this.$http.adornData({
          // phone: this.allSelectData.map(v=>v.mobile1?v.mobile1:v.phone).join(''),
          // parentId: this.parentId?this.parentId:0,
          // name: this.form.name,/garbage/garbageMember/sendCodeToGarbageMember
          // userIds: this.allSelectData.map(v=>v.id).join(''),
          // messageGroup: [],
          // mailGroup: [],
          // id: -1,
          garbageMemberArray:this.selectAllData
        })
      }).then(({ data }) => {

        if (data && data.code == 0) {
          this.$message({
            message: "发送成功",
            type: "success"
          });
            this.getTreeList()
            this.initContact()
           this.dialogFormVisible = false
         // this.$root("getDataList",1)
          
          //   console.log('data.data++++++++++++++++++++++++++++++++++++++',data)
        }
      });
      this.$emit("addContact",this.allSelectData.map(v=>v.id))}
    },
    delView(currentTreeId) {
      this.delGroupView = true;
      this.currentTreeId = currentTreeId;
    },
    delGroupHandle() {
      this.$http({
        url: this.$http.adornUrl(`/message/messageGroup/delete`),
        method: "POST",
        data: this.$http.adornData(
          {
            ids: [this.currentTreeId]
          },
          false
        )
      }).then(({ data }) => {
        if (data && data.code == 0) {
          this.$emit("refreshData");
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        } else {
          this.$message({
            type: "info",
            message: "删除失败"
          });
        }
      });
    },
    getSelectData(val){
      this.currentCheck = val
   
  },
    searchResult(val){
      this.search = val
      this.initContact()
    },
    // 过滤选中的数据
    delRepy(filterData){
      for (let i = 0; i < filterData.length; i++) {
          if (filterData[i] === undefined) {
            filterData.splice(i, 1)
            i = i - 1          // i - 1 ,因为空元素在数组下标 2 位置，删除空之后，后面的元素要向前补位
          }
        }
        return filterData
    },
    // 关闭弹窗
    closeDialogd(){

      this.onSubmit()
    }
  }
};
</script>

<style scoped lang="scss">
// * {
//   margin: 0;
//   padding: 0;
// }

.tip_dialog{
  /deep/ .el-dialog{
    width:400px;
    height:200px;
    font-size: 14px;;
    .el-dialog__header{
      text-align:left;
      height:40px;
      line-height:40px;
      background-color: #F1F4F6;
      color:#333333;
      display: flex;
      .el-dialog__title{
       font-size:14px;
       color:#333333;
      }
      .el-dialog__headerbtn{
        top:0px;
      }
    }
    .el-dialog__body{
      padding:0px;
    }
  }
  .tip_content{
    height:110px;
    padding:30px 70px;

  .tip_text{
  
  
    color:#555555;
  }
  }
  .footer{
    border-top:1px solid #F2F2F2;
    padding:10px 20px;
    text-align: right;
  }
}
.el-form-item {
  margin: 10px 0;
}

.serchWrap {
  padding: 8px 10px;
  height: 50px;
  // min-height: 60px;
  // height: 7vh;
  display: flex;
  justify-content: flex-end;
  button {
    width: 25%;
    height: 35px;
    border-radius: 5px;
    background: rgb(14, 142, 190);
    color: #fff;
    border: none;
    font-size: 15px;
    border: 1px solid lightblue;
    /*font-family: "KatTi";*/
    /*letter-spacing: 5px;*/
  }
}
.el-select-dropdown__item {
  padding: 0 20px !important;
}
//  /deep/ .el-input{
//       width: 310px;
//   }

/deep/ .el-dialog {
  border-radius: 8px;
  .el-dialog__header {
    background-color: rgba(241,244,246,1) !important;
    padding: 10px 0;
    border-radius: 8px 8px 0 0;
    .el-dialog__title{
      font-size:14px;
    }
    .el-dialog__headerbtn {
      top: 12px;
      .el-dialog__close {
        color: rgba(173,182,194,1);
      }
    }
    span {
      color: #333333;
      padding-left: 20px;
    }
  }
}
.opertion{
  display: flex;
  justify-content: center;
  margin-top: 20px;
}


</style>
