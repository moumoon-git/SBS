<template>
  <!-- 车辆黑名单信息 -->
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.carNum" placeholder="请输入车牌号搜索" clearable size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select clearable placeholder="请选择所属类型搜索" v-model="dataForm.controlTypeId" size="small">
          <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="pageIndex=1;getDataList()" type="primary"
      size="small">查询</el-button>
        <el-button v-if="isAuth('risk:riskvehiclealarm:save')" @click="addOrUpdateHandle()" type="primary"
      size="small">新增</el-button>
        <el-button v-if="isAuth('risk:riskvehiclealarm:delete')" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" type="primary"
      size="small">批量删除</el-button>
      <el-button type="primary" @click="exportgetter()">下载模板</el-button>
       <el-button type="primary">
        <el-upload
                action
                :http-request="uploadSectionFile"
                :show-file-list="false"
              >导入</el-upload>
              </el-button>
       <el-button type="primary" @click="exportSelectAll()">选择导出</el-button>
       <el-button type="primary" @click="exportAll()">全部导出</el-button>       
      </el-form-item>
    </el-form>
    <div style="width:100%;position:relative;">
      <!-- <div style="width:15%;min-width:320px;display:inline-block;">
        <riskvehicleblacklistTree
          :list="modifiedUserList"
          :listProps="modifiedUserProps"
          @handleNodeClick="handleNodeClick"
          @showTree="showEventType"
          @addTree="addEventType"
          @updateTree="updateEventType"
          
          @deleteTree="deleteEventType"
          @setCheckedIds="setCheckedIds"
          :Treeexpansion="Treeexpansion"
        >
        </riskvehicleblacklistTree>
      </div> -->
      <div style="width: 100%;min-width: 540px;">
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <!-- <el-table-column prop="id" header-align="center" align="center" label></el-table-column> -->
          <el-table-column prop="carNum" header-align="center" align="center" label="车牌号" width="120"></el-table-column>
          <el-table-column prop="carType" header-align="center" align="center" label="车辆类型" ></el-table-column>
          <el-table-column prop="owner" header-align="center" align="center" label="车主名称"></el-table-column>
          <el-table-column prop="phone" header-align="center" align="center" label="联系电话" width="140"></el-table-column>
          <el-table-column prop="controlTypeName" header-align="center" align="center" label="管控类型"></el-table-column>
          <el-table-column prop="remark" header-align="center" align="center" label="备注"></el-table-column>
          <!-- <el-table-column prop="type" header-align="center" align="center" label></el-table-column> -->
          <el-table-column header-align="center" align="center" width="150" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
              <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination style="margin-left:50%;transform: translateX(-50%);width:100%;"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>

      </div>
      
      
    </div>
     <el-dialog title="重复车辆" :visible.sync="dialogNumVisible" width="60%">
        <el-table 
        :data = "dataNumList">
        <el-table-column prop="carNum" header-align="center" align="center" label="车牌号" width="120"></el-table-column>
          <el-table-column prop="carType" header-align="center" align="center" label="车辆类型" ></el-table-column>
          <el-table-column prop="owner" header-align="center" align="center" label="车主名称"></el-table-column>
          <el-table-column prop="phone" header-align="center" align="center" label="联系电话" width="140"></el-table-column>
          <el-table-column prop="errorinfo" header-align="center" align="center" label="错误类型"></el-table-column>
          <el-table-column prop="remark" header-align="center" align="center" label="备注"></el-table-column>
          </el-table>
     </el-dialog>
    <!-- 树状, 查看，修改-->
    <el-dialog :title="dialogtitle" :visible.sync="dialogVisible" width="40%">
      <el-form  :modal="treeForm" ref="treeForm">
        <el-form-item label="分组名称" size="large" label-width="100px">
          <el-input
            :readonly="groupingdisabled"
            placeholder="请输入内容"
            v-model="treeForm.currentTreename"
            clearable
            style="margin-bottom: 10px"
          >
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="分组类型" size="large" label-width="100px">
           <el-select v-model="treeForm.type" placeholder="请选择">
              <el-option v-for="item in typeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </el-form-item> -->
        <el-form-item label="分组描述" size="large" label-width="100px">
          <el-input
            placeholder="分组描述"
            v-model="treeForm.groupingdescription"
            clearable
            :readonly="groupingdisabled"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="dialogtitle==='修改分组'">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submittingbygroups">确 定</el-button>
      </span>
    </el-dialog>
    
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList()" :type-data=typeData></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './riskvehicleblacklist-add-or-update'
import riskvehicleblacklistTree from './riskvehicleblacklist-tree'
import Cookies from "js-cookie";
var token = document.cookie;
var httpaddress = window.SITE_CONFIG.baseUrl;
export default {
  data () {
    return {
      dataForm: {
        key: '',
        controlTypeId: '',
        carNum: ''
      },
      dataNumList:[],
      dialogNumVisible:false,
      typeData: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      // 树形
      modifiedUserList: [],
      modifiedUserProps: {
        children: 'children',
        label: 'name'
      },
      Treeexpansion: false,
      // 修改||查看分组弹出框
      dialogVisible: false,
      // 修改分组或者查看分组
      dialogtitle: '',
      treeForm: {
        // 分组名字
        currentTreename: '',
        // 分组描述
        groupingdescription: '',
        type: 0
      },
      // 修改||查看分组Form表单是否可用
      groupingdisabled: false,
    }
  },
  components: {
    AddOrUpdate,
    riskvehicleblacklistTree
  },
  created () {
    this.handleEventType();
    this.getDataList();
  },

  methods: {
    uploadSectionFile(param) {
      let form = new FormData();
      // console.log('parma////////', param)
      form.append("file", param.file);
      this.$http({
        url: this.$http.adornUrl(`/risk/riskvehicleblacklist/input-excel`),
        method: "post",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: form,
      })
       
        .then(({ data }) => {
          console.log("data.data",data)
          // if (data && data.code === 0) {
            
          //   if(data.data.length == 0)
          //    {
          //        this.$message({
          //     message: "导入成功!",
          //     type: "success",
          //   });
          //    }
          //    else{
          //       this.$message.error("有重复名单");
          //       this.dialogNumVisible=true;
          //       this.dataNumList = data.data;
          //    }
          //   this.dataForm.enclosure = data.filePath;
          //   this.dataForm.fileName = data.fileName;
          //   // 上传成功重新请求数据渲染页面
          //   // this.$emit('planData')
          //   this.getDataList();
          // } else {
          //   this.$message.error("导入失败,请检查文件格式");
          // }

          if (!data.code && data.errorData.length == 0) {
            this.$message({
              message: `${data.msg}`,
              type: "success",
            });
            this.dataForm.enclosure = data.filePath;
            this.dataForm.fileName = data.fileName;
            // 上传成功重新请求数据渲染页面
            this.getDataList();
          }
          else if(!data.code && data.errorData.length !=0){
            // this.$message.error(`${data.msg}`);
            let str = document.createElement('div')
            data.errorData.forEach(item=>{
              let cdiv = document.createElement('div')
              cdiv.innerHTML = item.errorMsg;
              cdiv.style.marginTop = "10px"
              str.appendChild(cdiv);
            })
            this.$message({
              dangerouslyUseHTMLString: true,
              message: `<div>${data.msg}</div>${str.innerHTML}`,
              type: 'error'
            })
          }  
          else {
            this.$message.error("导入失败,请检查文件格式");
          }
        })
        .catch((err) => {
          // alert(err)
        });
    },
      //导出模板
    exportgetter() {
      let httpaddress = window.SITE_CONFIG.baseUrl;
      let token = document.cookie;
      let exportEx = this.currentTreeObject;
      // console.log('tokentoken',Cookies.get('token'),httpaddress)
      // console.log(
      //   `${httpaddress}//mail/mailgroup/gettemplate?gId=${exportEx}&token=${this.$cookie.get('token')}`
      // )
      // window.open(`${httpaddress}/mail/mailgroup/gettemplate?gId=${exportEx}&token=${Cookies.get('token')}`)
      window.location.href = `${httpaddress}/risk/riskvehicleblacklist/get-template?gId=${exportEx}&token=${Cookies.get(
        "token"
      )}`;
    },
    /**
      * @description: 选择导出
      * @param {*}
      * @return {*}
      */
     exportSelectAll(){
       let selectNode = []
       for(let i=0;i<this.dataListSelections.length;i++)
          selectNode.push(this.dataListSelections[i].id)
      this.$http({
        url: this.$http.adornUrl(
          "/risk/riskvehicleblacklist/xlsOutputSelect"
        ),
        method: "post",
        data: this.$http.adornData({
          checkedId: selectNode,
        }),
        responseType: 'arraybuffer'
      }).then(({ data }) => {
        if (this.dataListSelections.length < 1) {
          this.$message({
            message: "请选择相应数据进行导出",
            type: "warning",
          });
          return;
        } 
         if (navigator.msSaveOrOpenBlob) {
            // 兼容ie
            navigator.msSaveOrOpenBlob(new Blob([data], {type: 'application/vnd.ms-excel'}), '导出数据.xls')
        }else{
        let a = document.createElement('a')
        a.href = window.URL.createObjectURL(new Blob([data], {type: 'application/vnd.ms-excel'}))
        a.download = '导出数据.xls'
        document.body.appendChild(a)   // 兼容Firefox浏览器
        a.click()
        a.remove()}
      }).catch((err)=>{
        this.$message.error(data.msg);
      })

    },
 /**
  * @description: 全部导出
  * @param {*}
  * @return {*}
  */
   exportAll(){
     
      this.$http({
        url: this.$http.adornUrl(
          "/risk/riskvehicleblacklist/xlsOutputSelect"
        ),
        method: "post",
        data: this.$http.adornData({
          checkedId: [],
        }),
        responseType: 'arraybuffer'
      }).then(({ data }) => {
        // if (this.dataListSelections.length < 1) {
        //   this.$message({
        //     message: "请选择相应数据进行导出",
        //     type: "warning",
        //   });
        //   return;
        // } 
         if (navigator.msSaveOrOpenBlob) {
            // 兼容ie
            navigator.msSaveOrOpenBlob(new Blob([data], {type: 'application/vnd.ms-excel'}), '导出数据.xls')
        }else{
        let a = document.createElement('a')
        a.href = window.URL.createObjectURL(new Blob([data], {type: 'application/vnd.ms-excel'}))
        a.download = '导出数据.xls'
        document.body.appendChild(a)   // 兼容Firefox浏览器
        a.click()
        a.remove()}
      }).catch((err)=>{
        this.$message.error(data.msg);
      })

    },
 
     // 获取隐患类型
    handleEventType () {
      this.$http({
        url: this.$http.adornUrl(`/event/eventType/selectTypeList`),
        method: 'get',
        params: this.$http.adornParams({ typeFlag: 4})
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.typeData = data.list
        } else {
          this.$message.error(data.code)
        }
      })
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/risk/riskvehicleblacklist/list'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          key: this.dataForm.key,
          controlTypeId: this.dataForm.controlTypeId,
          carNum: this.dataForm.carNum
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.page.list.map(v=>{
              switch (v.carType){
                case "0":v.carType = '其它车型';
                break;
                case "1":v.carType = '客车';
                break;
                case "2":v.carType = '货车';
                break;
                case "3":v.carType = '轿车';
                break;
                case "4":v.carType = '面包车';
                break;
                case "5":v.carType = '小货车';
                break;
                case "6":v.carType = '行人';
                break;
                case "7":v.carType = '二轮车';
                break;
                case "8":v.carType = '三轮车';
                break;
                case "9":v.carType = 'SUV/MPV';
                break;
                case "10":v.carType = '中型客车';
                break;
              }
          })
          this.dataList = data.page.list
          
        // console.log( this.dataList)
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
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
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      var ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      // console.log(ids)

      this.$confirm(
        `确定对该车辆黑名单进行${id ? '删除' : '批量删除'}操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'

        }
      ).then(() => {
        this.$http({
          url: this.$http.adornUrl('/risk/riskvehicleblacklist/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    // 点击树形节点事件
    handleNodeClick (obj) {
      // console.log("handleNodeClick",obj)
      function findChilden (obj, list) {
        list.push(obj.id)
        let children = obj.children
        // console.log(list)
        if (children != null) {
          children.forEach((item, index) => {
            // console.log(item)
            findChilden(item, list)
          })
        }
      }
    
      // console.log('树形结点点击事件', obj)
      this.selectedNode = []
      this.currentTreeObject = obj.id
      this.treeForm.currentTreename = obj.name
      this.search = ''
      // 分组描述
      this.treeForm.groupingdescription = obj.remark
      this.treeForm.type = obj.type
      this.currentTreeplatformId = obj.platformId
      this.currentTreeparentId = obj.parentId
      this.currentTreeancestors = obj.ancestors
      this.currentTreeorderNum=obj.orderNum

      findChilden(obj, this.selectedNode = [])

      // console.log('selectedNode:' + this.selectedNode)
      // console.log(this.currentTreeObject)
      // console.log(this.treeForm.currentTreename)
      // 查询树形关联的联系人
      this.$http({
        url: this.$http.adornUrl(`/risk/riskcamera/list`),
        method: 'POST',
        data: this.$http.adornData({
          key:this.dataForm.key,
          cameraType:this.cameraType,
          limit: this.pageSize,
          page: 1,
          groupId: this.selectedNode
        })
      }).then(({ data }) => {
        // console.log(data)
        this.totalCount = data.data.totalCount
        this.currPage = data.data.currPage
        this.pageSize = data.data.pageSize
        this.platShareMenuList = data.data.list
      })
    },
    // 查看分组
    showEventType () {
      this.dialogVisible = true
      this.dialogtitle = '查看分组'
      this.groupingdisabled = true
    },
    // 添加分组
    addEventType () {
      this.eventtypeAddOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.eventtypeAddOrUpdate.init(null, null, 2) // 代表新增
      })
    },
    // 修改分组名称
    updateEventType (rows) {
      // console.log(this.treeForm.currentTreename)
      this.dialogVisible = true
      this.dialogtitle = '修改分组'
      this.groupingdisabled = false
    },
    

    // 删除分组
    deleteEventType (ids) {
      var that = this
      this.$confirm(`确定对进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var checkedNames = ''
        if (that.checkedNodes.length > 0) {
          that.checkedNodes.forEach(item => {
            if (item.system === 1) {
              checkedNames += item.name
            }
          })
        }

        setTimeout(() => {
          if (checkedNames) {
            that.$message({
              message: `${checkedNames}删除失败`,
              type: 'error',
              duration: 1500
            })
            return 0
          }
          that.$http({
            url: that.$http.adornUrl(
            `/risk/riskcameragroup/delete`
          ),
            method: 'POST',
            data: this.$http.adornData({
              ids:that.checkedIds
            })
          // data: that.$http.adornData(id)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              that.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              that.getDataList()
            } else {
              that.$message.error(data.msg)
            }
          })
        })
      })
    },
    // 树形复选框勾选ID
    setCheckedIds (checkedIds, checkedNodes) {

      this.checkedIds = checkedIds
      // console.log('this.checkedIds', this.checkedIds)
      this.checkedNodes = checkedNodes
    },
    // 分组修改提交
    submittingbygroups () {
      if (!this.treeForm.currentTreename) {
        this.$message.error('分组名称不能为空')
      } else {
        this.dialogVisible = false
        this.$http({
          url: this.$http.adornUrl(`/risk/riskcameragroup/update`),
          method: 'post',
          data: this.$http.adornData({
            id: this.currentTreeObject,
            name: this.treeForm.currentTreename,
            parentId:this.currentTreeparentId,
            ancestors:this.currentTreeancestors,
            orderNum:this.currentTreeorderNum,
            remark: this.treeForm.groupingdescription
          })
        }).then(({ data }) => {
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        })
      }
    }

  }
  
}
</script>
