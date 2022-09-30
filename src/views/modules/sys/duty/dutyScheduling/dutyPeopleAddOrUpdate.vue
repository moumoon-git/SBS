<template>
  <el-dialog class="dutyPeopleAddOrUpdate" :title="title" :before-close="handleClose" @close="visible=false;$parent.showcommonLink=false;chooseList=[];personList = [];nameList=[];total = 0" :visible.sync="visible" width="1100px" center append-to-body :close-on-click-modal="false">
    
    <el-row :gutter="20" style="margin-top:10px;">
      <el-col :span="8">
        <div  class="candidate" style="width: 100%;min-width: 100%;height: 540px;margin-top:0px;">
          <div class="header">
            <span style="font-weight: bold;font-size: 17px;">通讯录分组</span>
          </div>
          <div style="">
              <el-scrollbar wrap-class="list" wrap-style="max-height:485px;overflow: none;" view-class="view-box" :native="false">
                <el-tree
                  v-if="visible"
                  :data="treeData"
                  :props="treeProps"
                  @node-click="handelNodeClick"
                  ref="tree"
                  node-key="id"
                  style="padding-top: 10px;"
                  highlight-current
                  accordion
                  :default-expanded-keys="[indexKey]"
                  :filter-node-method="filterNode"
                ></el-tree>
              </el-scrollbar>
            </div>

          <!-- <el-tab-pane label="通讯联络网" name="first" style>
            <div style=" height:485px;border:1px solid rgba(229,229,229,1);background-color:#fff;">
              <el-scrollbar wrap-class="list" wrap-style="max-height:485px;overflow: none;" view-class="view-box" :native="false">
                <el-tree
                  v-if="visible"
                  :data="treeData"
                  :props="treeProps"
                  @node-click="handelNodeClick"
                  ref="tree"
                  node-key="id"
                  style="padding-top: 10px;"
                  highlight-current
                  accordion
                  :default-expanded-keys="[indexKey]"
                  :filter-node-method="filterNode"
                ></el-tree>
              </el-scrollbar>
            </div>
          </el-tab-pane> -->

        </div>
      </el-col>
      <el-col :span="8">
        <el-input v-model="search" placeholder="输入姓名搜索" @keyup.enter.native="onSearch" style="">
          <el-button slot="append" icon="el-icon-search" @click="onSearch" style="padding: 12px 12px;border-radius: 10px;"></el-button>
        </el-input>
        <div class="candidate" style="border-radius: 5px;border: 1px solid #ccc;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);">
          <div style="height: inherit;height:-webkit-fill-available;padding-bottom: 20px;overflow-y: auto;overflow-x: hidden;padding-right: 20px;padding-top: 10px;">
              <el-checkbox-group v-model="nameList">
                <el-checkbox
                v-for="person in personList"
                
                openId
                :label="person.id"
                :key="person.id"
                @change="nameChanged(person.id,person)"
                style="text-align: left;"
                >


                <!-- <div class="fuckyou" style="width:200px;background:pink;">{{ person.name }}</div> -->

                <el-collapse accordion >
                    <el-collapse-item>
                        <template slot="title" style="position:relative;">
                        <span style="margin-left:5%;">{{person.name}}</span> <span style="margin-left:5%;">{{person.position?person.position:'暂无'}}</span> <span style="margin-left:5%;white-space: nowrap;overflow:hidden;text-overflow:ellipsis;width: 90px;">{{person.workUnit?person.workUnit:'暂无'}}</span>
                        </template>
                        <div style="width:100%;position:relative;border: 1px solid #ebeef5;borderRadius: 4px;box-shadow:0 2px 12px 0 rgba(0,0,0,.1);padding:10px 10px;">
                          <!-- <img v-if="person.images" :src="person.images.indexOf('http')===-1?baseUrl+person.images:person.images" style="width:50px;height:50px;border-radius:50%;" alt=""> -->
                          <img  :src="person.images" style="width:50px;height:50px;border-radius:50%;" alt="">
                          <div style="display: inline-block;position: relative;top: -15px;left: 10px;"><span style="font-size: 18px;line-height: 18px;font-weight: bold;">{{person.name}}</span> <span style="font-size: 12px;line-height: 12px;margin-left:15px">{{person.position?person.position:'暂无'}}</span></div> 
                          <div style="margin-top: -30px;"><span style="font-size: 12px;line-height: 12px;margin-left:63px">{{person.workUnit?person.workUnit:'暂无'}}</span></div>
                          <div style="margin-top: 20px;">
                            <div style="position: relative;height: 20px;"><span style="font-size: 12px;line-height: 12px;position: absolute;left:10%;">手机:{{person.mobile1?person.mobile1:'暂无'}}</span> <span style="font-size: 12px;line-height: 12px;position: absolute;right:10%;">办公:{{person.officeTel?person.officeTel:'暂无'}}</span></div>
                            <div style="position: relative;height: 20px;"><span style="font-size: 12px;line-height: 12px;position: absolute;left:10%;">家庭:{{person.homeTel?person.homeTel:'暂无'}}</span> <span style="font-size: 12px;line-height: 12px;position: absolute;right:10%;">其他:{{person.otherTel?person.otherTel:'暂无'}}</span></div>
                            <div style="position: relative;height: 20px;"><span style="font-size: 12px;line-height: 12px;position: absolute;left:10%;">邮件:{{person.email?person.email:'暂无'}}</span> <span style="font-size: 12px;line-height: 12px;position: absolute;right:10%;">传真:{{person.fax?person.fax:'暂无'}}</span></div>
                          </div>
                        </div>
                        
                        
                    </el-collapse-item>
                </el-collapse>


                </el-checkbox>
            </el-checkbox-group>
            <el-pagination small @current-change="handleCurrentChange" :page-size="pageSize" :current-page="currentPage" layout="total, prev, pager, next" :total="total" style="margin-top:5px;"></el-pagination>
          </div>
          
        

        </div>
      </el-col>
      <el-col :span="8">
        <div class="candidate" style="height: 540px;margin-top:0px;">
          <div class="header">
            <span style="font-weight: bold;font-size: 17px;">已选联系人</span>
          </div>

          <div style="padding-left: 10px;margin-top: 10px;text-align: left;">
            <!-- <el-tag
              v-for="choose in chooseList"
              :key="choose.id"
              closable
              @close="chooseChanged(choose)"
              style="text-align: left;"
              >{{ choose.name }}</el-tag
            >-->
            <!-- 执行顺序 -->
            <el-table :data="chooseList" :show-header="false" highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
              <!-- <el-table-column type="selection" width="30px"></el-table-column> -->
              <!-- 当前项的索引值 -->
              <!-- <el-table-column :type="chooseList" width="55px"></el-table-column> -->
              <el-table-column prop="name" label="联系人名称" width="80px"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" :disabled="scope.$index===0" @click="moveUp(scope.$index,scope.row)">
                    <i class="el-icon-arrow-up"></i>
                  </el-button>
                  <el-button size="mini" :disabled="scope.$index===(chooseList.length-1)" @click="moveDown(scope.$index,scope.row)">
                    <i class="el-icon-arrow-down"></i>
                  </el-button>
                  <el-button class="el-icon-delete" style="color:#ff4949" size="mini" round @click="deleteEle(scope.row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="submit-btn">
          <el-button size="small" type="primary" @click="handleCommit" style="background: #409EFF!important;color:white;padding: 10px 25px;">确定</el-button>
        </div>
        <!--<el-button size="small" type="text" class="create-btn">新增联系人</el-button>-->
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { log } from 'util'
import draggable from 'vuedraggable'
import qs from 'qs'

