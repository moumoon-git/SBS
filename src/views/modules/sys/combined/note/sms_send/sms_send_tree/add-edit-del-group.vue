<template>
  <div class="sms-tree">
    <el-dialog
      :title="form.name?'联系人分组修改':'联系人分组新增'"
      :visible.sync="dialogFormVisible"
      width="820px"
      append-to-body
      center
    >
      <el-form ref="form" :model="form" label-width="82px">
        <el-form-item label="联系人分组">
          <el-input v-model="form.name" style="width:310px;"></el-input>
        </el-form-item>
        <el-form-item label="所属分组">
          <el-select v-model="value" placeholder="请选择分组" @change="getId" style="width:310px;" clearable>
            <el-option
              v-for="item in form.region"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <el-row :gutter="20">
        <el-col :span="7">
          <address-group :list="modifiedUserList" :listProps="modifiedUserProps" @handleNodeClick="handleNodeClick"></address-group>
        </el-col>
        <el-col :span="10">
          <all-contact :dataList="platShareMenuList" @searchResult="searchResult" @currentId="getCurrentId" @allSelectData="getAllSelectData"></all-contact>
        </el-col>
        <el-col :span="7">
          <select-contact :allSelectData="allSelectData" @initContact="initContact"></select-contact>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" plain size="small">取 消</el-button>
        <el-button type="primary" @click="onSubmit" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="delGroupView" width="410px" title="删除分组" center append-to-body>
      <div style="background-color: #fffada;padding: 5px 20px;margin-bottom: 40px;">
        <p>该分组包含多个子分组和联系人，删除该分组将同时移除该分组相关联系人。</p>
      </div>

      <p style="text-align:center;">是否删除该分组?</p>

      <div slot="footer" class="dialog-footer">
        <el-button @click="delGroupView = false" plain size="small">取 消</el-button>
        <el-button type="primary" @click="delGroupHandle" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { treeDataTranslate } from "@/utils";
import AddressGroup from './AddressGroup';
import AllContact from './AllContact';
import SelectContact from './SelectContact';
import bus from "@/views/common/js/eventBus";


export default {
  name: "save_template",
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


      dialogFormVisible: false,
      form: {
        region: [],
        name: "",
        desc: ""
      },
      value: "",
      //  保存模板参数  
      parentId: "",

      delGroupView: false,
      currentTreeId: [],

      allSelectData: [],//选中联系人
      currentCheck: [],//当前选中联系人

      groupId: '',//当前组Id
    };
  },
  mounted() {
    
  },
  created(){
    this.getTreeList()
  },
   watch:{
    // currentCheck(newV,oldV){
    //   let delData = []
    //   if (newV.length>oldV.length) {
    //     newV = this.delRepy(newV)
    //     this.allSelectData = this.allSelectData.concat([...newV].filter(x => [...oldV].every(y => y.id !== x.id)))
    //   }else{
    //     newV = this.delRepy(newV)
    //      delData = [...oldV].filter(x => [...newV].every(y => y.id !== x.id)) //要删除的数据
    //     this.allSelectData = [...this.allSelectData ].filter(x => [...delData].every(y => y.id !== x.id))
    //   }
    // } 
  },
  methods: {
    
    // 通讯录树型数据
    getTreeList() {
      this.$http({
        url: this.$http.adornUrl('/mail/mailgroup/list'),
        method: 'get',
      }).then(({ data }) => {
          if(data && data.code == 0) {
            this.modifiedUserList = treeDataTranslate(data.data, 'id')
            // console.log('this.modifiedUserList',this.modifiedUserList)
          }else {
            this.$message.error(data.msg);
          }
      })
    },
     // 初始化通讯录人员
    initContact(page,pageSize){
      this.$http({
          url: this.$http.adornUrl(`/mail/mailcontactor/list`),
          method: 'POST',
          data: this.$http.adornData({
            limit: this.pageSize,
            page: this.page,
            groupId: this.selectedNode,
            search: this.search
          })
        }).then(({ data }) => {
          // console.log(data.code)
            if (data.code== 0) {
              this.total = data.data.totalCount
              this.platShareMenuList = data.data.list
            }else {
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

      
      this.selectedNode = []

      findChilden(obj, this.selectedNode = [])
      // 查询树形关联的联系人
      this.initContact()
    },
    getDataList(obj) {
      this.allSelectData = []
      if(obj){
        this.form.name = obj.name;
        // console.log(obj)
        this.groupId = obj.id
      }
      this.dialogFormVisible = true;
      this.$http({
        url: this.$http.adornUrl("/message/messageGroup/listTree"),
        method: "post"
      }).then(({ data }) => {
        if (data && data.code == 0) {
            // console.log('data.data++++++++++++++++++++++++++++++++++++++',data.data)
          this.form.region = data.data;
          this.value = this.form.region.find(v=> v.id === obj.parentId).name
          this.parentId = this.form.region.find(v=> v.id === obj.parentId).id
        }else {
          this.$message.error(data.msg);
        }
      });
      
      this.$http({
          url: this.$http.adornUrl(`/message/messageGroup/selectById`),
          method: 'get',
          params: this.$http.adornParams({
            limit: 2000,
            page: 1,
            id: obj.id,
            search: ''
          })
        }).then(({ data }) => {
          // console.log(data.code)
          if (data.code === 0) {
            this.allSelectData = data.page.list
            // console.log(this.allSelectData)
          }else {
            this.$message.error(data.msg);
          }
        })

      // this.handleNodeClick(this.modifiedUserList[0])
    },
    getId(value) {
      this.parentId = value;
    },
    onSubmit() {
      this.$http({
        url: this.$http.adornUrl("/message/messageGroup/saveMessageContactorGroup"),
        method: "post",
        data: this.$http.adornData({
          phone: this.allSelectData.map(v=>v.mobile1?v.mobile1:v.phone).join(','),
          parentId: this.parentId?this.parentId:0,
          name: this.form.name,
          userIds: this.allSelectData.map(v=>v.id).join(','),
          messageGroup: [],
          mailGroup: [],
          id: this.groupId || -1,
        })
      }).then(({ data }) => {
        if (data && data.code == 0) {
          this.$message({
            message: "保存分组成功",
            type: "success"
          });
          this.dialogFormVisible = false;

          this.$emit("getDataList",1)
        }else {
          this.$message.error(data.msg);
        }
      });
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
          this.$emit("getDataList",1)
        } else {
          this.$message.error(data.msg);
        }
        this.delGroupView = false
      });
    },
    // getSelectData(val){
    //   this.currentCheck = val
    // },
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
    // 获取当前选中的Id
    getCurrentId(obj){
      if (this.allSelectData.find(v=>v.id == obj.id)) {
        this.allSelectData = this.allSelectData.filter(x => x.id !== obj.id)
      }else{
        this.allSelectData.push(obj)
      }
    },
    getAllSelectData(value){
      this.allSelectData=value
    }
  }
};
</script>

<style scoped lang="scss">
// * {
//   margin: 0;
//   padding: 0;
// }
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

/deep/ .el-dialog__wrapper .el-dialog {
  border-radius: 8px;
  .el-dialog__header {
    background-color: #01a9f2 !important;
    padding: 10px 0;
    border-radius: 8px 8px 0 0;
    .el-dialog__headerbtn {
      top: 12px;
      .el-dialog__close {
        color: #d1f9fb;
      }
    }
    span {
      color: #d1f9fb;
    }
  }
}


</style>