export default {
  components: {
    draggable
  },
  props: ['dynamicTag'],
  data () {
    const data = [
      {
        id: 0,
        name: '联系人分组',
        children: null
      }
    ]
    return {
      selectGroupId: [],
      dataForm:{
        id:'',
        isLeader:1
      },
      isUpdate:false,
      title: '',
      visible: false, // 窗口是否可视
     
      search: '', // 搜索
      takethedata: '', // 部门所有信息
      topTreeID: '', // 部门ID
      topTreeName: '', // 当前选中的部门
      // 联系人分组树 数据
      treeData: JSON.parse(JSON.stringify(data)),
      // 子级显示的数据
      treeProps: {
        children: 'children', // 子树的名字
        label: 'name' // 树的名字
      },
      chooseList: [],
      personList: [], // 所有联系人对象数组
      nameList: [], // 选中联系人id数组
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页显示的条数
      indexKey: 0,
      name: '', // 当前触发该组件的事件
      baseUrl: window.SITE_CONFIG['baseUrl']+'/',
    }
  },
  methods: {
    
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getList () {
      this.$http({
        url: this.$http.adornUrl('/mail/mailcontactor/list'),
        method: 'post',
        data: this.$http.adornData({
          limit: this.pageSize,
          page: this.currentPage,
          search: this.search,
          groupId: this.selectGroupId,
        })
      }).then(({ data }) => {
        // console.log(data)

        if (data && data.code === 0) {
          // 详细联系人列表
          // console.log("获取联系人",data)
          this.personList = data.data.list
          this.total = data.data.totalCount

        }else{
            this.$message.error(data.msg)
          }
      })
    },
    handleCurrentChange (val) {
      // console.log(val)
      this.currentPage = val
      this.getList()
    },
    onSearch () {
      this.currentPage = 1
      this.getList()
      this.$refs.tree.filter(this.search)
    },
    // 点击确认触发的事件
    handleCommit () {
      if (this.chooseList === '' || this.chooseList === null) {
        this.$message({
          message: '请选择',
          type: 'warning'
        })
      } else {
        let data = {
          linkman: this.chooseList,
          name: this.name
        }
        console.log('this.chooseListthis.chooseList',this.chooseList,this.chooseList)
        var contactorIds=[]
        this.chooseList.forEach(item=>{
          contactorIds.push(item.id)
        })
        // contactorIds=contactorIds.join()
        var contactorsList=[]
        contactorIds.forEach(item=>{
          contactorsList.push({
            "id":this.isUpdate?this.dataForm.id:'0',
            "mailContactorId":item,
            "isLeader":this.dataForm.isLeader
          })
        })
        console.log("contactorsListcontactorsListcontactorsList",contactorsList)
        this.$http({
          url: this.$http.adornUrl('/duty/shift/contactor/setting/saveList'),
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: qs.stringify({
            "data": this.$http.adornData(contactorsList,false)
          }),
        }).then(({ data }) => {
          

          if (data && data.code === 0) {
            // 详细联系人列表
            // console.log("保存更新联系人",data)
            this.$message({
              message: '保存成功!',
              type: 'success'
            })
            this.visible=false;
            this.$parent.showcommonLink=false;
            this.total = 0
            this.personList = []
            this.chooseList = []
            this.nameList=[]
            this.$emit('getMembers')
          }else{
            if (data.data && data.data.length) {
              let errorInfo = '保存失败！';
              data.data.forEach((man) => {
                errorInfo += `${man.isLeader ? '值班领导' : '普通成员'}${man.name}已存在。`;
              });
              this.$message.error(errorInfo);
            } else {
              this.$message.error(data.msg);
            }
          }
        })

      }
    },

    nameChanged (id,person) {
        // console.log("选中的人信息为",person)
      let index = this.nameList.indexOf(id) // 判断是复选框取消选项还是选中选项
      if (index == -1) {
        // 该名字从选中项中删除
        for (let i in this.chooseList) {
          if (this.chooseList[i].id == id) {
            this.chooseList.splice(i, 1)
            break
          }
        }
      } else {
        // 该名字添加到选中项中
        for (let i in this.personList) {
          if (this.personList[i].id == id) {
            let data = JSON.parse(JSON.stringify(this.personList[i])) // 复制姓名列表中的对象保存在选中人对象数组中
            data.verify = this.topTreeName
            data.groupId = this.topTreeID // 当前所属部门id
            this.chooseList.push(data)
            return
          }
        }
      }
    },
    // 点击树节点触发事件
    handelNodeClick (data) {
      this.topTreeName = data.name
      let id = data.id
      this.takethedata = data
      this.topTreeID = id
      this.search = ''
      this.handleHTTPNodeData(data)
    },
    // 点击子节点 获取数据
    handleHTTPNodeData (obj) {
      function findChilden (obj, list) {
        list.push(obj.id)
        let children = obj.children
        if (children != null) {
          children.forEach((item, index) => {
            findChilden(item, list)
          })
        }
      }
      let selectedNode = []
      findChilden(obj, selectedNode)
      this.selectGroupId = selectedNode;
      // 获取联系人请求
      this.$http({
        url: this.$http.adornUrl('/mail/mailcontactor/list'),
        method: 'post',
        data: this.$http.adornData({
          limit: this.pageSize,
          page: 1,
          groupId: selectedNode
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // 详细联系人列表
          // console.log("点击获取通讯录人员",data)
          this.personList = data.data.list
          this.total = data.data.totalCount
          this.personList.forEach(element=>{
            if(element.images&&element.images.search("http")!=-1){
                var ImgObj = new Image();
                ImgObj.src=element.images
                setTimeout(()=>{
                  //没有图片，则返回-1  
                  if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {  
                    
                  } else {  
                    element.images=require(`../../../../../assets/img/nophoto.jpg`)  //nophoto.jpg
                  }
                  
                },1000)
              } else{
                element.images = window.SITE_CONFIG.baseUrl + '/' + element.images
                ImgObj = new Image();
                ImgObj.src=element.images
                setTimeout(()=>{
                  //没有图片，则返回-1  
                  if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {  
                    
                  } else {  
                      element.images=require(`../../../../../assets/img/nophoto.jpg`)  //nophoto.jpg
                  }
                  
                },1000)
              }
          })

        }else{
          this.$message.error(data.msg)
        }
      })
      // getList("/emergency/preparation/contactor/getList", datas).then(res => {
      //   if (res) {
      //     this.personList = res.data;
      //     this.total = res.totalElements;
      //   }
      // });
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
        .then(_ => {
            // console.log("this.$parent",this.$parent)
            this.visible=false
            this.$parent.showcommonLink=false
            this.nameList=[]
            this.personList = []
            this.chooseList=[]
            this.total = 0
            done();
            
        })
        .catch(_ => {});
    },
    // 点击添加联系人事件
    handleAddContacts (url, title, name) {
      this.title = title || '联系人选择'
      this.name = name
      // 获取联系人部门请求
      this.visible = true
      this.$http({
        url: this.$http.adornUrl(url),
        method: 'get',
        param: this.$http.adornParams()
      }).then(({ data }) => {
        // data 是获取到的所有数据
        if (data && data.code === 0) {
          // console.log("获取通讯录人员",data)
          this.treeData[0].children = data.data
          // this.handleHTTPNodeData();
          if (this.dynamicTag) {
            this.chooseList = JSON.parse(JSON.stringify(this.dynamicTag))
            let arrays = []
            this.dynamicTag.forEach(function (data) {
              arrays.push(data.id)
            })
            this.nameList = arrays
          }
        }else{
          this.$message.error(data.msg)
        }
      })
    },

    dynamicTags () {
      this.chooseList = []
      this.personList = []
      this.nameList = []
    },
    deleteEle (ele) {
      this.chooseList.splice(this.chooseList.indexOf(ele), 1)
      let index = this.nameList.indexOf(ele.id)
      if (index !== -1) {
        this.nameList.splice(index, 1)
      }
    },
    // 选择复选框数据
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 上移
    moveUp (index, row) {
      var that = this
      if (index > 0) {
        let upDate = that.chooseList[index - 1]
        that.chooseList.splice(index - 1, 1)
        that.chooseList.splice(index, 0, upDate)
      } else {
        alert('已经是第一条，不可上移')
      }
    },
    // 下移
    moveDown (index, row) {
      var that = this
      if (index + 1 === that.chooseList.length) {
        alert('已经是最后一条，不可下移')
      } else {
        let downDate = that.chooseList[index + 1]
        that.chooseList.splice(index + 1, 1)
        that.chooseList.splice(index, 0, downDate)
      }
    }
  }
}
</script>

<style scoped>
.el-input >>> .el-input__inner {
  padding: 0 4px;
}

.candidate {
  height: 500px;

  background-color: #fff;
  color: #303133;
  margin-top: 4px;
  border-radius: 10px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.selected {
  min-height: 380px;
}

.submit-btn {
  margin-top: -60px;
  text-align: center;
  
}

.create-btn {
  float: right;
  margin: 10px;
}

.el-checkbox-group >>> .el-checkbox {
  display: block;
  margin-top: 5px;
  margin-left: 10px;
}

.el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.el-scrollbar >>> .el-scrollbar__wrap {
  overflow-x: hidden;
}

.el-tree {
  min-width: 100%;
  display: inline-block !important;
}

.el-tree--highlight-current
  >>> .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #c0c0c0;
}

.header {
  border-bottom: 1px solid #ebeef5;
  box-sizing: border-box;
  padding: 12px 0px;
  color: #303133;
  font-size: 14px;
  text-align: center;
}
.el-scrollbar {
  height: 480px;
}

</style>
<style lang="less">
.dutyPeopleAddOrUpdate{
    .el-dialog{
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      margin-top:initial!important;
      min-width: 659px;
      border-radius: 10px;
        // overflow: hidden;
    }
      
        
        .el-dialog__header{
            // box-sizing: border-box!important;
            background:#409EFF!important;padding:17px!important;
            // padding-bottom: 5px!important;
            border-radius: 10px 10px 0px 0px!important;
            text-align: initial;
        }

        .el-dialog__title{
            margin-left: 10px;
            color: white!important;
        }
        .el-dialog__headerbtn{
            top: initial!important;
        }
        .el-dialog__close{
            color: white!important;
           
            
        }
        .el-checkbox__label{
            width:94%;
        }
        
        .el-checkbox{
            position: relative!important;
            .el-checkbox__input{
                position: absolute!important;
                top: 18px!important;
            }
          
            .el-checkbox__label{
                margin-left: 13px!important;
            }
        }

        .el-checkbox.is-checked{
            position: relative!important;
            .el-checkbox__input.is-checked{
                position: absolute!important;
                top: 18px!important;
            }
        
            .el-checkbox__label{
                margin-left: 13px!important;
            }
        }

        .el-checkbox.is-disabled{
            position: relative!important;
            
            .el-checkbox__input.is-disabled{
                position: absolute!important;
                top: 18px!important;
            }
            .el-checkbox__label{
                margin-left: 13px!important;
            }
        }

       
       
}
</style>